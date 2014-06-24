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
			$rootScope.user = res.user;
			$rootScope.user_first_name = res.user.first_name;
		});
});


//Custom directives
//---

//Upload file
trafie.directive('fileInput',[ '$parse', function($parse){
    var directive = { 
        restrict : 'A', 
				link: function(scope, elm, attrs){
						elm.bind('change', function(){
						$parse(attrs.fileInput)
						.assign(scope, elm);

						scope.$apply();
						})
				}
		}
    return directive;
}])












