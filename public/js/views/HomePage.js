// HomePage.js
define([
	'jquery',
	'underscore',
	'backbone',
    'views/NavView',
    'views/HomeView',
    'views/FooterView'
], function($, _, Backbone, NavView, HomeView, FooterView) {

	 var HomePage = Backbone.View.extend({

        initialize: function(options) {

            this.router = options.router;

            this.navView = new NavView();

            this.homeView = new HomeView({
                router: this.router
            });

            this.footerView = new FooterView();
        },
	 	render: function() {

            this.$el.empty();

            this.navView.render();
            this.homeView.render();
            this.footerView.render();

            this.$el.append(this.navView.$el);
            this.$el.append(this.homeView.$el);
            this.$el.append(this.footerView.$el);
        }
	 });

	 return HomePage;
});