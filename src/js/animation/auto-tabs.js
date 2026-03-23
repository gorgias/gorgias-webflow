// Auto-cycling Webflow tabs with animated progress bar.
// Attributes:
//   [data-auto-tabs="link"]     — tab trigger links
//   [data-auto-tabs="bar"]      — progress bar element inside each link
//   [data-auto-tabs-link="N"]   — number on each tab link
//   [data-auto-tabs-img="N"]    — number on each image; active image has no is-inactive class

const initAutoTabs = () => {
  const DURATION     = 6000;
  const SEL_LINK     = '[data-auto-tabs="link"]';
  const SEL_BAR      = '[data-auto-tabs="bar"]';
  const ACTIVE_CLASS = 'w--current';

  const links = [...document.querySelectorAll(SEL_LINK)];
  if (!links.length) return;

  // Cache bars and images once
  const bars = links.map(link => link.querySelector(SEL_BAR));
  const imgs = [...document.querySelectorAll('[data-auto-tabs-img]')];

  let tabTimeout  = null;
  let activeLink  = null;

  const resetBars = () => {
    bars.forEach(bar => {
      if (!bar) return;
      bar.getAnimations().forEach(a => a.cancel());
      bar.style.height = '0%';
    });
  };

  const animateBar = (trigger) => {
    const bar = bars[links.indexOf(trigger)];
    if (!bar) return;
    bar.animate(
      [{ height: '0%' }, { height: '100%' }],
      { duration: DURATION, fill: 'forwards' }
    );
  };

  const getNextLink = (current) => {
    const idx = links.indexOf(current);
    return links[(idx + 1) % links.length];
  };

  const updateActiveImage = (link) => {
    const linkNum = link.dataset.autoTabsLink;
    imgs.forEach(img => {
      img.classList.toggle('is-inactive', img.dataset.autoTabsImg !== linkNum);
    });
  };

  const activateLink = (link) => {
    if (activeLink) activeLink.classList.remove(ACTIVE_CLASS);
    link.classList.add(ACTIVE_CLASS);
    activeLink = link;
    updateActiveImage(link);
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
      updateActiveImage(link);
      tabLoop(link);
    });
  });

  // Only start when the tab list is scrolled into view
  const initial = links.find(l => l.classList.contains(ACTIVE_CLASS)) || links[0];
  activeLink = initial;

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      tabLoop(initial);
      observer.disconnect();
    }
  }, { threshold: 0.25 });

  observer.observe(links[0].closest('[data-auto-tabs="wrapper"]') || links[0].parentElement);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAutoTabs);
} else {
  initAutoTabs();
}
