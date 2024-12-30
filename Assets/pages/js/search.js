import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEI1_9P4cuTNZ7lToZDzXia6vmfq3vf1w",
  authDomain: "pet-world-945a1.firebaseapp.com",
  projectId: "pet-world-945a1",
  storageBucket: "pet-world-945a1.appspot.com",
  messagingSenderId: "65370724893",
  appId: "1:65370724893:web:9c615c57b3ad459bdd04f4",
  measurementId: "G-Y4LZ85V604"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore(app);

let currentUser = null;

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  console.log("User state changed:", user ? user.email : "No user");
  updateCartCount();
});

const jsonFiles = [
  "../../../Assets/pages/json/accessory.json",
  "../../../Assets/pages/json/carriers.json",
  "../../../Assets/pages/json/beds.json",
  "../../../Assets/pages/json/cleaning.json",
  "../../../Assets/pages/json/food_treats.json",
  "../../../Assets/pages/json/medicine.json",
  "../../../Assets/pages/json/pet_house.json",
  "../../../Assets/pages/json/toys.json"
];

// Fetch products from multiple JSON files
async function fetchProducts() {
  const allProducts = [];
  try {
    for (let file of jsonFiles) {
      const response = await fetch(file);
      if (!response.ok) {
        console.error(`Failed to fetch ${file}:`, response.status);
        continue;
      }

      const data = await response.json();
      console.log(`Fetched data from ${file}:`, data);

      if (data.products) {
        allProducts.push(...data.products);
      } else {
        console.warn(`No 'products' field in ${file}`);
      }
    }

    const searchBar = document.getElementById("searchBar");
    searchBar.addEventListener("input", function () {
      searchProducts(allProducts);
    });

    const itemsContainer = document.getElementById("items");
    itemsContainer.innerHTML = '<p>Start typing to search for products...</p>';
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Function to display products
function displayProducts(products) {
  const itemsContainer = document.getElementById("items");
  itemsContainer.innerHTML = "";

  products.forEach(product => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");

    const image = product.image || "./default-image.jpg";
    const name = product.name || "Unnamed Product";
    const price = product.price || "N/A";
    const image1 = product.image1 || "./default-image.jpg";
    const image2 = product.image2 || "./default-image.jpg";

    productDiv.innerHTML = `
      <img src="${image}" alt="Product Image" class="wishlist-img">
      <img src="${image1}" alt="Product Image" class="product-image">
      <p class="product-name">${name}</p>
      <img class="star_rating" src="${image2}" alt="Star Rating">
      <p class="price">${price}</p>
      <button class="Button" onclick="addToCart('${name}', '${price}', '${image1}')">Add to Cart</button>
      <button type="button" class="Buttons">Buy Now</button>
    `;

    itemsContainer.appendChild(productDiv);
  });
}

// Function to search products
function searchProducts(products) {
  const searchQuery = document.getElementById("searchBar").value.toLowerCase().trim();
  const itemsContainer = document.getElementById("items");

  if (searchQuery === "") {
    itemsContainer.innerHTML = '<p>Start typing to search for products...</p>';
    return;
  }

  const filteredProducts = products.filter(product => {
    const nameMatch = product.name && product.name.toLowerCase().includes(searchQuery);
    const priceMatch = product.price && product.price.toLowerCase().includes(searchQuery);
    return nameMatch || priceMatch;
  });

  if (filteredProducts.length > 0) {
    displayProducts(filteredProducts);
  } else {
    itemsContainer.innerHTML = '<p>No products found matching your search query.</p>';
  }
}

// Add to Cart
window.addToCart = function addToCart(name, price, img) {
  if (!currentUser) {
    alert("You need to log in to add items to the cart.");
    window.location.href = "../../../Assets/pages/html/login.html";
    return;
  }

  const userEmail = `cart_${currentUser.email.replace(".", "_")}`;
  let cart = JSON.parse(localStorage.getItem(userEmail)) || [];

  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    if (existingItem.quantity < 10) {
      existingItem.quantity += 1;
      alert("Increased quantity in your cart!");
    } else {
      alert("Maximum quantity reached.");
    }
  } else {
    cart.push({ name, price, img, quantity: 1 });
    alert("Product added to cart!");
  }

  localStorage.setItem(userEmail, JSON.stringify(cart));
  updateCartCount();
};

function updateCartCount() {
  const userEmail = currentUser ? `cart_${currentUser.email.replace(".", "_")}` : "cart_guest";
  const cart = JSON.parse(localStorage.getItem(userEmail)) || [];
  const countElement = document.querySelector(".cart-count");

  if (countElement) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    countElement.textContent = totalItems;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  updateCartCount();
});
