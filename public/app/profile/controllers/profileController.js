(function(angular) {
    angular.module('trafie')
    .controller('ProfileController', function($rootScope, $scope, $routeParams, $location, Activity,
                                              User, DISCIPLINES_MAP, userService) {
        $scope.profileFound = true;
        $scope.loading = true;
        $scope.user = null;
        $scope.loadError = false;
        $scope.disciplines = _.map(DISCIPLINES_MAP, function(translationKey, disciplineKey) {
            return {
                key: disciplineKey,
                label: translationKey
            };
        });
        $scope.selectedDiscipline = $scope.disciplines[0];

        if(!('userIdentifier' in $routeParams)) {
            userService.loadCurrentUser().then(loadProfile, function() {
                $location.path('/register');
            });
        } else {
            User.get({userId: $routeParams.userIdentifier}, loadProfile, function() {
                $scope.profileFound = false;
            }, loadError);
        }

        function loadProfile(user) {
            $scope.user = user;
            console.log($scope.user);
            Activity.get({userId: $scope.user._id}, function(activities) {
                console.log('activities', activities);
            }, loadError);
        }

        function loadError() {
            $scope.loadError = true;
        }
    });
})(angular);