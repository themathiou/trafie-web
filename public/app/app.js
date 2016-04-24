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
            .when('/:userIdentifier?', {
                templateUrl: '/app/profile/views/profileView.html',
                controller: 'ProfileController'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
})(angular);