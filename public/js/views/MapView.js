//Filename: MapView.js

define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/MapTemplate.html',
  'libs/jscoord-1.1.1',
  'libs/csonv',
  'L'
], function ($, _, Backbone, MapTemplate, jscoord, csv, L) {

  var carParkNames;
  var carParkCapacities = [];
  var stationThresholds = [];

  var map;

  var MapView = Backbone.View.extend({

    render: function () {

      var client = new Faye.Client('http://localhost:3000/faye');

      var template = _.template(MapTemplate);

      this.$el.html(template);
      this.displayStationsMap();
      this.getData(client);
      setTimeout(function() {
        window.dispatchEvent(new Event('resize'));
      }, 1000);
    },
    displayStationsMap: function () {

      //Leaflet map
      map = L.map(this.$('#stationsMap')[0]).setView([53.4722454, -2.2235922], 13);

      // add an OpenStreetMap tile layer
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      var stationsLayer = new L.LayerGroup();
      var carParksLayer = new L.LayerGroup();

      $.get('/api/stationInfo', function (stationsString) {

        var stations = JSON.parse(stationsString);
        //console.log(stations);

        $.each(stations, function (key, station) {

          stationThresholds.push({
            name: station.name,
            threshold: station.threshold
          });

          L.circle([station.latitude, station.longitude],500,{className:station.name+" station"}).addTo(stationsLayer);

        });

        var overlays = {
          "Stations": stationsLayer
        };

        L.control.layers({}, overlays).addTo(map);
      });

      $.get('api/carParkInfo', function(carParksString) {

        var carParks = JSON.parse(carParksString);

        carParkNames = carParks;

        $.each(carParks, function(key, carPark) {

          carParkCapacities.push({
            name: carPark.name,
            capacity: carPark.capacity
          });

          L.circle([carPark.latitude, carPark.longitude], 150, {className: carPark.name}).addTo(carParksLayer);
        });

        var overlays = {
          "Car Parks": carParksLayer
        };

        L.control.layers({}, overlays).addTo(map);
      });
    },

    getData: function (faye_client) {

      var subscription = faye_client.subscribe('/data', function (message) {

        //Calculate percentages
        var picadillyCapacity = (message.stations[0].people / ($.grep(stationThresholds, function(e){ return e.name == "ManchesterPicadilly"; }))[0].threshold) * 100;
        var victoriaCapacity = (message.stations[1].people / ($.grep(stationThresholds, function(e){ return e.name == "ManchesterVictoria"; }))[0].threshold) * 100;
        var oxfordRoadCapacity = (message.stations[2].people / ($.grep(stationThresholds, function(e){ return e.name == "ManchesterOxfordRoad"; }))[0].threshold) * 100;
        var stockportCapacity = (message.stations[3].people / ($.grep(stationThresholds, function(e){ return e.name == "Stockport"; }))[0].threshold) * 100;
        var boltonCapacity = (message.stations[4].people / ($.grep(stationThresholds, function(e){ return e.name == "Bolton"; }))[0].threshold) * 100;

        //Change colour of stations depending on capacity
        $(".ManchesterPicadilly").attr("stroke",getColour([255, 0, 0], [0, 255, 0], picadillyCapacity));
        $(".ManchesterPicadilly").attr("fill",getColour([255, 0, 0], [0, 255, 0], picadillyCapacity));
        $(".ManchesterOxfordRoad").attr("stroke",getColour([255, 0, 0], [0, 255, 0], oxfordRoadCapacity));
        $(".ManchesterOxfordRoad").attr("fill",getColour([255, 0, 0], [0, 255, 0], oxfordRoadCapacity));
        $(".ManchesterVictoria").attr("stroke",getColour([255, 0, 0], [0, 255, 0], victoriaCapacity));
        $(".ManchesterVictoria").attr("fill",getColour([255, 0, 0], [0, 255, 0], victoriaCapacity));
        $(".Stockport").attr("stroke",getColour([255, 0, 0], [0, 255, 0], stockportCapacity));
        $(".Stockport").attr("fill",getColour([255, 0, 0], [0, 255, 0], stockportCapacity));
        $(".Bolton").attr("stroke",getColour([255, 0, 0], [0, 255, 0], boltonCapacity));
        $(".Bolton").attr("fill",getColour([255, 0, 0], [0, 255, 0], boltonCapacity));

        //Update busiest stations
        $("#busiestStations").empty();

        //Sort capacities in order of decreasing value
        //Then append spans for each one
        var capacitiesArray=[], capacities = {"Picadilly":picadillyCapacity, "Victoria":victoriaCapacity, "OxfordRoad":oxfordRoadCapacity,
          "Stockport":stockportCapacity, "Bolton":boltonCapacity};
        for(capacity in capacities){
          capacitiesArray.push([capacity,capacities[capacity]])
        }
        capacitiesArray.sort(function(a,b){return a[1] - b[1]});
        capacitiesArray.reverse();

        for (var i=0; i<capacitiesArray.length; i++) {
          //append a span
          $("#busiestStations").append("<span>"+capacitiesArray[i][0]+": "+capacitiesArray[i][1]+"%</span><br>");

        }

        // Update the car park circles
        $.each(carParkNames, function(key, carPark) {

          var spaces = message.carParks[key].spaces;

          var capacity = ($.grep(carParkCapacities, function(e){ return e.name == carPark.name; }))[0].capacity;

          var percentFull = ((1 - (spaces / capacity)) * 100);

          $("."+carPark.name).attr("stroke",getColour([147, 112, 219], [0, 255, 255], percentFull));
          $("."+carPark.name).attr("fill",getColour([147, 112, 219], [0, 255, 255], percentFull));
        });
      });
    }
  });

  return MapView;
});

function getColour(source, target, percentage) {
  if (percentage > 100)
    percentage = 100;

  var _p = percentage / 100;
  var _i_p = 1 - _p;

  var red = _i_p * source[0] + _p * target[0];
  var green = _i_p * source[1] + _p * target[1];
  var blue = _i_p * source[2] + _p * target[2];

  return "rgb(" + Math.floor(red) + "," + Math.floor(green) + "," + Math.floor(blue) + ")";
}