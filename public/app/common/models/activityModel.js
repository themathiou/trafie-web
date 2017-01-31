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
    .factory("Activity", function (ActivityResource, userService, imageService, DISCIPLINE_CATEGORIES) {
        var currentUser = null;
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

        Activity.prototype._getDisciplineCategory = function() {
            if(DISCIPLINE_CATEGORIES.time.indexOf(this.discipline) >= 0) {
                return 'time';
            }
            else if(DISCIPLINE_CATEGORIES.distance.indexOf(this.discipline) >= 0) {
                return 'distance';
            }
            else {
                return 'points';
            }
        };

        Activity.prototype.getPicture = function(size) {
            return imageService.resizeImage(this.picture, size);
        };

        Activity.prototype.getReadablePerformance = function() {
            var performance = '';
            switch(this._getDisciplineCategory()) {
                case 'time':
                    var viewPerformance = [];
                    viewPerformance.push(Math.floor(this.performance / 360000));
                    var performanceNoHours = this.performance  - viewPerformance[0] * 360000;
                    viewPerformance.push(Math.floor(performanceNoHours / 6000));
                    var performanceNoMinutes = performanceNoHours - viewPerformance[1] * 6000;
                    viewPerformance.push(Math.floor(performanceNoMinutes / 100));
                    viewPerformance.push(performanceNoMinutes - viewPerformance[2] * 100);

                    var filtering = true;
                    viewPerformance = viewPerformance
                        .filter(function(value, index) {
                            filtering = filtering && !value && index < 2;
                            return filtering ? value : true;
                        })
                        .map(function(value, index) {
                            return index ? ('0' + value).substr(-2, 2) : value;
                        });
                    var lastIndex = viewPerformance.length-1;
                    performance = (lastIndex ? viewPerformance.slice(0, lastIndex).join(':') : '0') + '.' + viewPerformance[lastIndex];
                    break;
                case 'distance':
                    if(currentUser && currentUser.units.distance === 'feet') {
                        var inches = this.performance * 0.0003937007874;
                        var feet = Math.floor(inches / 12);
                        inches = inches - 12 * feet;
                        var inchesInteger = Math.floor(inches);
                        var inchesDecimal = inches - inchesInteger;
                        var inchesFraction = '';
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
                        var meters = Math.floor(this.performance / 100000);
                        var centimeters = Math.round((this.performance - meters * 100000) / 1000);

                        performance = meters + '.' + ('0' + centimeters).substr(-2, 2);
                    }
                    break;
                case 'points':
                    performance = '' + this.performance;
                    break;
            }
            return performance;
        };

        return Activity;
    });
})(angular);