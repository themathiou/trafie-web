angular.module('trafie')
    .controller('ActivityEditorModalController', function ($scope, $uibModalInstance, activityToEdit,
                                                           DISCIPLINES, Activity, DISCIPLINE_CATEGORIES) {
        activityToEdit = activityToEdit || null;
        $scope.isNewActivity = !activityToEdit;
        $scope.activity = activityToEdit || new Activity;
        $scope.disciplines = [''].concat(DISCIPLINES);

        $scope.getCategory = function() {
            if(DISCIPLINE_CATEGORIES.time.indexOf($scope.activity.discipline) >= 0) return 'time';
            else if(DISCIPLINE_CATEGORIES.distance.indexOf($scope.activity.discipline) >= 0) return 'distance';
            else if(DISCIPLINE_CATEGORIES.points.indexOf($scope.activity.discipline) >= 0) return 'points';
            else return '';
        };

        $scope.save = function () {
            $scope.activity.$save();
            //$uibModalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });