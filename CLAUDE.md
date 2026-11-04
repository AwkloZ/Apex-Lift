# Apex Lift

A workout tracking web app (English and Arabic), hosted on Netlify, with Google sign-in and data in Firebase (Firestore). Plain HTML, CSS and JavaScript: no build step except tailwind.css.

## Branch rule (important)

- **`Main` is the live site** (Netlify deploys it) and the branch the owner pulls into VS Code to test. It has every app and all shared files. Everything ends up on `Main`.
- **One branch per app, holding only that app's files** (plus the few shared files the app needs to run in Live Server on its own):
  - `apex-lift`: the Apex Lift app: `index.html`, `app.js`, `style.css`, `tailwind.css`, `i18n.js`, `calc.js`, `library.js`, `require-sign-in.js`, `sw.js`, `manifest.webmanifest`, `privacy.html`, `terms.html`, `icons/`, `vendor/`, and its tools (tailwind, calc test, design check, icons).
  - `apex-coach`: the coach app: `coach.html`, `coach.js`, `coach-builder.js`, `coach-sign-in.js`, `coach-i18n.js`, `coach-sw.js`, `coach.css`, `coach.webmanifest`, and to run: `admin-utils.js`, `library.js`, `calc.js`, `i18n.js`, `privacy.html`, `icons/`, the Firebase compat files, `vendor/lucide-icons.js`, `vendor/fonts/`.
  - `apex-admin`: the admin page: `admin.html`, `admin.js`, `admin-coaches.js`, `admin.css`, and to run: `admin-coach.js`, `admin-utils.js`, `library.js`, `icons/icon-192.png`, the Firebase compat files, `vendor/fonts/`.
  - Only on `Main`: `firestore.rules`, `_headers`, `_redirects`, `docs/`, `tools/rules-test/`, `tools/coach-e2e.js`.
- **Never `git merge` an app branch into `Main`** (or `Main` into an app branch): the branch doesn't have the other apps' files, so a merge would delete them from `Main` and the live site. Move changes by copying files instead:
  - branch → Main: `git checkout -B Main origin/Main && git checkout origin/<branch> -- <the files you changed>`, commit, push `Main`.
  - Main → branch (shared files changed): on the branch, `git checkout origin/Main -- <those files>`, commit, push the branch.
- When the owner names an app ("in the coach app…"), work on that app's branch (`git fetch origin && git checkout -B <branch> origin/<branch>`), commit and push it, then copy the changed files to `Main` and push `Main` too, unless the owner says to keep it on the branch only for now. Changes to shared files (`library.js`, `admin-coach.js`, `admin-utils.js`, `vendor/`, `firestore.rules`, …) are made on `Main` and copied to the branches that have them. Rebuild `vendor/lucide-icons.js` on `Main` only (it needs every app's files).
- If the owner doesn't name an app, work on `Main` as before. Never leave work only on a separate `claude/...` branch: work on other branches gets lost between chats.
- Before starting, fetch again: another chat may have pushed since.
- After pushing, tell the owner the commit (short hash and title) and which branch(es) it is on.
- Don't send files, zips or screenshots in the chat: the owner gets everything from `Main`. This applies to every Apex chat.

## Files

