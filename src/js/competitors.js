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


window.fsComponents = window.fsComponents || [];
window.fsComponents.push([
  'slider',
  (sliderInstances) => {
    console.log('Slider Successfully loaded!');

    // Loop through each sliderInstance
    sliderInstances.forEach((sliderInstance) => {
      const sliderElement = sliderInstance.el; // Get the slider's root element

      // Use 'closest' to find the nearest parent with 'fs-slider-instance' attribute
      const fsSliderInstance = sliderElement.closest('[fs-slider-instance]')?.getAttribute('fs-slider-instance');

      // Log the value of fs-slider-instance
      console.log('fs-slider-instance value:', fsSliderInstance);

      // Check if the slider has the 'fs-slider-instance' attribute with value 'why_text' or 'why_image'
      if (fsSliderInstance === 'why_text' || fsSliderInstance === 'why_imgs') {
        console.log(`Configuring releaseOnEdges for slider with fs-slider-instance: ${fsSliderInstance}`);

        // Set the releaseOnEdges and enable mousewheel only for these sliders
        sliderInstance.params.mousewheel = {
          enabled: true,           // Enable the mousewheel module
          releaseOnEdges: true,    // Enable release on edges
        };

        // Update the swiper instance to apply new parameters
        sliderInstance.update();

        // Add event listener for slide change
        sliderInstance.on('slideChange', function () {
          console.log(`Slide changed to index: ${sliderInstance.activeIndex} on slider with fs-slider-instance: ${fsSliderInstance}`);
        });
      } else {
        console.log(`Skipping configuration for slider with fs-slider-instance: ${fsSliderInstance}`);
      }
    });
  },
]);

});


// REVERT TO THIS CODE IF NEEDED FOR SLIDERS

/*
    // Initialize the "thumbs" slider (mySwiper)
  var mySwiper = new Swiper(".myswiper", {
    slidesPerView: 'auto',  // Show multiple thumbs
    slidesPerGroup: 1,  // Ensure only 1 slide moves at a time
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
    slidesPerGroup: 1,  // Ensure only 1 slide moves at a time
    spaceBetween: 0,     // No space between slides
    autoHeight: true,    // Automatically adjust height based on content
    speed: 400,          // Slow down the transition speed
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
    slidesPerGroup: 1,  // Ensure only 1 slide moves at a time
    spaceBetween: 0,                  // No space between slides
    speed: 400,          // Slow down the transition speed
    mousewheel: {
      releaseOnEdges: true,  // Allow scrolling beyond edges
    },
    on: {
      init: function() {
        console.log('Fade effect slider (mySwiper2) initialized successfully.');
      },
      slideChange: function() {
        console.log('Fade effect slider (mySwiper2) changed to index:', this.activeIndex);
        if (mySwiper3) {
          mySwiper3.slideTo(this.activeIndex);  // Sync with fade effect slider
        }
      }
    }
  });
*/