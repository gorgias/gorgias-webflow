if (window.innerWidth >= 991) {
  gsap.registerPlugin(ScrollTrigger);

  const layers = gsap.utils.toArray(".stack-layer");
  const navItems = gsap.utils.toArray(".stack-wrapper_navigation-item");
  const descItems = gsap.utils.toArray(".stack-wrapper_desc-item");

  let stackTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".is-stacked-section",
      start: "top top",
      end: "+=" + layers.length * 300,
      scrub: true,
      pin: true,
      //markers: true,
      onUpdate: (self) => {},
    },
  });

  const layerHeight = 32;

  [...layers].reverse().forEach((layer, i) => {
    const textIndex = layers.length - 1 - i;
    const dataIndex = layer.getAttribute("data-index");

    layer.style.zIndex = 100 + i;

    stackTl.to(
      layer,
      {
        opacity: 1,
        duration: 0.3,
      },
      i - 0.2
    );

    stackTl.to(
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

    navItems.forEach((el) => {
      const index = el.dataset.index;
      stackTl.call(
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
}
