const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

// mongoose.connect('mongodb://localhost:27017/cfDB', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(process.env.CONNECTION_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const uuid = require('uuid');
const { check, validationResult } = require('express-validator');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const cors = require('cors');
app.use(cors());

// Replacement for app.use(cors()); when you only want to allow requests from specific origins - for testing
// let allowedOrigins = ['http://localhost8080', 'http://testsite.com', 'http://myflix-movies-jp.netlify.app' '*'];

// app.use(cors({
//   origin: (origin, callback) => {
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1) { //If a specific origin isn't found on the list of allowed origins
//       let message = 'The CORS policy for this application does not allow access from origin ' + origin;
//       return callback (new Error(message ), false);
//     }
//     return callback(null, true);
//   }
// }));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

// Express static function
app.use(express.static('public'));

// Middleware
app.use(morgan('common'));

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

// CREATE
// Create a new user
app.post('/users',
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], 
  async (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({Username: req.body.Username}) // Search to see if a user woith the requested username already exists 
      .then((user) => {
        if (user) { //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
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

// READ
// Get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Get movie by title
app.get('/movies/:title', passport.authenticate('jwt', {session: false}), async (req, res) => {
  const title = req.params.title;
  const movie = await Movies.findOne({ Title: title });

  if (movie) {
      res.status(200).json(movie);
  } else {
      res.status(404).send('Movie not found');
  }
});

// Get genre by name
app.get('/movies/genre/:genreName', passport.authenticate('jwt', {session: false}), async (req, res) => {
  try {
    const genreName = req.params.genreName;
    const movie = await Movies.findOne({ 'Genre.Name': genreName });

    if (movie) {
        res.status(200).json(movie.Genre);
    } else {
        res.status(404).send('No such genre found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
}
});

// Get director by name
app.get('/movies/directors/:directorName', passport.authenticate('jwt', {session: false}), async (req, res) => {
  try {
    const directorName = req.params.directorName;
    const movie = await Movies.findOne({ 'Director.Name': directorName });

    if (movie) {
        res.status(200).json(movie.Director);
    } else {
        res.status(404).send('No such director');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

// Get all users
app.get('/users', passport.authenticate('jwt', {session: false}), async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:Username', passport.authenticate('jwt', {session: false}), async (req, res) => {
  await Users.findOne({Username: req.params.Username})
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// UPDATE
// Update username
app.put(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  [
    check('Username', 'Username must have length of 5 characters').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password must have length of 5 characters').isLength({ min: 5 }),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  async (req, res) => {
    try {
      // check the validation object for errors
      let errors = validationResult(req);

      // if (!errors.isEmpty()) {
      //   return res.status(422).json({ errors: errors.array() });
      // }
      // CONDITION TO CHECK ADDED HERE
      if (req.user.Username !== req.params.Username) {
        return res.status(400).send('Permission denied');
      }
      // CONDITION ENDS

      // Hash the new password if provided
      // let updatedData = {
      //   Username: req.body.Username,
      //   Email: req.body.Email,
      //   Birthday: req.body.Birthday,
      // };

      if (req.body.Password) {
        req.body.Password = await Users.hashPassword(req.body.Password);
      }

      const updatedUser = await Users.findOneAndUpdate(
        { Username: req.params.Username },
        { $set: req.body },
        { new: true } // This line makes sure that the updated document is returned
      );
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        console.error(err);
        res.status(404).send('Error: ' + err);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error: ' + err.message);
    }
  }
);

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), async (req, res) => {
  await Users.findOneAndUpdate({Username: req.params.Username}, {
    $push: {FavoriteMovies: req.params.MovieID}
  },
  {new: true}) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error ' + err);
  });
});

// DELETE
// Delete a movie from a user's list of favorites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), async (req, res) => {
  await Users.findOneAndUpdate({Username: req.params.Username}, {
    $pull: {FavoriteMovies: req.params.MovieID}
  },
  {new: true}) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error ' + err);
  });
});

// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', {session: false}), async (req, res) => {
  await Users.findOneAndDelete({Username: req.params.Username})
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});