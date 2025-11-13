/**
 * Shopping Assistant ROI Tool
 * This tool helps in calculating the Return on Investment (ROI) for shopping campaigns.
 */

// Centralized input/output accessors
function getInputs() {
  return {
    monthlyTraffic: document.querySelector('[data-el="monthly-traffic"]'),
    avgChatContactRate: document.querySelector('[data-el="avg-chat-contact-rate"]'),
    preSalesInquiries: document.querySelector('[data-el="pre-sales-inquiries"]'),
    baselineConversionRate: document.querySelector('[data-el="baseline-conversion-rate"]'),
    avgOrderValue: document.querySelector('[data-el="average-order-value"]'),
  };
}
function getOutputs() {
  return {
    additionalRevMonthlyEls: document.querySelectorAll('[data-el="additional-revenue-monthly"]'),
    additionalRevAnnualEls: document.querySelectorAll('[data-el="additional-revenue-yearly"]'),
    revenueIncreasePercent: document.querySelector('[data-el="revenue-increase"]'),
    returnMultiple: document.querySelector('[data-el="return-multiple"]'),
  };
}

const blurOverlay = document.querySelector('[data-el="blur"]');

// -------- Prefill Logic After HubSpot Submission --------

// Industry benchmark constants
const industryBenchmarks = {
  chatRate: 2.0, // %
  preSales: 40.0, // %
  baselineCVR: 3.0 // %
};

// ~5M USD projected annual revenue increase target with current benchmarks & AOV=246
const dummyData = {
  lastMonthVisits: 5936543
};

