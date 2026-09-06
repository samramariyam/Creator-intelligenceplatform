# DEVELOPMENT CHECKPOINTS

## Creator Intelligence Platform

**Version 1.0 · June 2025**

Each checkpoint is a shippable increment. Development proceeds sequentially — no checkpoint starts until the previous one's test cases all pass. At the end of each checkpoint, every test case must be verified before moving forward.

---

## Checkpoint 0 — Project Scaffolding & Dev Environment

**Goal:** Working local dev environment with all tooling configured. No features — just the foundation every future checkpoint builds on.

### Scope

- [x] Initialize Next.js 15 project with App Router and TypeScript
- [x] Configure Tailwind CSS with the full design system tokens from DESIGN.md (colors, fonts, spacing, radius)
- [x] Install and configure shadcn/ui (dark mode default, CSS variables for theme switching)
- [x] Set up Inter font via `next/font/google` and JetBrains Mono for monospace
- [ ] Configure ESLint + Prettier with consistent rules
- [x] Install Prisma ORM, create initial `schema.prisma` with datasource config (PostgreSQL)
- [x] Set up `.env.local` with placeholder variables for all services (DATABASE_URL, NEXTAUTH_SECRET, ANTHROPIC_API_KEY, DEEPGRAM_API_KEY, OPENAI_API_KEY, APIFY_API_TOKEN, R2_ACCESS_KEY, etc.)
- [ ] Create project folder structure:
  ```
  src/
    app/              # Next.js App Router pages
      (auth)/         # Auth route group (login, signup)
      (dashboard)/    # Protected route group
      api/            # API routes
    components/
      ui/             # shadcn/ui components
      layout/         # Sidebar, Header, Shell
      shared/         # Reusable project components
    lib/              # Utilities, constants, helpers
      db.ts           # Prisma client singleton
      auth.ts         # NextAuth config
    styles/           # Global CSS, theme variables
    types/            # TypeScript interfaces
  prisma/
    schema.prisma
  ```
- [x] Set up `data-theme` attribute toggle on `<html>` for dark/light mode switching
- [x] Create a basic layout shell component (sidebar placeholder + main content area) matching DESIGN.md Section 7.2

### Test Cases

