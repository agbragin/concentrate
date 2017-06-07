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


class Drawer {

    /**
     * @this
     * @constructor
     * @param {createjs.Stage} stage 
     * @param {VisualizationProperties} vProps 
     */
    constructor(stage, vProps) {

        this._stage = stage;
        this._vProps = vProps;

        this._stageWidth = stage.canvas['clientWidth'];
        this._stageHeight = stage.canvas['clientHeight'];

        if (this._stageWidth % vProps.UNIT_WIDTH) {

            this._unitsNumber = Math.floor(this._stageWidth / vProps.UNIT_WIDTH);

            this._leftInfUnitWidth = Math.floor((this._stageWidth % vProps.UNIT_WIDTH) / 2);
            this._rightInfUnitWidth = Math.ceil((this._stageWidth % vProps.UNIT_WIDTH) / 2);
        } else {

            this._unitsNumber = this._stageWidth / vProps.UNIT_WIDTH - 1;

            this._leftInfUnitWidth = Math.floor(vProps.UNIT_WIDTH / 2);
            this._rightInfUnitWidth = Math.ceil(vProps.UNIT_WIDTH / 2);
        }

        this._stage.enableMouseOver();

        this._init();
    }

    get unitsNumber () { return this._unitsNumber }

    /**
     * @this
     * @param {Grid} grid
     */
    draw(grid) {

        // Clear the canvas first
        this._clear();
        // Compose a background
        this._background();
        // Map border coordinates
        this._borders(grid.getBorderCoordinates());
        // Output tracks
        this._tracks(grid);

        this._stage.update();
    }

    flush() {
        this._init();
    }

    _init() {

        // Clear the canvas first
        this._clear();
        // Compose a background
        this._background();

        // Visualize
        this._stage.update();
    }

    _background() {

        let bg = new createjs.Shape();

        /** -Infinity column's background */
        bg.graphics
                .beginFill(this._vProps.BG_COLUMN_ODD)
                .drawRect(
                    0,
                    0,
                    this._leftInfUnitWidth,
                    this._stageHeight
                );

        /** Unit columns' background */
        for (let i = 0; i < this._unitsNumber; ++i) {
            bg.graphics
                    .beginFill((i % 2) ? this._vProps.BG_COLUMN_ODD : this._vProps.BG_COLUMN_EVEN)
                    .drawRect(
                        this._leftInfUnitWidth + i * this._vProps.UNIT_WIDTH,
                        0,
                        this._leftInfUnitWidth + (i + 1) * this._vProps.UNIT_WIDTH,
                        this._stageHeight
                    );
        }

        /** +Infinity column's background */
        bg.graphics
                .beginFill((this._unitsNumber % 2) ? this._vProps.BG_COLUMN_ODD : this._vProps.BG_COLUMN_EVEN)
                .drawRect(
                    this._stageWidth - this._rightInfUnitWidth,
                    0,
                    this._stageWidth,
                    this._stageHeight
                );

        this._stage.addChild(bg);
    }

    /**
     * @this
     * @param {Array.<GenomicCoordinate>} coordinates
     */
    _borders(coordinates) {

        for (let i = 0, hOffset = this._leftInfUnitWidth, currentContig = undefined; i < coordinates.length; ++i, hOffset += this._vProps.UNIT_WIDTH) {

            let coordinateDash = new createjs.Shape();
            coordinateDash.graphics
                    .beginFill(this._vProps.COORDINATE_DASH_COLOR)
                    .drawRect(
                        hOffset,
                        0,
                        1,
                        this._vProps.COORDINATE_DASH_HEIGHT
                    );

            this._stage.addChild(coordinateDash);

            /**
             * Do not output coordinate label for last screen unit end as its width (~ +Inf unit width) can be shrunk
             */
            if (!(i < this._unitsNumber)) {
                continue;
            }

            let coordinateLabelText = `${coordinates[i].coordinate}`;
            if (coordinates[i].contigName !== currentContig) {

                currentContig = coordinates[i].contigName;
                coordinateLabelText = `${currentContig}:`.concat(coordinateLabelText);
            }

            let coordinateLabel = new createjs.Text(coordinateLabelText, this._vProps.COORDINATE_DASH_LABEL_STYLE, this._vProps.COORDINATE_DASH_COLOR);

            [coordinateLabel.x, coordinateLabel.y] = [hOffset + this._vProps.COORDINATE_DASH_LABEL_MARGIN_X, this._vProps.COORDINATE_DASH_LABEL_MARGIN_TOP];
            coordinateLabel.maxWidth = this._vProps.UNIT_WIDTH - 2 * this._vProps.STRIPE_LABEL_MARGIN_X;
            coordinateLabel.mouseEnabled = false;

            this._stage.addChild(coordinateLabel);
        }
    }

