(function(angular) {
    angular.module('trafie')
        .controller('ProfileController', function($rootScope, $scope, $routeParams, $window, Activity,
                                                  User, userService) {
            $scope.profileFound = true;
            $scope.loading = true;
            $scope.user = null;
            $scope.loadError = false;
            $scope.activities = [];
            $scope.ownProfile = false;
            $scope.currentUser = null;
            var listeners = {};

            function loadError() {
                $scope.loadError = true;
            }

            userService.loadCurrentUser().then(profileLoaded, profileLoaded);

            function profileLoaded(currentUser) {
                $scope.currentUser = currentUser;
                getProfileFromUrl(currentUser);
            }

            function getProfileFromUrl(currentUser) {
                if (!('userIdentifier' in $routeParams)) {
                    if(currentUser) {
                        loadProfile(currentUser);
                    } else {
                        $window.location.href = 'register';
                    }
                } else {
                    User.get({_id: $routeParams.userIdentifier}, loadProfile, function() {
                        $scope.profileFound = false;
                    }, loadError);
                }
            }

            function loadProfile(user) {
                $scope.ownProfile = $scope.currentUser && $scope.currentUser._id === user._id;
                if($scope.ownProfile) {
                    setActivityCreationListener();
                }
                $scope.user = user;
                Activity.get({userId: $scope.user._id}, function(activities) {
                    $scope.activities = [];
                    activities.forEach(function(activity) {
                        $scope.activities.push(new Activity(activity));
                    });
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

            $scope.formatUnixTimestamp = function(timestamp) {
                var format = ($scope.currentUser ? $scope.currentUser.dateFormat : 'DD-MM-YYYY') + ' HH:mm:ss';
                return moment.unix(timestamp).format(format);
            };

            function setActivityCreationListener() {
                listeners.activityCreated = $rootScope.$on('activityCreated', function(event, activity) {
                    var found = false;
                    $scope.activities.forEach(function(scopeActivity) {
                        if(scopeActivity._id === activity._id) {
                            for(i in scopeActivity) {
                                if(scopeActivity.hasOwnProperty(i)) {
                                    scopeActivity[i] = activity[i];
                                }
                            }
                            found = true;
                        }
                    });
                    if(!found) {
                        $scope.activities.push(activity);
                    }
                });
            }

            $scope.$on('$destroy', function() {
                if($scope.ownProfile && listeners.hasOwnProperty('activityCreated')) {
                    listeners.activityCreated();
                }
            });
        });
})(angular);