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
          titleFont: { family: "Inter Tight", size: 12 },
          bodyFont: { family: "Inter Tight", size: 12 },
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


// Shared Recommendations Mapping
const recommendationsMap = {
  "Product Quality": "Use ticket trend analysis to identify recurring issues and notify your product or manufacturing teams. Reduces complain volume by 20–30%, improving satisfaction and lowering resource strain.",
  "Customer Service": "Equip human and AI agents with customer profiles pulling data from each tool to resolve tickets faster, reducing support costs by 30–40% and improving loyalty.",
  "Delivery & Shipping": "Set up real-time order tracking with proactive updates, preventing 57% of customers from abandoning the brand post-purchase.",
  "Returns & Refunds": "Automate self-serve return processes with instant refunds or exchanges, increasing repeat purchases by 60% through a trusted process.",
  "Pricing & Value": "Staff AI or humans on live support to personalize recommendations to improve perceived value and drive upsells, or offer price-matching via discounts.",
  "Website User Experience": "Integrate AI-driven search and product matching, reducing customer frustration and increasing conversions by up to 42%.",
  "Order Accuracy": "Connect your support tools and instant, AI-powered agents with your order management system to quickly correct any inaccuracies in orders.",
  "Product Variety": "Create systems to turn out-of-stock complaints and product requests into newsletter signups for back-in-stock notifications and retargeting campaigns.",
  "Company Reputation": "Integrate your support system with reviews platform to address negative feedback promptly.",
  "Communication & Information": "Build your self-service and AI support offerings to make information accessible across platforms with a 0-minute wait time.",
  "Packaging": "Use ticket trend analysis to gather feedback about packaging quality and share it with your operations team to optimize for sustainability or better product protection.",
  "Trust & Security": "Share in-depth knowledge on your website and internally to promote certifications, safe product usage, and clean materials.",
  "Payment Options": "Offer live chat on checkout pages for quick resolution of payment-related issues like failed transactions, refunds, or disputes for a seamless checkout experience.",
  "Post-Purchase Support": "Use ticket trend analysis to understand the most common questions, and include answers in packaging or automated post-purchase email flows to reducing misuse-related returns.",
  "Loyalty Program": "Integrate your support system and loyalty system to prioritize members and provide VIP treatment that boosts customer LTV.",
  "Ordering Accuracy": "Use an AI support agent that can instantly make changes to orders before they leave your shipping address, to reduce customer frustration and costly returns or re-shipping.",
  "Warranty Support": "Offer a contact form that collects all the necessary information from requesters upfront. Use that information as variables so an AI can determine who is variable and who is not."
};

// Chart: Sub-Categories Stacked Vertical Bar Chart
observeChart("sub-categories", () => {
  const element = document.querySelector('[data-el="sub-categories"]');
  const rawContent = element.textContent.trim();
  let parsedData;

  try {
    parsedData = parseJSONWithCorrection(rawContent);
  } catch (error) {
    console.error("Unable to parse sub-categories data:", error);
  }

  if (parsedData) {
    // Step 1: Extract Categories and Totals
    const categoryTotals = {};
    parsedData.forEach((category) => {
      category.value.forEach((subCategory) => {
        const parsedSubCategory = JSON.parse(subCategory);
        const [subCategoryKey, subCategoryValue] = Object.entries(parsedSubCategory)[0];
        categoryTotals[subCategoryKey] = (categoryTotals[subCategoryKey] || 0) + subCategoryValue;
      });
    });

    // Step 2: Sort and Select Top 3 Categories
    const topCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1]) // Sort by descending total
      .slice(0, 3); // Top 3 categories

    // Step 3: Inject Categories and Recommendations into HTML
    topCategories.forEach(([categoryName], index) => {
      const categoryElement = document.querySelector(`[data-category="category-${index + 1}"]`);
      const recommendationElement = document.querySelector(`[data-recommendation="recommendation-${index + 1}"]`);
      
      if (categoryElement) categoryElement.textContent = categoryName;
      if (recommendationElement) recommendationElement.textContent = recommendationsMap[categoryName] || "No recommendation available.";
    });

    // Step 4: Build Datasets for Chart
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

    Object.entries(allSubCategories).forEach(([subCategoryName, values], colorIndex) => {
      const normalizedValues = mainCategories.map((_, i) => values[i] || 0);
      datasets.push({
        label: subCategoryName,
        data: normalizedValues,
        backgroundColor: colorPalette[colorIndex % colorPalette.length],
        borderWidth: 1,
      });
    });

    // Step 5: Generate Chart
    const options = {
      responsive: true,
      maintainAspectRatio: true,
      indexAxis: "x",
      plugins: { legend: { display: false }, tooltip: { enabled: true } },
      scales: { x: { stacked: true }, y: { stacked: true, ticks: { stepSize: 10 } } },
    };

    new Chart(document.getElementById("sub-categories").getContext("2d"), {
      type: "bar",
      data: { labels: mainCategories, datasets },
      options,
    });
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
            labels: { font: { family: "Inter Tight", size: 12 } },
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
            labels: { font: { family: "Inter Tight", size: 12 } },
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
              font: { family: "Inter Tight", size: 12 },
              backdropColor: "transparent",
            },
            pointLabels: { font: { family: "Inter Tight", size: 12 } },
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

    // Find the specific slider instance with class 'cx-audit_instance'
    const auditSlider = sliderInstances.find((sliderInstance) => 
      sliderInstance.el.classList.contains('cx-audit_instance')
    );

    if (auditSlider) {
      console.log('Configuring autoplay toggle for cx-audit_instance slider');

      // Initial autoplay state
      let isPlaying = false;

      // Create a button to toggle autoplay
      const toggleButton = document.getElementById('toggle-autoplay');

      // Add click event listener to toggle autoplay
      toggleButton.addEventListener('click', () => {
        if (isPlaying) {
          auditSlider.autoplay.stop();
          
        } else {
          auditSlider.autoplay.start();

        }
        isPlaying = !isPlaying;
      });
    } else {
      console.log('No cx-audit_instance slider found.');
    }
  },
]);

// Fake chart
// Chart: Horizontal Grouped Bar Chart
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
        // Parse the sub-category object
        const parsedSubCategory = JSON.parse(subCategory);
        const [subCategoryKey, subCategoryValue] = Object.entries(parsedSubCategory)[0];

        // Ensure the sub-category is tracked globally for consistent order
        if (!allSubCategories[subCategoryKey]) {
          allSubCategories[subCategoryKey] = [];
        }

        // Fill missing data for other categories with 0 to ensure proper grouping
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
              size: 12,
            },
          },
        },
        tooltip: {
          titleFont: {
            family: "Inter Tight",
            size: 12,
          },
          bodyFont: {
            family: "Inter Tight",
            size: 12,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            font: {
              family: "Inter Tight",
              size: 12,
            },
            stepSize: 10, // Increment ticks by 10
          },
          grid: {
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            font: {
              family: "Inter Tight",
              size: 12,
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
        data: { labels: mainCategories, datasets }, // Data for grouped bars
        options,
      }
    );

    // Optionally display a default tooltip for the first bar
    chartInstance.options.plugins.tooltip.enabled = true; // Ensure tooltips are enabled
    chartInstance.update();

    chartInstance.tooltip.setActiveElements(
      [{ datasetIndex: 0, index: 0 }], // Tooltip for the first bar
      { x: 0, y: 0 } // Tooltip position (defaults to the first bar)
    );
    chartInstance.tooltip.update();
  }
});

console.log('Script loaded successfully!');