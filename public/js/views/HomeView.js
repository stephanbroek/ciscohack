//Filename: HomeView.js
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/HomeTemplate.html'
], function($, _, Backbone, HomeTemplate) {

    var HomeView = Backbone.View.extend({

        initialize: function(options) {
            this.router = options.router;
        },
        render: function() {

            var template = _.template(HomeTemplate);
            this.$el.html(template);
        }
    });

    return HomeView;
});
