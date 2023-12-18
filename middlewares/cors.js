// const cors = require('cors');

const ACCEPTED_ORIGINS = [
  'http://localhost:1234',
  'https://www.freecodecamp.org'
]

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
const enableCORS = (req, res, next) => {
  if (!process.env.DISABLE_XORIGIN) {
    // const allowedOrigins = ["https://www.freecodecamp.org"];
    const origin = req.headers.origin;
    if (!process.env.XORIGIN_RESTRICT || ACCEPTED_ORIGINS.indexOf(origin) > -1) {
      console.log(req.method);
      res.set({
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
      });
    }
  }
  next();
}

module.exports = { enableCORS }