const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
const multer = require('multer');

const connectDB = require('./config/db');
const { storage } = require('./config/gridFs'); 


connectDB();


const app = express();





app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const managerecording = require('./routes/recordingRoutes');

const getMedia = require('./routes/getMedia');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

app.use('//', indexRouter);
app.use('/', getMedia);
app.use('/', usersRouter);
app.use('/', managerecording);


app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
