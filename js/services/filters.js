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

class AttributeFilter {

    /**
     * @constructor
     * @this {AttributeFilter}
     * @param {number} id Local filter's identifier to reference to
     * @param {number} attribute Attribute's identifier
     * @param {FilterOperator} operator Filter operator to apply
     * @param {String[]} values Attribute's values to filter by
     * @param {boolean} includeNulls Whether to ignore bands without specified attribute values 
     */
    constructor(id, attribute, operator, values, includeNulls = false) {

        this._id = id;
        this._attribute = attribute;
        this._operator = operator;
        this._values = values;
        this._includeNulls = includeNulls;
    }

    get id           () { return this._id           }
    get attribute    () { return this._attribute    }
    get operator     () { return this._operator     }
    get values       () { return this._values       }
    get includeNulls () { return this._includeNulls }
}

class AttributeFilterAggregate {

    /**
     * @constructor
     * @this {AttributeFilterAggregate}
     * @param {number} id Local filter's identifier to reference to
     * @param {AttributeFilter[]} attributeFilters Attribute filters to aggregate
     * @param {AggregateOperator} operator Operator to aggregate filters
     */
    constructor(id, attributeFilters, operator) {

        this._id = id;
        this._attributeFilters = attributeFilters.map(filter => filter.id);
        this._operator = operator;
    }

    get id               () { return this._id               }
    get attributeFilters () { return this._attributeFilters }
    get operator         () { return this._operator         }
}

class TrackFilter {

    /**
     * @constructor
     * @this {TrackFilter}
     * @param {AttributeFilter[]} filters
     * @param {AttributeFilterAggregate[]} aggregates
     */
    constructor(filters, aggregates) {
        this._filters = filters;
        this._aggregates = aggregates;
    }

    get filters    () { return this._filters    }
    get aggregates () { return this._aggregates }
}

class FilterUtils {

    constructor() {
        this._attributeFilterId = FilterUtils.attributeFilterIdGenerator();
    }

    static * attributeFilterIdGenerator () {
        for (let id = 0; ; ) {
            yield id++;
        }
    }

    /**
     * @this {FilterUtils}
     * @param {number} attribute Attribute's identifier
     * @param {FilterOperator} operator Filter operator to apply
     * @param {String[]} values Attribute's values to filter by
     * @param {boolean} includeNulls Whether to ignore bands without specified attribute values 
     */
    newAttributeFilter(attribute, operator, values, includeNulls) {
        return new AttributeFilter(this._attributeFilterId.next().value,
                attribute, operator, values, includeNulls);
    }

    /**
     * @this {FilterUtils}
     * @param {AttributeFilter[]} attributeFilters Attribute filters to aggregate
     * @param {AggregateOperator} operator Operator to aggregate filters
     */
    newAttributeFilterAggregate(attributeFilters, operator) {
        return new AttributeFilterAggregate(this._attributeFilterId.next().value,
                attributeFilters, operator);
    }

    /**
     * @this {FilterUtils}
     * @param {AttributeFilter[]} filters
     * @param {AttributeFilterAggregate[]} aggregates
     */
    newTrackFilter(filters, aggregates) {
        return new TrackFilter(filters, aggregates);
    }
}

angular.module('ghop-ui')
.factory('FilterUtils', () => new FilterUtils());