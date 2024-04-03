const approvedUrlsStage = ['/pages/template-long', '/pages/crm', '/pages/live-chat', '/pages/ticketing-system', '/pages/helpdesk', '/pages/customer-service', '/pages/ticketing-system-long', 
'/pages/customer-service-long', '/pages/helpdesk-long', '/pages/live-chat-long', '/pages/crm-long']
// template pages where pricing table is shown
 const templatePagesPaths = approvedUrlsStage.includes(window.location.pathname)
// tab indexes used for matching selected plans on both tabs(annual, monthly)
const tabsForTemplates = { 0: 4, 1: 5, 2: 6, 3: 7, 4: 0, 5: 1, 6: 2, 7: 3 }
const tabsForPricing = { 0: 6, 1: 6, 2: 7, 3: 8, 4: 9, 6: 1, 7: 2, 8: 3, 9: 4 }
const pricingPlans = {
  0: { name: 'starter', price: 10, index: 0 },
  1: { name: 'basic', price: 60, index: 1 },
  2: { name: 'pro', price: 360, index: 2 },
  3: { name: 'advanced', price: 900, index: 3 },
  4: { name: 'enterprise', price: 0, index: 4 },
  5: { name: 'starter', price: 0, index: 5 },
  6: { name: 'basic', price: 50, index: 6 },
  7: { name: 'pro', price: 300, index: 7 },
  8: { name: 'advanced', price: 750, index: 8 },
  9: { name: 'enterprise', price: 0, index: 9 },
}
const pricingPlansTemplates = {
  0: { name: 'basic', price: 60, index: 0 },
  1: { name: 'pro', price: 360, index: 1 },
  2: { name: 'advanced', price: 900, index: 2 },
  3: { name: 'enterprise', price: 0, index: 3 },
  4: { name: 'basic', price: 50, index: 4 },
  5: { name: 'pro', price: 300, index: 5 },
  6: { name: 'advanced', price: 750, index: 6 },
  7: { name: 'enterprise', price: 0, index: 7 },
}
const planPricingInit = { 0: '$10', 1: '$60', 2: '$360', 3: '$900', 4: 'Contact us', 5: 'Only available for monthly subscription', 6: '$50', 7: '$300', 8: '$750' }
const planPricingInitTemplate = { 0: '$60', 1: '$360', 2: '$900', 3: 'Contact us', 4: '$50', 5: '$300', 6: '$750' }
// repeating price constants that will be reused
const combinedVoice = {
  monthly: 30,
  annual: 25
}
const combinedSms = {
  monthly: 20,
  annual: 17
}
const combinedConvert = {
  monthly: 30,
  annual: 30
}
const combinedNotAvailable = {
  monthly: 'Not available',
  annual: 'Not available'
}
// automation, voice, sms data
const automationPrice = {
  starter: combinedVoice,
  basic: combinedVoice,
  pro: combinedVoice,
  advanced: combinedVoice,
  enterprise: combinedVoice
}
const voicePrice = {
  starter: combinedNotAvailable,
  basic: combinedVoice,
  pro: combinedVoice,
  advanced: combinedVoice,
  enterprise: combinedVoice,
}
const smsPrice = {
  starter: combinedNotAvailable,
  basic: combinedSms,
  pro: combinedSms,
  advanced: combinedSms,
  enterprise: combinedSms,
}
const convertPrice = {
  starter: combinedConvert,
  basic: combinedConvert,
  pro: combinedConvert,
  advanced: combinedConvert,
  enterprise: combinedConvert,
}
// automation, voice, sms dropdown data
const automationDropdownValues = {
  1: { monthly: 30, annual: 25 },
  2: { monthly: 180, annual: 150 },
  3: { monthly: 450, annual: 375 },
  4: { monthly: 900, annual: 750 },
  5: { monthly: 1500, annual: 1250 },
  6: { monthly: 2100, annual: 1750 },
  7: { monthly: 2500, annual: 2083 },
  8: { monthly: 'custom', annual: 'custom'}
}
const voiceDropdownValues = {
  2: { monthly: 90, annual: 75},
  3: { monthly: 135, annual: 113},
  4: { monthly: 175, annual: 146},
  5: { monthly: 250, annual: 208},
  6: { monthly: 400, annual: 333},
  7: { monthly: 'custom', annual: 'custom'}
}
const smsDropdownValues = {
  2: { monthly: 60, annual: 50},
  3: { monthly: 90, annual: 75},
  4: { monthly: 140, annual: 117},
  5: { monthly: 216, annual: 180},
  6: { monthly: 408, annual: 340},
  7: { monthly: 'custom', annual: 'custom'}
}
const convertDropdownValues = {
  1: { monthly: 30, annual: 30 },
  2: { monthly: 300, annual: 300},
  3: { monthly: 575, annual: 575},
  4: { monthly: 1100, annual: 1100},
  5: { monthly: 1575, annual: 1575},
  6: { monthly: 2000, annual: 2000},
  7: { monthly: 'custom', annual: 'custom'}

}
let selectedPlan = templatePagesPaths ? pricingPlansTemplates[0] : pricingPlans[7]
let selectedPeriod = 'annual'
let automationChecked = false
let voiceChecked = false
let smsChecked = false
let convertChecked = false

