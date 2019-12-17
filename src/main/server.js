
const http = require('http');
const handler = require('serve-handler');

const log = require('./log');

const {
  PLUGINS_DIR,
  PORT,
} = require('./constants');

let server = null;

// Local server to host deskfiler plugins
const createServer = () => {
  server = http.createServer((request, response) => (
    handler(request, response, {
      public: PLUGINS_DIR,
    })
  ));

  server.listen(PORT, () => {
    log(`Hosting plugins @ http://localhost:${PORT}.`);
  });
};

const closeServer = () => {
  if (server) {
    server.close(() => { log('Plugin server is closed.') });
    server = null;
  }
};

module.exports = {
  closeServer,
  createServer,
};