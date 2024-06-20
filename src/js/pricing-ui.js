// Select all radio buttons
const radioButtons = document.querySelectorAll('input[type="radio"]');

// Function to handle the toggle of the active class
function toggleActiveClass() {
  // Remove the active class from all .billing_toggle-option elements
  document.querySelectorAll(".billing_toggle-option").forEach((option) => {
    option.classList.remove("active");
  });

  // Add the active class to the parent of the checked radio button
  if (this.checked) {
    this.parentElement.classList.add("active");
  }
}

// Attach the change event listener to all radio buttons
radioButtons.forEach((radio) => {
  radio.addEventListener("change", toggleActiveClass);
});

// Trigger the toggle function on page load for the initially checked radio button
document
  .querySelectorAll('input[type="radio"][name="billing"]:checked')
  .forEach((radio) => {
    radio.parentElement.classList.add("active");
  });

// Function to mirror click events
function mirrorClick(sourceSelector, targetSelector) {
  document.querySelector(sourceSelector).addEventListener("click", function () {
    document.querySelector(targetSelector).click();
  });
}

// Mirror clicks from .is-monthly to #monthlyPlan
mirrorClick(".is-monthly", "#monthlyPlan");

// Mirror clicks from .is-yearly to #annualPlan
mirrorClick(".is-yearly", "#annualPlan");

// Function to toggle the display of .summary_alert based on radio button state
function toggleSummaryAlert() {
  const summaryAlert = document.querySelector(".summary_alert");
  const monthlyPlan = document.querySelector("#monthlyPlan");
  const annualPlan = document.querySelector("#annualPlan");

  if (monthlyPlan.checked) {
    summaryAlert.style.display = "flex";
  } else if (annualPlan.checked) {
    summaryAlert.style.display = "none";
  }
}

// Attach change event listeners to radio buttons
document
  .querySelector("#monthlyPlan")
  .addEventListener("change", toggleSummaryAlert);
document
  .querySelector("#annualPlan")
  .addEventListener("change", toggleSummaryAlert);

// Initial check on page load
toggleSummaryAlert();

// Function to mirror click events
function mirrorClick(sourceSelector, targetSelector) {
  document.querySelector(sourceSelector).addEventListener("click", function () {
    document.querySelector(targetSelector).click();
  });
}

// Buttons handling
// Mirror clicks from [data-button="helpdesk"] to .tab-link_2
mirrorClick('[data-button="helpdesk"]', ".tab-link_2");

// Mirror clicks from [data-button="automate"] to .tab-link_3
mirrorClick('[data-button="automate"]', ".tab-link_3");
mirrorClick('[data-button="automate-skip"]', ".tab-link_3");

$(".tab-link_2").on("click", function () {
  document.querySelector('[data-summary="automate"]').style.display = "flex";
});

// Features list handling
// Open list
$(".full-list-trigger").on("click", function () {
  $(".features_modal-list").addClass("active");
});

// Close list
$(".close-list-trigger").on("click", function () {
  $(".features_modal-list").removeClass("active");
});

$(".active-modal-trigger").on("click", function () {
  $(".features_modal-list").removeClass("active");
});

// ROI calc modal
// Open modal
$(".calculate-trigger").on("click", function () {
  $(".calculate_modal").addClass("active");
});

// Close modal
$(".close-calculate-trigger").on("click", function () {
  $(".calculate_modal").removeClass("active");
});

$(".active-modal-trigger").on("click", function () {
  $(".calculate_modal").removeClass("active");
});

// Summary handling
// Automate summary item
$('[data-button="helpdesk"]').on("click", function () {
  $('[data-summary="automate"]').css("display", "flex");
});

// Voice summary item
$(document).on("click", ".addons_dropdown-link.voice-link", function () {
  $('[data-summary="voice"]').css("display", "flex");
});

// SMS summary item
$(document).on("click", ".addons_dropdown-link.sms-link", function () {
  $('[data-summary="sms"]').css("display", "flex");
});
