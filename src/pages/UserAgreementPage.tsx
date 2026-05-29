import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Lang = "en" | "ru" | "kk";

const agreements: Record<Lang, string> = {
  en: `
# Pixap User Agreement

**Effective date:** [publication date]
**Last updated:** [update date]

This User Agreement (the "Agreement") governs the relationship between you ("User") and Pixap LLC ("Company", "we") when you use the Pixap mobile application (the "App") and related services.

**Please read this Agreement carefully before using the App. By creating an account, you accept all of its terms.**

---

## 1. Description of the Service

Pixap is a platform that allows you to:

- Discover beauty, wellness, and leisure venues
- Book services from partner providers
- Publish stories, posts, photos, and videos
- Communicate with other users via direct messages
- Use an AI assistant to find and book services
- Participate in social interactions: reactions, comments, follows

---

## 2. Registration and Account

### 2.1 Requirements

- You must be at least **13 years old** (at least **16 years old** in the EU and Australia)
- You must provide accurate information during registration
- One person — one account
- Creating accounts using bots or automated means is prohibited

### 2.2 Account Responsibility

You are responsible for:

- Keeping your login credentials secure
- All actions taken under your account
- Notifying us immediately of any suspected unauthorised access at [support email]

### 2.3 Account Deletion

You may delete your account at any time via "Settings → Account → Delete Account". After deletion, your data will be destroyed within 30 days, except where retention is required by law.

---

## 3. Content Rules

### 3.1 Prohibited Content

You may not post content that:

- Violates third-party rights (copyright, trademarks, personal data)
- Contains pornographic or sexually explicit material
- Depicts violence, cruelty, or promotes extremism or terrorism
- Is misleading or contains false information
- Is intended to harass, stalk, or intimidate other users
- Contains spam, automatically generated content, or unsolicited advertising
- Violates the laws of the country in which you reside

### 3.2 Moderation

We may, without prior notice, remove content and suspend accounts that violate this Agreement. To appeal a decision: [support email].

Users may report content that violates the rules using the "Report" button available within the App.

### 3.3 Content Rights

By posting content in the App, you:

- Retain all intellectual property rights to that content
- Grant Pixap a free, non-exclusive, worldwide licence to display, store, and distribute that content within the App's functionality
- Warrant that you hold the rights to the content you publish

---

## 4. Booking Services

### 4.1 Pixap's Role

Pixap is an **intermediary platform**. We connect users with partner venues but are **not the service provider** ourselves. The specific terms of services (price, quality, availability) are determined by the venues directly.

### 4.2 Booking Terms

- A booking is confirmed once the venue responds
- Service prices are set by venues and may change
- Cancellation policy is set by the venue
- Pixap is not responsible for the quality of services rendered

### 4.3 AI Booking

The Pixap AI assistant provides recommendations for informational purposes. Final booking terms are confirmed by the venue. AI may make errors — do not make financial decisions based solely on AI responses.

### 4.4 Disputes with Venues

For complaints about service quality, contact the venue directly. Pixap may act as a mediator in dispute resolution but bears no financial responsibility for the actions of partners.

---

## 5. Subscriptions and Payments

### 5.1 Paid Features

Some App features are only available with a paid Pixap Premium subscription. Subscription terms are displayed on the checkout screen.

### 5.2 Payment Processing

All payments are processed via:

- **Apple In-App Purchase** — for iOS
- **Google Play Billing** — for Android

We do not store payment card details. All transactions are governed by Apple's and Google's terms.

### 5.3 Cancellation and Refunds

- Manage and cancel your subscription: via "Device Settings → Subscriptions"
- Refund policy is governed by Apple App Store and Google Play rules
- Restore a previously purchased subscription: "Restore Purchases" button on the subscription screen

---

## 6. Intellectual Property

All elements of the App (logos, design, code, names, trademarks) are the property of Pixap or used on a lawful basis. You may not:

- Copy, modify, or distribute the App or its elements
- Reverse-engineer the code
- Use Pixap's trademarks without written permission

---

## 7. Limitation of Liability

To the maximum extent permitted by law:

- We do not guarantee uninterrupted or error-free operation of the App
- We are not responsible for the actions of users and partners on the platform
- We are not liable for indirect, incidental, or punitive damages
- Our total liability to you is limited to the amount you paid for the App in the preceding 12 months

Nothing in this section limits consumer rights provided by mandatory law.

---

## 8. Prohibited Activities

You may not:

- Use the App for illegal activities
- Hack, attack, or disrupt Pixap infrastructure
- Create fake accounts or impersonate another person
- Collect other users' data without their consent (scraping)
- Manipulate ratings or reviews
- Use the App to send spam or unsolicited messages

---

## 9. Termination of Access

We may suspend or delete your account without notice if:

- You violate this Agreement
- You engage in fraudulent or unlawful activity
- You systematically violate the rights of other users

You may appeal a decision by contacting [support email] within 30 days.

---

## 10. Governing Law and Dispute Resolution

This Agreement is governed by the laws of the Republic of Kazakhstan.

Disputes are resolved in the following order:

- **Pre-trial resolution** — send a written claim to [legal@pixapp.kz]. Response time — 30 days.
- **Mediation** — with the consent of both parties.
- **Litigation** — in the courts of the Republic of Kazakhstan at the Company's registered location.

EU users retain the right to approach local courts and regulatory authorities in accordance with EU law.

---

## 11. Changes to the Agreement

We may amend this Agreement. We will notify you of material changes through the App no less than 14 days before they take effect. Continued use of the App after the changes take effect constitutes your acceptance.

---

## 12. Contact Information

**Support:** [support@pixapp.kz]
**Legal inquiries:** [legal@pixapp.kz]
**Address:** [registered address of the company]
**Company details:** [LLC, Tax ID, registration date]
`,
  ru: `
# Пользовательское соглашение Pixap

**Дата вступления в силу:** [дата публикации]
**Последнее обновление:** [дата обновления]

Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между вами («Пользователь») и ООО «Пиксап» / Pixap («Компания», «мы») при использовании мобильного приложения Pixap (далее — «Приложение») и связанных сервисов.

**Внимательно прочитайте настоящее Соглашение перед использованием Приложения. Создавая аккаунт, вы принимаете все его условия.**

---

## 1. Описание сервиса

Pixap — платформа, которая позволяет:

- Открывать заведения в сфере красоты, здоровья и досуга
- Бронировать услуги у партнёров-исполнителей
- Публиковать stories, посты, фотографии и видео
- Общаться с другими пользователями в личных сообщениях
- Использовать AI-ассистента для подбора и бронирования услуг
- Участвовать в социальных взаимодействиях: реакции, комментарии, подписки

---

## 2. Регистрация и аккаунт

### 2.1 Требования

- Вам должно быть не менее **13 лет** (в ЕС и Австралии — не менее **16 лет**)
- Вы должны предоставить достоверную информацию при регистрации
- Один человек — один аккаунт
- Создание аккаунтов ботами или автоматизированными средствами запрещено

### 2.2 Ответственность за аккаунт

Вы несёте ответственность за:

- Сохранность данных для входа
- Все действия, совершённые под вашим аккаунтом
- Незамедлительное уведомление нас при подозрении на несанкционированный доступ по адресу [email поддержки]

### 2.3 Удаление аккаунта

Вы можете удалить аккаунт в любой момент через «Настройки → Аккаунт → Удалить аккаунт». После удаления ваши данные будут уничтожены в течение 30 дней, за исключением случаев, когда их хранение требуется по закону.

---

## 3. Правила использования контента

### 3.1 Что запрещено публиковать

Запрещается размещать контент, который:

- Нарушает права третьих лиц (авторские права, товарные знаки, персональные данные)
- Содержит порнографические или сексуально откровенные материалы
- Изображает насилие, жестокость, пропаганду экстремизма или терроризма
- Вводит в заблуждение, содержит недостоверную информацию
- Направлен на травлю, преследование, запугивание других пользователей
- Содержит спам, автоматически сгенерированный контент, нежелательную рекламу
- Нарушает законодательство страны, в которой вы проживаете

### 3.2 Модерация

Мы вправе без предупреждения удалять контент и блокировать аккаунты, нарушающие настоящее Соглашение. Для обжалования решений: [email поддержки].

Пользователи могут пожаловаться на нарушающий правила контент через кнопку «Пожаловаться», доступную в Приложении.

### 3.3 Права на контент

Публикуя контент в Приложении, вы:

- Сохраняете все права интеллектуальной собственности на него
- Предоставляете Pixap безвозмездную, неисключительную, территориально неограниченную лицензию на отображение, хранение и распространение этого контента в рамках функционала Приложения
- Гарантируете, что обладаете правами на публикуемый контент

---

## 4. Бронирование услуг

### 4.1 Роль Pixap

Pixap является **платформой-посредником**. Мы соединяем пользователей с заведениями-партнёрами, однако **не являемся исполнителем** услуг. Конкретные условия оказания услуг (стоимость, качество, доступность) определяются непосредственно заведениями.

### 4.2 Условия бронирования

- Бронирование подтверждается после ответа заведения
- Стоимость услуг указывается заведением и может меняться
- Политика отмены бронирования устанавливается заведением
- Pixap не несёт ответственности за качество оказанных услуг

### 4.3 AI-бронирование

AI-ассистент Pixap предоставляет рекомендации в информационных целях. Итоговые условия бронирования подтверждаются заведением. AI может допускать ошибки — не принимайте финансовых решений исключительно на основе ответов AI.

### 4.4 Споры с заведениями

В случае претензий к качеству услуг обращайтесь непосредственно к заведению. Pixap может выступить посредником в урегулировании спора, однако не несёт финансовой ответственности за действия партнёров.

---

## 5. Подписки и платежи

### 5.1 Платные функции

Ряд функций Приложения доступен только по платной подписке Pixap Premium. Условия подписки отображаются на экране оформления.

### 5.2 Обработка платежей

Все платежи обрабатываются через:

- **Apple In-App Purchase** — для iOS
- **Google Play Billing** — для Android

Мы не храним данные платёжных карт. Все транзакции регулируются правилами Apple и Google.

### 5.3 Отмена и возврат

- Управление и отмена подписки: через «Настройки устройства → Подписки»
- Политика возвратов определяется правилами Apple App Store и Google Play
- Восстановить ранее приобретённую подписку: кнопка «Восстановить покупки» на экране подписки

---

## 6. Интеллектуальная собственность

Все элементы Приложения (логотипы, дизайн, код, названия, торговые марки) являются собственностью Pixap или используются на законных основаниях. Запрещается:

- Копировать, модифицировать или распространять Приложение или его элементы
- Осуществлять обратную разработку кода
- Использовать торговые марки Pixap без письменного разрешения

---

## 7. Ограничение ответственности

В максимально допустимой законом мере:

- Мы не гарантируем бесперебойную и безошибочную работу Приложения
- Мы не несём ответственности за действия пользователей и партнёров на платформе
- Мы не несём ответственности за косвенный, случайный или штрафной ущерб
- Наша совокупная ответственность перед вами ограничена суммой, уплаченной вами за Приложение за последние 12 месяцев

Ничто в настоящем разделе не ограничивает права потребителей, предусмотренные обязательным законодательством.

---

## 8. Запрещённые действия

Запрещается:

- Использовать Приложение для незаконной деятельности
- Взламывать, атаковать или нарушать работу инфраструктуры Pixap
- Создавать поддельные аккаунты или выдавать себя за другое лицо
- Собирать данные других пользователей без их согласия (скрейпинг)
- Манипулировать рейтингами или отзывами
- Использовать Приложение для отправки спама или нежелательных сообщений

---

## 9. Прекращение доступа

Мы вправе приостановить или удалить ваш аккаунт без предупреждения в случае:

- Нарушения настоящего Соглашения
- Мошеннической или противоправной деятельности
- Систематического нарушения прав других пользователей

Вы можете обжаловать решение, обратившись по адресу [email поддержки] в течение 30 дней.

---

## 10. Применимое право и разрешение споров

Настоящее Соглашение регулируется законодательством Республики Казахстан.

Споры разрешаются в следующем порядке:

- **Досудебное урегулирование** — направьте претензию на [legal@pixapp.kz]. Срок ответа — 30 дней.
- **Медиация** — при наличии согласия сторон.
- **Судебное разбирательство** — в судах Республики Казахстан по месту нахождения Компании.

Пользователи из ЕС сохраняют право на обращение в местные суды и регуляторные органы в соответствии с законодательством ЕС.

---

## 11. Изменения Соглашения

Мы вправе вносить изменения в настоящее Соглашение. О существенных изменениях мы уведомим вас через Приложение не менее чем за 14 дней до их вступления в силу. Продолжение использования Приложения после вступления изменений в силу означает их принятие.

---

## 12. Контактная информация

**Поддержка:** [support@pixapp.kz]
**Юридические вопросы:** [legal@pixapp.kz]
**Адрес:** [юридический адрес компании]
**Реквизиты:** [ООО, БИН/ИНН, дата регистрации]
`,
  kk: `
# Pixap Пайдаланушы келісімі

**Күшіне ену күні:** [жариялану күні]
**Соңғы жаңарту:** [жаңарту күні]

Осы Пайдаланушы келісімі (бұдан әрі — «Келісім») Pixap мобильді қосымшасын («Қосымша») және онымен байланысты қызметтерді пайдаланған кезде сіз («Пайдаланушы») мен Pixap ЖШС («Компания», «біз») арасындағы қатынастарды реттейді.

**Қосымшаны пайдаланбас бұрын осы Келісімді мұқият оқыңыз. Тіркелгі жасай отырып, сіз оның барлық шарттарын қабылдайсыз.**

---

## 1. Қызмет сипаттамасы

Pixap — мынаны жүзеге асыруға мүмкіндік беретін платформа:

- Сұлулық, денсаулық және демалыс саласындағы мекемелерді ашу
- Серіктес орындаушылардан қызметтерді брондау
- Stories, постылар, суреттер мен бейнелер жариялау
- Жеке хабарламалар арқылы басқа пайдаланушылармен байланысу
- Қызметтерді іздеу және брондау үшін AI-ассистентті пайдалану
- Әлеуметтік өзара іс-қимылға қатысу: реакциялар, пікірлер, жазылулар

---

## 2. Тіркеу және тіркелгі

### 2.1 Талаптар

- Сізге кемінде **13 жас** болуы тиіс (ЕО мен Австралияда — кемінде **16 жас**)
- Тіркелу кезінде нақты ақпарат беруіңіз керек
- Бір адам — бір тіркелгі
- Боттар немесе автоматтандырылған құралдар арқылы тіркелгі жасауға тыйым салынады

### 2.2 Тіркелгі жауапкершілігі

Сіз мыналарға жауапты:

- Кіру деректерінің қауіпсіздігі
- Тіркелгіңіз арқылы жасалған барлық әрекеттер
- Рұқсатсыз кіру күдіктенген жағдайда [қолдау электрондық поштасы] мекенжайы бойынша бізге дереу хабарлау

### 2.3 Тіркелгіні жою

Тіркелгіні кез келген уақытта «Параметрлер → Тіркелгі → Тіркелгіні жою» арқылы жоюға болады. Жойылғаннан кейін деректеріңіз заңмен сақтау талап етілетін жағдайларды қоспағанда, 30 күн ішінде жойылады.

---

## 3. Мазмұнды пайдалану ережелері

### 3.1 Жариялауға тыйым салынатын мазмұн

Мынадай мазмұн жариялауға тыйым салынады:

- Үшінші тараптардың құқықтарын бұзатын (авторлық құқықтар, тауар белгілері, жеке деректер)
- Порнографиялық немесе жыныстық тұрғыдан жарқын материалдарды қамтитын
- Зорлық-зомбылықты, қатыгездікті суреттейтін, экстремизм немесе терроризмді насихаттайтын
- Жаңылыстыратын немесе жалған ақпарат қамтитын
- Басқа пайдаланушыларды мазақ ету, қуғындау, қорқытуға бағытталған
- Спам, автоматты түрде жасалған мазмұн, жарнамалық хабарламаларды қамтитын
- Тұратын елдің заңнамасын бұзатын

### 3.2 Модерация

Осы Келісімді бұзатын мазмұнды алдын ала ескертусіз жоюға және тіркелгілерді бұғаттауға құқымыз бар. Шешімдерге шағым беру үшін: [қолдау электрондық поштасы].

Пайдаланушылар Қосымшада қолжетімді «Шағым беру» түймесі арқылы ережелерді бұзатын мазмұнды хабарлай алады.

### 3.3 Мазмұнға құқықтар

Қосымшада мазмұн жариялай отырып, сіз:

- Оған барлық зияткерлік меншік құқықтарын сақтайсыз
- Pixap-қа Қосымшаның функционалы шеңберінде осы мазмұнды көрсету, сақтау және тарату үшін ақысыз, эксклюзивті емес, аумақтық шектеусіз лицензия бересіз
- Жарияланатын мазмұнға құқықтарыңыз бар екенін кепілдейсіз

---

## 4. Қызметтерді брондау

### 4.1 Pixap рөлі

Pixap **делдалдық платформа** болып табылады. Біз пайдаланушыларды серіктес мекемелермен байланыстырамыз, бірақ қызметтердің **тікелей орындаушысы болып табылмаймыз**. Қызметтердің нақты шарттарын (құны, сапасы, қолжетімділігі) мекемелердің өзі айқындайды.

### 4.2 Брондау шарттары

- Брондау мекеме жауап бергеннен кейін расталады
- Қызметтердің құнын мекеме белгілейді және ол өзгеруі мүмкін
- Брондауды болдырмау саясатын мекеме белгілейді
- Pixap көрсетілген қызметтердің сапасына жауап бермейді

### 4.3 AI-брондау

Pixap AI-ассистенті ақпараттық мақсаттарда ұсыныстар береді. Брондаудың түпкілікті шарттары мекемемен расталады. AI қателіктер жіберуі мүмкін — тек AI жауаптары негізінде қаржылық шешімдер қабылдамаңыз.

### 4.4 Мекемелермен даулар

Қызметтердің сапасына қатысты шағымдар бойынша тікелей мекемеге хабарласыңыз. Pixap дауды реттеуде делдал ретінде қатыса алады, бірақ серіктестердің іс-қимылдары үшін қаржылық жауапкершілік көтермейді.

---

## 5. Жазылулар және төлемдер

### 5.1 Ақылы мүмкіндіктер

Қосымшаның кейбір мүмкіндіктері тек Pixap Premium ақылы жазылымы бар жағдайда қолжетімді. Жазылым шарттары рәсімдеу экранында көрсетіледі.

### 5.2 Төлемдерді өңдеу

Барлық төлемдер мыналар арқылы өңделеді:

- **Apple In-App Purchase** — iOS үшін
- **Google Play Billing** — Android үшін

Біз банк картасының деректерін сақтамаймыз. Барлық транзакциялар Apple мен Google ережелерімен реттеледі.

### 5.3 Болдырмау және қайтарым

- Жазылымды басқару және болдырмау: «Құрылғы параметрлері → Жазылымдар» арқылы
- Қайтарым саясатын Apple App Store мен Google Play ережелері айқындайды
- Бұрын сатып алынған жазылымды қалпына келтіру: жазылым экранындағы «Сатып алуларды қалпына келтіру» түймесі

---

## 6. Зияткерлік меншік

Қосымшаның барлық элементтері (логотиптер, дизайн, код, атаулар, тауар белгілері) Pixap меншігі болып табылады немесе заңды негізде пайдаланылады. Тыйым салынады:

- Қосымшаны немесе оның элементтерін көшіру, өзгерту немесе тарату
- Кодты кері инженерлеу
- Pixap тауар белгілерін жазбаша рұқсатсыз пайдалану

---

## 7. Жауапкершілікті шектеу

Заңмен рұқсат етілген ең жоғарғы шегінде:

- Қосымшаның үздіксіз және қатесіз жұмысына кепілдік бермейміз
- Платформадағы пайдаланушылар мен серіктестердің іс-қимылдары үшін жауап бермейміз
- Жанама, кездейсоқ немесе жазалаушы залал үшін жауап бермейміз
- Сізге деген жиынтық жауапкершілігіміз соңғы 12 айда Қосымша үшін төлеген сомаңызбен шектеледі

Осы бөлімдегі ештеңе міндетті заңнамамен қарастырылған тұтынушы құқықтарын шектемейді.

---

## 8. Тыйым салынған іс-қимылдар

Тыйым салынады:

- Қосымшаны заңсыз іс-қимылдарға пайдалану
- Pixap инфрақұрылымын бұзу, шабуыл жасау немесе жұмысын бұзу
- Жалған тіркелгі жасау немесе басқа тұлғаны атсалысу
- Келісімінсіз басқа пайдаланушылардың деректерін жинау (скрейпинг)
- Рейтингтерді немесе пікірлерді жасанды жолмен өзгерту
- Қосымшаны спам немесе қажетсіз хабарламалар жіберу үшін пайдалану

---

## 9. Қол жеткізуді тоқтату

Мынадай жағдайларда тіркелгіңізді алдын ала ескертусіз тоқтата тұруға немесе жоюға құқымыз бар:

- Осы Келісімді бұзғанда
- Алаяқтық немесе заңсыз іс-қимылда
- Басқа пайдаланушылардың құқықтарын жүйелі түрде бұзғанда

Шешімге 30 күн ішінде [қолдау электрондық поштасы] мекенжайы бойынша хабарласу арқылы шағым беруге болады.

---

## 10. Қолданылатын құқық және даулы мәселелерді шешу

Осы Келісім Қазақстан Республикасының заңнамасымен реттеледі.

Даулар мынадай тәртіппен шешіледі:

- **Сотқа дейінгі реттеу** — [legal@pixapp.kz] мекенжайына жазбаша талап жіберіңіз. Жауап беру мерзімі — 30 күн.
- **Медиация** — тараптардың келісімімен.
- **Сот ісін жүргізу** — Компанияның тіркелген орны бойынша Қазақстан Республикасы соттарында.

ЕО пайдаланушылары ЕО заңнамасына сәйкес жергілікті соттарға және реттеуші органдарға жүгіну құқығын сақтайды.

---

## 11. Келісімге өзгерістер

Осы Келісімге өзгерістер енгізуге құқымыз бар. Елеулі өзгерістер туралы олар күшіне енуге дейін кемінде 14 күн бұрын Қосымша арқылы хабарлаймыз. Өзгерістер күшіне енгеннен кейін Қосымшаны пайдалануды жалғастыру оларды қабылдағаныңызды білдіреді.

---

## 12. Байланыс ақпараты

**Қолдау:** [support@pixapp.kz]
**Заңды сұрақтар:** [legal@pixapp.kz]
**Мекенжай:** [компанияның заңды мекенжайы]
**Деректемелер:** [ЖШС, БСН/ЖСН, тіркеу күні]
`,
};

