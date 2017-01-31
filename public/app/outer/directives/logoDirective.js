angular.module('trafie-outer')
    .directive('logo', function () {
        return {
            restrict: 'E',
            template: '<div class="logo-container">' +
                            '<a href="/">' +
                                '<img src="/images/logo.svg" class="logo" alt="trafie logo">' +
                                '<h1 class="text-center text-light">trafie</h1>' +
                            '</a>' +
                            '<div class="text-center lead">' +
                                '<h3 class="text-light h4">Your personal track and field profile</h3>' +
                            '</div>' +
                        '</div>'
        };
    });