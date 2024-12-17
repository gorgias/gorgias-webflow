/****************************
 *
 * Global Functions
 *
 ****************************/

// Shared Color Palette
const colorPalette = ["#ff6d62", "#FFDED6", "#FFCDC2", "#FFBCAD", "#FFAC99", "#FF9780", "#FF8A70", "#FF6D62", "#72312C", "#130100"];

/**
 * Function to parse JSON and handle missing brackets
 */
function parseJSONWithCorrection(rawContent) {
  let correctedContent = rawContent.trim();
  try {
    return JSON.parse(correctedContent); // Attempt parsing directly
  } catch (error) {
    console.warn("JSON parsing failed. Attempting to correct...");
    if (!correctedContent.startsWith("[") && !correctedContent.endsWith("]")) {
      correctedContent = `[${correctedContent}]`; // Add missing brackets
    }
    return JSON.parse(correctedContent); // Parse corrected content
  }
}

/**
 * Function to create a Chart.js chart
 */
function createChart(chartType, canvasId, labels, datasets, options = {}) {
  const ctx = document.getElementById(canvasId).getContext("2d");
  new Chart(ctx, {
    type: chartType,
    data: {
      labels: labels,
      datasets: datasets,
    },
    options: options,
  });
}

/**
 * Capitalize the first letter of each label
 */
function capitalizeLabels(labels) {
  return labels.map(
    (label) =>
      label
        .toLowerCase() // Convert everything to lowercase
        .replace(/(?:^|\s)\S/g, (match) => match.toUpperCase()) // Capitalize the first letter of each word
  );
}

/**
 * Observe an element and initialize a chart when it becomes visible
 */
function observeChart(canvasId, initializeChartCallback) {
  const target = document.getElementById(canvasId);
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          initializeChartCallback(); // Initialize the chart
          observer.unobserve(entry.target); // Stop observing once chart is initialized
        }
      });
    },
    {
      root: null, // Use the viewport
      threshold: 0.5, // Trigger when the chart is almost fully visible
    }
  );
  observer.observe(target);
}

// // Hide insights section if empty
// // Select the section with id="insights"
// const insightSection = document.getElementById('insights');

// // Check if any element inside the section has the class .w-dyn-bind-empty
// if (insightSection.querySelector('.w-dyn-bind-empty')) {
//     // Hide the section
//     insightSection.style.display = 'none';
//     console.log('Insight section hidden due to .w-dyn-bind-empty');
// }

// Script to replace the text of elements with the `data-brand` attribute
document.querySelectorAll('[data-brand]').forEach(element => {
  const brandText = element.getAttribute('data-brand');
  if (brandText) {
    element.textContent = brandText;
  }
});

// Find the element with the attribute `data-days`
const daysElement = document.querySelector('[data-days]');

// Check if the element exists and get its value
if (daysElement) {
  const daysValue = parseInt(daysElement.getAttribute('data-days'), 10); // Convert to a number

  // If the value is exactly 1, find the element with `data-el="days"` and remove it from the DOM
  if (daysValue === 1) {
    const targetElement = document.querySelector('[data-el="days"]');
    if (targetElement) {
      targetElement.remove(); // Remove the element
    }
  }
}

// // Find the element with the attribute data-el="negative-reviews"
// const negativeReviewsElement = document.querySelector('[data-el="negative-reviews"]');

// if (negativeReviewsElement) {
//   // Get the text content of the element
//   let textContent = negativeReviewsElement.textContent.trim();

//   // Convert the text to a number and remove decimals
//   let numericValue = Math.floor(Number(textContent));

//   // Replace the existing text with the updated value
//   if (!isNaN(numericValue)) {
//     negativeReviewsElement.textContent = numericValue;
//   } else {
//     console.error("The text content could not be converted to a valid number.");
//   }
// } else {
//   console.error("Element with data-el=\"negative-reviews\" not found.");
// }

/****************************
 *
 * Charts and dynamic text
 *
 ****************************/

