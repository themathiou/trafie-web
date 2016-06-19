(function (angular) {
    angular.module('trafie')
    .factory('User', function ($resource, imageService) {
        var User = $resource('/users/:_id', {_id: "@_id"}, {
            update: {
                method: "PUT"
            }
        });

        User.prototype.getPicture = function(size) {
            return imageService.resizeProfileImage(this.picture, size);
        };
        return User;
    });
})(angular);