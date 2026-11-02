// Tests for firestore.rules, run in the Firestore emulator:  cd tools/rules-test && npm test
// Each test starts from an empty database. seed() writes with the rules switched off.
const { test, before, after, beforeEach } = require('node:test');
const fs = require('fs');
const path = require('path');
const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing');

const ADMIN = 'O5aONnMMOLQI67fNpoNfu9GBrOL2';
let env;

before(async () => {
    env = await initializeTestEnvironment({
        projectId: 'demo-apex',
        firestore: { rules: fs.readFileSync(path.join(__dirname, '..', '..', 'firestore.rules'), 'utf8'), host: '127.0.0.1', port: 8080 }
    });
});
after(() => env.cleanup());
beforeEach(() => env.clearFirestore());

// a Firestore (compat) signed in as uid; token claims such as email / email_verified can be passed
const as = (uid, token = {}) => env.authenticatedContext(uid, token).firestore();
const admin = () => as(ADMIN, { email: 'admin@apexlift.app', email_verified: true });
const anon = () => env.unauthenticatedContext().firestore();
const seed = fn => env.withSecurityRulesDisabled(ctx => fn(ctx.firestore()));

const plan = (extra = {}) => ({ mode: 'note', note: 'Hi', coach: 'Coach', targetId: '', sentAt: Date.now(), appliedAt: 0, ...extra });

// ---------- today's rules (must keep working) ----------
test('owner reads own user doc', async () => {
    await seed(db => db.doc('users/u1').set({ updatedAt: 1 }));
    await assertSucceeds(as('u1').doc('users/u1').get());
});
test('a stranger cannot read a user doc', async () => {
    await seed(db => db.doc('users/u1').set({ updatedAt: 1 }));
    await assertFails(as('u2').doc('users/u1').get());
    await assertFails(anon().doc('users/u1').get());
});
test('admin reads any user doc', async () => {
    await seed(db => db.doc('users/u1').set({ updatedAt: 1 }));
    await assertSucceeds(admin().doc('users/u1').get());
});
test('admin writes a coach plan, a stranger cannot', async () => {
    await assertSucceeds(admin().doc('users/u1/coach/plan').set(plan()));
    await assertFails(as('u2').doc('users/u1/coach/plan').set(plan()));
});

module.exports = { as, admin, anon, seed, plan, ADMIN, getEnv: () => env };