// Chart: Sentiment Aggregated Pie Chart
observeChart("sentiment-aggregated-breakdown", () => {
  const element = document.querySelector('[data-el="sentiment-breakdown"]');
  const rawContent = element.textContent.trim();
  let parsedData;

  try {
    parsedData = parseJSONWithCorrection(rawContent);
  } catch (error) {
    console.error("Unable to parse sentiment breakdown data:", error);
  }

  if (parsedData) {
    // Extract labels and data values
    const rawLabels = parsedData.map((item) => item.key);
    const labels = capitalizeLabels(rawLabels); // Capitalize labels
    const dataValues = parsedData.map((item) => item.value);

    // Calculate total and percentages
    const total = dataValues.reduce((sum, value) => sum + value, 0);
    const percentages = dataValues.map((value) =>
      total > 0 ? ((value / total) * 100).toFixed(1) : 0
    ); // Ensure no NaN

    // Assign percentage values by sentiment type
    const sentimentMap = {};
    rawLabels.forEach((key, index) => {
      sentimentMap[key.toLowerCase()] = parseFloat(percentages[index]);
    });

    const positivePercentage = sentimentMap["positive"] || 0;
    const negativePercentage = sentimentMap["negative"] || 0;
    const neutralPercentage = sentimentMap["neutral"] || 0;

    // Update the text of elements with the calculated percentages
    const positiveElement = document.querySelector('[data-el="percent-pos"]');
    if (positiveElement) {
      positiveElement.textContent = `${positivePercentage}`;
    }

    const neutralElement = document.querySelector('[data-el="percent-neu"]');
    if (neutralElement) {
      neutralElement.textContent = `${neutralPercentage}`;
    }

    const negativeElement = document.querySelector('[data-el="percent-neg"]');
    if (negativeElement) {
      negativeElement.textContent = `${negativePercentage}`;
    }

    // Dataset with percentages for chart
    const datasets = [
      {
        data: dataValues,
        backgroundColor: [
          "#FF9780", // Positive
          "#72312C", // Negative
          "#FFCDC2", // Neutral
        ],
      },
    ];

    // Chart options with percentage labels
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: { font: { family: "Inter Tight" } },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || "";
              const value = context.raw || 0;
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return `${label}: ${value} (${percentage}%)`;
            },
          },
          titleFont: { family: "Inter Tight", size: 14 },
          bodyFont: { family: "Inter Tight", size: 14 },
        },
      },
    };

    // Create the chart instance
    const chartInstance = new Chart(
      document.getElementById("sentiment-aggregated-breakdown").getContext("2d"),
      {
        type: "doughnut",
        data: { labels, datasets },
        options,
      }
    );

    // Display all tooltips by default
    chartInstance.options.plugins.tooltip.enabled = true; // Ensure tooltips are enabled
    const tooltipItems = datasets[0].data.map((_, index) => ({
      datasetIndex: 0,
      index,
    }));
    chartInstance.update();

    chartInstance.tooltip.setActiveElements(tooltipItems, {
      x: 0,
      y: 0,
    });
    chartInstance.tooltip.update();
  }
});


// Recommendations Mapping
const recommendations = {
  "Product Quality": "Use ticket trend analysis to identify recurring issues and notify your product or manufacturing teams. Reduces complaint volume by 20–30%, improving satisfaction and lowering resource strain.",
  "Customer Service": "Equip human and AI agents with customer profiles pulling data from each tool to resolve tickets faster, reducing support costs by 30–40% and improving loyalty.",
  "Delivery Shipping": "Set up real-time order tracking with proactive updates, preventing 57% of customers from abandoning the brand post-purchase.",
  "Returns & Refunds": "Automate self-serve return processes with instant refunds or exchanges, increasing repeat purchases by 60% through a trusted process.",
  "Pricing & Value": "Staff AI or humans on live support to personalize recommendations to improve perceived value and drive upsells, or offer price-matching via discounts.",
  "Website user experience": "Integrate AI-driven search and product matching, reducing customer frustration and increasing conversions by up to 42%.",
  "Order Accuracy": "Connect your support tools and AI-powered agents with your order management system to quickly correct any inaccuracies in orders.",
  "Product Variety": "Create systems to turn out-of-stock complaints and product requests into newsletter signups for back-in-stock notifications and retargeting campaigns.",
  "Company Reputation": "Integrate your support system with reviews platform to address negative feedback promptly.",
  "Communication & Information": "Build your self-service and AI support offerings to make information accessible across platforms with a 0-minute wait time.",
  "Packaging": "Use ticket trend analysis to gather feedback about packaging quality and share it with your operations team to optimize for sustainability or better product protection.",
  "Trust & Security": "Share in-depth knowledge on your website and internally to promote certifications, safe product usage, and clean materials.",
  "Payment Options": "Offer live chat on checkout pages for quick resolution of payment-related issues like failed transactions, refunds, or disputes for a seamless checkout experience.",
  "Post-Purchase Support": "Use ticket trend analysis to understand the most common questions, and include answers in packaging or automated post-purchase email flows to reduce misuse-related returns.",
  "Loyalty Program": "Integrate your support system and loyalty system to prioritize members and provide VIP treatment that boosts customer LTV.",
  "Ordering Accuracy": "Use an AI support agent that can instantly make changes to orders before they leave your shipping address, to reduce customer frustration and costly returns or re-shipping.",
  "Warranty Support": "Offer a contact form that collects all the necessary information from requesters upfront. Use that information as variables so an AI can determine who is eligible and who is not.",
};

