// Apex Lift admin page: small helpers shared by admin.js and admin-coach.js (loaded before both).
window.ApexAdminUtils = (() => {
    'use strict';
    const $ = id => document.getElementById(id);
    // every value shown on the admin page comes from users, so all of it is escaped
    const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const isObj = v => v !== null && typeof v === 'object' && !Array.isArray(v);
    return Object.freeze({ $, esc, isObj });
})();
