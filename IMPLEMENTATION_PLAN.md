# Implementation Plan — Creator Intelligence Platform

**Created:** 3 Jul 2026  
**Status:** Planning — awaiting feedback before execution

---

## Overview

7 features planned across script generation, creator analysis, platform expansion, and brand AI. Listed below in execution priority order.

---

## #6 — Limit to 2 Scripts Per Prompt ✅ Done
**Priority:** Do first (tiny, no dependencies)

**What:** Match and rewrite 2 scripts per analysis instead of 5.

**Changes:**
- `src/workers/pipeline.worker.ts` → change `LIMIT 5` to `LIMIT 2` in `processMatchStage`
- `src/app/api/scripts/match/route.ts` → change default `limit` from 5 to 2
- `src/app/(dashboard)/dashboard/analysis/[id]/scripts/page.tsx` → UI adapts automatically (tabs are dynamic)

**Effort:** ~10 min

---

## #2 — Max 200 Words / 60 Seconds Per Script ✅ Done
**Priority:** Do second (small, no dependencies)

**What:** Hard-cap every AI rewrite to under 200 words (~55 seconds at natural speaking pace).

**Changes:**
- `src/workers/pipeline.worker.ts` → add to REWRITE prompt:
  ```
  HARD LIMIT: Under 200 words total. Target 45–55 seconds at natural speaking pace.
  Cut at the last complete sentence before the limit, then add the CTA.
  ```
- Add post-generation word count check — if over 200 words, log a warning
- `src/app/(dashboard)/dashboard/analysis/[id]/scripts/page.tsx` → word count display already partially exists, wire estimated duration: `Math.round(wordCount / 2.8)` seconds

**Effort:** ~30 min

---

## #5 — Language-Aware Script Generation ✅ Done
**Priority:** Do third (small, prompt-only)

**What:** Make language detection more explicit and add a manual override option.

**Current state:** Lang block is built from `profile.language` string, but ambiguous/mixed-language creators fall through to generic English.

**Changes:**
- `src/workers/pipeline.worker.ts` → strengthen language detection logic:
  - `"hindi"` or `"hinglish"` → Hinglish block
  - `"malayalam"` or `"manglish"` → Manglish block
  - `"tamil"` or `"tanglish"` → Tanglish block
  - `"telugu"` → Telugu-English block (new)
  - `"kannada"` → Kannada-English block (new)
  - `"gujarati"` → Gujarati-English block
  - `"punjabi"` → Punjabi block
  - Anything else → pure English
- Add `scriptLanguage String?` field on `CreatorAnalysis` as a manual override (UI: dropdown on the progress page)
- If `scriptLanguage` is set, it overrides `profile.language` in the REWRITE prompt

**Migration needed:** 1 column — `creator_analyses.script_language TEXT`

**Effort:** ~45 min

---

## #3 — Average Reel Duration on Creator Profile ✅ Done
**Priority:** Fourth (small, 1 migration)

**What:** Show "Avg. reel length: 42s" on the creator profile page. Uses `videoDuration` already returned by Apify — just not stored.

**Changes:**

**Schema (2 new columns):**
```sql
ALTER TABLE reels ADD COLUMN duration INT NOT NULL DEFAULT 0;
ALTER TABLE creator_profiles ADD COLUMN avg_reel_duration INT;
```

- `prisma/schema.prisma` → add `duration Int @default(0)` to `Reel`
- `prisma/schema.prisma` → add `avgReelDuration Int?` to `CreatorProfile`

**Pipeline:**
- `src/workers/pipeline.worker.ts` → FETCH: store `reel.videoDuration` when creating each Reel record
- `src/workers/pipeline.worker.ts` → ANALYSE: compute avg duration from top reels, store in CreatorProfile

**UI:**
- `src/app/(dashboard)/dashboard/analysis/[id]/profile/page.tsx` → add avg reel duration stat card alongside engagement rate

**Effort:** ~1 hour

---

## #1 — Visual Script Format
**Priority:** Fifth (medium — blocked on example scripts)

**What:** Each script line gets a `[VISUAL: ...]` direction alongside the spoken word. Format matches real brand scripts.

**Blocked on:** User to share example scripts showing desired visual format.

**Planned changes (pending format confirmation):**
- `src/workers/pipeline.worker.ts` → update OUTPUT FORMAT in REWRITE prompt to include visual cues:
  ```
  Hook:
  [VISUAL: creator speaks to camera, holds product in frame]
  VO: "Have you tried this yet? Because this changed everything for me."

  VO:
  [VISUAL: close-up of product texture / application]
  VO: "Amazon's #1 rated shampoo..."
  ```
