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


/**
 * In fact, just a data class to hold the information about failed HTTP request
 */
class FailedRequest {

    /**
     * @this
     * @constructor
     * @param {string} method Http method
     * @param {number} status Http status
     * @param {string} url Request's URL
     * @param {Object} data Response data if present
     */
    constructor(method, status, url, data) {

        this._method = method;
        this._status = status;
        this._url = url;
        this._data = data;
    }

    get method () { return this._method }
    get status () { return this._status }
    get url () { return this._url }
    get data () { return this._data }
}