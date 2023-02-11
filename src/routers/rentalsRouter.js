import { Router } from "express";
import rentalsController from "../controllers/rentalsController.js";
import { validate } from "../middlewares/schemaMiddleware.js";
import { rentalSchema } from "../schemas/rentalSchema.js";

export const rentalsRouter = Router();

rentalsRouter.get('/rentals', rentalsController.getRentals);
rentalsRouter.post('/rentals', validate(rentalSchema), rentalsController.createRental);