observeChart("sub-categories", () => {
  const element = document.querySelector('[data-el="sub-categories"]');
  const rawContent = element.textContent.trim();
  let parsedData;

  try {
    parsedData = parseJSONWithCorrection(rawContent);
  } catch (error) {
    console.error("Unable to parse sub-categories data:", error);
    return;
  }

  if (parsedData) {
    // Chart Variables
    const mainCategories = parsedData.map((item) => item.key);
    const allSubCategories = {};
    const datasets = [];
    const categoryTotals = [];

    // Process Sub-Categories
    parsedData.forEach((category, index) => {
      let totalCategoryValue = 0;

      category.value.forEach((subCategory) => {
        const parsedSubCategory = JSON.parse(subCategory);
        const [subCategoryKey, subCategoryValue] = Object.entries(parsedSubCategory)[0];

        totalCategoryValue += subCategoryValue;

        if (!allSubCategories[subCategoryKey]) {
          allSubCategories[subCategoryKey] = [];
        }

        allSubCategories[subCategoryKey][index] = subCategoryValue || 0;
      });

      categoryTotals.push({ key: category.key, total: totalCategoryValue });
    });

    // Build Datasets
    Object.entries(allSubCategories).forEach(([subCategoryName, values], colorIndex) => {
      const normalizedValues = mainCategories.map((_, i) => values[i] || 0);

      datasets.push({
        label: subCategoryName,
        data: normalizedValues,
        backgroundColor: colorPalette[colorIndex % colorPalette.length],
        borderWidth: 1,
      });
    });

    // Chart Options
    const options = {
      responsive: true,
      maintainAspectRatio: true,
      indexAxis: "x",
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true, // Tooltips enabled
          titleFont: { family: "Inter Tight", size: 14 },
          bodyFont: { family: "Inter Tight", size: 14 },
        },
      },
      scales: {
        x: { stacked: true, ticks: { font: { family: "Inter Tight", size: 14 } } },
        y: { stacked: true, ticks: { stepsize: 12, font: { family: "Inter Tight", size: 14 } } },
      },
    };

    // Generate Chart
    const chartInstance = new Chart(document.getElementById("sub-categories").getContext("2d"), {
      type: "bar",
      data: { labels: mainCategories, datasets },
      options,
    });

    // Display a default tooltip for the first bar on load
    chartInstance.options.plugins.tooltip.enabled = true;
    const firstBarTooltip = [
      {
        datasetIndex: 0, // First dataset
        index: 0, // First bar
      },
    ];

    chartInstance.update(); // Update the chart
    chartInstance.tooltip.setActiveElements(firstBarTooltip, { x: 0, y: 0 });
    chartInstance.tooltip.update();
    chartInstance.draw();

    // Map Recommendations
    const sortedCategories = categoryTotals
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);

    sortedCategories.forEach((category, index) => {
      const categoryElement = document.querySelector(`[data-category="category-${index + 1}"]`);
      const recommendationElement = document.querySelector(`[data-recommendation="recommendation-${index + 1}"]`);

      if (categoryElement) categoryElement.textContent = category.key;
      if (recommendationElement)
        recommendationElement.textContent = recommendations[category.key] || "No recommendation available.";
    });

    console.log("Chart generated, recommendations injected, and tooltip displayed.");
  }
});



