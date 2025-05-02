document.addEventListener("DOMContentLoaded", function () {
  // Додаємо обробник для всіх карточок товарів
  document.addEventListener("click", function (e) {
    const productCard = e.target.closest(".product-card");
    if (!productCard) return;

    // Запобігаємо переходу по посиланню, якщо клік був на кнопці "Додати в кошик"
    if (e.target.classList.contains("add-to-cart")) return;

    // Отримуємо ID товару з кнопки "Додати в кошик"
    const addToCartBtn = productCard.querySelector(".add-to-cart");
    if (!addToCartBtn) return;

    const productId = addToCartBtn.getAttribute("data-id");

    // Завантажуємо дані про товар
    fetch("products.json")
      .then((response) => response.json())
      .then((data) => {
        const product = data.products.find((p) => p.id == productId);
        if (!product) return;

        // Знаходимо додаткову інформацію
        const category = data.categories.find(
          (c) => c.id === product.category_id
        );
        const metal = data.metals.find((m) => m.id === product.metal_id);
        const stones = product.stones
          .map((stoneId) => {
            const stone = data.stones.find((s) => s.id === stoneId);
            return stone ? stone.name : "невідомий камінь";
          })
          .join(", ");

        // Створюємо модальне вікно
        const modal = document.createElement("div");
        modal.className = "product-modal";
        modal.innerHTML = `
                    <div class="modal-content">
                        <span class="close-modal">&times;</span>
                        <div class="modal-product-info">
                            <div class="modal-product-image">
                                <img src="${product.image}" alt="${
          product.name
        }">
                            </div>
                            <div class="modal-product-details">
                                <h2>${product.name}</h2>
                                <p class="modal-price">${new Intl.NumberFormat(
                                  "uk-UA"
                                ).format(product.price)} грн</p>
                                <div class="product-specs">
                                    <p><strong>Категорія:</strong> ${
                                      category
                                        ? category.name
                                        : "Невідома категорія"
                                    }</p>
                                    <p><strong>Метал:</strong> ${
                                      metal ? metal.name : "Невідомий метал"
                                    } (${product.metal_color})</p>
                                    <p><strong>Проба:</strong> ${
                                      product.sample
                                    }</p>
                                    <p><strong>Вага:</strong> ${
                                      product.weight
                                    } г</p>
                                    ${
                                      stones
                                        ? `<p><strong>Камені:</strong> ${stones}</p>`
                                        : ""
                                    }
                                    <p><strong>Опис:</strong> ${
                                      product.description
                                    }</p>
                                </div>
                                <button class="add-to-cart" data-id="${
                                  product.id
                                }">Додати в кошик</button>
                            </div>
                        </div>
                    </div>
                `;

        // Додаємо стилі для модального вікна
        if (!document.getElementById("modal-styles")) {
          const style = document.createElement("style");
          style.id = "modal-styles";
          style.textContent = `
                        .product-modal {
                            display: flex;
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: rgba(0, 0, 0, 0.7);
                            z-index: 1000;
                            justify-content: center;
                            align-items: center;
                        }
                        .modal-content {
                            background: white;
                            padding: 20px;
                            border-radius: 10px;
                            max-width: 900px;
                            width: 90%;
                            max-height: 90vh;
                            overflow-y: auto;
                            position: relative;
                        }
                        .close-modal {
                            position: absolute;
                            right: 20px;
                            top: 10px;
                            font-size: 30px;
                            cursor: pointer;
                        }
                        .modal-product-info {
                            display: flex;
                            gap: 30px;
                        }
                        .modal-product-image {
                            flex: 1;
                            max-width: 400px;
                        }
                        .modal-product-image img {
                            width: 100%;
                            height: auto;
                            border-radius: 8px;
                        }
                        .modal-product-details {
                            flex: 1;
                        }
                        .modal-price {
                            font-size: 24px;
                            font-weight: bold;
                            color: #333;
                            margin: 15px 0;
                        }
                        .product-specs {
                            margin: 20px 0;
                        }
                        .product-specs p {
                            margin: 10px 0;
                        }
                        @media (max-width: 768px) {
                            .modal-product-info {
                                flex-direction: column;
                            }
                            .modal-product-image {
                                max-width: 100%;
                            }
                        }
                    `;
          document.head.appendChild(style);
        }

        // Додаємо модальне вікно на сторінку
        document.body.appendChild(modal);

        // Додаємо обробник для закриття
        const closeBtn = modal.querySelector(".close-modal");
        closeBtn.onclick = () => modal.remove();
        modal.onclick = (e) => {
          if (e.target === modal) modal.remove();
        };
      })
      .catch((error) => console.error("Error:", error));
  });
});
