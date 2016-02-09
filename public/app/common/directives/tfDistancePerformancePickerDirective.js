angular.module('trafie')
    .directive('tfDistancePerformancePicker', function () {
        function link($scope, element, attrs, model) {
            /*model.$formatters.push(modelFormatter);
            model.$parsers.push(modelParser);*/
        }

        return {
            restrict: 'EA',
            require: 'ngModel',
            replace: true,
            scope: {
                discipline: '='
            },
            template:   '<span>' +
                            '<input type="number"> . <input type="number">' +
                        '</span>',
            link: link
        }
    });
