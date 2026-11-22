// Корзина: добавление и удаление товаров, изменение количества, расчёт суммы.
// В корзине хранятся только id товара и количество: [{ id: 1, quantity: 2 }].
// Название и цена всегда берутся из массива products, поэтому в localStorage
// нельзя «подменить» цену товара.

const CART_STORAGE_KEY = 'devicehub-cart';
const PROMO_STORAGE_KEY = 'devicehub-promo';
const MAX_QUANTITY = 10;

// Промокоды: процентная скидка или фиксированная сумма с минимальным заказом
const promoCodes = {
  DEVICE10: { type: 'percent', value: 10, minTotal: 0, label: 'скидка 10%' },
  STUDENT500: { type: 'fixed', value: 500, minTotal: 5000, label: 'скидка 500 ₽ на заказ от 5 000 ₽' }
};

// ===============================
// 1. Состояние корзины
// ===============================
function isValidCartItem(item) {
  return (
    item !== null &&
    typeof item === 'object' &&
    Number.isInteger(item.id) &&
    Number.isInteger(item.quantity) &&
    item.quantity >= 1 &&
    item.quantity <= MAX_QUANTITY &&
    findProductById(products, item.id) !== undefined
  );
}

function loadCart() {
  const savedCart = loadFromStorage(CART_STORAGE_KEY, []);

  if (!Array.isArray(savedCart)) {
    return [];
  }

  // Отбрасываем испорченные записи и товары, которых больше нет в каталоге
  return savedCart.filter(isValidCartItem);
}

let cart = loadCart();

function saveCart() {
  saveToStorage(CART_STORAGE_KEY, cart);
  updateCartCounter();
}

function getCartItem(productId) {
  return cart.find((item) => item.id === productId);
}

function addToCart(productId) {
  const product = findProductById(products, productId);

  if (!product || !product.isAvailable) {
    return false;
  }

  const cartItem = getCartItem(productId);

  if (cartItem) {
    if (cartItem.quantity >= MAX_QUANTITY) {
      return false;
    }

    cartItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart();
  return true;
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
}

function changeQuantity(productId, quantity) {
  const cartItem = getCartItem(productId);

  if (!cartItem) {
    return;
  }

  if (quantity < 1) {
    removeFromCart(productId);
    return;
  }

  cartItem.quantity = Math.min(quantity, MAX_QUANTITY);
  saveCart();
}

function clearCart() {
  cart = [];
  saveCart();
}


// ===============================
// 2. Расчёты (reduce)
// ===============================
function getCartItemsCount() {
  return cart.reduce((count, item) => count + item.quantity, 0);
}

// Соединяем записи корзины с данными товаров
function getCartDetails() {
  return cart.map((item) => {
    const product = findProductById(products, item.id);
    const unitPrice = getFinalPrice(product);

    return {
      product,
      quantity: item.quantity,
      unitPrice,
      lineTotal: unitPrice * item.quantity
    };
  });
}

function calculateCartTotal(cartDetails) {
  return cartDetails.reduce((total, item) => total + item.lineTotal, 0);
}

// ===============================
// 2.1. Промокод
// ===============================
let appliedPromoCode = loadFromStorage(PROMO_STORAGE_KEY, null);

if (!promoCodes[appliedPromoCode]) {
  appliedPromoCode = null;
}

function applyPromoCode(code) {
  const normalizedCode = code.trim().toUpperCase();

  if (normalizedCode === '') {
    return { success: false, message: 'Введите промокод.' };
  }

  if (!promoCodes[normalizedCode]) {
    return { success: false, message: `Промокод «${normalizedCode}» не найден.` };
  }

  appliedPromoCode = normalizedCode;
  saveToStorage(PROMO_STORAGE_KEY, appliedPromoCode);
  return { success: true, message: `Промокод ${normalizedCode} применён: ${promoCodes[normalizedCode].label}.` };
}

function removePromoCode() {
  appliedPromoCode = null;
  removeFromStorage(PROMO_STORAGE_KEY);
}

function calculatePromoDiscount(subtotal, code) {
  const promo = promoCodes[code];

  if (!promo || subtotal < promo.minTotal) {
    return 0;
  }

  if (promo.type === 'percent') {
    return Math.round(subtotal * promo.value / 100);
  }

  return Math.min(promo.value, subtotal);
}

// Все суммы корзины в одном объекте: используется в корзине и на странице заказа
function getCartTotals() {
  const cartDetails = getCartDetails();
  const subtotal = calculateCartTotal(cartDetails);
  const discount = calculatePromoDiscount(subtotal, appliedPromoCode);
  const promo = promoCodes[appliedPromoCode];

  return {
    cartDetails,
    itemsCount: getCartItemsCount(),
    subtotal,
    discount,
    total: subtotal - discount,
    promoCode: appliedPromoCode,
    promoWarning: promo && subtotal < promo.minTotal
      ? `Промокод ${appliedPromoCode} действует на заказ от ${formatPrice(promo.minTotal)}.`
      : ''
  };
}

function getProductsWord(count) {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return 'товар';
  }

  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
    return 'товара';
  }

  return 'товаров';
}


