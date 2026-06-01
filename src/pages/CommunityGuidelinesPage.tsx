import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Lang = "en" | "ru" | "kk";

const guidelines: Record<Lang, string> = {
  en: `
# Pixap Community Guidelines

**Last updated:** ​

Pixap is a place where people discover venues, share experiences, and help others find the best spots for dining, beauty, wellness, and entertainment. To keep it enjoyable for everyone, we ask every member of our community to follow a few simple rules.

---

## Our Principles

**Be genuine.** Share real experiences. Fake reviews, inflated reactions, and impersonation accounts undermine the trust that makes Pixap useful.

**Be respectful.** Different tastes, different budgets, different opinions — that's what makes a community. Honest criticism of a venue is fine; personal attacks are not.

**Help others.** Your Live Crowd check-in, your story about a new café, or a helpful comment is exactly what Pixap is built on.

---

## What You Can Post

- Photos and videos from venues you have visited
- Stories about your experience: atmosphere, food, service, treatments
- Honest reviews — positive and negative alike
- Recommendations, tips, and questions for other users
- Reactions and shares of content you enjoy
- Live Crowd check-ins when you are genuinely at a venue

---

## What Is Not Allowed

### Harmful and Illegal Content

- Content promoting violence, terrorism, or extremism
- Material that violates the laws of your country
- Threats of physical harm directed at any person
- Instructions for carrying out illegal activities

### Sexual Content

- Nudity or sexually explicit material of any kind
- Any sexual content involving minors — this is an absolute prohibition, resulting in immediate account removal and reporting to law enforcement

### Harassment and Stalking

- Targeted attacks, insults, or humiliation of a specific person
- Sharing someone's personal information without consent (address, phone number, workplace)
- Systematic harassment of a user through messages or comments
- Coordinated calls on other users to attack a specific person

### Discrimination and Hate Speech

- Statements that demean people based on nationality, race, religion, gender, age, appearance, sexual orientation, or health status
- Discriminatory jokes targeting groups of people

### Spam and Manipulation

- Promotional posts without clear disclosure
- Mass identical messages sent to multiple users
- Artificially inflating likes, followers, or reviews using manual methods or bots
- Impersonating another user or a Pixap employee
- Fake check-ins (without actually being at a venue)

### Copyright Violations

- Posting others' photos or videos without the rights holder's permission
- Copying full texts from third-party sources

---

## PixAI — Additional Rules

The AI booking features (PixAI Smart Booking and Vibe Match) are designed to help you find venues and time slots. The following are prohibited:

- Attempting to bypass AI restrictions through prompt injection
- Using AI to generate misleading content
- Publishing AI responses as your own recommendations without disclosing the source

If an AI response is inaccurate or harmful, use the **"Report AI response"** button — it helps us improve.

---

## Live Crowd — Fair Check-In Rules

Live Crowd helps the whole community understand venue capacity in real time. Please:

- Only check in when you are physically at the venue (within 100 metres)
- Do not ask others to make fake check-ins to inflate a venue's metrics
- Remember: one check-in every 15 minutes is enough

---

## How to Report

If you see content that violates these guidelines:

1. Tap **"⋯"** next to the post, story, comment, or message
2. Select **"Report"**
3. Choose a reason from the list
4. Add details if needed

Our team reviews every report within **24–48 hours**. Filing false reports to harm a specific user may result in restrictions on your own account.

---

## Blocking Users

You can block any user from their profile page. After blocking:
- You will not see their content
- They will not see your content
- Direct messages between you are frozen

The other user is not notified when you block them.

---

## Consequences of Violations

| Violation | Consequence |
|---|---|
| Spam, inflated metrics | Content removal, temporary suspension |
| Harassment, insults | Warning, then account ban |
| Discrimination, hate speech | Immediate account ban |
| Sexual content (adults) | Content removal, account ban |
| Sexual content involving minors | Immediate permanent ban, reporting to law enforcement |
| Threats of violence | Immediate account ban, possible notification of authorities |

We reserve the right to suspend accounts without prior warning in cases of serious violations. You may appeal a decision at [support@pixapp.kz].

---

## Venue and Partner Content

Pixap partner venues are responsible for the accuracy of information in their profiles. If you see inaccurate information in a venue's profile, contact us at [support@pixapp.kz].

---

## Questions and Feedback

If you have questions or suggestions for improving these guidelines, reach out at [community@pixapp.kz].

These guidelines may be updated. We will notify you of any changes through the app.
`,
  ru: `
# Правила сообщества Pixap

**Последнее обновление:** ​

Pixap — это место, где люди открывают для себя заведения, делятся впечатлениями и помогают другим находить лучшие места для отдыха, красоты и еды. Чтобы это оставалось приятным для всех, мы просим каждого участника следовать нескольким простым правилам.

---

## Наши принципы

**Будьте настоящими.** Делитесь реальными впечатлениями. Фиктивные отзывы, накрученные реакции и поддельные профили разрушают доверие сообщества.

**Относитесь уважительно.** Разные вкусы, разные бюджеты, разные мнения — это нормально. Критика заведения допустима, оскорбления в адрес людей — нет.

**Помогайте другим.** Ваш check-in с Live Crowd, ваша история о новом кафе или совет в комментарии — это именно то, ради чего существует Pixap.

---

## Что можно публиковать

- Фотографии и видео из заведений, которые вы посетили
- Stories о своём опыте: атмосфера, блюда, сервис, процедуры
- Честные отзывы — положительные и отрицательные
- Рекомендации, советы, вопросы другим пользователям
- Репосты и реакции на понравившийся контент
- Live Crowd check-in, если вы действительно находитесь в заведении

---

## Что запрещено

### Вредоносный и незаконный контент

- Контент, пропагандирующий насилие, терроризм или экстремизм
- Материалы, нарушающие законодательство страны пребывания
- Угрозы физической расправой в адрес любого человека
- Инструкции по совершению незаконных действий

### Сексуальный контент

- Нагота, откровенные сексуальные материалы любого рода
- Контент сексуального характера с участием несовершеннолетних — абсолютный запрет, влечёт немедленную блокировку и передачу данных в правоохранительные органы

### Травля и преследование

- Целенаправленные нападки, оскорбления, унижения конкретного человека
- Публикация личных данных без согласия (адрес, номер телефона, место работы)
- Систематическое преследование пользователя через сообщения или комментарии
- Призывы к другим пользователям атаковать конкретного человека

### Дискриминация и язык ненависти

- Высказывания, унижающие людей по национальности, расе, религии, полу, возрасту, внешности, сексуальной ориентации или состоянию здоровья
- Стереотипные шутки, направленные на дискриминацию групп людей

### Спам и манипуляции

- Рекламные публикации без пометки «реклама»
- Массовые идентичные сообщения нескольким пользователям
- Накрутка лайков, подписчиков или отзывов вручную или с помощью ботов
- Выдача себя за другого пользователя или за сотрудника Pixap
- Фиктивные check-in (без реального посещения заведения)

### Нарушение авторских прав

- Публикация чужих фотографий и видео без разрешения правообладателя
- Копирование текстов целиком из сторонних источников

---

## PixAI — отдельные правила

Функция AI-бронирования (PixAI Smart Booking и Vibe Match) предназначена для помощи с выбором заведений и слотов. Запрещается:

- Пытаться обойти ограничения AI через prompt-инъекции
- Использовать AI для генерации вводящего в заблуждение контента
- Публиковать AI-ответы как собственные рекомендации без указания источника

Если AI-ответ оказался некорректным или вредным, используйте кнопку **«Пожаловаться на ответ»** — мы её улучшим.

---

## Live Crowd — правила честного check-in

Live Crowd помогает всему сообществу понимать загруженность заведений в реальном времени. Пожалуйста:

- Делайте check-in только когда вы физически находитесь в заведении (в радиусе 100 метров)
- Не просите других делать фиктивные check-in для накрутки показателей заведения
- Помните: одна отметка каждые 15 минут — достаточно

---

## Как пожаловаться

Если вы видите контент, нарушающий эти правила:

1. Нажмите **«⋯»** рядом с постом, story, комментарием или сообщением
2. Выберите **«Пожаловаться»**
3. Укажите причину из списка
4. При необходимости добавьте пояснение

Наша команда рассматривает каждую жалобу в течение **24–48 часов**. За ложные жалобы с целью навредить конкретному пользователю аккаунт может быть ограничен.

---

## Блокировка пользователей

Вы можете заблокировать любого пользователя через его профиль. После блокировки:
- Вы не видите его контент
- Он не видит ваш контент
- Личная переписка между вами замораживается

Блокировка не уведомляет другого пользователя.

---

## Последствия нарушений

| Нарушение | Последствие |
|---|---|
| Спам, накрутка | Удаление контента, временная блокировка |
| Травля, оскорбления | Предупреждение, затем блокировка аккаунта |
| Дискриминация, язык ненависти | Немедленная блокировка аккаунта |
| Сексуальный контент (совершеннолетние) | Удаление контента, блокировка |
| Сексуальный контент с несовершеннолетними | Немедленная и постоянная блокировка, передача данных в правоохранительные органы |
| Угрозы насилием | Немедленная блокировка, возможно уведомление властей |

Мы оставляем за собой право блокировать аккаунты без предупреждения в случаях серьёзных нарушений. Вы можете обжаловать решение по адресу [support@pixapp.kz].

---

## Контент заведений и партнёров

Заведения-партнёры Pixap несут ответственность за точность информации в своих профилях. Если вы видите недостоверную информацию в профиле заведения, напишите нам: [support@pixapp.kz].

---

## Вопросы и обратная связь

Если у вас есть вопросы или предложения по улучшению правил сообщества, пишите на [community@pixapp.kz].

Эти правила могут обновляться. Об изменениях мы сообщим через приложение.
`,
  kk: `
# Pixap қоғамдастық ережелері

**Соңғы жаңарту:** ​

Pixap — адамдар мекемелерді ашып, тәжірибелерімен бөлісетін және басқаларға тамақтану, сұлулық, денсаулық пен ойын-сауық саласындағы ең жақсы орындарды табуға көмектесетін кеңістік. Мұны барлығы үшін жағымды ету үшін қоғамдастықтың әрбір мүшесінен бірнеше қарапайым ережені сақтауды сұраймыз.

---

## Біздің қағидаттарымыз

**Шынайы болыңыз.** Нақты тәжірибелеріңізді бөлісіңіз. Жалған пікірлер, жасанды реакциялар және қолдан жасалған профильдер Pixap-тың пайдалылығын қамтамасыз ететін сенімді бұзады.

**Сыйластықпен қараңыз.** Әр түрлі талғам, әр түрлі бюджет, әр түрлі пікір — бұл қалыпты жағдай. Мекемені сынауға болады; адамдарды жеке қорлауға болмайды.

**Басқаларға көмектесіңіз.** Live Crowd check-in жасауыңыз, жаңа кафе туралы сторыңыз немесе комментариядағы пайдалы кеңесіңіз — Pixap дәл осыған жасалған.

---

## Не жариялауға болады

- Барып келген мекемелерден суреттер мен бейнелер
- Тәжірибеңіз туралы stories: атмосфера, тағам, қызмет, процедуралар
- Шынайы пікірлер — оң да, теріс те
- Ұсыныстар, кеңестер және басқа пайдаланушыларға сұрақтар
- Ұнаған мазмұнға реакциялар мен репосттар
- Мекемеде шын болған кезде Live Crowd check-in жасау

---

## Не тыйым салынған

### Зиянды және заңсыз мазмұн

- Зорлық-зомбылықты, терроризмді немесе экстремизмді насихаттайтын мазмұн
- Тұратын елдің заңнамасын бұзатын материалдар
- Кез келген адамға дене зиянын тигізу қаупі
- Заңсыз іс-қимылдарды орындауға нұсқаулар

### Жыныстық мазмұн

- Жалаңаштық немесе жыныстық тұрғыдан жарқын материалдар
- Кәмелетке толмағандарды қамтитын жыныстық сипаттағы кез келген мазмұн — бұл абсолютті тыйым, тіркелгіні дереу жою мен құқық қорғау органдарына хабарлауға әкеледі

### Қудалау және мазақтау

- Нақты адамға бағытталған шабуылдар, қорлау немесе кемсіту
- Келісімсіз жеке деректерді жариялау (мекенжай, телефон нөмірі, жұмыс орны)
- Хабарламалар немесе комментарийлер арқылы пайдаланушыны жүйелі түрде қудалау
- Нақты адамға шабуыл жасауға басқа пайдаланушыларды шақыру

### Кемсіту және жек көрушілік тілі

- Ұлты, нәсілі, діні, жынысы, жасы, сыртқы келбеті, жыныстық бағдары немесе денсаулық жағдайы бойынша адамдарды кемсітетін мәлімдемелер
- Адам топтарына бағытталған кемсітушілік әзілдер

### Спам және манипуляция

- Жарнамалық белгісі жоқ жарнамалық жазбалар
- Бірнеше пайдаланушыға жіберілген бірдей жаппай хабарламалар
- Қолмен немесе боттар арқылы лайктарды, жазылушыларды немесе пікірлерді жасанды түрде өсіру
- Басқа пайдаланушы немесе Pixap қызметкері ретінде өзін таныту
- Жалған check-in жасау (мекемеде шынымен болмай)

### Авторлық құқықты бұзу

- Құқық иесінің рұқсатынсыз басқалардың суреттері мен бейнелерін жариялау
- Үшінші тараптың мәтіндерін толықтай көшіру

---

## PixAI — қосымша ережелер

AI брондау мүмкіндіктері (PixAI Smart Booking және Vibe Match) мекемелер мен уақыт ұяшықтарын табуға арналған. Мыналарға тыйым салынады:

- Prompt-инъекциялар арқылы AI шектеулерін айналып өтуге әрекет жасау
- Жаңылыстыратын мазмұн жасау үшін AI пайдалану
- AI жауаптарын дереккөзді көрсетпей өз ұсыныстары ретінде жариялау

AI жауабы дұрыс емес немесе зиянды болса, **«AI жауабына шағым беру»** түймесін пайдаланыңыз — бұл жақсартуға көмектеседі.

---

## Live Crowd — әділ check-in ережелері

Live Crowd бүкіл қоғамдастыққа мекемелердің нақты уақыттағы толықтығын түсінуге көмектеседі. Өтінеміз:

- Check-in жасаңыз тек мекемеде шынымен болған кезде (100 метр радиусында)
- Мекеменің көрсеткіштерін ойдан шығару үшін басқаларды жалған check-in жасауға шақырмаңыз
- Есте сақтаңыз: 15 сайын бір рет отметка — жеткілікті

---

## Шағым қалай беруге болады

Осы ережелерді бұзатын мазмұн көрсеңіз:

1. Пост, story, комментарий немесе хабарлама жанындағы **«⋯»** түймесін басыңыз
2. **«Шағым беру»** опциясын таңдаңыз
3. Тізімнен себепті таңдаңыз
4. Қажет болса, нақтылама қосыңыз

Біздің командамыз әр шағымды **24–48 сағат** ішінде қарайды. Нақты пайдаланушыға зиян тигізу мақсатында жалған шағым берген жағдайда тіркелгіңіз шектелуі мүмкін.

---

## Пайдаланушыларды бұғаттау

Кез келген пайдаланушыны оның профиль бетінен бұғаттауға болады. Бұғаттаудан кейін:
- Сіз оның мазмұнын көрмейсіз
- Ол сіздің мазмұныңызды көрмейді
- Арасындағы жеке хат алмасу тоқтатылады

Екінші пайдаланушы бұғатталғаны туралы хабарландырылмайды.

---

## Ережелерді бұзудың салдары

| Бұзу | Салдар |
|---|---|
| Спам, жасанды өсім | Мазмұнды жою, уақытша тоқтату |
| Қудалау, қорлау | Ескерту, содан кейін тіркелгіні бұғаттау |
| Кемсіту, жек көрушілік тілі | Тіркелгіні дереу бұғаттау |
| Жыныстық мазмұн (ересектер) | Мазмұнды жою, тіркелгіні бұғаттау |
| Кәмелетке толмағандарды қамтитын жыныстық мазмұн | Тіркелгіні дереу және мәңгілік бұғаттау, құқық қорғау органдарына хабарлау |
| Зорлық-зомбылық қаупі | Тіркелгіні дереу бұғаттау, мүмкін органдарды хабардар ету |

Ауыр бұзушылықтар жағдайында алдын ала ескертусіз тіркелгілерді тоқтата тұруға құқымыз бар. Шешімге [support@pixapp.kz] мекенжайы бойынша шағым беруге болады.

---

## Мекеме және серіктес мазмұны

Pixap серіктес мекемелері профильдеріндегі ақпараттың дәлдігіне жауап береді. Мекеме профилінде дұрыс емес ақпарат көрсеңіз, бізге хабарласыңыз: [support@pixapp.kz].

---

## Сұрақтар мен кері байланыс

Осы ережелерді жетілдіру туралы сұрақтарыңыз немесе ұсыныстарыңыз болса, [community@pixapp.kz] мекенжайына жазыңыз.

Бұл ережелер жаңартылуы мүмкін. Өзгерістер туралы қосымша арқылы хабарлаймыз.
`,
};

