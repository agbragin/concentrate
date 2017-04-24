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

class GenomicCoordinate {

    /**
     * @constructor
     * @this {GenomicCoordinate}
     * @param {String} genome Reference genome name
     * @param {String} contig Contig identifier
     * @param {Number} coord Coordinate (1-based)
     */
    constructor(genome, contig, coord) {

        this._genome = genome;
        this._contig = contig;
        this._coord = coord;
    }

    /**
     * @static {GenomicCoordinate}
     * @param {Object} point Genomic coordinate JSON representation
     * @returns {GenomicCoordinate}
     */
    static parseCoordinate(point) {

        try {
            return new GenomicCoordinate(point.contig.referenceGenome.id, point.contig.id, point.coord);
        } catch (e) {
            throw new Error(e);
        }
    }

    get genome() { return this._genome }
    get contig() { return this._contig }
    get coord()  { return this._coord  }

    toString() {
        return `${this._genome}:${this._contig}:${this._coord}`;
    }
}
