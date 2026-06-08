window.addEventListener('DOMContentLoaded', function () {
  let lastWidth = window.innerWidth;

  // Keep active item in view inside the nav list
  function scrollNavToActive(navList, item) {
    if (!navList || !item) return;

    const navRect = navList.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    // Position thresholds so the active stays nicely within view
    const topBuffer = navRect.height * 0.3;
    const bottomBuffer = navRect.height * 0.3;

    const offsetTop = itemRect.top - navRect.top;
    const offsetBottom = itemRect.bottom - navRect.top;

    let newScrollTop = null;

    if (offsetTop < topBuffer) {
      // Item too high, scroll up
      newScrollTop = navList.scrollTop + offsetTop - topBuffer;
    } else if (offsetBottom > navRect.height - bottomBuffer) {
      // Item too low, scroll down
      newScrollTop = navList.scrollTop + (offsetBottom - (navRect.height - bottomBuffer));
    }

    if (newScrollTop !== null) {
      navList.scrollTo({
        top: newScrollTop,
        behavior: 'smooth'
      });
    }
  }

  function postNav() {
    const sections = document.querySelectorAll('.article-page');

    // Clear previous triggers and nav items
    sections.forEach(section => {
      if (section._postNavTriggers) {
        section._postNavTriggers.forEach(t => t.kill());
      }
      section._postNavTriggers = [];

      const navList = section.querySelector('.article-nav ul');
      if (navList) {
        navList.innerHTML = '';
        navList.style.maxHeight = '';
        navList.style.overflowY = '';
      }
    });

    if (window.innerWidth < 600) {
      return;
    }

    sections.forEach(section => {
      const content = section.querySelector('.content');
      const navEl = section.querySelector('.nav-container');
      const navList = section.querySelector('.article-nav ul');
      const progressBar = section.querySelector('.progress-bar .progress');
      const header = document.querySelector('header');

      if (!content || !navEl || !navList || !progressBar) {
        return;
      }

      const articleHeaders = document.querySelector('.only-h2')
        ? content.querySelectorAll('h2')
        : content.querySelectorAll('h2, h3, h4');

      const triggers = [];

      // Build nav items
      articleHeaders.forEach(el => {
        const li = document.createElement('li');
        li.setAttribute('data-cursor', 'hover');
        li.innerHTML = `<span>${el.innerHTML}</span>`;
        navList.appendChild(li);

        // Click: scroll to section
        li.addEventListener('click', function () {
          if (window.Scroller && Scroller.lenis) {
            Scroller.lenis.scrollTo(el, {
              offset: -150,
              lerp: 0.1
            });
          } else {
            const targetTop = el.getBoundingClientRect().top + window.scrollY - 150;
            window.scrollTo({ top: targetTop, behavior: 'smooth' });
          }
        });

        // ScrollTrigger: highlight and auto-scroll nav
        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top 40%',
          end: 'bottom 40%',
          onEnter: () => {
            section.querySelectorAll('.article-nav li.active')
              .forEach(liActive => liActive.classList.remove('active'));
            li.classList.add('active');
            scrollNavToActive(navList, li);
          },
          onEnterBack: () => {
            section.querySelectorAll('.article-nav li.active')
              .forEach(liActive => liActive.classList.remove('active'));
            li.classList.add('active');
            scrollNavToActive(navList, li);
          }
        });

        triggers.push(st);
      });

      // Pull nav slightly closer to the top (about 20px tighter than header bottom)
      const headerBase = header ? header.offsetHeight : 0;
      const headerHeight = Math.max(headerBase - 30, 0);
      const navHeight = navEl.offsetHeight;

      // Limit nav contents to 50% of viewport height
      const viewportHeight = window.innerHeight;
      const maxNavHeight = viewportHeight * 0.4;
      navList.style.maxHeight = `${maxNavHeight}px`;

      // Make it programmatically scrollable, but block manual scroll
      navList.style.overflowY = 'auto';
        navList.style.scrollbarWidth = 'none'; // Firefox
        navList.style.msOverflowStyle = 'none'; // IE/Edge
        navList.style.overflowX = 'hidden';
        
        // Create hidden scrollbar rule for WebKit browsers
        navList.style.setProperty('--hide-scrollbar', '1');
        navList.classList.add('hide-scrollbar');

      if (!navList._lockScrollBound) {
        const blockScroll = function (e) {
          e.preventDefault();
        };
        navList.addEventListener('wheel', blockScroll, { passive: false });
        navList.addEventListener('touchmove', blockScroll, { passive: false });
        navList._lockScrollBound = true;
      }

      // Pin the nav
      const pinTrigger = ScrollTrigger.create({
        trigger: navEl,
        start: `top ${headerHeight}`,
        endTrigger: section,
        end: `bottom ${headerHeight + navHeight + 15}`,
        pin: navEl,
        pinType: 'transform',
        onUpdate({ progress }) {
          const clamped = Math.max(progress, 0.1);
          progressBar.style.width = `${clamped * 100}%`;
        }
      });

      triggers.push(pinTrigger);
      section._postNavTriggers = triggers;
    });
  }

  if (document.querySelector('.article-page')) {
    postNav();

    if (screen.orientation && screen.orientation.addEventListener) {
      screen.orientation.addEventListener('change', function () {
        postNav();
      });
    }

    window.addEventListener('resize', function () {
      const currentWidth = window.innerWidth;
      if (currentWidth !== lastWidth) {
        lastWidth = currentWidth;
        postNav();
      }
    });
  }
});




document.addEventListener('DOMContentLoaded', function () {
  // Latest News Carousel
  if (document.querySelector('.latest-news .swiper')) {
    const newsSwipers = document.querySelectorAll('.latest-news .swiper')

    Array.prototype.forEach.call(newsSwipers, function (el) {
      const section = el.closest('.latest-news')
      const swiper = new Swiper(el, {
        slidesPerView: 1.15,
        spaceBetween: 20,
        speed: 600,
        scrollbar: {
          el: section.querySelector('.swiper-scrollbar'),
          draggable: true
        },
        breakpoints: {
          567: {
            slidesPerView: 1.5,
            spaceBetween: 30
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 45
          },
          1199: {
            slidesPerView: 3,
            spaceBetween: 60
          }
        },
        on: {
          slideChange({ slides, realIndex, previousRealIndex }) {
            slides[realIndex].querySelector('.video-hover video')?.play()
            slides[realIndex].querySelector('.video-hover')?.classList.add('hover')

            slides[previousRealIndex].querySelector('.video-hover video')?.pause()
            slides[previousRealIndex].querySelector('.video-hover')?.classList.remove('hover')
          }
        }
      })
    })
  }
})
