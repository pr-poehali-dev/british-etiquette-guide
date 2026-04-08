import { useState, useCallback } from "react";
import Icon from "@/components/ui/icon";

const TRANSLATE_URL = "https://functions.poehali.dev/e0f40940-f1da-4fa2-b005-3b6816f5ab75";

type Section =
  | "home"
  | "british"
  | "russian"
  | "situations"
  | "directions"
  | "top10"
  | "memo"
  | "translator";

const NAV_ITEMS: { id: Section; label: string; icon: string }[] = [
  { id: "home", label: "Главная", icon: "Home" },
  { id: "british", label: "Британский этикет", icon: "Crown" },
  { id: "russian", label: "Русский этикет", icon: "Globe" },
  { id: "situations", label: "Ситуации", icon: "MessageSquare" },
  { id: "directions", label: "Как спросить дорогу", icon: "MapPin" },
  { id: "top10", label: "Топ-10 фраз", icon: "Star" },
  { id: "memo", label: "Памятка", icon: "BookOpen" },
  { id: "translator", label: "Переводчик", icon: "Languages" },
];

interface PhraseRow {
  situation: string;
  british: string;
  russian: string;
  translation: string;
}

const britishPhrases: PhraseRow[] = [
  { situation: "Приветствие", british: "How do you do?", russian: "Здравствуйте", translation: "Как поживаете?" },
  { situation: "Благодарность", british: "Lovely, thank you ever so much!", russian: "Спасибо большое!", translation: "Замечательно, огромное спасибо!" },
  { situation: "Извинение", british: "I'm terribly sorry to bother you", russian: "Извините, что беспокою", translation: "Мне ужасно жаль, что беспокою вас" },
  { situation: "Отказ", british: "I'm afraid that won't be possible", russian: "К сожалению, это невозможно", translation: "Боюсь, это невозможно" },
  { situation: "Несогласие", british: "That's a rather interesting perspective", russian: "Интересная точка зрения", translation: "Весьма интересная позиция" },
  { situation: "Прощание", british: "It's been an absolute pleasure", russian: "Было очень приятно", translation: "Это было настоящее удовольствие" },
  { situation: "Просьба", british: "Would you mind terribly if…", russian: "Не могли бы вы…", translation: "Вас не затруднит, если…" },
  { situation: "Комплимент", british: "You look smashing!", russian: "Вы прекрасно выглядите!", translation: "Вы потрясающе выглядите!" },
];

const russianPhrases: PhraseRow[] = [
  { situation: "Приветствие", british: "Good afternoon, how are you?", russian: "Добрый день, как дела?", translation: "Добрый день, как дела?" },
  { situation: "За столом", british: "Help yourself, please", russian: "Угощайтесь, пожалуйста", translation: "Угощайтесь, пожалуйста" },
  { situation: "Тост", british: "A toast to our friendship!", russian: "Давайте выпьем за дружбу!", translation: "Выпьем за дружбу!" },
  { situation: "Приглашение", british: "Please come in and make yourself at home", russian: "Заходите, как дома!", translation: "Заходите, будьте как дома!" },
  { situation: "Угощение", british: "Try some, it's delicious", russian: "Попробуйте, очень вкусно", translation: "Попробуйте, очень вкусно" },
  { situation: "Прощание", british: "Do come and visit us again", russian: "Приходите ещё!", translation: "Приходите снова!" },
  { situation: "Забота", british: "Are you warm enough?", russian: "Вам не холодно?", translation: "Вам не холодно?" },
  { situation: "Пожелание", british: "All the best to you", russian: "Всего вам наилучшего", translation: "Всего наилучшего" },
];

