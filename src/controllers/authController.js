const authService = require('../services/authService');

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const result = await authService.authenticateUser(email, password);

        if (!result.success) {
            return res.status(401).json({ message: result.message });
        }

        return res.status(200).json({
            message: 'Login successful',
            token: result.token,
            user: result.user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

const register = async (req, res) => {
    const { first_name, email, password } = req.body;

    if (!first_name || !email || !password) {
        return res.status(400).json({ message: 'First name, email and password are required.' });
    }

    try {
        const result = await authService.registerUser({ email, password, first_name });
        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }

        return res.status(201).json({ message: 'Registration successful. Please login.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = { login, register };