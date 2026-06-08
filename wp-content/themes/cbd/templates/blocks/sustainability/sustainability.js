document.addEventListener('DOMContentLoaded', function () {
  const sections = document.querySelectorAll('.sustainability-section')

  if (!sections.length) return

  sections.forEach(section => {
    const masks = section.querySelectorAll('svg path')

    gsap.to(masks, {
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      },
      rotate: '20deg',
      scale: 0.9,
      transformOrigin: '50% 50%'
    })
  })
})
