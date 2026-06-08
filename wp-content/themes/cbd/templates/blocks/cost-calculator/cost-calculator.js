document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.cost-calculator-modal').forEach(el => {
    // const toggler = document.querySelectorAll('[data-toggle="cost-calculator"]')

    // if (!toggler) return
    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
    const body = el.querySelector('.cost-calculator-body')
    const bodyTop = body.getBoundingClientRect().top + window.scrollY - headerHeight;
    const form = el.querySelector('.cost-calculator-form')
    const progressIndicator = el.querySelector('.cost-calculator-progress-indicator')
    const progressIndicatorTrack = progressIndicator.querySelector('div')
    const btnNext = el.querySelectorAll('[data-calc="next"]')
    const btnPrev = el.querySelectorAll('[data-calc="prev"]')
    const btnClose = el.querySelectorAll('[data-calc="close"]')
    const btnSubmit = el.querySelector('button[type="submit"]')
    const steps = el.querySelectorAll('.cost-calculator-step')
    const count = steps.length
    const pristine = new Pristine(form, {
      errorTextClass: 'form-error'
    })

    pristine.addValidator(
      form.querySelector('input[type="tel"]'),
      function (value) {
        const phoneRegex = /^\+?[1-9]\d{0,14}(\s\d{1,16})*$/
        return phoneRegex.test(value)
      },
      'Invalid phone number format',
      2,
      false
    )

    let currentStep = 0

    // const showModal = () => {
    //   el.style.display = 'block'
    //   gsap.fromTo(
    //     el,
    //     {
    //       autoAlpha: 0,
    //       y: 50,
    //       scale: 0.95
    //     },
    //     {
    //       autoAlpha: 1,
    //       y: 0,
    //       scale: 1,
    //       ease: 'power4.out',
    //       duration: 0.7
    //     }
    //   )

    //   steps[currentStep].style.display = 'block'
    //   gsap.fromTo(steps[currentStep].children, { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, ease: 'power4.out', duration: 1, stagger: 0.05, delay: 0.3 })
    //   Scroller.disable()
    // }

    // toggler.forEach(btn => {
    //   btn.addEventListener('click', e => {
    //     const value = btn.value;

    //     if (value === 'Yes') {
    //       document.querySelector('#website-yes').checked = true;
    //       document.querySelector('#website_domain').classList.remove('hidden');
    //     } else {
    //       document.querySelector('#website-no').checked = true;
    //     }

    //     setTimeout(function () {
    //       showModal();
    //     }, 300);
    //   })
    // })
  
    // showModal();

    const nextStep = e => {
      e.preventDefault()
      const inputs = steps[currentStep].querySelectorAll('input[required]')
      let isStepValid = true

      const createError = input => {
        const errorSpan = document.createElement('span')
        errorSpan.className = 'form-error'
        errorSpan.innerText = pristine.getErrors(input).join(', ')

        return errorSpan
      }

      pristine.validate(inputs)
      
      inputs.forEach(input => {
        const group = input.closest('.form-group, .form-selectors-group, .form-selectors-list')
        const error = group.querySelector('.form-error')

        if (pristine.getErrors(input).length) {
          if (input.type === 'radio' || input.type === 'checkbox') {
            if (group && !error) {
              group.appendChild(createError(input))
            }
          }
          isStepValid = false
        } else {
          if (input.type === 'radio' || input.type === 'checkbox') {
            if (error) {
              error.remove()
            }
          }
        }
      })
    
      if (!isStepValid) {
        console.info('Step not valid');
        let errors = document.querySelectorAll('.form-error')
        let error = errors[0].getBoundingClientRect().top + window.scrollY - headerHeight - 150;
        window.scrollTo({
          top: error,
          behavior: 'smooth'
        });

        return
      }

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      

      if (currentStep >= steps.length - 1) {
        form.submit()
        return
      }

      currentStep += 1

      updateProgress()
      gsap.to(steps[currentStep - 1].children, {
        autoAlpha: 0,
        y: -70,
        ease: 'power4.in',
        duration: 0.5,
        stagger: 0.05,
        onComplete: () => {
          steps[currentStep - 1].style.display = 'none'
          steps[currentStep].style.display = 'block'
          gsap.fromTo(steps[currentStep].children, { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, ease: 'power4.out', duration: 1, stagger: 0.05 })
          checkClasses()
          ScrollTrigger.refresh();
        }
      })
    }

    const prevStep = e => {
      e.preventDefault()

      if (currentStep === 0) return

      currentStep -= 1

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })

      updateProgress()
      gsap.to(steps[currentStep + 1].children, {
        autoAlpha: 0,
        y: 70,
        ease: 'power4.in',
        duration: 0.5,
        stagger: 0.05,
        onComplete: () => {
          steps[currentStep + 1].style.display = 'none'
          steps[currentStep].style.display = 'block'
          gsap.fromTo(steps[currentStep].children, { autoAlpha: 0, y: -70 }, { autoAlpha: 1, y: 0, ease: 'power4.out', duration: 1, stagger: 0.05 })
          checkClasses()
        }
      })
    }

    const updateProgress = () => {
      gsap.to(progressIndicator, {
        left: `${(currentStep / (count - 1)) * 100}%`,
        ease: 'power4.out',
        duration: 1,
        delay: 0.5
      })
      gsap.to(progressIndicatorTrack.children, {
        y: `${-currentStep * 100}%`,
        delay: 0.5
      })
    }

    const checkClasses = () => {
      if ((currentStep + 1) % 2 === 0) {
        el.classList.add('is-even')
      } else {
        el.classList.remove('is-even')
      }
    }

    btnNext.forEach(btn => btn.addEventListener('click', nextStep))
    btnPrev.forEach(btn => btn.addEventListener('click', prevStep))
    btnClose.forEach(btn =>
      btn.addEventListener('click', () => {
        gsap.to(el, { autoAlpha: 0, scale: 0.98, duration: 0.6, ease: 'power4.out', onComplete: () => (el.style = 'display: none') })
        Scroller.enable()
      })
    )
  })
   document.querySelectorAll('[data-show-if-field]').forEach(element => {
      const targets = document.querySelectorAll(`[name="${element.getAttribute('data-show-if-field')}"]`)
      
      // Get array of acceptable values
      let values = element.getAttribute('data-show-if-values')
      try { 
        values = JSON.parse(values) 
      } catch { 
        values = [values] 
      }
    
      targets.forEach(target => {
        target.addEventListener('change', () => {
          if (values.includes(target.value)) {
            element.classList.remove('hidden')
          } else {
            element.classList.add('hidden')
          }
        })
      })
    })
})
