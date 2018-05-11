const router = require('express').Router();
const db = require('../db/db');
const { validate } = require('jsonschema');
const rp = require('request-promise');


// GET movies
router.get('/', (req, res) => {
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
  rp({
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
  }); 
});

// POST /movies
router.post('/', (req, res, next) => {     
  rp({
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
  });  
});

// PATCH /:imdbID
// {isSeen: true/false};
router.patch('/:imdbID', (req, res, next) => {
  const task = db
    .get('movies')
    .find({ imdbID: req.params.imdbID })
    .assign(req.body)
    .value();

  db.write();

  res.json({ status: 'OK', data: task });
});

// DELETE /movies/:imdbID
router.delete('/:imdbID', (req, res) => {
  db
    .get('movies')
    .remove({ imdbID: req.params.imdbID })
    .write();

  res.json({ status: 'OK' });
});



module.exports = router;