(function(angular) {
    angular.module('trafie')
    .controller('AppController', function($translate, $location, $window, userService, $uibModal, $rootScope,
                                          $http, $scope, pageDataService) {
        self = this;
        self.user = null;
        self.getTitle = pageDataService.getTitle;
        self.getDescription = pageDataService.getDescription;
        self.searchValue = "";
        self.searchResults = [];

        userService.loadCurrentUser().then(function(user) {
            self.user = user;
            if(user && user.language !== 'en')
                $translate.use(user.language);
        });

        // @TODO: Different page for search results, triggered by the magnifying glass
        self.searchUsers = function(val) {
            if (val) {
                $http.get('/users', {
                    params: {
                        keywords: val
                    }
                }).then(function(response) {
                    response.data;
                    self.searchResults = response.data;
                });
            } else {
                self.searchResults = [];
            }
        };

        self.getUserUrl = function(user) {
            return '/' + (user.username || user._id);
        };

        self.goToUser = function() {
            if(self.profileResult && angular.isObject(self.profileResult)) {
                $location.path('/' + (self.profileResult.username || self.profileResult._id));
            }
        };

        self.closeOmnisearch = function() {
            $('[data-action="omnisearch-close"]').click();
        }

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
                size: 'lg',
                backdropClass: 'show'

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


        $scope.$watch(function() {
            return self.searchValue;
        }, self.searchUsers);
    });
})(angular);