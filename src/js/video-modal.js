// Shared video modal logic — open/close, scroll lock, media cleanup
// Exposed as window.initVideoModals() so any page script can call it.

const initVideoModals = () => {
  console.log('[video-modal] Initializing...');

  /* =========================
     Inject CSS
  ========================== */
  if (!document.getElementById('video-modal-styles')) {
    const style = document.createElement('style');
    style.id = 'video-modal-styles';
    style.textContent = `
      .cs_video-modal {
        position: fixed; inset: 0;
        display: flex; align-items: center; justify-content: center;
        background: rgba(0,0,0,.7);
        opacity: 0; visibility: hidden; pointer-events: none;
        transition: opacity .25s ease;
        z-index: 9999;
        padding: 0;
      }
      .cs_video-modal.is-open {
        opacity: 1; visibility: visible; pointer-events: auto;
      }
    `;
    document.head.appendChild(style);
    console.log('[video-modal] CSS injected');
  }

  /* =========================
     Helpers
  ========================== */

  const toggleScroll = (disable = false) => {
    document.body.style.overflow = disable ? 'hidden' : '';
    console.log('[video-modal] Scroll', disable ? 'locked' : 'restored');
  };

  // Find modal: check inside the trigger first, then walk up the DOM
  const findModal = (trigger) => {
    const inner = trigger.querySelector('[data-el="video-modal"]');
    if (inner) {
      console.log('[video-modal] Modal found inside trigger', inner);
      return inner;
    }
    let el = trigger.parentElement;
    while (el) {
      const modal = el.querySelector('[data-el="video-modal"]');
      if (modal) {
        console.log('[video-modal] Modal found in ancestor', modal);
        return modal;
      }
      el = el.parentElement;
    }
    console.warn('[video-modal] No modal found for trigger', trigger);
    return null;
  };

  // Teleport modal to <body> so position:fixed isn't broken by CSS transforms
  // (common issue inside Swiper/slider wrappers that use transform: translate3d)
  const teleportToBody = (modal) => {
    if (modal.parentElement === document.body) return;
    const placeholder = document.createComment('video-modal-placeholder');
    modal.before(placeholder);
    modal._placeholder = placeholder;
    document.body.appendChild(modal);
    console.log('[video-modal] Modal teleported to body');
  };

  const restoreModal = (modal) => {
    const placeholder = modal._placeholder;
    if (!placeholder) return;
    placeholder.replaceWith(modal);
    modal._placeholder = null;
    console.log('[video-modal] Modal restored to original position');
  };

  const pauseWistiaInModal = (modal) => {
    if (!modal) return;
    const wistiaEmbed = modal.querySelector('.wistia_embed');
    if (!wistiaEmbed) return;
    const match = wistiaEmbed.className.match(/wistia_async_([\w]+)/);
    if (match) {
      const videoHash = match[1];
      console.log('[video-modal] Pausing Wistia video:', videoHash);
      window._wq = window._wq || [];
      _wq.push({ id: videoHash, onReady(video) { video.pause(); } });
    }
  };

  const killAndCloneMedia = (modal) => {
    if (!modal) return;
    console.log('[video-modal] Killing and cloning media in modal', modal);

    [...modal.querySelectorAll('iframe')].forEach(iframe => {
      const parent = iframe.parentElement;
      if (!parent) return;
      try {
        const clone = iframe.cloneNode(true);
        iframe.remove();
        parent.appendChild(clone);
        console.log('[video-modal] iframe cloned');
      } catch (e) {
        console.warn('[video-modal] Failed to clone iframe', e);
        iframe.remove();
      }
    });

    [...modal.querySelectorAll('video')].forEach(video => {
      const parent = video.parentElement;
      if (!parent) return;
      try {
        const clone = video.cloneNode(true);
        video.pause();
        video.currentTime = 0;
        video.src = '';
        video.load();
        video.remove();
        parent.appendChild(clone);
        clone.pause();
        clone.currentTime = 0;
        console.log('[video-modal] video cloned');
      } catch (e) {
        console.warn('[video-modal] Failed to clone video', e);
        video.pause();
        video.currentTime = 0;
      }
    });

    [...modal.querySelectorAll('.wistia_embed')].forEach(wistiaEmbed => {
      const parent = wistiaEmbed.parentElement;
      if (!parent) return;
      try {
        const match = wistiaEmbed.className.match(/wistia_async_([\w]+)/);
        if (match) {
          window._wq = window._wq || [];
          _wq.push({ id: match[1], onReady(video) { video.pause(); video.remove(); } });
        }
        const clone = wistiaEmbed.cloneNode(true);
        wistiaEmbed.remove();
        parent.appendChild(clone);
        console.log('[video-modal] Wistia embed cloned');
      } catch (e) {
        console.warn('[video-modal] Failed to clone Wistia embed', e);
        wistiaEmbed.remove();
      }
    });
  };

  const closeModal = (modal) => {
    if (!modal) return;
    console.log('[video-modal] Closing modal', modal);
    pauseWistiaInModal(modal);
    killAndCloneMedia(modal);
    modal.classList.remove('is-open');
    restoreModal(modal);
    toggleScroll(false);
  };

  /* =========================
     Event listeners
  ========================== */

  const triggers = document.querySelectorAll('[data-el="video-modal-trigger"]');
  const closeBtns = document.querySelectorAll('[data-el="video-modal-close"]');
  console.log('[video-modal] Found', triggers.length, 'trigger(s),', closeBtns.length, 'close button(s)');

  // Open
  triggers.forEach(trigger => {
    // Capture slide state on pointerdown — before Swiper transitions and updates classes
    let wasInactiveSlide = false;
    trigger.addEventListener('pointerdown', () => {
      wasInactiveSlide = !!trigger.closest('.is-slide-previous, .is-slide-next');
      console.log('[video-modal] Pointerdown — inactive slide:', wasInactiveSlide);
    });

    trigger.addEventListener('click', (e) => {
      // If the click originated inside the modal (e.g. close button bubbling up), ignore it
      if (e.target.closest('[data-el="video-modal"]')) {
        console.log('[video-modal] Click inside modal bubbled to trigger — ignored');
        return;
      }
      // Ignore if the slide was inactive at the time of the press
      if (wasInactiveSlide) {
        console.log('[video-modal] Trigger was on inactive slide — ignored');
        return;
      }
      console.log('[video-modal] Trigger clicked', trigger);
      const modal = findModal(trigger);
      if (!modal) return;
      teleportToBody(modal);
      console.log('[video-modal] Opening modal', modal);
      modal.classList.add('is-open');
      toggleScroll(true);
    });
  });

  // Close via button
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      console.log('[video-modal] Close button clicked');
      closeModal(btn.closest('[data-el="video-modal"]'));
    });
  });

  // Close via Escape
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = document.querySelector('[data-el="video-modal"].is-open');
    if (open) {
      console.log('[video-modal] Escape pressed, closing modal');
      closeModal(open);
    }
  });

  console.log('[video-modal] Ready');
};

window.initVideoModals = initVideoModals;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initVideoModals);
} else {
  initVideoModals();
}
