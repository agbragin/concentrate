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
 *     along with CONC. If not, see <http://www.gnu.org/licenses/>.
 *******************************************************************************/

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
