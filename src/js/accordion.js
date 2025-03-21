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
    style.styleSheet.cssText = css; // For IE
  } else {
    style.appendChild(document.createTextNode(css)); // For modern browsers
  }

  document.head.appendChild(style);
}

var Webflow = Webflow || [];
Webflow.push(function () {
  console.log("Webflow initialized");

  // Inject styles
  injectAccordionStyles();

  // Initialize accordion functionality
  const triggers = document.querySelectorAll('[g-accordion-element="trigger"]');

  triggers.forEach(trigger => {
    const content = trigger.nextElementSibling;
    const arrow = trigger.querySelector('[g-accordion-element="arrow"]');

    // Check if this item should be open by default
    if (trigger.hasAttribute("g-accordion-default")) {
      trigger.classList.add("is-active");
      if (content && content.getAttribute('g-accordion-element') === 'content') {
        content.classList.add("is-active");
        content.style.maxHeight = content.scrollHeight + "px";
      }
      if (arrow) {
        arrow.classList.add("is-active");
      }
    }

    // Handle click toggle
    trigger.addEventListener("click", function () {
      this.classList.toggle("is-active");
      if (arrow) arrow.classList.toggle("is-active");

      if (content && content.getAttribute('g-accordion-element') === 'content') {
        content.classList.toggle("is-active");

        if (content.classList.contains("is-active")) {
          const images = content.querySelectorAll("img");
          let loadedCount = 0;

          if (images.length === 0) {
            requestAnimationFrame(() => {
              content.style.maxHeight = content.scrollHeight + "px";
            });
          } else {
            images.forEach(img => {
              if (img.complete) {
                loadedCount++;
              } else {
                img.addEventListener("load", () => {
                  loadedCount++;
                  if (loadedCount === images.length) {
                    requestAnimationFrame(() => {
                      content.style.maxHeight = content.scrollHeight + "px";
                    });
                  }
                });
              }
            });

            // Fallback: if all are already loaded
            if (loadedCount === images.length) {
              requestAnimationFrame(() => {
                content.style.maxHeight = content.scrollHeight + "px";
              });
            }
          }
        } else {
          content.style.maxHeight = "0px";
        }
      }
    });
  });
});


/*
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
      style.styleSheet.cssText = css; // For IE
  } else {
      style.appendChild(document.createTextNode(css)); // For modern browsers
  }

  document.head.appendChild(style);
}

var Webflow = Webflow || [];
Webflow.push(function () {
  console.log("Webflow initialized");

  // Inject styles
  injectAccordionStyles();

  // Initialize accordion functionality
  const triggers = document.querySelectorAll('[g-accordion-element="trigger"]');

  triggers.forEach(trigger => {
      const content = trigger.nextElementSibling;
      const arrow = trigger.querySelector('[g-accordion-element="arrow"]');

      // Check if this item should be open by default
      if (trigger.hasAttribute("g-accordion-default")) {
          trigger.classList.add("is-active");
          if (content && content.getAttribute('g-accordion-element') === 'content') {
              content.classList.add("is-active");
              content.style.maxHeight = content.scrollHeight + "px";
          }
          if (arrow) {
              arrow.classList.add("is-active");
          }
      }

      trigger.addEventListener("click", function () {
          // Toggle the active class on the trigger
          this.classList.toggle("is-active");

          // Toggle the active class on the arrow within the trigger
          if (arrow) {
              arrow.classList.toggle("is-active");
          }

          // Toggle the active class on the associated content
          if (content && content.getAttribute('g-accordion-element') === 'content') {
              content.classList.toggle("is-active");

              // Handle height animation
              content.style.maxHeight = content.classList.contains("is-active")
                  ? content.scrollHeight + "px"
                  : "0px";
          }
      });
  });
});*/