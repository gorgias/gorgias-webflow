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
  
    // Set the type attribute using setAttribute (optional)
    style.setAttribute("type", "text/css");
  
    if (style.styleSheet) {
      // For IE
      // console.log("Using styleSheet for IE");
      style.styleSheet.cssText = css;
    } else {
      // For modern browsers
      // console.log("Appending CSS for modern browsers");
      style.appendChild(document.createTextNode(css));
    }
  
    document.head.appendChild(style);
    // console.log("Styles injected successfully");
  }
  
  var Webflow = Webflow || [];
  Webflow.push(function () {
    // console.log("Webflow initialized");
  
    // Inject styles
    injectAccordionStyles();
  
    // Initialize accordion functionality
    const triggers = document.querySelectorAll('[g-accordion-element="trigger"]');
    // console.log(`Found ${triggers.length} accordion triggers`);
  
    triggers.forEach(trigger => {
      trigger.addEventListener("click", function () {
        // console.log("Accordion trigger clicked");
  
        // Toggle the active class on the trigger
        this.classList.toggle("is-active");
        // console.log(`Trigger class is now: ${this.className}`);
  
        // Toggle the active class on the arrow within the trigger
        const arrow = this.querySelector('[g-accordion-element="arrow"]');
        if (arrow) {
          arrow.classList.toggle("is-active");
          // console.log(`Arrow class is now: ${arrow.className}`);
        } else {
          // console.log("No arrow element found");
        }
  
        // Toggle the active class on the associated content
        const content = this.nextElementSibling;
        if (content && content.getAttribute('g-accordion-element') === 'content') {
          content.classList.toggle("is-active");
          // console.log(`Content class is now: ${content.className}`);
  
          // Handle height animation
          if (content.classList.contains("is-active")) {
            content.style.maxHeight = content.scrollHeight + "px";
            // console.log(`Content expanded to max-height: ${content.style.maxHeight}`);
          } else {
            content.style.maxHeight = 0;
            // console.log("Content collapsed to max-height: 0");
          }
        } else {
          // console.log("No content element found or attribute mismatch");
        }
      });
    });
  });
  