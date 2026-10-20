/**
 * Компонент: валидация и отправка форм (.help__form, .footer__form).
 *
 * - валидация при потере фокуса и при отправке, ошибки показываются под полем;
 * - кнопка не блокируется заранее — пользователь всегда видит, что именно не так;
 * - если у формы есть data-endpoint, данные отправляются через fetch (POST);
 *   без него форма работает в демо-режиме (имитация успешной отправки).
 */
(() => {
  const ERROR_CLASS = 'custom-input--error';

  const MESSAGES = {
    name: 'Введите имя и фамилию',
    tel: 'Введите телефон в формате +7 000 000-00-00',
    email: 'Введите корректный e-mail',
    required: 'Обязательное поле'
  };

  const validateField = (field) => {
    const value = field.value.trim();
    let message = '';

    field.setCustomValidity('');

    if (value === '') {
      message = MESSAGES.required;
    } else if (field.type === 'tel') {
      const digits = value.replace(/\D/g, '');
      const allowedChars = /^\+?[\d\s\-()]+$/.test(value);

      if (!allowedChars || digits.length < 10 || digits.length > 15) {
        message = MESSAGES.tel;
      }
    } else if (field.type === 'email') {
      if (!field.checkValidity()) {
        message = MESSAGES.email;
      }
    } else if (field.name === 'name' && value.length < 2) {
      message = MESSAGES.name;
    }

    if (message) {
      field.setCustomValidity(message);
    }

    return message;
  };

  const showError = (field, message) => {
    const wrapper = field.closest('.custom-input');
    const messageElement = wrapper && wrapper.querySelector('.custom-input__message');

    if (wrapper) {
      wrapper.classList.toggle(ERROR_CLASS, Boolean(message));
    }

    if (messageElement && message) {
      messageElement.textContent = message;
    }

    field.setAttribute('aria-invalid', String(Boolean(message)));
  };

  const checkField = (field) => {
    const message = validateField(field);
    showError(field, message);
    return !message;
  };

  const getStatusElement = (form) => {
    const sibling = form.nextElementSibling;
    return sibling && sibling.classList.contains('form-status') ? sibling : null;
  };

  const setStatus = (form, text, isError = false) => {
    const status = getStatusElement(form);

    if (!status) {
      return;
    }

    status.textContent = text;
    status.classList.toggle('form-status--error', isError);
  };

  const sendForm = async (form) => {
    const endpoint = form.dataset.endpoint;

    if (!endpoint) {
      // Демо-режим: бэкенда нет
      return new Promise((resolve) => setTimeout(resolve, 600));
    }

    const response = await fetch(endpoint, {
      method: form.method || 'POST',
      body: new FormData(form)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response;
  };

  const initForm = (form) => {
    const fields = Array.from(form.querySelectorAll('.custom-input__field'));
    const submitButton = form.querySelector('[type="submit"]');

    if (!fields.length || !submitButton) {
      return;
    }

    fields.forEach((field) => {
      field.addEventListener('blur', () => {
        if (field.value.trim() !== '' || field.closest('.custom-input').classList.contains(ERROR_CLASS)) {
          checkField(field);
        }
      });

      // После первой ошибки перепроверяем на лету, чтобы ошибка исчезла сразу
      field.addEventListener('input', () => {
        if (field.closest('.custom-input').classList.contains(ERROR_CLASS)) {
          checkField(field);
        }
      });
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      setStatus(form, '');

      const invalidFields = fields.filter((field) => !checkField(field));

      if (invalidFields.length) {
        invalidFields[0].focus();
        return;
      }

      submitButton.disabled = true;
      submitButton.setAttribute('aria-busy', 'true');

      try {
        await sendForm(form);
        form.reset();
        fields.forEach((field) => showError(field, ''));
        setStatus(form, form.dataset.success || 'Спасибо! Форма отправлена.');
      } catch (error) {
        setStatus(form, 'Не удалось отправить форму. Попробуйте позже.', true);
      } finally {
        submitButton.disabled = false;
        submitButton.removeAttribute('aria-busy');
      }
    });
  };

  document.querySelectorAll('.help__form, .footer__form').forEach(initForm);
})();
