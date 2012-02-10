var fs = require('fs');
var express = require('express');
var app = express.createServer();
var pubdir = __dirname + '/../client/public';

app.use(express.static(pubdir));
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

app.get('/', function(req, res){
  var file = fs.readFile(pubdir + '/index.html', 'utf8', function(err, data) {
    if (err) throw err;
    res.send(data);
  });
});

app.get('/callback', function(req, res){
  var file = fs.readFile(pubdir + '/callback.html', 'utf8', function(err, data) {
    if (err) throw err;
    res.send(data);
  });
});

app.listen(3000);