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


let browserPage = new ApplicationPage('browser', '/');
let browserViewPage = new ApplicationPage('browserView', 'view', browserPage);
let configPage = new ApplicationPage('config', '/config');
let errorsPage = new ApplicationPage('errors', '/errors');
let trackFilterPage = new ApplicationPage('trackFilter', 'trackFilter', browserPage, Array.of(new ApplicationPageParameter('track', false)));
let trackUploadPage = new ApplicationPage('trackUpload', 'trackUpload', browserPage);
// Application pages
const pages = Array.of(browserPage, browserViewPage, configPage, errorsPage, trackFilterPage, trackUploadPage);
// Application states
const states = new Map();
pages.forEach(it => states.set(it.name, it.state));


angular.module('concentrate', ['ui.bootstrap.contextMenu', 'ui.router'])
.config(['$httpProvider', '$stateProvider', '$transitionsProvider', '$urlRouterProvider',
        function($httpProvider, $stateProvider, $transitionsProvider, $urlRouterProvider) {

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

    // Configure page routing
    pages.map(RouterStateFactory.state).forEach($stateProvider.state);
    $urlRouterProvider.otherwise('/');
    // Configure transitions to browser page
    let transitionToBrowserPageHookMatchCriteria = {
        to: `${browserPage.name}.**`
    };
    $transitionsProvider.onBefore(transitionToBrowserPageHookMatchCriteria, transition => {

        let logger = transition.injector().get('$log');

        let referenceServiceType = transition.injector().get('$rootScope')['referenceServiceType'];
        if (!referenceServiceType) {

            logger.warn('No reference service was selected yet: redirecting to the configuration page');

            return transition.router.stateService.target(configPage.toString());
        }

        let referenceGenome = transition.injector().get('$rootScope')['activeReferenceGenome'];
        if (!referenceGenome) {

            logger.warn('No reference genome was selected yet: rediracting to the configuration page');

            return transition.router.stateService.target(configPage.toString());
        }
    });
    // Configure previous state information saving
    $transitionsProvider.onStart({}, transition => {

        let rootScope = transition.injector().get('$rootScope');

        rootScope.previousState = transition.router.stateService.current;
    });
}])
.run(['$log', '$rootScope', '$state',
        function($log, $rootScope, $state) {

    $log.debug('Parseq Lab Concentrate genome browser is running');

    $rootScope.applicationPages = pages;
    $rootScope.applicationStates = states;
}]);