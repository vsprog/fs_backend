const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const error = require('../error/error');
const moviesRoutes = require('../movies/movies');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', moviesRoutes);   // bookmarks/movies,  /.*/ - любой путь

app.use((req, res) => {
  res.json({ status: 'BAD_REQUEST', messages: [error({ code: 'BAD_REQUEST' })] });
});
//отключение eslint на следующую строку
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.json({ status: 'FAIL', messages: [error({ code: err.message })] });
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

moviesRoutes.use((req, res, next) => {
  setTimeout(next, 300);
});

module.exports = app;
