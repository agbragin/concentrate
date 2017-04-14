angular.module('ghop-ui')
.controller('TrackFilterController', ['$rootScope', '$log', '$scope', '$uibModal', '$uibModalInstance', 'track', ($rootScope, $log, $scope, $uibModal, $uibModalInstance, track) => {

    $log.debug(`${track.track} track filter model window activated`);

    $scope.attributes = track.attributes;
    if (!$rootScope.rootAggregate) {
        $rootScope.rootAggregate = AttributeAggregate.empty('AND');
    }

    $scope.activeAttribute = undefined;

    $scope.setActiveAttribute = attribute => {
        $rootScope.attributeFilterToAdd = undefined;
        $scope.activeAttribute = attribute;
        $scope.operator = attribute.filterOperators[0];
    };

    $scope.isActiveAttribute = attribute => $scope.activeAttribute === attribute;

    $scope.consistent = () => $scope.activeAttribute && $scope.operator && $scope.values &&  $scope.values.length && $scope.values[0] !== undefined && $scope.values[0] !== "";

    $scope.typeClass = type => {

        switch (type) {
            case 'BOOLEAN':
                return 'label-warning';

            case 'INTEGER':
                return 'label-primary';

            case 'FLOAT':
                return 'label-info';

            case 'SET':
                return 'label-danger';

            case 'STRING':
                return 'label-success';

            default:
                $log.warn(`Unknown attribute type: ${type}`);
                return 'label-default';
        };
    };

    $scope.additionBtnStyle = () => (!$scope.consistent()) ? 'btn-default' : ($rootScope.attributeFilterToAdd ? 'btn-warning' : 'btn-primary');

    $scope.buildAttributeFilter = () => $rootScope.attributeFilterToAdd ? $rootScope.attributeFilterToAdd = undefined : $rootScope.attributeFilterToAdd = new AttributeFilter_($scope.activeAttribute, $scope.operator, $scope.values, $scope.includeNulls);
    $scope.additionStep = () => (!$scope.consistent()) ? 'Select operator and specify filter values' : ($rootScope.attributeFilterToAdd ? 'Now click on the context of interest (or here again to cancel)' : 'Click here to build and add the filter');

    $scope.handleCtxClick = () => {

        if ($rootScope.attributeFilterToAdd) {

            $log.debug('Adding filter to root context');

            $rootScope.rootAggregate.addFilter($rootScope.attributeFilterToAdd);
            $rootScope.attributeFilterToAdd = undefined;
        }
    };

    $scope.filterIsEmpty = () => !$rootScope.rootAggregate.filters.length && !$rootScope.rootAggregate.aggregates.length;

    $scope.createFilter = () => $uibModalInstance.close(new TrackFilterEntity($rootScope.rootAggregate));
    $scope.clearFilter = () => $uibModalInstance.close(null);
    $scope.cancel = () => $uibModalInstance.dismiss();
}]);