document.addEventListener('DOMContentLoaded', function () {
  const el = document.querySelector('.geo-swiper .swiper');
  if (!el) return;

  // Init Swiper WITHOUT pagination/navigation modules
  const geoCardsSwiper = new Swiper(el, {
    slidesPerView: 1,
    spaceBetween: 24,
    autoHeight: true
  });

  /* -----------------------
     Custom phase tabs
  ------------------------ */
  const pagination = el.querySelector('.swiper-pagination');
  if (pagination) {
    const tabs = Array.from(pagination.children);

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        geoCardsSwiper.slideTo(index);
      });
    });

    const setActive = (activeIndex) => {
      tabs.forEach((tab, i) => {
        tab.classList.toggle('is-active', i === activeIndex);
      });
    };

    setActive(geoCardsSwiper.realIndex);

    geoCardsSwiper.on('slideChange', () => {
      setActive(geoCardsSwiper.realIndex);
    });
  }

  /* -----------------------
     Custom prev/next
  ------------------------ */
  const nextBtn = el.querySelector('.swiper-button-next');
  const prevBtn = el.querySelector('.swiper-button-prev');

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      geoCardsSwiper.slideNext();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      geoCardsSwiper.slidePrev();
    });
  }

  /* -----------------------
     Optional: disable arrows at ends
     (remove if you want looping)
  ------------------------ */
  const updateArrows = () => {
    if (!prevBtn || !nextBtn) return;

    const isStart = geoCardsSwiper.isBeginning;
    const isEnd   = geoCardsSwiper.isEnd;

    prevBtn.classList.toggle('is-disabled', isStart);
    nextBtn.classList.toggle('is-disabled', isEnd);
  };

  updateArrows();
  geoCardsSwiper.on('slideChange', updateArrows);
});
