// Страница оформления заказа: список товаров из массива products,
// предвыбор товара по ссылке order.html?product=3 и заказ товаров из корзины.

const orderPageForm = document.querySelector('#order-page-form');
const orderSuccess = document.querySelector('#order-success');
const orderSuccessText = document.querySelector('[data-order-success-text]');
const orderProductSelect = document.querySelector('#order-product');
const orderQuantityInput = document.querySelector('#order-quantity');
const orderCart = document.querySelector('[data-order-cart]');
const orderCartList = document.querySelector('[data-order-cart-list]');
const orderCartTotal = document.querySelector('[data-order-cart-total]');
const singleProductFields = document.querySelectorAll('[data-single-product]');

function fillProductSelect() {
  getAvailableOrderProducts().forEach((product) => {
    const option = createElement('option', '', `${product.title} — ${formatPrice(getFinalPrice(product))}`);
    option.value = String(product.id);
    orderProductSelect.append(option);
  });
}

function getAvailableOrderProducts() {
  return products.filter((product) => product.isAvailable);
}

function preselectProduct() {
  const productId = Number(new URLSearchParams(window.location.search).get('product'));
  const product = findProductById(getAvailableOrderProducts(), productId);

  if (product) {
    orderProductSelect.value = String(product.id);
  }
}

function renderOrderCart() {
  const totals = getCartTotals();
  const hasCartItems = totals.itemsCount > 0;

  orderCart.hidden = !hasCartItems;

  singleProductFields.forEach((field) => {
    field.hidden = hasCartItems;
  });

  orderProductSelect.disabled = hasCartItems;
  orderQuantityInput.disabled = hasCartItems;

  if (!hasCartItems) {
    return;
  }

  orderCartList.textContent = '';
  totals.cartDetails.forEach((item) => {
    const line = createElement('li', 'order-cart__item',
      `${item.product.title} × ${item.quantity} — ${formatPrice(item.lineTotal)}`);
    orderCartList.append(line);
  });

  let totalText = `Итого: ${formatPrice(totals.total)}`;

  if (totals.discount > 0) {
    totalText += ` (с промокодом ${totals.promoCode}, скидка ${formatPrice(totals.discount)})`;
  }

  orderCartTotal.textContent = totalText;
}

function getOrderSummary() {
  const totals = getCartTotals();

  if (totals.itemsCount > 0) {
    return `${totals.itemsCount} ${getProductsWord(totals.itemsCount)} на сумму ${formatPrice(totals.total)}`;
  }

  const product = findProductById(products, Number(orderProductSelect.value));
  const quantity = Number(orderQuantityInput.value);
  return `${product.title} × ${quantity} на сумму ${formatPrice(getFinalPrice(product) * quantity)}`;
}

if (orderPageForm && orderSuccess) {
  fillProductSelect();
  preselectProduct();
  renderOrderCart();

  setupFormValidation(orderPageForm, (form) => {
    const summary = getOrderSummary();

    console.log('Заявка прошла проверку; данные не отправлены на сервер:', summary);
    orderSuccessText.textContent = `Заказ: ${summary}. Мы свяжемся с вами для подтверждения.`;

    if (getCartItemsCount() > 0) {
      clearCart();
      removePromoCode();
    }

    showPageSuccess(form, orderSuccess);
  });
}