window.onload = function() {
  const getEl = (val) => document.getElementsByClassName(val)
  const getElId = (val) => document.getElementById(val)
  const planPeriods = getEl('text-menu__pricing')
  const pricingTabs = getEl('tab-pane__pricing')
  const isStringCustom = (el) => typeof el === 'string' && el === 'custom'
  // set plan and add on prices
  const setPlanPrices = (getEl) => {
    const priceTabs = getEl('heading-tab-pane__pricing price')
    priceTabs[0].innerHTML = templatePagesPaths ? planPricingInitTemplate[0] : planPricingInit[0]
    priceTabs[1].innerHTML = templatePagesPaths ? planPricingInitTemplate[1] : planPricingInit[1]
    priceTabs[2].innerHTML = templatePagesPaths ? planPricingInitTemplate[2] : planPricingInit[2]
    priceTabs[5].innerHTML = templatePagesPaths ? planPricingInitTemplate[5] : planPricingInit[6] 
    priceTabs[6].innerHTML = templatePagesPaths ? planPricingInitTemplate[6] : planPricingInit[7]  
    if (!templatePagesPaths) {
      priceTabs[3].innerHTML = planPricingInit[3] 
      priceTabs[7].innerHTML = planPricingInit[8] 
    } else {
      priceTabs[4].innerHTML = planPricingInitTemplate[4] 
      priceTabs[7].innerHTML = planPricingInit[8]
    }
  }
  setPlanPrices(getEl)
  const automationDescription = document.getElementsByClassName(' subheading-text-content__pricing checkbox-option')[0]
  automationDescription && (automationDescription.innerHTML = 'Monthly automated interactions')
 
  function capitalizeFirstLetter(inputString) {
    return `${inputString.charAt(0).toUpperCase()}${inputString.slice(1)}`;
  }

  const calculateTotalPrice = (automationTotalPrice, voiceTotalPrice, smsTotalPrice,convertTotalPrice) => {
    const totalPriceEl = getEl('heading-tab-pane__pricing price-form')[0]
    let totalPrice = selectedPlan.price
    
    if (selectedPlan.name === 'enterprise' || isStringCustom(automationTotalPrice) || isStringCustom(voiceTotalPrice) || isStringCustom(smsTotalPrice) || isStringCustom(convertTotalPrice)) {
      totalPrice = 'Custom price'
      totalPriceEl.nextSibling.classList.add('hidden')
    } else {
      if (automationTotalPrice) totalPrice += automationTotalPrice
      if (voiceTotalPrice) totalPrice += voiceTotalPrice
      if (smsTotalPrice) totalPrice += smsTotalPrice  
      if (convertTotalPrice) totalPrice += convertTotalPrice  
      totalPriceEl.nextSibling.classList.remove('hidden')
    }
    totalPrice = typeof totalPrice === 'string' ? totalPrice : '$' + formatNumberWithCommas(totalPrice)
    totalPriceEl.innerHTML = totalPrice
    // add mobile plan name 
    getElId('name-plan').innerHTML = capitalizeFirstLetter(selectedPlan.name)
  }

  const calculateAddOnsPrices = (toggle, dropdownPrice, dropDownValue, basePrice, domElement) => {
    let price = (dropDownValue.value !== '1')
      ? dropdownPrice[dropDownValue.value][selectedPeriod] 
      : basePrice[selectedPlan.name][selectedPeriod] 
      const displayPrice = typeof price === 'string' ? formatNumberWithCommas(price) : '+$' + formatNumberWithCommas(price) + '/mo';
      domElement.innerHTML = displayPrice
      return toggle ? price : 0
  }

  const showButtonDisplay = () => {
    const totalPriceElTextContent = getEl('heading-tab-pane__pricing price-form')[0].textContent.trim().toLowerCase()
    document.querySelectorAll(".button.pricing")[0].innerHTML = selectedPlan.name === 'enterprise' ? 'Contact us' : 'Start a free trial'
    document.querySelectorAll(".button.pricing")[0].href = selectedPlan.name === 'enterprise' 
      ? 'https://www.gorgias.com/demo?plan_name='+ selectedPlan.name +'&period=' + selectedPeriod
      : 'https://www.gorgias.com/signup?plan_name='+ selectedPlan.name +'&period=' + selectedPeriod

    if(totalPriceElTextContent === "custom price" || convertChecked){
      document.querySelectorAll(".button.pricing")[0].innerHTML = "Contact us";
      document.querySelectorAll(".button.pricing")[0].href = 'https://www.gorgias.com/demo?plan_name='+ selectedPlan.name +'&period=' + selectedPeriod
    }
  }

  const showHideDropdown = (el, show) => {
    if(show) {
      el && el.classList.remove('hidden')
    } else {
      el && el.classList.add('hidden') 
      el.value = '1'
    } 
  }
  // price calculation begins here
  const estimatePrice = () => {
    // when starter is selected disable all checkboxes areas except for automate
    if (selectedPlan.name =='starter') {
      Array.from(getEl('wrapper-master-select__pricing')).forEach((el,index) => {
        if(index > 1){
          el.style['pointer-events'] = 'none'
        }
      })
      // getElId('pricing-automation').style.color = '#afafaf'
      getEl('green-heading-content-span__pricing')[5].style.color = '#afafaf'
      getEl('green-heading-content-span__pricing')[7].style.color = '#afafaf'
    } else {
      Array.from(getEl('wrapper-master-select__pricing')).forEach(el => el.style['pointer-events'] = 'auto')
      getElId('pricing-automation').style.color = '#1a9970'
      getEl('green-heading-content-span__pricing')[5].style.color = '#1a9970'
      getEl('green-heading-content-span__pricing')[7].style.color = '#1a9970'
    }
    // get dropdown and price span dom elements
    const automationDropdown = getElId('Number-Automation-Addon-Interaction')
    const voiceDropdown = getElId('number-phone-interaction')
    const convertDropdown = getElId('number-convert-interaction')
    const smsDropdown = getElId('number-sms-interaction')
    const automationPriceEl = getElId('pricing-automation')
    const voicePriceEl = getEl('green-heading-content-span__pricing')[5]
    const smsPriceEl = getEl('green-heading-content-span__pricing')[7]
    const convertPriceEl = getEl('green-heading-content-span__pricing')[3]
    // toggle dropdowns
    automationDropdown && showHideDropdown(automationDropdown, automationChecked)
    voiceDropdown && showHideDropdown(voiceDropdown, voiceChecked) 
    smsDropdown && showHideDropdown(smsDropdown, smsChecked)
    convertDropdown && showHideDropdown(convertDropdown, convertChecked)
    // calculate add-ons prices
    const automationTotalPrice = calculateAddOnsPrices(automationChecked, automationDropdownValues, automationDropdown, automationPrice, automationPriceEl)
    const voiceTotalPrice = calculateAddOnsPrices(voiceChecked, voiceDropdownValues, voiceDropdown, voicePrice, voicePriceEl)
    const smsTotalPrice = calculateAddOnsPrices(smsChecked, smsDropdownValues, smsDropdown, smsPrice, smsPriceEl)
    const convertTotalPrice = calculateAddOnsPrices(convertChecked, convertDropdownValues, convertDropdown, convertPrice, convertPriceEl)
    // calculate total price and button display
    calculateTotalPrice(automationTotalPrice, voiceTotalPrice, smsTotalPrice,convertTotalPrice)
    showButtonDisplay()
  }
  // on first time load estimate prices
  estimatePrice()
  // add event listener for when we change period tab from monthly to yearly and viceversa
  // to select coresponing plan on other tab
  for (let i = 0; i < planPeriods.length; i++) {
    planPeriods[i].addEventListener('click', function () {
      const chooseTabs = templatePagesPaths ? tabsForTemplates : tabsForPricing
      if(selectedPeriod === "annual" && i === 0){
        pricingTabs[chooseTabs[selectedPlan.index]].click()  
      }
      if(selectedPeriod === "monthly" && i === 1){
        pricingTabs[chooseTabs[selectedPlan.index]].click()  
      }
      if (i === 0) selectedPeriod = 'monthly' 
      if (i === 1) selectedPeriod = 'annual' 
      estimatePrice()
    });
  }
  // add event listener for when change dropwdown value
  const selects = document.querySelectorAll("select")
  for (let i = 0; i < selects.length; i++) {
    selects[i].addEventListener('change', function () {
      estimatePrice()
    });
  }
  // add event listener for when enable/disable dropdown
  const checkBoxes = document.querySelectorAll(".wrapper-toggle-pricing")
  for (let i = 0; i < checkBoxes.length; i++) {
    checkBoxes[i].addEventListener('click', function () {
      if (i === 0) {
        automationChecked = !automationChecked
        toggleActiveClass(checkBoxes[i],automationChecked)
      }
      if (i === 1) {
        convertChecked = !convertChecked
        toggleActiveClass(checkBoxes[i],convertChecked)
      }
      if (i === 2) {
        voiceChecked = !voiceChecked
        toggleActiveClass(checkBoxes[i],voiceChecked)
      }
      if (i === 3) {
        smsChecked = !smsChecked
        toggleActiveClass(checkBoxes[i],smsChecked)
      }

      estimatePrice()
    });
  }
  // find if we have selected checkboxes
  const activeCheckBoxes = getEl('w--redirected-checked')
  for (let i = 0; i < pricingTabs.length; i++) {
    pricingTabs[i].addEventListener('click', function () {
      // when on annual tab, when clicking starter, redirect to starter on monthly tab
      if (!templatePagesPaths && i === 5) {
        planPeriods[0].click()
        pricingTabs[0].click()
      }
      // set selected plan and estimate price
      selectedPlan = pricingPlans[i]
      estimatePrice()

      // reset toggles only when the starter or enterprise plans are clicked
      if(i === 4 | i === 5 | i === 9){
        resetToggles(activeCheckBoxes)
      }
      // reset other toggles except automate and convert
      if(i === 0){
        document.querySelectorAll('.wrapper-toggle-pricing').forEach((item,index)=>{
          const isChecked = item.parentElement.parentElement.querySelector(".checkbox__pricing").classList.contains("w--redirected-checked");
          if(index > 1 && isChecked){
            item.click();
          }
        })
      }
    });
  }
  // add remove is-active class
  function toggleActiveClass(element, isActive) {
    const action = isActive ? 'add' : 'remove';
    element.classList[action]('is-active');
    element.querySelectorAll('*').forEach(child => child.classList[action]('is-active'));
  }

  // function to reset toggles
  const resetToggles = (activeCheckboxes)=>{
    Array.from(activeCheckboxes).forEach(el => {
      el.closest("label").parentElement.querySelector(".wrapper-toggle-pricing").click();
    })
  }
};


// Function to make text-link__pricing clickable and send to demo page, with a condition
function redirectToDemoPage() {
  const demoButton = document.querySelector('.text-link__pricing');
  if (demoButton) {
    demoButton.addEventListener('click', function () {
      // Check if the parent has the specified classes
      const parent = this.closest('.tab-pricing-options-link');
      if (parent && parent.classList.contains('w--current')) {
        console.log('Condition met, redirecting...');
        window.location.href = '/demo';
      } else {
        console.log('Condition not met, not redirecting.');
      }
    });
  }
}

redirectToDemoPage();

