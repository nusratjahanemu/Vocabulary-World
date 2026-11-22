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

function speakDerivative(text, btnEl) {
  const cleanText = String(text || '').trim();
  if (!cleanText) return;
  if (typeof speakEnglish === 'function') {
    speakEnglish(cleanText, btnEl);
  } else if ('speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance(cleanText);
    u.lang = 'en-US';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }
}
if (typeof window !== 'undefined') {
  window.speakDerivative = speakDerivative;
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
  CUSTOM_WORDS: 'vw_custom_words_v1',
  FEEDBACKS: 'vw_user_feedbacks_v1',
  MY_VOCAB: 'vw_my_vocab_list',
  LAST_WARMUP_DATE: 'vw_last_warmup_date',
  AI_TUTOR_HISTORY: 'vw_ai_tutor_history',
  AI_TUTOR_API_KEY: 'vw_ai_tutor_api_key'
};
if (typeof window !== 'undefined') {
  window.STORAGE_KEYS = STORAGE_KEYS;
}

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
    if (!wordObj.derivatives) {
      if (typeof generateSafeDerivatives === 'function') {
        wordObj.derivatives = generateSafeDerivatives(wordObj);
      }
    }
    const targetLvl = (wordObj.level && CURRICULUM_DATA[wordObj.level]) ? wordObj.level : 'beginner';
    if (CURRICULUM_DATA[targetLvl] && Array.isArray(CURRICULUM_DATA[targetLvl].words)) {
      CURRICULUM_DATA[targetLvl].words.push(wordObj);
    }
  });
}

function generateSafeDerivatives(wordObj) {
  if (!wordObj || typeof wordObj !== 'object') {
    return { noun: null, verb: null, adjective: null, adverb: null };
  }
  if (wordObj.derivatives && typeof wordObj.derivatives === 'object') {
    const d = wordObj.derivatives;
    if (d.noun || d.verb || d.adjective || d.adverb) {
      return {
        noun: d.noun || null,
        verb: d.verb || null,
        adjective: d.adjective || null,
        adverb: d.adverb || null
      };
    }
  }

  // Check global CURRICULUM_DATA if present
  const cleanWord = String(wordObj.word || '').trim().toLowerCase();
  if (typeof CURRICULUM_DATA !== 'undefined' && CURRICULUM_DATA) {
    for (const lvlKey of ['beginner', 'intermediate', 'advanced', 'pro']) {
      const lvl = CURRICULUM_DATA[lvlKey];
      if (lvl && Array.isArray(lvl.words)) {
        const found = lvl.words.find(w => w && w.word && w.word.toLowerCase() === cleanWord);
        if (found && found.derivatives) return found.derivatives;
      }
      if (lvl && Array.isArray(lvl.practiceExtraWords)) {
        const found = lvl.practiceExtraWords.find(w => w && w.word && w.word.toLowerCase() === cleanWord);
        if (found && found.derivatives) return found.derivatives;
      }
    }
  }

  // Graceful fallback based on word's part of speech
  const word = String(wordObj.word || 'Word').trim();
  const capWord = word.charAt(0).toUpperCase() + word.slice(1);
  const pos = String(wordObj.pos || '').toLowerCase();
  const meaning = String(wordObj.meaningBn || wordObj.meaning || 'শব্দার্থ').trim();
  const exampleEn = String(wordObj.example || `The student practiced using "${capWord}" in context.`).trim();
  const exampleBn = String(wordObj.exampleBn || `শিক্ষার্থীটি প্রসঙ্গের সাথে "${capWord}" শব্দটি প্রয়োগ করেছিল।`).trim();

  const isNoun = pos.includes('noun');
  const isVerb = pos.includes('verb');
  const isAdj = pos.includes('adj');
  const isAdv = pos.includes('adv');

  const baseItem = {
    word: capWord,
    banglaPronunciation: `['${capWord}]`,
    pos: isVerb ? 'verb' : isAdj ? 'adjective' : isAdv ? 'adverb' : 'noun',
    banglaMeaning: meaning,
    exampleEn: exampleEn,
    exampleBn: exampleBn
  };

  return {
    noun: isNoun || (!isVerb && !isAdj && !isAdv) ? { ...baseItem, pos: 'noun' } : null,
    verb: isVerb ? { ...baseItem, pos: 'verb' } : null,
    adjective: isAdj ? { ...baseItem, pos: 'adjective' } : null,
    adverb: isAdv ? { ...baseItem, pos: 'adverb' } : null
  };
}
if (typeof window !== 'undefined') {
  window.generateSafeDerivatives = generateSafeDerivatives;
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

  // Attach Derivatives (Word Family) data safely
  entry.derivatives = generateSafeDerivatives(rawWord || entry);

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
  // Automatic "My Vocab List" daily tracking on Listen / Explore / Video
  if (typeof addToMyVocabList === 'function' && !isInMyVocabList(wordId)) {
    try {
      addToMyVocabList(wordId, false);
    } catch (e) {}
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

function toggleMobileDotsMenu(forceState) {
  const sheet = document.getElementById('vw-mobile-dots-sheet');
  const backdrop = document.getElementById('vw-mobile-dots-backdrop');
  if (!sheet) return;

  const isHidden = sheet.classList.contains('hidden');
  const shouldOpen = typeof forceState === 'boolean' ? forceState : isHidden;

  if (shouldOpen) {
    const isInstalled = (typeof isPWAInstalled === 'function') ? isPWAInstalled() : false;
    const installRow = document.getElementById('vw-dots-install-row') || document.getElementById('vw-dots-install-pill');
    if (installRow) {
      if (isInstalled) {
        installRow.classList.add('hidden');
      } else {
        installRow.classList.remove('hidden');
      }
    }

    const indicator = document.getElementById('vw-mobile-dots-indicator');
    if (indicator) {
      if (isInstalled) {
        indicator.classList.add('hidden');
      } else {
        indicator.classList.remove('hidden');
      }
    }

    const vocabCountEl = document.getElementById('vw-dots-my-vocab-count');
    if (vocabCountEl && typeof getMyVocabList === 'function') {
      const count = getMyVocabList().length;
      vocabCountEl.textContent = `${count} words`;
    }

    if (backdrop) backdrop.classList.remove('hidden');
    sheet.classList.remove('hidden');
    void sheet.offsetWidth;
    sheet.classList.add('is-open');
    sheet.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
    sheet.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
  } else {
    sheet.classList.remove('is-open', 'opacity-100', 'scale-100', 'pointer-events-auto');
    sheet.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
    if (backdrop) backdrop.classList.add('hidden');
    setTimeout(() => {
      sheet.classList.add('hidden');
    }, 200);
  }
}


// Close mobile 3-dots sheet when clicking outside
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const sheet = document.getElementById('vw-mobile-dots-sheet');
    const dotsBtn = document.getElementById('vw-mobile-dots-btn');
    if (!sheet || sheet.classList.contains('hidden')) return;
    if (dotsBtn && dotsBtn.contains(e.target)) return;
    if (sheet.contains(e.target)) return;
    toggleMobileDotsMenu(false);
  });
}

function toggleMobileNavMenu(forceState) {
  toggleMobileDotsMenu(forceState);
}

function openMyVocabList() {
  if (typeof toggleMobileDotsMenu === 'function') {
    toggleMobileDotsMenu(false);
  }
  const path = (window.location.pathname || '').toLowerCase();
  const file = path.split('/').pop().split('\\').pop() || '';
  if (file === 'learn.html') {
    if (typeof setFilterTab === 'function') {
      setFilterTab('my-vocab');
      return;
    }
  }
  window.location.href = 'learn.html?tab=my-vocab';
}

function cycleNextAccent() {
  const order = ['US', 'UK', 'AU', 'CA'];
  const cur = (typeof getActiveAccent === 'function') ? getActiveAccent().id : 'US';
  const nextIdx = (order.indexOf(cur) + 1) % order.length;
  const nextAccentId = order[nextIdx];
  if (typeof setActiveAccent === 'function') {
    setActiveAccent(nextAccentId);
  }
  const acc = (typeof ACCENT_CONFIG !== 'undefined' && ACCENT_CONFIG[nextAccentId]) ? ACCENT_CONFIG[nextAccentId] : null;
  if (acc) {
    const flagEl = document.getElementById('vw-dots-accent-flag');
    const badgeEl = document.getElementById('vw-dots-accent-badge');
    const topBadge = document.getElementById('vw-navbar-accent-badge');
    const mobileTag = document.getElementById('vw-mobile-accent-tag');
    if (flagEl) flagEl.textContent = acc.flag;
    if (badgeEl) badgeEl.textContent = acc.shortLabel;
    if (topBadge) topBadge.textContent = acc.shortLabel;
    if (mobileTag) mobileTag.textContent = acc.shortLabel;
    if (typeof showToast === 'function') {
      showToast(`🌐 Pronunciation accent: ${acc.name} (${acc.shortLabel})`, 'info');
    }
  }
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

  const dotsThemeLabel = document.getElementById('vw-dots-theme-label');
  if (dotsThemeLabel) {
    dotsThemeLabel.textContent = newTheme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️';
  }
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

  // Helper 3b: Feedback Navigation Button (For Inner Pages)
  const feedbackNavBtnHTML = `
    <button
      type="button"
      id="vw-feedback-nav-btn"
      onclick="openFeedbackModal()"
      class="vw-feedback-nav-btn"
      title="Share Feedback &bull; আপনার মতামত বা পরামর্শ দিন"
      aria-label="Give feedback"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </button>
  `;

  // Helper 3c: PWA Install App Button
  const pwaInstallBtnHTML = `
    <button
      type="button"
      id="vw-pwa-install-btn"
      onclick="triggerPWAInstall()"
      class="vw-pwa-install-btn hidden items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs"
      title="Install Vocabulary World App on your device &bull; অ্যাপ ইনস্টল করুন"
      aria-label="Install App"
    >
      <span class="text-xs">📲</span>
      <span>Install App</span>
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
            <div>
              <span class="font-editorial text-lg font-bold block leading-none" style="color: var(--ink-primary);">
                Vocabulary World
              </span>
              <span class="font-bengali text-[10px] block mt-0.5" style="color: var(--ink-muted);">
                বাংলা-ইংরেজি শব্দভান্ডার
              </span>
            </div>
          </a>

          <!-- 2. RIGHT: Header Controls (Clean & Intact on Desktop & Mobile, NO 3-Dots Menu) -->
          <div class="flex items-center gap-2 sm:gap-3 shrink-0">
            ${pwaInstallBtnHTML}
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

  const pageMetaMap = {
    home: { label: 'Levels', emoji: '🏛️' },
    learn: { label: 'Learn', emoji: '📖' },
    flashcards: { label: '3D Flashcards', emoji: '🗂️' },
    games: { label: 'Games', emoji: '🎮' },
    tracker: { label: 'Tracker', emoji: '📊' },
    'add-words': { label: '+ Add Words', emoji: '➕' },
    assessment: { label: 'Assessment', emoji: '🎯' }
  };
  const activeMeta = pageMetaMap[activePage] || { label: 'Learn', emoji: '📖' };
  const isInstalled = (typeof isPWAInstalled === 'function') ? isPWAInstalled() : false;
  const myVocabCount = (typeof getMyVocabList === 'function') ? getMyVocabList().length : 0;

  const navLinks = [
    {
      id: 'learn',
      label: 'Learn',
      emoji: '📖',
      href: 'learn.html',
      icon: `<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`
    },
    {
      id: 'flashcards',
      label: '3D Flashcards',
      emoji: '🗂️',
      href: 'flashcards.html',
      icon: `<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="14" rx="2"/><path d="M6 3h12a2 2 0 0 1 2 2v12"/></svg>`
    },
    {
      id: 'games',
      label: 'Games',
      emoji: '🎮',
      href: 'games.html',
      icon: `<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="4"/><path d="M6 12h4m-2-2v4m7-2h.01m3 0h.01"/></svg>`
    },
    {
      id: 'tracker',
      label: 'Tracker',
      emoji: '📊',
      href: 'tracker.html',
      icon: `<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>`
    },
    {
      id: 'add-words',
      label: '+ Add Words',
      emoji: '➕',
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
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <!-- 1. LEFT: Brand Logo & Title on Desktop / Logo + Active Page Pill + Accent on Mobile -->
        <div class="flex items-center gap-2 sm:gap-2.5 shrink-0 min-w-0">
          <a href="index.html" class="flex items-center gap-2 shrink-0 group focus:outline-none" title="Vocabulary World Home">
            <div
              class="w-9 h-9 rounded-xl flex items-center justify-center font-editorial font-bold text-lg text-white shadow-xs shrink-0 transition-transform group-hover:scale-105"
              style="background-color: var(--accent-sage);"
            >
              V
            </div>
            <div class="hidden md:block">
              <span class="font-editorial text-lg font-bold block leading-none" style="color: var(--ink-primary);">
                Vocabulary World
              </span>
              <span class="font-bengali text-[10px] block mt-0.5" style="color: var(--ink-muted);">
                বাংলা-ইংরেজি শব্দভান্ডার
              </span>
            </div>
          </a>

          <!-- Mobile Active Page Pill Badge & Accent Tag (< md) -->
          <div class="flex md:hidden items-center gap-1.5 min-w-0">
            <span class="vw-mobile-page-pill">
              <span>${activeMeta.emoji}</span>
              <span class="truncate max-w-[110px]">${activeMeta.label}</span>
            </span>
            <span id="vw-mobile-accent-tag" class="vw-mobile-accent-tag">
              ${activeAccent.shortLabel}
            </span>
          </div>
        </div>

        <!-- 2. CENTER: Desktop Horizontal Sliding Pill Navigation (>= md) -->
        <nav
          id="vw-top-nav"
          class="vw-top-nav relative hidden md:inline-flex items-center"
          aria-label="Main navigation"
        >
          <!-- Floating Background Horizontal Sliding Pill -->
          <div id="vw-top-sliding-pill" class="vw-top-sliding-pill" aria-hidden="true"></div>

          <!-- 5 Single-Line Horizontal Menu Items (Icon + English Title Only) -->
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

        <!-- 3. RIGHT: Desktop Controls (>= md) -->
        <div class="vw-desktop-controls hidden md:flex items-center gap-1.5 sm:gap-2.5 shrink-0">
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
              <span>Level: ${levelTitle}</span>
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

              <!-- Return to Level Selection Gateway Option -->
              <div class="pt-1 mt-1 border-t" style="border-color: var(--border-subtle);">
                <a
                  href="index.html"
                  class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors hover:bg-black/5"
                  style="color: var(--accent-sage);"
                  title="Return to Level Selection Screen &bull; লেভেল নির্বাচন পেজ"
                >
                  <div class="flex items-center gap-2">
                    <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
                    <span>All Levels</span>
                  </div>
                  <span class="font-bengali text-[10px] font-semibold">&larr; সকল লেভেল</span>
                </a>
              </div>
            </div>
          </div>

          ${pwaInstallBtnHTML}
          ${feedbackNavBtnHTML}
          ${themeToggleBtnHTML}
          ${countrySelectorHTML}
          ${authBtnHTML}
        </div>

        <!-- 4. RIGHT: Mobile Chrome-Style 3-Dots (⋮) Menu Button (< md) -->
        <div class="flex md:hidden items-center gap-2 shrink-0">
          <button
            type="button"
            id="vw-mobile-dots-btn"
            onclick="toggleMobileDotsMenu()"
            aria-label="Open menu"
            class="vw-mobile-dots-btn"
            title="Open menu &bull; মেন্যু খুলুন"
          >
            <span id="vw-mobile-dots-indicator" class="vw-mobile-dots-indicator ${isInstalled ? 'hidden' : ''}"></span>
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="2"/>
              <circle cx="12" cy="12" r="2"/>
              <circle cx="12" cy="19" r="2"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Backdrop for mobile 3-dots sheet -->
      <div
        id="vw-mobile-dots-backdrop"
        class="vw-mobile-dots-backdrop fixed inset-0 z-40 bg-black/25 backdrop-blur-xs hidden transition-opacity"
        onclick="toggleMobileDotsMenu(false)"
      ></div>

      <!-- Sleek Chrome-Style 3-Dots Dropdown Sheet (< md) -->
      <div
        id="vw-mobile-dots-sheet"
        class="vw-mobile-dots-sheet fixed top-16 right-3 sm:right-6 w-[calc(100vw-24px)] max-w-[340px] rounded-3xl border p-4 z-50 hidden opacity-0 scale-95 pointer-events-none transition-all duration-200"
      >
        <!-- 5 Main Navigation Features -->
        <div class="space-y-1 mb-2">
          ${navLinks
            .map((item) => {
              const isActive = activePage === item.id;
              return `
                <a
                  href="${item.href}"
                  data-page="${item.id}"
                  onclick="toggleMobileDotsMenu(false)"
                  class="vw-dots-nav-item ${isActive ? 'active' : ''} flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all"
                >
                  <div class="flex items-center gap-3">
                    <span class="text-base">${item.emoji}</span>
                    <span class="text-xs sm:text-sm ${isActive ? 'font-bold' : 'font-medium'}">${item.label}</span>
                  </div>
                  ${isActive ? '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full" style="background-color: var(--surface-white); color: var(--accent-sage);">Active</span>' : ''}
                </a>
              `;
            })
            .join('')}
        </div>

        <!-- Clean Horizontal Divider Line -->
        <div class="border-t my-2" style="border-color: var(--border-subtle);"></div>

        <!-- All Right-Side Header Utility Controls -->
        <div class="space-y-1">
          <!-- 🌐 Accent Switcher (cycles US / UK / AU / CA) -->
          <button
            type="button"
            onclick="cycleNextAccent()"
            class="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer text-left"
          >
            <div class="flex items-center gap-3">
              <span class="text-base">🌐</span>
              <div>
                <span class="text-xs sm:text-sm font-bold block" style="color: var(--ink-primary);">Accent Switcher</span>
                <span class="text-[10px] text-gray-500 font-bengali">অ্যাকসেন্ট পরিবর্তন (${activeAccent.name})</span>
              </div>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <span id="vw-dots-accent-flag" class="text-base">${activeAccent.flag}</span>
              <span id="vw-dots-accent-badge" class="vw-navbar-accent-badge">${activeAccent.shortLabel}</span>
              <span class="text-[10px] text-gray-400">&circlearrowright;</span>
            </div>
          </button>

          <!-- 🌗 Theme Toggle (Light / Dark Mode) -->
          <button
            type="button"
            onclick="toggleTheme()"
            class="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer text-left"
          >
            <div class="flex items-center gap-3">
              <span class="text-base">🌗</span>
              <div>
                <span class="text-xs sm:text-sm font-bold block" style="color: var(--ink-primary);">Theme</span>
                <span class="text-[10px] text-gray-500 font-bengali">লাইট / ডার্ক মোড</span>
              </div>
            </div>
            <span id="vw-dots-theme-label" class="text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0" style="background-color: var(--surface-sand); color: var(--ink-secondary);">
              ${isDark ? 'Dark Mode 🌙' : 'Light Mode ☀️'}
            </span>
          </button>

          <!-- ⭐ My Vocab List (shows saved words count from getMyVocabList().length) -->
          <button
            type="button"
            onclick="openMyVocabList()"
            class="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer text-left"
          >
            <div class="flex items-center gap-3">
              <span class="text-base">⭐</span>
              <div>
                <span class="text-xs sm:text-sm font-bold block" style="color: var(--ink-primary);">My Vocab List</span>
                <span class="text-[10px] text-gray-500 font-bengali">সংরক্ষিত শব্দ তালিকা</span>
              </div>
            </div>
            <span id="vw-dots-my-vocab-count" class="text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0" style="background-color: var(--accent-sage-soft); color: var(--accent-sage);">
              ${myVocabCount} words
            </span>
          </button>

          <!-- 📲 Install App (rendered only when not yet installed as Android PWA) -->
          <div id="vw-dots-install-row" class="${isInstalled ? 'hidden' : ''}">
            <button
              type="button"
              onclick="triggerPWAInstall(); toggleMobileDotsMenu(false);"
              class="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl transition-all cursor-pointer text-left"
              style="background-color: var(--accent-sage-soft); color: var(--accent-sage);"
            >
              <div class="flex items-center gap-3">
                <span class="text-base">📲</span>
                <div>
                  <span class="text-xs sm:text-sm font-bold block">Install App</span>
                  <span class="text-[10px] text-gray-600 dark:text-gray-300 font-bengali">অ্যান্ড্রয়েড অ্যাপ ইনস্টল</span>
                </div>
              </div>
              <span class="vw-btn-primary px-3 py-1 rounded-xl text-[11px] font-bold shadow-xs whitespace-nowrap">
                Install
              </span>
            </button>
          </div>
        </div>

        <!-- Clean Divider Line & Level Gateway Link -->
        <div class="border-t my-2" style="border-color: var(--border-subtle);"></div>
        <div class="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onclick="openFeedbackModal(); toggleMobileDotsMenu(false);"
            class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold hover:bg-black/5 transition-all cursor-pointer"
            style="border-color: var(--border-subtle); color: var(--ink-secondary);"
          >
            <span>💬 Feedback</span>
          </button>
          <a
            href="index.html"
            onclick="toggleMobileDotsMenu(false)"
            class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold hover:bg-black/5 transition-all cursor-pointer"
            style="border-color: var(--border-subtle); color: var(--accent-sage);"
          >
            <span>🏛️ Level: ${levelTitle}</span>
          </a>
        </div>
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
    const hasPrevTab = items.some((it) => it.dataset.page === prevPage);
    if (!hasPrevTab || prevPage === 'home') {
      prevLeft = null;
      prevWidth = null;
      try {
        sessionStorage.removeItem(TOP_NAV_LEFT_KEY);
        sessionStorage.removeItem(TOP_NAV_WIDTH_KEY);
        sessionStorage.removeItem(TOP_NAV_PAGE_KEY);
      } catch (e) {}
    } else {
      if (rawLeft !== null) prevLeft = parseFloat(rawLeft);
      if (rawWidth !== null) prevWidth = parseFloat(rawWidth);
    }
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
        <div class="flex items-center gap-4 text-xs font-semibold flex-wrap">
          ${
            showNavLinks
              ? `
            <a href="learn.html" class="hover:underline">Learn</a>
            <a href="flashcards.html" class="hover:underline">Flashcards</a>
            <a href="games.html" class="hover:underline">Games</a>
            <a href="tracker.html" class="hover:underline">Tracker</a>
            <a href="add-words.html" class="hover:underline text-[#2D5A4C] font-bold">+ Add Words</a>
          `
              : ''
          }
          <button
            type="button"
            onclick="openFeedbackModal()"
            class="hover:underline font-semibold flex items-center gap-1 transition-colors"
            style="color: var(--accent-sage);"
            title="Share Feedback &bull; আপনার মতামত বা পরামর্শ দিন"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>Feedback &bull; মতামত</span>
          </button>
        </div>
      </div>
    </footer>
  `;
}

if (typeof window !== 'undefined') {
  window.renderAppHeader = renderAppHeader;
  window.renderAppFooter = renderAppFooter;
}

