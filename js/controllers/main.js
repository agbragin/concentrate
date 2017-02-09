angular.module('ghop-ui')
.controller('MainController', 
    ['$scope', '$log', '$uibModal', '$exceptionHandler', 'AsyncService', 'TrackService', 'DataSourceService', 
        'Genetics', 'HateoasUtils', 'ReferenceGenomeService', 'StriperFactory', 
        'CanvasSettings', 'CanvasValues', 'TrackDataSource', 'TrackAttributes', 'DrawerFactory', 
        'TrackUtils', 'RelationsService', 'TrackFilters',
    ($scope, $log, $uibModal, $exceptionHandler, AsyncService, TrackService, DataSourceService, 
        Genetics, HateoasUtils, ReferenceGenomeService, StriperFactory, 
        CanvasSettings, CanvasValues, TrackDataSource, TrackAttributes, DrawerFactory, 
        TrackUtils, RelationsService, TrackFilters) => {

    $log.debug('Application main controller running');

    $scope.dataSourceTypes = Genetics.dataSourceTypes;

    let calcUnitCountPerLayer = () => {
                
        let calcedCount = Math.round((window.innerWidth - CanvasSettings.CANVAS_MARGIN) / CanvasSettings.UNIT_WIDTH) - 1;
        return calcedCount + 1;
    }

    let initCanvas = () => {
        
        let canvasElement = angular.element('canvas');
        canvas = canvasElement[0];
        canvas.width = canvasElement.width();
        canvas.height = canvasElement.height();
        stage = new createjs.Stage(canvas);
        // enable touch interactions if supported on the current device:
        createjs.Touch.enable(stage);
        stage.enableMouseOver(50);

        $(window).resize(() => {
            $scope.$apply(() => {
                canvasElement.width(window.innerWidth);
                canvas.width = canvasElement.width();
                $scope.createStriper();
            });
        });

        let handler = e => {
            if (e.keyCode === 39) {
                striper.leftTrivialHop();
                revealStripes();
            }
            if (e.keyCode === 37) {
                striper.rightTrivialHop();
                revealStripes();
            }
        };

        let $doc = angular.element(document);
        $doc.on('keydown', handler);
        $scope.$on('$destroy',function(){
            $doc.off('keydown', handler);
        });
    }

    $scope.navOpen = false;
    $scope.coord = 0;
    CanvasValues.maxUnitCountPerLayer = calcUnitCountPerLayer();
    
    let genomicCoordinate,
        canvasElement,
        canvas,
        stage,
        striper,
        left = 0,
        right = calcUnitCountPerLayer();

    initCanvas();

    $scope.relationService = RelationsService.newInstance('#tracks_tree', '#tracks_images', 'track');    

    $scope.sortableOptions = {
        stop: function(e, ui) {
            $scope.relationService.updateRelations($scope.selectedTracks);
            $scope.createStriper();
        },
        axis: 'y'
    };

    $scope.toggleNav = () => {
        $scope.navOpen = !$scope.navOpen;
    };

    $scope.onSelectTracks = () => {

        $scope.relationService.relations = [];
        $scope.selectedTracks.forEach(track => {
            $scope.relationService.addRelation(track.track, undefined, 'SINGLE', 0, [track]);
        });
        $scope.createStriper();
    };

    let layerChangeHandler = () => {

        $scope.selectedTracks.forEach(track => (track.style.height = CanvasSettings.LAYER_BASE_HEIGHT*track.sublayersCount));
        $scope.relationService.updateRelations($scope.selectedTracks);
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.tracks = [];
    $scope.selectedTracks = [];
    
    TrackService.findAll().then(
        tracksResource => {
            
            $scope.tracks = tracksResource['_embedded']['tracks'];
            $scope.tracks.forEach((track, index) => {
                track.style = {
                    height: CanvasSettings.LAYER_BASE_HEIGHT
                }
                track.sort = index;

                TrackDataSource.get({ id: track.track }).$promise.then(dataSource => {
                    track.dataSource = dataSource;
                });

                TrackAttributes.get({ id: track.track }).$promise.then(attributes => {
                    track.attributes = attributes['_embedded']['attributes'];
                    track.attributes.forEach(attr => {
                        attr.style = {
                            height: CanvasSettings.ATTRIBUTE_HEIGHT[attr.type]
                        };
                        attr.value = (attr.value === undefined ? CanvasSettings.ATTRIBUTE_VALUES[attr.type] : attr.value);
                        attr.filterOperator = attr.filterOperators[0];
                        attr.disabled = true;
                    });
                });
            });
        },
        error => $log.error(error)
    );

    $scope.positionInputDisabled = () => {
        return $scope.selectedTracks.length === 0;
    }

    /**
     * Retrieve available reference genomes data
     */
    AsyncService.asyncHandle(ReferenceGenomeService.referenceGenomeIds, ids => {
        $log.debug(`Reference genome ids successfully retrieved and saved into controller's model`);
        $scope.referenceGenomeIds = ids.sort();
        if ($scope.referenceGenomeIds.length) {
            $scope.genome = $scope.referenceGenomeIds[0];
        }
    });
    AsyncService.asyncHandle(ReferenceGenomeService.contigsMapping, mapping => {
        $log.debug(`Contigs mapping successfully retrieved and saved into controller's model`);
        $scope.contigsMapping = mapping;
        if ($scope.contigsMapping[$scope.genome].length) {
            $scope.contig = $scope.contigsMapping[$scope.genome][0];
            genomicCoordinate = new GenomicCoordinate($scope.genome, $scope.contig, $scope.coord);
        }
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

    let openObjectModal = (stripe, layer) => {
                
        let modalInstance = $uibModal.open({
            templateUrl: 'templates/modals/object-modal.html',
            controller: function ($scope, $uibModalInstance, stripe, layer) {
                $scope.object = stripe;
                $scope.layer = layer;

                $scope.cancel = () => $uibModalInstance.dismiss('cancel');
            },
            resolve: {
                stripe: () => {
                    return stripe;
                },
                layer: () => {
                    return layer;
                }
            }
        });

        modalInstance.result.then(response => {
            $log.info(response);
        }, response => {
            $log.warn(response);
        });
    };

    $scope.openFiltersModal = trackName => {

        let _track = $scope.tracks.find(el => el.track === trackName);
        if (_track === undefined) {
            return $exceptionHandler(`Cannot find track object with name "${trackName}"`);
        }

        let modalInstance = $uibModal.open({
            templateUrl: 'templates/modals/filters-modal.html',
            controller: 'AttributesModalController',
            resolve: {
                track: () => _track
            }
        });

        modalInstance.result.then(filter => {
            if (filter.filters.length > 0) {
                TrackFilters.save({
                    id: trackName
                }, angular.toJson(filter))
                    .$promise.then(dataSource => {

                    _track.dataSource = dataSource;
                    _track.aggregates = dataSource.aggregates;
                    $scope.createStriper();
                });
            } else {
                TrackDataSource.get({ id: trackName }).$promise.then(dataSource => {

                    _track.dataSource = dataSource;
                    _track.aggregates = [];
                    $scope.createStriper();
                });
            }
        }, response => {
            $log.warn(response);
        });
    };

    let draw = stripes => {

        CanvasValues.maxUnitCountPerLayer = calcUnitCountPerLayer();
        CanvasValues.maxStripeLength = 1;

        DrawerFactory.instance(
            stage, 
            canvas,
            $scope.selectedTracks,
            striper,
            openObjectModal,
            layerChangeHandler
        ).draw(stripes);
    }

    $scope.createStriper = () => {
        genomicCoordinate = new GenomicCoordinate($scope.genome, $scope.contig, $scope.coord);
        striper = StriperFactory.newStriperInstance(
            genomicCoordinate, left, right,
            $scope.tracks.filter(track => track.ticked).map(elem => elem.dataSource.id), 
            $scope.contigsMapping);
        
        revealStripes();
    };

    let revealStripes = () => {
        striper.stripes.then(
            stripes => {
                draw(stripes);
            },
            error => $log.error(error)
        );
    };
}]);