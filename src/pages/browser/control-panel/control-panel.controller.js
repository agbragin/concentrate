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
.controller('ControlPanelController', ['$log', '$scope', '$rootScope', function($log, $scope, $rootScope) {

    $log.debug('Control panel component is running');

    $scope.panelCollapse = false;

    $scope.collapse = () => $scope.panelCollapse = !$scope.panelCollapse;
    $scope.collapseContent = () => $scope.panelCollapse ? 'hide' : 'show';
    $scope.collapseArrow = () => $scope.panelCollapse ?  'fa-angle-double-up' : ' fa-angle-double-down';
}]);