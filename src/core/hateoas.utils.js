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


class HateoasUtils {

    /**
     * Extracts resource id from its self link
     * 
     * @public
     * @static
     * @param {Object} resource HATEOAS resource object
     * @returns {string}
     */
    static getResourceId(resource) {

        if (!resource['_links'] || !resource['_links'].self || !resource['_links'].self['href']) {
            throw new IllegalArgumentException(resource, `Resource id extraction fail as not a HATEOAS resource was passed: ${JSON.stringify(hateoasResource)}`);
        }

        let hrefTokens = hateoasResource['_links'].self['href'].split('/');

        return hrefTokens[hrefTokens.length - 1];
    }
}