import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";

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
const analytics = getAnalytics(app);
const auth = getAuth();  // Firebase Auth instance

// Get the form and button references
const form = document.getElementById("form");
const submitButton = document.getElementById("submitButton");  // Add this to handle button state
form.setAttribute("novalidate", true);  // Disable native validation

// Get error message elements
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

emailError.style.color = "red";
passwordError.style.color = "red";

// Form validation on submit
form.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission if there's an error

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Clear previous error messages
    emailError.textContent = "";
    passwordError.textContent = "";

    let validForm = true;

    // Validate email
    if (!emailPattern.test(email)) {
        emailError.textContent = "Please enter a valid email address.";
        validForm = false;
    }

    // Validate password
    if (password.length < 8) {
        passwordError.textContent = "Password must be at least 8 characters.";
        validForm = false;
    }

    if (!validForm) return;  // If validation fails, don't proceed further

    // Change button text and disable it while submitting
    submitButton.disabled = true;
    submitButton.textContent = "Logging in...";

    // Firebase sign-in process
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Successfully logged in
            const user = userCredential.user;
            console.log("User logged in:", user);

            // Redirect to dashboard or home page after successful login
            window.location.href = "../../../index.html";  // Replace with your actual redirect path
        })
        .catch((error) => {
            // Handle errors during login
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error during login:", errorCode, errorMessage);

            // Display error messages based on Firebase authentication error codes
            if (errorCode === "auth/invalid-email") {
                emailError.textContent = "Invalid email address.";
            } else if (errorCode === "auth/user-not-found") {
                emailError.textContent = "No user found with this email.";
            } else if (errorCode === "auth/wrong-password") {
                passwordError.textContent = "Incorrect password.";
            } else {
                // Generic error
                emailError.textContent = "Login failed. Please try again.";
            }

            // Re-enable the button and reset the button text
            submitButton.disabled = false;
            submitButton.textContent = "Login";  // Reset the button text
        });
});

// Input event listener for live validation
form.addEventListener("input", function(event) {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Remove error messages as the user types
    if (emailPattern.test(email)) {
        emailError.textContent = "";
    }

    if (password.length >= 8) {
        passwordError.textContent = "";
    }
});
