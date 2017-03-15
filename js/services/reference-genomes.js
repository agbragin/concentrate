class ReferenceGenomeService {

    constructor($log, DataSourceTypes, ReferenceGenomes, Contigs, HateoasUtils) {

        this._referenceGenomes = ReferenceGenomes.get;
        this._contigsResource = Contigs;
        this._hateoasUtils = HateoasUtils;
        this._dataSourceTypes = DataSourceTypes.get;
    }

    get referenceGenomeIds() { 
        return this._referenceGenomes().$promise
                    .then(genomes => genomes['_embedded'].referenceGenomes.map(genome => genome.id)); 
    }

    get contigsMapping () {
       return  this.referenceGenomeIds.then(ids => Promise.all(ids.map(id => this._contigsResource.get({ id: id }).$promise
                            .then(resource => [this._hateoasUtils.getResourceId(resource), resource['contigs']]))))
                    .then(mappings => mappings.reduce((map, mapping) => {
                        map[mapping[0]] = mapping[1];
                        return map;
                    }, {}));
    }

    get dataSourceTypes    () { return this._dataSourceTypes().$promise }
}

angular.module('ghop-ui')
.factory('ReferenceGenomeService', ($log, DataSourceTypes, ReferenceGenomes, Contigs, HateoasUtils) =>
        new ReferenceGenomeService($log, DataSourceTypes, ReferenceGenomes, Contigs, HateoasUtils));
