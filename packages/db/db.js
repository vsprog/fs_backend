const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('moviesdb.json');
const db = low(adapter);

db.defaults({ movies: [] })
  .write();

module.exports = db;
