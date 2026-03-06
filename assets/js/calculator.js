/* BAUVIA - Kostenrechner (Price Calculator) */

(function() {
  'use strict';

  // Pricing data per m² (from brief)
  const pricing = {
    'komplettsanierung':   { min: 800, max: 1400, label: 'Komplettsanierung' },
    'badsanierung':        { min: 900, max: 1600, label: 'Badsanierung' },
    'bodenarbeiten':       { min: 40,  max: 120,  label: 'Bodenarbeiten' },
    'malerarbeiten':       { min: 15,  max: 45,   label: 'Malerarbeiten' },
    'trockenbau':          { min: 50,  max: 90,   label: 'Trockenbau' },
    'fassade':             { min: 80,  max: 200,  label: 'Fassadenarbeiten' },
    'dach':                { min: 100, max: 250,  label: 'Dacharbeiten' },
    'fenster':             { min: 400, max: 800,  label: 'Fenster & Türen (pro Stück)' },
    'elektro':             { min: 60,  max: 120,  label: 'Elektroinstallation' },
    'abbruch':             { min: 30,  max: 80,   label: 'Abbrucharbeiten' }
  };

  // Condition multipliers
  const conditionMultiplier = {
    'gut':    0.8,
    'mittel': 1.0,
    'schlecht': 1.3
  };

  let currentStep = 1;
  const totalSteps = 4;

  // DOM elements
  const steps = document.querySelectorAll('.calculator__step');
  const progressBars = document.querySelectorAll('.calculator__progress-bar');
  const priceDisplay = document.getElementById('calc-price');
  const serviceSelect = document.getElementById('calc-service');
  const areaInput = document.getElementById('calc-area');
  const radioButtons = document.querySelectorAll('.calculator__radio input[name="condition"]');

  // Radio button selection styling
  document.querySelectorAll('.calculator__radio').forEach(radio => {
    radio.addEventListener('click', () => {
      const input = radio.querySelector('input');
      input.checked = true;
      // Update visual state
      document.querySelectorAll('.calculator__radio').forEach(r => r.classList.remove('selected'));
      radio.classList.add('selected');
    });
  });

  function showStep(step) {
    steps.forEach((s, i) => {
      s.classList.toggle('active', i === step - 1);
    });
    progressBars.forEach((bar, i) => {
      bar.classList.toggle('active', i < step);
    });
    currentStep = step;
  }

  function getSelectedCondition() {
    const checked = document.querySelector('input[name="condition"]:checked');
    return checked ? checked.value : 'mittel';
  }

  function calculatePrice() {
    const service = serviceSelect ? serviceSelect.value : '';
    const area = areaInput ? parseFloat(areaInput.value) : 0;
    const condition = getSelectedCondition();

    if (!service || !pricing[service] || !area || area <= 0) {
      return { min: 0, max: 0 };
    }

    const p = pricing[service];
    const mult = conditionMultiplier[condition] || 1.0;

    let minPrice, maxPrice;

    if (service === 'fenster') {
      // Fenster is per unit, not per m²
      minPrice = Math.round(p.min * area * mult);
      maxPrice = Math.round(p.max * area * mult);
    } else {
      minPrice = Math.round(p.min * area * mult);
      maxPrice = Math.round(p.max * area * mult);
    }

    return { min: minPrice, max: maxPrice };
  }

  function formatPrice(num) {
    return num.toLocaleString('de-DE') + ' €';
  }

  // Global functions called from HTML onclick attributes
  window.calcNext = function() {
    if (currentStep === 1 && serviceSelect && !serviceSelect.value) {
      serviceSelect.style.borderColor = '#ff4444';
      setTimeout(() => { serviceSelect.style.borderColor = ''; }, 2000);
      return;
    }

    if (currentStep === 2 && areaInput) {
      const val = parseFloat(areaInput.value);
      if (!val || val <= 0) {
        areaInput.style.borderColor = '#ff4444';
        setTimeout(() => { areaInput.style.borderColor = ''; }, 2000);
        return;
      }
    }

    if (currentStep < totalSteps) {
      if (currentStep === 3) {
        // Moving to result step - calculate price
        const result = calculatePrice();
        if (priceDisplay) {
          priceDisplay.textContent = formatPrice(result.min) + ' – ' + formatPrice(result.max);
        }
      }
      showStep(currentStep + 1);
    }
  };

  window.calcPrev = function() {
    if (currentStep > 1) {
      showStep(currentStep - 1);
    }
  };

  window.calcReset = function() {
    if (serviceSelect) serviceSelect.value = '';
    if (areaInput) areaInput.value = '';
    document.querySelectorAll('.calculator__radio').forEach(r => r.classList.remove('selected'));
    const mittelRadio = document.querySelector('input[name="condition"][value="mittel"]');
    if (mittelRadio) {
      mittelRadio.checked = true;
      mittelRadio.closest('.calculator__radio').classList.add('selected');
    }
    showStep(1);
  };

  // Initialize
  showStep(1);

})();
