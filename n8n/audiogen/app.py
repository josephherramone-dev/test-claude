"""Free local text-to-audio service for the n8n shorts workflow.

Generates ambient sound and music from a text prompt using Stability AI's
open-weight Stable Audio models (no API credits). n8n calls:

    POST /generate {"prompt": "...", "seconds": 7, "out": "/home/node/.n8n-files/shorts/<job>/amb0.wav"}

and the WAV is written to the shared folder that n8n also mounts.
"""
import math
import os
import random
import threading
import time

import numpy as np
import soundfile as sf
import torch
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

MODEL_ID = os.getenv("AUDIO_MODEL", "stabilityai/stable-audio-open-small")
DATA_ROOT = os.path.realpath(os.getenv("DATA_ROOT", "/home/node/.n8n-files"))
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
IS_SMALL = "small" in MODEL_ID.lower()
torch.set_num_threads(int(os.getenv("TORCH_THREADS", str(os.cpu_count() or 4))))

app = FastAPI(title="audiogen")
_lock = threading.Lock()
_model = None
_cfg = None


def load_model():
    global _model, _cfg
    if _model is None:
        from stable_audio_tools import get_pretrained_model

        model, cfg = get_pretrained_model(MODEL_ID)
        _model, _cfg = model.to(DEVICE).eval(), cfg
    return _model, _cfg


class GenRequest(BaseModel):
    prompt: str = Field(..., min_length=3, max_length=1000)
    seconds: float = Field(7.0, gt=0, le=60)
    out: str
    negative_prompt: str = ""
    seed: int | None = None
    steps: int | None = None


@app.get("/health")
def health():
    return {"ok": True, "model": MODEL_ID, "device": DEVICE, "loaded": _model is not None}


@app.post("/generate")
def generate(req: GenRequest):
    out = os.path.realpath(req.out)
    if not out.startswith(DATA_ROOT + os.sep) or not out.endswith(".wav"):
        raise HTTPException(400, f"'out' must be a .wav path inside {DATA_ROOT}")

    from stable_audio_tools.inference.generation import generate_diffusion_cond

    t0 = time.time()
    with _lock:  # one generation at a time keeps RAM/CPU predictable
        model, cfg = load_model()
        sr = cfg["sample_rate"]
        full_size = cfg["sample_size"]
        max_seconds = full_size / sr
        seconds = min(req.seconds, max_seconds)

        sample_size = full_size
        if not IS_SMALL:
            # shorter request -> smaller canvas -> much faster (must stay a multiple of the model's block size)
            block = getattr(model, "min_input_length", 1) or 1
            sample_size = min(full_size, int(math.ceil(seconds * sr / block) * block))

        seed = req.seed if req.seed is not None else random.randint(0, 2**31 - 2)
        cond = {"prompt": req.prompt, "seconds_total": seconds}
        kwargs = dict(
            conditioning=[cond],
            sample_size=sample_size,
            device=DEVICE,
            seed=seed,
        )
        if IS_SMALL:
            # settings from the stable-audio-open-small model card
            kwargs.update(steps=req.steps or 8, cfg_scale=1.0, sampler_type="pingpong")
        else:
            cond["seconds_start"] = 0
            kwargs.update(steps=req.steps or 100, cfg_scale=7, sigma_min=0.3, sigma_max=500,
                          sampler_type="dpmpp-3m-sde")
            if req.negative_prompt:
                kwargs["negative_conditioning"] = [{"prompt": req.negative_prompt, "seconds_start": 0,
                                                    "seconds_total": seconds}]

        with torch.inference_mode():
            audio = generate_diffusion_cond(model, **kwargs)  # (batch, channels, samples)

    audio = audio[0].to(torch.float32).cpu().numpy()  # (channels, samples)
    audio = audio[:, : int(seconds * sr)]
    peak = float(np.max(np.abs(audio))) or 1.0
    audio = (audio / peak * 0.89).clip(-1, 1)  # peak-normalise to about -1 dBFS

    os.makedirs(os.path.dirname(out), exist_ok=True)
    sf.write(out, audio.T, sr, subtype="PCM_16")
    os.chmod(out, 0o666)  # n8n (another container user) must be able to read/delete it
    return {"path": out, "seconds": round(audio.shape[1] / sr, 2), "sample_rate": sr,
            "seed": seed, "model": MODEL_ID, "device": DEVICE, "took": round(time.time() - t0, 1)}
