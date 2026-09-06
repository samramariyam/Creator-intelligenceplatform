# Creator Intelligence Platform

An internal tool for influencer-marketing teams that turns a creator's own Instagram content into a personalized, on-brand ad script — automatically. Point it at a creator's handle and a brand's script library, and it fetches their top-performing reels, learns how they actually talk, matches them against real brand scripts, and rewrites the best-fitting one so it sounds like the creator wrote it themselves — not like a brand brief.

## The problem this solves

When a brand runs an influencer campaign across dozens or hundreds of creators, someone on the marketing team has to write (or adapt) a script for every single one. Done by hand, that means:

- Reading through each creator's content to understand their tone, pacing, and speaking style.
- Picking a brand script from the library that fits their niche and format.
- Rewriting it so it doesn't read like a corporate brief pasted into their mouth — creators can tell, and so can their audience.
- Doing this dozens of times per campaign, every campaign.

This platform automates that entire loop: given just a creator's handle, it produces a ready-to-send, creator-voiced script backed by a real brand script from the workspace's library, in minutes instead of hours.

## What it actually does (user journey)

1. **Analyse a creator** — paste an Instagram handle. The platform fetches their real reels, transcribes the top-performing ones, and builds a "creator style profile" (tone, hook style, CTA style, speaking style, niche, language, gender, observed vocabulary, bucket type).
2. **Review the profile** — the detected style is editable before it's used, so a wrong inference can be corrected once and reused for every future script for that creator.
3. **Match scripts** — the platform searches the brand's script library (via vector similarity) for the scripts that best fit this creator's niche, format, and language, with diversity filtering so results aren't near-duplicates of each other.
4. **AI Rewrite** — the matched script gets rewritten from scratch in the creator's own voice: same brand facts and CTA, entirely different structure, hook, and phrasing from the original. Never a find-and-replace job.
5. **Regenerate with feedback** — if a script isn't quite right, feedback ("make the CTA punchier", "shorten scene 2") goes straight back into the next generation.
6. **Campaigns & collaboration** — scripts, creators, and results can be grouped into campaigns, shared with teammates or external stakeholders via invite links, and exported.

## Tech stack

**Framework & UI**
- **Next.js 16** (App Router, Turbopack) + **React 19**, TypeScript throughout.
- Tailwind CSS v4, shadcn/ui component conventions, Lucide icons.
- TanStack Query for client-side data fetching/caching.

**Database & ORM**
- **PostgreSQL** with the **pgvector** extension (embeddings stored as native vector columns for similarity search).
- **Prisma 7** (with the `@prisma/adapter-pg` driver adapter) as the ORM — some vector-specific queries go through raw SQL since Prisma doesn't natively model the `vector` type.

**Background processing**
- **BullMQ** (Redis-backed job queue) drives the analysis pipeline as a series of discrete, resumable stages, run by a standalone worker process (`src/workers/pipeline.worker.ts`) separate from the Next.js server.
- **ioredis** as the Redis client; Upstash-compatible for hosted Redis.

**AI / ML providers** — each stage uses the provider best suited to it, with fallback chains where quality is critical:
- **Apify** — scrapes real Instagram reel data (captions, engagement metrics, video URLs) for a given handle.
- **Sarvam AI** (`sarvamai` SDK) — audio transcription, chosen for strong performance on Indian-language and code-mixed (Hinglish/Tanglish/Manglish/etc.) speech; audio extraction handled via `ffmpeg-static`/`fluent-ffmpeg`.
- **Google Gemini** (`@google/genai`) — creator style analysis (turning transcripts into a structured profile) and text embeddings (`gemini-embedding-001`) for script-matching similarity search.
- **OpenAI** (`gpt-5.4-mini`) — the primary model for script rewriting.
- **Gemini** (`gemini-3.5-flash`) and **Groq** (`llama-3.3-70b-versatile`) — automatic fallback chain if OpenAI is unavailable, so a single provider outage doesn't stop script generation.

**Auth & multi-tenancy**
- **NextAuth v5** with Google OAuth and email/password (credentials) sign-in, backed by the Prisma adapter.
- Workspace-based multi-tenancy — every creator analysis, script, campaign, and notification is scoped to a workspace, with role-based team membership and invite links.

**Testing**
- **Vitest** for unit tests (pure pipeline logic — matching, validation, retry behavior — is deliberately kept side-effect-free and heavily tested).
- **Playwright** for end-to-end tests.