function ensureToastElement() {
  if (typeof document === 'undefined') return;
  let toastDiv = document.getElementById('vw-toast');
  if (toastDiv) {
    toastDiv.className = 'hidden fixed bottom-20 right-5 z-50 max-w-sm items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg';
    return;
  }
  toastDiv = document.createElement('div');
  toastDiv.id = 'vw-toast';
  toastDiv.setAttribute('role', 'status');
  toastDiv.setAttribute('aria-live', 'polite');
  toastDiv.className = 'hidden fixed bottom-20 right-5 z-50 max-w-sm items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg';
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

// scratch/cartoon_engine_full.js
// Complete implementation of upgraded Cartoon Engine for Vocabulary World

function escapeRegex(string) {
  return String(string).replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}

function highlightTargetWordInSubtitle(text, targetWord) {
  if (!text) return '';
  if (!targetWord) return escapeHtml(text);
  const regex = new RegExp('(\\b' + escapeRegex(targetWord) + '[a-z]*\\b)', 'gi');
  return escapeHtml(text).replace(regex, '<span class="vw-sub-highlight">$1</span>');
}

const SCENE_ENVIRONMENTS = {
  living_room: {
    id: 'living_room',
    nameEn: 'Living Room',
    nameBn: 'বসার ঘর',
    icon: '🏠',
    label: '🏠 Living Room • বসার ঘর',
    renderSvg() {
      return `
        <linearGradient id="lrWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#C3D0C7"/>
          <stop offset="100%" stop-color="#B5C5BA"/>
        </linearGradient>
        <rect width="800" height="450" fill="url(#lrWall)"/>
        <rect x="0" y="0" width="800" height="10" fill="#EAE5DC"/>
        <rect x="0" y="340" width="800" height="8" fill="#DDD6CA"/>
        <rect x="0" y="348" width="800" height="102" fill="#EDE8DF"/>
        <line x1="0" y1="375" x2="800" y2="375" stroke="#DFD7CB" stroke-width="1.5"/>
        <line x1="0" y1="410" x2="800" y2="410" stroke="#DFD7CB" stroke-width="1.5"/>
        <ellipse cx="400" cy="390" rx="310" ry="46" fill="#45414C"/>
        <ellipse cx="400" cy="390" rx="290" ry="40" fill="none" stroke="#5E5966" stroke-width="2" stroke-dasharray="6,4"/>
        <rect x="40" y="60" width="110" height="140" rx="4" fill="#FAF8F5" stroke="#2D5A4C" stroke-width="6"/>
        <rect x="48" y="68" width="94" height="124" fill="#F0EFEA"/>
        <path d="M 95 160 C 95 120 70 100 70 85 C 85 85 105 105 105 125 C 105 100 120 88 125 95 C 120 115 100 135 95 160 Z" fill="#2D5A4C" opacity="0.85"/>
        <line x1="95" y1="160" x2="95" y2="95" stroke="#FAF8F5" stroke-width="1.5"/>
        <rect x="200" y="45" width="230" height="300" rx="4" fill="#FAF8F5"/>
        <rect x="212" y="55" width="206" height="290" fill="#E2EBE5"/>
        <rect x="212" y="300" width="206" height="45" fill="#D4DFD8"/>
        <rect x="225" y="210" width="165" height="75" rx="10" fill="#64748B"/>
        <rect x="220" y="240" width="175" height="35" rx="8" fill="#475569"/>
        <rect x="240" y="220" width="38" height="32" rx="4" fill="#F59E0B"/>
        <line x1="248" y1="220" x2="248" y2="252" stroke="#FFFFFF" stroke-width="3"/>
        <line x1="262" y1="220" x2="262" y2="252" stroke="#FFFFFF" stroke-width="3"/>
        <line x1="385" y1="120" x2="385" y2="275" stroke="#94A3B8" stroke-width="3"/>
        <path d="M 370 120 L 400 120 L 410 145 L 360 145 Z" fill="#CBD5E1"/>
        <circle cx="385" cy="148" r="7" fill="#FEF08A"/>
        <polygon points="360,145 410,145 425,275 345,275" fill="#FEF08A" opacity="0.12"/>
        <rect x="640" y="190" width="130" height="155" rx="4" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="3"/>
        <rect x="648" y="200" width="114" height="40" rx="3" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5"/>
        <circle cx="705" cy="220" r="4.5" fill="#F59E0B"/>
        <rect x="648" y="248" width="114" height="40" rx="3" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5"/>
        <circle cx="705" cy="268" r="4.5" fill="#F59E0B"/>
        <rect x="648" y="296" width="114" height="40" rx="3" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5"/>
        <circle cx="705" cy="316" r="4.5" fill="#F59E0B"/>
        <rect x="652" y="345" width="8" height="12" fill="#CBD5E1"/>
        <rect x="750" y="345" width="8" height="12" fill="#CBD5E1"/>
        <path d="M 695 190 Q 685 165 700 155 Q 715 165 705 190 Z" fill="#2D5A4C"/>
        <circle cx="700" cy="125" r="14" fill="#F59E0B"/>
        <circle cx="700" cy="125" r="7" fill="#78350F"/>
        <circle cx="682" cy="138" r="10" fill="#FBBF24"/>
        <circle cx="682" cy="138" r="5" fill="#78350F"/>
        <circle cx="718" cy="136" r="11" fill="#FBBF24"/>
        <circle cx="718" cy="136" r="5.5" fill="#78350F"/>
        <path d="M 700 150 Q 675 145 675 160" stroke="#15803D" stroke-width="3" fill="none"/>
        <path d="M 705 150 Q 725 145 725 160" stroke="#15803D" stroke-width="3" fill="none"/>
      `;
    }
  },

  fruit_shop: {
    id: 'fruit_shop',
    nameEn: 'Fruit Shop',
    nameBn: 'ফলের দোকান',
    icon: '🍎',
    label: '🍎 Fruit Shop • ফলের দোকান',
    renderSvg() {
      return `
        <linearGradient id="fsSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#E0F2FE"/>
          <stop offset="100%" stop-color="#F1F5F9"/>
        </linearGradient>
        <rect width="800" height="450" fill="url(#fsSky)"/>
        <rect x="0" y="70" width="800" height="270" fill="#D8C7B5"/>
        <line x1="0" y1="130" x2="800" y2="130" stroke="#C2B09D" stroke-width="2"/>
        <line x1="0" y1="190" x2="800" y2="190" stroke="#C2B09D" stroke-width="2"/>
        <line x1="0" y1="250" x2="800" y2="250" stroke="#C2B09D" stroke-width="2"/>
        <line x1="0" y1="310" x2="800" y2="310" stroke="#C2B09D" stroke-width="2"/>
        <rect x="50" y="115" width="220" height="12" fill="#854D0E"/>
        <rect x="65" y="85" width="24" height="30" rx="3" fill="#FEF08A" opacity="0.8"/>
        <rect x="95" y="80" width="28" height="35" rx="3" fill="#FED7AA" opacity="0.8"/>
        <rect x="130" y="88" width="22" height="27" rx="3" fill="#BBF7D0" opacity="0.8"/>
        <rect x="0" y="340" width="800" height="110" fill="#E2D9CC"/>
        <ellipse cx="200" cy="380" rx="45" ry="12" fill="#D3C7B5" opacity="0.6"/>
        <ellipse cx="360" cy="400" rx="55" ry="14" fill="#D3C7B5" opacity="0.6"/>
        <ellipse cx="580" cy="375" rx="50" ry="13" fill="#D3C7B5" opacity="0.6"/>
        <ellipse cx="700" cy="410" rx="40" ry="11" fill="#D3C7B5" opacity="0.6"/>
        <line x1="400" y1="65" x2="400" y2="130" stroke="#78350F" stroke-width="3"/>
        <line x1="360" y1="130" x2="440" y2="130" stroke="#B45309" stroke-width="4"/>
        <circle cx="400" cy="130" r="5" fill="#D97706"/>
        <line x1="360" y1="130" x2="345" y2="175" stroke="#D97706" stroke-width="1.5"/>
        <line x1="360" y1="130" x2="375" y2="175" stroke="#D97706" stroke-width="1.5"/>
        <path d="M 340 175 Q 360 190 380 175 Z" fill="#F59E0B"/>
        <line x1="440" y1="130" x2="425" y2="170" stroke="#D97706" stroke-width="1.5"/>
        <line x1="440" y1="130" x2="455" y2="170" stroke="#D97706" stroke-width="1.5"/>
        <path d="M 420 170 Q 440 185 460 170 Z" fill="#F59E0B"/>
        <circle cx="440" cy="166" r="6" fill="#EF4444"/>
        <rect x="20" y="270" width="130" height="75" rx="4" fill="#854D0E" stroke="#5C330A" stroke-width="2"/>
        <rect x="25" y="255" width="120" height="25" rx="3" fill="#B45309"/>
        <circle cx="40" cy="255" r="9" fill="#EF4444"/>
        <circle cx="56" cy="252" r="9.5" fill="#DC2626"/>
        <circle cx="72" cy="255" r="9" fill="#EF4444"/>
        <circle cx="88" cy="252" r="9.5" fill="#DC2626"/>
        <circle cx="104" cy="255" r="9" fill="#EF4444"/>
        <circle cx="120" cy="252" r="9.5" fill="#DC2626"/>
        <circle cx="48" cy="242" r="8.5" fill="#EF4444"/>
        <circle cx="64" cy="240" r="9" fill="#DC2626"/>
        <circle cx="80" cy="241" r="8.5" fill="#EF4444"/>
        <circle cx="96" cy="240" r="9" fill="#DC2626"/>
        <circle cx="112" cy="242" r="8.5" fill="#EF4444"/>
        <rect x="45" y="295" width="75" height="24" rx="3" fill="#1E293B"/>
        <text x="82" y="311" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="bold" fill="#FDE68A" text-anchor="middle">$2 / kg</text>
        <rect x="650" y="270" width="130" height="75" rx="4" fill="#854D0E" stroke="#5C330A" stroke-width="2"/>
        <rect x="655" y="255" width="120" height="25" rx="3" fill="#B45309"/>
        <ellipse cx="675" cy="252" rx="10" ry="13" fill="#F59E0B" transform="rotate(-15 675 252)"/>
        <ellipse cx="695" cy="250" rx="10" ry="13" fill="#FBBF24" transform="rotate(10 695 250)"/>
        <ellipse cx="715" cy="252" rx="10" ry="13" fill="#F59E0B" transform="rotate(-20 715 252)"/>
        <ellipse cx="735" cy="250" rx="10" ry="13" fill="#FBBF24" transform="rotate(15 735 250)"/>
        <ellipse cx="755" cy="252" rx="9" ry="12" fill="#F59E0B"/>
        <ellipse cx="685" cy="240" rx="9" ry="12" fill="#F59E0B"/>
        <ellipse cx="705" cy="238" rx="9.5" ry="12.5" fill="#FBBF24"/>
        <ellipse cx="725" cy="239" rx="9" ry="12" fill="#F59E0B"/>
        <ellipse cx="745" cy="240" rx="9" ry="12" fill="#FBBF24"/>
        <rect x="675" y="295" width="80" height="24" rx="3" fill="#1E293B"/>
        <text x="715" y="311" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="bold" fill="#A7F3D0" text-anchor="middle">FRESH</text>
        <defs>
          <pattern id="awningStripes" width="50" height="75" patternUnits="userSpaceOnUse">
            <rect width="25" height="75" fill="#2D5A4C"/>
            <rect x="25" width="25" height="75" fill="#FAF8F5"/>
          </pattern>
        </defs>
        <path d="M 0 0 L 800 0 L 800 60 Q 775 75 750 60 Q 725 75 700 60 Q 675 75 650 60 Q 625 75 600 60 Q 575 75 550 60 Q 525 75 500 60 Q 475 75 450 60 Q 425 75 400 60 Q 375 75 350 60 Q 325 75 300 60 Q 275 75 250 60 Q 225 75 200 60 Q 175 75 150 60 Q 125 75 100 60 Q 75 75 50 60 Q 25 75 0 60 Z" fill="url(#awningStripes)"/>
        <line x1="0" y1="60" x2="800" y2="60" stroke="#1E3A31" stroke-width="2"/>
      `;
    }
  },

  shopping_market: {
    id: 'shopping_market',
    nameEn: 'Shopping Market',
    nameBn: 'মার্কেট / শপিং মল',
    icon: '🛍️',
    label: '🛍️ Shopping Market • মার্কেট',
    renderSvg() {
      return `
        <linearGradient id="mallSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#E0E7FF"/>
          <stop offset="60%" stop-color="#F1F5F9"/>
          <stop offset="100%" stop-color="#E2E8F0"/>
        </linearGradient>
        <rect width="800" height="450" fill="url(#mallSky)"/>
        <rect x="60" y="50" width="680" height="280" rx="12" fill="#FFFFFF" opacity="0.6"/>
        <path d="M 120 50 L 80 330 L 160 330 L 200 50 Z" fill="#FFFFFF" opacity="0.25"/>
        <path d="M 380 50 L 330 330 L 410 330 L 460 50 Z" fill="#FFFFFF" opacity="0.2"/>
        <path d="M 600 50 L 560 330 L 630 330 L 670 50 Z" fill="#FFFFFF" opacity="0.25"/>
        <rect x="60" y="50" width="680" height="280" rx="12" fill="none" stroke="#CBD5E1" stroke-width="4"/>
        <line x1="180" y1="0" x2="180" y2="70" stroke="#64748B" stroke-width="2"/>
        <path d="M 165 70 L 195 70 L 202 85 L 158 85 Z" fill="#D97706"/>
        <circle cx="180" cy="88" r="9" fill="#FEF08A"/>
        <polygon points="158,85 202,85 250,260 110,260" fill="#FEF08A" opacity="0.15"/>
        <line x1="620" y1="0" x2="620" y2="70" stroke="#64748B" stroke-width="2"/>
        <path d="M 605 70 L 635 70 L 642 85 L 598 85 Z" fill="#D97706"/>
        <circle cx="620" cy="88" r="9" fill="#FEF08A"/>
        <polygon points="598,85 642,85 690,260 550,260" fill="#FEF08A" opacity="0.15"/>
        <rect x="25" y="150" width="110" height="180" rx="6" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2"/>
        <line x1="35" y1="170" x2="125" y2="170" stroke="#475569" stroke-width="3"/>
        <rect x="42" y="175" width="22" height="70" rx="4" fill="#2D5A4C"/>
        <rect x="70" y="175" width="22" height="65" rx="4" fill="#C26D53"/>
        <rect x="98" y="175" width="20" height="75" rx="4" fill="#3B82F6"/>
        <rect x="35" y="270" width="88" height="28" rx="6" fill="#EF4444"/>
        <text x="79" y="289" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="900" fill="#FFFFFF" text-anchor="middle">SALE 50%</text>
        <rect x="665" y="150" width="110" height="180" rx="6" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2"/>
        <ellipse cx="720" cy="180" rx="14" ry="12" fill="#E2E8F0"/>
        <path d="M 708 190 L 732 190 L 740 255 L 700 255 Z" fill="#8B5CF6"/>
        <line x1="720" y1="255" x2="720" y2="310" stroke="#475569" stroke-width="4"/>
        <rect x="705" y="310" width="30" height="8" rx="3" fill="#475569"/>
        <circle cx="755" cy="165" r="18" fill="#F59E0B"/>
        <text x="755" y="170" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">$25</text>
        <rect x="0" y="340" width="800" height="110" fill="#F1F5F9"/>
        <line x1="0" y1="380" x2="800" y2="380" stroke="#E2E8F0" stroke-width="2"/>
        <line x1="0" y1="420" x2="800" y2="420" stroke="#E2E8F0" stroke-width="2"/>
        <rect x="670" y="360" width="36" height="42" rx="4" fill="#FDE68A" stroke="#F59E0B" stroke-width="1.5"/>
        <path d="M 680 360 Q 688 348 696 360" stroke="#B45309" stroke-width="2" fill="none"/>
        <rect x="715" y="368" width="32" height="36" rx="4" fill="#A7F3D0" stroke="#10B981" stroke-width="1.5"/>
        <path d="M 724 368 Q 731 356 738 368" stroke="#047857" stroke-width="2" fill="none"/>
      `;
    }
  },

  school_classroom: {
    id: 'school_classroom',
    nameEn: 'School Classroom',
    nameBn: 'স্কুল / ক্লাসরুম',
    icon: '🏫',
    label: '🏫 School Classroom • ক্লাসরুম',
    renderSvg() {
      return `
        <linearGradient id="classWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FEF3C7"/>
          <stop offset="100%" stop-color="#FDE68A"/>
        </linearGradient>
        <rect width="800" height="450" fill="url(#classWall)"/>
        <rect x="0" y="340" width="800" height="110" fill="#DEB887"/>
        <line x1="0" y1="375" x2="800" y2="375" stroke="#C29B68" stroke-width="2"/>
        <line x1="0" y1="410" x2="800" y2="410" stroke="#C29B68" stroke-width="2"/>
        <rect x="180" y="45" width="440" height="240" rx="8" fill="#854D0E" stroke="#5C330A" stroke-width="5"/>
        <rect x="195" y="58" width="410" height="214" rx="4" fill="#1E3A31"/>
        <rect x="230" y="272" width="340" height="8" rx="2" fill="#B45309"/>
        <rect x="250" y="268" width="18" height="5" rx="1" fill="#FFFFFF"/>
        <rect x="275" y="268" width="18" height="5" rx="1" fill="#FEF08A"/>
        <rect x="300" y="266" width="30" height="7" rx="2" fill="#64748B"/>
        <text x="400" y="95" font-family="'Plus Jakarta Sans', monospace" font-size="16" font-weight="bold" fill="#A7F3D0" text-anchor="middle">A² + B² = C² &bull; GRAMMAR LAB</text>
        <line x1="240" y1="110" x2="560" y2="110" stroke="#2D5A4C" stroke-width="2"/>
        <text x="400" y="145" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Noun  &rarr;  Verb  &rarr;  Adjective</text>
        <text x="400" y="175" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#FDE68A" text-anchor="middle">Master Derivatives &bull; Word Family</text>
        <text x="400" y="215" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#E2E8F0" text-anchor="middle">&ldquo;Practice makes perfect every day.&rdquo;</text>
        <circle cx="680" cy="50" r="26" fill="#FFFFFF" stroke="#475569" stroke-width="3"/>
        <circle cx="680" cy="50" r="2.5" fill="#1E293B"/>
        <line x1="680" y1="50" x2="670" y2="38" stroke="#1E293B" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="680" y1="50" x2="695" y2="50" stroke="#1E293B" stroke-width="2" stroke-linecap="round"/>
        <line x1="680" y1="50" x2="680" y2="66" stroke="#EF4444" stroke-width="1.5" stroke-linecap="round"/>
        <rect x="25" y="80" width="125" height="255" rx="4" fill="#854D0E" stroke="#5C330A" stroke-width="3"/>
        <line x1="25" y1="165" x2="150" y2="165" stroke="#5C330A" stroke-width="4"/>
        <line x1="25" y1="245" x2="150" y2="245" stroke="#5C330A" stroke-width="4"/>
        <rect x="35" y="105" width="18" height="60" rx="2" fill="#EF4444"/>
        <rect x="55" y="95" width="22" height="70" rx="2" fill="#3B82F6"/>
        <rect x="80" y="100" width="20" height="65" rx="2" fill="#10B981"/>
        <rect x="103" y="110" width="25" height="55" rx="2" fill="#F59E0B"/>
        <rect x="35" y="185" width="24" height="60" rx="2" fill="#8B5CF6"/>
        <rect x="62" y="190" width="20" height="55" rx="2" fill="#EC4899"/>
        <rect x="85" y="180" width="26" height="65" rx="2" fill="#06B6D4"/>
        <rect x="114" y="195" width="22" height="50" rx="2" fill="#EAB308"/>
        <rect x="655" y="95" width="120" height="240" rx="4" fill="#64748B" stroke="#475569" stroke-width="3"/>
        <line x1="715" y1="95" x2="715" y2="335" stroke="#475569" stroke-width="3"/>
        <line x1="670" y1="115" x2="700" y2="115" stroke="#334155" stroke-width="2"/>
        <line x1="670" y1="125" x2="700" y2="125" stroke="#334155" stroke-width="2"/>
        <circle cx="705" cy="180" r="3" fill="#F59E0B"/>
        <line x1="730" y1="115" x2="760" y2="115" stroke="#334155" stroke-width="2"/>
        <line x1="730" y1="125" x2="760" y2="125" stroke="#334155" stroke-width="2"/>
        <circle cx="725" cy="180" r="3" fill="#F59E0B"/>
      `;
    }
  },

  study_desk: {
    id: 'study_desk',
    nameEn: 'Study Desk',
    nameBn: 'পড়ার টেবিল',
    icon: '📚',
    label: '📚 Study Desk • পড়ার টেবিল',
    renderSvg() {
      return `
        <linearGradient id="sdWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F4EFE6"/>
          <stop offset="100%" stop-color="#EAE3D6"/>
        </linearGradient>
        <rect width="800" height="450" fill="url(#sdWall)"/>
        <rect x="250" y="30" width="300" height="220" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="5"/>
        <rect x="260" y="40" width="280" height="200" fill="#BAE6FD"/>
        <circle cx="340" cy="160" r="70" fill="#16A34A" opacity="0.9"/>
        <circle cx="430" cy="150" r="85" fill="#15803D" opacity="0.95"/>
        <circle cx="490" cy="170" r="60" fill="#22C55E" opacity="0.85"/>
        <circle cx="280" cy="65" r="28" fill="#FEF08A" opacity="0.8"/>
        <line x1="400" y1="40" x2="400" y2="240" stroke="#CBD5E1" stroke-width="4"/>
        <line x1="260" y1="140" x2="540" y2="140" stroke="#CBD5E1" stroke-width="4"/>
        <rect x="80" y="270" width="45" height="10" rx="3" fill="#475569"/>
        <path d="M 102 270 L 115 170 L 155 125" stroke="#475569" stroke-width="4" stroke-linecap="round" fill="none"/>
        <circle cx="115" cy="170" r="5" fill="#D97706"/>
        <circle cx="155" cy="125" r="5" fill="#D97706"/>
        <path d="M 145 110 L 175 130 L 160 148 L 132 130 Z" fill="#D97706"/>
        <polygon points="148,135 172,148 280,310 100,310" fill="#FEF08A" opacity="0.18"/>
        <rect x="620" y="180" width="120" height="85" rx="5" fill="#1E293B" stroke="#64748B" stroke-width="2"/>
        <rect x="626" y="186" width="108" height="73" rx="2" fill="#0F172A"/>
        <line x1="635" y1="198" x2="685" y2="198" stroke="#38BDF8" stroke-width="2.5"/>
        <line x1="635" y1="210" x2="715" y2="210" stroke="#4ADE80" stroke-width="2"/>
        <line x1="635" y1="220" x2="695" y2="220" stroke="#FBBF24" stroke-width="2"/>
        <line x1="635" y1="230" x2="720" y2="230" stroke="#E2E8F0" stroke-width="2"/>
        <polygon points="605,265 755,265 745,275 615,275" fill="#94A3B8"/>
        <rect x="630" y="280" width="115" height="18" rx="2" fill="#991B1B"/>
        <rect x="625" y="298" width="125" height="20" rx="2" fill="#065F46"/>
        <rect x="620" y="318" width="135" height="22" rx="2" fill="#1E3A8A"/>
        <rect x="180" y="285" width="30" height="35" rx="5" fill="#2D5A4C"/>
        <path d="M 210 292 C 220 292 220 310 210 312" stroke="#2D5A4C" stroke-width="3" fill="none"/>
        <path d="M 188 275 Q 192 265 188 255 M 198 273 Q 202 263 198 253" stroke="#CBD5E1" stroke-width="2" fill="none" opacity="0.6"/>
        <rect x="0" y="335" width="800" height="115" fill="#78350F"/>
        <rect x="0" y="330" width="800" height="8" fill="#92400E"/>
        <line x1="0" y1="380" x2="800" y2="380" stroke="#5C2C16" stroke-width="1.5"/>
      `;
    }
  },

  cafe_restaurant: {
    id: 'cafe_restaurant',
    nameEn: 'Cafe Restaurant',
    nameBn: 'ক্যাফে / রেস্তোরাঁ',
    icon: '☕',
    label: '☕ Cozy Café • ক্যাফে',
    renderSvg() {
      return `
        <linearGradient id="cafeWall2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FBF8F3"/>
          <stop offset="100%" stop-color="#F2E8D7"/>
        </linearGradient>
        <rect width="800" height="450" fill="url(#cafeWall2)"/>
        <path d="M 260 270 L 260 120 Q 400 40 540 120 L 540 270 Z" fill="#E8F1F2" stroke="#D3E0E2" stroke-width="5"/>
        <line x1="400" y1="60" x2="400" y2="270" stroke="#D3E0E2" stroke-width="4"/>
        <line x1="260" y1="165" x2="540" y2="165" stroke="#D3E0E2" stroke-width="4"/>
        <circle cx="330" cy="220" r="40" fill="#C5DDD4" opacity="0.7"/>
        <circle cx="470" cy="215" r="48" fill="#B7D6CB" opacity="0.7"/>
        <line x1="160" y1="0" x2="160" y2="70" stroke="#78350F" stroke-width="2"/>
        <path d="M 145 70 Q 160 55 175 70 Z" fill="#D97706"/>
        <circle cx="160" cy="74" r="6" fill="#FDE68A"/>
        <line x1="640" y1="0" x2="640" y2="70" stroke="#78350F" stroke-width="2"/>
        <path d="M 625 70 Q 640 55 655 70 Z" fill="#D97706"/>
        <circle cx="640" cy="74" r="6" fill="#FDE68A"/>
        <rect x="30" y="65" width="140" height="195" rx="8" fill="#1E293B" stroke="#854D0E" stroke-width="4"/>
        <text x="100" y="96" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="900" fill="#FDE68A" text-anchor="middle">ESPRESSO BAR</text>
        <line x1="50" y1="106" x2="150" y2="106" stroke="#475569" stroke-width="1.5"/>
        <text x="100" y="126" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" fill="#CBD5E1" text-anchor="middle">&bull; Flat White &bull;</text>
        <text x="100" y="146" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" fill="#CBD5E1" text-anchor="middle">&bull; Warm Latte &bull;</text>
        <text x="100" y="166" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" fill="#CBD5E1" text-anchor="middle">&bull; Croissant &bull;</text>
        <text x="100" y="196" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" fill="#34D399" text-anchor="middle">&hearts; Fresh Roast &hearts;</text>
        <rect x="630" y="190" width="125" height="14" rx="2" fill="#A16207"/>
        <path d="M 645 190 Q 692 120 740 190 Z" fill="#E0F2FE" opacity="0.65" stroke="#BAE6FD" stroke-width="2"/>
        <ellipse cx="680" cy="182" rx="14" ry="7" fill="#D97706"/>
        <ellipse cx="710" cy="182" rx="12" ry="6" fill="#B45309"/>
        <rect x="0" y="340" width="800" height="110" fill="#78350F"/>
        <rect x="0" y="332" width="800" height="8" fill="#92400E"/>
        <rect x="365" y="315" width="70" height="35" rx="6" fill="#2D5A4C"/>
        <path d="M 435 323 C 445 323 445 338 435 340" stroke="#2D5A4C" stroke-width="3" fill="none"/>
        <ellipse cx="400" cy="315" rx="30" ry="5" fill="#FFFFFF"/>
        <path d="M 390 305 Q 395 292 392 280 M 405 303 Q 410 290 407 278" stroke="#A7F3D0" stroke-width="2.5" fill="none" opacity="0.75"/>
      `;
    }
  },

  park_outdoor: {
    id: 'park_outdoor',
    nameEn: 'Park Outdoor',
    nameBn: 'পার্ক',
    icon: '🌳',
    label: '🌳 Green Park • উন্মুক্ত পার্ক',
    renderSvg() {
      return `
        <linearGradient id="parkSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#7DD3FC"/>
          <stop offset="55%" stop-color="#BAE6FD"/>
          <stop offset="100%" stop-color="#FEF3C7"/>
        </linearGradient>
        <rect width="800" height="450" fill="url(#parkSky)"/>
        <circle cx="680" cy="75" r="38" fill="#FDE047" opacity="0.9"/>
        <circle cx="160" cy="80" r="28" fill="#FFFFFF" opacity="0.9"/>
        <circle cx="195" cy="70" r="36" fill="#FFFFFF" opacity="0.9"/>
        <circle cx="230" cy="80" r="26" fill="#FFFFFF" opacity="0.9"/>
        <path d="M 0 250 Q 220 180 440 240 Q 620 190 800 230 L 800 450 L 0 450 Z" fill="#86EFAC" opacity="0.7"/>
        <path d="M 0 280 Q 200 230 400 270 Q 640 220 800 260 L 800 450 L 0 450 Z" fill="#4ADE80" opacity="0.85"/>
        <rect x="75" y="160" width="22" height="160" fill="#78350F"/>
        <circle cx="86" cy="120" r="55" fill="#15803D"/>
        <circle cx="60" cy="140" r="42" fill="#16A34A"/>
        <circle cx="115" cy="135" r="46" fill="#22C55E"/>
        <circle cx="86" cy="95" r="38" fill="#4ADE80"/>
        <rect x="705" y="170" width="20" height="150" fill="#78350F"/>
        <circle cx="715" cy="130" r="50" fill="#15803D"/>
        <circle cx="685" cy="145" r="40" fill="#16A34A"/>
        <circle cx="740" cy="140" r="42" fill="#22C55E"/>
        <path d="M 0 320 Q 400 300 800 320 L 800 450 L 0 450 Z" fill="#15803D"/>
        <path d="M 220 450 C 260 380 340 330 400 320 C 460 330 540 380 580 450 Z" fill="#E2E8F0"/>
        <path d="M 235 450 C 272 385 345 338 400 328 C 455 338 528 385 565 450 Z" fill="none" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="8,6"/>
        <rect x="18" y="325" width="105" height="12" rx="3" fill="#78350F"/>
        <rect x="22" y="340" width="97" height="10" rx="2" fill="#854D0E"/>
        <rect x="25" y="350" width="8" height="25" fill="#1E293B"/>
        <rect x="108" y="350" width="8" height="25" fill="#1E293B"/>
        <rect x="645" y="180" width="6" height="160" fill="#1E293B"/>
        <path d="M 635 180 L 661 180 L 655 155 L 641 155 Z" fill="#1E293B"/>
        <circle cx="648" cy="168" r="8" fill="#FEF08A"/>
        <polygon points="635,180 661,180 700,320 596,320" fill="#FEF08A" opacity="0.16"/>
        <circle cx="160" cy="380" r="4" fill="#F472B6"/>
        <circle cx="180" cy="405" r="5" fill="#FBBF24"/>
        <circle cx="610" cy="390" r="4.5" fill="#F472B6"/>
        <circle cx="635" cy="415" r="5" fill="#FBBF24"/>
      `;
    }
  },

  hospital_clinic: {
    id: 'hospital_clinic',
    nameEn: 'Hospital Clinic',
    nameBn: 'হাসপাতাল / ফার্মেসি',
    icon: '🏥',
    label: '🏥 Clinic & Pharmacy • ক্লিনিক',
    renderSvg() {
      return `
        <linearGradient id="clinicWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F0FDF4"/>
          <stop offset="100%" stop-color="#DCFCE7"/>
        </linearGradient>
        <rect width="800" height="450" fill="url(#clinicWall)"/>
        <rect x="0" y="338" width="800" height="6" fill="#A7F3D0"/>
        <rect x="0" y="344" width="800" height="106" fill="#E2E8F0"/>
        <line x1="0" y1="385" x2="800" y2="385" stroke="#CBD5E1" stroke-width="2"/>
        <line x1="0" y1="420" x2="800" y2="420" stroke="#CBD5E1" stroke-width="2"/>
        <circle cx="400" cy="110" r="52" fill="#FFFFFF" stroke="#10B981" stroke-width="4" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.06))"/>
        <rect x="388" y="76" width="24" height="68" rx="5" fill="#EF4444"/>
        <rect x="366" y="98" width="68" height="24" rx="5" fill="#EF4444"/>
        <circle cx="400" cy="110" r="7" fill="#FFFFFF"/>
        <rect x="40" y="60" width="130" height="180" rx="8" fill="#FFFFFF" stroke="#94A3B8" stroke-width="3"/>
        <rect x="52" y="75" width="106" height="55" rx="4" fill="#0F172A"/>
        <path d="M 58 102 L 78 102 L 85 85 L 92 120 L 99 95 L 106 106 L 112 102 L 148 102" fill="none" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="55" y1="150" x2="135" y2="150" stroke="#64748B" stroke-width="2"/>
        <line x1="55" y1="165" x2="145" y2="165" stroke="#94A3B8" stroke-width="2"/>
        <line x1="55" y1="180" x2="120" y2="180" stroke="#94A3B8" stroke-width="2"/>
        <line x1="55" y1="195" x2="140" y2="195" stroke="#94A3B8" stroke-width="2"/>
        <text x="105" y="224" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="bold" fill="#059669" text-anchor="middle">CARE & HEALTH</text>
        <rect x="630" y="55" width="135" height="235" rx="6" fill="#F8FAFC" stroke="#64748B" stroke-width="3"/>
        <line x1="630" y1="130" x2="765" y2="130" stroke="#CBD5E1" stroke-width="3"/>
        <line x1="630" y1="200" x2="765" y2="200" stroke="#CBD5E1" stroke-width="3"/>
        <rect x="645" y="85" width="18" height="42" rx="3" fill="#38BDF8"/>
        <rect x="649" y="78" width="10" height="7" fill="#FFFFFF"/>
        <rect x="672" y="80" width="22" height="47" rx="3" fill="#34D399"/>
        <rect x="677" y="73" width="12" height="7" fill="#FFFFFF"/>
        <rect x="702" y="90" width="16" height="37" rx="3" fill="#F87171"/>
        <rect x="705" y="84" width="10" height="6" fill="#FFFFFF"/>
        <rect x="726" y="82" width="24" height="45" rx="3" fill="#FBBF24"/>
        <rect x="732" y="75" width="12" height="7" fill="#FFFFFF"/>
        <rect x="645" y="150" width="40" height="28" rx="3" fill="#FFFFFF" stroke="#EF4444" stroke-width="2"/>
        <line x1="665" y1="156" x2="665" y2="172" stroke="#EF4444" stroke-width="3"/>
        <line x1="657" y1="164" x2="673" y2="164" stroke="#EF4444" stroke-width="3"/>
        <rect x="695" y="145" width="55" height="33" rx="3" fill="#EEF2FF" stroke="#4F46E5" stroke-width="1.5"/>
        <rect x="20" y="275" width="120" height="90" rx="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
        <path d="M 50 282 C 40 282 35 298 48 304 C 60 310 75 292 85 300" stroke="#1E293B" stroke-width="2.5" fill="none"/>
        <circle cx="85" cy="300" r="5" fill="#94A3B8"/>
      `;
    }
  }
};

// Aliases for backward compatibility
SCENE_ENVIRONMENTS.cafe = SCENE_ENVIRONMENTS.cafe_restaurant;
SCENE_ENVIRONMENTS.library = SCENE_ENVIRONMENTS.school_classroom;
SCENE_ENVIRONMENTS.rooftop = SCENE_ENVIRONMENTS.park_outdoor;
SCENE_ENVIRONMENTS.garden = SCENE_ENVIRONMENTS.park_outdoor;
SCENE_ENVIRONMENTS.studio = SCENE_ENVIRONMENTS.study_desk;
SCENE_ENVIRONMENTS.study = SCENE_ENVIRONMENTS.study_desk;
window.SCENE_ENVIRONMENTS = SCENE_ENVIRONMENTS;
window.determineScenePair = determineScenePair;

function renderMayaCharacter(pose = 'neutral', isSpeaking = false) {
  const speakingMouth = `
    <g class="cartoon-mouth speaking">
      <ellipse cx="75" cy="58" rx="7" ry="6" fill="#881337"/>
      <path d="M 70 55 Q 75 57 80 55" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <ellipse cx="75" cy="61" rx="4.5" ry="2.5" fill="#FB7185"/>
    </g>
  `;
  const normalMouth = `
    <path d="M 69 57 Q 75 62 81 57" stroke="#C26D53" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  `;
  const laughingMouth = `
    <g class="cartoon-mouth laughing">
      <path d="M 68 56 Q 75 67 82 56 Z" fill="#881337"/>
      <ellipse cx="75" cy="61" rx="4" ry="2.5" fill="#FB7185"/>
      <path d="M 69 56 L 81 56" stroke="#FFFFFF" stroke-width="2"/>
    </g>
  `;
  const shockedMouth = `
    <ellipse cx="75" cy="59" rx="5" ry="7" fill="#881337"/>
  `;

  let eyesSvg = `
    <g class="cartoon-eyes">
      <circle cx="63" cy="44" r="5" fill="#0284C7"/>
      <circle cx="63" cy="44" r="3.5" fill="#0F172A"/>
      <circle cx="65" cy="42" r="1.5" fill="#FFFFFF"/>
      <path d="M 57 37 Q 63 33 69 37" stroke="#7A3434" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <circle cx="87" cy="44" r="5" fill="#0284C7"/>
      <circle cx="87" cy="44" r="3.5" fill="#0F172A"/>
      <circle cx="89" cy="42" r="1.5" fill="#FFFFFF"/>
      <path d="M 81 37 Q 87 33 93 37" stroke="#7A3434" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    </g>
  `;

  if (pose === 'laughing') {
    eyesSvg = `
      <g class="cartoon-eyes laughing">
        <path d="M 58 44 Q 63 38 68 44" stroke="#7A3434" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M 82 44 Q 87 38 92 44" stroke="#7A3434" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      </g>
    `;
  } else if (pose === 'shocked') {
    eyesSvg = `
      <g class="cartoon-eyes shocked">
        <circle cx="63" cy="44" r="6.5" fill="#0284C7"/>
        <circle cx="63" cy="44" r="3" fill="#0F172A"/>
        <circle cx="65" cy="42" r="2" fill="#FFFFFF"/>
        <path d="M 56 34 Q 63 31 70 34" stroke="#7A3434" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <circle cx="87" cy="44" r="6.5" fill="#0284C7"/>
        <circle cx="87" cy="44" r="3" fill="#0F172A"/>
        <circle cx="89" cy="42" r="2" fill="#FFFFFF"/>
        <path d="M 80 34 Q 87 31 94 34" stroke="#7A3434" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      </g>
    `;
  } else if (pose === 'thinking_chin') {
    eyesSvg = `
      <g class="cartoon-eyes thinking">
        <circle cx="64" cy="41" r="5" fill="#0284C7"/>
        <circle cx="64" cy="41" r="3.5" fill="#0F172A"/>
        <circle cx="65" cy="39" r="1.5" fill="#FFFFFF"/>
        <path d="M 57 35 Q 63 33 69 37" stroke="#7A3434" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <circle cx="88" cy="41" r="5" fill="#0284C7"/>
        <circle cx="88" cy="41" r="3.5" fill="#0F172A"/>
        <circle cx="89" cy="39" r="1.5" fill="#FFFFFF"/>
        <path d="M 81 37 Q 87 33 93 35" stroke="#7A3434" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      </g>
    `;
  }

  const mouthSvg = isSpeaking ? speakingMouth : (pose === 'laughing' ? laughingMouth : (pose === 'shocked' ? shockedMouth : normalMouth));

  let armsSvg = '';
  let extraEffectSvg = '';

  if (pose === 'dramatic_clutch') {
    armsSvg = `
      <path d="M 52 82 Q 40 105 65 105" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" fill="none"/>
      <circle cx="65" cy="105" r="7" fill="#FBD5B9"/>
      <path d="M 98 82 Q 110 105 85 105" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" fill="none"/>
      <circle cx="85" cy="105" r="7" fill="#FBD5B9"/>
    `;
  } else if (pose === 'thinking_chin') {
    armsSvg = `
      <path d="M 52 82 Q 42 120 75 125" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" fill="none"/>
      <circle cx="75" cy="125" r="7" fill="#FBD5B9"/>
      <path d="M 98 82 Q 115 110 88 65" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" fill="none"/>
      <circle cx="88" cy="65" r="7" fill="#FBD5B9"/>
    `;
    extraEffectSvg = `
      <g class="thought-bubble" opacity="0.9">
        <circle cx="108" cy="30" r="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
        <circle cx="118" cy="18" r="6" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
        <path d="M 125 10 Q 140 -5 155 10 Q 170 10 170 25 Q 170 40 155 40 Q 140 45 130 35 Q 120 25 125 10 Z" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
        <text x="148" y="26" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" fill="#2D5A4C" text-anchor="middle">💡 Idea</text>
      </g>
    `;
  } else if (pose === 'pointing_item') {
    armsSvg = `
      <path d="M 52 82 Q 38 115 45 140" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" fill="none"/>
      <circle cx="45" cy="140" r="7" fill="#FBD5B9"/>
      <path d="M 98 82 L 140 85 L 160 85" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" fill="none"/>
      <circle cx="162" cy="85" r="7" fill="#FBD5B9"/>
      <line x1="162" y1="85" x2="175" y2="85" stroke="#FBD5B9" stroke-width="4" stroke-linecap="round"/>
    `;
  } else if (pose === 'explaining') {
    armsSvg = `
      <path d="M 52 82 Q 30 105 25 110" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" fill="none"/>
      <circle cx="23" cy="110" r="7" fill="#FBD5B9"/>
      <path d="M 98 82 Q 120 105 130 110" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" fill="none"/>
      <circle cx="132" cy="110" r="7" fill="#FBD5B9"/>
    `;
  } else if (pose === 'shocked') {
    armsSvg = `
      <path d="M 52 82 Q 35 65 52 52" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" fill="none"/>
      <circle cx="52" cy="52" r="7" fill="#FBD5B9"/>
      <path d="M 98 82 Q 115 65 98 52" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" fill="none"/>
      <circle cx="98" cy="52" r="7" fill="#FBD5B9"/>
    `;
    extraEffectSvg = `
      <path d="M 45 15 L 52 25 L 47 27 L 55 35" stroke="#F59E0B" stroke-width="3" fill="none"/>
      <path d="M 105 15 L 98 25 L 103 27 L 95 35" stroke="#F59E0B" stroke-width="3" fill="none"/>
    `;
  } else if (pose === 'laughing') {
    armsSvg = `
      <path d="M 52 82 Q 35 105 50 128" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" fill="none"/>
      <circle cx="50" cy="128" r="7" fill="#FBD5B9"/>
      <path d="M 98 82 Q 115 105 100 128" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" fill="none"/>
      <circle cx="100" cy="128" r="7" fill="#FBD5B9"/>
    `;
  } else if (pose === 'celebrate') {
    armsSvg = `
      <path d="M 52 82 L 30 45" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" fill="none"/>
      <circle cx="28" cy="43" r="7" fill="#FBD5B9"/>
      <path d="M 98 82 L 125 40" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" fill="none"/>
      <circle cx="127" cy="38" r="7" fill="#FBD5B9"/>
    `;
    extraEffectSvg = `
      <polygon points="135,15 137,22 144,24 137,26 135,33 133,26 126,24 133,22" fill="#FBBF24"/>
      <polygon points="20,20 22,25 27,27 22,29 20,34 18,29 13,27 18,25" fill="#FBBF24"/>
    `;
  } else if (pose === 'walking') {
    armsSvg = `
      <path d="M 52 82 L 35 115" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" fill="none"/>
      <circle cx="35" cy="115" r="7" fill="#FBD5B9"/>
      <path d="M 98 82 L 118 110" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" fill="none"/>
      <circle cx="118" cy="110" r="7" fill="#FBD5B9"/>
    `;
  } else {
    armsSvg = `
      <path d="M 52 82 Q 38 115 45 145" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" fill="none"/>
      <circle cx="45" cy="145" r="7" fill="#FBD5B9"/>
      <path d="M 98 82 Q 112 115 105 145" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" fill="none"/>
      <circle cx="105" cy="145" r="7" fill="#FBD5B9"/>
    `;
  }

  let legsSvg = '';
  if (pose === 'walking') {
    legsSvg = `
      <path d="M 64 165 L 50 230" stroke="#FBD5B9" stroke-width="14" stroke-linecap="round" fill="none"/>
      <ellipse cx="46" cy="235" rx="14" ry="6" fill="#F4B8C4"/>
      <ellipse cx="46" cy="235" rx="10" ry="3" fill="#E09AA8"/>
      <path d="M 86 165 L 98 230" stroke="#FBD5B9" stroke-width="14" stroke-linecap="round" fill="none"/>
      <ellipse cx="104" cy="235" rx="14" ry="6" fill="#F4B8C4"/>
      <ellipse cx="104" cy="235" rx="10" ry="3" fill="#E09AA8"/>
    `;
  } else {
    legsSvg = `
      <path d="M 65 165 L 65 230" stroke="#FBD5B9" stroke-width="14" stroke-linecap="round" fill="none"/>
      <ellipse cx="63" cy="235" rx="13" ry="6" fill="#F4B8C4"/>
      <ellipse cx="63" cy="235" rx="9" ry="3" fill="#E09AA8"/>
      <path d="M 85 165 L 85 230" stroke="#FBD5B9" stroke-width="14" stroke-linecap="round" fill="none"/>
      <ellipse cx="87" cy="235" rx="13" ry="6" fill="#F4B8C4"/>
      <ellipse cx="87" cy="235" rx="9" ry="3" fill="#E09AA8"/>
    `;
  }

  return `
    <g id="char-maya" class="cartoon-character ${isSpeaking ? 'is-active-speaker' : ''}" transform="translate(140, 150)">
      <g class="cartoon-breathe">
        ${extraEffectSvg}
        <path d="M 40 40 C 30 65 30 95 42 120 C 48 110 50 90 52 75 Z" fill="#7A3434"/>
        <path d="M 110 40 C 120 65 120 95 108 120 C 102 110 100 90 98 75 Z" fill="#7A3434"/>
        <path d="M 45 35 C 35 15 115 15 105 35 C 120 60 120 110 105 125 C 95 105 95 85 95 85 L 55 85 C 55 85 55 105 45 125 C 30 110 30 60 45 35 Z" fill="#692929"/>
        ${legsSvg}
        <path d="M 54 135 L 96 135 L 100 166 L 76 168 L 74 168 L 50 166 Z" fill="#3B596A"/>
        <rect x="50" y="162" width="23" height="5" rx="2" fill="#2E4553"/>
        <rect x="77" y="162" width="23" height="5" rx="2" fill="#2E4553"/>
        <rect x="54" y="134" width="42" height="5" fill="#92400E"/>
        <rect x="71" y="133" width="8" height="7" rx="1.5" fill="#F59E0B"/>
        <path d="M 52 75 L 98 75 L 96 135 L 54 135 Z" fill="#FFFFFF"/>
        <path d="M 66 75 Q 75 82 84 75" stroke="#CBD5E1" stroke-width="2" fill="none"/>
        <path d="M 75 82 L 75 130" stroke="#F1F5F9" stroke-width="1.5"/>
        ${armsSvg}
        <rect x="68" y="65" width="14" height="15" rx="4" fill="#FBD5B9"/>
        <circle cx="75" cy="46" r="26" fill="#FBD5B9"/>
        <ellipse cx="58" cy="52" rx="5" ry="3.5" fill="#FB7185" opacity="0.4"/>
        <ellipse cx="92" cy="52" rx="5" ry="3.5" fill="#FB7185" opacity="0.4"/>
        ${eyesSvg}
        <path d="M 74 49 Q 75 52 77 50" stroke="#E29D7C" stroke-width="1.8" stroke-linecap="round" fill="none"/>
        ${mouthSvg}
        <path d="M 46 45 C 44 25 60 18 75 18 C 90 18 106 25 104 45 C 98 28 85 24 75 25 C 62 26 50 32 46 45 Z" fill="#7A3434"/>
        <path d="M 48 35 Q 40 55 45 78 Q 48 60 52 42" fill="#8F3E3E"/>
        <path d="M 102 35 Q 110 55 105 78 Q 102 60 98 42" fill="#8F3E3E"/>
      </g>
    </g>
  `;
}

function renderLeoCharacter(pose = 'neutral', isSpeaking = false) {
  const speakingMouth = `
    <g class="cartoon-mouth speaking">
      <ellipse cx="75" cy="58" rx="7" ry="6" fill="#881337"/>
      <path d="M 70 55 Q 75 57 80 55" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <ellipse cx="75" cy="61" rx="4.5" ry="2.5" fill="#FB7185"/>
    </g>
  `;
  const normalMouth = `
    <path d="M 70 57 Q 75 62 82 58" stroke="#C26D53" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  `;
  const laughingMouth = `
    <g class="cartoon-mouth laughing">
      <path d="M 68 56 Q 75 67 82 56 Z" fill="#881337"/>
      <ellipse cx="75" cy="61" rx="4" ry="2.5" fill="#FB7185"/>
      <path d="M 69 56 L 81 56" stroke="#FFFFFF" stroke-width="2"/>
    </g>
  `;
  const shockedMouth = `
    <ellipse cx="75" cy="59" rx="5" ry="7" fill="#881337"/>
  `;

  let eyesSvg = `
    <g class="cartoon-eyes">
      <circle cx="63" cy="44" r="5" fill="#1E293B"/>
      <circle cx="65" cy="42" r="1.5" fill="#FFFFFF"/>
      <circle cx="87" cy="44" r="5" fill="#1E293B"/>
      <circle cx="89" cy="42" r="1.5" fill="#FFFFFF"/>
      <path d="M 56 36 Q 63 32 70 36" stroke="#231B15" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <path d="M 80 36 Q 87 32 94 36" stroke="#231B15" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    </g>
  `;

  if (pose === 'laughing') {
    eyesSvg = `
      <g class="cartoon-eyes laughing">
        <path d="M 58 44 Q 63 38 68 44" stroke="#231B15" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M 82 44 Q 87 38 92 44" stroke="#231B15" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      </g>
    `;
  } else if (pose === 'shocked') {
    eyesSvg = `
      <g class="cartoon-eyes shocked">
        <circle cx="63" cy="44" r="6.5" fill="#1E293B"/>
        <circle cx="65" cy="42" r="2" fill="#FFFFFF"/>
        <circle cx="87" cy="44" r="6.5" fill="#1E293B"/>
        <circle cx="89" cy="42" r="2" fill="#FFFFFF"/>
        <path d="M 55 33 Q 63 30 71 33" stroke="#231B15" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M 79 33 Q 87 30 95 33" stroke="#231B15" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      </g>
    `;
  } else if (pose === 'thinking_chin') {
    eyesSvg = `
      <g class="cartoon-eyes thinking">
        <circle cx="62" cy="41" r="5" fill="#1E293B"/>
        <circle cx="64" cy="39" r="1.5" fill="#FFFFFF"/>
        <circle cx="86" cy="41" r="5" fill="#1E293B"/>
        <circle cx="88" cy="39" r="1.5" fill="#FFFFFF"/>
        <path d="M 57 37 Q 63 34 69 36" stroke="#231B15" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M 81 35 Q 87 33 93 37" stroke="#231B15" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      </g>
    `;
  }

  const mouthSvg = isSpeaking ? speakingMouth : (pose === 'laughing' ? laughingMouth : (pose === 'shocked' ? shockedMouth : normalMouth));

  let armsSvg = '';
  let extraEffectSvg = '';

  if (pose === 'dramatic_clutch') {
    armsSvg = `
      <path d="M 50 82 Q 38 105 65 105" stroke="#1CA65A" stroke-width="14" stroke-linecap="round" fill="none"/>
      <circle cx="65" cy="105" r="7" fill="#FAD1B5"/>
      <path d="M 100 82 Q 112 105 85 105" stroke="#1CA65A" stroke-width="14" stroke-linecap="round" fill="none"/>
      <circle cx="85" cy="105" r="7" fill="#FAD1B5"/>
    `;
  } else if (pose === 'thinking_chin') {
    armsSvg = `
      <path d="M 100 82 Q 110 120 75 125" stroke="#1CA65A" stroke-width="14" stroke-linecap="round" fill="none"/>
      <circle cx="75" cy="125" r="7" fill="#FAD1B5"/>
      <path d="M 50 82 Q 35 110 62 65" stroke="#1CA65A" stroke-width="14" stroke-linecap="round" fill="none"/>
      <circle cx="62" cy="65" r="7" fill="#FAD1B5"/>
    `;
    extraEffectSvg = `
      <g class="thought-bubble" opacity="0.9">
        <circle cx="42" cy="30" r="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
        <circle cx="32" cy="18" r="6" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
        <path d="M 25 10 Q 10 -5 -5 10 Q -20 10 -20 25 Q -20 40 -5 40 Q 10 45 20 35 Q 30 25 25 10 Z" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
        <text x="0" y="26" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" fill="#1CA65A" text-anchor="middle">🤔 Hmm...</text>
      </g>
    `;
  } else if (pose === 'pointing_item') {
    armsSvg = `
      <path d="M 100 82 Q 112 115 105 140" stroke="#1CA65A" stroke-width="14" stroke-linecap="round" fill="none"/>
      <circle cx="105" cy="140" r="7" fill="#FAD1B5"/>
      <path d="M 50 82 L 10 85 L -10 85" stroke="#1CA65A" stroke-width="14" stroke-linecap="round" fill="none"/>
      <circle cx="-12" cy="85" r="7" fill="#FAD1B5"/>
      <line x1="-12" y1="85" x2="-25" y2="85" stroke="#FAD1B5" stroke-width="4" stroke-linecap="round"/>
    `;
  } else if (pose === 'explaining') {
    armsSvg = `
      <path d="M 50 82 Q 28 105 20 110" stroke="#1CA65A" stroke-width="14" stroke-linecap="round" fill="none"/>
      <circle cx="18" cy="110" r="7" fill="#FAD1B5"/>
      <path d="M 100 82 Q 122 105 130 110" stroke="#1CA65A" stroke-width="14" stroke-linecap="round" fill="none"/>
      <circle cx="132" cy="110" r="7" fill="#FAD1B5"/>
    `;
  } else if (pose === 'shocked') {
    armsSvg = `
      <path d="M 50 82 Q 33 65 50 52" stroke="#1CA65A" stroke-width="14" stroke-linecap="round" fill="none"/>
      <circle cx="50" cy="52" r="7" fill="#FAD1B5"/>
      <path d="M 100 82 Q 117 65 100 52" stroke="#1CA65A" stroke-width="14" stroke-linecap="round" fill="none"/>
      <circle cx="100" cy="52" r="7" fill="#FAD1B5"/>
    `;
    extraEffectSvg = `
      <path d="M 45 15 L 52 25 L 47 27 L 55 35" stroke="#F59E0B" stroke-width="3" fill="none"/>
      <path d="M 105 15 L 98 25 L 103 27 L 95 35" stroke="#F59E0B" stroke-width="3" fill="none"/>
    `;
  } else if (pose === 'laughing') {
    armsSvg = `
      <path d="M 50 82 Q 33 105 48 128" stroke="#1CA65A" stroke-width="14" stroke-linecap="round" fill="none"/>
      <circle cx="48" cy="128" r="7" fill="#FAD1B5"/>
      <path d="M 100 82 Q 117 105 102 128" stroke="#1CA65A" stroke-width="14" stroke-linecap="round" fill="none"/>
      <circle cx="102" cy="128" r="7" fill="#FAD1B5"/>
    `;
  } else if (pose === 'celebrate') {
    armsSvg = `
      <path d="M 50 82 L 25 40" stroke="#1CA65A" stroke-width="14" stroke-linecap="round" fill="none"/>
      <circle cx="23" cy="38" r="7" fill="#FAD1B5"/>
      <path d="M 100 82 L 125 45" stroke="#1CA65A" stroke-width="14" stroke-linecap="round" fill="none"/>
      <circle cx="127" cy="43" r="7" fill="#FAD1B5"/>
    `;
    extraEffectSvg = `
      <polygon points="135,20 137,27 144,29 137,31 135,38 133,31 126,29 133,27" fill="#FBBF24"/>
      <polygon points="15,15 17,20 22,22 17,24 15,29 13,24 8,22 13,20" fill="#FBBF24"/>
    `;
  } else if (pose === 'walking') {
    armsSvg = `
      <path d="M 50 82 L 32 110" stroke="#1CA65A" stroke-width="14" stroke-linecap="round" fill="none"/>
      <circle cx="32" cy="110" r="7" fill="#FAD1B5"/>
      <path d="M 100 82 L 115 115" stroke="#1CA65A" stroke-width="14" stroke-linecap="round" fill="none"/>
      <circle cx="115" cy="115" r="7" fill="#FAD1B5"/>
    `;
  } else {
    armsSvg = `
      <path d="M 50 82 Q 36 115 42 145" stroke="#1CA65A" stroke-width="14" stroke-linecap="round" fill="none"/>
      <circle cx="42" cy="145" r="7" fill="#FAD1B5"/>
      <path d="M 100 82 Q 114 115 108 145" stroke="#1CA65A" stroke-width="14" stroke-linecap="round" fill="none"/>
      <circle cx="108" cy="145" r="7" fill="#FAD1B5"/>
    `;
  }

  let legsSvg = '';
  if (pose === 'walking') {
    legsSvg = `
      <path d="M 64 145 L 48 220" stroke="#415B61" stroke-width="16" stroke-linecap="round" fill="none"/>
      <rect x="42" y="215" width="16" height="5" rx="2" fill="#304449"/>
      <path d="M 36 226 L 56 226 L 58 236 L 30 236 Z" fill="#5BC0DE"/>
      <path d="M 30 230 Q 30 236 36 236 L 36 226 Z" fill="#FFFFFF"/>
      <rect x="28" y="235" width="32" height="4" rx="2" fill="#FFFFFF"/>
      <path d="M 86 145 L 102 220" stroke="#415B61" stroke-width="16" stroke-linecap="round" fill="none"/>
      <rect x="94" y="215" width="16" height="5" rx="2" fill="#304449"/>
      <path d="M 90 226 L 110 226 L 116 236 L 88 236 Z" fill="#5BC0DE"/>
      <path d="M 110 226 Q 116 230 116 236 L 110 236 Z" fill="#FFFFFF"/>
      <rect x="86" y="235" width="32" height="4" rx="2" fill="#FFFFFF"/>
    `;
  } else {
    legsSvg = `
      <path d="M 64 145 L 64 220" stroke="#415B61" stroke-width="16" stroke-linecap="round" fill="none"/>
      <rect x="56" y="215" width="16" height="5" rx="2" fill="#304449"/>
      <path d="M 52 226 L 72 226 L 74 236 L 46 236 Z" fill="#5BC0DE"/>
      <path d="M 46 230 Q 46 236 52 236 L 52 226 Z" fill="#FFFFFF"/>
      <rect x="44" y="235" width="32" height="4" rx="2" fill="#FFFFFF"/>
      <path d="M 86 145 L 86 220" stroke="#415B61" stroke-width="16" stroke-linecap="round" fill="none"/>
      <rect x="78" y="215" width="16" height="5" rx="2" fill="#304449"/>
      <path d="M 76 226 L 96 226 L 102 236 L 74 236 Z" fill="#5BC0DE"/>
      <path d="M 96 226 Q 102 230 102 236 L 96 236 Z" fill="#FFFFFF"/>
      <rect x="72" y="235" width="32" height="4" rx="2" fill="#FFFFFF"/>
    `;
  }

  return `
    <g id="char-leo" class="cartoon-character ${isSpeaking ? 'is-active-speaker' : ''}" transform="translate(530, 150)">
      <g class="cartoon-breathe">
        ${extraEffectSvg}
        ${legsSvg}
        <path d="M 48 76 L 102 76 L 100 148 L 50 148 Z" fill="#1CA65A"/>
        <path d="M 58 116 L 92 116 L 96 142 L 54 142 Z" fill="#15803D" opacity="0.85"/>
        <line x1="58" y1="116" x2="54" y2="142" stroke="#0F5127" stroke-width="1.5"/>
        <line x1="92" y1="116" x2="96" y2="142" stroke="#0F5127" stroke-width="1.5"/>
        <path d="M 64 76 Q 75 88 86 76" stroke="#15803D" stroke-width="4" fill="none"/>
        <line x1="71" y1="84" x2="71" y2="105" stroke="#F8FAFC" stroke-width="2" stroke-linecap="round"/>
        <circle cx="71" cy="106" r="2" fill="#CBD5E1"/>
        <line x1="79" y1="84" x2="79" y2="103" stroke="#F8FAFC" stroke-width="2" stroke-linecap="round"/>
        <circle cx="79" cy="104" r="2" fill="#CBD5E1"/>
        ${armsSvg}
        <rect x="68" y="65" width="14" height="15" rx="4" fill="#FAD1B5"/>
        <circle cx="75" cy="46" r="26" fill="#FAD1B5"/>
        <ellipse cx="58" cy="52" rx="5" ry="3" fill="#FB7185" opacity="0.3"/>
        <ellipse cx="92" cy="52" rx="5" ry="3" fill="#FB7185" opacity="0.3"/>
        <circle cx="63" cy="44" r="10.5" fill="none" stroke="#1E293B" stroke-width="2.5"/>
        <circle cx="87" cy="44" r="10.5" fill="none" stroke="#1E293B" stroke-width="2.5"/>
        <line x1="73.5" y1="44" x2="76.5" y2="44" stroke="#1E293B" stroke-width="2.5"/>
        <path d="M 57 40 L 67 40" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
        <path d="M 81 40 L 91 40" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
        ${eyesSvg}
        <path d="M 74 49 Q 75 52 77 50" stroke="#E29D7C" stroke-width="1.8" stroke-linecap="round" fill="none"/>
        ${mouthSvg}
        <path d="M 46 45 C 40 22 55 12 75 12 C 95 12 110 22 104 45 C 98 25 88 20 75 22 C 60 20 50 25 46 45 Z" fill="#231B15"/>
        <circle cx="58" cy="20" r="10" fill="#231B15"/>
        <circle cx="75" cy="15" r="12" fill="#2D221B"/>
        <circle cx="92" cy="20" r="11" fill="#231B15"/>
        <circle cx="103" cy="28" r="9" fill="#2D221B"/>
        <path d="M 54 22 L 60 12 L 68 22" fill="#231B15"/>
        <path d="M 82 22 L 88 11 L 96 22" fill="#231B15"/>
      </g>
    </g>
  `;
}

function renderCartoonSceneSvg(theme = 'living_room', speaker = 'Maya', pose = 'neutral', isSpeaking = false) {
  // Support legacy signature (theme, speaker, isSpeaking)
  if (typeof pose === 'boolean') {
    isSpeaking = pose;
    pose = 'neutral';
  }

  const envKey = (SCENE_ENVIRONMENTS[theme] && SCENE_ENVIRONMENTS[theme].renderSvg) ? theme : 'living_room';
  const env = SCENE_ENVIRONMENTS[envKey];
  const bgElements = env.renderSvg();

  const mayaSpeaking = isSpeaking && speaker === 'Maya';
  const leoSpeaking = isSpeaking && speaker === 'Leo';

  const mayaPose = speaker === 'Maya' ? pose : (pose === 'walking' ? 'walking' : 'neutral');
  const leoPose = speaker === 'Leo' ? pose : (pose === 'walking' ? 'walking' : 'neutral');

  const mayaSvg = renderMayaCharacter(mayaPose, mayaSpeaking);
  const leoSvg = renderLeoCharacter(leoPose, leoSpeaking);

  // Dynamic Location Badge Pill at top-left
  const locationBadgeSvg = `
    <g id="scene-location-pill" class="cartoon-location-badge" transform="translate(18, 16)">
      <rect x="0" y="0" width="185" height="32" rx="16" fill="rgba(255, 255, 255, 0.95)" stroke="rgba(45, 90, 76, 0.25)" stroke-width="1.5" filter="drop-shadow(0 3px 8px rgba(0,0,0,0.12))"/>
      <circle cx="16" cy="16" r="4.5" fill="#10B981"/>
      <text x="28" y="20.5" font-family="'Plus Jakarta Sans', sans-serif" font-size="11.5" font-weight="bold" fill="#2D5A4C">${env.label}</text>
    </g>
  `;

  let speechBubbleSvg = '';
  if (mayaSpeaking) {
    speechBubbleSvg = `
      <g id="speech-bubble-maya" class="cartoon-speech-bubble" transform="translate(145, 60)">
        <path d="M 10 10 L 140 10 Q 150 10 150 20 L 150 65 Q 150 75 140 75 L 75 75 L 60 95 L 55 75 L 10 75 Q 0 75 0 65 L 0 20 Q 0 10 10 10 Z" fill="#FFFFFF" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.15))"/>
        <circle cx="26" cy="42" r="13" fill="#EEF4F1"/>
        <text x="26" y="46" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold" fill="#2D5A4C" text-anchor="middle">M</text>
        <text x="46" y="39" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" fill="#2D5A4C">Maya Speaking</text>
        <rect x="48" y="46" width="3" height="8" rx="1.5" fill="#2D5A4C" class="wave-bar-1"/>
        <rect x="54" y="43" width="3" height="14" rx="1.5" fill="#2D5A4C" class="wave-bar-2"/>
        <rect x="60" y="47" width="3" height="7" rx="1.5" fill="#2D5A4C" class="wave-bar-3"/>
      </g>
    `;
  } else if (leoSpeaking) {
    speechBubbleSvg = `
      <g id="speech-bubble-leo" class="cartoon-speech-bubble" transform="translate(505, 60)">
        <path d="M 10 10 L 140 10 Q 150 10 150 20 L 150 65 Q 150 75 140 75 L 95 75 L 90 95 L 75 75 L 10 75 Q 0 75 0 65 L 0 20 Q 0 10 10 10 Z" fill="#FFFFFF" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.15))"/>
        <circle cx="26" cy="42" r="13" fill="#ECFDF5"/>
        <text x="26" y="46" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold" fill="#1CA65A" text-anchor="middle">L</text>
        <text x="46" y="39" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" fill="#1CA65A">Leo Speaking</text>
        <rect x="48" y="46" width="3" height="8" rx="1.5" fill="#1CA65A" class="wave-bar-1"/>
        <rect x="54" y="43" width="3" height="14" rx="1.5" fill="#1CA65A" class="wave-bar-2"/>
        <rect x="60" y="47" width="3" height="7" rx="1.5" fill="#1CA65A" class="wave-bar-3"/>
      </g>
    `;
  }

  return `
    <svg viewBox="0 0 800 450" class="w-full h-full block" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      ${bgElements}
      ${locationBadgeSvg}
      ${mayaSvg}
      ${leoSvg}
      ${speechBubbleSvg}
    </svg>
  `;
}

function determineScenePair(wordObj) {
  const textCorpus = [
    wordObj.word || '',
    wordObj.meaningBn || wordObj.meaning || wordObj.bn || '',
    wordObj.definition || wordObj.def || '',
    wordObj.example || wordObj.exampleEn || '',
    Array.isArray(wordObj.synonyms) ? wordObj.synonyms.map(s => typeof s === 'string' ? s : (s.word || '')).join(' ') : (wordObj.synonyms || ''),
    wordObj.pos || ''
  ].join(' ').toLowerCase();

  // 1. Health / Medicine / Pain / Agony / Cure
  if (/pain|agony|hurt|hospital|clinic|doctor|medicine|cure|heal|sick|illness|disease|remedy|wound|suffer|health|trauma|fever|cough/i.test(textCorpus)) {
    return {
      primary: 'living_room',
      transition: 'hospital_clinic',
      titleEn: `Overcoming ${wordObj.word || 'Challenge'}`,
      titleBn: `ক্লিনিক ও হাসপাতালে শব্দের প্রয়োগ`
    };
  }

  // 2. Fruit / Food / Eat / Fresh / Taste / Plenty / Abundant
  if (/fruit|food|apple|mango|vegetable|produce|fresh|market|tasty|eat|harvest|crop|abundant|plenty|feast|hungry|delicious|grocery/i.test(textCorpus)) {
    return {
      primary: 'living_room',
      transition: 'fruit_shop',
      titleEn: `A Visit to the Fresh Market`,
      titleBn: `ফলের দোকানে বাস্তব অভিজ্ঞতা`
    };
  }

  // 3. Shopping / Buy / Price / Cost / Afford / Acquire / Fashion / Mall / Sale
  if (/buy|shop|market|store|price|cost|afford|acquire|sale|dollar|money|cheap|expensive|cloth|garment|bag|mall|purchase/i.test(textCorpus)) {
    return {
      primary: 'living_room',
      transition: 'shopping_market',
      titleEn: `The Market Expedition`,
      titleBn: `শপিং মলে প্রয়োজনীয় কেনাকাটা`
    };
  }

  // 4. Study / School / Classroom / Exam / Test / Grammar / Academic / Teacher / Rule
  if (/school|class|classroom|study|desk|exam|test|academic|teach|student|learn|grammar|lecture|lesson|book|homework/i.test(textCorpus)) {
    return {
      primary: 'study_desk',
      transition: 'school_classroom',
      titleEn: `Classroom Lessons with ${wordObj.word || 'Words'}`,
      titleBn: `ক্লাসরুমে নতুন শব্দের পাঠ`
    };
  }

  // 5. Nature / Outdoor / Park / Walk / Weather / Tree / Green / Serene / Journey / Adventure
  if (/park|outdoor|nature|tree|walk|sky|green|serene|calm|quiet|garden|flower|bird|path|bench|travel|journey|breeze/i.test(textCorpus)) {
    return {
      primary: 'living_room',
      transition: 'park_outdoor',
      titleEn: `A Serene Walk in the Park`,
      titleBn: `উন্মুক্ত পার্কে মনোরম সময়`
    };
  }

  // 6. Cafe / Coffee / Social / Friendly / Talk / Discuss / Agree / Amiable / Snack
  if (/cafe|coffee|tea|drink|snack|cup|table|restaurant|amiable|friendly|chat|conversation|discuss|talk|relax|meet|sweet/i.test(textCorpus)) {
    return {
      primary: 'study_desk',
      transition: 'cafe_restaurant',
      titleEn: `Conversations at the Cozy Café`,
      titleBn: `ক্যাফেতে প্রাণবন্ত আড্ডা`
    };
  }

  // 7. General Fallback with deterministic alternating pair
  let hash = 0;
  const wStr = String(wordObj.word || 'Word').toLowerCase();
  for (let i = 0; i < wStr.length; i++) hash = (hash * 31 + wStr.charCodeAt(i)) & 0xffffffff;
  const fallbackPairs = [
    { primary: 'living_room', transition: 'shopping_market', titleEn: `Exploring Everyday Life`, titleBn: `দৈনন্দিন জীবনে নতুন শব্দ` },
    { primary: 'living_room', transition: 'fruit_shop', titleEn: `Discovering Everyday Meaning`, titleBn: `বাস্তব উদাহরণের মাধ্যমে অনুশীলন` },
    { primary: 'study_desk', transition: 'school_classroom', titleEn: `Mastering Vocabulary Skills`, titleBn: `শিক্ষাঙ্গনে সঠিক শব্দ প্রয়োগ` },
    { primary: 'living_room', transition: 'park_outdoor', titleEn: `A Refreshing Conversation`, titleBn: `আনন্দময় পরিবেশে শব্দ চর্চা` },
    { primary: 'study_desk', transition: 'cafe_restaurant', titleEn: `Sharing Ideas and Insights`, titleBn: `বন্ধুদের সাথে কথোপকথন` },
    { primary: 'living_room', transition: 'hospital_clinic', titleEn: `Learning Essential Words`, titleBn: `প্রয়োজনীয় ইংরেজি শব্দ ও অর্থ` }
  ];
  return fallbackPairs[Math.abs(hash) % fallbackPairs.length];
}

function generateCartoonConversation(wordObj) {
  if (!wordObj || typeof wordObj !== 'object') {
    wordObj = { word: 'Word', meaningBn: 'শব্দার্থ' };
  }

  const rawWord = String(wordObj.word || 'Word').trim();
  const word = rawWord.charAt(0).toUpperCase() + rawWord.slice(1);
  const cleanWord = word.toLowerCase();
  const pos = String(wordObj.pos || 'word').trim().toLowerCase();
  const meaningBn = String(wordObj.meaningBn || wordObj.meaning || wordObj.bn || 'অর্থ').trim();

  // Synonyms extraction
  let synWords = [];
  if (Array.isArray(wordObj.synonyms)) {
    synWords = wordObj.synonyms
      .map(s => typeof s === 'string' ? s.trim() : (s && s.word ? s.word.trim() : ''))
      .filter(s => s && s.toLowerCase() !== cleanWord);
  } else if (typeof wordObj.synonyms === 'string' && wordObj.synonyms.trim()) {
    synWords = wordObj.synonyms.split(',').map(s => s.trim()).filter(s => s && s.toLowerCase() !== cleanWord);
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

  // Derivatives clause
  let derivEn = '';
  let derivBn = '';
  if (wordObj.derivatives && typeof wordObj.derivatives === 'object') {
    const d = wordObj.derivatives;
    const parts = [];
    const partsBn = [];
    if (d.noun && d.noun.word) { parts.push(`noun '${d.noun.word}'`); partsBn.push(`বিশেষ্য '${d.noun.word}'`); }
    if (d.verb && d.verb.word) { parts.push(`verb '${d.verb.word}'`); partsBn.push(`ক্রিয়া '${d.verb.word}'`); }
    if (d.adjective && d.adjective.word) { parts.push(`adjective '${d.adjective.word}'`); partsBn.push(`বিশেষণ '${d.adjective.word}'`); }
    if (d.adverb && d.adverb.word) { parts.push(`adverb '${d.adverb.word}'`); partsBn.push(`ক্রিয়াবিশেষণ '${d.adverb.word}'`); }
    if (parts.length > 0) {
      derivEn = `Notice its word family too: ${parts.slice(0, 2).join(' and ')}.`;
      derivBn = `এর শব্দ পরিবার বা ডেরিভেটিভসও মনে রেখো: ${partsBn.slice(0, 2).join(' ও ')}।`;
    }
  }
  if (!derivEn) {
    derivEn = `Remember to practice both its noun and adjective forms in daily speech.`;
    derivBn = `দৈনন্দিন কথায় এর বিভিন্ন ব্যাকরণগত রূপ চর্চা করা খুব জরুরি।`;
  }

  // Scene pair mapping
  const sceneConfig = determineScenePair(wordObj);
  const primaryScene = sceneConfig.primary;
  const transitionScene = sceneConfig.transition;
  const envObj = SCENE_ENVIRONMENTS[transitionScene] || SCENE_ENVIRONMENTS.fruit_shop;
  const transNameEn = envObj.nameEn.toLowerCase();
  const transNameBn = envObj.nameBn;

  const synonymClauseEn = firstSynonym ? `, closely related to "${firstSynonym}"` : '';
  const synonymClauseBn = firstSynonym ? `, অনেকটা "${firstSynonym}"-এর মতো` : '';

  // 14 Lines across 4 Acts
  const lines = [
    // ACT 1: SETUP (Lines 1 to 3)
    {
      act: 1,
      actTitle: 'Act 1: Setup',
      actTitleBn: 'অঙ্ক ১: সূচনা',
      scene: primaryScene,
      speaker: 'Maya',
      avatar: 'maya',
      pose: 'explaining',
      en: `Leo, look at our study schedule for today—have you practiced using "${word}"?`,
      bn: `লিও, আজ আমাদের পড়াশোনার রুটিনটা দেখ—তুমি কি "${word}" (${meaningBn}) শব্দটি দিয়ে অনুশীলন করেছ?`,
      targetWord: cleanWord,
      approxDuration: 4.5
    },
    {
      act: 1,
      actTitle: 'Act 1: Setup',
      actTitleBn: 'অঙ্ক ১: সূচনা',
      scene: primaryScene,
      speaker: 'Leo',
      avatar: 'leo',
      pose: 'thinking_chin',
      en: `I've heard "${word}" before, Maya, but I sometimes hesitate on how to apply it naturally in conversations.`,
      bn: `আমি আগে "${word}" শব্দটি শুনেছি, মায়া, কিন্তু কথোপকথনে এটি কীভাবে স্বাভাবিকভাবে ব্যবহার করতে হয় তা নিয়ে কিছুটা দ্বিধায় পড়ি।`,
      targetWord: cleanWord,
      approxDuration: 4.5
    },
    {
      act: 1,
      actTitle: 'Act 1: Setup',
      actTitleBn: 'অঙ্ক ১: সূচনা',
      scene: primaryScene,
      speaker: 'Maya',
      avatar: 'maya',
      pose: 'explaining',
      en: `"${word}" is an essential ${pos} meaning "${meaningBn}"${synonymClauseEn}. Let's step outside so we can see its meaning in real life!`,
      bn: `"${word}" একটি চমৎকার ${pos} যার অর্থ "${meaningBn}"${synonymClauseBn}। চলো বাইরে যাই, বাস্তবে এর রূপ দেখলে তোমার একদম পরিষ্কার হয়ে যাবে!`,
      targetWord: cleanWord,
      approxDuration: 4.5
    },

    // ACT 2: CHALLENGE & SCENE TRANSITION (Lines 4 to 7)
    {
      act: 2,
      actTitle: 'Act 2: Challenge',
      actTitleBn: 'অঙ্ক ২: পটপরিবর্তন ও সমস্যা',
      scene: transitionScene,
      speaker: 'Leo',
      avatar: 'leo',
      pose: 'walking',
      en: `Here we are at the ${transNameEn}! It's quite lively here today, Maya.`,
      bn: `আমরা ${transNameBn}-এ এসে পৌঁছালাম! আজ এখানে বেশ ভিড় আর কর্মচঞ্চল পরিবেশ, মায়া।`,
      targetWord: null,
      approxDuration: 4.5
    },
    {
      act: 2,
      actTitle: 'Act 2: Challenge',
      actTitleBn: 'অঙ্ক ২: পটপরিবর্তন ও সমস্যা',
      scene: transitionScene,
      speaker: 'Maya',
      avatar: 'maya',
      pose: 'pointing_item',
      en: `Look closely at what is happening right in front of us—this real situation perfectly illustrates "${word}".`,
      bn: `আমাদের সামনে কী ঘটছে তা লক্ষ্য করো—এই বাস্তব পরিস্থিতিটি "${word}" শব্দটিকে দারুণভাবে ফুটিয়ে তুলছে।`,
      targetWord: cleanWord,
      approxDuration: 4.5
    },
    {
      act: 2,
      actTitle: 'Act 2: Challenge',
      actTitleBn: 'অঙ্ক ২: পটপরিবর্তন ও সমস্যা',
      scene: transitionScene,
      speaker: 'Leo',
      avatar: 'leo',
      pose: 'thinking_chin',
      en: `Wait, does this example sentence fit the scene: "${exampleSentence}"?`,
      bn: `একটু দাঁড়াও, এই বাক্যটি কি এই পরিস্থিতির সাথে মানানসই: "${exampleSentenceBn || exampleSentence}"?`,
      targetWord: cleanWord,
      approxDuration: 4.5
    },
    {
      act: 2,
      actTitle: 'Act 2: Challenge',
      actTitleBn: 'অঙ্ক ২: পটপরিবর্তন ও সমস্যা',
      scene: transitionScene,
      speaker: 'Maya',
      avatar: 'maya',
      pose: 'explaining',
      en: `Exactly! That sentence proves that "${word}" captures this exact nuance: "${meaningBn}".`,
      bn: `একদম ঠিক! এই বাক্যটি প্রমাণ করে যে "${word}" শব্দের আসল অর্থ হলো "${meaningBn}"।`,
      targetWord: cleanWord,
      approxDuration: 4.5
    },

    // ACT 3: TURNING POINT & BREAKTHROUGH (Lines 8 to 11)
    {
      act: 3,
      actTitle: 'Act 3: Turning Point',
      actTitleBn: 'অঙ্ক ৩: সমাধান',
      scene: transitionScene,
      speaker: 'Leo',
      avatar: 'leo',
      pose: 'dramatic_clutch',
      en: `Now it truly clicks! When someone asks me to explain "${word}", I can describe this exact moment.`,
      bn: `এবার আমি পুরোপুরি বুঝতে পেরেছি! কেউ যদি আমাকে "${word}" ব্যাখ্যা করতে বলে, আমি ঠিক এই দৃশ্যটির কথাই বলব।`,
      targetWord: cleanWord,
      approxDuration: 4.5
    },
    {
      act: 3,
      actTitle: 'Act 3: Turning Point',
      actTitleBn: 'অঙ্ক ৩: সমাধান',
      scene: transitionScene,
      speaker: 'Maya',
      avatar: 'maya',
      pose: 'explaining',
      en: `Yes! ${derivEn} Mastering word families turns simple memorization into deep fluency.`,
      bn: `হ্যাঁ! ${derivBn} শব্দের পরিবার জানলে শুধু মুখস্থ না হয়ে মনের ভাব নিখুঁতভাবে প্রকাশ করা যায়।`,
      targetWord: null,
      approxDuration: 4.5
    },
    {
      act: 3,
      actTitle: 'Act 3: Turning Point',
      actTitleBn: 'অঙ্ক ৩: সমাধান',
      scene: transitionScene,
      speaker: 'Leo',
      avatar: 'leo',
      pose: 'celebrate',
      en: `Awesome! Practicing "${word}" in real dialogue makes our vocabulary much more confident and expressive!`,
      bn: `চমৎকার! বাস্তব কথপোকথনে "${word}" চর্চা করলে আমাদের ইংরেজি বলার আত্মবিশ্বাস অনেক বেড়ে যায়!`,
      targetWord: cleanWord,
      approxDuration: 4.5
    },
    {
      act: 3,
      actTitle: 'Act 3: Turning Point',
      actTitleBn: 'অঙ্ক ৩: সমাধান',
      scene: transitionScene,
      speaker: 'Maya',
      avatar: 'maya',
      pose: 'laughing',
      en: `Spot on, Leo! Your natural pronunciation and contextual understanding are improving with every single word.`,
      bn: `দারুণ, লিও! প্রতিটি শব্দের সাথে তোমার স্বাভাবিক উচ্চারণ ও প্রয়োগিক দক্ষতা অসাধারণ উন্নতি করছে।`,
      targetWord: null,
      approxDuration: 4.5
    },

    // ACT 4: ENDING & CELEBRATION (Lines 12 to 14)
    {
      act: 4,
      actTitle: 'Act 4: Ending',
      actTitleBn: 'অঙ্ক ৪: সাফল্য ও সমাপ্তি',
      scene: primaryScene,
      speaker: 'Leo',
      avatar: 'leo',
      pose: 'thinking_chin',
      en: `I am going to bookmark "${word}" in My Vocab list and review it on the 3D flashcards right away.`,
      bn: `আমি এখনই "${word}" শব্দটি আমার 'মাই ভোকাব' তালিকায় যোগ করছি এবং ৩ডি ফ্ল্যাশকার্ডে রিভিশন দেব।`,
      targetWord: cleanWord,
      approxDuration: 4.5
    },
    {
      act: 4,
      actTitle: 'Act 4: Ending',
      actTitleBn: 'অঙ্ক ৪: সাফল্য ও সমাপ্তি',
      scene: primaryScene,
      speaker: 'Maya',
      avatar: 'maya',
      pose: 'celebrate',
      en: `That consistency is key! Daily active practice is what transforms new vocabulary into lifelong mastery.`,
      bn: `এই ধারাবাহিকতাই আসল চাবিকাঠি! নিয়মিত অনুশীলনের মাধ্যমেই প্রতিটি শব্দ চিরদিনের মতো আয়ত্তে চলে আসে।`,
      targetWord: null,
      approxDuration: 4.5
    },
    {
      act: 4,
      actTitle: 'Act 4: Ending',
      actTitleBn: 'অঙ্ক ৪: সাফল্য ও সমাপ্তি',
      scene: primaryScene,
      speaker: 'Leo',
      avatar: 'leo',
      pose: 'laughing',
      en: `Thanks, Maya! Exploring vocabulary through animated stories and real-world scenes makes learning English effortless!`,
      bn: `ধন্যবাদ, মায়া! বাস্তব দৃশ্য আর অ্যানিমেটেড গল্পের মাধ্যমে শব্দ শিখলে ইংরেজি শেখা সত্যিই সহজ ও আনন্দদায়ক হয়ে ওঠে!`,
      targetWord: null,
      approxDuration: 4.5
    }
  ];

  return {
    titleEn: sceneConfig.titleEn,
    titleBn: sceneConfig.titleBn,
    theme: transitionScene,
    sceneTheme: transitionScene,
    primaryScene: primaryScene,
    transitionScene: transitionScene,
    duration: 63,
    targetWord: cleanWord,
    lines: lines,
    conversation: lines
  };
}

function getWordCartoonConversation(wordObj) {
  if (!wordObj) return null;
  // If wordObj already has a rich 14-line cartoonConversation, use it
  if (wordObj.cartoonConversation && Array.isArray(wordObj.cartoonConversation.lines) && wordObj.cartoonConversation.lines.length >= 14) {
    return wordObj.cartoonConversation;
  }
  // Otherwise, generate the full 14-line 4-Act story
  const generated = generateCartoonConversation(wordObj);
  if (wordObj && typeof wordObj === 'object') {
    wordObj.sceneTheme = generated.sceneTheme || generated.theme;
    wordObj.conversation = generated.lines;
    wordObj.cartoonConversation = generated;
  }
  return generated;
}

function renderCartoonThumbnailCardHTML(wordItem) {
  if (!wordItem) return '';
  const conv = getWordCartoonConversation(wordItem);
  const theme = (conv && (conv.transitionScene || conv.sceneTheme || conv.theme)) || 'living_room';
  const duration = '01:03';
  const lines = (conv && Array.isArray(conv.lines)) ? conv.lines : [];
  const firstLine = (lines && lines[0]) ? lines[0] : null;
  const firstSpeaker = firstLine ? escapeHtml(firstLine.speaker || 'Maya') : 'Maya';
  const previewSnippet = firstLine ? escapeHtml(firstLine.en) : 'Practice ' + escapeHtml(wordItem.word) + ' with Maya & Leo.';
  const previewBn = firstLine ? escapeHtml(firstLine.bn) : '';
  const wordId = escapeHtml(wordItem.id || wordItem.word);
  const storyTitle = conv ? `${escapeHtml(conv.titleEn || 'Cartoon Short Story')} • ${escapeHtml(conv.titleBn || 'ছোট গল্প')}` : 'AI Short Story';
  const envObj = SCENE_ENVIRONMENTS[theme] || SCENE_ENVIRONMENTS.living_room;
  const themeLabel = envObj.label || '🏠 Living Room • বসার ঘর';

  // Group lines into 4 Acts for the interactive dialogue transcript
  const actIcons = { 1: '🌱', 2: '⚡', 3: '💡', 4: '🎉' };

  let currentActNumber = 0;
  const dialogueRowsHTML = lines.map((line, idx) => {
    const isMaya = line.avatar === 'maya' || line.speaker === 'Maya';
    const speakerName = escapeHtml(line.speaker || (isMaya ? 'Maya' : 'Leo'));
    const speakerInitial = isMaya ? 'M' : 'L';
    const speakerBg = isMaya ? 'var(--accent-sage-soft)' : 'var(--accent-terracotta-soft)';
    const speakerColor = isMaya ? 'var(--accent-sage)' : 'var(--accent-terracotta)';
    const highlightedEn = typeof highlightTargetWordInSubtitle === 'function'
      ? highlightTargetWordInSubtitle(line.en, line.targetWord || wordItem.word)
      : escapeHtml(line.en);
    const isActive = idx === 0;
    const estSec = Math.round(idx * 4.5);
    const timeStr = `0:${String(estSec).padStart(2, '0')}`;

    let actHeaderHtml = '';
    if (line.act && line.act !== currentActNumber) {
      currentActNumber = line.act;
      const icon = actIcons[line.act] || '📖';
      actHeaderHtml = `
        <div class="flex items-center gap-2 pt-2.5 pb-1 px-1">
          <span class="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs font-mono" style="background-color: var(--surface-white); border-color: var(--border-subtle); color: var(--ink-secondary);">
            ${icon} ${escapeHtml(line.actTitle || `Act ${line.act}`)}
          </span>
          <span class="font-bengali text-[10px] opacity-75 truncate" style="color: var(--ink-muted);">
            ${escapeHtml(line.actTitleBn || '')}
          </span>
        </div>
      `;
    }

    return `
      ${actHeaderHtml}
      <div
        class="vw-card-dialogue-row flex items-start gap-2.5 p-2 rounded-xl border transition-all cursor-pointer ${isActive ? 'is-first-line' : ''}"
        onclick="openCartoonVideoModal('${wordId}', ${idx})"
        title="Click to play dialogue from line ${idx + 1}"
        style="border-color: var(--border-subtle); background-color: var(--surface-white);"
      >
        <span
          class="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 shadow-2xs"
          style="background-color: ${speakerBg}; color: ${speakerColor};"
        >
          ${speakerInitial}
        </span>
        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between gap-1 mb-0.5">
            <span class="text-[10px] font-bold uppercase tracking-wider" style="color: ${speakerColor};">
              ${speakerName}
            </span>
            <span class="text-[9px] font-mono opacity-60" style="color: var(--ink-muted);">
              ${timeStr}
            </span>
          </div>
          <p class="text-xs font-semibold leading-snug" style="color: var(--ink-primary);">
            ${highlightedEn}
          </p>
          <p class="font-bengali text-[11px] mt-0.5 leading-snug" style="color: var(--ink-secondary);">
            (${escapeHtml(line.bn)})
          </p>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="vw-card-video-section w-full">
      <!-- Section Title & Topic Location Pill -->
      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style="background-color: var(--accent-sage-soft); color: var(--accent-sage);">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="15" x="2" y="7" rx="2" ry="2"/>
              <polyline points="17 2 12 7 7 2"/>
            </svg>
          </div>
          <div>
            <span class="font-editorial text-sm sm:text-base font-bold block leading-none" style="color: var(--ink-primary);">
              AI Cartoon Conversation Video
            </span>
            <span class="font-bengali text-[10px] sm:text-[11px] block mt-0.5" style="color: var(--ink-muted);">
              মায়া ও লিওর বাস্তব অ্যানিমেটেড ইংরেজি কথোপকথন • ১৪-লাইন ৪-অঙ্ক শর্ট স্টোরি
            </span>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <span class="font-bengali text-[11px] font-bold px-3 py-1 rounded-full border shadow-2xs" style="background-color: var(--accent-sage-soft); border-color: rgba(45, 90, 76, 0.2); color: var(--accent-sage);">
            ${themeLabel}
          </span>
        </div>
      </div>

      <!-- Spacious 2-Part Widescreen Grid (1.35fr : 1fr) -->
      <div class="vw-video-widescreen-grid">
        <!-- Left Side: 2D Flat-Vector Cartoon Stage (16:9) -->
        <div
          class="vw-cartoon-stage-card group rounded-2xl overflow-hidden border cursor-pointer relative shadow-xs flex flex-col justify-center"
          onclick="openCartoonVideoModal('${wordId}', 0)"
          title="Watch Maya & Leo in AI Cartoon Short Story for ${escapeHtml(wordItem.word)}"
          style="background-color: var(--surface-sand); border-color: var(--border-subtle);"
        >
          <div class="relative w-full aspect-video overflow-hidden">
            ${renderCartoonSceneSvg(theme, 'Maya', 'explaining', false)}

            <!-- Centered Play Button Overlay -->
            <div class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <div class="vw-cartoon-play-btn w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/95 shadow-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                <svg class="w-6 h-6 sm:w-7 sm:h-7 ml-0.5" style="color: var(--accent-sage);" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>

            <!-- Top-Left Badge: Watch Cartoon Conversation + pulsing dot -->
            <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs shadow-xs text-[#2D5A4C] text-[10px] sm:text-[11px] font-bold">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Watch Cartoon Conversation</span>
            </div>

            <!-- Top-Right: Location Badge & Timer Pill -->
            <div class="absolute top-2.5 right-2.5 flex items-center gap-1.5">
              <span class="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white/90 text-[10px] font-medium font-bengali">
                ${themeLabel}
              </span>
              <span class="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-mono font-bold tracking-wider">
                ${duration}<span class="sr-only hidden">0:18</span>
              </span>
            </div>

            <!-- Bottom Subtitle / Caption Bar Overlay -->
            <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2.5 sm:p-3 pt-6 text-white flex items-center justify-between gap-2">
              <div class="min-w-0 flex-1">
                <p class="text-[11px] sm:text-xs truncate font-medium">
                  <span class="font-bold text-[#FDE68A]">${firstSpeaker}:</span> &ldquo;${previewSnippet}&rdquo;
                </p>
                ${previewBn ? `<p class="font-bengali text-[10px] sm:text-[11px] truncate text-gray-300 mt-0.5">(${previewBn})</p>` : ''}
              </div>
              <span class="text-[10px] sm:text-xs font-bold text-emerald-300 shrink-0 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Play Scene</span> &rarr;
              </span>
            </div>
          </div>
        </div>

        <!-- Right Side: Synchronized Dialogue Script List + Controls Bar -->
        <div
          class="vw-card-dialogue-panel rounded-2xl border p-3 sm:p-3.5 flex flex-col justify-between shadow-2xs"
          style="background-color: var(--surface-sand); border-color: var(--border-subtle);"
        >
          <div class="mb-2 flex items-center justify-between gap-2">
            <span class="text-[10px] sm:text-xs font-bold uppercase tracking-wider" style="color: var(--ink-secondary);">
              Dialogue Script &bull; 4-Act Story (14 Lines)
            </span>
            <span class="font-bengali text-[10px] text-gray-500">
              ক্লিক করে সরাসরি শুনুন
            </span>
          </div>

          <!-- Dialogue Rows Container -->
          <div class="space-y-1.5 overflow-y-auto max-h-[220px] sm:max-h-[260px] pr-1">
            ${dialogueRowsHTML}
          </div>

          <!-- Controls Bar Alongside / Below -->
          <div class="flex items-center justify-between pt-2.5 px-0.5 border-t mt-2" style="border-color: var(--border-subtle);">
            <div class="flex items-center gap-1.5">
              <button
                type="button"
                onclick="openCartoonVideoModal('${wordId}', 0)"
                class="vw-btn-primary px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap"
                title="Play Video Conversation"
              >
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                <span>Play</span>
              </button>

              <button
                type="button"
                onclick="openCartoonVideoModal('${wordId}', 0)"
                class="px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 border transition-all cursor-pointer hover:bg-black/5 whitespace-nowrap"
                style="border-color: var(--border-subtle); color: var(--ink-secondary); background-color: var(--surface-white);"
                title="Replay from start"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                <span>Replay</span>
              </button>
            </div>

            <button
              type="button"
              onclick="openCartoonVideoModal('${wordId}', 0)"
              class="px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-mono font-bold border transition-colors hover:border-[#2D5A4C] cursor-pointer whitespace-nowrap"
              style="background-color: var(--surface-white); border-color: var(--border-subtle); color: var(--ink-secondary);"
              title="Playback Speed"
            >
              Speed: 1.0x / 0.8x
            </button>
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
  keepAliveInterval: null,
  showBengaliSubtitles: true,

  ensureModal() {
    let modal = document.getElementById('vw-cartoon-video-modal');
    if (!modal) {
      const div = document.createElement('div');
      div.id = 'vw-cartoon-video-modal';
      div.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm hidden';
      div.innerHTML = `
        <div class="fixed inset-0" onclick="CartoonPlayer.close()"></div>
        <div
          class="relative w-full max-w-3xl rounded-3xl border shadow-2xl z-10 flex flex-col overflow-hidden max-h-[94vh] vw-view-enter"
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
                  Short Story &bull; মায়া ও লিওর বাস্তব অ্যানিমেটেড ইংরেজি কথোপকথন
                </p>
              </div>
            </div>

            <!-- Accent Switcher Pill [ UK | US | AU | CA ] & Close button -->
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
                <button
                  type="button"
                  data-accent="CA"
                  onclick="CartoonPlayer.setAccent('CA')"
                  class="vw-cv-accent-btn px-2.5 py-1 rounded-full text-xs font-bold transition-all"
                  title="Canadian Accent (CA)"
                >
                  🇨🇦 CA
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
              <!-- 2D SVG Stage -->
              <div id="vw-cv-stage" class="w-full h-full"></div>

              <!-- Top Floating Badges (Act badge & Scene Pill) -->
              <div class="absolute top-3 right-3 flex items-center gap-1.5 pointer-events-none">
                <span id="vw-cv-act-pill" class="px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-emerald-300 text-[10px] sm:text-[11px] font-bold font-mono tracking-wide border border-emerald-500/30">
                  Act 1: Setup
                </span>
              </div>

              <!-- White Rounded Subtitles Floating Box Overlay (Botanical Sage #2D5A4C Highlight) -->
              <div class="absolute bottom-12 inset-x-3 sm:inset-x-6 flex justify-center pointer-events-none">
                <div id="vw-cv-subtitles-box" class="vw-cv-subtitles-box rounded-2xl px-4 py-2 text-center max-w-[92%] shadow-xl pointer-events-auto transition-all" style="background: rgba(255, 255, 255, 0.96); backdrop-filter: blur(12px); border: 1.5px solid rgba(45, 90, 76, 0.25);">
                  <p id="vw-cv-sub-en" class="text-xs sm:text-sm md:text-base font-semibold text-gray-900 leading-snug"></p>
                  <p id="vw-cv-sub-bn" class="font-bengali text-[11px] sm:text-xs text-[#2D5A4C] font-medium mt-1 leading-snug"></p>
                </div>
              </div>

              <!-- YouTube-Style Controls Bar Overlay -->
              <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent px-3 py-2 pt-6">
                <!-- Scrubber Track across all 14 lines -->
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
                  <div class="flex items-center gap-1.5 sm:gap-2.5">
                    <!-- Prev Line Button -->
                    <button
                      type="button"
                      onclick="CartoonPlayer.prevLine()"
                      class="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                      title="Previous Line (পূর্ববর্তী লাইন)"
                    >
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                    </button>

                    <!-- Play / Pause Button -->
                    <button
                      type="button"
                      id="vw-cv-play-btn"
                      onclick="CartoonPlayer.togglePlay()"
                      class="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                      title="Play / Pause"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    </button>

                    <!-- Next Line Button -->
                    <button
                      type="button"
                      onclick="CartoonPlayer.nextLine()"
                      class="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                      title="Next Line (পরবর্তী লাইন)"
                    >
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                    </button>

                    <!-- Replay Button -->
                    <button
                      type="button"
                      onclick="CartoonPlayer.replay()"
                      class="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                      title="Replay from start (শুরু থেকে আবার চালান)"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                    </button>

                    <span id="vw-cv-time" class="font-mono text-[11px] text-gray-300">0:00 / 01:03</span>
                  </div>

                  <!-- Active Speaker Pill -->
                  <div id="vw-cv-speaker-badge" class="hidden xs:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/15 backdrop-blur-xs">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span id="vw-cv-speaker-name">Maya Speaking</span>
                  </div>

                  <div class="flex items-center gap-2">
                    <!-- Toggle Bengali Subtitles Button -->
                    <button
                      type="button"
                      id="vw-cv-toggle-bn-btn"
                      onclick="CartoonPlayer.toggleBengaliSubtitles()"
                      class="px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors hover:bg-white/20"
                      style="border-color: rgba(255,255,255,0.4);"
                      title="Toggle Bengali Subtitles (বাংলা সাবটাইটেল দেখান/লুকান)"
                    >
                      BN: ON
                    </button>

                    <!-- Speed Toggle Button (0.8x / 1.0x / 1.2x) -->
                    <button
                      type="button"
                      id="vw-cv-speed-btn"
                      onclick="CartoonPlayer.toggleSpeed()"
                      class="px-2 py-0.5 rounded-full text-[11px] font-bold border hover:bg-white/20 transition-colors"
                      style="border-color: rgba(255,255,255,0.4);"
                      title="Playback Speed (গতি পরিবর্তন)"
                    >
                      1.0x
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. Dialogue Transcript (14 Clickable Interactive Lines across 4 Acts) -->
            <div class="rounded-2xl border p-4 space-y-2.5" style="background-color: var(--surface-sand); border-color: var(--border-subtle);">
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs font-bold uppercase tracking-wider" style="color: var(--ink-secondary);">
                  Interactive Short Story Transcript &bull; ১৪-লাইন ৪-অঙ্ক স্ক্রিপ্ট
                </span>
                <span class="font-bengali text-[11px]" style="color: var(--ink-muted);">
                  যেকোনো লাইনে ক্লিক করে সরাসরি শুনুন
                </span>
              </div>

              <div id="vw-cv-transcript-list" class="space-y-2 max-h-[320px] overflow-y-auto pr-1"></div>
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
      showToast(`কার্টুন বাচনভঙ্গি: ${acc.name} (${acc.shortLabel})`);
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

  toggleBengaliSubtitles() {
    this.showBengaliSubtitles = !this.showBengaliSubtitles;
    const subBn = document.getElementById('vw-cv-sub-bn');
    const btn = document.getElementById('vw-cv-toggle-bn-btn');
    if (subBn) {
      subBn.style.display = this.showBengaliSubtitles ? 'block' : 'none';
    }
    if (btn) {
      btn.textContent = this.showBengaliSubtitles ? 'BN: ON' : 'BN: OFF';
      btn.style.opacity = this.showBengaliSubtitles ? '1' : '0.6';
    }
  },

  open(wordId, startLineIdx = 0) {
    this.ensureModal();
    let foundWord = null;
    if (typeof CURRICULUM_DATA !== 'undefined') {
      for (const lvlKey of Object.keys(CURRICULUM_DATA)) {
        const lvl = CURRICULUM_DATA[lvlKey];
        if (lvl && Array.isArray(lvl.words)) {
          const w = lvl.words.find(x => String(x.id).toLowerCase() === String(wordId).toLowerCase() || String(x.word).toLowerCase() === String(wordId).toLowerCase());
          if (w) { foundWord = w; break; }
        }
        if (lvl && Array.isArray(lvl.practiceExtraWords)) {
          const w = lvl.practiceExtraWords.find(x => String(x.id).toLowerCase() === String(wordId).toLowerCase() || String(x.word).toLowerCase() === String(wordId).toLowerCase());
          if (w) { foundWord = w; break; }
        }
      }
    }
    if (!foundWord && typeof getCustomWords === 'function') {
      const customs = getCustomWords();
      foundWord = customs.find(x => String(x.id).toLowerCase() === String(wordId).toLowerCase() || String(x.word).toLowerCase() === String(wordId).toLowerCase());
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
    if (!this.conv || !Array.isArray(this.conv.lines) || this.conv.lines.length < 14) {
      this.conv = generateCartoonConversation(foundWord);
    }

    const initialLine = (typeof startLineIdx === 'number' && startLineIdx >= 0) ? startLineIdx : 0;
    this.lineIdx = initialLine;
    this.isPlaying = true;
    this.isOpen = true;
    this.accent = (typeof getActiveAccent === 'function') ? getActiveAccent().id : 'US';
    this.updateAccentPills();

    // Start 8-second keep-alive interval for speech synthesis to prevent Chrome 15s freeze
    if (!this.keepAliveInterval) {
      this.keepAliveInterval = setInterval(() => {
        if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 8000);
    }

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

    const titleEn = this.conv.titleEn || 'Cartoon Short Story';
    const titleBn = this.conv.titleBn || 'ছোট গল্প';
    if (sceneEl) sceneEl.textContent = `${titleEn} • ${titleBn} • মায়া ও লিওর অ্যানিমেশন`;

    this.renderTranscriptList();

    const modal = document.getElementById('vw-cartoon-video-modal');
    if (modal) modal.classList.remove('hidden');

    this.playLine(this.lineIdx);
  },

  renderTranscriptList() {
    const listEl = document.getElementById('vw-cv-transcript-list');
    if (!listEl || !this.conv || !this.conv.lines) return;

    const actIcons = { 1: '🌱', 2: '⚡', 3: '💡', 4: '🎉' };
    let currentActNum = 0;

    listEl.innerHTML = this.conv.lines
      .map((line, idx) => {
        const isMaya = line.avatar === 'maya' || line.speaker === 'Maya';
        const speakerColor = isMaya ? 'var(--accent-sage)' : 'var(--accent-terracotta)';
        const speakerBg = isMaya ? 'var(--accent-sage-soft)' : 'var(--accent-terracotta-soft)';
        const highlightedEn = highlightTargetWordInSubtitle(line.en, line.targetWord || this.currentWord.word);
        const estSec = Math.round(idx * 4.5);
        const timeStr = `0:${String(estSec).padStart(2, '0')}`;

        let actHeader = '';
        if (line.act && line.act !== currentActNum) {
          currentActNum = line.act;
          const icon = actIcons[line.act] || '📖';
          actHeader = `
            <div class="flex items-center gap-2 pt-2.5 pb-1 px-1">
              <span class="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs font-mono" style="background-color: var(--surface-white); border-color: var(--border-subtle); color: var(--ink-secondary);">
                ${icon} ${escapeHtml(line.actTitle || `Act ${line.act}`)}
              </span>
              <span class="font-bengali text-[10px] opacity-75 truncate" style="color: var(--ink-muted);">
                ${escapeHtml(line.actTitleBn || '')}
              </span>
            </div>
          `;
        }

        return `
          ${actHeader}
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
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-bold uppercase tracking-wider block" style="color: ${speakerColor};">
                    ${escapeHtml(line.speaker)}
                  </span>
                  <span class="text-[9px] font-mono px-1.5 py-0.2 rounded" style="background-color: var(--surface-sand); color: var(--ink-muted);">
                    ${escapeHtml(line.pose || 'speaking')}
                  </span>
                </div>
                <p class="text-xs sm:text-sm font-semibold mt-0.5 leading-snug" style="color: var(--ink-primary);">
                  ${highlightedEn}
                </p>
                <p class="font-bengali text-xs mt-1 leading-snug" style="color: var(--ink-secondary);">
                  (${escapeHtml(line.bn)})
                </p>
              </div>
            </div>

            <span class="text-xs font-mono shrink-0 px-2 py-0.5 rounded-full" style="background-color: var(--surface-sand); color: var(--ink-muted);">
              ${timeStr}
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

    // Cancel existing speech immediately before starting the next line
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
    const currentScene = line.scene || this.conv.transitionScene || this.conv.theme || 'living_room';
    const isMaya = line.avatar === 'maya' || line.speaker === 'Maya';

    // 1. Render Scene with dynamic pose & active speaking state
    const stageEl = document.getElementById('vw-cv-stage');
    if (stageEl) {
      stageEl.innerHTML = renderCartoonSceneSvg(currentScene, line.speaker, line.pose || 'neutral', true);
    }

    // 2. Update Act Badge Pill
    const actPill = document.getElementById('vw-cv-act-pill');
    if (actPill) {
      actPill.textContent = `${line.actTitle || 'Act ' + line.act} • ${line.actTitleBn || ''}`;
    }

    // 3. Update Subtitles with bold Botanical Sage (#2D5A4C) target word highlight
    const subEn = document.getElementById('vw-cv-sub-en');
    const subBn = document.getElementById('vw-cv-sub-bn');
    if (subEn) {
      subEn.innerHTML = highlightTargetWordInSubtitle(line.en, line.targetWord || this.currentWord.word);
    }
    if (subBn) {
      subBn.textContent = line.bn;
      subBn.style.display = this.showBengaliSubtitles ? 'block' : 'none';
    }

    // 4. Update Speaker Badge
    const speakerBadge = document.getElementById('vw-cv-speaker-badge');
    const speakerName = document.getElementById('vw-cv-speaker-name');
    if (speakerBadge) speakerBadge.classList.remove('hidden');
    if (speakerName) speakerName.textContent = line.speaker + ' Speaking';

    // 5. Highlight active transcript item & scroll smoothly into view
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

    // 6. Estimate Expected Duration for Progress Animation
    this.lineStartTime = performance.now();
    const wordCount = line.en.split(/\s+/).filter(Boolean).length;
    this.lineExpectedDuration = Math.max(3800, (wordCount / (this.speed * 2.2)) * 1000);

    const totalLines = this.conv.lines.length;
    const totalEstDuration = totalLines * 4.5;

    const animProgress = (now) => {
      if (!this.isPlaying || this.lineIdx !== idx) return;
      const elapsed = now - this.lineStartTime;
      const lineRatio = Math.min(1, elapsed / this.lineExpectedDuration);
      const overallRatio = (idx + lineRatio) / totalLines;
      this.updateScrubber(overallRatio);

      const curSec = Math.min(Math.round(totalEstDuration), Math.round(overallRatio * totalEstDuration));
      const timeEl = document.getElementById('vw-cv-time');
      if (timeEl) {
        const mins = Math.floor(curSec / 60);
        const secs = curSec % 60;
        timeEl.textContent = `${mins}:${String(secs).padStart(2, '0')} / 01:03`;
      }

      if (lineRatio < 1) {
        this.progressRaf = requestAnimationFrame(animProgress);
      }
    };
    this.progressRaf = requestAnimationFrame(animProgress);

    // 7. ZERO-CUTOFF SPEECH ENGINE
    // - window.__activeUtterance reference avoids Chrome garbage collection
    // - 75ms post-cancel delay prevents audio swallow bug
    // - Advance line ONLY on utterance.onend after a 480ms natural pause
    let speechInitiated = false;

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
        utterance.pitch = isMaya ? 1.2 : 0.85;

        // Apply playback speed
        if (this.speed === 0.8) {
          utterance.rate = 0.78;
        } else if (this.speed === 1.2) {
          utterance.rate = 1.15;
        } else {
          utterance.rate = 0.94;
        }

        // Advance line ONLY when sentence finishes naturally!
        utterance.onend = () => {
          window.__activeUtterance = null;
          if (this.lineIdx === idx && this.isPlaying) {
            if (stageEl) {
              stageEl.innerHTML = renderCartoonSceneSvg(currentScene, line.speaker, line.pose || 'neutral', false);
            }
            this.timer = setTimeout(() => {
              this.playLine(idx + 1);
            }, 480);
          }
        };

        utterance.onerror = (err) => {
          window.__activeUtterance = null;
          if (this.lineIdx === idx && this.isPlaying) {
            if (stageEl) {
              stageEl.innerHTML = renderCartoonSceneSvg(currentScene, line.speaker, line.pose || 'neutral', false);
            }
            this.timer = setTimeout(() => {
              this.playLine(idx + 1);
            }, 480);
          }
        };

        // Post-cancel delay of 75ms before speaking prevents audio cutoff on Windows/Chrome
        speechInitiated = true;
        this.timer = setTimeout(() => {
          if (!this.isPlaying || this.lineIdx !== idx) return;
          try {
            window.__activeUtterance = utterance;
            window.speechSynthesis.speak(utterance);
          } catch (e) {
            // Fallback if speak throws
            this.playLine(idx + 1);
          }
        }, 75);

      } catch (err) {
        speechInitiated = false;
      }
    }

    // Safety fallback: ONLY used if SpeechSynthesis is completely unsupported in the browser
    if (!speechInitiated) {
      this.timer = setTimeout(() => {
        if (this.lineIdx === idx && this.isPlaying) {
          if (stageEl) {
            stageEl.innerHTML = renderCartoonSceneSvg(currentScene, line.speaker, line.pose || 'neutral', false);
          }
          this.timer = setTimeout(() => {
            this.playLine(idx + 1);
          }, 480);
        }
      }, this.lineExpectedDuration);
    }
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
      if (this.timer) { clearTimeout(this.timer); this.timer = null; }
      if (this.progressRaf) { cancelAnimationFrame(this.progressRaf); this.progressRaf = null; }
      if ('speechSynthesis' in window) {
        try { window.speechSynthesis.cancel(); } catch (e) {}
      }
      this.updatePlayBtn();
      const stageEl = document.getElementById('vw-cv-stage');
      if (stageEl && this.conv && this.conv.lines[this.lineIdx]) {
        const line = this.conv.lines[this.lineIdx];
        stageEl.innerHTML = renderCartoonSceneSvg(line.scene, line.speaker, line.pose || 'neutral', false);
      }
    } else {
      this.isPlaying = true;
      this.updatePlayBtn();
      this.playLine(this.lineIdx);
    }
  },

  replay() {
    this.playLine(0);
  },

  prevLine() {
    const targetIdx = Math.max(0, this.lineIdx - 1);
    this.playLine(targetIdx);
  },

  nextLine() {
    const maxIdx = (this.conv && this.conv.lines) ? this.conv.lines.length - 1 : 13;
    const targetIdx = Math.min(maxIdx, this.lineIdx + 1);
    this.playLine(targetIdx);
  },

  toggleSpeed() {
    if (this.speed === 1.0) {
      this.speed = 1.2;
    } else if (this.speed === 1.2) {
      this.speed = 0.8;
    } else {
      this.speed = 1.0;
    }
    const btn = document.getElementById('vw-cv-speed-btn');
    if (btn) btn.textContent = this.speed.toFixed(1) + 'x';
    if (this.isPlaying) {
      this.playLine(this.lineIdx);
    }
  },

  jumpToLine(idx) {
    if (typeof idx === 'number' && this.conv && idx >= 0 && idx < this.conv.lines.length) {
      this.playLine(idx);
    }
  },

  handleScrubberClick(e) {
    const scrubber = document.getElementById('vw-cv-scrubber');
    if (!scrubber || !this.conv || !this.conv.lines) return;
    const rect = scrubber.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetIdx = Math.min(this.conv.lines.length - 1, Math.floor(ratio * this.conv.lines.length));
    this.jumpToLine(targetIdx);
  },

  close() {
    this.isOpen = false;
    this.isPlaying = false;
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
    if (this.progressRaf) { cancelAnimationFrame(this.progressRaf); this.progressRaf = null; }
    if (this.keepAliveInterval) { clearInterval(this.keepAliveInterval); this.keepAliveInterval = null; }
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
    window.__activeUtterance = null;
    const modal = document.getElementById('vw-cartoon-video-modal');
    if (modal) modal.classList.add('hidden');
  }
};
window.CartoonPlayer = CartoonPlayer;

function openCartoonVideoModal(wordId, startLineIdx = 0) {
  CartoonPlayer.open(wordId, startLineIdx);
}

function closeCartoonVideoModal() {
  CartoonPlayer.close();
}



/* =====================================================================
   8. INTERACTIVE FEEDBACK SYSTEM (Floating Button, Modal, Category,
      Emoji Ratings, Context Capture, History & Storage)
   ===================================================================== */
const FEEDBACK_CATEGORIES = {
  general: {
    id: 'general',
    label: 'General',
    bengali: 'সাধারণ মতামত',
    icon: '🌟',
    placeholder: 'Vocabulary World সম্পর্কে আপনার সাধারণ মতামত বা অভিজ্ঞতা শেয়ার করুন... (Share your general thoughts or impressions)'
  },
  feature: {
    id: 'feature',
    label: 'Feature Request',
    bengali: 'নতুন ফিচার প্রস্তাব',
    icon: '💡',
    placeholder: 'আপনি Vocabulary World এ কোন নতুন ফিচার, স্টাডি মোড বা গেম দেখতে চান? (What new feature, study mode, or game would you like to see?)'
  },
  bug: {
    id: 'bug',
    label: 'Bug / Issue',
    bengali: 'সমস্যা / বাগ রিপোর্ট',
    icon: '🐛',
    placeholder: 'কোন পেজে কী সমস্যা হচ্ছে বিস্তারিত লিখুন। যেমন: কোনো বাটন কাজ না করা, সাউন্ড না আসা ইত্যাদি... (Please describe the bug or issue)'
  },
  correction: {
    id: 'correction',
    label: 'Word Correction',
    bengali: 'শব্দ বা অর্থ সংশোধন',
    icon: '📚',
    placeholder: 'কোন শব্দের বানান, বাংলা অর্থ, উচ্চারণ বা উদাহরণ বাক্যে সংশোধন প্রয়োজন তা উল্লেখ করুন... (Which word, meaning, or sentence needs fixing?)'
  }
};

const FEEDBACK_RATINGS = [
  { score: 1, emoji: '😡', label: 'Poor', bn: 'খারাপ' },
  { score: 2, emoji: '😕', label: 'Fair', bn: 'চলনসই' },
  { score: 3, emoji: '😐', label: 'Good', bn: 'মোটামুটি' },
  { score: 4, emoji: '😊', label: 'Very Good', bn: 'ভালো' },
  { score: 5, emoji: '🤩', label: 'Excellent', bn: 'দারুণ!' }
];

let currentFeedbackCategory = 'general';
let currentFeedbackRating = 5;
let currentFeedbackTab = 'form'; // 'form' or 'history'

function getCurrentAppContext() {
  let file = 'index.html';
  if (typeof window !== 'undefined' && window.location) {
    const path = (window.location.pathname || '').toLowerCase();
    file = path.split('/').pop().split('\\').pop() || 'index.html';
  }

  let pageTitle = 'Home (লেভেল নির্বাচন)';
  if (file === 'learn.html') pageTitle = 'Learn (শব্দ শিক্ষা)';
  else if (file === 'flashcards.html') pageTitle = 'Flashcards (ফ্ল্যাশকার্ড)';
  else if (file === 'games.html') pageTitle = 'Games (গেমস)';
  else if (file === 'tracker.html') pageTitle = 'Tracker (ট্র্যাকার)';
  else if (file === 'add-words.html') pageTitle = '+ Add Words (শব্দ যোগ)';
  else if (file === 'assessment.html') pageTitle = 'Assessment (যাচাই)';

  let level = 'beginner';
  if (typeof AppState !== 'undefined' && AppState.selectedLevel) {
    level = AppState.selectedLevel;
  } else if (typeof localStorage !== 'undefined') {
    level = localStorage.getItem('vw_selected_level') || 'beginner';
  }

  let accent = 'en-GB';
  if (typeof getActiveAccent === 'function') {
    try {
      accent = getActiveAccent().code;
    } catch (e) {}
  }

  let theme = 'Light';
  if (typeof document !== 'undefined' && document.documentElement) {
    theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'Dark' : 'Light';
  }

  return {
    file,
    pageTitle,
    level,
    accent,
    theme
  };
}

function getStoredFeedbacks() {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FEEDBACKS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveStoredFeedbacks(feedbacks) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(feedbacks));
  } catch (e) {}
}

function selectFeedbackCategory(catId) {
  if (!FEEDBACK_CATEGORIES[catId]) catId = 'general';
  currentFeedbackCategory = catId;

  if (typeof document !== 'undefined') {
    const catBtns = document.querySelectorAll('.vw-fb-cat-btn');
    catBtns.forEach(btn => {
      if (btn.getAttribute('data-category') === catId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const textarea = document.getElementById('vw-fb-message');
    if (textarea) {
      textarea.placeholder = FEEDBACK_CATEGORIES[catId].placeholder;
    }
  }
}

function setFeedbackRating(score) {
  score = parseInt(score, 10);
  if (isNaN(score) || score < 1 || score > 5) score = 5;
  currentFeedbackRating = score;

  if (typeof document !== 'undefined') {
    const ratingBtns = document.querySelectorAll('.vw-fb-rating-btn');
    ratingBtns.forEach(btn => {
      const s = parseInt(btn.getAttribute('data-score'), 10);
      if (s === score) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const meta = FEEDBACK_RATINGS.find(r => r.score === score) || FEEDBACK_RATINGS[4];
    const labelEl = document.getElementById('vw-fb-rating-label');
    if (labelEl) {
      labelEl.innerHTML = `${meta.emoji} ${meta.label} &bull; ${meta.bn}`;
    }
  }
}

function updateFeedbackCharCount() {
  if (typeof document === 'undefined') return;
  const textarea = document.getElementById('vw-fb-message');
  const countEl = document.getElementById('vw-fb-char-count');
  const counterWrapper = document.getElementById('vw-fb-char-counter');
  if (!textarea || !countEl) return;

  const len = textarea.value.length;
  countEl.textContent = len;

  if (len >= 500) {
    if (counterWrapper) counterWrapper.style.color = '#DC2626';
  } else {
    if (counterWrapper) counterWrapper.style.color = 'var(--ink-muted)';
  }
}

function switchFeedbackTab(tabId) {
  currentFeedbackTab = tabId;
  if (typeof document === 'undefined') return;

  const writeBtn = document.getElementById('vw-fb-tab-write-btn');
  const historyBtn = document.getElementById('vw-fb-tab-history-btn');
  const formView = document.getElementById('vw-fb-form-view');
  const historyView = document.getElementById('vw-fb-history-view');

  if (tabId === 'history') {
    if (formView) formView.classList.add('hidden');
    if (historyView) historyView.classList.remove('hidden');

    if (writeBtn) {
      writeBtn.style.backgroundColor = 'transparent';
      writeBtn.style.color = 'var(--ink-muted)';
      writeBtn.style.boxShadow = 'none';
    }
    if (historyBtn) {
      historyBtn.style.backgroundColor = 'var(--surface-white)';
      historyBtn.style.color = 'var(--accent-sage)';
      historyBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.06)';
    }

    renderFeedbackHistoryList();
  } else {
    if (formView) formView.classList.remove('hidden');
    if (historyView) historyView.classList.add('hidden');

    if (writeBtn) {
      writeBtn.style.backgroundColor = 'var(--surface-white)';
      writeBtn.style.color = 'var(--accent-sage)';
      writeBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.06)';
    }
    if (historyBtn) {
      historyBtn.style.backgroundColor = 'transparent';
      historyBtn.style.color = 'var(--ink-muted)';
      historyBtn.style.boxShadow = 'none';
    }
  }
}

function renderFeedbackHistoryList() {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('vw-fb-history-list');
  const clearBtn = document.getElementById('vw-fb-clear-all-btn');
  if (!container) return;

  const feedbacks = getStoredFeedbacks();
  if (clearBtn) {
    clearBtn.style.display = feedbacks.length > 0 ? 'inline-flex' : 'none';
  }

  if (feedbacks.length === 0) {
    container.innerHTML = `
      <div class="text-center py-10 px-4">
        <div class="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3" style="background-color: var(--surface-sand); color: var(--ink-muted);">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
        </div>
        <p class="font-bengali text-sm font-bold" style="color: var(--ink-primary);">কোনো পূর্ববর্তী মতামত পাওয়া যায়নি</p>
        <p class="text-xs mt-1" style="color: var(--ink-muted);">You have not submitted any feedback yet.</p>
        <button
          type="button"
          onclick="switchFeedbackTab('form')"
          class="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-opacity hover:opacity-90 cursor-pointer"
          style="background-color: var(--accent-sage);"
        >
          Write Feedback &bull; প্রথম মতামত দিন
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = feedbacks
    .map(item => {
      const cat = FEEDBACK_CATEGORIES[item.category] || FEEDBACK_CATEGORIES.general;
      const rating = FEEDBACK_RATINGS.find(r => r.score === item.rating) || FEEDBACK_RATINGS[4];
      const dateStr = item.timestamp
        ? new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        : 'Recently';

      return `
        <div class="vw-fb-history-item" id="fb-item-${item.id}">
          <div class="flex items-center justify-between gap-2 mb-2">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 border" style="background-color: var(--surface-sand); border-color: var(--border-subtle); color: var(--accent-sage);">
                <span>${cat.icon}</span>
                <span>${cat.label}</span>
              </span>
              <span class="text-xs font-bold flex items-center gap-1" title="Rating: ${rating.label}">
                <span>${rating.emoji}</span>
                <span class="text-[11px] font-mono" style="color: var(--ink-muted);">${item.rating}/5</span>
              </span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-md font-bold" style="background-color: var(--surface-sand); color: var(--ink-muted);">
                ${item.refId || '#FB'}
              </span>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-[10px]" style="color: var(--ink-muted);">${dateStr}</span>
              <button
                type="button"
                onclick="deleteFeedbackItem('${item.id}')"
                class="w-6 h-6 rounded-full flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                title="Delete this feedback &bull; মুছে ফেলুন"
                aria-label="Delete feedback"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </div>
          <p class="text-xs leading-relaxed font-medium whitespace-pre-wrap break-words" style="color: var(--ink-primary);">
            ${escapeHtml(item.message || '')}
          </p>
          <div class="mt-2.5 pt-2 border-t flex items-center justify-between text-[10px] flex-wrap gap-1" style="border-color: var(--border-subtle); color: var(--ink-muted);">
            <span>${item.name ? `By: <strong>${escapeHtml(item.name)}</strong>` : 'By: Guest Learner'}</span>
            <span class="font-mono">📍 ${escapeHtml(item.pageTitle || item.page || 'Home')} &bull; ${escapeHtml(item.level || '')}</span>
          </div>
        </div>
      `;
    })
    .join('');
}

function deleteFeedbackItem(id) {
  let feedbacks = getStoredFeedbacks();
  feedbacks = feedbacks.filter(f => f.id !== id);
  saveStoredFeedbacks(feedbacks);
  renderFeedbackHistoryList();
  updateFeedbackFloatingBadge();
  if (typeof showToast === 'function') {
    showToast('মতামত মুছে ফেলা হয়েছে।');
  }
}

function clearAllFeedbacks() {
  if (typeof confirm === 'function' && !confirm('আপনি কি আপনার সকল পূর্ববর্তী মতামত মুছে ফেলতে চান? (Clear all feedbacks?)')) {
    return;
  }
  saveStoredFeedbacks([]);
  renderFeedbackHistoryList();
  updateFeedbackFloatingBadge();
  if (typeof showToast === 'function') {
    showToast('সকল মতামত সফলভাবে মুছে ফেলা হয়েছে।');
  }
}

function handleFeedbackSubmit(event) {
  if (event && event.preventDefault) event.preventDefault();
  if (typeof document === 'undefined') return;

  const messageInput = document.getElementById('vw-fb-message');
  if (!messageInput) return;
  const message = messageInput.value.trim();
  if (!message) {
    if (typeof showToast === 'function') showToast('অনুগ্রহ করে আপনার মতামত বা বার্তা লিখুন।');
    messageInput.focus();
    return;
  }

  const nameInput = document.getElementById('vw-fb-name');
  const emailInput = document.getElementById('vw-fb-email');
  const name = nameInput ? nameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const ctx = getCurrentAppContext();
  const refId = '#FB-' + Math.floor(1000 + Math.random() * 9000);

  const feedbackObj = {
    id: 'fb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    refId: refId,
    category: currentFeedbackCategory || 'general',
    rating: currentFeedbackRating || 5,
    message: message,
    name: name,
    email: email,
    page: ctx.file,
    pageTitle: ctx.pageTitle,
    level: ctx.level,
    accent: ctx.accent,
    theme: ctx.theme,
    timestamp: Date.now()
  };

  const feedbacks = getStoredFeedbacks();
  feedbacks.unshift(feedbackObj);
  saveStoredFeedbacks(feedbacks);

  updateFeedbackFloatingBadge();

  // Show Success View
  const formEl = document.getElementById('vw-feedback-form');
  const successPane = document.getElementById('vw-fb-success-pane');
  const successRef = document.getElementById('vw-fb-success-ref');
  if (formEl) formEl.classList.add('hidden');
  if (successPane) successPane.classList.remove('hidden');
  if (successRef) successRef.textContent = refId;

  if (typeof showToast === 'function') {
    showToast('ধন্যবাদ! আপনার মতামত সফলভাবে জমা হয়েছে।');
  }
}

function resetFeedbackForm() {
  if (typeof document === 'undefined') return;
  const formEl = document.getElementById('vw-feedback-form');
  const successPane = document.getElementById('vw-fb-success-pane');
  if (formEl) {
    formEl.reset();
    formEl.classList.remove('hidden');
  }
  if (successPane) successPane.classList.add('hidden');

  selectFeedbackCategory('general');
  setFeedbackRating(5);
  updateFeedbackCharCount();

  // Re-autofill profile if available
  if (typeof getStoredUserProfile === 'function') {
    const profile = getStoredUserProfile();
    const nameInput = document.getElementById('vw-fb-name');
    const emailInput = document.getElementById('vw-fb-email');
    if (profile) {
      if (nameInput && !nameInput.value) nameInput.value = profile.name || '';
      if (emailInput && !emailInput.value) emailInput.value = profile.email || '';
    }
  }

  const textarea = document.getElementById('vw-fb-message');
  if (textarea) textarea.focus();
}

function updateFeedbackFloatingBadge() {
  if (typeof document === 'undefined') return;
  const feedbacks = getStoredFeedbacks();
  const count = feedbacks.length;
  const floatingCountEl = document.getElementById('vw-fb-floating-count');
  const tabCountEl = document.getElementById('vw-fb-tab-count');

  if (tabCountEl) {
    tabCountEl.textContent = count;
  }

  if (floatingCountEl) {
    if (count > 0) {
      floatingCountEl.textContent = count > 99 ? '99+' : count;
      floatingCountEl.classList.remove('hidden');
    } else {
      floatingCountEl.classList.add('hidden');
    }
  }
}

function openFeedbackModal(category = 'general') {
  ensureFeedbackWidget();
  if (typeof document === 'undefined') return;

  switchFeedbackTab('form');
  if (category) {
    selectFeedbackCategory(category);
  }

  const ctx = getCurrentAppContext();
  const summaryEl = document.getElementById('vw-fb-context-summary');
  if (summaryEl) {
    summaryEl.textContent = `Page: ${ctx.pageTitle} • Level: ${ctx.level} • Accent: ${ctx.accent} • Theme: ${ctx.theme}`;
  }

  if (typeof getStoredUserProfile === 'function') {
    const profile = getStoredUserProfile();
    const nameInput = document.getElementById('vw-fb-name');
    const emailInput = document.getElementById('vw-fb-email');
    if (profile) {
      if (nameInput && !nameInput.value) nameInput.value = profile.name || '';
      if (emailInput && !emailInput.value) emailInput.value = profile.email || '';
    }
  }

  const modal = document.getElementById('vw-feedback-modal');
  if (modal) modal.classList.remove('hidden');

  updateFeedbackFloatingBadge();

  setTimeout(() => {
    const textarea = document.getElementById('vw-fb-message');
    if (textarea) textarea.focus();
  }, 100);
}

function closeFeedbackModal() {
  if (typeof document === 'undefined') return;
  const modal = document.getElementById('vw-feedback-modal');
  if (modal) modal.classList.add('hidden');
}

function ensureFeedbackWidget() {
  if (typeof document === 'undefined' || !document.body) return;
  ensureAITutorWidget();

  // 1. Floating Trigger Button
  if (!document.getElementById('vw-feedback-floating-btn')) {
    const floatingBtn = document.createElement('button');
    floatingBtn.type = 'button';
    floatingBtn.id = 'vw-feedback-floating-btn';
    floatingBtn.onclick = () => openFeedbackModal();
    floatingBtn.className = 'vw-feedback-floating-btn';
    floatingBtn.title = 'Share Feedback &bull; আপনার মতামত বা পরামর্শ দিন';
    floatingBtn.setAttribute('aria-label', 'Give feedback');
    floatingBtn.innerHTML = `
      <span class="feedback-icon">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </span>
      <span class="font-bengali text-xs">মতামত</span>
      <span id="vw-fb-floating-count" class="hidden px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#2D5A4C] text-white">0</span>
    `;
    document.body.appendChild(floatingBtn);
  }

  // 2. Interactive Feedback Modal
  if (!document.getElementById('vw-feedback-modal')) {
    const modalDiv = document.createElement('div');
    modalDiv.id = 'vw-feedback-modal';
    modalDiv.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm hidden';
    modalDiv.setAttribute('role', 'dialog');
    modalDiv.setAttribute('aria-modal', 'true');
    modalDiv.setAttribute('aria-labelledby', 'vw-fb-modal-title');
    modalDiv.innerHTML = `
      <!-- Backdrop Clickable Overlay -->
      <div class="fixed inset-0" onclick="closeFeedbackModal()"></div>

      <!-- Modal Container Card -->
      <div
        class="relative w-full max-w-xl rounded-3xl border shadow-2xl z-10 flex flex-col overflow-hidden max-h-[92vh] vw-view-enter"
        style="background-color: var(--surface-white); border-color: var(--border-subtle);"
      >
        <!-- 1. Modal Top Bar (Brand Icon, Title, Tabs, Close Button) -->
        <div class="px-5 sm:px-6 pt-5 pb-3 border-b shrink-0" style="border-color: var(--border-subtle); background-color: var(--bg-ivory);">
          <div class="flex items-center justify-between gap-3 mb-3">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 font-editorial font-bold text-white shadow-xs"
                style="background-color: var(--accent-sage);"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h6m-8 7h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v16l4-4z"/>
                </svg>
              </div>
              <div>
                <h3 id="vw-fb-modal-title" class="font-editorial text-lg sm:text-xl font-bold" style="color: var(--ink-primary);">
                  Share Your Feedback &bull; মতামত
                </h3>
                <p class="font-bengali text-xs mt-0.5" style="color: var(--ink-muted);">
                  আপনার অভিজ্ঞতা ও পরামর্শ দিয়ে আমাদের সহযোগিতা করুন
                </p>
              </div>
            </div>

            <button
              type="button"
              onclick="closeFeedbackModal()"
              class="w-8 h-8 rounded-full border flex items-center justify-center transition-colors hover:border-[#2D5A4C] shrink-0 cursor-pointer"
              style="border-color: var(--border-subtle); color: var(--ink-muted);"
              title="Close (Esc)"
              aria-label="Close"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Segmented Tab Navigation: [ Write Feedback | My Feedbacks (count) ] -->
          <div class="flex items-center gap-2 p-1 rounded-2xl border" style="background-color: var(--surface-sand); border-color: var(--border-subtle);">
            <button
              type="button"
              id="vw-fb-tab-write-btn"
              onclick="switchFeedbackTab('form')"
              class="flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              style="background-color: var(--surface-white); color: var(--accent-sage); box-shadow: 0 2px 6px rgba(0,0,0,0.06);"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              <span>Write Feedback &bull; নতুন মতামত</span>
            </button>
            <button
              type="button"
              id="vw-fb-tab-history-btn"
              onclick="switchFeedbackTab('history')"
              class="flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              style="background-color: transparent; color: var(--ink-muted);"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span>My Feedbacks &bull; পূর্ববর্তী (<span id="vw-fb-tab-count">0</span>)</span>
            </button>
          </div>
        </div>

        <!-- 2. Modal Body (Scrollable) -->
        <div class="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          <!-- TAB 1: FORM PANE -->
          <div id="vw-fb-form-view" class="space-y-5">
            
            <!-- Sub-pane 1a: Actual Form -->
            <form id="vw-feedback-form" onsubmit="handleFeedbackSubmit(event)" class="space-y-4">
              
              <!-- Category Selector -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider mb-2" style="color: var(--ink-secondary);">
                  Category &bull; মতামতের ধরন
                </label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onclick="selectFeedbackCategory('general')"
                    class="vw-fb-cat-btn active"
                    data-category="general"
                  >
                    <span>🌟</span>
                    <span>General</span>
                  </button>
                  <button
                    type="button"
                    onclick="selectFeedbackCategory('feature')"
                    class="vw-fb-cat-btn"
                    data-category="feature"
                  >
                    <span>💡</span>
                    <span>Feature</span>
                  </button>
                  <button
                    type="button"
                    onclick="selectFeedbackCategory('bug')"
                    class="vw-fb-cat-btn"
                    data-category="bug"
                  >
                    <span>🐛</span>
                    <span>Bug Report</span>
                  </button>
                  <button
                    type="button"
                    onclick="selectFeedbackCategory('correction')"
                    class="vw-fb-cat-btn"
                    data-category="correction"
                  >
                    <span>📚</span>
                    <span>Word Fix</span>
                  </button>
                </div>
              </div>

              <!-- Experience Rating (1-5 Emojis) -->
              <div class="p-3 rounded-2xl border" style="background-color: var(--surface-sand); border-color: var(--border-subtle);">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-bold uppercase tracking-wider" style="color: var(--ink-secondary);">
                    Experience Rating &bull; আপনার অভিজ্ঞতা
                  </span>
                  <span id="vw-fb-rating-label" class="text-xs font-bold" style="color: var(--accent-sage);">
                    🤩 Excellent &bull; দারুণ!
                  </span>
                </div>
                <div class="grid grid-cols-5 gap-1.5 sm:gap-2">
                  <button type="button" onclick="setFeedbackRating(1)" class="vw-fb-rating-btn" data-score="1" title="Poor (খারাপ)">
                    <span class="text-2xl leading-none">😡</span>
                    <span class="text-[10px] font-bold" style="color: var(--ink-muted);">1</span>
                  </button>
                  <button type="button" onclick="setFeedbackRating(2)" class="vw-fb-rating-btn" data-score="2" title="Fair (চলনসই)">
                    <span class="text-2xl leading-none">😕</span>
                    <span class="text-[10px] font-bold" style="color: var(--ink-muted);">2</span>
                  </button>
                  <button type="button" onclick="setFeedbackRating(3)" class="vw-fb-rating-btn" data-score="3" title="Good (মোটামুটি)">
                    <span class="text-2xl leading-none">😐</span>
                    <span class="text-[10px] font-bold" style="color: var(--ink-muted);">3</span>
                  </button>
                  <button type="button" onclick="setFeedbackRating(4)" class="vw-fb-rating-btn" data-score="4" title="Very Good (ভালো)">
                    <span class="text-2xl leading-none">😊</span>
                    <span class="text-[10px] font-bold" style="color: var(--ink-muted);">4</span>
                  </button>
                  <button type="button" onclick="setFeedbackRating(5)" class="vw-fb-rating-btn active" data-score="5" title="Excellent (দারুণ!)">
                    <span class="text-2xl leading-none">🤩</span>
                    <span class="text-[10px] font-bold" style="color: var(--ink-muted);">5</span>
                  </button>
                </div>
              </div>

              <!-- Feedback Message Textarea -->
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label for="vw-fb-message" class="block text-xs font-bold uppercase tracking-wider" style="color: var(--ink-secondary);">
                    Your Message &bull; বিস্তারিত লিখুন <span class="text-red-500">*</span>
                  </label>
                  <span id="vw-fb-char-counter" class="text-[11px] font-mono font-medium" style="color: var(--ink-muted);">
                    <span id="vw-fb-char-count">0</span> / 500
                  </span>
                </div>
                <textarea
                  id="vw-fb-message"
                  required
                  rows="4"
                  maxlength="500"
                  oninput="updateFeedbackCharCount()"
                  placeholder="Vocabulary World সম্পর্কে আপনার সাধারণ মতামত বা অভিজ্ঞতা শেয়ার করুন..."
                  class="w-full px-4 py-3 rounded-2xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2D5A4C]/30 transition-all resize-none"
                  style="background-color: var(--surface-sand); border-color: var(--border-subtle); color: var(--ink-primary);"
                ></textarea>
              </div>

              <!-- User Contact & Details (Optional / Auto-filled) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label for="vw-fb-name" class="block text-xs font-bold uppercase tracking-wider mb-1" style="color: var(--ink-secondary);">
                    Your Name &bull; নাম <span class="text-[10px] font-normal lowercase opacity-75">(ঐচ্ছিক)</span>
                  </label>
                  <input
                    id="vw-fb-name"
                    type="text"
                    placeholder="e.g. John Doe / আপনার নাম"
                    class="w-full px-3.5 py-2 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2D5A4C]/30 transition-all"
                    style="background-color: var(--surface-sand); border-color: var(--border-subtle); color: var(--ink-primary);"
                  />
                </div>
                <div>
                  <label for="vw-fb-email" class="block text-xs font-bold uppercase tracking-wider mb-1" style="color: var(--ink-secondary);">
                    Email &bull; ইমেইল <span class="text-[10px] font-normal lowercase opacity-75">(ঐচ্ছিক)</span>
                  </label>
                  <input
                    id="vw-fb-email"
                    type="email"
                    placeholder="you@example.com"
                    class="w-full px-3.5 py-2 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2D5A4C]/30 transition-all"
                    style="background-color: var(--surface-sand); border-color: var(--border-subtle); color: var(--ink-primary);"
                  />
                </div>
              </div>

              <!-- Captured Context Tag Pill -->
              <div class="flex items-center justify-between px-3 py-2 rounded-xl border text-[11px]" style="background-color: var(--surface-sand); border-color: var(--border-subtle); color: var(--ink-muted);">
                <div class="flex items-center gap-1.5 truncate">
                  <span class="text-xs">📍</span>
                  <span id="vw-fb-context-summary">Page: Learn &bull; Level: Beginner &bull; Accent: UK</span>
                </div>
                <span class="text-[10px] font-mono uppercase shrink-0 opacity-70">Auto-captured</span>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                id="vw-fb-submit-btn"
                class="w-full py-3 px-5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-md transition-all hover:opacity-95 hover:shadow-lg active:scale-[0.99] cursor-pointer"
                style="background-color: var(--accent-sage);"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                <span>Submit Feedback &bull; মতামত জমা দিন</span>
              </button>
            </form>

            <!-- Sub-pane 1b: Success State (Celebratory View) -->
            <div id="vw-fb-success-pane" class="hidden text-center py-6 px-4 space-y-4 vw-view-enter">
              <div class="w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-lg" style="background-color: var(--accent-sage-soft); color: var(--accent-sage);">
                <svg class="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              </div>
              <div>
                <h4 class="font-editorial text-xl font-bold" style="color: var(--ink-primary);">
                  Thank You! &bull; ধন্যবাদ!
                </h4>
                <p class="font-bengali text-xs sm:text-sm mt-1 max-w-sm mx-auto" style="color: var(--ink-muted);">
                  আপনার মূল্যবান মতামত সফলভাবে সংরক্ষিত হয়েছে। আমরা এটি গুরুত্ব সহকারে বিবেচনা করব।
                </p>
              </div>
              <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-bold" style="background-color: var(--surface-sand); border-color: var(--border-subtle); color: var(--accent-sage);">
                <span>Reference ID:</span>
                <span id="vw-fb-success-ref">#FB-0000</span>
              </div>
              <div class="pt-3 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <button
                  type="button"
                  onclick="resetFeedbackForm()"
                  class="w-full sm:w-auto px-5 py-2.5 rounded-xl border text-xs font-bold transition-colors hover:border-[#2D5A4C] cursor-pointer"
                  style="background-color: var(--surface-white); border-color: var(--border-subtle); color: var(--ink-primary);"
                >
                  &larr; Write Another Feedback
                </button>
                <button
                  type="button"
                  onclick="switchFeedbackTab('history')"
                  class="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90 cursor-pointer"
                  style="background-color: var(--accent-sage);"
                >
                  View My Feedbacks &rarr;
                </button>
              </div>
            </div>

          </div>

          <!-- TAB 2: HISTORY PANE -->
          <div id="vw-fb-history-view" class="hidden space-y-4">
            <div class="flex items-center justify-between pb-2 border-b" style="border-color: var(--border-subtle);">
              <span class="text-xs font-bold uppercase tracking-wider" style="color: var(--ink-secondary);">
                Submitted Feedbacks &bull; পূর্ববর্তী মতামত
              </span>
              <button
                type="button"
                id="vw-fb-clear-all-btn"
                onclick="clearAllFeedbacks()"
                class="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                <span>Clear All &bull; সকল মুছুন</span>
              </button>
            </div>

            <!-- History List Container -->
            <div id="vw-fb-history-list" class="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
              <!-- Dynamically populated by renderFeedbackHistoryList() -->
            </div>
          </div>

        </div>
      </div>
    `;
    document.body.appendChild(modalDiv);
  }

  // Bind Escape key listener once
  if (!window.__vwFeedbackEscBound) {
    window.__vwFeedbackEscBound = true;
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('vw-feedback-modal');
        if (modal && !modal.classList.contains('hidden')) {
          closeFeedbackModal();
        }
      }
    });
  }

  updateFeedbackFloatingBadge();
}

// Global window registrations
if (typeof window !== 'undefined') {
  window.openFeedbackModal = openFeedbackModal;
  window.closeFeedbackModal = closeFeedbackModal;
  window.switchFeedbackTab = switchFeedbackTab;
  window.selectFeedbackCategory = selectFeedbackCategory;
  window.setFeedbackRating = setFeedbackRating;
  window.updateFeedbackCharCount = updateFeedbackCharCount;
  window.handleFeedbackSubmit = handleFeedbackSubmit;
  window.resetFeedbackForm = resetFeedbackForm;
  window.deleteFeedbackItem = deleteFeedbackItem;
  window.clearAllFeedbacks = clearAllFeedbacks;
  window.ensureFeedbackWidget = ensureFeedbackWidget;
  window.getStoredFeedbacks = getStoredFeedbacks;
  window.saveStoredFeedbacks = saveStoredFeedbacks;
}



/* =====================================================================
   8.5 VOCAB AI TUTOR — PERSONAL STUDY MENTOR (HYBRID ENGINE WITH OFFLINE FALLBACK)
   ===================================================================== */

let aiTutorChatHistory = null;
let isAITutorThinking = false;
let activeTutorWordContext = null;

function getAITutorIconSvg(classes = 'w-5 h-5') {
  return `<svg class="${classes}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="48" height="48" rx="14" fill="#2D5A4C"/>
    <path d="M24 35C21.8 32.5 16 30.5 12 31.8L15 17C18.5 16 22 18.5 24 21C26 18.5 29.5 16 33 17L36 31.8C32 30.5 26.2 32.5 24 35Z" fill="#FAF8F5"/>
    <path d="M23.75 21V35C23.75 35 24 35.3 24.25 35V21H23.75Z" fill="#2D5A4C" fill-opacity="0.3"/>
    <path d="M37 9L38.2 12.8L42 14L38.2 15.2L37 19L35.8 15.2L32 14L35.8 12.8L37 9Z" fill="#F59E0B"/>
    <circle cx="15" cy="12" r="1.5" fill="#FAF8F5" fill-opacity="0.7"/>
  </svg>`;
}

function getStoredAITutorHistory() {
  if (aiTutorChatHistory !== null) return aiTutorChatHistory;
  try {
    const raw = (typeof localStorage !== 'undefined') ? localStorage.getItem(STORAGE_KEYS.AI_TUTOR_HISTORY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        aiTutorChatHistory = parsed;
        return aiTutorChatHistory;
      }
    }
  } catch (e) {}
  aiTutorChatHistory = [];
  return aiTutorChatHistory;
}

function saveStoredAITutorHistory(history) {
  aiTutorChatHistory = Array.isArray(history) ? history : [];
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.AI_TUTOR_HISTORY, JSON.stringify(aiTutorChatHistory));
    }
  } catch (e) {}
}

function getStoredAITutorApiKey() {
  try {
    if (typeof localStorage !== 'undefined') {
      return (localStorage.getItem(STORAGE_KEYS.AI_TUTOR_API_KEY) || '').trim();
    }
  } catch (e) {}
  return '';
}

function saveAITutorKey() {
  if (typeof document === 'undefined') return;
  const input = document.getElementById('vw-ai-key-input');
  if (!input) return;
  const key = (input.value || '').trim();
  try {
    if (typeof localStorage !== 'undefined') {
      if (key) {
        localStorage.setItem(STORAGE_KEYS.AI_TUTOR_API_KEY, key);
        if (typeof showToast === 'function') showToast('✓ AI Key সংরক্ষিত হয়েছে!', 'success');
      } else {
        localStorage.removeItem(STORAGE_KEYS.AI_TUTOR_API_KEY);
        if (typeof showToast === 'function') showToast('AI Key মুছে ফেলা হয়েছে (অফলাইন মোড সক্রিয়)', 'info');
      }
    }
  } catch (e) {}
  const panel = document.getElementById('vw-ai-key-panel');
  if (panel) panel.classList.add('hidden');
}

function removeAITutorKey() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.AI_TUTOR_API_KEY);
    }
  } catch (e) {}
  const input = document.getElementById('vw-ai-key-input');
  if (input) input.value = '';
  if (typeof showToast === 'function') showToast('AI Key মুছে ফেলা হয়েছে (বিল্ট-ইন অফলাইন মেন্টর সক্রিয়)', 'info');
  const panel = document.getElementById('vw-ai-key-panel');
  if (panel) panel.classList.add('hidden');
}

