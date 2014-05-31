trafie.controller("settingsController", function($rootScope, $scope, $http, $routeParams, $location){
	$http.get('/settings')
	.success(function(res){
		console.log(res);
	});
});