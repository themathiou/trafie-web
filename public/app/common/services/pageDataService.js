(function (angular) {
    angular.module("trafie")
        .factory("pageDataService", function ($rootScope, $location) {
            var title = '',
                titlePrefix = ' | ',
                description = '';

            $rootScope.$on('$routeChangeSuccess', function(route) {
                var locationPath = angular.copy($location.path());
                locationPath = typeof locationPath === 'string' ? locationPath.split('/').filter(function(v){return v;}) || [] : [];
                switch(locationPath[0]) {
                    case 'settings':
                        switch(locationPath[1]) {
                            case 'account':
                                title = 'Account settings';
                                description = 'Change your account settings. Change how you see various data in the application, like the dates, the unit system, the language, and choose a username';
                                break;
                            case 'password':
                                title = 'Password settings';
                                description = 'Change your password by entering your old one and the new password that you want to use.';
                                break;
                            default:
                                title = 'Profile settings';
                                description = 'Change your profile data, like your name, discipline, birthday, gender, privacy and more.';
                                break;
                        }
                        break;
                    default:
                        title = '';
                        description = "View the athlete's profile page and the activities performed in a timeline.";
                        break;
                }
            });

            function getTitle() {
                return title ? titlePrefix + title : '';
            }

            function getDescription() {
                return description;
            }

            function setUserInTitle(user) {
                if(!title) {
                    title = user.firstName + ' ' + user.lastName;
                }
            }

            return {
                getTitle: getTitle,
                getDescription: getDescription,
                setUserInTitle: setUserInTitle
            };
        });
})(angular);