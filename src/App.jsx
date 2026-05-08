import { useState, useEffect, useRef } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const SESSIONS = [
  {
    id:1, title:"Baby Talk", arabicTitle:"كلام البيبي", emoji:"👶", color:"#E8936A",
    tip:"🔑 ج in Egyptian = G sound. جميل → 'gameel'. جعان → 'gaaan'. Your Fusha ج is now a G!",
    vocab:[
      {id:"v1_1",egy:"يلا",trans:"yalla",egyPron:"يلّا",meaning:"Let's go / come on",sentence:"يلا ننام يا بيبي!",sentTrans:"yalla nenaam ya baby!",sentMeaning:"Let's sleep, baby!",farsi:"مثل یالا — نفس کلمه!"},
      {id:"v1_2",egy:"حلو",trans:"helw",egyPron:"حِلو",meaning:"Cute / sweet / nice",sentence:"إنت حلو أوي!",sentTrans:"inta helw awi!",sentMeaning:"You're so cute!",farsi:"حلوا in Farsi = sweets — same root!"},
      {id:"v1_3",egy:"جميل",trans:"gameel",egyPron:"جَميل",meaning:"Beautiful",sentence:"البيبي جميل أوي",sentTrans:"el-baby gameel awi",sentMeaning:"The baby is very beautiful",farsi:"جمیل in Farsi — same word!"},
      {id:"v1_4",egy:"نايم",trans:"nayem",egyPron:"نايِم",meaning:"Sleeping",sentence:"هو نايم دلوقتي",sentTrans:"huwwa nayem dilwaqti",sentMeaning:"He is sleeping now",farsi:"من نوم — مثل خواب"},
      {id:"v1_5",egy:"صاحي",trans:"sahi",egyPron:"صاحي",meaning:"Awake",sentence:"البيبي صاحي من الصبح",sentTrans:"el-baby sahi men el-subh",sentMeaning:"Baby has been awake since morning",farsi:""},
      {id:"v1_6",egy:"جعان",trans:"gaaan",egyPron:"جَعان",meaning:"Hungry",sentence:"البيبي جعان يلا ناكل",sentTrans:"el-baby gaaan yalla naakul",sentMeaning:"Baby is hungry, let's eat",farsi:""},
      {id:"v1_7",egy:"تعبان",trans:"taaban",egyPron:"تَعبان",meaning:"Tired / unwell",sentence:"تعبان ولا كويس؟",sentTrans:"taaban walla kwayyes?",sentMeaning:"Tired or OK?",farsi:"تعبان in Farsi too!"},
      {id:"v1_8",egy:"حبيبي",trans:"habibi",egyPron:"حَبيبي",meaning:"My love (to boy/man)",sentence:"بحبك يا حبيبي",sentTrans:"bahibbak ya habibi",sentMeaning:"I love you, my love",farsi:"حبیبی in Farsi too!"},
    ],
  },
  {
    id:2, title:"Home & Daily Life", arabicTitle:"البيت والروتين", emoji:"🏠", color:"#5B8FA8",
    tip:"🔑 خلاص is your most powerful word. It ends arguments, wraps up tasks, comforts a baby. Use it 10x a day!",
    vocab:[
      {id:"v2_1",egy:"البيت",trans:"el-beit",egyPron:"البَيت",meaning:"Home / the house",sentence:"يلا نرجع البيت",sentTrans:"yalla nerga el-beit",sentMeaning:"Let's go home",farsi:"بیت in Farsi too!"},
      {id:"v2_2",egy:"دلوقتي",trans:"dilwaqti",egyPron:"دِلوَقتي",meaning:"Right now",sentence:"مش عارفة دلوقتي",sentTrans:"mesh aarfa dilwaqti",sentMeaning:"I don't know right now",farsi:"الآن in Fusha"},
      {id:"v2_3",egy:"خلاص",trans:"khalas",egyPron:"خَلاص",meaning:"Done / finished / OK then",sentence:"خلاص نام",sentTrans:"khalas naam",sentMeaning:"OK then, sleep",farsi:"خلاص in Farsi too!"},
      {id:"v2_4",egy:"بكرة",trans:"bukra",egyPron:"بُكرة",meaning:"Tomorrow",sentence:"هنتكلم بكرة",sentTrans:"hantekallem bukra",sentMeaning:"We'll talk tomorrow",farsi:"مثل فردا"},
      {id:"v2_5",egy:"النهارده",trans:"en-naharda",egyPron:"النَهارده",meaning:"Today",sentence:"النهارده تعبانة",sentTrans:"en-naharda taabana",sentMeaning:"I'm tired today",farsi:"مثل امروز"},
      {id:"v2_6",egy:"بدري",trans:"badri",egyPron:"بَدري",meaning:"Early",sentence:"ننام بدري النهارده",sentTrans:"nenaam badri en-naharda",sentMeaning:"Let's sleep early today",farsi:""},
      {id:"v2_7",egy:"ماشي",trans:"maashi",egyPron:"ماشي",meaning:"OK / alright / sure",sentence:"ماشي أنا هساعدك",sentTrans:"maashi ana hasaadak",sentMeaning:"OK, I'll help you",farsi:""},
      {id:"v2_8",egy:"كمان",trans:"kamaan",egyPron:"كَمان",meaning:"Also / too / more",sentence:"عايزة كمان؟",sentTrans:"aayza kamaan?",sentMeaning:"Do you want more?",farsi:"هم در فارسی"},
    ],
  },
  {
    id:3, title:"Feelings", arabicTitle:"المشاعر", emoji:"💬", color:"#7B6FA0",
    tip:"🔑 أوي (awi) = Egyptian turbo. Slap it after any adjective: تعبانة أوي, حلو أوي. Instant Egyptian!",
    vocab:[
      {id:"v3_1",egy:"مبسوط",trans:"mabsoot",egyPron:"مَبسوط",meaning:"Happy / content",sentence:"أنا مبسوطة بيك",sentTrans:"ana mabsoota beek",sentMeaning:"I'm happy with you",farsi:"مبسوط in Farsi — same word!"},
      {id:"v3_2",egy:"زعلان",trans:"zaalan",egyPron:"زَعلان",meaning:"Upset / sad",sentence:"البيبي زعلان ليه؟",sentTrans:"el-baby zaalan leih?",sentMeaning:"Why is the baby upset?",farsi:""},
      {id:"v3_3",egy:"قلقان",trans:"alqaan",egyPron:"قَلقان",meaning:"Worried / anxious",sentence:"أنا قلقانة عليه",sentTrans:"ana qalqana aleih",sentMeaning:"I'm worried about him",farsi:"قلق in Farsi — same root!"},
      {id:"v3_4",egy:"زهقان",trans:"zahqaan",egyPron:"زَهقان",meaning:"Fed up / emotionally drained",sentence:"أنا زهقانة أوي",sentTrans:"ana zahqana awi",sentMeaning:"I'm really drained",farsi:"زهله رفتن in Farsi!"},
      {id:"v3_5",egy:"معلش",trans:"maalesh",egyPron:"مَعلِش",meaning:"Never mind / it's OK",sentence:"معلش يا حبيبتي",sentTrans:"maalesh ya habibti",sentMeaning:"Never mind, my love",farsi:""},
      {id:"v3_6",egy:"أوي",trans:"awi",egyPron:"أوي",meaning:"Very / a lot",sentence:"حلو أوي يا بيبي",sentTrans:"helw awi ya baby",sentMeaning:"So cute, baby!",farsi:""},
      {id:"v3_7",egy:"شوية",trans:"shwayya",egyPron:"شُوية",meaning:"A little / a bit",sentence:"تعبانة شوية بس",sentTrans:"taabana shwayya bass",sentMeaning:"Just a little tired",farsi:"کمی"},
      {id:"v3_8",egy:"كويس",trans:"kwayyes",egyPron:"كُويِّس",meaning:"Good / OK / fine",sentence:"كويس؟ الحمد لله",sentTrans:"kwayyes? el-hamdu lillah",sentMeaning:"OK? Thank God / I'm fine",farsi:""},
    ],
  },
  {
    id:4, title:"Shopping", arabicTitle:"التسوق", emoji:"🛒", color:"#5C9E6E",
    tip:"🔑 حاجة (haaga) = 'thing'. عايزة حاجة, مفيش حاجة, أي حاجة. Master this and you can say almost anything!",
    vocab:[
      {id:"v4_1",egy:"عايزة",trans:"aayza",egyPron:"عايزة",meaning:"I want / I need (woman)",sentence:"عايزة حاجة تانية",sentTrans:"aayza haaga taanya",sentMeaning:"I want something else",farsi:"میخوام in Farsi"},
      {id:"v4_2",egy:"حاجة",trans:"haaga",egyPron:"حاجة",meaning:"Thing / something",sentence:"عندك حاجة حلوة؟",sentTrans:"andak haaga helwa?",sentMeaning:"Do you have something nice?",farsi:""},
      {id:"v4_3",egy:"بكام",trans:"bikaam",egyPron:"بِكام",meaning:"How much?",sentence:"بكام ده؟",sentTrans:"bikaam da?",sentMeaning:"How much is this?",farsi:"چند؟ in Farsi"},
      {id:"v4_4",egy:"غالي",trans:"ghali",egyPron:"غالي",meaning:"Expensive",sentence:"ده غالي أوي",sentTrans:"da ghali awi",sentMeaning:"This is very expensive",farsi:"گران in Farsi"},
      {id:"v4_5",egy:"رخيص",trans:"rekhees",egyPron:"رِخيص",meaning:"Cheap / affordable",sentence:"لا ده رخيص",sentTrans:"la da rekhees",sentMeaning:"No, this is cheap",farsi:"ارزان in Farsi"},
      {id:"v4_6",egy:"كفاية",trans:"kifaaya",egyPron:"كِفاية",meaning:"Enough / that's enough",sentence:"كفاية كده شكراً",sentTrans:"kifaaya keda shukran",sentMeaning:"That's enough, thank you",farsi:"کافیه in Farsi — same root!"},
      {id:"v4_7",egy:"هات",trans:"haat",egyPron:"هات",meaning:"Give me / bring",sentence:"هات اتنين من ده",sentTrans:"haat itneen men da",sentMeaning:"Bring two of these",farsi:"بده in Farsi"},
      {id:"v4_8",egy:"بس",trans:"bass",egyPron:"بَس",meaning:"Just / only / that's it",sentence:"بس كده شكراً",sentTrans:"bass keda shukran",sentMeaning:"Just that, thank you",farsi:"بس in Farsi — same!"},
    ],
  },
  {
    id:5, title:"With Your Husband", arabicTitle:"مع جوزك", emoji:"💑", color:"#C4736A",
    tip:"🔑 يسلم إيديك & ربنا يخليك — these blessings are love in Egyptian. Your husband will melt when you say them.",
    vocab:[
      {id:"v5_1",egy:"وحشتني",trans:"wehashtni",egyPron:"وِحِشتني",meaning:"I missed you",sentence:"وحشتني أوي يا حبيبي",sentTrans:"wehashtni awi ya habibi",sentMeaning:"I missed you so much",farsi:"دلم برات تنگ شد"},
      {id:"v5_2",egy:"إزيك",trans:"izzayyak",egyPron:"إزَيَّك",meaning:"How are you? (to him)",sentence:"إزيك يا حبيبي؟ تمام؟",sentTrans:"izzayyak ya habibi tamaam?",sentMeaning:"How are you, love? All good?",farsi:"حالت چطوره؟"},
      {id:"v5_3",egy:"تمام",trans:"tamaam",egyPron:"تَمام",meaning:"Perfect / great / fine",sentence:"كل حاجة تمام",sentTrans:"kull haaga tamaam",sentMeaning:"Everything is great",farsi:"تمام in Farsi — identical!"},
      {id:"v5_4",egy:"يسلم إيديك",trans:"yeslem eideik",egyPron:"يِسلَم إيديك",meaning:"Bless your hands",sentence:"يسلم إيديك الأكل زاكي",sentTrans:"yeslem eideik el-akl zaaki",sentMeaning:"Bless your hands, food is delicious",farsi:"دستت درد نکنه!"},
      {id:"v5_5",egy:"ربنا يخليك",trans:"rabbena yekhallak",egyPron:"رَبِّنا يِخَلِّيك",meaning:"May God keep you for me",sentence:"ربنا يخليك يا حبيبي",sentTrans:"rabbena yekhallak ya habibi",sentMeaning:"May God keep you, my love",farsi:"خدا نگهدارت"},
      {id:"v5_6",egy:"بحبك",trans:"bahibbak",egyPron:"بَحِبَّك",meaning:"I love you (to him)",sentence:"بحبك كتير يا حبيبي",sentTrans:"bahibbak kteer ya habibi",sentMeaning:"I love you so much",farsi:"دوستت دارم"},
      {id:"v5_7",egy:"ساعدني",trans:"saaidni",egyPron:"ساعِدني",meaning:"Help me",sentence:"ممكن تساعدني؟",sentTrans:"mumkin tisaaidni?",sentMeaning:"Can you help me?",farsi:""},
      {id:"v5_8",egy:"زاكي",trans:"zaaki",egyPron:"زاكي",meaning:"Delicious / tasty",sentence:"الأكل زاكي أوي!",sentTrans:"el-akl zaaki awi!",sentMeaning:"The food is so delicious!",farsi:""},
    ],
  },
];

