// Cart functionality
document.addEventListener("DOMContentLoaded", function () {
  const cartBtn = document.getElementById("cart-btn");
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartOverlay = document.getElementById("cart-overlay");
  const closeCart = document.querySelector(".close-cart");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartCount = document.querySelector(".cart-count");
  const cartTotal = document.getElementById("cart-total");
  const checkoutBtn = document.querySelector(".cart-total .btn");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Open cart sidebar
  if (cartBtn) {
    cartBtn.addEventListener("click", function (e) {
      e.preventDefault();
      cartSidebar.classList.add("active");
      cartOverlay.classList.add("active");
    });
  }

  // Close cart sidebar
  function closeCartSidebar() {
    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");
  }

  if (closeCart) closeCart.addEventListener("click", closeCartSidebar);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCartSidebar);

  // Add to cart
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("add-to-cart")) {
      const productId = e.target.getAttribute("data-id");
      addToCart(productId);
    }
  });

  // Remove from cart
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("cart-item-remove")) {
      const productId = e.target.getAttribute("data-id");
      removeFromCart(productId);
    }
  });

  // Quantity buttons
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("quantity-btn")) {
      const btn = e.target;
      const productId = btn.getAttribute("data-id");
      const input = btn.parentElement.querySelector(".quantity-input");
      let quantity = parseInt(input.value);

      if (btn.classList.contains("minus")) quantity = Math.max(1, quantity - 1);
      else if (btn.classList.contains("plus")) quantity += 1;

      input.value = quantity;
      updateQuantity(productId, quantity);
    }
  });

  // Quantity input manual change
  document.addEventListener("change", function (e) {
    if (e.target.classList.contains("quantity-input")) {
      const productId = e.target.getAttribute("data-id");
      const newQuantity = parseInt(e.target.value);
      updateQuantity(productId, newQuantity);
    }
  });

  function addToCart(productId) {
    fetch("products.json")
      .then((response) => response.json())
      .then((data) => {
        const product = data.products.find((p) => p.id == productId);
        if (!product) return;

        const existingItem = cart.find((item) => item.id == productId);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
          });
        }

        updateCart();
        alert(`${product.name} додано до кошика!`);
      })
      .catch((error) =>
        console.error("Помилка при завантаженні товарів:", error)
      );
  }

  function removeFromCart(productId) {
    cart = cart.filter((item) => item.id != productId);
    updateCart();
  }

  function updateQuantity(productId, newQuantity) {
    const item = cart.find((item) => item.id == productId);
    if (item) {
      item.quantity = Math.max(1, newQuantity);
      updateCart();
    }
  }

  function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartItems();
    updateCartCount();
    updateCartTotal();
  }

  function renderCartItems() {
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Ваш кошик порожній</p>";
      return;
    }

    const output = cart
      .map(
        (item) => `
      <div class="cart-item">
        <div class="cart-item-img">
          <img src="${item.image}" alt="${item.name}" loading="lazy">
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.name}</h4>
          <p class="cart-item-price">${item.price} грн</p>
          <span class="cart-item-remove" data-id="${item.id}">Видалити</span>
          <div class="cart-item-quantity">
            <button class="quantity-btn minus" data-id="${item.id}">-</button>
            <input type="number" class="quantity-input" data-id="${item.id}" value="${item.quantity}" min="1">
            <button class="quantity-btn plus" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    cartItemsContainer.innerHTML = output;
  }

  function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? "block" : "none";
    cartCount.style.padding = count >= 10 ? "0px 3px" : "0px 7px";
  }

  function updateCartTotal() {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    cartTotal.textContent = `${total} грн`;
  }

  // Кнопка "Оформити замовлення"
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const minimalCart = cart.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      }));
      localStorage.setItem("cartItems", JSON.stringify(minimalCart));
      window.location.href = "p3.html";
    });
  }

  // Initialize
  updateCart();
});
