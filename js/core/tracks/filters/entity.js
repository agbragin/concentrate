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

class TrackFilterEntity {

    /**
     * @this
     * @constructor
     * @param {AttributeAggregate} query
     */
    constructor(query) {

        this.filters = [];
        this.aggregates = [];

        this.aggregates.push(this._constructAggregate(query));
    }

    _constructAggregate (query) {

        let entities = [];
        if (query.filters && query.filters.length) {
            entities = query.filters.map(TrackFilterEntity.buildFilter);
            this.filters = this.filters.concat(entities);
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

    static buildFilter (filter) {
        return new AttributeFilterEntity(TrackFilterEntity.idGenerator.next().value, filter.attribute.id, filter.operator, filter.values, filter.includeNulls);
    }

    static buildAggregate (entities, operator) {
        return new AttributeAggregateEntity(TrackFilterEntity.idGenerator.next().value, entities.map(it => it.id), operator);
    }

    static idGenerator = TrackFilterEntity.id();

    static * id () {

        let id = 0;
        while (true) {
            yield id++;
        }
    }
}