const situations: { title: string; emoji: string; brit: string; russ: string }[] = [
  {
    title: "Опоздание",
    emoji: "🕐",
    brit: "Британцы считают опоздание грубостью. Даже на 5 минут — нужно предупредить заранее и извиниться.",
    russ: "В России небольшое опоздание допустимо. «Пробки» — универсальное объяснение. Хозяева часто сами опаздывают к своему застолью.",
  },
  {
    title: "Подарки",
    emoji: "🎁",
    brit: "Подарки открывают сразу и благодарят вслух. Принято дарить вино, цветы или шоколад.",
    russ: "Подарки могут отложить, чтобы открыть позже. Чётное число цветов — только на похороны. Деньги в конверте — отличный подарок.",
  },
  {
    title: "За столом",
    emoji: "🍽️",
    brit: "Ждут, пока все будут обслужены. «Would you pass the salt, please» — обязательно с please. Локти на стол — табу.",
    russ: "Хозяева постоянно подкладывают еду. Отказаться — невежливо. «Ещё чай?» означает «конечно, давайте».",
  },
  {
    title: "Очередь",
    emoji: "🚶",
    brit: "Очередь — священна. Вперёд пропускают пожилых. Нарушение очереди — серьёзное оскорбление.",
    russ: "Очередь соблюдают, но «я только спросить» — распространённое явление. Уступать место старшим — норма.",
  },
];

const directionsRows: PhraseRow[] = [
  { situation: "Попросить помощь", british: "Excuse me, could you help me find…?", russian: "Простите, вы не подскажете, как пройти…?", translation: "Извините, не подскажете путь к…?" },
  { situation: "Уточнить", british: "I'm sorry, could you repeat that?", russian: "Не могли бы вы повторить?", translation: "Простите, не могли бы вы повторить?" },
  { situation: "Не понял", british: "I beg your pardon, I didn't quite catch that", russian: "Извините, я не расслышал", translation: "Прошу прощения, я не расслышал" },
  { situation: "Благодарность", british: "That's most helpful, thank you so much", russian: "Спасибо, вы мне очень помогли", translation: "Очень полезно, большое спасибо" },
  { situation: "Указать направление", british: "Turn left at the traffic lights", russian: "Поверните налево на светофоре", translation: "На светофоре поверните налево" },
  { situation: "Расстояние", british: "It's about a ten-minute walk", russian: "Это минут десять пешком", translation: "Примерно десять минут пешком" },
];

const top10Phrases: { en: string; ru: string; context: string }[] = [
  { en: "Excuse me", ru: "Простите / Извините", context: "Чтобы привлечь внимание или пройти мимо" },
  { en: "Please", ru: "Пожалуйста", context: "С любой просьбой — без него грубо" },
  { en: "Thank you very much", ru: "Большое спасибо", context: "После любой помощи или услуги" },
  { en: "I'm sorry", ru: "Извините / Прошу прощения", context: "Даже если случайно задели плечом" },
  { en: "Would you mind…?", ru: "Не возражаете, если…?", context: "Вежливая просьба без давления" },
  { en: "Could you help me?", ru: "Вы не могли бы мне помочь?", context: "Обратиться к незнакомцу за помощью" },
  { en: "Lovely!", ru: "Замечательно!", context: "Британский эквивалент восторга" },
  { en: "Not at all", ru: "Пожалуйста / Не стоит благодарности", context: "Ответ на извинение или благодарность" },
  { en: "After you", ru: "Прошу вас / После вас", context: "Пропустить кого-то вперёд — обязательно" },
  { en: "Cheers!", ru: "Спасибо! / За здоровье!", context: "Неформальная благодарность или тост" },
];

