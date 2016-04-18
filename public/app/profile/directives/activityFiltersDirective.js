angular.module('trafie')
    .directive('activityFilters', function () {
        function link(scope, element, attrs, ngModel) {
            scope.filters = {
                years: {
                    options: [],
                    label: 'PROFILE.YEAR',
                    placeholder: 'PROFILE.SELECT_YEARS_TO_FILTER'
                },
                disciplines: {
                    options: [],
                    label: 'COMMON.DISCIPLINES',
                    placeholder: 'PROFILE.SELECT_DISCIPLINES_TO_FILTER'
                }
            };
            scope.selectedFilters = {};
            scope.filterCategories = Object.keys(scope.filters);
            scope.filterCategories.forEach(function(filterCategory) {
                scope.selectedFilters[filterCategory] = [];
            });

            scope.$watchCollection('activities', function() {
                var selectedYears = [];
                var selectedDisciplines = [];
                Object.keys(scope.filters).forEach(function(filterCategory) {
                    scope.filters[filterCategory].options = [];
                });
                scope.activities.forEach(function(activity) {
                    var year = moment.unix(activity.date).format('YYYY');
                    if(selectedYears.indexOf(year) < 0) {
                        selectedYears.push(year);
                        scope.filters.years.options.push({
                            text: year,
                            value: year
                        });
                    }
                    if(selectedDisciplines.indexOf(activity.discipline) < 0) {
                        selectedDisciplines.push(activity.discipline);
                        scope.filters.disciplines.options.push({
                            text: 'DISCIPLINES.' + activity.discipline.toUpperCase(),
                            value: activity.discipline
                        });
                    }
                });
            });

            scope.$watch('selectedFilters', function(filters) {
                ngModel.$setViewValue(JSON.stringify(filters));
            }, true);

            function modelParser(value) {
                var filters = JSON.parse(value);
                Object.keys(filters).forEach(function(filterCategory) {
                    filters[filterCategory].forEach(function(filterObject, index) {
                        filters[filterCategory][index] = filterObject.value;
                    });
                });
                return filters;
            }
            ngModel.$parsers.push(modelParser);

            scope.filterOptionsExist = function() {
                return Object.keys(scope.filters).some(function(filterCategory) {
                    return scope.filters[filterCategory].options.length > 1;
                });
            };
        }

        return {
            restrict: 'EA',
            replace: true,
            require: 'ngModel',
            scope: {
                activities: '='
            },
            link: link,
            template:   '<div class="panel panel-default">' +
                            '<div class="panel-heading" translate="PROFILE.FILTERS"></div>' +
                            '<div class="panel-body" ng-if="!filterOptionsExist()">' +
                                '<span translate="PROFILE.THERE_ARE_NO_FILTERS_AVAILABLE"></span>' +
                            '</div>' +
                            '<ul class="list-group">' +
                                '<li class="list-group-item" ng-repeat="filterCategory in filterCategories" ng-if="filters[filterCategory].options.length > 1">' +
                                    '<label translate="{{::filters[filterCategory].label}}"></label>' +
                                    '<div>' +
                                        '<ui-select multiple ng-model="selectedFilters[filterCategory]">' +
                                            '<ui-select-match placeholder="{{::filters[filterCategory].placeholder | translate}}">{{$select.selected[$index].text | translate}}</ui-select-match>' +
                                            '<ui-select-choices repeat="option in filters[filterCategory].options | filter: $select.search">' +
                                                '<div ng-bind-html="option.text | translate"></div>' +
                                            '</ui-select-choices>' +
                                        '</ui-select>' +
                                    '</div>' +
                                '</li>' +
                            '</ul>' +
                        '</div>'
        }
    });
