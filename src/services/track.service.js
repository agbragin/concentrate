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
.service('TrackService', function($log, $http, $rootScope, FailedRequestService, VisualizationProperties) {

    const primaryTracks = [
        { name: 'Reference', color: undefined },
        { name: 'Chromosome', color: VisualizationProperties.STRIPE_CHROMOSOME_COLOR }
    ];
    /**
     * TODO: it should be probably moved to the back-end as one of the track's fields
     */
    const primaryTrackNames = primaryTracks.map(it => it.name);

    /**
     * Determines whether the track is primary
     * 
     * @param {string} trackName
     * @returns {boolean}
     */
    let isPrimary = trackName => primaryTrackNames.indexOf(trackName) !== -1;

    /**
     * Determines track color by its name and index
     * 
     * @param {string} trackName
     * @param {number} index Index in the available tracks list
     * @returns {string}
     */
    let getTrackColor = (trackName, index) => {

        let primaryTrack = primaryTracks.find(it => it.name === trackName);
        if (primaryTrack) {
            return primaryTrack.color;
        } else {
            return VisualizationProperties.STRIPE_COLORS[index % VisualizationProperties.STRIPE_COLORS.length];
        }
    };

    let discoverTracks = () => {

        $log.debug('Tracks discovering triggered');

        $http.get('/tracks').then(
            res => {
                if (!res.data || !res.data['_embedded'] || !res.data['_embedded'].tracks) {
                    return Promise.all([]);
                } else {
                    return Promise.all(res.data['_embedded'].tracks
                            .map(it => Promise.all([
                                    Promise.resolve(it.track),
                                    $http.get(`/tracks/${it.track}/dataSource`),
                                    $http.get(`/tracks/${it.track}/attributes`)
                            ])));
                }
            },
            e => {

                $rootScope.availableTracks = new Array();

                return FailedRequestService.handle(e);
            }
        ).then(
            resTuples => {

                $rootScope.availableTracks = resTuples.map(it => {

                    let [trackName, trackDataSourceRes, trackAttributesRes] = it;

                    /** Parse data source resource */
                    let dataSource = new DataSource(trackDataSourceRes.data['id'], trackDataSourceRes.data['type']);

                    /** Parse attributes resource */
                    let attributes = new Array();
                    if (trackAttributesRes.data && trackAttributesRes.data['_embedded'] && trackAttributesRes.data['_embedded'].attributes) {

                        attributes = trackAttributesRes.data['_embedded'].attributes.map(it => {

                            let range;
                            if (it['range']) {
                                range = new TrackAttributeRange(it['range'].lowerBound, it['range'].upperBound, it['range'].inclusionType, it['range'].values);
                            }

                            return new TrackAttribute(it['id'], it['name'], it['type'], it['description'], range, it['filterOperators']);
                        });
                    }

                    return [trackName, dataSource, attributes];
                }).map(it => new Track(...it, isPrimary(it[0]), false, undefined));

                for (let i = 0; i < $rootScope.availableTracks.length; ++i) {
                    $rootScope.availableTracks[i].color = getTrackColor($rootScope.availableTracks[i].name, i);
                }
            },
            e => {

                $rootScope.availableTracks = new Array();

                return FailedRequestService.handle(e);
            }
        );
    };

    /**
     * @param {Track} track
     * @returns {Promise}
     */
    let removeFilter = track => {

        if (!track.filteredDataSource) {
            $log.debug(`Skip filtered data source removing for ${track.name} track as it is missing`);
            return Promise.resolve();
        }

        return $http.delete(`/tracks/${track.name}/filters`).then(
            () => {

                $log.debug(`Filtered ${track.name} track data source of id: ${track.filteredDataSource.id} was successfully removed`);

                /**
                 * @type {Track}
                 */
                let targetTrack = $rootScope.availableTracks.find(it => it.name === track.name);

                targetTrack.filteredDataSource = undefined;
                targetTrack.activeDataSource = targetTrack.dataSource;
                track = targetTrack;

                $log.debug(`${track.name} track's filter successfully removed`);
            },
            e => FailedRequestService.handle(e)
        );
    };

    /**
     * @param {string} trackName
     * @returns {Promise.<Array.<any>>}
     */
    let fetchTrackDetails = trackName => {

        return Promise.all([
            Promise.resolve(trackName),
            $http.get(`/tracks/${trackName}/dataSource`),
            $http.get(`/tracks/${trackName}/attributes`)
        ]);
    };

    /**
     * @param {Array.<any>} resTuple
     * @returns {Track}
     */
    let parseTrackDetails = resTuple => {

        let [trackName, trackDataSourceRes, trackAttributesRes] = resTuple;

        /** Parse data source resource */
        let dataSource = new DataSource(trackDataSourceRes.data['id'], trackDataSourceRes.data['type']);

        /** Parse attributes resource */
        let attributes = new Array();
        if (trackAttributesRes.data && trackAttributesRes.data['_embedded'] && trackAttributesRes.data['_embedded'].attributes) {

            attributes = trackAttributesRes.data['_embedded'].attributes.map(it => {

                let range;
                if (it['range']) {
                    range = new TrackAttributeRange(it['range'].lowerBound, it['range'].upperBound, it['range'].inclusionType, it['range'].values);
                }

                return new TrackAttribute(it['id'], it['name'], it['type'], it['description'], range, it['filterOperators']);
            });
        }

        return new Track(trackName, dataSource, attributes, false, true, VisualizationProperties.STRIPE_COLORS[$rootScope.availableTracks.length % VisualizationProperties.STRIPE_COLORS.length]);
    };

    /**
     * @param {Track} track
     */
    let addTrack = track => {

        $log.debug(`${track.name} track was successfully uploaded`);

        $rootScope.availableTracks.push(track);
    };

    return {
        discoverTracks: discoverTracks,
        /**
         * @param {ReferenceGenome} referenceGenome
         */
        selectReferenceGenome: referenceGenome => {

            return $http.post(`/tracks?genome=${referenceGenome.name}`).then(
                res => {

                    $log.debug(`Chromosome track was created for reference genome: ${referenceGenome.name}`);

                    $rootScope.activeReferenceGenome = referenceGenome;
                    // Discard previous visualization focus
                    $rootScope.focus = undefined;

                    // Trigger track discovery
                    discoverTracks();
                },
                FailedRequestService.handle
            );
        },
        /**
         * @param {string} trackName
         * @param {string} sourceType
         * @param {File} sourceFile
         */
        createFromFile: (trackName, sourceType, sourceFile) => {

            let fd = new FormData();
            fd.append('track', trackName);
            fd.append('type', sourceType);
            fd.append('file', sourceFile);

            return $http({
                method: 'POST',
                url: '/tracks',
                data: fd,
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: angular.identity
            })
            .then(
                () => fetchTrackDetails(trackName),
                e => FailedRequestService.handle(e)
            )
            .then(parseTrackDetails)
            .then(addTrack);
        },
        /**
         * @param {string} trackName
         * @param {string} sourceType
         * @param {string} sourceFilePath
         * @param {string} specFilePath Specification file path on the host machine (for feature files)
         */
        createFromLocalFile: (trackName, sourceType, sourceFilePath, specFilePath = undefined) => {

            return $http.post(`/tracks?track=${trackName}&type=${sourceType}&path=${sourceFilePath}${specFilePath ? `&specPath=${specFilePath}` : ''}`)
                    .then(
                        () => fetchTrackDetails(trackName),
                        e => FailedRequestService.handle(e)
                    )
                    .then(parseTrackDetails)
                    .then(addTrack);
        },
        /**
         * Removes previous filter first, then creates and applies new one
         * 
         * @param {Track} track
         * @param {AttributeAggregate} query
         */
        filter: (track, query) => removeFilter(track).then(
            () => {
                return $http.post(`/tracks/${track.name}/filters`, JSON.stringify(new TrackFilterEntity(query))).then(
                        res => {

                            let filteredDataSource = new FilteredDataSource(res.data['id'], res.data['type'], query);
                            /**
                             * @type {Track}
                             */
                            let targetTrack = $rootScope.availableTracks.find(it => it.name === track.name);

                            targetTrack.filteredDataSource = filteredDataSource;
                            targetTrack.activeDataSource = filteredDataSource;
                            track = targetTrack;

                            $log.debug(`${track.name} track's filter successfully applied`);
                        },
                        e => FailedRequestService.handle(e)
                )
            }
        ),
        disableFilter: track => {

            /**
             * @type {Track}
             */
            let targetTrack = $rootScope.availableTracks.find(it => it.name === track.name);

            targetTrack.activeDataSource = targetTrack.dataSource;
            track = targetTrack;

            $log.debug(`${track.name} track's filter successfully disabled`);

            return Promise.resolve();
        },
        /**
         * @param {Track} track
         */
        removeFilter: track => removeFilter(track),
        /**
         * @param {Track} track
         */
        remove: track => $http.delete(`/tracks/${track.name}`).then(
            () => {

                $log.debug(`${track.name} track was successfully removed`);

                $rootScope.availableTracks.splice($rootScope.availableTracks.indexOf(track), 1);
                $rootScope.$broadcast('updateFocusThenBands');
            },
            e => FailedRequestService.handle(e)
        )
    }
});