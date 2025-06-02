// cartMiddleware.js
function initializeCart(req, res, next) {
    if (!req.session.cart || !Array.isArray(req.session.cart.items)) {
        req.session.cart = {
            items: [],
            total: 0
        };
    }
    next();
}

module.exports = initializeCart;
