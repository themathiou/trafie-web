(function (angular) {
    angular.module("trafie")
        .factory("imageService", function () {
            function resizeImage(picture, size) {
                if(size) {
                    var lastIndexOfPeriod = picture.lastIndexOf('.');
                    return [picture.substr(0, lastIndexOfPeriod), picture.substr(lastIndexOfPeriod)].join('.' + size);
                } else {
                    return picture;
                }
            }

            return {
                resizeImage: resizeImage
            };
        });
})(angular);