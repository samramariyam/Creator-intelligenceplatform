# Feature Roadmap — Creator Intelligence Platform

**Last Updated:** 2 Jul 2026
**Version:** 1.0

---

## 🔴 P0 — Must Have (Blocks paying customers)

### Dashboard
| # | Feature | Description | Status |
|---|---|---|---|
| 1 | Bulk/batch analysis | CSV upload or multi-handle input to analyse 20-50 creators at once | ✅ Done |
| 2 | Usage quota display | Show "X of Y analyses remaining this month" on dashboard | ❌ Not started |
| 3 | "This Month" dropdown | Stats row dropdown renders but does nothing — wire it to filter by time period | ✅ Done |

### Creator Profile
| # | Feature | Description | Status |
|---|---|---|---|
| 4 | Follower count | Fetch and display follower count from Apify data | ⏭️ Skipped — Apify reel scraper doesn't return profile-level follower count |
| 5 | Engagement rate | Calculate (likes+comments)/views per reel and display on profile | ✅ Done |
| 6 | Audience demographics | Age, gender, location breakdown — needs additional API (Phyllo/Modash) | ❌ Not started |

### Script Results
| # | Feature | Description | Status |
|---|---|---|---|
| 7 | Real match scores | Replace hardcoded [94, 87, 82, 76, 71] with actual cosine similarity from embeddings | ✅ Done |
| 8 | Multiple script variants | Generate 2-3 rewrite variants per script, not just 1 | ❌ Not started |

### Script Library
| # | Feature | Description | Status |
|---|---|---|---|
| 9 | Bulk script import | CSV/spreadsheet upload for 100+ scripts at once | ✅ Done |
| 10 | Auto-embed on add | Generate embedding when script is added via modal (currently only worker generates) | ✅ Done |

### Pipeline
| # | Feature | Description | Status |
|---|---|---|---|
| 11 | TikTok + YouTube Shorts | Support multi-platform creator analysis, not just Instagram | ❌ Not started |

---

## 🟡 P1 — Important (Differentiators for paid plan)

### Dashboard
| # | Feature | Description | Status |
|---|---|---|---|
| 12 | Campaign/project grouping | Tie analyses to a client or campaign brief | ✅ Done |
| 13 | Re-analyse action | Button to re-run analysis on an existing creator (style changes over time) | ✅ Done |
| 14 | Notification bell | In-app notification when analysis completes (if user is on another page) | ✅ Done |

### Analysis Progress
| # | Feature | Description | Status |
|---|---|---|---|
| 15 | Error details exposed | Show actionable error messages ("Apify rate limit", "no reels found") not just "Failed" | ✅ Done |
| 16 | Email notification on completion | Send email when analysis finishes using existing SMTP setup | ✅ Done |

### Creator Profile
| # | Feature | Description | Status |
|---|---|---|---|
| 17 | Similar creators | Recommend creators with similar style using embedding cosine similarity | ✅ Done |
| 18 | Exportable creator one-pager PDF | Media kit format with profile summary, style attributes, top reels | ✅ Done |
| 19 | Historical comparison | Re-analyse and compare how creator's style evolved over time | ❌ Not started |

### Script Results
| # | Feature | Description | Status |
|---|---|---|---|
| 20 | Approval workflow | Approve/reject/request changes with comments for team collaboration | ❌ Not started |
| 21 | Send to creator | Email/WhatsApp share link to deliver the personalised script | ❌ Not started |
| 22 | Version history | Track all edits to rewritten scripts with timestamps | ❌ Not started |
| 23 | Word count + estimated duration | Show word count and estimated reel duration on rewritten script | ✅ Done |

### Script Library
| # | Feature | Description | Status |
|---|---|---|---|
| 24 | Persistent bookmarks | Save bookmarks to DB instead of client-side useState (resets on refresh) | ❌ Not started |
| 25 | Script performance tracking | Track how many times each script was matched and average rating | ✅ Done |

