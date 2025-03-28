window.fsComponents = window.fsComponents || [];
window.fsComponents.push([
  'slider',
  (sliderInstances) => {
    console.log('✅ Finsweet slider API loaded!');
    
    const navConfigs = [
      { instanceName: 'slider-instance-2', navAttr: 'navigation-3', prevAttr: 'previous-3', nextAttr: 'next-3' },
      { instanceName: 'slider-instance-3', navAttr: 'navigation-2', prevAttr: 'previous-2', nextAttr: 'next-2' },
    ];

    navConfigs.forEach(config => {
      const { instanceName, navAttr, prevAttr, nextAttr } = config;

      const nav = document.querySelector(`[fs-slider-element="${navAttr}"]`);
      if (!nav) {
        console.warn(`⛔ Navigation block not found for: ${navAttr}`);
        return;
      }

      const sliderInstance = sliderInstances.find(s => {
        const el = s.el?.closest?.('[fs-slider-instance]');
        return el?.getAttribute('fs-slider-instance') === instanceName;
      });

      if (!sliderInstance) {
        console.warn(`⛔ Missing slider instance for: ${instanceName}`);
        return;
      }

      console.log(`✅ Bound nav [${navAttr}] to slider: ${instanceName}`);

      const prevBtn = nav.querySelector(`[fs-slider-element="${prevAttr}"]`);
      const nextBtn = nav.querySelector(`[fs-slider-element="${nextAttr}"]`);

      if (prevBtn) {
        prevBtn.addEventListener('click', e => {
          e.preventDefault();
          sliderInstance.slidePrev();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', e => {
          e.preventDefault();
          sliderInstance.slideNext();
        });
      }

      const updateNavState = () => {
        console.log(`🔁 Checking nav state for ${instanceName}`);
        console.log(`   ⬅️ isBeginning: ${sliderInstance.isBeginning}, ➡️ isEnd: ${sliderInstance.isEnd}`);

        if (sliderInstance.isBeginning) {
          prevBtn?.classList.add('is-nav-disabled');
          console.log(`⛔ Prev disabled (${instanceName})`);
        } else {
          prevBtn?.classList.remove('is-nav-disabled');
          console.log(`✅ Prev enabled (${instanceName})`);
        }

        if (sliderInstance.isEnd) {
          nextBtn?.classList.add('is-nav-disabled');
          console.log(`⛔ Next disabled (${instanceName})`);
        } else {
          nextBtn?.classList.remove('is-nav-disabled');
          console.log(`✅ Next enabled (${instanceName})`);
        }
      };

      sliderInstance.on('slideChange', updateNavState);
      updateNavState(); // Initial check
    });
  }
]);


document.addEventListener('click', function (e) {
    const trigger = e.target.closest('[data-el="trigger-next"]');
    if (!trigger) return;
  
    const sliderNext = document.querySelector('[fs-slider-element="next"]');
    if (sliderNext) sliderNext.click();
  });

  document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const campaign = params.get('utm_campaign')?.toLowerCase() || '';
  
    const baseHeader = document.querySelector('[data-el="base-header"]');
    const altHeader = document.querySelector('[data-el="alternate-header"]');
  
    console.log("utm_campaign param:", campaign);
  
    if (!baseHeader || !altHeader) {
      console.warn("❌ Header elements not found");
      return;
    }
  
    if (campaign.includes('customer')) {
      baseHeader.style.display = 'none';
      altHeader.style.display = 'flex';
      console.log("✅ Showing alternate header (customer campaign)");
    } else {
      baseHeader.style.display = 'flex';
      altHeader.style.display = 'none';
      console.log("✅ Showing base header (default)");
    }
  });

// Handle the UI when an answer is chosen
document.addEventListener('click', (e) => {
    const label = e.target.closest('[data-el="radio-label"]');
    if (!label) return;
  
    const selectedRadio = label.closest('.ai-vs-human_radio');
    if (!selectedRadio) return;
  
    const group = selectedRadio.parentElement;
    if (!group || !group.classList.contains('ai-vs-human_radio-group')) return;
  
    const step = selectedRadio.closest('[sf-step]');
  
    // 1. Hide header-top inside current step
    if (step) {
        const headerTop = step.querySelector('.ai-vs-human_header-top');
        if (headerTop) {
          headerTop.classList.add('is-disabled');
      
            headerTop.classList.add('is-absolute');

        }
  
        // 2. Unmask the result block
        const resultBlock = step.querySelector('.ai-vs-human_result-block');
        if (resultBlock) {
        resultBlock.classList.remove('is-masked');
        }

        // 3. Unmask the .overlay *inside* this step only
        const overlay = step.querySelector(':scope > .overlay');
        if (overlay) {
        overlay.classList.remove('is-masked');
        console.log('✅ Overlay unmasked for step:', step.getAttribute('sf-step'));
        }
    }
  
    // 3. Handle radios in group
    const allRadios = [...group.querySelectorAll('.ai-vs-human_radio')];
  
    allRadios.forEach((radio) => {
      const radioLabel = radio.querySelector('[data-el="radio-label"]');
      if (radioLabel) {
        radioLabel.style.display = 'none';
      }
  
      if (radio !== selectedRadio) {
        radio.classList.add('is-ghost');
      } else {
        radio.classList.remove('is-ghost');
      }
    });
  });

  document.querySelectorAll('[data-el="radio-label"]').forEach(label => {
    label.addEventListener('click', () => {
      // 1. Select the actual radio input inside the same .ai-vs-human_radio
      const wrapper = label.closest('.ai-vs-human_radio');
      const radio = wrapper.querySelector('input[type="radio"]');
      
      if (radio) {
        radio.checked = true;
        
        // Dispatch native change event so Superform detects it
        radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
  
      // 2. [Optional] Toggle .is-ghost on the sibling card
      const allRadios = wrapper.parentElement.querySelectorAll('.ai-vs-human_radio');
      allRadios.forEach(r => r.classList.remove('is-ghost'));
      wrapper.parentElement.querySelectorAll('.ai-vs-human_radio:not(:has(:checked))')
        .forEach(r => r.classList.add('is-ghost'));
    });
  });

    // Hide header for last step of quiz
    $('[data-el="last-step-cta"]').on('click', function() {
        $('.ai-vs-human_progress').css("height", "0");
        $('.ai-vs-human_progress').css("padding", "0");
        $('[data-el="progress-el-hide"]').css("display", "none");
    });



 

