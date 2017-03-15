angular.module('ghop-ui')
.value('CanvasValues', {
    maxUnitCountPerTrack : 1,
    maxStripeLength : 1,
    genomicCoordinate : null,
    calcHueValue : (index, totalCount) => Math.floor(360 / totalCount * index),
    getTrackIdByName : (name, tracks) => tracks.findIndex(track => track.track === name)
});