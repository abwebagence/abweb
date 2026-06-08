document.addEventListener('DOMContentLoaded', function () {
	// // parallaxInstance
	// var scene = document.getElementById('scene');
	// var parallaxInstance = new Parallax(scene);

	// Hero Particles
	if (document.querySelector('#heroParticles')) {
		particlesJS.load(
			'heroParticles',
			document.querySelector('#heroParticles').dataset.config
		);
	}
	// Hero Particles
	if (document.querySelector('#heroParticles2')) {
		particlesJS.load(
			'heroParticles2',
			document.querySelector('#heroParticles2').dataset.config
		);
	}
	// Hero Particles
	if (document.querySelector('#heroParticles3')) {
		particlesJS.load(
			'heroParticles3',
			document.querySelector('#heroParticles3').dataset.config
		);
	}

	if (document.querySelector('.intro')) {
		var intro = lottie.loadAnimation({
			container: document.querySelector('.intro'),
			renderer: 'svg',
			loop: false,
			autoplay: true,
			path: document.querySelector('.intro').dataset.anim,
		});
	}

	if (document.querySelector('.intro-mobile')) {
		var intromobile = lottie.loadAnimation({
			container: document.querySelector('.intro-mobile'),
			renderer: 'svg',
			loop: false,
			autoplay: true,
			path: document.querySelector('.intro-mobile').dataset.anim,
		});
	}

	// Select the Lottie containers
	const lottieContainers = document.querySelectorAll('.lottie-container');

	// Iterate over each Lottie container
	lottieContainers.forEach(function (lottieContainer) {
		// Define the animation using Lottie
		var lottieAnimation = lottie.loadAnimation({
			container: lottieContainer,
			path: lottieContainer.dataset.anim,
			renderer: 'svg',
			loop: false,
			autoplay: false,
		});

		// Create a timeline for the animation
		var animationTimeline = gsap.timeline({ paused: true });

		// Add the Lottie animation to the timeline
		animationTimeline.add(function () {
			lottieAnimation.play();
		});

		// Use ScrollTrigger to trigger the animation when the element comes into view
		// gsap.registerPlugin(ScrollTrigger);

		ScrollTrigger.create({
			scroller: '#body-wrap',
			trigger: lottieContainer,
			start: 'top 90%',
			// markers: true,
			// end: 'bottom center',
			onEnter: function () {
				console.log('onEnter play ');
				// lottieAnimation.play();
				animationTimeline.play();
			},
			onLeave: function () {
				console.log('onLeave pause');

				animationTimeline.pause();
			},
			onEnterBack: function () {
				console.log('onEnterBack play');
				lottieAnimation.play();
				animationTimeline.play();
			},
			onLeaveBack: function () {
				console.log('onLeaveBack pause');

				animationTimeline.pause();
			},
		});
	});

	// Search Bar Text Animations
	/*
	let searchBarTextString = 'https://netzeroneedsnuclear.com/';
	let textString = '';
	let currentStringIndex = 0;
	let isTextDone = false;

	const searchBarText = document.querySelector('.searchBarText');
	const searchBarTextAnimations = () => {
		//console.log('search');

		if (isTextDone == false) {
			textString += searchBarTextString[currentStringIndex];
			searchBarText.innerText = textString;
			currentStringIndex++;

			if (currentStringIndex < searchBarTextString.length) {
				setTimeout(() => {
					searchBarTextAnimations();
				}, 100);
			} else {
				isTextDone = true;
			}
		} else {
			textString = '';
			searchBarText.innerText = textString;
			currentStringIndex = 0;
			isTextDone = false;
			searchBarTextAnimations();
		}
	};

	ScrollTrigger.create({
		scroller: '#body-wrap',
		trigger: '.showcase1Div',
		start: () => window.innerHeight * 0.25 + ' bottom',
		onEnter: searchBarTextAnimations,
	});
	*/
	
});

// const lightbox = GLightbox({
// 	touchNavigation: true,
// 	loop: true,
// 	autoplayVideos: true,
// });

var images = document.querySelectorAll('.parallax-image');
new simpleParallax(images, {
	customContainer: document.querySelector('#body-wrap'),
});

