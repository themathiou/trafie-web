//Define ng-app module
var trafie = angular.module('trafie', [
	'trafie.models',
	'trafie.services',
	'trafie.controllers',
	'trafie.directives',
	'ngRoute',
	'ui.bootstrap',
	'ngAnimate',
	'angularFileUpload',
	'ngResource',
	'720kb.datepicker'
]);

trafie.config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.html5Mode(true)
	}
]);

//Routing
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
])
//Initialization
.run(['$rootScope', 'User', 'Discipline', function($rootScope, User, Discipline) {
	$rootScope.isVisitor = true;

	User.get({userId:'me'}, function(res){
		//The logged in user
		$rootScope.localUser = res;
		$rootScope.isVisitor = false;

		Discipline.query({userId: res._id}, function(discipline_response) {
			$rootScope.localUser.disciplines_of_user = discipline_response;
			$rootScope.current_user = res; //current user is logged in user
		});
	});
}]);