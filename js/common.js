/* =====================================================================
   VOCABULARY WORLD — SHARED CORE SYSTEM (js/common.js)
   - State & LocalStorage Management
   - Hybrid English TTS Pronunciation Engine
   - Safe Text Registry & SVG Helpers
   - Shared Navigation Bar & Footer
====================================================================== */

/* =====================================================================
   DARK / LIGHT THEME ZERO-FLASH INITIALIZER
====================================================================== */
(function () {
  if (typeof window === 'undefined' || !document.documentElement) return;
  try {
    const theme = localStorage.getItem('vw_theme');
    if (theme === 'dark' || (!theme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  } catch (e) {}
})();

/* =====================================================================
   0. LEVEL SELECTION ROUTE PROTECTION & SESSION GATEWAY
====================================================================== */
const LEVEL_CHOSEN_STORAGE_KEY = 'vw_level_chosen';

function isLevelChosen() {
  try {
    return sessionStorage.getItem(LEVEL_CHOSEN_STORAGE_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

function enforceLevelSelectionRoute() {
  if (typeof window === 'undefined') return;
  const path = (window.location.pathname || '').toLowerCase();
  const file = path.split('/').pop().split('\\').pop() || '';
  const isIndex = file === '' || file === 'index.html';

  if (!isLevelChosen() && !isIndex) {
    window.location.replace('index.html');
  }
}

// Enforce route protection immediately on script evaluation
enforceLevelSelectionRoute();

/* =====================================================================
   1. SAFE TEXT REGISTRY & SVG HELPERS
====================================================================== */
const SpeakTextRegistry = [];

function registerSpeakText(text) {
  const clean = String(text || '').trim();
  const existingIndex = SpeakTextRegistry.indexOf(clean);
  if (existingIndex !== -1) return existingIndex;
  SpeakTextRegistry.push(clean);
  return SpeakTextRegistry.length - 1;
}

function speakById(id, btnEl, accentId) {
  const text = SpeakTextRegistry[id];
  if (text) {
    const langCode = accentId ? ((typeof ACCENT_CONFIG !== 'undefined' && ACCENT_CONFIG[accentId] && ACCENT_CONFIG[accentId].code) || accentId) : null;
    speakEnglish(text, btnEl, langCode);
  }
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function speakerIconSvg(sizeClass = 'w-4 h-4') {
  return `
    <svg class="${sizeClass}" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 3.5a.75.75 0 00-1.28-.53l-3.97 3.97H2.75A1.75 1.75 0 001 8.69v2.62c0 .966.784 1.75 1.75 1.75h2l3.97 3.97a.75.75 0 001.28-.53V3.5zM14.28 6.22a.75.75 0 011.06 0 5.5 5.5 0 010 7.56.75.75 0 11-1.06-1.06 4 4 0 000-5.44.75.75 0 010-1.06z"/>
      <path d="M16.5 4a.75.75 0 011.06 0 8.5 8.5 0 010 12a.75.75 0 01-1.06-1.06 7 7 0 000-9.88.75.75 0 010-1.06z"/>
    </svg>
  `;
}

function soundWaveSvg() {
  return `
    <div class="vw-wave-bars" aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
}

/* =====================================================================
   COUNTRY & MULTI-ACCENT CONFIGURATION & SPEECH SYNCHRONIZATION
====================================================================== */
const ACCENT_CONFIG = {
  UK: { id: 'UK', code: 'en-GB', name: 'British Accent', shortLabel: 'UK', flag: '🇬🇧', countryId: 'UK' },
  US: { id: 'US', code: 'en-US', name: 'American Accent', shortLabel: 'US', flag: '🇺🇸', countryId: 'US' },
  AU: { id: 'AU', code: 'en-AU', name: 'Australian Accent', shortLabel: 'AU', flag: '🇦🇺', countryId: 'AU' },
  CA: { id: 'CA', code: 'en-CA', name: 'Canadian Accent', shortLabel: 'CA', flag: '🇨🇦', countryId: 'CA' }
};

const COUNTRY_CONFIG = {
  UK: { id: 'UK', name: 'United Kingdom', flag: '🇬🇧', lang: 'en-GB', accentId: 'UK', accentLabel: 'British (en-GB)' },
  US: { id: 'US', name: 'United States', flag: '🇺🇸', lang: 'en-US', accentId: 'US', accentLabel: 'American (en-US)' },
  AU: { id: 'AU', name: 'Australia', flag: '🇦🇺', lang: 'en-AU', accentId: 'AU', accentLabel: 'Australian (en-AU)' },
  CA: { id: 'CA', name: 'Canada', flag: '🇨🇦', lang: 'en-CA', accentId: 'CA', accentLabel: 'Canadian (en-CA)' },
  BD: { id: 'BD', name: 'Bangladesh', flag: '🇧🇩', lang: 'en-GB', accentId: 'UK', accentLabel: 'Bangla Support (UK/US)' }
};

function getSelectedCountry() {
  let saved = null;
  try {
    saved = localStorage.getItem('vw_country');
  } catch (e) {}
  return (saved && COUNTRY_CONFIG[saved]) || COUNTRY_CONFIG.US;
}

function getActiveAccent() {
  let savedAccent = null;
  try {
    savedAccent = localStorage.getItem('vw_accent');
  } catch (e) {}
  if (savedAccent && ACCENT_CONFIG[savedAccent]) {
    return ACCENT_CONFIG[savedAccent];
  }
  const country = getSelectedCountry();
  if (country && country.accentId && ACCENT_CONFIG[country.accentId]) {
    return ACCENT_CONFIG[country.accentId];
  }
  return ACCENT_CONFIG.US;
}

function setActiveAccent(accentId, skipRender = false) {
  if (!ACCENT_CONFIG[accentId]) return;
  try {
    localStorage.setItem('vw_accent', accentId);
  } catch (e) {}

  // Update country if appropriate
  const country = getSelectedCountry();
  if (country && country.id !== 'BD' && country.accentId !== accentId) {
    if (COUNTRY_CONFIG[accentId]) {
      try {
        localStorage.setItem('vw_country', accentId);
      } catch (e) {}
    }
  }

  // Update navbar badge if rendered
  const badge = document.getElementById('vw-navbar-accent-badge');
  if (badge) badge.textContent = accentId;

  // Update all card pills if rendered
  document.querySelectorAll('.vw-accent-card-pill').forEach((btn) => {
    if (btn.dataset.accent === accentId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update active cartoon player if open
  if (typeof CartoonPlayer !== 'undefined' && CartoonPlayer.isOpen) {
    CartoonPlayer.setAccent(accentId);
  }

  if (!skipRender) {
    const activePage = window.location.pathname.split('/').pop().replace('.html', '') || 'home';
    if (typeof renderAppHeader === 'function') renderAppHeader(activePage);
  }

  if (typeof showToast === 'function') {
    const acc = ACCENT_CONFIG[accentId];
    showToast(`উচ্চারণ অ্যাকসেন্ট: ${acc.name} (${acc.shortLabel})`);
  }
}
window.getActiveAccent = getActiveAccent;
window.setActiveAccent = setActiveAccent;
window.ACCENT_CONFIG = ACCENT_CONFIG;
window.COUNTRY_CONFIG = COUNTRY_CONFIG;

/* =====================================================================
   2. HYBRID ENGLISH PRONUNCIATION AUDIO SYSTEM
   - Tier 1: HTML5 SpeechSynthesis (Multi-Accent & Gender-Aware)
   - Tier 2: Free Dictionary API Studio MP3 Fallback (UK vs US Dialect)
   - Tier 3: High-Quality Google TTS Accent Fallback
====================================================================== */
const PronunciationEngine = {
  activeBtn: null,
  activeAudio: null,
  fallbackTimer: null,
  toastTimer: null,
  voices: [],

  init() {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        this.voices = window.speechSynthesis.getVoices() || [];
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  },

  getSelectedCountry() {
    return getSelectedCountry();
  },

  getVoiceForAccent(langCode, genderPreference = 'female') {
    if (!this.voices.length && 'speechSynthesis' in window) {
      this.voices = window.speechSynthesis.getVoices() || [];
    }
    if (!this.voices.length) return null;

    const desiredLang = (langCode || 'en-US').toLowerCase().replace('_', '-');
    const baseLang = desiredLang.split('-')[0];

    // 1. Dialect voices matching exact code (e.g., en-gb or en-us)
    let dialectVoices = this.voices.filter((v) => {
      const vLang = (v.lang || '').toLowerCase().replace('_', '-');
      return vLang === desiredLang || vLang.startsWith(desiredLang);
    });

    // 2. Fallback to any voice with the base language (e.g. en)
    if (!dialectVoices.length) {
      dialectVoices = this.voices.filter((v) => {
        const vLang = (v.lang || '').toLowerCase().replace('_', '-');
        return vLang.startsWith(baseLang);
      });
    }

    if (!dialectVoices.length) return this.voices[0] || null;

    const isFemale = genderPreference === 'female';
    const femaleKw = ['female', 'zira', 'samantha', 'aria', 'jenny', 'sonia', 'karen', 'hazel', 'victoria', 'catherine', 'alice', 'susan'];
    const maleKw = ['david', 'george', 'alex', 'guy', 'oliver', 'daniel', 'richard', 'james', 'brian', 'lee'];

    if (isFemale) {
      const fMatch = dialectVoices.find((v) => {
        const name = (v.name || '').toLowerCase();
        return femaleKw.some((kw) => name.includes(kw));
      });
      if (fMatch) return fMatch;
    } else {
      // Safe male check: Must NOT contain "female", and must contain "male" or known male name
      const mMatch = dialectVoices.find((v) => {
        const name = (v.name || '').toLowerCase();
        if (name.includes('female')) return false;
        return name.includes('male') || maleKw.some((kw) => name.includes(kw));
      });
      if (mMatch) return mMatch;
    }

    // Secondary fallback: if requested gender voice is not distinct, use first dialect voice
    return dialectVoices[0];
  },

  pickEnglishVoice(targetLang, gender = 'female') {
    const activeAccent = (typeof getActiveAccent === 'function') ? getActiveAccent() : { code: 'en-US' };
    const lang = targetLang || activeAccent.code || 'en-US';
    return this.getVoiceForAccent(lang, gender);
  },

  resetButton(btn) {
    if (!btn) return;
    btn.classList.remove('is-speaking');
    if (btn.dataset.origHtml) {
      btn.innerHTML = btn.dataset.origHtml;
    }
  },

  stopAll() {
    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
    }
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.src = '';
      } catch (e) {}
      this.activeAudio = null;
    }
    if (this.activeBtn) {
      this.resetButton(this.activeBtn);
      this.activeBtn = null;
    }
  },

  activateButton(btnEl, showTextLabel) {
    if (!btnEl) return;
    if (!btnEl.dataset.origHtml) {
      btnEl.dataset.origHtml = btnEl.innerHTML;
    }
    this.activeBtn = btnEl;
    btnEl.classList.add('is-speaking');
    btnEl.innerHTML = showTextLabel
      ? `${soundWaveSvg()} <span>Playing...</span>`
      : soundWaveSvg();
  },

  async playFallbackAudio(text, btnEl, targetLang) {
    const activeAccent = (typeof getActiveAccent === 'function') ? getActiveAccent() : { id: 'US', code: 'en-US' };
    const langCode = targetLang || activeAccent.code || 'en-US';
    const isSingleWord = !text.includes(' ');
    if (isSingleWord) {
      try {
        const cleanWord = text.toLowerCase().replace(/[^a-z-]/g, '');
        if (cleanWord) {
          const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`);
          if (res.ok) {
            const data = await res.json();
            const phonetics = (data && data[0] && data[0].phonetics) || [];
            
            // Prefer dialect-specific studio audio (e.g. -uk.mp3 vs -us.mp3)
            const targetSuffix = langCode.toLowerCase().includes('gb') ? '-uk.mp3' : '-us.mp3';
            let audioEntry = phonetics.find((p) => p.audio && p.audio.toLowerCase().includes(targetSuffix));
            if (!audioEntry) {
              audioEntry = phonetics.find((p) => p.audio && p.audio.length > 0);
            }

            if (audioEntry && this.activeBtn === btnEl) {
              const dictAudio = new Audio(audioEntry.audio);
              this.activeAudio = dictAudio;
              dictAudio.onended = () => {
                if (this.activeBtn === btnEl) this.stopAll();
              };
              dictAudio.onerror = () => {
                if (this.activeBtn === btnEl) this.playGoogleTts(text, btnEl, langCode);
              };
              await dictAudio.play();
              return;
            }
          }
        }
      } catch (err) {}
    }

    if (this.activeBtn === btnEl) {
      this.playGoogleTts(text, btnEl, langCode);
    }
  },

  playGoogleTts(text, btnEl, targetLang) {
    const activeAccent = (typeof getActiveAccent === 'function') ? getActiveAccent() : { code: 'en-US' };
    const tl = (targetLang || activeAccent.code || 'en-US').toLowerCase();
    const encoded = encodeURIComponent(text.slice(0, 220));
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(tl)}&q=${encoded}`;
    const audio = new Audio(url);
    this.activeAudio = audio;

    audio.onended = () => {
      if (this.activeBtn === btnEl) this.stopAll();
    };

    audio.onerror = () => {
      if (this.activeBtn === btnEl) {
        this.stopAll();
        showToast('দুঃখিত, এই মুহূর্তে উচ্চারণ অডিও চালু করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করুন।');
      }
    };

    audio.play().catch(() => {
      if (this.activeBtn === btnEl) {
        this.stopAll();
      }
    });
  }
};
window.PronunciationEngine = PronunciationEngine;

function speakEnglish(text, btnEl, targetLangCode) {
  const cleanText = String(text || '').trim();
  if (!cleanText) return;

  if (btnEl && PronunciationEngine.activeBtn === btnEl) {
    PronunciationEngine.stopAll();
    return;
  }

  PronunciationEngine.stopAll();
  const hasLabel = btnEl && btnEl.textContent && btnEl.textContent.trim().length > 0;
  PronunciationEngine.activateButton(btnEl, hasLabel);

  const activeAccent = (typeof getActiveAccent === 'function') ? getActiveAccent() : { code: 'en-US' };
  const langCode = targetLangCode || activeAccent.code || 'en-US';
  const isSentence = cleanText.split(/\s+/).length > 2;
  let started = false;

  if ('speechSynthesis' in window) {
    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      const voice = PronunciationEngine.getVoiceForAccent(langCode, 'female');
      if (voice) utterance.voice = voice;
      utterance.lang = langCode;
      utterance.rate = isSentence ? 0.92 : 0.95;

      utterance.onstart = () => {
        started = true;
        if (PronunciationEngine.fallbackTimer) {
          clearTimeout(PronunciationEngine.fallbackTimer);
          PronunciationEngine.fallbackTimer = null;
        }
      };

      utterance.onend = () => {
        if (PronunciationEngine.activeBtn === btnEl) {
          PronunciationEngine.stopAll();
        }
      };

      utterance.onerror = () => {
        if (!started && PronunciationEngine.activeBtn === btnEl) {
          PronunciationEngine.playFallbackAudio(cleanText, btnEl, langCode);
        }
      };

      window.speechSynthesis.speak(utterance);

      PronunciationEngine.fallbackTimer = setTimeout(() => {
        if (!started && PronunciationEngine.activeBtn === btnEl) {
          try {
            window.speechSynthesis.cancel();
          } catch (e) {}
          PronunciationEngine.playFallbackAudio(cleanText, btnEl, langCode);
        }
      }, 650);
      return;
    } catch (err) {}
  }

  PronunciationEngine.playFallbackAudio(cleanText, btnEl, langCode);
}

// Global alias for speakEnglish
window.speakWord = speakEnglish;

function speakWordWithAccent(textOrId, accentId, btnEl) {
  const targetAcc = ACCENT_CONFIG[accentId] || ACCENT_CONFIG.US;
  let text = '';
  if (typeof textOrId === 'number') {
    text = SpeakTextRegistry[textOrId] || '';
  } else {
    text = String(textOrId || '');
  }
  if (!text) return;

  // Visual active feedback for the clicked accent button
  if (btnEl && btnEl.parentElement) {
    btnEl.parentElement.querySelectorAll('.vw-accent-card-pill').forEach((p) => p.classList.remove('active'));
    btnEl.classList.add('active');
  }

  speakEnglish(text, btnEl, targetAcc.code);
}
window.speakWordWithAccent = speakWordWithAccent;

function renderCardAccentSwitcherHTML(wordSpeakId, wordId) {
  const activeAcc = (typeof getActiveAccent === 'function') ? getActiveAccent() : { id: 'US' };
  const currentAccentId = activeAcc.id;
  const targetId = typeof wordSpeakId === 'number' ? wordSpeakId : registerSpeakText(wordSpeakId);
  return `
    <div class="vw-card-accent-group inline-flex items-center rounded-full p-0.5 border shrink-0" style="background-color: var(--surface-sand); border-color: var(--border-subtle);" title="Compare UK vs US pronunciation &bull; উচ্চারণ তুলনা">
      <button
        type="button"
        data-accent="UK"
        onclick="event.stopPropagation(); ${wordId ? `if(typeof trackWordExplored==='function')trackWordExplored('${wordId}');` : ''} speakWordWithAccent(${targetId}, 'UK', this)"
        class="vw-accent-card-pill ${currentAccentId === 'UK' ? 'active' : ''} px-2 py-0.5 rounded-full text-[10px] font-bold transition-all"
        title="British Pronunciation (UK) &bull; ব্রিটিশ উচ্চারণ"
      >
        UK
      </button>
      <button
        type="button"
        data-accent="US"
        onclick="event.stopPropagation(); ${wordId ? `if(typeof trackWordExplored==='function')trackWordExplored('${wordId}');` : ''} speakWordWithAccent(${targetId}, 'US', this)"
        class="vw-accent-card-pill ${currentAccentId === 'US' ? 'active' : ''} px-2 py-0.5 rounded-full text-[10px] font-bold transition-all"
        title="American Pronunciation (US) &bull; আমেরিকান উচ্চারণ"
      >
        US
      </button>
    </div>
  `;
}
window.renderCardAccentSwitcherHTML = renderCardAccentSwitcherHTML;

function showToast(msg) {
  const toast = document.getElementById('vw-toast');
  const textEl = document.getElementById('vw-toast-text');
  if (!toast || !textEl) return;
  textEl.textContent = msg;
  toast.classList.remove('hidden');
  toast.classList.add('flex');
  if (PronunciationEngine.toastTimer) clearTimeout(PronunciationEngine.toastTimer);
  PronunciationEngine.toastTimer = setTimeout(hideToast, 4000);
}

function hideToast() {
  const toast = document.getElementById('vw-toast');
  if (!toast) return;
  toast.classList.add('hidden');
  toast.classList.remove('flex');
}

/* =====================================================================
   3. APPLICATION STATE & LOCALSTORAGE PERSISTENCE
====================================================================== */
const STORAGE_KEYS = {
  SETUP: 'vw_user_setup_v1',
  TRACKER: 'vw_daily_tracker_v1',
  WORD_IMAGES: 'vw_word_images_v1',
  CUSTOM_WORDS: 'vw_custom_words_v1'
};

/* ---------------------------------------------------------------------
   CUSTOM WORDS PERSISTENCE & CURRICULUM SYNC
---------------------------------------------------------------------- */
function getCustomWords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_WORDS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        let updated = false;
        parsed.forEach((w) => {
          if (w && typeof w === 'object') {
            if (!w.conversation || !Array.isArray(w.conversation) || !w.sceneTheme || !w.cartoonConversation) {
              if (typeof generateCartoonConversation === 'function') {
                const convData = generateCartoonConversation(w);
                w.sceneTheme = convData.sceneTheme || convData.theme;
                w.conversation = convData.lines;
                w.cartoonConversation = convData;
                updated = true;
              }
            }
          }
        });
        if (updated) {
          try {
            localStorage.setItem(STORAGE_KEYS.CUSTOM_WORDS, JSON.stringify(parsed));
          } catch (e) {}
        }
        return parsed;
      }
    }
  } catch (e) {}
  return [];
}

function saveCustomWords(wordsArray) {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_WORDS, JSON.stringify(wordsArray || []));
  } catch (e) {}
  syncCustomWordsIntoCurriculum();
}

function syncCustomWordsIntoCurriculum() {
  if (typeof CURRICULUM_DATA === 'undefined') return;
  const customWords = getCustomWords();

  // 1. Remove previously synced custom words from curriculum levels to prevent duplicates
  Object.keys(CURRICULUM_DATA).forEach((lvlKey) => {
    const lvl = CURRICULUM_DATA[lvlKey];
    if (lvl && Array.isArray(lvl.words)) {
      lvl.words = lvl.words.filter((w) => !w.isCustom);
    }
  });

  // 2. Inject current custom words into their assigned curriculum levels
  customWords.forEach((wordObj) => {
    if (!wordObj.conversation || !wordObj.sceneTheme || !wordObj.cartoonConversation) {
      if (typeof generateCartoonConversation === 'function') {
        const convData = generateCartoonConversation(wordObj);
        wordObj.sceneTheme = convData.sceneTheme || convData.theme;
        wordObj.conversation = convData.lines;
        wordObj.cartoonConversation = convData;
      }
    }
    const targetLvl = (wordObj.level && CURRICULUM_DATA[wordObj.level]) ? wordObj.level : 'beginner';
    if (CURRICULUM_DATA[targetLvl] && Array.isArray(CURRICULUM_DATA[targetLvl].words)) {
      CURRICULUM_DATA[targetLvl].words.push(wordObj);
    }
  });
}

function formatWordEntry(rawWord, targetLevel = 'beginner') {
  const cleanWord = String((rawWord && rawWord.word) || '').trim();
  if (!cleanWord) return null;

  // Format capitalized word
  const formattedWord = cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
  const wordId = rawWord.id || `cw-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const level = (rawWord.level && ['beginner', 'intermediate', 'advanced', 'pro'].includes(String(rawWord.level).toLowerCase()))
    ? String(rawWord.level).toLowerCase()
    : targetLevel;

  const entry = {
    id: wordId,
    word: formattedWord,
    level: level,
    pos: String(rawWord.pos || 'Word').trim(),
    ipa: String(rawWord.ipa || '').trim(),
    meaningBn: String(rawWord.meaningBn || rawWord.meaning || 'অর্থ যোগ করা হয়নি').trim(),
    explanationEn: String(rawWord.explanationEn || `Definition and contextual usage of "${formattedWord}".`).trim(),
    example: String(rawWord.example || `The student practiced using "${formattedWord}" in sentences.`).trim(),
    exampleBn: String(rawWord.exampleBn || `শিক্ষার্থীটি বাক্যে "${formattedWord}" শব্দটি ব্যবহারের অনুশীলন করেছে।`).trim(),
    imageQuery: String(rawWord.imageQuery || formattedWord).trim(),
    synonyms: Array.isArray(rawWord.synonyms) ? rawWord.synonyms : [],
    antonyms: Array.isArray(rawWord.antonyms) ? rawWord.antonyms : [],
    isCustom: true,
    addedAt: rawWord.addedAt || new Date().toISOString()
  };

  // Attach cartoon conversation and sceneTheme across all pathways
  if (rawWord.cartoonConversation && Array.isArray(rawWord.cartoonConversation.lines) && rawWord.cartoonConversation.lines.length >= 4) {
    entry.cartoonConversation = rawWord.cartoonConversation;
    entry.sceneTheme = rawWord.cartoonConversation.sceneTheme || rawWord.cartoonConversation.theme || rawWord.sceneTheme || 'cafe';
    entry.conversation = rawWord.cartoonConversation.lines;
  } else if (Array.isArray(rawWord.conversation) && rawWord.conversation.length >= 4) {
    const theme = rawWord.sceneTheme || rawWord.theme || 'cafe';
    entry.sceneTheme = theme;
    entry.conversation = rawWord.conversation;
    entry.cartoonConversation = {
      theme: theme,
      sceneTheme: theme,
      duration: 18,
      targetWord: formattedWord.toLowerCase(),
      lines: rawWord.conversation,
      conversation: rawWord.conversation
    };
  } else {
    const convData = generateCartoonConversation(entry);
    entry.sceneTheme = convData.sceneTheme;
    entry.conversation = convData.lines;
    entry.cartoonConversation = convData;
  }

  return entry;
}

function addCustomWord(wordObj) {
  const formatted = formatWordEntry(wordObj);
  if (!formatted) return null;

  const currentCustom = getCustomWords();
  const existingIdx = currentCustom.findIndex((w) => w.word.toLowerCase() === formatted.word.toLowerCase());
  if (existingIdx !== -1) {
    currentCustom[existingIdx] = { ...currentCustom[existingIdx], ...formatted, id: currentCustom[existingIdx].id };
  } else {
    currentCustom.push(formatted);
  }

  saveCustomWords(currentCustom);
  return formatted;
}

function addCustomWordsBulk(wordsArray, defaultLevel = 'beginner') {
  if (!Array.isArray(wordsArray) || wordsArray.length === 0) return 0;
  const currentCustom = getCustomWords();
  let addedCount = 0;

  wordsArray.forEach((raw) => {
    const formatted = formatWordEntry(raw, defaultLevel);
    if (!formatted) return;

    const existingIdx = currentCustom.findIndex((w) => w.word.toLowerCase() === formatted.word.toLowerCase());
    if (existingIdx !== -1) {
      currentCustom[existingIdx] = { ...currentCustom[existingIdx], ...formatted, id: currentCustom[existingIdx].id };
    } else {
      currentCustom.push(formatted);
      addedCount++;
    }
  });

  saveCustomWords(currentCustom);
  return addedCount;
}

function deleteCustomWord(wordId) {
  const currentCustom = getCustomWords();
  const filtered = currentCustom.filter((w) => w.id !== wordId);
  saveCustomWords(filtered);
}

function clearAllCustomWords() {
  saveCustomWords([]);
}

function isWordDuplicate(wordText) {
  if (!wordText || typeof CURRICULUM_DATA === 'undefined') return false;
  const clean = String(wordText).trim().toLowerCase();
  for (const lvlKey of Object.keys(CURRICULUM_DATA)) {
    const lvl = CURRICULUM_DATA[lvlKey];
    if (lvl && Array.isArray(lvl.words)) {
      if (lvl.words.some((w) => w.word.toLowerCase() === clean)) return true;
    }
  }
  return false;
}

function getTodayDateKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDisplayDate() {
  try {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return getTodayDateKey();
  }
}

const AppState = {
  selectedLevel: 'beginner', // 'beginner' | 'intermediate' | 'advanced' | 'pro'
  assessmentIndex: null, // 1 | 2 | 3 | 4
  tracker: {
    dateKey: getTodayDateKey(),
    exploredWordIds: [],
    flashcardsCompleted: 0,
    gameScore: 0,
    quizAnswered: 0
  }
};

function loadPersistedState() {
  try {
    const rawSetup = localStorage.getItem(STORAGE_KEYS.SETUP);
    if (rawSetup) {
      const parsed = JSON.parse(rawSetup);
      if (parsed && parsed.level && (typeof CURRICULUM_DATA === 'undefined' || CURRICULUM_DATA[parsed.level])) {
        AppState.selectedLevel = parsed.level;
      }
      if (parsed && typeof parsed.assessmentIndex === 'number') {
        AppState.assessmentIndex = parsed.assessmentIndex;
      }
    }
  } catch (e) {}

  try {
    const todayKey = getTodayDateKey();
    const rawTracker = localStorage.getItem(STORAGE_KEYS.TRACKER);
    if (rawTracker) {
      const parsedTracker = JSON.parse(rawTracker);
      if (parsedTracker && parsedTracker.dateKey === todayKey) {
        AppState.tracker = {
          dateKey: todayKey,
          exploredWordIds: Array.isArray(parsedTracker.exploredWordIds) ? parsedTracker.exploredWordIds : [],
          flashcardsCompleted: Number(parsedTracker.flashcardsCompleted) || 0,
          gameScore: Number(parsedTracker.gameScore) || 0,
          quizAnswered: Number(parsedTracker.quizAnswered) || 0
        };
      }
    }
  } catch (e) {}

  // Synchronize any stored custom words into CURRICULUM_DATA across all levels
  try {
    syncCustomWordsIntoCurriculum();
  } catch (e) {}
}

function saveSetupToStorage(levelId, assessmentIdx) {
  if (levelId) AppState.selectedLevel = levelId;
  if (assessmentIdx !== undefined && assessmentIdx !== null) AppState.assessmentIndex = assessmentIdx;
  
  let optText = '';
  if (typeof ASSESSMENT_OPTIONS !== 'undefined') {
    const opt = ASSESSMENT_OPTIONS.find((o) => o.id === AppState.assessmentIndex);
    if (opt) optText = opt.text;
  }

  try {
    localStorage.setItem(
      STORAGE_KEYS.SETUP,
      JSON.stringify({
        level: AppState.selectedLevel,
        assessmentIndex: AppState.assessmentIndex,
        assessmentText: optText
      })
    );
  } catch (e) {}
}

function saveTrackerToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.TRACKER, JSON.stringify(AppState.tracker));
  } catch (e) {}
}

