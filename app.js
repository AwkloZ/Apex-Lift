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
        "\"Low in plan\" means your routine has few sets for it: add some in the Plan tab.": "\"قليل في الخطة\" يعني أن روتينك فيه مجموعات قليلة لهذه العضلة: أضف المزيد من تبويب الخطة.",
        "Also in Profile → Your profile.": "متوفر أيضًا في حسابي ← ملفك.",
        "Body": "الجسم",
        "Compared with the same days last week.": "مقارنةً بنفس الأيام من الأسبوع الماضي.",
        "Done / planned": "المنجز / المخطط",
        "Dropping": "في تراجع",
        "Heaviest weight": "أثقل وزن",
        "Holding steady": "ثابت",
        "Improving": "في تحسّن",
        "Log today's weight": "سجّل وزن اليوم",
        "Log your weight once a week, at the same time of day, to see how it changes.": "سجّل وزنك مرة في الأسبوع، في نفس الوقت من اليوم، لترى كيف يتغيّر.",
        "Longest hold": "أطول ثبات",
        "Low in plan": "قليل في الخطة",
        "Most reps": "أكثر تكرارات",
        "Muscle": "العضلة",
        "No data last week": "لا توجد بيانات للأسبوع الماضي",
        "No exercises match.": "لا توجد تمارين مطابقة.",
        "Ready to add weight": "جاهز لزيادة الوزن",
        "Save": "حفظ",
        "Sets this week": "مجموعات هذا الأسبوع",
        "Stronger (est. 1-rep max)": "أقوى (الحد الأقصى المقدّر لتكرار واحد)",
        "Tap a bar to see that week.": "اضغط على عمود لترى ذلك الأسبوع.",
        "Track your body weight": "تابع وزن جسمك",
        "Update today's weight": "حدّث وزن اليوم",
        "Week of {d}": "أسبوع {d}",
        "Weeks in a row": "دون انقطاع",
        "Weight saved": "تم حفظ الوزن",
        "Workouts": "الحصص",
        "Your week, every exercise, sets per muscle and your body weight are here.": "أسبوعك، وكل تمرين، والمجموعات لكل عضلة، ووزن جسمك — كلها هنا.",
        "in 30 days": "خلال 30 يومًا",
        "since you started": "منذ أن بدأت",
        "vs last week": "مقارنةً بالأسبوع الماضي",
        "{n} planned": "من أصل {n}",
        "Next workout": "الحصة القادمة",
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
        "Core": "الجذع",
        "Duplicate routine": "نسخ الجدول",
        "{name} (copy)": "{name} (نسخة)",
        "Routine duplicated": "تم نسخ الجدول",
        "Tap a day to edit it. Hold ⋮⋮ and drag to move it to another day.": "اضغط على يوم لتعديله. اضغط مطولًا على ⋮⋮ واسحبه لنقله إلى يوم آخر.",
        "Tap ✏️ to change this day's exercises.": "اضغط ✏️ لتغيير تمارين هذا اليوم.",
        "Add exercises to start training on this day.": "أضف تمارين لتبدأ التمرين في هذا اليوم.",
        "Tap a day to edit it": "اضغط على يوم لتعديله",
        "Tap a day to edit it. Tap ✏️ next to Coach to move days.": "اضغط على يوم لتعديله. اضغط ✏️ بجانب المدرب لنقل الأيام.",
        "Drag the days to move them": "اسحب الأيام لنقلها",
        "Move days": "نقل الأيام",
        "Rename routine": "إعادة تسمية الجدول",
        "Settings": "الإعدادات",
        "Workout settings": "إعدادات التمرين",
        "App settings": "إعدادات التطبيق",
        "Rest timer, RPE, start of the week": "مؤقت الراحة، RPE، بداية الأسبوع",
        "Language and theme": "اللغة والمظهر",
        "From a friend's code": "من رمز صديق",
        "Your information": "معلوماتك",
        "Go to today's workout": "اذهب إلى حصة اليوم",
        "Edit": "تعديل",
        "More": "المزيد",
        "More day tools": "أدوات اليوم الأخرى",
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
        "Finish your workout first, then change your plan.": "أنهِ تمرينك أولًا، ثم عدّل برنامجك.",
        "Try again": "حاول مرة أخرى",
        "Apex Coach is thinking. A full program can take up to 30 seconds.": "مدرب Apex يفكّر. قد يستغرق البرنامج الكامل حتى ٣٠ ثانية.",
        "How is my progress?": "كيف تقدّمي؟",
        "I don't like one exercise in my routine": "لا أرتاح لتمرين في جدولي",
        "Which muscle is my weakest?": "ما أضعف عضلة عندي؟",
        "Here are the changes.": "هذه التعديلات.",
        "No changes to your routine.": "لا تعديلات على جدولك.",
        "What changes": "ما الذي يتغيّر",
        "Becomes a rest day": "يصبح يوم راحة",
        "Becomes a training day": "يصبح يوم تمرين",
        "Apply changes": "طبّق التعديلات",
        "Applied": "تم التطبيق",
        "Only these changes are made to {name}. Your history is kept.": "تُطبَّق هذه التعديلات فقط على {name}. سجلك محفوظ.",
        "Your coach remembers": "ما يتذكّره مدربك",
        "Forget all": "انسَ الكل",
        "Forget everything?": "نسيان كل شيء؟",
        "Your coach forgets the notes it kept about you.": "سينسى مدربك الملاحظات التي حفظها عنك.",
        "This chat is deleted from this phone. What your coach remembers about you is kept.": "ستُحذف هذه المحادثة من هذا الجوال، ويبقى ما يتذكّره مدربك عنك.",
        "Coach": "المدرب",
        "Apex Coach": "مدرب Apex",
        "Meet Apex Coach": "تعرّف على مدرب Apex",
        "Build with Apex Coach": "ابنِ برنامجك مع مدرب Apex",
        "Tell it what you want: it builds a program from your answers and workouts.": "أخبره بما تريد، ويبني لك برنامجًا من إجاباتك وتمارينك.",
        "Build a program that fits you": "برنامج يناسبك أنت",
        "Tell it what you want and it builds a program for you, from your answers and your workouts.": "أخبره بما تريد، ويبني لك برنامجًا من إجاباتك وتمارينك.",
        "To answer, your training answers, age, sex, body weight, routines, workout history and check-ins are sent to Google Gemini. Your name and email are not sent.": "حتى يجيبك، تُرسل إجابات التمرين والعمر والجنس ووزن الجسم والجداول وسجل التمارين والتقييمات اليومية إلى Google Gemini. لا يُرسل اسمك ولا بريدك.",
        "Its answers can be wrong. It is not medical advice: stop if something hurts and see a doctor.": "قد تكون إجاباته خاطئة، وهي ليست نصيحة طبية: توقّف إذا شعرت بألم وراجع طبيبًا.",
        "The chat is saved on this phone. Google and the Apex Lift team can see the questions for a limited time, so don't type private details.": "المحادثة محفوظة على هذا الجوال، ويمكن لـ Google وفريق Apex Lift الاطلاع على الأسئلة لمدة محدودة، لذا لا تكتب معلومات خاصة.",
        "Got it, start": "فهمت، لنبدأ",
        "Ask for a program, a change to your routine, or anything about training.": "اطلب برنامجًا، أو تعديلًا على جدولك، أو اسأل أي سؤال عن التمرين.",
        "Build the best program for me": "ابنِ لي أفضل برنامج",
        "My workouts take too long. Make them shorter.": "تمريني يأخذ وقتًا طويلًا. اجعله أقصر.",
        "I only have dumbbells at home": "عندي دمبلز فقط في البيت",
        "What should I improve in my current routine?": "ماذا أحسّن في جدولي الحالي؟",
        "Ask your coach…": "اسأل مدربك…",
        "Send": "إرسال",
        "New chat": "محادثة جديدة",
        "Start a new chat?": "بدء محادثة جديدة؟",
        "This chat is deleted from this phone.": "ستُحذف هذه المحادثة من هذا الجوال.",
        "Thinking…": "يفكّر…",
        "See all days": "عرض كل الأيام",
        "Hide days": "إخفاء الأيام",
        "Use it again": "استخدمه مرة أخرى",
        "Apex Coach program": "برنامج مدرب Apex",
        "Here is a program for you.": "هذا برنامج لك.",
        "Apex Coach is busy right now. Try again in a minute.": "مدرب Apex مشغول الآن. حاول بعد دقيقة.",
        "Apex Coach is not ready yet. Try again later.": "مدرب Apex غير جاهز بعد. حاول لاحقًا.",
        "Apex Coach could not answer. Try again.": "لم يستطع مدرب Apex الإجابة. حاول مرة أخرى.",
        "That is all the questions for today. Try again tomorrow.": "انتهت أسئلة اليوم. حاول مرة أخرى غدًا.",
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
        "Barbells, machines and cables": "بار وأجهزة وكابلات",
        "Best": "الأفضل",
        "Best reps": "أكثر تكرارات",
        "Best time": "أطول وقت",
        "Best weight": "أثقل وزن",
        "Build muscle": "بناء العضلات",
        "Day type": "نوع اليوم",
        "Delete routine": "حذف الجدول",
        "Delete this routine? Your history is kept.": "حذف هذا الجدول؟ سجلك لن يُحذف.",
        "Dumbbells only": "دمبل فقط",
        "Est. 1-rep max": "الحد الأقصى المقدّر",
        "Exercise history": "سجل التمرين",
        "Extra sets on the main lifts": "مجموعات إضافية للتمارين الأساسية",
        "Fewer sets to start": "مجموعات أقل للبداية",
        "Finish your first workout to see your progress here.": "أنهِ أول حصة لترى تقدّمك هنا.",
        "Full gym": "نادٍ مجهّز بالكامل",
        "Get bigger and more defined": "حجم أكبر وتفاصيل أوضح",
        "Get stronger": "زيادة القوة",
        "Heaviest weight per session": "أثقل وزن في كل تمرين",
        "Home or a small gym": "المنزل أو نادٍ صغير",
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
        "No new records yet. Add weight when the app says so and they will come.": "لا أرقام قياسية جديدة بعد. زِد الوزن عندما يقترح التطبيق ذلك وستحققها.",
        "No workouts yet": "لا توجد حصص بعد",
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
        "See all {n} programs": "عرض كل البرامج ({n})",
        "Sessions": "الحصص",
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
        "Workout history": "سجل الحصص",
        "Workouts this week": "حصص هذا الأسبوع",
        "You have 5 routines (the most). The current one will be replaced; your history is kept.": "لديك 5 جداول (الحد الأقصى). سيتم استبدال الجدول الحالي، وسجلك لن يُحذف.",
        "Your current routine and all your history are kept.": "جدولك الحالي وكل سجلك يبقيان كما هما.",
        "Your program": "برنامجك",
        "Your routines go back to the default. Your history is kept.": "ستعود جداولك إلى الوضع الافتراضي. سجلك لن يُحذف.",
        "Your week in the app starts on this day.": "يبدأ أسبوعك في التطبيق من هذا اليوم.",
        "kg lifted this week": "كجم إجمالي هذا الأسبوع",
        "{name} is ready": "{name} جاهز",
        "{n} days": "{n} أيام",
        "{n} sessions": "{n} حصص",
        "Push / Pull / Legs": "دفع / سحب / أرجل",
        "Push / Pull / Legs (3 days)": "دفع / سحب / أرجل (3 أيام)",
        "Upper / Lower": "علوي / سفلي",
        "PHUL (Power + Hypertrophy)": "PHUL (قوة + تضخيم)",
        "Upper / Lower + Push / Pull / Legs": "علوي / سفلي + دفع / سحب / أرجل",
        "Bro Split": "تقسيم العضلات (Bro Split)",
        "Arnold Split": "تقسيم أرنولد",
        "Full Body": "جسم كامل",
        "5×5 Strength": "قوة 5×5",
        "Glutes & Legs Focus": "تركيز على الألوية والأرجل",
        "Dumbbells Only": "دمبل فقط",
        "Each muscle twice a week. The classic for building muscle.": "كل عضلة مرتين في الأسبوع. الخيار الكلاسيكي لبناء العضلات.",
        "The same split once a week, with a rest day between sessions.": "نفس التقسيم مرة في الأسبوع، مع يوم راحة بين التمارين.",
        "Upper and lower body twice a week. Balanced and easy to fit in.": "الجزء العلوي والسفلي مرتين في الأسبوع. متوازن وسهل الالتزام.",
        "Two heavy days for strength and two volume days for size.": "يومان ثقيلان للقوة ويومان بحجم أعلى للتضخيم.",
        "Five days: upper and lower, then push, pull and legs.": "خمسة أيام: علوي وسفلي، ثم دفع وسحب وأرجل.",
        "One muscle group per day: chest, back, shoulders, arms and legs.": "عضلة واحدة كل يوم: صدر، ظهر، أكتاف، ذراعين، أرجل.",
        "Chest & back, shoulders & arms, legs. Twice a week, high volume.": "صدر وظهر، أكتاف وذراعين، أرجل. مرتين في الأسبوع وبحجم عالٍ.",
        "The whole body every session. Great with a busy schedule.": "الجسم كامل في كل تمرين. مناسب لمن وقته ضيق.",
        "Few big lifts, heavy weights, 5 sets of 5. Built for strength.": "تمارين أساسية قليلة وأوزان ثقيلة، 5 مجموعات × 5. مصمم للقوة.",
        "Extra work for glutes and legs, plus one upper body day.": "تمرين إضافي للألوية والأرجل، مع يوم للجزء العلوي.",
        "Only dumbbells needed. Good for home or a small gym.": "يكفيك زوج دمبل. مناسب للمنزل أو نادٍ صغير.",
        "Arms": "الذراعان",
        "Back": "الظهر",
        "Chest": "الصدر",
        "Chest & Back": "صدر وظهر",
        "Glutes": "الألوية",
        "Glutes & Hamstrings": "الألوية وأوتار الركبة",
        "Lower Hypertrophy": "تضخيم سفلي",
        "Lower Power": "قوة سفلي",
        "Quads & Glutes": "رباعية الرؤوس والألوية",
        "Shoulders": "الأكتاف",
        "Shoulders & Arms": "أكتاف وذراعين",
        "Strength A": "قوة A",
        "Strength B": "قوة B",
        "Upper Hypertrophy": "تضخيم علوي",
        "Upper Power": "قوة علوي",
        "Add reps": "زِد التكرارات",
        "Add weight": "زِد الوزن",
        "Add weight:": "زِد الوزن:",
        "Aim:": "الهدف:",
        "Continue workout": "متابعة الحصة",
        "Discard this workout?": "تجاهل هذه الحصة؟",
        "Done this week": "منجز هذا الأسبوع",
        "Easy day:": "يوم خفيف:",
        "Exercises": "التمارين",
        "Finish workout": "إنهاء الحصة",
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
        "Recover well. See you next session.": "خذ قسطًا كافيًا من الراحة. نراك في الحصة القادمة.",
        "Show RPE": "إظهار مستوى الجهد (RPE)",
        "Start workout": "ابدأ الحصة",
        "Time": "الوقت",
        "Today": "اليوم",
        "Workout complete!": "أحسنت! اكتملت الحصة",
        "kg lifted": "كجم إجمالي",
        "sets": "مجموعات",
        "{n} exercises": "{n} تمارين",
        "{n} sets": "{n} مجموعات",
        "~{n} min": "~{n} دقيقة",
        "Previous": "السابق",
        "Save & next": "حفظ والتالي",
        "Add set": "إضافة مجموعة",
        "Remove set": "حذف مجموعة",
        "Tap a previous set to copy it. RPE (optional): 10 = no reps left, 9 = 1 left, 8 = 2 left.": "اضغط على المجموعة السابقة لنسخها. RPE (اختياري): 10 = لا تكرارات متبقية، 9 = تكرار واحد، 8 = تكراران.",
        "Discard current session?": "تجاهل الحصة الحالية؟",
        "Unsaved sets for {name} will be lost.": "ستضيع المجموعات غير المحفوظة لتمرين {name}.",
        "Your unsaved sets will be lost.": "ستضيع مجموعاتك غير المحفوظة.",
        "Enter KG for every set (0 = bodyweight)": "أدخل الوزن لكل مجموعة (0 = وزن الجسم)",
        "Confirm": "تأكيد",
        "Workout completed": "اكتملت الحصة",
        "Day progress": "تقدّم اليوم",
        "Copy to...": "نسخ إلى...",
        "Copy": "نسخ",
        "Copied to {day}": "تم النسخ إلى {day}",
        "Replace {day}?": "استبدال {day}؟",
        "Its current exercises will be replaced.": "سيتم استبدال تمارينه الحالية.",
        "Last backup: today": "آخر نسخة احتياطية: اليوم",
        "Last backup: {n} days ago": "آخر نسخة احتياطية: قبل {n} أيام",
        "-- Skip (Do Not Import) --": "-- تخطي (لا تستورد) --",
        "1 exercise added": "تمت إضافة تمرين واحد",
        "3 quick taps to adjust today's targets.": "3 ضغطات سريعة لضبط أهداف اليوم.",
        "A bit": "قليلًا",
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
        "Confirm Action": "تأكيد الإجراء",
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
        "GO!": "يلا!",
        "Great": "ممتاز",
        "High": "مرتفع",
        "In this day": "موجود في هذا اليوم",
        "In your routines": "في جداولك",
        "Invalid Backup file": "ملف النسخة الاحتياطية غير صالح",
        "KG": "كجم",
        "kg": "كجم",
        "reps": "تكرار",
        "sec": "ثانية",
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
        "OK": "عادي",
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
        "Back up now": "نسخ احتياطي الآن",
        "Backup restored": "تم استرجاع النسخة",
        "Backup saved to your account": "تم حفظ النسخة في حسابك",
        "Backup isn't available right now. Try again later.": "النسخ الاحتياطي غير متاح حاليًا. حاول لاحقًا.",
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
        "Loading…": "جارٍ التحميل…",
        "Manual": "يدوية",
        "Next": "التالي",
        "No backups yet. Tap Back up now to make the first one.": "لا توجد نسخ بعد. اضغط «نسخ احتياطي الآن» لإنشاء أول نسخة.",
        "Privacy Policy": "سياسة الخصوصية",
        "Rest timer: it starts by itself. Use −15 / +15 or Skip.": "مؤقت الراحة يبدأ تلقائيًا. استخدم −15 / +15 أو تخطي.",
        "Restore": "استرجاع",
        "Restore this backup?": "استرجاع هذه النسخة؟",
        "Restoring…": "جارٍ الاسترجاع…",
        "Tap a day, or swipe left or right, to see another day of your plan.": "اضغط على يوم، أو اسحب يمينًا أو يسارًا، لترى يومًا آخر من خطتك.",
        "Tap an exercise to see its details and start it.": "اضغط على تمرين لترى تفاصيله وتبدأه.",
        "Tap ⌄ to look at your plan. The workout keeps running at the bottom.": "اضغط ⌄ لعرض خطتك، وتبقى الحصة مستمرة في الأسفل.",
        "Terms of Use": "شروط الاستخدام",
        "Your records, next targets and weekly volume per muscle are here.": "أرقامك القياسية وأهدافك القادمة وحجم التمرين الأسبوعي لكل عضلة هنا.",
        "Your routines, settings and workouts go back to {date}, on all your phones. A copy of how things are now is saved first.": "ستعود جداولك وإعداداتك وحصصك إلى {date} على جميع أجهزتك، بعد حفظ نسخة من وضعك الحالي.",
        "{n} workouts": "{n} حصص",
        "Your training, organised": "تمرينك منظّم",
        "Your weekly plan, every set you lift and your progress — all in one place.": "خطتك الأسبوعية وكل مجموعة ترفعها وتقدّمك — في مكان واحد.",
        "Log a set in one tap": "سجّل المجموعة بلمسة",
        "Your weights from last time are filled in. Tap ✓ after each set and the rest timer starts by itself.": "أوزانك من المرة السابقة مكتوبة مسبقًا. اضغط ✓ بعد كل مجموعة ويبدأ مؤقت الراحة تلقائيًا.",
        "Watch yourself get stronger": "شاهد قوتك تزداد",
        "The app tells you when to add weight, and shows your records and weekly volume per muscle.": "يخبرك التطبيق متى تزيد الوزن، ويعرض أرقامك القياسية وحجم التمرين الأسبوعي لكل عضلة.",
        "Sign in to start": "سجّل الدخول للبدء",
        "Your workouts are saved to your Google account and kept in sync on all your phones.": "تُحفظ حصصك في حساب Google وتتزامن على كل أجهزتك.",
        "Please review and agree": "يرجى المراجعة والموافقة",
        "To keep using Apex Lift, please agree to our Terms of Use and Privacy Policy.": "لمتابعة استخدام Apex Lift، يرجى الموافقة على شروط الاستخدام وسياسة الخصوصية.",
        "Push & Bi": "دفع وذات الرأسين",
        "Pull & TRI": "سحب وثلاثية الرؤوس",
        "Legs A": "أرجل A",
        "Lower Body & Abs": "الجزء السفلي والبطن",
        "Finish workout?": "إنهاء الحصة؟",
        "{n} sets are still empty. Only the sets you did will be saved.": "{n} مجموعات ما زالت فارغة. سيتم حفظ المجموعات التي أديتها فقط.",
        "Log the rest": "سجّل الباقي",
        "Name this day": "سمِّ هذا اليوم",
        "Same for all": "نفس العدد للكل",
        "You have an unfinished workout. Finish it to save your sets.": "لديك حصة لم تكتمل. أنهِها لحفظ مجموعاتك.",
        "Account deleted": "تم حذف الحساب",
        "Back up & sync": "النسخ الاحتياطي والمزامنة",
        "Connecting…": "جارٍ الاتصال…",
        "Continue with Google": "المتابعة باستخدام Google",
        "Delete my account": "حذف حسابي",
        "Delete your account?": "حذف حسابك؟",
        "No internet connection. Try again when online.": "لا يوجد اتصال بالإنترنت. حاول مرة أخرى عند الاتصال.",
        "Privacy policy": "سياسة الخصوصية",
        "Sign in to keep your workouts safe in the cloud and use them on any phone.": "سجّل الدخول لحفظ حصصك في السحابة واستخدامها على أي جوال.",
        "Sign out": "تسجيل الخروج",
        "Sign out?": "تسجيل الخروج؟",
        "Sign-in failed. Please try again.": "فشل تسجيل الدخول. حاول مرة أخرى.",
        "Signed out": "تم تسجيل الخروج",
        "Signing in…": "جارٍ تسجيل الدخول…",
        "Syncing…": "جارٍ المزامنة…",
        "This deletes your cloud backup and your account. The workouts on this phone stay.": "سيُحذف حسابك ونسختك السحابية. تبقى الحصص المحفوظة على هذا الجوال.",
        "Sign-in isn't available on this site yet.": "تسجيل الدخول غير متاح على هذا الموقع حاليًا.",
        "Your workouts stay on this phone. Sign in again anytime to sync.": "تبقى حصصك على هذا الجوال. سجّل الدخول مجددًا في أي وقت للمزامنة.",
        "Old:": "القديم:",
        "Overwrites current schedule": "يستبدل الجدول الحالي",
        "PULL": "سحب",
        "PUSH": "دفع",
        "Poor": "ضعيف",
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
        "Select at least one option!": "اختر خياراً واحداً على الأقل!",
        "Select exactly what you want to extract from this backup file.": "اختر ما تريد استعادته من ملف النسخة الاحتياطية.",
        "Select exactly what you want to include in this backup file.": "اختر ما تريد حفظه في ملف النسخة الاحتياطية.",
        "Sets": "المجموعات",
        "Skip": "تخطي",
        "Sleep": "النوم",
        "Soreness": "ألم العضلات",
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
        "Very": "كثيرًا",
        "WEEK {n}": "الأسبوع {n}",
        "Week {n}": "الأسبوع {n}",
        "Week 1": "الأسبوع 1",
        "Week Active": "الأسبوع النشط",
        "Week starts on {d}": "يبدأ الأسبوع يوم {d}",
        "Well recovered. Go for your targets.": "استشفاء ممتاز. انطلق نحو أهدافك.",
        "Workload Tracking": "حجم التمرين",
        "Workout": "الحصة",
        "Workout Routine": "جدول التمارين",
        "Yes, Do it": "نعم، تابِع",
        "{n} exercises added": "تمت إضافة {n} تمارين",
        "{n} exercises found": "{n} تمارين",
        "Start": "ابدأ",
        "History": "السجل",
        "How do you feel?": "كيف تشعر اليوم؟",
        "New record": "رقم قياسي جديد",
        "{name} saved · {n} sets": "تم حفظ {name} · {n} مجموعات",
        "Close": "إغلاق",
        "How to do it (YouTube)": "طريقة الأداء (يوتيوب)",
        "Week of {range}": "أسبوع {range}",
        "{a} of {b} workouts done": "أنجزت {a} من {b} حصص",
        "Reps per set": "التكرار لكل مجموعة",
        "Seconds per set": "الثواني لكل مجموعة",
        "{w} kg for {r} reps": "{w} كجم × {r} تكرار",
        "{w} kg for {r} sec": "{w} كجم × {r} ثانية",
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
        "Finish the workout or discard it with ✕ to leave.": "أنهِ الحصة أو تجاهلها بزر ✕ للخروج.",
        "Type the KG and reps you did. The set turns green by itself.": "اكتب الوزن والتكرار الذي أديته. تصبح المجموعة خضراء تلقائيًا.",
        "Type the KG and reps you did: the set turns green by itself. RPE (optional): 10 = no reps left, 9 = 1 left, 8 = 2 left.": "اكتب الوزن والتكرار الذي أديته: تصبح المجموعة خضراء تلقائيًا. RPE (اختياري): 10 = لا تكرارات متبقية، 9 = تكرار واحد، 8 = تكراران.",
        "A code has 8 letters and numbers, like ABCD-EFGH.": "الرمز مكوّن من 8 أحرف وأرقام، مثل ABCD-EFGH.",
        "Account": "الحساب",
        "Add a routine by code": "أضف جدولًا برمز",
        "Add to my routines": "أضف إلى جداولي",
        "App": "التطبيق",
        "Back to the default routine. History is kept.": "العودة إلى الجدول الافتراضي. يبقى سجلك محفوظًا.",
        "Choose what goes in the file. Save it, send it to a friend, or give it to an AI assistant to review your training.": "اختر ما يحتويه الملف. احفظه أو أرسله لصديق أو أعطه لمساعد ذكاء اصطناعي ليراجع تمرينك.",
        "Code copied": "تم نسخ الرمز",
        "Contact us": "تواصل معنا",
        "Copied": "تم النسخ",
        "Copy as text": "نسخ كنص",
        "Copy the text to paste into an AI chat.": "انسخ النص لتلصقه في محادثة ذكاء اصطناعي.",
        "Copy code": "نسخ الرمز",
        "Could not copy. Use Save or share file.": "تعذّر النسخ. استخدم حفظ أو مشاركة الملف.",
        "Could not copy. Use Share instead.": "تعذّر النسخ. استخدم المشاركة بدلًا من ذلك.",
        "Creating code…": "جارٍ إنشاء الرمز…",
        "Days a week": "أيام في الأسبوع",
        "Deletes your cloud data and your account": "يحذف بياناتك السحابية وحسابك",
        "Experience": "الخبرة",
        "Export data": "تصدير البيانات",
        "Find routine": "ابحث عن الجدول",
        "Use another code": "استخدم رمزًا آخر",
        "Routine found": "تم العثور على الجدول",
        "Finish your workout first.": "أنهِ حصتك أولًا.",
        "From an Apex Lift file": "من ملف Apex Lift",
        "Give this code to a friend. They open Apex Lift → Profile → Add a routine by code.": "أعطِ هذا الرمز لصديقك ليفتح Apex Lift ← حسابي ← أضف جدولًا برمز.",
        "Go back to an earlier copy": "ارجع إلى نسخة سابقة",
        "Goal": "الهدف",
        "Help & legal": "المساعدة والشروط",
        "How hard each set felt": "مدى صعوبة كل مجموعة",
        "Import data": "استيراد البيانات",
        "Save or share a copy": "احفظ أو شارك نسخة",
        "Last export: today": "آخر تصدير: اليوم",
        "Last export: {n} days ago": "آخر تصدير: قبل {n} أيام",
        "Looking for the routine…": "جارٍ البحث عن الجدول…",
        "Member since {date}": "عضو منذ {date}",
        "My training": "تمريني",
        "No routine found for this code. Check it and try again.": "لا يوجد جدول بهذا الرمز. تأكد منه وحاول مرة أخرى.",
        "Only the routine is shared. Your workouts and details stay private.": "تتم مشاركة الجدول فقط، وتبقى حصصك وبياناتك خاصة.",
        "Paste a code a friend gave you": "الصق رمزًا أعطاك إياه صديق",
        "Records": "الأرقام القياسية",
        "Reset routines": "إعادة ضبط الجداول",
        "Routine added and set as active": "تمت إضافة الجدول وتفعيله",
        "Routines & data": "الجداول والبيانات",
        "Same as phone": "مثل الجوال",
        "Save or share file": "حفظ أو مشاركة الملف",
        "Share": "مشاركة",
        "Share routine": "مشاركة الجدول",
        "Routine options": "خيارات الجدول",
        "Use this routine": "استخدم هذا الجدول",
        "Sign in to use routine codes.": "سجّل الدخول لاستخدام رموز الجداول.",
        "Something went wrong. Please try again.": "حدث خطأ. حاول مرة أخرى.",
        "Try my \"{name}\" routine in Apex Lift. Code: {code}": "جرّب جدولي \"{name}\" في Apex Lift. الرمز: {code}",
        "Type or paste the code a friend gave you.": "اكتب أو الصق الرمز الذي أعطاك إياه صديقك.",
        "Used to suggest programs and sets.": "يُستخدم لاقتراح البرامج وعدد المجموعات.",
        "Where you train": "مكان التمرين",
        "You have 5 routines, the maximum. Delete one in Plan first.": "لديك 5 جداول وهو الحد الأقصى. احذف واحدًا من الخطة أولًا.",
        "{a} workout days · {b} exercises": "{a} أيام تمرين · {b} تمارين",
        "3 to 5 years": "من 3 إلى 5 سنوات",
        "Back to sign in": "العودة لتسجيل الدخول",
        "Confirm password": "تأكيد كلمة المرور",
        "New password": "كلمة المرور الجديدة",
        "Both passwords match": "كلمتا المرور متطابقتان",
        "Passwords don't match.": "كلمتا المرور غير متطابقتين.",
        "Please confirm your password.": "يرجى تأكيد كلمة المرور.",
        "Choose a new password": "اختر كلمة مرور جديدة",
        "Pick a strong password for your account.": "اختر كلمة مرور قوية لحسابك.",
        "Save password": "حفظ كلمة المرور",
        "Password changed. Sign in with your new password.": "تم تغيير كلمة المرور. سجّل الدخول بكلمة المرور الجديدة.",
        "Password changed. You're signed in.": "تم تغيير كلمة المرور، وتم تسجيل دخولك.",
        "Password changed.": "تم تغيير كلمة المرور.",
        "This link has expired or was already used. Ask for a new one below.": "انتهت صلاحية هذا الرابط أو تم استخدامه من قبل. اطلب رابطًا جديدًا بالأسفل.",
        "This link has expired or was already used.": "انتهت صلاحية هذا الرابط أو تم استخدامه من قبل.",
        "Email confirmed": "تم تأكيد البريد",
        "Thanks! Your email is confirmed.": "شكرًا! تم تأكيد بريدك الإلكتروني.",
        "Your email is confirmed. You can go back to Apex Lift, or sign in here.": "تم تأكيد بريدك الإلكتروني. يمكنك العودة إلى Apex Lift أو تسجيل الدخول هنا.",
        "Link not valid": "الرابط غير صالح",
        "Send a new link": "أرسل رابطًا جديدًا",
        "Open Apex Lift in your browser": "افتح Apex Lift في المتصفح",
        "You're inside another app, which signs you out when it closes. Tap ••• or the share button, then Open in Safari.": "أنت داخل تطبيق آخر، وهو يسجّل خروجك عند إغلاقه. اضغط ••• أو زر المشاركة ثم اختر الفتح في Safari.",
        "You're inside another app, which signs you out when it closes. Open Apex Lift in Chrome to stay signed in.": "أنت داخل تطبيق آخر، وهو يسجّل خروجك عند إغلاقه. افتح Apex Lift في Chrome لتبقى مسجّلًا.",
        "Open in Chrome": "الفتح في Chrome",
        "Copy link": "نسخ الرابط",
        "Link copied": "تم نسخ الرابط",
        "Backing up your data…": "جارٍ نسخ بياناتك احتياطيًا…",
        "Before import": "قبل الاستيراد",
        "Confirm your password": "أكّد كلمة المرور",
        "Continue with email": "المتابعة بالبريد الإلكتروني",
        "Backup failed, so nothing was imported. Check your connection.": "فشل النسخ الاحتياطي، لذلك لم يتم الاستيراد. تحقق من اتصالك.",
        "Create account": "إنشاء الحساب",
        "Create an account": "أنشئ حسابًا",
        "Create your account": "أنشئ حسابك",
        "Email": "البريد الإلكتروني",
        "Email or password is wrong.": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
        "Email sent. Check your inbox.": "تم الإرسال. تحقق من بريدك.",
        "Email sign-in isn't available yet. Use Google for now.": "تسجيل الدخول بالبريد غير متاح حاليًا. استخدم Google.",
        "Enter your email and we'll send you a reset link.": "أدخل بريدك وسنرسل لك رابط إعادة التعيين.",
        "Extra sets on the first three lifts": "مجموعات إضافية في أول ثلاثة تمارين",
        "Enter your password to delete your account.": "أدخل كلمة المرور لحذف حسابك.",
        "Forgot password?": "نسيت كلمة المرور؟",
        "Have an account?": "لديك حساب؟",
        "I'm just starting": "مبتدئ تمامًا",
        "If an account exists, we've sent a reset link. Check your inbox.": "إذا كان هناك حساب بهذا البريد فقد أرسلنا رابط إعادة التعيين. تحقق من بريدك.",
        "Import": "استيراد",
        "Import this file?": "استيراد هذا الملف؟",
        "Imported. Your old data is in Account backups.": "تم الاستيراد. بياناتك السابقة في نسخ الحساب الاحتياطية.",
        "More than 5 years": "أكثر من 5 سنوات",
        "Never trained, or back after a long break": "لم أتمرن من قبل، أو عائد بعد انقطاع طويل",
        "New here?": "جديد هنا؟",
        "Your routines, workouts and settings in one file.": "جداولك وحصصك وإعداداتك في ملف واحد.",
        "Password": "كلمة المرور",
        "Confirm your email. Check your inbox.": "أكّد بريدك الإلكتروني. تحقق من رسائلك.",
        "Please enter a valid email.": "أدخل بريدًا إلكترونيًا صحيحًا.",
        "Please enter your name.": "أدخل اسمك.",
        "Please enter your password.": "أدخل كلمة المرور.",
        "Program & data": "البرنامج والبيانات",
        "Reset your password": "إعادة تعيين كلمة المرور",
        "Saved": "تم الحفظ",
        "Send again": "أعد الإرسال",
        "Send link": "إرسال الرابط",
        "Share the link, or your friend can enter the code in Plan → My routines.": "شارك الرابط، أو يدخل صديقك الرمز من الخطة ← جداولي.",
        "Show password": "إظهار كلمة المرور",
        "Sign in": "تسجيل الدخول",
        "Sign in to import. We back up your data first.": "سجّل الدخول للاستيراد. نحفظ نسخة من بياناتك أولًا.",
        "Sign in with email": "تسجيل الدخول بالبريد",
        "This account is turned off. Contact us.": "هذا الحساب موقوف. تواصل معنا.",
        "This can't be changed.": "لا يمكن تغيير هذا.",
        "This email already has an account. Sign in instead.": "لهذا البريد حساب بالفعل. سجّل الدخول بدلًا من ذلك.",
        "Too many tries. Wait a few minutes and try again.": "محاولات كثيرة. انتظر بضع دقائق وحاول مرة أخرى.",
        "Your name": "اسمك",
        "Routines and settings will be replaced and workouts added. We back up your current data first.": "ستُستبدل الجداول والإعدادات وتُضاف الحصص. نحفظ نسخة من بياناتك الحالية أولًا.",
        "Your workouts are saved to your account and kept in sync on all your phones.": "تُحفظ حصصك في حسابك وتتزامن على كل أجهزتك.",
        "{n} exercises with history": "{n} تمارين لها سجل",
        "At least 8 characters": "8 أحرف على الأقل",
        "One capital letter (A–Z)": "حرف كبير واحد على الأقل (A–Z)",
        "One symbol, like ! @ # $ %": "رمز واحد على الأقل، مثل ! @ # $ %",
        "Your password needs at least 8 characters, a capital letter and a symbol.": "كلمة المرور يجب أن تكون 8 أحرف على الأقل وفيها حرف كبير ورمز.",
        "Use your email and a strong password.": "استخدم بريدك وكلمة مرور قوية.",
        "Before you continue": "قبل المتابعة",
        "Review the Terms of Use and Privacy Policy to continue.": "راجع شروط الاستخدام وسياسة الخصوصية للمتابعة.",
        "I agree, continue": "أوافق، متابعة",
        "90+ min": "+90 دقيقة",
        "90+ minutes": "+90 دقيقة",
        "{n} min": "{n} دقيقة",
        "{n} minutes": "{n} دقيقة",
        "Age": "العمر",
        "Age, sex and height are set during setup. Contact us to correct them.": "العمر والجنس والطول تُحدَّد أثناء الإعداد. تواصل معنا لتصحيحها.",
        "Born {date}": "مواليد {date}",
        "Check your date of birth.": "تحقق من تاريخ ميلادك.",
        "Date of birth": "تاريخ الميلاد",
        "Date of birth, sex and height can't be changed after setup.": "لا يمكن تغيير تاريخ الميلاد والجنس والطول بعد الإعداد.",
        "Enter your date of birth.": "أدخل تاريخ ميلادك.",
        "Enter your height in cm (100–250).": "أدخل طولك بالسنتيمتر (100–250).",
        "Enter your weight in kg (25–350).": "أدخل وزنك بالكيلوغرام (25–350).",
        "Equipment": "المعدات",
        "Height": "الطول",
        "Height and weight": "الطول والوزن",
        "How long is each workout?": "كم مدة التمرين الواحد؟",
        "Just starting": "مبتدئ",
        "Locked": "مقفل",
        "Other": "أخرى",
        "Profile updated": "تم تحديث ملفك",
        "This has to match the birth year on your profile ({y}).": "يجب أن يطابق سنة الميلاد في ملفك ({y}).",
        "Updated {date}": "آخر تحديث {date}",
        "Weight": "الوزن",
        "What's your sex?": "ما جنسك؟",
        "When were you born?": "متى وُلدت؟",
        "Workout length": "مدة التمرين",
        "You can change any day or exercise later in Plan.": "يمكنك تغيير أي يوم أو تمرين لاحقًا من الخطة.",
        "Your profile": "ملفك الشخصي",
        "Your training": "تمرينك",
        "Active routine": "الجدول الحالي",
        "Add another ready-made program": "أضف برنامجًا جاهزًا آخر",
        "Browse programs": "تصفح البرامج",
        "Email not confirmed": "البريد غير مؤكَّد",
        "Helps pick the right program for you.": "يساعد في اختيار البرنامج المناسب لك.",
        "Name": "الاسم",
        "Personal details": "البيانات الشخصية",
        "Send confirmation email": "أرسل رسالة التأكيد",
        "Shorter workouts get fewer exercises a day.": "التمارين الأقصر فيها تمارين أقل في اليوم.",
        "Signed in with": "تسجيل الدخول عبر",
        "Starts your body weight chart and BMI in Progress.": "يبدأ به مخطط وزنك ومؤشر كتلة الجسم في التقدّم.",
        "Offline": "غير متصل",
        "Sync problem": "مشكلة في المزامنة",
        "Synced {time}": "تمت المزامنة {time}",
        "Your program is built from these answers. Tap one to change it.": "برنامجك مبني على هذه الإجابات. اضغط على أي منها لتغييرها.",
        "Get a matching program?": "هل تريد برنامجًا يناسب إجاباتك؟",
        "Get program": "احصل على البرنامج",
        "{name} fits your answers. You have 5 routines, so it replaces the current one. Your history is kept.": "{name} يناسب إجاباتك. لديك 5 جداول، لذلك سيحل محل الجدول الحالي. يبقى سجلك محفوظًا.",
        "{name} fits your answers. It is added to your routines; your current one stays.": "{name} يناسب إجاباتك. سيُضاف إلى جداولك ويبقى الحالي كما هو.",
    };
    // Arabic counts follow Arabic grammar: 1 مجموعة واحدة, 2 مجموعتان, 3–10 مجموعات, 11+ مجموعة
    // [one, two, 3–10, 11 and up]; the table word after "{n}" picks the row
    const AR_COUNT = {
        'مجموعات': ['مجموعة واحدة', 'مجموعتان', 'مجموعات', 'مجموعة'], 'مجموعة': ['مجموعة واحدة', 'مجموعتان', 'مجموعات', 'مجموعة'],
        'تمارين': ['تمرين واحد', 'تمرينان', 'تمارين', 'تمرينًا'], 'تمرين': ['تمرين واحد', 'تمرينان', 'تمارين', 'تمرينًا'],
        'حصص': ['حصة واحدة', 'حصتان', 'حصص', 'حصة'], 'أيام': ['يوم واحد', 'يومان', 'أيام', 'يومًا'], 'يوم': ['يوم واحد', 'يومان', 'أيام', 'يومًا'],
        'جداول': ['جدول واحد', 'جدولان', 'جداول', 'جدولًا'], 'دقيقة': ['دقيقة واحدة', 'دقيقتان', 'دقائق', 'دقيقة'],
        'تكرار': ['تكرار واحد', 'تكراران', 'تكرارات', 'تكرارًا'], 'تكرارات': ['تكرار واحد', 'تكراران', 'تكرارات', 'تكرارًا'],
        'ثانية': ['ثانية واحدة', 'ثانيتان', 'ثوانٍ', 'ثانية'], 'سنوات': ['سنة واحدة', 'سنتان', 'سنوات', 'سنة']
    };
    const arCount = (n, word) => {
        const f = AR_COUNT[word], v = Number(String(n).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
        if (!f) return `${n} ${word}`;
        if (!Number.isInteger(v)) return `${n} ${f[2]}`; // a range like 6–8
        return v === 1 ? f[0] : v === 2 ? f[1] : v >= 3 && v <= 10 ? `${n} ${f[2]}` : `${n} ${f[3]}`;
    };
    const t = (en, vars) => {
        let out = (isAR && Object.prototype.hasOwnProperty.call(AR, en) && AR[en]) || en;
        if (vars && isAR) out = out.replace(/\{(\w+)\} ([\u0600-\u06FF]+)/g, (m, k, w) => vars[k] !== undefined && AR_COUNT[w] ? arCount(vars[k], w) : m);
        if (vars) out = out.replace(/\{(\w+)\}/g, (m, k) => vars[k] !== undefined ? vars[k] : m);
        // after قبل / من / خلال / بعد the dual takes its other form: قبل يومين, من مجموعتين
        if (isAR) out = out.replace(/(قبل|من|خلال|بعد|لمدة) ([\u0600-\u06FF]+)(تان|ان)(?=\s|$|[.،:)])/g, (m, p, w, e) => `${p} ${w}${e === 'تان' ? 'تين' : 'ين'}`);
        return out;
    };
    const MUSCLE_AR = { 'Abductors':'المُبعِدات','Abs':'البطن','Adductors':'المُقرِّبات','Back':'الظهر','Biceps':'ذات الرأسين','Calves':'السمانة','Chest':'الصدر','Forearms':'الساعد','Front Delts':'الدالية الأمامية','Glutes':'الألوية','Hamstrings':'أوتار الركبة','Lats':'الظهرية العريضة','Lower Back':'أسفل الظهر','Lower Chest':'أسفل الصدر','Neck':'الرقبة','Quads':'رباعية الرؤوس','Rear Delts':'الدالية الخلفية','Shoulders':'الأكتاف','Side Delts':'الدالية الجانبية','Traps':'شبه المنحرفة','Triceps':'ثلاثية الرؤوس','Upper Chest':'أعلى الصدر','Abs & Core':'البطن والجذع','Muscle':'العضلة' };
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
        'Glutes & Hamstrings': ['Glutes & Hams', 'ألوية وأوتار'], 'Shoulders & Arms': ['Shldr & Arms', 'أكتاف وذراعين'],
        'Lower Body & Abs': ['Lower & Abs', 'سفلي وبطن'], 'Push & Bi': ['Push & Bi', 'دفع وذات الرأسين'], 'Pull & TRI': ['Pull & TRI', 'سحب وثلاثية'], 'Complete Rest': ['Rest', 'راحة'], 'Active Rest': ['Active', 'راحة نشطة']
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
    const { muscleOptions, exerciseDictionary, exerciseAR, WORKOUTS, PROGRAMS } = window.APEX_LIB;
    // exercise name to show: Arabic in Arabic (your own exercises keep the name you gave them)
    const tx = n => (isAR && exerciseAR && Object.prototype.hasOwnProperty.call(exerciseAR, n) && exerciseAR[n]) || n || '';
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

    // Rest timer choices in seconds (Profile → Rest Timer)
    const REST_CHOICES = [45, 60, 90, 120, 150, 180, 240, 300];
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
        getRestSeconds: () => { const v = parseInt(localStorage.getItem(StorageManager.REST_KEY)); return REST_CHOICES.includes(v) ? v : 90; },
        setRestSeconds: v => { if (REST_CHOICES.includes(parseInt(v))) { localStorage.setItem(StorageManager.REST_KEY, String(parseInt(v))); cloudTouch(StorageManager.REST_KEY); } },
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
    const TERMS_VERSION = '2026-10.10';
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
    const APP_VERSION = '65';
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
                <div class="flex items-center gap-2 min-w-0"><i data-lucide="message-circle" class="w-4 h-4 text-[#d4af37] shrink-0"></i><span class="text-[12px] font-bold text-white truncate">${t('Message from your coach')}</span></div>
                <button onclick="window.appActions.dismissCoach()" class="text-slate-400 hover:text-white p-2 bg-white/5 rounded-lg tap-feedback shrink-0" aria-label="${esc(t('Dismiss'))}"><i data-lucide="x" class="w-4 h-4"></i></button>
            </div>
            ${c.routine ? `<div class="text-[12px] font-bold text-[#d4af37] mt-2">${esc(t('New routine from your coach: {name}', { name: c.routine }))}</div>` : ''}
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
    
