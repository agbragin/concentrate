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


angular.module('concentrate')
.service('FilesystemBrowserService', function($http, $log) {

    const rootEndpoint = '/filesystem';

    /**
     * Parses browser folder object from server response
     * 
     * @param {any} res Get content request response resource
     * @returns {BrowserFolder}
     */
    let parseFolderResource = res => {

        let files = res.data['files'].map(it => new BrowserFile(it));
        let folderRefs = new Map();
        res.data['folders'].forEach(it => folderRefs.set(it, res.data['_links'][it]['href']));

        return new BrowserFolder(res.data['path'], files, folderRefs, res.data['isFile']);
    };

    /**
     * Retrieves host filesystem's content for path provided
     * 
     * @param {string} path Target path to retrieve content for
     * @returns {Promise.<BrowserFolder>}
     */
    let getContent = path => {
        return $http.get(`${rootEndpoint}?path=${path}`)
                .then(parseFolderResource, e => Promise.reject(e));
    };

    /**
     * Retrieves host filesystem's content using prebuilt href (e.g. from server resources' links section)
     * 
     * @param {string} href Prebuilt content retrieval href
     * @returns {Promise.<BrowserFolder>}
     */
    let getContentUsing = href => {
        return $http.get(href.substring(href.indexOf(rootEndpoint)))
                .then(parseFolderResource, e => Promise.reject(e));
    };

    return {
        getContent: path => getContent(path),
        getContentUsing: href => getContentUsing(href)
    }
});