import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  updateDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";

// Firebase configuration
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
const db = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth();

// Store user information
let currentUser = null;

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is logged in:", user.email);
    currentUser = user; // Store the logged-in user
  } else {
    console.log("No user is logged in.");
    currentUser = null; // Reset currentUser when logged out
  }
});

// Handle Form Submission
document.getElementById("addProductForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("productName").value.trim();
  const price = document.getElementById("productPrice").value.trim();
  const image1 = document.getElementById("productImage").value.trim();
  const category = document.getElementById("productCategory").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!name || !price || !image1 || !category||!description) {
    alert("All fields are required.");
    return;
  }

  if (currentUser) {
    try {
      // Reference the Firestore document for the selected category
      const categoryDocRef = doc(db, "products", category);

      // Fetch the current document data
      const categoryDoc = await getDoc(categoryDocRef);
      if (!categoryDoc.exists()) {
        throw new Error(`Category "${category}" does not exist in Firestore.`);
      }

      const currentData = categoryDoc.data();
      console.log("Current category data:", currentData);

      // Add the new product to the existing products array
      const newProduct = {
        name,
        price: parseFloat(price),
        image1,
        description,
        userId: currentUser.uid, // Track which user added the product
        timestamp: new Date().toISOString(),
      };

      const updatedProducts = [...(currentData.products || []), newProduct];
      console.log("Updated products array:", updatedProducts);

      // Update the document in Firestore
      await updateDoc(categoryDocRef, { products: updatedProducts });

      alert("Product added successfully!");
      document.getElementById("addProductForm").reset(); // Clear the form
    } catch (error) {
      console.error("Error adding product:", error.message, error.stack);
      alert("Error adding product: " + error.message);
    }
  } else {
    alert("You need to be signed in to add a product.");
  }
});
