trafie.controller("profileController", function( $rootScope, $scope, $http ){
	//GENERAL VIARABLES
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
	

});