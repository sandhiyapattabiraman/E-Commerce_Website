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
