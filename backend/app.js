require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/admin/login');
const adminHomeRouter = require('./routes/admin/home');
const adminActorsRouter = require('./routes/admin/actors');
const adminBlogRouter = require('./routes/admin/blog');
const adminPlaysRouter = require('./routes/admin/plays');
const adminUsersRouter = require('./routes/admin/users');

const app = express();
const session = require('express-session');
const hbs = require('hbs');

const cors = require('cors');
const apiRouter = require('./routes/api');
app.use('/api', cors(), apiRouter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    cookie: { secure: !true },
    resave: true,
    saveUninitialized: true,
    secret: 'fd34s@!@dfa453f3DF#$D&W',
  })
);
app.use(express.static(path.join(__dirname, 'public')));

secured = async (req, res, next) => {
  try {
    if (req.session.userId) {
      next();
    } else {
      res.redirect('/admin/login');
    }
  } catch (error) {
    console.log(error);
  }
};

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin/login', loginRouter);
app.use('/admin/home', secured, adminHomeRouter);
app.use('/admin/actors', secured, adminActorsRouter);
app.use('/admin/blog', secured, adminBlogRouter);
app.use('/admin/plays', secured, adminPlaysRouter);
app.use('/admin/users', secured, adminUsersRouter);

app.use('/public', express.static('./public/'));

// Handlebars custom helpers
hbs.registerHelper('when', function (operand_1, operator, operand_2, options) {
  var operators = {
      eq: function (l, r) {
        return l == r;
      },
      noteq: function (l, r) {
        return l != r;
      },
      gt: function (l, r) {
        return Number(l) > Number(r);
      },
      or: function (l, r) {
        return l || r;
      },
      and: function (l, r) {
        return l && r;
      },
      '%': function (l, r) {
        return l % r === 0;
      },
    },
    result = operators[operator](operand_1, operand_2);

  if (result) return options.fn(this);
  else return options.inverse(this);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
