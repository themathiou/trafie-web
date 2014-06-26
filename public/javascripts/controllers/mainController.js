trafie.controller("mainController", function($rootScope, $scope, $http, $routeParams, $location) {
	$scope.appInit = function() {
		console.log('appInit', $rootScope.user);
	};
    
   /**
	 * [Syncs show and hide of elements]
	 * @param  String element_variable
	 * @return {[type]}
	 */
	$scope.showHide = function( element_variable ){
		$scope[element_variable] = !$scope[element_variable];
	}
	
	/**
	 * []
	 *@param
	*/
	$scope.searchUser = function(val) {
		console.log(val);
    return $http.get( '/search/?value='+ val )
		.then(function(res){
      var results = [];
			console.log(res);
      angular.forEach(res.data, function(tmp_user){
				tmp_user.label = tmp_user.first_name + ' ' + tmp_user.last_name + ' ' + tmp_user.formatted_country;
        results.push(tmp_user);
      });
			console.log('results', results);
      return results;
    });
  };
	
	
	/*
	* onSelect
	*/
	$scope.onSelect = function ($item, $model, $label) {
		$location.path('/' + $item._id);
	};
	
	/**
	 * datepicker bootstrap settings -- > TO CHANGE
	 */
	 $scope.today = function() {
	    $scope.dt = new Date();
	  };
	  $scope.today();

	  $scope.clear = function() {
	    $scope.dt = null;
	  };

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
	  $scope.showWeeks = false;
	  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	  $scope.format = $scope.formats[0];
	  /*
	   end datepicker
	   */
});