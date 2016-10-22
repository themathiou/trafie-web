(function(angular) {
    angular.module('trafie')
        .controller('ProfileController', function($rootScope, $scope, $routeParams, $window, $http, $location,
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
                if (!$routeParams.hasOwnProperty('userIdentifier')) {
                    if(currentUser) {
                        $location.path('/' + (currentUser.username || currentUser._id)).replace();
                    } else {
                        $window.location.href = '/';
                    }
                } else {
                    if(angular.isObject(currentUser) && ($routeParams.userIdentifier === currentUser._id || $routeParams.userIdentifier === currentUser.username)) {
                        loadProfile(currentUser);
                    } else {
                        User.get({_id: $routeParams.userIdentifier}, loadProfile, function() {
                            $scope.profileFound = false;
                        }, loadError);
                    }
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
                    let args = $location.search();
                    if(args.hasOwnProperty('activityId')) {
                        //@TODO: Replace with array.prototype.find after installing a polyfill
                        let found = false;
                        $scope.activities.forEach(function(activity) {
                            if(activity._id === args.activityId) {
                                found = true;
                                $scope.openActivityDisplayModal(activity);
                            }
                        });
                        if(!found) {
                            delete args.activityId;
                            $location.search(args);
                        }
                    }
                }, loadError);
            }

            $scope.deleteActivity = function(activity) {
                activity.$delete()
                .then(function() {
                    var deletedActivityIndex = -1;
                    $scope.activities.forEach(function(item, index) {
                        if(item._id === activity._id) {
                            deletedActivityIndex = index;
                        }
                    });

                    $scope.activities.splice(deletedActivityIndex, 1);
                }, function() {});
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
                    templateUrl: 'app/profile/views/activityEditorModalView.html',
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

            $scope.openActivityDisplayModal = function(activity) {
                var modalInstance = $uibModal.open({
                    animation: false,
                    templateUrl: 'app/profile/views/activityDisplayModalView.html',
                    controller: 'ActivityDisplayModalController',
                    size: 'md',
                    resolve: {
                        activityToDisplay: function () {
                            return activity;
                        }
                    }
                });

                modalInstance.result.then(removeActivityParam, removeActivityParam);

                function removeActivityParam() {
                    let args = $location.search();
                    delete args.activityId;
                    $location.search(args);
                }
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