var express = require('express');
var app = express();

// Use the mongoose (http://mongoosejs.com) mongodb interface library.
var mongoose = require('mongoose');
// Connect to the 'pasdbserv' database on the local mmongo server.
mongoose.connect('mongodb://localhost/pasdbserv');

// Render web pages from the views folder using jade (http://jade-lang.com/)
app.set('views', './views')
app.set('view engine', 'jade');

// Serve files from the 'public' directory.
app.use(express.static('public'));

var listingSchema = mongoose.Schema({
  song: String,
  artist: String,
  usessong: String,
  usesartist: String
});
var Listing = mongoose.model('Listing', listingSchema);

// Serve the 'index' view (views/index.jade) at / with some properties.
app.get('/', function (req, res) {
  // If the user is looking for a song:
  if (req.query.a && req.query.s) {
    Listing.find({ artist: req.query.a, song: req.query.s }, function (err, listings) {
      if (err) {
        res.render('index', { artist: req.query.a, song: req.query.s, message: 'Database Error!' });
        return console.log(err);
      }
      if (listings.length) {
        res.render('index', { artist: req.query.a,
                              song: req.query.s,
                              listings: listings,
                              add: true });
      } else res.render('index', { artist: req.query.a,
                                   song: req.query.s,
                                   message: 'No Information',
                                   add: true });
    });
  // If the user is just loading up the homepage:
  } else if (req.query.a || req.query.s)
    res.redirect('/')
  else res.render('index', {});
});

var pageurl = function (artist, song) {
  return '/?a=' + encodeURIComponent(artist) + '&s=' + encodeURIComponent(song)
};

app.get('/n', function (req, res) {
  if (req.query.a && req.query.s && req.query.sa && req.query.ss) {
    var newlisting = new Listing({ artist: req.query.a, song: req.query.s, usesartist: req.query.sa, usessong: req.query.ss });
    newlisting.save(function (err, newlisting) {
      res.redirect(pageurl(req.query.a, req.query.s));
      if (err) return console.log(err);
    });
  } else if (req.query.a && req.query.s) res.redirect(pageurl(req.query.a, req.query.s));
  else res.redirect('/');
});

// Serve on port 3000!
app.listen(3000, function () {
  console.log('PASDB Serving on port 3000.');
});
