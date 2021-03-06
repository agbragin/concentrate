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
.directive('browserCanvas', function() {
    return {
        restrict: 'E',
        controller: 'BrowserCanvasController',
        templateUrl: 'src/components/browser-canvas/browser-canvas.template.html',
        link: (scope, element, attrs, ctrl) => {

            // Init canvas after view creation
            scope.canvasInit();
            // Trigger bands update
            scope.bandsUpdate();

            scope.$on('updateFocusThenBands', scope.focusUpdateThenBands);
            scope.$on('updateBands', scope.bandsUpdate);

            scope.$on('resize::resize', e => {

                // Flush canvas previous state
                scope.canvasFlush();
                // Reinit canvas
                scope.canvasInit();
                // Trigger bands update
                scope.bandsUpdate();
            });

            scope.$watch('bands', scope.visualizationUpdate);

            let arrowNavHadler = e => {

                switch (e.keyCode) {
                    case 37:
                        scope.leftTrivialJump();
                        break;

                    case 39:
                        scope.rightTrivialJump();
                        break;

                    default:
                        return;
                }
            };

            let $doc = angular.element(document);
            $doc.on('keydown', arrowNavHadler);
            // Release resources on controller destroy event
            scope.$on('$destroy', () => {

                $doc.off('keydown', arrowNavHadler);

                scope.stage ? scope.stage.removeEventListener('stripeClick', scope.stripeClickHandler) : undefined;
                scope.stage ? createjs.Touch.disable(scope.stage) : undefined;
            });
        }
    }
});