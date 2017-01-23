class GeneticsProvider {

    constructor() {}

    $get(ReferenceGenomes) {
        return {
            /**
             * TODO: change to actual types fetching when API would be ready
             */
            dataSourceTypes: [
                'BASIC_BED',
                'VARIANTS_BED'
            ],
            referenceGenomes: ReferenceGenomes.get({}).$promise
        }
    }
}

angular.module('ghop-ui')
.provider('Genetics', GeneticsProvider);