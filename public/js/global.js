$(function() {

  var instaSL = {};

  var latitude,
      longitude;

  var srcLocations   = $("#tpl-locations").html(),
      tplLocations = Handlebars.compile(srcLocations);

  var srcDepartures   = $("#tpl-departures").html(),
      tplDepartures = Handlebars.compile(srcDepartures);


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
    getStations(latitude, longitude)
  }

  function getStations(latitude, longitude) {
    $.getJSON( '/getStations?latitude=' + latitude + '&longitude=' + longitude , function( data ) {
      var locations =  data.data;
      $('.locations').append(tplLocations({locations:locations}))
    });
  }

  $('body').delegate('.locations .link-button','click', function(){
    var siteID = $(this).attr('data-siteID');
    getDepartures(siteID);
  });

  $('body').delegate('.tabs a','click', function(e){
    e.preventDefault();
    $('.tabs a').attr('class', '');
    $(this).attr('class', 'active');
    var tabID = $(this).attr('id');
    showTrafficTypeTab(tabID);
  });

  $('body').delegate('.departures .link-button','click', function(){
    $(this).parent().toggleClass('list-unfolded');
    if ($(this).parent().hasClass('list-unfolded')) {
      $('html, body').animate({
          scrollTop: $(this).parent().offset().top
      }, 200);
    }

  });


  $(window).bind('hashchange', function() {
    if (window.location.hash.substr(1) == "") {
      $('.wrapper').attr('class', 'wrapper locations');
    }
  });


  function getDepartures(siteID) {
    $.getJSON( '/getDepartures?siteID=' + siteID, function( data ) {

      var data = (data.data),
          str = window.location.hash.substr(1),
          res = str.split('?'),
          station = res[0],
          BusGroups = data.BusGroups,
          MetroBlueGroups = data.MetroBlueGroups,
          MetroGreenGroups = data.MetroGreenGroups,
          MetroRedGroups = data.MetroRedGroups,
          TrainGroups = data.TrainGroups,
          departures = {};

      function groupDepartureDataByLineAndDestination(transportGroups, type) {

        var obj = {},
            resultArray = [];
            departures[type]= [];

        for (var k = 0; k < transportGroups.length; k++) {

          obj = {};

          for (var i = 0; i < transportGroups[k].Departures.length; i++) {
            var key = transportGroups[k].Departures[i].LineNumber+transportGroups[k].Departures[i].Destination;
            if (obj[key]) {
              obj[key].push(transportGroups[k].Departures[i]);
            } else {
              obj[key] = [];
              obj[key].push(transportGroups[k].Departures[i]);
            }
          }
          resultArray = [];
          $.each(obj, function(index, value) {
            resultArray.push(value);
          });
          departures[type][k] = resultArray;
        }
      }

      groupDepartureDataByLineAndDestination(BusGroups, 'BusGroups');
      groupDepartureDataByLineAndDestination(MetroBlueGroups, 'MetroBlueGroups');
      groupDepartureDataByLineAndDestination(MetroGreenGroups, 'MetroGreenGroups');
      groupDepartureDataByLineAndDestination(MetroRedGroups, 'MetroRedGroups');
      groupDepartureDataByLineAndDestination(TrainGroups, 'TrainGroups');

      $('.departures > .template-wrapper').html('').append(tplDepartures({departures:departures}))
      $('.wrapper').attr('class', 'wrapper departures');
      $('.page.departures > h2').html(station);

      showTrafficTypeTab('first-Tab');

    });

  }

  function showTrafficTypeTab(tabID) {

    var tabContentID = 'tab-content-' + tabID.substr(4);

    $('.tabs-content > li').not('.back').attr('class', 'is-hidden');
    $('.tabs-content > #' + tabContentID).attr('class', 'is-shown');

    if (tabID === 'first-Tab') {
      $('.tabs > li:first-child  > a').attr('class', 'active');
      $('.tabs-content > li:first-child').attr('class', 'is-shown');
    }
  }

});
