const express = require('express');
const cors = require('cors');
// const enableCORS = require('./middlewares/cors.js');
const dns = require('dns');
const bodyparser = require('body-parser');
require('./database/mongodb');
const ShortURL = require('./models/ShortURL');
require('dotenv').config();

// Basic Configuration
const app = express();
app.use(cors());

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')))

let shortenedURL = []

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Your first API endpoint
app.get('/api/shorturl/:short_url?', (req, res) => {
  const { short_url } = req.params;

  if (!isNaN(short_url)) {
    const short_url_int = parseInt(short_url);

    ShortURL.findOne({ short_url: short_url_int })
      .then((url) => {
        // console.log(url.original_url);
        res.redirect(url.original_url);
      })
      .catch((err) => {
        console.log(err);
        return res.status(404);
      });

  } else {
    res.json({ error: 'Wrong format' });
  }
});

app.post('/api/shorturl', bodyparser.urlencoded({ extended: "false" }), (req, res, next) => {
  let host

  try {
    host = new URL(req.body.url).hostname;
  } catch (err) {
    console.log("error is ", err);
    return res.json({ error: "invalid url" });
  }

  dns.lookup(host, (err) => {
    if (err) {
      return res.json({ error: "invalid url" });
    } else {
      next();
    }
  });
}, async (req, res) => {
  const short_url_last = await ShortURL
    .find()
    .sort({ short_url: -1 })
    .limit(1)
    .select({ original_url: 0 })
    .then((data) => {
      // console.log(data[0]);
      console.log(data[0]['short_url']);
      return data[0]['short_url'];
    }).catch((err) => {
      return console.log(err);
    });

  const data = {
    original_url: req.body.url,
    short_url: short_url_last + 1
  };
  let url = new ShortURL({
    original_url: req.body.url,
    short_url: short_url_last + 1
  });

  url.save().then(() => {
    res.json(data);
    console.log(`${data} saved`);
  })
    .catch((err) => {
      res.status(500).json({ error: 'Error saving to database' });
      console.log(`${data} error: ${err.message}`);
    });

  shortenedURL.push(data);

});

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
