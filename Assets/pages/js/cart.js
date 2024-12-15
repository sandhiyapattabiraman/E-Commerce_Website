// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEI1_9P4cuTNZ7lToZDzXia6vmfq3vf1w",
  authDomain: "pet-world-945a1.firebaseapp.com",
  projectId: "pet-world-945a1",
  storageBucket: "pet-world-945a1.firebasestorage.app",
  messagingSenderId: "65370724893",
  appId: "1:65370724893:web:9c615c57b3ad459bdd04f4",
  measurementId: "G-Y4LZ85V604",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let currentUser = null; // To store the logged-in user

// Listen to auth state changes
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  renderCart(); // Render cart when auth state changes
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
            <p>Quantity: ${item.quantity}</p>
            <button onclick="removeFromCart(${index})">Remove</button>
        </div>
      `
    )
    .join("");
    updateTotalPrice();
}

function updateTotalPrice() {
    const userEmail = currentUser ? `cart_${currentUser.email.replace('.', '_')}` : 'cart_guest';
    const cart = JSON.parse(localStorage.getItem(userEmail)) || [];
    let totalPrice = 0;
  
    cart.forEach(item => {
      totalPrice += item.price * item.quantity;
    });
  
    document.getElementById("total-price").textContent = totalPrice.toFixed(2);
  }
  

  window.removeFromCart = function (index) {
    const userKey = currentUser ? `cart_${currentUser.email.replace(".", "_")}` : 'cart_guest';
    const cart = JSON.parse(localStorage.getItem(userKey)) || [];
  
    if (index >= 0 && index < cart.length) {
      cart.splice(index, 1); // Remove item at the specified index
      localStorage.setItem(userKey, JSON.stringify(cart)); // Update localStorage
      renderCart(); // Re-render the cart and update total price
    } else {
      console.error("Invalid cart index:", index);
    }
  };
  
  function updateCartCount() {
    const userEmail = currentUser ? `cart_${currentUser.email.replace('.', '_')}` : 'cart_guest';
    const cart = JSON.parse(localStorage.getItem(userEmail)) || [];
    const countElement = document.querySelector(".cart-count");
  
    if (countElement) {
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      countElement.textContent = totalItems; // Update the cart count in the UI
    }
  }
  
  // Listen for authentication state changes
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    console.log("User state changed:", user ? user.email : "No user");
    updateCartCount(); // Update the cart count when the user state changes
  });
  
  // Run on page load to update cart count
  document.addEventListener("DOMContentLoaded", () => {
    updateCartCount(); // Update cart count when the page loads
  });
  