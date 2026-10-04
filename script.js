document.addEventListener('DOMContentLoaded', () => {
  const forms = [
    {
      button: document.querySelector('.help__button'),
      inputs: document.querySelectorAll('.help__form .custom-input__field')
    },
    {
      button: document.querySelector('.footer__form-button'),
      inputs: document.querySelectorAll('.footer__form .custom-input__field')
    }
  ];

  forms.forEach(({ button, inputs }) => {
    if (!button || !inputs.length) {
      return;
    }

    const updateButtonState = () => {
      const isValid = Array.from(inputs).every((input) => input.value.trim() !== '' && input.checkValidity());
      button.disabled = !isValid;
      button.setAttribute('aria-disabled', String(!isValid));
    };

    inputs.forEach((input) => {
      input.addEventListener('input', updateButtonState);
      input.addEventListener('blur', updateButtonState);
    });

    updateButtonState();
  });
});
