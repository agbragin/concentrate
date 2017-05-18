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
     * @param {Array.<Object>} arr
     * @param {Object} val 
     * @param {function(Object, Object):number} comp 
     */
    static index(arr, val, comp) {

        if (comp(val, arr[0]) < 0) {
            return -1;
        }
        if (comp(val, arr[arr.length - 1]) > 0) {
            return arr.length;
        }

        let [left, right] = [0, arr.length - 1];
        let pointer, elem, res;
        while (left <= right) {

            res = pointer = Math.floor((left + right) / 2);
            elem = arr[pointer];
            if (comp(elem, val) < 0) {
                left = pointer + 1;
            }
            else if (comp(elem, val) > 0) {
                right = pointer - 1;
            }
            else {
                return pointer;
            }
        }

        return right;
    }

    /**
     * @static
     * @param {Array.<Object>} arr
     * @param {Object} val 
     * @param {function(Object, Object):number} comp 
     */
    static contains(arr, val, comp) {

        if (comp(val, arr[0]) < 0 || comp(val, arr[arr.length - 1]) > 0) {
            return false;
        }

        let [left, right] = [0, arr.length - 1];
        let pointer, elem, res;
        while (left <= right) {

            res = pointer = Math.floor((left + right) / 2);
            elem = arr[pointer];
            if (comp(elem, val) < 0) {
                left = pointer + 1;
            }
            else if (comp(elem, val) > 0) {
                right = pointer - 1;
            }
            else {
                return true;
            }
        }

        return false;
    }
}