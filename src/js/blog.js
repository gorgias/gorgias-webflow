
// add an anchor for each h2 that start at 0 and increment by 1
/*
$('.w-richtext').find('h2').each(function(index) {
    var set = $(this).nextUntil("h2").addBack();
    var title = $(this).text();
    set.wrapAll("<div id='" + index + "'/>");  
    $('.c--post__sidebar').append( "<a href='#" + index + "' class='c--post__sidebar__link'>" + title + "</a>" );
});
*/

// open link in a new tab automatically */
const links = document.querySelectorAll('.blogpost_wrapper-content a')
links.forEach(link => link.target = "_blank")

// Zoom on images -->
const images = Array.from(document.querySelectorAll(".blogpost_wrapper-content img"));
if ($(window).width() >= 991) {
    images.forEach(img => {
        mediumZoom(img, {
            margin: 0, /* The space outside the zoomed image */
            background: "rgba(0, 0, 0, 0.75)", /* The background of the overlay */
            scrollOffset: 40, /* The number of pixels to scroll to close the zoom */
        });
    });
}
