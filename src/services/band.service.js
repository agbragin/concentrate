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
.service('Bander', function($rootScope, $log, $http, FailedRequestService) {

    let defaultConfiguration = () => {

        $rootScope.bands = new Array();
        $rootScope.leftmost = true;
        $rootScope.rightmost = true;
    };

    return {
        /**
         * @param {VisualizationFocus} visualizationFocus
         * @param {Array<number>} dataSourceIds
         */
        discoverBands: (visualizationFocus, dataSourceIds) => {

            $log.debug(`Requesting bands from ${visualizationFocus.genomicCoordinate.referenceGenomeName}:${visualizationFocus.genomicCoordinate.contigName}:${visualizationFocus.genomicCoordinate.coordinate}[${visualizationFocus.bordersNumberToTheLeft}:${visualizationFocus.bordersNumberToTheRight}] for data sources: ${dataSourceIds}`);

            return $http.get(`/bands?contig=${visualizationFocus.genomicCoordinate.contigName}&coord=${visualizationFocus.genomicCoordinate.coordinate}&left=${visualizationFocus.bordersNumberToTheLeft}&right=${visualizationFocus.bordersNumberToTheRight}&dataSources=${dataSourceIds.join(',')}`).then(
                res => {
                    if (res.data && res.data['bands']) {

                        let bandResources = res.data['bands'];
                        $rootScope.bands = bandResources.map(it => new Band(
                                $rootScope.availableTracks.find(t => t.name === it.track),
                                new GenomicCoordinate(it.startCoord.contig.referenceGenome.id, it.startCoord.contig.id, it.startCoord.coord),
                                new GenomicCoordinate(it.endCoord.contig.referenceGenome.id, it.endCoord.contig.id, it.endCoord.coord),
                                it.name,
                                it.properties));

                        $rootScope.leftmost = res.data['leftmost'];
                        $rootScope.rightmost = res.data['rightmost'];
                    } else {
                        defaultConfiguration();
                    }
                },
                e => {

                    defaultConfiguration();

                    return FailedRequestService.handle(e);
                }
            );
        }
    }
});