// --- Number formatting helpers (US style) ---
// Use global formatNumberWithCommas if available (from all.js); otherwise fallback.
const fmtWithCommas = (n) => {
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
  const intFmt = fmtWithCommas(intPart);
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

// Helper: sanitize percent fields for commas before parsing
function sanitizePercentInputs(inputs) {
  ['avgChatContactRate', 'preSalesInquiries', 'baselineConversionRate'].forEach((key) => {
    if (inputs[key] && /,/.test(inputs[key].value)) {
      inputs[key].value = inputs[key].value.replace(/,/g, '');
    }
  });
}

// --- Email validation + inline error helpers ---
function showEmailError(msg) {
  const emailInput =
    document.querySelector('.hbspt-form form input[type="email"]') ||
    document.querySelector('input[type="email"]');
  if (!emailInput) return;
  const container = emailInput.closest('.hs_email') || emailInput.parentElement || emailInput;
  let hint = container.querySelector('.roi-email-error');
  if (!hint) {
    hint = document.createElement('div');
    hint.className = 'roi-email-error';
    hint.style.color = '#ff0f0f';
    hint.style.fontSize = '12px';
    hint.style.lineHeight = '1.2';
    hint.style.marginTop = '4px';
    container.appendChild(hint);
  }
  hint.textContent = msg;
}
function clearEmailError() {
  document.querySelectorAll('.roi-email-error').forEach((n) => n.remove());
}
function apiHasUsableData(data) {
  if (!data || typeof data !== 'object') return false;
  // treat any of these as a “usable” hit; expand as your endpoint evolves
  return !!(data.lastMonthVisits || data.estimatedSales || data.avgPrice);
}

function computeMetrics(inputs) {
  sanitizePercentInputs(inputs);
  const sessions = inputs.monthlyTraffic ? toNumberUS(inputs.monthlyTraffic.value) : 0;
  const chatRate = inputs.avgChatContactRate ? toNumberUS(inputs.avgChatContactRate.value) / 100 : 0;
  const preSales = inputs.preSalesInquiries ? toNumberUS(inputs.preSalesInquiries.value) / 100 : 0;
  const cvr = inputs.baselineConversionRate ? toNumberUS(inputs.baselineConversionRate.value) / 100 : 0;
  const aov = inputs.avgOrderValue ? toNumberUS(inputs.avgOrderValue.value) : 0;

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
  const costSA = sessions * chatRateWith * preSales * 0.8 * 1.15;
  const roi = costSA > 0 ? (incrementalRevenue - costSA) / costSA : 0;
  const revenueIncreasePct = revenueWithout > 0 ? (incrementalRevenue / revenueWithout) * 100 : 0;
  return {
    sessions, chatRate, preSales, cvr, aov,
    ordersWithout, revenueWithout, ordersWith, revenueWith,
    incrementalRevenue, costSA, roi, revenueIncreasePct
  };
}

function updateOutputs(metrics, outputs) {
  const decimals = 0;
  if (outputs.additionalRevMonthlyEls) {
    outputs.additionalRevMonthlyEls.forEach((el) => (el.textContent = formatUS(metrics.incrementalRevenue, decimals)));
  }
  if (outputs.additionalRevAnnualEls && outputs.additionalRevAnnualEls.length) {
    outputs.additionalRevAnnualEls.forEach((el) => {
      el.textContent = formatUS(metrics.incrementalRevenue * 12, decimals);
    });
  }
  if (outputs.revenueIncreasePercent) outputs.revenueIncreasePercent.textContent = formatUS(metrics.revenueIncreasePct, decimals);
  if (outputs.returnMultiple) outputs.returnMultiple.textContent = formatUS(metrics.roi, decimals);
}

function calculateAndRender() {
  const inputs = getInputs();
  const outputs = getOutputs();
  const metrics = computeMetrics(inputs);
  // Chart rendering
  loadChartJs()
    .then(() => {
      renderRevenueChart(metrics.revenueWithout, metrics.revenueWith);
      console.log('[ROI] Chart updated');
    })
    .catch(() => {/* skip chart error logs for performance */});
  updateOutputs(metrics, outputs);
  console.log('[ROI] Calculation complete');
}

const debouncedRecalc = debounce(calculateAndRender, 400);

// Helper: safely extract domain from an email address
function extractDomain(email) {
  if (!email || typeof email !== 'string' || !email.includes('@')) return null;
  const domain = email.split('@')[1].toLowerCase().trim();
  console.log('[ROI] Extracted domain:', domain);
  return domain;
}

// Lazy-load Chart.js if not present (UMD build, minimal logs)
function loadChartJs() {
  if (typeof window !== 'undefined' && window.Chart) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.5.0/chart.umd.min.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// -------- Chart.js: Sales Growth Comparison --------
let roiRevenueChart = null;
let roiChartResizeAttached = false;
let roiChartLastValues = { current: 0, projected: 0 };
function renderRevenueChart(currentRevenue, projectedRevenue) {
  const canvas = document.getElementById('additional-revenue-monthly');
  if (!canvas || !canvas.getContext) return;

  // Detect compact layout from container width (more reliable than viewport on some devices)
  const width = canvas.getBoundingClientRect().width || canvas.clientWidth || 0;
  const isCompact = width && width < 520; // treat narrow containers as mobile/compact

  // Size canvas
  canvas.style.width = '100%';
  canvas.style.height = isCompact ? '260px' : '360px';

  // Lightweight value label plugin (no external deps)
  const valueLabelPlugin = {
    id: 'valueLabel',
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      const ds = chart.data.datasets[0];
      if (!ds) return;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = (isCompact ? 11 : 12) + 'px Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
      chart.getDatasetMeta(0).data.forEach((bar, i) => {
        const v = Number(ds.data[i] || 0);
        const label = '$' + formatUS(v, 0);
        const x = bar.x;
        // Place label inside the bar, a bit below the rounded top
        const y = Math.min(bar.y + (isCompact ? 12 : 14), chart.chartArea.bottom - 10);
        // Add subtle shadow for contrast on both bar colors
        ctx.fillStyle = '#111';
        ctx.globalAlpha = 0.9;
        ctx.fillText(label, x, y);
        ctx.globalAlpha = 1;
      });
      ctx.restore();
    }
  };

  const ctx = canvas.getContext('2d');
  if (roiRevenueChart) {
    try { roiRevenueChart.destroy(); } catch (e) {}
    roiRevenueChart = null;
  }

  const labels = isCompact ? ['Current sales through chat', 'Projected with Gorgias'] : ['Current sales through chat', 'Projected with Gorgias'];

  roiRevenueChart = new window.Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: [currentRevenue, projectedRevenue],
        backgroundColor: ['#E8E3E1', '#FF9780'],
        hoverBackgroundColor: ['rgba(232,227,225,0.8)', 'rgba(255,151,128,0.8)'],
        borderColor: '#00000010',
        borderWidth: 1,
        borderRadius: { topLeft: 12, topRight: 12, bottomLeft: 0, bottomRight: 0 },
        borderSkipped: false,
        categoryPercentage: isCompact ? 0.9 : 0.7,
        barPercentage: isCompact ? 0.95 : 0.8,
      }]
    },
    plugins: [valueLabelPlugin],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 450 },
      layout: { padding: isCompact ? { top: 6, right: 8, bottom: 6, left: 8 } : { top: 18, right: 16, bottom: 16, left: 16 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `$${formatUS(ctx.parsed.y || 0, 0)}`,
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            display: true,
            font: { size: isCompact ? 10 : 14 },
            maxRotation: 0,
            minRotation: 0,
          }
        },
        y: {
          beginAtZero: true,
          display: true,
          grid: { display: true, color: '#00000012', lineWidth: 1 },
          ticks: {
            display: true,
            callback: (v) => `$${formatUS(v, 0)}`,
            font: { size: isCompact ? 10 : 12 },
            maxTicksLimit: isCompact ? 4 : 6,
          }
        }
      }
    }
  });

  // Save last values and attach a debounced resize handler once
  roiChartLastValues.current = currentRevenue;
  roiChartLastValues.projected = projectedRevenue;
  if (!roiChartResizeAttached) {
    roiChartResizeAttached = true;
    const rerender = debounce(() => {
      renderRevenueChart(roiChartLastValues.current, roiChartLastValues.projected);
    }, 200);
    window.addEventListener('resize', rerender);
  }
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