function trackWordExplored(wordId) {
  if (!wordId) return;
  if (!AppState.tracker.exploredWordIds.includes(wordId)) {
    AppState.tracker.exploredWordIds.push(wordId);
    saveTrackerToStorage();
    updateTrackerDisplay();
    if (typeof updateLevelProgressBar === 'function') {
      try { updateLevelProgressBar(); } catch (e) {}
    }
  }
}

function awardGamePoints(points, isQuiz = false) {
  AppState.tracker.gameScore += points;
  if (isQuiz) {
    AppState.tracker.quizAnswered += 1;
  }
  saveTrackerToStorage();
  updateTrackerDisplay();
}

function updateTrackerDisplay() {
  const exploredEl = document.getElementById('tracker-words-explored');
  const fcEl = document.getElementById('tracker-flashcards-done');
  const scoreEl = document.getElementById('tracker-game-score');
  const quizEl = document.getElementById('tracker-quiz-answered');

  if (exploredEl) exploredEl.textContent = AppState.tracker.exploredWordIds.length;
  if (fcEl) fcEl.textContent = AppState.tracker.flashcardsCompleted;
  if (scoreEl) scoreEl.textContent = AppState.tracker.gameScore;
  if (quizEl) quizEl.textContent = AppState.tracker.quizAnswered;
}

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getLevelPracticeDeck(levelId) {
  if (typeof CURRICULUM_DATA === 'undefined') return [];
  const lvl = CURRICULUM_DATA[levelId || AppState.selectedLevel || 'beginner'];
  if (!lvl) return [];
  return [...lvl.words, ...(lvl.practiceExtraWords || [])];
}

/* =====================================================================
   4. SHARED EDITORIAL TOP NAVIGATION & FOOTER (LANGEEK-INSPIRED)
====================================================================== */
const TOP_NAV_LEFT_KEY = 'vw_topnav_last_left_v1';
const TOP_NAV_WIDTH_KEY = 'vw_topnav_last_width_v1';
const TOP_NAV_PAGE_KEY = 'vw_topnav_last_page_v1';

function toggleTopLevelPicker() {
  const picker = document.getElementById('top-level-picker');
  if (picker) picker.classList.toggle('hidden');
}

function selectTopLevel(newLevel) {
  const picker = document.getElementById('top-level-picker');
  if (picker) picker.classList.add('hidden');
  try {
    sessionStorage.setItem(LEVEL_CHOSEN_STORAGE_KEY, 'true');
  } catch (e) {}

  if (typeof switchLevel === 'function') {
    switchLevel(newLevel);
    const activeId = window.location.pathname.split('/').pop().replace('.html', '') || 'home';
    renderAppHeader(activeId);
  } else {
    AppState.selectedLevel = newLevel;
    saveSetupToStorage(newLevel, AppState.assessmentIndex);
    window.location.href = `learn.html?level=${encodeURIComponent(newLevel)}`;
  }
}

function toggleMobileNavMenu() {
  const menu = document.getElementById('vw-mobile-nav-menu');
  if (menu) menu.classList.toggle('hidden');
}

/* =====================================================================
   THEME TOGGLE, COUNTRY SELECTOR & AUTH SYSTEM FUNCTIONS
====================================================================== */
function getMoonIconSvg() {
  return `<svg class="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--ink-primary);"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
}

function getSunIconSvg() {
  return `<svg class="w-4 h-4 shrink-0 transition-transform group-hover:scale-110 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
}

function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';

  if (newTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  try {
    localStorage.setItem('vw_theme', newTheme);
  } catch (e) {}

  const btns = document.querySelectorAll('.vw-theme-toggle-btn');
  btns.forEach((btn) => {
    btn.classList.add('rotating');
    btn.title = newTheme === 'dark' ? 'Switch to Light Mode • লাইট মোড' : 'Switch to Dark Mode • ডার্ক মোড';
    const iconSpan = btn.querySelector('.vw-theme-toggle-icon');
    if (iconSpan) {
      iconSpan.innerHTML = newTheme === 'dark' ? getSunIconSvg() : getMoonIconSvg();
    }
    setTimeout(() => {
      btn.classList.remove('rotating');
    }, 400);
  });
}

