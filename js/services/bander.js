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