// Chart: Industry Benchmark - Dynamic Chart Type
observeChart("industry-benchmark", () => {
  console.log("Initializing Industry Benchmark chart...");

  const element = document.querySelector('[data-el="industry-benchmark"]');
  const rawContent = element.textContent.trim();
  let parsedData;

  try {
    console.log("Parsing industry benchmark JSON...");
    parsedData = parseJSONWithCorrection(
      rawContent.startsWith("[") && rawContent.endsWith("]") ? rawContent : `[${rawContent}]`
    ); // Add brackets if missing
    console.log("Parsed data:", parsedData);
  } catch (error) {
    console.error("Unable to parse industry benchmark data:", error);
    return;
  }

  if (parsedData) {
    console.log("Checking data size for chart type...");

    // Initialize arrays for labels and datasets
    const labels = [];
    const companyRatings = [];
    const industryRatings = [];
    const betterCategories = [];
    const worseCategories = [];

    // Process data
    parsedData.forEach((item) => {
      const topic = item.key.replace(/_/g, " ").toLowerCase().replace(/(?:^|\s)\S/g, (match) => match.toUpperCase());
      const parsedValue = JSON.parse(item.value);
      const companyRating = parsedValue.company_avg_topic_rating;
      const industryRating = parsedValue.industry_avg_topic_rating;

      labels.push(topic);
      companyRatings.push(companyRating);
      industryRatings.push(industryRating);

      // Compare ratings for dynamic message
      if (companyRating > industryRating) {
        betterCategories.push(topic);
      } else if (companyRating < industryRating) {
        worseCategories.push(topic);
      }
    });

// Generate the dynamic message with "and" for the last item
const formatCategories = (categories) => {
  if (categories.length > 1) {
    return `${categories.slice(0, -1).join(", ")} and ${categories.slice(-1)}`;
  } else if (categories.length === 1) {
    return categories[0];
  }
  return "";
};

let finalMessage = ""; // Initialize the message

if (betterCategories.length > 0 && worseCategories.length > 0) {
  // Case 1: The company is doing better in some areas and worse in others
  const betterMessage = `You’re performing better than the industry on ${formatCategories(betterCategories)}`;
  const worseMessage = `but you struggle with ${formatCategories(worseCategories)} categories.`;
  finalMessage = `${betterMessage} ${worseMessage}`;
} else if (betterCategories.length > 0 && worseCategories.length === 0) {
  // Case 2: The company is doing better everywhere
  finalMessage = `Congrats, you're currently doing better than the industry on ${formatCategories(betterCategories)} topics.`;
} else if (betterCategories.length === 0 && worseCategories.length > 0) {
  // Case 3: The company is doing worse everywhere
  finalMessage = "Identify your areas of improvement and stay ahead of the curve.";
}

console.log(finalMessage);

// Insert the message into the DOM
$("#benchmark-text").text(finalMessage);

    // Chart generation
    if (labels.length <= 2) {
      console.log("Insufficient data for radar chart. Generating a Polar Area Chart...");

      // Prepare datasets for Polar Area Chart
      const datasets = [
        {
          data: companyRatings,
          backgroundColor: colorPalette.slice(0, companyRatings.length), // Dynamic colors
          label: "Company Avg. Topic Rating",
        },
        {
          data: industryRatings,
          backgroundColor: colorPalette.slice(companyRatings.length, companyRatings.length + industryRatings.length),
          label: "Industry Avg. Topic Rating",
        },
      ];

      const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: { font: { family: "Inter Tight", size: 14 } },
          },
          tooltip: {
            callbacks: {
              title: (context) => context[0].label,
              label: (context) => `${context.dataset.label}: ${context.raw}`,
            },
          },
        },
        scales: {
          r: { ticks: { display: false } },
        },
      };

      console.log("Creating Polar Area Chart with options:", options);
      createChart("polarArea", "industry-benchmark", labels, datasets, options);
    } else {
      console.log("Sufficient data for radar chart. Generating a Radar Chart...");

      const datasets = [
        {
          label: "Company Avg. Topic Rating",
          data: companyRatings,
          backgroundColor: `${colorPalette[2]}33`,
          borderColor: colorPalette[2],
          pointBackgroundColor: colorPalette[2],
          borderWidth: 2,
        },
        {
          label: "Industry Avg. Topic Rating",
          data: industryRatings,
          backgroundColor: `${colorPalette[5]}33`,
          borderColor: colorPalette[5],
          pointBackgroundColor: colorPalette[5],
          borderWidth: 2,
        },
      ];

      const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: { font: { family: "Inter Tight", size: 14 } },
          },
          tooltip: {
            callbacks: {
              title: (context) => context[0].label,
              label: (context) => `${context.dataset.label}: ${context.raw}`,
            },
          },
        },
        scales: {
          r: {
            angleLines: { display: true },
            suggestedMin: 0,
            suggestedMax: 5,
            ticks: {
              stepSize: 1,
              font: { family: "Inter Tight", size: 14 },
              backdropColor: "transparent",
            },
            pointLabels: { font: { family: "Inter Tight", size: 14 } },
          },
        },
      };

      console.log("Creating Radar Chart with options:", options);
      createChart("radar", "industry-benchmark", labels, datasets, options);
    }
  }
});

/****************************
 *
 * Playground
 *
 ****************************/


