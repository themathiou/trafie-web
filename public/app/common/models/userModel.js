(function (angular) {
    angular.module('trafie')
        .provider('User', [function () {
            this.$get = ['$resource', function ($resource) {
                return $resource('/users/:userId', {userId: "@userId"}, {
                    update: {
                        method: "PUT"
                    }
                });
            }];
        }]);
})(angular);