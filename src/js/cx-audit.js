// Shared Color Palette
const colorPalette = ["#faeaff", "#f5d4ff", "#cb55ef", "#6f0c86", "#db90ff", "#9c49eb", "#6007c3"];

// // Global Chart.js Configuration for Animation Easing
// Chart.defaults.animation = {
//   duration: 800, // 2 seconds animation
//   easing: 'easeInOutQuad', // Smooth acceleration and deceleration
// };

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
      threshold: 0.7, // Trigger when the chart is almost fully visible
    }
  );
  observer.observe(target);
}


// Chart 1: Sentiment Overtime Line Chart with Lines Only
observeChart("barChart", () => {
  const element = document.querySelector('[data-el="sentiment-overtime"]');
  const rawContent = element.textContent.trim();
  let parsedData;

  try {
    parsedData = parseJSONWithCorrection(rawContent);
  } catch (error) {
    console.error("Unable to parse JSON:", error);
  }

  if (parsedData) {
    const rawLabels = parsedData.map((item) => item.key);
    const labels = capitalizeLabels(rawLabels); // Capitalize labels
    const positiveData = parsedData.map(
      (item) =>
        item.value.find((subItem) => subItem.positive !== undefined)
          ?.positive || 0
    );
    const neutralData = parsedData.map(
      (item) =>
        item.value.find((subItem) => subItem.neutral !== undefined)?.neutral ||
        0
    );
    const negativeData = parsedData.map(
      (item) =>
        item.value.find((subItem) => subItem.negative !== undefined)
          ?.negative || 0
    );

    const datasets = [
      {
        label: "Positive",
        data: positiveData,
        borderColor: colorPalette[2], // Third color in the palette
        borderWidth: 2,
        fill: false, // Remove fill under the line
        tension: 0.4, // Smooth curves
      },
      {
        label: "Neutral",
        data: neutralData,
        borderColor: colorPalette[4], // Fifth color in the palette
        borderWidth: 2,
        fill: false,
        tension: 0.4,
      },
      {
        label: "Negative",
        data: negativeData,
        borderColor: colorPalette[6], // Seventh color in the palette
        borderWidth: 2,
        fill: false,
        tension: 0.4,
      },
    ];

    const options = {
      responsive: true,
      maintainAspectRatio: true,
      animation: {
        duration: 1000, // Smooth animations
      },

      responsiveAnimationDuration: 0, // Disable responsiveness-triggered animations

      layout: {
        padding: {
          top: 10,
          left: 10,
          right: 10,
          bottom: 10,
        },
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            font: { family: "Inter Tight" },
          },
        },
        tooltip: {
          titleFont: { family: "Inter Tight", size: 12 },
          bodyFont: { family: "Inter Tight", size: 12 },
        },
      },
      scales: {
        x: {
          ticks: { font: { family: "Inter Tight" } },
        },
        y: {
          ticks: {
            callback: function (value) {
              return value + "%"; // Append "%" to tick labels
            },
            font: { family: "Inter Tight" },
          },
        },
      },
    };

    const ctx = document.getElementById("barChart").getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear canvas before drawing

    const chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: options,
    });

    chartInstance.update("none"); // Force redraw without animations
  }
});


// Chart 2: Sentiment Aggregated Pie Chart
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
    const rawLabels = parsedData.map((item) => item.key);
    const labels = capitalizeLabels(rawLabels); // Capitalize labels
    const dataValues = parsedData.map((item) => item.value);

    const datasets = [
      {
        data: dataValues,
        backgroundColor: colorPalette.slice(0, labels.length),
      },
    ];

    createChart(
      "doughnut",
      "sentiment-aggregated-breakdown",
      labels,
      datasets,
      {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: { font: { family: "Inter Tight" } },
          },
          tooltip: {
            titleFont: { family: "Inter Tight", size: 12 },
            bodyFont: { family: "Inter Tight", size: 12 },
          },
        },
      }
    );
  }
});

// Chart 3: Topic Average Bar Chart
observeChart("topic-avg", () => {
  const element = document.querySelector('[data-el="topic-avg"]');
  const rawContent = element.textContent.trim();
  let parsedData;

  try {
    parsedData = parseJSONWithCorrection(rawContent);
  } catch (error) {
    console.error("Unable to parse topic average data:", error);
  }

  if (parsedData) {
    const rawLabels = parsedData.map((item) => item.key.replace(/_/g, " "));
    const labels = capitalizeLabels(rawLabels); // Capitalize labels
    const dataValues = parsedData.map((item) => item.value);

    const datasets = [
      {
        data: dataValues, // Removed the `label` field from the dataset
        backgroundColor: "#cb55ef",
        borderColor: "#cb55ef",
        borderWidth: 1,
      },
    ];

    const options = {
      responsive: true, // Chart adjusts to container size
      maintainAspectRatio: true, // Keeps aspect ratio
      aspectRatio: 2, // Custom aspect ratio (2 means width is twice the height)
      plugins: {
        legend: {
          display: false, // Hides the legend
        },
        tooltip: {
          titleFont: { family: "Inter Tight", size: 12 },
          bodyFont: { family: "Inter Tight", size: 12 },
        },
      },
      scales: {
        x: {
          ticks: { display: false }, // Hide individual labels
        },
        y: {
          min: 0,
          max: 5,
        },
      },
    };

    createChart("bar", "topic-avg", labels, datasets, options);
  }
});

