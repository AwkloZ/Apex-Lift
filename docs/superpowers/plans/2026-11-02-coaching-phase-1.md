# Coaching Phase 1: Coaches, Access and the Coach App — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The admin invites coaches; a coach signs in to a new coach app (`coach.html`), invites clients with a code, sees their clients and sends them routines and notes; clients join or leave a coach from the Apex Lift app.

**Architecture:** Same Firebase project and the same plain-JS style as `admin.html`. Who may do what is decided only by `firestore.rules`: a coach exists when `coaches/{uid}` exists and is `active`; a coach may read and coach a client only while `coaches/{coachUid}/members/{clientUid}` exists. The existing coach builder (`admin-coach.js`) and the client's existing `users/{uid}/coach/plan` listener (`applyCoach` in `app.js`) are reused unchanged in behaviour, so a coach's routine reaches the client exactly like the admin's does today.

**Tech Stack:** Plain HTML/CSS/JS, Firebase compat 12.19.0 (Auth + Firestore, already in `vendor/`), Firestore rules v2, Firebase emulators + `@firebase/rules-unit-testing` 6 (dev only, in `tools/rules-test/`), Playwright (global) for browser checks.

**Spec:** the coaching discussion in chat on 2026-11-02. The coach's Google-Sheet system (daily tracker, weekly rating, training block, nutrition table, form videos, 2-week review) is the long-term target. Owner decisions: form videos not in v1; calories simple (target + "hit it?"); steps and cardio typed by hand; coaches only by the admin's invitation; chat inside the app; payments outside the app; privacy and terms updates postponed by the owner. **This plan is phase 1 only:** roles, access, invitations, the coach app shell, joining and leaving a coach, sending routines and notes. Daily tracker, weekly check-in, nutrition table and chat come in later plans built on this one.

## Global Constraints

- Everything stays on the free plans (Firebase Spark, Netlify free): no Cloud Functions, no Firebase Storage, no custom claims.
- Access rules live in `firestore.rules`; the pages only hide what the rules would refuse anyway.
- Codes use the alphabet and length of routine codes: `^[A-HJ-NP-Z2-9]{8}$`.
- A client has at most one coach at a time.
- Keep each file's line endings (see `CLAUDE.md`). New files: `coach.js`, `coach.html` CRLF like `admin.js`/`admin.html`; `tools/rules-test/*` LF.
- New text in the client app needs an Arabic entry in `AR` (`i18n.js`). The coach app is English, like `admin.html`, in this phase.
- Bump `APP_VERSION` (`app.js`) and `CACHE` (`sw.js`) together when `app.js` changes.
- After changing `firestore.rules`, the owner must publish them in Firebase **before** the site is deployed; say so when pushing.
- Push to `Main` (see `CLAUDE.md`); report the short hash and title.

## Data model (all tasks use exactly these names)

| Path | Fields | Written by |
|---|---|---|
| `coachInvites/{code}` | `name` (≤100), `email` (lower-case, ≤200), `by` (admin uid), `createdAt` (int), `usedBy` (`''` until claimed), `usedAt` (int, 0 until claimed) | admin creates; the invited coach sets `usedBy`/`usedAt` once |
| `coaches/{coachUid}` | `name` (≤100), `email`, `invite` (code), `active` (bool), `createdAt` (int) | coach creates when claiming; admin changes only `active`; coach changes only `name` |
| `coaches/{coachUid}/members/{clientUid}` | `code`, `name` (≤100), `email` (≤200), `joinedAt` (int) | client creates when joining; client, coach or admin deletes |
| `coaches/{coachUid}/templates/{id}` | same as `coachTemplates`: `name`, `routine`, `updatedAt` | the coach |
| `coachCodes/{code}` | `coach` (uid), `name` (coach name ≤100), `createdAt` (int) | the coach |
| `users/{uid}/coach/link` | `coachId`, `coachName` (≤100), `code`, `joinedAt` (int) | the client |
| `users/{uid}/coach/plan` | unchanged; now also writable by the client's coach | admin or the client's coach |

The subcollection is `members`, not `clients`: a top-level `clients` collection (admin notes) already exists, and a collection-group read of `clients` would mix them.

## Review Focus

