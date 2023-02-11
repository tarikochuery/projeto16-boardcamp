import dayjs from "dayjs";
import { db } from "../config/db.connection.js";

const verifyGame = async (gameId, stockTotal) => {
  const { rowCount } = await db.query('SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL', [gameId]);
  return stockTotal > rowCount;
};

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
  },
  createRental: async (req, res) => {
    const { customerId, gameId, daysRented } = req.body;
    const rentDate = dayjs().format('YYYY-MM-DD');
    try {
      const { rows: [gameRented] } = await db.query('SELECT * FROM games WHERE id = $1', [gameId]);
      if (!gameRented) return res.status(400).send('Jogo não cadastrado');
      const isGameAvailable = await verifyGame(gameId, gameRented.stockTotal);
      if (!isGameAvailable) return res.status(400).send('Jogo Esgotado');
      const { rows: [rentingCustomer] } = await db.query('SELECT * FROM customers WHERE id = $1', [customerId]);
      if (!rentingCustomer) return res.status(400).send('cliente não cadastrado');
      const originalPrice = gameRented.pricePerDay * daysRented;
      const rentalValuesArray = [customerId, gameId, rentDate, daysRented, null, originalPrice, null];
      await db
        .query('INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") values ($1, $2, $3, $4, $5, $6, $7)', rentalValuesArray);
      res.sendStatus(201);
    } catch (error) {
      console.log(error);
      res.status(500).send('Deu ruim no servidor');
    }
  }
};

export default rentalsController;