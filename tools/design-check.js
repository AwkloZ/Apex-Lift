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
    const label = el => (el.innerText || el.getAttribute('aria-label') || el.className.toString()).trim().replace(/\s+/g, ' ').slice(0, 40);
    for (const el of document.querySelectorAll('body *')) {
        const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
        if (!own || !shown(el) || !top(el)) continue;
        const cs = getComputedStyle(el);
        if (cs.textTransform === 'uppercase' && !el.closest('.logo-mark')) out.push(`capitals: "${label(el)}"`);
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
        try { localStorage.setItem('workoutLang_rakan_final', lang); localStorage.setItem('workoutTheme_rakan_final', theme); } catch (e) {}
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
    await page.evaluate(() => { const W = window.appState.wiz; Object.assign(W, { goal: 'muscle', days: 4, exp: 'mid', eq: 'gym' }); window.appActions.wizFinish('program'); });
    await page.waitForTimeout(4500); // let the "ready" message go
    await shot('today');
    for (const t of ['plan', 'progress', 'profile']) await shot(t, () => page.evaluate(t => window.appActions.switchTab(t), t));
    await page.evaluate(() => window.appActions.switchTab('today'));
    await page.waitForTimeout(600);
    await shot('exercise', () => page.click('.ex-card'));
    await shot('workout', () => page.click('#ex-sheet-content button[onclick*="startWorkout"]'));
    // tick off the first set: the row turns green and the rest timer shows
    await shot('rest', async () => { await page.fill('#aw-sets-container input[id^="aw-w-"]', '60'); await page.fill('#aw-sets-container input[id^="aw-rep-"]', '8'); await page.click('#aw-title'); });
    const barlow = await page.evaluate(async () => { await document.fonts.ready; return [...document.fonts].some(f => /Barlow Condensed/.test(f.family) && f.status === 'loaded'); });
    if (!barlow) fails.push('Barlow Condensed is not loaded');
    await browser.close(); server.close();
    const uniq = [...new Set(fails)];
    uniq.forEach(f => console.log(f));
    console.log(uniq.length ? `\n${uniq.length} problem(s) — ${LANG}/${THEME}, screenshots in ${OUT}` : `All checks passed — ${LANG}/${THEME}, screenshots in ${OUT}`);
    process.exit(uniq.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
