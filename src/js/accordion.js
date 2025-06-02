// Function to inject CSS into the document
function injectAccordionStyles() {
  const style = document.createElement("style");

  const css = `
    [g-accordion-element="content"] {
      overflow: hidden;
      width: 100%;
      height: 0px;
      transition-property: height, max-height;
      transition-duration: 250ms, 250ms;
      transition-timing-function: cubic-bezier(.77, 0, .175, 1), cubic-bezier(.77, 0, .175, 1);
      will-change: height, max-height;
    }

    [g-accordion-element="content"].is-active {
      height: 100%;
      max-height: 150rem;
      min-height: 1px !important;
    }

    [g-accordion-element="arrow"] {
      transition-property: all;
      transition-duration: 250ms;
      transition-timing-function: cubic-bezier(.77, 0, .175, 1);
    }

    [g-accordion-element="arrow"].is-active {
      transform: rotate(-180deg);
    }
  `;

  style.setAttribute("type", "text/css");

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  document.head.appendChild(style);
}

Webflow.push(function () {
  injectAccordionStyles();

  const triggers = document.querySelectorAll('[g-accordion-element="trigger"]');

  // ✅ Add g-accordion-element="item" to each trigger's parent
  triggers.forEach(trigger => {
    const parent = trigger.parentElement;
    if (parent && !parent.hasAttribute('g-accordion-element')) {
      parent.setAttribute('g-accordion-element', 'item');
    }
  });

  triggers.forEach(trigger => {
    const content = trigger.nextElementSibling;
    const arrow = trigger.querySelector('[g-accordion-element="arrow"]');

    if (trigger.hasAttribute("g-accordion-default")) {
      trigger.classList.add("is-active");
      if (content && content.getAttribute('g-accordion-element') === 'content') {
        content.classList.add("is-active");
        content.style.maxHeight = content.scrollHeight + "px";
      }
      if (arrow) arrow.classList.add("is-active");
    }

    trigger.addEventListener("click", function () {
      const wrapper = trigger.closest('[g-accordion-element="item"]');
      const parent = wrapper?.parentElement;

      // ✅ Close other items if accordion group has g-accordion-function="one-by"
      if (parent?.getAttribute('g-accordion-function') === 'one-by') {
        const allItems = parent.querySelectorAll('[g-accordion-element="item"]');
        allItems.forEach(item => {
          if (item === wrapper) return;

          const otherTrigger = item.querySelector('[g-accordion-element="trigger"]');
          const otherContent = item.querySelector('[g-accordion-element="content"]');
          const otherArrow = item.querySelector('[g-accordion-element="arrow"]');

          otherTrigger?.classList.remove('is-active');
          otherContent?.classList.remove('is-active');
          if (otherContent) otherContent.style.maxHeight = '0px';
          otherArrow?.classList.remove('is-active');
        });
      }

      this.classList.toggle("is-active");
      if (arrow) arrow.classList.toggle("is-active");

      if (!content || content.getAttribute('g-accordion-element') !== 'content') return;

      const isActive = content.classList.toggle("is-active");

      if (!isActive) {
        content.style.maxHeight = "0px";
        return;
      }

      const images = content.querySelectorAll("img");
      const promises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => img.addEventListener("load", resolve, { once: true }));
      });

      Promise.all(promises).then(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            content.style.maxHeight = content.scrollHeight + "px";
          });
        });
      });
    });
  });
});