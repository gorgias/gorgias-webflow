alert('careers.js loaded');
// Careers: city hover reveal with GSAP (no SplitText)
// - Hover in: 600ms delay, slide-up + fade (city first, desc 100ms later)
// - Hover out: reverse quickly (~100ms) and reset

const IN_DELAY_MS = 400; // wait before showing
const OUT_MS = 100;      // hide speed on hover out
const DESKTOP_MQ = window.matchMedia('(min-width: 992px)');
const HOVER_MQ = window.matchMedia('(hover: hover) and (pointer: fine)');
const isDesktopHover = () => DESKTOP_MQ.matches && HOVER_MQ.matches && (navigator.maxTouchPoints === 0);

function setupCityItem(item) {
  const descWrap = item.querySelector('.cities_desc');
  const cityEl   = item.querySelector('[data-city-desc="city"]');
  const descEl   = item.querySelector('[data-city-desc="desc"]');

  if (!descWrap || !cityEl || !descEl) return;

  // Desktop-only safeguard: never initialize on mobile/tablet or non-hover devices
  if (!isDesktopHover()) return;

  // ensure clean mask for slide-up
  gsap.set([descWrap, cityEl, descEl], { overflow: 'hidden' });

  // start hidden
  gsap.set([cityEl, descEl], { yPercent: 20, autoAlpha: 0 });
  gsap.set(descWrap, { autoAlpha: 0 });

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });

  // Build the timeline once
  tl.add(() => { gsap.set(descWrap, { autoAlpha: 1 }); }, 0)
    .to(cityEl, { yPercent: 0, autoAlpha: 1, duration: 0.5 }, 0)
    .to(descEl, { yPercent: 0, autoAlpha: 1, duration: 0.5 }, 0.2); // 200ms after city

  let hoverTimer;

  item.addEventListener('pointerenter', (e) => {
    if (e.pointerType !== 'mouse' || !isDesktopHover()) return;
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => {
      clearTimeout(hoverTimer);
      tl.timeScale(1).restart(true);
    }, IN_DELAY_MS);
  });

  item.addEventListener('pointerleave', (e) => {
    if (e.pointerType !== 'mouse' || !isDesktopHover()) return;
    clearTimeout(hoverTimer);

    const speed = tl.duration() ? tl.duration() / (OUT_MS / 1000) : 1;

    tl.eventCallback('onReverseComplete', null);

    tl.timeScale(speed).reverse();

    tl.eventCallback('onReverseComplete', () => {
      gsap.set(descWrap, { autoAlpha: 0 });
      gsap.set([cityEl, descEl], { yPercent: 20, autoAlpha: 0 });
      tl.pause(0).timeScale(1);
    });
  });

  // cleanup
  return () => {
    tl.kill();
    // Reset any inline styles so mobile/tablet shows content normally
    gsap.set(descWrap, { clearProps: 'all' });
    gsap.set([cityEl, descEl], { clearProps: 'all' });
  };
}

function initCitiesAnimations() {
  let cleanups = [];
  let isSetup = false;

  const teardownAll = () => {
    cleanups.forEach(fn => fn && fn());
    cleanups = [];
    isSetup = false;
  };

  const setupAll = () => {
    if (isSetup) return;
    document.querySelectorAll('.cities_item').forEach((item) => {
      const cleanup = setupCityItem(item);
      if (cleanup) cleanups.push(cleanup);
    });
    isSetup = true;
  };

  let rAF;
  const rebuild = () => {
    cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(() => {
      teardownAll();
      setupAll();
    });
  };

  // Gate setup by breakpoint and hover capability
  const enable = () => {
    if (!isSetup) {
      setupAll();
      window.addEventListener('resize', rebuild);
      window.addEventListener('orientationchange', rebuild);
    }
  };

  const disable = () => {
    window.removeEventListener('resize', rebuild);
    window.removeEventListener('orientationchange', rebuild);
    teardownAll();
    // Global reset to ensure nothing remains hidden on mobile/tablet or non-hover devices
    document.querySelectorAll('.cities_desc, [data-city-desc="city"], [data-city-desc="desc"]').forEach((el) => {
      gsap.set(el, { clearProps: 'all' });
    });
  };

  const onChange = () => {
    if (isDesktopHover()) enable(); else disable();
  };

  if (isDesktopHover()) {
    enable();
  } else {
    disable();
  }

  if (typeof DESKTOP_MQ.addEventListener === 'function') {
    DESKTOP_MQ.addEventListener('change', onChange);
    HOVER_MQ.addEventListener('change', onChange);
  } else if (typeof DESKTOP_MQ.addListener === 'function') {
    DESKTOP_MQ.addListener(onChange);
    HOVER_MQ.addListener(onChange);
  }
}

// Run after fonts so measurements are stable (not strictly required here)
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(initCitiesAnimations);
} else {
  window.addEventListener('load', initCitiesAnimations);
}

/**
 * Stacked team cards animation
 * - On scroll into view, animate cards up and fade in, staggered
 */

let tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.our-team_section',
    end: 'bottom bottom',
    scrub: true,
    toggleActions: 'restart none reverse',
    pin: '.our-team_wrapper',
  },
})
const teamItems = gsap.utils.toArray('.our-team_cards_item');

tl.from(teamItems, {
  opacity: 0,
  yPercent: 50, // always from bottom
  xPercent: (i) => (i % 2 ? -35 : 35),   // alternate left/right
  scale: 1.25,
  duration: 1,
  stagger: { each: 1, from: 'end' },
})