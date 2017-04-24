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
 *     along with CONC. If not, see <http://www.gnu.org/licenses/>.
 *******************************************************************************/

class TrackUtils {

    static compare(track1, track2, idFieldName = 'track') {
        return (track1[idFieldName] !== undefined) && (track1[idFieldName] === track2[idFieldName]);
    }

    static indexOf(haystack, needle, idFieldName = 'track') {
        
        for (let i = 0; i < haystack.length; i++) {
            if (this.compare(haystack[i], needle, idFieldName)) {
                return i;
            }
        }
        return -1;
    }
}

angular.module('ghop-ui')
.constant('TrackUtils', TrackUtils);