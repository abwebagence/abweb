// Work Swiper
document.addEventListener('DOMContentLoaded', function () {
  function sideScroller() {
    gsap.utils.toArray('.side-scroller .swiper').forEach(el => {
      const mobileCount = el.closest('.work-tiles') ? 1.4 : 1.15

      const swiper = new Swiper(el, {
        loop: true,
        slidesPerView: mobileCount,
        spaceBetween: 30,
        speed: 300,
        preloadImages: false,
        // observer: true,
        // observeParents: true,
        // observeSlideChildren: true,
        // invalidateOnRefresh: true,
        autoplay: true,
        breakpoints: {
          578: {
            slidesPerView: 1.5,
            spaceBetween: '60'
          },
          1199: {
            slidesPerView: 'auto',
            spaceBetween: 80,
          }
        },
        // on: {
        //   afterInit(swiper) {
        //     const wrapper = el.querySelector('.swiper-wrapper')
        //     const section = wrapper.closest('.section')

        //     if (windowWidth >= 1199) {
        //       const paths = section.querySelectorAll('.blob-watermark path')
        //       const slideWidth = swiper.slides[0].offsetWidth
        //       const tl = gsap.timeline({
        //         scrollTrigger: {
        //           trigger: section,
        //           scrub: 1,
        //           invalidateOnRefresh: true,
        //           pin: true,
        //           pinSpacing: true,
        //           start: 'top top',
        //           end: () => '+=' + (wrapper.scrollWidth - innerWidth)
        //         }
        //       })

        //       tl.addLabel('start')

        //       tl.to(
        //         wrapper,
        //         {
        //           ease: 'none',
        //           duration: 1.3,
        //           x: () => -(slideWidth * (swiper.slides.length - 1) + 30)
        //         },
        //         'start'
        //       )

        //       tl.fromTo(
        //         paths,
        //         { drawSVG: '0%' },
        //         {
        //           drawSVG: '100%',
        //           stagger: 0.1,
        //           duration: 1,
        //           ease: 'none'
        //         },
        //         '<'
        //       )
        //     }
        //   }
        // }
      })
    })
  }
  if (document.querySelector('.side-scroller .swiper')) {
    sideScroller()

    if (screen.orientation) {
      screen.orientation.addEventListener('change', sideScroller)
    }
    window.addEventListener('resize', function () {
      if (window.innerWidth !== windowWidth) {
        sideScroller()
      }
    })
  }
})
