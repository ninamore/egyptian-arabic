import { useState, useEffect, useRef } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────
// ─── ENCOURAGING MESSAGES ────────────────────────────────────────────────────
const MESSAGES = {
  streak: [
    "🔥 {n} days in a row! يلا، keep going!",
    "🔥 {n}-day streak! Your baby will hear perfect Egyptian soon.",
    "🔥 {n} days straight! ممتاز — consistency is everything.",
    "🔥 Day {n}! Don't stop now, you're building something real.",
    "🔥 {n} days! Your husband doesn't know it yet but you're catching up fast.",
  ],
  newSession: [
    "يلا! Let's see what you remember 💪",
    "تعالى نتعلم — let's learn something new today!",
    "Your baby is counting on you. يلا! 👶",
    "A few minutes now = a lifetime of connection. يلا بينا!",
    "بحاول أتعلم — and you're actually doing it! Let's go.",
  ],
  correctStreak: [
    "On a roll! استمري 🌟",
    "ممتاز! Keep that energy!",
    "Your brain is making connections — this is how languages stick.",
    "جامد أوي! You're getting it.",
    "That's the stuff! يلا for the next one.",
  ],
  midSession: [
    "Halfway there! يلا بينا 💪",
    "You're doing great — don't stop now!",
    "هيا! Almost there.",
    "Your streak is watching. Keep going! 🔥",
    "كده تمام — just a few more!",
  ],
};

function randomMsg(key, vars={}) {
  const arr = MESSAGES[key];
  let msg = arr[Math.floor(Math.random()*arr.length)];
  Object.entries(vars).forEach(([k,v]) => { msg = msg.replace(`{${k}}`, v); });
  return msg;
}

// Returns today's date as YYYY-MM-DD in LOCAL timezone (not UTC)
// Using toISOString() gives UTC which can be wrong date for users in EST/PST evenings
function localDateStr(date = new Date()) {
  return date.getFullYear() + '-' +
    String(date.getMonth()+1).padStart(2,'0') + '-' +
    String(date.getDate()).padStart(2,'0');
}

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
  // ── SESSION 6: FRIENDS & SOCIAL ──────────────────────────────────────────
  {
    id:6, title:"Friends & Social", arabicTitle:"مع الأصحاب", emoji:"👫", color:"#E86A8A",
    tip:"🔑 Egyptians love when foreigners try! بحاول أتعلم (I'm trying to learn) + a smile = instant friends.",
    vocab:[
      {id:"v6_1",egy:"أهلاً وسهلاً",trans:"ahlan wa sahlan",egyPron:"أهلاً وسَهلاً",meaning:"Welcome / hello (warm)",sentence:"أهلاً وسهلاً يا نينا!",sentTrans:"ahlan wa sahlan ya Nina!",sentMeaning:"Welcome, Nina!",farsi:"خوش اومدی — همین"},
      {id:"v6_2",egy:"عامل إيه",trans:"aamel eih",egyPron:"عامِل إيه",meaning:"How are you doing? (to man)",sentence:"إزيك؟ عامل إيه؟",sentTrans:"izzayyak? aamel eih?",sentMeaning:"How are you? How are you doing?",farsi:"چطوری؟"},
      {id:"v6_3",egy:"تمام الحمد لله",trans:"tamaam el-hamdu lillah",egyPron:"تَمام الحَمدُ لِلّه",meaning:"Fine, thank God",sentence:"عامل إيه؟ تمام الحمد لله",sentTrans:"aamel eih? tamaam el-hamdu lillah",sentMeaning:"How are you? Fine, thank God",farsi:"خوبم الحمدلله"},
      {id:"v6_4",egy:"بحاول أتعلم",trans:"bahaawel ateaallem",egyPron:"بحاوِل أتعَلَّم",meaning:"I'm trying to learn",sentence:"أنا بحاول أتعلم عربي",sentTrans:"ana bahaawel ateaallem arabi",sentMeaning:"I'm trying to learn Arabic",farsi:"دارم یاد میگیرم"},
      {id:"v6_5",egy:"لسه بتعلم",trans:"lessa biteaallem",egyPron:"لِسّه بِتعَلَّم",meaning:"Still learning",sentence:"أنا لسه بتعلم، معلش!",sentTrans:"ana lessa biteaallem, maalesh!",sentMeaning:"I'm still learning, sorry!",farsi:"هنوز دارم یاد میگیرم"},
      {id:"v6_6",egy:"مش فاهمة",trans:"mesh fahma",egyPron:"مِش فاهمة",meaning:"I don't understand (woman)",sentence:"مش فاهمة، ممكن تعيد؟",sentTrans:"mesh fahma, mumkin teeid?",sentMeaning:"I don't understand, can you repeat?",farsi:"نمیفهمم"},
      {id:"v6_7",egy:"بالراحة",trans:"bil-raaha",egyPron:"بالراحة",meaning:"Slowly / gently / take it easy",sentence:"ممكن تتكلم بالراحة؟",sentTrans:"mumkin titkallim bil-raaha?",sentMeaning:"Can you speak slowly?",farsi:"آروم‌تر — یواش‌تر"},
      {id:"v6_8",egy:"جامد",trans:"gaamid",egyPron:"جامِد",meaning:"Cool / awesome / great",sentence:"ده جامد أوي!",sentTrans:"da gaamid awi!",sentMeaning:"That's so cool!",farsi:"باحاله — مثل خفن"},
    ],
  },
  // ── SESSION 7: DAILY CHIT-CHAT ────────────────────────────────────────────
  {
    id:7, title:"Daily Chit-chat", arabicTitle:"كلام يومي", emoji:"💭", color:"#6B9E78",
    tip:"🔑 These filler words are what make you sound Egyptian. خلاص، يعني، بقى and طب are the secret sauce.",
    vocab:[
      {id:"v7_1",egy:"يعني",trans:"yaani",egyPron:"يَعني",meaning:"I mean / like / sort of",sentence:"يعني، مش عارفة",sentTrans:"yaani, mesh aarfa",sentMeaning:"I mean, I don't know",farsi:"یعنی — نفس کلمه!"},
      {id:"v7_2",egy:"بقى",trans:"baqa",egyPron:"بَقى",meaning:"Then / so / already (filler)",sentence:"يلا بقى، قوم",sentTrans:"yalla baqa, oom",sentMeaning:"Come on then, get up",farsi:"دیگه — پس"},
      {id:"v7_3",egy:"زي ما هو",trans:"zay ma huwwa",egyPron:"زَي ما هو",meaning:"As it is / like that",sentence:"سيبه زي ما هو",sentTrans:"seebuh zay ma huwwa",sentMeaning:"Leave it as it is",farsi:"همونطوری که هست"},
      {id:"v7_4",egy:"مش كده",trans:"mesh keda",egyPron:"مِش كَده",meaning:"Isn't that right? / No?",sentence:"ده حلو، مش كده؟",sentTrans:"da helw, mesh keda?",sentMeaning:"That's nice, isn't it?",farsi:"نه؟ — مگه نه؟"},
      {id:"v7_5",egy:"طبعاً",trans:"tabaan",egyPron:"طَبعاً",meaning:"Of course",sentence:"طبعاً أنا موافقة",sentTrans:"tabaan ana muwafqa",sentMeaning:"Of course I agree",farsi:"طبیعتاً — البته"},
      {id:"v7_6",egy:"ممتاز",trans:"mumtaaz",egyPron:"مُمتاز",meaning:"Excellent / perfect",sentence:"ممتاز، كده تمام",sentTrans:"mumtaaz, keda tamaam",sentMeaning:"Excellent, that's perfect",farsi:"ممتاز — نفس کلمه!"},
      {id:"v7_7",egy:"يسلم",trans:"yislem",egyPron:"يِسلَم",meaning:"Bless you / thanks (casual)",sentence:"يسلم إيديك على الأكل",sentTrans:"yislem eideik ala el-akl",sentMeaning:"Bless your hands for the food",farsi:""},
      {id:"v7_8",egy:"سيبني",trans:"seebni",egyPron:"سيبني",meaning:"Leave me alone / let me be",sentence:"سيبني أنا تعبانة",sentTrans:"seebni ana taabana",sentMeaning:"Leave me alone, I'm tired",farsi:"ولم کن"},
    ],
  },
  // ── SESSION 8: FOOD & EATING ──────────────────────────────────────────────
  {
    id:8, title:"Food & Eating", arabicTitle:"الأكل والشرب", emoji:"🍽️", color:"#C4873A",
    tip:"🔑 الأكل زاكي (the food is delicious) + يسلم إيديك (bless your hands) = Egyptian husband's love language.",
    vocab:[
      {id:"v8_1",egy:"عايزة تاكل",trans:"aayza taakul",egyPron:"عايزة تاكِل",meaning:"Do you want to eat?",sentence:"عايزة تاكل إيه النهارده؟",sentTrans:"aayza taakul eih en-naharda?",sentMeaning:"What do you want to eat today?",farsi:"میخوای بخوری؟"},
      {id:"v8_2",egy:"جوعان / جوعانة",trans:"gawaan / gawaana",egyPron:"جوعان / جوعانة",meaning:"Hungry (m/f)",sentence:"أنا جوعانة أوي",sentTrans:"ana gawaana awi",sentMeaning:"I'm very hungry",farsi:"گرسنه‌ام"},
      {id:"v8_3",egy:"عطشان",trans:"atshaan",egyPron:"عَطشان",meaning:"Thirsty",sentence:"عطشان؟ هات مية",sentTrans:"atshaan? haat mayya",sentMeaning:"Thirsty? Get some water",farsi:"تشنه‌ام"},
      {id:"v8_4",egy:"مية",trans:"mayya",egyPron:"مَيّة",meaning:"Water",sentence:"هات مية بارده",sentTrans:"haat mayya barda",sentMeaning:"Bring cold water",farsi:"آب"},
      {id:"v8_5",egy:"عيش",trans:"eish",egyPron:"عيش",meaning:"Bread",sentence:"فيه عيش؟",sentTrans:"feeh eish?",sentMeaning:"Is there bread?",farsi:"نون"},
      {id:"v8_6",egy:"حاجة ساقعة",trans:"haaga saqa",egyPron:"حاجة ساقِعة",meaning:"Something cold (drink)",sentence:"عايزة حاجة ساقعة",sentTrans:"aayza haaga saqa",sentMeaning:"I want something cold",farsi:""},
      {id:"v8_7",egy:"لذيذ",trans:"laziiz",egyPron:"لَذيذ",meaning:"Delicious / tasty",sentence:"الأكل لذيذ أوي",sentTrans:"el-akl laziiz awi",sentMeaning:"The food is very delicious",farsi:"لذیذ — نفس کلمه!"},
      {id:"v8_8",egy:"شبعان / شبعانة",trans:"shaban / shabaana",egyPron:"شَبعان / شَبعانة",meaning:"Full / satisfied (m/f)",sentence:"لا شكراً، أنا شبعانة",sentTrans:"la shukran, ana shabaana",sentMeaning:"No thank you, I'm full",farsi:"سیرم"},
    ],
  },
  // ── SESSION 9: COLORS & SHAPES ────────────────────────────────────────────
  {
    id:9, title:"Colors & Shapes", arabicTitle:"الألوان والأشكال", emoji:"🎨", color:"#9B6BB5",
    tip:"🔑 Colors are great baby talk! إيه اللون ده؟ (what color is this?) is one of the first things babies learn.",
    vocab:[
      {id:"v9_1",egy:"أحمر",trans:"ahmar",egyPron:"أحمَر",meaning:"Red",sentence:"الكرة دي حمرا",sentTrans:"el-kora di hamra",sentMeaning:"This ball is red",farsi:"قرمز"},
      {id:"v9_2",egy:"أزرق",trans:"azraq",egyPron:"أزرَق",meaning:"Blue",sentence:"السما زرقا",sentTrans:"el-sama zar'a",sentMeaning:"The sky is blue",farsi:"آبی"},
      {id:"v9_3",egy:"أصفر",trans:"asfar",egyPron:"أصفَر",meaning:"Yellow",sentence:"الشمس صفرا",sentTrans:"el-shams safra",sentMeaning:"The sun is yellow",farsi:"زرد"},
      {id:"v9_4",egy:"أخضر",trans:"akhdar",egyPron:"أخضَر",meaning:"Green",sentence:"العشب أخضر",sentTrans:"el-ushb akhdar",sentMeaning:"The grass is green",farsi:"سبز"},
      {id:"v9_5",egy:"أبيض",trans:"abyad",egyPron:"أبيَض",meaning:"White",sentence:"لبسه أبيض",sentTrans:"libiisu abyad",sentMeaning:"His clothes are white",farsi:"سفید"},
      {id:"v9_6",egy:"أسود",trans:"aswad",egyPron:"أسوَد",meaning:"Black",sentence:"الشعر أسود",sentTrans:"el-shaar aswad",sentMeaning:"The hair is black",farsi:"مشکی"},
      {id:"v9_7",egy:"بردقاني",trans:"burtuqaani",egyPron:"بُردُقاني",meaning:"Orange (color)",sentence:"اللون البردقاني جميل",sentTrans:"el-loon el-burtuqaani gameel",sentMeaning:"The orange color is beautiful",farsi:"نارنجی"},
      {id:"v9_8",egy:"إيه اللون ده",trans:"eih el-loon da",egyPron:"إيه اللون ده",meaning:"What color is this?",sentence:"إيه اللون ده يا بيبي؟",sentTrans:"eih el-loon da ya baby?",sentMeaning:"What color is this, baby?",farsi:"این چه رنگیه؟"},
    ],
  },
  // ── SESSION 10: ANIMALS ───────────────────────────────────────────────────
  {
    id:10, title:"Animals", arabicTitle:"الحيوانات", emoji:"🐾", color:"#5B8A6E",
    tip:"🔑 Animal sounds in Arabic are different! A cat says مياو (miyaaw) but a dog says هاو هاو (haw haw). Great for baby play!",
    vocab:[
      {id:"v10_1",egy:"قطة",trans:"otta",egyPron:"قِطّة",meaning:"Cat",sentence:"شوف القطة يا بيبي",sentTrans:"shoof el-otta ya baby",sentMeaning:"Look at the cat, baby",farsi:"گربه"},
      {id:"v10_2",egy:"كلب",trans:"kalb",egyPron:"كَلب",meaning:"Dog",sentence:"الكلب بيقول هاو هاو",sentTrans:"el-kalb biyool haw haw",sentMeaning:"The dog says woof woof",farsi:"سگ"},
      {id:"v10_3",egy:"عصفور",trans:"asfoor",egyPron:"عُصفور",meaning:"Bird",sentence:"شوف العصفور بيطير",sentTrans:"shoof el-asfoor biytiir",sentMeaning:"Look at the bird flying",farsi:"پرنده"},
      {id:"v10_4",egy:"سمكة",trans:"samaka",egyPron:"سَمَكة",meaning:"Fish",sentence:"السمكة بتعوم",sentTrans:"el-samaka bitetoom",sentMeaning:"The fish is swimming",farsi:"ماهی"},
      {id:"v10_5",egy:"فرس",trans:"faras",egyPron:"فَرَس",meaning:"Horse",sentence:"الفرس بيجري",sentTrans:"el-faras biyigri",sentMeaning:"The horse is running",farsi:"اسب"},
      {id:"v10_6",egy:"بطة",trans:"batta",egyPron:"بَطّة",meaning:"Duck",sentence:"البطة بتقول واك",sentTrans:"el-batta bitool waak",sentMeaning:"The duck says quack",farsi:"اردک"},
      {id:"v10_7",egy:"أسد",trans:"asad",egyPron:"أسَد",meaning:"Lion",sentence:"الأسد بيقول آآآ",sentTrans:"el-asad biyool aaa",sentMeaning:"The lion roars",farsi:"شیر — اسد in Arabic"},
      {id:"v10_8",egy:"فيل",trans:"feel",egyPron:"فيل",meaning:"Elephant",sentence:"الفيل كبير أوي",sentTrans:"el-feel kibiir awi",sentMeaning:"The elephant is very big",farsi:"فیل — نفس کلمه!"},
    ],
  },
  // ── SESSION 11: AROUND THE HOUSE ─────────────────────────────────────────
  {
    id:11, title:"Around the House", arabicTitle:"في البيت", emoji:"🏡", color:"#7A8FA6",
    tip:"🔑 فين (where is) + any room/object = you can find anything in the house. فين الريموت؟ will get you far.",
    vocab:[
      {id:"v11_1",egy:"أوضة النوم",trans:"oodit en-noom",egyPron:"أوضة النوم",meaning:"Bedroom",sentence:"البيبي في أوضة النوم",sentTrans:"el-baby fi oodit en-noom",sentMeaning:"The baby is in the bedroom",farsi:"اتاق خواب"},
      {id:"v11_2",egy:"الصالة",trans:"el-saala",egyPron:"الصالة",meaning:"Living room",sentence:"إحنا في الصالة",sentTrans:"ihna fi el-saala",sentMeaning:"We're in the living room",farsi:"پذیرایی"},
      {id:"v11_3",egy:"الشباك",trans:"el-shubbaak",egyPron:"الشُبّاك",meaning:"Window",sentence:"افتح الشباك",sentTrans:"iftah el-shubbaak",sentMeaning:"Open the window",farsi:"پنجره"},
      {id:"v11_4",egy:"الباب",trans:"el-baab",egyPron:"الباب",meaning:"The door",sentence:"افتح الباب من فضلك",sentTrans:"iftah el-baab men fadlak",sentMeaning:"Open the door please",farsi:"در — باب in Farsi!"},
      {id:"v11_5",egy:"النور",trans:"en-noor",egyPron:"النور",meaning:"The light",sentence:"ودي النور",sentTrans:"waddi en-noor",sentMeaning:"Turn off the light",farsi:"نور — نفس کلمه!"},
      {id:"v11_6",egy:"الريموت",trans:"el-reemoot",egyPron:"الريموت",meaning:"The remote control",sentence:"فين الريموت؟",sentTrans:"fein el-reemoot?",sentMeaning:"Where's the remote?",farsi:"ریموت کنترل"},
      {id:"v11_7",egy:"المفتاح",trans:"el-muftaah",egyPron:"المُفتاح",meaning:"The key",sentence:"مش لاقية المفتاح",sentTrans:"mesh laaya el-muftaah",sentMeaning:"I can't find the key",farsi:"کلید"},
      {id:"v11_8",egy:"الموبايل",trans:"el-mobaail",egyPron:"الموبايل",meaning:"The mobile phone",sentence:"فين الموبايل؟",sentTrans:"fein el-mobaail?",sentMeaning:"Where's the phone?",farsi:"موبایل — نفس کلمه!"},
    ],
  },
  // ── SESSION 12: FAMILY & PEOPLE ──────────────────────────────────────────
  {
    id:12, title:"Family & People", arabicTitle:"الناس والعيلة", emoji:"👨‍👩‍👧", color:"#B5734A",
    tip:"🔑 Egyptians are family-oriented. ربنا يحفظهم (may God protect them) is a beautiful response when someone asks about your family.",
    vocab:[
      {id:"v12_1",egy:"الأهل",trans:"el-ahl",egyPron:"الأهل",meaning:"The family",sentence:"الأهل بخير إن شاء الله",sentTrans:"el-ahl bikheer inshallah",sentMeaning:"The family is well, God willing",farsi:"خانواده — اهل in Farsi!"},
      {id:"v12_2",egy:"أمي",trans:"ommi",egyPron:"أُمّي",meaning:"My mother",sentence:"أمي بتحبك أوي",sentTrans:"ommi bithibbak awi",sentMeaning:"My mother loves you a lot",farsi:"مامانم"},
      {id:"v12_3",egy:"أبويا",trans:"abuuya",egyPron:"أبويا",meaning:"My father",sentence:"أبويا راح الشغل",sentTrans:"abuuya raah el-shughl",sentMeaning:"My father went to work",farsi:"بابام"},
      {id:"v12_4",egy:"أخويا",trans:"akhuwwya",egyPron:"أخويا",meaning:"My brother",sentence:"أخويا في أمريكا",sentTrans:"akhuwwya fi amreeka",sentMeaning:"My brother is in America",farsi:"داداشم"},
      {id:"v12_5",egy:"أختي",trans:"ukhti",egyPron:"أُختي",meaning:"My sister",sentence:"أختي جاية الأسبوع ده",sentTrans:"ukhti gaya el-usboo da",sentMeaning:"My sister is coming this week",farsi:"خواهرم"},
      {id:"v12_6",egy:"جوزي",trans:"gawzi",egyPron:"جَوزي",meaning:"My husband",sentence:"جوزي بيحبني أوي",sentTrans:"gawzi biyhibbni awi",sentMeaning:"My husband loves me a lot",farsi:"شوهرم"},
      {id:"v12_7",egy:"بنتي",trans:"binti",egyPron:"بِنتي",meaning:"My daughter",sentence:"بنتي حلوة أوي",sentTrans:"binti helwa awi",sentMeaning:"My daughter is so cute",farsi:"دخترم"},
      {id:"v12_8",egy:"ابني",trans:"ibni",egyPron:"اِبني",meaning:"My son",sentence:"ابني نايم دلوقتي",sentTrans:"ibni nayem dilwaqti",sentMeaning:"My son is sleeping now",farsi:"پسرم"},
    ],
  },
  // ── SESSION 13: TIME & ROUTINE ────────────────────────────────────────────
  {
    id:13, title:"Time & Routine", arabicTitle:"الوقت والروتين", emoji:"⏰", color:"#4A7A9B",
    tip:"🔑 Egyptians run on their own time — بعدين (later) and شوية (a bit) are very flexible concepts. Embrace it!",
    vocab:[
      {id:"v13_1",egy:"الصبح",trans:"el-subh",egyPron:"الصُبح",meaning:"The morning",sentence:"صبح الخير، نمتي كويس؟",sentTrans:"subh el-kheer, nimti kwayyes?",sentMeaning:"Good morning, did you sleep well?",farsi:"صبح"},
      {id:"v13_2",egy:"الضهر",trans:"el-duhr",egyPron:"الضُهر",meaning:"Noon / afternoon",sentence:"هنتغدى الضهر",sentTrans:"hanitaghadda el-duhr",sentMeaning:"We'll have lunch at noon",farsi:"ظهر — ضهر in Egyptian"},
      {id:"v13_3",egy:"الليل",trans:"el-leil",egyPron:"الليل",meaning:"The night",sentence:"تصبح على خير يا بيبي",sentTrans:"tisbah ala kheer ya baby",sentMeaning:"Good night, baby",farsi:"شب"},
      {id:"v13_4",egy:"دلوقتي",trans:"dilwaqti",egyPron:"دِلوَقتي",meaning:"Right now",sentence:"مش دلوقتي، بعدين",sentTrans:"mesh dilwaqti, baadein",sentMeaning:"Not right now, later",farsi:"الآن — الان"},
      {id:"v13_5",egy:"بعدين",trans:"baadein",egyPron:"بَعدين",meaning:"Later / after",sentence:"نتكلم بعدين",sentTrans:"netekallem baadein",sentMeaning:"We'll talk later",farsi:"بعداً"},
      {id:"v13_6",egy:"قبل كده",trans:"abl keda",egyPron:"قَبل كَده",meaning:"Before / earlier",sentence:"قبل كده كنت تعبانة",sentTrans:"abl keda kunt taabana",sentMeaning:"Earlier I was tired",farsi:"قبلاً"},
      {id:"v13_7",egy:"كل يوم",trans:"kull yoom",egyPron:"كُل يوم",meaning:"Every day",sentence:"أنا بتمرن كل يوم",sentTrans:"ana batimarran kull yoom",sentMeaning:"I exercise every day",farsi:"هر روز"},
      {id:"v13_8",egy:"الأسبوع",trans:"el-usboo",egyPron:"الأُسبوع",meaning:"The week",sentence:"الأسبوع ده تعبان",sentTrans:"el-usboo da taabaan",sentMeaning:"This week is exhausting",farsi:"هفته"},
    ],
  },
];

