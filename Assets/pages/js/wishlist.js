import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, getDoc, deleteDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
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
    loadWishlist();  // Fetch wishlist when user logs in
  } else {
    console.log("No user is logged in.");
    currentUser = null;
  }
});

// Load wishlist from local storage
function loadWishlist() {
    console.log(JSON.parse(localStorage.getItem('wishlist')));
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistContainer = document.getElementById('wishlist-container');
    
    wishlistContainer.innerHTML = '';
    
    wishlist.forEach((item, index) => {
        const wishlistItem = document.createElement('div');
        wishlistItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" width="50" height="50">
            <p>${item.name}</p>
            <p>₹${item.price}</p> 
            <button type="button" class="Button" onclick="addToCart('${item.name}', '${item.price}', '${item.image}',this)">Add to Cart</button>
            <button onclick="buyNow('${item.name}', '${item.price}', '${item.image}')">Buy Now</button>
            <button onclick="removeFromWishlist(${index})">Remove</button>
        `;
        wishlistContainer.appendChild(wishlistItem);
    });
    restoreCartButtons()
}

// Remove item from wishlist
window.removeFromWishlist=function(index) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (index >= 0 && index < wishlist.length) {
        wishlist.splice(index, 1); // Remove the item at the specified index
        localStorage.setItem('wishlist', JSON.stringify(wishlist)); // Update local storage
        loadWishlist(); // Reload the wishlist to reflect changes
    } else {
        console.error('Invalid index for removal:', index);
    }
}


window.addToCart = function addToCart(name, price, img, buttonElement) {
    if (!currentUser) {
      showMessage("You need to log in to add items to the cart.", "error");
      window.location.href = "../../../Assets/pages/html/login.html";
      return;
    }

    const userEmail = `cart_${currentUser.email.replace('.', '_')}`;
    let cart = JSON.parse(localStorage.getItem(userEmail)) || [];

    const existingItem = cart.find((item) => item.name === name);
    if (existingItem) {
      if (existingItem.quantity < 10) {
        existingItem.quantity += 1;
        showMessage("Increased quantity in your cart!", "success");
      } else {
        showMessage("Maximum quantity reached.", "error");
      }
    } else {
      cart.push({ name, price, img, quantity: 1 });
      showMessage("Product added to cart!", "success");
    }

    localStorage.setItem(userEmail, JSON.stringify(cart));
    updateCartCount();

    if (buttonElement) {
      buttonElement.textContent = "Go to Cart";
      buttonElement.onclick = () => {
        window.location.href = "../../../Assets/pages/html/cart.html";
      };
    }
};


function restoreCartButtons() {
    const userEmail = currentUser ? `cart_${currentUser.email.replace('.', '_')}` : "cart_guest";
    const cart = JSON.parse(localStorage.getItem(userEmail)) || [];

    document.querySelectorAll('.product').forEach((productDiv) => {
      const productName = productDiv.querySelector('p').textContent.trim();
      const addToCartButton = productDiv.querySelector('button');

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

// Buy now function
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

// Show feedback messages
function showMessage(message, type) {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.textContent = message;
      messageContainer.classList.remove("success", "error");
      messageContainer.classList.add(type);
      messageContainer.style.display = "block";
      setTimeout(() => {
        messageContainer.style.display = "none";
      }, 3000);
    }
}