const memoItems = [
  { icon: "CheckCircle", color: "text-blue-600", title: "Всегда говорите please и thank you", desc: "В Британии это основа вежливости. В России — «пожалуйста» и «спасибо» не менее важны." },
  { icon: "AlertCircle", color: "text-amber-500", title: "Очередь — это серьёзно", desc: "Никогда не занимайте место без очереди. Британцы воспринимают это как оскорбление." },
  { icon: "CheckCircle", color: "text-blue-600", title: "Пунктуальность в Британии", desc: "Лучше прийти на 5 минут раньше, чем на минуту позже. Предупреждайте об опоздании." },
  { icon: "AlertCircle", color: "text-amber-500", title: "Не обсуждайте деньги и возраст", desc: "В обеих культурах это личные темы. Особенно с малознакомыми людьми." },
  { icon: "CheckCircle", color: "text-blue-600", title: "Принимайте угощение в России", desc: "Отказ от еды или чая может обидеть хозяев. Возьмите хоть немного." },
  { icon: "CheckCircle", color: "text-blue-600", title: "Улыбка в Британии — приветствие", desc: "Незнакомые люди улыбаются на улице. Это норма, не флирт." },
  { icon: "AlertCircle", color: "text-amber-500", title: "В России прямота — уважение", desc: "Прямой вопрос воспринимается как искренний интерес, а не бестактность." },
  { icon: "CheckCircle", color: "text-blue-600", title: "Рукопожатие при знакомстве", desc: "В обеих культурах крепкое рукопожатие — знак уважения. В России смотрят в глаза." },
];

function PhraseTable({ rows }: { rows: PhraseRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: "hsl(215, 80%, 38%)" }} className="text-white">
            <th className="text-left px-4 py-3 font-semibold w-[22%]">Ситуация</th>
            <th className="text-left px-4 py-3 font-semibold">🇬🇧 По-английски</th>
            <th className="text-left px-4 py-3 font-semibold">🇷🇺 По-русски</th>
            <th className="text-left px-4 py-3 font-semibold">Перевод / Пояснение</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="phrase-row transition-colors"
              style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "hsl(213, 75%, 96%)" }}
            >
              <td className="px-4 py-3 font-medium" style={{ color: "hsl(215, 80%, 38%)" }}>{row.situation}</td>
              <td className="px-4 py-3 italic text-slate-700">{row.british}</td>
              <td className="px-4 py-3 text-slate-700">{row.russian}</td>
              <td className="px-4 py-3 text-slate-500 text-xs">{row.translation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-8">
      <h2 className="font-cormorant text-4xl font-semibold leading-tight" style={{ color: "hsl(215, 35%, 12%)" }}>
        {children}
      </h2>
      {sub && <p className="mt-2 text-base" style={{ color: "hsl(215, 16%, 47%)" }}>{sub}</p>}
      <div className="mt-4 w-12 h-[3px] rounded-full" style={{ backgroundColor: "hsl(215, 80%, 38%)" }} />
    </div>
  );
}

interface HistoryItem {
  id: number;
  original: string;
  translated: string;
  time: string;
}

