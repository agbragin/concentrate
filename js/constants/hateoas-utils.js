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

class HateoasException {

    /**
     * @constructor
     * @this {HateoasException}
     * @param {Object} resource Resource caused the exception
     * @param {String} message Exception message
     */
    constructor(resource, message) {
        this._resource = resource;
        this._message = message;
    }

    get resource() { return this._resource }
    get message()  { return this._message  }
}

class HateoasUtils {

    /**
     * @static {HateoasUtils}
     * @param {Object} resource HATEOAS-resource
     * @returns {String} Resource's self-link
     * @throws {HateoasException} if the resource is not a HATEOAS-resource
     */
    static getResourceUri(resource) {

        if (resource && resource['_links'] && resource['_links'].self
                && resource['_links'].self.href) {
            return new String(resource['_links'].self.href);
        } else {
            throw new HateoasException(resource, 'Is not a HATEOAS-resource');
        }
    }

    /**
     * @static {HateoasUtils}
     * @param {Object} resource HATEOAS-resource
     * @returns {String} Resource's id
     * @throws {HateoasException} if the resource is not a HATEOAS-resource
     */
    static getResourceId(resource) {

        let resourceUri = HateoasUtils.getResourceUri(resource);
        let uriTokens = resourceUri.split('/');

        return uriTokens[uriTokens.length - 1];
    }
}

angular.module('ghop-ui')
.constant('HateoasUtils', HateoasUtils);