import { db } from "../db/db.connection.js";

const treatGameName = (name) => {
  const nameArray = name.split("");
  nameArray[0] = nameArray[0].toUpperCase();
  const treatedName = nameArray.join('');
  return treatedName;
};

const gamesController = {
  getGames: async (req, res) => {
    const { name } = req.query;
    const offset = Number(req.query.offset);
    const limit = Number(req.query.limit);
    if (name) {
      const treatedName = treatGameName(name);
      const { rows: games } = await db
        .query(`SELECT * FROM games WHERE name LIKE '${treatedName}%'`);
      return res.send(games);
    }
    if (offset && limit) {
      const { rows: games } = await db
        .query(`SELECT * FROM games LIMIT ${limit} OFFSET ${offset}`);
      return res.send(games);
    }
    if (limit) {
      const { rows: games } = await db
        .query(`SELECT * FROM games LIMIT ${limit}`);
      return res.send(games);
    }
    if (offset) {
      const { rows: games } = await db
        .query(`SELECT * FROM games OFFSET ${offset}`);
      return res.send(games);
    }
    const { rows: games } = await db.query('SELECT * FROM games');
    return res.send(games);
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