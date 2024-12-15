import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";

// Firebase configuration
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
const analytics = getAnalytics(app);
const auth = getAuth();


fetch('../../../Assets/pages/json/accessory.json')
  .then(response => response.json())
  .then(jsonData => {
    const productList = document.getElementById("items");

    jsonData.products.forEach(product => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");
      productDiv.innerHTML = `
        <img src="${product.image}" alt="wishlist_img" class="wishlist-img">
        <img src="${product.image1}" alt="Accessory image" class="product-image">
        <p> ${product.name}</p>
        <img src="${product.image2}" alt="rating" class="star_rating">
        <p>Price: ${product.price}</p>
        <button type="button" class="Button"
        onclick="addToCart( '${product.name}','${product.price}', '${product.image1}')">
        Add to Cart</button>
        <button type="button" class="Buttons">Buy Now</button>
      `;
      productList.appendChild(productDiv);
    });
  });


  
  let currentUser = null;

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is logged in:", user.email);
    currentUser = user;  // Store the logged-in user
  } else {
    console.log("No user is logged in.");
    currentUser = null;  // Set currentUser to null if not logged in
  }
});


window.addToCart = function addToCart(name, price, img) {
  // Check if the user is logged in
  if (!currentUser) {
    // If not logged in, redirect to the login page
    alert("You need to log in to add items to the cart.");
    window.location.href = "../../../Assets/pages/html/login.html";
    return;  // Stop further execution of the function
  }

  // Proceed with the addToCart logic if the user is logged in
  const userEmail = `cart_${currentUser.email.replace('.', '_')}`;
  let cart = JSON.parse(localStorage.getItem(userEmail)) || [];

  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    if (existingItem.quantity < 10) {
      existingItem.quantity += 1;
      alert('Increased quantity in your cart!');
    } else {
      alert('Maximum quantity reached.');
    }
  } else {
    cart.push({ name, price, img, quantity: 1 });
    alert('Product added to cart!');
  }

  localStorage.setItem(userEmail, JSON.stringify(cart));
  updateCartCount();
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
