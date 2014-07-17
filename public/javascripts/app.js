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
			//probably useless
			when('/logout', {
				redirectTo:'/login'
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


//Custom directives
//---
//Disciplines of the user
trafie.directive("activeDisciplines", function( $http ){
	return {
		restrict:'E',
		scope:{
			user_id:'=user_id'
		},
		link: function(scope, element, attrs){
			$http.get('/user/'+scope.user_id+'/disciplines')
			.success(function(res){
				console.log('that bitchesss:', res);
			})
		},
		template: '<ul><li ng-repeat="(key, value) in user.disciplines_of_user" style="float:left;" ><a ng-click="getActivities( user._id, key )">{{value}}</a></li></ul>'
	}

})