- A coach the admin switched off (`active: false`) must lose all access to clients at once, including sending routines. Test in Task 3.
- An invite must work once, only for the email it was made for, and only with a verified email (an email/password account that never confirmed its address must be refused). Test in Task 2.
- Someone with a client's code but no real coach behind it (code deleted, coach switched off) must not be able to attach to anything, and the client app must say so instead of failing silently. Tests in Task 3 and Task 6.
- A client who leaves, or is removed by the coach, must stop being readable at once, and the app must notice a removal made elsewhere (the `link` doc points at a `members` doc that no longer exists) and show "no coach". Tests in Task 3 and Task 6.
- Joining a second coach while one is set must not leave the client attached to both. Test in Task 6.

---

### Task 1: Rules test harness and emulator switch

**Files:**
- Create: `tools/rules-test/package.json`, `tools/rules-test/firebase.json`, `tools/rules-test/rules.test.js`, `.gitignore`
- Modify: `app.js` (`loadFirebase`), `admin.js` (after `firebase.initializeApp`), `CLAUDE.md` (Testing)

**Interfaces:**
- Produces: `cd tools/rules-test && npm test` runs `firebase emulators:exec --only firestore --project demo-apex "node --test rules.test.js"` against `../../firestore.rules`. Helpers in `rules.test.js`: `as(uid, {email, email_verified})` returns a Firestore for that user; `admin()` uses uid `O5aONnMMOLQI67fNpoNfu9GBrOL2`; `seed(fn)` writes with rules off.
- Produces: emulator switch used by every page: on `localhost`/`127.0.0.1` only, with `?emu=1` in the address, `auth.useEmulator('http://127.0.0.1:9099')` and `db.useEmulator('127.0.0.1', 8080)` are called before any read. `?emu=1` is ignored on any other host.

- [x] **Step 1:** `package.json` (private, devDependencies `firebase-tools@15.34.2`, `@firebase/rules-unit-testing@6.0.0`, `firebase@12.19.0`), `firebase.json` (rules path `../../firestore.rules`, firestore 8080, auth 9099), `.gitignore` with `node_modules/`.
- [x] **Step 2:** Write baseline tests for today's rules: owner reads own `users/{uid}`, a stranger can't; admin reads any `users/{uid}`; admin writes a valid `coach/plan`, a stranger can't.
- [x] **Step 3:** Run `npm test`. Expected: 4 passing.
- [x] **Step 4:** Add the emulator switch to `app.js` and `admin.js`; add a "Rules tests" line under Testing in `CLAUDE.md`.
- [x] **Step 5:** Run `node tools/design-check.js` (unchanged result) and commit.

### Task 2: Rules — coach invitations and coach accounts

**Files:**
- Modify: `firestore.rules`, `tools/rules-test/rules.test.js`

**Interfaces:**
- Produces rule functions `isCoach()` (`coaches/{auth.uid}` exists and `active == true`) and `myEmail()` (`request.auth.token.email.lower()`), used by Task 3.
- Claiming is one batch from the coach: update `coachInvites/{code}` setting only `usedBy = auth.uid`, `usedAt = int`; create `coaches/{auth.uid}` with `invite = code`, `active = true`. The create rule uses `getAfter(coachInvites/{code}).data.usedBy == request.auth.uid`.

- [x] **Step 1: Write the failing tests**
  - `admin creates an invite` (valid code, fields as in the data model) → allowed; non-admin → denied; bad code `ABC` → denied.
  - `invited coach reads own invite` (token email matches, any case) → allowed; other email → denied.
  - `claim with verified matching email` → batch allowed; afterwards `coaches/{uid}.active == true`.
  - `claim twice` (second account, same email) → denied; `claim with email_verified false` → denied; `claim with other email` → denied.
  - `create coaches/{uid} without claiming` → denied.
  - `admin sets active false` → allowed; admin changing `name` → denied; coach changing own `active` → denied; coach changing own `name` → allowed.
- [x] **Step 2:** Run `npm test`. Expected: the new tests FAIL.
- [x] **Step 3:** Add `match /coachInvites/{code}` and `match /coaches/{coachId}` (read: owner or admin; delete: admin) to `firestore.rules`, with a comment block in the file's plain style.
- [x] **Step 4:** Run `npm test`. Expected: all PASS.
- [x] **Step 5:** Commit.

### Task 3: Rules — client codes, joining, leaving and coach access

**Files:**
- Modify: `firestore.rules`, `tools/rules-test/rules.test.js`

