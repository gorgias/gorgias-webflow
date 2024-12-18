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


// Replace data-industry and data-score spans with their respective attribute values
// Script to replace the text of elements with `data-industry` and `data-score` attributes
document.querySelectorAll('[data-industry]').forEach(element => {
  const industryText = element.getAttribute('data-industry');
  if (industryText) {
    element.textContent = industryText;
  }
});

document.querySelectorAll('[data-score]').forEach(element => {
  const scoreText = element.getAttribute('data-score');
  if (scoreText) {
    element.textContent = scoreText;
  }
});


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


// Recommendations Mapping
const recommendations = {
  "Product Quality": "Use ticket trend analysis to identify recurring issues and notify your product or manufacturing teams. Reduces complaint volume by 20–30%, improving satisfaction and lowering resource strain.",
  "Customer Service": "Equip human and AI agents with customer profiles pulling data from each tool to resolve tickets faster, reducing support costs by 30–40% and improving loyalty.",
  "Delivery Shipping": "Set up real-time order tracking with proactive updates, preventing 57% of customers from abandoning the brand post-purchase.",
  "Returns Refunds": "Automate self-serve return processes with instant refunds or exchanges, increasing repeat purchases by 60% through a trusted process.",
  "Pricing Value For Money": "Staff AI or humans on live support to personalize recommendations to improve perceived value and drive upsells, or offer price-matching via discounts.",
  "Website user experience": "Integrate AI-driven search and product matching, reducing customer frustration and increasing conversions by up to 42%.",
  "Order Accuracy": "Connect your support tools and AI-powered agents with your order management system to quickly correct any inaccuracies in orders.",
  "Product Variety": "Create systems to turn out-of-stock complaints and product requests into newsletter signups for back-in-stock notifications and retargeting campaigns.",
  "Company Reputation": "Integrate your support system with reviews platform to address negative feedback promptly.",
  "Communication & Information": "Build your self-service and AI support offerings to make information accessible across platforms with a 0-minute wait time.",
  "Packaging": "Use ticket trend analysis to gather feedback about packaging quality and share it with your operations team to optimize for sustainability or better product protection.",
  "Trust Security": "Share in-depth knowledge on your website and internally to promote certifications, safe product usage, and clean materials.",
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
          titleFont: { family: "Inter Tight", size: 12 },
          bodyFont: { family: "Inter Tight", size: 12 },
        },
      },
      scales: {
        x: { stacked: true, ticks: { font: { family: "Inter Tight", size: 12 } } },
        y: { stacked: true, ticks: { stepsize: 10, font: { family: "Inter Tight", size: 12 } } },
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

// Function to format categories as bullet list or placeholder message
const formatAsBulletList = (categories) => {
  return categories.length > 0
    ? `<ul>${categories.map((category) => `<li class="text-size-medium">${category}</li>`).join("")}</ul>`
    : "<p>No categories to display.</p>";
};

// Function to hide a parent block if no categories
const hideIfEmpty = (element, categories) => {
  if (element && categories.length === 0) {
    const parentBlock = element.closest('.industry-comparison-topics');
    if (parentBlock) {
      parentBlock.style.display = "none"; // Hide the block
    }
  }
};

// Insert positive categories into data-el="positive-cat"
const positiveCatElement = document.querySelector('[data-el="positive-cat"]');
if (positiveCatElement) {
  positiveCatElement.innerHTML = formatAsBulletList(betterCategories);
  hideIfEmpty(positiveCatElement, betterCategories); // Hide block if empty
}

// Insert negative categories into data-el="negative-cat"
const negativeCatElement = document.querySelector('[data-el="negative-cat"]');
if (negativeCatElement) {
  negativeCatElement.innerHTML = formatAsBulletList(worseCategories);
  hideIfEmpty(negativeCatElement, worseCategories); // Hide block if empty
}

    // Chart generation
    if (labels.length <= 2) {
      console.log("Insufficient data for radar chart. Generating a Polar Area Chart...");

      const datasets = [
        {
          data: companyRatings,
          backgroundColor: colorPalette.slice(0, companyRatings.length),
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
        scales: { r: { ticks: { display: false } } },
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


// Slider Configuration
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

        // Declare `isPlaying` at the top of the function
        let isPlaying = false;

        // Pagination bullet progress and visuals
        const paginationBullets = document.querySelectorAll('.cx--audit_pagination_bullet');

        // Helper to update bullet visuals
        const updateBulletVisuals = () => {
          paginationBullets.forEach((bullet, index) => {
            if (index <= auditSlider.activeIndex) {
              bullet.classList.add('filled'); // Mark as filled for past and current slides
            } else {
              bullet.classList.remove('filled'); // Remove fill for future slides
            }

            bullet.classList.toggle(
              'is-bullet-active',
              index === auditSlider.activeIndex
            );

            // Apply the `autoplay` class for the active bullet
            if (index === auditSlider.activeIndex && isPlaying) {
              bullet.classList.add('autoplay');
            } else {
              bullet.classList.remove('autoplay');
            }
          });
        };

        // Initial setup for bullets
        updateBulletVisuals();

        // Select both is-icon-autoplay elements for toggling
        const icons = document.querySelectorAll('.is-icon-autoplay');

        // Helper function to update icon visibility
        const updateIcons = (isPlaying) => {
          icons.forEach((icon) => {
            if (icon.classList.contains('is-play')) {
              // Show play icon when not playing
              icon.classList.toggle('is-hidden', isPlaying);
            } else {
              // Show pause icon when playing
              icon.classList.toggle('is-hidden', !isPlaying);
            }
          });
        };

        // Initial icon setup
        updateIcons(false);

        // Hash navigation and analytics tracking
        let previousHash = null; // Initialize previousHash variable
        auditSlider.on('slideChange', () => {
          updateBulletVisuals();

          const currentSlide = auditSlider.slides[auditSlider.activeIndex];
          const currentHash = currentSlide.getAttribute('data-hash');

          if (currentHash) {
            console.log(`Current hash: #${currentHash}`);
            // Update the URL hash without reloading
            history.pushState(null, null, `#${currentHash}`);

            console.log(`Previous hash: #${previousHash || 'None'}`);
            console.log(`URL hash updated to: #${currentHash}`);

            // Track slide change event with analytics
            if (analytics) {
              analytics.track('Slide changed', {
                'slider-name': 'cx-audit',
                'current-slide': `${currentHash}`,
                'previous-slide': `${previousHash}`,
              });
            }

            previousHash = currentHash;
          }
        });

        // Autoplay toggle logic
        const toggleButton = document.getElementById('toggle-autoplay');
        if (!toggleButton) {
          console.error('Toggle button with ID "toggle-autoplay" not found!');
          return;
        }

        toggleButton.addEventListener('click', () => {
          console.log(
            `Autoplay state before toggle: ${isPlaying ? 'Playing' : 'Paused'}`
          );

          const isLastSlide = auditSlider.activeIndex === auditSlider.slides.length - 1;

          if (isPlaying) {
            auditSlider.autoplay.stop();
            console.log('Autoplay stopped.');
          } else {
            if (isLastSlide) {
              console.log(
                'Autoplay cannot be started because the current slide is the last slide.'
              );
              updateIcons(false); // Ensure play icon is visible on the last slide
              return; // Prevent autoplay from starting
            }
            auditSlider.autoplay.start();
            console.log('Autoplay started.');
          }

          isPlaying = !isPlaying;
          updateBulletVisuals(); // Update bullet visuals when autoplay is toggled
          updateIcons(isPlaying); // Update the icons when autoplay state changes
          console.log(
            `Autoplay state after toggle: ${isPlaying ? 'Playing' : 'Paused'}`
          );
        });

        auditSlider.on('slideChange', () => {
          const isLastSlide = auditSlider.activeIndex === auditSlider.slides.length - 1;
          if (isLastSlide && isPlaying) {
            console.log('Reached the last slide. Stopping autoplay.');
            auditSlider.autoplay.stop();
            isPlaying = false;
            updateBulletVisuals();
            updateIcons(false); // Ensure play icon is visible
          }
        });

        // Handle pagination clicks without breaking autoplay
        paginationBullets.forEach((bullet, index) => {
          bullet.addEventListener('click', () => {
            console.log(
              `Pagination bullet clicked for slide ${index}. Current slide: ${auditSlider.activeIndex}`
            );

            // Go to the clicked slide
            auditSlider.slideTo(index);

            // Ensure autoplay continues (if it was already playing)
            if (isPlaying) {
              auditSlider.autoplay.start();
              console.log('Autoplay resumed after pagination click.');
            }
          });
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
              size: 12,
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
              size: 12,
            },
            stepsize: 10, // Increment ticks by 10
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
        data: { labels: mainCategories, datasets },
        options,
      }
    );

    console.log("Grouped Bar Chart initialized.");
  }
});