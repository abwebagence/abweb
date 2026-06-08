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

// ------ Search Bar Text Animations ------

let searchBarTextString = 'https://avecoeur.com/';
let textString = '';
let currentStringIndex = 0;
let isTextDone = false;

const searchBarText = document.querySelector('.searchBarText');
const searchBarTextAnimations = () => {
	console.log('search');

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

// ------ video image swap ------


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
	pagination: {
		el: '.swiper-pagination',
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

// Gsap library
gsap.registerPlugin(ScrollTrigger);

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

const interactiveJS = () => {
	const imageSliders = document.querySelectorAll('.imageSlider');
	for (let i = 0; i < imageSliders.length; i++) {
		imageSliders[i].addEventListener('mouseenter', () => {
			gsap.to(imageSliders[i], {
				duration: 0.5,
				boxShadow: '0 0 0 0.5rem #54737D, 0 0 5rem 0.25rem #54737D',
				scale: 1.01,
			});
		});
		imageSliders[i].addEventListener('mouseleave', () => {
			gsap.to(imageSliders[i], {
				duration: 0.5,
				boxShadow: '0 0 0 0.1rem #54737D',
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
