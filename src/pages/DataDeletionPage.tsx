import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Lang = "en" | "ru" | "kk";

const languageLabels: Record<Lang, string> = {
  en: "EN",
  ru: "RU",
  kk: "KK",
};

type Content = {
  back: string;
  title: string;
  lastUpdated: string;
  intro: JSX.Element;
  howToTitle: string;
  howToIntro: string;
  option1Title: string;
  option1Steps: JSX.Element[];
  option2Title: string;
  option2Body: JSX.Element;
  option2Time: JSX.Element;
  deletedTitle: string;
  deletedIntro: string;
  deletedList: string[];
  retainedTitle: string;
  retainedBody: JSX.Element;
  storageTitle: string;
  storageBody: JSX.Element;
  contactTitle: string;
  contactBody: JSX.Element;
};

const SUPPORT = "support@pixap.kz";

const content: Record<Lang, Content> = {
  en: {
    back: "Back",
    title: "Account & Data Deletion",
    lastUpdated: "Last Updated: 01.06.2026",
    intro: (
      <>
        This page explains how users of the <strong>Pixap</strong> mobile application (available on Google Play) can
        request deletion of their account and associated personal data, in compliance with Google Play's User Data
        policy.
      </>
    ),
    howToTitle: "How to Request Account Deletion",
    howToIntro:
      "You can request the deletion of your Pixap account and personal data using either of the following methods:",
    option1Title: "Option 1 — In-App Request",
    option1Steps: [
      <>Open the Pixap app and sign in to your account.</>,
      <>
        Go to <strong>Profile</strong> from the bottom navigation bar.
      </>,
      <>
        Tap <strong>Edit Profile</strong>.
      </>,
      <>
        Scroll to the bottom and tap <strong>Delete Account</strong>.
      </>,
      <>Confirm the action when prompted.</>,
    ],
    option2Title: "Option 2 — Email Request",
    option2Body: (
      <>
        Send an email to{" "}
        <a href={`mailto:${SUPPORT}`} className="text-primary underline">
          {SUPPORT}
        </a>{" "}
        from the email address registered with your Pixap account, with the subject <em>"Account Deletion Request"</em>.
      </>
    ),
    option2Time: (
      <>
        Our team will verify your identity and process the request within <strong>7 business days</strong>.
      </>
    ),
    deletedTitle: "Data That Will Be Deleted",
    deletedIntro:
      "When you request account deletion, the following personal data will be permanently removed from our systems:",
    deletedList: [
      "Email address",
      "First and last name",
      "Phone number",
      "Profile photo",
      "Saved favorites and personal preferences",
      "Authentication credentials",
    ],
    retainedTitle: "Data That May Be Retained",
    retainedBody: (
      <>
        For legal, accounting, and fraud-prevention purposes, certain anonymized transactional records (e.g., past
        bookings, payment receipts) may be retained as required by applicable law. This data is dissociated from your
        personal identifiers.
      </>
    ),
    storageTitle: "Storage & Retention Period",
    storageBody: (
      <>
        After your deletion request is confirmed, your personal data is removed from active systems immediately and
        fully purged from backups within <strong>90 days</strong>.
      </>
    ),
    contactTitle: "Contact",
    contactBody: (
      <>
        For any questions regarding account deletion or your data, please contact us at{" "}
        <a href={`mailto:${SUPPORT}`} className="text-primary underline">
          {SUPPORT}
        </a>
        .
      </>
    ),
  },
  ru: {
    back: "Назад",
    title: "Удаление аккаунта и данных",
    lastUpdated: "Последнее обновление: 01.06.2026",
    intro: (
      <>
        На этой странице описано, как пользователи мобильного приложения <strong>Pixap</strong> (доступно в Google Play)
        могут запросить удаление своей учётной записи и связанных персональных данных в соответствии с политикой Google
        Play о пользовательских данных.
      </>
    ),
    howToTitle: "Как запросить удаление аккаунта",
    howToIntro:
      "Вы можете запросить удаление своей учётной записи Pixap и персональных данных одним из следующих способов:",
    option1Title: "Вариант 1 — Запрос в приложении",
    option1Steps: [
      <>Откройте приложение Pixap и войдите в свою учётную запись.</>,
      <>
        Перейдите в раздел <strong>Профиль</strong> через нижнюю панель навигации.
      </>,
      <>
        Нажмите <strong>Редактировать профиль</strong>.
      </>,
      <>
        Прокрутите вниз и нажмите <strong>Удалить аккаунт</strong>.
      </>,
      <>Подтвердите действие при появлении запроса.</>,
    ],
    option2Title: "Вариант 2 — Запрос по электронной почте",
    option2Body: (
      <>
        Отправьте письмо на адрес{" "}
        <a href={`mailto:${SUPPORT}`} className="text-primary underline">
          {SUPPORT}
        </a>{" "}
        с того адреса электронной почты, который указан в вашей учётной записи Pixap, с темой{" "}
        <em>«Запрос на удаление аккаунта»</em>.
      </>
    ),
    option2Time: (
      <>
        Наша команда подтвердит вашу личность и обработает запрос в течение <strong>7 рабочих дней</strong>.
      </>
    ),
    deletedTitle: "Какие данные будут удалены",
    deletedIntro:
      "При запросе на удаление аккаунта следующие персональные данные будут безвозвратно удалены из наших систем:",
    deletedList: [
      "Адрес электронной почты",
      "Имя и фамилия",
      "Номер телефона",
      "Фотография профиля",
      "Сохранённые избранные и личные настройки",
      "Учётные данные для входа",
    ],
    retainedTitle: "Какие данные могут быть сохранены",
    retainedBody: (
      <>
        В целях соблюдения законодательства, бухгалтерского учёта и предотвращения мошенничества определённые
        обезличенные транзакционные записи (например, прошлые бронирования, чеки об оплате) могут быть сохранены в
        соответствии с применимым законодательством. Эти данные не связаны с вашими персональными идентификаторами.
      </>
    ),
    storageTitle: "Срок хранения данных",
    storageBody: (
      <>
        После подтверждения запроса на удаление ваши персональные данные удаляются из активных систем немедленно и
        полностью стираются из резервных копий в течение <strong>90 дней</strong>.
      </>
    ),
    contactTitle: "Контакты",
    contactBody: (
      <>
        По любым вопросам, связанным с удалением аккаунта или ваших данных, пишите нам на{" "}
        <a href={`mailto:${SUPPORT}`} className="text-primary underline">
          {SUPPORT}
        </a>
        .
      </>
    ),
  },
  kk: {
    back: "Артқа",
    title: "Аккаунтты және деректерді жою",
    lastUpdated: "Соңғы жаңарту: 01.06.2026",
    intro: (
      <>
        Бұл бетте <strong>Pixap</strong> мобильді қосымшасының (Google Play-де қолжетімді) пайдаланушылары Google Play
        пайдаланушы деректері саясатына сәйкес өз есептік жазбасын және онымен байланысты жеке деректерді жоюды қалай
        сұрай алатыны түсіндіріледі.
      </>
    ),
    howToTitle: "Аккаунтты жоюды қалай сұрау керек",
    howToIntro: "Pixap аккаунтыңыз бен жеке деректеріңізді жоюды төмендегі тәсілдердің бірімен сұрай аласыз:",
    option1Title: "1-нұсқа — Қосымша арқылы сұрау",
    option1Steps: [
      <>Pixap қосымшасын ашып, аккаунтыңызға кіріңіз.</>,
      <>
        Төменгі навигация панелі арқылы <strong>Профиль</strong> бөліміне өтіңіз.
      </>,
      <>
        <strong>Профильді өңдеу</strong> түймесін басыңыз.
      </>,
      <>
        Беттің төменгі жағына жылжып, <strong>Аккаунтты жою</strong> түймесін басыңыз.
      </>,
      <>Сұраныс пайда болғанда әрекетті растаңыз.</>,
    ],
    option2Title: "2-нұсқа — Электрондық пошта арқылы сұрау",
    option2Body: (
      <>
        Pixap аккаунтыңызда тіркелген электрондық пошта мекенжайынан{" "}
        <a href={`mailto:${SUPPORT}`} className="text-primary underline">
          {SUPPORT}
        </a>{" "}
        мекенжайына <em>«Аккаунтты жою сұранысы»</em> деген тақырыппен хат жіберіңіз.
      </>
    ),
    option2Time: (
      <>
        Біздің команда жеке басыңызды растап, сұранысты <strong>7 жұмыс күні</strong> ішінде өңдейді.
      </>
    ),
    deletedTitle: "Жойылатын деректер",
    deletedIntro: "Аккаунтты жоюды сұраған кезде келесі жеке деректер жүйелерімізден біржола жойылады:",
    deletedList: [
      "Электрондық пошта мекенжайы",
      "Аты және тегі",
      "Телефон нөмірі",
      "Профиль суреті",
      "Сақталған таңдаулылар және жеке баптаулар",
      "Аутентификация деректері",
    ],
    retainedTitle: "Сақталуы мүмкін деректер",
    retainedBody: (
      <>
        Заңдық, бухгалтерлік және алаяқтықтың алдын алу мақсатында қолданыстағы заңнамаға сәйкес кейбір иесіздендірілген
        транзакциялық жазбалар (мысалы, бұрынғы брондаулар, төлем түбіртектері) сақталуы мүмкін. Бұл деректер сіздің
        жеке идентификаторларыңызбен байланыссыз.
      </>
    ),
    storageTitle: "Сақтау мерзімі",
    storageBody: (
      <>
        Жою сұранысыңыз расталғаннан кейін жеке деректеріңіз белсенді жүйелерден дереу жойылып, сақтық көшірмелерден{" "}
        <strong>90 күн</strong> ішінде толығымен өшіріледі.
      </>
    ),
    contactTitle: "Байланыс",
    contactBody: (
      <>
        Аккаунтты жою немесе деректеріңіз туралы сұрақтар бойынша бізге{" "}
        <a href={`mailto:${SUPPORT}`} className="text-primary underline">
          {SUPPORT}
        </a>{" "}
        мекенжайы арқылы хабарласыңыз.
      </>
    ),
  },
};

