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


class GenomicCoordinate {

    /**
     * @this
     * @constructor
     * @param {string} referenceGenomeName
     * @param {string} contigName
     * @param {number} coordinate (ZBHO)
     */
    constructor(referenceGenomeName, contigName, coordinate) {

        this._referenceGenomeName = referenceGenomeName;
        this._contigName = contigName;
        this._coordinate = coordinate;
    }

    get referenceGenomeName () { return this._referenceGenomeName }
    get contigName () { return this._contigName }
    get coordinate () { return this._coordinate }

    toString() {
        return `${this._referenceGenomeName}:${this._contigName}:${this._coordinate}`;
    }
}