// var images = document.querySelectorAll('.parallax-image');
// new simpleParallax(images);

document.addEventListener('DOMContentLoaded', function () {
	// Apply parallax effect to the first image (move up)
	new simpleParallax(document.querySelectorAll('.parallax-up'), {
		orientation: 'up',
		scale: 1.3, // Adjust as needed
		overflow: true, // Allow image to move beyond its container
		customContainer: document.querySelector('#body-wrap'),
	});

	// Apply parallax effect to the second image (move down)
	new simpleParallax(document.querySelectorAll('.parallax-down'), {
		orientation: 'down',
		scale: 1.3, // Adjust as needed
		overflow: true, // Allow image to move beyond its container
		customContainer: document.querySelector('#body-wrap'),
	});
	new simpleParallax(document.querySelectorAll('.parallax-up-more'), {
		orientation: 'up',
		scale: 3, // Adjust as needed
		overflow: true, // Allow image to move beyond its container
		customContainer: document.querySelector('#body-wrap'),
	});

	// Apply parallax effect to the second image (move down)
	new simpleParallax(document.querySelectorAll('.parallax-down-more'), {
		orientation: 'down',
		scale: 3, // Adjust as needed
		overflow: true, // Allow image to move beyond its container
		customContainer: document.querySelector('#body-wrap'),
	});
});

var move = document.querySelectorAll('.move-right');
new simpleParallax(move, {
	orientation: 'right',
	customContainer: document.querySelector('#body-wrap'),
	// scale: 3.8,
});

var moveleft = document.querySelectorAll('.move-left');
new simpleParallax(moveleft, {
	orientation: 'left',
	customContainer: document.querySelector('#body-wrap'),
});

// ------ video image swap ------
/*
document.addEventListener('DOMContentLoaded', function () {
	const videoContainer = document.querySelector('.video-container');
	const playButton = document.querySelector('.play-button');
	const video = document.querySelector('.video');

	playButton.addEventListener('click', function () {
		playButton.style.display = 'none'; // Hide the play button
		video.style.display = 'block'; // Show the video
		video.play(); // Start playing the video
	});
});
*/

// ------ wireframeCarousel ------
const wireframeCarousel = new Swiper('.wireframe-section .swiper', {
	spaceBetween: 10,
	slidesPerView: 1,
	centeredSlides: true,
	breakpoints: {
		768: {
			slidesPerView: 2,
			spaceBetween: 10,
		},
		1200: {
			slidesPerView: 2.5,
			spaceBetween: 10,
		},
	},
	autoplay: {
		delay: 1900,
		speed: 1400,
	},
	loop: true,
	fadeEffect: {
		crossFade: !0,
	},
});

window.addEventListener('load', function () {
	setTimeout(function () {
		document.body.classList.add('loaded');
	}, 800);
});

// Gsap trigger banner
// Initialize ScrollTrigger
// gsap.registerPlugin(ScrollTrigger);

// Define the animation for each row
function animateRow(row, startX) {
	gsap.fromTo(
		row,
		{ x: startX },
		{
			x: 0,
			duration: 3, // Increase the duration to 3 seconds
			ease: 'power1.out',
			scrollTrigger: {
				trigger: row,
				start: 'top center',
				end: '+=500',
				scrub: true,
			},
		}
	);
}

function animateElementsDesktop() {
	var elements = document.querySelectorAll('.anim-move');

	gsap.to(elements, {
		opacity: 1,
		y: 0,
		duration: 0.5,
		stagger: 0.2,
		scrollTrigger: {
			trigger: elements,
			start: 'top 80%' /* Adjust the start position when the animation should begin */,
			end: 'bottom 80%' /* Adjust the end position when the animation should end */,
			scrub: true,
			// markers: true,
		},
	});
}

function animateElements() {
	var elements = document.querySelectorAll('.anim-move-icons');

	gsap.to(elements, {
		opacity: 1,
		y: 0,
		duration: 0.5,
		stagger: 0.2,
		scrollTrigger: {
			trigger: elements,
			start: 'top 80%' /* Adjust the start position when the animation should begin */,
			end: 'bottom 80%' /* Adjust the end position when the animation should end */,
			scrub: true,
			// markers: true,
		},
	});
}

