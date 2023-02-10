import { db } from "../config/db.connection.js";

const costumerController = {
  getCustomers: async (req, res) => {
    try {
      const { rows: customers } = await db.query('SELECT * FROM customers');
      res.send(customers);
    } catch (error) {
      return res.status(500).send('Deu ruim no banco de dados');
    }
  },
  getCustomersById: async (req, res) => {
    const { id } = req.params;
    try {
      const { rows: [customer] } = await db
        .query('SELECT * FROM customers WHERE id = $1', [id]);
      if (!customer) return res.sendStatus(404);
      return res.send(customer);
    } catch (error) {
      console.log(error);
      return res.status(500).send('Deu ruim no banco de dados');
    }
  },
  createCustomer: async (req, res) => {
    const { name, phone, cpf, birthday } = req.body;
    try {
      const { rows: [customerAlreadyExists] } = await db
        .query('SELECT * FROM customers WHERE cpf = $1', [cpf]);
      if (customerAlreadyExists) return res.sendStatus(409);
      await db
        .query('INSERT INTO customers (name, phone, cpf, birthday) values ($1, $2, $3, $4)', [name, phone, cpf, birthday]);
      res.sendStatus(201);
    } catch (error) {
      console.log(error);
      res.status(500).send('Deu ruim no banco');
    }
  }
};

export default costumerController;