//Custom directives
//---
//Disciplines of the user
trafie.directive("trfActiveDisciplines", function( $http ){
	return {
		restrict:'A',
		link: function(scope, element, attrs){
			$http.get('/user/'+attrs.user_id+'/disciplines')
			.success(function(res){
				scope.disciplines = res;
				console.log(scope.disciplines);
			});
		},
		template: '<ul><li ng-repeat="discipline in disciplines" style="float:left;"><a ng-click="getActivities(\'{{current_user._id}}\', \'{{discipline.discipline}}\')">{{discipline.formatted_discipline}}</a></li></ul>',
		
	}
})