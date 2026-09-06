# PRODUCT REQUIREMENTS DOCUMENT

## Creator Intelligence Platform

### AI-Powered Influencer Script Personalisation Engine

**Version 1.0 · June 2025**
**Status: DRAFT**

---

## 1. Product Overview

Creator Intelligence Platform is a B2B SaaS tool for influencer marketing agencies. It automatically analyses a creator's Instagram content, classifies their style, and generates personalised brand scripts using an AI rewrite engine — eliminating the hours agencies spend on manual briefing and script adaptation.

### 1.1 Problem Statement

- Agencies manually review 10–20 reels per creator before briefing, taking 2–4 hours per campaign.
- Generic brand scripts handed to creators result in inauthentic content and poor engagement.
- No scalable method exists to match script tone to creator style across a full creator roster.

### 1.2 Solution

- Automatically fetch and analyse a creator's last 10 reels from Instagram.
- Transcribe audio, score performance, and classify creator style using AI.
- Match creator profile against a 400+ script library and rewrite the best-fit script in the creator's exact tone.
- Return a shoot-ready personalised script in under 3 minutes.

### 1.3 Target Users

| User | Role | Primary Need |
|------|------|-------------|
| Campaign Manager | Runs influencer campaigns end-to-end | Quick creator evaluation & brief |
| Strategy Lead | Selects creators for brand partnerships | Creator–brand fit scoring |
| Copywriter | Writes scripts and creative briefs | Auto-personalised shoot-ready scripts |

---

## 2. Goals & Success Metrics

| Goal | Metric | Target (6 months) |
|------|--------|-------------------|
| Fast creator profiling | Time to creator profile | < 3 minutes |
| Script relevance | Agency script approval rate | > 80% |
| Platform adoption | Active paying agency seats | 50 seats |
| System reliability | Pipeline success rate | > 95% |
| Revenue | MRR | ₹2,50,000/month |

---

## 3. MVP Feature Specifications

### 3.1 Authentication & Workspace

- Email/password login and Google OAuth via NextAuth.js.
- Agency workspace — multiple team members under one billing account.
- Role-based access: Admin (billing, seat management) and Member (analysis, scripts).

> **AI Tool:** No AI tool — standard auth library (NextAuth.js)

### 3.2 Creator Analysis Input

- User pastes any Instagram profile URL or just the username.
- System validates the handle and triggers the async analysis pipeline immediately.
- Real-time status shown via polling: Fetching → Transcribing → Analysing → Done.

> **AI Tool:** No AI tool at this stage — input validation only

### 3.3 Reel Fetching

- Fetches the creator's last 10 reels: Views, Likes, Comments, Caption, Video URL, Thumbnail.
- Scraping via Apify Instagram Scraper (pay-per-use, no Meta API approval required).
- Reel videos downloaded temporarily to Cloudflare R2 for transcription processing.

> **AI Tool:** No AI tool — Apify scraper handles data extraction

### 3.4 Transcription Engine

- Each reel audio is extracted server-side using FFmpeg (installed on Hostinger VPS).
- Audio sent to Deepgram Nova-2 API for transcription.
- Returns transcript text and word count per reel.
- Classification rule: > 50 words → Voiceover Creator; ≤ 50 words → Music-Based Creator.

> **AI Tool:** Deepgram Nova-2 — speech-to-text with Hindi, Hinglish, and regional Indian language support

### 3.5 Performance Scoring

Each reel is scored using a weighted engagement formula:

| Signal | Weight |
|--------|--------|
| Views | 50% |
| Likes | 25% |
| Comments | 25% |

Top 4 scored reels are passed into the style analysis stage.

> **AI Tool:** No AI tool — deterministic scoring formula

### 3.6 Creator Style Analysis

An LLM analyses the top 4 reel transcripts and captions to extract:

- **Tone** — Funny, Inspirational, Educational, Casual, Motivational, etc.
- **Hook pattern** — Question-based, Shock value, Story opener, Bold claim, etc.
- **CTA pattern** — Comment below, Follow, Link in bio, DM us, etc.
- **Speaking style** — Storytelling, Direct address, Tutorial, Conversational, etc.
- **Creator bucket** — Dedicated (entire reel = brand) or Integrated (brand woven into lifestyle content).
- **Content type** — Voiceover or Music-Based (from transcription word count).
- **Language** — Hindi, English, Hinglish, Tamil, Telugu, Malayalam, Kannada, or Other.

> **AI Tool:** Claude Sonnet 3.5 (Anthropic API) — primary LLM for style classification and creator profiling

### 3.7 Script Recommendation Engine

- 400+ scripts stored in PostgreSQL with pgvector embeddings (1536 dimensions).
- Each script tagged: bucket, language, content type, tone, brand category.
- Filter by bucket + language + content type, then rank by cosine similarity to creator style vector.
- Top 5 matching scripts retrieved and passed to personalisation layer.