// Autoplay toggle
window.fsComponents = window.fsComponents || [];
window.fsComponents.push([
  'slider',
  (sliderInstances) => {
    console.log('Slider Successfully loaded!');

    function waitForSliderInstance() {
      console.log('Checking for Swiper instances...');

      const auditSlider = sliderInstances.find((sliderInstance) => {
        const rootElement = sliderInstance.el;
        return (
          rootElement.classList.contains('cx--audit_instance') ||
          rootElement.closest('.cx--audit_instance')
        );
      });

      if (auditSlider) {
        console.log('Found cx--audit_instance slider:', auditSlider);

        // Set autoplay and other configurations
        auditSlider.params.autoplay = {
          delay: 5000,
          disableOnInteraction: true,
        };
        auditSlider.params.loop = false;
        auditSlider.autoplay.stop();
        console.log('Autoplay configured and stopped by default.');

        // Log the current hash and update the URL manually
        auditSlider.on('slideChange', () => {
          const currentSlide = auditSlider.slides[auditSlider.activeIndex];
          const currentHash = currentSlide.getAttribute('data-hash');

          if (currentHash) {
            console.log(`Current hash: #${currentHash}`);
            // Update the URL hash without reloading
            history.pushState(null, null, `#${currentHash}`);
            console.log(`URL hash updated to: #${currentHash}`);
          }
        });

        // Toggle autoplay logic
        const toggleButton = document.getElementById('toggle-autoplay');
        if (!toggleButton) {
          console.error('Toggle button with ID "toggle-autoplay" not found!');
          return;
        }

        let isPlaying = false;
        toggleButton.addEventListener('click', () => {
          console.log(
            `Autoplay state before toggle: ${isPlaying ? 'Playing' : 'Paused'}`
          );
          if (isPlaying) {
            auditSlider.autoplay.stop();
            console.log('Autoplay stopped.');
          } else {
            auditSlider.autoplay.start();
            console.log('Autoplay started.');
          }
          isPlaying = !isPlaying;
          console.log(
            `Autoplay state after toggle: ${isPlaying ? 'Playing' : 'Paused'}`
          );
        });

        // Stop autoplay on the last slide
        auditSlider.on('slideChange', () => {
          if (auditSlider.activeIndex === auditSlider.slides.length - 1) {
            console.log('Reached the last slide. Stopping autoplay.');
            auditSlider.autoplay.stop();
            isPlaying = false;
          }
        });
      } else {
        console.log('No slider with class "cx--audit_instance" found. Retrying...');
        setTimeout(waitForSliderInstance, 100);
      }
    }

    waitForSliderInstance();
  },
]);


// Fake chart
observeChart("sub-categories-2", () => {
  console.log("Initializing Grouped Bar Chart...");

  const element = document.querySelector('[data-el="sub-categories"]');
  const rawContent = element.textContent.trim();
  let parsedData;

  try {
    console.log("Parsing sub-categories JSON...");
    parsedData = parseJSONWithCorrection(rawContent);
    console.log("Parsed data:", parsedData);
  } catch (error) {
    console.error("Unable to parse sub-categories data:", error);
  }

  if (parsedData) {
    console.log("Transforming data for grouped bar chart...");

    // Extract the main categories (keys) and sub-categories (values)
    const mainCategories = parsedData.map((item) => item.key);
    const allSubCategories = {};
    const datasets = [];

    parsedData.forEach((category, index) => {
      category.value.forEach((subCategory) => {
        const parsedSubCategory = JSON.parse(subCategory);
        const [subCategoryKey, subCategoryValue] = Object.entries(parsedSubCategory)[0];

        if (!allSubCategories[subCategoryKey]) {
          allSubCategories[subCategoryKey] = [];
        }

        allSubCategories[subCategoryKey][index] = subCategoryValue || 0;
      });
    });

    // Build datasets for each sub-category
    Object.entries(allSubCategories).forEach(([subCategoryName, values], colorIndex) => {
      const normalizedValues = mainCategories.map((_, i) => values[i] || 0);

      datasets.push({
        label: subCategoryName,
        data: normalizedValues,
        backgroundColor: colorPalette[colorIndex % colorPalette.length],
        borderWidth: 1,
      });
    });

    console.log("Final datasets:", datasets);

    const options = {
      responsive: true,
      maintainAspectRatio: true,
      indexAxis: "y", // Horizontal bar chart
      plugins: {
        legend: {
          position: "top", // Place the legend at the top
          labels: {
            font: {
              family: "Inter Tight",
              size: 14,
            },
          },
        },
        tooltip: {
          enabled: false, // Disable tooltips completely
        },
      },
      scales: {
        x: {
          ticks: {
            font: {
              family: "Inter Tight",
              size: 14,
            },
            stepsize: 12, // Increment ticks by 10
          },
          grid: {
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            font: {
              family: "Inter Tight",
              size: 14,
            },
          },
          grid: {
            drawBorder: false,
          },
        },
      },
      layout: {
        padding: {
          top: 10,
          left: 10,
          right: 10,
          bottom: 10,
        },
      },
    };

    // Create the new chart
    const chartInstance = new Chart(
      document.getElementById("sub-categories-2").getContext("2d"),
      {
        type: "bar", // Bar chart
        data: { labels: mainCategories, datasets },
        options,
      }
    );

    console.log("Grouped Bar Chart initialized.");
  }
});

//

// // Chart 1: Sentiment Overtime Line Chart with Lines Only
// observeChart("barChart", () => {
//   const element = document.querySelector('[data-el="sentiment-overtime"]');
//   const rawContent = element.textContent.trim();
//   let parsedData;

//   try {
//     parsedData = parseJSONWithCorrection(rawContent);
//   } catch (error) {
//     console.error("Unable to parse JSON:", error);
//   }

