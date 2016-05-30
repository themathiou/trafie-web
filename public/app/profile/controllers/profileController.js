(function(angular) {
    angular.module('trafie')
        .controller('ProfileController', function($rootScope, $scope, $routeParams, $window, $http,
                                                  $uibModal, Activity, User, userService, pageDataService) {
            $scope.profileFound = true;
            $scope.activitiesLoading = true;
            $scope.user = null;
            $scope.loadError = false;
            $scope.activities = [];
            $scope.ownProfile = false;
            $scope.currentUser = null;
            $scope.filters = {
                values: {}
            };
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
                pageDataService.setUserInTitle(user);
                Activity.get({userId: $scope.user._id, isDeleted: false}, function(activities) {
                    $scope.activitiesLoading = false;
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
                }, function() {});
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
                            for(var i in scopeActivity) {
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

            $scope.openActivityEditorModal = function (activity) {
                var modalInstance = $uibModal.open({
                    animation: false,
                    templateUrl: 'app/common/views/activityEditorModalView.html',
                    controller: 'ActivityEditorModalController',
                    size: 'md',
                    resolve: {
                        activityToEdit: function () {
                            return activity || null;
                        }
                    }
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

            $scope.$on('$destroy', function() {
                if($scope.ownProfile && listeners.hasOwnProperty('activityCreated')) {
                    listeners.activityCreated();
                }
            });
        });
})(angular);