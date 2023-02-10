import { db } from "../config/db.connection.js";

const gamesController = {
  getGames: async (req, res) => {
    const { rows } = await db.query('SELECT * FROM games');
    res.send(rows);
  },

  createGame: async (req, res) => {
    const { name, image, stockTotal, pricePerDay } = req.body;
    try {
      const { rows: [gameAlreadyExists] } = await db.query('SELECT * FROM games WHERE name = $1', [name]);

      if (gameAlreadyExists) return res.sendStatus(409);

      await db
        .query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") values ($1, $2, $3, $4)`, [name, image, stockTotal, pricePerDay]);
      return res.sendStatus(201);
    } catch (error) {
      console.log(error);
      return res.status(500).send('Deu ruim!');
    }

  }
};

export default gamesController;