const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModals'); 
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

exports.signup = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ username, email, password: hashedPassword });
            await user.save();
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Error creating user' });
        }
    }
];

exports.login = [
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').notEmpty().withMessage('Password is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            const token = jwt.sign({ 
                id: user._id, 
                username: user.username, 
                email: user.email, 
                role: user.role 
            }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ error: 'Error logging in' });
        }
    }
];

exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({user});
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.forgetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const resetUrl = `http://localhost:5173/reset-password/${token}`;

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: 'skrai9471930131@gmail.com',
            to: user.email,
            subject: 'Password Reset',
            html: `Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 1 hour.`
        });

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Error generating password reset token:', error);
        res.status(500).json({ error: 'Error generating password reset token' });
    }
};

exports.resetPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        if (!token) {
            return res.status(400).json({ error: 'Token is missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ error: 'Invalid token' });
        }
        res.status(500).json({ error: 'Error resetting password' });
    }
};