**Interfaces:**
- Consumes: `isCoach()` from Task 2.
- Produces rule function `isCoachOf(uid)` = `isCoach() && exists(/coaches/$(request.auth.uid)/members/$(uid))`.
- Joining is one batch from the client: create `coaches/{coachId}/members/{auth.uid}` (allowed when `coachCodes/{code}.coach == coachId` and `coaches/{coachId}.active == true`) and create `users/{auth.uid}/coach/link` (allowed when `existsAfter` the members doc). Leaving: delete both.
- Coach gets: read `users/{uid}`, `users/{uid}/history/*`, `users/{uid}/presence/*`, `users/{uid}/coach/*`; create/update `users/{uid}/coach/plan` with the existing field checks (rule becomes `(isAdmin() || isCoachOf(uid)) && …`); delete `users/{uid}/coach/link` and `coaches/{me}/members/{uid}`. No access to `backups`.
- `coachCodes/{code}`: create by `isCoach()` with `coach == auth.uid`; `get` by anyone signed in; `list`/`delete` by its coach or admin. `coaches/{c}/templates/{id}`: read/write by coach `c` while `isCoach()`, same field checks as `coachTemplates`.
- Admin also reads all `members` with a collection-group rule `match /{path=**}/members/{uid}`.

- [x] **Step 1: Write the failing tests**
  - `coach creates a client code` → allowed; inactive coach → denied; non-coach → denied; code with `coach` ≠ self → denied.
  - `client joins with a valid code` (batch) → allowed; then `coach reads users/{client}` and `history` → allowed; `coach reads backups` → denied.
  - `join with a deleted code` → denied; `join a switched-off coach` → denied; `link without members doc` → denied.
  - `coach sends coach/plan to own client` → allowed; to a stranger → denied.
  - `admin switches the coach off` → coach reads of `users/{client}` and plan writes → denied.
  - `client leaves` (deletes both) → coach read denied afterwards; `coach removes client` (deletes members) → allowed, then read denied.
  - `coach templates` → own allowed, another coach's denied.
  - Every existing baseline test still passes.
- [x] **Step 2:** Run `npm test`. Expected: new tests FAIL.
- [x] **Step 3:** Implement the rules; update the header comment of `firestore.rules` (who can read what).
- [x] **Step 4:** Run `npm test`. Expected: all PASS.
- [x] **Step 5:** Commit.

### Task 4: Admin page — Coaches tab

**Files:**
- Modify: `admin.js`, `admin.html` (styles only if needed)
- Create: `tools/coach-e2e.js` (browser test against the emulators; extended in Tasks 5–6)

**Interfaces:**
- Consumes: data model; emulator switch (Task 1).
- Produces: `tools/coach-e2e.js` starts the emulators (or expects them on 8080/9099), creates accounts with the Auth emulator REST call `accounts:batchCreate` (fixed `localId`, `emailVerified: true`), serves the repo and drives pages with `?emu=1`. Run: `cd tools/rules-test && npx firebase emulators:exec --only firestore,auth --project demo-apex "node ../coach-e2e.js"`.

- [x] **Step 1: Write the failing browser test** `admin invites a coach`: admin opens `admin.html?emu=1`, opens **Coaches**, enters name "Coach Test" and email, gets a code matching `^[A-HJ-NP-Z2-9]{8}$` and a link `…/coach.html?invite=CODE`; the list shows the coach as **Invited**. Then (data seeded as claimed) the list shows **Active**, the client count, and **Switch off** sets `active: false`.
- [x] **Step 2:** Run it. Expected: FAIL (no Coaches tab).
- [x] **Step 3:** Add the **Coaches** tab beside the existing tabs: invite form (name, email → creates `coachInvites/{code}`, shows link with a Copy button); list of invites (Invited / Used, delete unused) and coaches (name, email, joined, client count from the `members` collection group, Active / Off toggle); a coach's row opens their clients with **Remove from coach** (deletes the `members` doc and the client's `coach/link`). Log `coach` actions to `adminLog` as today.
- [x] **Step 4:** Run the browser test. Expected: PASS.
- [x] **Step 5:** Commit.

### Task 5: Coach app — sign-in, invite claim and client list

**Files:**
- Create: `coach.html`, `coach.js`, `coach.webmanifest`
- Modify: `admin-coach.js` (one option), `_headers` (CSP and `noindex` like `/admin.html`), `tools/coach-e2e.js`, `CLAUDE.md` (Files)

