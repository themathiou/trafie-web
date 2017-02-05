(function (angular) {
    angular.module('trafie')
    .provider('ActivityResource', function () {
        this.$get = function ($resource) {
            return $resource('/users/:userId/activities/:_id', {userId: "@userId", _id: "@_id"}, {
                update: {
                    method: "PUT"
                },
                get: {
                    method: "GET",
                    isArray: true
                }
            });
        };
    })
    .factory("Activity", function (ActivityResource, userService, imageService, DISCIPLINE_CATEGORIES, activityHelper) {
        let currentUser = null;
        userService.loadCurrentUser().then(function(user) {
            currentUser = user;
        });

        function Activity(activityData) {
            activityData = activityData || {};
            this._id = activityData._id || null;
            this.userId = angular.isDefined(activityData.userId) ? activityData.userId : currentUser && currentUser._id || '';
            this.discipline = angular.isDefined(activityData.discipline) ? activityData.discipline : '';
            this.performance = angular.isDefined(activityData.performance) ? activityData.performance : 0;
            this.date = angular.isDefined(activityData.date) ? activityData.date : moment().unix();
            this.rank = angular.isDefined(activityData.rank) ? activityData.rank : null;
            this.location = angular.isDefined(activityData.location) ? activityData.location : '';
            this.competition = angular.isDefined(activityData.competition) ? activityData.competition : '';
            this.notes = angular.isDefined(activityData.notes) ? activityData.notes : '';
            this.comments = angular.isDefined(activityData.comments) ? activityData.comments : '';
            this.isPrivate = angular.isDefined(activityData.isPrivate) ? activityData.isPrivate : false;
            this.type = angular.isDefined(activityData.type) ? activityData.type : 'competition';
            this.isOutdoor = angular.isDefined(activityData.isOutdoor) ? activityData.isOutdoor : true;
            this.picture = angular.isDefined(activityData.picture) ? activityData.picture : '';
        }

        Activity = angular.extend(Activity, ActivityResource);
        Activity.prototype = new ActivityResource();

        Activity.prototype.getPicture = function(size) {
            return imageService.resizeImage(this.picture, size);
        };

        Activity.prototype.getReadablePerformance = function() {
            return activityHelper.getReadablePerformance(this.performance, this.discipline);
        };

        return Activity;
    })
    .factory("activityHelper", function(userService, DISCIPLINE_CATEGORIES) {
        let currentUser = null;
        userService.loadCurrentUser().then(function(user) {
            currentUser = user;
        });

        function getReadablePerformance(rawPerformance, discipline) {
            let performance = '';
            switch(getDisciplineCategory(discipline)) {
                case 'time':
                    let viewPerformance = [];
                    viewPerformance.push(Math.floor(rawPerformance / 360000));
                    const performanceNoHours = rawPerformance  - viewPerformance[0] * 360000;
                    viewPerformance.push(Math.floor(performanceNoHours / 6000));
                    const performanceNoMinutes = performanceNoHours - viewPerformance[1] * 6000;
                    viewPerformance.push(Math.floor(performanceNoMinutes / 100));
                    viewPerformance.push(performanceNoMinutes - viewPerformance[2] * 100);

                    let filtering = true;
                    viewPerformance = viewPerformance
                        .filter(function(value, index) {
                            filtering = filtering && !value && index < 2;
                            return filtering ? value : true;
                        })
                        .map(function(value, index) {
                            return index ? ('0' + value).substr(-2, 2) : value;
                        });
                    const lastIndex = viewPerformance.length-1;
                    performance = (lastIndex ? viewPerformance.slice(0, lastIndex).join(':') : '0') + '.' + viewPerformance[lastIndex];
                    break;
                case 'distance':
                    if(currentUser && currentUser.units.distance === 'feet') {
                        let inches = rawPerformance * 0.0003937007874;
                        const feet = Math.floor(inches / 12);
                        inches = inches - 12 * feet;
                        let inchesInteger = Math.floor(inches);
                        const inchesDecimal = inches - inchesInteger;
                        let inchesFraction = '';
                        if(inchesDecimal >= 0.125 && inchesDecimal < 0.375) {
                            inchesFraction = '&frac14;';
                        }
                        else if(inchesDecimal >= 0.375 && inchesDecimal < 0.625) {
                            inchesFraction = '&frac12;';
                        }
                        else if(inchesDecimal >= 0.625 && inchesDecimal < 0.875) {
                            inchesFraction = '&frac34;';
                        }
                        else if(inchesDecimal >= 0.875) {
                            inchesInteger++;
                        }

                        performance = feet + "' " + inchesInteger + inchesFraction + '"';
                    } else {
                        const meters = Math.floor(rawPerformance / 100000);
                        const centimeters = Math.round((rawPerformance - meters * 100000) / 1000);

                        performance = meters + '.' + ('0' + centimeters).substr(-2, 2);
                    }
                    break;
                case 'points':
                    performance = '' + rawPerformance;
                    break;
            }
            return performance;
        }

        function getDisciplineCategory(discipline) {
            if(DISCIPLINE_CATEGORIES.time.indexOf(discipline) >= 0) {
                return 'time';
            }
            else if(DISCIPLINE_CATEGORIES.distance.indexOf(discipline) >= 0) {
                return 'distance';
            }
            else {
                return 'points';
            }
        }

        return {
            getReadablePerformance,
            getDisciplineCategory
        };
    });
})(angular);