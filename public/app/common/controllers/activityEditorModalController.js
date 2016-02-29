angular.module('trafie')
    .controller('ActivityEditorModalController', function ($scope, $uibModalInstance, $filter, activityToEdit,
                                                           DISCIPLINES, userService, DISCIPLINE_CATEGORIES,
                                                           Activity, notify) {
        activityToEdit = activityToEdit || null;
        $scope.isNewActivity = !activityToEdit;
        $scope.activity = activityToEdit && angular.copy(activityToEdit) || new Activity();
        $scope.disciplines = [''].concat(DISCIPLINES);
        $scope.saving = false;
        $scope.datepicker = {
            maxDate: moment().toDate(),
            activityDate: moment.unix($scope.activity.date).toDate(),
            activityDateFormat: 'dd-MM-yyyy',
            popup: {
                opened: false
            },
            dateOptions: {
                startingDay: 1
            }
        };

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
            $scope.saving = true;
            var promise = $scope.isNewActivity ? $scope.activity.$save() : $scope.activity.$update();
            promise.then(function(res) {
                $scope.saving = false;
                notify({
                    message: $filter('translate')($scope.isNewActivity ? 'PROFILE.THE_ACTIVITY_WAS_CREATED_SUCCESSFULLY' : 'PROFILE.THE_ACTIVITY_WAS_UPDATED_SUCCESSFULLY'),
                    classes: 'alert-success'
                });
                $uibModalInstance.close(res);
            }, function(res) {
                $scope.saving = false;
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });