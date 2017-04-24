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

class AttributeRange {

    /**
     * @this
     * @param {number} lowerBound 
     * @param {number} upperBound 
     * @param {string} inclusionType 
     * @param {Array} values 
     */
    constructor(lowerBound, upperBound, inclusionType, values) {

        this._lowerBound = lowerBound;
        this._upperBound = upperBound;
        this._inclusionType = inclusionType;
        this._values = values;
    }

    get lowerBound () { return this._lowerBound }
    set lowerBound (lowerBound) { this._lowerBound = lowerBound }
    get upperBound () { return this._upperBound }
    set upperBound (upperBound) { this._upperBound = upperBound }
    get inclusionType () { return this._inclusionType }
    set inclusionType (inclusionType) { this._inclusionType = inclusionType }
    get values () { return this._values }
    set values (values) { this._values = values }
}