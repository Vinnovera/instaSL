var express = require('express');
var restify = require('restify');
var app = express();

app.get('/getStations', function(req, res){
  console.log(req.query);
  var client = restify.createClient({
    url: 'https://api.trafiklab.se'
  });

  var apiKey = 'LZXeu5VNy0YBTv7q8NrGTLHLtCYDM83s',
      longitude = req.query.longitude,
      latitude = req.query.latitude,
      radius = '500';

  client.get('/samtrafiken/resrobot/StationsInZone.json?apiVersion=2.1&centerX=' + longitude + '&centerY=' + latitude + '&radius=' + radius + '&coordSys=WGS84&key=' + apiKey, function(err, req) {
    req.on('result', function(err, result) {
      result.body = '';
      result.setEncoding('utf8');
      result.on('data', function(chunk) {
        result.body += chunk;
      });

      result.on('end', function() {
        res.setHeader('Content-Type', 'text/json');
        res.setHeader('Content-Length', Buffer.byteLength(result.body));
        res.end(result.body);
      });
    });
  });
});

app.get('/getSiteID', function(req, res){
  console.log(req.query);
  var client = restify.createClient({
    url: 'https://api.trafiklab.se'
  });

  var apiKey = 'EugaETfMxy7JK3T6jF0sTnykdXgjyxs3',
      stationName = req.query.stationName;

  client.get('/sl/realtid/GetSite.json?stationSearch=' + stationName +  '&key=' + apiKey, function(err, req) {
    req.on('result', function(err, result) {
      result.body = '';
      result.setEncoding('utf8');
      result.on('data', function(chunk) {
        result.body += chunk;
      });

      result.on('end', function() {
        res.setHeader('Content-Type', 'text/json');
        res.setHeader('Content-Length', Buffer.byteLength(result.body));
        res.end(result.body);
      });
    });
  });
});

app.get('/getDepartures', function(req, res){
  console.log(req.query);
  var client = restify.createClient({
    url: 'https://api.trafiklab.se'
  });

  var apiKey = 'LWvXyziJkylToRTrlj7nA9YQgx8ZOuSH',
      siteID = req.query.siteID;

  client.get('/sl/realtid2/GetAllDepartureTypes.json/' + siteID +'/30?key=' + apiKey, function(err, req) {
    req.on('result', function(err, result) {
      result.body = '';
      result.setEncoding('utf8');
      result.on('data', function(chunk) {
        result.body += chunk;
      });

      result.on('end', function() {
        res.setHeader('Content-Type', 'text/json');
        res.setHeader('Content-Length', Buffer.byteLength(result.body));
        res.end(result.body);
      });
    });
  });
});



app.use(express.static(__dirname + '/public'));

app.listen(3000);
console.log('Listening on port 3000');