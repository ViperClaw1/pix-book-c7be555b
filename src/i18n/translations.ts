export type Lang = "en" | "ru" | "kk";

export const LANGS: { code: Lang; label: string; native: string }[] = [
  { code: "en", label: "EN", native: "English" },
  { code: "ru", label: "RU", native: "Русский" },
  { code: "kk", label: "KK", native: "Қазақша" },
];

type Dict = {
  meta: { title: string; description: string; ogDescription: string };
  nav: { features: string; how: string; faq: string; getApp: string; language: string };
  hero: { taglinePeople: string; taglineInspire: string; taglineExplore: string; taglineAnyPlace: string; srTitle: string };
  store: { downloadOn: string; appStore: string; getItOn: string; googlePlay: string };
  marquee: { restaurants: string; salons: string; nightlife: string; events: string };
  pains: { eyebrow: string; title1: string; title2: string; items: { title: string; desc: string }[] };
  solution: { line1: string; line2: string; sub: string };
  showcase: { eyebrow: string; title: string; desc: string; alt: string };
  features: {
    smart: { eyebrow: string; title: string; desc: string };
    vibe: { eyebrow: string; title: string; desc: string };
    crowd: { eyebrow: string; title: string; desc: string };
    social: { eyebrow: string; title: string; desc: string };
  };
  demo: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    intro: string;
    stepLabel: string;
    nowLabel: string;
    steps: { title: string; desc: string }[];
  };
  stats: { value: string; label: string }[];
  testimonials: { title: string; items: { quote: string; name: string; role: string }[] };
  faq: { title: string; items: { q: string; a: string }[] };
  finalCta: { titleA: string; titleB: string; desc: string };
  footer: {
    tagline: string;
    product: string;
    legal: string;
    getApp: string;
    privacy: string;
    terms: string;
    returns: string;
    dataDeletion: string;
    rights: string;
    madeIn: string;
  };
  cookies: {
    title: string;
    body: string;
    privacyLink: string;
    acceptAll: string;
    rejectAll: string;
    customize: string;
    save: string;
    close: string;
    necessaryTitle: string;
    necessaryDesc: string;
    functionalTitle: string;
    functionalDesc: string;
    analyticsTitle: string;
    analyticsDesc: string;
    marketingTitle: string;
    marketingDesc: string;
  };
};

