# Apex Lift

A workout tracking web app (English and Arabic), hosted on Netlify, with Google sign-in and data in Firebase (Firestore). Plain HTML, CSS and JavaScript: no build step except tailwind.css.

## Branch rule (important)

- **All work happens on the `Main` branch.** Start from the latest `Main` (`git fetch origin Main && git checkout -B Main origin/Main`), commit there and push every change to `Main` (`git push origin Main`).
- Never leave work only on a separate `claude/...` branch: the owner tests by pulling `Main` into VS Code automatically, and work on other branches gets lost between chats.
- Before starting, pull `Main` again: another chat may have pushed since.
- After pushing, tell the owner the commit (short hash and title).
- Don't send files, zips or screenshots in the chat: the owner gets everything from `Main`. This applies to every Apex chat.

## Files

- `index.html`, `app.js`, `style.css`: the app. `app.js` holds everything (storage, screens, cloud sync, translations in the `AR` table).
- `library.js`: exercises, muscles and ready-made programs. Shared by the app and the coach builder.
- `require-sign-in.js`: the switch that makes sign-in (Google or email) required before using the app; it also covers the app until the user is signed in. Delete the file to make sign-in optional ("Not now"); add it back to require it again. It is not in `APP_FILES` on purpose.
- Email links (reset password, confirm email) open inside the app (`?mode=...&oobCode=...`, see EMAIL LINKS in `app.js`). This needs one Firebase setting: Authentication → Templates → Customize action URL → `https://apex-liftt.netlify.app/`.
- `admin.html`, `admin.js`: the admin page (users, insights, client notes, visits).
- `admin-coach.js`: the coach schedule builder; sends routines and messages to `users/{uid}/coach/plan`.
- `firestore.rules`: database security rules. They are **not** deployed by Netlify: after changing them, tell the owner to paste them into Firebase (Firestore Database → Rules → Publish) **before** deploying the site.
- `privacy.html`, `terms.html`: policy pages (English and Arabic sections).
- `sw.js`: offline cache. Add new app files to `APP_FILES`.
- `_headers`, `_redirects`: Netlify settings (security headers, sign-in pass-through).
- AI coach (AI COACH in `app.js`): a chat with Google Gemini through Firebase AI Logic (free Gemini Developer API, no key in the app). Uses `vendor/firebase-12.19.0/firebase-app.js`, `firebase-ai.js` and `firebase-app-check.js` (modular files; their import of `firebase-app.js` points to `./firebase-app.js`). Models in `AI_MODELS`, App Check (Fraud Defense / reCAPTCHA Enterprise) key ID in `AI_APP_CHECK_KEY`. The chat stays on the phone; routines from Gemini are checked by `routineFromAi` (library exercises only).

## Conventions

- Keep each file's line endings: `app.js`, `admin.js`, `admin-coach.js`, `library.js`, `index.html`, `admin.html`, `privacy.html`, `terms.html` and `style.css` use CRLF; `sw.js`, `tailwind.css` and `firestore.rules` use LF.
- New text shown in the app needs an Arabic translation in the `AR` table in `app.js`.
- After changing Tailwind classes in `index.html` or `app.js`, rebuild tailwind.css:
  `npx tailwindcss@3.4.17 -c tools/tailwind.config.js -i tools/tailwind.in.css -o tailwind.css --minify`
  and keep its first comment line.
- When the app changes, bump `APP_VERSION` in `app.js` and `CACHE` in `sw.js` together (same number).
- New data the app collects must be added to `privacy.html` (English and Arabic). For a meaningful change, bump `TERMS_VERSION` in `app.js` and the version chips in `privacy.html` and `terms.html`; users are then asked to agree again.
- New Firestore fields or collections need matching rules in `firestore.rules`; the rules only accept known fields.
- The setup only asks questions whose answers change the app for the user (program, sets, workout length, starting weight). Don't add questions just to collect data; collect that passively (device details, or the `?ref=` link source, e.g. `https://<site>/?ref=instagram`) and show it on the admin page.
- Profile: the photo card opens Account (Your information: name and date of birth can be changed, sex and height can't; then account actions). Settings: Workout and App each open their own page; Add a routine by code is here too. There is no Program & data section.
- Everything must stay on the free plans (Firebase Spark, Netlify free): no Cloud Functions.

## Testing

Test rule changes in the Firestore emulator, and test app and admin changes in a browser against the emulators (Firebase Auth + Firestore) before pushing.

Design check: `node tools/design-check.js [--lang en|ar] [--theme dark|light]` (needs Playwright) opens every app screen and lists capital-letter labels, text under 12px, tap targets under 44px (40px for text buttons), unlabeled icon buttons and outside font requests. Run it in all four combinations after changing the app's look.

## Screens and navigation (keep every screen in one of these)

- **Tabs**: the floating dock (Today, Plan, Progress, Profile), like the new Instagram: a glass capsule above the bottom edge, almost the full width, icons only, the open tab on a soft round pill with a bolder icon; the labels are for screen readers.
- **Background**: one solid colour, `--bg` (`#14130e` in dark), no gradient.
- **Full pages** (second pages): Account, Account backups, Workout, App, and the workout itself. They slide in from the side, fill the screen, and have the round back button on the left with the title in the middle (no header line). The back button, the phone's back and a swipe from the left edge all go back. Back on the workout keeps it running in the small bar.
- **Pop-up cards** (middle of the screen): the details of one thing: the exercise on Today, the exercise on Plan, sets & reps when changing an exercise, confirmations, short edits. Close by tapping outside, the phone's back, or their own button.
- **Bottom sheets**: lists and tools: add / change exercise, exercise history, Coach, Add a routine by code, programs. Close with ✕, a swipe down, a tap outside or the phone's back. The exercise list (add / change exercise) has no header: a grab handle on top, no ✕.
- **One back button** everywhere: `backBtn()` in `app.js` / `.back-btn` (round, ‹), also Plan → This week and the setup.
- Today is for training, Plan is for editing (delete an exercise by swiping its card left).

## Design rules

- Gold (`#d4af37`) marks only "now" or "do this": today, the selected item, the main button. Other cards stay neutral.
- Labels and buttons in sentence case (no spaced-out capitals; the APEX LIFT logo is the exception). Text at least 12px.
- Numbers (weights, reps, timer, dates, stats) use the `num` class (Barlow Condensed). Colours, corners and fonts are tokens at the top of `style.css`.
- Fonts are stored in `vendor/fonts`; don't add Google Fonts links.
