class AttributeAggregateEntity {

    /**
     * @this
     * @constructor
     * @param {number} id 
     * @param {Array<Number>} filters 
     * @param {string} operator 
     */
    constructor(id, filters, operator) {

        this.id = id;
        this.filters = filters;
        this.operator = operator;
    }
}