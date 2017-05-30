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
.controller('JumpToFormController', ['$scope', '$rootScope',
        function($scope, $rootScope) {

    $scope.$watch('focus', () => {
        if ($rootScope.focus && $rootScope.focus.genomicCoordinate) {
            $scope.focusContigName = $rootScope.focus.genomicCoordinate.contigName;
            $scope.focusCoordinate = $rootScope.focus.genomicCoordinate.coordinate;
        }
    });

    $scope.jumpTo = () => {

        let bordersNumberToTheLeft = Math.floor($rootScope.unitsNumber / 2);
        let bordersNumberToTheRight = $rootScope.unitsNumber - bordersNumberToTheLeft;
        $rootScope.focus = new VisualizationFocus(new GenomicCoordinate($rootScope.activeReferenceGenome.name, $scope.focusContigName, $scope.focusCoordinate), bordersNumberToTheLeft, bordersNumberToTheRight);

        $scope.$emit('updateBands');
    };

    if (!$scope.focusContigName) {
        $rootScope.activeReferenceGenome.contigs[0];
        $scope.focusCoordinate = 0;
    }
}]);