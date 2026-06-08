document.addEventListener('DOMContentLoaded', function () {
  // Awards Carousel
  if (document.querySelector('.awards-carousel .swiper')) {
    const awardsSwiper = document.querySelectorAll('.awards-carousel .swiper')

    Array.prototype.forEach.call(awardsSwiper, function (el) {
      const swiper = new Swiper(el, {
        slidesPerView: 1.5,
        spaceBetween: 15,
        loop: true,
        breakpoints: {
          900: {
            slidesPerView: 2.5,
            spaceBetween: 30
          }
        }
      })
    })
  }
})
