trafie.controller("mainController", [
    '$rootScope','$window','$scope','$http','$routeParams','$location','$timeout','$modalSvc','$alertSvc','$upload',
    function($rootScope, $window, $scope, $http, $routeParams, $location, $timeout, $modalSvc, $alertSvc, $upload) {
        ///////////////////////////////////////////////////////
        // GENERAL
        ///////////////////////////////////////////////////////
        $scope.appInit = function() {
            // if device size < 768px consider it as mobile
            $window.innerWidth < 768 ? $scope.mobile = true : $scope.mobile = false;
        };

        $scope.$on('$routeChangeSuccess', function() {
            switch ($location.path()) {
                case '/login':
                    $window.location.href = '/login';
                case '/register':
                    $window.location.href = '/register';
            }
        });

        ///////////////////////////////////////////////////////
        // On window resize
        ///////////////////////////////////////////////////////
        $window.onresize = function() {
            // if device size < 768px consider it as mobile
            $window.innerWidth < 768 ? $scope.mobile = true : $scope.mobile = false;
            $scope.$apply();
        }

        ///////////////////////////////////////////////////////
        // SEARCH USERS
        ///////////////////////////////////////////////////////
        /**
         * [searches users]
         * @param
         */
        $scope.searchUser = function(val) {
            return $http.get('/users/?keywords=' + val)
                .then(function(res) {
                    var results = [];
                    angular.forEach(res.data, function(tmp_user) {
                        tmp_user.label = tmp_user.first_name + ' ' + tmp_user.last_name;
                        if (tmp_user.formatted_discipline) {
                            tmp_user.label += ' - ' + tmp_user.formatted_discipline;
                        }
                        results.push(tmp_user);
                    });
                    return results;
                });
        };
        /**
         * onSelect
         */
        $scope.onSelect = function($item, $model, $label) {
            //user  lower-level API for reloading page
            $window.location.href = '/' + $item._id;
        };

        ///////////////////////////////////////////////////////
        // Validation Patterns
        ///////////////////////////////////////////////////////
        $rootScope.ONLY_ALPHABETIC = /^[A-Za-z ]+$/;
        $rootScope.ALPHABETIC_NUMS_DOT_UNDER = /^[A-Za-z_.0-9]+$/;


        ///////////////////////////////////////////////////////
        // SHOULD BE MOVED INTO A SERVICE
        // File Upload Functions and vars
        ///////////////////////////////////////////////////////

        $scope.onFileSelect = function($files) {
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.upload = $upload.upload({
                    url: '/settings_data', 
                    method: 'POST', //or 'PUT'
                    //headers: {'header-key': 'header-value'},
                    //withCredentials: true,
                    data: {
                        profile_pic: file
                    },
                    file: file // or list of files ($files) for html5 only
                    //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
                    // customize file formData name ('Content-Disposition'), server side file variable name. 
                    //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file' 
                    // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
                    //formDataAppender: function(formData, key, val){}
                }).progress(function(evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function(data, status, headers, config) {
                    // file is uploaded successfully
                    console.log(data);
                });
                //.error(...)
                //.then(success, error, progress); 
                // access or attach event listeners to the underlying XMLHttpRequest.
                //.xhr(function(xhr){xhr.upload.addEventListener(...)})
            }
        }
        // $scope.usingFlash = false; //FileAPI && FileAPI.upload != null;
        // $scope.fileReaderSupported = false; //window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
        // $scope.uploadRightAway = false;
        // $scope.uploadUrl = 'settings_data';

        // $scope.hasUploader = function(index) {
        //     return $scope.upload[index] != null;
        // };
        // $scope.abort = function(index) {
        //     $scope.upload[index].abort();
        //     $scope.upload[index] = null;
        // };
        // $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        //     window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';

        // $scope.onFileSelect = function($files) {
        //     $scope.selectedFiles = [];
        //     $scope.progress = [];
        //     if ($scope.upload && $scope.upload.length > 0) {
        //         for (var i = 0; i < $scope.upload.length; i++) {
        //             if ($scope.upload[i] != null) {
        //                 $scope.upload[i].abort();
        //             }
        //         }
        //     }
        //     $scope.upload = [];
        //     $scope.uploadResult = [];
        //     $scope.selectedFiles = $files;
        //     $scope.dataUrls = [];
        //     for (var i = 0; i < $files.length; i++) {
        //         var $file = $files[i];
        //         if ($scope.fileReaderSupported && $file.type.indexOf('image') > -1) {
        //             var fileReader = new FileReader();
        //             fileReader.readAsDataURL($files[i]);
        //             var loadFile = function(fileReader, index) {
        //                 fileReader.onload = function(e) {
        //                     $timeout(function() {
        //                         $scope.dataUrls[index] = e.target.result;
        //                     });
        //                 }
        //             }(fileReader, i);
        //         }
        //         $scope.progress[i] = -1;
        //         if ($scope.uploadRightAway) {
        //             $scope.start(i);
        //         }
        //     }
        // };

        // $scope.start = function(index) {
        //     $scope.progress[index] = 0;
        //     $scope.errorMsg = null;
        //     $scope.howToSend = 1;
        //     if ($scope.howToSend == 1) {
        //         $scope.upload[index] = $uploadSvc.upload({
        //             url: $scope.uploadUrl,
        //             method: $scope.httpMethod,
        //             headers: {
        //                 'my-header': 'my-header-value'
        //             },
        //             data: {
        //                 myModel: $scope.myModel
        //             },
        //             file: $scope.selectedFiles[index],
        //             fileFormDataName: 'profile_pic'
        //         });
        //         $scope.upload[index].then(function(response) {
        //             $timeout(function() {
        //                 $scope.uploadResult.push(response.data);
        //             });
        //         }, function(response) {
        //             if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
        //         }, function(evt) {
        //             // Math.min is to fix IE which reports 200% sometimes
        //             $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        //         });
        //         $scope.upload[index].xhr(function(xhr) {});
        //     } else {
        //         var fileReader = new FileReader();
        //         fileReader.onload = function(e) {
        //             $scope.upload[index] = $uploadSvc.http({
        //                 url: $scope.uploadUrl,
        //                 headers: {
        //                     'Content-Type': $scope.selectedFiles[index].type
        //                 },
        //                 data: e.target.result
        //             }).then(function(response) {
        //                 $scope.uploadResult.push(response.data);
        //             }, function(response) {
        //                 if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
        //             }, function(evt) {
        //                 // Math.min is to fix IE which reports 200% sometimes
        //                 $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        //             });
        //         }
        //         fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        //     }
        // };


        ///////////////////////////////////////////////////////
        // FEEDBACK MODAL
        ///////////////////////////////////////////////////////
        /*
          openFeedbackForm function : calls the modal with the feedback form
         */
        $scope.openFeedbackForm = function() {
            $rootScope.openFeedbackModal('lg')
                .then(function(result) {
                    if (result) {
                        for (var i in $scope.activities) {
                            if ($scope.activities[i]._id == activity_id) {
                                $scope.activities.splice(i, 1);
                                break;
                            }
                        }
                        $rootScope.addAlert('success', 'Thank you for your feedback!');
                    } else {
                        $rootScope.addAlert('warning', 'Something went wrong and message couldn\'t be sent. Please try again');
                    }
                });
        }


        ///////////////////////////////////////////////////////
        // DATEPICKER bootstrap settings - TO CHANGE AND MOVED
        ///////////////////////////////////////////////////////
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.dt = null;
        };

        $scope.toggleMax = function() {
            $scope.maxDate = $scope.maxDate || new Date();
        };
        $scope.toggleMax();

        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1
        };

        $scope.localUserBirthDate = $rootScope.localUser && $rootScope.localUser.birthday ? new Date($rootScope.localUser.year + '-' + $rootScope.localUser.month + '-' + $rootScope.localUser.day) : new Date();
        $scope.showWeeks = false;
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        /*
       end datepicker
       */

    }
]);




