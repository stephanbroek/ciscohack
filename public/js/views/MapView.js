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

    var MapView = Backbone.View.extend({

        initialize: function (options) {

        },
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
            var osStart = new OSRef(result[0].StartGrid.substring(0,6),result[0].StartGrid.substring(6,12));
            var latlonStart = osStart.toLatLng();
            
            //Create a map

            var map = L.map(this.$('#map')[0]).setView([latlonStart.lat, latlonStart.lng], 10);

            // add an OpenStreetMap tile layer
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);


            //for each result in the array, add a start lat and start lon field then plot it on the map
            
            for (var i = 0; i < result.length -1; i++) {
                

                //Convert os grid reference to lat lon
                var osGridStart = result[i].StartGrid;
                var osGridEnd = result[i].EndGrid;
                var osReferenceStart = new OSRef(osGridStart.substring(0, 6), osGridStart.substring(6, 12));
                var osReferenceEnd = new OSRef(osGridEnd.substring(0, 6), osGridEnd.substring(6, 12));

                //console.log(osReferenceStart);
                //console.log(osReferenceEnd);

                var latLonObjectStart = osReferenceStart.toLatLng();
                var latLonObjectEnd = osReferenceEnd.toLatLng();
                
                //console.log(latLonObjectStart);
                //console.log(latLonObjectEnd);

                //display on map
                L.circle([latLonObjectStart.lat, latLonObjectStart.lng], 5).addTo(map);
                L.circle([latLonObjectEnd.lat, latLonObjectEnd.lng], 5).addTo(map);
                

            }

           

        },

        displayStationsMap: function() {

            //Leaflet map
            var map = L.map(this.$('#stationsMap')[0]).setView([53.4722454,-2.2235922], 11);

            // add an OpenStreetMap tile layer
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            var stationsLayer = new L.LayerGroup();

            $.get('/api/stationInfo',function(stationsString) {

                var stations = JSON.parse(stationsString);
                console.log(stations);

                $.each(stations,function(key,station) {
                    console.log(station.name);
                    //Append threshold
                    $("#"+station.name+"Threshold").html(station.threshold);

                    L.circle([station.latitude, station.longitude],300,{className:station.name+" station"}).addTo(stationsLayer);

                })

                var overlays = {
                    "Stations": stationsLayer
                };

                L.control.layers(overlays).addTo(map);


            });
            
        },

        getData: function(faye_client) {

            var subscription = faye_client.subscribe('/data',function(message) {
                console.log(message);

                //Update paragraphs
                $("#picadillyPara").html(message.stations[0].people);
                $("#victoriaPara").html(message.stations[1].people);
                $("#oxfordRoadPara").html(message.stations[2].people);
                $("#stockportPara").html(message.stations[3].people);
                $("#boltonPara").html(message.stations[4].people);

                //Calculate percentages
                var picadillyCapacity = (message.stations[0].people / parseInt($("#ManchesterPicadillyThreshold").html())) * 100;
                var victoriaCapacity = (message.stations[1].people / parseInt($("#ManchesterVictoriaThreshold").html())) * 100;
                var oxfordRoadCapacity = (message.stations[2].people / parseInt($("#ManchesterOxfordRoadThreshold").html())) * 100;
                var stockportCapacity = (message.stations[3].people / parseInt($("#StockportThreshold").html())) * 100;
                var boltonCapacity = (message.stations[4].people / parseInt($("#BoltonThreshold").html())) * 100;


                $("#picadillyPercent").html(String(picadillyCapacity)+"%");
                $("#victoriaPercent").html(String(victoriaCapacity)+"%");
                $("#oxfordRoadPercent").html(String(oxfordRoadCapacity)+"%");
                $("#stockportPercent").html(String(stockportCapacity)+"%");
                $("#boltonPercent").html(String(boltonCapacity)+"%");




            });
        }
    });

    return MapView;
});
