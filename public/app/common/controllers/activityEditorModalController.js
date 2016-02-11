angular.module('trafie')
    .controller('ActivityEditorModalController', function ($scope, $uibModalInstance, activityToEdit,
                                                           DISCIPLINES, Activity, DISCIPLINE_CATEGORIES,
                                                           userService) {
        activityToEdit = activityToEdit || null;
        $scope.isNewActivity = !activityToEdit;
        $scope.activity = activityToEdit || new Activity;
        $scope.disciplines = [''].concat(DISCIPLINES);
        $scope.datepicker = {
            maxDate: moment().toDate(),
            activityDate: moment().toDate(),
            activityDateFormat: 'dd-MM-yyyy',
            popup: {
                opened: false
            },
            dateOptions: {
                startingDay: 1
            }
        }
        userService.loadCurrentUser().then(function(user) {
            $scope.format = user.dateFormat.split('-')
                .map(function(datePart) {
                   return datePart[0] !== 'm' ? datePart : datePart.toUpperCase();
                })
                .join('-');
        });

        $scope.getCategory = function() {
            if(DISCIPLINE_CATEGORIES.time.indexOf($scope.activity.discipline) >= 0) return 'time';
            else if(DISCIPLINE_CATEGORIES.distance.indexOf($scope.activity.discipline) >= 0) return 'distance';
            else if(DISCIPLINE_CATEGORIES.points.indexOf($scope.activity.discipline) >= 0) return 'points';
            else return '';
        };

        $scope.save = function () {
            $scope.activity.date = moment($scope.datepicker.activityDate).seconds(0).unix();
            console.log($scope.activity);
            //$scope.activity.$save();
            //$uibModalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });