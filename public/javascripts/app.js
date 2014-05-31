/*Define ng-app module*/
var trafie = angular.module('trafie',['ngRoute']);

trafie.config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.html5Mode(true)
	}]);

/*Routing*/
trafie.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/settings', {
				templateUrl: '/views/settings.html',
				controller: 'settingsController'
			}).
			otherwise({
				redirectTo: '/'
			});
	}]);




/* Shared Properties Service */
trafie.service('sharedProperties',
	function () {
	    
	});





