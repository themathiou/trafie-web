angular.module('trafie')
    .controller('DiaxeirisiController', function ($scope, $http) {
        $scope.deleteState = [];

        $http.get('/admin/users')
            .then(function(res) {
                if (res.status === 200) {
                    $scope.users = res.data;
                }
            });

        $scope.delete = function(id) {
            $http.delete('/admin/users/' + id)
                .then(function(res) {
                    if (res.status === 200) {
                        $scope.users = res.data;
                    }
                });
            $scope.cancelDeletion(id);
        };

        $scope.cancelDeletion = function(id) {
            $scope.deleteState.splice($scope.deleteState.indexOf(id), 1);
        };

        $scope.requestDeletion = function(id) {
            if ($scope.deleteState.indexOf(id) === -1) {
                $scope.deleteState.push(id);
            }
        }
    });