# Travelistguide n8n workflows

| WF | What it does | Output |
|----|--------------|--------|
| WF4 | KIE.AI Content Machine: research ➜ awareness score ➜ copy ➜ image | Rows in **Posts pending** (Status `Pending`) |
| **WF7** | Takes those rows and publishes them through Postiz (Coolify) | Facebook + Instagram posts, row updated to `Scheduled` / `Posted` |
| WF6 | Nature & destination Shorts (video) | YouTube / Instagram Reels |

## WF7 setup
1. Add these headers to the *Posts pending* tab: `FB_Scheduled_For`, `IG_Scheduled_For`, `Postiz_IDs`, `Publish_Log`.
2. Postiz ➜ Settings ➜ Public API ➜ copy the key. In n8n create a **Header Auth** credential `Postiz API`: Name `Authorization`, Value = the key (no `Bearer`). Select it on the 3 Postiz nodes.
3. In **Config**: `postiz_base` = `https://<your-postiz-domain>/api/public/v1`, `timezone` = your audience's timezone.
4. Run once with `post_type: 'draft'`, check the drafts in Postiz, then switch to `schedule` and activate.

## Per-platform rules (applied in "Pick Rows + Plan Slots")
- **Facebook**: lunchtime slot, `Facebook_Post`, 1–3 hashtags, links removed from the body (optional `facebook_link` is posted as the first comment).
- **Instagram**: evening slot, `Instagram_Caption`, hook before the ~125-char "…more" cut, save/share CTA, max 5 hashtags (3 niche + 1 broad + brand).
- **Both**: staggered times with jitter, 1 post/day/platform by default, queue continues after the last scheduled post (max 7 days ahead), highest `Awareness_Score` first, never posts a row twice.
- **YouTube**: Postiz only puts video on YouTube, so YouTube is handled by WF6.

## Recommended WF4 tweak
In **KIE.AI — Create Image Task**, use `aspect_ratio: '4:5'` (takes more of the feed on both platforms) and `output_format: 'jpg'` (Instagram's publishing API only takes JPEG).
