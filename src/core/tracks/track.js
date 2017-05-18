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


class Track {

    /**
     * @this
     * @constructor
     * @param {string} name
     * @param {DataSource} dataSource Track's default (original) data source
     * @param {Array<TrackAttribute>} attributes
     * @param {boolean} active Track selection status (i.e. whether the track is selected to be visualized)
     */
    constructor(name, dataSource, attributes, active) {

        this._name = name;
        this._dataSource = dataSource;
        this._attributes = attributes;

        this._active = active;
        this._activeDataSource = dataSource;

        /**
         * Holds track's filtered data source data
         * 
         * @type {FilteredDataSource}
         */
        this._filteredDataSource = undefined;
    }

    get name () { return this._name }
    get dataSource () { return this._dataSource }
    get attributes () { return this._attributes }

    get active () { return this._active }
    set active (active) { this._active = active }
    get activeDataSource () { return this._activeDataSource }
    set activeDataSource (dataSource) { this._activeDataSource = dataSource }
    get filteredDataSource () { return this._filteredDataSource }
    set filteredDataSource (filteredDataSource) { this._filteredDataSource = filteredDataSource }
}