document.addEventListener('DOMContentLoaded', function () {
  const sections = document.querySelectorAll('.geo-cards');
  const MatchMedia = gsap.matchMedia();

  sections.forEach(section => {
    const wrapper = section.querySelector('.cards-wrapper');
    const outer = section.querySelector('.cards-outer');
    const cards = section.querySelectorAll('.card');
    const count = cards.length;
    const offsetTop = outer.getBoundingClientRect().top + window.scrollY;
    const offset = outer.clientHeight - cards[0].clientHeight;

    let activeItem = 0;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        pin: true,
        start: `top ${document.querySelector('#header').clientHeight}`,
        pinSpacing: false,
        end: () => `+=${offset}`,
        scrub: 0.5,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          const newActiveIndex = Math.round(progress * (count - 1));
          if (newActiveIndex !== activeItem) {
            activeItem = newActiveIndex;
           
            // Play the active card's video, pause others
            cards.forEach((card, index) => {
              const video = card.querySelector('video');
              if (video) {
                if (index === activeItem) {
                  video.play();
                } else {
                  video.pause();
                  video.currentTime = 0; // Reset video when paused
                }
              }
            });
          }
        }
      }
    });

    cards.forEach((card, index) => {
      if (index < cards.length - 1) {
        tl.to(card, { 
          scale: 1 - 0.03 * (cards.length - index - 1), 
          duration: (cards.length - index - 1) * 0.6 
        }, index * 0.5);
      }

      if (index > 0) {
        tl.to(
          card,
          {
            y: () => {
              return `-${Array.from(cards).slice(0, index).reduce((total, current) => total + current.clientHeight, 0)}px`;
            },
            duration: index,
            ease: 'none'
          },
          0
        );
      }
    });
  });
});
