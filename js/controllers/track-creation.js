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
.controller('TrackCreationController', ['$scope', '$log', '$uibModalInstance', 'TrackService', 'dataSourceTypes', 'genome', 'trackNames',
        ($scope, $log, $uibModalInstance, TrackService, dataSourceTypes, genome, trackNames) => {

    $log.debug('Track creation controller running');

    $scope.dataSourceTypes = dataSourceTypes.filter(it => it !== 'REFERENCE' && it !== 'CHROMOSOME');
    $scope.trackNames = trackNames;

    $scope.createTrackFromFile = () => {

        TrackService.createFromFile($scope.file, $scope.track, $scope.type, genome).then(
            trackResource => $uibModalInstance.close(trackResource),
            error => {
                $log.error(error);
                $uibModalInstance.dismiss();
            }
        );
    };

    $scope.cancel = () => $uibModalInstance.dismiss();
}]);