(function (angular) {
    angular.module("trafie")
    .factory("userService", function ($q, $http, User) {
        const self = this;
        self._loadingUser = false;
        self._userId = undefined;
        self._user = undefined;

        function fetchUser(deferred) {
            User.get({_id: self._userId}, function (user) {
                if (user) {
                    self._user = user;
                    deferred.resolve(self._user);
                } else {
                    self._user = null;
                    deferred.reject();
                }
            });
        }

        function loadCurrentUser() {
            if (self._loadingUser) {
                return self._loadingUser;
            }
            const deferred = $q.defer();
            if (self._user) {
                deferred.resolve(self._user);
            } else if (self._user === null) {
                deferred.reject();
            } else if (self._userId) {
                fetchUser(deferred);
            } else if (self._userId === null) {
                deferred.reject();
            } else if (!self._userId) {
                $http.get("/user-id")
                    .then(function(response) {
                        if (response.data && response.data._id) {
                            self._userId = response.data._id;
                            fetchUser(deferred);
                        } else {
                            self._user = null;
                            self._userId = null;
                            deferred.reject();
                        }
                    },function(response) {
                        self._user = null;
                        self._userId = null;
                        deferred.reject();
                    });
            } else {
                self._user = null;
                deferred.reject();
            }
            self._loadingUser = deferred.promise;
            return deferred.promise;
        }

        return {
            loadCurrentUser: loadCurrentUser
        };
    });
})(angular);