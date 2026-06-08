document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelectorAll('tr.project').length > 0) {
    const companyRows = document.querySelectorAll('tr.company')

    companyRows.forEach(company => {
      company.addEventListener('click', function () {
        if (this.classList.contains('open')) {
          this.classList.remove('open')

          let nextRow = this.nextElementSibling
          while (nextRow && nextRow.classList.contains('project')) {
            nextRow.classList.add('row-hidden')
            if (nextRow.classList.contains('border-bottom')) {
              nextRow.classList.remove('border-bottom')
            }
            nextRow = nextRow.nextElementSibling
          }
        } else {
          companyRows.forEach(otherCompany => {
            otherCompany.classList.remove('open')
            let nextRow = otherCompany.nextElementSibling
            while (nextRow && nextRow.classList.contains('project')) {
              nextRow.classList.add('row-hidden')
              if (nextRow.classList.contains('border-bottom')) {
                nextRow.classList.remove('border-bottom')
              }
              nextRow = nextRow.nextElementSibling
            }
          })
          this.classList.add('open')
          let nextRow = this.nextElementSibling
          while (nextRow && nextRow.classList.contains('project')) {
            nextRow.classList.remove('row-hidden')
            if (!nextRow.nextElementSibling || nextRow.nextElementSibling.classList.contains('company')) {
              nextRow.classList.add('border-bottom')
            }
            nextRow = nextRow.nextElementSibling
          }
        }
        ScrollTrigger.refresh()
      })
    })
  }
})
