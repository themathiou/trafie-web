(function(angular) {
    angular.module('trafie-outer')
        .controller('ResetPasswordRequestController', function($scope, $http, $window) {
            $scope.formData = {
                email: ''
            };
            $scope.error = '';

            $scope.resetPassword = function() {
                $scope.error = '';
                $http.post('/reset-password-request', $scope.formData)
                    .then(function(res) {
                        if(res.status === 200) {
                            var message = encodeURIComponent('An email with instructions of resetting your password, has been sent to your email address');
                            $window.location.href = '/login?message=' + message + '&message_type=success';
                        }
                    }, function(res) {
                        if (res.status === 404) {
                            $scope.error = 'The provided email address was not found';
                        } else {
                            $scope.error = 'Something went wrong';
                        }
                    });
            };
        });
})(angular);