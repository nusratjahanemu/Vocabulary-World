/* =====================================================================
   VOCABULARY WORLD — COMPLETE DATA MODULE
   LEVEL_META, ASSESSMENT_OPTIONS, CURRICULUM_DATA
====================================================================== */

    /* =====================================================================
       3. LEVEL METADATA (4 LEVELS WITH CUSTOM BESPOKE INLINE SVG ILLUSTRATIONS)
    ====================================================================== */
    const LEVEL_META = [
      {
        id: 'beginner',
        badge: 'LEVEL 01 • BEGINNER',
        title: 'Beginner',
        bengaliSubtitle: 'প্রাথমিক স্তর',
        description: 'দৈনন্দিন জীবনের মৌলিক ইংরেজি শব্দ, সহজ বাংলা অর্থ, বাক্য গঠন এবং সঠিক উচ্চারণ শেখার শুরু।',
        svg: `
          <svg class="w-16 h-16" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <rect x="4" y="4" width="56" height="56" rx="18" fill="#EEF4F1"/>
            <!-- Open Book -->
            <path d="M16 44C21 41.5 26.5 41.5 32 45C37.5 41.5 43 41.5 48 44V26C43 23.5 37.5 23.5 32 27C26.5 23.5 21 23.5 16 26V44Z" fill="#FFFFFF" stroke="#2D5A4C" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M32 27V45" stroke="#2D5A4C" stroke-width="2.3" stroke-linecap="round"/>
            <!-- Sprouting Leaf -->
            <path d="M32 24V15" stroke="#2D5A4C" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M32 19C26.5 19 24 15 24 11.5C28.5 11.5 32 14.5 32 19Z" fill="#2D5A4C"/>
            <path d="M32 17C37.5 17 40 13 40 9.5C35.5 9.5 32 12.5 32 17Z" fill="#C26D53"/>
          </svg>
        `
      },
      {
        id: 'intermediate',
        badge: 'LEVEL 02 • INTERMEDIATE',
        title: 'Intermediate',
        bengaliSubtitle: 'মাধ্যমিক স্তর',
        description: 'কথোপকথন ও লেখার দক্ষতা বাড়াতে প্রয়োজনীয় শব্দভান্ডার, Phrasal Verbs, Idioms এবং Collocations।',
        svg: `
          <svg class="w-16 h-16" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <rect x="4" y="4" width="56" height="56" rx="18" fill="#FAF0EC"/>
            <!-- Rising Path -->
            <path d="M15 47C22 47 24 38 32 38C40 38 42 29 49 29" stroke="#2D5A4C" stroke-width="2.8" stroke-linecap="round" stroke-dasharray="3 3"/>
            <!-- Compass -->
            <circle cx="32" cy="24" r="11" fill="#FFFFFF" stroke="#2D5A4C" stroke-width="2.5"/>
            <polygon points="36.5,19.5 34,26 27.5,28.5 30,22" fill="#C26D53"/>
            <circle cx="32" cy="24" r="2" fill="#2D5A4C"/>
          </svg>
        `
      },
      {
        id: 'advanced',
        badge: 'LEVEL 03 • ADVANCED',
        title: 'Advanced',
        bengaliSubtitle: 'উচ্চতর স্তর',
        description: 'C1–C2 পর্যায়ের সমৃদ্ধ শব্দভান্ডার, Academic Vocabulary, Formal English এবং গভীর পাঠ্য বিশ্লেষণ।',
        svg: `
          <svg class="w-16 h-16" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <rect x="4" y="4" width="56" height="56" rx="18" fill="#EEF4F1"/>
            <!-- Mountain Peaks -->
            <polygon points="14,47 28,23 42,47" fill="#FFFFFF" stroke="#2D5A4C" stroke-width="2.5" stroke-linejoin="round"/>
            <polygon points="30,47 41,29 52,47" fill="#FAF0EC" stroke="#2D5A4C" stroke-width="2.3" stroke-linejoin="round"/>
            <!-- Guiding Star -->
            <polygon points="41,12 42.6,16.2 47,16.5 43.6,19.3 44.7,23.6 41,21.2 37.3,23.6 38.4,19.3 35,16.5 39.4,16.2" fill="#C26D53"/>
          </svg>
        `
      },
      {
        id: 'pro',
        badge: 'LEVEL 04 • PRO',
        title: 'Pro',
        bengaliSubtitle: 'পেশাদার ও দক্ষ স্তর',
        description: 'কর্মক্ষেত্র, Business English, পেশাদার যোগাযোগ এবং জটিল বাক্য কাঠামোয় পূর্ণ দক্ষতা অর্জন।',
        svg: `
          <svg class="w-16 h-16" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <rect x="4" y="4" width="56" height="56" rx="18" fill="#FAF0EC"/>
            <!-- Laurel Wreath -->
            <path d="M21 44C15.5 39 14.5 30.5 18 24" stroke="#2D5A4C" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M43 44C48.5 39 49.5 30.5 46 24" stroke="#2D5A4C" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M24 47H40" stroke="#2D5A4C" stroke-width="2.5" stroke-linecap="round"/>
            <!-- Crown Emblem -->
            <path d="M20 36L22 23L28 29L32 20L36 29L42 23L44 36H20Z" fill="#FFFFFF" stroke="#C26D53" stroke-width="2.5" stroke-linejoin="round"/>
            <rect x="20" y="36" width="24" height="4.5" rx="2" fill="#2D5A4C"/>
          </svg>
        `
      }
    ];

    const ASSESSMENT_OPTIONS = [
      { id: 1, text: 'একদমই ইংরেজি শব্দ জানি না।' },
      { id: 2, text: 'মোটামুটি ইংরেজি শব্দ জানি।' },
      { id: 3, text: 'কথোপকথনের করার মতো ইংরেজি সম্পর্কে জ্ঞান আছে।' },
      { id: 4, text: 'ভালোই ইংরেজি পারি।' }
    ];

    /* =====================================================================
       4. COMPLETE 4-LEVEL CURRICULUM & VOCABULARY DATABASE
          (6 Core Words + 2 Extra Practice Words + Full Modules per Level)
    ====================================================================== */
    const CURRICULUM_DATA = {
      /* -------------------------------------------------------------------
         LEVEL 1: BEGINNER
      -------------------------------------------------------------------- */
      beginner: {
        id: 'beginner',
        title: 'Beginner',
        bengaliSubtitle: 'মৌলিক ইংরেজি শব্দভান্ডার, দৈনন্দিন শব্দ, সহজ কথোপকথন এবং ছোটদের শিক্ষণীয় গল্প',
        words: [
          {
            id: 'beg-1',
            word: 'Serene',
            imageQuery: 'calm mountain lake sunrise',
            pos: 'Adjective',
            ipa: '/səˈriːn/',
            meaningBn: 'শান্ত, নির্মল, প্রশান্ত',
            explanationEn: 'Calm, peaceful, and untroubled by noise or worry.',
            example: 'The mountain lake looked remarkably serene at dawn before the wind picked up.',
            exampleBn: 'বাতাস বইতে শুরু করার আগে ভোরবেলা পাহাড়ি হ্রদটি অসাধারণভাবে শান্ত ও নির্মল দেখাচ্ছিল।',
            synonyms: [
              { word: 'Peaceful', meaningBn: 'শান্তিপূর্ণ', explanationBn: 'যেখানে কোনো কোলাহল, ঝগড়া বা অশান্তি নেই এমন পরিবেশ বোঝাতে ব্যবহৃত হয়।' },
              { word: 'Calm', meaningBn: 'শান্ত, স্থির', explanationBn: 'উত্তেজনা বা অস্থিরতাহীন ধীর ও স্থির অবস্থা বোঝাতে ব্যবহৃত হয়।' },
              { word: 'Tranquil', meaningBn: 'নিরিবিলি ও প্রশান্ত', explanationBn: 'প্রকৃতির স্নিগ্ধ ও নিরিবিলি পরিবেশ বর্ণনা করতে এই শব্দটি ব্যবহৃত হয়।' },
              { word: 'Placid', meaningBn: 'সৌম্য ও ধীরস্থির', explanationBn: 'সহজে বিচলিত হয় না এমন শান্ত স্বভাব বা স্থির জলরাশি বোঝাতে ব্যবহৃত হয়।' },
              { word: 'Quiet', meaningBn: 'নীরব, চুপচাপ', explanationBn: 'শব্দহীন বা কম কোলাহলপূর্ণ স্থান বোঝাতে ব্যবহৃত হয়।' }
            ],
            antonyms: [
              { word: 'Chaotic', meaningBn: 'বিশৃঙ্খল', explanationBn: 'যেখানে কোনো নিয়ম-শৃঙ্খলা নেই এবং সবকিছু এলোমেলো হয়ে আছে।' },
              { word: 'Turbulent', meaningBn: 'অশান্ত, উত্তাল', explanationBn: 'প্রবল অস্থিরতা, ঝড়ো হাওয়া বা প্রচণ্ড গোলযোগপূর্ণ অবস্থা বোঝায়।' },
              { word: 'Noisy', meaningBn: 'কোলাহলপূর্ণ', explanationBn: 'অতিরিক্ত ও বিরক্তিকর শব্দে ভরা পরিবেশ বোঝাতে ব্যবহৃত হয়।' },
              { word: 'Agitated', meaningBn: 'উদ্বিগ্ন বা অস্থির', explanationBn: 'মানসিকভাবে অস্থির, চিন্তিত বা উত্তেজিত অবস্থা বোঝায়।' },
              { word: 'Stormy', meaningBn: 'ঝড়ো, উত্তাল', explanationBn: 'প্রচণ্ড ঝড়বৃষ্টি বা তীব্র অশান্ত পরিস্থিতিকে বোঝায়।' }
            ]
          },
          {
            id: 'beg-2',
            word: 'Grateful',
            imageQuery: 'gratitude thank you hands heart',
            pos: 'Adjective',
            ipa: '/ˈɡreɪtfəl/',
            meaningBn: 'কৃতজ্ঞ, বাধিত',
            explanationEn: 'Feeling or showing thanks for kindness or help received.',
            example: 'We are deeply grateful to our teachers for guiding us with patience.',
            exampleBn: 'ধৈর্য ধরে আমাদের পথ দেখানোর জন্য আমরা আমাদের শিক্ষকদের প্রতি গভীরভাবে কৃতজ্ঞ।',
            synonyms: [
              { word: 'Thankful', meaningBn: 'ধন্যবাদজ্ঞাপক, কৃতজ্ঞ', explanationBn: 'কারো উপকার বা আশীর্বাদের জন্য মন থেকে ধন্যবাদ অনুভব করা।' },
              { word: 'Appreciative', meaningBn: 'গুণগ্রাহী, সমাদরকারী', explanationBn: 'অন্যের ভালো কাজ বা প্রচেষ্টার মূল্য বোঝা ও প্রশংসা করা।' },
              { word: 'Obliged', meaningBn: 'বাধিত', explanationBn: 'কারো সাহায্যের কারণে ভদ্রভাবে কৃতজ্ঞতা প্রকাশ করা।' },
              { word: 'Indebted', meaningBn: 'ঋণী, কৃতজ্ঞ', explanationBn: 'অন্যের বড় কোনো অবদানের জন্য নিজেকে কৃতজ্ঞ মনে করা।' },
              { word: 'Pleased', meaningBn: 'সন্তুষ্ট ও আনন্দিত', explanationBn: 'কারো আন্তরিক ব্যবহারে খুশি ও কৃতজ্ঞ বোধ করা।' }
            ],
            antonyms: [
              { word: 'Ungrateful', meaningBn: 'অকৃতজ্ঞ', explanationBn: 'উপকার পাওয়ার পরও যে কৃতজ্ঞতা স্বীকার করে না।' },
              { word: 'Thankless', meaningBn: 'অকৃতজ্ঞতাপূর্ণ', explanationBn: 'যে কাজের জন্য কোনো ধন্যবাদ বা স্বীকৃতি পাওয়া যায় না।' },
              { word: 'Unappreciative', meaningBn: 'অমূল্যায়নকারী', explanationBn: 'অন্যের কষ্ট বা অবদানের গুরুত্ব না দেওয়া।' },
              { word: 'Resentful', meaningBn: 'ক্ষুব্ধ, অসন্তুষ্ট', explanationBn: 'মনে ক্ষোভ বা বিরক্তি পুষে রাখা।' },
              { word: 'Selfish', meaningBn: 'স্বার্থপর', explanationBn: 'কেবল নিজের সুবিধার কথা চিন্তা করা এবং অন্যের অবদান ভুলে যাওয়া।' }
            ]
          },
          {
            id: 'beg-3',
            word: 'Diligent',
            imageQuery: 'diligent student studying library books',
            pos: 'Adjective',
            ipa: '/ˈdɪlɪdʒənt/',
            meaningBn: 'পরিশ্রমী, অধ্যবসায়ী',
            explanationEn: 'Showing careful, steady, and hardworking effort in tasks.',
            example: 'A diligent student reviews new lessons every evening without fail.',
            exampleBn: 'একজন পরিশ্রমী শিক্ষার্থী প্রতিদিন সন্ধ্যায় নিয়ম করে নতুন পাঠ রিভিশন দেয়।',
            synonyms: [
              { word: 'Hardworking', meaningBn: 'কঠোর পরিশ্রমী', explanationBn: 'নিরলসভাবে এবং মনোযোগ দিয়ে কাজ করে এমন ব্যক্তি।' },
              { word: 'Attentive', meaningBn: 'মনোযোগী', explanationBn: 'প্রতিটি খুঁটিনাটি বিষয়ের প্রতি সতর্ক ও মনোযোগী থাকা।' },
              { word: 'Dedicated', meaningBn: 'নিবেদিতপ্রাণ', explanationBn: 'কোনো লক্ষ্য অর্জনে সম্পূর্ণ নিষ্ঠা ও আন্তরিকতা নিয়ে কাজ করা।' },
              { word: 'Persistent', meaningBn: 'অধ্যবসায়ী, নাছোড়বান্দা', explanationBn: 'বাধা এলেও হাল না ছেড়ে চেষ্টা চালিয়ে যাওয়া।' },
              { word: 'Thorough', meaningBn: 'নিখুঁত ও সম্পূর্ণ', explanationBn: 'কোনো কাজ তাড়াহুড়ো না করে ভালোভাবে সম্পন্ন করা।' }
            ],
            antonyms: [
              { word: 'Lazy', meaningBn: 'অলস', explanationBn: 'কাজকর্ম বা পরিশ্রম করতে অনীহা প্রকাশ করা।' },
              { word: 'Careless', meaningBn: 'অসতর্ক, অমনোযোগী', explanationBn: 'যত্ন বা মনোযোগ ছাড়া কাজ করা।' },
              { word: 'Negligent', meaningBn: 'অবহেলাকারী', explanationBn: 'নিজের দায়িত্ব বা কর্তব্যে অবহেলা করা।' },
              { word: 'Idle', meaningBn: 'নিষ্ক্রিয়, কর্মহীন', explanationBn: 'কোনো কাজ না করে অলসভাবে সময় কাটানো।' },
              { word: 'Sluggish', meaningBn: 'মন্থর, ঢিলেঢালা', explanationBn: 'খুব ধীরগতিতে এবং উৎসাহহীনভাবে কাজ করা।' }
            ]
          },
          {
            id: 'beg-4',
            word: 'Generous',
            imageQuery: 'generous giving gift charity',
            pos: 'Adjective',
            ipa: '/ˈdʒenərəs/',
            meaningBn: 'উদার, দানশীল',
            explanationEn: 'Willing to give help, time, or kindness freely to others.',
            example: 'Our neighbor is always generous with his time whenever someone needs help.',
            exampleBn: 'কারো সাহায্যের প্রয়োজন হলে আমাদের প্রতিবেশী সবসময় উদারভাবে নিজের সময় দেন।',
            synonyms: [
              { word: 'Kind', meaningBn: 'দয়ালু', explanationBn: 'অন্যের প্রতি সহানুভূতিশীল ও সাহায্যকারী মনোভাব।' },
              { word: 'Charitable', meaningBn: 'দানশীল', explanationBn: 'অসহায় বা প্রয়োজনগ্রস্ত মানুষকে মুক্তহস্তে সাহায্য করা।' },
              { word: 'Benevolent', meaningBn: 'পরোপকারী', explanationBn: 'সকলের মঙ্গল কামনা করে এমন উদার হৃদয়।' },
              { word: 'Giving', meaningBn: 'উদারহস্ত', explanationBn: 'নিজের জিনিস অন্যের সাথে আনন্দের সাথে ভাগ করে নেওয়া।' },
              { word: 'Noble', meaningBn: 'মহৎ', explanationBn: 'উচ্চ নৈতিক গুণাবলি ও উদার মানসিকতার অধিকারী।' }
            ],
            antonyms: [
              { word: 'Stingy', meaningBn: 'কৃপণ', explanationBn: 'অর্থ বা সাহায্য দিতে অনিচ্ছুক ব্যক্তি।' },
              { word: 'Greedy', meaningBn: 'লোভী', explanationBn: 'নিজের প্রয়োজনের চেয়েও বেশি পাওয়ার প্রবল আকাঙ্ক্ষা।' },
              { word: 'Mean', meaningBn: 'নীচ বা অনুদার', explanationBn: 'অন্যের প্রতি সংকীর্ণ ও কঠোর আচরণ করা।' },
              { word: 'Miserly', meaningBn: 'অত্যন্ত কৃপণ', explanationBn: 'অর্থ জমিয়ে রেখেও দরকারি কাজে খরচ না করা।' },
              { word: 'Self-centered', meaningBn: 'আত্মকেন্দ্রিক', explanationBn: 'কেবল নিজের স্বার্থ নিয়ে ব্যস্ত থাকা।' }
            ]
          },
          {
            id: 'beg-5',
            word: 'Curious',
            imageQuery: 'curious child magnifying glass nature',
            pos: 'Adjective',
            ipa: '/ˈkjʊəriəs/',
            meaningBn: 'কৌতূহলী, জানতে আগ্রহী',
            explanationEn: 'Eager to learn, explore, or know more about something.',
            example: 'Curious children ask wonderful questions about how the stars shine.',
            exampleBn: 'কৌতূহলী শিশুরা তারারা কীভাবে জ্বলে সে সম্পর্কে চমৎকার সব প্রশ্ন করে।',
            synonyms: [
              { word: 'Inquisitive', meaningBn: 'জিজ্ঞাসু', explanationBn: 'নতুন কিছু জানার জন্য সবসময় প্রশ্ন করতে আগ্রহী।' },
              { word: 'Eager', meaningBn: 'আগ্রহী, উৎসুক', explanationBn: 'কোনো কিছু শেখা বা করার প্রবল ইচ্ছা থাকা।' },
              { word: 'Interested', meaningBn: 'কৌতূহলী ও মনোযোগী', explanationBn: 'কোনো বিষয়ের প্রতি বিশেষ আকর্ষণ অনুভব করা।' },
              { word: 'Observant', meaningBn: 'তীক্ষ্ণ পর্যবেক্ষক', explanationBn: 'চারপাশের সবকিছু মনোযোগ দিয়ে লক্ষ্য করা।' },
              { word: 'Wondering', meaningBn: 'বিস্মিত ও ভাবুক', explanationBn: 'কোনো বিষয় কীভাবে ঘটে তা নিয়ে গভীরভাবে চিন্তা করা।' }
            ],
            antonyms: [
              { word: 'Indifferent', meaningBn: 'উদাসীন', explanationBn: 'কোনো বিষয়ে ভালো বা মন্দ কোনো আগ্রহই না দেখানো।' },
              { word: 'Bored', meaningBn: 'বিরক্ত, একঘেয়ে', explanationBn: 'কোনো কিছুতে আনন্দ বা আগ্রহ খুঁজে না পাওয়া।' },
              { word: 'Uninterested', meaningBn: 'অনাগ্রহী', explanationBn: 'নতুন কিছু জানার ইচ্ছা না থাকা।' },
              { word: 'Apathetic', meaningBn: 'নির্লিপ্ত', explanationBn: 'আবেগ বা উৎসাহহীনভাবে চুপচাপ থাকা।' },
              { word: 'Incurious', meaningBn: 'কৌতূহলহীন', explanationBn: 'চারপাশের ঘটনা সম্পর্কে জানার কোনো চেষ্টা না করা।' }
            ]
          },
          {
            id: 'beg-6',
            word: 'Courage',
            imageQuery: 'mountain climbing bravery summit courage',
            pos: 'Noun',
            ipa: '/ˈkʌrɪdʒ/',
            meaningBn: 'সাহস, মনোবল',
            explanationEn: 'The mental strength to face fear, danger, or difficulty.',
            example: 'It takes real courage to speak honestly in front of a large crowd.',
            exampleBn: 'বড় জনসমাগমের সামনে সত্য কথা বলতে প্রকৃত সাহসের প্রয়োজন হয়।',
            synonyms: [
              { word: 'Bravery', meaningBn: 'বীরত্ব, সাহসিকতা', explanationBn: 'ভয় বা বিপদের সামনে নির্ভীকভাবে দাঁড়ানোর গুণ।' },
              { word: 'Valor', meaningBn: 'শৌর্যবীর্য', explanationBn: 'কঠিন পরিস্থিতিতে অসাধারণ সাহস প্রদর্শন।' },
              { word: 'Boldness', meaningBn: 'নির্ভীকতা', explanationBn: 'দ্বিধা না করে আত্মবিশ্বাসের সাথে পদক্ষেপ নেওয়া।' },
              { word: 'Confidence', meaningBn: 'আত্মবিশ্বাস', explanationBn: 'নিজের সামর্থ্যের ওপর দৃঢ় আস্থা রাখা।' },
              { word: 'Fearlessness', meaningBn: 'ভয়হীনতা', explanationBn: 'কোনো কিছুতেই ভয় না পাওয়ার মানসিক শক্তি।' }
            ],
            antonyms: [
              { word: 'Cowardice', meaningBn: 'ভীরুতা, কাপুরুষতা', explanationBn: 'ভয় পেয়ে দায়িত্ব বা সত্য থেকে পিছিয়ে আসা।' },
              { word: 'Fear', meaningBn: 'ভয়, আতঙ্ক', explanationBn: 'বিপদ বা ক্ষতির আশঙ্কায় ভীত হওয়া।' },
              { word: 'Timidity', meaningBn: 'লাজুকতা ও ভীরুতা', explanationBn: 'সাহস বা আত্মবিশ্বাসের অভাব।' },
              { word: 'Hesitation', meaningBn: 'দ্বিধা, সংকোচ', explanationBn: 'ভয়ের কারণে সিদ্ধান্ত নিতে ইতস্তত করা।' },
              { word: 'Weakness', meaningBn: 'দুর্বলতা', explanationBn: 'মানসিক বা শারীরিক শক্তির অভাব।' }
            ]
          }
        ],
        practiceExtraWords: [
          {
            id: 'beg-7',
            word: 'Harmony',
            imageQuery: 'harmony orchestra music nature balance',
            ipa: '/ˈhɑːrməni/',
            meaningBn: 'সম্প্রীতি, মিল',
            explanationEn: 'Living or working together peacefully without conflict.',
            example: 'Neighbors live in harmony when they respect one another.',
            exampleBn: 'প্রতিবেশীরা একে অপরকে সম্মান করলে তারা সম্প্রীতির সাথে বসবাস করে।'
          },
          {
            id: 'beg-8',
            word: 'Polite',
            imageQuery: 'polite handshake courtesy respectful greeting',
            ipa: '/pəˈlaɪt/',
            meaningBn: 'ভদ্র, বিনয়ী',
            explanationEn: 'Having good manners and showing respect to other people.',
            example: 'Using polite words like please and thank you brightens every day.',
            exampleBn: 'দয়া করে এবং ধন্যবাদ-এর মতো ভদ্র শব্দ ব্যবহার করলে প্রতিটি দিন সুন্দর হয়ে ওঠে।'
          }
        ],
        dailyWords: [
          { word: 'Morning Routine', meaningBn: 'সকালের নিয়মিত কাজ', example: 'A healthy morning routine keeps you energetic all day.', exampleBn: 'একটি স্বাস্থ্যকর সকালের রুটিন আপনাকে সারাদিন প্রাণবন্ত রাখে।' },
          { word: 'Neighborhood', meaningBn: 'পাড়া বা প্রতিবেশী এলাকা', example: 'Our neighborhood park is full of green trees.', exampleBn: 'আমাদের পাড়ার পার্কটি সবুজ গাছে ভরা।' },
          { word: 'Appreciate', meaningBn: 'প্রশংসা বা কদর করা', example: 'I truly appreciate your kind help today.', exampleBn: 'আজ তোমার আন্তরিক সাহায্যের জন্য আমি সত্যিই কৃতজ্ঞ।' },
          { word: 'Patience', meaningBn: 'ধৈর্য', example: 'Learning a new language requires daily patience.', exampleBn: 'নতুন কোনো ভাষা শেখার জন্য প্রতিদিন ধৈর্যের প্রয়োজন হয়।' }
        ],
        conversations: [
          {
            title: 'Dialogue 1: At the Bookshop (বইয়ের দোকানে কথোপকথন)',
            lines: [
              { speaker: 'Rafi', en: 'Excuse me, could you help me find an English story book for beginners?', bn: 'মাফ করবেন, আপনি কি আমাকে বিগিনারদের জন্য একটি ইংরেজি গল্পের বই খুঁজে দিতে পারবেন?' },
              { speaker: 'Shopkeeper', en: 'Of course! Right over here we have illustrated short stories with simple words.', bn: 'অবশ্যই! ঠিক এখানেই সহজ শব্দে লেখা ছবিযুক্ত ছোট গল্পের বই রয়েছে।' },
              { speaker: 'Rafi', en: 'That looks wonderful. Thank you so much for your kind help!', bn: 'এটি দারুণ লাগছে। আপনার আন্তরিক সাহায্যের জন্য অনেক ধন্যবাদ!' }
            ]
          },
          {
            title: 'Dialogue 2: Morning Greeting (সকালের কুশল বিনিময়)',
            lines: [
              { speaker: 'Nadia', en: 'Good morning, Tariq! You look very cheerful today.', bn: 'সুপ্রভাত, তারিক! আজ তোমাকে খুব হাসিখুশি দেখাচ্ছে।' },
              { speaker: 'Tariq', en: 'Good morning, Nadia! I woke up early and finished my English practice.', bn: 'সুপ্রভাত, নাদিয়া! আমি খুব ভোরে ঘুম থেকে উঠেছি এবং আমার ইংরেজি অনুশীলন শেষ করেছি।' },
              { speaker: 'Nadia', en: 'That is a great habit. Let us practice together after class!', bn: 'এটি দারুণ একটি অভ্যাস। চলো ক্লাসের পর আমরা একসাথে অনুশীলন করি!' }
            ]
          }
        ],
        stories: [
          {
            id: 'beg-story-1',
            title: 'Story 1: The Whispering Banyan and the Thirsty Bird (বিশাল বটবৃক্ষ ও তৃষ্ণার্ত পাখির গল্প)',
            theme: 'Kindness, Diligence & Compassion (দয়া ও নিয়মিত প্রচেষ্টা)',
            readTime: '3 min read',
            moralBn: 'দয়া ও সহানুভূতির একটি ছোট্ট কাজও পৃথিবীর যেকোনো প্রাণীর জীবনে আনন্দ এনে দিতে পারে এবং গভীর বন্ধুত্বের সৃষ্টি করে।',
            vocabularyFocus: ['Serene', 'Diligent', 'Grateful', 'Generous', 'Vibrant'],
            sentences: [
              { en: 'In a quiet and serene village, an old banyan tree stood peacefully beside a winding river.', bn: 'একটি শান্ত ও নির্মল গ্রামে, একটি আঁকাবাঁকা নদীর পাশে একটি প্রাচীন বটবৃক্ষ প্রশান্তভাবে দাঁড়িয়ে ছিল।' },
              { en: 'A diligent boy named Ayaan loved to read his English storybooks under its cool green shade every afternoon.', bn: 'আয়ান নামের এক পরিশ্রমী বালক প্রতিদিন বিকেলে গাছটির শীতল সবুজ ছায়ায় বসে তার ইংরেজি গল্পের বই পড়তে ভালোবাসত।' },
              { en: 'One hot afternoon, he noticed a tiny sparrow panting on a dusty branch, too weak to fly in the scorching heat.', bn: 'এক গরম দুপুরে, সে লক্ষ্য করল একটি ছোট চড়ুই পাখি ধূলিমলিন ডালে হাঁপাচ্ছে, প্রচণ্ড গরমে ওড়ার মতো শক্তিটুকুও তার নেই।' },
              { en: 'Ayaan felt gentle compassion and immediately placed a shallow clay bowl filled with cool, clean water under the tree.', bn: 'আয়ান মনে গভীর মমতা অনুভব করল এবং তৎক্ষণাৎ একটি মাটির অগভীর পাত্র পরিষ্কার ঠান্ডা পানিতে ভরে গাছের নিচে রাখল।' },
              { en: 'The little bird hopped down carefully, took several grateful sips, and splashed happily in the soothing water.', bn: 'ক্ষুদে পাখিটি সাবধানে নিচে নেমে এলো, কৃতজ্ঞচিত্তে কয়েক চুমুক পানি পান করল এবং আরামদায়ক পানিতে আনন্দের সাথে ডানা ঝাপটালো।' },
              { en: 'Soon after, Ayaan scattered generous handfuls of breadcrumbs and grain across the soft green grass.', bn: 'কিছুক্ষণ পর, আয়ান নরম সবুজ ঘাসের ওপর উদারহস্তে কিছু রুটির টুকরো ও শস্যদানা ছড়িয়ে দিল।' },
              { en: 'The sparrow chirped a cheerful melody that echoed vibrantly through the warm afternoon breeze.', bn: 'চড়ুইটি একটি মধুর সুরে কিচিরমিচির করে উঠল যা দুপুরের মিষ্টি বাতাসে প্রাণবন্তভাবে প্রতিধ্বনিত হলো।' },
              { en: 'From that unforgettable day, the little bird returned faithfully every morning to greet Ayaan at his bedroom window.', bn: 'সেই অবিস্মরণীয় দিন থেকে, ছোট্ট পাখিটি প্রতিদিন সকালে আয়ানের শোবার ঘরের জানালার কাছে এসে তাকে অভিবাদন জানাত।' },
              { en: 'Ayaan learned that a simple act of kindness creates a lasting bond of genuine friendship and pure joy.', bn: 'আয়ান শিখল যে দয়ার একটি ছোট্ট কাজও প্রকৃত বন্ধুত্বের এক চিরস্থায়ী বন্ধন এবং অনাবিল আনন্দ তৈরি করতে পারে।' }
            ]
          },
          {
            id: 'beg-story-2',
            title: 'Story 2: The Riverboat That Carried Dreams (নৌকাভর্তি বই ও নতুন স্বপ্নের আলো)',
            theme: 'Curiosity, Regular Practice & Friendship (কৌতূহল ও নিয়মিত শব্দ চর্চা)',
            readTime: '3 min read',
            moralBn: 'প্রতিদিন অল্প অল্প করে নতুন কিছু শেখার আগ্রহ মানুষকে যেকোনো প্রতিকূলতা পেরিয়ে নতুন উচ্চতায় নিয়ে যায়।',
            vocabularyFocus: ['Curious', 'Patient', 'Grateful', 'Friendly', 'Bright'],
            sentences: [
              { en: 'Deep in the riverlands of Bangladesh, young Mina dreamed of speaking English with visitors from faraway lands.', bn: 'বাংলাদেশের এক নদীমাতৃক প্রত্যন্ত অঞ্চলে, তরুণী মিনা দূরদেশের পর্যটকদের সাথে সাবলীলভাবে ইংরেজি বলার স্বপ্ন দেখত।' },
              { en: 'Her village had no paved roads, but a colorful wooden boat arrived at the rustic dock every Monday morning.', bn: 'তার গ্রামে কোনো পাকা রাস্তা ছিল না, কিন্তু প্রতি সোমবার সকালে কাঠের ঘাটে একটি রঙিন কাঠের নৌকা এসে ভিড়ত।' },
              { en: 'It was a floating library equipped with vibrant picture books and cheerful audio stories.', bn: 'এটি ছিল একটি ভ্রাম্যমাণ ভাসমান লাইব্রেরি, যাতে ছিল প্রাণবন্ত ছবির বই এবং আনন্দময় অডিও গল্প।' },
              { en: 'The kind boat captain, Uncle Rahim, was always generous with his time and encouraged every curious learner.', bn: 'দয়ালু নৌকার মাঝি রহিম চাচা সবসময় হাসিমুখে সময় দিতেন এবং প্রতিটি কৌতূহলী শিক্ষার্থীকে উৎসাহ জোগাতেন।' },
              { en: 'He handed Mina a small notebook and said, "If you learn three new words each day, a whole new world will open."', bn: 'তিনি মিনার হাতে একটি ছোট নোটবুক তুলে দিয়ে বললেন, "তুমি যদি প্রতিদিন তিনটি করে নতুন শব্দ শেখো, তবে তোমার সামনে এক নতুন জগৎ উন্মোচিত হবে।"' },
              { en: 'Mina was diligent and practiced her pronunciation out loud while walking along the calm riverbank.', bn: 'মিনা ছিল অত্যন্ত পরিশ্রমী এবং শান্ত নদীর পাড় ধরে হাঁটার সময় সে উচ্চস্বরে প্রতিটি শব্দের উচ্চারণ অনুশীলন করত।' },
              { en: 'She felt deeply grateful whenever she mastered a tricky phrase and shared the meaning with her younger brother.', bn: 'যখনই সে কোনো কঠিন বাক্য শিখে ফেলত, তখন সে মনে গভীর কৃতজ্ঞতা অনুভব করত এবং ছোট ভাইকে তার অর্থ বুঝিয়ে দিত।' },
              { en: 'By winter, Mina was confident enough to translate English nature stories for elderly villagers who could not read.', bn: 'শীতকাল আসতে না আসতেই মিনা এতটাই আত্মবিশ্বাসী হয়ে উঠল যে সে নিরক্ষর প্রবীণ গ্রামবাসীদের ইংরেজি গল্প বাংলায় অনুবাদ করে শোনাত।' },
              { en: 'She proved that curiosity and steady daily practice can build bridges across any distance.', bn: 'সে প্রমাণ করল যে অদম্য কৌতূহল এবং প্রতিদিনের নিয়মতান্ত্রিক চর্চা যেকোনো দূরত্বের মধ্যেও সেতুবন্ধন রচনা করতে পারে।' }
            ]
          }
        ]
      },

      /* -------------------------------------------------------------------
         LEVEL 2: INTERMEDIATE
      -------------------------------------------------------------------- */
      intermediate: {
        id: 'intermediate',
        title: 'Intermediate',
        bengaliSubtitle: 'মাধ্যমিক স্তরের শব্দভান্ডার, Phrasal Verbs, Idioms, Collocations এবং শিক্ষণীয় গল্প',
        words: [
          {
            id: 'int-1',
            word: 'Resilient',
            imageQuery: 'green sprout growing through rock stone',
            pos: 'Adjective',
            ipa: '/rɪˈzɪliənt/',
            meaningBn: 'স্থিতিস্থাপক, প্রতিকূলতা কাটিয়ে উঠতে সক্ষম',
            explanationEn: 'Able to recover quickly from difficulties, setbacks, or tough conditions.',
            example: 'Resilient learners treat every mistake as a stepping stone toward mastery.',
            exampleBn: 'দৃঢ়চেতা শিক্ষার্থীরা প্রতিটি ভুলকে দক্ষতা অর্জনের সোপান হিসেবে গ্রহণ করে।',
            synonyms: [
              { word: 'Adaptable', meaningBn: 'মানিয়ে নিতে সক্ষম', explanationBn: 'নতুন বা কঠিন পরিস্থিতির সাথে সহজে খাপ খাইয়ে নেওয়ার ক্ষমতা।' },
              { word: 'Tough', meaningBn: 'দৃঢ়, সহনশীল', explanationBn: 'কঠিন চাপ বা কষ্ট সহ্য করার মানসিক ও শারীরিক শক্তি।' },
              { word: 'Strong', meaningBn: 'শক্তিশালী', explanationBn: 'সহজে ভেঙে পড়ে না এমন দৃঢ় মানসিকতা।' },
              { word: 'Flexible', meaningBn: 'নমনীয়', explanationBn: 'প্রয়োজন অনুযায়ী নিজের কৌশল পরিবর্তন করতে পারা।' },
              { word: 'Tenacious', meaningBn: 'দৃঢ়প্রতিজ্ঞ', explanationBn: 'লক্ষ্য অর্জনে শক্তভাবে লেগে থাকার মানসিকতা।' }
            ],
            antonyms: [
              { word: 'Fragile', meaningBn: 'ভঙ্গুর, নাজুক', explanationBn: 'সামান্য আঘাতে বা চাপেই ভেঙে পড়ে এমন।' },
              { word: 'Weak', meaningBn: 'দুর্বল', explanationBn: 'প্রতিকূলতা মোকাবিলা করার শক্তির অভাব।' },
              { word: 'Vulnerable', meaningBn: 'অরক্ষিত, সংবেদনশীল', explanationBn: 'সহজে ক্ষতিগ্রস্ত বা আঘাতপ্রাপ্ত হতে পারে এমন।' },
              { word: 'Rigid', meaningBn: 'অনমনীয়, কঠোর', explanationBn: 'পরিবর্তিত পরিস্থিতির সাথে মানিয়ে নিতে অক্ষম।' },
              { word: 'Delicate', meaningBn: 'কোমল ও সূক্ষ্ম', explanationBn: 'কঠিন পরিবেশে টিকে থাকার মতো শক্ত নয়।' }
            ]
          },
          {
            id: 'int-2',
            word: 'Eloquent',
            imageQuery: 'orator speech podium public speaking eloquence',
            pos: 'Adjective',
            ipa: '/ˈeləkwənt/',
            meaningBn: 'বাকপটু, প্রাঞ্জল ও প্রভাবশালী',
            explanationEn: 'Fluent, persuasive, and expressive in speaking or writing.',
            example: 'Her eloquent speech inspired the entire audience to take action.',
            exampleBn: 'তার প্রাঞ্জল ও হৃদয়গ্রাহী বক্তব্য পুরো দর্শকসারিকে কাজ করতে অনুপ্রাণিত করেছিল।',
            synonyms: [
              { word: 'Articulate', meaningBn: 'স্পষ্টভাষী', explanationBn: 'নিজের চিন্তাভাবনা অত্যন্ত পরিষ্কার ও গুছিয়ে প্রকাশ করতে পারা।' },
              { word: 'Fluent', meaningBn: 'সাবলীল', explanationBn: 'কোনো জড়তা ছাড়াই স্বতঃস্ফূর্তভাবে কথা বলা বা লেখা।' },
              { word: 'Expressive', meaningBn: 'ভাবপূর্ণ', explanationBn: 'কথার মাধ্যমে গভীর অনুভূতি ও অর্থ ফুটিয়ে তোলা।' },
              { word: 'Persuasive', meaningBn: 'প্ররোচনামূলক, যুক্তিনিষ্ঠ', explanationBn: 'যুক্তি দিয়ে অন্যকে সহজেই রাজি করাতে সক্ষম।' },
              { word: 'Poetic', meaningBn: 'কাব্যিক ও শ্রুতিমধুর', explanationBn: 'অত্যন্ত সুন্দর ও ছন্দময় ভাষায় কথা বলা।' }
            ],
            antonyms: [
              { word: 'Inarticulate', meaningBn: 'অস্পষ্টভাষী', explanationBn: 'নিজের মনের ভাব গুছিয়ে বলতে অক্ষম।' },
              { word: 'Hesitant', meaningBn: 'দ্বিধাগ্রস্ত', explanationBn: 'কথা বলার সময় বারবার আটকে যাওয়া বা ইতস্তত করা।' },
              { word: 'Mumbling', meaningBn: 'অস্পষ্টভাবে বিড়বিড় করা', explanationBn: 'পরিষ্কার উচ্চারণ ছাড়া নিচু স্বরে কথা বলা।' },
              { word: 'Dull', meaningBn: 'নীরস, একঘেয়ে', explanationBn: 'আকর্ষণহীন ও প্রাণহীন বক্তব্য।' },
              { word: 'Halting', meaningBn: 'থেমে থেমে বলা', explanationBn: 'সাবলীলতার অভাবে থেমে থেমে কথা বলা।' }
            ]
          },
          {
            id: 'int-3',
            word: 'Inevitable',
            imageQuery: 'hourglass sand time passing inevitable',
            pos: 'Adjective',
            ipa: '/ɪnˈevɪtəbl/',
            meaningBn: 'অনিবার্য, যা এড়ানো যায় না',
            explanationEn: 'Certain to happen and impossible to avoid or prevent.',
            example: 'With consistent daily practice, steady improvement is inevitable.',
            exampleBn: 'নিয়মিত দৈনিক অনুশীলনের ফলে ধারাবাহিক উন্নতি অনিবার্য।',
            synonyms: [
              { word: 'Unavoidable', meaningBn: 'অপরিহার্য, এড়ানো অসম্ভব', explanationBn: 'যা কোনোভাবেই এড়িয়ে যাওয়া সম্ভব নয়।' },
              { word: 'Certain', meaningBn: 'নিশ্চিত', explanationBn: 'যা ঘটবেই বলে সম্পূর্ণ নিশ্চিত হওয়া যায়।' },
              { word: 'Assured', meaningBn: 'সুনিশ্চিত', explanationBn: 'সন্দেহাতীতভাবে নির্ধারিত ফলাফল।' },
              { word: 'Destined', meaningBn: 'নিয়তি নির্ধারিত', explanationBn: 'পূর্বনির্ধারিত বা অবশ্যম্ভাবী পরিণতি।' },
              { word: 'Inescapable', meaningBn: 'অবশ্যম্ভাবী', explanationBn: 'যার থেকে নিস্তার বা পালানোর পথ নেই।' }
            ],
            antonyms: [
              { word: 'Avoidable', meaningBn: 'এড়ানো সম্ভব এমন', explanationBn: 'সতর্ক থাকলে যা প্রতিরোধ বা এড়ানো যায়।' },
              { word: 'Uncertain', meaningBn: 'অনিশ্চিত', explanationBn: 'ঘটবে কি না তা নিশ্চিত নয়।' },
              { word: 'Preventable', meaningBn: 'প্রতিরোধযোগ্য', explanationBn: 'আগে থেকে ব্যবস্থা নিলে যা থামানো যায়।' },
              { word: 'Doubtful', meaningBn: 'সন্দেহজনক', explanationBn: 'ঘটার সম্ভাবনা কম বা অনিশ্চিত।' },
              { word: 'Optional', meaningBn: 'ঐচ্ছিক', explanationBn: 'বাধ্যতামূলক নয়, ইচ্ছার ওপর নির্ভরশীল।' }
            ]
          },
          {
            id: 'int-4',
            word: 'Meticulous',
            imageQuery: 'watchmaker magnifying glass gears meticulous',
            pos: 'Adjective',
            ipa: '/məˈtɪkjələs/',
            meaningBn: 'অত্যন্ত খুঁতখুঁতে ও নিখুঁত',
            explanationEn: 'Showing great attention to every small detail; very careful and precise.',
            example: 'The architect kept meticulous notes on every measurement of the bridge.',
            exampleBn: 'স্থপতি সেতুটির প্রতিটি পরিমাপের ওপর অত্যন্ত নিখুঁত নোট রেখেছিলেন।',
            synonyms: [
              { word: 'Precise', meaningBn: 'সুনির্দিষ্ট ও নির্ভুল', explanationBn: 'একদম সঠিক মাপ বা তথ্য অনুযায়ী কাজ করা।' },
              { word: 'Careful', meaningBn: 'সতর্ক ও যত্নশীল', explanationBn: 'ভুল এড়াতে অত্যন্ত মনোযোগ দিয়ে কাজ করা।' },
              { word: 'Scrupulous', meaningBn: 'নীতিবান ও নিখুঁত', explanationBn: 'প্রতিটি নিয়ম ও খুঁটিনাটি নিষ্ঠার সাথে মেনে চলা।' },
              { word: 'Detailed', meaningBn: 'বিস্তারিত', explanationBn: 'কোনো অংশ বাদ না দিয়ে সম্পূর্ণ বিবরণসহ করা।' },
              { word: 'Exact', meaningBn: 'যথাযথ', explanationBn: 'হুবহু সঠিক ও ত্রুটিমুক্ত।' }
            ],
            antonyms: [
              { word: 'Sloppy', meaningBn: 'অগোছালো ও অযত্নশীল', explanationBn: 'তাড়াহুড়ো করে ভুলভ্রান্তিসহ কাজ করা।' },
              { word: 'Careless', meaningBn: 'অসতর্ক', explanationBn: 'মনোযোগের অভাবে ভুল করা।' },
              { word: 'Hasty', meaningBn: 'তাড়াহুড়োপূর্ণ', explanationBn: 'পর্যাপ্ত সময় না নিয়ে দ্রুত সেরে ফেলা।' },
              { word: 'Neglectful', meaningBn: 'অবহেলাপূর্ণ', explanationBn: 'গুরুত্বপূর্ণ বিষয়ে নজর না দেওয়া।' },
              { word: 'Messy', meaningBn: 'বিশৃঙ্খল', explanationBn: 'পরিচ্ছন্নতা বা শৃঙ্খলার অভাব।' }
            ]
          },
          {
            id: 'int-5',
            word: 'Collaborate',
            imageQuery: 'teamwork puzzle collaboration brainstorming meeting',
            pos: 'Verb',
            ipa: '/kəˈlæbəreɪt/',
            meaningBn: 'একসাথে কাজ করা, সহযোগিতা করা',
            explanationEn: 'To work jointly with others to achieve a shared goal.',
            example: 'Students from different cities collaborate online to build science projects.',
            exampleBn: 'বিভিন্ন শহরের শিক্ষার্থীরা বিজ্ঞান প্রকল্প তৈরির জন্য অনলাইনে একসাথে কাজ করে।',
            synonyms: [
              { word: 'Cooperate', meaningBn: 'সহযোগিতা করা', explanationBn: 'পারস্পরিক সাহায্যের মাধ্যমে একসাথে কাজ এগিয়ে নেওয়া।' },
              { word: 'Partner', meaningBn: 'অংশীদার হওয়া', explanationBn: 'যৌথভাবে কোনো উদ্যোগ গ্রহণ করা।' },
              { word: 'Team up', meaningBn: 'দলবদ্ধ হওয়া', explanationBn: 'একটি দল হিসেবে একত্রিত হয়ে কাজ করা।' },
              { word: 'Unite', meaningBn: 'ঐক্যবদ্ধ হওয়া', explanationBn: 'একই উদ্দেশ্যে একসাথে যুক্ত হওয়া।' },
              { word: 'Coordinate', meaningBn: 'সমন্বয় করা', explanationBn: 'সবার কাজের মধ্যে সুশৃঙ্খল সংযোগ রাখা।' }
            ],
            antonyms: [
              { word: 'Compete', meaningBn: 'প্রতিযোগিতা করা', explanationBn: 'একে অপরকে ছাড়িয়ে যাওয়ার চেষ্টা করা।' },
              { word: 'Oppose', meaningBn: 'বিরোধিতা করা', explanationBn: 'কোনো কাজের বিপক্ষে অবস্থান নেওয়া।' },
              { word: 'Isolate', meaningBn: 'আলাদা থাকা', explanationBn: 'অন্যদের থেকে বিচ্ছিন্ন হয়ে একা কাজ করা।' },
              { word: 'Divide', meaningBn: 'বিভক্ত করা', explanationBn: 'একতা ভেঙে আলাদা করে ফেলা।' },
              { word: 'Hinder', meaningBn: 'বাধা সৃষ্টি করা', explanationBn: 'অন্যের কাজের গতি কমিয়ে দেওয়া।' }
            ]
          },
          {
            id: 'int-6',
            word: 'Insight',
            imageQuery: 'lightbulb idea insight revelation thinking',
            pos: 'Noun',
            ipa: '/ˈɪnsaɪt/',
            meaningBn: 'গভীর অন্তর্দৃষ্টি, সূক্ষ্ম উপলব্ধি',
            explanationEn: 'A deep and clear understanding of a complex person or situation.',
            example: 'Reading biographies gives valuable insight into how leaders overcome failure.',
            exampleBn: 'জীবনী পাঠ করলে নেতারা কীভাবে ব্যর্থতা জয় করেন সে সম্পর্কে মূল্যবান অন্তর্দৃষ্টি পাওয়া যায়।',
            synonyms: [
              { word: 'Understanding', meaningBn: 'বোধগম্যতা, উপলব্ধি', explanationBn: 'কোনো বিষয়ের মূল অর্থ গভীরভাবে বুঝতে পারা।' },
              { word: 'Perception', meaningBn: 'অনুধাবন ক্ষমতা', explanationBn: 'তীক্ষ্ণ দৃষ্টিতে সত্য বা বাস্তবতা চিনতে পারা।' },
              { word: 'Wisdom', meaningBn: 'প্রজ্ঞা, জ্ঞান', explanationBn: 'অভিজ্ঞতা ও গভীর চিন্তা থেকে অর্জিত জ্ঞান।' },
              { word: 'Clarity', meaningBn: 'স্বচ্ছতা', explanationBn: 'কোনো জটিল বিষয় পরিষ্কারভাবে দেখতে পাওয়া।' },
              { word: 'Awareness', meaningBn: 'সচেতনতা', explanationBn: 'চারপাশের বাস্তবতা সম্পর্কে সজাগ জ্ঞান।' }
            ],
            antonyms: [
              { word: 'Ignorance', meaningBn: 'অজ্ঞতা', explanationBn: 'কোনো বিষয় সম্পর্কে জ্ঞানের অভাব।' },
              { word: 'Confusion', meaningBn: 'বিভ্রান্তি', explanationBn: 'কোনো কিছু পরিষ্কারভাবে বুঝতে না পারার অবস্থা।' },
              { word: 'Blindness', meaningBn: 'অন্ধত্ব বা অদূরদর্শিতা', explanationBn: 'বাস্তব সত্য দেখতে বা বুঝতে না পারা।' },
              { word: 'Misunderstanding', meaningBn: 'ভুল বোঝাবুঝি', explanationBn: 'কোনো বিষয়ের ভুল অর্থ গ্রহণ করা।' },
              { word: 'Naivety', meaningBn: 'অনভিজ্ঞতা', explanationBn: 'বাস্তব জটিলতা সম্পর্কে ধারণার অভাব।' }
            ]
          }
        ],
        practiceExtraWords: [
          {
            id: 'int-7',
            word: 'Momentum',
            imageQuery: 'rolling boulder momentum physics velocity',
            ipa: '/məʊˈmentəm/',
            meaningBn: 'গতিবেগ, অগ্রগতির ধারা',
            explanationEn: 'The strength or force gained by continuous motion or progress.',
            example: 'Once you build study momentum, learning feels natural every day.',
            exampleBn: 'একবার পড়াশোনার গতি তৈরি হয়ে গেলে প্রতিদিন শেখাটা স্বাভাবিক মনে হয়।'
          },
          {
            id: 'int-8',
            word: 'Versatile',
            imageQuery: 'swiss army knife versatile multi-tool',
            ipa: '/ˈvɜːrsətaɪl/',
            meaningBn: 'বহুমুখী প্রতিভাধর বা ব্যবহারযোগ্য',
            explanationEn: 'Able to adapt or be used for many different functions or activities.',
            example: 'A versatile vocabulary helps you express ideas in any situation.',
            exampleBn: 'একটি বহুমুখী শব্দভান্ডার যেকোনো পরিস্থিতিতে আপনার ভাব প্রকাশ করতে সাহায্য করে।'
          }
        ],
        phrasalVerbs: [
          { phrase: 'Figure out', meaningBn: 'সমাধান বা অর্থ খুঁজে বের করা', example: 'It took me ten minutes to figure out the puzzle.', exampleBn: 'ধাঁধাটির সমাধান বের করতে আমার দশ মিনিট সময় লেগেছিল।' },
          { phrase: 'Carry on', meaningBn: 'চালিয়ে যাওয়া', example: 'Even when it rained, the runners decided to carry on.', exampleBn: 'বৃষ্টি শুরু হলেও দৌড়বিদরা দৌড় চালিয়ে যাওয়ার সিদ্ধান্ত নিলেন।' },
          { phrase: 'Look forward to', meaningBn: 'সাগ্রহে অপেক্ষা করা', example: 'I look forward to meeting you at the workshop.', exampleBn: 'কর্মশালায় আপনার সাথে দেখা করার জন্য আমি সাগ্রহে অপেক্ষা করছি।' },
          { phrase: 'Come up with', meaningBn: 'নতুন ধারণা বা পরিকল্পনা বের করা', example: 'She came up with a brilliant idea for our presentation.', exampleBn: 'সে আমাদের প্রেজেন্টেশনের জন্য একটি চমৎকার ধারণা বের করেছিল।' }
        ],
        idioms: [
          { idiom: 'Break the ice', meaningBn: 'জড়তা কাটিয়ে কথাবার্তা শুরু করা', example: 'The host told a funny story to break the ice at the meeting.', exampleBn: 'সভার শুরুতে জড়তা কাটানোর জন্য সঞ্চালক একটি মজার গল্প বললেন।' },
          { idiom: 'A blessing in disguise', meaningBn: 'আপাতদৃষ্টিতে খারাপ মনে হলেও আখেরে কল্যাণকর', example: 'Missing that train turned out to be a blessing in disguise.', exampleBn: 'ওই ট্রেনটি মিস করাটা শেষ পর্যন্ত শাপে বর হয়ে দাঁড়িয়েছিল।' },
          { idiom: 'Hit the nail on the head', meaningBn: 'একদম সঠিক কথা বলা', example: 'You hit the nail on the head with your analysis of the problem.', exampleBn: 'সমস্যাটির বিশ্লেষণে তুমি একদম সঠিক কথাটিই বলেছ।' },
          { idiom: 'Once in a blue moon', meaningBn: 'খুবই কদাচিৎ বা মাঝেমধ্যে', example: 'He lives abroad, so we see him once in a blue moon.', exampleBn: 'সে বিদেশে থাকে, তাই তাকে আমরা খুব কদাচিৎ দেখতে পাই।' }
        ],
        collocations: [
          { pair: 'Make progress', meaningBn: 'উন্নতি করা', example: 'You will make rapid progress if you read aloud daily.', exampleBn: 'প্রতিদিন উচ্চস্বরে পড়লে তুমি দ্রুত উন্নতি করবে।' },
          { pair: 'Take responsibility', meaningBn: 'দায়িত্ব গ্রহণ করা', example: 'Good leaders always take responsibility for their decisions.', exampleBn: 'ভালো নেতারা সবসময় তাদের সিদ্ধান্তের দায়িত্ব গ্রহণ করেন।' },
          { pair: 'Pay close attention', meaningBn: 'গভীর মনোযোগ দেওয়া', example: 'Pay close attention to how native speakers stress syllables.', exampleBn: 'নেটিভ স্পিকাররা কীভাবে শব্দাংশে জোর দেন সেদিকে গভীর মনোযোগ দাও।' },
          { pair: 'Reach a consensus', meaningBn: 'ঐকমত্যে পৌঁছানো', example: 'After an hour of discussion, the committee reached a consensus.', exampleBn: 'এক ঘণ্টা আলোচনার পর কমিটি একটি ঐকমত্যে পৌঁছাল।' }
        ],
        sentencePatterns: [
          { pattern: 'Not only + Aux + Subject..., but also...', meaningBn: 'শুধু এটিই নয়, বরং ওটিও...', example: 'Reading aloud not only improves pronunciation, but it also builds speaking confidence.', exampleBn: 'উচ্চস্বরে পড়া শুধু উচ্চারণই উন্নত করে না, বরং এটি কথা বলার আত্মবিশ্বাসও গড়ে তোলে।' },
          { pattern: 'The more + Subject + Verb, the more...', meaningBn: 'যত বেশি..., তত বেশি...', example: 'The more consistently you review words, the longer you remember them.', exampleBn: 'তুমি যত নিয়মিত শব্দগুলো রিভিশন দেবে, তত দীর্ঘদিন সেগুলো মনে রাখতে পারবে।' },
          { pattern: 'Despite / In spite of + Verb-ing, Clause', meaningBn: 'সত্ত্বেও...', example: 'Despite having a busy schedule, she practices English for twenty minutes every night.', exampleBn: 'ব্যস্ত সময়সূচি থাকা সত্ত্বেও সে প্রতিদিন রাতে বিশ মিনিট ইংরেজি অনুশীলন করে।' },
          { pattern: 'It is essential that + Subject + Base Verb', meaningBn: 'এটি অত্যন্ত জরুরি যে...', example: 'It is essential that every learner practice new words in full sentences.', exampleBn: 'এটি অত্যন্ত জরুরি যে প্রতিটি শিক্ষার্থী পূর্ণ বাক্যে নতুন শব্দ অনুশীলন করবে।' }
        ],
        stories: [
          {
            id: 'int-story-1',
            title: 'Story 1: The Architect of the Rooftop Forest (সবুজ ছাদ ও এক স্বপ্নদর্শী স্থপতির গল্প)',
            theme: 'Resilience, Sustainability & Meticulous Planning (স্থায়িত্ব ও বাস্তবমুখী প্রচেষ্টা)',
            readTime: '4 min read',
            moralBn: 'নিষ্ঠা ও বাস্তবমুখী চিন্তাভাবনার মাধ্যমে মানুষের সম্মিলিত উদ্যোগ যেকোনো শুষ্ক পরিবেশকে ফুলে-ফলে ভরিয়ে তুলতে পারে।',
            vocabularyFocus: ['Meticulous', 'Resilient', 'Pragmatic', 'Versatile', 'Flourish', 'Inevitable'],
            sentences: [
              { en: 'Living in a congested metropolis, architect Tanvir grew weary of the endless concrete and oppressive summer heat.', bn: 'এক যানজটপূর্ণ মহানগরীতে বাস করতে করতে স্থপতি তানভীর অন্তহীন কংক্রিট এবং অসহনীয় গ্রীষ্মের গরমে ক্লান্ত হয়ে পড়েছিলেন।' },
              { en: 'He conceived a bold plan to transform an abandoned communal rooftop into a lush, edible terrace garden.', bn: 'তিনি একটি পরিত্যক্ত যৌথ ছাদকে একটি সবুজ, ফলদ ও ওষধি উদ্ভিদের সতেজ উদ্যানে রূপান্তর করার একটি সাহসী পরিকল্পনা গ্রহণ করলেন।' },
              { en: 'Many cynical neighbors dismissed the idea, arguing that tropical storms would inevitably destroy the soil beds.', bn: 'অনেক হতাশাবাদী প্রতিবেশী এই ধারণাকে বাতিল করে দিয়ে দাবি করেছিল যে গ্রীষ্মমণ্ডলীয় ঝড় মাটির বেডগুলো অনিবার্যভাবেই ধ্বংস করে দেবে।' },
              { en: 'Undeterred, Tanvir relied on his meticulous research and designed lightweight planters with recycled rainwater reservoirs.', bn: 'নিরুৎসাহিত না হয়ে, তানভীর তার নিখুঁত গবেষণার ওপর নির্ভর করলেন এবং বৃষ্টির পানি সংরক্ষণের সুবিধাযুক্ত হালকা প্ল্যান্টার ডিজাইন করলেন।' },
              { en: 'He remained remarkably resilient even when a sudden monsoon gale knocked down their initial bamboo trellises.', bn: 'হঠাৎ বর্ষার ঝড়ো হাওয়া যখন তাদের প্রাথমিক বাঁশের মাচাগুলো ভেঙে দিল, তখনও তিনি অসাধারণভাবে অটল ও দৃঢ়প্রতিজ্ঞ রইলেন।' },
              { en: 'He adopted a pragmatic approach by consulting local farmers and substituting fragile vines with hardy medicinal plants.', bn: 'তিনি স্থানীয় কৃষকদের সাথে পরামর্শ করে এবং ভঙ্গুর লতার বদলে সহনশীল ওষধি গাছ লাগিয়ে একটি বাস্তবসম্মত কৌশল অবলম্বন করলেন।' },
              { en: 'Within six months, vibrant tomatoes, fresh mint, and sweet jasmine flourished across the rooftop.', bn: 'ছয় মাসের মধ্যে ছাদজুড়ে লাল টমেটো, তাজা পুদিনা এবং মিষ্টি বেলী ফুলের চমৎকার ফলন শুরু হলো।' },
              { en: 'The once-skeptical residents now gathered there every evening to sip tea and breathe clean, fragrant air.', bn: 'যে বাসিন্দারা একসময় সন্দেহ পোষণ করতেন, তারাই এখন প্রতিদিন সন্ধ্যায় চা পান করতে এবং নির্মল সুবাসিত বাতাস নিতে সেখানে সমবেত হন।' },
              { en: 'Tanvir showed that sustainable urban living begins when creative vision embraces patient craftsmanship.', bn: 'তানভীর দেখালেন যে টেকসই নগরজীবন তখনই শুরু হয় যখন সৃজনশীল দূরদৃষ্টির সাথে ধৈর্যশীল কাজের মেলবন্ধন ঘটে।' }
            ]
          },
          {
            id: 'int-story-2',
            title: 'Story 2: The Compass of the Deep Delta (মোহনার অভিযাত্রী ও প্রাচীন বাতিঘরের সন্ধান)',
            theme: 'Perseverance, Collaboration & Discovery (অধ্যবসায় ও সম্মিলিত গবেষণা)',
            readTime: '4 min read',
            moralBn: 'প্রযুক্তি যতই উন্নত হোক না কেন, উপস্থিত বুদ্ধি ও স্থানীয় অভিজ্ঞতার সম্মিলনই বড় বড় সংকট কাটিয়ে ওঠার শ্রেষ্ঠ হাতিয়ার।',
            vocabularyFocus: ['Navigate', 'Turbulent', 'Comprehensive', 'Collaborate', 'Perseverance'],
            sentences: [
              { en: 'A young team of marine biologists set sail into the southern delta to monitor endangered river dolphins.', bn: 'বিলুপ্তপ্রায় ডলফিন পর্যবেক্ষণের জন্য সামুদ্রিক জীববিজ্ঞানীদের একটি তরুণ দল দক্ষিণের মোহনায় যাত্রা শুরু করেছিল।' },
              { en: 'They carried sophisticated sensors to track salinity fluctuations across the vast mangrove tributaries.', bn: 'বিশাল সুন্দরবনের শাখা নদীগুলোতে লবণাক্ততার ওঠানামা ট্র্যাক করতে তারা অত্যাধুনিক সেন্সর বহন করছিলেন।' },
              { en: 'Midway through the expedition, their main navigation monitor malfunctioned under a sudden deluge.', bn: 'অভিযানের মাঝামাঝি সময়ে, আকস্মিক মুষলধারে বৃষ্টির কারণে তাদের মূল নেভিগেশন মনিটরটি বিকল হয়ে যায়।' },
              { en: 'Rather than succumbing to panic, the lead researcher navigated using traditional tidal charts and celestial cues.', bn: 'আতঙ্কিত না হয়ে, প্রধান গবেষক ঐতিহ্যবাহী জোয়ার-ভাটার চার্ট এবং আকাশের তারার সংকেত ব্যবহার করে জাহাজ পরিচালনা করলেন।' },
              { en: 'They sought temporary refuge near a historic coastal lighthouse that had guided merchant vessels for a century.', bn: 'তারা একটি ঐতিহাসিক উপকূলীয় বাতিঘরের কাছে অস্থায়ী আশ্রয় নিয়েছিল, যা এক শতাব্দী ধরে বাণিজ্যিক জাহাজগুলোকে পথ দেখিয়ে আসছে।' },
              { en: 'The elderly lighthouse keeper shared valuable oral history regarding the changing patterns of coastal siltation.', bn: 'প্রবীণ বাতিঘর রক্ষক উপকূলীয় পলি জমার পরিবর্তনশীল গতিপ্রকৃতি সম্পর্কে অত্যন্ত মূল্যবান মৌখিক অভিজ্ঞতা শেয়ার করলেন।' },
              { en: 'This unexpected encounter enriched the team’s scientific paper with invaluable contextual depth.', bn: 'এই অপ্রত্যাশিত সাক্ষাৎকারটি গবেষক দলের বৈজ্ঞানিক গবেষণাপত্রকে অমূল্য বাস্তব গভীরতা প্রদান করল।' },
              { en: 'When the expedition safely concluded, the researchers published a groundbreaking report on delta conservation.', bn: 'অভিযানটি সফলভাবে শেষ হওয়ার পর গবেষকরা বদ্বীপ সংরক্ষণের ওপর একটি যুগান্তকারী প্রতিবেদন প্রকাশ করেন।' },
              { en: 'Their journey proved that modern science flourishes best when coupled with the humble wisdom of local tradition.', bn: 'তাদের এই যাত্রা প্রমাণ করল যে আধুনিক বিজ্ঞান তখনই সবচেয়ে বেশি সমৃদ্ধ হয় যখন তা স্থানীয় ঐতিহ্যের প্রজ্ঞার সাথে যুক্ত হয়।' }
            ]
          }
        ],
        newspaperSentences: [
          {
            id: 'news-int-1',
            source: 'The Daily Star',
            category: 'Environment & Climate',
            headline: 'Urban greening vital to counter rising heat island effect in Dhaka',
            sentence: 'Urban environmental experts emphasized that restoring lost canals and expanding the tree canopy across the capital is indispensable to combatting severe heat stress.',
            sentenceBn: 'নগর পরিবেশ বিশেষজ্ঞরা জোর দিয়ে বলেন যে, হারিয়ে যাওয়া খালগুলো পুনরুদ্ধার এবং রাজধানীজুড়ে গাছের আচ্ছাদন সম্প্রসারণ করা তীব্র তাপদাহ মোকাবেলায় অপরিহার্য।',
            keyWord: 'Indispensable',
            keyWordMeaningBn: 'অপরিহার্য বা অত্যন্ত প্রয়োজনীয়',
            editorialNote: 'পত্রিকার পরিবেশ ও নগর উন্নয়ন বিষয়ক প্রতিবেদনে কোনো সমাধানের চরম প্রয়োজনীয়তা বোঝাতে "indispensable" শব্দটি বহুল ব্যবহৃত।'
          },
          {
            id: 'news-int-2',
            source: 'The Guardian',
            category: 'Global Education',
            headline: 'Community libraries transform literacy rates in rural river deltas',
            sentence: 'The educational initiative demonstrated that community-led mobile libraries can successfully foster independent reading habits among young students.',
            sentenceBn: 'এই শিক্ষামূলক উদ্যোগটি প্রদর্শন করেছে যে সমাজের নেতৃত্বে পরিচালিত ভ্রাম্যমাণ লাইব্রেরিগুলো তরুণ শিক্ষার্থীদের মধ্যে স্বাধীনভাবে পড়ার অভ্যাস সফলভাবে গড়ে তুলতে ও লালন করতে পারে।',
            keyWord: 'Foster',
            keyWordMeaningBn: 'লালন করা, গড়ে তোলা বা উৎসাহিত করা',
            editorialNote: 'সংবাদপত্রের শিরোনাম ও সম্পাদকীয়তে ইতিবাচক অভ্যাস বা সম্পর্ককে উৎসাহিত করা অর্থে "foster" শব্দটি একটি প্রিয় পছন্দ।'
          },
          {
            id: 'news-int-3',
            source: 'BBC News',
            category: 'Renewable Energy',
            headline: 'Offshore wind expansion hits record capacity across coastal regions',
            sentence: 'Energy analysts observed that modern turbine efficiency has made renewable generation far more viable and economically competitive than fossil fuels.',
            sentenceBn: 'জ্বালানি বিশ্লেষকরা লক্ষ্য করেছেন যে আধুনিক টারবাইনের কার্যক্ষমতা নবায়নযোগ্য বিদ্যুৎ উৎপাদনকে জীবাশ্ম জ্বালানির তুলনায় অনেক বেশি টেকসই ও লাভজনক করেছে।',
            keyWord: 'Viable',
            keyWordMeaningBn: 'কার্যকর, টেকসই বা বাস্তবসম্মত',
            editorialNote: 'অর্থনৈতিক বা প্রযুক্তিগত সম্ভাব্যতা বোঝাতে সংবাদমাধ্যমে "commercially viable" বা "economically viable" কলোকেশন অত্যন্ত জনপ্রিয়।'
          },
          {
            id: 'news-int-4',
            source: 'Reuters',
            category: 'Economy & Agriculture',
            headline: 'Smallholder farmers adopt drought-tolerant seeds amid erratic monsoons',
            sentence: 'Agricultural economists noted that smallholder farmers showed remarkable resilience by switching to flood-tolerant hybrid crops during the unpredictable monsoon.',
            sentenceBn: 'কৃষি অর্থনীতিবিদরা উল্লেখ করেছেন যে অনাকাঙ্ক্ষিত বর্ষার মৌসুমে বন্যা-সহনশীল হাইব্রিড ফসলে স্থানান্তরিত হয়ে ক্ষুদ্র কৃষকরা অসাধারণ স্থিতিস্থাপকতা ও ঘুরে দাঁড়ানোর ক্ষমতা দেখিয়েছেন।',
            keyWord: 'Resilience',
            keyWordMeaningBn: 'স্থিতিস্থাপকতা, ঘুরে দাঁড়ানোর অদম্য ক্ষমতা',
            editorialNote: 'অর্থনৈতিক মন্দা, জলবায়ু সংকট বা দুর্বিপাক থেকে দ্রুত সেরে ওঠার ক্ষমতা বোঝাতে সংবাদপত্রে "resilience" শব্দটি সর্বাধিক ব্যবহৃত।'
          },
          {
            id: 'news-int-5',
            source: 'The Daily Star',
            category: 'Public Health',
            headline: 'Mobile health clinics bring specialized care to remote char communities',
            sentence: 'Healthcare administrators confirmed that mobile telemedicine units provide a comprehensive network of diagnostic screening for families living in isolated river islands.',
            sentenceBn: 'স্বাস্থ্য প্রশাসকরা নিশ্চিত করেছেন যে ভ্রাম্যমাণ টেলিমেডিসিন ইউনিটগুলো দুর্গম চরাঞ্চলে বসবাসকারী পরিবারগুলোর জন্য রোগ নির্ণয়ের একটি সমন্বিত ও ব্যাপক নেটওয়ার্ক প্রদান করছে।',
            keyWord: 'Comprehensive',
            keyWordMeaningBn: 'ব্যাপক, সমন্বিত ও পূর্ণাঙ্গ',
            editorialNote: 'পত্রিকায় কোনো সরকারি পরিকল্পনা, নীতি বা সেবার পূর্ণাঙ্গ রূপ প্রকাশ করতে "comprehensive plan/strategy" বহুল ব্যবহৃত।'
          },
          {
            id: 'news-int-6',
            source: 'The Independent',
            category: 'Technology & Skills',
            headline: 'Youth coding bootcamps bridge digital divide in developing districts',
            sentence: 'Industry mentors highlighted that mastering software fundamentals enables young graduates to adapt quickly to fast-evolving global workplace demands.',
            sentenceBn: 'শিল্প মেন্টররা গুরুত্ব সহকারে বলেন যে সফটওয়্যার তৈরির মূল বিষয়গুলো আয়ত্ত করা তরুণ গ্র্যাজুয়েটদের দ্রুত পরিবর্তনশীল বৈশ্বিক কর্মক্ষেত্রের চাহিদার সাথে খাপ খাইয়ে নিতে সহায়তা করে।',
            keyWord: 'Adapt',
            keyWordMeaningBn: 'খাপ খাওয়ানো, মানিয়ে নেওয়া',
            editorialNote: 'কর্মক্ষেত্রের পরিবর্তন এবং আধুনিক প্রযুক্তির সাথে মানিয়ে নেওয়া প্রসঙ্গে পত্রিকায় "adaptability" ও "adapt to" ব্যাপকভাবে ব্যবহৃত হয়।'
          }
        ]
      },

      /* -------------------------------------------------------------------
         LEVEL 3: ADVANCED
      -------------------------------------------------------------------- */
      advanced: {
        id: 'advanced',
        title: 'Advanced',
        bengaliSubtitle: 'C1–C2 একাডেমিক শব্দভান্ডার, Formal Transformations, Word Formation এবং বিশ্লেষণধর্মী পাঠ',
        words: [
          {
            id: 'adv-1',
            word: 'Ephemeral',
            imageQuery: 'cherry blossom petals morning dew ephemeral',
            pos: 'Adjective',
            ipa: '/ɪˈfemərəl/',
            meaningBn: 'ক্ষণস্থায়ী, স্বল্পস্থায়ী',
            explanationEn: 'Lasting for a very short, fleeting period of time.',
            example: 'Morning mist over the river is ephemeral, vanishing as soon as the sun rises.',
            exampleBn: 'নদীর ওপর সকালের কুয়াশা ক্ষণস্থায়ী, সূর্য ওঠার সাথে সাথেই তা মিলিয়ে যায়।',
            synonyms: [
              { word: 'Fleeting', meaningBn: 'দ্রুত বিলীন হয় এমন', explanationBn: 'চোখের পলকে চলে যায় এমন স্বল্পস্থায়ী মুহূর্ত।' },
              { word: 'Transient', meaningBn: 'অস্থায়ী, ক্ষণিক', explanationBn: 'এক জায়গায় বা অবস্থায় বেশিক্ষণ স্থায়ী হয় না এমন।' },
              { word: 'Momentary', meaningBn: 'মুহূর্তমাত্র স্থায়ী', explanationBn: 'মাত্র কয়েক মুহূর্তের জন্য স্থায়ী হয় এমন।' },
              { word: 'Brief', meaningBn: 'সংক্ষিপ্ত', explanationBn: 'সময়কালের দিক থেকে খুব ছোট।' },
              { word: 'Short-lived', meaningBn: 'স্বল্পায়ু', explanationBn: 'খুব অল্প সময়ের জন্য টিকে থাকে এমন।' }
            ],
            antonyms: [
              { word: 'Permanent', meaningBn: 'স্থায়ী, চিরস্থায়ী', explanationBn: 'যা দীর্ঘকাল বা সবসময়ের জন্য অপরিবর্তিত থাকে।' },
              { word: 'Eternal', meaningBn: 'অনন্ত, শাশ্বত', explanationBn: 'যার কোনো শুরু বা শেষ নেই।' },
              { word: 'Enduring', meaningBn: 'দীর্ঘস্থায়ী ও সহনশীল', explanationBn: 'সময়ের পরীক্ষায় টিকে থাকে এমন।' },
              { word: 'Perpetual', meaningBn: 'চিরন্তন, অবিরাম', explanationBn: 'বিরতিহীনভাবে চলতে থাকে এমন।' },
              { word: 'Lasting', meaningBn: 'টেকসই', explanationBn: 'দীর্ঘ সময় ধরে প্রভাব বজায় রাখে এমন।' }
            ]
          },
          {
            id: 'adv-2',
            word: 'Ubiquitous',
            imageQuery: 'smartphone global internet connectivity ubiquitous',
            pos: 'Adjective',
            ipa: '/juːˈbɪkwɪtəs/',
            meaningBn: 'সর্বব্যাপী, সর্বত্র বিরাজমান',
            explanationEn: 'Present, appearing, or found everywhere at the same time.',
            example: 'Smartphones have become ubiquitous tools in modern academic and social life.',
            exampleBn: 'আধুনিক একাডেমিক ও সামাজিক জীবনে স্মার্টফোন সর্বব্যাপী যন্ত্রে পরিণত হয়েছে।',
            synonyms: [
              { word: 'Omnipresent', meaningBn: 'সর্বত্র উপস্থিত', explanationBn: 'একই সময়ে সব জায়গায় বিদ্যমান থাকা।' },
              { word: 'Pervasive', meaningBn: 'ব্যাপকভাবে বিস্তৃত', explanationBn: 'সমাজের বা পরিবেশের সর্বত্র ছড়িয়ে পড়া।' },
              { word: 'Universal', meaningBn: 'সর্বজনীন', explanationBn: 'সকলের কাছে বা সব স্থানে প্রযোজ্য।' },
              { word: 'Widespread', meaningBn: 'বিস্তৃত', explanationBn: 'বিশাল এলাকা জুড়ে ছড়িয়ে থাকা।' },
              { word: 'Ever-present', meaningBn: 'সদা বিদ্যমান', explanationBn: 'সবসময় উপস্থিত থাকে এমন।' }
            ],
            antonyms: [
              { word: 'Rare', meaningBn: 'বিরল, দুর্লভ', explanationBn: 'যা খুব কম জায়গায় বা কদাচিৎ দেখা যায়।' },
              { word: 'Scarce', meaningBn: 'অপ্রতুল', explanationBn: 'প্রয়োজনের তুলনায় খুব কম পরিমাণে থাকা।' },
              { word: 'Localized', meaningBn: 'সীমাবদ্ধ এলাকাভিত্তিক', explanationBn: 'কেবল নির্দিষ্ট একটি ছোট অঞ্চলে সীমাবদ্ধ।' },
              { word: 'Uncommon', meaningBn: 'অসাধারণ বা বিরল', explanationBn: 'সচরাচর দেখা যায় না এমন।' },
              { word: 'Isolated', meaningBn: 'বিচ্ছিন্ন', explanationBn: 'মূল ধারা থেকে আলাদা হয়ে থাকা।' }
            ]
          },
          {
            id: 'adv-3',
            word: 'Pragmatic',
            imageQuery: 'practical architect blueprint construction pragmatic',
            pos: 'Adjective',
            ipa: '/præɡˈmætɪk/',
            meaningBn: 'বাস্তববাদী, প্রয়োগবাদী',
            explanationEn: 'Dealing with problems sensibly and realistically based on practical outcomes.',
            example: 'A pragmatic policy focuses on measurable results rather than abstract theory.',
            exampleBn: 'একটি বাস্তববাদী নীতি বিমূর্ত তত্ত্বের চেয়ে পরিমাপযোগ্য ফলাফলের ওপর গুরুত্ব দেয়।',
            synonyms: [
              { word: 'Practical', meaningBn: 'ব্যবহারিক ও বাস্তবসম্মত', explanationBn: 'বাস্তব জীবনে কাজে লাগানো যায় এমন।' },
              { word: 'Realistic', meaningBn: 'বাস্তবধর্মী', explanationBn: 'কল্পনা নয় বরং বাস্তব পরিস্থিতি বিবেচনা করে সিদ্ধান্ত নেওয়া।' },
              { word: 'Sensible', meaningBn: 'বিচক্ষণ, যুক্তিসঙ্গত', explanationBn: 'সুস্থ বুদ্ধি ও বিবেচনাপ্রসূত।' },
              { word: 'Rational', meaningBn: 'যুক্তিবাদী', explanationBn: 'আবেগের বদলে যুক্তির ওপর ভিত্তি করে চলা।' },
              { word: 'Matter-of-fact', meaningBn: 'সরাসরি ও বাস্তবমুখী', explanationBn: 'অতিরিক্ত আবেগ ছাড়া সোজাসুজি বাস্তব কথা বলা।' }
            ],
            antonyms: [
              { word: 'Idealistic', meaningBn: 'আদর্শবাদী (অবাস্তব কল্পনাপ্রবণ)', explanationBn: 'বাস্তব সীমাবদ্ধতা ভুলে নিখুঁত আদর্শের কল্পনা করা।' },
              { word: 'Impractical', meaningBn: 'অবাস্তব', explanationBn: 'বাস্তবে প্রয়োগ করা কঠিন বা অসম্ভব।' },
              { word: 'Visionary', meaningBn: 'কাল্পনিক বা স্বপ্নদর্শী', explanationBn: 'বর্তমান বাস্তবতার চেয়ে দূরের কল্পনায় মগ্ন।' },
              { word: 'Irrational', meaningBn: 'অযৌক্তিক', explanationBn: 'যুক্তি বা বাস্তবতার সাথে সঙ্গতিহীন।' },
              { word: 'Quixotic', meaningBn: 'অতি কাল্পনিক', explanationBn: 'অবাস্তব ও রোমান্টিক কল্পনায় বিভোর।' }
            ]
          },
          {
            id: 'adv-4',
            word: 'Scrutinize',
            imageQuery: 'magnifying glass examining document forensic scrutinize',
            pos: 'Verb',
            ipa: '/ˈskruːtənaɪz/',
            meaningBn: 'খুঁটিয়ে পরীক্ষা করা, চুলচেরা বিশ্লেষণ করা',
            explanationEn: 'To examine or inspect something closely and thoroughly.',
            example: 'Peer reviewers scrutinize every statistical claim before publishing a research paper.',
            exampleBn: 'গবেষণাপত্র প্রকাশের আগে সমপর্যায়ের পর্যালোচকরা প্রতিটি পরিসংখ্যানগত দাবি খুঁটিয়ে পরীক্ষা করেন।',
            synonyms: [
              { word: 'Examine', meaningBn: 'পরীক্ষা করা', explanationBn: 'গভীর মনোযোগ দিয়ে কোনো কিছু যাচাই করা।' },
              { word: 'Inspect', meaningBn: 'পরিদর্শন ও যাচাই করা', explanationBn: 'ত্রুটি বা মান যাচাইয়ের জন্য কাছ থেকে দেখা।' },
              { word: 'Analyze', meaningBn: 'বিশ্লেষণ করা', explanationBn: 'কোনো বিষয়কে ছোট ছোট অংশে ভাগ করে বোঝা।' },
              { word: 'Investigate', meaningBn: 'তদন্ত বা অনুসন্ধান করা', explanationBn: 'সত্য উদঘাটনের জন্য গভীরভাবে খোঁজ নেওয়া।' },
              { word: 'Audit', meaningBn: 'নিরীক্ষা করা', explanationBn: 'আনুষ্ঠানিকভাবে হিসাব বা তথ্যের নির্ভুলতা যাচাই করা।' }
            ],
            antonyms: [
              { word: 'Overlook', meaningBn: 'উপেক্ষা করা বা চোখ এড়িয়ে যাওয়া', explanationBn: 'কোনো ভুল বা তথ্য লক্ষ্য না করে বাদ দেওয়া।' },
              { word: 'Glance', meaningBn: 'একনজর তাকানো', explanationBn: 'গভীরভাবে না দেখে দ্রুত চোখ বুলিয়ে নেওয়া।' },
              { word: 'Ignore', meaningBn: 'অগ্রাহ্য করা', explanationBn: 'ইচ্ছাকৃতভাবে কোনো বিষয়ে মনোযোগ না দেওয়া।' },
              { word: 'Skim', meaningBn: 'ভাসাভাসা পড়া', explanationBn: 'বিস্তারিত না পড়ে ওপর ওপর দেখে যাওয়া।' },
              { word: 'Neglect', meaningBn: 'অবহেলা করা', explanationBn: 'যথাযথ যত্ন বা পরীক্ষা না করা।' }
            ]
          },
          {
            id: 'adv-5',
            word: 'Quintessential',
            imageQuery: 'classic vintage pocket watch quintessential',
            pos: 'Adjective',
            ipa: '/ˌkwɪntɪˈsenʃl/',
            meaningBn: 'সর্বোৎকৃষ্ট, আদর্শ ও খাঁটি উদাহরণস্বরূপ',
            explanationEn: 'Representing the most perfect or typical example of a quality or class.',
            example: 'She is the quintessential scholar, combining deep curiosity with rigorous discipline.',
            exampleBn: 'তিনি একজন আদর্শ গবেষকের সর্বোৎকৃষ্ট উদাহরণ, যিনি গভীর কৌতূহলের সাথে কঠোর শৃঙ্খলার সমন্বয় ঘটিয়েছেন।',
            synonyms: [
              { word: 'Archetypal', meaningBn: 'আদি ও আদর্শরূপ', explanationBn: 'কোনো শ্রেণির মূল বা আদর্শ বৈশিষ্ট্য বহন করে এমন।' },
              { word: 'Classic', meaningBn: 'চিরায়ত ও উৎকৃষ্ট', explanationBn: 'সর্বজনস্বীকৃত এবং সর্বোচ্চ মানের উদাহরণ।' },
              { word: 'Definitive', meaningBn: 'চূড়ান্ত ও প্রামাণ্য', explanationBn: 'যা সবচেয়ে নির্ভরযোগ্য ও পূর্ণাঙ্গ মানদণ্ড হিসেবে বিবেচিত।' },
              { word: 'Exemplary', meaningBn: 'অনুকরণীয় ও আদর্শ', explanationBn: 'অন্যদের জন্য অনুসরণযোগ্য সেরা উদাহরণ।' },
              { word: 'Ultimate', meaningBn: 'চরম ও সর্বোচ্চ', explanationBn: 'উৎকর্ষের সর্বোচ্চ পর্যায়ে পৌঁছেছে এমন।' }
            ],
            antonyms: [
              { word: 'Atypical', meaningBn: 'অস্বাভাবিক বা ব্যতিক্রমী', explanationBn: 'সাধারণ বা আদর্শ বৈশিষ্ট্যের সাথে মেলে না এমন।' },
              { word: 'Uncharacteristic', meaningBn: 'বৈশিষ্ট্যহীন', explanationBn: 'স্বাভাবিক প্রকৃতির বিপরীত আচরণ বা রূপ।' },
              { word: 'Flawed', meaningBn: 'ত্রুটিপূর্ণ', explanationBn: 'যার মধ্যে অপূর্ণতা বা ভুল রয়েছে।' },
              { word: 'Mediocre', meaningBn: 'মাঝারি বা সাধারণ মানের', explanationBn: 'বিশেষ কোনো উৎকর্ষহীন গড়পড়তা মান।' },
              { word: 'Anomalous', meaningBn: 'ব্যতিক্রমধর্মী ও অসঙ্গত', explanationBn: 'স্বাভাবিক নিয়ম বা মানদণ্ড থেকে বিচ্যুত।' }
            ]
          },
          {
            id: 'adv-6',
            word: 'Ambiguous',
            imageQuery: 'foggy forest crossroads diverging path ambiguous',
            pos: 'Adjective',
            ipa: '/æmˈbɪɡjuəs/',
            meaningBn: 'দ্ব্যর্থক, অস্পষ্ট বা একাধিক অর্থবোধক',
            explanationEn: 'Open to more than one interpretation; not having one obvious meaning.',
            example: 'The wording of the contract was ambiguous and required legal clarification.',
            exampleBn: 'চুক্তিপত্রের ভাষা ছিল দ্ব্যর্থক এবং এর জন্য আইনি ব্যাখ্যার প্রয়োজন হয়েছিল।',
            synonyms: [
              { word: 'Unclear', meaningBn: 'অস্পষ্ট', explanationBn: 'যা সহজে বা পরিষ্কারভাবে বোঝা যায় না।' },
              { word: 'Vague', meaningBn: 'আবছা, অনিশ্চিত', explanationBn: 'সুনির্দিষ্ট নয় এমন বক্তব্য বা ধারণা।' },
              { word: 'Equivocal', meaningBn: 'দ্ব্যর্থবোধক', explanationBn: 'দুই বা ততোধিক অর্থ প্রকাশ করে এমন।' },
              { word: 'Cryptic', meaningBn: 'রহস্যময় ও দুর্বোধ্য', explanationBn: 'গোপন বা সহজে বোধগম্য নয় এমন অর্থযুক্ত।' },
              { word: 'Obscure', meaningBn: 'দুর্বোধ্য', explanationBn: 'সাধারণ পাঠকের কাছে অস্পষ্ট বা অজানা।' }
            ],
            antonyms: [
              { word: 'Explicit', meaningBn: 'সুস্পষ্ট ও দ্ব্যর্থহীন', explanationBn: 'কোনো অস্পষ্টতা ছাড়াই সরাসরি ব্যক্ত করা।' },
              { word: 'Clear', meaningBn: 'পরিষ্কার', explanationBn: 'সহজেই বোধগম্য ও স্বচ্ছ।' },
              { word: 'Unambiguous', meaningBn: 'একান্ত সুনির্দিষ্ট', explanationBn: 'যার কেবল একটিই স্পষ্ট অর্থ রয়েছে।' },
              { word: 'Definite', meaningBn: 'নিশ্চিত ও নির্দিষ্ট', explanationBn: 'সুনির্দিষ্ট সীমা বা অর্থযুক্ত।' },
              { word: 'Lucid', meaningBn: 'প্রাঞ্জল ও সহজবোধ্য', explanationBn: 'অত্যন্ত পরিষ্কার ও সাবলীলভাবে প্রকাশিত।' }
            ]
          }
        ],
        practiceExtraWords: [
          {
            id: 'adv-7',
            word: 'Nuance',
            imageQuery: 'artist oil paint color palette blending nuance',
            ipa: '/ˈnjuːɑːns/',
            meaningBn: 'সূক্ষ্ম পার্থক্য বা ভাবের সূক্ষ্মতা',
            explanationEn: 'A subtle difference in meaning, expression, or sound.',
            example: 'Mastering nuance allows writers to convey complex emotions effortlessly.',
            exampleBn: 'ভাবের সূক্ষ্মতা আয়ত্ত করলে লেখকরা জটিল অনুভূতিগুলো অনায়াসে প্রকাশ করতে পারেন।'
          },
          {
            id: 'adv-8',
            word: 'Synthesis',
            imageQuery: 'chemistry flask laboratory synthesis reaction',
            ipa: '/ˈsɪnθəsɪs/',
            meaningBn: 'সমন্বয়, সংশ্লেষণ',
            explanationEn: 'The combination of separate ideas or elements to form a coherent whole.',
            example: 'Her essay offers a brilliant synthesis of history and modern economics.',
            exampleBn: 'তার প্রবন্ধটি ইতিহাস এবং আধুনিক অর্থনীতির এক চমৎকার সমন্বয় উপস্থাপন করে।'
          }
        ],
        academicVocabulary: [
          { term: 'Empirical', ipa: '/ɪmˈpɪrɪkl/', meaningBn: 'অভিজ্ঞতালব্ধ ও পর্যবেক্ষণভিত্তিক', example: 'Scientists require empirical evidence before accepting any new theory.', exampleBn: 'নতুন কোনো তত্ত্ব গ্রহণের আগে বিজ্ঞানীদের অভিজ্ঞতালব্ধ প্রমাণের প্রয়োজন হয়।' },
          { term: 'Paradigm', ipa: '/ˈpærədaɪm/', meaningBn: 'দৃষ্টান্ত বা তাত্ত্বিক কাঠামো', example: 'Renewable technology created a new paradigm in global energy planning.', exampleBn: 'নবায়নযোগ্য প্রযুক্তি বৈশ্বিক জ্বালানি পরিকল্পনায় একটি নতুন দৃষ্টান্ত তৈরি করেছে।' },
          { term: 'Corroborate', ipa: '/kəˈrɒbəreɪt/', meaningBn: 'অতিরিক্ত তথ্য দিয়ে সমর্থন করা', example: 'Independent archive records corroborate the historian’s primary argument.', exampleBn: 'স্বতন্ত্র আর্কাইভ নথিগুলো ঐতিহাসিকের মূল যুক্তিকে সমর্থন করে।' },
          { term: 'Dichotomy', ipa: '/daɪˈkɒtəmi/', meaningBn: 'দ্বিবিভাজন বা দুটি বিপরীত ধারার পার্থক্য', example: 'The lecture examined the dichotomy between theoretical models and daily practice.', exampleBn: 'বক্তৃতাটিতে তাত্ত্বিক মডেল এবং দৈনন্দিন অনুশীলনের মধ্যকার পার্থক্য বিশ্লেষণ করা হয়েছিল।' }
        ],
        formalTransformations: [
          { casual: 'Find out more about', formal: 'Investigate / Ascertain', meaningBn: 'আরও তথ্য অনুসন্ধান বা নিশ্চিত করা', example: 'The committee will ascertain the root causes of the delay.', exampleBn: 'কমিটি বিলম্বের মূল কারণগুলো অনুসন্ধান করে নিশ্চিত করবে।' },
          { casual: 'Give a lot of help', formal: 'Provide substantial assistance', meaningBn: 'উল্লেখযোগ্য সহায়তা প্রদান করা', example: 'Local libraries provide substantial assistance to independent researchers.', exampleBn: 'স্থানীয় গ্রন্থাগারগুলো স্বতন্ত্র গবেষকদের উল্লেখযোগ্য সহায়তা প্রদান করে।' },
          { casual: 'Show clearly', formal: 'Demonstrate unequivocally', meaningBn: 'দ্ব্যর্থহীনভাবে প্রমাণ বা প্রদর্শন করা', example: 'Recent trials demonstrate unequivocally that early intervention works.', exampleBn: 'সাম্প্রতিক পরীক্ষাগুলো দ্ব্যর্থহীনভাবে প্রমাণ করে যে প্রাথমিক পদক্ষেপ কার্যকর।' },
          { casual: 'Fix the problem', formal: 'Rectify the discrepancy', meaningBn: 'ত্রুটি বা অসঙ্গতি সংশোধন করা', example: 'Engineers worked overnight to rectify the discrepancy in the dataset.', exampleBn: 'প্রকৌশলীরা ডেটাসেটের অসঙ্গতি সংশোধনের জন্য রাতভর কাজ করেছেন।' }
        ],
        wordFormation: [
          { root: 'Analyze (Verb)', forms: 'Analysis (Noun) • Analytical (Adj) • Analytically (Adv)', example: 'Analytical thinking helps break complex problems into clear steps.', exampleBn: 'বিশ্লেষণাত্মক চিন্তাভাবনা জটিল সমস্যাকে স্পষ্ট ধাপে ভাগ করতে সাহায্য করে।' },
          { root: 'Innovate (Verb)', forms: 'Innovation (Noun) • Innovative (Adj) • Innovatively (Adv)', example: 'Continuous innovation drives sustainable progress in science.', exampleBn: 'নিরবচ্ছিন্ন উদ্ভাবন বিজ্ঞানে টেকসই অগ্রগতি ত্বরান্বিত করে।' },
          { root: 'Cohere (Verb)', forms: 'Coherence (Noun) • Coherent (Adj) • Coherently (Adv)', example: 'A coherent argument connects evidence logically from start to finish.', exampleBn: 'একটি সুসংগত যুক্তি শুরু থেকে শেষ পর্যন্ত প্রমাণগুলোকে যৌক্তিকভাবে যুক্ত করে।' },
          { root: 'Perceive (Verb)', forms: 'Perception (Noun) • Perceptive (Adj) • Perceptively (Adv)', example: 'Perceptive observers notice subtle patterns others easily miss.', exampleBn: 'তীক্ষ্ণ পর্যবেক্ষকরা এমন সূক্ষ্ম ধরন লক্ষ্য করেন যা অন্যরা সহজেই এড়িয়ে যায়।' }
        ],
        stories: [
          {
            id: 'adv-story-1',
            title: 'Passage 1: The Symphony of Forgotten Scripts (লুপ্ত লিপির সুর ও ভাষাতাত্ত্বিক আবিষ্কারের কাহিনী)',
            theme: 'Linguistics, Cultural Heritage & Intellectual Discovery (ভাষাতত্ত্ব ও সাংস্কৃতিক ঐতিহ্য)',
            readTime: '5 min read',
            moralBn: 'ইতিহাস ও হারিয়ে যাওয়া ভাষার পুনরুদ্ধার কেবল অতীতকে জানা নয়, বরং মানব সভ্যতার শিকড়কে সম্মান জানিয়ে ভবিষ্যতের পথকে সমৃদ্ধ করা।',
            vocabularyFocus: ['Ubiquitous', 'Eloquent', 'Paradigm', 'Profound', 'Articulate', 'Empirical'],
            sentences: [
              { en: 'High in a mist-shrouded monastery in the eastern highlands, Dr. Aranya discovered a brittle manuscript dating back eight centuries.', bn: 'পূর্বের পাহাড়ি অঞ্চলের কুয়াশাচ্ছন্ন এক প্রাচীন মঠে ড. অরণ্য আট শতাব্দী আগের একটি ভঙ্গুর প্রাচীন পাণ্ডুলিপি আবিষ্কার করেন।' },
              { en: 'The parchment was inscribed in an obsolete dialect that previous philologists had deemed virtually indecipherable.', bn: 'চামড়ার পাণ্ডুলিপিটিতে এমন একটি বিলুপ্ত উপভাষায় লেখা ছিল যা পূর্ববর্তী ভাষাতাত্ত্বিকরা প্রায় দুর্বোধ্য বলে বিবেচনা করেছিলেন।' },
              { en: 'Rather than relying solely on conventional methods, she employed an innovative linguistic paradigm combining morphology and computational archaeology.', bn: 'কেবলমাত্র প্রথাগত পদ্ধতির ওপর নির্ভর না করে, তিনি রূপমূলতত্ত্ব এবং কম্পিউটেশনাল প্রত্নতত্ত্বের সমন্বয়ে একটি উদ্ভাবনী ভাষাগত প্যারাডাইম প্রয়োগ করলেন।' },
              { en: 'She recognized that the text articulated profound metaphysical insights concerning ecological harmony and agricultural cycles.', bn: 'তিনি বুঝতে পেরেছিলেন যে এই পাঠ্যাংশটিতে পরিবেশগত ভারসাম্য এবং কৃষিচক্র সম্পর্কিত গভীর আত্মতাত্ত্বিক উপলব্ধি তুলে ধরা হয়েছে।' },
              { en: 'Each meticulously reconstructed stanza revealed eloquent metaphors comparing human sorrow to the seasonal recession of floodwaters.', bn: 'নিখুঁতভাবে পুনর্গঠিত প্রতিটি শ্লোকে এমন প্রাঞ্জল রূপক প্রকাশ পেল যা মানুষের দুঃখকষ্টকে বন্যার পানির মৌসুমী নেমে যাওয়ার সাথে তুলনা করেছে।' },
              { en: 'Her research demonstrated that seemingly archaic vocabularies preserve quintessential cultural wisdom essential for modern sustainability.', bn: 'তার গবেষণা প্রদর্শন করেছে যে আপাতদৃষ্টিতে প্রাচীন শব্দভান্ডারও আধুনিক টেকসই জীবনের জন্য প্রয়োজনীয় মৌলিক সাংস্কৃতিক প্রজ্ঞা সংরক্ষণ করে।' },
              { en: 'When she presented her empirical findings at the international symposium, fellow linguists gave her a standing ovation.', bn: 'যখন তিনি আন্তর্জাতিক সিম্পোজিয়ামে তার গবেষণালব্ধ প্রমাণ উপস্থাপন করলেন, তখন উপস্থিত ভাষাতাত্ত্বিকরা দাঁড়িয়ে তাকে আন্তরিক অভিবাদন জানালেন।' },
              { en: 'The translation bridged an eight-hundred-year intellectual chasm, restoring a silenced voice to global cultural heritage.', bn: 'এই অনুবাদটি আটশত বছরের বুদ্ধিবৃত্তিক ব্যবধান দূর করে বৈশ্বিক সাংস্কৃতিক ঐতিহ্যে একটি নীরব হয়ে যাওয়া কণ্ঠস্বরকে পুনরুজ্জীবিত করল।' },
              { en: 'Ultimately, her scholarship underscored that deciphering the past is an indispensable act of honoring our collective human consciousness.', bn: 'পরিশেষে, তার পাণ্ডিত্য স্পষ্ট করল যে অতীতকে পাঠ করা আমাদের সমষ্টিগত মানবিক চেতনাকে সম্মান জানানোরই এক অপরিহার্য প্রয়াস।' }
            ]
          },
          {
            id: 'adv-story-2',
            title: 'Passage 2: The Architecture of Memory and Light (স্মৃতি, আলো ও নিউরোসায়েন্সের গভীর পাঠ)',
            theme: 'Cognitive Neuroscience, Environmental Design & Empirical Rigor (জ্ঞানীয় স্নায়ুবিজ্ঞান ও পরিবেশগত স্থাপত্য)',
            readTime: '5 min read',
            moralBn: 'বিজ্ঞান ও শিল্প যখন মানবকল্যাণে একাত্ম হয়, তখন তা আমাদের মানসিক স্বাস্থ্য ও কর্মক্ষমতায় বৈপ্লবিক পরিবর্তন নিয়ে আসে।',
            vocabularyFocus: ['Cognitive', 'Empirical', 'Plasticity', 'Ubiquitous', 'Articulate', 'Dichotomy'],
            sentences: [
              { en: 'In her cognitive neuroscience laboratory, Dr. Nafisa investigated how physical architecture influences spatial memory and creativity.', bn: 'তার কগনিটিভ নিউরোসায়েন্স ল্যাবরেটরিতে, ড. নাফিসা গবেষণা করছিলেন যে বাস্তব স্থাপত্যকলা কীভাবে মানুষের স্থানিক স্মৃতি এবং সৃজনশীলতাকে প্রভাবিত করে।' },
              { en: 'She hypothesized that daylight exposure and harmonious geometry profoundly enhance synaptic plasticity during problem-solving tasks.', bn: 'তিনি হাইপোথিসিস দাঁড় করালেন যে দিনের আলো এবং সুষম জ্যামিতি জটিল সমস্যা সমাধানের সময় সিন্যাপটিক প্লাস্টিসিটি ব্যাপকভাবে বৃদ্ধি করে।' },
              { en: 'Over three rigorous years, she gathered empirical neuroimaging data from diverse cohorts of designers, mathematicians, and writers.', bn: 'তিন বছরের কঠোর গবেষণায় তিনি ডিজাইনার, গণিতবিদ ও লেখকদের বিভিন্ন দল থেকে প্রামাণিক নিউরো-ইমেজিং ডেটা সংগ্রহ করলেন।' },
              { en: 'Her analysis revealed a ubiquitous correlation between structured natural environments and heightened alpha-wave coherence.', bn: 'তার বিশ্লেষণ দেখাল যে সুশৃঙ্খল প্রাকৃতিক পরিবেশের সাথে উচ্চমানের আলফা-তরঙ্গ সুসংগতির একটি সর্বব্যাপী সম্পর্ক রয়েছে।' },
              { en: 'Conversely, claustrophobic and dimly lit cubicles triggered chronic cortisol spikes, severely impairing divergent cognitive faculties.', bn: 'বিপরীতভাবে, সংকীর্ণ ও অনুজ্জ্বল আলোহীন ছোট ঘর দীর্ঘস্থায়ী কর্টিসলের মাত্রা বাড়িয়ে সৃজনশীল চিন্তাভাবনার ক্ষমতাকে মারাত্মকভাবে বাধাগ্রস্ত করে।' },
              { en: 'She articulated her groundbreaking conclusions in a peer-reviewed treatise that captivated both medical faculties and urban planners.', bn: 'তিনি একটি মর্যাদাপূর্ণ গবেষণাপত্রে তার যুগান্তকারী সিদ্ধান্তগুলো তুলে ধরেন, যা চিকিৎসা অনুষদ এবং নগর পরিকল্পনাবিদ উভয়কেই মুগ্ধ করে।' },
              { en: 'Renowned hospital networks subsequently redesigned their pediatric wings to incorporate restorative skylights and botanical atriums.', bn: 'খ্যাতনামা হাসপাতাল নেটওয়ার্কগুলো পরবর্তীতে তাদের শিশু বিভাগগুলোকে প্রশান্তিদায়ক স্কাইলাইট এবং উদ্ভিদময় প্রাঙ্গণ সহকারে নতুনভাবে ডিজাইন করে।' },
              { en: 'Her multidisciplinary work dismantled the false dichotomy between artistic intuition and rigorous scientific inquiry.', bn: 'তার বহুমাত্রিক গবেষণা শিল্পকলার অন্তর্জ্ঞান এবং কঠোর বৈজ্ঞানিক অনুসন্ধানের মধ্যকার কৃত্রিম বিভাজনকে ভেঙে চুরমার করে দিল।' },
              { en: 'She proved that thoughtful structural design does not merely shelter our bodies—it actively sculpts how we think and feel.', bn: 'তিনি প্রমাণ করলেন যে সুচিন্তিত অবকাঠামো কেবল শরীরকেই আশ্রয় দেয় না—বরং আমরা কেমন ভাবি এবং অনুভব করি তাও সুচারুভাবে গড়ে তোলে।' }
            ]
          }
        ],
        newspaperSentences: [
          {
            id: 'news-adv-1',
            source: 'The New York Times',
            category: 'Science & Climate',
            headline: 'Glacial melt accelerates polar sea rise beyond earlier computer models',
            sentence: 'Atmospheric scientists warned that current emissions trends will trigger an irreversible shift in oceanic currents, fundamentally altering continental weather patterns.',
            sentenceBn: 'বায়ুমণ্ডলীয় বিজ্ঞানীরা সতর্ক করেছেন যে বর্তমান কার্বন নিঃসরণের প্রবণতা মহাসাগরীয় স্রোতে এক অপ্রত্যাবর্তনীয় পরিবর্তনের সূচনা করবে, যা মহাদেশীয় আবহাওয়ার রূপরেখাকে মৌলিকভাবে বদলে দেবে।',
            keyWord: 'Irreversible',
            keyWordMeaningBn: 'অপ্রত্যাবর্তনীয় বা যা আগের অবস্থায় ফিরিয়ে আনা অসম্ভব',
            editorialNote: 'জলবায়ু ও জীববৈচিত্র্য বিষয়ক গভীর সম্পাদকীয়তে অপরিবর্তনীয় ক্ষতি বা প্রভাব বর্ণনা করতে "irreversible damage/shift" ব্যবহৃত হয়।'
          },
          {
            id: 'news-adv-2',
            source: 'The Economist',
            category: 'Global Governance',
            headline: 'The shifting architecture of multilateral trade alliances',
            sentence: 'The delicate compromise required diplomatic representatives to navigate conflicting regional mandates without compromising fundamental human rights benchmarks.',
            sentenceBn: 'এই সূক্ষ্ম সমঝোতার জন্য কূটনীতিকদের মৌলিক মানবাধিকারের মানদণ্ড অক্ষুণ্ণ রেখে বিভিন্ন আঞ্চলিক স্বার্থের সংঘাতপূর্ণ অবস্থানগুলো দক্ষতার সাথে সমন্বয় করতে হয়েছিল।',
            keyWord: 'Conflicting',
            keyWordMeaningBn: 'পরস্পরবিরোধী বা সংঘাতময়',
            editorialNote: 'কূটনৈতিক ও আন্তর্জাতিক সম্পর্কের বিশ্লেষণে জটিল স্বার্থ ও নীতিগত টানাপোড়েন বোঝাতে "conflicting mandates/interests" বহুল ব্যবহৃত।'
          },
          {
            id: 'news-adv-3',
            source: 'The Guardian Editorial',
            category: 'Artificial Intelligence',
            headline: 'Autonomous algorithms must not replace human accountability in justice',
            sentence: 'Legal scholars contend that judicial sentencing algorithms, while mathematically fast, fail to perceive the subtle nuances of socio-economic context.',
            sentenceBn: 'আইন পণ্ডিতরা যুক্তি দেন যে বিচারিক রায় দেওয়ার অ্যালগরিদমগুলো গাণিতিকভাবে দ্রুত হলেও আর্থ-সামাজিক প্রেক্ষাপটের সূক্ষ্ম তারতম্য ও জটিলতা উপলব্ধি করতে ব্যর্থ হয়।',
            keyWord: 'Nuances',
            keyWordMeaningBn: 'সূক্ষ্ম তারতম্য বা গভীর পার্থক্য',
            editorialNote: 'বুদ্ধিবৃত্তিক কলাম ও দর্শনে স্থূল দৃষ্টিভঙ্গির বিপরীতে সূক্ষ্ম বিষয় উপলব্ধি করা বোঝাতে "nuance" এবং "subtle nuances" বহুল ব্যবহৃত।'
          },
          {
            id: 'news-adv-4',
            source: 'The Washington Post',
            category: 'Economic Policy',
            headline: 'Central banks struggle to maintain equilibrium amid supply chain shocks',
            sentence: 'Fiscal policy makers acknowledged that sustaining monetary stability is increasingly precarious when geopolitical disruptions rattle commodity supply lines.',
            sentenceBn: 'রাজস্ব নীতি প্রণেতারা স্বীকার করেছেন যে ভূ-রাজনৈতিক অস্থিতিশীলতা যখন কাঁচামালের সরবরাহ ব্যবস্থাকে এলোমেলো করে দেয়, তখন আর্থিক স্থিতিশীলতা বজায় রাখা অত্যন্ত ঝুঁকিপূর্ণ ও অনিশ্চিত হয়ে পড়ে।',
            keyWord: 'Precarious',
            keyWordMeaningBn: 'অনিশ্চিত, ঝুঁকিপূর্ণ বা নড়বড়ে',
            editorialNote: 'অর্থনৈতিক অনিশ্চয়তা, ভঙ্গুর কর্মসংস্থান বা দুর্বল নিরাপত্তা পরিস্থিতি তুলে ধরতে সম্পাদকীয়তে "precarious position/balance" ব্যবহৃত হয়।'
          },
          {
            id: 'news-adv-5',
            source: 'National Geographic',
            category: 'Ecology & Biodiversity',
            headline: 'Ancient peatlands store twice as much carbon as all the world forests',
            sentence: 'Protecting intact peatland ecosystems is paramount to maintaining global biospheric equilibrium and mitigating atmospheric carbon concentrations.',
            sentenceBn: 'বৈশ্বিক জীবমণ্ডলের ভারসাম্য বজায় রাখা এবং বায়ুমণ্ডলে কার্বনের ঘনত্ব কমাতে অক্ষত পিটল্যান্ড বাস্তুতন্ত্র রক্ষা করা সর্বোচ্চ অগ্রাধিকার ও অপরিহার্য।',
            keyWord: 'Paramount',
            keyWordMeaningBn: 'সর্বোচ্চ গুরুত্বপূর্ণ, সর্বপ্রধান',
            editorialNote: 'জরুরি জাতীয় স্বার্থ বা বৈশ্বিক অস্তিত্বের প্রশ্ন সংশ্লিষ্ট বিষয়ে সর্বাধিক গুরুত্ব বোঝাতে "paramount importance" ব্যবহৃত হয়।'
          },
          {
            id: 'news-adv-6',
            source: 'Financial Times',
            category: 'Digital Infrastructure',
            headline: 'Antitrust regulators scrutinize cloud infrastructure consolidation',
            sentence: 'Regulatory watchdogs argued that three multinational tech conglomerates now exert a ubiquitous influence over the sovereign digital infrastructure of dozens of nations.',
            sentenceBn: 'নিয়ন্ত্রণকারী কর্তৃপক্ষ যুক্তি দেখিয়েছে যে তিনটি বহুজাতিক প্রযুক্তি জায়ান্ট এখন বিশ্বের বহু দেশের সার্বভৌম ডিজিটাল অবকাঠামোর ওপর সর্বব্যাপী ও অপ্রতিরোধ্য প্রভাব বিস্তার করছে।',
            keyWord: 'Ubiquitous',
            keyWordMeaningBn: 'সর্বব্যাপী বা সর্বত্র বিদ্যমান',
            editorialNote: 'প্রযুক্তির সর্বগ্রাসী বিস্তৃতি বা ডিজিটাল সেবার আধিপত্য বর্ণনা করতে আন্তর্জাতিক বাণিজ্য সাংবাদিকতায় "ubiquitous presence" প্রিয় শব্দ।'
          }
        ]
      },

      /* -------------------------------------------------------------------
         LEVEL 4: PRO
      -------------------------------------------------------------------- */
      pro: {
        id: 'pro',
        title: 'Pro',
        bengaliSubtitle: 'কর্মক্ষেত্র, Business English, Executive Expressions এবং জটিল বাক্য কাঠামো',
        words: [
          {
            id: 'pro-1',
            word: 'Mitigate',
            imageQuery: 'umbrella protection storm barrier mitigate',
            pos: 'Verb',
            ipa: '/ˈmɪtɪɡeɪt/',
            meaningBn: 'প্রশমিত করা, তীব্রতা বা ঝুঁকি কমানো',
            explanationEn: 'To make a problem, risk, or negative impact less severe or painful.',
            example: 'Diversifying supply chains helps organizations mitigate unexpected market disruptions.',
            exampleBn: 'সরবরাহ শৃঙ্খলে বৈচিত্র্য আনলে প্রতিষ্ঠানগুলো অপ্রত্যাশিত বাজার বিপর্যয়ের ঝুঁকি কমাতে পারে।',
            synonyms: [
              { word: 'Alleviate', meaningBn: 'উপশম বা লাঘব করা', explanationBn: 'কষ্ট, চাপ বা সমস্যার তীব্রতা কমিয়ে আনা।' },
              { word: 'Reduce', meaningBn: 'কমানো, হ্রাস করা', explanationBn: 'পরিমাণ বা মাত্রা কমিয়ে আনা।' },
              { word: 'Diminish', meaningBn: 'হ্রাস করা', explanationBn: 'ধীরে ধীরে প্রভাব বা তীব্রতা কমিয়ে ফেলা।' },
              { word: 'Lessen', meaningBn: 'লঘু করা', explanationBn: 'কোনো ক্ষতির আশঙ্কা কমিয়ে আনা।' },
              { word: 'Cushion', meaningBn: 'ধাক্কা সামলানো', explanationBn: 'আকস্মিক ক্ষতির প্রভাব নরম বা সহনীয় করা।' }
            ],
            antonyms: [
              { word: 'Aggravate', meaningBn: 'অধিকতর খারাপ বা তীব্র করা', explanationBn: 'বিদ্যমান সমস্যাকে আরও জটিল করে তোলা।' },
              { word: 'Intensify', meaningBn: 'তীব্রতর করা', explanationBn: 'কোনো সংকট বা চাপ আরও বাড়িয়ে দেওয়া।' },
              { word: 'Exacerbate', meaningBn: 'অবনতি ঘটানো', explanationBn: 'খারাপ পরিস্থিতিকে আরও বিষময় করে তোলা।' },
              { word: 'Escalate', meaningBn: 'দ্রুত বৃদ্ধি করা', explanationBn: 'সংঘাত বা সমস্যাকে ওপরের দিকে নিয়ে যাওয়া।' },
              { word: 'Worsen', meaningBn: 'আরও খারাপ হওয়া', explanationBn: 'অবস্থার অবনতি ঘটানো।' }
            ]
          },
          {
            id: 'pro-2',
            word: 'Expedite',
            imageQuery: 'high speed bullet train expedite transportation',
            pos: 'Verb',
            ipa: '/ˈekspədaɪt/',
            meaningBn: 'ত্বরান্বিত করা, দ্রুত সম্পন্ন করা',
            explanationEn: 'To make an action or process happen sooner or be accomplished more quickly.',
            example: 'Automated verification allowed the team to expedite client onboarding significantly.',
            exampleBn: 'স্বয়ংক্রিয় যাচাইকরণ দলটিকে ক্লায়েন্ট অনবোর্ডিং প্রক্রিয়া উল্লেখযোগ্যভাবে ত্বরান্বিত করতে সাহায্য করেছে।',
            synonyms: [
              { word: 'Accelerate', meaningBn: 'গতি বৃদ্ধি করা', explanationBn: 'কাজের গতি বাড়িয়ে দ্রুত এগিয়ে নেওয়া।' },
              { word: 'Facilitate', meaningBn: 'সহজতর ও দ্রুত করা', explanationBn: 'বাধা দূর করে কাজ সম্পন্ন হতে সাহায্য করা।' },
              { word: 'Hasten', meaningBn: 'দ্রুততর করা', explanationBn: 'তাড়াতাড়ি কোনো পদক্ষেপ সম্পন্ন করা।' },
              { word: 'Streamline', meaningBn: 'সুশৃঙ্খল ও গতিশীল করা', explanationBn: 'অপ্রয়োজনীয় ধাপ বাদ দিয়ে কাজ দ্রুত করা।' },
              { word: 'Advance', meaningBn: 'এগিয়ে নেওয়া', explanationBn: 'নির্ধারিত সময়ের আগেই অগ্রগতি সাধন করা।' }
            ],
            antonyms: [
              { word: 'Delay', meaningBn: 'বিলম্বিত করা', explanationBn: 'নির্ধারিত সময়ের চেয়ে দেরি করানো।' },
              { word: 'Hinder', meaningBn: 'বাধাগ্রস্ত করা', explanationBn: 'কাজের স্বাভাবিক গতি আটকে দেওয়া।' },
              { word: 'Impede', meaningBn: 'ব্যাহত করা', explanationBn: 'প্রতিবন্ধকতা সৃষ্টি করে গতি কমানো।' },
              { word: 'Obstruct', meaningBn: 'অবরুদ্ধ করা', explanationBn: 'পথ বা প্রক্রিয়া বন্ধ করে দেওয়া।' },
              { word: 'Stall', meaningBn: 'স্থগিত বা আটকে রাখা', explanationBn: 'অগ্রগতি থামিয়ে দেওয়া।' }
            ]
          },
          {
            id: 'pro-3',
            word: 'Astute',
            imageQuery: 'chess grandmaster strategic thinking player astute',
            pos: 'Adjective',
            ipa: '/əˈstjuːt/',
            meaningBn: 'বিচক্ষণ, তীক্ষ্ণবুদ্ধিসম্পন্ন',
            explanationEn: 'Having or showing an ability to accurately assess situations and turn them to advantage.',
            example: 'An astute negotiator listens carefully to unspoken priorities at the table.',
            exampleBn: 'একজন বিচক্ষণ মধ্যস্থতাকারী আলোচনার টেবিলে অনুক্ত অগ্রাধিকারগুলোও মনোযোগ দিয়ে শোনেন।',
            synonyms: [
              { word: 'Shrewd', meaningBn: 'তীক্ষ্ণবুদ্ধি ও দূরদর্শী', explanationBn: 'পরিস্থিতি দ্রুত বুঝে সঠিক সিদ্ধান্ত নেওয়ার ক্ষমতা।' },
              { word: 'Perceptive', meaningBn: 'সূক্ষ্মদর্শী', explanationBn: 'অন্যের না বলা কথাও সহজে বুঝতে পারা।' },
              { word: 'Insightful', meaningBn: 'অন্তর্দৃষ্টিসম্পন্ন', explanationBn: 'গভীর বিশ্লেষণী ক্ষমতাসম্পন্ন।' },
              { word: 'Sagacious', meaningBn: 'প্রাজ্ঞ ও বিচক্ষণ', explanationBn: 'গভীর জ্ঞান ও দূরদর্শিতার সাথে বিচার করতে সক্ষম।' },
              { word: 'Sharp', meaningBn: 'তীক্ষ্ণ ও চটপটে', explanationBn: 'দ্রুত এবং নির্ভুলভাবে চিন্তা করতে পারা।' }
            ],
            antonyms: [
              { word: 'Naive', meaningBn: 'সরল ও অনভিজ্ঞ', explanationBn: 'বাস্তব জটিলতা না বুঝে সহজে বিশ্বাস করে এমন।' },
              { word: 'Gullible', meaningBn: 'সহজে প্রতারিত হয় এমন', explanationBn: 'যেকোনো কথা যাচাই না করে বিশ্বাস করা।' },
              { word: 'Shortsighted', meaningBn: 'অদূরদর্শী', explanationBn: 'ভবিষ্যৎ পরিণতি চিন্তা করতে অক্ষম।' },
              { word: 'Obtuse', meaningBn: 'স্থূলবুদ্ধি', explanationBn: 'সূক্ষ্ম বিষয় বুঝতে ধীর বা অক্ষম।' },
              { word: 'Foolish', meaningBn: 'নির্বোধ', explanationBn: 'বিবেচনাহীন আচরণ বা সিদ্ধান্ত নেওয়া।' }
            ]
          },
          {
            id: 'pro-4',
            word: 'Unprecedented',
            imageQuery: 'rocket launch breakthrough achievement unprecedented',
            pos: 'Adjective',
            ipa: '/ʌnˈpresɪdentɪd/',
            meaningBn: 'অভূতপূর্ব, নজিরবিহীন',
            explanationEn: 'Never done, experienced, or known before in history or industry.',
            example: 'The engineering team achieved unprecedented efficiency during the global rollout.',
            exampleBn: 'প্রকৌশল দলটি বৈশ্বিক কার্যক্রমের সময় অভূতপূর্ব দক্ষতা অর্জন করেছে।',
            synonyms: [
              { word: 'Unparalleled', meaningBn: 'অতুলনীয়', explanationBn: 'যার সমকক্ষ বা তুলনা আগে কখনো দেখা যায়নি।' },
              { word: 'Extraordinary', meaningBn: 'অসাধারণ', explanationBn: 'সাধারণ মানের চেয়ে বহুগুণ উন্নত বা ব্যতিক্রমী।' },
              { word: 'Novel', meaningBn: 'অভিনব', explanationBn: 'সম্পূর্ণ নতুন ও মৌলিক।' },
              { word: 'Groundbreaking', meaningBn: 'যুগান্তকারী', explanationBn: 'নতুন পথ উন্মোচনকারী ও ঐতিহাসিক।' },
              { word: 'Unmatched', meaningBn: 'অদ্বিতীয়', explanationBn: 'যার কোনো জুড়ি বা পূর্বদৃষ্টান্ত নেই।' }
            ],
            antonyms: [
              { word: 'Common', meaningBn: 'সাধারণ, সচরাচর', explanationBn: 'যা প্রায়ই ঘটে এবং নতুন কিছু নয়।' },
              { word: 'Routine', meaningBn: 'নিয়মিত ও গতানুগতিক', explanationBn: 'প্রতিদিনের সাধারণ নিয়মের অংশ।' },
              { word: 'Familiar', meaningBn: 'পরিচিত', explanationBn: 'আগে থেকেই সবার জানা।' },
              { word: 'Conventional', meaningBn: 'প্রথাগত', explanationBn: 'পুরোনো ও প্রচলিত নিয়ম অনুসরণকারী।' },
              { word: 'Ordinary', meaningBn: 'মামুলি, সাধারণ', explanationBn: 'বিশেষত্বহীন ও স্বাভাবিক।' }
            ]
          },
          {
            id: 'pro-5',
            word: 'Consensus',
            imageQuery: 'business handshake team agreement consensus',
            pos: 'Noun',
            ipa: '/kənˈsensəs/',
            meaningBn: 'সর্বসম্মত মত, ঐকমত্য',
            explanationEn: 'General agreement among all members of a group or leadership team.',
            example: 'Strategic initiatives succeed faster when leadership builds genuine consensus early.',
            exampleBn: 'নেতৃত্ব পর্যায়ে শুরুতেই প্রকৃত ঐকমত্য গড়ে উঠলে কৌশলগত উদ্যোগগুলো দ্রুত সফল হয়।',
            synonyms: [
              { word: 'Agreement', meaningBn: 'সম্মতি, চুক্তি', explanationBn: 'একই সিদ্ধান্তে একমত হওয়া।' },
              { word: 'Harmony', meaningBn: 'সমন্বয় ও মিল', explanationBn: 'মতের মিল ও পারস্পরিক বোঝাপড়া।' },
              { word: 'Unanimity', meaningBn: 'সর্বসম্মতি', explanationBn: 'সকলের পূর্ণ সমর্থন।' },
              { word: 'Accord', meaningBn: 'ঐক্য, সমঝোতা', explanationBn: 'পারস্পরিক আলোচনার মাধ্যমে পৌঁছানো সমঝোতা।' },
              { word: 'Unity', meaningBn: 'একতা', explanationBn: 'একই লক্ষ্যে ঐক্যবদ্ধ অবস্থান।' }
            ],
            antonyms: [
              { word: 'Disagreement', meaningBn: 'মতভেদ', explanationBn: 'একই বিষয়ে ভিন্ন ভিন্ন মত পোষণ করা।' },
              { word: 'Conflict', meaningBn: 'দ্বন্দ্ব, বিরোধ', explanationBn: 'তীব্র মতবিরোধ বা সংঘাত।' },
              { word: 'Discord', meaningBn: 'অনৈক্য', explanationBn: 'মিল বা সমঝোতার অভাব।' },
              { word: 'Dissent', meaningBn: 'ভিন্নমত প্রকাশ', explanationBn: 'প্রচলিত বা সংখ্যাগরিষ্ঠ সিদ্ধান্তের বিরোধিতা করা।' },
              { word: 'Division', meaningBn: 'বিভাজন', explanationBn: 'দলের মধ্যে মতের বিভক্তি।' }
            ]
          },
          {
            id: 'pro-6',
            word: 'Exemplify',
            imageQuery: 'golden trophy award podium excellence exemplify',
            pos: 'Verb',
            ipa: '/ɪɡˈzemplɪfaɪ/',
            meaningBn: 'উদাহরণ দিয়ে স্পষ্ট করা, আদর্শ দৃষ্টান্ত স্থাপন করা',
            explanationEn: 'To serve as a typical or ideal example of a quality or principle.',
            example: 'Her leadership style exemplifies transparency, accountability, and calm judgment.',
            exampleBn: 'তার নেতৃত্বের ধরন স্বচ্ছতা, জবাবদিহিতা এবং ধীরস্থির বিচারবুদ্ধির আদর্শ দৃষ্টান্ত স্থাপন করে।',
            synonyms: [
              { word: 'Illustrate', meaningBn: 'উদাহরণসহ ব্যাখ্যা করা', explanationBn: 'বাস্তব দৃষ্টান্ত দিয়ে কোনো বিষয় পরিষ্কার করা।' },
              { word: 'Represent', meaningBn: 'প্রতিনিধিত্ব করা', explanationBn: 'কোনো গুণ বা আদর্শের প্রতীক হয়ে ওঠা।' },
              { word: 'Embody', meaningBn: 'মূর্ত করে তোলা', explanationBn: 'নিজের কাজের মাধ্যমে কোনো আদর্শ বাস্তবে রূপ দেওয়া।' },
              { word: 'Demonstrate', meaningBn: 'প্রদর্শন করা', explanationBn: 'কার্যত করে দেখানো।' },
              { word: 'Typify', meaningBn: 'আদর্শ বৈশিষ্ট্য বহন করা', explanationBn: 'কোনো শ্রেণির মূল বৈশিষ্ট্য ফুটিয়ে তোলা।' }
            ],
            antonyms: [
              { word: 'Contradict', meaningBn: 'বিরোধিতা বা খণ্ডন করা', explanationBn: 'কোনো নীতি বা বক্তব্যের বিপরীত কাজ করা।' },
              { word: 'Misrepresent', meaningBn: 'ভুলভাবে উপস্থাপন করা', explanationBn: 'সত্য বা আদর্শকে বিকৃত করে দেখানো।' },
              { word: 'Distort', meaningBn: 'বিকৃত করা', explanationBn: 'মূল রূপ বা অর্থ পরিবর্তন করে ফেলা।' },
              { word: 'Obscure', meaningBn: 'আড়াল বা অস্পষ্ট করা', explanationBn: 'সত্য বা উদাহরণ ঢেকে রাখা।' },
              { word: 'Belie', meaningBn: 'মিথ্যা প্রতিপন্ন করা', explanationBn: 'বাইরের ধারণার বিপরীত আচরণ করা।' }
            ]
          }
        ],
        practiceExtraWords: [
          {
            id: 'pro-7',
            word: 'Synergy',
            imageQuery: 'interlocking gears cogs mechanism synergy',
            ipa: '/ˈsɪnərdʒi/',
            meaningBn: 'সম্মিলিত শক্তি ও সমন্বয়',
            explanationEn: 'Combined effort producing a greater result than the sum of individual parts.',
            example: 'Cross-functional synergy accelerates innovation across global product teams.',
            exampleBn: 'আন্তঃবিভাগীয় সম্মিলিত সমন্বয় বৈশ্বিক পণ্য দলগুলোতে উদ্ভাবনকে ত্বরান্বিত করে।'
          },
          {
            id: 'pro-8',
            word: 'Benchmark',
            imageQuery: 'compass measuring tool blueprint benchmark',
            ipa: '/ˈbentʃmɑːrk/',
            meaningBn: 'মানদণ্ড, উৎকর্ষের মাপকাঠি',
            explanationEn: 'A standard or point of reference against which things may be compared.',
            example: 'Their customer service set a new industry benchmark for reliability.',
            exampleBn: 'তাদের গ্রাহক সেবা নির্ভরযোগ্যতার ক্ষেত্রে শিল্পে একটি নতুন মানদণ্ড স্থাপন করেছে।'
          }
        ],
        businessTemplates: [
          { context: 'Executive Follow-Up', en: 'Thank you for your insightful feedback during today’s briefing; we will incorporate your recommendations into the revised proposal.', bn: 'আজকের ব্রিফিংয়ে আপনার অন্তর্দৃষ্টিপূর্ণ মতামতের জন্য ধন্যবাদ; আমরা সংশোধিত প্রস্তাবে আপনার সুপারিশগুলো অন্তর্ভুক্ত করব।' },
          { context: 'Risk Mitigation Update', en: 'To mitigate potential timeline delays, we have allocated additional engineering resources to the primary milestone.', bn: 'সম্ভাব্য সময়সূচির বিলম্ব প্রশমিত করতে আমরা প্রধান মাইলফলকটিতে অতিরিক্ত প্রকৌশল সম্পদ বরাদ্দ করেছি।' },
          { context: 'Stakeholder Alignment', en: 'Before finalizing the budget, let us ensure full consensus across all regional leads by Thursday afternoon.', bn: 'বাজেট চূড়ান্ত করার আগে চলুন বৃহস্পতিবার বিকেলের মধ্যে সব আঞ্চলিক প্রধানের পূর্ণ ঐকমত্য নিশ্চিত করি।' },
          { context: 'Client Escalation Response', en: 'We prioritize your operational continuity and have expedited a dedicated specialist team to resolve this matter immediately.', bn: 'আমরা আপনার কার্যক্রমের ধারাবাহিকতাকে সর্বোচ্চ অগ্রাধিকার দিই এবং বিষয়টি তাৎক্ষণিকভাবে সমাধানের জন্য একটি বিশেষজ্ঞ দল নিযুক্ত করেছি।' }
        ],
        executiveExpressions: [
          { expression: 'In light of empirical findings', meaningBn: 'অভিজ্ঞতালব্ধ ফলাফলের আলোকে', example: 'In light of empirical findings, the board revised its five-year sustainability roadmap.', exampleBn: 'অভিজ্ঞতালব্ধ ফলাফলের আলোকে পরিচালনা পর্ষদ তাদের পাঁচ বছরের টেকসই কর্মপরিকল্পনা সংশোধন করেছে।' },
          { expression: 'A compelling body of evidence', meaningBn: 'জোরালো ও নির্ভরযোগ্য তথ্যপ্রমাণ', example: 'There is a compelling body of evidence linking transparent governance to long-term growth.', exampleBn: 'স্বচ্ছ সুশাসনের সাথে দীর্ঘমেয়াদী প্রবৃদ্ধির সম্পর্কের পেছনে জোরালো তথ্যপ্রমাণ রয়েছে।' },
          { expression: 'Warrants further scrutiny', meaningBn: 'আরও গভীর পর্যালোচনার দাবি রাখে', example: 'The sudden shift in regional demand warrants further scrutiny before capital allocation.', exampleBn: 'মূলধন বরাদ্দের আগে আঞ্চলিক চাহিদার এই আকস্মিক পরিবর্তন আরও গভীর পর্যালোচনার দাবি রাখে।' },
          { expression: 'By the same token', meaningBn: 'একই যুক্তিতে বা অনুরূপভাবে', example: 'Clear metrics drive accountability; by the same token, unrealistic targets erode morale.', exampleBn: 'স্পষ্ট মানদণ্ড জবাবদিহিতা বাড়ায়; অনুরূপভাবে অবাস্তব লক্ষ্যমাত্রা মনোবল কমিয়ে দেয়।' }
        ],
        complexStructures: [
          { pattern: 'Had + Subject + Past Participle, Subject + would have...', meaningBn: 'অতীতের অবাস্তব শর্ত (Inversion)', example: 'Had the team anticipated the regulatory shift earlier, they would have mitigated the cost.', exampleBn: 'দলটি যদি আগে থেকেই নীতিগত পরিবর্তনটি আঁচ করতে পারত, তবে তারা ব্যয় কমাতে পারত।' },
          { pattern: 'Not only + Aux + Subject + Verb, but + Subject + also...', meaningBn: 'নেতিবাচক ক্রিয়া-বিশেষণ দিয়ে বাক্য শুরু', example: 'Not only did the strategy expedite delivery, but it also elevated client satisfaction.', exampleBn: 'কৌশলটি শুধু সরবরাহই ত্বরান্বিত করেনি, বরং এটি গ্রাহক সন্তুষ্টিও বাড়িয়েছে।' },
          { pattern: 'Given that + Clause, Main Clause', meaningBn: 'যেহেতু বা বিবেচনা করে যে...', example: 'Given that market conditions remain volatile, prudent capital reserve is essential.', exampleBn: 'যেহেতু বাজার পরিস্থিতি অস্থির রয়েছে, তাই বিচক্ষণ মূলধন সংরক্ষণ অপরিহার্য।' },
          { pattern: 'Notwithstanding + Noun Phrase, Main Clause', meaningBn: 'সত্ত্বেও (অত্যন্ত আনুষ্ঠানিক প্রয়োগ)', example: 'Notwithstanding initial supply constraints, the division delivered unprecedented quarterly results.', exampleBn: 'প্রাথমিক সরবরাহ সীমাবদ্ধতা সত্ত্বেও বিভাগটি অভূতপূর্ব ত্রৈমাসিক ফলাফল অর্জন করেছে।' }
        ],
        stories: [
          {
            id: 'pro-story-1',
            title: 'Executive Case 1: The Sovereign Grid Turnaround (জাতীয় পাওয়ার গ্রিড রূপান্তর ও কৌশলগত নেতৃত্ব)',
            theme: 'Executive Leadership, Infrastructure & Risk Mitigation (কৌশলগত নেতৃত্ব ও সংকট নিরসন)',
            readTime: '5 min read',
            moralBn: 'দূরদর্শী পরিকল্পনা, ঝুঁকি ব্যবস্থাপনা এবং অংশীজনদের কার্যকর সমন্বয়ের মাধ্যমে যেকোনো ভঙ্গুর প্রতিষ্ঠানকে সাফল্যের মডেলে পরিণত করা সম্ভব।',
            vocabularyFocus: ['Mitigate', 'Leverage', 'Benchmark', 'Stakeholder', 'Telemetry', 'Governance'],
            sentences: [
              { en: 'When Chief Operations Officer Sarah assumed stewardship of the national energy grid, the utility was crippled by cascading blackouts and volatile fuel costs.', bn: 'চিফ অপারেশনস অফিসার সারাহ যখন জাতীয় পাওয়ার গ্রিডের দায়িত্বভার গ্রহণ করেন, তখন প্রতিষ্ঠানটি ঘনঘন লোডশেডিং এবং জ্বালানির অস্থিতিশীল মূল্যের চাপে বিধ্বস্ত ছিল।' },
              { en: 'Immediate analysis revealed an antiquated transmission topology that leaked over twenty percent of generated electricity through sheer technical inefficiency.', bn: 'তাৎক্ষণিক বিশ্লেষণে একটি সেকেলে সঞ্চালন পরিকাঠামো ধরা পড়ে, যা নিছক প্রযুক্তিগত অদক্ষতার কারণে উৎপন্ন বিদ্যুতের বিশ শতাংশেরও বেশি অপচয় করছিল।' },
              { en: 'Rather than seeking another short-term government bailout, Sarah designed a comprehensive, multi-phase modernization blueprint.', bn: 'সরকারের কাছ থেকে আরেকটি স্বল্পমেয়াদী আর্থিক সহায়তার আবেদন না করে, সারাহ একটি সমন্বিত, বহুমুখী আধুনিকীকরণ রূপরেখা প্রণয়ন করলেন।' },
              { en: 'She engaged a diverse coalition of institutional stakeholders, securing long-term infrastructure funding from international climate bond consortia.', bn: 'তিনি বিভিন্ন প্রাতিষ্ঠানিক অংশীজনদের সাথে আলোচনা চালিয়ে আন্তর্জাতিক ক্লাইমেট বন্ড কনসোর্টিয়াম থেকে দীর্ঘমেয়াদী অবকাঠামোগত অর্থায়ন নিশ্চিত করলেন।' },
              { en: 'Her engineering teams leveraged machine-learning telemetry to balance fluctuating renewable inputs from offshore wind and solar farms in real time.', bn: 'তার প্রকৌশল দলগুলো উপকূলীয় বায়ু ও সৌরবিদ্যুৎ কেন্দ্র থেকে প্রাপ্ত পরিবর্তনশীল বিদ্যুৎ রিয়েল-টাইমে ভারসাম্যপূর্ণ করতে মেশিন-লার্নিং ডেটা কাজে লাগাল।' },
              { en: 'To mitigate supply disruption during the overhaul, Sarah negotiated stringent performance milestones with regional equipment manufacturers.', bn: 'সংস্কার চলাকালীন সরবরাহ বিঘ্নিত হওয়ার ঝুঁকি কমাতে, সারাহ আঞ্চলিক যন্ত্রপাতি নির্মাতাদের সাথে কঠোর পারফরম্যান্স চুক্তি সম্পাদন করলেন।' },
              { en: 'Within thirty months, the overhauled network curtailed transmission losses by sixty percent and achieved unprecedented reliability ratings.', bn: 'ত্রিশ মাসের মধ্যে এই আধুনিকীকৃত নেটওয়ার্ক সিস্টেম লস ৬০ শতাংশ হ্রাস করল এবং অভূতপূর্ব নির্ভরযোগ্যতার রেটিং অর্জন করল।' },
              { en: 'The initiative established a recognized benchmark for public sector infrastructure transformation across emerging economies.', bn: 'এই উদ্যোগটি উন্নয়নশীল অর্থনীতির দেশগুলোর পাবলিক সেক্টর অবকাঠামো রূপান্তরের জন্য একটি স্বীকৃত মানদণ্ড প্রতিষ্ঠা করল।' },
              { en: 'Her decisive tenure demonstrated that visionary governance and technological precision can resolve seemingly insurmountable crises.', bn: 'তার দৃঢ় নেতৃত্ব প্রমাণ করল যে দূরদর্শী সুশাসন এবং প্রযুক্তির নিখুঁত প্রয়োগ আপাতদৃষ্টিতে অসম্ভব সংকটও জয় করতে পারে।' }
            ]
          },
          {
            id: 'pro-story-2',
            title: 'Executive Case 2: The Algorithmic Vanguard: Fiduciary Ethics in FinTech (ফিনটেক সুশাসন ও কৃত্রিম বুদ্ধিমত্তার নৈতিক মানদণ্ড)',
            theme: 'Corporate Governance, AI Ethics & Fiduciary Duty (কর্পোরেট সুশাসন ও এআই নৈতিকতা)',
            readTime: '5 min read',
            moralBn: 'প্রযুক্তির গতি তখনই টেকসই সফলতা এনে দেয়, যখন তা নৈতিকতা, স্বচ্ছতা এবং সকল অংশীজনের ন্যায্যতার মানদণ্ডে পরিচালিত হয়।',
            vocabularyFocus: ['Fiduciary', 'Governance', 'Audit', 'Mitigate', 'Benchmark', 'Equity'],
            sentences: [
              { en: 'As an international digital lender expanded across three continents, its proprietary credit-scoring engine processed millions of loan decisions daily.', bn: 'একটি আন্তর্জাতিক ডিজিটাল ঋণদানকারী প্রতিষ্ঠান যখন তিনটি মহাদেশে তাদের কার্যক্রম বিস্তার করল, তখন তাদের নিজস্ব ক্রেডিট-স্কোরিং ইঞ্জিন প্রতিদিন লাখ লাখ ঋণের সিদ্ধান্ত প্রক্রিয়াকরণ করছিল।' },
              { en: 'However, external audits detected subtle algorithmic discrepancies that systematically disadvantaged female entrepreneurs in developing markets.', bn: 'তবে বহিঃনিরীক্ষায় কিছু সূক্ষ্ম অ্যালগরিদমিক অসঙ্গতি ধরা পড়ে, যা উন্নয়নশীল দেশের নারী উদ্যোক্তাদের নিয়মতান্ত্রিকভাবে সুবিধাবঞ্চিত করছিল।' },
              { en: 'Recognizing the catastrophic ethical and regulatory liability, Chief Risk Officer Tariq intervened immediately before an impending global audit.', bn: 'আসন্ন বৈশ্বিক অডিটের আগেই মারাত্মক নৈতিক ও আইনি ঝুঁকির বিষয়টি অনুধাবন করে চিফ রিস্ক অফিসার তারিক তাৎক্ষণিকভাবে হস্তক্ষেপ করলেন।' },
              { en: 'He confronted stiff resistance from executive directors who prioritized rapid quarterly loan volume over algorithmic governance.', bn: 'তিনি পরিচালনা পর্ষদের পরিচালকদের পক্ষ থেকে তীব্র বাধার মুখে পড়েন, যারা সুশাসনের চেয়ে ত্রৈমাসিক ঋণের প্রবৃদ্ধিকেই বেশি অগ্রাধিকার দিচ্ছিলেন।' },
              { en: 'Tariq demonstrated with unassailable data that discriminatory lending exposed the enterprise to multi-million-dollar sanctions and brand erosion.', bn: 'তারিক অকাট্য তথ্য-উপাত্ত দিয়ে তুলে ধরেন যে এই বৈষম্যমূলক ঋণব্যবস্থা প্রতিষ্ঠানটিকে কোটি কোটি ডলারের জরিমানা ও ব্র্যান্ড ইমেজ ধ্বংসের ঝুঁকিতে ফেলবে।' },
              { en: 'He mandated an open-source bias audit framework, retraining the neural networks to eliminate historical socioeconomic prejudices.', bn: 'তিনি একটি ওপেন-সোর্স বায়াস অডিট ফ্রেমওয়ার্ক বাধ্যতামূলক করেন এবং ঐতিহাসিক আর্থ-সামাজিক পক্ষপাতিত্ব দূর করতে নিউরাল নেটওয়ার্ককে পুনর্প্রশিক্ষিত করেন।' },
              { en: 'Additionally, he instituted an independent algorithmic governance committee empowered to veto flawed automation protocols.', bn: 'পাশাপাশি, ত্রুটিপূর্ণ স্বয়ংক্রিয় প্রোটোকলে ভেটো দেওয়ার ক্ষমতা দিয়ে তিনি একটি স্বাধীন অ্যালগরিদমিক সুশাসন কমিটি গঠন করলেন।' },
              { en: 'The reformed model subsequently approved forty percent more creditworthy small businesses with zero increase in default rates.', bn: 'সংস্কারকৃত এই মডেলটি পরবর্তীতে খেলাপি ঋণের কোনো বৃদ্ধি ছাড়াই ৪০ শতাংশ বেশি যোগ্য ক্ষুদ্র ব্যবসায়ীদের ঋণ অনুমোদন করতে সক্ষম হয়।' },
              { en: 'Tariq proved that fiduciary responsibility demands moral courage, and that sustainable profit must always be anchored in human equity.', bn: 'তারিক প্রমাণ করলেন যে প্রাতিষ্ঠানিক আস্থার দায়িত্বে নৈতিক সাহসের প্রয়োজন, এবং টেকসই মুনাফা সবসময় মানবিক ন্যায্যতার ওপর প্রতিষ্ঠিত হতে হয়।' }
            ]
          }
        ],
        newspaperSentences: [
          {
            id: 'news-pro-1',
            source: 'Financial Times',
            category: 'Mergers & Acquisitions',
            headline: 'Cross-border mega-mergers confront stringent sovereign scrutiny',
            sentence: 'The investment consortium agreed to divest non-core semiconductor assets in order to mitigate national security concerns raised by European antitrust authorities.',
            sentenceBn: 'ইউরোপীয় অ্যান্টিট্রাস্ট কর্তৃপক্ষের উত্থাপিত জাতীয় নিরাপত্তা সংক্রান্ত উদ্বেগ প্রশমিত করতে বিনিয়োগ কনসোর্টিয়ামটি তাদের অপ্রধান সেমিকন্ডাক্টর সম্পদ বিক্রি করে দিতে সম্মত হয়েছে।',
            keyWord: 'Mitigate',
            keyWordMeaningBn: 'প্রশমিত করা, হ্রাস করা বা ঝুঁকি কমানো',
            editorialNote: 'বিজনেস সাংবাদিকতা, ব্যাংকিং এবং ঝুঁকি ব্যবস্থাপনায় "mitigate risk/exposure" একটি অবিসংবাদিত করপোরেট বাক্যগঠন।'
          },
          {
            id: 'news-pro-2',
            source: 'Bloomberg',
            category: 'Venture Capital & AI',
            headline: 'Early-stage climate tech startups secure record private equity inflows',
            sentence: 'Venture partners emphasized their intent to leverage proprietary artificial intelligence models to accelerate drug discovery pipelines and lower preclinical trial overheads.',
            sentenceBn: 'ভেঞ্চার পার্টনাররা জোর দিয়ে বলেন যে ওষুধের আবিষ্কার প্রক্রিয়াকে ত্বরান্বিত করতে এবং ক্লিনিকাল ট্রায়ালের পূর্ববর্তী খরচ কমাতে তারা নিজস্ব কৃত্রিম বুদ্ধিমত্তা মডেলের সুবিধা পুরোপুরি কাজে লাগাবেন।',
            keyWord: 'Leverage',
            keyWordMeaningBn: 'সর্বোচ্চ সুবিধাজনকভাবে কাজে লাগানো বা লিভারেজ করা',
            editorialNote: 'কর্পোরেট কৌশল এবং মূলধনী বাজারে সম্পদ, ব্র্যান্ড বা প্রযুক্তিকে কাজে লাগিয়ে অতিরিক্ত সুবিধা অর্জন বোঝাতে "leverage" ব্যবহৃত হয়।'
          },
          {
            id: 'news-pro-3',
            source: 'The Wall Street Journal',
            category: 'Capital Markets',
            headline: 'Federal Reserve holds benchmark rate steady amid resilient labor market',
            sentence: 'Central bank governors signaled that borrowing costs would remain elevated until core inflation trajectory demonstrates an unambiguous convergence toward the two percent target.',
            sentenceBn: 'সেন্ট্রাল ব্যাংকের গভর্নররা সংকেত দিয়েছেন যে মূল মূল্যস্ফীতি দুই শতাংশের লক্ষ্যের দিকে সুস্পষ্ট ও নিশ্চিতভাবে নেমে না আসা পর্যন্ত ঋণের সুদের হার উচ্চমাত্রায় রাখা হবে।',
            keyWord: 'Unambiguous',
            keyWordMeaningBn: 'স্পষ্ট, দ্ব্যর্থহীন ও নিশ্চিত',
            editorialNote: 'আর্থিক নীতি এবং বোর্ড মিটিংয়ের আনুষ্ঠানিক বিবৃতিতে কোনো প্রকার অস্পষ্টতা না থাকা বোঝাতে "unambiguous signal/evidence" ব্যবহৃত হয়।'
          },
          {
            id: 'news-pro-4',
            source: 'Harvard Business Review',
            category: 'Organizational Leadership',
            headline: 'Why enterprise agile transformations falter without psychological safety',
            sentence: 'Organizational sociologists found that senior leadership teams must establish clear performance benchmarks while fostering a culture that does not penalize transparent failure.',
            sentenceBn: 'সাংগঠনিক সমাজবিজ্ঞানীরা দেখেছেন যে উর্ধ্বতন নেতৃত্বকে স্বচ্ছ ব্যর্থতার জন্য কাউকে শাস্তি না দিয়ে স্পষ্ট পারফরম্যান্স বেঞ্চমার্ক নির্ধারণ এবং মনস্তাত্ত্বিক নিরাপত্তার সংস্কৃতি গড়ে তুলতে হবে।',
            keyWord: 'Benchmarks',
            keyWordMeaningBn: 'মানদণ্ড বা মান যাচাইয়ের আদর্শ ভিত্তি',
            editorialNote: 'ম্যানেজমেন্ট জার্নাল ও কর্পোরেট বিশ্লেষণে সেরা পারফরম্যান্স বা আন্তর্জাতিক মানের সাথে তুলনা করতে "benchmark against" ব্যবহৃত হয়।'
          },
          {
            id: 'news-pro-5',
            source: 'Forbes',
            category: 'ESG & Governance',
            headline: 'Institutional asset managers demand auditable carbon transition plans',
            sentence: 'Institutional shareholders warned corporate boards that failure to disclose auditable supply chain emissions exposes the enterprise to unprecedented fiduciary litigation.',
            sentenceBn: 'প্রাতিষ্ঠানিক শেয়ারহোল্ডাররা করপোরেট বোর্ডকে সতর্ক করেছেন যে সাপ্লাই চেইনের নিরীক্ষাযোগ্য কার্বন নিঃসরণ প্রকাশ করতে ব্যর্থ হলে প্রতিষ্ঠানটি নজিরবিহীন ট্রাস্টি বা আমানত সংক্রান্ত মামলার মুখে পড়বে।',
            keyWord: 'Fiduciary',
            keyWordMeaningBn: 'আমানত সংক্রান্ত, বিশ্বস্ততামূলক বা আইনি জিম্মাদারি দায়িত্ব',
            editorialNote: 'কর্পোরেট গভর্নেন্স ও বিনিয়োগকারী সম্পর্কের ক্ষেত্রে শেয়ারহোল্ডারদের স্বার্থ সুরক্ষার আইনি বাধ্যবাধকতা বোঝাতে "fiduciary duty/liability" ব্যবহৃত হয়।'
          },
          {
            id: 'news-pro-6',
            source: 'Reuters Business',
            category: 'Global Supply Chains',
            headline: 'Global shipping corridors navigate geopolitical choke points and tariff volatility',
            sentence: 'Logistics conglomerates moved swiftly to streamline overland freight corridors to bypass maritime chokepoints and safeguard just-in-time delivery commitments.',
            sentenceBn: 'লজিস্টিকস জায়ান্টগুলো সমুদ্রপথের সংকটপূর্ণ রুটগুলো এড়িয়ে সঠিক সময়ে পণ্য ডেলিভারির প্রতিশ্রুতি রক্ষা করতে স্থলপথের মালবাহী করিডোরগুলোকে দ্রুতগতিতে সুবিন্যস্ত ও সহজতর করেছে।',
            keyWord: 'Streamline',
            keyWordMeaningBn: 'সুবিন্যস্ত করা, গতিশীল ও সহজসাধ্য করা',
            editorialNote: 'অপ্রয়োজনীয় জটিলতা বাদ দিয়ে কোনো ব্যবসায়িক প্রক্রিয়াকে দ্রুত ও সাশ্রয়ী করার প্রসঙ্গে "streamline operations" করপোরেট প্রেসের অন্যতম প্রিয় অভিব্যক্তি।'
          }
        ]
      }
    };


