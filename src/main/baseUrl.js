const path = require('path');

const baseUrl = (
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : `file://${__dirname}`
);

module.exports = baseUrl;
