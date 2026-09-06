# DESIGN SYSTEM

## Creator Intelligence Platform

**Version 1.0 · June 2025**
**Status: DRAFT**

---

## 1. Design Philosophy

Creator Intelligence Platform is used by agency professionals — campaign managers, strategy leads, and copywriters — who process multiple creators per day. The design must be:

- **Data-dense but scannable** — show metrics, scores, and style tags at a glance without overwhelming.
- **Speed-oriented** — minimal clicks from input to output; the pipeline runs in under 3 minutes, so the UI must feel equally fast.
- **Professional & trustworthy** — agencies pay per seat; the product must look premium, not like a side-project.
- **Dark-mode first** — reduces eye strain for professionals spending hours in the tool; light mode available as toggle.

**Framework:** Next.js 15 + Tailwind CSS + shadcn/ui (as defined in PRD).

---

## 2. Color Palette

### 2.1 Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `brand-primary` | `#6C5CE7` | Primary buttons, active states, links, accents |
| `brand-primary-hover` | `#5A4BD1` | Hover state for primary elements |
| `brand-primary-light` | `#A29BFE` | Tags, badges, soft highlights |
| `brand-primary-muted` | `rgba(108, 92, 231, 0.10)` | Tinted backgrounds, selected rows |
| `brand-secondary` | `#00CEC9` | Success states, positive metrics, completion indicators |
| `brand-accent` | `#FD79A8` | Instagram-related elements, creator highlights, attention markers |

### 2.2 Neutral Palette (Dark Mode — Default)

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-primary` | `#0F0F12` | Page background |
| `bg-secondary` | `#1A1A23` | Cards, panels, sidebar |
| `bg-tertiary` | `#24243A` | Inputs, hover states, nested panels |
| `bg-elevated` | `#2A2A40` | Dropdowns, modals, tooltips |
| `border-default` | `#2E2E45` | Card borders, dividers |
| `border-subtle` | `#1E1E32` | Inner dividers, table lines |
| `text-primary` | `#F5F5F7` | Headings, primary content |
| `text-secondary` | `#A0A0B8` | Body text, descriptions |
| `text-muted` | `#6B6B80` | Placeholders, timestamps, disabled text |

### 2.3 Neutral Palette (Light Mode)

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-primary` | `#FAFAFA` | Page background |
| `bg-secondary` | `#FFFFFF` | Cards, panels, sidebar |
| `bg-tertiary` | `#F0F0F5` | Inputs, hover states |
| `bg-elevated` | `#FFFFFF` | Dropdowns, modals |
| `border-default` | `#E5E5ED` | Card borders, dividers |
| `border-subtle` | `#F0F0F5` | Inner dividers |
| `text-primary` | `#111118` | Headings, primary content |
| `text-secondary` | `#555566` | Body text, descriptions |
| `text-muted` | `#999AAD` | Placeholders, timestamps |

### 2.4 Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#00CEC9` | Pipeline complete, positive scores |
| `success-bg` | `rgba(0, 206, 201, 0.10)` | Success banners, backgrounds |
| `warning` | `#FDCB6E` | Slow pipeline, medium scores |
| `warning-bg` | `rgba(253, 203, 110, 0.10)` | Warning banners |
| `error` | `#FF6B6B` | Failed analyses, errors, destructive actions |
| `error-bg` | `rgba(255, 107, 107, 0.10)` | Error banners |
| `info` | `#74B9FF` | Tooltips, informational badges |

### 2.5 Pipeline Stage Colors

These map directly to the analysis pipeline status indicators:

| Stage | Color | Hex |
|-------|-------|-----|
| Fetching | Blue | `#74B9FF` |
| Transcribing | Amber | `#FDCB6E` |
| Analysing | Purple | `#A29BFE` |
| Done | Teal | `#00CEC9` |
| Failed | Red | `#FF6B6B` |

---

## 3. Typography

**Font Stack:** Inter (Google Fonts) — clean geometric sans-serif built for UI. Loaded via `next/font/google` for zero layout shift.

**Fallback:** `system-ui, -apple-system, sans-serif`

**Monospace (code, scores):** `JetBrains Mono` — used for embedding scores, API keys, job IDs.

