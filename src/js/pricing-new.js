const approvedUrlsStage = ['/pages/template-long', '/pages/crm', '/pages/live-chat', '/pages/ticketing-system', '/pages/helpdesk', '/pages/customer-service', '/pages/ticketing-system-long', 
'/pages/customer-service-long', '/pages/helpdesk-long', '/pages/live-chat-long', '/pages/crm-long']; 
// template pages where pricing table is shown
 const templatePagesPaths = approvedUrlsStage.includes(window.location.pathname);
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
const combinedNotAvailable = {
  monthly: 'Not available',
  annual: 'Not available'
}
// automation, voice, sms data
const automationPrice = {
  starter: combinedNotAvailable,
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
// automation, voice, sms dropdown data
const automationDropdownValues = {
  1: { monthly: 30, annual: 25 },
  2: { monthly: 180, annual: 150 },
  3: { monthly: 450, annual: 375 },
  4: { monthly: 900, annual: 795 },
  5: { monthly: 1500, annual: 1250 },
  6: { monthly: 2500, annual: 2250 },
  7: { monthly: 'custom', annual: 'custom'}
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
let selectedPlan = templatePagesPaths ? pricingPlansTemplates[0] : pricingPlans[2]
let selectedPeriod = 'annual'
let automationChecked = false
let voiceChecked = false
let smsChecked = false

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

  const calculateTotalPrice = (automationTotalPrice, voiceTotalPrice, smsTotalPrice) => {
    const totalPriceEl = getEl('heading-tab-pane__pricing price-form')[0]
    let totalPrice = selectedPlan.price
    
    if (selectedPlan.name === 'enterprise' || isStringCustom(automationTotalPrice) || isStringCustom(voiceTotalPrice) || isStringCustom(smsTotalPrice)) {
      totalPrice = 'Custom price'
      totalPriceEl.nextSibling.classList.add('hidden')
    } else {
      if (automationTotalPrice) totalPrice += automationTotalPrice
      if (voiceTotalPrice) totalPrice += voiceTotalPrice
      if (smsTotalPrice) totalPrice += smsTotalPrice  
      totalPriceEl.nextSibling.classList.remove('hidden')
    }
    totalPrice = typeof totalPrice === 'string' ? totalPrice : '$' + totalPrice
    totalPriceEl.innerHTML = totalPrice
  }

  const calculateAddOnsPrices = (toggle, dropdownPrice, dropDownValue, basePrice, domElement) => {
    let price = (dropDownValue.value !== '1')
      ? dropdownPrice[dropDownValue.value][selectedPeriod] 
      : basePrice[selectedPlan.name][selectedPeriod] 
      const displayPrice = typeof price === 'string' ? price : '+$' + price + '/mo';
      domElement.innerHTML = displayPrice
      return toggle ? price : 0
  }

  const showButtonDisplay = () => {
    document.querySelectorAll(".button.pricing")[0].innerHTML = selectedPlan.name === 'enterprise' ? 'Contact us' : 'Start a free trial'
    document.querySelectorAll(".button.pricing")[0].href = selectedPlan.name === 'enterprise' 
      ? 'https://www.gorgias.com/demo?plan_name='+ selectedPlan.name +'&period=' + selectedPeriod
      : 'https://www.gorgias.com/signup?plan_name='+ selectedPlan.name +'&period=' + selectedPeriod
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
    // when starter is selected disable all checkboxes areas
    if (selectedPlan.name =='starter') {
      Array.from(getEl('wrapper-master-select__pricing')).forEach(el => el.style['pointer-events'] = 'none')
      getElId('pricing-automation').style.color = '#afafaf'
      getEl('green-heading-content-span__pricing')[3].style.color = '#afafaf'
      getEl('green-heading-content-span__pricing')[5].style.color = '#afafaf'
    } else {
      Array.from(getEl('wrapper-master-select__pricing')).forEach(el => el.style['pointer-events'] = 'auto')
      getElId('pricing-automation').style.color = '#1a9970'
      getEl('green-heading-content-span__pricing')[3].style.color = '#1a9970'
      getEl('green-heading-content-span__pricing')[5].style.color = '#1a9970'
    }
    // get dropdown and price span dom elements
    const automationDropdown = getElId('Number-Automation-Addon-Interaction')
    const voiceDropdown = getElId('number-phone-interaction')
    const smsDropdown = getElId('number-sms-interaction')
    const automationPriceEl = getElId('pricing-automation')
    const voicePriceEl = getEl('green-heading-content-span__pricing')[3]
    const smsPriceEl = getEl('green-heading-content-span__pricing')[5]
    // toggle dropdowns
    automationDropdown && showHideDropdown(automationDropdown, automationChecked)
    voiceDropdown && showHideDropdown(voiceDropdown, voiceChecked) 
    smsDropdown && showHideDropdown(smsDropdown, smsChecked)
    // calculate add-ons prices
    const automationTotalPrice = calculateAddOnsPrices(automationChecked, automationDropdownValues, automationDropdown, automationPrice, automationPriceEl)
    const voiceTotalPrice = calculateAddOnsPrices(voiceChecked, voiceDropdownValues, voiceDropdown, voicePrice, voicePriceEl)
    const smsTotalPrice = calculateAddOnsPrices(smsChecked, smsDropdownValues, smsDropdown, smsPrice, smsPriceEl)
    // calculate total price and button display
    calculateTotalPrice(automationTotalPrice, voiceTotalPrice, smsTotalPrice)
    showButtonDisplay()
  }
  // on first time load estimate prices
  estimatePrice()
  // add event listener for when we change period tab from monthly to yearly and viceversa
  // to select coresponing plan on other tab
  for (let i = 0; i < planPeriods.length; i++) {
    planPeriods[i].addEventListener('click', function () {
      const chooseTabs = templatePagesPaths ? tabsForTemplates : tabsForPricing
      pricingTabs[chooseTabs[selectedPlan.index]].click()  
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
      if (i === 0) automationChecked = !automationChecked
      if (i === 1) voiceChecked = !voiceChecked
      if (i === 2) smsChecked = !smsChecked
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
      if (activeCheckBoxes.length) {
        // when changing plan we deselect them
        Array.from(activeCheckBoxes).forEach(el => {
          el.parentNode.nextElementSibling.nextElementSibling.firstChild.click()
        })
      }
    });
  }
};