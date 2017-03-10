angular.module('ghop-ui')
.directive('notInList', [() => {

    let isValid = (list, value) => list.indexOf(value) === -1;

    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            list: '=notInList'
        },
        link: (scope, elm, attrs, ngModel) => {
            ngModel.$parsers.unshift(viewValue => {
                ngModel.$setValidity('notInList', isValid(scope.list, viewValue));
                return viewValue;
            });
        }
    }
}]);