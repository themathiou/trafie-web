(function(angular) {
    angular.module('trafie-outer')
        .controller('ResetPasswordController', function($scope, $http, $window, $routeParams) {
            if(!$routeParams.hash) return;
            $scope.formData = {
                password: ''
            };
            $scope.repeatPassword = '';
            $scope.error = '';

            $scope.updatePassword = function() {
                $scope.error = '';
                if($scope.formData.password !== $scope.repeatPassword) {
                    $scope.error = 'Passwords do not match';
                    return;
                }
                $http.post('/reset-password/' + $routeParams.hash, $scope.formData)
                .then(function(res) {
                    if(res.status === 200 && res.data._id) {
                        $http.post('/login', {password: $scope.formData.password, email: res.data.email})
                        .then(function(res) {
                            if(res.status === 200 && res.data._id) {
                                $window.location.href = '/';
                            }
                        });
                    }
                }, function(res) {
                    if(res.status === 422) {
                        $scope.error = 'The password should be at least 6 characters long';
                    }
                    else if(res.status === 404) {
                        $scope.error = 'We couldn\'t find your request to reset your password';
                    }
                    else {
                        $scope.error = 'There was a problem processing your request. Please try later.';
                    }
                });
            };
        });
})(angular);