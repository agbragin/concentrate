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


class ApplicationPageParameter {

    /**
     * @this
     * @constructor
     * @param {string} name
     * @param {boolean} isArray
     * @param {any} value Parameter's default value
     * @param
     */
    constructor(name, isArray = false, value = undefined) {

        this._name = name;
        this._isArray = isArray;
        this._value = value;
    }

    get name () { return this._name }
    get isArray () { return this._isArray }
    get value () { return this._value }

    toJson() {
        return {
            array: this._isArray,
            value: this._value
        }
    }
}