import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
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
const db = getFirestore(app);
const auth = getAuth();
const analytics = getAnalytics(app);

// Store user information
let currentUser = null;

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is logged in:", user.email);
    currentUser = user;
  } else {
    console.log("No user is logged in.");
    currentUser = null;
  }
  updateCartCount();
});

// Function to fetch products for a specific category
async function fetchProducts(categoryName) {
  try {
    const categoryRef = doc(db, "products", categoryName);
    const categoryDoc = await getDoc(categoryRef);

    if (categoryDoc.exists()) {
      const productsData = categoryDoc.data();
      console.log(`${categoryName} products fetched successfully:`, productsData);
      displayProducts(productsData.products);
    } else {
      console.log(`No products found for ${categoryName}.`);
    }
  } catch (error) {
    console.error(`Error fetching ${categoryName} products:`, error);
  }
}

function displayProducts(products) {
  const productList = document.getElementById("items");
  productList.innerHTML = ""; // Clear existing content

  // Get the wishlist from local storage
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.dataset.name = product.name;  // <-- Store product name here

    productDiv.innerHTML = `
      <span class="wishlist-heart">${isInWishlist(product.name, wishlist) ? '❤️' : '♡'}</span>
      <img src="${product.image1}" alt="${product.name}" class="product-image">
      <p class="product-name">${product.name} 
        <span class="more-dots" onclick="toggleDescription('${product.name}')">...</span>
      </p>
      <div class="product-description" id="desc-${product.name}" style="display: none;">
        ${product.description || 'No description available.'}
      </div>
      <img src="../../../Assets/images/star_rating_img.webp" alt="Rating" class="star_rating">
      <p>Price: ${product.price}</p>
      <button type="button" class="Button" onclick="addToCart('${product.name}', '${product.price}', '${product.image1}', this)">
        Add to Cart
      </button>
      <button type="button" class="Button" onclick="buyNow('${product.name}', '${product.price}', '${product.image1}')">
        Buy Now
      </button>
    `;

    const wishlistHeart = productDiv.querySelector(".wishlist-heart");
    wishlistHeart.addEventListener("click", () => addToWishlist(wishlistHeart, product.name, product.price, product.image1));
    productList.appendChild(productDiv);
  });

  restoreCartButtons();
}

// Function to toggle the visibility of the product description
window.toggleDescription = function(productName) {
  const description = document.getElementById(`desc-${productName}`);
  const productDiv = description.closest('.product'); // Find the closest product container

  if (description.style.display === "none" || description.style.display === "") {
    description.style.display = "block"; // Show description
    description.style.maxHeight = description.scrollHeight + "px"; // Adjust max height
    productDiv.classList.add('show-description'); // Expand product container
  } else {
    description.style.display = "none"; // Hide description
    description.style.maxHeight = "0"; // Reset max height
    productDiv.classList.remove('show-description'); // Collapse product container
  }
}

// Helper function to check if the product is in the wishlist
function isInWishlist(name, wishlist) {
  return wishlist.some(item => item.name === name);
}

window.addToWishlist = function addToWishlist(element, name, price, image) {
  console.log("Wishlist clicked:", name); // Debugging log

  const wishlistItem = {
    name: name,
    price: price,
    image: image
  };

  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const existingItem = wishlist.find(item => item.name === name);

  if (!existingItem) {
    wishlist.push(wishlistItem);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    element.textContent = '❤️';
  } else {
    wishlist = wishlist.filter(item => item.name !== name);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    element.textContent = '♡';
  }

  showMessage(`Item ${existingItem ? 'removed from' : 'added to'} wishlist!`, 'success');
};

window.buyNow = function buyNow(name, price, img) {
  if (!currentUser) {
    showMessage("You need to log in to proceed with the purchase.", "error");
    window.location.href = "../../../Assets/pages/html/login.html";
    return;
  }

  const productDetails = { name, price, img };
  localStorage.setItem("buyNowProduct", JSON.stringify(productDetails));
  window.location.href = "../../../Assets/pages/html/buynow.html";
};

// Add to cart function
window.addToCart = function addToCart(name, price, img, buttonElement) {
  if (!currentUser) {
    showMessage("You need to log in to add items to the cart.", "error");
    window.location.href = "../../../Assets/pages/html/login.html";
    return;
  }

  const userEmail = `cart_${currentUser.email.replace('.', '_')}`;
  let cart = JSON.parse(localStorage.getItem(userEmail)) || [];

  // Create a product object
  const newProduct = { name, price, img, quantity: 1 };

  // Check if the product already exists in the cart
  const existingProduct = cart.find(item => item.name === name);
  if (existingProduct) {
    // If the product exists, update the quantity
    existingProduct.quantity += 1;
  } else {
    // If it doesn't exist, add the new product to the cart
    cart.push(newProduct);
  }

  // Save the updated cart back to localStorage
  localStorage.setItem(userEmail, JSON.stringify(cart));

  // Update the cart count
  updateCartCount();

  // Provide feedback and update the button
  if (buttonElement) {
    showMessage("Product added to cart", "success");
    buttonElement.textContent = "Go to Cart";
    buttonElement.onclick = () => {
      window.location.href = "../../../Assets/pages/html/cart.html";
    };
  }
};

// Restore cart buttons based on saved cart
function restoreCartButtons() {
  const userEmail = currentUser ? `cart_${currentUser.email.replace('.', '_')}` : "cart_guest";
  const cart = JSON.parse(localStorage.getItem(userEmail)) || [];

  document.querySelectorAll(".product").forEach((productDiv) => {
    const productName = productDiv.dataset.name;  // Use data attribute here
    const addToCartButton = productDiv.querySelector(".Button");

    if (cart.some((item) => item.name === productName)) {
      addToCartButton.textContent = "Go to Cart";
      addToCartButton.onclick = () => {
        window.location.href = "../../../Assets/pages/html/cart.html";
      };
    }
  });
}

// Update cart count
function updateCartCount() {
  const userEmail = currentUser ? `cart_${currentUser.email.replace('.', '_')}` : "cart_guest";
  const cart = JSON.parse(localStorage.getItem(userEmail)) || [];
  const countElement = document.querySelector(".cart-count");

  if (countElement) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    countElement.textContent = totalItems;
  }
}

// Show feedback messages
function showMessage(message, type) {
  const messageContainer = document.getElementById("message-container");
  if (messageContainer) {
    messageContainer.textContent = message;

    // Remove any existing success or error classes
    messageContainer.classList.remove("success", "error");

    // Add the appropriate class for the type
    messageContainer.classList.add(type);

    // Show the message container
    messageContainer.style.display = "block";

    // Hide the message after 3 seconds
    setTimeout(() => {
      messageContainer.style.display = "none";
    }, 3000);
  }
}

// Fetch products when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const categoryName = "accessories"; // Dynamically set based on the category page
  fetchProducts(categoryName);
});
