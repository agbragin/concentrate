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


class LocalFile {

    /**
     * @this
     * @constructor
     * @param {string} path Folder's absolute path on the host machine file located in
     * @param {string} name File's name
     */
    constructor(path, name) {

        this._path = path;
        this._name = name;
    }

    get path () { return this._path }
    get name () { return this._name }

    /**
     * Returns an absolute path to the file on the host machine
     * 
     * @this
     * @returns {string}
     */
    getAbsolutePath() {
        return `${this._path}/${this._name}`;
    }

    toString() {
        return this._name;
    }
}