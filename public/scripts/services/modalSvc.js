trafie.service('$modalSvc', [ 
	'$scope', 
	'$modal', 
	'$http', 
	'$q', 
	'$timeout', 
	'$modalInstance', 
	function($scope, $modal, $http, $q, $timeout, $modalInstance) {
   
	   // Opens the modal
	   // @param size : lg(large), sm(small) can be empty
		$scope.open_modal = function (type, size) {
			switch(type) {
				case 'delete':
					$modal.open({
					  templateUrl: 'scripts/templates/modals/confirm_delete.html',
					  controller: ModalInstanceCtrl,
					  size: size
					});
					break;
				default:
					$modal.open({
					  templateUrl: 'scripts/templates/modals/confirm_delete.html',
					  controller: ModalInstanceCtrl,
					  size: size
					});
			}
		};

		var ModalInstanceCtrl = function ($scope, $modalInstance) {
		  $scope.ok = function () {
		    $modalInstance.close();
		  };

		  $scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		  };
		};
}]);