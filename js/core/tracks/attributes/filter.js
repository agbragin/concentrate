class AttributeFilter_ {

    /**
     * @this
     * @constructor
     * @param {TrackAttribute} attribute 
     * @param {string} operator 
     * @param {Array} values 
     * @param {boolean} includeNulls 
     */
    constructor(attribute, operator, values, includeNulls) {

        this._attribute = attribute;
        this._operator = operator;
        this._values = values;
        this._includeNulls = includeNulls;
    }

    get attribute () { return this._attribute }
    set attribute (attribute) { this._attribute = attribute }
    get operator () { return this._operator }
    set operator (operator) { this._operator = operator }
    get values () { return this._values }
    set values (values) { this._values = values }
    get includeNulls () { return this._includeNulls }
    set includeNulls (includeNulls) { this._includeNulls = includeNulls }
}