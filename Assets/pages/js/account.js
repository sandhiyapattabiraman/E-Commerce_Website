// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

// DOM References
const ordersContainer = document.querySelector(".orders-container");
const usernameDisplay = document.querySelector(".username-display");

// Ensure the DOM is fully loaded before attaching event listeners
document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.querySelector(".profile-actions .action-button");

  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      console.log("Logout button clicked");
      try {
        await signOut(auth);
        console.log("Signed out successfully");
        window.location.href = "../../../Assets/pages/html/login.html";
      } catch (error) {
        console.error("Error signing out:", error);
      }
    });
  } else {
    console.error("Logout button not found in the DOM.");
  }
});

// Authentication State
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    try {
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        usernameDisplay.textContent = `Welcome, ${userDoc.data().username}`;
        loadOrders(user.email);
      } else {
        window.location.href = "../../../Assets/pages/html/login.html";
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      window.location.href = "../../../Assets/pages/html/login.html";
    }
  } else {
    window.location.href = "../../../Assets/pages/html/login.html";
  }
});

async function loadOrders(userId) {
  const ordersRef = collection(db, "users", userId, "orders");

  try {
    const querySnapshot = await getDocs(ordersRef);
    ordersContainer.innerHTML = "";

    if (querySnapshot.empty) {
      ordersContainer.innerHTML = "<p>You have no orders yet.</p>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const order = doc.data();
      displayNewOrder(doc.id, order);
    });
  } catch (error) {
    console.error("Error loading orders:", error);
    ordersContainer.innerHTML = "<p>Error loading orders.</p>";
  }
}

function displayNewOrder(orderId, orderData) {
  const orderDiv = document.createElement("div");
  orderDiv.classList.add("order-item");

  orderDiv.innerHTML = `
    <div class="order-items">
      <p>Date:${new Date(orderData.date).toLocaleString()}</p>
      <p>Total:₹${orderData.total}</p>
      ${orderData.items.map((item) => 
        `<div class="order-item-details">
          <img src="${item.img || 'https://via.placeholder.com/50'}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;">
          <p><strong>${item.name}</strong></p>
          <p>Quantity: ${item.quantity}</p>
          <p>Price: ₹${item.price}</p>
        </div>`).join("")}
    </div>
  `;

  ordersContainer.appendChild(orderDiv);
}

// Handle New Order Messages
window.addEventListener("message", (event) => {
  if (event.data && event.data.type === "new-order") {
    const { orderId, orderData } = event.data;
    displayNewOrder(orderId, orderData);
  }
});
