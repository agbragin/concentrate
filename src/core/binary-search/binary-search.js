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


class BinarySearch {

    /**
     * @static
     * @param {number} a
     * @param {number} b
     * @returns {number}
     */
    static numberComparator(a, b) {
        return (a === b) ? 0 : ((a > b) ? 1 : (-1));
    }

    /**
     * Classic binary search implementation.
     * Returns actual item's index if the array contains it or an index of item next to the last item that is smaller than target searching value.
     * 
     * @static
     * @param {Array.<Object>} arr Target sorted array value should be searched in
     * @param {Object} val Target value to search for
     * @param {function(Object, Object):number} comp Value comparator to use
     * @returns {BinarySearchResult}
     */
    static find(arr, val, comp = BinarySearch.numberComparator) {

        if (!arr.length || comp(val, arr[0]) < 0) {
            return new BinarySearchResult(0, false);
        }

        if (comp(val, arr[arr.length - 1]) > 0) {
            return new BinarySearchResult(arr.length, false);
        }

        let [left, right] = [0, arr.length - 1];
        let pointer, elem, res;
        while (left <= right) {

            res = pointer = Math.floor((left + right) / 2);
            elem = arr[pointer];

            let compRes = comp(elem, val);
            if (compRes < 0) {
                left = pointer + 1;
            } else if (compRes > 0) {
                right = pointer - 1;
            } else {
                return new BinarySearchResult(pointer, true);
            }
        }

        return new BinarySearchResult(right + 1, false);
    }
}