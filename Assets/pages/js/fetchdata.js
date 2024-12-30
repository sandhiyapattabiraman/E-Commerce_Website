import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

// Initialize Firebase only if not already initialized
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  console.log("Firebase App Initialized");
} else {
  app = getApps()[0]; // Use the already initialized app
  console.log("Firebase App Already Initialized");
}

const db = getFirestore(app);

// JSON data for cleaning products
const cleaningProductsData = {
  products: [
    {
      image: "../../../Assets/Images/my-wish-list.png",
      image1: "../../../Assets/Images/web2_img.jpg",
      image2: "../../../Assets/Images/star_rating_img.webp",
      price: "100"
    },
    {
      image: "../../../Assets/Images/my-wish-list.png",
      image1: "../../../Assets/Images/web2_img.jpg",
      image2: "../../../Assets/Images/star_rating_img.webp",
      price: "200"
    },
    {
      image: "../../../Assets/Images/my-wish-list.png",
      image1: "../../../Assets/Images/web2_img.jpg",
      image2: "../../../Assets/Images/star_rating_img.webp",
      price: "150"
    }
  ]
};

// JSON data for carriers
const carriersData = {
  products: [
    { image1: "../../../Assets/Images/web2_img.jpg", price: "80" },
    { image1: "../../../Assets/Images/web2_img.jpg", price: "120" }
  ]
};

const medicineData = {
    products: [
    {
      "image": "../../../Assets/Images/my-wish-list.png",
      "image1": "../../../Assets/Images/frontline_med_img.jpg",
      "name": "Frontline Plus",
      "use": "Flea and tick prevention for dogs and cats",
      "image2": "../../../Assets/Images/star_rating_img.webp",
      "price": "100"
    },
    {
      "image": "../../../Assets/Images/my-wish-list.png",
      "image1": "../../../Assets/Images/revolution_med_img.webp",
      "name": "Revolution",
      "use": "Broad-spectrum parasite prevention, including fleas, ticks, ear mites, and heartworms",
      "image2": "../../../Assets/Images/star_rating_img.webp",
      "price": "200"
    },
    {
      "image": "../../../Assets/Images/my-wish-list.png",
      "image1": "../../../Assets/Images/Advantage2_med_img.webp",
      "name": "Advantage II",
      "use": "Flea control for dogs and cats, treats and prevents lice",
      "image2": "../../../Assets/Images/star_rating_img.webp",
      "price": "150"
    },
    {
      "image": "../../../Assets/Images/my-wish-list.png",
      "image1": "../../../Assets/Images/baytril_med_img.png",
      "name": "Baytril (Enrofloxacin)",
      "use": "Treats bacterial infections in dogs and cats.",
      "image2": "../../../Assets/Images/star_rating_img.webp",
      "price": "155"
    },
    {
      "image": "../../../Assets/Images/my-wish-list.png",
      "image1": "../../../Assets/Images/trazodone_med_img.jpg",
      "name": "Trazodone",
      "use": "Manages anxiety and stress-related behaviors in pets.",
      "image2": "../../../Assets/Images/star_rating_img.webp",
      "price": "250"
    },
    {
      "image": "../../../Assets/Images/my-wish-list.png",
      "image1": "../../../Assets/Images/heartgard_med_img.avif",
      "name": "Heartgard Plus",
      "use": "Heartworm prevention and treats roundworms and hookworms in dogs",
      "image2": "../../../Assets/Images/star_rating_img.webp",
      "price": "249"
    }
    ]
  };

const foodData = {
    products: [
      {
        "image": "../../../Assets/Images/my-wish-list.png",
        "image1": "../../../Assets/Images/web2_img.jpg",
        "image2": "../../../Assets/Images/star_rating_img.webp",
        "price": "100"
      },
      {
        "image": "../../../Assets/Images/my-wish-list.png",
        "image1": "../../../Assets/Images/web2_img.jpg",
        "image2": "../../../Assets/Images/star_rating_img.webp",
        "price": "200"
      },
      {
        "image": "../../../Assets/Images/my-wish-list.png",
        "image1": "../../../Assets/Images/web2_img.jpg",
        "image2": "../../../Assets/Images/star_rating_img.webp",
        "price": "150"
      },
      {
        "image": "../../../Assets/Images/my-wish-list.png",
        "image1": "../../../Assets/Images/web2_img.jpg",
        "image2": "../../../Assets/Images/star_rating_img.webp",
        "price": "155"
      },
      {
        "image": "../../../Assets/Images/my-wish-list.png",
        "image1": "../../../Assets/Images/web2_img.jpg",
        "image2": "../../../Assets/Images/star_rating_img.webp",
        "price": "250"
      },
      {
        "image": "../../../Assets/Images/my-wish-list.png",
        "image1": "../../../Assets/Images/web2_img.jpg",
        "image2": "../../../Assets/Images/star_rating_img.webp",
        "price": "249"
      },
      {
        "image": "../../../Assets/Images/my-wish-list.png",
        "image1": "../../../Assets/Images/web2_img.jpg",
        "image2": "../../../Assets/Images/star_rating_img.webp",
        "price": "300"
      },
      {
        "image": "../../../Assets/Images/my-wish-list.png",
        "image1": "../../../Assets/Images/web2_img.jpg",
        "image2": "../../../Assets/Images/star_rating_img.webp",
        "price": "270"
      }
    ]
  };


