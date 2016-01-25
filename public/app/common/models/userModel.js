(function (angular) {
    angular.module('trafie')
        .provider('User', [function () {
            this.$get = ['$resource', function ($resource) {
                return $resource('/users/:_id', {_id: "@_id"}, {
                    update: {
                        method: "PUT"
                    }
                });
            }];
        }]);
})(angular);