### History
| # | Feature | Description | Status |
|---|---|---|---|
| 26 | Export to CSV/Excel | Download analysis history for client reporting | ✅ Done |
| 27 | Bulk delete / bulk re-analyse | Select multiple analyses for batch operations | ✅ Done |
| 28 | Comparison mode | Select 2+ creators side-by-side for campaign shortlisting | ❌ Not started |

### Team
| # | Feature | Description | Status |
|---|---|---|---|
| 29 | Activity log | Track who analysed what creator and when | ✅ Done |
| 30 | Granular permissions | View-only, edit-scripts-only, can-delete access levels | ✅ Done |

### Login / Auth
| # | Feature | Description | Status |
|---|---|---|---|
| 31 | Forgot password flow | Button exists but no password reset email — wire it up | ✅ Done |
| 32 | Email verification on signup | Send verification email before granting access | ✅ Done |

### Global / Sidebar
| # | Feature | Description | Status |
|---|---|---|---|
| 33 | Campaigns/Projects section | New sidebar item — organize analyses by client/campaign | ✅ Done |
| 34 | Creators CRM page | Browse all analysed creators as a searchable database with filters | ✅ Done |
| 35 | Mobile responsive navigation | Hamburger menu, responsive layouts across all pages | ✅ Done |

---

## 🟢 P2 — Nice to Have (Delight features)

| # | Feature | Description | Status |
|---|---|---|---|
| 36 | Onboarding tour | Interactive guide for new users on first login | ✅ Done |
| 37 | Brand safety / content flags | Flag inappropriate content in creator's reels | ❌ Not started |
| 38 | Google Docs / Notion export | Export scripts to external tools | ❌ Not started |
| 39 | Script folder/tag organization | Organize scripts beyond brand category | ❌ Not started |
| 40 | Duplicate script detection | Warn when adding similar scripts | ❌ Not started |
| 41 | SSO/SAML for enterprise | Single sign-on for large agencies | ❌ Not started |
| 42 | API key management | Programmatic access for agencies with custom integrations | ❌ Not started |
| 43 | White-label / branding | Custom logo, colors, domain for agency clients | ❌ Not started |
| 44 | Per-member usage tracking | Track each team member's analysis count | ❌ Not started |
| 45 | Webhook callbacks | HTTP webhooks on analysis completion for external integrations | ❌ Not started |

---

## 💰 Top 5 Revenue-Driving Features

These features move the product from "interesting tool" to "must-have paid product" ($500/month):

1. **Campaigns/Projects** (#33) — organize everything by client — this is how agencies think
2. **Audience demographics** (#6) — without this, agencies can't justify creator selection to brands
3. **Bulk analysis** (#1) — one-by-one analysis is a dealbreaker for agencies with 100+ creators
4. **Multi-platform** (#11) — TikTok + YouTube Shorts — Instagram-only limits the market by 60%
5. **Export everything** (#18, #26) — PDF media kits, CSV history, shareable links — agencies live in presentations

---

## ✅ Already Completed (for reference)

| Feature | Status |
|---|---|
| Instagram creator analysis (FETCH → TRANSCRIBE → ANALYSE) | ✅ Done |
| Creator style profiling (tone, hook, CTA, language, bucket) | ✅ Done |
| Script library with brand categorization | ✅ Done |
| Vector embedding matching (creator ↔ script) | ✅ Done |
| AI script rewriting in regional languages (Manglish, Hinglish, Tanglish) | ✅ Done |
| Side-by-side original vs personalised script view | ✅ Done |
| Script regeneration per-script | ✅ Done |
| Copy to clipboard + Export as PDF | ✅ Done |
| Star rating for scripts | ✅ Done |
| Creator history with search, filter, sort | ✅ Done |
| Team management with invite flow (Gmail SMTP) | ✅ Done |
| Settings page (workspace name, members) | ✅ Done |
| Pause/resume analysis with auto-pause on errors | ✅ Done |
| Duplicate analysis prevention | ✅ Done |
| Proxy image SSRF protection | ✅ Done |
| Rate limiting (signup, analysis creation) | ✅ Done |
| 116 unit tests passing | ✅ Done |
| 22 E2E test cases (Playwright) | ✅ Done |
