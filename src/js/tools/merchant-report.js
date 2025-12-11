function updateContactRate() {
  const el = document.querySelector("[data-contact-rate]");
  if (el) {
    el.textContent = el.dataset.contactRate;
    return true;
  }
  return false;
}

// Try immediately
if (!updateContactRate()) {
  // If not found, try again after page load
  window.addEventListener("load", () => {
    if (!updateContactRate()) {
      // If still not found, keep trying until Candu loads it
      const observer = new MutationObserver(() => {
        if (updateContactRate()) observer.disconnect();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  });
}

// Fetch merchant data

const contactRate = parseFloat(document.querySelector('[data-el="contact_rate"]')?.textContent || 0);
const orders = parseFloat(document.querySelector('[data-el="orders"]')?.textContent || 0);
const productQuestionRate = parseFloat(document.querySelector('[data-el="product_question_rate"]')?.textContent || 0);
const returnRate = parseFloat(document.querySelector('[data-el="return_rate"]')?.textContent || 0);
const returnTickets = parseFloat(document.querySelector('[data-el="return_tickets"]')?.textContent || 0);
const shippingRates = parseFloat(document.querySelector('[data-el="shipping-rates"]')?.textContent || 0);
const tickets = parseFloat(document.querySelector('[data-el="tickets"]')?.textContent || 0);
const ticketsBilled = parseFloat(document.querySelector('[data-el="tickets_billed"]')?.textContent || 0);
const contactTickets = parseFloat(document.querySelector('[data-el="contact_tickets"]')?.textContent || 0);
const resolutionTime = parseFloat(document.querySelector('[data-el="resolution_time"]')?.textContent || 0);
const intents = parseFloat(document.querySelector('[data-el="intents"]')?.textContent || 0);

// chart 1

// Breakdown chart
function createBreakdownChart() {
  const container = document.querySelector('[data-chart="breakdown"]');
  if (!container) return;

  const canvas = document.createElement("canvas");
  canvas.id = "ticketBreakdownChart";
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  const productQuestionsVal = productQuestionRate || 0;
  const shippingRateVal = shippingRates || 0;
  const returnRateVal = returnTickets || 0;
  const ordersVal = orders || 0;

  const otherRateVal = Math.max(
    0,
    100 - (productQuestionsVal + shippingRateVal + returnRateVal)
  );

  const labels = [
    "Pre-purchase questions",
    "Shipping / WISMOs",
    "Returns & exchanges",
    "Other"
  ];

  const data = [
    productQuestionsVal,
    shippingRateVal,
    returnRateVal,
    otherRateVal
  ];

  new window.Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          "#289e43", // Pre‑purchase questions
          "#4e88fb", // Shipping / WISMOs
          "#ff9780", // Returns & exchanges
          "#cb55ef"  // Other
        ],
        hoverBackgroundColor: [
          "rgba(40,158,67,0.8)",
          "rgba(78,136,251,0.8)",
          "rgba(255,151,128,0.8)",
          "rgba(203,85,239,0.8)"
        ],
        borderColor: "#00000010",
        borderWidth: 1,
        borderRadius: {
          topLeft: 12,
          topRight: 12,
          bottomLeft: 0,
          bottomRight: 0
        },
        borderSkipped: false,
        categoryPercentage: 0.7,
        barPercentage: 0.8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.raw}%`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: v => `${v}%` },
          grid: { color: "#00000010" }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

createBreakdownChart();

// chart 2 — Resolution Time Comparison
function createResolutionChart() {
  const container = document.querySelector('[data-chart="resolution-time"]');
  if (!container) return;

  const canvas = document.createElement("canvas");
  canvas.id = "resolutionChart";
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  const resolutionTimeVal = resolutionTime || 0;
  const resolutionTimeAIAgent = resolutionTimeVal * 0.236;

  const labels = ["Current Resolution Time", "With AI Agent"];
  const data = [resolutionTimeVal, resolutionTimeAIAgent];

  new window.Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          "#4e88fb", // current
          "#289e43"  // AI Agent improvement
        ],
        hoverBackgroundColor: [
          "rgba(78,136,251,0.8)",
          "rgba(40,158,67,0.8)"
        ],
        borderColor: "#00000010",
        borderWidth: 1,
        borderRadius: {
          topLeft: 12,
          topRight: 12,
          bottomLeft: 0,
          bottomRight: 0
        },
        borderSkipped: false,
        categoryPercentage: 0.7,
        barPercentage: 0.8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.raw} min`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: v => `${v} min` },
          grid: { color: "#00000010" }
        },
        x: { grid: { display: false } }
      }
    }
  });
}

createResolutionChart();
