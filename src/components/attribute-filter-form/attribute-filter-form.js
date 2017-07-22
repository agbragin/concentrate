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
.directive('attributeFilterForm', function() {
    return {
        restrict: 'E',
        scope: {
            attribute: '<',
            builtAttributeFilter: '='
        },
        controller: 'AttributeFilterFormController',
        templateUrl: 'src/components/attribute-filter-form/attribute-filter-form.template.html',
        link: scope => {

            scope.$watch('attribute', () => {

                scope.builtAttributeFilter = undefined;
                scope.filterOperator = scope.attribute.filterOperators[0];
                scope.includeNulls = false;

                switch (scope.attribute.type) {
                case 'BOOLEAN':
                    scope.values = [true];
                    break;

                case 'FLOAT':
                case 'INTEGER':
                case 'SET':
                case 'STRING':
                    scope.values = [];
                    break;

                default:
                    log.warn(`${scope.attribute.name} attribute has unknown type: ${scope.attribute.type}`);
                }
            });
        }
    }
});