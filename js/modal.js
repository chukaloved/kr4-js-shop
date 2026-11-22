// Модальное окно быстрой заявки на главной странице (<dialog>).

const orderDialog = document.querySelector('#order-dialog');
const dialogForm = document.querySelector('#order-form');
const selectedProductInput = document.querySelector('#selected-product');
const dialogProductText = document.querySelector('#order-dialog-product');
const dialogSuccessMessage = document.querySelector('#success-message');
let lastDialogTrigger = null;

function openOrderDialog(button) {
  const productName = button.dataset.product;

  lastDialogTrigger = button;
  selectedProductInput.value = productName;
  dialogProductText.textContent = `Товар: ${productName}`;

  orderDialog.showModal();
  orderDialog.querySelector('input:not([type="hidden"])').focus();
}

if (orderDialog && dialogForm) {
  // Кнопки «Заказать» создаются JavaScript, поэтому слушаем клик на документе
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action="order"]');

    if (button) {
      openOrderDialog(button);
    }
  });

  orderDialog.querySelectorAll('[data-close-dialog]').forEach((button) => {
    button.addEventListener('click', () => orderDialog.close());
  });

  // Клик по затемнённому фону закрывает окно
  orderDialog.addEventListener('click', (event) => {
    if (event.target !== orderDialog) {
      return;
    }

    const rect = orderDialog.getBoundingClientRect();
    const isOutside =
      event.clientX < rect.left || event.clientX > rect.right ||
      event.clientY < rect.top || event.clientY > rect.bottom;

    if (isOutside) {
      orderDialog.close();
    }
  });

  // Esc закрывает <dialog> сам; после закрытия возвращаем фокус на кнопку «Заказать»
  orderDialog.addEventListener('close', () => {
    if (lastDialogTrigger) {
      lastDialogTrigger.focus();
    }
  });

  dialogForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!validateForm(dialogForm)) {
      return;
    }

    dialogForm.reset();
    orderDialog.close();

    dialogSuccessMessage.hidden = false;
    console.log('Заявка из модального окна подготовлена:', selectedProductInput.value);
  });
}
