# WF6 FREE: Nature & Destination Shorts (Pexels + AI Sound + FFmpeg)

This is a free version of the KIE.ai Veo/Nano Banana workflow. It makes the same 4-destination vertical short with no image or video generation credits:

| Step | Before (paid) | Now (free) |
|---|---|---|
| Keyframes | Nano Banana Pro (KIE) | removed: no images needed |
| Clips | Veo 3.1 Quality (KIE): the expensive part | **Pexels Video API**, with **Pixabay** as fallback. Real 1080p–4K stock footage, royalty-free, OK for monetized channels |
| Stitch/edit | Creatomate (paid) | **FFmpeg** inside n8n |
| Sound | Veo native audio | **Generated from prompts, free**: local **Stable Audio Open** (`audiogen` container). Claude writes a sound prompt per scene and one score prompt; the AI generates them |
| Hosting | Creatomate URL | **Google Drive** public link |
| Script | Claude via KIE | Claude via KIE (one cheap text call per video) |

## What the edit does (`Build Render Script`)
- Picks the best clip per scene: native vertical first, then 4K landscape (cropped with no quality loss). It never reuses a clip and skips the shaky first second.
- Crops to 1080×1920 at 30fps, applies a light colour grade (contrast and saturation), sharpening and a soft vignette.
- Shows the hook from frame 1 (works with sound off), an overlay line on each later scene and a location label. All text fades in and out and stays inside the TikTok/Shorts safe zones.
- Cross-dissolves between scenes and fades out at the end.
- **Sound that matches the prompt.** Each scene gets its own generated ambience: waterfall roar, waves, wind, birds and so on, written by Claude for that exact shot. The ambiences cross-fade in sync with the picture. A generated cinematic score plays under them (looped smoothly if the model's cue is short). The mix is mastered to -14 LUFS, the platform standard. If one sound fails, that scene keeps the music. If music generation is off or fails, a track from `music/<mood>/` is used instead.
- Export: H.264 High, CRF 18, AAC 192k, `+faststart`. About 26 seconds total.

You can change the length, transition, fonts and paths at the top of the **Build Render Script** node.

## Setup
1. **Free sound model access.** Create a free account at huggingface.co, open `stabilityai/stable-audio-open-small` and accept the licence (it's free, including commercial use under $1M/year revenue). Then create a *Read* token.
   ```bash
   cd n8n && cp .env.example .env
   ```
   Put the token in `.env` as `HF_TOKEN=...`.
2. **Start n8n + FFmpeg + the sound generator.** n8n Cloud cannot run this.
   ```bash
   docker compose up -d --build
   ```
   The compose file enables the Execute Command node (`NODES_EXCLUDE=[]`) and starts `audiogen`, which n8n reaches at `http://audiogen:8000`. The first sound downloads the model (about 1 GB) once.
   - **CPU (default):** `stable-audio-open-small` makes each sound in roughly 10–40 s, so about 1–3 minutes of sound per video. It needs about 4 GB of RAM.
   - **NVIDIA GPU:** set `AUDIO_MODEL=stabilityai/stable-audio-open-1.0` for richer music (up to 47 s, no looping) and set `MUSIC_SECONDS = 30` in *Plan Audio*. Build with the CUDA torch index, as noted in docker-compose.yml.
3. **Import** `WF6-free-nature-shorts.json` into n8n.
4. **Pexels** (free key from pexels.com/api): create a Header Auth credential with Name `Authorization` and Value `YOUR_KEY` (no "Bearer"). Select it on *Search Pexels* and *Search Pexels (alt)*.
5. **Pixabay** (free key from pixabay.com/api/docs): create a Query Auth credential with Name `key` and Value `YOUR_KEY`. Select it on *Search Pixabay*.
6. **Music fallback (optional):** `.mp3` files in `n8n/music/<mood>/`. They are only used when `GENERATE_MUSIC = false` in *Plan Audio*, or when music generation fails.
7. **Google Drive:** add an OAuth2 credential on *Upload to Drive* and *Make Public*.
8. **Claude (KIE)**, **Google Sheets** and **Blotato** are set up the same way as before. Put your Blotato account IDs in the Instagram, TikTok and YouTube nodes.

Free limits: Pexels allows 200 requests/hour and 20,000/month. Each video uses 8 requests.

## Tuning the sound
- **Plan Audio** node: `GENERATE_MUSIC` and `MUSIC_SECONDS`. It also adds "natural field recording, no music" to each ambience prompt.
- **Build Render Script** node: `AMBIENCE_VOLUME` (0.85) and `MUSIC_VOLUME` (0.45). Raise the music for a more emotional cut, or lower it to put the natural sound first.
- To test the generator on its own:
  ```bash
  docker compose exec n8n wget -qO- --post-data '{"prompt":"ocean waves on rocks, seagulls","seconds":7,"out":"/home/node/.n8n-files/shorts/test/a.wav"}' --header 'Content-Type: application/json' http://audiogen:8000/generate
  ```
