(function (angular) {
    angular.module("trafie-outer")
        .factory("outerPageDataService", function ($rootScope, $location) {
            var title = '',
                titlePrefix = ' | ',
                description = '';

            $rootScope.$on('$routeChangeSuccess', function(route) {
                var locationPath = angular.copy($location.path());
                locationPath = typeof locationPath === 'string' ? locationPath.split('/').filter(function(v){return v;}).shift() || '' : '';
                switch(locationPath) {
                    case '':
                        title = 'Join';
                        description = 'Trafie, the professional tool for managing, analyzing and sharing your personal track and field profile.';
                        break;
                    case 'login':
                        title = 'Login';
                        description = 'Log into Trafie. The professional tool for managing, analyzing and sharing your personal track and field profile.';
                        break;
                    case 'register':
                        title = 'Register';
                        description = 'Create an account on Trafie. The professional tool for managing, analyzing and sharing your personal track and field profile.';
                        break;
                    case 'reset-password':
                        title = 'Password reset';
                        description = 'Enter a new password, in case you got locked out of your account.';
                        break;
                    case 'reset-password-request':
                        title = 'Password reset request';
                        description = 'Reset your password, in case you got locked out of your account. We will send you instructions to create a new password via email.';
                        break;
                    case 'validate-email':
                        title = 'Email verification';
                        description = 'Verify your email in order to access the full range of features Trafie offers.';
                        break;
                    case 'terms-of-service':
                        title = 'Terms of service';
                        description = 'Usage of Trafie requires the acceptance of its terms of service.';
                        break;
                    case 'about':
                        title = 'About';
                        description = 'Learn more about Trafie, what it does, how you can get the most out of it and who are the people behind it.';
                        break;
                    case 'privacy':
                        title = 'Privacy';
                        description = 'Usage of Trafie requires the acceptance of its privacy policy.';
                        break;
                    default:
                        title = '';
                        description = '';
                        break;
                }
            });

            function getTitle() {
                return title ? titlePrefix + title : '';
            }

            function getDescription() {
                return description;
            }

            return {
                getTitle: getTitle,
                getDescription: getDescription
            };
        });
})(angular);