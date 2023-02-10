import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { gamesRouter } from './routers/gamesRouter.js';
import { customerRouter } from './routers/customersRouter.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(json());
app.use([gamesRouter, customerRouter]);

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });