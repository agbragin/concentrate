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
.config(['$httpProvider', '$stateProvider', '$transitionsProvider', '$urlRouterProvider', 'RoutingConfig',
        function($httpProvider, $stateProvider, $transitionsProvider, $urlRouterProvider, RoutingConfig) {

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

    // Configure view routing
    views.map(RouterStateFactory.state).forEach($stateProvider.state);
    $urlRouterProvider.otherwise(RoutingConfig.views.get('browser').url);
    // Configure safe transitions to main view
    let transitionToMainViewHookMatchCriteria = {
        to: `${RoutingConfig.views.get('main').name}.**`
    };
    $transitionsProvider.onBefore(transitionToMainViewHookMatchCriteria, transition => {

        let logger = transition.injector().get('$log');

        let referenceServiceType = transition.injector().get('$rootScope')['referenceServiceType'];
        if (!referenceServiceType) {

            logger.warn('No reference service was selected yet: redirecting to the configuration page');

            return transition.router.stateService.target(RoutingConfig.states.get('config'));
        }

        let referenceGenome = transition.injector().get('$rootScope')['activeReferenceGenome'];
        if (!referenceGenome) {

            logger.warn('No reference genome was selected yet: rediracting to the configuration page');

            return transition.router.stateService.target(RoutingConfig.states.get('config'));
        }
    });
    // Configure transitions to upload view
    let transitionToUploadViewHookMatchCriteria = {
        to: RoutingConfig.states.get('upload')
    };
    $transitionsProvider.onStart(transitionToUploadViewHookMatchCriteria, transition => {

        let logger = transition.injector().get('$log');

        let availableDataSourceTypes = transition.injector().get('$rootScope')['availableDataSourceTypes'];
        if (!availableDataSourceTypes) {

            logger.debug('No data source types data found: initializing it');

            availableDataSourceTypes = new Array();
        }

        transition.injector().get('DataSourceTypeService').discoverTypes();
    });
    // Configure previous state information saving
    $transitionsProvider.onStart({}, transition => {

        let rootScope = transition.injector().get('$rootScope');

        rootScope.previousState = transition.router.stateService.current;
    });
}])
.run(['$log', function($log) {
    $log.debug('Parseq Lab Concentrate genome browser is running');
}]);