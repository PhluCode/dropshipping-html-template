const checkoutService = require('../services/checkoutService');

const checkout = async (req, res) => {
    try {
        const { cartItems, email, creditCard } = req.body;

        // Validate cart items
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({ error: 'Cart items are required and must be a non-empty array' });
        }

        for (let item of cartItems) {
            if (!item.id || !item.title || !item.price || !item.quantity) {
                return res.status(400).json({ error: 'Each cart item must have id, title, price, and quantity' });
            }
            if (typeof item.price !== 'number' || item.price <= 0) {
                return res.status(400).json({ error: 'Item price must be a positive number' });
            }
            if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                return res.status(400).json({ error: 'Item quantity must be a positive integer' });
            }
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ error: 'Valid email is required' });
        }

        // Validate credit card
        const creditCardRegex = /^\d{16}$/;
        if (!creditCard || !creditCardRegex.test(creditCard)) {
            return res.status(400).json({ error: 'Credit card must be a 16-digit number' });
        }

        // Calculate total
        let total = 0;
        for (let item of cartItems) {
            total += item.price * item.quantity;
        }

        // Assume user is authenticated, get userId from req (need auth middleware)
        // For now, assume userId is in req.user.id or something
        // Since auth is JWT, need to decode token
        // But for simplicity, assume req.body has userId or from auth
        // Wait, the user didn't specify auth, but probably need to get userId
        // From the auth, probably req.user.id after middleware
        // But to keep simple, assume userId is provided or from session
        // Looking at auth, it's JWT, so need middleware
        // For now, assume req.user exists

        const userId = req.user ? req.user.userId : null;

        // Save order
        const creditCardLast4 = creditCard.slice(-4);
        await checkoutService.saveOrder(userId, email, creditCardLast4, total, cartItems);

        res.json({ message: 'Order placed successfully', total });

    } catch (error) {
        console.error('Checkout error:', error);
        res.status(400).json({ error: 'Failed to save order. Please try again.' });
    }
};

module.exports = {
    checkout
};