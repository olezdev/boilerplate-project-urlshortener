require('dotenv').config();
const express = require('express');
// const enableCORS = require('./middlewares/cors');
const app = express();
const cors = require('cors');
const dns = require('dns');
const bodyparser = require('body-parser');
const db = require('./mongodb.js');

// Basic Configuration
app.use(cors());
app.use(bodyparser.urlencoded({ extended: "false" }));
app.use(bodyparser.json());
app.use('/public', express.static(`${process.cwd()}/public`));

// let shortenedURL = []

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', (req, res) => {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl/:short_url?', (req, res) => {
  const { short_url } = req.params;
  // console.log(short_url);
  if (!isNaN(short_url)) {
    const short_url_int = parseInt(short_url);

    db.ShortURL.findOne({ short_url: short_url_int }, ((err, data) => {
      if (data) {
        console.log(data);
        res.redirect(data.original_url);
      } else {
        console.log(err);
        res.status(404);
      }
    }));

  } else {
    res.json({ error: 'Wrong format' });
  }
});

app.post('/api/shorturl', (req, res, next) => {
  const { url } = req.body
  console.log(url);

  const hostname = new URL(url).hostname;

  console.log(hostname);

  dns.lookup(hostname, (err, address) => {
    if (err) {
      res.json({ error: "Invalid URL" });
    } else {
      next();
    }
  });
}, (req, res) => {
  // Encontrar el máximo ordenando en orden descendente y tomando el primero
  const short_url_max = db.ShortURL.find().sort({ [short_url]: -1 }).limit(1).toArray();

  const data = {
    original_url: req.body.url,
    short_url: short_url_max + 1
  };
  let url = new db.ShortURL({
    original_url: req.body.url,
    short_url: short_url_max + 1
  });

  url.save().then(() => {
    res.json(data);
    console.log(`${data} saved`);
  })
    .catch((err) => {
      res.status(500).json({ error: 'Error saving to database' });
      console.log(`${data} error: ${err.message}`);
    });
  // shortenedURL.push(data);

});

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
