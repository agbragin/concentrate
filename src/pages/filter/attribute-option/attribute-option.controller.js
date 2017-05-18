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
.controller('AttributeOptionController', ['$log', '$scope', function($log, $scope) {

    $scope.attributeTypeClass = () => {
        switch ($scope.attribute.type) {
        case 'BOOLEAN':
            return 'bg-orange white';

        case 'FLOAT':
            return 'bg-blue white';

        case 'INTEGER':
            return 'bg-navy white';

        case 'SET':
            return 'bg-red white';

        case 'STRING':
            return 'bg-olive white';

        default:
            $log.warn(`Attribute of name: ${$scope.attribute.name} has unknown type: ${$scope.attribute.type}`);
            return 'bg-darken-2';
        }
    };

    $scope.activeAttributeClass = () => $scope.active ? 'bg-darken-1' : '';
}]);