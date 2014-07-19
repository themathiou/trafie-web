//Custom directives
//---
//Disciplines of the user
trafie.directive("trfActiveDisciplines", function( $http ){

	function getActivities(user_id, discipline){
		var url =  '';
		discipline != '' ? url = '/user/' + user_id + '/activities?discipline=' + discipline : url = '/user/' + user_id + '/activities';
		$http.get(url)
		.success(function(res){
			$scope.activities = res;
		})
	}

	return {
		restrict:'E',
		scope:{
			user_id:'@'
		},
		link: function(scope, element, attrs){
			$http.get('/user/'+scope.user_id+'/disciplines')
			.success(function(res){
				scope.response = res;
				scope.response.id = attrs.userId;
			})
		},
		template: '<ul><li ng-repeat="discipline in response" style="float:left;"><a ng-click="getActivities(\'{{ response.id }}\', \'{{ discipline.discipline }}\')">{{discipline.formatted_discipline}}</a></li></ul>'
	}
})