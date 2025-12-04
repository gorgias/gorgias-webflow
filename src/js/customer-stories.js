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

  /* =========================
     Media Kill Logic - Kill and clone media elements
     Strategy: Clone first, then delete (ensures clone always happens)
  ========================== */
  const killAndCloneMedia = (modal) => {
    if (!modal) return;

    // Convert to arrays first to avoid live NodeList issues
    // Kill and clone iframes - CLONE FIRST, THEN DELETE
    const iframes = [...modal.querySelectorAll('iframe')];
    iframes.forEach(iframe => {
      const parent = iframe.parentElement;
      if (!parent) return;
      
      try {
        // Step 1: Clone first (while original still exists and has all its properties)
        const clone = iframe.cloneNode(true);
        
        // Step 2: Then delete the original
        iframe.remove();
        
        // Step 3: Append the clone (ensures it's always added back)
        parent.appendChild(clone);
      } catch (e) {
        // If cloning fails, at least try to remove the iframe
        console.warn("[customer-stories] Failed to clone iframe", e);
        iframe.remove();
      }
    });

    // Kill and clone video elements - CLONE FIRST, THEN DELETE
    const videos = [...modal.querySelectorAll('video')];
    videos.forEach(video => {
      const parent = video.parentElement;
      if (!parent) return;
      
      try {
        // Step 1: Clone first (while original still exists)
        const clone = video.cloneNode(true);
        
        // Step 2: Pause and reset original
        video.pause();
        video.currentTime = 0;
        video.src = '';
        video.load();
        
        // Step 3: Delete the original
        video.remove();
        
        // Step 4: Append the clone (ensures it's always added back)
        parent.appendChild(clone);
        
        // Step 5: Reset clone to ensure it's paused
        clone.pause();
        clone.currentTime = 0;
      } catch (e) {
        // If cloning fails, at least pause and reset
        console.warn("[customer-stories] Failed to clone video", e);
        video.pause();
        video.currentTime = 0;
      }
    });

    // Kill and clone Wistia embeds - CLONE FIRST, THEN DELETE
    const wistiaEmbeds = [...modal.querySelectorAll('.wistia_embed')];
    wistiaEmbeds.forEach(wistiaEmbed => {
      const parent = wistiaEmbed.parentElement;
      if (!parent) return;
      
      try {
        const match = wistiaEmbed.className.match(/wistia_async_([\w]+)/);
        if (match) {
          const videoHash = match[1];
          // Try to pause via Wistia API before cloning
          window._wq = window._wq || [];
          _wq.push({
            id: videoHash,
            onReady(video) {
              video.pause();
              video.remove();
            }
          });
        }
        
        // Step 1: Clone first (while original still exists)
        const clone = wistiaEmbed.cloneNode(true);
        
        // Step 2: Then delete the original
        wistiaEmbed.remove();
        
        // Step 3: Append the clone (ensures it's always added back)
        parent.appendChild(clone);
      } catch (e) {
        // If cloning fails, at least try to remove
        console.warn("[customer-stories] Failed to clone Wistia embed", e);
        wistiaEmbed.remove();
      }
    });
  };

  /* =========================
     Modal open/close + scroll lock
  ========================== */

  const toggleScroll = (disable=false) => {
    document.body.style.overflow = disable ? "hidden" : "";
  };

  const pauseWistiaInModal = (modal) => {
    if (!modal) return;
    const wistiaEmbed = modal.querySelector('.wistia_embed');
    if (wistiaEmbed) {
      const match = wistiaEmbed.className.match(/wistia_async_([\w]+)/);
      if (match) {
        const videoHash = match[1];
        window._wq = window._wq || [];
        _wq.push({
          id: videoHash,
          onReady(video) { video.pause(); }
        });
      }
    }
  };

  // open modal
  document
    .querySelectorAll('[data-el="video-modal-trigger"]')
    .forEach(trigger => {
      trigger.addEventListener("click", () => {
        const item = trigger.closest(".cs_video-item");
        const modal = item && item.querySelector('[data-el="video-modal"]');
        if (!modal) return;
        modal.classList.add("is-open");
        toggleScroll(true);
      });
    });

  // close via button
  document
    .querySelectorAll('[data-el="video-modal-close"]')
    .forEach(btn => {
      btn.addEventListener("click", () => {
        const modal = btn.closest('[data-el="video-modal"]');
        if (!modal) return;
        pauseWistiaInModal(modal);
        killAndCloneMedia(modal);
        modal.classList.remove("is-open");
        toggleScroll(false);
      });
    });

  // close via Escape
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const open = document.querySelector('[data-el="video-modal"].is-open');
    if (open) {
      pauseWistiaInModal(open);
      killAndCloneMedia(open);
      open.classList.remove("is-open");
      toggleScroll(false);
    }
  });

  /* =========================
     Mutation Observer - Watch for changes to .cs_video-item and modals
  ========================== */
  const observer = new MutationObserver((mutations) => {
    // Observer is active but silent - can add logging here if needed for debugging
  });

  // Start observing
  const container = document.body;
  observer.observe(container, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ['class', 'data-el']
  });
};

// Check if DOM is already loaded, otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", initCustomerStories);
} else {
  initCustomerStories();
}
