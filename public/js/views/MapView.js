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

    var MapView = Backbone.View.extend({

        render: function () {

            var client = new Faye.Client('http://localhost:3000/faye');

            var template = _.template(MapTemplate);

            this.$el.html(template);
            this.getCSVData();
            this.displayStationsMap();
            this.getData(client);
        },
        getCSVData: function () {

            $.ajax({
                type: "GET",
                url: "data/linkDescriptions.csv",
                dataType: "text",
                success: _.bind(function (data) {
                    this.displayMap(data);
                }, this)
            });
        },
        displayMap: function (csv) {

            //convert csv to json
            var lines = csv.split("\n");

            var result = [];

            var headers = lines[0].split(",");

            for (var i = 1; i < lines.length; i++) {

                var obj = {};
                var currentline = lines[i].split(",");

                for (var j = 0; j < headers.length; j++) {
                    obj[headers[j]] = currentline[j];
                }

                result.push(obj);

            }

            //result is now an array of jsons
            //console.log(result);

            //Convert start point to lat lon to centre map
            var osStart = new OSRef(result[0].StartGrid.substring(0, 6), result[0].StartGrid.substring(6, 12));
            var latlonStart = osStart.toLatLng();

            //Create a map

            var map = L.map(this.$('#map')[0]).setView([latlonStart.lat, latlonStart.lng], 10);

            // add an OpenStreetMap tile layer
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);


            //for each result in the array, add a start lat and start lon field then plot it on the map

            for (var i = 0; i < result.length - 1; i++) {


                //Convert os grid reference to lat lon
                var osGridStart = result[i].StartGrid;
                var osGridEnd = result[i].EndGrid;
                var osReferenceStart = new OSRef(osGridStart.substring(0, 6), osGridStart.substring(6, 12));
                var osReferenceEnd = new OSRef(osGridEnd.substring(0, 6), osGridEnd.substring(6, 12));

                var latLonObjectStart = osReferenceStart.toLatLng();
                var latLonObjectEnd = osReferenceEnd.toLatLng();

                //display on map
                L.circle([latLonObjectStart.lat, latLonObjectStart.lng], 5).addTo(map);
                L.circle([latLonObjectEnd.lat, latLonObjectEnd.lng], 5).addTo(map);

            }
        },

        displayStationsMap: function () {

            //Leaflet map
            var map = L.map(this.$('#stationsMap')[0]).setView([53.4722454, -2.2235922], 11);

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

                    //Append threshold
                    $("#" + station.name + "Threshold").html(station.threshold);

                    stationThresholds.push({
                        name: station.name,
                        threshold: station.threshold
                    });

                    L.circle([station.latitude, station.longitude],500,{className:station.name+" station"}).addTo(stationsLayer);

                });

                console.log(stationThresholds);

                var overlays = {
                    "Stations": stationsLayer
                };

                L.control.layers(overlays).addTo(map);
            });

            $.get('api/carParkInfo', function(carParksString) {

                var carParks = JSON.parse(carParksString);

                carParkNames = carParks;

                $.each(carParks, function(key, carPark) {

                    $("#" + carPark.name + "Capacity").html(carPark.capacity);

                    carParkCapacities.push({
                        name: carPark.name,
                        capacity: carPark.capacity
                    });

                    L.circle([carPark.latitude, carPark.longitude], 150, {className: carPark.name}).addTo(carParksLayer);
                })

                var overlays = {
                    "Car Parks": carParksLayer
                };

                L.control.layers(overlays).addTo(map);
            });
        },

        getData: function (faye_client) {

            var subscription = faye_client.subscribe('/data', function (message) {

                //Update paragraphs
                $("#picadillyPara").html(message.stations[0].people);
                $("#victoriaPara").html(message.stations[1].people);
                $("#oxfordRoadPara").html(message.stations[2].people);
                $("#stockportPara").html(message.stations[3].people);
                $("#boltonPara").html(message.stations[4].people);

                //Calculate percentages
                var picadillyCapacity = (message.stations[0].people / ($.grep(stationThresholds, function(e){ return e.name == "ManchesterPicadilly"; }))[0].threshold) * 100;
                var victoriaCapacity = (message.stations[1].people / ($.grep(stationThresholds, function(e){ return e.name == "ManchesterVictoria"; }))[0].threshold) * 100;
                var oxfordRoadCapacity = (message.stations[2].people / ($.grep(stationThresholds, function(e){ return e.name == "ManchesterOxfordRoad"; }))[0].threshold) * 100;
                var stockportCapacity = (message.stations[3].people / ($.grep(stationThresholds, function(e){ return e.name == "Stockport"; }))[0].threshold) * 100;
                var boltonCapacity = (message.stations[4].people / ($.grep(stationThresholds, function(e){ return e.name == "Bolton"; }))[0].threshold) * 100;

                $("#picadillyPercent").html(String(picadillyCapacity)+"%");
                $("#victoriaPercent").html(String(victoriaCapacity)+"%");
                $("#oxfordRoadPercent").html(String(oxfordRoadCapacity)+"%");
                $("#stockportPercent").html(String(stockportCapacity)+"%");
                $("#boltonPercent").html(String(boltonCapacity)+"%");

                //Change colour of stations depending on capacity
                $(".ManchesterPicadilly").attr("stroke",getColour(picadillyCapacity));
                $(".ManchesterPicadilly").attr("fill",getColour(picadillyCapacity));
                $(".ManchesterOxfordRoad").attr("stroke",getColour(oxfordRoadCapacity));
                $(".ManchesterOxfordRoad").attr("fill",getColour(oxfordRoadCapacity));
                $(".ManchesterVictoria").attr("stroke",getColour(victoriaCapacity));
                $(".ManchesterVictoria").attr("fill",getColour(victoriaCapacity));
                $(".Stockport").attr("stroke",getColour(stockportCapacity));
                $(".Stockport").attr("fill",getColour(stockportCapacity));
                $(".Bolton").attr("stroke",getColour(boltonCapacity));
                $(".Bolton").attr("fill",getColour(boltonCapacity));

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

                    $("#"+carPark.name+"Para").html(spaces);

                    var capacity = ($.grep(carParkCapacities, function(e){ return e.name == carPark.name; }))[0].capacity;

                    var percentFull = (spaces / capacity) * 100;

                    $("."+carPark.name).attr("stroke",getCarParkColour(percentFull));
                    $("."+carPark.name).attr("fill",getCarParkColour(percentFull));
                });
            });
        }
    });

    return MapView;
});

//Helper function to return an rgb colour value between red and green based on percentage
function getColour(percentage) {
    if (percentage > 100) {
        percentage = 100;
    }

    var red = (255*percentage)/100
    var green = (255 * (100-percentage))/100
    var blue = 0;

    return "rgb("+Math.floor(red)+","+Math.floor(green)+","+blue+")";
}

function getCarParkColour(percentFull) {

    if(percentFull>79) {
        return "red"
    } else {
        return "blue"
    }
}
