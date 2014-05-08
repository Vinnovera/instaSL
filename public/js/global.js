$(function() {

  var latitude,
      longitude;

  var srcLocations   = $("#tpl-locations").html();
  var tplLocations = Handlebars.compile(srcLocations);

  var srcDepartures   = $("#tpl-departures").html();
  var tplDepartures = Handlebars.compile(srcDepartures);

  getLocation();

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
      }
    else {alert('Could not resolve your position')}
  }

  function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    $('.latitude').append(latitude);
    $('.longitude').append(longitude);
    getStations(latitude, longitude)
   }

  function getStations(latitude, longitude) {
    $.getJSON( '/getStations?latitude=' + latitude + '&longitude=' + longitude , function( data ) {

      var locations =  data.stationsinzoneresult.location;
      $('body').append(tplLocations({locations:locations}))
      console.log(locations);
    });
  }

  $('body').delegate('.link','click', function(event){
    event.preventDefault();
    var stationName = $(this).attr('data-name');
    stationName = stationName.replace(/ /g, '');
    getSiteID(stationName);
  });

  function getSiteID(stationName) {
    $.getJSON( '/getSiteID?stationName=' + stationName, function( data ) {
      var siteID = (data.Hafas.Sites.Site.Number) ? data.Hafas.Sites.Site.Number : data.Hafas.Sites.Site[0].Number;
      console.log(siteID);
      getDepartures(siteID);
    });
  }

  function getDepartures(siteID) {
    $.getJSON( '/getDepartures?siteID=' + siteID, function( data ) {
    var departures = (data);
    $('body').append(tplDepartures({departures:departures}))
    });
  }



});
