(function (angular) {
    angular.module("trafie")
        .factory("imageService", function () {
            function resizeProfileImage(picture, size) {
                if(size) {
                    var lastIndexOfPeriod = picture.lastIndexOf('.');
                    return [picture.substr(0, lastIndexOfPeriod), picture.substr(lastIndexOfPeriod)].join('.' + size);
                } else {
                    return picture;
                }
            }

            return {
                resizeProfileImage: resizeProfileImage
            };
        });
})(angular);