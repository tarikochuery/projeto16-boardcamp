import { Router } from "express";
import gamesController from "../controllers/gamesController.js";
import { validate } from "../middlewares/schemaMiddleware.js";
import { gameSchema } from "../schemas/gameSchema.js";

export const gamesRouter = Router();

gamesRouter.get('/games', gamesController.getGames);
gamesRouter.post('/games', validate(gameSchema), gamesController.createGame);