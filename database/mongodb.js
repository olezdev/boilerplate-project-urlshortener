const mongoose = require('mongoose')
require('dotenv').config();

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => {
        console.log('Database connection succesful');
      })
      .catch((err) => {
        console.log('Database connection error');
      })
  }
}

module.exports = new Database();