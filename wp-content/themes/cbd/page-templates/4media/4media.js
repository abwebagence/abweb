var images = document.querySelectorAll('.parallax-image');
new simpleParallax(images,{
    customContainer: document.querySelector('#body-wrap'),
});
document.addEventListener('DOMContentLoaded', function() {
    new simpleParallax(document.querySelectorAll('.parallax-up'),{
        orientation: 'up',
        scale: 1.3,
        overflow: true,
        customContainer: document.querySelector('#body-wrap'),
    });
    new simpleParallax(document.querySelectorAll('.parallax-down'),{
        orientation: 'down',
        scale: 1.3,
        overflow: true,
        customContainer: document.querySelector('#body-wrap'),
    });
    new simpleParallax(document.querySelectorAll('.parallax-up-more'),{
        orientation: 'up',
        scale: 3,
        overflow: true,
        customContainer: document.querySelector('#body-wrap'),
    });
    new simpleParallax(document.querySelectorAll('.parallax-down-more'),{
        orientation: 'down',
        scale: 3,
        overflow: true,
        customContainer: document.querySelector('#body-wrap'),
    });
    new simpleParallax(document.querySelectorAll('.parallax-up-m'),{
        orientation: 'up',
        scale: 2,
        overflow: true,
        customContainer: document.querySelector('#body-wrap'),
    });
    new simpleParallax(document.querySelectorAll('.parallax-down-m'),{
        orientation: 'down',
        scale: 2,
        overflow: true,
        customContainer: document.querySelector('#body-wrap'),
    });
});
var move = document.querySelectorAll('.move-right');
new simpleParallax(move,{
    orientation: 'right',
    customContainer: document.querySelector('#body-wrap'),
});
var moveleft = document.querySelectorAll('.move-left');
new simpleParallax(moveleft,{
    orientation: 'left',
    customContainer: document.querySelector('#body-wrap'),
});
const wireframeCarousel = new Swiper('.wireframe-section .swiper',{
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
window.addEventListener('load', function() {
    setTimeout(function() {
        document.body.classList.add('loaded');
    }, 800);
});
gsap.registerPlugin(ScrollTrigger);
function animateRow(row, startX) {
    gsap.fromTo(row, {
        x: startX
    }, {
        x: 0,
        duration: 3,
        ease: 'power1.out',
        scrollTrigger: {
            scroller: '#body-wrap',
            trigger: row,
            start: 'top center',
            end: '+=500',
            scrub: true,
        },
    });
}
function animateElementsDesktop() {
    var elements = document.querySelectorAll('.anim-move');
    gsap.to(elements, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.2,
        scrollTrigger: {
            scroller: '#body-wrap',
            trigger: elements,
            start: 'top 80%',
            end: 'bottom 80%',
            scrub: true,
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
            scroller: '#body-wrap',
            trigger: elements,
            start: 'top 80%',
            end: 'bottom 80%',
            scrub: true,
        },
    });
}
gsap.registerPlugin(ScrollTrigger);
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
                boxShadow: '0 0 0 1.3rem #5cd9d6, 0 0 5rem 0.25rem #5cd9d6',
                scale: 1.01,
            });
        }
        );
        imageSliders[i].addEventListener('mouseleave', () => {
            gsap.to(imageSliders[i], {
                duration: 0.5,
                boxShadow: '0 0 0 1.2rem #5cd9d6',
                scale: 1,
            });
        }
        );
    }
    const imageSliderColumnsAnimations = () => {
        gsap.to('.imageSliderColumns', {
            duration: 0,
            rotation: 30
        });
    }
    ;
    imageSliderColumnsAnimations();
    gsap.fromTo('#imageSlider1', {
        y: 250 * Math.cos(Math.PI / 6),
        x: -250 * Math.sin(Math.PI / 6)
    }, {
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
    });
    gsap.fromTo('#imageSlider2', {
        y: -250 * Math.cos(Math.PI / 6),
        x: 250 * Math.sin(Math.PI / 6)
    }, {
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
    });
    gsap.fromTo('#imageSlider3', {
        y: 250 * Math.cos(Math.PI / 6),
        x: -250 * Math.sin(Math.PI / 6)
    }, {
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
    });
    gsap.fromTo('#imageSlider4', {
        y: -250 * Math.cos(Math.PI / 6),
        x: 250 * Math.sin(Math.PI / 6)
    }, {
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
    });
    gsap.fromTo('#imageSlider1', {
        y: 250 * Math.cos(Math.PI / 6),
        x: -250 * Math.sin(Math.PI / 6)
    }, {
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
    });
    gsap.fromTo('#imageSlider2', {
        y: -250 * Math.cos(Math.PI / 6),
        x: 250 * Math.sin(Math.PI / 6)
    }, {
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
    });
    gsap.fromTo('#imageSlider3', {
        y: 250 * Math.cos(Math.PI / 6),
        x: -250 * Math.sin(Math.PI / 6)
    }, {
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
    });
    gsap.fromTo('#imageSlider4', {
        y: -250 * Math.cos(Math.PI / 6),
        x: 250 * Math.sin(Math.PI / 6)
    }, {
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
    });
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
}
;
interactiveJS();


document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('div.scrollDown').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default anchor behavior
        
        const target = document.getElementById('start'); // The element to scroll to
        const bodyWrap = document.getElementById('body-wrap'); // The scrollable container
        
        if (target && bodyWrap) {
            bodyWrap.scrollTo({
                top: target.offsetTop, // Scroll to the position of #start inside #body-wrap
                behavior: 'smooth' // Enable smooth scrolling
            });
        }
    });
});
