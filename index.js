const express = require('express'),
  morgan = require('morgan');

const app = express();

// 

let topTenMovies = []

app.get('/movies', (req, res) => {
  res.json(topTenMovies);
});

app.get('/', (req, res) => {
  res.send('Default text Response.');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});