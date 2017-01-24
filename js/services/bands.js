class BandService {

    constructor(Bands) {
        this._repository = {
            request: (genome, contig, coord, left, right, dataSources) => Bands.get({
                genome: genome,
                contig: contig,
                coord: coord,
                left: left,
                right: right,
                dataSources: dataSources
            })
        }
    }

    /**
     * @this {BandService}
     * @param {String} genome Reference genome name
     * @param {String} contig Contig identifier
     * @param {Number} coord Coordinate (1-based)
     * @param {Number} left Number of left borders to request
     * @param {Number} right Number of right borders to request
     * @param {String[]} dataSources Array of data source URIs to request from
     */
    request(genome, contig, coord, left, right, dataSources) {
        return this._repository.request(genome, contig, coord, left, right, dataSources).$promise;
    }
}

angular.module('ghop-ui')
.factory('BandService', BandService);