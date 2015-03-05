//Filename: MapView.js
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/MapTemplate.html',
    'libs/jscoord-1.1.1',
    'L'
], function ($, _, Backbone, MapTemplate, jscoord, L) {

    var MapView = Backbone.View.extend({

        initialize: function (options) {

        },
        render: function () {

            var template = _.template(MapTemplate);

            this.$el.html(template);
            this.getData();
        },
        getData: function () {

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
            console.log(result);

            //Convert start point to lat lon to centre map
            var osStart = new OSRef(result[0].StartGrid.substring(0,6),result[0].StartGrid.substring(6,12));
            var latlonStart = osStart.toLatLng();
            console.log(latlonStart);

            //Create a map

            var map = L.map(this.$('#map')[0]).setView([latlonStart.lat, latlonStart.lng], 11);

            // add an OpenStreetMap tile layer
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);


            //for each result in the array, add a start lat and start lon field then plot it on the map
            for (var i = 0; i < result.length; i++) {

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
                L.marker([latLonObjectStart.lat,latLonObjectStart.lng]).addTo(map)
                    .bindPopup("Start")
                L.marker([latLonObjectEnd.lat,latLonObjectEnd.lng]).addTo(map)
                    .bindPopup("End");

            }

           

        }
    });

    return MapView;
});
