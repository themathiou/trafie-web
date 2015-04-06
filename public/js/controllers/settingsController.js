(function () {
    'use strict';

	angular.module('trafie.controllers').controller("settingsController", [
		'$rootScope', '$timeout', '$scope', '$window', '$uploadSvc', 'Setting',
		function($rootScope, $timeout, $scope, $window, $uploadSvc, Setting) {


		/**
		 * [Initialize settings page behavior]
		 * @return {[type]}
		 */
		$scope.settingsInit = function() {

			/* --- profile --- */
			Setting.get(function(res) {
				$scope.localUser = res.user;
				$scope.localUser.new_first_name = $scope.localUser.first_name;
				$scope.localUser.new_last_name = $scope.localUser.last_name;
			});

			//object that closes all settings in ACCOUNT at init and resets the open to close
			$scope.isEditable = {
				//profile
				profile_pic: false,
				first_name: false,
				last_name: false,
				main_discipline: false,
				privacy: false,
				gender: false,
				birthday: false,
				country: false,
				about: false,
				//account
				password: false,
				language: false,
				date_format: false,
				username: false
			};

			//profile_pic
			if ($scope.localUser) {
				$scope.localUser.new_profile_pic = 'motherhacker';
			}
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
					if(!$scope.filesToUpload || !$scope.filesToUpload.length) {
		                return;
		            }
		            $scope.uploading = true;
	                var _file = $scope.filesToUpload[0];

	                $scope.upload = $uploadSvc.upload({
	                    url: '/settings_data',
	                    method: 'POST', //or 'PUT'
	                    //headers: {'header-key': 'header-value'},
	                    //withCredentials: true,
	                    data: {
	                        profile_pic: _file
	                    },
	                    file: _file // or list of files ($files) for html5 only
	                    //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
	                    // customize file formData name ('Content-Disposition'), server side file variable name.
	                    //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file'
	                    // customize how data is added to formData. See #40#issuecomment-28612000 -- Danial -- for sample code
	                    //formDataAppender: function(formData, key, val){}
	                })
	                .progress(function(evt) {
	                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
	                })
	                .success(function(data, status, headers, config) {
	                    // file is uploaded successfully
	                    $scope.uploading = false;
	                    $scope.filesToUpload = [];
	                    $scope.profile_pic_msg = data.message;
						$scope.toggleEdit('edit_profile_pic');
						$rootScope.current_user.picture = data.value;
						$rootScope.localUser.picture = data.value + '?v=' + Date.now(); // BAD PRACTICE. TO CHANGE.
						$scope.success = true;

						/* after 3 secconds hide the message */
						$timeout(function() {
							$scope.profile_pic_msg = '';
						}, 3000);
	                })
	                .error(function(res) {
	                    console.log(res);
	                    $scope.first_name_msg = res.message;
						$scope.success = false;
						console.log(res.error || res.message);

						/* after 3 seconds hide the message */
						$timeout(function() {
							$scope.first_name_msg = '';
						}, 3000);
	                });
	                //.then(success, error, progress);
	                // access or attach event listeners to the underlying XMLHttpRequest.
	                //.xhr(function(xhr){xhr.upload.addEventListener(...)})

					break;
				case 'first_name':
					data = {
						"first_name": $scope.localUser.new_first_name
					};
					Setting.save(data, function(res){
							$scope.localUser.first_name = res.value;
							$rootScope.localUser.first_name = res.value;
							$scope.first_name_msg = res.message;
							$scope.toggleEdit('first_name');
							$scope.success = true;
							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.first_name_msg = '';
							}, 3000);
						},
						function(err) {
							$scope.first_name_msg = err.message;
							$scope.success = false;
							console.log(err.error || err.message);

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.first_name_msg = '';
							}, 3000);
						});
					break;
				case 'last_name':
					data = {
						"last_name": $scope.localUser.new_last_name
					};
					Setting.save(data, function(res){
							$scope.localUser.last_name = res.value;
							$scope.last_name_msg = res.message;
							$scope.toggleEdit('last_name');
							$scope.success = true;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.last_name_msg = '';
							}, 3000);
						},
						function(err) {
							$scope.last_name_msg = err.message;
							$scope.success = false;
							console.log(err.error || err.message);

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.last_name_msg = '';
							}, 3000);
						});
					break;
				case 'discipline':
					data = {
						"discipline": $scope.localUser.new_main_discipline
					};
					Setting.save(data, function(res){
							$scope.localUser.discipline = res.value;
							if (res.translated_value) {
								$scope.localUser.discipline_formatted = res.translated_value;
							}
							// $scope.localUser.discipline_formatted = res.value;
							$scope.discipline_msg = res.message;
							$scope.toggleEdit('discipline');
							$scope.success = true;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.discipline_msg = '';
							}, 3000);
						},
						function(err) {
							$scope.discipline_msg = err.message;
							$scope.success = false;
							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.discipline_msg = '';
							}, 3000);
						});
					break;
				case 'privacy':
					data = {
						"private": $scope.localUser.new_privacy
					};
					Setting.save(data, function(res){
							$scope.localUser.private = res.value;
							$scope.privacy_msg = res.message;
							$scope.toggleEdit('privacy');
							$scope.success = true;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.privacy_msg = '';
							}, 3000);
						},
						function(err) {
							$scope.privacy_msg = err.message;
							$scope.success = false;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.privacy_msg = '';
							}, 3000);
						});
					break;
				case 'gender':
					data = {
						"gender": $scope.localUser.gender
					};
					Setting.save(data, function(res){
							$scope.localUser.gender = res.value;
							$scope.gender_msg = res.message;
							$scope.toggleEdit('gender');
							$scope.success = true;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.gender_msg = '';
							}, 3000);
							$scope.localUser.gender_formatted = res.translated_value;
						}, function(err) {
							$scope.gender_msg = err.message;
							$scope.success = false;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.gender_msg = '';
							}, 3000);
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

					Setting.save(data, function(res) {
							$scope.localUser.birthday = res.value;
							$scope.birthday_msg = res.message;
							$scope.toggleEdit('birthday');
							$scope.success = true;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.birthday_msg = '';
							}, 3000);
						}, function(err) {
							$scope.birthday_msg = err.message;
							$scope.success = false;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.birthday_msg = '';
							}, 3000);
						});
					break;
				case 'country':
					data = {
						"country": $scope.localUser.country
					};
					Setting.save(data, function(res) {
							$scope.localUser.country = res.value;
							$scope.country_msg = res.message;
							$scope.toggleEdit('country');
							$scope.success = true;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.country_msg = '';
							}, 3000);
							$scope.localUser.country_formatted = res.translated_value;
						}, function(err) {
							$scope.country_msg = err.message;
							$scope.success = false;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.country_msg = '';
							}, 3000);
						});
					break;
				case 'about':
					data = {
						"about": $scope.localUser.new_about
					};
					Setting.save(data, function(res) {
							$scope.localUser.about = res.value;
							$scope.about_msg = res.message;
							$scope.toggleEdit('about');
							$scope.success = true;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.about_msg = '';
							}, 3000);
						}, function(err) {
							$scope.about_msg = err.message;
							$scope.success = false;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.about_msg = '';
							}, 3000);
						});
					break;

				/*
				  Account Settings
				 */
				case 'password':
					data = {
						"old_password": $scope.localUser.old_password,
						"password": $scope.localUser.password,
						"repeat_password": $scope.localUser.repeat_password
					};
					Setting.save(data, function(res) {
							$scope.password_msg = res.message;
							$scope.toggleEdit('password');
							$scope.success = true;

							//clear fields
							$scope.localUser.old_password = '';
							$scope.localUser.password = '';
							$scope.localUser.repeat_password = '';

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.password_msg = '';
							}, 3000);
						}, function(err) {
							$scope.password_msg = err.message;
							$scope.success = false;

							//clear fields
							$scope.localUser.old_password = '';
							$scope.localUser.password = '';
							$scope.localUser.repeat_password = '';

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.password_msg = '';
							}, 3000);
						});
					break;
				case 'language':
					data = {
						"language": $scope.localUser.language
					};
					Setting.save(data, function(res) {
							$scope.localUser.language = res.value;
							$scope.language_msg = res.message;
							$scope.toggleEdit('edit_discipline');
							$scope.success = true;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.language_msg = '';
							}, 3000);

							$window.location.reload();
						}, function(err) {
							$scope.language_msg = err.message;
							$scope.success = false;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.language_msg = '';
							}, 3000);
						});
					$scope.localUser.language = res.translated_value;
					break;
				case 'date-format':
					data = {
						"date_format": $scope.localUser.date_format
					};
					Setting.save(data, function(res) {
							$scope.localUser.date_format = res.value;
							$scope.dateformat_msg = res.message;
							$scope.toggleEdit('edit_dateformat');
							$scope.success = true;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.dateformat_msg = '';
							}, 3000);
						}, function(err) {
							$scope.dateformat_msg = ερρ.message;
							$scope.success = false;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.dateformat_msg = '';
							}, 3000);
						});
					$scope.localUser.date_format = res.translated_value;
					break;
				case 'username':
					data = {
						"username": $scope.localUser.new_username
					};
					Setting.save(data, function(res) {
							$scope.localUser.username = res.value;
							$scope.username_msg = res.message;
							$scope.toggleEdit('username');
							$scope.success = true;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.username_msg = '';
							}, 3000);
						}, function(err) {
							$scope.username_msg = err.message;
							$scope.success = false;

							/* after 3 secconds hide the message */
							$timeout(function() {
								$scope.username_msg = '';
							}, 3000);
						});
					break;
				default:
					console.log('default switch case');
			}
		}

		/**
		 * [toggle edit for settings]
		 *
		 */
		$scope.toggleEdit = function(attribute) {
			if ($scope.isEditable[attribute]) {
				$scope.isEditable[attribute] = !$scope.isEditable[attribute];
			} else {
				angular.forEach($scope.isEditable, function(element, i) {
					$scope.isEditable[i] = false;
				});
				$scope.isEditable[attribute] = true;
			}
		}
	}]); //end of controller

})();
