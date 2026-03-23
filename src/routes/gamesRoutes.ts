// npm imports
import express, { Router } from 'express';

// local file imports
import { getGames, getGame, createGame, updateGame, deleteGame, createReview } from '../controllers/gamesController';
import { verifyToken } from '../middleware/auth';

// instantiate router to map url requests to the correct methods
const router: Router = express.Router();

// map standard REST API url's to the CRUD functions in controller
router.get('/', getGames);
router.get('/:id', getGame);

// private method
router.post('/', verifyToken, createGame);
router.put('/:id', verifyToken, updateGame);
router.delete('/:id', verifyToken, deleteGame);
router.put('/:id/reviews', verifyToken, createReview);

// make router public
export default router;