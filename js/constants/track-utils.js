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