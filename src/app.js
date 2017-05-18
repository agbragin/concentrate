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


angular.module('concentrate', ['ui.bootstrap.contextMenu', 'ui.router'])
.config(['$httpProvider', '$stateProvider', '$urlRouterProvider',
        function($httpProvider, $stateProvider, $urlRouterProvider) {

    let backEndApiUrl = '';

    $httpProvider.interceptors.push($q => {

        return {
            request: request => {

                if (request.url.search(/.css|.js|.html/gi) === -1) {
                    request.url = backEndApiUrl.concat(request.url);
                }

                return request || $q.when(request);
            }
        }
    });

    let pageTplsPath = 'src/pages';
    let tplPath = tplName => `${pageTplsPath}/${tplName}/${tplName}.html`;

    $stateProvider.state({
        name: 'browser',
        url: '/',
        controller: 'BrowserPageController',
        templateUrl: tplPath('browser'),
        resolve: {
            referenceServiceType: ['$rootScope', '$q', ($rootScope, $q) => {
                if (!$rootScope.referenceServiceType) {
                    return $q.reject('No reference service was selected');
                }
            }],
            referenceGenome: ['$rootScope', '$q', ($rootScope, $q) => {
                if (!$rootScope.activeReferenceGenome) {
                    return $q.reject('No reference genome was selected');
                }
            }]
        }
    });
    $stateProvider.state({
        name: 'config',
        url: '/config',
        controller: 'ConfigPageController',
        templateUrl: tplPath('config')
    });
    $stateProvider.state({
        name: 'errors',
        url: '/errors',
        controller: 'ErrorsPageController',
        templateUrl: tplPath('errors')
    });
    $stateProvider.state({
        name: 'filter',
        url: '/filter',
        controller: 'FilterPageController',
        templateUrl: tplPath('filter'),
        params: {
            track: {
                array: false
            }
        },
        resolve: {
            referenceServiceType: ['$rootScope', '$q', ($rootScope, $q) => {
                if (!$rootScope.referenceServiceType) {
                    return $q.reject('No reference service was selected');
                }
            }],
            referenceGenome: ['$rootScope', '$q', ($rootScope, $q) => {
                if (!$rootScope.activeReferenceGenome) {
                    return $q.reject('No reference genome was selected');
                }
            }]
        }
    });
    $stateProvider.state({
        name: 'upload',
        url: '/upload',
        controller: 'UploadPageController',
        templateUrl: tplPath('upload'),
        resolve: {
            referenceServiceType: ['$rootScope', '$q', ($rootScope, $q) => {
                if (!$rootScope.referenceServiceType) {
                    return $q.reject('No reference service was selected');
                }
            }],
            referenceGenome: ['$rootScope', '$q', ($rootScope, $q) => {
                if (!$rootScope.activeReferenceGenome) {
                    return $q.reject('No reference genome was selected');
                }
            }]
        }
    });

    $urlRouterProvider.otherwise('/');
}])
.run(['$log', '$rootScope', '$state', function($log, $rootScope, $state) {

    $log.debug('Parseq Lab Concentrate genome browser is running');

    $rootScope.$on('$stateChangeError', (e, to, toParams, from, fromParams, error) => {
        $log.warn(error);
        $state.go('config');
    });

    $rootScope.$on('$stateChangeSuccess', (e, to, toParams, from, fromParams) => {
        $rootScope.previousState = from;
        $rootScope.previousStateParams = fromParams;
    });
}]);