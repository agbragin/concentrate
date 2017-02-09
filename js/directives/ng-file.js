angular.module('ghop-ui')
.directive('ngFile', ['$parse', $parse => {

    return {
        restrict: 'A',
        link: (scope, element, attrs) => {

            let model = $parse(attrs.ngFile);
            let modelSetter = model.assign;

            element.bind('change', () => scope.$apply(() => modelSetter(scope, element[0].files[0])));
        }
    }
}]);