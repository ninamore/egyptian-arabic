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

const ALL_VOCAB = SESSIONS.flatMap(s => {
  const extra = EXTRA_VOCAB[s.id];
  return [
    ...s.vocab,
    ...extra.batch2,
    ...extra.batch3,
  ].map(v => ({...v, sessionEmoji:s.emoji, sessionColor:s.color, sessionTitle:s.title}));
});
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

// Save all progress for a user to Supabase (upsert)
async function saveUserProgress(userId, data) {
  // Cache locally for instant loads
  localSet("egy_user_id", userId);
  localSet("egy_progress_cache", data);

  await supabaseFetch("progress", {
    method: "POST",
    prefer: "resolution=merge-duplicates",
    body: JSON.stringify({
      user_id: userId,
      data: data,
      updated_at: new Date().toISOString(),
    }),
  });
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
// Builds test queue from only unlocked words, weighted by testProgress.
function buildTestQueue(testProgress, unlockedBatches) {
  // Get only words that are currently unlocked
  const unlockedVocab = SESSIONS.flatMap(s => {
    const ub = (unlockedBatches && unlockedBatches[s.id]) || 1;
    return getSessionVocab(s.id, ub).map(v => ({...v, sessionEmoji:s.emoji, sessionColor:s.color, sessionTitle:s.title}));
  });

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

function TestSession({ testProgress, unlockedBatches, onComplete }) {
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
  const [userId, setUserId]       = useState(null);   // null = not set yet
  const [nameInput, setNameInput] = useState("");     // for the name entry screen
  const [syncing, setSyncing]     = useState(false);  // shows sync indicator

  // Feedback widget state — must be at top, before any early returns
  const [fbOpen, setFbOpen]       = useState(false);
  const [fbTag, setFbTag]         = useState(null);
  const [fbText, setFbText]       = useState("");
  const [fbSent, setFbSent]       = useState(false);
  const [fbSending, setFbSending] = useState(false);

  // Today's Plan state — must be at top, before any early returns
  const [plan, setPlan]           = useState([]);
  const [planOpen, setPlanOpen]   = useState(true);
  const [planNoteId, setPlanNoteId]   = useState(null);
  const [planNoteText, setPlanNoteText] = useState("");

  // learnFlags: { [vocabId]: true } — mistakes in Learn tab, managed separately
  const [learnFlags, setLearnFlags] = useState({});
  // testProgress: { [vocabId]: {correct, wrong, seen} } — Test tab performance, feeds Review
  const [testProgress, setTestProgress] = useState({});
  // stats: streak, accuracy, history
  const [stats, setStats] = useState({totalCorrect:0,totalWrong:0,dayStreak:0,lastPracticeDate:null,testHistory:[]});
  const [unlockedBatches, setUnlockedBatches] = useState({1:1,2:1,3:1,4:1,5:1});

  // Learn tab state
  const [activeLearnSession, setActiveLearnSession] = useState(null);
  const [learnMode, setLearnMode] = useState("browse"); // "browse" | "quiz" | "done"
  const [learnDoneData, setLearnDoneData] = useState(null);

  // Test tab state
  const [testRunning, setTestRunning] = useState(false);

  // Helper to apply a progress blob to state
  function buildPlan(tp, lf, ub) {
    const items = [];
    const unseenCount = ALL_VOCAB.filter(v => { const p = (tp||{})[v.id]; return !p||!p.seen; }).length;
    if (unseenCount > 0) items.push({id:"new_words", label:`Learn new words (${Math.min(unseenCount,6)} available)`, status:"pending", note:""});
    const rc = ALL_VOCAB.filter(v=>((tp||{})[v.id]?.wrong||0)>0).length;
    if (rc > 0) items.push({id:"review", label:`Review ${rc} word${rc>1?"s":""} in Review tab`, status:"pending", note:""});
    const lfc = Object.keys(lf||{}).length;
    if (lfc > 0) items.push({id:"flags", label:`Practice ${lfc} flagged word${lfc>1?"s":""} in Learn`, status:"pending", note:""});
    items.push({id:"test", label:"Complete one Mixed Test", status:"pending", note:""});
    const closeToUnlock = SESSIONS.find(s => {
      const u = (ub||{})[s.id]||1;
      if (u>=3) return false;
      const vocab = getSessionVocab(s.id, u);
      const mastered = vocab.filter(v => { const p=(tp||{})[v.id]; return p&&(p.correct||0)>=2&&(p.wrong||0)===0; }).length;
      return mastered/vocab.length >= 0.5;
    });
    if (closeToUnlock) items.push({id:"unlock", label:`${closeToUnlock.emoji} ${closeToUnlock.title}: close to unlocking next batch!`, status:"pending", note:""});
    setPlan(items);
  }

  function applyProgress(data) {
    if (!data) return;
    if (data.learnFlags) setLearnFlags(data.learnFlags);
    if (data.stats) setStats(data.stats);
    if (data.testProgress) {
      setTestProgress(data.testProgress);
      const ub = {};
      [1,2,3,4,5].forEach(id => { ub[id] = calcUnlockedBatch(id, data.testProgress); });
      setUnlockedBatches(ub);
      buildPlan(data.testProgress, data.learnFlags||{}, ub);
    }
  }

  // On mount: check if we have a saved user ID, load their progress
  useEffect(() => {
    async function init() {
      const savedId = localGet("egy_user_id");
      if (savedId) {
        setUserId(savedId);
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
        buildPlan({}, {}, {1:1,2:1,3:1,4:1,5:1});
        setLoading(false); // Show name entry screen
      }
    }
    init();
  }, []);

  // Build current progress snapshot for saving
  function buildSnapshot(overrides = {}) {
    return {
      learnFlags:   overrides.learnFlags   ?? learnFlags,
      testProgress: overrides.testProgress ?? testProgress,
      stats:        overrides.stats        ?? stats,
    };
  }

  function saveLearnFlags(flags) {
    setLearnFlags(flags);
    const snap = buildSnapshot({ learnFlags: flags });
    localSet("egy_progress_cache", snap);
    saveUserProgress(userId, snap);
  }

  function saveTestProgress(tp) {
    setTestProgress(tp);
    const snap = buildSnapshot({ testProgress: tp });
    localSet("egy_progress_cache", snap);
    saveUserProgress(userId, snap);
  }

  function saveStats(st) {
    setStats(st);
    const snap = buildSnapshot({ stats: st });
    localSet("egy_progress_cache", snap);
    saveUserProgress(userId, snap);
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

    // Recompute which batches are now unlocked based on new progress
    const newUB = {};
    [1,2,3,4,5].forEach(id => { newUB[id] = calcUnlockedBatch(id, newTP); });
    setUnlockedBatches(newUB);

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

  // Name entry handler — must be defined outside the conditional render
  async function handleStart() {
    const name = nameInput.trim().toLowerCase().replace(/\s+/g, "_");
    if (!name) return;
    setSyncing(true);
    const existing = await loadUserProgress(name);
    if (existing) applyProgress(existing);
    localSet("egy_user_id", name);
    localSet("egy_progress_cache", existing || {});
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
  const reviewCount    = ALL_VOCAB.filter(v=>(testProgress[v.id]?.wrong||0)>0).length;

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

  // ── TODAY'S PLAN STATE ──
  // Plan items: { id, label, status: "pending"|"done"|"issue", note }
  // ── TODAY'S PLAN STATE (moved to top) ──

  function updatePlanItem(id, status) {
    setPlan(p => p.map(item => item.id === id ? {...item, status} : item));
    if (status === "issue") setPlanNoteId(id);
    else setPlanNoteId(null);
  }

  async function submitPlanNote(id) {
    const item = plan.find(p => p.id === id);
    if (!item) return;
    setPlan(p => p.map(i => i.id === id ? {...i, note: planNoteText} : i));
    // Save feedback to Supabase
    await supabaseFetch("feedback", {
      method: "POST",
      prefer: "return=minimal",
      body: JSON.stringify({
        user_id: userId,
        page: "Today's Plan",
        tag: "Plan Issue",
        note: `[${item.label}]: ${planNoteText}`,
        created_at: new Date().toISOString(),
      }),
    });
    setPlanNoteId(null);
    setPlanNoteText("");
  }

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
          <div style={{fontSize:11,color:"#555",fontStyle:"italic"}}>
            {syncing ? "⏳" : "✓"} {userId}
          </div>
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

              {/* ── TODAY'S PLAN ── */}
              <div style={{background:"#1a1a1a",borderRadius:14,marginBottom:14,overflow:"hidden"}}>
                <button onClick={()=>setPlanOpen(o=>!o)}
                  style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",
                    padding:"12px 16px",background:"none",border:"none",cursor:"pointer",color:"#fff",fontFamily:"inherit"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:16}}>📋</span>
                    <span style={{fontWeight:"bold",fontSize:14}}>Today's Plan</span>
                    <span style={{fontSize:11,color:"#888",marginLeft:4}}>
                      {plan.filter(p=>p.status==="done").length}/{plan.length} done
                    </span>
                  </div>
                  <span style={{color:"#666",fontSize:14}}>{planOpen?"▲":"▼"}</span>
                </button>

                {planOpen && (
                  <div style={{padding:"0 16px 14px"}}>
                    <p style={{fontSize:11,color:"#666",margin:"0 0 10px",lineHeight:1.5}}>
                      Check ✅ when done, ❌ if something went wrong. Your feedback goes straight to me.
                    </p>
                    {plan.map(item => (
                      <div key={item.id} style={{marginBottom:8}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,background:"#2c2c2c",borderRadius:10,padding:"10px 12px"}}>
                          <div style={{flex:1,fontSize:13,color:item.status==="done"?"#28a745":item.status==="issue"?"#dc3545":"#ccc",
                            textDecoration:item.status==="done"?"line-through":"none"}}>
                            {item.label}
                          </div>
                          <div style={{display:"flex",gap:6}}>
                            <button onClick={()=>updatePlanItem(item.id, item.status==="done"?"pending":"done")}
                              style={{background:item.status==="done"?"#28a745":"#3d3d3d",border:"none",borderRadius:8,
                                width:32,height:32,fontSize:16,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
                              ✅
                            </button>
                            <button onClick={()=>updatePlanItem(item.id, item.status==="issue"?"pending":"issue")}
                              style={{background:item.status==="issue"?"#dc3545":"#3d3d3d",border:"none",borderRadius:8,
                                width:32,height:32,fontSize:16,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
                              ❌
                            </button>
                          </div>
                        </div>
                        {planNoteId === item.id && (
                          <div style={{marginTop:6,display:"flex",gap:6}}>
                            <input
                              autoFocus
                              placeholder="What went wrong?"
                              value={planNoteText}
                              onChange={e=>setPlanNoteText(e.target.value)}
                              onKeyDown={e=>e.key==="Enter"&&submitPlanNote(item.id)}
                              style={{flex:1,padding:"8px 10px",fontSize:12,border:"1.5px solid #dc3545",
                                borderRadius:8,fontFamily:"inherit",outline:"none",background:"#fff"}}
                            />
                            <button onClick={()=>submitPlanNote(item.id)}
                              style={{padding:"8px 12px",background:"#dc3545",color:"#fff",border:"none",
                                borderRadius:8,fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:"bold",whiteSpace:"nowrap"}}>
                              Send ↗
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    {plan.every(p=>p.status!=="pending") && (
                      <div style={{textAlign:"center",color:"#E8936A",fontSize:13,marginTop:8,fontWeight:"bold"}}>
                        🌟 يلا — all done for today!
                      </div>
                    )}
                  </div>
                )}
              </div>

              <p style={{fontSize:13,color:"#555",lineHeight:1.7,marginBottom:14,background:"#FFF8E7",borderRadius:10,padding:"10px 14px"}}>
                <strong>How to use Learn:</strong> Read each word, tap ▼ to expand the example sentence, then tap <em>Practice these words</em> to quiz yourself. Words you get wrong get a 🚩 — they'll be prioritized next time you practice this session.
              </p>
              <p style={A.secLabel}>Sessions</p>
              {SESSIONS.map(s=>{
                const ub = unlockedBatches[s.id] || 1;
                const currentVocab = getSessionVocab(s.id, ub);
                const totalAvailable = getSessionVocab(s.id, 3).length; // 20
                const flagged = currentVocab.filter(v=>learnFlags[v.id]).length;
                const batchLabel = ub === 1 ? "Batch 1 of 3" : ub === 2 ? "Batch 2 of 3 unlocked! 🔓" : "All 3 batches unlocked! 🌟";
                return (
                  <div key={s.id} onClick={()=>{setActiveLearnSession(s);setLearnMode("browse");setLearnDoneData(null);}}
                    style={{...A.row,borderLeft:`5px solid ${s.color}`}}>
                    <span style={{fontSize:26}}>{s.emoji}</span>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{fontWeight:"bold",fontSize:15}}>{s.title}</span>
                        {flagged>0&&<span style={{fontSize:12,color:"#dc3545"}}>🚩 {flagged} flagged</span>}
                      </div>
                      <div style={{fontSize:12,color:"#aaa",marginTop:2}}>{currentVocab.length} / {totalAvailable} words · {batchLabel}</div>
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
                {getSessionVocab(activeLearnSession.id, unlockedBatches[activeLearnSession.id]).map((v,i)=>(
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
                sessionVocab={getSessionVocab(activeLearnSession.id, unlockedBatches[activeLearnSession.id])}
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
                unlockedBatches={unlockedBatches}
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

      {/* ── FLOATING FEEDBACK BUTTON ── */}
      {!fbOpen && (
        <button onClick={() => { setFbOpen(true); setFbSent(false); }}
          style={{ position:"fixed", bottom:80, right:16, zIndex:999,
            background:"#2c2c2c", color:"#fff", border:"none", borderRadius:"50%",
            width:44, height:44, fontSize:20, cursor:"pointer", boxShadow:"0 3px 12px rgba(0,0,0,0.3)",
            display:"flex", alignItems:"center", justifyContent:"center" }}
          title="Send feedback">
          💬
        </button>
      )}

      {/* ── FEEDBACK SHEET ── */}
      {fbOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-end" }}
          onClick={e => { if(e.target === e.currentTarget) { setFbOpen(false); setFbTag(null); setFbText(""); }}}>
          <div style={{ background:"#fff", borderRadius:"20px 20px 0 0", padding:"20px 20px 32px", width:"100%", maxWidth:430, margin:"0 auto" }}>
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
