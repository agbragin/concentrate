angular.module('ghop-ui', [
    'ngResource'
]).config(['$resourceProvider', 'GeneticsProvider', ($resourceProvider, GeneticsProvider) => {

}]).run(['$log', 'ReferenceGenomeService', ($log, ReferenceGenomeService) => {

    $log.debug('gHop web-client application started');
}]);