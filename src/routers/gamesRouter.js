import { Router } from "express";
import gamesController from "../controllers/gamesController.js";

export const router = Router();

router.get('/games', gamesController.getGames);
router.post('/games',);