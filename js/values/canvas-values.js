angular.module('ghop-ui')
.value('CanvasValues', {
    maxUnitCountPerLayer : 1,
    maxStripeLength : 1,
    genomicCoordinate : null,
    calcHueValue : (index, totalCount) => Math.floor(360 / totalCount * index),
    getLayerIdByName : (name, layers) => {

        let layerId = 0;
        layers.forEach((layer, index) => {

            if (layer.track === name) {
                layerId = index;
                return;
            }
        });

        return layerId;
    }
});