let currentIndex = 0;

function showSlide(index) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');

  if (index >= slides.length) currentIndex = 0;
  if (index < 0) currentIndex = slides.length - 1;

  slides.forEach(slide => (slide.style.display = 'none'));
  dots.forEach(dot => dot.classList.remove('active'));

  slides[currentIndex].style.display = 'block';
  dots[currentIndex].classList.add('active');
}

function nextSlide() {
  currentIndex++;
  showSlide(currentIndex);
}

function prevSlide() {
  currentIndex--;
  showSlide(currentIndex);
}

function createDots() {
  const dotsContainer = document.querySelector('.dots');
  const slides = document.querySelectorAll('.slide');

  slides.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.addEventListener('click', () => {
      currentIndex = index;
      showSlide(currentIndex);
    });
    dotsContainer.appendChild(dot);
  });
}

document.querySelector('.prev').addEventListener('click', prevSlide);
document.querySelector('.next').addEventListener('click', nextSlide);

// Initialize slideshow
createDots();
showSlide(currentIndex);
setInterval(nextSlide, 5000);




// medicines

  const medproduct={
    "products":[
      {
        "image":"./Assets/Images/fleas_img.jpg",
        "symptom":"Fleas"
      },
      {
        "image":"./Assets/Images/itch_img.jpg",
        "symptom":"Itching"
      },
      {
        "image":"./Assets/Images/web2_img.jpg",
        "symptom":"Fever"
      }
    ],
    "seemore":[
      {
        "see_more":"See More"
      }
    ]
  };

  const products=document.getElementById("medproduct");

  medproduct.products.forEach(product=>{
    const productdiv=document.createElement("div");
    productdiv.classList.add("allproducts");
    productdiv.innerHTML=`
    <img src="${product.image}" alt="product image" class="product_img">
    <p>${product.symptom}</p>
    `;
    products.appendChild(productdiv);
  });
 
  medproduct.seemore.forEach(seeMore => {
    const seeMoreDiv = document.createElement("div");
    seeMoreDiv.classList.add("see-more");
    seeMoreDiv.innerHTML = `
      <p>${seeMore.see_more}</p>
    `;
    products.appendChild(seeMoreDiv);
  });

// food products
  
  const foodpro = {
    "foodproduct": [
      {
        "image": "./Assets/Images/web2_img.jpg",
        "name": "Dog Food"
      },
      {
        "image": "./Assets/Images/web2_img.jpg",
        "name": "Cat Food"
      },
      {
        "image": "./Assets/Images/web2_img.jpg",
        "name": "Bird food"
      }
    ],
    "seemore": [
      {
        "see_more": "See More"
      }
    ]
  };
  
  const foodproduct = document.getElementById("foodproduct");

foodpro.foodproduct.forEach(product => {
  const productDiv = document.createElement("div");
  productDiv.classList.add("allproducts");
  productDiv.innerHTML = `
    <img src="${product.image}" alt="product image" class="product_img">
    <p>${product.name}</p>
  `;
  foodproduct.appendChild(productDiv);
});

// Render "See More" section
foodpro.seemore.forEach(seeMore => {
  const seeMoreDiv = document.createElement("div");
  seeMoreDiv.classList.add("see-more");
  seeMoreDiv.innerHTML = `
    <p>${seeMore.see_more}</p>
  `;
  foodproduct.appendChild(seeMoreDiv);
});


// Accessories products

const access_pro = {
  "accessories_pro": [
    {
      "image": "./Assets/Images/web2_img.jpg",
      "name": "Rubber Balls and Toys"
    },
    {
      "image": "./Assets/Images/web2_img.jpg",
      "name": "Bird cage"
    },
    {
      "image": "./Assets/Images/web2_img.jpg",
      "name": "Pet Grooming Brushes"
    }
  ],
  "seemore": [
    {
      "see_more": "See More"
    }
  ]
};

const accesspro = document.getElementById("Accessoriesproduct");

access_pro.accessories_pro.forEach(product => {
const productDiv = document.createElement("div");
productDiv.classList.add("allproducts");
productDiv.innerHTML = `
  <img src="${product.image}" alt="product image" class="product_img">
  <p>${product.name}</p>
`;
accesspro.appendChild(productDiv);
});

// Render "See More" section
access_pro.seemore.forEach(seeMore => {
const seeMoreDiv = document.createElement("div");
seeMoreDiv.classList.add("see-more");
seeMoreDiv.innerHTML = `
  <p>${seeMore.see_more}</p>
`;
accesspro.appendChild(seeMoreDiv);
});


// products

const jsonData = {
  "products": [
      {
        "image": "./Assets/Images/my-wish-list.png",
        "image1": "./Assets/Images/web2_img.jpg",
        "image2": "./Assets/Images/star_rating_img.webp",
        "price": "$100"
      },
      {
          "image": "./Assets/Images/my-wish-list.png",
          "image1": "./Assets/Images/web2_img.jpg",
          "image2": "./Assets/Images/star_rating_img.webp",
          "price": "$200"
      },
      {
          "image": "./Assets/Images/my-wish-list.png",
          "image1": "./Assets/Images/web2_img.jpg",
          "image2": "./Assets/Images/star_rating_img.webp",
          "price": "$150"
      },
      {
          "image": "./Assets/Images/my-wish-list.png",
          "image1": "./Assets/Images/web2_img.jpg",
          "image2": "./Assets/Images/star_rating_img.webp",
          "price": "$155"
      },
      {
          "image": "./Assets/Images/my-wish-list.png",
          "image1": "./Assets/Images/web2_img.jpg",
          "image2": "./Assets/Images/star_rating_img.webp",
          "price": "$250"
      },
      {
          "image": "./Assets/Images/my-wish-list.png",
          "image1": "./Assets/Images/web2_img.jpg",
          "image2": "./Assets/Images/star_rating_img.webp",
          "price": "$249"
      },
      {
          "image": "./Assets/Images/my-wish-list.png",
          "image1": "./Assets/Images/web2_img.jpg",
          "image2": "./Assets/Images/star_rating_img.webp",
          "price": "$300"
      },
      {
          "image": "./Assets/Images/my-wish-list.png",
          "image1": "./Assets/Images/web2_img.jpg",
          "image2": "./Assets/Images/star_rating_img.webp",
          "price": "$270"
      }
  ]
};

const productList = document.getElementById("items");
  // Loop through the products and generate product cards
  jsonData.products.forEach(product => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");
      productDiv.innerHTML = `
          <!-- Wishlist Icon -->
          <img src="${product.image}" alt="wishlist_img" class="wishlist-img">
          <!-- Product Image -->
          <img src="${product.image1}" alt="stand_mixer_img" class="product-image">
          <!-- Star Rating -->
          <img src="${product.image2}" alt="rating" class="star_rating">
          <!-- Product Price -->
          <p>Price: ${product.price}</p>
          <!-- Buttons -->
          <button type="button" class="Button">Add to Cart</button>
          <button type="button" class="Buttons">Buy Now</button>
      `;
      productList.appendChild(productDiv);
  });