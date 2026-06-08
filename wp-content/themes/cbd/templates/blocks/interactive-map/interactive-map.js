document.addEventListener('DOMContentLoaded', function () {
  // Interactive Map
  if (document.querySelector('.interactive-map')) {
    function interactiveMap() {
      gsap.utils.toArray('.interactive-map').forEach(el => {
        const section = el
        const nav = el.querySelector('.map-nav')
        const mapPoints = el.querySelectorAll('[data-point]')
        const mapProjects = el.querySelectorAll('[data-project]')
        const backButton = el.querySelector('.back')

        gsap.utils.toArray(mapProjects).forEach(project => {
          if (!project.matches('.active')) {
            gsap.set(project, {
              xPercent: -100
            })
          }
        })

        gsap.utils.toArray(mapPoints).forEach(el => {
          el.addEventListener('click', e => {
            const activeProject = Array.from(mapProjects).find(project => project.classList.contains('active'))
            const activePoint = Array.from(mapPoints).find(point => point.classList.contains('active'))
            const clickedPoint = e.target.dataset.point
            const targetProject = Array.from(mapProjects).find(project => project.dataset.project === clickedPoint)
            const targetPoint = Array.from(mapPoints).find(point => point.dataset.point === clickedPoint && point.closest('.points'))

            if (!targetProject.matches('.active')) {
              activeProject.classList.remove('active')
              if (activePoint) activePoint.classList.remove('active')
              targetProject.classList.add('active')
              if (targetPoint) targetPoint.classList.add('active')
              gsap.to(activeProject, 0.3, {
                xPercent: -100,
                opacity: 0,
                onComplete: () => {
                  gsap.set(activeProject, {
                    display: 'none'
                  })
                }
              })
              gsap.set(targetProject, {
                display: 'flex',
                onComplete: () => {
                  if (windowWidth < 1200) {
                    gsap.to(nav, 0.3, {
                      height: `${targetProject.offsetHeight}px`,
                      onComplete: () => {
                        ScrollTrigger.refresh()
                      }
                    })
                  }
                }
              })
              gsap.to(targetProject, 0.3, {
                xPercent: 0,
                opacity: 1
              })
              console.log('add', el)
              section.classList.add('has-active-point')
            }

            if (clickedPoint === 'all') {
              if (windowWidth < 1200) {
                gsap.to(nav, 0.3, {
                  height: 'auto',
                  onComplete: () => {
                    ScrollTrigger.refresh()
                  }
                })
              }

              gsap.to(backButton, 0.3, {
                autoAlpha: 0
              })
              section.classList.remove('has-active-point')
            } else {
              gsap.to(backButton, 0.3, {
                autoAlpha: 1
              })
            }
          })
        })
      })
    }
    imagesLoaded(document.body, () => interactiveMap())
  }
})
