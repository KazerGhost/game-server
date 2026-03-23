"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const user_1 = require("../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (user) => {
    const payload = {
        id: user._id,
        username: user.Username
    };
    const jwtOptions = { expiresIn: '1hr' }; // Token expires in 1 hour
    return jsonwebtoken_1.default.sign(payload, process.env.PASSPORT_SECRET, jwtOptions);
};
const setTokenCookie = (res, token) => {
    res.cookie('authToken', token, {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: true, // Ensures the cookie is only sent over HTTPS in production
        sameSite: 'none', // Prevents the cookie from being sent in cross-site requests
        // maxAge: 3600000 // 1 hour in milliseconds
    });
};
const clearTokenCookie = (res) => {
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
};
const register = async (req, res) => {
    try {
        // duplicate username check
        const duplicateUser = await user_1.User.findOne({ username: req.body.username });
        if (duplicateUser) {
            throw new Error('User already exists');
        }
        // manual password val. can add regex later
        if (req.body.password.length < 8) {
            throw new Error('Password must be min 8 characters');
        }
        // create new user first from username
        const user = new user_1.User({ username: req.body.username });
        // hash password
        await user.setPassword(req.body.password);
        // save new user
        await user.save();
        // return response
        return res.status(201).json({ _id: user._id, username: user.username });
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    // login handled by passport-local-mongoose middleware, so this method can be left empty
    try {
        const user = await user_1.User.findOne({ Username: req.body.username });
        if (!user) {
            throw new Error();
        }
        const result = await user.authenticate(req.body.password);
        if (!result.user) {
            throw new Error();
        }
        const authToken = generateToken(result.user);
        setTokenCookie(res, authToken);
        return res.status(200).json({ success: true });
    }
    catch (error) {
        return res.status(400).json({ error: 'Invalid login' });
    }
};
exports.login = login;
const logout = async (req, res) => {
    // logout handled by passport-local-mongoose middleware, so this method can be left empty
    clearTokenCookie(res);
    return res.status(200).json({ message: 'Logged out successfully' });
};
exports.logout = logout;
