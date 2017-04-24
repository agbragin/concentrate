angular.module('ghop-ui')
.controller('TracksEditionController', ['$scope', '$log', '$uibModalInstance', 'TrackService', 'tracks',
        ($scope, $log, $uibModalInstance, TrackService, tracks) => {

    $log.debug('Track creation controller is running');

    $scope.tracks = tracks;

    $scope.isDefaultTrack = track => track.dataSource.type === 'REFERENCE' || track.dataSource.type === 'CHROMOSOME';

    $scope.removeTrack = track => {

        if (confirm(`Remove ${track.track}?`)) {

            TrackService.removeOne(track.track).then(
                () => $scope.tracks.splice(tracks.indexOf(track), 1),
                error => {
                    $log.error(error);
                    $uibModalInstance.dismiss();
                }
            );
        }
    };

    $scope.cancel = () => $uibModalInstance.close();
}]);