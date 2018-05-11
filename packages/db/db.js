const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('moviesdb.json'); //db.json
const db = low(adapter);

db.defaults({ movies: [] })  //tasks
  .write();

module.exports = db;
