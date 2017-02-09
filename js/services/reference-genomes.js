class ReferenceGenomeService {

    constructor($log, Genetics, Contigs, HateoasUtils) {

        let referenceGenomeIdsPromise = Genetics.referenceGenomes
                .then(resource => resource['_embedded'].referenceGenomes)
                .then(resources => resources.map(resource => resource.id));

        this._referenceGenomeIds = referenceGenomeIdsPromise;
        this._contigsMapping = referenceGenomeIdsPromise
                .then(ids => Promise.all(ids.map(id => Contigs.get({ id: id }).$promise
                        .then(resource => [HateoasUtils.getResourceId(resource), resource['contigs']]))))
                .then(mappings => mappings.reduce((map, mapping) => {
                    map[mapping[0]] = mapping[1];
                    return map;
                }, {}));

        /**
         * TODO: handle promise (see Genetics)
         */
        this._dataSourceTypes = Genetics.dataSourceTypes;
    }

    get referenceGenomeIds () { return this._referenceGenomeIds }
    get contigsMapping     () { return this._contigsMapping     }
    get dataSourceTypes    () { return this._dataSourceTypes    }
}

angular.module('ghop-ui')
.factory('ReferenceGenomeService', ($log, Genetics, Contigs, HateoasUtils) => new ReferenceGenomeService($log, Genetics, Contigs, HateoasUtils));