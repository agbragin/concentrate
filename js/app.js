angular.module('ghop-ui', [
    'ngResource'
]).config(['$resourceProvider', 'GeneticsProvider', ($resourceProvider, GeneticsProvider) => {

}]).run(['$log', 'ReferenceGenomeService', ($log, ReferenceGenomeService) => {

    $log.debug('gHop web-client application started');

    ReferenceGenomeService.getReferenceGenomes(
        referenceGenomes => $log.debug(`Reference genomes information successfully fetched; available references are: ${referenceGenomes}`),
        error => $log.error(error)
    );
}]);