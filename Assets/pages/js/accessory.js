fetch('../../../Assets/pages/json/accessory.json')
  .then(response => response.json())
  .then(jsonData => {
    const productList = document.getElementById("items");

    jsonData.products.forEach(product => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");
      productDiv.innerHTML = `
        <img src="${product.image}" alt="wishlist_img" class="wishlist-img">
        <img src="${product.image1}" alt="Accessory image" class="product-image">
        <p> ${product.name}</p>
        <img src="${product.image2}" alt="rating" class="star_rating">
        <p>Price: ${product.price}</p>
        <button type="button" class="Button">Add to Cart</button>
        <button type="button" class="Buttons">Buy Now</button>
      `;
      productList.appendChild(productDiv);
    });
  });
