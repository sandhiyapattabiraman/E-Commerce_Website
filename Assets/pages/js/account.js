// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEI1_9P4cuTNZ7lToZDzXia6vmfq3vf1w",
  authDomain: "pet-world-945a1.firebaseapp.com",
  projectId: "pet-world-945a1",
  storageBucket: "pet-world-945a1.firebasestorage.app",
  messagingSenderId: "65370724893",
  appId: "1:65370724893:web:9c615c57b3ad459bdd04f4",
  measurementId: "G-Y4LZ85V604"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

// DOM References
const usernameDisplay = document.querySelector(".username-display");
const logoutButton = document.querySelector(".profile-actions .action-button");

// Handle authentication state
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Fetch user details from Firestore
    const userRef = doc(db, "users", user.uid); // Assuming user details are stored under "users" collection with UID as the document ID
    try {
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        usernameDisplay.textContent = `Welcome, ${userData.username}`; // Display username
      } else {
        console.error("User data not found in Firestore.");
        window.location.href = "../../../Assets/pages/html/login.html";
      }
    } catch (error) {
      console.error("Error fetching user details from Firestore:", error);
      window.location.href = "../../../Assets/pages/html/login.html";
    }
  } else {
    // User is not logged in, redirect to login page
    window.location.href = "../../../Assets/pages/html/login.html";
  }
});

// Logout functionality
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("User signed out successfully.");
      window.location.href = "../../../Assets/pages/html/login.html";
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
});
