/****************************
 *
 * Global Functions
 *
 ****************************/

// Shared Color Palette
const colorPalette = ["#faeaff", "#f5d4ff", "#cb55ef", "#6f0c86", "#db90ff", "#9c49eb", "#6007c3"];

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
          "#C652E7", // Positive
          "#FAE7FE", // Negative
          "#D889FA", // Neutral
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


// Chart: Sub-Categories Stacked Vertical Bar Chart
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
    const categoryTotals = [];

    parsedData.forEach((category, index) => {
      let categoryTotal = 0; // Track total value per category
      category.value.forEach((subCategory) => {
        // Parse the sub-category object
        const parsedSubCategory = JSON.parse(subCategory);
        const [subCategoryKey, subCategoryValue] = Object.entries(parsedSubCategory)[0];

        categoryTotal += subCategoryValue; // Accumulate category total

        // Ensure the sub-category is tracked globally for consistent order
        if (!allSubCategories[subCategoryKey]) {
          allSubCategories[subCategoryKey] = [];
        }

        // Fill missing data for other categories with 0 to ensure proper stacking
        allSubCategories[subCategoryKey][index] = subCategoryValue || 0;
      });
      categoryTotals.push({ label: mainCategories[index], total: categoryTotal });
    });

    // Sort categories by total descending to find the top 3
    const topNegativeCategories = categoryTotals
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);

    // Generate the dynamic text with "and" for the last item
    const topNegativeLabels = topNegativeCategories.map((category) => category.label);
    const dynamicText =
      topNegativeLabels.length > 1
        ? `These topics ${topNegativeLabels.slice(0, -1).join(", ")} and ${topNegativeLabels.slice(-1)} are driving the most negative reviews. Hover over each bar to see more details.`
        : `This topic ${topNegativeLabels[0]} is driving the most negative reviews. Hover over the bar to see more details.`;

    // Insert the text into the element with ID "negative-text"
    const negativeTextElement = document.querySelector("#negative-text");
    if (negativeTextElement) {
      negativeTextElement.textContent = dynamicText;
    }

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

    // Create the chart
    const chartInstance = new Chart(
      document.getElementById("sub-categories").getContext("2d"),
      {
        type: "bar",
        data: { labels: mainCategories, datasets },
        options,
      }
    );

    // Display a default tooltip for the first bar
    chartInstance.options.plugins.tooltip.enabled = true; // Ensure tooltips are enabled
    chartInstance.update();

    chartInstance.tooltip.setActiveElements(
      [{ datasetIndex: 0, index: 0 }], // Tooltip for the first bar
      { x: 0, y: 0 } // Tooltip position (defaults to the first bar)
    );
    chartInstance.tooltip.update();
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

// Fake chart
// Chart: Sub-Categories Stacked Vertical Bar Chart
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

    // Create the chart
    const chartInstance = new Chart(
      document.getElementById("sub-categories").getContext("2d"),
      {
        type: "bar",
        data: { labels: mainCategories, datasets },
        options,
      }
    );

    // Display a default tooltip for the first bar
    chartInstance.options.plugins.tooltip.enabled = true; // Ensure tooltips are enabled
    chartInstance.update();

    chartInstance.tooltip.setActiveElements(
      [{ datasetIndex: 0, index: 0 }], // Tooltip for the first bar
      { x: 0, y: 0 } // Tooltip position (defaults to the first bar)
    );
    chartInstance.tooltip.update();
  }
});


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
//           titleFont: { family: "Inter Tight", size: 12 },
//           bodyFont: { family: "Inter Tight", size: 12 },
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
//           titleFont: { family: "Inter Tight", size: 12 },
//           bodyFont: { family: "Inter Tight", size: 12 },
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
//               size: 12,
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