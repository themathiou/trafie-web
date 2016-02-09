angular.module('trafie')
    .directive('tfTimePerformancePicker', function () {
        function link(scope, element, attrs, ngModel) {
            function modelFormatter(value) {
                console.log('formatter', value);
                return value;
            }
            function modelParser(value) {

                return value;
            }
            ngModel.$formatters.push(modelFormatter);
            ngModel.$parsers.push(modelParser);

            scope.dropdowns = [0,0,0,0];
            scope.$watchCollection('dropdowns', function() {
                console.log('changed');
                ngModel.$setViewValue(scope.dropdowns);
            });
        }

        return {
            restrict: 'EA',
            require: 'ngModel',
            replace: true,
            scope: {
                discipline: '='
            },
            template:   '<span>' +
                            '<input type="number" ng-model="dropdowns[0]"> : ' +
                            '<input type="number" ng-model="dropdowns[1]"> : ' +
                            '<input type="number" ng-model="dropdowns[2]"> . ' +
                            '<input type="number" ng-model="dropdowns[3]">' +
                        '</span>',
            link: link
        }
    });
