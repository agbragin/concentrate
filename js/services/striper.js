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

class Stripe {

    /**
     * @constructor
     * @this {Stripe}
     * @param {String} track Track name stripe belongs to
     * @param {String} name Stripe name
     * @param {Number} startCoord Stripe start absolute coordinate (1-based or -Infinity)
     * @param {Number} endCoord Stripe end absoute coordinate (1-based or +Infinity)
     * @param {Object} properties Stripe properties
     */
    constructor(track, name, startCoord, endCoord, properties) {

        this._track = track;
        this._name = name;
        this._startCoord = startCoord;
        this._endCoord = endCoord;
        this._properties = properties;
    }

    get track      () { return this._track      }
    get name       () { return this._name       }
    get startCoord () { return this._startCoord }
    get endCoord   () { return this._endCoord   }
    get properties () { return this._properties }
}

class Striper {

    /**
     * @constructor
     * @this {Striper}
     * @param {GenomicCoordinateComparator} comparator Coordinate comparator instance
     * @param {Bander} bander Bands requesting service
     * @param {BinarySearch} bsUtils Binary search utils
     * @param {GenomicCoordinate} coord Bearing genomic coordinate
     * @param {Number} left Number of left borders to request
     * @param {Number} right Number of right borders to request
     * @param {String[]} dataSources Array of data source URIs to request from
     */
    constructor(logger, comparator, bander, bsUtils, coord, left, right, dataSources) {

        logger.debug(`Instantiating Striper in: ${coord.genome}:${coord.contig}:${coord.coord}[${left};${right}] for data sources: ${dataSources}`);
        this._logger = logger;

        this._getBands = (contig, coord, left, right, dataSources) => bander
                .getBands(contig, coord, left, right, dataSources);
        this._coordCompare = (o1, o2) => comparator.compare(o1, o2);
        this._bsUtils = bsUtils;

        this._coord = coord;
        this._left = left;
        this._right = right;
        this._dataSources = dataSources;

        this._stripes = this._requestStripes();
        this._stripes.then(stripes => {
            this._lastStripes = stripes;
        });
    }

