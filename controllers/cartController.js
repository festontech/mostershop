const Product = require('../models/Product');

exports.getCart = (req, res) => {
    const cart = req.session.cart || [];
    // console.log(cart);
    res.render('shop/cart', { title: 'Your Cart', cart });
};

exports.addToCart = async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) return res.status(404).send('Product not found');

    // Get quantity from form (make sure to use name="quantity" in the input)
    let quantity = parseInt(req.body.quantity, 10);
    if (isNaN(quantity) || quantity < 1) quantity = 1; // Fallback to 1

    // Ensure cart structure
    if (!req.session.cart || !Array.isArray(req.session.cart.items)) {
        req.session.cart = {
            items: [],
            total: 0
        };
    }

    const cart = req.session.cart;
    const existingItem = cart.items.find(item => item.productId === product.id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.images?.[0] || '/images/product-placeholder.jpg'
        });
    }

    cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.redirect('/cart');
};


exports.updateCartItem = (req, res) => {
    let cart = req.session.cart || { items: [], total: 0 };

    const itemId = req.body.itemId;
    const quantity = parseInt(req.body.quantity, 10);

    const index = cart.items.findIndex(item => item.productId === itemId);

    if (index > -1) {
        if (quantity > 0) {
            cart.items[index].quantity = quantity;
        } else {
            cart.items.splice(index, 1); // Remove if 0 or less
        }
    }

    cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    req.session.cart = cart;
    res.redirect('/cart');
};


exports.removeFromCart = (req, res) => {
    const itemId = req.params.id;
    let cart = req.session.cart || { items: [], total: 0 };
    console.log('Removing item from cart:', itemId);
    cart.items = cart.items.filter(item => item.productId !== itemId);
    cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    req.session.cart = cart;
    res.redirect('/cart');
};

exports.getCartCount = (req, res) => {
    const cart = req.session.cart;
    const itemCount = Array.isArray(cart?.items)
        ? cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
        : 0;

    res.json({ count: itemCount });
};