- `src/app/(dashboard)/dashboard/analysis/[id]/scripts/page.tsx` → add "Visuals" toggle to show/hide `[VISUAL: ...]` lines in the UI

**Effort:** ~1 hour (after format is confirmed)

---

## #7x — Brand-Specific AI Learning (Venus + Others)
**Priority:** Sixth (medium — needs brand voice input)

**What:** The AI knows each brand's voice, key products, claims, and what NOT to say. Rewrites match both the creator's style AND the brand's voice simultaneously.

**Blocked on:** User to provide brand voice guidelines for Venus and other brands.

**Schema (new `Brand` table):**
```sql
CREATE TABLE brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  voice_guide TEXT,       -- "Venus speaks to confident, modern Indian women..."
  key_messages TEXT,      -- "Ultra-smooth glide, dermatologist tested, 0% parabens"
  do_not_use TEXT,        -- "Never say 'cheap', avoid 'fair skin'"
  created_at TIMESTAMP DEFAULT NOW(),
  workspace_id TEXT REFERENCES workspaces(id) ON DELETE CASCADE
);
ALTER TABLE scripts ADD COLUMN brand_id TEXT REFERENCES brands(id) ON DELETE SET NULL;
```

**Pipeline:**
- `src/workers/pipeline.worker.ts` → REWRITE: when `script.brandId` is set, fetch `Brand` record and inject into prompt:
  ```
  BRAND VOICE GUIDE:
  Brand: Venus
  Voice: [voiceGuide]
  Key messages to include: [keyMessages]
  Never use: [doNotUse]
  ```

**UI:**
- Script Library → new "Brands" sub-tab with add/edit/delete for brand guidelines
- When adding a script, link it to a brand (replaces the plain `brandCategory` text field)

**Effort:** ~3–4 hours

---

## #4 — YouTube Shorts Support
**Priority:** Last (large — new Apify actor, full platform routing)

**What:** User pastes a YouTube channel handle, system fetches Shorts instead of Instagram Reels. The transcribe → analyse → match → rewrite pipeline is identical.

**Schema:**
```sql
ALTER TABLE creator_analyses ADD COLUMN platform TEXT NOT NULL DEFAULT 'INSTAGRAM';
```

**Changes:**

**FETCH stage:**
- `src/lib/apify.ts` → add `fetchShortsFromApify(channelHandle)` using `apify~youtube-channel-videos-scraper` (Shorts filter)
- `src/workers/pipeline.worker.ts` → FETCH: branch on `analysis.platform`

**Dashboard input:**
- `src/components/pages/dashboard-page.tsx` → add platform toggle (Instagram 📸 / YouTube ▶️) next to the handle input
- Handle format: YouTube accepts `@channelHandle` or full URL

**UI labels:**
- "Reels Found" → "Videos Found" for YouTube
- Creator avatar → use YouTube channel thumbnail

**Apify actor to use:** `apify~youtube-channel-videos-scraper` with `shorts: true` filter

**Effort:** ~4–6 hours

---

## Dependency Map

```
#6 (2 scripts)  ──────────────────► Ready now
#2 (200 words)  ──────────────────► Ready now
#5 (language)   ──────────────────► Ready now
#3 (avg duration) ─── migration ──► After prisma db push
#1 (visuals)    ─── example scripts needed ──► Blocked
#7 (brand AI)   ─── brand voice input needed ──► Blocked
#4 (YouTube)    ─── Apify actor testing ──► Last
```

---

## Migration Summary (all changes requiring DB schema updates)

| Feature | Column(s) Added | Table |
|---|---|---|
| Brand selection (done) | `selected_brand TEXT` | `creator_analyses` |
| #3 Avg duration | `duration INT DEFAULT 0` | `reels` |
| #3 Avg duration | `avg_reel_duration INT` | `creator_profiles` |
| #5 Language override | `script_language TEXT` | `creator_analyses` |
| #7 Brand AI | New `brands` table + `brand_id` on scripts | — |
| #4 YouTube | `platform TEXT DEFAULT 'INSTAGRAM'` | `creator_analyses` |

All migrations will be applied at deployment via `prisma migrate deploy`.

---

## Waiting On User

| Item | Needed For |
|---|---|
| Example scripts showing desired visual format | #1 |
| Venus brand voice guidelines + key messages | #7 |
| Other brand names and guidelines | #7 |
| Confirm: exactly 2 scripts, or "2 per brand"? | #6 |
