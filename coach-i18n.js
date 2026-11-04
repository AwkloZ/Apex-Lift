// Apex Coach (coach.html): English and Arabic. The language is the same setting as the Apex Lift app on this device
// (Profile → App → Language, or Account → Language here); without one, the phone's language.
// Text is written in English in the code and wrapped in t('...'). The Arabic comes from AR below, then from the
// Apex Lift app's table (i18n.js, loaded before this file) for the words both apps share (programs, muscles, days...).
// Shared as window.ApexCoachI18n; loaded before coach-sign-in.js, admin-coach.js and coach.js.
window.ApexCoachI18n = (() => {
    'use strict';
    const LANG_KEY = 'workoutLang_rakan_final';
    const LANG = (() => {
        let v = null; try { v = localStorage.getItem(LANG_KEY); } catch (e) {}
        if (v === 'ar' || v === 'en') return v;
        return (navigator.language || '').toLowerCase().startsWith('ar') ? 'ar' : 'en';
    })();
    const isAR = LANG === 'ar';
    document.documentElement.lang = LANG;
    document.documentElement.dir = isAR ? 'rtl' : 'ltr';
    const APP = window.APEX_I18N || { AR: {}, AR_COUNT: {}, MUSCLE_AR: {} };

    const AR = {
        // status screens and sign-in
        'Coach': 'مدرب',
        'not yet': 'لم يتمرن بعد',
        'Your coach account is switched off': 'حساب المدرب الخاص بك متوقف',
        'Something went wrong': 'حدث خطأ ما',
        'Could not load your coach account ({code}). Check your connection and try again.': 'تعذّر تحميل حساب المدرب ({code}). تحقق من اتصالك وحاول مرة أخرى.',
        'This invitation is for another email': 'هذه الدعوة لبريد إلكتروني آخر',
        'This invitation was already used': 'هذه الدعوة استُخدمت من قبل',
        'Each invitation link works once. Ask Apex Lift for a new one.': 'كل رابط دعوة يعمل مرة واحدة. اطلب رابطًا جديدًا من Apex Lift.',
        'Accept to coach on Apex Lift as {email}. Your clients join you with a link you share, and you send them routines and messages.': 'اقبل لتصبح مدربًا على Apex Lift باسم {email}. ينضم إليك عملاؤك برابط ترسله لهم، وترسل لهم الجداول والرسائل.',
        'Accept and start coaching': 'اقبل وابدأ التدريب',
        'Welcome to Apex Coach': 'أهلًا بك في Apex Coach',
        'Could not accept. Try again.': 'تعذّر القبول. حاول مرة أخرى.',
        "This isn't a coach account": 'هذا ليس حساب مدرب',
        "You're signed in as {email}. To coach on Apex Lift, ask Apex Lift for an invitation and open its link.": 'أنت مسجّل الدخول باسم {email}. لتصبح مدربًا على Apex Lift، اطلب دعوة من Apex Lift وافتح رابطها.',
        "Apex Lift switched your coach account off, so you can't see your clients for now. Contact Apex Lift support.": 'أوقف Apex Lift حساب المدرب الخاص بك، لذلك لا يمكنك رؤية عملائك حاليًا. تواصل مع دعم Apex Lift.',
        "You're signed in as {email}. Sign out and sign in with the email the invitation was sent to, or ask Apex Lift for a new link.": 'أنت مسجّل الدخول باسم {email}. سجّل الخروج ثم ادخل بالبريد الذي أُرسلت إليه الدعوة، أو اطلب رابطًا جديدًا من Apex Lift.',
        "You're invited as {name}": 'أنت مدعو باسم {name}',
        "You're invited to coach": 'أنت مدعو لتصبح مدربًا',
        'Sign in with the email the invitation was sent to.': 'سجّل الدخول بالبريد الذي أُرسلت إليه الدعوة.',
        'Coach your Apex Lift clients: chat with them, send them routines and see how they train.': 'درّب عملاءك على Apex Lift: تحدث معهم، وأرسل لهم الجداول، وتابع تمرينهم.',
        'Sign-in failed': 'تعذّر تسجيل الدخول',
        'Password (at least 8 characters)': 'كلمة المرور (8 أحرف على الأقل)',
        'Enter your email and password.': 'أدخل بريدك الإلكتروني وكلمة المرور.',
        'Wrong email or password.': 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
        'Enter your email and a password of at least 8 characters.': 'أدخل بريدك الإلكتروني وكلمة مرور من 8 أحرف على الأقل.',
        'This email already has an account: sign in instead.': 'لهذا البريد حساب بالفعل: سجّل الدخول بدلًا من ذلك.',
        'Could not create the account': 'تعذّر إنشاء الحساب',
        'Enter your email first.': 'أدخل بريدك الإلكتروني أولًا.',
        'We sent you an email to reset your password.': 'أرسلنا إليك بريدًا لإعادة تعيين كلمة المرور.',
        'Could not send the email': 'تعذّر إرسال البريد',
        'Confirm your email': 'أكّد بريدك الإلكتروني',
        'We sent a link to {email}. Open it, then come back and tap Continue.': 'أرسلنا رابطًا إلى {email}. افتحه، ثم عد واضغط متابعة.',
        'Not confirmed yet. Open the link in the email first.': 'لم يتم التأكيد بعد. افتح الرابط في البريد أولًا.',
        'Sent': 'تم الإرسال',
        'Please wait a minute, then try again.': 'انتظر دقيقة، ثم حاول مرة أخرى.',

        // Home and Clients
        'Good morning, {name}': 'صباح الخير يا {name}',
        'Good afternoon, {name}': 'مساء الخير يا {name}',
        'Good evening, {name}': 'مساء الخير يا {name}',
        'Here is how your clients are doing.': 'هذا حال عملائك اليوم.',
        'Invite your first client to get started.': 'ادعُ أول عميل لك لتبدأ.',
        'Trained today': 'تمرّن اليوم',
        'Trained this week': 'تمرّن هذا الأسبوع',
        'Unread messages': 'رسائل غير مقروءة',
        'Needs your attention': 'يحتاج إلى متابعتك',
        'All good: everyone trained this week and there are no new messages.': 'كل شيء على ما يرام: تمرّن الجميع هذا الأسبوع ولا توجد رسائل جديدة.',
        'Workout at {time}': 'تمرين الساعة {time}',
        'New this week': 'جدد هذا الأسبوع',
        'Joined {date}': 'انضم {date}',
        'No name': 'بدون اسم',
        'New message': 'رسالة جديدة',
        'Low check-in today': 'تسجيل يومي منخفض اليوم',
        'No workout for {n}': 'لا تمرين منذ {n}',
        'No workout yet': 'لا تمارين بعد',
        'Using the app now': 'يستخدم التطبيق الآن',
        'Last workout {when}': 'آخر تمرين {when}',
        'No clients yet': 'لا يوجد عملاء بعد',
        'Make a client link and send it to your client. They open it in Apex Lift and tap Join.': 'أنشئ رابط عميل وأرسله إلى عميلك. يفتحه في Apex Lift ويضغط انضمام.',
        'Invite a client': 'ادعُ عميلًا',
        'Clients': 'العملاء',
        'Tap a client to see their training, chat, or send a routine.': 'اضغط على عميل لرؤية تمرينه أو للمحادثة أو لإرسال جدول.',
        'Search by name or email': 'ابحث بالاسم أو البريد',
        'Sort': 'الترتيب',
        'Recent activity': 'آخر نشاط',
        'Needs attention': 'يحتاج متابعة',
        'Name': 'الاسم',
        'No client matches “{q}”.': 'لا يوجد عميل يطابق «{q}».',

        // Chats
        'Home': 'الرئيسية',
        'Invite': 'دعوة',
        'Chats': 'المحادثات',
        'Chat': 'محادثة',
        'You:': 'أنت:',
        'Only you and your client can read a chat.': 'لا يقرأ المحادثة إلا أنت وعميلك.',
        'Start a chat': 'ابدأ محادثة',
        'Say hi to {name}. Only you and {name} can read this chat.': 'قل مرحبًا لـ {name}. لا يقرأ هذه المحادثة إلا أنت و{name}.',
        'Seen': 'تمت القراءة',
        'You can no longer message {name}.': 'لم يعد بإمكانك مراسلة {name}.',

        // Invite
        'A former client': 'عميل سابق',
        'Each link works once: make one for each client. They open it in Apex Lift and tap Join, or type the code in Profile → Join a coach.': 'كل رابط يعمل مرة واحدة: أنشئ رابطًا لكل عميل. يفتحه في Apex Lift ويضغط انضمام، أو يكتب الرمز في الملف الشخصي ← انضم إلى مدرب.',
        'New client link': 'رابط عميل جديد',
        'Ready to send': 'جاهزة للإرسال',
        'Share link': 'مشاركة الرابط',
        'Delete link': 'حذف الرابط',
        'Used': 'مستخدمة',
        'Used by {name} · {date}': 'استخدمه {name} · {date}',
        'A link stops working once a client joins with it. Deleting a link stops it too; clients who already joined stay.': 'يتوقف الرابط عن العمل بمجرد انضمام عميل به. حذف الرابط يوقفه أيضًا، ويبقى العملاء الذين انضموا.',
        'Join me as your coach on Apex Lift (code {code})': 'انضم إليّ كمدرب لك على Apex Lift (الرمز {code})',
        'Client link ready': 'رابط العميل جاهز',
        'Could not make a link. Try again.': 'تعذّر إنشاء الرابط. حاول مرة أخرى.',
        'Delete this link?': 'حذف هذا الرابط؟',
        'It stops working. Clients who already joined stay.': 'سيتوقف عن العمل. يبقى العملاء الذين انضموا.',
        'Link deleted': 'تم حذف الرابط',
        'Could not delete. Try again.': 'تعذّر الحذف. حاول مرة أخرى.',

        // Account
        'Open links': 'روابط متاحة',
        'Coach account': 'حساب المدرب',
        'Clients see it when they join you and in the chat': 'يراه العملاء عند انضمامهم إليك وفي المحادثة',
        'Coach since': 'مدرب منذ',
        'Language and theme are shared with the Apex Lift app on this device.': 'اللغة والمظهر مشتركان مع تطبيق Apex Lift على هذا الجهاز.',
        'Help': 'المساعدة',
        'Clients see this name when they join you, on your messages and in the chat.': 'يرى العملاء هذا الاسم عند انضمامهم إليك وفي رسائلك والمحادثة.',
        'Name saved': 'تم حفظ الاسم',
        'Could not save. Try again.': 'تعذّر الحفظ. حاول مرة أخرى.',

        // one client
        'Back to clients': 'العودة إلى العملاء',
        'Send a routine': 'أرسل جدولًا',
        'Message sent': 'تم إرسال الرسالة',
        'Routine sent': 'تم إرسال الجدول',
        'Ready': 'جاهز',
        'Normal': 'عادي',
        'Workouts in the last 7 days': 'تمارين آخر 7 أيام',
        'Workout days in total': 'أيام التمرين إجمالًا',
        'Days since last workout': 'أيام منذ آخر تمرين',
        'Daily check-in': 'التسجيل اليومي',
        'Today: {level}': 'اليوم: {level}',
        'No check-in today.': 'لا يوجد تسجيل اليوم.',
        'Score out of 6 (sleep, soreness, energy). 2 or less is low.': 'النتيجة من 6 (النوم والألم والطاقة). 2 أو أقل تعني منخفضة.',
        'Very sore': 'متألم جدًا',
        'Training days, last 12 weeks': 'أيام التمرين، آخر 12 أسبوعًا',
        'Their routines': 'جداوله',
        'Edit and send': 'عدّل وأرسل',
        'No routines yet': 'لا جداول بعد',
        'Send them a new routine above': 'أرسل له جدولًا جديدًا من الأعلى',
        'Pin a note on their Today screen': 'ثبّت ملاحظة في شاشة اليوم لديه',
        'Shows on top of their workout until they close it': 'تظهر فوق تمرينه حتى يغلقها',
        'About': 'معلومات',
        'Joined you': 'انضم إليك',
        'Last workout': 'آخر تمرين',
        'Remove this client': 'إزالة هذا العميل',
        'You can no longer see their account': 'لن تتمكن من رؤية حسابه بعد ذلك',
        '{n} workout days in the last 12 weeks': 'أيام التمرين في آخر 12 أسبوعًا: {n}',
        'Remove {name}?': 'إزالة {name}؟',
        'You can no longer see their account or your chat. They can join you again with a new link.': 'لن تتمكن من رؤية حسابه أو محادثتكما. يمكنه الانضمام إليك مجددًا برابط جديد.',
        'Remove': 'إزالة',
        'Client removed': 'تمت إزالة العميل',
        'No workouts logged yet.': 'لا توجد تمارين مسجلة بعد.',
        'Weight × reps for each set, @ = RPE (10 = no reps left).': 'الوزن × التكرارات لكل مجموعة، @ = مستوى الجهد RPE (10 = لم يتبقَّ أي تكرار).',
        'Show older workouts': 'عرض تمارين أقدم',
        'Body weight from {a} to {b} kg': 'وزن الجسم من {a} إلى {b} كغ',
        '{n} reps': '{n} تكرارات',
        '{n} kg, no changes logged yet.': '{n} كغ، لم تُسجل تغييرات بعد.',
        'No body weight yet.': 'لا يوجد وزن بعد.',
        'Best set and estimated 1-rep max (e1RM). The change is from their first session to the last one. Tap an exercise for every session.': 'أفضل مجموعة والحد الأقصى المقدّر لتكرار واحد (e1RM). التغيير من أول حصة إلى آخر حصة. اضغط على تمرين لرؤية كل الحصص.',
        'Last session {when}': 'آخر حصة {when}',

        // routine builder (admin-coach.js)
        'Close without sending? Your changes are lost.': 'إغلاق دون إرسال؟ ستضيع تغييراتك.',
        'Send to': 'أرسل إلى',
        'Add as a new routine (they keep the others)': 'أضفه كجدول جديد (تبقى جداوله الأخرى)',
        'Update their routine: {name}': 'حدّث جدوله: {name}',
        'active': 'النشط',
        'Make it their active routine': 'اجعله جدوله النشط',
        "Pins a note on the Today page of {name}'s app, above their workout, until they close it.": 'تثبّت ملاحظة في صفحة اليوم في تطبيق {name}، فوق تمرينه، حتى يغلقها.',
        'Updates their routine "{name}" and makes it the active one. Their app saves a backup of the old version first, and their workout history is kept.': 'يحدّث جدوله «{name}» ويجعله النشط. يحفظ تطبيقه نسخة احتياطية من النسخة القديمة أولًا، ويبقى سجل تمارينه.',
        'Updates their routine "{name}". Their app saves a backup of the old version first, and their workout history is kept.': 'يحدّث جدوله «{name}». يحفظ تطبيقه نسخة احتياطية من النسخة القديمة أولًا، ويبقى سجل تمارينه.',
        "{name} already has 5 routines (the most the app allows), so a new one can't be added: it replaces their active routine. Their app saves a backup first. To keep all 5, choose \"Update their routine\" above instead.": 'لدى {name} خمسة جداول (أقصى ما يسمح به التطبيق)، لذلك لا يمكن إضافة جدول جديد: سيحل محل جدوله النشط. يحفظ تطبيقه نسخة احتياطية أولًا. للإبقاء على الخمسة، اختر «حدّث جدوله» في الأعلى.',
        'Adds a new routine for {name} and makes it the active one. Their other routines and history stay.': 'يضيف جدولًا جديدًا لـ {name} ويجعله النشط. تبقى جداوله الأخرى وسجله.',
        'Adds a new routine for {name}. Their other routines and history stay.': 'يضيف جدولًا جديدًا لـ {name}. تبقى جداوله الأخرى وسجله.',
        'Note': 'ملاحظة',
        'Save as template': 'احفظه كقالب',
        'Send to {name}': 'أرسل إلى {name}',
        'client': 'العميل',
        'Routine name': 'اسم الجدول',
        'Start from': 'ابدأ من',
        'Delete template': 'حذف القالب',
        'Note to your client (optional)': 'ملاحظة لعميلك (اختيارية)',
        'Great week! Next week add 2.5 kg to your squat…': 'أسبوع رائع! في الأسبوع القادم أضف 2.5 كغ إلى السكوات…',
        'What changed and why, how to progress, what to focus on…': 'ما الذي تغيّر ولماذا، وكيف يتقدم، وعلى ماذا يركز…',
        '{n} days a week': '{n} أيام في الأسبوع',
        'No templates yet': 'لا قوالب بعد',
        'Choose…': 'اختر…',
        'Empty week': 'أسبوع فارغ',
        'None': 'لا يوجد',
        'Your templates': 'قوالبك',
        'Load "{name}" to edit it? The days you have built so far are replaced.': 'تحميل «{name}» لتعديله؟ ستُستبدل الأيام التي بنيتها حتى الآن.',
        'Replace the days you have built so far?': 'استبدال الأيام التي بنيتها حتى الآن؟',
        'Exercise name': 'اسم التمرين',
        'Reps (or seconds, like 30 - 45s)': 'التكرارات (أو الثواني، مثل 30 - 45s)',
        'Move up': 'تحريك لأعلى',
        'Move down': 'تحريك لأسفل',
        'Active rest': 'راحة نشطة',
        'Active rest: walking, stretching, light cardio.': 'راحة نشطة: مشي، إطالة، كارديو خفيف.',
        'Complete rest.': 'راحة تامة.',
        'Name this day (e.g. Push)': 'سمِّ هذا اليوم (مثل دفع)',
        'Day name': 'اسم اليوم',
        'Add exercise': 'أضف تمرينًا',
        'Copy exercises from another day': 'انسخ التمارين من يوم آخر',
        'Copy from…': 'انسخ من…',
        'Replace the exercises of Day {n}?': 'استبدال تمارين اليوم {n}؟',
        'Every day is a rest day.': 'كل الأيام أيام راحة.',
        'Day {n} ({day}) is a workout day with no exercises.': 'اليوم {n} ({day}) يوم تمرين بلا تمارين.',
        'Write a note first.': 'اكتب ملاحظة أولًا.',
        'Send anyway?': 'إرسال على أي حال؟',
        'Could not send ({code}).': 'تعذّر الإرسال ({code}).',
        'Publish the new firestore.rules in the Firebase console first.': 'انشر قواعد firestore.rules الجديدة في لوحة Firebase أولًا.',
        'Check the connection and try again.': 'تحقق من الاتصال وحاول مرة أخرى.',
        'Template name': 'اسم القالب',
        'Replace the template "{name}"?': 'استبدال القالب «{name}»؟',
        'Saved as template "{name}".': 'تم الحفظ كقالب «{name}».',
        'Could not save the template ({code}).': 'تعذّر حفظ القالب ({code}).',
        'Delete the template "{name}"?': 'حذف القالب «{name}»؟',
        'Template deleted.': 'تم حذف القالب.',
        'Could not delete ({code}).': 'تعذّر الحذف ({code}).',
        'Sunday': 'الأحد', 'Monday': 'الاثنين', 'Tuesday': 'الثلاثاء', 'Wednesday': 'الأربعاء', 'Thursday': 'الخميس', 'Friday': 'الجمعة', 'Saturday': 'السبت'
    };

    // Arabic counting words (from i18n.js): {n} أيام → يوم واحد / يومان / 3 أيام / 11 يومًا
    const arCount = (n, word) => {
        const f = APP.AR_COUNT[word], v = Number(n);
        if (!f) return `${n} ${word}`;
        if (!Number.isInteger(v)) return `${n} ${f[2]}`;
        return v === 1 ? f[0] : v === 2 ? f[1] : v >= 3 && v <= 10 ? `${n} ${f[2]}` : `${n} ${f[3]}`;
    };
    const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k) && o[k];
    const t = (en, vars) => {
        let out = (isAR && (has(AR, en) || has(APP.AR, en))) || en;
        if (vars && isAR) out = out.replace(/\{(\w+)\} ([؀-ۿ]+)/g, (m, k, w) => vars[k] !== undefined && APP.AR_COUNT[w] ? arCount(vars[k], w) : m);
        if (vars) out = out.replace(/\{(\w+)\}/g, (m, k) => vars[k] !== undefined ? vars[k] : m);
        // after منذ / من / خلال the dual takes its other form: منذ يومين
        if (isAR) out = out.replace(/(قبل|من|منذ|خلال|بعد|لمدة) ([؀-ۿ]+)(تان|ان)(?=\s|$|[.،:)])/g, (m, p, w, e) => `${p} ${w}${e === 'تان' ? 'تين' : 'ين'}`);
        return out;
    };
    // "today", "yesterday", "3 days ago"; plain: a length of time ("3 days")
    const daysAgo = (n, plain = false) => {
        if (plain) return isAR ? arCount(n, 'أيام') : `${n} day${n === 1 ? '' : 's'}`;
        if (n <= 0) return t('today');
        if (n === 1) return t('yesterday');
        return isAR ? `منذ ${arCount(n, 'أيام').replace(/^يومان$/, 'يومين')}` : `${n} days ago`;
    };
    AR.today = 'اليوم'; AR.yesterday = 'أمس';
    const muscle = m => (isAR && has(APP.MUSCLE_AR, (m || '').trim())) || m || '';

    return Object.freeze({ t, isAR, LANG, LANG_KEY, daysAgo, muscle, OWN: AR });
})();
