let currentOrder = {
  soup: null,
  main: null,
  salad: null,
  drink: null,
  dessert: null,
};

function addDishToOrder(dish) {
  currentOrder[dish.category] = dish;
  updateOrderDisplay();
  updateOrderForm();
  updateTotalPrice();
}

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
}

function updateTotalPrice() {
  const totalContainer = document.getElementById("order-total");
  if (!totalContainer) return;

  const total = Object.values(currentOrder)
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

function resetOrder() {
  currentOrder = {
    soup: null,
    main: null,
    salad: null,
    drink: null,
    dessert: null,
  };
  updateOrderDisplay();
  updateOrderForm();
  updateTotalPrice();
}

document.addEventListener("DOMContentLoaded", function () {
  updateOrderDisplay();
  updateTotalPrice();
});
