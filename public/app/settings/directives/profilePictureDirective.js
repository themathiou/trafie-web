(function() {
    angular.module('trafie')
    .directive('profilePicture', function () {
        function link(scope, element, attrs, ngModel) {
            scope.picture = '/images/user-128x128.png';
            scope.croppedPicture = '';

            ngModel.$render = function() {
                scope.picture = ngModel.$viewValue || '';
            };

            function modelFormatter(value) {
                return value;
            }

            function modelParser(value) {
                ngModel.$setValidity('valid', true);
                return valid ? value : undefined;
            }
            ngModel.$formatters.push(modelFormatter);
            ngModel.$parsers.push(modelParser);

            //ngModel.$setViewValue(scope.inputs.join(','));

            var handleFileSelect = function(evt) {
                var file = evt.currentTarget.files[0];
                var reader = new FileReader();
                reader.onload = function (evt) {
                    scope.$apply(function(scope){
                        scope.picture = evt.target.result;
                    });
                };
                console.log(file);
                reader.readAsDataURL(file);
            };

            function imgUrlToBlob(imgUrl, sliceSize) {
                if(!imgUrl) return null;
                var urlParts = imgUrl.split(',');
                var b64Data = urlParts[1];
                urlParts = urlParts[0].split(';');
                var contentType = urlParts[0].split(':')[1];
                sliceSize = 512;

                var byteCharacters = atob(b64Data);
                var byteArrays = [];

                for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    var slice = byteCharacters.slice(offset, offset + sliceSize);

                    var byteNumbers = new Array(slice.length);
                    for (var i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }

                    var byteArray = new Uint8Array(byteNumbers);

                    byteArrays.push(byteArray);
                }

                var blob = new Blob(byteArrays, {type: contentType});
                return blob;
            }

            angular.element(element.find('input')).on('change', handleFileSelect);
            scope.$watch('croppedPicture', function() {
                console.log(imgUrlToBlob(scope.croppedPicture));
            });
        }

        return {
            restrict: 'EA',
            require: 'ngModel',
            replace: true,
            scope: {},
            template:
            '<span class="profile-picture">' +
                '<img ng-src="{{croppedPicture || picture}}" width="128" height="128">' +
                '<input type="file" id="fileInput">' +
                '<div style="height: 128px; width: 128px;"><img-crop image="picture" result-image="croppedPicture"></img-crop></div>' +
            '</span>',
            link: link
        }
    });
})();
