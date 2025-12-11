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
const intents = JSON.parse(document.querySelector('[data-el="intents"]')?.textContent || "0");

// chart 1 — Top Ticket Topics (Horizontal 100% Stacked Bar)
function createBreakdownChart() {
  console.log("[Breakdown] init");

  const container = document.querySelector('[data-chart="breakdown"]');
  if (!container) {
    console.log("[Breakdown] container NOT found");
    return;
  }
  console.log("[Breakdown] container found:", container);

  const canvas = document.createElement("canvas");
  canvas.id = "ticketBreakdownChart";
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  // Ensure intents exists
  console.log("[Breakdown] intents raw:", intents);
  if (!intents || typeof intents !== "object") {
    console.warn("[Breakdown] intents missing or invalid");
    return;
  }

  // Topic grouping
  const topicMapping = {
    presales: ["product", "stock", "discount"],
    shipping: ["shipping", "order"],
    returns: ["return", "exchange", "refund"],
    productIssues: ["feedback"],
    other: ["other", "subscription"]
  };

  const groupTotals = {
    presales: 0,
    shipping: 0,
    returns: 0,
    productIssues: 0,
    other: 0
  };

  // Sum values into topic groups
  for (const [key, val] of Object.entries(intents)) {
    for (const group in topicMapping) {
      if (topicMapping[group].includes(key)) {
        groupTotals[group] += val;
      }
    }
  }

  console.log("[Breakdown] groupTotals:", groupTotals);

  const total =
    groupTotals.presales +
    groupTotals.shipping +
    groupTotals.returns +
    groupTotals.productIssues +
    groupTotals.other;

  console.log("[Breakdown] total intents:", total);

  if (!total || total === 0) {
    console.warn("[Breakdown] total = 0, nothing to draw");
    return;
  }

  const percentages = {
    presales: (groupTotals.presales / total) * 100,
    shipping: (groupTotals.shipping / total) * 100,
    returns: (groupTotals.returns / total) * 100,
    productIssues: (groupTotals.productIssues / total) * 100,
    other: (groupTotals.other / total) * 100
  };

  console.log("[Breakdown] percentages:", percentages);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Top Ticket Topics"],
      datasets: [
        {
          label: "Pre‑Sales Questions",
          data: [percentages.presales],
          backgroundColor: "#6f0c86"
        },
        {
          label: "Shipping & Tracking",
          data: [percentages.shipping],
          backgroundColor: "#cb55ef"
        },
        {
          label: "Returns & Exchanges",
          data: [percentages.returns],
          backgroundColor: "#f5d4ff"
        },
        {
          label: "Product Issues",
          data: [percentages.productIssues],
          backgroundColor: "#faeaff"
        },
        {
          label: "Other",
          data: [percentages.other],
          backgroundColor: "#cb55ef"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y", // Restore original orientation
      plugins: {
        legend: { 
          display: true, 
          position: "bottom",
          labels: {
            padding: 20,
            boxWidth: 20,
            boxHeight: 12
          }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.raw.toFixed(1)}%`
          }
        }
      },
      layout: {
        padding: {
          bottom: 40
        }
      },
      scales: {
        x: {
          stacked: true,
          max: 100,
          ticks: { callback: (v) => `${v}%` },
          grid: { display: false }
        },
        y: {
          stacked: true,
          ticks: {
            minRotation: 90,
            maxRotation: 90,
            padding: 10
          },
          grid: { display: false }
        }
      }
    }
  });
}

createBreakdownChart();

/* 
// chart 2 — Resolution Time Comparison
function createResolutionChart() {
  const container = document.querySelector('[data-chart="resolution-time"]');
  if (!container) return;

  const canvas = document.createElement("canvas");
  canvas.id = "resolutionChart";
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  const resolutionTimeVal = Math.round(resolutionTime || 0);
  const resolutionTimeAIAgent = Math.round((resolutionTime || 0) * 0.236);

  const labels = ["Current Resolution Time", "With AI Agent"];
  const data = [resolutionTimeVal, resolutionTimeAIAgent];

  new window.Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          "#6f0c86",
          "#cb55ef"
        ],
        hoverBackgroundColor: [
          "rgba(111, 12, 134, 0.8)",
          "rgba(203, 85, 239, 0.8)"
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
      layout: {
        padding: {
          top: 16,
          right: 16,
          bottom: 16,
          left: 16
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `${Math.round(ctx.raw)} min`
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

// chart 3 — Shopping Assistant Revenue Opportunity
function createSAUpliftChart() {
  const container = document.querySelector('[data-chart="sa-uplift"]');
  if (!container) {
    console.log("[SA-Uplift] container NOT found");
    return;
  }
  console.log("[SA-Uplift] container found:", container);

  const canvas = document.createElement("canvas");
  canvas.id = "saUpliftChart";
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  // --- Estimate AOV from available data ---
  // contact_rate = contact_tickets / orders * 100
  // => orders ≈ contact_tickets / (contact_rate/100)
  // AOV approximation from resolution logic:
  // revenue_signal ≈ tickets * (product_question_rate/100) * baselineCVR * approxValue
  // We'll derive AOV as: estimated_revenue / orders
  // But since we do not know revenue, approximate using relative value of tickets:
  // Use a proportional signal-based AOV estimate:
  let estimatedAOV = 0;
  try {
    const contactRatePct = contactRate || 0;
    const contactT = contactTickets || 0;
    const orderCount = orders || 0;

    if (orderCount > 0) {
      estimatedAOV = Math.round( (contactT / Math.max(orderCount,1)) * 50 ) || 50;
    } else {
      estimatedAOV = 50;
    }
  } catch (e) {
    estimatedAOV = 50;
  }

  // --- Compute revenue opportunity ---
  const totalTickets = tickets || 0;
  const preSalesPct = productQuestionRate || 0;
  const preSalesTickets = totalTickets * (preSalesPct / 100);

  // Baseline CVR (from ROI tool)
  const baselineCVR = 0.03;

  const revenueNow = preSalesTickets * baselineCVR * estimatedAOV;

  // Apply ROI Tool uplift multipliers
  const upliftFactor = 1.2 * 1.52 * 1.2; // chatRate * CVR * AOV
  const revenueWithSA = revenueNow * upliftFactor;

  const labels = ["Revenue Today", "With Shopping Assistant"];
  const data = [Math.round(revenueNow), Math.round(revenueWithSA)];

  console.log("[SA-Uplift] AOV approx:", estimatedAOV);
  console.log("[SA-Uplift] revenue values:", data);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ["#f5d4ff", "#cb55ef"],
        hoverBackgroundColor: ["rgba(245,212,255,0.8)", "rgba(203,85,239,0.8)"],
        borderColor: "#00000010",
        borderWidth: 1,
        borderRadius: { topLeft: 12, topRight: 12, bottomLeft: 0, bottomRight: 0 },
        borderSkipped: false,
        categoryPercentage: 0.7,
        barPercentage: 0.8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 16,
          right: 16,
          bottom: 16,
          left: 16
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `$${Math.round(ctx.raw)}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: v => `$${Math.round(v)}` },
          grid: { color: "#00000010" }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

createSAUpliftChart();
*/


// chart 2 — Resolution Time Comparison
function createResolutionChart() {
  const container = document.querySelector('[data-chart="resolution-time"]');
  if (!container) return;

  const canvas = document.createElement("canvas");
  canvas.id = "resolutionChart";
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  const resolutionTimeVal = Math.round(resolutionTime || 0);
  const resolutionTimeAIAgent = Math.round((resolutionTime || 0) * 0.236);

  const labels = ["Current Resolution Time", "With AI Agent"];
  const data = [resolutionTimeVal, resolutionTimeAIAgent];

  const valueLabelPlugin = {
    id: "valueLabel",
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      const ds = chart.data.datasets[0];
      ctx.save();
      ctx.font = "bold 12px Inter";
      ctx.textAlign = "center";
      chart.getDatasetMeta(0).data.forEach((bar, i) => {
        const label = `${data[i]} min`;
        ctx.fillStyle = "#333";
        ctx.fillText(label, bar.x, bar.y - 8);
      });
      ctx.restore();
    }
  };

  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ["#f5d4ff", "#cb55ef"],
        hoverBackgroundColor: ["rgba(245,212,255,0.8)", "rgba(203,85,239,0.8)"],
        borderColor: "#00000010",
        borderWidth: 1,
        borderRadius: { topLeft: 12, topRight: 12, bottomLeft: 0, bottomRight: 0 },
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 16,
          right: 16,
          bottom: 16,
          left: 16
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: ctx => `${Math.round(ctx.raw)} min` }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 60,
          ticks: { callback: v => `${v} min` },
          grid: { color: "#00000010" }
        },
        x: { grid: { display: false } }
      }
    },
    plugins: [valueLabelPlugin]
  });
}

