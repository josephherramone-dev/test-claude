# WF 5 — Travelistguide Stories Machine (Instagram + Facebook Stories → Postiz)

Companion to WF 4 (feed posts). Generates multi-frame **9:16 stories**, renders one KIE.AI image per frame, and saves **one row per frame** to Google Sheets with `Status = Pending`. Nothing auto-publishes.

## Flow
Schedule (10:00) → Config → Read `Stories pending` → KIE Chat (story ideas) → duplicate check →
KIE Chat (story score 0–100) → IF ≥ min score →
KIE Chat (frame-by-frame script) → split into frames → KIE.AI `nano-banana-2-lite` (9:16) → wait 90s → fetch URL →
append to `Stories pending`. Rejected ideas → `Stories rejected`.

## Google Sheet setup
Same spreadsheet as WF 4. Create two tabs: **`Stories pending`** and **`Stories rejected`**, and paste this header row into row 1 of both (tab-separated):

```
Story_ID	Frame_ID	Frame_Number	Total_Frames	Date	Topic	Story_Format	Keywords	Story_Score	Opportunity	Story_Angle	Frame_Role	On_Screen_Text	Sticker_Type	Sticker_Content	Link_URL	Caption	Hashtags	Music_Mood	Alt_Text	Image_Prompt	KIE_Image_URL	Platforms	Postiz_Post_Type	Scheduled_At	Status	Human_Notes	Postiz_Post_ID	Published_URL
```

## Config (node "Config")
| Key | Default | Notes |
|---|---|---|
| stories_per_run | 3 | story ideas researched per run |
| frames_per_story | 4 | frames in each story |
| min_story_score | 60 | below → rejected |
| render_text_on_image | true | burns `On_Screen_Text` into the image (APIs can't add story text/stickers). Set `false` for clean photos |
| link_url | https://travelistguide.com | used on the last (CTA) frame |
| posting_hour_utc | 17 | `Scheduled_At` = tomorrow at this hour |
| minutes_between_frames | 2 | keeps frames in order when Postiz posts them |
| postiz_post_type | story | value for your Postiz publisher |

## Publishing with Postiz
Approve rows by setting `Status = Approved`. A publisher workflow then reads approved rows, groups them by `Story_ID`, sorts by `Frame_Number`, and posts each `KIE_Image_URL` as a single story at `Scheduled_At` (Instagram post type = story). Write back `Postiz_Post_ID` / `Published_URL` and set `Status = Scheduled`.

Notes:
- Poll/quiz/question stickers can't be added via API. The sticker text is written to `Sticker_Content` and `Human_Notes` so you can add it in the app if you want.
- KIE image URLs expire after a while, so publish (or re-host) within a few days.