function TranslatorSection() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copied, setCopied] = useState(false);

  const handleTranslate = useCallback(async (overrideText?: string) => {
    const input = (overrideText ?? text).trim();
    if (!input) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch(TRANSLATE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, direction: "en|ru" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка перевода");
      const translation = data.translation as string;
      setResult(translation);
      const now = new Date();
      const timeStr = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
      setHistory((prev) => [
        { id: Date.now(), original: input, translated: translation, time: timeStr },
        ...prev.slice(0, 19),
      ]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка соединения");
    } finally {
      setLoading(false);
    }
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleQuickPhrase = (phrase: string) => {
    setText(phrase);
    setCharCount(phrase.length);
    setResult("");
    handleTranslate(phrase);
  };

  const quickPhrases = [
    "Excuse me", "Thank you very much", "Could you help me?",
    "Where is the nearest metro?", "How much does it cost?", "Have a nice day!",
  ];

  return (
    <div className="section-enter">
      {/* Title */}
      <div className="mb-8">
        <h2 className="font-cormorant text-4xl font-semibold leading-tight" style={{ color: "hsl(215, 35%, 12%)" }}>
          Переводчик
        </h2>
        <p className="mt-2 text-base" style={{ color: "hsl(215, 16%, 47%)" }}>
          Английский → Русский
        </p>
        <div className="mt-4 w-12 h-[3px] rounded-full" style={{ backgroundColor: "hsl(215, 80%, 38%)" }} />
      </div>

      {/* Direction badge */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-sm font-semibold px-4 py-1.5 rounded-full" style={{ backgroundColor: "hsl(213, 75%, 96%)", color: "hsl(215, 80%, 38%)" }}>
          🇬🇧 Английский
        </span>
        <Icon name="ArrowRight" size={16} style={{ color: "hsl(215, 16%, 47%)" }} />
        <span className="text-sm font-semibold px-4 py-1.5 rounded-full" style={{ backgroundColor: "hsl(213, 75%, 96%)", color: "hsl(215, 80%, 38%)" }}>
          🇷🇺 Русский
        </span>
      </div>

      {/* Translator blocks */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid hsl(214, 25%, 88%)" }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "hsl(214, 25%, 88%)", backgroundColor: "hsl(213, 75%, 96%)" }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(215, 80%, 38%)" }}>
              🇬🇧 Английский — исходный текст
            </span>
            {text && (
              <button onClick={() => { setText(""); setResult(""); setCharCount(0); setError(""); }} style={{ color: "hsl(215, 16%, 47%)" }}>
                <Icon name="X" size={14} />
              </button>
            )}
          </div>
          <textarea
            value={text}
            onChange={(e) => {
              const val = e.target.value.slice(0, 500);
              setText(val);
              setCharCount(val.length);
              if (!val) { setResult(""); setError(""); }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleTranslate();
            }}
            placeholder="Введите текст на английском…"
            className="w-full resize-none p-4 text-sm outline-none font-golos"
            style={{ minHeight: "180px", color: "hsl(215, 35%, 12%)" }}
          />
          <div className="px-4 py-2.5 flex items-center justify-between border-t" style={{ borderColor: "hsl(214, 25%, 88%)" }}>
            <span className="text-xs" style={{ color: charCount >= 450 ? "hsl(0,84%,60%)" : "hsl(215, 16%, 47%)" }}>
              {charCount} / 500
            </span>
            <button
              onClick={() => handleTranslate()}
              disabled={loading || !text.trim()}
              className="flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-lg transition-all disabled:opacity-40"
              style={{ backgroundColor: "hsl(215, 80%, 38%)", color: "#fff" }}
            >
              {loading
                ? <><Icon name="Loader2" size={15} className="animate-spin" />Перевожу…</>
                : <><Icon name="Languages" size={15} />Перевести</>
              }
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid hsl(214, 25%, 88%)" }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "hsl(214, 25%, 88%)", backgroundColor: "hsl(213, 75%, 96%)" }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(215, 80%, 38%)" }}>
              🇷🇺 Русский — перевод
            </span>
            {result && (
              <button onClick={handleCopy} style={{ color: copied ? "hsl(142, 70%, 40%)" : "hsl(215, 16%, 47%)" }} title="Скопировать">
                <Icon name={copied ? "Check" : "Copy"} size={14} />
              </button>
            )}
          </div>
          <div className="p-4 text-sm font-golos" style={{ minHeight: "180px", color: "hsl(215, 35%, 12%)" }}>
            {loading && (
              <div className="flex items-center gap-2 mt-4" style={{ color: "hsl(215, 16%, 47%)" }}>
                <Icon name="Loader2" size={16} className="animate-spin" />
                Выполняю перевод…
              </div>
            )}
            {!loading && error && (
              <div className="flex items-start gap-2 mt-2" style={{ color: "hsl(0, 84%, 50%)" }}>
                <Icon name="AlertCircle" size={16} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {!loading && !error && result && (
              <p className="leading-relaxed animate-fade-in">{result}</p>
            )}
            {!loading && !error && !result && (
              <p className="mt-4" style={{ color: "hsl(215, 16%, 60%)" }}>
                Перевод появится здесь…
              </p>
            )}
          </div>
          <div className="px-4 py-2.5 border-t" style={{ borderColor: "hsl(214, 25%, 88%)" }}>
            <span className="text-xs" style={{ color: "hsl(215, 16%, 47%)" }}>
              Ctrl+Enter — быстрый перевод
            </span>
          </div>
        </div>
      </div>

      {/* Quick phrases */}
      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "hsl(215, 16%, 47%)" }}>Быстрые фразы:</p>
        <div className="flex flex-wrap gap-2">
          {quickPhrases.map((phrase) => (
            <button
              key={phrase}
              onClick={() => handleQuickPhrase(phrase)}
              className="text-xs px-3 py-1.5 rounded-full transition-all"
              style={{ backgroundColor: "hsl(213, 75%, 96%)", color: "hsl(215, 80%, 38%)", border: "1px solid hsl(215, 60%, 88%)" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "hsl(215, 80%, 38%)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "hsl(213, 75%, 96%)"; e.currentTarget.style.color = "hsl(215, 80%, 38%)"; }}
            >
              {phrase}
            </button>
          ))}
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(215, 16%, 47%)" }}>
              История переводов
            </p>
            <button
              onClick={() => setHistory([])}
              className="text-xs flex items-center gap-1 transition-opacity hover:opacity-60"
              style={{ color: "hsl(215, 16%, 47%)" }}
            >
              <Icon name="Trash2" size={12} />
              Очистить
            </button>
          </div>
          <div className="space-y-2">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl px-4 py-3 flex gap-4 items-start cursor-pointer transition-all"
                style={{ border: "1px solid hsl(214, 25%, 88%)" }}
                onClick={() => { setText(item.original); setCharCount(item.original.length); setResult(item.translated); setError(""); }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "hsl(215, 80%, 38%)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "hsl(214, 25%, 88%)"; }}
              >
                <div className="flex-1 min-w-0 grid md:grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs mb-1 block" style={{ color: "hsl(215, 16%, 47%)" }}>🇬🇧</span>
                    <p className="text-sm italic truncate" style={{ color: "hsl(215, 35%, 12%)" }}>{item.original}</p>
                  </div>
                  <div>
                    <span className="text-xs mb-1 block" style={{ color: "hsl(215, 16%, 47%)" }}>🇷🇺</span>
                    <p className="text-sm truncate" style={{ color: "hsl(215, 35%, 12%)" }}>{item.translated}</p>
                  </div>
                </div>
                <span className="text-xs flex-shrink-0 mt-0.5" style={{ color: "hsl(215, 16%, 65%)" }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Index() {
  const [active, setActive] = useState<Section>("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = (id: Section) => {
    setActive(id);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen font-golos" style={{ backgroundColor: "hsl(210, 20%, 98%)" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b shadow-sm" style={{ backgroundColor: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderColor: "hsl(214, 25%, 88%)" }}>
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
          <button onClick={() => navigate("home")} className="flex items-center gap-2 group">
            <span className="font-cormorant text-2xl font-semibold leading-none transition-opacity group-hover:opacity-70" style={{ color: "hsl(215, 80%, 38%)" }}>
              Этикет
            </span>
            <span className="text-xs border rounded px-1.5 py-0.5 ml-1" style={{ color: "hsl(215, 16%, 47%)", borderColor: "hsl(214, 25%, 88%)" }}>
              🇬🇧 × 🇷🇺
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`nav-link text-sm font-medium transition-colors pb-0.5 ${active === item.id ? "active" : ""}`}
                style={{ color: active === item.id ? "hsl(215, 80%, 38%)" : "hsl(215, 16%, 47%)" }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            className="lg:hidden p-2"
            style={{ color: "hsl(215, 16%, 47%)" }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Icon name={mobileOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t animate-fade-in" style={{ borderColor: "hsl(214, 25%, 88%)", backgroundColor: "#fff" }}>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className="w-full text-left px-4 py-3 text-sm font-medium flex items-center gap-3"
                style={{
                  color: active === item.id ? "hsl(215, 80%, 38%)" : "hsl(215, 35%, 12%)",
                  backgroundColor: active === item.id ? "hsl(213, 75%, 96%)" : "transparent",
                }}
              >
                <Icon name={item.icon} size={16} fallback="Circle" />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">

        {/* HOME */}
        {active === "home" && (
          <div className="section-enter">
            <div className="relative overflow-hidden rounded-2xl text-white p-10 md:p-16 mb-10" style={{ background: "linear-gradient(135deg, hsl(215,80%,38%) 0%, hsl(215,65%,50%) 60%, hsl(210,60%,62%) 100%)" }}>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
              <div className="relative">
                <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Сравнительный справочник
                </span>
                <h1 className="font-cormorant text-5xl md:text-6xl font-semibold leading-tight mb-4">
                  Британский & Русский<br />Этикет
                </h1>
                <p className="text-lg max-w-xl mb-8 font-light" style={{ color: "rgba(255,255,255,0.85)" }}>
                  Фразы, традиции, ситуации — всё что нужно, чтобы чувствовать себя уверенно в любой культуре
                </p>
                <div className="flex flex-wrap gap-3">
                  {NAV_ITEMS.slice(1).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.id)}
                      className="text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
                      style={{ backgroundColor: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.25)")}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)")}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-5 mb-10">
              {[
                { icon: "Crown", title: "Британский этикет", desc: "Сдержанность, вежливость, очередь. Как вести себя в Великобритании.", section: "british" as Section },
                { icon: "Globe", title: "Русский этикет", desc: "Гостеприимство, прямота, уважение к старшим. Традиции России.", section: "russian" as Section },
                { icon: "Star", title: "Топ-10 фраз", desc: "Самые нужные выражения для любой ситуации с переводом.", section: "top10" as Section },
              ].map((card) => (
                <button
                  key={card.section}
                  onClick={() => navigate(card.section)}
                  className="group text-left bg-white rounded-2xl p-6 transition-all"
                  style={{ border: "1px solid hsl(214, 25%, 88%)" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "hsl(215, 80%, 38%)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(26, 86, 185, 0.1)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "hsl(214, 25%, 88%)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors" style={{ backgroundColor: "hsl(213, 75%, 96%)" }}>
                    <Icon name={card.icon} size={20} fallback="Circle" style={{ color: "hsl(215, 80%, 38%)" }} />
                  </div>
                  <h3 className="font-cormorant text-xl font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm" style={{ color: "hsl(215, 16%, 47%)" }}>{card.desc}</p>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { num: "16", label: "Фраз с переводом" },
                { num: "4", label: "Типичных ситуации" },
                { num: "10", label: "Ключевых выражений" },
                { num: "8", label: "Советов в памятке" },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl p-5 text-center" style={{ border: "1px solid hsl(214, 25%, 88%)" }}>
                  <div className="font-cormorant text-4xl font-semibold" style={{ color: "hsl(215, 80%, 38%)" }}>{s.num}</div>
                  <div className="text-xs mt-1" style={{ color: "hsl(215, 16%, 47%)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BRITISH */}
        {active === "british" && (
          <div className="section-enter">
            <SectionTitle sub="Фразы и выражения с пояснениями для повседневных ситуаций">
              🇬🇧 Британский этикет
            </SectionTitle>
            <div className="mb-6 rounded-xl p-5" style={{ backgroundColor: "hsl(213, 75%, 96%)", border: "1px solid rgba(26,86,185,0.15)" }}>
              <p className="text-sm" style={{ color: "hsl(215, 35%, 12%)" }}>
                <strong>Главное правило:</strong> Британцы ценят сдержанность, вежливость и недосказанность. «Quite good» — значит «очень хорошо», а «Interesting» — возможно, «мне не нравится».
              </p>
            </div>
            <PhraseTable rows={britishPhrases} />
            <div className="mt-8 grid md:grid-cols-2 gap-4">
              {[
                { title: "Недосказанность", icon: "MessageCircle", text: "Британцы никогда не скажут прямо «нет». «That might be a bit tricky» означает «это невозможно»." },
                { title: "Small talk", icon: "Cloud", text: "Разговор о погоде — не банальность, а форма социальной вежливости. Обязателен при встрече." },
                { title: "Очередь", icon: "Users", text: "Соблюдение очереди — священная традиция. Нарушить её — грубейшая ошибка." },
                { title: "Чаепитие", icon: "Coffee", text: "Чай — это ритуал. «Would you like a cup of tea?» часто означает «давайте поговорим»." },
              ].map((tip, i) => (
                <div key={i} className="bg-white rounded-xl p-5 flex gap-4" style={{ border: "1px solid hsl(214, 25%, 88%)" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "hsl(213, 75%, 96%)" }}>
                    <Icon name={tip.icon} size={16} fallback="Circle" style={{ color: "hsl(215, 80%, 38%)" }} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm mb-1">{tip.title}</div>
                    <div className="text-sm" style={{ color: "hsl(215, 16%, 47%)" }}>{tip.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RUSSIAN */}
        {active === "russian" && (
          <div className="section-enter">
            <SectionTitle sub="Традиции гостеприимства и выражения с английским эквивалентом">
              🇷🇺 Русский этикет
            </SectionTitle>
            <div className="mb-6 rounded-xl p-5" style={{ backgroundColor: "hsl(213, 75%, 96%)", border: "1px solid rgba(26,86,185,0.15)" }}>
              <p className="text-sm" style={{ color: "hsl(215, 35%, 12%)" }}>
                <strong>Главное правило:</strong> Русское гостеприимство — безмерное. Отказ от угощения может обидеть хозяев. Прямота воспринимается как знак уважения и искренности.
              </p>
            </div>
            <PhraseTable rows={russianPhrases} />
            <div className="mt-8 grid md:grid-cols-2 gap-4">
              {[
                { title: "Гостеприимство", icon: "Home", text: "Хозяева постоянно предлагают угощения. «Ешьте, ешьте!» — это искренняя забота, а не вежливость." },
                { title: "Тосты", icon: "Wine", text: "Застолье немыслимо без тостов. Первый — за встречу, второй — за хозяев. Пить без тоста невежливо." },
                { title: "Уважение к старшим", icon: "Heart", text: "Обращение на «вы» к старшим обязательно. Уступить место, помочь с сумкой — норма поведения." },
                { title: "Цветы", icon: "Flower2", text: "Нечётное количество цветов — для живых. Чётное — на похороны. Важная деталь при визите!" },
              ].map((tip, i) => (
                <div key={i} className="bg-white rounded-xl p-5 flex gap-4" style={{ border: "1px solid hsl(214, 25%, 88%)" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "hsl(213, 75%, 96%)" }}>
                    <Icon name={tip.icon} size={16} fallback="Circle" style={{ color: "hsl(215, 80%, 38%)" }} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm mb-1">{tip.title}</div>
                    <div className="text-sm" style={{ color: "hsl(215, 16%, 47%)" }}>{tip.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SITUATIONS */}
        {active === "situations" && (
          <div className="section-enter">
            <SectionTitle sub="Как ведут себя британцы и русские в типичных ситуациях">
              Сравнение ситуаций
            </SectionTitle>
            <div className="space-y-5">
              {situations.map((sit, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid hsl(214, 25%, 88%)" }}>
                  <div className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: "hsl(213, 75%, 96%)" }}>
                    <span className="text-2xl">{sit.emoji}</span>
                    <h3 className="font-cormorant text-xl font-semibold">{sit.title}</h3>
                  </div>
                  <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: "hsl(214, 25%, 88%)" }}>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🇬🇧</span>
                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(215, 80%, 38%)" }}>Британский подход</span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "hsl(215, 35%, 12%)" }}>{sit.brit}</p>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🇷🇺</span>
                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(215, 80%, 38%)" }}>Русский подход</span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "hsl(215, 35%, 12%)" }}>{sit.russ}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DIRECTIONS */}
        {active === "directions" && (
          <div className="section-enter">
            <SectionTitle sub="Фразы для того, чтобы спросить и объяснить дорогу">
              Как спросить дорогу
            </SectionTitle>
            <div className="mb-6 rounded-xl p-5" style={{ backgroundColor: "hsl(213, 75%, 96%)", border: "1px solid rgba(26,86,185,0.15)" }}>
              <p className="text-sm" style={{ color: "hsl(215, 35%, 12%)" }}>
                <strong>Совет:</strong> В Британии всегда начинайте с «Excuse me». В России — «Простите» или «Скажите, пожалуйста». Без этого обращение воспринимается как грубость.
              </p>
            </div>
            <PhraseTable rows={directionsRows} />
            <div className="mt-8 bg-white rounded-2xl p-6" style={{ border: "1px solid hsl(214, 25%, 88%)" }}>
              <h3 className="font-cormorant text-xl font-semibold mb-4">Полезные слова-направления</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { en: "Turn left", ru: "Поверните налево" },
                  { en: "Turn right", ru: "Поверните направо" },
                  { en: "Go straight", ru: "Идите прямо" },
                  { en: "At the corner", ru: "На углу" },
                  { en: "Opposite", ru: "Напротив" },
                  { en: "Next to", ru: "Рядом с" },
                  { en: "Underground / Metro", ru: "Метро" },
                  { en: "Bus stop", ru: "Остановка автобуса" },
                ].map((w, i) => (
                  <div key={i} className="rounded-lg p-3 text-center" style={{ backgroundColor: "hsl(213, 75%, 96%)" }}>
                    <div className="text-xs font-semibold mb-1" style={{ color: "hsl(215, 80%, 38%)" }}>{w.en}</div>
                    <div className="text-xs" style={{ color: "hsl(215, 16%, 47%)" }}>{w.ru}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TOP 10 */}
        {active === "top10" && (
          <div className="section-enter">
            <SectionTitle sub="Десять фраз, которые нужно знать в любой ситуации">
              Топ-10 фраз
            </SectionTitle>
            <div className="space-y-3">
              {top10Phrases.map((phrase, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-5 flex items-start gap-5 transition-all"
                  style={{ border: "1px solid hsl(214, 25%, 88%)" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "hsl(215, 80%, 38%)";
                    e.currentTarget.style.boxShadow = "0 2px 12px rgba(26,86,185,0.08)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "hsl(214, 25%, 88%)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div className="w-9 h-9 rounded-full text-white flex items-center justify-center font-cormorant font-semibold text-lg flex-shrink-0" style={{ backgroundColor: "hsl(215, 80%, 38%)" }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-3 mb-1">
                      <span className="font-cormorant text-xl font-semibold italic">{phrase.en}</span>
                      <span className="text-sm font-medium" style={{ color: "hsl(215, 80%, 38%)" }}>{phrase.ru}</span>
                    </div>
                    <p className="text-sm" style={{ color: "hsl(215, 16%, 47%)" }}>{phrase.context}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MEMO */}
        {active === "memo" && (
          <div className="section-enter">
            <SectionTitle sub="Главные правила поведения в британской и русской культуре">
              Памятка
            </SectionTitle>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {memoItems.map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-5 flex gap-4" style={{ border: "1px solid hsl(214, 25%, 88%)" }}>
                  <Icon name={item.icon} size={20} fallback="Circle" className={`${item.color} flex-shrink-0 mt-0.5`} />
                  <div>
                    <div className="font-semibold text-sm mb-1">{item.title}</div>
                    <div className="text-sm" style={{ color: "hsl(215, 16%, 47%)" }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl p-8 text-white text-center" style={{ background: "linear-gradient(135deg, hsl(215,80%,38%) 0%, hsl(215,65%,55%) 100%)" }}>
              <div className="font-cormorant text-3xl font-semibold mb-3">Главный принцип</div>
              <p className="max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.85)" }}>
                В любой культуре уважение, внимательность и искренняя улыбка открывают все двери.
                Знание фраз помогает — но важнее отношение.
              </p>
            </div>
          </div>
        )}

        {/* TRANSLATOR */}
        {active === "translator" && <TranslatorSection />}

      </main>

      <footer className="border-t mt-16 py-8 text-center text-sm" style={{ borderColor: "hsl(214, 25%, 88%)", color: "hsl(215, 16%, 47%)" }}>
        <p>Гид по британскому и русскому этикету · Сравнительный справочник</p>
      </footer>
    </div>
  );
}