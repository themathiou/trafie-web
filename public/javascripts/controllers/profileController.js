trafie.controller("profileController", function( $scope, $http ){

	$http.get('/profile/'+ $scope.user._id)
	.success(function(res){
		console.log(res);
		$scope.user = res.user;
	});
});