angular.module('trafie')
    .directive('distancePerformancePicker', function (VALIDATIONS, userService, $timeout) {
        function link(scope, element, attrs, ngModel) {
            scope.unit = 'meters';
            scope.unitLoaded = false;

            userService.loadCurrentUser().then(function(user) {
                scope.unit = user.units.distance;
                $timeout(function() {
                    modelFormatter(ngModel.$modelValue);
                    scope.unitLoaded = true;
                });
            });

            function modelFormatter(value) {
                scope.inputs = [0,0];
                if(scope.unit === 'meters') {
                    scope.inputs[0] = Math.floor(value / 100000);
                    scope.inputs[1] = Math.round((value - scope.inputs[0] * 100000) / 1000);
                } else {
                    var inches = value * 0.0003937007874;
                    var feet = Math.floor(inches / 12);
                    inches = inches - 12 * feet;
                    var inchesInteger = Math.floor(inches);
                    var inchesDecimal = inches - inchesInteger;
                    if(inchesDecimal >= 0.125 && inchesDecimal < 0.375) {
                        inchesDecimal = 0.25;
                    }
                    else if(inchesDecimal >= 0.375 && inchesDecimal < 0.625) {
                        inchesDecimal = 0.5;
                    }
                    else if(inchesDecimal >= 0.625 && inchesDecimal < 0.875) {
                        inchesDecimal = 0.75;
                    }
                    else if(inchesDecimal >= 0.875) {
                        inchesInteger++;
                        inchesDecimal = 0;
                    }
                    else {
                        inchesDecimal = 0;
                    }
                    scope.inputs[0] = feet;
                    scope.inputs[1] = inchesInteger + inchesDecimal;
                }

                return scope.inputs.join(',');
            }

            function modelParser(value) {
                if(scope.unit === 'meters') {
                    value = value.split(',').map(function(v) {return parseInt(v);});
                    value = value[0] * 100000 + value[1] * 1000;
                } else {
                    value = value.split(',').map(function(v) {return parseFloat(v);});
                    value = value[0] * 30480 + value[1] * 2540;
                }

                var valid = value <= VALIDATIONS.activity.performance.distanceMaxValue && value > 0;
                ngModel.$setValidity('range', valid);
                return valid ? value : undefined;
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
            template:   '<div ng-switch="unit">' +
                            '<div ng-switch-when="meters" ng-show="unitLoaded">' +
                                '<div class="row">' +
                                    '<div class="col-6">' +
                                        '<input type="number" ng-model="inputs[0]" class="form-control" maxlength="2" ng-pattern="/^[0-9]{1,2}$/" min="0" max="99">' +
                                        '<p class="help-block pull-right" translate="MEASUREMENTS.METERS"></p>' +
                                    '</div>' +
                                    '<div class="col-6">' +
                                        '<input type="number" ng-model="inputs[1]" class="form-control" maxlength="2" ng-pattern="/^[0-9]{0,2}$/" min="0" max="99">' +
                                        '<p class="help-block pull-right" translate="MEASUREMENTS.CENTIMETERS"></p>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div ng-switch-when="feet" ng-show="unitLoaded">' +
                                '<div class="row">' +
                                    '<div class="col-6">' +
                                        '<input type="number" ng-model="inputs[0]" class="form-control" maxlength="2" ng-pattern="/^[0-9]{1,2}$/" min="0" max="99">' +
                                        '<p class="help-block pull-right" translate="MEASUREMENTS.FEET"></p>' +
                                    '</div>' +
                                    '<div class="col-6">' +
                                        '<inches-picker ng-model="inputs[1]"></inches-picker>' +
                                        '<p class="help-block pull-right" translate="MEASUREMENTS.INCHES"></p>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>',
            link: link
        }
    });
