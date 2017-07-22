class Contig {

    /**
     * @this
     * @constructor
     * @param {string} id
     * @param {number} length
     * @param {ReferenceGenome} referenceGenome
     */
    constructor(id, length, referenceGenome) {

        this._id = id;
        this._length = length;
        this._referenceGenome = referenceGenome;
    }

    get id () { return this._id }
    get length () { return this._length }
    get referenceGenome () { return this._referenceGenome }

    toString() {
        return `${this._referenceGenome.name}:${this._id}`;
    }
}