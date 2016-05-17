angular.module('trafie')
    .controller('ActivityEditorModalController', function ($scope, $rootScope, $uibModalInstance, $filter,
                                                           activityToEdit, DISCIPLINES, VALIDATIONS,
                                                           DISCIPLINE_CATEGORIES, Activity, userService,
                                                           notify) {
        activityToEdit = activityToEdit || null;
        $scope.isNewActivity = !activityToEdit;
        $scope.activity = activityToEdit && angular.copy(activityToEdit) || new Activity();
        $scope.disciplines = [''].concat(DISCIPLINES);
        $scope.saving = false;
        $scope.alertMessage = '';
        $scope.additionalInfoVisible = false;
        $scope.validations = VALIDATIONS;
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
        $scope.fieldErrors = {
            discipline: {missing: 'PROFILE.DISCIPLINE_IS_REQUIRED', hasError: false},
            performance: {invalid: 'PROFILE.INVALID_PERFORMANCE', hasError: false},
            date: {invalid: 'PROFILE.INVALID_PERFORMANCE', missing: 'PROFILE.DATE_IS_REQUIRED', hasError: false},
            competition: {invalid: 'PROFILE.INVALID_COMPETITION', missing: 'PROFILE.COMPETITION_IS_REQUIRED', hasError: false},
            location: {invalid: 'PROFILE.THE_TEXT_OF_THE_LOCATION_IS_TOO_LONG', hasError: false},
            rank: {invalid: 'PROFILE.INVALID_RANK', hasError: false},
            notes: {invalid: 'PROFILE.THE_TEXT_OF_THE_NOTES_IS_TOO_LONG', hasError: false},
            isOutdoor: {hasError: false},
            isPrivate: {hasError: false}
        };

        userService.loadCurrentUser().then(function(user) {
            $scope.format = user.dateFormat.split('-')
                .map(function(datePart) {
                   return datePart[0] !== 'm' ? datePart : datePart.toUpperCase();
                })
                .join('-');
        });

        $scope.showAdditionalInfo = function() {
            $scope.additionalInfoVisible = !$scope.additionalInfoVisible;
        };

        $scope.getCategory = function() {
            if(DISCIPLINE_CATEGORIES.time.indexOf($scope.activity.discipline) >= 0) return 'time';
            else if(DISCIPLINE_CATEGORIES.distance.indexOf($scope.activity.discipline) >= 0) return 'distance';
            else if(DISCIPLINE_CATEGORIES.points.indexOf($scope.activity.discipline) >= 0) return 'points';
            else return '';
        };

        function validateForm() {
            var errors = [];
            Object.keys($scope.fieldErrors).forEach(function(fieldName) {
                if($scope.form.hasOwnProperty(fieldName) && $scope.form[fieldName].$invalid) {
                    var errorType = 'required' in $scope.form[fieldName].$error ? 'missing' : 'invalid';
                    $scope.fieldErrors[fieldName].hasError = true;
                    if(angular.isDefined($scope.fieldErrors[fieldName][errorType])) {
                        var errorMessage = $filter('translate')($scope.fieldErrors[fieldName][errorType]);
                        errors.push(errorMessage);
                    }
                }
            });
            $scope.alertMessage = errors.join('<br>');
            return !errors.length;
        }

        $scope.save = function () {
            if(!validateForm()) {
                return;
            }
            $scope.activity.date = moment($scope.datepicker.activityDate).seconds(0).unix();
            $scope.saving = true;
            var promise = $scope.isNewActivity ? $scope.activity.$save() : $scope.activity.$update();
            promise.then(function(res) {
                $scope.saving = false;
                notify({
                    message: $filter('translate')($scope.isNewActivity ? 'PROFILE.THE_ACTIVITY_WAS_CREATED_SUCCESSFULLY' : 'PROFILE.THE_ACTIVITY_WAS_UPDATED_SUCCESSFULLY'),
                    classes: 'alert-success'
                });
                $rootScope.$broadcast('activityCreated', res);
                $uibModalInstance.close();
            }, function(res) {
                $scope.saving = false;
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });