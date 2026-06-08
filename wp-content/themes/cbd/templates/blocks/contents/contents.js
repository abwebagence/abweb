document.addEventListener('DOMContentLoaded', function () {
  const el = document.querySelectorAll('.contents-section')

  if (!el.length) return

  const MatchMedia = gsap.matchMedia()

  el.forEach(el => {
    const nav = el.querySelector('.content-nav .nav')
    const main = el.querySelectorAll('.content-main')
    const wrapper = el.querySelector('.content-wrapper')
    const items = el.querySelectorAll('.content-main .content-row')
    const offset = () => document.querySelector('#header').offsetHeight + 40

    items.forEach((item, index) => {
      const trigger = item
      const offset = () => document.querySelector('#header').offsetHeight + 40

      ScrollTrigger.create({
        trigger,
        start: () => `top top+=${offset()}`,
        end: () => `+=${item.offsetHeight}`,
        invalidateOnRefresh: true,
        onEnter: () => {
          nav.querySelector('.active')?.classList.remove('active')
          nav.children[index].classList.add('active')
        },
        onEnterBack: () => {
          nav.querySelector('.active')?.classList.remove('active')
          nav.children[index].classList.add('active')
        },
        onLeave: () => {
          nav.children[index].classList.remove('active')
        },
        onLeaveBack: () => {
          nav.children[index].classList.remove('active')
        }
      })
    })

    MatchMedia.add('(min-width: 992px)', () => {
      ScrollTrigger.create({
        trigger: el,
        start: () => `top top+=${offset()}`,
        end: () => `+=${wrapper.offsetHeight - nav.offsetHeight}`,
        invalidateOnRefresh: true,
        pin: nav,
        pinSpacing: false
      })
    })
  })
})
