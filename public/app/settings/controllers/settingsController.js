(function(angular) {
    angular.module('trafie')
    .controller('SettingsController', function($scope, $http, $window, $translate, $filter, $routeParams,
                                               userService, COUNTRIES, DISCIPLINES, LANGUAGES_MAP,
                                               DATE_FORMATS_MAP, VALIDATIONS, User, notify, $uibModal) {
        var tabsList = ['profile', 'account', 'password'];
        var fieldErrorsMap = {
            firstName: {invalid: 'SETTINGS.INVALID_FIRST_NAME'},
            lastName: {invalid: 'SETTINGS.INVALID_LAST_NAME'},
            birthday: {invalid: 'SETTINGS.INVALID_BIRTHDAY'},
            isMale: {invalid: 'SETTINGS.INVALID_GENDER'},
            country: {invalid: 'SETTINGS.INVALID_COUNTRY'},
            discipline: {invalid: 'SETTINGS.INVALID_DISCIPLINE'},
            about: {invalid: 'COMMON.TOO_LONG_TEXT'},
            language: {invalid: 'SETTINGS.INVALID_LANGUAGE'},
            dateFormat: {invalid: 'COMMON.WRONG_DATE_FORMAT'},
            isPrivate: {invalid: 'SETTINGS.INVALID_PRIVACY'},
            username: {already_exists: 'SETTINGS.USERNAME_TAKEN', invalid: 'SETTINGS.INVALID_USERNAME'},
            oldPassword: {invalid: 'SETTINGS.WRONG_OLD_PASSWORD'},
            password: {invalid: 'SETTINGS.PASSWORD_SHOULD_BE_AT_LEAST_6_CHARACTERS_LONG'}
        };
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
        $scope.saving = false;
        $scope.setting = {
            birthday: '',
            isMale: ''
        };

        userService.loadCurrentUser().then(function(user) {
            $scope.user = user;
            $scope.setting.birthday = user.birthday ? moment(user.birthday, 'YYYY-MM-DD').format(user.dateFormat) : '';
            $scope.setting.isMale = user.isMale ? 'true' : 'false';
            currentLanguage = user.language;
        }, redirectToLogin);

        $scope.$watch('user.dateFormat', function(newValue, oldValue) {
            if($scope.setting.birthday) {
                var birthdayObj = moment($scope.setting.birthday, oldValue);
                if(birthdayObj.isValid())
                    $scope.setting.birthday = birthdayObj.format(newValue);
            }
        });

        $scope.saveSettings = function() {
            $scope.user.birthday = $scope.setting.birthday ? moment($scope.setting.birthday, $scope.user.dateFormat).format('YYYY-MM-DD') : '';
            $scope.user.isMale = $scope.setting.isMale === 'true';
            if(currentLanguage != $scope.user.language) {
                $translate.use($scope.user.language);
                currentLanguage = $scope.user.language;
            }

            $scope.saving = true;
            var user = new User($scope.user);
            user.$save()
                .then(function(res) {
                    notify({
                        message: $filter('translate')('SETTINGS.DATA_WAS_UPDATED_SUCCESSFULLY'),
                        classes: 'alert-success'
                    });
                    $scope.saving = false;
                }, function(res) {
                    $scope.saving = false;
                    /*var messages = res.messages.map(function(message) {
                        return $filter('translate')(message);
                    });
                    notify({
                        messageTemplate: '<span>' + messages.join('<br>') + '</span>',
                        classes: 'alert-danger'
                    });*/
                });
        };

        $scope.logout = function() {
            $http.get('/logout').then(redirectToLogin);
        };

        $scope.deactivateAccount = function() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/settings/views/deactivateAccountModalView.html',
                controller: 'DeactivateAccountModalController',
                size: 'md'
            });

            modalInstance.result.then(function () {
            }, function () {
            });
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