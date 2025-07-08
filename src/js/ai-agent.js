// Split text to words and animate from opacity .15 to 1 when scrolling
const section = document.querySelector('[data-el="section-animate-text"]');
const text = section.querySelector('[data-el="text-animate"]');

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

const cards = gsap.utils.toArray(".anchor-cards_nav-item");
const container = document.querySelector(".section_anchor-cards");
const scrollEnd = window.innerHeight * cards.length * 0.45;

// Scroll-controlled timeline
let tl = gsap.timeline({
  scrollTrigger: {
    trigger: container,
    start: "top top",
    end: () => `+=${scrollEnd}px`,
    scrub: true,
    markers: true,
  },
});

cards.forEach((card, i) => {
  tl.to(
    {},
    {
      duration: 1,
      onUpdate: () => {
        cards.forEach((c) => c.classList.remove("is-active"));
        card.classList.add("is-active");
      },
    }
  );
});


// Scroll through cards then animate to serve as anchor links 
ScrollTrigger.create({
  trigger: container,
  start: () => `top+=${scrollEnd}px`,
  onEnter: () => {
    document.querySelectorAll(".anchor-cards_desc").forEach((el) => {
      el.style.display = "none";
    });
    document.querySelectorAll(".anchor-cards_nav-item").forEach((el) => {
      el.style.height = "4.13rem";
      el.style.pointerEvents = "auto";
      el.classList.remove("is-active"); // remove active from all
    });
    document
      .querySelector('[data-el="header-animate"]')
      .classList.add("is-animated");
    document
      .querySelector('[data-el="content-animate"]')
      .classList.add("is-animated");
  },
  onLeaveBack: () => {
    document.querySelectorAll(".anchor-cards_nav-item").forEach((el) => {
      el.style.height = "18rem";
      el.style.pointerEvents = "none";
    });
    setTimeout(() => {
      document.querySelectorAll(".anchor-cards_desc").forEach((el) => {
        el.style.display = "";
      });
    }, 400);
    // Re-add is-active to the last card
    const cards = document.querySelectorAll(".anchor-cards_nav-item");
    cards[cards.length - 1].classList.add("is-active");
    document
      .querySelector('[data-el="header-animate"]')
      .classList.remove("is-animated");
    document
      .querySelector('[data-el="content-animate"]')
      .classList.remove("is-animated");
  },
});