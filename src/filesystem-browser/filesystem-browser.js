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
.directive('filesystemBrowser', function($log, FilesystemBrowserService) {
    return {
        restrict: 'E',
        scope: {
            ngModel: '=',
            collapsed: '=',
            initialPath: '<',
            maxHeight: '<'
        },
        controller: 'FilesystemBrowserController',
        templateUrl: 'src/filesystem-browser/filesystem-browser.template.html',
        link: (scope, element) => {

            if (scope.maxHeight) {
                element.children().css('max-height', `${scope.maxHeight}px`);
            }

            // Retrieve content for initial path
            FilesystemBrowserService.getContent(scope.initialPath)
                    .then(folder => scope.updateContent(folder));
        }
    }
});