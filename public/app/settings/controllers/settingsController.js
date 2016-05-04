(function(angular) {
    angular.module('trafie')
    .controller('SettingsController', function($scope, $http, $window, $translate, $filter, $routeParams,
                                               userService, COUNTRIES, DISCIPLINES, LANGUAGES_MAP,
                                               DATE_FORMATS_MAP, VALIDATIONS, User, $uibModal) {
        var tabsList = ['profile', 'account', 'password'];
        var globalUser = null;
        var currentLanguage = '';
        $scope.user = null;
        $scope.tab = $routeParams.tab && tabsList.indexOf($routeParams.tab) >= 0 ? $routeParams.tab : tabsList[0];
        $scope.countries = [''].concat(COUNTRIES);
        $scope.disciplines = [''].concat(DISCIPLINES);
        $scope.languagesMap = LANGUAGES_MAP;
        $scope.languages = Object.keys(LANGUAGES_MAP);
        $scope.dateFormatsMap = DATE_FORMATS_MAP;
        $scope.dateFormats = Object.keys(DATE_FORMATS_MAP);
        $scope.validations = VALIDATIONS;
        $scope.verificationEmailSent = false;
        $scope.showUsernameWarning = false;
        $scope.saving = false;
        $scope.setting = {
            birthday: '',
            isMale: ''
        };
        $scope.alerts = {
            profileForm: {
                type: 'danger',
                message: ''
            },
            accountForm: {
                type: 'danger',
                message: ''
            },
            passwordForm: {
                type: 'danger',
                message: ''
            }
        };
        $scope.fieldErrors = {
            profileForm: {
                firstName: {invalid: 'SETTINGS.INVALID_FIRST_NAME', missing: 'SETTINGS.FIRST_NAME_IS_REQUIRED', hasError: false},
                lastName: {invalid: 'SETTINGS.INVALID_LAST_NAME', missing: 'SETTINGS.LAST_NAME_IS_REQUIRED', hasError: false},
                birthday: {invalid: 'SETTINGS.INVALID_BIRTHDAY', hasError: false},
                isMale: {invalid: 'SETTINGS.INVALID_GENDER', hasError: false},
                country: {invalid: 'SETTINGS.INVALID_COUNTRY', hasError: false},
                discipline: {invalid: 'SETTINGS.INVALID_DISCIPLINE', hasError: false},
                about: {invalid: 'SETTINGS.THE_TEXT_ENTERED_IN_THE_ABOUT_ME_FIELD_IS_TOO_LONG', hasError: false},
                isPrivate: {hasError: false}
            },
            accountForm: {
                language: {invalid: 'SETTINGS.INVALID_LANGUAGE', hasError: false},
                dateFormat: {invalid: 'COMMON.WRONG_DATE_FORMAT', hasError: false},
                isPrivate: {invalid: 'SETTINGS.INVALID_PRIVACY', hasError: false},
                username: {already_exists: 'SETTINGS.USERNAME_TAKEN', invalid: 'SETTINGS.INVALID_USERNAME', hasError: false}
            },
            passwordForm: {
                oldPassword: {invalid: 'SETTINGS.WRONG_OLD_PASSWORD', hasError: false},
                password: {invalid: 'SETTINGS.PASSWORD_SHOULD_BE_AT_LEAST_6_CHARACTERS_LONG', hasError: false},
                repeatPassword: {noMatch: 'SETTINGS.PASSWORDS_DO_NOT_MATCH', hasError: false}
            }
        };

        userService.loadCurrentUser().then(function(user) {
            globalUser = user;
            $scope.user = angular.copy(user);
            $scope.setting.birthday = user.birthday ? moment(user.birthday, 'YYYY-MM-DD').format(user.dateFormat) : '';
            $scope.setting.isMale = user.isMale ? 'true' : 'false';
            currentLanguage = user.language;
        }, redirectToLogin);

        $scope.$watch('user.dateFormat', function(newValue, oldValue) {
            if($scope.setting.birthday) {
                var birthdayObj = moment($scope.setting.birthday, oldValue);
                if(birthdayObj.isValid()) {
                    $scope.setting.birthday = birthdayObj.format(newValue);
                }
            }
        });

        function usersFormValues(formName) {
            var formValues = {};
            Object.keys($scope.fieldErrors[formName]).forEach(function(fieldName) {
                formValues[fieldName] = $scope.user[fieldName];
            });
            formValues._id = $scope.user._id;
            return formValues;
        }

        function printErrors(formName) {
            var errors = [];
            $scope.alerts[formName].type = 'danger';
            Object.keys($scope.fieldErrors[formName]).forEach(function(fieldName) {
                if($scope[formName].hasOwnProperty(fieldName) && $scope[formName][fieldName].$invalid) {
                    var errorType = 'required' in $scope[formName][fieldName].$error ? 'missing' : 'invalid';
                    $scope.fieldErrors[formName][fieldName].hasError = true;
                    if(angular.isDefined($scope.fieldErrors[formName][fieldName][errorType])) {
                        var errorMessage = $filter('translate')($scope.fieldErrors[formName][fieldName][errorType]);
                        errors.push(errorMessage);
                    }
                }
            });
            if(formName === 'passwordForm' && angular.isDefined($scope.user.password) && angular.isDefined($scope.repeatPassword) && $scope.user.password !== $scope.repeatPassword) {
                var errorMessage = $filter('translate')($scope.fieldErrors[formName]['repeatPassword']['noMatch']);
                $scope.fieldErrors[formName]['password'].hasError = true;
                $scope.fieldErrors[formName]['repeatPassword'].hasError = true;
                errors.push(errorMessage);
            }
            $scope.alerts[formName].message = errors.join('<br>');
        }

        function resetAlertsAndErrors() {
            Object.keys($scope.fieldErrors).forEach(function(formName) {
                $scope.alerts[formName].type = 'danger';
                $scope.alerts[formName].message = '';
                for(var fieldName in $scope.fieldErrors[formName]) {
                    $scope.fieldErrors[formName][fieldName].hasError = false;
                }
            });
        }

        $scope.saveSettings = function(formName) {
            resetAlertsAndErrors();
            if($scope[formName].$invalid || (formName === 'passwordForm' && $scope.user.password !== $scope.repeatPassword)) {
                printErrors(formName);
                return;
            }

            $scope.saving = true;
            $scope.showUsernameWarning = false;
            $scope[formName].$setPristine();
            $scope.user.birthday = $scope.setting.birthday ? moment($scope.setting.birthday, $scope.user.dateFormat).format('YYYY-MM-DD') : '';
            $scope.user.isMale = $scope.setting.isMale === 'true';

            var formData = usersFormValues(formName);
            var user = new User(formData);
            if($scope.user.usernameChangesCount > 1) {
                delete user.username;
            }
            user.$save()
                .then(function(res) {
                    $scope.alerts[formName].type = 'success';
                    $scope.alerts[formName].message = $filter('translate')('SETTINGS.DATA_WAS_UPDATED_SUCCESSFULLY');
                    $scope.saving = false;
                    angular.extend(globalUser, formData);
                    if(currentLanguage != $scope.user.language) {
                        $translate.use($scope.user.language);
                        currentLanguage = $scope.user.language;
                    }
                    if(res.hasOwnProperty('usernameChangesCount')) {
                        $scope.user.usernameChangesCount = res.usernameChangesCount;
                    }
                }, function(res) {
                    $scope.saving = false;
                    if(res.data.errors) {
                        $scope.alerts[formName].type = 'danger';
                        var errors = [];
                        res.data.errors.forEach(function(error) {
                            var errorMessage = $filter('translate')($scope.fieldErrors[formName][error.field][error.code]);
                            $scope.fieldErrors[formName][error.field].hasError = true;
                            errors.push(errorMessage);
                        });
                        $scope.alerts[formName].message = errors.join('<br>');
                    }
                });
        };

        $scope.closeAlert = function(formName) {
            $scope.alerts[formName].message = '';
        };

        $scope.logout = function() {
            $http.get('/logout').then(redirectToLogin);
        };

        $scope.deactivateAccount = function() {
            var modalInstance = $uibModal.open({
                animation: false,
                templateUrl: 'app/settings/views/deactivateAccountModalView.html',
                controller: 'DeactivateAccountModalController',
                size: 'md'
            });

            modalInstance.result.then(function () {
            }, function () {
            });
        };

        $scope.resendVerificationEmail = function() {
            function verificationEmailSent() {
                $scope.verificationEmailSent = true;
            }
            $http.get('/resend-validation-email').then(verificationEmailSent, verificationEmailSent);
        };

        $scope.toDatepickerFormat = function(format) {
            return format ? format.split('-').map(function(value) {
                return value[0] !== 'M' ? value.toLowerCase() : value;
            }).join('-') : '';
        };

        function redirectToLogin() {
            $window.location.href = 'login';
        }
    });
})(angular);