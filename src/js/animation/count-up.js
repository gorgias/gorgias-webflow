/**
 * Count up functionality using GSAP + GSAP scroll trigger.
 * If a span has a data-stat attribute, replace its content with the data-stat value before animating.
 */

const items = document.querySelectorAll('[data-el="count-up"]');

items.forEach((item) => {
  // If the item has a data-stat attribute, update the text content with its value
  if (item.hasAttribute('data-stat')) {
    item.textContent = item.getAttribute('data-stat');
  }

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