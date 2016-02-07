angular.module('trafie')
    .controller('ActivityEditorModalController', function ($scope, $uibModalInstance, activityToEdit,
                                                           DISCIPLINES, Activity) {
        activityToEdit = activityToEdit || null;
        $scope.isNewActivity = !activityToEdit;
        $scope.activity = activityToEdit || new Activity;
        $scope.disciplines = [''].concat(DISCIPLINES);
        $scope.save = function () {
            $scope.activity.$save();
            //$uibModalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });