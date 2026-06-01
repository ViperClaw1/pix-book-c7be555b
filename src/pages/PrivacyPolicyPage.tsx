import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Lang = "en" | "ru" | "kk";

const policies: Record<Lang, string> = {
  en: `
# Pixap Privacy Policy

**Effective date:** [publication date]
**Last updated:** [update date]

This Privacy Policy describes how Pixap LLC ("we", "us", "our") collects, uses, stores, and shares your personal data when you use the Pixap mobile application (the "App") and related services.

By using the App, you confirm that you have read and accepted the terms of this Policy.

---

## 1. Who We Are

Pixap is a mobile platform for discovering venues, booking beauty, wellness, and leisure services, and for communication between users and business partners.

Data controller: "VSEE.KZ" Limited Liability Partnership, Republic of Kazakhstan, Almaty, Bostandyk District, Miras Microdistrict 188/2,
Apartment 29, ZIP Code 050013, 231240018841, support@pixapp.kz.

---

## 2. Data We Collect

### 2.1 Data You Provide to Us

- **Account data:** First name, last name, email address, phone number, date of birth
- **Profile data:** Profile photo, city, bio, preferences
- **Content:** Stories, posts, photos, videos, comments, reactions, messages
- **Booking data:** Selected services, date and time, contact information, visit history
- **Financial data:** Purchase and subscription information via Apple In-App Purchase / Google Play Billing (payment card details are processed exclusively by Apple/Google — we do not receive them)

### 2.2 Data Collected Automatically

- **Device data:** Device model, operating system and version, unique device identifier
- **Push token:** Token for sending push notifications (Expo Push Notifications)
- **Usage data:** Actions within the App, screens you view, features you use
- **Network data:** IP address, browser/app type and language
- **Session data:** Login and logout times, session duration

### 2.3 Location Data

We request access to your location (only while the app is active) for a single purpose: to display directions from your current position to a selected venue on the map. We do not track your location in the background and do not store movement history.

### 2.4 Data from Third-Party Services

When you sign in via Google or Apple, we receive basic profile information (name, email, unique identifier) from them in accordance with their privacy policies.

---

## 3. How We Use Your Data

- **Creating and managing your account:** Performance of contract
- **Providing booking and service features:** Performance of contract
- **Displaying a personalised post and stories feed:** Legitimate interest / Consent
- **Sending push notifications:** Consent
- **Security and fraud prevention:** Legitimate interest
- **Responding to support requests:** Legitimate interest
- **Compliance with legal requirements:** Legal obligation
- **App improvement and analytics:** Legitimate interest

We do **not** use your data to sell to third parties, for targeted advertising on behalf of external advertisers, or to share data without your knowledge.

---

## 4. Artificial Intelligence (AI Features)

The App includes an AI booking feature (Pixap AI). When you use it:

- The text of your request and booking context are sent to Pixap servers and then to the AI service used to process requests (Supabase Edge Functions → third-party AI provider).
- We request your explicit consent before the first transfer of data to the AI service.
- AI responses are generated automatically and are informational in nature; the final terms of a booking are determined by the specific venue.
- Your conversation with the AI assistant may be stored as part of your booking history to ensure continuity.

You may withdraw your consent to AI features in "Settings → Privacy".

---

## 5. Sharing Data with Third Parties

We share your data with the following categories of recipients:

- **Supabase** (database & authentication infrastructure) — Data storage, authentication — All user data
- **Apple / Google** (payment systems) — Processing IAP purchases — Transaction identifier
- **Expo** (push notifications) — Push notification delivery — Push token
- **Google Maps** (geocoding & directions) — Map and route display — Venue address, your coordinates (temporarily)
- **Partner venues** — Booking confirmation — Name, contact details, booking details
- **N8N / WhatsApp** (notification automation) — WhatsApp booking notifications — Phone number, booking details
- **Government authorities** — As required by law — Minimum necessary data

We do not sell your personal data.

---

## 6. Data Storage

Your data is stored on Supabase servers. Supabase uses cloud provider infrastructure. Data storage region: **[specify region — e.g., eu-central-1 / ap-southeast-1]**.

Users from Kazakhstan: we make reasonable efforts to comply with the requirements of the Law of the Republic of Kazakhstan "On Personal Data and Its Protection". For questions about data storage, contact: support@pixapp.kz.

---

## 7. Data Retention Periods

- **Account data:** Until account deletion + 30 days
- **Booking history:** 3 years from the booking date
- **Messages:** Until account deletion
- **Content (posts, stories):** Until deleted by author or account deletion
- **Support data:** 2 years
- **Security logs:** 90 days
- **Financial records:** As required by law (up to 5 years)

---

## 8. Your Rights

Depending on applicable law, you have the following rights:

- **Right of access** — obtain a copy of your personal data
- **Right to rectification** — correct inaccurate data
- **Right to erasure** — delete your data ("right to be forgotten")
- **Right to restriction** — restrict the use of your data
- **Right to object** — object to processing based on legitimate interest
- **Right to portability** — receive your data in a machine-readable format
- **Right to withdraw consent** — withdraw previously given consent at any time

To delete your account: Settings → Account → Delete Account. Data is deleted within 30 days.

For other rights: support@pixapp.kz.

EU users have the right to lodge a complaint with their data protection supervisory authority.

---

## 9. Data Security

We apply technical and organisational measures to protect your data:

- Encryption in transit (HTTPS/TLS)
- Encryption at rest (provided by Supabase)
- Database-level row access control (Row Level Security)
- Regular access rights audits
- Two-factor authentication for administrative access

Despite these measures, no method of data transmission over the internet is absolutely secure.

---

## 10. Children

The App is not intended for persons under 13 years of age (or 16 years in the EU and Australia). We do not knowingly collect data from children. If you become aware that a child has provided us with their data, please contact us at support@pixapp.kz.

---

## 11. Cookies and Tracking

The mobile app does not use browser cookies. Device settings and session tokens are stored in the device's secure local storage (encrypted AsyncStorage). We do not use advertising trackers and do not share data with advertising networks.

---

## 12. International Data Transfers

Your data may be transferred to and processed in countries other than your country of residence. We ensure an adequate level of data protection through contractual obligations with our service providers (including EU Standard Contractual Clauses where applicable).

---

## 13. Changes to This Policy

For material changes to this Policy, we will notify you via push notification or upon your next login to the App. Continued use of the App after receiving such notification constitutes acceptance of the updated Policy.

---

## 14. Contact Information

For privacy and personal data inquiries:

**Email:** support@pixapp.kz
**Postal address:** Republic of Kazakhstan, Almaty, Bostandyk District, Miras Microdistrict 188/2,
Apartment 29, ZIP Code 050013
**Data Protection Officer (DPO):** Atif Issayev

Response time: up to 30 days.
`,
  ru: `
# Политика конфиденциальности Pixap

**Дата вступления в силу:** 01.06.2026
**Последнее обновление:** 01.06.2026

Настоящая Политика конфиденциальности описывает, как ООО «Пиксап» / Pixap («мы», «нас», «наш») собирает, использует, хранит и передаёт ваши персональные данные при использовании мобильного приложения Pixap (далее — «Приложение»), а также связанных с ним сервисов.

Используя Приложение, вы подтверждаете, что прочитали и приняли условия настоящей Политики.

---

## 1. Кто мы

Pixap — мобильная платформа для открытия заведений, бронирования услуг в сфере красоты, здоровья и досуга, а также для общения между пользователями и деловыми партнёрами.

Оператор персональных данных: ["VSEE.KZ ТОО", Республика Казахстан, город Алматы, Бостандыкский район, мкрн Мирас 188./2,
кв. 29, почтовый индекс 050013, 231240018841, support@pixapp.kz].

---

## 2. Какие данные мы собираем

### 2.1 Данные, которые вы предоставляете нам

- **Данные аккаунта:** Имя, фамилия, адрес электронной почты, номер телефона, дата рождения
- **Данные профиля:** Фотография профиля, город, биография, предпочтения
- **Контент:** Stories, посты, фотографии, видео, комментарии, реакции, сообщения
- **Данные бронирования:** Выбранные услуги, дата и время, контактная информация, история посещений
- **Финансовые данные:** Данные о покупках и подписках через Apple In-App Purchase / Google Play Billing (платёжные данные карт обрабатываются исключительно Apple/Google — мы их не получаем)

### 2.2 Данные, которые собираются автоматически

- **Данные устройства:** Модель устройства, операционная система и версия, уникальный идентификатор устройства
- **Push-токен:** Токен для отправки push-уведомлений (Expo Push Notifications)
- **Данные использования:** Действия в Приложении, экраны, которые вы просматриваете, функции, которые вы используете
- **Сетевые данные:** IP-адрес, тип и язык браузера/приложения
- **Сессионные данные:** Время входа и выхода, продолжительность сессии

### 2.3 Данные о местоположении

Мы запрашиваем доступ к вашему местоположению (только когда приложение активно) исключительно для одной цели: показать маршрут от вашего текущего положения до выбранного заведения на карте. Мы не отслеживаем ваше местоположение в фоновом режиме и не храним историю перемещений.

### 2.4 Данные из сторонних сервисов

При использовании входа через Google или Apple мы получаем от них базовую информацию профиля (имя, email, уникальный идентификатор) в соответствии с их политиками конфиденциальности.

---

## 3. Как мы используем ваши данные

- **Создание и управление аккаунтом:** Исполнение договора
- **Предоставление функций бронирования и сервисов:** Исполнение договора
- **Отображение персонализированной ленты постов и stories:** Законный интерес / Согласие
- **Отправка push-уведомлений:** Согласие
- **Обеспечение безопасности и предотвращение мошенничества:** Законный интерес
- **Ответы на обращения в поддержку:** Законный интерес
- **Соблюдение требований законодательства:** Юридическое обязательство
- **Улучшение Приложения и аналитика:** Законный интерес

Мы **не используем** ваши данные для продажи третьим лицам, таргетинговой рекламы в пользу внешних рекламодателей или передачи данных без вашего ведома.

---

## 4. Использование искусственного интеллекта (AI-функции)

Приложение содержит функцию AI-бронирования (Pixap AI). При её использовании:

- Текст вашего запроса и контекст бронирования передаются на серверы Pixap, а затем в AI-сервис, используемый для обработки запросов (Supabase Edge Functions → сторонний AI-провайдер).
- Мы запрашиваем ваше явное согласие перед первой передачей данных в AI-сервис.
- AI-ответы генерируются автоматически и носят информационный характер; окончательные условия бронирования определяются конкретным заведением.
- Переписка с AI-ассистентом может храниться в рамках вашей истории бронирований для обеспечения непрерывности работы.

Вы можете отозвать согласие на использование AI-функций в разделе «Настройки → Конфиденциальность».

---

## 5. Передача данных третьим лицам

Мы передаём ваши данные следующим категориям получателей:

- **Supabase** (инфраструктура БД и аутентификации) — Хранение данных, аутентификация — Все пользовательские данные
- **Apple / Google** (платёжные системы) — Обработка IAP-покупок — Идентификатор транзакции
- **Expo** (push-уведомления) — Доставка push-уведомлений — Push-токен
- **Google Maps** (геокодирование и маршруты) — Отображение карты и маршрутов — Адрес заведения, ваши координаты (временно)
- **Заведения-партнёры** — Подтверждение бронирования — Имя, контактные данные, детали бронирования
- **N8N / WhatsApp** (автоматизация уведомлений) — Уведомления о бронировании через WhatsApp — Номер телефона, детали бронирования
- **Государственные органы** — По требованию закона — Минимально необходимые данные

Мы не продаём ваши персональные данные.

---

## 6. Хранение данных

Ваши данные хранятся на серверах Supabase. Supabase использует инфраструктуру облачных провайдеров. Регион хранения данных: **[указать регион — например, eu-central-1 / ap-southeast-1]**.

Пользователи из Казахстана: мы прилагаем разумные усилия для соблюдения требований Закона Республики Казахстан «О персональных данных и их защите». При наличии вопросов о хранении данных обращайтесь: support@pixapp.kz.

---

## 7. Срок хранения данных

- **Данные аккаунта:** До удаления аккаунта + 30 дней
- **История бронирований:** 3 года с даты бронирования
- **Сообщения:** До удаления аккаунта
- **Контент (посты, stories):** До удаления автором или аккаунта
- **Данные поддержки:** 2 года
- **Журналы безопасности:** 90 дней
- **Финансовые записи:** В соответствии с требованиями законодательства (до 5 лет)

---

## 8. Ваши права

В зависимости от применимого законодательства вы имеете следующие права:

- **Право на доступ** — получить копию своих персональных данных
- **Право на исправление** — исправить неточные данные
- **Право на удаление** — удалить свои данные («право быть забытым»)
- **Право на ограничение обработки** — ограничить использование данных
- **Право на возражение** — возразить против обработки на основе законного интереса
- **Право на переносимость** — получить данные в машиночитаемом формате
- **Право на отзыв согласия** — отозвать ранее данное согласие в любой момент

Для удаления аккаунта: Настройки → Аккаунт → Удалить аккаунт. Данные удаляются в течение 30 дней.

Для реализации иных прав: support@pixapp.kz.

Пользователи из ЕС имеют право на подачу жалобы в надзорный орган по защите данных.

---

## 9. Безопасность данных

Мы применяем технические и организационные меры для защиты ваших данных:

- Шифрование при передаче (HTTPS/TLS)
- Шифрование при хранении (обеспечивается Supabase)
- Ограничение доступа на уровне строк базы данных (Row Level Security)
- Регулярный аудит прав доступа
- Двухфакторная аутентификация для административного доступа

Несмотря на принятые меры, ни один метод передачи данных через интернет не является абсолютно безопасным.

---

## 10. Дети

Приложение не предназначено для лиц младше 13 лет (или 16 лет в ЕС и Австралии). Мы не собираем намеренно данные детей. Если вам стало известно, что ребёнок предоставил нам свои данные, обратитесь к нам по адресу support@pixapp.kz.

---

## 11. Файлы cookie и трекинг

Мобильное приложение не использует браузерные cookie. Для хранения настроек и токенов сессии используется защищённое локальное хранилище устройства (AsyncStorage с шифрованием). Мы не используем рекламные трекеры и не передаём данные рекламным сетям.

---

## 12. Международная передача данных

Ваши данные могут передаваться и обрабатываться в странах, отличных от страны вашего проживания. Мы обеспечиваем надлежащий уровень защиты данных посредством договорных обязательств с нашими поставщиками услуг (включая Стандартные договорные положения ЕС там, где это применимо).

---

## 13. Изменения в Политике

При существенных изменениях настоящей Политики мы уведомим вас через push-уведомление или при следующем входе в Приложение. Продолжение использования Приложения после получения уведомления означает принятие обновлённой Политики.

---

## 14. Контактная информация

По вопросам конфиденциальности и персональных данных:

**Email:** support@pixapp.kz
**Почтовый адрес:** Республика Казахстан, город Алматы, Бостандыкский район, мкрн Мирас 188./2,
кв. 29, почтовый индекс 050013
**Ответственный за защиту данных (DPO):** Атиф Исаев

Срок ответа: до 30 дней.
`,
  kk: `
# Pixap Құпиялылық саясаты

**Күшіне ену күні:** 01.06.2026
**Соңғы жаңарту:** 01.06.2026

Осы Құпиялылық саясаты Pixap ЖШС («біз», «бізді», «біздің») Pixap мобильді қосымшасын («Қосымша») және онымен байланысты қызметтерді пайдаланған кезде сіздің жеке деректеріңізді қалай жинайтынын, пайдаланатынын, сақтайтынын және беретінін сипаттайды.

Қосымшаны пайдалана отырып, сіз осы Саясаттың талаптарын оқып, қабылдағаныңызды растайсыз.

---

## 1. Біз кімбіз

Pixap — сұлулық, денсаулық және демалыс саласындағы мекемелерді ашуға, қызметтерді брондауға, сондай-ақ пайдаланушылар мен іскерлік серіктестер арасындағы байланысқа арналған мобильді платформа.

Жеке деректердің операторы: "VSEE.KZ" ТОО, Қазақстан Республикасы, Алматы қаласы, Бостандык ауданы, Мирас микрорайоны 188./2, 29-пәтер, пошта индексі 050013, 231240018841, support@pixapp.kz.

---

## 2. Біз қандай деректер жинаймыз

### 2.1 Сіз бізге беретін деректер

- **Тіркелгі деректері:** Аты, тегі, электрондық пошта мекенжайы, телефон нөмірі, туған күні
- **Профиль деректері:** Профиль суреті, қала, биография, қалаулар
- **Мазмұн:** Stories, постылар, суреттер, бейнелер, пікірлер, реакциялар, хабарламалар
- **Брондау деректері:** Таңдалған қызметтер, күні мен уақыты, байланыс ақпараты, кіру тарихы
- **Қаржылық деректер:** Apple In-App Purchase / Google Play Billing арқылы сатып алулар мен жазылулар туралы ақпарат (банк картасының деректерін тек Apple/Google өңдейді — біз оларды алмаймыз)

### 2.2 Автоматты түрде жиналатын деректер

- **Құрылғы деректері:** Құрылғы моделі, операциялық жүйе және нұсқасы, құрылғының бірегей идентификаторы
- **Push-токен:** Push-хабарландырулар жіберу үшін токен (Expo Push Notifications)
- **Пайдалану деректері:** Қосымшадағы әрекеттер, қараған экрандар, пайдаланған мүмкіндіктер
- **Желі деректері:** IP-мекенжай, браузер/қосымша түрі мен тілі
- **Сессия деректері:** Кіру және шығу уақыты, сессияның ұзақтығы

### 2.3 Орналасу орны деректері

Біз сіздің орналасу орныңызға қол жеткізуді сұраймыз (тек қосымша белсенді болған кезде) тек бір мақсатпен: картада сіздің ағымдағы орныңыздан таңдалған мекемеге дейінгі маршрутты көрсету. Біз фондық режимде орналасуыңызды бақыламаймыз және қозғалыс тарихын сақтамаймыз.

### 2.4 Үшінші тарап сервистерінен алынған деректер

Google немесе Apple арқылы кіргенде, біз олардан тиісті құпиялылық саясаттарына сәйкес базалық профиль ақпаратын (аты, электрондық пошта, бірегей идентификатор) аламыз.

---

## 3. Деректеріңізді қалай пайдаланамыз

- **Тіркелгі жасау және басқару:** Шартты орындау
- **Брондау мүмкіндіктері мен қызметтерді ұсыну:** Шартты орындау
- **Жеке пост пен stories лентасын көрсету:** Заңды мүдде / Келісім
- **Push-хабарландырулар жіберу:** Келісім
- **Қауіпсіздікті қамтамасыз ету және алаяқтықтың алдын алу:** Заңды мүдде
- **Қолдау өтінімдеріне жауап беру:** Заңды мүдде
- **Заңнама талаптарын сақтау:** Заңды міндет
- **Қосымшаны жетілдіру және аналитика:** Заңды мүдде

Біз деректеріңізді үшінші тараптарға сату, сыртқы жарнама берушілер үшін мақсатты жарнама немесе сіздің хабардарлығыңызсыз деректерді беру мақсатында **пайдаланбаймыз**.

---

## 4. Жасанды интеллектті пайдалану (AI-мүмкіндіктер)

Қосымшада AI-брондау мүмкіндігі бар (Pixap AI). Оны пайдаланған кезде:

- Сұрауыңыздың мәтіні мен брондау контексті Pixap серверлеріне, содан кейін сұрауларды өңдеу үшін қолданылатын AI-сервиске жіберіледі (Supabase Edge Functions → үшінші тарап AI-провайдері).
- AI-сервиске деректерді бірінші рет жіберер алдында біз сіздің айқын келісіміңізді сұраймыз.
- AI жауаптары автоматты түрде жасалады және ақпараттық сипатта болады; брондаудың түпкілікті шарттары нақты мекемемен айқындалады.
- AI-ассистентпен хат алмасу жұмыстың үздіксіздігін қамтамасыз ету үшін брондау тарихыңыздың бөлігі ретінде сақталуы мүмкін.

AI-мүмкіндіктерге берген келісімді «Параметрлер → Құпиялылық» бөлімінде кері қайтаруға болады.

---

## 5. Деректерді үшінші тараптарға беру

Деректеріңізді алушылардың мынадай санаттарына береміз:

- **Supabase** (дерекқор және аутентификация инфрақұрылымы) — Деректерді сақтау, аутентификация — Барлық пайдаланушы деректері
- **Apple / Google** (төлем жүйелері) — IAP-сатып алуларды өңдеу — Транзакция идентификаторы
- **Expo** (push-хабарландырулар) — Push-хабарландырулар жеткізу — Push-токен
- **Google Maps** (геокодтау және маршруттар) — Карта мен маршрутты көрсету — Мекеме мекенжайы, координаттарыңыз (уақытша)
- **Серіктес мекемелер** — Брондауды растау — Аты, байланыс деректері, брондау мәліметтері
- **N8N / WhatsApp** (хабарландыруларды автоматтандыру) — WhatsApp арқылы брондау туралы хабарландырулар — Телефон нөмірі, брондау мәліметтері
- **Мемлекеттік органдар** — Заң талабы бойынша — Ең қажетті деректер

Біз жеке деректеріңізді сатпаймыз.

---

## 6. Деректерді сақтау

Деректеріңіз Supabase серверлерінде сақталады. Supabase бұлтты провайдерлердің инфрақұрылымын пайдаланады. Деректерді сақтау аймағы: **[аймақты көрсету — мысалы, eu-central-1 / ap-southeast-1]**.

Қазақстан пайдаланушылары: біз Қазақстан Республикасының «Дербес деректер және оларды қорғау туралы» Заңының талаптарын сақтауға барынша күш саламыз. Деректерді сақтау туралы сұрақтар бойынша хабасыңыз: [email].

---

## 7. Деректерді сақтау мерзімдері

- **Тіркелгі деректері:** Тіркелгіні жойғанға дейін + 30 күн
- **Брондау тарихы:** Брондау күнінен бастап 3 жыл
- **Хабарламалар:** Тіркелгіні жойғанға дейін
- **Мазмұн (постылар, stories):** Автор жойғанға немесе тіркелгі жойылғанға дейін
- **Қолдау деректері:** 2 жыл
- **Қауіпсіздік журналдары:** 90 күн
- **Қаржылық жазбалар:** Заңнама талаптарына сәйкес (5 жылға дейін)

---

## 8. Сіздің құқықтарыңыз

Қолданылатын заңнамаға байланысты сізде мынадай құқықтар бар:

- **Қол жеткізу құқығы** — жеке деректеріңіздің көшірмесін алу
- **Түзету құқығы** — дәл емес деректерді түзету
- **Жою құқығы** — деректеріңізді жою («ұмытылу құқығы»)
- **Өңдеуді шектеу құқығы** — деректерді пайдалануды шектеу
- **Қарсылық білдіру құқығы** — заңды мүдде негізіндегі өңдеуге қарсы шығу
- **Тасымалдау құқығы** — деректерді машинамен оқылатын форматта алу
- **Келісімді кері қайтару құқығы** — бұрын берілген келісімді кез келген уақытта кері қайтару

Тіркелгіні жою үшін: Параметрлер → Тіркелгі → Тіркелгіні жою. Деректер 30 күн ішінде жойылады.

Басқа құқықтарды іске асыру үшін: [қолдау электрондық поштасы].

ЕО пайдаланушылары деректерді қорғау жөніндегі қадағалау органына шағым беруге құқылы.

---

## 9. Деректер қауіпсіздігі

Деректеріңізді қорғау үшін техникалық және ұйымдастырушылық шараларды қолданамыз:

- Жіберу кезінде шифрлау (HTTPS/TLS)
- Сақтау кезінде шифрлау (Supabase қамтамасыз етеді)
- Дерекқор деңгейінде жол бойынша қол жеткізуді шектеу (Row Level Security)
- Қол жеткізу құқықтарын тұрақты тексеру
- Әкімшілік қол жеткізу үшін екі факторлы аутентификация

Қабылданған шараларға қарамастан, интернет арқылы деректерді жіберудің ешбір тәсілі толық қауіпсіз болып есептелмейді.

---

## 10. Балалар

Қосымша 13 жасқа толмаған тұлғаларға (ЕО мен Австралияда — 16 жасқа толмағандарға) арналмаған. Біз балалардың деректерін қасақана жинамаймыз. Баланың деректерін бізге бергені туралы білсеңіз, [email] мекенжайы бойынша хабарласыңыз.

---

## 11. Cookie файлдары мен бақылау

Мобильді қосымша браузерлік cookie файлдарын пайдаланбайды. Параметрлер мен сессия токендерін сақтау үшін құрылғының қорғалған жергілікті жады қолданылады (шифрланған AsyncStorage). Біз жарнамалық трекерлерді пайдаланбаймыз және деректерді жарнамалық желілерге бермейміз.

---

## 12. Деректерді халықаралық беру

Деректеріңіз тұратын еліңізден басқа елдерге жіберіліп, сол жерде өңделуі мүмкін. Біз қызмет провайдерлерімен шарттық міндеттемелер (ЕО стандарттық шарттық ережелері қолданылатын жерде) арқылы деректерді қорғаудың тиісті деңгейін қамтамасыз етеміз.

---

## 13. Саясатқа өзгерістер

Осы Саясатқа елеулі өзгерістер енгізілген жағдайда, біз сізге push-хабарландыру арқылы немесе Қосымшаға келесі кіру кезінде хабарлаймыз. Хабарландыру алғаннан кейін Қосымшаны пайдалануды жалғастыру жаңартылған Саясатты қабылдадыңыз дегенді білдіреді.

---

## 14. Байланыс ақпараты

Құпиялылық және жеке деректер мәселелері бойынша:

**Электрондық пошта:** support@pixapp.kz
**Пошталық мекенжай:** Қазақстан Республикасы, Алматы қаласы, Бостандык ауданы, Мирас микрорайоны 188./2, 29-пәтер, пошта индексі 050013
**Деректерді қорғау жөніндегі офицер (DPO):** Атиф Исаев

Жауап беру мерзімі: 30 күнге дейін.
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
      return (
        <strong key={i} className="text-foreground font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

const renderPolicy = (markdown: string) => {
  const lines = markdown.split("\n");
  const elements: JSX.Element[] = [];

  lines.forEach((raw, i) => {
    const line = raw.trimEnd();
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {line.slice(2)}
        </h1>,
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-2xl font-semibold text-foreground mt-8 mb-3">
          {line.slice(3)}
        </h2>,
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-lg font-semibold text-foreground mt-5 mb-2">
          {line.slice(4)}
        </h3>,
      );
    } else if (line.startsWith("---")) {
      elements.push(<hr key={i} className="my-6 border-border" />);
    } else if (line.startsWith("- ")) {
      elements.push(
        <p key={i} className="text-foreground/90 text-sm md:text-base ml-5 mb-1 leading-relaxed">
          • {renderInline(line.slice(2))}
        </p>,
      );
    } else if (line.trim() === "") {
      return;
    } else {
      elements.push(
        <p key={i} className="text-foreground/90 text-sm md:text-base mb-3 leading-relaxed">
          {renderInline(line)}
        </p>,
      );
    }
  });

  return elements;
};

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Lang>("en");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6 gap-3">
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
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {languageLabels[code]}
              </button>
            ))}
          </div>
        </div>

        <article className="max-w-none">{renderPolicy(policies[lang])}</article>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
