angular.module('ghop-ui')
.controller('MainController', ['$rootScope', '$scope', '$log',
        'AggregateOperators', 'FilterOperator',
        'TrackService', 'BandService', 'HateoasUtils',
        'StriperFactory', 'ReferenceGenomeService', 'AsyncService',
        ($rootScope, $scope, $log,
        AggregateOperators, FilterOperator,
        TrackService, BandService, HateoasUtils,
        StriperFactory, ReferenceGenomeService, AsyncService) => {

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
    );

    $scope.createTrackFromFile = () => {
        TrackService.createFromFile($scope.file, 'variants', 'variants_bed', 'GRCh37.p13').then(
            trackResource => $log.info(`Created ${trackResource.track} track of id: ${HateoasUtils.getResourceId(trackResource)}`),
            error => $log.error(error)
        );
    };

    let coord = new GenomicCoordinate('GRCh37.p13', 'chr1', 19845);
    let striper = StriperFactory.newStriperInstance(coord, 0, 1, ['api/dataSources/1']);
    striper.stripes.then(
        bandsResponse => $log.info(bandsResponse),
        error => $log.error(error)
    );
    coord = new GenomicCoordinate('GRCh37.p13', 'chr1', 19945);
    striper.hopTo(coord, 0, 1, ['api/dataSources/1']);
    striper.stripes.then(
        bandsResponse => $log.info(bandsResponse),
        error => $log.error(error)
    );

    ReferenceGenomeService.getReferenceGenomes(
        referenceGenomes => {
            $log.info(referenceGenomes);
            ReferenceGenomeService.getContigs(referenceGenomes[1], contigs => {
                $log.info(contigs);
                $log.warn(`0=${GenomicCoordinateComparator.compare(new GenomicCoordinate('GRCh37.p13', 'chr1', 1), new GenomicCoordinate('GRCh37.p13', 'chr1', 1), contigs)}`);
                $log.warn(`-1=${GenomicCoordinateComparator.compare(new GenomicCoordinate('GRCh37.p13', 'chr1', 1), new GenomicCoordinate('GRCh37.p13', 'chr1', 2), contigs)}`);
                $log.warn(`1=${GenomicCoordinateComparator.compare(new GenomicCoordinate('GRCh37.p13', 'chr2', 1), new GenomicCoordinate('GRCh37.p13', 'chr1', 1), contigs)}`);
            }, error => $log.error(error));
        },
        error => $log.error(error)
    );*/

    AsyncService.asyncHandle(ReferenceGenomeService.referenceGenomeIds, ids => $scope.referenceGenomeIds = ids);
    AsyncService.asyncHandle(ReferenceGenomeService.contigsMapping, mapping => $scope.contigsMapping = mapping);
    AsyncService.asyncHandle(ReferenceGenomeService.contigsMapping, mapping => {

        let coord = new GenomicCoordinate('GRCh37.p13', 'chr1', 19845);
        let striper = StriperFactory.newStriperInstance(coord, 0, 1, ['api/dataSources/1'], mapping);
        striper.hopTo(coord, 0, 6, ['api/dataSources/1']);
        striper.stripes.then(
            bandsResponse => $log.info(bandsResponse),
            error => $log.error(error)
        );
    });
}]);