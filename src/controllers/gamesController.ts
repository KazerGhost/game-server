import express, { Request, Response } from 'express';
import Game from '../models/game';

/**
 * @swagger
 * /api/v1/games:
 *   get:
 *     summary: Retrieve all games
 *     responses:
 *       200:
 *         description: A list of games
 */
export const getGames = async (req: Request, res: Response) => {
    // use model to query mongodb for game docs.  find() gets all docs
    const games = await Game.find();

    if (!games || games.length === 0) {
        return res.status(404).json({ message: 'No games found' });
    }

    return res.status(200).json(games);
};

/**
 * @swagger
 * /api/v1/games:
 *   post:
 *     summary: Create a new game
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Game created
 *       400:
 *         description: Bad request
 */
export const createGame = async (req: Request, res: Response) => {
    if (!req.body) {
        return res.status(400).json({ 'err': 'Invalid Request Body' }); // 400: Bad Request
    }

    // add new game to db from request body via Game model
    await Game.create(req.body);

    return res.status(201).json(); // 201: resource created
};

/**
 * @swagger
 * /api/v1/games/{id}:
 *  put:
 *    summary: Update a game by id
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Numeric id of the game to update
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: integer
 *              title:
 *                type: string
 *    responses:
 *      204:
 *        description: Game updated successfully
 *      400:
 *        description: Id missing - Bad Requests
 */
export const updateGame = async (req: Request, res: Response) => {
    // validate we have an id value
    if (!req.params.id) {
        return res.status(400).json({ 'error': 'Bad Request - Id parameter missing' });
    }

    await Game.findByIdAndUpdate(req.params.id, req.body);
    return res.status(204).json({ 'msg': 'Game Updated' }); // 204: No Content
};

/**
 * @swagger
 * /api/v1/games/{id}:
 *  delete:
 *    summary: Remove a game by id
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Numeric id of the game to delete
 *    responses:
 *      204:
 *        description: Game deleted successfully
 *      400:
 *        description: Id Missing - Bad Request
 */
export const deleteGame = async (req: Request, res: Response) => {
     // validate we have an id value
    if (!req.params.id) {
        return res.status(400).json({ 'error': 'Bad Request - Id parameter missing' });
    }

    await Game.findByIdAndDelete(req.params.id);
     return res.status(204).json({ 'msg': 'Game Deleted' }); // 204: No Content
};