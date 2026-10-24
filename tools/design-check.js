// Design check: opens the app in a headless browser and checks the design rules on each screen.
// Run from the repo folder:  node tools/design-check.js [--lang en|ar] [--theme dark|light]
// Needs Playwright (npm i -g playwright). Screenshots go to $OUT (default /tmp/apex-shots).
// Exit code 1 = a rule failed; each failure is printed on its own line.
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const arg = (name, def) => { const i = process.argv.indexOf('--' + name); return i > 0 ? process.argv[i + 1] : def; };
const LANG = arg('lang', 'en'), THEME = arg('theme', 'dark');
const OUT = process.env.OUT || '/tmp/apex-shots';
const ROOT = path.join(__dirname, '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json', '.json': 'application/json' };

// small text that is allowed: the week strip has 7 narrow columns
const SMALL_OK = '.wk-wd, .wk-wo';

const serve = () => new Promise(res => {
    const s = http.createServer((req, rsp) => {
        const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
        if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rsp.writeHead(404); return rsp.end(); }
        rsp.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
        fs.createReadStream(f).pipe(rsp);
    }).listen(0, () => res(s));
});

// runs in the page: every rule failure on what is visible now
const audit = smallOk => {
    const out = [];
    const shown = el => { const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false; const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.opacity !== '0'; };
    const top = el => { const r = el.getBoundingClientRect(); const x = r.left + r.width / 2, y = r.top + r.height / 2; if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return false; const hit = document.elementFromPoint(x, y); return !!hit && (el.contains(hit) || hit.contains(el)); };
    const label = el => (el.innerText || el.textContent || el.getAttribute('aria-label') || String(el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className)).trim().replace(/\s+/g, ' ').slice(0, 40);
    for (const el of document.querySelectorAll('body *')) {
        const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
        if (!hasText || !shown(el) || !top(el)) continue;
        const cs = getComputedStyle(el);
        if (cs.textTransform === 'uppercase' && !el.closest('.logo-mark')) out.push(`capitals: "${label(el)}"`);
        // capitals typed into the text itself (short names like RPE, CSV or BW are fine)
        const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join(' ');
        const caps = (own.match(/\b[A-Z]{3,}\b/g) || []).filter(w => !['APEX', 'LIFT', 'RPE', 'CSV', 'PDF', 'UID', 'PHUL', 'PPL'].includes(w));
        if (caps.length && !el.closest('.logo-mark')) out.push(`typed capitals "${caps.join(' ')}": "${label(el)}"`);
        if (parseFloat(cs.fontSize) < 12 && !el.closest(smallOk)) out.push(`small text ${cs.fontSize}: "${label(el)}"`);
    }
    for (const b of document.querySelectorAll('button, [role="button"], a[onclick]')) {
        if (!shown(b) || !top(b)) continue;
        const r = b.getBoundingClientRect(), text = (b.innerText || '').trim();
        if (!text && !b.getAttribute('aria-label')) out.push(`icon button without a label: ${b.outerHTML.slice(0, 80)}`);
        const minH = text ? 40 : 44;
        if (r.height < minH - 0.5 || (!text && r.width < 43.5)) out.push(`small tap target ${Math.round(r.width)}x${Math.round(r.height)}: "${label(b)}"`);
    }
    return out;
};

