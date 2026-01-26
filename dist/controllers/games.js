"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const game_1 = __importDefault(require("../models/game"));
const router = express_1.default.Router();
// interface Game {
//     id: number;
//     title: string;
// }
// let games: Game[] = [
//     { id: 1, title: 'The Legend of Zelda' },
//     { id: 2, title: 'Super Mario Bros' },
//     { id: 3, title: 'Minecraft' }
// ];
/**
 * @swagger
 * /api/v1/games:
 *   get:
 *     summary: Retrieve all games
 *     responses:
 *       200:
 *         description: A list of games
 */
router.get('/', async (req, res) => {
    const games = await game_1.default.find();
    if (!games || games.length === 0) {
        return res.status(404).json({ error: 'Games not found' });
    }
    return res.status(200).json(games);
});
router.post('/', async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: 'Request body is missing' });
    }
    await game_1.default.create(req.body);
    return res.status(201).json();
});
// router.put('/:id', (req: Request, res: Response) => {
//     const index: number =  games.findIndex((g) => g.id == parseInt(req.params.id));
//     if (index === -1) {
//         return res.status(404).json({ error: 'Game not found' });
//     }
//     games[index].title = req.body.title;
//     return res.status(204).json( {message: "Game updated successfully"});
// });
// router.delete('/:id', (req: Request, res: Response) => {
//     const index: number =  games.findIndex((g) => g.id == parseInt(req.params.id));
//     if (index === -1) {
//         return res.status(404).json({ error: 'Game not found' });
//     }
//     games.splice(index, 1);
//     return res.status(204).json( {message: "Game deleted successfully"});
// });
exports.default = router;
