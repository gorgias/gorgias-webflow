/**
 * Shopping Assistant ROI Tool
 * This tool helps in calculating the Return on Investment (ROI) for shopping campaigns.
 */

// Get the input fields from the DOM by data-attribute
let monthlyTraffic = document.querySelector('[data-el="monthly-traffic"]');
let avgChatContactRate = document.querySelector('[data-el="avg-chat-contact-rate"]');
let preSalesInquiries = document.querySelector('[data-el="pre-sales-inquiries"]');
let baselineConversionRate = document.querySelector('[data-el="baseline-conversion-rate"]');
let upliftConversionRate = document.querySelector('[data-el="uplift-in-conversion-rate"]');
let avgOrderValue = document.querySelector('[data-el="average-order-value"]');


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
      // Scroll to the ROI calculator section
      const roiSection = document.getElementById('roi-calculator');
      //set roiSection to display block
      roiSection.style.display = 'block';
      // Scroll into view with a 100ms delay to allow for any layout shifts
      setTimeout(() => {
        roiSection.scrollIntoView({ behavior: 'smooth' });
        console.log('Scrolled to ROI Calculator section (HS onFormReady)');
      }, 100);

    });
  }
});

// Optional (if present in the DOM):
// [data-el="avg-chat-contact-rate-gorgias"]   -> chat rate with Gorgias (if omitted, we'll assume +15% over default)
// [data-el="shopping-assistant-cost"]         -> cost of Shopping Assistant (defaults to 7360)
// Outputs (text elements):
// [data-el="out-default-revenue"], [data-el="out-gorgias-revenue"], [data-el="out-incremental-revenue"], [data-el="out-roi"]

// Check we found all the elements and console log "Element not found" if any are missing and "Elements found" if all are present
if (!monthlyTraffic || !avgChatContactRate || !preSalesInquiries || !baselineConversionRate || !upliftConversionRate || !avgOrderValue) {
    console.log("Element not found");
} else {
    console.log("Elements found");
}

// Function to calculate ROI
function calculateROI(lastMonthVisits, chatRateDefault, chatRateGorgias, preSalesRate, baselineCVR, upliftCVR, estimatedSales, costShoppingAssistant) {
  const defaultTotalOrders = Math.round(lastMonthVisits * chatRateDefault * preSalesRate * baselineCVR);
  const gorgiasTotalOrders = Math.round(lastMonthVisits * chatRateGorgias * preSalesRate * upliftCVR);

  const defaultRevenue = Number((estimatedSales / 100).toFixed(2));
  const averageOrderValue = Number((defaultRevenue / defaultTotalOrders).toFixed(2));
  const gorgiasRevenue = gorgiasTotalOrders * averageOrderValue;
  const incrementalRevenue = Number((gorgiasRevenue - defaultRevenue).toFixed(2));
  const roi = Number(((incrementalRevenue - costShoppingAssistant) / costShoppingAssistant * 100).toFixed(2));

  return {
    defaultRevenue,
    gorgiasRevenue,
    incrementalRevenue,
    roi: `${roi}%`
  };
}

// -------- Static Prefill + Wiring (temporary until email flow is ready) --------

// Optional extra inputs (if present in DOM)
const chatRateGorgiasInput = document.querySelector('[data-el="avg-chat-contact-rate-gorgias"]');
const assistantCostInput = document.querySelector('[data-el="shopping-assistant-cost"]');

// Outputs (if present)
const outDefaultRevenue = document.querySelector('[data-el="out-default-revenue"]');
const outGorgiasRevenue = document.querySelector('[data-el="out-gorgias-revenue"]');
const outIncrementalRevenue = document.querySelector('[data-el="out-incremental-revenue"]');
const outROI = document.querySelector('[data-el="out-roi"]');

// Card container (for compact UI like the screenshot)
const roiCard = document.querySelector('[data-el="roi-card"]');

// --- API config & status ---
const API_URL = 'https://5f45c6d118f2.ngrok-free.app/roi-calculator/gymshark.com';
const apiStatusEl = document.querySelector('[data-el="api-status"]'); // optional badge

async function pingEndpoint(url, { timeoutMs = 3000 } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort('timeout'), timeoutMs);
  const start = performance.now();
  try {
    const res = await fetch(url, { method: 'GET', cache: 'no-store', signal: ctrl.signal, keepalive: true, mode: 'cors' });
    const ms = Math.round(performance.now() - start);
    if (apiStatusEl) apiStatusEl.textContent = res.ok ? `API online (${ms}ms)` : `API error (${res.status})`;
    console.info('[ROI] ping:', res.ok ? 'online' : `error ${res.status}`, `${ms}ms`);
    return res.ok;
  } catch (e) {
    const ms = Math.round(performance.now() - start);
    if (apiStatusEl) apiStatusEl.textContent = 'API offline';
    console.warn('[ROI] ping: offline', `${ms}ms`, e?.message || e);
    return false;
  } finally {
    clearTimeout(t);
  }
}

