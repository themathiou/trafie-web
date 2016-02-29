(function(angular) {
    angular.module('trafie')
    .controller('AppController', function($translate, $location, userService, $uibModal, $rootScope, $http, $scope) {
        self = this;
        self.user = null;
        userService.loadCurrentUser().then(function(user) {
            self.user = user;
            if(user && user.language !== 'en')
                $translate.use(user.language);
        });

        self.openActivityEditorModal = function (activity) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/common/views/activityEditorModalView.html',
                controller: 'ActivityEditorModalController',
                size: 'md',
                resolve: {
                    activityToEdit: function () {
                        return activity || null;
                    }
                }
            });

            modalInstance.result.then(function (activity) {
                $rootScope.$broadcast('activityCreated', activity);
            }, function () {

            });
        };

        // @TODO: Different page for search results, triggered by the magnifying glass
        self.searchUsers = function(val) {
            return $http.get('/users', {
                params: {
                    keywords: val
                }
            }).then(function(response) {
                return response.data;
            });
        };

        self.goToUser = function() {
            if(self.profileResult && angular.isObject(self.profileResult)) {
                $location.path('/' + (self.profileResult.username || self.profileResult._id));
            }
        };

        $scope.$watch(function() {
            return self.profileResult;
        }, self.goToUser);
    });
})(angular);