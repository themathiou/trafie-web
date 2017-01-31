(function(angular) {
    angular.module('trafie-outer')
        .controller('AppOuterController', function($scope, $location, outerPageDataService) {
            var self = this;
            self.getTitle = outerPageDataService.getTitle;
            self.getDescription = outerPageDataService.getDescription;
            self.bodyClasses = [];
            $scope.$on('$routeChangeSuccess', function() {
                if($location.path() === '/') {
                    self.bodyClasses = ['register-page'];
                } else {
                    self.bodyClasses = ['app', 'on-canvas', 'nav-min', 'layout-horizontal', 'body-has-background', 'generic-outer-page'];
                }
            });
        });
})(angular);