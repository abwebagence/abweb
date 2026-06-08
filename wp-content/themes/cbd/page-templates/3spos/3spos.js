//var controller = new ScrollMagic.Controller();
//var rotate_circle = TweenMax.to(".ring-col img", 0.5, {rotation: 360, ease: "none"});
//var scene_h = new ScrollMagic.Scene({triggerElement: ".ring-col img", duration: 1600}).setTween(rotate_circle).addTo(controller);
/*
jQuery(function($) {
    $('.ring-col img').each(function(){
		let el = $(this);
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                scroller: "#body-wrap",
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                toggleActions: "play none none reverse"
            },
            rotation: 360
        });
    });
});
*/
document.addEventListener("DOMContentLoaded",function(){[].forEach.call(document.querySelectorAll('.ring-col img'),function(el){gsap.from(el,{scrollTrigger:{trigger:el,scroller:"#body-wrap",start:"top bottom",end:"bottom top",scrub:true,toggleActions:"play none none reverse"},rotation:360});});});