angular.module('trafie-outer')
    .directive('availableOnBadges', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="available-on-badges-container">' +
                    '<a class="available-on-badge-link" target="_blank" href="https://itunes.apple.com/cg/app/trafie/id1055761534">' +
                        '<img class="available-on-badge-image available-on-badge-image-ios" src="/images/outer/Download_on_the_App_Store_Badge_US-UK_135x40.svg">' +
                    '</a>' +
                    '<a class="available-on-badge-link" target="_blank" href="https://play.google.com/store/apps/details?id=com.trafie">' +
                        '<img class="available-on-badge-image" src="/images/outer/google-play-badge.png">' +
                    '</a>' +
            '</div>'
        };
    });