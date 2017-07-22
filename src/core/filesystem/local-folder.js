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


class LocalFolder {

    /**
     * @this
     * @constructor
     * @param {string} path Folder's absolute path on the host machine
     * @param {Array.<File>} files Files contained in the folder (only on its root level)
     * @param {Map.<string, string>} folderRefs Mapping from folder names to their hrefs (folders only on its root level)
     * @param {boolean} isFile Whether the object represented by file or folder on the host machine
     */
    constructor(path, files, folderRefs, isFile) {

        this._path = path;
        this._files = files;
        this._folderRefs = folderRefs;
        this._isFile = isFile;
    }

    get path() { return this._path }
    get files () { return this._files }
    get folderRefs () { return this._folderRefs }
    get isFile () { return this._isFile }

    toString() {
        return this._path;
    }
}