function toggleAITutorKeyModal() {
  if (typeof document === 'undefined') return;
  const panel = document.getElementById('vw-ai-key-panel');
  if (!panel) return;
  panel.classList.toggle('hidden');
  if (!panel.classList.contains('hidden')) {
    const input = document.getElementById('vw-ai-key-input');
    if (input) {
      input.value = getStoredAITutorApiKey();
      input.focus();
    }
  }
}

function ensureAITutorWidget() {
  if (typeof document === 'undefined' || !document.body) return;

  // 1. Floating Action Button directly above Feedback button
  if (!document.getElementById('vw-ai-tutor-floating-btn')) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'vw-ai-tutor-floating-btn';
    btn.onclick = () => openAITutorModal();
    btn.className = 'vw-ai-tutor-floating-btn';
    btn.title = 'Vocab AI Tutor • আপনার পার্সোনাল স্টাডি মেন্টর';
    btn.setAttribute('aria-label', 'Ask Vocab AI Tutor');
    btn.innerHTML = `
      <span class="vw-ai-tutor-sparkle-badge" aria-hidden="true">✨</span>
      <span class="vw-ai-tutor-btn-text">Ask Vocab AI</span>
    `;
    document.body.appendChild(btn);
  }

  // 2. Overlay Backdrop
  if (!document.getElementById('vw-ai-tutor-overlay')) {
    const overlay = document.createElement('div');
    overlay.id = 'vw-ai-tutor-overlay';
    overlay.className = 'vw-ai-tutor-overlay';
    overlay.onclick = () => closeAITutorModal();
    document.body.appendChild(overlay);
  }

  // 3. Slide-Over Chat Drawer
  if (!document.getElementById('vw-ai-tutor-drawer')) {
    const drawer = document.createElement('aside');
    drawer.id = 'vw-ai-tutor-drawer';
    drawer.className = 'vw-ai-tutor-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-labelledby', 'vw-ai-tutor-title');
    drawer.innerHTML = `
      <!-- 1. Header Bar -->
      <div class="vw-ai-tutor-header">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs" style="background-color: var(--accent-sage);">
            ${getAITutorIconSvg('w-6 h-6')}
          </div>
          <div class="min-w-0">
            <h3 id="vw-ai-tutor-title" class="font-editorial text-base sm:text-lg font-bold truncate leading-tight" style="color: var(--ink-primary);">
              Vocab AI Tutor
            </h3>
            <p class="font-bengali text-xs flex items-center gap-1.5 mt-0.5" style="color: var(--ink-muted);">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Bangla &amp; English Study Mentor</span>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            id="vw-ai-key-btn"
            onclick="toggleAITutorKeyModal()"
            class="p-1.5 rounded-full border text-xs text-gray-500 hover:text-[#2D5A4C] hover:border-[#2D5A4C] transition-colors cursor-pointer"
            style="border-color: var(--border-subtle);"
            title="API Key Settings (ঐচ্ছিক)"
            aria-label="API Key Settings"
          >
            🔑
          </button>
          <button
            type="button"
            id="vw-ai-clear-btn"
            onclick="clearAITutorChat()"
            class="px-2.5 py-1 rounded-full border text-xs font-bold text-gray-600 hover:text-red-600 hover:border-red-300 transition-colors cursor-pointer"
            style="border-color: var(--border-subtle); background-color: var(--surface-white);"
            title="Clear Chat History"
          >
            Clear Chat
          </button>
          <button
            type="button"
            id="vw-ai-close-btn"
            onclick="closeAITutorModal()"
            class="w-8 h-8 rounded-full border flex items-center justify-center text-gray-500 hover:text-[#2D5A4C] hover:border-[#2D5A4C] transition-colors cursor-pointer"
            style="border-color: var(--border-subtle);"
            title="Close Drawer (Esc)"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      </div>

      <!-- Optional API Key Settings Panel -->
      <div id="vw-ai-key-panel" class="hidden px-4 py-3 border-b text-xs space-y-2" style="background-color: var(--surface-sand); border-color: var(--border-subtle);">
        <div class="flex items-center justify-between font-bold" style="color: var(--ink-primary);">
          <span>Custom AI Key (Optional)</span>
          <span class="font-normal text-[11px] text-gray-500">বিনা কীতেও অফলাইনে স্টাডি মেন্টর চলবে</span>
        </div>
        <div class="flex items-center gap-2">
          <input
            id="vw-ai-key-input"
            type="password"
            placeholder="Paste Gemini API key here..."
            class="flex-1 px-3 py-1.5 rounded-xl border text-xs bg-white text-gray-800 outline-none"
          />
          <button
            type="button"
            onclick="saveAITutorKey()"
            class="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#2D5A4C] text-white cursor-pointer hover:bg-[#23483D]"
          >
            Save
          </button>
          <button
            type="button"
            onclick="removeAITutorKey()"
            class="px-2 py-1.5 rounded-xl text-xs text-red-600 hover:bg-red-50 cursor-pointer"
            title="Clear Key"
          >
            Clear
          </button>
        </div>
      </div>

      <!-- 2. Chat Messages Body -->
      <div id="vw-ai-chat-body" class="vw-ai-chat-body">
        <!-- Messages rendered dynamically -->
      </div>

      <!-- 3. Quick-Ask Suggestion Chips -->
      <div class="vw-ai-chips-wrap" id="vw-ai-chips-wrap">
        <button
          type="button"
          class="vw-ai-chip"
          onclick="sendQuickAITutorPrompt('সহজ বাংলায় মনে রাখার ট্রিক দাও 🧠')"
        >
          সহজ বাংলায় মনে রাখার ট্রিক দাও 🧠
        </button>
        <button
          type="button"
          class="vw-ai-chip"
          onclick="sendQuickAITutorPrompt('দৈনন্দিন জীবনের উদাহরণ দাও 💬')"
        >
          দৈনন্দিন জীবনের উদাহরণ দাও 💬
        </button>
        <button
          type="button"
          class="vw-ai-chip"
          onclick="sendQuickAITutorPrompt('Noun, Verb, Adj রূপগুলো দেখাও 📊')"
        >
          Noun, Verb, Adj রূপগুলো দেখাও 📊
        </button>
        <button
          type="button"
          class="vw-ai-chip"
          onclick="sendQuickAITutorPrompt('Accept vs Except পার্থক্য কী? 🤔')"
        >
          Accept vs Except পার্থক্য কী? 🤔
        </button>
      </div>

      <!-- 4. Input Area -->
      <div class="vw-ai-input-area">
        <div class="flex items-end gap-2">
          <textarea
            id="vw-ai-chat-input"
            class="vw-ai-textarea"
            rows="1"
            placeholder="যেকোনো শব্দ, গ্রামার বা কনফিউশন জিজ্ঞেস করো..."
          ></textarea>
          <button
            type="button"
            id="vw-ai-send-btn"
            onclick="submitAITutorMessage()"
            class="vw-ai-send-btn"
            aria-label="Send message"
          >
            <span>Send</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </button>
        </div>
        <div class="text-[10px] text-center font-medium opacity-65 flex items-center justify-center gap-1.5" style="color: var(--ink-muted);">
          <span>🌿 Vocab AI Tutor &bull; Vocabulary World's Personal Study Mentor</span>
        </div>
      </div>
    `;
    document.body.appendChild(drawer);

    // Auto-grow textarea handler
    const input = typeof drawer.querySelector === 'function' ? drawer.querySelector('#vw-ai-chat-input') : null;
    if (input) {
      input.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
      });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          submitAITutorMessage();
        }
      });
    }

    // Escape key listener to close drawer
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const d = document.getElementById('vw-ai-tutor-drawer');
        if (d && d.classList.contains('is-open')) {
          closeAITutorModal();
        }
      }
    });
  }
}