**Other**
- `bcryptjs` for password hashing, `nodemailer` for transactional email (verification, password reset, invites), `jspdf`/`mammoth`/`pdf-parse`/`pdfjs-dist` for document import/export, `@upstash/ratelimit` for API rate limiting.

## How the pipeline works

A creator analysis moves through five sequential stages, each a separate BullMQ job so any stage can fail, retry, or resume independently without re-running the whole pipeline:

```
FETCH → TRANSCRIBE → ANALYSE → MATCH → REWRITE
```

1. **FETCH** — pulls the creator's real reels from Instagram via Apify (captions, view/like/comment counts, video URLs).
2. **TRANSCRIBE** — selects the top-performing reels and transcribes their audio via Sarvam AI.
3. **ANALYSE** — Gemini reads the transcripts and produces a structured creator profile: tone, hook pattern, CTA pattern, speaking style, niche, content-type classification (voiceover vs. text-overlay/"Super" style), language, gender, and observed vocabulary — all inferred once and reused, not re-guessed on every rewrite.
4. **MATCH** — the creator profile is embedded and compared against the workspace's script library (pgvector similarity), with hard filters, a diversity filter (so results aren't near-duplicates), and progressive fallback if too few matches are found.
5. **REWRITE** — the chosen script is rewritten from scratch for this creator. This is the most heavily engineered stage in the codebase (see below).

## The REWRITE stage, in depth

Turning a brand script into a specific creator's authentic voice is the hardest problem in this platform, and most of the engineering effort went here. Key pieces:

- **Whole-script regeneration, not translation** — the prompt explicitly separates "understand the product facts" from "write an entirely new script," with an instruction to never reuse the original's sentence structure or specific phrasing, even in translation.
- **Scenario grounding** — the original script's occupation/setting (a "corporate office day," a "gym trainer") is treated as disposable scaffolding, not brand information; the rewrite's actual setting is derived from the matched creator's own niche and profile, so a fitness creator handed a beauty-brand script doesn't get cast into someone else's job.
- **Claim rewording with a mechanical self-audit** — exact stats, prices, and ratings are preserved verbatim (required); everything else — how a feature is described — must be reinvented into a new sentence shape, checked against a concrete "4+ shared words in the same order" rule rather than a vague instruction.
- **Language-aware code-mixing** — dedicated rules per language (Hinglish, Manglish, Tanglish, Bengali, Telugu, Kannada, Marathi, Gujarati, Punjabi, English), each with its own natural code-mixing ratio and grammar notes, transliterated into Roman script only (never native scripts) for consistency across the pipeline.
- **A real generate → validate → retry loop** (`generateValidatedScript` in `src/lib/pipeline-logic.ts`) — every generation is mechanically checked (structure, completeness, word-count bounds, language purity, dropped content vs. the original) before being accepted; failures trigger a targeted retry with the specific problem named, not a blind re-roll.
- **Surgical per-issue correction** — some failure types (like an out-of-range "Super" text-overlay line) get a small, isolated fix call that edits only the offending line, instead of regenerating the entire script and risking new problems elsewhere.
- **Multi-provider fallback** — OpenAI → Gemini → Groq, so generation degrades gracefully rather than failing outright.

## Data model (high level)

- **Workspace / User / Team** — multi-tenant account structure with role-based membership and invites.
- **CreatorAnalysis** — one per creator being analysed; tracks pipeline stage, status, and owns everything below.
- **Reel / Transcript** — the fetched content and its transcription.
- **CreatorProfile** — the structured style profile produced by ANALYSE (one-to-one with an analysis).
- **Script** — the brand script library, each with a vector embedding for similarity search.
- **ScriptRecommendation** — a specific script matched to a specific creator, holding both the original and rewritten body, plus user feedback for regeneration.
- **Campaign / CampaignInvite / CampaignAccess** — grouping and external sharing of analyses/scripts.
- **Notification / ActivityLog** — in-app notifications and an audit trail of workspace actions.

## Testing philosophy

Pipeline logic (matching, diversity filtering, word-count targeting, structural validation, retry decisions) is factored into pure, side-effect-free functions in `src/lib/pipeline-logic.ts` specifically so it can be unit-tested without a database or live API calls. On top of that, a real eval harness (`scripts/run-evals.ts`) samples real scripts from the library, pairs them with a fixed set of creator profiles — including deliberately mismatched ones — and runs them through the actual production generation path against the real model, to catch regressions that only show up against real output, not synthetic fixtures.
