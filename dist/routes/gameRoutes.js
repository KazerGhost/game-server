"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// npm imports
const express_1 = __importDefault(require("express"));
// local file imports
const gamesController_1 = require("../controllers/gamesController");
// instantiate router to map url requests to the correct methods
const router = express_1.default.Router();
// map standard REST API url's to the CRUD functions in controller
router.get('/', gamesController_1.getGames);
router.post('/', gamesController_1.createGame);
router.put('/:id', gamesController_1.updateGame);
router.delete('/:id', gamesController_1.deleteGame);
// make router public
exports.default = router;
