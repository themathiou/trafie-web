angular.module('trafie')
    .controller('ActivityFiltersModalController', function ($scope, $uibModalInstance, $filter, filters, $timeout,
                                                            $location, filterOptions, activities, selectedFilters) {
        $scope.close = function () {
            $uibModalInstance.dismiss('close');
        };
        $scope.filterOptions = filterOptions;
        $scope.activities = activities;
        $scope.selectedFilters = angular.copy(selectedFilters);

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.apply = function () {
            $uibModalInstance.close({
                filters: $scope.filters,
                selectedFilters: $scope.selectedFilters
            });
        };
    });