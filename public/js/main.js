// main.js
require.config({
	paths: {
		'jquery': [
			"//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min",
			"./assets/jquery-2.1.3.min"
		],
		'jqueryUI': [
			"//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min",
			"./assets/jquery-ui.min"
		],
        'underscore': [
			"//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.2/underscore-min",
			"./assets/underscore-min"
		],
        'backbone': [
			"//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min",
			"./assets/backbone-min"
		],
        'bootstrap': [
			"//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.1/js/bootstrap.min",
			"./assets/bootstrap.min"
		],
		'L' : [
			"//cdn.leafletjs.com/leaflet-0.7.3/leaflet" 
		],
		'd3': [
			"//cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min"
		],
        'text': "./assets/text",
        'templates': "../templates"
	},
	shim: {
		backbone: {
			deps: ['underscore']
		},
		bootstrap: {
			deps: ['jquery']
		},
		jqueryUI: {
			deps: ['jquery'],
			exports: ['jquery']
		},
		underscore: {
			exports: '_'
		}
	}
});

require(['jquery', 'jqueryUI'], function($) {});
require(['underscore'], function($) {});
require(['backbone'], function($) {});
require(['bootstrap'], function($) {});

require(['app'],

	function(App) {
		App.initialize();
	}
)