> **AI Tool:** OpenAI text-embedding-3-small — used to generate script and creator profile embeddings for vector search

### 3.8 AI Script Personalisation

**Core value feature.** For each of the top 5 matched scripts:

- Full creator profile + original script sent to LLM with a structured personalisation prompt.
- Model preserves campaign objective and CTA, but rewrites hook, tone, pacing, language mix, and storytelling style to match the creator's voice.
- Output: personalised shoot-ready script alongside the original for side-by-side comparison.
- Agency can edit inline and export as PDF or copy to clipboard.

> **AI Tool:** Claude Sonnet 3.5 (Anthropic API) — script rewriting and voice adaptation. Claude chosen over GPT for superior instruction-following in creative Indian-language tasks

### 3.9 Creator Profile Card & History

- Displays name, followers, language, content type, bucket, top reels with thumbnails, and extracted style attributes.
- Shareable within agency workspace via a private link.
- All past analyses saved, searchable by creator handle, date, and brand.

> **AI Tool:** No AI tool — UI rendering of stored analysis data

---

## 4. End-to-End User Flow

| # | Step | Detail | AI Tool Used |
|---|------|--------|-------------|
| 1 | Login | Agency logs in via Google OAuth or email | None |
| 2 | Enter Creator | Paste Instagram URL or username | None |
| 3 | Fetch Reels | BullMQ job fetches 10 reels via Apify | Apify Scraper |
| 4 | Transcribe | FFmpeg extracts audio; Deepgram transcribes each reel | Deepgram Nova-2 |
| 5 | Score & Rank | Weighted formula scores reels; top 4 selected | None (deterministic) |
| 6 | Style Analysis | LLM extracts tone, hook, CTA, language, bucket from top 4 reels | Claude Sonnet 3.5 |
| 7 | Script Match | pgvector cosine search returns top 5 scripts from library | OpenAI Embeddings |
| 8 | AI Rewrite | Each script personalised to creator voice and language style | Claude Sonnet 3.5 |
| 9 | Review & Export | Agency edits, approves, and exports the shoot-ready script | None |

---

## 5. Final Tech Stack

### 5.1 Frontend

| Tool | Purpose | Why Chosen |
|------|---------|-----------|
| Next.js 15 | App framework | SSR + App Router; full-stack in one codebase |
| Tailwind CSS | Styling | Utility-first, fast iteration with no CSS overhead |
| shadcn/ui | UI components | Accessible, unstyled, no vendor lock-in |
| TanStack Query | Server state & polling | Polling analysis job status without WebSocket complexity |

### 5.2 Backend

| Tool | Purpose | Why Chosen |
|------|---------|-----------|
| Next.js API Routes | REST API layer | Same repo, no separate server for MVP |
| BullMQ + Redis | Async job queue | Reliable pipeline: fetch → transcribe → analyse → rewrite |
| NextAuth.js | Authentication | Google OAuth + email, works natively with Next.js |
| FFmpeg | Audio extraction | Installed on VPS; extracts audio from reel videos for Deepgram |

### 5.3 Database & Storage

| Tool | Purpose | Why Chosen |
|------|---------|-----------|
| PostgreSQL | Primary database | Self-hosted on Hostinger VPS; full control, no egress fees |
| pgvector | Script vector search | Runs inside PostgreSQL; no separate vector DB needed |
| Prisma ORM | Database access layer | Type-safe queries and clean migrations |
| Cloudflare R2 | Reel video & thumbnail storage | Zero egress cost; generous free tier (10 GB) |
| Redis (self-hosted) | BullMQ message broker | Installed on same VPS; no extra cost |

### 5.4 Hosting — Hostinger VPS

All backend workloads (Next.js server, BullMQ workers, PostgreSQL, Redis, FFmpeg) run on a single Hostinger KVM VPS. PM2 manages process resurrection. Nginx acts as reverse proxy with SSL via Certbot.

