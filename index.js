const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();

// app.arguments(bodyParser.json());


// Movies
let topTenMovies = {
  one: {
    name: "Gladiator",
    director: "Ridley Scott",
    year: 2000
  },
  two: {
    name: "The Departed",
    director: "Martin Scorsese",
    year: 2006
  },
  three: {
    name: "Fight Club",
    director: "David Fincher",
    year: 1999
  },
  four: {
    name: "Goodfellas",
    director: "Martin Scorsese",
    year: 1990
  },
  five: {
    name: "In Bruges",
    director: "Martin McDonagh",
    year: 2008
  },
  six: {
    name: "Django Unchained",
    director: "Quentin Tarantino",
    year: 2012
  },
  seven: {
    name: "The Lord of the Rings",
    director: "Peter Jackson",
    year: 2001
  },
  eight: {
    name: "Miracle",
    director: "Gavin O'Connor",
    year: 2004
  },
  nine: {
    name: "Dune: Part Two",
    director: "Denis Villeneuve",
    year: 2024
  },
  ten: {
    name: "Top Gun: Maverick",
    director: "Joseph Kosinski",
    year: 2022
  }
}

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