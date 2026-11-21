/* Vocabulary World Root Script (Alias for js/common.js) */
(function() {
  if (typeof window !== 'undefined' && !window.__vwCommonLoaded) {
    const script = document.createElement('script');
    script.src = 'js/common.js';
    document.head.appendChild(script);
  }
})();
