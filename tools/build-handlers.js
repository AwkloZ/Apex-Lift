// Builds app/handlers.js: the code of every data-on-<event>="..." in index.html and app/*.js, compiled as functions,
// so buttons work without inline JavaScript (the site's security policy forbids inline scripts; see BUTTON ACTIONS
// in app/core.js). Run after adding or changing a data-on-* attribute:   node tools/build-handlers.js
// Code passed to helpers that put it in data-on-click (backBtn, link, noticeBtn: 'window.appActions.x()') is found too.
// node tools/build-handlers.js --check : only checks that app/handlers.js is up to date (exit code 1 if not).
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'app/handlers.js');
if (!fs.existsSync(path.join(ROOT, 'app'))) { console.log('No app/ folder on this branch: nothing to build.'); process.exit(0); }

const decode = s => s.replace(/&(quot|amp|lt|gt|#39);/g, (_, e) => ({ quot: '"', amp: '&', lt: '<', gt: '>', '#39': "'" }[e]));
const codes = new Set();
const files = ['index.html', ...fs.readdirSync(path.join(ROOT, 'app')).filter(n => n.endsWith('.js') && n !== 'handlers.js').map(n => 'app/' + n)];
for (const f of files) {
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of src.matchAll(/\sdata-on-[a-z]+="([^"]*)"/g)) {
        if (/^\$\{\w+\}$/.test(m[1])) continue; // data-on-click="${onclick}": the code comes from the helper's caller (below)
        if (m[1].includes('${')) throw new Error(`${f}: data-on-* code must not contain \${...}; pass values with data-a-*: ${m[1]}`);
        codes.add(decode(m[1]));
    }
    // code given to helpers as a string: 'window.appActions.x()' or "window.appActions.x('y')"
    if (f.endsWith('.js')) for (const m of src.matchAll(/(['"])(window\.app(?:Actions|State)\.(?:(?!\1)[^\\\r\n])*)\1/g)) codes.add(m[2]);
}
const body = [...codes].sort().map(c => `    ${JSON.stringify(c)}: function (event, a) { ${c.replace(/@(\d+)/g, 'a[$1]')} }`).join(',\r\n');
const text = ['// Built by tools/build-handlers.js from the data-on-* attributes in index.html and app/*.js. Do not edit by hand:',
    '// change the attribute, then run  node tools/build-handlers.js  (see BUTTON ACTIONS in app/core.js).',
    "'use strict';", 'Object.assign(APP_HANDLERS, {', body, '});', ''].join('\r\n');
if (process.argv.includes('--check')) {
    const ok = fs.existsSync(OUT) && fs.readFileSync(OUT, 'utf8') === text;
    console.log(ok ? 'app/handlers.js is up to date' : 'app/handlers.js is out of date: run node tools/build-handlers.js');
    process.exit(ok ? 0 : 1);
}
fs.writeFileSync(OUT, text);
console.log(`app/handlers.js: ${codes.size} actions`);
