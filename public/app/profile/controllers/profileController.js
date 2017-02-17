(function(angular) {
    angular.module('trafie')
        .controller('ProfileController', function($rootScope, $scope, $routeParams, $window, $http, $location,
                                                  $uibModal, $timeout, $filter, DISCIPLINES, Activity, User,
                                                  userService, pageDataService, activityHelper) {
            $scope.profileFound = true;
            $scope.activitiesLoading = true;
            $scope.user = null;
            $scope.loadError = false;
            $scope.activities = [];
            $scope.newGraphActivities = {};
            $scope.ownProfile = false;
            $scope.currentUser = null;
            $scope.timeLine = {
                mode: 'timeline'
            };
            $scope.filters = {
                values: {}
            };
            var listeners = {};

            /**
             * Initialisation
             */
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
                    parseGraphActivities();
                }, loadError);
            }

            /**
             * Activity deletion
             */
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
                    parseGraphActivities();
                }, function() {});
            };

            /**
             * Activity creation and editing
             */
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
                    parseGraphActivities();
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

            /**
             * Graphs
             */
            function parseGraphActivities() {
                $scope.newGraphActivities = {
                    order: [],
                    activities: {},
                    options: {}
                };

                const activities = $filter('usersFilters')($scope.activities, $scope.filters.values);

                activities
                    .sort((a, b) => b.date - a.date)
                    .forEach(function(activity) {

                        if(!$scope.newGraphActivities.activities.hasOwnProperty(activity.discipline)) {
                            $scope.newGraphActivities.activities[activity.discipline] = {};
                            $scope.newGraphActivities.activities[activity.discipline].data = [[]];
                            $scope.newGraphActivities.activities[activity.discipline].labels = [];
                            $scope.newGraphActivities.order.push(activity.discipline);
                        }

                        let _formattedPerformance = activityHelper.getReadablePerformance(activity.performance, activity.discipline);
                        $scope.newGraphActivities.activities[activity.discipline].data[0].push(_formattedPerformance);
                        let _formattedDate = moment(new Date(activity.date * 1000)).format($scope.currentUser && $scope.currentUser.dateFormat || "D-M-YYYY");
                        $scope.newGraphActivities.activities[activity.discipline].labels.push(_formattedDate);
                    });
            }

            $scope.graphListFilter = (discipline) => $scope.newGraphActivities.activities[discipline].data[0].length > 1;

            $scope.$watch("timeLine.mode", () => $timeout(parseGraphActivities, 0));
            $scope.$watch("filters", () => $timeout(parseGraphActivities, 0), true);


            /**
             * Subscribe on events
             */
            $scope.$on('$destroy', function() {
                if($scope.ownProfile && listeners.hasOwnProperty('activityCreated')) {
                    listeners.activityCreated();
                }
            });
        });
})(angular);