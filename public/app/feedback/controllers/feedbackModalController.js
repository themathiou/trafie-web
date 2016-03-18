angular.module('trafie')
    .controller('FeedbackModalController', function ($scope, $uibModalInstance, notify, $http, $filter) {
        $scope.sending = false;
        $scope.formData = {
            feedbackType: 'comment',
            feedback: ''
        };

        $scope.send = function () {
            if(window.hasOwnProperty('navigator') && 'oscpu' in window.navigator) {
                $scope.formData.osVersion = navigator.oscpu;
            }
            else if(window.hasOwnProperty('navigator') && 'platform' in window.navigator) {
                $scope.formData.osVersion = navigator.platform;
            }
            $http.post('/feedback', $scope.formData)
                .then(function(res) {
                    if(res.status === 200) {
                        notify({
                            message: $filter('translate')('FEEDBACK.THANK_YOU_YOUR_FEEDBACK_HAS_BEEN_SENT'),
                            classes: 'alert-success'
                        });
                        $uibModalInstance.close('close');
                    }
                }, function(res) {

                });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });