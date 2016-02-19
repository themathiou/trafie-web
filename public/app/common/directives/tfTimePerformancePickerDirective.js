angular.module('trafie')
    .directive('tfTimePerformancePicker', function () {
        function link(scope, element, attrs, ngModel) {
            function modelFormatter(value) {
                scope.inputs = [0,0,0,0];
                scope.inputs[0] = Math.floor(value / 360000);
                scope.inputs[1] = Math.floor((value - scope.inputs[0] * 360000) / 6000);
                scope.inputs[2] = Math.floor((value - scope.inputs[0] * 360000 - scope.inputs[1] * 6000) / 100);
                scope.inputs[3] = Math.floor(value - scope.inputs[0] * 360000 - scope.inputs[1] * 6000 - scope.inputs[2] * 100);
                return scope.inputs.join(',');
            }
            function modelParser(value) {
                value = value.split(',').map(function(v) {return !!v && parseInt(v) || 0;});
                var length = value.length;
                var parsedValue = value[length-2] * 100 + value[length-1];
                if (length > 2) {
                    parsedValue += value[length-3] * 6000;
                }
                if (length > 3) {
                    parsedValue += value[length-4] * 360000;
                }

                return parsedValue;
            }
            ngModel.$formatters.push(modelFormatter);
            ngModel.$parsers.push(modelParser);

            scope.$watchCollection('inputs', function() {
                ngModel.$setViewValue(scope.inputs.join(','));
            });
        }

        return {
            restrict: 'EA',
            require: 'ngModel',
            replace: true,
            scope: true,
            template:   '<div class="row">' +
                            '<div class="col-xs-3">' +
                                '<input type="number" class="form-control" ng-model="inputs[0]" maxlength="1" ng-pattern="/^[0-9]$/" min="0" max="9">' +
                            '</div>' +
                            '<div class="col-xs-3">' +
                                '<input type="number" class="form-control" ng-model="inputs[1]" maxlength="2" ng-pattern="/^[0-5]?[0-9]?$/" min="0" max="59">' +
                            '</div>' +
                            '<div class="col-xs-3">' +
                                '<input type="number" class="form-control" ng-model="inputs[2]" maxlength="2" ng-pattern="/^[0-5]?[0-9]$/" min="0" max="59">' +
                            '</div>' +
                            '<div class="col-xs-3">' +
                                '<input type="number" class="form-control" ng-model="inputs[3]" maxlength="2" ng-pattern="/^[0-9]{1,2}$/" min="0" max="99">' +
                            '</div>' +
                        '</div>',
            link: link
        }
    });
