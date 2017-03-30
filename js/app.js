angular.module('ghop-ui', [
    'ngResource',
    'ui.bootstrap',
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