/* =====================================================================
   5. AI CARTOON CONVERSATIONS DATABASE (MAYA & LEO)
   Contextual 4-Line Dialogues with Bengali Subtitles for Curriculum Words
====================================================================== */
const WORD_CARTOON_CONVERSATIONS = {
  "beg-1": {
    "theme": "garden",
    "duration": 18,
    "targetWord": "serene",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Look at the gentle sunset over the garden, Leo. Everything feels so serene today.",
        "bn": "লিও, বাগানের ওপর স্নিগ্ধ সূর্যাস্তটি দেখ। আজ সবকিছু কেমন প্রশান্ত লাগছে।",
        "targetWord": "serene",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "It really is, Maya! Listening to the birds in this calm atmosphere clears my mind.",
        "bn": "সত্যিই তাই, মায়া! এই শান্ত পরিবেশে পাখিদের গান শুনলে মন ভালো হয়ে যায়।",
        "targetWord": null,
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Whenever I feel stressed, spending time in a serene place helps me recharge.",
        "bn": "আমি যখনই মানসিক চাপে থাকি, এমন কোনো নির্মল স্থানে সময় কাটালে আবার নতুন শক্তি পাই।",
        "targetWord": "serene",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Me too! Staying serene makes solving difficult problems much easier.",
        "bn": "আমারও তাই! শান্ত ও স্থির থাকলে কঠিন সমস্যার সমাধান করা অনেক সহজ হয়।",
        "targetWord": "serene",
        "approxDuration": 4.5
      }
    ]
  },
  "serene": {
    "theme": "garden",
    "duration": 18,
    "targetWord": "serene",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Look at the gentle sunset over the garden, Leo. Everything feels so serene today.",
        "bn": "লিও, বাগানের ওপর স্নিগ্ধ সূর্যাস্তটি দেখ। আজ সবকিছু কেমন প্রশান্ত লাগছে।",
        "targetWord": "serene",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "It really is, Maya! Listening to the birds in this calm atmosphere clears my mind.",
        "bn": "সত্যিই তাই, মায়া! এই শান্ত পরিবেশে পাখিদের গান শুনলে মন ভালো হয়ে যায়।",
        "targetWord": null,
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Whenever I feel stressed, spending time in a serene place helps me recharge.",
        "bn": "আমি যখনই মানসিক চাপে থাকি, এমন কোনো নির্মল স্থানে সময় কাটালে আবার নতুন শক্তি পাই।",
        "targetWord": "serene",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Me too! Staying serene makes solving difficult problems much easier.",
        "bn": "আমারও তাই! শান্ত ও স্থির থাকলে কঠিন সমস্যার সমাধান করা অনেক সহজ হয়।",
        "targetWord": "serene",
        "approxDuration": 4.5
      }
    ]
  },
  "beg-2": {
    "theme": "cafe",
    "duration": 18,
    "targetWord": "grateful",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Leo, I am so grateful to our mentor for helping us prepare for the test.",
        "bn": "লিও, পরীক্ষায় সহায়তার জন্য আমাদের শিক্ষকের প্রতি আমি খুবই কৃতজ্ঞ।",
        "targetWord": "grateful",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Yes! His patient guidance made all the difference in our confidence.",
        "bn": "হ্যাঁ! ওনার ধৈর্যশীল দিকনির্দেশনা আমাদের আত্মবিশ্বাস অনেক বাড়িয়ে দিয়েছে।",
        "targetWord": null,
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Being grateful reminds us to appreciate every bit of support we receive.",
        "bn": "কৃতজ্ঞ থাকার মনোভাব আমাদের মনে করিয়ে দেয় যে প্রতিটি সাহায্যের মূল্যায়ন করা উচিত।",
        "targetWord": "grateful",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Absolutely, Maya. A grateful heart always brings more joy to everyday life.",
        "bn": "একদম ঠিক, মায়া। একটি কৃতজ্ঞ হৃদয় সবসময় দৈনন্দিন জীবনে আরও আনন্দ নিয়ে আসে।",
        "targetWord": "grateful",
        "approxDuration": 4.5
      }
    ]
  },
  "grateful": {
    "theme": "cafe",
    "duration": 18,
    "targetWord": "grateful",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Leo, I am so grateful to our mentor for helping us prepare for the test.",
        "bn": "লিও, পরীক্ষায় সহায়তার জন্য আমাদের শিক্ষকের প্রতি আমি খুবই কৃতজ্ঞ।",
        "targetWord": "grateful",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Yes! His patient guidance made all the difference in our confidence.",
        "bn": "হ্যাঁ! ওনার ধৈর্যশীল দিকনির্দেশনা আমাদের আত্মবিশ্বাস অনেক বাড়িয়ে দিয়েছে।",
        "targetWord": null,
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Being grateful reminds us to appreciate every bit of support we receive.",
        "bn": "কৃতজ্ঞ থাকার মনোভাব আমাদের মনে করিয়ে দেয় যে প্রতিটি সাহায্যের মূল্যায়ন করা উচিত।",
        "targetWord": "grateful",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Absolutely, Maya. A grateful heart always brings more joy to everyday life.",
        "bn": "একদম ঠিক, মায়া। একটি কৃতজ্ঞ হৃদয় সবসময় দৈনন্দিন জীবনে আরও আনন্দ নিয়ে আসে।",
        "targetWord": "grateful",
        "approxDuration": 4.5
      }
    ]
  },
  "beg-3": {
    "theme": "library",
    "duration": 18,
    "targetWord": "diligent",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "You have been studying here for three hours, Leo! You are remarkably diligent.",
        "bn": "তুমি এখানে তিন ঘণ্টা ধরে পড়ছ, লিও! তুমি সত্যিই অসাধারণ পরিশ্রমী।",
        "targetWord": "diligent",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Thanks, Maya! I believe regular practice is the key to mastering English vocabulary.",
        "bn": "ধন্যবাদ, মায়া! আমি বিশ্বাস করি নিয়মিত অনুশীলনই ইংরেজি শব্দভান্ডার শেখার মূল চাবিকাঠি।",
        "targetWord": null,
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "A diligent learner never gives up when encountering difficult words.",
        "bn": "একজন অধ্যবসায়ী শিক্ষার্থী কঠিন শব্দের মুখোমুখি হলেও কখনো হাল ছেড়ে দেয় না।",
        "targetWord": "diligent",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Exactly! Our diligent efforts today will open great opportunities tomorrow.",
        "bn": "একদম! আজকের আমাদের পরিশ্রমী প্রচেষ্টা আগামী দিনে বড় সুযোগ তৈরি করবে।",
        "targetWord": "diligent",
        "approxDuration": 4.5
      }
    ]
  },
  "diligent": {
    "theme": "library",
    "duration": 18,
    "targetWord": "diligent",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "You have been studying here for three hours, Leo! You are remarkably diligent.",
        "bn": "তুমি এখানে তিন ঘণ্টা ধরে পড়ছ, লিও! তুমি সত্যিই অসাধারণ পরিশ্রমী।",
        "targetWord": "diligent",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Thanks, Maya! I believe regular practice is the key to mastering English vocabulary.",
        "bn": "ধন্যবাদ, মায়া! আমি বিশ্বাস করি নিয়মিত অনুশীলনই ইংরেজি শব্দভান্ডার শেখার মূল চাবিকাঠি।",
        "targetWord": null,
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "A diligent learner never gives up when encountering difficult words.",
        "bn": "একজন অধ্যবসায়ী শিক্ষার্থী কঠিন শব্দের মুখোমুখি হলেও কখনো হাল ছেড়ে দেয় না।",
        "targetWord": "diligent",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Exactly! Our diligent efforts today will open great opportunities tomorrow.",
        "bn": "একদম! আজকের আমাদের পরিশ্রমী প্রচেষ্টা আগামী দিনে বড় সুযোগ তৈরি করবে।",
        "targetWord": "diligent",
        "approxDuration": 4.5
      }
    ]
  },
  "beg-4": {
    "theme": "cafe",
    "duration": 18,
    "targetWord": "generous",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Did you hear that Leo shared his revision notes with the study group? That was so generous!",
        "bn": "তুমি কি শুনেছ যে লিও তার সব নোট স্টাডি গ্রুপের সাথে শেয়ার করেছে? এটা সত্যিই খুব উদার কাজ!",
        "targetWord": "generous",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "I am happy to help, Maya! Knowledge grows when we are generous with our learning.",
        "bn": "আমি সাহায্য করতে পেরে আনন্দিত, মায়া! শেখার ক্ষেত্রে উদার হলে জ্ঞান আরও বৃদ্ধি পায়।",
        "targetWord": null,
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "A generous person doesn't just share materials; they also give encouragement freely.",
        "bn": "একজন উদার মানুষ শুধু জিনিসপত্রই দেন না, বরং মন খুলে উৎসাহও জোগান।",
        "targetWord": "generous",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "True! When we are generous, everyone in the study circle succeeds together.",
        "bn": "সত্যি! যখন আমরা উদার হই, তখন দলের সবাই একসাথে সফল হতে পারে।",
        "targetWord": "generous",
        "approxDuration": 4.5
      }
    ]
  },
  "generous": {
    "theme": "cafe",
    "duration": 18,
    "targetWord": "generous",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Did you hear that Leo shared his revision notes with the study group? That was so generous!",
        "bn": "তুমি কি শুনেছ যে লিও তার সব নোট স্টাডি গ্রুপের সাথে শেয়ার করেছে? এটা সত্যিই খুব উদার কাজ!",
        "targetWord": "generous",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "I am happy to help, Maya! Knowledge grows when we are generous with our learning.",
        "bn": "আমি সাহায্য করতে পেরে আনন্দিত, মায়া! শেখার ক্ষেত্রে উদার হলে জ্ঞান আরও বৃদ্ধি পায়।",
        "targetWord": null,
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "A generous person doesn't just share materials; they also give encouragement freely.",
        "bn": "একজন উদার মানুষ শুধু জিনিসপত্রই দেন না, বরং মন খুলে উৎসাহও জোগান।",
        "targetWord": "generous",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "True! When we are generous, everyone in the study circle succeeds together.",
        "bn": "সত্যি! যখন আমরা উদার হই, তখন দলের সবাই একসাথে সফল হতে পারে।",
        "targetWord": "generous",
        "approxDuration": 4.5
      }
    ]
  },
  "beg-5": {
    "theme": "library",
    "duration": 18,
    "targetWord": "curious",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "I saw you reading that science encyclopedia, Leo. You always stay so curious!",
        "bn": "আমি দেখলাম তুমি বিজ্ঞানের বিশ্বকোষ পড়ছিলে, লিও। তুমি সবসময় সবকিছু জানতে খুব কৌতূহলী!",
        "targetWord": "curious",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "I love discovering how everyday technology works, Maya. Curiosity makes reading fun!",
        "bn": "দৈনন্দিন প্রযুক্তি কীভাবে কাজ করে তা আবিষ্কার করতে আমার ভালো লাগে, মায়া। কৌতূহল পড়াকে আনন্দদায়ক করে!",
        "targetWord": null,
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "A curious mind asks thoughtful questions and never stops discovering.",
        "bn": "একটি কৌতূহলী মন চিন্তাশীল প্রশ্ন করে এবং নতুন কিছু শেখা কখনোই থামায় না।",
        "targetWord": "curious",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Indeed! Staying curious turns every simple lesson into an exciting adventure.",
        "bn": "অবশ্যই! কৌতূহলী থাকা প্রতিটি সাধারণ পাঠকে একটি রোমাঞ্চকর অভিজ্ঞতায় পরিণত করে।",
        "targetWord": "curious",
        "approxDuration": 4.5
      }
    ]
  },
  "curious": {
    "theme": "library",
    "duration": 18,
    "targetWord": "curious",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "I saw you reading that science encyclopedia, Leo. You always stay so curious!",
        "bn": "আমি দেখলাম তুমি বিজ্ঞানের বিশ্বকোষ পড়ছিলে, লিও। তুমি সবসময় সবকিছু জানতে খুব কৌতূহলী!",
        "targetWord": "curious",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "I love discovering how everyday technology works, Maya. Curiosity makes reading fun!",
        "bn": "দৈনন্দিন প্রযুক্তি কীভাবে কাজ করে তা আবিষ্কার করতে আমার ভালো লাগে, মায়া। কৌতূহল পড়াকে আনন্দদায়ক করে!",
        "targetWord": null,
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "A curious mind asks thoughtful questions and never stops discovering.",
        "bn": "একটি কৌতূহলী মন চিন্তাশীল প্রশ্ন করে এবং নতুন কিছু শেখা কখনোই থামায় না।",
        "targetWord": "curious",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Indeed! Staying curious turns every simple lesson into an exciting adventure.",
        "bn": "অবশ্যই! কৌতূহলী থাকা প্রতিটি সাধারণ পাঠকে একটি রোমাঞ্চকর অভিজ্ঞতায় পরিণত করে।",
        "targetWord": "curious",
        "approxDuration": 4.5
      }
    ]
  },
  "beg-6": {
    "theme": "study",
    "duration": 18,
    "targetWord": "courage",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Public speaking was terrifying for me, but today I found the courage to speak up.",
        "bn": "জনসম্মুখে কথা বলা আমার জন্য ভীতিজনক ছিল, কিন্তু আজ আমি কথা বলার সাহস পেয়েছি।",
        "targetWord": "courage",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "I saw your presentation, Maya! You spoke with great courage and clarity.",
        "bn": "আমি তোমার উপস্থাপনা দেখেছি, মায়া! তুমি চমৎকার সাহস ও স্পষ্টতার সাথে কথা বলেছ।",
        "targetWord": "courage",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Courage doesn't mean having no fear; it means moving forward despite the fear.",
        "bn": "সাহস মানে ভয় না থাকা নয়; বরং ভয় থাকা সত্ত্বেও এগিয়ে যাওয়া।",
        "targetWord": "courage",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Well said! Every small step outside our comfort zone builds lasting courage.",
        "bn": "দারুণ বলেছ! স্বাচ্ছন্দ্য বলয়ের বাইরে প্রতিটি ছোট পদক্ষেপই স্থায়ী মনোবল গড়ে তোলে।",
        "targetWord": "courage",
        "approxDuration": 4.5
      }
    ]
  },
  "courage": {
    "theme": "study",
    "duration": 18,
    "targetWord": "courage",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Public speaking was terrifying for me, but today I found the courage to speak up.",
        "bn": "জনসম্মুখে কথা বলা আমার জন্য ভীতিজনক ছিল, কিন্তু আজ আমি কথা বলার সাহস পেয়েছি।",
        "targetWord": "courage",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "I saw your presentation, Maya! You spoke with great courage and clarity.",
        "bn": "আমি তোমার উপস্থাপনা দেখেছি, মায়া! তুমি চমৎকার সাহস ও স্পষ্টতার সাথে কথা বলেছ।",
        "targetWord": "courage",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Courage doesn't mean having no fear; it means moving forward despite the fear.",
        "bn": "সাহস মানে ভয় না থাকা নয়; বরং ভয় থাকা সত্ত্বেও এগিয়ে যাওয়া।",
        "targetWord": "courage",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Well said! Every small step outside our comfort zone builds lasting courage.",
        "bn": "দারুণ বলেছ! স্বাচ্ছন্দ্য বলয়ের বাইরে প্রতিটি ছোট পদক্ষেপই স্থায়ী মনোবল গড়ে তোলে।",
        "targetWord": "courage",
        "approxDuration": 4.5
      }
    ]
  },
  "beg-7": {
    "theme": "garden",
    "duration": 18,
    "targetWord": "harmony",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Working together in harmony made our team project so smooth and enjoyable.",
        "bn": "সম্প্রীতি ও মিল রেখে একসাথে কাজ করায় আমাদের প্রজেক্টটি খুব সুন্দর হয়েছে।",
        "targetWord": "harmony",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "I agree, Maya! When everyone listens respectfully, real harmony is created.",
        "bn": "আমি একমত, মায়া! সবাই যখন সম্মানের সাথে শোনে, তখন প্রকৃত সম্প্রীতি তৈরি হয়।",
        "targetWord": "harmony",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Living in harmony with others brings deep peace to any community.",
        "bn": "অন্যদের সাথে মিলেমিশে থাকা যেকোনো সমাজে গভীর শান্তি বয়ে আনে।",
        "targetWord": "harmony",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Let us keep building harmony wherever we go, both in school and at work.",
        "bn": "চল আমরা যেখানেই যাই, শিক্ষাঙ্গনে ও কর্মক্ষেত্রে সবসময় সম্প্রীতি বজায় রাখি।",
        "targetWord": "harmony",
        "approxDuration": 4.5
      }
    ]
  },
  "harmony": {
    "theme": "garden",
    "duration": 18,
    "targetWord": "harmony",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Working together in harmony made our team project so smooth and enjoyable.",
        "bn": "সম্প্রীতি ও মিল রেখে একসাথে কাজ করায় আমাদের প্রজেক্টটি খুব সুন্দর হয়েছে।",
        "targetWord": "harmony",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "I agree, Maya! When everyone listens respectfully, real harmony is created.",
        "bn": "আমি একমত, মায়া! সবাই যখন সম্মানের সাথে শোনে, তখন প্রকৃত সম্প্রীতি তৈরি হয়।",
        "targetWord": "harmony",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Living in harmony with others brings deep peace to any community.",
        "bn": "অন্যদের সাথে মিলেমিশে থাকা যেকোনো সমাজে গভীর শান্তি বয়ে আনে।",
        "targetWord": "harmony",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Let us keep building harmony wherever we go, both in school and at work.",
        "bn": "চল আমরা যেখানেই যাই, শিক্ষাঙ্গনে ও কর্মক্ষেত্রে সবসময় সম্প্রীতি বজায় রাখি।",
        "targetWord": "harmony",
        "approxDuration": 4.5
      }
    ]
  },
  "beg-8": {
    "theme": "cafe",
    "duration": 18,
    "targetWord": "polite",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "The receptionist greeted us with such a polite tone this morning.",
        "bn": "আজ সকালে রিসেপশনিস্ট খুব ভদ্র ও মার্জিত কণ্ঠে আমাদের অভ্যর্থনা জানিয়েছিলেন।",
        "targetWord": "polite",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Yes, being polite immediately puts people at ease and builds trust.",
        "bn": "হ্যাঁ, বিনয়ী ব্যবহার তাৎক্ষণিকভাবে মানুষের মন জয় করে এবং আস্থা তৈরি করে।",
        "targetWord": "polite",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Simple polite phrases like \"please\" and \"thank you\" make a huge difference.",
        "bn": "সহজ কিছু ভদ্র শব্দ যেমন \"দয়া করে\" এবং \"ধন্যবাদ\" অনেক বড় পরিবর্তন আনে।",
        "targetWord": "polite",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "A polite conversation is always the first step toward lasting friendships.",
        "bn": "একটি বিনয়ী কথোপকথন সবসময় দীর্ঘস্থায়ী বন্ধুত্বের প্রথম ধাপ।",
        "targetWord": "polite",
        "approxDuration": 4.5
      }
    ]
  },
  "polite": {
    "theme": "cafe",
    "duration": 18,
    "targetWord": "polite",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "The receptionist greeted us with such a polite tone this morning.",
        "bn": "আজ সকালে রিসেপশনিস্ট খুব ভদ্র ও মার্জিত কণ্ঠে আমাদের অভ্যর্থনা জানিয়েছিলেন।",
        "targetWord": "polite",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Yes, being polite immediately puts people at ease and builds trust.",
        "bn": "হ্যাঁ, বিনয়ী ব্যবহার তাৎক্ষণিকভাবে মানুষের মন জয় করে এবং আস্থা তৈরি করে।",
        "targetWord": "polite",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Simple polite phrases like \"please\" and \"thank you\" make a huge difference.",
        "bn": "সহজ কিছু ভদ্র শব্দ যেমন \"দয়া করে\" এবং \"ধন্যবাদ\" অনেক বড় পরিবর্তন আনে।",
        "targetWord": "polite",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "A polite conversation is always the first step toward lasting friendships.",
        "bn": "একটি বিনয়ী কথোপকথন সবসময় দীর্ঘস্থায়ী বন্ধুত্বের প্রথম ধাপ।",
        "targetWord": "polite",
        "approxDuration": 4.5
      }
    ]
  },
  "int-1": {
    "theme": "study",
    "duration": 18,
    "targetWord": "resilient",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Even after failing the first quiz, Leo stayed resilient and scored top marks today.",
        "bn": "প্রথম কুইজে খারাপ করার পরও লিও মনোবল না হারিয়ে ঘুরে দাঁড়িয়ে আজ সর্বোচ্চ নম্বর পেয়েছে।",
        "targetWord": "resilient",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Thank you, Maya! Setbacks happen, but being resilient taught me to adapt and grow.",
        "bn": "ধন্যবাদ, মায়া! বাধা আসতেই পারে, তবে প্রতিকূলতা কাটিয়ে ওঠার মানসিকতা আমাকে শিখিয়েছে কীভাবে মানিয়ে নিতে হয়।",
        "targetWord": "resilient",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "A resilient attitude turns every failure into a valuable stepping stone.",
        "bn": "একটি ইতিবাচক ও সহনশীল মনোভাব প্রতিটি ব্যর্থতাকে এগিয়ে যাওয়ার সিঁড়িতে পরিণত করে।",
        "targetWord": "resilient",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "True! The most successful learners are resilient when facing challenging grammar.",
        "bn": "সত্যি! সবচেয়ে সফল শিক্ষার্থীরাই কঠিন ব্যাকরণের মুখোমুখি হয়েও ঘুরে দাঁড়াতে পারে।",
        "targetWord": "resilient",
        "approxDuration": 4.5
      }
    ]
  },
  "resilient": {
    "theme": "study",
    "duration": 18,
    "targetWord": "resilient",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Even after failing the first quiz, Leo stayed resilient and scored top marks today.",
        "bn": "প্রথম কুইজে খারাপ করার পরও লিও মনোবল না হারিয়ে ঘুরে দাঁড়িয়ে আজ সর্বোচ্চ নম্বর পেয়েছে।",
        "targetWord": "resilient",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Thank you, Maya! Setbacks happen, but being resilient taught me to adapt and grow.",
        "bn": "ধন্যবাদ, মায়া! বাধা আসতেই পারে, তবে প্রতিকূলতা কাটিয়ে ওঠার মানসিকতা আমাকে শিখিয়েছে কীভাবে মানিয়ে নিতে হয়।",
        "targetWord": "resilient",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "A resilient attitude turns every failure into a valuable stepping stone.",
        "bn": "একটি ইতিবাচক ও সহনশীল মনোভাব প্রতিটি ব্যর্থতাকে এগিয়ে যাওয়ার সিঁড়িতে পরিণত করে।",
        "targetWord": "resilient",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "True! The most successful learners are resilient when facing challenging grammar.",
        "bn": "সত্যি! সবচেয়ে সফল শিক্ষার্থীরাই কঠিন ব্যাকরণের মুখোমুখি হয়েও ঘুরে দাঁড়াতে পারে।",
        "targetWord": "resilient",
        "approxDuration": 4.5
      }
    ]
  },
  "int-2": {
    "theme": "library",
    "duration": 18,
    "targetWord": "eloquent",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "The guest speaker delivered an eloquent talk on cultural heritage today.",
        "bn": "আজ অতিথি বক্তা সাংস্কৃতিক ঐতিহ্যের ওপর এক প্রাঞ্জল ও প্রভাবশালী বক্তৃতা দিয়েছেন।",
        "targetWord": "eloquent",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Her words flowed so naturally! Being eloquent is truly a powerful communication skill.",
        "bn": "তার কথাগুলো চমৎকার সাবলীলভাবে প্রকাশ পেয়েছিল! বাকপটু হওয়া যোগাযোগের এক অসাধারণ ক্ষমতা।",
        "targetWord": "eloquent",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "We can become more eloquent by expanding our vocabulary and practicing daily.",
        "bn": "নিয়মিত শব্দভান্ডার বাড়িয়ে এবং প্রতিদিন অনুশীলন করে আমরাও আরও বাকপটু হতে পারি।",
        "targetWord": "eloquent",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "I am inspired! Let us practice writing eloquent essays for our upcoming exam.",
        "bn": "আমি অনুপ্রাণিত! চল আমাদের আসন্ন পরীক্ষার জন্য প্রাঞ্জল প্রবন্ধ লেখার অনুশীলন করি।",
        "targetWord": "eloquent",
        "approxDuration": 4.5
      }
    ]
  },
  "eloquent": {
    "theme": "library",
    "duration": 18,
    "targetWord": "eloquent",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "The guest speaker delivered an eloquent talk on cultural heritage today.",
        "bn": "আজ অতিথি বক্তা সাংস্কৃতিক ঐতিহ্যের ওপর এক প্রাঞ্জল ও প্রভাবশালী বক্তৃতা দিয়েছেন।",
        "targetWord": "eloquent",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Her words flowed so naturally! Being eloquent is truly a powerful communication skill.",
        "bn": "তার কথাগুলো চমৎকার সাবলীলভাবে প্রকাশ পেয়েছিল! বাকপটু হওয়া যোগাযোগের এক অসাধারণ ক্ষমতা।",
        "targetWord": "eloquent",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "We can become more eloquent by expanding our vocabulary and practicing daily.",
        "bn": "নিয়মিত শব্দভান্ডার বাড়িয়ে এবং প্রতিদিন অনুশীলন করে আমরাও আরও বাকপটু হতে পারি।",
        "targetWord": "eloquent",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "I am inspired! Let us practice writing eloquent essays for our upcoming exam.",
        "bn": "আমি অনুপ্রাণিত! চল আমাদের আসন্ন পরীক্ষার জন্য প্রাঞ্জল প্রবন্ধ লেখার অনুশীলন করি।",
        "targetWord": "eloquent",
        "approxDuration": 4.5
      }
    ]
  },
  "int-3": {
    "theme": "cafe",
    "duration": 18,
    "targetWord": "inevitable",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "With so much dedicated practice, Leo, your fluency in English was inevitable.",
        "bn": "এত নিষ্ঠাবান অনুশীলনের পর, লিও, তোমার ইংরেজিতে সাবলীলতা অর্জন করা তো অনিবার্যই ছিল।",
        "targetWord": "inevitable",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Hard work makes progress inevitable, but change itself is also part of life.",
        "bn": "কঠোর পরিশ্রম অগ্রগতিকে নিশ্চিত করে, তবে পরিবর্তনও জীবনের একটি অংশ।",
        "targetWord": "inevitable",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Facing occasional mistakes while learning a new language is completely inevitable.",
        "bn": "নতুন কোনো ভাষা শেখার সময় মাঝে মাঝে ভুল হওয়া একেবারেই স্বাভাবিক ও অনিবার্য।",
        "targetWord": "inevitable",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Exactly! Once we accept that errors are inevitable, we learn without fear.",
        "bn": "একদম! ভুল হওয়া স্বাভাবিক এটা মেনে নিলে আমরা কোনো ভয় ছাড়াই শিখতে পারি।",
        "targetWord": "inevitable",
        "approxDuration": 4.5
      }
    ]
  },
  "inevitable": {
    "theme": "cafe",
    "duration": 18,
    "targetWord": "inevitable",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "With so much dedicated practice, Leo, your fluency in English was inevitable.",
        "bn": "এত নিষ্ঠাবান অনুশীলনের পর, লিও, তোমার ইংরেজিতে সাবলীলতা অর্জন করা তো অনিবার্যই ছিল।",
        "targetWord": "inevitable",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Hard work makes progress inevitable, but change itself is also part of life.",
        "bn": "কঠোর পরিশ্রম অগ্রগতিকে নিশ্চিত করে, তবে পরিবর্তনও জীবনের একটি অংশ।",
        "targetWord": "inevitable",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Facing occasional mistakes while learning a new language is completely inevitable.",
        "bn": "নতুন কোনো ভাষা শেখার সময় মাঝে মাঝে ভুল হওয়া একেবারেই স্বাভাবিক ও অনিবার্য।",
        "targetWord": "inevitable",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Exactly! Once we accept that errors are inevitable, we learn without fear.",
        "bn": "একদম! ভুল হওয়া স্বাভাবিক এটা মেনে নিলে আমরা কোনো ভয় ছাড়াই শিখতে পারি।",
        "targetWord": "inevitable",
        "approxDuration": 4.5
      }
    ]
  },
  "int-4": {
    "theme": "study",
    "duration": 18,
    "targetWord": "meticulous",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Your research report looks flawless, Leo! Your proofreading is meticulous.",
        "bn": "তোমার রিসার্চ রিপোর্টটি দেখতে নিখুঁত হয়েছে, লিও! তোমার রিভিশন সত্যিই অত্যন্ত খুঁতখুঁতে ও নিখুঁত।",
        "targetWord": "meticulous",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "I checked every single citation twice. A meticulous approach avoids silly errors.",
        "bn": "আমি প্রতিটি তথ্যসূত্র দুবার করে যাচাই করেছি। নিখুঁত দৃষ্টিভঙ্গি সাধারণ ভুলগুলো দূর করে।",
        "targetWord": "meticulous",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Being meticulous with word choices makes our written ideas much clearer.",
        "bn": "শব্দ নির্বাচনের ক্ষেত্রে যত্নশীল ও নিখুঁত হলে আমাদের লেখার ভাব অনেক স্পষ্ট হয়।",
        "targetWord": "meticulous",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Great habits start small. A meticulous study routine pays off over time.",
        "bn": "ভালো অভ্যাস ছোট থেকেই শুরু হয়। একটি নিখুঁত পড়ার রুটিন সময়ের সাথে দারুণ ফল দেয়।",
        "targetWord": "meticulous",
        "approxDuration": 4.5
      }
    ]
  },
  "meticulous": {
    "theme": "study",
    "duration": 18,
    "targetWord": "meticulous",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Your research report looks flawless, Leo! Your proofreading is meticulous.",
        "bn": "তোমার রিসার্চ রিপোর্টটি দেখতে নিখুঁত হয়েছে, লিও! তোমার রিভিশন সত্যিই অত্যন্ত খুঁতখুঁতে ও নিখুঁত।",
        "targetWord": "meticulous",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "I checked every single citation twice. A meticulous approach avoids silly errors.",
        "bn": "আমি প্রতিটি তথ্যসূত্র দুবার করে যাচাই করেছি। নিখুঁত দৃষ্টিভঙ্গি সাধারণ ভুলগুলো দূর করে।",
        "targetWord": "meticulous",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Being meticulous with word choices makes our written ideas much clearer.",
        "bn": "শব্দ নির্বাচনের ক্ষেত্রে যত্নশীল ও নিখুঁত হলে আমাদের লেখার ভাব অনেক স্পষ্ট হয়।",
        "targetWord": "meticulous",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Great habits start small. A meticulous study routine pays off over time.",
        "bn": "ভালো অভ্যাস ছোট থেকেই শুরু হয়। একটি নিখুঁত পড়ার রুটিন সময়ের সাথে দারুণ ফল দেয়।",
        "targetWord": "meticulous",
        "approxDuration": 4.5
      }
    ]
  },
  "int-5": {
    "theme": "library",
    "duration": 18,
    "targetWord": "collaborate",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "If we collaborate on this vocabulary project, we can finish it twice as fast.",
        "bn": "আমরা যদি এই শব্দভান্ডার প্রজেক্টে একসাথে কাজ করি, তবে দ্বিগুণ দ্রুত শেষ করতে পারব।",
        "targetWord": "collaborate",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Great idea! When we collaborate, we combine our individual strengths.",
        "bn": "দারুণ আইডিয়া! যখন আমরা সহযোগিতা করি, তখন আমাদের সবার দক্ষতা একত্রিত হয়।",
        "targetWord": "collaborate",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "In the modern workplace, the ability to collaborate with diverse teams is essential.",
        "bn": "আধুনিক কর্মক্ষেত্রে বৈচিত্র্যময় দলের সাথে একসাথে কাজ করার সক্ষমতা অপরিহার্য।",
        "targetWord": "collaborate",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Let us divide the chapters now and collaborate until everything is completed.",
        "bn": "চল আমরা অধ্যায়গুলো ভাগ করে নিই এবং সম্পূর্ণ শেষ হওয়া পর্যন্ত সহযোগিতা করে কাজ করি।",
        "targetWord": "collaborate",
        "approxDuration": 4.5
      }
    ]
  },
  "collaborate": {
    "theme": "library",
    "duration": 18,
    "targetWord": "collaborate",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "If we collaborate on this vocabulary project, we can finish it twice as fast.",
        "bn": "আমরা যদি এই শব্দভান্ডার প্রজেক্টে একসাথে কাজ করি, তবে দ্বিগুণ দ্রুত শেষ করতে পারব।",
        "targetWord": "collaborate",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Great idea! When we collaborate, we combine our individual strengths.",
        "bn": "দারুণ আইডিয়া! যখন আমরা সহযোগিতা করি, তখন আমাদের সবার দক্ষতা একত্রিত হয়।",
        "targetWord": "collaborate",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "In the modern workplace, the ability to collaborate with diverse teams is essential.",
        "bn": "আধুনিক কর্মক্ষেত্রে বৈচিত্র্যময় দলের সাথে একসাথে কাজ করার সক্ষমতা অপরিহার্য।",
        "targetWord": "collaborate",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Let us divide the chapters now and collaborate until everything is completed.",
        "bn": "চল আমরা অধ্যায়গুলো ভাগ করে নিই এবং সম্পূর্ণ শেষ হওয়া পর্যন্ত সহযোগিতা করে কাজ করি।",
        "targetWord": "collaborate",
        "approxDuration": 4.5
      }
    ]
  },
  "int-6": {
    "theme": "garden",
    "duration": 18,
    "targetWord": "insight",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Reading that classic novel gave me a fascinating insight into human nature.",
        "bn": "ঐ ক্লাসিক উপন্যাসটি পড়ে আমি মানবচরিত্রের এক আকর্ষণীয় গভীর অন্তর্দৃষ্টি পেয়েছি।",
        "targetWord": "insight",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Deep reading always brings valuable insight that surface skimming misses.",
        "bn": "গভীর মনোযোগ দিয়ে পড়লে এমন সূক্ষ্ম উপলব্ধি পাওয়া যায় যা ভাসাভাসা পড়ায় মেলে না।",
        "targetWord": "insight",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Our teacher shared an insightful perspective on how languages evolve over time.",
        "bn": "আমাদের শিক্ষক ভাষার বিবর্তন নিয়ে এক চমৎকার অন্তর্দৃষ্টিপূর্ণ দৃষ্টিভঙ্গি তুলে ধরেছিলেন।",
        "targetWord": "insight",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "That insight helped me understand why English borrows words from so many cultures.",
        "bn": "ঐ উপলব্ধিটি আমাকে বুঝতে সাহায্য করেছে কেন ইংরেজি এত সংস্কৃতি থেকে শব্দ ধার করেছে।",
        "targetWord": "insight",
        "approxDuration": 4.5
      }
    ]
  },
  "insight": {
    "theme": "garden",
    "duration": 18,
    "targetWord": "insight",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Reading that classic novel gave me a fascinating insight into human nature.",
        "bn": "ঐ ক্লাসিক উপন্যাসটি পড়ে আমি মানবচরিত্রের এক আকর্ষণীয় গভীর অন্তর্দৃষ্টি পেয়েছি।",
        "targetWord": "insight",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Deep reading always brings valuable insight that surface skimming misses.",
        "bn": "গভীর মনোযোগ দিয়ে পড়লে এমন সূক্ষ্ম উপলব্ধি পাওয়া যায় যা ভাসাভাসা পড়ায় মেলে না।",
        "targetWord": "insight",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Our teacher shared an insightful perspective on how languages evolve over time.",
        "bn": "আমাদের শিক্ষক ভাষার বিবর্তন নিয়ে এক চমৎকার অন্তর্দৃষ্টিপূর্ণ দৃষ্টিভঙ্গি তুলে ধরেছিলেন।",
        "targetWord": "insight",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "That insight helped me understand why English borrows words from so many cultures.",
        "bn": "ঐ উপলব্ধিটি আমাকে বুঝতে সাহায্য করেছে কেন ইংরেজি এত সংস্কৃতি থেকে শব্দ ধার করেছে।",
        "targetWord": "insight",
        "approxDuration": 4.5
      }
    ]
  },
  "int-7": {
    "theme": "cafe",
    "duration": 18,
    "targetWord": "momentum",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Our daily study streak has reached thirty days! We have built real momentum.",
        "bn": "আমাদের পড়ার নিয়মিত ধারা ত্রিশ দিনে পৌঁছেছে! আমরা সত্যিকারের অগ্রগতির গতিবেগ পেয়েছি।",
        "targetWord": "momentum",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Yes! Once you build momentum, staying consistent feels natural and effortless.",
        "bn": "হ্যাঁ! একবার অগ্রগতির ছন্দ পেয়ে গেলে নিয়মিত থাকা স্বাভাবিক ও সহজ হয়ে যায়।",
        "targetWord": "momentum",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "We must protect this momentum by reviewing at least ten new words every day.",
        "bn": "প্রতিদিন অন্তত দশটি নতুন শব্দ রিভিশন দিয়ে আমাদের এই অগ্রগতির ধারা ধরে রাখতে হবে।",
        "targetWord": "momentum",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Agreed! Positive momentum in learning leads to breakthroughs in confidence.",
        "bn": "একমত! শেখার গতিবেগ ধরে রাখলে আত্মবিশ্বাসে অভাবনীয় সাফল্য আসে।",
        "targetWord": "momentum",
        "approxDuration": 4.5
      }
    ]
  },
  "momentum": {
    "theme": "cafe",
    "duration": 18,
    "targetWord": "momentum",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Our daily study streak has reached thirty days! We have built real momentum.",
        "bn": "আমাদের পড়ার নিয়মিত ধারা ত্রিশ দিনে পৌঁছেছে! আমরা সত্যিকারের অগ্রগতির গতিবেগ পেয়েছি।",
        "targetWord": "momentum",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Yes! Once you build momentum, staying consistent feels natural and effortless.",
        "bn": "হ্যাঁ! একবার অগ্রগতির ছন্দ পেয়ে গেলে নিয়মিত থাকা স্বাভাবিক ও সহজ হয়ে যায়।",
        "targetWord": "momentum",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "We must protect this momentum by reviewing at least ten new words every day.",
        "bn": "প্রতিদিন অন্তত দশটি নতুন শব্দ রিভিশন দিয়ে আমাদের এই অগ্রগতির ধারা ধরে রাখতে হবে।",
        "targetWord": "momentum",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Agreed! Positive momentum in learning leads to breakthroughs in confidence.",
        "bn": "একমত! শেখার গতিবেগ ধরে রাখলে আত্মবিশ্বাসে অভাবনীয় সাফল্য আসে।",
        "targetWord": "momentum",
        "approxDuration": 4.5
      }
    ]
  },
  "int-8": {
    "theme": "study",
    "duration": 18,
    "targetWord": "versatile",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "This tablet is so versatile; I use it for note-taking, sketching, and reading.",
        "bn": "এই ট্যাবলেটটি বহুমুখী ব্যবহারযোগ্য; আমি এটি নোট নেওয়া, ছবি আঁকা এবং পড়ার কাজে ব্যবহার করি।",
        "targetWord": "versatile",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Just like you, Maya! You are a versatile student who excels in both art and math.",
        "bn": "ঠিক তোমার মতোই, মায়া! তুমি এক বহুমুখী প্রতিভাবান শিক্ষার্থী যে শিল্প ও গণিত উভয় বিষয়েই দক্ষ।",
        "targetWord": "versatile",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Learning versatile vocabulary allows us to express ideas in multiple contexts.",
        "bn": "বহুমুখী শব্দ শেখার ফলে আমরা বিভিন্ন পরিস্থিতিতে সুন্দরভাবে ভাব প্রকাশ করতে পারি।",
        "targetWord": "versatile",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "True! A versatile communicator adapts easily to any audience.",
        "bn": "সত্যি! একজন বহুমুখী বক্তা যেকোনো শ্রোতার সাথে সহজেই খাপ খাইয়ে নিতে পারে।",
        "targetWord": "versatile",
        "approxDuration": 4.5
      }
    ]
  },
  "versatile": {
    "theme": "study",
    "duration": 18,
    "targetWord": "versatile",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "This tablet is so versatile; I use it for note-taking, sketching, and reading.",
        "bn": "এই ট্যাবলেটটি বহুমুখী ব্যবহারযোগ্য; আমি এটি নোট নেওয়া, ছবি আঁকা এবং পড়ার কাজে ব্যবহার করি।",
        "targetWord": "versatile",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Just like you, Maya! You are a versatile student who excels in both art and math.",
        "bn": "ঠিক তোমার মতোই, মায়া! তুমি এক বহুমুখী প্রতিভাবান শিক্ষার্থী যে শিল্প ও গণিত উভয় বিষয়েই দক্ষ।",
        "targetWord": "versatile",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Learning versatile vocabulary allows us to express ideas in multiple contexts.",
        "bn": "বহুমুখী শব্দ শেখার ফলে আমরা বিভিন্ন পরিস্থিতিতে সুন্দরভাবে ভাব প্রকাশ করতে পারি।",
        "targetWord": "versatile",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "True! A versatile communicator adapts easily to any audience.",
        "bn": "সত্যি! একজন বহুমুখী বক্তা যেকোনো শ্রোতার সাথে সহজেই খাপ খাইয়ে নিতে পারে।",
        "targetWord": "versatile",
        "approxDuration": 4.5
      }
    ]
  },
  "adv-1": {
    "theme": "garden",
    "duration": 18,
    "targetWord": "ephemeral",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Look at that cherry blossom petal drifting down. Its beauty is so ephemeral.",
        "bn": "ঝরে পড়া চেরি ফুলের পাপড়িটি দেখ। এর সৌন্দর্য কতটা ক্ষণস্থায়ী।",
        "targetWord": "ephemeral",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Indeed, Maya. Because blossoms are ephemeral, we appreciate them even more.",
        "bn": "অবশ্যই, মায়া। ফুলের আয়ু স্বল্পস্থায়ী বলেই আমরা এদের আরও বেশি কদর করি।",
        "targetWord": "ephemeral",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Many digital trends are ephemeral, but genuine knowledge lasts a lifetime.",
        "bn": "অনলাইনের অনেক ট্রেন্ডই ক্ষণস্থায়ী, তবে প্রকৃত জ্ঞান সারাজীবন স্থায়ী হয়।",
        "targetWord": "ephemeral",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Well said! Let us focus on timeless wisdom rather than ephemeral distractions.",
        "bn": "দারুণ বলেছ! চল ক্ষণস্থায়ী মোহের চেয়ে চিরন্তন জ্ঞানের দিকেই আমাদের মনোযোগ দিই।",
        "targetWord": "ephemeral",
        "approxDuration": 4.5
      }
    ]
  },
  "ephemeral": {
    "theme": "garden",
    "duration": 18,
    "targetWord": "ephemeral",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Look at that cherry blossom petal drifting down. Its beauty is so ephemeral.",
        "bn": "ঝরে পড়া চেরি ফুলের পাপড়িটি দেখ। এর সৌন্দর্য কতটা ক্ষণস্থায়ী।",
        "targetWord": "ephemeral",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Indeed, Maya. Because blossoms are ephemeral, we appreciate them even more.",
        "bn": "অবশ্যই, মায়া। ফুলের আয়ু স্বল্পস্থায়ী বলেই আমরা এদের আরও বেশি কদর করি।",
        "targetWord": "ephemeral",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Many digital trends are ephemeral, but genuine knowledge lasts a lifetime.",
        "bn": "অনলাইনের অনেক ট্রেন্ডই ক্ষণস্থায়ী, তবে প্রকৃত জ্ঞান সারাজীবন স্থায়ী হয়।",
        "targetWord": "ephemeral",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Well said! Let us focus on timeless wisdom rather than ephemeral distractions.",
        "bn": "দারুণ বলেছ! চল ক্ষণস্থায়ী মোহের চেয়ে চিরন্তন জ্ঞানের দিকেই আমাদের মনোযোগ দিই।",
        "targetWord": "ephemeral",
        "approxDuration": 4.5
      }
    ]
  },
  "adv-2": {
    "theme": "cafe",
    "duration": 18,
    "targetWord": "ubiquitous",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Smartphones have become truly ubiquitous in every corner of the world today.",
        "bn": "আজ বিশ্বের প্রতিটি কোণে স্মার্টফোন সত্যি সর্বব্যাপী হয়ে উঠেছে।",
        "targetWord": "ubiquitous",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Yes, their ubiquitous presence has transformed how we communicate and learn.",
        "bn": "হ্যাঁ, সর্বত্র তাদের উপস্থিতি আমাদের যোগাযোগ ও শেখার ধরণকে বদলে দিয়েছে।",
        "targetWord": "ubiquitous",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "English has also achieved a ubiquitous status as the global language of science.",
        "bn": "বিজ্ঞানের বৈশ্বিক ভাষা হিসেবে ইংরেজিও আজ একটি সর্বব্যাপী মর্যাদা অর্জন করেছে।",
        "targetWord": "ubiquitous",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "That is why mastering vocabulary opens doors everywhere across the globe.",
        "bn": "এ কারণেই সমৃদ্ধ শব্দভান্ডার বিশ্বজুড়ে সর্বত্র সফলতার দ্বার উন্মোচন করে।",
        "targetWord": "ubiquitous",
        "approxDuration": 4.5
      }
    ]
  },
  "ubiquitous": {
    "theme": "cafe",
    "duration": 18,
    "targetWord": "ubiquitous",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Smartphones have become truly ubiquitous in every corner of the world today.",
        "bn": "আজ বিশ্বের প্রতিটি কোণে স্মার্টফোন সত্যি সর্বব্যাপী হয়ে উঠেছে।",
        "targetWord": "ubiquitous",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Yes, their ubiquitous presence has transformed how we communicate and learn.",
        "bn": "হ্যাঁ, সর্বত্র তাদের উপস্থিতি আমাদের যোগাযোগ ও শেখার ধরণকে বদলে দিয়েছে।",
        "targetWord": "ubiquitous",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "English has also achieved a ubiquitous status as the global language of science.",
        "bn": "বিজ্ঞানের বৈশ্বিক ভাষা হিসেবে ইংরেজিও আজ একটি সর্বব্যাপী মর্যাদা অর্জন করেছে।",
        "targetWord": "ubiquitous",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "That is why mastering vocabulary opens doors everywhere across the globe.",
        "bn": "এ কারণেই সমৃদ্ধ শব্দভান্ডার বিশ্বজুড়ে সর্বত্র সফলতার দ্বার উন্মোচন করে।",
        "targetWord": "ubiquitous",
        "approxDuration": 4.5
      }
    ]
  },
  "adv-3": {
    "theme": "study",
    "duration": 18,
    "targetWord": "pragmatic",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Instead of worrying about high scores, Leo took a pragmatic approach to daily revision.",
        "bn": "উচ্চ নম্বরের দুশ্চিন্তা না করে লিও প্রতিদিনের রিভিশনে বাস্তববাদী দৃষ্টিভঙ্গি গ্রহণ করেছিল।",
        "targetWord": "pragmatic",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "I focused on practical study habits. A pragmatic mindset solves real problems.",
        "bn": "আমি ব্যবহারিক পড়ার অভ্যাসে জোর দিয়েছিলাম। বাস্তববাদী মানসিকতা প্রকৃত সমস্যার সমাধান করে।",
        "targetWord": "pragmatic",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "When planning a career, being both visionary and pragmatic is key.",
        "bn": "ক্যারিয়ার পরিকল্পনার ক্ষেত্রে যেমন স্বপ্নদর্শী হতে হয়, তেমনি বাস্তববাদী হওয়াও জরুরি।",
        "targetWord": "pragmatic",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Exactly! Pragmatic solutions turn ambitious goals into everyday reality.",
        "bn": "একদম! বাস্তবভিত্তিক সমাধানই উচ্চাকাঙ্ক্ষী লক্ষ্যকে প্রাত্যহিক বাস্তবে রূপ দেয়।",
        "targetWord": "pragmatic",
        "approxDuration": 4.5
      }
    ]
  },
  "pragmatic": {
    "theme": "study",
    "duration": 18,
    "targetWord": "pragmatic",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Instead of worrying about high scores, Leo took a pragmatic approach to daily revision.",
        "bn": "উচ্চ নম্বরের দুশ্চিন্তা না করে লিও প্রতিদিনের রিভিশনে বাস্তববাদী দৃষ্টিভঙ্গি গ্রহণ করেছিল।",
        "targetWord": "pragmatic",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "I focused on practical study habits. A pragmatic mindset solves real problems.",
        "bn": "আমি ব্যবহারিক পড়ার অভ্যাসে জোর দিয়েছিলাম। বাস্তববাদী মানসিকতা প্রকৃত সমস্যার সমাধান করে।",
        "targetWord": "pragmatic",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "When planning a career, being both visionary and pragmatic is key.",
        "bn": "ক্যারিয়ার পরিকল্পনার ক্ষেত্রে যেমন স্বপ্নদর্শী হতে হয়, তেমনি বাস্তববাদী হওয়াও জরুরি।",
        "targetWord": "pragmatic",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Exactly! Pragmatic solutions turn ambitious goals into everyday reality.",
        "bn": "একদম! বাস্তবভিত্তিক সমাধানই উচ্চাকাঙ্ক্ষী লক্ষ্যকে প্রাত্যহিক বাস্তবে রূপ দেয়।",
        "targetWord": "pragmatic",
        "approxDuration": 4.5
      }
    ]
  },
  "adv-4": {
    "theme": "library",
    "duration": 18,
    "targetWord": "scrutinize",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Before submitting the thesis, the editor will scrutinize every paragraph.",
        "bn": "থিসিস জমা দেওয়ার আগে সম্পাদক প্রতিটি অনুচ্ছেদ খুঁটিয়ে পরীক্ষা করবেন।",
        "targetWord": "scrutinize",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Scholars must always scrutinize their sources to prevent misinformation.",
        "bn": "ভুল তথ্য রোধ করতে গবেষকদের সবসময় তাদের উৎসগুলো চুলচেরা বিশ্লেষণ করা উচিত।",
        "targetWord": "scrutinize",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "When we scrutinize complex words, we uncover their root origins and history.",
        "bn": "আমরা যখন জটিল শব্দগুলো গভীরভাবে বিশ্লেষণ করি, তখন তাদের মূল উৎস ও ইতিহাস জানতে পারি।",
        "targetWord": "scrutinize",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "That careful scrutiny makes advanced vocabulary stick in our long-term memory.",
        "bn": "ঐ পুঙ্খানুপুঙ্খ বিশ্লেষণই উচ্চতর শব্দগুলোকে আমাদের স্মৃতিতে স্থায়ী করে তোলে।",
        "targetWord": "scrutinize",
        "approxDuration": 4.5
      }
    ]
  },
  "scrutinize": {
    "theme": "library",
    "duration": 18,
    "targetWord": "scrutinize",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Before submitting the thesis, the editor will scrutinize every paragraph.",
        "bn": "থিসিস জমা দেওয়ার আগে সম্পাদক প্রতিটি অনুচ্ছেদ খুঁটিয়ে পরীক্ষা করবেন।",
        "targetWord": "scrutinize",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Scholars must always scrutinize their sources to prevent misinformation.",
        "bn": "ভুল তথ্য রোধ করতে গবেষকদের সবসময় তাদের উৎসগুলো চুলচেরা বিশ্লেষণ করা উচিত।",
        "targetWord": "scrutinize",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "When we scrutinize complex words, we uncover their root origins and history.",
        "bn": "আমরা যখন জটিল শব্দগুলো গভীরভাবে বিশ্লেষণ করি, তখন তাদের মূল উৎস ও ইতিহাস জানতে পারি।",
        "targetWord": "scrutinize",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "That careful scrutiny makes advanced vocabulary stick in our long-term memory.",
        "bn": "ঐ পুঙ্খানুপুঙ্খ বিশ্লেষণই উচ্চতর শব্দগুলোকে আমাদের স্মৃতিতে স্থায়ী করে তোলে।",
        "targetWord": "scrutinize",
        "approxDuration": 4.5
      }
    ]
  },
  "adv-5": {
    "theme": "library",
    "duration": 18,
    "targetWord": "quintessential",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "This quiet reading hall with oak desks is the quintessential study space.",
        "bn": "ওক কাঠের টেবিল সাজানো এই শান্ত রিডিং হলটি একটি আদর্শ পড়ার জায়গার খাঁটি উদাহরণ।",
        "targetWord": "quintessential",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "It has the quintessential ambiance for deep concentration and reflection.",
        "bn": "গভীর মনোযোগ ও ভাবনার জন্য এখানে সর্বোৎকৃষ্ট পরিবেশ বিদ্যমান।",
        "targetWord": "quintessential",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Jane Austen's prose is often seen as the quintessential British literature style.",
        "bn": "জেন অস্টিনের গদ্যকে প্রায়শই ব্রিটিশ সাহিত্যের এক সর্বোৎকৃষ্ট নিদর্শন হিসেবে গণ্য করা হয়।",
        "targetWord": "quintessential",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Studying such quintessential works elevates our own vocabulary and writing.",
        "bn": "এমন উৎকৃষ্ট সাহিত্যকর্ম অধ্যয়ন আমাদের নিজস্ব শব্দভান্ডার ও লেখাকে উন্নত করে।",
        "targetWord": "quintessential",
        "approxDuration": 4.5
      }
    ]
  },
  "quintessential": {
    "theme": "library",
    "duration": 18,
    "targetWord": "quintessential",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "This quiet reading hall with oak desks is the quintessential study space.",
        "bn": "ওক কাঠের টেবিল সাজানো এই শান্ত রিডিং হলটি একটি আদর্শ পড়ার জায়গার খাঁটি উদাহরণ।",
        "targetWord": "quintessential",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "It has the quintessential ambiance for deep concentration and reflection.",
        "bn": "গভীর মনোযোগ ও ভাবনার জন্য এখানে সর্বোৎকৃষ্ট পরিবেশ বিদ্যমান।",
        "targetWord": "quintessential",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Jane Austen's prose is often seen as the quintessential British literature style.",
        "bn": "জেন অস্টিনের গদ্যকে প্রায়শই ব্রিটিশ সাহিত্যের এক সর্বোৎকৃষ্ট নিদর্শন হিসেবে গণ্য করা হয়।",
        "targetWord": "quintessential",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Studying such quintessential works elevates our own vocabulary and writing.",
        "bn": "এমন উৎকৃষ্ট সাহিত্যকর্ম অধ্যয়ন আমাদের নিজস্ব শব্দভান্ডার ও লেখাকে উন্নত করে।",
        "targetWord": "quintessential",
        "approxDuration": 4.5
      }
    ]
  },
  "adv-6": {
    "theme": "study",
    "duration": 18,
    "targetWord": "ambiguous",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "The prompt was ambiguous, so several students interpreted it differently.",
        "bn": "নির্দেশনাটি অস্পষ্ট ও দ্ব্যর্থক ছিল, যার ফলে শিক্ষার্থীরা একে ভিন্ন ভিন্নভাবে বুঝেছিল।",
        "targetWord": "ambiguous",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Ambiguous wording in contracts or exam questions can cause serious confusion.",
        "bn": "চুক্তিপত্রে বা পরীক্ষার প্রশ্নে অস্পষ্ট শব্দচয়ন মারাত্মক বিভ্রান্তি সৃষ্টি করতে পারে।",
        "targetWord": "ambiguous",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Clear writers choose precise vocabulary to avoid ambiguous statements.",
        "bn": "দক্ষ লেখকরা সবসময় দ্ব্যর্থহীন ও স্পষ্ট বক্তব্য দিতে সঠিক শব্দ নির্বাচন করেন।",
        "targetWord": "ambiguous",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Learning synonyms helps us eliminate ambiguous phrasing from our essays.",
        "bn": "সমার্থক শব্দ জানা আমাদের প্রবন্ধ থেকে যেকোনো অস্পষ্ট ভাষা দূর করতে সাহায্য করে।",
        "targetWord": "ambiguous",
        "approxDuration": 4.5
      }
    ]
  },
  "ambiguous": {
    "theme": "study",
    "duration": 18,
    "targetWord": "ambiguous",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "The prompt was ambiguous, so several students interpreted it differently.",
        "bn": "নির্দেশনাটি অস্পষ্ট ও দ্ব্যর্থক ছিল, যার ফলে শিক্ষার্থীরা একে ভিন্ন ভিন্নভাবে বুঝেছিল।",
        "targetWord": "ambiguous",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Ambiguous wording in contracts or exam questions can cause serious confusion.",
        "bn": "চুক্তিপত্রে বা পরীক্ষার প্রশ্নে অস্পষ্ট শব্দচয়ন মারাত্মক বিভ্রান্তি সৃষ্টি করতে পারে।",
        "targetWord": "ambiguous",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Clear writers choose precise vocabulary to avoid ambiguous statements.",
        "bn": "দক্ষ লেখকরা সবসময় দ্ব্যর্থহীন ও স্পষ্ট বক্তব্য দিতে সঠিক শব্দ নির্বাচন করেন।",
        "targetWord": "ambiguous",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Learning synonyms helps us eliminate ambiguous phrasing from our essays.",
        "bn": "সমার্থক শব্দ জানা আমাদের প্রবন্ধ থেকে যেকোনো অস্পষ্ট ভাষা দূর করতে সাহায্য করে।",
        "targetWord": "ambiguous",
        "approxDuration": 4.5
      }
    ]
  },
  "adv-7": {
    "theme": "cafe",
    "duration": 18,
    "targetWord": "nuance",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Did you catch the subtle nuance between \"confident\" and \"arrogant\" in that speech?",
        "bn": "তুমি কি বক্তৃতায় \"আত্মবিশ্বাসী\" এবং \"অহংকারী\" শব্দের মধ্যকার সূক্ষ্ম ভাবটি লক্ষ্য করেছ?",
        "targetWord": "nuance",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Yes! Understanding every nuance of tone makes communication far more artful.",
        "bn": "হ্যাঁ! বক্তব্যের প্রতিটি সূক্ষ্ম ভাব বুঝতে পারলে যোগাযোগ অনেক বেশি শিল্পসম্মত হয়।",
        "targetWord": "nuance",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Poets and translators pay close attention to the emotional nuance of words.",
        "bn": "কবি ও অনুবাদকরা শব্দের আবেগীয় সূক্ষ্ম পার্থক্যের প্রতি গভীর মনোযোগ দেন।",
        "targetWord": "nuance",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Mastering these nuances marks the transition from intermediate to master speaker.",
        "bn": "এই সূক্ষ্ম ভাবগুলো আয়ত্ত করাই একজন শিক্ষার্থীকে দক্ষ বক্তায় রূপান্তরিত করে।",
        "targetWord": "nuance",
        "approxDuration": 4.5
      }
    ]
  },
  "nuance": {
    "theme": "cafe",
    "duration": 18,
    "targetWord": "nuance",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Did you catch the subtle nuance between \"confident\" and \"arrogant\" in that speech?",
        "bn": "তুমি কি বক্তৃতায় \"আত্মবিশ্বাসী\" এবং \"অহংকারী\" শব্দের মধ্যকার সূক্ষ্ম ভাবটি লক্ষ্য করেছ?",
        "targetWord": "nuance",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Yes! Understanding every nuance of tone makes communication far more artful.",
        "bn": "হ্যাঁ! বক্তব্যের প্রতিটি সূক্ষ্ম ভাব বুঝতে পারলে যোগাযোগ অনেক বেশি শিল্পসম্মত হয়।",
        "targetWord": "nuance",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Poets and translators pay close attention to the emotional nuance of words.",
        "bn": "কবি ও অনুবাদকরা শব্দের আবেগীয় সূক্ষ্ম পার্থক্যের প্রতি গভীর মনোযোগ দেন।",
        "targetWord": "nuance",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Mastering these nuances marks the transition from intermediate to master speaker.",
        "bn": "এই সূক্ষ্ম ভাবগুলো আয়ত্ত করাই একজন শিক্ষার্থীকে দক্ষ বক্তায় রূপান্তরিত করে।",
        "targetWord": "nuance",
        "approxDuration": 4.5
      }
    ]
  },
  "adv-8": {
    "theme": "library",
    "duration": 18,
    "targetWord": "synthesis",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Our final presentation represents a creative synthesis of art, science, and history.",
        "bn": "আমাদের চূড়ান্ত প্রেজেন্টেশনটি শিল্প, বিজ্ঞান ও ইতিহাসের এক চমৎকার সমন্বয়।",
        "targetWord": "synthesis",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Synthesizing ideas from different fields creates truly original breakthroughs.",
        "bn": "বিভিন্ন বিষয়ের ধারণাসমূহের সংশ্লেষণ এক অনন্য নতুন উদ্ভাবন সৃষ্টি করে।",
        "targetWord": "synthesis",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "A strong essay requires the synthesis of multiple academic viewpoints.",
        "bn": "একটি শক্তিশালী প্রবন্ধের জন্য একাধিক অ্যাকাডেমিক দৃষ্টিভঙ্গির সুসমন্বয় প্রয়োজন।",
        "targetWord": "synthesis",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Let us refine our conclusion to show how all these theories achieve synthesis.",
        "bn": "চল আমাদের উপসংহারটি পরিমার্জন করি যাতে দেখা যায় কীভাবে সব তত্ত্বের সমন্বয় হয়েছে।",
        "targetWord": "synthesis",
        "approxDuration": 4.5
      }
    ]
  },
  "synthesis": {
    "theme": "library",
    "duration": 18,
    "targetWord": "synthesis",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Our final presentation represents a creative synthesis of art, science, and history.",
        "bn": "আমাদের চূড়ান্ত প্রেজেন্টেশনটি শিল্প, বিজ্ঞান ও ইতিহাসের এক চমৎকার সমন্বয়।",
        "targetWord": "synthesis",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Synthesizing ideas from different fields creates truly original breakthroughs.",
        "bn": "বিভিন্ন বিষয়ের ধারণাসমূহের সংশ্লেষণ এক অনন্য নতুন উদ্ভাবন সৃষ্টি করে।",
        "targetWord": "synthesis",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "A strong essay requires the synthesis of multiple academic viewpoints.",
        "bn": "একটি শক্তিশালী প্রবন্ধের জন্য একাধিক অ্যাকাডেমিক দৃষ্টিভঙ্গির সুসমন্বয় প্রয়োজন।",
        "targetWord": "synthesis",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Let us refine our conclusion to show how all these theories achieve synthesis.",
        "bn": "চল আমাদের উপসংহারটি পরিমার্জন করি যাতে দেখা যায় কীভাবে সব তত্ত্বের সমন্বয় হয়েছে।",
        "targetWord": "synthesis",
        "approxDuration": 4.5
      }
    ]
  },
  "pro-1": {
    "theme": "study",
    "duration": 18,
    "targetWord": "mitigate",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Our proactive contingency plan helped mitigate the risk of project delays.",
        "bn": "আমাদের সতর্কতামূলক পূর্বপরিকল্পনা প্রজেক্টে বিলম্বের ঝুঁকি প্রশমিত করতে সাহায্য করেছে।",
        "targetWord": "mitigate",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Excellent strategy! Taking early action is the best way to mitigate financial loss.",
        "bn": "চমৎকার কৌশল! দ্রুত পদক্ষেপ গ্রহণ করাই আর্থিক ক্ষতি কমানোর সর্বোত্তম উপায়।",
        "targetWord": "mitigate",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Good leaders work tirelessly to mitigate workplace stress and burnout.",
        "bn": "দক্ষ নেতারা সবসময় কাজের চাপ ও মানসিক ক্লান্তি প্রশমিত করার জন্য কাজ করেন।",
        "targetWord": "mitigate",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Effective communication can mitigate misunderstandings before they escalate.",
        "bn": "কার্যকর যোগাযোগ যেকোনো ভুল বোঝাবুঝি বড় হওয়ার আগেই তা প্রশমিত করতে পারে।",
        "targetWord": "mitigate",
        "approxDuration": 4.5
      }
    ]
  },
  "mitigate": {
    "theme": "study",
    "duration": 18,
    "targetWord": "mitigate",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Our proactive contingency plan helped mitigate the risk of project delays.",
        "bn": "আমাদের সতর্কতামূলক পূর্বপরিকল্পনা প্রজেক্টে বিলম্বের ঝুঁকি প্রশমিত করতে সাহায্য করেছে।",
        "targetWord": "mitigate",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Excellent strategy! Taking early action is the best way to mitigate financial loss.",
        "bn": "চমৎকার কৌশল! দ্রুত পদক্ষেপ গ্রহণ করাই আর্থিক ক্ষতি কমানোর সর্বোত্তম উপায়।",
        "targetWord": "mitigate",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Good leaders work tirelessly to mitigate workplace stress and burnout.",
        "bn": "দক্ষ নেতারা সবসময় কাজের চাপ ও মানসিক ক্লান্তি প্রশমিত করার জন্য কাজ করেন।",
        "targetWord": "mitigate",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Effective communication can mitigate misunderstandings before they escalate.",
        "bn": "কার্যকর যোগাযোগ যেকোনো ভুল বোঝাবুঝি বড় হওয়ার আগেই তা প্রশমিত করতে পারে।",
        "targetWord": "mitigate",
        "approxDuration": 4.5
      }
    ]
  },
  "pro-2": {
    "theme": "cafe",
    "duration": 18,
    "targetWord": "expedite",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "We upgraded our automation workflow to expedite the delivery of customer orders.",
        "bn": "গ্রাহকদের অর্ডারের সরবরাহ ত্বরান্বিত করার জন্য আমরা আমাদের অটোমেশন উন্নত করেছি।",
        "targetWord": "expedite",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "That will expedite response times and significantly boost client satisfaction.",
        "bn": "এটি উত্তর প্রদানের সময় দ্রুত করবে এবং গ্রাহকদের সন্তুষ্টি ব্যাপকভাবে বাড়িয়ে তুলবে।",
        "targetWord": "expedite",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Can we request the admissions office to expedite our visa documentation?",
        "bn": "আমরা কি ভর্তি দপ্তরকে আমাদের ভিসা সংক্রান্ত কাগজপত্র দ্রুত সম্পন্ন করতে অনুরোধ করতে পারি?",
        "targetWord": "expedite",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "I will submit the urgent cover letter today to expedite their review process.",
        "bn": "তাদের মূল্যায়ন প্রক্রিয়া ত্বরান্বিত করতে আমি আজই জরুরি কভার লেটারটি জমা দেব।",
        "targetWord": "expedite",
        "approxDuration": 4.5
      }
    ]
  },
  "expedite": {
    "theme": "cafe",
    "duration": 18,
    "targetWord": "expedite",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "We upgraded our automation workflow to expedite the delivery of customer orders.",
        "bn": "গ্রাহকদের অর্ডারের সরবরাহ ত্বরান্বিত করার জন্য আমরা আমাদের অটোমেশন উন্নত করেছি।",
        "targetWord": "expedite",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "That will expedite response times and significantly boost client satisfaction.",
        "bn": "এটি উত্তর প্রদানের সময় দ্রুত করবে এবং গ্রাহকদের সন্তুষ্টি ব্যাপকভাবে বাড়িয়ে তুলবে।",
        "targetWord": "expedite",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Can we request the admissions office to expedite our visa documentation?",
        "bn": "আমরা কি ভর্তি দপ্তরকে আমাদের ভিসা সংক্রান্ত কাগজপত্র দ্রুত সম্পন্ন করতে অনুরোধ করতে পারি?",
        "targetWord": "expedite",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "I will submit the urgent cover letter today to expedite their review process.",
        "bn": "তাদের মূল্যায়ন প্রক্রিয়া ত্বরান্বিত করতে আমি আজই জরুরি কভার লেটারটি জমা দেব।",
        "targetWord": "expedite",
        "approxDuration": 4.5
      }
    ]
  },
  "pro-3": {
    "theme": "library",
    "duration": 18,
    "targetWord": "astute",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "The manager made an astute market observation that predicted consumer trends.",
        "bn": "ম্যানেজার একটি বিচক্ষণ পর্যবেক্ষণ করেছিলেন যা ভোক্তাদের ভবিষ্যৎ চাহিদার পূর্বাভাস দিয়েছিল।",
        "targetWord": "astute",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Her astute analysis gave our enterprise a tremendous competitive advantage.",
        "bn": "তার তীক্ষ্ণবুদ্ধিসম্পন্ন বিশ্লেষণ আমাদের প্রতিষ্ঠানকে এক বিশাল প্রতিযোগিতামূলক সুবিধা এনে দিয়েছিল।",
        "targetWord": "astute",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "An astute investor evaluates both financial data and executive integrity.",
        "bn": "একজন বিচক্ষণ বিনিয়োগকারী আর্থিক তথ্য এবং ব্যবস্থাপনা সততা উভয়ই বিবেচনা করেন।",
        "targetWord": "astute",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Developing astute judgment requires constant reading and critical thinking.",
        "bn": "বিচক্ষণ বিচারবুদ্ধি গড়ে তুলতে নিয়মিত পড়াশোনা এবং যৌক্তিক চিন্তাভাবনা প্রয়োজন।",
        "targetWord": "astute",
        "approxDuration": 4.5
      }
    ]
  },
  "astute": {
    "theme": "library",
    "duration": 18,
    "targetWord": "astute",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "The manager made an astute market observation that predicted consumer trends.",
        "bn": "ম্যানেজার একটি বিচক্ষণ পর্যবেক্ষণ করেছিলেন যা ভোক্তাদের ভবিষ্যৎ চাহিদার পূর্বাভাস দিয়েছিল।",
        "targetWord": "astute",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Her astute analysis gave our enterprise a tremendous competitive advantage.",
        "bn": "তার তীক্ষ্ণবুদ্ধিসম্পন্ন বিশ্লেষণ আমাদের প্রতিষ্ঠানকে এক বিশাল প্রতিযোগিতামূলক সুবিধা এনে দিয়েছিল।",
        "targetWord": "astute",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "An astute investor evaluates both financial data and executive integrity.",
        "bn": "একজন বিচক্ষণ বিনিয়োগকারী আর্থিক তথ্য এবং ব্যবস্থাপনা সততা উভয়ই বিবেচনা করেন।",
        "targetWord": "astute",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Developing astute judgment requires constant reading and critical thinking.",
        "bn": "বিচক্ষণ বিচারবুদ্ধি গড়ে তুলতে নিয়মিত পড়াশোনা এবং যৌক্তিক চিন্তাভাবনা প্রয়োজন।",
        "targetWord": "astute",
        "approxDuration": 4.5
      }
    ]
  },
  "pro-4": {
    "theme": "garden",
    "duration": 18,
    "targetWord": "unprecedented",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "The startup achieved unprecedented growth, expanding to ten nations in one year.",
        "bn": "স্টার্টআপটি এক বছরে দশটি দেশে কার্যক্রম বাড়িয়ে এক অভূতপূর্ব প্রবৃদ্ধি অর্জন করেছে।",
        "targetWord": "unprecedented",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Such unprecedented momentum in the tech sector is truly historic.",
        "bn": "প্রযুক্তি খাতে এমন নজিরবিহীন অগ্রগতি সত্যিই ঐতিহাসিক।",
        "targetWord": "unprecedented",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Global challenges often demand unprecedented cooperation among leaders.",
        "bn": "বৈশ্বিক সংকটগুলোর সমাধানে প্রায়শই বিশ্বনেতাদের মধ্যে নজিরবিহীন সহযোগিতার প্রয়োজন হয়।",
        "targetWord": "unprecedented",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Let us prepare thoroughly so we are ready for unprecedented opportunities.",
        "bn": "চল আমরা এমনভাবে প্রস্তুতি নিই যাতে যেকোনো নজিরবিহীন সুযোগের জন্য প্রস্তুত থাকতে পারি।",
        "targetWord": "unprecedented",
        "approxDuration": 4.5
      }
    ]
  },
  "unprecedented": {
    "theme": "garden",
    "duration": 18,
    "targetWord": "unprecedented",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "The startup achieved unprecedented growth, expanding to ten nations in one year.",
        "bn": "স্টার্টআপটি এক বছরে দশটি দেশে কার্যক্রম বাড়িয়ে এক অভূতপূর্ব প্রবৃদ্ধি অর্জন করেছে।",
        "targetWord": "unprecedented",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Such unprecedented momentum in the tech sector is truly historic.",
        "bn": "প্রযুক্তি খাতে এমন নজিরবিহীন অগ্রগতি সত্যিই ঐতিহাসিক।",
        "targetWord": "unprecedented",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Global challenges often demand unprecedented cooperation among leaders.",
        "bn": "বৈশ্বিক সংকটগুলোর সমাধানে প্রায়শই বিশ্বনেতাদের মধ্যে নজিরবিহীন সহযোগিতার প্রয়োজন হয়।",
        "targetWord": "unprecedented",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Let us prepare thoroughly so we are ready for unprecedented opportunities.",
        "bn": "চল আমরা এমনভাবে প্রস্তুতি নিই যাতে যেকোনো নজিরবিহীন সুযোগের জন্য প্রস্তুত থাকতে পারি।",
        "targetWord": "unprecedented",
        "approxDuration": 4.5
      }
    ]
  },
  "pro-5": {
    "theme": "study",
    "duration": 18,
    "targetWord": "consensus",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "After three rounds of constructive debate, the committee reached a clear consensus.",
        "bn": "তিন দফা গঠনমূলক আলোচনার পর কমিটি একটি স্পষ্ট ঐকমত্যে পৌঁছেছে।",
        "targetWord": "consensus",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Building consensus among stakeholders ensures that everyone is committed.",
        "bn": "অংশীদারদের মধ্যে সর্বসম্মত মত তৈরি করলে সবার আন্তরিক প্রতিশ্রুতি নিশ্চিত হয়।",
        "targetWord": "consensus",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Without consensus, executing a major organizational transformation is impossible.",
        "bn": "ঐকমত্য ছাড়া বড় কোনো সাংগঠনিক রূপান্তর বাস্তবায়ন করা অসম্ভব।",
        "targetWord": "consensus",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Respectful dialogue is always the foundation for sustainable consensus.",
        "bn": "শ্রদ্ধাশীল আলোচনাই সবসময় একটি দীর্ঘস্থায়ী ঐকমত্যের মূল ভিত্তি।",
        "targetWord": "consensus",
        "approxDuration": 4.5
      }
    ]
  },
  "consensus": {
    "theme": "study",
    "duration": 18,
    "targetWord": "consensus",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "After three rounds of constructive debate, the committee reached a clear consensus.",
        "bn": "তিন দফা গঠনমূলক আলোচনার পর কমিটি একটি স্পষ্ট ঐকমত্যে পৌঁছেছে।",
        "targetWord": "consensus",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Building consensus among stakeholders ensures that everyone is committed.",
        "bn": "অংশীদারদের মধ্যে সর্বসম্মত মত তৈরি করলে সবার আন্তরিক প্রতিশ্রুতি নিশ্চিত হয়।",
        "targetWord": "consensus",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Without consensus, executing a major organizational transformation is impossible.",
        "bn": "ঐকমত্য ছাড়া বড় কোনো সাংগঠনিক রূপান্তর বাস্তবায়ন করা অসম্ভব।",
        "targetWord": "consensus",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Respectful dialogue is always the foundation for sustainable consensus.",
        "bn": "শ্রদ্ধাশীল আলোচনাই সবসময় একটি দীর্ঘস্থায়ী ঐকমত্যের মূল ভিত্তি।",
        "targetWord": "consensus",
        "approxDuration": 4.5
      }
    ]
  },
  "pro-6": {
    "theme": "library",
    "duration": 18,
    "targetWord": "exemplify",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Dr. Yunus's social business models exemplify sustainable poverty alleviation.",
        "bn": "ড. ইউনূসের সামাজিক ব্যবসার মডেলগুলো টেকসই দারিদ্র্য বিমোচনের আদর্শ দৃষ্টান্ত স্থাপন করে।",
        "targetWord": "exemplify",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "His dedication and ethics exemplify the highest ideals of global leadership.",
        "bn": "তার নিষ্ঠা এবং সততা বিশ্ব নেতৃত্বের সর্বোচ্চ আদর্শের এক অনন্য উদাহরণ।",
        "targetWord": "exemplify",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "We should design case studies that exemplify best corporate practices.",
        "bn": "আমাদের এমন কেস স্টাডি প্রস্তুত করা উচিত যা সেরা করপোরেট রীতির উদাহরণ দেয়।",
        "targetWord": "exemplify",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Living with integrity is the best way to exemplify our core values to others.",
        "bn": "সততার সাথে জীবনযাপন করাই অন্যদের কাছে নিজের মূল নীতিগুলোর দৃষ্টান্ত স্থাপনের সেরা উপায়।",
        "targetWord": "exemplify",
        "approxDuration": 4.5
      }
    ]
  },
  "exemplify": {
    "theme": "library",
    "duration": 18,
    "targetWord": "exemplify",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Dr. Yunus's social business models exemplify sustainable poverty alleviation.",
        "bn": "ড. ইউনূসের সামাজিক ব্যবসার মডেলগুলো টেকসই দারিদ্র্য বিমোচনের আদর্শ দৃষ্টান্ত স্থাপন করে।",
        "targetWord": "exemplify",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "His dedication and ethics exemplify the highest ideals of global leadership.",
        "bn": "তার নিষ্ঠা এবং সততা বিশ্ব নেতৃত্বের সর্বোচ্চ আদর্শের এক অনন্য উদাহরণ।",
        "targetWord": "exemplify",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "We should design case studies that exemplify best corporate practices.",
        "bn": "আমাদের এমন কেস স্টাডি প্রস্তুত করা উচিত যা সেরা করপোরেট রীতির উদাহরণ দেয়।",
        "targetWord": "exemplify",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Living with integrity is the best way to exemplify our core values to others.",
        "bn": "সততার সাথে জীবনযাপন করাই অন্যদের কাছে নিজের মূল নীতিগুলোর দৃষ্টান্ত স্থাপনের সেরা উপায়।",
        "targetWord": "exemplify",
        "approxDuration": 4.5
      }
    ]
  },
  "pro-7": {
    "theme": "cafe",
    "duration": 18,
    "targetWord": "synergy",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "The merger of the two research labs created remarkable scientific synergy.",
        "bn": "দুটি গবেষণাগারের একত্রীকরণ এক অভাবনীয় বৈজ্ঞানিক সম্মিলিত শক্তি ও সমন্বয় সৃষ্টি করেছে।",
        "targetWord": "synergy",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "When marketing and engineering collaborate, their synergy yields breakthrough products.",
        "bn": "মার্কেটিং এবং ইঞ্জিনিয়ারিং একসাথে কাজ করলে তাদের সমন্বয় যুগান্তকারী পণ্য তৈরি করে।",
        "targetWord": "synergy",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "True synergy means the whole outcome is vastly greater than the sum of its parts.",
        "bn": "প্রকৃত সমন্বয়ের অর্থ হলো সামগ্রিক ফলাফল প্রতিটি পৃথক অংশের যোগফলের চেয়েও অনেক বড়।",
        "targetWord": "synergy",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Let us cultivate synergy across our study groups to amplify our achievements.",
        "bn": "আমাদের সাফল্যকে বহুগুণ বাড়িয়ে তুলতে চল পড়ার গ্রুপগুলোতে সমন্বিত শক্তি গড়ে তুলি।",
        "targetWord": "synergy",
        "approxDuration": 4.5
      }
    ]
  },
  "synergy": {
    "theme": "cafe",
    "duration": 18,
    "targetWord": "synergy",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "The merger of the two research labs created remarkable scientific synergy.",
        "bn": "দুটি গবেষণাগারের একত্রীকরণ এক অভাবনীয় বৈজ্ঞানিক সম্মিলিত শক্তি ও সমন্বয় সৃষ্টি করেছে।",
        "targetWord": "synergy",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "When marketing and engineering collaborate, their synergy yields breakthrough products.",
        "bn": "মার্কেটিং এবং ইঞ্জিনিয়ারিং একসাথে কাজ করলে তাদের সমন্বয় যুগান্তকারী পণ্য তৈরি করে।",
        "targetWord": "synergy",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "True synergy means the whole outcome is vastly greater than the sum of its parts.",
        "bn": "প্রকৃত সমন্বয়ের অর্থ হলো সামগ্রিক ফলাফল প্রতিটি পৃথক অংশের যোগফলের চেয়েও অনেক বড়।",
        "targetWord": "synergy",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Let us cultivate synergy across our study groups to amplify our achievements.",
        "bn": "আমাদের সাফল্যকে বহুগুণ বাড়িয়ে তুলতে চল পড়ার গ্রুপগুলোতে সমন্বিত শক্তি গড়ে তুলি।",
        "targetWord": "synergy",
        "approxDuration": 4.5
      }
    ]
  },
  "pro-8": {
    "theme": "study",
    "duration": 18,
    "targetWord": "benchmark",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "This institution sets the global benchmark for excellence in language education.",
        "bn": "এই প্রতিষ্ঠানটি ভাষা শিক্ষার ক্ষেত্রে বৈশ্বিক উৎকর্ষের মাপকাঠি নির্ধারণ করে দিয়েছে।",
        "targetWord": "benchmark",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "We can use their comprehensive curriculum as a benchmark for our own learning goals.",
        "bn": "তাদের সমৃদ্ধ পাঠ্যক্রমকে আমরা আমাদের নিজস্ব লক্ষ্যগুলোর একটি মানদণ্ড হিসেবে ব্যবহার করতে পারি।",
        "targetWord": "benchmark",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Regular assessments help students benchmark their progress against international standards.",
        "bn": "নিয়মিত মূল্যায়ন শিক্ষার্থীদের আন্তর্জাতিক মানের সাথে নিজেদের অগ্রগতির তুলনা করতে সাহায্য করে।",
        "targetWord": "benchmark",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Setting a high personal benchmark motivates us to strive for mastery every single day.",
        "bn": "উচ্চ ব্যক্তিগত মানদণ্ড নির্ধারণ আমাদের প্রতিদিন দক্ষতা অর্জনে অনুপ্রাণিত করে।",
        "targetWord": "benchmark",
        "approxDuration": 4.5
      }
    ]
  },
  "benchmark": {
    "theme": "study",
    "duration": 18,
    "targetWord": "benchmark",
    "lines": [
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "This institution sets the global benchmark for excellence in language education.",
        "bn": "এই প্রতিষ্ঠানটি ভাষা শিক্ষার ক্ষেত্রে বৈশ্বিক উৎকর্ষের মাপকাঠি নির্ধারণ করে দিয়েছে।",
        "targetWord": "benchmark",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "We can use their comprehensive curriculum as a benchmark for our own learning goals.",
        "bn": "তাদের সমৃদ্ধ পাঠ্যক্রমকে আমরা আমাদের নিজস্ব লক্ষ্যগুলোর একটি মানদণ্ড হিসেবে ব্যবহার করতে পারি।",
        "targetWord": "benchmark",
        "approxDuration": 4.5
      },
      {
        "speaker": "Maya",
        "avatar": "maya",
        "en": "Regular assessments help students benchmark their progress against international standards.",
        "bn": "নিয়মিত মূল্যায়ন শিক্ষার্থীদের আন্তর্জাতিক মানের সাথে নিজেদের অগ্রগতির তুলনা করতে সাহায্য করে।",
        "targetWord": "benchmark",
        "approxDuration": 4.5
      },
      {
        "speaker": "Leo",
        "avatar": "leo",
        "en": "Setting a high personal benchmark motivates us to strive for mastery every single day.",
        "bn": "উচ্চ ব্যক্তিগত মানদণ্ড নির্ধারণ আমাদের প্রতিদিন দক্ষতা অর্জনে অনুপ্রাণিত করে।",
        "targetWord": "benchmark",
        "approxDuration": 4.5
      }
    ]
  }
};

if (typeof window !== 'undefined') {
  window.LEVEL_META = LEVEL_META;
  window.ASSESSMENT_OPTIONS = ASSESSMENT_OPTIONS;
  window.CURRICULUM_DATA = CURRICULUM_DATA;
  window.WORD_CARTOON_CONVERSATIONS = WORD_CARTOON_CONVERSATIONS;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LEVEL_META,
    ASSESSMENT_OPTIONS,
    CURRICULUM_DATA,
    WORD_CARTOON_CONVERSATIONS
  };
}
