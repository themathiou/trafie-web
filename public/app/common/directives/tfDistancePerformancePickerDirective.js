angular.module('trafie')
    .directive('tfDistancePerformancePicker', function (VALIDATIONS) {
        function link(scope, element, attrs, ngModel) {
            function modelFormatter(value) {
                scope.inputs = [0,0];
                scope.inputs[0] = Math.floor(value / 10000);
                scope.inputs[1] = Math.floor((value - scope.inputs[0] * 10000) / 100);
                return scope.inputs.join(',');
            }
            function modelParser(value) {
                value = value.split(',').map(function(v) {return parseInt(v);});
                value = value[0] * 10000 + value[1] * 100;

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
            template:   '<div class="row">' +
                            '<div class="col-xs-6">' +
                                '<input type="number" ng-model="inputs[0]" class="form-control" maxlength="2" ng-pattern="/^[0-9]{1,2}$/" min="0" max="99">' +
                                '<p class="help-block pull-right" translate="MEASUREMENTS.METERS"></p>' +
                            '</div>' +
                            '<div class="col-xs-6">' +
                                '<input type="number" ng-model="inputs[1]" class="form-control" maxlength="2" ng-pattern="/^[0-9]{2}$/" min="0" max="99">' +
                                '<p class="help-block pull-right" translate="MEASUREMENTS.CENTIMETERS"></p>' +
                            '</div>' +
                        '</div>',
            link: link
        }
    });
