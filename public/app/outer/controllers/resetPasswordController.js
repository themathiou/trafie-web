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
                    $scope.errors = res.data.errors.pop();
                });
            };
        });
})(angular);