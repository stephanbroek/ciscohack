// HomePage.js
define([
	'jquery',
	'underscore',
	'backbone',
    'views/NavView',
    'views/HomeView',
    'views/FooterView',
    'views/MapView'
], function($, _, Backbone, NavView, HomeView, FooterView, MapView) {

	 var HomePage = Backbone.View.extend({

        initialize: function(options) {

            this.router = options.router;

            this.navView = new NavView();

            this.homeView = new HomeView({
                router: this.router
            });

            this.mapView = new MapView();

            this.footerView = new FooterView();
        },
	 	render: function() {

            this.$el.empty();

            this.navView.render();
            this.homeView.render();
            this.mapView.render();
            this.footerView.render();

            this.$el.append(this.navView.$el);
            this.$el.append(this.homeView.$el);
            this.$el.append(this.mapView.$el);
            this.$el.append(this.footerView.$el);

        }
	 });

	 return HomePage;
});