// ─── BATCH SYSTEM ────────────────────────────────────────────────────────────
// Each session has 3 batches of words. Batch 1 is always unlocked.
// Batch 2 unlocks when 75%+ of batch 1 words are mastered in tests.
// Batch 3 unlocks when 75%+ of batch 2 words are mastered in tests.
// "Mastered" = correct >= 2 AND wrong === 0 in testProgress.

// Extra vocab batches — added to each session
const EXTRA_VOCAB = {
  // ── SESSION 1: BABY TALK ────────────────────────────────────────────────
  1: {
    batch2:[
      {id:"v1_9", egy:"بيبكي",    trans:"biyibki",    egyPron:"بيبكي",       meaning:"He is crying",              sentence:"البيبي بيبكي ليه؟",          sentTrans:"el-baby biyibki leih?",        sentMeaning:"Why is the baby crying?",           farsi:"گریه میکنه"},
      {id:"v1_10",egy:"ضاحك",     trans:"daahek",     egyPron:"ضاحِك",       meaning:"Laughing / smiling",        sentence:"شوف البيبي ضاحك!",           sentTrans:"shoof el-baby daahek!",        sentMeaning:"Look, the baby is laughing!",       farsi:""},
      {id:"v1_11",egy:"عمل إيه",  trans:"amal eih",   egyPron:"عَمَل إيه",   meaning:"What did he do?",           sentence:"البيبي عمل إيه دلوقتي؟",    sentTrans:"el-baby amal eih dilwaqti?",   sentMeaning:"What did the baby just do?",        farsi:""},
      {id:"v1_12",egy:"اتقلب",    trans:"etaalleb",   egyPron:"اتقَلَّب",    meaning:"He rolled over",            sentence:"البيبي اتقلب لوحده!",        sentTrans:"el-baby etaalleb lewahdu!",    sentMeaning:"Baby rolled over by himself!",      farsi:""},
      {id:"v1_13",egy:"شايل",     trans:"shaayel",    egyPron:"شايِل",       meaning:"Carrying / holding",        sentence:"أنا شايلاه",                 sentTrans:"ana shaaylah",                 sentMeaning:"I'm holding him",                   farsi:""},
      {id:"v1_14",egy:"بيتكلم",   trans:"biyitkallim",egyPron:"بيتكَلِّم",   meaning:"Babbling / talking",        sentence:"البيبي بيتكلم أوي",          sentTrans:"el-baby biyitkallim awi",      sentMeaning:"Baby is babbling so much",          farsi:""},
    ],
    batch3:[
      {id:"v1_15",egy:"سنانه",    trans:"sinanu",     egyPron:"سِنانه",      meaning:"His teeth / teething",      sentence:"البيبي بيطلع سنانه",         sentTrans:"el-baby biyitla sinanu",       sentMeaning:"Baby is teething",                  farsi:""},
      {id:"v1_16",egy:"بيمشي",    trans:"biyimshi",   egyPron:"بيمشي",       meaning:"He is walking",             sentence:"البيبي بيمشي بقى!",          sentTrans:"el-baby biyimshi baqa!",       sentMeaning:"Baby is walking now!",              farsi:""},
      {id:"v1_17",egy:"نظيف",     trans:"nadheef",    egyPron:"نَضيف",       meaning:"Clean",                     sentence:"البيبي نظيف دلوقتي",         sentTrans:"el-baby nadheef dilwaqti",     sentMeaning:"Baby is clean now",                 farsi:"نظیف in Farsi — same!"},
      {id:"v1_18",egy:"وسخ",      trans:"wisikh",     egyPron:"وِسِخ",       meaning:"Dirty",                     sentence:"ده وسخ، غيّره",              sentTrans:"da wisikh ghayeru",            sentMeaning:"That's dirty, change it",           farsi:""},
      {id:"v1_19",egy:"تقيل",     trans:"taqeel",     egyPron:"تَقيل",       meaning:"Heavy / deep sleep",        sentence:"نايم نوم تقيل",              sentTrans:"nayem nom taqeel",             sentMeaning:"Sleeping deeply",                   farsi:"سنگین — same idea"},
      {id:"v1_20",egy:"فرحان",    trans:"farhan",     egyPron:"فَرحان",      meaning:"Happy / joyful",            sentence:"البيبي فرحان أوي النهارده",  sentTrans:"el-baby farhan awi en-naharda",sentMeaning:"Baby is so happy today",            farsi:"فرحان — مثل شاد"},
    ],
  },
  // ── SESSION 2: HOME & DAILY LIFE ────────────────────────────────────────
  2: {
    batch2:[
      {id:"v2_9", egy:"مش عارفة", trans:"mesh aarfa", egyPron:"مِش عارفة",   meaning:"I don't know (woman)",      sentence:"مش عارفة فين المفتاح",       sentTrans:"mesh aarfa fein el-muftah",    sentMeaning:"I don't know where the key is",     farsi:"نمیدونم"},
      {id:"v2_10",egy:"فين",       trans:"fein",       egyPron:"فين",         meaning:"Where?",                    sentence:"فين الموبايل؟",               sentTrans:"fein el-mobile?",              sentMeaning:"Where's the phone?",                farsi:"کجا"},
      {id:"v2_11",egy:"روح",       trans:"rooh",       egyPron:"روح",         meaning:"Go (command)",              sentence:"روح نام دلوقتي",              sentTrans:"rooh naam dilwaqti",           sentMeaning:"Go sleep right now",                farsi:"برو"},
      {id:"v2_12",egy:"تعالى",     trans:"taala",      egyPron:"تَعالى",      meaning:"Come here",                 sentence:"تعالى هنا يا حبيبي",          sentTrans:"taala hena ya habibi",         sentMeaning:"Come here, my love",                farsi:"بیا"},
      {id:"v2_13",egy:"لسه",       trans:"lessa",      egyPron:"لِسّه",       meaning:"Not yet / still",           sentence:"لسه صاحي؟",                   sentTrans:"lessa sahi?",                  sentMeaning:"Still awake?",                      farsi:"هنوز"},
      {id:"v2_14",egy:"أهو",       trans:"aho",        egyPron:"أهو",         meaning:"There it is / here!",       sentence:"أهو جه!",                     sentTrans:"aho ge!",                      sentMeaning:"There he is! He came!",             farsi:""},
    ],
    batch3:[
      {id:"v2_15",egy:"مين",       trans:"meen",       egyPron:"مين",         meaning:"Who?",                      sentence:"مين ده؟",                     sentTrans:"meen da?",                     sentMeaning:"Who is that?",                      farsi:"کیه؟"},
      {id:"v2_16",egy:"إمتى",      trans:"emta",       egyPron:"إمتى",        meaning:"When?",                     sentence:"إمتى هترجع؟",                 sentTrans:"emta hatirga?",                sentMeaning:"When will you come back?",          farsi:"کِی؟"},
      {id:"v2_17",egy:"ليه",       trans:"leih",       egyPron:"ليه",         meaning:"Why?",                      sentence:"ليه بيبكي؟",                  sentTrans:"leih biyibki?",                sentMeaning:"Why is he crying?",                 farsi:"چرا"},
      {id:"v2_18",egy:"أيوه",      trans:"aywa",       egyPron:"أيوه",        meaning:"Yes",                       sentence:"أيوه، عارفة",                 sentTrans:"aywa aarfa",                   sentMeaning:"Yes, I know",                       farsi:"آره"},
      {id:"v2_19",egy:"لأ",        trans:"la",         egyPron:"لأ",          meaning:"No",                        sentence:"لأ، مش دلوقتي",               sentTrans:"la mesh dilwaqti",             sentMeaning:"No, not right now",                 farsi:"نه"},
      {id:"v2_20",egy:"ممكن",      trans:"mumkin",     egyPron:"مُمكِن",      meaning:"Can / possible / please",   sentence:"ممكن تساعدني؟",               sentTrans:"mumkin tisaaidni?",            sentMeaning:"Can you help me?",                  farsi:"ممکنه — same word!"},
    ],
  },
  // ── SESSION 3: FEELINGS ─────────────────────────────────────────────────
  3: {
    batch2:[
      {id:"v3_9", egy:"وحيدة",    trans:"wahiida",    egyPron:"وَحيدة",      meaning:"Lonely / alone (woman)",    sentence:"أنا حاسة إني وحيدة",          sentTrans:"ana hassa inni wahiida",       sentMeaning:"I feel lonely",                     farsi:"تنها"},
      {id:"v3_10",egy:"خايفة",    trans:"khaayfa",    egyPron:"خايفة",       meaning:"Scared / worried (woman)",  sentence:"أنا خايفة عليه",              sentTrans:"ana khaayfa aleih",            sentMeaning:"I'm scared for him",                farsi:"میترسم"},
      {id:"v3_11",egy:"زعّلتني",  trans:"zaaltni",    egyPron:"زَعَّلتني",   meaning:"You upset me",              sentence:"زعّلتني أوي",                 sentTrans:"zaaltni awi",                  sentMeaning:"You really upset me",               farsi:"ناراحتم کردی"},
      {id:"v3_12",egy:"بحبك",     trans:"bahibbak",   egyPron:"بَحِبَّك",    meaning:"I love you (to him)",       sentence:"بحبك كتير",                   sentTrans:"bahibbak kteer",               sentMeaning:"I love you so much",                farsi:"دوستت دارم"},
      {id:"v3_13",egy:"فرّحتني",  trans:"farrahtni",  egyPron:"فَرَّحتني",   meaning:"You made me happy",         sentence:"فرّحتني أوي يا حبيبي",        sentTrans:"farrahtni awi ya habibi",      sentMeaning:"You made me so happy",              farsi:""},
      {id:"v3_14",egy:"حاسة",     trans:"hassa",      egyPron:"حاسّة",       meaning:"I feel / I sense (woman)",  sentence:"أنا حاسة إنه تعبان",          sentTrans:"ana hassa innu taaban",        sentMeaning:"I feel he's unwell",                farsi:"حس میکنم"},
    ],
    batch3:[
      {id:"v3_15",egy:"مليش نفس", trans:"malish nafs",egyPron:"مَليش نَفس",  meaning:"I don't feel like it",      sentence:"مليش نفس دلوقتي",             sentTrans:"malish nafs dilwaqti",         sentMeaning:"I don't feel like it right now",    farsi:"حوصله ندارم"},
      {id:"v3_16",egy:"محتاجة",   trans:"mehtaga",    egyPron:"مِحتاجة",     meaning:"I need (woman)",            sentence:"أنا محتاجة مساعدة",           sentTrans:"ana mehtaga mosaada",          sentMeaning:"I need help",                       farsi:"نیاز دارم"},
      {id:"v3_17",egy:"ممنونة",   trans:"mamnona",    egyPron:"مَمنونة",     meaning:"Grateful / thankful (woman)",sentence:"أنا ممنونة منك أوي",          sentTrans:"ana mamnona mennak awi",       sentMeaning:"I'm so grateful to you",            farsi:"ممنونم — same word!"},
      {id:"v3_18",egy:"خلاص زهقت",trans:"khalas zahaqt",egyPron:"خَلاص زِهِقت",meaning:"I'm completely done / fed up",sentence:"خلاص زهقت، هنام",          sentTrans:"khalas zahaqt hanaam",         sentMeaning:"I'm done, going to sleep",          farsi:""},
      {id:"v3_19",egy:"فخورة",    trans:"fakhora",    egyPron:"فَخورة",      meaning:"Proud (woman)",             sentence:"أنا فخورة بيك يا بيبي",       sentTrans:"ana fakhora beek ya baby",     sentMeaning:"I'm proud of you, baby",            farsi:"افتخار میکنم"},
      {id:"v3_20",egy:"مبسوطة",   trans:"mabsoota",   egyPron:"مَبسوطة",    meaning:"Happy / content (woman)",   sentence:"أنا مبسوطة جداً النهارده",    sentTrans:"ana mabsoota giddan en-naharda",sentMeaning:"I'm really happy today",           farsi:"مبسوط — same word!"},
    ],
  },
  // ── SESSION 4: SHOPPING ─────────────────────────────────────────────────
  4: {
    batch2:[
      {id:"v4_9", egy:"تاني",     trans:"taani",      egyPron:"تاني",        meaning:"Another / again",           sentence:"هات واحد تاني",               sentTrans:"haat wahid taani",             sentMeaning:"Bring another one",                 farsi:"یه دیگه"},
      {id:"v4_10",egy:"ده",       trans:"da",         egyPron:"ده",          meaning:"This one (m)",              sentence:"ده بكام؟",                    sentTrans:"da bikaam?",                   sentMeaning:"How much is this?",                 farsi:"این"},
      {id:"v4_11",egy:"دي",       trans:"di",         egyPron:"دي",          meaning:"This one (f)",              sentence:"دي أحسن",                     sentTrans:"di ahsan",                     sentMeaning:"This one is better",                farsi:"این"},
      {id:"v4_12",egy:"أحسن",     trans:"ahsan",      egyPron:"أحسَن",       meaning:"Better / best",             sentence:"ده أحسن من ده",               sentTrans:"da ahsan men da",              sentMeaning:"This is better than that",          farsi:"بهتر"},
      {id:"v4_13",egy:"مفيش",     trans:"mafeesh",    egyPron:"مَفيش",       meaning:"There isn't / none",        sentence:"مفيش تاني؟",                  sentTrans:"mafeesh taani?",               sentMeaning:"There's no other one?",             farsi:"نیست"},
      {id:"v4_14",egy:"شكراً",    trans:"shukran",    egyPron:"شُكراً",      meaning:"Thank you",                 sentence:"شكراً جداً",                  sentTrans:"shukran giddan",               sentMeaning:"Thank you very much",               farsi:"ممنون — شکران in Farsi!"},
    ],
    batch3:[
      {id:"v4_15",egy:"أرخص",     trans:"arkhas",     egyPron:"أرخَص",       meaning:"Cheaper",                   sentence:"مفيش أرخص من كده؟",           sentTrans:"mafeesh arkhas men keda?",     sentMeaning:"Nothing cheaper?",                  farsi:""},
      {id:"v4_16",egy:"كتير",     trans:"kteer",      egyPron:"كِتير",       meaning:"A lot / many / too much",   sentence:"ده كتير أوي",                 sentTrans:"da kteer awi",                 sentMeaning:"That's way too much",               farsi:"کثیر — same word!"},
      {id:"v4_17",egy:"واحد",     trans:"wahid",      egyPron:"واحِد",       meaning:"One",                       sentence:"واحد بس",                     sentTrans:"wahid bass",                   sentMeaning:"Just one",                          farsi:"واحد — same word!"},
      {id:"v4_18",egy:"اتنين",    trans:"itneen",     egyPron:"اتنين",       meaning:"Two",                       sentence:"هات اتنين",                   sentTrans:"haat itneen",                  sentMeaning:"Give me two",                       farsi:"دو تا"},
      {id:"v4_19",egy:"حسابي",    trans:"hsaabi",     egyPron:"حِسابي",      meaning:"My bill / the total",       sentence:"الحساب كام؟",                 sentTrans:"el-hsaab kaam?",               sentMeaning:"What's the total?",                 farsi:"حساب — same word!"},
      {id:"v4_20",egy:"عندك",     trans:"andak",      egyPron:"عَندَك",      meaning:"Do you have? / you have",   sentence:"عندك مقاس تاني؟",             sentTrans:"andak meqas taani?",           sentMeaning:"Do you have another size?",          farsi:"داری؟"},
    ],
  },
  // ── SESSION 5: WITH YOUR HUSBAND ────────────────────────────────────────
  5: {
    batch2:[
      {id:"v5_9", egy:"حياتي",    trans:"hayaati",    egyPron:"حَياتي",      meaning:"My life (endearment)",      sentence:"إنت حياتي",                   sentTrans:"inta hayaati",                 sentMeaning:"You are my life",                   farsi:"زندگیمی"},
      {id:"v5_10",egy:"روحي",     trans:"roohi",      egyPron:"روحي",        meaning:"My soul (endearment)",      sentence:"يلا يا روحي",                 sentTrans:"yalla ya roohi",               sentMeaning:"Come on, my soul",                  farsi:"جانم"},
      {id:"v5_11",egy:"عيني",     trans:"eini",       egyPron:"عيني",        meaning:"My eye / my darling",       sentence:"تعالى يا عيني",               sentTrans:"taala ya eini",                sentMeaning:"Come here, my darling",             farsi:"چشمم"},
      {id:"v5_12",egy:"نورت",     trans:"nawwart",    egyPron:"نَوَّرت",     meaning:"You lit up the place",      sentence:"نورت البيت",                  sentTrans:"nawwart el-beit",              sentMeaning:"You lit up the house (welcome!)",   farsi:""},
      {id:"v5_13",egy:"صبر",      trans:"sabr",       egyPron:"صَبر",        meaning:"Patience",                  sentence:"محتاجة صبر شوية",             sentTrans:"mehtaga sabr shwayya",         sentMeaning:"I need a little patience",          farsi:"صبر — same word!"},
      {id:"v5_14",egy:"قوم بقى",  trans:"oom baqa",   egyPron:"قوم بَقى",    meaning:"Get up already",            sentence:"قوم بقى، البيبي صاحي",        sentTrans:"oom baqa el-baby sahi",        sentMeaning:"Get up, baby is awake",             farsi:""},
    ],
    batch3:[
      {id:"v5_15",egy:"حاجة حلوة",trans:"haaga helwa",egyPron:"حاجة حِلوة",  meaning:"Something nice",            sentence:"قوليلك حاجة حلوة",            sentTrans:"qollilak haaga helwa",         sentMeaning:"Let me tell you something nice",    farsi:""},
      {id:"v5_16",egy:"فكرتني",   trans:"fakkartni",  egyPron:"فَكَّرتني",   meaning:"You reminded me",           sentence:"فكرتني بحاجة",                sentTrans:"fakkartni bihaaga",            sentMeaning:"You reminded me of something",      farsi:"یادم انداختی"},
      {id:"v5_17",egy:"بفتكر",    trans:"biftikir",   egyPron:"بِفتِكِر",    meaning:"I think of / I remember",   sentence:"بفتكر فيك طول الوقت",         sentTrans:"biftikir feek tool el-waqt",   sentMeaning:"I think of you all the time",       farsi:"فکر میکنم"},
      {id:"v5_18",egy:"ربنا يكرمك",trans:"rabbena yikrimak",egyPron:"رَبِّنا يِكرِمَك",meaning:"May God honor you",sentence:"ربنا يكرمك يا حبيبي",         sentTrans:"rabbena yikrimak ya habibi",   sentMeaning:"May God honor you, my love",        farsi:"خدا عزیزت کنه"},
      {id:"v5_19",egy:"كلنا معاك",trans:"kullina maak",egyPron:"كُلِّنا مَعاك",meaning:"We're all with you",     sentence:"كلنا معاك يا حبيبي",          sentTrans:"kullina maak ya habibi",       sentMeaning:"We're all with you, my love",       farsi:"همه پیشتیم"},
      {id:"v5_20",egy:"الحمد لله",trans:"el-hamdu lillah",egyPron:"الحَمدُ لِلّه",meaning:"Thank God / praise God",sentence:"الحمد لله على كل حاجة",      sentTrans:"el-hamdu lillah ala kull haaga",sentMeaning:"Thank God for everything",         farsi:"الحمدلله — same word!"},
    ],
  },
  // ── SESSION 6 EXTRAS ────────────────────────────────────────────────────
  6: {
    batch2:[
      {id:"v6_9", egy:"يلا بينا",   trans:"yalla beina",  egyPron:"يَلّا بينا",  meaning:"Let's go (together)",        sentence:"يلا بينا نروح",          sentTrans:"yalla beina nrooh",            sentMeaning:"Let's go together",          farsi:"بریم دیگه"},
      {id:"v6_10",egy:"فرصة سعيدة",trans:"forsa saida",   egyPron:"فُرصة سَعيدة",meaning:"Nice to meet you",            sentence:"فرصة سعيدة يا نينا",     sentTrans:"forsa saida ya Nina",          sentMeaning:"Nice to meet you, Nina",     farsi:"خوشبختم"},
      {id:"v6_11",egy:"عارفة",      trans:"aarfa",         egyPron:"عارفة",       meaning:"I know (woman)",             sentence:"أيوه، أنا عارفة",        sentTrans:"aywa, ana aarfa",              sentMeaning:"Yes, I know",                farsi:"میدونم"},
      {id:"v6_12",egy:"مش عارفة",   trans:"mesh aarfa",    egyPron:"مِش عارفة",   meaning:"I don't know (woman)",       sentence:"مش عارفة، آسفة",         sentTrans:"mesh aarfa, asfa",             sentMeaning:"I don't know, sorry",        farsi:"نمیدونم"},
      {id:"v6_13",egy:"قوليلي",     trans:"oollili",       egyPron:"قوليلي",      meaning:"Tell me",                    sentence:"قوليلي إيه اللي حصل",    sentTrans:"oollili eih elli hasal",       sentMeaning:"Tell me what happened",      farsi:"بگو بهم"},
      {id:"v6_14",egy:"فاهمة",      trans:"fahma",         egyPron:"فاهمة",       meaning:"I understand (woman)",       sentence:"أيوه أنا فاهمة",         sentTrans:"aywa ana fahma",               sentMeaning:"Yes I understand",           farsi:"میفهمم"},
    ],
    batch3:[
      {id:"v6_15",egy:"صاحبتي",     trans:"sahibti",       egyPron:"صاحِبتي",     meaning:"My friend (f)",              sentence:"دي صاحبتي",              sentTrans:"di sahibti",                   sentMeaning:"She's my friend",            farsi:"دوستم"},
      {id:"v6_16",egy:"تعالوا",     trans:"taalu",         egyPron:"تَعالوا",     meaning:"Come (plural)",              sentence:"تعالوا هنا يا جماعة",    sentTrans:"taalu hena ya gamaa",          sentMeaning:"Come here everyone",         farsi:"بیاید"},
      {id:"v6_17",egy:"جماعة",      trans:"gamaa",         egyPron:"جَماعة",      meaning:"Everyone / the gang",        sentence:"يلا يا جماعة",           sentTrans:"yalla ya gamaa",               sentMeaning:"Let's go everyone",          farsi:"همه — بچه‌ها"},
      {id:"v6_18",egy:"بجد",        trans:"bigad",         egyPron:"بِجَد",       meaning:"Seriously / really",         sentence:"بجد؟ ده جامد!",          sentTrans:"bigad? da gaamid!",            sentMeaning:"Seriously? That's awesome!", farsi:"جدی؟ — واقعاً"},
      {id:"v6_19",egy:"طب",         trans:"tab",           egyPron:"طَب",         meaning:"OK then / well then",        sentence:"طب يلا نروح",            sentTrans:"tab yalla nrooh",              sentMeaning:"OK then let's go",           farsi:"خب — پس"},
      {id:"v6_20",egy:"شوف",        trans:"shoof",         egyPron:"شوف",         meaning:"Look / see (command)",       sentence:"شوف ده جميل أوي",        sentTrans:"shoof da gameel awi",          sentMeaning:"Look how beautiful this is", farsi:"ببین"},
    ],
  },
  // ── SESSION 7 EXTRAS ────────────────────────────────────────────────────
  7: {
    batch2:[
      {id:"v7_9", egy:"عادي",       trans:"aadi",          egyPron:"عادي",        meaning:"Normal / no big deal",       sentence:"ده عادي خالص",           sentTrans:"da aadi khalis",               sentMeaning:"That's totally normal",      farsi:"عادیه"},
      {id:"v7_10",egy:"خالص",       trans:"khalis",        egyPron:"خالِص",       meaning:"At all / completely",        sentence:"مش تعبانة خالص",         sentTrans:"mesh taabana khalis",          sentMeaning:"Not tired at all",           farsi:"اصلاً — کاملاً"},
      {id:"v7_11",egy:"أكيد",       trans:"akeed",         egyPron:"أكيد",        meaning:"Sure / definitely",          sentence:"أكيد، أنا موافقة",       sentTrans:"akeed, ana muwafqa",           sentMeaning:"Sure, I agree",              farsi:"حتماً"},
      {id:"v7_12",egy:"يا سلام",    trans:"ya salaam",     egyPron:"يا سَلام",    meaning:"Wow / oh my",                sentence:"يا سلام، ده جميل أوي!",  sentTrans:"ya salaam, da gameel awi!",    sentMeaning:"Wow, that's so beautiful!",  farsi:""},
      {id:"v7_13",egy:"إن شاء الله",trans:"inshallah",     egyPron:"إن شاء الله", meaning:"God willing / hopefully",    sentence:"هنشوفك إن شاء الله",     sentTrans:"hanshoofak inshallah",         sentMeaning:"We'll see you, God willing", farsi:"إن شاء الله — نفس کلمه!"},
      {id:"v7_14",egy:"ماشي الحال", trans:"maashi el-haal",egyPron:"ماشي الحال",  meaning:"Getting by / so-so",         sentence:"إزيك؟ ماشي الحال",       sentTrans:"izzayyak? maashi el-haal",     sentMeaning:"How are you? Getting by",    farsi:""},
    ],
    batch3:[
      {id:"v7_15",egy:"صحيح",       trans:"sahiih",        egyPron:"صَحيح",       meaning:"True / correct",             sentence:"صحيح، أنت عارف كويس",    sentTrans:"sahiih, inta aaref kwayyes",   sentMeaning:"True, you know well",        farsi:"صحیح — نفس کلمه!"},
      {id:"v7_16",egy:"مش صحيح",    trans:"mesh sahiih",   egyPron:"مِش صَحيح",   meaning:"Not true / that's wrong",    sentence:"لأ، ده مش صحيح",         sentTrans:"la, da mesh sahiih",           sentMeaning:"No, that's not right",       farsi:""},
      {id:"v7_17",egy:"حاجة تانية", trans:"haaga taanya",  egyPron:"حاجة تانية",  meaning:"Something else",             sentence:"عندك حاجة تانية؟",       sentTrans:"andak haaga taanya?",          sentMeaning:"Do you have something else?",farsi:"چیز دیگه‌ای"},
      {id:"v7_18",egy:"برضو",       trans:"bardu",         egyPron:"بَرضو",       meaning:"Also / too / anyway",        sentence:"أنا برضو مبسوط",         sentTrans:"ana bardu mabsoot",            sentMeaning:"I'm also happy",             farsi:"هم — باز هم"},
      {id:"v7_19",egy:"دوشة",       trans:"dosha",         egyPron:"دوشة",        meaning:"Noise / fuss / chaos",       sentence:"فيه دوشة كتير",          sentTrans:"feeh dosha kteer",             sentMeaning:"There's a lot of noise",     farsi:"سر و صدا"},
      {id:"v7_20",egy:"سيب",        trans:"seeb",          egyPron:"سيب",         meaning:"Leave it / let go",          sentence:"سيب ده، مش مهم",         sentTrans:"seeb da, mesh muhimm",         sentMeaning:"Leave it, it doesn't matter",farsi:"ولش کن"},
    ],
  },
  // ── SESSION 8 EXTRAS ────────────────────────────────────────────────────
  8: {
    batch2:[
      {id:"v8_9", egy:"بيض",        trans:"beid",          egyPron:"بيض",         meaning:"Eggs",                       sentence:"عايزة بيض في الصبح",     sentTrans:"aayza beid fi el-subh",        sentMeaning:"I want eggs in the morning", farsi:"تخم مرغ"},
      {id:"v8_10",egy:"فراخ",       trans:"firaakh",       egyPron:"فِراخ",       meaning:"Chicken",                    sentence:"عندنا فراخ النهارده",    sentTrans:"andina firaakh en-naharda",    sentMeaning:"We have chicken today",      farsi:"مرغ"},
      {id:"v8_11",egy:"أكل برا",    trans:"akl barra",     egyPron:"أكل بَرّا",   meaning:"Eating out",                 sentence:"يلا ناكل برا النهارده",  sentTrans:"yalla naakul barra en-naharda",sentMeaning:"Let's eat out today",        farsi:"بیرون غذا خوردن"},
      {id:"v8_12",egy:"حلويات",     trans:"helwiyyaat",    egyPron:"حِلوِيّات",   meaning:"Desserts / sweets",          sentence:"عايزة حاجة حلوة",        sentTrans:"aayza haaga helwa",            sentMeaning:"I want something sweet",     farsi:"شیرینی"},
      {id:"v8_13",egy:"قهوة",       trans:"ahwa",          egyPron:"قَهوة",       meaning:"Coffee",                     sentence:"عايزة قهوة دلوقتي",      sentTrans:"aayza ahwa dilwaqti",          sentMeaning:"I want coffee right now",    farsi:"قهوه — نفس کلمه!"},
      {id:"v8_14",egy:"شاي",        trans:"shaay",         egyPron:"شاي",         meaning:"Tea",                        sentence:"هات شاي من فضلك",        sentTrans:"haat shaay men fadlak",        sentMeaning:"Bring tea please",           farsi:"چای — نفس کلمه!"},
    ],
    batch3:[
      {id:"v8_15",egy:"من فضلك",    trans:"men fadlak",    egyPron:"مِن فَضلَك",  meaning:"Please (to man)",            sentence:"هات مية من فضلك",        sentTrans:"haat mayya men fadlak",        sentMeaning:"Bring water please",         farsi:"لطفاً"},
      {id:"v8_16",egy:"أكلت",       trans:"akalt",         egyPron:"أكَلت",       meaning:"I ate / did you eat?",       sentence:"أكلتي؟ لأ لسه",          sentTrans:"akalti? la lessa",             sentMeaning:"Did you eat? Not yet",       farsi:"خوردم"},
      {id:"v8_17",egy:"هناكل",      trans:"hanaakul",      egyPron:"هَناكُل",     meaning:"We will eat",                sentence:"هناكل إيه النهارده؟",    sentTrans:"hanaakul eih en-naharda?",     sentMeaning:"What will we eat today?",    farsi:"میخوریم"},
      {id:"v8_18",egy:"طبخت",       trans:"tabakht",       egyPron:"طَبَخت",      meaning:"I cooked",                   sentence:"أنا طبخت النهارده",      sentTrans:"ana tabakht en-naharda",       sentMeaning:"I cooked today",             farsi:"پختم"},
      {id:"v8_19",egy:"فاكهة",      trans:"faakiha",       egyPron:"فاكِهة",      meaning:"Fruit",                      sentence:"عايزة فاكهة طازة",        sentTrans:"aayza faakiha taaza",          sentMeaning:"I want fresh fruit",         farsi:"میوه"},
      {id:"v8_20",egy:"طازة",       trans:"taaza",         egyPron:"طازة",        meaning:"Fresh",                      sentence:"الخضار طازة النهارده",    sentTrans:"el-khadaar taaza en-naharda",  sentMeaning:"The vegetables are fresh today",farsi:"تازه — نفس کلمه!"},
    ],
  },
  // ── SESSION 9 EXTRAS ────────────────────────────────────────────────────
  9: {
    batch2:[
      {id:"v9_9", egy:"وردي",       trans:"wardi",         egyPron:"وَردي",       meaning:"Pink",                       sentence:"فستانها وردي حلو",        sentTrans:"fustanaha wardi helw",         sentMeaning:"Her dress is pretty pink",   farsi:"صورتی"},
      {id:"v9_10",egy:"بنفسجي",     trans:"banafsigi",     egyPron:"بَنفسِجي",    meaning:"Purple",                     sentence:"البنفسجي لوني المفضل",   sentTrans:"el-banafsigi looni el-mufaddal",sentMeaning:"Purple is my favorite color",farsi:"بنفش"},
      {id:"v9_11",egy:"بني",        trans:"bunni",         egyPron:"بُنّي",       meaning:"Brown",                      sentence:"الدب بني",               sentTrans:"el-dubb bunni",                sentMeaning:"The bear is brown",          farsi:"قهوه‌ای"},
      {id:"v9_12",egy:"كبير",       trans:"kibiir",        egyPron:"كِبير",       meaning:"Big / large",                sentence:"ده كبير أوي",             sentTrans:"da kibiir awi",                sentMeaning:"This is very big",           farsi:"بزرگ"},
      {id:"v9_13",egy:"صغير",       trans:"sughayyar",     egyPron:"صُغَيَّر",    meaning:"Small / little",             sentence:"ده صغير أوي",             sentTrans:"da sughayyar awi",             sentMeaning:"This is very small",         farsi:"کوچیک"},
      {id:"v9_14",egy:"لون",        trans:"loon",          egyPron:"لون",         meaning:"Color",                      sentence:"إيه لونك المفضل؟",       sentTrans:"eih loonak el-mufaddal?",      sentMeaning:"What's your favorite color?",farsi:"رنگ — لون in Farsi!"},
    ],
    batch3:[
      {id:"v9_15",egy:"دايرة",      trans:"daayra",        egyPron:"دايرة",       meaning:"Circle",                     sentence:"ارسمي دايرة يا بيبي",    sentTrans:"ursumi daayra ya baby",        sentMeaning:"Draw a circle, baby",        farsi:"دایره — نفس کلمه!"},
      {id:"v9_16",egy:"مربع",       trans:"murabbe",       egyPron:"مُرَبَّع",    meaning:"Square",                     sentence:"الصندوق مربع",           sentTrans:"el-sanduq murabbe",            sentMeaning:"The box is square",          farsi:"مربع — نفس کلمه!"},
      {id:"v9_17",egy:"مثلث",       trans:"musalles",      egyPron:"مُثَلَّث",    meaning:"Triangle",                   sentence:"ده شكله مثلث",           sentTrans:"da shaklu musalles",           sentMeaning:"This shape is a triangle",   farsi:"مثلث — نفس کلمه!"},
      {id:"v9_18",egy:"طويل",       trans:"tawiil",        egyPron:"طَويل",       meaning:"Tall / long",                sentence:"هو طويل أوي",             sentTrans:"huwwa tawiil awi",             sentMeaning:"He is very tall",            farsi:"بلند"},
      {id:"v9_19",egy:"قصير",       trans:"usayyar",       egyPron:"قُصَيَّر",    meaning:"Short",                      sentence:"هي قصيرة شوية",          sentTrans:"hiyya usayyara shwayya",       sentMeaning:"She is a bit short",         farsi:"کوتاه"},
      {id:"v9_20",egy:"زي بعض",     trans:"zay bad",       egyPron:"زَي بَعض",    meaning:"Same / alike",               sentence:"دول زي بعض",             sentTrans:"dool zay bad",                 sentMeaning:"These are the same",         farsi:"مثل هم"},
    ],
  },
  // ── SESSION 10 EXTRAS ───────────────────────────────────────────────────
  10: {
    batch2:[
      {id:"v10_9", egy:"أرنب",      trans:"arnab",         egyPron:"أرنَب",       meaning:"Rabbit",                     sentence:"الأرنب بيحب الجزر",      sentTrans:"el-arnab biyihibb el-gazar",   sentMeaning:"The rabbit likes carrots",   farsi:"خرگوش"},
      {id:"v10_10",egy:"دب",        trans:"dubb",          egyPron:"دُبّ",        meaning:"Bear",                       sentence:"الدب بيحب العسل",        sentTrans:"el-dubb biyihibb el-asal",     sentMeaning:"The bear likes honey",       farsi:"خرس"},
      {id:"v10_11",egy:"قرد",       trans:"erd",           egyPron:"قِرد",        meaning:"Monkey",                     sentence:"القرد بيلعب",             sentTrans:"el-erd biyilab",               sentMeaning:"The monkey is playing",      farsi:"میمون"},
      {id:"v10_12",egy:"تمساح",     trans:"timsaah",       egyPron:"تِمساح",      meaning:"Crocodile",                  sentence:"التمساح في النيل",        sentTrans:"el-timsaah fi en-neel",        sentMeaning:"The crocodile is in the Nile",farsi:"تمساح — نفس کلمه!"},
      {id:"v10_13",egy:"زرافة",     trans:"zaraafa",       egyPron:"زَرافة",      meaning:"Giraffe",                    sentence:"الزرافة رقبتها طويلة",   sentTrans:"el-zaraafa raqabitha tawiila", sentMeaning:"The giraffe has a long neck",farsi:"زرافه — نفس کلمه!"},
      {id:"v10_14",egy:"حصان",      trans:"husaan",        egyPron:"حُصان",       meaning:"Horse (formal)",             sentence:"الحصان جميل",            sentTrans:"el-husaan gameel",             sentMeaning:"The horse is beautiful",     farsi:"اسب"},
    ],
    batch3:[
      {id:"v10_15",egy:"بقرة",      trans:"ba'ara",        egyPron:"بَقَرة",      meaning:"Cow",                        sentence:"البقرة بتقول مووو",       sentTrans:"el-ba'ara bitool moo",         sentMeaning:"The cow says moo",           farsi:"گاو"},
      {id:"v10_16",egy:"خروف",      trans:"kharoof",       egyPron:"خَروف",       meaning:"Sheep / lamb",               sentence:"الخروف بيقول ماع",       sentTrans:"el-kharoof biyool maah",       sentMeaning:"The sheep says baa",         farsi:"گوسفند"},
      {id:"v10_17",egy:"نمر",       trans:"nimr",          egyPron:"نِمر",        meaning:"Tiger",                      sentence:"النمر سريع أوي",         sentTrans:"el-nimr sariih awi",           sentMeaning:"The tiger is very fast",     farsi:"ببر"},
      {id:"v10_18",egy:"تعبان",     trans:"teabbaan",      egyPron:"تِعبان",      meaning:"Snake",                      sentence:"خايفة من التعبان",        sentTrans:"khaayfa men el-teabbaan",      sentMeaning:"I'm scared of the snake",    farsi:"مار"},
      {id:"v10_19",egy:"فراشة",     trans:"faraasha",      egyPron:"فَراشة",      meaning:"Butterfly",                  sentence:"شوف الفراشة الحلوة",     sentTrans:"shoof el-faraasha el-helwa",   sentMeaning:"Look at the pretty butterfly",farsi:"پروانه"},
      {id:"v10_20",egy:"حيوان",     trans:"hayawaan",      egyPron:"حَيَوان",     meaning:"Animal",                     sentence:"إيه حيوانك المفضل؟",     sentTrans:"eih hayawaanak el-mufaddal?",  sentMeaning:"What's your favorite animal?",farsi:"حیوان — نفس کلمه!"},
    ],
  },
  // ── SESSION 11 EXTRAS ───────────────────────────────────────────────────
  11: {
    batch2:[
      {id:"v11_9", egy:"التليفزيون",trans:"el-tilifiziyoon",egyPron:"التِليفِزيون",meaning:"The TV",                    sentence:"دور التليفزيون",         sentTrans:"dawwar el-tilifiziyoon",       sentMeaning:"Turn on the TV",             farsi:"تلویزیون — نفس کلمه!"},
      {id:"v11_10",egy:"الثلاجة",   trans:"el-tallaaga",   egyPron:"الثَلّاجة",   meaning:"The fridge",                 sentence:"فيه إيه في الثلاجة؟",    sentTrans:"feeh eih fi el-tallaaga?",     sentMeaning:"What's in the fridge?",      farsi:"یخچال"},
      {id:"v11_11",egy:"هدوم",      trans:"hidoom",        egyPron:"هُدوم",       meaning:"Clothes",                    sentence:"الهدوم في الغسالة",      sentTrans:"el-hidoom fi el-ghassaala",    sentMeaning:"The clothes are in the washer",farsi:"لباس"},
      {id:"v11_12",egy:"الغسالة",   trans:"el-ghassaala",  egyPron:"الغَسّالة",   meaning:"Washing machine",            sentence:"ودي الغسالة",            sentTrans:"waddi el-ghassaala",           sentMeaning:"Turn on the washing machine",farsi:"ماشین لباسشویی"},
      {id:"v11_13",egy:"نضيف",      trans:"nadiif",        egyPron:"نَضيف",       meaning:"Clean",                      sentence:"الأوضة نضيفة دلوقتي",    sentTrans:"el-oodah nadifa dilwaqti",     sentMeaning:"The room is clean now",      farsi:"تمیز"},
      {id:"v11_14",egy:"وسخ",       trans:"wisikh",        egyPron:"وِسِخ",       meaning:"Dirty",                      sentence:"الهدوم وسخة",            sentTrans:"el-hidoom wiikha",             sentMeaning:"The clothes are dirty",      farsi:"کثیف"},
    ],
    batch3:[
      {id:"v11_15",egy:"الكنبة",    trans:"el-kanaba",     egyPron:"الكَنَبة",    meaning:"The sofa / couch",           sentence:"البيبي على الكنبة",      sentTrans:"el-baby ala el-kanaba",        sentMeaning:"The baby is on the sofa",    farsi:"کاناپه — نفس کلمه!"},
      {id:"v11_16",egy:"التربيزة",  trans:"el-tarabeeza",  egyPron:"التَرابيزة",  meaning:"The table",                  sentence:"حط ده على التربيزة",     sentTrans:"hatt da ala el-tarabeeza",     sentMeaning:"Put this on the table",      farsi:"میز"},
      {id:"v11_17",egy:"الكرسي",    trans:"el-kursi",      egyPron:"الكُرسي",     meaning:"The chair",                  sentence:"اقعد على الكرسي",        sentTrans:"oqod ala el-kursi",            sentMeaning:"Sit on the chair",           farsi:"کرسی — نفس کلمه!"},
      {id:"v11_18",egy:"حط",        trans:"hatt",          egyPron:"حُط",         meaning:"Put / place",                sentence:"حط البيبي هنا",          sentTrans:"hatt el-baby hena",            sentMeaning:"Put the baby here",          farsi:"بذار"},
      {id:"v11_19",egy:"شيل",       trans:"shiil",         egyPron:"شيل",         meaning:"Pick up / carry",            sentence:"شيل ده من هنا",          sentTrans:"shiil da men hena",            sentMeaning:"Take this away from here",   farsi:"بردار"},
      {id:"v11_20",egy:"لقيتي",     trans:"lawyti",        egyPron:"لقيتي",       meaning:"Did you find? (to woman)",   sentence:"لقيتي المفتاح؟",         sentTrans:"lawyti el-muftaah?",           sentMeaning:"Did you find the key?",      farsi:"پیدا کردی؟"},
    ],
  },
  // ── SESSION 12 EXTRAS ───────────────────────────────────────────────────
  12: {
    batch2:[
      {id:"v12_9", egy:"ناس",       trans:"naas",          egyPron:"ناس",         meaning:"People",                     sentence:"الناس هنا حلوين",        sentTrans:"el-naas hena helwiin",         sentMeaning:"The people here are nice",   farsi:"مردم — ناس in Farsi!"},
      {id:"v12_10",egy:"صغيرة",     trans:"sughayyara",    egyPron:"صُغَيَّرة",   meaning:"Young / small (f)",          sentence:"هي لسه صغيرة",           sentTrans:"hiyya lessa sughayyara",       sentMeaning:"She is still young",         farsi:"کوچولو"},
      {id:"v12_11",egy:"كبير في السن",trans:"kibiir fi el-sinn",egyPron:"كِبير في السِن",meaning:"Old (age)",           sentence:"هو كبير في السن",        sentTrans:"huwwa kibiir fi el-sinn",      sentMeaning:"He is old",                  farsi:"پیر — مسن"},
      {id:"v12_12",egy:"جار / جارة",trans:"gaar / gaara",  egyPron:"جار / جارة",  meaning:"Neighbor (m/f)",             sentence:"الجيران حلوين",          sentTrans:"el-giiraan helwiin",           sentMeaning:"The neighbors are nice",     farsi:"همسایه"},
      {id:"v12_13",egy:"ربنا يحفظهم",trans:"rabbena yehfazhem",egyPron:"رَبِّنا يِحفَظهُم",meaning:"May God protect them",sentence:"الأهل؟ ربنا يحفظهم",    sentTrans:"el-ahl? rabbena yehfazhem",    sentMeaning:"The family? May God protect them",farsi:"خدا حفظشون کنه"},
      {id:"v12_14",egy:"مشتاقة",    trans:"mushtaaqa",     egyPron:"مُشتاقة",     meaning:"Missing someone (woman)",    sentence:"أنا مشتاقة لأمي",        sentTrans:"ana mushtaaqa le-ommi",        sentMeaning:"I miss my mother",           farsi:"دلم تنگ شده"},
    ],
    batch3:[
      {id:"v12_15",egy:"بيشبه",     trans:"biyishbah",     egyPron:"بيِشبَه",     meaning:"He looks like / resembles",  sentence:"البيبي بيشبه أبوه",      sentTrans:"el-baby biyishbah abuuh",      sentMeaning:"The baby looks like his father",farsi:"شبیهه به"},
      {id:"v12_16",egy:"عيلة",      trans:"eela",          egyPron:"عيلة",        meaning:"Family (casual)",            sentence:"ده من العيلة",           sentTrans:"da men el-eela",               sentMeaning:"He's from the family",       farsi:"خانواده"},
      {id:"v12_17",egy:"ولد",       trans:"walad",         egyPron:"وَلَد",       meaning:"Boy / kid",                  sentence:"الولد ده شاطر",          sentTrans:"el-walad da shaatir",          sentMeaning:"This boy is smart",          farsi:"پسر — بچه"},
      {id:"v12_18",egy:"بنت",       trans:"bint",          egyPron:"بِنت",        meaning:"Girl / daughter",            sentence:"البنت دي حلوة",          sentTrans:"el-bint di helwa",             sentMeaning:"This girl is cute",          farsi:"دختر"},
      {id:"v12_19",egy:"شاطرة",     trans:"shaatra",       egyPron:"شاطِرة",      meaning:"Smart / well done (f)",      sentence:"شاطرة يا بنتي!",         sentTrans:"shaatra ya binti!",            sentMeaning:"Well done, my daughter!",    farsi:"باهوش — آفرین"},
      {id:"v12_20",egy:"بيشبهك",    trans:"biyishbahak",   egyPron:"بيِشبَهَك",   meaning:"He looks like you",          sentence:"البيبي بيشبهك أوي",      sentTrans:"el-baby biyishbahak awi",      sentMeaning:"The baby looks so much like you",farsi:"شبیه توئه"},
    ],
  },
  // ── SESSION 13 EXTRAS ───────────────────────────────────────────────────
  13: {
    batch2:[
      {id:"v13_9", egy:"إمبارح",    trans:"imbaariH",      egyPron:"إمبارِح",     meaning:"Yesterday",                  sentence:"إمبارح كان يوم حلو",     sentTrans:"imbaariH kaan yoom helw",      sentMeaning:"Yesterday was a nice day",   farsi:"دیروز"},
      {id:"v13_10",egy:"اليوم ده",  trans:"el-yoom da",    egyPron:"اليوم ده",    meaning:"Today / this day",           sentence:"اليوم ده تقيل",          sentTrans:"el-yoom da taqeel",            sentMeaning:"Today is a hard day",        farsi:"امروز"},
      {id:"v13_11",egy:"الشهر",     trans:"el-shahr",      egyPron:"الشَهر",      meaning:"The month",                  sentence:"الشهر ده مشغول",         sentTrans:"el-shahr da mashghool",        sentMeaning:"This month is busy",         farsi:"ماه"},
      {id:"v13_12",egy:"على طول",   trans:"ala tool",      egyPron:"على طول",     meaning:"Always / all the time",      sentence:"هو على طول بيتكلم",      sentTrans:"huwwa ala tool biyitkallim",   sentMeaning:"He's always talking",        farsi:"همیشه"},
      {id:"v13_13",egy:"أحياناً",   trans:"ahyaanan",      egyPron:"أحياناً",     meaning:"Sometimes",                  sentence:"أحياناً بحس بتعب",       sentTrans:"ahyaanan bahiss bitaab",       sentMeaning:"Sometimes I feel tired",     farsi:"گاهی اوقات"},
      {id:"v13_14",egy:"مشغولة",    trans:"mashghoola",    egyPron:"مَشغولة",     meaning:"Busy (woman)",               sentence:"أنا مشغولة دلوقتي",      sentTrans:"ana mashghoola dilwaqti",      sentMeaning:"I'm busy right now",         farsi:"مشغولم"},
    ],
    batch3:[
      {id:"v13_15",egy:"وقت",       trans:"waqt",          egyPron:"وَقت",        meaning:"Time",                       sentence:"مفيش وقت دلوقتي",        sentTrans:"mafeesh waqt dilwaqti",        sentMeaning:"There's no time right now",  farsi:"وقت — نفس کلمه!"},
      {id:"v13_16",egy:"الساعة كام",trans:"el-saaa kaam",  egyPron:"الساعة كام",  meaning:"What time is it?",           sentence:"الساعة كام دلوقتي؟",     sentTrans:"el-saaa kaam dilwaqti?",       sentMeaning:"What time is it now?",       farsi:"ساعت چنده؟"},
      {id:"v13_17",egy:"متأخر",     trans:"mitaakhkhar",   egyPron:"مِتَأخَّر",   meaning:"Late",                       sentence:"أنا متأخرة شوية",        sentTrans:"ana mitaakhkhara shwayya",     sentMeaning:"I'm a little late",          farsi:"دیر — متأخر in Farsi!"},
      {id:"v13_18",egy:"استني",     trans:"istanni",       egyPron:"اِستَنّي",    meaning:"Wait (to woman)",            sentence:"استني شوية يا بيبي",     sentTrans:"istanni shwayya ya baby",      sentMeaning:"Wait a little, baby",        farsi:"صبر کن"},
      {id:"v13_19",egy:"خلص",       trans:"khilas",        egyPron:"خِلِص",       meaning:"It's done / finished",       sentence:"خلص، يلا ننام",          sentTrans:"khilas, yalla nenaam",         sentMeaning:"Done, let's sleep",          farsi:"تموم شد"},
      {id:"v13_20",egy:"كمان شوية", trans:"kamaan shwayya",egyPron:"كَمان شُوية", meaning:"A little more / just a bit more",sentence:"كمان شوية وخلصنا",    sentTrans:"kamaan shwayya we khalasna",   sentMeaning:"Just a bit more and we're done",farsi:"یه کم دیگه"},
    ],
  },
};

