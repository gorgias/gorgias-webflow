function appendTrackingParams(href) {
  var params = 'ref=homepage_logo_grid&component=customer_story_logo_grid';
  var hashIndex = href.indexOf('#');
  var base = hashIndex !== -1 ? href.slice(0, hashIndex) : href;
  var hash = hashIndex !== -1 ? href.slice(hashIndex) : '';
  var separator = base.indexOf('?') !== -1 ? '&' : '?';
  return base + separator + params + hash;
}

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

    caseStudy.setAttribute('href', appendTrackingParams(href));

    caseStudy.addEventListener('click', function() {
      if (window.analytics && typeof window.analytics.track === 'function') {
        window.analytics.track('Logo Grid Customer Story Clicked', {
          ref: 'homepage_logo_grid',
          component: 'customer_story_logo_grid',
          destination: href,
        });
      }
    });

    logo.addEventListener('mouseenter', function() {
      caseStudy.classList.remove('is-inactive');
    });

    logo.addEventListener('mouseleave', function() {
      caseStudy.classList.add('is-inactive');
    });
  });
}

initLogoGrid();
