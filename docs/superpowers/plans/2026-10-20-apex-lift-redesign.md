# Apex Lift Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the app and the admin page a calmer, clearer, more athletic look while keeping the gold-on-black identity.

**Architecture:** One set of design tokens (CSS variables) in `style.css` drives colours, type and radii; the app's Tailwind classes keep working. Fonts are stored in `vendor/fonts` so the app looks the same offline. A Playwright script (`tools/design-check.js`) checks the rules below on every screen in English/Arabic and dark/light.

**Tech Stack:** Plain HTML/CSS/JS, Tailwind 3.4.17 (prebuilt `tailwind.css`), Lucide icons, Playwright (global, for checks only).

**Spec:** the design proposal agreed in chat on 2026-10-20 (keep gold on black, push to `Main`, no pinch-zoom, admin page included).

## Global Constraints

- Gold stays `#d4af37` on near-black; light mode keeps its current gold-dark text `#9a7810`.
- Fonts: Barlow Condensed (500/600/700/800) for numbers and big titles, Inter (variable) for text, Cairo (variable) for Arabic. All stored in `vendor/fonts/`, no Google Fonts request.
- No zoom: keep `maximum-scale=1.0, user-scalable=0` in `index.html`.
- Labels and buttons in sentence case; no spaced-out capitals (the APEX LIFT logo is the only exception).
- Gold marks only "now" or "do this": today, the selected item, the main button.
- Text at least 12px for anything a person needs to read (the week-strip weekday letters may stay 11px); contrast at least 4.5:1.
- Tap targets at least 44×44px.
- Keep each file's line endings (CRLF / LF as listed in `CLAUDE.md`). New text needs an Arabic entry in `AR`.
- Bump `APP_VERSION` (app.js) and `CACHE` (sw.js) together; new files go in `APP_FILES`.
- Rebuild `tailwind.css` after class changes and keep its first comment line.

## Review Focus

- Arabic layout: condensed Latin numerals next to Cairo text must sit on the same baseline and not clip.
- Light mode: every new token needs a light value; nothing may become white-on-white.
- Long exercise and routine names must still truncate, not push buttons off screen.
- Offline first load after the update: the new font files must be in `APP_FILES` or the app falls back to system fonts.
- Admin users table on a phone: no sideways scroll for the main list.

---

### Task 1: Design check script

**Files:**
- Create: `tools/design-check.js`

**Interfaces:**
- Produces: `node tools/design-check.js [--lang en|ar] [--theme dark|light]` serves the repo, opens each tab and the workout screen at 390×844, prints one line per rule failure, exits 1 if any fail, and saves screenshots to `$OUT` (default `/tmp/apex-shots`).

- [ ] **Step 1:** Write the checks: (a) no visible text with computed `text-transform: uppercase` outside `.logo-mark`; (b) no request to `fonts.googleapis.com`; (c) every visible `button` is at least 44×44px (or has `.tap-target` padding); (d) visible text under 12px is listed; (e) document fonts include "Barlow Condensed".
- [ ] **Step 2:** Run on the current app. Expected: FAIL on (a), (b), (c), (e).
- [ ] **Step 3:** Commit.

### Task 2: Tokens and fonts

**Files:**
- Create: `vendor/fonts/*.woff2`, `vendor/fonts/fonts.css`
- Modify: `style.css` (top), `index.html` (head), `sw.js` (`APP_FILES`, `CACHE`), `vendor/LICENSES.txt`

- [ ] **Step 1:** Add `@font-face` rules for the three families; remove the Google `@import`.
- [ ] **Step 2:** Add `:root` tokens: `--gold`, `--gold-ink`, `--bg`, `--surface-1/2/3`, `--line`, `--text`, `--text-2`, `--text-3`, `--good`, `--bad`, `--r-lg: 24px`, `--r-md: 18px`, `--r-sm: 12px`, `--font-num`, and their light values under `:root[data-theme="light"]`.
- [ ] **Step 3:** Run the check. Expected: (b) and (e) pass.
- [ ] **Step 4:** Commit and push to `Main`.

### Task 3: Type and labels

**Files:** Modify `app.js`, `index.html`, `style.css`, `tailwind.css`

- [ ] **Step 1:** Remove `uppercase` + `tracking-widest/wider` from labels and buttons; drop body text from `font-black` to `font-bold`/`font-semibold`; headings stay `font-black`.
- [ ] **Step 2:** Add `.num` (Barlow Condensed, tabular) and use it for weights, reps, timer, dates, stats, the summary numbers.
- [ ] **Step 3:** Raise 9–11px readable text to 12px; `text-slate-500` on dark becomes `text-slate-400`.
- [ ] **Step 4:** Run the check. Expected: (a) and (d) pass.
- [ ] **Step 5:** Commit and push.

### Task 4: Gold restraint and surfaces

**Files:** Modify `app.js` (Plan list, routine card, cards), `style.css`

- [ ] **Step 1:** Plan day cards: neutral border; gold only on today's card.
- [ ] **Step 2:** Three surface levels (page, card, inset) and the three radii from Task 2.
- [ ] **Step 3:** Screenshot review in dark and light. Commit and push.

### Task 5: Workout screen

**Files:** Modify `index.html` (active workout), `app.js` (set rows, rest timer), `style.css`

- [ ] **Step 1:** Set inputs use `.num` at 24px with readable "kg"/"reps" hints (contrast ≥ 4.5:1).
- [ ] **Step 2:** A row of set segments under the exercise name shows done / now / to do.
- [ ] **Step 3:** Rest timer: big condensed countdown with the existing bar.
- [ ] **Step 4:** 44px − / + buttons. Run the check; commit and push.

### Task 6: Accessibility, motion and copy

**Files:** Modify `app.js` (AR table, tab labels, empty states, icon buttons), `index.html`, `style.css`

- [ ] **Step 1:** Global `:focus-visible` ring in gold; `aria-label` on icon-only buttons.
- [ ] **Step 2:** Remove looping welcome animations (`float-*`, `pop-loop`, `glow-ring`) and the pulsing hint ring; keep feedback motion.
- [ ] **Step 3:** Tabs read Today · Plan · Progress · Profile (AR: اليوم · الخطة · التقدم · الملف). Progress empty state gets a "Start today's workout" button.
- [ ] **Step 4:** Run the check in `ar` and `light`. Commit and push.

### Task 7: Admin page

**Files:** Modify `admin.html`, `admin.js`, `admin-coach.js`

- [ ] **Step 1:** Use the same fonts and tokens; sentence-case headings; visible focus.
- [ ] **Step 2:** Under 720px the users table becomes a list of rows (name, last active, workouts) with no sideways scroll.
- [ ] **Step 3:** Screenshot with a stubbed user list. Commit and push.

### Task 8: Release

- [ ] **Step 1:** Bump `APP_VERSION` and `CACHE` to 32, rebuild `tailwind.css`, run the check in all four combinations.
- [ ] **Step 2:** Commit and push to `Main`; report the commit hash and title.