// ===============================
// 3. Счётчик в шапке
// ===============================
function updateCartCounter() {
  const count = getCartItemsCount();

  document.querySelectorAll('[data-cart-count]').forEach((counter) => {
    counter.textContent = String(count);
  });

  document.querySelectorAll('.header-cart').forEach((link) => {
    link.setAttribute('aria-label', `Корзина: ${count} ${getProductsWord(count)}`);
  });
}

updateCartCounter();

// Если корзину изменили в другой вкладке, обновляем счётчик и страницу корзины
window.addEventListener('storage', (event) => {
  if (event.key === CART_STORAGE_KEY) {
    cart = loadCart();
    updateCartCounter();
    renderCart();
  }
});


// ===============================
// 4. Кнопки «В корзину» на всех страницах (делегирование)
// ===============================
document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action="add-to-cart"]');

  if (!button) {
    return;
  }

  const productId = Number(button.dataset.productId);
  const product = findProductById(products, productId);

  if (!product) {
    console.warn('Товар не найден:', productId);
    return;
  }

  if (addToCart(productId)) {
    showToast(`Товар «${product.title}» добавлен в корзину`);
    // На странице корзины товар можно добавить из раздела «Избранное»
    renderCart();
  } else {
    showToast(`Больше ${MAX_QUANTITY} шт. одного товара добавить нельзя`);
  }
});


// ===============================
// 5. Страница корзины
// ===============================
const cartList = document.querySelector('[data-cart-list]');
const cartEmpty = document.querySelector('.cart-empty');
const cartContent = document.querySelector('.cart-content');
const cartCountText = document.querySelector('[data-cart-items-count]');
const cartSubtotal = document.querySelector('[data-cart-subtotal]');
const cartTotal = document.querySelector('[data-cart-total]');
const cartDiscountRow = document.querySelector('[data-cart-discount-row]');
const cartDiscount = document.querySelector('[data-cart-discount]');
const promoForm = document.querySelector('[data-promo-form]');
const promoInput = document.querySelector('#promo-code');
const promoMessage = document.querySelector('[data-promo-message]');
const promoRemoveButton = document.querySelector('[data-action="remove-promo"]');
const clearCartButton = document.querySelector('[data-action="clear-cart"]');

function createQuantityButton(action, text, label, productId) {
  const button = createElement('button', 'quantity__button', text);
  button.type = 'button';
  button.dataset.action = action;
  button.dataset.productId = String(productId);
  button.setAttribute('aria-label', label);
  return button;
}

