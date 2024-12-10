// // Array of JSON file paths
// const jsonFiles = [
//     './Assets/pages/json/accessory.json',
//     './Assets/pages/json/carriers.json',
//     './Assets/pages/json/beds.json',
//     './Assets/pages/json/cleaning.json',
//     './Assets/pages/json/food_treats.json',
//     './Assets/pages/json/medicine.json',
//     './Assets/pages/json/pet_house.json',
//     './Assets/pages/json/toys.json'
// ];

// // Fetch products from multiple JSON files
// async function fetchProducts() {
//     const allProducts = [];

//     try {
//         // Fetch data from each JSON file and combine them
//         for (let file of jsonFiles) {
//             const response = await fetch(file);
//             const data = await response.json();
//             if (data.products) {
//                 allProducts.push(...data.products);  // Combine products from all JSON files
//             } else {
//                 console.warn(`No products found in ${file}`);
//             }
//         }

//         // Display all products initially
//         displayProducts(allProducts);

//         // Add the search event listener
//         const searchBar = document.getElementById("searchBar");
//         searchBar.addEventListener("input", function() {
//             searchProducts(allProducts);
//         });
//     } catch (error) {
//         console.error('Error loading products:', error);
//     }
// }

// // Function to display products
// function displayProducts(products) {
//     const itemsContainer = document.getElementById("items");
//     itemsContainer.innerHTML = ""; // Clear previous products

//     // Loop through products and create HTML elements for each
//     products.forEach(product => {
//         const productDiv = document.createElement("div");
//         productDiv.classList.add("product");

//         // Safeguard for missing image or price
//         const image = product.image || './default-image.jpg'; // fallback image
//         const name = product.name || 'Unnamed Product';
//         const price = product.price || 'N/A';
//         const image1 = product.image1 || './default-image.jpg'; // fallback image
//         const image2 = product.image2 || './default-image.jpg'; // fallback image

//         productDiv.innerHTML = `
//             <img src="${image}" alt="Product Image" class="wishlist-img">
//             <img src="${image1}" alt="Product Image" class="product-image">
//             <p class="product-name">${name}</p>
//             <img class="star_rating" src="${image2}" alt="Star Rating">
//             <p class="price">${price}</p>
//             <button class="Button">Add to Cart</button>
//             <button type="button" class="Buttons">Buy Now</button>
//         `;

//         itemsContainer.appendChild(productDiv);
//     });
// }

// // Function to filter products based on search input (name or price)
// function searchProducts(products) {
//     const searchQuery = document.getElementById("searchBar").value.toLowerCase();

//     // If search is empty, display all products
//     if (searchQuery === "") {
//         displayProducts(products);
//     } else {
//         // Filter products based on search query (case-insensitive)
//         const filteredProducts = products.filter(product => {
//             const nameMatch = product.name && product.name.toLowerCase().includes(searchQuery);
//             const priceMatch = product.price && product.price.toLowerCase().includes(searchQuery);
//             return nameMatch || priceMatch;  // Match by name OR price
//         });

//         // Display filtered products
//         displayProducts(filteredProducts);

//         // If no products are found, show a message
//         if (filteredProducts.length === 0) {
//             const itemsContainer = document.getElementById("items");
//             itemsContainer.innerHTML = '<p>No products found.</p>';
//         }
//     }
// }

// // Call fetchProducts when the page loads
// fetchProducts();



// Array of JSON file paths
const jsonFiles = [
    './Assets/pages/json/accessory.json',
    './Assets/pages/json/carriers.json',
    './Assets/pages/json/beds.json',
    './Assets/pages/json/cleaning.json',
    './Assets/pages/json/food_treats.json',
    './Assets/pages/json/medicine.json',
    './Assets/pages/json/pet_house.json',
    './Assets/pages/json/toys.json'
];

// Fetch products from multiple JSON files
async function fetchProducts() {
    const allProducts = [];

    try {
        // Fetch data from each JSON file and combine them
        for (let file of jsonFiles) {
            const response = await fetch(file);
            const data = await response.json();
            if (data.products) {
                allProducts.push(...data.products); // Combine products from all JSON files
            } else {
                console.warn(`No products found in ${file}`);
            }
        }

        // Add the search event listener after loading all products
        const searchBar = document.getElementById("searchBar");
        searchBar.addEventListener("input", function () {
            searchProducts(allProducts);
        });

        // Display an initial message or placeholder
        const itemsContainer = document.getElementById("items");
        itemsContainer.innerHTML = '<p>Start typing to search for products...</p>';
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Function to display products
function displayProducts(products) {
    const itemsContainer = document.getElementById("items");
    itemsContainer.innerHTML = ""; // Clear previous products

    // Loop through products and create HTML elements for each
    products.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");

        // Safeguard for missing image or price
        const image = product.image || './default-image.jpg'; // fallback image
        const name = product.name || 'Unnamed Product';
        const price = product.price || 'N/A';
        const image1 = product.image1 || './default-image.jpg'; // fallback image
        const image2 = product.image2 || './default-image.jpg'; // fallback image

        productDiv.innerHTML = `
            <img src="${image}" alt="Product Image" class="wishlist-img">
            <img src="${image1}" alt="Product Image" class="product-image">
            <p class="product-name">${name}</p>
            <img class="star_rating" src="${image2}" alt="Star Rating">
            <p class="price">${price}</p>
            <button class="Button">Add to Cart</button>
            <button type="button" class="Buttons">Buy Now</button>
        `;

        itemsContainer.appendChild(productDiv);
    });
}

// Function to filter products based on search input (name or price)
function searchProducts(products) {
    const searchQuery = document.getElementById("searchBar").value.toLowerCase().trim();

    // If search query is empty, show a placeholder message
    if (searchQuery === "") {
        const itemsContainer = document.getElementById("items");
        itemsContainer.innerHTML = '<p>Start typing to search for products...</p>';
        return;
    }

    // Filter products based on search query (case-insensitive)
    const filteredProducts = products.filter(product => {
        const nameMatch = product.name && product.name.toLowerCase().includes(searchQuery);
        const priceMatch = product.price && product.price.toLowerCase().includes(searchQuery);
        return nameMatch || priceMatch; // Match by name OR price
    });

    // Display filtered products
    displayProducts(filteredProducts);

    // If no products are found, show a message
    if (filteredProducts.length === 0) {
        const itemsContainer = document.getElementById("items");
        itemsContainer.innerHTML = '<p>No products found.</p>';
    }
}

// Call fetchProducts when the page loads
fetchProducts();