window.appState = { currentView: 'today', sortableInstance: null, awTimer: null };    let loggedWeights = StorageManager.get();    let loggedReps = StorageManager.getReps();

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
    // exp (training experience): 'none' = just starting: one set less on every exercise (at least 2),
    // 'new' = under a year: one set less on accessories, 'mid' = 1–3 years: as written,
    // 'adv' = 3–5 years: one set more on the first two lifts of each day (never more than 4),
    // 'pro' = over 5 years: one set more on the first three lifts (never more than 5)
    const EXP_LEVELS = ['none', 'new', 'mid', 'adv', 'pro'];
    const PROFILE_KEY = 'workoutProfile_rakan_final';
    // Training answers from the setup. Each one changes the program: goal, days a week, experience, equipment
    // and workout length (minutes: shorter workouts get fewer exercises a day)
    const SESSION_OPTS = ['30', '45', '60', '90'];
    const sanitizeProfile = raw => {
        const p = isObj(raw) ? raw : {}, out = {};
        ['goal', 'days', 'exp', 'eq', 'session'].forEach(k => { if (typeof p[k] === 'string' && p[k] && p[k].length <= 20) out[k] = p[k]; });
        return out;
    };
    // Where a new user came from: the link they opened (?ref=instagram or utm_source=...), or "friend" for a routine-code
    // link. Read once, on the first visit, and kept on this phone until it goes up with the account.
    const REF_KEY = 'workoutRef_rakan_final';
    try {
        const q = new URLSearchParams(location.search), ref = (q.get('ref') || q.get('utm_source') || (q.get('r') ? 'friend' : '')).toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 30);
        if (ref && !localStorage.getItem(REF_KEY)) localStorage.setItem(REF_KEY, ref);
        if (q.has('ref') || q.has('utm_source')) { ['ref', 'utm_source', 'utm_medium', 'utm_campaign'].forEach(k => q.delete(k)); history.replaceState(history.state, '', location.pathname + (q.toString() ? '?' + q : '') + location.hash); }
    } catch (e) {}
    const getProfile = () => sanitizeProfile(readJSON(PROFILE_KEY, {}));
    const PROFILE_STEPS = ['sex', 'birth', 'body'], TRAINING_STEPS = ['goal', 'exp', 'days', 'session', 'eq'];
    // is this setup question answered already?
    const setupAnswered = (k, b = getBody(), pr = getProfile()) => ({
        sex: !!b.sex, birth: !!b.birthDate, body: !!(b.heightCm && b.weightKg),
        goal: !!pr.goal, exp: EXP_LEVELS.includes(pr.exp), days: !!pr.days, session: SESSION_OPTS.includes(pr.session), eq: !!pr.eq
    })[k];
    // the questions still to answer (asked once on the next visit after an update)
    const setupMissing = () => { const b = getBody(), pr = getProfile(); return [...PROFILE_STEPS, ...TRAINING_STEPS].filter(k => !setupAnswered(k, b, pr)); };
    // Your profile (set in the setup): date of birth, sex, height, body weight + a log of body weight over time.
    // After the setup (locked) date of birth, sex and height can't be changed; body weight can.
    const BODY_KEY = 'workoutBody_rakan_final';
    const MIN_AGE = 13;
    const thisYear = () => new Date().getFullYear();
    const sanitizeBody = raw => {
        const b = isObj(raw) ? raw : {}, out = {};
        const y = parseInt(latinDigits(b.birthYear)); if (y >= thisYear() - 100 && y <= thisYear() - 5) out.birthYear = y;
        const bd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(b.birthDate || ''));
        if (bd && +bd[1] >= thisYear() - 100 && +bd[1] <= thisYear() - 5 && +bd[2] >= 1 && +bd[2] <= 12 && +bd[3] >= 1 && +bd[3] <= 31) { out.birthDate = bd[0]; out.birthYear = +bd[1]; }
        if (['male', 'female', 'na'].includes(b.sex)) out.sex = b.sex;
        const h = parseFloat(latinDigits(b.heightCm)); if (h >= 100 && h <= 250) out.heightCm = Math.round(h);
        const w = parseFloat(latinDigits(b.weightKg)); if (w >= 25 && w <= 350) out.weightKg = Math.round(w * 10) / 10;
        if (Array.isArray(b.log)) out.log = b.log.filter(x => isObj(x) && typeof x.t === 'number' && isFinite(x.t) && parseFloat(x.kg) >= 25 && parseFloat(x.kg) <= 350)
            .map(x => ({ t: x.t, kg: Math.round(parseFloat(x.kg) * 10) / 10 })).sort((a, c) => a.t - c.t).slice(-200);
        if (b.locked === true) out.locked = true;
        return out;
    };
    const getBody = () => sanitizeBody(readJSON(BODY_KEY, {}));
    const setBody = b => writeItem(BODY_KEY, JSON.stringify(sanitizeBody(b)));
    // age in whole years (from the date of birth, or the birth year for older accounts)
    const ageOf = b => {
        if (b.birthDate) { const [y, m, d] = b.birthDate.split('-').map(Number), n = new Date(); return n.getFullYear() - y - ((n.getMonth() + 1 < m || (n.getMonth() + 1 === m && n.getDate() < d)) ? 1 : 0); }
        return b.birthYear ? thisYear() - b.birthYear : null;
    };
    const LOCKED_ABOUT = ['birthYear', 'birthDate', 'heightCm', 'sex'];
    // session (workout length in minutes): 30 → at most 4 exercises a day, 45 → 5, 60 or more → the whole day
    const SESSION_CAP = { 30: 4, 45: 5 };
    const programSchedule = (prog, exp, session = getProfile().session) => {
        const start = DAY_NAMES.indexOf(StorageManager.getStartDay()), cap = SESSION_CAP[session] || 99;
        return prog.week.map((slot, i) => {
            const base = { id: i + 1, day: DAY_NAMES[(start + i) % 7], savedTitle: '' };
            if (slot === 'R') return { ...base, title: 'Complete Rest', isRest: true, recoveryType: 'complete', exercises: [] };
            if (slot === 'A') return { ...base, title: 'Active Rest', isRest: true, recoveryType: 'active', exercises: [] };
            const [title, list] = WORKOUTS[slot];
            return { ...base, title, savedTitle: title, isRest: false, recoveryType: null, exercises: list.slice(0, cap).map(([name, muscle, sets, reps], j) => {
                let n = parseInt(sets);
                if (exp === 'none') n = Math.max(2, n - 1);
                if (exp === 'new' && j >= 2) n = Math.max(2, n - 1);
                if (exp === 'adv' && j < 2) n = Math.max(n, Math.min(4, n + 1));
                if (exp === 'pro' && j < 3) n = Math.max(n, Math.min(5, n + 1));
                return { muscle, name, sets: String(n), reps };
            }) };
        });
    };
    // Which program fits the answers best
    const recommendProgram = a => {
        if (a.eq === 'db') return 'db3';
        const d = parseInt(a.days) || 4;
        // just starting: simple programs, at most 4 days, so the body can get used to training
        if (a.exp === 'none') return a.goal === 'strength' ? 's5x5' : d <= 3 ? 'fb3' : 'ul4';
        // women training 4 days for muscle or fat loss: the glutes and legs program
        if (a.sex === 'female' && d === 4 && (a.goal === 'muscle' || a.goal === 'fat')) return 'glutes4';
        // over 5 years: programs with more volume
        if (a.exp === 'pro') {
            if (a.goal === 'strength') return d <= 3 ? 's5x5' : 'phul';
            if (a.goal === 'muscle' && d >= 6) return 'arnold6';
        }
        if (a.goal === 'strength') return d <= 3 ? 's5x5' : 'phul';
        if (a.goal === 'fat') return d <= 3 ? 'fb3' : d === 4 ? 'ul4' : d === 5 ? 'hybrid5' : 'ppl6';
        if (d <= 3) return a.exp === 'new' ? 'fb3' : 'ppl3';
        return d === 4 ? 'ul4' : d === 5 ? 'hybrid5' : 'ppl6';
    };
    // Put a routine into the app: as a new routine (keeps your current one) or replacing the current one (always when there are 5)
    const putRoutine = (name, schedule, { replace = false, undo = false, targetId = null } = {}) => {
        const snap = { weeks: JSON.stringify(appData.weeks), weekId: currentWeekId, day: activeDay }, target = targetId && appData.weeks.find(x => x.id === targetId);
        if (target) { target.schedule = schedule; target.name = name; currentWeekId = target.id; StorageManager.setActiveWeek(target.id); }
        else if (replace || appData.weeks.length >= 5) { const w = appData.weeks.find(x => x.id === currentWeekId); w.schedule = schedule; w.name = name; }
        else { const wid = 'w_' + Date.now(); appData.weeks.push({ id: wid, name, schedule }); currentWeekId = wid; StorageManager.setActiveWeek(wid); }
        StorageManager.setPlan(appData);
        activeDay = getTodayId();
        window.appActions.switchTab('today');
        window.appActions.showToast(t('{name} is ready', { name }), 'success', undo ? { label: t('Undo'), fn: () => {
            appData.weeks = JSON.parse(snap.weeks); currentWeekId = snap.weekId; activeDay = snap.day;
            StorageManager.setPlan(appData); StorageManager.setActiveWeek(currentWeekId); window.appActions.switchTab('plan');
        } } : null);
    };
    // Short week preview: "Sat Push · Sun Pull · ..."
    const programPreviewHTML = prog => {
        const start = DAY_NAMES.indexOf(StorageManager.getStartDay());
        return `<div class="grid grid-cols-7 gap-1 mt-3">${prog.week.map((slot, i) => {
            const rest = slot === 'R' || slot === 'A';
            return `<div class="rounded-lg py-1.5 px-0.5 text-center ${rest ? 'bg-white/5 text-slate-400' : 'bg-[#d4af37]/15 text-[#d4af37]'}"><div class="text-[12px] font-bold">${esc(dayShort(DAY_NAMES[(start + i) % 7]))}</div><div class="pv-wo mt-0.5">${rest ? '—' : esc(t(WORKOUTS[slot][0]))}</div></div>`;
        }).join('')}</div>`;
    };

    // One day of a program preview: rest, or the workout with its exercises, sets and reps
    const programDayCardHTML = d => d.isRest
            ? `<div class="glass-card ex-card flex items-center gap-3 opacity-70"><i data-lucide="${d.recoveryType === 'active' ? 'footprints' : 'moon'}" class="w-5 h-5 text-slate-400 shrink-0"></i><span class="text-[12px] font-bold text-slate-400 w-10 shrink-0">${esc(dayShort(d.day))}</span><span class="text-[14px] font-black text-slate-300">${t(d.recoveryType === 'active' ? 'Active Rest' : 'Complete Rest')}</span></div>`
            : `<div class="glass-card ex-card">
                <div class="flex items-baseline justify-between gap-2 mb-2"><span class="min-w-0"><span class="block text-[12px] font-bold text-[#d4af37]">${esc(dayLong(d.day))}</span><span class="block text-[17px] font-black text-white leading-tight">${esc(t(d.title))}</span></span><span class="text-[12px] font-bold text-slate-400 shrink-0">${t('{n} exercises', { n: d.exercises.length })}</span></div>
                ${d.exercises.map((ex, k) => `<div class="flex items-center gap-3 py-2 ${k ? 'border-t border-white/5' : ''}"><span class="w-6 text-center text-[12px] font-bold text-slate-400 shrink-0">${k + 1}</span><span class="flex-1 min-w-0"><span class="ex-name block text-[14px] font-black text-white truncate">${esc(tx(ex.name))}</span><span class="block text-[12px] font-bold text-slate-400 truncate">${esc(tm(ex.muscle))}</span></span><span class="ex-pill" dir="ltr">${esc(ex.sets)} × ${esc(fmtReps(ex.reps))}</span></div>`).join('')}
            </div>`;

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

    // 👇 SWIPE DOWN to close a bottom sheet (from its top, or when its list is scrolled to the top).
    // Sideways swipes (the muscle chips row) never move the sheet.
    const enableSwipeDown = (box, onClose) => {
        if (!box) return;
        let x0 = 0, y0 = null, dy = 0, t0 = 0, scroller = null, down = false;
        box.addEventListener('touchstart', e => {
            if (e.target.closest('input, select, textarea, .scrollbar-hide, .overflow-x-auto')) { y0 = null; return; }
            scroller = e.target.closest('.sheet-scroll, #picker-list, #history-modal-content');
            if (scroller && scroller.scrollTop > 0) { y0 = null; return; }
            x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; dy = 0; t0 = Date.now(); down = false;
        }, { passive: true });
        box.addEventListener('touchmove', e => {
            if (y0 === null) return;
            dy = e.touches[0].clientY - y0;
            const dx = e.touches[0].clientX - x0;
            if (!down) { if (Math.abs(dx) > 8 && Math.abs(dx) >= Math.abs(dy)) { y0 = null; dy = 0; return; } if (dy > 8) down = true; }
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

    // 👈 SWIPE left / right on Today to go to the next / previous day (the layout is the same in Arabic, so the swipe is too)
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
        // each routine: its name (tap to rename) and one ⋮ button with Use / Share / Duplicate / Delete
        const mItem = 'w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-start text-[13px] font-extrabold tap-feedback';
        const rMenu = w => window.appState.routineMenu !== w.id ? '' : `<div class="absolute end-2 top-full mt-1 z-[61] w-[220px] p-1.5 rounded-2xl bg-[#111] border border-white/15 shadow-[0_20px_40px_rgba(0,0,0,0.7)]" role="menu">
                <button onclick="window.appState.routineMenu=null;window.appActions.editRoutineName(${jsArg(w.id)})" class="${mItem} text-white" role="menuitem"><i data-lucide="pencil" class="w-4 h-4 text-slate-400"></i>${t('Rename routine')}</button>
                <button onclick="window.appState.routineMenu=null;window.appActions.shareWeek(${jsArg(w.id)})" class="${mItem} text-slate-200" role="menuitem"><i data-lucide="share-2" class="w-4 h-4 text-[#d4af37]"></i>${t('Share routine')}</button>
                <button onclick="window.appState.routineMenu=null;window.appActions.duplicateWeek(${jsArg(w.id)})" class="${mItem} text-slate-200" role="menuitem"><i data-lucide="copy" class="w-4 h-4 text-slate-400"></i>${t('Duplicate routine')}</button>
                ${appData.weeks.length > 1 ? `<button onclick="window.appState.routineMenu=null;window.appActions.deleteWeek(${jsArg(w.id)})" class="${mItem} text-red-400" role="menuitem"><i data-lucide="trash-2" class="w-4 h-4"></i>${t('Delete routine')}</button>` : ''}
            </div>`;
        const row = w => { const on = window.appState.routineMenu === w.id, cur = w.id === currentWeekId; return `<div class="relative ${on ? 'z-20' : ''} flex items-center gap-1 bg-black/40 pe-1 rounded-xl border ${cur?'border-[#d4af37]/50 shadow-[0_0_10px_rgba(212,175,55,0.1)]':'border-white/5'} transition-all"><button onclick="window.appActions.switchWeek(${jsArg(w.id)})" class="flex-1 min-w-0 min-h-[52px] ps-3 flex items-center gap-3 text-start tap-feedback" aria-pressed="${cur}"><span class="flex-1 min-w-0 text-white text-[13px] font-bold truncate">${esc(t(w.name))}</span>${cur?`<span class="text-[#22c55e] text-[12px] font-bold shrink-0">${t('Active')}</span>`:''}</button><button onclick="window.appActions.toggleRoutineMenu(${jsArg(w.id)})" class="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg tap-feedback ${on ? 'text-[#d4af37]' : 'text-slate-300'}" aria-haspopup="menu" aria-expanded="${on}" aria-label="${esc(t('Routine options') + ' · ' + w.name)}"><i data-lucide="ellipsis-vertical" class="w-[18px] h-[18px]"></i></button>${rMenu(w)}</div>`; };
        document.getElementById('weeks-container').innerHTML = inDay ? '' : `<div class="glass-card ${open ? 'border border-[#d4af37]/30' : ''} ${window.appState.routineMenu != null ? 'relative z-30' : ''}">
            <button onclick="window.appActions.toggleRoutines()" class="w-full p-4 flex items-center gap-3 text-start tap-feedback" aria-expanded="${open}">
                <span class="w-10 h-10 rounded-full bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center shrink-0"><i data-lucide="calendar-range" class="w-5 h-5"></i></span>
                <span class="flex-1 min-w-0"><span class="block text-[12px] font-bold text-slate-400">${t('My routines')}</span><span class="block text-[15px] font-black text-white truncate">${esc(t(active.name))}</span></span>
                <span class="shrink-0 text-[12px] font-bold text-slate-400" dir="ltr">${appData.weeks.length}</span>
                <i data-lucide="chevron-down" class="w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}"></i>
            </button>
            ${open ? `<div class="px-4 pb-4 space-y-2.5">${appData.weeks.map(row).join('')}
                <button onclick="window.appActions.addWeek()" class="w-full py-3 flex items-center justify-center gap-2 text-[#d4af37] font-bold text-[12px] tap-feedback border border-dashed border-[#d4af37]/40 bg-[#d4af37]/5 rounded-xl"><i data-lucide="plus" class="w-4 h-4 shrink-0"></i>${t('New routine')}</button>
            </div>` : ''}
        </div>`;
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
    // Muscle groups shared by the Edit tab (muscle balance) and the Progress tab (Volume), so both always agree.
    // [group, muscles in it, fewest sets a week before it shows "Low"]
    const BALANCE = [['Chest', ['Chest', 'Upper Chest', 'Lower Chest'], 8], ['Back', ['Back', 'Lats', 'Traps', 'Lower Back'], 8], ['Legs', ['Quads', 'Hamstrings', 'Glutes', 'Calves', 'Adductors', 'Abductors'], 8], ['Shoulders', ['Shoulders', 'Front Delts', 'Side Delts', 'Rear Delts'], 6], ['Arms', ['Biceps', 'Triceps', 'Forearms'], 6], ['Core', ['Abs'], 3]];
    const groupOf = muscle => { const g = BALANCE.find(([, ms]) => ms.includes((muscle || '').trim())); return g ? g[0] : null; };
    const DAY_MS = 86400000;
    const round1 = x => Math.round(x * 10) / 10;
    const fmtKg = v => v >= 10000 ? `${(v / 1000).toFixed(1)}K` : Math.round(v).toLocaleString('en-US');
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
    // Streak: weeks in a row with at least one workout (this week counts once you've trained)
    const weekStreak = dayKeys => {
        const wkD = getWeekStart(), weekAgo = n => new Date(wkD.getFullYear(), wkD.getMonth(), wkD.getDate() - 7 * n).getTime();
        let streak = 0, n = dayKeys.some(d => d >= wkD.getTime()) ? 0 : 1;
        while (dayKeys.some(d => d >= weekAgo(n) && d < weekAgo(n - 1))) { streak++; n++; }
        return streak;
    };
    // Estimated 1-rep max of one set (Epley); only sets of 12 reps or fewer are close enough to count
    const e1rmOf = x => x.w > 0 && x.r > 0 && x.r <= 12 ? x.w * (1 + x.r / 30) : 0;
    // One point per training day for an exercise: heaviest weight, most reps/seconds and best estimated 1-rep max
    const exerciseSessions = hA => {
        const byDay = {};
        (hA || []).forEach(l => { const t0 = logTime(l); if (isNaN(t0)) return; const d = startOfDay(t0); (byDay[d] = byDay[d] || []).push(...logSetDetails(l)); });
        return Object.keys(byDay).map(Number).sort((a, b) => a - b).map(d => {
            const sets = byDay[d], topW = Math.max(0, ...sets.map(x => x.w));
            return { t: d, w: topW, r: Math.max(0, ...sets.map(x => x.r)), e1: Math.max(0, ...sets.map(e1rmOf)), sets };
        }).filter(x => x.sets.length);
    };
    // Personal records: a session that beats every session before it.
    // With weight: heavier ('w'), or else a higher estimated 1-rep max ('e1', e.g. more reps with a heavy weight).
    // Without weight: more reps, or a longer hold for timed exercises ('r').
    const recordsOf = hA => {
        const timed = (hA || []).some(l => l.u === 's'), out = [];
        let bw = 0, be = 0, br = 0;
        exerciseSessions(hA).forEach(s => {
            const e1 = timed ? 0 : s.e1;
            if (s.w > 0) {
                if (bw > 0 && s.w > bw) out.push({ t: s.t, type: 'w', v: s.w, plus: round1(s.w - bw), unit: 'kg' });
                else if (be > 0 && Math.round(e1 - be) >= 1) out.push({ t: s.t, type: 'e1', v: Math.round(e1), plus: Math.round(e1 - be), unit: 'kg' });
            } else if (!bw && br > 0 && s.r > br) out.push({ t: s.t, type: 'r', v: s.r, plus: s.r - br, unit: timed ? 's' : '' });
            bw = Math.max(bw, s.w); be = Math.max(be, e1); br = Math.max(br, s.r);
        });
        return out;
    };
    const RECORD_LABEL = { w: 'Heaviest weight', e1: 'Stronger (est. 1-rep max)', r: 'Most reps' };
    // Up / same / down: your latest session against the one 3 sessions earlier (or the first, if fewer)
    const trendOf = ses => {
        if (ses.length < 2) return null;
        const weighted = ses.some(s => s.w > 0), val = s => weighted ? (s.e1 || s.w) : s.r;
        const a = val(ses[Math.max(0, ses.length - 4)]), b = val(ses[ses.length - 1]);
        return b > a ? 'up' : b < a ? 'down' : 'same';
    };
    const TREND = {
        up:   { i: 'trending-up',   c: 'text-[#22c55e]',  l: 'Improving' },
        same: { i: 'minus',         c: 'text-slate-400',  l: 'Holding steady' },
        down: { i: 'trending-down', c: 'text-orange-400', l: 'Dropping' }
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
        for (let v = lo; v <= hi + 1e-9; v += step) grid += `<line x1="${pl}" x2="${W - pr}" y1="${y(v)}" y2="${y(v)}" stroke="#262626" stroke-width="1"/><text x="${pl - 6}" y="${y(v) + 3}" text-anchor="end" font-size="12" fill="#94a3b8" font-weight="600">${Math.round(v * 10) / 10}</text>`;
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
                <text x="${x(pts.length - 1) + 7}" y="${y(last.v) + 3}" font-size="14" fill="#e2e8f0" font-weight="700" font-family="Barlow Condensed, Inter, sans-serif">${last.v}${esc(unit)}</text>
                <text x="${pl}" y="${H - 6}" font-size="12" fill="#94a3b8" font-weight="600">${esc(fmtDayMonth(new Date(pts[0].t)))}</text>
                <text x="${W - pr}" y="${H - 6}" text-anchor="end" font-size="12" fill="#94a3b8" font-weight="600">${esc(fmtDayMonth(new Date(last.t)))}</text>
                <line class="chart-cross" x1="0" x2="0" y1="${pt}" y2="${H - pb}" stroke="#94a3b8" stroke-width="1" visibility="hidden"/>
                <circle class="chart-hot" r="6" fill="#d4af37" stroke="#111111" stroke-width="2" visibility="hidden"/>
            </svg>
            <div class="chart-tip hidden absolute -top-2 px-2 py-1 rounded-lg bg-black border border-white/15 text-[12px] font-bold text-white whitespace-nowrap pointer-events-none"></div>
        </div>`;
    };
    // Weekly bar chart (inline SVG): one gold bar per week, this week full gold, older weeks softer.
    // Only this week's value is written on the chart; tap a bar to see its week and value.
    const barChartHTML = bars => {
        const W = 320, H = 130, pl = 6, pr = 6, pt = 18, pb = 20, slot = (W - pl - pr) / bars.length, bw = Math.min(26, slot - 8);
        const hi = Math.max(1, ...bars.map(b => b.v)), y = v => pt + (H - pt - pb) * (1 - v / hi);
        let marks = '';
        bars.forEach((b, i) => {
            const cx = pl + slot * (i + 0.5), top = y(b.v), h = H - pb - top, last = i === bars.length - 1;
            const rr = Math.min(4, h); // 4px rounded top, flat on the baseline
            if (b.v > 0) marks += `<path d="M${cx - bw / 2},${H - pb} V${top + rr} q0,-${rr} ${rr},-${rr} h${bw - 2 * rr} q${rr},0 ${rr},${rr} V${H - pb} Z" fill="#d4af37" fill-opacity="${last ? 1 : 0.45}"/>`;
            if (last) marks += `<text x="${cx}" y="${top - 5}" text-anchor="middle" font-size="14" fill="#e2e8f0" font-weight="700" font-family="Barlow Condensed, Inter, sans-serif">${b.v}</text>`;
            if (i === 0 || last) marks += `<text x="${i === 0 && !last ? pl : last ? W - pr : cx}" y="${H - 5}" text-anchor="${i === 0 && !last ? 'start' : 'end'}" font-size="12" fill="#94a3b8" font-weight="600">${esc(b.label)}</text>`;
        });
        const data = esc(JSON.stringify(bars.map((b, i) => ({ x: pl + slot * (i + 0.5), y: y(b.v), v: b.v, d: b.tip }))));
        return `<div class="chart-wrap relative select-none" data-pts="${data}" data-unit="${esc(' ' + t('sets'))}" dir="ltr">
            <svg viewBox="0 0 ${W} ${H}" class="w-full h-auto block touch-none" role="img" aria-label="${esc(t('Sets per week'))}">
                <line x1="${pl}" x2="${W - pr}" y1="${H - pb}" y2="${H - pb}" stroke="#262626" stroke-width="1"/>
                ${marks}
                <line class="chart-cross" x1="0" x2="0" y1="${pt}" y2="${H - pb}" stroke="#94a3b8" stroke-width="1" visibility="hidden"/>
                <circle class="chart-hot" r="0" visibility="hidden"/>
            </svg>
            <div class="chart-tip hidden absolute -top-2 px-2 py-1 rounded-lg bg-black border border-white/15 text-[12px] font-bold text-white whitespace-nowrap pointer-events-none"></div>
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
        const e1rm = weighted && !timed ? Math.max(0, ...all.map(e1rmOf)) : 0;
        const tile = (v, l) => `<div class="bg-white/5 rounded-xl py-2.5 text-center"><div class="text-[17px] font-black text-white" dir="ltr">${v}</div><div class="text-[12px] font-bold text-slate-400">${l}</div></div>`;
        const unit = weighted ? 'kg' : timed ? 's' : '';
        const pts = ses.slice(-12).map(s => ({ t: s.t, v: weighted ? s.w : s.r }));
        return `<div class="grid grid-cols-3 gap-2 mb-3">${tile(`${best}${unit}`, weighted ? t('Best weight') : timed ? t('Best time') : t('Best reps'))}${tile(e1rm ? `${Math.round(e1rm)}kg` : '—', t('Est. 1-rep max'))}${tile(ses.length, t('Sessions'))}</div>`
            + (pts.length >= 2 ? `<div class="bg-white/5 rounded-2xl p-3 mb-4"><div class="text-[12px] font-bold text-slate-400 mb-2">${weighted ? t('Heaviest weight per session') : timed ? t('Longest set per session') : t('Most reps per session')}</div>${lineChartHTML(pts, unit)}</div>` : '');
    };

    // Shared pieces of the Progress tab
    const pCard = (title, body, extra = '') => `<div class="glass-card p-4 mb-3 ${extra}">${title ? `<div class="text-[13px] font-bold text-white mb-3">${title}</div>` : ''}${body}</div>`;
    const pEmpty = (icon, title, text, extra = '') => `<div class="glass-card p-8 text-center"><div class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4"><i data-lucide="${icon}" class="w-6 h-6 text-[#d4af37]"></i></div><div class="text-[15px] font-black text-white mb-2">${title}</div><p class="text-[12px] text-slate-400 font-bold leading-relaxed">${text}</p>${extra}</div>`;
    // "+12% vs last week" under a number (green up, orange down)
    const changeHTML = (now, before) => {
        if (!(before > 0)) return `<div class="text-[12px] font-bold text-slate-400 mt-1.5">${t('No data last week')}</div>`;
        const pct = Math.round((now - before) / before * 100), c = pct > 0 ? TREND.up : pct < 0 ? TREND.down : TREND.same;
        return `<div class="flex flex-wrap items-center gap-x-1 text-[12px] font-bold mt-1.5 ${c.c}"><i data-lucide="${c.i}" class="w-3.5 h-3.5 shrink-0"></i><span dir="ltr">${pct > 0 ? '+' : ''}${pct}%</span><span class="text-slate-400 font-bold">${t('vs last week')}</span></div>`;
    };

    // Overview: this week against the same days last week, 8 weeks of sets, the 5-week calendar, recent records
    const progressOverviewHTML = history => {
        const days = workoutDays(history), dayKeys = Object.keys(days).map(Number);
        if (!dayKeys.length) return pEmpty('calendar-check', t('No workouts yet'), t('Finish your first workout to see your progress here.'), `<button onclick="window.appActions.switchTab('today')" class="mt-5 h-12 px-5 rounded-2xl bg-[#d4af37] text-black text-[14px] font-extrabold tap-feedback inline-flex items-center gap-2"><i data-lucide="play" class="w-4 h-4 fill-current"></i>${t("Go to today's workout")}</button>`);
        const wkD = getWeekStart(), wk = wkD.getTime(), today = startOfDay(Date.now());
        const weekAgo = n => new Date(wkD.getFullYear(), wkD.getMonth(), wkD.getDate() - 7 * n).getTime();
        // last week only up to the same weekday as today, so a Tuesday is never compared with a whole week
        const nowD = new Date(today), sameDayLastWeek = new Date(nowD.getFullYear(), nowD.getMonth(), nowD.getDate() - 7).getTime();
        const sum = (from, to, f) => dayKeys.filter(d => d >= from && d <= to).reduce((a, d) => a + f(days[d]), 0);
        const inWeek = dayKeys.filter(d => d >= wk);
        const setsNow = sum(wk, today, x => x.sets), setsBefore = sum(weekAgo(1), sameDayLastWeek, x => x.sets);
        const volNow = sum(wk, today, x => x.volume), volBefore = sum(weekAgo(1), sameDayLastWeek, x => x.volume);
        const plannedDays = getActiveSchedule().filter(d => !d.isRest && (d.exercises || []).length).length;
        const streak = weekStreak(dayKeys);
        const tile = (icon, label, value, sub) => `<div class="glass-card p-4 min-w-0"><div class="flex items-center gap-1.5 text-[12px] font-bold text-slate-400 mb-1.5"><i data-lucide="${icon}" class="w-4 h-4 text-[#d4af37] shrink-0"></i><span class="truncate">${label}</span></div><div class="text-[26px] font-black text-white leading-none num" dir="ltr">${value}</div>${sub}</div>`;
        const plain = s => `<div class="text-[12px] font-bold text-slate-400 mt-1.5 truncate">${s}</div>`;
        let html = `<div class="text-[12px] font-bold text-slate-400 mb-2 px-1">${t('This week')}</div>
            <div class="grid grid-cols-2 gap-2.5 mb-3">
                ${tile('calendar-check', t('Workouts'), plannedDays ? `${inWeek.length}<span class="text-[15px] text-slate-400"> / ${plannedDays}</span>` : inWeek.length, plain(plannedDays ? t('{n} planned', { n: plannedDays }) : '&nbsp;'))}
                ${tile('flame', t('Week streak'), streak, plain(t('Weeks in a row')))}
                ${tile('layers', t('Sets'), setsNow, changeHTML(setsNow, setsBefore))}
                ${tile('weight', t('kg lifted'), fmtKg(volNow), changeHTML(volNow, volBefore))}
            </div>
            <p class="text-[12px] font-bold text-slate-400 mb-4 px-1">${t('Compared with the same days last week.')}</p>`;
        // 8 weeks of sets
        const bars = [];
        for (let i = 7; i >= 0; i--) {
            const from = weekAgo(i), to = weekAgo(i - 1) - 1, v = sum(from, to, x => x.sets);
            bars.push({ v, label: i ? fmtDayMonth(new Date(from)) : t('This week'), tip: i ? t('Week of {d}', { d: fmtDayMonth(new Date(from)) }) : t('This week') });
        }
        html += pCard(t('Sets per week'), `${barChartHTML(bars)}<p class="text-[12px] font-bold text-slate-400 mt-2">${t('Tap a bar to see that week.')}</p>`);
        // calendar: 5 weeks, gold = trained (darker = more sets)
        const start = weekAgo(4), startIdx = DAY_NAMES.indexOf(StorageManager.getStartDay());
        let cells = '';
        for (let i = 0; i < 35; i++) {
            const d = startOfDay(start + i * DAY_MS + 3600000), info = days[d], future = d > today;
            const lvl = info ? (info.sets >= 20 ? 1 : info.sets >= 10 ? 0.7 : 0.4) : 0;
            const label = `${fmtDate(d, false)} · ${info ? t('{n} sets', { n: info.sets }) : t('Rest')}`;
            cells += `<button onclick="document.getElementById('cal-info').textContent=${esc(JSON.stringify(label))}" class="aspect-square rounded-lg tap-feedback ${d === today ? 'ring-2 ring-white/70' : ''} ${future ? 'opacity-30' : ''}" style="background:${info ? `rgba(212,175,55,${lvl})` : 'rgba(128,128,128,0.14)'}" aria-label="${esc(label)}" title="${esc(label)}"></button>`;
        }
        html += pCard(t('Last 5 weeks'), `<div class="grid grid-cols-7 gap-1.5 mb-1.5">${DAY_NAMES.map((_, i) => `<div class="text-center text-[12px] font-bold text-slate-400 truncate">${esc(dayShort(DAY_NAMES[(startIdx + i) % 7]))}</div>`).join('')}</div>
            <div class="grid grid-cols-7 gap-1.5" dir="ltr">${cells}</div>
            <div id="cal-info" class="text-[12px] font-bold text-slate-400 mt-3 min-h-[16px]">${t('Tap a day for details.')}</div>`);
        // recent records
        const map = exerciseNameMap(), recs = [];
        Object.keys(history).forEach(k => recordsOf(history[k]).forEach(r => recs.push({ ...r, k })));
        recs.sort((a, b) => b.t - a.t);
        const recent = recs.filter(r => r.t >= today - 30 * DAY_MS).slice(0, 6);
        html += pCard(`🏆 ${t('Records (last 30 days)')}`, recent.length ? recent.map(r => `<button onclick="window.appActions.openHistoryModal(${jsArg(r.k)},${jsArg(nameOfKey(r.k, map))})" class="w-full flex items-center justify-between gap-2 py-2.5 border-b border-white/5 last:border-0 text-start tap-feedback">
                <span class="min-w-0"><span class="ex-name block text-[14px] font-black text-white truncate">${esc(tx(nameOfKey(r.k, map)))}</span><span class="block text-[12px] font-bold text-slate-400 truncate">${esc(r.type === 'r' && r.unit === 's' ? t('Longest hold') : t(RECORD_LABEL[r.type]))} · ${esc(fmtDate(r.t, false))}</span></span>
                <span class="text-[14px] font-black text-[#22c55e] shrink-0" dir="ltr">${r.v}${r.unit} <span class="text-[12px]">(+${r.plus})</span></span></button>`).join('')
            : `<p class="text-[12px] font-bold text-slate-400">${t('No new records yet. Add weight when the app says so and they will come.')}</p>`);
        return html;
    };

    // Exercises: search, filter chips, and one row per exercise with its trend and what to do next time
    const PEX_FILTERS = [['all', 'All'], ['up', 'Ready to add weight'], ...BALANCE.map(([g]) => [g, g])];
    const progressExerciseRows = history => {
        const map = exerciseNameMap(), plan = {};
        getActiveSchedule().forEach(d => (d.exercises || []).forEach(ex => { const k = getExKey('', '', '', ex.name); if (!plan[k]) plan[k] = ex; }));
        return Object.keys(history).map(k => {
            const ses = exerciseSessions(history[k]); if (!ses.length) return null;
            const last = ses[ses.length - 1], weighted = ses.some(s => s.w > 0), timed = (history[k] || []).some(l => l.u === 's');
            const muscle = (map[k] || {}).muscle || (plan[k] || {}).muscle || '';
            // next time: the same rule as the workout cards, from your latest session (today included)
            const sg = plan[k] ? suggestionFor(history[k], plan[k], false, false) : null;
            return { k, name: nameOfKey(k, map), muscle, group: groupOf(muscle), last: last.t, n: ses.length, trend: trendOf(ses), sg, timed,
                best: weighted ? `${Math.max(...ses.map(s => s.w))}kg` : `${Math.max(...ses.map(s => s.r))}${timed ? 's' : ''}` };
        }).filter(Boolean).sort((a, b) => b.last - a.last);
    };
    const progressExerciseListHTML = rows => {
        const q = (window.appState.pexQ || '').trim().toLowerCase(), f = window.appState.pexF || 'all';
        const shown = rows.filter(r => (!q || r.name.toLowerCase().includes(q) || tx(r.name).includes(q) || tm(r.muscle).toLowerCase().includes(q))
            && (f === 'all' || (f === 'up' ? r.sg && r.sg.type === 'up' : r.group === f)));
        if (!shown.length) return `<div class="glass-card p-6 text-center text-[13px] font-bold text-slate-400">${t('No exercises match.')}</div>`;
        return `<div class="text-[12px] font-bold text-slate-400 mb-2 px-1">${t('{n} exercises', { n: shown.length })}</div>` + shown.map(r => {
            const tr = r.trend && TREND[r.trend];
            return `<button onclick="window.appActions.openHistoryModal(${jsArg(r.k)},${jsArg(r.name)})" class="w-full glass-card p-4 mb-2.5 flex items-center gap-3 text-start tap-feedback">
                <span class="flex-1 min-w-0">
                    <span class="ex-name block text-[15px] font-black text-white leading-tight">${esc(tx(r.name))}</span>
                    <span class="block text-[12px] font-bold text-slate-400 mt-0.5">${esc(tm(r.muscle))}${r.muscle ? ' · ' : ''}${t('{n} sessions', { n: r.n })} · ${esc(fmtDate(r.last, false))}</span>
                    ${r.sg ? `<span class="block mt-2">${suggestionChip(r.sg, r.timed)}</span>` : ''}
                </span>
                <span class="text-end shrink-0">
                    <span class="block text-[12px] font-bold text-slate-400">${t('Best')}</span>
                    <span class="block text-[15px] font-black text-white" dir="ltr">${esc(r.best)}</span>
                    ${tr ? `<span class="flex items-center justify-end gap-1 text-[12px] font-bold mt-0.5 ${tr.c}"><i data-lucide="${tr.i}" class="w-3.5 h-3.5"></i>${t(tr.l)}</span>` : ''}
                </span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-600 shrink-0"></i></button>`;
        }).join('');
    };
    const progressExercisesHTML = history => {
        const rows = progressExerciseRows(history);
        if (!rows.length) return pEmpty('dumbbell', t('No exercises yet'), t('Finish your first workout to see your progress here.'));
        const f = window.appState.pexF || 'all';
        const chip = ([id, label]) => `<button onclick="window.appActions.progressFilter(${jsArg(id)})" class="shrink-0 inline-flex items-center gap-1.5 h-10 px-3.5 rounded-full text-[13px] font-bold tap-feedback border ${f === id ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'bg-white/5 text-slate-300 border-white/10'}">${id === 'up' ? '<i data-lucide="arrow-up-circle" class="w-3.5 h-3.5"></i>' : ''}${esc(t(label))}</button>`;
        return `<div class="relative mb-3">
                <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute start-4 top-1/2 -translate-y-1/2 pointer-events-none"></i>
                <input id="pex-search" type="search" autocomplete="off" value="${esc(window.appState.pexQ || '')}" placeholder="${esc(t('Search exercises'))}" oninput="window.appActions.progressSearch(this.value)" class="w-full bg-white/5 border border-white/10 rounded-2xl ps-11 pe-4 py-3.5 text-[14px] font-bold text-white outline-none focus:border-[#d4af37]">
            </div>
            <div id="pex-chips" class="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-3 -mx-1 px-1">${PEX_FILTERS.map(chip).join('')}</div>
            <div id="pex-list">${progressExerciseListHTML(rows)}</div>`;
    };

    // Volume: sets logged this week per muscle group against the sets in your plan (same groups as the Edit tab)
    const progressVolumeHTML = history => {
        const map = exerciseNameMap(), wk = getWeekStart().getTime(), g = {};
        BALANCE.forEach(([name, , low]) => { g[name] = { done: 0, plan: 0, low }; });
        getActiveSchedule().forEach(d => { if (!d.isRest) (d.exercises || []).forEach(ex => { const gr = groupOf(ex.muscle); if (gr) g[gr].plan += parseInt(ex.sets) || 0; }); });
        Object.keys(history).forEach(k => {
            const gr = groupOf((map[k] || {}).muscle); if (!gr) return;
            (history[k] || []).forEach(l => { const t0 = logTime(l); if (!isNaN(t0) && t0 >= wk) g[gr].done += logSetDetails(l).length; });
        });
        if (!BALANCE.some(([n]) => g[n].plan || g[n].done)) return pEmpty('layers', t('No Volume Detected'), t('Build a routine with exercises to see your weekly workload goals.'));
        const rows = BALANCE.map(([n]) => {
            const x = g[n], pct = x.plan ? Math.min(100, Math.round(x.done / x.plan * 100)) : (x.done ? 100 : 0), full = x.plan && x.done >= x.plan, low = x.plan < x.low;
            const status = full ? [t('Done'), 'text-[#22c55e] bg-[#22c55e]/10'] : low ? [t('Low in plan'), 'text-orange-400 bg-orange-400/10'] : null;
            return `<div class="py-3 border-b border-white/5 last:border-0">
                <div class="flex items-center justify-between gap-2 mb-2">
                    <span class="text-[14px] font-black text-white">${esc(t(n))}</span>
                    <span class="flex items-center gap-2 shrink-0"><span class="text-[13px] font-bold text-white" dir="ltr">${x.done} / ${x.plan}</span>${status ? `<span class="text-[12px] font-bold px-2 py-1 rounded-md ${status[1]}">${status[0]}</span>` : ''}</span>
                </div>
                <div class="h-2 rounded-full bg-white/10 overflow-hidden" dir="ltr"><div class="bar-fill h-full rounded-full ${full ? 'bg-[#22c55e]' : 'bg-[#d4af37]'}" style="width:${pct}%"></div></div>
            </div>`;
        }).join('');
        return pCard(t('Sets this week'), `<div class="flex justify-between text-[12px] font-bold text-slate-400 -mt-2 mb-1"><span>${t('Muscle')}</span><span>${t('Done / planned')}</span></div>${rows}<p class="text-[12px] font-bold text-slate-400 mt-3">${t('Aim for about 10–20 sets a week for each muscle.')} ${t('"Low in plan" means your routine has few sets for it: add some in the Plan tab.')}</p>`);
    };

    // Body: body weight over time (the same log as Profile → Your profile); log today's weight here too
    const progressBodyHTML = () => {
        const b = getBody(), log = b.log || [];
        const form = `<div class="flex gap-2 mt-4"><input id="pb-weight" type="text" inputmode="decimal" autocomplete="off" placeholder="${esc(t('Weight (kg)'))}" class="flex-1 min-w-0 bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white text-center font-black outline-none focus:border-[#d4af37]" dir="ltr" onkeydown="if(event.key==='Enter')window.appActions.progressLogWeight()"><button onclick="window.appActions.progressLogWeight()" class="shrink-0 px-5 rounded-2xl bg-[#d4af37] text-black text-[13px] font-extrabold tap-feedback">${t('Save')}</button></div>`;
        if (!log.length) return pEmpty('scale', t('Track your body weight'), t('Log your weight once a week, at the same time of day, to see how it changes.'), form);
        const last = log[log.length - 1], monthAgo = Date.now() - 30 * DAY_MS;
        const base = [...log].reverse().find(x => x.t <= monthAgo) || log[0], diff = round1(last.kg - base.kg);
        const loggedToday = dateKey(last.t) === dateKey();
        let html = `<div class="glass-card p-5 mb-3">
            <div class="flex items-end justify-between gap-3">
                <div><div class="text-[12px] font-bold text-slate-400 mb-1">${t('Body weight')}</div><div class="text-[34px] font-black text-white leading-none num" dir="ltr">${last.kg}<span class="text-[16px] text-slate-400"> kg</span></div><div class="text-[12px] font-bold text-slate-400 mt-1.5">${esc(fmtDate(last.t, false))}${b.heightCm ? ` · BMI <span class="num text-[14px] text-slate-200" dir="ltr">${round1(last.kg / Math.pow(b.heightCm / 100, 2))}</span>` : ''}</div></div>
                ${log.length >= 2 ? `<div class="text-end"><div class="text-[18px] font-black num ${diff === 0 ? 'text-slate-300' : 'text-white'}" dir="ltr">${diff > 0 ? '+' : ''}${diff} kg</div><div class="text-[12px] font-bold text-slate-400">${base === log[0] && base.t > monthAgo ? t('since you started') : t('in 30 days')}</div></div>` : ''}
            </div>
            ${log.length >= 2 ? `<div class="mt-4">${lineChartHTML(log.slice(-20).map(x => ({ t: x.t, v: x.kg })), 'kg')}</div>` : ''}
            <div class="text-[12px] font-bold text-white mt-4">${loggedToday ? t("Update today's weight") : t("Log today's weight")}</div>
            ${form.replace('mt-4', 'mt-2')}
        </div>`;
        html += pCard(t('History'), [...log].reverse().slice(0, 8).map((x, i, arr) => {
            const prev = arr[i + 1], d = prev ? round1(x.kg - prev.kg) : null;
            return `<div class="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0"><span class="text-[13px] font-bold text-slate-300">${esc(fmtDate(x.t, false))}</span><span class="flex items-center gap-3" dir="ltr"><span class="text-[12px] font-bold text-slate-400">${d === null ? '' : `${d > 0 ? '+' : ''}${d}`}</span><span class="text-[14px] font-black text-white">${x.kg} kg</span></span></div>`;
        }).join(''));
        return html + `<p class="text-[12px] font-bold text-slate-400 px-1">${t('Also in Profile → Your profile.')}</p>`;
    };

    // Progress tab: four sections in one rounded switcher; the chosen one slides over and is remembered
    const PTAB_KEY = 'workoutProgressTab_rakan_final';
    const PTABS = [['overview', 'Overview', 'layout-dashboard'], ['exercises', 'Exercises', 'dumbbell'], ['volume', 'Volume', 'layers'], ['body', 'Body', 'scale']];
    const currentPTab = () => {
        if (!window.appState.aTab) { try { window.appState.aTab = localStorage.getItem(PTAB_KEY) || 'overview'; } catch (e) { window.appState.aTab = 'overview'; } }
        if (!PTABS.some(([id]) => id === window.appState.aTab)) window.appState.aTab = 'overview';
        return window.appState.aTab;
    };
    const renderAnalytics = () => {
        const history = StorageManager.getHistory();
        const c = document.getElementById('workout-container');
        const activeTab = currentPTab(), idx = PTABS.findIndex(([id]) => id === activeTab);
        const prev = window.appState.aTabShown, from = PTABS.findIndex(([id]) => id === prev);
        const seg = ([id, label, icon]) => `<button onclick="window.appActions.progressTab('${id}')" class="relative z-10 flex-1 min-w-0 flex flex-col items-center gap-1 py-2.5 rounded-[18px] tap-feedback transition-colors duration-300 ${activeTab === id ? 'text-black' : 'text-slate-400'}" aria-pressed="${activeTab === id}"><i data-lucide="${icon}" class="w-[18px] h-[18px]"></i><span class="text-[12px] font-bold truncate max-w-full px-0.5">${esc(t(label))}</span></button>`;
        const tabsHTML = `<div id="progress-tabs" class="p-seg relative flex mb-4" role="tablist"><span class="p-seg-pill" style="--i:${from >= 0 ? from : idx}"></span>${PTABS.map(seg).join('')}</div>`;
        const contentHTML = activeTab === 'exercises' ? progressExercisesHTML(history)
            : activeTab === 'volume' ? progressVolumeHTML(history)
            : activeTab === 'body' ? progressBodyHTML()
            : progressOverviewHTML(history);
        // a different section pops in; a refresh of the same section stays still
        c.innerHTML = `<div class="pb-10">${tabsHTML}<div class="${prev === activeTab ? '' : 'p-pop'}">${contentHTML}</div></div>`;
        window.appState.aTabShown = activeTab;
        const pill = c.querySelector('.p-seg-pill');
        if (pill && from !== idx) requestAnimationFrame(() => requestAnimationFrame(() => pill.style.setProperty('--i', idx)));
        bindCharts(c);
        if (typeof hint === 'function') hint('progress-tabs', '#progress-tabs', t('Your week, every exercise, sets per muscle and your body weight are here.'));
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
        return `<button onclick="window.appActions.toggleCheckIn()" class="ci-chip self-start inline-flex items-center gap-1.5 h-10 px-3 rounded-xl border text-[12px] font-bold tap-feedback" style="color:${c};border-color:${c}55;background:${c}14" aria-expanded="${open}"><i data-lucide="${L ? L.i : 'activity'}" class="w-3.5 h-3.5"></i>${L ? `${t(L.t)} <span class="text-slate-400">• ${r.score}/6</span>` : t('How do you feel?')}<i data-lucide="chevron-${open ? 'up' : 'down'}" class="w-3 h-3 opacity-70"></i></button>`;
    };
    // Daily check-in card (opened from the button in today's day card)
    const checkInHTML = () => {
        const r = getReadinessToday();
        if (r) {
            const R = READY[r.level], L = { c: R.c, t: t(R.t), i: R.i, d: t(R.d) };
            return `<div class="glass-card p-4 mb-4 flex items-center gap-3 border" style="border-color:${L.c}55">
                <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style="background:${L.c}1a;color:${L.c}"><i data-lucide="${L.i}" class="w-5 h-5"></i></div>
                <div class="flex-1 min-w-0">
                    <div class="text-[12px] font-bold" style="color:${L.c}">${L.t} <span class="text-slate-400">• ${r.score}/6</span></div>
                    <div class="text-[12px] font-bold text-slate-400 leading-snug mt-0.5">${L.d}</div>
                </div>
                <button onclick="window.appActions.resetCheckIn()" class="text-slate-400 hover:text-white p-2 bg-white/5 rounded-lg tap-feedback shrink-0" aria-label="${esc(t('Change check-in'))}"><i data-lucide="edit-2" class="w-4 h-4"></i></button>
            </div>`;
        }
        if (window.appState.ciSkipped === dateKey()) return '';
        const draft = window.appState.ciDraft || {};
        const row = (key, label, opts) => `<div class="flex items-center justify-between gap-2 mt-3">
            <span class="text-[12px] font-bold text-slate-400 w-[70px] shrink-0">${t(label)}</span>
            <div class="flex gap-1.5 flex-1">${opts.map((o, val) => `<button onclick="window.appActions.setCheckIn('${key}', ${val})" class="flex-1 py-2 rounded-lg text-[12px] font-extrabold tap-feedback border ${draft[key] === val ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'bg-black/40 text-slate-300 border-white/10'}">${t(o)}</button>`).join('')}</div>
        </div>`;
        return `<div class="glass-card p-4 mb-4 border border-[#d4af37]/30">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2"><i data-lucide="activity" class="w-4 h-4 text-[#d4af37]"></i><span class="text-[12px] font-bold text-white">${t('Daily Check-in')}</span></div>
                <button onclick="window.appActions.skipCheckIn()" class="text-[12px] font-bold text-slate-400 hover:text-white tap-feedback">${t('Skip')}</button>
            </div>
            <p class="text-[12px] font-bold text-slate-400 mt-1">${t("3 quick taps to adjust today's targets.")}</p>
            ${row('sleep', 'Sleep', ['Poor', 'OK', 'Great'])}
            ${row('soreness', 'Soreness', ['Very', 'A bit', 'Fresh'])}
            ${row('energy', 'Energy', ['Low', 'OK', 'High'])}
        </div>`;
    };

    // What to lift next: from your last session (easy day keeps the weight and aims low)
    // skipToday: the workout cards plan today from your last session before today; Progress uses the latest one
    const suggestionFor = (hA, ex, easy, skipToday = true) => {
        const prog = getProgression(getLastSession(hA, skipToday), ex.reps);
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
        return `<span class="inline-flex items-center gap-1 text-[12px] font-bold px-2 py-1 rounded-md border ${c.cls}"><i data-lucide="${c.icon}" class="w-3 h-3"></i>${t(c.label)} <span dir="ltr">${fmtW(sg.w)} × ${sg.r}${timed ? 's' : ''}</span></span>`;
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


    // 👤 PROFILE. Tapping your photo opens Account: your information (name and date of birth can change; sex and height
    // are set in the setup) and everything about the account (sign-in, backups, sign out, delete).
    const GOAL_LABEL = { muscle: 'Build muscle', strength: 'Get stronger', fat: 'Lose fat' };
    const EXP_LABEL = { none: 'Just starting', new: 'Less than 1 year', mid: '1 to 3 years', adv: '3 to 5 years', pro: 'More than 5 years' };
    const EQ_LABEL = { gym: 'Full gym', db: 'Dumbbells only' };
    const sessionLabel = v => v ? t(v === '90' ? '90+ min' : '{n} min', { n: v }) : '';
    const pfRow = (icon, label, value, sub = '', extra = '') => `<div class="pf-row"><span class="pf-ic"><i data-lucide="${icon}"></i></span><span class="pf-label">${label}${sub ? `<span class="pf-sub">${sub}</span>` : ''}</span><span class="pf-val">${value || '—'}</span>${extra}</div>`;
    const avatarHTML = (u, size) => {
        const name = u.displayName || u.name || '', photo = u.photoURL || u.photo || '';
        return photo ? `<img src="${esc(photo)}" alt="" referrerpolicy="no-referrer" class="${size} rounded-full object-cover shrink-0">`
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
                <button onclick="window.appActions.editName()" class="pf-row tap-feedback"><span class="pf-ic"><i data-lucide="user-round"></i></span><span class="pf-label">${t('Name')}</span><span class="pf-val truncate">${esc(u.displayName || '—')}</span><i data-lucide="pencil" class="pf-chev"></i></button>
                <button onclick="window.appActions.editBirth()" class="pf-row tap-feedback"><span class="pf-ic"><i data-lucide="cake"></i></span><span class="pf-label">${t('Age')}${born ? `<span class="pf-sub">${t('Born {date}', { date: esc(born) })}</span>` : ''}</span><span class="pf-val">${age !== null ? `<span class="num">${age}</span>` : '—'}</span><i data-lucide="pencil" class="pf-chev"></i></button>
                ${pfRow('users', t('Sex'), esc(sexL))}
                ${pfRow('ruler', t('Height'), b.heightCm ? `<span class="num" dir="ltr">${b.heightCm} cm</span>` : '')}
            </div>
            <div class="h-6"></div>
            <h3 class="pf-h">${t('Account')}</h3>
            <div class="pf-group mb-4">
                ${pfRow(google ? 'log-in' : 'mail', t('Signed in with'), google ? 'Google' : t('Email'), !google && !u.emailVerified ? `<span class="text-[#f87171]">${t('Email not confirmed')}</span>` : '')}
                ${!google && !u.emailVerified ? `<button onclick="window.appActions.resendVerify()" class="pf-row tap-feedback"><span class="pf-ic"><i data-lucide="mail-check"></i></span><span class="pf-label">${t('Send confirmation email')}</span><i data-lucide="chevron-right" class="pf-chev"></i></button>` : ''}
                <button onclick="window.appActions.openBackups()" class="pf-row tap-feedback"><span class="pf-ic"><i data-lucide="history"></i></span><span class="pf-label">${t('Account backups')}<span class="pf-sub">${t('Go back to an earlier copy')}</span></span><i data-lucide="chevron-right" class="pf-chev"></i></button>
                <button onclick="window.appActions.cloudSignOut()" class="pf-row tap-feedback"><span class="pf-ic"><i data-lucide="log-out"></i></span><span class="pf-label">${t('Sign out')}</span></button>
                <button onclick="window.appActions.cloudDelete()" class="pf-row is-danger tap-feedback"><span class="pf-ic"><i data-lucide="trash-2"></i></span><span class="pf-label">${t('Delete my account')}<span class="pf-sub">${t('Deletes your cloud data and your account')}</span></span></button>
            </div>`;
        if (window.lucide) window.lucide.createIcons({ root: el });
    };
    // Your training: goal, days, workout length and equipment can be changed here; a change offers a matching program
    const TRAINING_EDIT = {
        goal: ['Goal', () => [['muscle', t('Build muscle')], ['strength', t('Get stronger')], ['fat', t('Lose fat')]]],
        days: ['Days a week', () => ['3', '4', '5', '6'].map(d => [d, t('{n} days', { n: d })])],
        session: ['Workout length', () => SESSION_OPTS.map(m => [m, sessionLabel(m)])],
        eq: ['Equipment', () => [['gym', t('Full gym')], ['db', t('Dumbbells only')]]]
    };
    const renderTrainingSheet = () => {
        const el = document.getElementById('training-body'); if (!el) return;
        const pr = getProfile(), active = appData.weeks.find(w => w.id === currentWeekId) || appData.weeks[0];
        const value = { goal: t(GOAL_LABEL[pr.goal] || ''), days: pr.days ? t('{n} days', { n: pr.days }) : '', session: sessionLabel(pr.session), eq: t(EQ_LABEL[pr.eq] || '') };
        const icon = { goal: 'target', days: 'calendar-days', session: 'timer', eq: 'building-2' };
        el.innerHTML = `<p class="text-[13px] font-bold text-slate-400 mb-4">${t('Your program is built from these answers. Tap one to change it.')}</p>
            <div class="pf-group">${Object.keys(TRAINING_EDIT).map(k => `<button onclick="window.appActions.editTraining(${jsArg(k)})" class="pf-row tap-feedback"><span class="pf-ic"><i data-lucide="${icon[k]}"></i></span><span class="pf-label">${t(TRAINING_EDIT[k][0])}</span><span class="pf-val">${esc(value[k] || '—')}</span><i data-lucide="chevron-right" class="pf-chev"></i></button>`).join('')}</div>
            <div class="h-6"></div>
            <h3 class="pf-h">${t('Your program')}</h3>
            <div class="pf-group mb-4">
                ${pfRow('calendar-range', t('Active routine'), esc(t(active.name)))}
                <button onclick="window.appActions.closeTraining(); setTimeout(window.appActions.openPrograms, 320)" class="pf-row tap-feedback"><span class="pf-ic"><i data-lucide="layout-list"></i></span><span class="pf-label">${t('Browse programs')}<span class="pf-sub">${t('Add another ready-made program')}</span></span><i data-lucide="chevron-right" class="pf-chev"></i></button>
                <button onclick="window.appActions.closeTraining(); setTimeout(window.appActions.openAI, 320)" class="pf-row tap-feedback"><span class="pf-ic"><i data-lucide="sparkles"></i></span><span class="pf-label">${t('Apex Coach')}<span class="pf-sub">${t('Build a program that fits you')}</span></span><i data-lucide="chevron-right" class="pf-chev"></i></button>
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
    const editHead = title => `<div class="flex items-center justify-between mb-4"><h3 class="text-[18px] font-black text-white">${title}</h3><button onclick="window.appActions.closeEdit()" class="w-11 h-11 -me-2 rounded-full bg-white/5 text-slate-400 flex items-center justify-center tap-feedback" aria-label="${esc(t('Close'))}"><i data-lucide="x" class="w-5 h-5"></i></button></div>`;
    // the Your training row: a one-line summary
    const renderTrainingRow = () => {
        const el = document.getElementById('pf-training-sub'); if (!el) return;
        const pr = getProfile();
        el.textContent = [t(GOAL_LABEL[pr.goal] || ''), pr.days ? t('{n} days', { n: pr.days }) : '', sessionLabel(pr.session)].filter(Boolean).join(' · ');
    };
    const sheetOpen = id => document.getElementById(id).classList.contains('flex') && !document.getElementById(id).classList.contains('opacity-0');
    const renderProfile = () => {
        renderAccount(); renderTrainingRow(); updateBackupStatus();
        if (sheetOpen('account-overlay')) renderAccountSheet();
        if (sheetOpen('training-overlay')) renderTrainingSheet();
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
    // a long exercise name gets a smaller font (down to 12px) so it stays on one line without "…"
    const fitNames = root => requestAnimationFrame(() => (root ? root.querySelectorAll('.ex-fit') : []).forEach(el => {
        el.style.fontSize = ''; let size = parseFloat(getComputedStyle(el).fontSize) || 15;
        while (el.scrollWidth > el.clientWidth + 1 && size > 12) { size -= 0.5; el.style.fontSize = size + 'px'; }
        el.classList.toggle('truncate', el.scrollWidth > el.clientWidth + 1);
    }));
    window.addEventListener('resize', () => fitNames(document.getElementById('ex-sheet-content')));
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
    const todayEditBar = () => `<div class="plan-strip flex items-center gap-2.5 px-3.5 py-2.5 mb-2.5 rounded-2xl bg-white/5 border border-white/10">
            <i data-lucide="pencil-line" class="w-[18px] h-[18px] text-[#d4af37] shrink-0"></i>
            <span class="flex-1 min-w-0"><span class="block text-[12px] font-bold text-[#d4af37]">${t('Editing this day')}</span><button onclick="window.appActions.planWholeWeek()" class="block text-[12px] font-bold text-slate-300 underline underline-offset-2 tap-feedback">${t('Plan the whole week →')}</button></span>
            <button id="today-edit-done" onclick="window.appActions.setTodayEdit(false)" class="shrink-0 h-9 px-4 rounded-full bg-[#d4af37] text-black text-[12px] font-extrabold tap-feedback flex items-center gap-1.5"><i data-lucide="check" class="w-4 h-4"></i>${t('Done')}</button>
        </div>`;
    const renderToday = () => {
        const schedule = getActiveSchedule(), day = schedule.find(d => d.id === activeDay), history = StorageManager.getHistory();
        const isT = activeDay === getTodayId(), S = window.appState.sess;
        if (window.appState.todayEdit && S) window.appState.todayEdit = false; // never edit the plan while a workout is running
        if (window.appState.todayEdit) return renderPlanDay(todayEditBar());
        const editBtn = ''; // Today is for training: days and exercises are edited in Plan
        const weekTop = `<div id="today-week" class="today-week">${weekNavHTML()}</div>`;
        const dayLabel = `<div class="text-[12px] font-bold text-[#d4af37]">${esc(isT ? t('Today') : dayLong(day.day))}</div>`;
        let html = '';
        if (day.isRest) {
            html += `<div class="glass-card today-card">${weekTop}<div class="today-body is-row"><div class="flex-1 min-w-0">${dayLabel}<h2 class="text-[21px] font-black text-white leading-tight mt-0.5">${day.recoveryType==='active'?t('Active Rest'):t('Complete Rest')}</h2><div class="text-[12px] font-bold text-slate-400 mt-1">${t('Recover well. See you next session.')}</div></div><i data-lucide="${day.recoveryType==='active'?'footprints':'moon'}" class="w-9 h-9 text-[#d4af37] shrink-0 ${day.recoveryType==='active'?'animate-walk':'animate-pulse-glow'}"></i>${editBtn}</div></div>` + coachCardHTML();
            // Point to the next training day so a rest day is never a dead end
            const nextDay = [1, 2, 3, 4, 5, 6].map(o => schedule.find(d => d.id === ((activeDay - 1 + o) % 7) + 1)).find(d => d && !d.isRest && d.exercises.length);
            if (nextDay) html += `<button onclick="window.appActions.setActiveDay(${nextDay.id})" class="w-full glass-card p-4 mt-3 flex items-center gap-3 text-start tap-feedback"><span class="w-10 h-10 rounded-full bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center shrink-0"><i data-lucide="calendar-clock" class="w-5 h-5"></i></span><span class="flex-1 min-w-0"><span class="block text-[12px] font-bold text-slate-400">${t('Next workout')}</span><span class="block text-[15px] font-black text-white truncate">${esc(dayLong(nextDay.day))} · ${esc(t(nextDay.title))}</span></span><i data-lucide="chevron-right" class="w-5 h-5 text-slate-400 shrink-0"></i></button>`;
        } else if (!day.exercises.length) {
            html += `<div class="glass-card today-card">${weekTop}<div class="today-body"><div class="flex items-start gap-2"><div class="flex-1 min-w-0">${dayLabel}<h2 class="text-[21px] font-black text-white leading-tight mt-0.5">${t('No exercises yet')}</h2></div>${editBtn}</div><div class="text-[12px] font-bold text-slate-400">${t('Add exercises to start training on this day.')}</div><button onclick="window.appActions.switchTab('plan'); window.appActions.openPlanDay(${day.id})" class="self-start px-5 py-2.5 rounded-xl bg-[#d4af37] text-black text-[12px] font-extrabold tap-feedback">${t('Plan this day')}</button></div></div>` + coachCardHTML();
        } else {
            const pr = dayProgress(day, history), fin = exercisesFinished(day, history);
            const finished = (pr.planned > 0 && pr.done >= pr.planned) || fin.every(Boolean);
            const mins = Math.max(10, Math.round(pr.planned * 2.5 / 5) * 5);
            const running = S && S.dayId === day.id && (!S.weekId || S.weekId === currentWeekId);
            html += `<div class="glass-card today-card ${finished ? 'border border-[#22c55e]/30' : ''}">${weekTop}<div class="today-body">
                <div class="flex items-start gap-2">
                    <div class="flex-1 min-w-0">
                        <div class="text-[12px] font-bold text-[#d4af37]">${esc(isT ? t('Today') : dayLong(day.day))}${finished ? ` · <span class="text-[#22c55e]">${t('Done')}</span>` : ''}</div>
                        <h2 class="text-[21px] font-black text-white leading-tight mt-0.5">${esc(t(day.title))}</h2>
                    </div>
                    ${editBtn}
                </div>
                <div class="text-[12px] font-bold text-slate-400">${t('{n} exercises', { n: day.exercises.length })} · ${t('{n} sets', { n: pr.planned })} · ${t('~{n} min', { n: mins })}</div>
                ${pr.done > 0 ? `<div><div class="flex justify-between text-[12px] font-bold mb-1.5"><span class="text-slate-400">${t('Done this week')}</span><span class="${finished ? 'text-[#22c55e]' : 'text-white'}" dir="ltr">${pr.done} / ${pr.planned}</span></div><div class="w-full h-1.5 bg-black/50 rounded-full overflow-hidden"><div class="bar-fill h-full rounded-full ${finished ? 'bg-[#22c55e]' : 'bg-[#d4af37]'}" style="width:${pr.pct}%"></div></div></div>` : ''}
                ${running ? `<button onclick="window.appActions.expandSession()" class="w-full py-2.5 rounded-xl bg-[#d4af37] text-black text-[12px] font-extrabold tap-feedback flex items-center justify-center gap-2"><span class="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0"></span><span class="truncate">${t('Continue workout')}</span></button>` : ''}
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
                    <span class="flex-1 min-w-0"><span class="ex-name block text-[15px] font-black text-white leading-tight truncate">${esc(tx(ex.name))}</span><span class="block text-[12px] font-bold mt-0.5 truncate ${full ? 'text-[#22c55e]' : 'text-slate-400'}">${full ? t('Done this week') : plan}</span></span>
                    <span class="flex items-center gap-1.5 shrink-0" dir="ltr">${extra ? `<span class="ex-pill-extra">+${extra}</span>` : ''}<span class="ex-pill" dir="auto">${t('{n} sets', { n: `<span dir="ltr">${doneSets}/${planned}</span>` })}</span></span>
                </button>`;
            }).join('') + `</div>`;
        }
        document.getElementById('workout-container').innerHTML = `<div class="${enterClass()}">${html}</div>`;
        if (window.lucide) window.lucide.createIcons();
        if (typeof todayHints === 'function' && !day.isRest && day.exercises.length && !S) todayHints();
    };

    // Contents of the "Edit exercise" pop-up (Plan tab), same look as the exercise pop-up on Today:
    // change exercise on top, then sets and reps; delete is a small icon next to close so it isn't pressed by accident
    const exEditHTML = (i, ex) => {
        const sets = parseInt(ex.sets) || 0, custom = !REPS_PRESETS.includes(ex.reps);
        const label = 'px-0.5 mb-1.5 text-[12px] font-bold text-slate-400';
        return `<div class="pop-head">
                    <button onclick="window.appActions.deleteEx(${i})" class="w-11 h-11 shrink-0 rounded-full bg-white/5 text-red-400/80 flex items-center justify-center tap-feedback" aria-label="${esc(t('Delete exercise'))}" title="${esc(t('Delete exercise'))}"><i data-lucide="trash-2" class="w-[18px] h-[18px]"></i></button>
                    <button onclick="window.appActions.closeExEdit()" class="w-11 h-11 shrink-0 rounded-full bg-white/5 text-slate-400 flex items-center justify-center tap-feedback" aria-label="${esc(t('Close'))}"><i data-lucide="x" class="w-5 h-5"></i></button>
                </div>
                <div class="px-5">
                <div class="text-[12px] font-bold text-[#d4af37]">${esc(tm(ex.muscle))}</div>
                <h3 class="ex-name ex-fit text-[24px] font-black text-white leading-tight mt-0.5 whitespace-nowrap overflow-hidden">${esc(tx(ex.name))}</h3>
                <button onclick="window.appActions.openPicker('replace', ${i})" class="w-full mt-4 py-3 rounded-2xl bg-white/5 text-white text-[12px] font-bold tap-feedback flex items-center justify-center gap-2"><i data-lucide="replace" class="w-4 h-4 text-[#d4af37]"></i>${esc(t('Change exercise'))}</button>
                <div class="${label} mt-4">${esc(t('Sets'))}</div>
                <div class="flex items-center gap-3 rounded-2xl bg-white/5 p-2" dir="ltr">
                    <button onclick="window.appActions.exEditSets(-1)" class="w-11 h-11 rounded-xl bg-white/5 text-2xl font-black text-white tap-feedback" aria-label="−">−</button>
                    <div class="flex-1 text-center text-[22px] font-black text-white tabular-nums num">${sets || esc(ex.sets)}</div>
                    <button onclick="window.appActions.exEditSets(1)" class="w-11 h-11 rounded-xl bg-white/5 text-2xl font-black text-white tap-feedback" aria-label="+">+</button>
                </div>
                <div class="${label} mt-3">${esc(t(isTimed(ex.reps) ? 'Seconds per set' : 'Reps per set'))}</div>
                <div class="grid grid-cols-4 gap-2" dir="ltr">${REPS_PRESETS.map(r => `<button onclick="window.appActions.exEditReps(${jsArg(r)})" class="py-2.5 rounded-xl text-[12px] font-bold tap-feedback ${ex.reps === r ? 'bg-[#d4af37] text-black' : 'bg-white/5 text-white'}">${esc(fmtReps(r))}</button>`).join('')}<button onclick="window.appState.customReps=true;window.appActions.refreshExEdit()" class="py-2.5 rounded-xl text-[12px] font-bold tap-feedback flex items-center justify-center gap-1 ${custom ? 'bg-[#d4af37] text-black' : 'bg-white/5 text-slate-300 border border-dashed border-white/20'}" aria-label="${esc(t('Custom'))}">${custom ? esc(fmtReps(ex.reps)) : `<i data-lucide="plus" class="w-3.5 h-3.5"></i>${esc(t('Custom'))}`}</button></div>
                ${window.appState.customReps ? `<div class="flex gap-2 mt-2"><input id="exedit-custom" type="text" inputmode="text" value="${custom ? esc(ex.reps) : ''}" placeholder="${esc(t('Custom reps, e.g. 5 or 6 - 8'))}" onkeydown="if(event.key==='Enter')this.blur()" onchange="window.appState.customReps=false;window.appActions.exEditReps(this.value)" class="flex-1 min-w-0 bg-white/5 border border-[#d4af37]/60 rounded-xl px-3 py-2.5 text-white font-bold outline-none focus:border-[#d4af37]" dir="ltr"><button onclick="const v=document.getElementById('exedit-custom').value;window.appState.customReps=false;if(v.trim())window.appActions.exEditReps(v);else window.appActions.refreshExEdit()" class="shrink-0 px-4 rounded-xl bg-[#d4af37] text-black text-[12px] font-extrabold tap-feedback"><i data-lucide="check" class="w-4 h-4"></i></button></div>` : ''}
                <button onclick="window.appActions.closeExEdit()" class="w-full mt-5 py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-black tap-feedback flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.35)]"><i data-lucide="check" class="w-5 h-5"></i>${esc(t('Done'))}</button>
            </div>`;
    };
    // Re-draws the open "Edit exercise" pop-up (after a change, or after the exercise was changed in the picker)
    const renderExEdit = () => {
        const i = window.appState.inlineEdit, day = getActiveSchedule().find(d => d.id === activeDay), ex = day && day.exercises[i];
        if (i === null || i === undefined || !ex) return;
        const c = document.getElementById('exedit-content');
        c.innerHTML = exEditHTML(i, ex);
        if (window.lucide) window.lucide.createIcons({ root: c });
        fitNames(c);
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
    const planBackBar = () => `<button onclick="window.appActions.openPlanDay(null)" class="flex items-center gap-3 mb-3 ps-0.5 pe-3 py-0.5 tap-feedback" aria-label="${esc(t('This week'))}"><span class="w-11 h-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white shrink-0"><i data-lucide="${isAR ? 'arrow-right' : 'arrow-left'}" class="w-6 h-6"></i></span><span class="text-[16px] font-black text-white">${t('This week')}</span></button>`;
    const renderPlanDay = (top = '') => {
        const schedule = getActiveSchedule(), day = schedule.find(d => d.id === activeDay), S = window.appState;
        const planned = day.exercises.reduce((a, ex) => a + (parseInt(ex.sets) || 0), 0);
        const mins = Math.max(10, Math.round(planned * 2.5 / 5) * 5), hasEx = !day.isRest && day.exercises.length > 0;
        const pill = 'flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-full border text-[12px] font-black whitespace-nowrap';
        const dayLabel = `<div class="text-[12px] font-bold text-[#d4af37]">${esc(dayLong(day.day))}</div>`;
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
                <div class="text-[12px] font-bold text-slate-300 leading-tight min-w-0">${t('Same for all')}</div>
                <div class="flex items-center gap-2">
                    <input type="text" id="global-sets" placeholder="${t('Sets')}" class="w-[72px] placeholder:text-[12px] bg-black/40 text-white text-[14px] font-bold text-center rounded-lg py-2 border border-white/10 outline-none focus:border-[#d4af37]">
                    <input type="text" id="global-reps" placeholder="${t('Reps')}" class="w-[72px] placeholder:text-[12px] bg-black/40 text-white text-[14px] font-bold text-center rounded-lg py-2 border border-white/10 outline-none focus:border-[#d4af37]">
                    <button onclick="window.appActions.applyGlobalSetsReps()" class="bg-[#d4af37] text-black px-3 py-2 rounded-lg font-extrabold text-[12px] tap-feedback shadow-sm">${t('Apply')}</button>
                </div>
            </div>` : ''}
        </div></div>`;

        if (!day.isRest) {
            const grip = `<svg width="16" height="20" viewBox="0 0 16 20" fill="currentColor" aria-hidden="true"><circle cx="5" cy="4" r="1.8"/><circle cx="11" cy="4" r="1.8"/><circle cx="5" cy="10" r="1.8"/><circle cx="11" cy="10" r="1.8"/><circle cx="5" cy="16" r="1.8"/><circle cx="11" cy="16" r="1.8"/></svg>`;
            if (day.exercises.length > 1) html += `<div class="px-1.5 mb-2 text-[12px] font-extrabold text-slate-400">${t('Hold ⋮⋮ and drag to change the order')}</div>`;
            // ⋮⋮ drags straight away (no waiting, no fight with scrolling); the rest of the card opens the editor
            html += `<div id="sortable-list" class="space-y-2">${day.exercises.map((ex, i) => `<div class="glass-card plan-ex flex items-center gap-1.5" data-i="${i}">
                    <span class="handle w-9 h-11 shrink-0 flex items-center justify-center text-slate-400" aria-label="${esc(t('Drag to reorder'))}" role="img">${grip}</span>
                    <button onclick="window.appActions.openExEdit(${i})" class="flex-1 min-w-0 flex items-center gap-2.5 text-start tap-feedback py-0.5">
                        <span class="plan-ex-n w-[26px] h-[26px] shrink-0 rounded-full bg-white/5 flex items-center justify-center text-[12px] font-bold text-slate-300">${i + 1}</span>
                        <span class="flex-1 min-w-0"><span class="ex-name block text-[15px] font-black text-white leading-tight truncate">${esc(tx(ex.name))}</span><span class="block text-[12px] font-bold mt-0.5 truncate text-slate-400">${esc(tm(ex.muscle))}</span></span>
                        <span class="shrink-0 me-1 text-[12px] font-bold px-2.5 py-1 rounded-full bg-[#d4af37]/15 text-[#d4af37]" dir="ltr">${esc(ex.sets)} × ${esc(fmtReps(ex.reps))}</span>
                    </button>
                </div>`).join('')}</div>`;
            html += `<button onclick="window.appActions.openPicker('add')" class="w-full p-4 mt-2.5 mb-10 rounded-[20px] flex items-center justify-center gap-2 text-[#d4af37] font-bold text-[12px] tap-feedback border-[1.5px] border-dashed border-[#d4af37]/50 bg-[#d4af37]/5"><i data-lucide="plus" class="w-4 h-4"></i> ${t('Add Exercise')}</button>`;
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
    const muscleBalanceHTML = schedule => {
        const sets = BALANCE.map(([g, ms, low]) => ({ g, low, n: schedule.reduce((a, d) => a + (d.isRest ? 0 : (d.exercises || []).filter(ex => ms.includes(ex.muscle)).reduce((b, ex) => b + (parseInt(ex.sets) || 0), 0)), 0) }));
        if (!sets.some(x => x.n)) return '';
        const top = Math.max(20, ...sets.map(x => x.n));
        return `<div class="glass-card p-4 mt-4">
            <div class="flex items-baseline justify-between mb-3"><span class="text-[12px] font-bold text-slate-400">${t('Muscle balance')}</span><span class="text-[12px] font-bold text-slate-400">${t('Sets per week')}</span></div>
            <div class="space-y-2.5">${sets.map(x => { const lo = x.n < x.low; return `<div class="flex items-center gap-3">
                <span class="w-[74px] shrink-0 text-[12px] font-bold ${lo ? 'text-orange-400' : 'text-slate-200'}">${esc(t(x.g))}</span>
                <span class="flex-1 h-2 rounded-full bg-white/10 overflow-hidden" dir="ltr"><span class="block h-full rounded-full ${lo ? 'bg-orange-400' : 'bg-[#d4af37]'}" style="width:${Math.max(x.n ? 4 : 0, Math.round(x.n / top * 100))}%"></span></span>
                <span class="w-[58px] shrink-0 text-end text-[12px] font-bold ${lo ? 'text-orange-400' : 'text-white'}"><span dir="ltr">${x.n}</span>${lo ? ` · ${t('Low')}` : ''}</span>
            </div>`; }).join('')}</div>
            <p class="text-[12px] font-bold text-slate-400 mt-3">${t('Aim for about 10–20 sets a week for each muscle.')}</p>
        </div>`;
    };
    const renderPlanWeek = () => {
        const schedule = getActiveSchedule(), today = getTodayId();
        const editing = !!window.appState.weekEdit; // the ✏️ next to Coach: days can be moved only while it's on
        const ws = getWeekStart(), dateOf = id => new Date(ws.getFullYear(), ws.getMonth(), ws.getDate() + id - 1);
        const grip = `<svg width="16" height="20" viewBox="0 0 16 20" fill="currentColor" aria-hidden="true"><circle cx="5" cy="4" r="1.8"/><circle cx="11" cy="4" r="1.8"/><circle cx="5" cy="10" r="1.8"/><circle cx="11" cy="10" r="1.8"/><circle cx="5" cy="16" r="1.8"/><circle cx="11" cy="16" r="1.8"/></svg>`;
        const dayOpts = id => schedule.filter(d => d.id !== id).map(d => `<option value="${d.id}">${esc(dayLong(d.day))}</option>`).join('');
        // ⋮ on a row: copy (the phone's own day list) and clear; moving a day is done by dragging ⋮⋮
        const mItem = 'relative w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-start text-[13px] font-extrabold tap-feedback';
        const daySelect = (fn, id, label) => `<select onchange="if(this.value){window.appState.weekMenu=null;window.appActions.${fn}(${id}, parseInt(this.value));this.value='';}" class="absolute inset-0 w-full h-full opacity-0 z-10" aria-label="${esc(label)}"><option value="">${esc(label)}</option>${dayOpts(id)}</select>`;
        const menu = d => window.appState.weekMenu !== d.id ? '' : `<div class="absolute end-1 top-full mt-1 z-[61] w-[230px] p-1.5 rounded-2xl bg-[#111] border border-white/15 shadow-[0_20px_40px_rgba(0,0,0,0.7)]" role="menu">
                <div class="${mItem} text-slate-200" role="menuitem">${daySelect('copyDayFrom', d.id, t('Copy to another day'))}<i data-lucide="copy" class="w-4 h-4 text-slate-400"></i>${t('Copy to another day')}</div>
                ${!d.isRest && (d.exercises || []).length ? `<button onclick="window.appState.weekMenu=null;window.appActions.clearDayFrom(${d.id})" class="${mItem} text-red-400" role="menuitem"><i data-lucide="trash-2" class="w-4 h-4"></i>${t('Clear this day')}</button>` : ''}
            </div>`;
        const row = d => {
            const empty = !d.isRest && !(d.exercises || []).length, n = (d.exercises || []).reduce((a, ex) => a + (parseInt(ex.sets) || 0), 0);
            const title = d.isRest ? t(d.recoveryType === 'active' ? 'Active Rest' : 'Complete Rest') : empty ? t('Empty') : t(d.title);
            const meta = d.isRest ? '' : empty ? `<span class="text-[#d4af37]">＋ ${t('Add exercises')}</span>` : `${t('{n} exercises', { n: d.exercises.length })} · ${t('{n} sets', { n })}`;
            const open = window.appState.weekMenu === d.id;
            return `<div class="glass-card plan-ex plan-day ${d.isRest ? 'is-rest' : ''} ${d.id === today ? 'is-today' : ''} ${editing ? 'is-editing' : ''} h-[62px] flex items-center gap-1.5 relative ${open ? 'z-20' : ''}">
                ${editing ? `<span class="handle w-9 h-11 shrink-0 flex items-center justify-center" aria-label="${esc(t('Drag to reorder'))}" role="img">${grip}</span>` : ''}
                <button onclick="window.appActions.openPlanDay(${d.id})" class="flex-1 min-w-0 h-full flex items-center gap-2.5 text-start tap-feedback" aria-label="${esc(dayLong(d.day) + ' · ' + title)}">
                    ${d.isRest ? `<i data-lucide="${d.recoveryType === 'active' ? 'footprints' : 'moon'}" class="w-4 h-4 text-slate-400 shrink-0"></i>` : empty ? '<span class="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>' : ''}
                    <span class="flex-1 min-w-0"><span class="block text-[15px] font-black leading-tight truncate ${d.isRest || empty ? 'text-slate-400' : 'text-white'}">${esc(title)}</span>${meta ? `<span class="block text-[12px] font-bold text-slate-400 mt-0.5 truncate">${meta}</span>` : ''}</span>
                </button>
                <button onclick="window.appActions.toggleWeekMenu(${d.id})" class="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl tap-feedback ${open ? 'text-[#d4af37]' : 'text-slate-400'}" aria-haspopup="menu" aria-expanded="${open}" aria-label="${esc(t('Day options') + ' · ' + dayLong(d.day))}"><i data-lucide="ellipsis-vertical" class="w-[18px] h-[18px]"></i></button>
                ${menu(d)}
            </div>`;
        };
        let html = `<div class="flex items-center justify-between gap-2 px-1 mb-2.5">
                <span class="min-w-0"><span class="block text-[17px] font-black text-white">${t('This week')}</span><span class="block text-[12px] font-bold ${editing ? 'text-[#d4af37]' : 'text-slate-400'}">${t(editing ? 'Drag the days to move them' : 'Tap a day to edit it')}</span></span>
                <span class="shrink-0 flex items-center gap-2">
                    <button onclick="window.appActions.openAI()" class="coach-btn tap-feedback"><span class="coach-btn-ic" aria-hidden="true"><i data-lucide="sparkles"></i></span>${t('Coach')}</button>
                    <button onclick="window.appActions.toggleWeekEdit()" class="week-edit-btn ${editing ? 'is-on' : ''} tap-feedback" aria-pressed="${editing}" aria-label="${esc(t(editing ? 'Done' : 'Move days'))}">${editing ? `<i data-lucide="check"></i><span>${t('Done')}</span>` : '<i data-lucide="pencil"></i>'}</button>
                </span>
            </div>
            <div class="flex gap-2">
                <div class="w-11 shrink-0 flex flex-col gap-2" aria-hidden="true">${schedule.map(d => `<div class="h-[62px] flex flex-col items-center justify-center rounded-2xl ${d.id === today ? 'bg-[#d4af37]/15 text-[#d4af37]' : 'text-slate-400'}"><span class="text-[12px] font-bold">${esc(dayShort(d.day))}</span><span class="text-[16px] font-black leading-tight ${d.id === today ? '' : 'text-white'}">${dateOf(d.id).getDate()}</span></div>`).join('')}</div>
                <div id="week-list" class="flex-1 min-w-0 flex flex-col gap-2">${schedule.map(row).join('')}</div>
            </div>
            ${muscleBalanceHTML(schedule)}
            <div class="h-10"></div>`;
        document.getElementById('workout-container').innerHTML = `<div class="plan-scope ${editing ? 'is-editing' : ''} ${enterClass('week')}">${html}</div>`;
        if (window.appState.sortableInstance) { window.appState.sortableInstance.destroy(); window.appState.sortableInstance = null; }
        const listEl = document.getElementById('week-list');
        if (listEl && window.Sortable && editing) {
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
        if (typeof hint === 'function') hint('plan-week', '#week-list > div', t('Tap a day to edit it. Tap ✏️ next to Coach to move days.'));
    };

    // ⚙️ 5. GLOBAL ACTIONS
    window.appActions = {
        showToast: (m, type='success', action=null) => {
            const c = document.getElementById('toast-container'); c.innerHTML=''; const d=document.createElement('div'), iS=type==='success', cS=iS?'text-[#22c55e]':'text-red-400', bS=iS?'bg-[#22c55e]/10 border-[#22c55e]/20':'bg-red-500/10 border-red-500/20';
            d.className=`glass-card p-4 flex items-center gap-3 border shadow-2xl transform translate-y-full opacity-0 transition-all duration-500 mt-2 ${bS} backdrop-blur-3xl pointer-events-auto`;
            d.innerHTML=`<i data-lucide="${iS?'check-circle':'alert-circle'}" class="w-5 h-5 shrink-0 ${cS}"></i><span class="text-[13px] font-bold text-white leading-snug flex-1">${esc(m)}</span>${action ? `<button class="shrink-0 px-3 py-1.5 rounded-lg bg-white/10 text-white text-[12px] font-bold tap-feedback">${esc(action.label)}</button>` : ''}`;
            if (action) d.querySelector('button').onclick = () => { action.fn(); d.remove(); };
            c.appendChild(d); if(window.lucide) window.lucide.createIcons({root:d}); void d.offsetWidth; d.classList.remove('translate-y-full','opacity-0');
            setTimeout(()=>{if(c.contains(d)){d.classList.add('opacity-0','translate-y-full');setTimeout(()=>{if(c.contains(d))d.remove();},500);}}, action ? 5000 : 3500);
        },
        showConfirm: (title, m, ok, dng=false, okLabel=null) => {
            const y = document.getElementById('confirm-yes-btn');
            y.innerHTML = `<span>${esc(okLabel || t('Yes, Do it'))}</span>`;
            document.getElementById('confirm-title').innerText=title; document.getElementById('confirm-message').innerText=m;
            y.className=`flex-1 rounded-xl py-3.5 text-[12px] font-extrabold shadow-lg tap-feedback ${dng?'text-white bg-red-500 shadow-red-500/20':'text-black bg-[#d4af37] shadow-[#d4af37]/20'}`;
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
            const tile = (label, value) => `<div class="rounded-2xl bg-white/5 px-3.5 py-2 min-w-0"><div class="text-[12px] font-bold text-slate-400">${label}</div><div class="text-[19px] font-black text-white leading-tight mt-0.5"><span dir="ltr">${value}</span></div></div>`;
            const tgtCls = sg ? { up: 'is-up', down: 'is-down' }[sg.type] || '' : '';
            // header: the three buttons; under it the exercise name gets the whole width
            document.getElementById('ex-sheet-content').innerHTML = `<div class="pop-head">
                    <span class="flex items-center gap-2">
                    <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + ' exercise form')}" target="_blank" rel="noopener" class="w-11 h-11 shrink-0 rounded-full bg-white/5 text-slate-300 flex items-center justify-center tap-feedback" aria-label="${esc(t('How to do it (YouTube)'))}" title="${esc(t('How to do it (YouTube)'))}"><i data-lucide="circle-help" class="w-[18px] h-[18px]"></i></a>
                    <button onclick="window.appActions.openHistoryModal(${jsArg(k)},${jsArg(ex.name)})" class="w-11 h-11 shrink-0 rounded-full bg-white/5 text-slate-300 flex items-center justify-center tap-feedback" aria-label="${esc(t('History'))}" title="${esc(t('History'))}"><i data-lucide="history" class="w-[18px] h-[18px]"></i></button>
                    </span>
                    <button onclick="window.appActions.closeExSheet()" class="w-11 h-11 shrink-0 rounded-full bg-white/5 text-slate-400 flex items-center justify-center tap-feedback" aria-label="${esc(t('Close'))}"><i data-lucide="x" class="w-5 h-5"></i></button>
                </div>
                <div class="px-5">
                <div class="text-[12px] font-bold text-[#d4af37]">${esc(tm(ex.muscle))}</div>
                <h3 class="ex-name ex-fit text-[24px] font-black text-white leading-tight mt-0.5 whitespace-nowrap overflow-hidden">${esc(tx(ex.name))}</h3>
                ${shown === 0 ? (hA.length ? '' : `<div class="ex-first mt-4"><i data-lucide="sparkles" class="w-4 h-4 shrink-0"></i>${t('First time')}</div>`) : `<div class="ex-week ${full ? 'is-full' : 'is-part'} mt-4">
                    <div class="flex items-baseline justify-between gap-2"><span class="text-[12px] font-bold">${t('Done this week')}</span><b class="text-[15px] font-black">${extra ? `${t('{a} of {b} sets', { a: shown, b: planned })} <span class="ex-extra">${t('+{n} extra', { n: extra })}</span>` : full ? t('All {n} sets', { n: planned }) : t('{a} of {b} sets', { a: shown, b: planned })}</b></div>
                    <div class="ex-segs" dir="ltr">${Array.from({ length: Math.max(planned, shown) }, (_, k) => `<i class="${k >= planned ? 'is-extra' : k < shown ? 'is-on' : ''}"></i>`).join('')}</div>
                </div>`}
                <div class="grid grid-cols-2 gap-2 mt-2.5">${tile(t('Sets'), esc(ex.sets))}${tile(t(timed ? 'Seconds per set' : 'Reps per set'), esc(fmtReps(ex.reps)))}</div>
                ${sg && !full ? `<div class="ex-target ${tgtCls} mt-2"><i data-lucide="target" class="w-[18px] h-[18px] shrink-0"></i><div class="min-w-0"><div class="ex-target-l">${t("Today's target")}${sg.type !== 'build' ? ` · ${t(SUGG[sg.type].label).replace(/[:：]\s*$/, '')}` : ''}</div><div class="text-[16px] font-black text-white">${targetSentence(sg, timed)}</div></div></div>` : ''}
                ${!hA.length ? '' : `<div class="mt-3">
                    <div class="flex justify-between px-0.5 mb-1.5 text-[12px] font-bold text-slate-400"><span>${t('Last time')}</span><span>${lastDay ? esc(isToday(lastDay.ts) ? t('Today') : fmtDate(lastDay.ts, false)) : ''}</span></div>
                    ${prev.length ? `<table class="ex-last-tbl" dir="ltr"><thead><tr><th>#</th><th>${t('kg')}</th><th>${t(timed ? 'sec' : 'reps')}</th></tr></thead><tbody>${prev.map((x, k) => `<tr><td>${t('Set {n}', { n: k + 1 })}</td><td>${x.w > 0 ? x.w : t('BW')}</td><td>${x.r}</td></tr>`).join('')}</tbody></table>`
                        : `<div class="rounded-2xl bg-white/5 px-3.5 py-3 text-[13px] font-bold text-slate-400">${t('First time doing this exercise')}</div>`}
                </div>`}
                <button onclick="window.appActions.closeExSheet(); window.appActions.startWorkout(${day.id}, null, ${i})" class="w-full mt-4 py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-black tap-feedback flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.35)]">${isRun ? '<span class="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>' : '<i data-lucide="play" class="w-5 h-5 fill-current"></i>'}${isRun ? t('Continue workout') : full ? t('Log more sets') : shown > 0 ? t('Continue') : t('Start workout')}</button>
            </div>`;
            if (window.lucide) window.lucide.createIcons({ root: document.getElementById('ex-sheet-box') });
            openModal('ex-sheet-overlay', 'ex-sheet-box');
            fitNames(document.getElementById('ex-sheet-content')); // the name stays on one line (smaller font if it's long)
            pushBack('exsheet', () => window.appActions.closeExSheet());
        },
        closeExSheet: () => { popBack('exsheet'); closeModal('ex-sheet-overlay', 'ex-sheet-box'); },
        // Dark (default), light, or the same as the phone ('system'); remembered on this phone
        setTheme: v => {
            v = ['light', 'system'].includes(v) ? v : 'dark';
            try { localStorage.setItem('workoutTheme_rakan_final', v); } catch (e) {}
            applyTheme();
            const sel = document.getElementById('setting-theme'); if (sel) sel.value = v;
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
        // Progress tab: switch section (remembered), filter and search the exercise list, log body weight
        progressTab: id => { window.appState.aTab = id; try { localStorage.setItem(PTAB_KEY, id); } catch (e) {} renderAnalytics(); window.scrollTo({ top: 0 }); },
        // the chip row keeps its scroll position after the list is redrawn
        progressFilter: id => { const row = document.getElementById('pex-chips'), x = row ? row.scrollLeft : 0; window.appState.pexF = id; renderAnalytics(); const nr = document.getElementById('pex-chips'); if (nr) nr.scrollLeft = x; },
        progressSearch: q => { window.appState.pexQ = q; const el = document.getElementById('pex-list'); if (!el) return; el.innerHTML = progressExerciseListHTML(progressExerciseRows(StorageManager.getHistory())); if (window.lucide) window.lucide.createIcons({ root: el }); },
        progressLogWeight: () => {
            const inp = document.getElementById('pb-weight'), v = inp ? latinDigits(inp.value).trim() : '';
            const w = parseFloat(v.replace(/[\u066B\u060C,]/g, '.'));
            if (!(w >= 25 && w <= 350)) { window.appActions.showToast(t('Please check this number.'), 'error'); return; }
            window.appActions.setAbout('weightKg', v);
            window.appActions.showToast(t('Weight saved'));
            renderAnalytics();
        },
        openHistoryModal: (k, title) => { window.appState.historyEditMode=false; window.appState.openHistoryKey=k; const b=document.getElementById('history-edit-btn'); if(b){b.classList.remove('text-[#d4af37]','bg-[#d4af37]/10');b.classList.add('text-slate-400','bg-white/5');} document.getElementById('history-modal-title').innerText=tx(title); const hw=document.getElementById('history-howto'); if(hw) hw.href=`https://www.youtube.com/results?search_query=${encodeURIComponent(title+' exercise form')}`; window.appActions.refreshHistoryModal(k); const o=document.getElementById('history-modal-overlay'),bx=document.getElementById('history-modal-box'); o.classList.remove('hidden'); o.classList.add('flex'); requestAnimationFrame(()=>{o.classList.remove('opacity-0');bx.classList.remove('translate-y-full','md:translate-y-0','md:scale-95');}); pushBack('history', () => window.appActions.closeHistoryModal()); },
        closeHistoryModal: () => { popBack('history'); const o=document.getElementById('history-modal-overlay'),b=document.getElementById('history-modal-box'); o.classList.add('opacity-0'); b.classList.add('translate-y-full'); if(window.innerWidth>=768)b.classList.add('md:scale-95'); setTimeout(()=>{if(o.classList.contains('opacity-0')){o.classList.add('hidden');o.classList.remove('flex');}},300); },
        toggleHistoryEdit: () => { window.appState.historyEditMode=!window.appState.historyEditMode; const b=document.getElementById('history-edit-btn'); if(b){b.className=`p-2 rounded-full tap-feedback transition-colors ${window.appState.historyEditMode?'text-[#d4af37] bg-[#d4af37]/10':'text-slate-400 bg-white/5 hover:text-[#d4af37]'}`;} if(window.appState.openHistoryKey)window.appActions.refreshHistoryModal(window.appState.openHistoryKey); },
        refreshHistoryModal: (k) => { const c=document.getElementById('history-modal-content'), hA=StorageManager.getHistory()[k]||[]; if(!hA.length){c.innerHTML=`<div class="text-center p-10 text-slate-400 text-[12px] font-bold">${t('No records')}</div>`;return;} let html='',cG=''; const getDt=(h, fb=Date.now())=>{const t=logTime(h); return new Date(isNaN(t)?fb:t);}, sD=getDt(hA[0]); sD.setHours(0,0,0,0); [...hA].reverse().forEach((h,i)=>{const dt=getDt(h, sD.getTime()); dt.setHours(0,0,0,0); const dD=Math.max(0,Math.floor((dt.getTime()-sD.getTime())/86400000)), wN=Math.floor(dD/7)+1, cWS=new Date(sD.getTime()+((wN-1)*604800000)), cWE=new Date(cWS.getTime()+518400000), gN=`${t('Week {n}', { n: wN })} • ${fmtDayMonth(cWS)} - ${fmtDayMonth(cWE)}`; if(gN!==cG){html+=`<div class="text-[12px] font-bold text-[#d4af37] mt-4 mb-2 pl-1 border-b border-[#d4af37]/20 pb-1"><i data-lucide="calendar-days" class="w-3 h-3 inline mr-1 -mt-0.5"></i> ${esc(gN)}</div>`; cG=gN;}
         html+=`<div class="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 mb-2"><div class="flex flex-col"><div class="flex items-center"><span class="text-[15px] font-black text-white">${(h.ws || h.rpe) ? `<span class="text-[#d4af37]">${logSetDetails(h).map(x => `${x.w > 0 ? x.w : t('BW')}×${x.r}${h.u==='s'?'s':''}${x.rpe ? `<span class="text-[12px] text-slate-400">@${x.rpe}</span>` : ''}`).join(', ')}</span>` : `${parseFloat(h.w)>0?`${esc(h.w)} <span class="text-[12px] text-slate-400">${t('kg')}</span>`:t('BW')} ${h.s?`<span class="ml-2 text-[#d4af37]">${esc(Array.isArray(h.s) ? h.s.join(', ') : h.s)} <span class="text-[12px] text-slate-400">${h.u==='s'?t('sec'):t('reps')}</span></span>`:''}`}</span></div><span class="text-[12px] font-bold text-slate-400 mt-1">${esc(isNaN(logTime(h)) ? h.d : fmtDate(logTime(h)))} ${h.time ? `<span class="ml-2 text-[#22c55e]"><i data-lucide="clock" class="w-3 h-3 inline -mt-0.5"></i> ${esc(h.time)}</span>` : ''}</span></div>${window.appState.historyEditMode?`<button onclick="window.appActions.deleteHistoryRecord(${jsArg(k)}, ${hA.length-1-i})" class="p-2 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20"><i data-lucide="trash-2" class="w-4 h-4"></i></button>`:''}</div>`; }); c.innerHTML=exerciseStatsHTML(hA)+html; bindCharts(c); if(window.lucide) window.lucide.createIcons({root:c}); },
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
            S.cols = showRpe ? '32px minmax(0,1fr) minmax(0,1fr) 60px' : '32px minmax(0,1fr) minmax(0,1fr)';
            S.rowSeq = 0; // rows are numbered from 1 again every time the table is built
            // one exercise: the day's name on top (the exercise's own name is right below it)
            document.getElementById('aw-title').innerText = tx(t(S.exIdx != null && S.dayTitle ? S.dayTitle : S.title));
            document.getElementById('aw-status-text').innerText = t('Workout');
            document.getElementById('aw-pulse-dot').className = 'w-2 h-2 rounded-full shrink-0 bg-red-500 animate-pulse';
            document.getElementById('aw-mini-name').innerText = tx(t(S.title));
            const head = ex => `<div class="grid items-center gap-1.5 px-2 pb-1.5 text-[12px] font-bold text-slate-400" dir="ltr" style="grid-template-columns:${S.cols}"><span class="text-center">#</span><span class="text-center">${t('kg')}</span><span class="text-center">${ex.timed ? t('sec') : t('reps')}</span>${showRpe ? '<span class="text-center">RPE</span>' : ''}</div>`;
            document.getElementById('aw-sets-container').innerHTML = S.exercises.map((ex, e) => `
                <section class="mb-6" id="aw-ex-${e}">
                    <div class="flex items-start justify-between gap-2 px-1 mb-2">
                        <div class="min-w-0">
                            <div class="ex-name text-[17px] font-black text-white leading-tight">${esc(tx(ex.name))}</div>
                            <div class="text-[12px] font-bold text-slate-400 mt-0.5">${esc(tm(ex.muscle))} · ${t('{n} sets', { n: ex.sets })} · ${t(ex.timed ? '{r} sec' : '{r} reps', { r: `<span dir="ltr">${esc(fmtReps(ex.repsStr))}</span>` })}</div>
                        </div>
                        <span class="shrink-0">${suggestionChip(ex.sg, ex.timed)}</span>
                    </div>
                    ${(() => { const last = lastSessionText(StorageManager.getHistory()[ex.k] || [], ex.timed); return `<div class="flex items-center gap-2 mx-1 mb-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/5 text-[12px] font-bold text-slate-400"><i data-lucide="history" class="w-4 h-4 shrink-0 text-slate-400"></i>${last ? `<span class="min-w-0">${t('Last time')} · ${esc(last.when)}<span class="block text-[14px] font-black text-white mt-0.5" dir="ltr">${last.body}</span></span>` : `<span>${t('First time')}</span>`}</div>`; })()}
                    ${head(ex)}
                    <div id="aw-rows-${e}" class="space-y-1.5"></div>
                    <div id="aw-note-${e}" class="hidden px-2 py-2 text-[12px] font-bold text-[#22c55e]"><i data-lucide="check" class="w-3.5 h-3.5 inline -mt-0.5"></i> ${t('Done this week')}</div>
                    <div class="flex gap-2 mt-2 px-1">
                        <button onclick="window.appActions.removeSetRow(${e})" class="h-11 px-5 rounded-xl bg-white/5 border border-white/10 text-slate-300 tap-feedback" aria-label="${esc(t('Remove set'))}"><i data-lucide="minus" class="w-4 h-4"></i></button>
                        <button onclick="window.appActions.addSetRow(${e})" class="flex-1 h-11 rounded-xl bg-white/5 border border-white/10 text-[13px] font-bold text-slate-200 tap-feedback flex items-center justify-center gap-1.5"><i data-lucide="plus" class="w-4 h-4"></i>${t('Add set')}</button>
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
            // the line stays empty until the first set is logged; then the next set is marked
            const rowsAll = [...all], nextI = done.length ? rowsAll.findIndex(r => r.dataset.done !== '1') : -1;
            const segs = rowsAll.length <= 40 ? rowsAll.map((r, j) => `<i class="${r.dataset.done === '1' ? 'is-on' : j === nextI ? 'is-now' : ''}"></i>`).join('') : `<i class="is-on" style="flex:${done.length}"></i><i style="flex:${all.length - done.length}"></i>`;
            document.getElementById('aw-info').innerHTML = `<div class="w-full"><div class="flex justify-between items-baseline text-[12px] font-bold mb-2"><span class="text-slate-400">${S.exercises.length > 1 ? t('{n} exercises', { n: S.exercises.length }) : ''}</span><span class="text-slate-400" dir="ltr"><b class="num text-[20px] font-bold text-white">${done.length}</b> / ${all.length} ${t('sets')}</span></div><div class="aw-segs" dir="ltr" role="progressbar" aria-valuemin="0" aria-valuemax="${all.length}" aria-valuenow="${done.length}">${segs}</div></div>`;
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
            const inCls = 'aw-in w-full h-14 rounded-xl bg-black/50 border border-white/10 text-center text-[26px] font-bold text-white outline-none focus:border-[#d4af37]';
            box.insertAdjacentHTML('beforeend', `
                <div class="aw-row grid items-center gap-1.5 px-2 py-1 rounded-xl transition-colors ${r.done ? 'is-done' : ''} ${r.logged ? 'is-logged' : ''}" data-i="${i}" data-e="${e}" data-done="${r.done ? 1 : 0}" ${r.logged ? 'data-logged="1"' : ''} id="aw-row-${i}" dir="ltr" style="grid-template-columns:${S.cols}">
                    <span class="num w-8 h-8 rounded-full ${r.done ? 'bg-[#22c55e] text-black' : 'bg-white/5 text-slate-300'} text-[16px] font-bold flex items-center justify-center" id="aw-num-${i}">${n}</span>
                    <input id="aw-w-${i}" type="text" inputmode="decimal" autocomplete="off" value="${esc(r.w)}" ${r.logged ? 'disabled' : ''} placeholder="${isBodyweight(ex.name) ? t('BW') : t('kg')}" onfocus="window.appActions.selectAll(this)" oninput="window.appActions.numInput(this, true)" class="${inCls} text-[#d4af37]">
                    <input id="aw-rep-${i}" type="text" inputmode="numeric" autocomplete="off" value="${esc(r.r)}" ${r.logged ? 'disabled' : ''} placeholder="${ex.timed ? t('sec') : t('reps')}" onfocus="window.appActions.selectAll(this)" oninput="window.appActions.numInput(this, false)" onblur="window.appActions.repsChanged(${i})" onkeydown="if(event.key==='Enter')this.blur()" class="${inCls}">
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
        // Tapping a KG / REPS box selects its number, so typing replaces it straight away
        // (after the tap, so phones and iPhones don't drop the selection)
        selectAll: el => setTimeout(() => { if (document.activeElement !== el) return; try { el.setSelectionRange(0, el.value.length); } catch (e) { el.select(); } }, 0),
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
                if (num) num.className = `num w-8 h-8 rounded-full ${on ? 'bg-[#22c55e] text-black' : 'bg-white/5 text-slate-300'} text-[16px] font-bold flex items-center justify-center`;
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
        updateRest: v => { StorageManager.setRestSeconds(v); window.appActions.showToast(t('Rest timer: {v}s', { v: parseInt(v) }), 'success'); },
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
                    window.appActions.showToast(t('{name} saved · {n} sets', { name: tx(title), n: sets }) + (prs.length ? ` · ${t('New record')} 🏆` : ''), 'success');
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
            const stat = (v, l, count) => `<div class="bg-white/5 rounded-xl py-3"><div class="text-[18px] font-black text-white tabular-nums num" dir="ltr" ${count !== undefined ? `data-count="${count}"` : ''}>${v}</div><div class="text-[12px] font-bold text-slate-400">${l}</div></div>`;
            document.getElementById('summary-stats').innerHTML = stat(fmtClock(duration), t('Time')) + stat(0, t('sets'), sets) + stat(0, t('kg lifted'), Math.round(volume));
            document.getElementById('summary-prs').innerHTML = prs.length
                ? `<div class="text-[12px] font-bold text-[#d4af37] mb-2">🏆 ${t('New records')}</div>` + prs.map(x => `<div class="flex justify-between gap-2 py-2 border-b border-white/5 last:border-0"><span class="ex-name text-[13px] font-bold text-white truncate">${esc(tx(x.name))}</span><span class="text-[13px] font-bold text-[#22c55e] shrink-0" dir="ltr">${x.w}kg (+${x.plus})</span></div>`).join('')
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
            window.appActions.showToast(t('Removed {name}', { name: tx(removed.name) }), 'error', { label: t('Undo'), fn: () => {
                d.exercises.splice(i, 0, removed); StorageManager.setPlan(appData); renderWorkout(); renderNav(false);
            } });
        },

        // ---------- Exercise picker ----------
        // mode 'add': choose several exercises and add them; mode 'replace': swap exercise number idx
        openPicker: (mode, idx = null) => {
            const d = getActiveSchedule().find(x => x.id === activeDay);
            const cur = mode === 'replace' ? d.exercises[idx] : null;
            window.appState.picker = { mode, idx, muscle: cur && muscleOptions.includes(cur.muscle) ? cur.muscle : 'All', q: '', sel: [] };
            document.getElementById('picker-title').innerText = mode === 'replace' ? t('Change {name}', { name: tx(cur.name) }) : t('Add exercises');
            const search = document.getElementById('picker-search'); search.value = '';
            window.appActions.renderPicker();
            openSheet('picker-overlay', 'picker-box');
            fitNames(document.getElementById('picker-box'));
            pushBack('picker', () => window.appActions.closePicker());
            // the chips row starts at the highlighted muscle (changing a Chest exercise shows Chest), not at "All"
            const chips = document.getElementById('picker-chips'), on = chips.querySelector('[data-on]');
            chips.scrollLeft = 0;
            if (on && on.previousElementSibling) requestAnimationFrame(() => { const r = chips.getBoundingClientRect(), c = on.getBoundingClientRect(); chips.scrollLeft += (c.left + c.width / 2) - (r.left + r.width / 2); });
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
                    `<button onclick="window.appActions.pickerMuscle(${jsArg(m)})" ${P.muscle === m ? 'data-on="1"' : ''} class="shrink-0 h-10 px-3.5 rounded-full text-[13px] font-bold tap-feedback border ${P.muscle === m ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'bg-white/5 text-slate-300 border-white/10'}">${esc(m === 'All' ? t('All') : tm(m))}</button>`).join('');
            }
            const row = x => {
                const sel = isSel(x.name, x.muscle), added = inDay.has(x.name);
                return `<button onclick="window.appActions.pickerTap(${jsArg(x.name)}, ${jsArg(x.muscle)})" class="w-full flex items-center justify-between gap-3 px-4 py-3 border-b border-white/5 text-start tap-feedback ${sel ? 'bg-[#d4af37]/10' : ''}">
                    <span class="min-w-0"><span class="ex-name block text-[14px] font-bold text-white truncate">${esc(tx(x.name))}${x.custom ? ` <span class="text-[12px] text-[#d4af37]">★</span>` : ''}</span><span class="block text-[12px] font-bold text-slate-400">${esc(tm(x.muscle))}${added ? ` • ${esc(t('In this day'))}` : ''}</span></span>
                    <span class="shrink-0 w-7 h-7 rounded-full flex items-center justify-center border ${sel ? 'bg-[#d4af37] border-[#d4af37] text-black' : 'border-white/20 text-slate-400'}"><i data-lucide="${P.mode === 'replace' ? 'replace' : (sel ? 'check' : 'plus')}" class="w-4 h-4"></i></span>
                </button>`;
            };
            const header = txt => `<div class="px-4 pt-4 pb-1 text-[12px] font-bold text-[#d4af37]">${esc(txt)}</div>`;
            const q = P.q.trim().toLowerCase();
            let items = catalogue();
            if (P.muscle !== 'All') items = items.filter(x => x.muscle === P.muscle);
            let html = '';
            if (q) {
                const seen = new Set();
                const hits = items.filter(x => (x.name.toLowerCase().includes(q) || tx(x.name).includes(q) || tm(x.muscle).toLowerCase().includes(q)) && !seen.has(x.name) && seen.add(x.name));
                html = hits.map(row).join('');
                if (!items.some(x => x.name.toLowerCase() === q)) {
                    html += P.muscle === 'All'
                        ? `<div class="px-4 py-4 text-[12px] font-bold text-slate-400">${esc(t('Not in the list? Choose a muscle above, then add "{name}" as your own exercise.', { name: P.q.trim() }))}</div>`
                        : `<button onclick="window.appActions.addCustomEx()" class="w-full flex items-center gap-3 px-4 py-4 text-start text-[#d4af37] font-bold text-[13px] tap-feedback"><i data-lucide="plus-circle" class="w-5 h-5"></i>${esc(t('Add "{name}" to {muscle}', { name: P.q.trim(), muscle: tm(P.muscle) }))}</button>`;
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
            list.innerHTML = html || `<div class="p-10 text-center text-[12px] font-bold text-slate-400">${esc(t('No exercises found'))}</div>`;
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
            const label = 'px-0.5 mb-1.5 text-[12px] font-bold text-slate-400';
            const c = document.getElementById('swapsetup-content');
            c.innerHTML = `<div class="pop-head is-end">
                    <button onclick="window.appActions.closeSwapSetup()" class="w-11 h-11 shrink-0 rounded-full bg-white/5 text-slate-400 flex items-center justify-center tap-feedback" aria-label="${esc(t('Close'))}"><i data-lucide="x" class="w-5 h-5"></i></button>
                </div>
                <div class="px-5">
                <div class="text-[12px] font-bold text-[#d4af37]">${esc(tm(W.muscle))}</div>
                <h3 class="ex-name ex-fit text-[24px] font-black text-white leading-tight mt-0.5 whitespace-nowrap overflow-hidden">${esc(tx(W.name))}</h3>
                <p class="text-[12px] font-bold text-slate-400 mt-1">${t('How many sets and reps for this exercise?')}</p>
                <div class="${label} mt-4">${esc(t('Sets'))}</div>
                <div class="flex items-center gap-3 rounded-2xl bg-white/5 p-2" dir="ltr">
                    <button onclick="window.appActions.swapSetSets(-1)" class="w-11 h-11 rounded-xl bg-white/5 text-2xl font-black text-white tap-feedback" aria-label="−">−</button>
                    <div class="flex-1 text-center text-[22px] font-black text-white tabular-nums num">${esc(W.sets)}</div>
                    <button onclick="window.appActions.swapSetSets(1)" class="w-11 h-11 rounded-xl bg-white/5 text-2xl font-black text-white tap-feedback" aria-label="+">+</button>
                </div>
                <div class="${label} mt-3">${esc(t(isTimed(W.reps) ? 'Seconds per set' : 'Reps per set'))}</div>
                <div class="grid grid-cols-4 gap-2" dir="ltr">${REPS_PRESETS.map(r => `<button onclick="window.appActions.swapSetReps(${jsArg(r)})" class="py-2.5 rounded-xl text-[12px] font-bold tap-feedback ${W.reps === r ? 'bg-[#d4af37] text-black' : 'bg-white/5 text-white'}">${esc(fmtReps(r))}</button>`).join('')}</div>
                <button onclick="window.appActions.swapSetupNext()" class="w-full mt-4 py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-black tap-feedback flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.35)]">${t('Next')}<i data-lucide="${isAR ? 'arrow-left' : 'arrow-right'}" class="w-5 h-5"></i></button>
            </div>`;
            fitNames(c); if (window.lucide) window.lucide.createIcons({ root: c });
        },
        closeSwapSetup: () => { popBack('swapsetup'); window.appState.swapSetup = null; closeModal('swapsetup-overlay', 'swapsetup-box'); },
        swapSetSets: dlt => { const W = window.appState.swapSetup; if (!W) return; W.sets = String(Math.min(10, Math.max(1, (parseInt(W.sets) || 3) + dlt))); window.appActions.renderSwapSetup(); },
        swapSetReps: v => { const W = window.appState.swapSetup; v = latinDigits(String(v)).trim(); if (!W || !v) return; W.reps = v.slice(0, 20); window.appActions.renderSwapSetup(); },
        swapSetupNext: () => {
            const W = window.appState.swapSetup; if (!W) return;
            const d = getActiveSchedule().find(x => x.id === activeDay), ex = d && d.exercises[W.idx];
            if (!ex) return window.appActions.closeSwapSetup();
            const old = { name: ex.name, muscle: ex.muscle, sets: ex.sets, reps: ex.reps }, next = { name: W.name, muscle: W.muscle, sets: W.sets, reps: W.reps };
            window.appActions.showConfirm(t('Change to {name}?', { name: tx(next.name) }), t('{old} will be replaced with {sets} sets of {reps}.', { old: old.name, sets: next.sets, reps: fmtReps(next.reps) + (isTimed(next.reps) && !/s$/i.test(next.reps.trim()) ? 's' : '') }), () => {
                Object.assign(ex, next);
                StorageManager.setPlan(appData);
                window.appActions.closeSwapSetup(); window.appActions.closePicker(); renderWorkout();
                window.appActions.showToast(t('Changed to {name}', { name: tx(next.name) }), 'success', { label: t('Undo'), fn: () => {
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
            if (window.appState.currentView !== tab) dropHint();
            window.appState.inlineEdit = null; window.appState.weekMenu = null; window.appState.todayEdit = false; window.appState.weekEdit = false; window.appState.planDay = null; popBack('planday'); window.appState.currentView = tab;
            const prevTab = document.querySelector('.tab-btn.text-\\[\\#d4af37\\]');
            ['today', 'plan', 'progress', 'profile'].forEach(v => { const b = document.getElementById('tabbtn-' + v); if (b) b.className = `tab-btn py-2.5 flex flex-col items-center gap-1 tap-feedback relative ${v === tab ? 'text-[#d4af37]' : 'text-slate-400'}`; });
            const ic = document.querySelector(`#tabbtn-${tab} svg`);
            if (ic && (!prevTab || prevTab.id !== 'tabbtn-' + tab)) { ic.classList.remove('hop'); void ic.getBoundingClientRect(); ic.classList.add('hop'); }
            document.getElementById('nav-container').style.display = 'none'; // Today and Plan show it inside the day card
            document.getElementById('plan-routines').classList.toggle('hidden', tab !== 'plan');
            document.getElementById('profile-view').classList.toggle('hidden', tab !== 'profile');
            document.getElementById('workout-container').classList.toggle('hidden', tab === 'profile');
            renderNav(); renderWorkout();
            const sc = document.querySelector('.scrollable-content'); if (sc) sc.scrollTop = 0;
            if (tab === 'profile') renderProfile();
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
        // ⋮ menus (a week row, a routine); a tap anywhere outside closes it without pressing what is under it
        toggleWeekMenu: id => window.appActions.toggleMenu('weekMenu', id, renderWorkout),
        toggleRoutineMenu: id => window.appActions.toggleMenu('routineMenu', id, renderSidePanel),
        toggleMenu: (key, id, redraw) => {
            const open = window.appState[key] = window.appState[key] === id ? null : id;
            redraw();
            if (open == null) return;
            const away = e => {
                if (e.target.closest('[role="menu"], [aria-haspopup="menu"]')) return;
                document.removeEventListener('pointerdown', away, true);
                if (window.appState[key] == null) return;
                window.appState[key] = null; e.stopPropagation(); redraw();
                const eat = ev => { ev.stopPropagation(); ev.preventDefault(); };
                document.addEventListener('click', eat, { capture: true, once: true });
                setTimeout(() => document.removeEventListener('click', eat, true), 600);
            };
            setTimeout(() => document.addEventListener('pointerdown', away, true), 0);
        },
        clearDayFrom: id => { activeDay = id; window.appActions.clearDay(); },
        toggleRoutines: (open = !window.appState.routinesOpen) => { window.appState.routinesOpen = open === true; renderSidePanel(); },
        renameWeek: (id, v) => { const w=appData.weeks.find(x=>x.id===id); if(w)w.name=String(v||'').trim().slice(0,40)||t('Unnamed'); StorageManager.setPlan(appData); document.getElementById('active-week-label').innerText=t(appData.weeks.find(x=>x.id===currentWeekId).name); },
        editRoutineName: id => {
            const w = appData.weeks.find(x => x.id === id); if (!w) return;
            openEdit(editHead(t('Rename routine')) + `<form onsubmit="event.preventDefault(); window.appActions.renameWeek(${jsArg(id)}, document.getElementById('edit-routine').value); window.appActions.closeEdit(); window.appActions.toggleRoutines(true)">
                <input id="edit-routine" type="text" maxlength="40" value="${esc(t(w.name))}" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white text-[16px] font-bold outline-none focus:border-white/30" dir="auto" aria-label="${esc(t('Rename routine'))}">
                <button type="submit" class="w-full mt-4 py-4 rounded-xl bg-[#d4af37] text-black text-[14px] font-black tap-feedback">${t('Save')}</button></form>`);
            setTimeout(() => { const i = document.getElementById('edit-routine'); if (i) { i.focus(); i.select(); } }, 320);
        },
        toggleWeekEdit: () => { window.appState.weekEdit = !window.appState.weekEdit; window.appState.weekMenu = null; renderWorkout(); },
        switchWeek: id => { currentWeekId=id; StorageManager.setActiveWeek(id); activeDay=getTodayId(); window.appState.inlineEdit=null; window.appState.planDay=null; renderNav(); renderWorkout(); },
        setActiveDay: id => { window.appState.inlineEdit=null; window.appState.weekMenu=null; if (window.appState.currentView==='today') window.appState.todayEdit=false; else if (window.appState.planDay!=null) window.appState.planDay=id; activeDay=id; renderNav(); renderWorkout(); },
        toggleRpe: v => { StorageManager.setShowRpe(v); window.appActions.showToast(t(v ? 'RPE column on' : 'RPE column off'), 'success'); },
        openBackupModal: () => { openModal('smart-backup-overlay','smart-backup-box'); pushBack('backup', () => window.appActions.closeBackupModal()); },
        closeBackupModal: () => { popBack('backup'); closeModal('smart-backup-overlay','smart-backup-box'); },
        // Export: the phone's share sheet (save to Files, send to a friend, or open in an AI app); "copy" puts the text on the clipboard
        executeSmartBackup: async (mode = 'file') => {
            // everything, in the readable format (v2): easy to share with a friend or give to an AI; old files still import
            const text = JSON.stringify(buildExport({ prog: true, sched: true, sett: true }), null, 2);
            const done = msg => { StorageManager.setBackupDate(); updateBackupStatus(); window.appActions.closeBackupModal(); setTimeout(() => window.appActions.showToast(msg, "success"), 300); };
            if (mode === 'copy') {
                try { await navigator.clipboard.writeText(text); done(t('Copied')); }
                catch (e) { window.appActions.showToast(t('Could not copy. Use Save or share file.'), 'error'); }
                return;
            }
            const n = new Date(), ms = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], dStr = `${ms[n.getMonth()]}${n.getDate()}`;
            const fName = `ApexLift_${dStr}.json`;
            const file = new File([text], fName, { type: 'application/json' });
            if (navigator.canShare && navigator.share && navigator.canShare({ files: [file] })) {
                try { await navigator.share({ files: [file], title: 'Apex Lift' }); return done(t("Data Exported!")); }
                catch (e) { if (e && e.name === 'AbortError') return; } // closed the share sheet: nothing to do
            }
            // no share sheet (computers, older phones): download the file
            const a = document.createElement('a');
            a.href = URL.createObjectURL(file); a.download = fName; a.click();
            setTimeout(() => URL.revokeObjectURL(a.href), 10000);
            done(t("Data Exported!"));
        },
        // Import: everything in an Apex Lift file, no choices. Your current data is saved to your account first,
        // so an import can always be undone (Profile → Account backups).
        importData: e => {
            const f = e.target.files[0]; e.target.value = ''; if (!f) return;
            if (f.size > 5e6) return window.appActions.showToast(t("Invalid Backup file"), "error"); // over 5 MB is not an Apex Lift file
            const r = new FileReader();
            r.onload = ev => {
                let d;
                try {
                    let raw = JSON.parse(ev.target.result);
                    if (!isObj(raw)) throw new Error('Backup is not an object');
                    if (raw.format === 2 || raw.app === 'Apex Lift') raw = fromExportV2(raw);
                    // Clean everything in the file before using it
                    d = {
                        w: raw.w !== undefined ? sanitizeValueMap(raw.w) : undefined,
                        h: sanitizeHistory(raw.h),
                        p: raw.p !== undefined ? sanitizePlan(raw.p) : null,
                        aw: toStr(raw.aw) || null,
                        s: DAY_NAMES.includes(raw.s) ? raw.s : null,
                        rt: REST_CHOICES.includes(raw.rt) ? raw.rt : null,
                        cx: sanitizeCustomEx(raw.cx)
                    };
                    if (!d.w && !d.p && !d.s && !Object.keys(d.h).length) throw new Error('Nothing usable in backup');
                } catch (err) { return window.appActions.showToast(t("Invalid Backup file"), "error"); }
                const found = [d.p ? t('{n} routines', { n: d.p.weeks.length }) : '', Object.keys(d.h).length ? t('{n} exercises with history', { n: Object.keys(d.h).length }) : ''].filter(Boolean).join(' · ');
                window.appActions.showConfirm(t('Import this file?'), (found ? found + '\n\n' : '') + t("Routines and settings will be replaced and workouts added. We back up your current data first."),
                    () => window.appActions.runImport(d), false, t('Import'));
            };
            r.readAsText(f);
        },
        runImport: async d => {
            if (!Cloud.user || !Cloud.db) return window.appActions.showToast(t('Sign in to import. We back up your data first.'), 'error');
            if (window.appState.sess) return window.appActions.showToast(t('Finish your workout first.'), 'error');
            if (window.appState.importing) return; window.appState.importing = true;
            try {
                window.appActions.showToast(t('Backing up your data…'), 'success');
                try { await cloudBackup('before-import'); }
                catch (e) { console.warn('Backup before import failed', e); return window.appActions.showToast(t('Backup failed, so nothing was imported. Check your connection.'), 'error'); }
                // workouts: both lists together, in date order, without duplicates (and without records you deleted)
                const w = StorageManager.get(), h = StorageManager.getHistory(), del = getDeleted();
                Object.keys(d.h).forEach(k => { h[k] = mergeLogs(h[k], d.h[k], del[k]); const n = h[k][h[k].length - 1]; if (n) w[k] = n.w; });
                if (d.w) Object.keys(d.w).forEach(k => { if (!w[k]) w[k] = d.w[k]; });
                StorageManager.set(w); StorageManager.setHistory(h); loggedWeights = w;
                if (d.p) {
                    // Only use the saved active routine if it really exists in the file
                    currentWeekId = (d.aw && d.p.weeks.some(x => x.id === d.aw)) ? d.aw : d.p.weeks[0].id;
                    appData = d.p; StorageManager.setActiveWeek(currentWeekId);
                    // the file's own exercises join this phone's list
                    const cx = getCustomEx(); (d.cx || []).forEach(x => { if (!cx.some(y => y.name.toLowerCase() === x.name.toLowerCase())) cx.push(x); }); setCustomEx(cx);
                }
                if (d.rt) { StorageManager.setRestSeconds(d.rt); const rs = document.getElementById('setting-rest'); if (rs) rs.value = String(d.rt); }
                // each day stays on its weekday (the file's first day of the week, or this phone's)
                setWeekStart(d.s || StorageManager.getStartDay());
                const sd = document.getElementById('setting-start-day'); if (sd) sd.value = StorageManager.getStartDay();
                if (StorageManager.setPlan(appData) === false) return;
                activeDay = getTodayId(); renderNav(); window.appActions.refreshUI();
                window.appActions.showToast(t('Imported. Your old data is in Account backups.'), 'success');
            } finally { window.appState.importing = false; }
        },
    restoreDefaults: () => { window.appActions.showConfirm(t("Reset app"),t("Your routines go back to the default. Your history is kept."),()=>{const aD=DAY_NAMES, sI=aD.indexOf('SAT'); const def=JSON.parse(JSON.stringify(defaultWorkoutData)); def.forEach((d,i)=>d.day=aD[(sI+i)%7]); appData={weeks:[{id:'w_default',name:t('Main Routine'),schedule:def}]}; currentWeekId='w_default'; StorageManager.setActiveWeek('w_default'); StorageManager.setPlan(appData); StorageManager.setStartDay('SAT'); document.getElementById('setting-start-day').value='SAT'; activeDay=getTodayId(); renderNav(); window.appActions.refreshUI(); window.appActions.showToast(t("Reset Complete"));},true); },
        // ---------- First-launch setup (also from Profile → Set up again) ----------
        // 🧭 SETUP, one question per screen, nothing can be skipped.
        //   'first'    first launch: your profile (sex, date of birth, height and weight), then your training, then the program
        //   'complete' set up before but some answers are missing (older versions): only those questions
        initOnboarding: () => {
            const W = window.appState.wiz;
            if (W && !W.done && document.getElementById('onboarding-overlay').classList.contains('flex')) return; // already open
            if (!StorageManager.getOnboard()) return window.appActions.startWizard('first');
            if (setupMissing().length) window.appActions.startWizard('complete');
        },
        startWizard: (mode = 'first') => {
            let hasLang = false; try { hasLang = localStorage.getItem(LANG_KEY) !== null; } catch (e) {}
            const pr = getProfile(), b = getBody();
            const steps = mode === 'first' ? [...(hasLang ? [] : ['lang']), ...PROFILE_STEPS.filter(k => !(b.locked && setupAnswered(k))), ...TRAINING_STEPS, 'start', 'result']
                : setupMissing();
            window.appState.wiz = { mode, firstRun: true, steps, step: 0, showAll: false,
                goal: pr.goal || null, days: pr.days || null, exp: EXP_LEVELS.includes(pr.exp) ? pr.exp : null, eq: pr.eq || null,
                session: pr.session || null };
            window.appActions.renderWizard();
            openModal('onboarding-overlay', 'onboarding-box');
            // phone Back: the previous question; on the first one it closes only when that's allowed
            const onBack = () => {
                const W = window.appState.wiz;
                if (W && W.step > 0) { window.appActions.wizBack(); pushBack('wizard', onBack); }
                else if (W && !W.firstRun) closeModal('onboarding-overlay', 'onboarding-box', 300);
                else pushBack('wizard', onBack);
            };
            pushBack('wizard', onBack);
        },
        renderWizard: () => {
            const W = window.appState.wiz, key = W.steps[W.step], b = getBody();
            // how far the setup got (for the admin page), until it is finished
            try { const sv = localStorage.getItem(SETUP_KEY); if (!sv || sv.startsWith('left:')) localStorage.setItem(SETUP_KEY, 'left:' + key); } catch (e) {}
            const opt = (val, title, sub, icon, cur) => `<button onclick="window.appActions.wizChoose(${jsArg(key)}, ${jsArg(val)})" class="w-full flex items-center gap-4 p-4 mb-3 rounded-2xl border text-start tap-feedback ${cur === val ? 'bg-[#d4af37]/15 border-[#d4af37]' : 'bg-white/5 border-white/10'}">
                ${icon ? `<span class="w-11 h-11 shrink-0 rounded-xl bg-black/40 flex items-center justify-center text-[#d4af37]"><i data-lucide="${icon}" class="w-5 h-5"></i></span>` : ''}
                <span class="flex-1 min-w-0"><span class="block text-[16px] font-black text-white">${title}</span>${sub ? `<span class="block text-[12px] font-bold text-slate-400 mt-0.5">${sub}</span>` : ''}</span>
                <i data-lucide="chevron-right" class="w-5 h-5 text-slate-600 shrink-0"></i></button>`;
            const part = PROFILE_STEPS.includes(key) ? t('Your profile') : TRAINING_STEPS.includes(key) || key === 'start' ? t('Your training') : key === 'result' ? t('Your program') : '';
            const head = (title, sub) => `${part ? `<div class="text-[12px] font-bold text-[#d4af37] mb-2">${part}</div>` : ''}<h2 class="text-[26px] font-black text-white leading-tight mb-2">${title}</h2>${sub ? `<p class="text-[13px] font-bold text-slate-400 mb-6">${sub}</p>` : '<div class="mb-6"></div>'}`;
            const next = (id, label = t('Next')) => `<button id="${id}" onclick="window.appActions.wizChoose(${jsArg(key)}, 'next')" class="w-full mt-6 py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-black tap-feedback">${label}</button>`;
            const lastLabel = W.step === W.steps.length - 1 && W.mode === 'complete' ? t('Done') : t('Next');
            const big = 'w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 text-white text-[22px] font-black outline-none focus:border-[#d4af37] num';
            const lockNote = `<p class="flex items-center gap-1.5 text-[12px] font-bold text-slate-400 mt-4"><i data-lucide="lock" class="w-3.5 h-3.5 shrink-0"></i>${t("Date of birth, sex and height can't be changed after setup.")}</p>`;
            let body = '';
            if (key === 'lang') body = `<div class="text-center mb-8 mt-6"><div class="text-4xl font-black italic tracking-tighter text-white logo-mark" dir="ltr">APEX <span class="text-[#d4af37]">LIFT</span></div></div>` + head('Choose your language · اختر لغتك', '') + opt('en', 'English', '', 'languages', LANG) + opt('ar', 'العربية', '', 'languages', LANG);
            if (key === 'sex') body = head(t("What's your sex?"), t('Helps pick the right program for you.')) + opt('male', t('Male'), '', 'user-round', b.sex) + opt('female', t('Female'), '', 'user-round', b.sex) + lockNote;
            if (key === 'birth') {
                const n = new Date(), iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                const max = iso(new Date(n.getFullYear() - MIN_AGE, n.getMonth(), n.getDate())), min = iso(new Date(n.getFullYear() - 100, 0, 1));
                body = head(t('When were you born?'), t('Apex Lift is for ages {n} and up.', { n: MIN_AGE }))
                    + `<input id="wiz-birth" type="date" min="${min}" max="${max}" value="${esc(b.birthDate || '')}" class="${big}" dir="ltr" aria-label="${esc(t('Date of birth'))}">` + lockNote + next('wiz-birth-next', lastLabel);
            }
            if (key === 'body') {
                const hLocked = !!(b.locked && b.heightCm);
                const unit = (id, label, val, u, mode, dis) => `<label class="block flex-1 min-w-0"><span class="block text-[12px] font-bold text-slate-400 mb-1.5">${label}</span>
                    <span class="relative block"><input id="${id}" type="text" inputmode="${mode}" autocomplete="off" value="${val === undefined ? '' : esc(val)}" ${dis ? 'disabled' : ''} class="${big} pe-14 ${dis ? 'opacity-60' : ''}" dir="ltr">
                    <span class="absolute inset-y-0 end-0 pe-4 flex items-center text-[14px] font-bold text-slate-400 pointer-events-none" dir="ltr">${u}</span></span></label>`;
                body = head(t('Height and weight'), t('Starts your body weight chart and BMI in Progress.'))
                    + `<div class="flex gap-3">${unit('wiz-height', t('Height'), b.heightCm, 'cm', 'numeric', hLocked)}${unit('wiz-weight', t('Weight'), b.weightKg, 'kg', 'decimal', false)}</div>` + lockNote + next('wiz-body-next', lastLabel);
            }
            if (key === 'goal') body = head(t("What's your main goal?"), '')
                + opt('muscle', t('Build muscle'), t('Get bigger and more defined'), 'dumbbell', W.goal) + opt('strength', t('Get stronger'), t('Lift heavier on the big lifts'), 'trophy', W.goal) + opt('fat', t('Lose fat'), t('Stay strong while you lean out'), 'flame', W.goal);
            if (key === 'exp') body = head(t('How long have you been training?'), '')
                + opt('none', t("I'm just starting"), t('Never trained, or back after a long break'), 'sparkles', W.exp)
                + opt('new', t('Less than 1 year'), '', 'sprout', W.exp) + opt('mid', t('1 to 3 years'), '', 'trending-up', W.exp)
                + opt('adv', t('3 to 5 years'), '', 'flame', W.exp) + opt('pro', t('More than 5 years'), '', 'trophy', W.exp);
            if (key === 'days') body = head(t('How many days a week can you train?'), t('Pick what you can keep up every week.'))
                + ['3', '4', '5', '6'].map(d => opt(d, t('{n} days', { n: d }), '', 'calendar-days', W.days)).join('');
            if (key === 'session') body = head(t('How long is each workout?'), t('Shorter workouts get fewer exercises a day.'))
                + SESSION_OPTS.map(m => opt(m, t(m === '90' ? '90+ minutes' : '{n} minutes', { n: m }), '', 'timer', W.session)).join('');
            if (key === 'eq') body = head(t('Where do you train?'), '')
                + opt('gym', t('Full gym'), t('Barbells, machines and cables'), 'building-2', W.eq) + opt('db', t('Dumbbells only'), t('Home or a small gym'), 'dumbbell', W.eq);
            if (key === 'start') body = head(t('Which day does your week start?'), '')
                + ['SAT', 'SUN', 'MON'].map(d => opt(d, esc(dayLong(d)), '', 'calendar', StorageManager.getStartDay())).join('');
            if (key === 'result') {
                const rec = PROGRAMS.find(p => p.id === recommendProgram({ ...W, sex: getBody().sex })), pick = PROGRAMS.find(p => p.id === (W.pick || rec.id));
                const card = (p, isRec) => `<button onclick="window.appActions.wizPick(${jsArg(p.id)})" class="w-full text-start p-4 mb-3 rounded-2xl border tap-feedback ${pick.id === p.id ? 'bg-[#d4af37]/10 border-[#d4af37]' : 'bg-white/5 border-white/10'}">
                    <span class="flex items-center justify-between gap-2"><span class="text-[16px] font-black text-white">${esc(t(p.name))}</span><span class="text-[12px] font-bold text-slate-400 shrink-0">${t('{n} days', { n: p.days })}</span></span>
                    ${isRec ? `<span class="inline-block mt-1 text-[12px] font-bold text-[#22c55e]">★ ${t('Recommended for you')}</span>` : ''}
                    <span class="block text-[12px] font-bold text-slate-400 mt-1">${esc(t(p.desc))}</span>${pick.id === p.id ? programPreviewHTML(p) : ''}</button>`;
                // the program made for you, or an empty week to fill in yourself
                body = head(t('Your program'), t('Tap a program to see its week.')) + card(rec, true)
                    + `<button onclick="window.appActions.wizFinish('own')" class="w-full py-3.5 mb-3 rounded-xl bg-white/5 border border-white/10 text-[13px] font-bold text-white tap-feedback flex items-center justify-center gap-2"><i data-lucide="pencil-ruler" class="w-4 h-4 text-slate-400"></i>${t("I'll build my own")}</button>`
                    + `<div class="sticky bottom-0 pt-3 pb-1 bg-[#050505]"><button onclick="window.appActions.wizFinish('program')" class="w-full py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-black tap-feedback">${t('Start with this program')}</button>
                       <p class="text-[12px] font-bold text-slate-400 text-center mt-2">${t('You can change any day or exercise later in Plan.')}</p></div>`;
            }
            const dots = W.steps.map((_, i) => `<span class="h-1.5 rounded-full transition-all ${i === W.step ? 'w-6 bg-[#d4af37]' : i < W.step ? 'w-3 bg-[#d4af37]/50' : 'w-3 bg-white/15'}"></span>`).join('');
            document.getElementById('onboarding-box').innerHTML = `
                <div class="flex items-center justify-between py-4 shrink-0">
                    <button onclick="window.appActions.wizBack()" class="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center text-slate-300 tap-feedback ${W.step === 0 ? 'invisible' : ''}" aria-label="${esc(t('Back'))}"><i data-lucide="arrow-left" class="w-5 h-5"></i></button>
                    <div class="flex gap-1.5 flex-wrap justify-center max-w-[70%]" dir="ltr">${dots}</div>
                    <button onclick="window.appActions.closeWizard()" class="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center text-slate-300 tap-feedback ${W.firstRun ? 'invisible' : ''}" aria-label="${esc(t('Close'))}"><i data-lucide="x" class="w-5 h-5"></i></button>
                </div>
                <div class="flex-1 fade-in">${body}</div>`;
            if (window.lucide) window.lucide.createIcons({ root: document.getElementById('onboarding-box') });
            document.getElementById('onboarding-box').scrollTop = 0;
        },
        wizChoose: (key, val) => {
            const W = window.appState.wiz, err = m => window.appActions.showToast(m, 'error');
            if (key === 'lang') {
                writeItem(LANG_KEY, val);
                if (val !== LANG) return location.reload(); // the setup starts again in the chosen language
            } else if (key === 'sex') setBody({ ...getBody(), sex: val });
            else if (key === 'birth') {
                const v = (document.getElementById('wiz-birth') || {}).value || '', b = getBody();
                if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return err(t('Enter your date of birth.'));
                const age = ageOf({ birthDate: v });
                if (age < MIN_AGE) return err(t('Apex Lift is for ages {n} and up.', { n: MIN_AGE }));
                if (age > 100) return err(t('Check your date of birth.'));
                if (b.locked && b.birthYear && +v.slice(0, 4) !== b.birthYear) return err(t('This has to match the birth year on your profile ({y}).', { y: b.birthYear }));
                setBody({ ...b, birthDate: v });
            } else if (key === 'body') {
                const b = getBody(), num = id => parseFloat(latinDigits((document.getElementById(id) || {}).value || '').replace(/[٫،,]/g, '.'));
                const h = b.locked && b.heightCm ? b.heightCm : num('wiz-height'), w = num('wiz-weight');
                if (!(h >= 100 && h <= 250)) return err(t('Enter your height in cm (100–250).'));
                if (!(w >= 25 && w <= 350)) return err(t('Enter your weight in kg (25–350).'));
                const log = (b.log || []).filter(x => dateKey(x.t) !== dateKey()); log.push({ t: Date.now(), kg: w });
                setBody({ ...b, heightCm: Math.round(h), weightKg: Math.round(w * 10) / 10, log });
            } else if (key === 'start') {
                setWeekStart(val);
                const sel = document.getElementById('setting-start-day'); if (sel) sel.value = val;
                activeDay = getTodayId();
            } else W[key] = val;
            W.pick = null;
            if (W.step >= W.steps.length - 1 && W.mode === 'complete') return window.appActions.wizFinish('complete');
            W.step = Math.min(W.step + 1, W.steps.length - 1);
            window.appActions.renderWizard();
        },
        wizBack: () => { const W = window.appState.wiz; if (W.step > 0) { W.step--; window.appActions.renderWizard(); } },
        wizPick: id => { window.appState.wiz.pick = id; window.appActions.renderWizard(); },
        // ✕ (only for Update training): close, nothing changes. force = close a required setup (done, or another phone finished it)
        closeWizard: (force = false) => {
            const W = window.appState.wiz; if (!W || (W.firstRun && !force)) return;
            popBack('wizard'); closeModal('onboarding-overlay', 'onboarding-box', 300);
        },
        // the setup always ends with the chosen program
        wizFinish: (mode, sure = false) => {
            const W = window.appState.wiz;
            if (W.done) return; // double tap
            // the training answers are kept, and the profile is locked once it is complete
            const saveAnswers = () => {
                const keep = getProfile();
                writeItem(PROFILE_KEY, JSON.stringify(sanitizeProfile({ ...keep, goal: W.goal, days: W.days, exp: W.exp, eq: W.eq, session: W.session })));
                const b = getBody(); if (PROFILE_STEPS.every(k => setupAnswered(k, b)) && !b.locked) setBody({ ...b, locked: true });
            };
            if (mode === 'complete') {
                W.done = true; saveAnswers(); StorageManager.setOnboard();
                window.appActions.closeWizard(true);
                if (window.appState.currentView === 'profile') renderProfile();
                return window.appActions.showToast(t('Profile updated'), 'success');
            }
            if (mode !== 'program' && mode !== 'own') return;
            // already 5 routines: the current one would be replaced, so ask first
            if (!sure && !W.firstRun && appData.weeks.length >= 5)
                return window.appActions.showConfirm(t('Replace current routine?'), t('You have 5 routines (the most). The current one will be replaced; your history is kept.'), () => window.appActions.wizFinish(mode, true), true);
            W.done = true;
            try { localStorage.setItem(SETUP_KEY, mode); } catch (e) {}
            saveAnswers();
            StorageManager.setOnboard();
            popBack('wizard');
            closeModal('onboarding-overlay', 'onboarding-box', 300);
            if (mode === 'own') {
                // an empty week (every day empty), then Plan to fill it in
                const start = DAY_NAMES.indexOf(StorageManager.getStartDay());
                const empty = Array.from({ length: 7 }, (_, i) => ({ id: i + 1, day: DAY_NAMES[(start + i) % 7], title: 'New Day', isRest: false, recoveryType: null, exercises: [] }));
                putRoutine(t('My routine'), empty, { replace: W.firstRun });
                return window.appActions.switchTab('plan');
            }
            window.appActions.applyProgram(W.pick || recommendProgram({ ...W, sex: getBody().sex }), { exp: W.exp, replace: W.firstRun });
        },
        // Put a program into the app: as a new routine (keeps your current one) or replacing the current one
        applyProgram: (id, { exp = (getProfile().exp || 'mid'), replace = false, undo = false } = {}) => {
            const prog = PROGRAMS.find(p => p.id === id); if (!prog) return;
            if (window.appState.programBusy === id) return; // double tap: add it only once
            window.appState.programBusy = id; setTimeout(() => { if (window.appState.programBusy === id) window.appState.programBusy = null; }, 1000);
            putRoutine(t(prog.name), programSchedule(prog, exp), { replace, undo });
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
                list.innerHTML = `<button onclick="window.appActions.closePrograms(); setTimeout(window.appActions.openAI, 320)" class="w-[calc(100%-2rem)] mx-4 mb-3 p-4 rounded-2xl border bg-white/5 border-white/10 text-start tap-feedback flex items-center gap-3">
                    <span class="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-[#d4af37] shrink-0"><i data-lucide="sparkles" class="w-5 h-5"></i></span>
                    <span class="flex-1 min-w-0"><span class="block text-[16px] font-black text-white">${t('Build with Apex Coach')}</span><span class="block text-[12px] font-bold text-slate-400 mt-1">${t('Tell it what you want: it builds a program from your answers and workouts.')}</span></span>
                    <i data-lucide="${isAR ? 'chevron-left' : 'chevron-right'}" class="w-5 h-5 text-slate-400 shrink-0"></i>
                </button>` + PROGRAMS.map(p => `<button onclick="window.appActions.previewProgram(${jsArg(p.id)})" class="w-[calc(100%-2rem)] mx-4 mb-3 p-4 rounded-2xl border bg-white/5 border-white/10 text-start tap-feedback flex items-center gap-3">
                    <span class="flex-1 min-w-0">
                        <span class="flex items-center justify-between gap-2"><span class="text-[16px] font-black text-white">${esc(t(p.name))}</span><span class="text-[12px] font-bold text-slate-400 shrink-0">${t('{n} days', { n: p.days })}${p.eq === 'db' ? ' · ' + t('Dumbbells only') : ''}</span></span>
                        <span class="block text-[12px] font-bold text-slate-400 mt-1">${esc(t(p.desc))}</span>
                        ${programPreviewHTML(p)}
                    </span>
                    <i data-lucide="${isAR ? 'chevron-left' : 'chevron-right'}" class="w-5 h-5 text-slate-400 shrink-0"></i>
                </button>`).join('') + `<p class="mx-6 mb-6 text-[12px] font-bold text-slate-400">${t('Your current routine and all your history are kept.')}</p>`;
            } else {
                const exp = window.appState.progExp || 'mid', sched = programSchedule(pick, exp), full = appData.weeks.length >= 5;
                const lvl = (v, l) => `<button onclick="window.appActions.setProgramLevel(${jsArg(v)})" class="flex-1 py-2 rounded-xl text-[12px] font-bold tap-feedback ${exp === v ? 'bg-[#d4af37] text-black' : 'bg-white/5 text-slate-300'}">${t(l)}</button>`;
                list.innerHTML = `<div class="px-4 pb-4">
                    <button onclick="window.appActions.previewProgram(null)" class="flex items-center gap-1 mb-3 text-[12px] font-bold text-slate-400 tap-feedback"><i data-lucide="${isAR ? 'chevron-right' : 'chevron-left'}" class="w-4 h-4"></i>${t('All programs')}</button>
                    <h2 class="text-[24px] font-black text-white leading-tight">${esc(t(pick.name))}</h2>
                    <p class="text-[13px] font-bold text-slate-400 mt-1">${esc(t(pick.desc))}</p>
                    <div class="text-[12px] font-bold text-slate-300 mt-2">${t('{n} training days', { n: pick.days })} · ${pick.eq === 'db' ? t('Dumbbells only') : t('Full gym')}</div>
                    ${programPreviewHTML(pick)}
                    <div class="mt-4 mb-1.5 px-0.5 text-[12px] font-bold text-slate-400">${t('Level')}</div>
                    <div class="flex gap-2 mb-4">${lvl('new', 'Beginner')}${lvl('mid', 'Intermediate')}${lvl('adv', 'Advanced')}</div>
                    <div class="space-y-2">${sched.map(programDayCardHTML).join('')}</div>
                </div>
                <div class="sticky bottom-0 bg-[#111] border-t border-white/10 px-4 pt-3" style="padding-bottom: max(1rem, env(safe-area-inset-bottom));">
                    <p class="text-[12px] font-bold text-slate-400 mb-2 text-center">${full ? t('It replaces your current routine. Your history is kept.') : t('It is added as a new routine. Your current routine and history are kept.')}</p>
                    <button onclick="window.appActions.useProgram(${jsArg(pick.id)})" class="w-full py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-black tap-feedback flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.35)]"><i data-lucide="check" class="w-5 h-5"></i>${t('Use this program')}</button>
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

    // 🤖 AI COACH: a chat with Google Gemini that builds a routine from your training answers, routine and workout history.
    // Gemini is reached through Firebase AI Logic, so there is no Gemini key in the app (it stays at Google) and it stays free (Spark).
    // Firebase setup (once): Firebase console → AI Logic → Get started → Gemini Developer API.
    // Against misuse: App Check with Fraud Defense (reCAPTCHA Enterprise): the key ID is in AI_APP_CHECK_KEY (Google Cloud → Fraud Defense → Keys),
    // registered in Firebase → App Check → Apps. Then App Check → APIs → Firebase AI Logic → Enforce.
    // Gemini may only name exercises from the library; the app checks the routine (7 days, known exercises, sensible sets) before
    // it can be used. The chat is kept on this phone only. Its Firebase files are only downloaded when the coach is opened.
    // tried in this order for every question: the next one only when Google fails (busy, server error) or has retired the model
    const AI_MODELS = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3-flash-preview', 'gemini-2.5-flash'];
    const AI_APP_CHECK_KEY = '6LdWE_0tAAAAAJvI8b37jqVxj9-0aACe2WFj_VDJ'; // Fraud Defense key ID (not secret). Empty = no App Check
    const AI_CHAT_KEY = 'workoutAiChat_rakan_final', AI_OK_KEY = 'workoutAiOk_rakan_final', AI_COUNT_KEY = 'workoutAiCount_rakan_final';
    // what the coach remembers about you (injuries, likes, schedule...): short notes it writes itself, kept on this phone after "New chat"
    const AI_MEM_KEY = 'workoutAiMemory_rakan_final';
    const getAiMemory = () => { const v = readJSON(AI_MEM_KEY, []); return Array.isArray(v) ? v.filter(x => typeof x === 'string' && x.trim()).map(x => x.trim().slice(0, 160)).slice(0, 20) : []; };
    const AI_DAILY = 40; // questions a day on one phone, so one person can't use up the free quota
    const AI_KEEP = 30, AI_CONTEXT = 10; // messages kept on the phone / sent with each question
    const AI = { loading: null, gone: new Set(), noThink: new Set(), busy: false, open: -1 }; // gone: models Google said don't exist (this visit)
    const loadAI = () => AI.loading || (AI.loading = (async () => {
        const [fbApp, fbAI] = await Promise.all([import('./' + FB_DIR + 'firebase-app.js'), import('./' + FB_DIR + 'firebase-ai.js')]);
        // its own Firebase app (the modular files can't share the sign-in's compat app), same project
        const app = fbApp.getApps().find(a => a.name === 'apex-ai') || fbApp.initializeApp(FIREBASE_CONFIG, 'apex-ai');
        if (AI_APP_CHECK_KEY) {
            const ac = await import('./' + FB_DIR + 'firebase-app-check.js');
            try { ac.initializeAppCheck(app, { provider: new ac.ReCaptchaEnterpriseProvider(AI_APP_CHECK_KEY), isTokenAutoRefreshEnabled: true }); } catch (e) { console.warn('App Check', e); }
        }
        return { fbAI, ai: fbAI.getAI(app, { backend: new fbAI.GoogleAIBackend() }) };
    })().catch(e => { AI.loading = null; throw e; }));

    const sanitizeAiChat = raw => (Array.isArray(raw) ? raw : []).filter(m => isObj(m) && (m.r === 'u' || m.r === 'm') && typeof m.x === 'string')
        .map(m => ({ r: m.r, x: m.x.slice(0, 3000), ...(isObj(m.rt) && Array.isArray(m.rt.schedule) ? { rt: m.rt } : {}), ...(m.used ? { used: true } : {}), ...(m.err ? { err: true } : {}), ...(Array.isArray(m.ch) && m.ch.length ? { ch: m.ch.filter(c => typeof c === 'string' && c.trim()).slice(0, 6).map(c => c.trim().slice(0, 60)) } : {}) })).slice(-AI_KEEP);
    const AI_ERRS = ['Apex Coach is busy right now. Try again in a minute.', 'Apex Coach is not ready yet. Try again later.', 'Apex Coach could not answer. Try again.', 'No internet connection. Try again when online.',
        'The AI coach is busy right now. Try again in a minute.', 'The AI coach is not ready yet. Try again later.', 'The AI coach could not answer. Try again.'];
    const getAiChat = () => sanitizeAiChat(readJSON(AI_CHAT_KEY, [])).map(m => m.r === 'm' && !m.err && !m.rt && AI_ERRS.some(e => m.x.startsWith(e) || m.x.startsWith(t(e))) ? { ...m, err: true } : m);
    const setAiChat = list => writeItem(AI_CHAT_KEY, JSON.stringify(sanitizeAiChat(list)));
    const aiCount = () => { const v = readJSON(AI_COUNT_KEY, null); return isObj(v) && v.d === dateKey() ? (parseInt(v.n) || 0) : 0; };
    const aiCountUp = () => writeItem(AI_COUNT_KEY, JSON.stringify({ d: dateKey(), n: aiCount() + 1 }));

    // The answer is always JSON: { reply, routine? } (routine = 7 days starting on the user's first day of the week)
    const aiSchema = S => S.object({
        properties: {
            reply: S.string(),
            routine: S.object({ properties: {
                edit: S.boolean(),
                name: S.string(),
                days: S.array({ items: S.object({ properties: {
                    title: S.string(), rest: S.boolean(),
                    exercises: S.array({ items: S.object({ properties: { name: S.string(), sets: S.integer(), reps: S.string() } }) })
                } }) })
            }, optionalProperties: ['edit'] }),
            choices: S.array({ items: S.string() }),
            memory: S.array({ items: S.string() })
        },
        optionalProperties: ['routine', 'choices', 'memory']
    });
    // routine in the app's format ↔ the short format Gemini reads and writes
    const routineToAi = rt => ({ name: rt.name, days: rt.schedule.map(d => ({ title: d.isRest ? (d.recoveryType === 'active' ? 'Active Rest' : 'Complete Rest') : d.title, rest: !!d.isRest, exercises: d.exercises.map(e => ({ name: e.name, sets: parseInt(e.sets) || 3, reps: e.reps })) })) });
    const aiActive = () => appData.weeks.find(w => w.id === currentWeekId) || appData.weeks[0];
    const routineFromAi = raw => {
        if (!isObj(raw) || !Array.isArray(raw.days) || raw.days.length !== 7) return null;
        const orig = raw.edit === true ? aiActive() : null;
        const known = new Map(); catalogue().forEach(x => { const k = x.name.trim().toLowerCase(); if (!known.has(k)) known.set(k, x); });
        const start = DAY_NAMES.indexOf(StorageManager.getStartDay()), baseDays = orig ? orig.schedule : [];
        const schedule = raw.days.map((d, i) => {
            d = isObj(d) ? d : {};
            const base = { id: i + 1, day: DAY_NAMES[(start + i) % 7], savedTitle: '' };
            if (baseDays[i]) { base.id = baseDays[i].id; base.day = baseDays[i].day; }
            // only exercises from the library (or your own), each once a day
            const seen = new Set(), exercises = (Array.isArray(d.exercises) ? d.exercises : []).filter(isObj).map(ex => {
                const hit = known.get(toStr(ex.name).trim().toLowerCase()); if (!hit || seen.has(hit.name)) return null; seen.add(hit.name);
                const reps = latinDigits(cut(ex.reps, 20)).trim();
                const kept = baseDays[i] && (baseDays[i].exercises || []).find(e => e.name === hit.name); // unchanged exercises keep their muscle
                return { muscle: kept ? kept.muscle : hit.muscle, name: hit.name, sets: String(Math.min(8, Math.max(1, parseInt(latinDigits(ex.sets)) || 3))), reps: /\d/.test(reps) ? reps : newExercise(hit.name, hit.muscle).reps };
            }).filter(Boolean).slice(0, 12);
            if (d.rest === true || !exercises.length) {
                const active = /active|نشط/i.test(toStr(d.title));
                return { ...base, title: active ? 'Active Rest' : 'Complete Rest', isRest: true, recoveryType: active ? 'active' : 'complete', exercises: [] };
            }
            const title = cut(toStr(d.title).trim(), 40) || 'Workout';
            return { ...base, title, savedTitle: title, isRest: false, recoveryType: null, exercises };
        });
        if (!schedule.some(d => !d.isRest)) return null;
        // a change to their routine keeps its name, and lists what changes
        return orig ? { name: orig.name, schedule, edit: orig.id, chg: aiChanges(orig.schedule, schedule) } : { name: cut(toStr(raw.name).trim(), 60) || t('Apex Coach program'), schedule };
    };
    // What a change does, day by day: exercises added, removed, or with other sets/reps; a day that becomes rest or training
    const aiChanges = (before, after) => after.map((d, i) => {
        const b = before[i] || { exercises: [], isRest: true }, old = new Map(b.exercises.map(e => [e.name, e])), now = new Set(d.exercises.map(e => e.name));
        const c = { day: d.day, title: d.isRest ? '' : d.title,
            add: d.exercises.filter(e => !old.has(e.name)).map(e => [e.name, e.sets, e.reps]),
            del: b.exercises.filter(e => !now.has(e.name)).map(e => e.name),
            mod: d.exercises.filter(e => old.has(e.name) && (old.get(e.name).sets !== e.sets || old.get(e.name).reps !== e.reps)).map(e => [e.name, e.sets, e.reps]),
            rest: !!d.isRest !== !!b.isRest ? (d.isRest ? 'rest' : 'train') : '' };
        return c.add.length || c.del.length || c.mod.length || c.rest ? c : null;
    }).filter(Boolean);
    const aiChangesHTML = chg => !chg.length ? `<p class="text-[13px] font-bold text-slate-400 mt-3">${t('No changes to your routine.')}</p>`
        : `<div class="mt-3 space-y-2"><div class="text-[12px] font-bold text-slate-400">${t('What changes')}</div>${chg.map(c => `<div class="rounded-xl bg-white/5 px-3 py-2.5">
            <div class="text-[13px] font-black text-white">${esc(dayLong(c.day))}${c.title ? ' · ' + esc(t(c.title)) : ''}</div>
            ${c.rest ? `<div class="text-[13px] font-bold text-slate-300 mt-1">${t(c.rest === 'rest' ? 'Becomes a rest day' : 'Becomes a training day')}</div>` : ''}
            ${c.del.map(n => `<div class="text-[13px] font-bold text-slate-400 mt-1 flex gap-2"><span aria-hidden="true">−</span><span class="line-through">${esc(tx(n))}</span></div>`).join('')}
            ${c.add.map(([n, se, r]) => `<div class="text-[13px] font-bold text-slate-200 mt-1 flex gap-2"><span class="text-[#22c55e]" aria-hidden="true">+</span><span class="flex-1 min-w-0">${esc(tx(n))}</span><span dir="ltr" class="shrink-0">${esc(se)} × ${esc(fmtReps(r))}</span></div>`).join('')}
            ${c.mod.map(([n, se, r]) => `<div class="text-[13px] font-bold text-slate-300 mt-1 flex gap-2"><span aria-hidden="true">•</span><span class="flex-1 min-w-0">${esc(tx(n))}</span><span dir="ltr" class="shrink-0">${esc(se)} × ${esc(fmtReps(r))}</span></div>`).join('')}
        </div>`).join('')}</div>`;

    // What Gemini knows about you: the setup answers, your active routine and a summary of the last 8 weeks
    const aiContext = () => {
        const pr = getProfile(), b = getBody(), age = ageOf(b), lines = [];
        const GOAL = { muscle: 'build muscle', strength: 'get stronger', fat: 'lose fat' }, EXP = { none: 'never trained', new: 'under 1 year', mid: '1-3 years', adv: '3-5 years', pro: 'over 5 years' };
        lines.push(`- Goal: ${GOAL[pr.goal] || 'not set'}. Experience: ${EXP[pr.exp] || 'not set'}. Training days a week: ${pr.days || 'not set'}. Workout length: ${pr.session ? pr.session + ' minutes' : 'not set'}. Equipment: ${pr.eq === 'db' ? 'dumbbells only (plus bodyweight)' : pr.eq === 'gym' ? 'full gym' : 'not set'}.`);
        lines.push(`- Sex: ${b.sex === 'male' ? 'male' : b.sex === 'female' ? 'female' : 'not given'}. Age: ${age || 'not given'}. Body weight: ${b.weightKg ? b.weightKg + ' kg' : 'not given'}.`);
        const active = aiActive();
        // exactly as the app stores it, so a small change can copy the rest unchanged
        if (active) lines.push(`- Current routine (the active one${appData.weeks.length > 1 ? `, of ${appData.weeks.length} routines` : ''}): ${JSON.stringify(routineToAi(active))}`);
        const mem = getAiMemory(); if (mem.length) lines.push(`- What you remember about them from earlier chats:\n  ` + mem.join('\n  '));
        const h = StorageManager.getHistory(), since = Date.now() - 56 * 864e5, map = {};
        appData.weeks.forEach(w => w.schedule.forEach(d => d.exercises.forEach(e => { map[getExKey(0, 0, 0, e.name)] = e; })));
        const rows = Object.keys(h).map(k => {
            const logs = (h[k] || []).filter(l => { const tt = logTime(l); return !isNaN(tt) && tt >= since; });
            if (!logs.length) return null;
            const last = logs[logs.length - 1], sets = logs.flatMap(logSetDetails), best = sets.reduce((a, s) => (!a || s.w > a.w || (s.w === a.w && s.r > a.r)) ? s : a, null);
            const top = l => { const s = logSetDetails(l); return s.length ? `${s[0].w ? s[0].w + 'kg x ' : ''}${s.map(x => x.r).join('/')}` : ''; };
            const e1 = l => Math.round(Math.max(0, ...logSetDetails(l).map(e1rmOf))), a = e1(logs[0]), z = e1(last);
            return { n: logs.length, text: `${nameOfKey(k, map)}: ${logs.length} sessions, last ${dateKey(logTime(last))} ${top(last)}${best && best.w ? `, best set ${best.w}kg x ${best.r}` : ''}${logs.length > 1 && a && z ? `, estimated 1RM ${a} → ${z} kg` : ''}` };
        }).filter(Boolean).sort((a, c) => c.n - a.n).slice(0, 40);
        lines.push(rows.length ? `- Workouts in the last 8 weeks (${countWorkouts(h)} workout days in total):\n  ` + rows.map(r => r.text).join('\n  ') : '- No workouts logged in the last 8 weeks.');
        // weak points: sets a week for each muscle (last 4 weeks), muscles not trained, and lifts that stopped going up (8 weeks)
        const names = exerciseNameMap(), weekSets = {}, since4 = Date.now() - 28 * 864e5, stuck = [];
        Object.keys(h).forEach(k => {
            const muscle = (names[k] || map[k] || {}).muscle, logs = (h[k] || []).filter(l => { const tt = logTime(l); return !isNaN(tt) && tt >= since; });
            if (muscle) logs.forEach(l => { if (logTime(l) >= since4) weekSets[muscle] = (weekSets[muscle] || 0) + logSetDetails(l).length / 4; });
            const best = l => Math.max(0, ...logSetDetails(l).map(e1rmOf));
            if (logs.length >= 4 && best(logs[0]) > 0) { const half = Math.floor(logs.length / 2), a = Math.max(...logs.slice(0, half).map(best)), b = Math.max(...logs.slice(half).map(best)); if (b <= a) stuck.push(nameOfKey(k, names)); }
        });
        // how regular they are, body weight and daily check-ins
        const days = new Set(); Object.values(h).forEach(list => (list || []).forEach(l => { const tt = logTime(l); if (!isNaN(tt)) days.add(dateKey(tt)); }));
        const all = [...days].sort();
        if (all.length) {
            const wk = [7, 6, 5, 4, 3, 2, 1, 0].map(n => { const a = dateKey(Date.now() - (n + 1) * 7 * 864e5), z = dateKey(Date.now() - n * 7 * 864e5); return all.filter(d => d > a && d <= z).length; });
            lines.push(`- Training since ${all[0]}. Last workout ${all[all.length - 1]} (${Math.round((startOfDay(Date.now()) - startOfDay(Date.parse(all[all.length - 1] + 'T12:00'))) / 864e5)} days ago). Workouts per week, last 8 weeks (oldest first): ${wk.join(', ')}.`);
        }
        const bl = (b.log || []).filter(x => x.t >= Date.now() - 84 * 864e5);
        if (bl.length > 1) lines.push(`- Body weight, last 12 weeks: ${bl[0].kg} kg on ${dateKey(bl[0].t)} → ${bl[bl.length - 1].kg} kg on ${dateKey(bl[bl.length - 1].t)}.`);
        const rd = getReadinessAll(), rk = Object.keys(rd).filter(k => k >= dateKey(Date.now() - 14 * 864e5)).sort();
        if (rk.length) {
            const avg = f => round1(rk.reduce((x, k) => x + (rd[k][f] || 0), 0) / rk.length);
            lines.push(`- Daily check-ins, last 2 weeks (${rk.length}; 0 = bad, 2 = good): sleep ${avg('sleep')}, soreness ${avg('soreness')} (2 = fresh), energy ${avg('energy')}. Latest ${rk[rk.length - 1]}: sleep ${rd[rk[rk.length - 1]].sleep}, soreness ${rd[rk[rk.length - 1]].soreness}, energy ${rd[rk[rk.length - 1]].energy}.`);
        }
        if (rows.length) {
            const MAIN = ['Chest', 'Lats', 'Back', 'Side Delts', 'Rear Delts', 'Biceps', 'Triceps', 'Quads', 'Hamstrings', 'Glutes', 'Calves', 'Abs'];
            const list = Object.keys(weekSets).sort((a, c) => weekSets[a] - weekSets[c]).map(m => `${m} ${round1(weekSets[m])}`);
            lines.push(`- Sets a week by muscle (last 4 weeks, fewest first): ${list.join(', ') || 'none'}.`);
            const none = MAIN.filter(m => !weekSets[m]); if (none.length) lines.push(`- Not trained in the last 4 weeks: ${none.join(', ')}.`);
            if (stuck.length) lines.push(`- Lifts with no progress in 8 weeks: ${stuck.slice(0, 10).join(', ')}.`);
        }
        return lines.join('\n');
    };
    const aiSystem = () => {
        const start = StorageManager.getStartDay(), order = [0, 1, 2, 3, 4, 5, 6].map(i => DAY_NAMES[(DAY_NAMES.indexOf(start) + i) % 7]).join(', ');
        const lib = muscleOptions.map(m => `${m}: ${(exerciseDictionary[m] || []).join(', ')}`).concat(getCustomEx().length ? [`Own exercises: ${getCustomEx().map(x => x.name).join(', ')}`] : []).join('\n');
        return `You are Apex Coach (in Arabic: مدرب Apex, always with "Apex" in Latin letters), the personal coach inside Apex Lift, a gym workout app. Talk like a real, experienced coach who knows this person: warm, natural and honest, in your own words. Have a real conversation: react to what they say, ask when you are curious or something matters, share your reasoning, encourage them, and push back kindly when an idea isn't good for them. Don't follow a script or a fixed list of questions.

Your only job is coaching: training, programs, exercises and technique, progression, recovery and sleep, motivation and habits, and general nutrition for training (protein, eating enough or less for their goal). If they ask about something else, answer in one friendly sentence that you're only their coach, and bring it back to their training. You are not a doctor: for pain, injury, illness, medicines or pregnancy, tell them to see a doctor or physiotherapist, and don't program around an injury yourself.

How you coach:
- Get to know them before you build a new program, like a coach at a first meeting: what they want most, their weak or lagging muscles, pain or movements to avoid, exercises they love or hate, their schedule and life. Ask what you really need, in a natural way (one thing at a time is easiest on a phone), and skip what you already know below. If they want the program right away, build it with what you know.
- Use their data like a coach who has watched them train: notice muscles that get few sets or none, lifts that stopped going up, and what they do often. Mention what you see when it helps, and ask if it matches how they feel.
- Give their weakest muscles more attention (the ones they name, or the lagging ones in their data): about twice a week, early in the workout, a few more sets, while each workout still fits their time. Say which muscle you focused on and why.
- Be flexible. When they want a small change to their current routine (an exercise they don't like or that hurts, a muscle they want more or less of, a shorter day, another day), change only that: send their current routine with "edit": true, every other day and exercise copied exactly as it is, and only the asked change made. If it's unclear what to swap in, suggest one or two options and ask. A new program only when they ask for one.
- Follow their progress like a coach who sees every workout: how regular they are, lifts going up or stuck, body weight, sleep, soreness and energy from their check-ins. When they ask how they are doing, be specific with their numbers. If something needs attention (missed weeks, stuck lifts, poor sleep or recovery), bring it up kindly and suggest what to do.
- Prefer exercises they already do, and use their history to say what to progress. Never invent numbers they didn't log.

How the app reads your answer (follow this exactly):
- "reply": what you say, in ${isAR ? 'Arabic' : 'English'}, written like a chat message on a phone: usually short, longer only when they ask for detail. Plain text; "- " for lists and **bold** are fine; no headings or tables.
- "memory": the things worth remembering about them for later chats (injuries or pain, likes and dislikes, schedule and life, goals and weak points they told you), as short notes in ${isAR ? 'Arabic' : 'English'}. Send the full updated list (up to 15 notes) only when you learned something new or something changed; leave it out otherwise.
- "choices": when you ask something, 2 to 5 short answers they can tap (up to 5 words each, in their language). Leave it out otherwise.
- "routine": only when you build or change a program ("edit": true when it is their current routine with changes, then keep its days and only change what they asked). Exactly 7 days in this order: ${order}. Rest days: rest true, title "Complete Rest" or "Active Rest", no exercises. Use their number of training days and workout length unless they ask otherwise (about 4 exercises for 30 min, 5 for 45, 7 for 60, 8 for 90). Sets 1 to 6; reps like "8 - 10", or seconds like "30 - 45s" for holds; big lifts first. Use ONLY exercise names from the list below, written exactly the same (with dumbbells only: dumbbell and bodyweight exercises). Day titles 1 to 3 words and the routine name up to 4 words, in ${isAR ? 'Arabic' : 'English'}, like ${isAR ? '"دفع", "سحب", "أرجل", "الجزء العلوي"' : '"Push", "Pull", "Legs", "Upper Body"'}. With a routine, "reply" says briefly why it fits them; they can see the days themselves.
- Today is ${dateKey()} (${DAY_NAMES[new Date().getDay()]}).

About the user:
${aiContext()}
Exercises you may use (by muscle):
${lib}`;
    };

    // Firebase AI errors → a message for the user
    const aiErrStatus = e => (e && e.customErrorData && e.customErrorData.status) || 0;
    const aiModelGone = e => aiErrStatus(e) === 404 || /model.*(not found|not supported)|is not found/i.test((e && e.message) || '');
    // Google is busy: the free limit for the minute/day (429) or its servers are overloaded (5xx). The error text holds the
    // request address (…:generateContent), so only status codes and whole words are checked.
    const aiBusy = e => { const st = aiErrStatus(e); return st === 429 || st >= 500 || /\b(quota|exhausted|overloaded|too many requests|rate limit)\b/i.test((e && e.message) || ''); };
    const aiErrorText = e => {
        const st = aiErrStatus(e), code = st ? ` (${st})` : '';
        if (navigator.onLine === false || (e && e.code === 'fetch-error' && !st)) return t('No internet connection. Try again when online.');
        if (aiBusy(e)) return t('Apex Coach is busy right now. Try again in a minute.') + code;
        if ((e && e.code === 'api-not-enabled') || st === 401 || st === 403) return t('Apex Coach is not ready yet. Try again later.') + code;
        return t('Apex Coach could not answer. Try again.') + code;
    };
    const aiAsk = async contents => {
        const { fbAI, ai } = await loadAI();
        const models = AI_MODELS.filter(m => !AI.gone.has(m)), list = models.length ? models : AI_MODELS; let last = null;
        for (let i = 0; i < list.length; i++) {
            const name = list[i], think = /^gemini-3/.test(name) && !AI.noThink.has(name) ? { thinkingConfig: { thinkingLevel: 'LOW' } } : {};
            const model = fbAI.getGenerativeModel(ai, { model: name, systemInstruction: aiSystem(),
                generationConfig: { responseMimeType: 'application/json', responseSchema: aiSchema(fbAI.Schema), temperature: 0.9, maxOutputTokens: 8192, ...think } });
            try { return (await model.generateContent({ contents })).response.text(); }
            catch (e) {
                last = e; console.warn('Apex Coach', name, e);
                if (think.thinkingConfig && aiErrStatus(e) === 400) { AI.noThink.add(name); i--; continue; } // same model, without the setting
                if (aiModelGone(e)) { AI.gone.add(name); continue; } // retired: never again this visit
                if (aiBusy(e)) continue; // busy or a server error at Google: the next model (each has its own free limit)
                throw e;
            }
        }
        throw last;
    };
    const aiParse = text => {
        let o = null; try { o = JSON.parse(String(text || '').trim().replace(/^```(?:json)?\s*|\s*```$/g, '')); } catch (e) {}
        if (!isObj(o)) return null;
        const rt = o.routine ? routineFromAi(o.routine) : null;
        const x = cut(o.reply, 3000).trim() || (rt ? t(rt.edit ? 'Here are the changes.' : 'Here is a program for you.') : '');
        if (Array.isArray(o.memory)) writeItem(AI_MEM_KEY, JSON.stringify(o.memory.filter(x => typeof x === 'string' && x.trim()).map(x => x.trim().slice(0, 160)).slice(0, 20)));
        const ch = !rt && Array.isArray(o.choices) ? o.choices.filter(c => typeof c === 'string' && c.trim()).slice(0, 6).map(c => c.trim().slice(0, 60)) : [];
        return x || rt ? { r: 'm', x, ...(rt ? { rt } : {}), ...(ch.length ? { ch } : {}) } : null;
    };

    // Chat text: plain text with line breaks, "- " lists and **bold**
    const aiTextHTML = s => esc(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').split('\n').map(l => /^\s*[-•*]\s+/.test(l) ? `<span class="ai-li">${l.replace(/^\s*[-•*]\s+/, '')}</span>` : l).join('<br>').replace(/<\/span><br>/g, '</span>');
    const aiWeekHTML = sched => `<div class="grid grid-cols-7 gap-1 mt-3">${sched.map(d => `<div class="rounded-lg py-1.5 px-0.5 text-center ${d.isRest ? 'bg-white/5 text-slate-400' : 'bg-[#d4af37]/15 text-[#d4af37]'}"><div class="text-[12px] font-bold">${esc(dayShort(d.day))}</div><div class="pv-wo mt-0.5">${d.isRest ? '—' : esc(t(d.title))}</div></div>`).join('')}</div>`;
    const AI_IDEAS = ['How is my progress?', 'Build the best program for me', 'I don\'t like one exercise in my routine', 'My workouts take too long. Make them shorter.', 'Which muscle is my weakest?'];
    const renderAI = (scroll = true) => {
        const list = document.getElementById('ai-list'), input = document.getElementById('ai-input'), send = document.getElementById('ai-send');
        if (!list) return;
        const ok = localStorage.getItem(AI_OK_KEY) === '1', msgs = getAiChat(), full = appData.weeks.length >= 5;
        document.getElementById('ai-compose').classList.toggle('hidden', !ok);
        document.getElementById('ai-new').classList.toggle('hidden', !ok || !msgs.length);
        if (input) input.disabled = AI.busy;
        if (send) { send.disabled = AI.busy; send.classList.toggle('opacity-50', AI.busy); }
        if (!ok) {
            list.innerHTML = `<div class="pt-4 pb-6 text-center">
                <div class="w-14 h-14 mx-auto rounded-2xl bg-white/5 flex items-center justify-center text-[#d4af37]"><i data-lucide="sparkles" class="w-7 h-7"></i></div>
                <h2 class="text-[22px] font-black text-white mt-4">${t('Meet Apex Coach')}</h2>
                <p class="text-[14px] font-bold text-slate-300 mt-2">${t('Tell it what you want and it builds a program for you, from your answers and your workouts.')}</p>
            </div>
            <div class="glass-card ex-card text-[13px] font-bold text-slate-300 space-y-2">
                <p class="flex gap-2"><i data-lucide="send" class="w-4 h-4 shrink-0 mt-0.5 text-slate-400"></i><span>${t('To answer, your training answers, age, sex, body weight, routines, workout history and check-ins are sent to Google Gemini. Your name and email are not sent.')}</span></p>
                <p class="flex gap-2"><i data-lucide="shield-alert" class="w-4 h-4 shrink-0 mt-0.5 text-slate-400"></i><span>${t('Its answers can be wrong. It is not medical advice: stop if something hurts and see a doctor.')}</span></p>
                <p class="flex gap-2"><i data-lucide="smartphone" class="w-4 h-4 shrink-0 mt-0.5 text-slate-400"></i><span>${t('The chat is saved on this phone. Google and the Apex Lift team can see the questions for a limited time, so don\'t type private details.')}</span></p>
            </div>
            <a href="privacy.html${isAR ? '#ar' : ''}" target="_blank" rel="noopener" class="block text-center text-[13px] font-bold text-slate-400 underline py-3 mt-1">${t('Privacy Policy')}</a>
            <button onclick="window.appActions.aiAgree()" class="w-full py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-black tap-feedback flex items-center justify-center gap-2 mt-2"><i data-lucide="check" class="w-5 h-5"></i>${t('Got it, start')}</button>`;
        } else {
            const bubble = (m, i) => m.r === 'u'
                ? `<div class="flex justify-end"><div class="ai-msg ai-me" dir="auto">${aiTextHTML(m.x)}</div></div>`
                : m.err ? `<div class="flex justify-start"><div class="ai-msg ai-bot ai-err" role="alert"><div class="flex gap-2"><i data-lucide="cloud-off" class="w-4 h-4 shrink-0 mt-1 text-slate-400"></i><span dir="auto">${aiTextHTML(m.x)}</span></div>${i === msgs.length - 1 && !AI.busy ? `<button onclick="window.appActions.aiRetry()" class="mt-3 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-[13px] font-black text-white tap-feedback flex items-center justify-center gap-2"><i data-lucide="rotate-cw" class="w-4 h-4"></i>${t('Try again')}</button>` : ''}</div></div>`
                : `<div class="flex justify-start"><div class="ai-msg ai-bot"><div dir="auto">${aiTextHTML(m.x)}</div>${m.rt ? `
                    <div class="mt-3 pt-3 border-t border-white/10">
                        <div class="flex items-center justify-between gap-2"><span class="text-[15px] font-black text-white min-w-0 truncate">${esc(m.rt.name)}</span><span class="text-[12px] font-bold text-slate-400 shrink-0">${t('{n} training days', { n: m.rt.schedule.filter(d => !d.isRest).length })}</span></div>
                        ${aiWeekHTML(m.rt.schedule)}
                        ${m.rt.edit ? aiChangesHTML(m.rt.chg || []) : ''}
                        ${AI.open === i ? `<div class="space-y-2 mt-3">${m.rt.schedule.map(programDayCardHTML).join('')}</div>` : ''}
                        <div class="flex gap-2 mt-3">
                            <button onclick="window.appActions.aiToggle(${i})" class="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-[13px] font-bold text-slate-200 tap-feedback">${t(AI.open === i ? 'Hide days' : 'See all days')}</button>
                            <button onclick="window.appActions.aiUse(${i})" class="flex-1 py-3 rounded-xl ${m.used ? 'bg-white/5 border border-white/10 text-slate-300' : 'bg-[#d4af37] text-black'} text-[13px] font-black tap-feedback">${t(m.rt.edit ? (m.used ? 'Applied' : 'Apply changes') : m.used ? 'Use it again' : 'Use this program')}</button>
                        </div>
                        <p class="text-[12px] font-bold text-slate-400 mt-2">${m.rt.edit ? t('Only these changes are made to {name}. Your history is kept.', { name: m.rt.name }) : full ? t('It replaces your current routine. Your history is kept.') : t('It is added as a new routine. Your current routine and history are kept.')}</p>
                    </div>` : ''}</div></div>`;
            list.innerHTML = (msgs.length ? '' : `<div class="pt-2 pb-4">
                    <p class="text-[14px] font-bold text-slate-300">${t('Ask for a program, a change to your routine, or anything about training.')}</p>
                    ${getAiMemory().length ? `<div class="glass-card ex-card mt-4"><div class="flex items-center justify-between gap-2"><span class="text-[13px] font-black text-white">${t('Your coach remembers')}</span><button onclick="window.appActions.aiForget()" class="text-[13px] font-bold text-slate-400 underline px-2 py-2.5 tap-feedback">${t('Forget all')}</button></div>${getAiMemory().map(n => `<span class="ai-li text-[13px] font-bold text-slate-300 mt-1" dir="auto">${esc(n)}</span>`).join('')}</div>` : ''}
                    <div class="flex flex-col gap-2 mt-4">${AI_IDEAS.map(q => `<button onclick="window.appActions.aiSend(${jsArg(t(q))})" class="w-full text-start px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[14px] font-bold text-slate-200 tap-feedback">${esc(t(q))}</button>`).join('')}</div>
                </div>`)
                + `<div class="space-y-3">${msgs.map(bubble).join('')}${!AI.busy && msgs.length && msgs[msgs.length - 1].ch ? `<div class="flex flex-wrap gap-2">${msgs[msgs.length - 1].ch.map(c => `<button onclick="window.appActions.aiSend(${jsArg(c)})" dir="auto" class="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[14px] font-bold text-slate-200 tap-feedback">${esc(c)}</button>`).join('')}</div>` : ''}${AI.busy ? `<div class="flex justify-start"><div class="ai-msg ai-bot" role="status" aria-label="${esc(t('Thinking…'))}"><span class="ai-dots"><i></i><i></i><i></i></span><span class="ai-wait">${t('Apex Coach is thinking. A full program can take up to 30 seconds.')}</span></div></div>` : ''}</div>`;
        }
        if (window.lucide) window.lucide.createIcons({ root: list });
        if (scroll) { const msgEls = list.querySelectorAll('.ai-msg'), lastEl = msgEls[msgEls.length - 1]; list.scrollTop = lastEl ? Math.min(list.scrollHeight, lastEl.parentElement.offsetTop - 12) : list.scrollHeight; }
    };
    Object.assign(window.appActions, {
        openAI: () => {
            AI.open = -1;
            const box = document.getElementById('ai-box');
            box.querySelectorAll('[data-ai-label]').forEach(el => el.setAttribute('aria-label', t(el.dataset.aiLabel)));
            renderAI();
            openSheet('ai-overlay', 'ai-box');
            pushBack('ai', () => window.appActions.closeAI());
        },
        closeAI: () => { popBack('ai'); closeSheet('ai-overlay', 'ai-box'); },
        aiAgree: () => { try { localStorage.setItem(AI_OK_KEY, '1'); } catch (e) {} renderAI(); loadAI().catch(() => {}); },
        aiNew: () => {
            if (AI.busy || !getAiChat().length) return;
            window.appActions.showConfirm(t('Start a new chat?'), t('This chat is deleted from this phone. What your coach remembers about you is kept.'), () => { setAiChat([]); AI.open = -1; renderAI(); }, true);
        },
        aiToggle: i => { AI.open = AI.open === i ? -1 : i; const list = document.getElementById('ai-list'), top = list.scrollTop; renderAI(false); list.scrollTop = top; },
        aiSend: async preset => {
            const input = document.getElementById('ai-input');
            const text = cut(typeof preset === 'string' ? preset : (input ? input.value : ''), 500).trim();
            if (!text || AI.busy) return;
            if (navigator.onLine === false) return window.appActions.showToast(t('No internet connection. Try again when online.'), 'error');
            if (aiCount() >= AI_DAILY) return window.appActions.showToast(t('That is all the questions for today. Try again tomorrow.'), 'error');
            const msgs = [...getAiChat(), { r: 'u', x: text }];
            setAiChat(msgs);
            if (input) { input.value = ''; input.style.height = ''; }
            AI.busy = true; renderAI();
            try {
                const ok = msgs.filter(m => !m.err).slice(-AI_CONTEXT), lastRt = ok.map(m => !!m.rt).lastIndexOf(true), contents = [];
                ok.forEach((m, i) => {
                    const role = m.r === 'u' ? 'user' : 'model';
                    const text = m.r === 'u' ? m.x : JSON.stringify({ reply: m.x, ...(m.rt && i === lastRt ? { routine: routineToAi(m.rt) } : {}) }) + (m.rt && i !== lastRt ? ` [sent the program "${m.rt.name}"]` : '');
                    const prev = contents[contents.length - 1];
                    if (prev && prev.role === role) prev.parts[0].text += '\n' + text; else contents.push({ role, parts: [{ text }] }); // turns take turns
                });
                while (contents.length && contents[0].role !== 'user') contents.shift(); // a chat starts with a question
                const reply = aiParse(await aiAsk(contents));
                if (reply) aiCountUp(); // only answers count towards the daily limit
                setAiChat([...getAiChat(), reply || { r: 'm', x: t('Apex Coach could not answer. Try again.'), err: true }]);
            } catch (e) {
                setAiChat([...getAiChat(), { r: 'm', x: aiErrorText(e), err: true }]);
            } finally { AI.busy = false; renderAI(); }
        },
        aiRetry: () => {
            if (AI.busy) return;
            const msgs = getAiChat(); while (msgs.length && msgs[msgs.length - 1].err) msgs.pop();
            const q = msgs.length && msgs[msgs.length - 1].r === 'u' ? msgs.pop() : null;
            setAiChat(msgs); if (q) window.appActions.aiSend(q.x); else renderAI();
        },
        aiUse: (i, sure = false) => {
            const msgs = getAiChat(), m = msgs[i]; if (!m || !m.rt) return;
            if (window.appState.sess) return window.appActions.showToast(t('Finish your workout first, then change your plan.'), 'error');
            const target = m.rt.edit && appData.weeks.find(w => w.id === m.rt.edit);
            if (!sure && !target && appData.weeks.length >= 5)
                return window.appActions.showConfirm(t('Replace current routine?'), t('You have 5 routines (the most). The current one will be replaced; your history is kept.'), () => window.appActions.aiUse(i, true), true);
            const clean = sanitizePlan({ weeks: [{ id: 'w_' + Date.now(), name: m.rt.name, schedule: m.rt.schedule }] });
            if (!clean) return;
            m.used = true; setAiChat(msgs);
            window.appActions.closeAI();
            putRoutine(target ? target.name : clean.weeks[0].name, clean.weeks[0].schedule, { undo: true, targetId: target ? target.id : null });
        },
        aiForget: () => window.appActions.showConfirm(t('Forget everything?'), t('Your coach forgets the notes it kept about you.'), () => { try { localStorage.removeItem(AI_MEM_KEY); } catch (e) {} renderAI(false); }, true),
        aiKey: e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && window.matchMedia('(pointer: fine)').matches) { e.preventDefault(); window.appActions.aiSend(); } },
        aiGrow: el => { el.style.height = ''; el.style.height = Math.min(el.scrollHeight, 140) + 'px'; }
    });

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
    const Cloud = { err: '', status: 'off', user: null, auth: null, db: null, unsub: [], sent: {}, timer: null, flushing: false, again: false, applying: false, lastSync: 0, loading: null, tries: 0, retryTimer: null, starting: false };
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
        if (c === 'auth/unauthorized-domain') return t('Sign-in isn\'t available on this site yet.');
        if (c === 'auth/network-request-failed' || /load/i.test((e && e.message) || '')) return t('No internet connection. Try again when online.');
        return t('Sign-in failed. Please try again.') + (c ? ` (${c})` : '');
    };
    const setCloudStatus = (st, e, step) => { Cloud.status = st; Cloud.err = st === 'error' ? [((e && e.code) || '').replace(/^firestore\//, ''), step].filter(Boolean).join(', ') : ''; renderAccount(); };
    const scheduleFlush = (ms = 1500) => { if (!Cloud.user) return; clearTimeout(Cloud.timer); Cloud.timer = setTimeout(cloudFlush, ms); };
    // Sync looks after itself (there is no Sync button): after a failure it tries again by itself (5 s, 15 s, 1 min, then every 5 min),
    // and coming back to the app or getting signal back checks that everything is running
    const RETRY_MS = [5000, 15000, 60000, 300000];
    const cloudRetry = () => {
        clearTimeout(Cloud.retryTimer);
        Cloud.retryTimer = setTimeout(cloudKick, RETRY_MS[Math.min(Cloud.tries, RETRY_MS.length - 1)]);
        Cloud.tries++;
    };
    const cloudOk = () => { Cloud.tries = 0; clearTimeout(Cloud.retryTimer); };
    // Firebase loaded → first merge done → live updates on → anything not uploaded yet goes up
    const cloudKick = () => {
        if (!getCloudFlag() || Cloud.starting) return;
        if (!Cloud.auth) return loadFirebase().catch(() => { setCloudStatus('offline'); cloudRetry(); });
        if (!Cloud.user) return; // Firebase is still checking who is signed in
        if (!Cloud.unsub.length) return cloudSignedIn(Cloud.user);
        if (Cloud.status === 'error') Cloud.sent = {}; // compare everything again
        cloudFlush();
    };
    // After a while in the background the connection can be stale (phones pause web apps): reconnect so the
    // live updates catch up with changes made on your other phones
    const cloudResume = async stale => {
        if (stale && Cloud.db && Cloud.unsub.length) { try { await Cloud.db.disableNetwork(); await Cloud.db.enableNetwork(); } catch (e) {} }
        cloudKick();
    };
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
            lang: LANG, appVersion: APP_VERSION, platform: platformName(), installed: isInstalled(), setup: (localStorage.getItem(SETUP_KEY) || '').slice(0, 40),
            signIn: (Cloud.user.providerData || []).some(p => p && p.providerId === 'google.com') ? 'google' : 'email', verified: Cloud.user.emailVerified === true,
            tz: (() => { try { return (Intl.DateTimeFormat().resolvedOptions().timeZone || '').slice(0, 60); } catch (e) { return ''; } })(),
            locale: String(navigator.language || '').slice(0, 20), screen: `${Math.round(screen.width)}x${Math.round(screen.height)}`,
            ref: (localStorage.getItem(REF_KEY) || '').slice(0, 30), browser: browserKind() };
    };
    const platformName = () => {
        const ua = navigator.userAgent || '';
        if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
        if (/Android/.test(ua)) return 'android';
        return 'desktop';
    };
    const isInstalled = () => { try { return navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches; } catch (e) { return false; } };
    // Opened inside another app (Instagram, Facebook, Snapchat, TikTok...): those built-in browsers keep their own storage
    // and often clear it when they close, so you're signed out every time (and Google blocks its sign-in there)
    const IN_APP = [['Instagram', 'instagram'], ['FBAN', 'facebook'], ['FBAV', 'facebook'], ['FB_IAB', 'facebook'], ['Snapchat', 'snapchat'], ['TikTok', 'tiktok'], ['musical_ly', 'tiktok'],
        ['BytedanceWebview', 'tiktok'], ['Line/', 'line'], ['Twitter', 'x'], ['LinkedInApp', 'linkedin'], ['Pinterest', 'pinterest'], ['GSA/', 'google-app'], ['; wv)', 'webview']];
    const inAppBrowser = () => { const ua = navigator.userAgent || '', m = IN_APP.find(([k]) => ua.includes(k)); return m ? m[1] : ''; };
    // shown on the admin page, to tell why someone keeps getting signed out
    const browserKind = () => isInstalled() ? 'installed' : inAppBrowser() ? 'in-app: ' + inAppBrowser() : 'browser';
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
            if (isObj(m.profile)) writeItem(PROFILE_KEY, JSON.stringify(sanitizeProfile(m.profile)));
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
        renderNav(); renderWorkout();
        if (window.appState.currentView === 'profile') renderProfile();
        // the missing answers arrived from another phone: this phone doesn't need to ask them
        const W = window.appState.wiz; if (W && W.mode === 'complete' && !W.done && !setupMissing().length) { W.done = true; window.appActions.closeWizard(true); }
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
        if (Cloud.starting) return; Cloud.starting = true;
        // ask the browser to keep the app's storage (the sign-in lives there) when the phone is low on space.
        // Not on Firefox, which asks with a pop-up.
        try { if (navigator.storage && navigator.storage.persist && !/Firefox/.test(navigator.userAgent)) navigator.storage.persist().catch(() => {}); } catch (e) {}
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
            // this account finished the setup on another phone (or has workouts): no need for the setup questions here
            const sm = snap.exists ? snap.data() || {} : {}, setupDone = isObj(sm.account) && typeof sm.account.setup === 'string' && sm.account.setup && !sm.account.setup.startsWith('left:');
            if ((isObj(sm.profile) && sm.profile.goal) || setupDone || hs.size > 0) StorageManager.setOnboard();
            if (fromWelcome) window.appActions.initOnboarding();
            await cloudFlush();
            cloudSubscribe(uid);
            maybeAutoBackup();
            openPendingCode();
        } catch (e) { console.warn('Cloud sync failed', e); setCloudStatus('error', e, 'read'); cloudRetry(); if (fromWelcome) window.appActions.initOnboarding(); }
        finally { Cloud.starting = false; }
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
            Cloud.lastSync = Date.now(); cloudOk(); setCloudStatus('synced');
        } catch (e) { console.warn('Cloud upload failed', e); Cloud.sent = {}; setCloudStatus('error', e, 'save'); cloudRetry(); }
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
        presenceStop(); cloudOk();
        if (sheetOpen('account-overlay')) window.appActions.closeAccount(); // the account page belongs to the account that left
        Cloud.unsub.forEach(u => u()); Cloud.unsub = []; Cloud.user = null; Cloud.sent = {};
        const hadAccount = !!(getCloudFlag() || {}).uid; // not a sign-in still on its way, or Firebase loading early with nobody signed in
        try { localStorage.removeItem(CLOUD_KEY); } catch (e) {}
        setCloudStatus('off');
        // an account is needed to use the app: back to the sign-in page (workouts stay on the phone)
        if (gateOn() && hadAccount && requireSignIn()) {
            // the setup questions (if open) belong to the account that just left: close them so the sign-in page is on top
            const W = window.appState.wiz; if (W && !W.done) { W.done = true; popBack('wizard'); closeModal('onboarding-overlay', 'onboarding-box', 300); }
            showWelcome(true);
        }
    };
    window.addEventListener('online', () => cloudResume(true));
    window.addEventListener('offline', () => { if (Cloud.user) setCloudStatus('offline'); });
    // Leaving the app (home button, lock screen): upload now, because the phone pauses the app's timers in the background.
    // Coming back: reconnect if it was away for a while, then make sure sync is running.
    let cloudHiddenAt = 0;
    document.addEventListener('visibilitychange', () => {
        if (!getCloudFlag()) return;
        if (document.visibilityState === 'hidden') { cloudHiddenAt = Date.now(); if (Cloud.user && Cloud.unsub.length) cloudFlush(); return; }
        cloudResume(cloudHiddenAt > 0 && Date.now() - cloudHiddenAt > 30000);
    });
    window.addEventListener('pageshow', e => { if (e.persisted) cloudResume(true); });

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
                <button onclick="window.appActions.openEmail('in')" class="w-full mt-2 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-[14px] font-bold flex items-center justify-center gap-3 tap-feedback"><i data-lucide="mail" class="w-5 h-5"></i>${t('Continue with email')}</button></div>`;
        } else {
            const name = u.displayName || u.name || '', email = u.email || '', photo = u.photoURL || u.photo || '';
            // sync runs by itself: nothing is shown while it works, only when it can't
            const st = { offline: ['bg-slate-400', t('Offline')], error: ['bg-red-500', t('Sync problem')] }[Cloud.status];
            // the whole card opens Account (personal details and account settings)
            el.innerHTML = `<div class="glass-card border border-white/10">
                <button onclick="window.appActions.openAccount()" ${Cloud.user ? '' : 'disabled'} class="w-full px-4 py-3.5 flex items-center gap-3 text-start tap-feedback" aria-label="${esc(t('Account'))}">
                    ${avatarHTML(u, 'w-11 h-11 text-[18px]')}
                    <span class="min-w-0 flex-1">
                        <span class="block text-[16px] font-black text-white truncate leading-tight">${esc(name || email)}</span>
                        ${name && email ? `<span class="block text-[12px] font-bold text-slate-400 truncate mt-0.5">${esc(email)}</span>` : ''}
                    </span>
                    ${st ? `<span class="shrink-0 flex items-center gap-1.5 text-[12px] font-bold text-slate-400" title="${esc(Cloud.err)}"><span class="w-1.5 h-1.5 rounded-full ${st[0]}"></span><span class="max-w-[110px] truncate">${esc(st[1])}</span></span>` : ''}
                    <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400 shrink-0"></i>
                </button></div>`;
        }
        if (window.lucide) window.lucide.createIcons({ root: el });
        if (typeof updateBackupStatus === 'function') updateBackupStatus();
        if (welcomeOpen()) updateWelcomeUI(); // "Signing in…" on the welcome page too
    };
    // Profile → Account and Your training pages
    Object.assign(window.appActions, {
        openAccount: () => { if (!Cloud.user) return; renderAccountSheet(); openSheet('account-overlay', 'account-box'); pushBack('account', () => window.appActions.closeAccount()); },
        closeAccount: () => { popBack('account'); closeSheet('account-overlay', 'account-box'); },
        openTraining: () => { renderTrainingSheet(); openSheet('training-overlay', 'training-box'); pushBack('training', () => window.appActions.closeTraining()); },
        closeTraining: () => { popBack('training'); closeSheet('training-overlay', 'training-box'); },
        // Profile → Workout settings / App settings (one page each)
        openSettings: which => { const id = which === 'app' ? 'appset' : 'workset'; window.appState.settingsOpen = id; openSheet(id + '-overlay', id + '-box'); pushBack('settings', () => window.appActions.closeSettings()); },
        closeSettings: () => { const id = window.appState.settingsOpen; if (!id) return; window.appState.settingsOpen = null; popBack('settings'); closeSheet(id + '-overlay', id + '-box'); },
        closeEdit: () => { popBack('edit'); if (document.activeElement) document.activeElement.blur(); closeModal('edit-overlay', 'edit-box'); },
        editName: () => {
            if (!Cloud.user) return;
            openEdit(editHead(t('Name')) + `<form onsubmit="event.preventDefault(); window.appActions.saveName(document.getElementById('edit-name').value)">
                <input id="edit-name" type="text" autocomplete="name" maxlength="60" value="${esc(Cloud.user.displayName || '')}" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white text-[16px] font-bold outline-none focus:border-white/30" dir="auto" aria-label="${esc(t('Name'))}">
                <button type="submit" class="w-full mt-4 py-4 rounded-xl bg-[#d4af37] text-black text-[14px] font-black tap-feedback">${t('Save')}</button></form>`);
            setTimeout(() => { const i = document.getElementById('edit-name'); if (i) { i.focus(); i.select(); } }, 320);
        },
        // date of birth (the age shown comes from it): same limits as the setup
        editBirth: () => {
            const b = getBody(), n = new Date(), iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            const max = iso(new Date(n.getFullYear() - MIN_AGE, n.getMonth(), n.getDate())), min = iso(new Date(n.getFullYear() - 100, 0, 1));
            openEdit(editHead(t('Date of birth')) + `<form onsubmit="event.preventDefault(); window.appActions.saveBirth(document.getElementById('edit-birth').value)">
                <input id="edit-birth" type="date" min="${min}" max="${max}" value="${esc(b.birthDate || '')}" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white text-[16px] font-bold outline-none focus:border-white/30 num" dir="ltr" aria-label="${esc(t('Date of birth'))}">
                <button type="submit" class="w-full mt-4 py-4 rounded-xl bg-[#d4af37] text-black text-[14px] font-black tap-feedback">${t('Save')}</button></form>`);
        },
        saveBirth: v => {
            const err = m => window.appActions.showToast(m, 'error');
            if (!/^\d{4}-\d{2}-\d{2}$/.test(v || '')) return err(t('Enter your date of birth.'));
            const age = ageOf({ birthDate: v });
            if (age < MIN_AGE) return err(t('Apex Lift is for ages {n} and up.', { n: MIN_AGE }));
            if (age > 100) return err(t('Check your date of birth.'));
            setBody({ ...getBody(), birthDate: v });
            window.appActions.closeEdit(); renderAccountSheet();
            window.appActions.showToast(t('Saved'));
        },
        editTraining: k => {
            const row = TRAINING_EDIT[k]; if (!row) return;
            const cur = getProfile()[k];
            openEdit(editHead(t(row[0])) + `<div class="space-y-2">${row[1]().map(([v, l]) => `<button onclick="window.appActions.setTraining(${jsArg(k)}, ${jsArg(v)})" class="w-full min-h-[52px] px-4 rounded-xl border flex items-center justify-between text-start text-[15px] font-bold tap-feedback ${cur === v ? 'bg-[#d4af37]/15 border-[#d4af37] text-white' : 'bg-white/5 border-white/10 text-white'}">${esc(l)}${cur === v ? '<i data-lucide="check" class="w-5 h-5 text-[#d4af37]"></i>' : ''}</button>`).join('')}</div>`);
        },
        // a changed answer: saved, then a program that fits the new answers is offered (the current routine stays)
        setTraining: (k, v) => {
            const pr = getProfile(); window.appActions.closeEdit();
            if (pr[k] === v) return;
            writeItem(PROFILE_KEY, JSON.stringify(sanitizeProfile({ ...pr, [k]: v })));
            renderTrainingSheet(); renderTrainingRow();
            const np = getProfile(), rec = PROGRAMS.find(p => p.id === recommendProgram({ ...np, sex: getBody().sex }));
            setTimeout(() => window.appActions.showConfirm(t('Get a matching program?'),
                appData.weeks.length >= 5 ? t('{name} fits your answers. You have 5 routines, so it replaces the current one. Your history is kept.', { name: t(rec.name) })
                    : t('{name} fits your answers. It is added to your routines; your current one stays.', { name: t(rec.name) }),
                () => { window.appActions.closeTraining(); window.appActions.applyProgram(rec.id, { exp: np.exp || 'mid' }); }, false, t('Get program')), 320);
        },
        saveName: async v => {
            const name = String(v || '').trim().slice(0, 60);
            if (!Cloud.user) return;
            if (!name) return window.appActions.showToast(t('Please enter your name.'), 'error');
            window.appActions.closeEdit();
            try {
                await Cloud.user.updateProfile({ displayName: name });
                const f = getCloudFlag(); if (f) writeItem(CLOUD_KEY, JSON.stringify({ ...f, name }));
                Cloud.sent.main = ''; scheduleFlush(300);
                renderAccount(); renderAccountSheet();
                window.appActions.showToast(t('Saved'), 'success');
            } catch (e) { window.appActions.showToast(authErrorText(e), 'error'); renderAccountSheet(); }
        }
    });
    Object.assign(window.appActions, {
        cloudSignIn: async () => {
            setCloudStatus('loading');
            try { await loadFirebase(); } catch (e) { window.appActions.showToast(t('No internet connection. Try again when online.'), 'error'); return setCloudStatus('off'); }
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.setCustomParameters({ prompt: 'select_account' });
            // Installed on the home screen: Google's pop-up window can't report back to the app there, so the app waited
            // forever and had to be restarted. Sign in on the full page instead (it comes back to the app when done).
            if (isInstalled()) {
                writeItem(CLOUD_KEY, JSON.stringify({ pending: true }));
                try { return await Cloud.auth.signInWithRedirect(provider); }
                catch (e) { try { localStorage.removeItem(CLOUD_KEY); } catch (x) {} window.appActions.showToast(cloudErrorText(e), 'error'); return setCloudStatus('off'); }
            }
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
        cloudSignOut: () => window.appActions.showConfirm(t('Sign out?'), t('Your workouts stay on this phone. Sign in again anytime to sync.'), async () => {
            try { await Promise.race([cloudFlush(), new Promise(r => setTimeout(r, 4000))]); } catch (e) {}
            Cloud.unsub.forEach(u => u()); Cloud.unsub = [];
            try { await Cloud.auth.signOut(); } catch (e) {}
            cloudSignedOut();
            window.appActions.showToast(t('Signed out'), 'success');
        }),
        // email accounts confirm their password first, so the account can really be deleted after its data
        cloudDelete: () => window.appActions.showConfirm(t('Delete your account?'), t('This deletes your cloud backup and your account. The workouts on this phone stay.'), () => {
            if (!Cloud.user) return;
            if (isPasswordUser()) return window.appActions.openEmail('reauth', () => window.appActions.cloudDeleteNow());
            window.appActions.cloudDeleteNow();
        }, true),
        cloudDeleteNow: async () => {
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
                // routines you shared with a code stop working too
                try { const ss = await Cloud.db.collection('shared').where('by', '==', uid).get(); ss.forEach(d => paths.push(`shared/${d.id}`)); } catch (e) { console.warn('Shared routines', e); }
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
        }
    });

    // ✉️ EMAIL SIGN-IN: an account with an email and password (Firebase Authentication), next to Google.
    // Turned on once in Firebase: Authentication → Sign-in method → Email/Password.
    // Modes: 'in' sign in, 'up' create an account, 'reset' forgot password, 'reauth' confirm the password (before deleting the account),
    // 'newpass' choose a new password (opened by the reset link in the email, see EMAIL LINKS below)
    const isPasswordUser = () => !!Cloud.user && (Cloud.user.providerData || []).some(p => p && p.providerId === 'password')
        && !(Cloud.user.providerData || []).some(p => p && p.providerId === 'google.com');
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailSt = { mode: 'in', busy: false, then: null, code: '', resetEmail: '' };
    // New accounts need a strong password: at least 8 characters, one capital letter and one symbol (any non-letter, non-number)
    const PASS_RULES = [
        ['At least 8 characters', p => p.length >= 8],
        ['One capital letter (A–Z)', p => /\p{Lu}/u.test(p)],
        ['One symbol, like ! @ # $ %', p => /[^\p{L}\p{N}\s]/u.test(p)]
    ];
    const passStrong = p => PASS_RULES.every(r => r[1](p));
    // the rules, then "Both passwords match" for the second (confirm) box
    const passRulesHTML = (p, p2) => [...PASS_RULES, ['Both passwords match', x => !!p2 && x === p2]].map(([l, ok]) => `<li class="flex items-center gap-2 ${ok(p) ? 'text-[#22c55e]' : 'text-slate-400'}"><i data-lucide="${ok(p) ? 'check-circle-2' : 'circle'}" class="w-4 h-4 shrink-0"></i>${t(l)}</li>`).join('');
    const authErrorText = e => {
        const c = (e && e.code) || '';
        if (['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found', 'auth/invalid-login-credentials'].includes(c)) return t('Email or password is wrong.');
        if (c === 'auth/email-already-in-use') return t('This email already has an account. Sign in instead.');
        if (c === 'auth/invalid-email' || c === 'auth/missing-email') return t('Please enter a valid email.');
        if (c === 'auth/weak-password' || c === 'auth/password-does-not-meet-requirements') return t('Your password needs at least 8 characters, a capital letter and a symbol.');
        if (c === 'auth/too-many-requests') return t('Too many tries. Wait a few minutes and try again.');
        if (c === 'auth/operation-not-allowed') return t('Email sign-in isn\'t available yet. Use Google for now.');
        if (c === 'auth/user-disabled') return t('This account is turned off. Contact us.');
        return cloudErrorText(e);
    };
    const renderEmail = (msg = '', good = false) => {
        const m = emailSt.mode, keep = id => { const el = document.getElementById(id); return el ? el.value : ''; };
        const strong = m === 'up' || m === 'newpass'; // a new password: rules + confirm box
        const email = m === 'newpass' ? emailSt.resetEmail : keep('em-email') || (m === 'reauth' && Cloud.user ? Cloud.user.email || '' : ''), name = keep('em-name');
        const pass = strong ? keep('em-pass') : '', pass2 = strong ? keep('em-pass2') : '';
        const title = { in: t('Sign in with email'), up: t('Create your account'), reset: t('Reset your password'), reauth: t('Confirm your password'), newpass: t('Choose a new password') }[m];
        const sub = { in: '', up: t('Use your email and a strong password.'), reset: t("Enter your email and we'll send you a reset link."), reauth: t('Enter your password to delete your account.'), newpass: t('Pick a strong password for your account.') }[m];
        const inp = 'w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white text-[16px] font-bold outline-none focus:border-[#d4af37]';
        const lbl = (txt, html) => `<label class="block"><span class="block text-[12px] font-bold text-slate-400 mb-1.5">${txt}</span>${html}</label>`;
        const link = (fn, txt) => `<button type="button" onclick="${fn}" class="inline-flex items-center min-h-[40px] px-1 text-[13px] font-bold text-[#d4af37] tap-feedback">${txt}</button>`;
        const btn = { in: t('Sign in'), up: t('Create account'), reset: t('Send link'), reauth: t('Confirm'), newpass: t('Save password') }[m];
        const eye = `<button type="button" onclick="document.querySelectorAll('#em-pass,#em-pass2').forEach(i=>i.type=i.type==='password'?'text':'password')" class="absolute inset-y-0 end-0 px-3.5 text-slate-400 tap-feedback" aria-label="${esc(t('Show password'))}"><i data-lucide="eye" class="w-5 h-5"></i></button>`;
        document.getElementById('email-body').innerHTML = `
            <div class="relative text-center pt-3 pb-1">
                <button type="button" onclick="window.appActions.closeEmail()" class="absolute -top-1 -end-1 w-11 h-11 flex items-center justify-center bg-white/5 rounded-full text-slate-400 tap-feedback" aria-label="${esc(t('Close'))}"><i data-lucide="x" class="w-5 h-5"></i></button>
                <span class="w-14 h-14 mx-auto mb-3 rounded-full bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center"><i data-lucide="${{ in: 'mail', up: 'user-plus', reset: 'key-round', reauth: 'shield-check', newpass: 'key-round' }[m]}" class="w-7 h-7"></i></span>
                <h3 class="text-xl font-black text-white">${title}</h3>
            </div>
            ${sub ? `<p class="text-[13px] font-bold text-slate-400 text-center mt-1 mb-5 leading-snug">${sub}</p>` : '<div class="h-4"></div>'}
            <form onsubmit="event.preventDefault(); window.appActions.emailSubmit()" class="space-y-3" novalidate>
                ${m === 'up' ? lbl(t('Your name'), `<input id="em-name" type="text" autocomplete="name" maxlength="60" value="${esc(name)}" class="${inp}" dir="auto">`) : ''}
                ${m === 'reauth' || m === 'newpass' ? `<div class="text-[13px] font-bold text-slate-300" dir="ltr">${esc(email)}</div>` : lbl(t('Email'), `<input id="em-email" type="email" inputmode="email" autocomplete="${m === 'up' ? 'email' : 'username'}" autocapitalize="off" spellcheck="false" maxlength="200" value="${esc(email)}" class="${inp}" dir="ltr">`)}
                ${m === 'reset' ? '' : lbl(t(m === 'newpass' ? 'New password' : 'Password'), `<div class="relative"><input id="em-pass" type="password" autocomplete="${strong ? 'new-password' : 'current-password'}" maxlength="200" value="${esc(pass)}" ${strong ? 'oninput="window.appActions.passTyped()" aria-describedby="em-rules"' : ''} class="${inp} pe-12" dir="ltr">${eye}</div>`)}
                ${strong ? lbl(t('Confirm password'), `<input id="em-pass2" type="password" autocomplete="new-password" maxlength="200" value="${esc(pass2)}" oninput="window.appActions.passTyped()" aria-describedby="em-rules" class="${inp}" dir="ltr">`) : ''}
                ${strong ? `<ul id="em-rules" class="space-y-1.5 text-[12px] font-bold">${passRulesHTML(pass, pass2)}</ul>` : ''}
                <p id="em-msg" class="text-[12px] font-bold leading-snug ${good ? 'text-[#22c55e]' : 'text-red-400'} ${msg ? '' : 'hidden'}" role="alert">${esc(msg)}</p>
                <button id="em-go" type="submit" ${emailSt.busy ? 'disabled' : ''} class="w-full py-4 rounded-xl bg-[#d4af37] text-black text-[13px] font-extrabold tap-feedback flex items-center justify-center gap-2 disabled:opacity-60">${emailSt.busy ? '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i>' : ''}${btn}</button>
            </form>
            <div class="flex flex-col items-center gap-3 mt-5 mb-2">
                ${m === 'in' ? link("window.appActions.emailMode('reset')", t('Forgot password?')) + `<span class="text-[13px] font-bold text-slate-400">${t('New here?')} ${link("window.appActions.emailMode('up')", t('Create an account'))}</span>` : ''}
                ${m === 'up' ? `<span class="text-[13px] font-bold text-slate-400">${t('Have an account?')} ${link("window.appActions.emailMode('in')", t('Sign in'))}</span>` : ''}
                ${m === 'reset' || m === 'newpass' ? link("window.appActions.emailMode('in')", t('Back to sign in')) : ''}
            </div>`;
        if (window.lucide) window.lucide.createIcons({ root: document.getElementById('email-body') });
    };
    Object.assign(window.appActions, {
        openEmail: (mode = 'in', then = null) => {
            if ((mode === 'in' || mode === 'up') && welcomeOpen() && !getAgree()) return window.appActions.needAgree(() => window.appActions.openEmail(mode, then));
            emailSt.mode = mode; emailSt.then = then; emailSt.busy = false;
            document.getElementById('email-body').innerHTML = '';
            renderEmail();
            const o = document.getElementById('email-overlay'); // closed, or still sliding away: open it (again)
            if (!o.classList.contains('flex') || o.classList.contains('opacity-0')) { openModal('email-overlay', 'email-box'); pushBack('email', () => window.appActions.closeEmail()); }
            setTimeout(() => { const f = document.getElementById(mode === 'up' ? 'em-name' : mode === 'reauth' || mode === 'newpass' ? 'em-pass' : 'em-email'); if (f) f.focus(); }, 350);
        },
        closeEmail: () => { popBack('email'); if (document.activeElement) document.activeElement.blur(); closeModal('email-overlay', 'email-box'); emailSt.then = null; },
        emailMode: mode => { emailSt.mode = mode; renderEmail(); },
        // ticks each password rule (and "Both passwords match") while typing a new password
        passTyped: () => {
            const ul = document.getElementById('em-rules'); if (!ul) return;
            const v = id => (document.getElementById(id) || {}).value || '';
            ul.innerHTML = passRulesHTML(v('em-pass'), v('em-pass2')); if (window.lucide) window.lucide.createIcons({ root: ul });
            const msg = document.getElementById('em-msg'); if (msg) msg.classList.add('hidden'); // an old error goes away while typing
        },
        emailSubmit: async () => {
            if (emailSt.busy) return;
            const m = emailSt.mode, val = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
            const email = m === 'newpass' ? emailSt.resetEmail : val('em-email').toLowerCase(), name = val('em-name');
            const pass = (document.getElementById('em-pass') || {}).value || '', pass2 = (document.getElementById('em-pass2') || {}).value || '';
            if (m !== 'reauth' && m !== 'newpass' && !EMAIL_RE.test(email)) return renderEmail(t('Please enter a valid email.'));
            if (m === 'up' && !name) return renderEmail(t('Please enter your name.'));
            if (m !== 'reset' && !pass) return renderEmail(t('Please enter your password.'));
            if ((m === 'up' || m === 'newpass') && !passStrong(pass)) return renderEmail(t('Your password needs at least 8 characters, a capital letter and a symbol.'));
            if ((m === 'up' || m === 'newpass') && !pass2) return renderEmail(t('Please confirm your password.'));
            if ((m === 'up' || m === 'newpass') && pass !== pass2) return renderEmail(t("Passwords don't match."));
            if (navigator.onLine === false) return renderEmail(t('No internet connection. Try again when online.'));
            // signing in from a reset link on a phone that hasn't agreed to the Terms yet: agree first
            if ((m === 'in' || m === 'up') && welcomeOpen() && !getAgree()) return window.appActions.needAgree(() => window.appActions.emailSubmit());
            emailSt.busy = true; renderEmail();
            try {
                await loadFirebase();
                if (m === 'in') await Cloud.auth.signInWithEmailAndPassword(email, pass);
                else if (m === 'up') {
                    const cred = await Cloud.auth.createUserWithEmailAndPassword(email, pass);
                    await cred.user.updateProfile({ displayName: name.slice(0, 60) });
                    cred.user.sendEmailVerification().catch(() => {});
                    // the name arrived after sign-in started: put it on the account card and in the next upload
                    const f = getCloudFlag(); if (f && f.uid === cred.user.uid) writeItem(CLOUD_KEY, JSON.stringify({ ...f, name: name.slice(0, 60) }));
                    // upload it now only if the first sync is done; otherwise that sync takes it (an early upload would look like an older account)
                    Cloud.sent.main = ''; if (Cloud.unsub.length && !Cloud.starting) scheduleFlush(500); renderAccount();
                } else if (m === 'reset') {
                    try { await Cloud.auth.sendPasswordResetEmail(email); } catch (e) { if (e.code !== 'auth/user-not-found') throw e; }
                    emailSt.busy = false; emailSt.mode = 'in';
                    return renderEmail(t('If an account exists, we\'ve sent a reset link. Check your inbox.'), true);
                } else if (m === 'newpass') {
                    await Cloud.auth.confirmPasswordReset(emailSt.code, pass);
                    emailSt.code = '';
                    // signed out on this phone (and the Terms already agreed): sign straight in with the new password
                    if (Cloud.user || !getAgree()) {
                        emailSt.busy = false; emailSt.mode = 'in';
                        if (Cloud.user) { window.appActions.closeEmail(); return window.appActions.showToast(t('Password changed.'), 'success'); }
                        renderEmail(t('Password changed. Sign in with your new password.'), true);
                        const f = document.getElementById('em-email'); if (f) f.value = email;
                        return;
                    }
                    await Cloud.auth.signInWithEmailAndPassword(email, pass);
                    window.appActions.showToast(t("Password changed. You're signed in."), 'success');
                } else if (m === 'reauth') {
                    await Cloud.auth.currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(Cloud.auth.currentUser.email, pass));
                }
                const then = emailSt.then;
                emailSt.busy = false; window.appActions.closeEmail();
                if (then) then();
            } catch (e) {
                console.warn('Email sign-in', e);
                emailSt.busy = false; renderEmail(authErrorText(e));
            }
        },
        resendVerify: async () => {
            if (!Cloud.user) return;
            try { await Cloud.user.sendEmailVerification(); window.appActions.showToast(t('Email sent. Check your inbox.'), 'success'); }
            catch (e) { window.appActions.showToast(authErrorText(e), 'error'); }
        }
    });

    // 🔑 EMAIL LINKS: the "reset your password" and "confirm your email" links in Firebase's emails open here, in the app,
    // instead of Firebase's plain page. Set once in Firebase: Authentication → Templates → (pencil) → Customize action URL
    // → https://apex-liftt.netlify.app/  (the link then arrives as ?mode=resetPassword&oobCode=...).
    // Other kinds of links (like undoing an email change) still go to Firebase's own page.
    const AUTH_LINK = (() => {
        try {
            const raw = location.search, q = new URLSearchParams(raw), mode = q.get('mode'), code = q.get('oobCode');
            if (!mode || !code) return null;
            ['mode', 'oobCode', 'apiKey', 'continueUrl', 'lang'].forEach(k => q.delete(k));
            history.replaceState(history.state, '', location.pathname + (q.toString() ? '?' + q : '') + location.hash);
            return { mode, code, raw };
        } catch (e) { return null; }
    })();
    // a message page in the email window (the email links show their result here)
    const emailNotice = (icon, good, title, text, buttons) => {
        const body = document.getElementById('email-body');
        body.innerHTML = `<div class="text-center pt-4 pb-1" dir="${isAR ? 'rtl' : 'ltr'}">
            <span class="w-16 h-16 mx-auto mb-4 rounded-full ${good ? 'bg-[#22c55e]/15 text-[#22c55e]' : 'bg-white/5 text-slate-300'} flex items-center justify-center"><i data-lucide="${icon}" class="w-8 h-8"></i></span>
            <h3 class="text-xl font-black text-white">${title}</h3>
            <p class="text-[13px] font-bold text-slate-400 mt-2 mb-6 leading-snug">${text}</p>
            ${buttons}</div>`;
        if (window.lucide) window.lucide.createIcons({ root: body });
        const o = document.getElementById('email-overlay');
        if (!o.classList.contains('flex') || o.classList.contains('opacity-0')) { openModal('email-overlay', 'email-box'); pushBack('email', () => window.appActions.closeEmail()); }
    };
    const noticeBtn = (fn, txt) => `<button type="button" onclick="${fn}" class="w-full py-4 rounded-xl bg-[#d4af37] text-black text-[13px] font-extrabold tap-feedback">${txt}</button>`;
    // Firebase has finished checking who is signed in on this phone
    const authReady = () => new Promise(ok => { const off = Cloud.auth.onAuthStateChanged(u => { off(); ok(u); }); });
    const linkErrorText = e => ['auth/expired-action-code', 'auth/invalid-action-code'].includes((e && e.code) || '') ? t('This link has expired or was already used.') : authErrorText(e);
    const openAuthLink = async () => {
        const a = AUTH_LINK; if (!a || a.done) return; a.done = true;
        if (a.mode !== 'resetPassword' && a.mode !== 'verifyEmail') return location.replace('https://apex-lift-52a18.firebaseapp.com/__/auth/action' + a.raw);
        try { await loadFirebase(); } catch (e) { return window.appActions.showToast(t('No internet connection. Try again when online.'), 'error'); }
        if (a.mode === 'verifyEmail') {
            const user = await authReady();
            try {
                await Cloud.auth.applyActionCode(a.code);
                if (user) { await user.reload(); Cloud.sent.main = ''; scheduleFlush(500); }
                renderAccount(); renderAccountSheet();
                // signed in here: back to the app; opened on another browser or phone: sign in from here if they want
                emailNotice('badge-check', true, t('Email confirmed'), user ? t('Thanks! Your email is confirmed.') : t('Your email is confirmed. You can go back to Apex Lift, or sign in here.'),
                    user ? noticeBtn('window.appActions.closeEmail()', t('Continue')) : noticeBtn("window.appActions.openEmail('in')", t('Sign in')));
            } catch (e) {
                const canResend = !!user && isPasswordUser() && !user.emailVerified;
                emailNotice('circle-alert', false, t('Link not valid'), esc(linkErrorText(e)),
                    canResend ? noticeBtn('window.appActions.closeEmail(); window.appActions.resendVerify()', t('Send a new link')) : noticeBtn('window.appActions.closeEmail()', t('Close')));
            }
            return;
        }
        try {
            emailSt.resetEmail = await Cloud.auth.verifyPasswordResetCode(a.code);
            emailSt.code = a.code;
            window.appActions.openEmail('newpass');
        } catch (e) {
            // an old or used link: ask for a new one right here
            window.appActions.openEmail('reset');
            renderEmail(e && ['auth/expired-action-code', 'auth/invalid-action-code'].includes(e.code) ? t('This link has expired or was already used. Ask for a new one below.') : linkErrorText(e));
        }
    };



    // 🔗 ROUTINE CODES: share one routine with a friend by an 8-letter code. The routine is copied to shared/{code}
    // (no workouts or personal details, just the days and exercises); anyone signed in who has the code can add it.
    // Letters that look alike (0/O, 1/I) are left out so a code can be read aloud. A link with ?r=CODE opens it too.
    const CODE_ABC = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', CODE_RE = /^[A-HJ-NP-Z2-9]{8}$/;
    const SHARED_KEY = 'workoutSharedCodes_rakan_final'; // routine id → { code, sig }: the same routine, unchanged, keeps its code
    const PENDING_CODE = 'workoutPendingCode';
    const newCode = () => { const a = new Uint32Array(8); crypto.getRandomValues(a); return Array.from(a, x => CODE_ABC[x % 32]).join(''); };
    const cleanCode = v => { const c = String(v || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); return CODE_RE.test(c) ? c : ''; };
    const fmtCode = c => `${c.slice(0, 4)}-${c.slice(4)}`;
    const codeLink = c => `${location.origin}${location.pathname}?r=${c}`;
    const withTimeout = (p, ms = 12000) => Promise.race([p, new Promise((_, no) => setTimeout(() => no(Object.assign(new Error('timeout'), { code: 'unavailable' })), ms))]);
    const sharedRoutine = w => JSON.parse(JSON.stringify({ name: cut(w.name, 60, 'Routine'), schedule: w.schedule.map(d => ({ day: d.day, title: d.title, isRest: d.isRest === true, recoveryType: d.recoveryType || null,
        exercises: (d.exercises || []).slice(0, 60).map(e => ({ name: e.name, muscle: e.muscle, sets: e.sets, reps: e.reps })) })) }));
    // A friend's routine, moved onto your week: each workout stays on its weekday, starting from your first day of the week
    const alignToMyWeek = schedule => {
        const aD = DAY_NAMES, idx = aD.indexOf(StorageManager.getStartDay()), byDay = {};
        schedule.forEach(d => { byDay[d.day] = d; });
        const list = Object.keys(byDay).length === 7 ? aD.map((_, i) => byDay[aD[(idx + i) % 7]]) : schedule;
        return list.map((d, i) => ({ ...d, id: i + 1, day: aD[(idx + i) % 7] }));
    };
    const codeErr = e => (e && (e.code === 'unavailable' || /offline|network/i.test(e.message || ''))) || navigator.onLine === false
        ? t('No internet connection. Try again when online.') : t('Something went wrong. Please try again.');
    const codeSheet = (title, body) => {
        document.getElementById('code-title').textContent = title;
        const b = document.getElementById('code-body'); b.innerHTML = body;
        if (window.lucide) window.lucide.createIcons({ root: b });
        const o = document.getElementById('code-overlay');
        if (!o.classList.contains('flex') || o.classList.contains('opacity-0')) { openSheet('code-overlay', 'code-box'); pushBack('code', () => window.appActions.closeCodeSheet()); }
    };
    const shareBody = (w, code) => `<p class="text-[13px] font-bold text-slate-400 mb-4 leading-snug">${t('Share the link, or your friend can enter the code in Plan → My routines.')}</p>
        <div class="rounded-2xl bg-black/40 border border-white/10 py-6 px-4 text-center mb-4">
            <div class="text-[12px] font-bold text-slate-400 mb-2 truncate">${esc(t(w.name))}</div>
            ${code ? `<div class="code-big" dir="ltr">${fmtCode(code)}</div>` : `<div class="flex items-center justify-center gap-2 h-[41px] text-[13px] font-bold text-slate-400"><i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i>${t('Creating code…')}</div>`}
        </div>
        <div class="grid grid-cols-2 gap-2 mb-4">
            <button onclick="window.appActions.copyCode(${jsArg(code)})" ${code ? '' : 'disabled'} class="py-3.5 rounded-xl bg-[#d4af37] text-black text-[12px] font-extrabold tap-feedback flex items-center justify-center gap-2 disabled:opacity-40"><i data-lucide="copy" class="w-4 h-4"></i>${t('Copy code')}</button>
            <button onclick="window.appActions.sendCode(${jsArg(code)}, ${jsArg(t(w.name))})" ${code ? '' : 'disabled'} class="py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-[12px] font-bold tap-feedback flex items-center justify-center gap-2 disabled:opacity-40"><i data-lucide="share" class="w-4 h-4"></i>${t('Share')}</button>
        </div>
        <p class="text-[12px] font-bold text-slate-400 leading-snug flex gap-2"><i data-lucide="lock" class="w-4 h-4 shrink-0"></i><span>${t('Only the routine is shared. Your workouts and details stay private.')}</span></p>`;
    const findBody = (code = '') => `<p class="text-[13px] font-bold text-slate-400 mb-4 leading-snug">${t('Type or paste the code a friend gave you.')}</p>
        <input id="code-in" type="text" value="${esc(code ? fmtCode(code) : '')}" maxlength="12" placeholder="ABCD-EFGH" autocomplete="off" autocapitalize="characters" spellcheck="false" dir="ltr" class="code-input"
            oninput="window.appActions.codeTyped(this)" onkeydown="if(event.key==='Enter')window.appActions.codeFind()">
        <button id="code-find" onclick="window.appActions.codeFind()" class="w-full mt-3 py-3.5 rounded-xl bg-[#d4af37] text-black text-[12px] font-extrabold tap-feedback flex items-center justify-center gap-2"><i data-lucide="search" class="w-4 h-4"></i>${t('Find routine')}</button>
        <div id="code-result" class="mt-4"></div>`;
    // After a code is found: the routine and Add only (the search is gone), with a small link back to it
    const foundBody = (code, wk) => `<div class="flex items-center justify-between gap-2 mb-3">
            <span class="flex items-center gap-2 text-[13px] font-bold text-[#22c55e]"><i data-lucide="check-circle" class="w-4 h-4"></i>${t('Routine found')} · <span class="text-slate-300" dir="ltr">${fmtCode(code)}</span></span>
            <button onclick="window.appActions.openCodeSheet(${jsArg(code)})" class="shrink-0 text-[12px] font-bold text-slate-300 underline underline-offset-2 tap-feedback">${t('Use another code')}</button>
        </div>${previewHTML(wk)}`;
    const previewHTML = wk => {
        const work = wk.schedule.filter(d => !d.isRest && d.exercises.length), exN = work.reduce((a, d) => a + d.exercises.length, 0), full = appData.weeks.length >= 5;
        return `<div class="glass-card p-4 border border-[#d4af37]/30 p-pop">
            <div class="text-[17px] font-black text-white truncate">${esc(t(wk.name))}</div>
            <div class="text-[12px] font-bold text-slate-400 mb-3">${t('{a} workout days · {b} exercises', { a: work.length, b: exN })}</div>
            <div class="space-y-1.5">${wk.schedule.map(d => `<div class="flex items-center gap-3 text-[13px]"><span class="w-10 shrink-0 font-black text-slate-400">${esc(dayShort(d.day))}</span><span class="flex-1 min-w-0 truncate font-bold ${d.isRest ? 'text-slate-400' : 'text-white'}">${esc(t(d.isRest ? (d.recoveryType === 'active' ? 'Active Rest' : 'Complete Rest') : d.title))}</span>${d.isRest ? '' : `<span class="shrink-0 text-[12px] font-bold text-slate-400">${t('{n} exercises', { n: d.exercises.length })}</span>`}</div>`).join('')}</div>
        </div>
        ${full ? `<p class="text-[12px] font-bold text-red-400 mt-3">${t('You have 5 routines, the maximum. Delete one in Plan first.')}</p>` : ''}
        <button onclick="window.appActions.codeAdd()" ${full ? 'disabled' : ''} class="w-full mt-3 py-4 rounded-xl bg-[#d4af37] text-black text-[13px] font-extrabold tap-feedback flex items-center justify-center gap-2 disabled:opacity-40"><i data-lucide="plus" class="w-4 h-4"></i>${t('Add to my routines')}</button>`;
    };
    // a ?r=CODE link: remember it, clean the address bar, and open it once you're signed in
    try { const u = new URL(location.href), c = cleanCode(u.searchParams.get('r')); if (c) { sessionStorage.setItem(PENDING_CODE, c); u.searchParams.delete('r'); history.replaceState(history.state, '', u.pathname + u.search + u.hash); } } catch (e) {}
    const openPendingCode = () => {
        let c = ''; try { c = sessionStorage.getItem(PENDING_CODE) || ''; sessionStorage.removeItem(PENDING_CODE); } catch (e) {}
        if (cleanCode(c)) setTimeout(() => { window.appActions.openCodeSheet(c); window.appActions.codeFind(); }, 600);
    };
    Object.assign(window.appActions, {
        closeCodeSheet: () => { popBack('code'); closeSheet('code-overlay', 'code-box'); },
        openCodeSheet: (code = '') => { window.appState.codeFound = null; codeSheet(t('Add a routine by code'), findBody(cleanCode(code))); },
        // keeps the code tidy while typing: capitals, a dash after 4 letters
        codeTyped: el => { const c = el.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8); el.value = c.length > 4 ? fmtCode(c) : c; },
        codeFind: async () => {
            const inp = document.getElementById('code-in'), res = document.getElementById('code-result'), btn = document.getElementById('code-find'); if (!inp || !res) return;
            const code = cleanCode(inp.value);
            if (!code) { res.innerHTML = `<p class="text-[12px] font-bold text-red-400">${t('A code has 8 letters and numbers, like ABCD-EFGH.')}</p>`; return; }
            if (!Cloud.user || !Cloud.db) { res.innerHTML = `<p class="text-[12px] font-bold text-red-400">${t('Sign in to use routine codes.')}</p>`; return; }
            if (btn) btn.disabled = true;
            res.innerHTML = `<div class="flex items-center justify-center gap-2 py-4 text-[13px] font-bold text-slate-400"><i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i>${t('Looking for the routine…')}</div>`;
            if (window.lucide) window.lucide.createIcons({ root: res });
            try {
                const snap = await withTimeout(Cloud.db.doc(`shared/${code}`).get({ source: 'server' }));
                const r = snap.exists ? (snap.data() || {}).routine : null;
                const clean = isObj(r) && Array.isArray(r.schedule) ? sanitizePlan({ weeks: [{ id: 'w_' + Date.now(), name: r.name, schedule: r.schedule }] }) : null;
                if (!clean) { window.appState.codeFound = null; res.innerHTML = `<p class="text-[12px] font-bold text-red-400">${t('No routine found for this code. Check it and try again.')}</p>`; return; }
                const wk = clean.weeks[0]; wk.schedule = alignToMyWeek(wk.schedule);
                window.appState.codeFound = wk;
                codeSheet(t('Add a routine by code'), foundBody(code, wk));
            } catch (e) { console.warn('Routine code', e); res.innerHTML = `<p class="text-[12px] font-bold text-red-400">${esc(codeErr(e))}</p>`; }
            finally { if (btn) btn.disabled = false; }
        },
        codeAdd: () => {
            const wk = window.appState.codeFound; if (!wk) return;
            if (appData.weeks.length >= 5) return window.appActions.showToast(t('Up to 5 routines'), 'error');
            if (window.appState.sess) return window.appActions.showToast(t('Finish your workout first.'), 'error');
            const prev = currentWeekId;
            appData.weeks.push(wk); currentWeekId = wk.id;
            StorageManager.setPlan(appData); StorageManager.setActiveWeek(wk.id);
            window.appState.codeFound = null;
            window.appActions.closeCodeSheet();
            activeDay = getTodayId(); renderSidePanel(); window.appActions.switchTab('today');
            window.appActions.showToast(t('Routine added and set as active'), 'success', { label: t('Undo'), fn: () => {
                appData.weeks = appData.weeks.filter(w => w.id !== wk.id);
                currentWeekId = appData.weeks.some(w => w.id === prev) ? prev : appData.weeks[0].id;
                StorageManager.setPlan(appData); StorageManager.setActiveWeek(currentWeekId); renderSidePanel(); renderNav(); renderWorkout();
            } });
        },
        // Edit → a routine's share button: make (or reuse) its code
        shareWeek: async id => {
            const w = appData.weeks.find(x => x.id === id); if (!w) return;
            if (!Cloud.user || !Cloud.db) return window.appActions.showToast(t('Sign in to use routine codes.'), 'error');
            const routine = sharedRoutine(w), sig = JSON.stringify(routine);
            const saved = readJSON(SHARED_KEY, {}), mine = isObj(saved) && isObj(saved[id]) && saved[id].sig === sig ? cleanCode(saved[id].code) : '';
            if (mine) return codeSheet(t('Share routine'), shareBody(w, mine));
            codeSheet(t('Share routine'), shareBody(w, ''));
            try {
                if (navigator.onLine === false) throw Object.assign(new Error('offline'), { code: 'unavailable' });
                let code = '';
                // a new random code; if it is already taken the database says no and we pick another
                for (let i = 0; i < 3 && !code; i++) {
                    const c = newCode();
                    try { await withTimeout(Cloud.db.doc(`shared/${c}`).set({ v: 1, routine, by: Cloud.user.uid, createdAt: Date.now() })); code = c; }
                    catch (e) { if (e.code !== 'permission-denied' || i === 2) throw e; }
                }
                const all = isObj(saved) ? saved : {};
                all[id] = { code, sig };
                Object.keys(all).forEach(k => { if (!appData.weeks.some(x => x.id === k)) delete all[k]; });
                try { localStorage.setItem(SHARED_KEY, JSON.stringify(all)); } catch (e) {}
                if (document.getElementById('code-overlay').classList.contains('flex')) codeSheet(t('Share routine'), shareBody(w, code));
            } catch (e) {
                console.warn('Share routine', e);
                window.appActions.closeCodeSheet();
                window.appActions.showToast(codeErr(e), 'error');
            }
        },
        copyCode: async code => {
            if (!cleanCode(code)) return;
            try { await navigator.clipboard.writeText(fmtCode(code)); window.appActions.showToast(t('Code copied'), 'success'); }
            catch (e) { window.appActions.showToast(t('Could not copy. Use Share instead.'), 'error'); }
        },
        sendCode: async (code, name) => {
            if (!cleanCode(code)) return;
            const text = t('Try my "{name}" routine in Apex Lift. Code: {code}', { name, code: fmtCode(code) });
            if (navigator.share) { try { await navigator.share({ title: 'Apex Lift', text, url: codeLink(code) }); } catch (e) {} return; }
            window.appActions.copyCode(code);
        }
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
        { icon: 'shield-check', title: 'Sign in to start', text: 'Your workouts are saved to your account and kept in sync on all your phones.', art: 'gate' }
    ];
    const welcomeArt = a => {
        if (a === 'plan') return `<div class="w-full max-w-[290px] space-y-2.5">${[['Push', '6'], ['Pull', '6'], ['Legs', '5']].map(([n, c], i) => `<div class="flex items-center gap-3 rounded-2xl bg-white/[0.04] border border-white/10 px-4 py-3 float-${i}"><span class="w-9 h-9 rounded-full ${i === 0 ? 'bg-[#d4af37] text-black' : 'bg-white/5 text-slate-300'} flex items-center justify-center text-[12px] font-bold">${(d => d.charAt(0) + d.slice(1).toLowerCase())(tDay(['SAT', 'SUN', 'MON'][i]).slice(0, 3))}</span><span class="flex-1 text-[15px] font-black text-white">${t(n)}</span><span class="text-[12px] font-bold text-slate-400">${t('{n} exercises', { n: c })}</span></div>`).join('')}</div>`;
        if (a === 'sets') return `<div class="w-full max-w-[290px] rounded-2xl bg-white/[0.04] border border-white/10 p-3 space-y-2" dir="ltr">${[['60', '10', 1], ['60', '9', 1], ['60', '8', 0]].map(([w, r, d], i) => `<div class="grid grid-cols-[28px_1fr_1fr_44px] gap-2 items-center"><span class="w-7 h-7 rounded-full ${d ? 'bg-[#22c55e] text-black' : 'bg-white/5 text-slate-300'} text-[12px] font-bold flex items-center justify-center">${i + 1}</span><span class="h-10 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center text-[15px] font-black text-[#d4af37]">${w}</span><span class="h-10 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center text-[15px] font-black text-white">${r}</span><span class="h-10 rounded-lg flex items-center justify-center ${d ? 'bg-[#22c55e] text-black' : 'bg-white/5 border border-white/10 text-slate-400'} ${i === 1 ? 'pop-loop' : ''}"><i data-lucide="check" class="w-5 h-5"></i></span></div>`).join('')}<div class="mt-1 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/25 px-3 py-2 flex items-center gap-2 text-[#22c55e] text-[12px] font-bold"><i data-lucide="timer" class="w-4 h-4"></i>${t('Rest')} <span class="text-white text-[16px]">1:30</span></div></div>`;
        if (a === 'chart') return `<div class="w-full max-w-[290px] rounded-2xl bg-white/[0.04] border border-white/10 p-4"><div class="flex items-center justify-between mb-2"><span class="text-[13px] font-bold text-white ex-name">Bench Press</span><span class="text-[12px] font-bold text-[#22c55e]" dir="ltr">+12.5kg</span></div><svg viewBox="0 0 260 110" class="w-full h-auto" dir="ltr"><defs><linearGradient id="wg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#d4af37" stop-opacity=".35"/><stop offset="1" stop-color="#d4af37" stop-opacity="0"/></linearGradient></defs><path d="M5 95 L45 85 L85 80 L125 62 L165 58 L205 40 L255 18 L255 110 L5 110 Z" fill="url(#wg)"/><path class="draw-line" d="M5 95 L45 85 L85 80 L125 62 L165 58 L205 40 L255 18" fill="none" stroke="#d4af37" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="255" cy="18" r="5" fill="#d4af37"/></svg><div class="mt-2 inline-flex items-center gap-1 text-[12px] font-bold px-2 py-1 rounded-md border text-[#22c55e] bg-[#22c55e]/10 border-[#22c55e]/20"><i data-lucide="arrow-up-circle" class="w-3 h-3"></i>${t('Add weight:')} <span dir="ltr">62.5kg × 8</span></div></div>`;
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
        const gate = document.getElementById('welcome-gate');
        // the Terms and Privacy Policy are agreed in a pop-up after choosing Google or email (see needAgree)
        if (gate) gate.innerHTML = `${isSignedIn()
                ? `<button id="welcome-continue" onclick="window.appActions.welcomeContinue()" class="w-full py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-black tap-feedback disabled:opacity-40 transition-opacity">${t('Continue')}</button>`
                : `<button id="welcome-google" onclick="window.appActions.welcomeSignIn()" ${loading ? 'disabled' : ''} class="w-full py-4 rounded-2xl bg-white text-[#1f1f1f] text-[15px] font-bold flex items-center justify-center gap-3 tap-feedback disabled:opacity-40 transition-opacity">${GOOGLE_G}${loading ? t('Signing in…') : t('Continue with Google')}</button>
                   <button id="welcome-email" onclick="window.appActions.openEmail('in')" ${loading ? 'disabled' : ''} class="w-full mt-2.5 py-4 rounded-2xl bg-white/5 border border-white/15 text-white text-[15px] font-bold flex items-center justify-center gap-3 tap-feedback disabled:opacity-40 transition-opacity"><i data-lucide="mail" class="w-5 h-5"></i>${t('Continue with email')}</button>`}
               <p class="text-[12px] font-bold text-slate-400 text-center mt-4"><a href="terms.html" target="_blank" rel="noopener" class="underline underline-offset-2">${t('Terms of Use')}</a> · <a href="privacy.html" target="_blank" rel="noopener" class="underline underline-offset-2">${t('Privacy Policy')}</a></p>`;
        if (gate && !isSignedIn() && inAppBrowser()) gate.insertAdjacentHTML('afterbegin', inAppNoteHTML());
        if (gate && !isSignedIn() && !requireSignIn()) gate.insertAdjacentHTML('beforeend', `<button id="welcome-later" onclick="window.appActions.welcomeLater()" class="w-full mt-3 py-3 text-[13px] font-bold text-slate-400 tap-feedback">${t('Not now')}</button>`);
        document.getElementById('welcome-actions').innerHTML = last ? '' : `<div class="flex gap-3"><button onclick="window.appActions.welcomeGo(${W_SLIDES.length - 1})" class="px-5 py-4 rounded-2xl text-[13px] font-bold text-slate-400 tap-feedback">${t('Skip')}</button><button onclick="window.appActions.welcomeGo(${welcomeIdx + 1})" class="flex-1 py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-black tap-feedback flex items-center justify-center gap-2">${t('Next')}<i data-lucide="${isAR ? 'arrow-left' : 'arrow-right'}" class="w-5 h-5"></i></button></div>`;
        if (window.lucide) window.lucide.createIcons({ root: document.getElementById('welcome-overlay') });
    };
    // inside another app's browser: how to open Apex Lift in the phone's real browser, so the sign-in is kept
    const inAppNoteHTML = () => {
        const ios = platformName() === 'ios', url = location.origin + location.pathname;
        const btn = 'flex-1 min-h-[44px] px-3 whitespace-nowrap rounded-xl bg-white/5 border border-white/10 text-white text-[13px] font-bold flex items-center justify-center gap-2 tap-feedback';
        return `<div class="mb-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-start" role="note">
            <div class="flex items-start gap-3"><i data-lucide="triangle-alert" class="w-5 h-5 text-slate-300 shrink-0 mt-0.5"></i>
                <div><p class="text-[13px] font-bold text-white leading-snug">${t('Open Apex Lift in your browser')}</p>
                <p class="text-[12px] font-bold text-slate-400 leading-snug mt-1">${t(ios ? "You're inside another app, which signs you out when it closes. Tap ••• or the share button, then Open in Safari." : "You're inside another app, which signs you out when it closes. Open Apex Lift in Chrome to stay signed in.")}</p></div></div>
            <div class="flex gap-2 mt-3">
                ${ios ? '' : `<a href="intent://${esc(location.host + location.pathname)}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url)};end" class="${btn}"><i data-lucide="external-link" class="w-4 h-4"></i>${t('Open in Chrome')}</a>`}
                <button type="button" onclick="window.appActions.copyAppLink()" class="${btn}"><i data-lucide="copy" class="w-4 h-4"></i>${t('Copy link')}</button>
            </div></div>`;
    };
    Object.assign(window.appActions, {
        copyAppLink: async () => {
            const url = location.origin + location.pathname;
            try { await navigator.clipboard.writeText(url); window.appActions.showToast(t('Link copied'), 'success'); }
            catch (e) { window.prompt(t('Copy link'), url); }
        }
    });
    const showWelcome = (toLast = false) => {
        const o = document.getElementById('welcome-overlay');
        if (!welcomeOpen()) { o.classList.remove('hidden'); o.classList.add('flex'); welcomeIdx = 0; renderWelcome(); }
        if (toLast) window.appActions.welcomeGo(W_SLIDES.length - 1, true);
        // get the sign-in ready while the welcome pages are read: tapping Google then opens its window straight away
        // (downloading it after the tap took seconds, and some phones then block or lose Google's window)
        if (!Cloud.auth && navigator.onLine !== false) setTimeout(() => loadFirebase().catch(() => {}), 1500);
    };
    const hideWelcome = () => {
        const o = document.getElementById('welcome-overlay'); if (!welcomeOpen()) return;
        try { localStorage.setItem(INTRO_KEY, '1'); } catch (e) {}
        o.classList.add('fade-out'); setTimeout(() => { o.classList.add('hidden'); o.classList.remove('flex', 'fade-out'); uncoverApp(); }, 350);
    };
    // require-sign-in.js covers the app until you are signed in: take the cover away
    const uncoverApp = () => document.documentElement.classList.remove('apex-gate');
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
    const kindLabel = k => k === 'auto' ? t('Automatic') : k === 'before-restore' ? t('Before restore') : k === 'before-import' ? t('Before import') : k === 'before-coach' ? t('Before coach update') : t('Manual');
    const renderBackups = async () => {
        const list = document.getElementById('backups-list');
        list.innerHTML = `<div class="p-8 text-center text-[12px] font-bold text-slate-400">${t('Loading…')}</div>`;
        try {
            const all = await listBackups();
            if (!all.length) { list.innerHTML = `<div class="p-8 text-center text-[13px] font-bold text-slate-400">${t('No backups yet. Tap Back up now to make the first one.')}</div>`; return; }
            list.innerHTML = all.map(b => `<div class="flex items-center gap-3 px-5 py-3.5 border-b border-white/5">
                <span class="w-10 h-10 rounded-full ${b.kind === 'auto' ? 'bg-white/5 text-slate-300' : 'bg-[#d4af37]/15 text-[#d4af37]'} flex items-center justify-center shrink-0"><i data-lucide="${b.kind === 'auto' ? 'clock' : b.kind === 'before-restore' || b.kind === 'before-import' ? 'rotate-ccw' : 'save'}" class="w-5 h-5"></i></span>
                <div class="flex-1 min-w-0"><div class="text-[14px] font-black text-white">${esc(fmtDate(b.createdAt, true))}</div><div class="text-[12px] font-bold text-slate-400">${esc(kindLabel(b.kind))} · ${t('{n} workouts', { n: Number(b.workouts) || 0 })} · ${t('{n} exercises', { n: Number(b.exercises) || 0 })}</div></div>
                <button onclick="window.appActions.restoreBackup(${jsArg(b.id)}, ${jsArg(fmtDate(b.createdAt, true))})" class="shrink-0 px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-[12px] font-bold text-white tap-feedback">${t('Restore')}</button>
            </div>`).join('');
            if (window.lucide) window.lucide.createIcons({ root: list });
        } catch (e) {
            console.warn(e);
            list.innerHTML = `<div class="p-8 text-center text-[13px] font-bold text-red-400">${e && /permission/i.test(e.code || '') ? t('Backup isn\'t available right now. Try again later.') : t('Could not load backups. Check your connection.')}</div>`;
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
    // another tab opened: take the tip away without marking it seen (it shows again next time on its own screen)
    const dropHint = () => { if (!hintBox) return; const { el, target } = hintBox; hintBox = null; if (target) target.classList.remove('hint-ring'); el.remove(); };
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
            el.innerHTML = `<div class="flex items-start gap-2.5"><i data-lucide="lightbulb" class="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5"></i><p class="text-[13px] font-bold text-white leading-snug flex-1">${esc(text)}</p></div><div class="flex justify-end mt-2.5"><span class="px-3 py-1.5 rounded-lg bg-[#d4af37] text-black text-[12px] font-extrabold">${t('Got it')}</span></div>`;
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
        // Terms of Use + Privacy Policy pop-up, shown once after choosing Google or email (or Continue, when a new
        // version needs agreeing). Agree runs the chosen sign-in straight away, in the same tap (so Google's window can open).
        needAgree: next => {
            if (getAgree()) return next();
            window.appState.agreeNext = next;
            const link = (href, txt) => `<a href="${href}" target="_blank" rel="noopener" class="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[13px] font-bold text-white tap-feedback">${txt}<i data-lucide="arrow-up-right" class="w-4 h-4 text-slate-400 shrink-0"></i></a>`;
            const box = document.getElementById('agree-box');
            box.innerHTML = `<div class="text-center" dir="${isAR ? 'rtl' : 'ltr'}">
                <span class="w-14 h-14 mx-auto mb-4 rounded-full bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center"><i data-lucide="shield-check" class="w-7 h-7"></i></span>
                <h3 id="agree-title" class="text-xl font-black text-white mb-2">${t('Before you continue')}</h3>
                <p class="text-[13px] font-bold text-slate-400 leading-relaxed mb-5">${t('Review the Terms of Use and Privacy Policy to continue.')}</p>
                <div class="space-y-2 mb-5 text-start">${link('terms.html', t('Terms of Use'))}${link('privacy.html', t('Privacy Policy'))}</div>
                <button id="agree-yes" onclick="window.appActions.agreeYes()" class="w-full py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-extrabold tap-feedback">${t('I agree, continue')}</button>
                <button onclick="window.appActions.agreeNo()" class="w-full mt-2 py-3 text-[13px] font-bold text-slate-400 tap-feedback">${t('Cancel')}</button>
            </div>`;
            if (window.lucide) window.lucide.createIcons({ root: box });
            const o = document.getElementById('agree-overlay');
            if (!o.classList.contains('flex') || o.classList.contains('opacity-0')) { openModal('agree-overlay', 'agree-box'); pushBack('agree', () => window.appActions.agreeNo()); }
        },
        agreeYes: () => {
            try { localStorage.setItem(AGREE_KEY, JSON.stringify({ v: TERMS_VERSION, at: Date.now() })); } catch (e) {}
            const next = window.appState.agreeNext; window.appState.agreeNext = null;
            popBack('agree'); closeModal('agree-overlay', 'agree-box');
            if (next) next();
        },
        agreeNo: () => { window.appState.agreeNext = null; popBack('agree'); closeModal('agree-overlay', 'agree-box'); },
        // body weight (Profile and Progress → Body); everything else in Your profile is set in the setup
        // only body weight can change after the setup; returns true when it was saved
        setAbout: (field, value) => {
            if (field !== 'weightKg') { window.appActions.showToast(t("This can't be changed."), 'error'); return false; }
            const b = getBody(), w = parseFloat(latinDigits(String(value)).trim().replace(/[\u066B\u060C,]/g, '.'));
            if (!(w >= 25 && w <= 350)) { window.appActions.showToast(t('Enter your weight in kg (25–350).'), 'error'); renderAccountSheet(); return false; }
            b.weightKg = Math.round(w * 10) / 10;
            b.log = [...(b.log || []).filter(x => dateKey(x.t) !== dateKey()), { t: Date.now(), kg: b.weightKg }];
            setBody(b);
            return true;
        },
        welcomeLater: () => { if (requireSignIn() && !isSignedIn()) return; hideWelcome(); window.appActions.initOnboarding(); },
        welcomeContinue: () => {
            if (!getAgree()) return window.appActions.needAgree(() => window.appActions.welcomeContinue());
            hideWelcome(); window.appActions.initOnboarding();
            if (Cloud.user) { Cloud.sent.main = ''; scheduleFlush(300); } // save the agreement to the account
        },
        welcomeSignIn: () => {
            if (navigator.onLine === false) return window.appActions.showToast(t('No internet connection. Try again when online.'), 'error');
            window.appActions.needAgree(() => window.appActions.cloudSignIn());
        },
        openBackups: () => { if (!Cloud.user) return; openSheet('backups-overlay', 'backups-box'); pushBack('backups', () => window.appActions.closeBackups()); renderBackups(); },
        closeBackups: () => { popBack('backups'); closeSheet('backups-overlay', 'backups-box'); },
        backupNow: async () => {
            const b = document.getElementById('backups-now'); if (b.disabled) return;
            b.disabled = true; b.classList.add('opacity-60');
            try { await cloudBackup('manual'); window.appActions.showToast(t('Backup saved to your account'), 'success'); renderBackups(); }
            catch (e) { console.warn(e); window.appActions.showToast(e && /permission/i.test(e.code || '') ? t('Backup isn\'t available right now. Try again later.') : t('Could not save the backup. Check your connection.'), 'error'); }
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

    const themeChoice = () => { try { const v = localStorage.getItem('workoutTheme_rakan_final'); return ['light', 'system'].includes(v) ? v : 'dark'; } catch (e) { return 'dark'; } };
    const phoneLight = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;
    const applyTheme = () => {
        const v = themeChoice(), light = v === 'light' || (v === 'system' && !!phoneLight && phoneLight.matches);
        if (light) document.documentElement.setAttribute('data-theme', 'light'); else document.documentElement.removeAttribute('data-theme');
        const m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', light ? '#f3f3f0' : '#000000');
    };
    if (phoneLight && phoneLight.addEventListener) phoneLight.addEventListener('change', () => { if (themeChoice() === 'system') applyTheme(); });
    // Apply the language to the fixed parts of the page (index.html) and set right-to-left for Arabic
    // 🔢 ARABIC DIGITS: in Arabic, numbers shown on screen use ٠١٢٣٤٥٦٧٨٩ and the Arabic decimal mark (like iOS).
    // Done on the page itself, so every screen, chart and toast is covered; stored data and typed boxes keep 0-9.
    // Routine codes (.code-big, .latin-num) stay in 0-9 so they can be read out and typed in.
    const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
    // also "60kg" → "60 كجم": units written in the code are translated where they are shown
    const toArDigits = str => str.replace(/(\d)\s?kg\b/g, '$1 كجم').replace(/\bkg\b/g, 'كجم').replace(/(\d)\.(?=\d)/g, '$1٫').replace(/\d/g, d => AR_DIGITS[d]);
    const arDigitsIn = root => {
        if (!isAR || !root) return;
        const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => /\d|\bkg\b/.test(n.nodeValue) && !(n.parentElement && n.parentElement.closest('script, style, textarea, .code-big, .latin-num')) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT });
        const list = []; while (w.nextNode()) list.push(w.currentNode);
        list.forEach(n => { n.nodeValue = toArDigits(n.nodeValue); });
    };
    if (isAR) {
        new MutationObserver(ms => ms.forEach(m => { if (m.type === 'characterData') arDigitsIn(m.target.parentNode); else m.addedNodes.forEach(n => n.nodeType === 3 ? arDigitsIn(n.parentNode) : n.nodeType === 1 && arDigitsIn(n)); }))
            .observe(document.body, { childList: true, subtree: true, characterData: true });
        document.addEventListener('DOMContentLoaded', () => arDigitsIn(document.body));
        arDigitsIn(document.body);
    }
    const applyStaticLanguage = () => {
        document.documentElement.lang = LANG;
        // Arabic keeps the English layout (nothing moves); only the text lines start from the right (style.css)
        document.documentElement.dir = 'ltr';
        document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
        document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
        document.querySelectorAll('#setting-start-day option').forEach(o => { o.textContent = tDay(o.value); });
        const ls = document.getElementById('setting-lang'); if (ls) ls.value = LANG;
        const th = document.getElementById('setting-theme'); if (th) th.value = themeChoice();
        const ver = document.getElementById('app-version'); if (ver) ver.textContent = APP_VERSION;
    };
    applyStaticLanguage();
    window.appActions.switchTab('today');
    enableSwipeDown(document.getElementById('picker-box'), () => window.appActions.closePicker());
    enableSwipeDown(document.getElementById('history-modal-box'), () => window.appActions.closeHistoryModal());
    enableSwipeDown(document.getElementById('programs-box'), () => window.appActions.closePrograms());
    enableSwipeDown(document.getElementById('ai-box'), () => window.appActions.closeAI());
    enableDaySwipe(document.querySelector('.scrollable-content')); // the whole Today screen, so rest days (one small card) swipe too
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

    // Without an account, a reminder to export (no pop-ups): red dot on the Profile tab + "Last export" under Export data
    const updateBackupStatus = () => {
        let lB = StorageManager.getBackupDate();
        if (!lB) { StorageManager.setBackupDate(); lB = Date.now(); }
        const days = Math.floor((Date.now() - lB) / 86400000), old = days >= 7 && !Cloud.user && !getCloudFlag();
        const age = document.getElementById('backup-age');
        // signed in, everything is already kept in the account: the file is for sharing or for an AI
        const synced = !!(Cloud.user || getCloudFlag());
        if (age) { age.textContent = synced ? t('Save or share a copy') : days < 1 ? t('Last export: today') : t('Last export: {n} days ago', { n: days }); age.classList.toggle('is-warn', old); }
    };
    updateBackupStatus();
    renderAccount();
    cloudKick();
    // First launch (or signed out): intro pages + sign-in. Signed in: straight to the app (setup questions if needed).
    setTimeout(() => {
        const introSeen = localStorage.getItem(INTRO_KEY) === '1', pending = !!(getCloudFlag() || {}).pending;
        // back from Google's full-page sign-in: the sign-in page shows "Signing in…" until the account is loaded
        if (pending && Cloud.status === 'off') setCloudStatus('loading');
        if (gateOn() && ((!isSignedIn() && (requireSignIn() || !introSeen)) || (isSignedIn() && !getAgree()))) showWelcome(introSeen || isSignedIn() || pending);
        else { uncoverApp(); window.appActions.initOnboarding(); }
        openAuthLink();
    }, 300);
    // Coming back to the app on a new day: jump to today (unless a workout is open)
    let lastToday = getTodayId();
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState !== 'visible') return;
        if (window.appState.sess) return;
        const now = getTodayId();
        if (now !== lastToday) { lastToday = now; activeDay = now; renderNav(); renderWorkout(); }
    });
    // 📶 OFFLINE SUPPORT: save a copy of the app on the phone (see sw.js)
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
        window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(err => console.warn('Offline mode unavailable:', err)));
    }
})();