// Build full vocab per session including unlocked batches
// unlockedBatches: { [sessionId]: 1|2|3 } — stored in progress
function getSessionVocab(sessionId, unlockedBatch) {
  const session = SESSIONS.find(s => s.id === sessionId);
  const extra = EXTRA_VOCAB[sessionId];
  const vocab = [...session.vocab]; // batch 1 always
  if (unlockedBatch >= 2) vocab.push(...extra.batch2);
  if (unlockedBatch >= 3) vocab.push(...extra.batch3);
  return vocab;
}

// Check if a batch is ready to unlock based on testProgress
// Returns the batch number the user has unlocked (1, 2, or 3)
function calcUnlockedBatch(sessionId, testProgress) {
  const session = SESSIONS.find(s => s.id === sessionId);
  const extra = EXTRA_VOCAB[sessionId];
  const THRESHOLD = 0.75;

  // Check batch 1 → unlock batch 2?
  const b1ids = session.vocab.map(v => v.id);
  const b1mastered = b1ids.filter(id => {
    const p = testProgress[id];
    return p && (p.correct||0) >= 2 && (p.wrong||0) === 0;
  }).length;
  if (b1mastered / b1ids.length < THRESHOLD) return 1;

  // Check batch 2 → unlock batch 3?
  const b2ids = extra.batch2.map(v => v.id);
  const b2mastered = b2ids.filter(id => {
    const p = testProgress[id];
    return p && (p.correct||0) >= 2 && (p.wrong||0) === 0;
  }).length;
  if (b2mastered / b2ids.length < THRESHOLD) return 2;

  return 3;
}

