document.addEventListener("DOMContentLoaded", function () {
    
    if (document.querySelector('#big-graphic')) {

        let el = document.querySelector('#big-graphic .genvid-graphic');

        let animData = el.dataset.anim;

		let bigGraphic = lottie.loadAnimation({
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
			loop: true,
            autoplay: true,
			path: animData
		});

    }

    if (document.querySelector('.cards-swiper')) {

        const cardsSwiper = new Swiper('.cards-swiper', {
			loop: false,
			slidesPerView: 1,
			spaceBetween: 30,
            freeMode: true,
			autoplay: true,
			delay: 900,
			speed: 1400,
			grabCursor: true,
            preloadImages: false,
            lazy: {
                checkInView: true,
                loadPrevNext: true
            },
			pagination: {
                el: '.cards-swiper .bullets',
                type: 'bullets',
				clickable: true
            },
			breakpoints: {
				640: {
					slidesPerView: 2,
					spaceBetween: 30
				},
				800: {
					slidesPerView: 3,
					spaceBetween: 30
				},
                1280: {
                    slidesPerView: 4,
                    spaceBetween: 30
                },
                1800: {
                    slidesPerView: 6,
                    spaceBetween: 30
                }
			}
		});

        // cardsSwiperlazy.load();

    }

    if (document.querySelector('.hero-swiper')) {

        const heroSwiper = new Swiper('.hero-swiper', {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 0,
            grabCursor: true,
            autoplay: true,
            delay: 900,
            speed: 1400,
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            preloadImages: false,
            lazy: {
                loadPrevNext: true
            },
            parallax: true,
			pagination: {
                el: '.hero-swiper .bullets',
                type: 'bullets',
				clickable: true
            },
        });

// 		heroSwiper.lazy.load();

    }
    
                if (document.querySelector(".images-carousel-swiper")) {
                new Swiper(".images-carousel-swiper .swiper-container", {
                    loop: !0,
                    slidesPerView: 1,
                    spaceBetween: 60,
                    centeredSlides: !0,
                    autoplay: !0,
                    delay: 900,
                    speed: 1400,
                    grabCursor: !0,
                    preloadImages: !1,
                    lazy: {
                        loadPrevNext: !0
                    },
                    pagination: {
                        el: ".images-carousel-swiper .swiper-pagination",
                        type: "bullets",
                        clickable: !0
                    }
                })
            }
    

});

document.addEventListener("DOMContentLoaded", function () {
    let viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    
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
        e.target.onscroll = null;

    }

});