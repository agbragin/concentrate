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


/**
 * Can't use fat arrow syntax in service definition due to:
 * https://github.com/angular/angular.js/issues/14814
 */
angular.module('concentrate')
.service('Striper', function() {
    return {
        /**
         * @param {Array<Band>} bands
         * @param {VisualizationFocus} focus
         * @param {GenomicCoordinateComparator} comparator
         */
        stripe: (bands, focus, comparator) => {

            let comp = (o1, o2) => comparator.compare(o1, o2);

            let pointsHelperMap = bands.map(it => [it.start, it.end]).reduce((points, bandBorders) => {

                points.set(bandBorders[0].toString(), bandBorders[0]);
                points.set(bandBorders[1].toString(), bandBorders[1]);

                return points;
            }, new Map());

            // Compose an ordered list of bands' borders
            let points = Array.from(pointsHelperMap.values()).sort(comp);
            // Search for bearing point inside the borders list
            let focusPointIdx = BinarySearch.index(points, focus.genomicCoordinate, comp);
            // If present we need not to account it while looking up for next left points
            let leftCorrection = !BinarySearch.contains(points, focus.genomicCoordinate, comp);
            // Define a 'visualization horizonts' (every point outside 'atfer them' we threat as Infinity)
            let [leftHorizont, rightHorizont] = [
                focusPointIdx - focus.bordersNumberToTheLeft + (leftCorrection ? 1 : 0),
                focusPointIdx + focus.bordersNumberToTheRight
            ];
            // Safety-clip
            [leftHorizont, rightHorizont] = [
                (leftHorizont < 0) ? 0 : leftHorizont,
                (rightHorizont > (points.length - 1)) ? (points.length - 1) : rightHorizont
            ];

            return bands.map(it => {

                let start = BinarySearch.index(points, it.start, comp);
                let end = BinarySearch.index(points, it.end, comp);
                [start, end] = [
                    (start < leftHorizont) ? -Infinity : (start - leftHorizont),
                    (end > rightHorizont) ? +Infinity : (end - leftHorizont)
                ];

                let properties = it.properties ? it.properties : new Object();
                [properties.start, properties.end] = [it.start, it.end];

                return new Stripe(it.track, it.name, start, end, properties);
            });
        }
    }
});