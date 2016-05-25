(function (angular) {
    angular.module("trafie-outer")
        .factory("outerTitleService", function ($rootScope, $location) {
            var title = '',
                titlePrefix = ' | ';

            $rootScope.$on('$routeChangeSuccess', function(route) {
                var locationPath = angular.copy($location.path());
                locationPath = typeof locationPath === 'string' ? locationPath.split('/').filter(function(v){return v;}).shift() || '' : '';
                switch(locationPath) {
                    case 'login':
                        title = 'Login';
                        break;
                    case 'register':
                        title = 'Register';
                        break;
                    case 'reset-password':
                        title = 'Password reset';
                        break;
                    case 'reset-password-request':
                        title = 'Password reset request';
                        break;
                    case 'validate-email':
                        title = 'Email verification';
                        break;
                    case 'terms-of-service':
                        title = 'Terms of service';
                        break;
                    case 'about':
                        title = 'About';
                        break;
                    case 'privacy':
                        title = 'Privacy';
                        break;
                    default:
                        title = '';
                        break;
                }
            });

            function getTitle() {
                return title ? titlePrefix + title : '';
            }

            return {
                getTitle: getTitle
            };
        });
})(angular);