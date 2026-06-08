/*!
 * creativebranddesign v0.0.1
 * Creative Brand Design
 * (c) 2022 Tyler Hounsome
 * https://cbwebsitedesign.co.uk
 */

WebFontConfig = {
	typekit: { id: "aaj0yxc" }
};

(function (d) {
	var wf = d.createElement("script"),
		s = d.scripts[0];
	wf.src = "https://cbwebsitedesign.co.uk/assets/webfontloader.min.js";
	wf.async = true;
	s.parentNode.insertBefore(wf, s);
})(document);
	
function onLoad() {
	document.body.classList.add('loaded');
}

if (window.attachEvent) {window.attachEvent('onload', onLoad);}
else if (window.addEventListener) {window.addEventListener('load', onLoad, false);}
else {document.addEventListener('load', onLoad, false);}
document.addEventListener("DOMContentLoaded", function () {
    let viewportWidth = window.innerWidth || document.documentElement.clientWidth;

    //On Page Smooth Scroll
    [].forEach.call(document.querySelectorAll('a[href^="#"]:not([href="#"]):not([data-bs-toggle="tab"])'), function(el) {
        el.addEventListener('click', function(e) {

            e.preventDefault();

            let target = el.getAttribute('href');
        
            gsap.to('#body-wrap', 1, {
                scrollTo: {
                    y: target,
                    offsetY: 20
                }
            });

        });
    });

    function isinViewport(elem, options = {}) {
        const rect = elem.getBoundingClientRect();
        const height = window.innerHeight || document.documentElement.clientHeight;
        const width = window.innerWidth || document.documentElement.clientWidth;
        const offset = { left: 0, right: 0, top: 0, bottom: 0, ...options };

        return (
            rect.right >= -offset.left &&
            rect.bottom >= -offset.top &&
            rect.left <= width + offset.right &&
            rect.top <= height + offset.bottom
        );
    };

    document.getElementById("body-wrap").onscroll = function(e) {
        [].forEach.call(document.querySelectorAll('.lottie-graphic'), function(el) {

            let animData = el.dataset.anim;
            let startPos = isinViewport(el) ? "bottom top" : "top 80%";

            let animGraphic = lottie.loadAnimation({
                container: el,
                renderer: 'svg',
                rendererSettings: {
                    filterSize: {
                        width: '400%',
                        height: '400%',
                        x: '-85%',
                        y: '-85%'
                    },
                    preserveAspectRatio: 'xMidYMid slice'
                },
                loop: false,
                autoplay: true,
                path: animData
            });

            animGraphic.setSpeed(1.2);

            ScrollTrigger.create({
                trigger: el,
                scroller: "#body-wrap",
                start: startPos,
                end: `bottom top`,
                onEnter: () => animGraphic.goToAndPlay(1),
                onEnterBack: () => animGraphic.goToAndPlay(1)
            });

            if (el.closest('.tab-pane')) {

                let tabId = el.closest('.tab-pane').getAttribute('id');

                document.querySelector(`.content-toggles a[href='#${tabId}']`).addEventListener('show.bs.tab', function(e) {
                    animGraphic.goToAndPlay(1);
                });

            }

        });
    
        if (document.querySelector('.images-carousel-swiper')) {
            
            let featuresExpandSwiper = new Swiper('.images-carousel-swiper .swiper-container', {
                loop: true,
                slidesPerView: 1,
                spaceBetween: 60,
                centeredSlides: true,
                autoplay: true,
                delay: 900,
                speed: 1400,
                grabCursor: true,
                pagination: {
                    el: '.images-carousel-swiper .swiper-pagination',
                    type: 'bullets',
                    clickable: true
                }
            });
    
        }

        if (viewportWidth >= 700) {

            setTimeout(function() {

                [].forEach.call(document.querySelectorAll('[data-fade-left]'), function(el) {
                
                    let startPos = isinViewport(el) ? "top 105%" : "top 80%";
    
                    gsap.from(el, {
                        scrollTrigger: {
                            trigger: el,
                            scroller: "#body-wrap",
                            start: startPos,
                            toggleActions: "play none none reverse"
                        },
                        opacity: 0,
                        x: 100,
                        duration: 1
                    });
    
                });
    
                [].forEach.call(document.querySelectorAll('[data-fade-right]'), function(el) {
                
                    let startPos = isinViewport(el) ? "top 105%" : "top 80%";
    
                    gsap.from(el, {
                        scrollTrigger: {
                            trigger: el,
                            scroller: "#body-wrap",
                            start: startPos,
                            toggleActions: "play none none reverse"
                        },
                        opacity: 0,
                        x: -100,
                        duration: 1
                    });
    
                });
    
                [].forEach.call(document.querySelectorAll('[data-fade-up]'), function(el) {
                
                    let startPos = isinViewport(el) ? "top 105%" : "top 80%";
    
                    gsap.from(el, {
                        scrollTrigger: {
                            trigger: el,
                            scroller: "#body-wrap",
                            start: startPos,
                            toggleActions: "play none none reverse"
                        },
                        opacity: 0,
                        y: 100,
                        duration: 1
                    });
    
                });
    
                [].forEach.call(document.querySelectorAll('[data-fade-down]'), function(el) {
                
                    let startPos = isinViewport(el) ? "top 105%" : "top 80%";
    
                    gsap.from(el, {
                        scrollTrigger: {
                            trigger: el,
                            scroller: "#body-wrap",
                            start: startPos,
                            toggleActions: "play none none reverse"
                        },
                        opacity: 0,
                        y: -100,
                        duration: 1
                    });
    
                });
    
                [].forEach.call(document.querySelectorAll('[data-fade]'), function(el) {
                
                    let startPos = isinViewport(el) ? "top 105%" : "top 80%";
    
                    gsap.from(el, {
                        scrollTrigger: {
                            trigger: el,
                            scroller: "#body-wrap",
                            start: startPos,
                            toggleActions: "play none none reverse"
                        },
                        opacity: 0,
                        duration: 1
                    });
    
                });
    
            }, 1);
    
        }

        e.target.onscroll = null;

    }

});
document.addEventListener("DOMContentLoaded", function () {

	if (document.querySelector('.img-parallax')) {
		var parallaxImages = document.getElementsByClassName('img-parallax');
		new simpleParallax(parallaxImages, {
            scale: 1.2,
			delay: .6,
            transition: 'cubic-bezier(0,0,0,1)',
            customContainer: document.querySelector('#body-wrap')
		});
    }

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
});

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