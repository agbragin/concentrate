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


class TrackAttribute {

    /**
     * @this
     * @constructor
     * @param {number} id
     * @param {string} name
     * @param {string} type
     * @param {string} description
     * @param {TrackAttributeRange} range
     * @param {Array<string>} filterOperators
     */
    constructor(id, name, type, description, range, filterOperators) {

        this._id = id;
        this._name = name;
        this._type = type;
        this._description = description;
        this._range = range;
        this._filterOperators = filterOperators;
    }

    get id () { return this._id }
    get name () { return this._name }
    get type () { return this._type }
    get description () { return this._description }
    get range () { return this._range }
    get filterOperators () { return this._filterOperators }
}