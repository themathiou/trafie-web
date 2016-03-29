(function(angular) {
    angular.module('trafie-outer')
    .controller('RegisterController', function($scope, $http, $window) {
        $scope.formData = {
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        };
        $scope.errorMessages = [];
        $scope.fieldsWithErrors = {};
        for(var i in $scope.formData) {
            $scope.fieldsWithErrors[i] = false;
        }
        var errorCaptions = {
            firstName: {
                missing: 'Please enter your first name',
                invalid: 'You have entered an invalid first name'
            },
            lastName: {
                missing: 'Please enter your last name',
                invalid: 'You have entered an invalid last name'
            },
            email: {
                missing: 'Please enter your email',
                invalid: 'You have entered an invalid email',
                already_exists: 'The email is already in use'
            },
            password: {
                missing: 'Please choose a password',
                invalid: 'The password should be at least 6 characters long'
            },
            server: 'There was a problem processing your request. Please try later.'
        };

        $scope.register = function() {
            $scope.errorMessages = [];
            $http.post('/register', $scope.formData)
                .then(function(res) {
                    if(res.status === 201 && res.data._id) {
                        $http.post('/login', $scope.formData)
                        .then(function(res) {
                            if(res.status === 200 && res.data._id) {
                                $window.location.href = '/';
                            }
                        });
                    }
                }, function(res) {
                    res.data.errors.forEach(function(error) {
                        $scope.fieldsWithErrors[error.field] = true;
                        if(error.field && errorCaptions[error.field].hasOwnProperty(error.code)) {
                            $scope.errorMessages.push(errorCaptions[error.field][error.code]);
                        } else {
                            $scope.errorMessages.push(errorCaptions.server);
                        }
                    });
                });
        };
    });
})(angular);