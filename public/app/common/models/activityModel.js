(function (angular) {
    angular.module('trafie')
    .provider('Activity', [function () {
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
    }]);
})(angular);