- `index.html`, `app.js`, `style.css`: the app. `app.js` holds the storage, screens and cloud sync.
- `i18n.js`: the Arabic text (`AR`, `AR_COUNT`, `MUSCLE_AR`), shared as `window.APEX_I18N`. Loaded before `app.js`.
- `calc.js`: pure maths (dates, sets, sessions, progression), shared as `window.APEX_CALC`. No screen and no saved data in it. Loaded before `app.js`.
- `library.js`: exercises, muscles and ready-made programs. Shared by the app and the coach builder.
- `require-sign-in.js`: the switch that makes sign-in (Google or email) required before using the app; it also covers the app until the user is signed in. Delete the file to make sign-in optional ("Not now"); add it back to require it again. It is not in `APP_FILES` on purpose.
- Email links (reset password, confirm email) open inside the app (`?mode=...&oobCode=...`, see EMAIL LINKS in `app.js`). This needs one Firebase setting: Authentication → Templates → Customize action URL → `https://apex-liftt.netlify.app/`.
- `admin.html`, `admin.js`: the admin page (users, insights, client notes, visits).
- `admin-utils.js`: helpers shared by `admin.js` and `admin-coach.js` (`$`, `esc`, `isObj`); loaded before both.
- `admin-coach.js`: the admin page's schedule builder; sends routines and messages to `users/{uid}/coach/plan`.
- `coach-builder.js`: the coach app's routine editor, built like the app's Plan tab (the week as day cards → a day with numbered exercise cards and a sets × reps pill → the sets & reps pop-up; "Add exercises" is a bottom sheet with search and muscle chips). Sends the same `coach/plan` document as `admin-coach.js`. The phone's back steps back inside it (`back()`).
- `coach.html`, `coach.js`, `coach.webmanifest`: Apex Coach, the app for coaches (English and Arabic). A coach accepts the admin's invitation (`coach.html?invite=CODE`), makes client links (`coachCodes`, `/?coach=CODE`; each code works once: joining marks it `usedBy`/`usedAt`), sees their clients (`coaches/{uid}/members`) and sends routines and notes with `coach-builder.js` (their templates in `coaches/{uid}/templates`). Dock: Home (what needs the coach: new messages, no workout for 7+ days, low check-in today), Clients (search, sort), Chats, Invite, Account. A client opens as a full page with Overview (check-ins, training days, routines, about), Workouts (`users/{uid}/history`) and Progress (body weight, best set, e1RM). The phone's back and a swipe from the left edge close full pages.
- Coach chat: `users/{client}/chats/{coach}` (summary: last message, `readClient`/`readCoach`) and `.../messages/{id}` (`from`, `text`, `at`). Only the client and that coach while the client is in their list (the admin can't read it). In the Apex Lift app: COACH CHAT in `app.js` (Profile → Your coach → Chat, a dot on Profile for new messages, Reply on the coach card on Today).
- `coach-i18n.js`: the coach app's Arabic (`t()`), falling back to `i18n.js` for shared words; the language is the app's setting on the same device. New coach text needs Arabic here.
- `coach-sw.js`: the coach app's offline copy (scope `./coach`, separate from `sw.js`). Add new coach files to its `APP_FILES` and bump its `CACHE`.
- `coach-sign-in.js`: the coach app's sign-in (Google, or email and password with a confirmed email) and the "Confirm your email" page. Coaches must always sign in (no "Not now"); `require-sign-in.js` is only for the Apex Lift app.
- `coach.css`: the coach app's look, the same as the Apex Lift app (tokens, fonts, cards, grouped rows, floating dock with Clients / Invite / Account, full pages with the round back button, pop-up cards, dark and light theme from the same Theme setting as the app). It also styles the routine editor (`coach-builder.js`). The chat page is pinned to the visible screen (`fitChat` in `coach.js`, `chatFit` in `app.js`) so the phone's keyboard doesn't push the name off the top.
- `admin.css`: the admin page's styles.
- `admin-coaches.js`: the admin's Coaches tab: invite coaches (`coachInvites`), switch them on/off (`coaches/{uid}.active`), see and remove their clients (`coaches/{uid}/members`).
- `firestore.rules`: database security rules. They are **not** deployed by Netlify: after changing them, tell the owner to paste them into Firebase (Firestore Database → Rules → Publish) **before** deploying the site.
- `privacy.html`, `terms.html`: policy pages (English and Arabic sections).
- `sw.js`: offline cache. Add new app files to `APP_FILES`.
- `vendor/lucide-icons.js`: only the Lucide icons the app uses (built from `tools/lucide-1.49.0.min.js`). After using a new icon name (app or coach app), run `node tools/build-icons.js`. `vendor/sortable-1.15.7.min.js` (drag & drop) is loaded by `app.js` only when a Plan list can be dragged (`needSortable`).
- `_headers`, `_redirects`: Netlify settings (security headers, sign-in pass-through).
- AI coach (AI COACH in `app.js`): a chat with Google Gemini through Firebase AI Logic (free Gemini Developer API, no key in the app). Uses `vendor/firebase-12.19.0/firebase-app.js`, `firebase-ai.js` and `firebase-app-check.js` (modular files; their import of `firebase-app.js` points to `./firebase-app.js`). Models in `AI_MODELS`, App Check (Fraud Defense / reCAPTCHA Enterprise) key ID in `AI_APP_CHECK_KEY`. The chat stays on the phone; routines from Gemini are checked by `routineFromAi` (library exercises only).

## Conventions

- Keep each file's line endings: `app.js`, `admin.js`, `admin-utils.js`, `admin-coach.js`, `admin-coaches.js`, `coach.js`, `coach-builder.js`, `coach-sign-in.js`, `coach-i18n.js`, `coach.css`, `library.js`, `i18n.js`, `calc.js`, `index.html`, `admin.html`, `coach.html`, `admin.css`, `privacy.html`, `terms.html` and `style.css` use CRLF; `sw.js`, `coach-sw.js`, `tailwind.css` and `firestore.rules` use LF.
- New text shown in the app needs an Arabic translation in the `AR` table in `i18n.js`.
- After changing Tailwind classes in `index.html` or `app.js`, rebuild tailwind.css:
  `npx tailwindcss@3.4.17 -c tools/tailwind.config.js -i tools/tailwind.in.css -o tailwind.css --minify`
  and keep its first comment line.
- When the app changes, bump `APP_VERSION` in `app.js` and `CACHE` in `sw.js` together (same number).
- New data the app collects must be added to `privacy.html` (English and Arabic). For a meaningful change, bump `TERMS_VERSION` in `app.js` and the version chips in `privacy.html` and `terms.html`; users are then asked to agree again.
- New Firestore fields or collections need matching rules in `firestore.rules`; the rules only accept known fields.
- The setup only asks questions whose answers change the app for the user (program, sets, workout length, starting weight). Don't add questions just to collect data; collect that passively (device details, or the `?ref=` link source, e.g. `https://<site>/?ref=instagram`) and show it on the admin page.
- Profile: the photo card opens Account (Your information: name and date of birth can be changed, sex and height can't; then account actions). Settings: Workout and App each open their own page; Add a routine by code and Join a coach / Your coach (MY COACH in `app.js`, `?coach=CODE` links) are here too. There is no Program & data section.
- Everything must stay on the free plans (Firebase Spark, Netlify free): no Cloud Functions.

## Testing

Test rule changes in the Firestore emulator, and test app and admin changes in a browser against the emulators (Firebase Auth + Firestore) before pushing.

- Rules tests: `cd tools/rules-test && npm install && npm test` (needs Java). They load `firestore.rules` into the emulator; add a test for every rule change.
- Coach flow in a browser: `cd tools/rules-test && npm run e2e` (emulators + Playwright, `tools/coach-e2e.js`).
- Any page opened on `localhost` with `?emu=1` (e.g. `index.html?emu=1`, `admin.html?emu=1`, `coach.html?emu=1`) uses the emulators instead of the real Firebase. `?emu=1` does nothing on the real site.

Live Server in VS Code (`.vscode/settings.json`): opens on `http://localhost:5500` (not 127.0.0.1, where Google sign-in is refused). The apps: `/index.html` (Apex Lift), `/coach.html` (Apex Coach), `/admin.html` (admin). Without `?emu=1` they use the real Firebase.

Design check: `node tools/design-check.js [--lang en|ar] [--theme dark|light]` (needs Playwright) opens every app screen and lists capital-letter labels, text under 12px, tap targets under 44px (40px for text buttons), unlabeled icon buttons and outside font requests. Run it in all four combinations after changing the app's look.

## Screens and navigation (keep every screen in one of these)

- **Tabs**: the floating dock (Today, Plan, Progress, Profile), like the new Instagram: a glass capsule above the bottom edge, almost the full width, icons only, the open tab on a soft round pill with a bolder icon; the labels are for screen readers.
- **Background**: one solid colour, `--bg` (`#12100d` in dark), no gradient.
- **Full pages** (second pages): Account, Account backups, Workout, App, and the workout itself. They slide in from the side, fill the screen, and have the round back button on the left with the title in the middle (no header line). The back button, the phone's back and a swipe from the left edge all go back. Back on the workout keeps it running in the small bar.
- **Pop-up cards** (middle of the screen): the details of one thing: the exercise on Today, the exercise on Plan, sets & reps when changing an exercise, confirmations, short edits. Close by tapping outside, the phone's back, or their own button.
- **Bottom sheets**: lists and tools: add / change exercise, Coach, Add a routine by code, programs, Your training. A grab handle on top and no ✕: close with a swipe down, a tap outside, the phone's back, or a tap on the handle (it is a button labelled "Close" for screen readers: `.sheet-grab-btn` in `index.html`). The exercise list has no header at all.
- **One back button** everywhere: `backBtn()` in `app.js` / `.back-btn` (round, ‹), also Plan → This week and the setup.
- Today is for training, Plan is for editing (delete an exercise by swiping its card left).

## Design rules

- Gold (`#d4af37`) marks only "now" or "do this": today, the selected item, the main button. Other cards stay neutral.
- Labels and buttons in sentence case (no spaced-out capitals; the APEX LIFT logo is the exception). Text at least 12px.
- Numbers (weights, reps, timer, dates, stats) use the `num` class (Barlow Condensed). Colours, corners and fonts are tokens at the top of `style.css`.
- Fonts are stored in `vendor/fonts`; don't add Google Fonts links.
