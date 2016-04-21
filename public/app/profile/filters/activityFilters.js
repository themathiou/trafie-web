angular.module('trafie')
.filter('usersFilters', function($filter) {
    return function(input, filters) {
        input = input || [];
        return $filter('filter')(input, function(activity) {
            var appliedFilters = [];
            if(filters.hasOwnProperty('outdoor') && filters.outdoor.length == 1 && activity.isOutdoor !== filters.outdoor[0]) {
                return false;
            }
            else if(filters.hasOwnProperty('disciplines') && filters.disciplines.length && filters.disciplines.indexOf(activity.discipline) < 0) {
                return false;
            }
            else if(filters.hasOwnProperty('years') && filters.years.length && filters.years.indexOf(moment.unix(activity.date).format('YYYY')) < 0) {
                return false;
            }
            return true;
        });
    };
});