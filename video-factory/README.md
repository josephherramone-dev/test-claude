# Free Video Factory ($0)

Automatic short-video factory on a Hostinger KVM2 VPS with Coolify + n8n.
Every paid piece of the original architecture is replaced by a free one.

```
HOSTINGER KVM2 + COOLIFY (24/7)
  n8n (boss) ── NocoDB (ideas + videos database)
   ├─ A. RESEARCH    RSS / Trends / Reddit → Gemini free → ideas
   ├─ B. PLAN+SCORE  Gemini (→ Groq → OpenRouter fallback): script, hook, scenes
   ├─ C. ROUTER      real-world scene → stock lane │ "wow" scene → AI lane
   │        MoneyPrinterTurbo / Pexels     Modal (API) + Kaggle (nightly batch): WAN / LTX
   ├─ D. ASSEMBLE    FFmpeg + Remotion + Kokoro/Edge TTS + faster-whisper captions
   ├─ E. QC          Gemini check → OK, or redo once
   └─ F. PUBLISH     16:9 / 9:16 / 1:1 → YouTube (+ IG / TikTok)
```

## Build phases

| # | Phase | Files | Status |
|---|-------|-------|--------|
| 0 | Free accounts and keys | – | ☐ |
| 1 | Foundation: MoneyPrinterTurbo + NocoDB in Coolify | `coolify/moneyprinterturbo.yml`, `nocodb/*.csv` | ☐ |
| 2 | Workflow A: research → ideas (daily) | `n8n/A-research-ideas.json` | ☐ |
| 3 | Workflow B: plan + score (every 2 h) | coming | ☐ |
| 4 | Generation lanes: stock, Modal API, Kaggle batch, hero folder | coming | ☐ |
| 5 | Renderer service + Workflow D: assemble + QC | coming | ☐ |
| 6 | Storage (Cloudflare R2) + Workflow F: publish | coming | ☐ |
| 7 | Monitoring: error workflow + Telegram alerts | coming | ☐ |

## Phase 0: free accounts

| Account | Used in | Where |
|---------|---------|-------|
| Google AI Studio (Gemini key) | Phases 1–5 | aistudio.google.com |
| Pexels API key | Phases 1, 4 | pexels.com/api |
| NocoDB API token | Phase 2+ | inside your NocoDB |
| Groq + OpenRouter keys (fallback brains) | Phase 3 | console.groq.com, openrouter.ai |
| Modal | Phase 4 | modal.com |
| Kaggle (phone-verified, for GPU) | Phase 4 | kaggle.com → Settings → API |
| Cloudflare (R2 storage, Workers AI images) | Phases 4, 6 | dash.cloudflare.com |
| Google Cloud project (YouTube upload OAuth) | Phase 6 | console.cloud.google.com |

## Phase 1: foundation

1. MoneyPrinterTurbo: Coolify → **+ New Resource → Docker Compose Empty** → paste `coolify/moneyprinterturbo.yml`, put your keys in, deploy.
2. NocoDB: Coolify → **+ New Resource → Service → NocoDB** → give it a domain → deploy → create your admin account.
3. In NocoDB create a base called `factory`, then **import** `nocodb/ideas.csv` as table `ideas`
   and `nocodb/videos.csv` as table `videos` (keep the column names exactly as they are).
4. Create an API token in NocoDB (account menu → **Tokens**), and copy the **table id** of `ideas`
   (open the table → **Details / APIs**; it starts with `m`).

## Phase 2: workflow A

1. n8n → **Workflows → Import from File** → `n8n/A-research-ideas.json`.
2. Open **Config** and fill: niche, language, Gemini key, NocoDB URL, token, ideas table id.
3. Optional: edit the RSS list in **Feed list**.
4. Click **Execute workflow** → 5 new rows with `Status = new` should appear in `ideas`.
5. Toggle the workflow **Active** → it runs every day at 06:00 (n8n's timezone).

Notes: a feed that fails is skipped (Reddit sometimes blocks server IPs). Keys live in the
Config node, so don't share exports of the workflow.

## KVM2 budget (2 vCPU / 8 GB)

n8n + NocoDB + MoneyPrinterTurbo + renderer fit, as long as only **one render runs at a time**.
GPU work never runs on the VPS: it goes to Modal or Kaggle.