function toggleCountryPicker() {
  const picker = document.getElementById('vw-country-picker');
  if (picker) picker.classList.toggle('hidden');
}

function selectCountry(countryId) {
  if (!COUNTRY_CONFIG[countryId]) return;
  try {
    localStorage.setItem('vw_country', countryId);
  } catch (e) {}

  const country = COUNTRY_CONFIG[countryId];
  if (country.accentId && ACCENT_CONFIG[country.accentId]) {
    try {
      localStorage.setItem('vw_accent', country.accentId);
    } catch (e) {}
  }

  const picker = document.getElementById('vw-country-picker');
  if (picker) picker.classList.add('hidden');

  const activePage = window.location.pathname.split('/').pop().replace('.html', '') || 'home';
  renderAppHeader(activePage);

  if (typeof showToast === 'function') {
    showToast(`দেশ ও উচ্চারণ অ্যাকসেন্ট পরিবর্তিত হয়েছে: ${country.name} (${country.lang})`);
  }
}

function getStoredUserProfile() {
  try {
    const raw = localStorage.getItem('vw_user_profile');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function openAuthModal() {
  const modal = document.getElementById('vw-auth-modal');
  if (modal) {
    modal.classList.remove('hidden');
    const nameInput = document.getElementById('auth-name-input');
    if (nameInput) setTimeout(() => nameInput.focus(), 80);
  }
}

function closeAuthModal() {
  const modal = document.getElementById('vw-auth-modal');
  if (modal) modal.classList.add('hidden');
}

function handleAuthSubmit(event) {
  if (event) event.preventDefault();
  const nameInput = document.getElementById('auth-name-input');
  const emailInput = document.getElementById('auth-email-input');
  const name = nameInput ? nameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';

  if (!name) {
    if (typeof showToast === 'function') showToast('দয়া করে আপনার পূর্ণ নাম লিখুন');
    return;
  }

  const userProfile = {
    name: name,
    email: email || `${name.toLowerCase().replace(/\s+/g, '')}@learner.vocabularyworld.com`,
    initial: name.charAt(0).toUpperCase(),
    signedInAt: Date.now()
  };

  try {
    localStorage.setItem('vw_user_profile', JSON.stringify(userProfile));
  } catch (e) {}

  closeAuthModal();

  const activePage = window.location.pathname.split('/').pop().replace('.html', '') || 'home';
  renderAppHeader(activePage);

  if (typeof showToast === 'function') {
    showToast(`স্বাগতম, ${name}! সফলভাবে সাইন ইন হয়েছে।`);
  }
}

function handleGuestAuth() {
  const guestUser = {
    name: 'Guest Learner',
    email: 'guest@vocabularyworld.com',
    initial: 'G',
    signedInAt: Date.now()
  };
  try {
    localStorage.setItem('vw_user_profile', JSON.stringify(guestUser));
  } catch (e) {}
  closeAuthModal();
  const activePage = window.location.pathname.split('/').pop().replace('.html', '') || 'home';
  renderAppHeader(activePage);
  if (typeof showToast === 'function') {
    showToast('অতিথি শিক্ষার্থী হিসেবে সাইন ইন সম্পন্ন হয়েছে!');
  }
}

function toggleUserMenu() {
  const dropdown = document.getElementById('vw-user-menu-dropdown');
  if (dropdown) dropdown.classList.toggle('hidden');
}

function handleSignOut() {
  try {
    localStorage.removeItem('vw_user_profile');
  } catch (e) {}
  const dropdown = document.getElementById('vw-user-menu-dropdown');
  if (dropdown) dropdown.classList.add('hidden');
  const activePage = window.location.pathname.split('/').pop().replace('.html', '') || 'home';
  renderAppHeader(activePage);
  if (typeof showToast === 'function') {
    showToast('সফলভাবে সাইন আউট করা হয়েছে।');
  }
}

// Global click listener to close popups when clicking outside
document.addEventListener('click', (e) => {
  // 1. Close Level Picker
  const levelPicker = document.getElementById('top-level-picker');
  const levelBtn = document.getElementById('top-level-btn');
  if (levelPicker && !levelPicker.classList.contains('hidden')) {
    if (levelBtn && !levelBtn.contains(e.target) && !levelPicker.contains(e.target)) {
      levelPicker.classList.add('hidden');
    }
  }

  // 2. Close Country Picker
  const countryPicker = document.getElementById('vw-country-picker');
  const countryBtn = document.getElementById('vw-country-btn');
  if (countryPicker && !countryPicker.classList.contains('hidden')) {
    if (countryBtn && !countryBtn.contains(e.target) && !countryPicker.contains(e.target)) {
      countryPicker.classList.add('hidden');
    }
  }

  // 3. Close User Menu Dropdown
  const userDropdown = document.getElementById('vw-user-menu-dropdown');
  const userBtn = document.getElementById('vw-user-menu-btn');
  if (userDropdown && !userDropdown.classList.contains('hidden')) {
    if (userBtn && !userBtn.contains(e.target) && !userDropdown.contains(e.target)) {
      userDropdown.classList.add('hidden');
    }
  }
});

function renderAppHeader(activePage = 'home') {
  const headerContainer = document.getElementById('app-header');
  if (!headerContainer) return;

  const path = (window.location.pathname || '').toLowerCase();
  const file = path.split('/').pop().split('\\').pop() || '';
  const isIndex = file === '' || file === 'index.html' || activePage === 'home';

  headerContainer.classList.remove('hidden');

  const selectedCountry = getSelectedCountry();
  const activeAccent = getActiveAccent();
  const userProfile = getStoredUserProfile();
  const isDark = typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark';

  // Helper 1: Dark / Light Theme Toggle Button
  const themeToggleBtnHTML = `
    <button
      type="button"
      id="vw-theme-toggle-btn"
      onclick="toggleTheme()"
      class="vw-theme-toggle-btn"
      title="${isDark ? 'Switch to Light Mode &bull; লাইট মোড' : 'Switch to Dark Mode &bull; ডার্ক মোড'}"
      aria-label="Toggle theme"
    >
      <span class="vw-theme-toggle-icon">
        ${isDark ? getSunIconSvg() : getMoonIconSvg()}
      </span>
    </button>
  `;

  // Helper 2: Country & Accent Selector
  const countrySelectorHTML = `
    <div class="relative">
      <button
        type="button"
        id="vw-country-btn"
        onclick="toggleCountryPicker()"
        class="vw-country-btn"
        title="Pronunciation Accent: ${activeAccent.name} (${activeAccent.shortLabel}) &bull; Click to switch"
      >
        <span class="vw-country-flag text-base leading-none">${selectedCountry.flag}</span>
        <span id="vw-navbar-accent-badge" class="vw-navbar-accent-badge">${activeAccent.shortLabel}</span>
        <span class="text-[8px] text-gray-400">&blacktriangledown;</span>
      </button>

      <!-- Country & Accent Dropdown Menu -->
      <div
        id="vw-country-picker"
        class="hidden absolute right-0 mt-2 w-72 rounded-2xl border p-2.5 shadow-xl z-50 vw-panel-reveal"
        style="background-color: var(--surface-white); border-color: var(--border-subtle);"
      >
        <!-- Quick Accent Switcher Row -->
        <div class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border-b mb-1.5 flex items-center justify-between" style="color: var(--ink-muted); border-color: var(--border-subtle);">
          <span>Quick Accent &bull; দ্রুত অ্যাকসেন্ট</span>
          <span class="font-mono text-[9px] lowercase opacity-75">${activeAccent.code}</span>
        </div>
        <div class="grid grid-cols-4 gap-1 px-1 mb-2.5">
          ${Object.values(ACCENT_CONFIG)
            .map((acc) => {
              const isAct = acc.id === activeAccent.id;
              return `
                <button
                  type="button"
                  onclick="setActiveAccent('${acc.id}')"
                  class="vw-quick-accent-btn px-1.5 py-1 rounded-xl text-center border transition-all ${
                    isAct ? 'active font-bold' : ''
                  }"
                  title="${acc.name} (${acc.code})"
                >
                  <span class="block text-sm leading-tight">${acc.flag}</span>
                  <span class="block text-[10px] font-mono font-bold leading-tight mt-0.5">${acc.shortLabel}</span>
                </button>
              `;
            })
            .join('')}
        </div>

        <!-- Country & Dialect List -->
        <div class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border-b mb-1" style="color: var(--ink-muted); border-color: var(--border-subtle);">
          Country &amp; Dialect &bull; দেশভিত্তিক নির্বাচন
        </div>
        <div class="space-y-0.5 max-h-60 overflow-y-auto">
          ${Object.values(COUNTRY_CONFIG)
            .map((c) => {
              const isSelected = c.id === selectedCountry.id;
              return `
                <button
                  type="button"
                  onclick="selectCountry('${c.id}')"
                  class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    isSelected ? 'bg-[#EEF4F1] text-[#2D5A4C]' : 'hover:bg-black/5 dark:hover:bg-white/5'
                  }"
                  style="${isSelected ? 'background-color: var(--accent-sage-soft); color: var(--accent-sage);' : 'color: var(--ink-primary);'}"
                >
                  <div class="flex items-center gap-2.5">
                    <span class="text-base leading-none">${c.flag}</span>
                    <div class="text-left">
                      <span class="block text-xs font-bold">${c.name}</span>
                      <span class="block text-[10px] font-normal" style="color: var(--ink-muted);">${c.accentLabel}</span>
                    </div>
                  </div>
                  ${isSelected ? '<span class="text-xs font-bold" style="color: var(--accent-sage);">&check;</span>' : ''}
                </button>
              `;
            })
            .join('')}
        </div>
      </div>
    </div>
  `;

  // Helper 3: Sign In Pill / User Profile Menu
  const authBtnHTML = userProfile ? `
    <div class="relative">
      <button
        type="button"
        id="vw-user-menu-btn"
        onclick="toggleUserMenu()"
        class="vw-auth-user-btn"
        title="Signed in as ${userProfile.name}"
      >
        <span class="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 shadow-xs" style="background-color: var(--accent-sage);">
          ${userProfile.initial || userProfile.name.charAt(0).toUpperCase()}
        </span>
        <span class="hidden sm:inline max-w-[90px] truncate">${userProfile.name}</span>
        <span class="text-[8px] text-gray-400 ml-0.5">&blacktriangledown;</span>
      </button>

      <!-- User Profile Dropdown -->
      <div
        id="vw-user-menu-dropdown"
        class="hidden absolute right-0 mt-2 w-64 rounded-2xl border p-3 shadow-xl z-50 vw-panel-reveal"
        style="background-color: var(--surface-white); border-color: var(--border-subtle);"
      >
        <div class="flex items-center gap-2.5 pb-3 border-b" style="border-color: var(--border-subtle);">
          <span class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-xs" style="background-color: var(--accent-sage);">
            ${userProfile.initial || userProfile.name.charAt(0).toUpperCase()}
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-bold truncate" style="color: var(--ink-primary);">${userProfile.name}</p>
            <p class="text-[11px] truncate" style="color: var(--ink-muted);">${userProfile.email}</p>
          </div>
        </div>

        <div class="py-2 space-y-1">
          <div class="flex items-center justify-between px-2 py-1 rounded-xl text-xs" style="color: var(--ink-secondary);">
            <span>Membership</span>
            <span class="font-bold text-[10px] px-2 py-0.5 rounded-full" style="background-color: var(--accent-sage-soft); color: var(--accent-sage);">Active Learner</span>
          </div>
          <a href="tracker.html" class="flex items-center justify-between px-2 py-1.5 rounded-xl text-xs font-bold transition-colors hover:bg-black/5" style="color: var(--ink-primary);">
            <span>View Daily Progress</span>
            <span>&rarr;</span>
          </a>
        </div>

        <div class="pt-2 border-t" style="border-color: var(--border-subtle);">
          <button
            type="button"
            onclick="handleSignOut()"
            class="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-500/10 transition-colors"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            <span>Sign Out &bull; লগ আউট</span>
          </button>
        </div>
      </div>
    </div>
  ` : `
    <button
      type="button"
      id="vw-auth-btn"
      onclick="openAuthModal()"
      class="vw-auth-pill-btn"
      title="Sign in to save your vocabulary progress"
    >
      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
      <span class="hidden sm:inline">Sign In</span>
    </button>
  `;

  // Helper 4: Global Auth Modal HTML
  const authModalHTML = `
    <!-- Global Sign In / Authentication Modal -->
    <div id="vw-auth-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs hidden">
      <div class="fixed inset-0" onclick="closeAuthModal()"></div>
      <div
        class="relative w-full max-w-md rounded-3xl border p-6 sm:p-8 shadow-2xl z-10 vw-view-enter"
        style="background-color: var(--surface-white); border-color: var(--border-subtle);"
      >
        <button
          type="button"
          onclick="closeAuthModal()"
          class="absolute top-5 right-5 w-8 h-8 rounded-full border flex items-center justify-center transition-colors hover:border-[#2D5A4C]"
          style="border-color: var(--border-subtle); color: var(--ink-muted);"
          aria-label="Close"
        >
          <svg class="w-4 h-4 fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div class="flex items-center gap-3 mb-5">
          <div
            class="w-10 h-10 rounded-2xl flex items-center justify-center font-editorial font-bold text-xl text-white shadow-xs shrink-0"
            style="background-color: var(--accent-sage);"
          >
            V
          </div>
          <div>
            <h3 class="font-editorial text-xl font-bold" style="color: var(--ink-primary);">
              Sign In to Vocabulary World
            </h3>
            <p class="font-bengali text-xs mt-0.5" style="color: var(--ink-muted);">
              আপনার শব্দ শেখার অগ্রগতি ট্র্যাক ও সংরক্ষণ করুন
            </p>
          </div>
        </div>

        <form id="vw-auth-form" onsubmit="handleAuthSubmit(event)" class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider mb-1.5" style="color: var(--ink-secondary);">
              Full Name &bull; পূর্ণ নাম
            </label>
            <input
              id="auth-name-input"
              type="text"
              required
              placeholder="e.g. John Doe / রাকিব হাসান"
              class="w-full px-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2D5A4C]/30 transition-all"
              style="background-color: var(--surface-sand); border-color: var(--border-subtle); color: var(--ink-primary);"
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider mb-1.5" style="color: var(--ink-secondary);">
              Email Address &bull; ইমেইল ঠিকানা
            </label>
            <input
              id="auth-email-input"
              type="email"
              placeholder="you@example.com"
              class="w-full px-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2D5A4C]/30 transition-all"
              style="background-color: var(--surface-sand); border-color: var(--border-subtle); color: var(--ink-primary);"
            />
          </div>

          <button
            type="submit"
            class="vw-auth-pill-btn w-full py-3 justify-center text-sm shadow-md mt-2"
          >
            <span>Sign In &bull; সাইন ইন</span>
          </button>

          <div class="relative flex py-1 items-center">
            <div class="flex-grow border-t" style="border-color: var(--border-subtle);"></div>
            <span class="flex-shrink mx-3 text-[11px] font-bold uppercase" style="color: var(--ink-muted);">Or &bull; অথবা</span>
            <div class="flex-grow border-t" style="border-color: var(--border-subtle);"></div>
          </div>

          <button
            type="button"
            onclick="handleGuestAuth()"
            class="w-full py-2.5 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all hover:border-[#2D5A4C]"
            style="background-color: var(--surface-sand); border-color: var(--border-subtle); color: var(--ink-primary);"
          >
            <svg class="w-4 h-4 fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            <span>Continue as Guest &bull; অতিথি হিসেবে প্রবেশ</span>
          </button>
        </form>
      </div>
    </div>
  `;

  // =========================================================================
  // CASE 1: index.html (Pure Clean Level Selection Gateway)
  // Keeps ONLY Logo on left, and Theme Toggle, Country Selector, Sign In on right.
  // Absolutely NO center nav links, NO level dropdown, and NO mobile menu.
  // =========================================================================
  if (isIndex) {
    headerContainer.innerHTML = `
      <header
        id="vw-top-header"
        class="sticky top-0 z-40 w-full border-b backdrop-blur-md"
        style="background-color: rgba(250, 248, 245, 0.95); border-color: var(--border-subtle);"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <!-- 1. LEFT: Brand Logo & Title -->
          <a href="index.html" class="flex items-center gap-2.5 shrink-0 group focus:outline-none" title="Vocabulary World Home">
            <div
              class="w-9 h-9 rounded-xl flex items-center justify-center font-editorial font-bold text-lg text-white shadow-xs shrink-0 transition-transform group-hover:scale-105"
              style="background-color: var(--accent-sage);"
            >
              V
            </div>
            <div class="hidden sm:block">
              <span class="font-editorial text-lg font-bold block leading-none" style="color: var(--ink-primary);">
                Vocabulary World
              </span>
              <span class="font-bengali text-[10px] block mt-0.5" style="color: var(--ink-muted);">
                বাংলা-ইংরেজি শব্দভান্ডার
              </span>
            </div>
          </a>

          <!-- 2. RIGHT: Clean Utility Controls (Theme Toggle + Country Selector + Sign In Pill Button) -->
          <div class="flex items-center gap-2 sm:gap-3 shrink-0">
            ${themeToggleBtnHTML}
            ${countrySelectorHTML}
            ${authBtnHTML}
          </div>
        </div>
      </header>
      ${authModalHTML}
    `;
    return;
  }

  // =========================================================================
  // CASE 2: All Subsequent Pages (learn, flashcards, games, tracker, assessment, etc.)
  // Full top navigation bar with sliding pill menu, Level switcher dropdown, mobile menu, etc.
  // =========================================================================
  const currentLevelId = (typeof AppState !== 'undefined' && AppState.selectedLevel) || 'beginner';
  let levelTitle = 'Beginner';
  let levelSubtitle = 'প্রাথমিক স্তর';
  let levelBadgeClass = 'badge-beginner';

  if (typeof LEVEL_META !== 'undefined') {
    const meta = LEVEL_META.find((m) => m.id === currentLevelId);
    if (meta) {
      levelTitle = meta.title;
      levelSubtitle = meta.bengaliSubtitle;
      levelBadgeClass = 'badge-' + meta.id;
    }
  }

  const navLinks = [
    {
      id: 'home',
      label: 'Levels',
      href: 'index.html',
      icon: `<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
    },
    {
      id: 'learn',
      label: 'Learn',
      href: 'learn.html',
      icon: `<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`
    },
    {
      id: 'flashcards',
      label: '3D Flashcards',
      href: 'flashcards.html',
      icon: `<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="14" rx="2"/><path d="M6 3h12a2 2 0 0 1 2 2v12"/></svg>`
    },
    {
      id: 'games',
      label: 'Games',
      href: 'games.html',
      icon: `<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="4"/><path d="M6 12h4m-2-2v4m7-2h.01m3 0h.01"/></svg>`
    },
    {
      id: 'tracker',
      label: 'Tracker',
      href: 'tracker.html',
      icon: `<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>`
    },
    {
      id: 'add-words',
      label: '+ Add Words',
      href: 'add-words.html',
      icon: `<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8m-4-4h8"/></svg>`
    }
  ];

  headerContainer.innerHTML = `
    <header
      id="vw-top-header"
      class="sticky top-0 z-40 w-full border-b backdrop-blur-md"
      style="background-color: rgba(250, 248, 245, 0.95); border-color: var(--border-subtle);"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <!-- 1. LEFT: Brand Logo & Title -->
        <a href="index.html" class="flex items-center gap-2.5 shrink-0 group focus:outline-none" title="Vocabulary World Home">
          <div
            class="w-9 h-9 rounded-xl flex items-center justify-center font-editorial font-bold text-lg text-white shadow-xs shrink-0 transition-transform group-hover:scale-105"
            style="background-color: var(--accent-sage);"
          >
            V
          </div>
          <div class="hidden sm:block">
            <span class="font-editorial text-lg font-bold block leading-none" style="color: var(--ink-primary);">
              Vocabulary World
            </span>
            <span class="font-bengali text-[10px] block mt-0.5" style="color: var(--ink-muted);">
              বাংলা-ইংরেজি শব্দভান্ডার
            </span>
          </div>
        </a>

        <!-- 2. CENTER: LanGeek-Inspired Horizontal Sliding Pill Navigation (Desktop: >= md) -->
        <nav
          id="vw-top-nav"
          class="vw-top-nav relative hidden md:inline-flex items-center"
          aria-label="Main navigation"
        >
          <!-- Floating Background Horizontal Sliding Pill -->
          <div id="vw-top-sliding-pill" class="vw-top-sliding-pill" aria-hidden="true"></div>

          <!-- 6 Single-Line Horizontal Menu Items (Icon + English Title Only) -->
          ${navLinks
            .map((item) => {
              const isActive = activePage === item.id;
              return `
                <a
                  href="${item.href}"
                  data-page="${item.id}"
                  class="vw-top-nav-item nav-item ${isActive ? 'active is-pill-target' : ''}"
                >
                  <span class="vw-nav-icon ${isActive ? 'nav-icon-pop' : ''}">${item.icon}</span>
                  <span>${item.label}</span>
                </a>
              `;
            })
            .join('')}
        </nav>

        <!-- 3. RIGHT: Utility Controls (Level Selector + Theme Toggle + Country Selector + Sign In Pill + Mobile Toggle) -->
        <div class="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <!-- Active "Level: Beginner" Selector Pill (Dropdown) -->
          <div class="relative">
            <button
              type="button"
              id="top-level-btn"
              onclick="toggleTopLevelPicker()"
              class="font-bengali flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border text-xs font-bold transition-all hover:border-[#2D5A4C]"
              style="background-color: var(--surface-white); border-color: var(--border-subtle); color: var(--ink-primary);"
              title="Current Level: ${levelTitle} &bull; Click to switch"
            >
              <span class="w-2 h-2 rounded-full shrink-0" style="background-color: var(--accent-sage);"></span>
              <span class="hidden xs:inline">Level: </span><span>${levelTitle}</span>
              <span class="text-[9px] text-gray-400 ml-0.5">&blacktriangledown;</span>
            </button>

            <!-- Inline Level Switcher Popover -->
            <div
              id="top-level-picker"
              class="hidden absolute right-0 mt-2 w-48 rounded-2xl border p-1.5 shadow-lg z-50 vw-panel-reveal"
              style="background-color: var(--surface-white); border-color: var(--border-subtle);"
            >
              <div class="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border-b mb-1" style="color: var(--ink-muted); border-color: var(--border-subtle);">
                Select Level &bull; লেভেল নির্বাচন
              </div>
              ${(typeof LEVEL_META !== 'undefined' ? LEVEL_META : [
                { id: 'beginner', title: 'Beginner', bengaliSubtitle: 'প্রাথমিক' },
                { id: 'intermediate', title: 'Intermediate', bengaliSubtitle: 'মাধ্যমিক' },
                { id: 'advanced', title: 'Advanced', bengaliSubtitle: 'উচ্চতর' },
                { id: 'pro', title: 'Pro', bengaliSubtitle: 'দক্ষ' }
              ])
                .map((lvl) => {
                  const isSelected = lvl.id === currentLevelId;
                  return `
                    <button
                      type="button"
                      onclick="selectTopLevel('${lvl.id}')"
                      class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                        isSelected ? 'bg-[#EEF4F1] text-[#2D5A4C]' : 'text-gray-700 hover:bg-[#FAF8F5]'
                      }"
                      style="${isSelected ? 'background-color: var(--accent-sage-soft); color: var(--accent-sage);' : 'color: var(--ink-primary);'}"
                    >
                      <div class="flex items-center gap-2">
                        <span class="w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#2D5A4C]' : 'bg-gray-300'}"></span>
                        <span>${lvl.title}</span>
                      </div>
                      <span class="font-bengali text-[10px] font-normal" style="color: var(--ink-muted);">${lvl.bengaliSubtitle}</span>
                    </button>
                  `;
                })
                .join('')}
            </div>
          </div>

          ${themeToggleBtnHTML}
          ${countrySelectorHTML}
          ${authBtnHTML}

          <!-- Mobile Hamburger Toggle (< md) -->
          <button
            type="button"
            onclick="toggleMobileNavMenu()"
            aria-label="Toggle navigation menu"
            class="md:hidden p-2 rounded-xl border hover:bg-black/5 transition-colors"
            style="border-color: var(--border-subtle); color: var(--ink-primary);"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Menu (< md) -->
      <div
        id="vw-mobile-nav-menu"
        class="hidden md:hidden border-t px-4 py-3 space-y-2 backdrop-blur-md"
        style="background-color: rgba(250, 248, 245, 0.98); border-color: var(--border-subtle);"
      >
        <!-- Mobile Utility Shortcut Row -->
        <div class="flex items-center justify-between pb-2 mb-1 border-b" style="border-color: var(--border-subtle);">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold" style="color: var(--ink-muted);">Settings:</span>
            <!-- Mobile Theme Toggle -->
            <button
              type="button"
              onclick="toggleTheme()"
              class="vw-theme-toggle-btn w-8 h-8 text-xs"
              title="Toggle theme"
            >
              <span class="vw-theme-toggle-icon">
                ${isDark ? getSunIconSvg() : getMoonIconSvg()}
              </span>
            </button>

            <!-- Mobile Country Indicator -->
            <button
              type="button"
              onclick="toggleCountryPicker()"
              class="vw-country-btn h-8 text-xs px-2"
              title="Country accent: ${activeAccent.name}"
            >
              <span>${selectedCountry.flag}</span>
              <span class="vw-navbar-accent-badge">${activeAccent.shortLabel}</span>
            </button>
          </div>

          <!-- Mobile Sign In / Profile -->
          ${userProfile ? `
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-bold truncate max-w-[100px]" style="color: var(--ink-primary);">${userProfile.name}</span>
              <button type="button" onclick="handleSignOut()" class="text-[11px] font-bold text-red-600 hover:underline">
                Sign Out
              </button>
            </div>
          ` : `
            <button
              type="button"
              onclick="openAuthModal()"
              class="vw-auth-pill-btn h-8 text-xs px-3"
            >
              <span>Sign In</span>
            </button>
          `}
        </div>

        <!-- 6 Main Navigation Links -->
        ${navLinks
          .map((item) => {
            const isActive = activePage === item.id;
            return `
              <a
                href="${item.href}"
                data-page="${item.id}"
                class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                  isActive ? 'bg-[#EEF4F1] text-[#2D5A4C]' : 'text-gray-700 hover:bg-black/5'
                }"
              >
                <span class="vw-nav-icon ${isActive ? 'nav-icon-pop' : ''}">${item.icon}</span>
                <span>${item.label}</span>
              </a>
            `;
          })
          .join('')}
      </div>
    </header>
    ${authModalHTML}
  `;

  initTopNavSlidingPill();
}

