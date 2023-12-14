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
app.use(bodyparser.json());
app.use('/public', express.static(`${process.cwd()}/public`));

let shortenedURL = []

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', (req, res) => {
  res.json({ greeting: 'hello API' });
});

app.post('api/shorturl', (req, res) => {
  const { url } = req.body
  console.log(url);

  const hostname = new URL(url).hostname;

  dns.lookup(hostname, (err, address) => {
    if (err) {
      res.status(400).json({ error: "Invalid URL" })
    } else {

      let data = {
        original_url: req.body.url,
        short_url: shortenedURL.length + 1
      };
      let url = new db.ShortURL({
        original_url: req.body.url,
        short_url: shortenedURL.length + 1
      })
      url.save().then(() => {
        res.json(data);
        console.log(`${url} saved url`);
      }).catch((err) => {
        res.json({ error: 'Invalid URL' });
        console.log(`${url} error: ${err.message}`);
      });

      shortenedURL.push(data);

    }
  })

})

app.get('/api/shorturl/:short_url', (req, res) => {
  let short_url = parseInt(req.params.short_url)
  console.log(short_url);

  db.ShortURL.findOne({ short_url: short_url })
    .then((url) => {
      console.log(url);
      res.redirect(url.original_url);
    })
    .catch((err) => {
      console.log(err);
      res.json({ error: 'Invalid URL' });
    });
});

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