const en: Dict = {
  meta: {
    title: "Pixap — AI Concierge for Bookings in Almaty",
    description: "Pixap is an AI concierge that finds places, talks to venues on WhatsApp, and confirms your booking in under a minute. Restaurants, salons, tours and more in Almaty.",
    ogDescription: "Find a place, let the AI handle the WhatsApp back-and-forth, and get a confirmed booking in under a minute.",
  },
  nav: { features: "Features", how: "How it works", faq: "FAQ", getApp: "Get the app", language: "Language" },
  hero: {
    taglinePeople: "People.", taglineInspire: "Inspire.", taglineExplore: "eXplore.", taglineAnyPlace: "Any Place.",
    srTitle: "Pixap — AI Concierge for Booking Any Place",
  },
  store: { downloadOn: "Download on the", appStore: "App Store", getItOn: "Get it on", googlePlay: "Google Play" },
  marquee: { restaurants: "Restaurants", salons: "Salons & Spa", nightlife: "Nightlife", events: "Events" },
  pains: {
    eyebrow: "The booking problem",
    title1: "Booking shouldn’t feel",
    title2: "like a part-time job.",
    items: [
      { title: "Five apps, one night", desc: "Reservations here, tickets there, group chat everywhere." },
      { title: "Guessing the vibe", desc: "Photos lie. You only know the mood once you arrive." },
      { title: "Lost in the group chat", desc: "Plans dissolve in a thread of ‘maybe later’ replies." },
      { title: "Packed or empty", desc: "No way to see how crowded a place is right now." },
    ],
  },
  solution: {
    line1: "Tell Pixap what you want.",
    line2: "We handle the rest.",
    sub: "An AI concierge that finds the perfect place, talks to the venue on WhatsApp, and confirms your booking — in less than a minute.",
  },
  showcase: {
    eyebrow: "See it in motion",
    title: "One app for the whole night.",
    desc: "From the first craving to the last stop — Pixap plans it, books it, matches the vibe, and reads the room in real time.",
    alt: "Pixap app screens: planning a journey, AI concierge, smart route with vibe match, social booking and the final plan view",
  },
  features: {
    smart: {
      eyebrow: "Pix AI Smart Booking",
      title: "Just say it. We book it.",
      desc: "Tell Pix AI what you’re in the mood for — cuisine, music, budget, time. It negotiates with venues on WhatsApp and locks in a confirmed seat in under a minute.",
    },
    vibe: {
      eyebrow: "Vibe Matching",
      title: "Find places that feel like you.",
      desc: "Calm, luxury, social, underground — pick your vibe and Pixap surfaces the venues whose energy matches yours tonight.",
    },
    crowd: {
      eyebrow: "Live Crowd Metrics",
      title: "See the room before you go.",
      desc: "Real-time crowd levels, wait times and energy reads from every spot — so you walk into the night you actually wanted.",
    },
    social: {
      eyebrow: "Social + Booking, One Place",
      title: "Plan together. Book together.",
      desc: "Invite friends, vote on the plan, split the bill, and confirm dinner, drinks and the club in one shared timeline.",
    },
  },
  demo: {
    eyebrow: "The flow",
    titleA: "Four taps.",
    titleB: "Zero friction.",
    intro: "Watch how Pixap turns a vague craving into a confirmed booking — without you ever picking up the phone.",
    stepLabel: "Step",
    nowLabel: "Now: Step",
    steps: [
      { title: "Describe your night", desc: "Tell Pix AI the vibe, the crew, the hours — in your own words." },
      { title: "Match the vibe", desc: "AI ranks venues by your taste, live crowd levels, and distance." },
      { title: "Build the plan", desc: "Dinner, drinks, club — chained into one smart route with your friends." },
      { title: "Arrive", desc: "One pass, all stops. Walk in, skip the line, enjoy the night." },
    ],
  },
  stats: [
    { value: "<60s", label: "From idea to confirmed plan" },
    { value: "Live", label: "Crowd & wait-time data, always on" },
    { value: "1 app", label: "Plan, book, split and arrive together" },
  ],
  testimonials: {
    title: "Loved by early adopters.",
    items: [
      { quote: "Friday night, six friends, three venues — all confirmed in two minutes. Pix AI just runs the night.", name: "Aliya K.", role: "Almaty" },
      { quote: "The vibe match nailed it. Calm dinner, social bar, underground club — exactly the night I described.", name: "Daniyar M.", role: "Astana" },
      { quote: "Seeing live crowd levels before we leave the house is a cheat code. No more dead rooms.", name: "Saule T.", role: "Almaty" },
    ],
  },
  faq: {
    title: "Questions, answered.",
    items: [
      { q: "What is Pix AI smart booking?", a: "Pix AI is the concierge inside the app. You describe what you want, it talks to venues on WhatsApp in real time and returns a confirmed booking — no calls, no DMs from you." },
      { q: "How does vibe matching work?", a: "Pick a mood — calm, luxury, social or underground — and Pixap ranks venues by their crowd energy, music, design and reviews so the result actually feels right." },
      { q: "What are live crowd metrics?", a: "We show real-time occupancy, wait time and energy level for partner venues, so you can decide between two places without leaving the couch." },
      { q: "Can I plan a night with friends?", a: "Yes. Invite your group, vote on places, build a multi-stop route, split the bill, and let Pix AI lock every reservation at once." },
      { q: "Where is Pixap available?", a: "Launching in Almaty, Kazakhstan, with expansion to more cities soon." },
    ],
  },
  finalCta: {
    titleA: "Stop calling.",
    titleB: "Start booking.",
    desc: "Join the waitlist of people who let Pixap’s AI handle every booking. Free to download. No credit card required.",
  },
  footer: {
    tagline: "The AI booking concierge for everything you used to call about.",
    product: "Product", legal: "Legal", getApp: "Get the app",
    privacy: "Privacy Policy", terms: "User Agreement", returns: "Return Policy", dataDeletion: "Data Deletion",
    rights: "All rights reserved.", madeIn: "Made with care in Almaty.",
  },
  cookies: {
    title: "We value your privacy",
    body: "We use cookies to keep Pixap running, analyze usage, and improve the experience. You can accept all, reject non-essential, or pick what you allow. Read our",
    privacyLink: "Privacy Policy",
    acceptAll: "Accept all",
    rejectAll: "Reject non-essential",
    customize: "Customize",
    save: "Save preferences",
    close: "Close and reject non-essential cookies",
    necessaryTitle: "Strictly necessary",
    necessaryDesc: "Required for the site to function. Always on.",
    functionalTitle: "Functional",
    functionalDesc: "Remembers your preferences (theme, language).",
    analyticsTitle: "Analytics",
    analyticsDesc: "Anonymous usage stats (Google Analytics) so we can improve.",
    marketingTitle: "Marketing",
    marketingDesc: "Measure ad performance and conversions.",
  },
};

