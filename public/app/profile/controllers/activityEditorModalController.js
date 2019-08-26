angular.module('trafie')
    .controller('ActivityEditorModalController', function ($scope, $rootScope, $uibModalInstance, $filter,
                                                           activityToEdit, DISCIPLINES, VALIDATIONS,
                                                           DISCIPLINE_CATEGORIES, Activity, userService,
                                                           notify, Upload) {
        activityToEdit = activityToEdit || null;
        $scope.isNewActivity = !activityToEdit;
        $scope.activity = activityToEdit && angular.copy(activityToEdit) || new Activity();
        $scope.disciplines = [''].concat(DISCIPLINES);
        $scope.saving = false;
        $scope.alertMessage = '';
        $scope.additionalInfoVisible = false;
        $scope.validations = VALIDATIONS;
        $scope.user = null;
        $scope.pictureChanged = false;
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
            comments: {invalid: 'PROFILE.THE_TEXT_OF_THE_COMMENTS_IS_TOO_LONG', hasError: false},
            picture: {invalid: 'PROFILE.INVALID_PICTURE', hasError: false},
            isOutdoor: {hasError: false},
            isPrivate: {hasError: false}
        };

        userService.loadCurrentUser().then(function(user) {
            $scope.user = user;
            $scope.datepicker.activityDateFormat = user.dateFormat.split('-')
                .map(function(datePart) {
                    return datePart[0] !== 'M' ? datePart.toLowerCase() : datePart;
                })
                .join('-');

            if($scope.isNewActivity && user.discipline) {
                $scope.activity.discipline = user.discipline;
            }
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

        $scope.$watch('activity.picture', function(newValue, oldValue) {
            if(angular.isDefined(oldValue) && oldValue !== newValue) {
                $scope.pictureChanged = true;
            }
        });

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
            if(!validateForm()) return;
            $scope.activity.date = moment($scope.datepicker.activityDate).seconds(0).unix();
            $scope.activity.isUpcoming = false;
            $scope.saving = true;

            if($scope.activity.picture && !angular.isString($scope.activity.picture)) {
                var method = 'POST',
                    url = '/users/' + $scope.user._id + '/activities';
                if(!$scope.isNewActivity) {
                    method = 'PUT';
                    url += '/' + $scope.activity._id;
                }
                $scope.progress = 1;
                Upload.upload({
                    url: url,
                    method: method,
                    data: $scope.activity
                }).then(function (res) {
                    $scope.progress = 0;
                    handleSaveSuccess(res.data);
                }, function (res) {
                    $scope.progress = 0;
                    handleSaveError(res.data);
                }, function (evt) {
                    $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                });
            } else {
                var promise = $scope.isNewActivity ? $scope.activity.$save() : $scope.activity.$update();
                promise.then(handleSaveSuccess, handleSaveError);
            }
        };

        $scope.removePicture = function() {
            $scope.pictureChanged = true;
            $scope.activity.picture = '';
        };

        function handleSaveSuccess(res) {
            $scope.saving = false;
            $scope.pictureChanged = false;
            notify({
                message: $filter('translate')($scope.isNewActivity ? 'PROFILE.THE_ACTIVITY_WAS_CREATED_SUCCESSFULLY' : 'PROFILE.THE_ACTIVITY_WAS_UPDATED_SUCCESSFULLY'),
                classes: 'alert-success'
            });
            $rootScope.$broadcast('activityCreated', new Activity(res));
            $uibModalInstance.close();
        }

        function handleSaveError(res) {
            notify({
                message: $filter('translate')('COMMON.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER'),
                classes: 'alert-danger'
            });
            $scope.saving = false;
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });