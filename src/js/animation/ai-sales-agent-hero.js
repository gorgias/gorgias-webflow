// On document loaded, the AI Sales Agent Hero animation is initialized
$(document).ready(function () {
// For screens only above 991px
if(window.innerWidth >= 991) {
 
const masterTimeline = gsap.timeline();
const scene1Timeline = gsap.timeline();
const scene2Timeline = gsap.timeline();
const finalSceneTimeline = gsap.timeline();

// Scene 1
scene1Timeline
//Background fades in
.to(".ai-sales-agent_hero-bg", {
    opacity: 1,
    height: "100%",
    duration: 0.5,
    ease: "power1.inOut",
  })

//Headings fade in/out & move
.fromTo(".is-heading-1", 
    { opacity: 0 }, 
    { opacity: 1, duration: 0.5, ease: "power1.inOut" },)

.to(".is-heading-1", { opacity: 0.12, y: -90, duration: 0.3, delay: 1, ease: "power1.inOut" })

.to(".is-heading-2", { opacity: 1, y: 0, duration: 0.3, ease: "power1.inOut" })

.to(".is-heading-2", { opacity: 0.12, y: -90, duration: 0.3, delay: 0.3, ease: "power1.inOut" })

.to(".is-heading-1", { opacity: 0, duration: 0.3 }, "<")

.to(".is-heading-3", { opacity: 1, y: 0, duration: 0.3, ease: "power1.inOut" })

// Scene 2
scene2Timeline
// Scene 1 fades out and then sets to position absolute
.to(".is-scene-1", { opacity: 0, duration: 0.25, delay: .8 ,ease: "none" })
.set(".is-scene-1", { position: "absolute"})
.set(".is-scene-2", { display: "flex"})
// Scene 2 fades in
.to('.is-scene-2', { opacity: 1, duration: 0.25, ease: "none" })

// Start animating title and media
// Media grows
.fromTo( "#first-visual",
    { width: "0px", height: "0px" },
    {
      width: "30rem",
      height: "18rem",
      duration: 0.8,
      ease: "back.inOut"
    },
    "<"
  )
  .to(".is-into.is-bigger", { fontSize: "13.5rem", duration: 0.8, ease: "power1.inOut"}, "<")
  .to(".is-sale.is-bigger", { fontSize: "13.5rem", duration: 0.8, ease: "power1.inOut"}, "<")  


  // Media expands fully
  .to("#first-visual", {
    width: "66rem",
    height: "40rem",
    duration: 1,
    ease: "back.inOut",
    delay: 1,
    onStart: () => console.log("🖼️ Transition: First visual expands fully"),
  })

  .to(".is-into.is-bigger", { fontSize: "32rem", width:"63rem", opacity:"0", duration: 1, ease: "power1.inOut"}, "<")
  .to(".is-sale.is-bigger", { fontSize: "32rem", width:"63rem", opacity:"0", duration: 1, ease: "power1.inOut"}, "<")

  // Final placement of media, and hero appears
  .to(".is-alt-header", { height: "18.5rem", duration: 0.5, ease: "expo.inOut"})
  .to("#first-visual", {
    yPercent: 10,
    duration: 0.3,
    ease: "none"
  }, "<");

  finalSceneTimeline
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
  .to(".ai-sales-agent", {
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
  .add(scene2Timeline)
  .add(finalSceneTimeline);


  masterTimeline.play();

  }
});