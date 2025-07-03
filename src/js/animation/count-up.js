/**
 * Count up functionality using GSAP + GSAP scroll trigger.
 * Make sure GSAP script and scroll trigger plugin are loaded to the page.
 * Use the data-el="count-up" attribute on the number you want to animate.
 */

const items = document.querySelectorAll('[data-el="count-up"]');

items.forEach((item) => {
  const number = parseFloat(item.textContent.replace(/,/g, ""));
  if (isNaN(number)) return;

  const showDecimal = !Number.isInteger(number);

  gsap.fromTo(
    item,
    { textContent: 0 },
    {
      textContent: number,
      duration: 1.5,
      ease: "power1.out",
      snap: { textContent: showDecimal ? 0.01 : 1 },
      scrollTrigger: {
        trigger: item,
        start: "top 85%",
        once: true,
      },
      onUpdate: function () {
        const value = parseFloat(item.textContent);
        item.innerHTML = showDecimal ? value.toFixed(1) : Math.round(value);
      },
    }
  );
});