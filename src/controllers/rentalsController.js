import dayjs from "dayjs";
import { db } from "../db/db.connection.js";
import rentalQueries from "../db/db.rentals.queries.js";

const verifyGame = async (gameId, stockTotal) => {
  const { rowCount } = await db.query('SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL', [gameId]);
  return stockTotal > rowCount;
};

const getGamePricePerDay = async (gameId) => {
  const { rows: [{ pricePerDay }] } = await db
    .query(`SELECT * FROM games WHERE id=${gameId}`);
  return pricePerDay;
};

const calculateDelayDays = ({ rentDate, returnDate, daysRented }) => {
  const daysDifference = dayjs(returnDate).diff(rentDate, 'day');
  return daysDifference > daysRented ? daysDifference - daysRented : 0;
};

const setQuery = ({ customerId, gameId, limit, offset }) => {
  if (customerId && gameId) return rentalQueries.customerAndGameId(customerId, gameId);
  if (customerId) return rentalQueries.customerId(customerId);
  if (gameId) return rentalQueries.gameId(gameId);
  if (limit && offset) return rentalQueries.limitAndOffset(limit, offset);
  if (limit) return rentalQueries.limit(limit);
  if (offset) return rentalQueries.offset(offset);
  return rentalQueries.default;
};

const rentalsController = {
  getRentals: async (req, res) => {
    const customerId = Number(req.query.customerId);
    const gameId = Number(req.query.gameId);
    const limit = Number(req.query.limit);
    const offset = Number(req.query.offset);
    const query = setQuery({
      customerId,
      gameId,
      limit,
      offset
    });
    try {
      const { rows } = await db
        .query(query);
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
  },
  finishRental: async (req, res) => {
    const { id } = req.params;
    try {
      const returnDate = dayjs().format('YYYY-MM-DD');
      const { rows: [rental] } = await db
        .query('SELECT * FROM rentals WHERE id = $1', [id]);
      if (!rental) return res.sendStatus(404);
      if (rental.returnDate) return res.status(400).send('Aluguel já finalizado');
      const returnDelay = calculateDelayDays({
        returnDate,
        rentDate: rental.rentDate,
        daysRented: rental.daysRented
      });
      const gamePricePerDay = await getGamePricePerDay(rental.gameId);
      const delayFee = gamePricePerDay * returnDelay;
      await db
        .query('UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id=$3', [returnDate, delayFee, id]);
      return res.send(200);
    } catch (error) {
      console.log(error);
      res.status(500).send('Deu ruim no servidor');
    }
  },
  deleteRental: async (req, res) => {
    const { id } = req.params;
    try {
      const { rows: [rental] } = await db
        .query('SELECT * FROM rentals WHERE id=$1', [id]);
      if (!rental) return res.sendStatus(404);
      if (!rental.returnDate) return res.status(400).send('Aluguel ainda não finalizado');
      await db.query('DELETE FROM rentals WHERE id = $1', [id]);
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.status(500).send('Deu ruim no servidor');
    }
  }
};

export default rentalsController;