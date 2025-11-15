document.addEventListener("DOMContentLoaded", function () {
  const sortedDishes = [...dishes].sort((a, b) => a.name.localeCompare(b.name));

  const dishesByCategory = {
    soup: sortedDishes.filter((dish) => dish.category === "soup"),
    main: sortedDishes.filter((dish) => dish.category === "main"),
    drink: sortedDishes.filter((dish) => dish.category === "drink"),
  };

  displayDishesByCategory("soup", dishesByCategory.soup);
  displayDishesByCategory("main", dishesByCategory.main);
  displayDishesByCategory("drink", dishesByCategory.drink);

  addDishSelectionHandlers();
});

function displayDishesByCategory(category, dishesArray) {
  const section = document.querySelector(`.${getCategoryClassName(category)}`);
  if (!section) return;

  const dishesContainer = section.querySelector(".dishes");
  if (!dishesContainer) return;

  dishesContainer.innerHTML = "";

  dishesArray.forEach((dish) => {
    const dishCard = createDishCard(dish);
    dishesContainer.appendChild(dishCard);
  });
}

function getCategoryClassName(category) {
  const categoryMap = {
    soup: "soups",
    main: "main-dishes",
    drink: "drinks",
  };
  return categoryMap[category] || category;
}

function createDishCard(dish) {
  const card = document.createElement("div");
  card.className = "dish-card";
  card.setAttribute("data-dish", dish.keyword);

  card.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}" />
        <p class="price">${dish.price} ₽</p>
        <p class="dish-name">${dish.name}</p>
        <p class="weight">${dish.count}</p>
        <button>Добавить</button>
    `;

  return card;
}

function addDishSelectionHandlers() {
  document.addEventListener("click", function (e) {
    const dishCard = e.target.closest(".dish-card");
    if (dishCard) {
      const dishKeyword = dishCard.getAttribute("data-dish");
      const selectedDish = dishes.find((dish) => dish.keyword === dishKeyword);

      if (selectedDish) {
        addDishToOrder(selectedDish);
      }
    }
  });
}
