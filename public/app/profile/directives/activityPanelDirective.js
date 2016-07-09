angular.module('trafie')
    .directive('activityPanel', function () {
        function link(scope, element, attrs) {
        }

        return {
            restrict: 'EA',
            replace: true,
            scope: false,
            link: link,
            templateUrl: '/app/profile/views/activityPanelDirectiveView.html'
        }
    });