const DataDeletionPage = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Lang>("en");
  const c = content[lang];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6 gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition text-sm text-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> {c.back}
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

        <article className="space-y-6">
          <header className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{c.title}</h1>
            <p className="text-sm text-muted-foreground">{c.lastUpdated}</p>
          </header>

          <section className="space-y-3">
            <p className="text-foreground/90 leading-relaxed">{c.intro}</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">{c.howToTitle}</h2>
            <p className="text-foreground/90 leading-relaxed">{c.howToIntro}</p>

            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <h3 className="text-lg font-semibold text-foreground">{c.option1Title}</h3>
              <ol className="list-decimal list-inside space-y-1 text-foreground/90">
                {c.option1Steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <h3 className="text-lg font-semibold text-foreground">{c.option2Title}</h3>
              <p className="text-foreground/90">{c.option2Body}</p>
              <p className="text-foreground/90">{c.option2Time}</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">{c.deletedTitle}</h2>
            <p className="text-foreground/90 leading-relaxed">{c.deletedIntro}</p>
            <ul className="list-disc list-inside space-y-1 text-foreground/90">
              {c.deletedList.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">{c.retainedTitle}</h2>
            <p className="text-foreground/90 leading-relaxed">{c.retainedBody}</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">{c.storageTitle}</h2>
            <p className="text-foreground/90 leading-relaxed">{c.storageBody}</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">{c.contactTitle}</h2>
            <p className="text-foreground/90 leading-relaxed">{c.contactBody}</p>
          </section>
        </article>
      </div>
    </div>
  );
};

export default DataDeletionPage;
