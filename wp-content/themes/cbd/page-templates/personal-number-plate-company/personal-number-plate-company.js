	var n = new ScrollMagic.Controller({
		container: "#body-wrap"
	});
		if (document.querySelector(".reggie")) {
		var r = gsap.to(".reggie", 1, {
			x: "-600%"
		});
		new ScrollMagic.Scene({
			triggerElement: ".reggie",
			triggerHook: 1,
			duration: "140%"
		}).setTween(r).addTo(n)
	}