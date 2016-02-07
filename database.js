var pg = require('knex')({
  client: 'pg',         //production                            //development                   // tacos?
  connection: process.env.PG_CONNECTION_STRING || require('./config.js').devPostgres.CONSTRING || 'taco',
  searchPath: 'knex,public'
});

var bookshelf = require('bookshelf')(pg);

exports.pg = pg;
exports.bookshelf = bookshelf;
