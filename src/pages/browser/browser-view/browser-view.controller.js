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


/**
 * Can't use fat arrow syntax in controller definition due to:
 * https://github.com/angular/angular.js/issues/14814
 */
angular.module('concentrate')
.controller('BrowserViewController', ['$rootScope', '$log', '$scope', '$http', 'Bander', 'Striper', 'VisualizationProperties',
        function($rootScope, $log, $scope, $http, Bander, Striper, VisualizationProperties) {

    $log.debug('Browser view component is running');

    $scope.focusSafeNullGet = () => $rootScope.focus ? $rootScope.focus : new VisualizationFocus(new GenomicCoordinate($rootScope.activeReferenceGenome.name, $rootScope.activeReferenceGenome.contigs[0], 0), 0, $scope.drawer.unitsNumber);
    $scope.focusSafeInfSet = stripe => $rootScope.focus = (stripe.start === -Infinity) ? $rootScope.focus : $rootScope.focus = new VisualizationFocus(stripe.properties.start, stripe.start, $scope.drawer.unitsNumber - stripe.start);

    let bandsUpdate = () => {

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

    $scope.canvasInit = () => {

        $log.debug('Performing canvas adjusting');

        let canvas = document.getElementById('browser-canvas');
        let canvasSize = [
            window.innerHeight - document.getElementById('top-panel').clientHeight,
            window.innerWidth
        ];

        [canvas.height, canvas.width] = canvasSize;

        $log.debug(`Canvas size set to: ${canvasSize[1]}x${canvasSize[0]}`);

        let stage = new createjs.Stage(canvas);
        $scope.drawer = new Drawer(stage, VisualizationProperties);
        $rootScope.unitsNumber = $scope.drawer.unitsNumber;

        /**
         * Add stripe click listener to receive active stripe data
         */
        stage.addEventListener('stripeClick', e => {

            /**
             * @type {Stripe}
             */
            let stripe = e.detail;

            $rootScope.activeStripe = stripe;
            // Update visualization focus
            $scope.focusSafeInfSet(stripe);

            // Explicitly run dirty-check as this event handler is out of Angular scope
            $scope.$apply();
        });
    };

    $scope.$on('updateBands', bandsUpdate);

    $scope.$watch('bands', () => {

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
            /**
             * @type {Grid}
             */
            $scope.grid = new Grid($scope.drawer.unitsNumber, $rootScope.availableTracks);
            $scope.grid.add(stripes);

            $scope.drawer.draw($scope.grid);
        }
    });

    /**
     * Keyboard navigation section
     */

     $scope.leftTrivialJump = () => {

        if (!$http.pendingRequests.length && $scope.grid && (!$rootScope.leftmost || $scope.grid.containsMinusInf())) {

            let focus = $scope.grid.getFocusCandidate();
            $rootScope.focus = new VisualizationFocus(focus.genomicCoordinate, focus.bordersNumberToTheLeft + 1, focus.bordersNumberToTheRight - 1);

            bandsUpdate();
        }
    };

    $scope.rightTrivialJump = () => {

        if (!$http.pendingRequests.length && $scope.grid && (!$rootScope.rightmost || $scope.grid.containsPlusInf())) {

            let focus = $scope.grid.getFocusCandidate();
            $rootScope.focus = new VisualizationFocus(focus.genomicCoordinate, focus.bordersNumberToTheLeft - 1, focus.bordersNumberToTheRight + 1);

            bandsUpdate();
        }
    };

    let arrowNavHadler = e => {

        switch (e.keyCode) {
            case 37:
                $scope.leftTrivialJump();
                break;

            case 39:
                $scope.rightTrivialJump();
                break;

            default:
                return;
        }
    };

    let $doc = angular.element(document);
    $doc.on('keydown', arrowNavHadler);
    // Release resources on controller destroy event
    $scope.$on('$destroy', () => $doc.off('keydown', arrowNavHadler));
}]);