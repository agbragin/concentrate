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
 *******************************************************************************/


angular.module('concentrate')
.controller('BrowserCanvasController', ['$rootScope', '$log', '$scope', '$http', 'Bander', 'Striper', 'VisualizationProperties',
        function($rootScope, $log, $scope, $http, Bander, Striper, VisualizationProperties) {

    $scope.stripeClickHandler = e => {

        /**
         * @type {Stripe}
         */
        let stripe = e.detail;

        $rootScope.activeStripe = stripe;
        // Update visualization focus
        $scope.focusSafeInfSet(stripe);

        // Explicitly run dirty-check as this event handler is out of Angular scope
        $scope.$apply();
    };

    $scope.canvasSizeAdjust = () => {

        $log.debug('Performing canvas adjusting');

        let canvas = document.getElementById('browser-canvas');
        let canvasSize = [
            window.innerHeight - document.getElementById('top-panel').clientHeight,
            window.innerWidth
        ];

        [canvas.height, canvas.width] = canvasSize;

        $log.debug(`Canvas size set to: ${canvasSize[1]}x${canvasSize[0]}`);

        return canvas;
    };

    $scope.canvasInit = () => {

        let canvas = $scope.canvasSizeAdjust();
        /**
         * CreateJS library central object to work with
         * 
         * @type {createjs.Stage}
         */
        let stage = $scope.stage ? $scope.stage : new createjs.Stage(canvas);
        $scope.stage = stage;
        createjs.Touch.enable($scope.stage);
        /**
         * Browser application visualization central object to work with
         * 
         * @type {Drawer}
         */
        $scope.drawer = new Drawer(stage, VisualizationProperties);

        $rootScope.unitsNumber = $scope.drawer.unitsNumber;
        $scope.focusSafeNullUpdate();

        $log.debug(`Drawer instantiated for units number: ${$rootScope.unitsNumber}`);

        /*
         * Add stripe click listener to receive active stripe data
         */
        $scope.stage.addEventListener('stripeClick', $scope.stripeClickHandler);

        /*
         * Add mouse navigation
         */

        /**
         * Coordinate of the initial stage mouse press (x coordinate)
         * 
         * @type {number}
         */
        let dragStartX = undefined;
        /**
         * Accumulated drag offset from initial stage mouse press
         * 
         * @type {number}
         */
        let dragOffset = undefined;

        // Drag initialization handler
        $scope.stage.on('stagemousedown', e => {

            // Set initial press coordinate
            dragStartX = e.stageX;
            // Set offset to its initial value
            dragOffset = 0;
        });

        // Drag handler
        $scope.stage.on('stagemousemove', e => {

            if (!dragStartX) {
                // Ignore event while user does not hold the mouse pressed
                return;
            }

            // Update offset value
            dragOffset = e.stageX - dragStartX;

            let unitsOffset = Math.floor(Math.abs(dragOffset) / VisualizationProperties.UNIT_WIDTH);
            if (unitsOffset) {

                // Move for new bands when drag offset exceeds unit's width
                (Math.sign(dragOffset) < 0) ? $scope.rightTrivialJump(unitsOffset) : $scope.leftTrivialJump(unitsOffset);
                // Reset press coordinate
                dragStartX = e.stageX;
            }
        });

        // Drag release handler
        $scope.stage.on('stagemouseup', e => {
            // Unset press coordinate
            dragStartX = undefined;
        });
    };

    $scope.canvasFlush = () => {

        $log.debug('Flush canvas triggered');

        $scope.stage ? $scope.stage.clear() : undefined;
    };

    $scope.focusSafeNullGet = () => $rootScope.focus ? $rootScope.focus : new VisualizationFocus(new GenomicCoordinate($rootScope.activeReferenceGenome.name, $rootScope.activeReferenceGenome.contigs[0].id, 0), 0, $scope.drawer.unitsNumber);
    $scope.focusSafeNullUpdate = offset => {

        $rootScope.focus = $scope.focusSafeNullGet();

        let bordersNumberToTheLeft, bordersNumberToTheRight;
        if (offset) {

            bordersNumberToTheLeft = $rootScope.focus.bordersNumberToTheLeft + offset;
            bordersNumberToTheRight = $rootScope.focus.bordersNumberToTheRight - offset;
        } else {

            bordersNumberToTheLeft = Math.floor($rootScope.unitsNumber / 2);
            bordersNumberToTheRight = $rootScope.unitsNumber - bordersNumberToTheLeft;
        }

        $rootScope.focus = new VisualizationFocus($rootScope.focus.genomicCoordinate, bordersNumberToTheLeft, bordersNumberToTheRight);
    };
    $scope.focusSafeInfSet = stripe => $rootScope.focus = (stripe.start === -Infinity) ? $rootScope.focus : $rootScope.focus = new VisualizationFocus(stripe.properties.start, stripe.start, $scope.drawer.unitsNumber - stripe.start);

    $scope.focusUpdateThenBands = () => {

        $log.debug('Visualization focus update triggered');

        /**
         * List of disabled tracks
         * 
         * @type {Array.<Track>}
         */
        let disabledTracks = $rootScope.availableTracks.filter(it => !it.active);
        if ($rootScope.availableTracks.length === disabledTracks.length) {
            $rootScope.focus = undefined;
        } else {

            /**
             * If there is no focus candidate (no stripes left) just "jump" to the last focus
             * 
             * @type {VisualizationFocus}
             */
            let focusCandidate = $scope.grid.getFocusCandidate();
            if (focusCandidate) {

                $rootScope.focus = focusCandidate;
                if (!(Number.isFinite($rootScope.focus.bordersNumberToTheLeft) && Number.isFinite($rootScope.focus.bordersNumberToTheRight))) {
                    $rootScope.focus = new VisualizationFocus($rootScope.focus.genomicCoordinate, 0, $scope.drawer.unitsNumber);
                }
            } else {
                $scope.focusSafeNullUpdate();
            }
        }

        $scope.bandsUpdate();
    }

    $scope.bandsUpdate = () => {

        if (!$rootScope.availableTracks) {
            return;
        }

        $log.debug('Bands update triggered');

        let activeTracks = $rootScope.availableTracks.filter(it => it.active);
        if (activeTracks.length) {

            $log.debug(`Band collection update triggered for active tracks: ${activeTracks.map(it => it.name)}`);

            $rootScope.focus = $scope.focusSafeNullGet();
            $rootScope.activeStripe = undefined;

            Bander.discoverBands($rootScope.focus, activeTracks.map(it => it.activeDataSource.id));
        } else {
            $log.debug(`Band collection flush triggered`);
            $rootScope.bands = new Array();
        }
    };

    $scope.visualizationUpdate = () => {

        $log.debug('Visualization update triggered');

        if (!$rootScope.bands) {
            return;
        }

        if (!$rootScope.bands.length) {
            $log.debug('No bands found: flush the view');
            $scope.drawer.flush();
        } else {

            $rootScope.focus = $scope.focusSafeNullGet();

            /**
             * @type {Array.<Stripe>}
             */
            let stripes = Striper.stripe(
                $rootScope.bands,
                $rootScope.focus,
                $rootScope.genomicCoordinateComparator);
            $scope.grid = new Grid($scope.drawer.unitsNumber, $rootScope.availableTracks);
            $scope.grid.add(stripes.sort(Striper.stripeComparator($rootScope.genomicCoordinateComparator)));

            if (!$scope.grid.isFull()) {

                if ($rootScope.leftmost && $rootScope.rightmost) {
                    $log.debug('No more bands - all bands are present on the screen');
                } else if (!$rootScope.leftmost && $rootScope.rightmost) {

                    $log.debug('Rightmost bands reached');

                    let retrievedBorderCoordinates = $scope.grid.getBorderCoordinates();
                    let correctedBordersNumberToTheRight = retrievedBorderCoordinates.length - 1;
                    let correctedBordersNumberToTheLeft = $scope.grid.capacity - correctedBordersNumberToTheRight;

                    $rootScope.focus = new VisualizationFocus(retrievedBorderCoordinates[0], correctedBordersNumberToTheLeft, correctedBordersNumberToTheRight);
                    $scope.bandsUpdate();

                    return;
                } else if (!$rootScope.rightmost && $rootScope.leftmost) {

                    $log.debug('Leftmost bands reached');

                    let retrievedBorderCoordinates = $scope.grid.getBorderCoordinates();
                    let correctedBordersNumberToTheLeft = retrievedBorderCoordinates.length - 1;
                    let correctedBordersNumberToTheRight = $scope.grid.capacity - correctedBordersNumberToTheLeft;

                    $rootScope.focus = new VisualizationFocus(retrievedBorderCoordinates[retrievedBorderCoordinates.length - 1], correctedBordersNumberToTheLeft, correctedBordersNumberToTheRight);
                    $scope.bandsUpdate();

                    return;
                } else {
                    $log.error('Grid is not full, but there are more bands to the left and to the right of focus');
                }
            }

            $scope.drawer.draw($scope.grid);
        }
    };

    /*
     * Keyboard navigation section
     */

     $scope.leftTrivialJump = (units = 1) => {

        if (!$http.pendingRequests.length && $scope.grid && (!$rootScope.leftmost || $scope.grid.containsMinusInf())) {

            let focus = $scope.grid.getFocusCandidate();
            // Sanitize the units number
            units = (focus.bordersNumberToTheRight - units < 0) ? focus.bordersNumberToTheRight : units;

            $rootScope.focus = new VisualizationFocus(focus.genomicCoordinate, focus.bordersNumberToTheLeft + units, focus.bordersNumberToTheRight - units);

            $scope.bandsUpdate();
        }
    };

    $scope.rightTrivialJump = (units = 1) => {

        if (!$http.pendingRequests.length && $scope.grid && (!$rootScope.rightmost || $scope.grid.containsPlusInf())) {

            let focus = $scope.grid.getFocusCandidate();
            // Sanitize the units number
            units = (focus.bordersNumberToTheLeft - units < 0) ? focus.bordersNumberToTheLeft : units;

            $rootScope.focus = new VisualizationFocus(focus.genomicCoordinate, focus.bordersNumberToTheLeft - units, focus.bordersNumberToTheRight + units);

            $scope.bandsUpdate();
        }
    };
}]);