import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

interface Game {
    id: number;
    title: string;
}

let games: Game[] = [
    { id: 1, title: 'The Legend of Zelda' },
    { id: 2, title: 'Super Mario Bros' },
    { id: 3, title: 'Minecraft' }
];


/**
 * @swagger
 * /api/v1/games:
 *   get:
 *     summary: Retrieve all games
 *     responses:
 *       200:
 *         description: A list of games
 */

router.get('/', (req: Request, res: Response) => {
    return res.status(200).json(games);
});

router.post('/', (req: Request, res: Response) => {
    if (!req.body) {
        return res.status(400).json({ error: 'Request body is missing' });
    }
    games.push(req.body);

    return res.status(201).json();
});


router.put('/:id', (req: Request, res: Response) => {
    const index: number =  games.findIndex((g) => g.id == parseInt(req.params.id));

    if (index === -1) {
        return res.status(404).json({ error: 'Game not found' });
    }
    games[index].title = req.body.title;
    return res.status(204).json( {message: "Game updated successfully"});
});

router.delete('/:id', (req: Request, res: Response) => {
    const index: number =  games.findIndex((g) => g.id == parseInt(req.params.id));

    if (index === -1) {
        return res.status(404).json({ error: 'Game not found' });
    }
    games.splice(index, 1);
    return res.status(204).json( {message: "Game deleted successfully"});
});
export default router;