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


class GridTrack {

    /**
     * @this
     * @constructor
     * @param {Track} track Track object corresponds with
     * @param {number} capacity Track capacity in grid units
     */
    constructor(track, capacity) {

        this._track = track;
        this._capacity = capacity;

        /**
         * @type {Array.<GridTrackLevel>}
         */
        this._levels = new Array();
    }

    get track () { return this._track }
    get levels () { return this._levels }

    /**
     * Places the stripe inside the level
     * 
     * @this
     * @param {Stripe} stripe 
     * @throws {StripePlacingException} if stripe can not be placed
     */
    place(stripe) {

        for (let i = 0; i < this._levels.length; ++i) {
            if (this._levels[i].canBePlaced(stripe)) {
                this._levels[i].place(stripe);
                return;
            }
        }

        let newLevel = new GridTrackLevel(this._track, this._capacity);
        newLevel.place(stripe);

        this._levels.push(newLevel);
    }

    /**
     * Checks whether the track contains items of infinity left border
     * 
     * @this
     * @returns {boolean}
     */
    containsMinusInf() {
        return !this._levels.every(it => !it.leftInf);
    }

    /**
     * Checks whether the track contains items of infinity right border
     * 
     * @this
     * @returns {boolean}
     */
    containsPlusInf() {
        return !this._levels.every(it => !it.rightInf);
    }
}