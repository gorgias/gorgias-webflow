// Ensure GSAP and ScrollTrigger are loaded
gsap.registerPlugin(ScrollTrigger);


// Split text to words and animate from opacity .15 to 1 when scrolling
const section = document.querySelector('[data-el="section-animate-text"]');
const text = section ? section.querySelector('[data-el="text-animate"]') : null;

if (text) {
  const split = new SplitText(text, { type: "words" });
  gsap.set(split.words, { opacity: 0.15 });

  gsap.to(split.words, {
    opacity: 1,
    duration: 4,
    stagger: 1,
    scrollTrigger: {
      trigger: section,
      start: "10% center", // top of section hits bottom of viewport
      end: "bottom 80%", // bottom of section hits top of viewport
      scrub: true,
      //markers: true,
    },
  });
}

