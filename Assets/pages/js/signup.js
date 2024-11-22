import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
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

// Form and button references
const form = document.getElementById("form");
const submitButton = document.getElementById("submitButton");
form.setAttribute("novalidate", true);

const usernameError = document.getElementById("usernameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");

usernameError.style.color = "red";
emailError.style.color = "red";
passwordError.style.color = "red";
confirmPasswordError.style.color = "red";


form.addEventListener("submit", function(event) {
  event.preventDefault();  // Prevent form from submitting before validation
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  // Reset error messages
  usernameError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";
  confirmPasswordError.textContent = "";
  let validForm = true;
  // Validate username
  if (/^[0-9]+$/.test(username) || /\s/.test(username) || !/^[a-zA-Z0-9_]+$/.test(username)) {
    usernameError.textContent = "Invalid username";
    validForm = false;
}
  if (username.length < 3 ) {
      usernameError.textContent = "Username must be at least 3 characters.";
      validForm = false;
  }
  if ( username.length > 254) {
    usernameError.textContent = "Username must not exceed 254 characters.";
    validForm = false;
}
  // Validate email
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email) || email.includes('gmail.com.gmail.com') || email.startsWith('.') || email.endsWith('.') || email.includes('gmail.comgmail.com') || email.includes('@@') || email.includes('.gmail.com') || !email.includes('@gmail.com')) {
      emailError.textContent = "Please enter a valid email address.";
      validForm = false;
  }
  // Validate password

  if (password.includes(" ") ) {
    passwordError.textContent = "Invalid Password";
    validForm = false;
}

  if (password.length < 8 ) {
      passwordError.textContent = "Password must be at least 8 characters.";
      validForm = false;
  }
  // Validate confirm password
  if (password !== confirmPassword) {
      confirmPasswordError.textContent = "Passwords do not match.";
      validForm = false;
  }
  if (!validForm) return;  // Stop execution if validation fails
  // Disable the submit button and show "Creating Account..."
  submitButton.disabled = true;
  submitButton.textContent = "Creating Account...";
  // Create user with Firebase Authentication
  createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
          const user = userCredential.user;
          console.log("User registered:", user);
          // Optionally, save the username to Firebase Firestore or Realtime Database
          // Redirect to the dashboard or login page after successful registration
          window.location.href = "../../../index.html"; // Change this URL as needed
      })
      .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error("Error during registration:", errorCode, errorMessage);
          // Handle Firebase errors
          if (errorCode === 'auth/email-already-in-use') {
              emailError.textContent = "Email is already in use.";
          } else if (errorCode === 'auth/invalid-email') {
              emailError.textContent = "Invalid email address.";
          } else if (errorCode === 'auth/weak-password') {
              passwordError.textContent = "Password is too weak.";
          } else {
              passwordError.textContent = "Registration failed. Please try again.";
          }
          // Re-enable the button and reset the text back to "Register"
          submitButton.disabled = false;
          submitButton.textContent = "Register";
      });
});
// Input event listener for live validation
form.addEventListener("input", function(event) {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  // Remove error messages as the user types
  if (username.length >= 3) {
      usernameError.textContent = "";
  }
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailPattern.test(email)) {
      emailError.textContent = "";
  }
  if (password.length >= 8) {
      passwordError.textContent = "";
  }
  if (password === confirmPassword) {
      confirmPasswordError.textContent = "";
  }
});
