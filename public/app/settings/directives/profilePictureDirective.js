(function() {
    angular.module('trafie')
    .directive('profilePicture', function ($uibModal, $location, $timeout, imageService, DEFAULT_PICTURE) {
        function link(scope, element, attrs, ngModel) {
            var urlParameters = $location.search();
            scope.picture = '';

            function modelFormatter(value) {
                if(value) {
                    scope.picture = imageService.resizeImage(value, 'sm');
                }
                return value || '';
            }

            function modelParser(value) {
                var valid = true;
                ngModel.$setValidity('valid', valid);
                return valid ? value : undefined;
            }
            ngModel.$formatters.push(modelFormatter);
            ngModel.$parsers.push(modelParser);

            scope.showImageUploaderModal = function () {
                var modalInstance = $uibModal.open({
                    animation: false,
                    templateUrl: 'app/settings/views/uploadImageModalView.html',
                    controller: 'UploadImageModalController',
                    size: 'lg',
                    backdropClass: 'show',
                    resolve: {
                        currentPicture: function() {
                            return ngModel.$modelValue;
                        }
                    }
                });

                modalInstance.result.then(function (croppedDataUrl) {
                    scope.picture = croppedDataUrl || DEFAULT_PICTURE;
                    ngModel.$setViewValue(croppedDataUrl || '');
                }, function () {});
            };

            if(urlParameters.hasOwnProperty('showImageUploadModal') && urlParameters.showImageUploadModal === 'true') {
                delete urlParameters.showImageUploadModal;
                $location.search(urlParameters);
                $timeout(function() {
                    scope.showImageUploaderModal();
                });
            }
        }

        return {
            restrict: 'EA',
            require: 'ngModel',
            replace: true,
            scope: {},
            template:
                '<span class="avatar avatar-lg rounded-circle mr-3" ng-mouseenter="uploadPromptShown = true"' +
                    'ng-mouseleave="uploadPromptShown = false" ng-click="showImageUploaderModal()">' +
                    '<span class="avatar-upload-prompt" ng-show="uploadPromptShown">' +
                        '<span class="avatar-upload-prompt-text" translate="COMMON.CHANGE_PICTURE"></span>' +
                    '</span>' +
                    '<img ng-src="{{picture}}">' +
                '</span>',
            link: link
        }
    });
})();
