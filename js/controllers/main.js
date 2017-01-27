angular.module('ghop-ui')
.controller('MainController', ['$scope', '$log', '$uibModal', 'AsyncService', 'DataSourceService', 'Genetics', 'HateoasUtils', 'ReferenceGenomeService', 'StriperFactory',
        ($scope, $log, $uibModal, AsyncService, DataSourceService, Genetics, HateoasUtils, ReferenceGenomeService, StriperFactory) => {

    $log.debug('Application main controller running');

    $scope.dataSourceTypes = Genetics.dataSourceTypes;

    /**
     * Retrieve available reference genomes data
     */
    AsyncService.asyncHandle(ReferenceGenomeService.referenceGenomeIds, ids => {
        $log.debug(`Reference genome ids successfully retrieved and saved into controller's model`);
        $scope.referenceGenomeIds = ids;
    });
    AsyncService.asyncHandle(ReferenceGenomeService.contigsMapping, mapping => {
        $log.debug(`Contigs mapping successfully retrieved and saved into controller's model`);
        $scope.contigsMapping = mapping;
    });
    /**
     * Retrieve available data sources data
     */
    AsyncService.asyncHandle(DataSourceService.findAll(), dataSourcesResource => {
        $scope.dataSources = dataSourcesResource['_embedded'].dataSources;
        $log.debug(`Found ${$scope.dataSources.length} data sources: ${$scope.dataSources.map(HateoasUtils.getResourceUri)}`);
    });

    $scope.openTrackCreationModal = () => {

        let modalInstance = $uibModal.open({
            animation: true,
            controller: 'TrackCreationController',
            size: 'md',
            resolve: {
                dataSourceTypes: () => $scope.dataSourceTypes,
                referenceGenomeIds: () => $scope.referenceGenomeIds
            },
            templateUrl: 'templates/modals/track-creation.html'
        });

        modalInstance.result.then(
            trackResource => {

                $log.info(`Created ${trackResource.track} track on uri: ${HateoasUtils.getResourceUri(trackResource)}`);
                DataSourceService.findAll().then(
                    dataSourcesResource => {
                        $scope.dataSources = dataSourcesResource['_embedded'].dataSources;
                        $log.debug(`Found ${$scope.dataSources.length} data sources: ${$scope.dataSources.map(HateoasUtils.getResourceUri)}`);
                    },
                    error => $log.error(error)
                );
            },
            () => $log.info('Track creation dismissed')
        );
    };

    $scope.createStriper = () => {

        $scope.striper = StriperFactory.newStriperInstance(
                new GenomicCoordinate($scope.genome, $scope.contig, $scope.coord),
                $scope.left, $scope.right,
                $scope.dataSources.filter(dataSource => dataSource.checked)
                        .map(HateoasUtils.getResourceUri), $scope.contigsMapping);
        $scope.revealStripes();
    };

    $scope.revealStripes = () => {
        $scope.striper.stripes.then(
            stripes => $scope.stripes = stripes,
            error => $log.error(error)
        );
    };

    $scope.leftmostStripeCoord = () => {

        return $scope.stripes
                .filter(stripe => (stripe.startCoord === 0 || stripe.endCoord === 0))[0] ? 0 : 1;
    };

    $scope.rightmostStripeCoord = () => {

        return $scope.stripes
                .filter(stripe => (stripe.startCoord === ($scope.left + $scope.right)
                        || stripe.endCoord === ($scope.left + $scope.right)))[0] ? ($scope.left + $scope.right) : ($scope.left + $scope.right) - 1;
    };

    $scope.leftTrivialHop = () => {

        let leftmostCoord = $scope.leftmostStripeCoord();
        let leftmostStripe = $scope.stripes
                .filter(stripe => (stripe.startCoord === leftmostCoord || stripe.endCoord === leftmostCoord))[0];
        let newBearingPoint = GenomicCoordinate
                .parseCoordinate(leftmostStripe.properties[(leftmostStripe.startCoord === leftmostCoord) ? 'startCoord' : 'endCoord']);

        /**
         * TODO: somehow detect the leftmost band to prevent future hops
         */
        $scope.striper.hopTo(newBearingPoint, 1, $scope.left + $scope.right - 1);
        $scope.revealStripes();
    };

    $scope.rightTrivialHop = () => {

        let rightmostCoord = $scope.rightmostStripeCoord();
        let rightmostStripe = $scope.stripes
                .filter(stripe => (stripe.startCoord === rightmostCoord
                        || stripe.endCoord === rightmostCoord))[0];
        let newBearingPoint = GenomicCoordinate
                .parseCoordinate(rightmostStripe.properties[(rightmostStripe.startCoord === rightmostCoord) ? 'startCoord' : 'endCoord']);

        /**
         * TODO: somehow detect the rightmost band to prevent future hops
         */
        $scope.striper.hopTo(newBearingPoint, $scope.left + $scope.right - 1, 1);
        $scope.revealStripes();
    };
}]);