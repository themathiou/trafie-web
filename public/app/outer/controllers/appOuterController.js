(function(angular) {
    angular.module('trafie-outer')
        .controller('AppOuterController', function($scope, outerTitleService) {
            var self = this;
            self.getTitle = outerTitleService.getTitle;
        });
})(angular);