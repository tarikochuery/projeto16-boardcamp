import { Router } from "express";
import customerController from "../controllers/customersController.js";

export const customerRouter = Router();

customerRouter.get('/customers', customerController.getCustomers);
customerRouter.get('/customers/:id', customerController.getCustomersById);