function realignTopNavSlidingPill() {
  const nav = document.getElementById('vw-top-nav');
  const pill = document.getElementById('vw-top-sliding-pill');
  if (!nav || !pill) return;
  const targetItem = nav.querySelector('.vw-top-nav-item.is-pill-target') || nav.querySelector('.vw-top-nav-item.active');
  if (targetItem) {
    pill.style.transition = 'none';
    pill.style.width = `${targetItem.offsetWidth}px`;
    pill.style.transform = `translate3d(${targetItem.offsetLeft}px, 0, 0)`;
    void pill.offsetWidth;
    pill.style.transition = '';
  }
}

function initTopNavSlidingPill() {
  const nav = document.getElementById('vw-top-nav');
  const pill = document.getElementById('vw-top-sliding-pill');
  if (!nav || !pill) return;

  const items = Array.from(nav.querySelectorAll('.vw-top-nav-item, .nav-item'));
  if (!items.length) return;

  const activeItem = items.find((el) => el.classList.contains('active')) || null;
  let currentTarget = activeItem;

  // Ensure initial active tab has .is-pill-target
  items.forEach((it) => it.classList.remove('is-pill-target'));
  if (activeItem) {
    activeItem.classList.add('is-pill-target');
  }

  let trackingRafId = null;
  let trackingStartTime = null;

  // Helper to extract current horizontal translation from transform matrix
  function getPillTranslateX() {
    try {
      const transform = window.getComputedStyle(pill).transform;
      if (!transform || transform === 'none') return pill.offsetLeft || 0;
      const mat = transform.match(/^matrix\((.+)\)$/);
      if (mat) return parseFloat(mat[1].split(',')[4]) || 0;
      const mat3d = transform.match(/^matrix3d\((.+)\)$/);
      if (mat3d) return parseFloat(mat3d[1].split(',')[12]) || 0;
    } catch (e) {}
    return pill.offsetLeft || 0;
  }

  // Smooth ease-out cubic approximation matching cubic-bezier(0.22, 1, 0.36, 1)
  function easePillMotion(t) {
    return 1 - Math.pow(1 - t, 3.2);
  }

  function syncPillWithTarget(targetEl, animate = true) {
    if (!targetEl) {
      pill.style.opacity = '0';
      return;
    }

    currentTarget = targetEl;

    if (!animate) {
      if (trackingRafId) {
        cancelAnimationFrame(trackingRafId);
        trackingRafId = null;
      }
      pill.style.transition = 'none';
      pill.style.width = `${targetEl.offsetWidth}px`;
      pill.style.transform = `translate3d(${targetEl.offsetLeft}px, 0, 0)`;
      pill.style.opacity = '1';
      void pill.offsetWidth;
      pill.style.transition = '';
      return;
    }

    if (trackingRafId) cancelAnimationFrame(trackingRafId);

    const startX = getPillTranslateX();
    const startW = pill.offsetWidth || targetEl.offsetWidth;
    const duration = 360; // tracks icon expansion and neighbor shifts in lockstep
    trackingStartTime = performance.now();

    pill.style.opacity = '1';
    pill.style.transition = 'none'; // frame-by-frame lockstep glide without sluggish transition lag

    function step(now) {
      if (currentTarget !== targetEl) return;
      const elapsed = now - trackingStartTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = easePillMotion(progress);

      const targetX = targetEl.offsetLeft;
      const targetW = targetEl.offsetWidth;

      const curX = startX + (targetX - startX) * ease;
      const curW = startW + (targetW - startW) * ease;

      pill.style.transform = `translate3d(${curX}px, 0, 0)`;
      pill.style.width = `${curW}px`;

      if (progress < 1) {
        trackingRafId = requestAnimationFrame(step);
      } else {
        pill.style.transform = `translate3d(${targetEl.offsetLeft}px, 0, 0)`;
        pill.style.width = `${targetEl.offsetWidth}px`;
        pill.style.transition = '';
        trackingRafId = null;
      }
    }

    trackingRafId = requestAnimationFrame(step);
  }

  // Function to switch .is-pill-target cleanly
  function setPillTarget(targetItem) {
    if (!targetItem) {
      items.forEach((it) => it.classList.remove('is-pill-target'));
      pill.style.opacity = '0';
      return;
    }

    items.forEach((it) => {
      if (it === targetItem) {
        it.classList.add('is-pill-target');
      } else {
        it.classList.remove('is-pill-target');
      }
    });

    syncPillWithTarget(targetItem, true);
  }

  // Cross-Page Slide Continuity:
  let prevLeft = null;
  let prevWidth = null;
  let prevPage = null;

  try {
    const rawLeft = sessionStorage.getItem(TOP_NAV_LEFT_KEY);
    const rawWidth = sessionStorage.getItem(TOP_NAV_WIDTH_KEY);
    prevPage = sessionStorage.getItem(TOP_NAV_PAGE_KEY);
    if (rawLeft !== null) prevLeft = parseFloat(rawLeft);
    if (rawWidth !== null) prevWidth = parseFloat(rawWidth);
  } catch (e) {}

  const curPage = activeItem ? activeItem.dataset.page : null;

  if (activeItem) {
    if (prevLeft !== null && !isNaN(prevLeft) && (prevPage !== curPage || Math.abs(prevLeft - activeItem.offsetLeft) > 2)) {
      // 1. Initial position at previous tab's horizontal offset without animation
      pill.style.transition = 'none';
      pill.style.width = `${prevWidth || activeItem.offsetWidth}px`;
      pill.style.transform = `translate3d(${prevLeft}px, 0, 0)`;
      pill.style.opacity = '1';
      void pill.offsetWidth;

      // 2. Animate smoothly to new active tab's position
      requestAnimationFrame(() => {
        syncPillWithTarget(activeItem, true);
        try {
          sessionStorage.setItem(TOP_NAV_LEFT_KEY, String(activeItem.offsetLeft));
          sessionStorage.setItem(TOP_NAV_WIDTH_KEY, String(activeItem.offsetWidth));
          if (curPage) sessionStorage.setItem(TOP_NAV_PAGE_KEY, curPage);
        } catch (e) {}
      });
    } else {
      // Direct positioning on initial visit or same-page reload
      syncPillWithTarget(activeItem, false);
      try {
        sessionStorage.setItem(TOP_NAV_LEFT_KEY, String(activeItem.offsetLeft));
        sessionStorage.setItem(TOP_NAV_WIDTH_KEY, String(activeItem.offsetWidth));
        if (curPage) sessionStorage.setItem(TOP_NAV_PAGE_KEY, curPage);
      } catch (e) {}
    }
  } else {
    pill.style.opacity = '0';
  }

  // Interactive Hover Glide & Click Continuity across all menu items
  items.forEach((item) => {
    // Click: Save horizontal position for cross-page continuity
    item.addEventListener('click', () => {
      try {
        sessionStorage.setItem(TOP_NAV_LEFT_KEY, String(item.offsetLeft));
        sessionStorage.setItem(TOP_NAV_WIDTH_KEY, String(item.offsetWidth));
        if (item.dataset.page) {
          sessionStorage.setItem(TOP_NAV_PAGE_KEY, item.dataset.page);
        }
      } catch (e) {}
      setPillTarget(item);
    });

    // Mouseenter: Glide smoothly to hovered item and expand its icon
    item.addEventListener('mouseenter', () => {
      setPillTarget(item);
    });

    // Transitionend listener on nav icons to guarantee perfect resting width
    const iconEl = item.querySelector('.vw-nav-icon');
    if (iconEl) {
      iconEl.addEventListener('transitionend', (e) => {
        if (e.propertyName === 'width' && currentTarget === item && !trackingRafId) {
          pill.style.width = `${item.offsetWidth}px`;
          pill.style.transform = `translate3d(${item.offsetLeft}px, 0, 0)`;
        }
      });
    }
  });

  // Mouseleave on navbar: Glide back to active tab (or collapse all if no active item)
  nav.addEventListener('mouseleave', () => {
    if (activeItem) {
      setPillTarget(activeItem);
    } else {
      items.forEach((it) => it.classList.remove('is-pill-target'));
      pill.style.opacity = '0';
    }
  });

  // ResizeObserver to track layout shifts dynamically
  if (typeof ResizeObserver !== 'undefined') {
    try {
      const ro = new ResizeObserver(() => {
        if (currentTarget && !trackingRafId) {
          pill.style.width = `${currentTarget.offsetWidth}px`;
          pill.style.transform = `translate3d(${currentTarget.offsetLeft}px, 0, 0)`;
        }
      });
      items.forEach((it) => ro.observe(it));
    } catch (e) {}
  }
}

