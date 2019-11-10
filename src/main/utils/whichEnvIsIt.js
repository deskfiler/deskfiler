// Usage: console.log(isIt('development').env ? 'it's dev env' : 'it's prod env';
module.exports = (env) => ({ env: process.env.NODE_ENV === env });
