(function(angular) {
    angular.module('trafie')
    .controller('SettingsController', function($scope, $http, $window, userService, COUNTRIES, DISCIPLINES) {
        $scope.user = null;
        $scope.countries = [''].concat(COUNTRIES);
        $scope.disciplines = [''].concat(DISCIPLINES);

        userService.loadCurrentUser().then(function(user) {
            $scope.user = user;
            console.log($scope.user);
        });

        $scope.saveSettings = function() {
            console.log($scope.user);
        };

        $scope.logout = function() {
            $http.get('/logout')
            .then(function() {
                $window.location.href = 'login';
            });
        };
    });
})(angular);