function openAITutorModal(preloadedPrompt = null) {
  ensureAITutorWidget();
  const drawer = document.getElementById('vw-ai-tutor-drawer');
  const overlay = document.getElementById('vw-ai-tutor-overlay');
  if (drawer && overlay) {
    overlay.classList.add('is-open');
    drawer.classList.add('is-open');
  }

  renderAITutorChatHistory();

  const input = document.getElementById('vw-ai-chat-input');
  if (input) {
    if (preloadedPrompt) {
      input.value = preloadedPrompt;
      submitAITutorMessage();
    } else {
      setTimeout(() => input.focus(), 250);
    }
  }
}

function closeAITutorModal() {
  const drawer = document.getElementById('vw-ai-tutor-drawer');
  const overlay = document.getElementById('vw-ai-tutor-overlay');
  if (drawer && overlay) {
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
  }
  const keyPanel = document.getElementById('vw-ai-key-panel');
  if (keyPanel) keyPanel.classList.add('hidden');
}

function toggleAITutorModal() {
  const drawer = document.getElementById('vw-ai-tutor-drawer');
  if (drawer && drawer.classList.contains('is-open')) {
    closeAITutorModal();
  } else {
    openAITutorModal();
  }
}

function askAITutorAboutWord(wordName) {
  if (!wordName) return;
  activeTutorWordContext = wordName;
  const prompt = `আমাকে "${wordName}" শব্দটি সম্পর্কে বুঝিয়ে বলো। এর বাংলা অর্থ, সহজে মনে রাখার ট্রিক, দৈনন্দিন ব্যবহারের উদাহরণ এবং Derivatives (Noun/Verb/Adj/Adv) বুঝিয়ে দাও।`;
  openAITutorModal(prompt);
}

