angular.module('ghop-ui')
.controller('TrackCreationController', ['$scope', '$log', '$uibModalInstance', 'TrackService', 'dataSourceTypes', 'referenceGenomeIds',
        ($scope, $log, $uibModalInstance, TrackService, dataSourceTypes, referenceGenomeIds) => {

    $log.debug('Track creation controller running');

    $scope.dataSourceTypes = dataSourceTypes;
    $scope.referenceGenomeIds = referenceGenomeIds;

    $scope.createTrackFromFile = () => {

        TrackService.createFromFile($scope.file, $scope.track, $scope.type, $scope.genome).then(
            trackResource => $uibModalInstance.close(trackResource),
            error => {
                $log.error(error);
                $uibModalInstance.dismiss();
            }
        );
    };

    $scope.cancel = () => $uibModalInstance.dismiss();
}]);