class GenomicCoordinate {

    /**
     * @constructor
     * @this {GenomicCoordinate}
     * @param {String} genome Reference genome name
     * @param {String} contig Contig identifier
     * @param {Number} coord Coordinate (1-based)
     */
    constructor(genome, contig, coord) {

        this._genome = genome;
        this._contig = contig;
        this._coord = coord;
    }

    /**
     * @static {GenomicCoordinate}
     * @param {Object} point Genomic coordinate JSON representation
     * @returns {GenomicCoordinate}
     */
    static parseCoordinate(point) {

        try {
            return new GenomicCoordinate(point.contig.referenceGenome.id, point.contig.id, point.coord);
        } catch (e) {
            throw new Error(e);
        }
    }

    get genome() { return this._genome }
    get contig() { return this._contig }
    get coord()  { return this._coord  }

    toString() {
        return `${this._genome}:${this._contig}:${this._coord}`;
    }
}
