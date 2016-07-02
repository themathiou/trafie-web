(function (angular) {
    angular.module('trafie')
    .factory('User', function ($resource, imageService) {
        var User = $resource('/users/:_id', {_id: "@_id"}, {
            update: {
                method: "PUT"
            }
        });

        User.prototype.getPicture = function(size) {
            return imageService.resizeImage(this.picture, size);
        };
        return User;
    });
})(angular);