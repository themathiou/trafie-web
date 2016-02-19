(function(angular) {
    angular.module('trafie')
        .controller('ProfileController', function($rootScope, $scope, $routeParams, $window, Activity,
                                                  User, userService) {
            $scope.profileFound = true;
            $scope.loading = true;
            $scope.user = null;
            $scope.loadError = false;
            $scope.activities = [];

            function loadError() {
                $scope.loadError = true;
            }

            if (!('userIdentifier' in $routeParams)) {
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
                Activity.get({userId: $scope.user._id}, function(activities) {
                    $scope.activities = activities;
                }, loadError);
            }

            $scope.deleteActivity = function(activity) {
                activity.$delete()
                .then(function() {
                    var deletedActivityIndex = index = -1;
                    $scope.activities.forEach(function(item, index) {
                        if(item._id === activity._id) {
                            deletedActivityIndex = index;
                        }
                    });

                    $scope.activities.splice(deletedActivityIndex, 1);
                }, function() {

                });
            };
        });
})(angular);