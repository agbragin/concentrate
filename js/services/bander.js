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

class Bander {

    constructor(Bands) {
        this._repository = {
            request: (contig, coord, left, right, dataSources) => Bands.get({
                contig: contig,
                coord: coord,
                left: left,
                right: right,
                dataSources: dataSources
            })
        }
    }

    /**
     * @this {Bander}
     * @param {String} contig Contig identifier
     * @param {Number} coord Coordinate (1-based)
     * @param {Number} left Number of left borders to request
     * @param {Number} right Number of right borders to request
     * @param {String[]} dataSources Array of data source URIs to request from
     */
    getBands(contig, coord, left, right, dataSources) {
        return this._repository.request(contig, coord, left, right, dataSources).$promise;
    }
}

angular.module('ghop-ui')
.factory('Bander', (Bands) => new Bander(Bands));