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
    fetchWishlist();  // Fetch wishlist when user logs in
  } else {
    console.log("No user is logged in.");
    currentUser = null;
  }
});


// Function to fetch the wishlist products from Firestore or localStorage
async function fetchWishlist() {
    const wishlistContainer = document.getElementById("items");
    
    if (!currentUser) {
      // Use local storage if not logged in
      const userKey = "wishlist_guest";
      const wishlist = JSON.parse(localStorage.getItem(userKey)) || [];
      displayWishlist(wishlist);  // Display the local storage wishlist
      return;
    }
  
    // If logged in, fetch from Firestore
    const wishlistRef = collection(db, "users", currentUser.uid, "wishlist");
    const q = query(wishlistRef);
  
    try {
      const querySnapshot = await getDocs(q);
      const wishlistItems = [];
  
      querySnapshot.forEach((doc) => {
        wishlistItems.push(doc.data());
      });
  
      if (wishlistItems.length > 0) {
        displayWishlist(wishlistItems);
      } else {
        wishlistContainer.innerHTML = "<p>No products in your wishlist.</p>";
      }
    } catch (error) {
      console.error("Error fetching wishlist products:", error);
    }
  }
  
  // Function to display the products in the wishlist
  function displayWishlist(products) {
    const wishlistContainer = document.getElementById("items");
    wishlistContainer.innerHTML = ""; // Clear existing content
  
    if (products.length === 0) {
      wishlistContainer.innerHTML = "<p>Your wishlist is empty.</p>";
      return;
    }
  
    products.forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");
      productDiv.innerHTML = `
        <img src="${product.image1}" alt="${product.name}" class="product-image">
        <p>${product.name}</p>
        <p>Price: ${product.price}</p>
        <button type="button" class="remove-button" onclick="removeFromWishlist('${product.name}')">Remove</button>
        <button type="button" class="Button" onclick="addToCart('${product.name}', '${product.price}', '${product.image1}')">
          Add to Cart
        </button>
        <button type="button" class="Buttons">Buy Now</button>
      `;
      wishlistContainer.appendChild(productDiv);
    });
  }
  
  // Function to remove a product from the wishlist
  window.removeFromWishlist = async function removeFromWishlist(productName) {
    if (!currentUser) {
      showMessage("You need to log in to remove items from the wishlist.", "error");
      window.location.href = "../../../Assets/pages/html/login.html";
      return;
    }
  
    const productRef = doc(db, "users", currentUser.uid, "wishlist", productName);
  
    try {
      await deleteDoc(productRef);  // Remove from Firestore
      showMessage("Product removed from wishlist!", "success");
  
      // Also remove from local storage
      const userKey = `wishlist_${currentUser.email.replace('.', '_')}`;
      let wishlist = JSON.parse(localStorage.getItem(userKey)) || [];
      wishlist = wishlist.filter((item) => item.name !== productName);
      localStorage.setItem(userKey, JSON.stringify(wishlist));
  
      fetchWishlist();  // Refresh the wishlist UI after removal
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
      showMessage("Error removing product from wishlist.", "error");
    }
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