/*Define ng-app module*/
var trafie = angular.module('trafie',[ 'ngRoute' , 'ui.bootstrap' ]);

trafie.config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.html5Mode(true)
	}]);

/*Routing*/
trafie.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/', {
				templateUrl: '/views/profile.html',
				controller: 'profileController'
			}).
			when('/settings', {
				templateUrl: '/views/settings.html',
				controller: 'settingsController'
			}).
			when('/statistics', {
				templateUrl: '/views/statistics.html',
				controller: 'statisticsController'
			}).
			otherwise({
				redirectTo: '/'
			});
	}]);
