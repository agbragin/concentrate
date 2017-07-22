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


class Stripe {

    /**
     * @this
     * @constructor
     * @param {Track} track Track stripe belongs to
     * @param {string} name Stripe's name
     * @param {number} start Stripe's start coordinate (0-based or -Infinity)
     * @param {number} end Stripe's end coordinate (0-based or +Infinity)
     * @param {Object} properties Stripe's properties
     */
    constructor(track, name, start, end, properties) {

        this._track = track;
        this._name = name;
        this._start = start;
        this._end = end;
        this._properties = properties;
    }

    get track () { return this._track }
    get name () { return this._name }
    get start () { return this._start }
    get end () { return this._end }
    get properties () { return this._properties }

    /**
     * Checks whether the stripe overlaps with the present
     * 
     * @this
     * @param {Stripe} stripe
     * @returns {boolean}
     */
    overlaps(stripe) {
        return this.coincides(stripe) || (this._track === stripe.track
                && ((this._start > stripe.start && this._start < stripe.end || this._end > stripe.start && this._end < stripe.end)
                        || (stripe.start > this._start && stripe.start < this._end || stripe.end > this._start && stripe.end < this._end)));
    }

    /**
     * Checks whether the stripe coincides with the presetn
     * 
     * @this
     * @param {Stripe} stripe
     * @returns {boolean}
     */
    coincides(stripe) {
        return this._track === stripe.track
                && this._start === stripe.start && this._end === stripe.end;
    }

    toString() {
        return `${this._track}:${this._name}`;
    }
}