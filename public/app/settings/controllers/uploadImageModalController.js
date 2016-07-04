angular.module('trafie')
    .controller('UploadImageModalController', function ($scope, $location, $uibModalInstance, currentPicture, DEFAULT_PICTURE) {
        var baseUrl = $location.protocol() + '://' + $location.host() + ($location.port() ? ':' + $location.port() : '');
        $scope.croppedDataUrl = '';
        $scope.pictureFile = null;
        $scope.userHasDefaultPicture = currentPicture === baseUrl + DEFAULT_PICTURE;

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