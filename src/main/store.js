const Store = require('electron-store');

// Create store to persist app data between launches
const store = new Store();

module.exports = store;
