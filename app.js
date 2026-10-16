(() => {
    'use strict';

    // Escapes any value for safe use inside HTML text or attributes
    const esc = str => (str === null || str === undefined ? '' : String(str)).replace(/[&<>'"]/g, t => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[t]));
    // Turns a value into a safe JS string argument for inline handlers, e.g. onclick="fn(${jsArg(name)})"
    // (handles names like "Farmer's Walk" and blocks code hidden in imported backups)
    const jsArg = v => esc(JSON.stringify(v === null || v === undefined ? '' : String(v)));

    // 🌐 LANGUAGE (English / Arabic). Text is written in English in the code and wrapped in t('...');
    // the Arabic version comes from AR below. Exercise names stay in English in both languages.
    const LANG_KEY = 'workoutLang_rakan_final';
    const LANG = (() => {
        let v = null; try { v = localStorage.getItem(LANG_KEY); } catch (e) {}
        if (v === 'ar' || v === 'en') return v;
        return (navigator.language || '').toLowerCase().startsWith('ar') ? 'ar' : 'en';
    })();
    const isAR = LANG === 'ar';
    const AR = {
        "Next workout": "التمرين القادم",
        "1 to 3 years": "من سنة إلى 3 سنوات",
        "Add as a new routine": "أضفه كجدول جديد",
        "Barbells, machines and cables": "بار، أجهزة وكابلات",
        "Best": "الأفضل",
        "Best reps": "أكثر تكرارات",
        "Best time": "أطول وقت",
        "Best weight": "أثقل وزن",
        "Build muscle": "بناء العضلات",
        "Day type": "نوع اليوم",
        "Delete routine": "حذف الجدول",
        "Delete this routine? Your history is kept.": "حذف هذا الجدول؟ سجلك لن يُحذف.",
        "Dumbbells only": "دمبلز فقط",
        "Est. 1-rep max": "أقصى تكرار واحد (تقديري)",
        "Exercise history": "سجل التمرين",
        "Extra sets on the main lifts": "مجموعات إضافية للتمارين الأساسية",
        "Fewer sets to start": "مجموعات أقل للبداية",
        "Finish your first workout to see your progress here.": "أنهِ أول تمرين لترى تقدّمك هنا.",
        "Full gym": "نادي كامل",
        "Get bigger and more defined": "حجم أكبر وتفاصيل أوضح",
        "Get stronger": "زيادة القوة",
        "Heaviest weight per session": "أثقل وزن في كل تمرين",
        "Home or a small gym": "البيت أو نادي صغير",
        "How long have you been training?": "منذ متى وأنت تتمرن؟",
        "How many days a week can you train?": "كم يوماً في الأسبوع تستطيع التمرين؟",
        "I'll build my own": "سأبني جدولي بنفسي",
        "Last 5 weeks": "آخر 5 أسابيع",
        "Less than 1 year": "أقل من سنة",
        "Lift heavier on the big lifts": "أوزان أثقل في التمارين الأساسية",
        "Longest set per session": "أطول مجموعة في كل تمرين",
        "Lose fat": "خسارة الدهون",
        "More than 3 years": "أكثر من 3 سنوات",
        "Most reps per session": "أكثر تكرارات في كل تمرين",
        "My routine": "جدولي",
        "My routines": "جداولي",
        "New routine": "جدول جديد",
        "No new records yet. Add weight when the app says so and they will come.": "لا توجد أرقام جديدة بعد. زِد الوزن عندما يقترح التطبيق ذلك وستأتي.",
        "No workouts yet": "لا توجد تمارين بعد",
        "Other programs": "برامج أخرى",
        "Overview": "نظرة عامة",
        "Pick what you can keep up every week.": "اختر ما تستطيع الالتزام به كل أسبوع.",
        "Programs": "البرامج",
        "Progress chart": "رسم التقدّم",
        "Recommended for you": "مقترح لك",
        "Records (last 30 days)": "الأرقام القياسية (آخر 30 يوم)",
        "Replace current routine": "استبدل الجدول الحالي",
        "Replace current routine?": "استبدال الجدول الحالي؟",
        "Reset app": "إعادة ضبط التطبيق",
        "Routine {n}": "جدول {n}",
        "See all {n} programs": "شاهد كل البرامج ({n})",
        "Sessions": "عدد التمارين",
        "Set up my program again": "إعادة إعداد برنامجي",
        "Standard sets": "مجموعات عادية",
        "Start with this program": "ابدأ بهذا البرنامج",
        "Stay strong while you lean out": "حافظ على قوتك وأنت تنشّف",
        "Tap a day for details.": "اضغط على يوم لعرض التفاصيل.",
        "Tap a program to see its week.": "اضغط على برنامج لترى أسبوعه.",
        "Targets": "الأهداف",
        "This month": "هذا الشهر",
        "This sets how many sets you start with.": "يحدد عدد المجموعات التي تبدأ بها.",
        "Up to 5 routines": "الحد الأقصى 5 جداول",
        "Volume": "الحجم",
        "We use this to suggest a program. You can change it anytime.": "نستخدم هذا لاقتراح برنامج. يمكنك تغييره متى شئت.",
        "Week starts on": "بداية الأسبوع",
        "Week streak": "أسابيع متتالية",
        "What's your main goal?": "ما هدفك الأساسي؟",
        "Where do you train?": "أين تتمرن؟",
        "Which day does your week start?": "في أي يوم يبدأ أسبوعك؟",
        "Workout history": "سجل التمارين",
        "Workouts this week": "تمارين هذا الأسبوع",
        "You have 5 routines (the most). The current one will be replaced; your history is kept.": "لديك 5 جداول (الحد الأقصى). سيتم استبدال الجدول الحالي، وسجلك لن يُحذف.",
        "Your current routine and all your history are kept.": "جدولك الحالي وكل سجلك يبقيان كما هما.",
        "Your program": "برنامجك",
        "Your routines go back to the default. Your history is kept.": "ستعود جداولك إلى الوضع الافتراضي. سجلك لن يُحذف.",
        "Your week in the app starts on this day.": "يبدأ أسبوعك في التطبيق من هذا اليوم.",
        "kg lifted this week": "كجم مرفوعة هذا الأسبوع",
        "{name} is ready": "{name} جاهز",
        "{n} days": "{n} أيام",
        "{n} sessions": "{n} تمارين",
        "Push / Pull / Legs": "دفع / سحب / أرجل",
        "Push / Pull / Legs (3 days)": "دفع / سحب / أرجل (3 أيام)",
        "Upper / Lower": "علوي / سفلي",
        "PHUL (Power + Hypertrophy)": "PHUL (قوة + تضخيم)",
        "Upper / Lower + Push / Pull / Legs": "علوي / سفلي + دفع / سحب / أرجل",
        "Bro Split": "تقسيم العضلات (Bro Split)",
        "Arnold Split": "تقسيم أرنولد",
        "Full Body": "جسم كامل",
        "5×5 Strength": "قوة 5×5",
        "Glutes & Legs Focus": "تركيز على المؤخرة والأرجل",
        "Dumbbells Only": "دمبلز فقط",
        "Each muscle twice a week. The classic for building muscle.": "كل عضلة مرتين في الأسبوع. الخيار الكلاسيكي لبناء العضلات.",
        "The same split once a week, with a rest day between sessions.": "نفس التقسيم مرة في الأسبوع، مع يوم راحة بين التمارين.",
        "Upper and lower body twice a week. Balanced and easy to fit in.": "الجزء العلوي والسفلي مرتين في الأسبوع. متوازن وسهل الالتزام.",
        "Two heavy days for strength and two volume days for size.": "يومان ثقيلان للقوة ويومان بحجم أعلى للتضخيم.",
        "Five days: upper and lower, then push, pull and legs.": "خمسة أيام: علوي وسفلي، ثم دفع وسحب وأرجل.",
        "One muscle group per day: chest, back, shoulders, arms and legs.": "عضلة واحدة كل يوم: صدر، ظهر، أكتاف، ذراعين، أرجل.",
        "Chest & back, shoulders & arms, legs. Twice a week, high volume.": "صدر وظهر، أكتاف وذراعين، أرجل. مرتين في الأسبوع وبحجم عالٍ.",
        "The whole body every session. Great with a busy schedule.": "الجسم كامل في كل تمرين. مناسب لمن وقته ضيق.",
        "Few big lifts, heavy weights, 5 sets of 5. Built for strength.": "تمارين أساسية قليلة وأوزان ثقيلة، 5 مجموعات × 5. مصمم للقوة.",
        "Extra work for glutes and legs, plus one upper body day.": "تمرين إضافي للمؤخرة والأرجل، مع يوم للجزء العلوي.",
        "Only dumbbells needed. Good for home or a small gym.": "تحتاج دمبلز فقط. مناسب للبيت أو نادي صغير.",
        "Arms": "الذراعين",
        "Back": "الظهر",
        "Chest": "الصدر",
        "Chest & Back": "صدر وظهر",
        "Glutes": "المؤخرة",
        "Glutes & Hamstrings": "المؤخرة وخلفي الفخذ",
        "Lower Hypertrophy": "سفلي تضخيم",
        "Lower Power": "سفلي قوة",
        "Quads & Glutes": "أمامي الفخذ والمؤخرة",
        "Shoulders": "الأكتاف",
        "Shoulders & Arms": "أكتاف وذراعين",
        "Strength A": "قوة A",
        "Strength B": "قوة B",
        "Upper Hypertrophy": "علوي تضخيم",
        "Upper Power": "علوي قوة",
        "Add exercises to this day in the Plan tab.": "أضف تمارين لهذا اليوم من تبويب الخطة.",
        "Add reps": "زِد التكرارات",
        "Add weight": "زِد الوزن",
        "Add weight:": "زِد الوزن:",
        "Aim:": "الهدف:",
        "Continue workout": "أكمل التمرين",
        "Discard this workout?": "تجاهل هذا التمرين؟",
        "Done this week": "منجز هذا الأسبوع",
        "Easy day:": "يوم خفيف:",
        "Exercises": "التمارين",
        "Finish workout": "إنهاء التمرين",
        "First time": "أول مرة",
        "Go lighter": "خفّف الوزن",
        "Go lighter:": "خفّف الوزن:",
        "Last:": "آخر مرة:",
        "Log more sets": "سجّل مجموعات إضافية",
        "New records": "أرقام قياسية جديدة",
        "No exercises yet": "لا توجد تمارين بعد",
        "Plan": "الخطة",
        "Plan this day": "خطّط هذا اليوم",
        "Profile": "حسابي",
        "Progress": "التقدّم",
        "RPE column off": "تم إخفاء عمود RPE",
        "RPE column on": "تم إظهار عمود RPE",
        "Recover well. See you next session.": "استشفِ جيداً. نراك في التمرين القادم.",
        "Show RPE": "إظهار RPE",
        "Start workout": "ابدأ التمرين",
        "Time": "الوقت",
        "Today": "اليوم",
        "Workout complete!": "أحسنت! انتهى التمرين",
        "kg lifted": "كجم مرفوعة",
        "sets": "مجموعات",
        "{n} exercises": "{n} تمارين",
        "{n} sets": "{n} مجموعات",
        "~{n} min": "~{n} دقيقة",
        "Previous": "السابق",
        "Save & next": "حفظ والتالي",
        "Add set": "إضافة مجموعة",
        "Remove set": "حذف مجموعة",
        "Tap a previous set to copy it. RPE (optional): 10 = no reps left, 9 = 1 left, 8 = 2 left.": "اضغط على المجموعة السابقة لنسخها. RPE (اختياري): 10 = لا تكرارات متبقية، 9 = تكرار واحد، 8 = تكراران.",
        "Discard current session?": "تجاهل الجلسة الحالية؟",
        "Unsaved sets for {name} will be lost.": "ستضيع المجموعات غير المحفوظة لتمرين {name}.",
        "Your unsaved sets will be lost.": "ستضيع مجموعاتك غير المحفوظة.",
        "Enter KG for every set (0 = bodyweight)": "أدخل الوزن لكل مجموعة (0 = وزن الجسم)",
        "Confirm": "تأكيد",
        "Workout completed": "تم إنهاء التمرين",
        "Day progress": "تقدّم اليوم",
        "Copy to...": "نسخ إلى...",
        "Copy": "نسخ",
        "Copied to {day}": "تم النسخ إلى {day}",
        "Replace {day}?": "استبدال {day}؟",
        "Its current exercises will be replaced.": "سيتم استبدال تمارينه الحالية.",
        "Last backup: today": "آخر نسخة احتياطية: اليوم",
        "Last backup: {n} days ago": "آخر نسخة احتياطية: قبل {n} يوم",
        "-- Skip (Do Not Import) --": "-- تخطي (لا تستورد) --",
        "1 exercise added": "تمت إضافة تمرين واحد",
        "3 quick taps to adjust today's targets.": "3 ضغطات سريعة لضبط أهداف اليوم.",
        "A bit": "قليلاً",
        "ALL": "الكل",
        "Action Plan Empty": "لا توجد خطة بعد",
        "Active": "نشط",
        "Active Rest": "راحة نشطة",
        "Add \"{name}\" to {muscle}": "أضف \"{name}\" إلى {muscle}",
        "Add 1 exercise": "أضف تمريناً واحداً",
        "Add Exercise": "إضافة تمرين",
        "Add exercises": "إضافة تمارين",
        "Add {n} exercises": "أضف {n} تمارين",
        "All": "الكل",
        "App Settings": "إعدادات التطبيق",
        "Apply": "تطبيق",
        "BW": "وزن الجسم",
        "Backup Data": "نسخ احتياطي",
        "Backup Manager": "النسخ الاحتياطي",
        "Build a routine with exercises to see your weekly workload goals.": "أنشئ جدولاً بالتمارين لترى أهداف حجم التمرين الأسبوعية.",
        "CORE": "الجذع",
        "Cancel": "إلغاء",
        "Change check-in": "تعديل التقييم",
        "Check-in saved": "تم حفظ التقييم",
        "Clear": "مسح",
        "Clear Day": "مسح اليوم",
        "Complete Rest": "راحة تامة",
        "Complete a workout and log your sets. The app will analyze your performance and generate smart weight recommendations here.": "أكمل تمريناً وسجّل مجموعاتك، وسيحلل التطبيق أداءك ويعطيك توصيات ذكية للأوزان هنا.",
        "Completion": "نسبة الإنجاز",
        "Confirm & Merge": "تأكيد ودمج",
        "Confirm Action": "تأكيد",
        "Contact Us": "تواصل معنا",
        "Custom schedule found": "تم العثور على جدول",
        "Custom, e.g. 5 or 6 - 8": "مخصص، مثل 5 أو 6 - 8",
        "Daily Check-in": "تقييم اليوم",
        "Data & Backup": "البيانات والنسخ الاحتياطي",
        "Data Exported!": "تم تصدير البيانات!",
        "Data Merged Successfully!": "تم دمج البيانات بنجاح!",
        "Day {n}": "اليوم {n}",
        "Delete": "حذف",
        "Delete Record": "حذف السجل",
        "Delete all exercises?": "حذف كل التمارين؟",
        "Deleted": "تم الحذف",
        "Developed By": "تطوير",
        "Done": "تم",
        "Easy Day": "يوم خفيف",
        "Easy day: targets adjusted": "يوم خفيف: تم تعديل الأهداف",
        "Edit All": "تعديل الكل",
        "Energy": "النشاط",
        "Enter Sets or Reps": "أدخل المجموعات أو التكرارات",
        "Enter reps first": "أدخل التكرارات أولاً",
        "Enter reps for at least 1 set": "أدخل التكرارات لمجموعة واحدة على الأقل",
        "Enter seconds first": "أدخل الثواني أولاً",
        "Exercise": "التمرين",
        "Export Selected Data": "تصدير البيانات المختارة",
        "Follow your targets as planned.": "اتبع أهدافك كما هي.",
        "Fresh": "مرتاح",
        "Full Body A": "جسم كامل A",
        "Full Body B": "جسم كامل B",
        "GO!": "انطلق!",
        "Great": "ممتاز",
        "High": "عالي",
        "In this day": "موجود في هذا اليوم",
        "In your routines": "في جداولك",
        "Invalid Backup file": "ملف النسخة الاحتياطية غير صالح",
        "KG": "كجم",
        "LEGS": "أرجل",
        "LOGGED": "مسجّل",
        "Language": "اللغة",
        "Last Log": "آخر تسجيل",
        "Legs": "أرجل",
        "Link Progress": "ربط التقدّم",
        "Low": "منخفض",
        "Low recovery: no weight increases today. Keep your weight, aim for the bottom of the range and stop 2 reps before failure.": "استشفاء منخفض: لا زيادة في الأوزان اليوم. حافظ على وزنك، واستهدف أقل عدد في النطاق، وتوقف قبل الفشل بتكرارين.",
        "Lower Body": "الجزء السفلي",
        "Main Routine": "الجدول الرئيسي",
        "Match old backup exercises to your active routine. Unlinked data will be skipped.": "اربط تمارين النسخة القديمة بتمارين جدولك الحالي. التمارين غير المربوطة لن تُستورد.",
        "Merge Selected Data": "دمج البيانات المختارة",
        "New Day": "يوم جديد",
        "New Workout": "تمرين جديد",
        "No Volume Detected": "لا يوجد حجم تمرين",
        "No exercises found": "لا توجد تمارين",
        "No exercises scheduled.": "لا توجد تمارين مجدولة.",
        "No progress found": "لا يوجد تقدّم",
        "No records": "لا توجد سجلات",
        "No schedule found": "لا يوجد جدول",
        "No settings found": "لا توجد إعدادات",
        "Normal Day": "يوم عادي",
        "Not in the list? Choose a muscle above, then add \"{name}\" as your own exercise.": "غير موجود؟ اختر العضلة من الأعلى ثم أضف \"{name}\" كتمرين خاص بك.",
        "OF {n} SETS": "من {n} مجموعات",
        "OK": "متوسط",
        "Official Instagram": "حسابنا في إنستغرام",
        "Account deleted": "تم حذف الحساب",
        "Back up & sync": "النسخ الاحتياطي والمزامنة",
        "Connecting…": "جارٍ الاتصال…",
        "Continue with Google": "المتابعة باستخدام Google",
        "Delete my account": "حذف حسابي",
        "Delete your account?": "حذف حسابك؟",
        "No internet connection. Try again when online.": "لا يوجد اتصال بالإنترنت. حاول مرة أخرى عند الاتصال.",
        "Offline · will sync when online": "غير متصل · ستتم المزامنة عند الاتصال",
        "Privacy policy": "سياسة الخصوصية",
        "Sign in to keep your workouts safe in the cloud and use them on any phone.": "سجّل الدخول لحفظ تمارينك في السحابة واستخدامها على أي جوال.",
        "Sign out": "تسجيل الخروج",
        "Sign out?": "تسجيل الخروج؟",
        "Sign-in failed. Please try again.": "فشل تسجيل الدخول. حاول مرة أخرى.",
        "Signed out": "تم تسجيل الخروج",
        "Signing in…": "جارٍ تسجيل الدخول…",
        "Sync now": "زامن الآن",
        "Sync problem · tap Sync now": "مشكلة في المزامنة · اضغط زامن الآن",
        "Synced · {time}": "تمت المزامنة · {time}",
        "Syncing…": "جارٍ المزامنة…",
        "This deletes your cloud backup and your account. The workouts on this phone stay.": "سيحذف هذا نسختك السحابية وحسابك. التمارين المحفوظة على هذا الجوال تبقى.",
        "This website is not allowed in Firebase yet (Authentication → Settings → Authorized domains).": "هذا الموقع غير مسموح في Firebase بعد (Authentication ← Settings ← Authorized domains).",
        "Your workouts stay on this phone. Sign in again anytime to sync.": "تمارينك تبقى على هذا الجوال. سجّل الدخول مرة أخرى في أي وقت للمزامنة.",
        "Old:": "القديم:",
        "Overwrites current schedule": "يستبدل الجدول الحالي",
        "PULL": "سحب",
        "PUSH": "دفع",
        "Poor": "سيئ",
        "Pull": "سحب",
        "Push": "دفع",
        "Push Day": "يوم قوي",
        "Push day: go get it!": "يوم قوي: انطلق!",
        "REPS": "تكرار",
        "Remove this record?": "حذف هذا السجل؟",
        "Removed {name}": "تم حذف {name}",
        "Reps": "التكرارات",
        "Reset Complete": "تمت إعادة الضبط",
        "Rest": "راحة",
        "Rest Timer": "مؤقت الراحة",
        "Rest over": "انتهت الراحة",
        "Rest timer: {v}s": "مؤقت الراحة: {v} ثانية",
        "Restore Data": "استعادة البيانات",
        "Restore Manager": "استعادة البيانات",
        "Restored Routine": "جدول مستعاد",
        "Restores Start Day & Rest Timer": "يستعيد بداية الأسبوع ومؤقت الراحة",
        "Routine": "جدول",
        "Routine in file is damaged: skipped": "الجدول في الملف تالف: تم تخطيه",
        "SEC": "ثانية",
        "Saves Start Day & Rest Timer": "يحفظ بداية الأسبوع ومؤقت الراحة",
        "Saves current schedule": "يحفظ الجدول الحالي",
        "Saves weights & history": "يحفظ الأوزان والسجل",
        "Scans for weights & history": "يبحث عن الأوزان والسجل",
        "Search exercises": "ابحث عن تمرين",
        "Select": "اختيار",
        "Select at least one option!": "اختر خياراً واحداً على الأقل!",
        "Select exactly what you want to extract from this backup file.": "اختر ما تريد استعادته من ملف النسخة الاحتياطية.",
        "Select exactly what you want to include in this backup file.": "اختر ما تريد حفظه في ملف النسخة الاحتياطية.",
        "Sets": "المجموعات",
        "Skip": "تخطي",
        "Sleep": "النوم",
        "Soreness": "الإجهاد العضلي",
        "Start Day: {d}": "بداية الأسبوع: {d}",
        "Storage full: data not saved. Backup & delete old records.": "الذاكرة ممتلئة: لم تُحفظ البيانات. خذ نسخة احتياطية واحذف السجلات القديمة.",
        "Swap": "تبديل",
        "Swap exercise": "تبديل التمرين",
        "Swap {name}": "تبديل {name}",
        "Swap...": "تبديل...",
        "Swapped to {name}": "تم التبديل إلى {name}",
        "Target": "الهدف",
        "Target:": "الهدف:",
        "Undo": "تراجع",
        "Unnamed": "بدون اسم",
        "Updated all exercises": "تم تحديث كل التمارين",
        "Upper Body": "الجزء العلوي",
        "Very": "كثير",
        "WEEK {n}": "الأسبوع {n}",
        "Week 1": "الأسبوع 1",
        "Week Active": "الأسبوع النشط",
        "Week starts on {d}": "يبدأ الأسبوع يوم {d}",
        "Well recovered. Go for your targets.": "استشفاء ممتاز. انطلق نحو أهدافك.",
        "Workload Tracking": "حجم التمرين",
        "Workout": "التمرين",
        "Workout Routine": "جدول التمارين",
        "Yes, Do it": "نعم، نفّذ",
        "{n} exercises added": "تمت إضافة {n} تمارين",
        "{n} exercises found": "تم العثور على {n} تمرين",
    };
    const t = (en, vars) => {
        let out = (isAR && AR[en]) || en;
        if (vars) out = out.replace(/\{(\w+)\}/g, (m, k) => vars[k] !== undefined ? vars[k] : m);
        return out;
    };
    const MUSCLE_AR = { 'Abductors':'مبعدات الورك','Abs':'البطن','Adductors':'مقربات الورك','Back':'الظهر','Biceps':'البايسبس','Calves':'السمانة','Chest':'الصدر','Forearms':'الساعد','Front Delts':'الكتف الأمامي','Glutes':'المؤخرة','Hamstrings':'خلفي الفخذ','Lats':'اللاتس','Lower Back':'أسفل الظهر','Lower Chest':'أسفل الصدر','Neck':'الرقبة','Quads':'أمامي الفخذ','Rear Delts':'الكتف الخلفي','Shoulders':'الأكتاف','Side Delts':'الكتف الجانبي','Traps':'الترابيس','Triceps':'الترايسبس','Upper Chest':'أعلى الصدر','Abs & Core':'البطن والجذع','Muscle':'العضلة' };
    const tm = m => (isAR && MUSCLE_AR[(m || '').trim()]) || m || '';
    const DAY_AR = { SUN:'الأحد', MON:'الاثنين', TUE:'الثلاثاء', WED:'الأربعاء', THU:'الخميس', FRI:'الجمعة', SAT:'السبت' };
    const tDay = d => (isAR && DAY_AR[d]) || d;
    const DAY_EN = { SUN:'Sunday', MON:'Monday', TUE:'Tuesday', WED:'Wednesday', THU:'Thursday', FRI:'Friday', SAT:'Saturday' };
    const dayLong = d => isAR ? (DAY_AR[d] || d) : (DAY_EN[d] || d);
    const DAY_AR_SHORT = { SUN:'أحد', MON:'اثنين', TUE:'ثلاثاء', WED:'أربعاء', THU:'خميس', FRI:'جمعة', SAT:'سبت' };
    const dayShort = d => isAR ? (DAY_AR_SHORT[d] || d) : (DAY_EN[d] || d).slice(0, 3);
    // Dates are shown in the chosen language (always the normal calendar and 0-9 digits)
    const fmtDate = (ts, withTime = true) => {
        const d = new Date(ts);
        if (isNaN(d)) return '';
        const opt = { day: '2-digit', month: 'short', year: 'numeric', calendar: 'gregory', numberingSystem: 'latn' };
        if (withTime) { opt.hour = 'numeric'; opt.minute = '2-digit'; }
        return new Intl.DateTimeFormat(isAR ? 'ar' : 'en-GB', opt).format(d);
    };
    const fmtDayMonth = d => new Intl.DateTimeFormat(isAR ? 'ar' : 'en-GB', { day: 'numeric', month: 'short', calendar: 'gregory', numberingSystem: 'latn' }).format(d);

    // 📦 1. MINIFIED DATA (Cleaned Dictionary & Standardized Presets)
    const muscleOptions=["Abductors","Abs","Adductors","Back","Biceps","Calves","Chest","Forearms","Front Delts","Glutes","Hamstrings","Lats","Lower Back","Lower Chest","Neck","Quads","Rear Delts","Shoulders","Side Delts","Traps","Triceps","Upper Chest"];
    
    const exerciseDictionary={
        "Abs":["Ab Wheel Rollout", "Bicycle Crunch", "Cable Crunch", "Cable Side Bend", "Cable Woodchopper", "Captain's Chair Leg Raise", "Crunch", "Dead Bug", "Decline Crunch", "Decline Sit-up", "Dragon Flag", "Dumbbell Side Bend", "Flutter Kick", "Hanging Knee Raise", "Hanging Leg Raise", "Hanging Windshield Wiper", "Hollow Body Hold", "L-Sit", "Landmine Rotation", "Leg Raise", "Machine Crunch", "Mountain Climber", "Oblique Crunch", "Pallof Press", "Plank", "Reverse Crunch", "Russian Twist", "Side Plank", "Sit-up", "Stomach Vacuum", "Toe Touch", "V-up", "Weighted Plank"],
        "Abductors":["Banded Lateral Walk", "Cable Hip Abduction", "Clamshell", "Fire Hydrant", "Machine Hip Abduction", "Seated Hip Abduction", "Side-Lying Leg Raise", "Standing Leg Raise"],
        "Adductors":["Cable Hip Adduction", "Copenhagen Plank", "Cossack Squat", "Machine Hip Adduction", "Seated Hip Adduction", "Side Lunge"],
        "Back":["Barbell Row", "Cable Low Row", "Chest-Supported Row", "Chest-Supported T-Bar Row", "Deadlift", "Dumbbell Row", "Helms Row", "High Row Machine", "Incline Dumbbell Row", "Inverted Row", "Iso-Lateral Row", "Kroc Row", "Landmine Row", "Lat Pulldown", "Low Row Machine", "Machine Row", "Meadows Row", "Pendlay Row", "Pull-up", "Rack Pull", "Renegade Row", "Seal Row", "Seated Cable Row", "Single-Arm Cable Row", "Single-Arm Machine Row", "Smith Machine Row", "Snatch-Grip Deadlift", "T-Bar Row", "Trap Bar Deadlift", "Underhand Barbell Row", "V-Bar Pulldown", "Wide-Grip Seated Cable Row", "Yates Row"],
        "Biceps":["21s", "Alternating Dumbbell Curl", "Barbell Curl", "Bayesian Curl", "Cable Curl", "Cable Hammer Curl", "Cable Rope Curl", "Concentration Curl", "Cross-Body Hammer Curl", "Drag Curl", "Dumbbell Curl", "Dumbbell Preacher Curl", "EZ Bar Curl", "Hammer Curl", "High Cable Curl", "Incline Dumbbell Curl", "Incline Hammer Curl", "Machine Bicep Curl", "Machine Preacher Curl", "Overhead Cable Curl", "Preacher Curl", "Reverse Curl", "Seated Dumbbell Curl", "Single-Arm Cable Curl", "Spider Curl", "Waiter Curl", "Zottman Curl"],
        "Calves":["Calf Press on Leg Press", "Donkey Calf Raise", "Dumbbell Calf Raise", "Hack Squat Calf Raise", "Machine Calf Press", "Seated Calf Raise", "Single Leg Calf Raise", "Smith Machine Calf Raise", "Standing Calf Raise", "Tibialis Raise"],
        "Chest":["Archer Push-up", "Bench Press", "Cable Chest Press", "Cable Crossover", "Cable Fly", "Deficit Push-up", "Dumbbell Bench Press", "Dumbbell Floor Press", "Dumbbell Fly", "Dumbbell Pullover", "Dumbbell Squeeze Press", "Floor Press", "Guillotine Press", "Hex Press", "Iso-Lateral Chest Press", "Landmine Press", "Larsen Press", "Machine Chest Press", "Machine Fly", "Paused Bench Press", "Pec Deck Fly", "Push-up", "Seated Cable Fly", "Single-Arm Cable Fly", "Smith Machine Bench Press", "Spoto Press", "Svend Press", "Weighted Push-up", "Wide-Grip Bench Press"],
        "Forearms":["Behind the Back Wrist Curl", "Cable Wrist Curl", "Dead Hang", "Dumbbell Wrist Curl", "Farmers Walk", "Hand Gripper", "Plate Pinch", "Reverse Barbell Curl", "Reverse Dumbbell Curl", "Wrist Curl", "Wrist Extension", "Wrist Roller"],
        "Front Delts":["Arnold Press", "Barbell Front Raise", "Cable Front Raise", "Dumbbell Front Raise", "Dumbbell Shoulder Press", "Landmine Press", "Military Press", "Overhead Press", "Plate Front Raise", "Seated Barbell Press", "Smith Machine Shoulder Press"],
        "Glutes":["B-Stance Hip Thrust", "Banded Glute Bridge", "Barbell Glute Bridge", "Bulgarian Split Squat", "Cable Glute Kickback", "Cable Pull-Through", "Curtsy Lunge", "Deficit Reverse Lunge", "Donkey Kick", "Frog Pump", "Glute Bridge", "Glute Drive Machine", "Glute Kickback", "Hip Thrust", "Hip Thrust Machine", "Kas Glute Bridge", "Kettlebell Swing", "Lunge", "Machine Glute Kickback", "Reverse Hyperextension", "Reverse Lunge", "Single Leg Glute Bridge", "Single Leg Hip Thrust", "Smith Machine Hip Thrust", "Step-up", "Walking Lunge"],
        "Hamstrings":["Deficit Romanian Deadlift", "Dumbbell Romanian Deadlift", "Glute-Ham Raise", "Good Morning", "Hamstring Curl", "Kettlebell Swing", "Lying Leg Curl", "Nordic Hamstring Curl", "Romanian Deadlift", "Seated Leg Curl", "Single Leg Romanian Deadlift", "Sliding Leg Curl", "Stability Ball Leg Curl", "Standing Leg Curl", "Stiff-Legged Deadlift", "Sumo Deadlift"],
        "Lats":["Assisted Chin-up", "Assisted Pull-up", "Cable Pullover", "Chin-up", "Close-Grip Lat Pulldown", "Dumbbell Pullover", "Iso-Lateral Pulldown", "Lat Pulldown", "Machine Pullover", "Neutral Grip Pull-up", "Neutral Grip Pulldown", "Pull-up", "Reverse Grip Lat Pulldown", "Single-Arm Cable Pulldown", "Straight Arm Pulldown", "Weighted Pull-up", "Wide-Grip Lat Pulldown", "Wide-Grip Pull-up"],
        "Lower Back":["Back Extension", "Bird Dog", "Deadlift", "Deficit Deadlift", "Good Morning", "Hyperextension", "Jefferson Curl", "Rack Pull", "Reverse Hyperextension", "Romanian Deadlift", "Sumo Deadlift", "Superman"],
        "Lower Chest":["Cable Crossover", "Chest Dip", "Decline Bench Press", "Decline Dumbbell Fly", "Decline Dumbbell Press", "Decline Machine Press", "Decline Push-up", "Decline Smith Machine Press", "High-to-Low Cable Fly", "Weighted Dip"],
        "Neck":["Neck Curl", "Neck Extension", "Neck Lateral Flexion", "Shrug"],
        "Quads":["Belt Squat", "Box Jump", "Box Squat", "Bulgarian Split Squat", "Cyclist Squat", "Front Squat", "Goblet Squat", "Hack Squat", "Hack Squat Machine", "Heel-Elevated Squat", "Leg Extension", "Leg Press", "Lunge", "Paused Squat", "Pendulum Squat", "Pistol Squat", "Reverse Nordic", "Safety Bar Squat", "Single Leg Extension", "Single Leg Press", "Sissy Squat", "Smith Machine Squat", "Spanish Squat", "Split Squat", "Squat", "Step-up", "Sumo Squat", "Trap Bar Deadlift", "V-Squat", "Walking Lunge", "Wall Sit", "Zercher Squat"],
        "Rear Delts":["Band Pull-Apart", "Cable Rear Delt Fly", "Dumbbell Rear Delt Row", "Facepull", "Lying Rear Delt Fly", "Machine Reverse Fly", "Rear Delt Fly", "Reverse Pec Deck", "Rope Facepull", "Single-Arm Cable Rear Delt Fly"],
        "Shoulders":["Arnold Press", "Behind-the-Neck Press", "Bradford Press", "Cable Lateral Raise", "Cuban Press", "Dumbbell Shoulder Press", "Landmine Press", "Lateral Raise", "Machine Shoulder Press", "Military Press", "Overhead Press", "Push Press", "Seated Dumbbell Press", "Single-Arm Dumbbell Press", "Smith Machine Shoulder Press", "Upright Row", "Z Press"],
        "Side Delts":["Cable Lateral Raise", "Cable Upright Row", "Cable Y-Raise", "Dumbbell Lateral Raise", "Egyptian Lateral Raise", "Lean-Away Lateral Raise", "Lu Raise", "Machine Lateral Raise", "Seated Dumbbell Lateral Raise", "Single-Arm Cable Lateral Raise", "Upright Row"],
        "Traps":["Barbell Shrug", "Behind-the-Back Barbell Shrug", "Cable Shrug", "Dumbbell Shrug", "Farmers Walk", "Hex Bar Shrug", "Kelso Shrug", "Machine Shrug", "Shrug", "Smith Machine Shrug", "Snatch Grip Shrug", "Upright Row"],
        "Triceps":["Assisted Dip", "Bench Dip", "Cable Overhead Tricep Extension", "Cable Tricep Kickback", "Close-Grip Bench Press", "Close-Grip Push-up", "Cross-Body Cable Extension", "Diamond Push-up", "Dumbbell Kickback", "Dumbbell Skull Crusher", "Dumbbell Tricep Extension", "French Press", "JM Press", "Katana Extension", "Machine Dip", "Machine Tricep Extension", "Overhead Tricep Extension", "Reverse-Grip Pushdown", "Single-Arm Cable Pushdown", "Single-Arm Tricep Extension", "Skull Crusher", "Tate Press", "Tricep Dip", "Tricep Extension", "Tricep Pushdown", "Tricep Rope Pushdown", "V-Bar Tricep Pushdown"],
        "Upper Chest":["Incline Bench Press", "Incline Cable Fly", "Incline Dumbbell Fly", "Incline Dumbbell Press", "Incline Machine Press", "Incline Push-up", "Incline Smith Machine Press", "Landmine Press", "Low-Incline Dumbbell Press", "Low-to-High Cable Fly", "Reverse-Grip Bench Press"]
    };    
    // Automatically removes any duplicates caused by overlapping categories
    const exerciseOptions=[...new Set(Object.values(exerciseDictionary).flat())].sort();
    
    // Default routine (names match the exercise dictionary)
    const defaultWorkoutData=[
        {id:1,day:"SAT",title:"Push & Bi",exercises:[
            {muscle:"Upper Chest",name:"Incline Bench Press",sets:"4",reps:"8 - 10"},
            {muscle:"Chest",name:"Machine Chest Press",sets:"3",reps:"10 - 12"},
            {muscle:"Shoulders",name:"Dumbbell Shoulder Press",sets:"3",reps:"10 - 12"},
            {muscle:"Side Delts",name:"Dumbbell Lateral Raise",sets:"3",reps:"8 - 10"},
            {muscle:"Biceps",name:"Preacher Curl",sets:"3",reps:"10 - 12"},
            {muscle:"Biceps",name:"Hammer Curl",sets:"3",reps:"10 - 12"}
        ]},
        {id:2,day:"SUN",title:"Pull & TRI",exercises:[
            {muscle:"Lats",name:"Lat Pulldown",sets:"3",reps:"10 - 12"},
            {muscle:"Back",name:"Chest-Supported Row",sets:"3",reps:"8 - 10"},
            {muscle:"Rear Delts",name:"Machine Reverse Fly",sets:"3",reps:"12 - 15"},
            {muscle:"Triceps",name:"Tricep Pushdown",sets:"3",reps:"12 - 15"},
            {muscle:"Triceps",name:"Overhead Tricep Extension",sets:"3",reps:"12 - 15"}
        ]},
        {id:3,day:"MON",title:"Legs A",exercises:[
            {muscle:"Quads",name:"Leg Press",sets:"4",reps:"10 - 12"},
            {muscle:"Quads",name:"Leg Extension",sets:"3",reps:"12 - 15"},
            {muscle:"Hamstrings",name:"Seated Leg Curl",sets:"3",reps:"12 - 15"},
            {muscle:"Calves",name:"Standing Calf Raise",sets:"4",reps:"15 - 20"}
        ]},
        {id:4,day:"TUE",title:"Active Rest",isRest:true,recoveryType:"active",exercises:[]},
        {id:5,day:"WED",title:"Upper Body",exercises:[
            {muscle:"Chest",name:"Machine Chest Press",sets:"3",reps:"8 - 10"},
            {muscle:"Upper Chest",name:"Incline Machine Press",sets:"2",reps:"10 - 12"},
            {muscle:"Shoulders",name:"Machine Shoulder Press",sets:"3",reps:"8 - 10"},
            {muscle:"Lats",name:"Lat Pulldown",sets:"3",reps:"8 - 10"},
            {muscle:"Back",name:"Seated Cable Row",sets:"2",reps:"10 - 12"},
            {muscle:"Biceps",name:"Machine Bicep Curl",sets:"2",reps:"10 - 12"},
            {muscle:"Triceps",name:"Tricep Pushdown",sets:"2",reps:"10 - 12"}
        ]},
        {id:6,day:"THU",title:"Lower Body & Abs",exercises:[
            {muscle:"Quads",name:"Squat",sets:"3",reps:"8 - 10"},
            {muscle:"Quads",name:"Leg Press",sets:"2",reps:"10 - 12"},
            {muscle:"Quads",name:"Leg Extension",sets:"2",reps:"10 - 12"},
            {muscle:"Hamstrings",name:"Seated Leg Curl",sets:"2",reps:"10 - 12"},
            {muscle:"Calves",name:"Machine Calf Press",sets:"3",reps:"12 - 15"},
            {muscle:"Abs",name:"Plank",sets:"3",reps:"30 - 45s"}
        ]},
        {id:7,day:"FRI",title:"Complete Rest",isRest:true,recoveryType:"complete",exercises:[]}
    ];

    // 📋 PROGRAMS: workout days [title, [[exercise, muscle, sets, reps], ...]] and weekly programs.
    // week = 7 slots from the first day of your week ('R' = rest, 'A' = active rest).
    const WORKOUTS = {"push": ["Push", [["Bench Press", "Chest", "4", "6 - 8"], ["Incline Dumbbell Press", "Upper Chest", "3", "8 - 10"], ["Overhead Press", "Shoulders", "3", "6 - 8"], ["Cable Lateral Raise", "Side Delts", "3", "12 - 15"], ["Tricep Rope Pushdown", "Triceps", "3", "10 - 12"], ["Overhead Tricep Extension", "Triceps", "3", "10 - 12"]]], "pull": ["Pull", [["Pull-up", "Lats", "3", "6 - 10"], ["Barbell Row", "Back", "3", "6 - 8"], ["Lat Pulldown", "Lats", "3", "10 - 12"], ["Facepull", "Rear Delts", "3", "12 - 15"], ["Barbell Curl", "Biceps", "3", "8 - 10"], ["Hammer Curl", "Biceps", "3", "10 - 12"]]], "legs": ["Legs", [["Squat", "Quads", "4", "6 - 8"], ["Romanian Deadlift", "Hamstrings", "3", "8 - 10"], ["Leg Press", "Quads", "3", "10 - 12"], ["Lying Leg Curl", "Hamstrings", "3", "10 - 12"], ["Standing Calf Raise", "Calves", "4", "10 - 15"], ["Hanging Leg Raise", "Abs", "3", "10 - 15"]]], "upper": ["Upper Body", [["Bench Press", "Chest", "4", "6 - 8"], ["Barbell Row", "Back", "4", "6 - 8"], ["Overhead Press", "Shoulders", "3", "8 - 10"], ["Lat Pulldown", "Lats", "3", "10 - 12"], ["Dumbbell Lateral Raise", "Side Delts", "3", "12 - 15"], ["EZ Bar Curl", "Biceps", "2", "10 - 12"], ["Tricep Pushdown", "Triceps", "2", "10 - 12"]]], "lower": ["Lower Body", [["Squat", "Quads", "4", "6 - 8"], ["Romanian Deadlift", "Hamstrings", "3", "8 - 10"], ["Leg Press", "Quads", "3", "10 - 12"], ["Seated Leg Curl", "Hamstrings", "3", "10 - 12"], ["Standing Calf Raise", "Calves", "4", "10 - 15"], ["Cable Crunch", "Abs", "3", "12 - 15"]]], "upow": ["Upper Power", [["Bench Press", "Chest", "4", "3 - 5"], ["Barbell Row", "Back", "4", "3 - 5"], ["Overhead Press", "Shoulders", "3", "5 - 8"], ["Weighted Pull-up", "Lats", "3", "5 - 8"], ["Barbell Curl", "Biceps", "3", "6 - 8"], ["Skull Crusher", "Triceps", "3", "6 - 8"]]], "lpow": ["Lower Power", [["Squat", "Quads", "4", "3 - 5"], ["Deadlift", "Back", "3", "3 - 5"], ["Leg Press", "Quads", "3", "8 - 10"], ["Lying Leg Curl", "Hamstrings", "3", "6 - 8"], ["Standing Calf Raise", "Calves", "4", "6 - 10"]]], "uhyp": ["Upper Hypertrophy", [["Incline Dumbbell Press", "Upper Chest", "4", "8 - 12"], ["Seated Cable Row", "Back", "4", "8 - 12"], ["Dumbbell Shoulder Press", "Shoulders", "3", "10 - 12"], ["Cable Crossover", "Chest", "3", "12 - 15"], ["Lat Pulldown", "Lats", "3", "10 - 12"], ["Incline Dumbbell Curl", "Biceps", "3", "10 - 12"], ["Tricep Rope Pushdown", "Triceps", "3", "10 - 12"]]], "lhyp": ["Lower Hypertrophy", [["Front Squat", "Quads", "3", "8 - 10"], ["Romanian Deadlift", "Hamstrings", "3", "8 - 10"], ["Bulgarian Split Squat", "Quads", "3", "10 - 12"], ["Leg Extension", "Quads", "3", "12 - 15"], ["Seated Leg Curl", "Hamstrings", "3", "12 - 15"], ["Seated Calf Raise", "Calves", "4", "12 - 15"]]], "chest": ["Chest", [["Bench Press", "Chest", "4", "6 - 8"], ["Incline Dumbbell Press", "Upper Chest", "3", "8 - 10"], ["Machine Chest Press", "Chest", "3", "10 - 12"], ["Cable Crossover", "Chest", "3", "12 - 15"], ["Chest Dip", "Lower Chest", "3", "8 - 12"]]], "back": ["Back", [["Deadlift", "Back", "3", "5"], ["Pull-up", "Lats", "3", "6 - 10"], ["Barbell Row", "Back", "3", "8 - 10"], ["Seated Cable Row", "Back", "3", "10 - 12"], ["Straight Arm Pulldown", "Lats", "3", "12 - 15"]]], "shoulders": ["Shoulders", [["Overhead Press", "Shoulders", "4", "6 - 8"], ["Dumbbell Lateral Raise", "Side Delts", "4", "12 - 15"], ["Rear Delt Fly", "Rear Delts", "3", "12 - 15"], ["Cable Lateral Raise", "Side Delts", "3", "12 - 15"], ["Dumbbell Shrug", "Traps", "3", "10 - 12"]]], "arms": ["Arms", [["Barbell Curl", "Biceps", "4", "8 - 10"], ["Close-Grip Bench Press", "Triceps", "4", "6 - 8"], ["Hammer Curl", "Biceps", "3", "10 - 12"], ["Overhead Tricep Extension", "Triceps", "3", "10 - 12"], ["Preacher Curl", "Biceps", "3", "10 - 12"], ["Tricep Pushdown", "Triceps", "3", "12 - 15"]]], "chback": ["Chest & Back", [["Bench Press", "Chest", "4", "6 - 8"], ["Pull-up", "Lats", "4", "6 - 10"], ["Incline Dumbbell Press", "Upper Chest", "3", "8 - 10"], ["Barbell Row", "Back", "3", "8 - 10"], ["Dumbbell Fly", "Chest", "3", "10 - 12"], ["Dumbbell Pullover", "Lats", "3", "10 - 12"]]], "sharms": ["Shoulders & Arms", [["Seated Barbell Press", "Front Delts", "4", "6 - 8"], ["Dumbbell Lateral Raise", "Side Delts", "3", "12 - 15"], ["Barbell Curl", "Biceps", "3", "8 - 10"], ["Close-Grip Bench Press", "Triceps", "3", "8 - 10"], ["Incline Dumbbell Curl", "Biceps", "3", "10 - 12"], ["Skull Crusher", "Triceps", "3", "10 - 12"]]], "fba": ["Full Body A", [["Squat", "Quads", "3", "6 - 8"], ["Bench Press", "Chest", "3", "6 - 8"], ["Barbell Row", "Back", "3", "8 - 10"], ["Dumbbell Lateral Raise", "Side Delts", "2", "12 - 15"], ["Hammer Curl", "Biceps", "2", "10 - 12"], ["Plank", "Abs", "3", "30 - 45s"]]], "fbb": ["Full Body B", [["Romanian Deadlift", "Hamstrings", "3", "8 - 10"], ["Overhead Press", "Shoulders", "3", "6 - 8"], ["Lat Pulldown", "Lats", "3", "10 - 12"], ["Leg Press", "Quads", "3", "10 - 12"], ["Tricep Pushdown", "Triceps", "2", "10 - 12"], ["Hanging Leg Raise", "Abs", "3", "10 - 15"]]], "s5a": ["Strength A", [["Squat", "Quads", "5", "5"], ["Bench Press", "Chest", "5", "5"], ["Barbell Row", "Back", "5", "5"]]], "s5b": ["Strength B", [["Squat", "Quads", "5", "5"], ["Overhead Press", "Shoulders", "5", "5"], ["Deadlift", "Back", "1", "5"]]], "gl_a": ["Glutes & Hamstrings", [["Hip Thrust", "Glutes", "4", "8 - 10"], ["Romanian Deadlift", "Hamstrings", "3", "8 - 10"], ["Bulgarian Split Squat", "Glutes", "3", "10 - 12"], ["Seated Leg Curl", "Hamstrings", "3", "12 - 15"], ["Machine Hip Abduction", "Abductors", "3", "15 - 20"]]], "gl_up": ["Upper Body", [["Lat Pulldown", "Lats", "3", "10 - 12"], ["Dumbbell Shoulder Press", "Shoulders", "3", "10 - 12"], ["Seated Cable Row", "Back", "3", "10 - 12"], ["Incline Dumbbell Press", "Upper Chest", "3", "10 - 12"], ["Dumbbell Lateral Raise", "Side Delts", "3", "12 - 15"], ["Tricep Rope Pushdown", "Triceps", "2", "12 - 15"]]], "gl_b": ["Quads & Glutes", [["Squat", "Quads", "4", "8 - 10"], ["Leg Press", "Quads", "3", "10 - 12"], ["Walking Lunge", "Glutes", "3", "10 - 12"], ["Leg Extension", "Quads", "3", "12 - 15"], ["Standing Calf Raise", "Calves", "3", "12 - 15"]]], "gl_c": ["Glutes", [["Hip Thrust", "Glutes", "3", "12 - 15"], ["Cable Glute Kickback", "Glutes", "3", "12 - 15"], ["Step-up", "Glutes", "3", "10 - 12"], ["Cable Pull-Through", "Glutes", "3", "12 - 15"], ["Machine Hip Abduction", "Abductors", "3", "15 - 20"], ["Plank", "Abs", "3", "30 - 45s"]]], "db_a": ["Upper Body", [["Dumbbell Bench Press", "Chest", "4", "8 - 10"], ["Dumbbell Row", "Back", "4", "8 - 10"], ["Dumbbell Shoulder Press", "Shoulders", "3", "10 - 12"], ["Dumbbell Lateral Raise", "Side Delts", "3", "12 - 15"], ["Dumbbell Curl", "Biceps", "3", "10 - 12"], ["Dumbbell Tricep Extension", "Triceps", "3", "10 - 12"]]], "db_b": ["Lower Body", [["Goblet Squat", "Quads", "4", "10 - 12"], ["Dumbbell Romanian Deadlift", "Hamstrings", "3", "10 - 12"], ["Bulgarian Split Squat", "Quads", "3", "10 - 12"], ["Dumbbell Calf Raise", "Calves", "4", "12 - 15"], ["Plank", "Abs", "3", "30 - 45s"]]], "db_c": ["Full Body", [["Incline Dumbbell Press", "Upper Chest", "3", "8 - 10"], ["Dumbbell Pullover", "Lats", "3", "10 - 12"], ["Walking Lunge", "Glutes", "3", "10 - 12"], ["Hammer Curl", "Biceps", "3", "10 - 12"], ["Push-up", "Chest", "3", "10 - 15"], ["Russian Twist", "Abs", "3", "12 - 15"]]]};
    const PROGRAMS = [{"id": "ppl6", "name": "Push / Pull / Legs", "days": 6, "goals": ["muscle", "fat"], "eq": "gym", "desc": "Each muscle twice a week. The classic for building muscle.", "week": ["push", "pull", "legs", "push", "pull", "legs", "R"]}, {"id": "ppl3", "name": "Push / Pull / Legs (3 days)", "days": 3, "goals": ["muscle"], "eq": "gym", "desc": "The same split once a week, with a rest day between sessions.", "week": ["push", "R", "pull", "R", "legs", "R", "R"]}, {"id": "ul4", "name": "Upper / Lower", "days": 4, "goals": ["muscle", "fat", "strength"], "eq": "gym", "desc": "Upper and lower body twice a week. Balanced and easy to fit in.", "week": ["upper", "lower", "R", "upper", "lower", "A", "R"]}, {"id": "phul", "name": "PHUL (Power + Hypertrophy)", "days": 4, "goals": ["strength", "muscle"], "eq": "gym", "desc": "Two heavy days for strength and two volume days for size.", "week": ["upow", "lpow", "R", "uhyp", "lhyp", "A", "R"]}, {"id": "hybrid5", "name": "Upper / Lower + Push / Pull / Legs", "days": 5, "goals": ["muscle", "fat"], "eq": "gym", "desc": "Five days: upper and lower, then push, pull and legs.", "week": ["upper", "lower", "R", "push", "pull", "legs", "R"]}, {"id": "bro5", "name": "Bro Split", "days": 5, "goals": ["muscle"], "eq": "gym", "desc": "One muscle group per day: chest, back, shoulders, arms and legs.", "week": ["chest", "back", "shoulders", "arms", "legs", "R", "R"]}, {"id": "arnold6", "name": "Arnold Split", "days": 6, "goals": ["muscle"], "eq": "gym", "desc": "Chest & back, shoulders & arms, legs. Twice a week, high volume.", "week": ["chback", "sharms", "legs", "chback", "sharms", "legs", "R"]}, {"id": "fb3", "name": "Full Body", "days": 3, "goals": ["fat", "muscle"], "eq": "gym", "desc": "The whole body every session. Great with a busy schedule.", "week": ["fba", "R", "fbb", "R", "fba", "A", "R"]}, {"id": "s5x5", "name": "5×5 Strength", "days": 3, "goals": ["strength"], "eq": "gym", "desc": "Few big lifts, heavy weights, 5 sets of 5. Built for strength.", "week": ["s5a", "R", "s5b", "R", "s5a", "R", "R"]}, {"id": "glutes4", "name": "Glutes & Legs Focus", "days": 4, "goals": ["muscle", "fat"], "eq": "gym", "desc": "Extra work for glutes and legs, plus one upper body day.", "week": ["gl_a", "gl_up", "R", "gl_b", "gl_c", "R", "R"]}, {"id": "db3", "name": "Dumbbells Only", "days": 3, "goals": ["muscle", "fat", "strength"], "eq": "db", "desc": "Only dumbbells needed. Good for home or a small gym.", "week": ["db_a", "R", "db_b", "R", "db_c", "A", "R"]}];

    // 🛡️ DATA VALIDATION (used for saved data and imported backup files)
    const DAY_NAMES = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
    const isObj = v => v !== null && typeof v === 'object' && !Array.isArray(v);
    const toStr = (v, fb = '') => (typeof v === 'string' || typeof v === 'number') ? String(v) : fb;

    // Returns a clean plan { weeks: [...] }, or null if the data can't be used.
    // Accepts the old format too (a plain 7-day array).
    const sanitizePlan = raw => {
        let weeks = null;
        if (Array.isArray(raw)) weeks = [{ id: 'w_restored', name: 'Restored Routine', schedule: raw }];
        else if (isObj(raw) && Array.isArray(raw.weeks)) weeks = raw.weeks;
        if (!weeks) return null;
        const cleanWeeks = [];
        weeks.forEach((w, wi) => {
            if (!isObj(w) || !Array.isArray(w.schedule) || w.schedule.length !== 7) return;
            const schedule = w.schedule.map((d, i) => {
                d = isObj(d) ? d : {};
                const isRest = d.isRest === true;
                return {
                    id: i + 1,
                    day: DAY_NAMES.includes(d.day) ? d.day : DAY_NAMES[i],
                    title: toStr(d.title, 'New Day'),
                    isRest,
                    recoveryType: isRest ? (d.recoveryType === 'active' ? 'active' : 'complete') : null,
                    savedTitle: toStr(d.savedTitle),
                    exercises: Array.isArray(d.exercises) ? d.exercises.filter(isObj).map(ex => ({
                        muscle: toStr(ex.muscle, 'Muscle'), name: toStr(ex.name, 'New Exercise'), sets: toStr(ex.sets, '3'), reps: toStr(ex.reps, '10')
                    })) : []
                };
            });
            let id = toStr(w.id) || `w_${Date.now()}_${wi}`;
            while (cleanWeeks.some(x => x.id === id)) id += '_';
            cleanWeeks.push({ id, name: toStr(w.name, 'Routine'), schedule });
        });
        return cleanWeeks.length ? { weeks: cleanWeeks.slice(0, 5) } : null;
    };

    // Returns a clean { exerciseKey: [logs] } history object
    const sanitizeHistory = raw => {
        const out = {};
        if (!isObj(raw)) return out;
        Object.keys(raw).forEach(k => {
            if (!Array.isArray(raw[k])) return;
            const logs = raw[k].filter(l => isObj(l) && typeof l.d === 'string').map(l => {
                const s = Array.isArray(l.s) ? l.s.map(x => parseInt(x)).filter(x => !isNaN(x)) : toStr(l.s);
                const log = { d: l.d, w: toStr(l.w), s };
                if (l.time !== undefined) log.time = toStr(l.time);
                if (l.week !== undefined) log.week = toStr(l.week);
                if (typeof l.ts === 'number' && isFinite(l.ts)) log.ts = l.ts;
                if (typeof l.dayId === 'number' && l.dayId >= 1 && l.dayId <= 7) log.dayId = l.dayId;
                if (l.weekId !== undefined) log.weekId = toStr(l.weekId);
                if (l.u === 's') log.u = 's';
                if (Array.isArray(l.ws) && Array.isArray(l.s) && l.ws.length === l.s.length) log.ws = l.ws.map(x => toStr(x, '0'));
                if (Array.isArray(l.rpe) && Array.isArray(l.s) && l.rpe.length === l.s.length) log.rpe = l.rpe.map(x => typeof x === 'number' && x >= 1 && x <= 10 ? x : null);
                return log;
            });
            if (logs.length) out[k] = logs;
        });
        return out;
    };

    // Returns a clean { exerciseKey: value } object (used for weights)
    const sanitizeValueMap = raw => {
        const out = {};
        if (!isObj(raw)) return out;
        Object.keys(raw).forEach(k => { const v = toStr(raw[k], null); if (v !== null) out[k] = v; });
        return out;
    };

    // 💾 2. STORAGE MANAGEMENT
    // Reads JSON safely: if saved data is damaged, keep a copy of it (so nothing is lost) and use the fallback.
    const readJSON = (key, fallback) => {
        let raw = null;
        try { raw = localStorage.getItem(key); } catch (e) { return fallback; }
        if (raw === null) return fallback;
        try { return JSON.parse(raw); }
        catch (e) {
            try { if (localStorage.getItem(key + '_damaged') === null) localStorage.setItem(key + '_damaged', raw); } catch (e2) {}
            console.error(`Saved data "${key}" was damaged and has been set aside.`, e);
            return fallback;
        }
    };
    // Set later by the cloud module: called after every save so changes can be uploaded
    let cloudTouch = () => {};
    // Writes safely: shows a message instead of failing silently when storage is full.
    const writeItem = (key, value) => {
        try { localStorage.setItem(key, value); cloudTouch(key); return true; }
        catch (e) {
            console.error(`Could not save "${key}"`, e);
            if (window.appActions) window.appActions.showToast(t("Storage full: data not saved. Backup & delete old records."), "error");
            return false;
        }
    };

    const StorageManager = {
        KEY: 'workoutWeights_rakan_final', REPS_KEY: 'workoutReps_rakan_final', HIST_KEY: 'workoutHistory_rakan_final', PLAN_KEY: 'workoutPlan_rakan_final_v3', START_KEY: 'workoutStartDay_rakan_final', BACKUP_DATE: 'workoutLastBackup_rakan_final', ACTIVE_WEEK: 'workoutActiveWeek_rakan_final', AUTO_SYNC: 'workoutAutoSync_rakan_final', LAST_DAY: 'workoutLastDay_rakan_final', ONBOARD_KEY: 'workoutOnboard_rakan_final',
        get: () => { const v = readJSON(StorageManager.KEY, {}); return isObj(v) ? v : {}; }, set: d => writeItem(StorageManager.KEY, JSON.stringify(d)),
        getReps: () => { const v = readJSON(StorageManager.REPS_KEY, {}); return isObj(v) ? v : {}; }, setReps: d => writeItem(StorageManager.REPS_KEY, JSON.stringify(d)),
        getHistory: () => { const v = readJSON(StorageManager.HIST_KEY, {}); return isObj(v) ? v : {}; }, setHistory: d => writeItem(StorageManager.HIST_KEY, JSON.stringify(d)),
        getPlan: () => readJSON(StorageManager.PLAN_KEY, null), setPlan: d => writeItem(StorageManager.PLAN_KEY, JSON.stringify(d)),
        getStartDay: () => { const v = localStorage.getItem(StorageManager.START_KEY); return DAY_NAMES.includes(v) ? v : 'SAT'; }, setStartDay: v => { localStorage.setItem(StorageManager.START_KEY, v); cloudTouch(StorageManager.START_KEY); },
        getActiveWeek: () => localStorage.getItem(StorageManager.ACTIVE_WEEK), setActiveWeek: v => { localStorage.setItem(StorageManager.ACTIVE_WEEK, v); cloudTouch(StorageManager.ACTIVE_WEEK); },
        getBackupDate: () => parseInt(localStorage.getItem(StorageManager.BACKUP_DATE)) || 0, setBackupDate: () => localStorage.setItem(StorageManager.BACKUP_DATE, Date.now()),
        RPE_KEY: 'workoutShowRpe_rakan_final',
        getShowRpe: () => localStorage.getItem(StorageManager.RPE_KEY) === 'true', setShowRpe: v => { localStorage.setItem(StorageManager.RPE_KEY, v ? 'true' : 'false'); cloudTouch(StorageManager.RPE_KEY); },
        REST_KEY: 'workoutRest_rakan_final',
        getRestSeconds: () => { const v = parseInt(localStorage.getItem(StorageManager.REST_KEY)); return [60,90,120,180].includes(v) ? v : 90; },
        setRestSeconds: v => { if ([60,90,120,180].includes(parseInt(v))) { localStorage.setItem(StorageManager.REST_KEY, String(parseInt(v))); cloudTouch(StorageManager.REST_KEY); } },
        getOnboard: () => localStorage.getItem(StorageManager.ONBOARD_KEY) === 'true', setOnboard: () => localStorage.setItem(StorageManager.ONBOARD_KEY, 'true')
    };

    const getExKey = (w, d, i, n) => (n||'').trim() === '' || (n||'').trim() === 'New Exercise' ? `temp_${w}_${d}_${i}` : `global_${(n||'').trim().toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

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
    // Exercises that can be logged without a load (0 / empty = bodyweight)
    const BODYWEIGHT = ['Bicycle Crunch','Bird Dog','Chest Dip','Chin-up','Clamshell','Close-Grip Push-up','Copenhagen Plank','Crunch','Dead Bug','Decline Crunch','Decline Push-up','Deficit Push-up','Diamond Push-up','Dragon Flag','Fire Hydrant','Glute Bridge','Glute-Ham Raise','Hanging Knee Raise','Hanging Leg Raise','Hollow Body Hold','Incline Push-up','Inverted Row','Leg Raise','Nordic Hamstring Curl','Pistol Squat','Plank','Pull-up','Push-up','Reverse Crunch','Russian Twist','Sissy Squat','Sit-up','Superman','Toe Touch','Tricep Dip','V-up','Wall Sit','Back Extension','Frog Pump','Standing Leg Raise','Neck Curl','Neck Extension','Neck Lateral Flexion',
        'Archer Push-up','Bench Dip','Box Jump','Captain\'s Chair Leg Raise','Cossack Squat','Dead Hang','Decline Sit-up','Donkey Kick','Flutter Kick','Hanging Windshield Wiper','Hyperextension','L-Sit','Mountain Climber','Oblique Crunch','Reverse Nordic','Side Lunge','Side Plank','Side-Lying Leg Raise','Single Leg Glute Bridge','Sliding Leg Curl','Stability Ball Leg Curl','Stomach Vacuum','Wide-Grip Pull-up','Neutral Grip Pull-up','Assisted Chin-up'];
    const isBodyweight = name => BODYWEIGHT.includes((name || '').trim());
    const fmtW = w => (parseFloat(w) > 0 ? `${parseFloat(w)}kg` : 'BW');

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

    // 🔋 DAILY CHECK-IN (readiness). Each answer scores 0-2; total 0-6.
    const READY_KEY = 'workoutReadiness_rakan_final';
    const dateKey = (t = Date.now()) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
    const getReadinessAll = () => { const v = readJSON(READY_KEY, {}); return isObj(v) ? v : {}; };
    const getReadinessToday = () => {
        const r = getReadinessAll()[dateKey()];
        if (!isObj(r) || ![r.sleep, r.soreness, r.energy].every(x => x === 0 || x === 1 || x === 2)) return null;
        const score = r.sleep + r.soreness + r.energy;
        return { ...r, score, level: score >= 5 ? 'high' : score >= 3 ? 'normal' : 'low' };
    };

    // ⚙️ 3. APP INITIALIZATION
    const savedPlan = StorageManager.getPlan();
    let appData = sanitizePlan(savedPlan);
    if (!appData) {
        // Saved plan missing or unusable: keep a copy of the unusable one, then start from the default plan
        if (savedPlan !== null) { try { localStorage.setItem(StorageManager.PLAN_KEY + '_damaged', JSON.stringify(savedPlan)); } catch (e) {} }
        appData = { weeks: [{ id: 'w_' + Date.now(), name: t('Week 1'), schedule: JSON.parse(JSON.stringify(defaultWorkoutData)) }] };
    }
    let currentWeekId = StorageManager.getActiveWeek() || appData.weeks[0].id;
    if (!appData.weeks.find(w => w.id === currentWeekId)) { currentWeekId = appData.weeks[0].id; StorageManager.setActiveWeek(currentWeekId); }
    
window.appState = { currentView: 'today', sortableInstance: null, mappingConfig: null, awTimer: null };    let loggedWeights = StorageManager.get();    let loggedReps = StorageManager.getReps();

    const getActiveSchedule = () => (appData.weeks.find(w => w.id === currentWeekId) || appData.weeks[0]).schedule;
    const getTodayId = () => ((new Date().getDay() - DAY_NAMES.indexOf(StorageManager.getStartDay()) + 7) % 7) + 1;
    const isDayIncomplete = d => (!d.exercises || d.exercises.length === 0) && d.isRest !== true;
    
    const getWeekStart = (date = new Date()) => {
        const d = new Date(date);
        d.setHours(0,0,0,0);
        const startDayIdx = DAY_NAMES.indexOf(StorageManager.getStartDay());
        const currentDayIdx = d.getDay();
        const diff = (currentDayIdx - startDayIdx + 7) % 7;
        d.setDate(d.getDate() - diff);
        return d;
    };

    // Which day of the routine (1-7) a log belongs to. New logs remember it (dayId);
    // for older logs we work it out from the date they were logged.
    const logDayId = log => {
        if (typeof log.dayId === 'number') return log.dayId;
        const t = logTime(log);
        if (isNaN(t)) return null;
        return ((new Date(t).getDay() - DAY_NAMES.indexOf(StorageManager.getStartDay()) + 7) % 7) + 1;
    };
    // Sets logged this week for one exercise on one specific day of the active routine
    const setsThisWeekForDay = (h, dayId) => {
        const weekStart = getWeekStart().getTime();
        return (h || []).reduce((sum, log) => {
            const t = logTime(log);
            if (isNaN(t) || t < weekStart) return sum;
            if (log.weekId && log.weekId !== currentWeekId) return sum;
            if (logDayId(log) !== dayId) return sum;
            return sum + logSets(log).length;
        }, 0);
    };

    // Sets done this week vs planned sets for one day (each exercise counts up to its planned sets)
    const dayProgress = (d, history = StorageManager.getHistory()) => {
        let done = 0, planned = 0;
        (d.exercises || []).forEach((ex, i) => {
            const p = parseInt(ex.sets) || 0;
            planned += p;
            done += Math.min(p, setsThisWeekForDay(history[getExKey(currentWeekId, d.id, i, ex.name)], d.id));
        });
        return { done, planned, pct: planned ? Math.round(done / planned * 100) : 0 };
    };

    const isDayCompleted = (d, history = StorageManager.getHistory()) => {
        if (d.isRest) return true;
        if (!d.exercises || d.exercises.length === 0) return false;
        const pr = dayProgress(d, history);
        return pr.planned > 0 && pr.done >= pr.planned;
    };

    // One-time upgrade: give older logs an exact timestamp (their text date is kept as-is)
    (() => {
        const h = StorageManager.getHistory();
        let changed = false;
        Object.keys(h).forEach(k => { if (Array.isArray(h[k])) h[k].forEach(log => {
            if (log && typeof log.ts !== 'number') { const t = parseLogDate(log.d); if (!isNaN(t)) { log.ts = t; changed = true; } }
        }); });
        if (changed) StorageManager.setHistory(h);
    })();

    // The app always opens on today
    let activeDay = getTodayId();

    // Build a 7-day schedule from a program, starting on the user's first day of the week.
    // exp: 'new' = one set less on accessories, 'adv' = one set more on the first two lifts of each day
    const PROFILE_KEY = 'workoutProfile_rakan_final';
    const getProfile = () => { const v = readJSON(PROFILE_KEY, {}); return isObj(v) ? v : {}; };
    const programSchedule = (prog, exp) => {
        const start = DAY_NAMES.indexOf(StorageManager.getStartDay());
        return prog.week.map((slot, i) => {
            const base = { id: i + 1, day: DAY_NAMES[(start + i) % 7], savedTitle: '' };
            if (slot === 'R') return { ...base, title: 'Complete Rest', isRest: true, recoveryType: 'complete', exercises: [] };
            if (slot === 'A') return { ...base, title: 'Active Rest', isRest: true, recoveryType: 'active', exercises: [] };
            const [title, list] = WORKOUTS[slot];
            return { ...base, title, savedTitle: title, isRest: false, recoveryType: null, exercises: list.map(([name, muscle, sets, reps], j) => {
                let n = parseInt(sets);
                if (exp === 'new' && j >= 2) n = Math.max(2, n - 1);
                if (exp === 'adv' && j < 2) n = Math.min(5, n + 1);
                return { muscle, name, sets: String(n), reps };
            }) };
        });
    };
    // Which program fits the answers best
    const recommendProgram = a => {
        if (a.eq === 'db') return 'db3';
        const d = parseInt(a.days) || 4;
        if (a.goal === 'strength') return d <= 3 ? 's5x5' : 'phul';
        if (a.goal === 'fat') return d <= 3 ? 'fb3' : d === 4 ? 'ul4' : d === 5 ? 'hybrid5' : 'ppl6';
        if (d <= 3) return a.exp === 'new' ? 'fb3' : 'ppl3';
        return d === 4 ? 'ul4' : d === 5 ? 'hybrid5' : 'ppl6';
    };
    // Short week preview: "Sat Push · Sun Pull · ..."
    const programPreviewHTML = prog => {
        const start = DAY_NAMES.indexOf(StorageManager.getStartDay());
        return `<div class="grid grid-cols-7 gap-1 mt-3">${prog.week.map((slot, i) => {
            const rest = slot === 'R' || slot === 'A';
            return `<div class="rounded-lg py-1.5 px-0.5 text-center ${rest ? 'bg-white/5 text-slate-500' : 'bg-[#d4af37]/15 text-[#d4af37]'}"><div class="text-[9px] font-black">${esc(dayShort(DAY_NAMES[(start + i) % 7]))}</div><div class="text-[9px] font-bold leading-tight mt-0.5 line-clamp-2">${rest ? '—' : esc(t(WORKOUTS[slot][0]))}</div></div>`;
        }).join('')}</div>`;
    };

    // 🔎 EXERCISE PICKER DATA
    const CUSTOM_KEY = 'workoutCustomEx_rakan_final';
    const sanitizeCustomEx = raw => Array.isArray(raw) ? raw.filter(isObj).map(x => ({ name: toStr(x.name).trim().slice(0, 60), muscle: muscleOptions.includes(x.muscle) ? x.muscle : 'Chest' })).filter(x => x.name) : [];
    const getCustomEx = () => sanitizeCustomEx(readJSON(CUSTOM_KEY, []));
    const setCustomEx = list => writeItem(CUSTOM_KEY, JSON.stringify(list));
    // Every exercise under every muscle it belongs to (built-in + your own)
    const catalogue = () => {
        const out = [];
        Object.keys(exerciseDictionary).forEach(m => exerciseDictionary[m].forEach(name => out.push({ name, muscle: m })));
        getCustomEx().forEach(x => out.push({ ...x, custom: true }));
        return out;
    };
    const TIMED_DEFAULT = ['Plank', 'Weighted Plank', 'Hollow Body Hold', 'Wall Sit', 'Copenhagen Plank', 'Side Plank', 'L-Sit', 'Dead Hang', 'Stomach Vacuum', 'Mountain Climber'];
    const newExercise = (name, muscle) => ({ muscle, name, sets: '3', reps: TIMED_DEFAULT.includes(name) ? '30 - 45s' : '10 - 12' });
    const REPS_PRESETS = ['6 - 8', '8 - 10', '8 - 12', '10 - 12', '12 - 15', '15 - 20', '30 - 45s'];

    // Bottom sheets slide up from the bottom; the page behind them is frozen so nothing jumps
    const openSheet = (overlayId, boxId) => {
        const o = document.getElementById(overlayId), b = document.getElementById(boxId);
        const sc = document.querySelector('.scrollable-content'); if (sc) sc.style.overflow = 'hidden';
        o.classList.remove('hidden'); o.classList.add('flex');
        requestAnimationFrame(() => { o.classList.remove('opacity-0'); b.classList.remove('translate-y-full'); });
    };
    const closeSheet = (overlayId, boxId) => {
        const o = document.getElementById(overlayId), b = document.getElementById(boxId);
        if (document.activeElement) document.activeElement.blur();
        o.classList.add('opacity-0'); b.classList.add('translate-y-full');
        setTimeout(() => {
            o.classList.add('hidden'); o.classList.remove('flex');
            if (document.querySelectorAll('.sheet-overlay.flex').length === 0) { const sc = document.querySelector('.scrollable-content'); if (sc) sc.style.overflow = ''; }
        }, 300);
    };

    // 📱 PHONE BACK BUTTON: closes the top window instead of leaving the app.
    // One extra history entry ("guard") is added while windows are open. The app never calls history.back()
    // itself, so it can never accidentally leave the page.
    const backStack = []; let backGuard = false;
    const pushBack = (id, fn) => {
        backStack.push({ id, fn });
        if (!backGuard) { try { history.pushState({ apexGuard: 1 }, ''); backGuard = true; } catch (e) {} }
    };
    const popBack = id => { const i = backStack.map(x => x.id).lastIndexOf(id); if (i >= 0) backStack.splice(i, 1); };
    window.addEventListener('popstate', () => {
        backGuard = false;
        const top = backStack.pop();
        if (top) { top.fn(); if (backStack.length) { try { history.pushState({ apexGuard: 1 }, ''); backGuard = true; } catch (e) {} } }
    });

    // 👇 SWIPE DOWN to close a bottom sheet (from its top, or when its list is scrolled to the top)
    const enableSwipeDown = (box, onClose) => {
        if (!box) return;
        let y0 = null, dy = 0, t0 = 0, scroller = null;
        box.addEventListener('touchstart', e => {
            if (e.target.closest('input, select, textarea')) { y0 = null; return; }
            scroller = e.target.closest('.sheet-scroll, #picker-list, #history-modal-content');
            if (scroller && scroller.scrollTop > 0) { y0 = null; return; }
            y0 = e.touches[0].clientY; dy = 0; t0 = Date.now();
        }, { passive: true });
        box.addEventListener('touchmove', e => {
            if (y0 === null) return;
            dy = e.touches[0].clientY - y0;
            if (dy <= 0 || (scroller && scroller.scrollTop > 0)) { box.style.transition = ''; box.style.transform = ''; if (dy < -10) y0 = null; return; }
            box.style.transition = 'none'; box.style.transform = `translateY(${dy}px)`;
        }, { passive: true });
        box.addEventListener('touchend', () => {
            if (y0 === null) return;
            box.style.transition = '';
            if (dy > 140 || (dy > 60 && Date.now() - t0 < 250)) {
                box.style.transform = 'translateY(100%)';
                onClose();
                setTimeout(() => { box.style.transform = ''; }, 350);
            } else box.style.transform = '';
            y0 = null; dy = 0;
        });
    };

    // 🔒 Keep the screen on during a Focus session (where supported)
    let wakeLock = null;
    const keepAwake = async on => {
        try {
            if (on && 'wakeLock' in navigator && !wakeLock) { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', () => { wakeLock = null; }); }
            else if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
        } catch (e) { wakeLock = null; }
    };
    document.addEventListener('visibilitychange', () => { const S = window.appState.sess; if (document.visibilityState === 'visible' && S && !S.quick) keepAwake(true); });

    // 🏋️ LOG / FOCUS SESSION helpers. An unsaved session is kept in storage so it survives the app being closed.
    const SESSION_KEY = 'workoutSession_rakan_final';
    const fmtClock = sec => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
    // All sets of the last session before today (for the "Previous" column)
    const lastSessionSets = hA => {
        const logs = (hA || []).filter(l => !isNaN(logTime(l)) && !isToday(logTime(l)));
        if (!logs.length) return [];
        const day = startOfDay(logTime(logs[logs.length - 1]));
        return logs.filter(l => startOfDay(logTime(l)) === day).flatMap(logSetDetails);
    };
    const sessionRows = () => [...document.querySelectorAll('#aw-sets-container .aw-row')].map(r => {
        const i = r.dataset.i, val = id => ((document.getElementById(id) || {}).value || '').trim();
        return { i, e: Number(r.dataset.e), w: val(`aw-w-${i}`), r: val(`aw-rep-${i}`), rpe: val(`aw-rpe-${i}`), done: r.dataset.done === '1' };
    });
    const sessionHasData = () => !!window.appState.sess && sessionRows().some(x => x.r !== '' || x.done);
    const saveSessionDraft = () => { const S = window.appState.sess; if (S) writeItem(SESSION_KEY, JSON.stringify({ ...S, rows: sessionRows() })); };
    const clearSessionDraft = () => { try { localStorage.removeItem(SESSION_KEY); } catch (e) {} };

    // Opens / closes a pop-up window (overlay + box) with the fade & zoom animation
    const openModal = (overlayId, boxId) => {
        const o = document.getElementById(overlayId), b = document.getElementById(boxId);
        o.classList.remove('hidden'); o.classList.add('flex');
        requestAnimationFrame(() => { o.classList.remove('opacity-0'); b.classList.remove('scale-95'); });
        if (window.lucide) window.lucide.createIcons({ root: b });
    };
    const closeModal = (overlayId, boxId, ms = 300, after) => {
        const o = document.getElementById(overlayId), b = document.getElementById(boxId);
        o.classList.add('opacity-0'); b.classList.add('scale-95');
        setTimeout(() => { o.classList.add('hidden'); o.classList.remove('flex'); if (after) after(); }, ms);
    };

    // 🎨 4. CORE UI RENDERING
    const renderSidePanel = () => {
        document.getElementById('weeks-container').innerHTML = appData.weeks.map(w => `<div class="flex items-center gap-3 bg-black/40 p-3 rounded-xl border ${w.id===currentWeekId?'border-[#d4af37]/50 shadow-[0_0_10px_rgba(212,175,55,0.1)]':'border-white/5'} transition-all"><input type="text" value="${esc(w.name)}" onchange="window.appActions.renameWeek(${jsArg(w.id)}, this.value)" class="bg-transparent text-white text-[13px] font-bold uppercase tracking-wider w-full outline-none">${w.id===currentWeekId?`<span class="text-[#22c55e] text-[9px] font-black tracking-widest uppercase shrink-0">${t('Active')}</span>`:`<button onclick="window.appActions.switchWeek(${jsArg(w.id)})" class="text-slate-400 hover:text-white text-[10px] font-bold tracking-widest uppercase tap-feedback shrink-0 px-2 py-1 bg-white/5 rounded-lg">${t('Select')}</button>`}${appData.weeks.length>1?`<button onclick="window.appActions.deleteWeek(${jsArg(w.id)})" class="text-red-400 hover:text-red-300 tap-feedback p-1 bg-red-500/10 rounded-lg shrink-0 border border-red-500/20"><i data-lucide="trash-2" class="w-4 h-4"></i></button>`:''}</div>`).join('');
        document.getElementById('active-week-label').innerText = t((appData.weeks.find(w => w.id === currentWeekId) || appData.weeks[0]).name);
        if(window.lucide) window.lucide.createIcons();
    };

    // Week strip: the 7 days of the routine with real day names; ✓ = done, moon = rest, red dot = empty (Plan tab)
    const renderNav = () => {
        const schedule = getActiveSchedule(), history = StorageManager.getHistory(), today = getTodayId(), view = window.appState.currentView;
        document.getElementById('nav-container').innerHTML = schedule.map(d => {
            const sel = activeDay === d.id, comp = !d.isRest && isDayCompleted(d, history), empty = isDayIncomplete(d), isT = today === d.id;
            const mark = comp ? '<i data-lucide="check" class="w-4 h-4"></i>'
                : d.isRest ? '<i data-lucide="moon" class="w-3.5 h-3.5 opacity-60"></i>'
                : `<span class="w-1.5 h-1.5 rounded-full ${empty && view === 'plan' ? 'bg-red-500' : sel ? 'bg-black/40' : 'bg-white/30'}"></span>`;
            const cls = sel ? 'bg-[#d4af37] text-black border-[#d4af37]' : comp ? 'bg-[#22c55e]/10 border-[#22c55e]/40 text-[#22c55e]' : isT ? 'bg-white/5 border-[#d4af37]/70 text-white' : 'bg-white/5 border-white/5 text-slate-300';
            return `<button onclick="window.appActions.setActiveDay(${d.id})" class="rounded-2xl py-2.5 flex flex-col items-center gap-1 tap-feedback border transition-colors ${cls}"><span class="text-[11px] font-black leading-none truncate max-w-full px-0.5">${esc(dayShort(d.day))}</span><span class="h-4 flex items-center">${mark}</span></button>`;
        }).join('');
        renderSidePanel();
    };

    // 📈 PROGRESS HELPERS
    // Name of an exercise from its storage key (routines, built-in list, your own exercises)
    const exerciseNameMap = () => {
        const m = {};
        catalogue().forEach(x => { m[getExKey('', '', '', x.name)] = { name: x.name, muscle: x.muscle }; });
        appData.weeks.forEach(w => w.schedule.forEach(d => (d.exercises || []).forEach(e => { m[getExKey('', '', '', e.name)] = { name: e.name, muscle: e.muscle }; })));
        return m;
    };
    const nameOfKey = (k, map) => (map[k] && map[k].name) || k.replace(/^global_/, '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    // Every training day: sets, kg lifted and exercises (from all history)
    const workoutDays = history => {
        const map = {};
        Object.keys(history).forEach(k => (history[k] || []).forEach(l => {
            const t0 = logTime(l); if (isNaN(t0)) return;
            const d = startOfDay(t0), m = map[d] = map[d] || { sets: 0, volume: 0, ex: new Set() };
            const det = logSetDetails(l);
            m.sets += det.length; m.ex.add(k);
            if (l.u !== 's') m.volume += det.reduce((a, x) => a + x.w * x.r, 0);
        }));
        return map;
    };
    // One point per training day for an exercise: heaviest weight (or best reps/seconds for bodyweight)
    const exerciseSessions = hA => {
        const byDay = {};
        (hA || []).forEach(l => { const t0 = logTime(l); if (isNaN(t0)) return; const d = startOfDay(t0); (byDay[d] = byDay[d] || []).push(...logSetDetails(l)); });
        return Object.keys(byDay).map(Number).sort((a, b) => a - b).map(d => {
            const sets = byDay[d], topW = Math.max(0, ...sets.map(x => x.w));
            return { t: d, w: topW, r: Math.max(0, ...sets.map(x => x.r)), sets };
        }).filter(x => x.sets.length);
    };
    // Personal records: a session heavier than every session before it
    const recordsOf = hA => {
        let best = 0; const out = [];
        exerciseSessions(hA).forEach(s => { if (best > 0 && s.w > best) out.push({ t: s.t, w: s.w, plus: Math.round((s.w - best) * 10) / 10 }); best = Math.max(best, s.w); });
        return out;
    };
    const niceStep = raw => { const p = Math.pow(10, Math.floor(Math.log10(raw || 1))); const n = (raw || 1) / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p; };
    // Single-series line chart (inline SVG): 2px gold line, soft area, dots with a surface ring,
    // hairline grid, value at the end; tap/hover shows a crosshair and the value.
    const lineChartHTML = (pts, unit) => {
        const W = 320, H = 150, pl = 34, pr = 40, pt = 12, pb = 22;
        const vs = pts.map(p => p.v);
        let lo = Math.min(...vs), hi = Math.max(...vs);
        const step = niceStep(((hi - lo) || Math.max(1, hi * 0.1)) / 3);
        lo = Math.floor(lo / step) * step; hi = Math.ceil(hi / step) * step; if (hi === lo) hi = lo + step;
        const x = i => pl + (pts.length === 1 ? (W - pl - pr) / 2 : i * (W - pl - pr) / (pts.length - 1));
        const y = v => pt + (H - pt - pb) * (1 - (v - lo) / (hi - lo));
        let grid = '';
        for (let v = lo; v <= hi + 1e-9; v += step) grid += `<line x1="${pl}" x2="${W - pr}" y1="${y(v)}" y2="${y(v)}" stroke="#262626" stroke-width="1"/><text x="${pl - 6}" y="${y(v) + 3}" text-anchor="end" font-size="9" fill="#64748b" font-weight="700">${Math.round(v * 10) / 10}</text>`;
        const line = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ');
        const area = `${line} L${x(pts.length - 1).toFixed(1)},${H - pb} L${x(0).toFixed(1)},${H - pb} Z`;
        const dots = pts.map((p, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="4" fill="#d4af37" stroke="#111111" stroke-width="2"/>`).join('');
        const last = pts[pts.length - 1];
        const data = esc(JSON.stringify(pts.map((p, i) => ({ x: x(i), y: y(p.v), v: p.v, d: fmtDayMonth(new Date(p.t)) }))));
        return `<div class="chart-wrap relative select-none" data-pts="${data}" data-unit="${esc(unit)}" dir="ltr">
            <svg viewBox="0 0 ${W} ${H}" class="w-full h-auto block touch-none" role="img" aria-label="${esc(t('Progress chart'))}">
                ${grid}
                <path d="${area}" fill="#d4af37" fill-opacity="0.1"/>
                <path d="${line}" fill="none" stroke="#d4af37" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
                ${dots}
                <text x="${x(pts.length - 1) + 7}" y="${y(last.v) + 3}" font-size="10" fill="#e2e8f0" font-weight="900">${last.v}${esc(unit)}</text>
                <text x="${pl}" y="${H - 6}" font-size="9" fill="#64748b" font-weight="700">${esc(fmtDayMonth(new Date(pts[0].t)))}</text>
                <text x="${W - pr}" y="${H - 6}" text-anchor="end" font-size="9" fill="#64748b" font-weight="700">${esc(fmtDayMonth(new Date(last.t)))}</text>
                <line class="chart-cross" x1="0" x2="0" y1="${pt}" y2="${H - pb}" stroke="#94a3b8" stroke-width="1" visibility="hidden"/>
                <circle class="chart-hot" r="6" fill="#d4af37" stroke="#111111" stroke-width="2" visibility="hidden"/>
            </svg>
            <div class="chart-tip hidden absolute -top-2 px-2 py-1 rounded-lg bg-black border border-white/15 text-[11px] font-black text-white whitespace-nowrap pointer-events-none"></div>
        </div>`;
    };
    // Crosshair + tooltip for the charts inside an element
    const bindCharts = root => root.querySelectorAll('.chart-wrap').forEach(wrap => {
        const pts = JSON.parse(wrap.dataset.pts), unit = wrap.dataset.unit, svg = wrap.querySelector('svg');
        const cross = svg.querySelector('.chart-cross'), hot = svg.querySelector('.chart-hot'), tip = wrap.querySelector('.chart-tip');
        const show = e => {
            const r = svg.getBoundingClientRect(), vx = (e.clientX - r.left) / r.width * 320;
            const p = pts.reduce((a, b) => Math.abs(b.x - vx) < Math.abs(a.x - vx) ? b : a);
            cross.setAttribute('x1', p.x); cross.setAttribute('x2', p.x); cross.setAttribute('visibility', 'visible');
            hot.setAttribute('cx', p.x); hot.setAttribute('cy', p.y); hot.setAttribute('visibility', 'visible');
            tip.textContent = `${p.d} · ${p.v}${unit}`; tip.classList.remove('hidden');
            tip.style.left = `${Math.min(Math.max(p.x / 320 * r.width - tip.offsetWidth / 2, 0), r.width - tip.offsetWidth)}px`;
        };
        svg.addEventListener('pointermove', show); svg.addEventListener('pointerdown', show);
        svg.addEventListener('pointerleave', () => { cross.setAttribute('visibility', 'hidden'); hot.setAttribute('visibility', 'hidden'); tip.classList.add('hidden'); });
    });
    // Stats + chart shown at the top of an exercise's history
    const exerciseStatsHTML = hA => {
        const ses = exerciseSessions(hA); if (!ses.length) return '';
        const weighted = ses.some(s => s.w > 0), timed = (hA || []).some(l => l.u === 's');
        const all = ses.flatMap(s => s.sets);
        const best = weighted ? Math.max(...all.map(x => x.w)) : Math.max(...all.map(x => x.r));
        const e1rm = weighted && !timed ? Math.max(0, ...all.filter(x => x.w > 0 && x.r <= 12).map(x => x.w * (1 + x.r / 30))) : 0;
        const tile = (v, l) => `<div class="bg-white/5 rounded-xl py-2.5 text-center"><div class="text-[17px] font-black text-white" dir="ltr">${v}</div><div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">${l}</div></div>`;
        const unit = weighted ? 'kg' : timed ? 's' : '';
        const pts = ses.slice(-12).map(s => ({ t: s.t, v: weighted ? s.w : s.r }));
        return `<div class="grid grid-cols-3 gap-2 mb-3">${tile(`${best}${unit}`, weighted ? t('Best weight') : timed ? t('Best time') : t('Best reps'))}${tile(e1rm ? `${Math.round(e1rm)}kg` : '—', t('Est. 1-rep max'))}${tile(ses.length, t('Sessions'))}</div>`
            + (pts.length >= 2 ? `<div class="bg-white/5 rounded-2xl p-3 mb-4"><div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">${weighted ? t('Heaviest weight per session') : timed ? t('Longest set per session') : t('Most reps per session')}</div>${lineChartHTML(pts, unit)}</div>` : '');
    };

    // Overview: this week, month, streak, kg; calendar of the last 5 weeks; recent records
    const progressOverviewHTML = history => {
        const days = workoutDays(history), dayKeys = Object.keys(days).map(Number);
        if (!dayKeys.length) return `<div class="glass-card p-8 text-center"><div class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4"><i data-lucide="calendar-check" class="w-6 h-6 text-[#d4af37]"></i></div><div class="text-[15px] font-black text-white mb-2">${t('No workouts yet')}</div><p class="text-[12px] text-slate-400 font-bold">${t('Finish your first workout to see your progress here.')}</p></div>`;
        const wk = getWeekStart().getTime(), now = new Date(), monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        const inWeek = dayKeys.filter(d => d >= wk), inMonth = dayKeys.filter(d => d >= monthStart);
        const volWeek = inWeek.reduce((a, d) => a + days[d].volume, 0);
        // streak: weeks in a row with at least one workout (this week counts once you've trained)
        let streak = 0, ws = wk; if (!inWeek.length) ws -= 7 * 86400000;
        while (dayKeys.some(d => d >= ws && d < ws + 7 * 86400000)) { streak++; ws -= 7 * 86400000; }
        const tile = (v, l, icon) => `<div class="glass-card p-4"><div class="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1"><i data-lucide="${icon}" class="w-3.5 h-3.5 text-[#d4af37]"></i>${l}</div><div class="text-[26px] font-black text-white leading-none" dir="ltr">${v}</div></div>`;
        let html = `<div class="grid grid-cols-2 gap-2.5 mb-4">${tile(inWeek.length, t('Workouts this week'), 'calendar-check')}${tile(inMonth.length, t('This month'), 'calendar')}${tile(streak, t('Week streak'), 'flame')}${tile(`${volWeek >= 10000 ? (volWeek / 1000).toFixed(1) + 'K' : Math.round(volWeek).toLocaleString('en-US')}`, t('kg lifted this week'), 'weight')}</div>`;
        // calendar: 5 weeks, gold = trained (darker = more sets)
        const start = wk - 4 * 7 * 86400000, today = startOfDay(Date.now());
        const startIdx = DAY_NAMES.indexOf(StorageManager.getStartDay());
        let cells = '';
        for (let i = 0; i < 35; i++) {
            const d = startOfDay(start + i * 86400000 + 3600000), info = days[d], future = d > today;
            const lvl = info ? (info.sets >= 20 ? 1 : info.sets >= 10 ? 0.7 : 0.4) : 0;
            const label = `${fmtDate(d, false)} · ${info ? t('{n} sets', { n: info.sets }) : t('Rest')}`;
            cells += `<button onclick="document.getElementById('cal-info').textContent=${esc(JSON.stringify(label))}" class="aspect-square rounded-md tap-feedback ${d === today ? 'ring-2 ring-white/70' : ''} ${future ? 'opacity-30' : ''}" style="background:${info ? `rgba(212,175,55,${lvl})` : 'rgba(255,255,255,0.06)'}" aria-label="${esc(label)}" title="${esc(label)}"></button>`;
        }
        html += `<div class="glass-card p-4 mb-4"><div class="text-[11px] font-black text-white uppercase tracking-widest mb-3">${t('Last 5 weeks')}</div>
            <div class="grid grid-cols-7 gap-1.5 mb-1.5">${DAY_NAMES.map((_, i) => `<div class="text-center text-[9px] font-black text-slate-500 truncate">${esc(dayShort(DAY_NAMES[(startIdx + i) % 7]))}</div>`).join('')}</div>
            <div class="grid grid-cols-7 gap-1.5" dir="ltr">${cells}</div>
            <div id="cal-info" class="text-[11px] font-bold text-slate-400 mt-3 min-h-[16px]">${t('Tap a day for details.')}</div></div>`;
        // recent records
        const map = exerciseNameMap(), recs = [];
        Object.keys(history).forEach(k => recordsOf(history[k]).forEach(r => recs.push({ ...r, k })));
        recs.sort((a, b) => b.t - a.t);
        const recent = recs.filter(r => r.t >= today - 30 * 86400000).slice(0, 6);
        html += `<div class="glass-card p-4 mb-4"><div class="text-[11px] font-black text-white uppercase tracking-widest mb-2">🏆 ${t('Records (last 30 days)')}</div>${recent.length ? recent.map(r => `<button onclick="window.appActions.openHistoryModal(${jsArg(r.k)},${jsArg(nameOfKey(r.k, map))})" class="w-full flex items-center justify-between gap-2 py-2.5 border-b border-white/5 last:border-0 text-start tap-feedback"><span class="min-w-0"><span class="ex-name block text-[14px] font-black text-white truncate">${esc(nameOfKey(r.k, map))}</span><span class="block text-[10px] font-bold text-slate-500">${esc(fmtDate(r.t, false))}</span></span><span class="text-[14px] font-black text-[#22c55e] shrink-0" dir="ltr">${r.w}kg <span class="text-[10px]">(+${r.plus})</span></span></button>`).join('') : `<p class="text-[12px] font-bold text-slate-500">${t('No new records yet. Add weight when the app says so and they will come.')}</p>`}</div>`;
        return html;
    };
    // Every exercise you have logged, most recent first
    const progressExercisesHTML = history => {
        const map = exerciseNameMap();
        const rows = Object.keys(history).map(k => {
            const ses = exerciseSessions(history[k]); if (!ses.length) return null;
            const last = ses[ses.length - 1], weighted = ses.some(s => s.w > 0);
            return { k, name: nameOfKey(k, map), muscle: (map[k] || {}).muscle || '', last: last.t, n: ses.length, best: weighted ? `${Math.max(...ses.map(s => s.w))}kg` : `${Math.max(...ses.map(s => s.r))}` };
        }).filter(Boolean).sort((a, b) => b.last - a.last);
        if (!rows.length) return progressOverviewHTML(history);
        return rows.map(r => `<button onclick="window.appActions.openHistoryModal(${jsArg(r.k)},${jsArg(r.name)})" class="w-full glass-card p-4 mb-2.5 flex items-center gap-3 text-start tap-feedback">
            <span class="flex-1 min-w-0"><span class="ex-name block text-[15px] font-black text-white leading-tight">${esc(r.name)}</span><span class="block text-[11px] font-bold text-slate-400 mt-0.5">${esc(tm(r.muscle))}${r.muscle ? ' · ' : ''}${t('{n} sessions', { n: r.n })} · ${esc(fmtDate(r.last, false))}</span></span>
            <span class="text-end shrink-0"><span class="block text-[9px] font-black text-slate-500 uppercase tracking-wider">${t('Best')}</span><span class="block text-[15px] font-black text-white" dir="ltr">${esc(r.best)}</span></span>
            <i data-lucide="chevron-right" class="w-4 h-4 text-slate-600 shrink-0"></i></button>`).join('');
    };

    const renderAnalytics = () => {
        const history = StorageManager.getHistory();
        const c = document.getElementById('workout-container');
        
        const activeTab = window.appState.aTab || 'overview';
        
        const pG = {
            'CHEST': { l: 'Chest', s: 0, c: 0, ex: {} }, 'BACK': { l: 'Back', s: 0, c: 0, ex: {} },
            'FDELTS': { l: 'Front Delts', s: 0, c: 0, ex: {} }, 'SDELTS': { l: 'Side Delts', s: 0, c: 0, ex: {} }, 'RDELTS': { l: 'Rear Delts', s: 0, c: 0, ex: {} },
            'BICEPS': { l: 'Biceps', s: 0, c: 0, ex: {} }, 'TRICEPS': { l: 'Triceps', s: 0, c: 0, ex: {} },
            'QUADS': { l: 'Quads', s: 0, c: 0, ex: {} }, 'HAMS': { l: 'Hamstrings', s: 0, c: 0, ex: {} }, 'CALVES': { l: 'Calves', s: 0, c: 0, ex: {} },
            'GLUTES': { l: 'Glutes', s: 0, c: 0, ex: {} },
            'ABS': { l: 'Abs & Core', s: 0, c: 0, ex: {} },
            'FOREARMS': { l: 'Forearms', s: 0, c: 0, ex: {} }
        };

        let actionItems = {}; 
        let processedExKeys = new Set();
        const now = new Date();
        now.setHours(0,0,0,0);
        
        getActiveSchedule().forEach(d => { if(!d.isRest && d.exercises) d.exercises.forEach((ex,i) => {
            const k = getExKey(currentWeekId, d.id, i, ex.name);
            const h = history[k] || [];
            
            // Same rule as the Workout tab (getProgression), based on your latest session
            if (!actionItems[ex.name]) {
                const prog = getProgression(getLastSession(h), ex.reps);
                if (prog) actionItems[ex.name] = { muscle: ex.muscle, unit: unitOf(ex.reps), ...prog };
            }

            const rawSets = parseInt(ex.sets);
            const s = isNaN(rawSets) ? 0 : rawSets; 
            
            let cSets = 0;
            if (!processedExKeys.has(k)) {
                processedExKeys.add(k);
                h.forEach(log => {
                    const t = logTime(log);
                    if (isNaN(t)) return;
                    const diff = Math.round((now - startOfDay(t)) / 86400000);
                    const nSets = logSets(log).length;
                    
                    if(diff >= 0 && diff <= 6) cSets += nSets; // last 7 days
                });
            }

            const safeMuscle = ex.muscle || 'Unknown';
            const rm = safeMuscle.trim().toUpperCase(), n = ex.name||'Unknown';
            let p = null;
            if(rm.includes('CHEST')||rm==='PECS') p = 'CHEST';
            else if(rm.includes('BACK')||rm==='LATS'||rm==='TRAPS') p = 'BACK';
            else if(rm.includes('SIDE DELT')) p = 'SDELTS';
            else if(rm.includes('FRONT DELT')||rm.includes('SHOULDER')) p = 'FDELTS';
            else if(rm.includes('REAR DELT')) p = 'RDELTS';
            else if(rm.includes('BICEP')) p = 'BICEPS';
            else if(rm.includes('TRICEP')) p = 'TRICEPS';
            else if(rm.includes('QUAD')) p = 'QUADS';
            else if(rm.includes('HAMSTRING')||rm.includes('LEG CURL')||rm.includes('POST. CHAIN')) p = 'HAMS';
            else if(rm.includes('CALF')||rm.includes('CALVES')) p = 'CALVES';
            else if(rm.includes('GLUTE')||rm==='ABDUCTORS'||rm==='ADDUCTORS') p = 'GLUTES';
            else if(rm==='ABS'||rm==='CORE'||rm==='OBLIQUES') p = 'ABS';
            else if(rm.includes('FOREARM')) p = 'FOREARMS';
            
            if(p && pG[p]) { pG[p].s += s; pG[p].c += cSets; pG[p].ex[n] = (pG[p].ex[n]||0) + s; }
        });});

        let actionLevelUp = [], actionBuild = [], actionDeload = [];
        Object.keys(actionItems).forEach(name => {
            const item = { name, ...actionItems[name] };
            if (item.type === 'up') actionLevelUp.push(item);
            else if (item.type === 'build') actionBuild.push(item);
            else if (item.type === 'down') actionDeload.push(item);
        });

        const createAccordionBar = (key, g) => {
            const comp = isNaN(g.c) ? 0 : (g.c % 1 !== 0 ? g.c.toFixed(1) : g.c);
            const plan = isNaN(g.s) ? 0 : (g.s % 1 !== 0 ? g.s.toFixed(1) : g.s);
            const pct = plan > 0 ? Math.min((comp / plan) * 100, 100) : (comp > 0 ? 100 : 0);

            const isDone = plan > 0 && comp >= plan;
            const clr = isDone ? 'bg-[#22c55e]' : (comp > 0 ? 'bg-[#d4af37]' : 'bg-slate-500');

            const exTags = Object.keys(g.ex).length > 0 ? `<div class="flex flex-wrap gap-2 mt-4">` + Object.keys(g.ex).map(eName => `<span class="bg-black/40 rounded-lg px-2 py-1.5 text-[10px] font-bold text-slate-300 flex items-center gap-1.5">${esc(eName)} <span class="text-white" dir="ltr">${g.ex[eName]}×</span></span>`).join('') + `</div>` : `<div class="text-[10px] text-slate-500 italic mt-3">${t('No exercises scheduled.')}</div>`;

            return `<div class="mb-2 bg-white/5 rounded-2xl overflow-hidden transition-all duration-300 border border-white/5">
                <button onclick="document.getElementById('det-${key}').classList.toggle('hidden'); document.getElementById('arr-${key}').classList.toggle('rotate-180')" class="w-full text-left p-4 tap-feedback outline-none flex justify-between items-center group">
                    <div class="flex items-center gap-3 w-full">
                        <div class="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center border border-white/5 shrink-0">
                            <i data-lucide="activity" class="w-4 h-4 ${isDone ? 'text-[#22c55e]' : (comp > 0 ? 'text-[#d4af37]' : 'text-slate-500')}"></i>
                        </div>
                        <span class="text-[14px] font-black text-white tracking-wide">${esc(tm(g.l))}</span>
                    </div>
                    <div class="flex items-center gap-3 shrink-0">
                        <div class="text-right">
                            <div class="text-[12px] font-black ${comp > 0 ? 'text-white' : 'text-slate-500'} leading-none">${comp} <span class="text-[8px] text-slate-500">${t('LOGGED')}</span></div>
                            <div class="text-[9px] font-bold text-slate-500 mt-1 leading-none">${t('OF {n} SETS', { n: plan })}</div>
                        </div>
                        <i id="arr-${key}" data-lucide="chevron-down" class="w-4 h-4 text-slate-500 transition-transform duration-300 group-hover:text-white"></i>
                    </div>
                </button>
                <div id="det-${key}" class="hidden px-4 pb-4">
                    <div class="flex justify-between items-end mb-2">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">${t('Completion')}</span>
                        <span class="text-[10px] font-black text-white">${Math.round(pct)}%</span>
                    </div>
                    <div class="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
                        <div class="${clr} h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.5)]" style="width: ${pct}%;"></div>
                    </div>
                    ${exTags}
                </div>
            </div>`;
        };

        const createActionItem = (item, type) => {
            let badge = '', actionTxt = '';
            const u = item.unit === 's' ? t('SEC') : t('REPS'), us = item.unit;
            const wBadge = w => w > 0 ? `<span class="block text-[14px] leading-none mb-0.5">${w}</span><span class="text-[7px]">${t('KG')}</span>` : `<span class="block text-[14px] leading-none mb-0.5">${t('BW')}</span><span class="text-[7px]">&nbsp;</span>`;
            if (type === 'up') {
                badge = `<div class="bg-[#22c55e]/10 text-[#22c55e] py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-[#22c55e]/20 text-center shadow-sm w-[55px]">${wBadge(item.tW)}</div>`;
                actionTxt = `<span class="text-[#22c55e] shrink-0 whitespace-nowrap"><i data-lucide="arrow-up" class="w-3 h-3 inline -mt-0.5"></i> ${t('Target:')} <span dir="ltr">${fmtW(item.tW)} × ${item.tR}${us}</span></span>`;
            } else if (type === 'build') {
                badge = `<div class="bg-[#3b82f6]/10 text-[#3b82f6] py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-[#3b82f6]/20 text-center shadow-sm w-[55px]"><span class="block text-[14px] leading-none mb-0.5">${item.tR}</span><span class="text-[7px]">${u}</span></div>`;
                actionTxt = `<span class="text-[#3b82f6] shrink-0 whitespace-nowrap"><i data-lucide="refresh-cw" class="w-3 h-3 inline -mt-0.5"></i> ${t('Target:')} <span dir="ltr">${fmtW(item.tW)} × ${item.tR}${us}</span></span>`;
            } else if (type === 'down') {
                badge = `<div class="bg-red-500/10 text-red-400 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-500/20 text-center shadow-sm w-[55px]">${wBadge(item.tW)}</div>`;
                actionTxt = `<span class="text-red-400 shrink-0 whitespace-nowrap"><i data-lucide="arrow-down" class="w-3 h-3 inline -mt-0.5"></i> ${t('Target:')} <span dir="ltr">${fmtW(item.tW)} × ${item.tR}${us}</span></span>`;
            }

            return `
            <div class="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl mb-2 last:mb-0 gap-2">
                <div class="flex-1 min-w-0">
                    <div class="ex-name text-[14px] font-black text-white leading-tight mb-1">${esc(item.name)}</div>
                    <div class="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[9px] font-bold uppercase tracking-widest">
                        <span class="text-slate-500">${esc(tm(item.muscle))}</span>
                        <span class="w-1 h-1 rounded-full bg-slate-700 shrink-0"></span>
                        ${actionTxt}
                    </div>
                </div>
                <div class="shrink-0 flex items-center gap-3">
                    <div class="text-right w-[60px]">
                        <div class="text-[12px] font-black text-slate-300 truncate">${item.w > 0 ? `${item.w}<span class="text-[8px] text-slate-500">${t('KG')}</span>` : t('BW')}</div>
                        <div class="text-[10px] font-bold text-slate-400 mt-0.5 truncate" title="${esc(item.sets.join(' / '))}">× ${esc(item.sets.join('/'))}${us}</div>
                    </div>
                    ${badge}
                </div>
            </div>`;
        };

        const renderActionSection = (arr, title, type, icon, colorHex) => {
            if (arr.length === 0) return '';
            return `
            <div class="glass-card p-4 mb-4 relative overflow-hidden" style="-webkit-mask-image: -webkit-radial-gradient(white, black);">
                <div class="absolute -right-4 -top-4 w-16 h-16 bg-[${colorHex}]/10 rounded-full blur-xl pointer-events-none"></div>
                <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/5 relative z-10">
                    <div class="w-7 h-7 rounded-lg bg-[${colorHex}]/10 flex items-center justify-center text-[${colorHex}] shadow-sm">
                        <i data-lucide="${icon}" class="w-4 h-4"></i>
                    </div>
                    <span class="text-[13px] font-black uppercase tracking-widest text-white drop-shadow-md">${title}</span>
                </div>
                <div class="flex justify-between items-center px-1 mb-2 text-[8px] font-black text-slate-500 uppercase tracking-widest relative z-10">
                    <span class="ps-1">${t('Exercise')}</span>
                    <div class="flex gap-3">
                        <span class="w-[60px] text-end">${t('Last Log')}</span>
                        <span class="w-[55px] text-center">${t('Target')}</span>
                    </div>
                </div>
                <div class="relative z-10">${arr.map(i => createActionItem(i, type)).join('')}</div>
            </div>`;
        };

        const tabBtn = (id, label) => `<button onclick="window.appState.aTab='${id}';window.appActions.refreshUI()" class="flex-1 shrink-0 px-1 py-3 text-[11px] font-black uppercase tracking-widest border-b-2 transition-colors tap-feedback ${activeTab===id ? 'border-[#d4af37] text-[#d4af37]' : 'border-transparent text-slate-500 hover:text-white'}">${label}</button>`;
        const tabsHTML = `<div class="flex gap-2 border-b border-white/5 mb-5 px-1 overflow-x-auto scrollbar-hide pb-1 shrink-0">${tabBtn('overview', t('Overview'))}${tabBtn('exercises', t('Exercises'))}${tabBtn('action', t('Targets'))}${tabBtn('hyper', t('Volume'))}</div>`;
        let contentHTML = '';

        if (activeTab === 'overview') contentHTML = progressOverviewHTML(history);
        else if (activeTab === 'exercises') contentHTML = progressExercisesHTML(history);
        else if (activeTab === 'action') {
            const levelUpHTML = renderActionSection(actionLevelUp, t('Add weight'), 'up', 'arrow-up-circle', '#22c55e');
            const buildHTML = renderActionSection(actionBuild, t('Add reps'), 'build', 'refresh-cw', '#3b82f6');
            const deloadHTML = renderActionSection(actionDeload, t('Go lighter'), 'down', 'alert-triangle', '#ef4444');

            contentHTML = (levelUpHTML || buildHTML || deloadHTML) ? `${levelUpHTML}${buildHTML}${deloadHTML}` : `
                <div class="glass-card p-8 text-center border border-white/5">
                    <div class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4"><i data-lucide="activity" class="w-6 h-6 text-[#d4af37]"></i></div>
                    <div class="text-[14px] font-black text-white uppercase tracking-wider mb-2">${t('Action Plan Empty')}</div>
                    <p class="text-[11px] text-slate-400 leading-relaxed font-medium">${t('Complete a workout and log your sets. The app will analyze your performance and generate smart weight recommendations here.')}</p>
                </div>`;
        } 
        else if (activeTab === 'hyper') {
            let activeKeys = Object.keys(pG).filter(k => pG[k].s > 0 || pG[k].c > 0);
            activeKeys.sort((a,b) => pG[b].c - pG[a].c);
            
            contentHTML = `
                <div class="glass-card p-4 sm:p-6 mb-4">
                    <div class="flex items-center mb-6 pb-4 border-b border-white/5 pl-1">
                        <i data-lucide="activity" class="w-4 h-4 text-[#d4af37] mr-2"></i>
                        <span class="text-[14px] font-black uppercase tracking-[3px] text-white mt-0.5">${t('Workload Tracking')}</span>
                    </div>
                    <div class="flex flex-col">
                        ${activeKeys.map(k => createAccordionBar(k, pG[k])).join('')}
                    </div>
                </div>
                ${activeKeys.length === 0 ? `
                <div class="glass-card p-8 text-center border border-white/5 mt-4">
                    <div class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4"><i data-lucide="layers" class="w-6 h-6 text-[#d4af37]"></i></div>
                    <div class="text-[14px] font-black text-white uppercase tracking-wider mb-2">${t('No Volume Detected')}</div>
                    <p class="text-[11px] text-slate-400 leading-relaxed font-medium">${t('Build a routine with exercises to see your weekly workload goals.')}</p>
                </div>` : ''}`;
        }

        c.innerHTML = `<div class="fade-in pb-10">${tabsHTML}${contentHTML}</div>`;
        if (window.lucide) window.lucide.createIcons();
    };
    // Daily check-in card (shown on today's workout day)
    const checkInHTML = () => {
        const r = getReadinessToday();
        if (r) {
            const L = {
                high:   { c: '#22c55e', t: t('Push Day'),   i: 'zap',      d: t('Well recovered. Go for your targets.') },
                normal: { c: '#d4af37', t: t('Normal Day'), i: 'activity', d: t('Follow your targets as planned.') },
                low:    { c: '#ef4444', t: t('Easy Day'),   i: 'moon',     d: t('Low recovery: no weight increases today. Keep your weight, aim for the bottom of the range and stop 2 reps before failure.') }
            }[r.level];
            return `<div class="glass-card p-4 mb-4 flex items-center gap-3 border" style="border-color:${L.c}55">
                <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style="background:${L.c}1a;color:${L.c}"><i data-lucide="${L.i}" class="w-5 h-5"></i></div>
                <div class="flex-1 min-w-0">
                    <div class="text-[12px] font-black uppercase tracking-widest" style="color:${L.c}">${L.t} <span class="text-slate-500">• ${r.score}/6</span></div>
                    <div class="text-[10px] font-bold text-slate-400 leading-snug mt-0.5">${L.d}</div>
                </div>
                <button onclick="window.appActions.resetCheckIn()" class="text-slate-500 hover:text-white p-2 bg-white/5 rounded-lg tap-feedback shrink-0" aria-label="${esc(t('Change check-in'))}"><i data-lucide="edit-2" class="w-4 h-4"></i></button>
            </div>`;
        }
        if (window.appState.ciSkipped === dateKey()) return '';
        const draft = window.appState.ciDraft || {};
        const row = (key, label, opts) => `<div class="flex items-center justify-between gap-2 mt-3">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest w-[70px] shrink-0">${t(label)}</span>
            <div class="flex gap-1.5 flex-1">${opts.map((o, val) => `<button onclick="window.appActions.setCheckIn('${key}', ${val})" class="flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider tap-feedback border ${draft[key] === val ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'bg-black/40 text-slate-300 border-white/10'}">${t(o)}</button>`).join('')}</div>
        </div>`;
        return `<div class="glass-card p-4 mb-4 border border-[#d4af37]/30">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2"><i data-lucide="activity" class="w-4 h-4 text-[#d4af37]"></i><span class="text-[12px] font-black uppercase tracking-widest text-white">${t('Daily Check-in')}</span></div>
                <button onclick="window.appActions.skipCheckIn()" class="text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:text-white tap-feedback">${t('Skip')}</button>
            </div>
            <p class="text-[10px] font-bold text-slate-500 mt-1">${t("3 quick taps to adjust today's targets.")}</p>
            ${row('sleep', 'Sleep', ['Poor', 'OK', 'Great'])}
            ${row('soreness', 'Soreness', ['Very', 'A bit', 'Fresh'])}
            ${row('energy', 'Energy', ['Low', 'OK', 'High'])}
        </div>`;
    };

    // What to lift today: from your last session (easy day keeps the weight and aims low)
    const suggestionFor = (hA, ex, easy) => {
        const prog = getProgression(getLastSession(hA, true), ex.reps);
        if (!prog) return null;
        if (easy && prog.type !== 'down') return { type: 'easy', w: prog.w, r: prog.minR };
        return { type: prog.type, w: prog.tW, r: prog.tR };
    };
    const SUGG = {
        up:    { label: 'Add weight:', icon: 'arrow-up-circle', cls: 'text-[#22c55e] bg-[#22c55e]/10 border-[#22c55e]/20' },
        build: { label: 'Aim:',        icon: 'target',          cls: 'text-[#d4af37] bg-[#d4af37]/10 border-[#d4af37]/20' },
        down:  { label: 'Go lighter:', icon: 'arrow-down-circle', cls: 'text-red-400 bg-red-500/10 border-red-500/20' },
        easy:  { label: 'Easy day:',   icon: 'moon',            cls: 'text-slate-300 bg-white/5 border-white/10' }
    };
    const suggestionChip = (sg, timed) => {
        if (!sg) return '';
        const c = SUGG[sg.type];
        return `<span class="inline-flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-md border ${c.cls}"><i data-lucide="${c.icon}" class="w-3 h-3"></i>${t(c.label)} <span dir="ltr">${fmtW(sg.w)} × ${sg.r}${timed ? 's' : ''}</span></span>`;
    };

    // 🏠 TODAY: the selected day with one big Start button and a simple list of its exercises
    const renderToday = () => {
        const schedule = getActiveSchedule(), day = schedule.find(d => d.id === activeDay), history = StorageManager.getHistory();
        const isT = activeDay === getTodayId(), S = window.appState.sess;
        let html = `<div class="px-1 mb-2 text-[11px] font-black text-[#d4af37] uppercase tracking-widest">${esc(isT ? t('Today') : dayLong(day.day))}</div>`;
        if (day.isRest) {
            html += `<div class="glass-card p-10 text-center border-dashed border-[#d4af37]/20"><div class="text-[#d4af37] flex justify-center mb-4"><i data-lucide="${day.recoveryType==='active'?'footprints':'moon'}" class="w-12 h-12 ${day.recoveryType==='active'?'animate-walk':'animate-pulse-glow'}"></i></div><h3 class="font-black text-xl mb-1">${day.recoveryType==='active'?t('Active Rest'):t('Complete Rest')}</h3><p class="text-[12px] font-bold text-slate-400">${t('Recover well. See you next session.')}</p></div>`;
            // Point to the next training day so a rest day is never a dead end
            const nextDay = [1, 2, 3, 4, 5, 6].map(o => schedule.find(d => d.id === ((activeDay - 1 + o) % 7) + 1)).find(d => d && !d.isRest && d.exercises.length);
            if (nextDay) html += `<button onclick="window.appActions.setActiveDay(${nextDay.id})" class="w-full glass-card p-4 mt-3 flex items-center gap-3 text-start tap-feedback"><span class="w-10 h-10 rounded-full bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center shrink-0"><i data-lucide="calendar-clock" class="w-5 h-5"></i></span><span class="flex-1 min-w-0"><span class="block text-[10px] font-black text-slate-400 uppercase tracking-widest">${t('Next workout')}</span><span class="block text-[15px] font-black text-white truncate">${esc(dayLong(nextDay.day))} · ${esc(t(nextDay.title))}</span></span><i data-lucide="chevron-right" class="w-5 h-5 text-slate-500 shrink-0"></i></button>`;
        } else if (!day.exercises.length) {
            html += `<div class="glass-card p-8 text-center border-dashed border-white/10"><div class="flex justify-center mb-4"><i data-lucide="clipboard-edit" class="w-10 h-10 text-slate-500"></i></div><h3 class="font-black text-lg text-white mb-2">${t('No exercises yet')}</h3><p class="text-[12px] font-bold text-slate-400 mb-5">${t('Add exercises to this day in the Plan tab.')}</p><button onclick="window.appActions.switchTab('plan')" class="px-6 py-3 rounded-xl bg-[#d4af37] text-black text-[12px] font-black uppercase tracking-widest tap-feedback">${t('Plan this day')}</button></div>`;
        } else {
            const pr = dayProgress(day, history), finished = pr.planned > 0 && pr.done >= pr.planned;
            const mins = Math.max(10, Math.round(pr.planned * 2.5 / 5) * 5);
            const running = S && S.dayId === day.id;
            const btn = running
                ? `<button onclick="window.appActions.expandSession()" class="w-full py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-black uppercase tracking-widest tap-feedback flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.35)]"><span class="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>${t('Continue workout')}</button>`
                : finished
                ? `<div class="w-full py-3.5 rounded-2xl bg-[#22c55e]/10 border border-[#22c55e]/40 text-[#22c55e] text-[13px] font-black uppercase tracking-widest flex items-center justify-center gap-2"><i data-lucide="check-circle" class="w-5 h-5"></i>${t('Workout completed')}</div><button onclick="window.appActions.startWorkout()" class="w-full mt-2 py-2 text-[11px] font-black uppercase tracking-widest text-slate-400 tap-feedback">${t('Log more sets')}</button>`
                : `<button onclick="window.appActions.startWorkout()" class="w-full py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-black uppercase tracking-widest tap-feedback flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.35)]"><i data-lucide="play" class="w-5 h-5 fill-current"></i>${pr.done > 0 ? t('Continue workout') : t('Start workout')}</button>`;
            html += `<div class="glass-card p-5 mb-4 ${finished ? 'border border-[#22c55e]/30' : ''}">
                <h2 class="text-[26px] font-black text-white leading-tight mb-1">${esc(t(day.title))}</h2>
                <div class="text-[12px] font-bold text-slate-400 mb-4">${t('{n} exercises', { n: day.exercises.length })} · ${t('{n} sets', { n: pr.planned })} · ${t('~{n} min', { n: mins })}</div>
                ${pr.done > 0 ? `<div class="mb-4"><div class="flex justify-between text-[11px] font-black mb-1.5"><span class="text-slate-400">${t('Day progress')}</span><span class="${finished ? 'text-[#22c55e]' : 'text-white'}" dir="ltr">${pr.done} / ${pr.planned}</span></div><div class="w-full h-2 bg-black/50 rounded-full overflow-hidden"><div class="h-full rounded-full ${finished ? 'bg-[#22c55e]' : 'bg-[#d4af37]'}" style="width:${pr.pct}%"></div></div></div>` : ''}
                ${btn}
            </div>`;
            if (isT && !finished && !running) html += checkInHTML();
            const easy = isT && (getReadinessToday() || {}).level === 'low';
            html += `<div class="px-1 mb-2 mt-2 text-[11px] font-black text-slate-500 uppercase tracking-widest">${t('Exercises')}</div>`;
            html += day.exercises.map((ex, i) => {
                const k = getExKey(currentWeekId, day.id, i, ex.name), hA = history[k] || [];
                const doneSets = setsThisWeekForDay(hA, day.id), planned = parseInt(ex.sets) || 0, exDone = planned > 0 && doneSets >= planned;
                const last = getLastSession(hA, true), timed = isTimed(ex.reps);
                const lastTxt = last ? `${t('Last:')} <span dir="ltr">${fmtW(last.w)} × ${last.sets.join(' · ')}${timed ? 's' : ''}</span>` : t('First time');
                return `<button onclick="window.appActions.openHistoryModal(${jsArg(k)},${jsArg(ex.name)})" class="w-full glass-card p-4 mb-2.5 flex items-start gap-3 text-start tap-feedback ${exDone ? 'border border-[#22c55e]/30' : ''}">
                    <span class="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-[13px] font-black ${exDone ? 'bg-[#22c55e] text-black' : 'bg-white/5 text-slate-300'}">${exDone ? '<i data-lucide="check" class="w-4 h-4"></i>' : i + 1}</span>
                    <span class="flex-1 min-w-0">
                        <span class="flex items-start justify-between gap-2"><span class="ex-name text-[16px] font-black text-white leading-tight">${esc(ex.name)}</span><span class="shrink-0 text-[13px] font-black text-white" dir="ltr">${esc(ex.sets)} × ${esc(ex.reps)}</span></span>
                        <span class="block text-[11px] font-bold text-slate-400 mt-0.5">${esc(tm(ex.muscle))} · ${lastTxt}</span>
                        ${(() => { const sg = suggestionFor(hA, ex, easy); return sg ? `<span class="block mt-2">${suggestionChip(sg, timed)}</span>` : ''; })()}
                    </span>
                </button>`;
            }).join('');
        }
        document.getElementById('workout-container').innerHTML = `<div class="fade-in">${html}</div>`;
        if (window.lucide) window.lucide.createIcons();
    };

    // Editor shown inside the exercise's own card: sets, reps, swap, delete and Confirm
    const inlineEditHTML = (i, ex) => {
        const sets = parseInt(ex.sets) || 0;
        return `<div class="glass-card p-4 mb-4 border-2 border-[#d4af37]/60 relative">
            <div class="flex items-start justify-between gap-2 mb-4">
                <div class="min-w-0">
                    <div class="text-[10px] font-black text-[#d4af37] uppercase tracking-widest">${esc(tm(ex.muscle))}</div>
                    <div class="ex-name text-[17px] font-black text-white leading-tight">${esc(ex.name)}</div>
                </div>
                <div class="flex gap-2 shrink-0">
                    <button onclick="window.appActions.openPicker('replace', ${i})" class="p-2 text-slate-300 bg-white/5 rounded-lg border border-white/10 tap-feedback" aria-label="${esc(t('Swap exercise'))}"><i data-lucide="arrow-left-right" class="w-4 h-4"></i></button>
                    <button onclick="window.appActions.deleteEx(${i})" class="p-2 text-red-400 bg-red-500/10 rounded-lg border border-red-500/20 tap-feedback" aria-label="${esc(t('Delete'))}"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                </div>
            </div>
            <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">${esc(t('Sets'))}</div>
            <div class="flex items-center gap-3 mb-4" dir="ltr">
                <button onclick="window.appActions.exEditSets(-1)" class="w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-2xl font-black text-white tap-feedback">−</button>
                <div class="flex-1 text-center text-2xl font-black text-white">${sets || esc(ex.sets)}</div>
                <button onclick="window.appActions.exEditSets(1)" class="w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-2xl font-black text-white tap-feedback">+</button>
            </div>
            <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">${esc(t('Reps'))}</div>
            <div class="grid grid-cols-4 gap-2 mb-2" dir="ltr">${REPS_PRESETS.map(r => `<button onclick="window.appActions.exEditReps(${jsArg(r)})" class="py-2 rounded-lg text-[12px] font-black tap-feedback border ${ex.reps === r ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'bg-white/5 text-white border-white/10'}">${esc(r)}</button>`).join('')}</div>
            <input type="text" value="${esc(ex.reps)}" onchange="window.appActions.exEditReps(this.value)" placeholder="${esc(t('Custom, e.g. 5 or 6 - 8'))}" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white font-bold outline-none focus:border-[#d4af37] mb-4" dir="ltr">
            <button onclick="window.appActions.closeExEdit()" class="w-full py-3.5 rounded-xl bg-[#d4af37] text-black text-[12px] font-black uppercase tracking-widest tap-feedback flex items-center justify-center gap-2"><i data-lucide="check" class="w-4 h-4"></i>${esc(t('Confirm'))}</button>
        </div>`;
    };

    // Re-draw whatever tab is open
    const renderWorkout = () => {
        const v = window.appState.currentView;
        if (v === 'today') renderToday();
        else if (v === 'plan') renderPlanDay();
        else if (v === 'progress') renderAnalytics();
    };

    // 🗓️ PLAN: edit the selected day (title, type, exercises, templates)
    const renderPlanDay = () => {
        const schedule = getActiveSchedule(), day = schedule.find(d => d.id === activeDay);
        let html = `<div class="px-2 mb-4 flex justify-between items-center gap-3 h-10">${!day.isRest?`<input type="text" value="${esc(day.title)}" onfocus="if(this.value==='New Day')this.value='';" onchange="window.appActions.updateDayTitle(this.value)" class="flex-1 bg-transparent border-b-2 border-[#d4af37]/50 text-2xl font-black uppercase text-[#d4af37] outline-none h-full pb-1 leading-none">`:`<h2 class="flex-1 font-black text-2xl uppercase text-white truncate h-full flex items-end pb-1 border-b-2 border-transparent leading-none">${esc(dayLong(day.day))} · ${esc(t(day.title))}</h2>`}</div>`;
        {
            const opts = schedule.filter(d => d.id !== activeDay).map(d => `<option value="${d.id}">${t('Day {n}', { n: d.id })} • ${esc(tDay(d.day))}</option>`).join('');
            html += `
            <div class="px-2 mb-6 grid ${day.isRest ? 'grid-cols-4' : 'grid-cols-5'} gap-2">
                <button onclick="window.appActions.openPrograms()" class="glass-card flex flex-col items-center justify-center h-14 rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37] tap-feedback"><i data-lucide="layout-list" class="w-4 h-4"></i><span class="text-[8px] font-black uppercase tracking-widest mt-1">${t('Programs')}</span></button>
                <div class="relative tap-feedback">
                    <select onchange="window.appActions.updateDayType(this.value)" class="absolute inset-0 w-full h-full opacity-0 z-10"><option value="workout" ${!day.isRest ? 'selected' : ''}>${t('Workout')}</option><option value="active" ${day.isRest && day.recoveryType === 'active' ? 'selected' : ''}>${t('Active Rest')}</option><option value="complete" ${day.isRest && day.recoveryType === 'complete' ? 'selected' : ''}>${t('Complete Rest')}</option></select>
                    <div class="glass-card flex flex-col items-center justify-center h-14 rounded-xl border border-white/10 bg-white/5"><i data-lucide="settings-2" class="w-4 h-4"></i><span class="text-[8px] font-black uppercase tracking-widest mt-1">${t('Day type')}</span></div>
                </div>
                <div class="relative tap-feedback">
                    <select onchange="if(this.value){window.appActions.swapDay(parseInt(this.value));this.value='';}" class="absolute inset-0 w-full h-full opacity-0 z-10"><option value="">${t('Swap...')}</option>${opts}</select>
                    <div class="glass-card flex flex-col items-center justify-center h-14 rounded-xl border border-white/10 bg-white/5"><i data-lucide="arrow-left-right" class="w-4 h-4"></i><span class="text-[8px] font-black uppercase tracking-widest mt-1">${t('Swap')}</span></div>
                </div>
                <div class="relative tap-feedback">
                    <select onchange="if(this.value){window.appActions.copyDay(parseInt(this.value));this.value='';}" class="absolute inset-0 w-full h-full opacity-0 z-10"><option value="">${t('Copy to...')}</option>${opts}</select>
                    <div class="glass-card flex flex-col items-center justify-center h-14 rounded-xl border border-white/10 bg-white/5"><i data-lucide="copy" class="w-4 h-4"></i><span class="text-[8px] font-black uppercase tracking-widest mt-1">${t('Copy')}</span></div>
                </div>
                ${!day.isRest ? `<button onclick="window.appActions.clearDay()" class="w-full glass-card flex flex-col items-center justify-center h-14 rounded-xl text-red-400 border border-red-500/20 bg-red-500/10 z-10 relative tap-feedback"><i data-lucide="trash-2" class="w-4 h-4"></i><span class="text-[8px] font-black uppercase tracking-widest mt-1">${t('Clear')}</span></button>` : ''}
            </div>`;
            
            // GLOBAL SETS & REPS EDITOR
            if (!day.isRest && day.exercises.length > 0) {
                html += `
                <div class="px-2 mb-4">
                    <div class="glass-card p-4 flex items-center justify-between gap-2 shadow-lg border border-[#d4af37]/30 bg-[#d4af37]/5">
                        <div class="text-[10px] font-black uppercase text-[#d4af37] tracking-widest flex items-center"><i data-lucide="copy" class="w-3.5 h-3.5 me-1"></i> ${t('Edit All')}</div>
                        <div class="flex items-center gap-2">
                            <input type="text" id="global-sets" placeholder="${t('Sets')}" class="w-[72px] placeholder:text-[11px] bg-black/40 text-white text-[14px] font-bold text-center rounded-lg py-2 border border-white/10 outline-none focus:border-[#d4af37]">
                            <input type="text" id="global-reps" placeholder="${t('Reps')}" class="w-[72px] placeholder:text-[11px] bg-black/40 text-white text-[14px] font-bold text-center rounded-lg py-2 border border-white/10 outline-none focus:border-[#d4af37]">
                            <button onclick="window.appActions.applyGlobalSetsReps()" class="bg-[#d4af37] text-black px-3 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest tap-feedback shadow-sm">${t('Apply')}</button>
                        </div>
                    </div>
                </div>`;
            }
        }
        
        if (!day.isRest) {
                html += `<div id="sortable-list">${day.exercises.map((ex, i) => {
                    if (window.appState.inlineEdit === i) return inlineEditHTML(i, ex);
                    // Compact row: tap it to edit sets/reps in place, ⇄ to swap, 🗑 to delete (with undo)
                    return `
                        <div class="glass-card p-3 flex items-center gap-2 relative mb-3">
                            <div class="handle p-2 -ms-1 text-slate-500 flex items-center justify-center cursor-grab active:cursor-grabbing hover:text-white touch-none"><i data-lucide="grip-vertical" class="w-5 h-5 pointer-events-none"></i></div>
                            <button onclick="window.appActions.openExEdit(${i})" class="flex-1 min-w-0 text-start tap-feedback">
                                <div class="text-[10px] font-black text-[#d4af37] uppercase tracking-widest truncate">${esc(tm(ex.muscle))}</div>
                                <div class="ex-name text-[15px] font-black text-white leading-tight line-clamp-2">${esc(ex.name)}</div>
                            </button>
                            <button onclick="window.appActions.openExEdit(${i})" class="shrink-0 bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-[12px] font-black text-white tap-feedback" dir="ltr">${esc(ex.sets)} × ${esc(ex.reps)}</button>
                            <button onclick="window.appActions.openPicker('replace', ${i})" class="shrink-0 p-2 text-slate-400 bg-white/5 rounded-lg border border-white/10 tap-feedback" aria-label="${esc(t('Swap exercise'))}"><i data-lucide="arrow-left-right" class="w-4 h-4"></i></button>
                            <button onclick="window.appActions.deleteEx(${i})" class="shrink-0 p-2 text-red-400 bg-red-500/10 rounded-lg border border-red-500/20 tap-feedback" aria-label="${esc(t('Delete'))}"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                        </div>`;
                }).join('')}</div>`;
                html += `<div class="px-2 mt-4 mb-10 flex gap-2"><button onclick="window.appActions.openPicker('add')" class="flex-1 glass-card p-4 flex items-center justify-center gap-2 text-[#d4af37] font-bold uppercase tracking-widest text-[12px] tap-feedback border-dashed border-[#d4af37]/40 bg-[#d4af37]/5"><i data-lucide="plus" class="w-4 h-4"></i> ${t('Add Exercise')}</button></div>`;
        }
        
        

        document.getElementById('workout-container').innerHTML = html;
        if(!day.isRest && day.exercises.length > 0 && window.Sortable) {
            const listEl = document.getElementById('sortable-list');
            if (listEl) {
                if (window.appState.sortableInstance) window.appState.sortableInstance.destroy();
                window.appState.sortableInstance = new Sortable(listEl, { handle: '.handle', animation: 300, forceAutoScrollFallback: true, scrollSensitivity: 100, scrollSpeed: 20, fallbackClass: 'sortable-fallback', chosenClass: 'sortable-chosen', ghostClass: 'sortable-ghost', scroll: document.querySelector('.scrollable-content'), onEnd: (evt) => { if(evt.oldIndex===evt.newIndex)return; const m = day.exercises.splice(evt.oldIndex,1)[0]; day.exercises.splice(evt.newIndex,0,m); StorageManager.setPlan(appData); renderWorkout(); } });
            }
        }
        if (window.lucide) window.lucide.createIcons();
    };

    // ⚙️ 5. GLOBAL ACTIONS
    window.appActions = {
        showToast: (m, type='success', action=null) => {
            const c = document.getElementById('toast-container'); c.innerHTML=''; const d=document.createElement('div'), iS=type==='success', cS=iS?'text-[#22c55e]':'text-red-400', bS=iS?'bg-[#22c55e]/10 border-[#22c55e]/20':'bg-red-500/10 border-red-500/20';
            d.className=`glass-card p-4 flex items-center gap-3 border shadow-2xl transform translate-y-full opacity-0 transition-all duration-500 mt-2 ${bS} backdrop-blur-3xl pointer-events-auto`;
            d.innerHTML=`<i data-lucide="${iS?'check-circle':'alert-circle'}" class="w-5 h-5 shrink-0 ${cS}"></i><span class="text-[12px] font-black uppercase tracking-widest flex-1">${esc(m)}</span>${action ? `<button class="shrink-0 px-3 py-1.5 rounded-lg bg-white/10 text-white text-[11px] font-black uppercase tracking-widest tap-feedback">${esc(action.label)}</button>` : ''}`;
            if (action) d.querySelector('button').onclick = () => { action.fn(); d.remove(); };
            c.appendChild(d); if(window.lucide) window.lucide.createIcons({root:d}); void d.offsetWidth; d.classList.remove('translate-y-full','opacity-0');
            setTimeout(()=>{if(c.contains(d)){d.classList.add('opacity-0','translate-y-full');setTimeout(()=>{if(c.contains(d))d.remove();},500);}}, action ? 5000 : 3500);
        },
        showConfirm: (title, m, ok, dng=false) => {
            const y = document.getElementById('confirm-yes-btn');
            document.getElementById('confirm-title').innerText=title; document.getElementById('confirm-message').innerText=m;
            y.className=`flex-1 glass-card py-3.5 text-[11px] font-black uppercase tracking-widest shadow-lg ${dng?'text-white bg-red-500/80 border-red-500/50 shadow-red-500/20':'text-black bg-[#d4af37] border-none shadow-[#d4af37]/20'}`;
            document.getElementById('confirm-icon').innerHTML=`<i data-lucide="${dng?'alert-octagon':'alert-triangle'}" class="w-6 h-6 ${dng?'text-red-500':'text-[#d4af37]'}"></i>`;
            if(window.lucide) window.lucide.createIcons({root: document.getElementById('confirm-icon')});
            const nY = y.cloneNode(true); y.parentNode.replaceChild(nY,y); nY.onclick=()=>{window.appActions.closeConfirm();setTimeout(ok,200);};
            openModal('custom-confirm-overlay','custom-confirm-box');
            pushBack('confirm', () => window.appActions.closeConfirm());
        },
        closeConfirm: () => { popBack('confirm'); closeModal('custom-confirm-overlay','custom-confirm-box'); },
        setCheckIn: (key, val) => {
            const draft = window.appState.ciDraft = { ...(window.appState.ciDraft || {}), [key]: val };
            if ([draft.sleep, draft.soreness, draft.energy].every(x => x === 0 || x === 1 || x === 2)) {
                const all = getReadinessAll();
                all[dateKey()] = { sleep: draft.sleep, soreness: draft.soreness, energy: draft.energy };
                // keep only the last 60 days
                const cutoff = dateKey(Date.now() - 60 * 86400000);
                Object.keys(all).forEach(k => { if (k < cutoff) delete all[k]; });
                writeItem(READY_KEY, JSON.stringify(all));
                window.appState.ciDraft = null;
                const r = getReadinessToday();
                window.appActions.showToast(t(r.level === 'low' ? 'Easy day: targets adjusted' : r.level === 'high' ? 'Push day: go get it!' : 'Check-in saved'), 'success');
            }
            renderWorkout();
        },
        resetCheckIn: () => {
            const all = getReadinessAll();
            window.appState.ciDraft = {}; // answer all 3 again
            delete all[dateKey()];
            writeItem(READY_KEY, JSON.stringify(all));
            window.appState.ciSkipped = null;
            renderWorkout();
        },
        setLanguage: v => {
            if (v !== 'ar' && v !== 'en') return;
            writeItem(LANG_KEY, v);
            location.reload();
        },
        // Copy this day (title, type and exercises) onto another day
        copyDay: targetId => {
            const s = getActiveSchedule(), from = s.find(d => d.id === activeDay), to = s.find(d => d.id === targetId);
            if (!from || !to) return;
            const doCopy = () => {
                Object.assign(to, { title: from.title, isRest: from.isRest, recoveryType: from.recoveryType, savedTitle: from.savedTitle, exercises: JSON.parse(JSON.stringify(from.exercises || [])) });
                StorageManager.setPlan(appData); renderNav(false); renderWorkout();
                window.appActions.showToast(t('Copied to {day}', { day: t('Day {n}', { n: to.id }) }), 'success');
            };
            if ((to.exercises || []).length || to.isRest) window.appActions.showConfirm(t('Replace {day}?', { day: t('Day {n}', { n: to.id }) }), t('Its current exercises will be replaced.'), doCopy, true);
            else doCopy();
        },
        skipCheckIn: () => { window.appState.ciSkipped = dateKey(); renderWorkout(); },
        refreshUI: () => renderWorkout(),
        openHistoryModal: (k, title) => { window.appState.historyEditMode=false; window.appState.openHistoryKey=k; const b=document.getElementById('history-edit-btn'); if(b){b.classList.remove('text-[#d4af37]','bg-[#d4af37]/10');b.classList.add('text-slate-400','bg-white/5');} document.getElementById('history-modal-title').innerText=title; const hw=document.getElementById('history-howto'); if(hw) hw.href=`https://www.youtube.com/results?search_query=${encodeURIComponent(title+' exercise form')}`; window.appActions.refreshHistoryModal(k); const o=document.getElementById('history-modal-overlay'),bx=document.getElementById('history-modal-box'); o.classList.remove('hidden'); o.classList.add('flex'); requestAnimationFrame(()=>{o.classList.remove('opacity-0');bx.classList.remove('translate-y-full','md:translate-y-0','md:scale-95');}); pushBack('history', () => window.appActions.closeHistoryModal()); },
        closeHistoryModal: () => { popBack('history'); const o=document.getElementById('history-modal-overlay'),b=document.getElementById('history-modal-box'); o.classList.add('opacity-0'); b.classList.add('translate-y-full'); if(window.innerWidth>=768)b.classList.add('md:scale-95'); setTimeout(()=>{o.classList.add('hidden');o.classList.remove('flex');},300); },
        toggleHistoryEdit: () => { window.appState.historyEditMode=!window.appState.historyEditMode; const b=document.getElementById('history-edit-btn'); if(b){b.className=`p-2 rounded-full tap-feedback transition-colors ${window.appState.historyEditMode?'text-[#d4af37] bg-[#d4af37]/10':'text-slate-400 bg-white/5 hover:text-[#d4af37]'}`;} if(window.appState.openHistoryKey)window.appActions.refreshHistoryModal(window.appState.openHistoryKey); },
        refreshHistoryModal: (k) => { const c=document.getElementById('history-modal-content'), hA=StorageManager.getHistory()[k]||[]; if(!hA.length){c.innerHTML=`<div class="text-center p-10 text-slate-500 text-[12px] font-bold uppercase tracking-widest">${t('No records')}</div>`;return;} let html='',cG=''; const getDt=(h, fb=Date.now())=>{const t=logTime(h); return new Date(isNaN(t)?fb:t);}, sD=getDt(hA[0]); sD.setHours(0,0,0,0); [...hA].reverse().forEach((h,i)=>{const dt=getDt(h, sD.getTime()); dt.setHours(0,0,0,0); const dD=Math.max(0,Math.floor((dt.getTime()-sD.getTime())/86400000)), wN=Math.floor(dD/7)+1, cWS=new Date(sD.getTime()+((wN-1)*604800000)), cWE=new Date(cWS.getTime()+518400000), gN=`${t('WEEK {n}', { n: wN })} • ${fmtDayMonth(cWS)} - ${fmtDayMonth(cWE)}`; if(gN!==cG){html+=`<div class="text-[10px] font-black text-[#d4af37] uppercase tracking-[2px] mt-4 mb-2 pl-1 border-b border-[#d4af37]/20 pb-1"><i data-lucide="calendar-days" class="w-3 h-3 inline mr-1 -mt-0.5"></i> ${esc(gN)}</div>`; cG=gN;}
         html+=`<div class="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 mb-2"><div class="flex flex-col"><div class="flex items-center"><span class="text-[15px] font-black text-white">${(h.ws || h.rpe) ? `<span class="text-[#d4af37]">${logSetDetails(h).map(x => `${x.w > 0 ? x.w : t('BW')}×${x.r}${h.u==='s'?'s':''}${x.rpe ? `<span class="text-[10px] text-slate-400">@${x.rpe}</span>` : ''}`).join(', ')}</span>` : `${parseFloat(h.w)>0?`${esc(h.w)} <span class="text-[10px] text-slate-400">${t('KG')}</span>`:t('BW')} ${h.s?`<span class="ml-2 text-[#d4af37]">${esc(Array.isArray(h.s) ? h.s.join(', ') : h.s)} <span class="text-[10px] text-slate-400">${h.u==='s'?t('SEC'):t('REPS')}</span></span>`:''}`}</span></div><span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">${esc(isNaN(logTime(h)) ? h.d : fmtDate(logTime(h)))} ${h.time ? `<span class="ml-2 text-[#22c55e]"><i data-lucide="clock" class="w-3 h-3 inline -mt-0.5"></i> ${esc(h.time)}</span>` : ''}</span></div>${window.appState.historyEditMode?`<button onclick="window.appActions.deleteHistoryRecord(${jsArg(k)}, ${hA.length-1-i})" class="p-2 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20"><i data-lucide="trash-2" class="w-4 h-4"></i></button>`:''}</div>`; }); c.innerHTML=exerciseStatsHTML(hA)+html; bindCharts(c); if(window.lucide) window.lucide.createIcons({root:c}); },
        deleteHistoryRecord: (k, i) => window.appActions.showConfirm(t("Delete Record"), t("Remove this record?"), () => { let h=StorageManager.getHistory(); if(h[k]){h[k].splice(i,1); StorageManager.setHistory(h); loggedWeights[k]=h[k].length?h[k][h[k].length-1].w:''; loggedReps[k]=h[k].length?h[k][h[k].length-1].s||'':''; StorageManager.set(loggedWeights); StorageManager.setReps(loggedReps); window.appActions.refreshHistoryModal(k); renderWorkout(); window.appActions.showToast(t("Deleted"),"error");} }, true),
        handleTyping: (k, type, v) => { 
            if (type === 'load') { loggedWeights[k] = v; StorageManager.set(loggedWeights); } 
            else { loggedReps[k] = v; StorageManager.setReps(loggedReps); }
        },
        restoreIfEmpty: (k, v) => { if(v.trim()===''){const h=StorageManager.getHistory()[k]||[]; if(h.length){loggedWeights[k]=h[h.length-1].w; StorageManager.set(loggedWeights); renderWorkout();}} },
        // ---------- Workout session: the whole day on one screen ----------
        // restore = a saved unfinished workout to bring back (minimized)
        startWorkout: (dayId = activeDay, restore = null) => {
            const S0 = window.appState.sess;
            if (S0 && !restore) {
                if (S0.dayId === dayId) return window.appActions.expandSession();
                if (sessionHasData()) return window.appActions.showConfirm(t('Discard current session?'), t('Unsaved sets for {name} will be lost.', { name: t(S0.title) }), () => { window.appActions.discardSession(); window.appActions.startWorkout(dayId); }, true);
                window.appActions.discardSession();
            }
            const day = getActiveSchedule().find(x => x.id === dayId);
            if (!day || day.isRest || !day.exercises.length) return;
            const history = StorageManager.getHistory();
            const easy = dayId === getTodayId() && (getReadinessToday() || {}).level === 'low';
            const S = window.appState.sess = restore ? { ...restore } : {
                dayId, title: day.title, startedAt: Date.now(),
                exercises: day.exercises.map((ex, i) => {
                    const k = getExKey(currentWeekId, dayId, i, ex.name), hA = history[k] || [];
                    const sg = suggestionFor(hA, ex, easy), last = getLastSession(hA);
                    // Pre-filled weight: suggestion, else what you typed before, else last session
                    const typed = loggedWeights[k] !== undefined && String(loggedWeights[k]).trim() !== '' ? parseFloat(loggedWeights[k]) : 0;
                    const pw = sg ? (sg.w > 0 ? String(sg.w) : '') : typed > 0 ? String(typed) : last && last.w > 0 ? String(last.w) : '';
                    return { k, name: ex.name, muscle: ex.muscle, sets: Math.max(1, parseInt(ex.sets) || 1), repsStr: ex.reps, timed: isTimed(ex.reps),
                        offset: setsThisWeekForDay(hA, dayId), pw, pr: sg ? sg.r : parseRange(ex.reps).minR, sg };
                })
            };
            delete S.rows;
            window.appActions.renderSession(restore ? restore.rows : null);
            clearInterval(window.appState.awTimer);
            window.appState.awTimer = setInterval(window.appActions.sessionTick, 250);
            window.appActions.sessionTick();
            keepAwake(true);
            if (restore) window.appActions.showMini();
            else { openSheet('active-workout-overlay', 'active-workout-box'); pushBack('session', () => window.appActions.minimizeSession()); }
            saveSessionDraft();
            renderWorkout();
        },
        renderSession: (rows = null) => {
            const S = window.appState.sess; if (!S) return;
            const showRpe = StorageManager.getShowRpe();
            S.cols = showRpe ? '28px minmax(0,1fr) 64px 56px 48px 42px' : '28px minmax(0,1fr) 72px 64px 44px';
            S.rowSeq = 0; // rows are numbered from 1 again every time the table is built
            document.getElementById('aw-title').innerText = t(S.title);
            document.getElementById('aw-status-text').innerText = t('Workout');
            document.getElementById('aw-pulse-dot').className = 'w-2 h-2 rounded-full shrink-0 bg-red-500 animate-pulse';
            document.getElementById('aw-mini-name').innerText = t(S.title);
            const head = ex => `<div class="grid items-center gap-1.5 px-2 pb-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest" dir="ltr" style="grid-template-columns:${S.cols}"><span class="text-center">#</span><span>${t('Previous')}</span><span class="text-center">${t('KG')}</span><span class="text-center">${ex.timed ? t('SEC') : t('REPS')}</span>${showRpe ? '<span class="text-center">RPE</span>' : ''}<span class="text-center">✓</span></div>`;
            document.getElementById('aw-sets-container').innerHTML = S.exercises.map((ex, e) => `
                <section class="mb-6" id="aw-ex-${e}">
                    <div class="flex items-start justify-between gap-2 px-1 mb-2">
                        <div class="min-w-0">
                            <div class="ex-name text-[17px] font-black text-white leading-tight">${esc(ex.name)}</div>
                            <div class="text-[11px] font-bold text-slate-400 mt-0.5">${esc(tm(ex.muscle))} · <span dir="ltr">${ex.sets} × ${esc(ex.repsStr)}</span></div>
                        </div>
                        <span class="shrink-0">${suggestionChip(ex.sg, ex.timed)}</span>
                    </div>
                    ${head(ex)}
                    <div id="aw-rows-${e}" class="space-y-1.5"></div>
                    <div id="aw-note-${e}" class="hidden px-2 py-2 text-[11px] font-black text-[#22c55e]"><i data-lucide="check" class="w-3.5 h-3.5 inline -mt-0.5"></i> ${t('Done this week')}</div>
                    <div class="flex gap-2 mt-2 px-1">
                        <button onclick="window.appActions.addSetRow(${e})" class="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-widest text-slate-300 tap-feedback flex items-center justify-center gap-1.5"><i data-lucide="plus" class="w-4 h-4"></i>${t('Add set')}</button>
                        <button onclick="window.appActions.removeSetRow(${e})" class="py-2 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-400 tap-feedback" aria-label="${esc(t('Remove set'))}"><i data-lucide="minus" class="w-4 h-4"></i></button>
                    </div>
                </section>`).join('');
            if (rows && rows.length) rows.forEach(r => { if (S.exercises[r.e]) window.appActions.addSetRow(r.e, r, true); });
            else S.exercises.forEach((ex, e) => {
                const n = Math.max(0, ex.sets - ex.offset);
                for (let j = 0; j < n; j++) window.appActions.addSetRow(e, null, true);
            });
            S.exercises.forEach((ex, e) => { if (!document.querySelector(`#aw-rows-${e} .aw-row`)) document.getElementById(`aw-note-${e}`).classList.remove('hidden'); });
            document.getElementById('aw-next').innerHTML = '';
            document.getElementById('aw-next-btn').classList.add('hidden');
            document.getElementById('aw-finish-btn').innerText = t('Finish workout');
            window.appActions.updateSessionInfo();
            if (window.lucide) window.lucide.createIcons({ root: document.getElementById('active-workout-box') });
        },
        updateSessionInfo: () => {
            const S = window.appState.sess; if (!S) return;
            const all = document.querySelectorAll('#aw-sets-container .aw-row'), done = document.querySelectorAll('#aw-sets-container .aw-row[data-done="1"]');
            const pct = all.length ? Math.round(done.length / all.length * 100) : 0;
            document.getElementById('aw-info').innerHTML = `<div class="w-full"><div class="flex justify-between text-[11px] font-black mb-1.5"><span class="text-slate-400">${t('{n} exercises', { n: S.exercises.length })}</span><span class="text-white" dir="ltr">${done.length} / ${all.length} ${t('sets')}</span></div><div class="w-full h-2 bg-black/60 rounded-full overflow-hidden"><div class="h-full bg-[#22c55e] rounded-full transition-all" style="width:${pct}%"></div></div></div>`;
        },
        // Adds one set row to exercise e
        addSetRow: (e, r = null, building = false) => {
            const S = window.appState.sess; if (!S || !S.exercises[e]) return;
            const ex = S.exercises[e], box = document.getElementById(`aw-rows-${e}`);
            const prevSets = lastSessionSets(StorageManager.getHistory()[ex.k] || []);
            const rowsNow = box.querySelectorAll('.aw-row');
            if (!r) { const lastW = rowsNow.length ? (document.getElementById(`aw-w-${rowsNow[rowsNow.length - 1].dataset.i}`) || {}).value : ex.pw; r = { w: lastW || '', r: '', rpe: '', done: false }; }
            S.rowSeq = (S.rowSeq || 0) + 1;
            const i = S.rowSeq, n = ex.offset + rowsNow.length + 1, prev = prevSets[n - 1];
            const ph = ex.sg ? ex.pr : prev ? prev.r : ex.pr;
            const showRpe = StorageManager.getShowRpe();
            const inCls = 'w-full h-11 rounded-lg bg-black/50 border border-white/10 text-center text-[16px] font-black text-white outline-none focus:border-[#d4af37] placeholder:text-slate-600 placeholder:font-bold';
            box.insertAdjacentHTML('beforeend', `
                <div class="aw-row grid items-center gap-1.5 px-2 py-1 rounded-xl transition-colors ${r.done ? 'bg-[#22c55e]/10' : ''}" data-i="${i}" data-e="${e}" data-done="${r.done ? 1 : 0}" id="aw-row-${i}" dir="ltr" style="grid-template-columns:${S.cols}">
                    <span class="w-7 h-7 rounded-full ${r.done ? 'bg-[#22c55e] text-black' : 'bg-white/5 text-slate-300'} text-[12px] font-black flex items-center justify-center" id="aw-num-${i}">${n}</span>
                    <button type="button" onclick="window.appActions.copyPrev(${i})" data-w="${prev ? prev.w : ''}" data-r="${prev ? prev.r : ''}" class="text-start text-[12px] font-bold text-slate-500 truncate tap-feedback">${prev ? `${prev.w > 0 ? prev.w : t('BW')} × ${prev.r}${ex.timed ? 's' : ''}${prev.rpe ? ` @${prev.rpe}` : ''}` : '—'}</button>
                    <input id="aw-w-${i}" type="number" inputmode="decimal" step="0.5" value="${esc(r.w)}" placeholder="${t('BW')}" oninput="window.appActions.sessionChanged()" class="${inCls} text-[#d4af37]">
                    <input id="aw-rep-${i}" type="number" inputmode="numeric" value="${esc(r.r)}" placeholder="${ph}" oninput="window.appActions.sessionChanged()" class="${inCls}">
                    ${showRpe ? `<select id="aw-rpe-${i}" onchange="window.appActions.sessionChanged()" class="${inCls} appearance-none text-[14px]"><option value="">–</option>${[6,7,8,9,10].map(x => `<option value="${x}" ${String(r.rpe) === String(x) ? 'selected' : ''}>${x}</option>`).join('')}</select>` : ''}
                    <button type="button" id="aw-done-${i}" onclick="window.appActions.completeSet(${i})" class="h-11 rounded-lg flex items-center justify-center tap-feedback border ${r.done ? 'bg-[#22c55e] border-[#22c55e] text-black' : 'bg-white/5 border-white/10 text-slate-400'}" aria-label="${esc(t('Done'))}"><i data-lucide="check" class="w-5 h-5"></i></button>
                </div>`);
            document.getElementById(`aw-note-${e}`).classList.add('hidden');
            if (!building) { if (window.lucide) window.lucide.createIcons({ root: box }); window.appActions.updateSessionInfo(); saveSessionDraft(); }
        },
        removeSetRow: e => {
            const rows = document.querySelectorAll(`#aw-rows-${e} .aw-row`);
            if (rows.length) { rows[rows.length - 1].remove(); if (rows.length === 1) document.getElementById(`aw-note-${e}`).classList.remove('hidden'); window.appActions.updateSessionInfo(); saveSessionDraft(); }
        },
        copyPrev: i => {
            const b = document.querySelector(`#aw-row-${i} button[data-w]`); if (!b || !b.dataset.r) return;
            document.getElementById(`aw-w-${i}`).value = parseFloat(b.dataset.w) > 0 ? b.dataset.w : '';
            document.getElementById(`aw-rep-${i}`).value = b.dataset.r;
            saveSessionDraft();
        },
        sessionChanged: () => saveSessionDraft(),
        // ✓ a set: fills reps from the target if empty, marks it done, starts the rest timer and scrolls to the next set
        completeSet: i => {
            const row = document.getElementById(`aw-row-${i}`), inp = document.getElementById(`aw-rep-${i}`);
            if (!row || !inp) return;
            const setDone = on => {
                row.dataset.done = on ? '1' : '0';
                row.classList.toggle('bg-[#22c55e]/10', on);
                const b = document.getElementById(`aw-done-${i}`), num = document.getElementById(`aw-num-${i}`);
                if (b) b.className = `h-11 rounded-lg flex items-center justify-center tap-feedback border ${on ? 'bg-[#22c55e] border-[#22c55e] text-black' : 'bg-white/5 border-white/10 text-slate-400'}`;
                if (num) num.className = `w-7 h-7 rounded-full ${on ? 'bg-[#22c55e] text-black' : 'bg-white/5 text-slate-300'} text-[12px] font-black flex items-center justify-center`;
            };
            if (row.dataset.done === '1') { setDone(false); window.appActions.updateSessionInfo(); saveSessionDraft(); return; }
            if (!(parseInt(inp.value) > 0)) {
                if (parseInt(inp.placeholder) > 0) inp.value = inp.placeholder;
                else return window.appActions.showToast(t(window.appState.sess && window.appState.sess.exercises[Number(row.dataset.e)].timed ? "Enter seconds first" : "Enter reps first"), "error");
            }
            setDone(true);
            if (navigator.vibrate) navigator.vibrate(30);
            window.appActions.updateSessionInfo();
            const next = [...document.querySelectorAll('#aw-sets-container .aw-row')].find(r => r.dataset.done !== '1');
            if (next) {
                window.appActions.startRest(StorageManager.getRestSeconds());
                setTimeout(() => next.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
            }
            saveSessionDraft();
        },
        startRest: secs => {
            const S = window.appState.sess; if (!S) return;
            window.appState.awRestEnd = Date.now() + secs * 1000; S.restOver = false;
            const bar = document.getElementById('aw-rest');
            bar.classList.remove('hidden'); bar.classList.add('flex');
            document.getElementById('aw-rest-label').innerText = t('Rest');
            window.appActions.sessionTick();
        },
        restAdd: secs => { if (window.appState.awRestEnd) { window.appState.awRestEnd = Math.max(Date.now() + 1000, window.appState.awRestEnd + secs * 1000); window.appActions.sessionTick(); } },
        restSkip: () => {
            window.appState.awRestEnd = null;
            const bar = document.getElementById('aw-rest');
            if (bar) { bar.classList.add('hidden'); bar.classList.remove('flex'); }
            window.appActions.sessionTick();
        },
        updateRest: v => { StorageManager.setRestSeconds(v); window.appActions.showToast(t('Rest timer: {v}s', { v }), 'success'); },
        // Runs 4× a second while a workout is open: clock, rest countdown and the minimized bar
        sessionTick: () => {
            const S = window.appState.sess; if (!S) return;
            const clock = fmtClock(Math.floor((Date.now() - S.startedAt) / 1000));
            document.getElementById('aw-timer').innerText = clock;
            let rest = null;
            if (window.appState.awRestEnd) {
                const left = Math.ceil((window.appState.awRestEnd - Date.now()) / 1000);
                if (left > 0) { rest = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`; document.getElementById('aw-rest-time').innerText = rest; }
                else if (!S.restOver) {
                    S.restOver = true;
                    document.getElementById('aw-rest-label').innerText = t('Rest over'); document.getElementById('aw-rest-time').innerText = t('GO!');
                    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
                    setTimeout(() => { if (window.appState.sess === S && S.restOver) window.appActions.restSkip(); }, 4000);
                }
            }
            const all = document.querySelectorAll('#aw-sets-container .aw-row').length, done = document.querySelectorAll('#aw-sets-container .aw-row[data-done="1"]').length;
            document.getElementById('aw-mini-time').innerText = rest || clock;
            document.getElementById('aw-mini-sub').innerText = rest ? t('Rest') : `${done} / ${all} ${t('sets')}`;
            document.getElementById('aw-mini-dot').className = `w-2.5 h-2.5 rounded-full shrink-0 animate-pulse ${rest ? 'bg-[#22c55e]' : 'bg-red-500'}`;
        },
        // Minimize: hide the workout but keep everything (and the timer) running; a bar stays at the bottom
        minimizeSession: () => {
            if (!window.appState.sess) return;
            popBack('session');
            closeSheet('active-workout-overlay', 'active-workout-box');
            window.appActions.showMini();
            saveSessionDraft();
        },
        showMini: () => {
            const m = document.getElementById('aw-mini');
            m.classList.remove('hidden'); m.classList.add('flex');
            document.body.classList.add('has-mini');
            if (window.lucide) window.lucide.createIcons({ root: m });
            window.appActions.sessionTick();
        },
        expandSession: () => {
            if (!window.appState.sess) return;
            const m = document.getElementById('aw-mini');
            m.classList.add('hidden'); m.classList.remove('flex');
            document.body.classList.remove('has-mini');
            openSheet('active-workout-overlay', 'active-workout-box');
            pushBack('session', () => window.appActions.minimizeSession());
        },
        // Throw the workout away (nothing saved)
        discardSession: () => {
            clearInterval(window.appState.awTimer);
            window.appState.awRestEnd = null;
            const wasOpen = document.getElementById('active-workout-overlay').classList.contains('flex');
            window.appState.sess = null;
            popBack('session');
            if (wasOpen) closeSheet('active-workout-overlay', 'active-workout-box');
            const m = document.getElementById('aw-mini'); m.classList.add('hidden'); m.classList.remove('flex');
            document.body.classList.remove('has-mini');
            const bar = document.getElementById('aw-rest'); bar.classList.add('hidden'); bar.classList.remove('flex');
            keepAwake(false);
            clearSessionDraft();
            renderWorkout();
        },
        closeActiveWorkout: () => {
            if (sessionHasData()) window.appActions.showConfirm(t('Discard this workout?'), t('Your unsaved sets will be lost.'), () => window.appActions.discardSession(), true);
            else window.appActions.discardSession();
        },
        // Finish: save every filled set, then show the summary
        finishActiveWorkout: () => {
            const S = window.appState.sess; if (!S) return;
            const filled = sessionRows().filter(x => parseInt(x.r) > 0 && S.exercises[x.e]);
            if (!filled.length) return window.appActions.showToast(t("Enter reps for at least 1 set"), "error");
            // a weighted exercise needs a KG (type 0 for bodyweight)
            const bad = filled.find(x => x.w === '' && !isBodyweight(S.exercises[x.e].name));
            if (bad) {
                const row = document.getElementById(`aw-row-${bad.i}`); if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return window.appActions.showToast(t('Enter KG for every set (0 = bodyweight)'), 'error');
            }
            const h = StorageManager.getHistory(), n = new Date();
            const duration = Math.floor((Date.now() - S.startedAt) / 1000);
            let sets = 0, volume = 0; const prs = [];
            S.exercises.forEach((ex, e) => {
                const mine = filled.filter(x => x.e === e);
                if (!mine.length) return;
                const reps = mine.map(x => parseInt(x.r));
                const ws = mine.map(x => parseFloat(x.w) > 0 ? String(parseFloat(x.w)) : '0');
                const rpe = mine.map(x => { const v = parseFloat(x.rpe); return v >= 1 && v <= 10 ? v : null; });
                const w = String(Math.max(...ws.map(Number)));
                // personal record: heavier than anything before today
                const before = (h[ex.k] || []).filter(l => !isToday(logTime(l)));
                const best = Math.max(0, ...before.flatMap(logSetDetails).map(x => x.w));
                if (best > 0 && Number(w) > best) prs.push({ name: ex.name, w: Number(w), plus: Math.round((Number(w) - best) * 10) / 10 });
                sets += reps.length;
                if (!ex.timed) volume += reps.reduce((a, r, j) => a + r * Number(ws[j]), 0);
                const entry = {
                    d: formatLogDate(n),   // text date (for display and older app versions)
                    ts: n.getTime(),       // exact time (used for all date calculations)
                    w, s: reps, time: fmtClock(duration),
                    week: (appData.weeks.find(x => x.id === currentWeekId) || {}).name || 'Routine',
                    weekId: currentWeekId, // which routine this was logged in
                    dayId: S.dayId         // which day of the routine this was logged for
                };
                if (ex.timed) entry.u = 's';
                if (ws.some(x => x !== w)) entry.ws = ws; // only stored when weights differ per set
                if (rpe.some(x => x !== null)) entry.rpe = rpe;
                (h[ex.k] = h[ex.k] || []).push(entry);
                if (h[ex.k].length > 150) h[ex.k] = h[ex.k].slice(-150);
                loggedWeights[ex.k] = w === '0' ? '' : w;
            });
            StorageManager.setHistory(h); StorageManager.set(loggedWeights);
            if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
            const title = S.title;
            window.appActions.discardSession();
            renderNav();
            window.appActions.showSummary({ title, duration, sets, volume, prs });
        },
        showSummary: ({ title, duration, sets, volume, prs }) => {
            document.getElementById('summary-title').innerText = `${t(title)} · ${fmtDate(Date.now(), false)}`;
            const stat = (v, l) => `<div class="bg-white/5 rounded-xl py-3"><div class="text-[18px] font-black text-white" dir="ltr">${v}</div><div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">${l}</div></div>`;
            document.getElementById('summary-stats').innerHTML = stat(fmtClock(duration), t('Time')) + stat(sets, t('sets')) + stat(`${Math.round(volume).toLocaleString('en-US')}`, t('kg lifted'));
            document.getElementById('summary-prs').innerHTML = prs.length
                ? `<div class="text-[11px] font-black text-[#d4af37] uppercase tracking-widest mb-2">🏆 ${t('New records')}</div>` + prs.map(x => `<div class="flex justify-between gap-2 py-2 border-b border-white/5 last:border-0"><span class="ex-name text-[13px] font-bold text-white truncate">${esc(x.name)}</span><span class="text-[13px] font-black text-[#22c55e] shrink-0" dir="ltr">${x.w}kg (+${x.plus})</span></div>`).join('')
                : '';
            openModal('summary-overlay', 'summary-box');
            pushBack('summary', () => window.appActions.closeSummary());
        },
        closeSummary: () => { popBack('summary'); closeModal('summary-overlay', 'summary-box'); },
        applyGlobalSetsReps: () => {
            const s = document.getElementById('global-sets').value;
            const r = document.getElementById('global-reps').value;
            if (!s && !r) return window.appActions.showToast(t("Enter Sets or Reps"), "error");
            const d = getActiveSchedule().find(x => x.id === activeDay);
            d.exercises.forEach(ex => {
                if(s) ex.sets = s;
                if(r) ex.reps = r;
            });
            StorageManager.setPlan(appData);
            renderWorkout();
            window.appActions.showToast(t("Updated all exercises"), "success");
        },
        updateStartOfWeek: v => { const aD=DAY_NAMES, idx=aD.indexOf(v); if(idx===-1)return; StorageManager.setStartDay(v); appData.weeks.forEach(w=>w.schedule.forEach((d,i)=>d.day=aD[(idx+i)%7])); StorageManager.setPlan(appData); activeDay=getTodayId(); const s=document.getElementById('setting-start-day'); if(s)s.value=v; renderNav(false); renderWorkout(); setTimeout(()=>window.appActions.showToast(t('Week starts on {d}', { d: tDay(v) }),"success"),300); },
        swapDay: tId => { const s=getActiveSchedule(), d1=s.find(d=>d.id===activeDay), d2=s.find(d=>d.id===tId); if(!d1||!d2)return; const tT=d1.title, tE=JSON.stringify(d1.exercises), tIR=d1.isRest, tRT=d1.recoveryType, tST=d1.savedTitle; d1.title=d2.title; d1.exercises=JSON.parse(JSON.stringify(d2.exercises||[])); d1.isRest=d2.isRest; d1.recoveryType=d2.recoveryType; d1.savedTitle=d2.savedTitle; d2.title=tT; d2.exercises=JSON.parse(tE||'[]'); d2.isRest=tIR; d2.recoveryType=tRT; d2.savedTitle=tST; StorageManager.setPlan(appData); renderWorkout(); renderNav(false); },
        updateDayTitle: v => { getActiveSchedule().find(d=>d.id===activeDay).title=v.trim()||'New Day'; StorageManager.setPlan(appData); renderWorkout(); renderNav(false); },
        updateDayType: v => { const d=getActiveSchedule().find(x=>x.id===activeDay); if(v==='workout'){d.isRest=false; d.recoveryType=null; d.title=d.savedTitle||'New Workout'; if(!d.exercises)d.exercises=[];}else{if(!d.isRest)d.savedTitle=d.title; d.isRest=true; d.recoveryType=v; d.title=v==='active'?'Active Rest':'Complete Rest';} StorageManager.setPlan(appData); renderWorkout(); renderNav(false); },        // Delete straight away, with an Undo button for a few seconds
        deleteEx: i => {
            const d = getActiveSchedule().find(x => x.id === activeDay);
            window.appState.inlineEdit = null;
            const removed = d.exercises.splice(i, 1)[0];
            StorageManager.setPlan(appData); renderWorkout(); renderNav(false);
            window.appActions.showToast(t('Removed {name}', { name: removed.name }), 'error', { label: t('Undo'), fn: () => {
                d.exercises.splice(i, 0, removed); StorageManager.setPlan(appData); renderWorkout(); renderNav(false);
            } });
        },

        // ---------- Exercise picker ----------
        // mode 'add': choose several exercises and add them; mode 'replace': swap exercise number idx
        openPicker: (mode, idx = null) => {
            const d = getActiveSchedule().find(x => x.id === activeDay);
            const cur = mode === 'replace' ? d.exercises[idx] : null;
            window.appState.picker = { mode, idx, muscle: cur && muscleOptions.includes(cur.muscle) ? cur.muscle : 'All', q: '', sel: [] };
            document.getElementById('picker-title').innerText = mode === 'replace' ? t('Swap {name}', { name: cur.name }) : t('Add exercises');
            const search = document.getElementById('picker-search'); search.value = '';
            window.appActions.renderPicker();
            openSheet('picker-overlay', 'picker-box');
            pushBack('picker', () => window.appActions.closePicker());
        },
        closePicker: () => { popBack('picker'); closeSheet('picker-overlay', 'picker-box'); },
        pickerSearch: v => { window.appState.picker.q = v; window.appActions.renderPicker(false); },
        pickerMuscle: m => { window.appState.picker.muscle = m; window.appActions.renderPicker(); document.getElementById('picker-list').scrollTop = 0; },
        renderPicker: (withChips = true) => {
            const P = window.appState.picker, d = getActiveSchedule().find(x => x.id === activeDay);
            const inDay = new Set(d.exercises.map(e => e.name));
            const isSel = (name, muscle) => P.sel.some(x => x.name === name && x.muscle === muscle);
            if (withChips) {
                document.getElementById('picker-chips').innerHTML = ['All', ...muscleOptions].map(m =>
                    `<button onclick="window.appActions.pickerMuscle(${jsArg(m)})" class="shrink-0 px-3 py-1.5 rounded-full text-[11px] font-black tap-feedback border ${P.muscle === m ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'bg-white/5 text-slate-300 border-white/10'}">${esc(m === 'All' ? t('All') : tm(m))}</button>`).join('');
            }
            const row = x => {
                const sel = isSel(x.name, x.muscle), added = inDay.has(x.name);
                return `<button onclick="window.appActions.pickerTap(${jsArg(x.name)}, ${jsArg(x.muscle)})" class="w-full flex items-center justify-between gap-3 px-4 py-3 border-b border-white/5 text-start tap-feedback ${sel ? 'bg-[#d4af37]/10' : ''}">
                    <span class="min-w-0"><span class="ex-name block text-[14px] font-bold text-white truncate">${esc(x.name)}${x.custom ? ` <span class="text-[9px] text-[#d4af37]">★</span>` : ''}</span><span class="block text-[10px] font-bold text-slate-500">${esc(tm(x.muscle))}${added ? ` • ${esc(t('In this day'))}` : ''}</span></span>
                    <span class="shrink-0 w-7 h-7 rounded-full flex items-center justify-center border ${sel ? 'bg-[#d4af37] border-[#d4af37] text-black' : 'border-white/20 text-slate-400'}"><i data-lucide="${P.mode === 'replace' ? 'arrow-left-right' : (sel ? 'check' : 'plus')}" class="w-4 h-4"></i></span>
                </button>`;
            };
            const header = txt => `<div class="px-4 pt-4 pb-1 text-[10px] font-black text-[#d4af37] uppercase tracking-widest">${esc(txt)}</div>`;
            const q = P.q.trim().toLowerCase();
            let items = catalogue();
            if (P.muscle !== 'All') items = items.filter(x => x.muscle === P.muscle);
            let html = '';
            if (q) {
                const seen = new Set();
                const hits = items.filter(x => (x.name.toLowerCase().includes(q) || tm(x.muscle).toLowerCase().includes(q)) && !seen.has(x.name) && seen.add(x.name));
                html = hits.map(row).join('');
                if (!items.some(x => x.name.toLowerCase() === q)) {
                    html += P.muscle === 'All'
                        ? `<div class="px-4 py-4 text-[11px] font-bold text-slate-500">${esc(t('Not in the list? Choose a muscle above, then add "{name}" as your own exercise.', { name: P.q.trim() }))}</div>`
                        : `<button onclick="window.appActions.addCustomEx()" class="w-full flex items-center gap-3 px-4 py-4 text-start text-[#d4af37] font-black text-[13px] tap-feedback"><i data-lucide="plus-circle" class="w-5 h-5"></i>${esc(t('Add "{name}" to {muscle}', { name: P.q.trim(), muscle: tm(P.muscle) }))}</button>`;
                }
            } else if (P.muscle === 'All') {
                // Exercises already used in your routines first, then everything by muscle
                const used = [], seen = new Set();
                appData.weeks.forEach(w => w.schedule.forEach(day => (day.exercises || []).forEach(e => { if (!seen.has(e.name) && e.name && e.name !== 'New Exercise') { seen.add(e.name); used.push({ name: e.name, muscle: e.muscle }); } })));
                if (used.length) html += header(t('In your routines')) + used.map(row).join('');
                muscleOptions.forEach(m => { const list = items.filter(x => x.muscle === m); if (list.length) html += header(tm(m)) + list.map(row).join(''); });
            } else {
                html = items.map(row).join('');
            }
            const list = document.getElementById('picker-list');
            list.innerHTML = html || `<div class="p-10 text-center text-[12px] font-bold text-slate-500">${esc(t('No exercises found'))}</div>`;
            if (window.lucide) window.lucide.createIcons({ root: list });
            const btn = document.getElementById('picker-add-btn');
            btn.classList.toggle('hidden', P.mode !== 'add' || P.sel.length === 0);
            btn.innerText = P.sel.length === 1 ? t('Add 1 exercise') : t('Add {n} exercises', { n: P.sel.length });
        },
        pickerTap: (name, muscle) => {
            const P = window.appState.picker, d = getActiveSchedule().find(x => x.id === activeDay);
            if (P.mode === 'replace') {
                // keep sets & reps, change the exercise
                Object.assign(d.exercises[P.idx], { name, muscle });
                StorageManager.setPlan(appData);
                window.appActions.closePicker(); renderWorkout();
                window.appActions.showToast(t('Swapped to {name}', { name }), 'success');
                return;
            }
            const i = P.sel.findIndex(x => x.name === name && x.muscle === muscle);
            if (i >= 0) P.sel.splice(i, 1); else P.sel.push({ name, muscle });
            const top = document.getElementById('picker-list').scrollTop;
            window.appActions.renderPicker(false);
            document.getElementById('picker-list').scrollTop = top;
        },
        pickerConfirm: () => {
            const P = window.appState.picker, d = getActiveSchedule().find(x => x.id === activeDay);
            if (!P.sel.length) return;
            P.sel.forEach(x => d.exercises.push(newExercise(x.name, x.muscle)));
            // Give an unnamed day a name from its muscles, e.g. "Chest & Triceps"
            if (!d.title || !d.title.trim() || d.title === 'New Day' || d.title === t('New Day')) {
                const ms = [...new Set(d.exercises.map(e => tm(e.muscle)))].slice(0, 2);
                d.title = ms.join(isAR ? ' و ' : ' & ');
                d.savedTitle = d.title;
            }
            StorageManager.setPlan(appData);
            const n = P.sel.length;
            window.appActions.closePicker(); renderWorkout(); renderNav(false);
            window.appActions.showToast(n === 1 ? t('1 exercise added') : t('{n} exercises added', { n }), 'success');
        },
        addCustomEx: () => {
            const P = window.appState.picker, name = P.q.trim().slice(0, 60);
            if (!name || P.muscle === 'All') return;
            const list = getCustomEx();
            if (!list.some(x => x.name.toLowerCase() === name.toLowerCase())) { list.push({ name, muscle: P.muscle }); setCustomEx(list); }
            P.q = ''; document.getElementById('picker-search').value = '';
            window.appActions.pickerTap(name, P.muscle);
            if (P.mode === 'add') window.appActions.renderPicker(false);
        },

        // ---------- Edit one exercise inside its own card ----------
        openExEdit: i => { window.appState.inlineEdit = i; renderWorkout(); },
        closeExEdit: () => { window.appState.inlineEdit = null; renderWorkout(); },
        exEditSets: dlt => {
            const ex = getActiveSchedule().find(x => x.id === activeDay).exercises[window.appState.inlineEdit];
            ex.sets = String(Math.min(10, Math.max(1, (parseInt(ex.sets) || 3) + dlt)));
            StorageManager.setPlan(appData); renderWorkout();
        },
        exEditReps: v => {
            v = (v || '').trim(); if (!v) return;
            getActiveSchedule().find(x => x.id === activeDay).exercises[window.appState.inlineEdit].reps = v.slice(0, 20);
            StorageManager.setPlan(appData); renderWorkout();
        },
        clearDay: () => window.appActions.showConfirm(t("Clear Day"), t("Delete all exercises?"), () => { const d=getActiveSchedule().find(x=>x.id===activeDay); d.exercises=[]; d.title=""; StorageManager.setPlan(appData); renderWorkout(); }, true),
        switchTab: tab => {
            if (tab === 'workout') tab = 'today'; if (tab === 'analytics') tab = 'progress';
            window.appState.inlineEdit = null; window.appState.currentView = tab;
            ['today', 'plan', 'progress', 'profile'].forEach(v => { const b = document.getElementById('tabbtn-' + v); if (b) b.className = `tab-btn py-2.5 flex flex-col items-center gap-1 tap-feedback relative ${v === tab ? 'text-[#d4af37]' : 'text-slate-500'}`; });
            document.getElementById('nav-container').style.display = (tab === 'today' || tab === 'plan') ? '' : 'none';
            document.getElementById('plan-routines').classList.toggle('hidden', tab !== 'plan');
            document.getElementById('profile-view').classList.toggle('hidden', tab !== 'profile');
            document.getElementById('workout-container').classList.toggle('hidden', tab === 'profile');
            renderNav(); renderWorkout();
            const sc = document.querySelector('.scrollable-content'); if (sc) sc.scrollTop = 0;
        },
        addWeek: () => { if(appData.weeks.length>=5)return window.appActions.showToast(t("Up to 5 routines"),"error"); const aD=DAY_NAMES, sI=aD.indexOf(StorageManager.getStartDay()); let eS=[]; for(let i=1;i<=7;i++)eS.push({id:i,day:aD[(sI+i-1)%7],title:'New Day',isRest:false,recoveryType:null,exercises:[]}); appData.weeks.push({id:'w_'+Date.now(),name:t('Routine {n}', { n: appData.weeks.length+1 }),schedule:eS}); StorageManager.setPlan(appData); renderSidePanel(); },
        deleteWeek: id => { if(appData.weeks.length<=1)return; window.appActions.showConfirm(t("Delete routine"),t("Delete this routine? Your history is kept."),()=>{appData.weeks=appData.weeks.filter(w=>w.id!==id); if(currentWeekId===id){currentWeekId=appData.weeks[0].id;StorageManager.setActiveWeek(currentWeekId);window.appActions.refreshUI();renderNav();} StorageManager.setPlan(appData); renderSidePanel(); },true); },
        renameWeek: (id, v) => { const w=appData.weeks.find(x=>x.id===id); if(w)w.name=v||t('Unnamed'); StorageManager.setPlan(appData); document.getElementById('active-week-label').innerText=appData.weeks.find(x=>x.id===currentWeekId).name; },
        switchWeek: id => { currentWeekId=id; StorageManager.setActiveWeek(id); activeDay=getTodayId(); window.appState.inlineEdit=null; renderNav(); renderWorkout(); },
        setActiveDay: id => { window.appState.inlineEdit=null; activeDay=id; renderNav(); renderWorkout(); },
        toggleRpe: v => { StorageManager.setShowRpe(v); window.appActions.showToast(t(v ? 'RPE column on' : 'RPE column off'), 'success'); },
        openBackupModal: () => { openModal('smart-backup-overlay','smart-backup-box'); },
        closeBackupModal: () => closeModal('smart-backup-overlay','smart-backup-box'),
        executeSmartBackup: () => {
            const doProg = document.getElementById('backup-opt-progress').checked;
            const doSched = document.getElementById('backup-opt-schedule').checked;
            const doSet = document.getElementById('backup-opt-settings').checked;
            if (!doProg && !doSched && !doSet) return window.appActions.showToast(t("Select at least one option!"), "error");
            StorageManager.setBackupDate(); updateBackupStatus();
            let d = {};
            if (doProg) { d.w = StorageManager.get(); d.h = StorageManager.getHistory(); }
            if (doSched) { d.p = appData; d.aw = currentWeekId; d.cx = getCustomEx(); } // the routine on screen (even if never edited)
            if (doSet) { d.s = StorageManager.getStartDay(); d.rt = StorageManager.getRestSeconds(); }
            const a = document.createElement('a'); 
            a.href = URL.createObjectURL(new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' })); 
            const n = new Date();
            const ms = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            const dStr = `${ms[n.getMonth()]}${n.getDate()}`;
            let fName = `ApexLift_Backup_${dStr}.json`;
            if (doProg && !doSched && !doSet) fName = `ApexLift_ProgressOnly_${dStr}.json`;
            else if (!doProg && doSched && !doSet) fName = `ApexLift_RoutineOnly_${dStr}.json`;
            a.download = fName; 
            a.click();
            window.appActions.closeBackupModal();
            setTimeout(() => window.appActions.showToast(t("Data Exported!"), "success"), 300);
        },
        importData: e => {
            const f=e.target.files[0]; if(!f)return;
            const r=new FileReader();
            r.onload=ev=>{
                try {
                    const raw=JSON.parse(ev.target.result);
                    if(!isObj(raw)) throw new Error('Backup is not an object');
                    // Clean everything in the file before using it
                    const d = {
                        w: raw.w !== undefined ? sanitizeValueMap(raw.w) : undefined,
                        h: sanitizeHistory(raw.h),
                        p: raw.p !== undefined ? sanitizePlan(raw.p) : null,
                        aw: toStr(raw.aw) || null,
                        s: DAY_NAMES.includes(raw.s) ? raw.s : null,
                        rt: [60,90,120,180].includes(raw.rt) ? raw.rt : null,
                        cx: sanitizeCustomEx(raw.cx)
                    };
                    if(raw.p !== undefined && !d.p) window.appActions.showToast(t("Routine in file is damaged: skipped"),"error");
                    if(!d.w && !d.p && !d.s) throw new Error('Nothing usable in backup');
                    window.appState.pendingRestoreData = d;
                    document.getElementById('restore-progress-desc').innerText = d.w && Object.keys(d.w).length ? t('{n} exercises found', { n: Object.keys(d.w).length }) : t('No progress found');
                    document.getElementById('restore-schedule-desc').innerText = d.p ? t('Custom schedule found') : t('No schedule found');
                    document.getElementById('restore-settings-desc').innerText = d.s ? t('Start Day: {d}', { d: tDay(d.s) }) : t('No settings found');
                    document.getElementById('restore-opt-progress').checked = !!(d.w && Object.keys(d.w).length);
                    document.getElementById('restore-opt-progress').disabled = !(d.w && Object.keys(d.w).length);
                    document.getElementById('restore-opt-schedule').checked = false; 
                    document.getElementById('restore-opt-schedule').disabled = !d.p;
                    document.getElementById('restore-opt-settings').checked = false;
                    document.getElementById('restore-opt-settings').disabled = !d.s;
                    openModal('smart-restore-overlay','smart-restore-box');
                } catch(err) { window.appActions.showToast(t("Invalid Backup file"),"error"); }
            };
            r.readAsText(f); e.target.value='';
        },
        closeRestoreModal: () => {
            closeModal('smart-restore-overlay','smart-restore-box', 300, () => { window.appState.pendingRestoreData = null; });
        },
        executeSmartRestore: () => {
            const d = window.appState.pendingRestoreData; if(!d) return;
            const doProg = document.getElementById('restore-opt-progress').checked;
            const doSched = document.getElementById('restore-opt-schedule').checked;
            const doSet = document.getElementById('restore-opt-settings').checked;
            if (doProg && d.w) {
                let targetPlan = doSched && d.p ? d.p : appData;
                let targetExMap = new Map();
                targetPlan.weeks.forEach(w => w.schedule.forEach(day => {
                    if (day.exercises) day.exercises.forEach(ex => { targetExMap.set(ex.name, ex.muscle); });
                }));
                let targetExData = Array.from(targetExMap.entries()).map(([name, muscle]) => ({name, muscle})).sort((a,b) => a.name.localeCompare(b.name));
                window.appState.mappingConfig = { d, doSched, doSet, targetExData };
                window.appActions.closeRestoreModal();
                setTimeout(() => window.appActions.openMappingModal(), 350);
            } else {
                window.appActions.finishRestore(false, doSched, doSet, d);
            }
        },
        openMappingModal: () => {
            const { d, targetExData } = window.appState.mappingConfig;
            const ml = document.getElementById('mapping-list');
            let html = '';
            const getBroadGroup = (m) => {
                m = (m||'').toLowerCase();
                if (m.includes('leg') || m.includes('quad') || m.includes('ham') || m.includes('calf') || m.includes('calves') || m.includes('glute')) return 'legs';
                if (m.includes('chest') || m.includes('shoulder') || m.includes('delt') || m.includes('tricep') || m.includes('push') || m.includes('pec')) return 'push';
                if (m.includes('back') || m.includes('lat') || m.includes('trap') || m.includes('bicep') || m.includes('pull') || m.includes('rear') || m.includes('row')) return 'pull';
                if (m.includes('abs') || m.includes('core')) return 'core';
                return 'all';
            };
            Object.keys(d.w).forEach(oldKey => {
                let readable = oldKey.replace('global_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                let oldMuscle = 'Unknown';
                if (d.p && d.p.weeks) {
                    d.p.weeks.forEach(w => w.schedule.forEach(day => {
                        if (day.exercises) day.exercises.forEach(ex => { if (getExKey('','','',ex.name) === oldKey) oldMuscle = ex.muscle; });
                    }));
                }
                if (oldMuscle === 'Unknown') {
                    if (readable.match(/leg|squat|calf|calves|ham|glute/i)) oldMuscle = 'Legs';
                    else if (readable.match(/chest|press|pushdown|tricep|fly|delt|shoulder/i)) oldMuscle = 'Chest';
                    else if (readable.match(/row|pull|bicep|curl|back|lat/i)) oldMuscle = 'Back';
                }
                let oldGroup = getBroadGroup(oldMuscle);
                let filteredTargets = targetExData;
                if (oldGroup !== 'all') {
                    let matches = targetExData.filter(tx => getBroadGroup(tx.muscle) === oldGroup);
                    if (matches.length > 0) filteredTargets = matches;
                }
                let autoMatch = '';
                let tKeyMatch = filteredTargets.find(tx => getExKey('','','',tx.name) === oldKey);
                if(tKeyMatch) autoMatch = tKeyMatch.name;
                let opts = `<option value="SKIP" ${!autoMatch ? 'selected' : ''}>${t('-- Skip (Do Not Import) --')}</option>`;
                filteredTargets.forEach(tx => { opts += `<option value="${esc(tx.name)}" ${autoMatch === tx.name ? 'selected' : ''}>${esc(tx.name)}</option>`; });
                html += `<div class="bg-black/40 p-3 rounded-xl border border-white/5 mb-3 last:mb-0"><div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pb-1 border-b border-white/5 flex justify-between items-center"><span class="truncate pe-2">${t('Old:')} ${esc(readable)}</span><span class="text-[8px] text-[#d4af37] bg-[#d4af37]/10 px-1.5 py-0.5 rounded shadow-sm shrink-0 border border-[#d4af37]/20">${esc(t(oldGroup.toUpperCase()))}</span></div><select id="map_${esc(oldKey)}" class="w-full bg-black/60 p-2.5 rounded-lg text-[12px] font-bold text-white outline-none cursor-pointer border border-white/10 tap-feedback">${opts}</select></div>`;
            });
            ml.innerHTML = html || `<div class="text-center text-[10px] font-bold text-slate-500 uppercase py-4">${t('No exercises found')}</div>`;
            openModal('smart-mapping-overlay','smart-mapping-box');
        },
        closeMappingModal: () => {
            closeModal('smart-mapping-overlay','smart-mapping-box');
        },
        executeMappedMerge: () => {
            const { d, doSched, doSet } = window.appState.mappingConfig;
            let currW = StorageManager.get(), currH = StorageManager.getHistory();
            Object.keys(d.w).forEach(oldKey => {
                const sel = document.getElementById(`map_${oldKey}`);
                if(sel && sel.value !== 'SKIP') {
                    const newKey = getExKey('','','',sel.value);
                    currW[newKey] = d.w[oldKey];
                    let oldHist = (d.h && d.h[oldKey]) || [];
                    if(oldHist.length > 0) {
                        let mergedH = [...(currH[newKey] || []), ...oldHist];
                        let unique = [];
                        let seen = new Set();
                        mergedH.forEach(item => {
                            let str = `${item.d}_${item.w}`;
                            if(!seen.has(str)) { seen.add(str); unique.push(item); }
                        });
                        currH[newKey] = unique;
                    }
                }
            });
            StorageManager.set(currW); StorageManager.setHistory(currH); loggedWeights = currW;
            window.appActions.closeMappingModal();
            window.appActions.finishRestore(true, doSched, doSet, d);
        },
        finishRestore: (didProg, doSched, doSet, d) => {
            let count = didProg ? 1 : 0;
            if (doSched && d.p) {
                const iP = d.p; // already cleaned by sanitizePlan when the file was opened
                // Only use the saved active week if it really exists in this routine
                currentWeekId = (d.aw && iP.weeks.some(w => w.id === d.aw)) ? d.aw : iP.weeks[0].id;
                StorageManager.setActiveWeek(currentWeekId);
                StorageManager.setPlan(iP); appData = iP; count++;
                // add the backup's own exercises to this phone's list
                const cx = getCustomEx(); (d.cx || []).forEach(x => { if (!cx.some(y => y.name.toLowerCase() === x.name.toLowerCase())) cx.push(x); }); setCustomEx(cx);
            }
            if (doSet && d.s) { 
                const aD=DAY_NAMES, idx=aD.indexOf(d.s);
                if (d.rt) { StorageManager.setRestSeconds(d.rt); const rs = document.getElementById('setting-rest'); if (rs) rs.value = String(d.rt); }
                if(idx!==-1){ StorageManager.setStartDay(d.s); appData.weeks.forEach(w=>w.schedule.forEach((dDay,i)=>dDay.day=aD[(idx+i)%7])); document.getElementById('setting-start-day').value = d.s; }
                count++; 
            }
            if (count > 0) { StorageManager.setPlan(appData); activeDay = getTodayId(); renderNav(); window.appActions.refreshUI(); window.appActions.showToast(t("Data Merged Successfully!"), "success"); }
            if(!didProg) window.appActions.closeRestoreModal();
    },
    restoreDefaults: () => { window.appActions.showConfirm(t("Reset app"),t("Your routines go back to the default. Your history is kept."),()=>{const aD=DAY_NAMES, sI=aD.indexOf('SAT'); const def=JSON.parse(JSON.stringify(defaultWorkoutData)); def.forEach((d,i)=>d.day=aD[(sI+i)%7]); appData={weeks:[{id:'w_default',name:t('Main Routine'),schedule:def}]}; currentWeekId='w_default'; StorageManager.setActiveWeek('w_default'); StorageManager.setPlan(appData); StorageManager.setStartDay('SAT'); document.getElementById('setting-start-day').value='SAT'; activeDay=getTodayId(); renderNav(); window.appActions.refreshUI(); window.appActions.showToast(t("Reset Complete"));},true); },
        // ---------- First-launch setup (also from Profile → Set up again) ----------
        initOnboarding: () => { if (!StorageManager.getOnboard()) window.appActions.startWizard(true); },
        startWizard: (firstRun = false) => {
            let hasLang = false; try { hasLang = localStorage.getItem(LANG_KEY) !== null; } catch (e) {}
            const pr = getProfile();
            window.appState.wiz = { firstRun, steps: [...(hasLang ? [] : ['lang']), 'goal', 'days', 'exp', 'eq', 'start', 'result'], step: 0,
                goal: pr.goal || null, days: pr.days || null, exp: pr.exp || null, eq: pr.eq || null, showAll: false };
            window.appActions.renderWizard();
            openModal('onboarding-overlay', 'onboarding-box');
        },
        renderWizard: () => {
            const W = window.appState.wiz, key = W.steps[W.step];
            const opt = (val, title, sub, icon, cur) => `<button onclick="window.appActions.wizChoose(${jsArg(key)}, ${jsArg(val)})" class="w-full flex items-center gap-4 p-4 mb-3 rounded-2xl border text-start tap-feedback ${cur === val ? 'bg-[#d4af37]/15 border-[#d4af37]' : 'bg-white/5 border-white/10'}">
                ${icon ? `<span class="w-11 h-11 shrink-0 rounded-xl bg-black/40 flex items-center justify-center text-[#d4af37]"><i data-lucide="${icon}" class="w-5 h-5"></i></span>` : ''}
                <span class="flex-1 min-w-0"><span class="block text-[16px] font-black text-white">${title}</span>${sub ? `<span class="block text-[12px] font-bold text-slate-400 mt-0.5">${sub}</span>` : ''}</span>
                <i data-lucide="chevron-right" class="w-5 h-5 text-slate-600 shrink-0"></i></button>`;
            const head = (title, sub) => `<h2 class="text-[26px] font-black text-white leading-tight mb-2">${title}</h2><p class="text-[13px] font-bold text-slate-400 mb-6">${sub}</p>`;
            let body = '';
            if (key === 'lang') body = `<div class="text-center mb-8 mt-6"><div class="text-4xl font-black italic tracking-tighter text-white" dir="ltr">APEX <span class="text-[#d4af37]">LIFT</span></div></div>` + head('Choose your language · اختر لغتك', '') + opt('en', 'English', '', 'languages', LANG) + opt('ar', 'العربية', '', 'languages', LANG);
            if (key === 'goal') body = head(t("What's your main goal?"), t('We use this to suggest a program. You can change it anytime.'))
                + opt('muscle', t('Build muscle'), t('Get bigger and more defined'), 'dumbbell', W.goal) + opt('strength', t('Get stronger'), t('Lift heavier on the big lifts'), 'trophy', W.goal) + opt('fat', t('Lose fat'), t('Stay strong while you lean out'), 'flame', W.goal);
            if (key === 'days') body = head(t('How many days a week can you train?'), t('Pick what you can keep up every week.'))
                + ['3', '4', '5', '6'].map(d => opt(d, t('{n} days', { n: d }), '', 'calendar-days', W.days)).join('');
            if (key === 'exp') body = head(t('How long have you been training?'), t('This sets how many sets you start with.'))
                + opt('new', t('Less than 1 year'), t('Fewer sets to start'), 'sprout', W.exp) + opt('mid', t('1 to 3 years'), t('Standard sets'), 'trending-up', W.exp) + opt('adv', t('More than 3 years'), t('Extra sets on the main lifts'), 'flame', W.exp);
            if (key === 'eq') body = head(t('Where do you train?'), '')
                + opt('gym', t('Full gym'), t('Barbells, machines and cables'), 'building-2', W.eq) + opt('db', t('Dumbbells only'), t('Home or a small gym'), 'dumbbell', W.eq);
            if (key === 'start') body = head(t('Which day does your week start?'), t('Your week in the app starts on this day.'))
                + ['SAT', 'SUN', 'MON'].map(d => opt(d, esc(dayLong(d)), '', 'calendar', StorageManager.getStartDay())).join('');
            if (key === 'result') {
                const rec = PROGRAMS.find(p => p.id === recommendProgram(W)), pick = PROGRAMS.find(p => p.id === (W.pick || rec.id));
                const card = (p, isRec) => `<button onclick="window.appActions.wizPick(${jsArg(p.id)})" class="w-full text-start p-4 mb-3 rounded-2xl border tap-feedback ${pick.id === p.id ? 'bg-[#d4af37]/10 border-[#d4af37]' : 'bg-white/5 border-white/10'}">
                    <span class="flex items-center justify-between gap-2"><span class="text-[16px] font-black text-white">${esc(t(p.name))}</span><span class="text-[11px] font-black text-slate-400 shrink-0">${t('{n} days', { n: p.days })}</span></span>
                    ${isRec ? `<span class="inline-block mt-1 text-[10px] font-black uppercase tracking-widest text-[#22c55e]">★ ${t('Recommended for you')}</span>` : ''}
                    <span class="block text-[12px] font-bold text-slate-400 mt-1">${esc(t(p.desc))}</span>${pick.id === p.id ? programPreviewHTML(p) : ''}</button>`;
                const others = PROGRAMS.filter(p => p.id !== rec.id).sort((a, b) => (b.days === parseInt(W.days)) - (a.days === parseInt(W.days)));
                body = head(t('Your program'), t('Tap a program to see its week.')) + card(rec, true)
                    + (W.showAll ? `<div class="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-5 mb-2">${t('Other programs')}</div>` + others.map(p => card(p, false)).join('')
                        : `<button onclick="window.appState.wiz.showAll=true;window.appActions.renderWizard()" class="w-full py-3 mb-3 rounded-xl bg-white/5 border border-white/10 text-[12px] font-black uppercase tracking-widest text-slate-300 tap-feedback">${t('See all {n} programs', { n: PROGRAMS.length })}</button>`)
                    + `<div class="sticky bottom-0 pt-3 pb-1 bg-[#050505]"><button onclick="window.appActions.wizFinish('program')" class="w-full py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-black uppercase tracking-widest tap-feedback">${t('Start with this program')}</button>
                       <button onclick="window.appActions.wizFinish('own')" class="w-full py-3 mt-1 text-[12px] font-black uppercase tracking-widest text-slate-400 tap-feedback">${t("I'll build my own")}</button></div>`;
            }
            const dots = W.steps.map((_, i) => `<span class="h-1.5 rounded-full transition-all ${i === W.step ? 'w-6 bg-[#d4af37]' : i < W.step ? 'w-3 bg-[#d4af37]/50' : 'w-3 bg-white/15'}"></span>`).join('');
            document.getElementById('onboarding-box').innerHTML = `
                <div class="flex items-center justify-between py-4 shrink-0">
                    <button onclick="window.appActions.wizBack()" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-300 tap-feedback ${W.step === 0 ? 'invisible' : ''}" aria-label="Back"><i data-lucide="arrow-left" class="w-5 h-5"></i></button>
                    <div class="flex gap-1.5" dir="ltr">${dots}</div>
                    <button onclick="window.appActions.wizFinish('skip')" class="text-[11px] font-black uppercase tracking-widest text-slate-500 tap-feedback ${key === 'lang' || key === 'result' ? 'invisible' : ''}">${t('Skip')}</button>
                </div>
                <div class="flex-1 fade-in">${body}</div>`;
            if (window.lucide) window.lucide.createIcons({ root: document.getElementById('onboarding-box') });
            document.getElementById('onboarding-box').scrollTop = 0;
        },
        wizChoose: (key, val) => {
            const W = window.appState.wiz;
            if (key === 'lang') {
                writeItem(LANG_KEY, val);
                if (val !== LANG) return location.reload(); // the setup continues in the chosen language
            } else if (key === 'start') {
                const idx = DAY_NAMES.indexOf(val);
                StorageManager.setStartDay(val);
                appData.weeks.forEach(w => w.schedule.forEach((d, i) => d.day = DAY_NAMES[(idx + i) % 7]));
                StorageManager.setPlan(appData);
                const sel = document.getElementById('setting-start-day'); if (sel) sel.value = val;
                activeDay = getTodayId();
            } else W[key] = val;
            W.pick = null;
            W.step = Math.min(W.step + 1, W.steps.length - 1);
            window.appActions.renderWizard();
        },
        wizBack: () => { const W = window.appState.wiz; if (W.step > 0) { W.step--; window.appActions.renderWizard(); } },
        wizPick: id => { window.appState.wiz.pick = id; window.appActions.renderWizard(); },
        // program = use the chosen program, own = start with empty days, skip = keep things as they are
        wizFinish: mode => {
            const W = window.appState.wiz;
            writeItem(PROFILE_KEY, JSON.stringify({ goal: W.goal, days: W.days, exp: W.exp, eq: W.eq }));
            StorageManager.setOnboard();
            closeModal('onboarding-overlay', 'onboarding-box', 300);
            if (mode === 'program') {
                const id = W.pick || recommendProgram(W);
                window.appActions.applyProgram(id, { exp: W.exp, replace: W.firstRun });
            } else if (mode === 'own') {
                const empty = DAY_NAMES.map((_, i) => ({ id: i + 1, day: DAY_NAMES[(DAY_NAMES.indexOf(StorageManager.getStartDay()) + i) % 7], title: 'New Day', isRest: false, recoveryType: null, savedTitle: '', exercises: [] }));
                if (W.firstRun || appData.weeks.length >= 5) { const w = appData.weeks.find(x => x.id === currentWeekId); w.schedule = empty; w.name = t('My routine'); }
                else { const id = 'w_' + Date.now(); appData.weeks.push({ id, name: t('My routine'), schedule: empty }); currentWeekId = id; StorageManager.setActiveWeek(id); }
                StorageManager.setPlan(appData);
                window.appActions.switchTab('plan');
            }
        },
        // Put a program into the app: as a new routine (keeps your current one) or replacing the current one
        applyProgram: (id, { exp = (getProfile().exp || 'mid'), replace = false } = {}) => {
            const prog = PROGRAMS.find(p => p.id === id); if (!prog) return;
            const schedule = programSchedule(prog, exp);
            if (replace || appData.weeks.length >= 5) { const w = appData.weeks.find(x => x.id === currentWeekId); w.schedule = schedule; w.name = t(prog.name); }
            else { const wid = 'w_' + Date.now(); appData.weeks.push({ id: wid, name: t(prog.name), schedule }); currentWeekId = wid; StorageManager.setActiveWeek(wid); }
            StorageManager.setPlan(appData);
            activeDay = getTodayId();
            window.appActions.switchTab('today');
            window.appActions.showToast(t('{name} is ready', { name: t(prog.name) }), 'success');
        },
        // ---------- Program gallery (Plan → Programs) ----------
        openPrograms: () => {
            window.appState.progPick = null;
            window.appActions.renderPrograms();
            openSheet('programs-overlay', 'programs-box');
            pushBack('programs', () => window.appActions.closePrograms());
        },
        closePrograms: () => { popBack('programs'); closeSheet('programs-overlay', 'programs-box'); },
        renderPrograms: () => {
            const pick = window.appState.progPick, full = appData.weeks.length >= 5;
            document.getElementById('programs-list').innerHTML = PROGRAMS.map(p => `<div class="mx-4 mb-3 p-4 rounded-2xl border ${pick === p.id ? 'bg-[#d4af37]/10 border-[#d4af37]' : 'bg-white/5 border-white/10'}">
                <button onclick="window.appState.progPick=${jsArg(p.id)};window.appActions.renderPrograms()" class="w-full text-start tap-feedback">
                    <span class="flex items-center justify-between gap-2"><span class="text-[16px] font-black text-white">${esc(t(p.name))}</span><span class="text-[11px] font-black text-slate-400 shrink-0">${t('{n} days', { n: p.days })}${p.eq === 'db' ? ' · ' + t('Dumbbells only') : ''}</span></span>
                    <span class="block text-[12px] font-bold text-slate-400 mt-1">${esc(t(p.desc))}</span>
                </button>
                ${pick === p.id ? programPreviewHTML(p) + `<button onclick="window.appActions.useProgram(${jsArg(p.id)})" class="w-full mt-3 py-3 rounded-xl bg-[#d4af37] text-black text-[12px] font-black uppercase tracking-widest tap-feedback">${full ? t('Replace current routine') : t('Add as a new routine')}</button>` : ''}
            </div>`).join('') + `<p class="mx-6 mb-6 text-[11px] font-bold text-slate-500">${t('Your current routine and all your history are kept.')}</p>`;
        },
        useProgram: id => {
            const go = () => { window.appActions.closePrograms(); window.appActions.applyProgram(id, { replace: appData.weeks.length >= 5 }); };
            if (appData.weeks.length >= 5) window.appActions.showConfirm(t('Replace current routine?'), t('You have 5 routines (the most). The current one will be replaced; your history is kept.'), go, true);
            else go();
        }
    };

    // ☁️ CLOUD BACKUP & SYNC (optional): sign in with Google; data is kept in Firebase (Firestore).
    // The phone stays the main copy and keeps working offline; the cloud mirrors it and brings it to your other phones.
    // Data layout: users/{uid} = routines + settings, users/{uid}/history/{exercise} = that exercise's logs.
    // Security rules (only you can read/write your data) are in firestore.rules — paste them into Firebase.
    const FIREBASE_CONFIG = {
        apiKey: 'AIzaSyCItVZimtbvod94CGUfYx1xwgSTW_mEq0Y',
        // On the live site, sign-in runs through our own address (Netlify passes /__/auth/ on to Firebase, see _redirects),
        // so Google's sign-in screen shows apex-liftt.netlify.app instead of the firebaseapp.com address
        authDomain: location.hostname === 'apex-liftt.netlify.app' ? location.host : 'apex-lift-52a18.firebaseapp.com',
        projectId: 'apex-lift-52a18',
        storageBucket: 'apex-lift-52a18.firebasestorage.app',
        messagingSenderId: '682655190858',
        appId: '1:682655190858:web:70d756fba8e17de80cbbb3'
    };
    const FB_DIR = 'vendor/firebase-12.19.0/';
    const CLOUD_KEY = 'workoutCloud_rakan_final', CLOUD_LASTUID = 'workoutCloudLastUid_rakan_final', LOCAL_UPDATED_KEY = 'workoutLocalUpdated_rakan_final';
    const MAIN_KEYS = new Set([StorageManager.PLAN_KEY, StorageManager.ACTIVE_WEEK, StorageManager.START_KEY, StorageManager.REST_KEY, StorageManager.RPE_KEY, StorageManager.KEY, CUSTOM_KEY, PROFILE_KEY]);
    const Cloud = { err: '', status: 'off', user: null, auth: null, db: null, unsub: [], sent: {}, timer: null, flushing: false, again: false, applying: false, lastSync: 0, loading: null };
    const getCloudFlag = () => { const v = readJSON(CLOUD_KEY, null); return isObj(v) ? v : null; };
    const loadScript = src => new Promise((ok, fail) => { const el = document.createElement('script'); el.src = src; el.onload = ok; el.onerror = () => fail(new Error('Could not load ' + src)); document.head.appendChild(el); });
    // Firebase is only downloaded when someone uses sign-in, so the app stays fast for everyone else
    const loadFirebase = () => Cloud.loading || (Cloud.loading = (async () => {
        if (!window.firebase) await loadScript(FB_DIR + 'firebase-app-compat.js');
        if (!firebase.auth) await loadScript(FB_DIR + 'firebase-auth-compat.js');
        if (!firebase.firestore) await loadScript(FB_DIR + 'firebase-firestore-compat.js');
        if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
        Cloud.auth = firebase.auth(); Cloud.db = firebase.firestore();
        try { await Cloud.db.enablePersistence({ synchronizeTabs: true }); } catch (e) { /* private mode or another tab: still works online */ }
        Cloud.auth.getRedirectResult().catch(e => window.appActions.showToast(cloudErrorText(e), 'error'));
        Cloud.auth.onAuthStateChanged(u => { if (u) cloudSignedIn(u); else cloudSignedOut(); });
    })().catch(e => { Cloud.loading = null; throw e; }));
    const cloudErrorText = e => {
        const c = (e && e.code) || '';
        if (c === 'auth/unauthorized-domain') return t('This website is not allowed in Firebase yet (Authentication → Settings → Authorized domains).');
        if (c === 'auth/network-request-failed' || /load/i.test((e && e.message) || '')) return t('No internet connection. Try again when online.');
        return t('Sign-in failed. Please try again.') + (c ? ` (${c})` : '');
    };
    const setCloudStatus = (st, e, step) => { Cloud.status = st; Cloud.err = st === 'error' ? [((e && e.code) || '').replace(/^firestore\//, ''), step].filter(Boolean).join(', ') : ''; renderAccount(); };
    const scheduleFlush = (ms = 1500) => { if (!Cloud.user) return; clearTimeout(Cloud.timer); Cloud.timer = setTimeout(cloudFlush, ms); };
    cloudTouch = key => {
        if (MAIN_KEYS.has(key)) { try { localStorage.setItem(LOCAL_UPDATED_KEY, String(Date.now())); } catch (e) {} }
        if (Cloud.user && !Cloud.applying && (MAIN_KEYS.has(key) || key === StorageManager.HIST_KEY)) scheduleFlush();
    };
    // What the phone has (routines + settings), in a form Firestore accepts
    const collectMain = () => JSON.parse(JSON.stringify({
        plan: appData, activeWeek: currentWeekId, startDay: StorageManager.getStartDay(), rest: StorageManager.getRestSeconds(),
        showRpe: StorageManager.getShowRpe(), weights: StorageManager.get(), custom: getCustomEx(), profile: getProfile()
    }));
    // Put cloud routines + settings onto this phone
    const applyMain = m => {
        Cloud.applying = true;
        try {
            const plan = sanitizePlan(m.plan);
            if (plan) {
                appData = plan; StorageManager.setPlan(plan);
                currentWeekId = plan.weeks.some(w => w.id === m.activeWeek) ? m.activeWeek : plan.weeks[0].id;
                StorageManager.setActiveWeek(currentWeekId);
            }
            if (DAY_NAMES.includes(m.startDay)) StorageManager.setStartDay(m.startDay);
            StorageManager.setRestSeconds(m.rest);
            StorageManager.setShowRpe(m.showRpe === true);
            if (isObj(m.weights)) { loggedWeights = sanitizeValueMap(m.weights); StorageManager.set(loggedWeights); }
            setCustomEx(sanitizeCustomEx(m.custom));
            if (isObj(m.profile)) writeItem(PROFILE_KEY, JSON.stringify(m.profile));
            localStorage.setItem(LOCAL_UPDATED_KEY, String(m.updatedAt || Date.now()));
        } finally { Cloud.applying = false; }
        refreshAfterCloud();
    };
    const refreshAfterCloud = () => {
        const sd = document.getElementById('setting-start-day'); if (sd) sd.value = StorageManager.getStartDay();
        const rs = document.getElementById('setting-rest'); if (rs) rs.value = String(StorageManager.getRestSeconds());
        const rp = document.getElementById('setting-rpe'); if (rp) rp.checked = StorageManager.getShowRpe();
        renderNav(); renderWorkout();
    };
    // Combine two lists of logs without duplicates (same time, weight and reps = same log)
    const logSig = l => `${logTime(l)}|${l.w}|${Array.isArray(l.s) ? l.s.join(',') : l.s}`;
    const mergeLogs = (a, b) => {
        const m = new Map(); [...(a || []), ...(b || [])].forEach(l => m.set(logSig(l), l));
        return [...m.values()].sort((x, y) => (logTime(x) || 0) - (logTime(y) || 0)).slice(-150);
    };
    const histPath = (uid, k) => `users/${uid}/history/${encodeURIComponent(k)}`;

    // First time on this phone: merge the phone's workouts with the cloud's, then keep both in step
    const cloudSignedIn = async user => {
        const prevUid = localStorage.getItem(CLOUD_LASTUID);
        Cloud.user = user;
        writeItem(CLOUD_KEY, JSON.stringify({ uid: user.uid, name: user.displayName || '', email: user.email || '', photo: user.photoURL || '' }));
        setCloudStatus('syncing');
        try {
            const uid = user.uid;
            const [snap, hs] = await Promise.all([Cloud.db.doc(`users/${uid}`).get(), Cloud.db.collection(`users/${uid}/history`).get()]);
            const cloudHist = {};
            hs.forEach(d => { const x = d.data(); if (x && Array.isArray(x.logs)) cloudHist[decodeURIComponent(d.id)] = x.logs; });
            // workouts: keep everything from both sides
            const local = StorageManager.getHistory(), clean = sanitizeHistory(cloudHist), merged = { ...local };
            Object.keys(clean).forEach(k => { merged[k] = mergeLogs(local[k], clean[k]); });
            Cloud.applying = true; StorageManager.setHistory(merged); Cloud.applying = false;
            // routines + settings: the account wins on a new phone, otherwise the newest change wins
            if (snap.exists) {
                const m = snap.data(), localU = Number(localStorage.getItem(LOCAL_UPDATED_KEY)) || 0;
                if (prevUid !== uid || (m.updatedAt || 0) > localU) applyMain(m);
            }
            Cloud.sent = {};
            Object.keys(clean).forEach(k => { Cloud.sent['h:' + k] = JSON.stringify(clean[k]); });
            localStorage.setItem(CLOUD_LASTUID, uid);
            refreshAfterCloud();
            await cloudFlush();
            cloudSubscribe(uid);
        } catch (e) { console.warn('Cloud sync failed', e); setCloudStatus('error', e, 'read'); }
    };
    // Upload whatever changed since the last upload
    const cloudFlush = async () => {
        if (!Cloud.user) return;
        if (Cloud.flushing) { Cloud.again = true; return; }
        Cloud.flushing = true; clearTimeout(Cloud.timer);
        let slow = null;
        try {
            const uid = Cloud.user.uid, ops = [];
            const main = collectMain(), mj = JSON.stringify(main);
            if (mj !== Cloud.sent.main) { ops.push(['set', `users/${uid}`, { ...main, updatedAt: Number(localStorage.getItem(LOCAL_UPDATED_KEY)) || Date.now() }]); Cloud.sent.main = mj; }
            const h = StorageManager.getHistory();
            Object.keys(h).forEach(k => { const j = JSON.stringify(h[k]); if (j !== Cloud.sent['h:' + k]) { ops.push(['set', histPath(uid, k), { logs: h[k], updatedAt: Date.now() }]); Cloud.sent['h:' + k] = j; } });
            Object.keys(Cloud.sent).filter(x => x.startsWith('h:') && !(x.slice(2) in h)).forEach(x => { ops.push(['delete', histPath(uid, x.slice(2))]); delete Cloud.sent[x]; });
            if (ops.length) {
                setCloudStatus(navigator.onLine === false ? 'offline' : 'syncing');
                // weak gym signal: the change is already saved on the phone, it just hasn't reached the cloud yet
                slow = setTimeout(() => { if (Cloud.flushing && navigator.onLine === false) setCloudStatus('offline'); }, 5000);
                for (let i = 0; i < ops.length; i += 400) {
                    const b = Cloud.db.batch();
                    ops.slice(i, i + 400).forEach(([op, path, data]) => op === 'set' ? b.set(Cloud.db.doc(path), JSON.parse(JSON.stringify(data))) : b.delete(Cloud.db.doc(path)));
                    await b.commit(); // offline: waits here and finishes when the phone is back online
                }
            }
            Cloud.lastSync = Date.now(); setCloudStatus('synced');
        } catch (e) { console.warn('Cloud upload failed', e); Cloud.sent = {}; setCloudStatus('error', e, 'save'); }
        finally { clearTimeout(slow); Cloud.flushing = false; if (Cloud.again) { Cloud.again = false; scheduleFlush(300); } }
    };
    // Live updates from your other phones
    const cloudSubscribe = uid => {
        Cloud.unsub.forEach(u => u()); Cloud.unsub = [];
        Cloud.unsub.push(Cloud.db.doc(`users/${uid}`).onSnapshot(snap => {
            if (!snap.exists || snap.metadata.hasPendingWrites) return;
            const m = snap.data(), localU = Number(localStorage.getItem(LOCAL_UPDATED_KEY)) || 0;
            if ((m.updatedAt || 0) > localU) { applyMain(m); Cloud.sent.main = JSON.stringify(collectMain()); }
        }, e => console.warn(e)));
        Cloud.unsub.push(Cloud.db.collection(`users/${uid}/history`).onSnapshot(qs => {
            const h = StorageManager.getHistory(); let changed = false;
            qs.docChanges().forEach(ch => {
                if (ch.doc.metadata.hasPendingWrites) return; // our own upload coming back
                const k = decodeURIComponent(ch.doc.id), mine = JSON.stringify(h[k] || null), unsynced = h[k] && mine !== Cloud.sent['h:' + k];
                if (ch.type === 'removed') { if (h[k] && !unsynced) { delete h[k]; changed = true; } delete Cloud.sent['h:' + k]; return; }
                const logs = sanitizeHistory({ [k]: (ch.doc.data() || {}).logs })[k] || [];
                const next = unsynced ? mergeLogs(h[k], logs) : logs;
                if (JSON.stringify(next) !== mine) { h[k] = next; changed = true; }
                Cloud.sent['h:' + k] = JSON.stringify(logs);
            });
            if (changed) { Cloud.applying = true; StorageManager.setHistory(h); Cloud.applying = false; refreshAfterCloud(); scheduleFlush(); }
        }, e => console.warn(e)));
    };
    const cloudSignedOut = () => {
        Cloud.unsub.forEach(u => u()); Cloud.unsub = []; Cloud.user = null; Cloud.sent = {};
        try { localStorage.removeItem(CLOUD_KEY); } catch (e) {}
        setCloudStatus('off');
    };
    window.addEventListener('online', () => { if (Cloud.user) scheduleFlush(200); });
    window.addEventListener('offline', () => { if (Cloud.user) setCloudStatus('offline'); });

    // Profile → account card
    const GOOGLE_G = '<svg viewBox="0 0 48 48" class="w-5 h-5" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
    const renderAccount = () => {
        const el = document.getElementById('account-card'); if (!el) return;
        const flag = getCloudFlag(), u = Cloud.user || (flag && flag.uid ? flag : null);
        if (!u) {
            el.innerHTML = `<div class="glass-card p-5 border border-white/10">
                <div class="flex items-center gap-3 mb-3"><span class="w-11 h-11 rounded-full bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center shrink-0"><i data-lucide="cloud" class="w-6 h-6"></i></span>
                <div><div class="text-[16px] font-black text-white">${t('Back up & sync')}</div><div class="text-[12px] font-bold text-slate-400 leading-snug">${t('Sign in to keep your workouts safe in the cloud and use them on any phone.')}</div></div></div>
                <button onclick="window.appActions.cloudSignIn()" ${Cloud.status === 'loading' ? 'disabled' : ''} class="w-full py-3.5 rounded-xl bg-white text-[#1f1f1f] text-[14px] font-bold flex items-center justify-center gap-3 tap-feedback disabled:opacity-60">${GOOGLE_G}${Cloud.status === 'loading' ? t('Signing in…') : t('Continue with Google')}</button>
                <a href="privacy.html" target="_blank" rel="noopener" class="block text-center text-[11px] font-bold text-slate-500 mt-3 underline">${t('Privacy policy')}</a></div>`;
        } else {
            const name = u.displayName || u.name || '', email = u.email || '', photo = u.photoURL || u.photo || '';
            const st = { off: ['bg-slate-500', t('Connecting…')], loading: ['bg-slate-500', t('Connecting…')], syncing: ['bg-[#d4af37] animate-pulse', t('Syncing…')],
                synced: ['bg-[#22c55e]', t('Synced · {time}', { time: Cloud.lastSync ? new Intl.DateTimeFormat(isAR ? 'ar' : 'en-GB', { hour: 'numeric', minute: '2-digit', numberingSystem: 'latn' }).format(Cloud.lastSync) : '' })],
                offline: ['bg-slate-400', t('Offline · will sync when online')], error: ['bg-red-500', t('Sync problem · tap Sync now') + (Cloud.err ? ` (${Cloud.err})` : '')] }[Cloud.status] || ['bg-slate-500', ''];
            el.innerHTML = `<div class="glass-card p-5 border border-[#22c55e]/25">
                <div class="flex items-center gap-3">
                    ${photo ? `<img src="${esc(photo)}" alt="" referrerpolicy="no-referrer" class="w-12 h-12 rounded-full object-cover shrink-0">` : `<span class="w-12 h-12 rounded-full bg-[#d4af37] text-black text-[18px] font-black flex items-center justify-center shrink-0">${esc((name || email || '?').charAt(0).toUpperCase())}</span>`}
                    <div class="min-w-0 flex-1"><div class="text-[16px] font-black text-white truncate">${esc(name || email)}</div><div class="text-[11px] font-bold text-slate-400 truncate">${esc(email)}</div>
                    <div class="flex items-center gap-1.5 mt-1"><span class="w-2 h-2 rounded-full ${st[0]}"></span><span class="text-[11px] font-bold text-slate-300">${esc(st[1])}</span></div></div>
                </div>
                <div class="grid grid-cols-2 gap-2 mt-4">
                    <button onclick="window.appActions.cloudSyncNow()" class="py-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-widest text-white tap-feedback flex items-center justify-center gap-1.5"><i data-lucide="refresh-cw" class="w-4 h-4"></i>${t('Sync now')}</button>
                    <button onclick="window.appActions.cloudSignOut()" class="py-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-widest text-slate-300 tap-feedback flex items-center justify-center gap-1.5"><i data-lucide="log-out" class="w-4 h-4"></i>${t('Sign out')}</button>
                </div>
                <div class="flex justify-between mt-3"><a href="privacy.html" target="_blank" rel="noopener" class="text-[11px] font-bold text-slate-500 underline">${t('Privacy policy')}</a><button onclick="window.appActions.cloudDelete()" class="text-[11px] font-bold text-red-400 underline tap-feedback">${t('Delete my account')}</button></div></div>`;
        }
        if (window.lucide) window.lucide.createIcons({ root: el });
        if (typeof updateBackupStatus === 'function') updateBackupStatus();
    };
    Object.assign(window.appActions, {
        cloudSignIn: async () => {
            setCloudStatus('loading');
            try { await loadFirebase(); } catch (e) { window.appActions.showToast(t('No internet connection. Try again when online.'), 'error'); return setCloudStatus('off'); }
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.setCustomParameters({ prompt: 'select_account' });
            try { await Cloud.auth.signInWithPopup(provider); }
            catch (e) {
                // Home-screen apps and some browsers block pop-ups: use a full-page sign-in instead
                if (['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment', 'auth/cancelled-popup-request'].includes(e.code)) {
                    writeItem(CLOUD_KEY, JSON.stringify({ pending: true }));
                    return Cloud.auth.signInWithRedirect(provider);
                }
                if (e.code !== 'auth/popup-closed-by-user') window.appActions.showToast(cloudErrorText(e), 'error');
                if (!Cloud.user) setCloudStatus('off');
            }
        },
        // if the first connection failed (no live updates yet), start over; otherwise just upload everything again
        cloudSyncNow: () => { if (!Cloud.user) return; if (!Cloud.unsub.length) return cloudSignedIn(Cloud.user); Cloud.sent = {}; cloudFlush(); },
        cloudSignOut: () => window.appActions.showConfirm(t('Sign out?'), t('Your workouts stay on this phone. Sign in again anytime to sync.'), async () => {
            try { await Promise.race([cloudFlush(), new Promise(r => setTimeout(r, 4000))]); } catch (e) {}
            Cloud.unsub.forEach(u => u()); Cloud.unsub = [];
            try { await Cloud.auth.signOut(); } catch (e) {}
            cloudSignedOut();
            window.appActions.showToast(t('Signed out'), 'success');
        }),
        cloudDelete: () => window.appActions.showConfirm(t('Delete your account?'), t('This deletes your cloud backup and your account. The workouts on this phone stay.'), async () => {
            if (!Cloud.user) return;
            setCloudStatus('syncing');
            try {
                const uid = Cloud.user.uid;
                Cloud.unsub.forEach(u => u()); Cloud.unsub = [];
                const qs = await Cloud.db.collection(`users/${uid}/history`).get(), paths = [];
                qs.forEach(d => paths.push(`users/${uid}/history/${d.id}`));
                paths.push(`users/${uid}`);
                for (let i = 0; i < paths.length; i += 400) { const b = Cloud.db.batch(); paths.slice(i, i + 400).forEach(x => b.delete(Cloud.db.doc(x))); await b.commit(); }
                try { await Cloud.auth.currentUser.delete(); }
                catch (e) {
                    if (e.code !== 'auth/requires-recent-login') throw e;
                    await Cloud.auth.currentUser.reauthenticateWithPopup(new firebase.auth.GoogleAuthProvider());
                    await Cloud.auth.currentUser.delete();
                }
                try { localStorage.removeItem(CLOUD_LASTUID); } catch (e) {}
                cloudSignedOut();
                window.appActions.showToast(t('Account deleted'), 'success');
            } catch (e) { console.warn(e); setCloudStatus('error', e); window.appActions.showToast(cloudErrorText(e), 'error'); }
        }, true)
    });

    // Apply the language to the fixed parts of the page (index.html) and set right-to-left for Arabic
    const applyStaticLanguage = () => {
        document.documentElement.lang = LANG;
        // Arabic uses the same layout as English (nothing is mirrored); only the text and font change
        document.documentElement.dir = 'ltr';
        document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
        document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
        document.querySelectorAll('#setting-start-day option').forEach(o => { o.textContent = tDay(o.value); });
        const ls = document.getElementById('setting-lang'); if (ls) ls.value = LANG;
    };
    applyStaticLanguage();
    window.appActions.switchTab('today');
    enableSwipeDown(document.getElementById('picker-box'), () => window.appActions.closePicker());
    enableSwipeDown(document.getElementById('history-modal-box'), () => window.appActions.closeHistoryModal());
    enableSwipeDown(document.getElementById('programs-box'), () => window.appActions.closePrograms());
    enableSwipeDown(document.getElementById('active-workout-box'), () => window.appActions.minimizeSession());
    // An unfinished Log/Focus session (e.g. the phone closed the app during rest) comes back minimized
    (() => {
        const dr = readJSON(SESSION_KEY, null);
        const ok = isObj(dr) && Array.isArray(dr.exercises) && dr.exercises.length && Array.isArray(dr.rows)
            && typeof dr.startedAt === 'number' && Date.now() - dr.startedAt < 12 * 3600000 && getActiveSchedule().some(d => d.id === dr.dayId);
        if (!ok) { clearSessionDraft(); return; }
        dr.exercises = dr.exercises.filter(isObj).slice(0, 40).map(x => ({ k: toStr(x.k), name: toStr(x.name), muscle: toStr(x.muscle), sets: parseInt(x.sets) || 1, repsStr: toStr(x.repsStr), timed: isTimed(toStr(x.repsStr)), offset: parseInt(x.offset) || 0, pw: toStr(x.pw), pr: parseInt(x.pr) || 8, sg: isObj(x.sg) && SUGG[x.sg.type] ? { type: x.sg.type, w: parseFloat(x.sg.w) || 0, r: parseInt(x.sg.r) || 0 } : null }));
        dr.rows = dr.rows.filter(isObj).slice(0, 200).map(r => ({ e: parseInt(r.e) || 0, w: toStr(r.w), r: toStr(r.r), rpe: toStr(r.rpe), done: r.done === true }));
        dr.title = toStr(dr.title);
        window.appActions.startWorkout(dr.dayId, dr);
    })();
    document.getElementById('setting-start-day').value = StorageManager.getStartDay();
    const rpeEl = document.getElementById('setting-rpe');
    if (rpeEl) rpeEl.checked = StorageManager.getShowRpe();
    const restEl = document.getElementById('setting-rest');
    if (restEl) restEl.value = String(StorageManager.getRestSeconds());

    // Backup reminder without pop-ups: red dot on the menu button + "Last backup" text in the menu
    const updateBackupStatus = () => {
        let lB = StorageManager.getBackupDate();
        if (!lB) { StorageManager.setBackupDate(); lB = Date.now(); }
        const days = Math.floor((Date.now() - lB) / 86400000), old = days >= 7 && !Cloud.user && !getCloudFlag();
        const dot = document.getElementById('backup-dot'); if (dot) dot.classList.toggle('hidden', !old);
        const age = document.getElementById('backup-age');
        if (age) { age.textContent = days < 1 ? t('Last backup: today') : t('Last backup: {n} days ago', { n: days }); age.className = `text-[10px] font-bold text-center mb-3 ${old ? 'text-red-400' : 'text-slate-500'}`; }
    };
    updateBackupStatus();
    renderAccount();
    if (getCloudFlag()) loadFirebase().catch(() => setCloudStatus('offline'));
    setTimeout(() => window.appActions.initOnboarding(), 500);
    // Coming back to the app on a new day: jump to today (unless a workout is open)
    let lastToday = getTodayId();
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState !== 'visible' || window.appState.sess) return;
        const now = getTodayId();
        if (now !== lastToday) { lastToday = now; activeDay = now; renderNav(); renderWorkout(); }
    });
    // 📶 OFFLINE SUPPORT: save a copy of the app on the phone (see sw.js)
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
        window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(err => console.warn('Offline mode unavailable:', err)));
    }
})();