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
.service('ReferenceService', function($log, $http, $rootScope, FailedRequestService) {

    let referenceServiceHttpErrorHandler = e => {

        $rootScope.activeReferenceGenome = undefined;
        $rootScope.availableReferenceGenomes = new Array();

        return FailedRequestService.handle(e);
    };

    return {
        discoverGenomes: () => {
            return $http.get('/references').then(
                res => {

                    let referenceGenomes = Array.of();
                    if (res.data && res.data['_embedded'] && res.data['_embedded'].referenceGenomes) {
                        referenceGenomes = res.data['_embedded'].referenceGenomes.map(it => new ReferenceGenome(it.id));
                    }

                    $log.debug(`Found ${referenceGenomes.length} reference genomes: ${referenceGenomes}`);
                    $rootScope.availableReferenceGenomes = referenceGenomes;
                    $rootScope.genomicCoordinateComparator = new GenomicCoordinateComparator($rootScope.availableReferenceGenomes);

                    return referenceGenomes;
                },
                referenceServiceHttpErrorHandler
            );
        },
        discoverContigs: referenceGenome => {
            return $http.get(`/references/${referenceGenome.name}`).then(
                res => {

                    let contigs = Array.of();
                    if (res.data && res.data['_embedded'] && res.data['_embedded'].contigs) {
                        contigs = res.data['_embedded'].contigs.map(it => new Contig(it.id, it.length, referenceGenome));
                    }

                    $log.debug(`Found ${contigs.length} contigs for ${referenceGenome}`);
                    referenceGenome.contigs = contigs;

                    return contigs;
                },
                referenceServiceHttpErrorHandler
            );
        }
    }
});