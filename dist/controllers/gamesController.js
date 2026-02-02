"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGame = exports.updateGame = exports.createGame = exports.getGames = void 0;
const game_1 = __importDefault(require("../models/game"));
/**
 * @swagger
 * /api/v1/games:
 *   get:
 *     summary: Retrieve all games
 *     responses:
 *       200:
 *         description: A list of games
 */
const getGames = async (req, res) => {
    // use model to query mongodb for game docs.  find() gets all docs
    const games = await game_1.default.find();
    if (!games || games.length === 0) {
        return res.status(404).json({ message: 'No games found' });
    }
    return res.status(200).json(games);
};
exports.getGames = getGames;
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
const createGame = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ 'err': 'Invalid Request Body' }); // 400: Bad Request
    }
    // add new game to db from request body via Game model
    await game_1.default.create(req.body);
    return res.status(201).json(); // 201: resource created
};
exports.createGame = createGame;
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
const updateGame = async (req, res) => {
    // validate we have an id value
    if (!req.params.id) {
        return res.status(400).json({ 'error': 'Bad Request - Id parameter missing' });
    }
    await game_1.default.findByIdAndUpdate(req.params.id, req.body);
    return res.status(204).json({ 'msg': 'Game Updated' }); // 204: No Content
};
exports.updateGame = updateGame;
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
const deleteGame = async (req, res) => {
    // validate we have an id value
    if (!req.params.id) {
        return res.status(400).json({ 'error': 'Bad Request - Id parameter missing' });
    }
    await game_1.default.findByIdAndDelete(req.params.id);
    return res.status(204).json({ 'msg': 'Game Deleted' }); // 204: No Content
};
exports.deleteGame = deleteGame;
