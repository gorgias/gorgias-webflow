$(document).ready(function () {
    // Select the testimonial video element
    const videoElement = $('[data-el="testimonial-video"]');

    // Select the target container
    const videoNest = $('[data-el="video-nest"]');

    // Move the video into the target container and ensure it displays as block
    if (videoElement.length && videoNest.length) {
        videoElement.css("display", "block").appendTo(videoNest);
    }
});