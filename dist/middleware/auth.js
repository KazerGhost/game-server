"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const verifyToken = (req, res, next) => {
    const token = req.cookies.authToken; // get token from cookies
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};
exports.verifyToken = verifyToken;