const ALL_VOCAB = SESSIONS.flatMap(s =>
  s.vocab.map(v => ({...v, sessionEmoji:s.emoji, sessionColor:s.color, sessionTitle:s.title}))
);
const ALL_MEANINGS     = ALL_VOCAB.map(v => v.meaning);
const ALL_SENT_MEANINGS = ALL_VOCAB.map(v => v.sentMeaning);

// ─── STORAGE ──────────────────────────────────────────────────────────────────
function storageGet(key) {
  try { const val = localStorage.getItem(key); return val ? JSON.parse(val) : null; }
  catch { return null; }
}
function storageSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ─── TTS ──────────────────────────────────────────────────────────────────────
const _vs = { voices:[], ready:false };
function loadVoices() {
  if (!window.speechSynthesis) return;
  const v = window.speechSynthesis.getVoices();
  if (v.length) { _vs.voices = v; _vs.ready = true; }
}
if (typeof window !== "undefined") {
  loadVoices();
  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
    const p = setInterval(() => { loadVoices(); if (_vs.ready) clearInterval(p); }, 300);
    setTimeout(() => clearInterval(p), 6000);
  }
}
function tts(text, rate = 0.82) {
  if (!window.speechSynthesis) return;
  loadVoices();
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const ar = _vs.voices.find(v => v.lang === "ar-EG")
    || _vs.voices.find(v => v.lang === "ar-SA")
    || _vs.voices.find(v => v.lang && v.lang.startsWith("ar"));
  if (ar) u.voice = ar;
  u.lang = "ar-EG"; u.rate = rate; u.pitch = 1.0;
  setTimeout(() => window.speechSynthesis.speak(u), 60);
}

function SpeakBtn({ text, size=18, color="#888" }) {
  const [on, setOn] = useState(false);
  return (
    <button onClick={() => { setOn(true); tts(text); setTimeout(() => setOn(false), 1800); }}
      style={{ background:"none", border:"none", cursor:"pointer", padding:"2px 6px",
        fontSize:size, color:on?"#E8936A":color, transition:"color 0.2s", lineHeight:1, flexShrink:0 }}>
      {on ? "🔈" : "🔊"}
    </button>
  );
}

// ─── OPTION HELPERS ───────────────────────────────────────────────────────────
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function wordOptions(correct)     { return shuffle([...shuffle(ALL_MEANINGS.filter(m=>m!==correct)).slice(0,3), correct]); }
function sentOptions(correct)     { return shuffle([...shuffle(ALL_SENT_MEANINGS.filter(m=>m!==correct)).slice(0,3), correct]); }
function reverseOptions(correct)  { return shuffle([...shuffle(ALL_VOCAB.map(v=>v.egy).filter(e=>e!==correct)).slice(0,3), correct]); }

// ─── LEARN QUIZ (word only, session-scoped) ───────────────────────────────────
// Shows: Arabic word + pronunciation + example sentence (Arabic, no translation)
// Options: 4 English meanings
// Mistakes → learnFlags[vocabId] = true; cleared on next correct answer
function LearnQuiz({ sessionVocab, sessionColor, learnFlags, onComplete }) {
  // Exactly one question per word. Flagged words first, then unflagged. Both groups shuffled.
  const [queue] = useState(() => {
    const flagged   = shuffle(sessionVocab.filter(v =>  learnFlags[v.id]).map(v => v.id));
    const unflagged = shuffle(sessionVocab.filter(v => !learnFlags[v.id]).map(v => v.id));
    return [...flagged, ...unflagged]; // exactly sessionVocab.length items
  });

  const [idx, setIdx]         = useState(0);
  const [results, setResults] = useState([]); // [{id, correct}]

  if (!queue.length) return (
    <div style={{padding:32,textAlign:"center",color:"#888"}}>No words in this session.</div>
  );

  function handleResult(vocabId, correct) {
    const nr = [...results, {id: vocabId, correct}];
    setResults(nr);
    const nextIdx = idx + 1;
    if (nextIdx >= queue.length) {
      // Done — go straight back to word list via onComplete (no done screen)
      onComplete(nr);
    } else {
      setIdx(nextIdx);
    }
  }

  const vocabId = queue[idx];
  const vocab   = ALL_VOCAB.find(v => v.id === vocabId);

  return (
    <div style={{padding:"0 0 20px"}}>
      <div style={{display:"flex",gap:4,padding:"14px 20px 6px",justifyContent:"center",flexWrap:"wrap"}}>
        {queue.map((_,i) => (
          <div key={i} style={{width:9,height:9,borderRadius:"50%",flexShrink:0,
            background: i < idx
              ? (results[i]?.correct===true ? "#28a745" : results[i]?.correct===false ? "#dc3545" : "#aaa")
              : i === idx ? sessionColor : "#e0e0e0",
            transition:"background 0.3s"}}/>
        ))}
      </div>
      <div style={{textAlign:"center",fontSize:12,color:"#aaa",marginBottom:8}}>
        {idx + 1} of {queue.length}
      </div>
      <div style={{padding:"0 16px"}}>
        <LearnExCard
          key={`${idx}-${vocabId}`}
          vocab={vocab}
          sessionColor={sessionColor}
          onResult={(correct) => handleResult(vocabId, correct)}
        />
      </div>
    </div>
  );
}

