angular.module('trafie')
    .directive('tfPointsPerformancePicker', function () {
        function link(scope, element, attrs, ngModel) {
            function modelFormatter(value) {
                scope.input = value;
                return value;
            }
            function modelParser(value) {
                return parseInt(value);
            }
            ngModel.$formatters.push(modelFormatter);
            ngModel.$parsers.push(modelParser);

            scope.$watch('input', function() {
                ngModel.$setViewValue(scope.input);
            });
        }

        return {
            restrict: 'EA',
            require: 'ngModel',
            replace: true,
            scope: true,
            template:   '<span>' +
                            '<input type="number" class="form-control" ng-model="input" maxlength="4" ng-pattern="/^[0-9]{0,4}$/" min="0" max="9999">' +
                        '</span>',
            link: link
        }
    });
