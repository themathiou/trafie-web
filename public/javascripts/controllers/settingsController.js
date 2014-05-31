trafie.controller("settingsController", function($rootScope, $scope, $http, $routeParams, $location){
	$http.get('/settings_data')
	.success(function(res){
		console.log(res);
	});
});