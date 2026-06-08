//type out url if in view
var anii = 0;
var txt = 'https://www.man-corp.com';
var speed = 1500;

function typeWriter() {
    setTimeout(()=> {
          if (anii < txt.length) {
            document.getElementById("typeit").innerHTML += txt.charAt(anii);
            anii++;
            setTimeout(typeWriter, speed);
          }
    }
  ,2000);
}

var myElement = document.getElementById('typeit');
var bounding = myElement.getBoundingClientRect();

function elementInViewport() {

    var bounding = myElement.getBoundingClientRect();

    if (bounding.top >= 0 && bounding.left >= 0 && bounding.right <= (window.innerWidth || document.documentElement.clientWidth) && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
        typeWriter();
        
    } else {

        
    }
}

document.getElementById("body-wrap").addEventListener("scroll", elementInViewport);

//


document.addEventListener('DOMContentLoaded', function () {
	// Apply parallax effect to the first image (move up)
	new simpleParallax(document.querySelector('.parallax-up'), {
		orientation: 'up',
		scale: 1.5, // Adjust as needed
		overflow: true, // Allow image to move beyond its container
		customContainer: document.querySelector('#body-wrap'),
	});

	// Apply parallax effect to the second image (move down)
	new simpleParallax(document.querySelector('.parallax-down'), {
		orientation: 'down',
		scale: 1.5, // Adjust as needed
		overflow: true, // Allow image to move beyond its container
		customContainer: document.querySelector('#body-wrap'),
	});
});

var move = document.querySelectorAll('.move-right');
new simpleParallax(move, {
	orientation: 'right',
	customContainer: document.querySelector('#body-wrap'),
	// scale: 1.1,
});

var moveleft = document.querySelectorAll('.move-left');
new simpleParallax(moveleft, {
	orientation: 'left',
	customContainer: document.querySelector('#body-wrap'),
});

function animateGridItems() {
	var gridItems = document.querySelectorAll('.move');
	console.log('animateGridItems');
	gsap.to(gridItems, {
		opacity: 1,
		x: 0,
		duration: 0.5,
		stagger: 0.2,
		scrollTrigger: {
			scroller: document.querySelector('#body-wrap'),
			trigger: gridItems,
			start: 'top 80%',
			end: 'bottom 80%',
			scrub: true,
			// 			markers: true,
		},
	});
}

function animateElements() {
	var elements = document.querySelectorAll('.anim-move');

	console.log('animateElements');
	gsap.to(elements, {
		opacity: 1,
		y: 0,
		duration: 0.5,
		stagger: 0.2,
		scrollTrigger: {
			scroller: document.querySelector('#body-wrap'),
			trigger: elements,
			start: 'top 80%' /* Adjust the start position when the animation should begin */,
			end: 'bottom 80%' /* Adjust the end position when the animation should end */,
			scrub: true,
			// 			markers: true,
		},
	});
}

gsap.registerPlugin(ScrollTrigger);

if (window.matchMedia('(min-width: 768px)').matches) {
	animateGridItems();
	animateElements(); 
} else {
	// Do something else or skip the animation for screens below 768px
}

var images = document.querySelectorAll('.parallax-image');
new simpleParallax(images);

const interactiveJS = () => {
	const imageSliders = document.querySelectorAll('.imageSlider');
	for (let i = 0; i < imageSliders.length; i++) {
		imageSliders[i].addEventListener('mouseenter', () => {
			gsap.to(imageSliders[i], {
				duration: 0.5,
				boxShadow: '0 0 0 1rem #dbac7a, 0 0 5rem 0.25rem #dbac7ae0',
				scale: 1.01,
			});
		});
		imageSliders[i].addEventListener('mouseleave', () => {
			gsap.to(imageSliders[i], {
				duration: 0.5,
				boxShadow: '0 0 0 0.5rem #dbac7a',
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

