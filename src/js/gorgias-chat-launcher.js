// Use this script to apply the brand gradient to the Gorgias chat launcher button.

(function () {
  var LAUNCHER_GRADIENT = 'linear-gradient(120deg, #FFD1C4 0%, #E4D9FF 100%)';
  var STYLE_ID = 'gorgias-launcher-brand';
  var LAUNCHER_SELECTOR = '#chat-button';
  var RETRY_MS = 500;
  var MAX_RETRIES = 40;

  function launcherCss() {
    return [
      'html, body {',
      '  background: transparent !important;',
      '}',
      'body > *,',
      'button,',
      '[class*="button"],',
      '[class*="launcher"],',
      '[class*="Launcher"],',
      '[id*="button"] {',
      '  background-image: ' + LAUNCHER_GRADIENT + ' !important;',
      '  background-color: transparent !important;',
      '}',
      'svg, svg * {',
      '  fill: #161616 !important;',
      '  color: #161616 !important;',
      '}',
      'button, [class*="button"], [class*="launcher"] {',
      '  color: #161616 !important;',
      '}'
    ].join('\n');
  }

  function applyLauncherStyle(doc) {
    if (!doc || !doc.head || typeof doc.createElement !== 'function') {
      return false;
    }
    if (doc.head.querySelector && doc.head.querySelector('#' + STYLE_ID)) {
      return false;
    }
    var style = doc.createElement('style');
    style.id = STYLE_ID;
    style.textContent = launcherCss();
    doc.head.appendChild(style);
    return true;
  }

  function styleLauncher() {
    try {
      var el = document.querySelector(LAUNCHER_SELECTOR);
      if (!el) {
        return false;
      }
      var doc = el.contentDocument;
      if (!doc) {
        return false;
      }
      return applyLauncherStyle(doc);
    } catch (e) {
      return false;
    }
  }

  function start() {
    if (window.__gorgiasLauncherBrandInit) {
      return;
    }
    window.__gorgiasLauncherBrandInit = true;

    var done = false;
    var tries = 0;

    function attempt() {
      if (done) {
        return true;
      }
      if (styleLauncher()) {
        done = true;
        if (timer) {
          clearInterval(timer);
        }
        if (observer) {
          observer.disconnect();
        }
      }
      return done;
    }

    var observer = null;
    if (typeof MutationObserver === 'function' && document.body) {
      observer = new MutationObserver(function () { attempt(); });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    var timer = setInterval(function () {
      tries++;
      if (attempt() || tries >= MAX_RETRIES) {
        clearInterval(timer);
      }
    }, RETRY_MS);

    if (window.addEventListener) {
      window.addEventListener('gorgias-widget-loaded', function () { attempt(); });
    }
    if (document.addEventListener) {
      document.addEventListener('gorgias-widget-loaded', function () { attempt(); });
    }

    attempt();
  }

  window.GorgiasLauncherBrand = {
    LAUNCHER_GRADIENT: LAUNCHER_GRADIENT,
    STYLE_ID: STYLE_ID,
    launcherCss: launcherCss,
    applyLauncherStyle: applyLauncherStyle,
    styleLauncher: styleLauncher,
    start: start
  };

  if (typeof document !== 'undefined' && document.body) {
    start();
  }
})();
