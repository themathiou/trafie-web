(function(angular) {
    angular.module('trafie-outer')
        .controller('ResetPasswordRequestController', function($scope, $http, $window) {
            $scope.formData = {
                email: ''
            };
            $scope.error = '';
            $scope.fieldError = false;

            $scope.resetPassword = function() {
                $scope.error = '';
                $http.post('/reset-password-request', $scope.formData)
                    .then(function(res) {
                        if(res.status === 200) {
                            $window.location.href = '/login?message=password_reset';
                        }
                    }, function(res) {
                        if (res.status === 404) {
                            $scope.error = 'The provided email address was not found';
                            $scope.fieldError = true;
                        } else {
                            $scope.error = 'There was a problem processing your request. Please try later.';
                        }
                    });
            };
        });
})(angular);