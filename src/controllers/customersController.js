import { db } from "../config/db.connection.js";

const costumerController = {
  getCustomers: async (req, res) => {
    try {
      const { rows: customers } = await db.query('SELECT * FROM customers');
      res.send(customers);
    } catch (error) {
      console.log(error);
      return res.status(500).send('Deu ruim no banco de dados');
    }
  }
};

export default costumerController;