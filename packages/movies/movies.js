const router = require('express').Router();
const db = require('../db/db');
const { validate } = require('jsonschema');
const request = require('request-promise');

router.use('/bookmarks/:imdbID', (req, res, next) => {
  const movie = db.get('movies')
    .find({ imdbID: req.params.imdbID })
    .value();

  if (!movie) {
    next(new Error('CAN_NOT_FIND_MOVIE'));
  }else next();
});

// GET bookmarks
router.get('/bookmarks', (req, res) => {
  const movies = db.get('movies')
    .sortBy('order')
    .value();

  res.json({ status: 'OK', data: movies });
});

// GET movies
router.get('/search', (req, res) => {
  const movies = db.get('movies').value();

  res.json({ status: 'OK', data: movies });
});

// GET /bookmarks/:imdbID
router.get('/bookmarks/:imdbID', (req, res) => {
  const movie = db
    .get('movies')
    .find({ imdbID: req.params.imdbID })
    .value();

  res.json({ status: 'OK', data: movie });
});

// GET /:imdbID
router.get('/:imdbID', (req, res) => {
  request({
      uri: 'http://www.omdbapi.com/',
      qs: {
          i: req.params.imdbID,
          plot: 'full',
          apiKey: 'ed932106'
      },
      json: true
  })
  .then( movie => {
      res.json({ status: 'OK', data: movie });
      //console.log(movie);
  })
  .catch( err => {
      console.log(err);
      next(err);
  });
});

// POST /omdb
/*router.post('/search', (req, res, next) => {
  request({
      uri: 'http://www.omdbapi.com/',
      qs: {
          i: req.body.imdbID,
          plot: 'full',
          apiKey: 'ed932106'
      },
      json: true
  })
  .then( movie => {
      //запись в базу данных при post запросе
      db
        .get('movies')
        .push(movie)
        .write();

      res.json({ status: 'OK', data: movie });
      //console.log(movie);
  })
  .catch( err => {
      console.log(err);
      next(err);
  });
});*/

// POST /search
router.post('/search', (req, res, next) => {
  db
    .get('movies')
    .push(req.body.movie)
    .write();

  const movies = db.get('movies').value();

  res.json({ status: 'OK', data: movies });
});

// POST /bookmark
router.post('/bookmark', (req, res, next) => {
  db
    .get('movies')
    .push(req.body.movie)
    .write();

  const movies = db.get('movies').value();

  res.json({ status: 'OK', data: movies });
});

// PATCH /:imdbID
// {isSeen: true/false};  {order: number}
router.patch('/bookmark/:imdbID', (req, res, next) => {
  const movie = db
    .get('movies')
    .find({ imdbID: req.params.imdbID })
    .assign(req.body)
    .value();

  db.write();

  res.json({ status: 'OK' });
});

// DELETE /search/:imdbID
router.delete('/search/:imdbID', (req, res) => {
  db
    .get('movies')
    .remove({ imdbID: req.params.imdbID })
    .write();

  const movies = db.get('movies').value();

  res.json({ status: 'OK', data: movies });
});

// DELETE /bookmarks/:imdbID
router.delete('/bookmarks/:imdbID', (req, res) => {
  db
    .get('movies')
    .remove({ imdbID: req.params.imdbID })
    .write();

  const movies = db.get('movies').value();

  res.json({ status: 'OK', data: movies });
});

// DELETE all bookmarks
router.delete('/bookmarks', (req, res) => {
  db
    .set('movies', [])
    .write();

  const movies = db.get('movies').value();
  
  res.json({ status: 'OK', data: movies });
});

module.exports = router;
