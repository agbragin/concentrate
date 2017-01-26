angular.module('ghop-ui', [
    'ngResource',
    'ui.bootstrap'
]).config(['$resourceProvider', 'GeneticsProvider', ($resourceProvider, GeneticsProvider) => {

}]).run(['$log', 'ReferenceGenomeService', ($log, ReferenceGenomeService) => {

    $log.debug('gHop web-client application started');
}]);