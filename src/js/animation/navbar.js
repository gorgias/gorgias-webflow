const navWrapper = document.querySelector(".nav_wrapper");
const navContainer = document.querySelector(".nav_container");
const panels = document.querySelectorAll(".nav_panel");
const triggers = document.querySelectorAll("[data-panel]");
const panelLeftSections = document.querySelectorAll(".nav_panel-s-left");
const panelBottomSections = document.querySelectorAll(".nav_panel-bottom");
const showcaseCards = document.querySelectorAll(".nav_showcase-card");

const CLOSE_DELAY = 120; // ms
let closeTimeout = null;

let isHoveringTrigger = false;
let isHoveringPanel = false;

/* -------------------------------------
   CONFIG: known good collapsed height
------------------------------------- */
const DEFAULT_COLLAPSED_HEIGHT = 80.3438; // px

let collapsedHeight = DEFAULT_COLLAPSED_HEIGHT;
let activePanel = null;

/* -------------------------------------
   Apply collapsed height
------------------------------------- */
function applyCollapsedHeight(height) {
  collapsedHeight = height;

  document.documentElement.style.setProperty(
    "--nav-collapsed-height",
    height + "px"
  );

  navWrapper.style.height = height + "px";
}

/* -------------------------------------
   Measure later (safe, optional)
------------------------------------- */
function reconcileCollapsedHeight() {
  if (!navContainer) return;

  const measured = navContainer.offsetHeight;

  // Ignore obviously wrong early values
  if (measured < 60) return;

  // Only update if meaningfully different
  if (Math.abs(measured - collapsedHeight) > 1) {
    applyCollapsedHeight(measured);
  }
}

/* -------------------------------------
   Measure panel height (off-DOM)
------------------------------------- */
function measurePanelHeight(panel) {
  const clone = panel.cloneNode(true);
  clone.style.position = "absolute";
  clone.style.visibility = "hidden";
  clone.style.display = "block";
  document.body.appendChild(clone);

  const height = clone.offsetHeight;
  document.body.removeChild(clone);

  return height;
}

/* -------------------------------------
   Open panel
------------------------------------- */
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

  const expandedHeight =
    collapsedHeight + measurePanelHeight(panel);

  navWrapper.style.height = collapsedHeight + "px";

  requestAnimationFrame(() => {
    navWrapper.classList.add("is-expanded");
    navWrapper.style.height = expandedHeight + "px";

    requestAnimationFrame(() => {
      panels.forEach((p) => p.classList.remove("is-active"));
      panel.classList.add("is-active");
    });
  });

  activePanel = panelName;
}

/* -------------------------------------
   Close panels
------------------------------------- */
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
  navWrapper.style.height = collapsedHeight + "px";
  activePanel = null;
}

/* -------------------------------------
   Scroll state
------------------------------------- */
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

/* -------------------------------------
   Init (no early measuring)
------------------------------------- */
(function initNav() {
  if (!navWrapper) return;

  // 1. Apply known good height immediately
  applyCollapsedHeight(DEFAULT_COLLAPSED_HEIGHT);

  // 2. Reconcile after layout settles
  requestAnimationFrame(() => {
    requestAnimationFrame(reconcileCollapsedHeight);
  });

  // 3. Keep in sync later (safe)
  const ro = new ResizeObserver(reconcileCollapsedHeight);
  ro.observe(navContainer);

  window.addEventListener("resize", reconcileCollapsedHeight);
  window.addEventListener("scroll", updateNavScrollState);
  updateNavScrollState();
})();

/* -------------------------------------
   Events
------------------------------------- */
triggers.forEach((trigger) => {
  trigger.addEventListener("mouseenter", (e) => {
    e.preventDefault();
    openPanel(trigger.dataset.panel);
  });
  trigger.addEventListener("click", (e) => {
    e.preventDefault();
    const panelName = trigger.dataset.panel;

    // Mark nav items active
    triggers.forEach((t) =>
      t.closest(".nav_nav-item")?.classList.remove("is-active")
    );
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