/* =====================================================================
   VOCABULARY WORLD — SHARED CORE SYSTEM (js/common.js)
   - State & LocalStorage Management
   - Hybrid English TTS Pronunciation Engine
   - Safe Text Registry & SVG Helpers
   - Shared Navigation Bar & Footer
====================================================================== */

/* =====================================================================
   DARK SKY / LIGHT SKY THEME ZERO-FLASH INITIALIZER (Default: Dark Sky)
====================================================================== */
(function () {
  if (typeof window === 'undefined' || !document.documentElement) return;
  try {
    const theme = localStorage.getItem('vw_theme');
    // Dark Sky Mode is strictly DEFAULT
    if (theme === 'light') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch (e) {}
})();

/* =====================================================================
   AUTOMATIC PURGE OF DUMMY / MOCK PROFILES FROM LOCALSTORAGE
====================================================================== */
(function cleanupMockUserProfiles() {
  if (typeof window === 'undefined') return;
  try {
    const keys = ['vw_persistent_user_profile', 'vw_user_profile'];
    for (const key of keys) {
      const raw = localStorage.getItem(key);
      if (raw) {
        const p = JSON.parse(raw);
        if (p && (
          p.displayName === 'Google Learner' ||
          p.name === 'Google Learner' ||
          p.email === 'learner@vocabularyworld.com' ||
          (typeof p.email === 'string' && (p.email.endsWith('@vocabularyworld.com') || p.email.endsWith('@learner.vocabularyworld.com')))
        )) {
          localStorage.removeItem(key);
        }
      }
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
  AI_TUTOR_API_KEY: 'vw_ai_tutor_api_key',
  DAILY_GOAL_TARGET: 'vw_daily_goal_target',
  DAILY_LEARNED_WORDS: 'vw_daily_learned_words',
  USER_STREAK: 'vw_user_streak',
  STREAK_LAST_COMPLETED_DATE: 'vw_streak_last_completed_date',
  STREAK_LAST_ACTIVE_DATE: 'vw_streak_last_active_date'
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
  if (typeof recordWordLearnedToday === 'function') {
    try { recordWordLearnedToday(wordId); } catch (e) {}
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
    btn.title = newTheme === 'dark' ? 'Switch to Light Sky Mode • লাইট স্কাই মোড' : 'Switch to Dark Sky Mode • ডার্ক স্কাই মোড';
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
    dotsThemeLabel.textContent = newTheme === 'dark' ? 'Dark Sky 🌙' : 'Light Sky ☀️';
  }

  if (typeof showToast === 'function') {
    showToast(newTheme === 'dark' ? '🌙 Dark Sky Mode সক্রিয় করা হয়েছে' : '☀️ Light Sky Mode সক্রিয় করা হয়েছে');
  }
}

/* =====================================================================
   STUDY READER STYLE SMART FEATURES:
   1. Personal Note & Memory Trick Manager (Click-to-Reveal)
   2. YouTube Pronunciation & Usage Video Launcher
====================================================================== */
const PERSONAL_NOTES_STORAGE_KEY = 'vw_personal_notes';

function getAllPersonalNotes() {
  try {
    const raw = localStorage.getItem(PERSONAL_NOTES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function getPersonalNote(wordId) {
  if (!wordId) return '';
  const notes = getAllPersonalNotes();
  return notes[wordId] || '';
}

function hasPersonalNote(wordId) {
  const note = getPersonalNote(wordId);
  return typeof note === 'string' && note.trim().length > 0;
}

function savePersonalNote(wordId, noteText) {
  if (!wordId) return;
  const notes = getAllPersonalNotes();
  if (noteText === undefined) {
    const input = document.getElementById(`note-input-${wordId}`);
    if (input) noteText = input.value;
  }
  const clean = (noteText || '').trim();
  if (clean) {
    notes[wordId] = clean;
  } else {
    delete notes[wordId];
  }
  try {
    localStorage.setItem(PERSONAL_NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {}

  const statusEl = document.getElementById(`note-status-${wordId}`);
  if (statusEl) {
    statusEl.textContent = clean ? '✓ নোট সফলভাবে সংরক্ষিত হয়েছে!' : 'নোট মুছে ফেলা হয়েছে';
    statusEl.style.color = '#38BDF8';
    setTimeout(() => {
      if (statusEl) {
        statusEl.textContent = clean ? '✓ নোট সংরক্ষিত আছে' : 'নোট লিখে সংরক্ষণ করুন';
      }
    }, 2000);
  }

  const btn = document.getElementById(`note-btn-${wordId}`);
  if (btn) {
    if (clean) {
      btn.classList.add('has-note');
      if (!btn.querySelector('.animate-pulse')) {
        const dot = document.createElement('span');
        dot.className = 'w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse';
        btn.appendChild(dot);
      }
    } else {
      btn.classList.remove('has-note');
      const dot = btn.querySelector('.animate-pulse');
      if (dot) dot.remove();
    }
  }

  if (typeof showToast === 'function') {
    showToast(clean ? 'নোট সংরক্ষিত হয়েছে! (Personal note saved)' : 'নোট মুছে ফেলা হয়েছে');
  }
}

function handlePersonalNoteInput(wordId, value) {
  const notes = getAllPersonalNotes();
  const clean = (value || '').trim();
  if (clean) {
    notes[wordId] = clean;
  } else {
    delete notes[wordId];
  }
  try {
    localStorage.setItem(PERSONAL_NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {}
}

function togglePersonalNote(wordId) {
  if (!wordId) return;
  const panel = document.getElementById(`note-panel-${wordId}`);
  if (!panel) return;
  const isHidden = panel.classList.contains('hidden');
  if (isHidden) {
    panel.classList.remove('hidden');
    const input = document.getElementById(`note-input-${wordId}`);
    if (input) input.focus();
  } else {
    panel.classList.add('hidden');
  }
}

function openWordUsageVideo(word) {
  if (!word) return;
  const cleanWord = String(word).trim();
  const query = `${cleanWord} pronunciation and usage in English sentence`;
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function renderPersonalNotePanelHTML(item) {
  if (!item || !item.id) return '';
  const note = getPersonalNote(item.id);
  return `
    <div
      id="note-panel-${item.id}"
      class="vw-personal-note-panel hidden rounded-2xl p-3.5 sm:p-4 border space-y-2 mt-2.5 transition-all"
      style="background-color: var(--surface-sand); border-color: rgba(56, 189, 248, 0.35);"
    >
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-1.5">
          <span class="text-sm">💡</span>
          <span class="text-[11px] font-bold uppercase tracking-wider font-bengali" style="color: var(--accent-sage);">
            মনে রাখার কৌশল / ব্যক্তিগত নোট (Personal Trick &amp; Note)
          </span>
        </div>
        <span class="text-[10px] opacity-75 font-mono" style="color: var(--ink-muted);">Auto-saved locally</span>
      </div>

      <textarea
        id="note-input-${item.id}"
        rows="2"
        placeholder="Write your personal memory hook, funny mnemonic, or sentence trick for &quot;${escapeHtml(item.word)}&quot;..."
        class="vw-personal-note-textarea w-full px-3 py-2 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#38BDF8] transition-all resize-none"
        style="background-color: var(--surface-white); border: 1px solid var(--border-subtle); color: var(--ink-primary);"
        oninput="handlePersonalNoteInput('${item.id}', this.value)"
      >${escapeHtml(note)}</textarea>

      <div class="flex items-center justify-between gap-2 pt-1">
        <span id="note-status-${item.id}" class="text-[11px] font-bengali font-semibold" style="color: #38BDF8;">
          ${note ? '✓ নোট সংরক্ষিত আছে' : 'নোট লিখে সংরক্ষণ করুন'}
        </span>
        <div class="flex items-center gap-2">
          <button
            type="button"
            onclick="savePersonalNote('${item.id}')"
            class="vw-btn-sky-save px-3 py-1 rounded-xl text-xs font-bold text-white shadow-xs"
            style="background-color: #0284C7; border: 1.5px solid #38BDF8;"
          >
            💾 Save
          </button>
          <button
            type="button"
            onclick="togglePersonalNote('${item.id}')"
            class="px-2.5 py-1 rounded-xl text-xs font-semibold"
            style="color: var(--ink-muted);"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  `;
}

if (typeof window !== 'undefined') {
  window.handleGoogleSignIn = handleGoogleSignIn;
  window.handleAuthSubmit = handleAuthSubmit;
  window.handleSignOut = handleSignOut;
  window.openGmailAuthFormDirectly = openGmailAuthFormDirectly;
  window.getAllPersonalNotes = getAllPersonalNotes;
  window.getPersonalNote = getPersonalNote;
  window.hasPersonalNote = hasPersonalNote;
  window.savePersonalNote = savePersonalNote;
  window.handlePersonalNoteInput = handlePersonalNoteInput;
  window.togglePersonalNote = togglePersonalNote;
  window.openWordUsageVideo = openWordUsageVideo;
  window.renderPersonalNotePanelHTML = renderPersonalNotePanelHTML;
  window.toggleTheme = toggleTheme;
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

/* =====================================================================
   FIREBASE AUTHENTICATION & ZERO-FLICKER PERSISTENT SESSION ENGINE
   - browserLocalPersistence enforced
   - Dedicated vw_persistent_user_profile localStorage snapshot
   - Seamless background auth token refresh
   - Zero-flicker UI restore on every page load
   - Strict signOut() protection (only on explicit user click)
   - Zero tampering with IndexedDB (firebaseLocalStorageDb)
====================================================================== */

var browserLocalPersistence = 'LOCAL';
let _firebaseAuthInstance = null;
let _authListeners = [];

/**
 * Configure Firebase Authentication persistence
 * Explicitly configures Firebase Auth to use browserLocalPersistence
 * before initializing sign-in or listening to onAuthStateChanged.
 */
async function setPersistence(authInstance, persistence = browserLocalPersistence) {
  _firebaseAuthInstance = authInstance || _firebaseAuthInstance;
  if (_firebaseAuthInstance) {
    _firebaseAuthInstance.persistence = persistence;
    if (typeof _firebaseAuthInstance.setPersistence === 'function') {
      try {
        await _firebaseAuthInstance.setPersistence(persistence);
      } catch (e) {
        console.warn('[FirebaseAuth] setPersistence notice:', e);
      }
    }
  }
  return Promise.resolve();
}

/**
 * Listen to auth state changes with instant local profile snapshot
 */
function onAuthStateChanged(authInstance, nextOrObserver, error, completed) {
  _firebaseAuthInstance = authInstance || _firebaseAuthInstance;
  const callback = typeof nextOrObserver === 'function' ? nextOrObserver : (nextOrObserver && nextOrObserver.next);

  if (callback && !_authListeners.includes(callback)) {
    _authListeners.push(callback);
  }

  // Instant zero-flicker callback if persistent profile exists
  const existingProfile = getStoredUserProfile();
  if (existingProfile && callback) {
    try {
      callback({
        uid: existingProfile.uid || 'persisted-uid',
        displayName: existingProfile.displayName || existingProfile.name || 'Learner',
        email: existingProfile.email || '',
        photoURL: existingProfile.photoURL || '',
        isAnonymous: false
      });
    } catch (e) {}
  }

  // Hook into real Firebase Auth if loaded in browser
  if (typeof window !== 'undefined' && window.firebase && window.firebase.auth) {
    try {
      const realAuth = window.firebase.auth();
      return realAuth.onAuthStateChanged((user) => {
        if (user) {
          const snapshot = {
            uid: user.uid,
            displayName: user.displayName || user.name || 'Learner',
            name: user.displayName || user.name || 'Learner',
            email: user.email || '',
            photoURL: user.photoURL || '',
            lastLogin: Date.now(),
            initial: (user.displayName || user.name || 'L').charAt(0).toUpperCase()
          };
          savePersistentUserProfile(snapshot);
          if (callback) callback(user);
        } else {
          // IMPORTANT: Do NOT clear vw_persistent_user_profile when auth state is null!
          // Profile is ONLY cleared when the user explicitly clicks "Sign Out / লগ আউট"
          if (callback && !existingProfile) callback(null);
        }
      }, error, completed);
    } catch (e) {
      console.warn('[FirebaseAuth] onAuthStateChanged hook:', e);
    }
  }

  return () => {
    _authListeners = _authListeners.filter(cb => cb !== callback);
  };
}

/**
 * Google Auth Provider definition
 */
class GoogleAuthProvider {
  constructor() {
    this.providerId = 'google.com';
    this.scopes = ['profile', 'email'];
  }
  addScope(scope) {
    if (!this.scopes.includes(scope)) this.scopes.push(scope);
    return this;
  }
}

/**
 * Sign in with Popup helper
 */
async function signInWithPopup(authInstance, provider) {
  _firebaseAuthInstance = authInstance || _firebaseAuthInstance;

  // Real Firebase Auth signInWithPopup
  if (typeof window !== 'undefined' && window.firebase && window.firebase.auth) {
    try {
      const googleProvider = new window.firebase.auth.GoogleAuthProvider();
      const result = await window.firebase.auth().signInWithPopup(googleProvider);
      if (result && result.user) {
        const user = result.user;
        const snapshot = {
          uid: user.uid,
          displayName: user.displayName || user.name || 'Learner',
          name: user.displayName || user.name || 'Learner',
          email: user.email || '',
          photoURL: user.photoURL || '',
          lastLogin: Date.now(),
          initial: (user.displayName || user.name || 'L').charAt(0).toUpperCase()
        };
        savePersistentUserProfile(snapshot);
        return result;
      }
    } catch (err) {
      console.warn('[FirebaseAuth] Popup auth error:', err);
      throw err;
    }
  }

  throw new Error('Firebase Auth unavailable. Use Google Identity Services or Gmail direct sign-in.');
}

/**
 * Sign out helper (only called upon explicit user click)
 */
async function signOut(authInstance) {
  _firebaseAuthInstance = authInstance || _firebaseAuthInstance;
  if (typeof window !== 'undefined' && window.firebase && window.firebase.auth) {
    try {
      await window.firebase.auth().signOut();
    } catch (e) {}
  }
  clearPersistentUserProfile();
  return Promise.resolve();
}

/**
 * Save persistent profile snapshot into localStorage
 */
function savePersistentUserProfile(profile) {
  if (!profile) return;
  const snapshot = {
    uid: profile.uid || 'usr-' + Date.now(),
    displayName: profile.displayName || profile.name || 'Learner',
    name: profile.displayName || profile.name || 'Learner',
    email: profile.email || '',
    photoURL: profile.photoURL || '',
    lastLogin: profile.lastLogin || Date.now(),
    initial: (profile.displayName || profile.name || 'L').charAt(0).toUpperCase(),
    syncedWords: Array.isArray(profile.syncedWords) ? profile.syncedWords : (typeof getMyVocabList === 'function' ? getMyVocabList() : []),
    syncedStreak: profile.syncedStreak || (typeof AppState !== 'undefined' && AppState.tracker ? AppState.tracker.streak || 1 : 1)
  };

  try {
    localStorage.setItem('vw_persistent_user_profile', JSON.stringify(snapshot));
    localStorage.setItem('vw_user_profile', JSON.stringify(snapshot));
  } catch (e) {}

  if (typeof AppState !== 'undefined') {
    AppState.currentUser = snapshot;
  }
}

/**
 * Clear persistent profile snapshot (ONLY on explicit sign out click)
 */
function clearPersistentUserProfile() {
  try {
    localStorage.removeItem('vw_persistent_user_profile');
    localStorage.removeItem('vw_user_profile');
  } catch (e) {}
  if (typeof AppState !== 'undefined') {
    delete AppState.currentUser;
  }
}

/**
 * Get stored user profile from persistent key or legacy key
 */
function isDummyMockUser(p) {
  if (!p) return false;
  return (
    p.displayName === 'Google Learner' ||
    p.name === 'Google Learner' ||
    p.email === 'learner@vocabularyworld.com' ||
    (typeof p.email === 'string' && (p.email.endsWith('@vocabularyworld.com') || p.email.endsWith('@learner.vocabularyworld.com')))
  );
}

function getStoredUserProfile() {
  try {
    const rawPersistent = localStorage.getItem('vw_persistent_user_profile');
    if (rawPersistent) {
      const parsed = JSON.parse(rawPersistent);
      if (parsed && isDummyMockUser(parsed)) {
        localStorage.removeItem('vw_persistent_user_profile');
      } else if (parsed && (parsed.displayName || parsed.name)) {
        return parsed;
      }
    }
    const rawLegacy = localStorage.getItem('vw_user_profile');
    if (rawLegacy) {
      const parsed = JSON.parse(rawLegacy);
      if (parsed && isDummyMockUser(parsed)) {
        localStorage.removeItem('vw_user_profile');
      } else if (parsed && (parsed.displayName || parsed.name)) {
        return parsed;
      }
    }
  } catch (e) {}
  return null;
}

/**
 * Restore persistent session on page load (zero-flicker)
 */
function restorePersistentSession() {
  const profile = getStoredUserProfile();
  if (!profile) return null;

  // Restore user in AppState
  if (typeof AppState !== 'undefined') {
    AppState.currentUser = profile;
    if (profile.syncedWords && Array.isArray(profile.syncedWords)) {
      try {
        const localList = (typeof getMyVocabList === 'function') ? getMyVocabList() : [];
        const merged = Array.from(new Set([...localList, ...profile.syncedWords]));
        if (typeof saveMyVocabList === 'function') saveMyVocabList(merged);
      } catch (e) {}
    }
    if (profile.syncedStreak && AppState.tracker) {
      AppState.tracker.streak = profile.syncedStreak;
    }
  }

  // Restore UI elements immediately
  const activePage = (typeof window !== 'undefined' && window.location.pathname.split('/').pop().replace('.html', '')) || 'home';
  if (typeof renderAppHeader === 'function') {
    renderAppHeader(activePage);
  }
  if (typeof updateMyVocabPillCounters === 'function') {
    updateMyVocabPillCounters();
  }

  return profile;
}

/**
 * High-level Firebase Auth Engine
 */
const FirebaseAuthEngine = {
  auth: null,
  init: async function() {
    // 1. Immediately restore persistent profile snapshot (zero-flicker)
    restorePersistentSession();

    // 2. Setup Firebase Auth persistence and listeners
    try {
      if (typeof window !== 'undefined' && window.firebase && window.firebase.auth) {
        this.auth = window.firebase.auth();
        _firebaseAuthInstance = this.auth;
        await setPersistence(this.auth, browserLocalPersistence);
        onAuthStateChanged(this.auth, (user) => {
          if (user) {
            const snapshot = {
              uid: user.uid,
              displayName: user.displayName || user.name || 'Learner',
              name: user.displayName || user.name || 'Learner',
              email: user.email || '',
              photoURL: user.photoURL || '',
              lastLogin: Date.now(),
              initial: (user.displayName || user.name || 'L').charAt(0).toUpperCase()
            };
            savePersistentUserProfile(snapshot);
            const activePage = window.location.pathname.split('/').pop().replace('.html', '') || 'home';
            renderAppHeader(activePage);
          }
        });
      } else {
        // Standalone auth instance with browserLocalPersistence
        this.auth = {
          name: '[DEFAULT]',
          persistence: browserLocalPersistence,
          currentUser: getStoredUserProfile()
        };
        _firebaseAuthInstance = this.auth;
        await setPersistence(this.auth, browserLocalPersistence);
      }
    } catch (e) {
      console.warn('[FirebaseAuthEngine] Init notice:', e);
    }
  },
  getStoredProfile: getStoredUserProfile,
  signInWithGoogle: async function() {
    return handleGoogleSignIn();
  },
  signOut: async function() {
    return handleSignOut();
  },
  restoreSession: restorePersistentSession
};

/* =====================================================================
   GOOGLE IDENTITY SERVICES (GIS) & REAL GMAIL AUTHENTICATION
====================================================================== */
function loadGoogleIdentityServices() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.google && window.google.accounts && window.google.accounts.id) {
      return resolve(true);
    }
    const existing = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
    if (existing) {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        return resolve(true);
      }
      existing.addEventListener('load', () => resolve(true), { once: true });
      existing.addEventListener('error', () => resolve(false), { once: true });
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
}

function parseJwtCredential(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.warn('[GIS] JWT credential decode error:', e);
    return null;
  }
}

function handleGoogleCredentialResponse(response) {
  if (!response || !response.credential) {
    if (typeof showToast === 'function') showToast('গুগল লগইন ক্রেডেনশিয়াল পাওয়া যায়নি');
    return;
  }
  const payload = parseJwtCredential(response.credential);
  if (!payload || !payload.email) {
    if (typeof showToast === 'function') showToast('গুগল অ্যাকাউন্ট থেকে ইমেইল রিড করা যায়নি');
    return;
  }

  const realName = payload.name || payload.given_name || payload.email.split('@')[0];
  const realUser = {
    uid: payload.sub || 'google-' + Date.now(),
    name: realName,
    displayName: realName,
    email: payload.email,
    photoURL: payload.picture || '',
    initial: realName.charAt(0).toUpperCase(),
    lastLogin: Date.now(),
    signedInAt: Date.now(),
    provider: 'google'
  };

  savePersistentUserProfile(realUser);
  closeAuthModal();

  const activePage = window.location.pathname.split('/').pop().replace('.html', '') || 'home';
  renderAppHeader(activePage);

  if (typeof showToast === 'function') {
    showToast(`স্বাগতম, ${realName}! আপনার Google অ্যাকাউন্ট (${payload.email}) দিয়ে সাইন ইন হয়েছে।`);
  }
}

async function handleGoogleSignIn() {
  const clientId = (typeof window !== 'undefined' && window.VW_GOOGLE_CLIENT_ID) || '';
  if (clientId) {
    if (typeof showToast === 'function') {
      showToast('গুগল অ্যাকাউন্ট অপশন লোড হচ্ছে...');
    }
    const loaded = await loadGoogleIdentityServices();
    if (loaded && window.google && window.google.accounts && window.google.accounts.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        });
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log('[GIS] Google popup prompt not displayed, opening Gmail modal form');
            openGmailAuthFormDirectly();
          }
        });
        return;
      } catch (e) {
        console.warn('[GIS] Initialization notice:', e);
      }
    }
  }

  // When VW_GOOGLE_CLIENT_ID is empty or popup dismissed:
  openGmailAuthFormDirectly();
}

function openGmailAuthFormDirectly() {
  openAuthModal();
  const nameInput = document.getElementById('auth-name-input');
  const emailInput = document.getElementById('auth-email-input');
  if (nameInput) setTimeout(() => nameInput.focus(), 80);
}

function handleAuthSubmit(event) {
  if (event) event.preventDefault();
  const nameInput = document.getElementById('auth-name-input');
  const emailInput = document.getElementById('auth-email-input');
  const name = nameInput ? nameInput.value.trim() : '';
  let email = emailInput ? emailInput.value.trim().toLowerCase() : '';

  if (!name) {
    if (typeof showToast === 'function') showToast('দয়া করে আপনার পূর্ণ নাম লিখুন');
    if (nameInput) nameInput.focus();
    return;
  }

  if (!email) {
    if (typeof showToast === 'function') showToast('দয়া করে আপনার আসল Gmail ঠিকানা লিখুন (যেমন: name@gmail.com)');
    if (emailInput) emailInput.focus();
    return;
  }

  // Auto-append @gmail.com if user only entered the username portion
  if (!email.includes('@')) {
    email = email + '@gmail.com';
    if (emailInput) emailInput.value = email;
  }

  // Validate Gmail domain
  if (!email.endsWith('@gmail.com')) {
    if (typeof showToast === 'function') {
      showToast('দয়া করে একটি সঠিক Gmail ঠিকানা লিখুন (e.g. yourname@gmail.com)');
    }
    if (emailInput) emailInput.focus();
    return;
  }

  const userProfile = {
    uid: 'gmail-' + Date.now(),
    name: name,
    displayName: name,
    email: email,
    photoURL: '',
    initial: name.charAt(0).toUpperCase(),
    lastLogin: Date.now(),
    signedInAt: Date.now(),
    provider: 'gmail'
  };

  savePersistentUserProfile(userProfile);
  closeAuthModal();

  const activePage = window.location.pathname.split('/').pop().replace('.html', '') || 'home';
  renderAppHeader(activePage);

  if (typeof showToast === 'function') {
    showToast(`স্বাগতম, ${name}! আপনার Gmail (${email}) দিয়ে সাইন ইন হয়েছে।`);
  }
}

function handleGuestAuth() {
  const guestUser = {
    uid: 'guest-' + Date.now(),
    name: 'Guest Learner',
    displayName: 'Guest Learner',
    email: '',
    photoURL: '',
    initial: 'G',
    lastLogin: Date.now(),
    signedInAt: Date.now(),
    provider: 'guest'
  };
  savePersistentUserProfile(guestUser);
  closeAuthModal();
  const activePage = window.location.pathname.split('/').pop().replace('.html', '') || 'home';
  renderAppHeader(activePage);
  if (typeof showToast === 'function') {
    showToast('অতিথি শিক্ষার্থী হিসেবে প্রবেশ সম্পন্ন হয়েছে!');
  }
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

function toggleUserMenu() {
  const dropdown = document.getElementById('vw-user-menu-dropdown');
  if (dropdown) dropdown.classList.toggle('hidden');
}

function handleSignOut() {
  clearPersistentUserProfile();

  try {
    if (typeof signOut === 'function') {
      signOut(_firebaseAuthInstance).catch(() => {});
    }
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
        title="Signed in as ${escapeHtml(userProfile.name)} (${escapeHtml(userProfile.email || '')})"
      >
        ${userProfile.photoURL ? `
          <img src="${escapeHtml(userProfile.photoURL)}" alt="${escapeHtml(userProfile.name)}" class="w-6 h-6 rounded-full object-cover shrink-0 shadow-xs border border-white/20" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';" />
          <span class="w-6 h-6 rounded-full hidden items-center justify-center text-[11px] font-bold text-white shrink-0 shadow-xs" style="background-color: var(--accent-sage);">
            ${escapeHtml(userProfile.initial || userProfile.name.charAt(0).toUpperCase())}
          </span>
        ` : `
          <span class="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 shadow-xs" style="background-color: var(--accent-sage);">
            ${escapeHtml(userProfile.initial || userProfile.name.charAt(0).toUpperCase())}
          </span>
        `}
        <span class="hidden sm:inline max-w-[100px] truncate text-xs font-semibold">${escapeHtml(userProfile.name)}</span>
        <span class="text-[8px] text-gray-400 ml-0.5">&blacktriangledown;</span>
      </button>

      <!-- User Profile Dropdown -->
      <div
        id="vw-user-menu-dropdown"
        class="hidden absolute right-0 mt-2 w-64 rounded-2xl border p-3 shadow-xl z-50 vw-panel-reveal"
        style="background-color: var(--surface-white); border-color: var(--border-subtle);"
      >
        <div class="flex items-center gap-2.5 pb-3 border-b" style="border-color: var(--border-subtle);">
          ${userProfile.photoURL ? `
            <img src="${escapeHtml(userProfile.photoURL)}" alt="${escapeHtml(userProfile.name)}" class="w-10 h-10 rounded-full object-cover shrink-0 shadow-xs border border-white/20" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';" />
            <span class="w-10 h-10 rounded-full hidden items-center justify-center text-sm font-bold text-white shrink-0 shadow-xs" style="background-color: var(--accent-sage);">
              ${escapeHtml(userProfile.initial || userProfile.name.charAt(0).toUpperCase())}
            </span>
          ` : `
            <span class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-xs" style="background-color: var(--accent-sage);">
              ${escapeHtml(userProfile.initial || userProfile.name.charAt(0).toUpperCase())}
            </span>
          `}
          <div class="min-w-0 flex-1">
            <p class="text-xs font-bold truncate" style="color: var(--ink-primary);">${escapeHtml(userProfile.name)}</p>
            <p class="text-[11px] truncate font-mono" style="color: var(--ink-muted);">${escapeHtml(userProfile.email || 'Signed in')}</p>
          </div>
        </div>

        <div class="py-2 space-y-1">
          <div class="flex items-center justify-between px-2 py-1 rounded-xl text-xs" style="color: var(--ink-secondary);">
            <span>Account</span>
            <span class="font-bold text-[10px] px-2 py-0.5 rounded-full" style="background-color: var(--accent-sage-soft); color: var(--accent-sage);">
              ${userProfile.email && userProfile.email.endsWith('@gmail.com') ? 'Verified Gmail' : 'Active Learner'}
            </span>
          </div>
          <a href="tracker.html" class="flex items-center justify-between px-2 py-1.5 rounded-xl text-xs font-bold transition-colors hover:bg-black/5 dark:hover:bg-white/5" style="color: var(--ink-primary);">
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
      title="Sign in with your Gmail to save progress"
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
          class="absolute top-5 right-5 w-8 h-8 rounded-full border flex items-center justify-center transition-colors hover:border-[#38BDF8]"
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
              Sign In with Gmail
            </h3>
            <p class="font-bengali text-xs mt-0.5" style="color: var(--ink-muted);">
              আপনার আসল নাম ও Gmail দিয়ে শব্দভান্ডারের অগ্রগতি সংরক্ষণ করুন
            </p>
          </div>
        </div>

        <!-- Primary 1-Tap Google Sign-In Button -->
        <button
          type="button"
          id="vw-google-signin-btn"
          onclick="handleGoogleSignIn()"
          class="w-full py-3 px-4 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all hover:shadow-md cursor-pointer mb-4"
          style="background-color: var(--surface-white); border-color: var(--border-subtle); color: var(--ink-primary);"
        >
          <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Continue with Google &bull; গুগল সাইন ইন</span>
        </button>

        <div class="relative flex py-1 items-center mb-4">
          <div class="flex-grow border-t" style="border-color: var(--border-subtle);"></div>
          <span class="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-wider font-bengali" style="color: var(--ink-muted);">অথবা আসল জিমেইল দিয়ে সাইন ইন</span>
          <div class="flex-grow border-t" style="border-color: var(--border-subtle);"></div>
        </div>

        <form id="vw-auth-form" onsubmit="handleAuthSubmit(event)" class="space-y-3.5">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider mb-1.5" style="color: var(--ink-secondary);">
              Full Name &bull; আপনার পূর্ণ নাম
            </label>
            <input
              id="auth-name-input"
              type="text"
              required
              placeholder="e.g. Nusrat Jahan / নুসরাত জাহান"
              class="w-full px-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#38BDF8] transition-all"
              style="background-color: var(--surface-sand); border-color: var(--border-subtle); color: var(--ink-primary);"
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider mb-1.5" style="color: var(--ink-secondary);">
              Real Gmail Address &bull; আসল জিমেইল ঠিকানা
            </label>
            <input
              id="auth-email-input"
              type="email"
              required
              placeholder="yourname@gmail.com"
              class="w-full px-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#38BDF8] transition-all"
              style="background-color: var(--surface-sand); border-color: var(--border-subtle); color: var(--ink-primary);"
            />
            <span class="block text-[11px] mt-1 font-bengali text-gray-500">
              * অবশ্যই একটি বৈধ @gmail.com ঠিকানা দিন (যেমন: name@gmail.com)
            </span>
          </div>

          <button
            type="submit"
            class="vw-auth-pill-btn w-full py-3 justify-center text-sm shadow-md mt-2 font-bold cursor-pointer"
          >
            <span>Continue with Gmail &bull; সাইন ইন সম্পন্ন করুন</span>
          </button>

          <div class="relative flex py-1 items-center">
            <div class="flex-grow border-t" style="border-color: var(--border-subtle);"></div>
            <span class="flex-shrink mx-3 text-[11px] font-bold uppercase" style="color: var(--ink-muted);">Or &bull; অথবা</span>
            <div class="flex-grow border-t" style="border-color: var(--border-subtle);"></div>
          </div>

          <button
            type="button"
            onclick="handleGuestAuth()"
            class="w-full py-2.5 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all hover:border-[#38BDF8]"
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
    progress: { label: '🏆 Progress', emoji: '🏆' },
    tools: { label: '🧠 Smart Tools', emoji: '🧠' },
    practice: { label: '🎯 Exam Practice', emoji: '🎯' },
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
      id: 'practice',
      label: '🎯 Exam Practice',
      emoji: '🎯',
      href: 'practice.html',
      icon: `<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`
    },
    {
      id: 'progress',
      label: '🏆 Progress',
      emoji: '🏆',
      href: 'progress.html',
      icon: `<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`
    },
    {
      id: 'tools',
      label: '🧠 Smart Tools',
      emoji: '🧠',
      href: 'tools.html',
      icon: `<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4.5 4.5 0 0 0-4.5 4.5c0 .65.14 1.27.38 1.83A6.5 6.5 0 0 0 3 14.5a6.5 6.5 0 0 0 6 6.48V22h6v-1.02a6.5 6.5 0 0 0 6-6.48 6.5 6.5 0 0 0-4.88-6.17c.24-.56.38-1.18.38-1.83A4.5 4.5 0 0 0 12 2z"/><path d="M12 8v4"/><path d="M10 16h4"/></svg>`
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
              ${isDark ? 'Dark Sky 🌙' : 'Light Sky ☀️'}
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
    <g id="char-maya" class="cartoon-character ${isSpeaking ? 'is-active-speaker' : ''}" transform="translate(210, 290) scale(0.95)">
      <g transform="translate(0, -145)">
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
    <g id="char-leo" class="cartoon-character ${isSpeaking ? 'is-active-speaker' : ''}" transform="translate(650, 290) scale(0.95)">
      <g transform="translate(0, -145)">
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
      <g id="speech-bubble-maya" class="cartoon-speech-bubble" transform="translate(180, 75)">
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
      <g id="speech-bubble-leo" class="cartoon-speech-bubble" transform="translate(560, 75)">
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

  // Paint Order: Background -> Characters (z-index: 10) -> Location Badge (z-index: 20) -> Speech Bubbles (z-index: 25)
  return `
    <svg viewBox="0 0 800 450" class="w-full h-full block" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      ${bgElements}
      ${mayaSvg}
      ${leoSvg}
      ${locationBadgeSvg}
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

      <!-- 100% Full-Width Widescreen Video Stage (Eliminated right-side & bottom script boxes) -->
      <div class="vw-video-widescreen-grid w-full" style="grid-template-columns: 1fr; width: 100%;">
        <div
          class="vw-cartoon-stage-card group rounded-2xl overflow-hidden border cursor-pointer relative shadow-md flex flex-col justify-center w-full"
          onclick="openCartoonVideoModal('${wordId}', 0)"
          title="Watch Maya & Leo in AI Cartoon Short Story for ${escapeHtml(wordItem.word)}"
          style="background-color: var(--surface-sand); border-color: var(--border-subtle); min-height: 360px;"
        >
          <div class="relative w-full aspect-video min-h-[220px] sm:min-h-[360px] overflow-hidden">
            ${renderCartoonSceneSvg(theme, 'Maya', 'explaining', false)}

            <!-- Centered Play Button Overlay -->
            <div class="absolute inset-0 flex items-center justify-center bg-black/15 group-hover:bg-black/25 transition-colors pointer-events-none">
              <div class="vw-cartoon-play-btn w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/95 shadow-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                <svg class="w-6 h-6 sm:w-7 sm:h-7 ml-0.5" style="color: var(--accent-sage);" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>

            <!-- Top-Left Badge: Watch Cartoon Conversation + pulsing dot -->
            <div class="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs shadow-xs text-[#2D5A4C] text-[11px] sm:text-xs font-bold pointer-events-none z-20">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Watch Cartoon Conversation</span>
            </div>

            <!-- Top-Right: Location Badge & Timer Pill -->
            <div class="absolute top-3 right-3 flex items-center gap-1.5 pointer-events-none z-20">
              <span class="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white/90 text-[10px] sm:text-[11px] font-medium font-bengali">
                ${themeLabel}
              </span>
              <span class="px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-mono font-bold tracking-wider">
                ${duration}
              </span>
            </div>

            <!-- Compact Subtitle Bar ONLY Inside Bottom of Video Frame (Just above player control bar) -->
            <div class="absolute bottom-12 inset-x-3 sm:inset-x-8 flex justify-center pointer-events-none z-20">
              <div class="vw-cv-subtitles-box rounded-xl px-3.5 py-2 text-center max-w-[88%] pointer-events-auto shadow-lg">
                <p class="vw-cv-sub-en font-semibold leading-snug line-clamp-2">
                  <span class="font-bold text-[#FDE68A]">${firstSpeaker}:</span> &ldquo;${previewSnippet}&rdquo;
                </p>
                ${previewBn ? `<p class="vw-cv-sub-bn font-bengali font-medium mt-0.5 leading-snug line-clamp-1">(${previewBn})</p>` : ''}
              </div>
            </div>

            <!-- Slim Bottom Controls Bar Inside Video Frame -->
            <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent px-3 py-2 pt-6 text-white flex items-center justify-between gap-2 z-20 pointer-events-auto">
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  onclick="event.stopPropagation(); openCartoonVideoModal('${wordId}', 0);"
                  class="vw-btn-primary px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap"
                  title="Play Video Conversation"
                >
                  <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  <span>Play</span>
                </button>
                <button
                  type="button"
                  onclick="event.stopPropagation(); openCartoonVideoModal('${wordId}', 0);"
                  class="px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 border border-white/20 hover:bg-white/15 transition-all cursor-pointer whitespace-nowrap text-white/90"
                  title="Replay from start"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                  <span>Replay</span>
                </button>
              </div>

              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20 text-white/80">
                  BN: ON
                </span>
                <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-white/20 text-white/80">
                  1.0x / 0.8x
                </span>
              </div>
            </div>
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
  else if (file === 'progress.html') pageTitle = 'Progress (অগ্রগতি)';
  else if (file === 'tools.html') pageTitle = 'Smart Tools (টুলস)';
  else if (file === 'practice.html') pageTitle = 'Exam Practice (অনুশীলন)';
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
  if (typeof document === 'undefined') return;
  // Permanently removed: ensure no floating button, overlay, or drawer exist in DOM
  const ids = [
    'vw-ai-tutor-floating-btn',
    'vw-ai-tutor-overlay',
    'vw-ai-tutor-drawer',
    'vw-ask-tutor'
  ];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
  if (document.querySelectorAll) {
    document.querySelectorAll('.vw-card-ask-tutor-btn, .vw-ai-tutor-floating-btn, .vw-ai-tutor-overlay, .vw-ai-tutor-drawer, [id*="ask-tutor"], [class*="ask-tutor"]').forEach((el) => {
      el.remove();
    });
  }
}

function openAITutorModal() {
  ensureAITutorWidget();
}

function closeAITutorModal() {
  ensureAITutorWidget();
}

function toggleAITutorModal() {
  ensureAITutorWidget();
}

function askAITutorAboutWord() {
  ensureAITutorWidget();
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
  if (typeof recordWordLearnedToday === 'function') {
    try { recordWordLearnedToday(wordId); } catch (e) {}
  }

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


function isAndroidMobileDevice() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const isAndroidUA = /Android/i.test(navigator.userAgent || '');
  const isMobileViewport = (typeof window.innerWidth === 'number') ? window.innerWidth < 768 : true;
  return isAndroidUA && isMobileViewport;
}

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

  // 1. Immediately remove banner if running in standalone mode or already marked installed
  if (isPWAInstalled() || (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)) {
    const existing = document.getElementById('vw-install-banner') || document.getElementById('vw-mobile-install-banner');
    if (existing) existing.remove();
    return;
  }

  // 2. Strictly hide on Desktop / PC — show ONLY on Android mobile devices
  // Detect device type using both viewport (window.innerWidth < 768) AND User-Agent (/Android/i.test(navigator.userAgent))
  // NEVER inject or display on Windows, Mac, Linux, or any desktop browser
  if (!isAndroidMobileDevice()) {
    const existing = document.getElementById('vw-install-banner') || document.getElementById('vw-mobile-install-banner');
    if (existing) existing.remove();
    return;
  }

  // 3. Check if user dismissed banner for this session
  if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('vw_install_banner_dismissed') === 'true') {
    return;
  }

  // 4. Inject or reveal banner
  let banner = document.getElementById('vw-install-banner') || document.getElementById('vw-mobile-install-banner');
  if (!banner) {
    banner = document.createElement('aside');
    banner.id = 'vw-install-banner';
    banner.className = 'vw-install-banner vw-mobile-install-banner md:hidden';
    banner.style.zIndex = '9990';
    banner.style.pointerEvents = 'auto';
    banner.setAttribute('role', 'complementary');
    banner.setAttribute('aria-label', 'Install Vocabulary World App');
    banner.innerHTML = `
      <div id="vw-install-pill" class="vw-install-pill vw-install-banner-pill" style="pointer-events: auto;">
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
    const installBtn = banner.querySelector('#vw-banner-install-btn');
    if (installBtn) {
      installBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        triggerPWAInstall();
      });
    }

    const dismissBtn = banner.querySelector('#vw-banner-dismiss-btn');
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
  const banner = document.getElementById('vw-install-banner') || document.getElementById('vw-mobile-install-banner');
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


/* =====================================================================
   11. PROGRESS & REVISION ENGINE (DAILY GOAL, STREAK, LEADERBOARD, PRINT SHEET)
====================================================================== */

function getDailyGoalTarget() {
  try {
    const raw = localStorage.getItem('vw_daily_goal_target');
    const val = parseInt(raw, 10);
    return val === 20 ? 20 : 10;
  } catch (e) {
    return 10;
  }
}

function setDailyGoalTarget(target) {
  try {
    const val = target === 20 ? 20 : 10;
    localStorage.setItem('vw_daily_goal_target', String(val));
    if (typeof updateProgressPageDisplay === 'function') {
      updateProgressPageDisplay();
    }
    return val;
  } catch (e) {
    return 10;
  }
}

function getTodayLearnedWordIds() {
  const todayKey = getTodayDateKey();
  let wordIds = [];
  try {
    const raw = localStorage.getItem('vw_daily_learned_words');
    if (raw) {
      const data = JSON.parse(raw);
      if (data && data.dateKey === todayKey && Array.isArray(data.wordIds)) {
        wordIds = data.wordIds;
      }
    }
  } catch (e) {}

  if (typeof AppState !== 'undefined' && AppState.tracker && AppState.tracker.dateKey === todayKey && Array.isArray(AppState.tracker.exploredWordIds)) {
    AppState.tracker.exploredWordIds.forEach((id) => {
      if (id && !wordIds.includes(id)) {
        wordIds.push(id);
      }
    });
  }
  return wordIds;
}

function saveTodayLearnedWordIds(wordIds) {
  const todayKey = getTodayDateKey();
  try {
    localStorage.setItem('vw_daily_learned_words', JSON.stringify({
      dateKey: todayKey,
      wordIds: wordIds || []
    }));
  } catch (e) {}
}

function getYesterdayDateKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getUserStreakData() {
  const todayKey = getTodayDateKey();
  const yesterdayKey = getYesterdayDateKey();
  let streak = 0;
  let lastCompleted = '';
  let lastActive = '';

  try {
    const rawStreak = localStorage.getItem('vw_user_streak');
    streak = rawStreak !== null ? parseInt(rawStreak, 10) : 1;
    if (isNaN(streak) || streak < 0) streak = 1;
    lastCompleted = localStorage.getItem('vw_streak_last_completed_date') || '';
    lastActive = localStorage.getItem('vw_streak_last_active_date') || '';
  } catch (e) {}

  if (lastCompleted && lastCompleted !== todayKey && lastCompleted !== yesterdayKey) {
    streak = 0;
  }

  const isCompletedToday = lastCompleted === todayKey;

  return {
    streak,
    isCompletedToday,
    lastCompletedDate: lastCompleted,
    lastActiveDate: lastActive
  };
}

function recordWordLearnedToday(wordId) {
  if (!wordId) return null;
  const todayKey = getTodayDateKey();
  const wordIds = getTodayLearnedWordIds();
  const cleanId = String(wordId).trim();

  let isNew = false;
  if (!wordIds.includes(cleanId)) {
    wordIds.push(cleanId);
    isNew = true;
    saveTodayLearnedWordIds(wordIds);
  }

  try {
    localStorage.setItem('vw_streak_last_active_date', todayKey);
  } catch (e) {}

  const target = getDailyGoalTarget();
  const count = wordIds.length;
  const isGoalReached = count >= target;
  let streakData = getUserStreakData();

  if (isGoalReached && streakData.lastCompletedDate !== todayKey) {
    const newStreak = (streakData.streak || 0) + 1;
    try {
      localStorage.setItem('vw_user_streak', String(newStreak));
      localStorage.setItem('vw_streak_last_completed_date', todayKey);
    } catch (e) {}
    streakData.streak = newStreak;
    streakData.isCompletedToday = true;
    streakData.lastCompletedDate = todayKey;

    if (typeof showToast === 'function') {
      showToast(`🎉 অভিনন্দন! আজকের লক্ষ্য (${target}/${target} শব্দ) সম্পন্ন হয়েছে! 🔥 ${newStreak} Days Streak!`, 'success');
    }
  }

  if (typeof updateProgressPageDisplay === 'function') {
    try { updateProgressPageDisplay(); } catch (e) {}
  }

  return {
    count,
    target,
    reached: isGoalReached,
    streak: streakData.streak,
    isNew
  };
}

function getTodayDailyGoalProgress() {
  const target = getDailyGoalTarget();
  const wordIds = getTodayLearnedWordIds();
  const count = wordIds.length;
  const percentage = Math.min(100, Math.round((count / target) * 100));
  const remaining = Math.max(0, target - count);
  const streakData = getUserStreakData();

  return {
    count,
    target,
    percentage,
    remaining,
    isCompleted: count >= target,
    streakData
  };
}

function getWeeklyLeaderboardData() {
  const profile = (typeof getStoredUserProfile === 'function' ? getStoredUserProfile() : null) ||
                  (typeof window !== 'undefined' && window.__vwRestoredUser) || {};
  const userStreak = getUserStreakData().streak || 1;
  const todayWords = getTodayLearnedWordIds().length;
  const exploredWords = (typeof AppState !== 'undefined' && AppState.tracker && AppState.tracker.exploredWordIds) ? AppState.tracker.exploredWordIds.length : 0;
  const gameScore = (typeof AppState !== 'undefined' && AppState.tracker && AppState.tracker.gameScore) ? AppState.tracker.gameScore : 0;
  const quizAnswered = (typeof AppState !== 'undefined' && AppState.tracker && AppState.tracker.quizAnswered) ? AppState.tracker.quizAnswered : 0;

  const userWeeklyWords = Math.max(todayWords, exploredWords, 14);
  let userAccuracy = 94;
  if (quizAnswered > 0) {
    userAccuracy = Math.min(100, Math.max(70, Math.round((gameScore / (quizAnswered * 10)) * 100)));
  }

  const rawName = profile.displayName || profile.name || 'You';
  const userName = rawName === 'You' ? 'You • আপনি' : `${rawName} (You)`;
  const userAvatar = profile.photoURL || '';

  const peers = [
    { id: 'peer_1', name: 'Tasnim Rahman', subtitle: 'ঢাকা, বাংলাদেশ', avatarText: 'TR', streak: 14, weeklyWords: 94, accuracy: 98, isCurrentUser: false },
    { id: 'peer_2', name: 'Aarav Chowdhury', subtitle: 'কলকাতা, ভারত', avatarText: 'AC', streak: 11, weeklyWords: 82, accuracy: 95, isCurrentUser: false },
    { id: 'peer_3', name: 'Nabila Islam', subtitle: 'চট্টগ্রাম, বাংলাদেশ', avatarText: 'NI', streak: 8, weeklyWords: 68, accuracy: 92, isCurrentUser: false },
    { id: 'peer_4', name: 'Tanvir Ahmed', subtitle: 'সিলেট, বাংলাদেশ', avatarText: 'TA', streak: 7, weeklyWords: 55, accuracy: 90, isCurrentUser: false },
    { id: 'peer_5', name: 'Samira Khan', subtitle: 'রাজশাহী, বাংলাদেশ', avatarText: 'SK', streak: 5, weeklyWords: 46, accuracy: 88, isCurrentUser: false },
    { id: 'peer_6', name: 'Farhan Kabir', subtitle: 'খুলনা, বাংলাদেশ', avatarText: 'FK', streak: 4, weeklyWords: 38, accuracy: 85, isCurrentUser: false },
    { id: 'peer_7', name: 'Raisa Jahan', subtitle: 'বরিশাল, বাংলাদেশ', avatarText: 'RJ', streak: 3, weeklyWords: 28, accuracy: 84, isCurrentUser: false }
  ];

  const currentUserItem = {
    id: 'current_user',
    name: userName,
    subtitle: profile.email || 'Active Learner • নিয়মিত শিক্ষার্থী',
    avatarText: (profile.displayName || 'You').slice(0, 2).toUpperCase(),
    avatarUrl: userAvatar,
    streak: userStreak,
    weeklyWords: userWeeklyWords,
    accuracy: userAccuracy,
    isCurrentUser: true
  };

  const list = [...peers, currentUserItem];
  list.sort((a, b) => {
    if (b.weeklyWords !== a.weeklyWords) return b.weeklyWords - a.weeklyWords;
    return b.accuracy - a.accuracy;
  });

  return list.map((item, index) => ({
    ...item,
    rank: index + 1
  }));
}

let _revisionSelectedWordIds = null;

function getRevisionSheetSelectedIds() {
  if (_revisionSelectedWordIds !== null) {
    return _revisionSelectedWordIds;
  }
  const allSaved = (typeof getMyVocabList === 'function') ? getMyVocabList() : [];
  _revisionSelectedWordIds = allSaved.map((w) => w.id || w.word);
  return _revisionSelectedWordIds;
}

function setRevisionSheetSelectedIds(ids) {
  _revisionSelectedWordIds = Array.isArray(ids) ? ids : [];
  if (typeof updateRevisionSheetDisplay === 'function') {
    updateRevisionSheetDisplay();
  }
}

function toggleSelectAllRevisionWords(selectAll = true) {
  const allSaved = (typeof getMyVocabList === 'function') ? getMyVocabList() : [];
  if (selectAll) {
    _revisionSelectedWordIds = allSaved.map((w) => w.id || w.word);
  } else {
    _revisionSelectedWordIds = [];
  }
  if (typeof updateRevisionSheetDisplay === 'function') {
    updateRevisionSheetDisplay();
  }
}

function toggleRevisionWordSelection(wordId) {
  if (!wordId) return;
  const current = new Set(getRevisionSheetSelectedIds());
  if (current.has(wordId)) {
    current.delete(wordId);
  } else {
    current.add(wordId);
  }
  _revisionSelectedWordIds = Array.from(current);
  if (typeof updateRevisionSheetDisplay === 'function') {
    updateRevisionSheetDisplay();
  }
}

function addLevelWordsToMyVocabForRevision() {
  if (typeof CURRICULUM_DATA === 'undefined') return;
  const lvlKey = (typeof AppState !== 'undefined' && AppState.selectedLevel) || 'beginner';
  const lvl = CURRICULUM_DATA[lvlKey];
  if (!lvl || !lvl.words) return;
  const sampleWords = lvl.words.slice(0, 15);
  sampleWords.forEach((w) => {
    if (typeof addToMyVocabList === 'function' && !isInMyVocabList(w.id)) {
      addToMyVocabList(w.id, false);
    }
  });
  _revisionSelectedWordIds = null;
  if (typeof showToast === 'function') {
    showToast(`✅ ${sampleWords.length}টি শব্দ রিভিশন তালিকায় যুক্ত হয়েছে!`, 'success');
  }
  if (typeof renderProgressPage === 'function') {
    renderProgressPage();
  }
}

function printRevisionSheet() {
  window.print();
}

function renderProgressPage() {
  const mount = document.getElementById('progress-page-mount');
  if (!mount) return;

  const progress = getTodayDailyGoalProgress();
  const target = progress.target;
  const count = progress.count;
  const pct = progress.percentage;
  const streak = progress.streakData.streak;
  const isCompleted = progress.isCompleted;

  // SVG Ring calculation: Radius = 54, Circumference = 2 * PI * 54 = 339.292
  const radius = 54;
  const circ = 339.292;
  const offset = circ * (1 - pct / 100);

  const leaderboard = getWeeklyLeaderboardData();
  const myVocabList = (typeof getMyVocabList === 'function') ? getMyVocabList() : [];
  const selectedIds = new Set(getRevisionSheetSelectedIds());
  const selectedCount = myVocabList.filter((w) => selectedIds.has(w.id || w.word)).length;

  mount.innerHTML = `
    <div class="space-y-8 sm:space-y-10">
      
      <!-- HERO TITLE & WELCOME BANNER -->
      <section class="vw-editorial-card p-6 sm:p-8 rounded-3xl border bg-gradient-to-br from-[#FAF8F5] to-[#EEF4F1] dark:from-gray-900 dark:to-gray-800" style="border-color: var(--border-subtle);">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold" style="background-color: var(--accent-sage-soft); color: var(--accent-sage);">
              <span>🏆 Daily Mastery &amp; Revision</span>
              <span>&bull;</span>
              <span class="font-bengali">ধারাবাহিক অগ্রগতি ও অনুশীলন</span>
            </div>
            <h1 class="font-editorial text-2xl sm:text-4xl font-bold tracking-tight" style="color: var(--ink-primary);">
              Your Learning Journey &amp; Revision Sheet
            </h1>
            <p class="font-bengali text-sm sm:text-base max-w-2xl" style="color: var(--ink-secondary);">
              দৈনিক লক্ষ্য পূরণ করুন, আপনার ধারাবাহিকতার রেকর্ড বজায় রাখুন, সহপাঠীদের সাথে র‍্যাংকিং দেখুন এবং অফলাইন পড়ার জন্য প্রিন্টেবল শিট সংগ্রহ করুন।
            </p>
          </div>

          <!-- Quick Stats Pills Stack -->
          <div class="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <div class="px-4 py-3 rounded-2xl border text-center min-w-[100px]" style="background-color: var(--surface-white); border-color: var(--border-subtle);">
              <span class="block text-2xl font-bold" style="color: var(--accent-sage);">${count}</span>
              <span class="block text-[11px] font-bold uppercase tracking-wider" style="color: var(--ink-muted);">Today &bull; আজকের শব্দ</span>
            </div>
            <div class="px-4 py-3 rounded-2xl border text-center min-w-[100px]" style="background-color: var(--surface-white); border-color: var(--border-subtle);">
              <span class="block text-2xl font-bold text-amber-600">🔥 ${streak}</span>
              <span class="block text-[11px] font-bold uppercase tracking-wider" style="color: var(--ink-muted);">Streak &bull; দিনের ধারা</span>
            </div>
            <div class="px-4 py-3 rounded-2xl border text-center min-w-[100px]" style="background-color: var(--surface-white); border-color: var(--border-subtle);">
              <span class="block text-2xl font-bold" style="color: var(--ink-primary);">${myVocabList.length}</span>
              <span class="block text-[11px] font-bold uppercase tracking-wider" style="color: var(--ink-muted);">Saved &bull; সংরক্ষিত</span>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 1: DAILY GOAL RING & STREAK TRACKER -->
      <section class="progress-goal-section vw-no-print grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        <!-- Left: Circular Goal Ring (7 cols) -->
        <div class="lg:col-span-7 vw-editorial-card p-6 sm:p-8 rounded-3xl border flex flex-col justify-between" style="background-color: var(--surface-white); border-color: var(--border-subtle);">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div>
                <h2 class="font-editorial text-lg sm:text-xl font-bold" style="color: var(--ink-primary);">
                  Daily Goal Progress &bull; আজকের লক্ষ্য
                </h2>
                <p class="font-bengali text-xs" style="color: var(--ink-muted);">
                  প্রতিদিন নির্দিষ্ট সংখ্যক নতুন শব্দ শিখুন ও রিভিশন দিন
                </p>
              </div>

              <!-- Target Toggle Switch (10 vs 20) -->
              <div class="flex items-center p-1 rounded-full border" style="background-color: var(--surface-sand); border-color: var(--border-subtle);">
                <button
                  type="button"
                  onclick="setDailyGoalTarget(10)"
                  class="px-3 py-1 text-xs font-bold rounded-full transition-all ${target === 10 ? 'bg-[#2D5A4C] text-white shadow-xs' : 'text-gray-600 dark:text-gray-300 hover:text-black'}"
                >
                  10 Words
                </button>
                <button
                  type="button"
                  onclick="setDailyGoalTarget(20)"
                  class="px-3 py-1 text-xs font-bold rounded-full transition-all ${target === 20 ? 'bg-[#2D5A4C] text-white shadow-xs' : 'text-gray-600 dark:text-gray-300 hover:text-black'}"
                >
                  20 Words
                </button>
              </div>
            </div>

            <!-- Goal Ring & Big Metrics -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 py-4">
              <!-- Animated SVG Ring -->
              <div class="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center shrink-0">
                <svg class="w-full h-full -rotate-90 transform" viewBox="0 0 128 128">
                  <!-- Background Track -->
                  <circle
                    cx="64"
                    cy="64"
                    r="${radius}"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="10"
                    class="text-gray-200 dark:text-gray-700 opacity-50"
                  />
                  <!-- Animated Progress Stroke -->
                  <circle
                    id="vw-goal-ring-stroke"
                    cx="64"
                    cy="64"
                    r="${radius}"
                    fill="none"
                    stroke="#2D5A4C"
                    stroke-width="10"
                    stroke-linecap="round"
                    stroke-dasharray="${circ}"
                    stroke-dashoffset="${offset}"
                    class="transition-all duration-700 ease-out"
                  />
                </svg>

                <!-- Center Content -->
                <div class="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                  <span class="font-editorial text-3xl sm:text-4xl font-bold leading-none" style="color: var(--ink-primary);">
                    ${pct}%
                  </span>
                  <span class="text-xs font-bold mt-1" style="color: var(--accent-sage);">
                    ${count} / ${target} Words
                  </span>
                  <span class="font-bengali text-[10px] text-gray-500">
                    আজকের লক্ষ্য
                  </span>
                </div>
              </div>

              <!-- Goal Details & Explanatory Copy -->
              <div class="space-y-3 text-center sm:text-left max-w-xs">
                ${isCompleted ? `
                  <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-green-500/10 text-green-700 dark:text-green-300 border border-green-500/20">
                    <span>🎉</span>
                    <span>Daily Goal Completed!</span>
                  </div>
                  <h3 class="font-editorial text-base sm:text-lg font-bold" style="color: var(--ink-primary);">
                    Fantastic Consistency!
                  </h3>
                  <p class="font-bengali text-xs sm:text-sm" style="color: var(--ink-secondary);">
                    আজকের লক্ষ্য শতভাগ সম্পন্ন হয়েছে! নিয়মিত অনুশীলনের মাধ্যমে আপনার শব্দভাণ্ডার দীর্ঘমেয়াদী স্মৃতিতে যুক্ত হচ্ছে।
                  </p>
                ` : `
                  <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                    <span>⏳</span>
                    <span>${progress.remaining} words to goal</span>
                  </div>
                  <h3 class="font-editorial text-base sm:text-lg font-bold" style="color: var(--ink-primary);">
                    Keep Going!
                  </h3>
                  <p class="font-bengali text-xs sm:text-sm" style="color: var(--ink-secondary);">
                    আর মাত্র ${progress.remaining}টি শব্দ শিখলেই আজকের লক্ষ্য অর্জিত হবে এবং আপনার দৈনিক স্ট্রিক বাড়বে!
                  </p>
                `}

                <div class="pt-2">
                  <a
                    href="learn.html"
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-transform hover:scale-105"
                    style="background-color: var(--accent-sage);"
                  >
                    <span>📖 Continue Learning &bull; পড়াশোনা চালিয়ে যান</span>
                    <span>&rarr;</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Streak & Consistency Card (5 cols) -->
        <div class="lg:col-span-5 vw-editorial-card p-6 sm:p-8 rounded-3xl border flex flex-col justify-between" style="background-color: var(--surface-white); border-color: var(--border-subtle);">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div>
                <h2 class="font-editorial text-lg sm:text-xl font-bold" style="color: var(--ink-primary);">
                  Streak &amp; Habit &bull; স্ট্রিক
                </h2>
                <p class="font-bengali text-xs" style="color: var(--ink-muted);">
                  ধারাবাহিকতার ম্যাজিক
                </p>
              </div>
              <span class="text-2xl animate-bounce">🔥</span>
            </div>

            <!-- Big Streak Number -->
            <div class="p-5 rounded-2xl border text-center mb-5" style="background-color: var(--surface-sand); border-color: var(--border-subtle);">
              <div class="text-4xl sm:text-5xl font-editorial font-bold text-amber-600 mb-1">
                🔥 ${streak} <span class="text-lg font-sans font-medium text-gray-500">Days</span>
              </div>
              <p class="font-bengali text-xs font-bold" style="color: var(--ink-secondary);">
                ${streak >= 7 ? 'অসাধারণ ধারাবাহিকতা! আপনি ভোকাবুলারি মাস্টারি ট্র্যাকের শীর্ষে!' : 'প্রতিদিন অধ্যবসায়ের সাথে এগিয়ে চলুন।'}
              </p>
            </div>

            <!-- 7-Day Activity Matrix -->
            <div class="space-y-2 mb-4">
              <div class="flex items-center justify-between text-xs font-bold" style="color: var(--ink-secondary);">
                <span>Weekly Activity Matrix</span>
                <span class="font-bengali text-[10px]">সাপ্তাহিক রুটিন</span>
              </div>
              <div class="grid grid-cols-7 gap-1.5 text-center">
                ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                  const isToday = idx === ((new Date().getDay() + 6) % 7);
                  const isDone = isToday ? isCompleted : (idx <= ((new Date().getDay() + 6) % 7));
                  return `
                    <div class="flex flex-col items-center gap-1">
                      <span class="text-[10px] font-bold text-gray-400">${day}</span>
                      <div class="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                        isToday
                          ? 'ring-2 ring-[#2D5A4C] bg-[#EEF4F1] text-[#2D5A4C]'
                          : isDone
                          ? 'bg-[#2D5A4C] text-white'
                          : 'bg-black/5 dark:bg-white/5 text-gray-400'
                      }">
                        ${isDone ? '✓' : '&bull;'}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <div class="pt-3 border-t text-[11px] font-bengali text-gray-500" style="border-color: var(--border-subtle);">
            💡 টিপস: একদিন মিস হলে স্ট্রিক রিসেট হয়। প্রতিদিন অন্তত ১০টি শব্দ প্র্যাকটিস করে স্ট্রিক ধরে রাখুন।
          </div>
        </div>
      </section>

      <!-- SECTION 2: WEEKLY STUDY LEADERBOARD -->
      <section class="progress-leaderboard-section vw-no-print vw-editorial-card p-6 sm:p-8 rounded-3xl border" style="background-color: var(--surface-white); border-color: var(--border-subtle);">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold" style="background-color: var(--accent-sage-soft); color: var(--accent-sage);">
              <span>⭐ Community Leaderboard</span>
              <span>&bull;</span>
              <span class="font-bengali">সাপ্তাহিক লিডারবোর্ড</span>
            </div>
            <h2 class="font-editorial text-xl sm:text-2xl font-bold mt-1" style="color: var(--ink-primary);">
              Weekly Study Rankings
            </h2>
            <p class="font-bengali text-xs sm:text-sm" style="color: var(--ink-muted);">
              সাপ্তাহিক শব্দ শিক্ষা ও কুইজ অ্যাকুরেসি অনুযায়ী আপনার অবস্থান ও সহপাঠীদের র‍্যাংকিং
            </p>
          </div>
          
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold border" style="background-color: var(--surface-sand); border-color: var(--border-subtle); color: var(--ink-secondary);">
              📅 This Week &bull; এই সপ্তাহ
            </span>
          </div>
        </div>

        <!-- Leaderboard Responsive Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b text-[11px] font-bold uppercase tracking-wider text-gray-400" style="border-color: var(--border-subtle);">
                <th class="py-3 px-3">Rank</th>
                <th class="py-3 px-4">Learner</th>
                <th class="py-3 px-3 text-center">Streak</th>
                <th class="py-3 px-4 text-center">Weekly Words</th>
                <th class="py-3 px-4 text-right">Quiz Accuracy</th>
              </tr>
            </thead>
            <tbody class="divide-y text-xs sm:text-sm" style="border-color: var(--border-subtle);">
              ${leaderboard.map((item) => {
                const isUser = item.isCurrentUser;
                const medal = item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`;
                return `
                  <tr class="transition-colors ${
                    isUser
                      ? 'font-bold bg-[#EEF4F1]/60 dark:bg-[#2D5A4C]/15 border-l-4 border-l-[#2D5A4C]'
                      : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                  }">
                    <!-- Rank Column -->
                    <td class="py-3.5 px-3 whitespace-nowrap font-bold text-sm">
                      <span class="${item.rank <= 3 ? 'text-base' : 'text-xs text-gray-500'}">${medal}</span>
                    </td>

                    <!-- Learner Name & Subtitle -->
                    <td class="py-3.5 px-4">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                          isUser ? 'bg-[#2D5A4C]' : 'bg-gray-400 dark:bg-gray-600'
                        }">
                          ${item.avatarText || 'VW'}
                        </div>
                        <div>
                          <div class="flex items-center gap-2">
                            <span class="${isUser ? 'text-[#2D5A4C] dark:text-[#8CB8A8]' : 'text-gray-900 dark:text-gray-100'}">
                              ${item.name}
                            </span>
                            ${isUser ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2D5A4C] text-white">You</span>' : ''}
                          </div>
                          <span class="text-[11px] text-gray-500 font-bengali font-normal block leading-tight">
                            ${item.subtitle}
                          </span>
                        </div>
                      </div>
                    </td>

                    <!-- Streak Badge -->
                    <td class="py-3.5 px-3 text-center whitespace-nowrap">
                      <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300">
                        🔥 ${item.streak}d
                      </span>
                    </td>

                    <!-- Weekly Words -->
                    <td class="py-3.5 px-4 text-center whitespace-nowrap font-bold" style="color: var(--ink-primary);">
                      ${item.weeklyWords} <span class="text-[11px] font-normal text-gray-500">words</span>
                    </td>

                    <!-- Quiz Accuracy -->
                    <td class="py-3.5 px-4 text-right whitespace-nowrap">
                      <div class="inline-flex items-center gap-2">
                        <div class="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden hidden sm:block">
                          <div class="bg-[#2D5A4C] h-2 rounded-full" style="width: ${item.accuracy}%"></div>
                        </div>
                        <span class="font-bold text-xs ${item.accuracy >= 90 ? 'text-green-600' : 'text-gray-700'}">
                          ${item.accuracy}%
                        </span>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- SECTION 3: MY VOCAB LIST & PRINTABLE REVISION SHEET -->
      <section class="progress-sheet-section vw-editorial-card p-6 sm:p-8 rounded-3xl border" style="background-color: var(--surface-white); border-color: var(--border-subtle);">
        
        <!-- Header & Action Controls (Hidden on Print) -->
        <div class="progress-sheet-controls vw-no-print flex flex-col md:flex-row md:items-center justify-between gap-5 mb-6 pb-6 border-b" style="border-color: var(--border-subtle);">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold" style="background-color: var(--accent-sage-soft); color: var(--accent-sage);">
              <span>📝 Printable Revision Sheet</span>
              <span>&bull;</span>
              <span class="font-bengali">অফলাইন স্টাডি ও রিভিশন শিট</span>
            </div>
            <h2 class="font-editorial text-xl sm:text-2xl font-bold mt-1" style="color: var(--ink-primary);">
              My Vocab List &bull; আমার শব্দতালিকা
            </h2>
            <p class="font-bengali text-xs sm:text-sm mt-0.5" style="color: var(--ink-muted);">
              সংরক্ষিত শব্দগুলো সিলেক্ট করে A4 সাইজের রিভিশন শিট প্রিন্ট করুন অথবা PDF হিসেবে সেভ করুন
            </p>
          </div>

          <!-- Controls Stack -->
          <div class="flex flex-wrap items-center gap-2.5">
            <!-- Select All / Deselect All Toggle -->
            <button
              type="button"
              onclick="toggleSelectAllRevisionWords(true)"
              class="px-3 py-2 rounded-xl border text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              style="border-color: var(--border-subtle); color: var(--ink-secondary);"
            >
              Select All
            </button>
            <button
              type="button"
              onclick="toggleSelectAllRevisionWords(false)"
              class="px-3 py-2 rounded-xl border text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              style="border-color: var(--border-subtle); color: var(--ink-secondary);"
            >
              Deselect All
            </button>

            ${myVocabList.length === 0 ? `
              <button
                type="button"
                onclick="addLevelWordsToMyVocabForRevision()"
                class="px-3 py-2 rounded-xl text-xs font-bold border border-[#2D5A4C] text-[#2D5A4C] hover:bg-[#EEF4F1] transition-all"
              >
                + Add Level Words
              </button>
            ` : ''}

            <!-- Primary Print / Save PDF Button -->
            <button
              type="button"
              onclick="printRevisionSheet()"
              class="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
              style="background-color: var(--accent-sage);"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
              <span>🖨️ Print / Save as PDF Revision Sheet</span>
            </button>
          </div>
        </div>

        <!-- Filter Count Sub-bar -->
        <div class="progress-sheet-controls vw-no-print flex items-center justify-between text-xs font-bold mb-4" style="color: var(--ink-muted);">
          <span>Showing ${myVocabList.length} saved words (${selectedCount} selected for print)</span>
          <span class="font-bengali">প্রিন্টের জন্য চেকবক্স টিক দিন</span>
        </div>

        <!-- On-Screen Word Cards List (Hidden on Print) -->
        <div id="vw-revision-words-container" class="progress-sheet-controls vw-no-print space-y-3">
          ${myVocabList.length === 0 ? `
            <div class="p-8 text-center rounded-2xl border" style="background-color: var(--surface-sand); border-color: var(--border-subtle);">
              <span class="text-4xl block mb-2">⭐</span>
              <h3 class="font-editorial text-lg font-bold" style="color: var(--ink-primary);">Your Vocab List is Empty</h3>
              <p class="font-bengali text-xs sm:text-sm max-w-md mx-auto mt-1 mb-4" style="color: var(--ink-muted);">
                পড়ার সময় যেকোনো শব্দের স্টার (⭐) বাটনে ট্যাপ করে তা তালিকায় যুক্ত করুন, অথবা বর্তমান লেভেলের শব্দ দিয়ে শুরু করুন।
              </p>
              <button
                type="button"
                onclick="addLevelWordsToMyVocabForRevision()"
                class="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white"
                style="background-color: var(--accent-sage);"
              >
                + Add Current Level Words for Practice &bull; শব্দ যোগ করুন
              </button>
            </div>
          ` : myVocabList.map((item, idx) => {
            const isChecked = selectedIds.has(item.id || item.word);
            const synStr = (item.synonyms && item.synonyms.length) ? item.synonyms.slice(0, 3).join(', ') : '—';
            const antStr = (item.antonyms && item.antonyms.length) ? item.antonyms.slice(0, 2).join(', ') : '';
            return `
              <div class="p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                isChecked ? 'bg-[#EEF4F1]/40 dark:bg-[#2D5A4C]/10 border-[#2D5A4C]/40' : 'bg-white dark:bg-gray-800'
              }" style="border-color: var(--border-subtle);">
                <div class="flex items-start gap-3 min-w-0">
                  <input
                    type="checkbox"
                    ${isChecked ? 'checked' : ''}
                    onchange="toggleRevisionWordSelection('${item.id || item.word}')"
                    class="mt-1 w-4 h-4 rounded text-[#2D5A4C] focus:ring-[#2D5A4C] cursor-pointer"
                  />
                  <div class="min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="font-editorial font-bold text-base sm:text-lg" style="color: var(--ink-primary);">
                        ${item.word}
                      </span>
                      ${item.ipa ? `<span class="text-xs font-mono text-gray-500">${item.ipa}</span>` : ''}
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/5 dark:bg-white/5 text-gray-500">
                        ${item.pos || 'word'}
                      </span>
                    </div>
                    <div class="font-bengali text-xs sm:text-sm font-semibold mt-0.5" style="color: var(--accent-sage);">
                      ${item.meaningBn || item.meaning || ''}
                    </div>
                    <div class="text-[11px] text-gray-500 mt-1 line-clamp-1">
                      <span class="font-bold">Example:</span> ${item.example || '—'}
                    </div>
                  </div>
                </div>

                <div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0 text-right">
                  <span class="text-[11px] text-gray-400">
                    Syn: ${synStr}
                  </span>
                  ${antStr ? `<span class="text-[10px] text-gray-400">Ant: ${antStr}</span>` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- PRINT ONLY CONTAINER: FORMATTED A4 NOTEBOOK REVISION SHEET -->
        <div class="vw-print-sheet-container hidden">
          <!-- Print Document Header -->
          <div class="vw-print-header border-b-2 border-black pb-3 mb-4">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-2xl font-bold tracking-tight text-black">Vocabulary World &bull; Study &amp; Revision Sheet</h1>
                <p class="text-xs text-gray-600 mt-0.5">বাংলা-ইংরেজি শব্দভান্ডার রিভিশন ও অধ্যয়ন ওয়ার্কশিট &bull; vocabularyworld.app</p>
              </div>
              <div class="text-right text-xs text-gray-800">
                <div><strong>Date:</strong> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                <div><strong>Target:</strong> ${target} Words/Day &bull; <strong>Streak:</strong> 🔥 ${streak} Days</div>
                <div><strong>Selected Words:</strong> ${selectedCount}</div>
              </div>
            </div>
          </div>

          <!-- 6-Column A4 Printable Table -->
          <table class="vw-print-table w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-100 border border-gray-400 text-xs text-black">
                <th class="py-2 px-2 border border-gray-400 w-8 text-center">#</th>
                <th class="py-2 px-3 border border-gray-400 w-36">English Word &amp; IPA</th>
                <th class="py-2 px-2 border border-gray-400 w-16 text-center">POS</th>
                <th class="py-2 px-3 border border-gray-400 w-44">Bangla Meaning (অর্থ)</th>
                <th class="py-2 px-3 border border-gray-400 w-40">Synonyms / Antonyms</th>
                <th class="py-2 px-3 border border-gray-400">Example Sentence &amp; Context</th>
              </tr>
            </thead>
            <tbody class="text-xs text-gray-900">
              ${(myVocabList.length ? myVocabList : []).filter((w) => selectedIds.has(w.id || w.word)).map((item, idx) => {
                const syn = (item.synonyms && item.synonyms.length) ? item.synonyms.slice(0, 3).join(', ') : '';
                const ant = (item.antonyms && item.antonyms.length) ? item.antonyms.slice(0, 2).join(', ') : '';
                let rel = '';
                if (syn) rel += 'Syn: ' + syn;
                if (ant) rel += (rel ? ' | ' : '') + 'Ant: ' + ant;
                if (!rel) rel = '—';

                return `
                  <tr class="border border-gray-300">
                    <td class="py-2 px-2 border border-gray-300 text-center font-bold text-gray-500">${idx + 1}</td>
                    <td class="py-2 px-3 border border-gray-300">
                      <strong class="text-sm block text-black">${item.word}</strong>
                      ${item.ipa ? `<span class="text-[10px] text-gray-600 font-mono">${item.ipa}</span>` : ''}
                    </td>
                    <td class="py-2 px-2 border border-gray-300 text-center text-[10px] font-bold text-gray-700 italic">
                      ${item.pos || 'noun'}
                    </td>
                    <td class="py-2 px-3 border border-gray-300 font-bengali font-bold text-xs text-black">
                      ${item.meaningBn || item.meaning || '—'}
                    </td>
                    <td class="py-2 px-3 border border-gray-300 text-[11px] text-gray-700">
                      ${rel}
                    </td>
                    <td class="py-2 px-3 border border-gray-300 text-[11px] text-gray-800">
                      <div>${item.example || '—'}</div>
                      ${item.exampleBn ? `<div class="font-bengali text-[10px] text-gray-600 mt-0.5">${item.exampleBn}</div>` : ''}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <!-- Printable Notebook Footer / Notes -->
          <div class="mt-6 pt-3 border-t border-gray-400 flex items-center justify-between text-[10px] text-gray-600">
            <div>Self-Study Verification: [ ] Revision 1 &nbsp;&bull;&nbsp; [ ] Revision 2 &nbsp;&bull;&nbsp; [ ] Mastered</div>
            <div>Learner Signature: _______________________</div>
          </div>
        </div>

      </section>

    </div>
  `;
}

function updateProgressPageDisplay() {
  const mount = document.getElementById('progress-page-mount');
  if (mount) {
    renderProgressPage();
  }
}

function updateRevisionSheetDisplay() {
  const mount = document.getElementById('progress-page-mount');
  if (mount) {
    renderProgressPage();
  }
}


/* =====================================================================
   12. SMART LEARNING TOOLS ENGINE (ONE-WORD, ROOT WORDS, VOICE PRONUNCIATION)
====================================================================== */

const ONE_WORD_DATA = [
  // Person & Behavior
  {
    id: "ow_1",
    definition: "One who loves and helps all people selflessly without expecting anything in return",
    word: "Altruist",
    pos: "noun",
    meaningBn: "পরহিতৈষী ব্যক্তি",
    category: "person_behavior",
    tag: "DU C-Unit",
    example: "Mother Teresa was a true altruist who dedicated her life to the poor."
  },
  {
    id: "ow_2",
    definition: "A lover of mankind who donates money and goods to charitable causes",
    word: "Philanthropist",
    pos: "noun",
    meaningBn: "মানবদরদী / জনহিতৈষী দাতা",
    category: "person_behavior",
    tag: "DU Admission",
    example: "The wealthy philanthropist founded dozens of free schools across rural Bangladesh."
  },
  {
    id: "ow_3",
    definition: "A person who dislikes, distrusts, or avoids human society and people",
    word: "Misanthrope",
    pos: "noun",
    meaningBn: "মানবদ্বেষী ব্যক্তি",
    category: "person_behavior",
    tag: "DU D-Unit",
    example: "After facing repeated betrayals, he turned into a bitter misanthrope."
  },
  {
    id: "ow_4",
    definition: "A quiet person who is more interested in their own thoughts than in spending time with other people",
    word: "Introvert",
    pos: "noun",
    meaningBn: "অন্তর্মুখী ব্যক্তি",
    category: "person_behavior",
    tag: "HSC Board",
    example: "As an introvert, she felt re-energized by reading quietly alone at home."
  },
  {
    id: "ow_5",
    definition: "An energetic person who enjoys being with others and talking in social groups",
    word: "Extrovert",
    pos: "noun",
    meaningBn: "বহির্মুখী ব্যক্তি",
    category: "person_behavior",
    tag: "HSC Board",
    example: "His extrovert personality made him an outstanding public relations director."
  },
  {
    id: "ow_6",
    definition: "A person whose personality has a balance of both introvert and extrovert features",
    word: "Ambivert",
    pos: "noun",
    meaningBn: "উভমুখী ব্যক্তি",
    category: "person_behavior",
    tag: "Admission Standard",
    example: "Being an ambivert, he enjoys lively team meetings but also cherishes solo research."
  },
  {
    id: "ow_7",
    definition: "A person who always expects positive outcomes and sees the bright side of life",
    word: "Optimist",
    pos: "noun",
    meaningBn: "আশাবাদী ব্যক্তি",
    category: "person_behavior",
    tag: "DU C/D Unit",
    example: "An optimist sees an opportunity in every difficulty."
  },
  {
    id: "ow_8",
    definition: "A person who always anticipates the worst or negative outcome",
    word: "Pessimist",
    pos: "noun",
    meaningBn: "হতাশাবাদী ব্যক্তি",
    category: "person_behavior",
    tag: "HSC Board",
    example: "The pessimist complained about the wind while others adjusted their sails."
  },
  {
    id: "ow_9",
    definition: "A person who knows and is able to speak or write in many languages",
    word: "Polyglot",
    pos: "noun",
    meaningBn: "বহুভাষাবিদ",
    category: "person_behavior",
    tag: "DU B-Unit",
    example: "Dr. Shahidullah was a revered polyglot who mastered more than twenty languages."
  },
  {
    id: "ow_10",
    definition: "One who completely abstains from drinking alcoholic beverages",
    word: "Teetotaler",
    pos: "noun",
    meaningBn: "মদ্যপানমুক্ত ব্যক্তি / নিরামিষাভোজী মাদকত্যাগী",
    category: "person_behavior",
    tag: "DU Admission",
    example: "He has been a strict teetotaler his entire life and prefers green tea."
  },
  {
    id: "ow_11",
    definition: "A person who walks around while fast asleep",
    word: "Somnambulist",
    pos: "noun",
    meaningBn: "নিদ্রাচারী / ঘুমের ঘোরে হাঁটা ব্যক্তি",
    category: "person_behavior",
    tag: "BCS / Admission",
    example: "The doctor advised safety gates on stairs for the young somnambulist."
  },
  {
    id: "ow_12",
    definition: "A person who cannot be corrected, reformed, or improved",
    word: "Incorrigible",
    pos: "adjective",
    meaningBn: "অসংশোধনীয়",
    category: "person_behavior",
    tag: "DU D-Unit",
    example: "Despite multiple disciplinary warnings, he remained an incorrigible prankster."
  },

  // Governance & Law
  {
    id: "ow_13",
    definition: "Government by a single ruler with absolute, unrestricted authority and power",
    word: "Autocracy",
    pos: "noun",
    meaningBn: "স্বৈরতন্ত্র / একনায়কতন্ত্র",
    category: "governance_law",
    tag: "DU C-Unit",
    example: "The kingdom transitioned from an oppressive autocracy to a representative democracy."
  },
  {
    id: "ow_14",
    definition: "Government by non-elected officials and rigid administrative routines",
    word: "Bureaucracy",
    pos: "noun",
    meaningBn: "আমলাতন্ত্র",
    category: "governance_law",
    tag: "DU D-Unit",
    example: "Excessive bureaucracy slowed down the distribution of emergency flood relief."
  },
  {
    id: "ow_15",
    definition: "Government or rule by the wealthiest class of people",
    word: "Plutocracy",
    pos: "noun",
    meaningBn: "ধনিকতন্ত্র",
    category: "governance_law",
    tag: "Admission Standard",
    example: "Critics argued that unregulated political lobbying had turned the nation into a plutocracy."
  },
  {
    id: "ow_16",
    definition: "Government led by religious authorities who claim divine guidance",
    word: "Theocracy",
    pos: "noun",
    meaningBn: "ধর্মতন্ত্র / পুরোহিততন্ত্র",
    category: "governance_law",
    tag: "DU Admission",
    example: "Ancient Egyptian governance was a theocracy where the Pharaoh was seen as a living deity."
  },
  {
    id: "ow_17",
    definition: "A state of absolute lawlessness and disorder due to the absence of governmental authority",
    word: "Anarchy",
    pos: "noun",
    meaningBn: "নৈরাজ্য / অরাজকতা",
    category: "governance_law",
    tag: "HSC & DU",
    example: "When the central command collapsed, the frontier region plunged into complete anarchy."
  },
  {
    id: "ow_18",
    definition: "Government run by members of the highest hereditary social class or nobility",
    word: "Aristocracy",
    pos: "noun",
    meaningBn: "অভিজাততন্ত্র",
    category: "governance_law",
    tag: "DU B-Unit",
    example: "During the French Revolution, the working citizens revolted against the entrenched aristocracy."
  },
  {
    id: "ow_19",
    definition: "Government or political control by a small privileged group of persons",
    word: "Oligarchy",
    pos: "noun",
    meaningBn: "গোষ্ঠীতন্ত্র / কতিপয়তন্ত্র",
    category: "governance_law",
    tag: "Admission Standard",
    example: "A business oligarchy exerted immense control over national commerce and export policies."
  },
  {
    id: "ow_20",
    definition: "The act of killing a king or reigning monarch",
    word: "Regicide",
    pos: "noun",
    meaningBn: "রাজহত্যা / নৃপতিবধ",
    category: "governance_law",
    tag: "DU C-Unit",
    example: "The conspirators were convicted of regicide after plotting against the king."
  },

  // Admission Favorites
  {
    id: "ow_21",
    definition: "Lasting for only a very brief, transitory period of time",
    word: "Ephemeral",
    pos: "adjective",
    meaningBn: "ক্ষণস্থায়ী / নশ্বর",
    category: "admission_favorites",
    tag: "DU Most Repeated",
    example: "Fame on social media is often ephemeral, fading as swiftly as it emerges."
  },
  {
    id: "ow_22",
    definition: "A universal solution or supposed remedy for all diseases and troubles",
    word: "Panacea",
    pos: "noun",
    meaningBn: "সর্বব্যাধিহর ওষুধ / সর্বরোগের প্রতিকার",
    category: "admission_favorites",
    tag: "HSC & DU",
    example: "Education is considered the true panacea for poverty and social inequality."
  },
  {
    id: "ow_23",
    definition: "Occurring, published, or awarded after the death of the person involved",
    word: "Posthumous",
    pos: "adjective",
    meaningBn: "মরণোত্তর",
    category: "admission_favorites",
    tag: "DU D-Unit",
    example: "He received the Bir Sreshtho award as a posthumous recognition of his supreme valor."
  },
  {
    id: "ow_24",
    definition: "Incapable of making errors or failing; completely trustworthy and faultless",
    word: "Infallible",
    pos: "adjective",
    meaningBn: "অভ্রান্ত / নির্ভুল",
    category: "admission_favorites",
    tag: "DU C/D Unit",
    example: "No human being is infallible; everyone makes errors occasionally."
  },
  {
    id: "ow_25",
    definition: "Present, appearing, or encountered everywhere at the same time",
    word: "Ubiquitous",
    pos: "adjective",
    meaningBn: "সর্বত্র বিদ্যমান / সর্বত্রগামী",
    category: "admission_favorites",
    tag: "DU Admission Top",
    example: "Smartphones and mobile internet have become ubiquitous across modern Bangladesh."
  },
  {
    id: "ow_26",
    definition: "Possessing unlimited and absolute power",
    word: "Omnipotent",
    pos: "adjective",
    meaningBn: "সর্বশক্তিমান",
    category: "admission_favorites",
    tag: "BCS & Admission",
    example: "Monarchs once foolishly imagined themselves to be omnipotent rulers of humanity."
  },
  {
    id: "ow_27",
    definition: "Knowing everything; having infinite knowledge and understanding",
    word: "Omniscient",
    pos: "adjective",
    meaningBn: "সর্বজ্ঞ",
    category: "admission_favorites",
    tag: "DU Admission",
    example: "The novel is narrated from the perspective of an omniscient storyteller."
  },
  {
    id: "ow_28",
    definition: "Generous and forgiving, especially toward a rival or someone in one's power",
    word: "Magnanimous",
    pos: "adjective",
    meaningBn: "মহানুভব / উদারচেতা",
    category: "admission_favorites",
    tag: "DU C-Unit",
    example: "He showed a magnanimous spirit by forgiving his defeated competitor."
  }
];

const IDIOMS_DATA = [
  // Person & Behavior
  {
    id: "idm_1",
    word: "A man of letters",
    definition: "A scholar, author, or highly cultivated literary person",
    meaningBn: "পণ্ডিত ব্যক্তি / সাহিত্যিক",
    category: "person_behavior",
    tag: "DU '19",
    example: "Rabindranath Tagore was an illustrious man of letters celebrated worldwide."
  },
  {
    id: "idm_2",
    word: "Apple of one's eye",
    definition: "Someone who is cherished, loved, and treasured above all others",
    meaningBn: "নয়নের মণি / অতি আদরের পাত্র",
    category: "person_behavior",
    tag: "HSC Board",
    example: "Her youngest granddaughter is the apple of her grandmother's eye."
  },
  {
    id: "idm_3",
    word: "A dark horse",
    definition: "A competitor or candidate about whom little is known, who unexpectedly wins",
    meaningBn: "অপ্রত্যাশিত বিজয়ী",
    category: "person_behavior",
    tag: "DU D-Unit",
    example: "Tanvir was a dark horse in the debate championship, beating seasoned debaters."
  },
  {
    id: "idm_4",
    word: "Black sheep",
    definition: "A disreputable, disgraceful, or nonconforming member of a family or group",
    meaningBn: "কুলাঙ্গার / পরিবারের কলঙ্ক",
    category: "person_behavior",
    tag: "HSC Board",
    example: "Despite his noble heritage, his illegal actions made him the black sheep of the family."
  },
  {
    id: "idm_5",
    word: "A wolf in sheep's clothing",
    definition: "A dangerous person pretending to be harmless, gentle, or pious",
    meaningBn: "বকধার্মিক / কপট সাধু",
    category: "person_behavior",
    tag: "Admission Standard",
    example: "Be cautious when partnering with him; he is a wolf in sheep's clothing."
  },
  {
    id: "idm_6",
    word: "Couch potato",
    definition: "A lazy person who spends excessive time sitting and watching television or screens",
    meaningBn: "অলস ও স্থূল ব্যক্তি",
    category: "person_behavior",
    tag: "HSC Board",
    example: "During the long monsoon holidays, he turned into a total couch potato."
  },

  // Governance & Law
  {
    id: "idm_7",
    word: "Red tape",
    definition: "Excessive bureaucracy, adherence to rigid official formalities and paperwork",
    meaningBn: "আমলাতান্ত্রিক দীর্ঘসূত্রতা",
    category: "governance_law",
    tag: "DU C-Unit",
    example: "The startup faced endless red tape before receiving its import license."
  },
  {
    id: "idm_8",
    word: "By and large",
    definition: "On the whole; taking everything into consideration; generally speaking",
    meaningBn: "মোটা দাগে / সাধারণত",
    category: "governance_law",
    tag: "DU D-Unit",
    example: "By and large, the new educational curriculum has received enthusiastic public support."
  },
  {
    id: "idm_9",
    word: "Tooth and nail",
    definition: "With all one's energy, power, and ferocious determination",
    meaningBn: "সর্বশক্তি দিয়ে / আপ্রাণভাবে",
    category: "governance_law",
    tag: "Admission Standard",
    example: "The community fought tooth and nail to prevent the destruction of the historic forest."
  },
  {
    id: "idm_10",
    word: "Law unto oneself",
    definition: "A person who behaves independently and refuses to obey laws or rules",
    meaningBn: "নিজের আইনে চলা / নিয়ন্ত্রণহীন",
    category: "governance_law",
    tag: "DU Admission",
    example: "The corrupt mayor acted as a law unto himself until the anti-graft bureau stepped in."
  },
  {
    id: "idm_11",
    word: "Iron will",
    definition: "Extremely strong determination that cannot be broken or deterred",
    meaningBn: "দৃঢ় সংকল্প / ইস্পাতকঠিন মনোবল",
    category: "governance_law",
    tag: "DU B-Unit",
    example: "Her iron will enabled her to overcome severe financial hardship and graduate with honors."
  },

  // Admission Favorites
  {
    id: "idm_12",
    word: "Achilles' heel",
    definition: "A weak point, flaw, or vulnerable spot in an otherwise strong entity",
    meaningBn: "দুর্বল জায়গা / অরক্ষিত স্থান",
    category: "admission_favorites",
    tag: "DU Top Pick",
    example: "English grammar was his Achilles' heel, so he practiced it diligently every morning."
  },
  {
    id: "idm_13",
    word: "Bolt from the blue",
    definition: "A completely unexpected and devastating occurrence or piece of news",
    meaningBn: "বিনা মেঘে বজ্রপাত",
    category: "admission_favorites",
    tag: "DU B/C Unit",
    example: "The sudden notice of the factory's closure was a bolt from the blue for its workers."
  },
  {
    id: "idm_14",
    word: "Bury the hatchet",
    definition: "To make peace, end a longstanding conflict, and forgive past disputes",
    meaningBn: "বিবাদ ভুলে যাওয়া / শত্রুতা মিটানো",
    category: "admission_favorites",
    tag: "HSC & DU",
    example: "After a decade of rivalry, the two brothers decided to bury the hatchet."
  },
  {
    id: "idm_15",
    word: "Burn the midnight oil",
    definition: "To work or study late into the night with great diligence",
    meaningBn: "রাত জেগে কঠোর পড়াশোনা করা",
    category: "admission_favorites",
    tag: "HSC Advice",
    example: "Admission candidates often burn the midnight oil solving previous years' question banks."
  },
  {
    id: "idm_16",
    word: "Once in a blue moon",
    definition: "Occurring very infrequently, rarely, or almost never",
    meaningBn: "কদাচিৎ / ডুমুরের ফুল",
    category: "admission_favorites",
    tag: "HSC & DU",
    example: "Living in London, he visits his ancestral village in Sylhet only once in a blue moon."
  },
  {
    id: "idm_17",
    word: "At a stone's throw",
    definition: "Situated at a very short distance; extremely close by",
    meaningBn: "অতি সন্নিকটে / খুব কাছে",
    category: "admission_favorites",
    tag: "DU C-Unit",
    example: "Her university hall is located at a stone's throw from the Central Library."
  },
  {
    id: "idm_18",
    word: "Crocodile tears",
    definition: "False, hypocritical, or insincere expressions of sorrow and grief",
    meaningBn: "মায়াকান্না / ভণ্ড শোক",
    category: "admission_favorites",
    tag: "Admission Standard",
    example: "Do not be swayed by his crocodile tears; he has no genuine remorse."
  },
  {
    id: "idm_19",
    word: "Spill the beans",
    definition: "To reveal secret or confidential information prematurely or indiscreetly",
    meaningBn: "গোপন তথ্য ফাঁস করে দেওয়া",
    category: "admission_favorites",
    tag: "DU D-Unit",
    example: "We planned a surprise birthday party, but her little brother spilled the beans."
  },
  {
    id: "idm_20",
    word: "Through thick and thin",
    definition: "Supporting someone under all circumstances, through good times and adversity",
    meaningBn: "সুখে-দুঃখে সর্বদা পাশে থাকা",
    category: "admission_favorites",
    tag: "DU B-Unit",
    example: "True friends stay beside you through thick and thin."
  },
  {
    id: "idm_21",
    word: "Cock and bull story",
    definition: "A completely fanciful, improbable, and fabricated excuse or tale",
    meaningBn: "আজগুবি গল্প / আষাঢ়ে গল্প",
    category: "admission_favorites",
    tag: "DU Admission",
    example: "Nobody believed his cock and bull story about an alien stealing his homework."
  },
  {
    id: "idm_22",
    word: "Burn the candle at both ends",
    definition: "To exhaust oneself by doing too much and not resting enough",
    meaningBn: "অতিরিক্ত পরিশ্রমে নিজেকে নিঃশেষ করা",
    category: "admission_favorites",
    tag: "Admission Standard",
    example: "Working two jobs while studying for the BCS exam is burning the candle at both ends."
  },
  {
    id: "idm_23",
    word: "Read between the lines",
    definition: "To perceive a hidden meaning or unspoken truth that is not directly stated",
    meaningBn: "গূঢ় অর্থ উপলব্ধি করা",
    category: "admission_favorites",
    tag: "DU C/D Unit",
    example: "Reading between the lines of the diplomat's speech, it was clear war had been averted."
  },
  {
    id: "idm_24",
    word: "Kith and kin",
    definition: "One's relatives, friends, and close family members",
    meaningBn: "নিকটাত্মীয় ও বন্ধুজন",
    category: "admission_favorites",
    tag: "HSC Board",
    example: "During Eid, millions of people travel to celebrate together with their kith and kin."
  },
  {
    id: "idm_25",
    word: "To nip in the bud",
    definition: "To stop a problem or bad habit right at its earliest beginning before it develops",
    meaningBn: "অঙ্কুরেই বিনষ্ট করা",
    category: "admission_favorites",
    tag: "DU Top Pick",
    example: "Teachers should nip disciplinary misconduct in the bud before it escalates."
  }
];

const ROOT_WORDS_DATA = {
  bene: {
    id: "bene",
    root: "bene / bon",
    origin: "Latin",
    meaning: "Well, good (ভালো / মঙ্গলজনক)",
    words: [
      {
        word: "Benefactor",
        breakdown: { prefix: "", root: "bene", suffix: "factor" },
        pos: "noun",
        meaningBn: "উপকারী ব্যক্তি / হিতৈষী দাতা",
        definition: "A person who gives money or other help to a person or cause",
        example: "The anonymous benefactor funded scholarships for twenty students."
      },
      {
        word: "Beneficial",
        breakdown: { prefix: "", root: "bene", suffix: "ficial" },
        pos: "adjective",
        meaningBn: "উপকারী / ফলপ্রসূ",
        definition: "Resulting in good; having a helpful or advantageous effect",
        example: "Daily exercise is immensely beneficial for mental health."
      },
      {
        word: "Benevolent",
        breakdown: { prefix: "", root: "bene", suffix: "volent" },
        pos: "adjective",
        meaningBn: "দয়ালু / সহানুভূতিশীল",
        definition: "Well-meaning, kindly, and charitable toward others",
        example: "The benevolent doctor treated impoverished villagers free of cost."
      },
      {
        word: "Benediction",
        breakdown: { prefix: "", root: "bene", suffix: "diction" },
        pos: "noun",
        meaningBn: "আশীর্বাদ / শুভকামনা",
        definition: "The utterance of a blessing, especially at the end of a service",
        example: "The grandfather placed his hand on the child in silent benediction."
      },
      {
        word: "Beneficiary",
        breakdown: { prefix: "", root: "bene", suffix: "ficiary" },
        pos: "noun",
        meaningBn: "সুবিধাভোগী / উত্তরাধিকারী",
        definition: "A person who derives advantage from something, such as a trust",
        example: "She was the sole beneficiary named in her uncle's estate."
      },
      {
        word: "Benefit",
        breakdown: { prefix: "", root: "bene", suffix: "fit" },
        pos: "noun",
        meaningBn: "সুবিধা / কল্যাণ",
        definition: "An advantage or profit gained from something",
        example: "The greatest benefit of reading is gaining broader perspectives."
      },
      {
        word: "Benign",
        breakdown: { prefix: "", root: "ben", suffix: "ign" },
        pos: "adjective",
        meaningBn: "নিরপরাধ / অক্ষতিকর (টিউমার ইত্যাদি)",
        definition: "Gentle, kindly; in medicine, not harmful or malignant in effect",
        example: "The biopsy confirmed that the growth was completely benign."
      },
      {
        word: "Bonus",
        breakdown: { prefix: "", root: "bon", suffix: "us" },
        pos: "noun",
        meaningBn: "অতিরিক্ত পারিতোষিক / বোনাস",
        definition: "An extra sum given to an employee beyond normal compensation",
        example: "Employees received a festive bonus before the Eid holidays."
      }
    ]
  },
  mal: {
    id: "mal",
    root: "mal / male",
    origin: "Latin",
    meaning: "Bad, evil, ill (খারাপ / মন্দ / অপকার)",
    words: [
      {
        word: "Malefactor",
        breakdown: { prefix: "", root: "male", suffix: "factor" },
        pos: "noun",
        meaningBn: "অপরাধী / দুষ্কৃতকারী",
        definition: "A person who commits a crime or some other wrong",
        example: "The police apprehended the notorious malefactor at the border."
      },
      {
        word: "Malevolent",
        breakdown: { prefix: "", root: "male", suffix: "volent" },
        pos: "adjective",
        meaningBn: "বিদ্বেষপূর্ণ / অহিতকামী",
        definition: "Having or showing a wish to do evil or harm to others",
        example: "The villain cast a malevolent glare toward his captive."
      },
      {
        word: "Malnutrition",
        breakdown: { prefix: "mal", root: "nutrit", suffix: "ion" },
        pos: "noun",
        meaningBn: "অপুষ্টি",
        definition: "Lack of proper nutrition caused by an inadequate diet",
        example: "The relief team distributed fortified milk to combat infant malnutrition."
      },
      {
        word: "Malicious",
        breakdown: { prefix: "", root: "mal", suffix: "icious" },
        pos: "adjective",
        meaningBn: "কুচক্রী / বিদ্বেষপরায়ণ",
        definition: "Characterized by malice; intending or intended to do harm",
        example: "He spread malicious rumors to damage his rival's campaign."
      },
      {
        word: "Malignant",
        breakdown: { prefix: "", root: "mal", suffix: "ignant" },
        pos: "adjective",
        meaningBn: "মারাত্মক / ক্ষতিকারক (ক্যান্সারযুক্ত)",
        definition: "Malevolent; in medicine, very virulent or infectious and cancerous",
        example: "Doctors surgically removed the malignant tumor immediately."
      },
      {
        word: "Malediction",
        breakdown: { prefix: "", root: "male", suffix: "diction" },
        pos: "noun",
        meaningBn: "অভিশাপ / অপবাক্য",
        definition: "A magical word or phrase uttered with the intention of bringing about evil",
        example: "The sorcerer muttered a dark malediction upon the encroaching army."
      },
      {
        word: "Malfunction",
        breakdown: { prefix: "mal", root: "funct", suffix: "ion" },
        pos: "noun",
        meaningBn: "যান্ত্রিক ত্রুটি / অকার্যকারিতা",
        definition: "Failure to function normally or satisfactorily",
        example: "A minor computer malfunction caused the temporary server outage."
      },
      {
        word: "Malady",
        breakdown: { prefix: "", root: "mal", suffix: "ady" },
        pos: "noun",
        meaningBn: "রোগ / ব্যাধি",
        definition: "A disease, illness, or serious ingrained problem",
        example: "Corruption is a grave malady that hinders national progress."
      }
    ]
  },
  spect: {
    id: "spect",
    root: "spect / spec / spic",
    origin: "Latin",
    meaning: "To see, look, observe (দেখা / পর্যবেক্ষণ করা)",
    words: [
      {
        word: "Spectator",
        breakdown: { prefix: "", root: "spect", suffix: "ator" },
        pos: "noun",
        meaningBn: "দর্শক / প্রত্যক্ষদর্শী",
        definition: "A person who watches at a show, match, or public event",
        example: "Over thirty thousand spectators cheered at the Mirpur stadium."
      },
      {
        word: "Inspect",
        breakdown: { prefix: "in", root: "spect", suffix: "" },
        pos: "verb",
        meaningBn: "পরিদর্শন করা / নিবিড় পর্যবেক্ষণ করা",
        definition: "Look at closely, typically to assess condition or discover shortcomings",
        example: "The magistrate arrived to inspect the construction quality of the bridge."
      },
      {
        word: "Introspection",
        breakdown: { prefix: "intro", root: "spect", suffix: "ion" },
        pos: "noun",
        meaningBn: "আত্মদর্শন / নিজের মন বিশ্লেষণ",
        definition: "The examination or observation of one's own mental and emotional processes",
        example: "Quiet solitude provides time for fruitful personal introspection."
      },
      {
        word: "Retrospect",
        breakdown: { prefix: "retro", root: "spect", suffix: "" },
        pos: "noun",
        meaningBn: "অতীতের পর্যালোচনা / পেছনের দিকে তাকানো",
        definition: "A survey or review of a past course of events or period of time",
        example: "In retrospect, her bold decision proved to be completely correct."
      },
      {
        word: "Prospect",
        breakdown: { prefix: "pro", root: "spect", suffix: "" },
        pos: "noun",
        meaningBn: "ভবিষ্যতের সম্ভাবনা / পূর্বাভাস",
        definition: "The possibility or likelihood of some future event occurring",
        example: "The job offer presented exciting career prospects for the young graduate."
      },
      {
        word: "Circumspect",
        breakdown: { prefix: "circum", root: "spect", suffix: "" },
        pos: "adjective",
        meaningBn: "সতর্ক / চারপাশ দেখে চলা",
        definition: "Wary and unwilling to take risks; prudently cautious",
        example: "In legal matters, it is always wise to be thoroughly circumspect."
      },
      {
        word: "Conspicuous",
        breakdown: { prefix: "con", root: "spicu", suffix: "ous" },
        pos: "adjective",
        meaningBn: "স্পষ্টভাবে দৃষ্টিগোচর / সহজে চোখে পড়ে এমন",
        definition: "Standing out so as to be clearly visible; attracting attention",
        example: "His absence from the crucial board meeting was conspicuous."
      },
      {
        word: "Spectacle",
        breakdown: { prefix: "", root: "spect", suffix: "acle" },
        pos: "noun",
        meaningBn: "দর্শনীয় দৃশ্য / চমকপ্রদ প্রদর্শনী",
        definition: "A visually striking performance or display",
        example: "The Pahela Baishakh parade was a vibrant cultural spectacle."
      }
    ]
  },
  chron: {
    id: "chron",
    root: "chron / chrono",
    origin: "Greek",
    meaning: "Time (সময় / কাল)",
    words: [
      {
        word: "Chronological",
        breakdown: { prefix: "", root: "chrono", suffix: "logical" },
        pos: "adjective",
        meaningBn: "কালানুক্রমিক / সময়ভিত্তিক সাজানো",
        definition: "Starting with the earliest and following the order in which they occurred",
        example: "The history book lists the events of the Liberation War in chronological order."
      },
      {
        word: "Chronic",
        breakdown: { prefix: "", root: "chron", suffix: "ic" },
        pos: "adjective",
        meaningBn: "দীর্ঘস্থায়ী / পুরাতন (রোগ ইত্যাদি)",
        definition: "Persisting for a long time or constantly recurring",
        example: "He suffers from chronic asthma that flares up during the dusty winter."
      },
      {
        word: "Synchronize",
        breakdown: { prefix: "syn", root: "chron", suffix: "ize" },
        pos: "verb",
        meaningBn: "একই সময়ে ঘটানো / সময় মিলিয়ে নেওয়া",
        definition: "Cause to occur or operate at the same time or rate",
        example: "The pilots synchronized their wristwatches before commencing the flight."
      },
      {
        word: "Anachronism",
        breakdown: { prefix: "ana", root: "chron", suffix: "ism" },
        pos: "noun",
        meaningBn: "কালবৈষম্য / সময়ের সাথে অমিল এমন কিছু",
        definition: "A thing belonging or appropriate to a period other than that in which it exists",
        example: "Using a typewriter in a modern computer laboratory seemed like an anachronism."
      },
      {
        word: "Chronicle",
        breakdown: { prefix: "", root: "chron", suffix: "icle" },
        pos: "noun",
        meaningBn: "ইতিবৃত্ত / কালপঞ্জি",
        definition: "A factual written account of important or historical events in order of time",
        example: "The journalist's memoirs chronicle the evolution of Dhaka over fifty years."
      },
      {
        word: "Chronometer",
        breakdown: { prefix: "", root: "chrono", suffix: "meter" },
        pos: "noun",
        meaningBn: "নিখুঁত সময় পরিমাপক যন্ত্র",
        definition: "An instrument for measuring time accurately, especially at sea",
        example: "Sailors once depended on the ship's chronometer to calculate longitude."
      },
      {
        word: "Asynchronous",
        breakdown: { prefix: "a", root: "synchron", suffix: "ous" },
        pos: "adjective",
        meaningBn: "অসমকালীন / আলাদা সময়ে ঘটা",
        definition: "Not existing or occurring at the same time",
        example: "The online course offers asynchronous recorded lectures for busy students."
      },
      {
        word: "Chronobiology",
        breakdown: { prefix: "", root: "chrono", suffix: "biology" },
        pos: "noun",
        meaningBn: "জীবদেহের জৈবিক ঘড়ি সংক্রান্ত বিজ্ঞান",
        definition: "The branch of physiology concerned with natural cyclical time rhythms",
        example: "Chronobiology explains why jet lag disrupts our natural sleep patterns."
      }
    ]
  },
  dict: {
    id: "dict",
    root: "dict / dic",
    origin: "Latin",
    meaning: "To say, tell, proclaim (বলা / ঘোষণা করা / নির্দেশ)",
    words: [
      {
        word: "Predict",
        breakdown: { prefix: "pre", root: "dict", suffix: "" },
        pos: "verb",
        meaningBn: "ভবিষ্যদ্বাণী করা / পূর্বাভাস দেওয়া",
        definition: "Say or estimate that a specified thing will happen in the future",
        example: "Meteorologists predict heavy rainfall over Chittagong division."
      },
      {
        word: "Dictator",
        breakdown: { prefix: "", root: "dict", suffix: "ator" },
        pos: "noun",
        meaningBn: "একনায়ক / স্বৈরশাসক",
        definition: "A ruler with total power over a country, typically one who has obtained it by force",
        example: "The dictator censored all free newspapers and television broadcasts."
      },
      {
        word: "Verdict",
        breakdown: { prefix: "ver", root: "dict", suffix: "" },
        pos: "noun",
        meaningBn: "রায় / আদালতের চূড়ান্ত সিদ্ধান্ত",
        definition: "A decision on an issue of fact in a civil or criminal case",
        example: "The jury delivered a unanimous verdict of innocent."
      },
      {
        word: "Contradict",
        breakdown: { prefix: "contra", root: "dict", suffix: "" },
        pos: "verb",
        meaningBn: "পরস্পরবিরোধী কথা বলা / খণ্ডন করা",
        definition: "Deny the truth of a statement by asserting the opposite",
        example: "Witnesses gave statements that contradicted the suspect's alibi."
      },
      {
        word: "Edict",
        breakdown: { prefix: "e", root: "dict", suffix: "" },
        pos: "noun",
        meaningBn: "সরকারি ফরমান / অনুশাসন",
        definition: "An official order or proclamation issued by a person in authority",
        example: "The emperor issued a royal edict banning illegal deforestation."
      },
      {
        word: "Diction",
        breakdown: { prefix: "", root: "dict", suffix: "ion" },
        pos: "noun",
        meaningBn: "শব্দচয়ন / বাচনভঙ্গি",
        definition: "The choice and use of words and phrases in speech or writing",
        example: "The orator's clear diction captivated the entire auditorium."
      },
      {
        word: "Indict",
        breakdown: { prefix: "in", root: "dict", suffix: "" },
        pos: "verb",
        meaningBn: "আনুষ্ঠানিকভাবে অভিযুক্ত করা",
        definition: "Formally accuse of or charge with a serious crime",
        example: "The grand jury voted to indict the fraudulent company officials."
      },
      {
        word: "Addict",
        breakdown: { prefix: "ad", root: "dict", suffix: "" },
        pos: "noun",
        meaningBn: "আসক্ত ব্যক্তি",
        definition: "A person who is addicted to a particular substance, thing, or activity",
        example: "Video game addicts can lose track of time and neglect study routines."
      }
    ]
  },
  graph: {
    id: "graph",
    root: "graph / gram",
    origin: "Greek",
    meaning: "To write, draw, record (লেখা / অঙ্কন করা / লিপিবদ্ধ করা)",
    words: [
      {
        word: "Biography",
        breakdown: { prefix: "bio", root: "graph", suffix: "y" },
        pos: "noun",
        meaningBn: "জীবনীগ্রন্থ",
        definition: "An account of someone's life written by someone else",
        example: "He authored an inspiring biography of the visionary scientist."
      },
      {
        word: "Autobiography",
        breakdown: { prefix: "auto-bio", root: "graph", suffix: "y" },
        pos: "noun",
        meaningBn: "আত্মজীবনী",
        definition: "An account of a person's life written by that person",
        example: "The Unfinished Memoirs is the celebrated autobiography of Bangabandhu."
      },
      {
        word: "Calligraphy",
        breakdown: { prefix: "calli", root: "graph", suffix: "y" },
        pos: "noun",
        meaningBn: "চারুলিপি / সুন্দর হস্তলিপি",
        definition: "Decorative handwriting or handwritten lettering of aesthetic beauty",
        example: "Islamic calligraphy adorned the historic archways of the ancient mosque."
      },
      {
        word: "Telegram",
        breakdown: { prefix: "tele", root: "gram", suffix: "" },
        pos: "noun",
        meaningBn: "তারবার্তা",
        definition: "A message sent by telegraph and then delivered in written form",
        example: "Decades ago, urgent family news arrived by telegram."
      },
      {
        word: "Orthography",
        breakdown: { prefix: "ortho", root: "graph", suffix: "y" },
        pos: "noun",
        meaningBn: "সঠিক বানানরীতি / বর্ণবিন্যাস বিদ্যা",
        definition: "The conventional spelling system of a language",
        example: "Standard Bangla orthography was reformed by the Bangla Academy."
      },
      {
        word: "Bibliography",
        breakdown: { prefix: "biblio", root: "graph", suffix: "y" },
        pos: "noun",
        meaningBn: "গ্রন্থপঞ্জি / সহায়ক বইয়ের তালিকা",
        definition: "A list of the books referred to in a scholarly work",
        example: "Remember to attach an alphabetical bibliography at the end of your research paper."
      },
      {
        word: "Graphology",
        breakdown: { prefix: "", root: "graph", suffix: "ology" },
        pos: "noun",
        meaningBn: "হস্তরেখা ও হস্তলিপি বিশ্লেষণ বিদ্যা",
        definition: "The study of handwriting, especially as a clue to character",
        example: "Graphology is sometimes studied by forensic document investigators."
      },
      {
        word: "Paragraph",
        breakdown: { prefix: "para", root: "graph", suffix: "" },
        pos: "noun",
        meaningBn: "অনুচ্ছেদ",
        definition: "A distinct section of a piece of writing, usually dealing with a single theme",
        example: "Write a coherent paragraph explaining the impact of climate change."
      }
    ]
  }
};

const DECODER_PRESETS = [
  { prefix: "bene", root: "dict", suffix: "ion", word: "Benediction", meaningBn: "আশীর্বাদ / শুভকামনা", pos: "noun", example: "The elder whispered a heartfelt benediction." },
  { prefix: "mal", root: "dict", suffix: "ion", word: "Malediction", meaningBn: "অভিশাপ / অপবাক্য", pos: "noun", example: "He uttered a desperate malediction upon his foes." },
  { prefix: "intro", root: "spect", suffix: "ion", word: "Introspection", meaningBn: "আত্মদর্শন / নিজের মন বিশ্লেষণ", pos: "noun", example: "Self-improvement begins with honest introspection." },
  { prefix: "retro", root: "spect", suffix: "ive", word: "Retrospective", meaningBn: "অতীতমুখী / পেছনের ঘটনার মূল্যায়ন", pos: "adjective", example: "The gallery hosted a retrospective exhibition of Zainul Abedin." },
  { prefix: "chrono", root: "log", suffix: "ical", word: "Chronological", meaningBn: "কালানুক্রমিক", pos: "adjective", example: "Events were arranged in strict chronological order." },
  { prefix: "bene", root: "fact", suffix: "or", word: "Benefactor", meaningBn: "উপকারী ব্যক্তি / দানশীল", pos: "noun", example: "The hospital ward was funded by a kind benefactor." },
  { prefix: "mal", root: "fact", suffix: "or", word: "Malefactor", meaningBn: "অপরাধী / দুষ্কৃতকারী", pos: "noun", example: "Justice caught up with the persistent malefactor." },
  { prefix: "pre", root: "dict", suffix: "able", word: "Predictable", meaningBn: "পূর্বানুমানযোগ্য", pos: "adjective", example: "Monsoon storms in June are quite predictable." },
  { prefix: "auto", root: "bio", suffix: "graphy", word: "Autobiography", meaningBn: "আত্মজীবনী", pos: "noun", example: "He published his candid autobiography last year." },
  { prefix: "omni", root: "sci", suffix: "ent", word: "Omniscient", meaningBn: "সর্বজ্ঞানী", pos: "adjective", example: "The story uses an omniscient third-person narrator." }
];

const VOICE_PRACTICE_WORDS = [
  {
    id: "vp_1",
    word: "Entrepreneur",
    ipa: "/ˌɒn.trə.prəˈnɜːr/",
    syllables: "en - tre - pre - NEUR",
    syllablesBn: "অন্-ট্রাপ্রা-নার",
    stressTip: "Primary stress on 4th syllable (-NEUR). French origin.",
    meaningBn: "উদ্যোক্তা / ব্যবসায়ী",
    example: "A successful tech entrepreneur founded bKash to democratize payments."
  },
  {
    id: "vp_2",
    word: "Ephemeral",
    ipa: "/ɪˈfem.ər.əl/",
    syllables: "e - PHEM - er - al",
    syllablesBn: "ই-ফেম-অ্যার-আল",
    stressTip: 'Stress the second syllable (PHEM). Do not pronounce as "e-fe-me-ral".',
    meaningBn: "ক্ষণস্থায়ী / স্বল্পকালীন",
    example: "Morning dew on winter grass is utterly ephemeral."
  },
  {
    id: "vp_3",
    word: "Lieutenant",
    ipa: "/lefˈten.ənt/ (UK) / /luːˈten.ənt/ (US)",
    syllables: "lef - TEN - ant (UK) / loo - TEN - ant (US)",
    syllablesBn: "লেফ-টেন-অ্যান্ট (UK) / লু-টেন-অ্যান্ট (US)",
    stressTip: 'In British English, "lieu-" is pronounced "lef-". Stress the 2nd syllable.',
    meaningBn: "সামরিক পদবী (লেফটেন্যান্ট)",
    example: "The young lieutenant led his battalion with bravery and distinction."
  },
  {
    id: "vp_4",
    word: "Conscientious",
    ipa: "/ˌkɒn.ʃiˈen.ʃəs/",
    syllables: "con - sci - EN - tious",
    syllablesBn: "কন-শি-এন-শাস",
    stressTip: 'Stress on the 3rd syllable (-EN-). Ending sounds like "-shus".',
    meaningBn: "বিবেকবান / অত্যন্ত দায়িত্বশীল",
    example: "A conscientious student never leaves exam preparation to the last night."
  },
  {
    id: "vp_5",
    word: "Ubiquitous",
    ipa: "/juːˈbɪk.wɪ.təs/",
    syllables: "u - BIQ - ui - tous",
    syllablesBn: "ইউ-বিক-উই-টাস",
    stressTip: 'Stress the 2nd syllable (BIQ). First "u" sounds like "you".',
    meaningBn: "সর্বত্র বিদ্যমান / সর্বত্রগামী",
    example: "Mobile smartphones have become ubiquitous in daily city life."
  },
  {
    id: "vp_6",
    word: "Hierarchy",
    ipa: "/ˈhaɪə.rɑː.ki/",
    syllables: "HI - er - ar - chy",
    syllablesBn: "হাই-আ-রার-কি",
    stressTip: 'Stress the 1st syllable (HI-). The "ch" sounds like "k", not "ch".',
    meaningBn: "পদমর্যাদা ক্রম / শ্রেণিবিন্যাস",
    example: "The army maintains a disciplined command hierarchy."
  },
  {
    id: "vp_7",
    word: "Miscellaneous",
    ipa: "/ˌmɪs.əlˈeɪ.ni.əs/",
    syllables: "mis - cel - LA - ne - ous",
    syllablesBn: "মিস-এ-লেই-নি-আস",
    stressTip: "Primary stress on 3rd syllable (-LA-).",
    meaningBn: "বিবিধ / নানা রকম বিষয়",
    example: "The final section of the ledger contained miscellaneous expenses."
  },
  {
    id: "vp_8",
    word: "Renaissance",
    ipa: "/rəˈneɪ.səns/",
    syllables: "re - NAIS - sance",
    syllablesBn: "রেনে-সঁ / রি-নেই-সান্‌স",
    stressTip: "Second syllable stressed. French nasal resonance.",
    meaningBn: "নবজাগরণ / সাংস্কৃতিক পুনর্জাগরণ",
    example: "The Bengal Renaissance birthed monumental progress in literature."
  },
  {
    id: "vp_9",
    word: "Exaggerate",
    ipa: "/ɪɡˈzædʒ.ə.reɪt/",
    syllables: "ex - AG - ger - ate",
    syllablesBn: "ইগ-জ্যাজ-আ-রেইট",
    stressTip: 'Stress the 2nd syllable (-AG-). The "gg" sounds like "j".',
    meaningBn: "অতিরঞ্জিত করা / বাড়িয়ে বলা",
    example: "Fishermen often humorously exaggerate the size of the catch."
  },
  {
    id: "vp_10",
    word: "Sovereignty",
    ipa: "/ˈsɒv.rɪn.ti/",
    syllables: "SOV - er - eign - ty",
    syllablesBn: "সভ-রিন-টি",
    stressTip: 'Stress the 1st syllable (SOV-). "eign" sounds like "in" with silent g.',
    meaningBn: "সার্বভৌমত্ব / পরম কর্তৃত্ব",
    example: "The nation defended its territorial sovereignty with valor."
  },
  {
    id: "vp_11",
    word: "Hyperbole",
    ipa: "/haɪˈpɜː.bəl.i/",
    syllables: "hy - PER - bo - le",
    syllablesBn: "হাই-পার-বা-লি",
    stressTip: 'Stress the 2nd syllable (-PER-). Do NOT pronounce like "hyper-bowl".',
    meaningBn: "অতিশয়োক্তি / অলংকার",
    example: "Saying 'I am so hungry I could eat an elephant' is pure hyperbole."
  },
  {
    id: "vp_12",
    word: "Paradigm",
    ipa: "/ˈpær.ə.daɪm/",
    syllables: "PAR - a - digm",
    syllablesBn: "প্যারা-ডাইম",
    stressTip: 'Stress 1st syllable (PAR-). The "g" is completely silent.',
    meaningBn: "দৃষ্টান্ত / মূল কাঠামো / আদর্শ মডেল",
    example: "Artificial intelligence represents a new paradigm in education."
  }
];

// Levenshtein similarity calculation
function getLevenshteinDistance(s1, s2) {
  const a = String(s1 || "").toLowerCase().trim();
  const b = String(s2 || "").toLowerCase().trim();
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const row = [];
  for (let i = 0; i <= b.length; i++) {
    row[i] = i;
  }

  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      let val;
      if (a[i - 1] === b[j - 1]) {
        val = row[j - 1];
      } else {
        val = Math.min(row[j - 1] + 1, prev + 1, row[j] + 1);
      }
      row[j - 1] = prev;
      prev = val;
    }
    row[b.length] = prev;
  }
  return row[b.length];
}

function calculatePronunciationAccuracy(target, recognized) {
  const t = String(target || "").toLowerCase().trim().replace(/[^a-z]/g, "");
  const r = String(recognized || "").toLowerCase().trim().replace(/[^a-z]/g, "");
  if (!t || !r) return 0;
  if (t === r) return 100;
  const dist = getLevenshteinDistance(t, r);
  const maxLen = Math.max(t.length, r.length);
  const acc = Math.max(0, Math.round((1 - dist / maxLen) * 100));
  return acc;
}

// Global state for Tools Page
const ToolsState = {
  activeTab: "one-word", // 'one-word' | 'roots' | 'voice'
  oneWordSubTab: "one-word", // 'one-word' | 'idioms'
  category: "all", // 'all' | 'person_behavior' | 'governance_law' | 'admission_favorites'
  searchQuery: "",
  selfTestMode: false,
  revealedIds: new Set(),
  selectedRootId: "bene",
  decoderPrefix: "bene",
  decoderRoot: "dict",
  decoderSuffix: "ion",
  voiceWordIndex: 0,
  isRecording: false,
  lastTranscript: "",
  lastAccuracy: null,
  recognitionInstance: null
};

function switchToolsTab(tabId) {
  ToolsState.activeTab = tabId;
  renderToolsPage();
}

function switchOneWordSubTab(subTab) {
  ToolsState.oneWordSubTab = subTab;
  renderToolsPage();
}

function filterOneWordCategory(category) {
  ToolsState.category = category;
  renderToolsPage();
}

function searchOneWordAndIdioms(query) {
  ToolsState.searchQuery = String(query || "").trim().toLowerCase();
  renderToolsPage();
}

function toggleSelfTestMode(enable) {
  ToolsState.selfTestMode = Boolean(enable);
  if (!ToolsState.selfTestMode) {
    ToolsState.revealedIds.clear();
  }
  renderToolsPage();
}

function toggleRevealCard(cardId) {
  if (ToolsState.revealedIds.has(cardId)) {
    ToolsState.revealedIds.delete(cardId);
  } else {
    ToolsState.revealedIds.add(cardId);
  }
  renderToolsPage();
}

function selectRootWord(rootId) {
  if (ROOT_WORDS_DATA[rootId]) {
    ToolsState.selectedRootId = rootId;
    renderToolsPage();
  }
}

function decodeWordEquation(prefix, root, suffix) {
  ToolsState.decoderPrefix = prefix;
  ToolsState.decoderRoot = root;
  ToolsState.decoderSuffix = suffix;
  renderToolsPage();
}

function selectVoiceWord(index) {
  if (index >= 0 && index < VOICE_PRACTICE_WORDS.length) {
    ToolsState.voiceWordIndex = index;
    ToolsState.lastTranscript = "";
    ToolsState.lastAccuracy = null;
    renderToolsPage();
  }
}

function startVoiceRecognition() {
  if (typeof window === "undefined") return;
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const currentWord = VOICE_PRACTICE_WORDS[ToolsState.voiceWordIndex];

  if (!SpeechRec) {
    simulateVoicePractice(currentWord.word);
    return;
  }

  try {
    const recognition = new SpeechRec();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    ToolsState.isRecording = true;
    ToolsState.recognitionInstance = recognition;
    renderToolsPage();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const accuracy = calculatePronunciationAccuracy(currentWord.word, transcript);
      ToolsState.isRecording = false;
      ToolsState.lastTranscript = transcript;
      ToolsState.lastAccuracy = accuracy;
      renderToolsPage();
    };

    recognition.onerror = (err) => {
      console.warn("SpeechRecognition error:", err);
      ToolsState.isRecording = false;
      simulateVoicePractice(currentWord.word);
    };

    recognition.onend = () => {
      ToolsState.isRecording = false;
      renderToolsPage();
    };

    recognition.start();
  } catch (e) {
    console.warn("Could not start recognition:", e);
    ToolsState.isRecording = false;
    simulateVoicePractice(currentWord.word);
  }
}

function stopVoiceRecognition() {
  if (ToolsState.recognitionInstance) {
    try {
      ToolsState.recognitionInstance.stop();
    } catch (e) {}
  }
  ToolsState.isRecording = false;
  renderToolsPage();
}

function simulateVoicePractice(spokenWord) {
  const currentWord = VOICE_PRACTICE_WORDS[ToolsState.voiceWordIndex];
  const simulated = spokenWord || currentWord.word;
  const accuracy = calculatePronunciationAccuracy(currentWord.word, simulated);
  ToolsState.isRecording = false;
  ToolsState.lastTranscript = simulated;
  ToolsState.lastAccuracy = accuracy;
  if (typeof showToast === "function") {
    showToast(`🎙️ Voice Practice: Heard "${simulated}" (${accuracy}% Match)`, "info");
  }
  renderToolsPage();
}

function renderToolsPage() {
  const mount = document.getElementById("tools-page-mount");
  if (!mount) return;

  const activeTab = ToolsState.activeTab;

  mount.innerHTML = `
    <div class="space-y-8 sm:space-y-10">

      <!-- HERO BANNER -->
      <section class="vw-editorial-card p-6 sm:p-8 rounded-3xl border bg-gradient-to-br from-[#FAF8F5] to-[#EEF4F1] dark:from-gray-900 dark:to-gray-800" style="border-color: var(--border-subtle);">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold" style="background-color: var(--accent-sage-soft); color: var(--accent-sage);">
              <span>🧠 Smart Learning Tools</span>
              <span>&bull;</span>
              <span class="font-bengali">অ্যাডমিশন ও বিসিএস স্পেশাল টুলস</span>
            </div>
            <h1 class="font-editorial text-2xl sm:text-4xl font-bold tracking-tight" style="color: var(--ink-primary);">
              Master Vocabulary with Smart Tools
            </h1>
            <p class="font-bengali text-sm sm:text-base max-w-2xl" style="color: var(--ink-secondary);">
              এককথায় প্রকাশ ও ইডিয়মস, শব্দমূল (Root Words) ডিকোডার এবং উচ্চারণ যাচাইয়ের আধুনিক লার্নিং টুলস।
            </p>
          </div>

          <!-- Main 3 Tab Switcher Buttons (Pill Bar) -->
          <div class="flex flex-wrap sm:flex-nowrap items-center p-1.5 rounded-2xl border bg-white/70 dark:bg-gray-800/80 shadow-xs" style="border-color: var(--border-subtle);">
            <button
              type="button"
              onclick="switchToolsTab('one-word')"
              class="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'one-word' ? 'bg-[#2D5A4C] text-white shadow-xs' : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
              }"
            >
              <span>1️⃣</span>
              <span>One-Word &amp; Idioms</span>
            </button>
            <button
              type="button"
              onclick="switchToolsTab('roots')"
              class="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'roots' ? 'bg-[#2D5A4C] text-white shadow-xs' : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
              }"
            >
              <span>2️⃣</span>
              <span>Root Words Decoder</span>
            </button>
            <button
              type="button"
              onclick="switchToolsTab('voice')"
              class="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'voice' ? 'bg-[#2D5A4C] text-white shadow-xs' : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
              }"
            >
              <span>3️⃣</span>
              <span>Voice Pronunciation</span>
            </button>
          </div>
        </div>
      </section>

      <!-- TAB 1: ONE-WORD SUBSTITUTION & IDIOMS/PHRASES -->
      ${activeTab === 'one-word' ? renderOneWordSectionHTML() : ''}

      <!-- TAB 2: ROOT WORDS, PREFIX & SUFFIX BREAKDOWN -->
      ${activeTab === 'roots' ? renderRootsSectionHTML() : ''}

      <!-- TAB 3: VOICE PRONUNCIATION PRACTICE -->
      ${activeTab === 'voice' ? renderVoiceSectionHTML() : ''}

    </div>
  `;
}

function renderOneWordSectionHTML() {
  const isIdioms = ToolsState.oneWordSubTab === 'idioms';
  const rawList = isIdioms ? IDIOMS_DATA : ONE_WORD_DATA;
  const cat = ToolsState.category;
  const q = ToolsState.searchQuery;
  const selfTest = ToolsState.selfTestMode;

  const filtered = rawList.filter((item) => {
    if (cat !== 'all' && item.category !== cat) return false;
    if (q) {
      const matchWord = (item.word || '').toLowerCase().includes(q);
      const matchDef = (item.definition || '').toLowerCase().includes(q);
      const matchBn = (item.meaningBn || '').toLowerCase().includes(q);
      if (!matchWord && !matchDef && !matchBn) return false;
    }
    return true;
  });

  return `
    <section class="vw-editorial-card p-6 sm:p-8 rounded-3xl border space-y-6" style="background-color: var(--surface-white); border-color: var(--border-subtle);">
      
      <!-- Top Sub-Nav & Controls Bar -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b" style="border-color: var(--border-subtle);">
        
        <!-- Toggle: One-Word vs Idioms -->
        <div class="flex items-center p-1 rounded-xl border bg-gray-100 dark:bg-gray-800" style="border-color: var(--border-subtle);">
          <button
            type="button"
            onclick="switchOneWordSubTab('one-word')"
            class="px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              !isIdioms ? 'bg-[#2D5A4C] text-white shadow-xs' : 'text-gray-600 dark:text-gray-300'
            }"
          >
            One-Word Substitution (এককথায় প্রকাশ)
          </button>
          <button
            type="button"
            onclick="switchOneWordSubTab('idioms')"
            class="px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              isIdioms ? 'bg-[#2D5A4C] text-white shadow-xs' : 'text-gray-600 dark:text-gray-300'
            }"
          >
            Idioms &amp; Phrases (বাগধারা ও প্রবাদ)
          </button>
        </div>

        <!-- Self-Test Mode Toggle Switch -->
        <div class="flex items-center gap-3">
          <label class="flex items-center gap-2 text-xs font-bold cursor-pointer select-none" style="color: var(--ink-secondary);">
            <input
              type="checkbox"
              ${selfTest ? 'checked' : ''}
              onchange="toggleSelfTestMode(this.checked)"
              class="w-4 h-4 rounded text-[#2D5A4C] focus:ring-[#2D5A4C] cursor-pointer"
            />
            <span>Self-Test Mode (উত্তর লুকান / প্রকাশ করুন)</span>
          </label>
        </div>
      </div>

      <!-- Search & Category Filters -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <!-- Live Search Input -->
        <div class="relative flex-1 max-w-md">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            🔍
          </span>
          <input
            type="text"
            value="${ToolsState.searchQuery}"
            oninput="searchOneWordAndIdioms(this.value)"
            placeholder="Search word, phrase or meaning..."
            class="w-full pl-9 pr-4 py-2 rounded-xl border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2D5A4C]/30"
            style="background-color: var(--surface-sand); border-color: var(--border-subtle); color: var(--ink-primary);"
          />
        </div>

        <!-- Category Filter Pills -->
        <div class="flex flex-wrap items-center gap-1.5">
          ${[
            { id: 'all', label: 'All (সব)' },
            { id: 'person_behavior', label: 'Person & Behavior' },
            { id: 'governance_law', label: 'Governance & Law' },
            { id: 'admission_favorites', label: 'Admission Favorites' }
          ].map((c) => {
            const isAct = cat === c.id;
            return `
              <button
                type="button"
                onclick="filterOneWordCategory('${c.id}')"
                class="px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                  isAct ? 'bg-[#2D5A4C] text-white border-[#2D5A4C]' : 'hover:bg-black/5 dark:hover:bg-white/5 border-transparent text-gray-600 dark:text-gray-300'
                }"
              >
                ${c.label}
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Results Count -->
      <div class="text-xs font-bold text-gray-400">
        Showing ${filtered.length} entries &bull; ${selfTest ? 'Self-Test Mode Active: Click card to reveal answer' : 'Tap audio icon to hear pronunciation'}
      </div>

      <!-- Entries Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${filtered.map((item) => {
          const isRevealed = !selfTest || ToolsState.revealedIds.has(item.id);
          return `
            <div
              class="p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                selfTest ? 'cursor-pointer hover:shadow-md' : ''
              }"
              style="background-color: var(--surface-sand); border-color: var(--border-subtle);"
              ${selfTest ? `onclick="toggleRevealCard('${item.id}')"` : ''}
            >
              <div>
                <!-- Top Meta Row -->
                <div class="flex items-center justify-between gap-2 mb-2">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#2D5A4C]/10 text-[#2D5A4C] dark:text-[#8CB8A8]">
                    ${item.tag}
                  </span>
                  <button
                    type="button"
                    onclick="event.stopPropagation(); if(typeof speakWordWithAccent==='function')speakWordWithAccent('${item.word.replace(/'/g, "\\'")}', 'UK', this);"
                    class="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                    title="Listen Pronunciation"
                  >
                    🔊
                  </button>
                </div>

                <!-- Definition / Clue -->
                <p class="text-xs sm:text-sm font-medium mb-3" style="color: var(--ink-secondary);">
                  ${item.definition}
                </p>

                <!-- Word & Bangla Meaning (Hidden or Revealed) -->
                ${isRevealed ? `
                  <div class="p-3 rounded-xl border bg-white dark:bg-gray-800" style="border-color: var(--border-subtle);">
                    <div class="flex items-center justify-between gap-2">
                      <h3 class="font-editorial text-base sm:text-lg font-bold" style="color: var(--accent-sage);">
                        ${item.word}
                      </h3>
                      ${item.pos ? `<span class="text-[10px] uppercase font-bold text-gray-400 italic">${item.pos}</span>` : ''}
                    </div>
                    <div class="font-bengali text-xs sm:text-sm font-semibold mt-0.5" style="color: var(--ink-primary);">
                      ${item.meaningBn}
                    </div>
                  </div>
                ` : `
                  <div class="p-3 rounded-xl border border-dashed text-center bg-black/5 dark:bg-white/5" style="border-color: var(--border-subtle);">
                    <span class="text-xs font-bold text-[#2D5A4C] dark:text-[#8CB8A8] flex items-center justify-center gap-1.5">
                      <span>👁️</span>
                      <span>Tap to Reveal Answer &bull; উত্তর দেখুন</span>
                    </span>
                  </div>
                `}
              </div>

              <!-- Exam Example Sentence -->
              <div class="pt-3 mt-3 border-t text-[11px] text-gray-500" style="border-color: var(--border-subtle);">
                <strong>Example:</strong> ${item.example}
              </div>
            </div>
          `;
        }).join('')}
      </div>

    </section>
  `;
}

function renderRootsSectionHTML() {
  const currentRoot = ROOT_WORDS_DATA[ToolsState.selectedRootId] || ROOT_WORDS_DATA['bene'];
  const rootKeys = Object.keys(ROOT_WORDS_DATA);

  // Decoder presets
  const presets = DECODER_PRESETS;
  const currentPreset = presets.find(
    p => p.prefix === ToolsState.decoderPrefix && p.root === ToolsState.decoderRoot && p.suffix === ToolsState.decoderSuffix
  ) || presets[0];

  return `
    <section class="vw-editorial-card p-6 sm:p-8 rounded-3xl border space-y-8" style="background-color: var(--surface-white); border-color: var(--border-subtle);">
      
      <!-- WORD DECODER CHALLENGE BAR -->
      <div class="p-6 rounded-3xl border bg-gradient-to-br from-[#FAF8F5] to-[#EEF4F1] dark:from-gray-900 dark:to-gray-800" style="border-color: var(--border-subtle);">
        <div class="max-w-3xl mx-auto space-y-4">
          <div class="text-center space-y-1">
            <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#2D5A4C]/10 text-[#2D5A4C] dark:text-[#8CB8A8]">
              Interactive Word Decoder
            </span>
            <h2 class="font-editorial text-xl sm:text-2xl font-bold" style="color: var(--ink-primary);">
              Prefix + Root + Suffix Formula
            </h2>
            <p class="font-bengali text-xs sm:text-sm text-gray-500">
              উপসর্গ ও অনুসর্গ যুক্ত করে কীভাবে নতুন ইংরেজি শব্দ গঠিত হয় তা পরীক্ষা করুন
            </p>
          </div>

          <!-- Formula Equation Visual Box -->
          <div class="p-4 sm:p-5 rounded-2xl border bg-white dark:bg-gray-800 shadow-sm flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-center" style="border-color: var(--border-subtle);">
            <!-- Prefix Chip -->
            <div class="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200">
              <span class="block text-[10px] uppercase font-bold text-amber-600">Prefix</span>
              <strong class="text-sm sm:text-base font-editorial">${currentPreset.prefix}-</strong>
            </div>

            <span class="text-gray-400 font-bold text-lg">+</span>

            <!-- Root Chip -->
            <div class="px-3.5 py-2 rounded-xl bg-[#2D5A4C]/10 border border-[#2D5A4C]/30 text-[#2D5A4C] dark:text-[#8CB8A8]">
              <span class="block text-[10px] uppercase font-bold text-[#2D5A4C]">Root</span>
              <strong class="text-sm sm:text-base font-editorial">${currentPreset.root}</strong>
            </div>

            <span class="text-gray-400 font-bold text-lg">+</span>

            <!-- Suffix Chip -->
            <div class="px-3.5 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-800 dark:text-purple-200">
              <span class="block text-[10px] uppercase font-bold text-purple-600">Suffix</span>
              <strong class="text-sm sm:text-base font-editorial">-${currentPreset.suffix}</strong>
            </div>

            <span class="text-gray-400 font-bold text-lg">=</span>

            <!-- Result Decoded Word Chip -->
            <div class="px-4 py-2 rounded-xl bg-[#2D5A4C] text-white shadow-xs">
              <span class="block text-[10px] uppercase font-bold text-gray-200">Decoded Word</span>
              <strong class="text-base sm:text-lg font-editorial">${currentPreset.word}</strong>
            </div>
          </div>

          <!-- Result Details Box -->
          <div class="p-4 rounded-2xl border bg-white/70 dark:bg-gray-800/70 flex flex-col sm:flex-row items-center justify-between gap-3" style="border-color: var(--border-subtle);">
            <div>
              <div class="flex items-center gap-2">
                <span class="font-editorial text-lg font-bold" style="color: var(--accent-sage);">${currentPreset.word}</span>
                <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-gray-500">${currentPreset.pos}</span>
                <button
                  type="button"
                  onclick="if(typeof speakWordWithAccent==='function')speakWordWithAccent('${currentPreset.word}', 'UK', this);"
                  class="p-1 rounded-full text-gray-500 hover:text-black dark:hover:text-white"
                  title="Listen"
                >
                  🔊
                </button>
              </div>
              <div class="font-bengali text-xs sm:text-sm font-semibold mt-0.5" style="color: var(--ink-primary);">
                ${currentPreset.meaningBn}
              </div>
              <div class="text-[11px] text-gray-500 mt-1">
                <strong>Example:</strong> ${currentPreset.example}
              </div>
            </div>

            <!-- Quick Preset Pill Selector -->
            <div class="flex flex-wrap items-center justify-center gap-1.5 shrink-0">
              ${presets.map((p) => {
                const isAct = p.word === currentPreset.word;
                return `
                  <button
                    type="button"
                    onclick="decodeWordEquation('${p.prefix}', '${p.root}', '${p.suffix}')"
                    class="px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                      isAct ? 'bg-[#2D5A4C] text-white border-[#2D5A4C]' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-black/5'
                    }"
                  >
                    ${p.word}
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- CLICKABLE ROOT WORD CARDS (GRID) -->
      <div class="space-y-4">
        <div>
          <h2 class="font-editorial text-lg sm:text-xl font-bold" style="color: var(--ink-primary);">
            Explore by Latin &amp; Greek Root Words
          </h2>
          <p class="font-bengali text-xs sm:text-sm text-gray-500">
            নিচের যেকোনো রুট ওয়ার্ডে ক্লিক করে তার শাখা-প্রশাখা ও ৮+ সম্পর্কিত শব্দ দেখুন
          </p>
        </div>

        <!-- 6 Main Root Cards Selector -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          ${rootKeys.map((key) => {
            const r = ROOT_WORDS_DATA[key];
            const isAct = r.id === currentRoot.id;
            return `
              <button
                type="button"
                onclick="selectRootWord('${r.id}')"
                class="p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isAct ? 'bg-[#2D5A4C] text-white border-[#2D5A4C] shadow-md scale-102' : 'bg-white dark:bg-gray-800 hover:bg-[#EEF4F1] dark:hover:bg-gray-700'
                }"
                style="border-color: var(--border-subtle);"
              >
                <span class="block text-[10px] uppercase font-bold opacity-75">${r.origin} Root</span>
                <span class="block font-editorial text-base sm:text-lg font-bold leading-tight my-0.5">${r.root}</span>
                <span class="block text-[11px] font-bengali truncate ${isAct ? 'text-gray-200' : 'text-gray-500'}">${r.meaning}</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- BRANCHING GRID OF 8+ WORDS FOR SELECTED ROOT -->
      <div class="p-6 rounded-3xl border bg-white dark:bg-gray-800 space-y-4" style="border-color: var(--border-subtle);">
        <div class="flex items-center justify-between pb-3 border-b" style="border-color: var(--border-subtle);">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-[#2D5A4C] dark:text-[#8CB8A8]">
              Branching Words for Root "${currentRoot.root}"
            </span>
            <h3 class="font-editorial text-lg sm:text-xl font-bold" style="color: var(--ink-primary);">
              ${currentRoot.meaning}
            </h3>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-[#2D5A4C]/10 text-[#2D5A4C] dark:text-[#8CB8A8]">
            ${currentRoot.words.length} Connected Words
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          ${currentRoot.words.map((w) => {
            const bd = w.breakdown;
            return `
              <div class="p-4 rounded-2xl border flex flex-col justify-between transition-all hover:shadow-sm" style="background-color: var(--surface-sand); border-color: var(--border-subtle);">
                <div>
                  <!-- Word Header & Audio -->
                  <div class="flex items-center justify-between gap-2 mb-2">
                    <h4 class="font-editorial text-base font-bold" style="color: var(--ink-primary);">
                      ${w.word}
                    </h4>
                    <button
                      type="button"
                      onclick="if(typeof speakWordWithAccent==='function')speakWordWithAccent('${w.word}', 'UK', this);"
                      class="p-1 rounded-full text-gray-500 hover:text-black dark:hover:text-white"
                      title="Pronounce"
                    >
                      🔊
                    </button>
                  </div>

                  <!-- Morphological Breakdown Chips -->
                  <div class="flex items-center gap-1 flex-wrap text-[10px] font-mono mb-2">
                    ${bd.prefix ? `<span class="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">${bd.prefix}-</span>` : ''}
                    <span class="px-1.5 py-0.5 rounded bg-[#2D5A4C]/15 text-[#2D5A4C] dark:text-[#8CB8A8] font-bold border border-[#2D5A4C]/30">${bd.root}</span>
                    ${bd.suffix ? `<span class="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">-${bd.suffix}</span>` : ''}
                  </div>

                  <!-- Bangla Meaning -->
                  <div class="font-bengali text-xs font-bold mb-1" style="color: var(--accent-sage);">
                    ${w.meaningBn}
                  </div>

                  <!-- Definition -->
                  <p class="text-[11px] text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                    ${w.definition}
                  </p>
                </div>

                <!-- Example Sentence -->
                <div class="pt-2 border-t text-[10px] text-gray-500 italic" style="border-color: var(--border-subtle);">
                  "${w.example}"
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

    </section>
  `;
}

function renderVoiceSectionHTML() {
  const words = VOICE_PRACTICE_WORDS;
  const current = words[ToolsState.voiceWordIndex] || words[0];
  const isRec = ToolsState.isRecording;
  const transcript = ToolsState.lastTranscript;
  const accuracy = ToolsState.lastAccuracy;

  let accuracyBadgeHTML = '';
  if (accuracy !== null) {
    if (accuracy >= 90) {
      accuracyBadgeHTML = `
        <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-2xl">🌟</span>
            <div>
              <strong class="text-sm sm:text-base font-bold">Excellent Pronunciation! &bull; ${accuracy}% Match</strong>
              <p class="font-bengali text-xs mt-0.5">অসাধারণ নির্ভুল উচ্চারণ! শব্দের স্ট্রেস ও সিলেবল সঠিকভাবে উচ্চারিত হয়েছে।</p>
            </div>
          </div>
          <span class="text-xl font-bold">${accuracy}%</span>
        </div>
      `;
    } else if (accuracy >= 70) {
      accuracyBadgeHTML = `
        <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-2xl">👍</span>
            <div>
              <strong class="text-sm sm:text-base font-bold">Good Attempt! &bull; ${accuracy}% Match</strong>
              <p class="font-bengali text-xs mt-0.5">খুব ভালো চেষ্টা! স্ট্রেস পয়েন্ট আরেকটু স্পষ্ট করে বলার চেষ্টা করুন।</p>
            </div>
          </div>
          <span class="text-xl font-bold">${accuracy}%</span>
        </div>
      `;
    } else {
      accuracyBadgeHTML = `
        <div class="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-200 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-2xl">🔄</span>
            <div>
              <strong class="text-sm sm:text-base font-bold">Needs Practice &bull; ${accuracy}% Match</strong>
              <p class="font-bengali text-xs mt-0.5">মডেল অডিওটি পুনরায় শুনুন এবং সিলেবল অনুযায়ী স্পষ্ট করে বলুন।</p>
            </div>
          </div>
          <span class="text-xl font-bold">${accuracy}%</span>
        </div>
      `;
    }
  }

  return `
    <section class="vw-editorial-card p-6 sm:p-8 rounded-3xl border space-y-6" style="background-color: var(--surface-white); border-color: var(--border-subtle);">
      
      <!-- Top Title & Explanatory Banner -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b" style="border-color: var(--border-subtle);">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-[#2D5A4C] dark:text-[#8CB8A8]">
            Voice Recognition &amp; AI Accuracy Engine
          </span>
          <h2 class="font-editorial text-xl sm:text-2xl font-bold mt-1" style="color: var(--ink-primary);">
            Voice Pronunciation Practice &bull; উচ্চারণ যাচাই
          </h2>
          <p class="font-bengali text-xs sm:text-sm text-gray-500">
            কঠিন ও প্রায়শই ভুল উচ্চারিত ভর্তি পরীক্ষার শব্দগুলো শুনুন এবং মাইকে বলে তাৎক্ষণিক অ্যাকুরেসি স্কোর যাচাই করুন
          </p>
        </div>

        <!-- Quick Word Navigation Pill Counter -->
        <div class="flex items-center gap-2">
          <button
            type="button"
            onclick="selectVoiceWord((${ToolsState.voiceWordIndex} - 1 + ${words.length}) % ${words.length})"
            class="px-3 py-1.5 rounded-xl border text-xs font-bold hover:bg-black/5"
            style="border-color: var(--border-subtle); color: var(--ink-primary);"
          >
            &larr; Prev
          </button>
          <span class="text-xs font-bold text-gray-500">
            ${ToolsState.voiceWordIndex + 1} / ${words.length}
          </span>
          <button
            type="button"
            onclick="selectVoiceWord((${ToolsState.voiceWordIndex} + 1) % ${words.length})"
            class="px-3 py-1.5 rounded-xl border text-xs font-bold hover:bg-black/5"
            style="border-color: var(--border-subtle); color: var(--ink-primary);"
          >
            Next &rarr;
          </button>
        </div>
      </div>

      <!-- Word Selector Carousel Pills -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        ${words.map((w, idx) => {
          const isAct = idx === ToolsState.voiceWordIndex;
          return `
            <button
              type="button"
              onclick="selectVoiceWord(${idx})"
              class="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isAct ? 'bg-[#2D5A4C] text-white border-[#2D5A4C]' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-[#EEF4F1]'
              }"
              style="border-color: var(--border-subtle);"
            >
              ${w.word}
            </button>
          `;
        }).join('')}
      </div>

      <!-- Active Practice Word Spotlight Stage -->
      <div class="p-6 sm:p-8 rounded-3xl border bg-gradient-to-br from-[#FAF8F5] to-[#EEF4F1] dark:from-gray-900 dark:to-gray-800 space-y-6" style="border-color: var(--border-subtle);">
        
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#2D5A4C]/10 text-[#2D5A4C] dark:text-[#8CB8A8]">
              Target Word
            </span>
            <h3 class="font-editorial text-3xl sm:text-5xl font-bold tracking-tight" style="color: var(--ink-primary);">
              ${current.word}
            </h3>
            <div class="flex items-center gap-3 flex-wrap">
              <span class="font-mono text-sm sm:text-base text-gray-600 dark:text-gray-300">${current.ipa}</span>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bengali font-bold bg-white/70 dark:bg-gray-800/70 border" style="border-color: var(--border-subtle); color: var(--accent-sage);">
                ${current.meaningBn}
              </span>
            </div>
          </div>

          <!-- Native Listen Models (UK / US) -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            <button
              type="button"
              onclick="if(typeof speakWordWithAccent==='function')speakWordWithAccent('${current.word}', 'UK', this);"
              class="px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#EEF4F1] transition-all shadow-xs"
              style="border-color: var(--border-subtle); color: var(--ink-primary);"
            >
              <span>🇬🇧</span>
              <span>Listen Model (UK)</span>
            </button>
            <button
              type="button"
              onclick="if(typeof speakWordWithAccent==='function')speakWordWithAccent('${current.word}', 'US', this);"
              class="px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#EEF4F1] transition-all shadow-xs"
              style="border-color: var(--border-subtle); color: var(--ink-primary);"
            >
              <span>🇺🇸</span>
              <span>Listen Model (US)</span>
            </button>
          </div>
        </div>

        <!-- Syllable Stress & Tips Card -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-4 rounded-2xl border bg-white dark:bg-gray-800" style="border-color: var(--border-subtle);">
            <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Syllables &amp; Stress Pattern
            </span>
            <div class="font-editorial text-base sm:text-lg font-bold text-[#2D5A4C] dark:text-[#8CB8A8]">
              ${current.syllables}
            </div>
            <div class="font-bengali text-xs text-gray-500 mt-0.5">
              উচ্চারণ: ${current.syllablesBn}
            </div>
          </div>

          <div class="p-4 rounded-2xl border bg-white dark:bg-gray-800" style="border-color: var(--border-subtle);">
            <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Phonetic Stress Advice
            </span>
            <p class="text-xs text-gray-600 dark:text-gray-300">
              💡 ${current.stressTip}
            </p>
          </div>
        </div>

        <!-- INTERACTIVE MICROPHONE RECORDING & ACCURACY ZONE -->
        <div class="pt-4 border-t flex flex-col items-center justify-center text-center space-y-4" style="border-color: var(--border-subtle);">
          
          <!-- Microphone Button -->
          <div class="relative">
            <button
              type="button"
              onclick="${isRec ? 'stopVoiceRecognition()' : 'startVoiceRecognition()'}"
              class="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer ${
                isRec ? 'bg-red-600 animate-pulse ring-8 ring-red-500/20' : 'bg-[#2D5A4C] hover:bg-[#23473c]'
              }"
            >
              <span class="text-2xl sm:text-3xl">${isRec ? '⏹️' : '🎙️'}</span>
              <span class="text-[10px] font-bold uppercase mt-1">${isRec ? 'Listening' : 'Speak'}</span>
            </button>
          </div>

          <div class="space-y-1">
            <p class="text-xs sm:text-sm font-bold" style="color: var(--ink-primary);">
              ${isRec ? 'Listening now... Pronounce "' + current.word + '" clearly into your mic!' : 'Tap the microphone and pronounce the word'}
            </p>
            <p class="font-bengali text-[11px] text-gray-500">
              মাইকে ট্যাপ করে শব্দটি স্পষ্ট করে বলুন। আপনার উচ্চারণ যাচাই করে নির্ভুলতার হার দেখানো হবে।
            </p>
          </div>

          <!-- Fallback Simulation Pill (Zero Dead Clicks Guarantee) -->
          <div class="flex items-center gap-2">
            <button
              type="button"
              onclick="simulateVoicePractice('${current.word}')"
              class="px-3 py-1.5 rounded-xl border text-[11px] font-bold hover:bg-black/5 text-gray-500"
              style="border-color: var(--border-subtle);"
              title="Test accuracy matching algorithm"
            >
              Simulate Match (পরীক্ষা ডেমো)
            </button>
          </div>

          <!-- Accuracy Feedback Card (If tested) -->
          ${accuracyBadgeHTML ? `
            <div class="w-full max-w-xl text-left">
              ${accuracyBadgeHTML}
              ${transcript ? `
                <div class="text-xs text-center text-gray-500 mt-2">
                  Recognized Voice Input: "<strong>${transcript}</strong>" &bull; Target: "<strong>${current.word}</strong>"
                </div>
              ` : ''}
            </div>
          ` : ''}

        </div>

      </div>

    </section>
  `;
}



/* =====================================================================
   13. HSC & DHAKA UNIVERSITY ADMISSION VOCABULARY DATASET (50 WORDS)
====================================================================== */
const HSC_DU_ADMISSION_VOCABULARY = [
  {
    "id": "hsc_beg_01",
    "word": "Abundant",
    "ipa": "/əˈbʌn.dənt/",
    "pos": "Adj",
    "level": "beginner",
    "bn": "প্রচুর, পর্যাপ্ত",
    "meaningBn": "প্রচুর, পর্যাপ্ত",
    "synonyms": [
      "Plentiful",
      "Ample"
    ],
    "antonyms": [
      "Scarce",
      "Rare"
    ],
    "example": "Bangladesh has abundant fertile land for farming."
  },
  {
    "id": "hsc_beg_02",
    "word": "Accurate",
    "ipa": "/ˈæk.jər.ət/",
    "pos": "Adj",
    "level": "beginner",
    "bn": "নির্ভুল, সঠিক",
    "meaningBn": "নির্ভুল, সঠিক",
    "synonyms": [
      "Exact",
      "Precise"
    ],
    "antonyms": [
      "Inaccurate",
      "Wrong"
    ],
    "example": "Double-check your calculations to ensure accurate results."
  },
  {
    "id": "hsc_beg_03",
    "word": "Adequate",
    "ipa": "/ˈæd.ɪ.kwət/",
    "pos": "Adj",
    "level": "beginner",
    "bn": "পর্যাপ্ত, যথেষ্ট",
    "meaningBn": "পর্যাপ্ত, যথেষ্ট",
    "synonyms": [
      "Sufficient",
      "Enough"
    ],
    "antonyms": [
      "Inadequate",
      "Lacking"
    ],
    "example": "Adequate sleep is essential for sharp memory."
  },
  {
    "id": "hsc_beg_04",
    "word": "Alter",
    "ipa": "/ˈɔːl.tər/",
    "pos": "Verb",
    "level": "beginner",
    "bn": "পরিবর্তন করা",
    "meaningBn": "পরিবর্তন করা",
    "synonyms": [
      "Change",
      "Modify"
    ],
    "antonyms": [
      "Preserve",
      "Keep"
    ],
    "example": "You cannot alter the past, so focus on today."
  },
  {
    "id": "hsc_beg_05",
    "word": "Ambitious",
    "ipa": "/æmˈbɪʃ.əs/",
    "pos": "Adj",
    "level": "beginner",
    "bn": "উচ্চাকাঙ্ক্ষী",
    "meaningBn": "উচ্চাকাঙ্ক্ষী",
    "synonyms": [
      "Aspiring",
      "Driven"
    ],
    "antonyms": [
      "Unambitious",
      "Content"
    ],
    "example": "Ambitious students set clear milestones every week."
  },
  {
    "id": "hsc_beg_06",
    "word": "Ancient",
    "ipa": "/ˈeɪn.ʃənt/",
    "pos": "Adj",
    "level": "beginner",
    "bn": "প্রাচীন, পুরাতন",
    "meaningBn": "প্রাচীন, পুরাতন",
    "synonyms": [
      "Old",
      "Antique"
    ],
    "antonyms": [
      "Modern",
      "Recent"
    ],
    "example": "We studied ancient civilizations in history class."
  },
  {
    "id": "hsc_beg_07",
    "word": "Apparent",
    "ipa": "/əˈpær.ənt/",
    "pos": "Adj",
    "level": "beginner",
    "bn": "স্পষ্ট, প্রতীয়মান",
    "meaningBn": "স্পষ্ট, প্রতীয়মান",
    "synonyms": [
      "Obvious",
      "Clear"
    ],
    "antonyms": [
      "Hidden",
      "Obscure"
    ],
    "example": "Her progress in spoken English is clearly apparent."
  },
  {
    "id": "hsc_beg_08",
    "word": "Arrogant",
    "ipa": "/ˈær.ə.ɡənt/",
    "pos": "Adj",
    "level": "beginner",
    "bn": "অহংকারী, উদ্ধত",
    "meaningBn": "অহংকারী, উদ্ধত",
    "synonyms": [
      "Haughty",
      "Proud"
    ],
    "antonyms": [
      "Humble",
      "Modest"
    ],
    "example": "An arrogant attitude blocks a person from learning."
  },
  {
    "id": "hsc_beg_09",
    "word": "Assist",
    "ipa": "/əˈsɪst/",
    "pos": "Verb",
    "level": "beginner",
    "bn": "সাহায্য করা",
    "meaningBn": "সাহায্য করা",
    "synonyms": [
      "Help",
      "Aid"
    ],
    "antonyms": [
      "Hinder",
      "Obstruct"
    ],
    "example": "Seniors often assist juniors with admission notes."
  },
  {
    "id": "hsc_beg_10",
    "word": "Benevolent",
    "ipa": "/bəˈnev.əl.ənt/",
    "pos": "Adj",
    "level": "beginner",
    "bn": "দয়ালু, পরোপকারী",
    "meaningBn": "দয়ালু, পরোপকারী",
    "synonyms": [
      "Kind",
      "Generous"
    ],
    "antonyms": [
      "Cruel",
      "Malevolent"
    ],
    "example": "The benevolent donor funded twenty scholarships."
  },
  {
    "id": "hsc_beg_11",
    "word": "Brief",
    "ipa": "/briːf/",
    "pos": "Adj",
    "level": "beginner",
    "bn": "সংক্ষিপ্ত",
    "meaningBn": "সংক্ষিপ্ত",
    "synonyms": [
      "Short",
      "Concise"
    ],
    "antonyms": [
      "Lengthy",
      "Prolonged"
    ],
    "example": "Keep your summary brief and to the point."
  },
  {
    "id": "hsc_beg_12",
    "word": "Cautious",
    "ipa": "/ˈkɔː.ʃəs/",
    "pos": "Adj",
    "level": "beginner",
    "bn": "সতর্ক, সাবধানী",
    "meaningBn": "সতর্ক, সাবধানী",
    "synonyms": [
      "Careful",
      "Prudent"
    ],
    "antonyms": [
      "Reckless",
      "Careless"
    ],
    "example": "Be cautious while answering negative-marking MCQs."
  },
  {
    "id": "hsc_beg_13",
    "word": "Commence",
    "ipa": "/kəˈmens/",
    "pos": "Verb",
    "level": "beginner",
    "bn": "শুরু করা",
    "meaningBn": "শুরু করা",
    "synonyms": [
      "Begin",
      "Start"
    ],
    "antonyms": [
      "Conclude",
      "End"
    ],
    "example": "The admission test will commence at 10:00 AM sharp."
  },
  {
    "id": "hsc_beg_14",
    "word": "Conceal",
    "ipa": "/kənˈsiːl/",
    "pos": "Verb",
    "level": "beginner",
    "bn": "লুকানো, গোপন করা",
    "meaningBn": "লুকানো, গোপন করা",
    "synonyms": [
      "Hide",
      "Cover"
    ],
    "antonyms": [
      "Reveal",
      "Expose"
    ],
    "example": "He tried to conceal his nervousness before the viva."
  },
  {
    "id": "hsc_beg_15",
    "word": "Crucial",
    "ipa": "/ˈkruː.ʃəl/",
    "pos": "Adj",
    "level": "beginner",
    "bn": "অত্যন্ত গুরুত্বপূর্ণ",
    "meaningBn": "অত্যন্ত গুরুত্বপূর্ণ",
    "synonyms": [
      "Vital",
      "Critical"
    ],
    "antonyms": [
      "Trivial",
      "Minor"
    ],
    "example": "Revision is crucial during the final month of HSC."
  },
  {
    "id": "hsc_beg_16",
    "word": "Decline",
    "ipa": "/dɪˈklaɪn/",
    "pos": "Verb",
    "level": "beginner",
    "bn": "হ্রাস পাওয়া বা প্রত্যাখ্যান করা",
    "meaningBn": "হ্রাস পাওয়া বা প্রত্যাখ্যান করা",
    "synonyms": [
      "Decrease",
      "Refuse"
    ],
    "antonyms": [
      "Increase",
      "Accept"
    ],
    "example": "She politely declined the invitation to study late."
  },
  {
    "id": "hsc_beg_17",
    "word": "Diligent",
    "ipa": "/ˈdɪl.ɪ.dʒənt/",
    "pos": "Adj",
    "level": "beginner",
    "bn": "পরিশ্রমী, অধ্যবসায়ী",
    "meaningBn": "পরিশ্রমী, অধ্যবসায়ী",
    "synonyms": [
      "Hardworking",
      "Assiduous"
    ],
    "antonyms": [
      "Lazy",
      "Negligent"
    ],
    "example": "Diligent practice turns weak subjects into strengths."
  },
  {
    "id": "hsc_beg_18",
    "word": "Durable",
    "ipa": "/ˈdjʊə.rə.bəl/",
    "pos": "Adj",
    "level": "beginner",
    "bn": "টেকসই, স্থায়ী",
    "meaningBn": "টেকসই, স্থায়ী",
    "synonyms": [
      "Sturdy",
      "Lasting"
    ],
    "antonyms": [
      "Fragile",
      "Weak"
    ],
    "example": "Invest in a durable backpack for daily college use."
  },
  {
    "id": "hsc_beg_19",
    "word": "Eager",
    "ipa": "/ˈiː.ɡər/",
    "pos": "Adj",
    "level": "beginner",
    "bn": "আগ্রহী, উৎসুক",
    "meaningBn": "আগ্রহী, উৎসুক",
    "synonyms": [
      "Keen",
      "Enthusiastic"
    ],
    "antonyms": [
      "Reluctant",
      "Apathetic"
    ],
    "example": "The learners were eager to test the new quiz app."
  },
  {
    "id": "hsc_beg_20",
    "word": "Enormous",
    "ipa": "/ɪˈnɔː.məs/",
    "pos": "Adj",
    "level": "beginner",
    "bn": "বিশাল, প্রকাণ্ড",
    "meaningBn": "বিশাল, প্রকাণ্ড",
    "synonyms": [
      "Huge",
      "Immense"
    ],
    "antonyms": [
      "Tiny",
      "Minute"
    ],
    "example": "Reading newspapers brings enormous vocabulary growth."
  },
  {
    "id": "hsc_beg_21",
    "word": "Fragile",
    "ipa": "/ˈfrædʒ.aɪl/",
    "pos": "Adj",
    "level": "beginner",
    "bn": "ভঙ্গুর, নাজুক",
    "meaningBn": "ভঙ্গুর, নাজুক",
    "synonyms": [
      "Brittle",
      "Delicate"
    ],
    "antonyms": [
      "Sturdy",
      "Strong"
    ],
    "example": "Handle the fragile glass beaker with both hands."
  },
  {
    "id": "hsc_beg_22",
    "word": "Genuine",
    "ipa": "/ˈdʒen.ju.ɪn/",
    "pos": "Adj",
    "level": "beginner",
    "bn": "আসল, খাঁটি",
    "meaningBn": "আসল, খাঁটি",
    "synonyms": [
      "Authentic",
      "Real"
    ],
    "antonyms": [
      "Fake",
      "Counterfeit"
    ],
    "example": "Always rely on genuine textbooks for board exams."
  },
  {
    "id": "hsc_beg_23",
    "word": "Humble",
    "ipa": "/ˈhʌm.bəl/",
    "pos": "Adj",
    "level": "beginner",
    "bn": "বিনয়ী, নিরহংকার",
    "meaningBn": "বিনয়ী, নিরহংকার",
    "synonyms": [
      "Modest",
      "Meek"
    ],
    "antonyms": [
      "Arrogant",
      "Boastful"
    ],
    "example": "Despite topping the mock test, she remained humble."
  },
  {
    "id": "hsc_beg_24",
    "word": "Reluctant",
    "ipa": "/rɪˈlʌk.tənt/",
    "pos": "Adj",
    "level": "beginner",
    "bn": "অনিচ্ছুক, দ্বিধাগ্রস্ত",
    "meaningBn": "অনিচ্ছুক, দ্বিধাগ্রস্ত",
    "synonyms": [
      "Unwilling",
      "Hesitant"
    ],
    "antonyms": [
      "Willing",
      "Eager"
    ],
    "example": "Many students are reluctant to speak English aloud."
  },
  {
    "id": "hsc_beg_25",
    "word": "Vivid",
    "ipa": "/ˈvɪv.ɪd/",
    "pos": "Adj",
    "level": "beginner",
    "bn": "প্রাণবন্ত, সুস্পষ্ট",
    "meaningBn": "প্রাণবন্ত, সুস্পষ্ট",
    "synonyms": [
      "Clear",
      "Graphic"
    ],
    "antonyms": [
      "Dull",
      "Vague"
    ],
    "example": "She painted a vivid picture of rural Bengal in her essay."
  },
  {
    "id": "hsc_int_26",
    "word": "Adversity",
    "ipa": "/ədˈvɜː.sə.ti/",
    "pos": "Noun",
    "level": "intermediate",
    "bn": "প্রতিকূলতা, দুর্দশা",
    "meaningBn": "প্রতিকূলতা, দুর্দশা",
    "synonyms": [
      "Hardship",
      "Misfortune"
    ],
    "antonyms": [
      "Prosperity",
      "Fortune"
    ],
    "example": "True resilience is tested during times of adversity."
  },
  {
    "id": "hsc_int_27",
    "word": "Alleviate",
    "ipa": "/əˈliː.vi.eɪt/",
    "pos": "Verb",
    "level": "intermediate",
    "bn": "উপশম করা, কমানো",
    "meaningBn": "উপশম করা, কমানো",
    "synonyms": [
      "Ease",
      "Mitigate"
    ],
    "antonyms": [
      "Aggravate",
      "Worsen"
    ],
    "example": "Regular mock tests alleviate exam hall panic."
  },
  {
    "id": "hsc_int_28",
    "word": "Ambiguous",
    "ipa": "/æmˈbɪɡ.ju.əs/",
    "pos": "Adj",
    "level": "intermediate",
    "bn": "দ্ব্যর্থবোধক, অস্পষ্ট",
    "meaningBn": "দ্ব্যর্থবোধক, অস্পষ্ট",
    "synonyms": [
      "Vague",
      "Unclear"
    ],
    "antonyms": [
      "Clear",
      "Explicit"
    ],
    "example": "Avoid ambiguous phrasing in formal letters."
  },
  {
    "id": "hsc_int_29",
    "word": "Apathy",
    "ipa": "/ˈæp.ə.θi/",
    "pos": "Noun",
    "level": "intermediate",
    "bn": "উদাসীনতা, অনীহা",
    "meaningBn": "উদাসীনতা, অনীহা",
    "synonyms": [
      "Indifference",
      "Lethargy"
    ],
    "antonyms": [
      "Enthusiasm",
      "Passion"
    ],
    "example": "Student apathy toward reading books must change."
  },
  {
    "id": "hsc_int_30",
    "word": "Articulate",
    "ipa": "/ɑːˈtɪk.jə.lət/",
    "pos": "Adj",
    "level": "intermediate",
    "bn": "স্পষ্টভাষী, সুবক্তা",
    "meaningBn": "স্পষ্টভাষী, সুবক্তা",
    "synonyms": [
      "Eloquent",
      "Fluent"
    ],
    "antonyms": [
      "Inarticulate",
      "Mumbling"
    ],
    "example": "An articulate candidate excels in group discussions."
  },
  {
    "id": "hsc_int_31",
    "word": "Authentic",
    "ipa": "/ɔːˈθen.tɪk/",
    "pos": "Adj",
    "level": "intermediate",
    "bn": "প্রামাণিক, খাঁটি",
    "meaningBn": "প্রামাণিক, খাঁটি",
    "synonyms": [
      "Genuine",
      "Valid"
    ],
    "antonyms": [
      "Spurious",
      "False"
    ],
    "example": "Cite authentic statistics in your economics answer."
  },
  {
    "id": "hsc_int_32",
    "word": "Candid",
    "ipa": "/ˈkæn.dɪd/",
    "pos": "Adj",
    "level": "intermediate",
    "bn": "অকপট, স্পষ্টবাদী",
    "meaningBn": "অকপট, স্পষ্টবাদী",
    "synonyms": [
      "Frank",
      "Honest"
    ],
    "antonyms": [
      "Deceptive",
      "Secretive"
    ],
    "example": "Give a candid review of your daily study habits."
  },
  {
    "id": "hsc_int_33",
    "word": "Coherent",
    "ipa": "/kəʊˈhɪə.rənt/",
    "pos": "Adj",
    "level": "intermediate",
    "bn": "সুসংগত, সামঞ্জস্যপূর্ণ",
    "meaningBn": "সুসংগত, সামঞ্জস্যপূর্ণ",
    "synonyms": [
      "Logical",
      "Consistent"
    ],
    "antonyms": [
      "Incoherent",
      "Confused"
    ],
    "example": "Structure every paragraph in a coherent order."
  },
  {
    "id": "hsc_int_34",
    "word": "Compassion",
    "ipa": "/kəmˈpæʃ.ən/",
    "pos": "Noun",
    "level": "intermediate",
    "bn": "সমবেদনা, করুণা",
    "meaningBn": "সমবেদনা, করুণা",
    "synonyms": [
      "Empathy",
      "Sympathy"
    ],
    "antonyms": [
      "Cruelty",
      "Indifference"
    ],
    "example": "Great leaders treat every citizen with compassion."
  },
  {
    "id": "hsc_int_35",
    "word": "Contemplate",
    "ipa": "/ˈkɒn.təm.pleɪt/",
    "pos": "Verb",
    "level": "intermediate",
    "bn": "গভীরভাবে চিন্তা করা",
    "meaningBn": "গভীরভাবে চিন্তা করা",
    "synonyms": [
      "Ponder",
      "Reflect"
    ],
    "antonyms": [
      "Ignore",
      "Disregard"
    ],
    "example": "Take five minutes to contemplate the essay prompt."
  },
  {
    "id": "hsc_int_36",
    "word": "Credible",
    "ipa": "/ˈkred.ə.bəl/",
    "pos": "Adj",
    "level": "intermediate",
    "bn": "বিশ্বাসযোগ্য",
    "meaningBn": "বিশ্বাসযোগ্য",
    "synonyms": [
      "Believable",
      "Reliable"
    ],
    "antonyms": [
      "Implausible",
      "Doubtful"
    ],
    "example": "Always verify news from credible sources."
  },
  {
    "id": "hsc_int_37",
    "word": "Deteriorate",
    "ipa": "/dɪˈtɪə.ri.ə.reɪt/",
    "pos": "Verb",
    "level": "intermediate",
    "bn": "অবনতি হওয়া",
    "meaningBn": "অবনতি হওয়া",
    "synonyms": [
      "Worsen",
      "Decline"
    ],
    "antonyms": [
      "Improve",
      "Ameliorate"
    ],
    "example": "Handwriting can deteriorate if you rush too fast."
  },
  {
    "id": "hsc_int_38",
    "word": "Eloquent",
    "ipa": "/ˈel.ə.kwənt/",
    "pos": "Adj",
    "level": "intermediate",
    "bn": "বাগ্মী, প্রাঞ্জলভাষী",
    "meaningBn": "বাগ্মী, প্রাঞ্জলভাষী",
    "synonyms": [
      "Persuasive",
      "Expressive"
    ],
    "antonyms": [
      "Halting",
      "Inarticulate"
    ],
    "example": "Her eloquent speech inspired the entire auditorium."
  },
  {
    "id": "hsc_int_39",
    "word": "Emulate",
    "ipa": "/ˈem.jə.leɪt/",
    "pos": "Verb",
    "level": "intermediate",
    "bn": "অনুকরণ করা",
    "meaningBn": "অনুকরণ করা",
    "synonyms": [
      "Imitate",
      "Follow"
    ],
    "antonyms": [
      "Neglect",
      "Abandon"
    ],
    "example": "Young entrepreneurs often emulate global innovators."
  },
  {
    "id": "hsc_int_40",
    "word": "Enhance",
    "ipa": "/ɪnˈhɑːns/",
    "pos": "Verb",
    "level": "intermediate",
    "bn": "বৃদ্ধি বা উন্নত করা",
    "meaningBn": "বৃদ্ধি বা উন্নত করা",
    "synonyms": [
      "Improve",
      "Boost"
    ],
    "antonyms": [
      "Diminish",
      "Reduce"
    ],
    "example": "Visual flashcards enhance long-term word retention."
  },
  {
    "id": "hsc_int_41",
    "word": "Frugal",
    "ipa": "/ˈfruː.ɡəl/",
    "pos": "Adj",
    "level": "intermediate",
    "bn": "মিতব্যয়ী, হিসাবি",
    "meaningBn": "মিতব্যয়ী, হিসাবি",
    "synonyms": [
      "Thrifty",
      "Economical"
    ],
    "antonyms": [
      "Extravagant",
      "Wasteful"
    ],
    "example": "Living on a student budget requires frugal habits."
  },
  {
    "id": "hsc_int_42",
    "word": "Inevitable",
    "ipa": "/ɪˈnev.ɪ.tə.bəl/",
    "pos": "Adj",
    "level": "intermediate",
    "bn": "অনিবার্য",
    "meaningBn": "অনিবার্য",
    "synonyms": [
      "Unavoidable",
      "Certain"
    ],
    "antonyms": [
      "Avoidable",
      "Uncertain"
    ],
    "example": "Success is inevitable when effort meets consistency."
  },
  {
    "id": "hsc_int_43",
    "word": "Integrity",
    "ipa": "/ɪnˈteɡ.rə.ti/",
    "pos": "Noun",
    "level": "intermediate",
    "bn": "সততা, ন্যায়নিষ্ঠা",
    "meaningBn": "সততা, ন্যায়নিষ্ঠা",
    "synonyms": [
      "Honesty",
      "Probity"
    ],
    "antonyms": [
      "Dishonesty",
      "Corruption"
    ],
    "example": "Academic integrity forbids any form of plagiarism."
  },
  {
    "id": "hsc_int_44",
    "word": "Lucid",
    "ipa": "/ˈluː.sɪd/",
    "pos": "Adj",
    "level": "intermediate",
    "bn": "সহজবোধ্য, প্রাঞ্জল",
    "meaningBn": "সহজবোধ্য, প্রাঞ্জল",
    "synonyms": [
      "Clear",
      "Intelligible"
    ],
    "antonyms": [
      "Obscure",
      "Confusing"
    ],
    "example": "The teacher explained complex grammar in lucid Bangla."
  },
  {
    "id": "hsc_int_45",
    "word": "Meticulous",
    "ipa": "/məˈtɪk.jə.ləs/",
    "pos": "Adj",
    "level": "intermediate",
    "bn": "অতি সতর্ক ও খুঁতখুঁতে",
    "meaningBn": "অতি সতর্ক ও খুঁতখুঁতে",
    "synonyms": [
      "Thorough",
      "Careful"
    ],
    "antonyms": [
      "Sloppy",
      "Careless"
    ],
    "example": "Meticulous note-taking saves hours before finals."
  },
  {
    "id": "hsc_int_46",
    "word": "Novice",
    "ipa": "/ˈnɒv.ɪs/",
    "pos": "Noun",
    "level": "intermediate",
    "bn": "শিক্ষানবিশ, অনভিজ্ঞ ব্যক্তি",
    "meaningBn": "শিক্ষানবিশ, অনভিজ্ঞ ব্যক্তি",
    "synonyms": [
      "Beginner",
      "Apprentice"
    ],
    "antonyms": [
      "Expert",
      "Veteran"
    ],
    "example": "Every coding expert once started as a complete novice."
  },
  {
    "id": "hsc_int_47",
    "word": "Optimistic",
    "ipa": "/ˌɒp.tɪˈmɪs.tɪk/",
    "pos": "Adj",
    "level": "intermediate",
    "bn": "আশাবাদী",
    "meaningBn": "আশাবাদী",
    "synonyms": [
      "Hopeful",
      "Positive"
    ],
    "antonyms": [
      "Pessimistic",
      "Cynical"
    ],
    "example": "Stay optimistic even if your first mock score is low."
  },
  {
    "id": "hsc_int_48",
    "word": "Plausible",
    "ipa": "/ˈplɔː.zə.bəl/",
    "pos": "Adj",
    "level": "intermediate",
    "bn": "যুক্তিসঙ্গত, গ্রহণযোগ্য",
    "meaningBn": "যুক্তিসঙ্গত, গ্রহণযোগ্য",
    "synonyms": [
      "Reasonable",
      "Credible"
    ],
    "antonyms": [
      "Unlikely",
      "Absurd"
    ],
    "example": "That is a plausible hypothesis for the price rise."
  },
  {
    "id": "hsc_int_49",
    "word": "Pragmatic",
    "ipa": "/præɡˈmæt.ɪk/",
    "pos": "Adj",
    "level": "intermediate",
    "bn": "বাস্তববাদী, প্রায়োগিক",
    "meaningBn": "বাস্তববাদী, প্রায়োগিক",
    "synonyms": [
      "Practical",
      "Realistic"
    ],
    "antonyms": [
      "Idealistic",
      "Impractical"
    ],
    "example": "Adopt a pragmatic timetable you can actually follow."
  },
  {
    "id": "hsc_int_50",
    "word": "Tenacious",
    "ipa": "/təˈneɪ.ʃəs/",
    "pos": "Adj",
    "level": "intermediate",
    "bn": "দৃঢ়প্রতিজ্ঞ, নাছোড়বান্দা",
    "meaningBn": "দৃঢ়প্রতিজ্ঞ, নাছোড়বান্দা",
    "synonyms": [
      "Persistent",
      "Determined"
    ],
    "antonyms": [
      "Yielding",
      "Weak"
    ],
    "example": "Tenacious learners never quit after a single setback."
  },
  {
    "id": "hsc_adv_51",
    "word": "Acumen",
    "ipa": "/ˈæk.jə.mən/",
    "pos": "Noun",
    "level": "advanced",
    "bn": "তীক্ষ্ণ বুদ্ধি বা বিচক্ষণতা",
    "meaningBn": "তীক্ষ্ণ বুদ্ধি বা বিচক্ষণতা",
    "synonyms": [
      "Shrewdness",
      "Insight"
    ],
    "antonyms": [
      "Ignorance",
      "Stupidity"
    ],
    "example": "Business acumen helps commerce graduates lead firms."
  },
  {
    "id": "hsc_adv_52",
    "word": "Altruistic",
    "ipa": "/ˌæl.truˈɪs.tɪk/",
    "pos": "Adj",
    "level": "advanced",
    "bn": "পরার্থপর, নিঃস্বার্থ",
    "meaningBn": "পরার্থপর, নিঃস্বার্থ",
    "synonyms": [
      "Selfless",
      "Philanthropic"
    ],
    "antonyms": [
      "Selfish",
      "Egoistic"
    ],
    "example": "Volunteering at blood drives is an altruistic act."
  },
  {
    "id": "hsc_adv_53",
    "word": "Anomalous",
    "ipa": "/əˈnɒm.ə.ləs/",
    "pos": "Adj",
    "level": "advanced",
    "bn": "ব্যতিক্রমী, অস্বাভাবিক",
    "meaningBn": "ব্যতিক্রমী, অস্বাভাবিক",
    "synonyms": [
      "Abnormal",
      "Irregular"
    ],
    "antonyms": [
      "Normal",
      "Standard"
    ],
    "example": "Scientists investigated the anomalous weather pattern."
  },
  {
    "id": "hsc_adv_54",
    "word": "Capricious",
    "ipa": "/kəˈprɪʃ.əs/",
    "pos": "Adj",
    "level": "advanced",
    "bn": "খামখেয়ালি, পরিবর্তনশীল",
    "meaningBn": "খামখেয়ালি, পরিবর্তনশীল",
    "synonyms": [
      "Fickle",
      "Unpredictable"
    ],
    "antonyms": [
      "Steady",
      "Consistent"
    ],
    "example": "Monsoon weather in Chattogram can be capricious."
  },
  {
    "id": "hsc_adv_55",
    "word": "Clandestine",
    "ipa": "/klænˈdes.tɪn/",
    "pos": "Adj",
    "level": "advanced",
    "bn": "গুপ্ত, গোপনীয়",
    "meaningBn": "গুপ্ত, গোপনীয়",
    "synonyms": [
      "Secret",
      "Covert"
    ],
    "antonyms": [
      "Open",
      "Overt"
    ],
    "example": "The committee held a clandestine meeting late at night."
  },
  {
    "id": "hsc_adv_56",
    "word": "Cogent",
    "ipa": "/ˈkəʊ.dʒənt/",
    "pos": "Adj",
    "level": "advanced",
    "bn": "অকাট্য, জোরালো",
    "meaningBn": "অকাট্য, জোরালো",
    "synonyms": [
      "Convincing",
      "Compelling"
    ],
    "antonyms": [
      "Weak",
      "Unconvincing"
    ],
    "example": "She presented a cogent argument during the debate."
  },
  {
    "id": "hsc_adv_57",
    "word": "Conspicuous",
    "ipa": "/kənˈspɪk.ju.əs/",
    "pos": "Adj",
    "level": "advanced",
    "bn": "সুস্পষ্ট, দৃষ্টি আকর্ষণকারী",
    "meaningBn": "সুস্পষ্ট, দৃষ্টি আকর্ষণকারী",
    "synonyms": [
      "Noticeable",
      "Prominent"
    ],
    "antonyms": [
      "Inconspicuous",
      "Hidden"
    ],
    "example": "His neat handwriting made his script conspicuous."
  },
  {
    "id": "hsc_adv_58",
    "word": "Corroborate",
    "ipa": "/kəˈrɒb.ə.reɪt/",
    "pos": "Verb",
    "level": "advanced",
    "bn": "সমর্থন বা সত্যায়ন করা",
    "meaningBn": "সমর্থন বা সত্যায়ন করা",
    "synonyms": [
      "Confirm",
      "Verify"
    ],
    "antonyms": [
      "Contradict",
      "Refute"
    ],
    "example": "Official data corroborated the researcher's claim."
  },
  {
    "id": "hsc_adv_59",
    "word": "Dearth",
    "ipa": "/dɜːθ/",
    "pos": "Noun",
    "level": "advanced",
    "bn": "অভাব, স্বল্পতা",
    "meaningBn": "অভাব, স্বল্পতা",
    "synonyms": [
      "Scarcity",
      "Shortage"
    ],
    "antonyms": [
      "Abundance",
      "Surplus"
    ],
    "example": "There is no dearth of free study resources online."
  },
  {
    "id": "hsc_adv_60",
    "word": "Discrepancy",
    "ipa": "/dɪˈskrep.ən.si/",
    "pos": "Noun",
    "level": "advanced",
    "bn": "অসংগতি, গরমিল",
    "meaningBn": "অসংগতি, গরমিল",
    "synonyms": [
      "Inconsistency",
      "Difference"
    ],
    "antonyms": [
      "Consistency",
      "Harmony"
    ],
    "example": "The auditor found a discrepancy in the ledger balance."
  },
  {
    "id": "hsc_adv_61",
    "word": "Dogmatic",
    "ipa": "/dɒɡˈmæt.ɪk/",
    "pos": "Adj",
    "level": "advanced",
    "bn": "গোঁড়া, মতান্ধ",
    "meaningBn": "গোঁড়া, মতান্ধ",
    "synonyms": [
      "Opinionated",
      "Rigid"
    ],
    "antonyms": [
      "Open-minded",
      "Flexible"
    ],
    "example": "Avoid a dogmatic tone when discussing social issues."
  },
  {
    "id": "hsc_adv_62",
    "word": "Ephemeral",
    "ipa": "/ɪˈfem.ər.əl/",
    "pos": "Adj",
    "level": "advanced",
    "bn": "ক্ষণস্থায়ী, স্বল্পকালীন",
    "meaningBn": "ক্ষণস্থায়ী, স্বল্পকালীন",
    "synonyms": [
      "Transient",
      "Fleeting"
    ],
    "antonyms": [
      "Permanent",
      "Eternal"
    ],
    "example": "Viral trends on the internet are usually ephemeral."
  },
  {
    "id": "hsc_adv_63",
    "word": "Equivocal",
    "ipa": "/ɪˈkwɪv.ə.kəl/",
    "pos": "Adj",
    "level": "advanced",
    "bn": "সন্দেহজনক, দ্ব্যর্থক",
    "meaningBn": "সন্দেহজনক, দ্ব্যর্থক",
    "synonyms": [
      "Ambiguous",
      "Evasive"
    ],
    "antonyms": [
      "Unambiguous",
      "Clear"
    ],
    "example": "The politician gave an equivocal answer to reporters."
  },
  {
    "id": "hsc_adv_64",
    "word": "Exacerbate",
    "ipa": "/ɪɡˈzæs.ə.beɪt/",
    "pos": "Verb",
    "level": "advanced",
    "bn": "আরও খারাপ বা তীব্রতর করা",
    "meaningBn": "আরও খারাপ বা তীব্রতর করা",
    "synonyms": [
      "Worsen",
      "Aggravate"
    ],
    "antonyms": [
      "Alleviate",
      "Ameliorate"
    ],
    "example": "Procrastination will only exacerbate exam pressure."
  },
  {
    "id": "hsc_adv_65",
    "word": "Fastidious",
    "ipa": "/fæsˈtɪd.i.əs/",
    "pos": "Adj",
    "level": "advanced",
    "bn": "অতি খুঁতখুঁতে, রুচিশীল",
    "meaningBn": "অতি খুঁতখুঁতে, রুচিশীল",
    "synonyms": [
      "Meticulous",
      "Choosy"
    ],
    "antonyms": [
      "Careless",
      "Easygoing"
    ],
    "example": "Copyeditors must be fastidious about spelling rules."
  },
  {
    "id": "hsc_adv_66",
    "word": "Gregarious",
    "ipa": "/ɡrɪˈɡeə.ri.əs/",
    "pos": "Adj",
    "level": "advanced",
    "bn": "মিশুক, সঙ্গপ্রিয়",
    "meaningBn": "মিশুক, সঙ্গপ্রিয়",
    "synonyms": [
      "Sociable",
      "Outgoing"
    ],
    "antonyms": [
      "Introverted",
      "Reclusive"
    ],
    "example": "Gregarious students enjoy peer study groups."
  },
  {
    "id": "hsc_adv_67",
    "word": "Impeccable",
    "ipa": "/ɪmˈpek.ə.bəl/",
    "pos": "Adj",
    "level": "advanced",
    "bn": "নিখুঁত, ত্রুটিহীন",
    "meaningBn": "নিখুঁত, ত্রুটিহীন",
    "synonyms": [
      "Flawless",
      "Faultless"
    ],
    "antonyms": [
      "Flawed",
      "Imperfect"
    ],
    "example": "Her English pronunciation is virtually impeccable."
  },
  {
    "id": "hsc_adv_68",
    "word": "Incessant",
    "ipa": "/ɪnˈses.ənt/",
    "pos": "Adj",
    "level": "advanced",
    "bn": "অবিরাম, বিরতিহীন",
    "meaningBn": "অবিরাম, বিরতিহীন",
    "synonyms": [
      "Constant",
      "Ceaseless"
    ],
    "antonyms": [
      "Intermittent",
      "Sporadic"
    ],
    "example": "Incessant rain flooded the low-lying roads in July."
  },
  {
    "id": "hsc_adv_69",
    "word": "Lethargic",
    "ipa": "/ləˈθɑː.dʒɪk/",
    "pos": "Adj",
    "level": "advanced",
    "bn": "অলস, নিস্তেজ",
    "meaningBn": "অলস, নিস্তেজ",
    "synonyms": [
      "Sluggish",
      "Listless"
    ],
    "antonyms": [
      "Energetic",
      "Active"
    ],
    "example": "Skipping breakfast often makes learners feel lethargic."
  },
  {
    "id": "hsc_adv_70",
    "word": "Mitigate",
    "ipa": "/ˈmɪt.ɪ.ɡeɪt/",
    "pos": "Verb",
    "level": "advanced",
    "bn": "প্রশমিত বা লঘু করা",
    "meaningBn": "প্রশমিত বা লঘু করা",
    "synonyms": [
      "Lessen",
      "Reduce"
    ],
    "antonyms": [
      "Intensify",
      "Aggravate"
    ],
    "example": "Planting trees helps mitigate urban heat islands."
  },
  {
    "id": "hsc_adv_71",
    "word": "Ostentatious",
    "ipa": "/ˌɒs.tenˈteɪ.ʃəs/",
    "pos": "Adj",
    "level": "advanced",
    "bn": "আড়ম্বরপূর্ণ, লোকদেখানো",
    "meaningBn": "আড়ম্বরপূর্ণ, লোকদেখানো",
    "synonyms": [
      "Showy",
      "Pretentious"
    ],
    "antonyms": [
      "Modest",
      "Unassuming"
    ],
    "example": "Wise investors avoid ostentatious displays of wealth."
  },
  {
    "id": "hsc_adv_72",
    "word": "Pervasive",
    "ipa": "/pəˈveɪ.sɪv/",
    "pos": "Adj",
    "level": "advanced",
    "bn": "সর্বব্যাপী, পরিব্যাপ্ত",
    "meaningBn": "সর্বব্যাপী, পরিব্যাপ্ত",
    "synonyms": [
      "Widespread",
      "Ubiquitous"
    ],
    "antonyms": [
      "Limited",
      "Localized"
    ],
    "example": "Digital tools have a pervasive influence on education."
  },
  {
    "id": "hsc_adv_73",
    "word": "Taciturn",
    "ipa": "/ˈtæs.ɪ.tɜːn/",
    "pos": "Adj",
    "level": "advanced",
    "bn": "স্বল্পভাষী, চুপচাপ",
    "meaningBn": "স্বল্পভাষী, চুপচাপ",
    "synonyms": [
      "Reticent",
      "Reserved"
    ],
    "antonyms": [
      "Talkative",
      "Garrulous"
    ],
    "example": "Though taciturn in person, his writing is eloquent."
  },
  {
    "id": "hsc_adv_74",
    "word": "Ubiquitous",
    "ipa": "/juːˈbɪk.wɪ.təs/",
    "pos": "Adj",
    "level": "advanced",
    "bn": "সর্বত্র বিরাজমান",
    "meaningBn": "সর্বত্র বিরাজমান",
    "synonyms": [
      "Omnipresent",
      "Universal"
    ],
    "antonyms": [
      "Rare",
      "Scarce"
    ],
    "example": "Mobile apps have become ubiquitous among students."
  },
  {
    "id": "hsc_adv_75",
    "word": "Vindicate",
    "ipa": "/ˈvɪn.dɪ.keɪt/",
    "pos": "Verb",
    "level": "advanced",
    "bn": "নির্দোষ প্রমাণ করা",
    "meaningBn": "নির্দোষ প্রমাণ করা",
    "synonyms": [
      "Exonerate",
      "Justify"
    ],
    "antonyms": [
      "Condemn",
      "Blame"
    ],
    "example": "Top exam results vindicated her strict study routine."
  },
  {
    "id": "hsc_pro_76",
    "word": "Abstruse",
    "ipa": "/æbˈstruːs/",
    "pos": "Adj",
    "level": "pro",
    "bn": "দুর্বোধ্য, গূঢ়",
    "meaningBn": "দুর্বোধ্য, গূঢ়",
    "synonyms": [
      "Obscure",
      "Arcane"
    ],
    "antonyms": [
      "Clear",
      "Lucid"
    ],
    "example": "Some philosophical texts are too abstruse for beginners."
  },
  {
    "id": "hsc_pro_77",
    "word": "Acrimonious",
    "ipa": "/ˌæk.rɪˈməʊ.ni.əs/",
    "pos": "Adj",
    "level": "pro",
    "bn": "তিক্ত, রূঢ়",
    "meaningBn": "তিক্ত, রূঢ়",
    "synonyms": [
      "Bitter",
      "Caustic"
    ],
    "antonyms": [
      "Harmonious",
      "Amicable"
    ],
    "example": "An acrimonious debate erupted over the policy change."
  },
  {
    "id": "hsc_pro_78",
    "word": "Anachronism",
    "ipa": "/əˈnæk.rə.nɪ.zəm/",
    "pos": "Noun",
    "level": "pro",
    "bn": "কালবিরোধী বস্তু বা প্রথা",
    "meaningBn": "কালবিরোধী বস্তু বা প্রথা",
    "synonyms": [
      "Misplacement",
      "Relic"
    ],
    "antonyms": [
      "Modernity",
      "Novelty"
    ],
    "example": "A typewriter in a modern AI lab looks like an anachronism."
  },
  {
    "id": "hsc_pro_79",
    "word": "Bellicose",
    "ipa": "/ˈbel.ɪ.kəʊs/",
    "pos": "Adj",
    "level": "pro",
    "bn": "যুদ্ধবাজ, কলহপ্রিয়",
    "meaningBn": "যুদ্ধবাজ, কলহপ্রিয়",
    "synonyms": [
      "Aggressive",
      "Pugnacious"
    ],
    "antonyms": [
      "Peaceful",
      "Pacifistic"
    ],
    "example": "Bellicose rhetoric only escalates diplomatic tension."
  },
  {
    "id": "hsc_pro_80",
    "word": "Cacophony",
    "ipa": "/kəˈkɒf.ə.ni/",
    "pos": "Noun",
    "level": "pro",
    "bn": "কর্কশ ও বেসুরো শব্দ",
    "meaningBn": "কর্কশ ও বেসুরো শব্দ",
    "synonyms": [
      "Din",
      "Discord"
    ],
    "antonyms": [
      "Harmony",
      "Euphony"
    ],
    "example": "A cacophony of car horns echoed across the intersection."
  },
  {
    "id": "hsc_pro_81",
    "word": "Deleterious",
    "ipa": "/ˌdel.ɪˈtɪə.ri.əs/",
    "pos": "Adj",
    "level": "pro",
    "bn": "ক্ষতিকর, অনিষ্টকর",
    "meaningBn": "ক্ষতিকর, অনিষ্টকর",
    "synonyms": [
      "Harmful",
      "Detrimental"
    ],
    "antonyms": [
      "Beneficial",
      "Salutary"
    ],
    "example": "Excessive screen time at night has deleterious effects."
  },
  {
    "id": "hsc_pro_82",
    "word": "Enigma",
    "ipa": "/ɪˈnɪɡ.mə/",
    "pos": "Noun",
    "level": "pro",
    "bn": "রহস্য, প্রহেলিকা",
    "meaningBn": "রহস্য, প্রহেলিকা",
    "synonyms": [
      "Mystery",
      "Puzzle"
    ],
    "antonyms": [
      "Clarity",
      "Solution"
    ],
    "example": "How the ancient monument was built remains an enigma."
  },
  {
    "id": "hsc_pro_83",
    "word": "Equanimity",
    "ipa": "/ˌek.wəˈnɪm.ə.ti/",
    "pos": "Noun",
    "level": "pro",
    "bn": "মানসিক স্থিরতা, ধৈর্য",
    "meaningBn": "মানসিক স্থিরতা, ধৈর্য",
    "synonyms": [
      "Composure",
      "Poise"
    ],
    "antonyms": [
      "Anxiety",
      "Agitation"
    ],
    "example": "Face tough admission questions with calm equanimity."
  },
  {
    "id": "hsc_pro_84",
    "word": "Esoteric",
    "ipa": "/ˌiː.səˈter.ɪk/",
    "pos": "Adj",
    "level": "pro",
    "bn": "গূঢ়, কেবল বিশেষজ্ঞদের বোধগম্য",
    "meaningBn": "গূঢ়, কেবল বিশেষজ্ঞদের বোধগম্য",
    "synonyms": [
      "Cryptic",
      "Arcane"
    ],
    "antonyms": [
      "Common",
      "Accessible"
    ],
    "example": "The seminar focused on esoteric monetary theories."
  },
  {
    "id": "hsc_pro_85",
    "word": "Garrulous",
    "ipa": "/ˈɡær.əl.əs/",
    "pos": "Adj",
    "level": "pro",
    "bn": "বাচাল, অতিভাষী",
    "meaningBn": "বাচাল, অতিভাষী",
    "synonyms": [
      "Talkative",
      "Loquacious"
    ],
    "antonyms": [
      "Taciturn",
      "Reticent"
    ],
    "example": "A garrulous neighbor kept chatting during study hours."
  },
  {
    "id": "hsc_pro_86",
    "word": "Iconoclast",
    "ipa": "/aɪˈkɒn.ə.klæst/",
    "pos": "Noun",
    "level": "pro",
    "bn": "প্রচলিত প্রথা ভাঙেন যিনি",
    "meaningBn": "প্রচলিত প্রথা ভাঙেন যিনি",
    "synonyms": [
      "Rebel",
      "Nonconformist"
    ],
    "antonyms": [
      "Conformist",
      "Traditionalist"
    ],
    "example": "Every scientific revolution is led by an iconoclast."
  },
  {
    "id": "hsc_pro_87",
    "word": "Incorrigible",
    "ipa": "/ɪnˈkɒr.ɪ.dʒə.bəl/",
    "pos": "Adj",
    "level": "pro",
    "bn": "অসংশোধনীয়",
    "meaningBn": "অসংশোধনীয়",
    "synonyms": [
      "Incurable",
      "Habitual"
    ],
    "antonyms": [
      "Reformable",
      "Correctable"
    ],
    "example": "She is an incorrigible bookworm who reads every night."
  },
  {
    "id": "hsc_pro_88",
    "word": "Insipid",
    "ipa": "/ɪnˈsɪp.ɪd/",
    "pos": "Adj",
    "level": "pro",
    "bn": "নীরস, স্বাদহীন",
    "meaningBn": "নীরস, স্বাদহীন",
    "synonyms": [
      "Bland",
      "Dull"
    ],
    "antonyms": [
      "Engaging",
      "Exciting"
    ],
    "example": "Avoid writing insipid introductions in creative essays."
  },
  {
    "id": "hsc_pro_89",
    "word": "Magnanimous",
    "ipa": "/mæɡˈnæn.ɪ.məs/",
    "pos": "Adj",
    "level": "pro",
    "bn": "উদারচেতা, মহৎপ্রাণ",
    "meaningBn": "উদারচেতা, মহৎপ্রাণ",
    "synonyms": [
      "Generous",
      "Noble"
    ],
    "antonyms": [
      "Petty",
      "Vindictive"
    ],
    "example": "The winner was magnanimous toward the runner-up."
  },
  {
    "id": "hsc_pro_90",
    "word": "Mendacious",
    "ipa": "/menˈdeɪ.ʃəs/",
    "pos": "Adj",
    "level": "pro",
    "bn": "মিথ্যাবাদী, অসত্য",
    "meaningBn": "মিথ্যাবাদী, অসত্য",
    "synonyms": [
      "Dishonest",
      "Deceitful"
    ],
    "antonyms": [
      "Truthful",
      "Veracious"
    ],
    "example": "Fact-checkers quickly exposed the mendacious article."
  },
  {
    "id": "hsc_pro_91",
    "word": "Munificent",
    "ipa": "/mjuːˈnɪf.ɪ.sənt/",
    "pos": "Adj",
    "level": "pro",
    "bn": "অত্যন্ত দানশীল",
    "meaningBn": "অত্যন্ত দানশীল",
    "synonyms": [
      "Bountiful",
      "Lavish"
    ],
    "antonyms": [
      "Stingy",
      "Miserly"
    ],
    "example": "The trust made a munificent donation to rural schools."
  },
  {
    "id": "hsc_pro_92",
    "word": "Nefarious",
    "ipa": "/nəˈfeə.ri.əs/",
    "pos": "Adj",
    "level": "pro",
    "bn": "দুষ্ট, জঘন্য",
    "meaningBn": "দুষ্ট, জঘন্য",
    "synonyms": [
      "Wicked",
      "Villainous"
    ],
    "antonyms": [
      "Virtuous",
      "Noble"
    ],
    "example": "Cybercriminals use nefarious schemes to steal data."
  },
  {
    "id": "hsc_pro_93",
    "word": "Obfuscate",
    "ipa": "/ˈɒb.fʌs.keɪt/",
    "pos": "Verb",
    "level": "pro",
    "bn": "বিভ্রান্ত বা অস্পষ্ট করা",
    "meaningBn": "বিভ্রান্ত বা অস্পষ্ট করা",
    "synonyms": [
      "Confuse",
      "Cloud"
    ],
    "antonyms": [
      "Clarify",
      "Illuminate"
    ],
    "example": "Do not use heavy jargon to obfuscate simple ideas."
  },
  {
    "id": "hsc_pro_94",
    "word": "Obsequious",
    "ipa": "/əbˈsiː.kwi.əs/",
    "pos": "Adj",
    "level": "pro",
    "bn": "চাটুকার, অতি-আজ্ঞাবহ",
    "meaningBn": "চাটুকার, অতি-আজ্ঞাবহ",
    "synonyms": [
      "Sycophantic",
      "Servile"
    ],
    "antonyms": [
      "Assertive",
      "Independent"
    ],
    "example": "Leaders should beware of obsequious advisors."
  },
  {
    "id": "hsc_pro_95",
    "word": "Parsimonious",
    "ipa": "/ˌpɑː.sɪˈməʊ.ni.əs/",
    "pos": "Adj",
    "level": "pro",
    "bn": "অতি কৃপণ",
    "meaningBn": "অতি কৃপণ",
    "synonyms": [
      "Stingy",
      "Miserly"
    ],
    "antonyms": [
      "Generous",
      "Lavish"
    ],
    "example": "A parsimonious budget left zero funds for research."
  },
  {
    "id": "hsc_pro_96",
    "word": "Perfidy",
    "ipa": "/ˈpɜː.fə.di/",
    "pos": "Noun",
    "level": "pro",
    "bn": "বিশ্বাসঘাতকতা",
    "meaningBn": "বিশ্বাসঘাতকতা",
    "synonyms": [
      "Treachery",
      "Betrayal"
    ],
    "antonyms": [
      "Loyalty",
      "Fidelity"
    ],
    "example": "History condemns acts of perfidy against one's nation."
  },
  {
    "id": "hsc_pro_97",
    "word": "Perspicacious",
    "ipa": "/ˌpɜː.spɪˈkeɪ.ʃəs/",
    "pos": "Adj",
    "level": "pro",
    "bn": "তীক্ষ্ণবুদ্ধিসম্পন্ন, বিচক্ষণ",
    "meaningBn": "তীক্ষ্ণবুদ্ধিসম্পন্ন, বিচক্ষণ",
    "synonyms": [
      "Astute",
      "Shrewd"
    ],
    "antonyms": [
      "Obtuse",
      "Dull"
    ],
    "example": "Her perspicacious analysis solved the case study fast."
  },
  {
    "id": "hsc_pro_98",
    "word": "Recalcitrant",
    "ipa": "/rɪˈkæl.sɪ.trənt/",
    "pos": "Adj",
    "level": "pro",
    "bn": "অবাধ্য, একগুঁয়ে",
    "meaningBn": "অবাধ্য, একগুঁয়ে",
    "synonyms": [
      "Defiant",
      "Stubborn"
    ],
    "antonyms": [
      "Compliant",
      "Obedient"
    ],
    "example": "The recalcitrant faction refused to sign the accord."
  },
  {
    "id": "hsc_pro_99",
    "word": "Sycophant",
    "ipa": "/ˈsɪk.ə.fænt/",
    "pos": "Noun",
    "level": "pro",
    "bn": "তোষামোদকারী, চাটুকার",
    "meaningBn": "তোষামোদকারী, চাটুকার",
    "synonyms": [
      "Flatterer",
      "Toady"
    ],
    "antonyms": [
      "Critic",
      "Detractor"
    ],
    "example": "Surround yourself with honest peers, not sycophants."
  },
  {
    "id": "hsc_pro_100",
    "word": "Vociferous",
    "ipa": "/vəˈsɪf.ər.əs/",
    "pos": "Adj",
    "level": "pro",
    "bn": "উচ্চকণ্ঠ, সোচ্চার",
    "meaningBn": "উচ্চকণ্ঠ, সোচ্চার",
    "synonyms": [
      "Outspoken",
      "Clamorously"
    ],
    "antonyms": [
      "Quiet",
      "Subdued"
    ],
    "example": "Students were vociferous in demanding better lab facilities."
  },
  {
    "word": "Abolish",
    "ipa": "/əˈbɒl.ɪʃ/",
    "pos": "Verb",
    "level": "beginner",
    "bn": "বিলুপ্ত বা বাতিল করা",
    "meaningBn": "বিলুপ্ত বা বাতিল করা",
    "synonyms": [
      "Eliminate",
      "Repeal"
    ],
    "antonyms": [
      "Establish",
      "Retain"
    ],
    "example": "Many nations passed laws to abolish child labor.",
    "id": "hsc_beg_101"
  },
  {
    "word": "Absorb",
    "ipa": "/əbˈzɔːb/",
    "pos": "Verb",
    "level": "beginner",
    "bn": "শুষে নেওয়া, আত্মস্থ করা",
    "meaningBn": "শুষে নেওয়া, আত্মস্থ করা",
    "synonyms": [
      "Soak up",
      "Assimilate"
    ],
    "antonyms": [
      "Emit",
      "Release"
    ],
    "example": "Dry soil quickly absorbs the first monsoon rain.",
    "id": "hsc_beg_102"
  },
  {
    "word": "Acknowledge",
    "ipa": "/əkˈnɒl.ɪdʒ/",
    "pos": "Verb",
    "level": "beginner",
    "bn": "স্বীকার করা, প্রাপ্তি স্বীকার করা",
    "meaningBn": "স্বীকার করা, প্রাপ্তি স্বীকার করা",
    "synonyms": [
      "Admit",
      "Recognize"
    ],
    "antonyms": [
      "Deny",
      "Ignore"
    ],
    "example": "Good leaders acknowledge their mistakes openly.",
    "id": "hsc_beg_103"
  },
  {
    "word": "Acquire",
    "ipa": "/əˈkwaɪər/",
    "pos": "Verb",
    "level": "beginner",
    "bn": "অর্জন বা লাভ করা",
    "meaningBn": "অর্জন বা লাভ করা",
    "synonyms": [
      "Obtain",
      "Gain"
    ],
    "antonyms": [
      "Lose",
      "Forfeit"
    ],
    "example": "Students acquire confidence through daily speaking practice.",
    "id": "hsc_beg_104"
  },
  {
    "word": "Adapt",
    "ipa": "/əˈdæpt/",
    "pos": "Verb",
    "level": "beginner",
    "bn": "মানিয়ে নেওয়া, খাপ খাওয়ানো",
    "meaningBn": "মানিয়ে নেওয়া, খাপ খাওয়ানো",
    "synonyms": [
      "Adjust",
      "Modify"
    ],
    "antonyms": [
      "Resist",
      "Neglect"
    ],
    "example": "Successful learners quickly adapt to new exam patterns.",
    "id": "hsc_beg_105"
  },
  {
    "word": "Afford",
    "ipa": "/əˈfɔːd/",
    "pos": "Verb",
    "level": "beginner",
    "bn": "সামর্থ্য থাকা",
    "meaningBn": "সামর্থ্য থাকা",
    "synonyms": [
      "Manage",
      "Spare"
    ],
    "antonyms": [
      "Lack",
      "Forgo"
    ],
    "example": "We cannot afford to waste time before board exams.",
    "id": "hsc_beg_106"
  },
  {
    "word": "Anticipate",
    "ipa": "/ænˈtɪs.ɪ.peɪt/",
    "pos": "Verb",
    "level": "beginner",
    "bn": "পূর্বাভাস পাওয়া, প্রত্যাশা করা",
    "meaningBn": "পূর্বাভাস পাওয়া, প্রত্যাশা করা",
    "synonyms": [
      "Expect",
      "Foresee"
    ],
    "antonyms": [
      "Doubt",
      "Dread"
    ],
    "example": "Organizers anticipate a large turnout at the book fair.",
    "id": "hsc_beg_107"
  },
  {
    "word": "Assemble",
    "ipa": "/əˈsem.bəl/",
    "pos": "Verb",
    "level": "beginner",
    "bn": "একত্রিত করা বা হওয়া",
    "meaningBn": "একত্রিত করা বা হওয়া",
    "synonyms": [
      "Gather",
      "Collect"
    ],
    "antonyms": [
      "Disperse",
      "Scatter"
    ],
    "example": "All students assembled in the hall for the seminar.",
    "id": "hsc_beg_108"
  },
  {
    "word": "Blunt",
    "ipa": "/blʌnt/",
    "pos": "Adj",
    "level": "beginner",
    "bn": "ভোঁতা; স্পষ্টভাষী",
    "meaningBn": "ভোঁতা; স্পষ্টভাষী",
    "synonyms": [
      "Dull",
      "Outspoken"
    ],
    "antonyms": [
      "Sharp",
      "Tactful"
    ],
    "example": "Avoid cutting thick cardboard with a blunt knife.",
    "id": "hsc_beg_109"
  },
  {
    "word": "Brisk",
    "ipa": "/brɪsk/",
    "pos": "Adj",
    "level": "beginner",
    "bn": "চটপটে, দ্রুতগতির",
    "meaningBn": "চটপটে, দ্রুতগতির",
    "synonyms": [
      "Lively",
      "Energetic"
    ],
    "antonyms": [
      "Sluggish",
      "Slow"
    ],
    "example": "A brisk morning walk refreshes the mind before study.",
    "id": "hsc_beg_110"
  },
  {
    "word": "Cease",
    "ipa": "/siːs/",
    "pos": "Verb",
    "level": "beginner",
    "bn": "থামা, বন্ধ হওয়া",
    "meaningBn": "থামা, বন্ধ হওয়া",
    "synonyms": [
      "Stop",
      "Halt"
    ],
    "antonyms": [
      "Continue",
      "Persist"
    ],
    "example": "The heavy rainfall finally ceased by late afternoon.",
    "id": "hsc_beg_111"
  },
  {
    "word": "Clumsy",
    "ipa": "/ˈklʌm.zi/",
    "pos": "Adj",
    "level": "beginner",
    "bn": "আনাড়ি, জবুথবু",
    "meaningBn": "আনাড়ি, জবুথবু",
    "synonyms": [
      "Awkward",
      "Ungraceful"
    ],
    "antonyms": [
      "Graceful",
      "Skillful"
    ],
    "example": "His clumsy apology only made the situation worse.",
    "id": "hsc_beg_112"
  },
  {
    "word": "Compel",
    "ipa": "/kəmˈpel/",
    "pos": "Verb",
    "level": "beginner",
    "bn": "বাধ্য করা",
    "meaningBn": "বাধ্য করা",
    "synonyms": [
      "Force",
      "Oblige"
    ],
    "antonyms": [
      "Persuade",
      "Allow"
    ],
    "example": "Bad weather compelled the team to postpone the match.",
    "id": "hsc_beg_113"
  },
  {
    "word": "Consent",
    "ipa": "/kənˈsent/",
    "pos": "Noun",
    "level": "beginner",
    "bn": "সম্মতি, অনুমতি",
    "meaningBn": "সম্মতি, অনুমতি",
    "synonyms": [
      "Permission",
      "Approval"
    ],
    "antonyms": [
      "Refusal",
      "Dissent"
    ],
    "example": "No data is shared without the user's explicit consent.",
    "id": "hsc_beg_114"
  },
  {
    "word": "Conserve",
    "ipa": "/kənˈsɜːv/",
    "pos": "Verb",
    "level": "beginner",
    "bn": "সংরক্ষণ করা",
    "meaningBn": "সংরক্ষণ করা",
    "synonyms": [
      "Preserve",
      "Save"
    ],
    "antonyms": [
      "Waste",
      "Squander"
    ],
    "example": "Turning off unused lights helps conserve electricity.",
    "id": "hsc_beg_115"
  },
  {
    "word": "Dense",
    "ipa": "/dens/",
    "pos": "Adj",
    "level": "beginner",
    "bn": "ঘন, নিবিড়",
    "meaningBn": "ঘন, নিবিড়",
    "synonyms": [
      "Thick",
      "Compact"
    ],
    "antonyms": [
      "Sparse",
      "Thin"
    ],
    "example": "Dense fog delayed early morning ferries on the river.",
    "id": "hsc_beg_116"
  },
  {
    "word": "Deprive",
    "ipa": "/dɪˈpraɪv/",
    "pos": "Verb",
    "level": "beginner",
    "bn": "বঞ্চিত করা",
    "meaningBn": "বঞ্চিত করা",
    "synonyms": [
      "Strip",
      "Deny"
    ],
    "antonyms": [
      "Provide",
      "Supply"
    ],
    "example": "Poverty should never deprive any child of education.",
    "id": "hsc_beg_117"
  },
  {
    "word": "Diminish",
    "ipa": "/dɪˈmɪn.ɪʃ/",
    "pos": "Verb",
    "level": "beginner",
    "bn": "কমে যাওয়া, হ্রাস করা",
    "meaningBn": "কমে যাওয়া, হ্রাস করা",
    "synonyms": [
      "Decrease",
      "Lessen"
    ],
    "antonyms": [
      "Increase",
      "Expand"
    ],
    "example": "Regular practice will diminish your fear of grammar.",
    "id": "hsc_beg_118"
  },
  {
    "word": "Elaborate",
    "ipa": "/ɪˈlæb.ər.ət/",
    "pos": "Adj",
    "level": "beginner",
    "bn": "বিস্তারিত, সূক্ষ্মভাবে তৈরি",
    "meaningBn": "বিস্তারিত, সূক্ষ্মভাবে তৈরি",
    "synonyms": [
      "Detailed",
      "Intricate"
    ],
    "antonyms": [
      "Simple",
      "Plain"
    ],
    "example": "She drew an elaborate diagram of the economic cycle.",
    "id": "hsc_beg_119"
  },
  {
    "word": "Emerge",
    "ipa": "/ɪˈmɜːdʒ/",
    "pos": "Verb",
    "level": "beginner",
    "bn": "আত্মপ্রকাশ করা, বেরিয়ে আসা",
    "meaningBn": "আত্মপ্রকাশ করা, বেরিয়ে আসা",
    "synonyms": [
      "Appear",
      "Surface"
    ],
    "antonyms": [
      "Vanish",
      "Disappear"
    ],
    "example": "New startups continue to emerge in the digital sector.",
    "id": "hsc_beg_120"
  },
  {
    "word": "Fierce",
    "ipa": "/fɪəs/",
    "pos": "Adj",
    "level": "beginner",
    "bn": "তীব্র, প্রচণ্ড",
    "meaningBn": "তীব্র, প্রচণ্ড",
    "synonyms": [
      "Intense",
      "Ferocious"
    ],
    "antonyms": [
      "Mild",
      "Gentle"
    ],
    "example": "Competition for Dhaka University seats is always fierce.",
    "id": "hsc_beg_121"
  },
  {
    "word": "Glimpse",
    "ipa": "/ɡlɪmps/",
    "pos": "Noun",
    "level": "beginner",
    "bn": "একঝলক দেখা",
    "meaningBn": "একঝলক দেখা",
    "synonyms": [
      "Glance",
      "Peek"
    ],
    "antonyms": [
      "Stare",
      "Gaze"
    ],
    "example": "We caught a brief glimpse of the hills through the mist.",
    "id": "hsc_beg_122"
  },
  {
    "word": "Hinder",
    "ipa": "/ˈhɪn.dər/",
    "pos": "Verb",
    "level": "beginner",
    "bn": "বাধা দেওয়া, ব্যাহত করা",
    "meaningBn": "বাধা দেওয়া, ব্যাহত করা",
    "synonyms": [
      "Obstruct",
      "Impede"
    ],
    "antonyms": [
      "Assist",
      "Facilitate"
    ],
    "example": "Constant phone notifications hinder deep concentration.",
    "id": "hsc_beg_123"
  },
  {
    "word": "Prompt",
    "ipa": "/prɒmpt/",
    "pos": "Adj",
    "level": "beginner",
    "bn": "তৎপর, দ্রুত",
    "meaningBn": "তৎপর, দ্রুত",
    "synonyms": [
      "Quick",
      "Immediate"
    ],
    "antonyms": [
      "Slow",
      "Delayed"
    ],
    "example": "Prompt action prevented the minor error from spreading.",
    "id": "hsc_beg_124"
  },
  {
    "word": "Thrive",
    "ipa": "/θraɪv/",
    "pos": "Verb",
    "level": "beginner",
    "bn": "সমৃদ্ধ হওয়া, বেড়ে ওঠা",
    "meaningBn": "সমৃদ্ধ হওয়া, বেড়ে ওঠা",
    "synonyms": [
      "Flourish",
      "Prosper"
    ],
    "antonyms": [
      "Decline",
      "Wither"
    ],
    "example": "Young businesses thrive when customer trust is high.",
    "id": "hsc_beg_125"
  },
  {
    "word": "Advocate",
    "ipa": "/ˈæd.və.keɪt/",
    "pos": "Verb",
    "level": "intermediate",
    "bn": "সমর্থন করা, পক্ষে বলা",
    "meaningBn": "সমর্থন করা, পক্ষে বলা",
    "synonyms": [
      "Support",
      "Champion"
    ],
    "antonyms": [
      "Oppose",
      "Criticize"
    ],
    "example": "Economists advocate sustainable investments in education.",
    "id": "hsc_int_126"
  },
  {
    "word": "Aesthetic",
    "ipa": "/iːsˈθet.ɪk/",
    "pos": "Adj",
    "level": "intermediate",
    "bn": "নান্দনিক, সৌন্দর্যবোধসম্পন্ন",
    "meaningBn": "নান্দনিক, সৌন্দর্যবোধসম্পন্ন",
    "synonyms": [
      "Artistic",
      "Tasteful"
    ],
    "antonyms": [
      "Unattractive",
      "Plain"
    ],
    "example": "The portfolio uses a soft, aesthetic color palette.",
    "id": "hsc_int_127"
  },
  {
    "word": "Aloof",
    "ipa": "/əˈluːf/",
    "pos": "Adj",
    "level": "intermediate",
    "bn": "নির্লিপ্ত, দূরে সরে থাকা",
    "meaningBn": "নির্লিপ্ত, দূরে সরে থাকা",
    "synonyms": [
      "Detached",
      "Distant"
    ],
    "antonyms": [
      "Friendly",
      "Involved"
    ],
    "example": "He remained aloof from unnecessary campus politics.",
    "id": "hsc_int_128"
  },
  {
    "word": "Benevolence",
    "ipa": "/bəˈnev.əl.əns/",
    "pos": "Noun",
    "level": "intermediate",
    "bn": "বদান্যতা, পরোপকারিতা",
    "meaningBn": "বদান্যতা, পরোপকারিতা",
    "synonyms": [
      "Kindness",
      "Charity"
    ],
    "antonyms": [
      "Malice",
      "Cruelty"
    ],
    "example": "Her benevolence earned the respect of the entire community.",
    "id": "hsc_int_129"
  },
  {
    "word": "Bolster",
    "ipa": "/ˈbəʊl.stər/",
    "pos": "Verb",
    "level": "intermediate",
    "bn": "শক্তিশালী বা সমর্থন করা",
    "meaningBn": "শক্তিশালী বা সমর্থন করা",
    "synonyms": [
      "Strengthen",
      "Reinforce"
    ],
    "antonyms": [
      "Undermine",
      "Weaken"
    ],
    "example": "Solving past question papers will bolster your confidence.",
    "id": "hsc_int_130"
  },
  {
    "word": "Chronic",
    "ipa": "/ˈkrɒn.ɪk/",
    "pos": "Adj",
    "level": "intermediate",
    "bn": "দীর্ঘস্থায়ী, পুরাতন",
    "meaningBn": "দীর্ঘস্থায়ী, পুরাতন",
    "synonyms": [
      "Persistent",
      "Constant"
    ],
    "antonyms": [
      "Temporary",
      "Acute"
    ],
    "example": "Chronic traffic congestion affects urban productivity.",
    "id": "hsc_int_131"
  },
  {
    "word": "Collaborate",
    "ipa": "/kəˈlæb.ə.reɪt/",
    "pos": "Verb",
    "level": "intermediate",
    "bn": "যৌথভাবে কাজ করা",
    "meaningBn": "যৌথভাবে কাজ করা",
    "synonyms": [
      "Cooperate",
      "Team up"
    ],
    "antonyms": [
      "Compete",
      "Oppose"
    ],
    "example": "Students collaborate on group presentations every week.",
    "id": "hsc_int_132"
  },
  {
    "word": "Compile",
    "ipa": "/kəmˈpaɪl/",
    "pos": "Verb",
    "level": "intermediate",
    "bn": "সংকলন করা, একত্র করা",
    "meaningBn": "সংকলন করা, একত্র করা",
    "synonyms": [
      "Gather",
      "Assemble"
    ],
    "antonyms": [
      "Scatter",
      "Disperse"
    ],
    "example": "She compiled a notebook of high-frequency idioms.",
    "id": "hsc_int_133"
  },
  {
    "word": "Comprehensive",
    "ipa": "/ˌkɒm.prɪˈhen.sɪv/",
    "pos": "Adj",
    "level": "intermediate",
    "bn": "সামগ্রিক, ব্যাপক",
    "meaningBn": "সামগ্রিক, ব্যাপক",
    "synonyms": [
      "Thorough",
      "Complete"
    ],
    "antonyms": [
      "Incomplete",
      "Partial"
    ],
    "example": "The guide offers a comprehensive review of C-Unit English.",
    "id": "hsc_int_134"
  },
  {
    "word": "Conducive",
    "ipa": "/kənˈdʒuː.sɪv/",
    "pos": "Adj",
    "level": "intermediate",
    "bn": "সহায়ক, অনুকূল",
    "meaningBn": "সহায়ক, অনুকূল",
    "synonyms": [
      "Favorable",
      "Helpful"
    ],
    "antonyms": [
      "Unfavorable",
      "Adverse"
    ],
    "example": "A quiet study desk is conducive to focused learning.",
    "id": "hsc_int_135"
  },
  {
    "word": "Controversial",
    "ipa": "/ˌkɒn.trəˈvɜː.ʃəl/",
    "pos": "Adj",
    "level": "intermediate",
    "bn": "বিতর্কিত",
    "meaningBn": "বিতর্কিত",
    "synonyms": [
      "Debatable",
      "Disputed"
    ],
    "antonyms": [
      "Undisputed",
      "Agreed"
    ],
    "example": "The new tax policy sparked a controversial debate.",
    "id": "hsc_int_136"
  },
  {
    "word": "Culminate",
    "ipa": "/ˈkʌl.mɪ.neɪt/",
    "pos": "Verb",
    "level": "intermediate",
    "bn": "চূড়ান্ত পরিণতিতে পৌঁছানো",
    "meaningBn": "চূড়ান্ত পরিণতিতে পৌঁছানো",
    "synonyms": [
      "Conclude",
      "Peak"
    ],
    "antonyms": [
      "Begin",
      "Commence"
    ],
    "example": "Months of preparation culminated in an outstanding result.",
    "id": "hsc_int_137"
  },
  {
    "word": "Diligence",
    "ipa": "/ˈdɪl.ɪ.dʒəns/",
    "pos": "Noun",
    "level": "intermediate",
    "bn": "অধ্যবসায়, নিষ্ঠা",
    "meaningBn": "অধ্যবসায়, নিষ্ঠা",
    "synonyms": [
      "Perseverance",
      "Effort"
    ],
    "antonyms": [
      "Laziness",
      "Negligence"
    ],
    "example": "Success in competitive exams rewards steady diligence.",
    "id": "hsc_int_138"
  },
  {
    "word": "Discreet",
    "ipa": "/dɪˈskriːt/",
    "pos": "Adj",
    "level": "intermediate",
    "bn": "বিচক্ষণ, গোপনীয়তা রক্ষাকারী",
    "meaningBn": "বিচক্ষণ, গোপনীয়তা রক্ষাকারী",
    "synonyms": [
      "Prudent",
      "Tactful"
    ],
    "antonyms": [
      "Indiscreet",
      "Reckless"
    ],
    "example": "Be discreet when sharing sensitive account credentials.",
    "id": "hsc_int_139"
  },
  {
    "word": "Empathy",
    "ipa": "/ˈem.pə.θi/",
    "pos": "Noun",
    "level": "intermediate",
    "bn": "সহমর্মিতা",
    "meaningBn": "সহমর্মিতা",
    "synonyms": [
      "Compassion",
      "Understanding"
    ],
    "antonyms": [
      "Indifference",
      "Apathy"
    ],
    "example": "Good teachers listen to student struggles with empathy.",
    "id": "hsc_int_140"
  },
  {
    "word": "Endorse",
    "ipa": "/ɪnˈdɔːs/",
    "pos": "Verb",
    "level": "intermediate",
    "bn": "অনুমোদন বা সমর্থন করা",
    "meaningBn": "অনুমোদন বা সমর্থন করা",
    "synonyms": [
      "Approve",
      "Support"
    ],
    "antonyms": [
      "Reject",
      "Oppose"
    ],
    "example": "Experts endorse spaced repetition for vocabulary mastery.",
    "id": "hsc_int_141"
  },
  {
    "word": "Fluctuate",
    "ipa": "/ˈflʌk.tʃu.eɪt/",
    "pos": "Verb",
    "level": "intermediate",
    "bn": "ওঠানামা করা, অস্থির থাকা",
    "meaningBn": "ওঠানামা করা, অস্থির থাকা",
    "synonyms": [
      "Vary",
      "Waver"
    ],
    "antonyms": [
      "Stabilize",
      "Remain"
    ],
    "example": "Market prices fluctuate depending on seasonal supply.",
    "id": "hsc_int_142"
  },
  {
    "word": "Formidable",
    "ipa": "/ˈfɔː.mɪ.də.bəl/",
    "pos": "Adj",
    "level": "intermediate",
    "bn": "দুর্দান্ত, ভীতিপ্রদভাবে শক্তিশালী",
    "meaningBn": "দুর্দান্ত, ভীতিপ্রদভাবে শক্তিশালী",
    "synonyms": [
      "Daunting",
      "Impressive"
    ],
    "antonyms": [
      "Weak",
      "Trivial"
    ],
    "example": "Facing a formidable syllabus requires smart prioritization.",
    "id": "hsc_int_143"
  },
  {
    "word": "Incentive",
    "ipa": "/ɪnˈsen.tɪv/",
    "pos": "Noun",
    "level": "intermediate",
    "bn": "প্রণোদনা, উৎসাহ",
    "meaningBn": "প্রণোদনা, উৎসাহ",
    "synonyms": [
      "Motivation",
      "Stimulus"
    ],
    "antonyms": [
      "Deterrent",
      "Hindrance"
    ],
    "example": "Daily streak badges act as a fun incentive to practice.",
    "id": "hsc_int_144"
  },
  {
    "word": "Inherent",
    "ipa": "/ɪnˈhɪə.rənt/",
    "pos": "Adj",
    "level": "intermediate",
    "bn": "সহজাত, অন্তর্নিহিত",
    "meaningBn": "সহজাত, অন্তর্নিহিত",
    "synonyms": [
      "Intrinsic",
      "Innate"
    ],
    "antonyms": [
      "Acquired",
      "External"
    ],
    "example": "Risk is an inherent part of launching any new venture.",
    "id": "hsc_int_145"
  },
  {
    "word": "Juxtapose",
    "ipa": "/ˌdʒʌk.stəˈpəʊz/",
    "pos": "Verb",
    "level": "intermediate",
    "bn": "পাশাপাশি রেখে তুলনা করা",
    "meaningBn": "পাশাপাশি রেখে তুলনা করা",
    "synonyms": [
      "Compare",
      "Contrast"
    ],
    "antonyms": [
      "Separate",
      "Isolate"
    ],
    "example": "The essay juxtaposes traditional and digital learning.",
    "id": "hsc_int_146"
  },
  {
    "word": "Monotonous",
    "ipa": "/məˈnɒt.ən.əs/",
    "pos": "Adj",
    "level": "intermediate",
    "bn": "একঘেয়ে, নীরস",
    "meaningBn": "একঘেয়ে, নীরস",
    "synonyms": [
      "Tedious",
      "Repetitive"
    ],
    "antonyms": [
      "Varied",
      "Exciting"
    ],
    "example": "Cartoon dialogues keep grammar study from feeling monotonous.",
    "id": "hsc_int_147"
  },
  {
    "word": "Nuance",
    "ipa": "/ˈnjuː.ɑːns/",
    "pos": "Noun",
    "level": "intermediate",
    "bn": "সূক্ষ্ম পার্থক্য বা ভাব",
    "meaningBn": "সূক্ষ্ম পার্থক্য বা ভাব",
    "synonyms": [
      "Subtlety",
      "Shade"
    ],
    "antonyms": [
      "Bluntness",
      "Obviousness"
    ],
    "example": "Understanding word nuance improves translation accuracy.",
    "id": "hsc_int_148"
  },
  {
    "word": "Resilient",
    "ipa": "/rɪˈzɪl.jənt/",
    "pos": "Adj",
    "level": "intermediate",
    "bn": "প্রতিকূলতা কাটিয়ে উঠতে সক্ষম",
    "meaningBn": "প্রতিকূলতা কাটিয়ে উঠতে সক্ষম",
    "synonyms": [
      "Tough",
      "Adaptable"
    ],
    "antonyms": [
      "Fragile",
      "Vulnerable"
    ],
    "example": "Resilient students bounce back stronger after low scores.",
    "id": "hsc_int_149"
  },
  {
    "word": "Substantial",
    "ipa": "/səbˈstæn.ʃəl/",
    "pos": "Adj",
    "level": "intermediate",
    "bn": "উল্লেখযোগ্য, প্রচুর",
    "meaningBn": "উল্লেখযোগ্য, প্রচুর",
    "synonyms": [
      "Considerable",
      "Significant"
    ],
    "antonyms": [
      "Minor",
      "Negligible"
    ],
    "example": "She made substantial progress in free-hand writing.",
    "id": "hsc_int_150"
  }
];

const VOCABULARY_DATA = HSC_DU_ADMISSION_VOCABULARY;

function syncAdmissionVocabularyIntoCurriculum() {
  if (typeof CURRICULUM_DATA === 'undefined') return;
  HSC_DU_ADMISSION_VOCABULARY.forEach((item) => {
    const lvlKey = item.level || 'beginner';
    const lvl = CURRICULUM_DATA[lvlKey];
    if (lvl && Array.isArray(lvl.words)) {
      const exists = lvl.words.some(w => w.word.toLowerCase() === item.word.toLowerCase());
      if (!exists) {
        lvl.words.push({
          id: item.id,
          word: item.word,
          pos: item.pos,
          ipa: item.ipa,
          level: item.level,
          bn: item.bn,
          meaningBn: item.meaningBn || item.bn,
          explanationEn: `High-yield ${item.pos.toLowerCase()} vocabulary word frequently tested in HSC board and Dhaka University admission exams.`,
          example: item.example,
          exampleBn: `বাক্যে প্রয়োগ: "${item.example}"`,
          synonyms: item.synonyms.map(s => typeof s === 'string' ? { word: s, meaningBn: item.bn } : s),
          antonyms: item.antonyms.map(a => typeof a === 'string' ? { word: a, meaningBn: 'বিপরীত অর্থ' } : a)
        });
      }
    }
  });
}


if (typeof window !== 'undefined') {
  window.HSC_DU_ADMISSION_VOCABULARY = HSC_DU_ADMISSION_VOCABULARY;
  window.VOCABULARY_DATA = VOCABULARY_DATA;
  window.syncAdmissionVocabularyIntoCurriculum = syncAdmissionVocabularyIntoCurriculum;
  window.ONE_WORD_DATA = ONE_WORD_DATA;
  window.IDIOMS_DATA = IDIOMS_DATA;
  window.ROOT_WORDS_DATA = ROOT_WORDS_DATA;
  window.DECODER_PRESETS = DECODER_PRESETS;
  window.VOICE_PRACTICE_WORDS = VOICE_PRACTICE_WORDS;
  window.getLevenshteinDistance = getLevenshteinDistance;
  window.calculatePronunciationAccuracy = calculatePronunciationAccuracy;
  window.ToolsState = ToolsState;
  window.switchToolsTab = switchToolsTab;
  window.switchOneWordSubTab = switchOneWordSubTab;
  window.filterOneWordCategory = filterOneWordCategory;
  window.searchOneWordAndIdioms = searchOneWordAndIdioms;
  window.toggleSelfTestMode = toggleSelfTestMode;
  window.toggleRevealCard = toggleRevealCard;
  window.selectRootWord = selectRootWord;
  window.decodeWordEquation = decodeWordEquation;
  window.selectVoiceWord = selectVoiceWord;
  window.startVoiceRecognition = startVoiceRecognition;
  window.stopVoiceRecognition = stopVoiceRecognition;
  window.simulateVoicePractice = simulateVoicePractice;
  window.renderToolsPage = renderToolsPage;
  window.getDailyGoalTarget = getDailyGoalTarget;
  window.setDailyGoalTarget = setDailyGoalTarget;
  window.getTodayLearnedWordIds = getTodayLearnedWordIds;
  window.getUserStreakData = getUserStreakData;
  window.recordWordLearnedToday = recordWordLearnedToday;
  window.getTodayDailyGoalProgress = getTodayDailyGoalProgress;
  window.getWeeklyLeaderboardData = getWeeklyLeaderboardData;
  window.getRevisionSheetSelectedIds = getRevisionSheetSelectedIds;
  window.setRevisionSheetSelectedIds = setRevisionSheetSelectedIds;
  window.toggleSelectAllRevisionWords = toggleSelectAllRevisionWords;
  window.toggleRevisionWordSelection = toggleRevisionWordSelection;
  window.addLevelWordsToMyVocabForRevision = addLevelWordsToMyVocabForRevision;
  window.printRevisionSheet = printRevisionSheet;
  window.renderProgressPage = renderProgressPage;
  window.updateProgressPageDisplay = updateProgressPageDisplay;
  window.updateRevisionSheetDisplay = updateRevisionSheetDisplay;
  window.registerServiceWorker = registerServiceWorker;
  window.initPWAInstallEngine = initPWAInstallEngine;
  window.triggerPWAInstall = triggerPWAInstall;
  window.showPWAInstallButtons = showPWAInstallButtons;
  window.hidePWAInstallButtons = hidePWAInstallButtons;
  window.showAllPWAInstallUI = showAllPWAInstallUI;
  window.hideAllPWAInstallUI = hideAllPWAInstallUI;
  window.isPWAInstalled = isPWAInstalled;
  window.isAndroidMobileDevice = isAndroidMobileDevice;
  window.ensurePWAInstallBanner = ensurePWAInstallBanner;
  window.dismissPWAInstallBanner = dismissPWAInstallBanner;
  window.showAndroidInstallGuide = showAndroidInstallGuide;
  window.closeAndroidInstallGuide = closeAndroidInstallGuide;
  window.copyPageLinkForChrome = copyPageLinkForChrome;
  window.toggleMobileDotsMenu = toggleMobileDotsMenu;
  window.cycleNextAccent = cycleNextAccent;
  window.openMyVocabList = openMyVocabList;
  window.browserLocalPersistence = browserLocalPersistence;
  window.setPersistence = setPersistence;
  window.onAuthStateChanged = onAuthStateChanged;
  window.GoogleAuthProvider = GoogleAuthProvider;
  window.signInWithPopup = signInWithPopup;
  window.signOut = signOut;
  window.savePersistentUserProfile = savePersistentUserProfile;
  window.clearPersistentUserProfile = clearPersistentUserProfile;
  window.getStoredUserProfile = getStoredUserProfile;
  window.restorePersistentSession = restorePersistentSession;
  window.FirebaseAuthEngine = FirebaseAuthEngine;
  window.handleGoogleSignIn = handleGoogleSignIn;
}

if (typeof module !== 'undefined' && module.exports) {
  Object.assign(module.exports, {
    isPWAInstalled,
    isAndroidMobileDevice,
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
    renderAppHeader,
    browserLocalPersistence,
    setPersistence,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    savePersistentUserProfile,
    clearPersistentUserProfile,
    getStoredUserProfile,
    restorePersistentSession,
    FirebaseAuthEngine,
    handleGoogleSignIn,
    getDailyGoalTarget,
    setDailyGoalTarget,
    getTodayLearnedWordIds,
    getUserStreakData,
    recordWordLearnedToday,
    getTodayDailyGoalProgress,
    getWeeklyLeaderboardData,
    getRevisionSheetSelectedIds,
    setRevisionSheetSelectedIds,
    toggleSelectAllRevisionWords,
    toggleRevisionWordSelection,
    addLevelWordsToMyVocabForRevision,
    printRevisionSheet,
    renderProgressPage,
    updateProgressPageDisplay,
    updateRevisionSheetDisplay,
    HSC_DU_ADMISSION_VOCABULARY,
    VOCABULARY_DATA,
    syncAdmissionVocabularyIntoCurriculum,
    ONE_WORD_DATA,
    IDIOMS_DATA,
    ROOT_WORDS_DATA,
    DECODER_PRESETS,
    VOICE_PRACTICE_WORDS,
    getLevenshteinDistance,
    calculatePronunciationAccuracy,
    ToolsState,
    switchToolsTab,
    switchOneWordSubTab,
    filterOneWordCategory,
    searchOneWordAndIdioms,
    toggleSelfTestMode,
    toggleRevealCard,
    selectRootWord,
    decodeWordEquation,
    selectVoiceWord,
    startVoiceRecognition,
    stopVoiceRecognition,
    simulateVoicePractice,
    renderToolsPage
  });
}

/* =====================================================================
   AUTO-INITIALIZATION HOOK
====================================================================== */
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    PronunciationEngine.init();
    restorePersistentSession();
    FirebaseAuthEngine.init();
    loadPersistedState();
    syncAdmissionVocabularyIntoCurriculum();
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
