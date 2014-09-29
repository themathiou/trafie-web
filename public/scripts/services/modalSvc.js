trafie.service('$modalSvc', function($rootScope, $modal, $http) {

  // @param size : lg(large), sm(small) can be empty
  $rootScope.confirm_delete_modal = function(activity_id, size) {
    //$rootScope.temp_activity_id = activity_id;

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
};