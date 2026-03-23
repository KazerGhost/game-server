import express, { Request, Response } from 'express';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';

const generateToken = (user: any): string => {
    const payload = {
        id: user._id,
        username: user.Username
    };

    const jwtOptions = { expiresIn: '1hr' }; // Token expires in 1 hour

    return jwt.sign(payload, process.env.PASSPORT_SECRET, jwtOptions);
}

const setTokenCookie = (res: Response, token: string) => {
    res.cookie('authToken', token, {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: true, // Ensures the cookie is only sent over HTTPS in production
        sameSite: 'none', // Prevents the cookie from being sent in cross-site requests
        // maxAge: 3600000 // 1 hour in milliseconds
    });
}

const clearTokenCookie = (res: Response): void => {
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
}

export const register = async (req: Request, res: Response) => {
    try {
        // duplicate username check
        const duplicateUser = await User.findOne({ username: req.body.username });

        if (duplicateUser) {
            throw new Error('User already exists');
        }

        // manual password val. can add regex later
        if (req.body.password.length < 8) {
            throw new Error('Password must be min 8 characters');
        }

        // create new user first from username
        const user = new User({ username: req.body.username });

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

export const login = async (req: Request, res: Response) => {
    // login handled by passport-local-mongoose middleware, so this method can be left empty
    try {
        const user = await User.findOne({ Username: req.body.username });

        if (!user) {
            throw new Error();
        }

        const result = await user.authenticate(req.body.password);

        if (!result.user) {
            throw new Error();
        }

        const authToken: string = generateToken(result.user);

        setTokenCookie(res, authToken);

        return res.status(200).json({success: true});

    } catch (error) {
        return res.status(400).json({ error: 'Invalid login' });
    }
}

export const logout = async (req: Request, res: Response) => {
    // logout handled by passport-local-mongoose middleware, so this method can be left empty
    clearTokenCookie(res);
    return res.status(200).json({ message: 'Logged out successfully' });
}