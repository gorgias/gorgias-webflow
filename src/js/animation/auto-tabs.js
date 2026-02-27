// Auto-cycling Webflow tabs with animated progress bar.
// Attributes:
//   [data-auto-tabs="link"] — tab trigger links
//   [data-auto-tabs="bar"]  — progress bar element inside each link

const initAutoTabs = () => {
  const DURATION     = 6000;
  const SEL_LINK     = '[data-auto-tabs="link"]';
  const SEL_BAR      = '[data-auto-tabs="bar"]';
  const ACTIVE_CLASS = 'w--current';

  const links = [...document.querySelectorAll(SEL_LINK)];
  if (!links.length) return;

  let tabTimeout = null;

  const resetBars = () => {
    document.querySelectorAll(SEL_BAR).forEach(bar => {
      bar.getAnimations().forEach(a => a.cancel());
      bar.style.height = '0%';
    });
  };

  const animateBar = (trigger) => {
    const bar = trigger.querySelector(SEL_BAR);
    if (!bar) return;
    bar.animate(
      [{ height: '0%' }, { height: '100%' }],
      { duration: DURATION, fill: 'forwards' }
    );
  };

  const getNextLink = (current) => {
    let next = current.nextElementSibling;
    while (next && !next.matches(SEL_LINK)) {
      next = next.nextElementSibling;
    }
    return next || links[0];
  };

  const activateLink = (link) => {
    links.forEach(l => l.classList.remove(ACTIVE_CLASS));
    link.classList.add(ACTIVE_CLASS);
    if (typeof Webflow !== 'undefined') {
      Webflow.require('tabs').redraw();
    }
  };

  const tabLoop = (trigger) => {
    clearTimeout(tabTimeout);
    resetBars();
    animateBar(trigger);

    tabTimeout = setTimeout(() => {
      const next = getNextLink(trigger);
      activateLink(next);
      tabLoop(next);
    }, DURATION);
  };

  links.forEach(link => {
    link.addEventListener('click', () => {
      clearTimeout(tabTimeout);
      tabLoop(link);
    });
  });

  // Only start when the tab list is scrolled into view
  const initial = document.querySelector(SEL_LINK + '.' + ACTIVE_CLASS) || links[0];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tabLoop(initial);
        observer.disconnect();
      }
    });
  }, { threshold: 0.25 });

  observer.observe(links[0].closest('[data-auto-tabs="wrapper"]') || links[0].parentElement);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAutoTabs);
} else {
  initAutoTabs();
}
