// Disable Webflow's built-in smooth scrolling
var Webflow = Webflow || [];
Webflow.push(function() {
  $(function() { 
    $(document).off('click.wf-scroll');
  });
});

// Smooth scroll implementation with customizable settings
(function() {
  // Customizable settings
  const SCROLL_SETTINGS = {
    duration: 1000, // in milliseconds
    easing: 'easeInOutCubic' // 'linear', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic'
  };

  const EASING_FUNCTIONS = {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: t => t * t * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  };

  function getOffset() {
    const navbar = document.querySelector('[ms-code-scroll-offset]');
    if (!navbar) return 0;
    const navbarHeight = navbar.offsetHeight;
    const customOffset = parseInt(navbar.getAttribute('ms-code-scroll-offset') || '0', 10);
    return navbarHeight + customOffset;
  }

  function smoothScroll(target) {
    const startPosition = window.pageYOffset;
    const offset = getOffset();
    const targetPosition = target.getBoundingClientRect().top + startPosition - offset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / SCROLL_SETTINGS.duration, 1);
      const easeProgress = EASING_FUNCTIONS[SCROLL_SETTINGS.easing](progress);
      window.scrollTo(0, startPosition + distance * easeProgress);
      if (timeElapsed < SCROLL_SETTINGS.duration) requestAnimationFrame(animation);
    }

    requestAnimationFrame(animation);
  }

  function handleClick(e) {
    const href = e.currentTarget.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.getElementById(href.slice(1));
      if (target) smoothScroll(target);
    }
  }

  function handleHashChange() {
    if (window.location.hash) {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target) {
        setTimeout(() => smoothScroll(target), 0);
      }
    }
  }

  function init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleClick);
    });
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Handle initial hash on page load
  }

  document.addEventListener('DOMContentLoaded', init);
  window.Webflow && window.Webflow.push(init);
})();