const ru: Dict = {
  meta: {
    title: "Pixap — AI-консьерж для бронирований в Алматы",
    description: "Pixap — это AI-консьерж, который находит места, общается с заведениями в WhatsApp и подтверждает бронь меньше чем за минуту. Рестораны, салоны, туры и многое другое в Алматы.",
    ogDescription: "Найдите место, доверьте AI переписку в WhatsApp и получите подтверждённую бронь меньше чем за минуту.",
  },
  nav: { features: "Возможности", how: "Как это работает", faq: "Вопросы", getApp: "Скачать", language: "Язык" },
  hero: {
    taglinePeople: "Люди.", taglineInspire: "Вдохновение.", taglineExplore: "Открытия.", taglineAnyPlace: "Любое место.",
    srTitle: "Pixap — AI-консьерж для бронирования любого места",
  },
  store: { downloadOn: "Скачать в", appStore: "App Store", getItOn: "Доступно в", googlePlay: "Google Play" },
  marquee: { restaurants: "Рестораны", salons: "Салоны и спа", nightlife: "Ночная жизнь", events: "Мероприятия" },
  pains: {
    eyebrow: "Проблема бронирований",
    title1: "Бронировать не должно быть",
    title2: "как вторая работа.",
    items: [
      { title: "Пять приложений на один вечер", desc: "Брони здесь, билеты там, переписка везде." },
      { title: "Угадай атмосферу", desc: "Фото обманывают. Настроение узнаёшь только на месте." },
      { title: "Потеряны в общем чате", desc: "Планы тонут в потоке «давай позже»." },
      { title: "Полно или пусто", desc: "Невозможно понять, насколько место загружено сейчас." },
    ],
  },
  solution: {
    line1: "Скажите Pixap, чего вы хотите.",
    line2: "Остальное — на нас.",
    sub: "AI-консьерж, который находит идеальное место, общается с заведением в WhatsApp и подтверждает вашу бронь — меньше чем за минуту.",
  },
  showcase: {
    eyebrow: "Посмотрите в действии",
    title: "Одно приложение на весь вечер.",
    desc: "От первой идеи до последней точки — Pixap планирует, бронирует, подбирает атмосферу и считывает настроение зала в реальном времени.",
    alt: "Экраны приложения Pixap: планирование вечера, AI-консьерж, умный маршрут с подбором атмосферы, совместное бронирование и финальный план",
  },
  features: {
    smart: {
      eyebrow: "Умное бронирование Pix AI",
      title: "Просто скажите. Мы забронируем.",
      desc: "Расскажите Pix AI, чего хотите — кухня, музыка, бюджет, время. Он договорится с заведениями в WhatsApp и закрепит подтверждённый столик меньше чем за минуту.",
    },
    vibe: {
      eyebrow: "Подбор по атмосфере",
      title: "Находите места, которые вам по душе.",
      desc: "Спокойно, премиум, шумно, андеграунд — выберите свою атмосферу, и Pixap подберёт заведения, чья энергетика совпадает с вашей сегодня.",
    },
    crowd: {
      eyebrow: "Метрики посещаемости в реальном времени",
      title: "Загляните в зал ещё до выхода из дома.",
      desc: "Загрузка, ожидание и уровень энергии в каждой точке — чтобы вечер прошёл именно так, как вы задумали.",
    },
    social: {
      eyebrow: "Соцсеть + бронь в одном месте",
      title: "Планируйте вместе. Бронируйте вместе.",
      desc: "Зовите друзей, голосуйте за план, делите счёт и подтверждайте ужин, бар и клуб в одной общей ленте.",
    },
  },
  demo: {
    eyebrow: "Процесс",
    titleA: "Четыре касания.",
    titleB: "Ноль трений.",
    intro: "Смотрите, как Pixap превращает смутное желание в подтверждённую бронь — без единого звонка.",
    stepLabel: "Шаг",
    nowLabel: "Сейчас: шаг",
    steps: [
      { title: "Опишите свой вечер", desc: "Расскажите Pix AI про атмосферу, компанию и время — своими словами." },
      { title: "Поймайте атмосферу", desc: "AI ранжирует заведения по вашему вкусу, загрузке и расстоянию." },
      { title: "Соберите план", desc: "Ужин, бар, клуб — в одном умном маршруте с вашими друзьями." },
      { title: "Приходите", desc: "Один пропуск на все точки. Заходите без очередей и наслаждайтесь вечером." },
    ],
  },
  stats: [
    { value: "<60с", label: "От идеи до подтверждённого плана" },
    { value: "Live", label: "Данные о загрузке и ожидании — всегда онлайн" },
    { value: "1 app", label: "Планируйте, бронируйте, делите счёт вместе" },
  ],
  testimonials: {
    title: "Любят ранние пользователи.",
    items: [
      { quote: "Пятница, шесть друзей, три места — всё подтверждено за две минуты. Pix AI просто ведёт вечер.", name: "Алия К.", role: "Алматы" },
      { quote: "Подбор по атмосфере попал в точку. Спокойный ужин, шумный бар, андеграунд — ровно тот вечер, который я описала.", name: "Данияр М.", role: "Астана" },
      { quote: "Видеть загрузку заведений ещё дома — это чит-код. Никаких пустых залов.", name: "Сауле Т.", role: "Алматы" },
    ],
  },
  faq: {
    title: "Ответы на вопросы.",
    items: [
      { q: "Что такое умное бронирование Pix AI?", a: "Pix AI — это консьерж внутри приложения. Вы описываете, чего хотите, он общается с заведениями в WhatsApp в реальном времени и возвращает подтверждённую бронь — без звонков и переписки с вашей стороны." },
      { q: "Как работает подбор по атмосфере?", a: "Выберите настроение — спокойно, премиум, шумно или андеграунд — и Pixap ранжирует заведения по энергетике, музыке, дизайну и отзывам, чтобы результат действительно совпал с ощущением." },
      { q: "Что такое метрики посещаемости в реальном времени?", a: "Мы показываем загрузку, время ожидания и уровень энергии у партнёрских заведений, чтобы выбрать между двумя местами, не выходя из дома." },
      { q: "Можно ли спланировать вечер с друзьями?", a: "Да. Пригласите компанию, голосуйте за места, постройте маршрут из нескольких точек, разделите счёт, а Pix AI закрепит все брони сразу." },
      { q: "Где работает Pixap?", a: "Запускаемся в Алматы, Казахстан, и скоро расширяемся в другие города." },
    ],
  },
  finalCta: {
    titleA: "Хватит звонить.",
    titleB: "Начните бронировать.",
    desc: "Присоединяйтесь к тем, кто доверяет AI Pixap каждую бронь. Бесплатно. Без банковской карты.",
  },
  footer: {
    tagline: "AI-консьерж для всего, ради чего вы раньше звонили.",
    product: "Продукт", legal: "Правовая информация", getApp: "Скачать приложение",
    privacy: "Политика конфиденциальности", terms: "Пользовательское соглашение", returns: "Политика возврата", dataDeletion: "Удаление данных",
    rights: "Все права защищены.", madeIn: "Сделано с заботой в Алматы.",
  },
  cookies: {
    title: "Мы ценим вашу приватность",
    body: "Мы используем cookies, чтобы Pixap работал, анализировать использование и улучшать сервис. Можно принять всё, отклонить необязательные или выбрать вручную. Подробнее — в нашей",
    privacyLink: "Политике конфиденциальности",
    acceptAll: "Принять все",
    rejectAll: "Отклонить необязательные",
    customize: "Настроить",
    save: "Сохранить выбор",
    close: "Закрыть и отклонить необязательные cookies",
    necessaryTitle: "Строго необходимые",
    necessaryDesc: "Нужны для работы сайта. Всегда включены.",
    functionalTitle: "Функциональные",
    functionalDesc: "Запоминают ваши настройки (тема, язык).",
    analyticsTitle: "Аналитика",
    analyticsDesc: "Анонимная статистика (Google Analytics), чтобы становиться лучше.",
    marketingTitle: "Маркетинг",
    marketingDesc: "Измерение эффективности рекламы и конверсий.",
  },
};

