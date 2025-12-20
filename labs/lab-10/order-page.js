const API_KEY = "7d35d27d-711b-4c9e-9b60-66b6f3bf2a9d";
const API_URL = "https://edu.std-900.ist.mospolytech.ru";

let allDishes = [];

// Загрузка всех блюд из API
async function loadAllDishes() {
  try {
    const response = await fetch(
      `${API_URL}/labs/api/dishes?api_key=${API_KEY}`
    );
    if (!response.ok) throw new Error("Ошибка загрузки блюд");
    allDishes = await response.json();
    displayOrderSummary();
    updateOrderDisplay();
    updateOrderForm();
    updateTotalPrice();
  } catch (error) {
    console.error("Ошибка:", error);
    showError("Не удалось загрузить меню");
  }
}

// Отображение карточек блюд в секции "Состав заказа"
function displayOrderSummary() {
  const orderSummary = document.getElementById("order-summary");
  const order = getOrderFromStorage();

  const selectedDishes = Object.values(order).filter((dish) => dish !== null);

  if (selectedDishes.length === 0) {
    orderSummary.innerHTML = `
            <p class="no-selection-message">
                Ничего не выбрано. Чтобы добавить блюда в заказ, перейдите на страницу 
                <a href="menu.html">Собрать ланч</a>.
            </p>
        `;
    return;
  }

  let html = '<div class="dishes-grid">';

  selectedDishes.forEach((dishData) => {
    const dish = allDishes.find((d) => d.keyword === dishData.keyword);
    if (dish) {
      html += `
                <div class="dish-card" data-dish="${dish.keyword}">
                    <img src="${dish.image}" alt="${dish.name}" />
                    <p class="price">${dish.price} ₽</p>
                    <p class="dish-name">${dish.name}</p>
                    <p class="weight">${dish.count}</p>
                    <button class="dish-card-remove" onclick="removeFromOrder('${dish.keyword}')">
                        Удалить
                    </button>
                </div>
            `;
    }
  });

  html += "</div>";
  orderSummary.innerHTML = html;
}

// Удаление блюда из заказа
function removeFromOrder(dishKeyword) {
  const order = getOrderFromStorage();
  const dish = allDishes.find((d) => d.keyword === dishKeyword);

  if (dish && order[dish.category]?.keyword === dishKeyword) {
    order[dish.category] = null;
    saveOrderToStorage(order);
    displayOrderSummary();
    updateOrderDisplay();
    updateOrderForm();
    updateTotalPrice();
  }
}

// Очистка всего заказа
function clearOrder() {
  if (confirm("Вы уверены, что хотите очистить весь заказ?")) {
    localStorage.removeItem("businessLunchOrder");
    displayOrderSummary();
    updateOrderDisplay();
    updateOrderForm();
    updateTotalPrice();
  }
}

// Получение заказа из localStorage
function getOrderFromStorage() {
  const saved = localStorage.getItem("businessLunchOrder");
  return saved
    ? JSON.parse(saved)
    : {
        soup: null,
        main: null,
        salad: null,
        drink: null,
        dessert: null,
      };
}

// Сохранение заказа в localStorage
function saveOrderToStorage(order) {
  localStorage.setItem("businessLunchOrder", JSON.stringify(order));
}

