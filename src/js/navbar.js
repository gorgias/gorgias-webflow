console.log('Navbar script loaded');

// This script is responsible for the navigation bar functionality
/**
 * 
 * Variables for navbar
 * 
 */

let arrowSymbol = $('[data-nav="arrow"]');
let navDropdown = $('[data-nav="dropdown"]');
let navDropdownToggle = $('[data-nav="dropdown-toggle"]');
let navDropdownLinks = $('[data-nav="dropdown-links"]');

/** 
 * 
 * UI for the navigation bar
 *
*/

// Hide Partners dropdown from 1108px et 991px
function togglePartnerVisibility() {
  const el = document.querySelector('[data-el="partners"]');
  if (!el) return;

  const width = window.innerWidth;
  if (width >= 991 && width <= 1108) {
    el.style.display = 'none';
    console.log('Partners dropdown hidden due to screen width');
  } else {
    el.style.display = ''; // let default styling take over
  }
}

window.addEventListener('resize', togglePartnerVisibility);
window.addEventListener('DOMContentLoaded', togglePartnerVisibility);

// Rotate arrow symbol only within the hovered or clicked dropdown
navDropdown.each(function () {
  const $dropdown = $(this);

  $dropdown.on('mouseenter', function () {
    const $arrow = $dropdown.find('[data-nav="arrow"]');
    $arrow.addClass('rotate');

    if ($dropdown.is('[data-el="product-tour"]')) {
      $('.navbar_inner').addClass('no-bottom-border');
      console.log('Mouse entered product-tour dropdown, bottom border removed');
    }
  });

  $dropdown.on('mouseleave', function () {
    const $arrow = $dropdown.find('[data-nav="arrow"]');
    $arrow.removeClass('rotate');

    if ($dropdown.is('[data-el="product-tour"]')) {
      $('.navbar_inner').removeClass('no-bottom-border');
      console.log('Mouse left product-tour dropdown, bottom border restored');
    }
  });

  $dropdown.on('click', function () {
    const $arrow = $dropdown.find('[data-nav="arrow"]');
    $arrow.toggleClass('rotate');
  });
});