// gsap.registerPlugin(ScrollTrigger);

if (window.matchMedia('(min-width: 768px)').matches) {
	animateElementsDesktop();
	animateElements();
} else {
	console.log('mobile');
}

const interactiveJS = () => {
	const imageSliders = document.querySelectorAll('.imageSlider');
	for (let i = 0; i < imageSliders.length; i++) {
		imageSliders[i].addEventListener('mouseenter', () => {
			gsap.to(imageSliders[i], {
				duration: 0.5,
				boxShadow: '0 0 0 1.3rem #37c87d, 0 0 5rem 0.25rem #37c87d',
				scale: 1.01,
			});
		});
		imageSliders[i].addEventListener('mouseleave', () => {
			gsap.to(imageSliders[i], {
				duration: 0.5,
				boxShadow: '0 0 0 1.2rem #37c87d',
				scale: 1,
			});
		});
	}

	const imageSliderColumnsAnimations = () => {
		gsap.to('.imageSliderColumns', { duration: 0, rotation: 30 });
	};
	imageSliderColumnsAnimations();

	gsap.fromTo(
		'#imageSlider1',
		{ y: 250 * Math.cos(Math.PI / 6), x: -250 * Math.sin(Math.PI / 6) },
		{
			scrollTrigger: {
				scroller: '#body-wrap',
				trigger: '.imageSlidersSection',
				start: () => window.innerHeight * 0 + ' bottom',
				end: () => window.innerHeight * 1 + ' top',
				scrub: true,
			},
			y: -250 * Math.cos(Math.PI / 6),
			x: 250 * Math.sin(Math.PI / 6),
			ease: 'none',
		}
	);
	gsap.fromTo(
		'#imageSlider2',
		{ y: -250 * Math.cos(Math.PI / 6), x: 250 * Math.sin(Math.PI / 6) },
		{
			scrollTrigger: {
				scroller: '#body-wrap',
				trigger: '.imageSlidersSection',
				start: () => window.innerHeight * 0 + ' bottom',
				end: () => window.innerHeight * 1 + ' top',
				scrub: true,
			},
			y: 250 * Math.cos(Math.PI / 6),
			x: -250 * Math.sin(Math.PI / 6),
			ease: 'none',
		}
	);
	gsap.fromTo(
		'#imageSlider3',
		{ y: 250 * Math.cos(Math.PI / 6), x: -250 * Math.sin(Math.PI / 6) },
		{
			scrollTrigger: {
				scroller: '#body-wrap',
				trigger: '.imageSlidersSection',
				start: () => window.innerHeight * 0 + ' bottom',
				end: () => window.innerHeight * 1 + ' top',
				scrub: true,
			},
			y: -250 * Math.cos(Math.PI / 6),
			x: 250 * Math.sin(Math.PI / 6),
			ease: 'none',
		}
	);
	gsap.fromTo(
		'#imageSlider4',
		{ y: -250 * Math.cos(Math.PI / 6), x: 250 * Math.sin(Math.PI / 6) },
		{
			scrollTrigger: {
				scroller: '#body-wrap',
				trigger: '.imageSlidersSection',
				start: () => window.innerHeight * 0 + ' bottom',
				end: () => window.innerHeight * 1 + ' top',
				scrub: true,
			},
			y: 250 * Math.cos(Math.PI / 6),
			x: -250 * Math.sin(Math.PI / 6),
			ease: 'none',
		}
	);
	gsap.fromTo(
		'#imageSlider1',
		{ y: 250 * Math.cos(Math.PI / 6), x: -250 * Math.sin(Math.PI / 6) },
		{
			scrollTrigger: {
				scroller: '#body-wrap',
				trigger: '.imageSlidersSection',
				start: () => window.innerHeight * 0 + ' bottom',
				end: () => window.innerHeight * 1 + ' top',
				scrub: true,
			},
			y: -250 * Math.cos(Math.PI / 6),
			x: 250 * Math.sin(Math.PI / 6),
			ease: 'none',
		}
	);
	gsap.fromTo(
		'#imageSlider2',
		{ y: -250 * Math.cos(Math.PI / 6), x: 250 * Math.sin(Math.PI / 6) },
		{
			scrollTrigger: {
				scroller: '#body-wrap',
				trigger: '.imageSlidersSection',
				start: () => window.innerHeight * 0 + ' bottom',
				end: () => window.innerHeight * 1 + ' top',
				scrub: true,
			},
			y: 250 * Math.cos(Math.PI / 6),
			x: -250 * Math.sin(Math.PI / 6),
			ease: 'none',
		}
	);
	gsap.fromTo(
		'#imageSlider3',
		{ y: 250 * Math.cos(Math.PI / 6), x: -250 * Math.sin(Math.PI / 6) },
		{
			scrollTrigger: {
				scroller: '#body-wrap',
				trigger: '.imageSlidersSection',
				start: () => window.innerHeight * 0 + ' bottom',
				end: () => window.innerHeight * 1 + ' top',
				scrub: true,
			},
			y: -250 * Math.cos(Math.PI / 6),
			x: 250 * Math.sin(Math.PI / 6),
			ease: 'none',
		}
	);
	gsap.fromTo(
		'#imageSlider4',
		{ y: -250 * Math.cos(Math.PI / 6), x: 250 * Math.sin(Math.PI / 6) },
		{
			scrollTrigger: {
				scroller: '#body-wrap',
				trigger: '.imageSlidersSection',
				start: () => window.innerHeight * 0 + ' bottom',
				end: () => window.innerHeight * 1 + ' top',
				scrub: true,
			},
			y: 250 * Math.cos(Math.PI / 6),
			x: -250 * Math.sin(Math.PI / 6),
			ease: 'none',
		}
	);
	gsap.to('.marqueeSliderDiv', {
		scrollTrigger: {
			scroller: '#body-wrap',
			trigger: '.infiniteMarquee',
			start: () => window.innerHeight * 0 + ' bottom',
			end: () => window.innerHeight * 0.8 + ' top',
			scrub: 1,
		},
		x: -window.innerWidth * 1.5,
		ease: 'none',
	});
	gsap.to('.marqueeSliderDivBanner', {
		scrollTrigger: {
			scroller: '#body-wrap',
			trigger: '.infiniteMarqueeBanner',
			start: () => window.innerHeight * 0 + ' bottom',
			end: () => window.innerHeight * 0.8 + ' top',
			scrub: 1,
		},
		x: -window.innerWidth * 1.5,
		ease: 'none',
	});
};
interactiveJS();


