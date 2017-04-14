angular.module('ghop-ui')
.directive('compile', ($compile, $timeout) => {
    return {
        restrict: 'A',
        link: (scope, element, attrs) => $timeout(() => $compile(element.contents())(scope))
    }
});