function sendQuickAITutorPrompt(promptText) {
  if (!promptText) return;
  const input = document.getElementById('vw-ai-chat-input');
  if (input) {
    if (activeTutorWordContext && !promptText.toLowerCase().includes(activeTutorWordContext.toLowerCase())) {
      input.value = `"${activeTutorWordContext}" শব্দটির ${promptText}`;
    } else {
      input.value = promptText;
    }
    submitAITutorMessage();
  }
}

function clearAITutorChat() {
  saveStoredAITutorHistory([]);
  activeTutorWordContext = null;
  renderAITutorChatHistory();
  if (typeof showToast === 'function') {
    showToast('✓ চ্যাট হিস্ট্রি ক্লিয়ার করা হয়েছে', 'info');
  }
}

function renderAITutorChatHistory() {
  const chatBody = document.getElementById('vw-ai-chat-body');
  if (!chatBody) return;

  const history = getStoredAITutorHistory();
  chatBody.innerHTML = '';

  if (history.length === 0) {
    // Welcome Greeting Card
    const welcome = document.createElement('div');
    welcome.className = 'vw-ai-msg-bubble vw-ai-msg-tutor space-y-2';
    welcome.innerHTML = `
      <div class="flex items-center gap-2 mb-1.5">
        <span class="text-base">🌿✨</span>
        <strong class="font-editorial font-bold text-sm" style="color: var(--accent-sage);">
          স্বাগতম! আমি Vocab AI Tutor
        </strong>
      </div>
      <p class="text-xs leading-relaxed">
        আমি <strong>Vocabulary World</strong>-এর তোমার পার্সোনাল স্টাডি মেন্টর। ইংরেজি শব্দভান্ডার, বাংলা অর্থ, সহজে মনে রাখার ট্রিক (Mnemonic), গ্রামার, বা বিসিএস/আইইএলটিএস পরীক্ষার যেকোনো প্রশ্ন আমাকে নির্দ্বিধায় জিজ্ঞেস করো!
      </p>
      <div class="rounded-xl p-2.5 text-[11px] border mt-2 space-y-1" style="background-color: var(--surface-sand); border-color: var(--border-subtle);">
        <span class="font-bold block" style="color: var(--accent-sage);">💡 সহজে যা যা জানতে পারো:</span>
        <p>• যেকোনো শব্দের অর্থ, Noun/Verb/Adj রূপ ও ট্রিক</p>
        <p>• কনফিউজিং শব্দের পার্থক্য (যেমন: Accept vs Except)</p>
        <p>• বাস্তব জীবনে বাক্যে ব্যবহারের উদাহরণ ও উচ্চারণ</p>
      </div>
    `;
    chatBody.appendChild(welcome);
  } else {
    history.forEach((msg) => {
      appendChatMessageToDOM(msg.sender, msg.text);
    });
  }

  scrollAITutorChatToBottom();
}

