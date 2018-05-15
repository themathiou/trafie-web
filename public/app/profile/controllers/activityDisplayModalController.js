angular.module('trafie')
    .controller('ActivityDisplayModalController', function ($scope, $uibModalInstance, $filter, activityToDisplay,
                                                            $location) {
        $scope.activity = activityToDisplay;
        $scope.activityUrl = '';

        let args = $location.search();
        if(!args.hasOwnProperty('activityId')) {
            args.activityId = $scope.activity._id;
            $location.search(args);
        }
        $scope.activityUrl = $location.absUrl().replace("?activityId=", "/");

        $scope.close = function () {
            $uibModalInstance.dismiss('close');
        };
    });