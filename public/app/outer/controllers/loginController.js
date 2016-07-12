(function(angular) {
    angular.module('trafie-outer')
    .controller('LoginController', function($scope, $http, $window, $location) {
        $scope.formData = {
            email: '',
            password: ''
        };
        $scope.error = '';
        $scope.success = '';

        if('message' in $location.search()) {
            var query = angular.copy($location.search());
            if(query.message === 'password_reset') {
                $scope.success = 'An email with instructions to reset your password, has been sent to your email address';
            }
        }

        $scope.login = function() {
            $scope.error = '';
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