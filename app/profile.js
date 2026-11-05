// Apex Lift app (index.html), part 4 of 13: The Profile tab and its Account page.
// The app/*.js files are plain scripts loaded in order by index.html; they share one scope, so a name declared in an
// earlier file can be used in a later one (see "App files" in CLAUDE.md). Keep the order in index.html and sw.js.
'use strict';

// 👤 PROFILE. Tapping your photo opens Account: your information (name and date of birth can change; sex and height
// are set in the setup) and everything about the account (sign-in, backups, sign out, delete).
const EXP_LABEL = { none: 'Just starting', new: 'Less than 1 year', mid: '1 to 3 years', adv: '3 to 5 years', pro: 'More than 5 years' };
const pfRow = (icon, label, value, sub = '', extra = '') => `<div class="pf-row"><span class="pf-ic"><i data-lucide="${icon}"></i></span><span class="pf-label">${label}${sub ? `<span class="pf-sub">${sub}</span>` : ''}</span><span class="pf-val">${value || '—'}</span>${extra}</div>`;
const avatarHTML = (u, size) => {
    const name = u.displayName || u.name || '', photo = u.photoURL || u.photo || '';
    return photo ? `<img src="${esc(photo)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" class="${size} rounded-full object-cover shrink-0">`
        : `<span class="${size} rounded-full bg-[#d4af37] text-black font-black flex items-center justify-center shrink-0">${esc((name || u.email || '?').charAt(0).toUpperCase())}</span>`;
};
const renderAccountSheet = () => {
    const el = document.getElementById('account-body'); if (!el || !Cloud.user) return;
    const u = Cloud.user, flag = getCloudFlag() || {}, b = getBody(), age = ageOf(b);
    const since = Number(flag.since) > 0 ? new Intl.DateTimeFormat(isAR ? 'ar' : 'en-GB', { month: 'long', year: 'numeric', numberingSystem: 'latn' }).format(Number(flag.since)) : '';
    const born = b.birthDate ? new Intl.DateTimeFormat(isAR ? 'ar' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', numberingSystem: 'latn' }).format(new Date(b.birthDate + 'T12:00:00')) : b.birthYear ? String(b.birthYear) : '';
    const sexL = { male: t('Male'), female: t('Female'), na: t('Prefer not to say') }[b.sex] || '';
    const google = !isPasswordUser();
    el.innerHTML = `<div class="flex flex-col items-center text-center pt-1 pb-6">
                ${avatarHTML(u, 'w-20 h-20 text-[30px]')}
                <div class="text-[20px] font-black text-white mt-3 max-w-full truncate">${esc(u.displayName || u.email || '')}</div>
                <div class="text-[13px] font-bold text-slate-400 max-w-full truncate" dir="ltr">${esc(u.email || '')}</div>
                ${since ? `<div class="text-[12px] font-bold text-slate-400 mt-1">${t('Member since {date}', { date: esc(since) })}</div>` : ''}
            </div>
            <h3 class="pf-h">${t('Your information')}</h3>
            <div class="pf-group">
                <button data-on-click="window.appActions.editName()" class="pf-row tap-feedback"><span class="pf-ic"><i data-lucide="user-round"></i></span><span class="pf-label">${t('Name')}</span><span class="pf-val truncate">${esc(u.displayName || '—')}</span><i data-lucide="pencil" class="pf-chev"></i></button>
                <button data-on-click="window.appActions.editBirth()" class="pf-row tap-feedback"><span class="pf-ic"><i data-lucide="cake"></i></span><span class="pf-label">${t('Age')}${born ? `<span class="pf-sub">${t('Born {date}', { date: esc(born) })}</span>` : ''}</span><span class="pf-val">${age !== null ? `<span class="num">${age}</span>` : '—'}</span><i data-lucide="pencil" class="pf-chev"></i></button>
                ${pfRow('users', t('Sex'), esc(sexL))}
                ${pfRow('ruler', t('Height'), b.heightCm ? `<span class="num" dir="ltr">${b.heightCm} cm</span>` : '')}
            </div>
            <div class="h-6"></div>
            <h3 class="pf-h">${t('Account')}</h3>
            <div class="pf-group mb-4">
                ${pfRow(google ? 'log-in' : 'mail', t('Signed in with'), google ? 'Google' : t('Email'), !google && !u.emailVerified ? `<span class="text-[#f87171]">${t('Email not confirmed')}</span>` : '')}
                ${!google && !u.emailVerified ? `<button data-on-click="window.appActions.resendVerify()" class="pf-row tap-feedback"><span class="pf-ic"><i data-lucide="mail-check"></i></span><span class="pf-label">${t('Send confirmation email')}</span><i data-lucide="chevron-right" class="pf-chev"></i></button>` : ''}
                <button data-on-click="window.appActions.openBackups()" class="pf-row tap-feedback"><span class="pf-ic"><i data-lucide="history"></i></span><span class="pf-label">${t('Account backups')}<span class="pf-sub">${t('Go back to an earlier copy')}</span></span><i data-lucide="chevron-right" class="pf-chev"></i></button>
                <button data-on-click="window.appActions.cloudSignOut()" class="pf-row tap-feedback"><span class="pf-ic"><i data-lucide="log-out"></i></span><span class="pf-label">${t('Sign out')}</span></button>
                <button data-on-click="window.appActions.cloudDelete()" class="pf-row is-danger tap-feedback"><span class="pf-ic"><i data-lucide="trash-2"></i></span><span class="pf-label">${t('Delete my account')}<span class="pf-sub">${t('Deletes your cloud data and your account')}</span></span></button>
            </div>`;
    if (window.lucide) window.lucide.createIcons({ root: el });
};
// small centered window: a title, then a text box or a list of choices
const openEdit = html => {
    const box = document.getElementById('edit-box'); box.innerHTML = html;
    if (window.lucide) window.lucide.createIcons({ root: box });
    const o = document.getElementById('edit-overlay');
    if (!o.classList.contains('flex') || o.classList.contains('opacity-0')) { openModal('edit-overlay', 'edit-box'); pushBack('edit', () => window.appActions.closeEdit()); }
};
const editHead = title => `<div class="flex items-center justify-between mb-4"><h3 class="text-[18px] font-black text-white">${title}</h3><button data-on-click="window.appActions.closeEdit()" class="w-11 h-11 -me-2 rounded-full bg-white/5 text-slate-400 flex items-center justify-center tap-feedback" aria-label="${esc(t('Close'))}"><i data-lucide="x" class="w-5 h-5"></i></button></div>`;
const sheetOpen = id => document.getElementById(id).classList.contains('flex') && !document.getElementById(id).classList.contains('opacity-0');
const renderProfile = () => {
    renderAccount();
    if (sheetOpen('account-overlay')) renderAccountSheet();
};
