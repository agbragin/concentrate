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


class StringUtils {

    /**
     * Capitalize first letter of the input string
     * 
     * @static
     * @param {string} s
     * @return {string}
     */
    static capitalize(s) {
        return s.length ? `${s.charAt(0).toUpperCase()}${s.slice(1)}` : s;
    }

    /**
     * Convert camel-cased input to kebab case
     * 
     * @static
     * @param {string} s
     * @returns {string}
     */
    static toKebabCase(s) {
        return s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }
}