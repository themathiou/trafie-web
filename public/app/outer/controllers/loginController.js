(function(angular) {
    angular.module('trafie-outer')
    .controller('LoginController', function($scope, $http, $window, $location) {
        $scope.formData = {
            email: '',
            password: ''
        };
        $scope.error = '';
        $scope.success = '';

        if('message_type' in $location.search()) {
            var query = angular.copy($location.search());
            if(query.message_type === 'success') {
                $scope.success = decodeURIComponent(query.message);
            }
        }

        $scope.login = function() {
            $http.post('/login', $scope.formData)
            .then(function(res) {
                if(res.status === 200 && res.data._id) {
                    $window.location.href = '/';
                }
            }, function(res) {
                $scope.error = 'Wrong email or password';
            });
        };
    });
})(angular);