function LearnExCard({ vocab, sessionColor, onResult }) {
  const [chosen, setChosen]     = useState(null);   // selected option
  const [submitted, setSubmitted] = useState(false); // after Submit pressed
  const [options]               = useState(() => wordOptions(vocab.meaning));

  useEffect(() => { tts(vocab.egy, 0.78); }, []);

  const isCorrect = submitted && chosen === vocab.meaning;
  const isWrong   = submitted && chosen !== vocab.meaning && chosen !== null;

  function submit() {
    if (!chosen || submitted) return;
    setSubmitted(true);
    // No audio after submit for word questions — user already heard it on mount
  }

  function next() {
    if (!submitted) return;
    onResult(chosen === vocab.meaning ? true : chosen === null ? null : false);
  }

  return (
    <div style={X.card}>
      <div style={X.chip}>🌍 What does this word mean?</div>

      {/* Word + pronunciation + sentence hint */}
      <div style={X.stimulus}>
        <div style={{direction:"rtl",fontSize:42,fontWeight:"bold",letterSpacing:1,marginBottom:6}}>
          {vocab.egy}
        </div>
        <div style={{fontSize:13,color:"#7B6FA0",fontWeight:"bold",marginBottom:2}}>{vocab.egyPron}</div>
        <div style={{fontSize:13,color:"#aaa",fontStyle:"italic",marginBottom:12}}>{vocab.trans}</div>
        <div style={{background:"#fff",borderRadius:10,padding:"8px 12px",border:"1px dashed #ddd",direction:"rtl",fontSize:15,color:"#666",lineHeight:1.6,marginBottom:4}}>
          {vocab.sentence}
        </div>
        <div style={{fontSize:12,color:"#bbb",fontStyle:"italic",marginBottom:8}}>{vocab.sentTrans}</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
          <SpeakBtn text={vocab.egy} size={18} color="#7B6FA0"/>
          <span style={{fontSize:11,color:"#ccc"}}>tap to hear</span>
        </div>
      </div>

      {/* Options — selectable before submit, locked after */}
      <div style={X.opts}>
        {options.map(o => {
          let bg="#fff", bc="#e0e0e0", fc="#2c2c2c";
          if (!submitted) {
            if (chosen === o) { bg=sessionColor+"22"; bc=sessionColor; fc="#2c2c2c"; }
          } else {
            if (o === vocab.meaning)           { bg="#d4edda"; bc="#28a745"; fc="#155724"; }
            else if (o === chosen)             { bg="#fde8e8"; bc="#dc3545"; fc="#721c24"; }
          }
          return (
            <button key={o} onClick={() => !submitted && setChosen(o)}
              style={{...X.opt, background:bg, borderColor:bc, color:fc,
                cursor: submitted ? "default" : "pointer"}}>
              {o}
            </button>
          );
        })}
      </div>

      {/* Feedback after submit */}
      {submitted && (
        <div style={{textAlign:"center", marginTop:10, fontSize:15, fontWeight:"bold",
          color: isCorrect ? "#28a745" : "#dc3545"}}>
          {isCorrect ? "✅ Correct!" : "❌ Wrong"}
        </div>
      )}

      {/* Reveal answer details after wrong */}
      {submitted && !isCorrect && (
        <div style={{...X.reveal, marginTop:10}}>
          <p style={{margin:"0 0 6px",fontSize:12,color:"#856404",fontWeight:"bold",textTransform:"uppercase"}}>The answer</p>
          <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:6,flexWrap:"wrap"}}>
            <span style={{fontSize:26,fontWeight:"bold",direction:"rtl"}}>{vocab.egy}</span>
            <span style={{fontSize:15,color:"#555"}}>{vocab.meaning}</span>
            <SpeakBtn text={vocab.egy} size={16} color="#E8936A"/>
          </div>
          <div style={{fontSize:12,color:"#7B6FA0",fontWeight:"bold",marginBottom:2}}>{vocab.egyPron}</div>
          <div style={{fontSize:12,color:"#aaa",fontStyle:"italic",marginBottom:10}}>{vocab.trans}</div>
          <div style={{background:"#fffbe6",borderRadius:10,padding:"12px 14px",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:6,marginBottom:4}}>
              <SpeakBtn text={vocab.sentence} size={14} color="#856404"/>
              <div style={{direction:"rtl",fontSize:17,fontWeight:"bold",lineHeight:1.5}}>{vocab.sentence}</div>
            </div>
            <div style={{fontSize:12,color:"#aaa",fontStyle:"italic",marginBottom:2}}>{vocab.sentTrans}</div>
            <div style={{fontSize:13,color:"#666"}}>{vocab.sentMeaning}</div>
          </div>
          {vocab.farsi&&<div style={{background:"#EDE8F5",borderRadius:8,padding:"7px 10px",fontSize:12,color:"#6B4E8A"}}>🇮🇷 {vocab.farsi}</div>}
        </div>
      )}

      {/* Bottom buttons */}
      {!submitted ? (
        <div style={{display:"flex",gap:8,marginTop:14}}>
          <button onClick={submit} disabled={!chosen}
            style={{...X.btn, background: chosen ? sessionColor : "#ccc",
              flex:2, cursor: chosen?"pointer":"not-allowed", opacity: chosen?1:0.6}}>
            Submit ✓
          </button>
          <button onClick={() => onResult(null)}
            style={{...X.ghostBtn, flex:1}}>
            ⏭ Skip
          </button>
        </div>
      ) : (
        <button onClick={next} style={{...X.btn, background:"#5B8FA8", width:"100%", marginTop:14}}>
          Next →
        </button>
      )}
    </div>
  );
}

