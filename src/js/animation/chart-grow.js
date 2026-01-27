console.log('[chart-grow] Script loaded');

// Inject styles at the top of the document
const style = document.createElement('style');
style.textContent = `
  [data-el="grow"] {
    transition: width 2s cubic-bezier(0.77, 0, 0.175, 1);
  }
`;
document.head.insertBefore(style, document.head.firstChild);
console.log('[chart-grow] Styles injected');

function initChartGrowAnimations() {
  console.log('[chart-grow] initChartGrowAnimations called');

  const growElements = document.querySelectorAll('[data-el="grow"]');
  console.log('[chart-grow] Found elements:', growElements.length);

  if (!growElements.length) {
    console.log('[chart-grow] No elements found, exiting');
    return;
  }

  const staggerDelay = 100; // ms between each element

  // Set initial state instantly (no transition)
  growElements.forEach((el, index) => {
    el.style.transition = 'none';
    el.style.width = '0';
    el.style.transitionDelay = `${index * staggerDelay}ms`;
    console.log(`[chart-grow] Element ${index} set to width 0, delay: ${index * staggerDelay}ms`);
  });

  // Force reflow, then re-enable transitions
  growElements[0].offsetHeight;
  growElements.forEach((el) => {
    el.style.transition = '';
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        console.log('[chart-grow] Intersection callback:', entry.target, 'isIntersecting:', entry.isIntersecting, 'ratio:', entry.intersectionRatio);
        if (entry.isIntersecting || entry.intersectionRatio >= 0.8) {
          requestAnimationFrame(() => {
            entry.target.style.width = '100%';
            console.log('[chart-grow] Element animated to 100%');
          });
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: [0.8],
      rootMargin: '-15% 0px',
    }
  );

  growElements.forEach((el, index) => {
    observer.observe(el);
    console.log(`[chart-grow] Observer attached to element ${index}`);
  });
}

console.log('[chart-grow] Document readyState:', document.readyState);

// Handle case where DOMContentLoaded already fired
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChartGrowAnimations);
} else {
  initChartGrowAnimations();
}
