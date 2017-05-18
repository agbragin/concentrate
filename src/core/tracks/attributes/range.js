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


const supportedInclusionType = new Array("[]", "[)", "(]", "()");

class TrackAttributeRange {

    /**
     * @this
     * @constructor
     * @param {any} lowerBound Attribute lower bound value
     * @param {any} upperBound Attribute upper bound value
     * @param {string} inclusionType Inclusion type
     * @param {Array<any>} values Attribute possible values
     */
    constructor(lowerBound, upperBound, inclusionType, values) {

        this._lowerBound = lowerBound;
        this._upperBound = upperBound;
        this._inclusionType = TrackAttributeRange.parseInclusionType(inclusionType);
        this._values = values;
    }

    get lowerBound () { return this._lowerBound }
    get upperBound () { return this._upperBound }
    get inclusionType () { return this._inclusionType }
    get values () { return this._values }

    /**
     * Whether the value conforms the range
     * 
     * @param {any} value Value to test
     * @returns {boolean}
     */
    possibleValue(value) {

        if (this._values) {
            return this._values.findIndex(it => it === value) !== -1;
        }

        switch (this._inclusionType) {
            case "[]":
                return this._lowerBound <= value && this._upperBound >= value;

            case "[)":
                return this._lowerBound <= value && this._upperBound > value;

            case "(]":
                return this._lowerBound < value && this._upperBound >= value;

            case "()":
                return this._lowerBound < value && this._upperBound > value;

            default:
                // Unreachable code block
                return false;
        }
    }

    /**
     * Parses present inclusion type and returns it if it is supported
     * 
     * @static
     * @param {string} inclusionType Inclusion type to check
     * @returns {string}
     * @throws {UnsupportedInclusionTypeException} if present inclusion type is unsupported
     */
    static parseInclusionType(inclusionType) {

        if (supportedInclusionType.indexOf(inclusionType) !== -1) {
            return inclusionType;
        } else {
            throw new UnsupportedInclusionTypeException(this._inclusionType);
        }
    }
}