//   if (parsedData) {
//     const rawLabels = parsedData.map((item) => item.key);
//     const labels = capitalizeLabels(rawLabels); // Capitalize labels
//     const positiveData = parsedData.map(
//       (item) =>
//         item.value.find((subItem) => subItem.positive !== undefined)
//           ?.positive || 0
//     );
//     const neutralData = parsedData.map(
//       (item) =>
//         item.value.find((subItem) => subItem.neutral !== undefined)?.neutral ||
//         0
//     );
//     const negativeData = parsedData.map(
//       (item) =>
//         item.value.find((subItem) => subItem.negative !== undefined)
//           ?.negative || 0
//     );

//     const datasets = [
//       {
//         label: "Positive",
//         data: positiveData,
//         borderColor: colorPalette[2], // Third color in the palette
//         borderWidth: 2,
//         fill: false, // Remove fill under the line
//         tension: 0.4, // Smooth curves
//       },
//       {
//         label: "Neutral",
//         data: neutralData,
//         borderColor: colorPalette[4], // Fifth color in the palette
//         borderWidth: 2,
//         fill: false,
//         tension: 0.4,
//       },
//       {
//         label: "Negative",
//         data: negativeData,
//         borderColor: colorPalette[6], // Seventh color in the palette
//         borderWidth: 2,
//         fill: false,
//         tension: 0.4,
//       },
//     ];

//     const options = {
//       responsive: true,
//       maintainAspectRatio: true,
//       animation: {
//         duration: 1000, // Smooth animations
//       },

//       responsiveAnimationDuration: 0, // Disable responsiveness-triggered animations

//       layout: {
//         padding: {
//           top: 10,
//           left: 10,
//           right: 10,
//           bottom: 10,
//         },
//       },
//       plugins: {
//         legend: {
//           position: "bottom",
//           labels: {
//             font: { family: "Inter Tight" },
//           },
//         },
//         tooltip: {
//           titleFont: { family: "Inter Tight", size: 14 },
//           bodyFont: { family: "Inter Tight", size: 14 },
//         },
//       },
//       scales: {
//         x: {
//           ticks: { font: { family: "Inter Tight" } },
//         },
//         y: {
//           ticks: {
//             callback: function (value) {
//               return value + "%"; // Append "%" to tick labels
//             },
//             font: { family: "Inter Tight" },
//           },
//         },
//       },
//     };

//     const ctx = document.getElementById("barChart").getContext("2d");
//     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear canvas before drawing

//     const chartInstance = new Chart(ctx, {
//       type: "line",
//       data: {
//         labels: labels,
//         datasets: datasets,
//       },
//       options: options,
//     });

//     chartInstance.update("none"); // Force redraw without animations
//   }
// });


// // Sort brands by gmv and hide more than 3
// $(document).ready(function () {
//   console.log("Script execution started!");

//   // Get the current values for industry, GMV, positioning, and rating
//   const $currentIndustryElement = $('[data-el="curent-industry"]');
//   const $currentGmvElement = $('[data-el="curent-gmv"]');
//   const $currentPositioningElement = $('[data-el="curent-positioning"]');
//   const $currentRatingElement = $('[data-el="curent-rating"]');

//   const currentIndustry = $currentIndustryElement.length ? $currentIndustryElement.text().trim() : null;
//   const currentGmv = $currentGmvElement.length ? $currentGmvElement.text().trim() : null;
//   const currentPositioning = $currentPositioningElement.length ? $currentPositioningElement.text().trim() : null;
//   const currentRating = $currentRatingElement.length ? parseFloat($currentRatingElement.text().trim()) : null;

//   if (!currentIndustry || !currentGmv || !currentPositioning || currentRating === null) {
//       console.error("One or more current values (industry, GMV, positioning, rating) are missing. Exiting script.");
//       return;
//   }

//   console.log("Current Industry (raw):", currentIndustry);
//   console.log("Current GMV (raw):", currentGmv);
//   console.log("Current Positioning (raw):", currentPositioning);
//   console.log("Current Rating:", currentRating);

//   // Helper function to normalize text for robust comparison
//   const normalizeText = (text) => {
//       return text
//           .toLowerCase() // Convert to lowercase
//           .replace(/\s+/g, " ") // Replace multiple spaces with a single space
//           .replace(/[^\w\s]/g, "") // Remove non-alphanumeric characters except spaces
//           .trim(); // Remove leading/trailing spaces
//   };

//   // Normalize current values for comparison
//   const normalizedCurrentIndustry = normalizeText(currentIndustry);
//   const normalizedCurrentGmv = normalizeText(currentGmv);
//   const normalizedCurrentPositioning = normalizeText(currentPositioning);

