(function (angular) {
    angular.module('trafie-outer', ['ngRoute', 'ngResource', 'ngSanitize'])
    .run(function ($window, $rootScope, $location) {
        if($window.hasOwnProperty('ga')) {
            $window.ga('create', 'UA-47166136-1', 'auto');
            $rootScope.$on('$routeChangeSuccess', function (event) {
                $window.ga('send', 'pageview', $location.path());
            });
        }
    })
    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/login', {
                templateUrl: '/app/outer/views/loginView.html',
                controller: 'LoginController'
            })
            .when('/register', {
                templateUrl: '/app/outer/views/registerView.html',
                controller: 'RegisterController'
            })
            .when('/reset-password/:hash', {
                templateUrl: '/app/outer/views/resetPasswordView.html',
                controller: 'ResetPasswordController'
            })
            .when('/reset-password-request', {
                templateUrl: '/app/outer/views/resetPasswordRequestView.html',
                controller: 'ResetPasswordRequestController'
            })
            .when('/validate-email/:hash', {
                templateUrl: '/app/outer/views/validateEmailView.html',
                controller: 'ValidateEmailController'
            })
            .when('/terms-of-service', {
                templateUrl: '/app/outer/views/termsOfServiceView.html'
            })
            .when('/about', {
                templateUrl: '/app/outer/views/aboutView.html'
            })
            .when('/privacy', {
                templateUrl: '/app/outer/views/privacyView.html'
            });
    });
})(angular);