    /**
     * @this
     * @param {Grid} grid
     */
    _tracks(grid) {

        let tracks = grid.tracks;
        let densities = grid.getDensities();

        for (let i = 0, vOffset = this._vProps.GRID_MARGIN_TOP; i < tracks.length; ++i) {

            if (!tracks[i].track.active) {
                console.debug(`${tracks[i].track.name} is not active, skip it`);
                continue;
            } else {
                console.debug(`Drawing ${tracks[i].track.name} track, which has ${tracks[i].levels.length} levels`);
            }

            this._trackBg(tracks[i], vOffset);
            this._track(tracks[i], vOffset + this._vProps.GRID_TRACK_BACKGROUND_PADDING_Y, densities);
            vOffset += (tracks[i].levels.length ? tracks[i].levels.length : 1) * (this._vProps.UNIT_HEIGHT + this._vProps.GRID_TRACK_LEVEL_MARGIN_BOTTOM) - this._vProps.GRID_TRACK_LEVEL_MARGIN_BOTTOM + 2 * this._vProps.GRID_TRACK_BACKGROUND_PADDING_Y + this._vProps.GRID_TRACK_MARGIN_BOTTOM;
        }
    }

    /**
     * @this
     * @param {GridTrack} track
     * @param {number} verticalOffset
     * @param {Array.<number>} densities
     */
    _track(track, verticalOffset, densities) {

        for (let i = 0; i < track.levels.length; ++i) {
            console.debug(`Drawing ${i + 1}/${track.levels.length} ${track.track.name} level, which has ${track.levels[i].items.length} items`);
            this._level(track.levels[i], verticalOffset + i * (this._vProps.UNIT_HEIGHT + this._vProps.GRID_TRACK_LEVEL_MARGIN_BOTTOM), densities);
        }
    }

    /**
     * @this
     * @param {GridTrackLevel} level
     * @param {number} verticalOffset
     * @param {Array.<number>} densities
     */
    _level(level, verticalOffset, densities) {

        for (let i = 0; i < level.items.length; ++i) {

            let stripe = level.items[i];
            let stripeStartDrawingPoint = [(stripe.start === -Infinity) ? 0 : (this._leftInfUnitWidth + stripe.start * this._vProps.UNIT_WIDTH), verticalOffset];

            this._stripe(stripe, ...stripeStartDrawingPoint, densities);
        }
    }

    /**
     * @this
     * @param {GridTrack} track
     * @param {number} verticalOffset
     */
    _trackBg(track, verticalOffset) {

        /**
         * @param {string} hexColor
         * @returns {string}
         */
        let convertFromHex = hexColor => {

            if (!hexColor) {
                return 'rgba(255, 255, 255, 1)';
            }

            let r = parseInt(hexColor.slice(1, 3), 16);
            let g = parseInt(hexColor.slice(3, 5), 16);
            let b = parseInt(hexColor.slice(5, 7), 16);

            return `rgba(${r}, ${g}, ${b}, ${this._vProps.GRID_TRACK_BACKGROUND_ALPHA})`;
        };

        let trackBackgroundShape = new createjs.Shape();
        let bg = {
            width: this._stageWidth,
            height: (track.levels.length ? track.levels.length : 1) * (this._vProps.UNIT_HEIGHT + this._vProps.GRID_TRACK_LEVEL_MARGIN_BOTTOM) - this._vProps.GRID_TRACK_LEVEL_MARGIN_BOTTOM + 2 * this._vProps.GRID_TRACK_BACKGROUND_PADDING_Y
        };
        trackBackgroundShape.graphics.beginFill(convertFromHex(track.track.color)).drawRect(0, verticalOffset, bg.width, bg.height);

        this._stage.addChild(trackBackgroundShape);
    }

