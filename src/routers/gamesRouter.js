import { Router } from "express";
import gamesController from "../controllers/gamesController.js";
import { validate } from "../middlewares/schemaMiddleware.js";
import { gameSchema } from "../schemas/gameSchema.js";

export const router = Router();

router.get('/games', gamesController.getGames);
router.post('/games', validate(gameSchema), gamesController.createGame);