window.Webflow ||= [];
window.Webflow.push(() => {
  if (window.innerWidth >= 991) {
    console.log("✅ Animation script initialized");

    // Master timeline to control all timelines
    const masterTimeline = gsap.timeline();

    // Timeline for Scene 1
    const scene1Timeline = gsap.timeline();


      console.log("🔄 Scrolling to top...");
      window.scrollTo(0, 0);


    scene1Timeline
      .to(".ai-sales-agent_hero-bg", {
        opacity: 1,
        height: "100%",
        duration: 0.5,
        ease: "power1.inOut",
        onStart: () => console.log("🎬 Scene 1: Background fades in"),
      })
      .fromTo(
        ".is-heading-1",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          ease: "power2.inOut",
          onStart: () => console.log("📝 Scene 1: Heading 1 appears"),
        },
        "<"
      )
      .to(".is-heading-1", {
        opacity: 0.12,
        y: -90,
        duration: 0.3,
        delay: 1,
        ease: "power2.inOut",
        onStart: () => console.log("💨 Scene 1: Heading 1 fades out"),
      })
      .to(".is-heading-2", {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.inOut",
        onStart: () => console.log("📝 Scene 1: Heading 2 appears"),
      })
      .to(".is-heading-2", {
        opacity: 0.12,
        y: -90,
        duration: 0.3,
        delay: 0.3,
        ease: "power2.inOut",
        onStart: () => console.log("💨 Scene 1: Heading 2 fades out"),
      })
      .to(".is-heading-1", {
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
        onStart: () => console.log("💨 Scene 1: Heading 1 fully disappears"),
      }, "<")
      .to(".is-heading-3", {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.inOut",
        onStart: () => console.log("📝 Scene 1: Heading 3 appears"),
      });

    const transitionScene2 = gsap.timeline();

    transitionScene2
      .to(".is-scene-1", {
        opacity: 0,
        duration: 0,
        ease: "power1.inOut",

        delay: 1,
        onStart: () => console.log("🚪 Transition: Scene 1 fades out"),
      })
      .set(".is-scene-1", { position: "absolute" })
      .to(".is-scene-2", {
        opacity: 1,
        duration: 0,
        ease: "power1.inOut",
        onStart: () => console.log("🚪 Transition: Scene 2 fades in"),

      })
      .fromTo(
        ".is-into.is-bigger",
        { fontSize: "5.63rem" },
        {
          fontSize: "13.5rem",
          duration: 0.8,
          ease: "power1.inOut",
          onStart: () => console.log("🔠 Transition: 'Into' text expands"),
        },
        "<"
      )
      .fromTo(
        ".is-sale.is-bigger",
        { fontSize: "5.63rem" },
        {
          fontSize: "13.5rem",
          duration: 0.8,
          ease: "power1.inOut",
          onStart: () => console.log("🔠 Transition: 'Sale' text expands"),
        },
        "<"
      )
      .fromTo(
        "#first-visual",
        { width: "0px", height: "0px" },
        {
          width: "30rem",
          height: "18rem",
          duration: 0.8,
          ease: "back.inOut",
          onStart: () => console.log("🖼️ Transition: First visual grows"),
        },
        "<"
      )
      .to("#first-visual", {
        width: "66rem",
        height: "40rem",
        duration: 1,
        ease: "back.inOut",
        onStart: () => console.log("🖼️ Transition: First visual expands fully"),
      }, "+=0.5")
      .to(".is-into.is-bigger", {
        opacity: 0,
        fontSize: "32rem",
        width: "63.2rem",
        duration: 1,
        ease: "power1.inOut",
        onStart: () => console.log("💨 Transition: 'Into' text fades out"),
      }, "<")
      .to(".is-sale.is-bigger", {
        opacity: 0,
        fontSize: "32rem",
        width: "63.2rem",
        duration: 1,
        ease: "power1.inOut",
        onStart: () => console.log("💨 Transition: 'Sale' text fades out"),
      }, "<")
      .to(".is-alt-header", {
        height: "18.5rem",
        duration: 0.5,
        ease: "expo.inOut",
        onStart: () => console.log("📏 Transition: Alt header expands"),
      })
      .to("#first-visual", {
        yPercent: 10,
        duration: 0.3,
        ease: "none",
        onStart: () => console.log("🎭 Transition: First visual moves up"),
      }, "<");

    const heroFinal = gsap.timeline();

    heroFinal
      .to(".is-alt-header", {
        opacity: 1,
        duration: 0.15,
        ease: "power1.inOut",
        onStart: () => console.log("🦸‍♂️ Hero Final: Alt header fades in"),
      })
      .fromTo(
        ["#hero-title", "#hero-subtext", "#early-access-hero"],
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          ease: "power1.inOut",
          onStart: () => console.log("🎬 Hero Final: Title, subtext, and CTA appear"),
        }
      )
      .to(".no-scroll", {
        overflow: "auto",
        maxHeight: "none",
        onStart: () => console.log("🔓 Hero Final: Scroll restored"),
      })
      .set(".section-hidden", {
        display: "block",
        onStart: () => console.log("👀 Hero Final: Hidden sections revealed"),
      });

masterTimeline
  .call(() => {
    console.log("🔄 Scrolling to top...");
    window.scrollTo(0, 0);
  }) // Ensures scrolling happens first
  .add(scene1Timeline)
  .add(transitionScene2)
  .add(heroFinal);

    console.log("🎥 Master timeline started");
    setTimeout(() => {
    masterTimeline.play();
    }, 500);
  }

    // Ensure the scrollbar exists
    if ($('.ai-conv_menu-scrollbar').length === 0) {
      $('.ai-conv_tabs-menu').append('<div class="ai-conv_menu-scrollbar"></div>');
  }

  function updateScrollbarPosition() {
      const tabs = $(".ai-conv_tabs-link");
      const activeTab = $(".ai-conv_tabs-link.w--current");
      const scrollbar = $(".ai-conv_menu-scrollbar");

      if (activeTab.length === 0 || tabs.length !== 4) {
          console.warn("🚨 Could not find .w--current or unexpected number of tabs!");
          return;
      }

      // Get active tab index
      const activeIndex = tabs.index(activeTab);
      const topPosition = `${activeIndex * 25}%`; // First tab = 0%, Second = 25%, etc.

      console.log(`🟢 Active tab index: ${activeIndex}, Setting scrollbar top to: ${topPosition}`);

      // Apply position
      scrollbar.css({ top: topPosition });
  }

  // Run initially on page load
  updateScrollbarPosition();

  // Observe changes in .w--current class
  const observer = new MutationObserver(() => {
      console.log("🔄 Detected class change, updating scrollbar...");
      updateScrollbarPosition();
  });

  $(".ai-conv_tabs-link").each(function () {
      observer.observe(this, { attributes: true, attributeFilter: ["class"] });
  });

  setTimeout(() => {
    $(".tabs_trigger").each(function (index) {
      console.log(`Initializing ScrollTrigger for .tabs_trigger index: ${index}`);
    
      ScrollTrigger.create({
        trigger: $(this),
        start: "top center",
        end: "+=0",
        markers: false, // Set to true to visualize trigger points
        onEnter: () => {
          console.log(`onEnter triggered for index: ${index}`);
          console.log(`Clicking .ai-conv_tabs-link index: ${index + 1}`);
          $(".ai-conv_tabs-link").eq(index + 1).click();
        },
        onEnterBack: () => {
          console.log(`onEnterBack triggered for index: ${index}`);
          console.log(`Clicking .ai-conv_tabs-link index: ${index}`);
          $(".ai-conv_tabs-link").eq(index).click();
        },
      });
    });
  }, 8100);

});


  
