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
- `admin.html`, `admin.js`: the admin page (users, insights, client notes, visits).
- `admin-coach.js`: the coach schedule builder; sends routines and messages to `users/{uid}/coach/plan`.
- `firestore.rules`: database security rules. They are **not** deployed by Netlify: after changing them, tell the owner to paste them into Firebase (Firestore Database → Rules → Publish) **before** deploying the site.
- `privacy.html`, `terms.html`: policy pages (English and Arabic sections).
- `sw.js`: offline cache. Add new app files to `APP_FILES`.
- `_headers`, `_redirects`: Netlify settings (security headers, sign-in pass-through).

## Conventions

- Keep each file's line endings: `app.js`, `admin.js`, `admin-coach.js`, `library.js`, `index.html`, `admin.html`, `privacy.html`, `terms.html` and `style.css` use CRLF; `sw.js`, `tailwind.css` and `firestore.rules` use LF.
- New text shown in the app needs an Arabic translation in the `AR` table in `app.js`.
- After changing Tailwind classes in `index.html` or `app.js`, rebuild tailwind.css:
  `npx tailwindcss@3.4.17 -c tools/tailwind.config.js -i tools/tailwind.in.css -o tailwind.css --minify`
  and keep its first comment line.
- When the app changes, bump `APP_VERSION` in `app.js` and `CACHE` in `sw.js` together (same number).
- New data the app collects must be added to `privacy.html` (English and Arabic). For a meaningful change, bump `TERMS_VERSION` in `app.js` and the version chips in `privacy.html` and `terms.html`; users are then asked to agree again.
- New Firestore fields or collections need matching rules in `firestore.rules`; the rules only accept known fields.
- Everything must stay on the free plans (Firebase Spark, Netlify free): no Cloud Functions.

## Testing

Test rule changes in the Firestore emulator, and test app and admin changes in a browser against the emulators (Firebase Auth + Firestore) before pushing.
