(function(angular) {
    angular.module('trafie')
    .controller('SettingsController', function($scope, $http, $window) {
        $scope.logout = function() {
            $http.get('/logout')
            .then(function() {
                $window.location.href = 'login';
            });
        };
    });
})(angular);