function appendChatMessageToDOM(sender, text) {
  const chatBody = document.getElementById('vw-ai-chat-body');
  if (!chatBody) return;

  const bubble = document.createElement('div');
  bubble.className = `vw-ai-msg-bubble ${sender === 'user' ? 'vw-ai-msg-user' : 'vw-ai-msg-tutor'}`;

  if (sender === 'user') {
    bubble.textContent = text;
  } else {
    bubble.innerHTML = formatAITutorMarkdown(text);
  }

  chatBody.appendChild(bubble);
  scrollAITutorChatToBottom();
}

function scrollAITutorChatToBottom() {
  const chatBody = document.getElementById('vw-ai-chat-body');
  if (chatBody) {
    setTimeout(() => {
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 50);
  }
}

function formatAITutorMarkdown(text) {
  if (!text) return '';
  let html = String(text);

  // Escape basic HTML tags
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Headers (### Header)
  html = html.replace(/^### (.*$)/gim, '<h4 class="font-editorial text-sm font-bold text-[#2D5A4C] mt-2 mb-1">$1</h4>');

  // Bullet items
  html = html.replace(/^\s*• (.*$)/gim, '<div class="flex items-start gap-1.5 my-1"><span class="text-[#2D5A4C] font-bold">•</span><div class="flex-1">$1</div></div>');
  html = html.replace(/^\s*- (.*$)/gim, '<div class="flex items-start gap-1.5 my-1"><span class="text-[#2D5A4C] font-bold">•</span><div class="flex-1">$1</div></div>');

  // Line breaks
  html = html.replace(/\n\n/g, '<div class="h-2"></div>');
  html = html.replace(/\n/g, '<br/>');

  // Replace 🔊 with interactive audio speaker buttons
  html = html.replace(/🔊/g, `<button type="button" class="vw-ai-speak-inline" onclick="speakFromChat(this)" title="উচ্চারণ শুনুন" aria-label="Listen">🔊</button>`);

  return html;
}

function speakFromChat(btn) {
  if (!btn) return;
  // Find preceding text or word
  const parent = btn.parentElement || btn;
  let textToSpeak = parent.textContent.replace(/🔊/g, '').trim();
  // If text is long, extract the English sentence or word
  const match = textToSpeak.match(/["“]([^"”]+)["”]/) || textToSpeak.match(/\b([A-Za-z\s]{2,40})\b/);
  if (match && match[1]) {
    textToSpeak = match[1].trim();
  }
  if (typeof speakEnglish === 'function') {
    speakEnglish(textToSpeak, btn, 'en-US');
  } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance(textToSpeak);
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
  }
}

async function submitAITutorMessage() {
  if (isAITutorThinking) return;
  const input = document.getElementById('vw-ai-chat-input');
  if (!input) return;
  const message = (input.value || '').trim();
  if (!message) return;

  // Clear input
  input.value = '';
  input.style.height = 'auto';

  // Add user message to history & DOM
  const history = getStoredAITutorHistory();
  history.push({ sender: 'user', text: message });
  saveStoredAITutorHistory(history);
  appendChatMessageToDOM('user', message);

  // Show typing indicator
  showAITutorTypingIndicator();

  try {
    const reply = await callAITutorEngine(message, history);
    hideAITutorTypingIndicator();
    history.push({ sender: 'tutor', text: reply });
    saveStoredAITutorHistory(history);
    appendChatMessageToDOM('tutor', reply);
  } catch (err) {
    hideAITutorTypingIndicator();
    // Fallback to local response
    const fallback = generateLocalAITutorResponse(message);
    history.push({ sender: 'tutor', text: fallback });
    saveStoredAITutorHistory(history);
    appendChatMessageToDOM('tutor', fallback);
  }
}

function showAITutorTypingIndicator() {
  isAITutorThinking = true;
  const sendBtn = document.getElementById('vw-ai-send-btn');
  if (sendBtn) sendBtn.disabled = true;

  const chatBody = document.getElementById('vw-ai-chat-body');
  if (!chatBody) return;

  let indicator = document.getElementById('vw-ai-typing-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'vw-ai-typing-indicator';
    indicator.className = 'vw-ai-msg-bubble vw-ai-msg-tutor flex items-center gap-2 text-xs';
    indicator.innerHTML = `
      <span class="inline-flex items-center gap-1">
        <span class="w-1.5 h-1.5 rounded-full bg-[#2D5A4C] animate-bounce"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-[#2D5A4C] animate-bounce" style="animation-delay: 0.15s;"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-[#2D5A4C] animate-bounce" style="animation-delay: 0.3s;"></span>
      </span>
      <span class="font-bengali text-xs" style="color: var(--ink-muted);">Vocab AI Tutor ভাবছে...</span>
    `;
    chatBody.appendChild(indicator);
    scrollAITutorChatToBottom();
  }
}

function hideAITutorTypingIndicator() {
  isAITutorThinking = false;
  const sendBtn = document.getElementById('vw-ai-send-btn');
  if (sendBtn) sendBtn.disabled = false;

  const indicator = document.getElementById('vw-ai-typing-indicator');
  if (indicator) indicator.remove();
}

async function callAITutorEngine(userPrompt, history) {
  const apiKey = getStoredAITutorApiKey();
  const isOnline = (typeof navigator !== 'undefined' && navigator.onLine !== false);

  if (apiKey && isOnline) {
    try {
      return await callAITutorAPI(userPrompt, history, apiKey);
    } catch (apiErr) {
      console.warn('[Vocab AI Tutor] API call failed, falling back to local study mentor:', apiErr);
      return generateLocalAITutorResponse(userPrompt);
    }
  }

  // Smart Local Fallback Responder
  return generateLocalAITutorResponse(userPrompt);
}

async function callAITutorAPI(prompt, chatHistory, apiKey) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${encodeURIComponent(apiKey)}`;

  const contents = [];
  if (Array.isArray(chatHistory)) {
    // Only pass last 6 messages
    const recent = chatHistory.slice(-6);
    recent.forEach((m) => {
      if (m.sender === 'user') {
        contents.push({ role: 'user', parts: [{ text: m.text }] });
      } else if (m.sender === 'tutor') {
        contents.push({ role: 'model', parts: [{ text: m.text }] });
      }
    });
  }
  contents.push({ role: 'user', parts: [{ text: prompt }] });

  const payload = {
    systemInstruction: {
      parts: [{
        text: `You are 'Vocab AI Tutor', the exclusive built-in personal study mentor of Vocabulary World (an interactive English-Bangla vocabulary platform). You were created by Vocabulary World to help students and candidates (BCS, HSC, SSC, Bank, IELTS) master English vocabulary, grammar, and sentence structures.

CRITICAL IDENTITY RULES:
- NEVER mention Google, Gemini, OpenAI, or any third-party company or AI model. Always identify yourself as 'Vocab AI Tutor', Vocabulary World's built-in personal study mentor.
- Teach in an encouraging, friendly, and structured bilingual (Bangla + English) style.
- When explaining a word or vocabulary concept, structure your response clearly:
  1. 🌿 বাংলা অর্থ ও উচ্চারণ (Bangla meaning & pronunciation)
  2. 🧠 সহজে মনে রাখার ট্রিক (Mnemonic / clever memory hook)
  3. 📊 Derivatives / Word Family (Noun, Verb, Adjective, Adverb forms)
  4. 💬 দৈনন্দিন ও পরীক্ষার উদাহরণ বাক্য (Daily life & exam examples with Bangla translations)
  5. 🔄 Synonyms & Antonyms (সমার্থক ও বিপরীত শব্দ)
- Use warm emojis (🌿, 💡, 🧠, 💬, 📌, 📊).
- Keep explanations clear, engaging, and mobile-friendly.`
      }]
    },
    contents: contents,
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 1200
    }
  };

  // Exponential backoff retry logic (up to 2 attempts)
  let lastErr = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      if (attempt > 0) {
        await new Promise((r) => setTimeout(r, 1200 * attempt));
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 14000);

      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }

      const data = await resp.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return text;
      }
      throw new Error('Empty response');
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr || new Error('API connection failed');
}

function getMnemonicForWord(word, meaningBn) {
  const w = String(word || '').toLowerCase();
  const mnemonics = {
    abandon: 'a + band + on -> ব্যান্ড দল ফেলে একা চলে যাওয়া = পরিত্যাগ করা।',
    abate: 'at + ate -> খেয়ে পেট ভরে যাওয়ার পর ক্ষুধা কমে গেল = তীব্রতা হ্রাস পাওয়া।',
    abbreviate: 'brevity / brief -> কোনো কিছু সংক্ষেপ করা।',
    abdicate: 'ab (away) + dicate (declare) -> পদ ছেড়ে দেওয়া বা সিংহাসন ত্যাগ করা।',
    aberration: 'ab (away) + err (ভুল করা) -> স্বাভাবিক পথ থেকে বিচ্যুতি।',
    abhor: 'ab + horror -> হরর বা ভয়ের কিছু দেখে তীব্র ঘৃণা করা।',
    abide: 'বিপদেও বন্ধুর পাশে দৃঢ়ভাবে অবস্থান করা বা নিয়ম মেনে চলা।',
    abode: 'বসবাসের জায়গা বা বাসস্থান (Home / Dwelling)।',
    abolish: 'বিলুপ্ত করা বা রদ করা (A + polish -> পুরোনো প্রথা মুছে ফেলা)।',
    abrupt: 'হঠাৎ বা অপ্রত্যাশিত (Erupt-এর মতো আকস্মিক)।',
    absorb: 'স্পঞ্জের মতো শুষে নেওয়া বা গভীর মনোযোগ দেওয়া।',
    abstract: 'বাস্তব নয় এমন বিমূর্ত ধারণা (Extract of thought)।',
    absurd: 'হাস্যকর বা অযৌক্তিক।',
    abundant: 'A + bun (রুটি) প্রচুর পরিমাণে থাকা = প্রাচুর্যময় বা বিপুল।',
    accelerate: 'গাড়ির accelerator চাপলে যেমন গতি বাড়ে = গতি বাড়ানো বা ত্বরান্বিত করা।',
    accept: 'A + cept (গ্রহণ) -> হাত বাড়িয়ে হাসিমুখে গ্রহণ করা।',
    access: 'প্রবেশাধিকার বা নাগাল পাওয়া (Access to information)।',
    acclaim: 'উচ্ছ্বসিত প্রশংসা করা (Claim applause)।',
    accommodate: 'আবাসন দেওয়া বা খাপ খাইয়ে নেওয়া।',
    accomplish: 'সফলভাবে সম্পন্ন করা বা অর্জন করা।',
    accurate: 'সঠিক ও নির্ভুল (Cure করে নিখুঁত করা)।',
    accuse: 'অভিযোগ আনা বা দোষারোপ করা।',
    acquire: 'অর্জন করা বা আয়ত্তে আনা (Acquire knowledge)।',
    acute: 'তীব্র বা সূক্ষ্ম (Acute angle / acute pain)।',
    adamant: 'অনমনীয় বা অটল (Diamond-এর মতো শক্ত সংকল্প)।',
    adapt: 'নতুন পরিবেশে নিজেকে মানিয়ে নেওয়া।',
    adequate: 'পর্যাপ্ত বা যথেষ্ট (Equal to requirement)।',
    adhere: 'দৃঢ়ভাবে লেগে থাকা বা নীতি মেনে চলা (Adhesive-এর মতো আঠার মতো লেগে থাকা)।',
    adjourn: 'মুলতবি করা (Ad + journal -> আজকের মতো বন্ধ রাখা)।',
    admire: 'শ্রদ্ধা বা প্রশংসা করা।',
    admonish: 'মৃদু তিরস্কার করা বা সতর্ক করা।',
    adolescent: 'কৈশোর বা বয়ঃসন্ধিকালের তরুণ।',
    adverse: 'প্রতিকূল বা ক্ষতিকর (Reverse / বিরোধী অবস্থা)।',
    advocate: 'কারও পক্ষে কথা বলা বা সমর্থন করা।',
    aesthetic: 'নান্দনিক বা সৌন্দর্যবোধ সংক্রান্ত।',
    affable: 'মিশুক ও অমায়িক স্বভাবের (Easy to talk to)।',
    affection: 'স্নেহ, মায়া বা ভালোবাসা।',
    afford: 'সামর্থ্য থাকা (Can afford the cost)।',
    affluent: 'বিত্তবান বা সমৃদ্ধিশালী (Flowing with wealth)।',
    afraid: 'ভীত বা শঙ্কিত।',
    aggravate: 'পরিস্থিতি আরও খারাপ বা অবনতি করা (Grave = গম্ভীর থেকে অবনতি)।',
    agile: 'চটপটে, দ্রুত ও ক্ষিপ্র গতির।',
    agony: 'তীব্র শারীরিক বা মানসিক যন্ত্রণা (Agonize / যন্ত্রণায় কাতড়ানো)।',
    agree: 'একমত হওয়া বা সম্মতি দেওয়া।',
    alleviate: 'কষ্ট বা ব্যথা লাঘব করা (Relieve-এর মতো হালকা করা)।',
    allude: 'পরোক্ষভাবে ইঙ্গিত করা।',
    allocate: 'বরাদ্দ করা (Localize / ভাগ করে দেওয়া)।',
    allow: 'অনুমতি দেওয়া।',
    alter: 'পরিবর্তন করা (Alternative খোঁজা)।',
    altruistic: 'পরোপকারী বা নিঃস্বার্থ (All + true care for others)।',
    ambiguous: 'অস্পষ্ট বা দ্ব্যর্থবোধক (Ambi = উভয় দিকে অর্থ যেতে পারে)।',
    ambition: 'উচ্চাকাঙ্ক্ষা বা লক্ষ্য।',
    ameliorate: 'উন্নতি সাধন করা (Make better)।',
    amenable: 'বাধ্য বা পরামর্শ গ্রহণ করতে প্রস্তুত।',
    amiable: 'বন্ধুভাবাপন্ন ও অমায়িক (Amigo = বন্ধু)।',
    amuse: 'আনন্দ দেওয়া বা কৌতুক করা।',
    anachronism: 'কালবৈষম্য বা সেকেলে ব্যাপার (Ana + Chronos/Time)।',
    analogous: 'সাদৃশ্যপূর্ণ বা অনুরূপ (Analogy থেকে)।',
    analyze: 'বিশ্লেষণ করা বা পুঙ্খানুপুঙ্খ পরীক্ষা করা।',
    ancient: 'প্রাচীন বা অতি পুরোনো।',
    animosity: 'তীব্র শত্রুতা বা বিদ্বেষ (Enemy-like feeling)।',
    anomaly: 'ব্যতিক্রম বা অসঙ্গতি (Not normal)।',
    anonymous: 'বেনামী বা অজ্ঞাতনামা (Without a name)।',
    antipathy: 'তীব্র অপছন্দ বা অনীহা (Anti + Pathos/feeling)।',
    anxious: 'উদ্বিগ্ন বা চিন্তিত।',
    apologize: 'ক্ষমা চাওয়া বা দুঃখ প্রকাশ করা।',
    appear: 'উপস্থিত হওয়া বা দৃশ্যমান হওয়া।',
    appease: 'শান্ত বা তুষ্ট করা (Peace আনা)।',
    appreciate: 'মূল্যায়ন বা কদর করা।',
    apprehensive: 'উদ্বিগ্ন বা শঙ্কিত।',
    approach: 'কাছে যাওয়া বা পদক্ষেপ নেওয়া।',
    appropriate: 'উপযুক্ত বা মানানসই।',
    approve: 'অনুমোদন দেওয়া বা পছন্দ করা।',
    apathy: 'উদাসীনতা বা অনীহা (No feeling)।',
    apex: 'সর্বোচ্চ চূড়া বা শীর্ষবিন্দু (Peak)।',
    arbitrary: 'স্বেচ্ছাচারী বা খেয়ালখুশিমতো করা।',
    arcane: 'রহস্যময় বা গুপ্ত (Hard to understand)।',
    archaic: 'অতি প্রাচীন বা অপ্রচলিত।',
    ardent: 'উগ্র উৎসাহী বা তীব্র আবেগপূর্ণ।',
    arduous: 'অত্যন্ত শ্রমসাধ্য বা কঠিন (Hard for us)।',
    argue: 'তর্ক করা বা যুক্তি দেওয়া।',
    aroma: 'সুগন্ধ বা সুবাস।',
    arrange: 'সাজানো বা আয়োজন করা।',
    arrogant: 'অহংকারী বা উদ্ধত।',
    articulate: 'স্পষ্টভাবে মনের ভাব প্রকাশ করতে সক্ষম।',
    ascend: 'উপরে ওঠা বা আরোহণ করা।',
    ascertain: 'নিশ্চিত করা বা সত্য খুঁজে বের করা (Make certain)।',
    aspire: 'কোনো উচ্চ লক্ষ্য অর্জনের তীব্র আকাঙ্ক্ষা করা।',
    assert: 'দৃঢ়তার সাথে দাবি করা বা ব্যক্ত করা।',
    assess: 'মূল্যায়ন বা পরিমাপ করা।',
    assist: 'সাহায্য বা সহযোগিতা করা।',
    assuage: 'তীব্র অনুভূতি বা যন্ত্রণা প্রশমিত করা (Sweeten / calm down)।',
    astute: 'তীক্ষ্ণবুদ্ধিসম্পন্ন বা চতুর (Acute + smart)।',
    audacious: 'দুঃসাহসী বা স্পর্ধিত।',
    augment: 'বৃদ্ধি করা বা বাড়ানো (August = মহৎ থেকে বৃদ্ধি)।',
    auspicious: 'শুভ বা অনুকূল লক্ষণযুক্ত।',
    austere: 'কঠোর বা সাদাসিধে (Strict lifestyle)।',
    authentic: 'খাঁটি বা আসল (Genuine)।',
    autonomous: 'স্বায়ত্তশাসিত বা স্বাধীন (Auto = স্বয়ং)।',
    avid: 'অত্যন্ত আগ্রহী বা অনুসন্ধিৎসু (Eager reader)।'
  };

  if (mnemonics[w]) return mnemonics[w];

  return `শব্দটিকে ছোট অংশে ভাগ করে ভিজ্যুয়াল কল্পনা করো: "${word}" শব্দের অর্থ "${meaningBn || 'শব্দার্থ'}"। শব্দটির অর্থ নিজের জীবনের পরিচিত কোনো ঘটনার সাথে লিংক করে মনে রাখো।`;
}

function getConfusingPairComparison(text) {
  const t = String(text || '').toLowerCase();

  if (t.includes('accept') && t.includes('except')) {
    return `### 💡 Accept vs Except — সহজ পার্থক্য ও ট্রিক

1. **Accept (Verb — গ্রহণ করা / মেনে নেওয়া):**
   • **অর্থ:** কোনো প্রস্তাব, উপহার বা মতামত স্বেচ্ছায় গ্রহণ করা।
   • **উদাহরণ:** "The committee unanimously **accepted** her research proposal." 🔊
   • **Mnemonic:** **A**ccept শুরু হয় **A** দিয়ে, যেমন **A**gree to receive!

2. **Except (Preposition / Conjunction — ছাড়া / ব্যতীত):**
   • **অর্থ:** কোনো কিছুকে বাদ দিয়ে বা অতিরিক্ত হিসেবে উল্লেখ করা।
   • **উদাহরণ:** "All students completed the assignment **except** Leo." 🔊
   • **Mnemonic:** **Ex**cept শুরু হয় **Ex** দিয়ে, যেমন **Ex**clude (বাদ দেওয়া)!

📌 **পরীক্ষার কমন বাক্য:** "I **accept** all conditions **except** the last clause." — দুটি শব্দ একসাথে মনে রাখলে কনফিউশন দূর হয়ে যাবে!`;
  }

  if (t.includes('affect') && t.includes('effect')) {
    return `### 💡 Affect vs Effect — সহজ পার্থক্য ও ট্রিক

1. **Affect (সাধারণত Verb — প্রভাবিত করা):**
   • **অর্থ:** কোনো কিছুর উপর প্রভাব বিস্তার করা বা পরিবর্তন আনা।
   • **উদাহরণ:** "Irregular study habits will negatively **affect** your exam scores." 🔊
   • **Mnemonic:** **A**ffect = **A**ction (ক্রিয়া বা Verb)!

2. **Effect (সাধারণত Noun — ফলাফল বা প্রভাব):**
   • **অর্থ:** কোনো কাজের চূড়ান্ত পরিণতি বা ফলাফল।
   • **উদাহরণ:** "The positive **effect** of daily revision is clearly noticeable." 🔊
   • **Mnemonic:** **E**ffect = **E**nd result (ফলাফল বা Noun)!

📌 **শর্টকাট ফর্মুলা (RAVEN):**
• **R**emember: **A**ffect is a **V**erb, **E**ffect is a **N**oun!`;
  }

  if (t.includes('advice') && t.includes('advise')) {
    return `### 💡 Advice vs Advise — সহজ পার্থক্য ও ট্রিক

1. **Advice (Noun — উপদেশ বা পরামর্শ):**
   • **অর্থ:** কাউকে দেওয়া পথনির্দেশ বা সুপরামর্শ (উচ্চারণ: অ্যাডভাউস /s/)
   • **উদাহরণ:** "My teacher gave me brilliant **advice** for the BCS exam." 🔊
   • **Mnemonic:** **C** for **C**ounsel (Noun)।

2. **Advise (Verb — উপদেশ দেওয়া):**
   • **অর্থ:** কাউকে কোনো কাজের জন্য পরামর্শ প্রদান করা (উচ্চারণ: অ্যাডভায়জ /z/)
   • **উদাহরণ:** "Doctors strongly **advise** drinking plenty of clean water." 🔊
   • **Mnemonic:** **S** for **S**uggest (Verb)।`;
  }

  if (t.includes('compliment') && t.includes('complement')) {
    return `### 💡 Compliment vs Complement — সহজ পার্থক্য ও ট্রিক

1. **Compliment (Noun/Verb — প্রশংসা করা):**
   • **অর্থ:** কারও গুণ বা সৌন্দর্যের প্রশংসা করা।
   • **উদাহরণ:** "Maya received a lovely **compliment** on her presentation." 🔊
   • **Mnemonic:** **I** love compliments (মাঝখানে **i** আছে)!

2. **Complement (Noun/Verb — পরিপূরক হওয়া):**
   • **অর্থ:** কোনো কিছুকে পূর্ণাঙ্গ বা সমৃদ্ধ করা।
   • **উদাহরণ:** "Leo's critical thinking **complements** Maya's creativity." 🔊
   • **Mnemonic:** **E** for compl**E**te (পরিপূর্ণ করা)!`;
  }

  if (t.includes('principal') && t.includes('principle')) {
    return `### 💡 Principal vs Principle — সহজ পার্থক্য ও ট্রিক

1. **Principal (Noun/Adj — প্রধান / অধ্যক্ষ / মূলধন):**
   • **অর্থ:** শিক্ষা প্রতিষ্ঠানের প্রধান অথবা প্রধান বিষয়।
   • **উদাহরণ:** "The college **principal** addressed the annual assembly." 🔊
   • **Mnemonic:** The princi**pal** is your **pal** (বন্ধু)!

2. **Principle (Noun — নীতি বা আদর্শ):**
   • **অর্থ:** জীবনের মূল নিয়ম, সত্য বা নৈতিক আদর্শ।
   • **উদাহরণ:** "A true scholar never compromises on ethical **principles**." 🔊
   • **Mnemonic:** Princi**ple** = **ru**le (দুটির শেষেই le আছে)!`;
  }

  return null;
}

function generateLocalAITutorResponse(userPrompt) {
  const prompt = String(userPrompt || '').trim();
  const lower = prompt.toLowerCase();

  // 1. Identity Query ("who are you" / "কে তুমি")
  if (lower.includes('who are you') || lower.includes('ke tumi') || lower.includes('কে তুমি') || lower.includes('তোমার পরিচয়')) {
    return `🌿 **স্বাগতম! আমি Vocab AI Tutor**

আমি **Vocabulary World**-এর তোমার পার্সোনাল স্টাডি মেন্টর 🎓✨
আমাকে বিশেষভাবে তৈরি করা হয়েছে ইংরেজি শব্দভান্ডার, ব্যাকরণ, উচ্চারণ এবং প্রতিযোগিতামূলক পরীক্ষার (BCS, Bank, HSC, IELTS) প্রস্তুতিতে তোমাকে হাতে-কলমে সাহায্য করার জন্য।

📌 **আমার সাথে যা যা প্র্যাকটিস করতে পারো:**
• যেকোনো শব্দের বাংলা অর্থ, উচ্চারণ ও সহজে মনে রাখার ট্রিক (Mnemonic)
• একই শব্দের Noun, Verb, Adjective ও Adverb রূপান্তর (Derivatives)
• বিভ্রান্তিকর শব্দের সহজ তুলনা (যেমন: Accept vs Except, Affect vs Effect)
• পরীক্ষায় আসার মতো আদর্শ বাক্য ও উচ্চারণ (🔊 স্পিকার বাটনে চাপো!)

তোমার যেকোনো জিজ্ঞাসা নিচে লিখে পাঠাও, আমি সুন্দর করে বুঝিয়ে দিচ্ছি!`;
  }

  // 2. Confusing Pairs Check
  const confusingPairResp = getConfusingPairComparison(prompt);
  if (confusingPairResp) {
    return confusingPairResp;
  }

  // 3. Quick-ask: Memory Tricks General
  if (lower.includes('মনে রাখার ট্রিক') || lower.includes('memory trick') || lower.includes('mnemonic')) {
    return `### 🧠 ভোকাবুলারি সহজে মনে রাখার ৪টি মোক্ষম কৌশল (Vocabulary Hacks)

1. **Prefix ও Root Word টেকনিক (শব্দমূল চেনা):**
   • কোনো শব্দের রুট জানলে ১০টি নতুন শব্দ সহজে বোঝা যায়।
   • যেমন: **Bene-** (ভালো) -> Benefit, Benevolent, Beneficial।
   • **Mal-** (খারাপ) -> Malice, Malfunction, Malnutrition।

2. **Visual Association বা ছবির সাথে লিংক:**
   • শব্দটি মুখস্থ না করে নিজের জীবনের মজার কোনো ঘটনার সাথে ভিজ্যুয়ালাইজ করো।
   • যেমন: **Abundant** -> বাজারে প্রচুর **A + bun** (পাউরুটি) রাখা আছে!

3. **Derivatives (Word Family) শিট:**
   • এক শব্দ দিয়ে চারটি পদ একসাথে শেখা। যেমন:
   • **Agony** (Noun: যন্ত্রণা) -> **Agonize** (Verb) -> **Agonizing** (Adj) -> **Agonizingly** (Adv)।

4. **Spaced Repetition (পরবর্তী দিনের ওয়ার্ম-আপ):**
   • আজ পড়া শব্দগুলো কাল সকালে একবার রিভিশন দাও। আমাদের **My Vocab List** ও **Warm-up Mini Exam** এই নিয়মে ডিজাইন করা!`;
  }

  // 4. Quick-ask: Daily Life Examples
  if (lower.includes('দৈনন্দিন জীবনের উদাহরণ') || lower.includes('daily life example')) {
    return `### 💬 স্পোকেন ও দৈনন্দিন জীবনে ভোকাবুলারি ব্যবহারের নিয়ম

ইংরেজি শব্দ কেবল পরীক্ষার খাতায় নয়, প্রতিদিনের ছোট ছোট কথায় ব্যবহার করলে তা স্মৃতিতে চিরস্থায়ী হয়।

📌 **৩টি চমৎকার স্পোকেন ব্যবহারের উদাহরণ:**
1. **Appreciate (কদর করা / ধন্যবাদ জানানো):**
   • &ldquo;I really **appreciate** your timely guidance and support.&rdquo; 🔊
   • *অর্থ:* আপনার সময়োপযোগী পথনির্দেশনা ও সহযোগিতার জন্য আমি সত্যিই কৃতজ্ঞ।

2. **Hesitate (দ্বিধা করা):**
   • &ldquo;Please do not **hesitate** to ask if you face any difficulty.&rdquo; 🔊
   • *অর্থ:* কোনো সমস্যায় পড়লে নির্দ্বিধায় জিজ্ঞাসা করো।

3. **Adequate (পর্যাপ্ত / উপযুক্ত):**
   • &ldquo;Ensure an **adequate** amount of sleep before the final exam.&rdquo; 🔊
   • *অর্থ:* চূড়ান্ত পরীক্ষার আগে পর্যাপ্ত পরিমাণ ঘুম নিশ্চিত করো।`;
  }

  // 5. Quick-ask: Derivatives Transformation
  if (lower.includes('noun, verb') || lower.includes('রূপগুলো দেখাও') || lower.includes('derivatives')) {
    return `### 📊 Derivatives (Word Family) রূপান্তরের ম্যাজিক রুলস

শব্দের শেষের প্রত্যয় (Suffix) দেখে সহজেই পদ পরিবর্তন ও চেনা যায়:

1. **Noun গঠন করার কমন Suffix:**
   • **-tion / -sion:** Educate -> Educa**tion**, Decide -> Deci**sion**
   • **-ment:** Achieve -> Achieve**ment**, Agree -> Agree**ment**
   • **-ance / -ence:** Abound -> Abund**ance**, Differ -> Differ**ence**

2. **Verb গঠন করার কমন Suffix:**
   • **-ize / -ise:** Agony -> Agon**ize**, Real -> Real**ize**
   • **-ate:** Active -> Activ**ate**, Alien -> Alien**ate**
   • **-ify:** Pure -> Pur**ify**, Simple -> Simpl**ify**

3. **Adjective গঠন করার কমন Suffix:**
   • **-ous:** Danger -> Danger**ous**, Ambition -> Ambiti**ous**
   • **-ful:** Care -> Care**ful**, Peace -> Peace**ful**
   • **-ive:** Act -> Act**ive**, Attract -> Attract**ive**

4. **Adverb গঠন করার সাধারণ নিয়ম:**
   • Adjective-এর সাথে **-ly** যুক্ত করা:
   • Quick -> Quick**ly**, Agonizing -> Agonizing**ly**, Abundant -> Abundant**ly**।

💡 *টিপ:* আমাদের প্রতিটি ওয়ার্ড কার্ডের নিচে সম্পূর্ণ Derivatives টেবিল পেয়ে যাবে!`;
  }

  // 6. Look for a specific word in prompt
  // Remove punctuation and clean tokens
  const cleanTokens = prompt.replace(/[^\w\s-]/g, ' ').split(/\s+/).filter(t => t.length > 2);
  let matchedWord = null;

  for (const token of cleanTokens) {
    if (typeof findWordAnywhere === 'function') {
      const found = findWordAnywhere(token);
      if (found) {
        matchedWord = found;
        break;
      }
    }
  }

  if (matchedWord) {
    activeTutorWordContext = matchedWord.word;
    if ((!matchedWord.derivatives || typeof matchedWord.derivatives !== 'object') && typeof generateSafeDerivatives === 'function') {
      matchedWord.derivatives = generateSafeDerivatives(matchedWord);
    }
    let resp = `🌿 **${matchedWord.word}** (${matchedWord.pos || 'Word'})\n`;
    resp += `🗣️ **উচ্চারণ:** ${matchedWord.ipa || matchedWord.word} 🔊\n`;
    resp += `📌 **বাংলা অর্থ:** ${matchedWord.meaningBn || matchedWord.meaning || ''}\n\n`;

    resp += `🧠 **সহজে মনে রাখার ট্রিক (Mnemonic):**\n`;
    resp += `${getMnemonicForWord(matchedWord.word, matchedWord.meaningBn)}\n\n`;

    if (matchedWord.derivatives) {
      resp += `📊 **Derivatives (Word Family):**\n`;
      const d = matchedWord.derivatives;
      if (d.noun) resp += `• **Noun:** ${d.noun.word} (${d.noun.banglaMeaning || ''})\n`;
      if (d.verb) resp += `• **Verb:** ${d.verb.word} (${d.verb.banglaMeaning || ''})\n`;
      if (d.adjective) resp += `• **Adjective:** ${d.adjective.word} (${d.adjective.banglaMeaning || ''})\n`;
      if (d.adverb) resp += `• **Adverb:** ${d.adverb.word} (${d.adverb.banglaMeaning || ''})\n`;
      resp += `\n`;
    }

    if (matchedWord.example) {
      resp += `💬 **বাস্তব জীবনের উদাহরণ বাক্য:**\n`;
      resp += `• &ldquo;${matchedWord.example}&rdquo; 🔊\n`;
      if (matchedWord.exampleBn) {
        resp += `  *বাংলা:* ${matchedWord.exampleBn}\n\n`;
      }
    }

    if (Array.isArray(matchedWord.synonyms) && matchedWord.synonyms.length > 0) {
      resp += `🔄 **Synonyms (সমার্থক শব্দ):** ${matchedWord.synonyms.slice(0, 4).join(', ')}\n`;
    }
    if (Array.isArray(matchedWord.antonyms) && matchedWord.antonyms.length > 0) {
      resp += `⚡ **Antonyms (বিপরীত শব্দ):** ${matchedWord.antonyms.slice(0, 4).join(', ')}\n`;
    }

    resp += `\n💡 *টিপ:* উপরের বাক্যের পাশের 🔊 বাটনে চাপ দিলে স্পষ্ট উচ্চারণ শুনতে পাবে!`;
    return resp;
  }

  // 7. General Friendly Fallback Mentor response
  return `🌿 **চমৎকার প্রশ্ন!**

আমি **Vocab AI Tutor**, তোমার সাথে আছি ইংরেজি শব্দভান্ডার ও ব্যাকরণ সহজ করতে।

তুমি চাইলে:
1. আমাদের কারিকুলামের যেকোনো শব্দ (যেমন: **Abundant, Agony, Abandon, Acquire**) সম্পর্কে জানতে পারো।
2. দুটি শব্দের পার্থক্য বুঝতে পারো (যেমন: **Accept vs Except**, **Affect vs Effect**)।
3. নিচের সাজেশনের যেকোনো বাটনে ট্যাপ করতে পারো।

💡 *টিপ:* তুমি চাইলে উপরের 🔑 বাটনে চাপ দিয়ে তোমার ব্যক্তিগত AI Key যুক্ত করে যেকোনো নতুন বিষয়ের সম্পূর্ণ ব্যাখ্যাও পেতে পারো!`;
}


// Global window registrations for Vocab AI Tutor
if (typeof window !== 'undefined') {
  window.getAITutorIconSvg = getAITutorIconSvg;
  window.ensureAITutorWidget = ensureAITutorWidget;
  window.openAITutorModal = openAITutorModal;
  window.closeAITutorModal = closeAITutorModal;
  window.toggleAITutorModal = toggleAITutorModal;
  window.askAITutorAboutWord = askAITutorAboutWord;
  window.sendQuickAITutorPrompt = sendQuickAITutorPrompt;
  window.clearAITutorChat = clearAITutorChat;
  window.submitAITutorMessage = submitAITutorMessage;
  window.speakFromChat = speakFromChat;
  window.toggleAITutorKeyModal = toggleAITutorKeyModal;
  window.saveAITutorKey = saveAITutorKey;
  window.removeAITutorKey = removeAITutorKey;
  window.generateLocalAITutorResponse = generateLocalAITutorResponse;
}


/* =====================================================================
   9. "MY VOCAB LIST" DAILY TRACKING & WARM-UP REVISION ENGINE
====================================================================== */

function getTodayDateString() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getYesterdayDateString() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatVocabDateDisplay(dateStr) {
  if (!dateStr) return 'Earlier (পূর্ববর্তী)';
  const today = getTodayDateString();
  const yest = getYesterdayDateString();
  if (dateStr === today) return 'Today (আজকের শব্দ)';
  if (dateStr === yest) return 'Yesterday (গতকালের শব্দ)';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const mIdx = parseInt(parts[1], 10) - 1;
      const mName = months[mIdx] || parts[1];
      return `${parseInt(parts[2], 10)} ${mName} ${parts[0]}`;
    }
  } catch (e) {}
  return dateStr;
}

function findWordAnywhere(wordId) {
  if (!wordId) return null;
  const targetId = String(wordId).trim().toLowerCase();
  const currData = (typeof CURRICULUM_DATA !== 'undefined' && CURRICULUM_DATA) || (typeof window !== 'undefined' && window.CURRICULUM_DATA);

  // Search CURRICULUM_DATA
  if (currData) {
    for (const lvlKey of Object.keys(currData)) {
      const lvl = currData[lvlKey];
      if (lvl && Array.isArray(lvl.words)) {
        const found = lvl.words.find(w => w && (String(w.id).toLowerCase() === targetId || (w.word && w.word.toLowerCase() === targetId)));
        if (found) {
          return {
            id: found.id || wordId,
            word: found.word,
            meaning: found.meaningBn || found.meaning || '',
            meaningBn: found.meaningBn || found.meaning || '',
            explanationEn: found.explanationEn || '',
            synonyms: Array.isArray(found.synonyms) ? found.synonyms.map(s => typeof s === 'string' ? s : (s && s.word ? s.word : '')) : [],
            antonyms: Array.isArray(found.antonyms) ? found.antonyms.map(a => typeof a === 'string' ? a : (a && a.word ? a.word : '')) : [],
            example: found.example || '',
            exampleBn: found.exampleBn || '',
            pos: found.pos || 'noun',
            ipa: found.ipa || '',
            level: lvlKey,
            levelTitle: lvl.title || lvlKey,
            derivatives: found.derivatives || null
          };
        }
      }
      if (lvl && Array.isArray(lvl.practiceExtraWords)) {
        const found = lvl.practiceExtraWords.find(w => w && (String(w.id).toLowerCase() === targetId || (w.word && w.word.toLowerCase() === targetId)));
        if (found) {
          return {
            id: found.id || wordId,
            word: found.word,
            meaning: found.meaningBn || found.meaning || '',
            meaningBn: found.meaningBn || found.meaning || '',
            explanationEn: found.explanationEn || '',
            synonyms: Array.isArray(found.synonyms) ? found.synonyms.map(s => typeof s === 'string' ? s : (s && s.word ? s.word : '')) : [],
            antonyms: Array.isArray(found.antonyms) ? found.antonyms.map(a => typeof a === 'string' ? a : (a && a.word ? a.word : '')) : [],
            example: found.example || '',
            exampleBn: found.exampleBn || '',
            pos: found.pos || 'noun',
            ipa: found.ipa || '',
            level: lvlKey,
            levelTitle: lvl.title || lvlKey,
            derivatives: found.derivatives || null
          };
        }
      }
    }
  }

  // Search Custom Words
  if (typeof getCustomWords === 'function') {
    const customWords = getCustomWords();
    const found = customWords.find(w => w && (String(w.id).toLowerCase() === targetId || (w.word && w.word.toLowerCase() === targetId)));
    if (found) {
      return {
        id: found.id || wordId,
        word: found.word,
        meaning: found.meaningBn || found.meaning || '',
        meaningBn: found.meaningBn || found.meaning || '',
        explanationEn: found.explanationEn || '',
        synonyms: Array.isArray(found.synonyms) ? found.synonyms.map(s => typeof s === 'string' ? s : (s && s.word ? s.word : '')) : [],
        antonyms: Array.isArray(found.antonyms) ? found.antonyms.map(a => typeof a === 'string' ? a : (a && a.word ? a.word : '')) : [],
        example: found.example || '',
        exampleBn: found.exampleBn || '',
        pos: found.pos || 'noun',
        ipa: found.ipa || '',
        level: found.level || 'beginner',
        levelTitle: 'Custom Word'
      };
    }
  }

  return null;
}

function getMyVocabList() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MY_VOCAB);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveMyVocabList(list) {
  try {
    localStorage.setItem(STORAGE_KEYS.MY_VOCAB, JSON.stringify(list || []));
    updateMyVocabPillCounters();
  } catch (e) {}
}

function isInMyVocabList(wordId) {
  if (!wordId) return false;
  const list = getMyVocabList();
  const cleanId = String(wordId).trim().toLowerCase();
  return list.some(item => item && (item.id === wordId || String(item.id).toLowerCase() === cleanId || (item.word && item.word.toLowerCase() === cleanId)));
}

function addToMyVocabList(wordId, userInitiated = false) {
  if (!wordId) return null;
  const list = getMyVocabList();
  const cleanId = String(wordId).trim().toLowerCase();
  const existing = list.find(item => item && (item.id === wordId || String(item.id).toLowerCase() === cleanId || (item.word && item.word.toLowerCase() === cleanId)));

  if (existing) {
    if (userInitiated && typeof showToast === 'function') {
      showToast(`ℹ️ "${existing.word}" শব্দটি ইতিমধ্যেই আপনার Vocab List-এ রয়েছে`, 'info');
    }
    updateMyVocabCardButton(wordId, true);
    return existing;
  }

  const wordData = findWordAnywhere(wordId);
  const entry = {
    id: wordData ? wordData.id : wordId,
    word: wordData ? wordData.word : wordId,
    meaning: wordData ? (wordData.meaningBn || wordData.meaning || '') : '',
    meaningBn: wordData ? (wordData.meaningBn || wordData.meaning || '') : '',
    synonyms: wordData ? (wordData.synonyms || []) : [],
    antonyms: wordData ? (wordData.antonyms || []) : [],
    example: wordData ? (wordData.example || '') : '',
    exampleBn: wordData ? (wordData.exampleBn || '') : '',
    pos: wordData ? (wordData.pos || 'noun') : 'noun',
    ipa: wordData ? (wordData.ipa || '') : '',
    level: wordData ? (wordData.level || (typeof AppState !== 'undefined' ? AppState.selectedLevel : 'beginner')) : 'beginner',
    learnedDate: getTodayDateString(),
    revisionCount: 0,
    lastRevisedDate: null
  };

  list.unshift(entry);
  saveMyVocabList(list);
  updateMyVocabCardButton(wordId, true);

  if (userInitiated && typeof showToast === 'function') {
    showToast(`✅ "${entry.word}" My Vocab List-এ যুক্ত হয়েছে!`, 'success');
  }

  return entry;
}

function removeFromMyVocabList(wordId) {
  if (!wordId) return;
  const list = getMyVocabList();
  const cleanId = String(wordId).trim().toLowerCase();
  const target = list.find(item => item && (item.id === wordId || String(item.id).toLowerCase() === cleanId || (item.word && item.word.toLowerCase() === cleanId)));
  const filtered = list.filter(item => !(item && (item.id === wordId || String(item.id).toLowerCase() === cleanId || (item.word && item.word.toLowerCase() === cleanId))));

  saveMyVocabList(filtered);
  updateMyVocabCardButton(wordId, false);

  if (typeof showToast === 'function') {
    const wordLabel = target ? target.word : wordId;
    showToast(`🗑️ "${wordLabel}" My Vocab List থেকে সরানো হয়েছে`, 'info');
  }

  if (typeof renderLearnPage === 'function' && typeof activeTab !== 'undefined' && activeTab === 'my-vocab') {
    renderLearnPage();
  }
  if (typeof renderTrackerPage === 'function' && typeof window !== 'undefined' && window.location && window.location.pathname.includes('tracker')) {
    renderTrackerPage();
  }
}

function toggleMyVocabWord(wordId) {
  if (isInMyVocabList(wordId)) {
    removeFromMyVocabList(wordId);
  } else {
    addToMyVocabList(wordId, true);
  }
}

function renderMyVocabCardButtonHTML(wordId) {
  const isLearned = isInMyVocabList(wordId);
  return `
    <button
      id="my-vocab-btn-${escapeHtml(wordId)}"
      type="button"
      onclick="event.stopPropagation(); toggleMyVocabWord('${escapeHtml(wordId)}')"
      class="vw-my-vocab-btn ${isLearned ? 'is-learned' : ''} px-2.5 py-1 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5"
      title="${isLearned ? 'In My Vocab List (Click to remove)' : 'Mark as Learned & Add to My Vocab'}"
    >
      <span class="vw-my-vocab-icon">${isLearned ? '✓' : '+'}</span>
      <span class="vw-my-vocab-text">${isLearned ? 'In My Vocab' : 'Mark Learned'}</span>
    </button>
  `;
}

function updateMyVocabCardButton(wordId, isLearned) {
  const btn = document.getElementById(`my-vocab-btn-${wordId}`);
  if (!btn) return;
  if (isLearned) {
    btn.classList.add('is-learned');
    btn.title = 'In My Vocab List (Click to remove)';
    const icon = btn.querySelector('.vw-my-vocab-icon');
    const text = btn.querySelector('.vw-my-vocab-text');
    if (icon) icon.textContent = '✓';
    if (text) text.textContent = 'In My Vocab';
  } else {
    btn.classList.remove('is-learned');
    btn.title = 'Mark as Learned & Add to My Vocab';
    const icon = btn.querySelector('.vw-my-vocab-icon');
    const text = btn.querySelector('.vw-my-vocab-text');
    if (icon) icon.textContent = '+';
    if (text) text.textContent = 'Mark Learned';
  }
}

function updateMyVocabPillCounters() {
  const count = getMyVocabList().length;
  const pills = document.querySelectorAll('.vw-my-vocab-count-badge');
  pills.forEach(el => {
    el.textContent = count;
  });
}

function groupMyVocabByDate(list) {
  const today = getTodayDateString();
  const yest = getYesterdayDateString();

  const groups = {
    today: [],
    yesterday: [],
    earlier: []
  };

  list.forEach(item => {
    if (!item.learnedDate || item.learnedDate === today) {
      groups.today.push(item);
    } else if (item.learnedDate === yest) {
      groups.yesterday.push(item);
    } else {
      groups.earlier.push(item);
    }
  });

  return groups;
}

function renderMyVocabListMarkup(options = {}) {
  const list = getMyVocabList();
  const groups = groupMyVocabByDate(list);
  const totalCount = list.length;

  if (totalCount === 0) {
    return `
      <div class="rounded-3xl p-8 sm:p-12 border text-center space-y-4" style="background-color: var(--surface-white); border-color: var(--border-subtle);">
        <div class="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl" style="background-color: var(--accent-sage-soft); color: var(--accent-sage);">
          📖
        </div>
        <h3 class="font-editorial text-2xl font-bold" style="color: var(--ink-primary);">
          Your Vocab List is Currently Empty
        </h3>
        <p class="font-bengali text-sm max-w-md mx-auto" style="color: var(--ink-secondary);">
          আপনার তালিকায় এখনো কোনো শব্দ যুক্ত হয়নি। শব্দ কার্ডের <strong>"Mark Learned"</strong> বাটনে ক্লিক করলে অথবা উচ্চারণ শুনলে / কার্টুন ভিডিও দেখলে শব্দগুলো স্বয়ংক্রিয়ভাবে এখানে সংরক্ষিত হবে!
        </p>
        <div class="pt-2">
          <a href="learn.html" class="vw-btn-primary font-bengali px-6 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5">
            <span>শব্দ শিখতে যান (Start Learning)</span>
            <span>&rarr;</span>
          </a>
        </div>
      </div>
    `;
  }

  function renderWordItemCard(item) {
    const sid = registerSpeakText(item.word);
    const revCount = item.revisionCount || 0;
    const revBadge = revCount > 0
      ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold border" style="background-color: var(--accent-sage-soft); border-color: rgba(45, 90, 76, 0.25); color: var(--accent-sage);">🔄 ${revCount} বার রিভিশন</span>`
      : `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold border" style="background-color: var(--surface-sand); border-color: var(--border-subtle); color: var(--ink-muted);">নতুন শব্দ (Unrevised)</span>`;

    return `
      <div class="vw-my-vocab-card rounded-2xl p-4 sm:p-5 border flex flex-col justify-between transition-all space-y-3" style="background-color: var(--bg-ivory); border-color: var(--border-subtle);">
        <div>
          <!-- Top Row: Word & Actions -->
          <div class="flex items-start justify-between gap-2 mb-2">
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <strong class="font-editorial text-lg sm:text-xl font-bold" style="color: var(--ink-primary);">${escapeHtml(item.word)}</strong>
                <button
                  type="button"
                  onclick="speakById(${sid}, this)"
                  class="vw-speak-btn vw-speak-main px-2 py-0.5 rounded-full text-xs font-bold gap-1 shrink-0 cursor-pointer"
                  title="Listen pronunciation"
                >
                  ${speakerIconSvg('w-3 h-3')}
                  <span>Listen</span>
                </button>
                ${typeof renderCardAccentSwitcherHTML === 'function' ? renderCardAccentSwitcherHTML(sid, item.id) : ''}
              </div>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-[10px] font-mono" style="color: var(--ink-muted);">${escapeHtml(item.ipa || '')}</span>
                <span class="text-[10px] font-bold px-1.5 py-0.2 rounded uppercase" style="background-color: var(--surface-sand); color: var(--ink-secondary);">${escapeHtml(item.pos || 'Word')}</span>
                <span class="text-[10px] font-bold px-1.5 py-0.2 rounded uppercase" style="background-color: var(--accent-sage-soft); color: var(--accent-sage);">${escapeHtml(item.level || 'vocab')}</span>
              </div>
            </div>

            <!-- Delete / Remove Button -->
            <button
              type="button"
              onclick="removeFromMyVocabList('${escapeHtml(item.id)}')"
              class="text-xs p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-red-50 text-red-600 transition-all cursor-pointer"
              title="Remove from My Vocab List"
            >
              ✕
            </button>
          </div>

          <!-- Bengali Meaning -->
          <div class="rounded-xl px-3 py-1.5 border mb-2.5" style="background-color: var(--surface-white); border-color: var(--border-subtle);">
            <p class="font-bengali text-xs sm:text-sm font-bold" style="color: var(--ink-primary);">
              অর্থ: ${escapeHtml(item.meaning || item.meaningBn || '')}
            </p>
          </div>

          <!-- Example Sentence if present -->
          ${item.example ? `
            <div class="text-xs leading-relaxed" style="color: var(--ink-secondary);">
              <span class="font-semibold block text-[10px] uppercase tracking-wider mb-0.5" style="color: var(--ink-muted);">Example:</span>
              <p class="italic">&ldquo;${escapeHtml(item.example)}&rdquo;</p>
              ${item.exampleBn ? `<p class="font-bengali text-[11px] mt-0.5" style="color: var(--ink-muted);">(${escapeHtml(item.exampleBn)})</p>` : ''}
            </div>
          ` : ''}
        </div>

        <!-- Footer Row: Revision status & AI Cartoon Button -->
        <div class="pt-2 border-t flex items-center justify-between gap-2 flex-wrap" style="border-color: var(--border-subtle);">
          <div>${revBadge}</div>
          <button
            type="button"
            onclick="CartoonPlayer.open('${escapeHtml(item.id)}')"
            class="vw-cartoon-play-btn font-bengali text-[11px] font-bold px-2.5 py-1 rounded-xl border flex items-center gap-1.5 hover:border-[#2D5A4C] cursor-pointer"
            style="background-color: var(--surface-white); border-color: var(--border-subtle); color: var(--accent-sage);"
          >
            <span>🎬 কার্টুন ভিডিও</span>
          </button>
        </div>
      </div>
    `;
  }

  const sectionsHTML = [];

  // 1. Today Group
  if (groups.today.length > 0) {
    sectionsHTML.push(`
      <div class="space-y-3.5">
        <div class="flex items-center justify-between gap-2 pb-1 border-b" style="border-color: var(--border-subtle);">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full" style="background-color: var(--accent-sage);"></span>
            <h4 class="font-editorial text-lg sm:text-xl font-bold" style="color: var(--ink-primary);">
              Today&rsquo;s Saved Words <span class="font-bengali text-xs font-semibold" style="color: var(--accent-sage);">(আজকের শব্দ &bull; ${groups.today.length}টি)</span>
            </h4>
          </div>
          <span class="font-editorial text-xs font-semibold px-2.5 py-1 rounded-full border" style="background-color: var(--accent-sage-soft); border-color: rgba(45, 90, 76, 0.2); color: var(--accent-sage);">
            ${escapeHtml(getTodayDateString())}
          </span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          ${groups.today.map(renderWordItemCard).join('')}
        </div>
      </div>
    `);
  }

  // 2. Yesterday Group
  if (groups.yesterday.length > 0) {
    sectionsHTML.push(`
      <div class="space-y-3.5">
        <div class="flex items-center justify-between gap-2 pb-1 border-b" style="border-color: var(--border-subtle);">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full" style="background-color: var(--accent-terracotta);"></span>
            <h4 class="font-editorial text-lg sm:text-xl font-bold" style="color: var(--ink-primary);">
              Yesterday&rsquo;s Words <span class="font-bengali text-xs font-semibold" style="color: var(--accent-terracotta);">(গতকালের শব্দ &bull; ${groups.yesterday.length}টি)</span>
            </h4>
          </div>
          <span class="font-editorial text-xs font-semibold px-2.5 py-1 rounded-full border" style="background-color: var(--accent-terracotta-soft); border-color: rgba(194, 109, 83, 0.2); color: var(--accent-terracotta);">
            ${escapeHtml(getYesterdayDateString())}
          </span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          ${groups.yesterday.map(renderWordItemCard).join('')}
        </div>
      </div>
    `);
  }

  // 3. Earlier Group
  if (groups.earlier.length > 0) {
    sectionsHTML.push(`
      <div class="space-y-3.5">
        <div class="flex items-center justify-between gap-2 pb-1 border-b" style="border-color: var(--border-subtle);">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full" style="background-color: var(--ink-muted);"></span>
            <h4 class="font-editorial text-lg sm:text-xl font-bold" style="color: var(--ink-primary);">
              Earlier Learned Words <span class="font-bengali text-xs font-semibold" style="color: var(--ink-muted);">(পূর্ববর্তী শব্দ &bull; ${groups.earlier.length}টি)</span>
            </h4>
          </div>
          <span class="text-xs font-semibold px-2.5 py-1 rounded-full border" style="background-color: var(--surface-sand); border-color: var(--border-subtle); color: var(--ink-secondary);">
            Previous Days
          </span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          ${groups.earlier.map(renderWordItemCard).join('')}
        </div>
      </div>
    `);
  }

  return `
    <div class="space-y-6">
      <!-- Top Action & Overview Bar -->
      <div class="rounded-3xl p-5 sm:p-7 border flex flex-col md:flex-row md:items-center justify-between gap-4" style="background-color: var(--surface-white); border-color: var(--border-subtle);">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full" style="background-color: var(--accent-sage-soft); color: var(--accent-sage);">
              MY VOCABULARY NOTEBOOK &bull; আমার শব্দভাণ্ডার
            </span>
            <span class="text-xs font-bold px-2 py-0.5 rounded-full border" style="background-color: var(--surface-sand); border-color: var(--border-subtle); color: var(--ink-primary);">
              মোট ${totalCount}টি শব্দ
            </span>
          </div>
          <h3 class="font-editorial text-xl sm:text-2xl font-bold mt-1.5" style="color: var(--ink-primary);">
            Personal Vocab &amp; Next-Day Revision Hub
          </h3>
          <p class="font-bengali text-xs sm:text-sm mt-0.5" style="color: var(--ink-secondary);">
            প্রতিদিন তোমার শেখা শব্দগুলো তারিখ অনুযায়ী সাজানো থাকে। প্রতিদিন নতুন শব্দ শেখার আগে রিভিশন কুইজ দিয়ে স্মৃতি ঝালিয়ে নিন!
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onclick="WarmupExam.open(true)"
            class="vw-btn-primary font-bengali px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <span>⚡ রিভিশন কুইজ দিন (Take Revision Quiz)</span>
          </button>
        </div>
      </div>

      <!-- Date-Grouped Word Cards -->
      ${sectionsHTML.join('')}
    </div>
  `;
}

const WarmupExam = {
  state: {
    isOpen: false,
    forceOnDemand: false,
    questions: [],
    currentIdx: 0,
    score: 0,
    answered: false,
    isExamComplete: false
  },

  checkAndTrigger: function() {
    try {
      const list = getMyVocabList();
      if (!list || list.length === 0) return;
      const today = getTodayDateString();
      const previousWords = list.filter(w => w.learnedDate && w.learnedDate < today);
      if (previousWords.length === 0) return;

      const lastWarmup = localStorage.getItem(STORAGE_KEYS.LAST_WARMUP_DATE);
      if (lastWarmup !== today) {
        // Trigger warm-up exam gate automatically!
        this.open(false);
      }
    } catch (e) {
      console.error('Error in WarmupExam.checkAndTrigger:', e);
    }
  },

  open: function(forceOnDemand = false) {
    const list = getMyVocabList();
    if (!list || list.length === 0) {
      if (forceOnDemand && typeof showToast === 'function') {
        showToast('ℹ️ My Vocab List-এ এখনো কোনো শব্দ নেই। কার্ডে "Mark Learned" চাপুন বা শব্দ শুনুন!', 'info');
      }
      return;
    }

    const today = getTodayDateString();
    let candidates = list.filter(w => w.learnedDate && w.learnedDate < today);

    // If on-demand and no previous words exist, allow quizzing today's words
    if (candidates.length === 0) {
      if (forceOnDemand) {
        candidates = [...list];
      } else {
        return;
      }
    }

    const questions = this.generateQuestions(candidates, list);
    if (!questions || questions.length === 0) {
      if (forceOnDemand && typeof showToast === 'function') {
        showToast('ℹ️ কুইজ তৈরির জন্য পর্যাপ্ত তথ্য পাওয়া যায়নি।', 'info');
      }
      return;
    }

    this.state = {
      isOpen: true,
      forceOnDemand: forceOnDemand,
      questions: questions,
      currentIdx: 0,
      score: 0,
      answered: false,
      isExamComplete: false
    };

    this.ensureModal();
    const modal = document.getElementById('vw-warmup-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
    this.renderQuestion();
  },

  close: function() {
    this.state.isOpen = false;
    const modal = document.getElementById('vw-warmup-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  },

  skip: function() {
    this.close();
    if (typeof showToast === 'function') {
      showToast('ℹ️ আজকের রিভিশন এড়িয়ে যাওয়া হয়েছে। পরবর্তীতে My Vocab থেকে পরীক্ষা দিতে পারবেন।', 'info');
    }
  },

  getAllAvailableWords: function() {
    const map = {};
    const currData = (typeof CURRICULUM_DATA !== 'undefined' && CURRICULUM_DATA) || (typeof window !== 'undefined' && window.CURRICULUM_DATA);
    if (currData) {
      Object.keys(currData).forEach(k => {
        const lvl = currData[k];
        if (lvl && lvl.words) {
          lvl.words.forEach(w => {
            if (w && w.word) map[w.word.toLowerCase()] = w;
          });
        }
      });
    }
    const myVocab = getMyVocabList();
    myVocab.forEach(w => {
      if (w && w.word) map[w.word.toLowerCase()] = w;
    });
    return Object.values(map);
  },

  generateQuestions: function(candidates, list) {
    const yest = getYesterdayDateString();
    const allPool = this.getAllAvailableWords();

    // Prioritize:
    // 1. Learned yesterday
    // 2. Least revised
    // 3. Other previous words
    const sorted = [...candidates].sort((a, b) => {
      const aIsYest = a.learnedDate === yest ? 1 : 0;
      const bIsYest = b.learnedDate === yest ? 1 : 0;
      if (aIsYest !== bIsYest) return bIsYest - aIsYest;
      return (a.revisionCount || 0) - (b.revisionCount || 0);
    });

    const targetWords = sorted.slice(0, 5);
    const questions = [];

    targetWords.forEach((tw, idx) => {
      const hasSyn = Array.isArray(tw.synonyms) && tw.synonyms.length > 0;
      const hasAnt = Array.isArray(tw.antonyms) && tw.antonyms.length > 0;

      let hasDeriv = false;
      let derivTarget = null;
      if (tw.derivatives && typeof tw.derivatives === 'object') {
        const candidateForms = [];
        const posLabels = {
          noun: { bn: 'Noun (বিশেষ্য)', en: 'Noun' },
          verb: { bn: 'Verb (ক্রিয়া)', en: 'Verb' },
          adjective: { bn: 'Adjective (বিশেষণ)', en: 'Adjective' },
          adverb: { bn: 'Adverb (ক্রিয়া বিশেষণ)', en: 'Adverb' }
        };
        ['noun', 'verb', 'adjective', 'adverb'].forEach(p => {
          const item = tw.derivatives[p];
          if (item && item.word && item.word.toLowerCase() !== tw.word.toLowerCase()) {
            candidateForms.push({
              posKey: p,
              posBn: posLabels[p].bn,
              posEn: posLabels[p].en,
              word: item.word,
              meaning: item.banglaMeaning || ''
            });
          }
        });
        if (candidateForms.length > 0) {
          hasDeriv = true;
          derivTarget = candidateForms[Math.floor(Math.random() * candidateForms.length)];
        }
      }

      let qType = idx % 5; // 0: Word->Meaning, 1: Meaning->Word, 2: Synonym, 3: Antonym, 4: Derivative
      if (qType === 2 && !hasSyn) qType = 0;
      if (qType === 3 && !hasAnt) qType = 1;
      if (qType === 4 && !hasDeriv) qType = 0;

      if (qType === 0) {
        // Word -> Meaning
        const correctMeaning = tw.meaning || tw.meaningBn || 'সঠিক অর্থ';
        const distractors = allPool
          .filter(w => w.word.toLowerCase() !== tw.word.toLowerCase() && (w.meaningBn || w.meaning) && (w.meaningBn || w.meaning) !== correctMeaning)
          .map(w => w.meaningBn || w.meaning);
        const uniqueDistractors = Array.from(new Set(distractors)).slice(0, 3);
        while (uniqueDistractors.length < 3) {
          uniqueDistractors.push('বিকল্প অর্থ ' + (uniqueDistractors.length + 1));
        }

        const choices = shuffleArray([
          { text: correctMeaning, isCorrect: true },
          { text: uniqueDistractors[0], isCorrect: false },
          { text: uniqueDistractors[1], isCorrect: false },
          { text: uniqueDistractors[2], isCorrect: false }
        ]);

        questions.push({
          type: 'word-to-meaning',
          targetWord: tw,
          title: `"${tw.word}" শব্দটির সঠিক বাংলা অর্থ কোনটি?`,
          subtitle: `What is the correct Bengali meaning of "${tw.word}"?`,
          choices: choices,
          explanation: `"${tw.word}" এর অর্থ হলো: ${correctMeaning}`
        });
      } else if (qType === 1) {
        // Meaning -> Word
        const targetMeaning = tw.meaning || tw.meaningBn || 'অর্থ';
        const distractors = allPool
          .filter(w => w.word.toLowerCase() !== tw.word.toLowerCase())
          .map(w => w.word);
        const uniqueDistractors = Array.from(new Set(distractors)).slice(0, 3);
        while (uniqueDistractors.length < 3) {
          uniqueDistractors.push('Option ' + (uniqueDistractors.length + 1));
        }

        const choices = shuffleArray([
          { text: tw.word, isCorrect: true },
          { text: uniqueDistractors[0], isCorrect: false },
          { text: uniqueDistractors[1], isCorrect: false },
          { text: uniqueDistractors[2], isCorrect: false }
        ]);

        questions.push({
          type: 'meaning-to-word',
          targetWord: tw,
          title: `কোন ইংরেজি শব্দটির অর্থ "${targetMeaning}"?`,
          subtitle: `Which English word corresponds to this meaning?`,
          choices: choices,
          explanation: `সঠিক শব্দ: ${tw.word} (${targetMeaning})`
        });
      } else if (qType === 2) {
        // Synonym Match
        const correctSyn = typeof tw.synonyms[0] === 'string' ? tw.synonyms[0] : (tw.synonyms[0].word || tw.synonyms[0]);
        const distractors = allPool
          .filter(w => w.word.toLowerCase() !== tw.word.toLowerCase() && w.word.toLowerCase() !== String(correctSyn).toLowerCase())
          .map(w => w.word);
        const uniqueDistractors = Array.from(new Set(distractors)).slice(0, 3);
        while (uniqueDistractors.length < 3) {
          uniqueDistractors.push('Alternative ' + (uniqueDistractors.length + 1));
        }

        const choices = shuffleArray([
          { text: correctSyn, isCorrect: true },
          { text: uniqueDistractors[0], isCorrect: false },
          { text: uniqueDistractors[1], isCorrect: false },
          { text: uniqueDistractors[2], isCorrect: false }
        ]);

        questions.push({
          type: 'synonym-match',
          targetWord: tw,
          title: `"${tw.word}" শব্দটির সঠিক সমার্থক শব্দ (Synonym) কোনটি?`,
          subtitle: `Identify the correct synonym for "${tw.word}":`,
          choices: choices,
          explanation: `"${tw.word}" এর সমার্থক শব্দ: ${correctSyn}`
        });
      } else if (qType === 3 && hasAnt) {
        // Antonym Match
        const correctAnt = typeof tw.antonyms[0] === 'string' ? tw.antonyms[0] : (tw.antonyms[0].word || tw.antonyms[0]);
        const distractors = allPool
          .filter(w => w.word.toLowerCase() !== tw.word.toLowerCase() && w.word.toLowerCase() !== String(correctAnt).toLowerCase())
          .map(w => w.word);
        const uniqueDistractors = Array.from(new Set(distractors)).slice(0, 3);
        while (uniqueDistractors.length < 3) {
          uniqueDistractors.push('Alternative ' + (uniqueDistractors.length + 1));
        }

        const choices = shuffleArray([
          { text: correctAnt, isCorrect: true },
          { text: uniqueDistractors[0], isCorrect: false },
          { text: uniqueDistractors[1], isCorrect: false },
          { text: uniqueDistractors[2], isCorrect: false }
        ]);

        questions.push({
          type: 'antonym-match',
          targetWord: tw,
          title: `"${tw.word}" শব্দটির বিপরীতার্থক শব্দ (Antonym) কোনটি?`,
          subtitle: `Identify the correct antonym for "${tw.word}":`,
          choices: choices,
          explanation: `"${tw.word}" এর বিপরীতার্থক শব্দ: ${correctAnt}`
        });
      } else if (qType === 4 && hasDeriv && derivTarget) {
        // Derivative Transformation Question
        const correctWord = derivTarget.word;
        const distractors = [];
        allPool.forEach(w => {
          if (w.derivatives && w.derivatives[derivTarget.posKey] && w.derivatives[derivTarget.posKey].word) {
            const dw = w.derivatives[derivTarget.posKey].word;
            if (dw.toLowerCase() !== correctWord.toLowerCase() && dw.toLowerCase() !== tw.word.toLowerCase()) {
              distractors.push(dw);
            }
          }
        });
        const uniqueDistractors = Array.from(new Set(distractors)).slice(0, 3);
        while (uniqueDistractors.length < 3) {
          uniqueDistractors.push(`${tw.word}ly`);
        }

        const choices = shuffleArray([
          { text: correctWord, isCorrect: true },
          { text: uniqueDistractors[0], isCorrect: false },
          { text: uniqueDistractors[1], isCorrect: false },
          { text: uniqueDistractors[2], isCorrect: false }
        ]);

        questions.push({
          type: 'derivative-transformation',
          targetWord: tw,
          title: `"${tw.word}" শব্দটির সঠিক ${derivTarget.posBn} রূপ কোনটি?`,
          subtitle: `What is the correct ${derivTarget.posEn} form of "${tw.word}"?`,
          choices: choices,
          explanation: `"${tw.word}" এর ${derivTarget.posBn} হলো: ${correctWord} (${derivTarget.meaning || ''})`
        });
      } else {
        // Fallback: Word -> Meaning
        const correctMeaning = tw.meaning || tw.meaningBn || 'সঠিক অর্থ';
        const distractors = allPool
          .filter(w => w.word.toLowerCase() !== tw.word.toLowerCase() && (w.meaningBn || w.meaning) && (w.meaningBn || w.meaning) !== correctMeaning)
          .map(w => w.meaningBn || w.meaning);
        const uniqueDistractors = Array.from(new Set(distractors)).slice(0, 3);
        while (uniqueDistractors.length < 3) {
          uniqueDistractors.push('বিকল্প অর্থ ' + (uniqueDistractors.length + 1));
        }

        const choices = shuffleArray([
          { text: correctMeaning, isCorrect: true },
          { text: uniqueDistractors[0], isCorrect: false },
          { text: uniqueDistractors[1], isCorrect: false },
          { text: uniqueDistractors[2], isCorrect: false }
        ]);

        questions.push({
          type: 'word-to-meaning',
          targetWord: tw,
          title: `"${tw.word}" শব্দটির সঠিক বাংলা অর্থ কোনটি?`,
          subtitle: `What is the correct Bengali meaning of "${tw.word}"?`,
          choices: choices,
          explanation: `"${tw.word}" এর অর্থ হলো: ${correctMeaning}`
        });
      }
    });

    return questions;
  },

  ensureModal: function() {
    let modal = document.getElementById('vw-warmup-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'vw-warmup-modal';
      modal.className = 'fixed inset-0 z-50 hidden items-center justify-center p-4 overflow-y-auto';
      modal.style.backgroundColor = 'rgba(30, 36, 33, 0.7)';
      modal.style.backdropFilter = 'blur(8px)';
      modal.innerHTML = `
        <div class="relative w-full max-w-xl rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-6 my-auto" style="background-color: var(--surface-white); border-color: var(--border-subtle);">
          <div id="vw-warmup-body"></div>
        </div>
      `;
      document.body.appendChild(modal);
    }
  },

  renderQuestion: function() {
    const body = document.getElementById('vw-warmup-body');
    if (!body) return;

    const q = this.state.questions[this.state.currentIdx];
    const total = this.state.questions.length;
    const currentNum = this.state.currentIdx + 1;
    const pct = Math.round((currentNum / total) * 100);

    this.state.answered = false;

    body.innerHTML = `
      <!-- Header with Gate Badge & Skip -->
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full" style="background-color: var(--accent-sage-soft); color: var(--accent-sage);">
            🌅 NEXT-DAY WARM-UP REVISION &bull; দৈনিক প্রস্তুতি পরীক্ষা
          </span>
        </div>
        <button
          type="button"
          onclick="WarmupExam.skip()"
          class="font-bengali text-xs font-semibold hover:underline cursor-pointer"
          style="color: var(--ink-muted);"
        >
          এখন এড়িয়ে যান (Skip)
        </button>
      </div>

      <!-- Question Progress -->
      <div>
        <div class="flex items-center justify-between text-xs font-semibold mb-1.5" style="color: var(--ink-secondary);">
          <span>প্রশ্ন ${currentNum} / ${total}</span>
          <span class="font-editorial text-[#2D5A4C] font-bold">${pct}%</span>
        </div>
        <div class="vw-progress-track h-2 w-full rounded-full overflow-hidden">
          <div class="vw-progress-bar h-full rounded-full bg-[#2D5A4C] transition-all duration-300" style="width: ${pct}%;"></div>
        </div>
      </div>

      <!-- Question Prompt Box -->
      <div class="rounded-2xl p-5 border text-center space-y-1.5" style="background-color: var(--bg-ivory); border-color: var(--border-subtle);">
        <h3 class="font-editorial text-xl sm:text-2xl font-bold leading-snug" style="color: var(--ink-primary);">
          ${escapeHtml(q.title)}
        </h3>
        <p class="text-xs sm:text-sm font-medium" style="color: var(--ink-secondary);">
          ${escapeHtml(q.subtitle)}
        </p>
      </div>

      <!-- 4 MCQ Options -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="vw-warmup-options-container">
        ${q.choices.map((c, idx) => `
          <button
            type="button"
            id="vw-warmup-opt-${idx}"
            onclick="WarmupExam.submitAnswer(${idx})"
            class="vw-warmup-option-btn text-left p-4 rounded-2xl border font-bengali text-sm font-semibold transition-all cursor-pointer flex items-center justify-between gap-2"
            style="background-color: var(--surface-white); border-color: var(--border-subtle); color: var(--ink-primary);"
          >
            <span>${escapeHtml(c.text)}</span>
            <span class="vw-opt-badge w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0" style="border-color: var(--border-subtle);">
              ${String.fromCharCode(65 + idx)}
            </span>
          </button>
        `).join('')}
      </div>

      <!-- Feedback Reveal & Next Button -->
      <div id="vw-warmup-feedback" class="hidden rounded-2xl p-4 border space-y-3 transition-all" style="background-color: var(--surface-sand); border-color: var(--border-subtle);">
        <div id="vw-warmup-feedback-msg" class="font-bengali text-xs sm:text-sm font-bold"></div>
        <div class="flex items-center justify-between gap-2 pt-1 border-t" style="border-color: var(--border-subtle);">
          <span class="text-xs font-semibold" style="color: var(--ink-muted);">
            Score: ${this.state.score} / ${currentNum}
          </span>
          <button
            type="button"
            onclick="WarmupExam.nextQuestion()"
            class="vw-btn-primary font-bengali px-5 py-2 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>${currentNum === total ? 'ফলাফল দেখুন (See Results) →' : 'পরবর্তী প্রশ্ন (Next Question) →'}</span>
          </button>
        </div>
      </div>
    `;
  },

  submitAnswer: function(choiceIdx) {
    if (this.state.answered) return;
    this.state.answered = true;

    const q = this.state.questions[this.state.currentIdx];
    const chosen = q.choices[choiceIdx];
    const isCorrect = !!(chosen && chosen.isCorrect);

    if (isCorrect) {
      this.state.score += 1;
    }

    // Record revision update to target word in localStorage
    this.recordWordRevision(q.targetWord, isCorrect);

    // Disable all option buttons
    q.choices.forEach((c, idx) => {
      const btn = document.getElementById(`vw-warmup-opt-${idx}`);
      if (!btn) return;
      btn.disabled = true;
      btn.style.cursor = 'default';

      if (c.isCorrect) {
        btn.classList.add('is-correct');
        btn.style.backgroundColor = 'var(--accent-sage-soft)';
        btn.style.borderColor = 'var(--accent-sage)';
        btn.style.color = 'var(--accent-sage)';
        const badge = btn.querySelector('.vw-opt-badge');
        if (badge) {
          badge.textContent = '✓';
          badge.style.backgroundColor = 'var(--accent-sage)';
          badge.style.color = '#FFFFFF';
          badge.style.borderColor = 'var(--accent-sage)';
        }
      } else if (idx === choiceIdx && !isCorrect) {
        btn.classList.add('is-wrong');
        btn.style.backgroundColor = 'var(--accent-terracotta-soft)';
        btn.style.borderColor = 'var(--accent-terracotta)';
        btn.style.color = 'var(--accent-terracotta)';
        const badge = btn.querySelector('.vw-opt-badge');
        if (badge) {
          badge.textContent = '✕';
          badge.style.backgroundColor = 'var(--accent-terracotta)';
          badge.style.color = '#FFFFFF';
          badge.style.borderColor = 'var(--accent-terracotta)';
        }
      } else {
        btn.style.opacity = '0.5';
      }
    });

    // Show Feedback Box
    const feedbackEl = document.getElementById('vw-warmup-feedback');
    const msgEl = document.getElementById('vw-warmup-feedback-msg');
    if (feedbackEl && msgEl) {
      feedbackEl.classList.remove('hidden');
      if (isCorrect) {
        msgEl.innerHTML = `<span style="color: var(--accent-sage);">✅ চমৎকার! সঠিক উত্তর।</span> <span class="font-normal font-sans text-xs block mt-0.5" style="color: var(--ink-secondary);">${escapeHtml(q.explanation)}</span>`;
      } else {
        msgEl.innerHTML = `<span style="color: var(--accent-terracotta);">❌ ভুল উত্তর। সঠিক উত্তরটি দেখে নিন:</span> <span class="font-normal font-sans text-xs block mt-0.5" style="color: var(--ink-secondary);">${escapeHtml(q.explanation)}</span>`;
      }
    }
  },

  recordWordRevision: function(targetWord, isCorrect) {
    try {
      const list = getMyVocabList();
      const today = getTodayDateString();
      const item = list.find(w => w && (w.id === targetWord.id || String(w.word).toLowerCase() === String(targetWord.word).toLowerCase()));
      if (item) {
        item.revisionCount = (item.revisionCount || 0) + 1;
        item.lastRevisedDate = today;
        saveMyVocabList(list);
      }
    } catch (e) {
      console.error('Error recording word revision:', e);
    }
  },

  nextQuestion: function() {
    if (this.state.currentIdx + 1 < this.state.questions.length) {
      this.state.currentIdx += 1;
      this.renderQuestion();
    } else {
      this.finish();
    }
  },

  finish: function() {
    this.state.isExamComplete = true;
    const today = getTodayDateString();

    // Mark today's warmup as completed
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_WARMUP_DATE, today);
    } catch (e) {}

    const body = document.getElementById('vw-warmup-body');
    if (!body) return;

    const total = this.state.questions.length;
    const score = this.state.score;
    const pct = Math.round((score / total) * 100);

    body.innerHTML = `
      <div class="text-center space-y-5 py-4">
        <div class="w-16 h-16 mx-auto rounded-3xl flex items-center justify-center text-3xl shadow-sm" style="background-color: var(--accent-sage-soft); color: var(--accent-sage);">
          🎉
        </div>

        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border" style="background-color: var(--accent-sage-soft); border-color: rgba(45, 90, 76, 0.25); color: var(--accent-sage);">
            REVISION COMPLETE &bull; দৈনিক প্রস্তুতি সম্পন্ন!
          </span>
          <h2 class="font-editorial text-2xl sm:text-3xl font-bold mt-2" style="color: var(--ink-primary);">
            ${score}/${total} Revised! Ready for Today&rsquo;s Words
          </h2>
          <p class="font-bengali text-xs sm:text-sm max-w-md mx-auto mt-1 leading-relaxed" style="color: var(--ink-secondary);">
            অসাধারণ! আপনি পূর্ববর্তী পড়া শব্দগুলো চমৎকারভাবে রিভিশন করেছেন (${pct}% সঠিক)। আজকের নতুন শব্দগুলো শেখার জন্য আপনি এখন সম্পূর্ণ প্রস্তুত!
          </p>
        </div>

        <div class="rounded-2xl p-4 border max-w-sm mx-auto flex items-center justify-around" style="background-color: var(--bg-ivory); border-color: var(--border-subtle);">
          <div>
            <span class="text-xs font-semibold block" style="color: var(--ink-secondary);">Total Questions</span>
            <strong class="font-editorial text-2xl font-bold" style="color: var(--ink-primary);">${total}</strong>
          </div>
          <div class="h-8 w-px" style="background-color: var(--border-subtle);"></div>
          <div>
            <span class="text-xs font-semibold block" style="color: var(--ink-secondary);">Correct Answers</span>
            <strong class="font-editorial text-2xl font-bold" style="color: var(--accent-sage);">${score}</strong>
          </div>
          <div class="h-8 w-px" style="background-color: var(--border-subtle);"></div>
          <div>
            <span class="text-xs font-semibold block" style="color: var(--ink-secondary);">Score</span>
            <strong class="font-editorial text-2xl font-bold" style="color: var(--accent-terracotta);">${pct}%</strong>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onclick="WarmupExam.close()"
            class="vw-btn-primary font-bengali w-full sm:w-auto px-7 py-3 rounded-2xl text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>আজকের নতুন শব্দ শিখুন (Start Learning) →</span>
          </button>
          <button
            type="button"
            onclick="WarmupExam.open(true)"
            class="font-bengali w-full sm:w-auto px-5 py-3 rounded-2xl border text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 hover:border-[#2D5A4C] cursor-pointer"
            style="background-color: var(--surface-sand); border-color: var(--border-subtle); color: var(--ink-primary);"
          >
            <span>পুনরায় অনুশীলন করুন (Practice Again) ⚡</span>
          </button>
        </div>
      </div>
    `;
  }
};

// Global window registrations for My Vocab & WarmupExam
if (typeof window !== 'undefined') {
  window.getTodayDateString = getTodayDateString;
  window.getYesterdayDateString = getYesterdayDateString;
  window.formatVocabDateDisplay = formatVocabDateDisplay;
  window.findWordAnywhere = findWordAnywhere;
  window.getMyVocabList = getMyVocabList;
  window.saveMyVocabList = saveMyVocabList;
  window.isInMyVocabList = isInMyVocabList;
  window.addToMyVocabList = addToMyVocabList;
  window.removeFromMyVocabList = removeFromMyVocabList;
  window.toggleMyVocabWord = toggleMyVocabWord;
  window.renderMyVocabCardButtonHTML = renderMyVocabCardButtonHTML;
  window.updateMyVocabCardButton = updateMyVocabCardButton;
  window.updateMyVocabPillCounters = updateMyVocabPillCounters;
  window.renderMyVocabListMarkup = renderMyVocabListMarkup;
  window.groupMyVocabByDate = groupMyVocabByDate;
  window.WarmupExam = WarmupExam;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    STORAGE_KEYS,
    AppState,
    getTodayDateString,
    getYesterdayDateString,
    formatVocabDateDisplay,
    findWordAnywhere,
    getMyVocabList,
    saveMyVocabList,
    isInMyVocabList,
    addToMyVocabList,
    removeFromMyVocabList,
    toggleMyVocabWord,
    renderMyVocabCardButtonHTML,
    updateMyVocabCardButton,
    updateMyVocabPillCounters,
    renderMyVocabListMarkup,
    groupMyVocabByDate,
    WarmupExam,
    trackWordExplored,
    openAITutorModal,
    closeAITutorModal,
    toggleAITutorModal,
    askAITutorAboutWord,
    sendQuickAITutorPrompt,
    clearAITutorChat,
    submitAITutorMessage,
    ensureAITutorWidget,
    generateLocalAITutorResponse,
    getAITutorIconSvg
  };
}


/* =====================================================================
   10. PROGRESSIVE WEB APP (PWA) & SERVICE WORKER ENGINE (ANDROID HARDENED)
====================================================================== */

let deferredPWAInstallPrompt = null;

function isPWAInstalled() {
  if (typeof window === 'undefined') return false;
  const isStandalone = Boolean(
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    (window.navigator && window.navigator.standalone === true)
  );
  const isMarkedInstalled = (typeof localStorage !== 'undefined') && localStorage.getItem('vw_app_installed') === 'true';
  return isStandalone || isMarkedInstalled;
}

function registerServiceWorker() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  // Cleanly ignore file:// protocol without any console errors
  if (window.location.protocol === 'file:') return;
  const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (!isSecure) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => {
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[PWA] New version of Vocabulary World is available.');
              }
            });
          }
        });
      })
      .catch((err) => {
        console.warn('[PWA] Service Worker registration failed:', err);
      });
  });
}