function populateFormFields(data) {
  const { monthlyTraffic, avgChatContactRate, preSalesInquiries, baselineConversionRate, avgOrderValue } = getInputs();
  // 1. Populate API-driven values (if available)
  if (data && monthlyTraffic && data.lastMonthVisits) {
    setUSValue(monthlyTraffic, Math.round(Number(data.lastMonthVisits)), 0);
  }
  // 2. Populate benchmark-driven defaults
  if (avgChatContactRate) avgChatContactRate.value = industryBenchmarks.chatRate;
  if (preSalesInquiries) preSalesInquiries.value = industryBenchmarks.preSales;
  if (baselineConversionRate) baselineConversionRate.value = industryBenchmarks.baselineCVR;

  // --- Recalculate AOV from revenue and orders ---
  (function computeAOVFromInputs() {
    try {
      if (data === dummyData) return;
      const sessionsForAOV = data && data.lastMonthVisits != null
        ? Number(data.lastMonthVisits)
        : (monthlyTraffic ? toNumberUS(monthlyTraffic.value) : 0);
      const chatPct = avgChatContactRate ? toNumberUS(avgChatContactRate.value) / 100 : 0;
      const prePct  = preSalesInquiries ? toNumberUS(preSalesInquiries.value) / 100 : 0;
      const cvrPct  = baselineConversionRate ? toNumberUS(baselineConversionRate.value) / 100 : 0;
      const ordersForAOV = sessionsForAOV * chatPct * prePct * cvrPct;
      const revenueForAOV = (data && data.estimatedSales != null)
        ? (Number(data.estimatedSales) / 100)
        : (Number(data && data.defaultRevenue) || 0);
      const aovCalc = ordersForAOV > 0 ? (revenueForAOV / ordersForAOV) : 0;
      if (avgOrderValue) setUSValue(avgOrderValue, aovCalc, 2);
    } catch (e) {}
  })();
  calculateAndRender();
  console.log('[ROI] HubSpot data populated');
}

// --- Prefill and listeners (single pipeline, DRY, minimal logs) ---
let listenersAttached = false;
function attachListenersOnce() {
  if (listenersAttached) return;
  const { monthlyTraffic, avgChatContactRate, preSalesInquiries, baselineConversionRate, avgOrderValue } = getInputs();
  [monthlyTraffic, avgChatContactRate, preSalesInquiries, baselineConversionRate, avgOrderValue]
    .filter(Boolean)
    .forEach((el) => {
      el.addEventListener('input', debouncedRecalc);
      el.addEventListener('change', debouncedRecalc);
    });
  listenersAttached = true;
}

