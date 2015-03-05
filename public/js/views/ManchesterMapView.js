//Filename: ManchesterMapView.js
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/ManchesterMapTemplate.html',
    'd3'
], function ($, _, Backbone, ManchesterMapTemplate, d3) {

    var ManchesterMapView = Backbone.View.extend({

        render: function () {

            var template = _.template(ManchesterMapTemplate);
            this.$el.html(template);
            this.drawMap();
        },
        drawMap: function () {

            //Width and height
            var w = 800;
            var h = 600;

            //Define map projection
            var projection = d3.geo.mercator()
                .translate([w / 2, h / 2])
                .scale([100]);

            //Define path generator
            var path = d3.geo.path()
                .projection(projection);

            //Create SVG element
            var svg = d3.select(this.$('.map-body')[0])
                .append("svg")
                .attr("width", w)
                .attr("height", h);

            //Load in GeoJSON data
            d3.json("./data/oceans.json", function (json) {

                //Bind data and create one path per GeoJSON feature
                svg.selectAll("path")
                    .data(json.features)
                    .enter()
                    .append("path")
                    .attr("d", path)
                    .style("fill", "steelblue");

            });
        }
    });

    return ManchesterMapView;
});
