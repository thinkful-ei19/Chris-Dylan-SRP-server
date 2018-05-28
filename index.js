'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport')

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');
const User = require('./models/user')

const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');
const jwt = require('jsonwebtoken');

const app = express();

const usersRouter = require('./routes/users.route')
const authRouter = require('./routes/auth')

app.use(express.json())

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.use('/api', usersRouter);
app.use('/api', authRouter);

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use(passport.authenticate('jwt', {session: false, failWithError: true}));

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