    /**
     * @this
     * @param {Stripe} stripe
     * @param {number} x
     * @param {number} y
     * @param {Array.<number>} densities
     */
    _stripe(stripe, x, y, densities) {

        let stripeContainer = new createjs.Container();
        [stripeContainer.x, stripeContainer.y] = [x, y];
        stripeContainer.alpha = this._vProps.STRIPE_DEFAULT_ALPHA;
        stripeContainer.cursor = 'pointer';

        /**
         * Compose a stripe shape
         */
        let stripeShape = new createjs.Shape();
        let stripeColor;
        switch (stripe.track.name) {
        case 'Reference':
            switch (stripe.name) {
            case 'A':
                stripeColor = this._vProps.STRIPE_NUCLEOTIDE_COLOR_ADENINE;
                break;

            case 'C':
                stripeColor = this._vProps.STRIPE_NUCLEOTIDE_COLOR_CYTOSINE;
                break;

            case 'G':
                stripeColor = this._vProps.STRIPE_NUCLEOTIDE_COLOR_GUANINE;
                break;

            case 'T':
                stripeColor = this._vProps.STRIPE_NUCLEOTIDE_COLOR_THYMINE;
                break;

            case 'N':
            default:
                stripeColor = this._vProps.STRIPE_NUCLEOTIDE_COLOR_ANY;
            }
            break;

        case 'Chromosome':
            stripeColor = this._vProps.STRIPE_CHROMOSOME_COLOR;
            break;

        default:
            stripeColor = stripe.track.color;
        }

        /**
         * Compose a stripe body
         */
        this._stripeBody(stripeContainer, stripe, densities, stripeColor);

        /**
         * Add hovering effects
         */
        stripeContainer.on('mouseover', e => {
            e.target.parent.alpha = this._vProps.STRIPE_HOVER_ALPHA;
            this._stage.update();
        });
        stripeContainer.on('mouseout', e => {
            e.target.parent.alpha = this._vProps.STRIPE_DEFAULT_ALPHA;
            this._stage.update();
        });

        /**
         * Add click event to transmit stripe data
         */
        stripeContainer.on('click', e => {
            let click = new CustomEvent('stripeClick', { 'detail': stripe });
            this._stage.dispatchEvent(click);
        });

        /**
         * Compose a stripe label
         */
        let stripeLabel = new createjs.Text(stripe.name, this._vProps.STRIPE_LABEL_STYLE, this._vProps.STRIPE_LABEL_COLOR);
        [stripeLabel.x, stripeLabel.y] = [this._vProps.STRIPE_LABEL_MARGIN_X, this._vProps.STRIPE_LABEL_MARGIN_TOP];
        stripeLabel.maxWidth = this._vProps.UNIT_WIDTH * (((stripe.end === Infinity) ? this._unitsNumber : stripe.end) - ((stripe.start === -Infinity) ? 0 : stripe.start)) - 2 * this._vProps.STRIPE_LABEL_MARGIN_X;
        stripeLabel.mouseEnabled = false;

        stripeContainer.addChild(stripeShape);
        stripeContainer.addChild(stripeLabel);

        if (x !== 0) {

            /**
             * Add start stripe border
             */

            let stripeBorder = new createjs.Shape();
            stripeBorder.graphics
                    .beginFill(this._vProps.STRIPE_BORDER_COLOR)
                    .drawRect(0, 0, 1, this._vProps.UNIT_HEIGHT);

            stripeContainer.addChild(stripeBorder);
        }

        this._stage.addChild(stripeContainer);
    }

    /**
     * Compose a stripe body
     * 
     * @param {createjs.Container} stripeContainer
     * @param {Stripe} stripe
     * @param {Array.<number>} densities
     * @param {string} stripeColor
     */
    _stripeBody(stripeContainer, stripe, densities, stripeColor) {

        let containsLeftInf = stripe.start === -Infinity;

        if (containsLeftInf) {

            let leftInfPartShape = new createjs.Shape();
            leftInfPartShape.graphics.beginFill(stripeColor).drawRect(
                0, 0, this._leftInfUnitWidth, this._vProps.UNIT_HEIGHT
            );

            stripeContainer.addChild(leftInfPartShape);
        }

        for (let i = 0, relCoord = Number.isFinite(stripe.start) ? stripe.start : 0, end = Number.isFinite(stripe.end) ? stripe.end : this._unitsNumber; relCoord < end; ++i, ++relCoord) {

            let partShape = new createjs.Shape();
            partShape.graphics.beginFill(stripeColor).drawRect(
                (containsLeftInf ? this._leftInfUnitWidth : 0) + i * this._vProps.UNIT_WIDTH,
                0,
                this._vProps.UNIT_WIDTH,
                this._vProps.UNIT_HEIGHT
            );
            partShape.alpha = this._vProps.STRIPE_MIN_DENSITY +  densities[relCoord] * (this._vProps.STRIPE_MAX_DENSITY - this._vProps.STRIPE_MIN_DENSITY);

            stripeContainer.addChild(partShape);
        }

        if (stripe.end === +Infinity) {

            let stripeLength = (Number.isFinite(stripe.end) ? stripe.end : this._unitsNumber) - (Number.isFinite(stripe.start) ? stripe.start : 0);

            let rightInfPartShape = new createjs.Shape();
            rightInfPartShape.graphics.beginFill(stripeColor).drawRect(
                (containsLeftInf ? this._leftInfUnitWidth : 0) + stripeLength * this._vProps.UNIT_WIDTH,
                0,
                this._rightInfUnitWidth,
                this._vProps.UNIT_HEIGHT
            );

            stripeContainer.addChild(rightInfPartShape);
        }
    }

    _clear() {
        this._stage.removeAllChildren();
    }
}