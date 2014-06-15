trafie.controller("profileController", function( $scope, $http ){
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

	$http.get('/profile/'+ $scope.user._id)
	.success(function(res){
		console.log(res);
		$scope.user = res;
	});


	$http.get('/user/' + $scope.user._id + '/activities?discipline=high_jump')
	.success(function(res){
		$scope.activities = res;
	});

});