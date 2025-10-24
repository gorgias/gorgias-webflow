/**
 * Shopping Assistant ROI Tool
 * This tool helps in calculating the Return on Investment (ROI) for shopping campaigns.
 */

// Get the input fields from the DOM by data-attribute
let monthlyTraffic = document.querySelector('[data-el="monthly-traffic"]');
let avgChatContactRate = document.querySelector('[data-el="avg-chat-contact-rate"]');
let preSalesInquiries = document.querySelector('[data-el="pre-sales-inquiries"]');
let baselineConversionRate = document.querySelector('[data-el="baseline-conversion-rate"]');
let avgOrderValue = document.querySelector('[data-el="average-order-value"]');

// Get output spans from the DOM by data-attribute
let additionalRevMonthly = document.querySelector('[data-el="additional-revenue-monthly"]');
let additionalRevAnnual = document.querySelector('[data-el="additional-revenue-yearly"]');
let revenueIncreasePercent = document.querySelector('[data-el="revenue-increase"]');
let returnMultiple = document.querySelector('[data-el="return-multiple"]');

// Handle HubSpot form submit button to scroll to ROI section
const hsSubmitButton = document.querySelector('.hs-button.primary.large');

// Use HubSpot postMessage callback pattern (onFormReady) to wire the submit behavior
window.addEventListener('message', function (event) {
  if (
    event &&
    event.data &&
    event.data.type === 'hsFormCallback' &&
    event.data.eventName === 'onFormReady'
  ) {
    console.log('HubSpot form is ready.');

    // Bind click on HS submit button (jQuery available on Webflow)
    $('.hs-button').on('click', function () {
      console.log('Submit button clicked');
    });
  }
});

// -------- Prefill Logic After HubSpot Submission --------

// Industry benchmark constants
const INDUSTRY_BENCHMARKS = {
  chatRate: 2.0, // %
  preSales: 40.0, // %
  baselineCVR: 3.0 // %
};

// --- Number formatting helpers (US style) ---
// Use global formatNumberWithCommas if available (from all.js); otherwise fallback.
const _fmtWithCommas = (n) => {
  const s = String(n);
  if (typeof window !== 'undefined' && typeof window.formatNumberWithCommas === 'function') {
    return window.formatNumberWithCommas(s);
  }
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
function toNumberUS(value) {
  if (value == null) return 0;
  return Number(String(value).replace(/,/g, '').trim()) || 0;
}
function formatUS(num, decimals = 0) {
  const fixed = Number(num || 0).toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');
  const intFmt = _fmtWithCommas(intPart);
  return decPart != null ? `${intFmt}.${decPart}` : intFmt;
}

// Set value respecting input type (number inputs cannot contain commas)
function setUSValue(inputEl, num, decimals = 0) {
  if (!inputEl) return;
  const n = Number(num || 0);
  if (String(inputEl.type).toLowerCase() === 'number') {
    // number inputs must be plain numeric strings
    inputEl.value = n.toFixed(decimals);
  } else {
    // text inputs can be formatted with commas
    inputEl.value = formatUS(n, decimals);
  }
}

// Simple debounce helper
function debounce(fn, delay = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(null, args), delay);
  };
}

