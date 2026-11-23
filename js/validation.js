// Базовая валидация форм: заявка (order.html), быстрая заявка (модальное окно)
// и обратная связь (contacts.html). Ошибки выводятся рядом с полями через textContent,
// alert() не используется.

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const namePattern = /^[A-Za-zА-Яа-яЁё\s-]+$/;

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

  if (!namePattern.test(value)) {
    return 'Имя может содержать только буквы, пробел и дефис.';
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

function validateQuantity(field) {
  const quantity = Number(field.value);

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
    return 'Укажите количество от 1 до 10.';
  }

  return '';
}

function validateAddress(field) {
  const delivery = field.form.elements.delivery;

  if (delivery && delivery.value === 'courier' && field.value.trim().length < 5) {
    return 'Укажите адрес для курьерской доставки.';
  }

  return '';
}

function validateDate(field) {
  if (field.value === '') {
    return '';
  }

  const today = new Date();
  const todayText = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0')
  ].join('-');

  if (field.value < todayText) {
    return 'Выберите сегодняшнюю или будущую дату.';
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

const fieldValidators = {
  name: validateName,
  email: validateEmail,
  phone: validatePhone,
  product: validateSelect,
  quantity: validateQuantity,
  delivery: validateSelect,
  address: validateAddress,
  date: validateDate,
  topic: validateSelect,
  subject: validateSelect,
  message: validateMessage,
  agreement: validateCheckbox
};

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
// 3. Маска телефона: +7 (900) 000-00-00
// Маска меняет только вид поля, правильность номера проверяет validatePhone
// ===============================
function formatPhone(value) {
  let digits = value.replace(/\D/g, '');

  if (digits === '') {
    return value.startsWith('+') ? '+' : '';
  }

  if (digits[0] === '8') {
    digits = `7${digits.slice(1)}`;
  } else if (digits[0] !== '7') {
    digits = `7${digits}`;
  }

  digits = digits.slice(0, 11);

  let result = '+7';

  if (digits.length > 1) {
    result += ` (${digits.slice(1, 4)}`;
  }

  if (digits.length >= 4) {
    result += ')';
  }

  if (digits.length > 4) {
    result += ` ${digits.slice(4, 7)}`;
  }

  if (digits.length > 7) {
    result += `-${digits.slice(7, 9)}`;
  }

  if (digits.length > 9) {
    result += `-${digits.slice(9, 11)}`;
  }

  return result;
}

function setupPhoneMask(form) {
  form.querySelectorAll('input[type="tel"]').forEach((input) => {
    input.addEventListener('input', (event) => {
      if (event.inputType && event.inputType.startsWith('delete')) {
        return;
      }
      if (input.selectionStart !== input.value.length) {
        return;
      }

      input.value = formatPhone(input.value);
    });
  });
}


// ===============================
// 4. Имитация отправки на сервер
// ===============================
function simulateSending() {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
}


// ===============================
// 5. Подключение проверки к форме
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

  setupPhoneMask(form);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (form.getAttribute('aria-busy') === 'true') {
      return;
    }

    if (!validateForm(form)) {
      const errorsCount = form.querySelectorAll('[aria-invalid="true"]').length;
      formMessage.textContent = `Проверьте поля формы: ошибок — ${errorsCount}.`;
      formMessage.classList.add('form-message--error');
      return;
    }

    const submitButton = form.querySelector('[type="submit"]');
    const buttonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Отправка…';
    form.setAttribute('aria-busy', 'true');
    formMessage.classList.remove('form-message--error');
    formMessage.textContent = 'Отправляем заявку…';

    await simulateSending();

    submitButton.disabled = false;
    submitButton.textContent = buttonText;
    form.removeAttribute('aria-busy');
    formMessage.textContent = '';

    onSuccess(form, formMessage);
  });
  form.addEventListener('input', (event) => {
    if (event.target.getAttribute('aria-invalid') === 'true') {
      validateField(event.target);
    }
  });

  form.addEventListener('change', (event) => {
    if (event.target.getAttribute('aria-invalid') === 'true') {
      validateField(event.target);
    }
    const address = form.elements.address;
    if (event.target.name === 'delivery' && address && address.getAttribute('aria-invalid') === 'true') {
      validateField(address);
    }
  });
}


// ===============================
// 6. Форма обратной связи (форма заказа подключается в order.js)
// ===============================
function showPageSuccess(form, successElement) {
  form.reset();
  form.hidden = true;
  successElement.hidden = false;
  successElement.focus();
}

const feedbackForm = document.querySelector('#feedback-form');
const feedbackSuccess = document.querySelector('#feedback-success');

if (feedbackForm && feedbackSuccess) {
  setupFormValidation(feedbackForm, (form) => {
    showPageSuccess(form, feedbackSuccess);
  });
}
