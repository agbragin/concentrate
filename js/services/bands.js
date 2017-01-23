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

    request(genome, contig, coord, left, right, dataSources) {
        return this._repository.request(genome, contig, coord, left, right, dataSources).$promise;
    }
}

angular.module('ghop-ui')
.factory('BandService', BandService);