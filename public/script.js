let allProducts = [];

// =========================
// WINDOW LOAD
// =========================

window.onload = () => {

  fetchProducts();

  updateCartCount();

};

// =========================
// FETCH PRODUCTS
// =========================

async function fetchProducts(){

  try {

    const container =
      document.getElementById(
        "products"
      );

    container.innerHTML = `

      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>

    `;

    const res =
      await fetch("/products");

    const products =
      await res.json();

    allProducts = products;

    // EMPTY PRODUCTS

    if(products.length === 0){

      container.innerHTML = `

        <h2 class="empty-products">

          No Products Found

        </h2>

      `;

      return;

    }

    displayProducts(products);

  }

  catch(error){

    console.log(error);

    document.getElementById(
      "products"
    ).innerHTML = `

      <h2 class="empty-products">

        Failed To Load Products

      </h2>

    `;

  }

}

// =========================
// DISPLAY PRODUCTS
// =========================

function displayProducts(products){

  const container =
    document.getElementById(
      "products"
    );

  container.innerHTML = "";

  products.forEach(product => {

    const card =
      document.createElement("div");

    card.className =
      "product fade-in";

    card.innerHTML = `

      <span class="product-badge">
        SALE
      </span>

      <img
        src="${product.image}"
        alt="${product.name}"
      >

      <h2>
        ${product.name}
      </h2>

      <p>
        ₹${product.price}
      </p>

      <p>
        ${product.description}
      </p>

      <button class="add-btn">
        Add To Cart
      </button>

      <button class="wish-btn">
        ❤️ Wishlist
      </button>

      <div class="stars">
        ⭐ ⭐ ⭐ ⭐ ⭐
      </div>

    `;

    // ADD TO CART

    card.querySelector(".add-btn")
    .addEventListener("click", () => {

      addToCart(product);

    });

    // ADD TO WISHLIST

    card.querySelector(".wish-btn")
    .addEventListener("click", () => {

      addToWishlist(product);

    });

    // OPEN MODAL

    card.querySelector("img")
    .addEventListener("click", () => {

      openModal(

        product.image,

        product.name,

        product.price,

        product.description

      );

    });

    container.appendChild(card);

  });

  // OBSERVER ANIMATION

  setTimeout(() => {

    const cards =
      document.querySelectorAll(
        ".product"
      );

    cards.forEach(card => {

      card.classList.add(
        "hidden"
      );

      observer.observe(card);

    });

  }, 500);

}

// =========================
// ADD TO CART
// =========================

function addToCart(product){

  let cart =
    JSON.parse(

      localStorage.getItem("cart")

    ) || [];

  const existingProduct =
    cart.find(item =>

      item._id === product._id

    );

  if(existingProduct){

    existingProduct.quantity += 1;

  } else {

    cart.push({

      ...product,

      quantity: 1

    });

  }

  localStorage.setItem(

    "cart",

    JSON.stringify(cart)

  );

  showToast(
    "🛒 Product Added To Cart"
  );

  updateCartCount();

}

// =========================
// ADD TO WISHLIST
// =========================

function addToWishlist(product){

  let wishlist =
    JSON.parse(

      localStorage.getItem(
        "wishlist"
      )

    ) || [];

  const exists =
    wishlist.find(item =>

      item._id === product._id

    );

  if(exists){

    alert(
      "Already In Wishlist"
    );

    return;

  }

  wishlist.push(product);

  localStorage.setItem(

    "wishlist",

    JSON.stringify(wishlist)

  );

  showToast(
    "❤️ Added To Wishlist"
  );

}

// =========================
// TOAST
// =========================

function showToast(message){

  const toast =
    document.getElementById(
      "toast"
    );

  toast.innerText = message;

  toast.classList.add(
    "show"
  );

  setTimeout(() => {

    toast.classList.remove(
      "show"
    );

  }, 2500);

}

// =========================
// CART COUNT
// =========================

function updateCartCount(){

  let cart =
    JSON.parse(

      localStorage.getItem("cart")

    ) || [];

  let totalCount = 0;

  cart.forEach(item => {

    totalCount += item.quantity;

  });

  const cartCount =
    document.getElementById(
      "cartCount"
    );

  if(cartCount){

    cartCount.innerText =
      totalCount;

  }

}

