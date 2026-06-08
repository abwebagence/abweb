gsap.registerPlugin(ScrollTrigger);

var images = document.querySelectorAll('.parallax-image');
new simpleParallax(images, {
	customContainer: document.querySelector('#body-wrap'),
});
document.addEventListener('DOMContentLoaded', function () {
    
     if (document.querySelector('.mockups-parallax')) {
        var parallax1 = document.querySelector('.mockups-parallax:first-child');
        new simpleParallax(parallax1, {
            scale: 1.4,
			delay: .6,
            transition: 'cubic-bezier(0,0,0,1)',
            overflow: true,
            customContainer: document.querySelector('#body-wrap')
        });
        
        var parallax2 = document.querySelector('.mockups-parallax:nth-child(2)');
        new simpleParallax(parallax2, {
            scale: 1.4,
			delay: .6,
            transition: 'cubic-bezier(0,0,0,1)',
            overflow: true,
            orientation: 'down',
            customContainer: document.querySelector('#body-wrap')
        });
        
        var parallax3 = document.querySelector('.mockups-parallax:nth-child(3)');
        new simpleParallax(parallax3, {
            scale: 1,
			delay: .6,
            transition: 'cubic-bezier(0,0,0,1)',
            overflow: true,
            customContainer: document.querySelector('#body-wrap')
		});

    }
    // parallaxInstance
	var scene = document.getElementById('scene');
	var parallaxInstance = new Parallax(scene);
	
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

const interactiveJS = () => {
	const imageSliders = document.querySelectorAll('.imageSlider');
	for (let i = 0; i < imageSliders.length; i++) {
		imageSliders[i].addEventListener('mouseenter', () => {
			gsap.to(imageSliders[i], {
				duration: 0.5,
				boxShadow: '0 0 0 1.3rem #000100, 0 0 5rem 0.25rem #000100',
				scale: 1.01,
			});
		});
		imageSliders[i].addEventListener('mouseleave', () => {
			gsap.to(imageSliders[i], {
				duration: 0.5,
				boxShadow: '0 0 0 1.2rem #000100',
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
	/*gsap.to('.marqueeSliderDiv', {
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
	});*/
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
    
    stickyHeader();
});