createResolutionChart();

// chart 3 — Shopping Assistant Revenue Opportunity
function createSAUpliftChart() {
  const container = document.querySelector('[data-chart="sa-uplift"]');
  if (!container) return;

  const canvas = document.createElement("canvas");
  canvas.id = "saUpliftChart";
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  // Estimate AOV
  let estimatedAOV = 50;
  try {
    const orderCount = orders || 0;
    const contactT = contactTickets || 0;
    if (orderCount > 0) {
      estimatedAOV = Math.round((contactT / orderCount) * 50) || 50;
    }
  } catch (e) {
    estimatedAOV = 50;
  }

  // Revenue computation
  const totalTickets = tickets || 0;
  const preSalesTickets = totalTickets * (productQuestionRate / 100);
  const baselineCVR = 0.03;
  const upliftFactor = 1.2 * 1.52 * 1.2;

  const revenueNow = Math.round(preSalesTickets * baselineCVR * estimatedAOV);
  const revenueWithSA = Math.round(revenueNow * upliftFactor);

  const labels = ["Revenue Today", "With Shopping Assistant"];
  const data = [revenueNow, revenueWithSA];

  const valueLabelPlugin = {
    id: "valueLabel",
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      const ds = chart.data.datasets[0];
      ctx.save();
      ctx.font = "bold 12px Inter";
      ctx.textAlign = "center";
      chart.getDatasetMeta(0).data.forEach((bar, i) => {
        const label = `$${data[i]}`;
        ctx.fillStyle = "#333";
        ctx.fillText(label, bar.x, bar.y - 8);
      });
      ctx.restore();
    }
  };

  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ["#f5d4ff", "#cb55ef"],
        hoverBackgroundColor: ["rgba(245,212,255,0.8)", "rgba(203,85,239,0.8)"],
        borderColor: "#00000010",
        borderWidth: 1,
        borderRadius: { topLeft: 12, topRight: 12, bottomLeft: 0, bottomRight: 0 },
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 16,
          right: 16,
          bottom: 16,
          left: 16
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: ctx => `$${Math.round(ctx.raw)}` }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: v => `$${v}` },
          grid: { color: "#00000010" }
        },
        x: { grid: { display: false } }
      }
    },
    plugins: [valueLabelPlugin]
  });
}

createSAUpliftChart();