// ─── GRAMMAR SESSIONS ────────────────────────────────────────────────────────
const GRAMMAR_SESSIONS = [
  {id:"g1",title:"Negation — مش",arabicTitle:"النفي",emoji:"🚫",color:"#E85D5D",type:"grammar",
    explanation:{
      rule:"To say 'not' in Egyptian Arabic, use مش (mesh) before the word. It works for nouns, adjectives, and verbs — much simpler than Fusha!",
      pattern:"مش + [word/verb]",
      examples:[
        {egy:"مش عارفة",trans:"mesh aarfa",meaning:"I don't know (woman)"},
        {egy:"مش كويس",trans:"mesh kwayyes",meaning:"Not good / not well"},
        {egy:"مش دلوقتي",trans:"mesh dilwaqti",meaning:"Not right now"},
        {egy:"مش بحب",trans:"mesh bahibb",meaning:"I don't like"},
        {egy:"مش هروح",trans:"mesh harooh",meaning:"I won't go"},
      ],
      tip:"مش is your best friend! Unlike Fusha which has different negation for different verb types, مش works everywhere in Egyptian Arabic.",
    },
    vocab:[
      {id:"vg1_1",egy:"مش عارفة",trans:"mesh aarfa",egyPron:"مِش عارفة",meaning:"I don't know (woman)",sentence:"مش عارفة فين حطيتيه",sentTrans:"mesh aarfa fein hatteyti",sentMeaning:"I don't know where I put it",farsi:"نمیدونم"},
      {id:"vg1_2",egy:"مش كويس",trans:"mesh kwayyes",egyPron:"مِش كُوَيِّس",meaning:"Not good / not well",sentence:"البيبي مش كويس النهارده",sentTrans:"el-baby mesh kwayyes en-naharda",sentMeaning:"The baby is not well today",farsi:"خوب نیست"},
      {id:"vg1_3",egy:"مش دلوقتي",trans:"mesh dilwaqti",egyPron:"مِش دِلوَقتي",meaning:"Not right now",sentence:"مش دلوقتي، أنا تعبانة",sentTrans:"mesh dilwaqti, ana taabana",sentMeaning:"Not right now, I'm tired",farsi:"الان نه"},
      {id:"vg1_4",egy:"مش بحب",trans:"mesh bahibb",egyPron:"مِش بَحِب",meaning:"I don't like",sentence:"مش بحب الدوشة",sentTrans:"mesh bahibb el-dosha",sentMeaning:"I don't like the noise",farsi:"دوست ندارم"},
      {id:"vg1_5",egy:"مش هروح",trans:"mesh harooh",egyPron:"مِش هَروح",meaning:"I won't go",sentence:"مش هروح النهارده، تعبانة",sentTrans:"mesh harooh en-naharda, taabana",sentMeaning:"I won't go today, I'm tired",farsi:"نمیرم"},
      {id:"vg1_6",egy:"مش فاهمة",trans:"mesh fahma",egyPron:"مِش فاهمة",meaning:"I don't understand (woman)",sentence:"مش فاهمة، قوليلي تاني",sentTrans:"mesh fahma, oollili tani",sentMeaning:"I don't understand, tell me again",farsi:"نمیفهمم"},
      {id:"vg1_7",egy:"مش مشغول",trans:"mesh mashghool",egyPron:"مِش مَشغول",meaning:"Not busy",sentence:"مش مشغول دلوقتي؟",sentTrans:"mesh mashghool dilwaqti?",sentMeaning:"Not busy right now?",farsi:"مشغول نیست"},
      {id:"vg1_8",egy:"مش لازم",trans:"mesh laazim",egyPron:"مِش لازِم",meaning:"Not necessary / don't have to",sentence:"مش لازم، أنا هعمله",sentTrans:"mesh laazim, ana haamiluh",sentMeaning:"No need, I'll do it",farsi:"لازم نیست"},
    ],
  },
  {id:"g2",title:"Present Tense — بـ",arabicTitle:"المضارع",emoji:"⚡",color:"#5B8FA6",type:"grammar",
    explanation:{
      rule:"Egyptian Arabic present tense uses the prefix بـ (b-) before the verb. If you hear a verb starting with بـ, someone is telling you what they do regularly or what's happening now.",
      pattern:"بـ + [verb root]",
      examples:[
        {egy:"بحب",trans:"bahibb",meaning:"I love / I like"},
        {egy:"بروح",trans:"barooh",meaning:"I go"},
        {egy:"بشوف",trans:"bashooof",meaning:"I see / I watch"},
        {egy:"بتكلم",trans:"batkallim",meaning:"I talk / I speak"},
        {egy:"بنام",trans:"banaam",meaning:"I sleep"},
      ],
      tip:"In Fusha: أذهب (azhabu). In Egyptian: بروح (barooh). The بـ prefix is the key marker of Egyptian present tense — you'll hear it constantly.",
    },
    vocab:[
      {id:"vg2_1",egy:"بحب",trans:"bahibb",egyPron:"بَحِب",meaning:"I love / I like",sentence:"بحب العربي المصري",sentTrans:"bahibb el-arabi el-masri",sentMeaning:"I love Egyptian Arabic",farsi:"دوست دارم"},
      {id:"vg2_2",egy:"بروح",trans:"barooh",egyPron:"بَروح",meaning:"I go",sentence:"بروح الشغل كل يوم",sentTrans:"barooh el-shughl kull yoom",sentMeaning:"I go to work every day",farsi:"میرم"},
      {id:"vg2_3",egy:"بشوف",trans:"bashooof",egyPron:"بَشوف",meaning:"I see / I watch",sentence:"بشوف التليفزيون بالليل",sentTrans:"bashooof el-tilifiziyoon bil-leil",sentMeaning:"I watch TV at night",farsi:"میبینم"},
      {id:"vg2_4",egy:"بتكلم",trans:"batkallim",egyPron:"بَتكَلَّم",meaning:"I speak / I talk",sentence:"بتكلم عربي شوية",sentTrans:"batkallim arabi shwayya",sentMeaning:"I speak a little Arabic",farsi:"حرف میزنم"},
      {id:"vg2_5",egy:"بنام",trans:"banaam",egyPron:"بَنام",meaning:"I sleep",sentence:"بنام بدري كل يوم",sentTrans:"banaam badri kull yoom",sentMeaning:"I sleep early every day",farsi:"میخوابم"},
      {id:"vg2_6",egy:"بحاول",trans:"bahaawel",egyPron:"بَحاوِل",meaning:"I try",sentence:"بحاول أتعلم كل يوم",sentTrans:"bahaawel ateaallem kull yoom",sentMeaning:"I try to learn every day",farsi:"تلاش میکنم"},
      {id:"vg2_7",egy:"بفتكر",trans:"baftikir",egyPron:"بَفتِكِر",meaning:"I think / I remember",sentence:"بفتكر فيك طول الوقت",sentTrans:"baftikir fiik tool el-waqt",sentMeaning:"I think of you all the time",farsi:"فکر میکنم"},
      {id:"vg2_8",egy:"بحس",trans:"baHiss",egyPron:"بَحِس",meaning:"I feel",sentence:"بحس إني تعبانة أوي",sentTrans:"baHiss inni taabana awi",sentMeaning:"I feel very tired",farsi:"حس میکنم"},
    ],
  },
  {id:"g3",title:"Future Tense — هـ",arabicTitle:"المستقبل",emoji:"🔮",color:"#7B6FA0",type:"grammar",
    explanation:{
      rule:"To talk about the future in Egyptian Arabic, add هـ (ha-) before the verb. Combine with مش for negative future: مش + هـ + verb = won't.",
      pattern:"هـ + [verb root]",
      examples:[
        {egy:"هروح",trans:"harooh",meaning:"I will go"},
        {egy:"هشوف",trans:"hashooof",meaning:"I will see"},
        {egy:"هنام",trans:"hanaam",meaning:"I will sleep"},
        {egy:"مش هروح",trans:"mesh harooh",meaning:"I won't go"},
        {egy:"هنتكلم",trans:"hanetekallem",meaning:"We will talk"},
      ],
      tip:"بـ = present (now/regularly), هـ = future (will happen). These two prefixes handle most of Egyptian verb tense — much simpler than Fusha!",
    },
    vocab:[
      {id:"vg3_1",egy:"هروح",trans:"harooh",egyPron:"هَروح",meaning:"I will go",sentence:"هروح السوق بعدين",sentTrans:"harooh el-sooq baadein",sentMeaning:"I will go to the market later",farsi:"میرم"},
      {id:"vg3_2",egy:"هشوف",trans:"hashooof",egyPron:"هَشوف",meaning:"I will see / check",sentence:"هشوف وأقولك",sentTrans:"hashooof wa-aoollak",sentMeaning:"I'll check and tell you",farsi:"میبینم"},
      {id:"vg3_3",egy:"هنام",trans:"hanaam",egyPron:"هَنام",meaning:"I will sleep",sentence:"هنام بدري النهارده",sentTrans:"hanaam badri en-naharda",sentMeaning:"I'll sleep early today",farsi:"میخوابم"},
      {id:"vg3_4",egy:"هنتكلم",trans:"hanetekallem",egyPron:"هَنِتكَلَّم",meaning:"We will talk",sentence:"هنتكلم بعدين عن ده",sentTrans:"hanetekallem baadein aan da",sentMeaning:"We'll talk about this later",farsi:"حرف میزنیم"},
      {id:"vg3_5",egy:"هعمل",trans:"haamil",egyPron:"هَعمِل",meaning:"I will do / make",sentence:"هعمل الأكل دلوقتي",sentTrans:"haamil el-akl dilwaqti",sentMeaning:"I'll make the food now",farsi:"انجام میدم"},
      {id:"vg3_6",egy:"هيجي",trans:"heyigi",egyPron:"هَيجي",meaning:"He will come",sentence:"هيجي الساعة كام؟",sentTrans:"heyigi el-saaa kaam?",sentMeaning:"What time will he come?",farsi:"میاد"},
      {id:"vg3_7",egy:"مش هنساك",trans:"mesh hansaak",egyPron:"مِش هَنساك",meaning:"I won't forget you",sentence:"مش هنساك أبداً",sentTrans:"mesh hansaak abadan",sentMeaning:"I'll never forget you",farsi:"فراموشت نمیکنم"},
      {id:"vg3_8",egy:"هنشوفك",trans:"hanshoofak",egyPron:"هَنشوفَك",meaning:"We'll see you",sentence:"هنشوفك إن شاء الله",sentTrans:"hanshoofak inshallah",sentMeaning:"We'll see you, God willing",farsi:"میبینمت"},
    ],
  },
  {id:"g4",title:"Commands",arabicTitle:"الأوامر",emoji:"👆",color:"#C4873A",type:"grammar",
    explanation:{
      rule:"Egyptian commands are direct and short. Masculine (to a man): bare verb. Feminine (to a woman): add ي at the end. Plural (to a group): add وا.",
      pattern:"verb (m) / verb+ي (f) / verb+وا (pl)",
      examples:[
        {egy:"روح / روحي",trans:"rooh / roohi",meaning:"Go! (m/f)"},
        {egy:"تعالى / تعالي",trans:"taala / taali",meaning:"Come! (m/f)"},
        {egy:"قوم / قومي",trans:"qoom / qoomi",meaning:"Get up! (m/f)"},
        {egy:"سيب / سيبي",trans:"seeb / seebi",meaning:"Leave it! (m/f)"},
        {egy:"بص / بصي",trans:"boss / bossi",meaning:"Look! (m/f)"},
      ],
      tip:"Since you're a woman talking to your husband (man), use the masculine form. Talking to your baby? Just use the short form — babies don't care about grammar!",
    },
    vocab:[
      {id:"vg4_1",egy:"تعالى / تعالي",trans:"taala / taali",egyPron:"تَعالى / تَعالي",meaning:"Come here! (m/f)",sentence:"تعالى هنا بقى!",sentTrans:"taala hena baqa!",sentMeaning:"Come here already!",farsi:"بیا"},
      {id:"vg4_2",egy:"قوم / قومي",trans:"qoom / qoomi",egyPron:"قوم / قومي",meaning:"Get up! (m/f)",sentence:"قومي يا حبيبتي، الصبح!",sentTrans:"qoomi ya habibti, el-subh!",sentMeaning:"Get up my love, it's morning!",farsi:"پاشو"},
      {id:"vg4_3",egy:"سيب / سيبي",trans:"seeb / seebi",egyPron:"سيب / سيبي",meaning:"Leave it (m/f)",sentence:"سيب ده مش مهم",sentTrans:"seeb da mesh muhimm",sentMeaning:"Leave it, it doesn't matter",farsi:"ولش کن"},
      {id:"vg4_4",egy:"بص / بصي",trans:"boss / bossi",egyPron:"بُص / بُصي",meaning:"Look! (m/f)",sentence:"بصي على البيبي!",sentTrans:"bossi ala el-baby!",sentMeaning:"Look at the baby!",farsi:"نگاه کن"},
      {id:"vg4_5",egy:"اصبر / اصبري",trans:"esbar / esbari",egyPron:"اِصبَر / اِصبَري",meaning:"Be patient (m/f)",sentence:"اصبري شوية يا حبيبتي",sentTrans:"esbari shwayya ya habibti",sentMeaning:"Be patient a little, my love",farsi:"صبر کن"},
      {id:"vg4_6",egy:"كل / كلي",trans:"kol / koli",egyPron:"كُل / كُلي",meaning:"Eat! (m/f)",sentence:"كلي بقى، الأكل بيبرد",sentTrans:"koli baqa, el-akl beyebrad",sentMeaning:"Eat already, the food is getting cold",farsi:"بخور"},
      {id:"vg4_7",egy:"نام / نامي",trans:"naam / naami",egyPron:"نام / نامي",meaning:"Sleep! (m/f)",sentence:"نامي يا بيبي، يلا",sentTrans:"naami ya baby, yalla",sentMeaning:"Sleep baby, come on",farsi:"بخواب"},
      {id:"vg4_8",egy:"قول / قولي",trans:"ool / ooli",egyPron:"قول / قولي",meaning:"Say / tell (m/f)",sentence:"قوليلي إيه اللي حصل",sentTrans:"oollili eih elli hasal",sentMeaning:"Tell me what happened",farsi:"بگو"},
    ],
  },
  {id:"g5",title:"Questions",arabicTitle:"الأسئلة",emoji:"❓",color:"#5B8A6E",type:"grammar",
    explanation:{
      rule:"Egyptian question words are short and punchy. You can put them at the END of a sentence — very natural in conversation. Rising intonation turns any statement into a yes/no question.",
      pattern:"statement + ؟ OR question word + statement",
      examples:[
        {egy:"فين",trans:"fein",meaning:"Where?"},
        {egy:"إيه",trans:"eih",meaning:"What?"},
        {egy:"مين",trans:"meen",meaning:"Who?"},
        {egy:"إمتى",trans:"emta",meaning:"When?"},
        {egy:"ليه",trans:"leih",meaning:"Why?"},
      ],
      tip:"فين is incredibly useful. فين الموبايل؟ فين الريموت؟ فين جوزي؟ — learn it and use it immediately!",
    },
    vocab:[
      {id:"vg5_1",egy:"فين؟",trans:"fein?",egyPron:"فين؟",meaning:"Where?",sentence:"فين الموبايل بقى؟",sentTrans:"fein el-mobaail baqa?",sentMeaning:"Where is the phone already?",farsi:"کجا؟"},
      {id:"vg5_2",egy:"إيه ده؟",trans:"eih da?",egyPron:"إيه ده؟",meaning:"What is this?",sentence:"إيه ده؟ ده جديد؟",sentTrans:"eih da? da gdeed?",sentMeaning:"What is this? Is it new?",farsi:"این چیه؟"},
      {id:"vg5_3",egy:"مين ده؟",trans:"meen da?",egyPron:"مين ده؟",meaning:"Who is this?",sentence:"مين اللي اتصل؟",sentTrans:"meen elli ittasal?",sentMeaning:"Who called?",farsi:"این کیه؟"},
      {id:"vg5_4",egy:"إمتى؟",trans:"emta?",egyPron:"إِمتى؟",meaning:"When?",sentence:"إمتى هترجع؟",sentTrans:"emta hatergaa?",sentMeaning:"When will you come back?",farsi:"کی؟"},
      {id:"vg5_5",egy:"ليه؟",trans:"leih?",egyPron:"ليه؟",meaning:"Why?",sentence:"ليه بتعمل كده؟",sentTrans:"leih biteaamil keda?",sentMeaning:"Why are you doing this?",farsi:"چرا؟"},
      {id:"vg5_6",egy:"إزيك؟",trans:"izzayyak?",egyPron:"إِزَيَّك؟",meaning:"How are you? (to man)",sentence:"إزيك يا حبيبي؟ كويس؟",sentTrans:"izzayyak ya habibi? kwayyes?",sentMeaning:"How are you my love? Good?",farsi:"چطوری؟"},
      {id:"vg5_7",egy:"بكام؟",trans:"bekaam?",egyPron:"بِكام؟",meaning:"How much?",sentence:"ده بكام؟ غالي أوي!",sentTrans:"da bekaam? ghali awi!",sentMeaning:"How much is this? So expensive!",farsi:"چقدر؟"},
      {id:"vg5_8",egy:"عامل إيه؟",trans:"aamel eih?",egyPron:"عامِل إيه؟",meaning:"How are you doing? (to man)",sentence:"عامل إيه النهارده؟",sentTrans:"aamel eih en-naharda?",sentMeaning:"How are you doing today?",farsi:"حالت چطوره؟"},
    ],
  },
  {id:"g6",title:"Possession — عند / معايا",arabicTitle:"الملكية",emoji:"🤲",color:"#B5734A",type:"grammar",
    explanation:{
      rule:"عند (aand) means 'have' in the sense of ownership. معـ (maa-) means 'have with me/you' — physically on your person right now. مفيش means 'there isn't any'.",
      pattern:"عند + [suffix] OR معـ + [suffix]",
      examples:[
        {egy:"عندي",trans:"aandi",meaning:"I have (own)"},
        {egy:"عندك",trans:"aandak",meaning:"You have (m)"},
        {egy:"معايا",trans:"maaya",meaning:"I have (with me now)"},
        {egy:"معاك",trans:"maak",meaning:"You have (with you now)"},
        {egy:"مفيش",trans:"mafeesh",meaning:"There isn't / I don't have any"},
      ],
      tip:"عندي موبايل = I own a phone. معايا موبايل = I have my phone on me right now. مفيش فلوس = there's no money.",
    },
    vocab:[
      {id:"vg6_1",egy:"عندي",trans:"aandi",egyPron:"عَندي",meaning:"I have",sentence:"عندي سؤال مهم",sentTrans:"aandi soal muhimm",sentMeaning:"I have an important question",farsi:"دارم"},
      {id:"vg6_2",egy:"عندك",trans:"aandak",egyPron:"عَندَك",meaning:"You have (m) / Do you have?",sentence:"عندك وقت دلوقتي؟",sentTrans:"aandak waqt dilwaqti?",sentMeaning:"Do you have time right now?",farsi:"داری؟"},
      {id:"vg6_3",egy:"معايا",trans:"maaya",egyPron:"مَعايا",meaning:"I have (with me)",sentence:"مفيش معايا فلوس دلوقتي",sentTrans:"mafeesh maaya feloos dilwaqti",sentMeaning:"I don't have money on me right now",farsi:"پیشمه"},
      {id:"vg6_4",egy:"معاك",trans:"maak",egyPron:"مَعاك",meaning:"You have (with you)",sentence:"معاك المفتاح؟",sentTrans:"maak el-muftaah?",sentMeaning:"Do you have the key on you?",farsi:"پیشته"},
      {id:"vg6_5",egy:"مفيش",trans:"mafeesh",egyPron:"مَفيش",meaning:"There isn't / none",sentence:"مفيش وقت دلوقتي",sentTrans:"mafeesh waqt dilwaqti",sentMeaning:"There's no time right now",farsi:"نیست — ندارم"},
      {id:"vg6_6",egy:"عنده",trans:"aandu",egyPron:"عَندُه",meaning:"He has",sentence:"عنده اجتماع النهارده",sentTrans:"aandu igtimaa en-naharda",sentMeaning:"He has a meeting today",farsi:"داره"},
      {id:"vg6_7",egy:"عندنا",trans:"aandina",egyPron:"عَندِنا",meaning:"We have",sentence:"عندنا ضيوف الليلة",sentTrans:"aandina duyoof el-leila",sentMeaning:"We have guests tonight",farsi:"داریم"},
      {id:"vg6_8",egy:"مفيش مشكلة",trans:"mafeesh mushkila",egyPron:"مَفيش مُشكِلة",meaning:"No problem",sentence:"مفيش مشكلة، معلش",sentTrans:"mafeesh mushkila, maalesh",sentMeaning:"No problem, never mind",farsi:"مشکلی نیست"},
    ],
  },
  {id:"g7",title:"Past Tense",arabicTitle:"الماضي",emoji:"⏮️",color:"#4A7A9B",type:"grammar",
    explanation:{
      rule:"Past tense uses suffixes added to the verb root. For 'I' (female speaker): add تِ (ti). For 'he': no suffix. For 'she': add ت. Close to Fusha past tense!",
      pattern:"verb root + suffix",
      examples:[
        {egy:"رحتِ",trans:"rohti",meaning:"I went (woman)"},
        {egy:"شفتِ",trans:"shofti",meaning:"I saw (woman)"},
        {egy:"أكلتِ",trans:"akalti",meaning:"I ate (woman)"},
        {egy:"راح",trans:"raah",meaning:"He went"},
        {egy:"رحنا",trans:"rohna",meaning:"We went"},
      ],
      tip:"As a woman, add تِ (ti) to almost any verb for 'I did'. رحتِ، شفتِ، أكلتِ، نمتِ — once you get the pattern, you can make past tense of almost any verb!",
    },
    vocab:[
      {id:"vg7_1",egy:"رحتِ",trans:"rohti",egyPron:"رُحتِ",meaning:"I went (woman)",sentence:"رحتِ السوق إمبارح",sentTrans:"rohti el-sooq imbaariH",sentMeaning:"I went to the market yesterday",farsi:"رفتم"},
      {id:"vg7_2",egy:"شفتِ",trans:"shofti",egyPron:"شُفتِ",meaning:"I saw (woman)",sentence:"شفتِ الفيلم؟ كان حلو؟",sentTrans:"shofti el-film? kaan helw?",sentMeaning:"Did you see the movie? Was it good?",farsi:"دیدم"},
      {id:"vg7_3",egy:"أكلتِ",trans:"akalti",egyPron:"أكَلتِ",meaning:"I ate (woman)",sentence:"أكلتِ؟ لأ، لسه",sentTrans:"akalti? la, lessa",sentMeaning:"Did you eat? No, not yet",farsi:"خوردم"},
      {id:"vg7_4",egy:"نمتِ",trans:"nimti",egyPron:"نِمتِ",meaning:"I slept (woman)",sentence:"نمتِ كويس؟ لأ، البيبي صحّاني",sentTrans:"nimti kwayyes? la, el-baby sahhani",sentMeaning:"Did you sleep well? No, the baby woke me up",farsi:"خوابیدم"},
      {id:"vg7_5",egy:"راح",trans:"raah",egyPron:"راح",meaning:"He went",sentence:"راح الشغل من الصبح",sentTrans:"raah el-shughl min el-subh",sentMeaning:"He went to work since morning",farsi:"رفت"},
      {id:"vg7_6",egy:"رحنا",trans:"rohna",egyPron:"رُحنا",meaning:"We went",sentence:"رحنا المطعم إمبارح",sentTrans:"rohna el-mataam imbaariH",sentMeaning:"We went to the restaurant yesterday",farsi:"رفتیم"},
      {id:"vg7_7",egy:"كان",trans:"kaan",egyPron:"كان",meaning:"He/it was",sentence:"كان حلو أوي!",sentTrans:"kaan helw awi!",sentMeaning:"It was so nice!",farsi:"بود"},
      {id:"vg7_8",egy:"كنتِ",trans:"konti",egyPron:"كُنتِ",meaning:"I was (woman)",sentence:"كنتِ فين طول الوقت ده؟",sentTrans:"konti fein tool el-waqt da?",sentMeaning:"Where have you been all this time?",farsi:"بودم"},
    ],
  },
  {id:"g8",title:"Adjectives m/f",arabicTitle:"الصفات",emoji:"🎭",color:"#9B6BB5",type:"grammar",
    explanation:{
      rule:"Adjectives change based on gender. Feminine adjectives usually add ة (a) at the end. As a woman describing yourself, use the feminine form.",
      pattern:"adjective (m) / adjective+ة (f)",
      examples:[
        {egy:"تعبان / تعبانة",trans:"taabaan / taabana",meaning:"Tired (m/f)"},
        {egy:"مبسوط / مبسوطة",trans:"mabsoot / mabsoota",meaning:"Happy (m/f)"},
        {egy:"جميل / جميلة",trans:"gameel / gameela",meaning:"Beautiful (m/f)"},
        {egy:"كبير / كبيرة",trans:"kibiir / kibiira",meaning:"Big/old (m/f)"},
        {egy:"جديد / جديدة",trans:"gideed / gideeda",meaning:"New (m/f)"},
      ],
      tip:"As a woman talking about yourself: أنا تعبانة، أنا مبسوطة، أنا زعلانة. About your husband: هو تعبان، هو مبسوط. The ة ending marks you as a female speaker!",
    },
    vocab:[
      {id:"vg8_1",egy:"تعبانة",trans:"taabana",egyPron:"تَعبانة",meaning:"Tired (woman)",sentence:"أنا تعبانة أوي النهارده",sentTrans:"ana taabana awi en-naharda",sentMeaning:"I'm very tired today",farsi:"خسته‌ام"},
      {id:"vg8_2",egy:"مبسوطة",trans:"mabsoota",egyPron:"مَبسوطة",meaning:"Happy (woman)",sentence:"أنا مبسوطة جداً",sentTrans:"ana mabsoota giddan",sentMeaning:"I'm very happy",farsi:"خوشحالم"},
      {id:"vg8_3",egy:"زعلانة",trans:"zaalaana",egyPron:"زَعلانة",meaning:"Upset (woman)",sentence:"أنا زعلانة منك شوية",sentTrans:"ana zaalaana minnak shwayya",sentMeaning:"I'm a little upset with you",farsi:"ناراحتم"},
      {id:"vg8_4",egy:"جميلة",trans:"gameela",egyPron:"جَميلة",meaning:"Beautiful (f)",sentence:"إنتِ جميلة أوي يا نينا",sentTrans:"inti gameela awi ya Nina",sentMeaning:"You're so beautiful, Nina",farsi:"زیباست"},
      {id:"vg8_5",egy:"جديدة",trans:"gideeda",egyPron:"جِديدة",meaning:"New (f)",sentence:"دي حاجة جديدة!",sentTrans:"di haaga gideeda!",sentMeaning:"This is something new!",farsi:"جدیده"},
      {id:"vg8_6",egy:"كويسة",trans:"kwayyesa",egyPron:"كُوَيِّسة",meaning:"Good (f)",sentence:"الفكرة دي كويسة أوي",sentTrans:"el-fikra di kwayyesa awi",sentMeaning:"This idea is very good",farsi:"خوبه"},
      {id:"vg8_7",egy:"قلقانة",trans:"alqaana",egyPron:"قَلقانة",meaning:"Worried (woman)",sentence:"أنا قلقانة عليه أوي",sentTrans:"ana alqaana aleiih awi",sentMeaning:"I'm very worried about him",farsi:"نگرانم"},
      {id:"vg8_8",egy:"فرحانة",trans:"farhaana",egyPron:"فَرحانة",meaning:"Happy/excited (woman)",sentence:"أنا فرحانة بيك أوي",sentTrans:"ana farhaana biik awi",sentMeaning:"I'm so happy about you",farsi:"خوشحالم"},
    ],
  },
];

