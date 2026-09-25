// Site-wide scroll tracking for gorgias.com (Segment)
// Loaded on every page from src/main.js
//
// Emits two Segment events:
//   1. "Page Scrolled"   { depth, page_path, viewport_height }
//      once per depth threshold per page view -> BigQuery table `page_scrolled`
//   2. "Section Viewed"  { section, section_index, page_path }
//      once per element tagged with data-track-section="<name>" -> table `section_viewed`
//      Tag sections in Webflow Designer: Element settings > Custom attributes >
//      name = data-track-section, value = e.g. "hero", "logos", "ai-agent", "testimonials"

(function () {
  if (window.__gorgiasScrollTracking) return; // guard against double loading
  window.__gorgiasScrollTracking = true;

  var path = window.location.pathname;
  var isDebug = window.location.href.indexOf('debug=gorgias') > -1;

  function track(event, props) {
    if (isDebug) console.log('[scroll-tracking]', event, props);
    if (window.analytics && typeof window.analytics.track === 'function') {
      window.analytics.track(event, props);
    }
  }

  // ---------- 1. Scroll depth ----------
  // Blog pages already emit "Page Scrolled" from another tracker (depth 10/25/75/100).
  // Skip them here to avoid double counting until that tracker is removed.
  var SKIP_DEPTH = path.indexOf('/blog/') === 0;
  var THRESHOLDS = [25, 50, 75, 90, 100];
  var fired = {};
  var ticking = false;

  function scrollPercent() {
    var doc = document.documentElement;
    var height = Math.max(doc.scrollHeight, document.body ? document.body.scrollHeight : 0);
    var scrollable = height - window.innerHeight;
    if (scrollable <= 0) return 100;
    return Math.min(100, Math.round((window.scrollY / scrollable) * 100));
  }

  function checkDepth() {
    ticking = false;
    var pct = scrollPercent();
    for (var i = 0; i < THRESHOLDS.length; i++) {
      var t = THRESHOLDS[i];
      if (pct >= t && !fired[t]) {
        fired[t] = true;
        track('Page Scrolled', { depth: t, page_path: path, viewport_height: window.innerHeight });
      }
    }
    if (fired[100]) window.removeEventListener('scroll', onScroll);
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(checkDepth);
    }
  }

  if (!SKIP_DEPTH) {
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---------- 2. Section visibility ----------
  function initSections() {
    var sections = document.querySelectorAll('[data-track-section]');
    if (!sections.length || !('IntersectionObserver' in window)) return;

    var seen = {};
    // A section counts as "viewed" once it crosses the middle of the viewport.
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var name = el.getAttribute('data-track-section');
        if (!name || seen[name]) return;
        seen[name] = true;
        track('Section Viewed', {
          section: name,
          section_index: Array.prototype.indexOf.call(sections, el),
          page_path: path
        });
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -50% 0px', threshold: 0 });

    for (var i = 0; i < sections.length; i++) io.observe(sections[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSections);
  } else {
    initSections();
  }
})();
