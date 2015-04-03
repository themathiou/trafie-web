function ModalSvcImpl($modal, $http, Activity) {

	//confirm_delete_modal
	// @param size : lg(large), sm(small) can be empty
	this.confirm_delete_modal = function(activity_id, size) {
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
	this.openFeedbackModal = function(size) {
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

    ///////////////////////////////////////////////////////////////////////////////////////
    // Public Factory Interface for Angular
    ///////////////////////////////////////////////////////////////////////////////////////
    return this;
};

var ModalInstanceCtrl = function($rootScope, $scope, $http, $modalInstance, Activity, temp_activity_id) {
	$scope.confirm_delete = function() {
		Activity.delete({userId: $rootScope.localUser._id, activityId: temp_activity_id}, function() {
				$modalInstance.close(true);
			}, function(err) {
				console.log('error in confirm_delete:', e, ' --- ' + temp_activity_id);
				$modalInstance.close(false);
			});
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