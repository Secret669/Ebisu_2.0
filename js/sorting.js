document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const categorySlug = urlParams.get("category") || "all";

  let productsData = null;
  let filteredProducts = [];

  // Initialize filters
  function initializeFilters(data) {
    const metals = new Set();
    const stones = new Set();
    const colors = new Set();
    const samples = new Set();

    data.products.forEach((product) => {
      const metal = data.metals.find((m) => m.id === product.metal_id);
      if (metal) metals.add(metal.name);
      if (product.metal_color) colors.add(product.metal_color);
      if (product.sample) samples.add(product.sample);
      product.stones.forEach((stoneId) => {
        const stone = data.stones.find((s) => s.id === stoneId);
        if (stone) stones.add(stone.name);
      });
    });

    populateSelect("metalFilter", Array.from(metals), "Всі метали");
    populateSelect("stoneFilter", Array.from(stones), "Всі камені");
    populateSelect("colorFilter", Array.from(colors), "Всі кольори");
    populateSelect("sampleFilter", Array.from(samples), "Всі проби");
  }

  function populateSelect(id, options, defaultText) {
    const select = document.getElementById(id);
    if (!select) return;

    select.innerHTML = `<option value="">${defaultText}</option>`;
    options.sort().forEach((option) => {
      select.innerHTML += `<option value="${option}">${option}</option>`;
    });
  }

  // Filter and sort products
  function filterProducts() {
    const nameSort = document.getElementById("nameSort")?.value || "asc";
    const metalFilter = document.getElementById("metalFilter")?.value || "";
    const stoneFilter = document.getElementById("stoneFilter")?.value || "";
    const colorFilter = document.getElementById("colorFilter")?.value || "";
    const sampleFilter = document.getElementById("sampleFilter")?.value || "";

    let filtered = [...productsData.products];

    // Apply category filter
    if (categorySlug !== "all") {
      const category = productsData.categories.find(
        (cat) => cat.slug === categorySlug
      );
      if (category) {
        filtered = filtered.filter(
          (product) => product.category_id === category.id
        );
      }
    }

    // Apply metal filter
    if (metalFilter) {
      filtered = filtered.filter((product) => {
        const metal = productsData.metals.find(
          (m) => m.id === product.metal_id
        );
        return metal && metal.name === metalFilter;
      });
    }

    // Apply stone filter
    if (stoneFilter) {
      filtered = filtered.filter((product) => {
        return product.stones.some((stoneId) => {
          const stone = productsData.stones.find((s) => s.id === stoneId);
          return stone && stone.name === stoneFilter;
        });
      });
    }

    // Apply color filter
    if (colorFilter) {
      filtered = filtered.filter(
        (product) => product.metal_color === colorFilter
      );
    }

    // Apply sample filter
    if (sampleFilter) {
      filtered = filtered.filter(
        (product) => product.sample === parseInt(sampleFilter)
      );
    }

    // Apply name sorting
    filtered.sort((a, b) => {
      return nameSort === "asc"
        ? a.name.localeCompare(b.name, "uk")
        : b.name.localeCompare(a.name, "uk");
    });

    filteredProducts = filtered;
    renderProducts(filtered, productsData);
  }

  // Reset filters
  document.getElementById("resetFilters")?.addEventListener("click", () => {
    document.getElementById("nameSort").value = "asc";
    document.getElementById("metalFilter").value = "";
    document.getElementById("stoneFilter").value = "";
    document.getElementById("colorFilter").value = "";
    document.getElementById("sampleFilter").value = "";
    filterProducts();
  });

  // Add event listeners to filters
  [
    "nameSort",
    "metalFilter",
    "stoneFilter",
    "colorFilter",
    "sampleFilter",
  ].forEach((filterId) => {
    document
      .getElementById(filterId)
      ?.addEventListener("change", filterProducts);
  });

  // Load and initialize products
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      productsData = data;
      initializeFilters(data);
      filterProducts();
    })
    .catch((error) => console.error("Error:", error));
});

function renderProducts(products, fullData) {
  const container = document.getElementById("products-container");
  if (!container) return;

  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = '<p class="no-products">Товарів не знайдено</p>';
    return;
  }

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";

    const category = fullData.categories.find(
      (c) => c.id === product.category_id
    );

    productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${
      product.name
    }" loading="lazy">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">${new Intl.NumberFormat(
                  "uk-UA"
                ).format(product.price)} грн</p>
                <p class="product-category">${category?.name || ""}</p>
                <button class="add-to-cart" data-id="${
                  product.id
                }">Додати в кошик</button>
            </div>
        `;

    container.appendChild(productCard);
  });
}
