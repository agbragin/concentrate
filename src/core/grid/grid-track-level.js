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


class GridTrackLevel {

    /**
     * @this
     * @constructor
     * @param {Track} track Track level corresponds to
     * @param {number} capacity Level capacity in grid units
     */
    constructor(track, capacity) {

        this._track = track;
        this._capacity = capacity;

        /**
         * @type {Array.<Stripe>}
         */
        this._items = new Array();
        this._leftInf = false;
        this._rightInf = false;
    }

    get items () { return this._items }
    get leftInf () { return this._leftInf }
    set leftInf (leftInf) { this._leftInf = leftInf }
    get rightInf () { return this._rightInf }
    set rightInf (rightInf) { this._rightInf = rightInf }

    get length () { return this._items.length }

    /**
     * Checks whether the stripe can be placed inside the level without overlap with any stripe already present or not
     * 
     * @this
     * @param {Stripe} stripe Stripe to test to place
     * @returns {boolean}
     */
    canBePlaced(stripe) {
        return this._track === stripe.track && this._items.filter(it => stripe.overlaps(it)).length === 0;
    }

    /**
     * Places the stripe inside the level
     * 
     * @this
     * @param {Stripe} stripe 
     * @throws {StripePlacingException} if stripe can not be placed
     */
    place(stripe) {

        if (!this.canBePlaced(stripe)) {
            throw new StripePlacingException(stripe, this, `Stripe ${stripe.name} overlaps other level's stripes or does not belong to the same track`);
        }

        if (stripe.start > this._capacity || (stripe.end !== +Infinity && stripe.end > this._capacity)) {
            throw new StripePlacingException(stripe, this, `Stripe ${stripe.name} is out of level's capacity`);
        }

        this._items.splice(this._items.findIndex(it => it.start > stripe.start), 0, stripe);
        if (stripe.start === -Infinity) {
            this._leftInf = true;
        }
        if (stripe.end === Infinity) {
            this._rightInf = true;
        }
    }
}