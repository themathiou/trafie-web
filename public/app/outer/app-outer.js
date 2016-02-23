(function (angular) {
    angular.module('trafie-outer', ['ngRoute', 'ngResource', 'ngSanitize'])
    .run(function (){})
    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/login', {
                templateUrl: '/app/outer/views/login.html',
                controller: 'LoginController'
            })
            .when('/register', {
                templateUrl: '/app/outer/views/register.html',
                controller: 'RegisterController'
            })
            .when('/reset-password/:hash', {
                templateUrl: '/app/outer/views/reset-password.html',
                controller: 'ResetPasswordController'
            })
            .when('/reset-password-request', {
                templateUrl: '/app/outer/views/reset-password-request.html',
                controller: 'ResetPasswordRequestController'
            })
            .when('/validate-email/:hash', {
                templateUrl: '/app/outer/views/validate-email.html',
                controller: 'ValidateEmailController'
            });
    });
})(angular);