function createCartItem(item) {
  const { product, quantity, unitPrice, lineTotal } = item;
  const element = createElement('li', 'cart-item');

  const image = createProductImage(product, 'cart-item__image', '96px');
  image.loading = 'eager';

  const info = createElement('div', 'cart-item__info');
  const title = createElement('h3', 'cart-item__title');
  const link = createElement('a', 'cart-item__link', product.title);
  link.href = `product.html?id=${product.id}`;
  title.append(link);
  const price = createElement('p', 'cart-item__price', `${formatPrice(unitPrice)} за шт.`);
  info.append(title, price);

  const quantityBlock = createElement('div', 'quantity');
  const quantityInput = createElement('input', 'quantity__input');
  quantityInput.type = 'number';
  quantityInput.min = '1';
  quantityInput.max = String(MAX_QUANTITY);
  quantityInput.value = String(quantity);
  quantityInput.dataset.productId = String(product.id);
  quantityInput.setAttribute('aria-label', `Количество: ${product.title}`);

  const decreaseButton = createQuantityButton('decrease', '−', `Уменьшить количество: ${product.title}`, product.id);
  const increaseButton = createQuantityButton('increase', '+', `Увеличить количество: ${product.title}`, product.id);
  increaseButton.disabled = quantity >= MAX_QUANTITY;
  quantityBlock.append(decreaseButton, quantityInput, increaseButton);

  const total = createElement('p', 'cart-item__total', formatPrice(lineTotal));

  const removeButton = createElement('button', 'cart-item__remove', 'Удалить');
  removeButton.type = 'button';
  removeButton.dataset.action = 'remove';
  removeButton.dataset.productId = String(product.id);
  removeButton.setAttribute('aria-label', `Удалить из корзины: ${product.title}`);

  element.append(image, info, quantityBlock, total, removeButton);
  return element;
}

function renderCart() {
  if (!cartList) {
    return;
  }

  const totals = getCartTotals();

  cartList.textContent = '';
  totals.cartDetails.forEach((item) => cartList.append(createCartItem(item)));

  cartEmpty.hidden = totals.cartDetails.length > 0;
  cartContent.hidden = totals.cartDetails.length === 0;

  cartCountText.textContent = `${totals.itemsCount} ${getProductsWord(totals.itemsCount)}`;
  cartSubtotal.textContent = formatPrice(totals.subtotal);
  cartDiscountRow.hidden = totals.discount === 0;
  cartDiscount.textContent = `−${formatPrice(totals.discount)}`;
  cartTotal.textContent = formatPrice(totals.total);

  promoRemoveButton.hidden = !totals.promoCode;

  // Состояние активного промокода показываем при каждой перерисовке
  if (totals.promoCode) {
    showPromoMessage(
      totals.promoWarning || `Промокод ${totals.promoCode} применён: ${promoCodes[totals.promoCode].label}.`,
      Boolean(totals.promoWarning)
    );
  }
}

function showPromoMessage(text, isError) {
  promoMessage.textContent = text;
  promoMessage.classList.toggle('promo-form__message--error', isError);
}

if (cartList) {
  cartList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');

    if (!button) {
      return;
    }

    const productId = Number(button.dataset.productId);
    const cartItem = getCartItem(productId);

    if (!cartItem) {
      return;
    }

    if (button.dataset.action === 'increase') {
      changeQuantity(productId, cartItem.quantity + 1);
    }

    if (button.dataset.action === 'decrease') {
      changeQuantity(productId, cartItem.quantity - 1);
    }

    if (button.dataset.action === 'remove') {
      const product = findProductById(products, productId);
      removeFromCart(productId);
      showToast(`Товар «${product.title}» удалён из корзины`);
    }

    renderCart();
  });

  cartList.addEventListener('change', (event) => {
    if (!event.target.matches('.quantity__input')) {
      return;
    }

    const productId = Number(event.target.dataset.productId);
    const quantity = Number.parseInt(event.target.value, 10);

    changeQuantity(productId, Number.isNaN(quantity) ? 1 : quantity);
    renderCart();
  });

  if (promoForm) {
    promoForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const result = applyPromoCode(promoInput.value);

      if (result.success) {
        promoInput.value = '';
        renderCart();
      } else {
        showPromoMessage(result.message, true);
      }
    });

    promoRemoveButton.addEventListener('click', () => {
      removePromoCode();
      renderCart();
      showPromoMessage('Промокод отменён.', false);
    });
  }

  if (clearCartButton) {
    clearCartButton.addEventListener('click', () => {
      clearCart();
      renderCart();
      showToast('Корзина очищена');
    });
  }

  renderCart();
}
