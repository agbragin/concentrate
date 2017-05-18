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


class Band {

    /**
     * @this
     * @constructor
     * @param {Track} track
     * @param {GenomicCoordinate} start
     * @param {GenomicCoordinate} end
     * @param {string} name
     * @param {Object} properties
     */
    constructor(track, start, end, name, properties) {

        this._track = track;
        this._start = start;
        this._end = end;
        this._name = name;
        this._properties = properties;
    }

    get track () { return this._track }
    get start () { return this._start }
    get end () { return this._end }
    get name () { return this._name }
    get properties () { return this._properties }
}