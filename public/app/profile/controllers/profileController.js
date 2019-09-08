(function(angular) {
    angular.module('trafie')
        .controller('ProfileController', function($rootScope, $scope, $routeParams, $window, $http, $location,
                                                  $uibModal, $timeout, $filter, DISCIPLINES, Activity, User,
                                                  userService, pageDataService, activityHelper, DEFAULT_DATE_FORMAT) {
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
                Activity.get({ userId: $scope.user._id, isDeleted: false }, function(activities) {
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
                    size: 'lg',
                    backdropClass: 'show',
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
                    size: 'lg',
                    backdropClass: 'show',
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
                };

                const activities = $filter('usersFilters')($scope.activities, $scope.filters.values);

                activities
                    .sort(function(a, b) { return a.date - b.date })
                    .filter(function (activity) { return !activity.isUpcoming })
                    .forEach(function(activity) {
                        if(!$scope.newGraphActivities.activities.hasOwnProperty(activity.discipline)) {
                            $scope.newGraphActivities.activities[activity.discipline] = {};
                            $scope.newGraphActivities.activities[activity.discipline].data = [[]];
                            $scope.newGraphActivities.activities[activity.discipline].labels = [];
                            $scope.newGraphActivities.activities[activity.discipline].activities = [];
                            $scope.newGraphActivities.activities[activity.discipline].options = {
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            callback: (value, index, values) => activityHelper.fractionHtmlToSymbol(
                                                activityHelper.getReadablePerformance(value, activity.discipline)
                                            )
                                        }
                                    }]
                                },
                                tooltips: {
                                    displayColors: false,
                                    callbacks: {
                                        label: (tooltipItem) => {
                                            const competition = $scope.newGraphActivities.activities[activity.discipline].activities[
                                                tooltipItem.index
                                            ].competition;

                                            const performance = activityHelper.fractionHtmlToSymbol(
                                                activityHelper.getReadablePerformance(tooltipItem.yLabel, activity.discipline)
                                            );
                                            return [
                                                `${$filter('translate')('PROFILE.COMPETITION')}: ${competition}`,
                                                `${$filter('translate')('PROFILE.PERFORMANCE')}: ${performance}`
                                            ];
                                        }
                                    }
                                },
                                elements: {
                                    point: {
                                        radius: 4
                                    }
                                }
                            };
                            $scope.newGraphActivities.order.push(activity.discipline);
                        }

                        $scope.newGraphActivities.activities[activity.discipline].data[0].push(activity.performance);
                        const formattedDate = moment(new Date(activity.date * 1000))
                            .format($scope.currentUser && $scope.currentUser.dateFormat || DEFAULT_DATE_FORMAT);
                        $scope.newGraphActivities.activities[activity.discipline].labels.push(formattedDate);
                        $scope.newGraphActivities.activities[activity.discipline].activities.push(activity);
                    });
            }

            $scope.graphListFilter = (discipline) => $scope.newGraphActivities.activities[discipline].data[0].length > 1;

            /*
             * Filters
             */

            $scope.filterOptions = {
                outdoor: {
                    property: 'isOutdoor',
                    inputType: 'toggle',
                    options: [],
                    label: 'PROFILE.COMPETITION_TYPE',
                    valueLabels: {
                        'true': 'PROFILE.OUTDOOR',
                        'false': 'PROFILE.INDOOR'
                    }
                },
                years: {
                    property: 'year',
                    inputType: 'multiSelect',
                    options: [],
                    label: 'PROFILE.YEAR',
                    placeholder: 'PROFILE.SELECT_YEARS_TO_FILTER',
                    translationPrefix: ''
                },
                disciplines: {
                    property: 'discipline',
                    inputType: 'multiSelect',
                    options: [],
                    label: 'COMMON.DISCIPLINE',
                    placeholder: 'PROFILE.SELECT_DISCIPLINES_TO_FILTER',
                    translationPrefix: 'DISCIPLINES.'
                }
            };
            $scope.selectedFilters = {};


            $scope.$watchCollection('activities', function() {
                var selected = {};
                Object.keys($scope.filterOptions).forEach(function(filterCategory) {
                    selected[filterCategory] = [];
                    $scope.filterOptions[filterCategory].options = [];
                });
                angular.copy($scope.activities).forEach(function(activity) {
                    activity.year = moment.unix(activity.date).format('YYYY');
                    Object.keys($scope.filterOptions).forEach(function(filterCategory) {
                        var filterProperty = $scope.filterOptions[filterCategory].property;
                        if(selected[filterCategory].indexOf(activity[filterProperty]) < 0) {
                            selected[filterCategory].push(activity[filterProperty]);
                            var text = activity[filterProperty];
                            if($scope.filterOptions[filterCategory].translationPrefix) {
                                text = $scope.filterOptions[filterCategory].translationPrefix + activity[filterProperty].toUpperCase();
                            }
                            $scope.filterOptions[filterCategory].options.push({
                                text: text,
                                value: activity[filterProperty]
                            });
                        }
                    });
                });
            });

            $scope.filterOptionsExist = function() {
                return Object.keys($scope.filterOptions).some(function(filterCategory) {
                    return $scope.filterOptions[filterCategory].options.length > 1;
                });
            };

            $scope.openActivityFiltersModal = function() {
                var modalInstance = $uibModal.open({
                    animation: false,
                    templateUrl: 'app/profile/views/activityFiltersModalView.html',
                    controller: 'ActivityFiltersModalController',
                    size: 'lg',
                    backdropClass: 'show',
                    resolve: {
                        activities: function() {
                            return $scope.activities;
                        },
                        filterOptions: function() {
                            return $scope.filterOptions;
                        },
                        selectedFilters: function() {
                            return $scope.selectedFilters;
                        },
                        filters: function() {
                            return $scope.filters;
                        }
                    }
                });

                modalInstance.result.then(function(result) {
                    $scope.filters = result.filters;
                    $scope.selectedFilters = result.selectedFilters;
                }, function() {

                });

            };

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