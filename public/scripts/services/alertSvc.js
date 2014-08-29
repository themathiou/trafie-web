trafie.service('$alertSvc', function($rootScope, $http) {

  $rootScope.alerts = [];

  //types : danger, success, info, ---can be empty
  $rootScope.addAlert = function(type, message) {
    $rootScope.alerts.push({
      "type": type,
      "msg": message
    });
  };

  $rootScope.closeAlert = function(index) {
    $rootScope.alerts.splice(index, 1);
  };

});