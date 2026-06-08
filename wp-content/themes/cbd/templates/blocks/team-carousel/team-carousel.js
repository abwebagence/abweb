document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelector('.team-carousel')) {
    document.querySelectorAll('.team-carousel').forEach(el => {
      new MediaCarousel(el)
    })
  }
  if (document.querySelector('.team-swiper')) {
    document.querySelectorAll('.team-swiper').forEach(el => {
      new Swiper(el, {
        loop: false,
        slidesPerView: 1,
        spaceBetween: 30,
        speed: 1000,
        watchSlidesProgress: true,
        breakpoints: {
          568: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          768: {
            slidesPerView: 2,
            spaceBetween: '8.33%'
          },
          1199: {
            slidesPerView: 3,
            spaceBetween: '8.33%'
          }
        },
        on: {
          slideChange: swiper => {
            swiper.slides[swiper.previousIndex].querySelector('video')?.pause()
            swiper.slides[swiper.activeIndex].querySelector('video')?.play()
          }
        }
      })
    })

    document.querySelectorAll('.team-swiper .member-card-description').forEach(description => {
      const shortText = description.querySelector('[data-short-text')
      const longText = description.querySelector('[data-long-text')
      const content = description.closest('.member-card-content')
      const toggle = content.querySelector('.toggle')

      toggle.addEventListener('click', () => {
        gsap.to(description, {
          opacity: 0,
          height: () =>
            !description.classList.contains('expanded') ? `${longText.getBoundingClientRect().height}px` : `${shortText.getBoundingClientRect().height}px`,
          duration: 0.2,
          onComplete: () => {
            gsap.to(description, {
              opacity: 1,
              duration: 0.2
            })
            if (description.classList.contains('expanded')) {
              description.classList.remove('expanded')
              toggle.classList.remove('active')
              gsap.set(shortText, {
                opacity: 1
              })
              gsap.set(longText, {
                opacity: 0
              })
            } else {
              description.classList.add('expanded')
              toggle.classList.add('active')
              gsap.set(shortText, {
                opacity: 0
              })
              gsap.set(longText, {
                opacity: 1
              })
            }
            gsap.to(description, {
              opacity: 1,
              duration: 0.2
            })

            Scroller.refresh()
          }
        })
      })
    })

    if (window.innerWidth <= 1199) {
      setTimeout(() => {
        ScrollTrigger.create({
          trigger: document.querySelector('.team-swiper'),
          start: 'top 50%',
          onEnter: () => {
            const video = document.querySelector('.team-swiper .swiper-slide-active video')
            console.log('enter', video)
            video?.play()
          },
          onLeave: () => {
            const video = document.querySelector('.team-swiper .swiper-slide-active video')
            if (video) {
              video.currentTime = 0
              video?.pause()
            }
          },
          onEnterBack: () => {
            const video = document.querySelector('.team-swiper .swiper-slide-active video')
            video?.play()
          },
          onLeaveBack: () => {
            const video = document.querySelector('.team-swiper .swiper-slide-active video')
            if (video) {
              video.currentTime = 0
              video?.pause()
            }
          }
        })
      })
    }
  }
})
