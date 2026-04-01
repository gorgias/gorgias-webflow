function initSliderNavigation() {
  console.log("[slider-sync] Script loaded");

  const pairs = [
    {
      sourceSelector: '[data-el="previous"]',
      targetSelector: '[data-el="prev-target"]'
    },
    {
      sourceSelector: '[data-el="next"]',
      targetSelector: '[data-el="next-target"]'
    }
  ];

  pairs.forEach(({ sourceSelector, targetSelector }) => {
    const sources = document.querySelectorAll(sourceSelector);

    console.log(`[slider-sync] Found ${sources.length} source(s) for ${sourceSelector}`);

    sources.forEach((source, sourceIndex) => {
      source.addEventListener("click", function () {
        console.log(`[slider-sync] Click detected on ${sourceSelector} #${sourceIndex}`, source);

        const scope = source.closest('[data-el="slider-sync-scope"]');

        if (!scope) {
          console.warn(`[slider-sync] No scope found for source`, source);
          return;
        }

        console.log(`[slider-sync] Scope found`, scope);

        const target = scope.querySelector(targetSelector);

        if (!target) {
          console.warn(`[slider-sync] No target found inside scope for ${targetSelector}`);
          return;
        }

        console.log(`[slider-sync] Triggering click on target`, target);
        target.click();
      });
    });
  });
}

initSliderNavigation();
