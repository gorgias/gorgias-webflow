document
  .querySelectorAll('[g-accordion-element="trigger"]')
  .forEach((trigger) => {
    const bar1 = trigger.querySelector(".office-details_trigger-icon-bar.is-1");
    const bar2 = trigger.querySelector(".office-details_trigger-icon-bar.is-2");
    if (!bar1 || !bar2) return;

    trigger.addEventListener("click", () => {
      bar1.classList.toggle("is-open");
      bar2.classList.toggle("is-open");
    });
  });