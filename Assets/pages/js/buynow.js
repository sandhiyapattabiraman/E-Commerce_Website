import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, collection, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    loadBuyNowProduct(user.email);
  } else {
    window.location.href = "../../../Assets/pages/html/login.html";
  }
});

function loadBuyNowProduct(email) {
  const buyNowProduct = JSON.parse(localStorage.getItem("buyNowProduct"));

  if (!buyNowProduct) {
    console.error("No product found for 'Buy Now'.");
    return;
  }

  const productsList = document.getElementById("products-list");
  productsList.innerHTML = `
    <div class="product-item">
      <img src="${buyNowProduct.img}" alt="${buyNowProduct.name}" style="width: 50px; height: 50px;">
      <p><strong>${buyNowProduct.name}</strong></p>
      <p>Price: ₹<span id="total-price">${buyNowProduct.price}</span></p>
      <label for="quantity">Quantity:</label>
      <select id="quantity" onchange="updateTotalPrice(${buyNowProduct.price})">
        ${Array.from({length: 10}, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
      </select>
    </div>
  `;

  document.getElementById("quantity").addEventListener("change", () => {
    updateTotalPrice(buyNowProduct.price);
  });

  setupBillingForm(email, buyNowProduct);
}

function updateTotalPrice(price) {
  const quantity = document.getElementById("quantity").value;
  const totalPrice = price * quantity;
  document.getElementById("total-price").textContent = totalPrice.toFixed(2);
}

function setupBillingForm(userId, product) {
  const paymentForm = document.getElementById("payment-form");

  paymentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const quantity = parseInt(document.getElementById("quantity").value);
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    const pincode = document.getElementById("pincode").value;
    const phone = document.getElementById("phone").value;
    const paymentMethod = document.getElementById("payment-method").value;

    

    const orderDetails = {
      items: [{ ...product, quantity }],
      total: product.price * quantity,
      date: new Date().toISOString(),
      billingInfo: {
        firstName,
        lastName,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
        pincode: document.getElementById("pincode").value,
        phone: document.getElementById("phone").value,
        email,
      },
      paymentInfo: { method: paymentMethod},
    };

    if (paymentMethod === 'credit-card' || paymentMethod === 'debit-card') {
        orderDetails.paymentInfo.cardNumber = document.getElementById("card-number").value;
        orderDetails.paymentInfo.expiryDate = document.getElementById("expiry-date").value;
        orderDetails.paymentInfo.cvv = document.getElementById("cvv").value;
      }

    try {
      const orderRef = doc(collection(db, "users", userId, "orders"));
      await setDoc(orderRef, orderDetails);

      localStorage.removeItem("buyNowProduct");
      localStorage.setItem("latestOrder", JSON.stringify(orderDetails));
      showMessage("Order placed successfully!", "success");

      setTimeout(() => {
        window.location.href = "../../../index.html";
      }, 2000);
    } catch (error) {
      console.error("Error placing order:", error);
      showMessage("Failed to place the order. Please try again later.", "error");
    }
  });

  document.getElementById('payment-method').addEventListener('change', function () {
    const cardDetails = document.getElementById('card-details');
    const cardNumber = document.getElementById("card-number");
    const expiryDate = document.getElementById("expiry-date");
    const cvv = document.getElementById("cvv");

    if (this.value === 'credit-card' || this.value === 'debit-card') {
      cardDetails.style.display = 'block';
      cardNumber.setAttribute('required', 'true');
      expiryDate.setAttribute('required', 'true');
      cvv.setAttribute('required', 'true');
    } else {
      cardDetails.style.display = 'none';
      cardNumber.removeAttribute('required');
      expiryDate.removeAttribute('required');
      cvv.removeAttribute('required');
    }
  });

  document.getElementById('card-details').style.display = 'none';
}

function showMessage(message, type) {
  const messageContainer = document.getElementById("message-container");
  if (messageContainer) {
    messageContainer.textContent = message;
    messageContainer.className = type === "error" ? "message error" : "message success";
    messageContainer.style.display = "block";

    setTimeout(() => {
      messageContainer.style.display = "none";
    }, 3000);
  }
}