const kk: Dict = {
  meta: {
    title: "Pixap — Алматыдағы брондауға арналған AI-консьерж",
    description: "Pixap — орындарды табатын, мекемелермен WhatsApp арқылы сөйлесетін және брондауды бір минуттан аз уақытта растайтын AI-консьерж. Алматыдағы мейрамханалар, салондар, турлар және басқалары.",
    ogDescription: "Орынды табыңыз, WhatsApp-тағы хат-хабарды AI-ға қалдырыңыз және расталған брондауды бір минуттан аз уақытта алыңыз.",
  },
  nav: { features: "Мүмкіндіктер", how: "Қалай жұмыс істейді", faq: "Сұрақтар", getApp: "Қолданбаны алу", language: "Тіл" },
  hero: {
    taglinePeople: "Адамдар.", taglineInspire: "Шабыт.", taglineExplore: "Ашу.", taglineAnyPlace: "Кез келген орын.",
    srTitle: "Pixap — кез келген орынды брондауға арналған AI-консьерж",
  },
  store: { downloadOn: "Жүктеп алыңыз", appStore: "App Store", getItOn: "Қол жетімді", googlePlay: "Google Play" },
  marquee: { restaurants: "Мейрамханалар", salons: "Салондар және спа", nightlife: "Түнгі өмір", events: "Іс-шаралар" },
  pains: {
    eyebrow: "Брондау мәселесі",
    title1: "Брондау бөлек жұмыстай",
    title2: "болмауы керек.",
    items: [
      { title: "Бір кешке бес қолданба", desc: "Брондар бір жерде, билеттер басқа жерде, чат бәрінде." },
      { title: "Көңіл-күйді болжау", desc: "Суреттер алдайды. Көңіл-күйді тек барған соң білесіз." },
      { title: "Топтық чатта адасу", desc: "Жоспарлар «кейінірек көреміз» хабарламаларынан жоғалады." },
      { title: "Толы ма, бос па", desc: "Орынның дәл қазір қаншалықты толы екенін көру мүмкін емес." },
    ],
  },
  solution: {
    line1: "Pixap-қа не қалайтыныңызды айтыңыз.",
    line2: "Қалғанын өзіміз жасаймыз.",
    sub: "Идеал орынды табатын, мекемемен WhatsApp арқылы сөйлесетін және брондауыңызды бір минуттан аз уақытта растайтын AI-консьерж.",
  },
  showcase: {
    eyebrow: "Әрекетте көріңіз",
    title: "Бүкіл кешке арналған бір қолданба.",
    desc: "Алғашқы ойдан соңғы тоқтауға дейін — Pixap жоспарлайды, брондайды, көңіл-күйді сәйкестендіреді және залды нақты уақытта оқиды.",
    alt: "Pixap қолданбасының экрандары: кешті жоспарлау, AI-консьерж, көңіл-күй бойынша ақылды маршрут, әлеуметтік брондау және түпкілікті жоспар",
  },
  features: {
    smart: {
      eyebrow: "Pix AI ақылды брондау",
      title: "Тек айтыңыз. Біз брондаймыз.",
      desc: "Pix AI-ға не қалайтыныңызды айтыңыз — асхана, музыка, бюджет, уақыт. Ол мекемелермен WhatsApp арқылы келіссөз жүргізіп, расталған орынды бір минуттан аз уақытта бекітеді.",
    },
    vibe: {
      eyebrow: "Көңіл-күй бойынша таңдау",
      title: "Өзіңізге сәйкес орындарды табыңыз.",
      desc: "Тыныш, премиум, көңілді, андеграунд — өз көңіл-күйіңізді таңдаңыз, ал Pixap бүгінгі энергияңызға сәйкес келетін мекемелерді ұсынады.",
    },
    crowd: {
      eyebrow: "Нақты уақыттағы толтыру көрсеткіштері",
      title: "Барар алдында залды көріңіз.",
      desc: "Әр орынның толтыруы, күту уақыты және энергиясы нақты уақытта — өзіңіз қалаған кешке кіріңіз.",
    },
    social: {
      eyebrow: "Әлеумет + брондау бір жерде",
      title: "Бірге жоспарлаңыз. Бірге брондаңыз.",
      desc: "Достарыңызды шақырыңыз, жоспарға дауыс беріңіз, шотты бөліңіз және кешкі ас, бар мен клубты бір ортақ хронологияда растаңыз.",
    },
  },
  demo: {
    eyebrow: "Үрдіс",
    titleA: "Төрт басу.",
    titleB: "Кедергісіз.",
    intro: "Pixap бұлыңғыр қалауды расталған брондауға қалай айналдыратынын көріңіз — телефонды қолға алмай-ақ.",
    stepLabel: "Қадам",
    nowLabel: "Қазір: қадам",
    steps: [
      { title: "Кешіңізді сипаттаңыз", desc: "Pix AI-ға көңіл-күй, компания және уақыт туралы өз сөзіңізбен айтыңыз." },
      { title: "Көңіл-күйге сәйкестендіріңіз", desc: "AI мекемелерді талғам, толтыру және қашықтық бойынша сұрыптайды." },
      { title: "Жоспар құрыңыз", desc: "Кешкі ас, бар, клуб — бір ақылды маршрутта достарыңызбен." },
      { title: "Келіңіз", desc: "Барлық тоқтауға бір өту. Кезексіз кіріңіз, кештен ләззат алыңыз." },
    ],
  },
  stats: [
    { value: "<60с", label: "Идеядан расталған жоспарға дейін" },
    { value: "Live", label: "Толтыру мен күту туралы деректер үнемі онлайн" },
    { value: "1 app", label: "Бірге жоспарлаңыз, брондаңыз, шотты бөліңіз" },
  ],
  testimonials: {
    title: "Алғашқы пайдаланушылар жақсы көреді.",
    items: [
      { quote: "Жұма кеші, алты дос, үш мекеме — бәрі екі минутта расталды. Pix AI кешті өзі жүргізеді.", name: "Әлия Қ.", role: "Алматы" },
      { quote: "Көңіл-күй бойынша таңдау тура жолға түсті. Тыныш кешкі ас, көңілді бар, андеграунд клуб — мен сипаттаған дәл сол кеш.", name: "Данияр М.", role: "Астана" },
      { quote: "Үйден шықпай тұрып мекемелердің толтыруын көру — нағыз код. Енді бос залдар жоқ.", name: "Сәуле Т.", role: "Алматы" },
    ],
  },
  faq: {
    title: "Сұрақтарға жауаптар.",
    items: [
      { q: "Pix AI ақылды брондау дегеніміз не?", a: "Pix AI — қолданба ішіндегі консьерж. Сіз қалағаныңызды сипаттайсыз, ол мекемелермен WhatsApp арқылы нақты уақытта сөйлеседі және расталған брондауды қайтарады — қоңырау да, хабарлама да жоқ." },
      { q: "Көңіл-күй бойынша таңдау қалай жұмыс істейді?", a: "Көңіл-күйді таңдаңыз — тыныш, премиум, көңілді немесе андеграунд — Pixap мекемелерді энергиясы, музыкасы, дизайны мен пікірлері бойынша сұрыптайды." },
      { q: "Нақты уақыттағы толтыру көрсеткіштері дегеніміз не?", a: "Біз серіктес мекемелердің толтыруын, күту уақытын және энергия деңгейін нақты уақытта көрсетеміз, сондықтан үйден шықпай-ақ екі орынның арасынан таңдай аласыз." },
      { q: "Достарыммен кешті жоспарлай аламын ба?", a: "Иә. Топты шақырыңыз, орындарға дауыс беріңіз, бірнеше тоқтауы бар маршрут құрыңыз, шотты бөліңіз, ал Pix AI барлық брондауды бірден бекітеді." },
      { q: "Pixap қай жерде қол жетімді?", a: "Қазақстанның Алматы қаласында іске қосылып, көп ұзамай басқа қалаларға кеңейеміз." },
    ],
  },
  finalCta: {
    titleA: "Қоңырау шалуды доғарыңыз.",
    titleB: "Брондауды бастаңыз.",
    desc: "Әр брондауды Pixap AI-ға сеніп тапсыратын адамдар қатарына қосылыңыз. Тегін жүктеу. Банк картасы керек емес.",
  },
  footer: {
    tagline: "Бұрын қоңырау шалатын барлық нәрсеге арналған AI брондау консьержі.",
    product: "Өнім", legal: "Құқықтық ақпарат", getApp: "Қолданбаны жүктеу",
    privacy: "Құпиялылық саясаты", terms: "Пайдаланушы келісімі", returns: "Қайтару саясаты", dataDeletion: "Деректерді жою",
    rights: "Барлық құқықтар қорғалған.", madeIn: "Алматыда мұқияттылықпен жасалған.",
  },
};

export const translations: Record<Lang, Dict> = { en, ru, kk };
export type { Dict };