### 3.1 Type Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `display` | 36px / 2.25rem | 700 (Bold) | 1.2 | Landing hero, onboarding headers |
| `h1` | 28px / 1.75rem | 700 (Bold) | 1.3 | Page titles ("Creator Analysis", "Script Library") |
| `h2` | 22px / 1.375rem | 600 (Semibold) | 1.35 | Section headers ("Style Profile", "Matched Scripts") |
| `h3` | 18px / 1.125rem | 600 (Semibold) | 1.4 | Card titles, sidebar sections |
| `h4` | 15px / 0.9375rem | 600 (Semibold) | 1.45 | Sub-labels, table group headers |
| `body` | 14px / 0.875rem | 400 (Regular) | 1.6 | Default body text, descriptions |
| `body-sm` | 13px / 0.8125rem | 400 (Regular) | 1.5 | Table cells, secondary info |
| `caption` | 12px / 0.75rem | 500 (Medium) | 1.4 | Badges, timestamps, metadata |
| `overline` | 11px / 0.6875rem | 600 (Semibold) | 1.3 | Section labels (uppercase, letter-spacing 0.08em) |
| `mono` | 13px / 0.8125rem | 400 (Regular) | 1.5 | Scores, IDs, technical values |

---

## 4. Spacing & Grid

### 4.1 Spacing Scale (Tailwind-aligned)

| Token | Value | Common Use |
|-------|-------|-----------|
| `space-1` | 4px | Tight gaps (icon-to-text) |
| `space-2` | 8px | Inline element spacing |
| `space-3` | 12px | Compact card padding |
| `space-4` | 16px | Default card padding, input padding |
| `space-5` | 20px | Section gaps |
| `space-6` | 24px | Card internal sections |
| `space-8` | 32px | Between page sections |
| `space-10` | 40px | Major section breaks |
| `space-12` | 48px | Page top/bottom margin |

### 4.2 Layout Grid

- **Max content width:** 1280px (centered)
- **Sidebar width:** 260px (collapsible to 64px icon-only)
- **Main content:** Fluid, fills remaining space
- **Card grid:** 12-column grid within main area, responsive breakpoints:
  - `≥1280px` — full layout, sidebar expanded
  - `1024–1279px` — sidebar collapsed to icons
  - `768–1023px` — sidebar hidden (hamburger), 2-column card grid
  - `<768px` — single column, stacked layout

### 4.3 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 6px | Badges, tags, small chips |
| `radius-md` | 8px | Buttons, inputs |
| `radius-lg` | 12px | Cards, panels |
| `radius-xl` | 16px | Modals, featured cards |
| `radius-full` | 9999px | Avatars, circular indicators |

---

## 5. Component Design Tokens

All components built on **shadcn/ui** with the following customisations.

### 5.1 Buttons

| Variant | Background | Text | Border | Use Case |
|---------|-----------|------|--------|----------|
| Primary | `brand-primary` | `#FFFFFF` | none | Main actions: "Analyse Creator", "Generate Scripts" |
| Secondary | `transparent` | `text-primary` | `border-default` | Secondary actions: "Cancel", "Back" |
| Ghost | `transparent` | `text-secondary` | none | Tertiary actions: sidebar nav items |
| Destructive | `error` | `#FFFFFF` | none | Delete workspace, remove member |
| Success | `success` | `#FFFFFF` | none | "Export PDF", "Copy Script" |

**Sizes:** `sm` (32px h), `md` (40px h, default), `lg` (48px h, hero CTAs)

### 5.2 Inputs

- **Height:** 40px
- **Background:** `bg-tertiary`
- **Border:** 1px `border-default`, on focus → `brand-primary`
- **Placeholder text:** `text-muted`
- **Instagram URL input:** Prefixed with Instagram icon + `instagram.com/` static text, user types only the handle

### 5.3 Cards

- **Background:** `bg-secondary`
- **Border:** 1px `border-default`
- **Radius:** `radius-lg` (12px)
- **Shadow (dark):** none (borders define edges)
- **Shadow (light):** `0 1px 3px rgba(0,0,0,0.05)`
- **Padding:** `space-6` (24px)

### 5.4 Badges & Tags

Used heavily for creator style attributes (tone, hook, CTA, language, bucket).

