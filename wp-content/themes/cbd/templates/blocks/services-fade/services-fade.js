const MatchMedia = gsap.matchMedia()

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.services-fade').forEach(section => {
    const items = section.querySelectorAll('.card')
    const bg = section.querySelectorAll('.bg')
    const watermark = section.querySelectorAll('.blob-watermark')

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: bg,
        start: () => 'top top',
        end: () => `bottom bottom`,
        endTrigger: section,
        pin: true,
        scrub: true,
        pinSpacing: true,
        invalidateOnRefresh: true
      }
    })

    tl.to(
      watermark,
      {
        y: '25%',
        rotate: '35deg',
        scale: 0.85
      },
      0
    )

    items.forEach((item, i) => {
      gsap.set(item, { opacity: 0 })
      gsap.fromTo(
        item,
        { opacity: 0, scale: 0.925, filter: 'blur(10px)' },
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          ease: 'none',
          scrollTrigger: {
            invalidateOnRefresh: true,
            trigger: item,
            start: 'top bottom',
            end: 'top 40%',
            scrub: 0.5
          }
        }
      )
      gsap.fromTo(
        item,
        { opacity: 1, scale: 1, filter: 'blur(0px)' },
        {
          opacity: 0,
          scale: 0.925,
          filter: 'blur(10px)',
          ease: 'none',
          scrollTrigger: {
            invalidateOnRefresh: true,
            trigger: item,
            // markers: i === 0,
            start: () => (window.innerWidth > window.innerHeight ? 'top top' : 'top top-=30%'),
            end: () => (window.innerWidth > window.innerHeight ? '+=30%' : '+=50%'),
            scrub: 0.5
          }
        }
      )
    })
  })
})
