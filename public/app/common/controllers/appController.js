(function(angular) {
    angular.module('trafie')
    .controller('AppController', function($translate, $location, $window, userService, $uibModal, $rootScope,
                                          $http, $scope, pageDataService) {
        self = this;
        self.user = null;
        self.getTitle = pageDataService.getTitle;
        self.getDescription = pageDataService.getDescription;

        userService.loadCurrentUser().then(function(user) {
            self.user = user;
            if(user && user.language !== 'en')
                $translate.use(user.language);
        });

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

        self.getCurrentPage = function() {
            if($location.path().substr(0, 9) === '/settings') {
                return 'settings'
            }
            else if($location.path() === '/') {
                return 'profile';
            }
            else if(self.user && ['/' + self.user._id, '/' + self.user.username].indexOf($location.path()) >= 0) {
                return 'profile';
            }
        };

        self.showFeedbackModal = function (activity) {
            var modalInstance = $uibModal.open({
                animation: false,
                templateUrl: 'app/feedback/views/feedbackModalView.html',
                controller: 'FeedbackModalController',
                size: 'md'
            });

            modalInstance.result.then(function () {
            }, function () {
            });
        };

        self.forceRedirect = function(path) {
            $window.location.href = '/' + path;
        };

        $scope.$watch(function() {
            return self.profileResult;
        }, self.goToUser);
    });
})(angular);