const express = require('express');
const morgan = require('morgan');

const app = express();

app.arguments(bodyParser.json());


// Movies
let topTenMovies = []

// Express static function
app.use(express.static('public'));

// Middleware
app.use(morgan('common'));

// GET requests
app.get('/movies', (req, res) => {
  res.json(topTenMovies);
});

app.get('/', (req, res) => {
  res.send('Welcome to my App!');
});

app.get('/documentation'), (req, res) => {
    res.sendFile('public/documentation.html')
}

// error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});