// Load products 
  async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        
        return products;
      } catch (error) {
        console.error('Error loading products:', error);
        return [];
      }
    }
    // Get a single product by ID
async function getProductById(productId) {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
      const product = await response.json();
      return product;
    } catch (error) {
      console.error('Error fetching product details:', error);
      return null;
    }
  }
  
  // Display product details on the product detail page
  async function displayProductDetails() {
    const productDetailContainer = document.getElementById('product-detail');
    if (!productDetailContainer) return;
    
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || window.location.pathname.split('/').pop();
    
    if (!productId) {
      productDetailContainer.innerHTML = '<p>Product not found.</p>';
      return;
    }
    
    const product = await getProductById(productId);
    
    if (!product) {
      productDetailContainer.innerHTML = '<p>Product not found.</p>';
      return;
    }
    
    // Display product details
    productDetailContainer.innerHTML = `
      <div class="product-detail-container">
        <div class="product-detail-image">
          <img src="${product.imageUrl}" alt="${product.name}">
        </div>
        <div class="product-detail-info">
          <h1 class="product-detail-title">${product.name}</h1>
          <p class="product-detail-price">${product.price.toFixed(2)}</p>
          
          <div class="product-description">
            <h3>Product Description</h3>
            <p>${product.description || 'No description available.'}</p>
          </div>
          
          ${product.specifications ? `
            <div class="product-specifications">
              <h3>Specifications</h3>
              <ul>
                ${Object.entries(product.specifications).map(([key, value]) => `
                  <li><strong>${key}:</strong> ${value}</li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
          
          <div class="product-quantity">
            <label for="quantity">Quantity:</label>
            <div class="quantity-selector">
              <button id="decrease-quantity">-</button>
              <input type="number" id="quantity" value="1" min="1">
              <button id="increase-quantity">+</button>
            </div>
          </div>
          
          <div class="product-actions">
            <button id="add-to-cart-btn" class="btn btn-primary btn-lg">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      
      ${product.relatedProducts && product.relatedProducts.length ? `
        <div class="related-products">
          <h2>Related Products</h2>
          <div class="related-products-grid">
            ${product.relatedProducts.map(related => `
              <div class="product-card">
                <div class="product-image">
                  <img src="${related.imageUrl}" alt="${related.name}">
                </div>
                <div class="product-info">
                  <h3 class="product-title">${related.name}</h3>
                  <p class="product-price">${related.price.toFixed(2)}</p>
                  <div class="product-action">
                    <a href="/product/${related._id}" class="btn btn-secondary">View</a>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;
    
    // Set up event listeners for the product detail page
    setupProductDetailEventListeners(product);
  }
  
  // Set up event listeners specific to the product detail page
  function setupProductDetailEventListeners(product) {
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decrease-quantity');
    const increaseBtn = document.getElementById('increase-quantity');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    
    if (decreaseBtn) {
      decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value) || 1;
        if (currentValue > 1) {
          quantityInput.value = currentValue - 1;
        }
      });
    }
    
    if (increaseBtn) {
      increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value) || 1;
        quantityInput.value = currentValue + 1;
      });
    }
    
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value) || 1;
        // Add multiple items to cart based on quantity
        for (let i = 0; i < quantity; i++) {
          addToCart(product._id, product.name, product.price, product.imageUrl);
        }
      });
    }
  }
    // Display products on the products page
    async function displayProducts() {
      const productList = document.getElementById('productlist');
      
      if (!productList) return;
      
      const products = await loadProducts();
      
      if (products.length === 0) {
        productList.innerHTML = '<p>No products found.</p>';
        return;
      }
      
      productList.innerHTML = products.map(product => `
        <div class="product-card">
          <div class="product-image">
            <img src="${product.imageUrl}" alt="${product.name}">
          </div>
          <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <div class="product-action">
              <a href="/product/${product._id}" class="btn btn-secondary">View</a>
              <button class="btn btn-primary" onclick="addToCart('${product._id}', '${product.name}', ${product.price}, '${product.imageUrl}')">Add to Cart</button>
            </div>
          </div>
        </div>
      `).join('');
    }
    
    // Display featured products on the home page
    async function displayFeaturedProducts() {
      const featuredProducts = document.getElementById('featured-products');
      
      if (!featuredProducts) return;
      
      const products = await loadProducts();
      
      // Display up to 4 products as featured
      const featured = products.slice(0, 4);
      
      if (featured.length === 0) {
        featuredProducts.innerHTML = '<p>No featured products found.</p>';
        return;
      }
      
      featuredProducts.innerHTML = featured.map(product => `
        <div class="product-card">
          <div class="product-image">
            <img src="${product.imageUrl}" alt="${product.name}">
          </div>
          <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-price">${product.price.toFixed(2)}</p>
            <div class="product-action">
              <a href="/product/${product._id}" class="btn btn-secondary">View</a>
              <button class="btn btn-primary" onclick="addToCart('${product._id}', '${product.name}', ${product.price}, '${product.imageUrl}')">Add to Cart</button>
            </div>
          </div>
        </div>
      `).join('');
    }

    
    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Add product to cart
    function addToCart(id, name, price, imageUrl) {
      const existingItem = cart.find(item => item.id === id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id,
          name,
          price,
          imageUrl,
          quantity: 1
        });
      }
      
      updateCart();
      showCartNotification();
    }
    
    // Update cart in localStorage and UI
    function updateCart() {
      localStorage.setItem('cart', JSON.stringify(cart));
      
      const cartCount = document.getElementById('cart-count');
      if (cartCount) {
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = itemCount;
        cartCount.style.display = itemCount > 0 ? 'block' : 'none';
      }
      
      // Update cart page if we're on it
      displayCartItems();
    }
    
    // Show notification when item added to cart
    function showCartNotification() {
      const notification = document.getElementById('cart-notification');
      if (!notification) return;
      
      notification.classList.add('show');
      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    }
    
    // Display cart items on cart page
    function displayCartItems() {
      const cartItemsContainer = document.getElementById('cart-container');
      if (!cartItemsContainer) return;
      
      if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        document.getElementById('checkout-button').style.display = 'none';
        document.getElementById('cart-total').textContent = '$0.00';
        return;
      }
      
      cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-image">
            <img src="${item.imageUrl}" alt="${item.name}">
          </div>
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <p>$${item.price.toFixed(2)}</p>
            <div class="quantity-controls">
              <button onclick="updateItemQuantity('${item.id}', ${item.quantity - 1})">-</button>
              <span>${item.quantity}</span>
              <button onclick="updateItemQuantity('${item.id}', ${item.quantity + 1})">+</button>
            </div>
          </div>
          <button class="remove-item" onclick="removeFromCart('${item.id}')">×</button>
        </div>
      `).join('');
      
      // Update total
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      document.getElementById('cart-summary').textContent = `$${total.toFixed(2)}`;
      document.getElementById('checkout-button').style.display = 'block';
    }
    
    // Update item quantity in cart
    function updateItemQuantity(id, quantity) {
      if (quantity <= 0) {
        removeFromCart(id);
        return;
      }
      
      const item = cart.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
        updateCart();
      }
    }
    
    // Remove item from cart
    function removeFromCart(id) {
      cart = cart.filter(item => item.id !== id);
      updateCart();
    }
    
    // Checkout functionality
    function checkout() {
      // You might want to redirect to a checkout page or show a modal
      window.location.href = '/checkout';
    }
    
    // Product search functionality
    function searchProducts() {
      const searchInput = document.getElementById('search-input');
      if (!searchInput) return;
      
      const query = searchInput.value.trim().toLowerCase();
      if (query === '') return;
      
      window.location.href = `/products?search=${encodeURIComponent(query)}`;
    }
    
    // Initialize the page
    document.addEventListener('DOMContentLoaded', function() {
      // Update cart count on page load
      updateCart();
      
      // Display products if on products page
      displayProducts();
      
      // Display featured products if on home page
      displayFeaturedProducts();

      // Display product details if on product detail page
      displayProductDetails();
      
      // Set up search form
      const searchForm = document.getElementById('search-form');
      if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
          e.preventDefault();
          searchProducts();
        });
      }
    });