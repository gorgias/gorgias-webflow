$(document).ready(function () {
  // Master timeline to control all timelines
  const masterTimeline = gsap.timeline();

  // Timeline for Scene 1
  const scene1Timeline = gsap.timeline();

  scene1Timeline
    // Line 1: "Turn Every"
    .to(".is-heading-1", {
      opacity: 0.12, // Disappear
      y: -90, // Move up while disappearing
      duration: 0.5,
      delay: 1, // Pause briefly before disappearing
      ease: "power2.inOut"
    })

    // Line 2: "Conversation"
    .to(".is-heading-2", {
      opacity: 1, // Appear
      y: 0, // Move to position
      duration: 0.5,
      ease: "power2.inOut"
    })

    .to(".is-heading-2", {
      opacity: 0.12, // Disappear
      y: -90, // Move up while disappearing
      duration: 0.5,
      delay: 0.5, // Pause briefly before disappearing
      ease: "power2.inOut"
    })

    .to(
      ".is-heading-1",
      {
        opacity: 0, // Disappear
        duration: 0.5,
        ease: "power2.inOut"
      },
      "<" // Run simultaneously with the previous animation
    )

    // Line 3: "Into a Sale"
    .to(".is-heading-3", {
      opacity: 1, // Appear
      y: 0, // Move to position
      duration: 0.5,
      ease: "power2.inOut"
    }
    )

  // Timeline for transitioning between scenes
  const transitionScene2 = gsap.timeline();

  transitionScene2
    // Fade out .is-scene-1
    .to(".is-scene-1", {
      opacity: 0,
      duration: 0.3,
      ease: "power1.inOut",
      delay: 1 // Pause briefly before disappearing
    })

    .set('.is-scene-1', { position: 'absolute' })

    // Fade in .is-scene-2
    .fromTo(
      ".is-scene-2",
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.3,
        ease: "power1.inOut"
      },
    )

    .fromTo(".is-into.is-bigger", {
        fontSize: "5.63rem"
    }, {
        fontSize: "13.5rem", duration: .5, ease: "power1.inOut"
    }
    )

    .fromTo(".is-sale.is-bigger", {
        fontSize: "5.63rem"
    }, {
        fontSize: "13.5rem", duration: .5, ease: "power1.inOut"
    }, "<" // Run simultaneously with the previous animation
    )

    .fromTo("#first-visual", 
        { width: "0px", height: "0px"}, 
        {width: "30rem", height: "18rem", duration: .5, ease: "back.inOut"}, "<" // Run simultaneously with the previous animation
    )

    .to("#first-visual", 
        {width: "66rem", height: "44rem", duration: 1, ease: "back.inOut"}, "+=1" // Wait 1 second before starting
    )

    .to(".is-into.is-bigger", {
        opacity: 0, fontSize: "32rem", width: "63.2rem" , duration: 1, ease: "power1.inOut"
    }, 
    "<" // Run simultaneously with the previous animation
    )

    .to(".is-sale.is-bigger", {
        opacity: 0, fontSize: "32rem", width: "63.2rem" , duration: 1, ease: "power1.inOut"
    }, 
    "<" // Run simultaneously with the previous animation
    )


    .to('.is-alt-header', { height: "18.5rem", duration: 0.5, ease: "expo.inOut" })
    .to("#first-visual", 
        { yPercent: 10, duration: .3, ease: "none"}, "<"
    )



    .fromTo("#hero-title",
        { yPercent: 30, opacity: 0 },
        {
        opacity: 1,
        yPercent: 0,
        duration: 0.5,
        ease: "power1.inOut",
      })

    const heroFinal = gsap.timeline();

    heroFinal

  .to('.is-alt-header', { opacity: 1, duration: 0.3, ease: "power1.inOut" }, "<")
  .to('.loader-gradient', { opacity: 0, duration: 0.3, ease: "power1.inOut" }, "<")


  .fromTo(
    [ "#hero-subtext", "#early-access-hero"], // Array of elements to animate
    { opacity: 0 }, // Starting opacity
    { opacity: 1, duration: 0.3, ease: "power1.inOut", stagger: 0.2 }
  )

  .to('.is-loading-hero', {height: 'auto', duration: 0.01, ease: "none" })
  .to('.no-scroll', { overflow: 'auto', maxHeight:"None" })

  // Add timelines to master timeline in sequence
  masterTimeline.add(scene1Timeline).add(transitionScene2).add(heroFinal);

  // Optional: Debugging - Play master timeline
  masterTimeline.play();

    // // 🎮 Attach Controls to Master Timeline
    // document.getElementById("play").addEventListener("click", () => masterTimeline.play());
    // document.getElementById("pause").addEventListener("click", () => masterTimeline.pause());
    // document.getElementById("reverse").addEventListener("click", () => masterTimeline.reverse());
    // document.getElementById("restart").addEventListener("click", () => masterTimeline.restart());
  
    // // 🎚 Scrubber Control (Allows manual timeline scrubbing)
    // const scrubber = document.getElementById("scrubber");
  
    // scrubber.addEventListener("input", function () {
    //   masterTimeline.progress(scrubber.value);
    // });
  
    // // 🔄 Update scrubber in real-time while animation plays
    // gsap.ticker.add(() => {
    //   scrubber.value = masterTimeline.progress();
    // });
});



$(document).ready(function () {
    function updateScrollbar() {
        const links = $(".ai-conv_tabs-link");
        const scrollbar = $(".ai-conv_menu-scrollbar");

        links.each(function (index) {
            if ($(this).hasClass("w--current")) {
                const topValue = index * 25 + "%";
                scrollbar.css("top", topValue);
            }
        });
    }

    // Run on page load
    updateScrollbar();

    // Run whenever a tab link gets the `w--current` class
    $(document).on("click", ".ai-conv_tabs-link", function () {
        setTimeout(updateScrollbar, 25); // Ensure transition occurs after class change
    });

    // If using Webflow interactions, listen for class mutation
    const observer = new MutationObserver(updateScrollbar);
    $(".ai-conv_tabs-link").each(function () {
        observer.observe(this, { attributes: true, attributeFilter: ["class"] });
    });
});