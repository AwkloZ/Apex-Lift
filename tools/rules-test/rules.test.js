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

// ---------- coach invitations and coach accounts ----------
const CODE = 'ABCDEFGH';
const invite = (extra = {}) => ({ name: 'Coach Test', email: 'coach@x.com', by: ADMIN, createdAt: 1, usedBy: '', usedAt: 0, ...extra });
const COACH = 'c1', coachTok = { email: 'Coach@X.com', email_verified: true };
// the coach's claim: mark the invite used and create the coach account, in one batch
const claim = (db, uid = COACH, code = CODE) => {
    const b = db.batch();
    b.update(db.doc(`coachInvites/${code}`), { usedBy: uid, usedAt: 2 });
    b.set(db.doc(`coaches/${uid}`), { name: 'Coach Test', email: 'coach@x.com', invite: code, active: true, createdAt: 2 });
    return b.commit();
};

test('admin creates an invite; others and bad codes cannot', async () => {
    await assertSucceeds(admin().doc(`coachInvites/${CODE}`).set(invite()));
    await assertFails(as('u1', coachTok).doc('coachInvites/ZZZZZZZZ').set(invite()));
    await assertFails(admin().doc('coachInvites/ABC').set(invite()));
    await assertFails(admin().doc('coachInvites/ZZZZZZZZ').set(invite({ usedBy: 'x' })));
});
test('the invited email can read its invite (any letter case), others cannot', async () => {
    await seed(db => db.doc(`coachInvites/${CODE}`).set(invite()));
    await assertSucceeds(as(COACH, coachTok).doc(`coachInvites/${CODE}`).get());
    await assertFails(as('u2', { email: 'other@x.com', email_verified: true }).doc(`coachInvites/${CODE}`).get());
    await assertFails(as('u2', { email: 'other@x.com', email_verified: true }).collection('coachInvites').get());
});
test('claim with the verified invited email works once', async () => {
    await seed(db => db.doc(`coachInvites/${CODE}`).set(invite()));
    await assertSucceeds(claim(as(COACH, coachTok)));
    const c = await admin().doc(`coaches/${COACH}`).get();
    if (c.data().active !== true) throw new Error('coach should be active');
    // a second account with the same email can't use it again
    await assertFails(claim(as('c2', coachTok), 'c2'));
});
test('claim is refused for an unverified email or another email', async () => {
    await seed(db => db.doc(`coachInvites/${CODE}`).set(invite()));
    await assertFails(claim(as(COACH, { email: 'coach@x.com', email_verified: false })));
    await assertFails(claim(as(COACH, { email: 'other@x.com', email_verified: true })));
});
test('a coach account cannot be created without claiming an invite', async () => {
    await seed(db => db.doc(`coachInvites/${CODE}`).set(invite()));
    await assertFails(as(COACH, coachTok).doc(`coaches/${COACH}`).set({ name: 'X', email: 'coach@x.com', invite: CODE, active: true, createdAt: 2 }));
    await assertFails(as(COACH, coachTok).doc(`coaches/${COACH}`).set({ name: 'X', email: 'coach@x.com', invite: 'NOPENOPE', active: true, createdAt: 2 }));
});
test('admin switches a coach on/off; the coach can only rename', async () => {
    await seed(db => db.doc(`coaches/${COACH}`).set({ name: 'Coach Test', email: 'coach@x.com', invite: CODE, active: true, createdAt: 2 }));
    await assertSucceeds(admin().doc(`coaches/${COACH}`).update({ active: false }));
    await assertFails(admin().doc(`coaches/${COACH}`).update({ name: 'Other' }));
    await assertFails(as(COACH, coachTok).doc(`coaches/${COACH}`).update({ active: true }));
    await assertSucceeds(as(COACH, coachTok).doc(`coaches/${COACH}`).update({ name: 'Coach Renamed' }));
    await assertFails(as(COACH, coachTok).doc(`coaches/${COACH}`).update({ name: '' }));
    await assertFails(as('u2').doc(`coaches/${COACH}`).get());
    await assertSucceeds(as(COACH, coachTok).doc(`coaches/${COACH}`).get());
});