const languageLabels: Record<Lang, string> = { en: "EN", ru: "RU", kk: "KK" };
const backLabels: Record<Lang, string> = { en: "Back", ru: "Назад", kk: "Артқа" };

const renderInline = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-foreground font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
};

const renderGuidelines = (markdown: string) => {
  const lines = markdown.split("\n");
  const elements: JSX.Element[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trimEnd();

    // Table detection: header | separator | rows
    if (line.startsWith("|") && i + 1 < lines.length && /^\|[\s\-|:]+\|$/.test(lines[i + 1].trim())) {
      const header = line.split("|").slice(1, -1).map((c) => c.trim());
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trimEnd().startsWith("|")) {
        rows.push(lines[i].split("|").slice(1, -1).map((c) => c.trim()));
        i++;
      }
      elements.push(
        <div key={`t-${i}`} className="my-5 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                {header.map((h, hi) => (
                  <th key={hi} className="text-left font-semibold text-foreground px-3 py-2">
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri} className="border-t border-border">
                  {r.map((c, ci) => (
                    <td key={ci} className="px-3 py-2 align-top text-foreground/90">
                      {renderInline(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

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
    } else if (/^\d+\.\s/.test(line)) {
      const m = line.match(/^(\d+)\.\s(.*)$/)!;
      elements.push(
        <p key={i} className="text-foreground/90 text-sm md:text-base ml-5 mb-1 leading-relaxed">
          {m[1]}. {renderInline(m[2])}
        </p>
      );
    } else if (line.trim() === "") {
      // skip
    } else {
      elements.push(
        <p key={i} className="text-foreground/90 text-sm md:text-base mb-3 leading-relaxed">
          {renderInline(line)}
        </p>
      );
    }
    i++;
  }

  return elements;
};

const CommunityGuidelinesPage = () => {
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
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {languageLabels[code]}
              </button>
            ))}
          </div>
        </div>

        <article className="max-w-none">{renderGuidelines(guidelines[lang])}</article>
      </div>
    </div>
  );
};

export default CommunityGuidelinesPage;
