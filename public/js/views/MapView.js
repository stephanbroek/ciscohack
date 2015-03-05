//Filename: MapView.js
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/MapTemplate.html'
], function($, _, Backbone, MapTemplate) {

    var MapView = Backbone.View.extend({

        initialize: function(options) {

        },
        render: function() {

            var template = _.template(MapTemplate);
            this.$el.html(template);
        }
    });

    return MapView;
});
