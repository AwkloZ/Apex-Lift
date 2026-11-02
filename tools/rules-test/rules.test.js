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

// ---------- client codes, joining, leaving and coach access ----------
const KCODE = 'KKKKKKKK', CLIENT = 'k1', clientTok = { email: 'client@x.com', email_verified: true };
const seedCoach = (active = true, uid = COACH) => seed(db => db.doc(`coaches/${uid}`).set({ name: 'Coach Test', email: 'coach@x.com', invite: CODE, active, createdAt: 2 }));
const seedCode = (coach = COACH, code = KCODE) => seed(db => db.doc(`coachCodes/${code}`).set({ coach, name: 'Coach Test', createdAt: 3 }));
const seedClient = () => seed(async db => {
    await db.doc(`users/${CLIENT}`).set({ updatedAt: 1 });
    await db.doc(`users/${CLIENT}/history/global_bench`).set({ logs: [] });
    await db.doc(`users/${CLIENT}/backups/1`).set({ createdAt: 1 });
});
// the client's join: the coach's member list + the client's own link, in one batch
const join = (db, coach = COACH, code = KCODE, uid = CLIENT) => {
    const b = db.batch();
    b.set(db.doc(`coaches/${coach}/members/${uid}`), { code, name: 'Client', email: 'client@x.com', joinedAt: 4 });
    b.set(db.doc(`users/${uid}/coach/link`), { coachId: coach, coachName: 'Coach Test', code, joinedAt: 4 });
    return b.commit();
};
const leave = (db, coach = COACH, uid = CLIENT) => {
    const b = db.batch();
    b.delete(db.doc(`coaches/${coach}/members/${uid}`));
    b.delete(db.doc(`users/${uid}/coach/link`));
    return b.commit();
};
const coachDb = () => as(COACH, coachTok);