// ─── TEST EXERCISE CARD (3 types, all 40 words) ───────────────────────────────
function TestExCard({ item, onResult }) {
  const vocab   = ALL_VOCAB.find(v => v.id === item.vocabId);
  const type    = item.type;
  const correct = type==="word" ? vocab.meaning : type==="sentence" ? vocab.sentMeaning : vocab.egy;
  const [chosen, setChosen]       = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [options] = useState(() =>
    type==="word"       ? wordOptions(vocab.meaning)
    : type==="sentence" ? sentOptions(vocab.sentMeaning)
    :                     reverseOptions(vocab.egy)
  );

  // For word/sentence: auto-play Arabic. For reverse: silent.
  useEffect(() => {
    if (type !== "reverse") tts(type==="sentence" ? vocab.sentence : vocab.egy, 0.78);
  }, []);

  const isCorrect = submitted && chosen === correct;

  function submit() {
    if (!chosen || submitted) return;
    setSubmitted(true);
    // Only for reverse (English→Arabic): play the correct Arabic answer after submit,
    // regardless of whether the user got it right or wrong.
    if (type === "reverse") setTimeout(() => tts(correct, 0.82), 150);
    // Word/sentence questions: no audio after submit (word already played on mount)
  }

  function next() {
    if (!submitted) return;
    onResult(chosen === correct ? true : chosen === null ? null : false);
  }

  const chip = type==="word" ? "🌍 What does this word mean?"
             : type==="sentence" ? "📖 What does this sentence mean?"
             : "🔄 Choose the Arabic word";

  return (
    <div style={X.card}>
      <div style={X.chip}>{chip}</div>

      {/* Question */}
      <div style={{...X.stimulus, cursor:type==="reverse"?"default":"pointer"}}
        onClick={() => type!=="reverse" && tts(type==="sentence"?vocab.sentence:vocab.egy)}>
        {type==="reverse" ? (
          <div style={{fontSize:22,fontWeight:"bold",color:"#2c2c2c",marginBottom:4}}>{vocab.meaning}</div>
        ) : type==="sentence" ? (
          <>
            <div style={{direction:"rtl",fontSize:20,fontWeight:"bold",lineHeight:1.7,marginBottom:6}}>{vocab.sentence}</div>
            <div style={{fontSize:12,color:"#aaa",fontStyle:"italic",marginBottom:6}}>{vocab.sentTrans}</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              <SpeakBtn text={vocab.sentence} size={18} color="#7B6FA0"/>
              <span style={{fontSize:11,color:"#ccc"}}>tap to hear</span>
            </div>
          </>
        ) : (
          <>
            <div style={{direction:"rtl",fontSize:42,fontWeight:"bold",letterSpacing:1,marginBottom:6}}>{vocab.egy}</div>
            <div style={{fontSize:13,color:"#7B6FA0",fontWeight:"bold",marginBottom:2}}>{vocab.egyPron}</div>
            <div style={{fontSize:13,color:"#aaa",fontStyle:"italic",marginBottom:10}}>{vocab.trans}</div>
            <div style={{background:"#fff",borderRadius:10,padding:"8px 12px",border:"1px dashed #ddd",direction:"rtl",fontSize:15,color:"#666",lineHeight:1.6,marginBottom:4}}>
              {vocab.sentence}
            </div>
            <div style={{fontSize:12,color:"#bbb",fontStyle:"italic",marginBottom:8}}>{vocab.sentTrans}</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              <SpeakBtn text={vocab.egy} size={18} color="#7B6FA0"/>
              <span style={{fontSize:11,color:"#ccc"}}>tap to hear</span>
            </div>
          </>
        )}
      </div>

      {/* Options — tap to select, then Submit */}
      <div style={type==="reverse" ? X.optsCol : X.opts}>
        {options.map(o => {
          let bg="#fff", bc="#e0e0e0", fc="#2c2c2c";
          if (!submitted) {
            if (chosen === o) { bg="#7B6FA022"; bc="#7B6FA0"; }
          } else {
            if (o === correct)          { bg="#d4edda"; bc="#28a745"; fc="#155724"; }
            else if (o === chosen)      { bg="#fde8e8"; bc="#dc3545"; fc="#721c24"; }
          }
          return (
            <button key={o} onClick={() => !submitted && setChosen(o)}
              style={{...X.opt, background:bg, borderColor:bc, color:fc,
                direction: type==="reverse" ? "rtl" : "ltr",
                fontSize:  type==="reverse" ? 18 : 14,
                cursor: submitted ? "default" : "pointer"}}>
              {o}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {submitted && (
        <div style={{textAlign:"center", marginTop:10, fontSize:15, fontWeight:"bold",
          color: isCorrect ? "#28a745" : "#dc3545"}}>
          {isCorrect ? "✅ Correct!" : "❌ Wrong"}
        </div>
      )}

      {/* Answer details on wrong */}
      {submitted && !isCorrect && (
        <div style={{...X.reveal, marginTop:10}}>
          <p style={{margin:"0 0 6px",fontSize:12,color:"#856404",fontWeight:"bold",textTransform:"uppercase"}}>The answer</p>
          <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:6,flexWrap:"wrap"}}>
            <span style={{fontSize:26,fontWeight:"bold",direction:"rtl"}}>{vocab.egy}</span>
            <span style={{fontSize:15,color:"#555"}}>{vocab.meaning}</span>
            <SpeakBtn text={vocab.egy} size={16} color="#E8936A"/>
          </div>
          <div style={{fontSize:12,color:"#7B6FA0",fontWeight:"bold",marginBottom:2}}>{vocab.egyPron}</div>
          <div style={{fontSize:12,color:"#aaa",fontStyle:"italic",marginBottom:10}}>{vocab.trans}</div>
          <div style={{background:"#fffbe6",borderRadius:10,padding:"12px 14px",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:6,marginBottom:4}}>
              <SpeakBtn text={vocab.sentence} size={14} color="#856404"/>
              <div style={{direction:"rtl",fontSize:17,fontWeight:"bold",lineHeight:1.5}}>{vocab.sentence}</div>
            </div>
            <div style={{fontSize:12,color:"#aaa",fontStyle:"italic",marginBottom:2}}>{vocab.sentTrans}</div>
            <div style={{fontSize:13,color:"#666"}}>{vocab.sentMeaning}</div>
          </div>
          {vocab.farsi&&<div style={{background:"#EDE8F5",borderRadius:8,padding:"7px 10px",fontSize:12,color:"#6B4E8A"}}>🇮🇷 {vocab.farsi}</div>}
        </div>
      )}

      {/* Submit / Next / Skip */}
      {!submitted ? (
        <div style={{display:"flex",gap:8,marginTop:14}}>
          <button onClick={submit} disabled={!chosen}
            style={{...X.btn, background: chosen ? "#7B6FA0" : "#ccc",
              flex:2, cursor: chosen?"pointer":"not-allowed", opacity: chosen?1:0.6}}>
            Submit ✓
          </button>
          <button onClick={() => onResult(null)} style={{...X.ghostBtn, flex:1}}>⏭ Skip</button>
        </div>
      ) : (
        <button onClick={next} style={{...X.btn, background:"#5B8FA8", width:"100%", marginTop:14}}>
          Next →
        </button>
      )}
    </div>
  );
}

// ─── TEST SESSION ─────────────────────────────────────────────────────────────
// All 40 words, 3 types, weighted by testProgress (wrong count). No consecutive repeats.
function buildTestQueue(testProgress) {
  const types = ["word","sentence","reverse"];
  const weighted = [];
  for (const v of ALL_VOCAB) {
    const p = testProgress[v.id]||{};
    const w = !p.seen ? 3 : (p.wrong||0)>0 ? Math.min(p.wrong+2,4) : 1;
    for (let i=0;i<w;i++) weighted.push({vocabId:v.id, type:types[i%types.length]});
  }
  const sh = shuffle(weighted);
  // Remove consecutive same vocabId
  const out = [];
  for (const item of sh) {
    if (!out.length||out[out.length-1].vocabId!==item.vocabId) out.push(item);
  }
  return out.slice(0,12);
}

function TestSession({ testProgress, onComplete }) {
  const [queue]   = useState(() => buildTestQueue(testProgress));
  const [idx,setIdx]         = useState(0);
  const [results,setResults] = useState([]);
  const [done,setDone]       = useState(false);
  // Ref updates synchronously — used to block the active-question render
  // in the same cycle that handleResult fires, before React re-renders with done=true.
  const doneRef = useRef(false);

  if (!queue.length) return <div style={{padding:32,textAlign:"center",color:"#888"}}>No words yet!</div>;

  function handleResult(correct) {
    const nr = [...results, {vocabId:queue[idx].vocabId, correct}];
    setResults(nr);
    const nextIdx = idx + 1;
    if (nextIdx >= queue.length) {
      doneRef.current = true; // synchronous guard — blocks next render immediately
      setDone(true);
      onComplete(queue, nr);
    } else {
      setIdx(nextIdx);
    }
  }

  // ── Done screen — MUST come before the active-question render ──
  if (done) {
    const c=results.filter(r=>r.correct===true).length;
    const w=results.filter(r=>r.correct===false).length;
    const s=results.filter(r=>r.correct===null).length;
    const total=queue.length;
    const pct=Math.round(c/total*100);

    const tiers = [
      { min:90, emoji:"🌟", arabic:"ممتاز!", messages:[
        "Your baby is going to grow up bilingual because of YOU.",
        "Your husband doesn't know it yet, but you're going to out-Egyptian him soon.",
        "يلا ننام — you even know how to say that now. Flawless.",
        "That's the kind of session that makes a language stick for life.",
        "If Egyptian Arabic were a sport, you just won the match.",
      ]},
      { min:70, emoji:"✨", arabic:"كويس أوي!", messages:[
        "Strong session! The mistakes are just tomorrow's victories.",
        "Your husband would be proud. Actually, go show him your score.",
        "You're building something real here — one session at a time.",
        "More right than wrong. That's literally the definition of learning.",
        "بدري or late — you're getting better every single time.",
      ]},
      { min:50, emoji:"💪", arabic:"كويس!", messages:[
        "Halfway there — and that half is solid. Keep going.",
        "A tired new mum practising Egyptian Arabic? You're already winning at life.",
        "The flagged words are your roadmap. You know exactly what to work on.",
        "معلش — every expert was once a beginner. You're on your way.",
        "Your baby is napping, you're studying Arabic. Hero.",
      ]},
      { min:0, emoji:"🤍", arabic:"معلش!", messages:[
        "معلش — rough session, but you showed up. That's everything.",
        "The Review tab has your back. Those words won't escape you twice.",
        "Even جعان babies learn eventually. So will you. خلاص.",
        "Some days the words just don't land. Come back and they will.",
        "Showing up on a hard day is the whole game. You did that.",
      ]},
    ];

    const tier = tiers.find(t => pct >= t.min);
    const message = tier.messages[Math.floor(Math.random() * tier.messages.length)];
    const accuracy = total > 0 ? pct : 0;

    return (
      <div style={{padding:"28px 20px 40px", textAlign:"center"}}>
        {/* Big emoji + Arabic cheer */}
        <div style={{fontSize:64, marginBottom:8}}>{tier.emoji}</div>
        <div style={{fontSize:28, fontWeight:"bold", marginBottom:4, direction:"rtl"}}>{tier.arabic}</div>

        {/* Accuracy ring / bar */}
        <div style={{background:"#f8f8f8", borderRadius:16, padding:"16px 20px", margin:"16px 0", display:"inline-block", minWidth:200}}>
          <div style={{fontSize:42, fontWeight:"bold", color: pct>=70?"#28a745":pct>=50?"#E8936A":"#dc3545"}}>{accuracy}%</div>
          <div style={{fontSize:12, color:"#aaa", marginTop:2}}>accuracy</div>
          <div style={{background:"#e0e0e0", borderRadius:6, height:8, overflow:"hidden", marginTop:10, width:"100%"}}>
            <div style={{background: pct>=70?"#28a745":pct>=50?"#E8936A":"#dc3545", height:"100%", width:`${accuracy}%`, borderRadius:6, transition:"width 0.8s"}}/>
          </div>
        </div>

        {/* Stats row */}
        <div style={{display:"flex", justifyContent:"center", gap:20, marginBottom:16}}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:22, fontWeight:"bold", color:"#28a745"}}>✅ {c}</div>
            <div style={{fontSize:11, color:"#aaa"}}>correct</div>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:22, fontWeight:"bold", color:"#dc3545"}}>❌ {w}</div>
            <div style={{fontSize:11, color:"#aaa"}}>wrong</div>
          </div>
          {s>0&&<div style={{textAlign:"center"}}>
            <div style={{fontSize:22, fontWeight:"bold", color:"#aaa"}}>⏭ {s}</div>
            <div style={{fontSize:11, color:"#aaa"}}>skipped</div>
          </div>}
        </div>

        {/* Encouraging message */}
        <div style={{background:"#FFF8E7", borderRadius:14, padding:"14px 18px", marginBottom:20, fontSize:14, color:"#555", lineHeight:1.7, fontStyle:"italic"}}>
          "{message}"
        </div>

        {/* Wrong words to review */}
        {w>0&&(
          <div style={{background:"#fde8e8", borderRadius:14, padding:"12px 16px", marginBottom:16, textAlign:"left"}}>
            <p style={{fontSize:12, fontWeight:"bold", color:"#721c24", margin:"0 0 8px"}}>🚩 Added to Review ({w} word{w!==1?"s":""})</p>
            <div style={{display:"flex", flexWrap:"wrap", gap:6}}>
              {queue.filter((_,i)=>results[i]?.correct===false).map((item,i)=>{
                const v=ALL_VOCAB.find(x=>x.id===item.vocabId);
                return <span key={i} style={{background:"#fff", border:"1px solid #dc3545", borderRadius:20, padding:"3px 10px", fontSize:12, direction:"rtl", color:"#721c24"}}>{v.egy}</span>;
              })}
            </div>
          </div>
        )}

        {/* Full breakdown */}
        <div style={{background:"#fff", borderRadius:14, padding:16, boxShadow:"0 2px 8px rgba(0,0,0,0.07)", textAlign:"left"}}>
          <p style={{fontSize:12, fontWeight:"bold", color:"#aaa", margin:"0 0 10px", textTransform:"uppercase", letterSpacing:1}}>Full breakdown</p>
          {queue.map((item,i)=>{
            const v=ALL_VOCAB.find(x=>x.id===item.vocabId);
            const r=results[i];
            return (
              <div key={i} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"5px 0", borderBottom:"1px solid #f5f5f5", fontSize:13}}>
                <div style={{display:"flex", gap:6, alignItems:"center"}}>
                  <span style={{direction:"rtl", fontWeight:"bold"}}>{v.egy}</span>
                  <span style={{fontSize:10, color:"#bbb", background:"#f5f5f5", padding:"1px 4px", borderRadius:3}}>{item.type}</span>
                </div>
                <div style={{display:"flex", gap:8, alignItems:"center"}}>
                  <span style={{fontSize:11, color:"#999"}}>{v.meaning}</span>
                  <span>{r?.correct===true?"✅":r?.correct===false?"❌":"⏭"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Safety guard — doneRef.current is true synchronously the moment handleResult
  // marks the session complete, blocking any new TestExCard from mounting (and
  // firing tts()) before the done state re-render takes effect.
  if (doneRef.current || idx >= queue.length) return null;

  return (
    <div style={{padding:"0 0 20px"}}>
      <div style={{display:"flex",gap:4,padding:"14px 20px 10px",justifyContent:"center",flexWrap:"wrap"}}>
        {queue.map((_,i)=>(
          <div key={i} style={{width:9,height:9,borderRadius:"50%",flexShrink:0,
            background:i<idx?(results[i]?.correct===true?"#28a745":results[i]?.correct===false?"#dc3545":"#aaa")
                      :i===idx?"#7B6FA0":"#e0e0e0",
            transition:"background 0.3s"}}/>
        ))}
      </div>
      <div style={{padding:"0 16px"}}>
        <TestExCard key={`${idx}-${queue[idx].vocabId}-${queue[idx].type}`}
          item={queue[idx]} onResult={handleResult}/>
      </div>
    </div>
  );
}

// ─── VOCAB CARD (Learn tab) ───────────────────────────────────────────────────
function VocabCard({ v, color, showTrans, learnFlags }) {
  const [open,setOpen] = useState(false);
  const flagged = !!learnFlags[v.id];
  return (
    <div style={{background:"#fff",borderRadius:14,padding:"13px 15px",marginBottom:10,
      boxShadow:"0 2px 8px rgba(0,0,0,0.07)",
      border:`2px solid ${open?color:flagged?"#dc354540":"transparent"}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0}}>
          <SpeakBtn text={v.egy} color={color}/>
          <span style={{fontSize:21,fontWeight:"bold",direction:"rtl"}}>{v.egy}</span>
          {showTrans&&<span style={{fontSize:12,color:"#bbb",fontStyle:"italic",whiteSpace:"nowrap"}}>{v.trans}</span>}
          {flagged&&<span style={{fontSize:14,marginLeft:2}} title="Needs review">🚩</span>}
        </div>
        <button onClick={()=>setOpen(o=>!o)}
          style={{background:"none",border:"none",fontSize:16,color:"#bbb",cursor:"pointer",flexShrink:0}}>
          {open?"▲":"▼"}
        </button>
      </div>
      <div style={{fontSize:14,color:"#666",marginTop:3}}>{v.meaning}</div>
      {open&&(
        <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #f0f0f0"}}>
          <div style={{background:"#f5f0ff",borderRadius:8,padding:"6px 10px",marginBottom:8,fontSize:13}}>
            🗣 Egyptian: <strong style={{color:"#7B6FA0"}}>{v.egyPron}</strong>
            <span style={{color:"#aaa",marginLeft:6,fontStyle:"italic"}}>({v.trans})</span>
          </div>
          <div style={{background:color+"18",borderRadius:10,padding:"10px 12px",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:6}}>
              <SpeakBtn text={v.sentence} size={14} color={color}/>
              <div>
                <div style={{fontSize:17,fontWeight:"bold",direction:"rtl",lineHeight:1.5}}>{v.sentence}</div>
                {showTrans&&<div style={{fontSize:12,color:"#aaa",fontStyle:"italic",marginTop:1}}>{v.sentTrans}</div>}
                <div style={{fontSize:13,color:"#666",marginTop:2}}>{v.sentMeaning}</div>
              </div>
            </div>
          </div>
          {v.farsi&&<div style={{background:"#EDE8F5",borderRadius:8,padding:"7px 10px",fontSize:12,color:"#6B4E8A"}}>🇮🇷 {v.farsi}</div>}
        </div>
      )}
    </div>
  );
}

// ─── REVIEW FLASHCARDS (Test tab mistakes only) ───────────────────────────────
function ReviewCards({ testProgress, onUpdate, showTrans }) {
  const weakVocab = ALL_VOCAB.filter(v=>(testProgress[v.id]?.wrong||0)>0);
  const [deck] = useState(() => shuffle([...weakVocab]));
  const [idx,setIdx]     = useState(0);
  const [flipped,setFlipped] = useState(false);
  const [known,setKnown]   = useState(0);
  const [learning,setLearning] = useState(0);
  const [done,setDone]   = useState(false);

  if (!weakVocab.length) return (
    <div style={{padding:32,textAlign:"center"}}>
      <div style={{fontSize:48,marginBottom:12}}>🎉</div>
      <div style={{fontSize:18,fontWeight:"bold",marginBottom:8}}>No mistakes to review!</div>
      <div style={{fontSize:14,color:"#888",lineHeight:1.7}}>
        Complete some tests first. Words you get wrong in the Test tab will appear here for review.
      </div>
    </div>
  );

  if (done) return (
    <div style={{padding:32,textAlign:"center"}}>
      <div style={{fontSize:52,marginBottom:12}}>✨</div>
      <div style={{fontSize:22,fontWeight:"bold",marginBottom:8}}>Review done!</div>
      <div style={{fontSize:15,color:"#555",marginBottom:4}}>✅ Got it: <strong>{known}</strong></div>
      <div style={{fontSize:15,color:"#555",marginBottom:24}}>📚 Still learning: <strong>{learning}</strong></div>
      <button onClick={()=>{setIdx(0);setFlipped(false);setKnown(0);setLearning(0);setDone(false);}}
        style={{background:"#E8936A",color:"#fff",border:"none",borderRadius:12,padding:"13px 28px",fontSize:15,fontWeight:"bold",cursor:"pointer"}}>
        Go again 🔀
      </button>
    </div>
  );

  const card = deck[idx];
  const p = testProgress[card.id]||{};

  function mark(isKnown) {
    const old = testProgress[card.id]||{correct:0,wrong:0,seen:true};
    const np = {...old};
    if (isKnown) {
      np.correct=(np.correct||0)+1;
      np.wrong=Math.max(0,(np.wrong||0)-1); // reduce wrong → clears from review when 0
      setKnown(k=>k+1);
    } else {
      np.wrong=(np.wrong||0)+1;
      setLearning(l=>l+1);
    }
    onUpdate(card.id, np);
    if (idx+1>=deck.length) setDone(true);
    else { setIdx(i=>i+1); setFlipped(false); }
  }

  return (
    <div style={{padding:"16px 16px 20px"}}>
      <div style={{background:"#fde8e8",borderRadius:10,padding:"8px 14px",marginBottom:14,fontSize:12,color:"#721c24",lineHeight:1.6}}>
        🚩 These are words you got wrong in the <strong>Test</strong> tab. Getting them right here reduces their mistake count. When wrong = 0, they leave this list.
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
        <span style={{fontSize:13,color:"#aaa"}}>{idx+1} / {deck.length}</span>
        <span style={{fontSize:13}}>✅ {known} · 📚 {learning}</span>
      </div>
      <div style={{background:"#fff",borderRadius:20,padding:28,minHeight:200,
        display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",
        boxShadow:"0 6px 24px rgba(0,0,0,0.10)",border:`3px solid ${card.sessionColor}`,
        cursor:"pointer",textAlign:"center",marginBottom:16}}
        onClick={()=>{if(!flipped)tts(card.egy);setFlipped(f=>!f);}}>
        <div style={{fontSize:11,color:"#ccc",textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>
          {card.sessionEmoji} {card.sessionTitle} · tap to flip
        </div>
        {!flipped?(
          <>
            <div style={{fontSize:36,fontWeight:"bold",direction:"rtl",marginBottom:6}}>{card.egy}</div>
            <div style={{fontSize:13,color:"#7B6FA0",fontWeight:"bold",marginBottom:2}}>{card.egyPron}</div>
            {showTrans&&<div style={{fontSize:13,color:"#bbb",fontStyle:"italic"}}>{card.trans}</div>}
            <div style={{marginTop:8,fontSize:11,color:"#dc3545"}}>❌ {p.wrong||0} mistake{(p.wrong||0)!==1?"s":""}</div>
          </>
        ):(
          <>
            <div style={{fontSize:20,fontWeight:"bold",color:card.sessionColor,marginBottom:8}}>{card.meaning}</div>
            <div style={{fontSize:15,direction:"rtl",color:"#555",marginBottom:4}}>{card.sentence}</div>
            <div style={{fontSize:12,color:"#aaa",fontStyle:"italic"}}>{card.sentMeaning}</div>
          </>
        )}
      </div>
      {!flipped&&<p style={{textAlign:"center",color:"#ccc",fontSize:13}}>Tap to reveal</p>}
      {flipped&&(
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>mark(false)}
            style={{flex:1,padding:13,background:"#fde8e8",border:"2px solid #dc3545",borderRadius:12,fontSize:14,cursor:"pointer",fontWeight:"bold",color:"#721c24"}}>
            📚 Still learning
          </button>
          <button onClick={()=>mark(true)}
            style={{flex:1,padding:13,background:"#d4edda",border:"2px solid #28a745",borderRadius:12,fontSize:14,cursor:"pointer",fontWeight:"bold",color:"#155724"}}>
            ✅ Got it!
          </button>
        </div>
      )}
    </div>
  );
}

// ─── PROGRESS TAB ─────────────────────────────────────────────────────────────
function ProgressTab({ stats, learnFlags, testProgress }) {
  const totalWords    = ALL_VOCAB.length;
  const learnFlagged  = ALL_VOCAB.filter(v=>learnFlags[v.id]).length;
  const testSeen      = ALL_VOCAB.filter(v=>testProgress[v.id]?.seen).length;
  const testWeak      = ALL_VOCAB.filter(v=>(testProgress[v.id]?.wrong||0)>0).length;
  const testMastered  = ALL_VOCAB.filter(v=>(testProgress[v.id]?.correct||0)>=3&&!(testProgress[v.id]?.wrong||0)).length;
  const totalCorrect  = stats.totalCorrect||0;
  const totalWrong    = stats.totalWrong||0;
  const accuracy      = totalCorrect+totalWrong>0?Math.round(totalCorrect/(totalCorrect+totalWrong)*100):0;

  return (
    <div style={{padding:"16px 16px 100px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        {[
          {label:"Day Streak",   value:`🔥 ${stats.dayStreak||0}`,   sub:"days in a row"},
          {label:"Test Accuracy",value:`${accuracy}%`,               sub:`${totalCorrect}✓ ${totalWrong}✗`},
          {label:"Test Seen",    value:`${testSeen}/${totalWords}`,   sub:"unique words seen"},
          {label:"Tests Done",   value:stats.testHistory?.length||0,  sub:"completed tests"},
        ].map(({label,value,sub})=>(
          <div key={label} style={{background:"#fff",borderRadius:14,padding:"14px 12px",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",textAlign:"center"}}>
            <div style={{fontSize:22,fontWeight:"bold"}}>{value}</div>
            <div style={{fontSize:11,color:"#aaa",textTransform:"uppercase",letterSpacing:0.5,marginTop:2}}>{label}</div>
            <div style={{fontSize:11,color:"#ccc"}}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Learn flags */}
      <div style={{background:"#fff",borderRadius:14,padding:"14px 16px",marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
        <p style={{fontSize:13,fontWeight:"bold",margin:"0 0 6px"}}>📖 Learn Tab</p>
        <p style={{fontSize:13,color:"#555",margin:"0 0 10px"}}>
          🚩 {learnFlagged} word{learnFlagged!==1?"s":""} flagged for review in Learn
        </p>
        {learnFlagged>0&&(
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {ALL_VOCAB.filter(v=>learnFlags[v.id]).map(v=>(
              <span key={v.id} style={{background:"#fde8e8",color:"#721c24",borderRadius:20,padding:"3px 10px",fontSize:12,direction:"rtl"}}>
                🚩 {v.egy}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Test progress */}
      <div style={{background:"#fff",borderRadius:14,padding:"14px 16px",marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
        <p style={{fontSize:13,fontWeight:"bold",margin:"0 0 8px"}}>🧪 Test Tab</p>
        <div style={{background:"#f0f0f0",borderRadius:6,height:10,overflow:"hidden",marginBottom:6}}>
          <div style={{background:"#7B6FA0",height:"100%",width:`${(testSeen/totalWords)*100}%`,borderRadius:6}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#aaa",marginBottom:10}}>
          <span>{testSeen}/{totalWords} unique words seen in tests</span>
          <span>⭐ {testMastered} mastered · ⚠️ {testWeak} in review</span>
        </div>
        {testWeak>0&&(
          <>
            <p style={{fontSize:12,fontWeight:"bold",color:"#dc3545",margin:"0 0 8px"}}>In Review tab ({testWeak})</p>
            {ALL_VOCAB.filter(v=>(testProgress[v.id]?.wrong||0)>0).map(v=>(
              <div key={v.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:"1px solid #f5f5f5",fontSize:13}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <SpeakBtn text={v.egy} size={13} color="#dc3545"/>
                  <span style={{direction:"rtl",fontWeight:"bold"}}>{v.egy}</span>
                  <span style={{fontSize:12,color:"#aaa"}}>{v.meaning}</span>
                </div>
                <span style={{fontSize:11,color:"#dc3545",whiteSpace:"nowrap"}}>❌ {testProgress[v.id].wrong}×</span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Test history */}
      {(stats.testHistory||[]).length>0&&(
        <div style={{background:"#fff",borderRadius:14,padding:"14px 16px",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
          <p style={{fontSize:13,fontWeight:"bold",margin:"0 0 4px"}}>📅 Recent Tests</p>
          <p style={{fontSize:11,color:"#aaa",margin:"0 0 10px"}}>Each row = one completed test session</p>
          {[...(stats.testHistory||[])].reverse().slice(0,10).map((s,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f5f5f5",fontSize:13}}>
              <div>
                <div style={{color:"#555"}}>{s.date}</div>
                {s.time&&<div style={{fontSize:11,color:"#bbb"}}>{s.time}</div>}
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span style={{fontSize:11,color:"#bbb"}}>{(s.correct||0)+(s.wrong||0)+(s.skipped||0)} questions</span>
                <span style={{color:s.wrong>s.correct?"#dc3545":"#28a745"}}>✅{s.correct} ❌{s.wrong} ⏭{s.skipped}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
const NAV = [
  {id:"learn",    icon:"📖", label:"Learn"},
  {id:"test",     icon:"🧪", label:"Test"},
  {id:"review",   icon:"🃏", label:"Review"},
  {id:"progress", icon:"📊", label:"Progress"},
];

export default function App() {
  const [tab, setTab]             = useState("learn");
  const [showTrans, setShowTrans] = useState(true);
  const [loading, setLoading]     = useState(true);

  // learnFlags: { [vocabId]: true } — mistakes in Learn tab, managed separately
  const [learnFlags, setLearnFlags] = useState({});
  // testProgress: { [vocabId]: {correct, wrong, seen} } — Test tab performance, feeds Review
  const [testProgress, setTestProgress] = useState({});
  // stats: streak, accuracy, history
  const [stats, setStats] = useState({totalCorrect:0,totalWrong:0,dayStreak:0,lastPracticeDate:null,testHistory:[]});

  // Learn tab state
  const [activeLearnSession, setActiveLearnSession] = useState(null);
  const [learnMode, setLearnMode] = useState("browse"); // "browse" | "quiz" | "done"
  const [learnDoneData, setLearnDoneData] = useState(null);

  // Test tab state
  const [testRunning, setTestRunning] = useState(false);

  useEffect(() => {
    const lf = storageGet("learnFlags_v1");
    const tp = storageGet("testProgress_v1");
    const st = storageGet("stats_v5");
    if (lf) setLearnFlags(lf);
    if (tp) setTestProgress(tp);
    if (st) setStats(st);
    setLoading(false);
  }, []);

  function saveLearnFlags(flags) {
    setLearnFlags(flags);
    storageSet("learnFlags_v1", flags);
  }

  function saveTestProgress(tp) {
    setTestProgress(tp);
    storageSet("testProgress_v1", tp);
  }

  function saveStats(st) {
    setStats(st);
    storageSet("stats_v5", st);
  }

  // Called when a Learn quiz session ends
  function onLearnComplete(results) {
    // results: [{id, correct}]
    const newFlags = {...learnFlags};
    for (const r of results) {
      if (r.correct === null) continue; // skipped
      if (r.correct === true) {
        // Correct → remove flag
        delete newFlags[r.id];
      } else {
        // Wrong → set flag
        newFlags[r.id] = true;
      }
    }
    saveLearnFlags(newFlags);
  }

  // Called when a Test session ends
  function onTestComplete(queue, results) {
    const newTP = {...testProgress};
    const resArr = results; // [{vocabId, correct}]
    for (const r of resArr) {
      if (r.correct===null) continue;
      const old = newTP[r.vocabId]||{correct:0,wrong:0,seen:false};
      if (r.correct===true) {
        newTP[r.vocabId] = {correct:(old.correct||0)+1, wrong:Math.max(0,(old.wrong||0)-1), seen:true};
      } else {
        newTP[r.vocabId] = {correct:old.correct||0, wrong:(old.wrong||0)+1, seen:true};
      }
    }
    saveTestProgress(newTP);

    // Update stats
    const correct = resArr.filter(r=>r.correct===true).length;
    const wrong   = resArr.filter(r=>r.correct===false).length;
    const skipped = resArr.filter(r=>r.correct===null).length;
    const now     = new Date();
    const today   = now.toLocaleDateString();
    const time    = now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
    const last    = stats.lastPracticeDate;
    const yesterday = new Date(Date.now()-86400000).toLocaleDateString();
    const newStreak = last===today?stats.dayStreak:last===yesterday?(stats.dayStreak||0)+1:1;
    const newStats = {
      totalCorrect:(stats.totalCorrect||0)+correct,
      totalWrong:(stats.totalWrong||0)+wrong,
      dayStreak:newStreak,
      lastPracticeDate:today,
      testHistory:[...(stats.testHistory||[]),{date:today,time,correct,wrong,skipped}].slice(-30),
    };
    saveStats(newStats);
    setTestRunning(false);
  }

  // Update testProgress from Review tab
  function onReviewUpdate(vocabId, newP) {
    const updated = {...testProgress,[vocabId]:newP};
    saveTestProgress(updated);
  }

  if (loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",
      fontFamily:"Georgia,serif",flexDirection:"column",gap:12,color:"#aaa"}}>
      <div style={{fontSize:36}}>مصري</div>
      <div style={{fontSize:14}}>Loading your progress...</div>
    </div>
  );

  const learnFlagCount = Object.keys(learnFlags).length;
  const reviewCount    = ALL_VOCAB.filter(v=>(testProgress[v.id]?.wrong||0)>0).length;

  return (
    <div style={A.wrap}>
      {/* Top bar */}
      <div style={A.topBar}>
        <div>
          <div style={{display:"flex",alignItems:"baseline",gap:10}}>
            <span style={A.logoAr}>مصري</span>
            <span style={A.logoEn}>Egyptian Arabic</span>
          </div>
          <div style={A.tagline}>speak · listen · grow 👶</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div style={A.pill}>🔥{stats.dayStreak||0}</div>
          <button style={A.transBtn} onClick={()=>setShowTrans(t=>!t)}
            title="Show/hide romanization (pronunciation guide)">
            {showTrans?"🔤 Hide":"🔤 Show"}
          </button>
        </div>
      </div>

      {/* ── LEARN TAB ── */}
      {tab==="learn" && (
        <div style={{paddingBottom:100}}>
          {/* Session list */}
          {!activeLearnSession && (
            <div style={{padding:"12px 16px"}}>
              <p style={{fontSize:13,color:"#555",lineHeight:1.7,marginBottom:14,background:"#FFF8E7",borderRadius:10,padding:"10px 14px"}}>
                <strong>How to use Learn:</strong> Read each word, tap ▼ to expand the example sentence, then tap <em>Practice these words</em> to quiz yourself. Words you get wrong get a 🚩 — they'll be prioritized next time you practice this session.
              </p>
              <p style={A.secLabel}>Sessions</p>
              {SESSIONS.map(s=>{
                const flagged=s.vocab.filter(v=>learnFlags[v.id]).length;
                return (
                  <div key={s.id} onClick={()=>{setActiveLearnSession(s);setLearnMode("browse");setLearnDoneData(null);}}
                    style={{...A.row,borderLeft:`5px solid ${s.color}`}}>
                    <span style={{fontSize:26}}>{s.emoji}</span>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{fontWeight:"bold",fontSize:15}}>{s.title}</span>
                        {flagged>0&&<span style={{fontSize:12,color:"#dc3545"}}>🚩 {flagged} flagged</span>}
                      </div>
                      <div style={{fontSize:12,color:"#aaa",marginTop:2}}>{s.vocab.length} words</div>
                    </div>
                    <span style={{color:"#ccc",fontSize:20}}>›</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Session browse */}
          {activeLearnSession && learnMode==="browse" && (
            <>
              <div style={{...A.sHeader,background:activeLearnSession.color}}>
                <button style={A.backBtn} onClick={()=>setActiveLearnSession(null)}>← Sessions</button>
                <span style={{flex:1,textAlign:"center",fontSize:14,color:"rgba(255,255,255,0.9)"}}>
                  {activeLearnSession.emoji} {activeLearnSession.title}
                </span>
                <div style={{width:70}}/>
              </div>
              <div style={{padding:"12px 16px"}}>
                <div style={{background:"#FFF8E7",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:13,color:"#666",lineHeight:1.7}}>
                  {activeLearnSession.tip}
                </div>
                {activeLearnSession.vocab.map((v,i)=>(
                  <VocabCard key={i} v={v} color={activeLearnSession.color} showTrans={showTrans} learnFlags={learnFlags}/>
                ))}
                <button onClick={()=>setLearnMode("quiz")}
                  style={{...A.bigBtn,background:activeLearnSession.color,marginTop:8}}>
                  Practice these words →
                </button>
              </div>
            </>
          )}

          {/* Session quiz */}
          {activeLearnSession && learnMode==="quiz" && (
            <>
              <div style={{...A.sHeader,background:activeLearnSession.color}}>
                <button style={A.backBtn} onClick={()=>setLearnMode("browse")}>← Words</button>
                <span style={{flex:1,textAlign:"center",fontSize:14,color:"rgba(255,255,255,0.9)"}}>
                  Practicing: {activeLearnSession.emoji} {activeLearnSession.title}
                </span>
                <div style={{width:60}}/>
              </div>
              <LearnQuiz
                key={activeLearnSession.id+"-"+Date.now()}
                sessionVocab={activeLearnSession.vocab}
                sessionColor={activeLearnSession.color}
                learnFlags={learnFlags}
                onComplete={(results)=>{
                  onLearnComplete(results);
                  setLearnDoneData(results);
                  setLearnMode("done");
                }}
              />
            </>
          )}

          {/* Learn done screen */}
          {activeLearnSession && learnMode==="done" && learnDoneData && (() => {
            const results = learnDoneData;
            const c = results.filter(r=>r.correct===true).length;
            const w = results.filter(r=>r.correct===false).length;
            const s = results.filter(r=>r.correct===null).length;
            const total = results.length;
            const pct = total>0 ? Math.round(c/total*100) : 0;

            const tiers = [
              { min:90, emoji:"🌟", arabic:"ممتاز!", messages:[
                "All those words? Yours now. Your baby is going to hear perfect Egyptian from day one.",
                "يلا — you're basically ready to call your mother-in-law and chat.",
                "That's a session your future self will thank you for.",
                "100% energy, 100% dedication. ربنا يخليك.",
              ]},
              { min:70, emoji:"✨", arabic:"كويس أوي!", messages:[
                "The flagged words are already waiting for you. That's how it works — you'll get them next time.",
                "More right than wrong. That's the whole game, and you're winning it.",
                "Your husband says random Egyptian things all day. You now understand most of them. 🎯",
                "بدري or late — you're getting better every single time you open this.",
              ]},
              { min:50, emoji:"💪", arabic:"كويس!", messages:[
                "Half right on day one is better than zero right on no day. Keep going.",
                "The 🚩 flags are your friends — they're just words waiting to click.",
                "A new mum learning Egyptian Arabic between feeds? Honestly impressive.",
                "معلش — the words that got away will come back around. They always do.",
              ]},
              { min:0, emoji:"🤍", arabic:"معلش!", messages:[
                "The hardest part is opening the app. You did that. خلاص.",
                "Some sessions are just warm-ups. This was your warm-up.",
                "Every flag is a word that's about to become yours. Come back soon.",
                "معلش — your baby doesn't judge, and neither do we. Try again when you're ready.",
              ]},
            ];
            const tier = tiers.find(t => pct >= t.min);
            const message = tier.messages[Math.floor(Math.random()*tier.messages.length)];

            return (
              <div style={{paddingBottom:100}}>
                <div style={{...A.sHeader, background:activeLearnSession.color}}>
                  <div style={{width:60}}/>
                  <span style={{flex:1, textAlign:"center", fontSize:14, color:"rgba(255,255,255,0.9)"}}>
                    {activeLearnSession.emoji} {activeLearnSession.title}
                  </span>
                  <div style={{width:60}}/>
                </div>
                <div style={{padding:"28px 20px 20px", textAlign:"center"}}>
                  <div style={{fontSize:60, marginBottom:8}}>{tier.emoji}</div>
                  <div style={{fontSize:26, fontWeight:"bold", marginBottom:4, direction:"rtl"}}>{tier.arabic}</div>
                  <div style={{background:"#f8f8f8", borderRadius:16, padding:"14px 20px", margin:"14px auto", display:"inline-block", minWidth:180}}>
                    <div style={{fontSize:38, fontWeight:"bold", color:pct>=70?"#28a745":pct>=50?"#E8936A":"#dc3545"}}>{pct}%</div>
                    <div style={{fontSize:11, color:"#aaa", marginTop:2}}>accuracy</div>
                    <div style={{background:"#e0e0e0", borderRadius:6, height:7, overflow:"hidden", marginTop:8}}>
                      <div style={{background:pct>=70?"#28a745":pct>=50?"#E8936A":"#dc3545", height:"100%", width:`${pct}%`, borderRadius:6}}/>
                    </div>
                  </div>
                  <div style={{display:"flex", justifyContent:"center", gap:20, marginBottom:16}}>
                    <div><div style={{fontSize:20, fontWeight:"bold", color:"#28a745"}}>✅ {c}</div><div style={{fontSize:11,color:"#aaa"}}>correct</div></div>
                    <div><div style={{fontSize:20, fontWeight:"bold", color:"#dc3545"}}>❌ {w}</div><div style={{fontSize:11,color:"#aaa"}}>flagged</div></div>
                    {s>0&&<div><div style={{fontSize:20, fontWeight:"bold", color:"#aaa"}}>⏭ {s}</div><div style={{fontSize:11,color:"#aaa"}}>skipped</div></div>}
                  </div>
                  <div style={{background:"#FFF8E7", borderRadius:14, padding:"14px 18px", marginBottom:20, fontSize:14, color:"#555", lineHeight:1.7, fontStyle:"italic"}}>
                    "{message}"
                  </div>
                  <button onClick={()=>{ setLearnMode("browse"); setLearnDoneData(null); }}
                    style={{...A.bigBtn, background:activeLearnSession.color}}>
                    See my words & flags →
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ── TEST TAB ── */}
      {tab==="test" && (
        <div style={{paddingBottom:100}}>
          {!testRunning ? (
            <div style={{padding:"16px 16px"}}>
              <div style={{background:"#f5f0ff",borderRadius:14,padding:"18px 20px",marginBottom:14}}>
                <div style={{fontSize:22,marginBottom:8}}>🧪</div>
                <div style={{fontSize:16,fontWeight:"bold",marginBottom:6}}>Mixed Test</div>
                <div style={{fontSize:13,color:"#555",lineHeight:1.7,marginBottom:14}}>
                  All {ALL_VOCAB.length} words, mixed up. Three question types:
                  <br/>• Arabic word → pick English meaning
                  <br/>• Arabic sentence → pick sentence translation
                  <br/>• English word → pick Arabic
                  <br/><br/>
                  Words you get wrong go to the <strong>Review</strong> tab for flashcard drilling.
                  Words you keep getting right get promoted.
                </div>
                <button onClick={()=>setTestRunning(true)} style={{...A.bigBtn,background:"#7B6FA0"}}>
                  Start Test →
                </button>
              </div>
              {reviewCount>0&&(
                <div style={{background:"#fde8e8",borderRadius:12,padding:"12px 14px",fontSize:13,color:"#721c24"}}>
                  ⚠️ You have <strong>{reviewCount}</strong> word{reviewCount!==1?"s":""} from previous tests in your Review tab.
                </div>
              )}
            </div>
          ) : (
            <>
              <div style={{...A.sHeader,background:"#7B6FA0"}}>
                <button style={A.backBtn} onClick={()=>setTestRunning(false)}>← Back</button>
                <span style={{flex:1,textAlign:"center",fontSize:14,color:"rgba(255,255,255,0.9)"}}>🧪 Mixed Test</span>
                <div style={{width:60}}/>
              </div>
              <TestSession
                key={"test-"+Date.now()}
                testProgress={testProgress}
                onComplete={onTestComplete}
              />
            </>
          )}
        </div>
      )}

      {/* ── REVIEW TAB ── */}
      {tab==="review" && (
        <div style={{paddingBottom:100}}>
          <div style={A.sHeader}>
            <span style={{flex:1,textAlign:"center",fontSize:15,fontWeight:"bold",color:"#fff"}}>🃏 Review</span>
          </div>
          <ReviewCards
            key="review"
            testProgress={testProgress}
            onUpdate={onReviewUpdate}
            showTrans={showTrans}
          />
        </div>
      )}

      {/* ── PROGRESS TAB ── */}
      {tab==="progress" && (
        <div style={{paddingBottom:100}}>
          <div style={A.sHeader}>
            <span style={{flex:1,textAlign:"center",fontSize:15,fontWeight:"bold",color:"#fff"}}>📊 Progress</span>
          </div>
          <ProgressTab stats={stats} learnFlags={learnFlags} testProgress={testProgress}/>
        </div>
      )}

      {/* Bottom nav */}
      <div style={A.nav}>
        {NAV.map(t=>{
          const badge = t.id==="learn"?learnFlagCount:t.id==="review"?reviewCount:0;
          return (
            <button key={t.id} onClick={()=>{setTab(t.id);setTestRunning(false);setActiveLearnSession(null);setLearnMode("browse");setLearnDoneData(null);}}
              style={{...A.navBtn,color:tab===t.id?"#E8936A":"#aaa",position:"relative"}}>
              <span style={{fontSize:22}}>{t.icon}</span>
              {badge>0&&(
                <span style={{position:"absolute",top:0,right:"50%",transform:"translateX(10px)",
                  background:"#dc3545",color:"#fff",borderRadius:10,fontSize:9,padding:"1px 5px",fontWeight:"bold"}}>
                  {badge}
                </span>
              )}
              <span style={{fontSize:10,marginTop:2}}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const A = {
  wrap:{fontFamily:"'Georgia','Times New Roman',serif",maxWidth:430,margin:"0 auto",minHeight:"100vh",background:"#FAFAF8",color:"#2c2c2c"},
  topBar:{background:"#1a1a1a",padding:"16px 16px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"},
  logoAr:{fontSize:24,fontWeight:"bold",color:"#E8936A"},
  logoEn:{fontSize:13,color:"#777",letterSpacing:0.5},
  tagline:{fontSize:11,color:"#555",marginTop:2},
  pill:{background:"#2d2d2d",borderRadius:20,padding:"5px 12px",fontSize:14,color:"#E8936A",fontWeight:"bold"},
  transBtn:{background:"#2d2d2d",border:"none",color:"#aaa",padding:"5px 8px",borderRadius:8,fontSize:11,cursor:"pointer",fontFamily:"inherit"},
  secLabel:{fontSize:11,fontWeight:"bold",color:"#bbb",textTransform:"uppercase",letterSpacing:1,margin:"0 0 12px"},
  row:{background:"#fff",borderRadius:12,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,marginBottom:10,boxShadow:"0 2px 8px rgba(0,0,0,0.05)",cursor:"pointer"},
  nav:{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"#fff",borderTop:"1px solid #eee",display:"flex",padding:"8px 0 14px"},
  navBtn:{flex:1,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:1,lineHeight:1.3},
  sHeader:{background:"#2c2c2c",padding:"14px 16px",color:"#fff",display:"flex",alignItems:"center",gap:8},
  backBtn:{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",padding:"6px 12px",borderRadius:8,fontSize:12,cursor:"pointer"},
  bigBtn:{width:"100%",padding:14,border:"none",borderRadius:12,color:"#fff",fontSize:15,fontWeight:"bold",cursor:"pointer",fontFamily:"inherit"},
};

const X = {
  card:{background:"#fff",borderRadius:16,padding:"18px 16px",boxShadow:"0 3px 12px rgba(0,0,0,0.09)"},
  chip:{fontSize:11,fontWeight:"bold",color:"#aaa",textTransform:"uppercase",letterSpacing:1,marginBottom:14},
  stimulus:{background:"#F7F5FF",borderRadius:14,padding:"20px 16px",textAlign:"center",marginBottom:18,border:"2px solid #E8E4F8"},
  opts:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10},
  optsCol:{display:"flex",flexDirection:"column",gap:10},
  opt:{border:"2px solid",borderRadius:12,padding:"13px 8px",fontSize:14,cursor:"pointer",fontFamily:"inherit",fontWeight:"500",transition:"all 0.15s",lineHeight:1.3,background:"#fff"},
  reveal:{background:"#FFF8E7",border:"2px solid #ffc107",borderRadius:12,padding:"16px",marginTop:8},
  btn:{border:"none",borderRadius:10,padding:"12px 20px",color:"#fff",fontSize:14,fontWeight:"bold",cursor:"pointer",fontFamily:"inherit"},
  ghostBtn:{background:"none",border:"1.5px solid #ddd",borderRadius:10,padding:"10px 12px",fontSize:13,cursor:"pointer",color:"#888",fontFamily:"inherit"},
};
