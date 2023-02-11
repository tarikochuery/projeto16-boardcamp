const rentalQueries = {
  default: `SELECT rentals.*, games.name AS "gameName", customers.name AS "customerName"
  FROM games
  JOIN rentals
  ON games.id = rentals."gameId"
  JOIN customers
  ON customers.id = rentals."customerId"`,
  gameId: (id) => {
    return `SELECT rentals.*, games.name AS "gameName", customers.name AS "customerName"
    FROM games
    JOIN rentals
    ON games.id = rentals."gameId"
    JOIN customers
    ON customers.id = rentals."customerId"
    WHERE games.id = ${id}`;
  },
  customerId: (id) => {
    return `SELECT rentals.*, games.name AS "gameName", customers.name AS "customerName"
    FROM games
    JOIN rentals
    ON games.id = rentals."gameId"
    JOIN customers
    ON customers.id = rentals."customerId"
    WHERE customers.id = ${id}`;
  },
  customerAndGameId: (customerId, gameId) => {
    return `SELECT rentals.*, games.name AS "gameName", customers.name AS "customerName"
    FROM games
    JOIN rentals
    ON games.id = rentals."gameId"
    JOIN customers
    ON customers.id = rentals."customerId"
    WHERE games.id = ${gameId} AND customers.id = ${customerId}`;
  },
  limit: (limit) => {
    return `SELECT rentals.*, games.name AS "gameName", customers.name AS "customerName"
    FROM games
    JOIN rentals
    ON games.id = rentals."gameId"
    JOIN customers
    ON customers.id = rentals."customerId"
    LIMIT ${limit}`;
  },
  offset: (offset) => {
    return `SELECT rentals.*, games.name AS "gameName", customers.name AS "customerName"
    FROM games
    JOIN rentals
    ON games.id = rentals."gameId"
    JOIN customers
    ON customers.id = rentals."customerId"
    OFFSET ${offset}`;
  },
  limitAndOffset: (limit, offset) => {
    return `SELECT rentals.*, games.name AS "gameName", customers.name AS "customerName"
    FROM games
    JOIN rentals
    ON games.id = rentals."gameId"
    JOIN customers
    ON customers.id = rentals."customerId"
    LIMIT ${limit}
    OFFSET ${offset}`;
  },
};

export default rentalQueries;