test('an active coach creates client codes for themselves only', async () => {
    await seedCoach();
    await assertSucceeds(coachDb().doc(`coachCodes/${KCODE}`).set({ coach: COACH, name: 'Coach Test', createdAt: 3 }));
    await assertFails(coachDb().doc('coachCodes/LLLLLLLL').set({ coach: 'someone', name: 'Coach Test', createdAt: 3 }));
    await assertFails(coachDb().doc('coachCodes/bad').set({ coach: COACH, name: 'Coach Test', createdAt: 3 }));
    await assertFails(as('u2').doc('coachCodes/MMMMMMMM').set({ coach: 'u2', name: 'X', createdAt: 3 }));
    // anyone signed in can open a code; only its coach can list or delete them
    await assertSucceeds(as(CLIENT, clientTok).doc(`coachCodes/${KCODE}`).get());
    await assertFails(as(CLIENT, clientTok).collection('coachCodes').get());
    await assertSucceeds(coachDb().collection('coachCodes').where('coach', '==', COACH).get());
    await assertFails(as(CLIENT, clientTok).doc(`coachCodes/${KCODE}`).delete());
    await assertSucceeds(coachDb().doc(`coachCodes/${KCODE}`).delete());
});
test('a switched-off coach cannot create codes', async () => {
    await seedCoach(false);
    await assertFails(coachDb().doc(`coachCodes/${KCODE}`).set({ coach: COACH, name: 'Coach Test', createdAt: 3 }));
});
test('a client joins with a code; the coach then reads their data but not backups', async () => {
    await seedCoach(); await seedCode(); await seedClient();
    await assertFails(coachDb().doc(`users/${CLIENT}`).get());
    await assertSucceeds(join(as(CLIENT, clientTok)));
    await assertSucceeds(coachDb().doc(`users/${CLIENT}`).get());
    await assertSucceeds(coachDb().collection(`users/${CLIENT}/history`).get());
    await assertSucceeds(coachDb().collection(`coaches/${COACH}/members`).get());
    await assertFails(coachDb().collection(`users/${CLIENT}/backups`).get());
    await assertFails(coachDb().doc(`users/${CLIENT}`).update({ updatedAt: 9 }));
});
test('joining fails with a deleted code, a switched-off coach, or a link alone', async () => {
    await seedCoach(); await seedClient();
    await assertFails(join(as(CLIENT, clientTok)));                     // no such code
    await seedCode('c9');                                                 // code of another coach
    await assertFails(join(as(CLIENT, clientTok)));
    await seedCode();
    await seedCoach(false);
    await assertFails(join(as(CLIENT, clientTok)));                     // coach switched off
    await seedCoach(true);
    await assertFails(as(CLIENT, clientTok).doc(`users/${CLIENT}/coach/link`).set({ coachId: COACH, coachName: 'X', code: KCODE, joinedAt: 4 }));
    // nobody can add someone else as a client
    await assertFails(as('u2').doc(`coaches/${COACH}/members/${CLIENT}`).set({ code: KCODE, name: 'Client', email: 'c@x.com', joinedAt: 4 }));
});
test('a coach sends a plan to their own client only', async () => {
    await seedCoach(); await seedCode(); await seedClient();
    await join(as(CLIENT, clientTok));
    await assertSucceeds(coachDb().doc(`users/${CLIENT}/coach/plan`).set(plan()));
    await assertSucceeds(coachDb().doc(`users/${CLIENT}/coach/plan`).get());
    await assertFails(coachDb().doc('users/u2/coach/plan').set(plan()));
    await assertFails(coachDb().doc(`users/${CLIENT}/coach/plan`).set({ ...plan(), extra: 1 }));
    // the client still only marks it applied
    await assertSucceeds(as(CLIENT, clientTok).doc(`users/${CLIENT}/coach/plan`).update({ appliedAt: 5 }));
});
test('switching a coach off stops all access at once', async () => {
    await seedCoach(); await seedCode(); await seedClient();
    await join(as(CLIENT, clientTok));
    await assertSucceeds(admin().doc(`coaches/${COACH}`).update({ active: false }));
    await assertFails(coachDb().doc(`users/${CLIENT}`).get());
    await assertFails(coachDb().collection(`users/${CLIENT}/history`).get());
    await assertFails(coachDb().doc(`users/${CLIENT}/coach/plan`).set(plan()));
    await assertFails(coachDb().collection(`coaches/${COACH}/members`).get());
});
test('a client leaves, or the coach removes them: access ends', async () => {
    await seedCoach(); await seedCode(); await seedClient();
    await join(as(CLIENT, clientTok));
    await assertSucceeds(leave(as(CLIENT, clientTok)));
    await assertFails(coachDb().doc(`users/${CLIENT}`).get());
    await join(as(CLIENT, clientTok));
    await assertSucceeds(coachDb().doc(`coaches/${COACH}/members/${CLIENT}`).delete());
    await assertFails(coachDb().doc(`users/${CLIENT}`).get());
    // the client sees their link is stale and removes it
    await assertSucceeds(as(CLIENT, clientTok).doc(`users/${CLIENT}/coach/link`).delete());
});
test('the client reads their own link and member entry, others cannot', async () => {
    await seedCoach(); await seedCode(); await seedClient();
    await join(as(CLIENT, clientTok));
    await assertSucceeds(as(CLIENT, clientTok).doc(`users/${CLIENT}/coach/link`).get());
    await assertSucceeds(as(CLIENT, clientTok).doc(`coaches/${COACH}/members/${CLIENT}`).get());
    await assertFails(as('u2').doc(`coaches/${COACH}/members/${CLIENT}`).get());
    await assertFails(as(CLIENT, clientTok).collection(`coaches/${COACH}/members`).get());
});
test('coach templates: own only, while switched on', async () => {
    await seedCoach(); await seedCoach(true, 'c2');
    const t = { name: 'Push Pull', routine: { name: 'PPL', schedule: [] }, updatedAt: 1 };
    await assertSucceeds(coachDb().doc(`coaches/${COACH}/templates/t1`).set(t));
    await assertSucceeds(coachDb().collection(`coaches/${COACH}/templates`).get());
    await assertFails(as('c2', coachTok).collection(`coaches/${COACH}/templates`).get());
    await assertFails(coachDb().doc(`coaches/${COACH}/templates/t2`).set({ ...t, extra: 1 }));
    await seedCoach(false);
    await assertFails(coachDb().collection(`coaches/${COACH}/templates`).get());
});
test('admin reads every coach member list with one query', async () => {
    await seedCoach(); await seedCode(); await seedClient();
    await join(as(CLIENT, clientTok));
    await assertSucceeds(admin().collectionGroup('members').get());
    await assertFails(coachDb().collectionGroup('members').get());
    // admin removes a client from a coach
    await assertSucceeds(leave(admin()));
});