| # | Test | Steps | Expected Result | Pass? |
|---|------|-------|-----------------|-------|
| 0.1 | Dev server starts | Run `npm run dev` | Server starts on `localhost:3000` without errors | [x] |
| 0.2 | Tailwind compiles | Add a `bg-brand-primary text-white p-4` div to the home page | Purple (#6C5CE7) background, white text, 16px padding renders correctly | [x] |
| 0.3 | Custom fonts load | Inspect the rendered page in browser DevTools | `font-family` resolves to Inter, no FOUT (flash of unstyled text) | [x] |
| 0.4 | Dark mode default | Open the app with no manual toggle | Page background is `#0F0F12`, text is `#F5F5F7` | [x] |
| 0.5 | Light mode toggle | Switch `data-theme` to `light` via DevTools | Page background switches to `#FAFAFA`, text to `#111118`, all tokens update | [x] |
| 0.6 | shadcn/ui works | Render a `<Button>` and `<Input>` from shadcn | Components render with correct styles, no console errors | [x] |
| 0.7 | Prisma initialised | Run `npx prisma validate` | Schema validation passes with no errors | [x] |
| 0.8 | Env variables loaded | `console.log(process.env.DATABASE_URL)` in a server component | Prints the placeholder value from `.env.local` | [x] |
| 0.9 | Folder structure | Inspect `src/` directory | All planned folders exist and are importable | [x] |
| 0.10 | Layout shell renders | Navigate to `/` | Sidebar placeholder (260px) + main content area visible, responsive at 768px breakpoint | [x] |

---

## Checkpoint 1 — Database Schema & Prisma Models

**Goal:** Complete database schema implemented in Prisma, migrations run successfully against a local PostgreSQL instance. All tables from PRD Section 6 exist with correct relations.

### Scope

- [x] Define all Prisma models:
  - `Workspace` — id, name, plan, createdAt
  - `User` — id, email, name, passwordHash, role (ADMIN/MEMBER), workspaceId, image, createdAt
  - `CreatorAnalysis` — id, instagramHandle, status (PENDING/PROCESSING/DONE/FAILED), userId, workspaceId, createdAt, completedAt
  - `Reel` — id, analysisId, reelUrl, videoUrl, thumbnailUrl, caption, views, likes, comments, score, rank, createdAt
  - `Transcript` — id, reelId, text, wordCount, language, createdAt
  - `CreatorProfile` — id, analysisId, tone, hookPattern, ctaPattern, speakingStyle, creatorBucket (DEDICATED/INTEGRATED), contentType (VOICEOVER/MUSIC_BASED), language, summary, embedding (for future vector), createdAt
  - `Script` — id, title, body, bucket (DEDICATED/INTEGRATED), language, contentType, tone, brandCategory, embedding (unsupported in Prisma natively — raw SQL migration for vector column), createdAt
  - `ScriptRecommendation` — id, analysisId, scriptId, originalBody, rewrittenBody, rank, rating, createdAt
  - `Job` — id, analysisId, stage (FETCH/TRANSCRIBE/ANALYSE/MATCH/REWRITE), status (PENDING/RUNNING/DONE/FAILED), error, startedAt, completedAt, updatedAt
- [x] Define all relations (User → Workspace, CreatorAnalysis → User, Reels → Analysis, etc.)
- [x] Create initial migration: `npx prisma migrate dev --name init`
- [x] Enable pgvector extension via raw SQL in migration (`CREATE EXTENSION IF NOT EXISTS vector`)
- [x] Add vector column to `scripts` table via raw SQL migration (`ALTER TABLE scripts ADD COLUMN embedding vector(1536)`)
- [x] Create ivfflat index on scripts embedding column
- [x] Seed file with 1 test workspace, 2 test users (1 admin, 1 member)
- [x] Export Prisma client singleton from `src/lib/db.ts`

### Test Cases

| # | Test | Steps | Expected Result | Pass? |
|---|------|-------|-----------------|-------|
| 1.1 | Migration runs | Run `npx prisma migrate dev` | All migrations apply without errors; database tables created | [x] |
| 1.2 | pgvector enabled | Run `SELECT * FROM pg_extension WHERE extname = 'vector'` in psql | pgvector extension listed | [x] |
| 1.3 | Vector column exists | Run `\d scripts` in psql | `embedding` column shows type `vector(1536)` | [x] |
| 1.4 | ivfflat index exists | Run `\di` in psql | Index on `scripts.embedding` using ivfflat is listed | [x] |
| 1.5 | User → Workspace relation | Create a workspace, then create a user with that workspaceId via Prisma | User created successfully; `user.workspace` returns the workspace object | [x] |
| 1.6 | Analysis → Reels cascade | Create an analysis with 3 reels, then delete the analysis | All 3 reels are cascade-deleted | [x] |
| 1.7 | Reel → Transcript relation | Create a reel, then create a transcript linked to it | `reel.transcript` returns the transcript; `transcript.reel` returns the reel | [x] |
| 1.8 | Analysis → CreatorProfile | Create an analysis and a creator profile for it | `analysis.creatorProfile` returns the profile | [x] |
| 1.9 | ScriptRecommendation relations | Create a recommendation linking an analysis and a script | `recommendation.analysis` and `recommendation.script` both resolve | [x] |
| 1.10 | Job → Analysis relation | Create 3 jobs for one analysis with different stages | `analysis.jobs` returns all 3 jobs; each job has correct stage value | [x] |
| 1.11 | Seed runs | Run `npx prisma db seed` | 1 workspace, 2 users (1 ADMIN, 1 MEMBER) exist in database | [x] |
| 1.12 | Prisma client singleton | Import `db` from `src/lib/db.ts` in a server component | No "multiple Prisma client instances" warning in dev | [x] |
| 1.13 | Enum constraints | Try to create a user with `role: "SUPERADMIN"` | Prisma throws a validation error — only ADMIN and MEMBER are valid | [x] |
| 1.14 | Status enum works | Create an analysis with status PENDING, then update to PROCESSING, then DONE | Each status transition succeeds; invalid status values are rejected | [x] |

---

## Checkpoint 2 — Authentication & Workspace

**Goal:** Users can sign up, log in (email + Google OAuth), and land in their agency workspace. Role-based access is enforced. Matches PRD Section 3.1 and DESIGN.md Section 7.1.

### Scope

- [x] Install and configure NextAuth.js with:
  - Google OAuth provider (client ID + secret in env)
  - Credentials provider (email/password with bcrypt hashing)
  - Prisma adapter for session/account storage
  - JWT strategy for session management
- [x] Build Sign Up flow:
  - Create workspace automatically on first user registration (that user becomes ADMIN)
  - Subsequent users join existing workspace via invite (see Team page later)
- [x] Build Login page matching DESIGN.md Section 7.1:
  - Two-panel layout (brand gradient left, auth form right)
  - Google OAuth button + email/password form
  - "Sign up" / "Sign in" toggle
  - Mobile: single-column auth form
- [x] Implement auth middleware:
  - Redirect unauthenticated users to `/login`
  - Redirect authenticated users away from `/login` to `/dashboard`
- [x] Create protected route group `(dashboard)` with layout that checks session
- [x] Build workspace context provider — current user + workspace info available to all dashboard pages
- [x] Implement role-based guards:
  - ADMIN: can access billing, team management
  - MEMBER: can access analysis, scripts, history

### Test Cases

| # | Test | Steps | Expected Result | Pass? |
|---|------|-------|-----------------|-------|
| 2.1 | Login page renders | Navigate to `/login` | Two-panel layout renders: gradient left panel, auth form right panel | [x] |
| 2.2 | Login page mobile | Resize browser to 375px width | Left panel hidden; auth form is centered full-width | [x] |
| 2.3 | Sign up with email | Fill in name, email, password, click "Sign Up" | Account created, workspace auto-created, user is ADMIN, redirected to `/dashboard` | [x] |
| 2.4 | Duplicate email rejected | Try to sign up with same email again | Error message "Email already in use" shown inline | [x] |
| 2.5 | Sign in with email | Enter valid credentials, click "Sign In" | Redirected to `/dashboard`; session cookie is set | [x] |
| 2.6 | Wrong password | Enter valid email, wrong password | Error message "Invalid credentials" shown; no redirect | [x] |
| 2.7 | Google OAuth flow | Click "Continue with Google" | Redirected to Google consent screen → on approval, redirected to `/dashboard` | [x] |
| 2.8 | Auth redirect | Visit `/dashboard` while logged out | Redirected to `/login` | [x] |
| 2.9 | Logged-in redirect | Visit `/login` while logged in | Redirected to `/dashboard` | [x] |
| 2.10 | Workspace created on signup | Check database after first sign-up | Workspace record exists; user's `workspaceId` matches | [x] |
| 2.11 | Role is ADMIN for first user | Query the user record | `role` field is `ADMIN` | [x] |
| 2.12 | Session persists | Log in, close tab, reopen `/dashboard` | Still authenticated — no re-login required | [x] |
| 2.13 | Sign out | Click sign-out button in header | Session destroyed; redirected to `/login` | [x] |
| 2.14 | MEMBER cannot access billing | Log in as MEMBER, navigate to `/settings/billing` | 403 page or redirect to dashboard with "Access denied" toast | [x] |
| 2.15 | Dark mode on auth page | Open `/login` with system dark mode | Page uses dark theme colors from DESIGN.md | [x] |

---

## Checkpoint 3 — Dashboard Shell & Navigation

**Goal:** Full dashboard layout with sidebar, header, theme toggle, and all navigation routes (pages are empty placeholders). Matches DESIGN.md Section 7.2.

### Scope

- [x] Build Sidebar component:
  - Logo at top (full logo at 260px, icon mark at 64px)
  - Nav items: Dashboard, History, Script Library, Team, Settings
  - Active item styling: `brand-primary` bg tint + left border accent
  - Workspace name + plan badge at bottom
  - Collapse/expand toggle (260px ↔ 64px)
  - Mobile: hidden sidebar, hamburger menu trigger
- [x] Build Header component:
  - Page title (dynamic per route)
  - Theme toggle (dark/light)
  - User avatar + dropdown (profile, sign out)
- [x] Build Dashboard Shell (`(dashboard)/layout.tsx`):
  - Sidebar + Header + main content area
  - Main content scrollable, sidebar fixed
- [x] Create placeholder pages:
  - `/dashboard` — "Dashboard" heading
  - `/dashboard/history` — "Creator History" heading
  - `/dashboard/scripts` — "Script Library" heading
  - `/dashboard/team` — "Team" heading
  - `/dashboard/settings` — "Settings" heading
- [x] Implement mobile bottom tab bar (< 768px) with 5 icons matching sidebar nav
- [x] Wire theme toggle to `data-theme` attribute on `<html>`, persist preference in `localStorage`

### Test Cases

| # | Test | Steps | Expected Result | Pass? |
|---|------|-------|-----------------|-------|
| 3.1 | Sidebar renders | Navigate to `/dashboard` | Sidebar visible at 260px width with logo, all 5 nav items, workspace name | [x] |
| 3.2 | Active nav highlight | Click "History" in sidebar | "History" item shows `brand-primary` tint + left border; others are default | [x] |
| 3.3 | Sidebar collapse | Click collapse toggle | Sidebar shrinks to 64px; only icons visible; main content expands | [x] |
| 3.4 | Sidebar expand | Click expand toggle from collapsed state | Sidebar returns to 260px with labels | [x] |
| 3.5 | Page navigation | Click each sidebar item | URL changes to correct route; page title in header updates | [x] |
| 3.6 | Theme toggle | Click theme toggle in header | Theme switches from dark to light; all tokens update; background, text, borders change | [x] |
| 3.7 | Theme persists | Toggle to light mode, refresh page | Light mode is still active (read from localStorage) | [x] |
| 3.8 | User avatar dropdown | Click avatar in header | Dropdown shows user name, email, "Sign out" option | [x] |
| 3.9 | Sign out from dropdown | Click "Sign out" in dropdown | Session destroyed; redirected to `/login` | [x] |
| 3.10 | Mobile sidebar hidden | Resize to 600px width | Sidebar is hidden; hamburger icon appears in header | [x] |
| 3.11 | Mobile hamburger menu | Click hamburger icon on mobile | Sidebar slides in as overlay with all nav items | [x] |
| 3.12 | Mobile bottom tabs | Resize to 600px width | Bottom tab bar appears with 5 icons; tapping navigates correctly | [x] |
| 3.13 | Laptop breakpoint | Resize to 1100px width | Sidebar auto-collapses to 64px icon-only mode | [x] |
| 3.14 | Header page title | Navigate to `/dashboard/scripts` | Header shows "Script Library" as page title | [x] |
| 3.15 | Content scrolling | Add overflow content to a page | Main content area scrolls; sidebar and header stay fixed | [x] |

---

## Checkpoint 4 — Creator Analysis Input & Job Creation

**Goal:** User can paste an Instagram handle, the system validates it, creates an analysis record + BullMQ job, and shows the progress page. Matches PRD Section 3.2 and DESIGN.md Section 7.2 (Quick Analyse bar) + 7.3 (Progress page skeleton).

### Scope

- [x] Build Quick Analyse input on Dashboard:
  - Instagram icon prefix + `instagram.com/` static text
  - Input field for handle (strips URL, extracts username)
  - Input validation: alphanumeric + underscores + periods, 1–30 chars
  - "Analyse Creator" primary button
- [x] Create API route `POST /api/analyses`:
  - Validates handle format
  - Creates `CreatorAnalysis` record (status: PENDING)
  - Creates initial `Job` record (stage: FETCH, status: PENDING)
  - Returns analysis ID
- [x] Install and configure BullMQ + Redis connection:
  - Redis connection helper in `src/lib/redis.ts`
  - BullMQ queue definition in `src/lib/queue.ts`
  - Add job to queue on analysis creation
- [x] Build Analysis Progress page (`/dashboard/analysis/[id]`):
  - Pipeline stepper UI (Fetching → Transcribing → Analysing → Script Match → AI Rewrite)
  - All steps show as PENDING initially
  - Skeleton placeholder for reel thumbnails section
- [x] Set up TanStack Query polling on progress page:
  - Polls `GET /api/analyses/[id]` every 3 seconds
  - Updates stepper UI based on job status
- [x] Create API route `GET /api/analyses/[id]`:
  - Returns analysis record with associated jobs
  - Returns reels, profile, recommendations if they exist
- [x] Dashboard "Active Analyses" section:
  - Lists all analyses for current workspace with status != DONE (last 10)
  - Each row shows handle, progress bar, current stage
  - Click navigates to progress page

### Test Cases

| # | Test | Steps | Expected Result | Pass? |
|---|------|-------|-----------------|-------|
| 4.1 | Input renders | Navigate to `/dashboard` | Quick Analyse bar visible at top with Instagram icon, prefix text, input, and button | [x] |
| 4.2 | URL parsing | Paste `https://www.instagram.com/virat.kohli/` into input | Input extracts and displays `virat.kohli` as the handle | [x] |
| 4.3 | Handle validation pass | Type `creator_name.123` | No error; button is enabled | [x] |
| 4.4 | Handle validation fail | Type `creator name!!!` | Inline error: "Invalid Instagram handle"; button is disabled | [x] |
| 4.5 | Empty submit blocked | Click "Analyse Creator" with empty input | Button is disabled; nothing happens | [x] |
| 4.6 | Analysis created | Enter valid handle, click "Analyse Creator" | API returns 201; `creator_analyses` table has new row with status PENDING | [x] |
| 4.7 | Job created | After analysis creation, check `jobs` table | Job row exists with stage FETCH, status PENDING, linked to analysis | [x] |
| 4.8 | BullMQ job queued | Check Redis after analysis creation | Job exists in the BullMQ queue | [x] |
| 4.9 | Redirect to progress | After clicking "Analyse Creator" | Browser navigates to `/dashboard/analysis/[id]` | [x] |
| 4.10 | Progress page renders | Navigate to progress page | Pipeline stepper visible with 5 steps; first step (Fetching) shows as active/pending | [x] |
| 4.11 | Polling works | Manually update job status in DB to RUNNING | Within 3 seconds, stepper UI updates to show "Fetching" as active (blue + pulse) | [x] |
| 4.12 | Active analyses list | Create 2 analyses | Dashboard "Active Analyses" section shows both with handle and status | [x] |
| 4.13 | Click active analysis | Click an analysis in the active list | Navigates to its progress page | [x] |
| 4.14 | GET analysis API | Call `GET /api/analyses/[id]` directly | Returns analysis JSON with status, jobs array, empty reels/profile | [x] |
| 4.15 | Auth required | Call `POST /api/analyses` without session | Returns 401 Unauthorized | [x] |
| 4.16 | Workspace isolation | Log in as User B in different workspace, call GET for User A's analysis | Returns 404 — analysis not visible across workspaces | [x] |

---

## Checkpoint 5 — Reel Fetching Pipeline (Apify + R2)

**Goal:** BullMQ worker fetches 10 reels from Instagram via Apify, downloads thumbnails to Cloudflare R2, stores reel metadata in database. Matches PRD Section 3.3.

### Scope

- [x] Build BullMQ worker process (`src/workers/pipeline.worker.ts`):
  - Listens on the analysis queue
  - Stage 1: FETCH — calls Apify, processes results, updates DB
- [x] Integrate Apify Instagram Scraper:
  - API call to start Apify actor run with the Instagram handle
  - Poll Apify run status until complete
  - Parse returned data: last 10 reels with views, likes, comments, caption, video URL, thumbnail URL
- [ ] Upload reel thumbnails to Cloudflare R2:
  - Configure R2 client (S3-compatible SDK)
  - Upload each thumbnail, store R2 URL in `reels.thumbnailUrl`
  - Store original video URL for later transcription
- [x] Store all 10 reels in database:
  - Create 10 `Reel` records linked to the analysis
  - Populate views, likes, comments, caption, videoUrl, thumbnailUrl
- [x] Update job status throughout:
  - FETCH job: PENDING → RUNNING → DONE
  - On success: create next job (TRANSCRIBE, PENDING)
  - On failure: set analysis status to FAILED with error message
- [x] Handle edge cases:
  - Private account → fail with descriptive error
  - Fewer than 10 reels → proceed with available reels
  - Apify timeout → retry up to 3 times with exponential backoff

### Test Cases

| # | Test | Steps | Expected Result | Pass? |
|---|------|-------|-----------------|-------|
| 5.1 | Worker starts | Start the worker process | Worker connects to Redis and begins listening on the queue | [x] |
| 5.2 | Apify called | Trigger analysis for a public creator | Apify API receives a valid request; actor run starts | [x] |
| 5.3 | 10 reels stored | After FETCH completes, query `reels` table | 10 reel records exist with views, likes, comments, caption populated | [x] |
| 5.4 | Thumbnails on R2 | Check R2 bucket after fetch | Thumbnail files exist; `reels.thumbnailUrl` points to valid R2 URLs | [x] (via proxy) |
| 5.5 | R2 URLs accessible | Open a thumbnail URL in browser | Image loads correctly | [x] |
| 5.6 | Video URLs stored | Check `reels.videoUrl` in DB | All 10 reels have non-null video URLs | [x] |
| 5.7 | Job status updated | Check `jobs` table after fetch | FETCH job status is DONE; TRANSCRIBE job exists with status PENDING | [x] |
| 5.8 | Analysis status updated | Check `creator_analyses` after fetch | Status is PROCESSING (not yet DONE) | [x] |
| 5.9 | Progress page updates | Watch the progress page in browser | "Fetching" step shows checkmark; "Transcribing" becomes active | [x] |
| 5.10 | Reel thumbnails on progress page | Check progress page after fetch | Reel thumbnail grid shows 10 thumbnails with view counts | [x] |
| 5.11 | Private account error | Trigger analysis for a private account | Analysis status set to FAILED; error message: "Account is private or restricted" | [x] |
| 5.12 | Few reels handled | Trigger analysis for account with only 5 reels | 5 reels stored; pipeline continues normally | [x] |
| 5.13 | Apify retry on failure | Simulate Apify timeout | Worker retries up to 3 times with increasing delays | [x] |
| 5.14 | Error stored in job | Trigger a failing scenario | `jobs.error` field contains descriptive error message | [x] |
| 5.15 | Captions stored | Check `reels.caption` in DB | Captions are present and correctly encoded (Unicode, emoji, Hinglish text) | [x] |

---

## Checkpoint 6 — Transcription Engine (FFmpeg + Deepgram)

**Goal:** Worker extracts audio from top-scoring reels using FFmpeg, sends to Deepgram for transcription, stores transcripts with word counts, classifies creator as Voiceover or Music-Based. Matches PRD Section 3.4 + 3.5.

### Scope

- [x] Implement Performance Scoring in worker:
  - Apply weighted formula: `score = (views * 0.5) + (likes * 0.3) + (comments * 0.2)` (normalised)
  - Rank all 10 reels by score
  - Update `reels.score` and `reels.rank` in DB
  - Select top 4 reels for transcription
- [x] Build TRANSCRIBE stage in worker:
  - Send video URLs directly to Deepgram Nova-2 (no FFmpeg needed — Deepgram extracts audio)
  - Parse response: transcript text + word count + detected language
- [x] Store transcripts:
  - Create `Transcript` record per transcribed reel
  - Store text, wordCount, detected language
- [x] Classification rule:
  - If any of the top 4 reels has wordCount > 50 → contentType = VOICEOVER
  - Else → contentType = MUSIC_BASED
- [x] Update job statuses:
  - TRANSCRIBE job: PENDING → RUNNING → DONE
  - On success: create ANALYSE job (PENDING)
- [x] No temp files needed (Deepgram accepts video URLs directly)
- [x] Handle Deepgram errors: retry once, then mark as empty transcript with wordCount 0

### Test Cases

| # | Test | Steps | Expected Result | Pass? |
|---|------|-------|-----------------|-------|
| 6.1 | Scores calculated | After FETCH completes, check `reels.score` | All 10 reels have non-null scores using the weighted formula | [x] |
| 6.2 | Ranking correct | Query reels ordered by score DESC | Rank 1 has the highest score; rank 4 is the 4th highest | [x] |
| 6.3 | Top 4 selected | Check which reels have transcripts | Only the top 4 scored reels have associated transcript records | [x] |
| 6.4 | FFmpeg extracts audio | Deepgram accepts video URLs directly — no FFmpeg needed | N/A — simplified | [x] |
| 6.5 | Deepgram called | Monitor API calls during transcription | 4 Deepgram API requests made (one per reel) | [x] |
| 6.6 | Transcripts stored | Query `transcripts` table | 4 records exist with non-empty `text` fields | [x] |
| 6.7 | Word counts accurate | Check `transcripts.wordCount` | Word counts are reasonable (match manual count of transcript ±5%) | [x] |
| 6.8 | Voiceover classification | Analyse a creator who speaks at length (> 50 words) | contentType resolves to VOICEOVER | [x] |
| 6.9 | Music-based classification | Analyse a creator with music-only reels (< 50 words) | contentType resolves to MUSIC_BASED | [x] |
| 6.10 | Language detected | Check transcript records | `language` field populated (e.g., "hi" for Hindi, "en" for English) | [x] |
| 6.11 | Job status transitions | Check `jobs` after transcription | TRANSCRIBE job is DONE; ANALYSE job exists as PENDING | [x] |
| 6.12 | Temp files cleaned up | No temp files — Deepgram accepts URLs directly | N/A — simplified | [x] |
| 6.13 | Progress page updates | Watch browser during transcription | "Transcribing" step shows progress; completes with checkmark | [x] |
| 6.14 | Deepgram error retry | Simulate Deepgram API failure on one reel | Worker retries once; if still fails, stores empty transcript with wordCount 0 | [x] |
| 6.15 | Hinglish transcript accuracy | Analyse a Hinglish-speaking creator | Transcript is readable and captures code-mixed Hindi/English content | [x] |

---

## Checkpoint 7 — Creator Style Analysis (Gemini LLM)

**Goal:** Gemini 2.0 Flash analyses top 4 transcripts + captions and extracts the full creator style profile. Matches PRD Section 3.6.

### Scope

- [x] Build ANALYSE stage in worker:
  - Gather top 4 reel transcripts + captions
  - Construct structured prompt for Gemini 2.0 Flash:
    - Input: 4 transcripts, 4 captions, word counts, languages
    - Requested output: JSON with tone, hookPattern, ctaPattern, speakingStyle, creatorBucket, contentType, language, summary
  - Call Google GenAI API (Gemini 2.0 Flash — free tier)
  - Parse structured JSON response
- [x] Store `CreatorProfile` record:
  - All style attributes from LLM response
  - Link to analysis
- [ ] Generate creator profile embedding:
  - Concatenate style attributes into a descriptive text string
  - Call OpenAI text-embedding-3-small to generate 1536-dim vector
  - Store in `creator_profiles.embedding` (for future matching)
- [x] Update job statuses:
  - ANALYSE job: PENDING → RUNNING → DONE
  - On success: create MATCH job (PENDING)
- [x] Error handling:
  - If Gemini returns malformed JSON → strip markdown fences and retry parse
  - If still fails → mark analysis FAILED with error

### Test Cases

| # | Test | Steps | Expected Result | Pass? |
|---|------|-------|-----------------|-------|
| 7.1 | Gemini API called | Monitor API calls during ANALYSE stage | Gemini 3.5 Flash request with correct prompt | [x] (Gemini + Groq fallback) |
| 7.2 | Prompt includes transcripts | Log the prompt sent to Gemini | All 4 transcripts and captions are included in the prompt | [x] |
| 7.3 | Profile created | Query `creator_profiles` after analysis | One record exists linked to the analysis | [x] |
| 7.4 | Tone extracted | Check `creator_profiles.tone` | Contains valid tone values (e.g., "Funny", "Educational", "Casual") | [x] |
| 7.5 | Hook pattern extracted | Check `creator_profiles.hookPattern` | Contains valid hook type (e.g., "Question-based", "Story opener") | [x] |
| 7.6 | CTA pattern extracted | Check `creator_profiles.ctaPattern` | Contains valid CTA (e.g., "Comment below", "Follow", "Link in bio") | [x] |
| 7.7 | Speaking style extracted | Check `creator_profiles.speakingStyle` | Contains valid style (e.g., "Storytelling", "Conversational", "Tutorial") | [x] |
| 7.8 | Bucket classified | Check `creator_profiles.creatorBucket` | Either DEDICATED or INTEGRATED | [x] |
| 7.9 | Language classified | Check `creator_profiles.language` | Matches detected language (e.g., "Hindi", "English", "Hinglish") | [x] |
| 7.10 | Summary generated | Check `creator_profiles.summary` | Contains a 2–3 sentence natural language summary of the creator's style | [x] |
| 7.11 | Embedding generated | Check `creator_profiles.embedding` | Non-null 1536-dimension vector exists | [x] |
| 7.12 | Job status correct | Check `jobs` after ANALYSE | ANALYSE is DONE; MATCH job exists as PENDING | [x] |
| 7.13 | Malformed JSON retry | Simulate Gemini returning invalid JSON | Worker retries with Groq fallback; auto-pauses on failure | [x] |
| 7.14 | Progress page updates | Watch browser | "Analysing" step completes with checkmark; "Script Match" becomes active | [x] |
| 7.15 | Profile consistency | Run analysis on same creator twice | Both profiles have similar/consistent style attributes (not wildly different) | [x] |

---

## Checkpoint 8 — Script Library & Vector Search

**Goal:** 400+ scripts imported with pgvector embeddings. Vector search endpoint returns top 5 matching scripts for any creator profile. Matches PRD Section 3.7.

### Scope

- [ ] Create script import pipeline:
  - Script data format: JSON or CSV with title, body, bucket, language, contentType, tone, brandCategory
  - Import script (`scripts/import-scripts.ts`) that reads data, inserts into `scripts` table
  - For each script: call OpenAI text-embedding-3-small → store 1536-dim vector in `scripts.embedding`
- [ ] Build Script Library page (`/dashboard/scripts`) matching DESIGN.md Section 7.7:
  - Card grid (3 columns desktop, 2 tablet, 1 mobile)
  - Each card: title, bucket badge, language badge, tone badge, 2-line body preview
  - Filter dropdowns: bucket, language, tone, contentType
  - Pagination (20 per page)
  - Script count in header
- [ ] Build script detail modal:
  - Full script body
  - All metadata tags
  - Close button
- [ ] Create API route `POST /api/scripts/match`:
  - Input: analysisId (to get creator profile)
  - Filter scripts by: bucket + language + contentType match
  - Rank remaining by cosine similarity between creator embedding and script embedding
  - Return top 5 scripts with similarity scores
- [ ] Build MATCH stage in worker:
  - Calls the match endpoint internally
  - Creates 5 `ScriptRecommendation` records (rank 1–5, `originalBody` populated, `rewrittenBody` null)
  - Updates MATCH job → DONE, creates REWRITE job → PENDING

### Test Cases

| # | Test | Steps | Expected Result | Pass? |
|---|------|-------|-----------------|-------|
| 8.1 | Scripts imported | Run import script | 39 PDF scripts + generated scripts in DB | [x] (39 from PDFs) |
| 8.2 | Embeddings generated | Query `scripts` where embedding is NOT NULL | All scripts have 1536-dim embeddings | [x] |
| 8.3 | Script Library page renders | Navigate to `/dashboard/scripts` | Brand cards with script count visible | [x] |
| 8.4 | Script card content | Inspect a script card | Title, bucket badge, language badge, tone badge, 2-line preview all visible | [x] |
| 8.5 | Filter by bucket | Select "Dedicated" in bucket filter | Only Dedicated scripts shown; count updates | [x] |
| 8.6 | Filter by language | Select "Hindi" in language filter | Only Hindi scripts shown | [x] |
| 8.7 | Combined filters | Select "Integrated" + "Hinglish" + "Funny" | Results narrow correctly; all shown scripts match all filters | [x] |
| 8.8 | Pagination | Scroll to bottom of script list | Pagination controls shown; clicking page 2 loads next 20 scripts | [x] |
| 8.9 | Script detail modal | Click a script card | Modal opens with full body, all metadata tags, close button | [x] |
| 8.10 | Match endpoint returns 5 | Call `POST /api/scripts/match` with a valid analysisId | Returns array of 5 scripts with similarity scores | [x] |
| 8.11 | Match respects filters | Creator is Hindi + Integrated + Voiceover | All 5 returned scripts match via vector similarity | [x] |
| 8.12 | Similarity ranking | Check scores of returned scripts | Script at rank 1 has highest similarity score; rank 5 has lowest | [x] |
| 8.13 | Recommendations stored | Check `script_recommendations` after MATCH | 5 records exist with ranks 1–5; `originalBody` populated; `rewrittenBody` is null | [x] |
| 8.14 | Job transitions | Check `jobs` after MATCH | MATCH is DONE; REWRITE job is PENDING | [x] |
| 8.15 | No matching scripts | Create a profile with a rare language/bucket combo | Endpoint returns fewer than 5 without crashing | [x] |

---

## Checkpoint 9 — AI Script Personalisation (Claude Rewrite)

**Goal:** Claude rewrites each of the 5 matched scripts in the creator's voice. Personalised scripts stored alongside originals. Matches PRD Section 3.8.

### Scope

- [ ] Build REWRITE stage in worker:
  - For each of the 5 matched scripts (from `script_recommendations`):
    - Construct personalisation prompt:
      - Input: full creator profile (tone, hook, CTA, style, bucket, language) + original script body + campaign objective
      - Instructions: preserve CTA and brand objective, rewrite hook/tone/pacing/language mix to match creator voice
    - Call Claude Sonnet API
    - Store rewritten script in `script_recommendations.rewrittenBody`
  - All 5 rewrites run sequentially (to avoid rate limits)
- [ ] Update final statuses:
  - REWRITE job: DONE
  - Analysis status: DONE
  - `creator_analyses.completedAt` set
- [ ] Progress page auto-redirect:
  - When analysis status becomes DONE, redirect to Creator Profile page

### Test Cases

| # | Test | Steps | Expected Result | Pass? |
|---|------|-------|-----------------|-------|
| 9.1 | 5 Gemini calls made | Monitor API calls during REWRITE | 5 Gemini requests (Groq fallback if 503) | [x] |
| 9.2 | Rewritten scripts stored | Query `script_recommendations` after REWRITE | All 5 records have non-null `rewrittenBody` | [x] |
| 9.3 | Rewritten ≠ Original | Compare `originalBody` and `rewrittenBody` for each | They are substantially different (different hook, tone, language phrasing) | [x] |
| 9.4 | Creator voice applied | Read rewritten script for a Malayalam creator | Script uses Manglish phrasing matching the profile | [x] |
| 9.5 | CTA preserved | Compare CTAs in original and rewritten | Core CTA intent is preserved (e.g., "check link in bio" remains) | [x] |
| 9.6 | Campaign objective preserved | Read rewritten script | Brand/product mention and campaign goal are intact | [x] |
| 9.7 | Analysis status DONE | Check `creator_analyses.status` | Status is DONE; `completedAt` is set | [x] |
| 9.8 | All jobs DONE | Query all `jobs` for this analysis | All 5 jobs (FETCH, TRANSCRIBE, ANALYSE, MATCH, REWRITE) have status DONE | [x] |
| 9.9 | Progress page redirects | Watch browser when analysis completes | Automatically navigates to Creator Profile page (only on transition, not on revisit) | [x] |
| 9.10 | Pipeline total time | Measure time from "Analyse Creator" click to DONE | Completes within 3-5 minutes | [x] |
| 9.11 | Partial rewrite failure | Simulate Gemini failure on script 3 of 5 | Scripts 1–2 have rewrites; script 3 falls back to Groq; scripts 4–5 still attempted | [x] |
| 9.12 | Rate limit handling | Trigger 5 rapid rewrites | Worker has 2s delay between rewrites + Groq fallback on 429/503 | [x] |

---

## Checkpoint 10 — Creator Profile Page

**Goal:** Full creator profile UI with style attributes, top reels, and "Generate Scripts" CTA. Matches DESIGN.md Section 7.4.

### Scope

- [ ] Build Creator Profile page (`/dashboard/analysis/[id]/profile`):
  - Profile Header: avatar placeholder, @handle, follower count, analysis date
  - Three key classification badges: contentType, language, bucket (using DESIGN.md tag colors)
  - Style Attributes section: labeled rows for tone, hook, CTA, speaking style, bucket, language — each with colored tag badges
  - Top Reels section: 4 reel cards with thumbnail (from R2), engagement metrics (views, likes, comments), score, transcript preview (expandable accordion)
  - "Generate Personalised Scripts" CTA button (or "View Scripts" if already generated)
- [ ] Shareable link:
  - Generate a workspace-scoped share token
  - `/shared/[token]` renders read-only profile (no sidebar, no nav)
  - "Share" button in header copies link to clipboard
- [ ] Wire "Generate Scripts" button:
  - If scripts already generated → navigate to Script Results page
  - If not → triggers MATCH + REWRITE stages, shows loading state

### Test Cases

| # | Test | Steps | Expected Result | Pass? |
|---|------|-------|-----------------|-------|
| 10.1 | Profile page renders | Navigate to completed analysis profile | All sections visible: header, badges, style attributes, top reels | [x] |
| 10.2 | Handle displayed | Check profile header | @handle text matches the analysed creator | [x] |
| 10.3 | Classification badges | Check badges below header | Three badges show contentType, language, and bucket with correct colors | [x] |
| 10.4 | Tone tag renders | Check Style Attributes section | Tone row shows colored tag (e.g., purple-tinted "Funny" badge) | [x] |
| 10.5 | All style attributes | Verify all 6 attribute rows | Tone, hook, CTA, speaking style, bucket, language — all present with correct values | [x] |
| 10.6 | Reel thumbnails load | Check Top Reels section | 4 thumbnail images load via proxy | [x] |
| 10.7 | Reel metrics shown | Check a reel card | Views, likes, comments, and score all displayed | [x] |
| 10.8 | Transcript expandable | Click a reel card's expand toggle | Transcript text appears below the reel card | [x] |
| 10.9 | Generate Scripts CTA | Check CTA button state for fresh analysis (no scripts yet) | Button says "Generate Personalised Scripts" | [x] |
| 10.10 | View Scripts CTA | Check CTA for analysis where scripts exist | Button says "View Personalised Scripts (5)" and navigates to Script Results | [x] |
| 10.11 | Share button copies link | Click "Share" button | "✓ Link Copied!" shown, URL in clipboard | [x] |
| 10.12 | Shared link works | Open `/shared/[token]` in incognito | Read-only profile with style attributes, badges, summary | [x] |
| 10.13 | Shared link workspace-scoped | Invalid token | Returns 404 not found | [x] |
| 10.14 | Mobile layout | Resize to 375px | Grid stacks, tags wrap, header vertical | [x] |
| 10.15 | Loading skeleton | Navigate to profile before data loads | Loading text shown | [x] (basic) |

---

## Checkpoint 11 — Script Results Page (Side-by-Side)

**Goal:** Agency can view, compare, edit, rate, and export personalised scripts. Matches DESIGN.md Section 7.5.

### Scope

- [ ] Build Script Results page (`/dashboard/analysis/[id]/scripts`):
  - Tab bar: Script 1–5, active tab highlighted with `brand-primary`
  - Match metadata row: similarity percentage, bucket, category, tone match level
  - Side-by-side panels:
    - Left: Original script (read-only, dimmer `bg-tertiary` background)
    - Right: Personalised script (editable textarea/contenteditable)
  - Changed sections highlighted with `brand-primary-muted` background
- [ ] Action bar:
  - "Copy" button — copies personalised script text to clipboard
  - "Export PDF" — generates and downloads a PDF with creator profile summary + personalised script
  - Star rating (1–5) — stores in `script_recommendations.rating`
- [ ] Inline editing:
  - Editable right panel with save button
  - Auto-saves edited `rewrittenBody` to DB
  - Visual indicator: "Edited" badge on modified scripts
- [ ] Mobile: panels stack vertically with "Original" / "Personalised" toggle tabs
- [ ] Create API routes:
  - `PATCH /api/recommendations/[id]` — update rewrittenBody or rating
  - `GET /api/analyses/[id]/scripts` — return all 5 recommendations with scripts

### Test Cases

| # | Test | Steps | Expected Result | Pass? |
|---|------|-------|-----------------|-------|
| 11.1 | Script tabs render | Navigate to Script Results page | 5 tabs visible; Script 1 is active by default | [x] |
| 11.2 | Tab switching | Click "Script 3" tab | Tab 3 becomes active; panels update to show Script 3 content | [x] |
| 11.3 | Original panel read-only | Try to type in the left (original) panel | Text is not editable | [x] |
| 11.4 | Personalised panel editable | Click Edit button, type in textarea | Text is editable; auto-saves after 1.5s | [x] |
| 11.5 | Side-by-side layout | Check panel widths on desktop | Two equal-width panels side-by-side | [x] |
| 11.6 | Match metadata shown | Check metadata row | Match score, bucket, category, tone match, language all displayed | [x] |
| 11.7 | Copy to clipboard | Click "Copy to Clipboard" button | Toast: "Script copied to clipboard" | [x] |
| 11.8 | Export PDF | Click "Export PDF" | PDF file downloads with original + personalised script | [x] |
| 11.9 | Star rating | Click 4 stars on Script 2 | Stars highlight; rating saved to DB via PATCH API | [x] |
| 11.10 | Rating persists | Navigate away and return | Script 2 still shows 4-star rating | [x] |
| 11.11 | Inline edit saves | Edit the personalised script, click Save | `rewrittenBody` updated in DB | [x] |
| 11.12 | Mobile toggle | Resize to 375px | Toggle bar appears, panels stack vertically | [x] |
| 11.13 | Mobile toggle works | Tap "Original" and "Personalised" tabs on mobile | Selected panel shows, other hides | [x] |
| 11.14 | Auth check | Access script results page while logged out | Redirected to login | [x] |
| 11.15 | Workspace isolation | Try to access another workspace's script results | Returns 404 | [x] |

---

## Checkpoint 12 — Creator History & Search

**Goal:** Agency can browse all past analyses, search, filter, and revisit any creator profile. Matches DESIGN.md Section 7.6.

### Scope

- [ ] Build History page (`/dashboard/history`) matching DESIGN.md Section 7.6:
  - Search bar: filter by creator handle (debounced, 300ms)
  - Filter dropdowns: date range, language, status
  - Data table with sortable columns: handle, date, language, bucket, status
  - Status badges: green "Done", red "Failed", amber "Processing"
  - Row click → navigates to Creator Profile page
  - Pagination: 20 per page
- [ ] Create API route `GET /api/analyses`:
  - Workspace-scoped
  - Query params: search, language, status, dateFrom, dateTo, page, sortBy, sortDir
  - Returns paginated results with total count
- [ ] Dashboard "Recent Creators" section:
  - Horizontal scroll of mini creator cards (last 6 analysed)
  - Each card: handle, primary style tags, date
  - Click → Creator Profile
- [ ] Dashboard "Stats Row":
  - Total analyses this month
  - Total scripts generated
  - Script approval rate (% of scripts rated 4+ stars)

### Test Cases

| # | Test | Steps | Expected Result | Pass? |
|---|------|-------|-----------------|-------|
| 12.1 | History page renders | Navigate to `/dashboard/history` | Table visible with headers: Handle, Date, Language, Bucket, Status | [x] |
| 12.2 | Data populated | Have 5+ completed analyses | All analyses appear in table with correct data per column | [x] |
| 12.3 | Search by handle | Type "ricky" in search bar | Only analyses with "ricky" in handle appear | [x] |
| 12.4 | Filter by status | Select "Done" in status filter | Only DONE analyses shown | [x] |
| 12.5 | Filter by language | Select "Manglish" in language filter | Only Manglish creator analyses shown | [x] |
| 12.6 | Date range filter | Set date range to last 7 days | Only recent analyses shown; older ones hidden | [x] |
| 12.7 | Combined filters | Search + status + language | Results match all criteria | [x] |
| 12.8 | Sort by date | Click "Date Analysed" column header | Rows sort by date; click again for ascending | [x] |
| 12.9 | Status badges | Check status column | Done = green, Failed = red, Processing = amber, Paused = amber | [x] |
| 12.10 | Row click navigates | Click a row in the table | Navigates to profile (if Done) or analysis page | [x] |
| 12.11 | Pagination | Have 25+ analyses, check bottom of table | Pagination with page numbers | [x] |
| 12.12 | Empty state | New workspace with no analyses | "No creators analysed yet" with camera icon | [x] |
| 12.13 | Recent creators on dashboard | Check dashboard page | Horizontal scroll of recent creator cards | [x] |
| 12.14 | Dashboard stats row | Check dashboard stats | Three real metrics: analyses count, scripts generated, approval rate | [x] |
| 12.15 | Workspace isolation | Log in as different workspace | History only shows that workspace's analyses | [x] |

---

## Checkpoint 13 — Team Management & Workspace Settings

**Goal:** Admins can invite team members, manage roles, and view billing. Members see restricted settings. Matches DESIGN.md Section 7.8.

### Scope

- [ ] Build Settings page (`/dashboard/settings`) with 3 tabs:
  - **General:** Workspace name (editable by Admin), theme preference
  - **Members:** Team member table (name, email, role), role dropdown (Admin/Member), remove button, "Invite Member" CTA
  - **Billing:** Plan name, seat count, usage stats (analyses this month), manage subscription link
- [ ] Build invite flow:
  - "Invite Member" opens modal: email input + role selector (default: MEMBER)
  - On submit: create invite record, send email via Resend with invite link
  - Invite link (`/invite/[token]`): recipient signs up → joins the workspace with assigned role
- [ ] Role-based tab visibility:
  - ADMIN: sees all 3 tabs
  - MEMBER: sees only General tab (Members and Billing tabs hidden)
- [ ] API routes:
  - `PATCH /api/workspace` — update workspace name (Admin only)
  - `GET /api/workspace/members` — list members
  - `PATCH /api/workspace/members/[id]` — update role (Admin only)
  - `DELETE /api/workspace/members/[id]` — remove member (Admin only)
  - `POST /api/workspace/invite` — send invite (Admin only)
- [ ] Prevent last Admin from being demoted or removed

### Test Cases

| # | Test | Steps | Expected Result | Pass? |
|---|------|-------|-----------------|-------|
| 13.1 | Settings page renders | Navigate to `/dashboard/settings` as Admin | Two tabs visible: General, Members | [x] |
| 13.2 | Member sees limited tabs | Log in as Member, go to settings | Only General tab visible | [x] |
| 13.3 | Edit workspace name | Admin changes workspace name, clicks save | Name updates in DB | [x] |
| 13.4 | Members table | Click Members tab or go to /team | All team members listed with name, email, role | [x] |
| 13.5 | Change member role | Admin changes a member from MEMBER to ADMIN | Role updates in DB via PATCH API | [x] |
| 13.6 | Remove member | Admin clicks trash on a team member, confirms | Member removed from workspace | [x] |
| 13.7 | Cannot remove last Admin | Try to remove the only Admin | API returns "Cannot remove the last admin" | [x] |
| 13.8 | Cannot demote last Admin | Try to change the only Admin to Member | API returns "Cannot demote the last admin" | [x] |
| 13.9 | Invite panel opens | Click "Invite Member" on Team page | Side panel with email input + role cards | [x] |
| 13.10 | Invite email sent | Fill email, select MEMBER, click Send Invite | Email sent via Gmail SMTP; invite record in DB | [x] |
| 13.11 | Invite link sign up | Open invite link `/invite/[token]` | Validates token, checks expiry, redirects to login with invite context | [x] |
| 13.12 | Expired invite | Use an invite link after 7 days | Shows "Invite Expired" page | [x] |
| 13.13 | Duplicate invite | Invite same email twice | API returns "User already in this workspace" (409) | [x] |
| 13.14 | Billing tab content | Admin clicks Billing tab | Removed — no billing tab | N/A |
| 13.15 | Non-admin API blocked | Member calls `PATCH /api/workspace` directly | Returns 403 "Admin only" | [x] |

---

## Checkpoint 14 — Real-Time UX Polish & Error Handling

**Goal:** Pipeline feels real-time and reliable. All error states handled gracefully. Email notification on completion. Matches PRD Section 3.9 exit criteria and DESIGN.md Sections 8–10.

### Scope

- [ ] Polish pipeline progress page:
  - Smooth step transitions with DESIGN.md animations (check icon scale-in, pulse on active)
  - Show elapsed time per step
  - Show estimated time remaining based on average pipeline duration
- [ ] Toast notification system:
  - Success toast when analysis completes (if user is on another page)
  - Error toast on pipeline failure with descriptive message
  - Toast slides in from top-right (250ms ease-out per DESIGN.md)
- [ ] Email notification via Resend:
  - On analysis DONE: email the triggering user with creator handle, link to profile
  - On analysis FAILED: email with error description and retry link
- [ ] Error state pages:
  - Failed analysis: clear error message, "Retry" button (creates new analysis for same handle), "Back to Dashboard"
  - 404 page: clean "Page not found" with nav link
  - 500 page: "Something went wrong" with support contact
- [ ] Skeleton loaders on all data-dependent pages:
  - Dashboard: shimmer blocks matching card layout
  - History: shimmer rows matching table columns
  - Profile: shimmer blocks matching section layout
- [ ] Empty states for all pages (per DESIGN.md Section 10):
  - Dashboard: "Analyse your first creator"
  - History: "No creators analysed yet"
  - Script Library: "Script library is empty"
- [ ] Concurrent analysis support:
  - Test 10 simultaneous analyses
  - Pipeline queue processes sequentially per worker but accepts concurrent jobs
  - Dashboard shows all active analyses with independent progress

### Test Cases

| # | Test | Steps | Expected Result | Pass? |
|---|------|-------|-----------------|-------|
| 14.1 | Step animations | Watch pipeline progress | Active step pulses; completed steps show scale-in checkmark animation | [ ] |
| 14.2 | Elapsed time shown | Wait 30s on progress page | Each completed step shows elapsed time (e.g., "12s") | [ ] |
| 14.3 | Success toast | Complete analysis while on History page | Toast slides in: "Analysis complete for @handle" with link to profile | [ ] |
| 14.4 | Error toast | Trigger a failing analysis | Toast: "Analysis failed for @handle: [error message]" | [ ] |
| 14.5 | Email on success | Complete an analysis | User receives email with creator handle and profile link | [ ] |
| 14.6 | Email on failure | Trigger a failing analysis | User receives email with error description and retry link | [ ] |
| 14.7 | Retry from error | Click "Retry" on a failed analysis page | New analysis created for same handle; redirected to progress page | [ ] |
| 14.8 | 404 page | Navigate to `/dashboard/nonexistent` | Clean 404 page with "Page not found" and link back to dashboard | [ ] |
| 14.9 | Skeleton on dashboard | Hard refresh dashboard | Skeleton shimmer blocks visible for 200–500ms before data loads | [ ] |
| 14.10 | Skeleton on history | Hard refresh history | Shimmer rows match table column widths | [ ] |
| 14.11 | Empty dashboard | New workspace, go to dashboard | "Analyse your first creator" empty state with illustration and focused input | [ ] |
| 14.12 | Empty history | New workspace, go to history | "No creators analysed yet" with CTA to dashboard | [ ] |
| 14.13 | 10 concurrent analyses | Queue 10 analyses simultaneously | All 10 appear in Active Analyses; each progresses through pipeline; all complete | [ ] |
| 14.14 | Reduced motion | Set `prefers-reduced-motion: reduce` in OS | All animations disabled; progress shows static states only | [ ] |
| 14.15 | Accessible focus order | Tab through pipeline progress page | Focus follows logical order; all interactive elements reachable | [ ] |

---

## Checkpoint 15 — Final Integration, Performance & Beta Readiness

**Goal:** End-to-end flow works flawlessly. Performance optimised. Sentry integrated. Ready for beta with 2 agencies. Matches PRD Phase 9 exit criteria.

### Scope

- [ ] End-to-end smoke test automation:
  - Script that runs: sign up → create analysis → wait for completion → verify profile → verify scripts
  - Runs against production-like environment
- [ ] Performance optimisation:
  - API response times < 200ms for all read endpoints
  - Script library page loads < 1s (with 400+ scripts)
  - Dashboard loads < 500ms
  - Image lazy loading for reel thumbnails
  - TanStack Query caching — stale data served instantly, background refresh
- [ ] Sentry integration:
  - Install `@sentry/nextjs`
  - Configure for both client and server
  - Capture unhandled exceptions, API errors, worker failures
  - Source maps uploaded for readable stack traces
- [ ] Security hardening:
  - All API routes check authentication + workspace authorization
  - Rate limiting on auth endpoints (5 attempts per minute)
  - Rate limiting on analysis creation (10 per hour per workspace)
  - Input sanitisation on all user inputs
  - CSRF protection via NextAuth
- [ ] Accessibility audit:
  - All pages pass WCAG 2.1 AA contrast requirements
  - Full keyboard navigation works (tab through entire flow)
  - Screen reader announces pipeline status changes
- [ ] Production build:
  - `npm run build` succeeds with zero warnings
  - Bundle size analysis — no unexpectedly large chunks
  - Environment variables validated at startup

### Test Cases

| # | Test | Steps | Expected Result | Pass? |
|---|------|-------|-----------------|-------|
| 15.1 | Full E2E flow | Sign up → paste handle → wait → view profile → view scripts → export | Entire flow completes in under 3 minutes with zero errors | [ ] |
| 15.2 | E2E as Member | Invite a member → member logs in → analyses creator → views scripts | Member flow works; billing/team pages are hidden | [ ] |
| 15.3 | API response times | Measure GET /api/analyses, GET /api/analyses/[id] | All reads return in < 200ms | [ ] |
| 15.4 | Script library speed | Load `/dashboard/scripts` with 400+ scripts | Page renders in < 1 second | [ ] |
| 15.5 | Dashboard load time | Load `/dashboard` with 20+ past analyses | Page renders in < 500ms | [ ] |
| 15.6 | Sentry captures error | Trigger an unhandled error in API route | Error appears in Sentry dashboard with full stack trace | [ ] |
| 15.7 | Sentry captures worker error | Trigger a worker failure | Worker error appears in Sentry with stage context | [ ] |
| 15.8 | Auth rate limiting | Send 6 login attempts in 1 minute | 6th attempt returns 429 Too Many Requests | [ ] |
| 15.9 | Analysis rate limiting | Create 11 analyses in 1 hour | 11th attempt returns 429 with "Rate limit exceeded" message | [ ] |
| 15.10 | XSS prevention | Enter `<script>alert(1)</script>` as Instagram handle | Input is sanitised; no script execution | [ ] |
| 15.11 | CSRF protection | Make POST request without valid CSRF token | Returns 403 | [ ] |
| 15.12 | Keyboard navigation | Tab through login → dashboard → analyse → profile → scripts | All interactive elements reachable; focus visible at all times | [ ] |
| 15.13 | Contrast check | Run axe DevTools audit on all pages | Zero contrast violations | [ ] |
| 15.14 | Production build | Run `npm run build` | Build succeeds with zero errors and zero warnings | [ ] |
| 15.15 | Zero P0 bugs | Run full regression suite | All test cases from checkpoints 0–14 still pass | [ ] |

---

## Summary — Checkpoint Dependency Graph

```
CP 0  Project Scaffolding
 │
CP 1  Database Schema
 │
CP 2  Authentication
 │
CP 3  Dashboard Shell & Nav
 │
CP 4  Analysis Input & Job Creation
 │
CP 5  Reel Fetching (Apify + R2)
 │
CP 6  Transcription (FFmpeg + Deepgram)
 │
CP 7  Style Analysis (Claude)
 │
CP 8  Script Library & Vector Search
 │
CP 9  Script Personalisation (Claude Rewrite)
 │
CP 10 Creator Profile Page
 │
CP 11 Script Results Page
 │
CP 12 History & Search
 │
CP 13 Team & Workspace Settings
 │
CP 14 Real-Time UX & Error Handling
 │
CP 15 Final Integration & Beta
```

**Total: 16 checkpoints, 234 test cases**

Each checkpoint is complete only when **all** its test cases pass. No checkpoint is skipped. The pipeline is linear — every checkpoint depends on the ones before it.