// Recalculate from current input values (no prefills)
function recalculateFromInputs() {
  // Sanitize percent fields for commas before parsing
  if (avgChatContactRate && /,/.test(avgChatContactRate.value)) avgChatContactRate.value = avgChatContactRate.value.replace(/,/g, '');
  if (preSalesInquiries && /,/.test(preSalesInquiries.value)) preSalesInquiries.value = preSalesInquiries.value.replace(/,/g, '');
  if (baselineConversionRate && /,/.test(baselineConversionRate.value)) baselineConversionRate.value = baselineConversionRate.value.replace(/,/g, '');

  // Parse input values and convert percentages to decimals
  const sessions = monthlyTraffic ? toNumberUS(monthlyTraffic.value) : 0;
  const chatRate = avgChatContactRate ? toNumberUS(avgChatContactRate.value) / 100 : 0;
  const preSales = preSalesInquiries ? toNumberUS(preSalesInquiries.value) / 100 : 0;
  const cvr = baselineConversionRate ? toNumberUS(baselineConversionRate.value) / 100 : 0;
  const aov = avgOrderValue ? toNumberUS(avgOrderValue.value) : 0;

  console.log(`[ROI][Recalc] Inputs - sessions: ${sessions}, chatRate: ${chatRate}, preSales: ${preSales}, cvr: ${cvr}, aov: ${aov}`);

  // Without Gorgias
  const ordersWithout = sessions * chatRate * preSales * cvr;
  const revenueWithout = ordersWithout * aov;

  // With Gorgias (uplifts)
  const chatRateWith = chatRate * 1.2;
  const cvrWith = cvr * 1.52;
  const aovWith = aov * 1.2;
  const ordersWith = sessions * chatRateWith * preSales * cvrWith;
  const revenueWith = ordersWith * aovWith;
  const incrementalRevenue = revenueWith - revenueWithout;
  const roi = (incrementalRevenue - 7360) / 7360;
  const revenueIncreasePct = revenueWithout > 0 ? (incrementalRevenue / revenueWithout) * 100 : 0;

  console.log(`[ROI][Recalc] Without - orders: ${ordersWithout.toFixed(2)}, revenue: ${revenueWithout.toFixed(2)}`);
  console.log(`[ROI][Recalc] With    - orders: ${ordersWith.toFixed(2)}, revenue: ${revenueWith.toFixed(2)}`);
  console.log(`[ROI][Recalc] Incremental: ${incrementalRevenue.toFixed(2)}, ROI: ${roi.toFixed(2)}, %Inc: ${revenueIncreasePct.toFixed(2)}`);

  // Render chart
  loadChartJs()
    .then(() => renderRevenueChart(revenueWithout, revenueWith))
    .catch(() => console.warn('[ROI][Chart] Skipping chart render due to load error.'));

  // Outputs: numbers only, **rounded** (no decimals)
  const decimals = 0;
  const monthlyEls = document.querySelectorAll('[data-el="additional-revenue-monthly"]');
  monthlyEls.forEach((el) => (el.textContent = formatUS(incrementalRevenue, decimals)));
  if (additionalRevAnnual) additionalRevAnnual.textContent = formatUS(incrementalRevenue * 12, decimals);
  if (revenueIncreasePercent) revenueIncreasePercent.textContent = formatUS(revenueIncreasePct, decimals);
  if (returnMultiple) returnMultiple.textContent = formatUS(roi, decimals);
}

// Debounced version for inputs
const debouncedRecalc = debounce(recalculateFromInputs, 400);

// Helper: safely extract domain from an email address
function extractDomain(email) {
  if (!email || typeof email !== 'string' || !email.includes('@')) return null;
  const domain = email.split('@')[1].toLowerCase().trim();
  console.log('[ROI] Extracted domain:', domain);
  return domain;
}

// Lazy-load Chart.js if it's not already present (avoids ordering issues)
function loadChartJs() {
  if (typeof window !== 'undefined' && window.Chart) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    console.log('[ROI][Chart] Loading Chart.js dynamically...');
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.5.0/chart.min.js';
    script.onload = () => {
      console.log('[ROI][Chart] Chart.js loaded.');
      resolve();
    };
    script.onerror = (e) => {
      console.warn('[ROI][Chart] Failed to load Chart.js', e);
      reject(e);
    };
    document.head.appendChild(script);
  });
}

