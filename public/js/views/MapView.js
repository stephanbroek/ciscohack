//Filename: MapView.js
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/MapTemplate.html',
    'libs/jscoord-1.1.1',
    'L'
], function($, _, Backbone, MapTemplate,jscoord,L) {


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