// ─── SITUATION SESSIONS ───────────────────────────────────────────────────────
const SITUATION_SESSIONS = [
  {id:"s1",title:"Video Call with Family",arabicTitle:"كول مع العيلة",emoji:"📱",color:"#E86A8A",type:"situation",
    context:"You're on a video call with your husband's Egyptian family. These are the phrases that will make them love you instantly.",
    vocab:[
      {id:"vs1_1",egy:"نوّرتونا",trans:"nawwartuna",egyPron:"نَوَّرتونا",meaning:"You've brightened our day (to group)",sentence:"نوّرتونا يا عيلة!",sentTrans:"nawwartuna ya eela!",sentMeaning:"You've brightened our day, family!",farsi:"نور آوردید"},
      {id:"vs1_2",egy:"وحشتونا",trans:"wahhashtuna",egyPron:"وَحَّشتونا",meaning:"We missed you all",sentence:"وحشتونا والله!",sentTrans:"wahhashtuna wallah!",sentMeaning:"We really missed you all!",farsi:"دلمون تنگتون شده بود"},
      {id:"vs1_3",egy:"ربنا يحميكم",trans:"rabbena yehmeekum",egyPron:"رَبِّنا يِحميكُم",meaning:"May God protect you all",sentence:"ربنا يحميكم دايماً",sentTrans:"rabbena yehmeekum dayman",sentMeaning:"May God always protect you",farsi:"خدا حفظتون کنه"},
      {id:"vs1_4",egy:"عامل إيه يا عم",trans:"aamel eih ya amm",egyPron:"عامِل إيه يا عَم",meaning:"How are you, uncle?",sentence:"عامل إيه يا عم؟ الصحة كويسة؟",sentTrans:"aamel eih ya amm? el-sihha kwayyesa?",sentMeaning:"How are you, uncle? Is your health good?",farsi:"حالت چطوره عمو؟"},
      {id:"vs1_5",egy:"إنتوا بخير؟",trans:"intu bikheer?",egyPron:"إنتوا بِخير؟",meaning:"Are you all well?",sentence:"إنتوا كلكم بخير إن شاء الله؟",sentTrans:"intu kullukum bikheer inshallah?",sentMeaning:"Are you all well, God willing?",farsi:"همه‌تون خوبین؟"},
      {id:"vs1_6",egy:"شايفينكم قريب",trans:"shayfinkum oreeb",egyPron:"شايفينكُم قَريب",meaning:"We'll see you soon",sentence:"شايفينكم قريب إن شاء الله",sentTrans:"shayfinkum oreeb inshallah",sentMeaning:"We'll see you soon, God willing",farsi:"زود میبینیمتون"},
      {id:"vs1_7",egy:"البيبي بيسلم عليكم",trans:"el-baby bisallim aleikum",egyPron:"البيبي بِيسَلِّم عَليكُم",meaning:"The baby says hi to you all",sentence:"البيبي بيسلم عليكم وبيحبكم",sentTrans:"el-baby bisallim aleikum we-biyihibbkum",sentMeaning:"The baby says hi and loves you all",farsi:"بیبی بهتون سلام میرسونه"},
      {id:"vs1_8",egy:"مشتاقين ليكم",trans:"mushtaqeen leekum",egyPron:"مُشتاقين لِيكُم",meaning:"We miss you all",sentence:"مشتاقين ليكم جداً",sentTrans:"mushtaqeen leekum giddan",sentMeaning:"We miss you all so much",farsi:"دلمون برای همتون تنگه"},
    ],
  },
  {id:"s2",title:"At an Egyptian Restaurant",arabicTitle:"في المطعم",emoji:"🍽️",color:"#C4873A",type:"situation",
    context:"Ordering food, complimenting the cook, asking for things at an Egyptian restaurant.",
    vocab:[
      {id:"vs2_1",egy:"الأكل زاكي جداً",trans:"el-akl zaaki giddan",egyPron:"الأكل زاكي جِداً",meaning:"The food is very delicious",sentence:"والله الأكل زاكي جداً، يسلم إيديك!",sentTrans:"wallah el-akl zaaki giddan, yislem eideik!",sentMeaning:"The food is truly delicious, bless your hands!",farsi:"غذا خیلی خوشمزه‌ست"},
      {id:"vs2_2",egy:"عايزة... من فضلك",trans:"aayza... men fadlak",egyPron:"عايزة... مِن فَضلَك",meaning:"I want... please",sentence:"عايزة كوباية مية من فضلك",sentTrans:"aayza kubbaayet mayya men fadlak",sentMeaning:"I want a glass of water please",farsi:"میخوام... لطفاً"},
      {id:"vs2_3",egy:"إيه اللي بتنصح بيه؟",trans:"eih elli betnasah biih?",egyPron:"إيه اللي بِتنصَح بيه؟",meaning:"What do you recommend?",sentence:"إيه اللي بتنصح بيه النهارده؟",sentTrans:"eih elli betnasah biih en-naharda?",sentMeaning:"What do you recommend today?",farsi:"چی پیشنهاد میدی؟"},
      {id:"vs2_4",egy:"الحساب من فضلك",trans:"el-hisaab men fadlak",egyPron:"الحِساب مِن فَضلَك",meaning:"The bill please",sentence:"لو سمحت، الحساب من فضلك",sentTrans:"law samaht, el-hisaab men fadlak",sentMeaning:"Excuse me, the bill please",farsi:"صورتحساب لطفاً"},
      {id:"vs2_5",egy:"من غير بصل",trans:"min gheir basal",egyPron:"مِن غَير بَصَل",meaning:"Without onions",sentence:"ممكن من غير بصل؟ شكراً",sentTrans:"mumkin min gheir basal? shukran",sentMeaning:"Can it be without onions? Thank you",farsi:"بدون پیاز"},
      {id:"vs2_6",egy:"شبعت، شكراً",trans:"shabaAt, shukran",egyPron:"شَبِعت، شُكراً",meaning:"I'm full, thank you",sentence:"شبعت والله، الأكل كان تحفة",sentTrans:"shabaAt wallah, el-akl kaan tohfa",sentMeaning:"I'm full honestly, the food was amazing",farsi:"سیر شدم، ممنون"},
      {id:"vs2_7",egy:"تحفة",trans:"tohfa",egyPron:"تُحفة",meaning:"Amazing / a gem",sentence:"الكشري ده تحفة أوي!",sentTrans:"el-koshari da tohfa awi!",sentMeaning:"This koshari is absolutely amazing!",farsi:"شاهکاره"},
      {id:"vs2_8",egy:"ممكن كمان؟",trans:"mumkin kamaan?",egyPron:"مُمكِن كَمان؟",meaning:"Can I have more?",sentence:"ممكن كمان خبز من فضلك؟",sentTrans:"mumkin kamaan khubz men fadlak?",sentMeaning:"Can I have more bread please?",farsi:"بیشتر میشه؟"},
    ],
  },
  {id:"s3",title:"When He's on the Phone",arabicTitle:"لما بيتكلم في التليفون",emoji:"📞",color:"#6B9E78",type:"situation",
    context:"Your husband is on a call with family or friends. Asking who it is, getting his attention, or joining in.",
    vocab:[
      {id:"vs3_1",egy:"مين اللي اتصل؟",trans:"meen elli ittasal?",egyPron:"مين اللي اِتَّصَل؟",meaning:"Who called?",sentence:"مين اللي اتصل ده؟",sentTrans:"meen elli ittasal da?",sentMeaning:"Who was that who called?",farsi:"کی زنگ زد؟"},
      {id:"vs3_2",egy:"كلمهم عني",trans:"kallimhum aanni",egyPron:"كَلِّمهُم عَنّي",meaning:"Say hi to them from me",sentence:"كلمهم عني وقولهم سلام",sentTrans:"kallimhum aanni we-oollhum salaam",sentMeaning:"Say hi to them from me and send my regards",farsi:"از طرف من بهشون سلام برسون"},
      {id:"vs3_3",egy:"امتى خلص؟",trans:"emta khilas?",egyPron:"إِمتى خِلِص؟",meaning:"When are you done?",sentence:"امتى خلصت من التليفون؟",sentTrans:"emta khilast min el-tilifoon?",sentMeaning:"When are you done with the phone?",farsi:"کی تموم میشه؟"},
      {id:"vs3_4",egy:"في إيه؟",trans:"fi eih?",egyPron:"في إيه؟",meaning:"What's going on?",sentence:"في إيه؟ كل حاجة تمام؟",sentTrans:"fi eih? kull haaga tamaam?",sentMeaning:"What's going on? Everything okay?",farsi:"چی شده؟"},
      {id:"vs3_5",egy:"سلم عليهم",trans:"sallim aleihum",egyPron:"سَلِّم عَليهُم",meaning:"Send my greetings",sentence:"سلم عليهم وقولهم وحشونا",sentTrans:"sallim aleihum we-oollhum wahhashoona",sentMeaning:"Send my greetings and tell them we miss them",farsi:"بهشون سلام برسون"},
      {id:"vs3_6",egy:"هيجوا إمتى؟",trans:"heyigu emta?",egyPron:"هَيجوا إِمتى؟",meaning:"When will they come?",sentence:"هيجوا إمتى يزوروننا؟",sentTrans:"heyigu emta yezooruuna?",sentMeaning:"When will they come visit us?",farsi:"کی میان؟"},
      {id:"vs3_7",egy:"معاك لحظة؟",trans:"maak lahza?",egyPron:"مَعاك لَحظة؟",meaning:"Do you have a moment?",sentence:"معاك لحظة لما تخلص؟",sentTrans:"maak lahza lamma tkhallas?",sentMeaning:"Do you have a moment when you're done?",farsi:"یه لحظه وقت داری؟"},
      {id:"vs3_8",egy:"أنا بسمعك",trans:"ana basmaaak",egyPron:"أنا بَسمَعَك",meaning:"I'm listening",sentence:"أنا بسمعك، قول",sentTrans:"ana basmaaak, ool",sentMeaning:"I'm listening, go ahead",farsi:"دارم گوش میدم"},
    ],
  },
  {id:"s4",title:"Talking About the Baby",arabicTitle:"الكلام عن البيبي",emoji:"👶",color:"#E8936A",type:"situation",
    context:"Milestones, health, cuteness — all the things new parents talk about constantly, in Egyptian Arabic.",
    vocab:[
      {id:"vs4_1",egy:"عمل حاجة جديدة",trans:"aamil haaga gideeda",egyPron:"عَمِل حاجة جِديدة",meaning:"He/she did something new",sentence:"البيبي عمل حاجة جديدة النهارده!",sentTrans:"el-baby aamil haaga gideeda en-naharda!",sentMeaning:"The baby did something new today!",farsi:"یه کار جدید کرد"},
      {id:"vs4_2",egy:"شاطر / شاطرة",trans:"shaatir / shaatra",egyPron:"شاطِر / شاطِرة",meaning:"Smart / well done (m/f)",sentence:"شاطر يا بيبي، برافو عليك!",sentTrans:"shaatir ya baby, bravo aleik!",sentMeaning:"Well done baby, bravo!",farsi:"آفرین"},
      {id:"vs4_3",egy:"الدنيا وقفت عليه",trans:"el-dunya wa'fat aleih",egyPron:"الدُنيا وَقفَت عَليه",meaning:"He's my whole world",sentence:"والله الدنيا وقفت عليه",sentTrans:"wallah el-dunya wa'fat aleih",sentMeaning:"Honestly he's my whole world",farsi:"دنیام شده"},
      {id:"vs4_4",egy:"بيطلّع سنانه",trans:"biyettalla snanuh",egyPron:"بِيطَلَّع سَنانُه",meaning:"He's teething",sentence:"البيبي بيطلع سنانه وزعلان",sentTrans:"el-baby biyettalla snanuh we-zaalan",sentMeaning:"The baby is teething and cranky",farsi:"دندون درمیاره"},
      {id:"vs4_5",egy:"نام طول الليل",trans:"naam tool el-leil",egyPron:"نام طول الليل",meaning:"Slept through the night",sentence:"البيبي نام طول الليل! يلا!",sentTrans:"el-baby naam tool el-leil! yalla!",sentMeaning:"The baby slept through the night! Yes!",farsi:"تمام شب خوابید"},
      {id:"vs4_6",egy:"حلو قوي",trans:"helw awi",egyPron:"حِلو قَوي",meaning:"So cute / so sweet",sentence:"ده حلو قوي، مش طبيعي!",sentTrans:"da helw awi, mesh tabii!",sentMeaning:"He's so cute, it's unreal!",farsi:"خیلی باناز"},
      {id:"vs4_7",egy:"عامل كويس",trans:"aamel kwayyes",egyPron:"عامِل كُوَيِّس",meaning:"He's doing well",sentence:"عامل كويس والحمد لله",sentTrans:"aamel kwayyes wel-hamdulillah",sentMeaning:"He's doing well, thank God",farsi:"حالش خوبه"},
      {id:"vs4_8",egy:"بيتكلم بقى",trans:"biyitkallim baqa",egyPron:"بِيِتكَلَّم بَقى",meaning:"He's talking now",sentence:"البيبي بيتكلم بقى، ماشاء الله!",sentTrans:"el-baby biyitkallim baqa, mashallah!",sentMeaning:"The baby is talking now, mashallah!",farsi:"داره حرف میزنه"},
    ],
  },
  {id:"s5",title:"Gentle Disagreement",arabicTitle:"الاختلاف بلطف",emoji:"🤝",color:"#7A8FA6",type:"situation",
    context:"Pushing back, expressing a different opinion, or saying no — the Egyptian way: firm but warm.",
    vocab:[
      {id:"vs5_1",egy:"أنا مش شايفة كده",trans:"ana mesh shaayfa keda",egyPron:"أنا مِش شايفة كَده",meaning:"I don't see it that way",sentence:"أنا مش شايفة كده، بس ممكن أسمع رأيك",sentTrans:"ana mesh shaayfa keda, bas mumkin asma raayak",sentMeaning:"I don't see it that way, but I can hear your opinion",farsi:"اینطوری فکر نمیکنم"},
      {id:"vs5_2",egy:"برأيي",trans:"be-raayii",egyPron:"بِرَأيي",meaning:"In my opinion",sentence:"برأيي إحنا لازم نتكلم الأول",sentTrans:"be-raayii ihna laazim nitekallem el-awwal",sentMeaning:"In my opinion we should talk first",farsi:"به نظرم"},
      {id:"vs5_3",egy:"مش موافقة",trans:"mesh muwaafiqa",egyPron:"مِش مُوافِقة",meaning:"I don't agree (woman)",sentence:"أنا مش موافقة على ده",sentTrans:"ana mesh muwaafiqa ala da",sentMeaning:"I don't agree with this",farsi:"موافق نیستم"},
      {id:"vs5_4",egy:"اصبر شوية",trans:"esbar shwayya",egyPron:"اِصبَر شُوية",meaning:"Wait a moment",sentence:"اصبر شوية، خليني أفكر",sentTrans:"esbar shwayya, khallini afakkar",sentMeaning:"Wait a moment, let me think",farsi:"یه لحظه صبر کن"},
      {id:"vs5_5",egy:"ممكن نتكلم؟",trans:"mumkin nitekallem?",egyPron:"مُمكِن نِتكَلَّم؟",meaning:"Can we talk?",sentence:"ممكن نتكلم في الموضوع ده؟",sentTrans:"mumkin nitekallem fi el-mawdoo da?",sentMeaning:"Can we talk about this topic?",farsi:"میتونیم حرف بزنیم؟"},
      {id:"vs5_6",egy:"أنا حاسة إن",trans:"ana Haassa inn",egyPron:"أنا حاسَّة إن",meaning:"I feel that... (woman)",sentence:"أنا حاسة إن ده مش صح",sentTrans:"ana Haassa inn da mesh sahh",sentMeaning:"I feel that this isn't right",farsi:"احساس میکنم که"},
      {id:"vs5_7",egy:"خليني أشرح",trans:"khallini ashraH",egyPron:"خَلِّني أشرَح",meaning:"Let me explain",sentence:"خليني أشرح وجهة نظري",sentTrans:"khallini ashraH wighat nazari",sentMeaning:"Let me explain my point of view",farsi:"بذار توضیح بدم"},
      {id:"vs5_8",egy:"في الآخر إنت اللي تقرر",trans:"fi el-aakher inta elli teqarrar",egyPron:"في الآخِر إنت اللي تِقَرَّر",meaning:"In the end it's your decision",sentence:"في الآخر إنت اللي تقرر، بس رأيي كده",sentTrans:"fi el-aakher inta elli teqarrar, bas raayii keda",sentMeaning:"In the end it's your decision, but my opinion is this",farsi:"آخرش تصمیم با توئه"},
    ],
  },
  {id:"s6",title:"How You're Feeling",arabicTitle:"كيف حالك",emoji:"💆‍♀️",color:"#B5734A",type:"situation",
    context:"Expressing your emotional and physical state — exhausted new-mom to proud wife to overwhelmed human.",
    vocab:[
      {id:"vs6_1",egy:"مش لاقية نفسي",trans:"mesh laaya nafsi",egyPron:"مِش لاقية نَفسي",meaning:"I'm overwhelmed (lit. can't find myself)",sentence:"أنا مش لاقية نفسي من التعب",sentTrans:"ana mesh laaya nafsi min el-taab",sentMeaning:"I'm so exhausted I can't find myself",farsi:"خودمو گم کردم از خستگی"},
      {id:"vs6_2",egy:"محتاجة مساعدة",trans:"muhtaaga musaaada",egyPron:"مُحتاجة مُساعَدة",meaning:"I need help (woman)",sentence:"أنا محتاجة مساعدة دلوقتي",sentTrans:"ana muhtaaga musaaada dilwaqti",sentMeaning:"I need help right now",farsi:"کمک لازم دارم"},
      {id:"vs6_3",egy:"فخورة بيك",trans:"fakhoora biik",egyPron:"فَخورة بيك",meaning:"I'm proud of you (woman to man)",sentence:"أنا فخورة بيك جداً يا حبيبي",sentTrans:"ana fakhoora biik giddan ya habibi",sentMeaning:"I'm so proud of you, my love",farsi:"بهت افتخار میکنم"},
      {id:"vs6_4",egy:"محتاجة لحظة لنفسي",trans:"muhtaaga lahza le-nafsi",egyPron:"مُحتاجة لَحظة لِنَفسي",meaning:"I need a moment to myself",sentence:"محتاجة لحظة لنفسي بس",sentTrans:"muhtaaga lahza le-nafsi bass",sentMeaning:"I just need a moment to myself",farsi:"به یه لحظه برای خودم نیاز دارم"},
      {id:"vs6_5",egy:"أنا بخير، شكراً",trans:"ana bikheer, shukran",egyPron:"أنا بِخير، شُكراً",meaning:"I'm fine, thank you",sentence:"أنا بخير، شكراً إنك سألت",sentTrans:"ana bikheer, shukran innak saalt",sentMeaning:"I'm fine, thanks for asking",farsi:"خوبم، ممنون"},
      {id:"vs6_6",egy:"مبسوطة إني اتعلمت",trans:"mabsoota inni itaallamti",egyPron:"مَبسوطة إني اِتعَلَّمتِ",meaning:"Happy I learned (this)",sentence:"أنا مبسوطة إني اتعلمت عربي",sentTrans:"ana mabsoota inni itaallamti arabi",sentMeaning:"I'm happy I learned Arabic",farsi:"خوشحالم که یاد گرفتم"},
      {id:"vs6_7",egy:"وحيدة شوية",trans:"wahiida shwayya",egyPron:"وَحيدة شُوية",meaning:"A bit lonely",sentence:"بحس إني وحيدة شوية",sentTrans:"baHiss inni wahiida shwayya",sentMeaning:"I feel a little lonely",farsi:"یه کم تنهام"},
      {id:"vs6_8",egy:"ربنا يصبّرني",trans:"rabbena yesabbarni",egyPron:"رَبِّنا يِصَبَّرني",meaning:"May God give me patience",sentence:"ربنا يصبّرني على الدنيا دي!",sentTrans:"rabbena yesabbarni ala el-dunya di!",sentMeaning:"May God give me patience in this world!",farsi:"خدا صبر بده"},
    ],
  },
  {id:"s7",title:"Egyptian Idioms",arabicTitle:"أمثال مصرية",emoji:"🌶️",color:"#E85D5D",type:"situation",
    context:"Expressions Egyptians use all the time that don't translate literally. Using these will make Egyptians light up with delight.",
    vocab:[
      {id:"vs7_1",egy:"على راسي",trans:"ala raasi",egyPron:"على راسي",meaning:"With pleasure / I'd be honored (lit. on my head)",sentence:"تأمر بأي حاجة؟ على راسي!",sentTrans:"taaamur be-ay haaga? ala raasi!",sentMeaning:"Whatever you need, with pleasure!",farsi:"روی چشمم"},
      {id:"vs7_2",egy:"ده راسه تعبان",trans:"da raasu taabaan",egyPron:"ده راسُه تَعبان",meaning:"He's stubborn (lit. his head is tired)",sentence:"آه، ده راسه تعبان أوي!",sentTrans:"aah, da raasu taabaan awi!",sentMeaning:"Ugh, he's being so stubborn!",farsi:"کله‌خره"},
      {id:"vs7_3",egy:"بناكل عيش",trans:"banaakul eish",egyPron:"بِناكُل عيش",meaning:"We're getting by (lit. eating bread)",sentence:"إزيك؟ بناكل عيش والحمد لله",sentTrans:"izzayyak? banaakul eish wel-hamdulillah",sentMeaning:"How are you? We're getting by, thank God",farsi:"نون درمیاریم"},
      {id:"vs7_4",egy:"حلو أوي يا ستي",trans:"helw awi ya setti",egyPron:"حِلو أَوي يا سِتّي",meaning:"How charming, my lady",sentence:"بتتكلمي عربي؟ حلو أوي يا ستي!",sentTrans:"bititkallimi arabi? helw awi ya setti!",sentMeaning:"You speak Arabic? How charming, my lady!",farsi:"آفرین خانم"},
      {id:"vs7_5",egy:"كل سنة وإنت طيب",trans:"kull sana we-inta tayyib",egyPron:"كُل سَنة وإنت طَيِّب",meaning:"Happy birthday / happy occasion",sentence:"كل سنة وإنت طيب يا حبيبي!",sentTrans:"kull sana we-inta tayyib ya habibi!",sentMeaning:"Happy birthday my love!",farsi:"سالت مبارک"},
      {id:"vs7_6",egy:"عين الحسود فيها عود",trans:"ein el-hasood fiha ood",egyPron:"عَين الحَسود فيها عود",meaning:"No evil eye (lit. in the envious eye there's a stick)",sentence:"ماشاء الله على البيبي، عين الحسود فيها عود!",sentTrans:"mashallah ala el-baby, ein el-hasood fiha ood!",sentMeaning:"Mashallah on the baby, no evil eye!",farsi:"چشم حسود کور"},
      {id:"vs7_7",egy:"ربنا يكرمك",trans:"rabbena yekrammak",egyPron:"رَبِّنا يِكرَمَّك",meaning:"May God honor you",sentence:"شكراً جداً! ربنا يكرمك",sentTrans:"shukran giddan! rabbena yekrammak",sentMeaning:"Thank you so much! May God honor you",farsi:"خدا عزیزت کنه"},
      {id:"vs7_8",egy:"إيدك أطول من كده",trans:"eidak atwal min keda",egyPron:"إيدَك أطوَل مِن كَده",meaning:"You can do more (lit. your arm is longer than that)",sentence:"إيدك أطول من كده، إنت قادر!",sentTrans:"eidak atwal min keda, inta qadir!",sentMeaning:"You're capable of more than that!",farsi:"دستت درازتر از اینه"},
    ],
  },
  {id:"s8",title:"Romantic Phrases",arabicTitle:"كلام الحب",emoji:"❤️",color:"#E86A8A",type:"situation",
    context:"What Egyptians say to the people they love. Warm, poetic, deeply felt — these will mean the world to your husband.",
    vocab:[
      {id:"vs8_1",egy:"إنت حياتي",trans:"inta Hayaati",egyPron:"إنت حَياتي",meaning:"You are my life",sentence:"بحبك أوي، إنت حياتي",sentTrans:"bahibbak awi, inta Hayaati",sentMeaning:"I love you so much, you are my life",farsi:"تو زندگیمی"},
      {id:"vs8_2",egy:"أنا بعشقك",trans:"ana baashaqak",egyPron:"أنا بَعشَقَك",meaning:"I adore you / I'm crazy about you",sentence:"أنا بعشقك من أول ما شفتك",sentTrans:"ana baashaqak min awwil ma shoftak",sentMeaning:"I've adored you since the first time I saw you",farsi:"عاشقتم"},
      {id:"vs8_3",egy:"نورت حياتي",trans:"nawwart Hayaati",egyPron:"نَوَّرت حَياتي",meaning:"You've lit up my life",sentence:"من لما جيت في حياتي، نورت حياتي",sentTrans:"min lamma geet fi Hayaati, nawwart Hayaati",sentMeaning:"Since you came into my life, you've lit it up",farsi:"زندگیمو روشن کردی"},
      {id:"vs8_4",egy:"روحي",trans:"rooHi",egyPron:"روحي",meaning:"My soul (term of endearment)",sentence:"تعالى يا روحي، وحشتني",sentTrans:"taala ya rooHi, wahhashtani",sentMeaning:"Come here my soul, I missed you",farsi:"جانم"},
      {id:"vs8_5",egy:"إنت كل حاجة عندي",trans:"inta kull haaga aandi",egyPron:"إنت كُل حاجة عَندي",meaning:"You are everything to me",sentence:"إنت كل حاجة عندي في الدنيا دي",sentTrans:"inta kull haaga aandi fi el-dunya di",sentMeaning:"You are everything to me in this world",farsi:"همه چیزمی"},
      {id:"vs8_6",egy:"ربنا يخليك ليّا",trans:"rabbena yekhalliik liyya",egyPron:"رَبِّنا يِخَلِّيك لِيَّا",meaning:"May God keep you for me",sentence:"ربنا يخليك ليّا دايماً",sentTrans:"rabbena yekhalliik liyya dayman",sentMeaning:"May God always keep you for me",farsi:"خدا برام نگهت داره"},
      {id:"vs8_7",egy:"بتوّجعني لما تبعد",trans:"bitwagga'ni lamma tibed",egyPron:"بِتوَجَّعني لَمّا تِبعَد",meaning:"I ache when you're away",sentence:"بتوّجعني لما تبعد عني",sentTrans:"bitwagga'ni lamma tibed aanni",sentMeaning:"I ache when you're away from me",farsi:"وقتی دوری دلم میگیره"},
      {id:"vs8_8",egy:"وحشتني أوي",trans:"wahhashtani awi",egyPron:"وَحَّشتَني أَوي",meaning:"I missed you so much",sentence:"وحشتني أوي يا حبيبي، فين كنت؟",sentTrans:"wahhashtani awi ya habibi, fein kont?",sentMeaning:"I missed you so much my love, where were you?",farsi:"خیلی دلم تنگت شده بود"},
    ],
  },
];

