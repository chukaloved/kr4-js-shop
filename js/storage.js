// Работа с localStorage: сохранение корзины, избранного, промокода и темы.


function loadFromStorage(key, defaultValue) {
  try {
    const savedValue = localStorage.getItem(key);

    if (savedValue === null) {
      return defaultValue;
    }

    return JSON.parse(savedValue);
  } catch (error) {
    console.warn(`Не удалось прочитать «${key}» из localStorage:`, error);
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Не удалось сохранить «${key}» в localStorage:`, error);
  }
}

function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Не удалось удалить «${key}» из localStorage:`, error);
  }
}
