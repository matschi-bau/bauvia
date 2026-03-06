/* BAUVIA - Contact Form Handler */

(function() {
  'use strict';

  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    // Basic validation
    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const phone = form.querySelector('[name="phone"]');
    const service = form.querySelector('[name="service"]');
    const message = form.querySelector('[name="message"]');

    let valid = true;

    [name, email, message].forEach(field => {
      if (field && !field.value.trim()) {
        field.style.borderColor = '#ff4444';
        valid = false;
      } else if (field) {
        field.style.borderColor = '';
      }
    });

    if (email && email.value && !email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      email.style.borderColor = '#ff4444';
      valid = false;
    }

    if (!valid) return;

    // Submit
    btn.textContent = 'Wird gesendet...';
    btn.disabled = true;

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        // Redirect to thank you page
        window.location.href = '/danke.html';
      } else {
        throw new Error('Formular konnte nicht gesendet werden.');
      }
    } catch (error) {
      btn.textContent = originalText;
      btn.disabled = false;
      alert('Es gab ein Problem beim Senden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns telefonisch.');
    }
  });

  // Remove error styling on input
  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('input', () => {
      field.style.borderColor = '';
    });
  });

})();
