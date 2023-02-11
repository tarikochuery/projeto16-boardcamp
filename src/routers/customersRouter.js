import { Router } from "express";
import customerController from "../controllers/customersController.js";
import { validate } from "../middlewares/schemaMiddleware.js";
import { customerSchema } from "../schemas/customerSchema.js";

export const customerRouter = Router();

customerRouter.get('/customers', customerController.getCustomers);
customerRouter.get('/customers/:id', customerController.getCustomersById);
customerRouter.post('/customers', validate(customerSchema), customerController.createCustomer);
customerRouter.put('/customers/:id', validate(customerSchema), customerController.updateCustomer);