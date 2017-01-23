class ReferenceGenomeService {

    constructor(Genetics) {

        /**
         * TODO: handle promise (see Genetics)
         */
        this._dataSourceTypes = Genetics.dataSourceTypes;
        this._retrieveReferenceGenomes = (successCallback, errorCallback) => Genetics.referenceGenomes.then(
            referenceGenomesResource => successCallback(referenceGenomesResource['_embedded']
                    .referenceGenomes.map(referenceGenomeResource => referenceGenomeResource.id)),
            error => errorCallback(error)
        )
    }

    // TODO: see comment above
    get dataSourceTypes() { return this._dataSourceTypes }

    getReferenceGenomes(successCallback, errorCallback) {
        return this._retrieveReferenceGenomes(successCallback, errorCallback);
    }
}

angular.module('ghop-ui')
.factory('ReferenceGenomeService', ReferenceGenomeService);