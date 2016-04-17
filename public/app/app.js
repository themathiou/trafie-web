(function (angular) {
    angular.module('trafie', ['ngRoute', 'ngResource', 'ngSanitize', 'pascalprecht.translate', 'ui.bootstrap', 'cgNotify', 'angular-confirm', 'ui.select'])
    .run(function (){})
    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/settings/:tab?', {
                templateUrl: '/app/settings/views/settingsView.html',
                controller: 'SettingsController'
            })
            .when('/terms-of-service', {
                templateUrl: '/app/common/views/termsOfServiceView.html'
            })
            .when('/about', {
                templateUrl: '/app/common/views/aboutView.html'
            })
            .when('/privacy', {
                templateUrl: '/app/common/views/privacyView.html'
            })
            .when('/:userIdentifier?', {
                templateUrl: '/app/profile/views/profileView.html',
                controller: 'ProfileController'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
})(angular);