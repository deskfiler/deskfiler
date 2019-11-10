const colors = require('colors/safe');

module.exports = (...argw) => console.log(
  colors.brightGreen.bold('[main]: '),
  colors.green(...argw),
);
