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


class TrackFilterEntity {

    /**
     * @this
     * @constructor
     * @param {AttributeAggregate} query Track filter query
     */
    constructor(query) {

        /**
         * Holds filter entities list
         * 
         * @type {Array.<AttributeFilterEntity>}
         */
        this.filters = new Array();
        /**
         * Holds aggregate entities list
         * 
         * @type {Array.<AttributeAggregateEntity>}
         */
        this.aggregates = new Array();

        this.aggregates.push(this._constructAggregate(query));
    }

    /**
     * Construct an aggregate entity based on query specified in a recursive way
     * 
     * @this
     * @param {AttributeAggregate} query
     * @returns {AttributeAggregateEntity}
     */
    _constructAggregate(query) {

        /**
         * Holds entities for top-level aggregation
         * 
         * @type {Array.<Object>}
         */
        let entities = new Array();

        if (query.filters && query.filters.length) {

            entities.push(...query.filters.map(TrackFilterEntity.buildFilter));
            this.filters.push(...entities);
        }

        if (query.aggregates && query.aggregates.length) {

            for (let i = 0; i < query.aggregates.length; ++i) {

                let aggregateEntity = this._constructAggregate(query.aggregates[i]);

                this.aggregates.push(aggregateEntity);
                entities.push(aggregateEntity);
            }
        }

        return TrackFilterEntity.buildAggregate(entities, query.operator);
    }

    /**
     * Build a filter entity
     * 
     * @static
     * @param {AttributeFilter} filter Filter to build entity for
     * @returns {AttributeFilterEntity}
     */
    static buildFilter(filter) {
        return new AttributeFilterEntity(entityIdGenerator.next().value, filter.attribute.id, filter.operator, filter.values, filter.includeNulls);
    }

    /**
     * Build an aggregate entity
     * 
     * @static
     * @param {Array.<Object>} entities Entities to aggregate (could be both filter and aggregate entities)
     * @param {string} operator Aggregate operator
     * @returns {AttributeAggregateEntity}
     */
    static buildAggregate(entities, operator) {
        return new AttributeAggregateEntity(entityIdGenerator.next().value, entities.map(it => it.id), operator);
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

let entityIdGenerator = TrackFilterEntity.getIdGenerator()