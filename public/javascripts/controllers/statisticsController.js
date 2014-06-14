trafie.controller("statisticsController", function($rootScope, $scope, $http){
	
	$http.get('/settings_data')
	.success(function(res){
		console.log(res);
		$scope.user = res.user;
	});


});