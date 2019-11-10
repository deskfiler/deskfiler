const colors = require('colors/safe');

module.exports = (...argw) => console.log(
  colors.brightBlue.bold('[plugin-controller]: '),
  colors.blue(...argw),
);
