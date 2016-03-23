angular.module('trafie')
    .directive('tfDistancePerformancePicker', function () {
        function link(scope, element, attrs, ngModel) {
            function modelFormatter(value) {
                scope.inputs = [0,0];
                scope.inputs[0] = Math.floor(value / 10000);
                scope.inputs[1] = Math.floor((value - scope.inputs[0] * 10000) / 100);
                return scope.inputs.join(',');
            }
            function modelParser(value) {
                value = value.split(',').map(function(v) {return parseInt(v);});
                return value[0] * 10000 + value[1] * 100;
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
            template:   '<span class="row">' +
                            '<div class="col-xs-6">' +
                                '<input type="number" ng-model="inputs[0]" class="form-control" maxlength="2" ng-pattern="/^[0-9]{1,2}$/" min="0" max="99">' +
                            '</div>' +
                            '<div class="col-xs-6">' +
                                '<input type="number" ng-model="inputs[1]" class="form-control" maxlength="2" ng-pattern="/^[0-9]{2}$/" min="0" max="99">' +
                            '</div>' +
                        '</span>',
            link: link
        }
    });