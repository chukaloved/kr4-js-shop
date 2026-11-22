// Базовая валидация форм: заявка (order.html), быстрая заявка (модальное окно)
// и обратная связь (contacts.html). Ошибки выводятся рядом с полями через textContent,
// alert() не используется.

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ===============================
// 1. Вывод и очистка ошибок
// ===============================
function getErrorElement(field) {
  const errorId = `${field.id}-error`;
  let errorElement = document.getElementById(errorId);

  // Элемент ошибки создаётся один раз и ставится сразу после поля
  if (!errorElement) {
    errorElement = createElement('p', 'form-error');
    errorElement.id = errorId;

    const anchor = field.type === 'checkbox' ? field.closest('label') : field;
    anchor.after(errorElement);

    const describedBy = field.getAttribute('aria-describedby');
    field.setAttribute('aria-describedby', describedBy ? `${describedBy} ${errorId}` : errorId);
  }

  return errorElement;
}

function showError(field, message) {
  getErrorElement(field).textContent = message;
  field.setAttribute('aria-invalid', 'true');
}

function clearError(field) {
  const errorElement = document.getElementById(`${field.id}-error`);

  if (errorElement) {
    errorElement.textContent = '';
  }

  field.removeAttribute('aria-invalid');
}


// ===============================
// 2. Правила проверки полей
// ===============================
function validateName(field) {
  const value = field.value.trim();

  if (value.length < 2) {
    return 'Введите имя не короче 2 символов.';
  }

  return '';
}

function validateEmail(field) {
  const value = field.value.trim();

  if (value === '') {
    return 'Введите e-mail.';
  }

  if (!emailPattern.test(value)) {
    return 'Введите корректный e-mail, например example@mail.ru.';
  }

  return '';
}

function validatePhone(field) {
  const digits = field.value.replace(/\D/g, '');

  if (digits.length === 0) {
    return 'Введите номер телефона.';
  }

  if (digits.length !== 11 || !['7', '8'].includes(digits[0])) {
    return 'Введите номер из 11 цифр, например +7 (900) 000-00-00.';
  }

  return '';
}

function validateSelect(field) {
  if (field.value === '') {
    return 'Выберите вариант из списка.';
  }

  return '';
}

function validateCheckbox(field) {
  if (!field.checked) {
    return 'Нужно согласие на обработку персональных данных.';
  }

  return '';
}

function validateMessage(field) {
  if (field.value.trim().length < 10) {
    return 'Напишите сообщение не короче 10 символов.';
  }

  return '';
}

// Для каждого имени поля — своя функция проверки
const fieldValidators = {
  name: validateName,
  email: validateEmail,
  phone: validatePhone,
  product: validateSelect,
  delivery: validateSelect,
  topic: validateSelect,
  subject: validateSelect,
  message: validateMessage,
  agreement: validateCheckbox
};

// Возвращает true, если поле заполнено правильно
function validateField(field) {
  const validator = fieldValidators[field.name];

  if (!validator || field.disabled) {
    return true;
  }

  const errorMessage = validator(field);

  if (errorMessage) {
    showError(field, errorMessage);
    return false;
  }

  clearError(field);
  return true;
}

function validateForm(form) {
  const fields = Array.from(form.elements).filter((field) => fieldValidators[field.name]);
  let firstInvalidField = null;

  fields.forEach((field) => {
    const isValid = validateField(field);

    if (!isValid && !firstInvalidField) {
      firstInvalidField = field;
    }
  });

  if (firstInvalidField) {
    firstInvalidField.focus();
    return false;
  }

  return true;
}


// ===============================
// 3. Подключение проверки к форме
// ===============================
function getFormMessage(form) {
  let message = form.querySelector('.form-message');

  if (!message) {
    message = createElement('p', 'form-message');
    message.setAttribute('role', 'status');
    form.querySelector('.order-form__actions').before(message);
  }

  return message;
}

function setupFormValidation(form, onSuccess) {
  if (!form) {
    return;
  }

  const formMessage = getFormMessage(form);

  form.addEventListener('submit', (event) => {
    // Отменяем стандартную отправку: на GitHub Pages нет сервера
    event.preventDefault();

    if (!validateForm(form)) {
      const errorsCount = form.querySelectorAll('[aria-invalid="true"]').length;
      formMessage.textContent = `Проверьте поля формы: ошибок — ${errorsCount}.`;
      formMessage.classList.add('form-message--error');
      return;
    }

    formMessage.textContent = '';
    formMessage.classList.remove('form-message--error');
    onSuccess(form, formMessage);
  });

  // Поле с ошибкой проверяется заново при вводе — ошибка исчезает сразу после исправления
  form.addEventListener('input', (event) => {
    if (event.target.getAttribute('aria-invalid') === 'true') {
      validateField(event.target);
    }
  });

  form.addEventListener('change', (event) => {
    if (event.target.getAttribute('aria-invalid') === 'true') {
      validateField(event.target);
    }
  });

  // Заполненное поле проверяется, когда пользователь уходит из него
  form.addEventListener('focusout', (event) => {
    const field = event.target;

    if (field.value && field.type !== 'checkbox') {
      validateField(field);
    }
  });
}


// ===============================
// 4. Формы на страницах заказа и контактов
// ===============================
function showPageSuccess(form, successElement) {
  form.reset();
  form.hidden = true;
  successElement.hidden = false;
  successElement.focus();
}

const orderPageForm = document.querySelector('#order-page-form');
const orderSuccess = document.querySelector('#order-success');
const feedbackForm = document.querySelector('#feedback-form');
const feedbackSuccess = document.querySelector('#feedback-success');

if (orderPageForm && orderSuccess) {
  setupFormValidation(orderPageForm, (form) => {
    console.log('Заявка прошла проверку; данные не отправлены на сервер.');
    showPageSuccess(form, orderSuccess);
  });
}

if (feedbackForm && feedbackSuccess) {
  setupFormValidation(feedbackForm, (form) => {
    showPageSuccess(form, feedbackSuccess);
  });
}
