// Function to initialize - can be called immediately or on DOMContentLoaded
const initCustomerStories = () => {
  /* =========================
     Card hover + desc fade AFTER grow
  ========================== */
  const items = [...document.querySelectorAll(".cs_video-item")];
  if (!items.length) return;

  let activeItem = null;
  const itemTimeouts = new WeakMap();
  const itemActivationIds = new WeakMap();
  const itemHasShowDesc = new WeakMap(); // Track if item should have show-desc (even if CSS removes it)
  let globalActivationId = 0;
  
  // Get transition duration from CSS (default to 400ms if not found)
  const getTransitionDuration = (item) => {
    const style = getComputedStyle(item);
    const duration = style.transitionDuration || '0.4s';
    const match = duration.match(/([\d.]+)/);
    return match ? parseFloat(match[1]) * 1000 : 400;
  };

  const setActive = (item) => {
    const hasActive = item.classList.contains("active");
    const hasShowDesc = item.classList.contains("show-desc");
    const isStoredActive = activeItem === item;
    // Check for pending timeout BEFORE we do anything else
    const hasPendingTimeout = itemTimeouts.get(item) !== undefined;
    // Check our internal flag (more reliable than DOM state)
    const shouldHaveShowDesc = itemHasShowDesc.get(item) === true;
    
    // CRITICAL FIX: Check BEFORE clearing timeouts!
    // If this is the same item AND it's already active AND (should have show-desc OR has pending timeout),
    // check if show-desc is actually present, and restore it if missing
    if (isStoredActive && hasActive && (shouldHaveShowDesc || hasPendingTimeout)) {
      // If the flag says it should have show-desc but the class is missing, restore it immediately
      if (shouldHaveShowDesc && !hasShowDesc) {
        item.classList.add("show-desc");
      }
      return;
    }
    
    // Increment global activation ID
    globalActivationId++;
    const currentActivationId = globalActivationId;
    
    // Store activation ID on this item
    itemActivationIds.set(item, currentActivationId);
    
    // Clear any pending timeouts from all items
    items.forEach(el => {
      const timeout = itemTimeouts.get(el);
      if (timeout) {
        clearTimeout(timeout);
        itemTimeouts.delete(el);
      }
    });
    
    // Check if this is the same item (to preserve its show-desc)
    const isSameItem = isStoredActive && hasActive;
    
    // Remove show-desc from all OTHER items only (never from the item we're activating if it's the same)
    // Temporarily disable transitions for instant removal (0ms out, 200ms in)
    items.forEach(el => {
      // CRITICAL: Skip the item we're activating if it's the same item
      if (isSameItem && el === item) {
        return; // Don't touch this item's show-desc
      }
      
      if (el.classList.contains("show-desc")) {
        // Clear the flag
        itemHasShowDesc.delete(el);
        // Find all elements within this item that might have transitions
        // (the item itself and all its descendants)
        const allElements = [el, ...el.querySelectorAll('*')];
        const originalTransitions = new Map();
        
        // Store and disable transitions
        allElements.forEach(element => {
          const computed = getComputedStyle(element);
          if (computed.transition && computed.transition !== 'none' && computed.transition !== 'all 0s ease 0s') {
            originalTransitions.set(element, element.style.transition || '');
            element.style.transition = 'none';
          }
        });
        
        // Remove show-desc - this will happen instantly (no transition)
        el.classList.remove("show-desc");
        
        // Restore transitions after a frame
        requestAnimationFrame(() => {
          originalTransitions.forEach((original, element) => {
            element.style.transition = original;
          });
        });
      } else {
        el.classList.remove("show-desc");
        itemHasShowDesc.delete(el);
      }
    });
    
    // Force a synchronous reflow to ensure show-desc removal is painted
    // before we start the width transition
    void items[0]?.offsetHeight;
    
    // Then remove active class from all items except the one we're activating
    items.forEach(el => {
      if (el !== item) {
        el.classList.remove("active");
      }
    });
    
    // Set new active item
    activeItem = item;
    // Only add active if it's not already there
    if (!item.classList.contains("active")) {
      item.classList.add("active");
    }
    
    // If this is the same item and it already has show-desc, we're done
    if (isSameItem && item.classList.contains("show-desc")) {
      // Set the flag since it already has show-desc
      itemHasShowDesc.set(item, true);
      return;
    }
    
    // Get transition duration and wait for it to complete before showing description
    const duration = getTransitionDuration(item);
    
    const timeout = setTimeout(() => {
      // Use requestAnimationFrame to check right before adding class
      requestAnimationFrame(() => {
        // Check: activation ID matches, item is still active, and it's still the activeItem
        const itemActivationId = itemActivationIds.get(item);
        if (
          itemActivationId === currentActivationId &&
          currentActivationId === globalActivationId &&
          activeItem === item &&
          item.classList.contains("active")
        ) {
          // Only add if not already there
          if (!item.classList.contains("show-desc")) {
            item.classList.add("show-desc");
            // Set the flag to track that this item should have show-desc
            itemHasShowDesc.set(item, true);
          } else {
            // Set the flag even if already present (in case it was removed and re-added)
            itemHasShowDesc.set(item, true);
          }
        }
      });
      itemTimeouts.delete(item);
    }, duration);
    
    itemTimeouts.set(item, timeout);
  };

  // Periodic cleanup to catch any edge cases
  const cleanupCheck = () => {
    items.forEach(el => {
      // If item has show-desc but is not active, remove it immediately
      // BUT skip if it's the activeItem (might be transitioning)
      if (el.classList.contains("show-desc") && !el.classList.contains("active") && activeItem !== el) {
        el.classList.remove("show-desc");
        itemHasShowDesc.delete(el);
      }
      // If item is active but not the activeItem, remove show-desc first, then active
      if (el.classList.contains("active") && activeItem !== el) {
        el.classList.remove("show-desc");
        el.classList.remove("active");
        itemHasShowDesc.delete(el);
      }
    });
  };

  // Run cleanup check periodically (every 100ms - less frequent to avoid performance issues)
  setInterval(cleanupCheck, 100);

  // Start with first one expanded
  setActive(items[0]);

  // Hover behaviour
  items.forEach(item => {
    item.addEventListener("mouseenter", () => setActive(item));
  });

};

// Check if DOM is already loaded, otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", initCustomerStories);
} else {
  initCustomerStories();
}
