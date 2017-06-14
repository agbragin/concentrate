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


class FailedRequestService {

    constructor(failedRquestsValue) {
        this._failedRequestsValue = failedRquestsValue;
    }

    get failedRequests () { return this._failedRequestsValue.array }

    /**
     * Flush failed HTTP requests array
     * 
     * @this
     */
    flush() {
        this._failedRequestsValue.array = new Array();
    }

    /**
     * Handle function for failed HTTP requests
     * 
     * @this
     * @param {any} e Angular HTTP service error response object
     * @returns {Promise.<any>}
     */
    handle(e) {

        this._add(new FailedRequest(e.config.method, e.status, e.config.url, e.data));

        return Promise.reject(e);
    }

    /**
     * Adds another failed HTTP request
     * 
     * @this
     * @param {FailedRequest} failedRequest Failed HTTP request
     */
    _add(failedRequest) {
        this._failedRequestsValue.array.push(failedRequest);
    }
}

/**
 * Can't use fat arrow syntax in service definition due to:
 * https://github.com/angular/angular.js/issues/14814
 */
angular.module('concentrate')
.service('FailedRequestService', function(FailedRequests) {
    return new FailedRequestService(FailedRequests);
});