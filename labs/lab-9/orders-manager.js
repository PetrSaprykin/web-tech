const API_KEY = "7d35d27d-711b-4c9e-9b60-66b6f3bf2a9d";
const API_URL = "https://edu.std-900.ist.mospolytech.ru";
let allDishes = [];
let allOrders = [];
let currentOrderIdForAction = null;

// Загрузка всех блюд из API
async function loadAllDishes() {
  try {
    const response = await fetch(
      `${API_URL}/labs/api/dishes?api_key=${API_KEY}`
    );
    if (!response.ok) throw new Error("Ошибка загрузки блюд");
    allDishes = await response.json();
  } catch (error) {
    console.error("Ошибка при загрузке блюд:", error);
    showError("Не удалось загрузить меню");
  }
}

// Загрузка заказов пользователя
async function loadOrders() {
  const ordersContainer = document.getElementById("orders-container");

  try {
    ordersContainer.innerHTML = `
      <div class="loading">
        <i class="bi bi-arrow-clockwise"></i>
        <p>Загрузка истории заказов...</p>
      </div>
    `;

    const response = await fetch(
      `${API_URL}/labs/api/orders?api_key=${API_KEY}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Ошибка загрузки заказов");
    }

    allOrders = await response.json();

    // Сортируем по дате создания (новые сверху)
    allOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    displayOrders();
  } catch (error) {
    console.error("Ошибка при загрузке заказов:", error);
    ordersContainer.innerHTML = `
      <div class="no-orders">
        <i class="bi bi-exclamation-triangle"></i>
        <p>Не удалось загрузить историю заказов.</p>
        <p>Попробуйте обновить страницу позже.</p>
        <p>${error.message}</p>
      </div>
    `;
  }
}

// Отображение списка заказов
function displayOrders() {
  const ordersContainer = document.getElementById("orders-container");

  if (!allOrders || allOrders.length === 0) {
    ordersContainer.innerHTML = `
      <div class="no-orders">
        <i class="bi bi-cart"></i>
        <p>У вас еще нет заказов.</p>
        <p>Перейдите на страницу <a href="menu.html">Собрать ланч</a>, чтобы оформить первый заказ!</p>
      </div>
    `;
    return;
  }

  let ordersHTML = "";

  allOrders.forEach((order, index) => {
    const orderDate = new Date(order.created_at);
    const formattedDate = orderDate.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const dishesList = getDishesList(order);
    const totalPrice = calculateOrderTotal(order);
    const deliveryInfo = getDeliveryInfo(order);

    ordersHTML += `
      <div class="order-card" data-order-id="${order.id}">
        <div class="order-header">
          <div class="order-number">
            <span class="order-number-badge">${index + 1}</span>
            <span class="order-date">${formattedDate}</span>
          </div>
          <div class="order-actions">
            <button class="action-btn view" onclick="showOrderDetails(${
              order.id
            })" title="Подробнее">
              <i class="bi bi-eye"></i>
            </button>
            <button class="action-btn edit" onclick="editOrder(${
              order.id
            })" title="Редактировать">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="action-btn delete" onclick="deleteOrder(${
              order.id
            })" title="Удалить">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
        
        <div class="order-content">
          <div class="order-dishes">
            ${dishesList}
          </div>
          
          <div class="order-price">
            <span class="order-price-label">Стоимость:</span>
            <span class="order-price-value">${totalPrice} ₽</span>
          </div>
          
          <div class="order-delivery">
            <span class="order-delivery-label">Доставка:</span>
            <span class="order-delivery-value">${deliveryInfo}</span>
          </div>
        </div>
        
        <div class="order-footer">
          <span class="order-id">ID заказа: ${order.id}</span>
          <span class="order-status delivered">Доставлен</span>
        </div>
      </div>
    `;
  });

  ordersContainer.innerHTML = ordersHTML;
}

// Получение списка блюд заказа
function getDishesList(order) {
  let dishes = [];

  // Получаем названия блюд по их ID
  if (order.soup_id) {
    const dish = allDishes.find((d) => d.id === order.soup_id);
    if (dish) dishes.push(dish.name);
  }

  if (order.main_course_id) {
    const dish = allDishes.find((d) => d.id === order.main_course_id);
    if (dish) dishes.push(dish.name);
  }

  if (order.salad_id) {
    const dish = allDishes.find((d) => d.id === order.salad_id);
    if (dish) dishes.push(dish.name);
  }

  if (order.drink_id) {
    const dish = allDishes.find((d) => d.id === order.drink_id);
    if (dish) dishes.push(dish.name);
  }

  if (order.dessert_id) {
    const dish = allDishes.find((d) => d.id === order.dessert_id);
    if (dish) dishes.push(dish.name);
  }

  // Ограничиваем длину строки
  let dishesText = dishes.map((dish) => `<span>${dish}</span>`).join("");

  if (dishesText.length > 100) {
    dishesText =
      dishes
        .slice(0, 3)
        .map((dish) => `<span>${dish}</span>`)
        .join("") + " и другие...";
  }

  return dishesText;
}

// Получение информации о доставке
function getDeliveryInfo(order) {
  if (order.delivery_type === "by_time" && order.delivery_time) {
    return order.delivery_time;
  }
  return "Как можно скорее (с 7:00 до 23:00)";
}

// Расчет общей стоимости заказа
function calculateOrderTotal(order) {
  let total = 0;

  if (order.soup_id) {
    const dish = allDishes.find((d) => d.id === order.soup_id);
    if (dish) total += dish.price;
  }

  if (order.main_course_id) {
    const dish = allDishes.find((d) => d.id === order.main_course_id);
    if (dish) total += dish.price;
  }

  if (order.salad_id) {
    const dish = allDishes.find((d) => d.id === order.salad_id);
    if (dish) total += dish.price;
  }

  if (order.drink_id) {
    const dish = allDishes.find((d) => d.id === order.drink_id);
    if (dish) total += dish.price;
  }

  if (order.dessert_id) {
    const dish = allDishes.find((d) => d.id === order.dessert_id);
    if (dish) total += dish.price;
  }

  return total;
}

// Показ деталей заказа
async function showOrderDetails(orderId) {
  try {
    const response = await fetch(
      `${API_URL}/labs/api/orders/${orderId}?api_key=${API_KEY}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Ошибка загрузки деталей заказа");
    }

    const order = await response.json();

    // Форматируем дату
    const orderDate = new Date(order.created_at);
    const formattedDate = orderDate.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Форматируем время доставки
    const deliveryInfo = getDeliveryInfo(order);

    // Получаем список блюд с ценами
    let dishesHTML = "";
    let totalPrice = 0;

    const dishPairs = [
      { id: order.soup_id, type: "Суп" },
      { id: order.main_course_id, type: "Главное блюдо" },
      { id: order.salad_id, type: "Салат/Стартер" },
      { id: order.drink_id, type: "Напиток" },
      { id: order.dessert_id, type: "Десерт" },
    ];

    dishPairs.forEach((pair) => {
      if (pair.id) {
        const dish = allDishes.find((d) => d.id === pair.id);
        if (dish) {
          dishesHTML += `
            <li>
              <span class="dish-name">${pair.type}: ${dish.name}</span>
              <span class="dish-price">${dish.price} ₽</span>
            </li>
          `;
          totalPrice += dish.price;
        }
      }
    });

    const detailsHTML = `
      <div class="order-details">
        <div class="detail-group">
          <span class="detail-label">Дата оформления:</span>
          <span class="detail-value">${formattedDate}</span>
        </div>
        
        <div class="detail-group">
          <span class="detail-label">Клиент:</span>
          <span class="detail-value">${order.full_name}</span>
        </div>
        
        <div class="detail-group">
          <span class="detail-label">Контактная информация:</span>
          <span class="detail-value">${order.email}</span>
          <span class="detail-value">${order.phone}</span>
        </div>
        
        <div class="detail-group">
          <span class="detail-label">Адрес доставки:</span>
          <span class="detail-value">${order.delivery_address}</span>
        </div>
        
        <div class="detail-group">
          <span class="detail-label">Тип доставки:</span>
          <span class="detail-value">${
            order.delivery_type === "now"
              ? "Доставить сейчас"
              : "Доставить к указанному времени"
          }</span>
        </div>
        
        <div class="detail-group">
          <span class="detail-label">Время доставки:</span>
          <span class="detail-value">${deliveryInfo}</span>
        </div>
        
        ${
          order.comment
            ? `
        <div class="detail-group">
          <span class="detail-label">Комментарий:</span>
          <span class="detail-value">${order.comment}</span>
        </div>
        `
            : ""
        }
        
        <div class="detail-group">
          <span class="detail-label">Состав заказа:</span>
          <ul class="dishes-list">
            ${dishesHTML}
          </ul>
        </div>
        
        <div class="total-price">
          <span class="total-label">Итого:</span>
          <span class="total-value">${totalPrice} ₽</span>
        </div>
      </div>
    `;

    document.getElementById("order-details-body").innerHTML = detailsHTML;
    openModal("order-details-modal");
  } catch (error) {
    console.error("Ошибка при загрузке деталей заказа:", error);
    showError("Не удалось загрузить детали заказа: " + error.message);
  }
}

