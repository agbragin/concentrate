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
.directive('attributeFilterQuery', function($timeout) {
    return {
        restrict: 'E',
        scope: {
            query: '=',
            parent: '=',
            origin: '=',
            builtAttributeFilter: '='
        },
        controller: 'AttributeFilterQueryController',
        templateUrl: 'src/pages/filter/query/query.template.html',
        link: scope => {

            let enableHoverEffects = () => {

                $timeout(() => {
                    $('.ctx-operator').hover(
                        function() {

                            $(this).addClass('hovered-opt');
                            $(this).parent().siblings('.filter-token').children('code.ctx-operator').addClass('hovered-opt');
                            $(this).parent().siblings('.aggregate-token').children('code.ctx-operator').addClass('hovered-opt');
                        },
                        function() {

                            $(this).removeClass('hovered-opt');
                            $(this).parent().siblings('.filter-token').children('code.ctx-operator').removeClass('hovered-opt');
                            $(this).parent().siblings('.aggregate-token').children('code.ctx-operator').removeClass('hovered-opt');
                        }
                    );
                });
            };

            enableHoverEffects();
            scope.$on('queryUpdate', () => enableHoverEffects());
        }
    }
});