// Helpers
function toNumber(el, fallback = 0) {
  if (!el) return fallback;
  const v = String(el.value || '').trim();
  if (v === '') return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

// Accept both decimals (0.23) and percents (23)
function toRate(el, fallback = 0) {
  const n = toNumber(el, fallback);
  if (!Number.isFinite(n)) return fallback;
  return n > 1 ? n / 100 : n;
}

function fmtCurrency(amount) {
  try {
    return new Intl.NumberFormat(navigator.language || 'en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(amount);
  } catch (e) {
    return `$${Number(amount).toFixed(2)}`;
  }
}

function fmtCurrency0(amount) {
  try {
    return new Intl.NumberFormat(navigator.language || 'en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(amount);
  } catch (e) {
    return `$${Math.round(Number(amount) || 0).toString()}`;
  }
}

// Core recalc that bridges UI inputs -> calculateROI
function computeAndRender() {
  const lastMonthVisits = toNumber(monthlyTraffic, 0);

  const chatRateDefault = toRate(avgChatContactRate, 0.2);

  // If no dedicated Gorgias chat rate input exists, assume +15% uplift over default (0.2 -> 0.23)
  const chatRateGorgias = chatRateGorgiasInput
    ? toRate(chatRateGorgiasInput, chatRateDefault * 1.15)
    : chatRateDefault * 1.15;

  const preSalesRate = toRate(preSalesInquiries, 0.4);
  const baselineCVR = toRate(baselineConversionRate, 0.03);
  const upliftCVR = toRate(upliftConversionRate, 0.0486);

  const aov = toNumber(avgOrderValue, 120);

  // We need estimatedSales (in cents) for calculateROI.
  // Derive it from default orders * AOV so UI can work without a separate "estimatedSales" field.
  const defaultTotalOrders = Math.round(lastMonthVisits * chatRateDefault * preSalesRate * baselineCVR);
  const derivedDefaultRevenue = defaultTotalOrders * aov; // dollars
  const estimatedSalesCents = Math.round(derivedDefaultRevenue * 100);

  const costShoppingAssistant = assistantCostInput ? toNumber(assistantCostInput, 7360) : 7360;

  const result = calculateROI(
    lastMonthVisits,
    chatRateDefault,
    chatRateGorgias,
    preSalesRate,
    baselineCVR,
    upliftCVR,
    estimatedSalesCents,
    costShoppingAssistant
  );

  // Render if output nodes are present
  if (outDefaultRevenue) outDefaultRevenue.textContent = fmtCurrency(result.defaultRevenue);
  if (outGorgiasRevenue) outGorgiasRevenue.textContent = fmtCurrency(result.gorgiasRevenue);
  if (outIncrementalRevenue) outIncrementalRevenue.textContent = fmtCurrency(result.incrementalRevenue);
  if (outROI) outROI.textContent = result.roi;

  // Render compact card (matches screenshot)
  if (roiCard) {
    const incMonthlySales = Math.round(result.incrementalRevenue);
    // Styling expected to be provided by the page stylesheet to match the card layout (two columns, rounded border, etc.)
    roiCard.innerHTML = `
      <div class="roi-card">
        <div class="roi-card__left">
          <div class="roi-card__label">Incremental monthly sales</div>
          <div class="roi-card__value">${fmtCurrency0(incMonthlySales)}</div>
          <div class="roi-card__caption">Based on your current metrics and industry benchmarks</div>
        </div>
        <div class="roi-card__right">
          <div class="roi-card__formula-title">Formula</div>
          <ul class="roi-card__formula">
            <li>Traffic</li>
            <li>Chat Contact Rate</li>
            <li>Pre‑Sales Inquiries</li>
            <li>Baseline Conversion</li>
            <li>Conversion Uplift</li>
            <li>AOV</li>
          </ul>
        </div>
      </div>
    `;
  }

  // Also log for debugging
  console.debug('[ROI]', result);
}

// Debounce helper for input listeners
function debounce(fn, wait = 200) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(null, args), wait);
  };
}

const debouncedRecalc = debounce(computeAndRender, 150);

// Wire events for live recalc
[
  monthlyTraffic,
  avgChatContactRate,
  chatRateGorgiasInput,
  preSalesInquiries,
  baselineConversionRate,
  upliftConversionRate,
  avgOrderValue,
  assistantCostInput
].forEach((el) => {
  if (el) {
    el.addEventListener('input', debouncedRecalc);
    el.addEventListener('change', debouncedRecalc);
  }
});

// Static prefill using the provided API example (Gymshark) + ping on page load
async function prefillFromStaticAPI() {
  try {
    // Ping first (non-blocking)
    pingEndpoint(API_URL);

    const response = await fetch(API_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    // Map helpers so the inputs match your UI (percent fields show numbers like 15, not 0.15)
    const toPercentDisplay = (n) => {
      const v = Number(n);
      if (!Number.isFinite(v)) return '';
      return v > 1 ? String(v) : (v * 100).toFixed(2).replace(/\.00$/, '');
    };
    const toInt = (n) => {
      const v = Number(n);
      return Number.isFinite(v) ? Math.round(v) : '';
    };

    // Prefill matching your fields
    if (monthlyTraffic && data.lastMonthVisits != null) {
      monthlyTraffic.value = toInt(data.lastMonthVisits);
    }
    if (avgChatContactRate && data.chatRateDefault != null) {
      avgChatContactRate.value = toPercentDisplay(data.chatRateDefault);
    }
    if (chatRateGorgiasInput && data.chatRateGorgias != null) {
      chatRateGorgiasInput.value = toPercentDisplay(data.chatRateGorgias);
    }
    if (preSalesInquiries && data.preSalesRate != null) {
      preSalesInquiries.value = toPercentDisplay(data.preSalesRate);
    }
    if (baselineConversionRate && data.baselineCVR != null) {
      baselineConversionRate.value = toPercentDisplay(data.baselineCVR);
    }
    if (upliftConversionRate && data.upliftCVR != null) {
      upliftConversionRate.value = toPercentDisplay(data.upliftCVR);
    }
    if (avgOrderValue && data.averageOrderValue != null) {
      avgOrderValue.value = Number(data.averageOrderValue);
    }
  } catch (err) {
    console.warn('Prefill API failed, continuing with defaults:', err);
  } finally {
    computeAndRender();
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', prefillFromStaticAPI);
} else {
  prefillFromStaticAPI();
}