const Product = require('../models/Product');

// GET /
exports.getAllFeaturedProducts = async (req, res, next) => {
    try {
        const featuredProducts = await Product.find({ featured: true }).lean();
        res.render('shop/index', {
            title: 'Featured Products',
            products: featuredProducts,
            pageJS: 'shop'
        });
    } catch (error) {
        next(error);
    }
};

// GET /shop
exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find().lean();
        // for (let i = 0; i < products.length; i++) {
        //     console.log( products[i].imageUrl[1]);
        // }
        res.render('shop/product', {
            title: 'All Products',
            products,
            pageJS: 'shop'
        });
    } catch (error) {
        next(error);
    }
};

// GET /shop/product/:id
exports.getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).lean();
        if (!product) {
            return res.status(404).render('error', {
                title: 'Product Not Found',
                error_msg: 'The requested product could not be found.'
            });
        }

        res.render('shop/product-details', {
            title: product.name,
            product,
            pageJS: 'detail'
        });
    } catch (error) {
        next(error);
    }
};

// GET /shop/category/:category
exports.getProductsByCategory = async (req, res, next) => {
    try {
        const products = await Product.find({ category: req.params.category }).lean();
        res.render('shop/index', {
            title: `Category: ${req.params.category}`,
            products,
            pageJS: 'shop'
        });
    } catch (error) {
        next(error);
    }
};

// GET /shop/search?query=...
exports.searchProducts = async (req, res, next) => {
    try {
        const query = req.query.query;
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        }).lean();

        res.render('shop/index', {
            title: `Search results for "${query}"`,
            products,
            pageJS: 'shop'
        });
    } catch (error) {
        next(error);
    }
};
// Display Cart Page
exports.getCart = (req, res) => {
    const cart = req.session.cart || [];
    console.log(cart);
    res.render('shop/cart', { title: 'Your Cart', cart });
};

// Add Product to Cart
exports.addToCart = async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId); // assumes Mongoose

    if (!product) return res.status(404).send('Product not found');

    // Initialize cart if it doesn't exist
    if (!req.session.cart) {
        req.session.cart = {
            items: [],
            total: 0
        };
    }

    const cart = req.session.cart;
    console.log(cart);
    // Check if product is already in cart
    const existingItem = cart.items.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            qty: 1,
            image: product.images?.[0] || '/images/product-placeholder.jpg'
        });
    }

    cart.total = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);
    res.redirect('/cart');
};


// Update Quantity of Cart Item
exports.updateCartItem = (req, res) => {
    const { quantity } = req.body;
    const cart = req.session.cart || [];

    const index = cart.findIndex(item => item._id == req.params.id);
    if (index > -1 && quantity > 0) {
        cart[index].quantity = parseInt(quantity);
    }

    req.session.cart = cart;
    res.redirect('/cart');
};

// Remove Product from Cart
exports.removeFromCart = (req, res) => {
    let cart = req.session.cart || [];
    cart = cart.filter(item => item._id != req.params.id);
    req.session.cart = cart;
    res.redirect('/cart');
};