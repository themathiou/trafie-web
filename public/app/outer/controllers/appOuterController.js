(function(angular) {
    angular.module('trafie-outer')
        .controller('AppOuterController', function($scope, outerPageDataService) {
            var self = this;
            self.getTitle = outerPageDataService.getTitle;
            self.getDescription = outerPageDataService.getDescription;
        });
})(angular);