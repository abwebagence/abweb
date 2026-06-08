window.addEventListener('DOMContentLoaded', function () {
  const radios = document.querySelectorAll('input[name="currency"]');
  const symbolEls = document.querySelectorAll('.currency-symbol');

  function setUIFromSymbol(symbol, { updateRadios = true } = {}) {
    // Update all currency symbols on the page
    symbolEls.forEach(el => { el.textContent = symbol; });

    // Optionally sync radios & active class
    if (updateRadios) {
      radios.forEach(r => {
        const active = (r.value === symbol);
        r.checked = active;
        r.closest('.form-selector')?.classList.toggle('is-active', active);
      });
    }

    // Persist choice
    try { localStorage.setItem('currency', symbol); } catch (e) {}
  }

  // Change handler: user clicks a currency
  radios.forEach(radio => {
    radio.addEventListener('change', function (e) {
      if (e.target.checked) {
        setUIFromSymbol(e.target.value, { updateRadios: false }); // radio already checked
      }
    });
  });

 let bootstrapped = false;
  try {
    const stored = localStorage.getItem('currency');
    if (stored) {
      setUIFromSymbol(stored); // also checks the matching radio
      bootstrapped = true;
    }
  } catch (e) {}

 if (!bootstrapped) {
    const xhr = new XMLHttpRequest();
    const params = new URLSearchParams();
    params.append('action', 'handle_currency');
    params.append('nonce', currency_ajax.nonce);

    xhr.open('POST', currency_ajax.ajax_url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.success && response.data && response.data.currency) {
            setUIFromSymbol(response.data.currency);
          }
        } catch (err) {
          console.error('Currency response error:', err);
        }
      } else {
        console.error('Currency AJAX failed:', xhr.status);
      }
    };

    xhr.send(params.toString());
  }
});
