/* =====================================================================
   VOCABULARY WORLD — DATA MODULE (DELEGATES TO words-data.js)
====================================================================== */
if (typeof module !== 'undefined' && module.exports) {
  const wordsData = require('../words-data.js');
  module.exports = wordsData;

  if (typeof window !== 'undefined') {
    window.LEVEL_META = window.LEVEL_META || wordsData.LEVEL_META;
    window.ASSESSMENT_OPTIONS = window.ASSESSMENT_OPTIONS || wordsData.ASSESSMENT_OPTIONS;
    window.CURRICULUM_DATA = window.CURRICULUM_DATA || wordsData.CURRICULUM_DATA;
    window.WORD_CARTOON_CONVERSATIONS = window.WORD_CARTOON_CONVERSATIONS || wordsData.WORD_CARTOON_CONVERSATIONS;
  }
}
