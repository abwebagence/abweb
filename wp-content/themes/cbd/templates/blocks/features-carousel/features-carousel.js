document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelector('.blobs-swiper')) {
    const hoverItem = item => {
      if (item.classList.contains('playing')) return
      item.classList.add('playing')
      const svgs = item.querySelectorAll('svg')

      svgs.forEach(svg => {
        const hoverPath = svg.querySelector('.hover')

        gsap.to(svg.querySelector('path'), {
          morphSVG: hoverPath,
          duration: 1.5
        })
      })
    }

    const blurItem = item => {
      if (!item.classList.contains('playing')) return
      item.classList.remove('playing')
      const svgs = item.querySelectorAll('svg')

      svgs.forEach(svg => {
        const defaultPath = svg.querySelector('.default')

        gsap.to(svg.querySelector('path'), {
          morphSVG: defaultPath,
          duration: 1
        })
      })
    }

    document.querySelectorAll('.blobs-swiper').forEach(el => {
      const swiper = new Swiper(el, {
        modules: [SwiperModules.FreeMode],
        loop: false,
        slidesPerView: 1.15,
        spaceBetween: 30,
        speed: 1000,
        watchSlidesProgress: true,
        free: windowWidth > 1199,
        breakpoints: {
          600: {
            slidesPerView: 1.45,
            spaceBetween: '8.33%'
          },
          1200: {
            slidesPerView: 2.5,
            spaceBetween: '8.33%'
          }
        }
      })

      swiper.on('sliderMove', swiper => {
        swiper.slides.forEach(slide => {
          if (slide.classList.contains('swiper-slide-visible')) {
            hoverItem(slide)
          } else {
            blurItem(slide)
          }
        })
      })
    })
  }
})
