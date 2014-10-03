trafie.controller("settingsController", function(
	$rootScope,
	$timeout,
	$scope,
	$window,
	$http) {


	/**
	 * [Initialize settings page behavior]
	 * @return {[type]}
	 */
	$scope.settingsInit = function() {

		/* --- profile --- */
		$http.get('/settings_data')
			.success(function(res) {
				console.log(res);
				$scope.localUser = res.user;
				$scope.localUser.new_first_name = $scope.localUser.first_name;
				$scope.localUser.new_last_name = $scope.localUser.last_name;
			});

		//profile_pic
		if ($scope.localUser) {
			$scope.localUser.new_profile_pic = 'motherhacker';
		}
		$scope.profile_pic_msg = '';

		//firstname
		$scope.first_name_msg = '';

		//lastname
		$scope.last_name_msg = '';

		//discipline
		$scope.discipline_msg = '';

		//gender
		$scope.gender_msg = '';

		//country
		$scope.country_msg = '';

		//birthday
		$scope.birthday_msg = '';

		//about
		$scope.about_msg = '';


		/* --- account --- */
		//language
		$scope.language_msg = '';
	}


	/**
	 * [Posting the changes in settings]
	 * @param string setting : which setting we change
	 * @return {[type]}
	 */
	$scope.submitChangeSetting = function(setting) {
		var data = {};

		switch (setting) {
			/*
			  Profile settings
			 */
			case 'profile_pic':
				data = {
					"profile_pic": $scope.localUser.new_profile_pic
				};
				console.log($scope.localUser.new_profile_pic);
				$http.post('/settings_data', data)
					.success(function(res) {
						console.log(res);
						if (res.success) {
							$scope.localUser.profile_pic = res.value;
							$scope.profile_pic_msg = 'Profile pic successfully updated'; //SHOULD GET MESSAGE FROM RESPONSE LIKE FAIL CASE
							$scope.showHide('edit_profile_pic');

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.profile_pic_msg = '';
							}, 3000);
						} else {
							$scope.profile_pic_msg = res.message;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.profile_pic_msg = '';
							}, 3000);
						}
					});
				break;
			case 'first_name':
				data = {
					"first_name": $scope.localUser.new_first_name
				};
				console.log(data);
				$http.post('/settings_data', data)
					.success(function(res) {
						if (res.success) {
							$scope.localUser.first_name = res.value;
							$rootScope.localUser.first_name = res.value;
							$scope.first_name_msg = 'Firstname successfully updated'; //SHOULD GET MESSAGE FROM RESPONSE LIKE FAIL CASE
							$scope.showHide('edit_fname');
							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.first_name_msg = '';
							}, 3000);
						} else {
							$scope.first_name_msg = res.message;
							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.first_name_msg = '';
							}, 3000);
						}
					});
				break;
			case 'last_name':
				data = {
					"last_name": $scope.localUser.new_last_name
				};
				console.log(data);
				$http.post('/settings_data', data)
					.success(function(res) {
						if (res.success) {
							$scope.localUser.last_name = res.value;
							$scope.last_name_msg = 'Lastname successfully updated'; //SHOULD GET MESSAGE FROM RESPONSE LIKE FAIL CASE
							$scope.showHide('edit_lastname');

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.last_name_msg = '';
							}, 3000);
						} else {
							$scope.last_name_msg = res.message;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.last_name_msg = '';
							}, 3000);
						}
					});
				break;
			case 'discipline':
				data = {
					"discipline": $scope.localUser.new_main_discipline
				};
				console.log(data);
				$http.post('/settings_data', data)
					.success(function(res) {
						if (res.success) {
							$scope.localUser.discipline = res.value;
							$scope.localUser.discipline_formatted = res.value;
							//SHOULD GET MESSAGE FROM RESPONSE FOR FAIL CASE
							$scope.discipline_msg = 'Discipline successfully updated';
							$scope.showHide('edit_discipline');

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.discipline_msg = '';
							}, 3000);
						} else {
							$scope.discipline_msg = res.message;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.discipline_msg = '';
							}, 3000);
						}
						$scope.localUser.discipline_formatted = res.translated_value;
					});
				break;
			case 'privacy':
				data = {
					"private": $scope.localUser.new_privacy
				};
				console.log(data);
				$http.post('/settings_data', data)
					.success(function(res) {
						if (res.success) {
							$scope.localUser.private = res.value;
							$scope.privacy_msg = 'Privacy successfully updated'; //SHOULD GET MESSAGE FROM RESPONSE LIKE FAIL CASE
							$scope.showHide('edit_privacy');

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.privacy_msg = '';
							}, 3000);
						} else {
							$scope.privacy_msg = res.message;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.privacy_msg = '';
							}, 3000);
						}
					});
				break;
			case 'gender':
				data = {
					"gender": $scope.localUser.gender
				};
				console.log(data);
				$http.post('/settings_data', data)
					.success(function(res) {
						if (res.success) {
							$scope.localUser.gender = res.value;
							$scope.gender_msg = 'Gender successfully updated'; //SHOULD GET MESSAGE FROM RESPONSE LIKE FAIL CASE
							$scope.showHide('edit_gender');

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.gender_msg = '';
							}, 3000);
						} else {
							$scope.gender_msg = res.message;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.gender_msg = '';
							}, 3000);
						}
						$scope.localUser.gender_formatted = res.translated_value;
					});
				break;
			case 'birthday':
				//var utc = new Date($scope.localUser.new_birthday.getUTCFullYear(), $scope.localUser.new_birthday.getUTCMonth(), $scope.localUser.new_birthday.getUTCDate(),  $scope.localUser.new_birthday.getUTCHours(), $scope.localUser.new_birthday.getUTCMinutes(), $scope.localUser.new_birthday.getUTCSeconds());;
				//var iso = $scope.localUser.new_birthday.toISOString();
				// $scope.localUser.new_birthday = bday[0] + ' ' + bday[1] + ' ' + bday[2] + ' ' + bday[3];
				var selected_date = $scope.localUser.new_birthday;


				data = {
					"birthday": {
						"day": selected_date.getDate(),
						"month": selected_date.getMonth(),
						"year": selected_date.getFullYear()
					}
				};

				console.log(data);
				$http.post('/settings_data', data)
					.success(function(res) {
						if (res.success) {
							$scope.localUser.birthday = res.value;
							$scope.birthday_msg = 'Birthday successfully updated'; //SHOULD GET MESSAGE FROM RESPONSE LIKE FAIL CASE
							$scope.showHide('edit_birthday');

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.birthday_msg = '';
							}, 3000);
						} else {
							$scope.birthday_msg = res.message;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.birthday_msg = '';
							}, 3000);
						}
					});
				break;
			case 'country':
				data = {
					"country": $scope.localUser.country
				};
				console.log(data);
				$http.post('/settings_data', data)
					.success(function(res) {
						if (res.success) {
							$scope.localUser.country = res.value;
							$scope.country_msg = 'Country successfully updated'; //SHOULD GET MESSAGE FROM RESPONSE LIKE FAIL CASE
							$scope.showHide('edit_country');

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.country_msg = '';
							}, 3000);
						} else {
							$scope.country_msg = res.message;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.country_msg = '';
							}, 3000);
						}
						$scope.localUser.country_formatted = res.translated_value;
					});
				break;
			case 'about':
				data = {
					"about": $scope.localUser.new_about
				};
				$http.post('/settings_data', data)
					.success(function(res) {
						if (res.success) {
							$scope.localUser.about = res.value;
							$scope.about_msg = 'About successfully updated'; //SHOULD GET MESSAGE FROM RESPONSE LIKE FAIL CASE
							$scope.showHide('edit_about');

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.about_msg = '';
							}, 3000);
						} else {
							$scope.about_msg = res.message;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.about_msg = '';
							}, 3000);
						}
					});
				break;

				/*
				  Account Settings
				 */
			case 'password':
				break;
			case 'language':
				data = {
					"language": $scope.localUser.new_language
				};
				console.log(data);
				$http.post('/settings_data', data)
					.success(function(res) {
						if (res.success) {
							$scope.localUser.language = res.value;
							$scope.discipline_msg = 'Discipline successfully updated'; //SHOULD GET MESSAGE FROM RESPONSE LIKE FAIL CASE
							$scope.showHide('edit_discipline');

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.language_msg = '';
							}, 3000);

							$window.location.reload();
						} else {
							$scope.language_msg = res.message;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.language_msg = '';
							}, 3000);
						}
						$scope.localUser.language = res.translated_value;
					});
				break;
			case 'date-format':
				data = {
					"date_format": $scope.localUser.date_format
				};
				console.log(data);
				$http.post('/settings_data', data)
					.success(function(res) {
						if (res.success) {
							$scope.localUser.date_format = res.value;
							$scope.discipline_msg = 'Date format successfully updated'; //SHOULD GET MESSAGE FROM RESPONSE LIKE FAIL CASE
							$scope.showHide('edit_dateformat');

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.dateformat_msg = '';
							}, 3000);
						} else {
							$scope.dateformat_msg = res.message;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.dateformat_msg = '';
							}, 3000);
						}
						$scope.localUser.date_format = res.translated_value;
					});
				break;
			case 'username':
				data = {
					"username": $scope.localUser.new_username
				};
				console.log(data);
				$http.post('/settings_data', data)
					.success(function(res) {
						if (res.success) {
							$scope.localUser.username = res.value;
							$scope.discipline_msg = 'Username successfully updated'; //SHOULD GET MESSAGE FROM RESPONSE LIKE FAIL CASE
							$scope.showHide('edit_username');

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.localUsername_msg = '';
							}, 3000);
						} else {
							$scope.localUsername_msg = res.message;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.localUsername_msg = '';
							}, 3000);
						}
					});
				break;

			default:
				console.log('default switch case');
		}
	}

	/**
	 * [Logs out]
	 */
	$scope.logout = function() {
		$rootScope.localUser = {};
		$window.location.href = '/logout';
	}


});