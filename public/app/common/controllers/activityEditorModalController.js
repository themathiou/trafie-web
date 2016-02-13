angular.module('trafie')
    .controller('ActivityEditorModalController', function ($scope, $uibModalInstance, $filter, activityToEdit,
                                                           DISCIPLINES, userService, DISCIPLINE_CATEGORIES,
                                                           Activity, notify) {
        activityToEdit = activityToEdit || null;
        $scope.isNewActivity = !activityToEdit;
        $scope.activity = activityToEdit || new Activity;
        $scope.disciplines = [''].concat(DISCIPLINES);
        $scope.saving = false;
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
            console.log($scope.activity);
            $scope.activity.$save()
            .then(function(res) {
                $scope.saving = false;
                notify({
                    message: $filter('translate')('PROFILE.THE_ACTIVITY_WAS_CREATED_SUCCESSFULLY'),
                    classes: 'alert-success'
                });
                $uibModalInstance.close();
            }, function(res) {
                $scope.saving = false;
                console.log(res);
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });