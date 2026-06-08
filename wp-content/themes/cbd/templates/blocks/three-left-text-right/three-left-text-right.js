document.addEventListener('DOMContentLoaded', function () {
  // Parallax Content Images
  if (windowWidth >= 1280) {
    if (document.querySelector('.content-images.scrolly')) {
      gsap.utils.toArray('.content-images.scrolly').forEach(el => {
        const img1 = el.querySelector('figure:first-child'),
          img2 = el.querySelector('figure:nth-child(2)'),
          img3 = el.querySelector('figure:nth-child(3)')

        if (img1) {
          const img1Height = img1.offsetHeight
          gsap.set(img1, {
            height: img1Height - 60
          })
          gsap.to(img1, {
            scrollTrigger: {
              trigger: el,
              scrub: true,
              start: 'top bottom',
              end: 'bottom top'
            },
            height: img1Height + 60
          })
        }
        if (img2) {
          const img2Height = img2.offsetHeight
          gsap.set(img2, {
            height: img2Height - 60,
            bottom: '12%'
          })
          gsap.to(img2, {
            scrollTrigger: {
              trigger: el,
              scrub: true,
              start: 'top bottom',
              end: 'bottom top'
            },
            height: img2Height + 60,
            bottom: 'calc(12% + 60px)'
          })
        }
        if (img3) {
          const img3Height = img3.offsetHeight
          gsap.set(img3, {
            height: img3Height + 60
          })
          gsap.to(img3, {
            scrollTrigger: {
              trigger: el,
              scrub: true,
              start: 'top bottom',
              end: 'bottom top'
            },
            height: img3Height - 60
          })
        }
      })
    }
  }
})
