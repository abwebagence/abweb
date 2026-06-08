document.addEventListener("DOMContentLoaded", function () {

	var parallaxGrid1 = document.querySelector('.grid-1 img');
	new simpleParallax(parallaxGrid1, {
		scale: 1.5,
		delay: .6,
		orientation: 'left',
		transition: 'cubic-bezier(0,0,0,1)',
		customContainer: document.querySelector('#body-wrap'),
		overflow: true
	});

	var parallaxGrid1 = document.querySelector('.grid-2 img');
	new simpleParallax(parallaxGrid1, {
		scale: 1.5,
		delay: .6,
		orientation: 'right',
		transition: 'cubic-bezier(0,0,0,1)',
		customContainer: document.querySelector('#body-wrap'),
		overflow: true
	});

	var parallaxBottom1 = document.querySelector('.bottom-1 img');
	new simpleParallax(parallaxBottom1, {
		scale: 1.5,
		delay: .6,
		orientation: 'left',
		transition: 'cubic-bezier(0,0,0,1)',
		customContainer: document.querySelector('#body-wrap'),
		overflow: true
	});

});