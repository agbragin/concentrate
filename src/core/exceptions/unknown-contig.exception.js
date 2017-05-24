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


class UnknownContigException extends Exception {

    /**
     * @this
     * @constructor
     * @param {ReferenceGenome} referenceGenome
     * @param {string} contigName
     */
    constructor(referenceGenome, contigName) {

        super(`Unknown contig of name: ${contigName} for reference genome ${referenceGenome.name}, which only has: ${referenceGenome.contigs}`);

        this._referenceGenome = referenceGenome;
        this._contigName = contigName;
    }

    get referenceGenome () { return this._referenceGenome }
    get contigName () { return this._contigName }
}