import { Router } from "express";
import rentalsController from "../controllers/rentalsController.js";

export const rentalsRouter = Router();

rentalsRouter.get('/rentals', rentalsController.getRentals);