angular.module('ghop-ui')
.controller('MainController', ['$scope', '$log', 'AggregateOperators', 'FilterOperator', 'TrackService', 'BandService', 'HateoasUtils', ($scope, $log, AggregateOperators, FilterOperator, TrackService, BandService, HateoasUtils) => {

    $log.debug('Application main controller running');

    /*$log.warn(FilterOperator.LESS);
    $log.warn(AggregateOperators);

    TrackService.findAll().then(
        tracksResource => $log.warn(tracksResource),
        error => $log.error(error)
    );
    TrackService.getOne('some_track').then(
        trackResource => $log.warn(trackResource),
        error => $log.error(error)
    );
    TrackService.getOne('variants').then(
        trackResource => {
            $log.info(HateoasUtils.getResourceUri(trackResource));
            $log.info(HateoasUtils.getResourceId(trackResource));
            try {
                HateoasUtils.getResourceUri({'hateoas': false});
            } catch (e) {
                $log.error(e);
            }
        },
        error => $log.error(error)
    );*/

    $scope.createTrackFromFile = () => {
        TrackService.createFromFile($scope.file, 'variants', 'variants_bed', 'GRCh37.p13').then(
            trackResource => $log.info(`Created ${trackResource.track} track of id: ${HateoasUtils.getResourceId(trackResource)}`),
            error => $log.error(error)
        );
    };
}]);