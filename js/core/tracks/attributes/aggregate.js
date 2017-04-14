class AttributeAggregate {

    /**
     * @this
     * @constructor
     * @param {Array} filters
     * @param {Array} aggregates
     * @param {string} operator
     */
    constructor(filters, aggregates, operator) {

        this._id = AttributeAggregate.idGenerator.next().value;

        this._filters = filters;
        this._aggregates = aggregates;
        this._operator = operator;
    }

    get id () { return this._id }
    set id (id) { this._id = id }
    get filters () { return this._filters }
    set filters (filters) { this._filters = filters }
    get aggregates () { return this._aggregates }
    set aggregates (aggregates) { this._aggregates = aggregates }
    get operator () { return this._operator }
    set operator (operator) { this._operator = operator }

    addFilter (filter) {
        this._filters.push(filter);
    }

    addAggregate (aggregate) {
        this._aggregates.push(aggregate);
    }

    /**
     * @static
     * @param {string} operator 
     */
    static empty (operator) {
        return new AttributeAggregate([], [], operator);
    }

    /**
     * @static
     * @param {AttributeFilter_} filter 
     */
    static build (filter, operator) {
        return new AttributeAggregate(Array.of(filter), [], operator);
    }

    static idGenerator = AttributeAggregate.genId();

    static * genId () {

        let id = 0;
        while (true) {
            yield id++;
        }
    }
}
