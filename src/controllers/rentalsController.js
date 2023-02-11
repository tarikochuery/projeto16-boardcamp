import { db } from "../config/db.connection.js";

const rentalsController = {
  getRentals: async (req, res) => {
    try {
      const { rows } = await db
        .query(`SELECT rentals.*, games.name AS "gameName", customers.name AS "customerName"
        FROM games
        JOIN rentals
        ON games.id = rentals."gameId"
        JOIN customers
        ON customers.id = rentals."customerId"`);
      const rentals = rows.map(row => {
        const game = { id: row.gameId, name: row.gameName };
        const customer = { id: row.customerId, name: row.customerName };
        const { gameName, customerName, ...rental } = row;
        return { ...rental, game, customer };
      });
      res.send(rentals);

    } catch (error) {
      console.log(error);
      res.status(500).send('Deu ruim no banco');
    }
  }
};

export default rentalsController;