// ─── ALL VOCAB (includes grammar + situation) ─────────────────────────────────
const ALL_VOCAB = [
  // Regular vocabulary sessions (with batch unlocking)
  ...SESSIONS.flatMap(s => {
    const extra = EXTRA_VOCAB[s.id];
    return [
      ...s.vocab,
      ...extra.batch2,
      ...extra.batch3,
    ].map(v => ({...v, sessionEmoji:s.emoji, sessionColor:s.color, sessionTitle:s.title}));
  }),
  // Grammar sessions (all 8 words available from start)
  ...GRAMMAR_SESSIONS.flatMap(s =>
    s.vocab.map(v => ({...v, sessionEmoji:s.emoji, sessionColor:s.color, sessionTitle:s.title}))
  ),
  // Situation sessions (all 8 words available from start)
  ...SITUATION_SESSIONS.flatMap(s =>
    s.vocab.map(v => ({...v, sessionEmoji:s.emoji, sessionColor:s.color, sessionTitle:s.title}))
  ),
];
const ALL_MEANINGS      = ALL_VOCAB.map(v => v.meaning);
const ALL_SENT_MEANINGS = ALL_VOCAB.map(v => v.sentMeaning);

// ─── SUPABASE CONFIG ──────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY;

// ─── SUPABASE HELPERS ─────────────────────────────────────────────────────────
// All progress is stored as a single JSON blob per user in the "progress" table.
// Row: { user_id: "nina", data: { learnFlags, testProgress, stats }, updated_at: ... }
// We also cache in localStorage for instant load on revisit.

function localGet(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
}
function localSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

async function supabaseFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": options.prefer || "",
    },
    ...options,
  });
  if (!res.ok) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// Load all progress for a user from Supabase
async function loadUserProgress(userId) {
  const rows = await supabaseFetch(
    `progress?user_id=eq.${encodeURIComponent(userId)}&select=data&limit=1`
  );
  if (rows && rows.length > 0) return rows[0].data;
  return null;
}

// Save all progress for a user to Supabase
// Strategy: PATCH existing row, POST if no row exists yet.
async function saveUserProgress(userId, data) {
  localSet("egy_user_id", userId);
  localSet("egy_progress_cache", data);

  if (!userId) return; // safety guard

  const body = JSON.stringify({ data, updated_at: new Date().toISOString() });

  try {
    const patchRes = await fetch(
      `${SUPABASE_URL}/rest/v1/progress?user_id=eq.${encodeURIComponent(userId)}`,
      {
        method: "PATCH",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation",
        },
        body,
      }
    );
    if (patchRes.ok) {
      const patchText = await patchRes.text();
      const patched = patchText ? JSON.parse(patchText) : [];
      if (Array.isArray(patched) && patched.length === 0) {
        // No existing row — insert
        await fetch(`${SUPABASE_URL}/rest/v1/progress`, {
          method: "POST",
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
          },
          body: JSON.stringify({ user_id: userId, data, updated_at: new Date().toISOString() }),
        });
      }
    }
  } catch(e) {
    // Fail silently — local cache still works
  }
}

// ─── TTS ──────────────────────────────────────────────────────────────────────
// ─── AUDIO PLAYBACK ───────────────────────────────────────────────────────────
// Uses pre-generated Egyptian Arabic MP3 files stored in /audio/
// Falls back to browser TTS if file not found

const audioCache = {}; // cache Audio objects to avoid re-fetching
let currentAudio = null;

function getAudioFile(vocabId, type) {
  // type: "word" or "sentence"
  return `/audio/${vocabId}_${type}.mp3`;
}

// Find vocabId from Arabic text by searching ALL_VOCAB
function findVocabId(text) {
  const v = ALL_VOCAB.find(v => v.egy === text || v.sentence === text);
  if (!v) return null;
  if (v.egy === text) return { id: v.id, type: "word" };
  if (v.sentence === text) return { id: v.id, type: "sentence" };
  return null;
}

function playAudio(vocabId, type) {
  const src = getAudioFile(vocabId, type);

  // Stop any currently playing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  if (!audioCache[src]) {
    audioCache[src] = new Audio(src);
  }

  currentAudio = audioCache[src];
  currentAudio.currentTime = 0;
  currentAudio.play().catch(() => {
    // File not found — fall back to browser TTS
    ttsFallback(vocabId === "word" ? text : text);
  });
}

// tts() — main function called throughout the app
// Accepts Arabic text, finds the matching audio file, plays it
function tts(text, rate = 0.82) {
  const match = findVocabId(text);
  if (match) {
    playAudio(match.id, match.type);
  } else {
    ttsFallback(text, rate);
  }
}

// ttsFallback — browser TTS as backup for any text not in our audio library
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
function ttsFallback(text, rate = 0.82) {
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

function SpeakBtn({ text, vocabId, audioType="word", size=18, color="#888" }) {
  const [on, setOn] = useState(false);
  function play() {
    if (vocabId) playAudio(vocabId, audioType);
    else tts(text);
  }
  return (
    <button onClick={() => { setOn(true); play(); setTimeout(() => setOn(false), 1800); }}
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
function LearnQuiz({ sessionVocab, sessionColor, learnFlags, onComplete, fbOpen=false }) {
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
          blocked={fbOpen}
        />
      </div>
    </div>
  );
}

function LearnExCard({ vocab, sessionColor, onResult, blocked=false }) {
  const [chosen, setChosen]     = useState(null);   // selected option
  const [submitted, setSubmitted] = useState(false); // after Submit pressed
  const [options]               = useState(() => wordOptions(vocab.meaning));

  useEffect(() => { playAudio(vocab.id, "word"); }, []);

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

      {/* Two-column button zone — ALWAYS first, never pushed down */}
      <div style={{display:"flex", gap:8, marginTop:14}}>
        <button onClick={submitted ? next : submit}
          disabled={submitted ? blocked : (!chosen||blocked)}
          style={{...X.btn, flex:2, margin:0,
            background: submitted ? (isCorrect?"#28a745":"#5B8FA8") : (chosen&&!blocked?sessionColor:"#ccc"),
            cursor: (submitted||chosen)&&!blocked?"pointer":"not-allowed",
            opacity: (submitted||chosen)&&!blocked?1:0.6}}>
          {submitted ? (isCorrect ? "✓ Next →" : "Next →") : "Submit ✓"}
        </button>
        {submitted ? (
          <div style={{...X.ghostBtn, flex:1, textAlign:"center",
            color: isCorrect?"#28a745":"#dc3545",
            borderColor: isCorrect?"#28a745":"#dc3545",
            fontWeight:"bold", display:"flex", alignItems:"center", justifyContent:"center"}}>
            {isCorrect ? "✅" : "❌"}
          </div>
        ) : (
          <button onClick={() => onResult(null)} disabled={blocked}
            style={{...X.ghostBtn, flex:1}}>
            ⏭ Skip
          </button>
        )}
      </div>

      {/* Reveal — appears BELOW the buttons after submit */}
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
    </div>
  );
}

// ─── TEST EXERCISE CARD (3 types, all 40 words) ───────────────────────────────
function TestExCard({ item, onResult, onBookmark, blocked=false }) {
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
    if (type !== "reverse") playAudio(vocab.id, type === "sentence" ? "sentence" : "word");
  }, []);

  const isCorrect = submitted && chosen === correct;

  function submit() {
    if (!chosen || submitted) return;
    setSubmitted(true);
    // Only for reverse (English→Arabic): play the correct Arabic answer after submit,
    // regardless of whether the user got it right or wrong.
    if (type === "reverse") setTimeout(() => playAudio(vocab.id, "word"), 150);
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
      <div style={{...X.stimulus, cursor:"default"}}>
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

      {/* Two-column button zone — ALWAYS here, never pushed down */}
      <div style={{display:"flex", gap:8, marginTop:14}}>
        <button onClick={submitted ? next : submit}
          disabled={submitted ? blocked : (!chosen||blocked)}
          style={{...X.btn, flex:2, margin:0,
            background: submitted ? (isCorrect?"#28a745":"#5B8FA8") : (chosen&&!blocked?"#7B6FA0":"#ccc"),
            cursor: (submitted||chosen)&&!blocked?"pointer":"not-allowed",
            opacity: (submitted||chosen)&&!blocked?1:0.6}}>
          {submitted ? (isCorrect ? "✓ Next →" : "Next →") : "Submit ✓"}
        </button>
        {submitted ? (
          <div style={{...X.ghostBtn, flex:1, textAlign:"center",
            color: isCorrect?"#28a745":"#dc3545",
            borderColor: isCorrect?"#28a745":"#dc3545",
            fontWeight:"bold", display:"flex", alignItems:"center", justifyContent:"center"}}>
            {isCorrect ? "✅" : "❌"}
          </div>
        ) : (
          <button onClick={() => onResult(null)} disabled={blocked}
            style={{...X.ghostBtn, flex:1}}>⏭ Skip</button>
        )}
      </div>

      {submitted && onBookmark && (
        <button onClick={()=>onBookmark(item.vocabId)}
          style={{width:"100%",marginTop:8,padding:"8px 12px",background:"none",
            border:"1.5px solid #E8936A",borderRadius:10,fontSize:12,
            cursor:"pointer",color:"#E8936A",fontFamily:"inherit",
            display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
          📌 Add to Review for more practice
        </button>
      )}

      {/* Reveal — BELOW buttons, only on wrong answer */}
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
    </div>
  );
}

// ─── TEST SESSION ─────────────────────────────────────────────────────────────
// Builds test queue from only unlocked words, weighted by testProgress.
function buildTestQueue(testProgress, unlockedBatches) {
  // Regular vocabulary sessions (unlocked batches only)
  const regularVocab = SESSIONS.flatMap(s => {
    const ub = (unlockedBatches && unlockedBatches[s.id]) || 1;
    return getSessionVocab(s.id, ub).map(v => ({...v, sessionEmoji:s.emoji, sessionColor:s.color, sessionTitle:s.title}));
  });
  // Grammar + situation sessions (all vocab always available)
  const grammarVocab = GRAMMAR_SESSIONS.flatMap(s =>
    s.vocab.map(v => ({...v, sessionEmoji:s.emoji, sessionColor:s.color, sessionTitle:s.title}))
  );
  const situationVocab = SITUATION_SESSIONS.flatMap(s =>
    s.vocab.map(v => ({...v, sessionEmoji:s.emoji, sessionColor:s.color, sessionTitle:s.title}))
  );
  const unlockedVocab = [...regularVocab, ...grammarVocab, ...situationVocab];

  const types = ["word","sentence","reverse"];
  const weighted = [];
  for (const v of unlockedVocab) {
    const p = testProgress[v.id]||{};
    const w = !p.seen ? 3 : (p.wrong||0)>0 ? Math.min(p.wrong+2,4) : 1;
    for (let i=0;i<w;i++) weighted.push({vocabId:v.id, type:types[i%types.length]});
  }
  const sh = shuffle(weighted);
  const out = [];
  for (const item of sh) {
    if (!out.length||out[out.length-1].vocabId!==item.vocabId) out.push(item);
  }
  return out.slice(0,12);
}

function TestSession({ testProgress, unlockedBatches, onComplete, onBookmark, blocked=false }) {
  const [queue] = useState(() => buildTestQueue(testProgress, unlockedBatches));
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
      <div style={{display:"flex",gap:4,padding:"14px 20px 6px",justifyContent:"center",flexWrap:"wrap"}}>
        {queue.map((_,i)=>(
          <div key={i} style={{width:9,height:9,borderRadius:"50%",flexShrink:0,
            background:i<idx?(results[i]?.correct===true?"#28a745":results[i]?.correct===false?"#dc3545":"#aaa")
                      :i===idx?"#7B6FA0":"#e0e0e0",
            transition:"background 0.3s"}}/>
        ))}
      </div>
      {idx===Math.floor(queue.length/2)&&idx>0&&(
        <div style={{textAlign:"center",fontSize:12,color:"#7B6FA0",fontStyle:"italic",marginBottom:4}}>
          {randomMsg("midSession")}
        </div>
      )}
      <div style={{padding:"0 16px"}}>
        <TestExCard key={`${idx}-${queue[idx].vocabId}-${queue[idx].type}`}
          item={queue[idx]} onResult={handleResult} blocked={blocked}
          onBookmark={onBookmark}/>
      </div>
    </div>
  );
}

