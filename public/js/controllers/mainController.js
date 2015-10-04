// Initialize the controllers. This MUST be the first controller that is loaded.
angular.module('trafie.controllers' , ['ui.bootstrap']);

(function () {
    'use strict';

    angular.module('trafie.controllers').controller("mainController", [
        '$rootScope','$window','$scope','$http','$routeParams','$location','$timeout','ModalSvc','AlertSvc',
        function($rootScope, $window, $scope, $http, $routeParams, $location, $timeout, ModalSvc, AlertSvc) {
            //////////////////////////////////////////////
            // GENERAL
            //////////////////////////////////////////////
            $scope.appInit = function() {
                // if device size < 768px consider it as isMobile
                $window.innerWidth < 768 ? $scope.isMobile = true : $scope.isMobile = false;
                //isTouch. we need to create function for this check
                $scope.isTouch = (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
            };

            $scope.$on('$routeChangeSuccess', function() {
                switch ($location.path()) {
                    case '/login':
                        $window.location.href = '/login';
                    case '/register':
                        $window.location.href = '/register';
                }
            });

            ///////////////////////////////////////////////////////
            // Validation Patterns
            ///////////////////////////////////////////////////////
            $scope.ONLY_ALPHABETIC = Utils.ONLY_ALPHABETIC;
            $scope.ALPHABETIC_NUMS_DOT_UNDER = Utils.ALPHABETIC_NUMS_DOT_UNDER;
            $scope.NUMBERS = Utils.NUMBERS;

            ///////////////////////////////////////////////////////
            // On window resize
            ///////////////////////////////////////////////////////
            $window.onresize = function() {
                // if device size < 768px consider it as isMobile
                $window.innerWidth < 768 ? $scope.isMobile = true : $scope.isMobile = false;
                $scope.$apply();
            }

            ///////////////////////////////////////////////////////
            // SEARCH USERS
            ///////////////////////////////////////////////////////
            /**
             * [searches users]
             * @param
             */
            $scope.searchUser = function(val) {
                return $http.get('/users/?keywords=' + val)
                    .then(function(res) {
                        var results = [];
                        angular.forEach(res.data, function(tmp_user) {
                            tmp_user.label = tmp_user.first_name + ' ' + tmp_user.last_name;
                            if (tmp_user.formatted_discipline) {
                                tmp_user.label += ' - ' + tmp_user.formatted_discipline;
                            }
                            results.push(tmp_user);
                        });
                        return results;
                    });
            };
            /**
             * onSelect
             */
            $scope.onSelect = function($item, $model, $label) {
                //user  lower-level API for reloading page
                $window.location.href = '/' + $item._id;
            };

            ///////////////////////////////////////////////////////
            // FILE Upload
            ///////////////////////////////////////////////////////
            $scope.onFileSelect = function($files) {
                $scope.filesToUpload = $files;
            }

            /**
             * [Logs out]
             */
            $scope.logout = function() {
                $rootScope.localUser = {};
                $window.location.href = '/logout';
            }

            ///////////////////////////////////////////////////////
            // FEEDBACK MODAL
            ///////////////////////////////////////////////////////
            /*
              openFeedbackForm function : calls the modal with the feedback form
             */
            $scope.openFeedbackForm = function() {
                ModalSvc.openFeedbackModal('lg')
                    .then(function(result) {
                        if (result) {
                            for (var i in $scope.activities) {
                                if ($scope.activities[i]._id == activity_id) {
                                    $scope.activities.splice(i, 1);
                                    break;
                                }
                            }
                            AlertSvc.addAlert('success', 'Thank you for your feedback!');
                        } else {
                            AlertSvc.addAlert('warning', 'Something went wrong and message couldn\'t be sent. Please try again');
                        }
                    });
            }


            ///////////////////////////////////////////////////////
            // DATEPICKER bootstrap settings - TO CHANGE AND MOVED
            ///////////////////////////////////////////////////////
            $scope.today = function() {
                $scope.dt = new Date();
            }
            $scope.today();

            $scope.clear = function() {
                $scope.dt = null;
            };

            $scope.toggleMax = function() {
                $scope.maxDate = $scope.maxDate || new Date();
            };
            $scope.toggleMax();

            $scope.dateOptions = {
                formatYear: 'yyyy',
                startingDay: 1
            };

            $scope.localUserBirthDate = $rootScope.localUser && $rootScope.localUser.birthday ? new Date($rootScope.localUser.year + '-' + $rootScope.localUser.month + '-' + $rootScope.localUser.day) : new Date();
            $scope.showWeeks = false;
            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];
            /*
           end datepicker
           */

        }
    ]);
})();




