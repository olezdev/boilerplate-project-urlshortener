require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI);

const shortURLSchema = new mongoose.Schema({
  original_url: String,
  short_url: Number
});

let ShortURL = mongoose.model('ShortURL', shortURLSchema);

module.exports = { ShortURL };
