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