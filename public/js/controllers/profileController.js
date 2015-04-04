(function () {
    'use strict';

	angular.module('trafie.controllers').controller("profileController", [
		'$rootScope','$scope','$http','$timeout','$window','$q','$routeParams', 'ModalSvc', 'AlertSvc',
		function($rootScope, $scope, $http, $timeout, $window, $q, $routeParams, ModalSvc, AlertSvc) {

		//GENERAL VARIABLES
		$scope.disciplines = Utils.DISCIPLINES;

		//variable for Open/Close accordions
		$scope.accordions = {
			addActivity: false
		};

		//time form
		$scope.newActivityForm = {};

		$scope.initProfile = function() {
			$scope.selected_discipline = '';
			$scope.isLoading = "true";
			$scope.selected_year = {};
			$scope.selected_year.date = ''; //all years are shown. No filter applied.

            $rootScope.LAZY_LOADING_VIEW = Utils.LAZY_LOADING_BLOCK_SIZE; //initial value

			//true if this is the profile of the logged-in user
			$scope.page_not_found = false;
			$scope.self = false;
			$scope.hasMoreToLoad = false;

			//www.trafie.com/
			if ($routeParams.userID) {
				$rootScope.localUser && ($routeParams.userID === $rootScope.localUser._id || $routeParams.userID === $rootScope.localUser.username) ? $scope.self = true : $scope.self = false;
				$scope.getProfile($routeParams.userID);
			} else {
			//www.trafie.com/:userID
				if(!$rootScope.localUser) { //check if localUser exits. solves problem at login.
					$http.get('/users/me')
					.success(function(res) {
						//The logged in user
						$rootScope.localUser = res;
						$rootScope.isVisitor = false;

						$http.get('/users/' + res._id + '/disciplines')
						.success(function(res) {
							$rootScope.localUser.disciplines_of_user = res;
							$rootScope.current_user = res; //current user is logged in user

							$scope.getProfile($rootScope.localUser._id);
							$scope.self=true;
						})
						.error(function(res) {
							console.err('info :: can\'t get disciplines of current user in profile controller');
						});
					})
					.error(function(res) {
						console.log('info :: Oooohhh we have a fuckin\' visitoo!!');
					});
				}
				else {
					$scope.getProfile($rootScope.localUser._id);
					$scope.self = true;
				}
			}
		};

		//get user profile based on user id
		$scope.getProfile = function(user_id) {
			$http.get('/users/' + user_id)
				.success(function(res) {
					$rootScope.current_user = res;
					$rootScope.current_user.picture += '?v=' + Date.now(); // BAD PRACTICE. TO CHANGE.
					//get user's activities
					$scope.getDisciplinesOfUser($rootScope.current_user._id);
					$scope.getActivities($rootScope.current_user._id, $rootScope.current_user.discipline);

				})
				.error(function(res) {
					$scope.page_not_found = true;
					console.err('info :: User not found. Maybe he doesn\'t have a trafie profile or the profile is private.');
				});
		};

		//get disciplines of user based on user id
		$scope.getDisciplinesOfUser = function(user_id) {
			$http.get('/users/' + user_id + '/disciplines')
				.success(function(res) {
					$rootScope.current_user.disciplines_of_user = res;
				})
				.error(function(res) {
					console.err('info :: can\'t get disciplines of current user');
				});
		};

		//get user activities based on user id
		$scope.getActivities = function(user_id, discipline) {
			var url = '';
			$rootScope.LAZY_LOADING_VIEW = Utils.LAZY_LOADING_BLOCK_SIZE;
			$scope.selected_year.date = ''; //reset year filtering when switching between disciplines
			$scope.selected_discipline = discipline;
			url = discipline ? '/users/' + user_id + '/activities?discipline=' + discipline : '/users/' + user_id + '/activities';

			$http.get(url)
			.success(function(res) {
				$scope.activities = res;
				$scope.noActivities = res.length === 0 ? true : false;
				$scope.active_years = [];
				for (var i in res) {
					var _temp_year = new Date(res[i].date);
					if ($scope.active_years.indexOf(_temp_year.getFullYear()) === -1) {
						$scope.active_years.push(_temp_year.getFullYear());
					}
				}
				$scope.isLoading = false;
				$scope.hasMoreToLoad = res.length > $rootScope.LAZY_LOADING_VIEW ? true : false;
			})
		};

		/*
		filterByYear function : filters activities by year
		@param year : the year we want i.e 2014
		 */
		$scope.filterByYear = function(year) {
			$scope.selected_year.date = year || '';
		};

		/*
		submitNewActivity function : creates the object for new activity submission and makes the ajax call (POST)
		@param type : the type of the discipline ( accepted values : time, distance, points )
		 */
		$scope.submitNewActivity = function() {
			var data = $scope.newActivityForm;
			data.discipline = data.selected_discipline;

			//date must be of format "Thu Apr 11 2014" - "EEE MMM dd yyyy"
			$http.post('/users/' + $rootScope.localUser._id + '/activities', data)
				.success(function(res) {
					$scope.accordions.addActivity = false;
					$scope.activities.unshift(res);
				})
				.error(function(e) {});
		};

		/*
		  deleteActivity function : calls the modal for delete activitiy confirmation
		  @param activity_id: the id of the specific activity
		 */
		$scope.deleteActivity = function(activity_id) {
			ModalSvc.confirm_delete_modal(activity_id, 'lg')
				.then(function(result) {
					if (result) {
						for (var i in $scope.activities) {
							if ($scope.activities[i]._id == activity_id) {
								$scope.activities.splice(i, 1);
								break;
							}
						}
						AlertSvc.addAlert('success', 'You removed that activity!');
					} else {
						AlertSvc.addAlert('warning', 'Something went so f***ing wrong and this activity couldn\'t be deleted');
					}
				});

		};

		$scope.loadMore = function () {
			if ($rootScope.LAZY_LOADING_VIEW < $scope.activities.length) {
				$rootScope.LAZY_LOADING_VIEW += Utils.LAZY_LOADING_BLOCK_SIZE;
			} else {
				$scope.hasMoreToLoad = false;
			}
		};

		/*
		  initEditableActivity function : initializes variables for editing an existing activity
		 */
		$scope.initEditableActivity = function(activity) {
			console.log("init: "+activity.date);
			activity.show_editable_form = !activity.show_editable_form;

			$scope.updateActivityForm = {
				performance: {}
			};
			if ($scope.disciplines.time.indexOf(activity.discipline) > -1) {
				var splitted_performance = activity.performance.split(':');
				//we get the existed performance in hh:mm:ss.cc format.
				//We split it and add each part to the specific element
				$scope.updateActivityForm.performance.hours = splitted_performance[0].toString();
				$scope.updateActivityForm.performance.minutes = splitted_performance[1].toString();
				$scope.updateActivityForm.performance.seconds = splitted_performance[2].split('.')[0].toString();
				$scope.updateActivityForm.performance.centiseconds = splitted_performance[2].split('.')[1].toString();

			} else if ($scope.disciplines.distance.indexOf(activity.discipline) > -1) {
				$scope.updateActivityForm.performance.distance_1 = (parseInt(activity.performance / 10000)).toString();
				$scope.updateActivityForm.performance.distance_2 = (parseInt(((activity.performance / 10000) % $scope.updateActivityForm.performance.distance_1) * 100)).toString();
			} else if ($scope.disciplines.points.indexOf(activity.discipline) > -1) {
				$scope.updateActivityForm.performance.points = activity.performance;
			} else {
				console.err('activity belongs to undefined type');
			}

			$scope.updateActivityForm.date = activity.date;
			$scope.updateActivityForm.place = activity.place;
			$scope.updateActivityForm.location = activity.location;
			$scope.updateActivityForm.competition = activity.competition;
			$scope.updateActivityForm.notes = activity.notes;
			$scope.updateActivityForm.private = activity.private;
		};


		/*
		  updateActivity function : edit a specific activity
		 */
		$scope.updateActivity = function(activity) {
			var data = $scope.updateActivityForm;

			data.date = new Date(data.date);
			var splitDate = data.date.toString().split(' ');
			data.date = splitDate[0] + ' ' + splitDate[1] + ' ' + splitDate[2] + ' ' + splitDate[3];
			data.discipline = activity.discipline;

			$http.put("/users/" + $rootScope.localUser._id + "/activities/" + activity._id, data)
				.success(function(res) {
					activity.formatted_performance = res.formatted_performance;
					activity.formatted_date = res.formatted_date;
					activity.place = res.place;
					activity.location = res.location;
					activity.competition = res.competition;
					activity.notes = res.notes;
					activity.private = res.private;
					activity.show_editable_form = !activity.show_editable_form;
				})
		};

		/*
		  changePrivacy function : changes privacy of the activity
		 */
		$scope.changePrivacy = function(activity) {
			var _activity = !activity.private;
			$http.put("/users/" + $rootScope.localUser._id + "/activities/" + activity._id, {
					private: _activity
				})
				.success(function(res) {
					activity.private = res.private;
				})
		};
	}]); //end of controller

})();

