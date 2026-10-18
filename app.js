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
        "Change exercise": "تغيير التمرين",
        "Custom": "مخصص",
        "Day options": "خيارات اليوم",
        "Custom reps, e.g. 5 or 6 - 8": "تكرار مخصص، مثلًا 5 أو 6 - 8",
        "Editing this day": "تعديل هذا اليوم",
        "Plan the whole week →": "خطط للأسبوع كاملًا ←",
        "Edit this day": "تعديل هذا اليوم",
        "This week": "هذا الأسبوع",
        "Empty": "فارغ",
        "Week order saved": "تم حفظ ترتيب الأسبوع",
        "Muscle balance": "توازن العضلات",
        "Sets per week": "مجموعات في الأسبوع",
        "Aim for about 10–20 sets a week for each muscle.": "الهدف تقريبًا 10–20 مجموعة أسبوعيًا لكل عضلة.",
        "Core": "البطن",
        "Duplicate routine": "تكرار الجدول",
        "{name} (copy)": "{name} (نسخة)",
        "Routine duplicated": "تم تكرار الجدول",
        "Tap a day to edit it. Hold ⋮⋮ and drag to move it to another day.": "اضغط على يوم لتعديله. اضغط مطولًا على ⋮⋮ واسحبه لنقله إلى يوم آخر.",
        "Tap ✏️ to change this day's exercises.": "اضغط ✏️ لتغيير تمارين هذا اليوم.",
        "Add exercises to start training on this day.": "أضف تمارين لتبدأ التمرين في هذا اليوم.",
        "Tap a day to edit it": "اضغط على يوم لتعديله",
        "Editing your schedule": "تعديل جدولك",
        "Changes here update your Today page": "التغييرات هنا تُحدّث صفحة اليوم",
        "More": "المزيد",
        "More day tools": "أدوات اليوم الأخرى",
        "Swap with another day": "تبديل مع يوم آخر",
        "Copy to another day": "نسخ إلى يوم آخر",
        "Same sets & reps for all": "نفس المجموعات والتكرارات للكل",
        "Clear this day": "مسح هذا اليوم",
        "Hold ⋮⋮ and drag to change the order": "اضغط مطولًا على ⋮⋮ واسحب لتغيير الترتيب",
        "Order saved": "تم حفظ الترتيب",
        "Drag to reorder": "اسحب لإعادة الترتيب",
        "Tap an exercise to edit it. Hold ⋮⋮ and drag to change the order.": "اضغط على التمرين لتعديله. اضغط مطولًا على ⋮⋮ واسحب لتغيير الترتيب.",
        "Change to {name}?": "التغيير إلى {name}؟",
        "{old} will be replaced with {sets} sets of {reps}.": "سيتم استبدال {old} بـ {sets} مجموعات × {reps}.",
        "Sets and reps": "المجموعات والتكرارات",
        "How many sets and reps for this exercise?": "كم مجموعة وتكرار لهذا التمرين؟",
        "Change": "تغيير",
        "Delete exercise": "حذف التمرين",
        "Program preview": "معاينة البرنامج",
        "All programs": "كل البرامج",
        "Level": "المستوى",
        "Beginner": "مبتدئ",
        "Intermediate": "متوسط",
        "Advanced": "متقدم",
        "Use this program": "استخدم هذا البرنامج",
        "It replaces your current routine. Your history is kept.": "سيحل محل جدولك الحالي. سجلك محفوظ.",
        "It is added as a new routine. Your current routine and history are kept.": "سيُضاف كجدول جديد. جدولك الحالي وسجلك محفوظان.",
        "{n} training days": "{n} أيام تمرين",
                "Day cleared": "تم مسح اليوم",
        "Change {name}": "تغيير {name}",
        "Changed to {name}": "تم التغيير إلى {name}",
        "{n} routines": "{n} جداول",
        "Day tools": "أدوات اليوم",
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
        "About you": "معلومات عنك",
        "Birth year": "سنة الميلاد",
        "Height (cm)": "الطول (سم)",
        "Weight (kg)": "الوزن (كجم)",
        "Sex": "الجنس",
        "Male": "ذكر",
        "Female": "أنثى",
        "Prefer not to say": "أفضّل عدم الذكر",
        "Apex Lift is for ages {n} and up.": "Apex Lift مخصص لمن أعمارهم {n} عامًا فأكثر.",
        "Optional. Used to tailor the app and to improve Apex Lift. Never sold or shared.": "اختياري. يُستخدم لتخصيص التطبيق وتطوير Apex Lift، ولا يُباع ولا يُشارك أبدًا.",
        "Body weight": "وزن الجسم",
        "Please check this number.": "يرجى التحقق من هذا الرقم.",
        "Optional. Helps the app fit you. You can change it anytime in Profile.": "اختياري. يساعد التطبيق على مناسبتك، ويمكنك تغييره في أي وقت من حسابي.",
        "Not now": "ليس الآن",
        "A copy of everything is saved in your account once a day. Restore one to go back to how things were.": "تُحفظ نسخة من كل بياناتك في حسابك مرة يوميًا. استرجع أي نسخة للعودة إلى ما كانت عليه.",
        "Account backups": "نسخ الحساب الاحتياطية",
        "Add more exercises from the full library here.": "أضف تمارين أخرى من المكتبة الكاملة من هنا.",
        "Automatic": "تلقائية",
        "Back up now": "انسخ الآن",
        "Backup restored": "تم استرجاع النسخة",
        "Backup saved to your account": "تم حفظ النسخة في حسابك",
        "Backups are blocked by the Firebase rules. Publish the new firestore.rules.": "النسخ الاحتياطية محظورة بقواعد Firebase. انشر ملف firestore.rules الجديد.",
        "Before restore": "قبل الاسترجاع",
        "Before coach update": "قبل تحديث المدرب",
        "Message from your coach": "رسالة من مدربك",
        "New routine from your coach: {name}": "جدول جديد من مدربك: {name}",
        "Your coach updated your routine": "حدّث مدربك جدولك",
        "Your coach sent you a message": "أرسل لك مدربك رسالة",
        "Dismiss": "إخفاء",
        "Continue": "متابعة",
        "Could not load backups. Check your connection.": "تعذر تحميل النسخ. تحقق من الاتصال.",
        "Could not restore. Check your connection.": "تعذر الاسترجاع. تحقق من الاتصال.",
        "Could not save the backup. Check your connection.": "تعذر حفظ النسخة. تحقق من الاتصال.",
        "Did the set? Tap ✓. Change the KG or reps first if they were different.": "أنهيت المجموعة؟ اضغط ✓. وعدّل الوزن أو التكرارات أولًا إذا كانت مختلفة.",
        "Got it": "فهمت",
        "I agree to the {terms} and the {privacy}.": "أوافق على {terms} و{privacy}.",
        "Loading…": "جارٍ التحميل…",
        "Manual": "يدوية",
        "Next": "التالي",
        "No backups yet. Tap Back up now to make the first one.": "لا توجد نسخ بعد. اضغط «انسخ الآن» لإنشاء أول نسخة.",
        "Please agree to the Terms and Privacy Policy first.": "يرجى الموافقة على الشروط وسياسة الخصوصية أولًا.",
        "Privacy Policy": "سياسة الخصوصية",
        "Rest timer: it starts by itself. Use −15 / +15 or Skip.": "مؤقت الراحة يبدأ تلقائيًا. استخدم −15 / +15 أو تخطي.",
        "Restore": "استرجاع",
        "Restore this backup?": "استرجاع هذه النسخة؟",
        "Restoring…": "جارٍ الاسترجاع…",
        "Tap a day, or swipe left or right, to see another day of your plan.": "اضغط على يوم، أو اسحب يمينًا أو يسارًا، لترى يومًا آخر من خطتك.",
        "Tap an exercise to see its details and start it.": "اضغط على تمرين لترى تفاصيله وتبدأه.",
        "Tap ⌄ to look at your plan. The workout keeps running at the bottom.": "اضغط ⌄ لمشاهدة خطتك، ويستمر التمرين في الأسفل.",
        "Terms of Use": "شروط الاستخدام",
        "Your account: sync, older backups and sign out are here.": "حسابك: المزامنة والنسخ السابقة وتسجيل الخروج هنا.",
        "Your records, next targets and weekly volume per muscle are here.": "أرقامك القياسية وأهدافك القادمة وحجم التمرين الأسبوعي لكل عضلة هنا.",
        "Your routines, settings and workouts go back to {date}, on all your phones. A copy of how things are now is saved first.": "ستعود برامجك وإعداداتك وتمارينك إلى {date} على جميع أجهزتك. تُحفظ نسخة من وضعك الحالي أولًا.",
        "{n} workouts": "{n} تمارين",
        "Your training, organised": "تمرينك، منظّم",
        "Your weekly plan, every set you lift and your progress — all in one place.": "خطتك الأسبوعية وكل مجموعة ترفعها وتقدّمك — في مكان واحد.",
        "Log a set in one tap": "سجّل المجموعة بضغطة",
        "Your weights from last time are filled in. Tap ✓ after each set and the rest timer starts by itself.": "أوزانك من المرة السابقة مكتوبة مسبقًا. اضغط ✓ بعد كل مجموعة ويبدأ مؤقت الراحة تلقائيًا.",
        "Watch yourself get stronger": "شاهد قوتك تزيد",
        "The app tells you when to add weight, and shows your records and weekly volume per muscle.": "يخبرك التطبيق متى تزيد الوزن، ويعرض أرقامك القياسية وحجم التمرين الأسبوعي لكل عضلة.",
        "Sign in to start": "سجّل الدخول للبدء",
        "Your workouts are saved to your Google account and kept in sync on all your phones.": "تُحفظ تمارينك في حساب Google وتتزامن على جميع أجهزتك.",
        "Please review and agree": "يرجى المراجعة والموافقة",
        "To keep using Apex Lift, please agree to our Terms of Use and Privacy Policy.": "لمتابعة استخدام Apex Lift، يرجى الموافقة على شروط الاستخدام وسياسة الخصوصية.",
        "Push & Bi": "دفع وبايسبس",
        "Pull & TRI": "سحب وترايسبس",
        "Legs A": "أرجل أ",
        "Lower Body & Abs": "الجزء السفلي والبطن",
        "Finish workout?": "إنهاء التمرين؟",
        "{n} sets are still empty. Only the sets you did will be saved.": "{n} مجموعات ما زالت فارغة. سيتم حفظ المجموعات التي أديتها فقط.",
        "Log the rest": "سجّل الباقي",
        "Name this day": "سمِّ هذا اليوم",
        "Same for all": "نفس العدد للكل",
        "You have an unfinished workout. Finish it to save your sets.": "لديك تمرين لم يكتمل. أنهِه لحفظ مجموعاتك.",
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
        "Swap...": "تبديل...",
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
        "Start": "ابدأ",
        "History": "السجل",
        "How do you feel?": "كيف تشعر اليوم؟",
        "New record": "رقم قياسي جديد",
        "{name} saved · {n} sets": "تم حفظ {name} · {n} مجموعات",
        "Close": "إغلاق",
        "Week of {range}": "أسبوع {range}",
        "{a} of {b} workouts done": "تم {a} من {b} تمارين",
        "Reps per set": "التكرار لكل مجموعة",
        "Seconds per set": "الثواني لكل مجموعة",
        "{w} kg for {r} reps": "{w} كجم لـ {r} تكرار",
        "{w} kg for {r} sec": "{w} كجم لـ {r} ثانية",
        "{r} reps": "{r} تكرار",
        "{r} sec": "{r} ثانية",
        "All {n} sets": "كل المجموعات ({n})",
        "{a} of {b} sets": "{a} من {b} مجموعات",
        "Set {n}": "المجموعة {n}",
        "First time doing this exercise": "أول مرة تؤدي هذا التمرين",
        "+{n} extra": "+{n} إضافية",
        "Theme": "المظهر",
        "Dark": "داكن",
        "Light": "فاتح",
        "Sets × reps": "المجموعات × التكرار",
        "Today's target": "هدف اليوم",
        "Last time": "آخر مرة",
        "Finish the workout or discard it with ✕ to leave.": "أنهِ التمرين أو ألغِه بزر ✕ للخروج.",
        "Type the KG and reps you did. The set turns green by itself.": "اكتب الوزن والتكرار الذي أديته. تصبح المجموعة خضراء تلقائيًا.",
        "Type the KG and reps you did: the set turns green by itself. RPE (optional): 10 = no reps left, 9 = 1 left, 8 = 2 left.": "اكتب الوزن والتكرار الذي أديته: تصبح المجموعة خضراء تلقائيًا. RPE (اختياري): 10 = لا تكرارات متبقية، 9 = تكرار واحد، 8 = تكراران.",
    };
    const t = (en, vars) => {
        let out = (isAR && Object.prototype.hasOwnProperty.call(AR, en) && AR[en]) || en;
        if (vars) out = out.replace(/\{(\w+)\}/g, (m, k) => vars[k] !== undefined ? vars[k] : m);
        return out;
    };
    const MUSCLE_AR = { 'Abductors':'مبعدات الورك','Abs':'البطن','Adductors':'مقربات الورك','Back':'الظهر','Biceps':'البايسبس','Calves':'السمانة','Chest':'الصدر','Forearms':'الساعد','Front Delts':'الكتف الأمامي','Glutes':'المؤخرة','Hamstrings':'خلفي الفخذ','Lats':'اللاتس','Lower Back':'أسفل الظهر','Lower Chest':'أسفل الصدر','Neck':'الرقبة','Quads':'أمامي الفخذ','Rear Delts':'الكتف الخلفي','Shoulders':'الأكتاف','Side Delts':'الكتف الجانبي','Traps':'الترابيس','Triceps':'الترايسبس','Upper Chest':'أعلى الصدر','Abs & Core':'البطن والجذع','Muscle':'العضلة' };
    const tm = m => (isAR && Object.prototype.hasOwnProperty.call(MUSCLE_AR, (m || '').trim()) && MUSCLE_AR[(m || '').trim()]) || m || '';
    const DAY_AR = { SUN:'الأحد', MON:'الاثنين', TUE:'الثلاثاء', WED:'الأربعاء', THU:'الخميس', FRI:'الجمعة', SAT:'السبت' };
    const tDay = d => (isAR && Object.prototype.hasOwnProperty.call(DAY_AR, d) && DAY_AR[d]) || d;
    const DAY_EN = { SUN:'Sunday', MON:'Monday', TUE:'Tuesday', WED:'Wednesday', THU:'Thursday', FRI:'Friday', SAT:'Saturday' };
    const dayLong = d => isAR ? (DAY_AR[d] || d) : (DAY_EN[d] || d);
    const DAY_AR_SHORT = { SUN:'أحد', MON:'اثنين', TUE:'ثلاثاء', WED:'أربعاء', THU:'خميس', FRI:'جمعة', SAT:'سبت' };
    const dayShort = d => isAR ? (DAY_AR_SHORT[d] || d) : (DAY_EN[d] || d).slice(0, 3);
    // Workout name short enough for the week strip: built-in names have a fixed short form,
    // your own names lose filler words ("Push Day" -> "Push"); anything longer is cut after 2 lines
    const SHORT_TITLE = {
        'Upper Body': ['Upper', 'علوي'], 'Lower Body': ['Lower', 'سفلي'], 'Full Body': ['Full Body', 'جسم كامل'],
        'Full Body A': ['Full A', 'كامل A'], 'Full Body B': ['Full B', 'كامل B'],
        'Upper Hypertrophy': ['Upper Hyp', 'علوي تضخيم'], 'Lower Hypertrophy': ['Lower Hyp', 'سفلي تضخيم'],
        'Glutes & Hamstrings': ['Glutes & Hams', 'مؤخرة وفخذ'], 'Shoulders & Arms': ['Shldr & Arms', 'أكتاف وذراعين'],
        'Lower Body & Abs': ['Lower & Abs', 'سفلي وبطن'], 'Push & Bi': ['Push & Bi', 'دفع وباي'], 'Pull & TRI': ['Pull & TRI', 'سحب وتراي'], 'Complete Rest': ['Rest', 'راحة'], 'Active Rest': ['Active', 'راحة نشطة']
    };
    const shortTitle = title => {
        const s = SHORT_TITLE[(title || '').trim()]; if (s) return isAR ? s[1] : s[0];
        const words = t(title || '').trim().split(/\s+/), kept = words.filter(w => !/^(day|body|workout|session|يوم|تمرين)$/i.test(w));
        return (kept.length ? kept : words).join(' ');
    };
    // Dates are shown in the chosen language (always the normal calendar and 0-9 digits)
    const fmtDate = (ts, withTime = true) => {
        const d = new Date(ts);
        if (isNaN(d)) return '';
        const opt = { day: '2-digit', month: 'short', year: 'numeric', calendar: 'gregory', numberingSystem: 'latn' };
        if (withTime) { opt.hour = 'numeric'; opt.minute = '2-digit'; }
        return new Intl.DateTimeFormat(isAR ? 'ar' : 'en-GB', opt).format(d);
    };
    const fmtDayMonth = d => new Intl.DateTimeFormat(isAR ? 'ar' : 'en-GB', { day: 'numeric', month: 'short', calendar: 'gregory', numberingSystem: 'latn' }).format(d);

    // 📦 1. DATA: muscles, exercises and programs come from library.js (shared with the admin coach builder)
    const { muscleOptions, exerciseDictionary, WORKOUTS, PROGRAMS } = window.APEX_LIB;
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


    // 🛡️ DATA VALIDATION (used for saved data and imported backup files)
    const DAY_NAMES = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
    const isObj = v => v !== null && typeof v === 'object' && !Array.isArray(v);
    // Arabic keyboards type ٤ or ۴: turn them into 4 so numbers always work
    const latinDigits = v => String(v == null ? '' : v).replace(/[\u0660-\u0669]/g, d => d.charCodeAt(0) - 0x660).replace(/[\u06F0-\u06F9]/g, d => d.charCodeAt(0) - 0x6F0);
    const toStr = (v, fb = '') => (typeof v === 'string' || typeof v === 'number') ? String(v) : fb;
    // Security: names like "__proto__" can't be used as keys, and text from files/cloud is cut to a sane length
    const safeKey = k => typeof k === 'string' && k.length > 0 && k.length <= 200 && k !== '__proto__' && k !== 'constructor' && k !== 'prototype';
    const cut = (v, n, fb = '') => toStr(v, fb).slice(0, n);

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
                    title: cut(d.title, 80, 'New Day'),
                    isRest,
                    recoveryType: isRest ? (d.recoveryType === 'active' ? 'active' : 'complete') : null,
                    savedTitle: cut(d.savedTitle, 80),
                    exercises: Array.isArray(d.exercises) ? d.exercises.filter(isObj).slice(0, 60).map(ex => ({
                        muscle: cut(ex.muscle, 40, 'Muscle'), name: cut(ex.name, 80, 'New Exercise'), sets: latinDigits(cut(ex.sets, 10, '3')), reps: latinDigits(cut(ex.reps, 20, '10'))
                    })) : []
                };
            });
            let id = cut(w.id, 60) || `w_${Date.now()}_${wi}`;
            while (cleanWeeks.some(x => x.id === id)) id += '_';
            cleanWeeks.push({ id, name: cut(w.name, 60, 'Routine'), schedule });
        });
        return cleanWeeks.length ? { weeks: cleanWeeks.slice(0, 5) } : null;
    };

    // Returns a clean { exerciseKey: [logs] } history object
    const sanitizeHistory = raw => {
        const out = {};
        if (!isObj(raw)) return out;
        Object.keys(raw).filter(safeKey).slice(0, 600).forEach(k => {
            if (!Array.isArray(raw[k])) return;
            const logs = raw[k].slice(-HIST_CAP).filter(l => isObj(l) && typeof l.d === 'string').map(l => {
                const s = Array.isArray(l.s) ? l.s.slice(0, 30).map(x => parseInt(x)).filter(x => !isNaN(x)) : cut(l.s, 10);
                const log = { d: l.d.slice(0, 40), w: cut(l.w, 10), s };
                if (l.time !== undefined) log.time = cut(l.time, 12);
                if (l.week !== undefined) log.week = cut(l.week, 60);
                if (typeof l.ts === 'number' && isFinite(l.ts)) log.ts = l.ts;
                if (typeof l.dayId === 'number' && l.dayId >= 1 && l.dayId <= 7) log.dayId = l.dayId;
                if (l.weekId !== undefined) log.weekId = cut(l.weekId, 60);
                if (l.u === 's') log.u = 's';
                if (Array.isArray(l.ws) && Array.isArray(l.s) && l.ws.length === l.s.length) log.ws = l.ws.slice(0, 30).map(x => cut(x, 10, '0'));
                if (Array.isArray(l.rpe) && Array.isArray(l.s) && l.rpe.length === l.s.length) log.rpe = l.rpe.slice(0, 30).map(x => typeof x === 'number' && x >= 1 && x <= 10 ? x : null);
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
        Object.keys(raw).filter(safeKey).slice(0, 1000).forEach(k => { const v = toStr(raw[k], null); if (v !== null) out[k] = v.slice(0, 20); });
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

    const getExKey = (w, d, i, n) => (n||'').trim() === '' || (n||'').trim() === 'New Exercise' ? `temp_${w}_${d}_${i}` : `global_${(n||'').trim().toLowerCase().replace(/[^\p{L}\p{N}]/gu, '_')}`;

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
    // Each exercise keeps its newest 400 logs (more than 2 years at 3 sessions a week)
    const HIST_CAP = 400;
    // A log's fingerprint: same time, weight and reps = the same log (used to merge lists without duplicates)
    const logSig = l => `${logTime(l)}|${l.w}|${Array.isArray(l.s) ? l.s.join(',') : l.s}`;
    // Records you deleted, remembered so another phone (or an old backup) can't bring them back
    const DELETED_KEY = 'workoutDeleted_rakan_final';
    const getDeleted = () => { const v = readJSON(DELETED_KEY, {}); return isObj(v) ? v : {}; };
    const setDeleted = d => { try { localStorage.setItem(DELETED_KEY, JSON.stringify(d)); } catch (e) {} };
    // When a backup is restored, each exercise's list gets a "reset" time: a newer reset replaces the list on every phone
    const RESET_KEY = 'workoutHistReset_rakan_final';
    const getResets = () => { const v = readJSON(RESET_KEY, {}); return isObj(v) ? v : {}; };
    const setResets = d => { try { localStorage.setItem(RESET_KEY, JSON.stringify(d)); } catch (e) {} };
    // Terms of Use & Privacy Policy: which version the user agreed to, and when
    const TERMS_VERSION = '2026-10.4';
    const AGREE_KEY = 'workoutAgreed_rakan_final';
    const getAgree = () => { const v = readJSON(AGREE_KEY, null); return isObj(v) && v.v === TERMS_VERSION ? v : null; };
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
    const BODYWEIGHT_LC = new Set(BODYWEIGHT.map(x => x.toLowerCase()));
    const isBodyweight = name => BODYWEIGHT_LC.has((name || '').trim().toLowerCase());
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

    // Shown on the admin page (which version each user runs). Change it together with CACHE in sw.js.
    const APP_VERSION = '23';
    // How the setup questions ended: 'program', 'own', 'skip', or 'left:<step>' while they are not finished
    const SETUP_KEY = 'workoutSetup_rakan_final';

    // 🧑‍🏫 COACH: the last routine and note the coach sent from the admin page (see applyCoach in the cloud module)
    const COACH_KEY = 'workoutCoach_rakan_final';
    const getCoach = () => { const v = readJSON(COACH_KEY, null); return isObj(v) ? v : null; };
    const coachCardHTML = () => {
        const c = getCoach();
        if (!c || c.hidden || (!c.note && !c.routine)) return '';
        return `<div class="glass-card p-4 mb-4 border border-[#d4af37]/25">
            <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2 min-w-0"><i data-lucide="message-circle" class="w-4 h-4 text-[#d4af37] shrink-0"></i><span class="text-[12px] font-black uppercase tracking-widest text-white truncate">${t('Message from your coach')}</span></div>
                <button onclick="window.appActions.dismissCoach()" class="text-slate-500 hover:text-white p-2 bg-white/5 rounded-lg tap-feedback shrink-0" aria-label="${esc(t('Dismiss'))}"><i data-lucide="x" class="w-4 h-4"></i></button>
            </div>
            ${c.routine ? `<div class="text-[11px] font-black text-[#d4af37] mt-2">${esc(t('New routine from your coach: {name}', { name: c.routine }))}</div>` : ''}
            ${c.note ? `<p class="text-[12px] font-bold text-slate-300 leading-snug mt-2" style="white-space:pre-wrap">${esc(c.note)}</p>` : ''}
        </div>`;
    };

    // 🔋 DAILY CHECK-IN (readiness). Each answer scores 0-2; total 0-6.
    const READY_KEY = 'workoutReadiness_rakan_final';
    const dateKey = (t = Date.now()) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
    const getReadinessAll = () => { const v = readJSON(READY_KEY, {}); return isObj(v) ? v : {}; };
    // check-ins from the cloud: only real dates and answers 0-2, last 60 days
    const sanitizeReadiness = raw => {
        const out = {}, cutoff = dateKey(Date.now() - 60 * 86400000);
        if (isObj(raw)) Object.keys(raw).filter(k => /^\d{4}-\d{2}-\d{2}$/.test(k) && k >= cutoff).forEach(k => {
            const r = raw[k];
            if (isObj(r) && [r.sleep, r.soreness, r.energy].every(x => x === 0 || x === 1 || x === 2)) out[k] = { sleep: r.sleep, soreness: r.soreness, energy: r.energy };
        });
        return out;
    };
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
    // exp: 'new' = one set less on accessories, 'adv' = one set more on the first two lifts of each day (never more than 4)
    const PROFILE_KEY = 'workoutProfile_rakan_final';
    const getProfile = () => { const v = readJSON(PROFILE_KEY, {}); return isObj(v) ? v : {}; };
    // "About you" (all optional): birth year, sex, height, body weight + a log of body weight over time
    const BODY_KEY = 'workoutBody_rakan_final';
    const MIN_AGE = 13;
    const thisYear = () => new Date().getFullYear();
    const sanitizeBody = raw => {
        const b = isObj(raw) ? raw : {}, out = {};
        const y = parseInt(latinDigits(b.birthYear)); if (y >= thisYear() - 100 && y <= thisYear() - 5) out.birthYear = y;
        if (['male', 'female', 'na'].includes(b.sex)) out.sex = b.sex;
        const h = parseFloat(latinDigits(b.heightCm)); if (h >= 100 && h <= 250) out.heightCm = Math.round(h);
        const w = parseFloat(latinDigits(b.weightKg)); if (w >= 25 && w <= 350) out.weightKg = Math.round(w * 10) / 10;
        if (Array.isArray(b.log)) out.log = b.log.filter(x => isObj(x) && typeof x.t === 'number' && isFinite(x.t) && parseFloat(x.kg) >= 25 && parseFloat(x.kg) <= 350)
            .map(x => ({ t: x.t, kg: Math.round(parseFloat(x.kg) * 10) / 10 })).sort((a, c) => a.t - c.t).slice(-200);
        return out;
    };
    const getBody = () => sanitizeBody(readJSON(BODY_KEY, {}));
    const setBody = b => writeItem(BODY_KEY, JSON.stringify(sanitizeBody(b)));
    const ageOf = b => b.birthYear ? thisYear() - b.birthYear : null;
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
                if (exp === 'adv' && j < 2) n = Math.max(n, Math.min(4, n + 1));
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
            if (!o.classList.contains('opacity-0')) return; // opened again in the meantime: leave it open
            o.classList.add('hidden'); o.classList.remove('flex');
            if (document.querySelectorAll('.sheet-overlay.flex').length === 0) { const sc = document.querySelector('.scrollable-content'); if (sc) sc.style.overflow = ''; }
        }, 300);
    };

    // 📱 PHONE BACK BUTTON: closes the top window instead of leaving the app.
    // One extra history entry ("guard") is added while windows are open. The app never calls history.back()
    // itself, so it can never accidentally leave the page.
    const backStack = []; let backGuard = false;
    const pushBack = (id, fn) => {
        popBack(id); // one entry per window, even if it was opened twice
        backStack.push({ id, fn });
        if (!backGuard) { try { history.pushState({ apexGuard: 1 }, ''); backGuard = true; } catch (e) {} }
    };
    // Phone back button during a workout: the workout stays open (finish it or discard it with ✕ to leave)
    const sessionBack = () => { backStack.push({ id: 'session', fn: sessionBack }); window.appActions.showToast(t('Finish the workout or discard it with ✕ to leave.'), 'error'); };
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

    // 👈 SWIPE left / right on Today to go to the next / previous day (the layout is never mirrored, so the same in Arabic)
    const enableDaySwipe = el => {
        if (!el) return;
        let x0 = null, y0 = 0, t0 = 0;
        el.addEventListener('touchstart', e => {
            if (window.appState.currentView !== 'today' || window.appState.todayEdit || e.touches.length > 1 || e.target.closest('input, select, textarea, .scrollbar-hide')) { x0 = null; return; }
            x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; t0 = Date.now();
        }, { passive: true });
        el.addEventListener('touchend', e => {
            if (x0 === null) return;
            const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
            if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx) * 0.6 || Date.now() - t0 > 600) return;
            window.appActions.setActiveDay(((activeDay - 1 + (dx < 0 ? 1 : 6)) % 7) + 1);
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
    const fmtClock = sec => { const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), x = String(sec % 60).padStart(2, '0'); return h ? `${h}:${String(m).padStart(2, '0')}:${x}` : `${String(m).padStart(2, '0')}:${x}`; };
    // All sets of the last session before today (for the "Previous" column)
    const lastSessionSets = hA => {
        const logs = (hA || []).filter(l => !isNaN(logTime(l)) && !isToday(logTime(l)));
        if (!logs.length) return [];
        const day = startOfDay(logTime(logs[logs.length - 1]));
        return logs.filter(l => startOfDay(logTime(l)) === day).flatMap(logSetDetails);
    };
    // Last session in one line: date + "60kg × 10 · 10 · 9" (the weight per set only when they differ)
    const lastSessionText = (hA, timed) => {
        const sets = lastSessionSets(hA); if (!sets.length) return null;
        const logs = (hA || []).filter(l => !isNaN(logTime(l)) && !isToday(logTime(l))), u = timed ? 's' : '';
        const body = sets.every(x => x.w === sets[0].w) ? `${fmtW(sets[0].w)} × ${sets.map(x => x.r + u).join(' · ')}` : sets.map(x => `${fmtW(x.w)} × ${x.r}${u}`).join(' · ');
        return { when: fmtDate(logTime(logs[logs.length - 1]), false), body };
    };
    // "Last time" in the exercise pop-up: every set from the last date this exercise was done on this day of the plan
    // (today included, all of that date's sessions together); falls back to any day if it was never done on this one
    const lastDaySets = (hA, dayId) => {
        const valid = (hA || []).filter(l => !isNaN(logTime(l))), mine = valid.filter(l => logDayId(l) === dayId), logs = mine.length ? mine : valid;
        if (!logs.length) return null;
        const ts = Math.max(...logs.map(logTime)), day = startOfDay(ts);
        return { ts, sets: logs.filter(l => startOfDay(logTime(l)) === day).flatMap(logSetDetails) };
    };
    const sessionRows = () => [...document.querySelectorAll('#aw-sets-container .aw-row')].map(r => {
        const i = r.dataset.i, val = id => ((document.getElementById(id) || {}).value || '').trim();
        return { i, e: Number(r.dataset.e), w: val(`aw-w-${i}`), r: val(`aw-rep-${i}`), rpe: val(`aw-rpe-${i}`), done: r.dataset.done === '1', logged: r.dataset.logged === '1' };
    });
    const sessionHasData = () => !!window.appState.sess && sessionRows().some(x => !x.logged && (x.r !== '' || x.done));
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
        setTimeout(() => { if (o.classList.contains('opacity-0')) { o.classList.add('hidden'); o.classList.remove('flex'); } if (after) after(); }, ms);
    };

    // 🎨 4. CORE UI RENDERING
    // Plan tab: your routines as one folding card (shows the active routine; tap to see and manage all of them)
    const renderSidePanel = () => {
        const active = appData.weeks.find(w => w.id === currentWeekId) || appData.weeks[0], open = !!window.appState.routinesOpen, inDay = window.appState.planDay != null;
        const row = w => `<div class="flex items-center gap-3 bg-black/40 p-3 rounded-xl border ${w.id===currentWeekId?'border-[#d4af37]/50 shadow-[0_0_10px_rgba(212,175,55,0.1)]':'border-white/5'} transition-all"><input type="text" value="${esc(w.name)}" onchange="window.appActions.renameWeek(${jsArg(w.id)}, this.value)" class="bg-transparent text-white text-[13px] font-bold uppercase tracking-wider w-full outline-none">${w.id===currentWeekId?`<span class="text-[#22c55e] text-[9px] font-black tracking-widest uppercase shrink-0">${t('Active')}</span>`:`<button onclick="window.appActions.switchWeek(${jsArg(w.id)})" class="text-slate-400 hover:text-white text-[10px] font-bold tracking-widest uppercase tap-feedback shrink-0 px-2 py-1 bg-white/5 rounded-lg">${t('Select')}</button>`}<button onclick="window.appActions.duplicateWeek(${jsArg(w.id)})" class="text-slate-300 hover:text-white tap-feedback p-1 bg-white/5 rounded-lg shrink-0 border border-white/10" aria-label="${esc(t('Duplicate routine'))}" title="${esc(t('Duplicate routine'))}"><i data-lucide="copy" class="w-4 h-4"></i></button>${appData.weeks.length>1?`<button onclick="window.appActions.deleteWeek(${jsArg(w.id)})" class="text-red-400 hover:text-red-300 tap-feedback p-1 bg-red-500/10 rounded-lg shrink-0 border border-red-500/20" aria-label="${esc(t('Delete routine'))}"><i data-lucide="trash-2" class="w-4 h-4"></i></button>`:''}</div>`;
        // Plan is where the schedule is edited: a gold strip says so, so it isn't mistaken for Today
        document.getElementById('weeks-container').innerHTML = `<div class="plan-strip flex items-center gap-2.5 px-3.5 py-2.5 mb-2.5 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/45">
            <i data-lucide="pencil-line" class="w-[18px] h-[18px] text-[#d4af37] shrink-0"></i>
            <span class="flex-1 min-w-0"><span class="block text-[11px] font-black text-[#d4af37] uppercase tracking-widest">${t('Editing your schedule')}</span><span class="block text-[11px] font-semibold text-slate-300 mt-px">${t('Changes here update your Today page')}</span></span>
        </div>
        ${inDay ? '' : `<div class="glass-card ${open ? 'border border-[#d4af37]/30' : ''}">
            <button onclick="window.appActions.toggleRoutines()" class="w-full p-4 flex items-center gap-3 text-start tap-feedback" aria-expanded="${open}">
                <span class="w-10 h-10 rounded-full bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center shrink-0"><i data-lucide="calendar-range" class="w-5 h-5"></i></span>
                <span class="flex-1 min-w-0"><span class="block text-[10px] font-black text-slate-400 uppercase tracking-widest">${t('My routines')}</span><span class="block text-[15px] font-black text-white truncate">${esc(t(active.name))}</span></span>
                <span class="shrink-0 text-[11px] font-black text-slate-400" dir="ltr">${appData.weeks.length}</span>
                <i data-lucide="chevron-down" class="w-5 h-5 text-slate-500 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}"></i>
            </button>
            ${open ? `<div class="px-4 pb-4 space-y-2.5">${appData.weeks.map(row).join('')}
                <button onclick="window.appActions.addWeek()" class="w-full py-3 flex items-center justify-center gap-2 text-[#d4af37] font-bold uppercase tracking-widest text-[11px] tap-feedback border border-dashed border-[#d4af37]/40 bg-[#d4af37]/5 rounded-xl"><i data-lucide="plus" class="w-4 h-4 shrink-0"></i>${t('New routine')}</button>
            </div>` : ''}
        </div>`}`;
        document.getElementById('active-week-label').innerText = t(active.name);
        if(window.lucide) window.lucide.createIcons();
    };

    // Week bar: the week's dates and how many workouts are done, then one bar with the 7 days
    // (weekday, date, short workout name). Selected = gold pill, today = gold dot, done = green date (Today tab), red dot = empty day (Plan tab).
    // Plan is for building workouts, so it doesn't show what was done
    const weekNavHTML = () => {
        const schedule = getActiveSchedule(), history = StorageManager.getHistory(), today = getTodayId(), view = window.appState.currentView;
        const ws = getWeekStart(), dateOf = id => new Date(ws.getFullYear(), ws.getMonth(), ws.getDate() + id - 1);
        const doneOf = d => view !== 'plan' && !d.isRest && (d.exercises || []).length > 0 && isDayCompleted(d, history);
        const train = schedule.filter(d => !d.isRest && (d.exercises || []).length), doneN = train.filter(doneOf).length;
        const head = `<div class="wk-head"><span class="wk-head-t">${t('Week of {range}', { range: `<span dir="ltr">${esc(fmtDayMonth(dateOf(1)))} – ${esc(fmtDayMonth(dateOf(7)))}</span>` })}</span>${view === 'plan' ? `<span class="wk-head-s">${t('{n} workouts', { n: train.length })}</span>` : `<span class="wk-head-s">${t('{a} of {b} workouts done', { a: doneN, b: train.length })}</span>`}</div>
            ${view === 'plan' ? '' : `<div class="wk-bar">${schedule.map(d => `<i class="${d.isRest ? 'is-rest' : doneOf(d) ? 'is-on' : ''}"></i>`).join('')}</div>`}`;
        const cells = schedule.map(d => {
            const sel = activeDay === d.id, comp = doneOf(d), empty = isDayIncomplete(d), isT = today === d.id;
            const name = d.isRest ? shortTitle(d.recoveryType === 'active' ? 'Active Rest' : 'Complete Rest') : shortTitle(d.title);
            const mark = empty && view === 'plan' ? '<span class="wk-dot is-empty"></span>' : isT ? '<span class="wk-dot"></span>' : '';
            return `<button onclick="window.appActions.setActiveDay(${d.id})" class="wk-day tap-feedback ${sel ? 'is-sel' : ''} ${d.isRest ? 'is-rest' : ''} ${comp ? 'is-done' : ''}" aria-pressed="${sel}" aria-label="${esc(dayLong(d.day) + ' ' + dateOf(d.id).getDate() + ' · ' + (d.isRest ? name : t(d.title)) + (comp ? ' · ' + t('Done') : ''))}"><span class="wk-wd">${esc(dayShort(d.day))}</span><span class="wk-dt">${dateOf(d.id).getDate()}</span><span class="wk-wo">${esc(empty ? '—' : name)}</span><span class="wk-mk">${mark}</span></button>`;
        });
        return head + `<div class="wk-strip">${cells.join('')}</div>`;
    };
    // Today and Plan: the week bar at the top of the day card (#today-week)
    const renderNav = () => {
        const html = weekNavHTML();
        document.getElementById('nav-container').innerHTML = html;
        const tw = document.getElementById('today-week'); if (tw) tw.innerHTML = html;
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
            cells += `<button onclick="document.getElementById('cal-info').textContent=${esc(JSON.stringify(label))}" class="aspect-square rounded-md tap-feedback ${d === today ? 'ring-2 ring-white/70' : ''} ${future ? 'opacity-30' : ''}" style="background:${info ? `rgba(212,175,55,${lvl})` : 'rgba(128,128,128,0.14)'}" aria-label="${esc(label)}" title="${esc(label)}"></button>`;
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
        if (typeof hint === 'function') hint('progress-tabs', '#workout-container .scrollbar-hide', t('Your records, next targets and weekly volume per muscle are here.'));
        if (window.lucide) window.lucide.createIcons();
    };
    const READY = {
        high:   { c: '#22c55e', t: 'Push Day',   i: 'zap',      d: 'Well recovered. Go for your targets.' },
        normal: { c: '#d4af37', t: 'Normal Day', i: 'activity', d: 'Follow your targets as planned.' },
        low:    { c: '#ef4444', t: 'Easy Day',   i: 'moon',     d: 'Low recovery: no weight increases today. Keep your weight, aim for the bottom of the range and stop 2 reps before failure.' }
    };
    // Small button in today's day card: "How do you feel?" or the result. Tap to open the check-in
    const checkInChip = () => {
        const r = getReadinessToday(), open = !!window.appState.ciOpen;
        if (!r && window.appState.ciSkipped === dateKey()) return '';
        const L = r ? READY[r.level] : null, c = L ? L.c : '#d4af37';
        return `<button onclick="window.appActions.toggleCheckIn()" class="ci-chip self-start inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest tap-feedback" style="color:${c};border-color:${c}55;background:${c}14" aria-expanded="${open}"><i data-lucide="${L ? L.i : 'activity'}" class="w-3.5 h-3.5"></i>${L ? `${t(L.t)} <span class="text-slate-500">• ${r.score}/6</span>` : t('How do you feel?')}<i data-lucide="chevron-${open ? 'up' : 'down'}" class="w-3 h-3 opacity-70"></i></button>`;
    };
    // Daily check-in card (opened from the button in today's day card)
    const checkInHTML = () => {
        const r = getReadinessToday();
        if (r) {
            const R = READY[r.level], L = { c: R.c, t: t(R.t), i: R.i, d: t(R.d) };
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
        // done with no extra weight (bodyweight, plank...): ask for more reps or seconds, never "add 2.5 kg"
        if (!(prog.w > 0) && prog.type === 'up') return { type: 'build', w: 0, r: prog.maxR + (isTimed(ex.reps) ? 5 : 1) };
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

    // New first day of the week: every workout stays on its own weekday (Push on Saturday stays on Saturday),
    // only the order of the week changes. Logged workouts are re-pointed so "done this week" stays right.
    function setWeekStart(v) {
        const aD = DAY_NAMES, idx = aD.indexOf(v); if (idx === -1) return false;
        StorageManager.setStartDay(v);
        const h = StorageManager.getHistory(), S = window.appState.sess; let hChanged = false;
        appData.weeks.forEach(w => {
            const byDay = {}; w.schedule.forEach(d => { byDay[d.day] = d; });
            if (Object.keys(byDay).length !== 7) { w.schedule.forEach((d, i) => d.day = aD[(idx + i) % 7]); return; }
            const move = {};
            w.schedule = aD.map((_, i) => { const d = byDay[aD[(idx + i) % 7]]; move[d.id] = i + 1; d.id = i + 1; return d; });
            Object.values(h).forEach(list => list.forEach(l => { if (l.weekId === w.id && typeof l.dayId === 'number' && move[l.dayId] && move[l.dayId] !== l.dayId) { l.dayId = move[l.dayId]; hChanged = true; } }));
            if (S && S.weekId === w.id && move[S.dayId]) S.dayId = move[S.dayId];
        });
        if (hChanged) StorageManager.setHistory(h);
        StorageManager.setPlan(appData);
        return true;
    }


    // 🙋 ABOUT YOU form, used in the setup questions and in Profile
    const youngHTML = ctx => `<p id="${ctx}-young" class="text-[12px] font-bold text-red-400">${t('Apex Lift is for ages {n} and up.', { n: MIN_AGE })}</p>`;
    const aboutFormHTML = (ctx = 'about') => { // ctx keeps the ids unique (setup questions vs Profile)
        const b = getBody(), age = ageOf(b), young = age !== null && age < MIN_AGE;
        const inp = 'w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 text-white text-center font-black outline-none focus:border-[#d4af37]';
        const sexBtn = (v, l) => `<button onclick="window.appActions.setAbout('sex', ${jsArg(v)})" class="flex-1 py-3 rounded-xl text-[12px] font-black tap-feedback border ${b.sex === v ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'bg-white/5 text-white border-white/10'}">${l}</button>`;
        const field = (f, label, val, ph, mode) => `<label class="block"><span class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">${label}</span><input id="${ctx}-${f}" type="text" inputmode="${mode}" autocomplete="off" value="${val === undefined ? '' : esc(val)}" placeholder="${esc(ph)}" onchange="window.appActions.setAbout(${jsArg(f)}, this.value)" class="${inp}" dir="ltr"></label>`;
        return `<div class="space-y-4">
            <div class="grid grid-cols-3 gap-3">
                ${field('birthYear', t('Birth year'), b.birthYear, String(thisYear() - 25), 'numeric')}
                ${field('heightCm', t('Height (cm)'), b.heightCm, '175', 'numeric')}
                ${field('weightKg', t('Weight (kg)'), b.weightKg, '75', 'decimal')}
            </div>
            <div id="${ctx}-young-slot">${young ? youngHTML(ctx) : ''}</div>
            <div><span class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">${t('Sex')}</span>
            <div class="flex gap-2">${sexBtn('male', t('Male'))}${sexBtn('female', t('Female'))}${sexBtn('na', t('Prefer not to say'))}</div></div>
            <p class="text-[11px] font-bold text-slate-500 leading-snug">${t('Optional. Used to tailor the app and to improve Apex Lift. Never sold or shared.')}</p>
        </div>`;
    };
    // Profile → About you, with a small body-weight chart
    const renderAbout = () => {
        const el = document.getElementById('about-card'); if (!el) return;
        el.innerHTML = `<div class="glass-card p-5 border border-white/10">
            <div class="flex items-center gap-3 mb-4"><span class="w-10 h-10 rounded-full bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center shrink-0"><i data-lucide="user-round" class="w-5 h-5"></i></span><div class="text-[16px] font-black text-white">${t('About you')}</div></div>
            ${aboutFormHTML('pf')}<div id="pf-chart">${bodyChartHTML()}</div></div>`;
        if (window.lucide) window.lucide.createIcons({ root: el });
    };
    const bodyChartHTML = () => {
        const b = getBody(), log = b.log || [];
        let chart = '';
        if (log.length >= 2) {
            const W = 300, H = 70, ks = log.map(x => x.kg), lo = Math.min(...ks), hi = Math.max(...ks), span = Math.max(1, hi - lo);
            const pts = log.map((x, i) => `${(i / (log.length - 1) * W).toFixed(1)},${(H - 6 - (x.kg - lo) / span * (H - 12)).toFixed(1)}`).join(' ');
            const diff = Math.round((ks[ks.length - 1] - ks[0]) * 10) / 10;
            chart = `<div class="mt-4 rounded-xl bg-black/30 border border-white/5 p-3"><div class="flex justify-between text-[11px] font-black mb-1"><span class="text-slate-400">${t('Body weight')}</span><span class="${diff <= 0 ? 'text-[#22c55e]' : 'text-[#d4af37]'}" dir="ltr">${diff > 0 ? '+' : ''}${diff} kg</span></div><svg viewBox="0 0 ${W} ${H}" class="w-full h-auto" dir="ltr"><polyline points="${pts}" fill="none" stroke="#d4af37" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/></svg></div>`;
        }
        return chart;
    };
    // after typing: refresh only the warning, the chart and the cleaned-up numbers (never the box you're typing in)
    const refreshAbout = () => {
        const b = getBody(), age = ageOf(b), young = age !== null && age < MIN_AGE;
        ['about', 'pf'].forEach(ctx => {
            const slot = document.getElementById(`${ctx}-young-slot`); if (slot) slot.innerHTML = young ? youngHTML(ctx) : '';
            ['birthYear', 'heightCm', 'weightKg'].forEach(f => { const i = document.getElementById(`${ctx}-${f}`); if (i && i !== document.activeElement) i.value = b[f] === undefined ? '' : b[f]; });
        });
        const ch = document.getElementById('pf-chart'); if (ch) ch.innerHTML = bodyChartHTML();
    };

    // 🏠 TODAY: the selected day: a small day card, then its exercises. Tap an exercise to open it: Start (that exercise only) and History
    // Cards slide in when you open a different tab or day, but not when the same screen just refreshes
    let lastAnimKey = '';
    const enterClass = key => { const k = `${window.appState.currentView}|${currentWeekId}|${activeDay}|${key || ''}`; if (k === lastAnimKey) return ''; lastAnimKey = k; return 'stagger'; };
    // Exercises of a day that are finished: all planned sets done this week, or trained today (even with some sets skipped)
    const exercisesFinished = (day, history) => day.exercises.map((ex, i) => {
        const hA = history[getExKey(currentWeekId, day.id, i, ex.name)] || [], planned = parseInt(ex.sets) || 0;
        return (planned > 0 && setsThisWeekForDay(hA, day.id) >= planned) || hA.some(l => logDayId(l) === day.id && isToday(logTime(l)));
    });
    // The whole day's summary once its last exercise is done: every set logged for this day today
    const daySummary = (day, h) => {
        let sets = 0, volume = 0, start = Date.now(); const prs = [], seen = new Set();
        day.exercises.forEach((ex, i) => {
            const k = getExKey(currentWeekId, day.id, i, ex.name); if (seen.has(k)) return; seen.add(k);
            const all = h[k] || [], mine = all.filter(l => logDayId(l) === day.id && isToday(logTime(l)));
            if (!mine.length) return;
            const best = Math.max(0, ...all.filter(l => !isToday(logTime(l))).flatMap(logSetDetails).map(x => x.w));
            const top = Math.max(0, ...mine.flatMap(logSetDetails).map(x => x.w));
            if (best > 0 && top > best) prs.push({ name: ex.name, w: top, plus: Math.round((top - best) * 10) / 10 });
            mine.forEach(l => { start = Math.min(start, logTime(l)); logSetDetails(l).forEach(x => { sets++; if (l.u !== 's') volume += x.r * x.w; }); });
        });
        return { title: day.title, duration: Math.floor((Date.now() - start) / 1000), sets, volume, prs };
    };
    // "8 - 10" -> "8–10" (one dash, no spaces) so a rep range never reads like a sum
    const fmtReps = r => String(r == null ? '' : r).trim().replace(/\s*[-–]\s*/g, '–');
    // Today's target as a sentence: "60 kg for 10 reps" (no × or - signs)
    const targetSentence = (sg, timed) => sg.w > 0
        ? t(timed ? '{w} kg for {r} sec' : '{w} kg for {r} reps', { w: fmtW(sg.w).replace('kg', ''), r: sg.r })
        : t(timed ? '{r} sec' : '{r} reps', { r: sg.r });
    // Number circle on a Today card with a ring that fills as this week's sets get done (all done = green with a tick)
    const progressRing = (done, total, n) => {
        const r = 16, c = 2 * Math.PI * r, p = total > 0 ? Math.min(1, done / total) : 0, full = p >= 1;
        return `<span class="ex-ring ${full ? 'is-full' : ''}"><svg viewBox="0 0 38 38" aria-hidden="true"><circle cx="19" cy="19" r="${r}" class="ex-ring-bg"/>${p > 0 && !full ? `<circle cx="19" cy="19" r="${r}" class="ex-ring-fg" stroke-dasharray="${(c * p).toFixed(1)} ${c.toFixed(1)}"/>` : ''}</svg><span class="ex-ring-n">${full ? '<i data-lucide="check" class="w-4 h-4"></i>' : n}</span></span>`;
    };
    // Today's target in one short coloured line: ↑ add weight, ↓ go lighter
    const suggestionText = (sg, timed) => {
        const cls = { up: 'text-[#22c55e]', down: 'text-red-400', build: 'text-[#d4af37]', easy: 'text-slate-300' }[sg.type];
        return `<span class="font-black ${cls}" title="${esc(t(SUGG[sg.type].label))}" dir="ltr">${{ up: '↑ ', down: '↓ ' }[sg.type] || ''}${fmtW(sg.w)} × ${sg.r}${timed ? 's' : ''}</span>`;
    };
    // Today's edit mode: a gold bar on top (Done / plan the whole week), then the same day editor as Plan
    const todayEditBar = () => `<div class="plan-strip flex items-center gap-2.5 px-3.5 py-2.5 mb-2.5 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/45">
            <i data-lucide="pencil-line" class="w-[18px] h-[18px] text-[#d4af37] shrink-0"></i>
            <span class="flex-1 min-w-0"><span class="block text-[11px] font-black text-[#d4af37] uppercase tracking-widest">${t('Editing this day')}</span><button onclick="window.appActions.planWholeWeek()" class="block text-[11px] font-bold text-slate-300 underline underline-offset-2 tap-feedback">${t('Plan the whole week →')}</button></span>
            <button id="today-edit-done" onclick="window.appActions.setTodayEdit(false)" class="shrink-0 h-9 px-4 rounded-full bg-[#d4af37] text-black text-[12px] font-black uppercase tracking-widest tap-feedback flex items-center gap-1.5"><i data-lucide="check" class="w-4 h-4"></i>${t('Done')}</button>
        </div>`;
    const renderToday = () => {
        const schedule = getActiveSchedule(), day = schedule.find(d => d.id === activeDay), history = StorageManager.getHistory();
        const isT = activeDay === getTodayId(), S = window.appState.sess;
        if (window.appState.todayEdit && S) window.appState.todayEdit = false; // never edit the plan while a workout is running
        if (window.appState.todayEdit) return renderPlanDay(todayEditBar());
        const editBtn = S ? '' : `<button id="today-edit-btn" onclick="window.appActions.setTodayEdit(true)" class="w-9 h-9 shrink-0 rounded-full bg-white/5 text-slate-300 flex items-center justify-center tap-feedback" aria-label="${esc(t('Edit this day'))}" title="${esc(t('Edit this day'))}"><i data-lucide="pencil" class="w-4 h-4"></i></button>`;
        const weekTop = `<div id="today-week" class="today-week">${weekNavHTML()}</div>`;
        const dayLabel = `<div class="text-[10px] font-black text-[#d4af37] uppercase tracking-widest">${esc(isT ? t('Today') : dayLong(day.day))}</div>`;
        let html = '';
        if (day.isRest) {
            html += `<div class="glass-card today-card">${weekTop}<div class="today-body is-row"><div class="flex-1 min-w-0">${dayLabel}<h2 class="text-[21px] font-black text-white leading-tight mt-0.5">${day.recoveryType==='active'?t('Active Rest'):t('Complete Rest')}</h2><div class="text-[12px] font-bold text-slate-400 mt-1">${t('Recover well. See you next session.')}</div></div><i data-lucide="${day.recoveryType==='active'?'footprints':'moon'}" class="w-9 h-9 text-[#d4af37] shrink-0 ${day.recoveryType==='active'?'animate-walk':'animate-pulse-glow'}"></i>${editBtn}</div></div>` + coachCardHTML();
            // Point to the next training day so a rest day is never a dead end
            const nextDay = [1, 2, 3, 4, 5, 6].map(o => schedule.find(d => d.id === ((activeDay - 1 + o) % 7) + 1)).find(d => d && !d.isRest && d.exercises.length);
            if (nextDay) html += `<button onclick="window.appActions.setActiveDay(${nextDay.id})" class="w-full glass-card p-4 mt-3 flex items-center gap-3 text-start tap-feedback"><span class="w-10 h-10 rounded-full bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center shrink-0"><i data-lucide="calendar-clock" class="w-5 h-5"></i></span><span class="flex-1 min-w-0"><span class="block text-[10px] font-black text-slate-400 uppercase tracking-widest">${t('Next workout')}</span><span class="block text-[15px] font-black text-white truncate">${esc(dayLong(nextDay.day))} · ${esc(t(nextDay.title))}</span></span><i data-lucide="chevron-right" class="w-5 h-5 text-slate-500 shrink-0"></i></button>`;
        } else if (!day.exercises.length) {
            html += `<div class="glass-card today-card">${weekTop}<div class="today-body"><div class="flex items-start gap-2"><div class="flex-1 min-w-0">${dayLabel}<h2 class="text-[21px] font-black text-white leading-tight mt-0.5">${t('No exercises yet')}</h2></div>${editBtn}</div><div class="text-[12px] font-bold text-slate-400">${t('Add exercises to start training on this day.')}</div><button onclick="window.appActions.setTodayEdit(true)" class="self-start px-5 py-2.5 rounded-xl bg-[#d4af37] text-black text-[12px] font-black uppercase tracking-widest tap-feedback">${t('Plan this day')}</button></div></div>` + coachCardHTML();
        } else {
            const pr = dayProgress(day, history), fin = exercisesFinished(day, history);
            const finished = (pr.planned > 0 && pr.done >= pr.planned) || fin.every(Boolean);
            const mins = Math.max(10, Math.round(pr.planned * 2.5 / 5) * 5);
            const running = S && S.dayId === day.id && (!S.weekId || S.weekId === currentWeekId);
            html += `<div class="glass-card today-card ${finished ? 'border border-[#22c55e]/30' : ''}">${weekTop}<div class="today-body">
                <div class="flex items-start gap-2">
                    <div class="flex-1 min-w-0">
                        <div class="text-[10px] font-black text-[#d4af37] uppercase tracking-widest">${esc(isT ? t('Today') : dayLong(day.day))}${finished ? ` · <span class="text-[#22c55e]">${t('Done')}</span>` : ''}</div>
                        <h2 class="text-[21px] font-black text-white leading-tight mt-0.5">${esc(t(day.title))}</h2>
                    </div>
                    ${editBtn}
                </div>
                <div class="text-[12px] font-bold text-slate-400">${t('{n} exercises', { n: day.exercises.length })} · ${t('{n} sets', { n: pr.planned })} · ${t('~{n} min', { n: mins })}</div>
                ${pr.done > 0 ? `<div><div class="flex justify-between text-[11px] font-black mb-1.5"><span class="text-slate-400">${t('Done this week')}</span><span class="${finished ? 'text-[#22c55e]' : 'text-white'}" dir="ltr">${pr.done} / ${pr.planned}</span></div><div class="w-full h-1.5 bg-black/50 rounded-full overflow-hidden"><div class="bar-fill h-full rounded-full ${finished ? 'bg-[#22c55e]' : 'bg-[#d4af37]'}" style="width:${pr.pct}%"></div></div></div>` : ''}
                ${running ? `<button onclick="window.appActions.expandSession()" class="w-full py-2.5 rounded-xl bg-[#d4af37] text-black text-[12px] font-black uppercase tracking-widest tap-feedback flex items-center justify-center gap-2"><span class="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0"></span><span class="truncate">${t('Continue workout')}</span></button>` : ''}
                ${isT && !finished ? checkInChip() : ''}
            </div></div>` + coachCardHTML();
            if (isT && !finished && window.appState.ciOpen) html += checkInHTML();
            html += `<div class="space-y-2">` + day.exercises.map((ex, i) => {
                const isRun = running && (S.exIdx === i || S.exIdx == null), planned = parseInt(ex.sets) || 0;
                const doneSets = setsThisWeekForDay(history[getExKey(currentWeekId, day.id, i, ex.name)] || [], day.id), extra = Math.max(0, doneSets - planned);
                const full = planned > 0 && doneSets >= planned, part = doneSets > 0 && !full;
                const plan = `${t('{n} sets', { n: planned })} · ${t(isTimed(ex.reps) ? '{r} sec' : '{r} reps', { r: `<span dir="ltr">${esc(fmtReps(ex.reps))}</span>` })}`;
                return `<button id="ex-card-${i}" onclick="window.appActions.openExSheet(${i})" class="w-full glass-card ex-card ${full ? 'is-full' : part ? 'is-part' : ''} flex items-center gap-3 text-start tap-feedback">
                    ${progressRing(doneSets, planned, i + 1)}
                    ${isRun ? '<span class="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0"></span>' : ''}
                    <span class="flex-1 min-w-0"><span class="ex-name block text-[15px] font-black text-white leading-tight truncate">${esc(ex.name)}</span><span class="block text-[11.5px] font-bold mt-0.5 truncate ${full ? 'text-[#22c55e]' : 'text-slate-400'}">${full ? t('Done this week') : plan}</span></span>
                    <span class="flex items-center gap-1.5 shrink-0" dir="ltr">${extra ? `<span class="ex-pill-extra">+${extra}</span>` : ''}<span class="ex-pill" dir="auto">${t('{n} sets', { n: `<span dir="ltr">${doneSets}/${planned}</span>` })}</span></span>
                </button>`;
            }).join('') + `</div>`;
        }
        document.getElementById('workout-container').innerHTML = `<div class="${enterClass()}">${html}</div>`;
        if (window.lucide) window.lucide.createIcons();
        if (typeof todayHints === 'function' && !day.isRest && day.exercises.length && !S) todayHints();
        if (typeof hint === 'function' && !S && hintSeen('today-days')) hint('today-edit', '#today-edit-btn', t("Tap ✏️ to change this day's exercises."));
    };

    // Contents of the "Edit exercise" pop-up (Plan tab), same look as the exercise pop-up on Today:
    // change exercise on top, then sets and reps; delete is a small icon next to close so it isn't pressed by accident
    const exEditHTML = (i, ex) => {
        const sets = parseInt(ex.sets) || 0, custom = !REPS_PRESETS.includes(ex.reps);
        const label = 'px-0.5 mb-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest';
        return `<div class="px-5 pt-1">
                <div class="flex items-start gap-2">
                    <div class="flex-1 min-w-0">
                        <div class="text-[10px] font-black text-[#d4af37] uppercase tracking-widest">${esc(tm(ex.muscle))}</div>
                        <h3 class="ex-name text-[22px] font-black text-white leading-tight mt-0.5">${esc(ex.name)}</h3>
                    </div>
                    <button onclick="window.appActions.deleteEx(${i})" class="w-10 h-10 shrink-0 rounded-full bg-white/5 text-red-400/80 flex items-center justify-center tap-feedback" aria-label="${esc(t('Delete exercise'))}" title="${esc(t('Delete exercise'))}"><i data-lucide="trash-2" class="w-[18px] h-[18px]"></i></button>
                    <button onclick="window.appActions.closeExEdit()" class="w-10 h-10 shrink-0 rounded-full bg-white/5 text-slate-400 flex items-center justify-center tap-feedback" aria-label="${esc(t('Close'))}"><i data-lucide="x" class="w-5 h-5"></i></button>
                </div>
                <button onclick="window.appActions.openPicker('replace', ${i})" class="w-full mt-4 py-3 rounded-2xl bg-white/5 text-white text-[12px] font-black uppercase tracking-widest tap-feedback flex items-center justify-center gap-2"><i data-lucide="replace" class="w-4 h-4 text-[#d4af37]"></i>${esc(t('Change exercise'))}</button>
                <div class="${label} mt-4">${esc(t('Sets'))}</div>
                <div class="flex items-center gap-3 rounded-2xl bg-white/5 p-2" dir="ltr">
                    <button onclick="window.appActions.exEditSets(-1)" class="w-11 h-11 rounded-xl bg-white/5 text-2xl font-black text-white tap-feedback" aria-label="−">−</button>
                    <div class="flex-1 text-center text-[22px] font-black text-white tabular-nums">${sets || esc(ex.sets)}</div>
                    <button onclick="window.appActions.exEditSets(1)" class="w-11 h-11 rounded-xl bg-white/5 text-2xl font-black text-white tap-feedback" aria-label="+">+</button>
                </div>
                <div class="${label} mt-3">${esc(t(isTimed(ex.reps) ? 'Seconds per set' : 'Reps per set'))}</div>
                <div class="grid grid-cols-4 gap-2" dir="ltr">${REPS_PRESETS.map(r => `<button onclick="window.appActions.exEditReps(${jsArg(r)})" class="py-2.5 rounded-xl text-[12px] font-black tap-feedback ${ex.reps === r ? 'bg-[#d4af37] text-black' : 'bg-white/5 text-white'}">${esc(fmtReps(r))}</button>`).join('')}<button onclick="window.appState.customReps=true;window.appActions.refreshExEdit()" class="py-2.5 rounded-xl text-[12px] font-black tap-feedback flex items-center justify-center gap-1 ${custom ? 'bg-[#d4af37] text-black' : 'bg-white/5 text-slate-300 border border-dashed border-white/20'}" aria-label="${esc(t('Custom'))}">${custom ? esc(fmtReps(ex.reps)) : `<i data-lucide="plus" class="w-3.5 h-3.5"></i>${esc(t('Custom'))}`}</button></div>
                ${window.appState.customReps ? `<div class="flex gap-2 mt-2"><input id="exedit-custom" type="text" inputmode="text" value="${custom ? esc(ex.reps) : ''}" placeholder="${esc(t('Custom reps, e.g. 5 or 6 - 8'))}" onkeydown="if(event.key==='Enter')this.blur()" onchange="window.appState.customReps=false;window.appActions.exEditReps(this.value)" class="flex-1 min-w-0 bg-white/5 border border-[#d4af37]/60 rounded-xl px-3 py-2.5 text-white font-bold outline-none focus:border-[#d4af37]" dir="ltr"><button onclick="const v=document.getElementById('exedit-custom').value;window.appState.customReps=false;if(v.trim())window.appActions.exEditReps(v);else window.appActions.refreshExEdit()" class="shrink-0 px-4 rounded-xl bg-[#d4af37] text-black text-[12px] font-black tap-feedback"><i data-lucide="check" class="w-4 h-4"></i></button></div>` : ''}
                <button onclick="window.appActions.closeExEdit()" class="w-full mt-5 py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-black uppercase tracking-widest tap-feedback flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.35)]"><i data-lucide="check" class="w-5 h-5"></i>${esc(t('Done'))}</button>
            </div>`;
    };
    // Re-draws the open "Edit exercise" pop-up (after a change, or after the exercise was changed in the picker)
    const renderExEdit = () => {
        const i = window.appState.inlineEdit, day = getActiveSchedule().find(d => d.id === activeDay), ex = day && day.exercises[i];
        if (i === null || i === undefined || !ex) return;
        const c = document.getElementById('exedit-content');
        c.innerHTML = exEditHTML(i, ex);
        if (window.lucide) window.lucide.createIcons({ root: c });
        const ci = document.getElementById('exedit-custom'); if (ci && document.activeElement !== ci) ci.focus();
    };

    // Re-draw whatever tab is open
    const renderWorkout = () => {
        const v = window.appState.currentView;
        if (v === 'today') renderToday();
        else if (v === 'plan') { if (window.appState.planDay == null) renderPlanWeek(); else renderPlanDay(planBackBar()); }
        else if (v === 'progress') renderAnalytics();
    };

    // 🗓️ DAY EDITOR (Today ✏️ and Plan → a day): dashed gold day card with Day type and Same sets & reps for all,
    // a dashed underline on the day name (tap to rename), and gold-edged exercise cards with a ⋮⋮ grip (drag); tap a card to edit it
    const planBackBar = () => `<button onclick="window.appActions.openPlanDay(null)" class="flex items-center gap-1 mb-3 px-1 text-[12px] font-black text-slate-300 tap-feedback"><i data-lucide="${isAR ? 'chevron-right' : 'chevron-left'}" class="w-4 h-4"></i>${t('This week')}</button>`;
    const renderPlanDay = (top = '') => {
        const schedule = getActiveSchedule(), day = schedule.find(d => d.id === activeDay), S = window.appState;
        const planned = day.exercises.reduce((a, ex) => a + (parseInt(ex.sets) || 0), 0);
        const mins = Math.max(10, Math.round(planned * 2.5 / 5) * 5), hasEx = !day.isRest && day.exercises.length > 0;
        const pill = 'flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-full border text-[11px] font-black whitespace-nowrap';
        const dayLabel = `<div class="text-[10px] font-black text-[#d4af37] uppercase tracking-widest">${esc(dayLong(day.day))}</div>`;
        let html = `<div class="glass-card today-card plan-card"><div id="today-week" class="today-week">${weekNavHTML()}</div><div class="today-body">
            ${!day.isRest
                ? `<div>${dayLabel}<input type="text" value="${esc(day.title === 'New Day' ? '' : t(day.title))}" placeholder="${esc(t('Name this day'))}" onchange="window.appActions.updateDayTitle(this.value)" aria-label="${esc(t('Name this day'))}" class="day-title-input w-full mt-0.5 pb-1 bg-transparent border-b-[1.5px] border-dashed border-white/25 focus:border-solid focus:border-[#d4af37] text-[21px] font-black text-white placeholder:text-slate-600 outline-none leading-tight transition-colors"></div>
                   <div class="text-[12px] font-bold text-slate-400">${t('{n} exercises', { n: day.exercises.length })} · ${t('{n} sets', { n: planned })}${planned ? ` · ${t('~{n} min', { n: mins })}` : ''}</div>`
                : `<div>${dayLabel}<h2 class="text-[21px] font-black text-white leading-tight mt-0.5">${esc(day.recoveryType === 'active' ? t('Active Rest') : t('Complete Rest'))}</h2></div>
                   <div class="text-[12px] font-bold text-slate-400">${t('Recover well. See you next session.')}</div>`}
            <div class="flex flex-wrap gap-2" role="toolbar" aria-label="${esc(t('Day tools'))}">
                <div class="relative shrink-0 tap-feedback"><select onchange="window.appActions.updateDayType(this.value)" class="absolute inset-0 w-full h-full opacity-0 z-10" aria-label="${esc(t('Day type'))}"><option value="workout" ${!day.isRest ? 'selected' : ''}>${t('Workout')}</option><option value="active" ${day.isRest && day.recoveryType === 'active' ? 'selected' : ''}>${t('Active Rest')}</option><option value="complete" ${day.isRest && day.recoveryType === 'complete' ? 'selected' : ''}>${t('Complete Rest')}</option></select><div class="${pill} bg-white/5 border-white/10 text-slate-200">${t('Day type')}<i data-lucide="chevron-down" class="w-3.5 h-3.5"></i></div></div>
                ${hasEx ? `<button onclick="window.appState.sameAll=!window.appState.sameAll;window.appActions.refreshUI()" class="${pill} shrink-0 tap-feedback ${S.sameAll ? 'bg-[#d4af37] border-[#d4af37] text-black' : 'bg-white/5 border-white/10 text-slate-200'}" aria-pressed="${!!S.sameAll}"><i data-lucide="list-checks" class="w-4 h-4"></i>${t('Same sets & reps for all')}</button>` : ''}
            </div>
            ${hasEx && S.sameAll ? `<div class="flex items-center justify-between gap-2">
                <div class="text-[11px] font-black text-slate-300 leading-tight min-w-0">${t('Same for all')}</div>
                <div class="flex items-center gap-2">
                    <input type="text" id="global-sets" placeholder="${t('Sets')}" class="w-[72px] placeholder:text-[11px] bg-black/40 text-white text-[14px] font-bold text-center rounded-lg py-2 border border-white/10 outline-none focus:border-[#d4af37]">
                    <input type="text" id="global-reps" placeholder="${t('Reps')}" class="w-[72px] placeholder:text-[11px] bg-black/40 text-white text-[14px] font-bold text-center rounded-lg py-2 border border-white/10 outline-none focus:border-[#d4af37]">
                    <button onclick="window.appActions.applyGlobalSetsReps()" class="bg-[#d4af37] text-black px-3 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest tap-feedback shadow-sm">${t('Apply')}</button>
                </div>
            </div>` : ''}
        </div></div>`;

        if (!day.isRest) {
            const grip = `<svg width="16" height="20" viewBox="0 0 16 20" fill="currentColor" aria-hidden="true"><circle cx="5" cy="4" r="1.8"/><circle cx="11" cy="4" r="1.8"/><circle cx="5" cy="10" r="1.8"/><circle cx="11" cy="10" r="1.8"/><circle cx="5" cy="16" r="1.8"/><circle cx="11" cy="16" r="1.8"/></svg>`;
            if (day.exercises.length > 1) html += `<div class="px-1.5 mb-2 text-[11px] font-extrabold text-slate-400">${t('Hold ⋮⋮ and drag to change the order')}</div>`;
            // ⋮⋮ drags straight away (no waiting, no fight with scrolling); the rest of the card opens the editor
            html += `<div id="sortable-list" class="space-y-2">${day.exercises.map((ex, i) => `<div class="glass-card plan-ex flex items-center gap-1.5" data-i="${i}">
                    <span class="handle w-9 h-11 shrink-0 flex items-center justify-center text-slate-500" aria-label="${esc(t('Drag to reorder'))}" role="img">${grip}</span>
                    <button onclick="window.appActions.openExEdit(${i})" class="flex-1 min-w-0 flex items-center gap-2.5 text-start tap-feedback py-0.5">
                        <span class="plan-ex-n w-[26px] h-[26px] shrink-0 rounded-full bg-white/5 flex items-center justify-center text-[12px] font-black text-slate-300">${i + 1}</span>
                        <span class="flex-1 min-w-0"><span class="ex-name block text-[15px] font-black text-white leading-tight truncate">${esc(ex.name)}</span><span class="block text-[11.5px] font-bold mt-0.5 truncate text-slate-400">${esc(tm(ex.muscle))}</span></span>
                        <span class="shrink-0 me-1 text-[11px] font-black px-2.5 py-1 rounded-full bg-[#d4af37]/15 text-[#d4af37]" dir="ltr">${esc(ex.sets)} × ${esc(fmtReps(ex.reps))}</span>
                    </button>
                </div>`).join('')}</div>`;
            html += `<button onclick="window.appActions.openPicker('add')" class="w-full p-4 mt-2.5 mb-10 rounded-[20px] flex items-center justify-center gap-2 text-[#d4af37] font-black uppercase tracking-widest text-[12px] tap-feedback border-[1.5px] border-dashed border-[#d4af37]/50 bg-[#d4af37]/5"><i data-lucide="plus" class="w-4 h-4"></i> ${t('Add Exercise')}</button>`;
        }

        document.getElementById('workout-container').innerHTML = `<div class="plan-scope ${enterClass('edit')}">${top}${html}</div>`;
        if (window.appState.sortableInstance) { window.appState.sortableInstance.destroy(); window.appState.sortableInstance = null; }
        const listEl = document.getElementById('sortable-list');
        if (listEl && day.exercises.length > 1 && window.Sortable) {
            window.appState.sortableInstance = new Sortable(listEl, {
                handle: '.handle', animation: 220, forceFallback: true, fallbackOnBody: true, fallbackTolerance: 3,
                scroll: document.querySelector('.scrollable-content'), scrollSensitivity: 50, scrollSpeed: 8, bubbleScroll: false,
                chosenClass: 'plan-chosen', ghostClass: 'plan-ghost', fallbackClass: 'plan-drag', dragClass: 'plan-drag',
                onStart: () => { try { if (navigator.vibrate) navigator.vibrate(15); } catch (e) {} },
                onEnd: evt => {
                    if (evt.oldIndex === evt.newIndex) return;
                    const before = day.exercises.slice();
                    const m = day.exercises.splice(evt.oldIndex, 1)[0]; day.exercises.splice(evt.newIndex, 0, m);
                    StorageManager.setPlan(appData); renderWorkout();
                    window.appActions.showToast(t('Order saved'), 'success', { label: t('Undo'), fn: () => { day.exercises = before; StorageManager.setPlan(appData); renderWorkout(); } });
                }
            });
        }
        if (window.lucide) window.lucide.createIcons();
        renderExEdit();
        if (typeof hint === 'function' && !day.isRest && day.exercises.length) {
            hint('plan-edit', '#sortable-list > div', t('Tap an exercise to edit it. Hold ⋮⋮ and drag to change the order.'));
            if (hintSeen('plan-edit')) hint('plan-add', '#workout-container button[onclick*="openPicker(\'add\')"]', t('Add more exercises from the full library here.'));
        }
    };

    // 🗓️ PLAN (whole week): one row per day (drag ⋮⋮ to move a day, tap to edit it), then the week's muscle balance.
    // The weekdays stay put on the left; dragging moves the workout to another weekday.
    const DAY_KEYS = ['title', 'isRest', 'recoveryType', 'savedTitle', 'exercises'];
    const BALANCE = [['Chest', ['Chest', 'Upper Chest', 'Lower Chest'], 8], ['Back', ['Back', 'Lats', 'Traps', 'Lower Back'], 8], ['Legs', ['Quads', 'Hamstrings', 'Glutes', 'Calves', 'Adductors', 'Abductors'], 8], ['Shoulders', ['Shoulders', 'Front Delts', 'Side Delts', 'Rear Delts'], 6], ['Arms', ['Biceps', 'Triceps', 'Forearms'], 6], ['Core', ['Abs'], 3]];
    const muscleBalanceHTML = schedule => {
        const sets = BALANCE.map(([g, ms, low]) => ({ g, low, n: schedule.reduce((a, d) => a + (d.isRest ? 0 : (d.exercises || []).filter(ex => ms.includes(ex.muscle)).reduce((b, ex) => b + (parseInt(ex.sets) || 0), 0)), 0) }));
        if (!sets.some(x => x.n)) return '';
        const top = Math.max(20, ...sets.map(x => x.n));
        return `<div class="glass-card p-4 mt-4">
            <div class="flex items-baseline justify-between mb-3"><span class="text-[11px] font-black text-slate-400 uppercase tracking-widest">${t('Muscle balance')}</span><span class="text-[10px] font-bold text-slate-500">${t('Sets per week')}</span></div>
            <div class="space-y-2.5">${sets.map(x => { const lo = x.n < x.low; return `<div class="flex items-center gap-3">
                <span class="w-[74px] shrink-0 text-[12px] font-black ${lo ? 'text-orange-400' : 'text-slate-200'}">${esc(t(x.g))}</span>
                <span class="flex-1 h-2 rounded-full bg-white/10 overflow-hidden" dir="ltr"><span class="block h-full rounded-full ${lo ? 'bg-orange-400' : 'bg-[#d4af37]'}" style="width:${Math.max(x.n ? 4 : 0, Math.round(x.n / top * 100))}%"></span></span>
                <span class="w-[58px] shrink-0 text-end text-[12px] font-black ${lo ? 'text-orange-400' : 'text-white'}"><span dir="ltr">${x.n}</span>${lo ? ` · ${t('Low')}` : ''}</span>
            </div>`; }).join('')}</div>
            <p class="text-[11px] font-bold text-slate-500 mt-3">${t('Aim for about 10–20 sets a week for each muscle.')}</p>
        </div>`;
    };
    const renderPlanWeek = () => {
        const schedule = getActiveSchedule(), today = getTodayId();
        const ws = getWeekStart(), dateOf = id => new Date(ws.getFullYear(), ws.getMonth(), ws.getDate() + id - 1);
        const grip = `<svg width="16" height="20" viewBox="0 0 16 20" fill="currentColor" aria-hidden="true"><circle cx="5" cy="4" r="1.8"/><circle cx="11" cy="4" r="1.8"/><circle cx="5" cy="10" r="1.8"/><circle cx="11" cy="10" r="1.8"/><circle cx="5" cy="16" r="1.8"/><circle cx="11" cy="16" r="1.8"/></svg>`;
        const dayOpts = id => schedule.filter(d => d.id !== id).map(d => `<option value="${d.id}">${esc(dayLong(d.day))}</option>`).join('');
        // ⋯ on a row: copy / swap (the phone's own day list) and clear
        const mItem = 'relative w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-start text-[13px] font-extrabold tap-feedback';
        const daySelect = (fn, id, label) => `<select onchange="if(this.value){window.appState.weekMenu=null;window.appActions.${fn}(${id}, parseInt(this.value));this.value='';}" class="absolute inset-0 w-full h-full opacity-0 z-10" aria-label="${esc(label)}"><option value="">${esc(label)}</option>${dayOpts(id)}</select>`;
        const menu = d => window.appState.weekMenu !== d.id ? '' : `<div class="absolute end-1 top-full mt-1 z-[61] w-[230px] p-1.5 rounded-2xl bg-[#111] border border-white/15 shadow-[0_20px_40px_rgba(0,0,0,0.7)]" role="menu">
                <div class="${mItem} text-slate-200" role="menuitem">${daySelect('copyDayFrom', d.id, t('Copy to another day'))}<i data-lucide="copy" class="w-4 h-4 text-slate-400"></i>${t('Copy to another day')}</div>
                <div class="${mItem} text-slate-200" role="menuitem">${daySelect('swapDayFrom', d.id, t('Swap with another day'))}<i data-lucide="arrow-up-down" class="w-4 h-4 text-slate-400"></i>${t('Swap with another day')}</div>
                ${!d.isRest && (d.exercises || []).length ? `<button onclick="window.appState.weekMenu=null;window.appActions.clearDayFrom(${d.id})" class="${mItem} text-red-400" role="menuitem"><i data-lucide="trash-2" class="w-4 h-4"></i>${t('Clear this day')}</button>` : ''}
            </div>`;
        const row = d => {
            const empty = !d.isRest && !(d.exercises || []).length, n = (d.exercises || []).reduce((a, ex) => a + (parseInt(ex.sets) || 0), 0);
            const title = d.isRest ? t(d.recoveryType === 'active' ? 'Active Rest' : 'Complete Rest') : empty ? t('Empty') : t(d.title);
            const meta = d.isRest ? '' : empty ? `<span class="text-[#d4af37]">＋ ${t('Add exercises')}</span>` : `${t('{n} exercises', { n: d.exercises.length })} · ${t('{n} sets', { n })}`;
            const open = window.appState.weekMenu === d.id;
            return `<div class="glass-card plan-ex plan-day ${d.isRest ? 'is-rest' : ''} h-[62px] flex items-center gap-1.5 relative ${open ? 'z-20' : ''}">
                <span class="handle w-9 h-11 shrink-0 flex items-center justify-center text-slate-500" aria-label="${esc(t('Drag to reorder'))}" role="img">${grip}</span>
                <button onclick="window.appActions.openPlanDay(${d.id})" class="flex-1 min-w-0 h-full flex items-center gap-2.5 text-start tap-feedback" aria-label="${esc(dayLong(d.day) + ' · ' + title)}">
                    ${d.isRest ? `<i data-lucide="${d.recoveryType === 'active' ? 'footprints' : 'moon'}" class="w-4 h-4 text-slate-500 shrink-0"></i>` : empty ? '<span class="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>' : ''}
                    <span class="flex-1 min-w-0"><span class="block text-[15px] font-black leading-tight truncate ${d.isRest || empty ? 'text-slate-400' : 'text-white'}">${esc(title)}</span>${meta ? `<span class="block text-[11.5px] font-bold text-slate-400 mt-0.5 truncate">${meta}</span>` : ''}</span>
                </button>
                <button onclick="window.appActions.toggleWeekMenu(${d.id})" class="w-9 h-11 shrink-0 flex items-center justify-center rounded-xl tap-feedback ${open ? 'text-[#d4af37]' : 'text-slate-400'}" aria-haspopup="menu" aria-expanded="${open}" aria-label="${esc(t('Day options') + ' · ' + dayLong(d.day))}"><i data-lucide="ellipsis-vertical" class="w-[18px] h-[18px]"></i></button>
                ${menu(d)}
            </div>`;
        };
        let html = `<div class="flex items-center justify-between gap-2 px-1 mb-2.5">
                <span class="min-w-0"><span class="block text-[11px] font-black text-[#d4af37] uppercase tracking-widest">${t('This week')}</span><span class="block text-[11px] font-bold text-slate-400">${t('Tap a day to edit it')}</span></span>
                <button onclick="window.appActions.openPrograms()" class="shrink-0 flex items-center gap-1.5 h-10 px-3.5 rounded-full border text-[11px] font-black bg-[#d4af37]/10 border-[#d4af37]/40 text-[#d4af37] tap-feedback"><i data-lucide="layout-list" class="w-4 h-4"></i>${t('Programs')}</button>
            </div>
            <div class="flex gap-2">
                <div class="w-11 shrink-0 flex flex-col gap-2" aria-hidden="true">${schedule.map(d => `<div class="h-[62px] flex flex-col items-center justify-center rounded-2xl ${d.id === today ? 'bg-[#d4af37]/15 text-[#d4af37]' : 'text-slate-400'}"><span class="text-[10px] font-black uppercase">${esc(dayShort(d.day))}</span><span class="text-[16px] font-black leading-tight ${d.id === today ? '' : 'text-white'}">${dateOf(d.id).getDate()}</span></div>`).join('')}</div>
                <div id="week-list" class="flex-1 min-w-0 flex flex-col gap-2">${schedule.map(row).join('')}</div>
            </div>
            ${muscleBalanceHTML(schedule)}
            <div class="h-10"></div>`;
        document.getElementById('workout-container').innerHTML = `<div class="plan-scope ${enterClass('week')}">${html}</div>`;
        if (window.appState.sortableInstance) { window.appState.sortableInstance.destroy(); window.appState.sortableInstance = null; }
        const listEl = document.getElementById('week-list');
        if (listEl && window.Sortable) {
            window.appState.sortableInstance = new Sortable(listEl, {
                handle: '.handle', animation: 220, forceFallback: true, fallbackOnBody: true, fallbackTolerance: 3,
                scroll: document.querySelector('.scrollable-content'), scrollSensitivity: 50, scrollSpeed: 8, bubbleScroll: false,
                chosenClass: 'plan-chosen', ghostClass: 'plan-ghost', fallbackClass: 'plan-drag', dragClass: 'plan-drag',
                onStart: () => { try { if (navigator.vibrate) navigator.vibrate(15); } catch (e) {} },
                onEnd: evt => {
                    if (evt.oldIndex === evt.newIndex) return;
                    // the weekdays stay; the workouts move between them
                    const take = () => schedule.map(d => { const o = {}; DAY_KEYS.forEach(k => { o[k] = d[k]; }); return o; });
                    const before = take(), next = take();
                    next.splice(evt.newIndex, 0, next.splice(evt.oldIndex, 1)[0]);
                    schedule.forEach((d, i) => Object.assign(d, next[i]));
                    StorageManager.setPlan(appData); renderNav(); renderWorkout();
                    window.appActions.showToast(t('Week order saved'), 'success', { label: t('Undo'), fn: () => { schedule.forEach((d, i) => Object.assign(d, before[i])); StorageManager.setPlan(appData); renderNav(); renderWorkout(); } });
                }
            });
        }
        if (window.lucide) window.lucide.createIcons();
        if (typeof hint === 'function') hint('plan-week', '#week-list > div', t('Tap a day to edit it. Hold ⋮⋮ and drag to move it to another day.'));
    };

    // ⚙️ 5. GLOBAL ACTIONS
    window.appActions = {
        showToast: (m, type='success', action=null) => {
            const c = document.getElementById('toast-container'); c.innerHTML=''; const d=document.createElement('div'), iS=type==='success', cS=iS?'text-[#22c55e]':'text-red-400', bS=iS?'bg-[#22c55e]/10 border-[#22c55e]/20':'bg-red-500/10 border-red-500/20';
            d.className=`glass-card p-4 flex items-center gap-3 border shadow-2xl transform translate-y-full opacity-0 transition-all duration-500 mt-2 ${bS} backdrop-blur-3xl pointer-events-auto`;
            d.innerHTML=`<i data-lucide="${iS?'check-circle':'alert-circle'}" class="w-5 h-5 shrink-0 ${cS}"></i><span class="text-[13px] font-bold text-white leading-snug flex-1">${esc(m)}</span>${action ? `<button class="shrink-0 px-3 py-1.5 rounded-lg bg-white/10 text-white text-[11px] font-black uppercase tracking-widest tap-feedback">${esc(action.label)}</button>` : ''}`;
            if (action) d.querySelector('button').onclick = () => { action.fn(); d.remove(); };
            c.appendChild(d); if(window.lucide) window.lucide.createIcons({root:d}); void d.offsetWidth; d.classList.remove('translate-y-full','opacity-0');
            setTimeout(()=>{if(c.contains(d)){d.classList.add('opacity-0','translate-y-full');setTimeout(()=>{if(c.contains(d))d.remove();},500);}}, action ? 5000 : 3500);
        },
        showConfirm: (title, m, ok, dng=false, okLabel=null) => {
            const y = document.getElementById('confirm-yes-btn');
            y.innerHTML = `<span>${esc(okLabel || t('Yes, Do it'))}</span>`;
            document.getElementById('confirm-title').innerText=title; document.getElementById('confirm-message').innerText=m;
            y.className=`flex-1 rounded-xl py-3.5 text-[12px] font-black uppercase tracking-widest shadow-lg tap-feedback ${dng?'text-white bg-red-500 shadow-red-500/20':'text-black bg-[#d4af37] shadow-[#d4af37]/20'}`;
            document.getElementById('confirm-icon').innerHTML=`<i data-lucide="${dng?'alert-octagon':'alert-triangle'}" class="w-6 h-6 ${dng?'text-red-500':'text-[#d4af37]'}"></i>`;
            if(window.lucide) window.lucide.createIcons({root: document.getElementById('confirm-icon')});
            const nY = y.cloneNode(true); y.parentNode.replaceChild(nY,y); nY.onclick=()=>{nY.onclick=null;window.appActions.closeConfirm();setTimeout(ok,200);}; // runs once, even on a double tap
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
                window.appState.ciOpen = false;
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
            window.appState.ciOpen = true;
            renderWorkout();
        },
        toggleCheckIn: () => { window.appState.ciOpen = !window.appState.ciOpen; renderWorkout(); },
        // Exercise pop-up on Today: everything about the exercise, Start workout (this exercise only) and History
        openExSheet: i => {
            const day = getActiveSchedule().find(d => d.id === activeDay), ex = day && day.exercises[i]; if (!ex) return;
            const history = StorageManager.getHistory(), k = getExKey(currentWeekId, day.id, i, ex.name), hA = history[k] || [];
            const S = window.appState.sess, timed = isTimed(ex.reps), planned = parseInt(ex.sets) || 0, doneSets = setsThisWeekForDay(hA, day.id);
            const easy = day.id === getTodayId() && (getReadinessToday() || {}).level === 'low', sg = suggestionFor(hA, ex, easy);
            const isRun = S && S.dayId === day.id && (!S.weekId || S.weekId === currentWeekId) && (S.exIdx === i || S.exIdx == null);
            // sets past the plan count too (4 of 3 = +1 extra); the target only shows while sets are left this week
            const lastDay = lastDaySets(hA, day.id), prev = lastDay ? lastDay.sets : [], full = planned > 0 && doneSets >= planned, shown = doneSets, extra = Math.max(0, doneSets - planned);
            const tile = (label, value) => `<div class="rounded-2xl bg-white/5 px-3.5 py-2.5 min-w-0"><div class="text-[10px] font-black text-slate-500 uppercase tracking-widest">${label}</div><div class="text-[22px] font-black text-white leading-tight mt-0.5"><span dir="ltr">${value}</span></div></div>`;
            const tgtCls = sg ? { up: 'is-up', down: 'is-down' }[sg.type] || '' : '';
            document.getElementById('ex-sheet-content').innerHTML = `<div class="px-5 pt-1">
                <div class="flex items-start gap-2">
                    <div class="flex-1 min-w-0">
                        <div class="text-[10px] font-black text-[#d4af37] uppercase tracking-widest">${esc(tm(ex.muscle))}</div>
                        <h3 class="ex-name text-[22px] font-black text-white leading-tight mt-0.5">${esc(ex.name)}</h3>
                    </div>
                    <button onclick="window.appActions.openHistoryModal(${jsArg(k)},${jsArg(ex.name)})" class="w-10 h-10 shrink-0 rounded-full bg-white/5 text-slate-300 flex items-center justify-center tap-feedback" aria-label="${esc(t('History'))}" title="${esc(t('History'))}"><i data-lucide="history" class="w-[18px] h-[18px]"></i></button>
                    <button onclick="window.appActions.closeExSheet()" class="w-10 h-10 shrink-0 rounded-full bg-white/5 text-slate-400 flex items-center justify-center tap-feedback" aria-label="${esc(t('Close'))}"><i data-lucide="x" class="w-5 h-5"></i></button>
                </div>
                <div class="ex-week ${full ? 'is-full' : shown > 0 ? 'is-part' : ''} mt-4">
                    <div class="flex items-baseline justify-between gap-2"><span class="text-[12px] font-black">${t('Done this week')}</span><b class="text-[15px] font-black">${extra ? `${t('{a} of {b} sets', { a: shown, b: planned })} <span class="ex-extra">${t('+{n} extra', { n: extra })}</span>` : full ? t('All {n} sets', { n: planned }) : t('{a} of {b} sets', { a: shown, b: planned })}</b></div>
                    <div class="ex-segs" dir="ltr">${Array.from({ length: Math.max(planned, shown) }, (_, k) => `<i class="${k >= planned ? 'is-extra' : k < shown ? 'is-on' : ''}"></i>`).join('')}</div>
                </div>
                <div class="grid grid-cols-2 gap-2 mt-2.5">${tile(t('Sets'), esc(ex.sets))}${tile(t(timed ? 'Seconds per set' : 'Reps per set'), esc(fmtReps(ex.reps)))}</div>
                ${sg && !full ? `<div class="ex-target ${tgtCls} mt-2"><i data-lucide="target" class="w-[18px] h-[18px] shrink-0"></i><div class="min-w-0"><div class="ex-target-l">${t("Today's target")}${sg.type !== 'build' ? ` · ${t(SUGG[sg.type].label).replace(/[:：]\s*$/, '')}` : ''}</div><div class="text-[16px] font-black text-white">${targetSentence(sg, timed)}</div></div></div>` : ''}
                <div class="mt-3">
                    <div class="flex justify-between px-0.5 mb-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest"><span>${t('Last time')}</span><span>${lastDay ? esc(isToday(lastDay.ts) ? t('Today') : fmtDate(lastDay.ts, false)) : ''}</span></div>
                    ${prev.length ? `<table class="ex-last-tbl" dir="ltr"><thead><tr><th>#</th><th>${t('KG')}</th><th>${t(timed ? 'SEC' : 'REPS')}</th></tr></thead><tbody>${prev.map((x, k) => `<tr><td>${t('Set {n}', { n: k + 1 })}</td><td>${x.w > 0 ? x.w : t('BW')}</td><td>${x.r}</td></tr>`).join('')}</tbody></table>`
                        : `<div class="rounded-2xl bg-white/5 px-3.5 py-3 text-[13px] font-bold text-slate-400">${t('First time doing this exercise')}</div>`}
                </div>
                <button onclick="window.appActions.closeExSheet(); window.appActions.startWorkout(${day.id}, null, ${i})" class="w-full mt-4 py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-black uppercase tracking-widest tap-feedback flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.35)]">${isRun ? '<span class="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>' : '<i data-lucide="play" class="w-5 h-5 fill-current"></i>'}${isRun ? t('Continue workout') : full ? t('Log more sets') : shown > 0 ? t('Continue') : t('Start workout')}</button>
            </div>`;
            if (window.lucide) window.lucide.createIcons({ root: document.getElementById('ex-sheet-box') });
            openModal('ex-sheet-overlay', 'ex-sheet-box');
            pushBack('exsheet', () => window.appActions.closeExSheet());
        },
        closeExSheet: () => { popBack('exsheet'); closeModal('ex-sheet-overlay', 'ex-sheet-box'); },
        // Dark (default) or light look; remembered on this phone
        setTheme: v => {
            const light = v === 'light';
            try { localStorage.setItem('workoutTheme_rakan_final', light ? 'light' : 'dark'); } catch (e) {}
            if (light) document.documentElement.setAttribute('data-theme', 'light'); else document.documentElement.removeAttribute('data-theme');
            const m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', light ? '#f3f3f0' : '#000000');
            const sel = document.getElementById('setting-theme'); if (sel) sel.value = light ? 'light' : 'dark';
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
        skipCheckIn: () => { window.appState.ciSkipped = dateKey(); window.appState.ciOpen = false; renderWorkout(); },
        refreshUI: () => renderWorkout(),
        openHistoryModal: (k, title) => { window.appState.historyEditMode=false; window.appState.openHistoryKey=k; const b=document.getElementById('history-edit-btn'); if(b){b.classList.remove('text-[#d4af37]','bg-[#d4af37]/10');b.classList.add('text-slate-400','bg-white/5');} document.getElementById('history-modal-title').innerText=title; const hw=document.getElementById('history-howto'); if(hw) hw.href=`https://www.youtube.com/results?search_query=${encodeURIComponent(title+' exercise form')}`; window.appActions.refreshHistoryModal(k); const o=document.getElementById('history-modal-overlay'),bx=document.getElementById('history-modal-box'); o.classList.remove('hidden'); o.classList.add('flex'); requestAnimationFrame(()=>{o.classList.remove('opacity-0');bx.classList.remove('translate-y-full','md:translate-y-0','md:scale-95');}); pushBack('history', () => window.appActions.closeHistoryModal()); },
        closeHistoryModal: () => { popBack('history'); const o=document.getElementById('history-modal-overlay'),b=document.getElementById('history-modal-box'); o.classList.add('opacity-0'); b.classList.add('translate-y-full'); if(window.innerWidth>=768)b.classList.add('md:scale-95'); setTimeout(()=>{if(o.classList.contains('opacity-0')){o.classList.add('hidden');o.classList.remove('flex');}},300); },
        toggleHistoryEdit: () => { window.appState.historyEditMode=!window.appState.historyEditMode; const b=document.getElementById('history-edit-btn'); if(b){b.className=`p-2 rounded-full tap-feedback transition-colors ${window.appState.historyEditMode?'text-[#d4af37] bg-[#d4af37]/10':'text-slate-400 bg-white/5 hover:text-[#d4af37]'}`;} if(window.appState.openHistoryKey)window.appActions.refreshHistoryModal(window.appState.openHistoryKey); },
        refreshHistoryModal: (k) => { const c=document.getElementById('history-modal-content'), hA=StorageManager.getHistory()[k]||[]; if(!hA.length){c.innerHTML=`<div class="text-center p-10 text-slate-500 text-[12px] font-bold uppercase tracking-widest">${t('No records')}</div>`;return;} let html='',cG=''; const getDt=(h, fb=Date.now())=>{const t=logTime(h); return new Date(isNaN(t)?fb:t);}, sD=getDt(hA[0]); sD.setHours(0,0,0,0); [...hA].reverse().forEach((h,i)=>{const dt=getDt(h, sD.getTime()); dt.setHours(0,0,0,0); const dD=Math.max(0,Math.floor((dt.getTime()-sD.getTime())/86400000)), wN=Math.floor(dD/7)+1, cWS=new Date(sD.getTime()+((wN-1)*604800000)), cWE=new Date(cWS.getTime()+518400000), gN=`${t('WEEK {n}', { n: wN })} • ${fmtDayMonth(cWS)} - ${fmtDayMonth(cWE)}`; if(gN!==cG){html+=`<div class="text-[10px] font-black text-[#d4af37] uppercase tracking-[2px] mt-4 mb-2 pl-1 border-b border-[#d4af37]/20 pb-1"><i data-lucide="calendar-days" class="w-3 h-3 inline mr-1 -mt-0.5"></i> ${esc(gN)}</div>`; cG=gN;}
         html+=`<div class="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 mb-2"><div class="flex flex-col"><div class="flex items-center"><span class="text-[15px] font-black text-white">${(h.ws || h.rpe) ? `<span class="text-[#d4af37]">${logSetDetails(h).map(x => `${x.w > 0 ? x.w : t('BW')}×${x.r}${h.u==='s'?'s':''}${x.rpe ? `<span class="text-[10px] text-slate-400">@${x.rpe}</span>` : ''}`).join(', ')}</span>` : `${parseFloat(h.w)>0?`${esc(h.w)} <span class="text-[10px] text-slate-400">${t('KG')}</span>`:t('BW')} ${h.s?`<span class="ml-2 text-[#d4af37]">${esc(Array.isArray(h.s) ? h.s.join(', ') : h.s)} <span class="text-[10px] text-slate-400">${h.u==='s'?t('SEC'):t('REPS')}</span></span>`:''}`}</span></div><span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">${esc(isNaN(logTime(h)) ? h.d : fmtDate(logTime(h)))} ${h.time ? `<span class="ml-2 text-[#22c55e]"><i data-lucide="clock" class="w-3 h-3 inline -mt-0.5"></i> ${esc(h.time)}</span>` : ''}</span></div>${window.appState.historyEditMode?`<button onclick="window.appActions.deleteHistoryRecord(${jsArg(k)}, ${hA.length-1-i})" class="p-2 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20"><i data-lucide="trash-2" class="w-4 h-4"></i></button>`:''}</div>`; }); c.innerHTML=exerciseStatsHTML(hA)+html; bindCharts(c); if(window.lucide) window.lucide.createIcons({root:c}); },
        deleteHistoryRecord: (k, i) => window.appActions.showConfirm(t("Delete Record"), t("Remove this record?"), () => { let h=StorageManager.getHistory(); if(h[k]&&h[k][i]){const dl=getDeleted(); dl[k]=[...(dl[k]||[]), logSig(h[k][i])].slice(-200); setDeleted(dl); h[k].splice(i,1); StorageManager.setHistory(h); loggedWeights[k]=h[k].length?h[k][h[k].length-1].w:''; loggedReps[k]=h[k].length?h[k][h[k].length-1].s||'':''; StorageManager.set(loggedWeights); StorageManager.setReps(loggedReps); window.appActions.refreshHistoryModal(k); renderWorkout(); window.appActions.showToast(t("Deleted"),"error");} }, true),
        handleTyping: (k, type, v) => { 
            if (type === 'load') { loggedWeights[k] = v; StorageManager.set(loggedWeights); } 
            else { loggedReps[k] = v; StorageManager.setReps(loggedReps); }
        },
        restoreIfEmpty: (k, v) => { if(v.trim()===''){const h=StorageManager.getHistory()[k]||[]; if(h.length){loggedWeights[k]=h[h.length-1].w; StorageManager.set(loggedWeights); renderWorkout();}} },
        // ---------- Workout session: the whole day on one screen ----------
        // restore = a saved unfinished workout to bring back (minimized)
        // exIdx = one exercise of the day (from its card on Today); null = the whole day
        startWorkout: (dayId = activeDay, restore = null, exIdx = null) => {
            const S0 = window.appState.sess;
            if (S0 && !restore) {
                if (S0.dayId === dayId && (!S0.weekId || S0.weekId === currentWeekId) && (S0.exIdx == null || S0.exIdx === exIdx)) return window.appActions.expandSession();
                if (sessionHasData()) return window.appActions.showConfirm(t('Discard current session?'), t('Unsaved sets for {name} will be lost.', { name: t(S0.title) }), () => { window.appActions.discardSession(); window.appActions.startWorkout(dayId, null, exIdx); }, true);
                window.appActions.discardSession();
            }
            const day = getActiveSchedule().find(x => x.id === dayId);
            if (!day || day.isRest || !day.exercises.length) return;
            if (exIdx != null && !day.exercises[exIdx]) return;
            const history = StorageManager.getHistory();
            const easy = dayId === getTodayId() && (getReadinessToday() || {}).level === 'low';
            const S = window.appState.sess = restore ? { ...restore } : {
                dayId, title: exIdx != null ? day.exercises[exIdx].name : day.title, dayTitle: day.title, exIdx, startedAt: Date.now(), weekId: currentWeekId, showRpe: StorageManager.getShowRpe(),
                exercises: day.exercises.map((ex, i) => {
                    if (exIdx != null && i !== exIdx) return null;
                    const k = getExKey(currentWeekId, dayId, i, ex.name), hA = history[k] || [];
                    const sg = suggestionFor(hA, ex, easy), last = getLastSession(hA);
                    // Pre-filled weight: suggestion, else what you typed before, else last session
                    const typed = loggedWeights[k] !== undefined && String(loggedWeights[k]).trim() !== '' ? parseFloat(loggedWeights[k]) : 0;
                    const pw = sg ? (sg.w > 0 ? String(sg.w) : '') : typed > 0 ? String(typed) : last && last.w > 0 ? String(last.w) : '';
                    const weekStart = getWeekStart().getTime();
                    const logged = hA.filter(l => { const t = logTime(l); return !isNaN(t) && t >= weekStart && (!l.weekId || l.weekId === currentWeekId) && logDayId(l) === dayId; }).flatMap(logSetDetails);
                    return { k, name: ex.name, muscle: ex.muscle, sets: Math.max(1, parseInt(ex.sets) || 1), repsStr: ex.reps, timed: isTimed(ex.reps),
                        offset: setsThisWeekForDay(hA, dayId), logged, pw, pr: sg ? sg.r : parseRange(ex.reps).minR, sg };
                }).filter(Boolean)
            };
            delete S.rows;
            window.appActions.renderSession(restore ? restore.rows : null);
            clearInterval(window.appState.awTimer);
            window.appState.awTimer = setInterval(window.appActions.sessionTick, 250);
            window.appActions.sessionTick();
            keepAwake(true);
            openSheet('active-workout-overlay', 'active-workout-box'); pushBack('session', sessionBack);
            if (!restore) hint('sess-check', '[id^=aw-rep-]', t('Type the KG and reps you did. The set turns green by itself.'), 800);
            saveSessionDraft();
            renderWorkout();
        },
        renderSession: (rows = null) => {
            const S = window.appState.sess; if (!S) return;
            if (typeof S.showRpe !== 'boolean') S.showRpe = StorageManager.getShowRpe();
            const showRpe = S.showRpe;
            S.cols = showRpe ? '28px minmax(0,1fr) minmax(0,1fr) 56px' : '28px minmax(0,1fr) minmax(0,1fr)';
            S.rowSeq = 0; // rows are numbered from 1 again every time the table is built
            // one exercise: the day's name on top (the exercise's own name is right below it)
            document.getElementById('aw-title').innerText = t(S.exIdx != null && S.dayTitle ? S.dayTitle : S.title);
            document.getElementById('aw-status-text').innerText = t('Workout');
            document.getElementById('aw-pulse-dot').className = 'w-2 h-2 rounded-full shrink-0 bg-red-500 animate-pulse';
            document.getElementById('aw-mini-name').innerText = t(S.title);
            const head = ex => `<div class="grid items-center gap-1.5 px-2 pb-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest" dir="ltr" style="grid-template-columns:${S.cols}"><span class="text-center">#</span><span class="text-center">${t('KG')}</span><span class="text-center">${ex.timed ? t('SEC') : t('REPS')}</span>${showRpe ? '<span class="text-center">RPE</span>' : ''}</div>`;
            document.getElementById('aw-sets-container').innerHTML = S.exercises.map((ex, e) => `
                <section class="mb-6" id="aw-ex-${e}">
                    <div class="flex items-start justify-between gap-2 px-1 mb-2">
                        <div class="min-w-0">
                            <div class="ex-name text-[17px] font-black text-white leading-tight">${esc(ex.name)}</div>
                            <div class="text-[11px] font-bold text-slate-400 mt-0.5">${esc(tm(ex.muscle))} · ${t('{n} sets', { n: ex.sets })} · ${t(ex.timed ? '{r} sec' : '{r} reps', { r: `<span dir="ltr">${esc(fmtReps(ex.repsStr))}</span>` })}</div>
                        </div>
                        <span class="shrink-0">${suggestionChip(ex.sg, ex.timed)}</span>
                    </div>
                    ${(() => { const last = lastSessionText(StorageManager.getHistory()[ex.k] || [], ex.timed); return `<div class="flex items-center gap-2 mx-1 mb-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/5 text-[12px] font-bold text-slate-400"><i data-lucide="history" class="w-4 h-4 shrink-0 text-slate-500"></i>${last ? `<span class="min-w-0">${t('Last time')} · ${esc(last.when)}<span class="block text-[14px] font-black text-white mt-0.5" dir="ltr">${last.body}</span></span>` : `<span>${t('First time')}</span>`}</div>`; })()}
                    ${head(ex)}
                    <div id="aw-rows-${e}" class="space-y-1.5"></div>
                    <div id="aw-note-${e}" class="hidden px-2 py-2 text-[11px] font-black text-[#22c55e]"><i data-lucide="check" class="w-3.5 h-3.5 inline -mt-0.5"></i> ${t('Done this week')}</div>
                    <div class="flex gap-2 mt-2 px-1">
                        <button onclick="window.appActions.removeSetRow(${e})" class="py-2 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-400 tap-feedback" aria-label="${esc(t('Remove set'))}"><i data-lucide="minus" class="w-4 h-4"></i></button>
                        <button onclick="window.appActions.addSetRow(${e})" class="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-widest text-slate-300 tap-feedback flex items-center justify-center gap-1.5"><i data-lucide="plus" class="w-4 h-4"></i>${t('Add set')}</button>
                    </div>
                </section>`).join('');
            if (rows && rows.length) rows.forEach(r => { if (S.exercises[r.e]) window.appActions.addSetRow(r.e, r, true); });
            else S.exercises.forEach((ex, e) => {
                // sets you already did (green, can't be changed), then empty ones; "Log more sets" gets one new set
                (ex.logged || []).forEach(x => window.appActions.addSetRow(e, { w: x.w > 0 ? String(x.w) : '', r: String(x.r), rpe: '', done: true, logged: true }, true));
                const n = Math.max(0, ex.sets - ex.offset) || (S.exIdx != null ? 1 : 0);
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
            const old = document.getElementById('aw-progress-fill'), prevPct = old ? parseFloat(old.style.width) || 0 : pct;
            document.getElementById('aw-info').innerHTML = `<div class="w-full"><div class="flex justify-between text-[11px] font-black mb-1.5"><span class="text-slate-400">${S.exercises.length > 1 ? t('{n} exercises', { n: S.exercises.length }) : ''}</span><span class="text-white" dir="ltr">${done.length} / ${all.length} ${t('sets')}</span></div><div class="w-full h-2 bg-black/60 rounded-full overflow-hidden"><div id="aw-progress-fill" class="bar-fill h-full bg-[#22c55e] rounded-full" style="width:${prevPct}%"></div></div></div>`;
            const fill = document.getElementById('aw-progress-fill'); void fill.offsetWidth; fill.style.width = pct + '%';
        },
        // Adds one set row to exercise e
        addSetRow: (e, r = null, building = false) => {
            const S = window.appState.sess; if (!S || !S.exercises[e]) return;
            const ex = S.exercises[e], box = document.getElementById(`aw-rows-${e}`);
            const rowsNow = box.querySelectorAll('.aw-row');
            // set number: done sets are rows here too (older saved workouts didn't show them)
            const n = rowsNow.length + 1 + (ex.logged ? 0 : ex.offset);
            if (!r) {
                // KG is filled in (the set above, else the same set last time); reps stay empty for you to type
                const above = rowsNow.length ? (document.getElementById(`aw-w-${rowsNow[rowsNow.length - 1].dataset.i}`) || {}).value : '';
                const prev = lastSessionSets(StorageManager.getHistory()[ex.k] || []), p = prev[n - 1] || prev[prev.length - 1];
                r = { w: building ? (p && p.w > 0 ? String(p.w) : '') : (above || (p && p.w > 0 ? String(p.w) : '')), r: '', rpe: '', done: false };
            }
            S.rowSeq = (S.rowSeq || 0) + 1;
            const i = S.rowSeq;
            const showRpe = S.showRpe;
            const inCls = 'w-full h-11 rounded-lg bg-black/50 border border-white/10 text-center text-[16px] font-black text-white outline-none focus:border-[#d4af37] placeholder:text-slate-600 placeholder:font-bold';
            box.insertAdjacentHTML('beforeend', `
                <div class="aw-row grid items-center gap-1.5 px-2 py-1 rounded-xl transition-colors ${r.done ? 'is-done' : ''} ${r.logged ? 'is-logged' : ''}" data-i="${i}" data-e="${e}" data-done="${r.done ? 1 : 0}" ${r.logged ? 'data-logged="1"' : ''} id="aw-row-${i}" dir="ltr" style="grid-template-columns:${S.cols}">
                    <span class="w-7 h-7 rounded-full ${r.done ? 'bg-[#22c55e] text-black' : 'bg-white/5 text-slate-300'} text-[12px] font-black flex items-center justify-center" id="aw-num-${i}">${n}</span>
                    <input id="aw-w-${i}" type="text" inputmode="decimal" autocomplete="off" value="${esc(r.w)}" ${r.logged ? 'disabled' : ''} placeholder="${isBodyweight(ex.name) ? t('BW') : t('KG')}" oninput="window.appActions.numInput(this, true)" class="${inCls} text-[#d4af37]">
                    <input id="aw-rep-${i}" type="text" inputmode="numeric" autocomplete="off" value="${esc(r.r)}" ${r.logged ? 'disabled' : ''} placeholder="${ex.timed ? t('SEC') : t('REPS')}" oninput="window.appActions.numInput(this, false)" onblur="window.appActions.repsChanged(${i})" onkeydown="if(event.key==='Enter')this.blur()" class="${inCls}">
                    ${showRpe ? `<select id="aw-rpe-${i}" ${r.logged ? 'disabled' : ''} onchange="window.appActions.sessionChanged()" class="${inCls} appearance-none text-[14px]"><option value="">–</option>${[6,7,8,9,10].map(x => `<option value="${x}" ${String(r.rpe) === String(x) ? 'selected' : ''}>${x}</option>`).join('')}</select>` : ''}
                </div>`);
            document.getElementById(`aw-note-${e}`).classList.add('hidden');
            if (!building) { if (window.lucide) window.lucide.createIcons({ root: box }); window.appActions.updateSessionInfo(); saveSessionDraft(); }
        },
        removeSetRow: e => {
            const rows = document.querySelectorAll(`#aw-rows-${e} .aw-row`);
            if (rows.length && rows[rows.length - 1].dataset.logged !== '1') { rows[rows.length - 1].remove(); if (rows.length === 1) document.getElementById(`aw-note-${e}`).classList.remove('hidden'); window.appActions.updateSessionInfo(); saveSessionDraft(); }
        },
        // Reps typed, then the box is left (keyboard Done/Enter or tapping elsewhere): the set turns green by itself; emptying it undoes that.
        // Uses blur, not change: change never fires after numInput turns Arabic digits (٨) into 8
        repsChanged: i => {
            const row = document.getElementById(`aw-row-${i}`), ok = parseInt((document.getElementById(`aw-rep-${i}`) || {}).value) > 0;
            if (row && ok !== (row.dataset.done === '1')) window.appActions.completeSet(i);
        },
        sessionChanged: () => saveSessionDraft(),
        // KG / reps boxes: Arabic digits (٤٫٥ or ٤،٥) become 4.5, anything that isn't a number is dropped
        numInput: (el, decimal) => {
            let v = latinDigits(el.value).replace(/[\u066B\u066C\u060C\u2396,]/g, '.'); // every decimal / comma mark an Arabic keypad can type
            v = decimal ? v.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').slice(0, 6) : v.replace(/[^0-9]/g, '').slice(0, 3);
            if (v !== el.value) el.value = v;
            saveSessionDraft();
        },
        // Marks a set done (or not done again), starts the rest timer and scrolls to the next set
        completeSet: i => {
            const row = document.getElementById(`aw-row-${i}`), inp = document.getElementById(`aw-rep-${i}`);
            if (!row || !inp) return;
            const setDone = on => {
                row.dataset.done = on ? '1' : '0';
                row.classList.toggle('is-done', on);
                const num = document.getElementById(`aw-num-${i}`);
                if (num) num.className = `w-7 h-7 rounded-full ${on ? 'bg-[#22c55e] text-black' : 'bg-white/5 text-slate-300'} text-[12px] font-black flex items-center justify-center`;
            };
            if (row.dataset.done === '1') { setDone(false); window.appActions.updateSessionInfo(); saveSessionDraft(); return; }
            if (!(parseInt(inp.value) > 0)) return;
            setDone(true);
            row.classList.remove('row-flash'); void row.offsetWidth; row.classList.add('row-flash');
            if (navigator.vibrate) navigator.vibrate(30);
            window.appActions.updateSessionInfo();
            const next = [...document.querySelectorAll('#aw-sets-container .aw-row')].find(r => r.dataset.done !== '1');
            if (next) {
                window.appActions.startRest(StorageManager.getRestSeconds());
                hint('sess-rest', '#aw-rest', t('Rest timer: it starts by itself. Use −15 / +15 or Skip.'), 500);
                setTimeout(() => next.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
            }
            saveSessionDraft();
        },
        startRest: secs => {
            const S = window.appState.sess; if (!S) return;
            window.appState.awRestEnd = Date.now() + secs * 1000; window.appState.awRestTotal = secs * 1000; S.restOver = false;
            const bar = document.getElementById('aw-rest');
            if (bar.classList.contains('hidden')) { bar.classList.remove('hidden'); bar.classList.add('flex'); bar.classList.remove('slide-up'); void bar.offsetWidth; bar.classList.add('slide-up'); }
            document.getElementById('aw-rest-time').classList.remove('rest-urgent');
            document.getElementById('aw-rest-label').innerText = t('Rest');
            window.appActions.sessionTick();
        },
        restAdd: secs => { if (window.appState.awRestEnd) { window.appState.awRestEnd = Math.max(Date.now() + 1000, window.appState.awRestEnd + secs * 1000); window.appState.awRestTotal = Math.max(window.appState.awRestTotal || 0, window.appState.awRestEnd - Date.now()); window.appActions.sessionTick(); } },
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
                const rt = document.getElementById('aw-rest-time'), rb = document.getElementById('aw-rest-bar');
                if (rb) rb.style.width = `${Math.max(0, Math.min(100, (window.appState.awRestEnd - Date.now()) / (window.appState.awRestTotal || 1) * 100))}%`;
                if (left > 0) { rest = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`; rt.innerText = rest; rt.classList.toggle('rest-urgent', left <= 3); }
                else if (!S.restOver) {
                    S.restOver = true;
                    document.getElementById('aw-rest-label').innerText = t('Rest over'); rt.innerText = t('GO!'); rt.classList.remove('rest-urgent'); rt.classList.add('pop');
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
            pushBack('session', sessionBack);
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
        finishActiveWorkout: (confirmed = false) => {
            const S = window.appState.sess; if (!S) return;
            const rows = sessionRows().filter(x => S.exercises[x.e] && !x.logged), filled = rows.filter(x => parseInt(x.r) > 0); // sets saved before aren't saved again
            if (!filled.length) return window.appActions.showToast(t("Enter reps for at least 1 set"), "error");
            // a weighted exercise needs a KG (type 0 for bodyweight)
            const bad = filled.find(x => x.w === '' && !isBodyweight(S.exercises[x.e].name));
            if (bad) {
                const row = document.getElementById(`aw-row-${bad.i}`); if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return window.appActions.showToast(t('Enter KG for every set (0 = bodyweight)'), 'error');
            }
            // some sets still empty: make sure that's on purpose
            const left = rows.length - filled.length;
            if (left > 0 && confirmed !== 'yes') return window.appActions.showConfirm(t('Finish workout?'), t('{n} sets are still empty. Only the sets you did will be saved.', { n: left }), () => window.appActions.finishActiveWorkout('yes'));
            // dated when the workout started (a session that runs past midnight stays on its own day)
            const h = StorageManager.getHistory(), n = new Date(S.startedAt || Date.now()), wkId = S.weekId || currentWeekId;
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
                    week: (appData.weeks.find(x => x.id === wkId) || {}).name || 'Routine',
                    weekId: wkId,          // which routine this was logged in
                    dayId: S.dayId         // which day of the routine this was logged for
                };
                if (ex.timed) entry.u = 's';
                if (ws.some(x => x !== w)) entry.ws = ws; // only stored when weights differ per set
                if (rpe.some(x => x !== null)) entry.rpe = rpe;
                (h[ex.k] = h[ex.k] || []).push(entry);
                if (h[ex.k].length > HIST_CAP) h[ex.k] = h[ex.k].slice(-HIST_CAP);
                loggedWeights[ex.k] = w === '0' ? '' : w;
            });
            StorageManager.setHistory(h); StorageManager.set(loggedWeights);
            if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
            const title = S.title, day = S.exIdx != null && wkId === currentWeekId && getActiveSchedule().find(d => d.id === S.dayId);
            // One exercise from Today: a short message (you pick the next exercise yourself), unless that was the last one of the day
            if (day) {
                const fin = exercisesFinished(day, h), n = day.exercises.length;
                const next = [...Array(n).keys()].map(o => (S.exIdx + 1 + o) % n).find(i => !fin[i]);
                if (next !== undefined) {
                    window.appActions.discardSession();
                    renderNav();
                    window.appActions.showToast(t('{name} saved · {n} sets', { name: title, n: sets }) + (prs.length ? ` · ${t('New record')} 🏆` : ''), 'success');
                    return;
                }
                window.appActions.discardSession();
                renderNav();
                return window.appActions.showSummary(daySummary(day, h));
            }
            window.appActions.discardSession();
            renderNav();
            window.appActions.showSummary({ title, duration, sets, volume, prs });
        },
        showSummary: ({ title, duration, sets, volume, prs }) => {
            document.getElementById('summary-title').innerText = `${t(title)} · ${fmtDate(Date.now(), false)}`;
            const stat = (v, l, count) => `<div class="bg-white/5 rounded-xl py-3"><div class="text-[18px] font-black text-white tabular-nums" dir="ltr" ${count !== undefined ? `data-count="${count}"` : ''}>${v}</div><div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">${l}</div></div>`;
            document.getElementById('summary-stats').innerHTML = stat(fmtClock(duration), t('Time')) + stat(0, t('sets'), sets) + stat(0, t('kg lifted'), Math.round(volume));
            document.getElementById('summary-prs').innerHTML = prs.length
                ? `<div class="text-[11px] font-black text-[#d4af37] uppercase tracking-widest mb-2">🏆 ${t('New records')}</div>` + prs.map(x => `<div class="flex justify-between gap-2 py-2 border-b border-white/5 last:border-0"><span class="ex-name text-[13px] font-bold text-white truncate">${esc(x.name)}</span><span class="text-[13px] font-black text-[#22c55e] shrink-0" dir="ltr">${x.w}kg (+${x.plus})</span></div>`).join('')
                : '';
            openModal('summary-overlay', 'summary-box');
            pushBack('summary', () => window.appActions.closeSummary());
            // trophy bounces in, the numbers count up, and new records get a burst of gold
            const box = document.getElementById('summary-box'), tr = box.querySelector('.summary-trophy');
            if (tr) { tr.classList.remove('trophy-in'); void tr.offsetWidth; tr.classList.add('trophy-in'); }
            const nums = document.querySelectorAll('#summary-stats [data-count]'), t0 = performance.now();
            const step = now => { const k = Math.min(1, (now - t0) / 800), e = 1 - Math.pow(1 - k, 3); nums.forEach(el => { el.textContent = Math.round(Number(el.dataset.count) * e).toLocaleString('en-US'); }); if (k < 1) requestAnimationFrame(step); };
            requestAnimationFrame(step);
            box.querySelectorAll('.confetti').forEach(c => c.remove());
            if (prs.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
                const colors = ['#d4af37', '#22c55e', '#ffffff', '#f5d76e'];
                for (let k = 0; k < 28; k++) {
                    const c = document.createElement('span'), a = Math.random() * Math.PI * 2, d = 90 + Math.random() * 120;
                    c.className = 'confetti'; c.style.background = colors[k % colors.length];
                    c.style.setProperty('--x', `${Math.cos(a) * d}px`); c.style.setProperty('--y', `${Math.sin(a) * d - 40}px`); c.style.setProperty('--r', `${Math.random() * 720 - 360}deg`);
                    c.style.animationDelay = `${0.25 + Math.random() * 0.15}s`; c.style.top = '64px';
                    box.appendChild(c); setTimeout(() => c.remove(), 1700);
                }
            }
        },
        closeSummary: () => { popBack('summary'); closeModal('summary-overlay', 'summary-box'); },
        applyGlobalSetsReps: () => {
            let s = latinDigits(document.getElementById('global-sets').value).trim();
            const r = latinDigits(document.getElementById('global-reps').value).trim().slice(0, 20);
            if (s && !(parseInt(s) > 0)) return window.appActions.showToast(t("Enter Sets or Reps"), "error");
            if (s) s = String(Math.min(10, parseInt(s)));
            if (!s && !r) return window.appActions.showToast(t("Enter Sets or Reps"), "error");
            const d = getActiveSchedule().find(x => x.id === activeDay), before = d.exercises.map(ex => ({ ex, sets: ex.sets, reps: ex.reps }));
            d.exercises.forEach(ex => {
                if(s) ex.sets = s;
                if(r) ex.reps = r;
            });
            StorageManager.setPlan(appData);
            renderWorkout();
            window.appActions.showToast(t("Updated all exercises"), "success", { label: t('Undo'), fn: () => {
                before.forEach(b => { b.ex.sets = b.sets; b.ex.reps = b.reps; }); StorageManager.setPlan(appData); renderWorkout();
            } });
        },
        // Settings → Week starts on (see setWeekStart)
        updateStartOfWeek: v => {
            if (!setWeekStart(v)) return;
            activeDay=getTodayId(); const s=document.getElementById('setting-start-day'); if(s)s.value=v; renderNav(false); renderWorkout(); setTimeout(()=>window.appActions.showToast(t('Week starts on {d}', { d: tDay(v) }),"success"),300);
        },
        swapDay: tId => { const s=getActiveSchedule(), d1=s.find(d=>d.id===activeDay), d2=s.find(d=>d.id===tId); if(!d1||!d2)return; const tT=d1.title, tE=JSON.stringify(d1.exercises), tIR=d1.isRest, tRT=d1.recoveryType, tST=d1.savedTitle; d1.title=d2.title; d1.exercises=JSON.parse(JSON.stringify(d2.exercises||[])); d1.isRest=d2.isRest; d1.recoveryType=d2.recoveryType; d1.savedTitle=d2.savedTitle; d2.title=tT; d2.exercises=JSON.parse(tE||'[]'); d2.isRest=tIR; d2.recoveryType=tRT; d2.savedTitle=tST; StorageManager.setPlan(appData); renderWorkout(); renderNav(false); },
        updateDayTitle: v => { getActiveSchedule().find(d=>d.id===activeDay).title=v.trim()||'New Day'; StorageManager.setPlan(appData); renderWorkout(); renderNav(false); },
        updateDayType: v => { const d=getActiveSchedule().find(x=>x.id===activeDay); if(v==='workout'){d.isRest=false; d.recoveryType=null; d.title=d.savedTitle||'New Workout'; if(!d.exercises)d.exercises=[];}else{if(!d.isRest)d.savedTitle=d.title; d.isRest=true; d.recoveryType=v; d.title=v==='active'?'Active Rest':'Complete Rest';} StorageManager.setPlan(appData); renderWorkout(); renderNav(false); },        // Delete straight away, with an Undo button for a few seconds
        deleteEx: i => {
            const d = getActiveSchedule().find(x => x.id === activeDay);
            window.appActions.closeExEdit();
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
            document.getElementById('picker-title').innerText = mode === 'replace' ? t('Change {name}', { name: cur.name }) : t('Add exercises');
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
                    <span class="shrink-0 w-7 h-7 rounded-full flex items-center justify-center border ${sel ? 'bg-[#d4af37] border-[#d4af37] text-black' : 'border-white/20 text-slate-400'}"><i data-lucide="${P.mode === 'replace' ? 'replace' : (sel ? 'check' : 'plus')}" class="w-4 h-4"></i></span>
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
                // 1) choose sets & reps for the new exercise, 2) confirm, 3) Undo for a few seconds
                const ex = d.exercises[P.idx]; if (!ex || ex.name === name) return window.appActions.closePicker();
                const timedNew = TIMED_DEFAULT.includes(name), timedOld = isTimed(ex.reps);
                const reps = timedNew && !timedOld ? '30 - 45s' : !timedNew && timedOld ? '10 - 12' : ex.reps;
                window.appState.swapSetup = { idx: P.idx, name, muscle, sets: String(parseInt(ex.sets) || 3), reps };
                window.appActions.renderSwapSetup();
                openModal('swapsetup-overlay', 'swapsetup-box');
                pushBack('swapsetup', () => window.appActions.closeSwapSetup());
                return;
            }
            const i = P.sel.findIndex(x => x.name === name && x.muscle === muscle);
            if (i >= 0) P.sel.splice(i, 1); else P.sel.push({ name, muscle });
            const top = document.getElementById('picker-list').scrollTop;
            window.appActions.renderPicker(false);
            document.getElementById('picker-list').scrollTop = top;
        },
        // ---------- Change exercise: sets & reps pop-up (after picking the new exercise, before the confirmation) ----------
        renderSwapSetup: () => {
            const W = window.appState.swapSetup; if (!W) return;
            const label = 'px-0.5 mb-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest';
            const c = document.getElementById('swapsetup-content');
            c.innerHTML = `<div class="px-5 pt-1">
                <div class="flex items-start gap-2">
                    <div class="flex-1 min-w-0">
                        <div class="text-[10px] font-black text-[#d4af37] uppercase tracking-widest">${esc(tm(W.muscle))}</div>
                        <h3 class="ex-name text-[22px] font-black text-white leading-tight mt-0.5">${esc(W.name)}</h3>
                        <p class="text-[12px] font-bold text-slate-400 mt-1">${t('How many sets and reps for this exercise?')}</p>
                    </div>
                    <button onclick="window.appActions.closeSwapSetup()" class="w-10 h-10 shrink-0 rounded-full bg-white/5 text-slate-400 flex items-center justify-center tap-feedback" aria-label="${esc(t('Close'))}"><i data-lucide="x" class="w-5 h-5"></i></button>
                </div>
                <div class="${label} mt-4">${esc(t('Sets'))}</div>
                <div class="flex items-center gap-3 rounded-2xl bg-white/5 p-2" dir="ltr">
                    <button onclick="window.appActions.swapSetSets(-1)" class="w-11 h-11 rounded-xl bg-white/5 text-2xl font-black text-white tap-feedback" aria-label="−">−</button>
                    <div class="flex-1 text-center text-[22px] font-black text-white tabular-nums">${esc(W.sets)}</div>
                    <button onclick="window.appActions.swapSetSets(1)" class="w-11 h-11 rounded-xl bg-white/5 text-2xl font-black text-white tap-feedback" aria-label="+">+</button>
                </div>
                <div class="${label} mt-3">${esc(t(isTimed(W.reps) ? 'Seconds per set' : 'Reps per set'))}</div>
                <div class="grid grid-cols-4 gap-2" dir="ltr">${REPS_PRESETS.map(r => `<button onclick="window.appActions.swapSetReps(${jsArg(r)})" class="py-2.5 rounded-xl text-[12px] font-black tap-feedback ${W.reps === r ? 'bg-[#d4af37] text-black' : 'bg-white/5 text-white'}">${esc(fmtReps(r))}</button>`).join('')}</div>
                <button onclick="window.appActions.swapSetupNext()" class="w-full mt-4 py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-black uppercase tracking-widest tap-feedback flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.35)]">${t('Next')}<i data-lucide="${isAR ? 'arrow-left' : 'arrow-right'}" class="w-5 h-5"></i></button>
            </div>`;
            if (window.lucide) window.lucide.createIcons({ root: c });
        },
        closeSwapSetup: () => { popBack('swapsetup'); window.appState.swapSetup = null; closeModal('swapsetup-overlay', 'swapsetup-box'); },
        swapSetSets: dlt => { const W = window.appState.swapSetup; if (!W) return; W.sets = String(Math.min(10, Math.max(1, (parseInt(W.sets) || 3) + dlt))); window.appActions.renderSwapSetup(); },
        swapSetReps: v => { const W = window.appState.swapSetup; v = latinDigits(String(v)).trim(); if (!W || !v) return; W.reps = v.slice(0, 20); window.appActions.renderSwapSetup(); },
        swapSetupNext: () => {
            const W = window.appState.swapSetup; if (!W) return;
            const d = getActiveSchedule().find(x => x.id === activeDay), ex = d && d.exercises[W.idx];
            if (!ex) return window.appActions.closeSwapSetup();
            const old = { name: ex.name, muscle: ex.muscle, sets: ex.sets, reps: ex.reps }, next = { name: W.name, muscle: W.muscle, sets: W.sets, reps: W.reps };
            window.appActions.showConfirm(t('Change to {name}?', { name: next.name }), t('{old} will be replaced with {sets} sets of {reps}.', { old: old.name, sets: next.sets, reps: fmtReps(next.reps) + (isTimed(next.reps) && !/s$/i.test(next.reps.trim()) ? 's' : '') }), () => {
                Object.assign(ex, next);
                StorageManager.setPlan(appData);
                window.appActions.closeSwapSetup(); window.appActions.closePicker(); renderWorkout();
                window.appActions.showToast(t('Changed to {name}', { name: next.name }), 'success', { label: t('Undo'), fn: () => {
                    if (!d.exercises.includes(ex)) return;
                    Object.assign(ex, old); StorageManager.setPlan(appData); renderWorkout();
                } });
            }, false, t('Change'));
        },
        pickerConfirm: () => {
            const P = window.appState.picker, d = getActiveSchedule().find(x => x.id === activeDay);
            if (!P.sel.length) return;
            const picked = P.sel; P.sel = []; // a double tap can't add them twice
            picked.forEach(x => d.exercises.push(newExercise(x.name, x.muscle)));
            // Give an unnamed day a name from its muscles, e.g. "Chest & Triceps"
            if (!d.title || !d.title.trim() || d.title === 'New Day' || d.title === t('New Day')) {
                const ms = [...new Set(d.exercises.map(e => tm(e.muscle)))].slice(0, 2);
                d.title = ms.join(isAR ? ' و ' : ' & ');
                d.savedTitle = d.title;
            }
            StorageManager.setPlan(appData);
            const n = picked.length;
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

        // ---------- Edit one exercise in a pop-up (Plan tab) ----------
        openExEdit: i => {
            window.appState.inlineEdit = i; window.appState.customReps = false; renderExEdit();
            openModal('exedit-overlay', 'exedit-box');
            pushBack('exedit', () => window.appActions.closeExEdit());
        },
        refreshExEdit: () => renderExEdit(),
        closeExEdit: () => {
            window.appState.inlineEdit = null; popBack('exedit');
            if (document.getElementById('exedit-overlay').classList.contains('flex')) closeModal('exedit-overlay', 'exedit-box');
        },
        exEditSets: dlt => {
            const ex = getActiveSchedule().find(x => x.id === activeDay).exercises[window.appState.inlineEdit];
            if (!ex) return;
            ex.sets = String(Math.min(10, Math.max(1, (parseInt(ex.sets) || 3) + dlt)));
            StorageManager.setPlan(appData); renderWorkout();
        },
        exEditReps: v => {
            const ex = getActiveSchedule().find(x => x.id === activeDay).exercises[window.appState.inlineEdit];
            v = latinDigits(v).trim(); if (!v || !ex) return;
            ex.reps = v.slice(0, 20);
            StorageManager.setPlan(appData); renderWorkout();
        },
        clearDay: () => window.appActions.showConfirm(t("Clear Day"), t("Delete all exercises?"), () => {
            const d = getActiveSchedule().find(x => x.id === activeDay), old = { exercises: d.exercises, title: d.title };
            d.exercises = []; d.title = ""; StorageManager.setPlan(appData); renderWorkout(); renderNav();
            window.appActions.showToast(t('Day cleared'), 'error', { label: t('Undo'), fn: () => { Object.assign(d, old); StorageManager.setPlan(appData); renderWorkout(); renderNav(); } });
        }, true),
        switchTab: tab => {
            if (tab === 'workout') tab = 'today'; if (tab === 'analytics') tab = 'progress';
            window.appState.inlineEdit = null; window.appState.weekMenu = null; window.appState.todayEdit = false; window.appState.planDay = null; popBack('planday'); window.appState.currentView = tab;
            const prevTab = document.querySelector('.tab-btn.text-\\[\\#d4af37\\]');
            ['today', 'plan', 'progress', 'profile'].forEach(v => { const b = document.getElementById('tabbtn-' + v); if (b) b.className = `tab-btn py-2.5 flex flex-col items-center gap-1 tap-feedback relative ${v === tab ? 'text-[#d4af37]' : 'text-slate-500'}`; });
            const ic = document.querySelector(`#tabbtn-${tab} svg`);
            if (ic && (!prevTab || prevTab.id !== 'tabbtn-' + tab)) { ic.classList.remove('hop'); void ic.getBoundingClientRect(); ic.classList.add('hop'); }
            document.getElementById('nav-container').style.display = 'none'; // Today and Plan show it inside the day card
            document.getElementById('plan-routines').classList.toggle('hidden', tab !== 'plan');
            document.getElementById('profile-view').classList.toggle('hidden', tab !== 'profile');
            document.getElementById('workout-container').classList.toggle('hidden', tab === 'profile');
            renderNav(); renderWorkout();
            const sc = document.querySelector('.scrollable-content'); if (sc) sc.scrollTop = 0;
            if (tab === 'profile') renderAbout();
            if (tab === 'profile' && Cloud.user) hint('profile-account', '#account-card', t('Your account: sync, older backups and sign out are here.'));
        },
        addWeek: () => { if(appData.weeks.length>=5)return window.appActions.showToast(t("Up to 5 routines"),"error"); const aD=DAY_NAMES, sI=aD.indexOf(StorageManager.getStartDay()); let eS=[]; for(let i=1;i<=7;i++)eS.push({id:i,day:aD[(sI+i-1)%7],title:'New Day',isRest:false,recoveryType:null,exercises:[]}); appData.weeks.push({id:'w_'+Date.now(),name:t('Routine {n}', { n: appData.weeks.length+1 }),schedule:eS}); StorageManager.setPlan(appData); renderSidePanel(); },
        deleteWeek: id => { if(appData.weeks.length<=1)return; window.appActions.showConfirm(t("Delete routine"),t("Delete this routine? Your history is kept."),()=>{appData.weeks=appData.weeks.filter(w=>w.id!==id); if(currentWeekId===id){currentWeekId=appData.weeks[0].id;StorageManager.setActiveWeek(currentWeekId);window.appActions.refreshUI();renderNav();} StorageManager.setPlan(appData); renderSidePanel(); },true); },
        // Today: ✏️ turns the day into the editor (not while a workout runs); Done turns it back
        setTodayEdit: on => {
            if (on && window.appState.sess) return;
            window.appState.todayEdit = !!on; window.appState.weekMenu = null; window.appState.sameAll = false;
            renderWorkout();
            const sc = document.querySelector('.scrollable-content'); if (sc) sc.scrollTop = 0;
        },
        planWholeWeek: () => { window.appState.todayEdit = false; window.appActions.switchTab('plan'); },
        // Plan: null = the whole week, a day id = that day's editor
        openPlanDay: id => {
            window.appState.planDay = id; window.appState.weekMenu = null; window.appState.sameAll = false; window.appState.inlineEdit = null;
            if (id != null) { activeDay = id; pushBack('planday', () => window.appActions.openPlanDay(null)); } else popBack('planday');
            renderNav(); renderWorkout();
            const sc = document.querySelector('.scrollable-content'); if (sc) sc.scrollTop = 0;
        },
        copyDayFrom: (fromId, toId) => { activeDay = fromId; window.appActions.copyDay(toId); },
        // Copy a routine (e.g. a lighter "deload" week); history is shared, so nothing is lost
        duplicateWeek: id => {
            const w = appData.weeks.find(x => x.id === id); if (!w) return;
            if (appData.weeks.length >= 5) return window.appActions.showToast(t('Up to 5 routines'), 'error');
            appData.weeks.push({ id: 'w_' + Date.now(), name: t('{name} (copy)', { name: t(w.name) }).slice(0, 40), schedule: JSON.parse(JSON.stringify(w.schedule)) });
            StorageManager.setPlan(appData); renderSidePanel();
            window.appActions.showToast(t('Routine duplicated'), 'success');
        },
        // ⋯ options on a Plan week row; a tap anywhere outside closes it without pressing what is under it
        toggleWeekMenu: id => {
            const open = window.appState.weekMenu = window.appState.weekMenu === id ? null : id;
            renderWorkout();
            if (open == null) return;
            const away = e => {
                if (e.target.closest('[role="menu"], [aria-haspopup="menu"]')) return;
                document.removeEventListener('pointerdown', away, true);
                if (window.appState.weekMenu == null) return;
                window.appState.weekMenu = null; e.stopPropagation(); renderWorkout();
                const eat = ev => { ev.stopPropagation(); ev.preventDefault(); };
                document.addEventListener('click', eat, { capture: true, once: true });
                setTimeout(() => document.removeEventListener('click', eat, true), 600);
            };
            setTimeout(() => document.addEventListener('pointerdown', away, true), 0);
        },
        swapDayFrom: (fromId, toId) => { activeDay = fromId; window.appActions.swapDay(toId); },
        clearDayFrom: id => { activeDay = id; window.appActions.clearDay(); },
        toggleRoutines: () => { window.appState.routinesOpen = !window.appState.routinesOpen; renderSidePanel(); },
        renameWeek: (id, v) => { const w=appData.weeks.find(x=>x.id===id); if(w)w.name=v||t('Unnamed'); StorageManager.setPlan(appData); document.getElementById('active-week-label').innerText=appData.weeks.find(x=>x.id===currentWeekId).name; },
        switchWeek: id => { currentWeekId=id; StorageManager.setActiveWeek(id); activeDay=getTodayId(); window.appState.inlineEdit=null; window.appState.planDay=null; renderNav(); renderWorkout(); },
        setActiveDay: id => { window.appState.inlineEdit=null; window.appState.weekMenu=null; if (window.appState.currentView==='today') window.appState.todayEdit=false; else if (window.appState.planDay!=null) window.appState.planDay=id; activeDay=id; renderNav(); renderWorkout(); },
        toggleRpe: v => { StorageManager.setShowRpe(v); window.appActions.showToast(t(v ? 'RPE column on' : 'RPE column off'), 'success'); },
        openBackupModal: () => { openModal('smart-backup-overlay','smart-backup-box'); pushBack('backup', () => window.appActions.closeBackupModal()); },
        closeBackupModal: () => { popBack('backup'); closeModal('smart-backup-overlay','smart-backup-box'); },
        executeSmartBackup: () => {
            const doProg = document.getElementById('backup-opt-progress').checked;
            const doSched = document.getElementById('backup-opt-schedule').checked;
            const doSet = document.getElementById('backup-opt-settings').checked;
            if (!doProg && !doSched && !doSet) return window.appActions.showToast(t("Select at least one option!"), "error");
            StorageManager.setBackupDate(); updateBackupStatus();
            // readable format (v2): easy to share with a friend or give to an AI; old files still import
            const d = buildExport({ prog: doProg, sched: doSched, sett: doSet });
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
            if (f.size > 5e6) { e.target.value=''; return window.appActions.showToast(t("Invalid Backup file"),"error"); } // over 5 MB is not an Apex Lift file
            const r=new FileReader();
            r.onload=ev=>{
                try {
                    let raw=JSON.parse(ev.target.result);
                    if(!isObj(raw)) throw new Error('Backup is not an object');
                    if (raw.format === 2 || raw.app === 'Apex Lift') raw = fromExportV2(raw);
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
                    openModal('smart-restore-overlay','smart-restore-box'); pushBack('restore', () => window.appActions.closeRestoreModal());
                } catch(err) { window.appActions.showToast(t("Invalid Backup file"),"error"); }
            };
            r.readAsText(f); e.target.value='';
        },
        closeRestoreModal: () => {
            popBack('restore'); closeModal('smart-restore-overlay','smart-restore-box', 300, () => { window.appState.pendingRestoreData = null; });
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
            openModal('smart-mapping-overlay','smart-mapping-box'); pushBack('mapping', () => window.appActions.closeMappingModal());
        },
        closeMappingModal: () => {
            popBack('mapping'); closeModal('smart-mapping-overlay','smart-mapping-box');
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
                        // both lists together, in date order, without duplicates (and without records you deleted)
                        currH[newKey] = mergeLogs(currH[newKey], sanitizeHistory({ x: oldHist }).x || [], getDeleted()[newKey]);
                        const newest = currH[newKey][currH[newKey].length - 1];
                        if (newest) currW[newKey] = newest.w; // "last weight" = the newest log, not the backup's
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
                if (!(doSet && d.s)) setWeekStart(StorageManager.getStartDay()); // keep each day on its weekday on this phone
                // add the backup's own exercises to this phone's list
                const cx = getCustomEx(); (d.cx || []).forEach(x => { if (!cx.some(y => y.name.toLowerCase() === x.name.toLowerCase())) cx.push(x); }); setCustomEx(cx);
            }
            if (doSet && d.s) { 
                const aD=DAY_NAMES, idx=aD.indexOf(d.s);
                if (d.rt) { StorageManager.setRestSeconds(d.rt); const rs = document.getElementById('setting-rest'); if (rs) rs.value = String(d.rt); }
                if(idx!==-1){ setWeekStart(d.s); document.getElementById('setting-start-day').value = d.s; }
                count++; 
            }
            if (count > 0) { if (StorageManager.setPlan(appData) === false) return; activeDay = getTodayId(); renderNav(); window.appActions.refreshUI(); window.appActions.showToast(t("Data Merged Successfully!"), "success"); }
            if(!didProg) window.appActions.closeRestoreModal();
    },
    restoreDefaults: () => { window.appActions.showConfirm(t("Reset app"),t("Your routines go back to the default. Your history is kept."),()=>{const aD=DAY_NAMES, sI=aD.indexOf('SAT'); const def=JSON.parse(JSON.stringify(defaultWorkoutData)); def.forEach((d,i)=>d.day=aD[(sI+i)%7]); appData={weeks:[{id:'w_default',name:t('Main Routine'),schedule:def}]}; currentWeekId='w_default'; StorageManager.setActiveWeek('w_default'); StorageManager.setPlan(appData); StorageManager.setStartDay('SAT'); document.getElementById('setting-start-day').value='SAT'; activeDay=getTodayId(); renderNav(); window.appActions.refreshUI(); window.appActions.showToast(t("Reset Complete"));},true); },
        // ---------- First-launch setup (also from Profile → Set up again) ----------
        initOnboarding: () => { if (!StorageManager.getOnboard()) window.appActions.startWizard(true); },
        startWizard: (firstRun = false) => {
            let hasLang = false; try { hasLang = localStorage.getItem(LANG_KEY) !== null; } catch (e) {}
            const pr = getProfile();
            window.appState.wiz = { firstRun, steps: [...(hasLang ? [] : ['lang']), 'goal', 'days', 'exp', 'eq', 'about', 'start', 'result'], step: 0,
                goal: pr.goal || null, days: pr.days || null, exp: pr.exp || null, eq: pr.eq || null, showAll: false };
            window.appActions.renderWizard();
            openModal('onboarding-overlay', 'onboarding-box');
            // phone Back: previous question; on the first question it closes (the very first setup stays open)
            const onBack = () => {
                const W = window.appState.wiz;
                if (W && W.step > 0) { window.appActions.wizBack(); pushBack('wizard', onBack); }
                else if (W && !W.firstRun) closeModal('onboarding-overlay', 'onboarding-box', 300);
                else pushBack('wizard', onBack);
            };
            pushBack('wizard', onBack);
        },
        renderWizard: () => {
            const W = window.appState.wiz, key = W.steps[W.step];
            // how far the setup questions got (for the admin page), until they are finished
            try { const sv = localStorage.getItem(SETUP_KEY); if (!sv || sv.startsWith('left:')) localStorage.setItem(SETUP_KEY, 'left:' + key); } catch (e) {}
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
            if (key === 'about') body = head(t('About you'), t('Optional. Helps the app fit you. You can change it anytime in Profile.')) + aboutFormHTML()
                + `<button id="wiz-about-next" onclick="window.appActions.wizChoose('about', 'done')" class="w-full mt-6 py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-black uppercase tracking-widest tap-feedback">${t('Next')}</button>`;
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
            if (key === 'about') { const a = ageOf(getBody()); if (a !== null && a < MIN_AGE) return window.appActions.showToast(t('Apex Lift is for ages {n} and up.', { n: MIN_AGE }), 'error'); }
            if (key === 'lang') {
                writeItem(LANG_KEY, val);
                if (val !== LANG) return location.reload(); // the setup continues in the chosen language
            } else if (key === 'start') {
                setWeekStart(val);
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
        wizFinish: (mode, sure = false) => {
            const W = window.appState.wiz;
            if (W.done) return; // double tap
            // already 5 routines: the current one would be replaced, so ask first
            if (!sure && !W.firstRun && mode !== 'skip' && appData.weeks.length >= 5)
                return window.appActions.showConfirm(t('Replace current routine?'), t('You have 5 routines (the most). The current one will be replaced; your history is kept.'), () => window.appActions.wizFinish(mode, true), true);
            W.done = true;
            try { localStorage.setItem(SETUP_KEY, mode); } catch (e) {}
            writeItem(PROFILE_KEY, JSON.stringify({ goal: W.goal, days: W.days, exp: W.exp, eq: W.eq }));
            StorageManager.setOnboard();
            popBack('wizard');
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
        applyProgram: (id, { exp = (getProfile().exp || 'mid'), replace = false, undo = false } = {}) => {
            const prog = PROGRAMS.find(p => p.id === id); if (!prog) return;
            if (window.appState.programBusy === id) return; // double tap: add it only once
            window.appState.programBusy = id; setTimeout(() => { if (window.appState.programBusy === id) window.appState.programBusy = null; }, 1000);
            const snap = { weeks: JSON.stringify(appData.weeks), weekId: currentWeekId, day: activeDay };
            const schedule = programSchedule(prog, exp);
            if (replace || appData.weeks.length >= 5) { const w = appData.weeks.find(x => x.id === currentWeekId); w.schedule = schedule; w.name = t(prog.name); }
            else { const wid = 'w_' + Date.now(); appData.weeks.push({ id: wid, name: t(prog.name), schedule }); currentWeekId = wid; StorageManager.setActiveWeek(wid); }
            StorageManager.setPlan(appData);
            activeDay = getTodayId();
            window.appActions.switchTab('today');
            window.appActions.showToast(t('{name} is ready', { name: t(prog.name) }), 'success', undo ? { label: t('Undo'), fn: () => {
                appData.weeks = JSON.parse(snap.weeks); currentWeekId = snap.weekId; activeDay = snap.day;
                StorageManager.setPlan(appData); StorageManager.setActiveWeek(currentWeekId); window.appActions.switchTab('plan');
            } } : null);
        },
        // ---------- Program gallery (Plan → Programs): list → preview page (every day and exercise) → use it ----------
        openPrograms: () => {
            window.appState.progPick = null;
            window.appActions.renderPrograms();
            openSheet('programs-overlay', 'programs-box');
            pushBack('programs', () => window.appActions.closePrograms());
        },
        closePrograms: () => { popBack('programs'); popBack('progpreview'); closeSheet('programs-overlay', 'programs-box'); },
        previewProgram: id => {
            window.appState.progPick = id; window.appState.progExp = getProfile().exp || 'mid';
            window.appActions.renderPrograms();
            if (id) pushBack('progpreview', () => window.appActions.previewProgram(null)); else popBack('progpreview');
        },
        setProgramLevel: v => { window.appState.progExp = v; const top = document.getElementById('programs-list').scrollTop; window.appActions.renderPrograms(); document.getElementById('programs-list').scrollTop = top; },
        renderPrograms: () => {
            const list = document.getElementById('programs-list'), pick = PROGRAMS.find(p => p.id === window.appState.progPick);
            document.getElementById('programs-title').innerText = pick ? t('Program preview') : t('Programs');
            if (!pick) {
                list.innerHTML = PROGRAMS.map(p => `<button onclick="window.appActions.previewProgram(${jsArg(p.id)})" class="w-[calc(100%-2rem)] mx-4 mb-3 p-4 rounded-2xl border bg-white/5 border-white/10 text-start tap-feedback flex items-center gap-3">
                    <span class="flex-1 min-w-0">
                        <span class="flex items-center justify-between gap-2"><span class="text-[16px] font-black text-white">${esc(t(p.name))}</span><span class="text-[11px] font-black text-slate-400 shrink-0">${t('{n} days', { n: p.days })}${p.eq === 'db' ? ' · ' + t('Dumbbells only') : ''}</span></span>
                        <span class="block text-[12px] font-bold text-slate-400 mt-1">${esc(t(p.desc))}</span>
                        ${programPreviewHTML(p)}
                    </span>
                    <i data-lucide="${isAR ? 'chevron-left' : 'chevron-right'}" class="w-5 h-5 text-slate-500 shrink-0"></i>
                </button>`).join('') + `<p class="mx-6 mb-6 text-[11px] font-bold text-slate-500">${t('Your current routine and all your history are kept.')}</p>`;
            } else {
                const exp = window.appState.progExp || 'mid', sched = programSchedule(pick, exp), full = appData.weeks.length >= 5;
                const lvl = (v, l) => `<button onclick="window.appActions.setProgramLevel(${jsArg(v)})" class="flex-1 py-2 rounded-xl text-[12px] font-black tap-feedback ${exp === v ? 'bg-[#d4af37] text-black' : 'bg-white/5 text-slate-300'}">${t(l)}</button>`;
                const dayCard = d => d.isRest
                    ? `<div class="glass-card ex-card flex items-center gap-3 opacity-70"><i data-lucide="${d.recoveryType === 'active' ? 'footprints' : 'moon'}" class="w-5 h-5 text-slate-400 shrink-0"></i><span class="text-[11px] font-black text-slate-400 uppercase tracking-widest w-10 shrink-0">${esc(dayShort(d.day))}</span><span class="text-[14px] font-black text-slate-300">${t(d.recoveryType === 'active' ? 'Active Rest' : 'Complete Rest')}</span></div>`
                    : `<div class="glass-card ex-card">
                        <div class="flex items-baseline justify-between gap-2 mb-2"><span class="min-w-0"><span class="block text-[10px] font-black text-[#d4af37] uppercase tracking-widest">${esc(dayLong(d.day))}</span><span class="block text-[17px] font-black text-white leading-tight">${esc(t(d.title))}</span></span><span class="text-[11px] font-bold text-slate-400 shrink-0">${t('{n} exercises', { n: d.exercises.length })}</span></div>
                        ${d.exercises.map((ex, k) => `<div class="flex items-center gap-3 py-2 ${k ? 'border-t border-white/5' : ''}"><span class="w-6 text-center text-[12px] font-black text-slate-500 shrink-0">${k + 1}</span><span class="flex-1 min-w-0"><span class="ex-name block text-[14px] font-black text-white truncate">${esc(ex.name)}</span><span class="block text-[11px] font-bold text-slate-400 truncate">${esc(tm(ex.muscle))}</span></span><span class="ex-pill" dir="ltr">${esc(ex.sets)} × ${esc(fmtReps(ex.reps))}</span></div>`).join('')}
                    </div>`;
                list.innerHTML = `<div class="px-4 pb-4">
                    <button onclick="window.appActions.previewProgram(null)" class="flex items-center gap-1 mb-3 text-[12px] font-black text-slate-400 tap-feedback"><i data-lucide="${isAR ? 'chevron-right' : 'chevron-left'}" class="w-4 h-4"></i>${t('All programs')}</button>
                    <h2 class="text-[24px] font-black text-white leading-tight">${esc(t(pick.name))}</h2>
                    <p class="text-[13px] font-bold text-slate-400 mt-1">${esc(t(pick.desc))}</p>
                    <div class="text-[12px] font-black text-slate-300 mt-2">${t('{n} training days', { n: pick.days })} · ${pick.eq === 'db' ? t('Dumbbells only') : t('Full gym')}</div>
                    ${programPreviewHTML(pick)}
                    <div class="mt-4 mb-1.5 px-0.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">${t('Level')}</div>
                    <div class="flex gap-2 mb-4">${lvl('new', 'Beginner')}${lvl('mid', 'Intermediate')}${lvl('adv', 'Advanced')}</div>
                    <div class="space-y-2">${sched.map(dayCard).join('')}</div>
                </div>
                <div class="sticky bottom-0 bg-[#111] border-t border-white/10 px-4 pt-3" style="padding-bottom: max(1rem, env(safe-area-inset-bottom));">
                    <p class="text-[11px] font-bold text-slate-500 mb-2 text-center">${full ? t('It replaces your current routine. Your history is kept.') : t('It is added as a new routine. Your current routine and history are kept.')}</p>
                    <button onclick="window.appActions.useProgram(${jsArg(pick.id)})" class="w-full py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-black uppercase tracking-widest tap-feedback flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.35)]"><i data-lucide="check" class="w-5 h-5"></i>${t('Use this program')}</button>
                </div>`;
            }
            list.scrollTop = 0;
            if (window.lucide) window.lucide.createIcons({ root: list });
        },
        useProgram: id => {
            const exp = window.appState.progExp || getProfile().exp || 'mid';
            const go = () => { window.appActions.closePrograms(); window.appActions.applyProgram(id, { exp, replace: appData.weeks.length >= 5, undo: true }); };
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
    const MAIN_KEYS = new Set([BODY_KEY, StorageManager.PLAN_KEY, StorageManager.ACTIVE_WEEK, StorageManager.START_KEY, StorageManager.REST_KEY, StorageManager.RPE_KEY, StorageManager.KEY, CUSTOM_KEY, PROFILE_KEY, READY_KEY]);
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
        showRpe: StorageManager.getShowRpe(), weights: StorageManager.get(), custom: getCustomEx(), profile: getProfile(), terms: getAgree(),
        body: getBody(), account: accountSummary(), readiness: sanitizeReadiness(getReadinessAll()), activity: activitySummary()
    }));
    // name, email, sign-up date, last active day, language, app version, phone type and how setup ended
    // (changes at most once a day, so it doesn't cause extra uploads)
    const accountSummary = () => {
        if (!Cloud.user) return null;
        const f = getCloudFlag() || {};
        return { name: (Cloud.user.displayName || f.name || '').slice(0, 100), email: (Cloud.user.email || f.email || '').slice(0, 200), createdAt: Number(f.since) || Date.now(), lastSeen: dateKey(),
            lang: LANG, appVersion: APP_VERSION, platform: platformName(), installed: isInstalled(), setup: (localStorage.getItem(SETUP_KEY) || '').slice(0, 40) };
    };
    const platformName = () => {
        const ua = navigator.userAgent || '';
        if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
        if (/Android/.test(ua)) return 'android';
        return 'desktop';
    };
    const isInstalled = () => { try { return navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches; } catch (e) { return false; } };
    // A short summary of the training (workout days, exercises, most-done exercises), so the admin page
    // can show activity and retention by reading one document per user instead of every workout.
    const activitySummary = () => {
        const h = StorageManager.getHistory(), days = new Set(), count = {}; let last = 0;
        Object.keys(h).forEach(k => {
            const list = Array.isArray(h[k]) ? h[k] : [], seen = new Set();
            list.forEach(l => { const tt = logTime(l); if (isNaN(tt)) return; const dk = dateKey(tt); days.add(dk); seen.add(dk); if (tt > last) last = tt; });
            if (seen.size && !k.startsWith('temp_')) count[k] = seen.size;
        });
        const names = exerciseNames();
        const top = Object.keys(count).sort((a, b) => count[b] - count[a]).slice(0, 10).map(k => ({ n: keyToName(k, names).slice(0, 80), c: count[k] }));
        return { n: days.size, ex: Object.keys(count).length, last, days: [...days].sort().slice(-180), top };
    };
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
            if (isObj(m.profile)) { const pr = {}; ['goal', 'days', 'exp', 'eq'].forEach(k => { if (typeof m.profile[k] === 'string' && m.profile[k].length <= 20) pr[k] = m.profile[k]; }); writeItem(PROFILE_KEY, JSON.stringify(pr)); }
            if (isObj(m.body)) setBody(m.body);
            if (isObj(m.readiness)) writeItem(READY_KEY, JSON.stringify({ ...sanitizeReadiness(getReadinessAll()), ...sanitizeReadiness(m.readiness) }));
            if (isObj(m.account) && Number(m.account.createdAt) > 0) { const f = getCloudFlag(); if (f && f.uid && !f.since) writeItem(CLOUD_KEY, JSON.stringify({ ...f, since: Number(m.account.createdAt) })); }
            if (isObj(m.terms) && m.terms.v === TERMS_VERSION && !getAgree()) { try { localStorage.setItem(AGREE_KEY, JSON.stringify(m.terms)); } catch (e) {} }
            localStorage.setItem(LOCAL_UPDATED_KEY, String(m.updatedAt || Date.now()));
        } finally { Cloud.applying = false; }
        refreshAfterCloud();
    };
    const refreshAfterCloud = () => {
        const sd = document.getElementById('setting-start-day'); if (sd) sd.value = StorageManager.getStartDay();
        const rs = document.getElementById('setting-rest'); if (rs) rs.value = String(StorageManager.getRestSeconds());
        const rp = document.getElementById('setting-rpe'); if (rp) rp.checked = StorageManager.getShowRpe();
        renderNav(); renderWorkout(); renderAbout();
    };
    // Combine two lists of logs without duplicates (same time, weight and reps = same log)
    const mergeLogs = (a, b, del) => {
        const gone = new Set(del || []), m = new Map();
        [...(a || []), ...(b || [])].forEach(l => { const g = logSig(l); if (!gone.has(g)) m.set(g, l); });
        return [...m.values()].sort((x, y) => (logTime(x) || 0) - (logTime(y) || 0)).slice(-HIST_CAP);
    };
    const unionDel = (a, b) => [...new Set([...(a || []), ...(b || [])])].slice(-200);
    const safeDecode = id => { try { const k = decodeURIComponent(id); return safeKey(k) ? k : null; } catch (e) { return null; } };
    const histPath = (uid, k) => `users/${uid}/history/${encodeURIComponent(k)}`;
    const coachPath = uid => `users/${uid}/coach/plan`;

    // 🧑‍🏫 COACH PLAN: the coach writes users/{uid}/coach/plan from the admin page:
    //   { mode: 'add' | 'replace' | 'note', routine: {id, name, schedule}, targetId, activate, note, coach, sentAt, appliedAt }
    // The phone puts the routine into the plan (a backup is made first when a routine is replaced), makes it the
    // active one, then sets appliedAt so it isn't applied twice. The normal sync then takes it to the user's other phones.
    const applyCoach = async (uid, c) => {
        const sentAt = Number(c.sentAt) || 0;
        if (!sentAt || Number(c.appliedAt) >= sentAt || !Cloud.user || Cloud.user.uid !== uid) return;
        const ack = () => Cloud.db.doc(coachPath(uid)).update({ appliedAt: sentAt }).catch(e => console.warn('Coach plan: could not confirm', e));
        const mine = getCoach();
        if (mine && Number(mine.sentAt) >= sentAt) return ack(); // already applied on this phone
        // never change the plan in the middle of a workout: try again a bit later
        if (window.appState.sess) { clearTimeout(Cloud.coachTimer); Cloud.coachTimer = setTimeout(() => applyCoach(uid, c), 60000); return; }
        if (Cloud.coachBusy) return; Cloud.coachBusy = true;
        try {
            let routine = '';
            if (c.mode !== 'note') {
                const clean = sanitizePlan({ weeks: [c.routine] });
                if (!clean) return;
                const wk = clean.weeks[0];
                const target = (c.mode === 'replace' && appData.weeks.find(w => w.id === c.targetId)) || appData.weeks.find(w => w.id === wk.id)
                    || (appData.weeks.length >= 5 ? appData.weeks.find(w => w.id === currentWeekId) : null);
                // a routine is about to be replaced: keep a copy so it can be restored
                if (target) { try { await cloudBackup('before-coach'); } catch (e) { console.warn('Backup before coach update failed', e); } }
                if (target) { target.name = wk.name; target.schedule = wk.schedule; }
                else appData.weeks.push(wk);
                // activate: false = keep their current routine active (a full set of 5 always activates, since the active one was replaced)
                if (c.activate !== false || !appData.weeks.some(w => w.id === currentWeekId)) currentWeekId = (target || wk).id;
                StorageManager.setPlan(appData); StorageManager.setActiveWeek(currentWeekId);
                routine = wk.name;
            }
            writeItem(COACH_KEY, JSON.stringify({ sentAt, at: Date.now(), routine, note: cut(c.note, 1000), hidden: false }));
            await ack();
            refreshAfterCloud(); renderSidePanel();
            window.appActions.showToast(t(c.mode === 'note' ? 'Your coach sent you a message' : 'Your coach updated your routine'), 'success');
        } catch (e) { console.warn('Coach plan failed', e); }
        finally { Cloud.coachBusy = false; }
    };
    Object.assign(window.appActions, {
        dismissCoach: () => { const c = getCoach(); if (c) writeItem(COACH_KEY, JSON.stringify({ ...c, hidden: true })); renderWorkout(); }
    });

    // First time on this phone: merge the phone's workouts with the cloud's, then keep both in step
    const cloudSignedIn = async user => {
        const prevUid = localStorage.getItem(CLOUD_LASTUID);
        Cloud.user = user;
        const oldFlag = getCloudFlag() || {};
        writeItem(CLOUD_KEY, JSON.stringify({ uid: user.uid, name: user.displayName || '', email: user.email || '', photo: user.photoURL || '', since: oldFlag.uid === user.uid && oldFlag.since ? oldFlag.since : (user.metadata && Date.parse(user.metadata.creationTime)) || Date.now() }));
        setCloudStatus('syncing');
        // signed in from the welcome screen: close it; the setup questions come after the account is loaded
        const fromWelcome = welcomeOpen();
        if (fromWelcome) hideWelcome();
        try {
            const uid = user.uid;
            const [snap, hs] = await Promise.all([Cloud.db.doc(`users/${uid}`).get(), Cloud.db.collection(`users/${uid}/history`).get()]);
            const cloudHist = {}, cloudDel = {};
            const cloudReset = {};
            hs.forEach(d => { const x = d.data(), k = safeDecode(d.id); if (!k) return; if (x && Array.isArray(x.logs)) cloudHist[k] = x.logs; if (x && Array.isArray(x.del)) cloudDel[k] = x.del.map(String); if (x && Number(x.resetAt) > 0) cloudReset[k] = Number(x.resetAt); });
            const clean = sanitizeHistory(cloudHist);
            // a different account was used on this phone before: its workouts are already in that account, so start from this account's
            const switched = !!prevUid && prevUid !== uid;
            const local = switched ? {} : StorageManager.getHistory(), merged = { ...local }, del = switched ? {} : getDeleted();
            // workouts: keep everything from both sides (except records deleted on either side)
            const resets = switched ? {} : getResets();
            Object.keys(clean).forEach(k => {
                // a backup was restored on another phone after this one last synced: take the cloud's list as it is
                if ((cloudReset[k] || 0) > (resets[k] || 0)) { resets[k] = cloudReset[k]; del[k] = cloudDel[k] || []; merged[k] = clean[k]; return; }
                del[k] = unionDel(del[k], cloudDel[k]); merged[k] = mergeLogs(local[k], clean[k], del[k]);
            });
            Cloud.applying = true; StorageManager.setHistory(merged); setDeleted(del); setResets(resets); Cloud.applying = false;
            // routines + settings: the account wins on a new phone, otherwise the newest change wins
            if (snap.exists) {
                const m = snap.data(), localU = Number(localStorage.getItem(LOCAL_UPDATED_KEY)) || 0;
                if (prevUid !== uid || (m.updatedAt || 0) > localU) applyMain(m);
            }
            Cloud.sent = {};
            Object.keys(clean).forEach(k => { Cloud.sent['h:' + k] = JSON.stringify(clean[k]); });
            localStorage.setItem(CLOUD_LASTUID, uid);
            refreshAfterCloud();
            // this account already has a plan: no need for the setup questions
            if (snap.exists || hs.size > 0) StorageManager.setOnboard();
            if (fromWelcome) window.appActions.initOnboarding();
            await cloudFlush();
            cloudSubscribe(uid);
            maybeAutoBackup();
        } catch (e) { console.warn('Cloud sync failed', e); setCloudStatus('error', e, 'read'); if (fromWelcome) window.appActions.initOnboarding(); }
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
            const del = getDeleted(), resets = getResets();
            Object.keys(h).forEach(k => { const j = JSON.stringify(h[k]); if (j !== Cloud.sent['h:' + k]) { ops.push(['set', histPath(uid, k), { logs: h[k], del: del[k] || [], resetAt: resets[k] || 0, updatedAt: Date.now() }]); Cloud.sent['h:' + k] = j; } });
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
    // 🟢 PRESENCE + VISITS (users/{uid}/presence/app): while the app is open on screen it says "I'm here" every 2 minutes,
    // so the admin page can show who is using the app right now, how many times each user opened it and for how long.
    // A visit = one stretch of use; coming back after 30 minutes away starts a new one. The last 30 visits are kept.
    const PRES_MS = 120000, VISIT_GAP = 30 * 60000;
    const presPath = uid => `users/${uid}/presence/app`;
    const presence = { timer: null, doc: null, uid: null };
    const presenceBeat = async (off = false) => {
        if (!Cloud.user || (!off && document.visibilityState !== 'visible')) return;
        const uid = Cloud.user.uid, now = Date.now();
        if (presence.uid !== uid) { presence.doc = null; presence.uid = uid; }
        if (!presence.doc) { try { const snap = await Cloud.db.doc(presPath(uid)).get(); presence.doc = snap.exists ? snap.data() : {}; } catch (e) { presence.doc = {}; } }
        const p = presence.doc, recent = (Array.isArray(p.recent) ? p.recent : []).filter(v => isObj(v) && Number(v.s) > 0 && Number(v.e) >= Number(v.s)).slice(-30);
        let visits = Number(p.visits) || 0;
        const last = recent[recent.length - 1];
        if (last && now - last.e < VISIT_GAP) last.e = now;
        else if (!off) { recent.push({ s: now, e: now }); visits++; }
        presence.doc = { at: now, off, visits, recent: recent.slice(-30) };
        Cloud.db.doc(presPath(uid)).set(presence.doc).catch(e => console.warn('Presence', e));
    };
    const presenceStart = () => { clearInterval(presence.timer); presenceBeat(); presence.timer = setInterval(() => presenceBeat(), PRES_MS); };
    const presenceStop = () => { clearInterval(presence.timer); presence.timer = null; presence.doc = null; presence.uid = null; };
    document.addEventListener('visibilitychange', () => { if (Cloud.user && presence.timer) presenceBeat(document.visibilityState !== 'visible'); });

    const cloudSubscribe = uid => {
        Cloud.unsub.forEach(u => u()); Cloud.unsub = [];
        presenceStart();
        Cloud.unsub.push(Cloud.db.doc(`users/${uid}`).onSnapshot(snap => {
            if (!snap.exists || snap.metadata.hasPendingWrites) return;
            const m = snap.data(), localU = Number(localStorage.getItem(LOCAL_UPDATED_KEY)) || 0;
            if ((m.updatedAt || 0) > localU) { applyMain(m); Cloud.sent.main = JSON.stringify(collectMain()); }
        }, e => console.warn(e)));
        Cloud.unsub.push(Cloud.db.doc(coachPath(uid)).onSnapshot(snap => {
            if (snap.exists && !snap.metadata.hasPendingWrites) applyCoach(uid, snap.data() || {});
        }, e => console.warn(e)));
        Cloud.unsub.push(Cloud.db.collection(`users/${uid}/history`).onSnapshot(qs => {
            const h = StorageManager.getHistory(), del = getDeleted(), resets = getResets(); let changed = false, delChanged = false, behind = false;
            qs.docChanges().forEach(ch => {
                if (ch.doc.metadata.hasPendingWrites) return; // our own upload coming back
                const k = safeDecode(ch.doc.id); if (!k) return; // a damaged name can't stop the sync
                // removed in the cloud (account deleted elsewhere): the workouts on this phone stay
                if (ch.type === 'removed') { delete Cloud.sent['h:' + k]; return; }
                const data = ch.doc.data() || {}, logs = sanitizeHistory({ [k]: data.logs })[k] || [];
                const rr = Number(data.resetAt) || 0;
                if (rr > (resets[k] || 0)) { // restored from a backup on another phone: take it as it is
                    resets[k] = rr; del[k] = Array.isArray(data.del) ? data.del.map(String) : []; delChanged = true;
                    if (JSON.stringify(h[k] || null) !== JSON.stringify(logs)) { h[k] = logs; changed = true; }
                    Cloud.sent['h:' + k] = JSON.stringify(logs); return;
                }
                if (Array.isArray(data.del)) { const d2 = unionDel(del[k], data.del.map(String)); if (d2.length !== (del[k] || []).length) { del[k] = d2; delChanged = true; } }
                // both lists together, so a phone that was behind can never erase workouts from another phone
                const mine = JSON.stringify(h[k] || null), next = mergeLogs(h[k], logs, del[k]);
                if (JSON.stringify(next) !== mine) { h[k] = next; changed = true; }
                Cloud.sent['h:' + k] = JSON.stringify(logs);
                if (JSON.stringify(next) !== JSON.stringify(logs)) behind = true; // the cloud is missing some of ours
            });
            if (changed || delChanged) { Cloud.applying = true; if (changed) StorageManager.setHistory(h); setDeleted(del); setResets(resets); Cloud.applying = false; }
            if (changed) refreshAfterCloud();
            if (behind) scheduleFlush();
        }, e => console.warn(e)));
    };
    const cloudSignedOut = () => {
        presenceStop();
        Cloud.unsub.forEach(u => u()); Cloud.unsub = []; Cloud.user = null; Cloud.sent = {};
        const wasPending = (getCloudFlag() || {}).pending;
        try { localStorage.removeItem(CLOUD_KEY); } catch (e) {}
        setCloudStatus('off');
        // an account is needed to use the app: back to the sign-in page (workouts stay on the phone)
        if (gateOn() && !wasPending && requireSignIn()) showWelcome(true);
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
                <button onclick="window.appActions.openBackups()" class="w-full mt-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-widest text-white tap-feedback flex items-center justify-center gap-1.5"><i data-lucide="history" class="w-4 h-4"></i>${t('Account backups')}</button>
                <div class="flex justify-between mt-3"><a href="privacy.html" target="_blank" rel="noopener" class="text-[11px] font-bold text-slate-500 underline">${t('Privacy policy')}</a><button onclick="window.appActions.cloudDelete()" class="text-[11px] font-bold text-red-400 underline tap-feedback">${t('Delete my account')}</button></div></div>`;
        }
        if (window.lucide) window.lucide.createIcons({ root: el });
        if (typeof updateBackupStatus === 'function') updateBackupStatus();
        if (welcomeOpen()) updateWelcomeUI(); // "Signing in…" on the welcome page too
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
                // every account backup (and its parts) goes too
                const bs = await Cloud.db.collection(`users/${uid}/backups`).get();
                bs.forEach(d => { const n = Number((d.data() || {}).parts) || 1; for (let i = 0; i < n; i++) paths.push(`users/${uid}/backups/${d.id}/parts/${i}`); paths.push(`users/${uid}/backups/${d.id}`); });
                presenceStop();
                paths.push(coachPath(uid), presPath(uid), `users/${uid}`);
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



    // 📦 BACKUP FILE v2: readable by people and AI models (names instead of internal keys, real dates, kg and reps)
    const exerciseNames = () => {
        const m = {}; const add = n => { if (n) m[getExKey('', '', '', n)] = n; };
        catalogue().forEach(x => add(x.name));
        appData.weeks.forEach(w => w.schedule.forEach(d => (d.exercises || []).forEach(e => add(e.name))));
        return m;
    };
    const keyToName = (k, names) => names[k] || k.replace(/^global_/, '').split('_').filter(Boolean).map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ');
    const dayKind = d => d.isRest ? (d.recoveryType === 'active' ? 'active rest' : 'rest') : 'workout';
    const buildExport = ({ prog, sched, sett }) => {
        const out = { app: 'Apex Lift', format: 2, exported: new Date().toISOString(),
            about: 'Apex Lift workout file. "routines": weekly plans, days in order from the first day of the week; each exercise has sets and a reps range ("30 - 45s" = seconds). "history": every logged session per exercise, oldest first: date, weightKg (0 = bodyweight), reps per set, optional weightsKg per set, rpe per set (10 = no reps left) and unit "sec" for timed exercises. Import in Apex Lift: Profile → Restore data.' };
        if (sett) out.settings = { weekStartsOn: StorageManager.getStartDay(), restSeconds: StorageManager.getRestSeconds() };
        if (sched) {
            out.routines = appData.weeks.map(w => ({ name: w.name, active: w.id === currentWeekId, days: w.schedule.map(d => ({ day: d.day, title: d.title, type: dayKind(d),
                exercises: (d.exercises || []).map(e => ({ name: e.name, muscle: e.muscle, sets: parseInt(e.sets) || e.sets, reps: e.reps })) })) }));
            const cx = getCustomEx(); if (cx.length) out.customExercises = cx;
        }
        if (prog) {
            const names = exerciseNames(), h = StorageManager.getHistory(); out.history = {};
            Object.keys(h).filter(k => !k.startsWith('temp_') && (h[k] || []).length).forEach(k => {
                out.history[keyToName(k, names)] = h[k].map(l => {
                    const tt = logTime(l), e = { date: isNaN(tt) ? l.d : new Date(tt).toISOString(), weightKg: parseFloat(l.w) || 0, reps: Array.isArray(l.s) ? l.s.map(Number) : [parseInt(l.s) || 0] };
                    if (Array.isArray(l.ws)) e.weightsKg = l.ws.map(x => parseFloat(x) || 0);
                    if (Array.isArray(l.rpe) && l.rpe.some(x => x != null)) e.rpe = l.rpe;
                    if (l.u === 's') e.unit = 'sec';
                    if (l.week) e.routine = l.week;
                    if (typeof l.dayId === 'number') e.day = l.dayId;
                    if (l.time) e.duration = l.time;
                    return e;
                });
            });
        }
        return out;
    };
    // v2 file → the app's own backup shape (then cleaned by the normal import checks)
    const fromExportV2 = raw => {
        const d = {};
        if (Array.isArray(raw.routines)) {
            const stamp = Date.now();
            const weeks = raw.routines.filter(isObj).slice(0, 5).map((r, i) => ({ id: `w_${stamp}_${i}`, name: toStr(r.name, 'Routine'), active: r.active === true,
                schedule: (Array.isArray(r.days) ? r.days : []).slice(0, 7).map((x, j) => {
                    x = isObj(x) ? x : {}; const type = toStr(x.type).toLowerCase(), rest = type === 'rest' || type === 'active rest';
                    return { id: j + 1, day: toStr(x.day).toUpperCase(), title: toStr(x.title, rest ? (type === 'rest' ? 'Complete Rest' : 'Active Rest') : 'New Day'), isRest: rest, recoveryType: rest ? (type === 'active rest' ? 'active' : 'complete') : null,
                        exercises: Array.isArray(x.exercises) ? x.exercises.filter(isObj).map(e => ({ name: toStr(e.name), muscle: toStr(e.muscle, 'Chest'), sets: latinDigits(e.sets == null ? '3' : e.sets), reps: latinDigits(e.reps == null ? '10' : e.reps) })) : [] };
                }) }));
            d.p = { weeks }; const a = weeks.find(w => w.active) || weeks[0]; if (a) d.aw = a.id;
        }
        if (Array.isArray(raw.customExercises)) d.cx = raw.customExercises;
        if (isObj(raw.settings)) { d.s = toStr(raw.settings.weekStartsOn).toUpperCase(); d.rt = parseInt(raw.settings.restSeconds); }
        if (isObj(raw.history)) {
            d.h = {}; d.w = {};
            Object.keys(raw.history).forEach(name => {
                const list = raw.history[name]; if (!Array.isArray(list)) return;
                const k = getExKey('', '', '', name);
                d.h[k] = list.filter(isObj).map(e => {
                    const ts = Date.parse(e.date), l = { d: isNaN(ts) ? toStr(e.date) : formatLogDate(new Date(ts)), w: String(parseFloat(e.weightKg) || 0), s: Array.isArray(e.reps) ? e.reps.map(x => parseInt(x)).filter(x => x > 0) : [] };
                    if (!isNaN(ts)) l.ts = ts;
                    if (Array.isArray(e.weightsKg)) l.ws = e.weightsKg.map(x => String(parseFloat(x) || 0));
                    if (Array.isArray(e.rpe)) l.rpe = e.rpe;
                    if (e.unit === 'sec') l.u = 's';
                    if (e.routine) l.week = toStr(e.routine);
                    if (typeof e.day === 'number') l.dayId = e.day;
                    if (e.duration) l.time = toStr(e.duration);
                    return l;
                }).sort((a, b) => (a.ts || 0) - (b.ts || 0));
                const last = d.h[k][d.h[k].length - 1]; if (last) d.w[k] = last.w === '0' ? '' : last.w;
            });
        }
        return d;
    };

    // 👋 WELCOME: intro pages you swipe through, then Google sign-in (required).
    // Automated tests run without the sign-in page unless they ask for it (localStorage workoutTestGate = 1).
    const INTRO_KEY = 'workoutIntroSeen_rakan_final';
    // ⚙️ SWITCH: the file require-sign-in.js turns this on (an account is needed to use the app).
    // Delete that file and sign-in becomes optional again ("Not now" on the sign-in page).
    const REQUIRE_SIGN_IN = window.APEX_REQUIRE_SIGN_IN === true;
    const requireSignIn = () => { try { return REQUIRE_SIGN_IN || localStorage.getItem('workoutForceSignIn') === '1'; } catch (e) { return REQUIRE_SIGN_IN; } };
    const gateOn = () => { try { return !navigator.webdriver || localStorage.getItem('workoutTestGate') === '1'; } catch (e) { return true; } };
    const isSignedIn = () => { const f = getCloudFlag(); return !!(f && f.uid); };
    const welcomeOpen = () => document.getElementById('welcome-overlay').classList.contains('flex');
    const W_SLIDES = [
        { icon: 'dumbbell', title: 'Your training, organised', text: 'Your weekly plan, every set you lift and your progress — all in one place.', art: 'plan' },
        { icon: 'check-circle-2', title: 'Log a set in one tap', text: 'Your weights from last time are filled in. Tap ✓ after each set and the rest timer starts by itself.', art: 'sets' },
        { icon: 'trending-up', title: 'Watch yourself get stronger', text: 'The app tells you when to add weight, and shows your records and weekly volume per muscle.', art: 'chart' },
        { icon: 'shield-check', title: 'Sign in to start', text: 'Your workouts are saved to your Google account and kept in sync on all your phones.', art: 'gate' }
    ];
    const welcomeArt = a => {
        if (a === 'plan') return `<div class="w-full max-w-[290px] space-y-2.5">${[['Push', '6'], ['Pull', '6'], ['Legs', '5']].map(([n, c], i) => `<div class="flex items-center gap-3 rounded-2xl bg-white/[0.04] border border-white/10 px-4 py-3 float-${i}"><span class="w-9 h-9 rounded-full ${i === 0 ? 'bg-[#d4af37] text-black' : 'bg-white/5 text-slate-300'} flex items-center justify-center text-[12px] font-black">${tDay(['SAT', 'SUN', 'MON'][i]).slice(0, 3)}</span><span class="flex-1 text-[15px] font-black text-white">${t(n)}</span><span class="text-[11px] font-bold text-slate-400">${t('{n} exercises', { n: c })}</span></div>`).join('')}</div>`;
        if (a === 'sets') return `<div class="w-full max-w-[290px] rounded-2xl bg-white/[0.04] border border-white/10 p-3 space-y-2" dir="ltr">${[['60', '10', 1], ['60', '9', 1], ['60', '8', 0]].map(([w, r, d], i) => `<div class="grid grid-cols-[28px_1fr_1fr_44px] gap-2 items-center"><span class="w-7 h-7 rounded-full ${d ? 'bg-[#22c55e] text-black' : 'bg-white/5 text-slate-300'} text-[12px] font-black flex items-center justify-center">${i + 1}</span><span class="h-10 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center text-[15px] font-black text-[#d4af37]">${w}</span><span class="h-10 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center text-[15px] font-black text-white">${r}</span><span class="h-10 rounded-lg flex items-center justify-center ${d ? 'bg-[#22c55e] text-black' : 'bg-white/5 border border-white/10 text-slate-400'} ${i === 1 ? 'pop-loop' : ''}"><i data-lucide="check" class="w-5 h-5"></i></span></div>`).join('')}<div class="mt-1 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/25 px-3 py-2 flex items-center gap-2 text-[#22c55e] text-[12px] font-black"><i data-lucide="timer" class="w-4 h-4"></i>${t('Rest')} <span class="text-white text-[16px]">1:30</span></div></div>`;
        if (a === 'chart') return `<div class="w-full max-w-[290px] rounded-2xl bg-white/[0.04] border border-white/10 p-4"><div class="flex items-center justify-between mb-2"><span class="text-[13px] font-black text-white ex-name">Bench Press</span><span class="text-[11px] font-black text-[#22c55e]" dir="ltr">+12.5kg</span></div><svg viewBox="0 0 260 110" class="w-full h-auto" dir="ltr"><defs><linearGradient id="wg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#d4af37" stop-opacity=".35"/><stop offset="1" stop-color="#d4af37" stop-opacity="0"/></linearGradient></defs><path d="M5 95 L45 85 L85 80 L125 62 L165 58 L205 40 L255 18 L255 110 L5 110 Z" fill="url(#wg)"/><path class="draw-line" d="M5 95 L45 85 L85 80 L125 62 L165 58 L205 40 L255 18" fill="none" stroke="#d4af37" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="255" cy="18" r="5" fill="#d4af37"/></svg><div class="mt-2 inline-flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-md border text-[#22c55e] bg-[#22c55e]/10 border-[#22c55e]/20"><i data-lucide="arrow-up-circle" class="w-3 h-3"></i>${t('Add weight:')} <span dir="ltr">62.5kg × 8</span></div></div>`;
        return `<div class="relative w-28 h-28 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center glow-ring"><i data-lucide="cloud" class="w-14 h-14 text-[#d4af37]"></i></div>`;
    };
    let welcomeIdx = 0;
    const renderWelcome = () => {
        const box = document.getElementById('welcome-slides');
        const review = isSignedIn();
        box.innerHTML = W_SLIDES.map(sl => review && sl.art === 'gate' ? { ...sl, title: 'Please review and agree', text: 'To keep using Apex Lift, please agree to our Terms of Use and Privacy Policy.' } : sl).map(sl => `<section class="w-full shrink-0 snap-center flex flex-col items-center justify-center px-7 text-center gap-7" dir="${isAR ? 'rtl' : 'ltr'}">
            ${welcomeArt(sl.art)}
            <div><h2 class="text-[28px] font-black text-white leading-tight mb-3">${t(sl.title)}</h2><p class="text-[15px] font-bold text-slate-400 leading-relaxed max-w-[320px] mx-auto">${t(sl.text)}</p></div>
            ${sl.art === 'gate' ? '<div id="welcome-gate" class="w-full max-w-[340px]"></div>' : ''}
        </section>`).join('');
        const lang = document.getElementById('welcome-lang');
        lang.textContent = isAR ? 'English' : 'العربية';
        lang.onclick = () => window.appActions.setLanguage(isAR ? 'en' : 'ar');
        if (window.lucide) window.lucide.createIcons({ root: document.getElementById('welcome-overlay') });
        updateWelcomeUI();
    };
    const updateWelcomeUI = () => {
        const last = welcomeIdx === W_SLIDES.length - 1, loading = Cloud.status === 'loading';
        document.getElementById('welcome-dots').innerHTML = W_SLIDES.map((_, i) => `<span class="h-2 rounded-full transition-all duration-300 ${i === welcomeIdx ? 'w-6 bg-[#d4af37]' : 'w-2 bg-white/20'}"></span>`).join('');
        const agreed = !!getAgree();
        const gate = document.getElementById('welcome-gate');
        if (gate) gate.innerHTML = `${isSignedIn()
                ? `<button id="welcome-continue" onclick="window.appActions.welcomeContinue()" ${agreed ? '' : 'disabled'} class="w-full py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-black uppercase tracking-widest tap-feedback disabled:opacity-40 transition-opacity">${t('Continue')}</button>`
                : `<button id="welcome-google" onclick="window.appActions.welcomeSignIn()" ${agreed && !loading ? '' : 'disabled'} class="w-full py-4 rounded-2xl bg-white text-[#1f1f1f] text-[15px] font-bold flex items-center justify-center gap-3 tap-feedback disabled:opacity-40 transition-opacity">${GOOGLE_G}${loading ? t('Signing in…') : t('Continue with Google')}</button>`}
               <label class="flex items-start gap-3 mt-4 cursor-pointer text-start" dir="${isAR ? 'rtl' : 'ltr'}"><input id="welcome-agree" type="checkbox" ${agreed ? 'checked' : ''} onchange="window.appActions.welcomeAgree(this.checked)" class="mt-0.5 w-5 h-5 shrink-0 accent-[#d4af37]"><span class="text-[12px] font-bold text-slate-400 leading-snug">${t('I agree to the {terms} and the {privacy}.', { terms: `<a href="terms.html" target="_blank" rel="noopener" class="text-[#d4af37] underline">${t('Terms of Use')}</a>`, privacy: `<a href="privacy.html" target="_blank" rel="noopener" class="text-[#d4af37] underline">${t('Privacy Policy')}</a>` })}</span></label>`;
        if (gate && !isSignedIn() && !requireSignIn()) gate.insertAdjacentHTML('beforeend', `<button id="welcome-later" onclick="window.appActions.welcomeLater()" class="w-full mt-3 py-3 text-[13px] font-black uppercase tracking-widest text-slate-400 tap-feedback">${t('Not now')}</button>`);
        document.getElementById('welcome-actions').innerHTML = last ? '' : `<div class="flex gap-3"><button onclick="window.appActions.welcomeGo(${W_SLIDES.length - 1})" class="px-5 py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest text-slate-400 tap-feedback">${t('Skip')}</button><button onclick="window.appActions.welcomeGo(${welcomeIdx + 1})" class="flex-1 py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-black uppercase tracking-widest tap-feedback flex items-center justify-center gap-2">${t('Next')}<i data-lucide="${isAR ? 'arrow-left' : 'arrow-right'}" class="w-5 h-5"></i></button></div>`;
        if (window.lucide) window.lucide.createIcons({ root: document.getElementById('welcome-overlay') });
    };
    const showWelcome = (toLast = false) => {
        const o = document.getElementById('welcome-overlay');
        if (!welcomeOpen()) { o.classList.remove('hidden'); o.classList.add('flex'); welcomeIdx = 0; renderWelcome(); }
        if (toLast) window.appActions.welcomeGo(W_SLIDES.length - 1, true);
    };
    const hideWelcome = () => {
        const o = document.getElementById('welcome-overlay'); if (!welcomeOpen()) return;
        try { localStorage.setItem(INTRO_KEY, '1'); } catch (e) {}
        o.classList.add('fade-out'); setTimeout(() => { o.classList.add('hidden'); o.classList.remove('flex', 'fade-out'); }, 350);
    };
    document.getElementById('welcome-slides').addEventListener('scroll', e => {
        const el = e.currentTarget, i = Math.round(Math.abs(el.scrollLeft) / Math.max(1, el.clientWidth));
        if (i !== welcomeIdx) { welcomeIdx = Math.max(0, Math.min(W_SLIDES.length - 1, i)); updateWelcomeUI(); }
    }, { passive: true });

    // 💾 ACCOUNT BACKUPS: dated copies of everything, kept in your account, so a mistake can be undone
    const BK_KEEP = 10, BK_CHUNK = 400000, BK_AUTO_MS = 20 * 3600000;
    const bkPath = uid => `users/${uid}/backups`;
    const countWorkouts = h => { const days = new Set(); Object.values(h).forEach(list => (list || []).forEach(l => { const tt = logTime(l); if (!isNaN(tt)) days.add(dateKey(tt)); })); return days.size; };
    const listBackups = async () => {
        const qs = await Cloud.db.collection(bkPath(Cloud.user.uid)).get(), out = [];
        qs.forEach(d => { const x = d.data() || {}; if (Number(x.createdAt) > 0) out.push({ id: d.id, ...x }); });
        return out.sort((a, b) => b.createdAt - a.createdAt);
    };
    const deleteBackup = async b => {
        const uid = Cloud.user.uid, batch = Cloud.db.batch();
        for (let i = 0; i < (b.parts || 1); i++) batch.delete(Cloud.db.doc(`${bkPath(uid)}/${b.id}/parts/${i}`));
        batch.delete(Cloud.db.doc(`${bkPath(uid)}/${b.id}`));
        await batch.commit();
    };
    const cloudBackup = async kind => {
        if (!Cloud.user) throw new Error('signed out');
        const uid = Cloud.user.uid, h = StorageManager.getHistory();
        const json = JSON.stringify({ v: 1, main: collectMain(), history: h, deleted: getDeleted() }), id = String(Date.now());
        const parts = []; for (let i = 0; i < json.length; i += BK_CHUNK) parts.push(json.slice(i, i + BK_CHUNK));
        const batch = Cloud.db.batch();
        parts.forEach((d, i) => batch.set(Cloud.db.doc(`${bkPath(uid)}/${id}/parts/${i}`), { d }));
        batch.set(Cloud.db.doc(`${bkPath(uid)}/${id}`), { createdAt: Date.now(), kind, parts: parts.length, workouts: countWorkouts(h), exercises: Object.keys(h).filter(k => (h[k] || []).length).length, routines: appData.weeks.length, size: json.length });
        await batch.commit();
        // keep the newest 10 automatic and 10 other copies
        try {
            const all = await listBackups(), auto = all.filter(b => b.kind === 'auto'), other = all.filter(b => b.kind !== 'auto');
            for (const b of [...auto.slice(BK_KEEP), ...other.slice(BK_KEEP)]) await deleteBackup(b);
        } catch (e) { console.warn('Backup clean-up failed', e); }
        return id;
    };
    // once a day, after the first sync
    const maybeAutoBackup = async () => {
        try {
            if (!Cloud.user) return;
            const h = StorageManager.getHistory(); if (!Object.values(h).some(l => (l || []).length)) return;
            const last = (await listBackups()).find(b => b.kind === 'auto');
            if (!last || Date.now() - last.createdAt > BK_AUTO_MS) await cloudBackup('auto');
        } catch (e) { console.warn('Auto backup failed', e); }
    };
    const loadBackup = async id => {
        const uid = Cloud.user.uid, meta = (await Cloud.db.doc(`${bkPath(uid)}/${id}`).get()).data() || {};
        let json = '';
        for (let i = 0; i < (meta.parts || 1); i++) json += ((await Cloud.db.doc(`${bkPath(uid)}/${id}/parts/${i}`).get()).data() || {}).d || '';
        return JSON.parse(json);
    };
    const restoreSnapshot = data => {
        if (!isObj(data) || !isObj(data.main)) throw new Error('Backup is damaged');
        applyMain({ ...data.main, updatedAt: Date.now() });
        const cur = StorageManager.getHistory(), snap = sanitizeHistory(data.history), del = isObj(data.deleted) ? data.deleted : {}, resets = getResets(), now = Date.now();
        // the copy wins everywhere: every exercise gets a new reset time, exercises added later are emptied
        Object.keys(cur).forEach(k => { if (!(k in snap)) snap[k] = []; });
        Object.keys(snap).forEach(k => { resets[k] = now; if (!Array.isArray(del[k])) del[k] = []; });
        Cloud.applying = true; StorageManager.setHistory(snap); setDeleted(del); setResets(resets); Cloud.applying = false;
        loggedWeights = StorageManager.get();
        refreshAfterCloud();
        Cloud.sent = {}; return cloudFlush();
    };
    const kindLabel = k => k === 'auto' ? t('Automatic') : k === 'before-restore' ? t('Before restore') : k === 'before-coach' ? t('Before coach update') : t('Manual');
    const renderBackups = async () => {
        const list = document.getElementById('backups-list');
        list.innerHTML = `<div class="p-8 text-center text-[12px] font-bold text-slate-500">${t('Loading…')}</div>`;
        try {
            const all = await listBackups();
            if (!all.length) { list.innerHTML = `<div class="p-8 text-center text-[13px] font-bold text-slate-500">${t('No backups yet. Tap Back up now to make the first one.')}</div>`; return; }
            list.innerHTML = all.map(b => `<div class="flex items-center gap-3 px-5 py-3.5 border-b border-white/5">
                <span class="w-10 h-10 rounded-full ${b.kind === 'auto' ? 'bg-white/5 text-slate-300' : 'bg-[#d4af37]/15 text-[#d4af37]'} flex items-center justify-center shrink-0"><i data-lucide="${b.kind === 'auto' ? 'clock' : b.kind === 'before-restore' ? 'rotate-ccw' : 'save'}" class="w-5 h-5"></i></span>
                <div class="flex-1 min-w-0"><div class="text-[14px] font-black text-white">${esc(fmtDate(b.createdAt, true))}</div><div class="text-[11px] font-bold text-slate-400">${esc(kindLabel(b.kind))} · ${t('{n} workouts', { n: Number(b.workouts) || 0 })} · ${t('{n} exercises', { n: Number(b.exercises) || 0 })}</div></div>
                <button onclick="window.appActions.restoreBackup(${jsArg(b.id)}, ${jsArg(fmtDate(b.createdAt, true))})" class="shrink-0 px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-widest text-white tap-feedback">${t('Restore')}</button>
            </div>`).join('');
            if (window.lucide) window.lucide.createIcons({ root: list });
        } catch (e) {
            console.warn(e);
            list.innerHTML = `<div class="p-8 text-center text-[13px] font-bold text-red-400">${e && /permission/i.test(e.code || '') ? t('Backups are blocked by the Firebase rules. Publish the new firestore.rules.') : t('Could not load backups. Check your connection.')}</div>`;
        }
    };

    // 💡 HINTS: one small tip per screen for new users, shown once, pointing at the thing it explains
    const HINTS_KEY = 'workoutHints_rakan_final';
    let hintBox = null;
    const hintSeen = id => !!(readJSON(HINTS_KEY, {}) || {})[id];
    const hintBlocked = () => welcomeOpen() || ['onboarding-overlay', 'custom-confirm-overlay', 'summary-overlay', 'picker-overlay', 'exedit-overlay', 'swapsetup-overlay'].some(id => { const o = document.getElementById(id); return o && o.classList.contains('flex'); });
    const closeHint = () => {
        if (!hintBox) return;
        const { el, target, id } = hintBox; hintBox = null;
        try { const m = readJSON(HINTS_KEY, {}) || {}; m[id] = 1; localStorage.setItem(HINTS_KEY, JSON.stringify(m)); } catch (e) {}
        if (target) target.classList.remove('hint-ring');
        el.classList.add('opacity-0'); setTimeout(() => el.remove(), 250);
    };
    const hint = (id, sel, text, delay = 650) => {
        if (!gateOn() && !localStorage.getItem('workoutTestHints')) return; // automated tests: no hints unless asked
        if (hintSeen(id) || hintBox) return;
        setTimeout(() => {
            if (hintSeen(id) || hintBox || hintBlocked()) return;
            const target = typeof sel === 'string' ? document.querySelector(sel) : sel; if (!target) return;
            const r = target.getBoundingClientRect(); if (!r.width || r.top < 0 || r.bottom > window.innerHeight) return;
            // only when the thing is really on screen (not covered by a sheet or pop-up)
            const top = document.elementFromPoint(r.left + r.width / 2, r.top + Math.min(r.height / 2, 20));
            if (!top || !(target === top || target.contains(top))) return;
            const el = document.createElement('div'), below = r.bottom + 150 < window.innerHeight;
            el.className = 'fixed z-[9600] max-w-[300px] rounded-2xl bg-[#1a1a1a] border border-[#d4af37]/50 shadow-[0_15px_40px_rgba(0,0,0,0.7)] p-4 transition-opacity duration-200 hint-in';
            el.setAttribute('dir', isAR ? 'rtl' : 'ltr');
            el.innerHTML = `<div class="flex items-start gap-2.5"><i data-lucide="lightbulb" class="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5"></i><p class="text-[13px] font-bold text-white leading-snug flex-1">${esc(text)}</p></div><div class="flex justify-end mt-2.5"><span class="px-3 py-1.5 rounded-lg bg-[#d4af37] text-black text-[11px] font-black uppercase tracking-widest">${t('Got it')}</span></div>`;
            document.body.appendChild(el);
            const w = el.offsetWidth, left = Math.max(12, Math.min(window.innerWidth - w - 12, r.left + r.width / 2 - w / 2));
            el.style.left = left + 'px';
            el.style.top = below ? (r.bottom + 12) + 'px' : Math.max(12, r.top - el.offsetHeight - 12) + 'px';
            if (window.lucide) window.lucide.createIcons({ root: el });
            target.classList.add('hint-ring');
            hintBox = { el, target, id };
            // any tap closes the tip (and still does what it was meant to)
            setTimeout(() => document.addEventListener('pointerdown', closeHint, { once: true, capture: true }), 50);
        }, delay);
    };
    const todayHints = () => {
        hint('today-ex', '#workout-container .ex-card', t('Tap an exercise to see its details and start it.'));
        if (hintSeen('today-ex')) hint('today-days', '#today-week', t('Tap a day, or swipe left or right, to see another day of your plan.'));
    };

    Object.assign(window.appActions, {
        welcomeGo: (i, instant = false) => {
            const box = document.getElementById('welcome-slides');
            welcomeIdx = Math.max(0, Math.min(W_SLIDES.length - 1, i));
            box.scrollTo({ left: welcomeIdx * box.clientWidth, behavior: instant ? 'auto' : 'smooth' });
            updateWelcomeUI();
        },
        welcomeAgree: on => {
            try { if (on) localStorage.setItem(AGREE_KEY, JSON.stringify({ v: TERMS_VERSION, at: Date.now() })); else localStorage.removeItem(AGREE_KEY); } catch (e) {}
            updateWelcomeUI();
        },
        setAbout: (field, value) => {
            const b = getBody(), v = latinDigits(value).trim();
            if (field === 'sex') b.sex = b.sex === value ? undefined : value;
            else if (field === 'birthYear') { const y = parseInt(v); if (!v) delete b.birthYear; else if (y >= thisYear() - 100 && y <= thisYear() - 5) b.birthYear = y; else window.appActions.showToast(t('Please check this number.'), 'error'); }
            else if (field === 'heightCm') { const h = parseFloat(v); if (!v) delete b.heightCm; else if (h >= 100 && h <= 250) b.heightCm = h; else window.appActions.showToast(t('Please check this number.'), 'error'); }
            else if (field === 'weightKg') {
                const w = parseFloat(v.replace(/[\u066B\u060C,]/g, '.'));
                if (!v) delete b.weightKg;
                else if (w >= 25 && w <= 350) { b.weightKg = w; const log = (b.log || []).filter(x => dateKey(x.t) !== dateKey()); log.push({ t: Date.now(), kg: w }); b.log = log; }
                else window.appActions.showToast(t('Please check this number.'), 'error');
            }
            setBody(b);
            if (field === 'sex') {
                renderAbout();
                const ob = document.getElementById('onboarding-overlay'); if (ob && ob.classList.contains('flex') && window.appState.wiz && window.appState.wiz.steps[window.appState.wiz.step] === 'about') window.appActions.renderWizard();
            } else setTimeout(refreshAbout, 0);
        },
        welcomeLater: () => { if (requireSignIn() && !isSignedIn()) return; hideWelcome(); window.appActions.initOnboarding(); },
        welcomeContinue: () => {
            if (!getAgree()) return;
            hideWelcome(); window.appActions.initOnboarding();
            if (Cloud.user) { Cloud.sent.main = ''; scheduleFlush(300); } // save the agreement to the account
        },
        welcomeSignIn: () => {
            if (!getAgree()) return window.appActions.showToast(t('Please agree to the Terms and Privacy Policy first.'), 'error');
            if (navigator.onLine === false) return window.appActions.showToast(t('No internet connection. Try again when online.'), 'error');
            window.appActions.cloudSignIn();
        },
        openBackups: () => { if (!Cloud.user) return; openSheet('backups-overlay', 'backups-box'); pushBack('backups', () => window.appActions.closeBackups()); renderBackups(); },
        closeBackups: () => { popBack('backups'); closeSheet('backups-overlay', 'backups-box'); },
        backupNow: async () => {
            const b = document.getElementById('backups-now'); if (b.disabled) return;
            b.disabled = true; b.classList.add('opacity-60');
            try { await cloudBackup('manual'); window.appActions.showToast(t('Backup saved to your account'), 'success'); renderBackups(); }
            catch (e) { console.warn(e); window.appActions.showToast(e && /permission/i.test(e.code || '') ? t('Backups are blocked by the Firebase rules. Publish the new firestore.rules.') : t('Could not save the backup. Check your connection.'), 'error'); }
            finally { b.disabled = false; b.classList.remove('opacity-60'); }
        },
        restoreBackup: (id, label) => window.appActions.showConfirm(t('Restore this backup?'), t('Your routines, settings and workouts go back to {date}, on all your phones. A copy of how things are now is saved first.', { date: label }), async () => {
            try {
                window.appActions.showToast(t('Restoring…'), 'success');
                await cloudBackup('before-restore');
                await restoreSnapshot(await loadBackup(id));
                window.appActions.closeBackups();
                window.appActions.showToast(t('Backup restored'), 'success');
            } catch (e) { console.warn(e); window.appActions.showToast(t('Could not restore. Check your connection.'), 'error'); }
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
        const th = document.getElementById('setting-theme'); if (th) th.value = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    };
    applyStaticLanguage();
    window.appActions.switchTab('today');
    enableSwipeDown(document.getElementById('picker-box'), () => window.appActions.closePicker());
    enableSwipeDown(document.getElementById('history-modal-box'), () => window.appActions.closeHistoryModal());
    enableSwipeDown(document.getElementById('programs-box'), () => window.appActions.closePrograms());
    enableDaySwipe(document.getElementById('workout-container'));
    // An unfinished Log/Focus session (e.g. the phone closed the app during rest) comes back minimized
    (() => {
        const dr = readJSON(SESSION_KEY, null);
        const ok = isObj(dr) && Array.isArray(dr.exercises) && dr.exercises.length && Array.isArray(dr.rows)
            && typeof dr.startedAt === 'number' && Date.now() - dr.startedAt < 72 * 3600000 && getActiveSchedule().some(d => d.id === dr.dayId);
        if (!ok) { clearSessionDraft(); return; }
        dr.exercises = dr.exercises.filter(isObj).slice(0, 40).map(x => ({ k: toStr(x.k), name: toStr(x.name), muscle: toStr(x.muscle), sets: parseInt(x.sets) || 1, repsStr: toStr(x.repsStr), timed: isTimed(toStr(x.repsStr)), offset: parseInt(x.offset) || 0, pw: toStr(x.pw), pr: parseInt(x.pr) || 8, sg: isObj(x.sg) && SUGG[x.sg.type] ? { type: x.sg.type, w: parseFloat(x.sg.w) || 0, r: parseInt(x.sg.r) || 0 } : null }));
        dr.rows = dr.rows.filter(isObj).slice(0, 200).map(r => ({ e: parseInt(r.e) || 0, w: toStr(r.w), r: toStr(r.r), rpe: toStr(r.rpe), done: r.done === true }));
        dr.title = toStr(dr.title);
        if (typeof dr.weekId !== 'string' || !appData.weeks.some(w => w.id === dr.weekId)) dr.weekId = currentWeekId;
        window.appActions.startWorkout(dr.dayId, dr);
        // forgot to tap Finish yesterday? keep the sets and remind instead of throwing them away
        if (Date.now() - dr.startedAt > 6 * 3600000) setTimeout(() => window.appActions.showToast(t('You have an unfinished workout. Finish it to save your sets.'), 'error'), 800);
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
    // First launch (or signed out): intro pages + sign-in. Signed in: straight to the app (setup questions if needed).
    setTimeout(() => {
        const introSeen = localStorage.getItem(INTRO_KEY) === '1';
        if (gateOn() && ((!isSignedIn() && (requireSignIn() || !introSeen)) || (isSignedIn() && !getAgree()))) showWelcome(introSeen || isSignedIn());
        else window.appActions.initOnboarding();
    }, 300);
    // Coming back to the app on a new day: jump to today (unless a workout is open)
    let lastToday = getTodayId();
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState !== 'visible') return;
        if (Cloud.user) scheduleFlush(2000); // a new day: the "last active" day is uploaded (nothing is sent if nothing changed)
        if (window.appState.sess) return;
        const now = getTodayId();
        if (now !== lastToday) { lastToday = now; activeDay = now; renderNav(); renderWorkout(); }
    });
    // 📶 OFFLINE SUPPORT: save a copy of the app on the phone (see sw.js)
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
        window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(err => console.warn('Offline mode unavailable:', err)));
    }
})();
