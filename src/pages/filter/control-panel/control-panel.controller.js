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
.controller('FilterControlPanelController', ['$log', '$scope', 'TrackService', function($log, $scope, TrackService) {

    $log.debug(`${$scope.track.name} track filter control panel is running`);

    $scope.filterIsActive = () => $scope.track.activeDataSource.id !== $scope.track.dataSource.id;
    $scope.filterIsEmpty = () => !($scope.filter.filters.length || $scope.filter.aggregates.length);

    $scope.applyFilter = () => {
        $log.debug(`Trying to apply ${$scope.track.name} filter`);
        TrackService.filter($scope.track, $scope.filter);
    };

    $scope.disableFilter = () => {
        $log.debug(`Trying to disable ${$scope.track.name} filter`);
        TrackService.disableFilter($scope.track);
    };
}]);