(function(angular) {
    angular.module('trafie')
    .controller('AppController', function($translate, userService) {
        self = this;
        self.user = null;
        userService.loadCurrentUser().then(function(user) {
            self.user = user;
            if(user && user.language !== 'en')
                $translate.use(user.language);
        });
    });
})(angular);