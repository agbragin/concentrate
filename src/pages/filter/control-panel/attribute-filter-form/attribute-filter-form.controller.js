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
.controller('AttributeFilterFormController', ['$log', '$scope', function($log, $scope) {

    $log.debug(`${$scope.attribute.name} attribute filter form is running`);

    $scope.readyToBuild = () => $scope.filterOperator && $scope.values.length && ($scope.values[0] || $scope.values[0] === 0 || $scope.values[0] === false);
    $scope.buildAttributeFilter = () => $scope.builtAttributeFilter = new AttributeFilter($scope.attribute, $scope.filterOperator, $scope.values, $scope.includeNulls);
    $scope.destroyAttributeFilter = () => $scope.builtAttributeFilter = undefined;
}]);