// =========================
// SEARCH PRODUCTS
// =========================

document.getElementById(
  "searchInput"
).addEventListener(

  "input",

  function(){

    const value =
      this.value.toLowerCase();

    const filtered =
      allProducts.filter(product =>

        product.name
        .toLowerCase()
        .includes(value)

      );

    displayProducts(filtered);

  }

);

// =========================
// CATEGORY FILTER
// =========================

document.getElementById(
  "categoryFilter"
).addEventListener(

  "change",

  function(){

    const value =
      this.value;

    if(value === "all"){

      displayProducts(allProducts);

    }

    else {

      const filtered =
        allProducts.filter(product =>

          product.category === value

        );

      displayProducts(filtered);

    }

  }

);

// =========================
// SORT FILTER
// =========================

document.getElementById(
  "sortFilter"
).addEventListener(

  "change",

  function(){

    const value =
      this.value;

    let sortedProducts =
      [...allProducts];

    if(value === "low"){

      sortedProducts.sort(

        (a, b) =>
          a.price - b.price

      );

    }

    else if(value === "high"){

      sortedProducts.sort(

        (a, b) =>
          b.price - a.price

      );

    }

    displayProducts(
      sortedProducts
    );

  }

);

// =========================
// LOGOUT
// =========================

function logout(){

  localStorage.removeItem(
    "loggedInUser"
  );

  alert(
    "Logged Out Successfully"
  );

  window.location.href =
    "/login.html";

}

// =========================
// DARK MODE
// =========================

function toggleDarkMode(){

  document.body.classList.toggle(
    "dark-mode"
  );

  if(
    document.body.classList.contains(
      "dark-mode"
    )
  ){

    localStorage.setItem(
      "theme",
      "dark"
    );

  }

  else {

    localStorage.setItem(
      "theme",
      "light"
    );

  }

}

// LOAD SAVED THEME

const savedTheme =
  localStorage.getItem(
    "theme"
  );

if(savedTheme === "dark"){

  document.body.classList.add(
    "dark-mode"
  );

}

// =========================
// OPEN MODAL
// =========================

function openModal(
  image,
  name,
  price,
  description
){

  document.getElementById(
    "productModal"
  ).style.display = "flex";

  document.getElementById(
    "modalImage"
  ).src = image;

  document.getElementById(
    "modalTitle"
  ).innerText = name;

  document.getElementById(
    "modalPrice"
  ).innerText =
    "₹" + price;

  document.getElementById(
    "modalDesc"
  ).innerText =
    description;

  // LOAD REVIEWS

  loadReviews(name);

}

// =========================
// CLOSE MODAL
// =========================

function closeModal(){

  document.getElementById(
    "productModal"
  ).style.display = "none";

}

// =========================
// REVIEWS
// =========================

let currentProduct = "";

function addReview(){

  const reviewText =
    document.getElementById(
      "reviewInput"
    ).value;

  if(reviewText.trim() === "")
    return;

  let reviews =
    JSON.parse(

      localStorage.getItem(
        "reviews"
      )

    ) || {};

  if(!reviews[currentProduct]){

    reviews[currentProduct] = [];

  }

  reviews[currentProduct]
  .push(reviewText);

  localStorage.setItem(

    "reviews",

    JSON.stringify(reviews)

  );

  loadReviews(currentProduct);

  document.getElementById(
    "reviewInput"
  ).value = "";

}

function loadReviews(productName){

  currentProduct =
    productName;

  let reviews =
    JSON.parse(

      localStorage.getItem(
        "reviews"
      )

    ) || {};

  const reviewsList =
    document.getElementById(
      "reviewsList"
    );

  reviewsList.innerHTML = "";

  if(reviews[productName]){

    reviews[productName]
    .forEach(review => {

      reviewsList.innerHTML += `

        <div class="review-item">

          ⭐ ${review}

        </div>

      `;

    });

  }

}

// =========================
// ANIMATION OBSERVER
// =========================

const observer =
  new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if(entry.isIntersecting){

        entry.target.classList.add(
          "show-animation"
        );

      }

    });

  });

// =========================
// MOBILE MENU
// =========================

function toggleMenu(){

  const navbar =
    document.querySelector(
      ".navbar"
    );

  navbar.classList.toggle(
    "active-menu"
  );

}