//   console.log("Normalized Current Industry:", normalizedCurrentIndustry);
//   console.log("Normalized Current GMV:", normalizedCurrentGmv);
//   console.log("Normalized Current Positioning:", normalizedCurrentPositioning);

//   // Step 1: Filter items based on industry, GMV, and positioning
//   const filteredItems = [];
//   $(".w-dyn-item").each(function () {
//       const $item = $(this);
//       const industry = $item.find('[data-el="industry"]').text().trim();
//       const gmv = $item.find('[data-el="gmv"]').text().trim();
//       const positioning = $item.find('[data-el="positioning"]').text().trim();

//       // Normalize the item's industry, GMV, and positioning for comparison
//       const normalizedIndustry = normalizeText(industry);
//       const normalizedGmv = normalizeText(gmv);
//       const normalizedPositioning = normalizeText(positioning);

//       console.log("Checking item:", {
//           rawIndustry: industry,
//           rawGmv: gmv,
//           rawPositioning: positioning,
//           normalizedIndustry,
//           normalizedGmv,
//           normalizedPositioning,
//       });

//       // Keep items that match industry, GMV, and positioning
//       if (
//           normalizedIndustry === normalizedCurrentIndustry &&
//           normalizedGmv === normalizedCurrentGmv &&
//           normalizedPositioning === normalizedCurrentPositioning
//       ) {
//           filteredItems.push($item);
//       } else {
//           $item.remove(); // Remove non-matching items
//           console.log("Removed non-matching item:", { industry, gmv, positioning });
//       }
//   });

//   console.log(`Filtered items after first comparison (${filteredItems.length}):`, filteredItems);

//   // Step 2: Compare ratings for the filtered items
//   const finalItems = [];
//   filteredItems.forEach(($item) => {
//       const ratingElement = $item.find('[data-el="rating"]');
//       const rating = ratingElement.length ? parseFloat(ratingElement.text().trim()) : null;

//       if (rating !== null) {
//           console.log("Checking item rating:", { item: $item, rating });

//           // Keep items where the rating is lower than the current rating
//           if (rating < currentRating) {
//               finalItems.push($item);
//               console.log("Added to finalItems (rating is lower):", { rating });
//           } else {
//               $item.remove(); // Remove items with equal or higher ratings
//               console.log("Removed item with higher or equal rating:", { rating });
//           }
//       } else {
//           console.log("No rating found for this item. Removing.");
//           $item.remove(); // Remove items with no rating
//       }
//   });

//   console.log(`Final items after rating comparison (${finalItems.length}):`, finalItems);

//   // Step 3: Append the remaining items to a single `.w-dyn-items` list
//   const $targetList = $(".w-dyn-items").first(); // Select the first `.w-dyn-items` list
//   if ($targetList.length) {
//       finalItems.forEach(($item) => {
//           $targetList.append($item); // Append each final item to the target list
//       });
//       console.log("Appended final items to the first `.w-dyn-items` list.");
//   } else {
//       console.error("No `.w-dyn-items` list found to append items.");
//   }

//   // Step 4: Remove empty `.w-dyn-list` containers
//   $(".w-dyn-list").each(function () {
//       const $list = $(this);
//       if ($list.find(".w-dyn-item").length === 0) {
//           $list.remove(); // Remove the list if it contains no `.w-dyn-item` elements
//           console.log("Removed empty `.w-dyn-list` container.");
//       }
//   });

//   // Log the final list of items
//   console.log(`Final remaining items (${finalItems.length}):`, finalItems);
// });


// // Create a dynamic message
// $(document).ready(function () {
//   console.log("Script execution started!");

//   // Get the raw data from the element with `data-el="industry-benchmark"`
//   const $benchmarkElement = $('[data-el="industry-benchmark"]');
//   const rawData = $benchmarkElement.length ? JSON.parse($benchmarkElement.text().trim()) : null;

//   if (!rawData) {
//       console.error("Industry benchmark data is missing or invalid. Exiting script.");
//       return;
//   }

//   console.log("Raw Industry Benchmark Data:", rawData);

//   // Helper function to prettify keys into human-readable phrases
//   const prettifyKey = (key) => {
//       return key
//           .replace(/_/g, " ") // Replace underscores with spaces
//           .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
//   };

//   // Variables to store better and worse performing categories
//   const betterCategories = [];
//   const worseCategories = [];

//   // Analyze the data
//   rawData.forEach((item) => {
//       const parsedValue = JSON.parse(item.value); // Parse the JSON string in the value
//       const companyRating = parsedValue.company_avg_topic_rating;
//       const industryRating = parsedValue.industry_avg_topic_rating;

//       if (companyRating > industryRating) {
//           betterCategories.push(prettifyKey(item.key));
//       } else if (companyRating < industryRating) {
//           worseCategories.push(prettifyKey(item.key));
//       }
//   });
// });

