gsap.registerPlugin(ScrollTrigger);

// --- EASY TWEAKS ---
const PER_LAYER_SCROLL = 400; // px of scroll per layer (adjust this for speed/feel)
const LAYER_ANIMATION_DURATION = 2; // seconds for each y movement
const layerHeight = 32; // px vertical offset per layer

const layers = gsap.utils.toArray(".stack-layer");
const navItems = gsap.utils.toArray(".stack-wrapper_navigation-item");
const descItems = gsap.utils.toArray(".stack-wrapper_desc-item");

// --- THE MAGIC TIMELINE ---
let stackTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".is-stacked-section",
    start: "top top",
    end: "+=350vh",
    scrub: true,
    pin: true,
    markers: true,
  },
});

// --- REVERSE LAYERS FOR STACKING ORDER ---
[...layers].reverse().forEach((layer, i) => {
  const textIndex = layers.length - 1 - i;
  const dataIndex = layer.getAttribute("data-index");
  layer.style.zIndex = 100 + i;

  // Fade in each layer slightly before its step
  stackTl.to(
    layer,
    {
      opacity: 1,
      duration: 0.3,
    },
    i - 0.2 // keep this fade timing!
  );

  // Slide up each layer
  stackTl.to(
    layer,
    {
      y: -(i * layerHeight),
      duration: LAYER_ANIMATION_DURATION,
      ease: "back.out(1.5)",
      // Optional debug:
      // onStart: () => { console.log(`Layer ${dataIndex} activated`); },
    },
    i
  );

  // Update navigation
  navItems.forEach((el) => {
    const index = el.dataset.index;
    stackTl.call(
      () => {
        if (index === String(textIndex)) {
          el.classList.add("is-active");
          // console.log(`→ Activating nav item index ${index}`);
        } else {
          el.classList.remove("is-active");
        }
      },
      null,
      i
    );
  });

  // Show/hide descriptions
  descItems.forEach((el) => {
    const index = el.dataset.index;
    stackTl.to(
      el,
      {
        opacity: index === String(textIndex) ? 1 : 0,
        duration: 0.2,
        onStart: () => {
          if (index === String(textIndex)) {
            el.style.zIndex = 999;
            el.style.pointerEvents = "auto";
          } else {
            el.style.zIndex = 1;
            el.style.pointerEvents = "none";
          }
        }
      },
      i
    );
  });
});