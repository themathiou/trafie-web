angular.module('trafie')
    .directive('activityFilters', function () {
        function link(scope, element, attrs, ngModel) {
            scope.filters = {
                outdoor: {
                    property: 'isOutdoor',
                    inputType: 'toggle',
                    options: [],
                    label: 'PROFILE.COMPETITION_TYPE',
                    valueLabels: {
                        'true': 'PROFILE.OUTDOOR',
                        'false': 'PROFILE.INDOOR'
                    }
                },
                years: {
                    property: 'year',
                    inputType: 'multiSelect',
                    options: [],
                    label: 'PROFILE.YEAR',
                    placeholder: 'PROFILE.SELECT_YEARS_TO_FILTER',
                    translationPrefix: ''
                },
                disciplines: {
                    property: 'discipline',
                    inputType: 'multiSelect',
                    options: [],
                    label: 'COMMON.DISCIPLINE',
                    placeholder: 'PROFILE.SELECT_DISCIPLINES_TO_FILTER',
                    translationPrefix: 'DISCIPLINES.'
                }
            };
            scope.selectedFilters = {};
            scope.filterCategories = Object.keys(scope.filters);
            scope.isCollapsed = true;
            scope.filterCategories.forEach(function(filterCategory) {
                scope.selectedFilters[filterCategory] = [];
            });

            scope.$watchCollection('activities', function() {
                var selected = {};
                Object.keys(scope.filters).forEach(function(filterCategory) {
                    selected[filterCategory] = [];
                    scope.filters[filterCategory].options = [];
                });
                angular.copy(scope.activities).forEach(function(activity) {
                    activity.year = moment.unix(activity.date).format('YYYY');
                    Object.keys(scope.filters).forEach(function(filterCategory) {
                        var filterProperty = scope.filters[filterCategory].property;
                        if(selected[filterCategory].indexOf(activity[filterProperty]) < 0) {
                            selected[filterCategory].push(activity[filterProperty]);
                            var text = activity[filterProperty];
                            if(scope.filters[filterCategory].translationPrefix) {
                                text = scope.filters[filterCategory].translationPrefix + activity[filterProperty].toUpperCase();
                            }
                            scope.filters[filterCategory].options.push({
                                text: text,
                                value: activity[filterProperty]
                            });
                        }
                    });
                });
            });

            scope.$watch('selectedFilters', function(filters) {
                ngModel.$setViewValue(JSON.stringify(filters));
            }, true);

            function modelParser(value) {
                var filters = JSON.parse(value);
                Object.keys(filters).forEach(function(filterCategory) {
                    filters[filterCategory] = filters[filterCategory] || [];
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
            template:   '<div class="panel panel-default panel-activity-filters">' +
                            '<div class="panel-heading">' +
                                '<span translate="PROFILE.FILTERS"></span>' +
                                '<a href="javascript:;" class="pull-right hidden-md hidden-lg" ng-click="isCollapsed = !isCollapsed">' +
                                    '<i class="fa text-muted" ng-class="{\'fa-chevron-up\': isCollapsed, \'fa-chevron-down\': !isCollapsed}"></i>' +
                                '</a>' +
                            '</div>' +
                            '<div class="panel-body" ng-if="!filterOptionsExist()">' +
                                '<span translate="PROFILE.FILTERS_APPEAR_WHEN_THERE_ARE_ENOUGH_ACTIVITIES"></span>' +
                            '</div>' +
                            '<ul class="list-group" uib-collapse="isCollapsed">' +
                                '<li class="list-group-item" ng-repeat="filterCategory in filterCategories" ng-if="filters[filterCategory].options.length > 1">' +
                                    '<label ng-if="filters[filterCategory].label" translate="{{::filters[filterCategory].label}}"></label>' +
                                    '<div>' +
                                        '<ui-select ng-if="filters[filterCategory].inputType === \'multiSelect\'" multiple ng-model="selectedFilters[filterCategory]">' +
                                            '<ui-select-match placeholder="{{::filters[filterCategory].placeholder | translate}}">{{$select.selected[$index].text | translate}}</ui-select-match>' +
                                            '<ui-select-choices repeat="option in filters[filterCategory].options | filter: $select.search">' +
                                                '<div ng-bind-html="option.text | translate"></div>' +
                                            '</ui-select-choices>' +
                                        '</ui-select>' +
                                        '<div class="btn-group" ng-if="filters[filterCategory].inputType === \'toggle\'">' +
                                            '<label ng-repeat="option in filters[filterCategory].options" class="btn btn-default" ng-model="selectedFilters[filterCategory]" uib-btn-radio="{{[option]}}" uncheckable translate="{{filters[filterCategory].valueLabels[option.text]}}"></label>' +
                                        '</div>' +
                                    '</div>' +
                                '</li>' +
                            '</ul>' +
                        '</div>'
        }
    });
