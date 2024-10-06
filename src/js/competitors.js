var Webflow = Webflow || [];
Webflow.push(function () {
  // Function to update the width of elements with data-value
  function updateElementWidths() {
    $('[data-value]').each(function() {
      let value = $(this).data('value');
      if (value < 5) {
        value = value * 20;
      } else if (value >= 5) {
        value = value * 10;
      }
      $(this).css('width', value + '%');
    });
  }
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        updateElementWidths();
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.7
  });

  observer.observe(document.querySelector('#num-values'));



    // Initialize the "thumbs" slider (mySwiper)
  var mySwiper = new Swiper(".myswiper", {
    slidesPerView: 'auto',  // Show multiple thumbs
    spaceBetween: 10,       // Space between thumbs
    watchSlidesProgress: true,  // Ensure thumbs stay in sync with progress
    watchSlidesVisibility: true, // Ensure thumbs stay visible
    slideToClickedSlide: true,   // Enable clicking on thumbs to change main slider
    on: {
      init: function() {
        console.log('Thumbs slider (mySwiper) initialized successfully.');
      },
    }
  });

  // Initialize the "main vertical" slider (mySwiper3)
  var mySwiper3 = new Swiper(".myswiper3", {
    direction: 'vertical',
    slidesPerView: 1,    // Only one slide in view at a time
    spaceBetween: 0,     // No space between slides
    autoHeight: true,    // Automatically adjust height based on content
    mousewheel: {
      releaseOnEdges: true,  // Allow scrolling beyond edges
    },
    thumbs: {             // Use the thumbs component to connect to mySwiper
      swiper: mySwiper,    // Link the thumbs slider (mySwiper) to this main slider
    },
    on: {
      init: function() {
        console.log('Main vertical slider (mySwiper3) initialized successfully.');
      },
      slideChange: function() {
        console.log('Main vertical slider (mySwiper3) changed to index:', this.activeIndex);
        if (mySwiper2) {
          mySwiper2.slideTo(this.activeIndex);  // Sync with fade effect slider
          console.log('Syncing fade effect slider (mySwiper2) to index:', this.activeIndex);
        }
      }
    }
  });

  // Initialize the "fade effect" slider (mySwiper2)
  var mySwiper2 = new Swiper(".myswiper2", {
    effect: 'fade',                   // Fade effect for smoother transitions
    fadeEffect: { crossFade: true },   // Crossfade effect for transitions
    slidesPerView: 1,                 // Only one slide visible at a time
    spaceBetween: 0,                  // No space between slides
    on: {
      init: function() {
        console.log('Fade effect slider (mySwiper2) initialized successfully.');
      },
      slideChange: function() {
        console.log('Fade effect slider (mySwiper2) changed to index:', this.activeIndex);
      }
    }
  });

});