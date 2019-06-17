angular.module('trafie')
    .controller('DeactivateAccountModalController', function ($scope, $uibModalInstance, $window, $http) {
        $scope.sending = false;
        $scope.formData = {
            password: ''
        };

        $scope.submit = function () {
            $http.post('/delete-account', $scope.formData)
                .then(function(res) {
                    if(res.status === 200) {
                        $window.location.href = 'register';
                    }
                }, function(res) {

                });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });