/*******************************************************************************
 *     Copyright 2016-2017 the original author or authors.
 *     
 *     This file is part of CONC.
 *     
 *     CONC. is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *     
 *     CONC. is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *     GNU Affero General Public License for more details.
 *     
 *     You should have received a copy of the GNU Affero General Public License
 *******************************************************************************/


class AttributeAggregate {

    /**
     * @this
     * @constructor
     * @param filters {Array.<AttributeFilter>} Attribute filters to aggregate
     * @param aggregates {Array.<AttributeAggregate>} Attribute aggregates to aggregate
     * @param operator {string} Operator to aggregate specified filters and aggregates
     */
    constructor(filters, aggregates, operator) {

        this._id = attributeAggregateIdGenerator.next().value;

        this._filters = filters;
        this._aggregates = aggregates;
        this._operator = operator;
    }

    get id () { return this._id }
    get filters () { return this._filters }
    get aggregates () { return this._aggregates }
    get operator () { return this._operator }
    set operator (operator) { this._operator = operator }

    /**
     * Add filters to the list
     * 
     * @this
     * @param {Array.<AttributeFilter>} filters Filters to add
     */
    addFilters(...filters) {
        filters.forEach(it => this._filters.push(it));
    }

    /**
     * Add aggregates to the list
     * 
     * @this
     * @param {Array.<AttributeAggregate>} aggregates Aggregates to add
     */
    addAggregates(...aggregates) {
        aggregates.forEach(it => this._aggregates.push(it));
    }

    /**
     * Remove filter from the list if present
     * 
     * @this
     * @param {AttributeFilter} filter Filter to remove
     * @returns {AttributeFilter}
     */
    removeFilter(filter) {

        let filterIdx = this._filters.indexOf(filter);
        if (filterIdx === -1) {
            return null;
        } else {
            return this._filters.splice(filterIdx, 1)[0];
        }
    }

    /**
     * Remove aggregate from the list if present
     * 
     * @this
     * @param {AttributeAggregate} aggregate Aggregate to remove
     * @returns {AttributeAggregate}
     */
    removeAggregate(aggregate) {

        let aggregateIdx = this._aggregates.indexOf(aggregate);
        if (aggregateIdx === -1) {
            return null;
        } else {
            return this._aggregates.splice(aggregateIdx, 1)[0];
        }
    }

    /**
     * @static
     * @param operator {string} Aggregate operator
     */
    static empty(operator) {
        return new AttributeAggregate([], [], operator);
    }

    /**
     * @static
     * @param operator {string} Aggregate operator
     * @param filters {Array.<AttributeFilter>} Filters to aggregate
     */
    static of(operator, ...filters) {
        return new AttributeAggregate(filters, [], operator);
    }

    /**
     * @static
     * @returns {Generator}
     */
    static * getIdGenerator() {

        let id = 0;
        while (true) {
            yield id++;
        }
    }
}

let attributeAggregateIdGenerator = AttributeAggregate.getIdGenerator()