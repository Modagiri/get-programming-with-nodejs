'use strict';

const express = require('express'),
  layouts = require('express-ejs-layouts'),
  app = express(),

  homeController = require('./controllers/homeController'),
  errorController = require('./controllers/errorController'),
  subscribersController = require('./controllers/subscribersController'),

  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),

  Subscriber = require('./models/subscriber');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/recipe_db');
var db = mongoose.connection;

// TODO: Have a separate module seed.js and move this code there!
// You can include all the dummy data in seed.js and initialize the database using the seed module.
// let subscriber1  = new Subscriber({name: "Jon Wexler", email: "jon@jonwexler.com"});
// subscriber1.save((error, savedDocument, next) =>{
//   if (error) next(error);
//   console.log(savedDocument);
// });

var myQuery = Subscriber.findOne({
  name: "Jon Wexler"
}).where('email', /wexler/);
myQuery.exec((error, data) => {
  if (data) console.log(data.name);
});

db.once('open', () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

app.set('port', process.env.PORT || 3000);

app.set('view engine', 'ejs');
app.use(layouts);
app.use(express.static('public'));

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/subscribers', subscribersController.getAllSubscribers);
app.get('/subscribe', subscribersController.getSubscriptionPage);
app.post('/subscribe', subscribersController.saveSubscriber);

app.get('/courses', homeController.showCourses);
app.get('/contact', homeController.showSignUp);
app.post('/contact', homeController.postedContactForm);

// Error middleware
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get('port'), () => {
  console.log(`Server running at http://localhost:${app.get('port')}`);
});
