// Apex Lift: dates, sets, sessions and progression. Pure functions (no screen, no saved data), shared through window.APEX_CALC.
// Loaded before app.js. Weights may be text ("62.5") or numbers: everything here converts them with parseFloat / parseInt.
window.APEX_CALC = (() => {
    'use strict';

    // 📅 DATES
    // New logs store `ts` (a timestamp). Older logs only have the text date `d` ("15 Oct 2026 • 5:03 PM"),
    // which we read with our own parser instead of relying on the browser (handles "Sept", missing year, etc).
    const MONTHS = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
    const parseLogDate = str => {
        if (typeof str !== 'string') return NaN;
        const [datePart, timePart = ''] = str.split('•').map(x => x.trim());
        const m = datePart.match(/(\d{1,2})\s+([A-Za-z]+)\.?(?:\s+(\d{4}))?/);
        if (!m) { const t = Date.parse(datePart); return isNaN(t) ? NaN : t; }
        const mon = MONTHS.indexOf(m[2].slice(0, 3).toLowerCase());
        if (mon < 0) return NaN;
        const year = m[3] ? parseInt(m[3]) : new Date().getFullYear();
        let h = 12, min = 0;
        const tm = timePart.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
        if (tm) { h = parseInt(tm[1]); min = parseInt(tm[2]); if (tm[3]) h = (h % 12) + (tm[3].toUpperCase() === 'PM' ? 12 : 0); }
        return new Date(year, mon, parseInt(m[1]), h, min).getTime();
    };
    const logTime = log => typeof log.ts === 'number' ? log.ts : parseLogDate(log.d);
    // A log's fingerprint: same time, weight and reps = the same log (used to merge lists without duplicates)
    const logSig = l => `${logTime(l)}|${l.w}|${Array.isArray(l.s) ? l.s.join(',') : l.s}`;
    const startOfDay = t => { const d = new Date(t); d.setHours(0,0,0,0); return d.getTime(); };
    const isToday = t => !isNaN(t) && startOfDay(t) === startOfDay(Date.now());
    const formatLogDate = n => { const hr = n.getHours(); return `${n.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})} • ${hr%12||12}:${n.getMinutes().toString().padStart(2,'0')} ${hr>=12?'PM':'AM'}`; };

    // 🏋️ SETS, SESSIONS & PROGRESSION (one rule shared by the Workout tab and the Analytics tab)
    const logSets = log => Array.isArray(log.s) ? log.s.map(x => parseInt(x)).filter(x => x > 0) : (parseInt(log.s) > 0 ? [parseInt(log.s)] : []);
    const parseRange = repsStr => {
        const m = (repsStr || '').match(/(\d+)\s*-\s*(\d+)/);
        let minR = m ? parseInt(m[1]) : parseInt(repsStr), maxR = m ? parseInt(m[2]) : parseInt(repsStr);
        if (isNaN(minR)) minR = 8; if (isNaN(maxR)) maxR = 12;
        return { minR, maxR };
    };
    // Timed exercises use seconds instead of reps, e.g. "30 - 45s" or "60 sec"
    const isTimed = repsStr => /\d\s*(s|sec|secs|seconds)\s*$/i.test((repsStr || '').trim());
    const unitOf = repsStr => isTimed(repsStr) ? 's' : '';

    // Every set of a log as { w, r, rpe }. Older logs have one weight for all sets.
    const logSetDetails = log => {
        const reps = Array.isArray(log.s) ? log.s.map(x => parseInt(x)) : [parseInt(log.s)];
        return reps.map((r, i) => ({
            w: parseFloat(Array.isArray(log.ws) && log.ws[i] !== undefined ? log.ws[i] : log.w) || 0,
            r,
            rpe: Array.isArray(log.rpe) && typeof log.rpe[i] === 'number' ? log.rpe[i] : null
        })).filter(x => x.r > 0);
    };

    // The last training session: all logs from the most recent day are combined into one session.
    // Progression looks at the sets done with your heaviest weight that day (warm-ups / drop sets are ignored).
    const getLastSession = (hA, skipToday = false) => {
        const logs = (hA || []).filter(l => !isNaN(logTime(l)) && !(skipToday && isToday(logTime(l))));
        if (!logs.length) return null;
        const day = startOfDay(logTime(logs[logs.length - 1]));
        const all = logs.filter(l => startOfDay(logTime(l)) === day).flatMap(logSetDetails);
        if (!all.length) return null;
        const topW = Math.max(...all.map(x => x.w));
        const top = all.filter(x => x.w === topW);
        const rpes = top.map(x => x.rpe).filter(x => x !== null);
        return { w: topW, sets: top.map(x => x.r), rpe: rpes.length ? Math.max(...rpes) : null };
    };

    // Smarter weight jumps: about 5% of the current weight, rounded to a jump gyms actually have (1, 2.5 or 5 kg)
    const weightStep = w => {
        if (!(w > 0)) return 2.5; // bodyweight: first time adding weight
        const pct = w * 0.05;
        return [1, 2.5, 5].reduce((best, step) => Math.abs(step - pct) < Math.abs(best - pct) ? step : best, 1);
    };
    const roundHalf = x => Math.round(x * 2) / 2;

    // Rule:
    // - Level Up: EVERY set reached the top of the range (and, if you logged RPE, it wasn't a 9-10 grind)
    // - Deload: even your BEST set was below the bottom of the range
    // - Build: otherwise, +1 rep on your weakest set (or repeat the top of the range if it was a grind)
    const getProgression = (session, repsStr) => {
        if (!session || !session.sets.length) return null;
        const { minR, maxR } = parseRange(repsStr);
        const w = session.w, low = Math.min(...session.sets), best = Math.max(...session.sets);
        const base = { w, sets: session.sets, rpe: session.rpe, minR, maxR };
        if (low >= maxR && !(session.rpe >= 9)) return { ...base, type: 'up', tW: w + weightStep(w), tR: minR };
        if (best < minR) return { ...base, type: 'down', tW: roundHalf(w * 0.9), tR: maxR };
        return { ...base, type: 'build', tW: w, tR: Math.min(low + 1, maxR) };
    };

    return Object.freeze({ parseLogDate, logTime, logSig, startOfDay, isToday, formatLogDate, logSets, parseRange, isTimed, unitOf, logSetDetails, getLastSession, weightStep, roundHalf, getProgression });
})();
