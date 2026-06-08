document.addEventListener('DOMContentLoaded', function () {
  const el = document.querySelector('.badges-swiper.swiper');
  if (!el) return;

  new Swiper(el, {
    modules: [
      window.SwiperModules.Autoplay,
      window.SwiperModules.FreeMode // optional; remove if you don't want free scrolling
    ],

    slidesPerView: 1,
    spaceBetween: 16,
    loop: true,
    speed: 600,

    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },

    breakpoints: {
      768:  { slidesPerView: 3, spaceBetween: 24 },
      1024: { slidesPerView: 5, spaceBetween: 32 }
    }
  });
});