| Type | Background | Text | Radius |
|------|-----------|------|--------|
| Tone tag | `brand-primary-muted` | `brand-primary-light` | `radius-sm` |
| Hook tag | `rgba(253, 203, 110, 0.12)` | `#FDCB6E` | `radius-sm` |
| CTA tag | `rgba(0, 206, 201, 0.12)` | `#00CEC9` | `radius-sm` |
| Language tag | `rgba(116, 185, 255, 0.12)` | `#74B9FF` | `radius-sm` |
| Bucket tag (Dedicated) | `rgba(253, 121, 168, 0.12)` | `#FD79A8` | `radius-sm` |
| Bucket tag (Integrated) | `rgba(108, 92, 231, 0.12)` | `#A29BFE` | `radius-sm` |

### 5.5 Pipeline Progress Indicator

A horizontal multi-step progress bar shown during analysis:

```
[■ Fetching] → [■ Transcribing] → [■ Analysing] → [□ Done]
   (blue)         (amber)           (purple)       (teal)
```

- Active step: filled color + pulse animation
- Completed step: filled color + checkmark icon
- Pending step: border-only, muted text
- Failed step: red fill + error icon, stops pipeline visually

---

## 6. Iconography

**Library:** Lucide Icons (ships with shadcn/ui)

| Concept | Icon | Context |
|---------|------|---------|
| Creator / User | `User`, `UserCircle` | Profile cards, sidebar |
| Instagram | Custom IG glyph SVG | Input field, reel cards |
| Analysis / AI | `Sparkles` | Analysis trigger, AI-generated content |
| Script | `FileText` | Script library, recommendations |
| Reels / Video | `Play`, `Film` | Reel thumbnails, video indicators |
| Audio / Transcription | `Mic`, `AudioLines` | Transcription status |
| Performance / Score | `TrendingUp`, `BarChart3` | Engagement scores |
| Export | `Download`, `Copy` | PDF export, clipboard copy |
| Settings | `Settings`, `Sliders` | Workspace settings |
| Team / Workspace | `Building2`, `Users` | Workspace management |
| Search | `Search` | Creator history search |
| Filter | `Filter`, `SlidersHorizontal` | Script library filters |
| Chevron / Nav | `ChevronRight`, `ArrowLeft` | Breadcrumbs, back nav |
| Status: Success | `CheckCircle2` | Pipeline complete |
| Status: Error | `XCircle` | Pipeline failed |
| Status: Loading | `Loader2` (animated spin) | Pipeline in progress |

**Icon sizes:** 16px (inline), 20px (buttons/nav), 24px (headers), 32px (empty states)

---

## 7. Page-by-Page Layout Design

