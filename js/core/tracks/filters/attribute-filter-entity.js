class AttributeFilterEntity {

    /**
     * @this
     * @constructor
     * @param {number} id
     * @param {number} attribute
     * @param {string} operator
     * @param {Array<String>} values
     * @param {boolean} includeNulls
     */
    constructor(id, attribute, operator, values, includeNulls) {

        this.id = id;
        this.attribute = attribute;
        this.operator = operator;
        this.values = values;
        this.includeNulls = includeNulls;
    }
}