// ManchesterPage.js
define([
    'jquery',
    'underscore',
    'backbone',
    'views/NavView',
    'views/ManchesterMapView',
    'views/FooterView'
], function($, _, Backbone, NavView, ManchesterMapView, FooterView) {

    var ManchesterPage = Backbone.View.extend({

        initialize: function() {

            this.navView = new NavView();
            this.manchesterMapView = new ManchesterMapView();
            this.footerView = new FooterView();
        },
        render: function() {

            this.$el.empty();

            this.navView.render();
            this.manchesterMapView.render();
            this.footerView.render();

            this.$el.append(this.navView.$el);
            this.$el.append(this.manchesterMapView.$el);
            this.$el.append(this.footerView.$el);
        }
    });

    return ManchesterPage;
});