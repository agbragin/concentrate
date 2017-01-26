class UnknownReferenceGenomeException {

    constructor(referenceGenome) {
        this._referenceGenome = referenceGenome;
    }

    get referenceGenome () { return this._referenceGenome }

    static name() { return 'UnknownReferenceGenomeException' }
}

class UnknownContigException extends UnknownReferenceGenomeException {

    constructor(referenceGenome, contig) {
        super(referenceGenome);
        this._contig = contig;
    }

    get contig          () { return this._contig          }

    static name() { return 'UnknownContigException' }
}

class GenomicCoordinateComparator {

    constructor(logger, contigsMapping) {

        this._logger = logger;
        this._contigsMapping = contigsMapping;

        this._logger.debug('Genomic coordinate comparator successfully instantiated');
    }

    /**
     * @this {GenomicCoordinateComparator}
     * @param {GenomicCoordinate} o1
     * @param {GenomicCoordinate} o2
     */
    compare(o1, o2) {

        if (!this._contigsMapping[o1.genome]) {
            throw new UnknownReferenceGenomeException(o1.genome);
        }
        if (!this._contigsMapping[o2.genome]) {
            throw new UnknownReferenceGenomeException(o2.genome);
        }

        let genomesComparisonResult = o1.genome.localeCompare(o2.genome);
        if (genomesComparisonResult !== 0) {
            return genomesComparisonResult;
        }

        let o1ContigIdx = this._contigsMapping[o1.genome].indexOf(o1.contig);
        if (o1ContigIdx === -1) {
            throw new UnknownContigException(o1.genome, o1.contig);
        }
        let o2ContigIdx = this._contigsMapping[o1.genome].indexOf(o2.contig);
        if (o2ContigIdx === -1) {
            throw new UnknownContigException(o2.genome, o2.contig);
        }

        if (o1ContigIdx !== o2ContigIdx) {
            return (o1ContigIdx < o2ContigIdx) ? -1 : 1;
        }

        return (o1.coord === o2.coord) ? 0 : ((o1.coord < o2.coord) ? -1 : 1);
    }
}

class GenomicCoordinateComparatorFactory {

    constructor(logger) {
        this._logger = logger;
    }

    newGenomicCoordinateComparatorInstance(contigsMapping) {
        return new GenomicCoordinateComparator(this._logger, contigsMapping);
    }
}

angular.module('ghop-ui')
.factory('GenomicCoordinateComparatorFactory', $log => new GenomicCoordinateComparatorFactory($log));