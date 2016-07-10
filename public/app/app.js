'use strict';

(function (angular) {
    angular.module('trafie',
        ['ngRoute', 'ngResource', 'ngSanitize', 'pascalprecht.translate', 'ui.bootstrap', 'cgNotify', 'angular-confirm',
            'ui.select', 'ngFileUpload', 'ngImgCrop']
    ).run(function ($window, $rootScope, $location) {
        if ($window.hasOwnProperty('ga')) {
            $window.ga('create', 'UA-47166136-1', 'auto');
            $rootScope.$on('$routeChangeSuccess', function (event) {
                $window.ga('send', 'pageview', $location.path());
            });
        }
    }).config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider.when('/settings/:tab?', {
            templateUrl: '/app/settings/views/settingsView.html',
            controller: 'SettingsController',
            reloadOnSearch: false
        }).when('/:userIdentifier?', {
            templateUrl: '/app/profile/views/profileView.html',
            controller: 'ProfileController',
            reloadOnSearch: false
        }).otherwise({
            redirectTo: '/'
        });
    });
})(angular);