### 7.1 Login / Sign Up

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   ┌─────────────────┐  ┌────────────────────────┐   │
│   │                 │  │                        │   │
│   │   Brand panel   │  │   ┌──────────────────┐ │   │
│   │                 │  │   │  Creator Intel    │ │   │
│   │  - Logo         │  │   │  logo + tagline   │ │   │
│   │  - Tagline      │  │   └──────────────────┘ │   │
│   │  - Gradient BG  │  │                        │   │
│   │    (#6C5CE7 →   │  │   [Google OAuth btn]   │   │
│   │     #00CEC9)    │  │                        │   │
│   │                 │  │   ── or ──             │   │
│   │  - Feature      │  │                        │   │
│   │    highlights    │  │   Email ___________   │   │
│   │    (3 bullets)  │  │   Password ________   │   │
│   │                 │  │                        │   │
│   │                 │  │   [Sign In] (primary)  │   │
│   │                 │  │                        │   │
│   │                 │  │   Don't have account?  │   │
│   │                 │  │   Sign up              │   │
│   └─────────────────┘  └────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- **Layout:** Two-panel split — left 55% brand showcase, right 45% auth form.
- **Left panel:** Gradient background (`brand-primary` → `brand-secondary`), product name, tagline ("AI-powered scripts that match every creator's voice"), 3 feature bullets with icons.
- **Right panel:** Clean white/dark card with auth form.
- **Mobile:** Left panel hidden; auth form centered full-width.

---

### 7.2 Dashboard (Home)

```
┌──────────┬──────────────────────────────────────────┐
│          │  Dashboard                    [■ avatar]  │
│  SIDEBAR │──────────────────────────────────────────│
│          │                                          │
│  Logo    │  ┌─ Quick Analyse ──────────────────┐    │
│          │  │  🔗 instagram.com/ [__________]   │    │
│  ──────  │  │                     [Analyse →]   │    │
│          │  └──────────────────────────────────┘    │
│  ◆ Dash  │                                          │
│  ◇ History│ ┌─ Active Analyses ────────────────┐    │
│  ◇ Scripts│ │                                   │    │
│  ◇ Team  │  │  @creator1  ████████░░ Analysing  │    │
│  ◇ Settings│ │  @creator2  ██████████ Done ✓     │    │
│          │  │  @creator3  ██░░░░░░░░ Fetching   │    │
│          │  │                                   │    │
│  ──────  │  └──────────────────────────────────┘    │
│          │                                          │
│  WORKSPACE│  ┌─ Recent Creators ───────────────┐    │
│  Agency   │  │                                  │    │
│  name    │  │  ┌──────┐ ┌──────┐ ┌──────┐     │    │
│          │  │  │ Card │ │ Card │ │ Card │     │    │
│          │  │  │ @usr1│ │ @usr2│ │ @usr3│     │    │
│          │  │  │ tags │ │ tags │ │ tags │     │    │
│          │  │  └──────┘ └──────┘ └──────┘     │    │
│          │  │                                  │    │
│          │  └──────────────────────────────────┘    │
│          │                                          │
│  ──────  │  ┌── Stats Row ────────────────────┐    │
│  [?]Help │  │ Analyses: 47 │ Scripts: 234 │ ↑82%│   │
│  [⚙]    │  └──────────────────────────────────┘    │
└──────────┴──────────────────────────────────────────┘
```

**Sections:**

1. **Quick Analyse bar** — top of page, prominent. Instagram handle input with auto-validation. Single CTA: "Analyse Creator". This is the #1 action on the platform.
2. **Active Analyses** — live pipeline statuses with progress bars using stage colors. Polled via TanStack Query. Clicking any row opens the analysis detail.
3. **Recent Creators** — horizontal scroll of creator mini-cards (avatar, handle, primary tags, date). Click opens full profile.
4. **Stats row** — total analyses this month, scripts generated, script approval rate.

**Sidebar (persistent):**
- Logo at top (collapses to icon-only mark)
- Nav items: Dashboard, History, Script Library, Team, Settings
- Active item: `brand-primary` bg tint + left border accent
- Workspace name + plan badge at bottom
- Collapsible: 260px → 64px

---

### 7.3 Analysis Progress Page

Shown immediately after triggering "Analyse Creator". User lands here and watches progress.

```
┌──────────┬──────────────────────────────────────────┐
│          │  ← Back to Dashboard                     │
│  SIDEBAR │──────────────────────────────────────────│
│          │                                          │
│          │  Analysing @creatorhandle                 │
│          │  Started 45s ago                          │
│          │                                          │
│          │  ┌─ Pipeline Progress ───────────────┐   │
│          │  │                                    │   │
│          │  │  ✓ Fetch Reels ··· 10/10 fetched   │   │
│          │  │  ✓ Transcribe ···· 4/4 complete    │   │
│          │  │  ● Analysing ····· style profiling  │   │
│          │  │  ○ Script Match                     │   │
│          │  │  ○ AI Rewrite                       │   │
│          │  │                                    │   │
│          │  └────────────────────────────────────┘   │
│          │                                          │
│          │  ┌─ Reels Found ────────────────────┐    │
│          │  │                                   │    │
│          │  │  ┌─────┐ ┌─────┐ ┌─────┐ ...    │    │
│          │  │  │thumb│ │thumb│ │thumb│          │    │
│          │  │  │ 24K │ │ 18K │ │ 31K │ views   │    │
│          │  │  │ ★4.2│ │ ★3.8│ │ ★4.7│ score   │    │
│          │  │  └─────┘ └─────┘ └─────┘          │    │
│          │  │  Top 4 highlighted with border     │    │
│          │  └───────────────────────────────────┘    │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

- **Pipeline stepper:** Vertical list with status icons. Active step has pulse animation. Completed steps show green check. Pending steps are dimmed.
- **Reel preview grid:** As reels are fetched, thumbnails appear with view count and score. Top 4 (selected for analysis) get a purple highlight border.
- **Auto-redirect:** When pipeline reaches "Done", page transitions to Creator Profile view with a smooth animation.

---

### 7.4 Creator Profile Page

The core output page. Shown after analysis completes or when revisiting a past analysis.

```
┌──────────┬──────────────────────────────────────────┐
│          │  ← History    @creatorhandle    [Share]   │
│  SIDEBAR │──────────────────────────────────────────│
│          │                                          │
│          │  ┌─ Profile Header ─────────────────┐    │
│          │  │  ┌────┐                          │    │
│          │  │  │ AV │  @creatorhandle          │    │
│          │  │  │    │  245K followers           │    │
│          │  │  └────┘  Analysed: 24 Jun 2025   │    │
│          │  │                                  │    │
│          │  │  [Voiceover] [Hindi] [Integrated]│    │
│          │  └──────────────────────────────────┘    │
│          │                                          │
│          │  ┌─ Style Attributes ───────────────┐    │
│          │  │                                   │    │
│          │  │  Tone          [Funny] [Casual]   │    │
│          │  │  Hook          [Story opener]      │    │
│          │  │  CTA           [Comment below]     │    │
│          │  │  Speaking      [Conversational]    │    │
│          │  │  Bucket        [Integrated]        │    │
│          │  │  Language      [Hinglish]          │    │
│          │  │                                   │    │
│          │  └───────────────────────────────────┘    │
│          │                                          │
│          │  ┌─ Top Reels (scored) ─────────────┐    │
│          │  │                                   │    │
│          │  │  ┌────────┐  Reel #1   Score 4.7  │    │
│          │  │  │ thumb  │  Views: 31K           │    │
│          │  │  │  ▶     │  Likes: 2.1K          │    │
│          │  │  └────────┘  "Transcript preview…" │   │
│          │  │                                   │    │
│          │  │  ┌────────┐  Reel #2   Score 4.2  │    │
│          │  │  │ thumb  │  Views: 24K           │    │
│          │  │  └────────┘  ...                  │    │
│          │  └───────────────────────────────────┘    │
│          │                                          │
│          │  ┌──────────────────────────────────┐    │
│          │  │  [✦ Generate Personalised Scripts]│    │
│          │  └──────────────────────────────────┘    │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

**Sections:**

1. **Profile Header** — avatar (from IG), handle, follower count, analysis date. Three key classification badges: content type, language, bucket.
2. **Style Attributes** — each attribute (tone, hook, CTA, speaking style, bucket, language) displayed as a labeled row with colored tag badges. This is the LLM-extracted style fingerprint.
3. **Top Reels** — the 4 highest-scoring reels with thumbnail, engagement metrics, score, and transcript preview (expandable).
4. **Generate Scripts CTA** — large primary button to trigger script matching + AI rewrite. If scripts were already generated, shows "View Scripts" instead.

---

### 7.5 Script Results Page (Side-by-Side View)

The high-value output page. Shows matched + personalised scripts.

```
┌──────────┬──────────────────────────────────────────┐
│          │  ← @creatorhandle   Scripts (5 matches)  │
│  SIDEBAR │──────────────────────────────────────────│
│          │                                          │
│          │  ┌─ Script Tabs ────────────────────┐    │
│          │  │  [Script 1] [Script 2] [3] [4] [5]│   │
│          │  └──────────────────────────────────┘    │
│          │                                          │
│          │  Match Score: 94%    Bucket: Integrated   │
│          │  Category: Lifestyle   Tone match: High   │
│          │                                          │
│          │  ┌─ ORIGINAL ──────┬─ PERSONALISED ──┐   │
│          │  │                 │                  │   │
│          │  │  Brand script   │  Rewritten in    │   │
│          │  │  as-is from     │  @creator's      │   │
│          │  │  the library.   │  voice, tone,    │   │
│          │  │                 │  and language     │   │
│          │  │  Generic hook,  │  mix.            │   │
│          │  │  standard CTA,  │                  │   │
│          │  │  neutral tone.  │  Personalised    │   │
│          │  │                 │  hook, adapted   │   │
│          │  │                 │  CTA, matching   │   │
│          │  │                 │  speaking style. │   │
│          │  │                 │                  │   │
│          │  │  (read-only)    │  (editable)      │   │
│          │  │                 │                  │   │
│          │  └─────────────────┴──────────────────┘   │
│          │                                          │
│          │  ┌──────────────────────────────────┐    │
│          │  │  [Copy] [Export PDF] [⭐ Rate]    │    │
│          │  └──────────────────────────────────┘    │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

**Key design decisions:**

- **Tab bar** at top cycles through the 5 matched scripts. Active tab is `brand-primary`.
- **Match metadata** row shows cosine similarity score as percentage, bucket, category, and tone match level.
- **Side-by-side panels:** Left = original script (read-only, dimmer background). Right = AI-personalised script (editable with content-editable or textarea). Differences subtly highlighted with `brand-primary-muted` background on changed sections.
- **Action bar:** Copy to clipboard, Export as PDF, Star rating (1–5) for feedback loop.
- **Mobile:** Panels stack vertically with a toggle ("Original" / "Personalised").

---

### 7.6 Creator History Page

```
┌──────────┬──────────────────────────────────────────┐
│          │  Creator History              [Search 🔍]│
│  SIDEBAR │──────────────────────────────────────────│
│          │                                          │
│          │  Filters: [Date ▾] [Language ▾] [Status] │
│          │                                          │
│          │  ┌───────────────────────────────────┐   │
│          │  │ Handle   │ Date   │ Lang │ Status  │   │
│          │  │──────────│────────│──────│─────────│   │
│          │  │ @user1   │ Jun 24 │ Hindi│ ✓ Done  │   │
│          │  │ @user2   │ Jun 23 │ Eng  │ ✓ Done  │   │
│          │  │ @user3   │ Jun 23 │ Hing │ ✗ Failed│   │
│          │  │ @user4   │ Jun 22 │ Tamil│ ✓ Done  │   │
│          │  │ ...      │        │      │         │   │
│          │  └───────────────────────────────────┘   │
│          │                                          │
│          │  Showing 1–20 of 47      [← 1 2 3 →]    │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

- **Search:** Filters by creator handle, brand, or date range.
- **Table:** Sortable columns — handle, date, language, bucket, status. Row click opens Creator Profile.
- **Status badges:** Green "Done", red "Failed", amber "Processing" with matching semantic colors.
- **Pagination:** 20 items per page, standard prev/next controls.

---

### 7.7 Script Library Page

```
┌──────────┬──────────────────────────────────────────┐
│          │  Script Library (412 scripts)  [+ Add]   │
│  SIDEBAR │──────────────────────────────────────────│
│          │                                          │
│          │  Filters:                                │
│          │  [Bucket ▾] [Language ▾] [Tone ▾] [Type] │
│          │                                          │
│          │  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│          │  │ Script   │ │ Script   │ │ Script   │ │
│          │  │ Title    │ │ Title    │ │ Title    │ │
│          │  │          │ │          │ │          │ │
│          │  │ [Dedic]  │ │ [Integ]  │ │ [Dedic]  │ │
│          │  │ [Hindi]  │ │ [English]│ │ [Hing]   │ │
│          │  │ [Funny]  │ │ [Edu]    │ │ [Motiv]  │ │
│          │  │          │ │          │ │          │ │
│          │  │ Preview… │ │ Preview… │ │ Preview… │ │
│          │  └──────────┘ └──────────┘ └──────────┘ │
│          │                                          │
│          │  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│          │  │  ...     │ │  ...     │ │  ...     │ │
│          │  └──────────┘ └──────────┘ └──────────┘ │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

- **Grid layout:** 3 columns (desktop), 2 columns (tablet), 1 column (mobile).
- **Script cards:** Title, bucket badge, language badge, tone badge, 2-line preview of script body.
- **Filters:** Multi-select dropdowns for bucket, language, tone, content type. Filters persist in URL params.
- **Card click:** Opens script detail modal with full body, metadata, and embedding similarity info.

---

### 7.8 Team Page

```
┌──────────┬──────────────────────────────────────────────────┐
│          │  Team                         [+ Invite Member]  │
│  SIDEBAR │──────────────────────────────────────────────────│
│          │  3 team members                                  │
│          │                                                  │
│          │  ┌────────────────────────────────────────────┐  │
│          │  │ Name        │ Email        │ Role   │ Join │  │
│          │  │─────────────│──────────────│────────│──────│  │
│          │  │             │              │        │      │  │
│          │  │ ◉ Priya S.  │ p@agency.com │Admin ▾ │Jun 24│  │
│          │  │   [You]     │              │        │      │  │
│          │  │             │              │        │      │  │
│          │  │ ◉ Rahul K.  │ r@agency.com │Member▾ │Jun 23│  │
│          │  │             │              │        │ 🗑   │  │
│          │  │             │              │        │      │  │
│          │  │ ◉ Ankit M.  │ a@agency.com │Member▾ │Jun 22│  │
│          │  │             │              │        │ 🗑   │  │
│          │  │             │              │        │      │  │
│          │  └────────────────────────────────────────────┘  │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

**Key design decisions:**

- **Header:** "Team" title + member count + purple gradient "Invite Member" button (top right). Admin-only button.
- **Table card:** `bg-card` (#141420) with `border-subtle` (rgba(255,255,255,0.07)), rounded-14px.
- **Table columns:** Name (avatar circle + name + "You" badge), Email, Role (dropdown for admins), Joined date, Actions (trash icon for remove).
- **Avatar circle:** 34px, gradient `brand-primary` → `accent-cyan`, white initials (2 chars), 12px font-weight-700.
- **"You" badge:** 10px font, `brand-primary-muted` bg, `brand-primary` text, 4px border-radius. Shown next to current user's name.
- **Role dropdown:** `bg-tertiary` (#1a1a28), `border-subtle`, 6px radius. Admin = `brand-primary` color (#a78bfa), Member = `text-muted` (rgba(255,255,255,0.6)). Disabled for self. Only visible to Admins — Members see plain text.
- **Remove button:** Trash2 icon, `text-disabled` color (rgba(255,255,255,0.3)), hover → `error` (#f87171). Hidden for self row. Opens dark confirmation modal.
- **Invite modal:** Glassmorphic overlay (rgba(0,0,0,0.6) + backdrop-blur-4px). Card: `bg-card`, `border-hover`, rounded-14px, 420px width.
  - Title: 18px bold
  - Email input: `bg-tertiary`, `border-subtle`, rounded-8px
  - Role selector: Two toggle buttons (Member/Admin) with Shield icons. Selected = `brand-primary-muted` bg + `brand-primary` border. Unselected = `bg-tertiary` + `border-subtle`.
  - Actions: Cancel (dark) + Send Invite (purple gradient)
- **Delete modal:** Same overlay. Card: 380px, centered. Trash2 icon (red), title, warning text, Cancel + Remove (red bg) buttons.
- **Member-only view:** Members see the same table but without Role dropdown (shows plain text), no Actions column, no Invite button.

### 7.9 Settings Page

```
┌──────────┬──────────────────────────────────────────┐
│          │  Settings                                │
│  SIDEBAR │──────────────────────────────────────────│
│          │                                          │
│          │  [General] [Members]  ← tabs (Admin)     │
│          │  [General]           ← tabs (Member)     │
│          │                                          │
│          │  ── General Tab ──                       │
│          │                                          │
│          │  ┌──────────────────────────────────┐    │
│          │  │  Workspace                       │    │
│          │  │                                  │    │
│          │  │  Workspace Name                  │    │
│          │  │  [________________________]      │    │
│          │  │                                  │    │
│          │  │  [💾 Save Changes]               │    │
│          │  └──────────────────────────────────┘    │
│          │                                          │
│          │  ── Members Tab ── (same as Team page)   │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

**Key design decisions:**

- **Tabs:** Underline-style tabs. Active = white text + 2px `brand-primary` bottom border. Inactive = `text-muted` + transparent border.
- **General tab:** `bg-card` card, max-width 500px. Workspace name input (editable by Admin, disabled opacity for Members). Save button: purple gradient, success = green "Saved!" feedback (2s).
- **Members tab:** Identical to the Team page table (shared data via same API + query key).
- **Tab visibility:** Admins see General + Members. Members see only General.
- **Invite flow:** Email input + role selector → sends invite via Resend.

---

## 8. Motion & Animation

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Page transitions | Fade + slide up | 200ms | `ease-out` |
| Card hover | Subtle lift (translateY -2px) + border brightens | 150ms | `ease-in-out` |
| Pipeline step active | Soft pulse on icon | 1.5s loop | `ease-in-out` |
| Pipeline step complete | Check icon scale-in | 300ms | `spring(1, 80, 10)` |
| Modal open | Fade bg + scale card from 0.95 | 200ms | `ease-out` |
| Modal close | Reverse of open | 150ms | `ease-in` |
| Toast notifications | Slide in from top-right | 250ms | `ease-out` |
| Skeleton loading | Shimmer gradient sweep | 1.5s loop | `linear` |
| Button press | Scale to 0.97 | 100ms | `ease-in-out` |
| Sidebar collapse | Width transition | 200ms | `ease-in-out` |

**Principles:**
- No animation exceeds 300ms (except loops). The platform should feel instant.
- Skeleton loaders on all data-dependent cards (no spinners except pipeline steps).
- `prefers-reduced-motion` respected — all animations disabled.

---

## 9. Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|-----------|-------|---------------|
| `desktop-lg` | ≥1440px | Full layout, generous whitespace |
| `desktop` | 1280–1439px | Standard layout, sidebar expanded |
| `laptop` | 1024–1279px | Sidebar collapses to icon-only (64px) |
| `tablet` | 768–1023px | Sidebar hidden (hamburger menu), 2-col grid |
| `mobile` | <768px | Single column, stacked cards, bottom tab nav |

**Mobile-specific changes:**
- Sidebar becomes a bottom tab bar (5 icons: Dashboard, History, Scripts, Team, Settings)
- Script side-by-side becomes toggle tabs ("Original" | "Personalised")
- Creator profile sections stack vertically
- Quick Analyse input becomes full-width with floating action button

---

## 10. Empty States & Loading

### Empty States

Each empty state has: an illustration (simple line art in `brand-primary`), a heading, a description, and a CTA.

| Page | Heading | Description | CTA |
|------|---------|-------------|-----|
| Dashboard (no analyses) | "Analyse your first creator" | "Paste an Instagram handle above to get started. You'll have a full style profile and personalised scripts in under 3 minutes." | Focus input field |
| History (no results) | "No creators analysed yet" | "Your analysis history will appear here." | "Go to Dashboard" |
| Script Library (empty) | "Script library is empty" | "Import your brand scripts to start matching them with creators." | "Import Scripts" |
| Script Results (pending) | "Scripts are being personalised" | "Our AI is rewriting 5 scripts in @creator's voice. This takes about 30 seconds." | Animated pipeline indicator |
| Team (solo user) | "Invite your team" | "Add team members to collaborate on creator analyses and scripts." | "Invite Member" |

### Loading States

- **Page load:** Full skeleton layout matching the page structure (grey shimmer blocks).
- **Card load:** Individual card skeleton — grey rectangle for image, 3 lines for text.
- **Table load:** 5 shimmer rows matching column widths.
- **Analysis in progress:** Dedicated progress page (Section 7.3) — never a generic spinner.

---

## 11. Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Color contrast | All text meets WCAG 2.1 AA (4.5:1 body, 3:1 large text) — verified for both themes |
| Keyboard navigation | Full tab flow through all interactive elements; visible focus rings (`brand-primary` 2px outline offset 2px) |
| Screen reader | All icons have `aria-label`; status badges have `aria-live="polite"` for pipeline updates |
| Focus management | Modals trap focus; closing returns to trigger element |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` disables all transitions and animations |
| Text scaling | Layout holds at 200% browser zoom; no horizontal scroll |
| Form errors | Inline error messages with `aria-describedby` linked to inputs; never color-only indicators |

---

## 12. Tailwind Config Reference

```js
// tailwind.config.ts — key customisations over shadcn/ui defaults

colors: {
  brand: {
    primary:       '#6C5CE7',
    'primary-hover':'#5A4BD1',
    'primary-light':'#A29BFE',
    secondary:     '#00CEC9',
    accent:        '#FD79A8',
  },
  surface: {
    primary:   'var(--bg-primary)',
    secondary: 'var(--bg-secondary)',
    tertiary:  'var(--bg-tertiary)',
    elevated:  'var(--bg-elevated)',
  },
  border: {
    DEFAULT:   'var(--border-default)',
    subtle:    'var(--border-subtle)',
  },
  semantic: {
    success: '#00CEC9',
    warning: '#FDCB6E',
    error:   '#FF6B6B',
    info:    '#74B9FF',
  },
  pipeline: {
    fetching:     '#74B9FF',
    transcribing: '#FDCB6E',
    analysing:    '#A29BFE',
    done:         '#00CEC9',
    failed:       '#FF6B6B',
  },
},
fontFamily: {
  sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
},
borderRadius: {
  sm:   '6px',
  md:   '8px',
  lg:   '12px',
  xl:   '16px',
  full: '9999px',
},
```

CSS variables for theme switching are toggled via a `data-theme="dark|light"` attribute on `<html>`.
