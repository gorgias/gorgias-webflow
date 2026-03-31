function initTocList() {
  const links = document.querySelectorAll('[fs-toc-element="link"]');

  const observer = new MutationObserver(() => {
    links.forEach((link) => {
      const parent = link.closest('[data-el="toc-parent"]');
      if (!parent) return;

      if (link.classList.contains('w--current')) {
        parent.classList.add('is-current');
      } else {
        parent.classList.remove('is-current');
      }
    });
  });

  links.forEach((link) => {
    observer.observe(link, { attributes: true, attributeFilter: ['class'] });

    link.addEventListener('click', (e) => {
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
  });
}

initTocList();