// ─── VOCAB CARD (Learn tab) ───────────────────────────────────────────────────
function VocabCard({ v, color, showTrans, learnFlags, testProgress }) {
  const [open,setOpen] = useState(false);
  const flagged = !!learnFlags[v.id];
  const isNew   = !testProgress?.[v.id]?.seen;
  return (
    <div style={{background:"#fff",borderRadius:14,padding:"13px 15px",marginBottom:10,
      boxShadow:"0 2px 8px rgba(0,0,0,0.07)",
      border:`2px solid ${open?color:flagged?"#dc354540":"transparent"}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0}}>
          <SpeakBtn text={v.egy} color={color}/>
          <span style={{fontSize:21,fontWeight:"bold",direction:"rtl"}}>{v.egy}</span>
          {showTrans&&<span style={{fontSize:12,color:"#bbb",fontStyle:"italic",whiteSpace:"nowrap"}}>{v.trans}</span>}
          {isNew    &&<span style={{fontSize:10,background:"#E8936A",color:"#fff",padding:"1px 6px",borderRadius:20,fontWeight:"bold"}}>new</span>}
          {flagged  &&<span style={{fontSize:14,marginLeft:2}} title="Needs review">🚩</span>}
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
  const reviewVocab = ALL_VOCAB.filter(v=>
    (testProgress[v.id]?.wrong||0)>0 || testProgress[v.id]?.bookmarked
  );
  const [openId, setOpenId] = useState(null); // which card is flipped

  if (!reviewVocab.length) return (
    <div style={{padding:32,textAlign:"center"}}>
      <div style={{fontSize:48,marginBottom:12}}>🎉</div>
      <div style={{fontSize:18,fontWeight:"bold",marginBottom:8}}>Your Review list is empty!</div>
      <div style={{fontSize:14,color:"#888",lineHeight:1.7}}>
        Words you get wrong in tests appear here automatically.<br/>
        You can also tap 📌 on any test question to add it manually.
      </div>
    </div>
  );

  function removeFromReview(vocabId) {
    const p = testProgress[vocabId]||{};
    const np = {...p};
    delete np.bookmarked;
    np.wrong = 0;
    onUpdate(vocabId, np);
    setOpenId(null);
  }

  return (
    <div style={{padding:"16px 16px 100px"}}>
      <div style={{fontSize:13,color:"#888",marginBottom:14}}>
        {reviewVocab.length} word{reviewVocab.length!==1?"s":""} · tap to flip · remove when learned
      </div>
      {reviewVocab.map(v => {
        const p = testProgress[v.id]||{};
        const isOpen = openId === v.id;
        const isBookmarked = !!p.bookmarked;
        const wrongCount = p.wrong||0;

        return (
          <div key={v.id}
            style={{background:"#fff",borderRadius:14,marginBottom:10,
              boxShadow:"0 2px 8px rgba(0,0,0,0.07)",overflow:"hidden",
              border:`2px solid ${isOpen?v.sessionColor:"transparent"}`}}>

            {/* Word row — always visible */}
            <div onClick={()=>setOpenId(isOpen?null:v.id)}
              style={{display:"flex",alignItems:"center",gap:10,padding:"14px 16px",cursor:"pointer"}}>
              <button onClick={e=>{e.stopPropagation();playAudio(v.id,"word");}}
                style={{background:"none",border:"none",cursor:"pointer",fontSize:18,
                  color:"#E8936A",flexShrink:0,padding:0,lineHeight:1}}>🔊</button>
              <span style={{fontSize:22,fontWeight:"bold",direction:"rtl",flex:1}}>{v.egy}</span>
              <span style={{fontSize:11,color:isBookmarked?"#E8936A":"#dc3545",flexShrink:0}}>
                {isBookmarked?"📌":`❌ ${wrongCount}`}
              </span>
              <span style={{fontSize:13,color:"#ccc",flexShrink:0}}>{isOpen?"▲":"▼"}</span>
            </div>

            {/* Flipped content */}
            {isOpen && (
              <div style={{padding:"0 16px 16px",borderTop:"1px solid #f0f0f0"}}>
                {/* Pronunciation */}
                <div style={{fontSize:12,color:"#7B6FA0",fontWeight:"bold",marginBottom:2}}>{v.egyPron}</div>
                {showTrans&&<div style={{fontSize:12,color:"#bbb",fontStyle:"italic",marginBottom:8}}>{v.trans}</div>}

                {/* Meaning */}
                <div style={{fontSize:16,fontWeight:"bold",color:v.sessionColor,marginBottom:10}}>{v.meaning}</div>

                {/* Example sentence */}
                <div style={{background:"#FFF8E7",borderRadius:10,padding:"10px 12px",marginBottom:12}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:6,marginBottom:4}}>
                    <button onClick={e=>{e.stopPropagation();playAudio(v.id,"sentence");}}
                      style={{background:"none",border:"none",cursor:"pointer",fontSize:16,
                        color:"#E8936A",flexShrink:0,padding:0,lineHeight:1}}>🔊</button>
                    <div style={{direction:"rtl",fontSize:16,fontWeight:"bold",lineHeight:1.5}}>{v.sentence}</div>
                  </div>
                  {showTrans&&<div style={{fontSize:11,color:"#aaa",fontStyle:"italic",marginBottom:2}}>{v.sentTrans}</div>}
                  <div style={{fontSize:12,color:"#666"}}>{v.sentMeaning}</div>
                </div>

                {v.farsi&&<div style={{background:"#EDE8F5",borderRadius:8,padding:"6px 10px",fontSize:12,color:"#6B4E8A",marginBottom:12}}>🇮🇷 {v.farsi}</div>}

                {/* Remove button */}
                <button onClick={()=>removeFromReview(v.id)}
                  style={{width:"100%",padding:"10px 12px",background:"#d4edda",
                    border:"2px solid #28a745",borderRadius:10,fontSize:13,
                    cursor:"pointer",fontWeight:"bold",color:"#155724",fontFamily:"inherit"}}>
                  ✓ I learned this — remove from Review
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DayLog({ date, sessions, totalSessions }) {
  const [open, setOpen] = useState(false);
  // Format date nicely
  const d = new Date(date + "T12:00:00");
  const dayLabel = d.toLocaleDateString([], {weekday:"short", month:"short", day:"numeric"});

  return (
    <div style={{borderBottom:"1px solid #f5f5f5",paddingBottom:4,marginBottom:4}}>
      <button onClick={()=>setOpen(o=>!o)}
        style={{width:"100%",background:"none",border:"none",cursor:"pointer",
          display:"flex",justifyContent:"space-between",alignItems:"center",
          padding:"7px 0",fontFamily:"inherit"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:13,fontWeight:"bold",color:"#2c2c2c"}}>{dayLabel}</span>
          <span style={{fontSize:11,background:"#f0f0f0",color:"#666",
            padding:"2px 7px",borderRadius:20}}>{totalSessions} session{totalSessions!==1?"s":""}</span>
        </div>
        <span style={{fontSize:12,color:"#bbb"}}>{open?"▲":"▼"}</span>
      </button>
      {open && (
        <div style={{paddingLeft:12,paddingBottom:6}}>
          {sessions.map((s,i) => (
            <div key={i} style={{display:"flex",justifyContent:"space-between",
              padding:"4px 0",fontSize:12,color:"#888",borderTop:"1px solid #f9f9f9"}}>
              <span>{s.time||"--:--"}</span>
              <span>{(s.correct||0)+(s.wrong||0)+(s.skipped||0)} questions</span>
            </div>
          ))}
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
      {(stats.testHistory||[]).length>0&&(()=>{
        // Group sessions by date
        const grouped = {};
        [...(stats.testHistory||[])].reverse().forEach(s => {
          if (!grouped[s.date]) grouped[s.date] = [];
          grouped[s.date].push(s);
        });
        const days = Object.keys(grouped).slice(0,14);
        return (
          <div style={{background:"#fff",borderRadius:14,padding:"14px 16px",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
            <p style={{fontSize:13,fontWeight:"bold",margin:"0 0 10px"}}>📅 Recent Practice</p>
            {days.map(date => {
              const sessions = grouped[date];
              const totalSessions = sessions.length;
              return (
                <DayLog key={date} date={date} sessions={sessions} totalSessions={totalSessions}/>
              );
            })}
          </div>
        );
      })()}
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
  const [userId, setUserId]       = useState(null);   // null = not set yet
  const userIdRef = useRef(null);                       // ref for sync access in callbacks
  const [nameInput, setNameInput] = useState("");     // for the name entry screen
  const [syncing, setSyncing]     = useState(false);  // shows sync indicator
  const [showReminder, setShowReminder] = useState(false); // late-day reminder banner
  const [reminderType, setReminderType] = useState("normal"); // "normal" | "rescue"

  // Feedback widget state — must be at top, before any early returns
  const [fbOpen, setFbOpen]       = useState(false);
  const [fbTag, setFbTag]         = useState(null);
  const [fbText, setFbText]       = useState("");
  const [fbSent, setFbSent]       = useState(false);
  const [fbSending, setFbSending] = useState(false);



  // learnFlags: { [vocabId]: true } — mistakes in Learn tab, managed separately
  const [learnFlags, setLearnFlags] = useState({});
  // testProgress: { [vocabId]: {correct, wrong, seen} } — Test tab performance, feeds Review
  const [testProgress, setTestProgress] = useState({});
  // stats: streak, accuracy, history
  const [stats, setStats] = useState({totalCorrect:0,totalWrong:0,dayStreak:0,lastPracticeDate:null,testHistory:[]});
  const statsRef = useRef({totalCorrect:0,totalWrong:0,dayStreak:0,lastPracticeDate:null,testHistory:[]});
  const [unlockedBatches, setUnlockedBatches] = useState({1:1,2:1,3:1,4:1,5:1,6:1,7:1,8:1,9:1,10:1,11:1,12:1,13:1});

  // Learn tab state
  const [activeLearnSession, setActiveLearnSession] = useState(null);
  const [learnMode, setLearnMode] = useState("browse"); // "browse" | "quiz" | "done"
  const [learnDoneData, setLearnDoneData] = useState(null);
  const [learnSessionKey, setLearnSessionKey] = useState(0); // stable key for LearnQuiz

  // Test tab state
  const [testRunning, setTestRunning] = useState(false);
  const [testSessionKey, setTestSessionKey] = useState(0); // stable key for TestSession
  const sessionStartRef = useRef(null);   // timestamp when session started
  const [resumePrompt, setResumePrompt] = useState(false); // show resume/restart dialog

  // Exit confirmation dialog
  const [exitConfirm, setExitConfirm]   = useState(false);  // show dialog?
  const [exitAction, setExitAction]      = useState(null);   // fn to run if confirmed

  // Helper to apply a progress blob to state

  function applyProgress(data) {
    if (!data) return;
    if (data.learnFlags) setLearnFlags(data.learnFlags);
    if (data.stats) {
      const st = {...data.stats};

      // Migrate old locale-format dates to ISO
      if (st.testHistory) {
        st.testHistory = st.testHistory.map(h => ({
          ...h,
          date: h.date && h.date.match(/^\d{4}-/) ? h.date
              : h.date ? new Date(h.date).toISOString().slice(0,10)
              : null
        })).filter(h => h.date);
      }

      // Recalculate streak — all arithmetic in local time to avoid UTC issues
      const uniqueDays = [...new Set((st.testHistory||[]).map(h=>h.date))]
        .filter(d => d && d.match(/^\d{4}-\d{2}-\d{2}$/))
        .sort((a,b) => b.localeCompare(a));

      function prevDay(dateStr) {
        const [y,m,d] = dateStr.split('-').map(Number);
        const dt = new Date(y, m-1, d); // local constructor — no UTC
        dt.setDate(dt.getDate() - 1);
        return dt.getFullYear() + '-' +
          String(dt.getMonth()+1).padStart(2,'0') + '-' +
          String(dt.getDate()).padStart(2,'0');
      }

      let streak = 0;
      if (uniqueDays.length > 0) {
        const today     = localDateStr();
        const yesterday = prevDay(today);
        let cursor = uniqueDays[0];
        if (cursor === today || cursor === yesterday) {
          streak = 1;
          for (let i = 1; i < uniqueDays.length; i++) {
            if (uniqueDays[i] === prevDay(cursor)) {
              streak++;
              cursor = uniqueDays[i];
            } else {
              break;
            }
          }
        }
      }
      st.dayStreak = streak;
      st.lastPracticeDate = uniqueDays[0] || null;

      setStats(st);
      statsRef.current = st;
    }
    if (data.testProgress) {
      setTestProgress(data.testProgress);
      const ub = {};
      [1,2,3,4,5,6,7,8,9,10,11,12,13].forEach(id => { ub[id] = calcUnlockedBatch(id, data.testProgress); });
      setUnlockedBatches(ub);
    }
  }

  // On mount: check if we have a saved user ID, load their progress
  useEffect(() => {
    async function init() {
      const savedId = localGet("egy_user_id");
      if (savedId) {
        setUserId(savedId);
        userIdRef.current = savedId; // set ref immediately — don't wait for re-render
        // Load from local cache instantly so app feels fast
        const cached = localGet("egy_progress_cache");
        if (cached) applyProgress(cached);
        setLoading(false);
        // Then sync from Supabase in background
        const remote = await loadUserProgress(savedId);
        if (remote) {
          applyProgress(remote);
          localSet("egy_progress_cache", remote);
        }
      } else {
        setLoading(false); // Show name entry screen
      }
    }
    init();
  }, []);

  // Keep refs in sync with state
  useEffect(() => { userIdRef.current = userId; }, [userId]);

  // Push notification setup — request permission once user is logged in
  useEffect(() => {
    if (!userId) return;
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;
    // Request permission if not yet granted
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [userId]);

  // Schedule daily 7pm reminder notification
  useEffect(() => {
    if (!userId) return;
    if (!("Notification" in window)) return;

    function scheduleReminder() {
      const now = new Date();
      const today7pm = new Date();
      today7pm.setHours(19, 0, 0, 0);
      // If already past 7pm today, schedule for tomorrow
      if (now > today7pm) today7pm.setDate(today7pm.getDate() + 1);
      const msUntil = today7pm - now;

      return setTimeout(() => {
        // Check if practiced today
        const todayStr = localDateStr();
        const practiced = (statsRef.current.testHistory||[]).some(h => h.date === todayStr);
        if (!practiced && Notification.permission === "granted") {
          new Notification("يلا! 🔥 Time to practice your Egyptian Arabic", {
            body: "Don't break your streak! Just 5 minutes keeps it alive.",
            icon: "/favicon.ico",
          });
        }
        // Show in-app banner too
        if (!practiced) setShowReminder(true);
        // Reschedule for tomorrow
        scheduleReminder();
      }, msUntil);
    }

    const t = scheduleReminder();
    return () => clearTimeout(t);
  }, [userId]);

  // Re-check reminder whenever stats change (catches case where stats load after mount)
  useEffect(() => {
    statsRef.current = stats;
    if (!userId) return;
    const now = new Date();
    if (now.getHours() >= 19) {
      const todayStr = localDateStr();
      const practiced = (stats.testHistory||[]).some(h => h.date === todayStr);
      if (practiced) setShowReminder(false); // practiced today — hide reminder
      else setShowReminder(true);
    }
  }, [stats, userId]);

  // Session timeout: check when app becomes visible again
  useEffect(() => {
    function onVisible() {
      if (document.visibilityState !== "visible") return;
      if (!sessionStartRef.current) return;
      const isActive = (testRunning) || (tab === "learn" && learnMode === "quiz");
      if (!isActive) return;
      const elapsed = Date.now() - sessionStartRef.current;
      const THIRTY_MIN = 30 * 60 * 1000;
      if (elapsed > THIRTY_MIN) {
        setResumePrompt(true);
      }
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [testRunning, tab, learnMode]);

  // isInSession: true when user is mid-test or mid-practice (not on browse/done screens)
  const isInSession = (testRunning) || (tab === "learn" && learnMode === "quiz");

  // Safe navigate — shows confirm dialog if mid-session, else navigates immediately
  function safeNav(action) {
    if (isInSession) {
      setExitAction(() => action);
      setExitConfirm(true);
    } else {
      action();
    }
  }

  // Called when a test question loads — marks word as seen immediately
  function onBookmarkWord(vocabId) {
    setTestProgress(prev => {
      if (prev[vocabId]?.bookmarked) return prev;
      const updated = { ...prev, [vocabId]: { ...(prev[vocabId]||{correct:0,wrong:0,seen:true}), bookmarked:true } };
      const snap = { learnFlags, testProgress: updated, stats };
      localSet("egy_progress_cache", snap);
      saveUserProgress(userIdRef.current, snap);
      return updated;
    });
  }

  function onWordSeen(vocabId) {
    setTestProgress(prev => {
      if (prev[vocabId]?.seen) return prev;
      const updated = { ...prev, [vocabId]: { ...(prev[vocabId]||{correct:0,wrong:0}), seen:true } };
      const snap = { learnFlags, testProgress: updated, stats };
      localSet("egy_progress_cache", snap);
      saveUserProgress(userIdRef.current, snap);
      return updated;
    });
  }

  // Save helpers — each takes its own new value + reads latest others from state ref
  // We pass all three explicitly to avoid stale closure issues with async React state
  function saveLearnFlags(flags) {
    setLearnFlags(flags);
    const snap = { learnFlags: flags, testProgress, stats };
    localSet("egy_progress_cache", snap);
    saveUserProgress(userIdRef.current, snap);
  }

  function saveTestProgress(tp) {
    setTestProgress(tp);
    const snap = { learnFlags, testProgress: tp, stats };
    localSet("egy_progress_cache", snap);
    saveUserProgress(userIdRef.current, snap);
  }

  function saveStats(st) {
    setStats(st);
    const snap = { learnFlags, testProgress, stats: st };
    localSet("egy_progress_cache", snap);
    saveUserProgress(userIdRef.current, snap);
  }

  // Called when a Learn quiz session ends
  function onLearnComplete(results) {
    const newFlags = {...learnFlags};
    for (const r of results) {
      if (r.correct === null) continue;
      if (r.correct === true) delete newFlags[r.id];
      else newFlags[r.id] = true;
    }
    setLearnFlags(newFlags);
    // Atomic save — all fresh values
    const snap = { learnFlags: newFlags, testProgress, stats };
    localSet("egy_progress_cache", snap);
    saveUserProgress(userIdRef.current, snap);
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
    setTestProgress(newTP);

    // Recompute which batches are now unlocked based on new progress
    const newUB = {};
    [1,2,3,4,5,6,7,8,9,10,11,12,13].forEach(id => { newUB[id] = calcUnlockedBatch(id, newTP); });
    setUnlockedBatches(newUB);

    // Update stats
    const correct = resArr.filter(r=>r.correct===true).length;
    const wrong   = resArr.filter(r=>r.correct===false).length;
    const skipped = resArr.filter(r=>r.correct===null).length;
    const now     = new Date();
    const today   = localDateStr(now);
    const time    = now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
    const currentStats = statsRef.current; // use ref — always current, no stale closure
    const last    = currentStats.lastPracticeDate;
    const yesterday = localDateStr(new Date(Date.now()-86400000));
    const newStreak = last===today?currentStats.dayStreak:last===yesterday?(currentStats.dayStreak||0)+1:1;
    const newStats = {
      totalCorrect:(currentStats.totalCorrect||0)+correct,
      totalWrong:(currentStats.totalWrong||0)+wrong,
      dayStreak:newStreak,
      lastPracticeDate:today,
      testHistory:[...(stats.testHistory||[]),{date:today,time,correct,wrong,skipped}].slice(-30),
    };
    setStats(newStats);
    statsRef.current = newStats; // update ref immediately

    // Single atomic save — all fresh values together, no stale state
    const snap = { learnFlags, testProgress: newTP, stats: newStats };
    localSet("egy_progress_cache", snap);
    saveUserProgress(userIdRef.current, snap);

    setTestRunning(false);
    setShowReminder(false); // practiced today — hide reminder
  }

  // Update testProgress from Review tab
  function onReviewUpdate(vocabId, newP) {
    setTestProgress(prev => {
      const updated = {...prev,[vocabId]:newP};
      const snap = { learnFlags, testProgress: updated, stats };
      localSet("egy_progress_cache", snap);
      saveUserProgress(userIdRef.current, snap);
      return updated;
    });
  }

  if (loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",
      fontFamily:"Georgia,serif",flexDirection:"column",gap:12,color:"#aaa"}}>
      <div style={{fontSize:36}}>مصري</div>
      <div style={{fontSize:14}}>Loading your progress...</div>
    </div>
  );

  // Name entry handler — must be defined outside the conditional render
  async function handleStart() {
    const name = nameInput.trim().toLowerCase().replace(/\s+/g, "_");
    if (!name) return;
    setSyncing(true);
    const existing = await loadUserProgress(name);
    if (existing) {
      applyProgress(existing);
    } else {
      // New user — save initial empty row so they appear in the db
      const initial = { learnFlags:{}, testProgress:{}, stats:{totalCorrect:0,totalWrong:0,dayStreak:0,lastPracticeDate:null,testHistory:[]} };
      await saveUserProgress(name, initial);
    }
    localSet("egy_user_id", name);
    localSet("egy_progress_cache", existing || {});
    userIdRef.current = name;
    setUserId(name);
    setSyncing(false);
  }

  // Name entry screen — shown on first ever open
  if (!userId) {
    return (
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",
        fontFamily:"Georgia,serif",flexDirection:"column",padding:"32px 24px",background:"#FAFAF8"}}>
        <div style={{fontSize:52,marginBottom:8}}>مصري</div>
        <div style={{fontSize:22,fontWeight:"bold",color:"#2c2c2c",marginBottom:6}}>Egyptian Arabic</div>
        <div style={{fontSize:14,color:"#aaa",marginBottom:40}}>speak · listen · grow 👶</div>

        <div style={{background:"#fff",borderRadius:20,padding:"28px 24px",width:"100%",maxWidth:360,
          boxShadow:"0 4px 24px rgba(0,0,0,0.08)"}}>
          <p style={{fontSize:16,fontWeight:"bold",color:"#2c2c2c",marginBottom:6}}>What's your name?</p>
          <p style={{fontSize:13,color:"#888",lineHeight:1.6,marginBottom:20}}>
            This is how your progress is saved. Use the same name on any device to pick up where you left off.
          </p>
          <input
            type="text"
            placeholder="e.g. Nina"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleStart()}
            style={{width:"100%",padding:"13px 16px",fontSize:16,border:"2px solid #e0e0e0",
              borderRadius:12,fontFamily:"Georgia,serif",marginBottom:14,outline:"none",
              boxSizing:"border-box"}}
            autoFocus
          />
          <button onClick={handleStart} disabled={!nameInput.trim() || syncing}
            style={{width:"100%",padding:14,background:nameInput.trim()?"#E8936A":"#ccc",
              color:"#fff",border:"none",borderRadius:12,fontSize:16,fontWeight:"bold",
              cursor:nameInput.trim()?"pointer":"not-allowed",fontFamily:"Georgia,serif"}}>
            {syncing ? "Loading..." : "Let's go! →"}
          </button>
        </div>
        <p style={{fontSize:11,color:"#ccc",marginTop:20,textAlign:"center"}}>
          Your name is stored privately. No password needed.
        </p>
      </div>
    );
  }

  const learnFlagCount = Object.keys(learnFlags).length;
  const reviewCount    = ALL_VOCAB.filter(v=>(testProgress[v.id]?.wrong||0)>0||testProgress[v.id]?.bookmarked).length;

  // ── FEEDBACK WIDGET STATE (moved to top) ──

  // Determine current context for feedback
  function getFbContext() {
    if (tab === "learn") {
      if (activeLearnSession && learnMode === "quiz")  return `Learn > ${activeLearnSession.title} > Quiz`;
      if (activeLearnSession && learnMode === "done")  return `Learn > ${activeLearnSession.title} > Results`;
      if (activeLearnSession)                           return `Learn > ${activeLearnSession.title}`;
      return "Learn > Session List";
    }
    if (tab === "test")     return testRunning ? "Test > Running" : "Test > Home";
    if (tab === "review")   return "Review > Flashcards";
    if (tab === "progress") return "Progress";
    return "Unknown";
  }

  async function submitFeedback() {
    if (!fbText.trim() && !fbTag) return;
    setFbSending(true);
    try {
      await supabaseFetch("feedback", {
        method: "POST",
        prefer: "return=minimal",
        body: JSON.stringify({
          user_id:   userId,
          page:      getFbContext(),
          tag:       fbTag || "General",
          note:      fbText.trim(),
          app_state: {
            tab, learnMode,
            session: activeLearnSession?.title || null,
            testRunning,
            learnFlagCount,
            reviewCount,
            unlockedBatches,
          },
          created_at: new Date().toISOString(),
        }),
      });
      setFbSent(true);
      setTimeout(() => { setFbOpen(false); setFbTag(null); setFbText(""); setFbSent(false); }, 1800);
    } catch(e) {
      setFbSent(false);
    }
    setFbSending(false);
  }

  // Plan items: { id, label, status: "pending"|"done"|"issue", note }



  return (
    <div style={A.wrap}
      onKeyDown={fbOpen ? e => e.stopPropagation() : undefined}
      onKeyUp={fbOpen ? e => e.stopPropagation() : undefined}>
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
          <div style={{fontSize:11,color:"#555",fontStyle:"italic"}}>
            {syncing ? "⏳" : "✓"} {userId}
          </div>
          <div style={A.pill} title={(stats.dayStreak||0)>1?randomMsg('streak',{n:stats.dayStreak}):""}>
            🔥{stats.dayStreak||0}
          </div>
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
                <strong>How to use Learn:</strong> Read each word, tap ▼ to expand the example sentence, then tap <em>Practice these words</em> to quiz yourself. Words you get wrong get a 🚩 — they'll be prioritized next time.
              </p>

              {/* ── GROUP 1: VOCABULARY ── */}
              <p style={A.secLabel}>📚 Vocabulary</p>
              {SESSIONS.map(s=>{
                const ub = unlockedBatches[s.id] || 1;
                const currentVocab = getSessionVocab(s.id, ub);
                const totalAvailable = getSessionVocab(s.id, 3).length;
                const flagged = currentVocab.filter(v=>learnFlags[v.id]).length;
                const newCount = currentVocab.filter(v=>!testProgress[v.id]?.seen).length;
                return (
                  <div key={s.id} onClick={()=>{setActiveLearnSession(s);setLearnMode("browse");setLearnDoneData(null);}}
                    style={{...A.row,borderLeft:`5px solid ${s.color}`}}>
                    <span style={{fontSize:26}}>{s.emoji}</span>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:6}}>
                        <span style={{fontWeight:"bold",fontSize:15}}>{s.title}</span>
                        <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
                          {newCount>0&&<span style={{fontSize:10,background:"#E8936A",color:"#fff",padding:"2px 7px",borderRadius:20,fontWeight:"bold"}}>{newCount} new</span>}
                          {flagged>0&&<span style={{fontSize:12,color:"#dc3545"}}>🚩 {flagged}</span>}
                        </div>
                      </div>
                      <div style={{fontSize:12,color:"#aaa",marginTop:2}}>
                        {currentVocab.length} words{ub < 3 ? ` · 🔒 ${totalAvailable - currentVocab.length} more to unlock` : " · ✓ all unlocked"}
                      </div>
                    </div>
                    <span style={{color:"#ccc",fontSize:20}}>›</span>
                  </div>
                );
              })}

              {/* ── GROUP 2: GRAMMAR PATTERNS ── */}
              <p style={{...A.secLabel, marginTop:20}}>🧠 Grammar Patterns</p>
              <p style={{fontSize:12,color:"#888",marginBottom:10,paddingLeft:4}}>
                Learn the rules, then practice applying them.
              </p>
              {GRAMMAR_SESSIONS.map(s=>{
                const newCount = s.vocab.filter(v=>!testProgress[v.id]?.seen).length;
                return (
                  <div key={s.id} onClick={()=>{setActiveLearnSession(s);setLearnMode("browse");setLearnDoneData(null);}}
                    style={{...A.row,borderLeft:`5px solid ${s.color}`}}>
                    <span style={{fontSize:26}}>{s.emoji}</span>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:6}}>
                        <span style={{fontWeight:"bold",fontSize:15}}>{s.title}</span>
                        <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
                          {newCount>0&&<span style={{fontSize:10,background:"#E8936A",color:"#fff",padding:"2px 7px",borderRadius:20,fontWeight:"bold"}}>{newCount} new</span>}
                        </div>
                      </div>
                      <div style={{fontSize:12,color:"#aaa",marginTop:2}}>
                        8 phrases · {s.arabicTitle}
                      </div>
                    </div>
                    <span style={{color:"#ccc",fontSize:20}}>›</span>
                  </div>
                );
              })}

              {/* ── GROUP 3: SITUATIONS ── */}
              <p style={{...A.secLabel, marginTop:20}}>🎭 Real Situations</p>
              <p style={{fontSize:12,color:"#888",marginBottom:10,paddingLeft:4}}>
                Phrases for real Egyptian life moments.
              </p>
              {SITUATION_SESSIONS.map(s=>{
                const newCount = s.vocab.filter(v=>!testProgress[v.id]?.seen).length;
                return (
                  <div key={s.id} onClick={()=>{setActiveLearnSession(s);setLearnMode("browse");setLearnDoneData(null);}}
                    style={{...A.row,borderLeft:`5px solid ${s.color}`}}>
                    <span style={{fontSize:26}}>{s.emoji}</span>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:6}}>
                        <span style={{fontWeight:"bold",fontSize:15}}>{s.title}</span>
                        <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
                          {newCount>0&&<span style={{fontSize:10,background:"#E8936A",color:"#fff",padding:"2px 7px",borderRadius:20,fontWeight:"bold"}}>{newCount} new</span>}
                        </div>
                      </div>
                      <div style={{fontSize:12,color:"#aaa",marginTop:2}}>
                        8 phrases · {s.arabicTitle}
                      </div>
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

                {/* Grammar explanation card */}
                {activeLearnSession.type === "grammar" && activeLearnSession.explanation && (
                  <div style={{background:"#fff",borderRadius:14,padding:"16px",marginBottom:14,
                    boxShadow:"0 2px 8px rgba(0,0,0,0.08)",border:`2px solid ${activeLearnSession.color}40`}}>
                    <div style={{fontSize:12,color:activeLearnSession.color,fontWeight:"bold",
                      textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>
                      📐 The Rule
                    </div>
                    <p style={{fontSize:13,color:"#444",lineHeight:1.7,marginBottom:12}}>
                      {activeLearnSession.explanation.rule}
                    </p>
                    <div style={{background:"#f5f5f5",borderRadius:10,padding:"10px 12px",marginBottom:12}}>
                      <div style={{fontSize:11,color:"#888",marginBottom:4}}>Pattern:</div>
                      <div style={{fontSize:15,fontWeight:"bold",color:"#333",direction:"rtl"}}>
                        {activeLearnSession.explanation.pattern}
                      </div>
                    </div>
                    <div style={{fontSize:12,color:"#888",marginBottom:6}}>Quick examples:</div>
                    {activeLearnSession.explanation.examples.map((ex,i) => (
                      <div key={i} style={{display:"flex",justifyContent:"space-between",
                        padding:"5px 0",borderBottom:"1px solid #f0f0f0",fontSize:13}}>
                        <span style={{fontWeight:"bold",direction:"rtl"}}>{ex.egy}</span>
                        <span style={{color:"#888",fontSize:12}}>{ex.meaning}</span>
                      </div>
                    ))}
                    <div style={{marginTop:10,background:"#FFF8E7",borderRadius:8,padding:"8px 10px",
                      fontSize:12,color:"#856404",lineHeight:1.6}}>
                      💡 {activeLearnSession.explanation.tip}
                    </div>
                  </div>
                )}

                {/* Situation context banner */}
                {activeLearnSession.type === "situation" && activeLearnSession.context && (
                  <div style={{background:"#FFF8E7",borderRadius:10,padding:"10px 14px",
                    marginBottom:14,fontSize:13,color:"#666",lineHeight:1.7,
                    borderLeft:`4px solid ${activeLearnSession.color}`}}>
                    🎭 {activeLearnSession.context}
                  </div>
                )}

                {/* Regular tip for vocabulary sessions */}
                {!activeLearnSession.type && activeLearnSession.tip && (
                  <div style={{background:"#FFF8E7",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:13,color:"#666",lineHeight:1.7}}>
                    {activeLearnSession.tip}
                  </div>
                )}

                {/* Word cards — grammar/situation sessions show all vocab, regular shows unlocked batches */}
                {(activeLearnSession.type === "grammar" || activeLearnSession.type === "situation"
                  ? activeLearnSession.vocab
                  : getSessionVocab(activeLearnSession.id, unlockedBatches[activeLearnSession.id])
                ).map((v,i)=>(
                  <VocabCard key={i} v={v} color={activeLearnSession.color} showTrans={showTrans} learnFlags={learnFlags} testProgress={testProgress}/>
                ))}

                <button onClick={()=>{ setLearnMode("quiz"); setLearnSessionKey(k=>k+1); sessionStartRef.current=Date.now(); setShowReminder(false); }}
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
                <button style={A.backBtn} onClick={()=>safeNav(()=>setLearnMode("browse"))}>← Words</button>
                <span style={{flex:1,textAlign:"center",fontSize:14,color:"rgba(255,255,255,0.9)"}}>
                  Practicing: {activeLearnSession.emoji} {activeLearnSession.title}
                </span>
                <div style={{width:60}}/>
              </div>
              <LearnQuiz
                key={activeLearnSession.id+"-"+learnSessionKey}
                sessionVocab={
                  (activeLearnSession.type === "grammar" || activeLearnSession.type === "situation")
                    ? activeLearnSession.vocab
                    : getSessionVocab(activeLearnSession.id, unlockedBatches[activeLearnSession.id])
                }
                sessionColor={activeLearnSession.color}
                learnFlags={learnFlags}
                fbOpen={fbOpen}
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
                  Tests your <strong>unlocked words</strong> — 3 question types mixed.
                  Master words to unlock the next batch in each session.
                  Wrong answers go to <strong>Review</strong>.
                </div>
                <div style={{background:"#fff",borderRadius:10,padding:"10px 12px",marginBottom:14}}>
                  <p style={{fontSize:11,fontWeight:"bold",color:"#aaa",margin:"0 0 8px",textTransform:"uppercase",letterSpacing:1}}>Batch Unlock Progress</p>
                  {SESSIONS.map(s => {
                    const ub = unlockedBatches[s.id] || 1;
                    const current = getSessionVocab(s.id, ub).length;
                    const total = getSessionVocab(s.id, 3).length;
                    return (
                      <div key={s.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                        <span style={{fontSize:15}}>{s.emoji}</span>
                        <div style={{flex:1}}>
                          <div style={{background:"#f0f0f0",borderRadius:4,height:6,overflow:"hidden"}}>
                            <div style={{background:s.color,height:"100%",width:`${(current/total)*100}%`,transition:"width 0.5s"}}/>
                          </div>
                        </div>
                        <span style={{fontSize:11,color:"#555",whiteSpace:"nowrap"}}>{current}/{total}</span>
                        <span style={{fontSize:11,whiteSpace:"nowrap",color:ub===3?"#28a745":"#bbb"}}>{ub===3?"✓ all":"🔒 batch "+ub}</span>
                      </div>
                    );
                  })}
                </div>
                <button onClick={()=>{ setTestRunning(true); setTestSessionKey(k=>k+1); sessionStartRef.current=Date.now(); }} style={{...A.bigBtn,background:"#7B6FA0"}}>
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
                <button style={A.backBtn} onClick={()=>safeNav(()=>setTestRunning(false))}>← Back</button>
                <span style={{flex:1,textAlign:"center",fontSize:14,color:"rgba(255,255,255,0.9)"}}>🧪 Mixed Test</span>
                <div style={{width:60}}/>
              </div>
              <TestSession
                key={"test-"+testSessionKey}
                testProgress={testProgress}
                unlockedBatches={unlockedBatches}
                onComplete={onTestComplete}
                onBookmark={onBookmarkWord}
                blocked={fbOpen}
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

      {/* ── FLOATING FEEDBACK BUTTON ── */}
      {/* ── RESUME PROMPT DIALOG (shown after 30+ min away) ── */}
      {resumePrompt && (
        <div style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.6)",
          display:"flex",alignItems:"center",justifyContent:"center",padding:"0 24px"}}>
          <div style={{background:"#fff",borderRadius:20,padding:"28px 24px",width:"100%",maxWidth:360,textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:12}}>😴</div>
            <div style={{fontSize:18,fontWeight:"bold",marginBottom:8,color:"#2c2c2c"}}>Welcome back!</div>
            <div style={{fontSize:14,color:"#666",lineHeight:1.6,marginBottom:24}}>
              You were away for a while.<br/>
              Want to continue where you left off, or start fresh?
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>{
                  setResumePrompt(false);
                  // Start fresh
                  if (testRunning) { setTestRunning(false); setTestRunning(true); setTestSessionKey(k=>k+1); }
                  if (learnMode==="quiz") { setLearnMode("browse"); }
                  sessionStartRef.current = Date.now();
                }}
                style={{flex:1,padding:13,background:"#f0f0f0",border:"none",borderRadius:12,
                  fontSize:14,cursor:"pointer",fontFamily:"inherit",fontWeight:"bold",color:"#555"}}>
                Start fresh
              </button>
              <button onClick={()=>{ setResumePrompt(false); sessionStartRef.current=Date.now(); }}
                style={{flex:1,padding:13,background:"#7B6FA0",border:"none",borderRadius:12,
                  fontSize:14,cursor:"pointer",fontFamily:"inherit",fontWeight:"bold",color:"#fff"}}>
                Continue ←
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EXIT CONFIRMATION DIALOG ── */}
      {exitConfirm && (
        <div style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.6)",
          display:"flex",alignItems:"center",justifyContent:"center",padding:"0 24px"}}>
          <div style={{background:"#fff",borderRadius:20,padding:"28px 24px",width:"100%",maxWidth:360,textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:12}}>⚠️</div>
            <div style={{fontSize:18,fontWeight:"bold",marginBottom:8,color:"#2c2c2c"}}>Exit session?</div>
            <div style={{fontSize:14,color:"#666",lineHeight:1.6,marginBottom:24}}>
              Words you've already answered will be saved.<br/>
              This session won't count toward your progress.
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setExitConfirm(false)}
                style={{flex:1,padding:13,background:"#f0f0f0",border:"none",borderRadius:12,
                  fontSize:15,cursor:"pointer",fontFamily:"inherit",fontWeight:"bold",color:"#555"}}>
                Keep going
              </button>
              <button onClick={()=>{
                  setExitConfirm(false);
                  if (exitAction) { exitAction(); setExitAction(null); }
                }}
                style={{flex:1,padding:13,background:"#dc3545",border:"none",borderRadius:12,
                  fontSize:15,cursor:"pointer",fontFamily:"inherit",fontWeight:"bold",color:"#fff"}}>
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {!fbOpen && (
        <div style={{ position:"fixed", bottom:90, left:"50%", transform:"translateX(-50%)",
          width:"100%", maxWidth:430, pointerEvents:"none", zIndex:999,
          display:"flex", justifyContent:"flex-end", paddingRight:16, boxSizing:"border-box" }}>
          <button onClick={() => { setFbOpen(true); setFbSent(false); }}
            style={{ pointerEvents:"all", background:"#E8936A", color:"#fff", border:"none",
              borderRadius:20, padding:"8px 14px", fontSize:13, fontWeight:"bold",
              cursor:"pointer", boxShadow:"0 3px 12px rgba(0,0,0,0.25)",
              display:"flex", alignItems:"center", gap:6, fontFamily:"inherit" }}>
            💬 Feedback
          </button>
        </div>
      )}

      {/* ── FEEDBACK SHEET ── */}
      {fbOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-end", touchAction:"none" }}
          onTouchStart={e => e.stopPropagation()}
          onPointerDown={e => e.stopPropagation()}
          onClick={e => { if(e.target === e.currentTarget) { setFbOpen(false); setFbTag(null); setFbText(""); }}}>
          <div style={{ background:"#fff", borderRadius:"20px 20px 0 0", padding:"20px 20px 32px", width:"100%", maxWidth:430, margin:"0 auto" }}
            onTouchStart={e => e.stopPropagation()}
            onPointerDown={e => e.stopPropagation()}>
            {fbSent ? (
              <div style={{ textAlign:"center", padding:"20px 0" }}>
                <div style={{ fontSize:40, marginBottom:10 }}>✅</div>
                <div style={{ fontSize:16, fontWeight:"bold", color:"#28a745" }}>Got it — شكراً!</div>
                <div style={{ fontSize:13, color:"#888", marginTop:4 }}>Feedback sent. I'll fix it.</div>
              </div>
            ) : (
              <>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                  <div>
                    <div style={{ fontWeight:"bold", fontSize:15 }}>Send Feedback</div>
                    <div style={{ fontSize:11, color:"#aaa", marginTop:2 }}>📍 {getFbContext()}</div>
                  </div>
                  <button onClick={() => { setFbOpen(false); setFbTag(null); setFbText(""); }}
                    style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:"#aaa" }}>✕</button>
                </div>
                {/* Tags */}
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:14 }}>
                  {["Bug","Wrong content","Audio issue","Didn't unlock","Missing words","Other"].map(t => (
                    <button key={t} onClick={() => setFbTag(fbTag===t ? null : t)}
                      style={{ padding:"6px 12px", borderRadius:20, border:"1.5px solid",
                        borderColor: fbTag===t ? "#E8936A" : "#e0e0e0",
                        background: fbTag===t ? "#E8936A22" : "#fff",
                        color: fbTag===t ? "#E8936A" : "#666",
                        fontSize:12, cursor:"pointer", fontFamily:"inherit", fontWeight: fbTag===t?"bold":"normal" }}>
                      {t}
                    </button>
                  ))}
                </div>
                {/* Text */}
                <textarea
                  placeholder="What went wrong? (optional if you picked a tag)"
                  value={fbText}
                  onChange={e => setFbText(e.target.value)}
                  onKeyDown={e => e.stopPropagation()}
                  onKeyUp={e => e.stopPropagation()}
                  style={{ width:"100%", padding:"10px 12px", fontSize:13, border:"1.5px solid #e0e0e0",
                    borderRadius:10, fontFamily:"Georgia,serif", resize:"none", height:80,
                    boxSizing:"border-box", marginBottom:12, outline:"none" }}
                />
                <button onClick={submitFeedback} disabled={fbSending || (!fbTag && !fbText.trim())}
                  style={{ width:"100%", padding:13, background:(fbTag||fbText.trim())?"#E8936A":"#ccc",
                    color:"#fff", border:"none", borderRadius:12, fontSize:15, fontWeight:"bold",
                    cursor:(fbTag||fbText.trim())?"pointer":"not-allowed", fontFamily:"inherit" }}>
                  {fbSending ? "Sending..." : "Send Feedback →"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── LATE-DAY REMINDER BANNER ── */}
      {showReminder && (
        <div style={{position:"fixed", bottom:70, left:"50%", transform:"translateX(-50%)",
          width:"calc(100% - 32px)", maxWidth:398, zIndex:998,
          background:"#dc3545", borderRadius:14, padding:"12px 16px",
          boxShadow:"0 4px 16px rgba(220,53,69,0.4)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
            <div>
              <div style={{color:"#fff",fontWeight:"bold",fontSize:13}}>
                {reminderType==="rescue" ? "😬 You missed yesterday!" : "🔥 يلا! Practice time!"}
              </div>
              <div style={{color:"rgba(255,255,255,0.85)",fontSize:11,marginTop:2}}>
                {reminderType==="rescue"
                  ? `Practice now to save your ${stats.dayStreak}-day streak — last chance!`
                  : "You haven't practiced today yet. Don't break your streak!"}
              </div>
            </div>
            <button onClick={()=>setShowReminder(false)}
              style={{background:"none",border:"none",color:"rgba(255,255,255,0.7)",
                fontSize:18,cursor:"pointer",padding:"0 4px",flexShrink:0}}>✕</button>
          </div>
          <button onClick={()=>{
              setShowReminder(false);
              setTab("test");
              setTestRunning(true);
              setTestSessionKey(k=>k+1);
              sessionStartRef.current=Date.now();
            }}
            style={{width:"100%",padding:"9px 12px",background:"rgba(255,255,255,0.2)",
              border:"1.5px solid rgba(255,255,255,0.5)",borderRadius:10,
              color:"#fff",fontWeight:"bold",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
            يلا، let's practice now →
          </button>
        </div>
      )}

      {/* Bottom nav */}
      <div style={A.nav}>
        {NAV.map(t=>{
          const badge = t.id==="learn"?learnFlagCount:t.id==="review"?reviewCount:0;
          return (
            <button key={t.id} onClick={()=>safeNav(()=>{setTab(t.id);setTestRunning(false);setActiveLearnSession(null);setLearnMode("browse");setLearnDoneData(null);})}
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
