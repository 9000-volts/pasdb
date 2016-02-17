var express = require('express');
var app = express();

// Use the mongoose (http://mongoosejs.com) mongodb interface library.
var mongoose = require('mongoose');
// Connect to the 'pasdbserv' database on the local mmongo server.
mongoose.connect('mongodb://localhost/pasdbserv');

// Render web pages from the views folder using jade (http://jade-lang.com/)
app.set('views', './views')
app.set('view engine', 'jade');

// Serve the 'index' view (views/index.jade) at / with some properties.
app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!'});
});


// !!! DATABASE TEST CODE - IGNORE! !!!
// This code was thrown in to test out the database, and I am leaving it in
// temporarily as a demo/reference as we work on the project.

// Make a mongo for 'Foo's in the database.
var fooSchema = mongoose.Schema({
  name: String,
  message: String
});
var Foo = mongoose.model('Foo', fooSchema);

app.get('/foo/:name', function (req, res) {
  Foo.find({ name: req.params.name }, function (err, foos) {
    if (err) return console.log(err);
    if (foos.length) res.render('index', { title: foos[0].title, message: foos[0].message });
    else res.render('index', { title: 'NO SUCH FOO', message: 'NO SUCH FOO' });
  });
});

app.get('/foo/:name/:message', function (req, res) {
  var newfoo = new Foo({ name: req.params.name, message: req.params.message });
  newfoo.save(function (err, newfoo) {
    if (err) return console.log(err);
    res.send();
  });
});
// !!! END DATABASE TEST CODE !!!

// Serve on port 3000!
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
