// Small helpers shared by the Apex Lift app (app.js), Apex Coach (coach.js, coach-builder.js) and the admin page
// (admin.js, admin-coach.js, admin-coaches.js). Loaded before all of them.
window.ApexAdminUtils = (() => {
    'use strict';
    const $ = id => document.getElementById(id);
    // escapes any value for safe use inside HTML text or attributes (values from users are always escaped)
    const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const isObj = v => v !== null && typeof v === 'object' && !Array.isArray(v);
    return Object.freeze({ $, esc, isObj });
})();
