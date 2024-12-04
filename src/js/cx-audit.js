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
          ticks: {
            display: true, // Enable labels for each bar
            font: {
              family: "Inter Tight",
              size: 12,
            },
          },
        },
        y: {
          min: 0,
          max: 5,
          ticks: {
            font: {
              family: "Inter Tight",
              size: 12,
            },
          },
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
    parsedData = parseJSONWithCorrection(
      rawContent.startsWith("[") && rawContent.endsWith("]") ? rawContent : `[${rawContent}]`
    ); // Add brackets if missing
    console.log("Parsed data:", parsedData);
  } catch (error) {
    console.error("Unable to parse industry benchmark data:", error);
    return;
  }

  if (parsedData) {
    // Variables to store better and worse performing categories
    const betterCategories = [];
    const worseCategories = [];

    // Process data
    parsedData.forEach((item) => {
      const parsedValue = JSON.parse(item.value);
      const companyRating = parsedValue.company_avg_topic_rating;
      const industryRating = parsedValue.industry_avg_topic_rating;

      if (companyRating > industryRating) {
        betterCategories.push(item.key.replace(/_/g, " ").toLowerCase().replace(/(?:^|\s)\S/g, (match) => match.toUpperCase()));
      } else if (companyRating < industryRating) {
        worseCategories.push(item.key.replace(/_/g, " ").toLowerCase().replace(/(?:^|\s)\S/g, (match) => match.toUpperCase()));
      }
    });

    // Original text
    const originalText = "See how your brand stacks up against competitors. Identify strengths and areas where you can outperform the industry standard to stay ahead of the curve.";

    let finalMessage;

    // Conditional Text Generation
    if (betterCategories.length === 0 && worseCategories.length > 0) {
      // Case 1: The industry performs better everywhere
      console.log("Industry performs better everywhere. Keeping original text.");
      finalMessage = originalText;
    } else if (betterCategories.length > 0 && worseCategories.length === 0) {
      // Case 2: The company outperforms the industry in all categories
      console.log("Company outperforms the industry in all categories. Adding congratulatory message.");
      finalMessage = `${originalText} Congratulations! Your brand is outperforming the industry in all key areas. Keep up the excellent work!`;
    } else {
      // Case 3: The company does better in some domains but worse in others
      console.log("Company does better in some categories and worse in others. Highlighting strengths and weaknesses.");
      const betterMessage = `You’re performing better than the industry on ${betterCategories.join(", ")}`;
      const worseMessage = `but you struggle with ${worseCategories.join(", ")} categories.`;
      finalMessage = `${betterMessage} ${worseMessage}`;
    }

    // Update the DOM with the final message
    console.log("Final Message:", finalMessage);
    $("#dynamic-message").text(finalMessage);

    // Chart Generation Logic
    const labels = parsedData.map((item) =>
      item.key.replace(/_/g, " ").toLowerCase().replace(/(?:^|\s)\S/g, (match) => match.toUpperCase())
    );
    const companyRatings = parsedData.map((item) => JSON.parse(item.value).company_avg_topic_rating);
    const industryRatings = parsedData.map((item) => JSON.parse(item.value).industry_avg_topic_rating);

    if (labels.length <= 2) {
      console.log("Insufficient data for radar chart. Generating a Polar Area Chart...");

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