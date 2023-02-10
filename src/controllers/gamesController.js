import { db } from "../config/db.connection.js";

const gamesController = {
  getGames: async (req, res) => {
    const { rows } = await db.query('SELECT * FROM games');
    res.send(rows);
  },

  createGame: async (req, res) => {

  }
};

export default gamesController;