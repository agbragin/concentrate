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


class StripePlacingException extends Exception {

    /**
     * @this
     * @constructor
     * @param {Stripe} stripe Stripe caused the exception
     * @param {GridTrackLevel} level Level inside which stripe caused the exception
     * @param {string} message Exception message
     */
    constructor(stripe, level, message) {

        super(message);

        this._stripe = stripe;
        this._level = level;
    }

    get stripe () { return this._stripe }
    get level () { return this._level }
}