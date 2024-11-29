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
      threshold: 0.7, // Trigger when the chart is almost fully visible
    }
  );
  observer.observe(target);
}


// Chart 1: Sentiment Overtime Line Chart with Filled Backgrounds
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
        backgroundColor: "rgba(250, 234, 255, 0.5)", // Semi-transparent fill
        borderColor: "rgb(250, 234, 255)", // Line color
        borderWidth: 2,
        fill: true, // Enable fill under the line
        tension: 0.4, // Smooth curves
      },
      {
        label: "Neutral",
        data: neutralData,
        backgroundColor: "rgba(245, 212, 255, 0.5)", // Semi-transparent fill
        borderColor: "rgb(245, 212, 255)", // Line color
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Negative",
        data: negativeData,
        backgroundColor: "rgba(203, 85, 239, 0.5)", // Semi-transparent fill
        borderColor: "rgb(203, 85, 239)", // Line color
        borderWidth: 2,
        fill: true,
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
        label: "Average Score Per Topic", // Single overarching label
        data: dataValues,
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
          position: "bottom",
          labels: { font: { family: "Inter Tight" } },
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

// Chart 4: Sub-Categories Stacked Horizontal Bar Chart
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
    console.log("Transforming data for stacked bar chart...");

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
      indexAxis: "y", // Horizontal bar chart
      plugins: {
        legend: {
          display: false, // Hide the legend
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
            stepSize: 10, // Gradations in increments of 10
            font: {
              family: "Inter Tight",
              size: 12,
            },
          },
          stacked: true, // Stack the bars
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
            maxRotation: 45, // Rotate labels to save space
            minRotation: 20, // Minimum rotation angle
          },
          stacked: true, // Stack the bars
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

    console.log("Creating chart with options:", options);

    createChart("bar", "sub-categories", mainCategories, datasets, options);
  }
});

// Chart 5: Industry Benchmark Radar Chart
observeChart("industry-benchmark", () => {
  console.log("Initializing Industry Benchmark radar chart...");

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
    console.log("Transforming data for radar chart...");

    // Extract labels (topics) and datasets for company and industry
    const labels = parsedData.map((item) => item.key.replace(/_/g, " ")); // Replace underscores with spaces for readability
    const companyRatings = parsedData.map(
      (item) => JSON.parse(item.value).company_avg_topic_rating
    );
    const industryRatings = parsedData.map(
      (item) => JSON.parse(item.value).industry_avg_topic_rating
    );

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

    console.log("Final datasets:", datasets);

    const options = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: "top",
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
            backdropColor: 'transparent', // Remove background from tick numbers
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

    console.log("Creating radar chart with options:", options);

    createChart("radar", "industry-benchmark", labels, datasets, options);
  }
});