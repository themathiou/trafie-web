//Define ng-app module
//---
var trafie = angular.module('trafie',[ 'ngRoute' , 'ui.bootstrap' ]);

trafie.config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.html5Mode(true)
	}]);

//Routing
//---
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
			when('/:userID', {
				templateUrl: '/views/profile.html',
				controller: 'profileController'
			}).
			otherwise({
				redirectTo: '/'
			});
	}]);


//Initialization
//---
trafie.run(function ($rootScope, $http) {
    $http.get('/main_data')
		.success(function(res){
			console.log('run' , res);
			//The logged in user
			$rootScope.user = res.user;
			$rootScope.user_first_name = res.user.first_name;

			//the user we visit. Is the same at login
			$rootScope.current_user = res.user;
		});
});

