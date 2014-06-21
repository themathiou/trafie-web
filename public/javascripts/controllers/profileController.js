trafie.controller("profileController", function( $rootScope, $scope, $http ){
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
    	$http.get('/profile/'+ $rootScope.user._id)
		.success(function(res){
			console.log(res);
			$scope.profile = res;
			$scope.disciplines_options = [];
			for( i in res.disciplines ) {
				var temp = { name: res.disciplines[i] , id: i };
				$scope.disciplines_options.push(temp);
			}

			$scope.getActivities( $rootScope.user._id, $scope.profile.discipline);
		});
    }

	$scope.getActivities = function(user_id, discipline){
		$http.get('/user/' + user_id + '/activities?discipline=' + discipline)
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
				/* TO BE REMOVED - ADDS A TEMP TODAY DATE */
				var tmp = new Date();
				var splitDate = tmp.toString().split(' ');
				data.date = splitDate[0] + ' ' + splitDate[1] + ' ' +splitDate[2] + ' ' +splitDate[3]; 

				console.log(data);
				
				$http.post('/user/' + $rootScope.user._id + '/activities', data)
				.success(function(res){
					$scope.accordions.addActivity = false;
					$scope.activities.unshift(res);
				})
				.error(function(e){});
	}

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
});