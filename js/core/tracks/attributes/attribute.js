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

class TrackAttribute {

    /**
     * @this
     * @param {string} id 
     * @param {string} name 
     * @param {string} type 
     * @param {string} description 
     * @param {Array} filterOperators
     * @param {AttributeRange} range
     */
    constructor(id, name, type, description, filterOperators, range) {

        this._id = id;

        this._name = name;
        this._type = type;
        this._description = description;
        this._filterOperators = filterOperators;
        this._range = range;
    }

    get id () { return this._id }
    set id (id) { this._id = id }
    get name () { return this._name }
    set name (name) { this._name = name }
    get type () { return this._type }
    set type (type) { this._type = type }
    get description () { return this._description }
    set description (description) { this._description = description }
    get filterOperators () { return this._filterOperators }
    set filterOperators (filterOperators) { this._filterOperators = filterOperators }
    get range () { return this._range }
    set range (range) { this._range = range }
}