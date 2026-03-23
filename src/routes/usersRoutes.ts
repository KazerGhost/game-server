import express, { Request, Response, Router} from 'express';
import { register, login, logout } from '../controllers/usersController';

const router: Router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout)

export default router;