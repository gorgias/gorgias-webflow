/**
 * Desktop mega-nav interaction model
 *
 * - Focus-driven preview: focusing a top-level item opens its panel
 * - Roving tabindex: arrow keys move focus across top-level items
 * - Items without panels (e.g. Pricing) act as panel terminators
 * - Hover mirrors focus behavior for mouse users
 * - Panels are visual disclosures, not keyboard focus destinations
 *
 * This file intentionally avoids height calculations and focus traps.
 */

const navWrapper = document.querySelector(".nav_wrapper");
const panels = document.querySelectorAll(".nav_panel");
const triggers = document.querySelectorAll("[data-panel]");
const panelLeftSections = document.querySelectorAll(".nav_panel-s-left");
const panelBottomSections = document.querySelectorAll(".nav_panel-bottom");
const showcaseCards = document.querySelectorAll(".nav_showcase-card");

// Core nav elements
const navItems = document.querySelectorAll(".nav_nav-item");

// -------------------------------------
// Accessibility: initial ARIA setup
// -------------------------------------
triggers.forEach((trigger) => {
  trigger.setAttribute("role", "button");
  trigger.setAttribute("aria-haspopup", "true");
  trigger.setAttribute("aria-expanded", "false");

  const panelName = trigger.dataset.panel;
  if (panelName) {
    trigger.setAttribute("aria-controls", `nav-panel-${panelName}`);
  }
});

navItems.forEach((item, index) => {
  item.setAttribute("tabindex", index === 0 ? "0" : "-1");
});

panels.forEach((panel) => {
  const panelName = panel.dataset.panel;
  if (!panelName) return;

  panel.setAttribute("id", `nav-panel-${panelName}`);
  panel.setAttribute("role", "region");

  const trigger = document.querySelector(
    `[data-panel="${panelName}"]`
  );
  if (trigger?.id) {
    panel.setAttribute("aria-labelledby", trigger.id);
  }
});

const CLOSE_DELAY = 120; // ms
let closeTimeout = null;

let isHoveringTrigger = false;
let isHoveringPanel = false;

let activePanel = null;

// Remove active state from all top-level nav items
function clearActiveNavItems() {
  triggers.forEach((t) =>
    t.closest(".nav_nav-item")?.classList.remove("is-active")
  );
}

// Opens a panel and syncs visual, ARIA, and keyboard state
function openPanel(panelName) {
  if (closeTimeout) {
    clearTimeout(closeTimeout);
    closeTimeout = null;
  }

  if (activePanel === panelName) return;

  const panel = [...panels].find(
    (p) => p.dataset.panel === panelName
  );
  if (!panel) return;

  // Mark wrapper expanded (CSS controls layout/animation)
  navWrapper.classList.add("is-expanded");

  // Activate correct panel
  panels.forEach((p) => p.classList.remove("is-active"));
  panel.classList.add("is-active");

  // Mark trigger active
  clearActiveNavItems();
  const activeTrigger = [...triggers].find(
    (t) => t.dataset.panel === panelName
  );
  activeTrigger?.closest(".nav_nav-item")?.classList.add("is-active");

  // Update aria-expanded states
  triggers.forEach((t) =>
    t.setAttribute("aria-expanded", "false")
  );
  activeTrigger?.setAttribute("aria-expanded", "true");

  // Sync roving tabindex to active item
  navItems.forEach((item) => item.setAttribute("tabindex", "-1"));
  activeTrigger?.setAttribute("tabindex", "0");

  activePanel = panelName;
}

// Closes all panels and resets nav to its resting state
function closePanels() {
  if (closeTimeout) {
    clearTimeout(closeTimeout);
    closeTimeout = null;
  }

  panels.forEach((p) => p.classList.remove("is-active"));
  triggers.forEach((t) =>
    t.closest(".nav_nav-item")?.classList.remove("is-active")
  );

  navWrapper.classList.remove("is-expanded");

  // Reset aria-expanded states
  triggers.forEach((t) =>
    t.setAttribute("aria-expanded", "false")
  );

  // Ensure one tabbable item remains
  const firstItem = navItems[0];
  navItems.forEach((item) => item.setAttribute("tabindex", "-1"));
  firstItem?.setAttribute("tabindex", "0");

  activePanel = null;
}

// Scroll state
function updateNavScrollState() {
  const isScrolled = window.scrollY > 100;

  navWrapper.classList.toggle("is-scrolled", isScrolled);

  panelLeftSections.forEach((el) =>
    el.classList.toggle("is-scrolled", isScrolled)
  );
  panelBottomSections.forEach((el) =>
    el.classList.toggle("is-scrolled", isScrolled)
  );
  showcaseCards.forEach((el) =>
    el.classList.toggle("is-scrolled", isScrolled)
  );
}

// Init (no early measuring)
(function initNav() {
  if (!navWrapper) return;

  window.addEventListener("scroll", updateNavScrollState);
  updateNavScrollState();
})();

// Events
triggers.forEach((trigger) => {
  trigger.addEventListener("mouseenter", (e) => {
    e.preventDefault();
    openPanel(trigger.dataset.panel);
  });
  trigger.addEventListener("click", (e) => {
    e.preventDefault();
    const panelName = trigger.dataset.panel;

    // Mark nav items active
    clearActiveNavItems();
    trigger.closest(".nav_nav-item")?.classList.add("is-active");

    openPanel(panelName);
  });

  trigger.addEventListener("mouseenter", () => {
    isHoveringTrigger = true;
  });

  trigger.addEventListener("mouseleave", () => {
    isHoveringTrigger = false;
    scheduleCloseIfIdle();
  });
});

// Keyboard navigation: focus-driven preview with roving tabindex
navItems.forEach((item) => {
  item.addEventListener("focus", () => {
    if (item.dataset.panel) {
      openPanel(item.dataset.panel);
    } else {
      closePanels();
    }
  });

  item.addEventListener("keydown", (e) => {
    const currentIndex = [...navItems].indexOf(item);

    switch (e.key) {
      case "ArrowRight": {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % navItems.length;
        navItems.forEach((i) => i.setAttribute("tabindex", "-1"));
        navItems[nextIndex].setAttribute("tabindex", "0");
        navItems[nextIndex].focus();
        break;
      }

      case "ArrowLeft": {
        e.preventDefault();
        const prevIndex =
          (currentIndex - 1 + navItems.length) % navItems.length;
        navItems.forEach((i) => i.setAttribute("tabindex", "-1"));
        navItems[prevIndex].setAttribute("tabindex", "0");
        navItems[prevIndex].focus();
        break;
      }

      case "Escape": {
        e.preventDefault();
        closePanels();
        item.focus();
        break;
      }
    }
  });
});

panels.forEach((panel) => {
  panel.addEventListener("mouseenter", () => {
    isHoveringPanel = true;
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }
  });

  panel.addEventListener("mouseleave", () => {
    isHoveringPanel = false;
    scheduleCloseIfIdle();
  });
});

// Close panels when neither trigger nor panel is hovered
function scheduleCloseIfIdle() {
  if (isHoveringTrigger || isHoveringPanel) return;

  if (closeTimeout) clearTimeout(closeTimeout);
  closeTimeout = setTimeout(() => {
    closePanels();
  }, CLOSE_DELAY);
}

navWrapper.addEventListener("mouseenter", () => {
  if (closeTimeout) {
    clearTimeout(closeTimeout);
    closeTimeout = null;
  }
});

navWrapper.addEventListener("mouseleave", scheduleCloseIfIdle);