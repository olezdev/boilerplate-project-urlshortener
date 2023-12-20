const mongoose = require('mongoose');

const shortURLSchema = new mongoose.Schema({
  original_url: String,
  short_url: Number
});

const ShortURL = mongoose.model('ShortURL', shortURLSchema);

module.exports = ShortURL;