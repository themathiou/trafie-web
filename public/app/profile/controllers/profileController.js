(function(angular) {
    angular.module('trafie')
    .controller('ProfileController', function($rootScope, $scope, $routeParams, $window, Activity,
                                              User, userService) {
        $scope.profileFound = true;
        $scope.loading = true;
        $scope.user = null;
        $scope.loadError = false;

        if(!('userIdentifier' in $routeParams)) {
            userService.loadCurrentUser().then(loadProfile, function() {
                $window.location.href = 'register';
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