angular.module('ghop-ui')
.controller('TrackCreationController', ['$scope', '$log', '$uibModalInstance', 'TrackService', 'dataSourceTypes', 'genome', 'trackNames',
        ($scope, $log, $uibModalInstance, TrackService, dataSourceTypes, genome, trackNames) => {

    $log.debug('Track creation controller running');

    $scope.dataSourceTypes = dataSourceTypes;
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