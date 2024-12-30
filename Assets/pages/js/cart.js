// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEI1_9P4cuTNZ7lToZDzXia6vmfq3vf1w",
  authDomain: "pet-world-945a1.firebaseapp.com",
  projectId: "pet-world-945a1",
  storageBucket: "pet-world-945a1.appspot.com",
  messagingSenderId: "65370724893",
  appId: "1:65370724893:web:9c615c57b3ad459bdd04f4",
  measurementId: "G-Y4LZ85V604",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let currentUser = null;

// Listen to auth state changes
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  renderCart();
});

// Render Cart
function renderCart() {
  const cartList = document.getElementById("cart-list");

  if (!cartList) {
    console.error("Cart container not found in the DOM.");
    return;
  }

  const userKey = currentUser
    ? `cart_${currentUser.email.replace(".", "_")}`
    : "cart_guest";

  const cart = JSON.parse(localStorage.getItem(userKey)) || [];

  if (cart.length === 0) {
    cartList.innerHTML = `<p>Your cart is empty.</p>`;
    return;
  }

  cartList.innerHTML = cart
    .map(
      (item, index) => `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.name}">
            <p><strong>${item.name}</strong></p>
            <p>Price: ${item.price}</p>
            <div class="quantity-controls">
                <button onclick="decreaseQuantity(${index})">-</button>
                <span>${item.quantity}</span>
                <button onclick="increaseQuantity(${index})">+</button>
            </div>
            <button onclick="removeFromCart(${index})">Remove</button>
        </div>
      `
    )
    .join("");

  updateTotalPrice();
}

function updateTotalPrice() {
  const userEmail = currentUser
    ? `cart_${currentUser.email.replace(".", "_")}`
    : "cart_guest";
  const cart = JSON.parse(localStorage.getItem(userEmail)) || [];
  let totalPrice = 0;

  // Calculate the total price if the cart is not empty
  if (cart.length > 0) {
    cart.forEach((item) => {
      totalPrice += parseFloat(item.price) * item.quantity;
    });
  }

  const totalPriceElement = document.getElementById("total-price");
  if (totalPriceElement) {
    // If the cart is empty, totalPrice will be 0
    totalPriceElement.textContent = `${totalPrice.toFixed(2)}`;
  }
}


window.increaseQuantity = function (index) {
  const userKey = currentUser
    ? `cart_${currentUser.email.replace(".", "_")}`
    : "cart_guest";
  const cart = JSON.parse(localStorage.getItem(userKey)) || [];

  if (index >= 0 && index < cart.length) {
    if (cart[index].quantity < 10) {
      cart[index].quantity += 1;
      localStorage.setItem(userKey, JSON.stringify(cart));
      renderCart();
    } else {
      // Show a custom message instead of an alert
      showMessage("Maximum quantity reached for this product.", "error");
    }
  } else {
    console.error("Invalid cart index:", index);
  }
};


function showMessage(message, type) {
  const messageContainer = document.getElementById("message-container");
  if (messageContainer) {
    messageContainer.textContent = message;

    // Add appropriate styles for success or error
    messageContainer.className = type === "error" ? "message error" : "message success";

    // Display the message container
    messageContainer.style.display = "block";

    // Hide the message after 3 seconds
    setTimeout(() => {
      messageContainer.style.display = "none";
    }, 3000);
  }
}


// Decrease quantity
window.decreaseQuantity = function (index) {
  const userKey = currentUser
    ? `cart_${currentUser.email.replace(".", "_")}`
    : "cart_guest";
  const cart = JSON.parse(localStorage.getItem(userKey)) || [];

  if (index >= 0 && index < cart.length) {
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
      localStorage.setItem(userKey, JSON.stringify(cart));
      renderCart();
    } else {
      showMessage("Minimum quantity is 1. Use the remove button to delete the item.");
    }
  } else {
    console.error("Invalid cart index:", index);
  }
};

window.removeFromCart = function (index) {
  const userKey = currentUser
    ? `cart_${currentUser.email.replace(".", "_")}`
    : "cart_guest";
  const cart = JSON.parse(localStorage.getItem(userKey)) || [];

  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
    localStorage.setItem(userKey, JSON.stringify(cart));

    // Re-render the cart and update the total price after removal
    renderCart();
    updateTotalPrice();  // Recalculate total price after removal
  } else {
    console.error("Invalid cart index:", index);
  }
};


// Update cart count
function updateCartCount() {
  const userEmail = currentUser
    ? `cart_${currentUser.email.replace(".", "_")}`
    : "cart_guest";
  const cart = JSON.parse(localStorage.getItem(userEmail)) || [];
  const countElement = document.querySelector(".cart-count");

  if (countElement) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    countElement.textContent = totalItems;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});
