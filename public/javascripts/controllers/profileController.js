trafie.controller("profileController", function( $rootScope, $scope, $http, $routeParams ){
	//GENERAL VARIABLES
	$scope.disciplines = {
      'time': [
        '100m',
        '200m',
        '400m',
        '800m',
        '1500m',
        '3000m',
        '60m_hurdles',
        '100m_hurdles',
        '110m_hurdles',
        '400m_hurdles',
        '3000m_steeple',
        '4x100m_relay',
        '4x400m_relay',
        'marathon'
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

    //variable for Open/Close accordions
    $scope.accordions = {
    	addActivity : false
    }

    //time form
    $scope.newActivityForm = {};



    $scope.initProfile = function(){
		$scope.thisID = '';
		$scope.self = false;

		if( $routeParams.userID === undefined || $routeParams.userID == $rootScope.user._id){
				$scope.thisID = $rootScope.user._id;
				$scope.self = true;
				$scope.getProfile( $scope.thisID );
		}
		else{
			$scope.thisID = $routeParams.userID;
			$scope.self = false;
			$scope.getProfile( $scope.thisID );
		}
	}

		$scope.getProfile = function( user_id ){
			$http.get('/profile/'+ user_id)
			.success(function(res){
				console.log(res);
				$scope.profile = res;
				$scope.disciplines_options = [];
				for( i in res.disciplines ) {
					var temp = { name: res.disciplines[i] , id: i };
					$scope.disciplines_options.push(temp);
				}

				console.log($scope.profile);
				$scope.getActivities( user_id , $scope.profile.discipline);
			});
		}
		
		$scope.getActivities = function(user_id, discipline){
			var url =  '';
			discipline != '' ? url = '/user/' + user_id + '/activities?discipline=' + discipline : url = '/user/' + user_id + '/activities';
			$http.get(url)
			.success(function(res){
				$scope.activities = res;
			});
		};
	
	/*
	submitNewActivity function : creates the object for new activity submission and makes the ajax call (POST)
	@param type : the type of the discipline ( accepted values : time, distance, points ) 
	 */
	$scope.submitNewActivity = function(){
				
				var data = $scope.newActivityForm;
				data.discipline = data.selected_discipline.id;
				console.log('add activity: ', data.date);
				var splitDate = data.date.toString().split(' ');
				data.date = splitDate[0] + ' ' + splitDate[1] + ' ' +splitDate[2] + ' ' +splitDate[3]; 

				console.log(data);
				
				$http.post('/user/' + $rootScope.user._id + '/activities', data)
				.success(function(res){
					$scope.accordions.addActivity = false;
					$scope.activities.unshift(res);
				})
				.error(function(e){});
	}

	/*
		deleteActivity function : deletes a specific activity in profile
	 */
	$scope.deleteActivity = function( activity_id ){
		$http.delete( '/user/' + $rootScope.user._id +'/activities/' + activity_id )
		.success(function(res){
			for( var i in $scope.activities ) {
				if( $scope.activities[i]._id == activity_id ){
					$scope.activities.splice(i,1);
					break;
				}
			}
		})
		.error(function(e){})	
	}


	/*
		initEditableActivity function : initializes variables for editing an existing activity
	 */
	$scope.initEditableActivity = function( activity ){

		activity.show_this = !activity.show_this;

		$scope.updateActivityForm = {};
		if( $scope.disciplines.time.indexOf( activity.discipline ) > -1) {
			var splitted_performance = activity.performance.split(':');
			//we get the existed performance in hh:mm:ss.cc format.
				//We split it and add each part to the specific element
			$scope.updateActivityForm.hours = splitted_performance[0].toString();
			$scope.updateActivityForm.minutes = splitted_performance[1].toString();
			$scope.updateActivityForm.seconds = splitted_performance[2].split('.')[0].toString();
			$scope.updateActivityForm.centiseconds = splitted_performance[2].split('.')[1].toString();

		}
		else if( $scope.disciplines.distance.indexOf( activity.discipline ) > -1 ) {
			$scope.updateActivityForm.distance_1 = (parseInt( activity.performance/10000 )).toString();
			$scope.updateActivityForm.distance_2 = (parseInt( ( (activity.performance/10000) % $scope.updateActivityForm.distance_1 ) * 100 )).toString();
		}
		else if( $scope.disciplines.points.indexOf( activity.discipline ) > -1 ){
			$scope.updateActivityForm.points = activity.performance;
		}
		else{
			console.log('activity belongs to undefined type. WTF?');
		}

		$scope.updateActivityForm.date = activity.date;
	}


	/*
		updateActivity function : edit a specific activity
	 */
	$scope.updateActivity = function( activity ){
		var data = $scope.updateActivityForm;
		console.log('clean', data);
		
		data.date = new Date(data.date.toString().split('T')[0]);
		var splitDate = data.date.toString().split(' ');
		data.date = splitDate[0] + ' ' + splitDate[1] + ' ' +splitDate[2] + ' ' +splitDate[3];

		data.discipline = activity.discipline;
		console.log('update activity: ', data);
		$http.put( "/user/" + $rootScope.user._id + "/activities/" + activity._id, data)
		.success( function(res){
			console.log('res', res);
			activity.formatted_performance = res.formatted_performance;
			activity.formatted_date = res.formatted_date;
			activity.show_this = !activity.show_this;

		})


	}



});




























