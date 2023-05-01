<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/@splidejs/splide@3.2.2/dist/css/splide-core.min.css">
<script src="https://cdn.jsdelivr.net/npm/@splidejs/splide@3.2.2/dist/js/splide.min.js"></script>

<script>
  var splide = new Splide( '.pages-template_logo-slider' );
  var bar    = splide.root.querySelector( '.my-slider-progress-bar' );
  
  splide.on( 'mounted move', function () {
  var end  = splide.Components.Controller.getEnd() + 1;
  var rate = Math.min( ( splide.index + 1 ) / end, 1 );
  bar.style.width = String( 100 * rate ) + '%';
  } );
 
  splide.mount();
  

function slider() {

let splides = $('.pages-template_logo-slider');
for ( let i = 0, splideLength = splides.length; i < splideLength; i++ ) {
	new Splide( splides[ i ], {
  // Desktop on down
	perPage: 3.5,
	perMove: 1,
  focus: 0, // 0 = left and 'center' = center
  type: 'slide', // 'loop' or 'slide'
  gap: '40px', // space between slides
  arrows: false, // 'slider' or false
  pagination: false, // 'slider' or false
  speed : 600, // transition speed in miliseconds
  drag: true,
  wheel:true,
  //dragAngleThreshold: 30, // default is 30
  autoWidth: false, // for cards with differing widths
  rewind : false, // go back to beginning when reach end
  rewindSpeed : 400,
  waitForTransition : false,
  updateOnMove : true,
  trimSpace: true, // true removes empty space from end of list
  breakpoints: {
		991: {
    	// Tablet
			perPage: 3.5,
      gap: '72px',
		},
    767: {
    	// Mobile Landscape
			perPage: 2.5,
      gap: '20px',
		},
    479: {
    	// Mobile Portrait
			perPage: 2.5,
      gap: '20px',
		}
	}
} ).mount();
}

}
slider();

</script>
<style>

.splide__track {
  overflow: visible;
}

.splide__arrows, .splide__pagination {
display: none;
}

.my-slider-progress {
  background: #2e2a27;
}

.my-slider-progress-bar {
  background: #B3B641;
  height: 4px;
  transition: width 400ms ease;
  width: 0;
}
</style>