// -------- Chart.js: Sales Growth Comparison --------
let roiRevenueChart = null;
function renderRevenueChart(currentRevenue, projectedRevenue) {
  console.log('[ROI][Chart] Rendering chart with values:', { currentRevenue, projectedRevenue });
  const canvas = document.getElementById('additional-revenue-monthly');
  if (!canvas || !canvas.getContext) {
    console.warn('[ROI][Chart] Canvas #additional-revenue-monthly not found or unsupported.');
    return;
  }
  // Chart.js presence is ensured by loadChartJs() before calling this function

  const ctx = canvas.getContext('2d');

  // Destroy previous chart instance if it exists (to avoid duplicates)
  if (roiRevenueChart) {
    try { roiRevenueChart.destroy(); } catch (e) { /* no-op */ }
    roiRevenueChart = null;
  }

  // Colors per spec
  const colorCurrent = '#E8E3E1';
  const colorProjected = '#FF9780';
  const colorCurrentHover = 'rgba(232, 227, 225, 0.8)'; // 80% opacity
  const colorProjectedHover = 'rgba(255, 151, 128, 0.8)'; // 80% opacity

  roiRevenueChart = new window.Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Current Sales', 'Projected with Gorgias'],
      datasets: [
        {
          data: [currentRevenue, projectedRevenue],
          backgroundColor: [colorCurrent, colorProjected],
          hoverBackgroundColor: [colorCurrentHover, colorProjectedHover],
          borderColor: '#00000010',
          borderWidth: 1,
          // Rounded top corners only; flat bottom corners
          borderRadius: {
            topLeft: 12, topRight: 12, bottomLeft: 0, bottomRight: 0
          },
          borderSkipped: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 600
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const val = ctx.parsed.y || 0;
              // Show $ and comma formatting in the tooltip for readability
              return `$${formatUS(val, 2)}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            font: { size: 14 }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: '#00000014'
          },
          ticks: {
            // Currency-style ticks to match the mock
            callback: (value) => `$${formatUS(value, 0)}`,
            font: { size: 12 },
            maxTicksLimit: 6
          }
        }
      }
    }
  });

  console.log('[ROI][Chart] Chart rendered.');
}

// Helper: ping API and fetch data for a specific domain
async function fetchROIdata(domain) {
  const endpoint = `https://marketing-ops-functions.up.railway.app/roi-calculator/${domain}`;
  console.log('[ROI] Fetching data from:', endpoint);

  try {
    const response = await fetch(endpoint, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('[ROI] API response received:', data);
    return data;
  } catch (err) {
    console.warn('[ROI] API fetch failed:', err);
    return null;
  }
}

// Helper: populate form fields with fetched or fallback values
function populateFormFields(data) {
  console.log('[ROI] Populating fields...');

  // 1. Populate API-driven values (if available)
  if (data) {
    // NOTE: number-type inputs can't contain commas; set plain numeric for them, formatted for text inputs
    if (monthlyTraffic && data.lastMonthVisits) {
      setUSValue(monthlyTraffic, Math.round(Number(data.lastMonthVisits)), 0);
      console.log('[ROI] monthlyTraffic set to:', monthlyTraffic.value);
    }
  }

  // 2. Populate benchmark-driven defaults
  if (avgChatContactRate) {
    avgChatContactRate.value = INDUSTRY_BENCHMARKS.chatRate;
    console.log('[ROI] avgChatContactRate benchmark set to:', INDUSTRY_BENCHMARKS.chatRate);
  }
  if (preSalesInquiries) {
    preSalesInquiries.value = INDUSTRY_BENCHMARKS.preSales;
    console.log('[ROI] preSalesInquiries benchmark set to:', INDUSTRY_BENCHMARKS.preSales);
  }
  if (baselineConversionRate) {
    baselineConversionRate.value = INDUSTRY_BENCHMARKS.baselineCVR;
    console.log('[ROI] baselineConversionRate benchmark set to:', INDUSTRY_BENCHMARKS.baselineCVR);
  }
  // Benchmarks are raw percentage numbers (no symbols) to keep inputs editable

  // --- Recalculate AOV from revenue and orders ---
  // Orders = Sessions × ChatRate × PreSalesRate × CVR
  // AOV = Revenue / Orders
  (function computeAOVFromInputs() {
    try {
      const sessionsForAOV = data && data.lastMonthVisits != null
        ? Number(data.lastMonthVisits)
        : (monthlyTraffic ? toNumberUS(monthlyTraffic.value) : 0);
      const chatPct = avgChatContactRate ? toNumberUS(avgChatContactRate.value) / 100 : 0;
      const prePct  = preSalesInquiries ? toNumberUS(preSalesInquiries.value) / 100 : 0;
      const cvrPct  = baselineConversionRate ? toNumberUS(baselineConversionRate.value) / 100 : 0;
      const ordersForAOV = sessionsForAOV * chatPct * prePct * cvrPct;
      const revenueForAOV = (data && data.estimatedSales != null)
        ? (Number(data.estimatedSales) / 100)   // cents → dollars
        : (Number(data && data.defaultRevenue) || 0); // dollars fallback
      const aovCalc = ordersForAOV > 0 ? (revenueForAOV / ordersForAOV) : 0;
      if (avgOrderValue) {
        setUSValue(avgOrderValue, aovCalc, 2);
        console.log(`[ROI] AOV recalculated as Revenue/Orders = ${aovCalc.toFixed(2)} (revenue: ${revenueForAOV.toFixed(2)}, orders: ${ordersForAOV.toFixed(2)})`);
      }
    } catch (e) {
      console.warn('[ROI] Failed to compute AOV from inputs:', e);
    }
  })();

  // --- New ROI Calculation Logic ---

  // Sanitize percent fields for commas before parsing
  if (avgChatContactRate && /,/.test(avgChatContactRate.value)) avgChatContactRate.value = avgChatContactRate.value.replace(/,/g, '');
  if (preSalesInquiries && /,/.test(preSalesInquiries.value)) preSalesInquiries.value = preSalesInquiries.value.replace(/,/g, '');
  if (baselineConversionRate && /,/.test(baselineConversionRate.value)) baselineConversionRate.value = baselineConversionRate.value.replace(/,/g, '');

  // Parse input values and convert percentages to decimals
  const sessions = monthlyTraffic ? toNumberUS(monthlyTraffic.value) : 0;
  const chatRate = avgChatContactRate ? toNumberUS(avgChatContactRate.value) / 100 : 0;
  const preSales = preSalesInquiries ? toNumberUS(preSalesInquiries.value) / 100 : 0;
  const cvr = baselineConversionRate ? toNumberUS(baselineConversionRate.value) / 100 : 0;
  const aov = avgOrderValue ? toNumberUS(avgOrderValue.value) : 0;

  console.log(`[ROI] Inputs - sessions: ${sessions}, chatRate: ${chatRate}, preSales: ${preSales}, cvr: ${cvr}, aov: ${aov}`);

  // Without Gorgias
  const ordersWithout = sessions * chatRate * preSales * cvr;
  const revenueWithout = ordersWithout * aov;
  console.log(`[ROI] Without Gorgias - orders: ${ordersWithout.toFixed(2)}, revenue: ${revenueWithout.toFixed(2)}`);

  // With Gorgias
  const chatRateWith = chatRate * 1.2;
  const cvrWith = cvr * 1.52;
  const aovWith = aov * 1.2;
  const ordersWith = sessions * chatRateWith * preSales * cvrWith;
  const revenueWith = ordersWith * aovWith;
  const incrementalRevenue = revenueWith - revenueWithout;
  const roi = (incrementalRevenue - 7360) / 7360;
  // Revenue increase percent (safe division)
  const revenueIncreasePct = revenueWithout > 0 ? (incrementalRevenue / revenueWithout) * 100 : 0;

  console.log(`[ROI] With Gorgias - orders: ${ordersWith.toFixed(2)}, revenue: ${revenueWith.toFixed(2)}`);
  console.log(`[ROI] Incremental Revenue: ${incrementalRevenue.toFixed(2)}, ROI: ${roi.toFixed(2)}`);

  // Render Sales Growth Comparison chart (ensure Chart.js is loaded)
  loadChartJs()
    .then(() => renderRevenueChart(revenueWithout, revenueWith))
    .catch(() => console.warn('[ROI][Chart] Skipping chart render due to load error.'));

  // Outputs: numbers only, formatted US style (no currency symbol / no suffix)
  if (additionalRevMonthly) {
    // Support multiple elements with data-el="additional-revenue-monthly"
    const monthlyEls = document.querySelectorAll('[data-el="additional-revenue-monthly"]');
    monthlyEls.forEach((el) => {
      el.textContent = formatUS(incrementalRevenue, 0);
    });
    console.log(`[ROI] Updated ${monthlyEls.length} additional-revenue-monthly elements.`);
  }
  if (additionalRevAnnual) {
    additionalRevAnnual.textContent = formatUS(incrementalRevenue * 12, 0);
    console.log(`[ROI] Updated additional-revenue-annual: ${additionalRevAnnual.textContent}`);
  }
  if (revenueIncreasePercent) {
    revenueIncreasePercent.textContent = formatUS(revenueIncreasePct, 0);
    console.log(`[ROI] Updated revenue-increase: ${revenueIncreasePercent.textContent}`);
  }
  if (returnMultiple) {
    returnMultiple.textContent = formatUS(roi, 0);
    console.log(`[ROI] Updated return-multiple: ${returnMultiple.textContent}`);
  }

  console.log('[ROI] Field population complete.');
}

// Listen for HubSpot form submission (email capture)
window.addEventListener('message', function (event) {
  if (
    event &&
    event.data &&
    event.data.type === 'hsFormCallback' &&
    event.data.eventName === 'onFormReady'
  ) {
    console.log('[ROI] HubSpot form ready. Listening for submission...');

    $('.hs-button').on('click', async function () {
      console.log('[ROI] Submit button clicked, capturing email...');
      const emailInput = document.querySelector('input[type="email"]');
      const emailValue = emailInput ? emailInput.value.trim() : '';

      if (!emailValue) {
        console.warn('[ROI] No email entered. Cannot extract domain.');
        return;
      }

      const domain = extractDomain(emailValue);
      if (!domain) {
        console.warn('[ROI] Invalid email format. Domain not found.');
        return;
      }

      // Fetch data from API and populate fields
      const data = await fetchROIdata(domain);
      populateFormFields(data);

      // Wait briefly to ensure DOM updates before revealing section
      console.log('[ROI] Field population complete, preparing to display ROI section...');
      setTimeout(() => {
        const roiSection = document.getElementById('roi-calculator');
        if (roiSection) {
          roiSection.style.display = 'block';
          roiSection.style.opacity = '1';
          roiSection.scrollIntoView({ behavior: 'smooth' });
          console.log('[ROI] ROI Calculator displayed and scrolled into view after population.');
        }

        // Attach debounced recalculation on user edits
        [monthlyTraffic, avgChatContactRate, preSalesInquiries, baselineConversionRate, avgOrderValue]
          .filter(Boolean)
          .forEach((el) => {
            el.addEventListener('input', debouncedRecalc);
            el.addEventListener('change', debouncedRecalc);
          });
        console.log('[ROI] Debounced recalculation listeners attached to inputs.');
      }, 10);
    });
  }
});