class AttributeRange {

    /**
     * @this
     * @param {number} lowerBound 
     * @param {number} upperBound 
     * @param {string} inclusionType 
     * @param {Array} values 
     */
    constructor(lowerBound, upperBound, inclusionType, values) {

        this._lowerBound = lowerBound;
        this._upperBound = upperBound;
        this._inclusionType = inclusionType;
        this._values = values;
    }

    get lowerBound () { return this._lowerBound }
    set lowerBound (lowerBound) { this._lowerBound = lowerBound }
    get upperBound () { return this._upperBound }
    set upperBound (upperBound) { this._upperBound = upperBound }
    get inclusionType () { return this._inclusionType }
    set inclusionType (inclusionType) { this._inclusionType = inclusionType }
    get values () { return this._values }
    set values (values) { this._values = values }
}