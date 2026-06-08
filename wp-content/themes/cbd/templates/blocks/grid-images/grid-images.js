document.addEventListener('DOMContentLoaded', function () {
  // Masonry Images
  if (document.querySelector('.grid-images')) {
    gsap.utils.toArray('.grid-images .gallery').forEach(el => {
      const playButton = el.querySelector('.play');
      const overlay = el.querySelector('.overlay');
      const video = el.querySelector('.grid-video');
      const section = el.closest('.grid-images');

      // Play video on click
      if (video && playButton) {
        playButton.addEventListener('click', function () {
          video.play();
          video.muted = false;
          video.controls = true;
          overlay.classList.add('hidden');
        });
      }

      const disableVideo = () => {
        if (video) {
          video.muted = true;
          video.controls = false;
        }
        overlay.classList.remove('hidden');
      };

      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: '+=400%',
        onLeaveBack: disableVideo,
        onLeave: disableVideo,
      });
    });
  
  }
})