    get stripes     () { return this._stripes     }
    get coord       () { return this._coord       }
    get left        () { return this._left        }
    get right       () { return this._right       }
    get dataSources () { return this._dataSources }
    set dataSources (dataSources) { this._dataSources = dataSources }

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
        this._stripes.then(stripes => {
            this._lastStripes = stripes || [];
        });
    }

    _requestStripes() {

        return this._requestBands().then(
            bandsResource => this._parseStripes(bandsResource),
            error => this._logger.error(error)
        );
    }

    _requestBands() {

        this._logger.debug(`Requesting Bands in: ${this._coord.genome}:${this._coord.contig}:${this._coord.coord}[${this._left};${this._right}] for data sources: ${this._dataSources}`);

        return this._getBands(this._coord.contig, this._coord.coord,
                this._left, this._right, this._dataSources);
    }

    _parseStripes(bandsResource) {

        if (!bandsResource['_embedded'] || !bandsResource['_embedded'].bands) {
            return new Array();
        }

        let bands = bandsResource['_embedded'].bands;
        this._logger.debug(`Got ${bands.length} retrieved bands: ${bands.map(band => band.name)}`);

        // Collect all points retrieved bands are generating
        let points = bands.map(band => [
            new GenomicCoordinate(band.startCoord.contig.referenceGenome.id, band.startCoord.contig.id, band.startCoord.coord),
            new GenomicCoordinate(band.endCoord.contig.referenceGenome.id, band.endCoord.contig.id, band.endCoord.coord)
        ]).reduce((points, bandBounds) => {
            points.set(bandBounds[0].toString(), bandBounds[0]);
            points.set(bandBounds[1].toString(), bandBounds[1]);

            return points;
        }, new Map());
       
        let coords = Array.from(points.values()).sort(this._coordCompare);

        // Search for bearing point inside retrieved points
        let bearingPointIndex = this._bsUtils.indexSearch(coords, this._coord, this._coordCompare);
        // If present we need not to account it while looking up for next left points
        let leftCorrection = !this._bsUtils.contains(coords, this._coord, this._coordCompare);
        // Define a 'visualization horizonts' (every point outside 'atfer them' we threat as Infinity)
        let [leftHorizont, rightHorizont] = [bearingPointIndex - this._left + (leftCorrection ? 1 : 0), bearingPointIndex + this._right];
        [leftHorizont, rightHorizont] = [
            (leftHorizont < 0) ? 0 : leftHorizont,
            (rightHorizont > (coords.length - 1)) ? (coords.length - 1) : rightHorizont
        ];

        return bands.map(band => {

            let startCoord = this._bsUtils.indexSearch(coords,
                    new GenomicCoordinate(band.startCoord.contig.referenceGenome.id, band.startCoord.contig.id, band.startCoord.coord),
                    this._coordCompare);
            let endCoord = this._bsUtils.indexSearch(coords,
                    new GenomicCoordinate(band.endCoord.contig.referenceGenome.id, band.endCoord.contig.id, band.endCoord.coord),
                    this._coordCompare);
            [startCoord, endCoord] = [
                    (startCoord < leftHorizont) ? '-Infinity' : (startCoord - leftHorizont),
                    (endCoord > rightHorizont) ? '+Infinity' : (endCoord - leftHorizont)
            ];

            let properties = band.properties ? band.properties : new Object();
            [properties.startCoord, properties.endCoord] = [band.startCoord, band.endCoord];

            return new Stripe(band.track, band.name, startCoord, endCoord, properties);
        });
    }

    _centerCoord() {

        return Math.ceil((this._left + this._right)/2);
    };

    leftTrivialHop() {
        
        let centerCoord = this._centerCoord();
        let centerStripe = this._lastStripes
                .filter(stripe => (stripe.startCoord === centerCoord || stripe.endCoord === centerCoord))[0];
        let prevStripe = this._lastStripes
                .filter(stripe => (stripe.startCoord === (centerCoord + 1) || stripe.endCoord === (centerCoord + 1)))[0];
        
        if (prevStripe) {
            let newBearingPoint = GenomicCoordinate
                .parseCoordinate(centerStripe.properties[(centerStripe.startCoord === centerCoord) ? 'startCoord' : 'endCoord']);

            /**
             * TODO: somehow detect the leftmost band to prevent future hops
             */
            this.hopTo(newBearingPoint, centerCoord - 1, this._left + this._right - centerCoord + 1);
        }
    }

    rightTrivialHop() {
        
        let centerCoord = this._centerCoord();
        let centerStripe = this._lastStripes
                .filter(stripe => (stripe.startCoord === centerCoord || stripe.endCoord === centerCoord))[0];
        let nextStripe = this._lastStripes
                .filter(stripe => (stripe.startCoord === (centerCoord - 1) || stripe.endCoord === (centerCoord - 1)))[0];
        
        if (nextStripe) {
            let newBearingPoint = GenomicCoordinate
                .parseCoordinate(centerStripe.properties[(centerStripe.startCoord === centerCoord) ? 'startCoord' : 'endCoord']);

            /**
             * TODO: somehow detect the rightmost band to prevent future hops
             */
            this.hopTo(newBearingPoint, this._left + this._right - centerCoord + 2, centerCoord - 2);
        }
    }
}

class StriperFactory {

    /**
     * @constructor
     * @this {StriperFactory}
     * @param {Object} logger Injected logger
     * @param {GenomicCoordinateComparatorFactory} comparatorFactory Coordinate comparator factory
     * @param {Bander} bander Bands requesting service
     * @param {BinarySearch} bsUtils Binary search utils
     */
    constructor(logger, comparatorFactory, bander, bsUtils) {

        this._logger = logger;
        this._comparatorFactory = comparatorFactory;
        this._bander = bander;
        this._bsUtils = bsUtils;
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
        return new Striper(this._logger, this._comparatorFactory.newGenomicCoordinateComparatorInstance(contigsMapping),
                this._bander, this._bsUtils, coord, left, right, dataSources);
    }
}

angular.module('ghop-ui')
.factory('StriperFactory', ($log, GenomicCoordinateComparatorFactory, Bander, BinarySearch) =>
        new StriperFactory($log, GenomicCoordinateComparatorFactory, Bander, BinarySearch));