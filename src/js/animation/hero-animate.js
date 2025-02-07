$(document).ready(function () {
  // Only run animations for screens wider than or equal to 1024px
  if (window.innerWidth >= 991) {
    // Master timeline to control all timelines
    const masterTimeline = gsap.timeline();

    // Timeline for Scene 1
    const scene1Timeline = gsap.timeline();

// Immediately scroll to the top
window.scrollTo(0, 0); 

// Delay applying "overflow: hidden" slightly to avoid blocking the scroll
setTimeout(() => {
  document.querySelector(".no-scroll").style.overflow = "hidden";
  document.querySelector(".no-scroll").style.maxHeight = "100vh";
}, 10); // Delay slightly to let scroll take effect

    scene1Timeline
      // Line 1: "Turn Every"
      .to(".is-heading-1", {
        opacity: 0.12, // Disappear
        y: -90, // Move up while disappearing
        duration: 0.3,
        delay: 1, // Pause briefly before disappearing
        ease: "power2.inOut"
      })

      // Line 2: "Conversation"
      .to(".is-heading-2", {
        opacity: 1, // Appear
        y: 0, // Move to position
        duration: 0.3,
        ease: "power2.inOut"
      })

      .to(".is-heading-2", {
        opacity: 0.12, // Disappear
        y: -90, // Move up while disappearing
        duration: 0.3,
        delay: 0.1, // Pause briefly before disappearing
        ease: "power2.inOut"
      })

      .to(
        ".is-heading-1",
        {
          opacity: 0, // Disappear
          duration: 0.3,
          ease: "power2.inOut"
        },
        "<" // Run simultaneously with the previous animation
      )

      // Line 3: "Into a Sale"
      .to(".is-heading-3", {
        opacity: 1, // Appear
        y: 0, // Move to position
        duration: 0.3,
        ease: "power2.inOut"
      });

    // Timeline for transitioning between scenes
    const transitionScene2 = gsap.timeline();

    transitionScene2
      // Fade out .is-scene-1
      .to(".is-scene-1", {
        opacity: 0,
        duration: 0.3,
        ease: "power1.inOut",
        delay: 0 // Pause briefly before disappearing
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
        }
      )
      .fromTo(".is-into.is-bigger", {
          fontSize: "5.63rem"
      }, {
          fontSize: "13.5rem", duration: 0.5, ease: "power1.inOut"
      }, "<" // Run simultaneously with the previous animation
      )
      .fromTo(".is-sale.is-bigger", {
          fontSize: "5.63rem"
      }, {
          fontSize: "13.5rem", duration: 0.5, ease: "power1.inOut"
      }, "<" // Run simultaneously with the previous animation
      )
      .fromTo("#first-visual", 
          { width: "0px", height: "0px"}, 
          {width: "30rem", height: "18rem", duration: 0.5, ease: "back.inOut"}, "<" // Run simultaneously with the previous animation
      )
      .to("#first-visual", 
          {width: "66rem", height: "40rem", duration: 1, ease: "back.inOut"}, "+=.5" // Wait 1 second before starting
      )
      .to(".is-into.is-bigger", {
          opacity: 0, fontSize: "32rem", width: "63.2rem", duration: 1, ease: "power1.inOut"
      }, "<" // Run simultaneously with the previous animation
      )
      .to(".is-sale.is-bigger", {
          opacity: 0, fontSize: "32rem", width: "63.2rem", duration: 1, ease: "power1.inOut"
      }, "<" // Run simultaneously with the previous animation
      )
      .to('.is-alt-header', { height: "18.5rem", duration: 0.5, ease: "expo.inOut" })
      .to("#first-visual", 
          { yPercent: 10, duration: 0.3, ease: "none"}, "<"
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
        ["#hero-subtext", "#early-access-hero"],
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power1.inOut", stagger: 0.2 }
      )
      .to('.is-loading-hero', { height: 'auto', duration: 0.01, ease: "none" })
      .to('.no-scroll', { overflow: 'auto', maxHeight: "None" })
      .to('.ai-sales-agent_hero-bg', { opacity: 1, height: "85%", duration: 0.5, ease: "power1.inOut" }, "<")
      .to('.main-nav-bg', { opacity: 1, duration: 0.5, ease: "power1.inOut" }, "<")
      .set('.section-hidden', { display: 'block' })

    // Add timelines to master timeline in sequence
    masterTimeline.add(scene1Timeline).add(transitionScene2).add(heroFinal);
    
    // Play the master timeline
    masterTimeline.play();
  }
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