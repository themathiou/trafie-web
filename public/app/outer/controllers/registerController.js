(function(angular) {
    angular.module('trafie-outer')
    .controller('RegisterController', function($scope, $http, $window) {
        $scope.formData = {
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        };
        $scope.loading = false;
        $scope.errorMessages = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            server: ""
        };
        function resetErrorMessages() {
            $scope.errorMessages = {
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                server: ""
            };
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

        $scope.disciplinesMap = {"60M":"60m","100M":"100m","200M":"200m","400M":"400m","800M":"800m","1500M":"1500m","3000M":"3000m","5000M":"5000m","10000M":"10000m","60M_HURDLES":"60m hurdles","100M_HURDLES":"100m hurdles","110M_HURDLES":"110m hurdles","400M_HURDLES":"400m hurdles","3000M_STEEPLECHASE":"3000m steeplechase","4X100M_RELAY":"4x100m relay","4X400M_RELAY":"4x400m relay","HALF_MARATHON":"Half marathon","MARATHON":"Marathon","20KM_RACE_WALK":"20km race walk","50KM_RACE_WALK":"50km race walk","CROSS_COUNTRY_RUNNING":"Cross country running","HIGH_JUMP":"High jump","LONG_JUMP":"Long jump","TRIPLE_JUMP":"Triple jump","POLE_VAULT":"Pole vault","SHOT_PUT":"Shot put","DISCUS":"Discus","HAMMER":"Hammer","JAVELIN":"Javelin","PENTATHLON":"Pentathlon","HEPTATHLON":"Heptathlon","DECATHLON":"Decathlon"};
        var disciplines = ['60m','100m','200m','400m','800m','1500m','3000m','5000m','10000m','60m hurdles','100m hurdles','110m hurdles','400m hurdles','3000m steeplechase','4x100m relay','4x400m relay','Half marathon','Marathon','20km race walk','50km race walk','Cross country running','High jump','Long jump','Triple jump','Pole vault','Shot put','Discus','Hammer','Javelin','Pentathlon','Heptathlon','Decathlon']
        if ($("#type-disciplines").length) {
            new window.Typed("#type-disciplines", {
                // Waits 1000ms after typing "First"
                strings: disciplines,
                typeSpeed: 100,
                loop: true,
                shuffle: true,
            });
        }
        var userIds = ["574544560d5ed80300c7dc51", "5d261e73661628002cbb9758", "5b30a66f30b4900400371c73", "5d32eb940fb6ca002cc7f16a"];
        $scope.featuredUsers = [];
        if ($("#featured-atheletes").length) {
            for (var i = 0 ; i < userIds.length ; i++) {
                $http.get("/users/" + userIds[i])
                    .then(function(res) {
                        if (res.status === 200) {
                            $scope.featuredUsers.push(res.data);
                        }
                    });
            }
        }
        
        var $shape = $('.shape-container');

        function init($this) {
            var svgHeight = $this.find('svg').height();
            // alert(svgHeight)
            $this.css({
                'height': svgHeight + 'px'
            });
        }

        function adjustShapeHeight() {
            if ($shape.length) {
                $shape.each(function() {
                    init($(this));
                });
            }
        }
        $(window).on({
            'load resize': adjustShapeHeight
        });
        adjustShapeHeight();


        $scope.register = function() {
            resetErrorMessages();
            $scope.loading = true;
            $http.post('/register', $scope.formData)
                .then(function(res) {
                    if(res.status === 201 && res.data._id) {
                        $http.post('/login', $scope.formData)
                        .then(function(res) {
                            if(res.status === 200 && res.data._id) {
                                $window.location.href = '/';
                            }
                        }, function() {
                            $scope.loading = false;
                        });
                    } else {
                        $scope.loading = false;
                    }
                }, function(res) {
                    res.data.errors.forEach(function(error) {
                        if(error.field && errorCaptions[error.field].hasOwnProperty(error.code)) {
                            $scope.errorMessages[error.field] = errorCaptions[error.field][error.code];
                        } else {
                            $scope.errorMessages[error.field] = errorCaptions.server;
                        }
                    });
                    $scope.loading = false;
                });
        };
    });
})(angular);