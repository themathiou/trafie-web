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

		//discipline
		$scope.edit_discipline = false;
		$scope.discipline_msg = '';

		//gender
		$scope.gender = false;
		$scope.gender_msg = '';

		//country
		$scope.country = false;
		$scope.country_msg = '';

		//age
		$scope.birthday = false;
		$scope.birthday_msg = '';

		//about
		$scope.about = false;
		$scope.about_msg = '';
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
					if( res.success ) {
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
					if( res.success ) {
						$scope.user.last_name = res.value;
						$scope.last_name_msg='Lastname successfully updated'; //SHOULD GET MESSAGE FROM RESPONSE LIKE FAIL CASE
						$scope.showHide('edit_lastname');

						/* after 3 secconds hide the message */
						$timeout(function(){
							$scope.last_name_msg = '';
						}, 3000);
					}
					else {
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
					if( res.success ) {
						$scope.user.discipline = res.value;
						$scope.discipline_msg='Discipline successfully updated'; //SHOULD GET MESSAGE FROM RESPONSE LIKE FAIL CASE
						$scope.showHide('edit_discipline');

						/* after 3 secconds hide the message */
						$timeout(function(){
							$scope.discipline_msg = '';
						}, 3000);
					}
					else {
						$scope.discipline_msg = res.message;

						/* after 3 secconds hide the message */
						$timeout(function(){
							$scope.discipline_msg = '';
						}, 3000);
					}
					$scope.user.discipline_formatted = res.translated_value;
				});
				break;

			case 'gender':
				data = { "gender" : $scope.user.gender  };
				console.log(data);
				$http.post('/settings_data', data)
				.success(function(res){
					if( res.success ) {
						$scope.user.gender = res.value;
						$scope.gender_msg='Gender successfully updated'; //SHOULD GET MESSAGE FROM RESPONSE LIKE FAIL CASE
						$scope.showHide('edit_gender');

						/* after 3 secconds hide the message */
						$timeout(function(){
							$scope.gender_msg = '';
						}, 3000);
					}
					else {
						$scope.gender_msg = res.message;

						/* after 3 secconds hide the message */
						$timeout(function(){
							$scope.gender_msg = '';
						}, 3000);
					}
					$scope.user.gender_formatted = res.translated_value;
				});
				break;

			case 'birthday':
				data = { "birthday" : $scope.user.new_birthday };
				console.log(data);
				$http.post('/settings_data', data)
				.success(function(res){
					if( res.success ) {
						$scope.user.birthday = res.value;
						$scope.birthday_msg='Birthday successfully updated'; //SHOULD GET MESSAGE FROM RESPONSE LIKE FAIL CASE
						$scope.showHide('edit_birthday');

						/* after 3 secconds hide the message */
						$timeout(function(){
							$scope.birthday_msg = '';
						}, 3000);
					}
					else {
						$scope.birthday_msg = res.message;

						/* after 3 secconds hide the message */
						$timeout(function(){
							$scope.birthday_msg = '';
						}, 3000);
					}
				});
				break;

			case 'country':
				data = { "country" : $scope.user.country };
				console.log(data);
				$http.post('/settings_data', data)
				.success(function(res){
					if( res.success ) {
						$scope.user.country = res.value;
						$scope.country_msg='Country successfully updated'; //SHOULD GET MESSAGE FROM RESPONSE LIKE FAIL CASE
						$scope.showHide('edit_country');

						/* after 3 secconds hide the message */
						$timeout(function(){
							$scope.country_msg = '';
						}, 3000);
					}
					else {
						$scope.country_msg = res.message;

						/* after 3 secconds hide the message */
						$timeout(function(){
							$scope.country_msg = '';
						}, 3000);
					}
					$scope.user.country_formatted = res.translated_value;
				});
				break;

			case 'about':
				data = { "about" : $scope.user.new_about };
				$http.post('/settings_data', data)
				.success(function(res){
					if( res.success ) {
						$scope.user.about = res.value;
						$scope.about_msg = 'About successfully updated'; //SHOULD GET MESSAGE FROM RESPONSE LIKE FAIL CASE
						$scope.showHide('edit_about');

						/* after 3 secconds hide the message */
						$timeout(function(){
							$scope.about_msg = '';
						}, 3000);
					}
					else {
						$scope.about_msg = res.message;

						/* after 3 secconds hide the message */
						$timeout(function(){
							$scope.about_msg = '';
						}, 3000);
					}
				});
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