**Interfaces:**
- Consumes: rules from Tasks 2–3; `ApexAdminUtils` (`admin-utils.js`), `APEX_LIB` (`library.js`), `ApexCoach.open(opts)` (`admin-coach.js`).
- Produces: `ApexCoach.open` accepts `opts.templatesPath` (default `'coachTemplates'`); the coach app passes `coaches/{uid}/templates`. The admin page keeps working without passing it.
- Coach app states, decided in this order after sign-in: invite in the address and not yet claimed → **Claim** screen ("You're invited as {name}"); no `coaches/{uid}` → **Not a coach** (shows email, "ask Apex Lift for an invitation"); `active == false` → **Switched off**; otherwise → **Clients**.
- Sign-in: Google and email/password, the same Firebase config and auth domain rule as `admin.js`.

- [x] **Step 1: Write the failing browser tests** in `tools/coach-e2e.js`:
  - `coach claims an invite`: open `coach.html?emu=1&invite=CODE`, sign in as the invited email, tap **Accept** → Clients screen, empty state "No clients yet".
  - `wrong account`: another email on the same link → message "This invitation is for another email".
  - `switched off`: after the admin switches the coach off and the page reloads → **Switched off** screen.
  - `client code`: **Invite a client** creates a code (8 letters) shown with a copy button and a link `https://…/?coach=CODE`; deleting it removes it from the list.
- [x] **Step 2:** Run. Expected: FAIL.
- [x] **Step 3:** Build `coach.html` (same look as `admin.html`: tokens, Inter/Cairo from `vendor/fonts`, phone-first list) and `coach.js` (an IIFE like `admin.js`): states above; client list from `coaches/{uid}/members` (name, email, joined, last active from `users/{uid}.activity`/`updatedAt`); client-code sheet; `coach.webmanifest` (`start_url: coach.html`, own name "Apex Coach"). Add the emulator switch.
- [x] **Step 4:** Run. Expected: PASS.
- [x] **Step 5:** Commit.

### Task 6: Client app — join and leave a coach

**Files:**
- Modify: `app.js`, `index.html` (Profile → App settings, next to "Add a routine by code"), `i18n.js`, `sw.js`, `tools/coach-e2e.js`

**Interfaces:**
- Consumes: join/leave batches from Task 3; `coachCodes/{code}` fields.
- Produces: `window.appActions.openCoachSheet(code = '')`, `coachJoin()`, `coachLeave()`; the app also opens the sheet when started with `?coach=CODE` (same way `?code=` opens routine codes today).
- Profile row "Your coach": shows the coach's name when `users/{uid}/coach/link` exists and its `members` doc exists; otherwise "Join a coach". The app re-checks on sign-in and when the app comes back to the screen; a link whose `members` doc is gone is deleted and the row shows "Join a coach" again.
- Joining while a coach is set: confirm "Leave {old} and join {new}?", then the leave batch, then the join batch.
- Sign-in is required to join (signed-out: "Sign in to join a coach").

- [x] **Step 1: Write the failing browser tests**:
  - `join with code`: signed-in client opens `index.html?emu=1&coach=CODE` → sheet shows "Join {coach name}?", **Join** → row shows the coach's name; the coach app lists the client.
  - `bad code` → "This code doesn't work. Check it with your coach."
  - `removed elsewhere`: admin removes the client → after the app comes back to the screen, the row shows "Join a coach".
  - `switch coach`: joining a second coach leaves the first (first coach's list no longer shows the client).
  - `coach sends a routine`: from the coach app's client page (Task 5 builder) → the client app shows "Your coach updated your routine" (existing `applyCoach`).
  - Arabic: every new string has an `AR` entry (the test switches to `ar` and checks no English text in the sheet).
- [x] **Step 2:** Run. Expected: FAIL.
- [x] **Step 3:** Implement; in the coach app's client page add **Send a routine**, **Edit a routine**, **Send a message** buttons calling `ApexCoach.open` with `templatesPath`; bump `APP_VERSION`/`CACHE`; rebuild `tailwind.css` if classes were added; run `node tools/build-icons.js` if a new icon is used.
- [x] **Step 4:** Run the browser tests, `npm test` (rules) and `node tools/design-check.js` in en/ar × dark/light. Expected: all PASS.
- [x] **Step 5:** Commit, push to `Main`, and tell the owner to publish `firestore.rules` before the deploy reaches users.
