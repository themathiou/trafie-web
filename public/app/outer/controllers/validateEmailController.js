(function(angular) {
    angular.module('trafie-outer')
        .controller('ValidateEmailController', function($scope, $http, $window, $routeParams) {
            if(!$routeParams.hash) return;
            $scope.validated = null;

            $http.get('/validate/' + $routeParams.hash)
                .then(function(res) {
                    if(res.status === 200) {
                        $scope.validated = true;
                    } else {
                        $scope.validated = false;
                    }
                }, function(res) {
                    $scope.validated = false;
                });

            $scope.goToProfile = function() {
                $window.location.href = '/login';
            };
        });
})(angular);