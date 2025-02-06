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

    .set('.is-scene-1', { display: 'none' })

    .set('.is-scene-2', { position: 'relative' })

    // Fade in .is-scene-2
    .to(
      ".is-scene-2",
      {
        opacity: 1,
        duration: 0.3,
        ease: "power1.inOut"
      },
      "-=0.3" // Overlap slightly for smoother transition
    )

    .fromTo(".section_hero-medias.is-ai-sales-agent", 
        { width: "0px", height: "0%"}, 
        {width: "30rem", height: "18rem", duration: .5, ease: "back.inOut"}
    )

    .to(".section_hero-medias.is-ai-sales-agent", 
        {width: "76rem", height: "44rem", duration: 1, ease: "back.inOut"}, "+=1" // Wait 1 second before starting
    )

    .to(".is-into.is-bigger", {
        opacity: 0, fontSize: "512px", width: "63.2rem" , duration: .3, ease: "power1.inOut"
    }, 
    "<" // Run simultaneously with the previous animation
    )

    .to(".is-sale.is-bigger", {
        opacity: 0, fontSize: "512px", width: "63.2rem" , duration: .3, ease: "power1.inOut"
    }, 
    "<" // Run simultaneously with the previous animation
    )

    const transitionScene3 = gsap.timeline();

    transitionScene3
    // Fade out .is-scene-2
    .to(".is-scene-2", {
      opacity: 0,
      duration: 0,
      ease: "power1.out"
    })

    .set('.is-scene-2', { display: 'none' })

    .set('.is-scene-3', { position: 'relative' })

    // Fade in .is-scene-3
    .to(
        ".is-scene-3",
        {
          opacity: 1,
          duration: 0,
          ease: "power1.in"
        },
        "<" // Overlap slightly for smoother transition
    )


    .to(
        ".section_hero-medias.is-ai-sales-agent.is-final",
        {
            yPercent: 35, duration: 0.5, ease: "bounce.Out", delay: 1
        },
    )

    const transitionOut = gsap.timeline();

    transitionOut
    .to("is-scene-3", {
        opacity: 0, duration: 0.3, ease: "power1.inOut"
    })

    .set('.is-scene-3', { display: 'none' })
    .set('.is-loading-hero', { display: 'none' })

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
  // Animate the background first
  .fromTo(".ai-sales-agent_hero-bg",
    { opacity: 0},
    {
    height: "81.5%",
    opacity: 1,
    duration: 1,
    ease: "power1.out",
  })

  // Stagger the fade-in of text elements
  .fromTo(
    ["#hero-subtext", "#early-access-hero"], // Array of elements to animate
    { opacity: 0 }, // Starting opacity
    { opacity: 1, duration: 0.3, ease: "power1.inOut", stagger: 0.2 },  "<"
  )



  // Add timelines to master timeline in sequence
  masterTimeline.add(scene1Timeline).add(transitionScene2).add(transitionScene3).add(transitionOut).add(heroFinal);

  // Optional: Debugging - Play master timeline
  masterTimeline.play();
});