// ---------- review fixes: the link always names the one coach who has access ----------
// switching coach is one batch: leave the old coach's list, join the new one, point the link at the new coach
const sw = (db, from, to, code, uid = CLIENT) => {
    const b = db.batch();
    b.delete(db.doc(`coaches/${from}/members/${uid}`));
    b.set(db.doc(`coaches/${to}/members/${uid}`), { code, name: 'Client', email: 'client@x.com', joinedAt: 5 });
    b.set(db.doc(`users/${uid}/coach/link`), { coachId: to, coachName: 'Other', code, joinedAt: 5 });
    return b.commit();
};
test('a coach cannot delete the link while keeping access', async () => {
    await seedCoach(); await seedCode(); await seedClient();
    await join(as(CLIENT, clientTok));
    await assertFails(coachDb().doc(`users/${CLIENT}/coach/link`).delete());
    // removing from their side and the link together is fine
    const cdb = coachDb(), b = cdb.batch(); b.delete(cdb.doc(`coaches/${COACH}/members/${CLIENT}`)); b.delete(cdb.doc(`users/${CLIENT}/coach/link`));
    await assertSucceeds(b.commit());
});
test('the client cannot drop the link alone or be in two coach lists', async () => {
    await seedCoach(); await seedCoach(true, 'c2'); await seedCode(); await seedCode('c2', 'MMMMMMMM'); await seedClient();
    await join(as(CLIENT, clientTok));
    await assertFails(as(CLIENT, clientTok).doc(`users/${CLIENT}/coach/link`).delete());
    // a second member entry without moving the link
    await assertFails(as(CLIENT, clientTok).doc(`coaches/c2/members/${CLIENT}`).set({ code: 'MMMMMMMM', name: 'Client', email: 'client@x.com', joinedAt: 5 }));
    // the member entry alone can't be dropped while the link names that coach
    await assertFails(as(CLIENT, clientTok).doc(`coaches/${COACH}/members/${CLIENT}`).delete());
    // switching in one batch works, and the old coach loses access
    await assertSucceeds(sw(as(CLIENT, clientTok), COACH, 'c2', 'MMMMMMMM'));
    await assertFails(coachDb().doc(`users/${CLIENT}`).get());
    await assertSucceeds(as('c2', coachTok).doc(`users/${CLIENT}`).get());
    // switching but keeping the old entry is refused
    const kdb = as(CLIENT, clientTok), b = kdb.batch();
    b.set(kdb.doc(`coaches/${COACH}/members/${CLIENT}`), { code: KCODE, name: 'Client', email: 'client@x.com', joinedAt: 6 });
    b.set(kdb.doc(`users/${CLIENT}/coach/link`), { coachId: COACH, coachName: 'X', code: KCODE, joinedAt: 6 });
    await assertFails(b.commit());
});
test('joining needs your own email and a real code; link fields are checked', async () => {
    await seedCoach(); await seedCode(); await seedClient();
    const db = as(CLIENT, clientTok);
    let b = db.batch();
    b.set(db.doc(`coaches/${COACH}/members/${CLIENT}`), { code: KCODE, name: 'Victim', email: 'victim@gmail.com', joinedAt: 4 });
    b.set(db.doc(`users/${CLIENT}/coach/link`), { coachId: COACH, coachName: 'Coach Test', code: KCODE, joinedAt: 4 });
    await assertFails(b.commit());
    b = db.batch();
    b.set(db.doc(`coaches/${COACH}/members/${CLIENT}`), { code: KCODE, name: 'Client', email: 'client@x.com', joinedAt: 4 });
    b.set(db.doc(`users/${CLIENT}/coach/link`), { coachId: COACH, coachName: 'Coach Test', code: 'X'.repeat(5000), joinedAt: 4 });
    await assertFails(b.commit());
    await assertSucceeds(join(db));
    await assertFails(db.doc(`users/${CLIENT}/coach/link`).update({ appliedAt: 5 }));
});
test('a coach plan cannot be dated in the future', async () => {
    await seedCoach(); await seedCode(); await seedClient();
    await join(as(CLIENT, clientTok));
    await assertFails(coachDb().doc(`users/${CLIENT}/coach/plan`).set(plan({ sentAt: 9e15 })));
    await assertSucceeds(coachDb().doc(`users/${CLIENT}/coach/plan`).set(plan({ sentAt: Date.now() })));
});
test('account deletion: the client removes both entries in one batch', async () => {
    await seedCoach(); await seedCode(); await seedClient();
    await join(as(CLIENT, clientTok));
    await assertSucceeds(leave(as(CLIENT, clientTok)));
});
