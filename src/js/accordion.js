// Function to inject CSS into the document
function injectAccordionStyles() {
  const style = document.createElement("style");

  const css = `
    [g-accordion-element="content"] {
      overflow: hidden;
      width: 100%;
      max-height: 0px;
      transition-property: height, max-height;
      transition-duration: 250ms, 250ms;
      transition-timing-function: cubic-bezier(.77, 0, .175, 1), cubic-bezier(.77, 0, .175, 1);
      will-change: max-height;
    }

    [g-accordion-element="content"].is-active {
      max-height: 150rem;
      height: 100% !important;
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

var Webflow = Webflow || [];
Webflow.push(function () {
  injectAccordionStyles();

  const triggers = document.querySelectorAll('[g-accordion-element="trigger"]');

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
      this.classList.toggle("is-active");
      if (arrow) arrow.classList.toggle("is-active");

      if (!content || content.getAttribute('g-accordion-element') !== 'content') return;

      const isActive = content.classList.toggle("is-active");

      if (!isActive) {
        content.style.maxHeight = "0px";
        return;
      }

      // Wait for images to load before setting height
      const images = content.querySelectorAll("img");
      const promises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => img.addEventListener("load", resolve, { once: true }));
      });

      Promise.all(promises).then(() => {
        // Use 2x requestAnimationFrame for fully flushed layout
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            content.style.maxHeight = content.scrollHeight + "px";
          });
        });
      });
    });
  });
});