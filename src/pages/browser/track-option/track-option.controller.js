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
.controller('TrackOptionController', ['$rootScope', '$log', '$scope', '$state', 'FailedRequestService', 'TrackService',
        function($rootScope, $log, $scope, $state, FailedRequestService, TrackService) {

    $scope.filtered = () => $scope.track.dataSource.id === $scope.track.activeDataSource.id ? '' : 'bg-olive';

    $scope.trackDown = () => {

        let trackIdx = $rootScope.availableTracks.indexOf($scope.track);
        if (trackIdx === ($rootScope.availableTracks.length - 1)) {
            $log.debug(`${$scope.track.name} track is already on the bottom`);
            return;
        }

        [$rootScope.availableTracks[trackIdx], $rootScope.availableTracks[trackIdx + 1]] = [$rootScope.availableTracks[trackIdx + 1], $rootScope.availableTracks[trackIdx]];

        $scope.$emit('updateBands');
    };

    $scope.trackUp = () => {

        let trackIdx = $rootScope.availableTracks.indexOf($scope.track);
        if (trackIdx === 0) {
            $log.debug(`${$scope.track.name} track is already on the top`);
            return;
        }

        [$rootScope.availableTracks[trackIdx], $rootScope.availableTracks[trackIdx - 1]] = [$rootScope.availableTracks[trackIdx - 1], $rootScope.availableTracks[trackIdx]];

        $scope.$emit('updateBands');
    };

    $scope.remove = () => {
        if (confirm(`Are you sure want to remove ${$scope.track.name} track?`)) {
            TrackService.remove($scope.track);
        }
    };
}]);