(function (angular) {
    angular.module('trafie')
        .config(['$translateProvider', function ($translateProvider) {
            $translateProvider.useStaticFilesLoader({
                prefix: '/languages/',
                suffix: '.json'
            });
            $translateProvider.preferredLanguage('en');
        }]);
})(angular);