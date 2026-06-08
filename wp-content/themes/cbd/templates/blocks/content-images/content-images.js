document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelector('.content-images .lottie')) {
    function initLottieImagesAnimation(el) {
      const animSpeed = el.dataset.speed
      let animLoop = el.dataset.loop
      if (animLoop) {
        animLoop = true
      } else {
        animLoop = false
      }
      const animData = el.dataset.anim
      const animGraphic = new dotLottie({
        canvas: el,
        loop: animLoop,
        autoplay: true,
        src: animData
      })
      // const animGraphic = lottie.loadAnimation({
      //   container: el,
      //   renderer: 'svg',
      //   rendererSettings: {
      //     filterSize: {
      //       width: '400%',
      //       height: '400%',
      //       x: '-85%',
      //       y: '-85%'
      //     },
      //     preserveAspectRatio: 'xMidYMid slice'
      //   },
      //   loop: animLoop,
      //   autoplay: true,
      //   path: animData
      // })
      animGraphic.setSpeed(animSpeed)
      animGraphic.addEventListener('DOMLoaded', () => {
        Scroller.refresh()
      })
    }

    gsap.utils.toArray('.content-images .lottie').forEach(el => {
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top 105%',
        onEnter: () => {
          initLottieImagesAnimation(el)
          trigger.kill()
          ScrollTrigger.refresh()
        }
      })
    })
  }
})
