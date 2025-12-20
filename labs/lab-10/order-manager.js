let currentOrder = {
  soup: null,
  main: null,
  salad: null,
  drink: null,
  dessert: null,
};

const validCombos = [
  // 1: Суп + Главное + Салат + Напиток
  { soup: true, main: true, salad: true, drink: true },
  // 2: Суп + Главное + Напиток
  { soup: true, main: true, salad: false, drink: true },
  // 3: Суп + Салат + Напиток
  { soup: true, main: false, salad: true, drink: true },
  // 4: Главное + Салат + Напиток
  { soup: false, main: true, salad: true, drink: true },
  // 5: Главное + Напиток
  { soup: false, main: true, salad: false, drink: true },
];

// ========== ФУНКЦИИ ДЛЯ LOCALSTORAGE ==========

function getOrderFromStorage() {
  const saved = localStorage.getItem("businessLunchOrder");
  if (!saved) {
    return {
      soup: null,
      main: null,
      salad: null,
      drink: null,
      dessert: null,
    };
  }

  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error("Ошибка чтения заказа из localStorage:", e);
    return {
      soup: null,
      main: null,
      salad: null,
      drink: null,
      dessert: null,
    };
  }
}

function saveOrderToStorage(order) {
  try {
    // Сохраняем только необходимые данные для экономии места
    const simplifiedOrder = {};
    for (const category in order) {
      if (order[category]) {
        simplifiedOrder[category] = {
          keyword: order[category].keyword,
          name: order[category].name,
          price: order[category].price,
          count: order[category].count,
          image: order[category].image,
        };
      } else {
        simplifiedOrder[category] = null;
      }
    }
    localStorage.setItem("businessLunchOrder", JSON.stringify(simplifiedOrder));
  } catch (e) {
    console.error("Ошибка сохранения заказа в localStorage:", e);
  }
}

function loadOrderFromStorage() {
  const savedOrder = getOrderFromStorage();
  currentOrder = savedOrder;

  // Обновляем интерфейс
  updateOrderDisplay();
  updateOrderForm();
  updateTotalPrice();
  updateStickyPanel();

  return currentOrder;
}

// ========== ОСНОВНЫЕ ФУНКЦИИ УПРАВЛЕНИЯ ЗАКАЗОМ ==========

function addDishToOrder(dish) {
  // Сохраняем полные данные о блюде
  currentOrder[dish.category] = {
    keyword: dish.keyword,
    name: dish.name,
    price: dish.price,
    count: dish.count,
    image: dish.image,
    id: dish.id, // ID для отправки на сервер
    kind: dish.kind,
  };

  // Сохраняем в localStorage
  saveOrderToStorage(currentOrder);

  // Обновляем интерфейс
  updateOrderDisplay();
  updateOrderForm();
  updateTotalPrice();
  updateStickyPanel();

  // Показываем уведомление об успешном добавлении
  showDishAddedNotification(dish);

  // Обновляем выделение блюд на странице меню
  if (window.highlightSelectedDishes) {
    window.highlightSelectedDishes();
  }
}

function removeDishFromOrder(category) {
  if (currentOrder[category]) {
    currentOrder[category] = null;
    saveOrderToStorage(currentOrder);

    updateOrderDisplay();
    updateOrderForm();
    updateTotalPrice();
    updateStickyPanel();

    if (window.highlightSelectedDishes) {
      window.highlightSelectedDishes();
    }

    return true;
  }
  return false;
}

function clearOrder() {
  if (confirm("Вы уверены, что хотите очистить весь заказ?")) {
    currentOrder = {
      soup: null,
      main: null,
      salad: null,
      drink: null,
      dessert: null,
    };
    localStorage.removeItem("businessLunchOrder");

    updateOrderDisplay();
    updateOrderForm();
    updateTotalPrice();
    updateStickyPanel();

    if (window.highlightSelectedDishes) {
      window.highlightSelectedDishes();
    }

    return true;
  }
  return false;
}

function getCurrentOrder() {
  return { ...currentOrder };
}

function getOrderTotal() {
  return Object.values(currentOrder)
    .filter((dish) => dish !== null)
    .reduce((sum, dish) => sum + dish.price, 0);
}

// ========== ФУНКЦИИ ОБНОВЛЕНИЯ ИНТЕРФЕЙСА ==========

