// Tests for calc.js (pure maths). Run from the repo folder:  node tools/calc-test.js
// Exit code 1 = a test failed.
const fs = require('fs'), path = require('path'), vm = require('vm');
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'calc.js'), 'utf8'), ctx);
const C = ctx.window.APEX_CALC;
let failed = 0;
const eq = (name, got, want) => { const a = JSON.stringify(got), b = JSON.stringify(want); if (a === b) console.log('ok  ', name); else { failed++; console.log('FAIL', name, '\n     got ', a, '\n     want', b); } };

// dates
const d = new Date(C.parseLogDate('15 Oct 2026 • 5:03 PM'));
eq('old text date is read', [d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()], [2026, 9, 15, 17, 3]);
eq('"Sept" is read as September', new Date(C.parseLogDate('3 Sept 2025')).getMonth(), 8);
eq('12 AM is midnight', new Date(C.parseLogDate('1 Jan 2026 • 12:10 AM')).getHours(), 0);
eq('rubbish date is NaN', isNaN(C.parseLogDate('not a date')), true);
eq('non-text date is NaN', isNaN(C.parseLogDate(42)), true);
eq('ts wins over the text date', C.logTime({ ts: 1000, d: '1 Jan 2020' }), 1000);
eq('date text round trip', C.parseLogDate(C.formatLogDate(new Date(2026, 4, 9, 7, 5))), new Date(2026, 4, 9, 7, 5).getTime());

// sets and reps
eq('reps as text or numbers', C.logSets({ s: ['10', 8, 'x', 0] }), [10, 8]);
eq('one rep count (older logs)', C.logSets({ s: '12' }), [12]);
eq('range "8 - 12"', C.parseRange('8 - 12'), { minR: 8, maxR: 12 });
eq('single number "5"', C.parseRange('5'), { minR: 5, maxR: 5 });
eq('empty range uses 8-12', C.parseRange(''), { minR: 8, maxR: 12 });
eq('timed "30 - 45s"', C.isTimed('30 - 45s'), true);
eq('not timed "10"', C.isTimed('10'), false);

// weights stored as text are converted (no "10" + "50" = "1050")
const det = C.logSetDetails({ w: '60', ws: ['62.5', '60'], s: [10, 8], rpe: [8, null] });
eq('set details are numbers', det, [{ w: 62.5, r: 10, rpe: 8 }, { w: 60, r: 8, rpe: null }]);
eq('volume of the log', det.reduce((a, x) => a + x.w * x.r, 0), 1105);
eq('bodyweight set = 0 kg', C.logSetDetails({ w: '', s: [12] }), [{ w: 0, r: 12, rpe: null }]);

// sessions and progression
const day = new Date(2026, 9, 10, 18).getTime();
const hist = [{ ts: day - 7 * 864e5, w: '50', s: [12, 12, 12] }, { ts: day, w: '60', s: [12, 12, 12] }, { ts: day + 60000, w: '40', s: [15] }];
eq('last session = heaviest sets of the last day', C.getLastSession(hist), { w: 60, sets: [12, 12, 12], rpe: null });
eq('level up when every set hits the top', C.getProgression(C.getLastSession(hist), '8 - 12').type, 'up');
eq('level up weight +2.5 kg at 60 kg', C.getProgression(C.getLastSession(hist), '8 - 12').tW, 62.5);
eq('build: +1 rep on the weakest set', C.getProgression({ w: 60, sets: [10, 9, 8], rpe: null }, '8 - 12').tR, 9);
eq('deload: 10% lighter', C.getProgression({ w: 100, sets: [5, 4], rpe: null }, '8 - 12'), { w: 100, sets: [5, 4], rpe: null, minR: 8, maxR: 12, type: 'down', tW: 90, tR: 12 });
eq('a grind (RPE 9) does not level up', C.getProgression({ w: 60, sets: [12, 12], rpe: 9 }, '8 - 12').type, 'build');
eq('no session, no advice', C.getProgression(null, '8 - 12'), null);
eq('weight step at 20 kg is 1 kg', C.weightStep(20), 1);
eq('weight step at 120 kg is 5 kg', C.weightStep(120), 5);
eq('same log = same fingerprint', C.logSig({ ts: 5, w: '60', s: [10, 8] }), '5|60|10,8');

console.log(failed ? `\n${failed} test(s) failed` : '\nAll calc.js tests passed');
process.exit(failed ? 1 : 0);
