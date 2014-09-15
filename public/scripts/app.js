//Define ng-app module
//---
var trafie = angular.module('trafie',[
  'ngRoute' ,
  'ui.bootstrap',
  'ngAnimate']);

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
trafie.run(function ($rootScope, $http) {
    $http.get('/profile')
    .success(function(res){
      console.log('run' , res);
      //The logged in user
      $rootScope.user = res;
      // $rootScope.user_first_name = res.first_name;

      //the user we visit. Is the same at login
      $rootScope.current_user = res;
    });
});

