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
     * @param {BinarySearch} binarySearchUtils Binary search utils
     * @param {GenomicCoordinate} coord Bearing genomic coordinate
     * @param {Number} left Number of left borders to request
     * @param {Number} right Number of right borders to request
     * @param {String[]} dataSources Array of data source URIs to request from
     */
    constructor(logger, genomicCoordinateComparator, bandService, binarySearchUtils, coord, left, right, dataSources) {

        logger.debug(`Instantiating Striper in: ${coord.genome}:${coord.contig}:${coord.coord}[${left};${right}] for data sources: ${dataSources}`);
        this._logger = logger;

        this._request = (genome, contig, coord, left, right, dataSources) => bandService
                .request(genome, contig, coord, left, right, dataSources);
        this._coordCompare = (o1, o2) => genomicCoordinateComparator.compare(o1, o2);
        this._binarySearchUtils = binarySearchUtils;

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
        let points = bandsResource['_embedded'].bands.map(band => [
            new GenomicCoordinate(band.startCoord.contig.referenceGenome.id, band.startCoord.contig.id, band.startCoord.coord),
            new GenomicCoordinate(band.endCoord.contig.referenceGenome.id, band.endCoord.contig.id, band.endCoord.coord)
        ]).reduce((points, bandBounds) => {

            points.add(bandBounds[0]);
            points.add(bandBounds[1]);

            return points;
        }, new Set());

        // Sort them
        let coords = new Array(...points).sort(this._coordCompare);

        // Search for bearing point inside retrieved points
        let bearingPointIndex = this._binarySearchUtils.indexSearch(coords, this._coord, this._coordCompare);
        // If present we need not to account it while looking up for next left points
        let leftCorrection = this._binarySearchUtils.contains(coords, this._coord, this._coordCompare);
        // Define a 'visualization horizonts' (every point outside 'atfer them' we threat as Infinity)
        let [leftHorizont, rightHorizont] = [bearingPointIndex - this._left - (leftCorrection ? 1 : 0), bearingPointIndex + this._right];
        [leftHorizont, rightHorizont] = [
            (leftHorizont < 0) ? 0 : leftHorizont,
            (rightHorizont > (coords.length - 1)) ? (coords.length - 1) : rightHorizont
        ];

        return bandsResource['_embedded'].bands.map(band => {

            let startCoord = this._binarySearchUtils
                    .indexSearch(coords,
                            new GenomicCoordinate(band.startCoord.contig.referenceGenome.id, band.startCoord.contig.id, band.startCoord.coord),
                            this._coordCompare);
            let endCoord = this._binarySearchUtils
                    .indexSearch(coords,
                            new GenomicCoordinate(band.endCoord.contig.referenceGenome.id, band.endCoord.contig.id, band.endCoord.coord),
                            this._coordCompare);
            [startCoord, endCoord] = [
                    (startCoord < leftHorizont) ? -Infinity : (startCoord - leftHorizont),
                    (endCoord > rightHorizont) ? +Infinity : (endCoord - leftHorizont)
            ];

            let properties = band.properties;
            [properties.startCoord, properties.endCoord] = [band.startCoord, band.endCoord];

            return new Stripe(band.name, startCoord, endCoord, properties);
        });
    }
}

class StriperFactory {

    /**
     * @constructor
     * @this {Striper}
     */
    constructor($log, GenomicCoordinateComparatorFactory, BandService, BinarySearch) {

        this._logger = $log;
        this._coordCompareFactory = GenomicCoordinateComparatorFactory;
        this._bandService = BandService;
        this._binarySearchUtils = BinarySearch;
    }

    /**
     * @this {StriperFactory}
     * @param {GenomicCoordinate} coord Bearing genomic coordinate
     * @param {Number} left Number of left borders to request
     * @param {Number} right Number of right borders to request
     * @param {String[]} dataSources Array of data source URIs to request from
     * @param {Object} contigsMapping Available reference genomes' contigs list mapping
     */
    newStriperInstance(coord, left, right, dataSources, contigsMapping) {
        return new Striper(this._logger, this._coordCompareFactory.newGenomicCoordinateComparatorInstance(contigsMapping),
                this._bandService, this._binarySearchUtils, coord, left, right, dataSources);
    }
}

angular.module('ghop-ui')
.factory('StriperFactory', StriperFactory);