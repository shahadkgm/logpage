var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var usersRouter = require('./routes/users');
const nocache = require('nocache');
const { Session } = require('inspector/promises');
const session = require('express-session');

var app = express();

// app.use((req, res, next) => {
//   if (req.path === '/') {
//       res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
//   } else {
//       res.set('Cache-Control', 'private, max-age=0, no-cache');
//   }
//   next();
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
const username = "123";
const password = "123";

app.use(nocache());
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/users', usersRouter);
app.use(session({
  secret: 'your-secret-key',           // A secret key to sign the session ID cookie
  resave: false,                       // Prevents session being saved if unmodified
  saveUninitialized: true,             // Saves session even if it's new but unmodified
  cookie: { sameSite: 'strict', httpOnly: true }
}));


app.get('/', function (req, res) {
  console.log('login is done')
  res.redirect('/login')
});

app.post(`/home`, (req, res) => {

  console.log(req.body);

  if (req.body.username === username && req.body.password === password) {
    req.session.isAuthenticated = true;
    res.redirect(`home`);
  } else {
    res.render(`index`, { msg: "its not ready bro lets correct it" })
  }

  // res.send(`succsses`)
})
app.get('/home', (req, res) => {
  if (req.session.isAuthenticated) {
    res.render('home');
  } else {
    res.redirect('/login');
  }
});


app.get('/login', (req, res) => {
  if (req.session.isAuthenticated) {
    res.redirect("/home")
  } else {
    res.render("index")
  }
})


app.get('/home', (req, res) => {
  console.log(req.session); // Check the session object
  if (req.session.isAuthenticated) {
    res.render('home');
  } else {
    res.redirect('/');
  }
});
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err)
    } else {
      res.clearCookie('connect.sid', { path: '/' }); // Ensure the correct path is specified
      res.redirect('/login');
    }

  })
})





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
