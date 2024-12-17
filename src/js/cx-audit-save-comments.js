/****************************
 *
 * Global Functions
 *
 ****************************/


// // Hide insights section if empty
// // Select the section with id="insights"
// const insightSection = document.getElementById('insights');

// // Check if any element inside the section has the class .w-dyn-bind-empty
// if (insightSection.querySelector('.w-dyn-bind-empty')) {
//     // Hide the section
//     insightSection.style.display = 'none';
//     console.log('Insight section hidden due to .w-dyn-bind-empty');
// }


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


/****************************
 *
 * Playground
 *
 ****************************/



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