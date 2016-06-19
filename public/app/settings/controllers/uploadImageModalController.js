angular.module('trafie')
    .controller('UploadImageModalController', function ($scope, $uibModalInstance, currentPicture, DEFAULT_PICTURE) {
        $scope.croppedDataUrl = '';
        $scope.pictureFile = null;
        $scope.userHasDefaultPicture = currentPicture === DEFAULT_PICTURE;

        $scope.removeCurrent = function() {
            $uibModalInstance.close();
        };

        $scope.ok = function (croppedDataUrl) {
            $uibModalInstance.close(croppedDataUrl);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });