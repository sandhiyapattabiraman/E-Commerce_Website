// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
const db = getFirestore(app);

let currentUser = null;

// Listen to auth state changes
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  console.log("User state changed:", user);
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
  console.log("Cart data retrieved:", cart);

  if (cart.length === 0) {
    cartList.innerHTML = `<p>Your cart is empty. Please add items to your cart.</p>`;
    return;
  }

  cartList.innerHTML = cart
    .map(
      (item, index) => `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.name}">
            <p><strong>${item.name}</strong></p>
            <p>Price: ₹${item.price}</p>
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

  cart.forEach((item) => {
    totalPrice += parseFloat(item.price) * item.quantity;
  });

  const totalPriceElement = document.getElementById("total-price");
  if (totalPriceElement) {
    totalPriceElement.textContent = `₹${totalPrice.toFixed(2)}`;
  }
}

window.increaseQuantity = function (index) {
  const userKey = currentUser
    ? `cart_${currentUser.email.replace(".", "_")}`
    : "cart_guest";
  const cart = JSON.parse(localStorage.getItem(userKey)) || [];

  if (index >= 0 && index < cart.length) {
    cart[index].quantity += 1;
    localStorage.setItem(userKey, JSON.stringify(cart));
    renderCart();
  } else {
    console.error("Invalid cart index:", index);
  }
};

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
    renderCart();
    updateTotalPrice();
  } else {
    console.error("Invalid cart index:", index);
  }
};

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

function checkForElement(id, callback) {
  const element = document.getElementById(id);
  if (element) {
    callback(element);
  } else {
    setTimeout(() => checkForElement(id, callback), 100);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  checkForElement("place-order-button", (placeOrderButton) => {
    placeOrderButton.addEventListener("click", () => {
      console.log("Place Order button clicked.");
      placeOrder();
    });
  });
});



async function placeOrder() {
  console.log("Placing order...");

  const userKey = currentUser
    ? `cart_${currentUser.email.replace(".", "_")}`
    : "cart_guest";

  const cart = JSON.parse(localStorage.getItem(userKey)) || [];

  if (cart.length === 0) {
    showMessage("Your cart is empty. Please add items to your cart before placing an order.", "error");
    return;
  }

  const order = {
    user: currentUser ? currentUser.email : "Guest",
    items: cart,
    totalPrice: calculateTotalPrice(cart),
    date: new Date().toISOString(),
  };

  try {
    const docRef = await addDoc(collection(db, "orders"), order);
    console.log("Order placed with ID:", docRef.id);
    showMessage("Your order has been placed successfully!", "success");
    // localStorage.removeItem(userKey); // Clear cart after order
    window.location.href = "../../../Assets/pages/html/billingdetails.html";
  } catch (error) {
    console.error("Error placing order:", error);
    showMessage("There was an error placing your order. Please try again later.", "error");
  }
}

function calculateTotalPrice(cart) {
  return cart.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
}

function showMessage(message, type) {
  const messageContainer = document.getElementById("message-container");
  if (messageContainer) {
    messageContainer.textContent = message;
    messageContainer.className = type === "error" ? "message error" : "message success";
    messageContainer.style.display = "block";

    setTimeout(() => {
      messageContainer.style.display = "none";
    }, 3000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});