// Global window resize listener to keep horizontal pill aligned
if (typeof window !== 'undefined') {
  window.addEventListener('resize', realignTopNavSlidingPill);
}

function renderAppFooter() {
  const footerContainer = document.getElementById('app-footer');
  if (!footerContainer) return;

  const path = (window.location.pathname || '').toLowerCase();
  const file = path.split('/').pop().split('\\').pop() || '';
  const isIndex = file === '' || file === 'index.html';
  const showNavLinks = !isIndex;

  footerContainer.innerHTML = `
    <footer
      class="border-t py-6 px-4 sm:px-6 mt-12"
      style="border-color: var(--border-subtle); background-color: var(--surface-white);"
    >
      <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style="color: var(--ink-muted);">
        <p class="font-editorial font-semibold" style="color: var(--ink-primary);">
          Vocabulary World &copy; <span>${new Date().getFullYear()}</span> &bull; Bengali-English Vocabulary Platform
        </p>
        ${
          showNavLinks
            ? `
          <div class="flex items-center gap-4 text-xs font-semibold flex-wrap">
            <a href="index.html" class="hover:underline">Levels</a>
            <a href="learn.html" class="hover:underline">Learn</a>
            <a href="flashcards.html" class="hover:underline">Flashcards</a>
            <a href="games.html" class="hover:underline">Games</a>
            <a href="tracker.html" class="hover:underline">Tracker</a>
            <a href="add-words.html" class="hover:underline text-[#2D5A4C] font-bold">+ Add Words</a>
          </div>
        `
            : ''
        }
      </div>
    </footer>
  `;
}

function ensureToastElement() {
  if (document.getElementById('vw-toast')) return;
  const toastDiv = document.createElement('div');
  toastDiv.id = 'vw-toast';
  toastDiv.setAttribute('role', 'status');
  toastDiv.setAttribute('aria-live', 'polite');
  toastDiv.className = 'hidden fixed bottom-5 right-5 z-50 max-w-sm items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg';
  toastDiv.style = 'background-color: var(--surface-white); border-color: var(--border-subtle); color: var(--ink-primary);';
  toastDiv.innerHTML = `
    <span id="vw-toast-text" class="font-bengali text-xs font-semibold"></span>
    <button
      type="button"
      onclick="hideToast()"
      aria-label="Close message"
      class="text-base font-bold px-1.5 rounded hover:bg-black/5"
      style="color: var(--ink-muted);"
    >
      &times;
    </button>
  `;
  document.body.appendChild(toastDiv);
}

/* =====================================================================
   5. EDITORIAL FALLBACK SVG BADGE (BOTANICAL SAGE #2D5A4C)
====================================================================== */
function getEditorialFallbackSvg(word, sizeClass = 'w-full h-full') {
  const initial = (word || 'V').charAt(0).toUpperCase();
  const safeWord = escapeHtml(word || '');
  return `
    <div
      class="${sizeClass} rounded-2xl flex flex-col items-center justify-center p-2 text-center select-none"
      style="background: linear-gradient(135deg, #FAF8F5 0%, #EEF4F1 100%);"
      aria-label="${safeWord} illustration"
    >
      <svg class="w-5 h-5 mb-0.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 21V11" stroke="#2D5A4C" stroke-width="2" stroke-linecap="round"/>
        <path d="M12 11C12 6.5 15.5 3 20 3C20 7.5 16.5 11 12 11Z" fill="#2D5A4C" opacity="0.85"/>
        <path d="M12 14C12 10.5 9 8 5 8C5 11.5 8 14 12 14Z" fill="#C26D53" opacity="0.85"/>
      </svg>
      <span class="font-editorial text-2xl sm:text-3xl font-bold leading-none" style="color: var(--accent-sage);">
        ${initial}
      </span>
      <span class="text-[9px] font-bold uppercase tracking-wider truncate max-w-[76px] mt-1" style="color: var(--ink-secondary);">
        ${safeWord}
      </span>
    </div>
  `;
}

/* =====================================================================
   6. AUTOMATIC WORD IMAGE LOADER
      - Fast localStorage caching ('vw_word_images_v1')
      - Wikipedia / Wikimedia Commons API (origin=*)
      - Optional Pixabay API Key (window.PIXABAY_API_KEY)
      - Editorial Botanical Sage SVG fallback
====================================================================== */
const WordImageLoader = {
  cacheKey: 'vw_word_images_v1',
  memoryCache: {},

  init() {
    try {
      const raw = localStorage.getItem(this.cacheKey);
      if (raw) {
        this.memoryCache = JSON.parse(raw) || {};
      }
    } catch (e) {
      this.memoryCache = {};
    }
  },

  saveToCache(key, url) {
    if (!key) return;
    this.memoryCache[key] = url;
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify(this.memoryCache));
    } catch (e) {}
  },

  getCached(key) {
    return this.memoryCache[key] || null;
  },

  async fetchFromPixabay(query) {
    const apiKey = window.PIXABAY_API_KEY || (typeof localStorage !== 'undefined' && localStorage.getItem('vw_pixabay_api_key'));
    if (!apiKey || !query) return null;
    try {
      const clean = encodeURIComponent(query.replace(/[^\w\s-]/gi, ' ').trim());
      const res = await fetch(`https://pixabay.com/api/?key=${encodeURIComponent(apiKey)}&q=${clean}&image_type=photo&per_page=3&safesearch=true`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.hits && data.hits.length > 0) {
          return data.hits[0].webformatURL || data.hits[0].previewURL;
        }
      }
    } catch (e) {}
    return null;
  },

  async fetchFromWikipediaSearch(query) {
    if (!query) return null;
    try {
      const cleanQuery = query.replace(/[^\w\s-]/gi, ' ').trim();
      const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(cleanQuery)}&gsrlimit=1&prop=pageimages&pithumbsize=320&format=json&origin=*`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && data.query && data.query.pages) {
          const pages = Object.values(data.query.pages);
          const found = pages.find((p) => p.thumbnail && p.thumbnail.source);
          if (found && found.thumbnail.source) {
            return found.thumbnail.source;
          }
        }
      }
    } catch (e) {}
    return null;
  },

  async fetchFromWikipediaSummary(word) {
    if (!word) return null;
    try {
      const clean = word.replace(/[^a-zA-Z0-9 _-]/g, '').trim();
      if (!clean) return null;
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(clean)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.thumbnail && data.thumbnail.source) {
          return data.thumbnail.source;
        }
      }
    } catch (e) {}
    return null;
  },

  async fetchFromWikimediaCommons(query) {
    if (!query) return null;
    try {
      const cleanQuery = query.replace(/[^\w\s-]/gi, ' ').trim();
      const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(cleanQuery)}&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url&iiurlwidth=320&format=json&origin=*`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && data.query && data.query.pages) {
          const pages = Object.values(data.query.pages);
          for (const page of pages) {
            if (page.imageinfo && page.imageinfo[0]) {
              const info = page.imageinfo[0];
              const thumb = info.thumburl || info.url;
              if (thumb && !thumb.endsWith('.svg') && !thumb.endsWith('.ogg')) {
                return thumb;
              }
            }
          }
        }
      }
    } catch (e) {}
    return null;
  },

  async getWordImageUrl(word, imageQuery) {
    const cacheKey = (word || '').toLowerCase().trim();
    if (!cacheKey) return null;

    // 1. Check Cache
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    // 2. Optional Pixabay API Key
    let imgUrl = await this.fetchFromPixabay(imageQuery || word);
    if (imgUrl) {
      this.saveToCache(cacheKey, imgUrl);
      return imgUrl;
    }

    // 3. Wikipedia Action API with imageQuery
    if (imageQuery) {
      imgUrl = await this.fetchFromWikipediaSearch(imageQuery);
      if (imgUrl) {
        this.saveToCache(cacheKey, imgUrl);
        return imgUrl;
      }
    }

    // 4. Wikipedia Summary API by direct word
    imgUrl = await this.fetchFromWikipediaSummary(word);
    if (imgUrl) {
      this.saveToCache(cacheKey, imgUrl);
      return imgUrl;
    }

    // 5. Wikipedia Search by direct word
    imgUrl = await this.fetchFromWikipediaSearch(word);
    if (imgUrl) {
      this.saveToCache(cacheKey, imgUrl);
      return imgUrl;
    }

    // 6. Wikimedia Commons Search
    imgUrl = await this.fetchFromWikimediaCommons(imageQuery || word);
    if (imgUrl) {
      this.saveToCache(cacheKey, imgUrl);
      return imgUrl;
    }

    // No photo found -> mark as fallback to avoid repeated empty requests
    this.saveToCache(cacheKey, 'svg-fallback');
    return null;
  },

  mountImage(containerEl, wordItem) {
    if (!containerEl || !wordItem) return;
    const word = wordItem.word;
    const query = wordItem.imageQuery || word;
    const cacheKey = word.toLowerCase().trim();

    // 1. Instant Render if already in cache
    const cached = this.getCached(cacheKey);
    if (cached) {
      if (cached === 'svg-fallback') {
        containerEl.innerHTML = getEditorialFallbackSvg(word);
      } else {
        containerEl.innerHTML = `<img src="${cached}" alt="${escapeHtml(word)} - context photo" class="w-full h-full object-cover rounded-2xl" loading="lazy" onerror="this.parentElement.innerHTML = getEditorialFallbackSvg('${escapeHtml(word)}')" />`;
      }
      return;
    }

    // 2. Skeleton loader while fetching
    containerEl.innerHTML = `
      <div class="animate-pulse w-full h-full flex flex-col items-center justify-center p-2 text-center" style="background-color: var(--surface-sand);">
        <svg class="w-6 h-6 opacity-40 mb-1" style="color: var(--accent-sage);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <span class="text-[9px] font-mono tracking-wider opacity-60 uppercase" style="color: var(--ink-muted);">Photo</span>
      </div>
    `;

    this.getWordImageUrl(word, query)
      .then((url) => {
        if (!url || url === 'svg-fallback') {
          containerEl.innerHTML = getEditorialFallbackSvg(word);
          return;
        }

        const img = new Image();
        img.src = url;
        img.alt = `${word} - context photo`;
        img.className = 'w-full h-full object-cover rounded-2xl opacity-0 transition-opacity duration-300';
        img.loading = 'lazy';

        img.onload = () => {
          containerEl.innerHTML = '';
          containerEl.appendChild(img);
          requestAnimationFrame(() => {
            img.classList.remove('opacity-0');
            img.classList.add('opacity-100');
          });
        };

        img.onerror = () => {
          this.saveToCache(cacheKey, 'svg-fallback');
          containerEl.innerHTML = getEditorialFallbackSvg(word);
        };
      })
      .catch(() => {
        containerEl.innerHTML = getEditorialFallbackSvg(word);
      });
  },

  mountAll(words) {
    if (!words || !Array.isArray(words)) return;
    words.forEach((item) => {
      const el = document.getElementById(`word-img-frame-${item.id}`);
      if (el) {
        this.mountImage(el, item);
      }
    });
  }
};

/* =====================================================================
   7. AI CARTOON CONVERSATION VIDEO SYSTEM (MAYA & LEO)
   - 16:9 Illustrated Cartoon Scene Vector Graphics (Café, Library, Garden, Study)
   - Dual-Voice Web Speech Synthesis (Maya & Leo)
   - Dynamic Lip-Sync, Eye Blinking, Idle Breathing & Active Speaker Zoom
   - YouTube-Style Subtitles, Interactive Timeline Scrubber & Transcript Jumping
====================================================================== */

function escapeRegex(string) {
  return String(string).replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\\\$&');
}

function highlightTargetWordInSubtitle(text, targetWord) {
  if (!text) return '';
  if (!targetWord) return escapeHtml(text);
  const regex = new RegExp('(\\b' + escapeRegex(targetWord) + '[a-z]*\\b)', 'gi');
  return escapeHtml(text).replace(regex, '<span class="vw-sub-highlight">$1</span>');
}

