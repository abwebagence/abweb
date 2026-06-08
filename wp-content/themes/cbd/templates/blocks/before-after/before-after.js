document.addEventListener('DOMContentLoaded', function () {
  // Before After
  if (document.querySelector('.before-after .comparison')) {
    const slider = document.querySelector('.before-after .comparison .slider')
    const img1 = document.querySelectorAll('.before-after .comparison img')[0]
    const img2 = document.querySelectorAll('.before-after .comparison img')[1]

    if (!img1 || !img2 || !slider) return

    slider.addEventListener('input', moveDivider)
    function moveDivider() {
      img1.style.clipPath = `inset(0 0 0 ${slider.value}%)`
      img2.style.clipPath = `inset(0 ${100 - slider.value}% 0 0)`
    }
  }
})