(async () => {
    fs.mkdirSync(OUT, { recursive: true });
    const server = await serve();
    const base = `http://localhost:${server.address().port}`;
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    const fails = [];
    page.on('request', r => { if (/fonts\.(googleapis|gstatic)\.com/.test(r.url())) fails.push(`outside font request: ${r.url()}`); });
    page.on('pageerror', e => fails.push(`page error: ${e.message}`));
    await page.route('**/require-sign-in.js', r => r.fulfill({ status: 200, contentType: 'text/javascript', body: '' }));
    await page.route(/firebase|googleapis|gstatic|google\.com/, r => r.abort());
    await page.addInitScript(([lang, theme]) => {
        try {
            localStorage.setItem('workoutLang_rakan_final', lang); localStorage.setItem('workoutTheme_rakan_final', theme);
            // About you filled in, so it doesn't cover the app after a reload
            if (!localStorage.getItem('workoutBody_rakan_final')) localStorage.setItem('workoutBody_rakan_final', JSON.stringify({ birthYear: 1995, birthDate: '1995-05-20', sex: 'male', heightCm: 178, weightKg: 80, locked: true }));
        } catch (e) {}
    }, [LANG, THEME]);
    await page.goto(base + '/index.html');
    await page.waitForTimeout(1500);
    const shot = async (name, prep) => {
        if (prep) await prep();
        await page.waitForTimeout(900);
        await page.screenshot({ path: `${OUT}/${LANG}-${THEME}-${name}.png` });
        for (const f of await page.evaluate(audit, SMALL_OK)) fails.push(`[${name}] ${f}`);
    };
    await shot('setup');
    await page.evaluate(() => { const W = window.appState.wiz; Object.assign(W, { goal: 'muscle', days: '4', exp: 'mid', eq: 'gym', session: '60' }); window.appActions.wizFinish('program'); });
    await page.waitForTimeout(4500); // let the "ready" message go
    await shot('today');
    for (const t of ['plan', 'progress', 'profile']) await shot(t, () => page.evaluate(t => window.appActions.switchTab(t), t));
    await page.evaluate(() => window.appActions.switchTab('today'));
    await page.waitForTimeout(600);
    // on a rest day Today has no exercises: open the first training day of the week
    await shot('exercise', async () => { if (!(await page.$('.ex-card'))) await page.evaluate(() => [...document.querySelectorAll('.wk-day:not(.is-rest)')].find(b => b.offsetParent).click()); await page.waitForTimeout(400); await page.click('.ex-card'); });
    await shot('workout', () => page.click('#ex-sheet-content button[onclick*="startWorkout"]'));
    // tick off the first set: the row turns green and the rest timer shows
    await shot('rest', async () => { await page.fill('#aw-sets-container input[id^="aw-w-"]', '60'); await page.fill('#aw-sets-container input[id^="aw-rep-"]', '8'); await page.click('#aw-title'); });
    // save the workout: the summary shows, and Progress has data from now on
    await page.evaluate(() => window.appActions.finishActiveWorkout('yes'));
    await shot('summary', () => page.evaluate(() => window.appActions.showSummary({ title: 'Upper Body', duration: 3420, sets: 21, volume: 8450, prs: [] })));
    // every other screen and pop-up, each from a fresh load (the app keeps its data in localStorage)
    const fresh = async () => { await page.goto(base + '/index.html'); await page.waitForTimeout(1200); };
    const act = js => async () => { await fresh(); await page.evaluate(js); };
    for (const p of ['overview', 'exercises', 'volume', 'body'])
        await shot('progress-' + p, act(`window.appActions.switchTab('progress'); window.appActions.progressTab('${p}')`));
    await shot('history', act(`window.appActions.openHistoryModal(Object.keys(JSON.parse(localStorage.getItem('workoutHistory_rakan_final') || '{}'))[0] || 'x', 'Bench Press')`));
    await shot('plan-day', act(`window.appActions.switchTab('plan'); window.appActions.openPlanDay(new Date().getDay() === 6 ? 1 : 1)`));
    await shot('picker', async () => { await page.evaluate(() => window.appActions.openPicker('add')); });
    await shot('plan-edit', act(`window.appActions.switchTab('plan'); window.appActions.toggleWeekEdit()`));
    await shot('picker-change', act(`window.appActions.switchTab('plan'); window.appActions.openPlanDay(getActiveFirstDay()); window.appActions.openPicker('replace', 0)`.replace('getActiveFirstDay()', `(JSON.parse(localStorage.getItem('workoutPlan_rakan_final_v3')).weeks[0].schedule.find(d => !d.isRest && d.exercises.length) || {}).id`)));
    await shot('settings-workout', act(`window.appActions.openSettings('workout')`));
    await shot('settings-app', act(`window.appActions.openSettings('app')`));
    // AI coach: the first-time notice, then a chat with a routine (written straight into the phone's chat, no Gemini needed)
    await shot('ai-start', act(`localStorage.removeItem('workoutAiOk_rakan_final'); localStorage.removeItem('workoutAiChat_rakan_final'); window.appActions.openAI()`));
    await shot('ai', act(`const w = JSON.parse(localStorage.getItem('workoutPlan_rakan_final_v3')).weeks[0];
        localStorage.setItem('workoutAiOk_rakan_final', '1');
        localStorage.setItem('workoutAiChat_rakan_final', JSON.stringify([{ r: 'u', x: 'Build the best program for me' }, { r: 'm', x: 'Here is a 4 day program.\\n- Big lifts first\\n- Add weight when you reach the top of the reps', rt: { name: 'Upper / Lower', schedule: w.schedule } }]));
        window.appActions.openAI(); window.appActions.aiToggle(1)`));
    await shot('code', act(`window.appActions.openCodeSheet()`));
    await shot('email', act(`window.appActions.openEmail('up')`));
    await shot('confirm', act(`window.appActions.showConfirm('Delete this routine?', 'Your history is kept.', () => {}, true)`));
    await shot('wizard', act(`window.appActions.startWizard(false)`));
    // the intro pages and the sign-in page (shown before the app on a new phone)
    await page.evaluate(() => localStorage.setItem('workoutTestGate', '1'));
    await shot('welcome', fresh);
    await shot('welcome-signin', () => page.evaluate(() => { const el = document.getElementById('welcome-slides'); el.scrollTo({ left: el.scrollWidth }); }));
    await page.evaluate(() => localStorage.removeItem('workoutTestGate'));
    const barlow = await page.evaluate(async () => { await document.fonts.ready; return [...document.fonts].some(f => /Barlow Condensed/.test(f.family) && f.status === 'loaded'); });
    if (!barlow) fails.push('Barlow Condensed is not loaded');
    await browser.close(); server.close();
    const uniq = [...new Set(fails)];
    uniq.forEach(f => console.log(f));
    console.log(uniq.length ? `\n${uniq.length} problem(s) — ${LANG}/${THEME}, screenshots in ${OUT}` : `All checks passed — ${LANG}/${THEME}, screenshots in ${OUT}`);
    process.exit(uniq.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
