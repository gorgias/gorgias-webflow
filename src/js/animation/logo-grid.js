function initLogoGrid() {
  document.querySelectorAll('[data-el="logo"]').forEach(function(logo) {
    var caseStudy = logo.querySelector('[data-el="case-study"]');
    if (!caseStudy) return;

    var href = caseStudy.getAttribute('href');
    if (!href || href.trim() === '' || href.trim() === '#') {
      var item = caseStudy.closest('.logo-grid_item');
      if (item) item.style.cursor = 'default';
      caseStudy.remove();
      return;
    }

    logo.addEventListener('mouseenter', function() {
      caseStudy.classList.remove('is-inactive');
    });

    logo.addEventListener('mouseleave', function() {
      caseStudy.classList.add('is-inactive');
    });
  });
}

initLogoGrid();
