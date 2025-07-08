gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const layers = gsap.utils.toArray(".stack-layer");
const navItems = gsap.utils.toArray(".stack-wrapper_navigation-item");
const descItems = gsap.utils.toArray(".stack-wrapper_desc-item");

let tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".is-stacked-section",
    start: "top top",
    end: "+=" + layers.length * 500,
    scrub: true,
    pin: true,
    // markers: true, // enable scroll markers
    onUpdate: (self) => {},
  },
});

const layerHeight = 32;

[...layers].reverse().forEach((layer, i) => {
  const textIndex = layers.length - 1 - i;
  const dataIndex = layer.getAttribute("data-index");

  layer.style.zIndex = 100 + i;

  // Fade in early
  tl.to(
    layer,
    {
      opacity: 1,
      duration: 0.3,
    },
    i - 0.2
  );

  // Drop in
  tl.to(
    layer,
    {
      y: -(i * layerHeight),
      duration: 1,
      ease: "back.out(1.5)",
      onStart: () => {
        console.log(`Activating layer index ${dataIndex} (timeline step ${i})`);
      },
    },
    i
  );

  // Navigation items: toggle is-active
  navItems.forEach((el) => {
    const index = el.dataset.index;
    tl.call(
      () => {
        if (index === String(textIndex)) {
          el.classList.add("is-active");
          console.log(`→ Activating nav item index ${index}`);
        } else {
          el.classList.remove("is-active");
        }
      },
      null,
      i
    );
  });

  // Description items: fade only matching one
  descItems.forEach((el) => {
    const index = el.dataset.index;
    tl.to(
      el,
      {
        opacity: index === String(textIndex) ? 1 : 0,
        duration: 0.2,
      },
      i
    );
  });
});
