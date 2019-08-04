angular.module('trafie')
    .directive('activityPanel', function ($uibModal, userService) {
        function link(scope, element, attrs) {
            scope.isEmbedded = attrs.hasOwnProperty('isEmbedded');
            scope.localUser = null;
            scope.isDropdownOpen = false;

            userService.loadCurrentUser().then(function(user) {
                scope.localUser = user;
            });

            scope.isPubliclyVisible = function() {
                return !scope.currentUser.isPrivate && !scope.activity.isPrivate;
            };

            scope.formatUnixTimestamp = function(timestamp) {
                var format = (scope.localUser ? scope.localUser.dateFormat : 'D-M-YYYY') + ' HH:mm';
                return moment.unix(timestamp).format(format);
            };

            scope.hasAdditionalInformation = function() {
                return scope.activity.picture
                    || scope.activity.location
                    || scope.activity.comments
                    || scope.activity.rank
                    || scope.activity.notes
            }
        }

        return {
            restrict: 'EA',
            replace: true,
            scope: false,
            link: link,
            templateUrl: '/app/profile/views/activityPanelDirectiveView.html'
        }
    });