trafie.controller("settingsController", function($rootScope, $timeout, $scope, $http, $routeParams, $location){
	$http.get('/settings_data')
	.success(function(res){
		console.log(res);
		$scope.user = res.user;
	});

	/**
	 * [Initialize settings page behavior]
	 * @return {[type]}
	 */
	$scope.settingsInit = function(){
		//firstname
		$scope.edit_firstname = false;
		$scope.first_name_msg = '';

		//lastname
		$scope.edit_lastname = false;
		$scope.last_name_msg = '';
	}
	
	/**
	 * [Syncs show and hide of elements]
	 * @param  String element_variable
	 * @return {[type]}
	 */
	$scope.showHide = function( element_variable ){
		$scope[element_variable] = !$scope[element_variable];
	}


	/**
	 * [Posting the changes in settings]
	 * @param string setting : which setting we change
	 * @return {[type]}
	 */
	$scope.submitChangeSetting = function( setting ) {
		var data = {};

		switch(setting){
			/*
				Profile settings
			 */
			case 'first_name':
				data = { "first_name" : $scope.user.new_first_name  };
				console.log(data);
				$http.post('/settings_data', data)
				.success(function(res){
					if( res.success == true ) {
						$scope.user.first_name = res.value;
						$rootScope.user_first_name = res.value;
						$scope.first_name_msg='Firstname successfully updated'; //SHOULD GET MESSAGE FROM RESPONSE LIKE FAIL CASE
						$scope.showHide('edit_firstname');

						/* after 3 secconds hide the message */
						$timeout(function(){
							$scope.first_name_msg = '';
						}, 3000);
					}
					else {
						$scope.firstname_msg_show = true;
						$scope.first_name_msg = res.message;

						/* after 3 secconds hide the message */
						$timeout(function(){
							$scope.first_name_msg = '';
						}, 3000);
					}
					
				});
				break;

			case 'last_name':
				data = { "last_name" : $scope.user.new_last_name  };
				console.log(data);
				$http.post('/settings_data', data)
				.success(function(res){
					if( res.success == true ) {
						$scope.user.last_name = res.value;
						$scope.last_name_msg='Lastname successfully updated'; //SHOULD GET MESSAGE FROM RESPONSE LIKE FAIL CASE
						$scope.showHide('edit_lastname');

						/* after 3 secconds hide the message */
						$timeout(function(){
							$scope.last_name_msg = '';
						}, 3000);
					}
					else {
						$scope.lastname_msg_show = true;
						$scope.last_name_msg = res.message;

						/* after 3 secconds hide the message */
						$timeout(function(){
							$scope.last_name_msg = '';
						}, 3000);
					}
					
				});
				break;
			
			case 'discipline':
				data = { "discipline" : $scope.user.discipline  };
				console.log(data);
				$http.post('/settings_data', data)
				.success(function(res){
					console.log(res);
					$scope.user.discipline_formatted = res.translated_value;
				});
				break;

			case 'gender':
				break;

			case 'age':
				break;

			case 'country':
				break;

			case 'about':
				break;

			/*
				Account Settings
			 */
			case 'language':
				break;

			case 'dateformat':
				break;
			case 'username':
				break;

			
			default:
				console.log('default switch case');
		}
	}

});