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

    get genome() { return this._genome }
    get contig() { return this._contig }
    get coord()  { return this._coord  }

    toString() {
        return `${this._genome}:${this._contig}:${this._coord}`;
    }
}

class Stripe {

    /**
     * @constructor
     * @this {Stripe}
     * @param {String} name Stripe name
     * @param {Number} startCoord Stripe start absolute coordinate (1-based or -Infinity)
     * @param {Number} endCoord Stripe end absoute coordinate (1-based or +Infinity)
     * @param {Object} properties Stripe properties
     */
    constructor(name, startCoord, endCoord, properties) {

        this._name = name;
        this._startCoord = startCoord;
        this._endCoord = endCoord;
        this._properties = properties;
    }

    get name       () { return this._name       }
    get startCoord () { return this._startCoord }
    get endCoord   () { return this._endCoord   }
    get properties () { return this._properties }
}

class Striper {

    /**
     * @constructor
     * @this {Striper}
     * @param {GenomicCoordinateComparator} genomicCoordinateComparator Coordinate comparator
     * @param {BandService} bandService Bands requesting service 
     * @param {GenomicCoordinate} coord Bearing genomic coordinate
     * @param {Number} left Number of left borders to request
     * @param {Number} right Number of right borders to request
     * @param {String[]} dataSources Array of data source URIs to request from
     */
    constructor(logger, genomicCoordinateComparator, bandService, coord, left, right, dataSources) {

        logger.debug(`Instantiating Striper in: ${coord.genome}:${coord.contig}:${coord.coord}[${left};${right}] for data sources: ${dataSources}`);
        this._logger = logger;

        this._request = (genome, contig, coord, left, right, dataSources) => bandService
                .request(genome, contig, coord, left, right, dataSources);
        this._coordCompare = (o1, o2) => genomicCoordinateComparator.compare(o1, o2);

        this._coord = coord;
        this._left = left;
        this._right = right;
        this._dataSources = dataSources;

        this._stripes = this._requestStripes();
    }

    get stripes     () { return this._stripes     }
    get coord       () { return this._coord       }
    get left        () { return this._left        }
    get right       () { return this._right       }
    get dataSources () { return this._dataSources }

    /**
     * @this {Striper}
     * @param {GenomicCoordinate} coord New bearing genomic coordinate to hop to
     * @param {Number} left Number of left borders to request from new coordinate
     * @param {Number} right Number of right borders to request from new coordinate
     */
    hopTo(coord, left, right) {

        this._logger.debug(`Perform a hop from ${this._coord.genome}:${this._coord.contig}:${this._coord.coord}[${this._left};${this._right}] to ${coord.genome}:${coord.contig}:${coord.coord}[${left};${right}]`);

        this._coord = coord;
        this._left = left;
        this._right = right;

        this._stripes = this._requestStripes();
    }

    _requestStripes() {

        return this._requestBands().then(
            bandsResource => this._parseStripes(bandsResource),
            error => this._logger.error(error)
        );
    }

    _requestBands() {

        this._logger.debug(`Requesting Bands in: ${this._coord.genome}:${this._coord.contig}:${this._coord.coord}[${this._left};${this._right}] for data sources: ${this._dataSources}`);

        return this._request(this._coord.genome, this._coord.contig, this._coord.coord,
                this._left, this._right, this._dataSources);
    }

    _parseStripes(bandsResource) {

        if (!bandsResource['_embedded'] || !bandsResource['_embedded'].bands) {
            return new Array();
        }

        // Collect all points retrieved bands are generating
        let points = bandsResource['_embedded'].bands.reduce((points, band) => {

            points.add(band.startCoord);
            points.add(band.endCoord);

            return points;
        }, new Set());

        // TODO: etc.

        return bandsResource['_embedded'].bands;
    }
}

class StriperFactory {

    /**
     * @constructor
     * @this {Striper}
     * @param {BandService} BandService Bands requesting service 
     */
    constructor($log, GenomicCoordinateComparatorFactory, BandService) {

        this._logger = $log;
        this._comparatorFactory = GenomicCoordinateComparatorFactory;
        this._bandService = BandService;
    }

    /**
     * @this {StriperFactory}
     * @param {GenomicCoordinate} coord Bearing genomic coordinate
     * @param {Number} left Number of left borders to request
     * @param {Number} right Number of right borders to request
     * @param {String[]} dataSources Array of data source URIs to request from
     * @param {Map} contigsMapping Available reference genomes' contigs list mapping
     */
    newStriperInstance(coord, left, right, dataSources, contigsMapping) {
        return new Striper(this._logger, this._comparatorFactory.newGenomicCoordinateComparatorInstance(contigsMapping),
                this._bandService, coord, left, right, dataSources);
    }
}

angular.module('ghop-ui')
.factory('StriperFactory', StriperFactory);