// Accordion component with smooth animations and accessibility
(function () {
  function injectAccordionStyles() {
    const style = document.createElement("style");
    style.textContent = `
      [g-accordion-element="content"] {
        overflow: hidden;
        max-height: 0;
        transition: max-height 200ms cubic-bezier(0.4, 0, 0.2, 1);
      }

      [g-accordion-element="arrow"] {
        transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
      }

      [g-accordion-element="arrow"].is-active {
        transform: rotate(-180deg);
      }
    `;
    document.head.appendChild(style);
  }

  function initAccordion() {
    injectAccordionStyles();

    const triggers = document.querySelectorAll('[g-accordion-element="trigger"]');
    let idCounter = 0;

    triggers.forEach((trigger) => {
      const parent = trigger.parentElement;
      const content = trigger.nextElementSibling;
      const arrow = trigger.querySelector('[g-accordion-element="arrow"]');
      const isContentValid =
        content?.getAttribute("g-accordion-element") === "content";

      // Set up item wrapper
      if (parent && !parent.hasAttribute("g-accordion-element")) {
        parent.setAttribute("g-accordion-element", "item");
      }

      // Set up accessibility attributes
      const triggerId = `accordion-trigger-${idCounter}`;
      const contentId = `accordion-content-${idCounter}`;
      idCounter++;

      trigger.setAttribute("role", "button");
      trigger.setAttribute("tabindex", "0");
      trigger.setAttribute("id", triggerId);
      trigger.setAttribute("aria-expanded", "false");

      if (isContentValid) {
        trigger.setAttribute("aria-controls", contentId);
        content.setAttribute("id", contentId);
        content.setAttribute("role", "region");
        content.setAttribute("aria-labelledby", triggerId);
        // Pre-calculate height for smooth first animation
        content.style.maxHeight = "0px";
      }

      if (arrow) {
        arrow.setAttribute("aria-hidden", "true");
      }

      // Handle default open state
      if (trigger.hasAttribute("g-accordion-default")) {
        trigger.classList.add("is-active");
        trigger.setAttribute("aria-expanded", "true");
        if (isContentValid) {
          content.classList.add("is-active");
          content.style.maxHeight = content.scrollHeight + "px";
        }
        if (arrow) arrow.classList.add("is-active");
      }

      // Click handler
      trigger.addEventListener("click", function () {
        const wrapper = trigger.closest('[g-accordion-element="item"]');
        const accordionParent = wrapper?.parentElement;
        const isOpening = !trigger.classList.contains("is-active");

        // Close others in "one-by" mode
        if (
          isOpening &&
          accordionParent?.getAttribute("g-accordion-function") === "one-by"
        ) {
          accordionParent
            .querySelectorAll('[g-accordion-element="item"]')
            .forEach((item) => {
              if (item === wrapper) return;
              closeItem(item);
            });
        }

        // Toggle current item
        trigger.classList.toggle("is-active");
        trigger.setAttribute("aria-expanded", isOpening ? "true" : "false");
        if (arrow) arrow.classList.toggle("is-active");

        if (!isContentValid) return;

        if (isOpening) {
          content.classList.add("is-active");
          content.style.maxHeight = content.scrollHeight + "px";
        } else {
          content.style.maxHeight = "0px";
          content.classList.remove("is-active");
        }
      });

      // Keyboard support
      trigger.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          trigger.click();
        }
      });
    });

    function closeItem(item) {
      const trigger = item.querySelector('[g-accordion-element="trigger"]');
      const content = item.querySelector('[g-accordion-element="content"]');
      const arrow = item.querySelector('[g-accordion-element="arrow"]');

      trigger?.classList.remove("is-active");
      trigger?.setAttribute("aria-expanded", "false");
      if (content) {
        content.style.maxHeight = "0px";
        content.classList.remove("is-active");
      }
      arrow?.classList.remove("is-active");
    }
  }

  // Initialize
  if (typeof Webflow !== "undefined") {
    Webflow.push(initAccordion);
  } else {
    document.addEventListener("DOMContentLoaded", initAccordion);
  }
})();