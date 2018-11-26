var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');

var routes = require('./routes/index');
var users = require('./routes/users');
var flights = require('./routes/flights');
var locations = require('./routes/locations');
var airports = require('./routes/airport')
var persons = require('./routes/persons')
var pessengers = require('./routes/pessengers')
var employees = require('./routes/employees')
var addresses = require('./routes/addresses')
var manufacturer_names = require('./routes/manufacturer_names')
var seating = require('./routes/seating');
var seatingtype = require('./routes/seatingtype');
var pricing = require('./routes/pricing');
var airplane = require('./routes/airplane');
var ticketing = require('./routes/ticketing');
var queries = require('./routes/queries');

var app = express();
var hbs = exphbs.create({
  defaultLayout: 'main' 
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/flights', flights)
app.use('/locations', locations)
app.use('/airports', airports)
app.use('/persons', persons)
app.use('/pessengers', pessengers)
app.use('/employees', employees)
app.use('/addresses', addresses)
app.use('/manufacturer_names', manufacturer_names)
app.use('/seating', seating)
app.use('/seatingtype', seatingtype)
app.use('/pricing', pricing)
app.use('/airplane', airplane)
app.use('/ticketing', ticketing)
app.use('/queries', queries)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