| Layer | Tool | Config | Notes |
|-------|------|--------|-------|
| Web server | Nginx | Reverse proxy on port 80/443 | SSL via Certbot (Let's Encrypt) |
| Process manager | PM2 | Next.js + 2 BullMQ workers | Auto-restart on crash |
| Database | PostgreSQL 16 | Local socket connection | With pgvector extension enabled |
| Cache / Queue | Redis 7 | 127.0.0.1:6379 | BullMQ broker on same VPS |
| CDN / DNS | Cloudflare | Proxy all traffic | Free DDoS protection + CDN |

### 5.5 AI Tool Stack

| AI Tool | Provider | Used For | Why This Tool |
|---------|----------|----------|--------------|
| Claude Sonnet 3.5 | Anthropic | Style analysis + script rewriting | Best creative instruction-following; strong Hinglish/Indian-English comprehension |
| Deepgram Nova-2 | Deepgram | Reel audio transcription | Fastest, cheapest STT; good Hindi/Hinglish accuracy vs Whisper |
| text-embedding-3-small | OpenAI | Script & profile vectorisation | Cost-effective at $0.00002/1K tokens; 1536-dim accuracy sufficient for script matching |
| Apify Instagram Scraper | Apify | Reel data fetching | No Meta API approval; reliable scraping at scale; managed infrastructure |

**Removed from stack:** OpenAI GPT-4 (replaced by Claude Sonnet), OpenAI Whisper (replaced by Deepgram), Pinecone (replaced by pgvector), FastText (replaced by LLM language detection), NestJS (replaced by Next.js API Routes + BullMQ workers for MVP scale).

---

## 6. Database Schema

| Table | Key Fields | Notes |
|-------|-----------|-------|
| `users` | id, email, role, workspace_id | workspace_id groups agency team members under one billing account |
| `creator_analyses` | id, instagram_handle, status, created_at | status: pending \| processing \| done \| failed |
| `reels` | id, analysis_id, views, likes, comments, score, video_url, thumbnail_url | 10 rows per creator_analysis |
| `transcripts` | id, reel_id, text, word_count | Deepgram output; word_count drives voiceover vs music classification |
| `creator_profiles` | id, analysis_id, tone, hook, cta, style, bucket, language, content_type | LLM-extracted attributes from top 4 reels |
| `scripts` | id, title, bucket, language, content_type, tone, body, embedding vector(1536) | 400+ scripts; embedding column indexed with ivfflat for fast cosine search |
| `script_recommendations` | id, analysis_id, script_id, original_body, rewritten_body, rank | Stores both versions; rank 1–5 per analysis |
| `jobs` | id, analysis_id, stage, status, error, updated_at | BullMQ job tracking for real-time pipeline visibility |

---

## 7. Cost Breakdown (INR)

All costs are estimated at active production scale (200 creator analyses per month, 3-person team). Exchange rate: 1 USD = ₹84. Costs are set at realistic upper-range figures suitable for investor or client presentations.

### 7.1 Domain

Recommendation: Cloudflare Registrar for .com (cost price, no markup, automatic DNSSEC). Budget: ₹1,500/year.

| Domain Option | Registrar | Price/Year (INR) | Recommendation |
|--------------|-----------|-----------------|----------------|
| creatorintel.io | Cloudflare Registrar | ₹8,500 – ₹10,000 | Premium brand |
| creatorintel.com | Cloudflare Registrar | ₹1,200 – ₹1,800 | ✓ Best value |
| creatoriq.in | BigRock / GoDaddy | ₹900 – ₹1,400 | India-only |

### 7.2 Hosting — Hostinger VPS (Monthly)

Budget: KVM 4 plan from launch at ₹2,015/month to handle concurrent BullMQ workers, PostgreSQL, Redis, and Next.js server.

| VPS Plan | Specs | USD/month | INR/month |
|----------|-------|-----------|-----------|
| KVM 2 (MVP launch) | 2 vCPU, 8 GB RAM, 100 GB NVMe | $12.99 | ₹1,091 |
| KVM 4 (post-traction scale) | 4 vCPU, 16 GB RAM, 200 GB NVMe | $23.99 | ₹2,015 |
| KVM 8 (growth stage) | 8 vCPU, 32 GB RAM, 400 GB NVMe | $44.99 | ₹3,779 |

### 7.3 Supporting Infrastructure (Monthly)

| Service | Platform | Plan | USD/month | INR/month |
|---------|----------|------|-----------|-----------|
| Object Storage (R2) | Cloudflare R2 | Pay-as-you-go | ~$5 | ~₹420 |
| CDN / DNS / DDoS | Cloudflare | Free | $0 | ₹0 |
| Transactional Email | Resend | Pro | $20 | ₹1,680 |
| SSL Certificate | Let's Encrypt via Certbot | Free | $0 | ₹0 |
| Monitoring / Uptime | Better Uptime | Basic | $20 | ₹1,680 |
| Error Tracking | Sentry | Team | $26 | ₹2,184 |
| **INFRA SUBTOTAL** | | | **~$71/mo** | **~₹5,964** |

### 7.4 AI & API Costs Per Creator Analysis

Cost per one full analysis (10 reels scraped, 4 transcribed, 1 style classification, 5 script rewrites):

| Service | Provider | Pricing Unit | Est. Per Analysis | INR |
|---------|----------|-------------|-------------------|-----|
| Reel Scraping (10 reels) | Apify | ~$0.05 per run | $0.08 | ₹6.7 |
| Transcription (4 reels × 90s) | Deepgram Nova-2 | $0.0043/min | $0.06 | ₹5 |
| Style Analysis (1 call) | Claude Sonnet 3.5 | $3/M input tokens | $0.05 | ₹4.2 |
| Script Rewrites (5 calls) | Claude Sonnet 3.5 | $3/M input tokens | $0.25 | ₹21 |
| Embeddings (profile + scripts) | OpenAI text-3-small | $0.02/M tokens | $0.01 | ₹0.8 |
| **COST PER ANALYSIS** | | | **~$0.45** | **~₹38** |

### 7.5 Total Monthly Cost at 200 Analyses

| Cost Item | USD/month | INR/month |
|-----------|-----------|-----------|
| Hostinger KVM 4 VPS | $23.99 | ₹2,015 |
| Cloudflare R2 Storage | $5 | ₹420 |
| Resend (Transactional Email) | $20 | ₹1,680 |
| Better Uptime (Monitoring) | $20 | ₹1,680 |
| Sentry (Error Tracking) | $26 | ₹2,184 |
| Apify Scraping (200 × $0.08) | $16 | ₹1,344 |
| Deepgram Nova-2 (200 analyses) | $12 | ₹1,008 |
| Claude Sonnet 3.5 (1,200 API calls) | $60 | ₹5,040 |
| OpenAI Embeddings | $2 | ₹168 |
| Domain (annualised ÷ 12) | $1.5 | ₹126 |
| Buffer / Overages (15%) | $28 | ₹2,352 |
| **GRAND TOTAL** | **~$214/mo** | **~₹18,017/mo** |

At a suggested agency price of ₹8,000–₹20,000/month per seat, 50 active seats generates ₹4,00,000–₹10,00,000 MRR against ~₹18,000 COGS — a gross margin of 95%+.

### 7.6 One-Time Setup Costs

| Item | USD | INR |
|------|-----|-----|
| Domain registration (1 year) | $15 | ₹1,260 |
| Script library vectorisation (one-time Apify + OpenAI run) | $20 | ₹1,680 |
| VPS initial setup + Nginx/SSL config | $0 (dev time) | ₹0 |
| **ONE-TIME TOTAL** | **~$35** | **~₹2,940** |

---

## 8. Development Milestones

| Phase | Duration | Deliverables | Exit Criteria |
|-------|----------|-------------|---------------|
| 1 | Week 1–2 | Auth, workspace, DB schema, Prisma setup, VPS config (Nginx + PM2 + Certbot) | Login works end-to-end on live domain |
| 2 | Week 3–4 | Apify integration, reel fetching, Cloudflare R2 upload, BullMQ pipeline skeleton | 10 reels fetched and stored in DB |
| 3 | Week 5 | FFmpeg audio extraction, Deepgram transcription, word-count classification stored in transcripts table | Transcripts saved and word counts accurate |
| 4 | Week 6 | Performance scoring algorithm, style analysis prompt to Claude, creator_profiles populated | Creator profile JSON generated correctly |
| 5 | Week 7 | Script library import (400+ scripts), pgvector embeddings via OpenAI, vector search endpoint | Top 5 scripts returned for any profile |
| 6 | Week 8 | Claude personalisation prompt, script rewrite output, script_recommendations table populated | Personalised script is readable and on-brief |
| 7 | Week 9–10 | Full UI: dashboard, creator card, script viewer, side-by-side comparison, history, export | Non-technical agency staff can complete flow unaided |
| 8 | Week 11 | Job status polling, real-time progress bar, error state handling, email notification on completion | Pipeline completes reliably for 10 concurrent analyses |
| 9 | Week 12 | Beta with 2 agencies, bug fixes, performance tuning, Sentry integration | Zero P0 bugs; first paid customer onboarded |

---

## 9. Out of Scope (Post-MVP)

- Direct Instagram Graph API integration (requires Meta app review process)
- YouTube, TikTok, or LinkedIn content analysis
- Creator outreach CRM and contract management
- Brand campaign tracking and ROI reporting
- White-label portal for agencies to resell to clients
- Native iOS or Android app
- Real-time reel monitoring and auto-alerts

---

## 10. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Apify blocks or rate-limits Instagram | High | Retry logic + exponential backoff in BullMQ; Bright Data as backup scraper |
| Private or restricted creator accounts | Medium | Clear error state in UI; prompt user to ask creator to set account public |
| Deepgram accuracy on Hinglish/regional audio | Medium | Benchmark on 50 sample reels pre-launch; fallback to OpenAI Whisper if accuracy < 80% |
| VPS downtime during peak usage | Medium | PM2 auto-restart; Cloudflare CDN serves static assets; Better Uptime alerts on-call |
| AI-rewritten script does not match creator voice | Low | Agency can edit inline; 1–5 star rating stored and used to iterate prompts |
| Claude/OpenAI API cost spike | Low | Cache creator profiles and transcripts; re-use on repeat analyses; usage alerts via dashboard |
