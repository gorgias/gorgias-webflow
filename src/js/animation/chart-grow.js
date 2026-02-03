console.log('[chart-grow] Script loaded');

// Inject styles at the top of the document
const style = document.createElement('style');
style.textContent = `
  [data-el="grow"] {
    transition: width 2s cubic-bezier(0.77, 0, 0.175, 1);
  }

  [data-el="grow"][grow-el="vertical"] {
    height: 100%;
    transition: min-height 2s cubic-bezier(0.77, 0, 0.175, 1);
  }

  [data-el="show-percent"] {
    position: relative;
    cursor: pointer;
  }

  .percent-tooltip {
    position: absolute;
    bottom: calc(100% + 0.5rem);
    left: 50%;
    transform: translateX(-50%);
    background: var(--_trends-report---dark, #1a1a1a);
    color: #fff;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
    z-index: 10;
    display: flex;
    gap: 0.5rem;
  }

  [data-el="show-percent"]:hover .percent-tooltip {
    opacity: 1;
  }

  .percent-tooltip-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .percent-tooltip-swatch {
    border-radius: 0.13rem;
    width: 0.75rem;
    height: 0.75rem;
    flex-shrink: 0;
  }

  .percent-tooltip-swatch.is-pink {
    background-color: var(--_trends-report---pink);
  }

  .percent-tooltip-swatch.is-purple {
    background-color: var(--_trends-report---purple);
  }

  @media (max-width: 1150px) and (min-width: 991px) {
    .trends-toc_list {
      max-width: 10rem;
    }
  }
`;
document.head.insertBefore(style, document.head.firstChild);
console.log('[chart-grow] Styles injected');

const staggerDelay = 100;

function isVertical(el) {
  return el.getAttribute('grow-el') === 'vertical';
}

function resetGrow(el) {
  if (isVertical(el)) {
    el.style.minHeight = '0';
  } else {
    el.style.width = '0';
  }
}

function expandGrow(el) {
  if (isVertical(el)) {
    el.style.minHeight = getComputedStyle(el).maxHeight;
  } else {
    el.style.width = '100%';
  }
}

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(sizeGrowParents, 200);
});

function sizeGrowParents() {
  const verticals = document.querySelectorAll('[data-el="grow"][grow-el="vertical"]');
  const parentMap = new Map();

  verticals.forEach((el) => {
    const parent = el.closest('[data-el="grow-parent"]');
    if (!parent) return;
    const maxH = parseFloat(getComputedStyle(el).maxHeight);
    if (!isNaN(maxH) && (!parentMap.has(parent) || maxH > parentMap.get(parent))) {
      parentMap.set(parent, maxH);
    }
  });

  parentMap.forEach((maxH, parent) => {
    parent.style.minHeight = `calc(${maxH}px + 3rem)`;
  });
}

function animateGrowElements(container) {
  const elements = container.querySelectorAll('[data-el="grow"]');
  if (!elements.length) return;

  console.log('[chart-grow] Animating', elements.length, 'elements in', container);

  // Reset to 0 instantly
  elements.forEach((el, index) => {
    el.style.transition = 'none';
    resetGrow(el);
    el.style.transitionDelay = `${index * staggerDelay}ms`;
  });

  // Force reflow, then re-enable transitions and animate
  elements[0].offsetHeight;
  elements.forEach((el) => {
    el.style.transition = '';
  });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      elements.forEach((el) => {
        expandGrow(el);
      });
      console.log('[chart-grow] Elements animated to 100%');
    });
  });
}

