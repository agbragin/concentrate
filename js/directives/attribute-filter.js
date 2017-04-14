angular.module('ghop-ui')
.directive('attributeFilter', () => {

    return {
        restrict: 'E',
        scope: {
            filter: '<'
        },
        controller: $scope => $scope.values = $scope.filter.values.join(', '),
        templateUrl: 'templates/directives/attribute-filter.html'
    }
});