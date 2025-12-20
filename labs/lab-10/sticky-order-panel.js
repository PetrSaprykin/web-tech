function updateStickyPanel() {
  const panel = document.getElementById("sticky-order-panel");
  if (!panel) return;

  const order = getOrderFromStorage();
  const selectedDishes = Object.values(order).filter((dish) => dish !== null);

  if (selectedDishes.length === 0) {
    panel.classList.add("hidden");
    return;
  }

  panel.classList.remove("hidden");

  const total = selectedDishes.reduce((sum, dish) => sum + dish.price, 0);
  const totalElement = panel.querySelector(".total-amount");
  if (totalElement) {
    totalElement.textContent = total + " ₽";
  }

  const proceedBtn = panel.querySelector(".proceed-btn");
  const validation = validateCombo();

  if (validation.valid) {
    proceedBtn.classList.remove("disabled");
    proceedBtn.href = "order.html";
  } else {
    proceedBtn.classList.add("disabled");
    proceedBtn.href = "#";
    proceedBtn.onclick = (e) => {
      e.preventDefault();
      showNotification(validation.message, validation.image);
    };
  }
}
