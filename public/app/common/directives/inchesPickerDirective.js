angular.module('trafie')
    .directive('tfInchesPicker', function () {
        function link(scope, element, attrs, ngModel) {
            scope.unit = '';
            scope.fractions = [
                {value: 0, text: '0'},
                {value: 25, text: '¼'},
                {value: 50, text: '½'},
                {value: 75, text: '¾'}
            ];

            function modelFormatter(value) {
                scope.inputs = [0, 0];
                scope.inputs[0] = Math.floor(value);
                scope.inputs[1] = value % 1 * 100;
                return scope.inputs.join(',');
            }

            function modelParser(value) {
                var valid = true;
                value = value.split(',').map(function(v) {return parseInt(v);});
                if([0, 25, 50, 75].indexOf(value[1]) >= 0) {
                    value = parseFloat("" + value[0] + '.' + value[1]);
                } else {
                    valid = false;
                }

                ngModel.$setValidity('valid', valid && value[0] < 11);
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
            scope: {},
            template:
                '<div>' +
                    '<input type="number" ng-model="inputs[0]" class="form-control inches-picker-inches" maxlength="2" ng-pattern="/^[0-9][0-1]?$/" min="0" max="99">' +
                    '<select class="form-control inches-picker-fraction" ng-model="inputs[1]" ng-options="fraction.value as fraction.text for fraction in fractions"></select>' +
                '</div>',
            link: link
        }
    });
