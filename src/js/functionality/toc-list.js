function initTocList() {
  // Event delegation for smooth scroll — works regardless of when Finsweet renders the links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[fs-toc-element="link"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const start = window.scrollY;
    const end = target.getBoundingClientRect().top + start;
    const duration = 400;
    let startTime = null;

    function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, start + (end - start) * easeInOutQuad(progress));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
    history.pushState(null, '', href);
  });

  // Watch for TOC links being added to the DOM by Finsweet, then observe class changes
  const classObserver = new MutationObserver((_, obs) => {
    const links = document.querySelectorAll('[fs-toc-element="link"]');
    if (!links.length) return;

    // Links are ready — stop watching for DOM additions
    obs.disconnect();

    const attrObserver = new MutationObserver(() => {
      links.forEach((link) => {
        const parent = link.closest('[data-el="toc-parent"]');
        if (!parent) return;
        parent.classList.toggle('is-current', link.classList.contains('w--current'));
      });
    });

    links.forEach((link) => {
      attrObserver.observe(link, { attributes: true, attributeFilter: ['class'] });
    });
  });

  classObserver.observe(document.body, { childList: true, subtree: true });
}

initTocList();