// Prefill dummy data and attach listeners after DOM ready
(function initROIPrefill() {
  const waitForInputs = setInterval(() => {
    const { monthlyTraffic, avgChatContactRate, preSalesInquiries, baselineConversionRate, avgOrderValue } = getInputs();
    if (monthlyTraffic && avgChatContactRate && preSalesInquiries && baselineConversionRate && avgOrderValue) {
      clearInterval(waitForInputs);
      setUSValue(monthlyTraffic, dummyData.lastMonthVisits, 0);
      setUSValue(avgChatContactRate, industryBenchmarks.chatRate, 0);
      setUSValue(preSalesInquiries, industryBenchmarks.preSales, 0);
      setUSValue(baselineConversionRate, industryBenchmarks.baselineCVR, 0);
      setUSValue(avgOrderValue, 246, 0);
      populateFormFields(dummyData);
      attachListenersOnce();
      console.log('[ROI] Prefill ready');
    }
  }, 300);
})();

// HubSpot listener (single pipeline)
window.addEventListener('message', function (event) {
  if (
    event &&
    event.data &&
    event.data.type === 'hsFormCallback' &&
    event.data.eventName === 'onFormReady'
  ) {
    $('.hs-button').off('click.roi').on('click.roi', async function (e) {
  clearEmailError();

  const emailInput = document.querySelector('input[type="email"]');
  const emailValue = emailInput ? emailInput.value.trim() : '';
  if (!emailValue) return; // let HS required validation handle empty

  const domain = extractDomain(emailValue);
  if (!domain) {
    e.preventDefault();
    showEmailError('Please enter a valid work email (company domain).');
    return;
  }

  // Pre-submit validation against API
  const data = await fetchROIdata(domain);
  if (!apiHasUsableData(data)) {
    e.preventDefault();
    showEmailError("We couldn’t recognize this domain. Please use your company email.");
    return;
  }

  // Valid → proceed; also populate UI pre-emptively
  populateFormFields(data);
  setTimeout(() => {
    const roiSection = document.getElementById('roi-calculator');
    if (roiSection) {
      roiSection.style.display = 'block';
      roiSection.style.opacity = '1';
      roiSection.scrollIntoView({ behavior: 'smooth' });
      if (blurOverlay) blurOverlay.style.display = 'none';
    }
    attachListenersOnce();
  }, 10);
});

    // --- Auto-prefill & auto-submit from URL email param (runs once) ---
(async function autoSubmitFromQuery() {
  try {
    if (sessionStorage.getItem('roiAutoSubmitted') === '1') return;

    const params = new URLSearchParams(window.location.search || '');
    const emailParam =
      params.get('email') ||
      params.get('e') ||
      params.get('work_email') ||
      '';

    if (!emailParam) return;

    const email = String(emailParam).trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!validEmail) return;

    // Find HubSpot email input
    const emailInput =
      document.querySelector('.hbspt-form form input[type="email"]') ||
      document.querySelector('.hbspt-form form input[name="email"]') ||
      document.querySelector('input[type="email"]');

    if (!emailInput) return;

    // Prefill & notify HubSpot
    emailInput.value = email;
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    emailInput.dispatchEvent(new Event('change', { bubbles: true }));

    // Validate before submitting
    const domain = extractDomain(email);
    if (!domain) {
      showEmailError('Please enter a valid work email (company domain).');
      return;
    }
    const apiData = await fetchROIdata(domain);
    if (!apiHasUsableData(apiData)) {
      showEmailError("We couldn’t recognize this domain. Please use your company email.");
      return; // do not submit
    }

    // Populate now so UI stays consistent after HS submit
    populateFormFields(apiData);

    // Submit via HS button so handlers/validation run
    const formEl = emailInput.closest('form');
    const submitBtn = formEl ? formEl.querySelector('.hs-button') : null;
    if (submitBtn) {
      submitBtn.click();
    } else if (formEl) {
      formEl.requestSubmit ? formEl.requestSubmit() : formEl.submit();
    }

    sessionStorage.setItem('roiAutoSubmitted', '1');
    console.log('[ROI] Auto-submitted HubSpot form from URL email param:', email);
  } catch (e) {
    console.warn('[ROI] Auto-submit from URL failed:', e);
  }
})();
  }
});