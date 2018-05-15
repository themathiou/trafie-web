(function(angular) {
    angular.module('trafie')
        .controller('ActivityController', function(
            $rootScope, $scope, $routeParams, $window, $http, $location, $uibModal, $timeout, $filter, DISCIPLINES,
            Activity, User, userService
        ) {
            $scope.pageFound = true;
            $scope.user = null;
            $scope.loadError = false;
            $scope.activity = null;
            $scope.currentUser = null;

            function loadError() {
                $scope.loadError = true;
            }

            userService.loadCurrentUser().then(profileLoaded, profileLoaded);

            function profileLoaded(currentUser) {
                $scope.currentUser = currentUser;
                loadProfile();
            }

            function loadProfile() {
                User.get({_id: $routeParams.userIdentifier}, function(user) {
                    $scope.user = user;
                    loadActivity();
                }, function() {
                    $scope.pageFound = false;
                }, loadError);
            }

            function loadActivity() {
                $http({
                    method: 'GET',
                    url: '/users/' + $routeParams.userIdentifier + '/activities/' + $routeParams.activityIdentifier,
                }).then(function(response) {
                    $scope.activity = new Activity(response.data);
                }, function() {
                    $scope.pageFound = false;
                });
            }

        });
})(angular);