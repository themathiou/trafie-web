(function(angular) {
    angular.module('trafie')
    .controller('AppController', function(userService) {
        self = this;
        self.user = null;
        userService.loadCurrentUser().then(function(user) {
            self.user = user;
        });
    });
})(angular);