// Small helpers shared by the Apex Lift app (app.js), Apex Coach (coach.js, coach-builder.js) and the admin page
// (admin.js, admin-coach.js, admin-coaches.js). Loaded before all of them.
window.ApexAdminUtils = (() => {
    'use strict';
    const $ = id => document.getElementById(id);
    // escapes any value for safe use inside HTML text or attributes (values from users are always escaped)
    const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const isObj = v => v !== null && typeof v === 'object' && !Array.isArray(v);
    // the users/{uid}/coach/plan document the admin page and the coach app send (firestore.rules checks the same shape):
    // a note only (no routine), or a routine that is added, or replaces `target` (one of the client's routines)
    const coachPlanDoc = ({ note, routine = null, target = null, activate, coach }) => {
        let doc;
        if (!routine) doc = { mode: 'note', targetId: '', note };
        else {
            // a new routine gets its own id, so sending it twice (or to two phones) never makes duplicates
            routine.id = target ? target.id : `coach_${Date.now()}`;
            doc = { mode: target ? 'replace' : 'add', targetId: target ? target.id : '', routine, note, activate };
        }
        return { ...doc, coach: String(coach || 'Coach').slice(0, 100), sentAt: Date.now(), appliedAt: 0 };
    };
    return Object.freeze({ $, esc, isObj, coachPlanDoc });
})();
