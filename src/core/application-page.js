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


class ApplicationPage {

    /**
     * @this
     * @constructor
     * @param {string} name
     * @param {string} url
     * @param {ApplicationPage} parent
     * @param {Array.<ApplicationPageParameter} params
     */
    constructor(name, url, parent = undefined, params = new Array()) {

        this._name = name;
        this._url = url;
        this._parent = parent;
        this._params = params;
    }

    get name () { return this._name }
    get url () { return this._url }
    get parent () { return this._parent }
    get params () { return this._params }

    get state () { return `${this._parent ? `${this._parent.toString()}.` : ''}${this._name}` }

    toString() {
        return this.state;
    }
}