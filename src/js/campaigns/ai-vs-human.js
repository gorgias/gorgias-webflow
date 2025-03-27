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


  // Copy score
  // Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    const observerConfig = { childList: true, characterData: true, subtree: true };
  
    // Find the source element (dynamic Superform output)
    const source = document.querySelector('[sf-react="text($v.ai)"]');
    const targets = document.querySelectorAll('[data-el="copy-score"]');
  
    if (!source || targets.length === 0) return;
  
    // Create observer
    const observer = new MutationObserver(() => {
      const newValue = source.textContent.trim();
      targets.forEach(el => {
        el.textContent = newValue;
      });
    });
  
    // Start observing
    observer.observe(source, observerConfig);
  
    // Set initial value
    const initial = source.textContent.trim();
    targets.forEach(el => {
      el.textContent = initial;
    });
  });


 

