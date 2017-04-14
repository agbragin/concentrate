angular.module('ghop-ui')
.directive('attributeFilterOperator', $log => {

    return {
        restrict: 'E',
        scope: {
            operator: '<'
        },
        templateUrl: 'templates/directives/attribute-filter-operator.html'
    }
});