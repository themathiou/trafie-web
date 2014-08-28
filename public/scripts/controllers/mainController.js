trafie.controller("mainController", [
    '$rootScope',
    '$scope',
    '$http',
    '$routeParams',
    '$location',
    '$timeout',
    '$modalSvc',
    '$uploadSvc',
    '$alertSvc',
    '$window',
    function($rootScope, $scope, $http, $routeParams, $location, $timeout, $modalSvc, $uploadSvc, $window) {
        ///////////////////////////////////////////////////////
        // GENERAL
        ///////////////////////////////////////////////////////
        $scope.appInit = function() {};

        /**
         * [Syncs show and hide of elements]
         * @param  String element_variable
         * @return {[type]}
         */
        $scope.showHide = function(element_variable) {
            $scope[element_variable] = !$scope[element_variable];
        }

        ///////////////////////////////////////////////////////
        // SEARCH USERS
        ///////////////////////////////////////////////////////
        /**
         * [searches users]
         * @param
         */
        $scope.searchUser = function(val) {
            return $http.get('/search/?value=' + val)
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
        // File Upload Functions and vars
        ///////////////////////////////////////////////////////
        $scope.usingFlash = false; //FileAPI && FileAPI.upload != null;
        $scope.fileReaderSupported = false; //window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
        $scope.uploadRightAway = false;
        $scope.uploadUrl = 'settings_data';

        $scope.hasUploader = function(index) {
            return $scope.upload[index] != null;
        };
        $scope.abort = function(index) {
            $scope.upload[index].abort();
            $scope.upload[index] = null;
        };
        $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
            window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';

        $scope.onFileSelect = function($files) {
            $scope.selectedFiles = [];
            $scope.progress = [];
            if ($scope.upload && $scope.upload.length > 0) {
                for (var i = 0; i < $scope.upload.length; i++) {
                    if ($scope.upload[i] != null) {
                        $scope.upload[i].abort();
                    }
                }
            }
            $scope.upload = [];
            $scope.uploadResult = [];
            $scope.selectedFiles = $files;
            $scope.dataUrls = [];
            for (var i = 0; i < $files.length; i++) {
                var $file = $files[i];
                if ($scope.fileReaderSupported && $file.type.indexOf('image') > -1) {
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL($files[i]);
                    var loadFile = function(fileReader, index) {
                        fileReader.onload = function(e) {
                            $timeout(function() {
                                $scope.dataUrls[index] = e.target.result;
                            });
                        }
                    }(fileReader, i);
                }
                $scope.progress[i] = -1;
                if ($scope.uploadRightAway) {
                    $scope.start(i);
                }
            }
        };

        $scope.start = function(index) {
            $scope.progress[index] = 0;
            $scope.errorMsg = null;
            $scope.howToSend = 1;
            if ($scope.howToSend == 1) {
                $scope.upload[index] = $uploadSvc.upload({
                    url: $scope.uploadUrl,
                    method: $scope.httpMethod,
                    headers: {
                        'my-header': 'my-header-value'
                    },
                    data: {
                        myModel: $scope.myModel
                    },
                    file: $scope.selectedFiles[index],
                    fileFormDataName: 'profile_pic'
                });
                $scope.upload[index].then(function(response) {
                    $timeout(function() {
                        $scope.uploadResult.push(response.data);
                    });
                }, function(response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function(evt) {
                    // Math.min is to fix IE which reports 200% sometimes
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
                $scope.upload[index].xhr(function(xhr) {});
            } else {
                var fileReader = new FileReader();
                fileReader.onload = function(e) {
                    $scope.upload[index] = $uploadSvc.http({
                        url: $scope.uploadUrl,
                        headers: {
                            'Content-Type': $scope.selectedFiles[index].type
                        },
                        data: e.target.result
                    }).then(function(response) {
                        $scope.uploadResult.push(response.data);
                    }, function(response) {
                        if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                    }, function(evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }
                fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
            }
        };

        ///////////////////////////////////////////////////////
        // datepicker bootstrap settings - TO CHANGE
        ///////////////////////////////////////////////////////
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.dt = null;
        };

        $scope.toggleMax = function() {
            $scope.maxDate = $scope.maxDate ? null : new Date();
        };
        $scope.toggleMax();

        $scope.open = function($event) {
            $timeout(function() {
                $scope.opened = true;
            });

        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.initDate = new Date();
        $scope.showWeeks = false;
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        /*
		   end datepicker
		   */
    }
]);