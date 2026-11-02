// Builds vendor/lucide-icons.js: only the icons the app uses, instead of the full Lucide file (~445 KB, 2,100+ icons).
// Run after adding a new icon name to index.html or app.js:   node tools/build-icons.js
// It keeps every quoted word in those files that is a Lucide icon name, so icons picked in code
// (e.g. icon: 'moon' or `${ok ? 'check' : 'plus'}`) are kept too.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const lucide = require(path.join(ROOT, 'tools/lucide-1.49.0.min.js'));

// same name rule as Lucide: "alert-triangle" -> "AlertTriangle"
const pascal = s => s.replace(/(^|[-_\s]+)([a-z0-9])/g, (_, __, c) => c.toUpperCase());

const used = new Set();
for (const f of ['index.html', 'app.js']) {
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of src.matchAll(/["'`]([a-z][a-z0-9]*(?:-[a-z0-9]+)*)["'`]/g)) {
        if (lucide.icons[pascal(m[1])]) used.add(m[1]);
    }
}
const names = [...used].sort();
const icons = Object.fromEntries(names.map(n => [n, lucide.icons[pascal(n)]]));

const out = `/* Lucide icons (ISC license, see vendor/LICENSES.txt), only the ${names.length} icons Apex Lift uses.
   Built by tools/build-icons.js from lucide-1.49.0. Do not edit by hand. */
(function () {
    'use strict';
    var ICONS = ${JSON.stringify(icons)};
    var BASE = { xmlns: 'http://www.w3.org/2000/svg', width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
    var NS = 'http://www.w3.org/2000/svg';
    var make = function (node) {
        var el = document.createElementNS(NS, node[0]);
        Object.keys(node[1]).forEach(function (k) { el.setAttribute(k, String(node[1][k])); });
        (node[2] || []).forEach(function (c) { el.appendChild(make(c)); });
        return el;
    };
    var replace = function (el) {
        var name = el.getAttribute('data-lucide'), data = ICONS[name];
        if (!data) { console.warn('Icon not in vendor/lucide-icons.js (run node tools/build-icons.js): ' + name); return; }
        var attrs = {}, own = {}, labelled = false;
        Array.prototype.forEach.call(el.attributes, function (a) { own[a.name] = a.value; if (a.name.indexOf('aria-') === 0 || a.name === 'role' || a.name === 'title') labelled = true; });
        Object.assign(attrs, BASE, { 'data-lucide': name }, labelled ? {} : { 'aria-hidden': 'true' }, own);
        attrs['class'] = ['lucide', 'lucide-' + name].concat((own['class'] || '').split(' ')).filter(function (c, i, a) { return c && a.indexOf(c) === i; }).join(' ');
        var svg = make(['svg', attrs, data]);
        if (el.parentNode) el.parentNode.replaceChild(svg, el);
    };
    // Same call as Lucide: lucide.createIcons() or lucide.createIcons({ root: element })
    var createIcons = function (opts) {
        var root = (opts && opts.root) || document;
        // already-drawn icons are <svg data-lucide>, so only the new <i data-lucide> placeholders are touched
        Array.prototype.forEach.call(root.querySelectorAll('[data-lucide]:not(svg)'), replace);
    };
    window.lucide = { createIcons: createIcons, icons: ICONS };
})();
`;
fs.writeFileSync(path.join(ROOT, 'vendor/lucide-icons.js'), out);
console.log(`vendor/lucide-icons.js: ${names.length} icons, ${(out.length / 1024).toFixed(1)} KB`);
