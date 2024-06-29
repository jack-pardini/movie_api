const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/cfDB', {useNewUrlParser: true, useUnifiedTopology: true});

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const uuid = require('uuid');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());

// Users
let users = [
  {
    id: 1,
    username: "kimjones123",
    password: "password123",
    email: "kimjones@gmail.com",
    birthday: "09/10/1988",
    favoriteMovies: []
  },
  {
    id: 2,
    username: "joesmith456",
    password: "password456",
    email: "joesmith@gmail.com",
    birthday: "02/13/1995",
    favoriteMovies: ["The Departed"]
  }
]

// Movies
let movies = [
  {
    "Title": "Gladiator",
    "Director": {
      "Name": "Ridley Scott",
      "Bio": "Sir Ridley Scott GBE is an English filmmaker. He is best known for directing films in the science fiction, crime and historical drama genres. His work is known for its atmospheric and highly concentrated visual style.",
      "Birth": 1937,
      "Death": "N/A"
    },
    "Genre": {
      "Name": "Action",
      "Description": "A film genre in which the protagonist or protagonists are thrust into a series of events that typically include violence, extended fighting, physical feats, rescues and frantic chases. Action films tend to feature a mostly resourceful hero struggling against incredible odds, which include life-threatening situations, a dangerous villain, or a pursuit which usually concludes in victory for the hero."
    },
    "Description": "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
    "ImageURL": "https://m.media-amazon.com/images/I/81QVTiMK1wL._SL1500_.jpg",
    "Year": 2000,
    "Featured": true
  },
  {
    "Title": "The Departed",
    "Director": {
      "Name": "Martin Scorsese",
      "Bio": "Martin Charles Scorsese is an American filmmaker. He emerged as one of the major figures of the New Hollywood era. He has received many accolades, including an Academy Award, four BAFTA Awards, three Emmy Awards, a Grammy Award, and three Golden Globe Awards.",
      "Birth": 1942,
      "Death": "N/A"
    },
    "Genre": {
      "Name": "Drama",
      "Description": "In film and television, drama is a category of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone."
    },
    "Description": "An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.",
    "ImageURL": "https://m.media-amazon.com/images/I/71TO1MtPQkL._SL1500_.jpg",
    "Year": 2006,
    "Featured": false
  },
  {
    "Title": "Fight Club",
    "Director": {
      "Name": "David Fincher",
      "Bio": "David Andrew Leo Fincher is an American film director. His films, most of which are psychological thrillers, have collectively grossed over $2.1 billion worldwide and have received numerous accolades, including three nominations for the Academy Awards for Best Director.",
      "Birth": 1962,
      "Death": "N/A"
    },
    "Genre": {
      "Name": "Drama",
      "Description": "In film and television, drama is a category of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone."
    },  
    "Description": "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
    "ImageURL": "https://m.media-amazon.com/images/I/31CauYmKHlL.jpg",
    "Year": 1999,
    "Featured": false
  },
  {
    "Title": "Goodfellas",
    "Director": {
      "Name": "Martin Scorsese",
      "Bio": "Martin Charles Scorsese is an American filmmaker. He emerged as one of the major figures of the New Hollywood era. He has received many accolades, including an Academy Award, four BAFTA Awards, three Emmy Awards, a Grammy Award, and three Golden Globe Awards.",
      "Birth": 1942,
      "Death": "N/A"
    },
    "Genre": {
      "Name": "Drama",
      "Description": "In film and television, drama is a category of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone."
    },
    "Description": "The story of Henry Hill and his life in the mafia, covering his relationship with his wife Karen and his mob partners Jimmy Conway and Tommy DeVito.",
    "ImageURL": "https://m.media-amazon.com/images/I/81NuuGhiNmL._SL1500_.jpg",
    "Year": 1990,
    "Featured": false
  },
  {
    "Title": "In Bruges",
    "Director": {
      "Name": "Martin McDonagh",
      "Bio": "Martin Faranan McDonagh is a British-Irish playwright and filmmaker. He is known for his absurdist black humour which often challenges the modern theatre aesthetic.",
      "Birth": 1970,
      "Death": "N/A"
    },
    "Genre": {
      "Name": "Comedy",
      "Description": "A comedy film is a film genre that emphasizes humor. These films are designed to amuse audiences and make them laugh. Films in this genre typically have a happy ending, with dark comedy being an exception to this rule."
    },
    "Description": "After a job gone wrong, hitman Ray and his partner await orders from their ruthless boss in Bruges, Belgium, the last place in the world Ray wants to be.",
    "ImageURL": "https://m.media-amazon.com/images/I/914V9NgA8FL._SL1500_.jpg",
    "Year": 2008,
    "Featured": true
  },
  {
    "Title": "Django Unchained",
    "Director": {
      "Name": "Quentin Tarantino",
      "Bio": "Quentin Jerome Tarantino is an American film director, screenwriter, and actor. His films are characterized by stylized violence, extended dialogue often with profanity, and references to popular culture.",
      "Birth": 1963,
      "Death": "N/A"
    },
    "Genre": {
      "Name": "Drama",
      "Description": "In film and television, drama is a category of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone."
    },
    "Description": "With the help of a German bounty-hunter, a freed slave sets out to rescue his wife from a brutal plantation owner in Mississippi.",
    "ImageURL": "https://m.media-amazon.com/images/I/81IVfnsVtIL._SL1500_.jpg",
    "Year": 2012,
    "Featured": false
  },
  {
    "Title": "The Lord of the Rings",
    "Director": {
      "Name": "Peter Jackson",
      "Bio": "Sir Peter Robert Jackson ONZ KNZM is a New Zealand film director, screenwriter and producer. He is best known as the director, writer and producer of the Lord of the Rings trilogy and the Hobbit trilogy, both of which are adapted from the novels of the same name by J. R. R. Tolkien.",
      "Birth": 1961,
      "Death": "N/A"
    },
    "Genre": {
      "Name": "Action",
      "Description": "A film genre in which the protagonist or protagonists are thrust into a series of events that typically include violence, extended fighting, physical feats, rescues and frantic chases. Action films tend to feature a mostly resourceful hero struggling against incredible odds, which include life-threatening situations, a dangerous villain, or a pursuit which usually concludes in victory for the hero."
    },
    "Description": "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
    "ImageURL": "https://m.media-amazon.com/images/I/61kTo1-zgcL._SL1000_.jpg",
    "Year": 2001,
    "Featured": false
  },
  {
    "Title": "Miracle",
    "Director": {
      "Name": "Gavin O'Connor",
      "Bio": "Gavin O'Connor is an American film director, screenwriter, producer, playwright, and actor. He is best known for directing the films Miracle, Warrior, The Accountant, and The Way Back.",
      "Birth": 1963,
      "Death": "N/A"
    },
    "Genre": {
      "Name": "Drama",
      "Description": "In film and television, drama is a category of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone."
    },
    "Description": "The true story of Herb Brooks, the player-turned-coach who led the 1980 U.S. Olympic hockey team to victory over the seemingly invincible Soviet squad.",
    "ImageURL": "https://m.media-amazon.com/images/I/71PrNZ7sRAS._SL1500_.jpg",
    "Year": 2004,
    "Featured": false
  },
  {
    "Title": "Dune: Part Two",
    "Director": {
      "Name": "Denis Villeneuve",
      "Bio": "Denis Villeneuve OC CQ RCA is a Canadian filmmaker. He has received seven Canadian Screen Awards as well as nominations for three Academy Awards, five BAFTA Awards, and two Golden Globe Awards. Villeneuve's films have grossed over $1.8 billion worldwide.",
      "Birth": 1967,
      "Death": "N/A"
    },
    "Genre": {
      "Name": "Action",
      "Description": "A film genre in which the protagonist or protagonists are thrust into a series of events that typically include violence, extended fighting, physical feats, rescues and frantic chases. Action films tend to feature a mostly resourceful hero struggling against incredible odds, which include life-threatening situations, a dangerous villain, or a pursuit which usually concludes in victory for the hero."
    },
    "Description": "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    "ImageURL": "https://m.media-amazon.com/images/I/61tJY4EWDpL._SL1500_.jpg",
    "Year": 2024,
    "Featured": false
  },
  {
    "Title": "Top Gun: Maverick",
    "Director": {
      "Name": "Joseph Kosinski",
      "Bio": "Joseph Kosinski is an American film director, best known for his computer graphics and computer-generated imagery work, and for his work in action films. He has directed the films Tron: Legacy, Oblivion, Only the Brave, Top Gun: Maverick and Spiderhead.",
      "Birth": 1974,
      "Death": "N/A"
    },
    "Genre": {
      "Name": "Action",
      "Description": "A film genre in which the protagonist or protagonists are thrust into a series of events that typically include violence, extended fighting, physical feats, rescues and frantic chases. Action films tend to feature a mostly resourceful hero struggling against incredible odds, which include life-threatening situations, a dangerous villain, or a pursuit which usually concludes in victory for the hero."
    },
    "Description": "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it.",
    "ImageURL": "https://m.media-amazon.com/images/I/81aJwkgPAwL._SL1500_.jpg",
    "Year": 2022,
    "Featured": true
  }
]

// Express static function
app.use(express.static('public'));

// Middleware
app.use(morgan('common'));

// GET requests
app.get('/movies', (req, res) => {
  res.json(movies);
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

// Create
app.post('/users', (req, res) => {
  const newUser = req.body;
  
  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send('users need names')
  }
})

app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;
  
  let user = users.find( user => user.id == id );

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);;
  } else {
    res.status(400).send('no such user')
  }
})

// Add a user
/* We'll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', async (req, res) => {
  await Users.findOne({Username: req.body.Username})
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => {res.status(201).json(user)})
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })  
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Read
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
})

app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find( movie => movie.Title === title );

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('no such movie')
  }
})

app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('no such genre')
  }
})

app.get('/movies/directors/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find( movie => movie.Director.Name === directorName ).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('no such director')
  }
})

// Update
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;
  
  let user = users.find( user => user.id == id );

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('no such user')
  }
})

// Delete
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;
  
  let user = users.find( user => user.id == id );

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);;
  } else {
    res.status(400).send('no such user')
  }
})

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  
  let user = users.find( user => user.id == id );

  if (user) {
    users = users.filter( user => user.id != id);
    res.status(200).send(`user ${id} has beed deleted`);
  } else {
    res.status(400).send('no such user')
  }
})

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});