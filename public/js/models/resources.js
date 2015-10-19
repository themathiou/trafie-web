angular.module('trafie.models' , []);

///////////////////////////////////////////////////////////////////////////////////////////////
// *** User ***
///////////////////////////////////////////////////////////////////////////////////////////////
angular.module('trafie.models').factory('User', ['$resource', function($resource) {
  return $resource('/users/:userId');
}]);

///////////////////////////////////////////////////////////////////////////////////////////////
// *** Activities (of User) ***
///////////////////////////////////////////////////////////////////////////////////////////////
angular.module('trafie.models').factory('Activity', ['$resource', function($resource) {
  return $resource('/users/:userId/activities/:activityId', {userId: '@_userId', activityId: '@_activityId'}, {
    update: {
      method: 'PUT' // this method issues a PUT request
    }
  });
}]);

///////////////////////////////////////////////////////////////////////////////////////////////
// *** Disciplines (of User) ***
///////////////////////////////////////////////////////////////////////////////////////////////
angular.module('trafie.models').factory('Discipline', ['$resource', function($resource) {
  return $resource('/users/:userId/disciplines');
}]);


///////////////////////////////////////////////////////////////////////////////////////////////
// *** Settings (of User) ***
///////////////////////////////////////////////////////////////////////////////////////////////
angular.module('trafie.models').factory('Setting', ['$resource', function($resource) {
  return $resource('/settings_data');
}]);