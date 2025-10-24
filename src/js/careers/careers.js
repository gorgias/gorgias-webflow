// Careers: city hover reveal with GSAP — gated via gsap.matchMedia at >= 992px
// - Hover in: 400ms delay, slide-up + fade (city first, desc 200ms later)
// - Hover out: fast reverse (~100ms) and reset

const IN_DELAY_MS = 400; // wait before showing
const OUT_MS = 100;      // hide speed on hover out

function forceVisible(el) {
  try {
    const cs = window.getComputedStyle(el);
    const isFlex = cs.display === 'flex' || cs.display === 'inline-flex';
    gsap.set(el, {
      opacity: 1,
      display: isFlex ? 'flex' : 'block',
      clearProps: 'x,y,scale,autoAlpha,yPercent,xPercent,visibility'
    });
  } catch (_) {
    // no-op
  }
}

function makeEverythingVisible() {
  const selectors = [
    '.cities_desc',
    '[data-city-desc="city"]',
    '[data-city-desc="desc"]'
  ];
  document.querySelectorAll(selectors.join(','))
    .forEach(forceVisible);
}

function setupCityItem(item) {
  const descWrap = item.querySelector('.cities_desc');
  const cityEl   = item.querySelector('[data-city-desc="city"]');
  const descEl   = item.querySelector('[data-city-desc="desc"]');

  if (!descWrap || !cityEl || !descEl) return;

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
    if (e.pointerType !== 'mouse') return; // only react to mouse hovers
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => {
      clearTimeout(hoverTimer);
      tl.timeScale(1).restart(true);
    }, IN_DELAY_MS);
  });

  item.addEventListener('pointerleave', (e) => {
    if (e.pointerType !== 'mouse') return;
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

  // cleanup for a single item
  return () => {
    tl.kill();
    gsap.set(descWrap, { clearProps: 'all' });
    gsap.set([cityEl, descEl], { clearProps: 'all' });
  };
}

function initCitiesAnimations() {
  let cleanups = [];

  document.querySelectorAll('.cities_item').forEach((item) => {
    const cleanup = setupCityItem(item);
    if (cleanup) cleanups.push(cleanup);
  });

  // teardown for all items
  return () => {
    cleanups.forEach((fn) => fn && fn());
    cleanups = [];
    // Ensure nothing remains hidden when disabled
    makeEverythingVisible();
    document.querySelectorAll('.cities_desc, [data-city-desc="city"], [data-city-desc="desc"]').forEach((el) => {
      gsap.set(el, { clearProps: 'all' });
    });
  };
}

function bootCities() {
  const mm = gsap.matchMedia();

  // Enable only on desktop widths
  mm.add('(min-width: 992px)', () => {
    const cleanup = initCitiesAnimations();

    // When leaving this MQ (< 992px), cleanup and force visibility
    return () => {
      if (cleanup) cleanup();
      console.info('[Careers] Viewport < 992px — city hover animations deactivated.');
      makeEverythingVisible();
    };
  });

  // Also handle initial load under 992px
  mm.add('(max-width: 991.98px)', () => {
    console.info('[Careers] Viewport < 992px — city hover animations deactivated.');
    makeEverythingVisible();
    return () => {};
  });
}

// Run after fonts so measurements are stable (not strictly required here)
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(bootCities);
} else {
  window.addEventListener('load', bootCities);
}

/**
 * Stacked team cards animation
 * - Only executes if the section with ID #stacked-cards is visible in the viewport
 */
const stackedSection = document.getElementById('stacked-cards');
if (stackedSection && stackedSection.offsetParent !== null) {
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.our-team_section',
      end: 'bottom bottom',
      scrub: true,
      toggleActions: 'restart none reverse',
      pin: '.our-team_wrapper',
    },
  });
  const teamItems = gsap.utils.toArray('.our-team_cards_item');
  tl.from(teamItems, {
    opacity: 0,
    yPercent: 50, // always from bottom
    xPercent: (i) => (i % 2 ? -35 : 35), // alternate left/right
    scale: 1.25,
    duration: 1,
    stagger: { each: 1, from: 'end' },
  });
}