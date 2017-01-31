angular.module('trafie-shared')
    .directive('replaceMetaContent', function () {
        function link(scope, element, attrs, ngModel) {
            attrs.$observe('replaceMetaContent', function(value){
                attrs.$set('content', value);
            });
        }

        return {
            restrict: 'A',
            scope: false,
            link: link
        }
    });
