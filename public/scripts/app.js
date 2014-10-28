//Define ng-app module
//---

//--- WE NEED TO FIX INJECTION HERE TO AVOID ISSUES IN MINIFICATION IN GRUNT ---//
var trafie = angular.module('trafie', [
	'ngRoute',
	'ui.bootstrap',
	'ngAnimate',
	'angularFileUpload'
]);

trafie.config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.html5Mode(true)
	}
]);

//Routing
//---
trafie.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/login', {
			controller: 'mainController'
		}).
		when('/register', {
			controller: 'mainController'
		}).
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
		when('/statistics/:userID', {
			templateUrl: '/views/statistics.html',
			controller: 'statisticsController'
		}).
		when('/:userID', {
			templateUrl: '/views/profile.html',
			controller: 'profileController'
		}).
		otherwise({
			redirectTo: '/'
		});
	}
]);


//Initialization
//---
trafie.run(function($rootScope, $http) {
	$rootScope.isVisitor = true;
	
	$http.get('/users/me')
		.success(function(res) {
			console.log('run', res);
			//The logged in user
			$rootScope.localUser = res;
			$rootScope.isVisitor = false;
			
			$http.get('/users/' + res._id + '/disciplines')
			.success(function(res) {
				$rootScope.localUser.disciplines_of_user = res;
				$rootScope.current_user = res; //current user is logged in user
			})
			.error(function(res) {
				console.err('info :: can\'t get disciplines of current user in -run-');
			});
		})
		.error(function(res) {
			console.log('info :: Oooohhh we have a fuckin\' visitoo!!');
		});

});