(function (angular) {
    angular.module("trafie")
    .factory("userService", function ($q, User) {
        var self = this;
        self._loadingUser = false;
        self._user = undefined;
        self._userId = trafie.userId;

        function loadCurrentUser() {
            if(self._loadingUser) {
                return self._loadingUser;
            }
            var deferred = $q.defer();
            if(self._user) {
                deferred.resolve(self._user);
            }
            else if(self._user === null) {
                deferred.reject();
            }
            else {
                if(self._userId) {
                    User.get({userId: self._userId}, function(user) {
                        if(user) {
                            self._user = user;
                            deferred.resolve(self._user);
                        } else {
                            self._user = null;
                            deferred.reject();
                        }
                    });
                } else {
                    self._user = null;
                    deferred.reject();
                }
            }
            self._loadingUser = deferred.promise;
            return deferred.promise;
        }

        return {
            loadCurrentUser: loadCurrentUser
        };
    });
})(angular);