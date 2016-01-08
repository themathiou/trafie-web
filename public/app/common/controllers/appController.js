(function(angular) {
    angular.module('trafie')
    .controller('AppController', function($q, $rootScope, User) {
        var loadingUser = false;
        trafie.loadUser = function() {
            if(loadingUser) {
                return loadingUser;
            }
            var deferred = $q.defer();
            if(trafie.user) {
                trafie.loadUser.resolve(trafie.user);
            }
            else if(trafie.user === null) {
                trafie.loadUser.reject();
            }
            else {
                if(trafie.userId) {
                    User.get({userId: trafie.userId}, function(user) {
                        if(user) {
                            trafie.user = user;
                            deferred.resolve(trafie.user);
                        } else {
                            trafie.user = null;
                            deferred.reject();
                        }
                    });
                } else {
                    trafie.user = null;
                    deferred.reject();
                }
            }
            loadingUser = deferred.promise;
            return deferred.promise;
        }
    });
})(angular);