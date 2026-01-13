/**
 * Navigation interaction model
 *
 * Desktop:
 * - Focus-driven preview with roving tabindex
 * - Arrow keys move across top-level items
 * - Focus opens panels, focus-out closes
 * - Hover mirrors focus behavior
 * - Panels are visual disclosures (no focus trapping)
 *
 * Mobile:
 * - Separate DOM branch (.nav_wrapper-mobile)
 * - Tap-driven accordion navigation
 * - One section open at a time
 * - Linear tab order (no roving tabindex)
 *
 * Desktop and mobile share content, not behavior.
 */

// ============================================================================
// Desktop mega-nav
// ============================================================================

// Desktop wrapper: prefer an explicit desktop branch, otherwise fall back to the primary wrapper
// (but avoid accidentally picking the mobile branch).
const navWrapper =
  document.querySelector(".nav_wrapper--desktop") ||
  document.querySelector(".nav_wrapper:not(.nav_wrapper-mobile)");

if (navWrapper) {
  // Scope all queries to the desktop wrapper to avoid picking up mobile elements.
  const panels = navWrapper.querySelectorAll(".nav_panel");
  // Triggers must be the *top-level* items only (panels also have `data-panel`).
  const triggers = navWrapper.querySelectorAll('.nav_nav-item[data-panel]');
  // Include Pricing in roving tabindex even though it has no panel.
  const navItems = navWrapper.querySelectorAll(".nav_nav-item");

  const panelLeftSections = navWrapper.querySelectorAll(".nav_panel-s-left");
  const panelBottomSections = navWrapper.querySelectorAll(".nav_panel-bottom");
  const showcaseCards = navWrapper.querySelectorAll(".nav_showcase-card");

  const CLOSE_DELAY = 120;
  let closeTimeout = null;
  let isHoveringTrigger = false;
  let isHoveringPanel = false;
  let activePanel = null;

  // --------------------
  // Helpers
  // --------------------

  function clearActiveNavItems() {
    triggers.forEach(t =>
      t.closest(".nav_nav-item")?.classList.remove("is-active")
    );
  }

  function resetAriaExpanded() {
    triggers.forEach(t => t.setAttribute("aria-expanded", "false"));
  }

  // Focus the first interactive element inside a panel (keyboard-only deep navigation)
  function focusFirstLinkInPanel(panelName) {
    const panel = [...panels].find(p => p.dataset.panel === panelName);
    if (!panel) return;

    const firstFocusable = panel.querySelector(
      'a[href], button:not([disabled]), [tabindex="0"]'
    );

    if (firstFocusable) {
      // Defer to ensure panel is visible before moving focus
      requestAnimationFrame(() => {
        firstFocusable.focus();
      });
    }
  }

  // --------------------
  // ARIA + tabindex setup
  // --------------------

  triggers.forEach(trigger => {
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

  panels.forEach(panel => {
    const panelName = panel.dataset.panel;
    if (!panelName) return;

    panel.id = `nav-panel-${panelName}`;
    panel.setAttribute("role", "region");

    const trigger = navWrapper.querySelector(`.nav_nav-item[data-panel="${panelName}"]`);
    if (trigger?.id) {
      panel.setAttribute("aria-labelledby", trigger.id);
    }
  });

  // --------------------
  // Panel open / close
  // --------------------

  function openPanel(panelName) {
    if (activePanel === panelName) return;
    if (closeTimeout) clearTimeout(closeTimeout);

    const panel = [...panels].find(p => p.dataset.panel === panelName);
    if (!panel) return;

    navWrapper.classList.add("is-expanded");

    panels.forEach(p => p.classList.remove("is-active"));
    panel.classList.add("is-active");

    clearActiveNavItems();
    const trigger = [...triggers].find(t => t.dataset.panel === panelName);
    trigger?.closest(".nav_nav-item")?.classList.add("is-active");

    resetAriaExpanded();
    trigger?.setAttribute("aria-expanded", "true");

    navItems.forEach(i => i.setAttribute("tabindex", "-1"));
    trigger?.setAttribute("tabindex", "0");

    activePanel = panelName;
  }

  function closePanels() {
    if (closeTimeout) clearTimeout(closeTimeout);

    panels.forEach(p => p.classList.remove("is-active"));
    clearActiveNavItems();
    navWrapper.classList.remove("is-expanded");
    resetAriaExpanded();

    navItems.forEach(i => i.setAttribute("tabindex", "-1"));
    navItems[0]?.setAttribute("tabindex", "0");

    activePanel = null;
  }

  // --------------------
  // Scroll state
  // --------------------

  function updateNavScrollState() {
    const isScrolled = window.scrollY > 100;
    navWrapper.classList.toggle("is-scrolled", isScrolled);

    panelLeftSections.forEach(el =>
      el.classList.toggle("is-scrolled", isScrolled)
    );
    panelBottomSections.forEach(el =>
      el.classList.toggle("is-scrolled", isScrolled)
    );
    showcaseCards.forEach(el =>
      el.classList.toggle("is-scrolled", isScrolled)
    );
  }

  window.addEventListener("scroll", updateNavScrollState);
  updateNavScrollState();

  // --------------------
  // Hover interactions
  // --------------------

  triggers.forEach(trigger => {
    trigger.addEventListener("mouseenter", () => {
      isHoveringTrigger = true;
      openPanel(trigger.dataset.panel);
    });

    trigger.addEventListener("mouseleave", () => {
      isHoveringTrigger = false;
      scheduleCloseIfIdle();
    });

    trigger.addEventListener("click", e => {
      e.preventDefault();
      openPanel(trigger.dataset.panel);
    });
  });

  panels.forEach(panel => {
    panel.addEventListener("mouseenter", () => {
      isHoveringPanel = true;
      if (closeTimeout) clearTimeout(closeTimeout);
    });

    panel.addEventListener("mouseleave", () => {
      isHoveringPanel = false;
      scheduleCloseIfIdle();
    });
  });

  navWrapper.addEventListener("mouseenter", () => {
    if (closeTimeout) clearTimeout(closeTimeout);
  });

  navWrapper.addEventListener("mouseleave", scheduleCloseIfIdle);

  function scheduleCloseIfIdle() {
    if (isHoveringTrigger || isHoveringPanel) return;
    closeTimeout = setTimeout(closePanels, CLOSE_DELAY);
  }

  // --------------------
  // Keyboard navigation
  // --------------------

  // Allow ESC to close the mega-nav even when focus is inside a panel.
  // (Our per-navItem handler only catches ESC when the top-level item itself is focused.)
  navWrapper.addEventListener(
    "keydown",
    e => {
      if (e.key !== "Escape") return;

      // Only act if focus is currently somewhere inside the desktop nav.
      if (!navWrapper.contains(document.activeElement)) return;

      e.preventDefault();
      e.stopPropagation();

      // Close any open panel(s).
      closePanels();

      // Remove nav from the keyboard flow entirely
      navItems.forEach(i => i.setAttribute("tabindex", "-1"));

      // Move focus to the next logical element after the nav
      // (usually the first focusable element in the page content)
      const focusAfterNav = navWrapper.nextElementSibling?.querySelector(
        'a[href], button:not([disabled]), [tabindex="0"]'
      );

      if (focusAfterNav) {
        focusAfterNav.focus();
      } else {
        // Fallback: blur active element so arrow keys no longer apply
        document.activeElement?.blur();
      }
    },
    true // capture so ESC works from deep focusable children
  );

  navItems.forEach(item => {
    item.addEventListener("focus", () => {
      item.dataset.panel ? openPanel(item.dataset.panel) : closePanels();
    });

    item.addEventListener("keydown", e => {
      const index = [...navItems].indexOf(item);

      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const dir = e.key === "ArrowRight" ? 1 : -1;
        const next = (index + dir + navItems.length) % navItems.length;

        navItems.forEach(i => i.setAttribute("tabindex", "-1"));
        navItems[next].setAttribute("tabindex", "0");
        navItems[next].focus();
      }

      if (e.key === "Enter" && item.dataset.panel) {
        e.preventDefault();
        openPanel(item.dataset.panel);
        focusFirstLinkInPanel(item.dataset.panel);
      }

      // Removed per-item Escape handler as per instructions
    });
  });
}

// ============================================================================
// Mobile accordion nav
// ============================================================================

Webflow.push(() => {
  const mobileNav = document.querySelector(".nav_wrapper-mobile");
  if (!mobileNav) return;

  console.group("[Mobile Nav Accordion]");
  console.log("Initialized");


  const triggers = mobileNav.querySelectorAll('[g-accordion-element="trigger"]');
  console.log("Triggers found:", triggers.length);

  // 2) Normalize markup + a11y wiring (and wrap accordion content in a single inner element
  //    so the CSS grid animation works reliably even if Webflow outputs many direct children).
  triggers.forEach(trigger => {
    const label = trigger.textContent.trim();
    console.log("Setup trigger:", label);

    const item = trigger.closest(".nav_nav-item") || trigger.parentElement;
    item?.setAttribute("g-accordion-element", "item");

    trigger.setAttribute("role", "button");

    const content = trigger.nextElementSibling;
    if (!content || content.getAttribute("g-accordion-element") !== "content") {
      console.warn("No accordion content sibling for trigger:", label);
      return;
    }

    // Remove any leftover inline height styles from the previous JS-driven implementation.
    content.style.maxHeight = "";

    // Ensure an inner wrapper exists for the CSS animation.
    let inner = content.querySelector('[g-accordion-element="inner"]');
    if (!inner) {
      inner = document.createElement("div");
      inner.setAttribute("g-accordion-element", "inner");

      // Move existing children into the inner wrapper.
      while (content.firstChild) {
        inner.appendChild(content.firstChild);
      }
      content.appendChild(inner);
    }

    // ARIA wiring
    const id = content.id || `mobile-accordion-${Math.random().toString(36).slice(2)}`;
    content.id = id;
    content.setAttribute("role", "region");
    trigger.setAttribute("aria-controls", id);

    // Preserve server-rendered state if any, otherwise default closed.
    const isOpen = trigger.classList.contains("is-active") || content.classList.contains("is-active");
    trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    content.classList.toggle("is-active", isOpen);

    const arrow = trigger.querySelector('[g-accordion-element="arrow"]');
    arrow?.classList.toggle("is-active", isOpen);
  });

  // 3) Toggle behavior: use ONE event type (pointerdown) for consistent mobile + desktop behavior.
  //    (Pointer events are supported on modern iOS; this avoids Webflow click interception issues.)
  function closeItem(item) {
    const t = item.querySelector('[g-accordion-element="trigger"]');
    const c = item.querySelector('[g-accordion-element="content"]');
    const a = item.querySelector('[g-accordion-element="arrow"]');

    t?.classList.remove("is-active");
    t?.setAttribute("aria-expanded", "false");
    c?.classList.remove("is-active");
    a?.classList.remove("is-active");
  }

  function openItem(item) {
    const t = item.querySelector('[g-accordion-element="trigger"]');
    const c = item.querySelector('[g-accordion-element="content"]');
    const a = item.querySelector('[g-accordion-element="arrow"]');

    t?.classList.add("is-active");
    t?.setAttribute("aria-expanded", "true");
    c?.classList.add("is-active");
    a?.classList.add("is-active");
  }

  triggers.forEach(trigger => {
    const label = trigger.textContent.trim();

    trigger.addEventListener("pointerdown", e => {
      // Prevent Webflow nav from hijacking taps/clicks.
      e.preventDefault();
      e.stopPropagation();

      const item = trigger.closest('[g-accordion-element="item"]');
      const content = trigger.nextElementSibling;

      if (!item || !content || content.getAttribute("g-accordion-element") !== "content") {
        console.warn("Toggle skipped (missing item/content):", label);
        return;
      }

      const parent = item.parentElement;
      const oneBy = parent?.getAttribute("g-accordion-function") === "one-by";
      const isOpen = trigger.classList.contains("is-active");

      console.log("Toggle:", label, "one-by:", oneBy, "currently open:", isOpen);

      // If one-by, close siblings first.
      if (oneBy) {
        parent
          .querySelectorAll('[g-accordion-element="item"]')
          .forEach(sibling => {
            if (sibling !== item) closeItem(sibling);
          });
      }

      // Toggle current item
      if (isOpen) {
        closeItem(item);
      } else {
        openItem(item);
      }
    });
  });

  console.groupEnd();
});