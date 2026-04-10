document.querySelectorAll('[data-name]').forEach((el) => {
  el.textContent = el.dataset.name;
});
