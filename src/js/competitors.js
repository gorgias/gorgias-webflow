var Webflow = Webflow || [];
Webflow.push(function () {
  // Function to update the width of elements with data-value
  function updateElementWidths() {
    $('[data-value]').each(function () {
      let value = $(this).data('value');
      if (value < 5) {
        value = value * 20;
      } else if (value >= 5) {
        value = value * 10;
      }
      $(this).css('width', value + '%');
    });
  }

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log('IntersectionObserver triggered:', entry.target);
          updateElementWidths();
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.7,
      rootMargin: '0px 0px -20% 0px' // helps trigger earlier on mobile
    }
  );

  const triggerElement = document.querySelector('#num-values');
  if (triggerElement) {
    observer.observe(triggerElement);
  } else {
    console.warn('#num-values not found in DOM');
  }

  // Fallback for touch devices: ensure animation happens after load
  window.addEventListener('load', () => {
    setTimeout(() => {
      console.log('Fallback updateElementWidths triggered');
      updateElementWidths();
    }, 1200); // allow time for layout / scroll to settle
  });

  // Optional scroll fallback (once only)
  window.addEventListener('scroll', () => {
    updateElementWidths();
  }, { once: true });


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



$(document).ready(function () {
  // Select all elements with the attribute 'data-competitor'
  $('[data-competitor]').each(function () {
    // Get the value of the 'data-competitor' attribute
    let competitorValue = $(this).attr('data-competitor');
    
    // Replace the text content of the element with the 'data-competitor' value
    $(this).text(competitorValue);
  });
});


});
