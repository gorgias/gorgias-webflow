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
      slidesPerView: 'auto',
      spaceBetween: 10,
      slideToClickedSlide: true,  // Clicking thumbs moves the main slider
      watchSlidesProgress: true,  // Monitor progress for syncing
      watchSlidesVisibility: true, // Track visibility for better syncing
      on: {
        init: function() {
          console.log('Thumbs slider (mySwiper) initialized successfully.');
        },
        slideChange: function() {
          // Just logging the thumb slide change
          console.log('Thumbs slider changed, syncing main vertical slider to index:', this.activeIndex);
        }
      }
    });
  
    // Initialize the "main vertical" slider (mySwiper3)
    var mySwiper3 = new Swiper(".myswiper3", {
      direction: 'vertical',
      slidesPerView: 1,
      spaceBetween: 0,
      autoHeight: true,  // Adjust slider height based on content
      mousewheel: {
        releaseOnEdges: true,  // Release control when at the edge
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
      },
      controller: {
        control: mySwiper  // Link thumbs slider to main vertical slider
      }
    });
  
    // Initialize the "fade effect" slider (mySwiper2)
    var mySwiper2 = new Swiper(".myswiper2", {
      effect: 'fade',
      fadeEffect: { crossFade: true },  // Smooth fade effect
      slidesPerView: 1,
      spaceBetween: 0,  // No space between slides
      on: {
        init: function() {
          console.log('Fade effect slider (mySwiper2) initialized successfully.');
        },
        slideChange: function() {
          // Sync happens when `mySwiper3` changes, no direct control needed
          console.log('Fade effect slider (mySwiper2) changed to index:', this.activeIndex);
        }
      }
    });
  
    // Controller Setup: mySwiper controls mySwiper3 (but not vice versa)
    mySwiper.controller.control = mySwiper3;  // Thumbs control the main slider
  
    // mySwiper3 syncs with mySwiper2 for the fade effect
    mySwiper3.controller.control = mySwiper2;
  
  
    // Check if the elements for each slider exist in the DOM
    if (document.querySelector('.myswiper')) {
      console.log('Thumbs slider element (.myswiper) found.');
    } else {
      console.error('Thumbs slider element (.myswiper) not found!');
    }
  
    if (document.querySelector('.myswiper3')) {
      console.log('Main vertical slider element (.myswiper3) found.');
    } else {
      console.error('Main vertical slider element (.myswiper3) not found!');
    }
  
    if (document.querySelector('.myswiper2')) {
      console.log('Fade effect slider element (.myswiper2) found.');
    } else {
      console.error('Fade effect slider element (.myswiper2) not found!');
    }

});