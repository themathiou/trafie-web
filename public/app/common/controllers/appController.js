(function(angular) {
    angular.module('trafie')
    .controller('AppController', function($translate, userService, $uibModal, $rootScope) {
        self = this;
        self.user = null;
        userService.loadCurrentUser().then(function(user) {
            self.user = user;
            if(user && user.language !== 'en')
                $translate.use(user.language);
        });

        self.openActivityEditorModal = function (activity) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/common/views/activityEditorModalView.html',
                controller: 'ActivityEditorModalController',
                size: 'md',
                resolve: {
                    activityToEdit: function () {
                        return activity || null;
                    }
                }
            });

            modalInstance.result.then(function (activity) {
                $rootScope.$broadcast('activityCreated', activity);
            }, function () {

            });
        };
    });
})(angular);