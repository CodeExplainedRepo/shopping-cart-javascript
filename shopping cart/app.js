// select elements
const productsElement = document.querySelector(".products");
const cartItemsElement = document.querySelector(".cart-items");
const subtotalElement = document.querySelector(".subtotal");

// CART ARRAY
let cart = JSON.parse(localStorage.getItem("CART")) || [];
updateCart();

// render products
function renderProducts(products) {
  productsElement.innerHTML = "";
  products.forEach((product) => {
    productsElement.innerHTML += `
            <div class="item">
                <div class="item-container">
                    <div class="item-img">
                        <img src="${product.imgSrc}" alt="${product.name}">
                    </div>
                    <div class="desc">
                        <h2>${product.name}</h2>
                        <h2>${product.price}</h2>
                        <p>
                            ${product.description}
                        </p>
                    </div>
                    <div class="add-to-wishlist">
                        <img src="./icons/heart.png" alt="add to wish list">
                    </div>
                    <div class="add-to-cart" onclick="addToCart(${product.id})">
                        <img src="./icons/bag-plus.png" alt="add to cart">
                    </div>
                </div>
            </div>
    `;
  });
}
renderProducts(products);

// add to cart
function addToCart(id) {
  if (cart.some((product) => product.id === id)) {
    changeNumberOfUnits("plus", id);
  } else {
    const product = products.find((product) => product.id === id);

    product.numberOfUnits = 1;

    cart.push(product);
  }

  updateCart();
}

// update cart
function updateCart() {
  renderCartItems();
  renderSubtotal();

  // update local storage
  localStorage.setItem("CART", JSON.stringify(cart));
}

// render cart items
function renderCartItems() {
  cartItemsElement.innerHTML = "";
  cart.forEach((item) => {
    cartItemsElement.innerHTML += `
            <div class="cart-item">
                <div class="item-info" onclick="removeFromCart(${item.id})">
                    <img src="${item.imgSrc}" alt="${item.name}">
                    <h4>${item.name}</h4>
                </div>
                <div class="unit-price">
                    <small>$</small>${item.price}
                </div>
                <div class="units">
                    <div class="btn minus" onclick="changeNumberOfUnits('minus' ,${item.id})">-</div>
                    <div class="number">${item.numberOfUnits}</div>
                    <div class="btn plus" onclick="changeNumberOfUnits('plus', ${item.id})">+</div>           
                </div>
            </div>
        `;
  });
}

// render subtotal
function renderSubtotal() {
  subtotal = 0;
  numberOfItems = 0;

  cart.forEach((item) => {
    subtotal += item.price * item.numberOfUnits;
    numberOfItems += item.numberOfUnits;
  });

  document.querySelector(".total-items-in-cart").innerHTML = numberOfItems;
  subtotalElement.innerText = `Subtotal (${numberOfItems} items): $${subtotal.toFixed(
    2
  )}`;
}

// remove item for cart
function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);

  updateCart();
}

// change number of units
function changeNumberOfUnits(change, id) {
  cart = cart.map((product) => {
    if (product.id === id) {
      let numberOfUnits = product.numberOfUnits;

      if (change === "plus" && numberOfUnits < product.instock) {
        numberOfUnits++;
      } else if (change === "minus" && numberOfUnits > 1) {
        numberOfUnits--;
      }

      return {
        ...product,
        numberOfUnits,
      };
    } else {
      return product;
    }
  });

  updateCart();
}
