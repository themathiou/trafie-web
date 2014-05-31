trafie.controller("mainController", function($rootScope, $scope, $http, $routeParams, $location){
	$http.get('/main_data')
	.success(function(res){
		console.log(res);
	});
});