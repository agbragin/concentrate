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
 *******************************************************************************/


angular.module('concentrate')
.controller('FilterControlPanelController', ['$log', '$rootScope', '$scope', '$state', 'TrackService',
        function($log, $rootScope, $scope, $state, TrackService) {

    $scope.filterIsActive = () => $scope.track.activeDataSource.id !== $scope.track.dataSource.id;
    $scope.filterIsEmpty = () => !($scope.filter.filters.length || $scope.filter.aggregates.length);

    $scope.applyFilter = () => {

        let filterAction = $scope.filterIsEmpty() ? TrackService.removeFilter($scope.track) : TrackService.filter($scope.track, $scope.filter);
        filterAction.then(() => $scope.goBack());
    };
    $scope.disableFilter = () => TrackService.disableFilter($scope.track).then(() => $scope.goBack());

    $scope.goBack = () => $state.go($rootScope.applicationStates.get('browserView'));
}]);