// Редактирование заказа
async function editOrder(orderId) {
  currentOrderIdForAction = orderId;

  try {
    const response = await fetch(
      `${API_URL}/labs/api/orders/${orderId}?api_key=${API_KEY}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Ошибка загрузки данных заказа");
    }

    const order = await response.json();

    // Заполняем форму значениями заказа
    document.getElementById("edit-full-name").value = order.full_name;
    document.getElementById("edit-email").value = order.email;
    document.getElementById("edit-phone").value = order.phone;
    document.getElementById("edit-delivery-address").value =
      order.delivery_address;
    document.getElementById("edit-comment").value = order.comment || "";
    document.getElementById("edit-order-id").value = order.id;

    // Устанавливаем тип доставки
    if (order.delivery_type === "now") {
      document.getElementById("edit-delivery-now").checked = true;
      document.getElementById("edit-delivery-time-group").style.display =
        "none";
    } else {
      document.getElementById("edit-delivery-by-time").checked = true;
      document.getElementById("edit-delivery-time-group").style.display =
        "block";
      if (order.delivery_time) {
        document.getElementById("edit-delivery-time").value =
          order.delivery_time;
      }
    }

    // Добавляем обработчики для переключения типа доставки
    document
      .getElementById("edit-delivery-now")
      .addEventListener("change", function () {
        document.getElementById("edit-delivery-time-group").style.display =
          "none";
      });

    document
      .getElementById("edit-delivery-by-time")
      .addEventListener("change", function () {
        document.getElementById("edit-delivery-time-group").style.display =
          "block";
      });

    openModal("edit-order-modal");
  } catch (error) {
    console.error("Ошибка при загрузке данных заказа:", error);
    showError(
      "Не удалось загрузить данные заказа для редактирования: " + error.message
    );
  }
}

// Удаление заказа
function deleteOrder(orderId) {
  currentOrderIdForAction = orderId;
  openModal("delete-order-modal");
}

// Сохранение изменений заказа
async function saveOrderChanges() {
  const form = document.getElementById("edit-order-form");
  const formData = new FormData(form);
  const orderData = Object.fromEntries(formData.entries());

  // Валидация обязательных полей
  if (
    !orderData.full_name ||
    !orderData.email ||
    !orderData.phone ||
    !orderData.delivery_address
  ) {
    showError("Пожалуйста, заполните все обязательные поля");
    return;
  }

  // Если выбрана доставка ко времени, проверяем время
  if (orderData.delivery_type === "by_time" && !orderData.delivery_time) {
    showError("Пожалуйста, укажите время доставки");
    return;
  }

  // Если доставка "сейчас", удаляем поле времени
  if (orderData.delivery_type === "now") {
    delete orderData.delivery_time;
  }

  try {
    const response = await fetch(
      `${API_URL}/labs/api/orders/${currentOrderIdForAction}?api_key=${API_KEY}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Ошибка обновления заказа");
    }

    const result = await response.json();

    closeModal();
    showSuccess("Заказ успешно изменён");

    // Обновляем список заказов
    setTimeout(() => {
      loadOrders();
    }, 1000);
  } catch (error) {
    console.error("Ошибка при обновлении заказа:", error);
    showError("Не удалось обновить заказ: " + error.message);
  }
}

