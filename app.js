var express = require('express');
var restify = require('restify');
var app = express();

app.get('/getStations', function(req, res){
  console.log(req.query);
  var client = restify.createClient({
    url: 'http://sl.se'
  });

/*  var
      longitude = req.query.longitude,
      latitude = req.query.latitude;*/


  /* Spoof Liljeholmen */
/*  var
      longitude = 18.024284,
      latitude = 59.310549;*/

    /* Spoof T-centralen */
/*    var
      longitude = 18.059467,
      latitude = 59.331967;*/

    /* Spoof Slussen */
     var
        longitude = 18.072896,
        latitude = 59.321324;

  client.get('http://sl.se/api/Map/FindStationByGeoLocation/' + latitude + '/' + longitude + '/10/false', function(err, req) {
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
    url: 'http://sl.se'
  });

  var siteID = req.query.siteID;

  client.get('http://sl.se/api/RealTime/GetDepartures/' + siteID, function(err, req) {
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