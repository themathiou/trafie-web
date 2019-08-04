(function(angular) {
    angular.module('trafie-outer')
        .controller('ResetPasswordRequestController', function($scope, $http, $window) {
            $scope.formData = {
                email: ""
            };
            $scope.errorMessages = {
                server: "",
                email: ""
            };

            $scope.resetPassword = function() {
                $scope.errorMessages = {
                    server: "",
                    email: ""
                };
                $http.post('/reset-password-request', $scope.formData)
                    .then(function(res) {
                        if(res.status === 200) {
                            $window.location.href = '/login?message=password_reset';
                        }
                    }, function(res) {
                        if (res.status === 404) {
                            $scope.errorMessages.email = 'The provided email address was not found';
                        } else {
                            $scope.errorMessages.server = 'There was a problem processing your request. Please try later.';
                        }
                    });
            };
        });
})(angular);