document.addEventListener("DOMContentLoaded", function () {

    //set scrolled flag
    var didScroll = false;
    var lastScrollTop = 0;
    var scrollDirection = 'DOWN';
    
    // On scroll, update the scroll flag and calculate direction
    document.querySelector('#body-wrap').addEventListener(
      'scroll',
      (evt) => {
        didScroll = true;
      },
      {
        capture: true,
        passive: true,
      }
    );
    
    // Function to handle scroll direction and sticky header logic
    function stickyHeader() {
      setInterval(function () {
        if (didScroll) {
          didScroll = false;
    
          // Get the current scroll position
          var scrollAmount = document.querySelector('#body-wrap').scrollTop;
    
          // Detect scroll direction
          if (scrollAmount > lastScrollTop) {
            scrollDirection = 'DOWN';
            document.body.classList.add('scrolling-down');
            document.body.classList.remove('scrolling-up');
          } else if (scrollAmount < lastScrollTop) {
            scrollDirection = 'UP';
            document.body.classList.add('scrolling-up');
            document.body.classList.remove('scrolling-down');
          }
          lastScrollTop = scrollAmount <= 0 ? 0 : scrollAmount; // Ensure no negative scroll values
    
          // Handle sticky header logic
          if (scrollAmount >= document.querySelector('#body-wrap').offsetHeight / 1.7) {
            document.body.classList.add('scrolled');
            if (document.querySelector('#cookieconsent')) {
              document.querySelector('#cookieconsent').classList.add('hide');
            }
          } else {
            document.body.classList.remove('scrolled');
          }
        }
      }, 250);
    }
    
    // Initialize sticky header handling
    stickyHeader();
});