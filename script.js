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




fetch('./products.json')
  .then(response => response.json())
  .then(jsonData => {
    const productList = document.getElementById("items");

    jsonData.products.forEach(product => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");
      productDiv.innerHTML = `
        <img src="${product.image}" alt="wishlist_img" class="wishlist-img">
        <img src="${product.image1}" alt="stand_mixer_img" class="product-image">
        <img src="${product.image2}" alt="rating" class="star_rating">
        <p>Price: ${product.price}</p>
        <button type="button" class="Button">Add to Cart</button>
        <button type="button" class="Buttons">Buy Now</button>
      `;
      productList.appendChild(productDiv);
    });
  });



fetch('./categories.json')
.then(response => response.json())
.then(data => {
  const categoriesContainer = document.getElementById("categories");
  data.categories.forEach(category => {
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("allproducts");
    categoryDiv.innerHTML = `
      <a href="${category.link}">
      <img src="${category.image}" alt="${category.name}" class="product_img">
      <p>${category.name}</p>
      </a>
    `;
    categoriesContainer.appendChild(categoryDiv);
  });
})
.catch(error => console.error("Error fetching categories:", error));

