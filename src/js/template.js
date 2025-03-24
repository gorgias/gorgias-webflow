(function () {
    const MOBILE_BREAKPOINT = 990;
  
    // Holds current mode per wrapper
    const wrapperStates = new WeakMap();
  
    function loadTemplate(mode, wrapper) {
      const selector = `[data-el="template-${mode}"]`;
      const template = wrapper.querySelector(selector);
      if (!template || !template.content) return;
  
      const clone = template.content.cloneNode(true);
      const templateClass = template.className;
  
      // Remove previously injected content with same class
      const prevInjected = wrapper.querySelector(`.${templateClass}`);
      if (prevInjected) prevInjected.remove();
  
      // Inject new content
      const injected = document.createElement('div');
      injected.className = templateClass;
      injected.appendChild(clone);
      wrapper.appendChild(injected);
  
      // Update state
      wrapperStates.set(wrapper, mode);
  
      // Run appropriate JS
      if (mode === 'mobile' && typeof window.initAccordion === 'function') {
        window.initAccordion(wrapper);
      }
  
      if (mode === 'desktop' && typeof window.initAutomate === 'function') {

        window.initAutomate;

      }
    }
  
    function updateAllTemplates() {
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      const mode = isMobile ? 'mobile' : 'desktop';
  
      const wrappers = document.querySelectorAll('[data-el="template-parent"]');
  
      wrappers.forEach(wrapper => {
        const currentMode = wrapperStates.get(wrapper);
        if (currentMode !== mode) {
          loadTemplate(mode, wrapper);
        }
      });
    }
  
    // Initial run
    updateAllTemplates();
  
    // Debounced resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateAllTemplates, 150);
    });
  })();