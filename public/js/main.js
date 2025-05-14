document.addEventListener('DOMContentLoaded', function() {
  // Mobile Navigation Toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      this.innerHTML = navMenu.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    if (navMenu && navMenu.classList.contains('active') && 
        !event.target.closest('.nav-menu') && 
        !event.target.closest('.hamburger')) {
      navMenu.classList.remove('active');
      if (hamburger) {
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
      }
    }
  });
  
  // Close Alert Messages
  const closeButtons = document.querySelectorAll('.close-btn');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      this.parentElement.style.display = 'none';
    });
  });
  
  // Dropdown Functionality
  const dropdowns = document.querySelectorAll('.dropdown');
  
  dropdowns.forEach(dropdown => {
    const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
    
    if (dropdownToggle && dropdownMenu) {
      dropdownToggle.addEventListener('click', function(e) {
        e.preventDefault();
        dropdownMenu.classList.toggle('show');
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
          dropdownMenu.classList.remove('show');
        }
      });
    }
  });
  
  // Product Quantity Input Controls
  const quantityInputs = document.querySelectorAll('.quantity-input');
  
  quantityInputs.forEach(input => {
    const decrementBtn = input.querySelector('.quantity-decrement');
    const incrementBtn = input.querySelector('.quantity-increment');
    const quantityField = input.querySelector('input');
    
    if (decrementBtn && incrementBtn && quantityField) {
      decrementBtn.addEventListener('click', function() {
        let value = parseInt(quantityField.value);
        if (value > 1) {
          quantityField.value = value - 1;
          triggerChange(quantityField);
        }
      });
      
      incrementBtn.addEventListener('click', function() {
        let value = parseInt(quantityField.value);
        let max = parseInt(quantityField.getAttribute('max') || 99);
        if (value < max) {
          quantityField.value = value + 1;
          triggerChange(quantityField);
        }
      });
      
      quantityField.addEventListener('change', function() {
        let value = parseInt(this.value);
        let min = parseInt(this.getAttribute('min') || 1);
        let max = parseInt(this.getAttribute('max') || 99);
        
        if (isNaN(value) || value < min) {
          this.value = min;
        } else if (value > max) {
          this.value = max;
        }
      });
    }
  });
  
  function triggerChange(element) {
    const event = new Event('change', { bubbles: true });
    element.dispatchEvent(event);
  }
  
  // Product Image Gallery
  const productThumbs = document.querySelectorAll('.product-thumb');
  const productMainImage = document.querySelector('.product-main-image');
  
  if (productThumbs.length > 0 && productMainImage) {
    productThumbs.forEach(thumb => {
      thumb.addEventListener('click', function() {
        const imgSrc = this.getAttribute('data-image');
        productMainImage.src = imgSrc;
        
        // Remove active class from all thumbs
        productThumbs.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked thumb
        this.classList.add('active');
      });
    });
  }
  
  // Sticky Header
  const header = document.querySelector('.header');
  let headerHeight;
  
  if (header) {
    headerHeight = header.offsetHeight;
    
    window.addEventListener('scroll', function() {
      if (window.scrollY > headerHeight) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }
    });
  }
  
  // Cart Functionality
  setupCartFunctionality();
  
  // Search Toggle
  const searchToggle = document.querySelector('.search-toggle');
  const searchForm = document.querySelector('.search-form');
  
  if (searchToggle && searchForm) {
    searchToggle.addEventListener('click', function(e) {
      e.preventDefault();
      searchForm.classList.toggle('active');
    });
    
    // Close search form when clicking outside
    document.addEventListener('click', function(e) {
      if (searchForm.classList.contains('active') && 
          !e.target.closest('.search-form') && 
          !e.target.closest('.search-toggle')) {
        searchForm.classList.remove('active');
      }
    });
  }
});

// Cart Functionality
function setupCartFunctionality() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const productId = this.getAttribute('data-id');
      const productName = this.getAttribute('data-name');
      const productPrice = this.getAttribute('data-price');
      const productImage = this.getAttribute('data-image');
      
      // Check if we have these attributes
      if (!productId || !productName || !productPrice) {
        console.error('Missing product information for cart');
        return;
      }
      
      // Add to cart logic (using session storage for simplicity)
      addToCart(productId, productName, productPrice, productImage);
      
      // Show notification
      showNotification(`${productName} added to cart!`);
      
      // Update cart count
      updateCartCount();
    });
  });
  
  // Initial cart count update
  updateCartCount();
}

function addToCart(id, name, price, image, quantity = 1) {
  // Get existing cart or initialize empty array
  let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
  
  // Check if product is already in cart
  const existingItemIndex = cart.findIndex(item => item.id === id);
  
  if (existingItemIndex > -1) {
    // Update quantity if item exists
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new item if not in cart
    cart.push({
      id,
      name,
      price,
      image: image || '',
      quantity
    });
  }
  
  // Save updated cart
  sessionStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
  const cartCountElements = document.querySelectorAll('.cart-count');
  const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
  
  // Calculate total items in cart
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Update all cart count elements
  cartCountElements.forEach(element => {
    element.textContent = itemCount;
    // Toggle visibility based on count
    element.style.display = itemCount > 0 ? 'flex' : 'none';
  });
}

function showNotification(message, type = 'success') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;
  
  // Add to document
  document.body.appendChild(notification);
  
  // Show notification with animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    
    // Remove from DOM after animation
    notification.addEventListener('transitionend', function() {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    });
  }, 3000);
  
  // Close button functionality
  const closeButton = notification.querySelector('.notification-close');
  if (closeButton) {
    closeButton.addEventListener('click', function() {
      notification.classList.remove('show');
    });
  }
}