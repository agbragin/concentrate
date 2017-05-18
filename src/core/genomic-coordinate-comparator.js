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


class GenomicCoordinateComparator {

    /**
     * @this
     * @constructor
     * @param {Array<ReferenceGenome>} referenceGenomes Reference genome collection comparator is creating for
     */
    constructor(referenceGenomes) {
        this._referenceGenomes = new Map();
        referenceGenomes.forEach(it => this._referenceGenomes.set(it.name, it));
    }

    /**
     * @this
     * @param {GenomicCoordinate} o1
     * @param {GenomicCoordinate} o2
     * @returns {number} Comparison result
     */
    compare(o1, o2) {

        if (!this._referenceGenomes.has(o1.referenceGenomeName)) {
            throw new UnknownReferenceGenomeException(o1.referenceGenomeName);
        }
        if (!this._referenceGenomes.has(o2.referenceGenomeName)) {
            throw new UnknownReferenceGenomeException(o2.referenceGenomeName);
        }

        let referenceGenomeNamesComparisonResult = o1.referenceGenomeName.localeCompare(o2.referenceGenomeName);
        if (referenceGenomeNamesComparisonResult) {
            return referenceGenomeNamesComparisonResult;
        }

        let referenceGenome = this._referenceGenomes.get(o1.referenceGenomeName);
        let o1ContigNameIdx = referenceGenome.contigs.indexOf(o1.contigName);
        if (o1ContigNameIdx === -1) {
            throw new UnknownContigException(referenceGenome, o1.contigName);
        }
        let o2ContigNameIdx = referenceGenome.contigs.indexOf(o2.contigName);
        if (o2ContigNameIdx === -1) {
            throw new UnknownContigException(referenceGenome, o1.contigName);
        }

        if (o1ContigNameIdx !== o2ContigNameIdx) {
            return (o1ContigNameIdx < o2ContigNameIdx) ? -1 : 1;
        }

        return (o1.coordinate == o2.coordinate) ? 0 : ((o1.coordinate < o2.coordinate) ? -1 : 1);
    }
}