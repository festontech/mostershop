// main.js

document.addEventListener('DOMContentLoaded', () => {
    setupAddToCartButtons();
    setupQuickView();
    setupMobileNav();
    updateCartCount();
    // Add more features as needed
});

function setupAddToCartButtons() {
    const buttons = document.querySelectorAll('.add-to-cart');

    buttons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();

            const productId = button.dataset.id;
    
            try {
                const res = await fetch(`/cart/add/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                updateCartCount();

                if (res.ok) {
                    console.log('Product added to cart!');

                    // Optionally update cart badge here
                } else {
                    alert('❌ Failed to add to cart');
                }
            } catch (error) {
                console.error('Error adding to cart:', error);
                alert('❌ Error occurred');
            }
        });
    });
}

function setupQuickView() {
    const quickViewButtons = document.querySelectorAll('[data-product-id]');

    quickViewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const id = button.dataset.productId;
            // Replace with modal logic or redirect
            alert(`🔍 Quick view for product ID: ${id}`);
        });
    });
}

function setupMobileNav() {
    const toggle = document.querySelector('.mobile-nav-toggle');
    const nav = document.querySelector('.mobile-nav');

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('open');
        });
    }
}
function updateCartCount() {
  fetch('/cart/count')
    .then(res => res.json())
    .then(data => {
      const badge = document.querySelector('.cart-count');
      if (badge) {
        badge.textContent = data.count;
      }
    })
    .catch(err => console.error('Failed to fetch cart count:', err));
}