function generateCartoonConversation(wordObj) {
  if (!wordObj || typeof wordObj !== 'object') {
    wordObj = { word: 'Word', meaningBn: 'শব্দার্থ' };
  }

  const rawWord = String(wordObj.word || 'Word').trim();
  const word = rawWord.charAt(0).toUpperCase() + rawWord.slice(1);
  const cleanWord = word.toLowerCase();
  const pos = String(wordObj.pos || 'word').trim().toLowerCase();

  // Meaning in Bengali
  const meaningBn = String(wordObj.meaningBn || wordObj.meaning || wordObj.bn || 'অর্থ').trim();

  // Rotating 16:9 scene theme ('cafe', 'library', 'rooftop', 'studio')
  const SCENE_THEMES = ['cafe', 'library', 'rooftop', 'studio'];
  let charSum = 0;
  for (let i = 0; i < cleanWord.length; i++) {
    charSum = (charSum * 31 + cleanWord.charCodeAt(i)) & 0xffffffff;
  }
  const themeIdx = Math.abs(charSum) % SCENE_THEMES.length;
  const sceneTheme = (wordObj.sceneTheme && SCENE_THEMES.includes(wordObj.sceneTheme))
    ? wordObj.sceneTheme
    : (wordObj.theme && SCENE_THEMES.includes(wordObj.theme))
    ? wordObj.theme
    : SCENE_THEMES[themeIdx];

  // Synonyms extraction
  let synWords = [];
  if (Array.isArray(wordObj.synonyms)) {
    synWords = wordObj.synonyms
      .map((s) => (typeof s === 'string' ? s.trim() : (s && s.word ? s.word.trim() : '')))
      .filter((s) => s && s.toLowerCase() !== cleanWord);
  } else if (typeof wordObj.synonyms === 'string' && wordObj.synonyms.trim()) {
    synWords = wordObj.synonyms.split(',').map((s) => s.trim()).filter((s) => s && s.toLowerCase() !== cleanWord);
  }
  const firstSynonym = synWords.length > 0 ? (synWords[0].charAt(0).toUpperCase() + synWords[0].slice(1)) : null;

  // Example handling
  const rawEx = String(wordObj.example || wordObj.exampleEn || '').trim();
  const rawExBn = String(wordObj.exampleBn || '').trim();
  const isGeneric = !rawEx ||
    rawEx.toLowerCase().includes('practiced using') ||
    rawEx.toLowerCase().includes('example sentence for') ||
    rawEx.toLowerCase().includes('was added from bulk list') ||
    rawEx.toLowerCase().includes('he used') ||
    rawEx.toLowerCase().includes('she applied');

  let exampleSentence = '';
  let exampleSentenceBn = '';

  if (!isGeneric && rawEx) {
    exampleSentence = rawEx.replace(/^["'“”‘’]|["'“”‘’]$/g, '').trim();
    exampleSentenceBn = rawExBn ? rawExBn.replace(/^["'“”‘’]|["'“”‘’]$/g, '').trim() : '';
  } else {
    exampleSentence = `Using "${word}" naturally makes our communication much more precise and impactful.`;
    exampleSentenceBn = `কথাবার্তায় স্বাভাবিকভাবে "${word}" ব্যবহার করলে আমাদের বক্তব্য আরও স্পষ্ট ও আকর্ষণীয় হয়।`;
  }

  // Generate natural 4-line dual-character conversation
  const line1En = `Leo, have you practiced using the word "${word}" in your conversation today?`;
  const line1Bn = `লিও, তুমি কি আজ তোমার কথোপকথনে "${word}" (${meaningBn}) শব্দটি ব্যবহার করে অনুশীলন করেছ?`;

  const line2En = firstSynonym
    ? `Yes, Maya! "${word}" means "${meaningBn}", similar to "${firstSynonym}"—it is such a useful ${pos} for expressing ideas clearly.`
    : `Yes, Maya! "${word}" is such a useful ${pos} when expressing ideas clearly—it means "${meaningBn}".`;
  const line2Bn = firstSynonym
    ? `হ্যাঁ, মায়া! "${word}"-এর অর্থ "${meaningBn}", অনেকটা "${firstSynonym}"-এর মতো—ভাব প্রকাশের ক্ষেত্রে এটি খুবই কার্যকর একটি শব্দ।`
    : `হ্যাঁ, মায়া! ভাব প্রকাশের ক্ষেত্রে "${word}" (${meaningBn}) সত্যিই একটি চমৎকার ও কার্যকর শব্দ।`;

  const line3En = `Exactly! For instance, remember this sentence: "${exampleSentence}"`;
  const line3Bn = exampleSentenceBn
    ? `একদম ঠিক! উদাহরণস্বরূপ এই বাক্যটি মনে রেখো: "${exampleSentenceBn}"`
    : `একদম ঠিক! যেমন এই বাক্যটি মনে রেখো: "${exampleSentence}" — এটি শব্দটির অর্থ চমৎকারভাবে প্রকাশ করে।`;

  const line4En = `I love that example! Practicing "${word}" regularly in conversations will help us master it forever.`;
  const line4Bn = `উদাহরণটি আমার খুব পছন্দ হয়েছে! প্রতিদিন কথোপকথনে "${word}" চর্চা করলে এটি আমাদের মনে স্থায়ী হয়ে যাবে।`;

  const lines = [
    {
      speaker: 'Maya',
      avatar: 'maya',
      en: line1En,
      bn: line1Bn,
      targetWord: cleanWord,
      approxDuration: 4.5
    },
    {
      speaker: 'Leo',
      avatar: 'leo',
      en: line2En,
      bn: line2Bn,
      targetWord: cleanWord,
      approxDuration: 4.5
    },
    {
      speaker: 'Maya',
      avatar: 'maya',
      en: line3En,
      bn: line3Bn,
      targetWord: cleanWord,
      approxDuration: 4.5
    },
    {
      speaker: 'Leo',
      avatar: 'leo',
      en: line4En,
      bn: line4Bn,
      targetWord: cleanWord,
      approxDuration: 4.5
    }
  ];

  return {
    theme: sceneTheme,
    sceneTheme: sceneTheme,
    duration: 18,
    targetWord: cleanWord,
    lines: lines,
    conversation: lines
  };
}

function getWordCartoonConversation(wordObj) {
  if (!wordObj) return null;
  // 1. Direct cartoonConversation property
  if (wordObj.cartoonConversation && Array.isArray(wordObj.cartoonConversation.lines) && wordObj.cartoonConversation.lines.length >= 4) {
    return wordObj.cartoonConversation;
  }
  // 2. Direct conversation array property
  if (Array.isArray(wordObj.conversation) && wordObj.conversation.length >= 4) {
    const theme = wordObj.sceneTheme || wordObj.theme || 'cafe';
    const convObj = {
      theme: theme,
      sceneTheme: theme,
      duration: 18,
      targetWord: String(wordObj.word || '').toLowerCase(),
      lines: wordObj.conversation,
      conversation: wordObj.conversation
    };
    wordObj.cartoonConversation = convObj;
    return convObj;
  }
  // 3. Lookup in static dataset WORD_CARTOON_CONVERSATIONS
  if (typeof WORD_CARTOON_CONVERSATIONS !== 'undefined') {
    const idKey = (wordObj.id || '').toLowerCase();
    const wordKey = (wordObj.word || '').toLowerCase();
    if (WORD_CARTOON_CONVERSATIONS[idKey]) return WORD_CARTOON_CONVERSATIONS[idKey];
    if (WORD_CARTOON_CONVERSATIONS[wordKey]) return WORD_CARTOON_CONVERSATIONS[wordKey];
  }
  // 4. On-the-fly dynamic generation fallback for any custom or missing word
  const generated = generateCartoonConversation(wordObj);
  if (wordObj && typeof wordObj === 'object') {
    wordObj.sceneTheme = generated.sceneTheme || generated.theme;
    wordObj.conversation = generated.lines;
    wordObj.cartoonConversation = generated;
  }
  return generated;
}

function renderCartoonSceneSvg(theme = 'cafe', speaker = 'Maya', isSpeaking = false) {
  let bgElements = '';
  if (theme === 'library') {
    bgElements = `
      <linearGradient id="libWall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#261E1A"/>
        <stop offset="100%" stop-color="#3D302A"/>
      </linearGradient>
      <rect width="800" height="450" fill="url(#libWall)"/>
      <rect x="40" y="20" width="720" height="340" rx="12" fill="#543C30" stroke="#3D291F" stroke-width="6"/>
      <line x1="40" y1="130" x2="760" y2="130" stroke="#3D291F" stroke-width="6"/>
      <line x1="40" y1="240" x2="760" y2="240" stroke="#3D291F" stroke-width="6"/>
      <rect x="60" y="45" width="22" height="80" rx="3" fill="#991B1B"/>
      <rect x="85" y="55" width="28" height="70" rx="3" fill="#065F46"/>
      <rect x="116" y="40" width="32" height="85" rx="3" fill="#D97706"/>
      <rect x="151" y="60" width="24" height="65" rx="3" fill="#1E40AF"/>
      <rect x="178" y="50" width="30" height="75" rx="3" fill="#7C2D12"/>
      <rect x="580" y="45" width="26" height="80" rx="3" fill="#047857"/>
      <rect x="609" y="40" width="34" height="85" rx="3" fill="#B45309"/>
      <rect x="646" y="55" width="25" height="70" rx="3" fill="#4338CA"/>
      <rect x="674" y="48" width="30" height="77" rx="3" fill="#831843"/>
      <path d="M 330 240 L 330 90 Q 400 40 470 90 L 470 240 Z" fill="#E0F2FE" stroke="#451A03" stroke-width="5"/>
      <line x1="400" y1="65" x2="400" y2="240" stroke="#451A03" stroke-width="4"/>
      <line x1="330" y1="150" x2="470" y2="150" stroke="#451A03" stroke-width="4"/>
      <rect x="0" y="360" width="800" height="90" fill="#451A03"/>
      <rect x="0" y="354" width="800" height="8" fill="#78350F"/>
      <path d="M 380 354 L 420 354 L 415 315 L 385 315 Z" fill="#D97706"/>
      <path d="M 370 315 Q 400 300 430 315 Z" fill="#065F46"/>
      <circle cx="400" cy="320" r="16" fill="#FEF08A" opacity="0.35"/>
    `;
  } else if (theme === 'rooftop' || theme === 'garden') {
    bgElements = `
      <linearGradient id="gardenSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#C084FC"/>
        <stop offset="45%" stop-color="#FB7185"/>
        <stop offset="100%" stop-color="#FED7AA"/>
      </linearGradient>
      <rect width="800" height="450" fill="url(#gardenSky)"/>
      <path d="M 0 320 L 60 320 L 60 260 L 110 260 L 110 320 L 190 320 L 190 280 L 260 280 L 260 320 L 340 320 L 340 250 L 410 250 L 410 320 L 520 320 L 520 270 L 600 270 L 600 320 L 720 320 L 720 280 L 800 280 L 800 450 L 0 450 Z" fill="#312E81" opacity="0.45"/>
      <path d="M 0 70 Q 200 130 400 80 Q 600 130 800 70" stroke="#713F12" stroke-width="2" fill="none"/>
      <circle cx="100" cy="95" r="6" fill="#FEF08A"/>
      <circle cx="200" cy="115" r="6" fill="#FEF08A"/>
      <circle cx="300" cy="100" r="6" fill="#FEF08A"/>
      <circle cx="400" cy="80" r="6" fill="#FEF08A"/>
      <circle cx="500" cy="105" r="6" fill="#FEF08A"/>
      <circle cx="600" cy="115" r="6" fill="#FEF08A"/>
      <circle cx="700" cy="90" r="6" fill="#FEF08A"/>
      <rect x="0" y="350" width="800" height="100" fill="#78350F"/>
      <rect x="0" y="344" width="800" height="8" fill="#92400E"/>
      <path d="M 370 344 L 430 344 L 420 380 L 380 380 Z" fill="#C2410C"/>
      <circle cx="400" cy="310" r="32" fill="#047857"/>
      <circle cx="380" cy="300" r="22" fill="#10B981"/>
      <circle cx="420" cy="295" r="24" fill="#059669"/>
    `;
  } else if (theme === 'studio' || theme === 'study') {
    bgElements = `
      <linearGradient id="studyWall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#EFF6F3"/>
        <stop offset="100%" stop-color="#E2ECE6"/>
      </linearGradient>
      <rect width="800" height="450" fill="url(#studyWall)"/>
      <rect x="260" y="40" width="280" height="240" rx="16" fill="#DBEAFE" stroke="#CBD5E1" stroke-width="4"/>
      <circle cx="330" cy="120" r="30" fill="#FFFFFF" opacity="0.9"/>
      <circle cx="365" cy="110" r="38" fill="#FFFFFF" opacity="0.9"/>
      <circle cx="410" cy="120" r="32" fill="#FFFFFF" opacity="0.9"/>
      <rect x="80" y="90" width="120" height="12" rx="4" fill="#94A3B8"/>
      <rect x="125" y="65" width="26" height="25" rx="4" fill="#EA580C"/>
      <circle cx="138" cy="55" r="14" fill="#059669"/>
      <rect x="600" y="70" width="130" height="95" rx="8" fill="#F8FAFC" stroke="#64748B" stroke-width="3"/>
      <circle cx="645" cy="115" r="24" fill="#CBD5E1"/>
      <circle cx="690" cy="115" r="20" fill="#94A3B8"/>
      <rect x="0" y="360" width="800" height="90" fill="#713F12"/>
      <rect x="0" y="354" width="800" height="8" fill="#854D0E"/>
      <rect x="360" y="315" width="80" height="45" rx="4" fill="#64748B"/>
      <rect x="365" y="320" width="70" height="35" rx="2" fill="#38BDF8"/>
      <rect x="350" y="358" width="100" height="4" rx="2" fill="#94A3B8"/>
    `;
  } else {
    // cafe (default)
    bgElements = `
      <linearGradient id="cafeWall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FBF8F3"/>
        <stop offset="100%" stop-color="#F2E8D7"/>
      </linearGradient>
      <rect width="800" height="450" fill="url(#cafeWall)"/>
      <rect x="250" y="40" width="300" height="240" rx="24" fill="#E8F1F2" stroke="#D3E0E2" stroke-width="4"/>
      <line x1="400" y1="40" x2="400" y2="280" stroke="#D3E0E2" stroke-width="4"/>
      <line x1="250" y1="160" x2="550" y2="160" stroke="#D3E0E2" stroke-width="4"/>
      <circle cx="330" cy="230" r="45" fill="#C5DDD4" opacity="0.6"/>
      <circle cx="470" cy="220" r="55" fill="#B7D6CB" opacity="0.6"/>
      <line x1="200" y1="0" x2="200" y2="80" stroke="#78350F" stroke-width="2"/>
      <path d="M 180 80 Q 200 65 220 80 Z" fill="#D97706"/>
      <circle cx="200" cy="85" r="7" fill="#FDE68A"/>
      <line x1="600" y1="0" x2="600" y2="80" stroke="#78350F" stroke-width="2"/>
      <path d="M 580 80 Q 600 65 620 80 Z" fill="#D97706"/>
      <circle cx="600" cy="85" r="7" fill="#FDE68A"/>
      <rect x="50" y="60" width="130" height="150" rx="8" fill="#1E293B" stroke="#854D0E" stroke-width="4"/>
      <text x="115" y="92" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" fill="#FDE68A" text-anchor="middle">CAFE LATTE</text>
      <text x="115" y="112" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" fill="#94A3B8" text-anchor="middle">&bull; Warm Croissant &bull;</text>
      <text x="115" y="132" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" fill="#94A3B8" text-anchor="middle">&bull; Study Corner &bull;</text>
      <path d="M 85 160 Q 115 180 145 160" stroke="#2D5A4C" stroke-width="2" fill="none"/>
      <rect x="0" y="360" width="800" height="90" fill="#92400E"/>
      <rect x="0" y="354" width="800" height="8" fill="#B45309"/>
      <rect x="375" y="330" width="50" height="30" rx="6" fill="#2D5A4C"/>
      <path d="M 425 336 C 438 336 438 350 425 352" stroke="#2D5A4C" stroke-width="3" fill="none"/>
      <ellipse cx="400" cy="330" rx="25" ry="4" fill="#FFFFFF"/>
      <path d="M 390 322 Q 395 310 392 300 M 405 320 Q 410 308 407 298" stroke="#A7F3D0" stroke-width="2" fill="none" opacity="0.6"/>
    `;
  }

  const mayaSpeaking = isSpeaking && speaker === 'Maya';
  const leoSpeaking = isSpeaking && speaker === 'Leo';

  const mayaSvg = `
    <g id="char-maya" class="cartoon-character ${mayaSpeaking ? 'is-active-speaker' : ''}" transform="translate(140, 160)">
      <g class="cartoon-breathe">
        <path d="M 40 180 Q 80 140 120 180 L 135 290 L 25 290 Z" fill="#2D5A4C"/>
        <polygon points="65,145 80,185 95,145" fill="#FFFFFF"/>
        <line x1="80" y1="185" x2="80" y2="290" stroke="#1E3A31" stroke-width="2"/>
        <circle cx="80" cy="210" r="3" fill="#FEF08A"/>
        <circle cx="80" cy="240" r="3" fill="#FEF08A"/>
        <path d="M 35 180 Q 15 220 45 250" stroke="#2D5A4C" stroke-width="18" stroke-linecap="round" fill="none"/>
        <circle cx="45" cy="250" r="9" fill="#FBD5B9"/>
        <path d="M 125 180 Q 145 220 115 250" stroke="#2D5A4C" stroke-width="18" stroke-linecap="round" fill="none"/>
        <circle cx="115" cy="250" r="9" fill="#FBD5B9"/>
        <rect x="70" y="125" width="20" height="25" rx="6" fill="#FAD1B5"/>
        <circle cx="80" cy="95" r="46" fill="#FBD5B9"/>
        <ellipse cx="55" cy="110" rx="9" ry="6" fill="#FB7185" opacity="0.4"/>
        <ellipse cx="105" cy="110" rx="9" ry="6" fill="#FB7185" opacity="0.4"/>
        <path d="M 28 95 C 28 35 132 35 132 95 C 138 150 115 170 115 170 C 115 170 95 135 80 135 C 65 135 45 170 45 170 C 45 170 22 150 28 95 Z" fill="#3D1E16"/>
        <g class="cartoon-eyes">
          <circle cx="62" cy="95" r="7.5" fill="#1E293B"/>
          <circle cx="64" cy="93" r="2.5" fill="#FFFFFF"/>
          <path d="M 53 87 Q 62 82 71 87" stroke="#3D1E16" stroke-width="2.5" stroke-linecap="round" fill="none"/>
          <circle cx="98" cy="95" r="7.5" fill="#1E293B"/>
          <circle cx="100" cy="93" r="2.5" fill="#FFFFFF"/>
          <path d="M 89 87 Q 98 82 107 87" stroke="#3D1E16" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        </g>
        <path d="M 78 102 Q 80 106 83 103" stroke="#E29D7C" stroke-width="2" stroke-linecap="round" fill="none"/>
        ${mayaSpeaking ? `
          <g class="cartoon-mouth speaking">
            <ellipse cx="80" cy="118" rx="8" ry="7" fill="#881337"/>
            <path d="M 74 115 Q 80 117 86 115" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" fill="none"/>
            <ellipse cx="80" cy="122" rx="5" ry="3" fill="#FB7185"/>
          </g>
        ` : `
          <path d="M 73 116 Q 80 123 87 116" stroke="#C26D53" stroke-width="2.8" stroke-linecap="round" fill="none"/>
        `}
        <path d="M 34 85 Q 80 40 126 85 Q 95 65 80 75 Q 65 65 34 85 Z" fill="#4A251B"/>
        <circle cx="45" cy="70" r="6" fill="#2D5A4C"/>
        <circle cx="45" cy="70" r="3" fill="#FDE68A"/>
      </g>
    </g>
  `;

  const leoSvg = `
    <g id="char-leo" class="cartoon-character ${leoSpeaking ? 'is-active-speaker' : ''}" transform="translate(500, 160)">
      <g class="cartoon-breathe">
        <path d="M 40 180 Q 80 140 120 180 L 138 290 L 22 290 Z" fill="#C26D53"/>
        <polygon points="65,145 80,175 95,145" fill="#FFFFFF"/>
        <path d="M 60 150 Q 80 162 100 150" stroke="#9A3412" stroke-width="3" fill="none"/>
        <path d="M 35 180 Q 15 220 45 245" stroke="#C26D53" stroke-width="18" stroke-linecap="round" fill="none"/>
        <circle cx="45" cy="245" r="9" fill="#FAD1B5"/>
        <path d="M 125 180 Q 145 215 120 245" stroke="#C26D53" stroke-width="18" stroke-linecap="round" fill="none"/>
        <circle cx="120" cy="245" r="9" fill="#FAD1B5"/>
        <rect x="70" y="125" width="20" height="25" rx="6" fill="#FAD1B5"/>
        <circle cx="80" cy="95" r="46" fill="#FAD1B5"/>
        <ellipse cx="55" cy="112" rx="9" ry="6" fill="#FB7185" opacity="0.35"/>
        <ellipse cx="105" cy="112" rx="9" ry="6" fill="#FB7185" opacity="0.35"/>
        <path d="M 28 95 C 20 45 50 20 80 20 C 110 20 140 45 132 95 C 142 85 142 60 130 45 C 115 25 45 25 30 45 C 18 60 18 85 28 95 Z" fill="#231B15"/>
        <circle cx="45" cy="45" r="14" fill="#231B15"/>
        <circle cx="70" cy="35" r="16" fill="#2D221B"/>
        <circle cx="95" cy="36" r="15" fill="#231B15"/>
        <circle cx="118" cy="48" r="14" fill="#2D221B"/>
        <path d="M 52 82 Q 62 76 72 82" stroke="#231B15" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M 88 82 Q 98 76 108 82" stroke="#231B15" stroke-width="3" stroke-linecap="round" fill="none"/>
        <circle cx="62" cy="95" r="14" fill="none" stroke="#2D5A4C" stroke-width="3"/>
        <circle cx="98" cy="95" r="14" fill="none" stroke="#2D5A4C" stroke-width="3"/>
        <line x1="76" y1="95" x2="84" y2="95" stroke="#2D5A4C" stroke-width="3"/>
        <g class="cartoon-eyes">
          <circle cx="62" cy="95" r="6" fill="#1E293B"/>
          <circle cx="64" cy="93" r="2" fill="#FFFFFF"/>
          <circle cx="98" cy="95" r="6" fill="#1E293B"/>
          <circle cx="100" cy="93" r="2" fill="#FFFFFF"/>
        </g>
        <path d="M 78 102 Q 80 106 83 103" stroke="#E29D7C" stroke-width="2" stroke-linecap="round" fill="none"/>
        ${leoSpeaking ? `
          <g class="cartoon-mouth speaking">
            <ellipse cx="80" cy="118" rx="8" ry="7" fill="#881337"/>
            <path d="M 74 115 Q 80 117 86 115" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" fill="none"/>
            <ellipse cx="80" cy="122" rx="5" ry="3" fill="#FB7185"/>
          </g>
        ` : `
          <path d="M 73 116 Q 80 123 87 116" stroke="#C26D53" stroke-width="2.8" stroke-linecap="round" fill="none"/>
        `}
      </g>
    </g>
  `;

  let speechBubbleSvg = '';
  if (mayaSpeaking) {
    speechBubbleSvg = `
      <g id="speech-bubble-maya" class="cartoon-speech-bubble" transform="translate(150, 45)">
        <path d="M 10 10 L 150 10 Q 160 10 160 20 L 160 70 Q 160 80 150 80 L 80 80 L 65 105 L 60 80 L 10 80 Q 0 80 0 70 L 0 20 Q 0 10 10 10 Z" fill="#FFFFFF" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.12))"/>
        <circle cx="28" cy="45" r="14" fill="#EEF4F1"/>
        <text x="28" y="49" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold" fill="#2D5A4C" text-anchor="middle">M</text>
        <text x="50" y="42" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" fill="#2D5A4C">Maya Speaking</text>
        <rect x="52" y="49" width="3" height="8" rx="1.5" fill="#2D5A4C" class="wave-bar-1"/>
        <rect x="58" y="46" width="3" height="14" rx="1.5" fill="#2D5A4C" class="wave-bar-2"/>
        <rect x="64" y="50" width="3" height="7" rx="1.5" fill="#2D5A4C" class="wave-bar-3"/>
      </g>
    `;
  } else if (leoSpeaking) {
    speechBubbleSvg = `
      <g id="speech-bubble-leo" class="cartoon-speech-bubble" transform="translate(480, 45)">
        <path d="M 10 10 L 150 10 Q 160 10 160 20 L 160 70 Q 160 80 150 80 L 100 80 L 95 105 L 80 80 L 10 80 Q 0 80 0 70 L 0 20 Q 0 10 10 10 Z" fill="#FFFFFF" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.12))"/>
        <circle cx="28" cy="45" r="14" fill="#FAF0EC"/>
        <text x="28" y="49" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold" fill="#C26D53" text-anchor="middle">L</text>
        <text x="50" y="42" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" fill="#C26D53">Leo Speaking</text>
        <rect x="52" y="49" width="3" height="8" rx="1.5" fill="#C26D53" class="wave-bar-1"/>
        <rect x="58" y="46" width="3" height="14" rx="1.5" fill="#C26D53" class="wave-bar-2"/>
        <rect x="64" y="50" width="3" height="7" rx="1.5" fill="#C26D53" class="wave-bar-3"/>
      </g>
    `;
  }

  return `
    <svg viewBox="0 0 800 450" class="w-full h-full block" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      ${bgElements}
      ${mayaSvg}
      ${leoSvg}
      ${speechBubbleSvg}
    </svg>
  `;
}

function renderCartoonThumbnailCardHTML(wordItem) {
  if (!wordItem) return '';
  const conv = getWordCartoonConversation(wordItem);
  const theme = (conv && conv.theme) || 'cafe';
  const duration = (conv && conv.duration) ? '0:' + String(conv.duration).padStart(2, '0') : '0:18';
  const firstLine = (conv && conv.lines && conv.lines[0]) ? conv.lines[0] : null;
  const previewSnippet = firstLine ? escapeHtml(firstLine.en) : 'Practice ' + escapeHtml(wordItem.word) + ' with Maya & Leo.';
  const previewBn = firstLine ? escapeHtml(firstLine.bn) : '';
  const wordId = escapeHtml(wordItem.id || wordItem.word);
  const themeLabels = {
    cafe: 'Cozy Café • কফি শপ',
    library: 'Grand Library • লাইব্রেরি',
    rooftop: 'Rooftop Garden • ছাদবাগান',
    garden: 'Rooftop Garden • ছাদবাগান',
    studio: 'Study Studio • পড়ার ঘর',
    study: 'Study Studio • পড়ার ঘর'
  };
  const themeLabel = themeLabels[theme] || 'Cozy Café';

  return `
    <div class="mt-4 pt-3.5 border-t" style="border-color: var(--border-subtle);">
      <!-- Card Section Header -->
      <div class="flex items-center justify-between gap-2 mb-2.5">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style="background-color: var(--accent-sage-soft); color: var(--accent-sage);">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="15" x="2" y="7" rx="2" ry="2"/>
              <polyline points="17 2 12 7 7 2"/>
            </svg>
          </div>
          <div>
            <span class="text-xs font-bold block leading-none" style="color: var(--ink-primary);">
              AI Cartoon Conversation Video
            </span>
            <span class="font-bengali text-[10px] block mt-0.5" style="color: var(--ink-muted);">
              মায়া ও লিওর বাস্তব অ্যানিমেটেড ইংরেজি কথোপকথন
            </span>
          </div>
        </div>
        <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0" style="background-color: var(--accent-sage-soft); color: var(--accent-sage);">
          ${themeLabel}
        </span>
      </div>

      <!-- 16:9 Thumbnail Card -->
      <div
        class="vw-cartoon-video-card group rounded-2xl overflow-hidden border cursor-pointer relative shadow-xs"
        onclick="openCartoonVideoModal('${wordId}')"
        title="Watch Maya & Leo in AI Cartoon Conversation for ${escapeHtml(wordItem.word)}"
        style="background-color: var(--surface-sand); border-color: var(--border-subtle);"
      >
        <div class="relative w-full aspect-video overflow-hidden">
          ${renderCartoonSceneSvg(theme, 'Maya', false)}

          <!-- Centered Play Button Overlay -->
          <div class="absolute inset-0 flex items-center justify-center bg-black/15 group-hover:bg-black/25 transition-colors">
            <div class="vw-cartoon-play-btn w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/95 shadow-xl flex items-center justify-center transition-transform">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" style="color: var(--accent-sage);" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>

          <!-- Top-Left Pill -->
          <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs shadow-xs text-[#2D5A4C] text-[10px] font-bold">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>Watch Cartoon Conversation</span>
          </div>

          <!-- Top-Right Duration Pill -->
          <div class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono font-bold tracking-wider">
            ${duration}
          </div>

          <!-- Bottom Caption Preview Bar -->
          <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent p-2.5 pt-6 text-white flex items-center justify-between gap-2">
            <div class="min-w-0 flex-1">
              <p class="text-[11px] truncate font-medium">
                <span class="font-bold text-[#FDE68A]">Maya:</span> &ldquo;${previewSnippet}&rdquo;
              </p>
              ${previewBn ? `<p class="font-bengali text-[10px] truncate text-gray-300">${previewBn}</p>` : ''}
            </div>
            <span class="text-[10px] font-bold text-emerald-300 shrink-0 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Play</span> &rarr;
            </span>
          </div>
        </div>
      </div>
    </div>
  `;
}

const CartoonPlayer = {
  currentWord: null,
  conv: null,
  lineIdx: 0,
  isPlaying: false,
  isOpen: false,
  speed: 1.0,
  accent: null,
  timer: null,
  progressRaf: null,
  lineStartTime: 0,
  lineExpectedDuration: 4500,

  ensureModal() {
    let modal = document.getElementById('vw-cartoon-video-modal');
    if (!modal) {
      const div = document.createElement('div');
      div.id = 'vw-cartoon-video-modal';
      div.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm hidden';
      div.innerHTML = `
        <div class="fixed inset-0" onclick="CartoonPlayer.close()"></div>
        <div
          class="relative w-full max-w-3xl rounded-3xl border shadow-2xl z-10 flex flex-col overflow-hidden max-h-[92vh] vw-view-enter"
          style="background-color: var(--surface-white); border-color: var(--border-subtle);"
        >
          <!-- 1. Modal Header -->
          <div class="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b shrink-0 gap-3" style="border-color: var(--border-subtle); background-color: var(--bg-ivory);">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-editorial font-bold text-white shadow-xs" style="background-color: var(--accent-sage);">
                V
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 id="vw-cv-modal-word" class="font-editorial text-lg sm:text-xl font-bold truncate" style="color: var(--ink-primary);">
                    Word
                  </h3>
                  <span id="vw-cv-modal-ipa" class="text-xs font-mono" style="color: var(--ink-muted);"></span>
                  <span id="vw-cv-modal-meaning" class="font-bengali text-xs font-bold px-2.5 py-0.5 rounded-full" style="background-color: var(--accent-sage-soft); color: var(--accent-sage);">
                  </span>
                </div>
                <p id="vw-cv-modal-scene" class="text-[11px] font-medium" style="color: var(--ink-muted);">
                  Scene &bull; মায়া ও লিওর ইংরেজি কথোপকথন
                </p>
              </div>
            </div>

            <!-- Accent Switcher Pill [ UK | US | AU ] & Close button -->
            <div class="flex items-center gap-2 shrink-0">
              <div id="vw-cv-accent-bar" class="hidden xs:flex items-center rounded-full p-0.5 border" style="background-color: var(--surface-sand); border-color: var(--border-subtle);" title="Switch Conversation Accent &bull; বাচনভঙ্গি পরিবর্তন">
                <button
                  type="button"
                  data-accent="UK"
                  onclick="CartoonPlayer.setAccent('UK')"
                  class="vw-cv-accent-btn px-2.5 py-1 rounded-full text-xs font-bold transition-all"
                  title="British Accent (UK)"
                >
                  🇬🇧 UK
                </button>
                <button
                  type="button"
                  data-accent="US"
                  onclick="CartoonPlayer.setAccent('US')"
                  class="vw-cv-accent-btn px-2.5 py-1 rounded-full text-xs font-bold transition-all"
                  title="American Accent (US)"
                >
                  🇺🇸 US
                </button>
                <button
                  type="button"
                  data-accent="AU"
                  onclick="CartoonPlayer.setAccent('AU')"
                  class="vw-cv-accent-btn px-2.5 py-1 rounded-full text-xs font-bold transition-all"
                  title="Australian Accent (AU)"
                >
                  🇦🇺 AU
                </button>
              </div>

              <button
                type="button"
                onclick="CartoonPlayer.close()"
                class="w-8 h-8 rounded-full border flex items-center justify-center transition-colors hover:border-[#2D5A4C] shrink-0"
                style="border-color: var(--border-subtle); color: var(--ink-muted);"
                aria-label="Close video player"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          </div>

          <!-- 2. Scrollable Body -->
          <div class="overflow-y-auto flex-1 p-3 sm:p-5 space-y-4">
            <!-- 16:9 Video Player Screen -->
            <div class="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border bg-black select-none" style="border-color: var(--border-subtle);">
              <div id="vw-cv-stage" class="w-full h-full"></div>

              <!-- Dual-Language Subtitles Floating Overlay -->
              <div class="absolute bottom-12 inset-x-3 sm:inset-x-6 flex justify-center pointer-events-none">
                <div id="vw-cv-subtitles-box" class="vw-cv-subtitles rounded-2xl px-4 py-2 text-center max-w-[92%] shadow-lg">
                  <p id="vw-cv-sub-en" class="text-xs sm:text-sm md:text-base font-semibold text-white leading-snug"></p>
                  <p id="vw-cv-sub-bn" class="font-bengali text-[11px] sm:text-xs text-amber-200 mt-1 leading-snug"></p>
                </div>
              </div>

              <!-- YouTube-Style Controls Bar Overlay -->
              <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-3 py-2 pt-6">
                <!-- Scrubber Track -->
                <div
                  id="vw-cv-scrubber"
                  class="relative w-full h-1.5 rounded-full cursor-pointer group mb-2"
                  style="background: rgba(255, 255, 255, 0.3);"
                  onclick="CartoonPlayer.handleScrubberClick(event)"
                >
                  <div id="vw-cv-progress" class="h-full rounded-full transition-all" style="background-color: #34D399; width: 0%;"></div>
                  <div id="vw-cv-scrubber-handle" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity" style="left: 0%;"></div>
                </div>

                <!-- Bottom Control Buttons -->
                <div class="flex items-center justify-between text-white text-xs">
                  <div class="flex items-center gap-2 sm:gap-3">
                    <button
                      type="button"
                      id="vw-cv-play-btn"
                      onclick="CartoonPlayer.togglePlay()"
                      class="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                      title="Play / Pause"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    </button>

                    <button
                      type="button"
                      onclick="CartoonPlayer.replay()"
                      class="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                      title="Replay from start"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                    </button>

                    <span id="vw-cv-time" class="font-mono text-[11px] text-gray-300">0:00 / 0:18</span>
                  </div>

                  <div id="vw-cv-speaker-badge" class="hidden xs:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/15 backdrop-blur-xs">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span id="vw-cv-speaker-name">Maya Speaking</span>
                  </div>

                  <div class="flex items-center gap-2">
                    <div class="xs:hidden flex items-center rounded-full p-0.5 bg-white/20 text-white text-[10px]">
                      <button type="button" onclick="CartoonPlayer.setAccent('UK')" data-accent="UK" class="vw-cv-accent-btn px-1.5 py-0.5 rounded-full font-bold">UK</button>
                      <button type="button" onclick="CartoonPlayer.setAccent('US')" data-accent="US" class="vw-cv-accent-btn px-1.5 py-0.5 rounded-full font-bold">US</button>
                      <button type="button" onclick="CartoonPlayer.setAccent('AU')" data-accent="AU" class="vw-cv-accent-btn px-1.5 py-0.5 rounded-full font-bold">AU</button>
                    </div>

                    <button
                      type="button"
                      id="vw-cv-speed-btn"
                      onclick="CartoonPlayer.toggleSpeed()"
                      class="px-2 py-0.5 rounded-full text-[11px] font-bold border hover:bg-white/20 transition-colors"
                      style="border-color: rgba(255,255,255,0.4);"
                      title="Playback Speed"
                    >
                      1.0x
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. Dialogue Transcript (4 Clickable Interactive Lines) -->
            <div class="rounded-2xl border p-4 space-y-2.5" style="background-color: var(--surface-sand); border-color: var(--border-subtle);">
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs font-bold uppercase tracking-wider" style="color: var(--ink-secondary);">
                  Interactive Dialogue Transcript &bull; কথোপকথন স্ক্রিপ্ট
                </span>
                <span class="font-bengali text-[11px]" style="color: var(--ink-muted);">
                  যেকোনো লাইনে ক্লিক করে সরাসরি শুনুন
                </span>
              </div>

              <div id="vw-cv-transcript-list" class="space-y-2"></div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(div);

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const m = document.getElementById('vw-cartoon-video-modal');
          if (m && !m.classList.contains('hidden')) {
            CartoonPlayer.close();
          }
        }
      });
    }
  },

  setAccent(accentId) {
    if (typeof ACCENT_CONFIG !== 'undefined' && !ACCENT_CONFIG[accentId]) return;
    this.accent = accentId;
    this.updateAccentPills();

    // If currently playing, restart the current line with the newly selected accent & voice
    if (this.isPlaying) {
      if ('speechSynthesis' in window) {
        try { window.speechSynthesis.cancel(); } catch (e) {}
      }
      if (this.timer) { clearTimeout(this.timer); this.timer = null; }
      if (this.progressRaf) { cancelAnimationFrame(this.progressRaf); this.progressRaf = null; }
      this.playLine(this.lineIdx);
    }

    if (typeof showToast === 'function') {
      const acc = (typeof ACCENT_CONFIG !== 'undefined' && ACCENT_CONFIG[accentId]) || { name: accentId, shortLabel: accentId };
      showToast(`কার্টুন কথপোকথন অ্যাকসেন্ট: ${acc.name} (${acc.shortLabel})`);
    }
  },

  updateAccentPills() {
    const currentAccent = this.accent || ((typeof getActiveAccent === 'function') ? getActiveAccent().id : 'US');
    const modal = document.getElementById('vw-cartoon-video-modal');
    if (!modal) return;
    modal.querySelectorAll('.vw-cv-accent-btn').forEach((btn) => {
      if (btn.dataset.accent === currentAccent) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  },

  open(wordId) {
    this.ensureModal();
    let foundWord = null;
    if (typeof CURRICULUM_DATA !== 'undefined') {
      for (const lvlKey of Object.keys(CURRICULUM_DATA)) {
        const lvl = CURRICULUM_DATA[lvlKey];
        if (lvl && Array.isArray(lvl.words)) {
          const w = lvl.words.find((x) => String(x.id).toLowerCase() === String(wordId).toLowerCase() || String(x.word).toLowerCase() === String(wordId).toLowerCase());
          if (w) { foundWord = w; break; }
        }
        if (lvl && Array.isArray(lvl.practiceExtraWords)) {
          const w = lvl.practiceExtraWords.find((x) => String(x.id).toLowerCase() === String(wordId).toLowerCase() || String(x.word).toLowerCase() === String(wordId).toLowerCase());
          if (w) { foundWord = w; break; }
        }
      }
    }
    if (!foundWord && typeof getCustomWords === 'function') {
      const customs = getCustomWords();
      foundWord = customs.find((x) => String(x.id).toLowerCase() === String(wordId).toLowerCase() || String(x.word).toLowerCase() === String(wordId).toLowerCase());
    }

    if (!foundWord) {
      const cleanName = String(wordId).replace(/^preview-/, '').trim();
      foundWord = {
        id: wordId,
        word: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
        pos: 'Word',
        meaningBn: 'শব্দার্থ',
        example: 'We practiced using ' + cleanName + ' in everyday conversation.'
      };
    }

    this.currentWord = foundWord;
    this.conv = getWordCartoonConversation(foundWord);
    if (!this.conv || !Array.isArray(this.conv.lines) || this.conv.lines.length === 0) {
      this.conv = generateCartoonConversation(foundWord);
    }
    this.lineIdx = 0;
    this.isPlaying = true;
    this.isOpen = true;
    this.accent = (typeof getActiveAccent === 'function') ? getActiveAccent().id : 'US';
    this.updateAccentPills();

    if (typeof trackWordExplored === 'function') {
      trackWordExplored(foundWord.id);
    }

    const wordEl = document.getElementById('vw-cv-modal-word');
    const ipaEl = document.getElementById('vw-cv-modal-ipa');
    const meaningEl = document.getElementById('vw-cv-modal-meaning');
    const sceneEl = document.getElementById('vw-cv-modal-scene');

    if (wordEl) wordEl.textContent = foundWord.word;
    if (ipaEl) ipaEl.textContent = foundWord.ipa || '';
    if (meaningEl) meaningEl.textContent = foundWord.meaningBn || '';

    const themeTitles = {
      cafe: 'Scene: Cozy Café • কফি শপ',
      library: 'Scene: Grand Library • লাইব্রেরি',
      rooftop: 'Scene: Rooftop Garden • ছাদবাগান',
      garden: 'Scene: Rooftop Garden • ছাদবাগান',
      studio: 'Scene: Study Studio • পড়ার ঘর',
      study: 'Scene: Study Studio • পড়ার ঘর'
    };
    const activeTheme = this.conv.sceneTheme || this.conv.theme || 'cafe';
    if (sceneEl) sceneEl.textContent = (themeTitles[activeTheme] || 'Scene: Cozy Café') + ' • মায়া ও লিওর ইংরেজি কথোপকথন';

    this.renderTranscriptList();

    const modal = document.getElementById('vw-cartoon-video-modal');
    if (modal) modal.classList.remove('hidden');

    this.playLine(0);
  },

  renderTranscriptList() {
    const listEl = document.getElementById('vw-cv-transcript-list');
    if (!listEl || !this.conv || !this.conv.lines) return;

    listEl.innerHTML = this.conv.lines
      .map((line, idx) => {
        const isMaya = line.avatar === 'maya';
        const speakerColor = isMaya ? 'var(--accent-sage)' : 'var(--accent-terracotta)';
        const speakerBg = isMaya ? 'var(--accent-sage-soft)' : 'var(--accent-terracotta-soft)';
        const highlightedEn = highlightTargetWordInSubtitle(line.en, line.targetWord || this.currentWord.word);

        return `
          <div
            id="vw-cv-line-${idx}"
            class="vw-cv-transcript-item rounded-xl p-3 border flex items-start justify-between gap-3 ${idx === this.lineIdx ? 'is-active-line' : ''}"
            style="background-color: var(--surface-white); border-color: var(--border-subtle);"
            onclick="CartoonPlayer.jumpToLine(${idx})"
            title="Click to jump to line ${idx + 1}"
          >
            <div class="flex items-start gap-2.5 min-w-0 flex-1">
              <span class="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5" style="background-color: ${speakerBg}; color: ${speakerColor};">
                ${isMaya ? 'M' : 'L'}
              </span>
              <div class="min-w-0 flex-1">
                <span class="text-[10px] font-bold uppercase tracking-wider block" style="color: ${speakerColor};">
                  ${escapeHtml(line.speaker)}
                </span>
                <p class="text-xs sm:text-sm font-semibold mt-0.5 leading-snug" style="color: var(--ink-primary);">
                  ${highlightedEn}
                </p>
                <p class="font-bengali text-xs mt-1 leading-snug" style="color: var(--ink-secondary);">
                  (${escapeHtml(line.bn)})
                </p>
              </div>
            </div>

            <span class="text-xs font-mono shrink-0 px-2 py-0.5 rounded-full" style="background-color: var(--surface-sand); color: var(--ink-muted);">
              0:${String(Math.round((idx * 4.5))).padStart(2, '0')}
            </span>
          </div>
        `;
      })
      .join('');
  },

  playLine(idx) {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.progressRaf) {
      cancelAnimationFrame(this.progressRaf);
      this.progressRaf = null;
    }
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }

    if (!this.conv || !this.conv.lines || idx >= this.conv.lines.length) {
      this.isPlaying = false;
      this.updatePlayBtn();
      this.updateScrubber(1);
      return;
    }

    this.lineIdx = idx;
    this.isPlaying = true;
    this.updatePlayBtn();

    const line = this.conv.lines[idx];
    const theme = this.conv.theme || 'cafe';
    const isMaya = line.avatar === 'maya';

    const stageEl = document.getElementById('vw-cv-stage');
    if (stageEl) {
      stageEl.innerHTML = renderCartoonSceneSvg(theme, line.speaker, true);
    }

    const subEn = document.getElementById('vw-cv-sub-en');
    const subBn = document.getElementById('vw-cv-sub-bn');
    if (subEn) {
      subEn.innerHTML = highlightTargetWordInSubtitle(line.en, line.targetWord || this.currentWord.word);
    }
    if (subBn) {
      subBn.textContent = line.bn;
    }

    const speakerBadge = document.getElementById('vw-cv-speaker-badge');
    const speakerName = document.getElementById('vw-cv-speaker-name');
    if (speakerBadge) speakerBadge.classList.remove('hidden');
    if (speakerName) speakerName.textContent = line.speaker + ' Speaking';

    for (let i = 0; i < this.conv.lines.length; i++) {
      const itemEl = document.getElementById('vw-cv-line-' + i);
      if (itemEl) {
        if (i === idx) {
          itemEl.classList.add('is-active-line');
          try { itemEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) {}
        } else {
          itemEl.classList.remove('is-active-line');
        }
      }
    }

    this.lineStartTime = performance.now();
    const wordCount = line.en.split(' ').length;
    this.lineExpectedDuration = Math.max(3600, (wordCount / (this.speed * 2.2)) * 1000);

    const animProgress = (now) => {
      if (!this.isPlaying || this.lineIdx !== idx) return;
      const elapsed = now - this.lineStartTime;
      const lineRatio = Math.min(1, elapsed / this.lineExpectedDuration);
      const overallRatio = (idx + lineRatio) / this.conv.lines.length;
      this.updateScrubber(overallRatio);

      const curSec = Math.min(18, Math.round(overallRatio * 18));
      const timeEl = document.getElementById('vw-cv-time');
      if (timeEl) timeEl.textContent = '0:' + String(curSec).padStart(2, '0') + ' / 0:18';

      if (lineRatio < 1) {
        this.progressRaf = requestAnimationFrame(animProgress);
      }
    };
    this.progressRaf = requestAnimationFrame(animProgress);

    if ('speechSynthesis' in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(line.en);
        const currentAccentId = this.accent || ((typeof getActiveAccent === 'function') ? getActiveAccent().id : 'US');
        const accentObj = (typeof ACCENT_CONFIG !== 'undefined' && ACCENT_CONFIG[currentAccentId]) || { code: 'en-US' };
        const langCode = accentObj.code;

        if (typeof PronunciationEngine !== 'undefined') {
          const voice = PronunciationEngine.getVoiceForAccent(langCode, isMaya ? 'female' : 'male');
          if (voice) utterance.voice = voice;
        }
        utterance.lang = langCode;
        utterance.pitch = isMaya ? 1.25 : 0.82;
        utterance.rate = (this.speed === 0.85 ? 0.78 : 0.94);

        utterance.onend = () => {
          if (this.lineIdx === idx && this.isPlaying) {
            if (stageEl) stageEl.innerHTML = renderCartoonSceneSvg(theme, line.speaker, false);
            this.timer = setTimeout(() => {
              this.playLine(idx + 1);
            }, 450);
          }
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {}
    }

    this.timer = setTimeout(() => {
      if (this.lineIdx === idx && this.isPlaying) {
        if (stageEl) stageEl.innerHTML = renderCartoonSceneSvg(theme, line.speaker, false);
        this.timer = setTimeout(() => {
          this.playLine(idx + 1);
        }, 400);
      }
    }, this.lineExpectedDuration + 300);
  },

  updateScrubber(ratio) {
    const progressEl = document.getElementById('vw-cv-progress');
    const handleEl = document.getElementById('vw-cv-scrubber-handle');
    const clamped = Math.max(0, Math.min(1, ratio));
    const pct = (clamped * 100) + '%';
    if (progressEl) progressEl.style.width = pct;
    if (handleEl) handleEl.style.left = pct;
  },

  updatePlayBtn() {
    const btn = document.getElementById('vw-cv-play-btn');
    if (!btn) return;
    if (this.isPlaying) {
      btn.innerHTML = '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
      btn.title = "Pause";
    } else {
      btn.innerHTML = '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
      btn.title = "Play";
    }
  },

  togglePlay() {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.updatePlayBtn();
      if (this.timer) { clearTimeout(this.timer); this.timer = null; }
      if (this.progressRaf) { cancelAnimationFrame(this.progressRaf); this.progressRaf = null; }
      if ('speechSynthesis' in window) {
        try { window.speechSynthesis.cancel(); } catch (e) {}
      }
      const stageEl = document.getElementById('vw-cv-stage');
      if (stageEl && this.conv) {
        stageEl.innerHTML = renderCartoonSceneSvg(this.conv.theme, 'Maya', false);
      }
    } else {
      if (this.lineIdx >= 4) this.lineIdx = 0;
      this.playLine(this.lineIdx);
    }
  },

  replay() {
    this.lineIdx = 0;
    this.playLine(0);
  },

  toggleSpeed() {
    this.speed = (this.speed === 1.0) ? 0.85 : 1.0;
    const btn = document.getElementById('vw-cv-speed-btn');
    if (btn) btn.textContent = this.speed + 'x';
    this.playLine(this.lineIdx);
  },

  handleScrubberClick(event) {
    const scrubber = document.getElementById('vw-cv-scrubber');
    if (!scrubber || !this.conv || !this.conv.lines) return;
    const rect = scrubber.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetLine = Math.min(this.conv.lines.length - 1, Math.floor(ratio * this.conv.lines.length));
    this.jumpToLine(targetLine);
  },

  jumpToLine(idx) {
    this.playLine(idx);
  },

  close() {
    this.isPlaying = false;
    this.isOpen = false;
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
    if (this.progressRaf) { cancelAnimationFrame(this.progressRaf); this.progressRaf = null; }
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
    const modal = document.getElementById('vw-cartoon-video-modal');
    if (modal) modal.classList.add('hidden');
  }
};
window.CartoonPlayer = CartoonPlayer;

function openCartoonVideoModal(wordId) {
  CartoonPlayer.open(wordId);
}

function closeCartoonVideoModal() {
  CartoonPlayer.close();
}


/* =====================================================================
   7. AUTO-INITIALIZATION HOOK
====================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    PronunciationEngine.init();
  loadPersistedState();
  WordImageLoader.init();
  ensureToastElement();
  updateTrackerDisplay();
});
