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


class Grid {

    /**
     * @this
     * @constructor
     * @param {number} capacity Grid capacity in grid units
     * @param {Array.<Track>} orderSample Track list representing tracks' order to be preserved while grid composing
     */
    constructor(capacity, orderSample) {

        this._capacity = capacity;

        /**
         * @type {Array.<GridTrack>}
         */
        this._tracks = new Array();

        if (orderSample) {
            this._tracks = orderSample.map(it => new GridTrack(it, capacity));
        }
    }

    get tracks () { return this._tracks }

    /**
     * Checks whether the grid contains items of infinity left border
     * 
     * @this
     * @returns {boolean}
     */
    containsMinusInf() {
        return !this._tracks.every(it => !it.containsMinusInf());
    }

    /**
     * Checks whether the grid contains items of infinity right border
     * 
     * @this
     * @returns {boolean}
     */
    containsPlusInf() {
        return !this._tracks.every(it => !it.containsPlusInf());
    }

    /**
     * Whether the grid contains stripes covering each of its borders
     * 
     * @this
     * @returns {boolean} 
     */
    isFull() {

        let items = this.getStripes();
        let gridBorders = [...Array(this._capacity + 1).keys()];
        let actualBorders = items.map(it => [it.start, it.end])
                .reduce((/** @type {Array.<number>} */borders, stripeBorders) => borders.concat(stripeBorders), new Array());

        return gridBorders.every(it => actualBorders.indexOf(it) !== -1);
    }

    /**
     * All the items grid contains
     * 
     * @this
     * @returns {Array.<Stripe>}
     */
    getStripes() {

        return this._tracks
                .map(it => it.levels.map(lvl => lvl.items).reduce((items, levelItems) => items.concat(levelItems), new Array()))
                .reduce((items, trackItems) => items.concat(trackItems), new Array());
    }

    /**
     * Current visualization focus candidate
     * 
     * @this
     * @returns {VisualizationFocus}
     */
    getFocusCandidate() {

        let items = this.getStripes();
        let gridCenter = this._capacity / 2;
        let minDist = Math.min.apply(Math, items.map(it => Math.min(Math.abs(it.start - gridCenter), Math.abs(it.end - gridCenter))));

        let focusStripe = items.filter(it => Math.min(Math.abs(it.start - gridCenter), Math.abs(it.end - gridCenter)) === minDist)[0];
        /**
         * @type {GenomicCoordinate}
         */
        let focusCoordinate = (Math.abs(focusStripe.start - gridCenter) === minDist) ? focusStripe.properties.start : focusStripe.properties.end;
        let borderNumberToTheLeft = (Math.abs(focusStripe.start - gridCenter) === minDist) ? focusStripe.start : focusStripe.end;
        let borderNumberToTheRight = this._capacity - borderNumberToTheLeft;

        return new VisualizationFocus(focusCoordinate, borderNumberToTheLeft, borderNumberToTheRight);
    }

    /**
     * Add stripes to grid
     * 
     * @this
     * @param {Array.<Stripe>} stripes
     */
    add(stripes) {
        stripes.forEach(it => this._addStripe(it));
    }

    /**
     * Retrieve grid borders' genomic coordinates
     * 
     * @this
     * @returns {Array.<GenomicCoordinate>}
     */
    getBorderCoordinates() {

        /**
         * Function target array
         * 
         * @type {Array.<GenomicCoordinate>}
         */
        let coordinates = new Array();
        let stripes = this.getStripes();
        for (let i = 0; i < this._capacity + 1; ++i) {

            let borderGenerant = stripes.find(it => it.start === i || it.end === i);
            if (borderGenerant) {

                let border = (borderGenerant.start === i) ? 'start' : 'end';
                coordinates.push(borderGenerant.properties[border]);
            }
        }

        return coordinates;
    }

    /**
     * Adds stripe to grid
     * 
     * @this
     * @param {Stripe} stripe
     */
    _addStripe(stripe) {

        let targetTrackIdx = this._tracks.findIndex(it => it.track === stripe.track);
        if (targetTrackIdx === -1) {

            let track = new GridTrack(stripe.track, this._capacity);
            track.place(stripe);

            this._tracks.push(track);
        } else {
            this._tracks[targetTrackIdx].place(stripe);
        }
    }
}