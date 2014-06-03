trafie.controller("mainController", function($rootScope, $scope, $http, $routeParams, $location){
	$http.get('/main_data')
	.success(function(res){
		console.log(res);
		$scope.user = res.user;
		$rootScope.user_first_name = res.user.first_name;
	});


	/*
		datepicker bootstrap settings -- > TO CHANGE
	 */
	 $scope.today = function() {
	    $scope.dt = new Date();
	  };
	  $scope.today();

	  $scope.clear = function () {
	    $scope.dt = null;
	  };

	  // Disable weekend selection
	  // $scope.disabled = function(date, mode) {
	  //   return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
	  // };

	  // $scope.toggleMin = function() {
	  //   $scope.minDate = $scope.minDate ? null : new Date();
	  // };
	  // $scope.toggleMin();

	  $scope.toggleMax = function() {
	    $scope.maxDate = $scope.maxDate ? null : new Date();
	  };
	  $scope.toggleMax();

	  $scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.opened = true;
	  };

	  $scope.dateOptions = {
	    formatYear: 'yy',
	    startingDay: 1
	  };

	  $scope.initDate = new Date();
	  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	  $scope.format = $scope.formats[0];
	  /*
	   end datepicker
	   */
});