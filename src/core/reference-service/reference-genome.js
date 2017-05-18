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
 * In fact, just a data class to hold the information about reference genome and its contig names
 */
class ReferenceGenome {

    /**
     * @this
     * @constructor
     * @param {string} name Reference genome name
     * @param {Array<string>} contigs Reference genome's contig names
     */
    constructor(name, contigs) {
        this._name = name;
        this._contigs = Array.from(contigs);
    }

    get name () { return this._name }
    get contigs () { return this._contigs }
}