// Обновление отображения заказа в левой панели формы
function updateOrderDisplay() {
  const orderContainer = document.getElementById("current-order-display");
  if (!orderContainer) return;

  const order = getOrderFromStorage();
  const selectedDishes = Object.values(order).filter((dish) => dish !== null);

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
                  order.soup
                    ? `<span class="dish-name">${order.soup.name}</span>
                     <span class="dish-price">${order.soup.price} ₽</span>`
                    : '<span class="no-dish">Не выбран</span>'
                }
            </div>
        </div>
    `;

  orderHTML += `
        <div class="order-category">
            <h4>Главное блюдо</h4>
            <div class="selected-dish">
                ${
                  order.main
                    ? `<span class="dish-name">${order.main.name}</span>
                     <span class="dish-price">${order.main.price} ₽</span>`
                    : '<span class="no-dish">Не выбрано</span>'
                }
            </div>
        </div>
    `;

  orderHTML += `
        <div class="order-category">
            <h4>Салат или стартер</h4>
            <div class="selected-dish">
                ${
                  order.salad
                    ? `<span class="dish-name">${order.salad.name}</span>
                     <span class="dish-price">${order.salad.price} ₽</span>`
                    : '<span class="no-dish">Не выбран</span>'
                }
            </div>
        </div>
    `;

  orderHTML += `
        <div class="order-category">
            <h4>Напиток</h4>
            <div class="selected-dish">
                ${
                  order.drink
                    ? `<span class="dish-name">${order.drink.name}</span>
                     <span class="dish-price">${order.drink.price} ₽</span>`
                    : '<span class="no-dish">Не выбран</span>'
                }
            </div>
        </div>
    `;

  orderHTML += `
        <div class="order-category">
            <h4>Десерт</h4>
            <div class="selected-dish">
                ${
                  order.dessert
                    ? `<span class="dish-name">${order.dessert.name}</span>
                     <span class="dish-price">${order.dessert.price} ₽</span>`
                    : '<span class="no-dish">Не выбран</span>'
                }
            </div>
        </div>
    `;

  orderContainer.innerHTML = orderHTML;
}

// Обновление скрытых полей формы с ID блюд
function updateOrderForm() {
  const order = getOrderFromStorage();

  document.getElementById("soup-id").value = "";
  document.getElementById("main-course-id").value = "";
  document.getElementById("salad-id").value = "";
  document.getElementById("drink-id").value = "";
  document.getElementById("dessert-id").value = "";

  // Находим ID блюд по их keyword
  if (order.soup) {
    const soupDish = allDishes.find((d) => d.keyword === order.soup.keyword);
    if (soupDish) document.getElementById("soup-id").value = soupDish.id;
  }
  if (order.main) {
    const mainDish = allDishes.find((d) => d.keyword === order.main.keyword);
    if (mainDish) document.getElementById("main-course-id").value = mainDish.id;
  }
  if (order.salad) {
    const saladDish = allDishes.find((d) => d.keyword === order.salad.keyword);
    if (saladDish) document.getElementById("salad-id").value = saladDish.id;
  }
  if (order.drink) {
    const drinkDish = allDishes.find((d) => d.keyword === order.drink.keyword);
    if (drinkDish) document.getElementById("drink-id").value = drinkDish.id;
  }
  if (order.dessert) {
    const dessertDish = allDishes.find(
      (d) => d.keyword === order.dessert.keyword
    );
    if (dessertDish)
      document.getElementById("dessert-id").value = dessertDish.id;
  }
}

// Обновление общей стоимости заказа
function updateTotalPrice() {
  const totalContainer = document.getElementById("order-total");
  if (!totalContainer) return;

  const order = getOrderFromStorage();
  const total = Object.values(order)
    .filter((dish) => dish !== null)
    .reduce((sum, dish) => sum + dish.price, 0);

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

// Валидация комбо
function validateCombo() {
  const order = getOrderFromStorage();
  const hasSoup = order.soup !== null;
  const hasMain = order.main !== null;
  const hasSalad = order.salad !== null;
  const hasDrink = order.drink !== null;

  const validCombos = [
    { soup: true, main: true, salad: true, drink: true },
    { soup: true, main: true, salad: false, drink: true },
    { soup: true, main: false, salad: true, drink: true },
    { soup: false, main: true, salad: true, drink: true },
    { soup: false, main: true, salad: false, drink: true },
  ];

  if (!hasSoup && !hasMain && !hasSalad && !hasDrink) {
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
  };
}

// Показать уведомление об ошибке
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

// Отправка заказа на сервер
async function submitOrder(event) {
  event.preventDefault();

  const validation = validateCombo();
  if (!validation.valid) {
    showNotification(validation.message, validation.image);
    return;
  }

  const form = document.getElementById("order-form");
  const formData = new FormData(form);
  const orderData = Object.fromEntries(formData.entries());

  // Преобразуем checkbox в 0/1
  orderData.subscribe = formData.get("subscribe") === "1" ? 1 : 0;

  // Если тип доставки "сейчас", удаляем время доставки
  if (orderData.delivery_type === "now") {
    delete orderData.delivery_time;
  }

  // Удаляем пустые поля ID и преобразуем их в числа
  ["soup_id", "main_course_id", "salad_id", "drink_id", "dessert_id"].forEach(
    (field) => {
      if (orderData[field] && orderData[field] !== "") {
        orderData[field] = parseInt(orderData[field]);
      } else {
        delete orderData[field]; // Удаляем поле, если оно пустое
      }
    }
  );

  try {
    const response = await fetch(
      `${API_URL}/labs/api/orders?api_key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Ошибка отправки заказа");
    }

    const result = await response.json();

    // Успешная отправка - очищаем localStorage
    localStorage.removeItem("businessLunchOrder");

    // Показываем сообщение об успехе
    showSuccessNotification(
      "Заказ успешно оформлен! Номер вашего заказа: " + result.id
    );

    // Обновляем страницу через 3 секунды
    setTimeout(() => {
      window.location.href = "index.html";
    }, 3000);
  } catch (error) {
    console.error("Ошибка оформления заказа:", error);
    showError("Ошибка оформления заказа: " + error.message);
  }
}

// Показать ошибку
function showError(message) {
  alert("Ошибка: " + message);
}

// Показать уведомление об успехе
function showSuccessNotification(message) {
  const overlay = document.createElement("div");
  overlay.className = "notification-overlay";

  const notification = document.createElement("div");
  notification.className = "notification";

  notification.innerHTML = `
        <h3>Успех!</h3>
        <p>${message}</p>
        <p>Вы будете перенаправлены на главную страницу...</p>
        <button class="notification-btn" onclick="this.closest('.notification-overlay').remove()">OK</button>
    `;

  overlay.appendChild(notification);
  document.body.appendChild(overlay);
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
  loadAllDishes();

  // Обработка изменения типа доставки
  document.querySelectorAll('input[name="delivery_type"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      const timeGroup = document.getElementById("delivery-time-group");
      const timeInput = document.getElementById("delivery-time");
      if (this.value === "by_time") {
        timeGroup.style.display = "block";
        timeInput.required = true;
      } else {
        timeGroup.style.display = "none";
        timeInput.required = false;
      }
    });
  });

  // Обработка отправки формы
  const form = document.getElementById("order-form");
  if (form) {
    form.addEventListener("submit", submitOrder);
  }
});