function ensurePWAInstallBanner() {
  if (typeof document === 'undefined') return;
  if (isPWAInstalled()) {
    const existing = document.getElementById('vw-mobile-install-banner');
    if (existing) existing.remove();
    return;
  }
  if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('vw_install_banner_dismissed') === 'true') {
    return;
  }
  let banner = document.getElementById('vw-mobile-install-banner');
  if (!banner) {
    banner = document.createElement('aside');
    banner.id = 'vw-mobile-install-banner';
    banner.className = 'vw-mobile-install-banner md:hidden';
    banner.style.zIndex = '9990';
    banner.style.pointerEvents = 'auto';
    banner.setAttribute('role', 'complementary');
    banner.setAttribute('aria-label', 'Install Vocabulary World App');
    banner.innerHTML = `
      <div class="vw-install-banner-pill" style="pointer-events: auto;">
        <div class="flex items-center gap-2 min-w-0">
          <span class="text-base shrink-0">📲</span>
          <span class="text-xs font-bold truncate">Install App &bull; Practice offline on Android</span>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            id="vw-banner-install-btn"
            onclick="triggerPWAInstall()"
            class="vw-install-now-btn"
            aria-label="Install App Now"
          >
            Install Now
          </button>
          <button
            type="button"
            id="vw-banner-dismiss-btn"
            onclick="dismissPWAInstallBanner()"
            class="vw-install-dismiss-btn"
            aria-label="Dismiss banner"
            title="Dismiss"
          >
            &times;
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    // Direct event listener attachment to eliminate any dead clicks
    const installBtn = typeof banner.querySelector === 'function' ? banner.querySelector('#vw-banner-install-btn') : null;
    if (installBtn) {
      installBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        triggerPWAInstall();
      });
    }

    const dismissBtn = typeof banner.querySelector === 'function' ? banner.querySelector('#vw-banner-dismiss-btn') : null;
    if (dismissBtn) {
      dismissBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dismissPWAInstallBanner();
      });
    }
  } else {
    banner.classList.remove('hidden', 'opacity-0', 'translate-y-4');
    banner.style.display = 'block';
  }
}

function dismissPWAInstallBanner() {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem('vw_install_banner_dismissed', 'true');
  }
  const banner = document.getElementById('vw-mobile-install-banner');
  if (banner) {
    banner.classList.add('opacity-0', 'translate-y-4');
    setTimeout(() => {
      try { banner.remove(); } catch (e) {}
    }, 250);
  }
}

function showAllPWAInstallUI() {
  if (isPWAInstalled()) return;
  if (typeof document === 'undefined') return;

  const btns = document.querySelectorAll('.vw-pwa-install-btn, #vw-pwa-install-btn');
  btns.forEach((btn) => {
    btn.classList.remove('hidden');
    btn.classList.add('inline-flex');
  });

  const dotsIndicator = document.getElementById('vw-mobile-dots-indicator');
  if (dotsIndicator) dotsIndicator.classList.remove('hidden');

  const installPill = document.getElementById('vw-dots-install-pill');
  if (installPill) installPill.classList.remove('hidden');

  ensurePWAInstallBanner();
}

function hideAllPWAInstallUI() {
  if (typeof document === 'undefined') return;

  const btns = document.querySelectorAll('.vw-pwa-install-btn, #vw-pwa-install-btn');
  btns.forEach((btn) => {
    btn.classList.add('hidden');
    btn.classList.remove('inline-flex');
  });

  const dotsIndicator = document.getElementById('vw-mobile-dots-indicator');
  if (dotsIndicator) dotsIndicator.classList.add('hidden');

  const installPill = document.getElementById('vw-dots-install-pill');
  if (installPill) installPill.classList.add('hidden');

  const banner = document.getElementById('vw-mobile-install-banner');
  if (banner) banner.remove();
}

function showPWAInstallButtons() {
  showAllPWAInstallUI();
}

function hidePWAInstallButtons() {
  hideAllPWAInstallUI();
}

function copyPageLinkForChrome() {
  const url = (typeof window !== 'undefined' && window.location.href)
    ? window.location.href
    : 'https://nusratjahanemu.github.io/Vocabulary-World/';

  function onCopySuccess() {
    const copyBtn = document.getElementById('vw-android-copy-link-btn');
    if (copyBtn) {
      const origHtml = copyBtn.innerHTML;
      copyBtn.innerHTML = '<span>✓</span><span>Link Copied! (লিংক কপি হয়েছে)</span>';
      copyBtn.style.borderColor = 'var(--accent-sage)';
      setTimeout(() => {
        if (copyBtn) {
          copyBtn.innerHTML = origHtml;
          copyBtn.style.borderColor = '';
        }
      }, 2500);
    }
    if (typeof showToast === 'function') {
      showToast('✓ লিংক কপি করা হয়েছে! Chrome ব্রাউজারে পেস্ট করুন', 'success');
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    navigator.clipboard.writeText(url)
      .then(onCopySuccess)
      .catch(() => fallbackCopy(url));
  } else {
    fallbackCopy(url);
  }

  function fallbackCopy(text) {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.top = '-9999px';
      textArea.style.left = '-9999px';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (success) {
        onCopySuccess();
      } else {
        if (typeof showToast === 'function') {
          showToast('লিংক: ' + text, 'info');
        }
      }
    } catch (e) {
      if (typeof showToast === 'function') {
        showToast('লিংক: ' + text, 'info');
      }
    }
  }
}

function showAndroidInstallGuide() {
  if (typeof document === 'undefined') return;
  let modal = document.getElementById('vw-android-install-guide-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'vw-android-install-guide-modal';
    modal.className = 'vw-android-guide-overlay fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs vw-view-enter';
    modal.style.zIndex = '9999';
    modal.style.pointerEvents = 'auto';
    modal.innerHTML = `
      <div class="vw-modal-backdrop-tap fixed inset-0" style="z-index: 1;"></div>
      <div
        class="vw-modal-card relative w-full max-w-sm rounded-3xl border p-6 shadow-2xl vw-view-enter"
        style="background-color: var(--surface-white); border-color: var(--border-subtle); z-index: 2; pointer-events: auto;"
      >
        <button
          type="button"
          id="vw-android-modal-close-x"
          onclick="closeAndroidInstallGuide()"
          class="absolute top-4 right-4 w-8 h-8 rounded-full border flex items-center justify-center text-gray-500 hover:border-[#2D5A4C] cursor-pointer"
          style="border-color: var(--border-subtle); z-index: 3;"
          aria-label="Close"
        >
          &times;
        </button>

        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-2xl flex items-center justify-center text-xl text-white shadow-xs" style="background-color: var(--accent-sage);">
            📲
          </div>
          <div>
            <h3 class="font-editorial text-base font-bold" style="color: var(--ink-primary);">
              Install on Android
            </h3>
            <p class="font-bengali text-xs" style="color: var(--ink-muted);">
              অ্যান্ড্রয়েডে ইনস্টল করার নিয়ম
            </p>
          </div>
        </div>

        <div class="space-y-3 py-2 text-xs font-medium" style="color: var(--ink-secondary);">
          <div class="flex items-start gap-3 p-2.5 rounded-2xl" style="background-color: var(--surface-sand);">
            <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style="background-color: var(--accent-sage);">1</span>
            <div class="flex-1">
              <span class="font-bold block" style="color: var(--ink-primary);">Tap Chrome Menu (&vellip;)</span>
              <span class="font-bengali text-[11px] text-gray-500">ব্রাউজারের উপরে ডানে ৩-ডট (&vellip;) মেন্যুতে চাপুন</span>
            </div>
          </div>

          <div class="flex items-start gap-3 p-2.5 rounded-2xl" style="background-color: var(--surface-sand);">
            <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style="background-color: var(--accent-sage);">2</span>
            <div class="flex-1">
              <span class="font-bold block" style="color: var(--ink-primary);">Select "Install app"</span>
              <span class="font-bengali text-[11px] text-gray-500">মেন্যু থেকে "Install app" অথবা "Add to Home screen" নির্বাচন করুন</span>
            </div>
          </div>
        </div>

        <!-- Working Copy Link for Chrome button -->
        <button
          type="button"
          id="vw-android-copy-link-btn"
          onclick="copyPageLinkForChrome()"
          class="w-full py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all mt-3 cursor-pointer hover:border-[#2D5A4C]"
          style="background-color: var(--surface-sand); border-color: var(--border-subtle); color: var(--ink-primary);"
        >
          <span>📋</span>
          <span>Copy Link for Chrome (লিংক কপি করুন)</span>
        </button>

        <button
          type="button"
          id="vw-android-modal-gotit-btn"
          onclick="closeAndroidInstallGuide()"
          class="vw-btn-primary w-full py-2.5 rounded-xl text-xs font-bold mt-2 cursor-pointer"
        >
          Got it &bull; বুঝতে পেরেছি
        </button>
      </div>
    `;
    document.body.appendChild(modal);

    // Direct event listeners to guarantee 100% responsiveness without dead clicks
    const closeXBtn = modal.querySelector('#vw-android-modal-close-x');
    if (closeXBtn) {
      closeXBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeAndroidInstallGuide();
      });
    }

    const gotItBtn = modal.querySelector('#vw-android-modal-gotit-btn');
    if (gotItBtn) {
      gotItBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeAndroidInstallGuide();
      });
    }

    const copyBtn = modal.querySelector('#vw-android-copy-link-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        copyPageLinkForChrome();
      });
    }

    // Modal backdrop click closes modal
    modal.addEventListener('click', (e) => {
      if (e.target === modal || (e.target && e.target.classList.contains('vw-modal-backdrop-tap'))) {
        e.preventDefault();
        e.stopPropagation();
        closeAndroidInstallGuide();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const m = document.getElementById('vw-android-install-guide-modal');
        if (m && !m.classList.contains('hidden') && m.style.display !== 'none') {
          closeAndroidInstallGuide();
        }
      }
    });
  } else {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  }
}

function closeAndroidInstallGuide() {
  if (typeof document === 'undefined') return;
  const modal = document.getElementById('vw-android-install-guide-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
  }
}

async function triggerPWAInstall() {
  const promptEvent = (typeof window !== 'undefined' && (window.__deferredInstallPrompt || window.__deferredPWAInstallPrompt)) || deferredPWAInstallPrompt;

  if (promptEvent && typeof promptEvent.prompt === 'function') {
    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice && choice.outcome === 'accepted') {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('vw_app_installed', 'true');
        }
        hideAllPWAInstallUI();
        closeAndroidInstallGuide();
        if (typeof showToast === 'function') {
          showToast('✓ Vocabulary World installed! অ্যাপটি ইনস্টল করা হয়েছে!', 'success');
        }
      }
    } catch (e) {
      console.warn('[PWA] Error in prompt choice:', e);
    }
    deferredPWAInstallPrompt = null;
    if (typeof window !== 'undefined') {
      window.__deferredInstallPrompt = null;
      window.__deferredPWAInstallPrompt = null;
    }
  } else {
    showAndroidInstallGuide();
  }
}

function initPWAInstallEngine() {
  if (typeof window === 'undefined') return;

  // Check if beforeinstallprompt already fired in <head>
  if (window.__deferredInstallPrompt) {
    deferredPWAInstallPrompt = window.__deferredInstallPrompt;
    showAllPWAInstallUI();
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPWAInstallPrompt = e;
    window.__deferredInstallPrompt = e;
    window.__deferredPWAInstallPrompt = e;
    showAllPWAInstallUI();
  });

  window.addEventListener('appinstalled', () => {
    deferredPWAInstallPrompt = null;
    window.__deferredInstallPrompt = null;
    window.__deferredPWAInstallPrompt = null;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('vw_app_installed', 'true');
    }
    hideAllPWAInstallUI();
    closeAndroidInstallGuide();
    if (typeof showToast === 'function') {
      showToast('✓ Vocabulary World installed! অ্যাপটি ইনস্টল করা হয়েছে!', 'success');
    }
  });

  // Listen to standalone media query changes
  if (window.matchMedia) {
    try {
      const standaloneMQ = window.matchMedia('(display-mode: standalone)');
      if (standaloneMQ.addEventListener) {
        standaloneMQ.addEventListener('change', (e) => {
          if (e.matches) {
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem('vw_app_installed', 'true');
            }
            hideAllPWAInstallUI();
            closeAndroidInstallGuide();
          }
        });
      }
    } catch (err) {}
  }

  if (isPWAInstalled()) {
    hideAllPWAInstallUI();
  } else {
    ensurePWAInstallBanner();
  }
}

if (typeof window !== 'undefined') {
  window.registerServiceWorker = registerServiceWorker;
  window.initPWAInstallEngine = initPWAInstallEngine;
  window.triggerPWAInstall = triggerPWAInstall;
  window.showPWAInstallButtons = showPWAInstallButtons;
  window.hidePWAInstallButtons = hidePWAInstallButtons;
  window.showAllPWAInstallUI = showAllPWAInstallUI;
  window.hideAllPWAInstallUI = hideAllPWAInstallUI;
  window.isPWAInstalled = isPWAInstalled;
  window.ensurePWAInstallBanner = ensurePWAInstallBanner;
  window.dismissPWAInstallBanner = dismissPWAInstallBanner;
  window.showAndroidInstallGuide = showAndroidInstallGuide;
  window.closeAndroidInstallGuide = closeAndroidInstallGuide;
  window.copyPageLinkForChrome = copyPageLinkForChrome;
  window.toggleMobileDotsMenu = toggleMobileDotsMenu;
  window.cycleNextAccent = cycleNextAccent;
  window.openMyVocabList = openMyVocabList;
}

if (typeof module !== 'undefined' && module.exports) {
  Object.assign(module.exports, {
    isPWAInstalled,
    showAllPWAInstallUI,
    hideAllPWAInstallUI,
    showPWAInstallButtons,
    hidePWAInstallButtons,
    dismissPWAInstallBanner,
    ensurePWAInstallBanner,
    triggerPWAInstall,
    showAndroidInstallGuide,
    closeAndroidInstallGuide,
    copyPageLinkForChrome,
    toggleMobileDotsMenu,
    cycleNextAccent,
    openMyVocabList,
    renderAppHeader
  });
}

/* =====================================================================
   AUTO-INITIALIZATION HOOK
====================================================================== */
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    PronunciationEngine.init();
    loadPersistedState();
    WordImageLoader.init();
    ensureToastElement();
    ensureFeedbackWidget();
    ensureAITutorWidget();
    updateTrackerDisplay();
    updateMyVocabPillCounters();
    registerServiceWorker();
    initPWAInstallEngine();
  });
}
