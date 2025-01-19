import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
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

// Fetch products from Firestore
async function fetchProducts() {
  try {
    const productsCollection = collection(db, "products");
    const productsSnapshot = await getDocs(productsCollection);
    const allProducts = [];

    productsSnapshot.forEach(doc => {
      const data = doc.data();
      // Flatten nested product arrays (accessories, beds, etc.)
      if (data.products && Array.isArray(data.products)) {
        data.products.forEach(product => {
          allProducts.push({ id: doc.id, ...product });
        });
      } else {
        allProducts.push({ id: doc.id, ...data });
      }
    });

    console.log("All Products:", allProducts);



    // Attach event listener to the search bar
    const searchBar = document.getElementById("searchBar");
    searchBar.addEventListener("input", function () {
      searchProducts(allProducts);
    });

  } catch (error) {
    console.error("Error fetching products from Firestore:", error);
  }
}

// Function to display products
function displayProducts(products) {
  const itemsContainer = document.getElementById("items");
  itemsContainer.innerHTML = "";

  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || []; // Fetch wishlist from localStorage

  products.forEach(product => {
    const image1 = product.image1 || "../../../Assets/images/petwithtoy.jpg";
    const image2 = product.image2 || "../../../Assets/images/petwithtoy.jpg";
    const name = product.name || "Unnamed Product";
    const price = product.price || "N/A";

    console.log("Product Images:", image1, image2);

    const productDiv = document.createElement("div");
    productDiv.classList.add("product");

    productDiv.innerHTML = `
      <span class="wishlist-heart">${isInWishlist(name, wishlist) ? '❤️' : '♡'}</span>
      <img src="${image1}" alt="Product Image" class="product-image">
      <p>${product.name} 
        <span class="more-dots" onclick="toggleDescription('${product.name}')">...</span>
      </p>
      <div class="product-description" id="desc-${product.name}" style="display: none;">
        ${product.description || 'No description available.'}
      </div>
      <img src="../../../Assets/images/star_rating_img.webp" alt="Rating" class="star_rating">
      <p class="price">${price}</p>
      <button type="button" class="Button" onclick="addToCart('${product.name}', '${product.price}', '${product.image1}', this)">
        Add to Cart
      </button>
      <button type="button" class="Button" onclick="buyNow('${product.name}', '${product.price}', '${product.image1}')">
        Buy Now
      </button>
    `;
    const wishlistHeart = productDiv.querySelector(".wishlist-heart");
    wishlistHeart.addEventListener("click", () => addToWishlist(wishlistHeart, name, price, image1));
    itemsContainer.appendChild(productDiv);
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

// Helper function to check if the product is in the wishlist
function isInWishlist(name, wishlist) {
  return wishlist.some(item => item.name === name);
}

// Wishlist functionality
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

// Function to search products
function searchProducts(allProducts) {
  const searchQuery = document.getElementById("searchBar").value.toLowerCase().trim();
  const itemsContainer = document.getElementById("items");

  if (searchQuery === "") {
    itemsContainer.innerHTML = '<p>Start typing to search for products...</p>';
    return;
  }

  const filteredProducts = allProducts.filter(product => {
    const nameMatch = product.name && product.name.toLowerCase().includes(searchQuery);
    const priceMatch = product.price && product.price.toString().toLowerCase().includes(searchQuery);
    return nameMatch || priceMatch;
  });

  if (filteredProducts.length > 0) {
    displayProducts(filteredProducts);
  } else {
    itemsContainer.innerHTML = '<p>No products found matching your search query.</p>';
  }
}

// Add to cart function
window.addToCart = function addToCart(name, price, img, buttonElement) {
  if (!currentUser) {
    showMessage("You need to log in to add items to the cart.", "error");
    window.location.href = "../../../Assets/pages/html/login.html";
    return;
  }

  const userEmail = `cart_${currentUser.email.replace('.', '_')}`;
  let cart = JSON.parse(localStorage.getItem(userEmail)) || [];

  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    // If the item already exists in the cart, increase the quantity
    if (existingItem.quantity < 10) {
      existingItem.quantity += 1;
      showMessage("Product quantity increased!", "success");
    } else {
      showMessage("Maximum quantity reached for this product.", "error");
    }
  } else {
    // If the item doesn't exist in the cart, add it
    cart.push({ name, price, img, quantity: 1 });
    showMessage("Product added to cart", "success");
  }

  // Save updated cart to localStorage
  localStorage.setItem(userEmail, JSON.stringify(cart));
  updateCartCount();

  // Update button text to go to cart
  if (buttonElement) {
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
    const productName = productDiv.querySelector("p").textContent.trim();
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
  const userEmail = currentUser ? `cart_${currentUser.email.replace(".", "_")}` : "cart_guest";
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

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  updateCartCount();
});
