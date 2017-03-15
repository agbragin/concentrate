angular.module('ghop-ui')
.controller('TracksEditionController', ['$scope', '$log', '$uibModalInstance', 'TrackService', 'tracks',
        ($scope, $log, $uibModalInstance, TrackService, tracks) => {

    $log.debug('Track creation controller running');

    $scope.tracks = tracks;

    $scope.removeTrack = track => {

        TrackService.removeOne(track.track).then(
            () => {
                $scope.tracks.splice(tracks.indexOf(track), 1);   
            },
            error => {
                $log.error(error);
                $uibModalInstance.dismiss();
            }
        );
    };

    $scope.removeTracks = () => {

        if (confirm("Remove all tracks? You will lose all previously uploaded files")) {
            
            TrackService.removeAll().then(response => {
                $scope.tracks.splice(0, $scope.tracks.length);
                $uibModalInstance.close();
            });
            
            $log.info(`All tracks removed`);
        }                
    };

    $scope.cancel = () => $uibModalInstance.close();
}]);