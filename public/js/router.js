// router.js
define([
	'jquery',
	'underscore',
	'backbone',
    'bootstrap',
	'views/HomePage',
	'views/ManchesterPage'
], function(
	$,
	_,
	Backbone,
	bootstrap,
	HomePage,
	ManchesterPage
	) {

	var Router = Backbone.Router.extend({

		routes: {
			'': 'home',
			'manchester': 'manchester'
		}
	});

	var initialize = function() {

		var router = new Router();

		var homePage = new HomePage({
            router: router
        });

		var manchesterPage = new ManchesterPage();

		var pages = {
			home: homePage,
			manchester: manchesterPage
		};

		router.on('route', function(pageName) {

            renderPage(pageName);
		});

		Backbone.history.start({
			pushState: false
		});

        function renderPage(pageName) {

            if (!$('.page > [data-name="' + pageName + '"]').length) { // checks if the page has been rendered before

                pages[pageName].render();
                $('.page').append(pages[pageName].$el.attr('data-name', pageName));
            }

            _.each(pages, function(page, name) {
                page.$el.toggle(name===pageName);
            });
        };
	};

	return {
		initialize: initialize
	}
});
