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
 *     along with CONC. If not, see <http://www.gnu.org/licenses/>.
 *******************************************************************************/

angular.module('ghop-ui', [
    'ngResource',
    'ngSanitize',
    'ui.bootstrap',
    'ui.bootstrap.contextMenu',
    'isteven-multi-select',
    'ui.sortable',
    'rzModule',
    'angular-clipboard'
]).config(['$httpProvider', ($httpProvider) => {

    let apiURI = '/solvent';
        
    $httpProvider.interceptors.push($q => {
        
        return {
            request: request => {

                if (request.url.indexOf('.css') === -1
                    && request.url.indexOf('.js') === -1
                    && request.url.indexOf('.html') === -1
                    && request.url.indexOf('template') === -1
                    && request.url.indexOf('isteven') === -1) {

                    request.url = apiURI + request.url;
                }

                return request || $q.when(request);
            }
        }
    });
}]).run(['$log', 'ReferenceGenomeService', ($log, ReferenceGenomeService) => {
    $log.debug('gHop web-client application started');
}]);