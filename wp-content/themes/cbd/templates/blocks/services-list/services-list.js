document.addEventListener('DOMContentLoaded', function () {
  const services = document.querySelectorAll('.services-list .service-card')
  if (!services) return
  services.forEach((service, i) => {
    let defaultHeight = service.querySelector('p').offsetHeight
    const innerHeight = service.querySelector('span').offsetHeight

    // console.log('innerHeight', innerHeight, defaultHeight)
    if (innerHeight > defaultHeight) {
      service.querySelector('.service-card-toggler').classList.remove('hidden')
    }

    const toggleContent = () => {
      const p = service.querySelector('p')
      const innerHeight = service.querySelector('span').offsetHeight
      if (service.classList.contains('open')) {
        service.classList.remove('open')
        gsap.to(p, {
          maxHeight: defaultHeight,
          duration: 0.2
        })
      } else {
        service.classList.add('open')
        gsap.to(p, {
          maxHeight: innerHeight,
          duration: 0.2
        })
      }
    }
    service.addEventListener('click', toggleContent)
    window.addEventListener('resize', () => {
      defaultHeight = service.querySelector('p').offsetHeight
    })
  })
})
