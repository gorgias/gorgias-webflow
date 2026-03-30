function initFeatureNumbers() {
  document.querySelectorAll('section[data-el^="group-"]').forEach((section) => {
    const groupNumber = section.getAttribute('data-el').replace('group-', '');

    section.querySelectorAll('[data-el="group-number"]').forEach((el) => {
      el.textContent = groupNumber;
    });

    section.querySelectorAll('[data-el="feature-increment"]').forEach((el, i) => {
      el.textContent = i + 1;
    });
  });
}

initFeatureNumbers();
