# Free local text-to-audio (Stable Audio Open) for the shorts workflow.
FROM python:3.10-slim

RUN apt-get update && apt-get install -y --no-install-recommends libsndfile1 git \
 && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# CPU build of PyTorch by default (small image, runs anywhere).
# NVIDIA GPU: build with  --build-arg TORCH_INDEX=https://download.pytorch.org/whl/cu124
ARG TORCH_INDEX=https://download.pytorch.org/whl/cpu
RUN pip install --no-cache-dir torch==2.5.1 torchaudio==2.5.1 --index-url ${TORCH_INDEX}
RUN pip install --no-cache-dir stable-audio-tools==0.0.19 fastapi uvicorn soundfile

# Same uid as the n8n "node" user so both containers can read/write the shared render folder.
RUN useradd -u 1000 -m app \
 && mkdir -p /models /home/node/.n8n-files/shorts \
 && chown -R 1000:1000 /models /home/node/.n8n-files
COPY app.py .
USER app
ENV HF_HOME=/models PYTHONUNBUFFERED=1 DATA_ROOT=/home/node/.n8n-files
EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
