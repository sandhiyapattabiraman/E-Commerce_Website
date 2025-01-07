let currentIndex = 0;

function showSlide(index) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');

  if (index >= slides.length) currentIndex = 0;
  if (index < 0) currentIndex = slides.length - 1;

  slides.forEach(slide => (slide.style.display = 'none'));
  dots.forEach(dot => dot.classList.remove('active'));

  slides[currentIndex].style.display = 'block';
  dots[currentIndex].classList.add('active');
}

function nextSlide() {
  currentIndex++;
  showSlide(currentIndex);
}

function prevSlide() {
  currentIndex--;
  showSlide(currentIndex);
}

function createDots() {
  const dotsContainer = document.querySelector('.dots');
  const slides = document.querySelectorAll('.slide');

  slides.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.addEventListener('click', () => {
      currentIndex = index;
      showSlide(currentIndex);
    });
    dotsContainer.appendChild(dot);
  });
}

document.querySelector('.prev').addEventListener('click', prevSlide);
document.querySelector('.next').addEventListener('click', nextSlide);

// Initialize slideshow
createDots();
showSlide(currentIndex);
setInterval(nextSlide, 5000);





fetch('./Assets/pages/json/categories.json')
.then(response => response.json())
.then(data => {
  const categoriesContainer = document.getElementById("categories");
  data.categories.forEach(category => {
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("allproducts");
    categoryDiv.innerHTML = `
      <a href="${category.link}">
      <img src="${category.image}" alt="${category.name}" class="product_img">
      <p>${category.name}</p>
      </a>
    `;
    categoriesContainer.appendChild(categoryDiv);
  });
})
.catch(error => console.error("Error fetching categories:", error));

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
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

let currentUser = null; // Variable to track the current user

// Fetch product data from JSON and display it
fetch('./Assets/pages/json/products.json')
  .then((response) => response.json())
  .then((jsonData) => {
    const productList = document.getElementById("items");

    jsonData.products.forEach(product => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");
      productDiv.innerHTML = `
        <img src="${product.image}" alt="wishlist_img" class="wishlist-img">
        <img src="${product.image1}" alt="product image" class="product-image">
        <p>${product.name}</p>
        <img src="${product.image2}" alt="rating" class="star_rating">
        <p>Price: ${product.price}</p>
        <button type="button" class="Button"
        onclick="addToCart( '${product.name}','${product.price}', '${product.image1}')">
        Add to Cart
        </button>
        <button type="button" class="Buttons">Buy Now</button>
      `;
      productList.appendChild(productDiv);
    });
  });

// Add to cart function
window.addToCart = function addToCart(name, price, img) {
  // Check if the user is logged in
  if (!currentUser) {
    alert("You need to log in to add items to the cart.");
    window.location.href = "./Assets/pages/html/login.html";
    return; // Stop further execution
  }

  // Retrieve the user's cart from localStorage
  const userEmail = `cart_${currentUser.email.replace('.', '_')}`;
  let cart = JSON.parse(localStorage.getItem(userEmail)) || [];

  // Check if the product already exists in the cart
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    if (existingItem.quantity < 10) {
      existingItem.quantity += 1;
      alert('Increased quantity in your cart!');
    } else {
      alert('Maximum quantity reached.');
    }
  } else {
    // Add new product to the cart
    cart.push({ name, price, img, quantity: 1 });
    alert('Product added to cart!');
  }

  // Save the updated cart back to localStorage
  localStorage.setItem(userEmail, JSON.stringify(cart));
  updateCartCount(); // Update cart count in the header
};

// Update cart count dynamically
function updateCartCount() {
  const userEmail = currentUser ? `cart_${currentUser.email.replace('.', '_')}` : 'cart_guest';
  const cart = JSON.parse(localStorage.getItem(userEmail)) || [];
  const countElement = document.querySelector(".cart-count");

  if (countElement) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    countElement.textContent = totalItems; // Update the cart count in the UI
  }
}

document.getElementById('contact-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form from submitting normally

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  console.log('Form submitted with:', {
    name,
    email,
    message
  });

 
  alert('Thank you for your message!');
});

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
