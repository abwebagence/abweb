const { EffectFade, Autoplay } = SwiperModules

document.addEventListener('DOMContentLoaded', function () {
  const el = document.querySelectorAll('.reviews-slider .swiper')
  if (!el.length) return

  el.forEach(slider => {
    const timeout = 10000
    const pagination = slider.querySelector('.reviews-slider-pagination')
    const buttons = slider.querySelectorAll('.reviews-slider-pagination button')
    const indicators = slider.querySelectorAll('.reviews-slider-pagination button circle')
    let interaction = false
    const swiperRef = new Swiper(slider, {
      modules: [EffectFade, Autoplay],
      autoplay: {
        delay: timeout,
        disableOnInteraction: false
      },
      slidesPerView: 1,
      effect: 'fade',
      speed: 600,
      loop: true,
      fadeEffect: {
        crossFade: true
      },
      on: {
        init({ activeIndex }) {
          gsap.killTweensOf(indicators)
          gsap.fromTo(
            indicators[activeIndex],
            {
              drawSVG: '0% 0%'
            },
            {
              drawSVG: '0% 100%',
              duration: timeout / 1000,
              ease: 'none'
            }
          )
        },
        slideChangeTransitionStart({ previousRealIndex }) {
          gsap.killTweensOf(indicators[previousRealIndex])
          gsap.set(indicators[previousRealIndex], {
            drawSVG: '0%'
          })
        },
        slideChangeTransitionEnd({ realIndex }) {
          gsap.fromTo(
            indicators[realIndex],
            {
              drawSVG: '0% 0%'
            },
            {
              drawSVG: '0% 100%',
              duration: timeout / 1000,
              ease: 'none'
            }
          )
        }
      }
    })

    buttons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        swiperRef.slideTo(index)
        interaction = true
      })
    })
  })
})
