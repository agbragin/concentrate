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

    $scope.leftTrivialHop = () => {
        // TODO: implement
    };

    $scope.rightTrivialHop = () => {
        // TODO: implement
    };
}]);