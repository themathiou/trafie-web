angular.module('trafie')
    .directive('performancePicker', function (DISCIPLINE_CATEGORIES) {
        function link(scope, element, attrs, model) {
            /*model.$formatters.push(modelFormatter);
            model.$parsers.push(modelParser);*/

            scope.getCategory = function(discipline) {
                if(DISCIPLINE_CATEGORIES.time.indexOf(discipline) >= 0) return 'time';
                else if(DISCIPLINE_CATEGORIES.distance.indexOf(discipline) >= 0) return 'distance';
                else if(DISCIPLINE_CATEGORIES.points.indexOf(discipline) >= 0) return 'points';
                else return '';
            };

            scope.$watch('discipline', function() {
                console.log(scope.discipline);
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
                            '<span ng-show="getCategory(discipline) === \'time\'">' +
                                '<input type="number" > : <input type="number" > : <input type="number" >' +
                            '</span>' +
                            '<span ng-show="getCategory(discipline) === \'distance\'">' +
                                '<input type="number" > . <input type="number" >' +
                            '</span>' +
                            '<span ng-show="getCategory(discipline) === \'points\'">' +
                                '<input type="number" >' +
                            '</span>' +
                        '</span>',
            link: link
        }
    });
