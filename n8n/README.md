# WF6 FREE: Nature & Destination Shorts (Pexels + FFmpeg)

This is a free version of the KIE.ai Veo/Nano Banana workflow. It makes the same 4-destination vertical short with no image or video generation credits:

| Step | Before (paid) | Now (free) |
|---|---|---|
| Keyframes | Nano Banana Pro (KIE) | removed: no images needed |
| Clips | Veo 3.1 Quality (KIE): the expensive part | **Pexels Video API**, with **Pixabay** as fallback. Real 1080p–4K stock footage, royalty-free, OK for monetized channels |
| Stitch/edit | Creatomate (paid) | **FFmpeg** inside n8n |
| Music | Veo native audio | Your royalty-free tracks (YouTube Audio Library / Pixabay Music) |
| Hosting | Creatomate URL | **Google Drive** public link |
| Script | Claude via KIE | Claude via KIE (one cheap text call per video) |

## What the edit does (`Build Render Script`)
- Picks the best clip per scene: native vertical first, then 4K landscape (cropped with no quality loss). It never reuses a clip and skips the shaky first second.
- Crops to 1080×1920 at 30fps, applies a light colour grade (contrast and saturation), sharpening and a soft vignette.
- Shows the hook from frame 1 (works with sound off), an overlay line on each later scene and a location label. All text fades in and out and stays inside the TikTok/Shorts safe zones.
- Cross-dissolves between scenes and fades out at the end.
- Music is picked at random from the mood Claude chooses (`calm|uplifting|epic|emotional`), normalised to -14 LUFS, with a fade-in and a fade-out.
- Export: H.264 High, CRF 18, AAC 192k, `+faststart`. About 26 seconds total.

You can change the length, transition, fonts and paths at the top of the **Build Render Script** node.

## Setup
1. **Self-host n8n with FFmpeg.** n8n Cloud cannot run FFmpeg.
   ```bash
   cd n8n && docker compose up -d --build
   ```
   The compose file enables the Execute Command node (`NODES_EXCLUDE=[]`) and mounts `./music`.
   If you already run n8n another way, install `ffmpeg` in that container and set the same env vars.
2. **Import** `WF6-free-nature-shorts.json` into n8n.
3. **Pexels** (free key from pexels.com/api): create a Header Auth credential with Name `Authorization` and Value `YOUR_KEY` (no "Bearer"). Select it on *Search Pexels* and *Search Pexels (alt)*.
4. **Pixabay** (free key from pixabay.com/api/docs): create a Query Auth credential with Name `key` and Value `YOUR_KEY`. Select it on *Search Pixabay*.
5. **Music:** put `.mp3` files in `n8n/music/<mood>/`. Any file in `music/` is used if the mood folder is empty. With no music at all, the video gets a silent track.
6. **Google Drive:** add an OAuth2 credential on *Upload to Drive* and *Make Public*.
7. **Claude (KIE)**, **Google Sheets** and **Blotato** are set up the same way as before. Put your Blotato account IDs in the Instagram, TikTok and YouTube nodes.

Free limits: Pexels allows 200 requests/hour and 20,000/month. Each video uses 8 requests.