const houseData = {
    products: [
      {
        "image": "../../../Assets/Images/my-wish-list.png",
        "image1": "../../../Assets/Images/web2_img.jpg",
        "image2": "../../../Assets/Images/star_rating_img.webp",
        "price": "100"
      },
      {
        "image": "../../../Assets/Images/my-wish-list.png",
        "image1": "../../../Assets/Images/web2_img.jpg",
        "image2": "../../../Assets/Images/star_rating_img.webp",
        "price": "200"
      },
      {
        "image": "../../../Assets/Images/my-wish-list.png",
        "image1": "../../../Assets/Images/web2_img.jpg",
        "image2": "../../../Assets/Images/star_rating_img.webp",
        "price": "150"
      },
      {
        "image": "../../../Assets/Images/my-wish-list.png",
        "image1": "../../../Assets/Images/web2_img.jpg",
        "image2": "../../../Assets/Images/star_rating_img.webp",
        "price": "155"
      },
      {
        "image": "../../../Assets/Images/my-wish-list.png",
        "image1": "../../../Assets/Images/web2_img.jpg",
        "image2": "../../../Assets/Images/star_rating_img.webp",
        "price": "250"
      },
      {
        "image": "../../../Assets/Images/my-wish-list.png",
        "image1": "../../../Assets/Images/web2_img.jpg",
        "image2": "../../../Assets/Images/star_rating_img.webp",
        "price": "249"
      },
      {
        "image": "../../../Assets/Images/my-wish-list.png",
        "image1": "../../../Assets/Images/web2_img.jpg",
        "image2": "../../../Assets/Images/star_rating_img.webp",
        "price": "300"
      },
      {
        "image": "../../../Assets/Images/my-wish-list.png",
        "image1": "../../../Assets/Images/web2_img.jpg",
        "image2": "../../../Assets/Images/star_rating_img.webp",
        "price": "270"
      }
    ]
  };

// JSON data for toys
const toysData = {
    products : [
        {
          "image": "../../../Assets/Images/my-wish-list.png",
          "image1": "../../../Assets/Images/web2_img.jpg",
          "image2": "../../../Assets/Images/star_rating_img.webp",
          "price": "100"
        },
        {
          "image": "../../../Assets/Images/my-wish-list.png",
          "image1": "../../../Assets/Images/web2_img.jpg",
          "image2": "../../../Assets/Images/star_rating_img.webp",
          "price": "200"
        },
        {
          "image": "../../../Assets/Images/my-wish-list.png",
          "image1": "../../../Assets/Images/web2_img.jpg",
          "image2": "../../../Assets/Images/star_rating_img.webp",
          "price": "150"
        },
        {
          "image": "../../../Assets/Images/my-wish-list.png",
          "image1": "../../../Assets/Images/web2_img.jpg",
          "image2": "../../../Assets/Images/star_rating_img.webp",
          "price": "155"
        },
        {
          "image": "../../../Assets/Images/my-wish-list.png",
          "image1": "../../../Assets/Images/web2_img.jpg",
          "image2": "../../../Assets/Images/star_rating_img.webp",
          "price": "250"
        },
        {
          "image": "../../../Assets/Images/my-wish-list.png",
          "image1": "../../../Assets/Images/web2_img.jpg",
          "image2": "../../../Assets/Images/star_rating_img.webp",
          "price": "249"
        },
        {
          "image": "../../../Assets/Images/my-wish-list.png",
          "image1": "../../../Assets/Images/web2_img.jpg",
          "image2": "../../../Assets/Images/star_rating_img.webp",
          "price": "300"
        },
        {
          "image": "../../../Assets/Images/my-wish-list.png",
          "image1": "../../../Assets/Images/web2_img.jpg",
          "image2": "../../../Assets/Images/star_rating_img.webp",
          "price": "270"
        }
      ]
};

// Function to upload the JSON data to Firestore
async function uploadProductsToFirestore() {
  try {
    // Upload cleaning products data
    const cleaningRef = doc(db, "products", "cleanings");
    console.log("Uploading Cleaning Products to Firestore Document:", cleaningRef.path);
    await setDoc(cleaningRef, cleaningProductsData);
    console.log("Cleaning products data uploaded successfully!");

    // Upload carrier products data
    const carriersRef = doc(db, "products", "carriers");
    console.log("Uploading Carrier Products to Firestore Document:", carriersRef.path);
    await setDoc(carriersRef, carriersData);
    console.log("Carrier products data uploaded successfully!");

    // Upload medicine products data
    const medicinesRef = doc(db, "products", "medicine");
    console.log("Uploading Carrier Products to Firestore Document:", medicinesRef.path);
    await setDoc(medicinesRef, medicineData);
    console.log("medicine products data uploaded successfully!");

    // Upload food and treats products data
    const foodRef = doc(db, "products", "food");
    console.log("Uploading food Products to Firestore Document:", foodRef.path);
    await setDoc(foodRef, foodData);
    console.log("food products data uploaded successfully!");

    // Upload house products data
    const houseRef = doc(db, "products", "house");
    console.log("Uploading house Products to Firestore Document:", houseRef.path);
    await setDoc(houseRef, houseData);
    console.log("house products data uploaded successfully!");

    // Upload toys data
    const toysRef = doc(db, "products", "toys");
    console.log("Uploading Toys Products to Firestore Document:", toysRef.path);
    await setDoc(toysRef, toysData);
    console.log("Toys products data uploaded successfully!");
  } catch (error) {
    console.error("Error uploading products data:", error.message);
  }
}

// Call the function to upload all the product data
uploadProductsToFirestore();
