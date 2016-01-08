(function(angular) {
    angular.module('trafie-outer')
    .controller('RegisterController', function($scope, $http, $window) {
        $scope.formData = {
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        };
        $scope.errors = {};
        $scope.errorsArray = [];

        $scope.register = function() {
            $scope.errorsArray = [];
            $http.post('/register', $scope.formData)
                .then(function(res) {
                    if(res.status === 200 && res.data._id) {
                        $http.post('/login', $scope.formData)
                        .then(function(res) {
                            if(res.status === 200 && res.data._id) {
                                $window.location.href = '/';
                            }
                        });
                    }
                }, function(res) {
                    $scope.errors = res.data.errors;
                    $scope.errorsArray = _.values(res.data.errors);
                });
        };
    });
})(angular);