trafie.controller("statisticsController", [
	'$rootScope','$scope','$http','$timeout','$routeParams',
	function($rootScope,$scope,$http,$timeout,$routeParams) {

	$scope.loading = true;

	//object with disciplines grouped in categories
	var disciplines = {
		'time': [
			'60m',
			'100m',
			'200m',
			'400m',
			'800m',
			'1500m',
			'3000m',
			'5000m',
			'10000m',
			'60m_hurdles',
			'100m_hurdles',
			'110m_hurdles',
			'400m_hurdles',
			'3000m_steeplechase',
			'4x100m_relay',
			'4x400m_relay',
			'half_marathon',
			'marathon',
			'20km_race_walk',
			'50km_race_walk',
			'cross_country_running',
		],
		'distance': [
			'high_jump',
			'long_jump',
			'triple_jump',
			'pole_vault',
			'shot_put',
			'discus',
			'hammer',
			'javelin'
		],
		'points': [
			'pentathlon',
			'heptathlon',
			'decathlon'
		]
	};

	// Load the Visualization API and the piechart package.
	$scope.statisticsInit = function() {
		$scope.page_not_found = false;
		$scope.selected_discipline = '';
		$scope.selected_year = '';
		$scope.isLoading = true;

		//C3 data model
		$scope.config = {};
		$scope.config.bindto = '#chart';
		$scope.config.data = {};
		$scope.config.data.json = [];
		$scope.config.data.keys = {
			x: 'date',
			value: ['performance', 'average']
		};

		// available types (can combined) 'area', 'area-spline', 'line', 'scatter', 'bar'
		$scope.config.data.types = {
			performance: 'line',
			average: 'line'
		};

		$scope.config.axis = {
			y: {},
			x: {
				// type: 'timeseries',
				localtime: false,
				tick: {
					fit: false,
					format: function(d) {
						return formatDate(d);
					}
				}
			}
		}
		$scope.config.tooltip = {
			format: {
				title: function(d) {
					formatDate(d);
				}
			}
		}

		$scope.config.subchart = {
			show: true
		}

		//CHECKING USER and init necessary parameters
		if ($routeParams.userID) {
			$routeParams.userID === $rootScope.localUser._id || $routeParams.userID === $rootScope.localUser.username ? $scope.self = true : $scope.self = false;
			$scope.drawSimpleChart($routeParams.userID, ($rootScope.current_user.discipline || $rootScope.current_user.disciplines_of_user[0].discipline), false, true)
			$scope.selected_discipline = $rootScope.current_user.discipline;
		} else {
			$rootScope.current_user = $rootScope.localUser;
			$scope.drawSimpleChart($rootScope.localUser._id, ($rootScope.localUser.discipline || $rootScope.localUser.disciplines_of_user[0].discipline), false, true);
			$scope.selected_discipline = $rootScope.current_user.discipline;
		}
	}

	/*********************************/
	/*    Chart Functions   */
	/*********************************/
	/**
	 * drawSimpleChart() : drawing the chart for a discipline of the specific user filtered by date
	 * @param user_id : the user id
	 * @param discipline : the discipline we want to show
	 * @param year : selected year used for data filtering
	 * @parame init : boolean that is true ONLY in first time we call this function
	 */
	$scope.drawSimpleChart = function(user_id, discipline, year, init) {
		//start loading indicator
		$scope.valid_data = false;
		$scope.isLoading = true;
		if ($scope.selected_discipline !== discipline) {
			init = true;
		}
		console.log(discipline);

		$scope.selected_discipline = discipline;
		var _query = '';
		if (!year) {
			$scope.selected_year = '';
			_query = '/users/' + user_id + '/activities?discipline=' + discipline;
		} else {
			$scope.selected_year = year;
			_query = '/users/' + user_id + '/activities?discipline=' + discipline + '&from=' + year + '-01-01&to=' + year + '-12-31';
		}

		//call ajax_get (defined in script.js) in order to fetch the specific performances
		$http.get(_query)
			.success(function(response) {
				// parse response as JSON
				var res = response;

				if (init) {
					$scope.active_years = [];
					for (i in res) {
						var _temp_year = new Date(res[i].date);
						if ($scope.active_years.indexOf(_temp_year.getFullYear()) === -1) {
							$scope.active_years.push(_temp_year.getFullYear());
						}
					}
				}

				//reset data
				$scope.config.data.json = []
					//hide loading indicator
				$scope.loading = false;

				var average = 0,
					sum = 0,
					response_length = res.length;

				if (response_length > 1) {
					$scope.valid_data = true;
					// TIME DISCIPLINE i.e : performance: "00:00:20.09"
					if (disciplines.time.indexOf(discipline) > -1) {

						for (var i = 0; i < response_length; i++) {
							sum = sum + parseInt(res[i].performance.split(':')[0] + res[i].performance.split(':')[1] + res[i].performance.split(':')[2].split('.')[0] + res[i].performance.split(':')[2].split('.')[1]);
						}

						average = sum / response_length;

						for (var i in res) {
							$scope.config.data.json.push({
								performance: res[i].performance.split(':')[0] + res[i].performance.split(':')[1] + res[i].performance.split(':')[2].split('.')[0] + res[i].performance.split(':')[2].split('.')[1],
								average: average,
								date: new Date(res[i].date)
							})
						}

						//Format Y Axis
						$scope.config.axis.y.tick = {
							format: function(d) {
								return formatChartTicks(d, 'time');
							}
						}
					}
					// DISTANCE DISCIPLINE
					else if (disciplines.distance.indexOf(discipline) > -1) {

						for (var i = 0; i < response_length; i++) {
							sum = sum + parseInt(res[i].performance);
						}
						average = sum / response_length;

						for (var i in res) {
							$scope.config.data.json.push({
								performance: res[i].performance / 10000,
								average: average / 10000,
								date: new Date(res[i].date)
							})
						}

						//Format Y Axis
						$scope.config.axis.y.tick = {
							format: function(d) {
								return formatChartTicks(d, 'distance');
							}
						}
					}
					// POINTS DISCIPLINE
					else if (disciplines.points.indexOf(discipline) > -1) {

						for (var i = 0; i < response_length; i++) {
							sum = sum + parseInt(res[i].performance);
						}
						average = sum / response_length;

						for (var i in res) {
							$scope.config.data.json.push({
								performance: res[i].performance,
								average: average,
								date: new Date(res[i].date)
							})
						}

						//Format Y Axis
						$scope.config.axis.y.tick = {
							format: function(d) {
								return formatChartTicks(d, 'points');
							}
						}
					}
					// ERROR
					else {
						console.log('- error in drawChart(). Unknown discipline:' + discipline);
					}
				}

				// inject config for C3 charts and generate them
				c3.generate($scope.config);


				$scope.isLoading = false;

			}) //end success
			.error(function(err) {
				console.log('drawSimpleChart error');
			});
	}; //end drawSimpleChart


	/**
	 * formatChartTicks() : makes the tick human readable
	 * @param data : the data we need to format
	 * @param discipline_type : the discipline type. Accepted values 'time', 'distance', 'points'
	 */
	function formatChartTicks(data, discipline_type) {
		switch (discipline_type) {
			case 'time':
				//convert number to string
				data = data + '';
				var _result = data.slice(-4, -2) + '.' + data.slice(-2);
				if (data.slice(-6, -4)) {
					_result = data.slice(-6, -4) + ':' + _result
				};
				if (data.slice(-8, -6)) {
					_result = data.slice(-8, -6) + ':' + _result
				}
				return _result;
				break;
			case 'distance':
				return data.toFixed(2);
				break;
			case 'points':
				return data;
				break;
			default:
				return data;
		}
	}

	/**
	 * formatDate() : formats the date to a specific format
	 * @param date : the date we need to format
	 */
	function formatDate(date) {
		var _temp = (new Date(date)).toString().split(' ');
		return _temp[2] + ' ' + _temp[1] + ' ' + _temp[3];
	}

}]);