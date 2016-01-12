(function(angular) {
    angular.module('trafie')
    .controller('SettingsController', function($scope, $http, $window, userService, COUNTRIES) {
        $scope.user = null;
        $scope.countries = [''].concat(COUNTRIES);

        userService.loadCurrentUser().then(function(user) {
            $scope.user = user;
            console.log($scope.user);
        });

        $scope.$watchCollection('user', function(){
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