// Chart 4: Sub-Categories Stacked Vertical Bar Chart
observeChart("sub-categories", () => {
  console.log("Initializing Sub-Categories chart...");

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
    console.log("Transforming data for stacked vertical bar chart...");

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

        // Fill missing data for other categories with 0 to ensure proper stacking
        allSubCategories[subCategoryKey][index] = subCategoryValue || 0;
      });
    });

    // Build datasets for each sub-category
    Object.entries(allSubCategories).forEach(([subCategoryName, values], colorIndex) => {
      // Fill missing data with 0 for any main categories not represented
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
  indexAxis: "x", // Set to "x" for vertical bar chart (default behavior)
  plugins: {
    legend: {
      display: false, // Hides the legend at the bottom
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
      stacked: true, // Enable stacking on the X axis
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
    y: {
      stacked: true, // Enable stacking on the Y axis
      ticks: {
        stepSize: 10, // Gradations in increments of 10
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

    console.log("Creating vertical stacked bar chart with options:", options);

    createChart("bar", "sub-categories", mainCategories, datasets, options);
  }
});

// Chart 5: Industry Benchmark - Dynamic Chart Type
observeChart("industry-benchmark", () => {
  console.log("Initializing Industry Benchmark chart...");

  const element = document.querySelector('[data-el="industry-benchmark"]');
  const rawContent = element.textContent.trim();
  let parsedData;

  try {
    console.log("Parsing industry benchmark JSON...");
    parsedData = parseJSONWithCorrection(rawContent);
    console.log("Parsed data:", parsedData);
  } catch (error) {
    console.error("Unable to parse industry benchmark data:", error);
  }

  if (parsedData) {
    console.log("Checking data size for chart type...");

    // Extract labels (topics) and datasets for company and industry
    const labels = parsedData.map((item) =>
      item.key.replace(/_/g, " ").toLowerCase().replace(/(?:^|\s)\S/g, (match) => match.toUpperCase())
    ); // Replace underscores with spaces and capitalize

    const companyRatings = parsedData.map(
      (item) => JSON.parse(item.value).company_avg_topic_rating
    );
    const industryRatings = parsedData.map(
      (item) => JSON.parse(item.value).industry_avg_topic_rating
    );

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
            position: "bottom", // Position the legends at the bottom
            labels: {
              font: {
                family: "Inter Tight",
                size: 12,
              },
            },
          },
          tooltip: {
            callbacks: {
              title: (context) => context[0].label, // Display key as title
              label: (context) => {
                const datasetLabel = context.dataset.label;
                const value = context.raw;
                return `${datasetLabel}: ${value}`;
              },
            },
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
          r: {
            ticks: {
              display: false, // Hide the tick labels like "4"
            },
          },
        },
      };

      console.log("Creating Polar Area Chart with options:", options);
      createChart("polarArea", "industry-benchmark", labels, datasets, options);
    } else {
      console.log("Sufficient data for radar chart. Generating a Radar Chart...");

      // Prepare datasets for Radar Chart
      const datasets = [
        {
          label: "Company Avg. Topic Rating",
          data: companyRatings,
          backgroundColor: `${colorPalette[2]}33`, // Semi-transparent fill using colorPalette
          borderColor: colorPalette[2], // Line color
          pointBackgroundColor: colorPalette[2], // Point fill color
          borderWidth: 2,
        },
        {
          label: "Industry Avg. Topic Rating",
          data: industryRatings,
          backgroundColor: `${colorPalette[5]}33`, // Semi-transparent fill using colorPalette
          borderColor: colorPalette[5], // Line color
          pointBackgroundColor: colorPalette[5], // Point fill color
          borderWidth: 2,
        },
      ];

      const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: "bottom", // Position the legends at the bottom
            labels: {
              font: {
                family: "Inter Tight",
                size: 12,
              },
            },
          },
          tooltip: {
            callbacks: {
              title: (context) => context[0].label, // Display key as title
              label: (context) => {
                const datasetLabel = context.dataset.label;
                const value = context.raw;
                return `${datasetLabel}: ${value}`;
              },
            },
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
          r: {
            angleLines: {
              display: true, // Display angle lines
            },
            suggestedMin: 0, // Ensure radar starts at 0
            suggestedMax: 5, // Cap radar scale at 5
            ticks: {
              stepSize: 1, // Set step size to 1
              font: {
                family: "Inter Tight",
                size: 12,
              },
              backdropColor: "transparent", // Remove background from tick numbers
            },
            pointLabels: {
              font: {
                family: "Inter Tight",
                size: 12,
              },
            },
          },
        },
      };

      console.log("Creating Radar Chart with options:", options);
      createChart("radar", "industry-benchmark", labels, datasets, options);
    }
  }
});


// Convert number to %
// Select all elements with data-el="negative-reviews"
const negativeReviewsElements = document.querySelectorAll('[data-el="negative-reviews"]');

// Check if there are any elements
if (negativeReviewsElements.length > 0) {
    negativeReviewsElements.forEach(element => {
        // Get the decimal value from the element
        let decimalValue = parseFloat(element.textContent);

        // Ensure the value is a valid number and between 0 and 1
        if (!isNaN(decimalValue) && decimalValue >= 0 && decimalValue <= 1) {
            // Convert to percentage
            let percentageValue = (decimalValue * 100).toFixed(0) + '%';

            // Update the element's text content with the percentage value
            element.textContent = percentageValue;
        } else {
            console.warn('Invalid decimal value for:', element);
        }
    });
}

// Hide insights section if empty
// Select the section with id="insights"
const insightSection = document.getElementById('insights');

// Check if any element inside the section has the class .w-dyn-bind-empty
if (insightSection.querySelector('.w-dyn-bind-empty')) {
    // Hide the section
    insightSection.style.display = 'none';
    console.log('Insight section hidden due to .w-dyn-bind-empty');
}