function initChartGrowAnimations() {
  console.log('[chart-grow] initChartGrowAnimations called');

  const growElements = document.querySelectorAll('[data-el="grow"]');
  console.log('[chart-grow] Found elements:', growElements.length);

  if (!growElements.length) {
    console.log('[chart-grow] No elements found, exiting');
    return;
  }

  // Filter out elements inside tab panes (those are handled separately)
  const nonTabElements = Array.from(growElements).filter((el) => !el.closest('.w-tab-pane'));
  console.log('[chart-grow] Non-tab elements:', nonTabElements.length);

  // Set initial state instantly for non-tab elements only
  if (nonTabElements.length) {
    nonTabElements.forEach((el, index) => {
      el.style.transition = 'none';
      resetGrow(el);
      el.style.transitionDelay = `${index * staggerDelay}ms`;
      console.log(`[chart-grow] Element ${index} reset to 0, delay: ${index * staggerDelay}ms`);
    });

    // Force reflow, then re-enable transitions
    nonTabElements[0].offsetHeight;
    nonTabElements.forEach((el) => {
      el.style.transition = '';
    });
  }

  // Intersection observer for non-tab elements
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        console.log('[chart-grow] Intersection callback:', entry.target, 'isIntersecting:', entry.isIntersecting, 'ratio:', entry.intersectionRatio);
        if (entry.isIntersecting || entry.intersectionRatio >= 0.8) {
          requestAnimationFrame(() => {
            expandGrow(entry.target);
            console.log('[chart-grow] Element animated');
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

  // Observe non-tab elements only
  nonTabElements.forEach((el, index) => {
    observer.observe(el);
    console.log(`[chart-grow] Observer attached to element ${index}`);
  });

  // Watch for Webflow tab changes
  const tabWrapper = document.querySelector('.w-tabs');
  const tabPanes = document.querySelectorAll('.w-tab-pane');
  if (tabPanes.length) {
    console.log('[chart-grow] Tab panes found:', tabPanes.length);

    // Set all tab grow elements to 0 instantly
    tabPanes.forEach((pane) => {
      pane.querySelectorAll('[data-el="grow"]').forEach((el) => {
        el.style.transition = 'none';
        resetGrow(el);
      });
    });

    let tabAnimationTriggered = false;

    // Observe the tab wrapper to animate when it's in view
    const tabViewObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log('[chart-grow] Tab wrapper intersection:', entry.isIntersecting, 'ratio:', entry.intersectionRatio);
          if (entry.isIntersecting || entry.intersectionRatio >= 0.8) {
            tabAnimationTriggered = true;
            const activePane = document.querySelector('.w-tab-pane.w--tab-active');
            if (activePane) {
              animateGrowElements(activePane);
            }
            tabViewObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: [0.8],
        rootMargin: '-15% 0px',
      }
    );

    tabViewObserver.observe(tabWrapper || tabPanes[0].parentElement);

    // Watch for class changes on tab panes
    const tabObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const pane = mutation.target;
        if (pane.classList.contains('w--tab-active')) {
          console.log('[chart-grow] Tab activated:', pane.getAttribute('data-w-tab'));
          // If tabs haven't scrolled into view yet, skip
          if (!tabAnimationTriggered) return;
          animateGrowElements(pane);
        }
      });
    });

    tabPanes.forEach((pane) => {
      tabObserver.observe(pane, { attributes: true, attributeFilter: ['class'] });
    });
  }
}

function initPercentTooltips() {
  const items = document.querySelectorAll('[data-el="show-percent"]');
  console.log('[chart-grow] show-percent items found:', items.length);

  items.forEach((item) => {
    const growChildren = item.querySelectorAll('[data-el="grow"]');
    if (!growChildren.length) return;

    // Collect max-width values
    const percents = [];
    growChildren.forEach((el) => {
      const maxWidth = getComputedStyle(el).maxWidth;
      if (maxWidth && maxWidth !== 'none') {
        percents.push(maxWidth);
      }
    });

    if (!percents.length) return;

    // Create tooltip with color swatches
    const tooltip = document.createElement('div');
    tooltip.className = 'percent-tooltip';

    // First grow child = pink (outer bar), its child = purple (inner bar)
    const colors = ['is-pink', 'is-purple'];
    percents.forEach((value, index) => {
      const item_el = document.createElement('span');
      item_el.className = 'percent-tooltip-item';

      const swatch = document.createElement('span');
      swatch.className = `percent-tooltip-swatch ${colors[index] || ''}`;

      const text = document.createTextNode(value);

      item_el.appendChild(swatch);
      item_el.appendChild(text);
      tooltip.appendChild(item_el);
    });

    item.appendChild(tooltip);

    console.log('[chart-grow] Tooltip added:', percents.join(' | '));
  });
}

console.log('[chart-grow] Document readyState:', document.readyState);

// Handle case where DOMContentLoaded already fired
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    sizeGrowParents();
    initChartGrowAnimations();
    initPercentTooltips();
  });
} else {
  sizeGrowParents();
  initChartGrowAnimations();
  initPercentTooltips();
}
