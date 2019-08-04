angular.module('trafie')
    .directive('activityFilters', function () {
        function link(scope, element, attrs, ngModel) {
            scope.filterCategories = Object.keys(scope.filters);

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
                    console.log("filterCategory", scope.filters[filterCategory].options.length);
                    return scope.filters[filterCategory].options.length > 1;
                });
            };

            scope.hideEmpty = () => {
                return !scope.filterOptionsExist() && ["hidden-xs", "hidden-sm"] || "";
            };
        }

        return {
            restrict: 'EA',
            replace: true,
            require: 'ngModel',
            scope: {
                activities: '=',
                filters: '=filterOptions',
                selectedFilters: '=',
            },
            link: link,
            template:   '<div class="col" ng-class="hideEmpty()">' +
                            '<div ng-if="!filterOptionsExist()">' +
                                '<span translate="PROFILE.FILTERS_APPEAR_WHEN_THERE_ARE_ENOUGH_ACTIVITIES"></span>' +
                            '</div>' +
                                '<div class="form-group" ng-repeat="filterCategory in filterCategories" ng-if="filters[filterCategory].options.length > 1">' +
                                    '<label class="form-control-label" ng-if="filters[filterCategory].label" translate="{{::filters[filterCategory].label}}"></label>' +
                                    '<div>' +
                                        '<ui-select ng-if="filters[filterCategory].inputType === \'multiSelect\'"' +
                                        'class="select2 select2-container select2-container--default" multiple ng-model="selectedFilters[filterCategory]"' +
                                        '>' +
                                            '<ui-select-match placeholder="{{::filters[filterCategory].placeholder | translate}}">{{$select.selected[$index].text | translate}}</ui-select-match>' +
                                            '<ui-select-choices class="select2-results__option show" repeat="option in filters[filterCategory].options | filter: $select.search">' +
                                                '<div ng-bind-html="option.text | translate"></div>' +
                                            '</ui-select-choices>' +
                                        '</ui-select>' +
                                        '<div class="btn-group btn-group-toggle" ng-if="filters[filterCategory].inputType === \'toggle\'">' +
                                            '<label ng-repeat="option in filters[filterCategory].options" class="btn btn-secondary" '+
                                            'ng-model="selectedFilters[filterCategory]" uib-btn-radio="{{[option]}}" uncheckable ' +
                                            'translate="{{filters[filterCategory].valueLabels[option.text]}}"></label>' +
                                        '</div>' +
                                    '</div>' +
                                '</li>' +
                        '</div>'
        }
    });
