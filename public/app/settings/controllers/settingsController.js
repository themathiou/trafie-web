(function(angular) {
    angular.module('trafie')
    .controller('SettingsController', function($scope, $http, $window, $translate, userService, COUNTRIES,
                                               DISCIPLINES, LANGUAGES_MAP, DATE_FORMATS_MAP, VALIDATIONS,
                                               User) {
        $scope.user = null;
        $scope.countries = [''].concat(COUNTRIES);
        $scope.disciplines = [''].concat(DISCIPLINES);
        $scope.languagesMap = LANGUAGES_MAP;
        $scope.languages = Object.keys(LANGUAGES_MAP);
        $scope.dateFormatsMap = DATE_FORMATS_MAP;
        $scope.dateFormats = Object.keys(DATE_FORMATS_MAP);
        $scope.validations = VALIDATIONS;
        $scope.setting = {
            birthday: '',
            isMale: ''
        };
        var currentLanguage = '';

        userService.loadCurrentUser().then(function(user) {
            $scope.user = user;
            $scope.setting.birthday = user.birthday ? moment(user.birthday, 'YYYY-MM-DD').format(user.dateFormat) : '';
            $scope.setting.isMale = user.isMale ? 'true' : 'false';
            currentLanguage = user.language;
            console.log($scope.user);
        }, redirectToLogin);

        $scope.$watch('user.dateFormat', function(newValue, oldValue) {
            if($scope.setting.birthday) {
                var birthdayObj = moment($scope.setting.birthday, oldValue);
                if(birthdayObj.isValid())
                    $scope.setting.birthday = birthdayObj.format(newValue);
            }
        });

        $scope.saveSettings = function() {
            console.log($scope.setting.birthday);
            $scope.user.birthday = $scope.setting.birthday ? moment($scope.setting.birthday, $scope.user.dateFormat).format('YYYY-MM-DD') : '';
            $scope.user.isMale = $scope.setting.isMale === 'true';
            if(currentLanguage != $scope.user.language) {
                $translate.use($scope.user.language);
                currentLanguage = $scope.user.language;
            }
            console.log($scope.user);

            var user = new User($scope.user);
            user.$save()
                .then(function(res) {
                    console.log(res);
                }, function(res) {
                    console.log(2, res);
                });
        };

        $scope.logout = function() {
            $http.get('/logout').then(redirectToLogin);
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