const languageLabels: Record<Lang, string> = {
  en: "EN",
  ru: "RU",
  kk: "KK",
};

const backLabels: Record<Lang, string> = {
  en: "Back",
  ru: "Назад",
  kk: "Артқа",
};

const renderInline = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-foreground font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
};

const renderDoc = (markdown: string) => {
  const lines = markdown.split("\n");
  const elements: JSX.Element[] = [];

  lines.forEach((raw, i) => {
    const line = raw.trimEnd();
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="text-3xl md:text-4xl font-bold text-foreground mb-4">{line.slice(2)}</h1>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-2xl font-semibold text-foreground mt-8 mb-3">{line.slice(3)}</h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-lg font-semibold text-foreground mt-5 mb-2">{line.slice(4)}</h3>
      );
    } else if (line.startsWith("---")) {
      elements.push(<hr key={i} className="my-6 border-border" />);
    } else if (line.startsWith("- ")) {
      elements.push(
        <p key={i} className="text-foreground/90 text-sm md:text-base ml-5 mb-1 leading-relaxed">
          • {renderInline(line.slice(2))}
        </p>
      );
    } else if (line.trim() === "") {
      return;
    } else {
      elements.push(
        <p key={i} className="text-foreground/90 text-sm md:text-base mb-3 leading-relaxed">
          {renderInline(line)}
        </p>
      );
    }
  });

  return elements;
};

const UserAgreementPage = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Lang>("en");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-end mb-6 gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition text-sm text-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> {backLabels[lang]}
          </button>

          <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-secondary">
            {(Object.keys(languageLabels) as Lang[]).map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-semibold transition",
                  lang === code
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {languageLabels[code]}
              </button>
            ))}
          </div>
        </div>

        <article className="max-w-none">{renderDoc(agreements[lang])}</article>
      </div>
    </div>
  );
};

export default UserAgreementPage;