function updateOrderDisplay() {
  const orderContainer = document.getElementById("current-order-display");
  if (!orderContainer) return;

  const selectedDishes = Object.values(currentOrder).filter(
    (dish) => dish !== null
  );

  if (selectedDishes.length === 0) {
    orderContainer.innerHTML = '<p class="no-selection">Ничего не выбрано</p>';
    return;
  }

  let orderHTML = "";

  orderHTML += `
        <div class="order-category">
            <h4>Суп</h4>
            <div class="selected-dish">
                ${
                  currentOrder.soup
                    ? `<span class="dish-name">${currentOrder.soup.name}</span>
                     <span class="dish-price">${currentOrder.soup.price} ₽</span>`
                    : '<span class="no-dish">Блюдо не выбрано</span>'
                }
            </div>
        </div>
    `;

  orderHTML += `
        <div class="order-category">
            <h4>Главное блюдо</h4>
            <div class="selected-dish">
                ${
                  currentOrder.main
                    ? `<span class="dish-name">${currentOrder.main.name}</span>
                     <span class="dish-price">${currentOrder.main.price} ₽</span>`
                    : '<span class="no-dish">Блюдо не выбрано</span>'
                }
            </div>
        </div>
    `;

  orderHTML += `
        <div class="order-category">
            <h4>Салат или стартер</h4>
            <div class="selected-dish">
                ${
                  currentOrder.salad
                    ? `<span class="dish-name">${currentOrder.salad.name}</span>
                     <span class="dish-price">${currentOrder.salad.price} ₽</span>`
                    : '<span class="no-dish">Блюдо не выбрано</span>'
                }
            </div>
        </div>
    `;

  orderHTML += `
        <div class="order-category">
            <h4>Напиток</h4>
            <div class="selected-dish">
                ${
                  currentOrder.drink
                    ? `<span class="dish-name">${currentOrder.drink.name}</span>
                     <span class="dish-price">${currentOrder.drink.price} ₽</span>`
                    : '<span class="no-dish">Напиток не выбран</span>'
                }
            </div>
        </div>
    `;

  orderHTML += `
        <div class="order-category">
            <h4>Десерт</h4>
            <div class="selected-dish">
                ${
                  currentOrder.dessert
                    ? `<span class="dish-name">${currentOrder.dessert.name}</span>
                     <span class="dish-price">${currentOrder.dessert.price} ₽</span>`
                    : '<span class="no-dish">Десерт не выбран</span>'
                }
            </div>
        </div>
    `;

  orderContainer.innerHTML = orderHTML;
}

function updateOrderForm() {
  const soupInput = document.getElementById("selected-soup");
  const mainInput = document.getElementById("selected-main");
  const saladInput = document.getElementById("selected-salad");
  const drinkInput = document.getElementById("selected-drink");
  const dessertInput = document.getElementById("selected-dessert");

  if (soupInput)
    soupInput.value = currentOrder.soup ? currentOrder.soup.keyword : "";
  if (mainInput)
    mainInput.value = currentOrder.main ? currentOrder.main.keyword : "";
  if (saladInput)
    saladInput.value = currentOrder.salad ? currentOrder.salad.keyword : "";
  if (drinkInput)
    drinkInput.value = currentOrder.drink ? currentOrder.drink.keyword : "";
  if (dessertInput)
    dessertInput.value = currentOrder.dessert
      ? currentOrder.dessert.keyword
      : "";

  // Обновляем также скрытые поля для ID на странице заказа
  const soupIdInput = document.getElementById("soup-id");
  const mainIdInput = document.getElementById("main-course-id");
  const saladIdInput = document.getElementById("salad-id");
  const drinkIdInput = document.getElementById("drink-id");
  const dessertIdInput = document.getElementById("dessert-id");

  if (soupIdInput)
    soupIdInput.value = currentOrder.soup ? currentOrder.soup.id || "" : "";
  if (mainIdInput)
    mainIdInput.value = currentOrder.main ? currentOrder.main.id || "" : "";
  if (saladIdInput)
    saladIdInput.value = currentOrder.salad ? currentOrder.salad.id || "" : "";
  if (drinkIdInput)
    drinkIdInput.value = currentOrder.drink ? currentOrder.drink.id || "" : "";
  if (dessertIdInput)
    dessertIdInput.value = currentOrder.dessert
      ? currentOrder.dessert.id || ""
      : "";
}

function updateTotalPrice() {
  const totalContainer = document.getElementById("order-total");
  if (!totalContainer) return;

  const total = getOrderTotal();

  if (total === 0) {
    totalContainer.style.display = "none";
  } else {
    totalContainer.style.display = "block";
    totalContainer.innerHTML = `
            <div class="total-price">
                <h4>Стоимость заказа</h4>
                <div class="total-amount">${total} ₽</div>
            </div>
        `;
  }
}

function updateStickyPanel() {
  const panel = document.getElementById("sticky-order-panel");
  if (!panel) return;

  const selectedDishes = Object.values(currentOrder).filter(
    (dish) => dish !== null
  );

  if (selectedDishes.length === 0) {
    panel.classList.add("hidden");
    return;
  }

  panel.classList.remove("hidden");

  const total = getOrderTotal();
  const totalElement = panel.querySelector(".total-amount");
  if (totalElement) {
    totalElement.textContent = total + " ₽";
  }

  const proceedBtn = panel.querySelector(".proceed-btn");
  const validation = validateCombo();

  if (validation.valid) {
    proceedBtn.classList.remove("disabled");
    proceedBtn.href = "order.html";
    proceedBtn.onclick = null; // Убираем обработчик ошибок
  } else {
    proceedBtn.classList.add("disabled");
    proceedBtn.href = "#";
    proceedBtn.onclick = function (e) {
      e.preventDefault();
      showNotification(validation.message, validation.image);
    };
  }
}

