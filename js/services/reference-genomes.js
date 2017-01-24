class ReferenceGenomeService {

    constructor($log, Genetics, Contigs) {

        let referenceGenomesPromise = Genetics.referenceGenomes;
        // Holds a mapping from reference genomes to their contigs lists
        this._contigs = new Map();
        referenceGenomesPromise.then(
            referenceGenomesResource => referenceGenomesResource['_embedded']
                    .referenceGenomes.map(referenceGenomeResource => referenceGenomeResource.id)
                    .forEach(id => this._contigs.set(id, Contigs.get({ id: id }).$promise)),
            error => $log.error(error)
        );

        this._retrieveReferenceGenomes = (successCallback, errorCallback) => referenceGenomesPromise.then(
            referenceGenomesResource => successCallback(referenceGenomesResource['_embedded']
                    .referenceGenomes.map(referenceGenomeResource => referenceGenomeResource.id)),
            error => errorCallback(error)
        );
        this._retrieveReferenceGenomeContigs = (id, successCallback, errorCallback) => this._contigs.get(id).then(
            contigsResource => successCallback(contigsResource['contigs']),
            error => errorCallback(error)
        );

        /**
         * TODO: handle promise (see Genetics)
         */
        this._dataSourceTypes = Genetics.dataSourceTypes;
    }

    // TODO: see comment above
    get dataSourceTypes() { return this._dataSourceTypes }

    getReferenceGenomes(successCallback, errorCallback) {
        return this._retrieveReferenceGenomes(successCallback, errorCallback);
    }

    getContigs(id, successCallback, errorCallback) {
        return this._retrieveReferenceGenomeContigs(id, successCallback, errorCallback);
    }
}

angular.module('ghop-ui')
.factory('ReferenceGenomeService', ReferenceGenomeService);