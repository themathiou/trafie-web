trafie.service('$modalSvc', function($rootScope, $modal, $http) {

	//confirm_delete_modal
	// @param size : lg(large), sm(small) can be empty
	$rootScope.confirm_delete_modal = function(activity_id, size) {
		var modalInstance = $modal.open({
			templateUrl: 'templates/modals/confirm_delete.html',
			controller: ModalInstanceCtrl,
			size: size,
			resolve: {
				temp_activity_id: function() {
					return activity_id;
				}
			}
		});


		//return the promise from $modal.open() function
		return modalInstance.result;
	};

	//openFeedbackModal
	$rootScope.openFeedbackModal = function(size) {
		var modalInstance = $modal.open({
			templateUrl: 'templates/modals/feedback_form.html',
			controller: ModalInstanceCtrl,
			size: size || 'lg',
			resolve: {
				temp_activity_id: function() {
					return 'mathiou';
				}
			}
		});

		//return the promise from $modal.open() function
		return modalInstance.result;
	};
});

var ModalInstanceCtrl = function($rootScope, $scope, $http, $modalInstance, temp_activity_id) {
	$scope.confirm_delete = function() {
		$http.delete('/users/' + $rootScope.localUser._id + '/activities/' + temp_activity_id)
			.success(function(res) {
				$modalInstance.close(true);
			})
			.error(function(e) {
				console.log('error in confirm_delete:', e, ' --- ' + temp_activity_id);
				$modalInstance.close(false);
			})
	}

	$scope.ok = function() {
		$modalInstance.close();
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};

	$scope.submitFeedbackForm = function() {
		data = {
			"feedback_text": $scope.localUser.feedback_text
		};
		$http.post('/feedback', data)
			.success(function(res) {
				console.log("feedback message send successfully");
				$modalInstance.close(true);
			})
			.error(function(res) {
				console.error("feedback message couldn't be send!");
				$modalInstance.close(true);
			});
	}
};








