(function (angular) {
    angular.module('trafie')
    .provider('ActivityResource', [function () {
        this.$get = ['$resource', function ($resource) {
            return $resource('/users/:userId/activities/:activityId', {userId: "@userId", activityId: "@activityId"}, {
                update: {
                    method: "PUT"
                },
                get: {
                    method: "GET",
                    isArray: true
                }
            });
        }];
    }])
    .factory("Activity", function (ActivityResource, userService) {
        var currentUser = null;
        userService.loadCurrentUser().then(function(user) {
            currentUser = user;
        });

        function Activity(activityData) {
            activityData = activityData || {};
            this.userId = angular.isDefined(activityData.userId) ? activityData.userId : currentUser.userId;
            this.discipline = angular.isDefined(activityData.discipline) ? activityData.discipline : '';
            this.performance = angular.isDefined(activityData.performance) ? activityData.performance : null;
            this.date = angular.isDefined(activityData.date) ? activityData.date : moment().unix();
            this.rank = angular.isDefined(activityData.rank) ? activityData.rank : null;
            this.location = angular.isDefined(activityData.location) ? activityData.location : '';
            this.competition = angular.isDefined(activityData.competition) ? activityData.competition : '';
            this.notes = angular.isDefined(activityData.notes) ? activityData.notes : '';
            this.isPrivate = angular.isDefined(activityData.isPrivate) ? activityData.isPrivate : false;
            this.type = angular.isDefined(activityData.type) ? activityData.type : 'competition';
            this.isOutdoor = angular.isDefined(activityData.isOutdoor) ? activityData.isOutdoor : false;
        }

        Activity = angular.extend(Activity, ActivityResource);

        Activity.prototype = new ActivityResource();

        Activity.prototype.validate = function() {

        };
console.log(Activity);
        return Activity;
    });
})(angular);