// Convert number to %
// Select all elements with data-el="negative-reviews"
// const negativeReviewsElements = document.querySelectorAll('[data-el="negative-reviews"]');

// // Check if there are any elements
// if (negativeReviewsElements.length > 0) {
//     negativeReviewsElements.forEach(element => {
//         // Get the decimal value from the element
//         let decimalValue = parseFloat(element.textContent);

//         // Ensure the value is a valid number and between 0 and 1
//         if (!isNaN(decimalValue) && decimalValue >= 0 && decimalValue <= 1) {
//             // Convert to percentage
//             let percentageValue = (decimalValue * 100).toFixed(0) + '%';

//             // Update the element's text content with the percentage value
//             element.textContent = percentageValue;
//         } else {
//             console.warn('Invalid decimal value for:', element);
//         }
//     });
// }

// // Chart: Topic Average Bar Chart with Dynamic Top 3 Topics
// observeChart("topic-avg", () => {
//   const element = document.querySelector('[data-el="topic-avg"]');
//   const rawContent = element.textContent.trim();
//   let parsedData;

//   try {
//     parsedData = parseJSONWithCorrection(rawContent);
//   } catch (error) {
//     console.error("Unable to parse topic average data:", error);
//   }

//   if (parsedData) {
//     const rawLabels = parsedData.map((item) => item.key.replace(/_/g, " "));
//     const labels = capitalizeLabels(rawLabels); // Capitalize labels
//     const dataValues = parsedData.map((item) => item.value);

//     // Identify top 3 topics
//     const topTopics = dataValues
//       .map((value, index) => ({ label: labels[index], value })) // Map labels with their values
//       .sort((a, b) => b.value - a.value) // Sort descending by value
//       .slice(0, 3); // Get the top 3

//     const topTopicsText = topTopics
//       .map((topic) => `${topic.label} (${topic.value.toFixed(1)})`) // Format the text
//       .join(", ");

//     console.log("Top 3 Topics:", topTopicsText);

//     // Generate the dynamic text with "and" for the last item
//     const topTopicLabels = topTopics.map((topic) => topic.label);
//     const dynamicText =
//       topTopicLabels.length > 1
//         ? `Your customers value your strengths in ${topTopicLabels
//             .slice(0, -1)
//             .join(", ")} and ${topTopicLabels.slice(-1)}. Keep leveraging these areas to build trust and loyalty.`
//         : `Your customers value your strength in ${topTopicLabels[0]}. Keep leveraging this area to build trust and loyalty.`;

//     // Update DOM with dynamic text
//     const dynamicTextElement = document.querySelector("#avg-score-text");
//     if (dynamicTextElement) {
//       dynamicTextElement.textContent = dynamicText;
//     }

//     const datasets = [
//       {
//         data: dataValues, // Removed the `label` field from the dataset
//         backgroundColor: "#cb55ef",
//         borderColor: "#cb55ef",
//         borderWidth: 1,
//       },
//     ];

//     const options = {
//       responsive: true, // Chart adjusts to container size
//       maintainAspectRatio: true, // Keeps aspect ratio
//       aspectRatio: 2, // Custom aspect ratio (2 means width is twice the height)
//       plugins: {
//         legend: {
//           display: false, // Hides the legend
//         },
//         tooltip: {
//           titleFont: { family: "Inter Tight", size: 14 },
//           bodyFont: { family: "Inter Tight", size: 14 },
//         },
//         title: {
//           display: true,
//           text: "Hover over a bar to see the category", // Add the helper text
//           font: {
//             family: "Inter Tight",
//             size: 14,
//             weight: "normal",
//           },
//           padding: {
//             top: 10,
//             bottom: 10,
//           },
//         },
//       },
//       scales: {
//         x: {
//           ticks: {
//             display: false, // Hides X-axis ticks
//           },
//         },
//         y: {
//           min: 0,
//           max: 5,
//           ticks: {
//             stepSize: 1, // Increment ticks by 1
//             font: {
//               family: "Inter Tight",
//               size: 14,
//             },
//           },
//         },
//       },
//     };

//     // Create the chart
//     const chartInstance = new Chart(
//       document.getElementById("topic-avg").getContext("2d"),
//       {
//         type: "bar",
//         data: { labels, datasets },
//         options,
//       }
//     );

//     // Display a default tooltip for the first bar
//     chartInstance.options.plugins.tooltip.enabled = true; // Ensure tooltips are enabled
//     chartInstance.update();

//     chartInstance.tooltip.setActiveElements(
//       [{ datasetIndex: 0, index: 0 }], // Tooltip for the first bar
//       { x: 0, y: 0 } // Tooltip position (defaults to the first bar)
//     );
//     chartInstance.tooltip.update();
//   }
// });

// create PR