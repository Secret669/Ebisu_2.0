// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const menuToggle = document.getElementById("mobile-menu");
  const navList = document.querySelector(".nav-list");

  menuToggle.addEventListener("click", function () {
    this.classList.toggle("active");
    navList.classList.toggle("active");
  });

  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll(".nav-list a");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      menuToggle.classList.remove("active");
      navList.classList.remove("active");
    });
  });

  // Sticky header on scroll
  const header = document.querySelector(".sticky-header");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // News slider functionality
  const blogGrid = document.querySelector('.blog-grid');
  if (blogGrid) { // Додаємо перевірку наявності елемента
    const blogCards = document.querySelectorAll('.blog-card');
    const prevBtn = document.querySelector('.blog-prev');
    const nextBtn = document.querySelector('.blog-next');

    let currentIndex = 0;
    const cardsToShow = 2;

    function updateSlider() {
      const cardWidth = 100 / cardsToShow;
      blogGrid.style.transform = `translateX(-${currentIndex * cardWidth}%)`;
      
      // Disable/enable buttons based on current position
      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex >= blogCards.length - cardsToShow;
    }

    // Initialize slider
    if (blogCards.length > 0) {
      blogGrid.style.display = 'flex';
      blogCards.forEach(card => {
        card.style.flex = `0 0 ${100 / cardsToShow}%`;
      });

      // Event listeners for navigation
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
          }
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (currentIndex < blogCards.length - cardsToShow) {
            currentIndex++;
            updateSlider();
          }
        });
      }

      // Initialize buttons state
      updateSlider();
    }
  }

  // Load products from JSON
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      const productsContainer = document.getElementById("featured-products");
      if (!productsContainer) return; // Якщо контейнера немає, виходимо
      
      // Отримуємо випадкові 6 товарів
      const shuffledProducts = [...data.products].sort(() => 0.5 - Math.random());
      const featuredProducts = shuffledProducts.slice(0, 6);

      featuredProducts.forEach((product) => {
        // Створюємо основний блок товару
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        // Блок із зображенням
        const productImage = document.createElement("div");
        productImage.classList.add("product-image");
        const img = document.createElement("img");
        img.src = product.image;
        img.alt = product.name;
        img.loading = "lazy";
        productImage.appendChild(img);

        // Блок із інформацією про товар
        const productInfo = document.createElement("div");
        productInfo.classList.add("product-info");

        const productName = document.createElement("h3");
        productName.textContent = product.name;

        // Блок з ціною (видимий завжди)
        const productPrice = document.createElement("p");
        productPrice.classList.add("product-price");
        const formattedPrice = new Intl.NumberFormat('uk-UA').format(product.price);
        productPrice.textContent = `${formattedPrice} грн`;

        // Додаткові деталі продукту (приховані за замовчуванням)
        const productDetails = document.createElement("div");
        productDetails.classList.add("product-details", "hidden-details");
        
        // Знаходимо назву категорії
        const category = data.categories.find(cat => cat.id === product.category_id);
        const categoryName = category ? category.name : 'Невідома категорія';
        
        // Знаходимо назву металу
        const metal = data.metals.find(m => m.id === product.metal_id);
        const metalName = metal ? metal.name : 'Невідомий метал';
        
        // Знаходимо назви каменів
        const stoneNames = product.stones.map(stoneId => {
          const stone = data.stones.find(s => s.id === stoneId);
          return stone ? stone.name : 'невідомий камінь';
        }).join(', ');
        
        // Заповнюємо деталі
        productDetails.innerHTML = `
          <p><strong>Категорія:</strong> ${categoryName}</p>
          <p><strong>Метал:</strong> ${metalName} (${product.metal_color}), ${product.sample} проба</p>
          <p><strong>Вага:</strong> ${product.weight} г</p>
          ${stoneNames ? `<p><strong>Камені:</strong> ${stoneNames}</p>` : ''}
          <p><strong>Опис:</strong> ${product.description}</p>
        `;

        const addToCartButton = document.createElement("button");
        addToCartButton.classList.add("add-to-cart");
        addToCartButton.setAttribute("data-id", product.id);
        addToCartButton.textContent = "Додати в кошик";

        // Збираємо блоки
        productInfo.appendChild(productName);
        productInfo.appendChild(productPrice); // Ціна завжди видима
        productInfo.appendChild(productDetails); // Деталі приховані
        productInfo.appendChild(addToCartButton);

        productCard.appendChild(productImage);
        productCard.appendChild(productInfo);

        // Додаємо обробники подій для показу/приховування деталей
        productCard.addEventListener('mouseenter', () => {
          productDetails.classList.remove('hidden-details');
        });
        
        productCard.addEventListener('mouseleave', () => {
          productDetails.classList.add('hidden-details');
        });

        // Додаємо товар до контейнера
        productsContainer.appendChild(productCard);
      });
    })
    .catch((error) => console.error("Error loading products:", error));
});