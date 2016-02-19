(function (angular) {
    angular.module('trafie')
    .provider('ActivityResource', [function () {
        this.$get = ['$resource', function ($resource) {
            return $resource('/users/:userId/activities/:_id', {userId: "@userId", _id: "@_id"}, {
                update: {
                    method: "PUT"
                },
                get: {
                    method: "GET",
                    isArray: true
                }
            });
        }];
    }])
    .factory("Activity", function (ActivityResource, userService, DISCIPLINE_CATEGORIES) {
        var currentUser = null;
        userService.loadCurrentUser().then(function(user) {
            currentUser = user;
        });

        function Activity(activityData) {
            activityData = activityData || {};
            this.userId = angular.isDefined(activityData.userId) ? activityData.userId : currentUser._id;
            this.discipline = angular.isDefined(activityData.discipline) ? activityData.discipline : '';
            this.performance = angular.isDefined(activityData.performance) ? activityData.performance : null;
            this.date = angular.isDefined(activityData.date) ? activityData.date : moment().unix();
            this.rank = angular.isDefined(activityData.rank) ? activityData.rank : null;
            this.location = angular.isDefined(activityData.location) ? activityData.location : '';
            this.competition = angular.isDefined(activityData.competition) ? activityData.competition : '';
            this.notes = angular.isDefined(activityData.notes) ? activityData.notes : '';
            this.isPrivate = angular.isDefined(activityData.isPrivate) ? activityData.isPrivate : false;
            this.type = angular.isDefined(activityData.type) ? activityData.type : 'competition';
            this.isOutdoor = angular.isDefined(activityData.isOutdoor) ? activityData.isOutdoor : false;
            this._private = {
                readablePerformance: '',
                disciplineCategory: ''
            };
            this._setReadablePerformance();
            this._setDisciplineCategory();
        }

        Activity = angular.extend(Activity, ActivityResource);

        Activity.prototype = new ActivityResource();

        Activity.prototype._setDisciplineCategory = function() {
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

        Activity.prototype._setReadablePerformance = function() {
            var performance = '';
            switch(this._private.disciplineCategory) {
                case 'time':
                    var viewPerformance = [];
                    viewPerformance.push(Math.floor(this.performance / 360000));
                    var performanceNoHours = this.performance  - viewPerformance[0] * 360000;
                    viewPerformance.push(Math.floor(performanceNoHours / 6000));
                    var performanceNoMinutes = performanceNoHours - viewPerformance[1] * 6000;
                    viewPerformance.push(Math.floor(performanceNoMinutes / 100));
                    viewPerformance.push(performanceNoMinutes - seconds * 100);

                    var filtering = true;
                    viewPerformance = viewPerformance
                        .filter(function(value) {
                            filtering = filtering && !value;
                            return filtering ? value : true;
                        })
                        .map(function(value, index) {
                            return index ? ('0' + value).substr(-2, 2) : value;
                        });
                    var lastIndex = viewPerformance.length-1;
                    performance = viewPerformance.slice(0, lastIndex).join(':') + '.' + viewPerformance[lastIndex];
                    break;
                case 'distance':
                    var meters = Math.floor(this.performance / 10000);
                    var centimeters = (this.performance - meters * 10000) / 100;

                    performance = meters + '.' + ('0' + centimeters).substr(-2, 2);
                    break;
                case 'points':
                    performance = '' + this.performance;
                    break;
            }
            this._private.readablePerformance = performance;
        };

        Activity.prototype._updatePrivate = function() {
            this._setDisciplineCategory();
            this._setReadablePerformance();
        };

        Activity.prototype.getReadablePerformance = function() {
            return this._private.readablePerformance;
        };

        return Activity;
    });
})(angular);