/*******************************************************************************
 *     Copyright 2016-2017 the original author or authors.
 *
 *     This file is part of CONC.
 *
 *     CONC. is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     CONC. is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with CONC. If not, see <http://www.gnu.org/licenses/>.
 *******************************************************************************/

angular.module('ghop-ui')
.controller('TrackFilterController', ['$rootScope', '$log', '$scope', '$uibModal', '$uibModalInstance', 'track', ($rootScope, $log, $scope, $uibModal, $uibModalInstance, track) => {

    $log.debug(`${track.track} track filter model window activated`);

    if (!$rootScope.trackQueries) {
        $log.debug('TrackQueries is undefined: creating new one');
        $rootScope.trackQueries = new Object();
    }

    if (!$rootScope.trackQueries[track.track]) {
        $log.debug(`${track.track} query is undefined: creating new one`);
        $rootScope.trackQueries[track.track] = AttributeAggregate.empty('AND');
    }

    $rootScope.rootAggregate = new AttributeAggregate(
            Array.from($rootScope.trackQueries[track.track].filters),
            Array.from($rootScope.trackQueries[track.track].aggregates),
            $rootScope.trackQueries[track.track].operator);

    $scope.attributes = track.attributes;
    $scope.activeAttribute = undefined;
    $rootScope.attributeFilterToAdd = undefined;

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

    $scope.createFilter = () => $uibModalInstance.close($rootScope.rootAggregate);
    $scope.clearFilter = () => $uibModalInstance.close(null);
    $scope.cancel = () => $uibModalInstance.dismiss();
}]);