// Подтверждение удаления заказа
async function confirmDeleteOrder() {
  try {
    const response = await fetch(
      `${API_URL}/labs/api/orders/${currentOrderIdForAction}?api_key=${API_KEY}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Ошибка удаления заказа");
    }

    closeModal();
    showSuccess("Заказ успешно удалён");

    // Обновляем список заказов
    setTimeout(() => {
      loadOrders();
    }, 1000);
  } catch (error) {
    console.error("Ошибка при удалении заказа:", error);
    showError("Не удалось удалить заказ: " + error.message);
  }
}

// Управление модальными окнами
function openModal(modalId) {
  document.getElementById(modalId).style.display = "flex";
}

function closeModal() {
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.style.display = "none";
  });
  currentOrderIdForAction = null;
}

// Показать уведомление об успехе
function showSuccess(message) {
  const notification = document.getElementById("notification");
  const messageEl = document.getElementById("notification-message");

  notification.className = "notification success";
  messageEl.innerHTML = `<i class="bi bi-check-circle"></i> ${message}`;
  notification.style.display = "flex";

  // Автоматически скрыть через 3 секунды
  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

// Показать уведомление об ошибке
function showError(message) {
  const notification = document.getElementById("notification");
  const messageEl = document.getElementById("notification-message");

  notification.className = "notification error";
  messageEl.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${message}`;
  notification.style.display = "flex";

  // Автоматически скрыть через 5 секунды
  setTimeout(() => {
    notification.style.display = "none";
  }, 5000);
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", async function () {
  // Загружаем блюда и заказы
  await loadAllDishes();
  await loadOrders();

  // Закрытие модальных окон по клику вне области
  window.onclick = function (event) {
    if (event.target.classList.contains("modal")) {
      closeModal();
    }
  };

  // Закрытие по клавише ESC
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeModal();
    }
  });
});
