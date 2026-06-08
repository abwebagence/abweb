// GSAP Settings
gsap.registerPlugin(ScrollTrigger)

// Clear Scroll Memory
// window.history.scrollRestoration = "manual"

// Lenis Smooth Scrolling
const lenis = new Lenis({
  duration: 1.5,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
  direction: "vertical", // vertical, horizontal
  gestureDirection: "vertical", // vertical, horizontal, both
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

const Scroller = {
scrolled: 0,
direction: 'DOWN',
scroller: null,
disableEvents: false,
lenis: null,

  init: function () {
    const _ = this;

    // Initialize Lenis
    _.lenis = new Lenis();

    // Attach Lenis scroll events to ScrollTrigger
    _.lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP ticker to update Lenis
    gsap.ticker.add(function (time) {
      _.lenis.raf(time * 1000);
    });

    // Prevent GSAP from lag smoothing
    gsap.ticker.lagSmoothing(0);

    // Custom scroll handling
    _.lenis.on('scroll', function (e) {
      _.handle(e);
    });
  },
  handle: function (e) {
    const _ = this;

    _.scrolled = e?.targetScroll || window.scrollY;
     _.scrolled = e?.targetScroll || window.scrollY;
    _.direction = e?.direction;

    // Determine direction based on body classes if `direction` is `0`
    if (_.direction === 0) {
        const bodyClasses = document.body.classList;
        if (bodyClasses.contains('scrolling-up')) {
            _.direction = 'UP';
        } else if (bodyClasses.contains('scrolling-down')) {
            _.direction = 'DOWN';
        }
    } else {
        _.direction = _.direction === 1 ? 'DOWN' : 'UP';
    }

    if (_.direction === 'UP') {
      document.body.classList.add('scrolling-up');
      document.body.classList.remove('scrolling-down');
    } else {
      document.body.classList.add('scrolling-down');
      document.body.classList.remove('scrolling-up');
    }

    if (_.scrolled > window.innerHeight) {
      document.body.classList.add('viewport-scrolled');
    } else {
      document.body.classList.remove('viewport-scrolled');
    }

    if (_.scrolled > 100) {
      document.body.classList.add('scrolled');
    } else {
      document.body.classList.remove('scrolled');
    }

    _.lastScrollPos = _.scrolled <= 0 ? 0 : _.scrolled;
  },
  disable: function () {
    if (this.lenis) {
      this.lenis.stop();
    }
  },

  enable: function () {
    if (this.lenis) {
      this.lenis.start();
    }
  },

  scrollTo: function (target) {
    const _ = this;
    const headerHeight = document.querySelector('#header').offsetHeight || 0;

    if (_.lenis) {
      _.lenis.scrollTo(target, {
        offset: -1 * headerHeight
      });
    }
  },

  scrollTop: function (transition) {
    if (this.lenis) {
      if (transition) {
        this.lenis.scrollTo(0, { duration: 1 });
      } else {
        this.lenis.scrollTo(0, { immediate: true });
        window.scrollTo(0, 0);
      }
    }
  },

  kill: function () {
    ScrollTrigger.killAll();
  },

  refresh: function () {
    ScrollTrigger.refresh();
  }
};

// Initialize the Scroller
Scroller.init();