// ========== ВАЛИДАЦИЯ КОМБО ==========

function validateCombo() {
  const hasSoup = currentOrder.soup !== null;
  const hasMain = currentOrder.main !== null;
  const hasSalad = currentOrder.salad !== null;
  const hasDrink = currentOrder.drink !== null;
  const hasDessert = currentOrder.dessert !== null;

  if (!hasSoup && !hasMain && !hasSalad && !hasDrink && !hasDessert) {
    return {
      valid: false,
      message: "Ничего не выбрано. Выберите блюда для заказа",
    };
  }

  const isValidCombo = validCombos.some(
    (combo) =>
      combo.soup === hasSoup &&
      combo.main === hasMain &&
      combo.salad === hasSalad &&
      combo.drink === hasDrink
  );

  if (isValidCombo) {
    return { valid: true };
  }

  if (!hasDrink) {
    return {
      valid: false,
      message: "Выберите напиток",
      image: "images/drink.png",
    };
  }

  if (hasSoup && !hasMain && !hasSalad) {
    return {
      valid: false,
      message: "Выберите главное блюдо или салат/стартер",
    };
  }

  if (hasSalad && !hasSoup && !hasMain) {
    return {
      valid: false,
      message: "Выберите суп или главное блюдо",
    };
  }

  if (!hasSoup && !hasMain && !hasSalad) {
    return {
      valid: false,
      message: "Выберите главное блюдо",
      image: "images/main.png",
    };
  }

  return {
    valid: false,
    message: "Выбранная комбинация блюд недоступна. Проверьте состав заказа",
    image: "images/combo.png",
  };
}

// ========== УВЕДОМЛЕНИЯ ==========

function showNotification(message, imageSrc) {
  const overlay = document.createElement("div");
  overlay.className = "notification-overlay";

  const notification = document.createElement("div");
  notification.className = "notification";

  let img = null;
  if (imageSrc) {
    img = document.createElement("img");
    img.src = imageSrc;
    img.alt = "Уведомление";
  }

  const text = document.createElement("p");
  text.textContent = message;

  const button = document.createElement("button");
  button.className = "notification-btn";
  button.textContent = "Окей";
  button.onclick = function () {
    document.body.removeChild(overlay);
  };

  if (img) notification.appendChild(img);
  notification.appendChild(text);
  notification.appendChild(button);
  overlay.appendChild(notification);

  document.body.appendChild(overlay);
}

function showDishAddedNotification(dish) {
  const overlay = document.createElement("div");
  overlay.className = "notification-overlay";

  const notification = document.createElement("div");
  notification.className = "notification";
  notification.style.textAlign = "center";

  const img = document.createElement("img");
  img.src = dish.image;
  img.alt = dish.name;
  img.style.width = "100px";
  img.style.height = "100px";
  img.style.borderRadius = "15px";
  img.style.objectFit = "cover";
  img.style.marginBottom = "15px";

  const text = document.createElement("p");
  text.textContent = `"${dish.name}" добавлен в заказ!`;
  text.style.fontWeight = "bold";
  text.style.marginBottom = "10px";

  const price = document.createElement("p");
  price.textContent = `Цена: ${dish.price} ₽`;
  price.style.color = "tomato";
  price.style.marginBottom = "20px";

  const button = document.createElement("button");
  button.className = "notification-btn";
  button.textContent = "Продолжить выбор";
  button.style.padding = "10px 20px";
  button.onclick = function () {
    document.body.removeChild(overlay);
  };

  notification.appendChild(img);
  notification.appendChild(text);
  notification.appendChild(price);
  notification.appendChild(button);
  overlay.appendChild(notification);

  document.body.appendChild(overlay);

  // Автоматически скрываем через 2 секунды
  setTimeout(() => {
    if (document.body.contains(overlay)) {
      document.body.removeChild(overlay);
    }
  }, 2000);
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========

function initializeOrderManager() {
  // Загружаем сохраненный заказ из localStorage
  loadOrderFromStorage();

  // Обновляем интерфейс
  updateOrderDisplay();
  updateTotalPrice();
  updateStickyPanel();

  // Добавляем обработчик формы на странице menu.html
  const form = document.getElementById("order-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      const validation = validateCombo();
      if (!validation.valid) {
        event.preventDefault();
        showNotification(validation.message, validation.image);
      }
    });
  }
}

// Экспортируем функции для использования в других файлах
window.getOrderFromStorage = getOrderFromStorage;
window.saveOrderToStorage = saveOrderToStorage;
window.addDishToOrder = addDishToOrder;
window.removeDishFromOrder = removeDishFromOrder;
window.clearOrder = clearOrder;
window.getCurrentOrder = getCurrentOrder;
window.getOrderTotal = getOrderTotal;
window.validateCombo = validateCombo;
window.updateStickyPanel = updateStickyPanel;
window.resetOrder = clearOrder; // Для обратной совместимости

// Инициализируем при загрузке страницы
document.addEventListener("DOMContentLoaded", initializeOrderManager);
