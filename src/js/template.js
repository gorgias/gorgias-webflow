(function () {
    const MOBILE_BREAKPOINT = 990;
  
    // For each wrapper that contains template blocks
    document.querySelectorAll('[data-el="template-parent"]').forEach(wrapper => {
      let currentMode = null;
      let insertedContent = null;
  
      // Loads and injects the correct template based on mode
      function loadTemplate(mode) {
        const template = wrapper.querySelector(`[data-el="template-${mode}"]`);
        if (!template || !template.content) return;
  
        const clone = template.content.cloneNode(true);
        const templateClass = template.className;
  
        // Remove any previously injected content
        if (insertedContent) {
          insertedContent.remove();
          insertedContent = null;
        }
  
        // Inject new content
        insertedContent = document.createElement('div');
        insertedContent.className = templateClass;
        insertedContent.appendChild(clone);
        wrapper.appendChild(insertedContent);
  
        currentMode = mode;
      }
  
      // Determine if mode needs to be switched
      function checkAndUpdateTemplate() {
        const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
        const newMode = isMobile ? 'mobile' : 'desktop';
  
        if (newMode !== currentMode) {
          loadTemplate(newMode);
        }
      }
  
      // Initial load
      checkAndUpdateTemplate();
  
      // Debounced resize listener
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(checkAndUpdateTemplate, 150);
      });
    });
  })();