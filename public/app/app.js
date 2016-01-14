(function (angular) {
    angular.module('trafie', ['ngRoute', 'ngResource', 'pascalprecht.translate', 'ui.bootstrap'])
    .run(function (){})
    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/settings', {
                templateUrl: '/app/settings/views/settings.html',
                controller: 'SettingsController'
            })
            .when('/:userIdentifier?', {
                templateUrl: '/app/profile/views/profile.html',
                controller: 'ProfileController'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
})(angular);