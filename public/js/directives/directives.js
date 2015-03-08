// Initialize the directives. This MUST be the first directives file that is loaded.
angular.module('trafie.directives' , []);

(function () {
    'use strict';

	angular.module('trafie.directives', []).directive('whenScrolled', ['$window', function($window) {
	    return {
            restrict: "A",
            link: function(scope, element, attrs) {
                console.log(element);
            	angular.element($window).bind("scroll", function() {
	                var threshold = 2 * element[0].offsetTop;

                    console.log(element[0].scrollHeight, $window.scrollY, element[0].scrollHeight - $window.scrollY);
            		if (element[0].scrollHeight - $window.scrollY < threshold) {
                        scope.$apply(attrs.whenScrolled);
            		}
            	});
            }
        };
	}]);
})();