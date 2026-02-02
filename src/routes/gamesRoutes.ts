// npm imports
import express, { Router } from 'express';

// local file imports
import { getGames, createGame, updateGame, deleteGame } from '../controllers/gamesController';

// instantiate router to map url requests to the correct methods
const router: Router = express.Router();

// map standard REST API url's to the CRUD functions in controller
router.get('/', getGames);
router.post('/', createGame);
router.put('/:id', updateGame);
router.delete('/:id', deleteGame);

// make router public
export default router;